/**
 * Flashcard SRS Engine
 * Handles 3D Card flips, SRS queues, auto-pronunciation, and hands-free study mode.
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

    this.cardInner = document.getElementById('flashcard-inner');
    this.cardFront = document.getElementById('card-front');
    this.cardBack = document.getElementById('card-back');
    this.counterEl = document.getElementById('fc-counter');
    this.autoPlayBtn = document.getElementById('btn-fc-autoplay');
    this.autoPronounceBtn = document.getElementById('btn-fc-autopronounce');

    this.initEvents();
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

  loadDeck(deck, category = 'vocab') {
    this.deck = deck || [];
    this.category = category;
    this.currentIndex = 0;
    this.isFlipped = false;
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
      // Speak kunyomi or onyomi
      const textToSpeak = item.kunyomi || item.onyomi || item.kanji;
      window.soundEngine.speakJapanese(textToSpeak);
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
    // Front Face
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

    // Back Face
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
