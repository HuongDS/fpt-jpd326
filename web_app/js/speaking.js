/**
 * Speaking & Conversation Practice Engine (Ôn Speaking Hội Thoại)
 * Supports situation selection, importing Role B dialogue via .txt files (bullet per line),
 * turn-by-turn input for Role A, interactive roleplay practice, and Web Speech audio playback.
 */

class SpeakingEngine {
  constructor() {
    this.situations = window.SPEAKING_DATA || [];
    this.currentSitIndex = 0;
    this.turns = []; // [{ a: '', b: '', vi_a: '', vi_b: '' }]
    this.currentTurnIdxA = 0;
    this.firstSpeaker = 'a'; // 'a' | 'b' (Người A nói trước vs Người B nói trước)
    this.roleplayRole = 'none'; // 'a' | 'b' | 'none'
    this.hideMyRole = false;
    this.isPlayingAll = false;
    this.playAllTimeout = null;

    this.init();
  }

  init() {
    // 1. Situation selector chips
    const sitChipsContainer = document.getElementById('speaking-situation-chips');
    if (sitChipsContainer) {
      sitChipsContainer.innerHTML = this.situations.map((sit, idx) => `
        <button class="filter-chip ${idx === 0 ? 'active' : ''}" data-sit-idx="${idx}">
          ${sit.code}
        </button>
      `).join('');

      sitChipsContainer.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          sitChipsContainer.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const idx = parseInt(btn.dataset.sitIdx, 10);
          this.selectSituation(idx);
        });
      });
    }

    // 2. Role B File Upload (.txt)
    const bFileInput = document.getElementById('speaking-b-file-input');
    const bUploadBtn = document.getElementById('btn-upload-b-file');
    if (bUploadBtn && bFileInput) {
      bUploadBtn.addEventListener('click', () => bFileInput.click());
      bFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) this.handleBFile(file);
      });
    }

    // 3. Role B Paste/Apply button
    const bApplyBtn = document.getElementById('btn-apply-b-txt');
    if (bApplyBtn) {
      bApplyBtn.addEventListener('click', () => {
        const textarea = document.getElementById('speaking-b-raw-input');
        if (textarea) this.applyBText(textarea.value);
      });
    }

    // 4. Role A Turn Input controls
    const aNextBtn = document.getElementById('btn-a-save-next');
    const aPrevBtn = document.getElementById('btn-a-prev');
    const aAddTurnBtn = document.getElementById('btn-a-add-turn');
    const aInput = document.getElementById('speaking-a-turn-input');

    if (aNextBtn && aInput) {
      aNextBtn.addEventListener('click', () => this.saveCurrentTurnA(true));
      aInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.saveCurrentTurnA(true);
        }
      });
    }

    if (aPrevBtn) {
      aPrevBtn.addEventListener('click', () => this.goToPrevTurnA());
    }

    if (aAddTurnBtn) {
      aAddTurnBtn.addEventListener('click', () => {
        this.addNewTurn();
        window.soundEngine.playChip();
      });
    }

    // 5. Practice & Roleplay controls
    const playAllBtn = document.getElementById('btn-speaking-play-all');
    if (playAllBtn) {
      playAllBtn.addEventListener('click', () => this.togglePlayAll());
    }

    const resetSampleBtn = document.getElementById('btn-speaking-reset-sample');
    if (resetSampleBtn) {
      resetSampleBtn.addEventListener('click', () => {
        if (confirm('Khôi phục lại kịch bản hội thoại mẫu chuẩn của tình huống này?')) {
          this.resetToDefaultSample();
        }
      });
    }

    const exportTxtBtn = document.getElementById('btn-speaking-export-txt');
    if (exportTxtBtn) {
      exportTxtBtn.addEventListener('click', () => this.exportScriptTxt());
    }

    const roleplaySelector = document.getElementById('speaking-roleplay-mode');
    if (roleplaySelector) {
      roleplaySelector.addEventListener('change', (e) => {
        this.roleplayRole = e.target.value;
        this.renderTimeline();
      });
    }

    const hideToggleBtn = document.getElementById('btn-toggle-hide-role');
    if (hideToggleBtn) {
      hideToggleBtn.addEventListener('click', () => {
        this.hideMyRole = !this.hideMyRole;
        hideToggleBtn.classList.toggle('active', this.hideMyRole);
        hideToggleBtn.textContent = this.hideMyRole ? 'Đang che lời thoại (Tự phản xạ)' : 'Hiện đầy đủ lời thoại';
        window.soundEngine.playToggle(this.hideMyRole);
        this.renderTimeline();
      });
    }

    // 6. First Speaker Order Controls (Người A nói trước vs Người B nói trước)
    document.querySelectorAll('.speaker-order-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.dataset.firstSpeaker;
        if (role) this.setFirstSpeaker(role);
      });
    });

    // Load first situation
    this.selectSituation(0);
  }

  /**
   * Switches to selected situation
   */
  selectSituation(index) {
    if (this.isPlayingAll) this.stopPlayAll();
    this.currentSitIndex = index;
    const sit = this.situations[index];
    if (!sit) return;

    // Load persisted turns from localStorage or fallback to defaults
    const storageKey = `jpd326_speaking_${sit.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        this.turns = JSON.parse(saved);
      } catch (e) {
        this.turns = JSON.parse(JSON.stringify(sit.default_turns));
      }
    } else {
      this.turns = JSON.parse(JSON.stringify(sit.default_turns));
    }

    this.currentTurnIdxA = 0;

    // Load persisted first speaker order or situation default
    const savedFirst = localStorage.getItem(`jpd326_speaking_${sit.id}_first_speaker`);
    if (savedFirst === 'a' || savedFirst === 'b') {
      this.firstSpeaker = savedFirst;
    } else if (sit.default_first_speaker) {
      this.firstSpeaker = sit.default_first_speaker;
    } else {
      this.firstSpeaker = 'a';
    }
    this.updateFirstSpeakerUI();

    this.renderSituationDetails(sit);
    this.populateBTextarea();
    this.renderTurnAEditor();
    this.renderTimeline();
  }

  /**
   * Sets who initiates the conversation (A speaks first vs B speaks first)
   */
  setFirstSpeaker(role) {
    if (role !== 'a' && role !== 'b') return;
    this.firstSpeaker = role;

    const sit = this.situations[this.currentSitIndex];
    if (sit) {
      localStorage.setItem(`jpd326_speaking_${sit.id}_first_speaker`, role);
    }

    this.updateFirstSpeakerUI();
    this.renderTurnAEditor();
    this.renderTimeline();

    if (window.soundEngine) {
      window.soundEngine.playToggle(role === 'b');
    }
    const label = role === 'b' ? 'Người B nói trước (B ➔ A)' : 'Người A nói trước (A ➔ B)';
    window.app?.showToast(`Đã chọn thứ tự: ${label}`, 'info');
  }

  /**
   * Synchronizes active state across all speaker-order-btn elements
   */
  updateFirstSpeakerUI() {
    document.querySelectorAll('.speaker-order-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.firstSpeaker === this.firstSpeaker);
    });
    const bHint = document.getElementById('speaking-b-order-hint');
    if (bHint) {
      bHint.textContent = this.firstSpeaker === 'b'
        ? '(Người B mở lời trước — Lượt 1 của file là câu mở đầu cuộc trò chuyện)'
        : '(Người A mở lời trước — Người B đáp lại câu nói của A)';
    }
  }

  /**
   * Filters / selects first situation matching selected lesson
   */
  filterByLesson(lesson) {
    if (!lesson || lesson === 'all') return;
    const matchIdx = this.situations.findIndex(s => s.lesson === lesson);
    if (matchIdx !== -1 && matchIdx !== this.currentSitIndex) {
      const sitChipsContainer = document.getElementById('speaking-situation-chips');
      if (sitChipsContainer) {
        sitChipsContainer.querySelectorAll('.filter-chip').forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.sitIdx, 10) === matchIdx);
        });
      }
      this.selectSituation(matchIdx);
    }
  }

  /**
   * Saves current conversation data for active situation to localStorage
   */
  saveTurns() {
    const sit = this.situations[this.currentSitIndex];
    if (!sit) return;
    localStorage.setItem(`jpd326_speaking_${sit.id}`, JSON.stringify(this.turns));
  }

  /**
   * Renders the situation description card
   */
  renderSituationDetails(sit) {
    const titleEl = document.getElementById('speaking-sit-title');
    const badgeEl = document.getElementById('speaking-sit-badge');
    const roleAEl = document.getElementById('speaking-role-a-task');
    const roleBEl = document.getElementById('speaking-role-b-task');
    const extraEl = document.getElementById('speaking-extra-info');

    if (titleEl) titleEl.textContent = `${sit.code}: ${sit.title}`;
    if (badgeEl) badgeEl.textContent = sit.lesson;

    if (roleAEl) {
      roleAEl.innerHTML = `
        <div style="font-weight: 700; color: var(--text-heading); margin-bottom: 0.25rem;">${sit.roleA.name}:</div>
        <div class="jp-font" style="font-size: 0.95rem; margin-bottom: 0.35rem; line-height: 1.5;">${sit.roleA.task_jp}</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">${sit.roleA.task_vi}</div>
      `;
    }

    if (roleBEl) {
      roleBEl.innerHTML = `
        <div style="font-weight: 700; color: var(--text-heading); margin-bottom: 0.25rem;">${sit.roleB.name}:</div>
        <div class="jp-font" style="font-size: 0.95rem; margin-bottom: 0.35rem; line-height: 1.5;">${sit.roleB.task_jp}</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">${sit.roleB.task_vi}</div>
      `;
    }

    if (extraEl) {
      if (sit.extra_info && sit.extra_info.length > 0) {
        extraEl.innerHTML = sit.extra_info.map(info => `
          <div style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 0.2rem;">${info}</div>
        `).join('');
        extraEl.style.display = 'block';
      } else {
        extraEl.style.display = 'none';
      }
    }
  }

  // --------------------------------------------------------------------------
  // ROLE B: IMPORT VIA .TXT FILE (Mỗi gạch đầu dòng là 1 lượt nói)
  // --------------------------------------------------------------------------

  /**
   * Pre-fills the Role B textarea with the current turns formatted with bullets
   */
  populateBTextarea() {
    const textarea = document.getElementById('speaking-b-raw-input');
    if (!textarea) return;

    const bLines = this.turns.map(t => `- ${t.b || ''}`);
    textarea.value = bLines.join('\n');
  }

  /**
   * Handles uploaded .txt file for Role B
   */
  handleBFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const textarea = document.getElementById('speaking-b-raw-input');
      if (textarea) textarea.value = content;
      this.applyBText(content);
      window.app.showToast(`Đã tải lên và nạp file thoại Người B thành công!`, 'success');
      window.soundEngine.playCorrect();
    };
    reader.readAsText(file, 'UTF-8');
  }

  /**
   * Parses bullet points from .txt text and maps each bullet to each turn of B
   */
  applyBText(rawText) {
    if (!rawText) return;

    // Split text into lines and extract bullets starting with -, *, ・, or non-empty lines
    const lines = rawText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Strip leading dash, bullet, asterisk, numbers like '1.', '- '
        return line.replace(/^[\-\*\•\・\d+\.]+\s*/, '').trim();
      })
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      window.app.showToast('File hoặc văn bản không có nội dung hợp lệ!', 'warning');
      return;
    }

    // Expand this.turns if B has more turns than currently exist
    while (this.turns.length < lines.length) {
      this.turns.push({ a: '', b: '', vi_a: '', vi_b: '' });
    }

    // Assign each bullet to each turn of B
    lines.forEach((text, idx) => {
      if (this.turns[idx]) {
        this.turns[idx].b = text;
      }
    });

    this.saveTurns();
    this.renderTurnAEditor();
    this.renderTimeline();
    window.app.showToast(`Đã cập nhật ${lines.length} lượt thoại cho Người B!`, 'info');
    window.soundEngine.playChip();
  }

  // --------------------------------------------------------------------------
  // ROLE A: TURN-BY-TURN STEPPER INPUT (Nhập lần lượt từng câu)
  // --------------------------------------------------------------------------

  /**
   * Renders the editor for current turn of Role A
   */
  renderTurnAEditor() {
    if (this.turns.length === 0) {
      this.turns.push({ a: '', b: '', vi_a: '', vi_b: '' });
    }

    if (this.currentTurnIdxA >= this.turns.length) {
      this.currentTurnIdxA = this.turns.length - 1;
    }
    if (this.currentTurnIdxA < 0) this.currentTurnIdxA = 0;

    const currentTurn = this.turns[this.currentTurnIdxA];
    const indicator = document.getElementById('speaking-a-turn-indicator');
    const input = document.getElementById('speaking-a-turn-input');
    const inputLabel = document.getElementById('speaking-a-input-label');
    const bContextBox = document.getElementById('speaking-a-b-context');
    const prevBtn = document.getElementById('btn-a-prev');

    if (indicator) {
      indicator.textContent = `Lượt nói số ${this.currentTurnIdxA + 1} / ${this.turns.length}`;
    }

    if (inputLabel) {
      if (this.firstSpeaker === 'b') {
        inputLabel.innerHTML = `Câu thoại <strong>Người A đáp lại</strong> Người B ở lượt này:`;
      } else {
        inputLabel.innerHTML = `Câu thoại tiếng Nhật của <strong>Người A mở lời</strong> ở lượt này:`;
      }
    }

    if (input) {
      input.value = currentTurn.a || '';
      input.placeholder = this.firstSpeaker === 'b'
        ? 'Nhập câu thoại của Người A đáp lại lời Người B...'
        : 'Ví dụ: 最近、なんだか食欲がなくて... どうしたらいいでしょうか。';
      input.focus();
    }

    if (prevBtn) {
      prevBtn.disabled = this.currentTurnIdxA === 0;
    }

    if (bContextBox) {
      const hasB = currentTurn.b && currentTurn.b.trim();
      if (this.firstSpeaker === 'b') {
        if (hasB) {
          bContextBox.innerHTML = `
            <div style="font-size: 0.78rem; font-weight: 700; color: #3B82F6; margin-bottom: 0.2rem; display: flex; align-items: center; gap: 4px;">
              <span>🗣️ CÂU NÓI TRƯỚC CỦA NGƯỜI B (LƯỢT ${this.currentTurnIdxA + 1}):</span>
            </div>
            <div class="jp-font" style="font-weight: 600; color: var(--text-heading); font-size: 0.96rem; line-height: 1.5;">
              「 ${currentTurn.b} 」
            </div>
          `;
          bContextBox.style.display = 'block';
        } else {
          bContextBox.innerHTML = `
            <div style="font-size: 0.78rem; color: var(--text-muted); font-style: italic;">
              (Người B nói trước nhưng chưa có câu thoại ở lượt này. Bạn có thể nạp file thoại B ở khung bên phải).
            </div>
          `;
          bContextBox.style.display = 'block';
        }
      } else {
        if (hasB) {
          bContextBox.innerHTML = `
            <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.2rem;">LƯỢT NÓI CỦA NGƯỜI B ĐỐI ĐÁP LẠI (LƯỢT ${this.currentTurnIdxA + 1}):</div>
            <div class="jp-font" style="font-weight: 600; color: var(--text-heading); font-size: 0.95rem;">
              「 ${currentTurn.b} 」
            </div>
          `;
          bContextBox.style.display = 'block';
        } else {
          bContextBox.innerHTML = `
            <div style="font-size: 0.78rem; color: var(--text-muted); font-style: italic;">
              (Người B chưa có câu thoại ở lượt này. Bạn có thể nạp file thoại B ở khung bên phải).
            </div>
          `;
          bContextBox.style.display = 'block';
        }
      }
    }
  }

  /**
   * Saves current turn for Role A and advances to next turn
   */
  saveCurrentTurnA(advanceToNext = true) {
    const input = document.getElementById('speaking-a-turn-input');
    if (!input) return;

    const text = input.value.trim();
    if (!this.turns[this.currentTurnIdxA]) {
      this.turns[this.currentTurnIdxA] = { a: '', b: '', vi_a: '', vi_b: '' };
    }
    this.turns[this.currentTurnIdxA].a = text;
    this.saveTurns();
    this.renderTimeline();

    if (advanceToNext) {
      if (this.currentTurnIdxA + 1 < this.turns.length) {
        this.currentTurnIdxA++;
        this.renderTurnAEditor();
        window.soundEngine.playClick();
      } else {
        // Prompt to add a new turn or wrap up
        window.soundEngine.playCorrect();
        window.app.showToast(`Đã lưu lượt nói số ${this.currentTurnIdxA + 1} của Người A!`, 'success');
      }
    }
  }

  goToPrevTurnA() {
    if (this.currentTurnIdxA > 0) {
      this.currentTurnIdxA--;
      this.renderTurnAEditor();
      window.soundEngine.playClick();
    }
  }

  addNewTurn() {
    this.turns.push({ a: '', b: '', vi_a: '', vi_b: '' });
    this.currentTurnIdxA = this.turns.length - 1;
    this.saveTurns();
    this.renderTurnAEditor();
    this.renderTimeline();
    window.app.showToast(`Đã thêm lượt đối thoại mới (Lượt ${this.turns.length})`, 'info');
  }

  deleteTurn(index) {
    if (this.turns.length <= 1) {
      this.turns = [{ a: '', b: '', vi_a: '', vi_b: '' }];
    } else {
      this.turns.splice(index, 1);
    }
    if (this.currentTurnIdxA >= this.turns.length) {
      this.currentTurnIdxA = this.turns.length - 1;
    }
    this.saveTurns();
    this.populateBTextarea();
    this.renderTurnAEditor();
    this.renderTimeline();
    window.soundEngine.playChip();
  }

  // --------------------------------------------------------------------------
  // INTERACTIVE TIMELINE / CHAT SCRIPT DISPLAY
  // --------------------------------------------------------------------------

  renderTimeline() {
    const container = document.getElementById('speaking-timeline-root');
    if (!container) return;

    if (this.turns.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 3rem;">Chưa có lượt thoại nào. Hãy nhập thoại ở trên.</div>`;
      return;
    }

    container.innerHTML = this.turns.map((turn, idx) => {
      // Check blur/hidden state depending on roleplay mode
      const hideA = (this.roleplayRole === 'a' && this.hideMyRole);
      const hideB = (this.roleplayRole === 'b' && this.hideMyRole);

      const bubbleA = `
        <!-- Bubble A (Người A) -->
        <div class="chat-turn-item side-a ${hideA ? 'blurred' : ''}" data-role="a">
          <div class="chat-speaker-header">
            <div class="speaker-meta">
              <span class="speaker-pill a">Người A</span>
              <span class="speaker-order-tag">${this.firstSpeaker === 'a' ? '1. Mở lời' : '2. Đáp lại'}</span>
            </div>
            <div class="chat-actions">
              <button class="icon-btn btn-sm btn-speak-turn" data-text="${encodeURIComponent(turn.a || '')}" title="Nghe phát âm câu A">Nghe</button>
              <button class="icon-btn btn-sm btn-edit-turn-a" data-idx="${idx}" title="Chỉnh sửa câu A này">Sửa</button>
            </div>
          </div>
          <div class="chat-bubble-text jp-font">${turn.a || '<span style="color: var(--text-muted); font-style: italic;">(Chưa nhập câu thoại của A)</span>'}</div>
          ${hideA ? `<button class="btn btn-sm btn-reveal-secret" data-target="a-${idx}">Bấm để xem lời thoại</button>` : ''}
        </div>
      `;

      const bubbleB = `
        <!-- Bubble B (Người B) -->
        <div class="chat-turn-item side-b ${hideB ? 'blurred' : ''}" data-role="b">
          <div class="chat-speaker-header">
            <div class="speaker-meta">
              <span class="speaker-pill b">Người B</span>
              <span class="speaker-order-tag">${this.firstSpeaker === 'b' ? '1. Mở lời' : '2. Đáp lại'}</span>
            </div>
            <div class="chat-actions">
              <button class="icon-btn btn-sm btn-speak-turn" data-text="${encodeURIComponent(turn.b || '')}" title="Nghe phát âm câu B">Nghe</button>
              <button class="icon-btn btn-sm btn-del-turn" data-idx="${idx}" title="Xóa toàn bộ lượt này">Xóa</button>
            </div>
          </div>
          <div class="chat-bubble-text jp-font">${turn.b || '<span style="color: var(--text-muted); font-style: italic;">(Chưa nhập câu thoại của B)</span>'}</div>
          ${hideB ? `<button class="btn btn-sm btn-reveal-secret" data-target="b-${idx}">Bấm để xem lời thoại</button>` : ''}
        </div>
      `;

      const bubblesHtml = this.firstSpeaker === 'b'
        ? `${bubbleB}${bubbleA}`
        : `${bubbleA}${bubbleB}`;

      const orderHint = this.firstSpeaker === 'b'
        ? '(Người B nói trước ➔ Người A đáp lại)'
        : '(Người A nói trước ➔ Người B đáp lại)';

      return `
        <div class="speaking-turn-row" data-turn-idx="${idx}">
          <div class="turn-index-badge">
            <span>LƯỢT ${idx + 1}</span>
            <span class="turn-order-hint">${orderHint}</span>
          </div>
          ${bubblesHtml}
        </div>
      `;
    }).join('');

    // Bind audio pronunciation buttons
    container.querySelectorAll('.btn-speak-turn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.dataset.text);
        if (text && text.trim()) window.soundEngine.speakJapanese(text);
      });
    });

    // Bind edit turn A
    container.querySelectorAll('.btn-edit-turn-a').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentTurnIdxA = parseInt(btn.dataset.idx, 10);
        this.renderTurnAEditor();
        document.getElementById('speaking-turn-editor-card')?.scrollIntoView({ behavior: 'smooth' });
        window.soundEngine.playClick();
      });
    });

    // Bind delete turn
    container.querySelectorAll('.btn-del-turn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (confirm(`Bạn có chắc muốn xóa lượt đối thoại số ${idx + 1}?`)) {
          this.deleteTurn(idx);
        }
      });
    });

    // Bind reveal secret button
    container.querySelectorAll('.btn-reveal-secret').forEach(btn => {
      btn.addEventListener('click', () => {
        const bubble = btn.closest('.chat-turn-item');
        if (bubble) {
          bubble.classList.remove('blurred');
          btn.style.display = 'none';
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // AUDIO AUTOPLAY & EXPORT UTILITIES
  // --------------------------------------------------------------------------

  /**
   * Reads the entire conversation automatically in sequence (A then B, with pauses)
   */
  togglePlayAll() {
    if (this.isPlayingAll) {
      this.stopPlayAll();
    } else {
      this.startPlayAll();
    }
  }

  startPlayAll() {
    if (this.turns.length === 0) return;
    this.isPlayingAll = true;
    const playBtn = document.getElementById('btn-speaking-play-all');
    if (playBtn) {
      playBtn.classList.add('active');
      playBtn.textContent = 'Dừng phát hội thoại';
    }

    const sequence = [];
    this.turns.forEach((t, idx) => {
      if (this.firstSpeaker === 'b') {
        if (t.b && t.b.trim()) sequence.push({ role: 'b', text: t.b, turnIdx: idx });
        if (t.a && t.a.trim()) sequence.push({ role: 'a', text: t.a, turnIdx: idx });
      } else {
        if (t.a && t.a.trim()) sequence.push({ role: 'a', text: t.a, turnIdx: idx });
        if (t.b && t.b.trim()) sequence.push({ role: 'b', text: t.b, turnIdx: idx });
      }
    });

    if (sequence.length === 0) {
      this.stopPlayAll();
      window.app.showToast('Không có câu thoại nào để phát âm!', 'warning');
      return;
    }

    let seqIdx = 0;
    const playNext = () => {
      if (!this.isPlayingAll || seqIdx >= sequence.length) {
        this.stopPlayAll();
        return;
      }

      const item = sequence[seqIdx];

      // Highlight active bubble
      document.querySelectorAll('.chat-turn-item').forEach(el => el.classList.remove('speaking-active'));
      const activeBubble = document.querySelector(`.speaking-turn-row[data-turn-idx="${item.turnIdx}"] .side-${item.role}`);
      if (activeBubble) {
        activeBubble.classList.add('speaking-active');
        activeBubble.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      window.soundEngine.speakJapanese(item.text);

      // Estimate utterance duration (~180ms per character + 1200ms gap)
      const duration = Math.max(1800, item.text.length * 160 + 1200);
      seqIdx++;
      this.playAllTimeout = setTimeout(playNext, duration);
    };

    playNext();
    const speakerLabel = this.firstSpeaker === 'b' ? 'Người B nói trước' : 'Người A nói trước';
    window.app.showToast(`Bắt đầu phát hội thoại (${speakerLabel})...`, 'info');
  }

  stopPlayAll() {
    this.isPlayingAll = false;
    if (this.playAllTimeout) clearTimeout(this.playAllTimeout);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    document.querySelectorAll('.chat-turn-item').forEach(el => el.classList.remove('speaking-active'));
    const playBtn = document.getElementById('btn-speaking-play-all');
    if (playBtn) {
      playBtn.classList.remove('active');
      playBtn.textContent = 'Nghe toàn bộ hội thoại';
    }
  }

  /**
   * Resets the current situation to the textbook standard reference dialogue
   */
  resetToDefaultSample() {
    const sit = this.situations[this.currentSitIndex];
    if (!sit) return;

    this.turns = JSON.parse(JSON.stringify(sit.default_turns));
    if (sit.default_first_speaker) {
      this.firstSpeaker = sit.default_first_speaker;
    } else {
      this.firstSpeaker = 'a';
    }
    localStorage.setItem(`jpd326_speaking_${sit.id}_first_speaker`, this.firstSpeaker);
    this.saveTurns();
    this.updateFirstSpeakerUI();
    this.populateBTextarea();
    this.renderTurnAEditor();
    this.renderTimeline();
    window.soundEngine.playCorrect();
    window.app.showToast(`Đã khôi phục kịch bản hội thoại mẫu của ${sit.code}!`, 'success');
  }

  /**
   * Exports the entire script as a clean .txt file for offline study or printing
   */
  exportScriptTxt() {
    const sit = this.situations[this.currentSitIndex];
    if (!sit) return;

    const orderStr = this.firstSpeaker === 'b' ? 'Người B nói trước (B ➔ A)' : 'Người A nói trước (A ➔ B)';
    let output = `JPD326 SPEAKING - ${sit.code}: ${sit.title}\n`;
    output += `====================================================\n\n`;
    output += `THỨ TỰ THOẠI: ${orderStr}\n\n`;
    output += `[VAI A]: ${sit.roleA.task_jp}\n(${sit.roleA.task_vi})\n\n`;
    output += `[VAI B]: ${sit.roleB.task_jp}\n(${sit.roleB.task_vi})\n\n`;
    output += `KỊCH BẢN HỘI THOẠI CHI TIẾT:\n`;
    output += `----------------------------------------------------\n`;

    this.turns.forEach((t, idx) => {
      output += `[LƯỢT ${idx + 1}]\n`;
      if (this.firstSpeaker === 'b') {
        output += `B: ${t.b || ''}\n`;
        output += `A: ${t.a || ''}\n\n`;
      } else {
        output += `A: ${t.a || ''}\n`;
        output += `B: ${t.b || ''}\n\n`;
      }
    });

    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JPD326_Speaking_${sit.code.replace(/\s+/g, '_')}_${this.firstSpeaker.toUpperCase()}First.txt`;
    a.click();
    URL.revokeObjectURL(url);
    window.soundEngine.playClick();
    window.app.showToast('Đã tải xuống file kịch bản hội thoại (.txt)!', 'info');
  }
}
