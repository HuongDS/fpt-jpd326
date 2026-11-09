/**
 * Oral Exam Cram Module (Ôn Thi Vấn Đáp JPD326)
 * Quản lý danh sách câu hỏi vấn đáp trích xuất từ van_dap/cac_cau_hoi_van_dap.docx.
 * Hỗ trợ hiển thị gợi ý, ngữ pháp/từ vựng, soạn câu trả lời cá nhân, xem chữ to,
 * mở rộng câu hỏi phụ và trả lời, phát âm chuẩn và chế độ bốc thăm 60 giây.
 */

class OralExamEngine {
  constructor() {
    this.questions = window.ORAL_EXAM_DATA || [];
    this.currentLessonFilter = 'all'; // 'all' | '第 6 課' | '第 7 課' | '第 8 課' | '第 9 課' | '第 10 課'
    this.searchQuery = '';
    
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

    // 3. Mock Interview Modal / Trigger
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

    // 4. Zoom Modal Events
    this.initZoomModalEvents();

    // Initial render
    this.render();
  }

  initZoomModalEvents() {
    const zoomModal = document.getElementById('oral-answer-zoom-modal');
    if (!zoomModal) return;

    const closeBtn1 = document.getElementById('btn-close-zoom-modal');
    const closeBtn2 = document.getElementById('btn-zoom-modal-close');

    const closeModal = () => {
      zoomModal.classList.remove('active');
      window.soundEngine.playClick();
    };

    if (closeBtn1) closeBtn1.addEventListener('click', closeModal);
    if (closeBtn2) closeBtn2.addEventListener('click', closeModal);

    zoomModal.addEventListener('click', (e) => {
      if (e.target === zoomModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && zoomModal.classList.contains('active')) {
        closeModal();
      }
    });

    const speakMainBtn = document.getElementById('btn-zoom-speak-main');
    if (speakMainBtn) {
      speakMainBtn.addEventListener('click', () => {
        const text = speakMainBtn.dataset.text || '';
        if (text) {
          window.soundEngine.speakJapanese(text);
        } else {
          window.app?.showToast('Hãy nhập câu trả lời tiếng Nhật của bạn để nghe phát âm!', 'info');
        }
      });
    }
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
      list = list.filter(q => {
        const userSavedAns = localStorage.getItem(`jpd326_oral_ans_${q.id}`) || '';
        const subList = this.getSubQuestions(q.id);
        const subText = subList.map(s => `${s.question} ${s.answer}`).join(' ');

        return (
          q.question_jp.toLowerCase().includes(this.searchQuery) ||
          q.question_vi.toLowerCase().includes(this.searchQuery) ||
          q.title.toLowerCase().includes(this.searchQuery) ||
          (q.grammar_vocab && q.grammar_vocab.some(g => g.toLowerCase().includes(this.searchQuery))) ||
          userSavedAns.toLowerCase().includes(this.searchQuery) ||
          subText.toLowerCase().includes(this.searchQuery)
        );
      });
    }

    return list;
  }

  /**
   * Helper: Get Sub Questions from localStorage
   */
  getSubQuestions(qId) {
    try {
      const raw = localStorage.getItem(`jpd326_oral_sub_qa_${qId}`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Helper: Save Sub Questions to localStorage
   */
  saveSubQuestions(qId, list) {
    try {
      localStorage.setItem(`jpd326_oral_sub_qa_${qId}`, JSON.stringify(list));
    } catch (e) {}
  }

  /**
   * Helper: Escape HTML
   */
  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Render list of sub questions HTML
   */
  renderSubQuestionsHtml(qId, subList) {
    if (!subList || subList.length === 0) {
      return `
        <div class="sub-qa-empty" id="sub-empty-${qId}">
          Chưa có câu hỏi phụ nào. Nhấn <strong>"+ Thêm câu hỏi phụ"</strong> để lưu các câu hỏi phụ mà giảng viên có thể hỏi thêm và câu trả lời để ôn thi!
        </div>
      `;
    }

    return subList.map((item, idx) => `
      <div class="sub-qa-item" id="sub-item-${item.id}">
        <div class="sub-item-header">
          <span class="sub-item-tag">Câu hỏi phụ #${idx + 1}</span>
          <div class="sub-item-actions">
            <button class="icon-btn btn-sm btn-speak-text" data-text="${encodeURIComponent(item.question)}" title="Nghe phát âm câu hỏi phụ">
              Nghe câu hỏi
            </button>
            <button class="icon-btn btn-sm btn-speak-text" data-text="${encodeURIComponent(item.answer)}" title="Nghe phát âm câu trả lời phụ">
              Nghe trả lời
            </button>
            <button class="icon-btn btn-sm btn-edit-sub" data-qid="${qId}" data-subid="${item.id}" title="Chỉnh sửa câu hỏi phụ này">
              Sửa
            </button>
            <button class="icon-btn btn-sm btn-delete-sub" data-qid="${qId}" data-subid="${item.id}" title="Xóa câu hỏi phụ này">
              Xóa
            </button>
          </div>
        </div>
        <div class="sub-item-content">
          <div class="sub-q-row">
            <span class="sub-q-label">Q:</span>
            <div class="sub-q-text jp-font">${this.escapeHtml(item.question)}</div>
          </div>
          <div class="sub-a-row">
            <span class="sub-a-label">A:</span>
            <div class="sub-a-text jp-font">${this.escapeHtml(item.answer)}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Open Zoom Modal to view answer and sub questions enlarged
   */
  openZoomModal(qId) {
    const q = this.questions.find(item => item.id === qId);
    if (!q) return;

    const modal = document.getElementById('oral-answer-zoom-modal');
    if (!modal) return;

    const lessonTag = document.getElementById('zoom-modal-lesson-tag');
    const qJp = document.getElementById('zoom-modal-q-jp');
    const qVi = document.getElementById('zoom-modal-q-vi');
    const mainAnsEl = document.getElementById('zoom-modal-main-ans');
    const speakMainBtn = document.getElementById('btn-zoom-speak-main');
    const subWrapper = document.getElementById('zoom-modal-sub-qa-wrapper');
    const subListEl = document.getElementById('zoom-modal-sub-qa-list');

    if (lessonTag) lessonTag.textContent = `${q.lesson} • ${q.code}: ${q.title}`;
    if (qJp) qJp.textContent = q.question_jp;
    if (qVi) qVi.textContent = q.question_vi;

    // Get latest answer text
    const textarea = document.getElementById(`oral-user-input-${qId}`);
    const userAns = textarea ? textarea.value.trim() : (localStorage.getItem(`jpd326_oral_ans_${qId}`) || '');

    if (mainAnsEl) {
      if (userAns) {
        mainAnsEl.textContent = userAns;
        mainAnsEl.style.fontStyle = 'normal';
        mainAnsEl.style.color = 'var(--text-heading)';
      } else {
        mainAnsEl.textContent = '(Chưa có nội dung câu trả lời. Hãy quay lại nhập câu trả lời của bạn ở danh sách câu hỏi nhé!)';
        mainAnsEl.style.fontStyle = 'italic';
        mainAnsEl.style.color = 'var(--text-muted)';
      }
    }

    if (speakMainBtn) {
      speakMainBtn.dataset.text = userAns;
    }

    // Load sub questions
    const subList = this.getSubQuestions(qId);
    if (subWrapper && subListEl) {
      if (subList.length > 0) {
        subWrapper.style.display = 'block';
        subListEl.innerHTML = subList.map((item, idx) => `
          <div class="sub-qa-item">
            <div class="sub-item-header">
              <span class="sub-item-tag">Câu hỏi phụ #${idx + 1}</span>
              <div class="sub-item-actions">
                <button class="icon-btn btn-sm btn-zoom-speak-item" data-text="${encodeURIComponent(item.question)}" title="Nghe câu hỏi phụ">
                  Nghe câu hỏi
                </button>
                <button class="icon-btn btn-sm btn-zoom-speak-item" data-text="${encodeURIComponent(item.answer)}" title="Nghe câu trả lời phụ">
                  Nghe trả lời
                </button>
              </div>
            </div>
            <div class="sub-item-content">
              <div class="sub-q-row">
                <span class="sub-q-label">Q:</span>
                <div class="sub-q-text jp-font" style="font-size: 1.15rem;">${this.escapeHtml(item.question)}</div>
              </div>
              <div class="sub-a-row" style="font-size: 1.25rem;">
                <span class="sub-a-label">A:</span>
                <div class="sub-a-text jp-font">${this.escapeHtml(item.answer)}</div>
              </div>
            </div>
          </div>
        `).join('');

        subListEl.querySelectorAll('.btn-zoom-speak-item').forEach(btn => {
          btn.addEventListener('click', () => {
            const text = decodeURIComponent(btn.dataset.text || '');
            if (text) window.soundEngine.speakJapanese(text);
          });
        });
      } else {
        subWrapper.style.display = 'none';
        subListEl.innerHTML = '';
      }
    }

    modal.classList.add('active');
    window.soundEngine.playClick();
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

    listRoot.innerHTML = list.map((q) => {
      const userSavedAns = localStorage.getItem(`jpd326_oral_ans_${q.id}`) || '';
      const subList = this.getSubQuestions(q.id);

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

          <!-- User Personal Response / Notes -->
          <div class="oral-user-notes-section">
            <div class="user-notes-header">
              <label for="oral-user-input-${q.id}" class="user-notes-label">
                Câu trả lời hoặc dàn ý cá nhân của bạn (Tự động lưu):
              </label>
              <div class="user-notes-action-bar">
                <button class="btn btn-secondary btn-sm btn-toggle-view-ans" data-id="${q.id}" title="Chuyển đổi giữa chế độ Xem chữ to và Soạn thảo">
                  <span class="btn-toggle-view-text">Xem bản to</span>
                </button>
                <button class="btn btn-secondary btn-sm btn-zoom-modal-open" data-id="${q.id}" title="Mở toàn màn hình xem câu trả lời và câu hỏi phụ">
                  Phóng to
                </button>
                <button class="icon-btn btn-sm btn-speak-user-ans" data-id="${q.id}" title="Nghe phát âm câu trả lời của bạn">
                  Phát âm
                </button>
                <button class="btn btn-secondary btn-sm btn-save-user-ans" data-id="${q.id}">Lưu ghi chú</button>
              </div>
            </div>

            <!-- Large formatted reading view (toggled by user) -->
            <div id="oral-user-preview-${q.id}" class="oral-user-answer-view jp-font" style="display: none;">
              ${userSavedAns ? this.escapeHtml(userSavedAns) : '<span style="color: var(--text-muted); font-style: italic;">Chưa có nội dung câu trả lời. Hãy bấm "Chỉnh sửa" để nhập câu trả lời của bạn!</span>'}
            </div>

            <!-- Editable textarea (with auto-resize) -->
            <textarea 
              id="oral-user-input-${q.id}" 
              class="oral-user-textarea jp-font" 
              placeholder="Gõ câu trả lời bằng tiếng Nhật hoặc gạch đầu dòng ý tưởng của riêng bạn tại đây..."
              rows="4"
            >${userSavedAns}</textarea>
          </div>

          <!-- Sub-questions Section (Câu hỏi phụ & Trả lời mở rộng) -->
          <div class="oral-sub-questions-container" id="sub-container-${q.id}">
            <div class="sub-header-bar">
              <div class="sub-title-group">
                <span class="sub-badge">Câu hỏi phụ</span>
                <span class="sub-title">Câu hỏi phụ của giảng viên & Câu trả lời ôn tập (<span id="sub-count-${q.id}">${subList.length}</span>)</span>
              </div>
              <button class="btn btn-primary btn-sm btn-open-sub-form" data-id="${q.id}" title="Thêm câu hỏi phụ và câu trả lời để ôn thi">
                + Thêm câu hỏi phụ
              </button>
            </div>
            <p class="sub-section-desc">
              Giám khảo thường hỏi thêm 1-2 câu hỏi phụ xoay quanh nội dung bạn vừa trình bày. Hãy nhập các câu hỏi phụ dự kiến và câu trả lời để chuẩn bị chu đáo nhất.
            </p>

            <!-- Inline Form to Add / Edit Sub QA -->
            <div class="sub-qa-form-card" id="sub-form-card-${q.id}" style="display: none;">
              <div class="sub-form-heading" id="sub-form-heading-${q.id}">Thêm câu hỏi phụ mới</div>
              <input type="hidden" id="sub-edit-id-${q.id}" value="">
              <div class="sub-form-field">
                <label class="sub-field-label">Câu hỏi phụ (Tiếng Nhật hoặc Tiếng Việt):</label>
                <input type="text" class="sub-field-input jp-font" id="sub-input-q-${q.id}" placeholder="Ví dụ: 昼ごはんは何を食べたらいいですか？ (hoặc: Bạn khuyên nên ăn món gì?)">
              </div>
              <div class="sub-form-field">
                <label class="sub-field-label">Câu trả lời phụ của bạn (Tiếng Nhật):</label>
                <textarea class="sub-field-textarea jp-font" id="sub-input-a-${q.id}" rows="3" placeholder="Ví dụ: ハノイのフォーやブンチャーが一番おすすめです。旧市街に有名なお店がたくさんあります。"></textarea>
              </div>
              <div class="sub-form-actions">
                <button class="btn btn-secondary btn-sm btn-cancel-sub" data-id="${q.id}">Hủy</button>
                <button class="btn btn-primary btn-sm btn-save-sub" data-id="${q.id}">Lưu câu hỏi phụ</button>
              </div>
            </div>

            <!-- Sub Questions List -->
            <div class="sub-qa-list" id="sub-list-${q.id}">
              ${this.renderSubQuestionsHtml(q.id, subList)}
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach listeners
    this.attachCardListeners(listRoot);
  }

  updateSubQuestionsUi(qId) {
    const subList = this.getSubQuestions(qId);
    const countEl = document.getElementById(`sub-count-${qId}`);
    const listEl = document.getElementById(`sub-list-${qId}`);
    if (countEl) countEl.textContent = subList.length;
    if (listEl) {
      listEl.innerHTML = this.renderSubQuestionsHtml(qId, subList);
      this.attachSubListListeners(listEl, qId);
    }
  }

  attachSubListListeners(listContainer, qId) {
    // Speak sub text
    listContainer.querySelectorAll('.btn-speak-text').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.dataset.text || '');
        if (text) window.soundEngine.speakJapanese(text);
      });
    });

    // Edit sub QA
    listContainer.querySelectorAll('.btn-edit-sub').forEach(btn => {
      btn.addEventListener('click', () => {
        const subId = btn.dataset.subid;
        const subList = this.getSubQuestions(qId);
        const item = subList.find(s => s.id === subId);
        if (!item) return;

        const formCard = document.getElementById(`sub-form-card-${qId}`);
        const heading = document.getElementById(`sub-form-heading-${qId}`);
        const editIdInput = document.getElementById(`sub-edit-id-${qId}`);
        const qInput = document.getElementById(`sub-input-q-${qId}`);
        const aInput = document.getElementById(`sub-input-a-${qId}`);

        if (heading) heading.textContent = 'Chỉnh sửa câu hỏi phụ';
        if (editIdInput) editIdInput.value = item.id;
        if (qInput) qInput.value = item.question;
        if (aInput) aInput.value = item.answer;

        if (formCard) {
          formCard.style.display = 'block';
          formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (qInput) qInput.focus();
        }
      });
    });

    // Delete sub QA
    listContainer.querySelectorAll('.btn-delete-sub').forEach(btn => {
      btn.addEventListener('click', () => {
        const subId = btn.dataset.subid;
        if (confirm('Bạn có chắc chắn muốn xóa câu hỏi phụ này không?')) {
          let subList = this.getSubQuestions(qId);
          subList = subList.filter(s => s.id !== subId);
          this.saveSubQuestions(qId, subList);
          this.updateSubQuestionsUi(qId);
          window.soundEngine.playWrong();
          window.app?.showToast('Đã xóa câu hỏi phụ!', 'info');
        }
      });
    });
  }

  attachCardListeners(container) {
    // Speak Question
    container.querySelectorAll('.btn-speak-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.dataset.text);
        if (text) window.soundEngine.speakJapanese(text);
      });
    });

    // Speak Main User Answer
    container.querySelectorAll('.btn-speak-user-ans').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.dataset.id;
        const textarea = document.getElementById(`oral-user-input-${qId}`);
        const text = textarea ? textarea.value.trim() : '';
        if (text) {
          window.soundEngine.speakJapanese(text);
        } else {
          window.app?.showToast('Hãy nhập câu trả lời tiếng Nhật của bạn để nghe phát âm!', 'info');
        }
      });
    });

    // Toggle View Mode (Xem bản to vs Chỉnh sửa)
    container.querySelectorAll('.btn-toggle-view-ans').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.dataset.id;
        const textarea = document.getElementById(`oral-user-input-${qId}`);
        const preview = document.getElementById(`oral-user-preview-${qId}`);
        const textSpan = btn.querySelector('.btn-toggle-view-text') || btn;
        if (!textarea || !preview) return;

        const isViewing = preview.style.display !== 'none';
        if (isViewing) {
          // Switch to edit mode
          preview.style.display = 'none';
          textarea.style.display = 'block';
          textSpan.textContent = 'Xem bản to';
          btn.classList.remove('active');
          textarea.focus();
        } else {
          // Switch to view mode (update preview content first)
          const currentText = textarea.value.trim();
          preview.innerHTML = currentText
            ? this.escapeHtml(currentText)
            : '<span style="color: var(--text-muted); font-style: italic;">Chưa có nội dung câu trả lời. Hãy bấm "Chỉnh sửa" để nhập câu trả lời của bạn!</span>';
          textarea.style.display = 'none';
          preview.style.display = 'block';
          textSpan.textContent = 'Chỉnh sửa';
          btn.classList.add('active');
        }
        window.soundEngine.playClick();
      });
    });

    // Open Zoom Modal
    container.querySelectorAll('.btn-zoom-modal-open').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.dataset.id;
        this.openZoomModal(qId);
      });
    });

    // Auto save, manual save and auto-resize textarea
    container.querySelectorAll('.oral-user-textarea').forEach(textarea => {
      const qId = textarea.id.replace('oral-user-input-', '');

      // Auto-resize on initial load
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(125, textarea.scrollHeight) + 'px';

      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(125, textarea.scrollHeight) + 'px';
        localStorage.setItem(`jpd326_oral_ans_${qId}`, textarea.value);

        const preview = document.getElementById(`oral-user-preview-${qId}`);
        if (preview && preview.style.display !== 'none') {
          preview.innerHTML = textarea.value.trim()
            ? this.escapeHtml(textarea.value.trim())
            : '<span style="color: var(--text-muted); font-style: italic;">Chưa có nội dung câu trả lời. Hãy bấm "Chỉnh sửa" để nhập câu trả lời của bạn!</span>';
        }
      });
    });

    container.querySelectorAll('.btn-save-user-ans').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.dataset.id;
        const textarea = document.getElementById(`oral-user-input-${qId}`);
        if (textarea) {
          localStorage.setItem(`jpd326_oral_ans_${qId}`, textarea.value);
          window.soundEngine.playCorrect();
          window.app?.showToast('Đã lưu câu trả lời cá nhân của bạn!', 'success');
        }
      });
    });

    // Sub-questions form operations
    container.querySelectorAll('.btn-open-sub-form').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.dataset.id;
        const formCard = document.getElementById(`sub-form-card-${qId}`);
        const heading = document.getElementById(`sub-form-heading-${qId}`);
        const editIdInput = document.getElementById(`sub-edit-id-${qId}`);
        const qInput = document.getElementById(`sub-input-q-${qId}`);
        const aInput = document.getElementById(`sub-input-a-${qId}`);

        if (heading) heading.textContent = 'Thêm câu hỏi phụ mới';
        if (editIdInput) editIdInput.value = '';
        if (qInput) qInput.value = '';
        if (aInput) aInput.value = '';

        if (formCard) {
          formCard.style.display = 'block';
          formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          if (qInput) qInput.focus();
        }
        window.soundEngine.playClick();
      });
    });

    container.querySelectorAll('.btn-cancel-sub').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.dataset.id;
        const formCard = document.getElementById(`sub-form-card-${qId}`);
        if (formCard) formCard.style.display = 'none';
        window.soundEngine.playClick();
      });
    });

    container.querySelectorAll('.btn-save-sub').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.dataset.id;
        const editIdInput = document.getElementById(`sub-edit-id-${qId}`);
        const qInput = document.getElementById(`sub-input-q-${qId}`);
        const aInput = document.getElementById(`sub-input-a-${qId}`);
        const formCard = document.getElementById(`sub-form-card-${qId}`);

        const qText = qInput ? qInput.value.trim() : '';
        const aText = aInput ? aInput.value.trim() : '';

        if (!qText || !aText) {
          window.app?.showToast('Vui lòng nhập cả câu hỏi phụ và câu trả lời!', 'warning');
          return;
        }

        let subList = this.getSubQuestions(qId);
        const editId = editIdInput ? editIdInput.value : '';

        if (editId) {
          // Update existing
          subList = subList.map(item => item.id === editId ? { ...item, question: qText, answer: aText } : item);
          window.app?.showToast('Đã cập nhật câu hỏi phụ thành công!', 'success');
        } else {
          // Add new
          const newItem = {
            id: 'sub_' + Date.now(),
            question: qText,
            answer: aText
          };
          subList.push(newItem);
          window.app?.showToast('Đã thêm câu hỏi phụ mới thành công!', 'success');
        }

        this.saveSubQuestions(qId, subList);
        this.updateSubQuestionsUi(qId);

        if (formCard) formCard.style.display = 'none';
        window.soundEngine.playCorrect();
      });
    });

    // Attach listeners to all sub question lists initially
    container.querySelectorAll('.sub-qa-list').forEach(listEl => {
      const qId = listEl.id.replace('sub-list-', '');
      this.attachSubListListeners(listEl, qId);
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

    const userSavedAns = localStorage.getItem(`jpd326_oral_ans_${randomQ.id}`) || '';
    const subList = this.getSubQuestions(randomQ.id);

    if (sampleJp) {
      if (userSavedAns) {
        let contentHtml = `<div style="margin-bottom: 0.75rem; font-size: 1.15rem; line-height: 1.8;">${this.escapeHtml(userSavedAns)}</div>`;
        if (subList.length > 0) {
          contentHtml += `
            <div style="border-top: 1px dashed var(--border-subtle); padding-top: 0.75rem; margin-top: 0.75rem;">
              <div style="font-size: 0.8rem; font-weight: 700; color: #EA580C; margin-bottom: 0.45rem; text-transform: uppercase;">
                CÂU HỎI PHỤ ĐỐI ĐÁP (${subList.length} CÂU):
              </div>
              ${subList.map((s, idx) => `
                <div style="margin-bottom: 0.65rem; font-size: 0.95rem;">
                  <div style="color: var(--text-heading); font-weight: 700;">Q${idx + 1}: ${this.escapeHtml(s.question)}</div>
                  <div style="color: var(--text-primary); margin-top: 0.2rem; padding-left: 0.5rem; border-left: 2px solid #F27024;">A: ${this.escapeHtml(s.answer)}</div>
                </div>
              `).join('')}
            </div>
          `;
        }
        sampleJp.innerHTML = contentHtml;
      } else {
        sampleJp.textContent = 'Bạn chưa soạn câu trả lời cho câu hỏi này. Hãy nhập câu trả lời ở danh sách câu hỏi bên ngoài!';
      }
    }

    if (sampleVi) {
      sampleVi.textContent = '';
      sampleVi.style.display = 'none';
    }

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
        if (this.mockTimeRemaining <= 10) {
          progressEl.style.background = '#EF4444';
          timerEl.style.color = '#EF4444';
        } else {
          progressEl.style.background = 'var(--text-primary)';
          timerEl.style.color = 'var(--text-heading)';
        }
      }
    };

    updateUI();

    this.mockTimer = setInterval(() => {
      this.mockTimeRemaining--;
      updateUI();

      if (this.mockTimeRemaining <= 0) {
        clearInterval(this.mockTimer);
        window.soundEngine.playWrong();
        window.app?.showToast('Hết thời gian 60 giây!', 'warning');
      }
    }, 1000);
  }

  stopMockInterview() {
    if (this.mockTimer) clearInterval(this.mockTimer);
    const modal = document.getElementById('oral-mock-modal');
    if (modal) modal.classList.remove('active');
    window.soundEngine.playClick();
  }
}

window.OralExamEngine = OralExamEngine;
