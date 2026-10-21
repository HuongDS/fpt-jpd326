/**
 * Main Application Orchestrator
 * Handles navigation, tab switching, dashboard metrics, rendering lists, and modals.
 */

class App {
  constructor() {
    this.data = window.APP_DATA || { kanji: [], vocabulary: [], grammar: [], slides: [] };
    this.currentTab = 'dashboard';
    this.kanjiLessonFilter = 'all';
    this.vocabLessonFilter = 'all';
    this.grammarLessonFilter = 'all';

    this.init();
  }

  init() {
    this.initTheme();
    this.initNavigation();
    this.initDashboard();
    this.initKanjiView();
    this.initVocabView();
    this.initGrammarView();

    // Initialize Subsystems
    window.flashcardEngine = new FlashcardEngine();
    window.slideViewer = new SlideViewer();
    window.quizEngine = new QuizEngine();
    window.omniSearch = new OmniSearch();

    // Initial Flashcard load
    window.flashcardEngine.loadDeck(this.data.vocabulary, 'vocab');

    // Quick Action cards on dashboard
    this.bindDashboardActions();
  }

  initTheme() {
    this.theme = localStorage.getItem('jpd326_theme') || 'light';
    this.applyTheme(this.theme);

    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('jpd326_theme', this.theme);
        this.applyTheme(this.theme);
        this.showToast(this.theme === 'light' ? 'Đã chuyển sang chế độ Sáng (Light mode)' : 'Đã chuyển sang chế độ Tối (Dark mode)', 'info');
      });
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) {
      themeBtn.textContent = theme === 'light' ? 'Sáng' : 'Tối';
      themeBtn.title = theme === 'light' ? 'Đang ở chế độ Sáng. Bấm để đổi sang Tối' : 'Đang ở chế độ Tối. Bấm để đổi sang Sáng';
    }
  }

  initNavigation() {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Sound toggle
    const soundToggle = document.getElementById('btn-toggle-sound');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        window.soundEngine.soundEnabled = !window.soundEngine.soundEnabled;
        soundToggle.classList.toggle('active', window.soundEngine.soundEnabled);
        soundToggle.textContent = window.soundEngine.soundEnabled ? 'Bật âm' : 'Tắt âm';
        this.showToast(window.soundEngine.soundEnabled ? 'Đã bật âm thanh' : 'Đã tắt âm thanh', 'info');
      });
    }

    // Reset progress button
    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ học tập (flashcard, điểm số, streak)?')) {
          window.storageManager.resetAllProgress();
          this.updateDashboardStats();
          this.showToast('Đã đặt lại toàn bộ tiến độ!', 'warning');
        }
      });
    }
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });

    // Sub-triggers when entering tabs
    if (tabId === 'dashboard') {
      this.updateDashboardStats();
    } else if (tabId === 'flashcards') {
      window.flashcardEngine.renderCard();
    } else if (tabId === 'slides') {
      window.slideViewer.renderCurrentSlide();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  initDashboard() {
    this.updateDashboardStats();
    this.renderLessonCards();
  }

  updateDashboardStats() {
    const totalVocab = this.data.vocabulary.length;
    const totalKanji = this.data.kanji.length;
    const totalGrammar = this.data.grammar.length;
    const totalSlides = this.data.slides.reduce((acc, d) => acc + d.total_slides, 0);

    const learnedVocab = window.storageManager.getLearnedCount('vocab_');
    const learnedKanji = window.storageManager.getLearnedCount('kanji_');

    const totalLearned = learnedVocab + learnedKanji;
    const totalMasterable = totalVocab + totalKanji;
    const masteryPct = totalMasterable > 0 ? Math.round((totalLearned / totalMasterable) * 100) : 0;

    const streakVal = document.getElementById('dash-streak-val');
    const learnedVal = document.getElementById('dash-learned-val');
    const reviewsVal = document.getElementById('dash-reviews-val');
    const masteryVal = document.getElementById('dash-mastery-val');

    if (streakVal) streakVal.textContent = `${window.storageManager.stats.streakDays} Ngày`;
    if (learnedVal) learnedVal.textContent = `${totalLearned} / ${totalMasterable}`;
    if (reviewsVal) reviewsVal.textContent = `${window.storageManager.stats.totalReviews}`;
    if (masteryVal) masteryVal.textContent = `${masteryPct}%`;
  }

  renderLessonCards() {
    const grid = document.getElementById('dash-lessons-grid');
    if (!grid) return;

    const lessons = ['第 6 課', '第 7 課', '第 8 課', '第 9 課', '第 10 課'];
    const lessonTopics = {
      '第 6 課': '地図を広げる (Khám phá bản đồ)',
      '第 7 課': '世代を超えた交流 (Giao lưu thế hệ)',
      '第 8 課': '気持ちを伝える (Bày tỏ cảm xúc)',
      '第 9 課': '言葉を楽しむ (Thưởng thức ngôn ngữ)',
      '第 10 課': '自然と人間 (Thiên nhiên & Con người)'
    };

    grid.innerHTML = lessons.map(lesson => {
      const vCount = this.data.vocabulary.filter(v => v.lesson === lesson).length;
      const kCount = this.data.kanji.filter(k => k.lesson === lesson).length;
      const gCount = this.data.grammar.filter(g => g.lesson === lesson).length;
      const sDeck = this.data.slides.find(s => s.lesson === lesson);
      const sCount = sDeck ? sDeck.total_slides : 0;

      return `
        <div class="lesson-card" data-lesson="${lesson}">
          <div class="lesson-card-header">
            <span class="lesson-tag">${lesson}</span>
            <span style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 600;">JPD326</span>
          </div>
          <div class="lesson-title">${lessonTopics[lesson] || lesson}</div>
          <div class="lesson-counts">
            <span>${vCount} Từ</span>
            <span>${kCount} Hán tự</span>
            <span>${gCount} Ngữ pháp</span>
            ${sCount ? `<span>${sCount} Slide</span>` : ''}
          </div>
          <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
            <button class="btn btn-secondary btn-sm btn-lesson-vocab" data-lesson="${lesson}">Học từ</button>
            <button class="btn btn-secondary btn-sm btn-lesson-kanji" data-lesson="${lesson}">Hán tự</button>
            ${sCount ? `<button class="btn btn-purple btn-sm btn-lesson-slide" data-lesson="${lesson}">Slide</button>` : ''}
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.btn-lesson-vocab').forEach(btn => {
      btn.addEventListener('click', () => {
        const lesson = btn.dataset.lesson;
        this.filterVocabByLesson(lesson);
        this.switchTab('vocab');
      });
    });

    grid.querySelectorAll('.btn-lesson-kanji').forEach(btn => {
      btn.addEventListener('click', () => {
        const lesson = btn.dataset.lesson;
        this.filterKanjiByLesson(lesson);
        this.switchTab('kanji');
      });
    });

    grid.querySelectorAll('.btn-lesson-slide').forEach(btn => {
      btn.addEventListener('click', () => {
        const lesson = btn.dataset.lesson;
        const deckIdx = this.data.slides.findIndex(s => s.lesson === lesson);
        if (deckIdx >= 0) {
          window.slideViewer.jumpToSlide(deckIdx, 0);
          this.switchTab('slides');
        }
      });
    });
  }

  bindDashboardActions() {
    const actQuiz = document.getElementById('dash-action-quiz');
    const actFc = document.getElementById('dash-action-flashcards');
    const actVocab = document.getElementById('dash-action-vocab');
    const actKanji = document.getElementById('dash-action-kanji');
    const actGrammar = document.getElementById('dash-action-grammar');
    const actSlide = document.getElementById('dash-action-slides');

    if (actQuiz) actQuiz.onclick = () => this.switchTab('quiz');
    if (actFc) actFc.onclick = () => this.switchTab('flashcards');
    if (actVocab) actVocab.onclick = () => this.switchTab('vocab');
    if (actKanji) actKanji.onclick = () => this.switchTab('kanji');
    if (actGrammar) actGrammar.onclick = () => this.switchTab('grammar');
    if (actSlide) actSlide.onclick = () => this.switchTab('slides');
  }

  // ------------------------------------------------------------------------
  // KANJI MODULE
  // ------------------------------------------------------------------------
  initKanjiView() {
    this.renderKanjiFilters();
    this.renderKanjiGrid();

    // Kanji Search input
    const kSearch = document.getElementById('kanji-search-input');
    if (kSearch) {
      kSearch.addEventListener('input', (e) => {
        this.renderKanjiGrid(e.target.value.toLowerCase().trim());
      });
    }

    // "Luyện Flashcard Hán Tự" button
    const fcKanjiBtn = document.getElementById('btn-fc-kanji');
    if (fcKanjiBtn) {
      fcKanjiBtn.addEventListener('click', () => {
        const filtered = this.kanjiLessonFilter === 'all'
          ? this.data.kanji
          : this.data.kanji.filter(k => k.lesson === this.kanjiLessonFilter);
        window.flashcardEngine.loadDeck(filtered, 'kanji');
        this.switchTab('flashcards');
      });
    }

    // Modal Close
    const modalClose = document.getElementById('kanji-modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', () => this.closeKanjiModal());
    }
  }

  renderKanjiFilters() {
    const container = document.getElementById('kanji-filter-bar');
    if (!container) return;

    const lessons = ['all', '第 6 課', '第 7 課', '第 8 課', '第 9 課', '第 10 課'];
    container.innerHTML = lessons.map(l => `
      <button class="filter-chip ${l === this.kanjiLessonFilter ? 'active' : ''}" data-lesson="${l}">
        ${l === 'all' ? 'Tất cả (73 Kanji)' : l}
      </button>
    `).join('');

    container.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.kanjiLessonFilter = btn.dataset.lesson;
        this.renderKanjiGrid();
      });
    });
  }

  filterKanjiByLesson(lesson) {
    this.kanjiLessonFilter = lesson;
    this.renderKanjiFilters();
    this.renderKanjiGrid();
  }

  renderKanjiGrid(query = '') {
    const grid = document.getElementById('kanji-grid-root');
    if (!grid) return;

    let items = this.data.kanji;
    if (this.kanjiLessonFilter !== 'all') {
      items = items.filter(k => k.lesson === this.kanjiLessonFilter);
    }
    if (query) {
      items = items.filter(k => 
        k.kanji.includes(query) || 
        k.han_viet.toLowerCase().includes(query) || 
        k.onyomi.toLowerCase().includes(query) || 
        k.kunyomi.toLowerCase().includes(query) || 
        k.examples_raw.toLowerCase().includes(query)
      );
    }

    if (items.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">Không tìm thấy Hán tự nào phù hợp.</div>`;
      return;
    }

    grid.innerHTML = items.map(k => {
      const isLearned = window.storageManager.isLearned(k.id);
      return `
        <div class="kanji-card-item" data-id="${k.id}">
          <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
            <span class="badge badge-sakura" style="font-size: 0.72rem;">${k.lesson}</span>
            ${isLearned ? '<span style="color: var(--accent-emerald); font-size: 0.8rem;">Thuộc</span>' : ''}
          </div>
          <div class="kanji-char-preview">${k.kanji}</div>
          <div class="kanji-hanviet-badge">${k.han_viet}</div>
          <div class="kanji-readings-snippet">
            <div>On: <strong>${k.onyomi || '—'}</strong></div>
            <div>Kun: <strong>${k.kunyomi || '—'}</strong></div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.kanji-card-item').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const kanjiItem = this.data.kanji.find(k => k.id === id);
        if (kanjiItem) this.openKanjiModal(kanjiItem);
      });
    });
  }

  openKanjiModal(k) {
    const modal = document.getElementById('kanji-detail-modal');
    if (!modal) return;

    document.getElementById('modal-kanji-char').textContent = k.kanji;
    document.getElementById('modal-kanji-hanviet').textContent = k.han_viet;
    document.getElementById('modal-kanji-lesson').textContent = k.lesson;
    document.getElementById('modal-kanji-on').textContent = k.onyomi || '—';
    document.getElementById('modal-kanji-kun').textContent = k.kunyomi || '—';

    // Pronounce button in modal
    const speakBtn = document.getElementById('btn-modal-speak-kanji');
    if (speakBtn) {
      speakBtn.onclick = () => window.soundEngine.speakJapanese(k.kunyomi || k.onyomi || k.kanji);
    }

    const compoundsList = document.getElementById('modal-kanji-compounds');
    if (compoundsList) {
      if (k.compounds && k.compounds.length > 0) {
        compoundsList.innerHTML = k.compounds.map(c => `
          <div class="grammar-example-row" style="cursor: pointer;" data-word="${c.word}">
            <span style="font-size: 1.1rem; font-weight: 700; color: #FFF;">${c.word}</span>
            <span style="color: var(--accent-cyan); font-weight: 500;">${c.reading ? `(${c.reading})` : ''}</span>
            <span style="flex: 1; color: var(--text-primary); text-align: right;">${c.meaning}</span>
            <button class="icon-btn btn-sm">Nghe</button>
          </div>
        `).join('');

        compoundsList.querySelectorAll('.grammar-example-row').forEach(row => {
          row.addEventListener('click', () => {
            const word = row.dataset.word;
            window.soundEngine.speakJapanese(word);
          });
        });
      } else {
        compoundsList.innerHTML = `<div style="color: var(--text-secondary); white-space: pre-wrap;">${k.examples_raw}</div>`;
      }
    }

    modal.classList.add('active');
  }

  closeKanjiModal() {
    const modal = document.getElementById('kanji-detail-modal');
    if (modal) modal.classList.remove('active');
  }

  // ------------------------------------------------------------------------
  // VOCABULARY MODULE
  // ------------------------------------------------------------------------
  initVocabView() {
    this.renderVocabFilters();
    this.renderVocabList();

    const vSearch = document.getElementById('vocab-search-input');
    if (vSearch) {
      vSearch.addEventListener('input', (e) => {
        this.renderVocabList(e.target.value.toLowerCase().trim());
      });
    }

    // "Luyện Flashcard Từ Vựng" button
    const fcVocabBtn = document.getElementById('btn-fc-vocab');
    if (fcVocabBtn) {
      fcVocabBtn.addEventListener('click', () => {
        const filtered = this.vocabLessonFilter === 'all'
          ? this.data.vocabulary
          : this.data.vocabulary.filter(v => v.lesson === this.vocabLessonFilter);
        window.flashcardEngine.loadDeck(filtered, 'vocab');
        this.switchTab('flashcards');
      });
    }
  }

  renderVocabFilters() {
    const container = document.getElementById('vocab-filter-bar');
    if (!container) return;

    const lessons = ['all', '第 6 課', '第 7 課', '第 8 課', '第 9 課', '第 10 課'];
    container.innerHTML = lessons.map(l => `
      <button class="filter-chip ${l === this.vocabLessonFilter ? 'active' : ''}" data-lesson="${l}">
        ${l === 'all' ? 'Tất cả (531 từ)' : l}
      </button>
    `).join('');

    container.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.vocabLessonFilter = btn.dataset.lesson;
        this.renderVocabList();
      });
    });
  }

  filterVocabByLesson(lesson) {
    this.vocabLessonFilter = lesson;
    this.renderVocabFilters();
    this.renderVocabList();
  }

  renderVocabList(query = '') {
    const tbody = document.getElementById('vocab-table-body');
    if (!tbody) return;

    let items = this.data.vocabulary;
    if (this.vocabLessonFilter !== 'all') {
      items = items.filter(v => v.lesson === this.vocabLessonFilter);
    }
    if (query) {
      items = items.filter(v => 
        v.display.toLowerCase().includes(query) || 
        v.kana.toLowerCase().includes(query) || 
        v.meaning.toLowerCase().includes(query)
      );
    }

    const countBadge = document.getElementById('vocab-count-badge');
    if (countBadge) countBadge.textContent = `${items.length} từ`;

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">Không tìm thấy từ vựng nào phù hợp.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.slice(0, 100).map(v => {
      const isFav = window.storageManager.isFavorite(v.id);
      const isLearned = window.storageManager.isLearned(v.id);
      return `
        <tr data-id="${v.id}">
          <td style="width: 60px; text-align: center;">
            <button class="icon-btn btn-sm btn-vocab-fav ${isFav ? 'active' : ''}" data-id="${v.id}">
              ${isFav ? 'Đã lưu' : 'Lưu'}
            </button>
          </td>
          <td style="min-width: 140px;">
            <div class="vocab-word-jp">${v.kanji || v.kana}</div>
            ${v.kanji ? `<div class="vocab-kana-sub">${v.kana}</div>` : ''}
          </td>
          <td>
            <div class="vocab-meaning-txt">${v.meaning}</div>
          </td>
          <td>
            <span class="badge badge-amber">${v.lesson} • ${v.part}</span>
          </td>
          <td style="width: 70px; text-align: center;">
            <button class="icon-btn btn-sm btn-speak-vocab" data-text="${v.kana || v.display}">Nghe</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-speak-vocab').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.text;
        window.soundEngine.speakJapanese(text);
      });
    });

    tbody.querySelectorAll('.btn-vocab-fav').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const active = window.storageManager.toggleFavorite(id);
        btn.classList.toggle('active', active);
        btn.innerHTML = active ? 'Đã lưu' : 'Lưu';
      });
    });
  }

  // ------------------------------------------------------------------------
  // GRAMMAR MODULE
  // ------------------------------------------------------------------------
  initGrammarView() {
    this.renderGrammarFilters();
    this.renderGrammarList();

    const gSearch = document.getElementById('grammar-search-input');
    if (gSearch) {
      gSearch.addEventListener('input', (e) => {
        this.renderGrammarList(e.target.value.toLowerCase().trim());
      });
    }

    const fcGrammarBtn = document.getElementById('btn-fc-grammar');
    if (fcGrammarBtn) {
      fcGrammarBtn.addEventListener('click', () => {
        const filtered = this.grammarLessonFilter === 'all'
          ? this.data.grammar
          : this.data.grammar.filter(g => g.lesson === this.grammarLessonFilter);
        window.flashcardEngine.loadDeck(filtered, 'grammar');
        this.switchTab('flashcards');
      });
    }
  }

  renderGrammarFilters() {
    const container = document.getElementById('grammar-filter-bar');
    if (!container) return;

    const lessons = ['all', '第 6 課', '第 7 課', '第 8 課', '第 9 課', '第 10 課'];
    container.innerHTML = lessons.map(l => `
      <button class="filter-chip ${l === this.grammarLessonFilter ? 'active' : ''}" data-lesson="${l}">
        ${l === 'all' ? 'Tất cả (69 mẫu)' : l}
      </button>
    `).join('');

    container.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.grammarLessonFilter = btn.dataset.lesson;
        this.renderGrammarList();
      });
    });
  }

  renderGrammarList(query = '') {
    const container = document.getElementById('grammar-list-root');
    if (!container) return;

    let items = this.data.grammar;
    if (this.grammarLessonFilter !== 'all') {
      items = items.filter(g => g.lesson === this.grammarLessonFilter);
    }
    if (query) {
      items = items.filter(g => 
        g.title.toLowerCase().includes(query) || 
        g.formula.toLowerCase().includes(query) || 
        (g.points && g.points.toLowerCase().includes(query))
      );
    }

    if (items.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 3rem;">Không tìm thấy mẫu ngữ pháp nào phù hợp.</div>`;
      return;
    }

    container.innerHTML = items.map(g => {
      const examplesHtml = g.examples && g.examples.length > 0
        ? g.examples.map(ex => `
            <div class="grammar-example-row">
              <span class="jp-font">${ex}</span>
              <button class="icon-btn btn-sm btn-speak-ex" data-text="${encodeURIComponent(ex)}">Nghe</button>
            </div>
          `).join('')
        : '';

      return `
        <div class="grammar-item-card" data-id="${g.id}">
          <div class="grammar-card-header">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="badge badge-emerald">${g.lesson}</span>
              <div class="grammar-title-text">${g.title}</div>
            </div>
            <button class="icon-btn btn-sm btn-speak-formula" data-text="${encodeURIComponent(g.formula || g.title)}" title="Nghe mẫu câu">Nghe</button>
          </div>

          ${g.formula ? `<div class="grammar-formula-badge">${g.formula}</div>` : ''}

          ${g.points ? `
            <div class="grammar-point-box">
              <strong>Điểm lưu ý:</strong> ${g.points}
            </div>
          ` : ''}

          ${examplesHtml ? `
            <div class="grammar-examples-list">
              <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Ví dụ:</div>
              ${examplesHtml}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    container.querySelectorAll('.btn-speak-ex, .btn-speak-formula').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = decodeURIComponent(btn.dataset.text);
        window.soundEngine.speakJapanese(text);
      });
    });
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
