/**
 * Main Application Orchestrator
 * Handles navigation, tab switching, dashboard metrics, rendering lists, and modals.
 */

class App {
  constructor() {
    this.data = window.APP_DATA || { kanji: [], vocabulary: [], grammar: [] };
    this.currentTab = 'dashboard';
    this.currentLesson = 'all'; // 'all' | '第 6 課' | '第 7 課' | '第 8 課' | '第 9 課' | '第 10 課'
    this.kanjiLessonFilter = 'all';
    this.vocabLessonFilter = 'all';
    this.grammarLessonFilter = 'all';

    this.init();
  }

  init() {
    this.initTheme();
    this.initGlobalLessonBar();
    this.initNavigation();
    this.initDashboard();
    this.initKanjiView();
    this.initVocabView();
    this.initGrammarView();

    // Initialize Subsystems
    window.flashcardEngine = new FlashcardEngine();
    window.quizEngine = new QuizEngine();
    window.omniSearch = new OmniSearch();

    // Initial Flashcard load
    window.flashcardEngine.refreshDeck();

    // Quick Action cards on dashboard
    this.bindDashboardActions();
  }

  initGlobalLessonBar() {
    const chipsContainer = document.getElementById('global-lesson-chips');
    if (!chipsContainer) return;

    chipsContainer.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const lesson = chip.dataset.lesson;
        this.setLesson(lesson);
      });
    });
  }

  setLesson(lesson) {
    this.currentLesson = lesson || 'all';
    this.syncGlobalLessonBar();

    // Synchronize Flashcard Engine
    if (window.flashcardEngine) {
      window.flashcardEngine.setLessonFilter(this.currentLesson);
    }

    // Synchronize Quiz Engine
    if (window.quizEngine) {
      window.quizEngine.setLessonScope(this.currentLesson);
    }

    // Synchronize Vocab tab
    this.vocabLessonFilter = this.currentLesson;
    this.renderVocabFilters();
    this.renderVocabList();

    // Synchronize Kanji tab
    this.kanjiLessonFilter = this.currentLesson;
    this.renderKanjiFilters();
    this.renderKanjiGrid();

    // Synchronize Grammar tab
    this.grammarLessonFilter = this.currentLesson;
    this.renderGrammarFilters();
    this.renderGrammarList();

    // Update Dashboard view
    this.renderDashboardLessonView();

    if (this.currentLesson !== 'all') {
      this.showToast(`Đã chọn chương trình: ${this.currentLesson}`, 'info');
    } else {
      this.showToast('Hiển thị toàn bộ chương trình (Bài 6 - 10)', 'info');
    }
  }

  syncGlobalLessonBar() {
    const chipsContainer = document.getElementById('global-lesson-chips');
    if (chipsContainer) {
      chipsContainer.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.lesson === this.currentLesson);
      });
    }
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

    const logoHome = document.getElementById('btn-logo-home');
    if (logoHome) {
      logoHome.addEventListener('click', () => {
        this.setLesson('all');
        this.switchTab('dashboard');
      });
    }

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
          this.renderDashboardLessonView();
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
      this.renderDashboardLessonView();
    } else if (tabId === 'flashcards') {
      window.flashcardEngine.renderCard();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  initDashboard() {
    this.renderDashboardLessonView();
  }

  renderDashboardLessonView() {
    this.updateDashboardStats();

    const heroOverview = document.getElementById('dash-hero-overview');
    const lessonHub = document.getElementById('dash-lesson-hub-root');

    if (this.currentLesson === 'all') {
      if (heroOverview) heroOverview.style.display = 'block';
      if (lessonHub) lessonHub.style.display = 'none';
      this.renderLessonCards();
    } else {
      if (heroOverview) heroOverview.style.display = 'none';
      if (lessonHub) {
        lessonHub.style.display = 'block';
        this.renderLessonHub(this.currentLesson);
      }
      this.renderLessonCards();
    }
  }

  renderLessonHub(lesson) {
    const hubRoot = document.getElementById('dash-lesson-hub-root');
    if (!hubRoot) return;

    const lessonTopics = {
      '第 6 課': '地図を広げる (Khám phá bản đồ)',
      '第 7 課': '世代を超えた交流 (Giao lưu thế hệ)',
      '第 8 課': '気持ちを伝える (Bày tỏ cảm xúc)',
      '第 9 課': '言葉を楽しむ (Thưởng thức ngôn ngữ)',
      '第 10 課': '自然と人間 (Thiên nhiên & Con người)'
    };

    const vInLesson = this.data.vocabulary.filter(v => v.lesson === lesson);
    const kInLesson = this.data.kanji.filter(k => k.lesson === lesson);
    const gInLesson = this.data.grammar.filter(g => g.lesson === lesson);

    const vLearned = vInLesson.filter(v => window.storageManager.isLearned(v.id)).length;
    const kLearned = kInLesson.filter(k => window.storageManager.isLearned(k.id)).length;
    const totalItems = vInLesson.length + kInLesson.length;
    const pct = totalItems > 0 ? Math.round(((vLearned + kLearned) / totalItems) * 100) : 0;

    const kCards = window.flashcardEngine ? window.flashcardEngine.buildKanjiDeck(kInLesson, 'all') : [];
    const totalFc = vInLesson.length + kCards.length + gInLesson.length;

    hubRoot.innerHTML = `
      <div class="lesson-hub-hero">
        <div class="lesson-hub-top">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
              <span class="badge">${lesson}</span>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">CHƯƠNG TRÌNH HỌC JPD326</span>
            </div>
            <div class="lesson-hub-title">${lessonTopics[lesson] || lesson}</div>
            <div class="lesson-hub-subtitle">Toàn bộ kho tài liệu chuyên sâu dành riêng cho ${lesson}: từ vựng, hán tự, ngữ pháp, flashcard và bài kiểm tra trắc nghiệm.</div>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-back-all-lessons">
            Xem tất cả các bài (6 - 10)
          </button>
        </div>

        <div class="lesson-hub-stats-grid">
          <div class="stat-box">
            <div class="stat-value">${totalFc}</div>
            <div class="stat-label">Tổng Thẻ SRS</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${vInLesson.length}</div>
            <div class="stat-label">Từ Vựng (${vLearned} đã thuộc)</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${kInLesson.length}</div>
            <div class="stat-label">Hán Tự (${kCards.length} thẻ)</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${gInLesson.length}</div>
            <div class="stat-label">Ngữ Pháp</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${pct}%</div>
            <div class="stat-label">Tiến Độ Thuộc</div>
          </div>
        </div>

        <div class="lesson-hub-actions">
          <button class="btn btn-primary" id="btn-hub-study-fc">
            Luyện Flashcard ${lesson} (${totalFc} Thẻ)
          </button>
          <button class="btn btn-secondary" id="btn-hub-quiz">
            Thi Speed Quiz ${lesson}
          </button>
          <button class="btn btn-secondary" id="btn-hub-vocab">
            Bảng Từ Vựng (${vInLesson.length})
          </button>
          <button class="btn btn-secondary" id="btn-hub-kanji">
            Hán Tự (${kInLesson.length} chữ)
          </button>
          <button class="btn btn-secondary" id="btn-hub-grammar">
            Ngữ Pháp (${gInLesson.length} mẫu)
          </button>
        </div>
      </div>
    `;

    // Bind action events in Hub
    const backBtn = document.getElementById('btn-back-all-lessons');
    if (backBtn) backBtn.onclick = () => this.setLesson('all');

    const fcBtn = document.getElementById('btn-hub-study-fc');
    if (fcBtn) {
      fcBtn.onclick = () => {
        window.flashcardEngine.setLessonFilter(lesson);
        window.flashcardEngine.category = 'all';
        window.flashcardEngine.refreshDeck();
        this.switchTab('flashcards');
      };
    }

    const quizBtn = document.getElementById('btn-hub-quiz');
    if (quizBtn) {
      quizBtn.onclick = () => {
        window.quizEngine.setLessonScope(lesson);
        this.switchTab('quiz');
      };
    }

    const vBtn = document.getElementById('btn-hub-vocab');
    if (vBtn) {
      vBtn.onclick = () => {
        this.filterVocabByLesson(lesson);
        this.switchTab('vocab');
      };
    }

    const kBtn = document.getElementById('btn-hub-kanji');
    if (kBtn) {
      kBtn.onclick = () => {
        this.filterKanjiByLesson(lesson);
        this.switchTab('kanji');
      };
    }

    const gBtn = document.getElementById('btn-hub-grammar');
    if (gBtn) {
      gBtn.onclick = () => {
        this.filterGrammarByLesson(lesson);
        this.switchTab('grammar');
      };
    }
  }

  updateDashboardStats() {
    const totalVocab = this.data.vocabulary.length;
    const totalKanji = this.data.kanji.length;
    const totalGrammar = this.data.grammar.length;

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
      const vList = this.data.vocabulary.filter(v => v.lesson === lesson);
      const kList = this.data.kanji.filter(k => k.lesson === lesson);
      const gList = this.data.grammar.filter(g => g.lesson === lesson);

      const vCount = vList.length;
      const kCount = kList.length;
      const gCount = gList.length;

      const vLearned = vList.filter(v => window.storageManager.isLearned(v.id)).length;
      const kLearned = kList.filter(k => window.storageManager.isLearned(k.id)).length;
      const totalLearnable = vCount + kCount;
      const pct = totalLearnable > 0 ? Math.round(((vLearned + kLearned) / totalLearnable) * 100) : 0;

      const kCardsCount = window.flashcardEngine ? window.flashcardEngine.buildKanjiDeck(kList, 'all').length : kCount * 7;
      const totalFcCount = vCount + kCardsCount + gCount;
      const isActive = this.currentLesson === lesson;

      return `
        <div class="lesson-card ${isActive ? 'active-lesson' : ''}" data-lesson="${lesson}">
          <div>
            <div class="lesson-card-header">
              <span class="lesson-tag">${lesson}</span>
              <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">${isActive ? 'ĐANG CHỌN' : 'JPD326'}</span>
            </div>
            <div class="lesson-title">${lessonTopics[lesson] || lesson}</div>
            <div class="lesson-counts">
              <span>${vCount} Từ vựng</span>
              <span>${kCount} Hán tự</span>
              <span>${gCount} Ngữ pháp</span>
            </div>

            <div class="lesson-progress-row">
              <span>Tiến độ thuộc</span>
              <span>${vLearned + kLearned}/${totalLearnable} (${pct}%)</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${pct}%;"></div>
            </div>
          </div>

          <div class="lesson-card-actions">
            <div class="lesson-primary-row">
              <button class="btn btn-primary btn-sm btn-study-lesson" style="flex: 1;" data-lesson="${lesson}">
                Học Bài Này
              </button>
              <button class="btn btn-secondary btn-sm btn-lesson-fc" style="flex: 1;" data-lesson="${lesson}" title="Luyện thẻ Flashcard của ${lesson}">
                Thẻ SRS (${totalFcCount})
              </button>
              <button class="btn btn-secondary btn-sm btn-lesson-quiz" data-lesson="${lesson}" title="Thi trắc nghiệm ${lesson}">
                Quiz
              </button>
            </div>
            <div class="lesson-secondary-row">
              <button class="btn btn-secondary btn-sm btn-lesson-vocab" style="flex: 1;" data-lesson="${lesson}">Từ vựng (${vCount})</button>
              <button class="btn btn-secondary btn-sm btn-lesson-kanji" style="flex: 1;" data-lesson="${lesson}">Hán tự (${kCount})</button>
              <button class="btn btn-secondary btn-sm btn-lesson-grammar" style="flex: 1;" data-lesson="${lesson}">Ngữ pháp (${gCount})</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners
    grid.querySelectorAll('.btn-study-lesson').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lesson = btn.dataset.lesson;
        this.setLesson(lesson);
      });
    });

    grid.querySelectorAll('.btn-lesson-fc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lesson = btn.dataset.lesson;
        this.setLesson(lesson);
        window.flashcardEngine.setLessonFilter(lesson);
        window.flashcardEngine.category = 'all';
        window.flashcardEngine.refreshDeck();
        this.switchTab('flashcards');
      });
    });

    grid.querySelectorAll('.btn-lesson-quiz').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lesson = btn.dataset.lesson;
        this.setLesson(lesson);
        window.quizEngine.setLessonScope(lesson);
        this.switchTab('quiz');
      });
    });

    grid.querySelectorAll('.btn-lesson-vocab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lesson = btn.dataset.lesson;
        this.setLesson(lesson);
        this.switchTab('vocab');
      });
    });

    grid.querySelectorAll('.btn-lesson-kanji').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lesson = btn.dataset.lesson;
        this.setLesson(lesson);
        this.switchTab('kanji');
      });
    });

    grid.querySelectorAll('.btn-lesson-grammar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lesson = btn.dataset.lesson;
        this.setLesson(lesson);
        this.switchTab('grammar');
      });
    });
  }

  bindDashboardActions() {
    const actQuiz = document.getElementById('dash-action-quiz');
    const actFc = document.getElementById('dash-action-flashcards');
    const actVocab = document.getElementById('dash-action-vocab');
    const actKanji = document.getElementById('dash-action-kanji');
    const actGrammar = document.getElementById('dash-action-grammar');

    if (actQuiz) actQuiz.onclick = () => this.switchTab('quiz');
    if (actFc) actFc.onclick = () => this.switchTab('flashcards');
    if (actVocab) actVocab.onclick = () => this.switchTab('vocab');
    if (actKanji) actKanji.onclick = () => this.switchTab('kanji');
    if (actGrammar) actGrammar.onclick = () => this.switchTab('grammar');
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

    // Kanji Flashcard buttons
    const fcKanjiBtn = document.getElementById('btn-fc-kanji');
    if (fcKanjiBtn) {
      fcKanjiBtn.addEventListener('click', () => {
        window.flashcardEngine.category = 'kanji';
        window.flashcardEngine.kanjiSubType = 'all';
        window.flashcardEngine.setLessonFilter(this.kanjiLessonFilter);
        this.switchTab('flashcards');
      });
    }

    const fcKanjiOnBtn = document.getElementById('btn-fc-kanji-on');
    if (fcKanjiOnBtn) {
      fcKanjiOnBtn.addEventListener('click', () => {
        window.flashcardEngine.category = 'kanji';
        window.flashcardEngine.kanjiSubType = 'on';
        window.flashcardEngine.setLessonFilter(this.kanjiLessonFilter);
        this.switchTab('flashcards');
      });
    }

    const fcKanjiKunBtn = document.getElementById('btn-fc-kanji-kun');
    if (fcKanjiKunBtn) {
      fcKanjiKunBtn.addEventListener('click', () => {
        window.flashcardEngine.category = 'kanji';
        window.flashcardEngine.kanjiSubType = 'kun';
        window.flashcardEngine.setLessonFilter(this.kanjiLessonFilter);
        this.switchTab('flashcards');
      });
    }

    const fcKanjiCpBtn = document.getElementById('btn-fc-kanji-compounds');
    if (fcKanjiCpBtn) {
      fcKanjiCpBtn.addEventListener('click', () => {
        window.flashcardEngine.category = 'kanji';
        window.flashcardEngine.kanjiSubType = 'compound';
        window.flashcardEngine.setLessonFilter(this.kanjiLessonFilter);
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
        const lesson = btn.dataset.lesson;
        this.setLesson(lesson);
      });
    });
  }

  filterKanjiByLesson(lesson) {
    this.setLesson(lesson);
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
            <span class="badge" style="font-size: 0.72rem;">${k.lesson}</span>
            ${isLearned ? '<span style="color: var(--text-muted); font-size: 0.75rem; font-weight: 600;">Đã thuộc</span>' : ''}
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

    // Study this Kanji specifically (On, Kun, and Compounds individual flashcards)
    const studyKanjiBtn = document.getElementById('btn-modal-study-kanji');
    if (studyKanjiBtn) {
      studyKanjiBtn.onclick = () => {
        this.closeKanjiModal();
        window.flashcardEngine.loadDeck([k], 'kanji', 'all');
        this.switchTab('flashcards');
        this.showToast(`Luyện các thẻ riêng của chữ ${k.kanji} (${k.han_viet})`, 'info');
      };
    }

    const compoundsList = document.getElementById('modal-kanji-compounds');
    if (compoundsList) {
      if (k.compounds && k.compounds.length > 0) {
        compoundsList.innerHTML = k.compounds.map(c => `
          <div class="grammar-example-row" style="cursor: pointer;" data-word="${c.word}">
            <span style="font-size: 1.1rem; font-weight: 700; color: var(--text-heading);">${c.word}</span>
            <span style="color: var(--text-secondary); font-weight: 500;">${c.reading ? `(${c.reading})` : ''}</span>
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
        window.flashcardEngine.category = 'vocab';
        window.flashcardEngine.setLessonFilter(this.vocabLessonFilter);
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
        const lesson = btn.dataset.lesson;
        this.setLesson(lesson);
      });
    });
  }

  filterVocabByLesson(lesson) {
    this.setLesson(lesson);
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
            <span class="badge">${v.lesson} • ${v.part}</span>
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
        window.flashcardEngine.category = 'grammar';
        window.flashcardEngine.setLessonFilter(this.grammarLessonFilter);
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
        const lesson = btn.dataset.lesson;
        this.setLesson(lesson);
      });
    });
  }

  filterGrammarByLesson(lesson) {
    this.setLesson(lesson);
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
              <span class="badge">${g.lesson}</span>
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
