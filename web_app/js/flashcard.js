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
    this.category = 'vocab'; // 'vocab' | 'kanji' | 'grammar'
    this.kanjiSubType = 'all'; // 'all' | 'on' | 'kun' | 'compound'

    this.cardInner = document.getElementById('flashcard-inner');
    this.cardFront = document.getElementById('card-front');
    this.cardBack = document.getElementById('card-back');
    this.counterEl = document.getElementById('fc-counter');
    this.autoPlayBtn = document.getElementById('btn-fc-autoplay');
    this.autoPronounceBtn = document.getElementById('btn-fc-autopronounce');

    this.initEvents();
    this.initDeckSelector();
  }

  initDeckSelector() {
    const container = document.getElementById('fc-deck-selector');
    if (!container) return;

    container.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const deckKey = chip.dataset.deck;
        if (deckKey === 'vocab') {
          this.loadDeck(window.APP_DATA.vocabulary, 'vocab');
        } else if (deckKey === 'kanji-all') {
          this.loadDeck(window.APP_DATA.kanji, 'kanji', 'all');
        } else if (deckKey === 'kanji-on') {
          this.loadDeck(window.APP_DATA.kanji, 'kanji', 'on');
        } else if (deckKey === 'kanji-kun') {
          this.loadDeck(window.APP_DATA.kanji, 'kanji', 'kun');
        } else if (deckKey === 'kanji-compounds') {
          this.loadDeck(window.APP_DATA.kanji, 'kanji', 'compound');
        } else if (deckKey === 'grammar') {
          this.loadDeck(window.APP_DATA.grammar, 'grammar');
        }
      });
    });
  }

  updateDeckSelectorChips() {
    const container = document.getElementById('fc-deck-selector');
    if (!container) return;

    let targetKey = 'vocab';
    if (this.category === 'vocab') {
      targetKey = 'vocab';
    } else if (this.category === 'grammar') {
      targetKey = 'grammar';
    } else if (this.category === 'kanji') {
      if (this.kanjiSubType === 'on') targetKey = 'kanji-on';
      else if (this.kanjiSubType === 'kun') targetKey = 'kanji-kun';
      else if (this.kanjiSubType === 'compound') targetKey = 'kanji-compounds';
      else targetKey = 'kanji-all';
    }

    container.querySelectorAll('.filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.deck === targetKey);
    });
  }

  initEvents() {
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
      this.deck = deck || [];
    }

    this.currentIndex = 0;
    this.isFlipped = false;
    this.updateDeckSelectorChips();
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

    if (this.category === 'vocab') {
      window.soundEngine.speakJapanese(item.kana || item.display);
    } else if (this.category === 'kanji') {
      if (item.subType === 'on') {
        window.soundEngine.speakJapanese(item.onyomi);
      } else if (item.subType === 'kun') {
        window.soundEngine.speakJapanese(item.kunyomi);
      } else if (item.subType === 'compound') {
        window.soundEngine.speakJapanese(item.reading || item.word);
      } else {
        window.soundEngine.speakJapanese(item.speakText || item.kunyomi || item.onyomi || item.kanji);
      }
    } else if (this.category === 'grammar') {
      const textToSpeak = item.formula || item.title;
      window.soundEngine.speakJapanese(textToSpeak);
    }
  }

  rateCard(rating) {
    const item = this.deck[this.currentIndex];
    if (!item) return;

    window.storageManager.recordReview(item.id, rating);
    if (rating >= 3) {
      window.soundEngine.playCorrect();
    } else {
      window.soundEngine.playWrong();
    }

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
  }

  renderCard() {
    if (this.deck.length === 0) {
      if (this.counterEl) this.counterEl.innerHTML = '0 / 0';
      if (this.cardFront) {
        this.cardFront.innerHTML = `
          <div class="card-main-content">
            <h3 style="color: var(--text-muted);">Không tìm thấy thẻ nào theo bộ lọc này</h3>
          </div>`;
      }
      if (this.cardBack) {
        this.cardBack.innerHTML = '';
      }
      return;
    }

    const item = this.deck[this.currentIndex];
    if (this.counterEl) {
      this.counterEl.innerHTML = `Thẻ <strong>${this.currentIndex + 1}</strong> / ${this.deck.length}`;
    }

    const isFav = window.storageManager.isFavorite(item.id);
    const isLearned = window.storageManager.isLearned(item.id);

    if (this.category === 'vocab') {
      this.renderVocabCard(item, isFav, isLearned);
    } else if (this.category === 'kanji') {
      this.renderKanjiCard(item, isFav, isLearned);
    } else if (this.category === 'grammar') {
      this.renderGrammarCard(item, isFav, isLearned);
    }
  }

  renderVocabCard(item, isFav, isLearned) {
    // Front Face (Không hiện phiên âm / cách đọc)
    this.cardFront.innerHTML = `
      <div class="card-badge-row">
        <span class="badge badge-amber">${item.lesson} • ${item.part}</span>
        <div style="display: flex; gap: 0.5rem;" class="no-flip">
          ${isLearned ? '<span class="badge badge-emerald">Đã thuộc</span>' : ''}
          <button class="icon-btn no-flip fav-toggle-btn ${isFav ? 'active' : ''}" data-id="${item.id}" title="Đánh dấu">
            ${isFav ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>
      <div class="card-main-content">
        <div class="card-kanji-big">${item.kanji || item.kana}</div>
      </div>
      <div class="card-flip-prompt">
        <span>Nhấn [Space] hoặc nhấp để xem nghĩa</span>
      </div>
    `;

    // Back Face (Hiện cách đọc, nghĩa tiếng Việt và nút phát âm)
    this.cardBack.innerHTML = `
      <div class="card-badge-row">
        <span class="badge badge-cyan">${item.lesson}</span>
        <button class="icon-btn no-flip tts-btn" title="Nghe phát âm">Phát âm</button>
      </div>
      <div class="card-main-content">
        <div class="card-kana-sub" style="font-size: 2rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.5rem;">${item.kana}</div>
        <div class="card-meaning-big">${item.meaning}</div>
        ${item.kanji ? `<div class="badge badge-sakura" style="font-size: 1rem; padding: 0.4rem 0.8rem; margin-top: 0.5rem;">Hán tự: ${item.kanji}</div>` : ''}
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
    // Front Face (Chỉ hiện chữ Hán, âm Hán-Việt, tuyệt đối không hiện âm On)
    this.cardFront.innerHTML = `
      <div class="card-badge-row">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="badge badge-sakura">${item.lesson}</span>
          <span class="badge badge-purple">Âm On (音読み)</span>
        </div>
        <div style="display: flex; gap: 0.5rem;" class="no-flip">
          ${isLearned ? '<span class="badge badge-emerald">Đã thuộc</span>' : ''}
          <button class="icon-btn no-flip fav-toggle-btn ${isFav ? 'active' : ''}" data-id="${item.id}">
            ${isFav ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>
      <div class="card-main-content">
        <div class="card-kanji-big" style="color: var(--accent-rose); font-size: 4rem;">${item.kanji}</div>
        <div class="card-hanviet-tag">Hán-Việt: ${item.han_viet}</div>
        <div style="margin-top: 1rem; font-size: 1.05rem; font-weight: 600; color: var(--text-secondary);">
          Âm On của chữ Hán này là gì?
        </div>
      </div>
      <div class="card-flip-prompt">
        <span>Nhấn [Space] hoặc nhấp thẻ để xem âm On</span>
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
          <span class="badge badge-sakura">${item.lesson} • ${item.han_viet}</span>
          <span class="badge badge-purple">Âm On</span>
        </div>
        <button class="icon-btn no-flip tts-btn">Phát âm</button>
      </div>
      <div class="card-main-content" style="align-items: stretch; text-align: left;">
        <div style="text-align: center; margin-bottom: 0.75rem;">
          <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.25rem;">Âm On (Katakana):</div>
          <div style="font-size: 2.6rem; font-weight: 800; color: var(--accent-purple); font-family: var(--font-jp);">
            ${item.onyomi}
          </div>
          <div style="font-size: 1rem; color: var(--text-secondary); margin-top: 0.25rem;">
            Chữ gốc: <strong style="color: var(--text-primary);">${item.kanji}</strong> (${item.han_viet})
          </div>
        </div>

        ${compoundsList ? `
          <div class="card-extra-details">
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem; text-transform: uppercase;">Ví dụ từ ghép sử dụng âm này:</div>
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
    // Front Face (Chỉ hiện chữ Hán, âm Hán-Việt, tuyệt đối không hiện âm Kun)
    this.cardFront.innerHTML = `
      <div class="card-badge-row">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="badge badge-sakura">${item.lesson}</span>
          <span class="badge badge-cyan">Âm Kun (訓読み)</span>
        </div>
        <div style="display: flex; gap: 0.5rem;" class="no-flip">
          ${isLearned ? '<span class="badge badge-emerald">Đã thuộc</span>' : ''}
          <button class="icon-btn no-flip fav-toggle-btn ${isFav ? 'active' : ''}" data-id="${item.id}">
            ${isFav ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>
      <div class="card-main-content">
        <div class="card-kanji-big" style="color: var(--accent-cyan); font-size: 4rem;">${item.kanji}</div>
        <div class="card-hanviet-tag">Hán-Việt: ${item.han_viet}</div>
        <div style="margin-top: 1rem; font-size: 1.05rem; font-weight: 600; color: var(--text-secondary);">
          Âm Kun của chữ Hán này là gì?
        </div>
      </div>
      <div class="card-flip-prompt">
        <span>Nhấn [Space] hoặc nhấp thẻ để xem âm Kun</span>
      </div>
    `;

    // Back Face (Hiện Hiragana âm Kun và ngữ cảnh sử dụng)
    const kunCompound = item.compounds ? item.compounds.find(c => c.reading && c.reading.includes(item.kunyomi.replace(/[-.]/g, ''))) : null;

    this.cardBack.innerHTML = `
      <div class="card-badge-row">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="badge badge-sakura">${item.lesson} • ${item.han_viet}</span>
          <span class="badge badge-cyan">Âm Kun</span>
        </div>
        <button class="icon-btn no-flip tts-btn">Phát âm</button>
      </div>
      <div class="card-main-content" style="align-items: stretch; text-align: left;">
        <div style="text-align: center; margin-bottom: 0.75rem;">
          <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.25rem;">Âm Kun (Hiragana):</div>
          <div style="font-size: 2.6rem; font-weight: 800; color: var(--accent-cyan); font-family: var(--font-jp);">
            ${item.kunyomi}
          </div>
          <div style="font-size: 1rem; color: var(--text-secondary); margin-top: 0.25rem;">
            Chữ gốc: <strong style="color: var(--text-primary);">${item.kanji}</strong> (${item.han_viet})
          </div>
        </div>

        ${kunCompound ? `
          <div class="card-extra-details">
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem; text-transform: uppercase;">Ví dụ từ ghép thuần Nhật liên quan:</div>
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
    // Front Face (Chỉ hiện chữ Hán từ ghép và gốc Kanji, không hiện cách đọc hay nghĩa)
    this.cardFront.innerHTML = `
      <div class="card-badge-row">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="badge badge-sakura">${item.lesson}</span>
          <span class="badge badge-amber">Từ Ghép Hán Tự</span>
        </div>
        <div style="display: flex; gap: 0.5rem;" class="no-flip">
          ${isLearned ? '<span class="badge badge-emerald">Đã thuộc</span>' : ''}
          <button class="icon-btn no-flip fav-toggle-btn ${isFav ? 'active' : ''}" data-id="${item.id}">
            ${isFav ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>
      <div class="card-main-content">
        <div class="card-kanji-big" style="font-size: 3.2rem; color: var(--text-primary); font-weight: 800; letter-spacing: 0.05em;">
          ${item.word}
        </div>
        <div class="badge badge-indigo" style="font-size: 0.95rem; padding: 0.35rem 0.8rem; margin-top: 0.75rem;">
          Gốc Hán Tự: ${item.parentKanji} (${item.parentHanViet})
        </div>
        <div style="margin-top: 1rem; font-size: 1rem; color: var(--text-secondary);">
          Từ này phát âm là gì và mang ý nghĩa gì?
        </div>
      </div>
      <div class="card-flip-prompt">
        <span>Nhấn [Space] hoặc nhấp thẻ để xem cách đọc & nghĩa</span>
      </div>
    `;

    // Back Face (Hiện cách đọc Hiragana, nghĩa tiếng Việt, chữ Hán và phát âm)
    this.cardBack.innerHTML = `
      <div class="card-badge-row">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="badge badge-sakura">${item.parentKanji} (${item.parentHanViet})</span>
          <span class="badge badge-cyan">${item.lesson}</span>
        </div>
        <button class="icon-btn no-flip tts-btn">Phát âm</button>
      </div>
      <div class="card-main-content">
        <div class="card-kana-sub" style="font-size: 2.2rem; font-weight: 800; color: var(--accent-cyan); margin-bottom: 0.5rem; font-family: var(--font-jp);">
          ${item.reading || item.word}
        </div>
        <div class="card-meaning-big" style="font-size: 1.6rem; margin-bottom: 0.75rem;">
          ${item.meaning}
        </div>
        <div class="badge badge-sakura" style="font-size: 1rem; padding: 0.4rem 0.9rem;">
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
    // Fallback if needed
    this.cardFront.innerHTML = `
      <div class="card-badge-row">
        <span class="badge badge-sakura">${item.lesson}</span>
        <div style="display: flex; gap: 0.5rem;" class="no-flip">
          ${isLearned ? '<span class="badge badge-emerald">Đã thuộc</span>' : ''}
          <button class="icon-btn no-flip fav-toggle-btn ${isFav ? 'active' : ''}" data-id="${item.id}">
            ${isFav ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>
      <div class="card-main-content">
        <div class="card-kanji-big" style="color: #FDA4AF; text-shadow: 0 0 25px rgba(244, 63, 94, 0.4);">${item.kanji}</div>
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
        <span class="badge badge-sakura">${item.han_viet}</span>
        <button class="icon-btn no-flip tts-btn">Phát âm</button>
      </div>
      <div class="card-main-content" style="align-items: stretch; text-align: left;">
        <div style="display: flex; gap: 1rem; margin-bottom: 0.75rem; justify-content: center;">
          <div class="badge badge-purple" style="font-size: 0.9rem;">音 (On): <strong>${item.onyomi || '—'}</strong></div>
          <div class="badge badge-cyan" style="font-size: 0.9rem;">訓 (Kun): <strong>${item.kunyomi || '—'}</strong></div>
        </div>
        <div class="card-extra-details">
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Từ ghép ví dụ:</div>
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
    this.cardFront.innerHTML = `
      <div class="card-badge-row">
        <span class="badge badge-emerald">${item.lesson}</span>
        <div style="display: flex; gap: 0.5rem;" class="no-flip">
          <button class="icon-btn no-flip fav-toggle-btn ${isFav ? 'active' : ''}" data-id="${item.id}">
            ${isFav ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>
      <div class="card-main-content">
        <div style="font-size: 1.5rem; font-weight: 800; color: #FFF; margin-bottom: 1rem; text-align: center;">${item.title}</div>
        <div class="grammar-formula-badge" style="font-size: 1.1rem; padding: 0.75rem 1.25rem;">${item.formula || 'Cấu trúc'}</div>
      </div>
      <div class="card-flip-prompt">
        <span>Xem giải thích & câu ví dụ</span>
      </div>
    `;

    const exHtml = item.examples && item.examples.length > 0
      ? item.examples.map(ex => `<div class="detail-line">• ${ex}</div>`).join('')
      : '';

    this.cardBack.innerHTML = `
      <div class="card-badge-row">
        <span class="badge badge-emerald">${item.lesson}</span>
        <button class="icon-btn no-flip tts-btn">Phát âm</button>
      </div>
      <div class="card-main-content" style="align-items: stretch; text-align: left;">
        ${item.points ? `<div class="grammar-point-box" style="margin-bottom: 0.75rem;">${item.points}</div>` : ''}
        <div class="card-extra-details">
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem; text-transform: uppercase;">Ví dụ minh họa:</div>
          ${exHtml}
        </div>
      </div>
      <div class="card-flip-prompt">
        <span>Đánh giá độ nhớ</span>
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
        window.app.showToast(active ? 'Đã thêm vào mục yêu thích!' : 'Đã bỏ yêu thích', 'info');
      });
    });
  }

  // Hands-free Auto-play Mode
  toggleAutoPlay() {
    this.isAutoPlaying = !this.isAutoPlaying;
    if (this.autoPlayBtn) {
      this.autoPlayBtn.classList.toggle('btn-primary', this.isAutoPlaying);
      this.autoPlayBtn.classList.toggle('btn-secondary', !this.isAutoPlaying);
      this.autoPlayBtn.innerHTML = this.isAutoPlaying ? 'Tạm dừng chạy tự động' : 'Chạy tự động (Hands-free)';
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
