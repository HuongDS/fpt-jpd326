/**
 * Final Exam Cram Engine (Chế độ Ôn Thi Final Excel-style)
 * Provides an Excel-like 2-column & 3-column spreadsheet testing interface
 * for fast reading drill and immediate SRS Flashcard remediation.
 */

class FinalExamEngine {
  constructor() {
    this.sheet = 'vocab'; // 'vocab' (2 cols) | 'kanji' (3 cols)
    this.lessonScope = 'all'; // 'all' | '第 6 課' | '第 7 課' | '第 8 課' | '第 9 課' | '第 10 課'
    this.items = [];
    this.failedItems = [];
    this.isSubmitted = false;

    // Romaji to Hiragana phonetics mapping table
    this.romajiMap = {
      'kya':'きゃ','kyu':'きゅ','kyo':'きょ',
      'sha':'しゃ','shu':'しゅ','sho':'しょ','shi':'し',
      'cha':'ちゃ','chu':'ちゅ','cho':'ちょ','chi':'ち','tsu':'つ',
      'nya':'にゃ','nyu':'にゅ','nyo':'にょ',
      'hya':'ひゃ','hyu':'ひゅ','hyo':'ひょ',
      'mya':'みゃ','myu':'みゅ','myo':'みょ',
      'rya':'りゃ','ryu':'りゅ','ryo':'りょ',
      'gya':'ぎゃ','gyu':'ぎゅ','gyo':'ぎょ',
      'ja':'じゃ','ju':'じゅ','jo':'じょ','ji':'じ',
      'bya':'びゃ','byu':'びゅ','byo':'びょ',
      'pya':'ぴゃ','pyu':'ぴゅ','pyo':'ぴょ',
      'ka':'か','ki':'き','ku':'く','ke':'け','ko':'こ',
      'sa':'さ','si':'し','su':'す','se':'せ','so':'そ',
      'ta':'た','ti':'ち','tu':'つ','te':'て','to':'と',
      'na':'な','ni':'に','nu':'ぬ','ne':'ね','no':'の',
      'ha':'は','hi':'ひ','fu':'ふ','hu':'ふ','he':'へ','ho':'ほ',
      'ma':'ま','mi':'み','mu':'む','me':'め','mo':'も',
      'ya':'や','yu':'ゆ','yo':'よ',
      'ra':'ら','ri':'り','ru':'る','re':'れ','ro':'ろ',
      'wa':'わ','wo':'を','nn':'ん','n':'ん',
      'ga':'が','gi':'ぎ','gu':'ぐ','ge':'げ','go':'ご',
      'za':'ざ','zu':'ず','ze':'ぜ','zo':'ぞ',
      'da':'だ','di':'ぢ','du':'づ','de':'で','do':'ど',
      'ba':'ば','bi':'び','bu':'ぶ','be':'べ','bo':'ぼ',
      'pa':'ぱ','pi':'ぴ','pu':'ぷ','pe':'ぺ','po':'ぽ',
      'a':'あ','i':'い','u':'う','e':'え','o':'お'
    };
    this.romajiKeys = Object.keys(this.romajiMap).sort((a, b) => b.length - a.length);

    this.init();
  }

  init() {
    // 1. Sheet tabs (Vocab vs Kanji)
    const sheetTabs = document.getElementById('excel-sheet-tabs');
    if (sheetTabs) {
      sheetTabs.querySelectorAll('.excel-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          sheetTabs.querySelectorAll('.excel-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.sheet = btn.dataset.sheet;
          this.renderSheet();
        });
      });
    }

    // 2. Lesson chips (Scope: All, Bai 6-10)
    const lessonContainer = document.getElementById('excel-lesson-chips');
    if (lessonContainer) {
      lessonContainer.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          lessonContainer.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.lessonScope = btn.dataset.examLesson;
          this.renderSheet();
        });
      });
    }

    // 3. Action buttons
    const submitBtn = document.getElementById('btn-excel-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitAndGrade());
    }

    const clearBtn = document.getElementById('btn-excel-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa trắng toàn bộ bài làm trên sheet này để làm lại?')) {
          this.renderSheet();
        }
      });
    }

    // 4. Remediation button (Bắt học lại liền ở phần Flashcard)
    const remediateBtn = document.getElementById('btn-remediation-flashcard');
    if (remediateBtn) {
      remediateBtn.addEventListener('click', () => this.remediateInFlashcards());
    }
  }

  /**
   * Set lesson scope programmatically (synced with global lesson bar)
   */
  setLessonScope(lesson) {
    this.lessonScope = lesson || 'all';
    const lessonContainer = document.getElementById('excel-lesson-chips');
    if (lessonContainer) {
      lessonContainer.querySelectorAll('.filter-chip').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.examLesson === this.lessonScope);
      });
    }
    this.renderSheet();
  }

  /**
   * Converts Romaji or mixed string into standard Hiragana
   */
  toHiragana(str) {
    if (!str) return '';
    let res = str.toLowerCase().trim();
    // Convert Katakana to Hiragana first
    res = res.replace(/[\u30a1-\u30f6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
    // Double consonant sokuon (e.g. kk -> っk)
    res = res.replace(/([ksthmyrwgzdbp])\1/g, 'っ$1');
    for (const k of this.romajiKeys) {
      res = res.split(k).join(this.romajiMap[k]);
    }
    return res;
  }

  /**
   * Normalizes kana for flexible comparison: strips dots, dashes, spaces, punctuation,
   * tilde/wave dashes (~, ～, 〜, ∼), and affixes so learners don't have to type ~
   */
  normalizeKana(str) {
    if (!str) return '';
    const hira = this.toHiragana(str);
    return hira.replace(/[・\s\-\.\,\/、\(\)\[\]（）〔〕【】~～〜∼−―—–…\u3000\uFF5E\u301C\u223C]/g, '').trim();
  }

  /**
   * Evaluates user input against expected reading options (handles multiple readings)
   */
  checkReading(userInput, expectedReading) {
    if (!expectedReading || expectedReading === '—') return true;
    if (!userInput || !userInput.trim()) return false;

    const normUser = this.normalizeKana(userInput);
    if (!normUser) return false;

    // Split multiple expected readings by comma, slash, ideographic comma, space
    const options = expectedReading.split(/[,、\/\s]+/).filter(Boolean);
    const normOptions = options.map(opt => this.normalizeKana(opt));

    // Also check the entire combined string
    const fullNormalized = this.normalizeKana(expectedReading);

    return normOptions.includes(normUser) || fullNormalized === normUser;
  }

  /**
   * Renders the Excel spreadsheet table according to selected sheet (Vocab vs Kanji) and lesson
   */
  renderSheet() {
    const table = document.getElementById('excel-sheet-table');
    const banner = document.getElementById('excel-remediation-banner');
    if (!table) return;

    if (banner) banner.style.display = 'none';
    this.isSubmitted = false;
    this.failedItems = [];

    const data = window.APP_DATA;
    if (!data) return;

    if (this.sheet === 'vocab') {
      let vList = data.vocabulary || [];
      if (this.lessonScope !== 'all') {
        vList = vList.filter(v => v.lesson === this.lessonScope);
      }
      this.items = vList;
      this.renderVocabSheet(table, vList);
    } else {
      let kList = data.kanji || [];
      if (this.lessonScope !== 'all') {
        kList = kList.filter(k => k.lesson === this.lessonScope);
      }
      this.items = kList;
      this.renderKanjiSheet(table, kList);
    }

    this.updateStatusBar();
    this.bindCellNavigation();
  }

  renderVocabSheet(table, list) {
    table.innerHTML = `
      <thead>
        <tr class="excel-col-headers">
          <th class="excel-corner-cell">#</th>
          <th style="width: 220px;">
            <div class="col-letter">A</div>
            <div class="col-name">Chữ Hán / Từ vựng (Đề bài)</div>
          </th>
          <th style="min-width: 260px;">
            <div class="col-letter">B</div>
            <div class="col-name">Cách đọc (Nhập Hiragana hoặc Romaji)</div>
          </th>
          <th style="width: 260px;">
            <div class="col-letter">C</div>
            <div class="col-name">Kết quả & Đáp án đúng</div>
          </th>
          <th style="width: 140px;">
            <div class="col-letter">D</div>
            <div class="col-name">Nghĩa tiếng Việt</div>
          </th>
        </tr>
      </thead>
      <tbody>
        ${list.map((v, idx) => `
          <tr class="excel-data-row" data-id="${v.id}" data-idx="${idx}">
            <td class="excel-row-num">${idx + 1}</td>
            <td class="excel-cell-prompt">
              <span class="excel-jp-char">${v.kanji || v.kana}</span>
              <span class="badge" style="font-size: 0.68rem; margin-left: 0.4rem;">${v.lesson}</span>
            </td>
            <td class="excel-cell-edit">
              <input type="text" 
                     class="excel-input" 
                     data-col="reading" 
                     data-expected="${v.kana}" 
                     placeholder="Gõ cách đọc tại đây..." 
                     autocomplete="off" 
                     spellcheck="false">
            </td>
            <td class="excel-cell-result" id="res-vocab-${idx}">
              <span class="excel-cell-empty-hint">—</span>
            </td>
            <td class="excel-cell-meaning" style="font-size: 0.85rem; color: var(--text-secondary);">
              ${v.meaning}
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  renderKanjiSheet(table, list) {
    table.innerHTML = `
      <thead>
        <tr class="excel-col-headers">
          <th class="excel-corner-cell">#</th>
          <th style="width: 180px;">
            <div class="col-letter">A</div>
            <div class="col-name">Hán tự (Đề bài)</div>
          </th>
          <th style="min-width: 220px;">
            <div class="col-letter">B</div>
            <div class="col-name">Âm On (Nhập Katakana hoặc Romaji)</div>
          </th>
          <th style="min-width: 220px;">
            <div class="col-letter">C</div>
            <div class="col-name">Âm Kun (Nhập Hiragana hoặc Romaji)</div>
          </th>
          <th style="width: 280px;">
            <div class="col-letter">D</div>
            <div class="col-name">Kết quả & Đáp án đối chiếu</div>
          </th>
        </tr>
      </thead>
      <tbody>
        ${list.map((k, idx) => {
          const hasKun = k.kunyomi && k.kunyomi.trim() && k.kunyomi !== '—';
          return `
            <tr class="excel-data-row" data-id="${k.id}" data-idx="${idx}">
              <td class="excel-row-num">${idx + 1}</td>
              <td class="excel-cell-prompt">
                <span class="excel-jp-char" style="font-size: 1.5rem;">${k.kanji}</span>
                <span style="font-size: 0.9rem; font-weight: 700; color: var(--text-heading); margin-left: 0.4rem;">${k.han_viet}</span>
                <span class="badge" style="font-size: 0.68rem; margin-left: 0.3rem;">${k.lesson}</span>
              </td>
              <td class="excel-cell-edit">
                <input type="text" 
                       class="excel-input" 
                       data-col="on" 
                       data-expected="${k.onyomi || ''}" 
                       placeholder="Nhập âm On..." 
                       autocomplete="off" 
                       spellcheck="false">
              </td>
              <td class="excel-cell-edit">
                ${hasKun ? `
                  <input type="text" 
                         class="excel-input" 
                         data-col="kun" 
                         data-expected="${k.kunyomi}" 
                         placeholder="Nhập âm Kun..." 
                         autocomplete="off" 
                         spellcheck="false">
                ` : `
                  <input type="text" 
                         class="excel-input disabled" 
                         data-col="kun" 
                         value="—" 
                         disabled 
                         style="color: var(--text-muted); background: var(--bg-elevated); text-align: center;">
                `}
              </td>
              <td class="excel-cell-result" id="res-kanji-${idx}">
                <span class="excel-cell-empty-hint">—</span>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    `;
  }

  /**
   * Binds Excel keyboard navigation: Enter / Down moves cell below, Up moves cell above
   */
  bindCellNavigation() {
    const inputs = document.querySelectorAll('.excel-sheet-table input:not([disabled])');

    inputs.forEach(input => {
      input.addEventListener('keydown', (e) => {
        const col = input.dataset.col;
        const currentRow = input.closest('tr');

        if (e.key === 'Enter' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextRow = currentRow.nextElementSibling;
          if (nextRow) {
            const nextInput = nextRow.querySelector(`input[data-col="${col}"]:not([disabled])`);
            if (nextInput) {
              nextInput.focus();
              nextInput.select();
            }
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevRow = currentRow.previousElementSibling;
          if (prevRow) {
            const prevInput = prevRow.querySelector(`input[data-col="${col}"]:not([disabled])`);
            if (prevInput) {
              prevInput.focus();
              prevInput.select();
            }
          }
        }
      });

      // Update progress indicator on typing
      input.addEventListener('input', () => this.updateFilledProgress());
    });

    this.updateFilledProgress();
  }

  updateFilledProgress() {
    const inputs = document.querySelectorAll('.excel-sheet-table input:not([disabled])');
    let filled = 0;
    inputs.forEach(inp => {
      if (inp.value && inp.value.trim().length > 0) filled++;
    });

    const progressEl = document.getElementById('excel-progress-text');
    if (progressEl) {
      progressEl.textContent = `Đã điền: ${filled} / ${inputs.length} ô`;
    }
  }

  updateStatusBar() {
    const modeEl = document.getElementById('excel-status-mode');
    const countEl = document.getElementById('excel-status-count');
    if (modeEl) {
      modeEl.textContent = this.sheet === 'vocab' ? 'Từ Vựng (2 cột: Chữ Hán ➜ Cách Đọc)' : 'Hán Tự (3 cột: Hán Tự ➜ Âm On ➜ Âm Kun)';
    }
    if (countEl) {
      countEl.textContent = `Tổng cộng: ${this.items.length} hàng (${this.lessonScope})`;
    }
  }

  /**
   * Evaluates the spreadsheet, marks errors in RED, and triggers remediation banner
   */
  submitAndGrade() {
    this.isSubmitted = true;
    this.failedItems = [];

    let totalPoints = 0;
    let earnedPoints = 0;

    const rows = document.querySelectorAll('.excel-sheet-table tbody tr');

    rows.forEach((row, idx) => {
      const id = row.dataset.id;
      const item = this.items[idx];
      if (!item) return;

      if (this.sheet === 'vocab') {
        totalPoints++;
        const readingInput = row.querySelector('input[data-col="reading"]');
        const resCell = document.getElementById(`res-vocab-${idx}`);
        const userVal = readingInput ? readingInput.value.trim() : '';
        const isCorrect = this.checkReading(userVal, item.kana);

        if (isCorrect) {
          earnedPoints++;
          readingInput.classList.remove('cell-wrong');
          readingInput.classList.add('cell-correct');
          if (resCell) {
            resCell.innerHTML = `<span style="color: #16A34A; font-weight: 700;">Đúng</span>`;
          }
        } else {
          // BỊ IN ĐỎ
          readingInput.classList.remove('cell-correct');
          readingInput.classList.add('cell-wrong');
          this.failedItems.push(item);
          if (resCell) {
            const reason = userVal ? 'Sai' : 'Bỏ trống';
            resCell.innerHTML = `
              <div style="display: flex; flex-direction: column; gap: 0.15rem;">
                <span class="excel-wrong-tag">${reason}</span>
                <span class="excel-correct-answer-reveal">Đúng: <strong>${item.kana}</strong></span>
              </div>
            `;
          }
        }

      } else {
        // Kanji Sheet (Onyomi + Kunyomi)
        const onInput = row.querySelector('input[data-col="on"]');
        const kunInput = row.querySelector('input[data-col="kun"]:not([disabled])');
        const resCell = document.getElementById(`res-kanji-${idx}`);

        const onUser = onInput ? onInput.value.trim() : '';
        const kunUser = kunInput ? kunInput.value.trim() : '';

        const hasKun = item.kunyomi && item.kunyomi.trim() && item.kunyomi !== '—';

        const onCorrect = this.checkReading(onUser, item.onyomi);
        const kunCorrect = hasKun ? this.checkReading(kunUser, item.kunyomi) : true;

        totalPoints += hasKun ? 2 : 1;
        if (onCorrect) earnedPoints++;
        if (hasKun && kunCorrect) earnedPoints++;

        // Visual feedback on input cells
        if (onCorrect) {
          onInput.classList.remove('cell-wrong');
          onInput.classList.add('cell-correct');
        } else {
          onInput.classList.remove('cell-correct');
          onInput.classList.add('cell-wrong'); // IN ĐỎ
        }

        if (kunInput) {
          if (kunCorrect) {
            kunInput.classList.remove('cell-wrong');
            kunInput.classList.add('cell-correct');
          } else {
            kunInput.classList.remove('cell-correct');
            kunInput.classList.add('cell-wrong'); // IN ĐỎ
          }
        }

        const isFullyCorrect = onCorrect && kunCorrect;
        if (!isFullyCorrect) {
          this.failedItems.push(item);
          if (resCell) {
            const onPart = !onCorrect ? `<div>On: <strong class="txt-red">${item.onyomi || '—'}</strong></div>` : '';
            const kunPart = (hasKun && !kunCorrect) ? `<div>Kun: <strong class="txt-red">${item.kunyomi}</strong></div>` : '';
            resCell.innerHTML = `
              <div style="font-size: 0.85rem; line-height: 1.4;">
                <span class="excel-wrong-tag">Cần học lại</span>
                ${onPart}
                ${kunPart}
              </div>
            `;
          }
        } else {
          if (resCell) {
            resCell.innerHTML = `<span style="color: #16A34A; font-weight: 700;">Đúng cả On & Kun</span>`;
          }
        }
      }
    });

    const pct = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    // Show Remediation Banner
    const banner = document.getElementById('excel-remediation-banner');
    const badgeText = document.getElementById('remediation-badge-text');
    const scoreText = document.getElementById('remediation-score-text');
    const descText = document.getElementById('remediation-desc-text');
    const remediateBtn = document.getElementById('btn-remediation-flashcard');

    if (banner) {
      banner.style.display = 'flex';
      banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      if (badgeText) {
        badgeText.textContent = this.failedItems.length > 0 
          ? `CẦN ÔN LẠI: ${this.failedItems.length} MỤC CHƯA NHỚ` 
          : 'XUẤT SẮC: ĐẠT ĐIỂM TUYỆT ĐỐI!';
        badgeText.className = this.failedItems.length > 0 ? 'remediation-badge' : 'remediation-badge success';
      }

      if (scoreText) {
        scoreText.textContent = `Kết quả: ${earnedPoints} / ${totalPoints} điểm (${pct}%)`;
      }

      if (descText) {
        if (this.failedItems.length > 0) {
          descText.textContent = `Có ${this.failedItems.length} từ bị sai hoặc bỏ trống do không nhớ đã được in màu đỏ nổi bật bên dưới. Hệ thống đã lập tức gom thành một bộ thẻ Flashcard cấp tốc để bạn học thuộc lại ngay!`;
        } else {
          descText.textContent = `Tuyệt vời! Bạn đã nhớ chính xác 100% cách đọc của toàn bộ danh sách ôn thi này!`;
        }
      }

      if (remediateBtn) {
        if (this.failedItems.length > 0) {
          remediateBtn.style.display = 'inline-block';
          remediateBtn.textContent = `Học Lại Ngay ${this.failedItems.length} Mục Sai Bằng Flashcard SRS`;
        } else {
          remediateBtn.style.display = 'none';
        }
      }
    }

    // Sound feedback
    if (this.failedItems.length === 0) {
      window.soundEngine.playFanfare();
      window.app.showToast('Chúc mừng! Bạn đã hoàn thành xuất sắc 100%!', 'success');
    } else {
      window.soundEngine.playWrong();
      window.app.showToast(`Bạn có ${this.failedItems.length} câu làm sai hoặc bỏ trống (đã in đỏ)!`, 'warning');
    }
  }

  /**
   * Bắt học lại liền ở phần Flashcard (Immediate SRS Remediation)
   */
  remediateInFlashcards() {
    if (!this.failedItems || this.failedItems.length === 0) {
      window.app.showToast('Không có từ sai nào cần ôn lại!', 'info');
      return;
    }

    const category = this.sheet === 'vocab' ? 'vocab' : 'kanji';

    // Load failed items directly into flashcard engine
    window.flashcardEngine.loadDeck(this.failedItems, category, 'all');

    // Switch to Flashcards tab
    window.app.switchTab('flashcards');

    window.soundEngine.playChip();
    window.app.showToast(`Đã nạp ${this.failedItems.length} câu sai từ bài thi Final vào Flashcard. Hãy bắt đầu ôn thuộc lại ngay!`, 'warning');
  }
}
