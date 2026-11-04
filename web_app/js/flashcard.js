/**
 * Flashcard SRS Engine
 * Handles 3D Card flips, SRS queues, auto-pronunciation, granular Kanji cards, and hands-free study mode.
 */

class FlashcardEngine {
  constructor() {
    this.deck = [];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.autoPronounce = true;
    this.isAutoPlaying = false;
    this.autoPlayTimer = null;
    this.lessonFilter = 'all'; // 'all' | '第 6 課' | '第 7 課' | '第 8 課' | '第 9 課' | '第 10 課'
    this.category = 'vocab'; // 'all' | 'vocab' | 'kanji' | 'grammar'
    this.kanjiSubType = 'all'; // 'all' | 'on' | 'kun' | 'compound'

    // Khôi phục bộ thẻ và tiến độ hoạt động gần nhất nếu có
    const lastActive = window.storageManager?.getLastActiveDeck();
    if (lastActive) {
      if (lastActive.category) this.category = lastActive.category;
      if (lastActive.lessonFilter) this.lessonFilter = lastActive.lessonFilter;
      if (lastActive.kanjiSubType) this.kanjiSubType = lastActive.kanjiSubType;
    }

    this.cardInner = document.getElementById('flashcard-inner');
    this.cardFront = document.getElementById('card-front');
    this.cardBack = document.getElementById('card-back');
    this.counterEl = document.getElementById('fc-counter');
    this.autoPlayBtn = document.getElementById('btn-fc-autoplay');
    this.autoPronounceBtn = document.getElementById('btn-fc-autopronounce');

    this.initEvents();
    this.initLessonSelector();
    this.initDeckSelector();
  }

  getDeckKey() {
    return `${this.category}_${this.lessonFilter}_${this.kanjiSubType}`;
  }

  saveCurrentProgress() {
    if (!window.storageManager || !this.deck || this.deck.length === 0) return;
    const currentItem = this.deck[this.currentIndex];
    const deckKey = this.getDeckKey();
    window.storageManager.saveFlashcardProgress(deckKey, {
      deckKey,
      category: this.category,
      lessonFilter: this.lessonFilter,
      kanjiSubType: this.kanjiSubType,
      index: this.currentIndex,
      cardId: currentItem ? currentItem.id : null,
      timestamp: Date.now()
    });
  }

  jumpToCard(targetIndex) {
    if (!this.deck || this.deck.length === 0) return;
    const clampedIndex = Math.max(0, Math.min(targetIndex, this.deck.length - 1));
    this.currentIndex = clampedIndex;
    this.resetCardState();
  }

  initLessonSelector() {
    const container = document.getElementById('fc-lesson-selector');
    if (!container) return;

    container.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const lesson = chip.dataset.fcLesson;
        this.setLessonFilter(lesson);
      });
    });
  }

  setLessonFilter(lesson) {
    this.lessonFilter = lesson || 'all';
    this.refreshDeck();
  }

  initDeckSelector() {
    const container = document.getElementById('fc-deck-selector');
    if (!container) return;

    container.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const deckKey = chip.dataset.deck;
        if (deckKey === 'unremembered') {
          this.category = 'unremembered';
          this.kanjiSubType = 'all';
        } else if (deckKey === 'all') {
          this.category = 'all';
          this.kanjiSubType = 'all';
        } else if (deckKey === 'vocab') {
          this.category = 'vocab';
        } else if (deckKey === 'kanji-all') {
          this.category = 'kanji';
          this.kanjiSubType = 'all';
        } else if (deckKey === 'kanji-on') {
          this.category = 'kanji';
          this.kanjiSubType = 'on';
        } else if (deckKey === 'kanji-kun') {
          this.category = 'kanji';
          this.kanjiSubType = 'kun';
        } else if (deckKey === 'kanji-compounds') {
          this.category = 'kanji';
          this.kanjiSubType = 'compound';
        } else if (deckKey === 'grammar') {
          this.category = 'grammar';
        }
        this.refreshDeck();
      });
    });
  }

  loadUnrememberedDeck(lesson = 'all') {
    this.lessonFilter = lesson || 'all';
    this.category = 'unremembered';
    this.kanjiSubType = 'all';
    this.refreshDeck();
  }

  refreshDeck(preservePosition = true) {
    const data = window.APP_DATA;
    if (!data) return;

    let vList = data.vocabulary || [];
    let kList = data.kanji || [];
    let gList = data.grammar || [];

    if (this.lessonFilter && this.lessonFilter !== 'all') {
      vList = vList.filter(v => v.lesson === this.lessonFilter);
      kList = kList.filter(k => k.lesson === this.lessonFilter);
      gList = gList.filter(g => g.lesson === this.lessonFilter);
    }

    if (this.category === 'unremembered') {
      const vCards = vList
        .filter(v => window.storageManager.isUnremembered(v.id))
        .map(v => ({ ...v, category: 'vocab' }));

      const kCards = this.buildKanjiDeck(kList, 'all')
        .filter(k => window.storageManager.isUnremembered(k.id, k.rawKanjiId));

      const gCards = gList
        .filter(g => window.storageManager.isUnremembered(g.id))
        .map(g => ({ ...g, category: 'grammar' }));

      this.deck = [...vCards, ...kCards, ...gCards];
    } else if (this.category === 'all') {
      const vCards = vList.map(v => ({ ...v, category: 'vocab' }));
      const kCards = this.buildKanjiDeck(kList, 'all');
      const gCards = gList.map(g => ({ ...g, category: 'grammar' }));
      this.deck = [...vCards, ...kCards, ...gCards];
    } else if (this.category === 'vocab') {
      this.deck = vList.map(v => ({ ...v, category: 'vocab' }));
    } else if (this.category === 'kanji') {
      this.deck = this.buildKanjiDeck(kList, this.kanjiSubType);
    } else if (this.category === 'grammar') {
      this.deck = gList.map(g => ({ ...g, category: 'grammar' }));
    }

    if (preservePosition && window.storageManager && this.deck.length > 0) {
      const saved = window.storageManager.getFlashcardProgress(this.getDeckKey());
      let targetIndex = -1;
      if (saved && saved.cardId) {
        targetIndex = this.deck.findIndex(card => card.id === saved.cardId);
      }
      if (targetIndex === -1 && saved && typeof saved.index === 'number') {
        if (saved.index >= 0 && saved.index < this.deck.length) {
          targetIndex = saved.index;
        }
      }
      this.currentIndex = targetIndex >= 0 ? targetIndex : 0;
    } else {
      this.currentIndex = 0;
    }

    this.isFlipped = false;
    this.updateSelectorChips();
    this.renderCard();
    this.saveCurrentProgress();
  }

  updateSelectorChips() {
    // 1. Update Lesson Chips
    const lessonContainer = document.getElementById('fc-lesson-selector');
    if (lessonContainer) {
      lessonContainer.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.fcLesson === this.lessonFilter);
      });
    }

    // 2. Update Deck Category Chips with dynamic counts
    const deckContainer = document.getElementById('fc-deck-selector');
    if (deckContainer) {
      const data = window.APP_DATA;
      if (data) {
        let vList = data.vocabulary || [];
        let kList = data.kanji || [];
        let gList = data.grammar || [];

        if (this.lessonFilter && this.lessonFilter !== 'all') {
          vList = vList.filter(v => v.lesson === this.lessonFilter);
          kList = kList.filter(k => k.lesson === this.lessonFilter);
          gList = gList.filter(g => g.lesson === this.lessonFilter);
        }

        const kAll = this.buildKanjiDeck(kList, 'all');
        const kOn = this.buildKanjiDeck(kList, 'on');
        const kKun = this.buildKanjiDeck(kList, 'kun');
        const kCp = this.buildKanjiDeck(kList, 'compound');
        const totalAll = vList.length + kAll.length + gList.length;

        // Calculate unremembered items count
        const unrememberedVocab = vList.filter(v => window.storageManager.isUnremembered(v.id)).length;
        const unrememberedKanji = kAll.filter(k => window.storageManager.isUnremembered(k.id, k.rawKanjiId)).length;
        const unrememberedGrammar = gList.filter(g => window.storageManager.isUnremembered(g.id)).length;
        const totalUnremembered = unrememberedVocab + unrememberedKanji + unrememberedGrammar;

        const countMap = {
          'all': totalAll,
          'unremembered': totalUnremembered,
          'vocab': vList.length,
          'kanji-all': kAll.length,
          'kanji-on': kOn.length,
          'kanji-kun': kKun.length,
          'kanji-compounds': kCp.length,
          'grammar': gList.length
        };

        const labelMap = {
          'all': 'Toàn bộ',
          'unremembered': 'Chưa nhớ',
          'vocab': 'Từ vựng',
          'kanji-all': 'Hán tự',
          'kanji-on': 'Âm On',
          'kanji-kun': 'Âm Kun',
          'kanji-compounds': 'Từ ghép',
          'grammar': 'Ngữ pháp'
        };

        let targetKey = 'vocab';
        if (this.category === 'unremembered') targetKey = 'unremembered';
        else if (this.category === 'all') targetKey = 'all';
        else if (this.category === 'vocab') targetKey = 'vocab';
        else if (this.category === 'grammar') targetKey = 'grammar';
        else if (this.category === 'kanji') {
          if (this.kanjiSubType === 'on') targetKey = 'kanji-on';
          else if (this.kanjiSubType === 'kun') targetKey = 'kanji-kun';
          else if (this.kanjiSubType === 'compound') targetKey = 'kanji-compounds';
          else targetKey = 'kanji-all';
        }

        deckContainer.querySelectorAll('.filter-chip').forEach(chip => {
          const key = chip.dataset.deck;
          chip.classList.toggle('active', key === targetKey);
          if (countMap[key] !== undefined) {
            chip.textContent = `${labelMap[key]} (${countMap[key]})`;
          }
        });

        this.updateUnrememberedBadges(totalUnremembered);
      }
    }
  }

  updateUnrememberedBadges(currentScopeCount = null) {
    const totalCount = window.storageManager.getUnrememberedCount();
    const countToShow = currentScopeCount !== null ? currentScopeCount : totalCount;

    const toolbarCount = document.getElementById('fc-unremembered-toolbar-count');
    const toolbarCountM = document.getElementById('fc-unremembered-toolbar-count-m');
    if (toolbarCount) toolbarCount.textContent = countToShow;
    if (toolbarCountM) toolbarCountM.textContent = countToShow;

    const dashCount = document.getElementById('dash-unremembered-count');
    const dashBanner = document.getElementById('dash-unremembered-banner');
    if (dashCount) dashCount.textContent = totalCount;
    if (dashBanner) dashBanner.style.display = totalCount > 0 ? 'flex' : 'none';

    const vocabBadge = document.getElementById('vocab-unremembered-count');
    if (vocabBadge) {
      const vCount = (window.APP_DATA?.vocabulary || []).filter(v => window.storageManager.isUnremembered(v.id)).length;
      vocabBadge.textContent = vCount;
    }
  }

  initEvents() {
    // Quick action: Review Unremembered Cards
    const reviewUnrememberedBtn = document.getElementById('btn-fc-review-unremembered');
    if (reviewUnrememberedBtn) {
      reviewUnrememberedBtn.addEventListener('click', () => {
        this.category = 'unremembered';
        this.kanjiSubType = 'all';
        this.refreshDeck();
        if (this.deck.length === 0) {
          window.app?.showToast('Bạn hiện không có thẻ nào bị đánh dấu là chưa nhớ!', 'info');
        } else {
          window.soundEngine?.playChip();
          window.app?.showToast(`Đang mở ${this.deck.length} thẻ chưa nhớ cần ôn tập lại!`, 'warning');
        }
      });
    }

    const stage = document.getElementById('flashcard-stage');
    if (stage) {
      stage.addEventListener('click', (e) => {
        // Prevent flipping when clicking internal action buttons (like audio/favorite)
        if (e.target.closest('.no-flip')) return;
        this.flip();
      });
    }

    if (this.autoPronounceBtn) {
      this.autoPronounceBtn.addEventListener('click', () => {
        this.autoPronounce = !this.autoPronounce;
        this.autoPronounceBtn.classList.toggle('active', this.autoPronounce);
        window.soundEngine.playToggle(this.autoPronounce);
        window.app.showToast(this.autoPronounce ? 'Bật tự động phát âm' : 'Tắt tự động phát âm', 'info');
      });
    }

    if (this.autoPlayBtn) {
      this.autoPlayBtn.addEventListener('click', () => {
        this.toggleAutoPlay();
      });
    }

    // Rating buttons
    document.querySelectorAll('.rating-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rating = parseInt(btn.dataset.rating, 10);
        this.rateCard(rating);
      });
    });

    // Prev / Next card buttons
    const prevBtn = document.getElementById('fc-prev-btn');
    const nextBtn = document.getElementById('fc-next-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevCard());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextCard());

    // Shuffle button
    const shuffleBtn = document.getElementById('fc-shuffle-btn');
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => {
        this.shuffleDeck();
        window.soundEngine.playFlip();
        window.app.showToast('Đã trộn ngẫu nhiên danh sách thẻ!', 'info');
      });
    }

    // Jump to card by clicking on counter
    if (this.counterEl) {
      this.counterEl.setAttribute('title', 'Nhấn vào đây để chuyển nhanh tới số thẻ mong muốn');
      this.counterEl.addEventListener('click', () => {
        if (!this.deck || this.deck.length <= 1) return;
        const current = this.currentIndex + 1;
        const total = this.deck.length;
        const input = prompt(`Nhập số thứ tự thẻ muốn học (1 - ${total}):`, current);
        if (input === null) return;
        const num = parseInt(input.trim(), 10);
        if (!isNaN(num) && num >= 1 && num <= total) {
          this.jumpToCard(num - 1);
          window.soundEngine?.playFlip();
          window.app?.showToast(`Đã chuyển đến thẻ ${num} / ${total}`, 'info');
        } else if (input.trim() !== '') {
          window.app?.showToast(`Số thẻ không hợp lệ! Vui lòng nhập số từ 1 đến ${total}`, 'warning');
        }
      });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Only process when flashcard tab or modal is active and not inside input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      const flashcardPanel = document.getElementById('tab-flashcards');
      if (!flashcardPanel || !flashcardPanel.classList.contains('active')) return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.flip();
      } else if (e.key === '1') {
        this.rateCard(1);
      } else if (e.key === '2') {
        this.rateCard(2);
      } else if (e.key === '3') {
        this.rateCard(3);
      } else if (e.key === '4') {
        this.rateCard(4);
      } else if (e.code === 'ArrowLeft') {
        this.prevCard();
      } else if (e.code === 'ArrowRight') {
        this.nextCard();
      } else if (e.key.toLowerCase() === 'p') {
        this.speakCurrent();
      }
    });
  }

  buildKanjiDeck(kanjiList, subType = 'all') {
    const cards = [];
    (kanjiList || []).forEach(k => {
      // 1. Âm On Card
      if ((subType === 'all' || subType === 'on') && k.onyomi && k.onyomi.trim() && k.onyomi !== '—') {
        cards.push({
          id: `${k.id}_on`,
          rawKanjiId: k.id,
          category: 'kanji',
          subType: 'on',
          lesson: k.lesson,
          kanji: k.kanji,
          han_viet: k.han_viet,
          onyomi: k.onyomi,
          kunyomi: k.kunyomi,
          compounds: k.compounds || [],
          examples_raw: k.examples_raw || '',
          speakText: k.onyomi
        });
      }

      // 2. Âm Kun Card (only if kunyomi exists and not '—')
      if ((subType === 'all' || subType === 'kun') && k.kunyomi && k.kunyomi.trim() && k.kunyomi !== '—') {
        cards.push({
          id: `${k.id}_kun`,
          rawKanjiId: k.id,
          category: 'kanji',
          subType: 'kun',
          lesson: k.lesson,
          kanji: k.kanji,
          han_viet: k.han_viet,
          onyomi: k.onyomi,
          kunyomi: k.kunyomi,
          compounds: k.compounds || [],
          examples_raw: k.examples_raw || '',
          speakText: k.kunyomi
        });
      }

      // 3. Compounds Cards (Each compound has its own separate flashcard)
      if (subType === 'all' || subType === 'compound') {
        if (k.compounds && k.compounds.length > 0) {
          k.compounds.forEach((c, idx) => {
            cards.push({
              id: `${k.id}_cp_${idx}`,
              rawKanjiId: k.id,
              category: 'kanji',
              subType: 'compound',
              lesson: k.lesson,
              parentKanji: k.kanji,
              parentHanViet: k.han_viet,
              word: c.word,
              reading: c.reading || '',
              meaning: c.meaning || '',
              speakText: c.reading || c.word
            });
          });
        }
      }
    });
    return cards;
  }

  loadDeck(deck, category = 'vocab', kanjiSubType = 'all') {
    this.category = category;
    this.kanjiSubType = kanjiSubType;

    if (category === 'kanji') {
      if (deck && deck.length > 0 && deck[0].subType) {
        this.deck = deck;
      } else {
        this.deck = this.buildKanjiDeck(deck || [], kanjiSubType);
      }
    } else {
      this.deck = (deck || []).map(item => ({ ...item, category: item.category || category }));
    }

    this.currentIndex = 0;
    this.isFlipped = false;
    this.updateSelectorChips();
    this.renderCard();
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
    this.currentIndex = 0;
    this.isFlipped = false;
    this.renderCard();
    this.saveCurrentProgress();
  }

  flip() {
    if (!this.cardInner) return;
    this.isFlipped = !this.isFlipped;
    this.cardInner.classList.toggle('flipped', this.isFlipped);
    window.soundEngine.playFlip();

    // Chỉ tự động phát âm khi lật sang mặt sau (isFlipped = true)
    if (this.isFlipped && (this.autoPronounce || this.isAutoPlaying)) {
      setTimeout(() => this.speakCurrent(), 120);
    }
  }

  speakCurrent() {
    const item = this.deck[this.currentIndex];
    if (!item) return;

    const cat = item.category || this.category;

    if (cat === 'vocab') {
      window.soundEngine.speakJapanese(item.kana || item.display);
    } else if (cat === 'kanji') {
      if (item.subType === 'on') {
        window.soundEngine.speakJapanese(item.onyomi);
      } else if (item.subType === 'kun') {
        window.soundEngine.speakJapanese(item.kunyomi);
      } else if (item.subType === 'compound') {
        window.soundEngine.speakJapanese(item.reading || item.word);
      } else {
        window.soundEngine.speakJapanese(item.speakText || item.kunyomi || item.onyomi || item.kanji);
      }
    } else if (cat === 'grammar') {
      const textToSpeak = item.formula || item.title;
      window.soundEngine.speakJapanese(textToSpeak);
    }
  }

  rateCard(rating) {
    const item = this.deck[this.currentIndex];
    if (!item) return;

    window.storageManager.recordReview(item.id, rating);
    if (item.rawKanjiId && rating >= 3) {
      window.storageManager.markUnremembered(item.rawKanjiId, false);
    }
    if (window.soundEngine && window.soundEngine.playRating) {
      window.soundEngine.playRating(rating);
    } else if (rating >= 3) {
      window.soundEngine.playCorrect();
    } else {
      window.soundEngine.playWrong();
    }

    // If currently in 'unremembered' deck mode and card was remembered (rating >= 3)
    if (this.category === 'unremembered' && rating >= 3) {
      this.deck.splice(this.currentIndex, 1);
      if (this.currentIndex >= this.deck.length) {
        this.currentIndex = 0;
      }
      this.updateSelectorChips();
      this.resetCardState();
      return;
    }

    this.updateSelectorChips();
    // Automatically transition to next card
    this.nextCard();
  }

  nextCard() {
    if (this.deck.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.deck.length;
    this.resetCardState();
  }

  prevCard() {
    if (this.deck.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.deck.length) % this.deck.length;
    this.resetCardState();
  }

  resetCardState() {
    this.isFlipped = false;
    if (this.cardInner) {
      this.cardInner.classList.remove('flipped');
    }
    this.renderCard();
    this.saveCurrentProgress();
  }

  renderCard() {
    if (this.deck.length === 0) {
      if (this.counterEl) this.counterEl.innerHTML = '0 / 0';
      if (this.cardFront) {
        if (this.category === 'unremembered') {
          this.cardFront.innerHTML = `
            <div class="card-main-content" style="text-align: center; padding: 2rem 1rem;">
              <div style="font-size: 3.2rem; margin-bottom: 0.75rem;">🎉</div>
              <h3 style="color: var(--text-heading); font-size: 1.25rem; margin-bottom: 0.5rem; font-weight: 800;">Tuyệt vời! Không còn từ chưa nhớ!</h3>
              <p style="color: var(--text-secondary); font-size: 0.9rem; max-width: 320px; line-height: 1.5; margin: 0 auto 1.25rem;">
                Bạn đã ôn thuộc toàn bộ danh sách thẻ chưa nhớ. Hãy tiếp tục duy trì phong độ nhé!
              </p>
              <button class="btn btn-primary btn-sm no-flip" id="btn-fc-reset-to-all" style="margin: 0 auto;">
                Chuyển sang học toàn bộ thẻ
              </button>
            </div>`;
          const resetBtn = this.cardFront.querySelector('#btn-fc-reset-to-all');
          if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              this.category = 'all';
              this.refreshDeck();
            });
          }
        } else {
          this.cardFront.innerHTML = `
            <div class="card-main-content">
              <h3 style="color: var(--text-muted);">Không tìm thấy thẻ nào theo bộ lọc này</h3>
            </div>`;
        }
      }
      if (this.cardBack) {
        this.cardBack.innerHTML = '';
      }
      return;
    }

    if (this.currentIndex < 0 || this.currentIndex >= this.deck.length) {
      this.currentIndex = 0;
    }

    const item = this.deck[this.currentIndex];
    const lessonLabel = item.lesson ? ` <span class="counter-lesson">(${item.lesson})</span>` : '';
    if (this.counterEl) {
      this.counterEl.innerHTML = `Thẻ <strong>${this.currentIndex + 1}</strong> / ${this.deck.length}${lessonLabel}`;
    }

    const isFav = window.storageManager.isFavorite(item.id);
    const isLearned = window.storageManager.isLearned(item.id);
    const cat = item.category || this.category;

    if (cat === 'vocab') {
      this.renderVocabCard(item, isFav, isLearned);
    } else if (cat === 'kanji') {
      this.renderKanjiCard(item, isFav, isLearned);
    } else if (cat === 'grammar') {
      this.renderGrammarCard(item, isFav, isLearned);
    }
  }

  renderVocabCard(item, isFav, isLearned) {
    const isUnremembered = window.storageManager.isUnremembered(item.id);
    // Front Face (Không hiện phiên âm / cách đọc)
    this.cardFront.innerHTML = `
      <div class="card-badge-row">
        <span class="badge">${item.lesson} • ${item.part}</span>
        <div style="display: flex; gap: 0.4rem; align-items: center;" class="no-flip">
          ${isLearned ? '<span class="badge">Đã thuộc</span>' : ''}
          <button class="icon-btn no-flip unremembered-toggle-btn ${isUnremembered ? 'active' : ''}" data-id="${item.id}" title="${isUnremembered ? 'Bỏ đánh dấu chưa nhớ' : 'Đánh dấu chưa nhớ để ôn lại'}">
            Chưa nhớ
          </button>
          <button class="icon-btn no-flip fav-toggle-btn ${isFav ? 'active' : ''}" data-id="${item.id}" title="Đánh dấu">
            ${isFav ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>
      <div class="card-main-content">
        <div class="card-kanji-big">${item.kanji || item.kana}</div>
      </div>
      <div class="card-flip-prompt">
        <span>Chạm vào thẻ để xem nghĩa (hoặc Space)</span>
      </div>
    `;

    // Back Face (Hiện cách đọc, nghĩa tiếng Việt và nút phát âm)
    this.cardBack.innerHTML = `
      <div class="card-badge-row">
        <span class="badge">${item.lesson}</span>
        <div style="display: flex; gap: 0.4rem; align-items: center;" class="no-flip">
          <button class="icon-btn no-flip unremembered-toggle-btn ${isUnremembered ? 'active' : ''}" data-id="${item.id}" title="${isUnremembered ? 'Bỏ đánh dấu chưa nhớ' : 'Đánh dấu chưa nhớ để ôn lại'}">
            Chưa nhớ
          </button>
          <button class="icon-btn no-flip tts-btn" title="Nghe phát âm">Phát âm</button>
        </div>
      </div>
      <div class="card-main-content">
        <div class="card-kana-sub" style="font-size: 2rem; font-weight: 700; color: var(--text-heading); margin-bottom: 0.5rem;">${item.kana}</div>
        <div class="card-meaning-big">${item.meaning}</div>
        ${item.kanji ? `<div class="badge" style="font-size: 0.9rem; padding: 0.35rem 0.75rem; margin-top: 0.5rem;">Hán tự: ${item.kanji}</div>` : ''}
      </div>
      <div class="card-flip-prompt">
        <span>Đánh giá độ nhớ để xếp lịch ôn tập</span>
      </div>
    `;

    this.attachCardActions(item);
  }

  renderKanjiCard(item, isFav, isLearned) {
    if (item.subType === 'on') {
      this.renderKanjiOnCard(item, isFav, isLearned);
    } else if (item.subType === 'kun') {
      this.renderKanjiKunCard(item, isFav, isLearned);
    } else if (item.subType === 'compound') {
      this.renderKanjiCompoundCard(item, isFav, isLearned);
    } else {
      this.renderLegacyKanjiCard(item, isFav, isLearned);
    }
  }

  // 1. Thẻ học riêng Âm On
  renderKanjiOnCard(item, isFav, isLearned) {
    const isUnremembered = window.storageManager.isUnremembered(item.id, item.rawKanjiId);
    // Front Face (Chỉ hiện chữ Hán, âm Hán-Việt, tuyệt đối không hiện âm On)
    this.cardFront.innerHTML = `
      <div class="card-badge-row">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="badge">${item.lesson}</span>
          <span class="badge">Âm On (音読み)</span>
        </div>
        <div style="display: flex; gap: 0.4rem; align-items: center;" class="no-flip">
          ${isLearned ? '<span class="badge">Đã thuộc</span>' : ''}
          <button class="icon-btn no-flip unremembered-toggle-btn ${isUnremembered ? 'active' : ''}" data-id="${item.id}" title="${isUnremembered ? 'Bỏ đánh dấu chưa nhớ' : 'Đánh dấu chưa nhớ để ôn lại'}">
            Chưa nhớ
          </button>
          <button class="icon-btn no-flip fav-toggle-btn ${isFav ? 'active' : ''}" data-id="${item.id}">
            ${isFav ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>
      <div class="card-main-content">
        <div class="card-kanji-big" style="font-size: 4rem;">${item.kanji}</div>
        <div class="card-hanviet-tag">Hán-Việt: ${item.han_viet}</div>
        <div style="margin-top: 1rem; font-size: 1.05rem; font-weight: 600; color: var(--text-secondary);">
          Âm On của chữ Hán này là gì?
        </div>
      </div>
      <div class="card-flip-prompt">
        <span>Chạm vào thẻ để xem âm On (hoặc Space)</span>
      </div>
    `;

    // Back Face (Hiện Katakana âm On và các từ ghép sử dụng âm On này)
    const compoundsList = item.compounds && item.compounds.length > 0
      ? item.compounds.slice(0, 3).map(c => `
          <div class="detail-line">
            <span class="detail-label">${c.word} (${c.reading}):</span>
            <span>${c.meaning}</span>
          </div>
        `).join('')
      : (item.examples_raw ? `<div class="detail-line">${item.examples_raw}</div>` : '');

    this.cardBack.innerHTML = `
      <div class="card-badge-row">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="badge">${item.lesson} • ${item.han_viet}</span>
          <span class="badge">Âm On</span>
        </div>
        <div style="display: flex; gap: 0.4rem; align-items: center;" class="no-flip">
          <button class="icon-btn no-flip unremembered-toggle-btn ${isUnremembered ? 'active' : ''}" data-id="${item.id}" title="${isUnremembered ? 'Bỏ đánh dấu chưa nhớ' : 'Đánh dấu chưa nhớ để ôn lại'}">
            Chưa nhớ
          </button>
          <button class="icon-btn no-flip tts-btn">Phát âm</button>
        </div>
      </div>
      <div class="card-main-content" style="align-items: stretch; text-align: left;">
        <div style="text-align: center; margin-bottom: 0.75rem;">
          <div style="font-size: 0.82rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.25rem;">Âm On (Katakana):</div>
          <div style="font-size: 2.6rem; font-weight: 800; color: var(--text-heading); font-family: var(--font-jp);">
            ${item.onyomi}
          </div>
          <div style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 0.25rem;">
            Chữ gốc: <strong style="color: var(--text-primary);">${item.kanji}</strong> (${item.han_viet})
          </div>
        </div>

        ${compoundsList ? `
          <div class="card-extra-details">
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.4rem; text-transform: uppercase; font-weight: 700;">Ví dụ từ ghép sử dụng âm này:</div>
            ${compoundsList}
          </div>
        ` : ''}
      </div>
      <div class="card-flip-prompt">
        <span>Đánh giá độ nhớ để xếp lịch ôn tập</span>
      </div>
    `;

    this.attachCardActions(item);
  }

  // 2. Thẻ học riêng Âm Kun
  renderKanjiKunCard(item, isFav, isLearned) {
    const isUnremembered = window.storageManager.isUnremembered(item.id, item.rawKanjiId);
    // Front Face (Chỉ hiện chữ Hán, âm Hán-Việt, tuyệt đối không hiện âm Kun)
    this.cardFront.innerHTML = `
      <div class="card-badge-row">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="badge">${item.lesson}</span>
          <span class="badge">Âm Kun (訓読み)</span>
        </div>
        <div style="display: flex; gap: 0.4rem; align-items: center;" class="no-flip">
          ${isLearned ? '<span class="badge">Đã thuộc</span>' : ''}
          <button class="icon-btn no-flip unremembered-toggle-btn ${isUnremembered ? 'active' : ''}" data-id="${item.id}" title="${isUnremembered ? 'Bỏ đánh dấu chưa nhớ' : 'Đánh dấu chưa nhớ để ôn lại'}">
            Chưa nhớ
          </button>
          <button class="icon-btn no-flip fav-toggle-btn ${isFav ? 'active' : ''}" data-id="${item.id}">
            ${isFav ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>
      <div class="card-main-content">
        <div class="card-kanji-big" style="font-size: 4rem;">${item.kanji}</div>
        <div class="card-hanviet-tag">Hán-Việt: ${item.han_viet}</div>
        <div style="margin-top: 1rem; font-size: 1.05rem; font-weight: 600; color: var(--text-secondary);">
          Âm Kun của chữ Hán này là gì?
        </div>
      </div>
      <div class="card-flip-prompt">
        <span>Chạm vào thẻ để xem âm Kun (hoặc Space)</span>
      </div>
    `;

    // Back Face (Hiện Hiragana âm Kun và ngữ cảnh sử dụng)
    const kunCompound = item.compounds ? item.compounds.find(c => c.reading && c.reading.includes(item.kunyomi.replace(/[-.]/g, ''))) : null;

    this.cardBack.innerHTML = `
      <div class="card-badge-row">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="badge">${item.lesson} • ${item.han_viet}</span>
          <span class="badge">Âm Kun</span>
        </div>
        <div style="display: flex; gap: 0.4rem; align-items: center;" class="no-flip">
          <button class="icon-btn no-flip unremembered-toggle-btn ${isUnremembered ? 'active' : ''}" data-id="${item.id}" title="${isUnremembered ? 'Bỏ đánh dấu chưa nhớ' : 'Đánh dấu chưa nhớ để ôn lại'}">
            Chưa nhớ
          </button>
          <button class="icon-btn no-flip tts-btn">Phát âm</button>
        </div>
      </div>
      <div class="card-main-content" style="align-items: stretch; text-align: left;">
        <div style="text-align: center; margin-bottom: 0.75rem;">
          <div style="font-size: 0.82rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.25rem;">Âm Kun (Hiragana):</div>
          <div style="font-size: 2.6rem; font-weight: 800; color: var(--text-heading); font-family: var(--font-jp);">
            ${item.kunyomi}
          </div>
          <div style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 0.25rem;">
            Chữ gốc: <strong style="color: var(--text-primary);">${item.kanji}</strong> (${item.han_viet})
          </div>
        </div>

        ${kunCompound ? `
          <div class="card-extra-details">
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.4rem; text-transform: uppercase; font-weight: 700;">Ví dụ từ ghép thuần Nhật liên quan:</div>
            <div class="detail-line">
              <span class="detail-label">${kunCompound.word} (${kunCompound.reading}):</span>
              <span>${kunCompound.meaning}</span>
            </div>
          </div>
        ` : ''}
      </div>
      <div class="card-flip-prompt">
        <span>Đánh giá độ nhớ để xếp lịch ôn tập</span>
      </div>
    `;

    this.attachCardActions(item);
  }

  // 3. Thẻ học riêng từng Từ Liên Quan (Từ Ghép)
  renderKanjiCompoundCard(item, isFav, isLearned) {
    const isUnremembered = window.storageManager.isUnremembered(item.id, item.rawKanjiId);
    // Front Face (Chỉ hiện chữ Hán từ ghép và gốc Kanji, không hiện cách đọc hay nghĩa)
    this.cardFront.innerHTML = `
      <div class="card-badge-row">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="badge">${item.lesson}</span>
          <span class="badge">Từ Ghép Hán Tự</span>
        </div>
        <div style="display: flex; gap: 0.4rem; align-items: center;" class="no-flip">
          ${isLearned ? '<span class="badge">Đã thuộc</span>' : ''}
          <button class="icon-btn no-flip unremembered-toggle-btn ${isUnremembered ? 'active' : ''}" data-id="${item.id}" title="${isUnremembered ? 'Bỏ đánh dấu chưa nhớ' : 'Đánh dấu chưa nhớ để ôn lại'}">
            Chưa nhớ
          </button>
          <button class="icon-btn no-flip fav-toggle-btn ${isFav ? 'active' : ''}" data-id="${item.id}">
            ${isFav ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>
      <div class="card-main-content">
        <div class="card-kanji-big" style="font-size: 3.2rem; color: var(--text-heading); font-weight: 800; letter-spacing: 0.05em;">
          ${item.word}
        </div>
        <div class="badge" style="font-size: 0.9rem; padding: 0.35rem 0.75rem; margin-top: 0.75rem;">
          Gốc Hán Tự: ${item.parentKanji} (${item.parentHanViet})
        </div>
        <div style="margin-top: 1rem; font-size: 1rem; color: var(--text-secondary);">
          Từ này phát âm là gì và mang ý nghĩa gì?
        </div>
      </div>
      <div class="card-flip-prompt">
        <span>Chạm vào thẻ để xem cách đọc & nghĩa</span>
      </div>
    `;

    // Back Face (Hiện cách đọc Hiragana, nghĩa tiếng Việt, chữ Hán và phát âm)
    this.cardBack.innerHTML = `
      <div class="card-badge-row">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="badge">${item.parentKanji} (${item.parentHanViet})</span>
          <span class="badge">${item.lesson}</span>
        </div>
        <div style="display: flex; gap: 0.4rem; align-items: center;" class="no-flip">
          <button class="icon-btn no-flip unremembered-toggle-btn ${isUnremembered ? 'active' : ''}" data-id="${item.id}" title="${isUnremembered ? 'Bỏ đánh dấu chưa nhớ' : 'Đánh dấu chưa nhớ để ôn lại'}">
            Chưa nhớ
          </button>
          <button class="icon-btn no-flip tts-btn">Phát âm</button>
        </div>
      </div>
      <div class="card-main-content">
        <div class="card-kana-sub" style="font-size: 2.2rem; font-weight: 800; color: var(--text-heading); margin-bottom: 0.5rem; font-family: var(--font-jp);">
          ${item.reading || item.word}
        </div>
        <div class="card-meaning-big" style="font-size: 1.6rem; margin-bottom: 0.75rem;">
          ${item.meaning}
        </div>
        <div class="badge" style="font-size: 0.9rem; padding: 0.35rem 0.75rem;">
          Chữ Hán: ${item.word} • Gốc: ${item.parentKanji} (${item.parentHanViet})
        </div>
      </div>
      <div class="card-flip-prompt">
        <span>Đánh giá độ nhớ để xếp lịch ôn tập</span>
      </div>
    `;

    this.attachCardActions(item);
  }

  renderLegacyKanjiCard(item, isFav, isLearned) {
    const isUnremembered = window.storageManager.isUnremembered(item.id, item.rawKanjiId);
    // Fallback if needed
    this.cardFront.innerHTML = `
      <div class="card-badge-row">
        <span class="badge">${item.lesson}</span>
        <div style="display: flex; gap: 0.4rem; align-items: center;" class="no-flip">
          ${isLearned ? '<span class="badge">Đã thuộc</span>' : ''}
          <button class="icon-btn no-flip unremembered-toggle-btn ${isUnremembered ? 'active' : ''}" data-id="${item.id}" title="${isUnremembered ? 'Bỏ đánh dấu chưa nhớ' : 'Đánh dấu chưa nhớ để ôn lại'}">
            Chưa nhớ
          </button>
          <button class="icon-btn no-flip fav-toggle-btn ${isFav ? 'active' : ''}" data-id="${item.id}">
            ${isFav ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>
      <div class="card-main-content">
        <div class="card-kanji-big">${item.kanji}</div>
        <div class="card-hanviet-tag">${item.han_viet}</div>
      </div>
      <div class="card-flip-prompt">
        <span>Xem âm On, Kun & Từ ghép ví dụ</span>
      </div>
    `;

    const compoundsHtml = item.compounds && item.compounds.length > 0
      ? item.compounds.slice(0, 4).map(c => `
          <div class="detail-line">
            <span class="detail-label">${c.word} ${c.reading ? `(${c.reading})` : ''}:</span>
            <span>${c.meaning}</span>
          </div>
        `).join('')
      : `<div class="detail-line">${item.examples_raw}</div>`;

    this.cardBack.innerHTML = `
      <div class="card-badge-row">
        <span class="badge">${item.han_viet}</span>
        <div style="display: flex; gap: 0.4rem; align-items: center;" class="no-flip">
          <button class="icon-btn no-flip unremembered-toggle-btn ${isUnremembered ? 'active' : ''}" data-id="${item.id}" title="${isUnremembered ? 'Bỏ đánh dấu chưa nhớ' : 'Đánh dấu chưa nhớ để ôn lại'}">
            Chưa nhớ
          </button>
          <button class="icon-btn no-flip tts-btn">Phát âm</button>
        </div>
      </div>
      <div class="card-main-content" style="align-items: stretch; text-align: left;">
        <div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem; justify-content: center;">
          <div class="badge" style="font-size: 0.85rem;">音 (On): <strong>${item.onyomi || '—'}</strong></div>
          <div class="badge" style="font-size: 0.85rem;">訓 (Kun): <strong>${item.kunyomi || '—'}</strong></div>
        </div>
        <div class="card-extra-details">
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.4rem; text-transform: uppercase; font-weight: 700;">Từ ghép ví dụ:</div>
          ${compoundsHtml}
        </div>
      </div>
      <div class="card-flip-prompt">
        <span>Đánh giá độ nhớ</span>
      </div>
    `;

    this.attachCardActions(item);
  }

  renderGrammarCard(item, isFav, isLearned) {
    const isUnremembered = window.storageManager.isUnremembered(item.id);
    const cleanMeaning = (item.title || '')
      .replace(/^\d+[\.\s]*/, '')
      .replace(/[:：\s]+$/, '')
      .trim();

    // Front Face (Chỉ hiển thị ý nghĩa của cấu trúc để người học tự nhớ công thức tiếng Nhật)
    this.cardFront.innerHTML = `
      <div class="card-badge-row">
        <span class="badge">${item.lesson}</span>
        <div style="display: flex; gap: 0.4rem; align-items: center;" class="no-flip">
          ${isLearned ? '<span class="badge">Đã thuộc</span>' : ''}
          <button class="icon-btn no-flip unremembered-toggle-btn ${isUnremembered ? 'active' : ''}" data-id="${item.id}" title="${isUnremembered ? 'Bỏ đánh dấu chưa nhớ' : 'Đánh dấu chưa nhớ để ôn lại'}">
            Chưa nhớ
          </button>
          <button class="icon-btn no-flip fav-toggle-btn ${isFav ? 'active' : ''}" data-id="${item.id}">
            ${isFav ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>
      <div class="card-main-content">
        <div class="card-meaning-big" style="font-size: 2.1rem; font-weight: 800; color: var(--text-heading); line-height: 1.4; text-align: center; max-width: 620px; margin: 0 auto 0.75rem;">
          ${cleanMeaning}
        </div>
        <div style="font-size: 0.95rem; color: var(--text-secondary); font-weight: 500; text-align: center;">
          Cấu trúc ngữ pháp tiếng Nhật tương ứng là gì?
        </div>
      </div>
      <div class="card-flip-prompt">
        <span>Chạm vào thẻ để xem cấu trúc, nghĩa & ví dụ (hoặc Space)</span>
      </div>
    `;

    const exHtml = item.examples && item.examples.length > 0
      ? item.examples.map(ex => {
          const cleanEx = ex.replace(/^例:\s*/, '').trim();
          return `<div class="detail-line" style="font-family: var(--font-jp); font-size: 0.92rem; line-height: 1.5; margin-bottom: 0.35rem;">• ${cleanEx}</div>`;
        }).join('')
      : '';

    // Back Face (Hiển thị công thức nổi bật, nghĩa/giải thích và câu ví dụ minh họa)
    this.cardBack.innerHTML = `
      <div class="card-badge-row">
        <span class="badge">${item.lesson}</span>
        <div style="display: flex; gap: 0.4rem; align-items: center;" class="no-flip">
          <button class="icon-btn no-flip unremembered-toggle-btn ${isUnremembered ? 'active' : ''}" data-id="${item.id}" title="${isUnremembered ? 'Bỏ đánh dấu chưa nhớ' : 'Đánh dấu chưa nhớ để ôn lại'}">
            Chưa nhớ
          </button>
          <button class="icon-btn no-flip tts-btn" title="Nghe phát âm cấu trúc">Phát âm</button>
        </div>
      </div>
      <div class="card-main-content" style="align-items: stretch; text-align: left; width: 100%;">
        <div style="text-align: center; margin-bottom: 0.85rem;">
          <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 0.35rem; letter-spacing: 0.05em;">
            Cấu trúc / Công thức
          </div>
          <div class="grammar-formula-badge" style="font-size: 1.45rem; font-weight: 800; padding: 0.65rem 1.25rem; font-family: var(--font-jp); color: var(--text-heading); display: inline-block; margin-bottom: 0.4rem; border-radius: 10px;">
            ${item.formula || '—'}
          </div>
          <div style="font-size: 1.15rem; font-weight: 700; color: var(--primary); margin-top: 0.2rem;">
            ${cleanMeaning}
          </div>
        </div>

        ${item.points ? `
          <div class="grammar-point-box" style="margin-bottom: 0.75rem; font-size: 0.92rem; line-height: 1.55;">
            <strong style="color: var(--text-heading);">Giải thích:</strong> ${item.points}
          </div>
        ` : ''}

        ${exHtml ? `
          <div class="card-extra-details" style="max-height: 180px; overflow-y: auto;">
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.4rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.04em;">Ví dụ minh họa:</div>
            ${exHtml}
          </div>
        ` : ''}
      </div>
      <div class="card-flip-prompt">
        <span>Đánh giá độ nhớ để xếp lịch ôn tập</span>
      </div>
    `;

    this.attachCardActions(item);
  }

  attachCardActions(item) {
    // Attach Audio buttons
    document.querySelectorAll('.tts-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.speakCurrent();
      });
    });

    // Attach Favorite button
    document.querySelectorAll('.fav-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const active = window.storageManager.toggleFavorite(item.id);
        btn.classList.toggle('active', active);
        btn.innerHTML = active ? 'Đã lưu' : 'Lưu';
        window.soundEngine.playFavorite(active);
        window.app.showToast(active ? 'Đã thêm vào mục yêu thích!' : 'Đã bỏ yêu thích', 'info');
      });
    });

    // Attach Unremembered toggle button
    document.querySelectorAll('.unremembered-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = item.rawKanjiId || item.id;
        const active = window.storageManager.toggleUnremembered(targetId);
        // Update all unremembered buttons on current card
        document.querySelectorAll('.unremembered-toggle-btn').forEach(b => {
          b.classList.toggle('active', active);
          b.innerHTML = 'Chưa nhớ';
          b.title = active ? 'Bỏ đánh dấu chưa nhớ' : 'Đánh dấu chưa nhớ để ôn lại';
        });
        window.soundEngine.playToggle(active);
        window.app.showToast(active ? 'Đã thêm vào danh sách Chưa nhớ để ôn tập!' : 'Đã bỏ đánh dấu chưa nhớ', active ? 'warning' : 'info');
        this.updateSelectorChips();
        if (window.app && typeof window.app.updateStats === 'function') {
          window.app.updateStats();
        }
      });
    });
  }

  // Hands-free Auto-play Mode
  toggleAutoPlay() {
    this.isAutoPlaying = !this.isAutoPlaying;
    window.soundEngine.playToggle(this.isAutoPlaying);
    if (this.autoPlayBtn) {
      this.autoPlayBtn.classList.toggle('btn-primary', this.isAutoPlaying);
      this.autoPlayBtn.classList.toggle('btn-secondary', !this.isAutoPlaying);
      this.autoPlayBtn.innerHTML = this.isAutoPlaying ? 'Tạm dừng' : 'Chạy tự động';
    }

    if (this.isAutoPlaying) {
      window.app.showToast('Bắt đầu chế độ học tự động!', 'success');
      this.runAutoPlayCycle();
    } else {
      if (this.autoPlayTimer) clearTimeout(this.autoPlayTimer);
      window.app.showToast('Đã dừng chế độ học tự động', 'info');
    }
  }

  runAutoPlayCycle() {
    if (!this.isAutoPlaying) return;
    // Mặt trước: HOÀN TOÀN YÊN LẶNG (không đọc từ), dừng 3s để người học tự suy nghĩ
    this.autoPlayTimer = setTimeout(() => {
      if (!this.isAutoPlaying) return;
      this.flip(); // Lật sang mặt sau (flip() sẽ tự động phát âm từ ở mặt sau)

      // Dừng 3.5 giây ở mặt sau để người học xem nghĩa, cách đọc và nghe phát âm
      this.autoPlayTimer = setTimeout(() => {
        if (!this.isAutoPlaying) return;
        this.nextCard(); // Chuyển sang thẻ mới (mặt trước hoàn toàn yên lặng)
        this.runAutoPlayCycle();
      }, 3500);
    }, 3000);
  }
}

window.FlashcardEngine = FlashcardEngine;
