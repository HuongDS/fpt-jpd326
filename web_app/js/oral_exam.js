/**
 * Oral Exam Cram Module (Ôn Thi Vấn Đáp JPD326)
 * Quản lý danh sách câu hỏi vấn đáp trích xuất từ van_dap/cac_cau_hoi_van_dap.docx.
 * Hỗ trợ hiển thị gợi ý, ngữ pháp/từ vựng, câu trả lời mẫu, ghi chú cá nhân,
 * phát âm giọng chuẩn bản xứ và chế độ bốc thăm mô phỏng phòng thi 60 giây.
 */

class OralExamEngine {
  constructor() {
    this.questions = window.ORAL_EXAM_DATA || [];
    this.currentLessonFilter = 'all'; // 'all' | '第 6 課' | '第 7 課' | '第 8 課' | '第 9 課' | '第 10 課'
    this.searchQuery = '';
    this.hideAllAnswers = false; // Self-test mode (che câu trả lời mẫu để tự phản xạ)
    
    // Mock Interview State
    this.mockTimer = null;
    this.mockTimeRemaining = 60;
    this.mockQuestion = null;

    this.init();
  }

  init() {
    // 1. Lesson filter chips
    const filterContainer = document.getElementById('oral-lesson-chips');
    if (filterContainer) {
      filterContainer.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          filterContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.currentLessonFilter = chip.dataset.oralLesson;
          this.render();
          window.soundEngine.playChip();
        });
      });
    }

    // 2. Search input
    const searchInput = document.getElementById('oral-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    // 3. Toggle Hide/Reveal Sample Answers (Chế độ tự kiểm tra)
    const toggleHideBtn = document.getElementById('btn-oral-toggle-answers');
    if (toggleHideBtn) {
      toggleHideBtn.addEventListener('click', () => {
        this.hideAllAnswers = !this.hideAllAnswers;
        toggleHideBtn.classList.toggle('active', this.hideAllAnswers);
        toggleHideBtn.textContent = this.hideAllAnswers ? 'Đang che câu trả lời mẫu (Tự phản xạ)' : 'Hiện đầy đủ câu trả lời mẫu';
        window.soundEngine.playToggle(this.hideAllAnswers);
        this.render();
      });
    }

    // 4. Mock Interview Modal / Trigger
    const mockBtn = document.getElementById('btn-oral-mock-interview');
    if (mockBtn) {
      mockBtn.addEventListener('click', () => {
        this.startMockInterview();
      });
    }

    const closeMockBtn = document.getElementById('btn-close-mock-modal');
    if (closeMockBtn) {
      closeMockBtn.addEventListener('click', () => {
        this.stopMockInterview();
      });
    }

    const nextMockBtn = document.getElementById('btn-mock-next-q');
    if (nextMockBtn) {
      nextMockBtn.addEventListener('click', () => {
        this.startMockInterview();
      });
    }

    // Initial render
    this.render();
  }

  /**
   * Sets lesson scope when global lesson bar changes
   */
  setLessonScope(lesson) {
    this.currentLessonFilter = lesson || 'all';
    const filterContainer = document.getElementById('oral-lesson-chips');
    if (filterContainer) {
      filterContainer.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.oralLesson === this.currentLessonFilter);
      });
    }
    this.render();
  }

  /**
   * Filtered questions getter
   */
  getFilteredQuestions() {
    let list = this.questions;

    if (this.currentLessonFilter !== 'all') {
      list = list.filter(q => q.lesson === this.currentLessonFilter);
    }

    if (this.searchQuery) {
      list = list.filter(q => 
        q.question_jp.toLowerCase().includes(this.searchQuery) ||
        q.question_vi.toLowerCase().includes(this.searchQuery) ||
        q.title.toLowerCase().includes(this.searchQuery) ||
        (q.grammar_vocab && q.grammar_vocab.some(g => g.toLowerCase().includes(this.searchQuery))) ||
        (q.sample_answer_jp && q.sample_answer_jp.toLowerCase().includes(this.searchQuery))
      );
    }

    return list;
  }

  /**
   * Main render for question list
   */
  render() {
    const listRoot = document.getElementById('oral-questions-root');
    const countBadge = document.getElementById('oral-count-indicator');
    if (!listRoot) return;

    const list = this.getFilteredQuestions();

    if (countBadge) {
      countBadge.textContent = `Hiển thị: ${list.length} / ${this.questions.length} câu hỏi`;
    }

    if (list.length === 0) {
      listRoot.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 3.5rem 1rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 14px;">
          Không tìm thấy câu hỏi vấn đáp nào phù hợp với điều kiện tìm kiếm.
        </div>
      `;
      return;
    }

    listRoot.innerHTML = list.map((q, idx) => {
      const userSavedAns = localStorage.getItem(`jpd326_oral_ans_${q.id}`) || '';
      const isBlurred = this.hideAllAnswers;

      return `
        <article class="oral-card" id="card-${q.id}">
          <!-- Card Header -->
          <div class="oral-card-header">
            <div class="oral-header-meta">
              <span class="badge">${q.lesson}</span>
              <span class="oral-code-tag">${q.code}</span>
              <h4 class="oral-title-text">${q.title}</h4>
            </div>
            <div class="oral-header-actions">
              <button class="btn btn-secondary btn-sm btn-speak-question" data-text="${encodeURIComponent(q.question_jp)}" title="Nghe giám khảo đọc câu hỏi">
                Nghe câu hỏi
              </button>
            </div>
          </div>

          <!-- Question Box -->
          <div class="oral-question-box">
            <div class="oral-question-label">CÂU HỎI VẤN ĐÁP:</div>
            <div class="oral-question-jp jp-font">${q.question_jp}</div>
            <div class="oral-question-vi">${q.question_vi}</div>
          </div>

          <!-- Guide Points & Grammar/Vocab Grid -->
          <div class="oral-hints-grid">
            <!-- Left: Gợi ý trả lời -->
            <div class="oral-hint-column">
              <div class="hint-col-title">Gợi ý triển khai câu trả lời:</div>
              <ul class="hint-list">
                ${q.guide_points.map(pt => `<li>${pt}</li>`).join('')}
              </ul>
            </div>

            <!-- Right: Cấu trúc & Từ vựng -->
            <div class="oral-hint-column">
              <div class="hint-col-title">Ngữ pháp / Cấu trúc / Từ vựng trọng tâm:</div>
              <div class="vocab-chips-list">
                ${q.grammar_vocab.map(item => `
                  <div class="grammar-hint-item jp-font">${item}</div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Sample Model Answer Box -->
          <div class="oral-sample-box ${isBlurred ? 'blurred' : ''}" id="sample-box-${q.id}">
            <div class="oral-sample-header">
              <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-heading);">
                Câu trả lời mẫu tham khảo (Chuẩn Dekiru Chukyu):
              </div>
              <div class="sample-actions">
                <button class="icon-btn btn-sm btn-speak-answer" data-text="${encodeURIComponent(q.sample_answer_jp)}" title="Nghe phát âm câu trả lời mẫu">
                  Nghe bài mẫu
                </button>
                <button class="btn btn-secondary btn-sm btn-toggle-single-sample" data-target="sample-box-${q.id}">
                  ${isBlurred ? 'Hiện đáp án' : 'Ẩn đáp án'}
                </button>
              </div>
            </div>
            <div class="oral-sample-text jp-font">${q.sample_answer_jp}</div>
            <div class="oral-sample-vi">${q.sample_answer_vi}</div>
          </div>

          <!-- User Personal Response / Notes -->
          <div class="oral-user-notes-section">
            <div class="user-notes-header">
              <label for="oral-user-input-${q.id}" class="user-notes-label">
                Câu trả lời hoặc dàn ý cá nhân của bạn (Tự động lưu):
              </label>
              <button class="btn btn-secondary btn-sm btn-save-user-ans" data-id="${q.id}">Lưu ghi chú</button>
            </div>
            <textarea 
              id="oral-user-input-${q.id}" 
              class="oral-user-textarea jp-font" 
              placeholder="Gõ câu trả lời bằng tiếng Nhật hoặc gạch đầu dòng ý tưởng của riêng bạn tại đây..."
              rows="3"
            >${userSavedAns}</textarea>
          </div>
        </article>
      `;
    }).join('');

    // Attach listeners
    this.attachCardListeners(listRoot);
  }

  attachCardListeners(container) {
    // Speak Question
    container.querySelectorAll('.btn-speak-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.dataset.text);
        if (text) window.soundEngine.speakJapanese(text);
      });
    });

    // Speak Sample Answer
    container.querySelectorAll('.btn-speak-answer').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.dataset.text);
        if (text) window.soundEngine.speakJapanese(text);
      });
    });

    // Toggle single sample blur
    container.querySelectorAll('.btn-toggle-single-sample').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const box = document.getElementById(targetId);
        if (box) {
          const isCurrentlyBlurred = box.classList.contains('blurred');
          box.classList.toggle('blurred', !isCurrentlyBlurred);
          btn.textContent = !isCurrentlyBlurred ? 'Hiện đáp án' : 'Ẩn đáp án';
          window.soundEngine.playClick();
        }
      });
    });

    // Auto save and manual save user answer
    container.querySelectorAll('.oral-user-textarea').forEach(textarea => {
      const qId = textarea.id.replace('oral-user-input-', '');
      textarea.addEventListener('input', () => {
        localStorage.setItem(`jpd326_oral_ans_${qId}`, textarea.value);
      });
    });

    container.querySelectorAll('.btn-save-user-ans').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.dataset.id;
        const textarea = document.getElementById(`oral-user-input-${qId}`);
        if (textarea) {
          localStorage.setItem(`jpd326_oral_ans_${qId}`, textarea.value);
          window.soundEngine.playCorrect();
          window.app.showToast('Đã lưu câu trả lời cá nhân của bạn!', 'success');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // MOCK INTERVIEW MODE (Bốc thăm ngẫu nhiên mô phỏng phòng thi)
  // --------------------------------------------------------------------------

  startMockInterview() {
    if (this.questions.length === 0) return;

    // Pick random question from currently filtered set (or all)
    const list = this.getFilteredQuestions();
    const candidates = list.length > 0 ? list : this.questions;
    const randomQ = candidates[Math.floor(Math.random() * candidates.length)];
    this.mockQuestion = randomQ;

    const modal = document.getElementById('oral-mock-modal');
    if (!modal) return;

    modal.classList.add('active');

    // Populate modal elements
    const codeEl = document.getElementById('mock-q-code');
    const jpEl = document.getElementById('mock-q-jp');
    const viEl = document.getElementById('mock-q-vi');
    const answerWrap = document.getElementById('mock-answer-wrapper');
    const sampleJp = document.getElementById('mock-sample-jp');
    const sampleVi = document.getElementById('mock-sample-vi');
    const revealBtn = document.getElementById('btn-mock-reveal-sample');

    if (codeEl) codeEl.textContent = `${randomQ.lesson} • ${randomQ.code}: ${randomQ.title}`;
    if (jpEl) jpEl.textContent = randomQ.question_jp;
    if (viEl) viEl.textContent = randomQ.question_vi;

    if (sampleJp) sampleJp.textContent = randomQ.sample_answer_jp;
    if (sampleVi) sampleVi.textContent = randomQ.sample_answer_vi;

    if (answerWrap) answerWrap.style.display = 'none';
    if (revealBtn) {
      revealBtn.style.display = 'inline-flex';
      revealBtn.onclick = () => {
        if (answerWrap) answerWrap.style.display = 'block';
        revealBtn.style.display = 'none';
        window.soundEngine.playClick();
      };
    }

    // Auto speak question
    window.soundEngine.speakJapanese(randomQ.question_jp);

    // Speak button inside modal
    const speakModalBtn = document.getElementById('btn-mock-speak-q');
    if (speakModalBtn) {
      speakModalBtn.onclick = () => window.soundEngine.speakJapanese(randomQ.question_jp);
    }

    // Reset & Start 60s countdown
    this.startMockTimer(60);
    window.soundEngine.playStart();
  }

  startMockTimer(seconds = 60) {
    if (this.mockTimer) clearInterval(this.mockTimer);
    this.mockTimeRemaining = seconds;
    const timerEl = document.getElementById('mock-timer-display');
    const progressEl = document.getElementById('mock-timer-progress');

    const updateUI = () => {
      if (timerEl) timerEl.textContent = `${this.mockTimeRemaining}s`;
      if (progressEl) {
        const pct = (this.mockTimeRemaining / 60) * 100;
        progressEl.style.width = `${pct}%`;
      }
    };

    updateUI();

    this.mockTimer = setInterval(() => {
      this.mockTimeRemaining--;
      updateUI();

      if (this.mockTimeRemaining <= 5 && this.mockTimeRemaining > 0) {
        window.soundEngine.playTimerTick();
      }

      if (this.mockTimeRemaining <= 0) {
        clearInterval(this.mockTimer);
        this.mockTimer = null;
        window.soundEngine.playTimeout();
        if (timerEl) timerEl.textContent = 'HẾT GIỜ';
        // Auto reveal sample answer if not already revealed
        const answerWrap = document.getElementById('mock-answer-wrapper');
        const revealBtn = document.getElementById('btn-mock-reveal-sample');
        if (answerWrap) answerWrap.style.display = 'block';
        if (revealBtn) revealBtn.style.display = 'none';
      }
    }, 1000);
  }

  stopMockInterview() {
    if (this.mockTimer) {
      clearInterval(this.mockTimer);
      this.mockTimer = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const modal = document.getElementById('oral-mock-modal');
    if (modal) modal.classList.remove('active');
    window.soundEngine.playClick();
  }
}
