/**
 * Typing Game (Đánh Chữ)
 * Show the Vietnamese meaning, the player types the Japanese word.
 * Accepts romaji, hiragana, katakana or kanji. Plays key-by-key sounds.
 */

// ---------------------------------------------------------------------------
// Romaji -> hiragana converter
// ---------------------------------------------------------------------------
const RomajiKana = (() => {
  const T = {};
  const add = (romajiList, kana) => romajiList.split(' ').forEach(r => { T[r] = kana; });

  add('a', 'あ'); add('i', 'い'); add('u', 'う'); add('e', 'え'); add('o', 'お');

  const rows = {
    k: 'かきくけこ', g: 'がぎぐげご', s: 'さしすせそ', z: 'ざじずぜぞ',
    t: 'たちつてと', d: 'だぢづでど', n: 'なにぬねの', h: 'はひふへほ',
    b: 'ばびぶべぼ', p: 'ぱぴぷぺぽ', m: 'まみむめも', r: 'らりるれろ'
  };
  const vowels = ['a', 'i', 'u', 'e', 'o'];
  Object.keys(rows).forEach(c => {
    [...rows[c]].forEach((k, i) => { T[c + vowels[i]] = k; });
  });

  add('ya', 'や'); add('yu', 'ゆ'); add('yo', 'よ');
  add('wa', 'わ'); add('wo', 'を'); add('wi', 'うぃ'); add('we', 'うぇ');
  add('shi si', 'し'); add('chi ti', 'ち'); add('tsu tu', 'つ'); add('fu hu', 'ふ');
  add('ji zi', 'じ'); add('di', 'ぢ'); add('du', 'づ');
  add('nn', 'ん'); add("n'", 'ん'); add('xn', 'ん');

  const yoon = {
    ky: 'き', gy: 'ぎ', sy: 'し', sh: 'し', zy: 'じ', j: 'じ', jy: 'じ', ty: 'ち', ch: 'ち', cy: 'ち',
    dy: 'ぢ', ny: 'に', hy: 'ひ', by: 'び', py: 'ぴ', my: 'み', ry: 'り'
  };
  Object.keys(yoon).forEach(c => {
    add(`${c}a`, yoon[c] + 'ゃ'); add(`${c}u`, yoon[c] + 'ゅ'); add(`${c}o`, yoon[c] + 'ょ');
  });
  add('she sye', 'しぇ'); add('che tye', 'ちぇ'); add('je zye jye', 'じぇ');
  add('fa', 'ふぁ'); add('fi', 'ふぃ'); add('fe', 'ふぇ'); add('fo', 'ふぉ');
  add('thi', 'てぃ'); add('dhi', 'でぃ'); add('twu', 'とぅ'); add('dwu', 'どぅ');
  add('va', 'ゔぁ'); add('vi', 'ゔぃ'); add('vu', 'ゔ'); add('ve', 'ゔぇ'); add('vo', 'ゔぉ');
  add('tsa', 'つぁ'); add('tsi', 'つぃ'); add('tse', 'つぇ'); add('tso', 'つぉ');

  // Small kana (x / l prefix)
  const small = { a: 'ぁ', i: 'ぃ', u: 'ぅ', e: 'ぇ', o: 'ぉ' };
  ['x', 'l'].forEach(p => {
    vowels.forEach(v => add(p + v, small[v]));
    add(`${p}ya`, 'ゃ'); add(`${p}yu`, 'ゅ'); add(`${p}yo`, 'ょ');
    add(`${p}tu ${p}tsu`, 'っ'); add(`${p}wa`, 'ゎ');
  });

  const punct = { '-': 'ー', ',': '、', '.': '。', '?': '？', '!': '！' };
  const isVowel = c => 'aiueo'.includes(c);

  /**
   * Convert romaji to hiragana.
   * @param {string} input
   * @param {boolean} final - when true a trailing "n" becomes ん
   */
  function convert(input, final = true) {
    const s = input.toLowerCase();
    let out = '';
    let i = 0;
    while (i < s.length) {
      const c = s[i];

      if (punct[c] && !/[a-z]/.test(c)) { out += punct[c]; i++; continue; }
      if (!/[a-z']/.test(c)) { out += c; i++; continue; }

      // n handling
      if (c === 'n') {
        const next = s[i + 1];
        if (next === undefined) {
          out += final ? 'ん' : 'n'; i++; continue;
        }
        if (next === 'n' || next === "'") {
          // "nn" => ん (but "nna" => んな handled: consume only one n if followed by vowel via next-next)
          if (next === 'n' && s[i + 2] && (isVowel(s[i + 2]) || s[i + 2] === 'y')) {
            out += 'ん'; i += 1; continue;
          }
          out += 'ん'; i += 2; continue;
        }
        if (!isVowel(next) && next !== 'y') { out += 'ん'; i++; continue; }
      }

      // double consonant => っ
      if (s[i + 1] === c && /[bcdfghjklmpqrstvwxyz]/.test(c)) {
        out += 'っ'; i++; continue;
      }

      let matched = false;
      for (let len = 4; len >= 1; len--) {
        const chunk = s.substr(i, len);
        if (chunk.length === len && T[chunk]) {
          out += T[chunk]; i += len; matched = true; break;
        }
      }
      if (!matched) { out += c; i++; }
    }
    return out;
  }

  return { convert };
})();

// ---------------------------------------------------------------------------
// Answer normalisation helpers
// ---------------------------------------------------------------------------
const KanaNorm = (() => {
  const vowelRows = [
    'ぁあかがさざただなはばぱまやゃらわゎ',
    'ぃいきぎしじちぢにひびぴみり',
    'ぅうくぐすずつづぬふぶぷむゆゅるゔ',
    'ぇえけげせぜてでねへべぺめれ',
    'ぉおこごそぞとどのほぼぽもよょろを'
  ];
  const vowelKana = ['あ', 'い', 'う', 'え', 'お'];

  function katakanaToHiragana(s) {
    return s.replace(/[\u30A1-\u30F6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
  }

  /** Canonical form: hiragana, long mark expanded to vowel, no spaces/symbols */
  function canon(raw) {
    let s = katakanaToHiragana((raw || '').normalize('NFKC'));
    s = s.replace(/[\s～〜~・、。,.]/g, '');
    let out = '';
    for (const ch of s) {
      if (ch === 'ー' && out) {
        const prev = out[out.length - 1];
        const row = vowelRows.findIndex(r => r.includes(prev));
        out += row >= 0 ? vowelKana[row] : ch;
      } else {
        out += ch;
      }
    }
    return out;
  }

  /** Split a vocab field into accepted variants ("A - B", "A／B", "A (= B)", "（を）A") */
  function variants(field) {
    const result = new Set();
    if (!field) return result;
    field.split(/[－\-／\/＝=]/).forEach(part => {
      const noParen = part.replace(/[（(][^）)]*[）)]/g, '').replace(/[（()）]/g, '');
      const noBrackets = part.replace(/[（()）]/g, '');
      [noParen, noBrackets].forEach(p => {
        const c = canon(p);
        if (c) result.add(c);
      });
    });
    return result;
  }

  function acceptedAnswers(item) {
    const set = new Set();
    [item.kana, item.kanji, item.display].forEach(f => variants(f).forEach(v => set.add(v)));
    return set;
  }

  /** Turn what the player typed into canonical form (romaji gets converted) */
  function normalizeInput(raw, final = true) {
    const s = (raw || '').normalize('NFKC').trim();
    if (/[a-zA-Z]/.test(s)) {
      return canon(RomajiKana.convert(s, final));
    }
    return canon(s);
  }

  /** Cleaned first kana variant, for hints and answer display */
  function firstReading(item) {
    const src = item.kana || item.display || '';
    const first = src.split(/[－\-／\/＝=]/)[0].replace(/[（(][^）)]*[）)]/g, '').replace(/[（()）～〜\s]/g, '');
    return first || src;
  }

  return { canon, acceptedAnswers, normalizeInput, firstReading };
})();

// ---------------------------------------------------------------------------
// Game engine
// ---------------------------------------------------------------------------
class TypingGame {
  constructor() {
    this.lessonScope = 'all';
    this.wordCount = 20;     // number | 'all'
    this.maxTime = 0;        // seconds per word, 0 = unlimited

    this.words = [];
    this.index = 0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.correctCount = 0;
    this.failed = [];        // [{item, reason}]
    this.attempts = 0;
    this.hintUsed = false;
    this.wordStart = 0;
    this.totalTime = 0;
    this.timer = null;
    this.nextTimeout = null;
    this.locked = true;
    this.acceptSet = new Set();
    this.lastLen = 0;

    this.loadSettings();
    this.bindEvents();
    this.syncSettingsUI();
  }

  // ------------------------------------------------------------- settings
  loadSettings() {
    try {
      const s = JSON.parse(localStorage.getItem('jpd326_typing_settings') || '{}');
      if (s.wordCount === 'all' || Number.isInteger(s.wordCount)) this.wordCount = s.wordCount;
      if (Number.isInteger(s.maxTime) && s.maxTime >= 0) this.maxTime = s.maxTime;
    } catch (e) { /* ignore */ }
  }

  saveSettings() {
    localStorage.setItem('jpd326_typing_settings', JSON.stringify({
      wordCount: this.wordCount, maxTime: this.maxTime
    }));
  }

  syncSettingsUI() {
    const presets = ['10', '20', '30', '50', 'all'];
    const cur = String(this.wordCount);
    document.querySelectorAll('#typing-count-chips .filter-chip').forEach(c => c.classList.toggle('active', c.dataset.count === cur));
    const custom = document.getElementById('typing-count-custom');
    if (custom) custom.value = presets.includes(cur) ? '' : cur;
    document.querySelectorAll('#typing-time-chips .filter-chip').forEach(c => {
      c.classList.toggle('active', parseInt(c.dataset.time, 10) === this.maxTime);
    });
    document.querySelectorAll('#typing-lesson-chips .filter-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.typingLesson === this.lessonScope);
    });
    this.updatePoolInfo();
  }

  setLessonScope(lesson) {
    this.lessonScope = lesson || 'all';
    this.syncSettingsUI();
  }

  getPool() {
    const data = window.APP_DATA;
    if (!data) return [];
    let list = data.vocabulary.filter(v => v.meaning && (v.kana || v.display));
    if (this.lessonScope !== 'all') list = list.filter(v => v.lesson === this.lessonScope);
    return list;
  }

  updatePoolInfo() {
    const el = document.getElementById('typing-pool-info');
    if (el) el.textContent = `Có ${this.getPool().length} từ trong phạm vi đã chọn.`;
  }

  // --------------------------------------------------------------- events
  bindEvents() {
    document.querySelectorAll('#typing-lesson-chips .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => this.setLessonScope(chip.dataset.typingLesson));
    });
    document.querySelectorAll('#typing-count-chips .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.wordCount = chip.dataset.count === 'all' ? 'all' : parseInt(chip.dataset.count, 10);
        this.saveSettings(); this.syncSettingsUI();
      });
    });
    const custom = document.getElementById('typing-count-custom');
    if (custom) {
      custom.addEventListener('input', () => {
        const n = parseInt(custom.value, 10);
        if (Number.isInteger(n) && n > 0) {
          this.wordCount = Math.min(n, 500);
          this.saveSettings();
          document.querySelectorAll('#typing-count-chips .filter-chip').forEach(c => c.classList.remove('active'));
        }
      });
    }
    document.querySelectorAll('#typing-time-chips .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.maxTime = parseInt(chip.dataset.time, 10) || 0;
        this.saveSettings(); this.syncSettingsUI();
      });
    });

    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
    on('btn-typing-start', () => this.start());
    on('btn-typing-skip', () => this.skip());
    on('btn-typing-hint', () => this.showHint());
    on('btn-typing-quit', () => {
      if (!confirm('Dừng trò chơi và xem kết quả?')) return;
      this.words = this.words.slice(0, this.index);
      if (this.words.length === 0) { this.showConfig(); return; }
      this.finish();
    });
    on('btn-typing-replay', () => this.start());
    on('btn-typing-replay-wrong', () => this.start(this.failed.map(f => f.item)));
    on('btn-typing-config', () => this.showConfig());

    const input = document.getElementById('typing-input');
    if (input) {
      input.addEventListener('input', (e) => this.onInput(e));
      input.addEventListener('compositionend', () => this.autoCheck());
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (e.isComposing || e.keyCode === 229) return;
          e.preventDefault();
          this.submit();
        } else if (e.key === 'Tab') {
          e.preventDefault();
          this.skip();
        }
      });
    }
  }

  // ----------------------------------------------------------------- flow
  showConfig() {
    this.stopTimer();
    clearTimeout(this.nextTimeout);
    this.show('config');
    this.syncSettingsUI();
  }

  show(view) {
    ['config', 'play', 'result'].forEach(v => {
      const el = document.getElementById(`typing-${v}-view`);
      if (el) el.style.display = v === view ? (v === 'config' ? 'block' : 'flex') : 'none';
    });
  }

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  start(customWords = null) {
    this.stopTimer();
    clearTimeout(this.nextTimeout);

    let words;
    if (customWords) {
      words = this.shuffle(customWords);
    } else {
      const pool = this.shuffle(this.getPool());
      const n = this.wordCount === 'all' ? pool.length : Math.min(this.wordCount, pool.length);
      words = pool.slice(0, n);
      if (this.wordCount !== 'all' && pool.length < this.wordCount) {
        window.app?.showToast(`Phạm vi này chỉ có ${pool.length} từ.`, 'info');
      }
    }
    if (words.length === 0) {
      window.app?.showToast('Không có từ nào trong phạm vi đã chọn!', 'warning');
      return;
    }

    this.words = words;
    this.index = 0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.correctCount = 0;
    this.failed = [];
    this.totalTime = 0;

    this.show('play');
    this.nextWord();
  }

  nextWord() {
    if (this.index >= this.words.length) { this.finish(); return; }

    const item = this.words[this.index];
    this.acceptSet = KanaNorm.acceptedAnswers(item);
    this.attempts = 0;
    this.hintUsed = false;
    this.locked = false;
    this.lastLen = 0;

    const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    set('typing-meaning', item.meaning);
    set('typing-lesson-tag', `${item.lesson}${item.part ? ' • ' + item.part : ''}`);
    set('typing-progress-num', `${this.index + 1} / ${this.words.length}`);
    set('typing-score', `${this.score} pts`);
    set('typing-hint-text', '');
    set('typing-preview', '');
    set('typing-feedback', '');

    const combo = document.getElementById('typing-combo');
    if (combo) {
      combo.textContent = `Combo x${this.combo}`;
      combo.style.display = this.combo > 1 ? 'inline-block' : 'none';
    }
    const fill = document.getElementById('typing-progress-fill');
    if (fill) fill.style.width = `${(this.index / this.words.length) * 100}%`;

    const card = document.getElementById('typing-word-card');
    if (card) card.classList.remove('correct', 'wrong', 'reveal');

    const input = document.getElementById('typing-input');
    if (input) {
      input.value = '';
      input.disabled = false;
      input.focus();
    }

    this.wordStart = performance.now();
    this.startTimer();
  }

  // ---------------------------------------------------------------- timer
  startTimer() {
    this.stopTimer();
    const wrap = document.getElementById('typing-timer-wrap');
    const fill = document.getElementById('typing-timer-fill');
    if (!this.maxTime) { if (wrap) wrap.style.display = 'none'; return; }
    if (wrap) wrap.style.display = '';
    if (fill) { fill.style.width = '100%'; fill.classList.remove('warning'); }

    this.timer = setInterval(() => {
      const elapsed = (performance.now() - this.wordStart) / 1000;
      const left = this.maxTime - elapsed;
      const pct = Math.max(0, (left / this.maxTime) * 100);
      if (fill) {
        fill.style.width = `${pct}%`;
        if (pct < 30) fill.classList.add('warning');
      }
      if (left <= 0) {
        this.stopTimer();
        this.fail('timeout');
      }
    }, 100);
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  // ---------------------------------------------------------------- input
  onInput(e) {
    if (this.locked) return;
    const input = e.target;
    const val = input.value;

    // Sound: one tick per character typed, softer on delete
    if (val.length < this.lastLen) {
      window.soundEngine?.playTypeBack();
    } else if (val.length > this.lastLen) {
      window.soundEngine?.playTypeKey();
    }
    this.lastLen = val.length;

    // Live kana preview for romaji input
    const preview = document.getElementById('typing-preview');
    if (preview) {
      const normalized = val.normalize('NFKC');
      preview.textContent = /[a-zA-Z]/.test(normalized) ? RomajiKana.convert(normalized, false) : '';
    }

    if (!e.isComposing) this.autoCheck();
  }

  isMatch(final) {
    const input = document.getElementById('typing-input');
    if (!input) return false;
    const raw = input.value.trim();
    if (!raw) return false;
    return this.acceptSet.has(KanaNorm.normalizeInput(raw, final));
  }

  autoCheck() {
    if (this.locked) return;
    if (this.isMatch(false)) this.succeed();
  }

  submit() {
    if (this.locked) return;
    const input = document.getElementById('typing-input');
    if (!input || !input.value.trim()) return;

    if (this.isMatch(true)) { this.succeed(); return; }

    // Wrong attempt
    this.attempts++;
    this.combo = 0;
    window.soundEngine?.playWrong();
    const card = document.getElementById('typing-word-card');
    if (card) {
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
    }
    const fb = document.getElementById('typing-feedback');
    if (this.attempts >= 3) {
      this.fail('wrong');
      return;
    }
    if (fb) fb.textContent = `Chưa đúng, thử lại (${this.attempts}/3). Dùng nút Gợi ý nếu cần.`;
    input.select();
  }

  succeed() {
    this.locked = true;
    this.stopTimer();
    const item = this.words[this.index];
    const seconds = (performance.now() - this.wordStart) / 1000;
    this.totalTime += seconds;

    this.combo++;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;
    this.correctCount++;

    const speedBonus = Math.max(0, Math.round(50 - seconds * 5));
    const penalty = (this.hintUsed ? 30 : 0) + (this.attempts * 10);
    const gained = Math.max(10, 100 + speedBonus + this.combo * 10 - penalty);
    this.score += gained;

    window.soundEngine?.playCorrect(this.combo);
    if (this.combo > 0 && this.combo % 5 === 0) {
      setTimeout(() => window.soundEngine?.playComboBurst(), 220);
    }

    const card = document.getElementById('typing-word-card');
    if (card) card.classList.add('correct');
    const fb = document.getElementById('typing-feedback');
    if (fb) fb.textContent = `${item.display}  ·  ${KanaNorm.firstReading(item)}   +${gained}`;
    const scoreEl = document.getElementById('typing-score');
    if (scoreEl) scoreEl.textContent = `${this.score} pts`;
    const input = document.getElementById('typing-input');
    if (input) input.disabled = true;

    this.nextTimeout = setTimeout(() => { this.index++; this.nextWord(); }, 900);
  }

  fail(reason) {
    if (this.locked) return;
    this.locked = true;
    this.stopTimer();
    const item = this.words[this.index];
    this.totalTime += (performance.now() - this.wordStart) / 1000;
    this.combo = 0;
    this.failed.push({ item, reason });
    if (reason !== 'wrong') window.soundEngine?.playWrong();

    const card = document.getElementById('typing-word-card');
    if (card) card.classList.add('reveal');
    const fb = document.getElementById('typing-feedback');
    const label = reason === 'timeout' ? 'Hết giờ' : reason === 'skip' ? 'Bỏ qua' : 'Chưa đúng';
    if (fb) fb.textContent = `${label}. Đáp án: ${item.display}  ·  ${KanaNorm.firstReading(item)}`;
    const input = document.getElementById('typing-input');
    if (input) input.disabled = true;

    this.nextTimeout = setTimeout(() => { this.index++; this.nextWord(); }, 1800);
  }

  skip() {
    if (this.locked) return;
    window.soundEngine?.playChip();
    this.fail('skip');
  }

  showHint() {
    if (this.locked) return;
    const item = this.words[this.index];
    const reading = KanaNorm.firstReading(item);
    const chars = [...reading];
    const shown = chars[0] + (chars.length > 1 ? ' ' + chars.slice(1).map(() => '○').join(' ') : '');
    this.hintUsed = true;
    window.soundEngine?.playChip();
    const el = document.getElementById('typing-hint-text');
    if (el) el.textContent = `Gợi ý: ${shown}  (${chars.length} âm)`;
    document.getElementById('typing-input')?.focus();
  }

  // --------------------------------------------------------------- result
  finish() {
    this.stopTimer();
    clearTimeout(this.nextTimeout);
    this.locked = true;

    const total = this.words.length;
    const accuracy = total ? Math.round((this.correctCount / total) * 100) : 0;
    const avg = total ? (this.totalTime / total).toFixed(1) : '0.0';

    let best = 0;
    try { best = parseInt(localStorage.getItem('jpd326_typing_best') || '0', 10) || 0; } catch (e) { /* ignore */ }
    const isNewBest = this.score > best;
    if (isNewBest) { try { localStorage.setItem('jpd326_typing_best', String(this.score)); } catch (e) { /* ignore */ } }

    window.soundEngine?.playFanfare();
    this.show('result');

    const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
    set('typing-final-score', `${this.score} Điểm`);
    set('typing-final-stats',
      `Đúng ${this.correctCount}/${total} từ (${accuracy}%) • Trung bình ${avg}s/từ • Combo cao nhất x${this.maxCombo}`);
    set('typing-final-best', isNewBest ? 'Kỷ lục mới!' : `Kỷ lục: ${best} điểm`);

    const wrongBtn = document.getElementById('btn-typing-replay-wrong');
    if (wrongBtn) wrongBtn.style.display = this.failed.length ? '' : 'none';

    const review = document.getElementById('typing-review-list');
    if (review) {
      if (!this.failed.length) {
        review.innerHTML = '<div style="color: var(--text-secondary);">Bạn gõ đúng tất cả các từ.</div>';
      } else {
        review.innerHTML = `
          <div class="quiz-config-label" style="margin-bottom: 0.5rem;">Từ chưa gõ được (${this.failed.length}):</div>
          ${this.failed.map(f => `
            <div class="quiz-review-item">
              <div style="font-weight: 700; color: var(--text-heading);">${f.item.meaning}</div>
              <div class="jp-font" style="font-size: 0.95rem;">${f.item.display} <span style="color: var(--text-muted);">· ${KanaNorm.firstReading(f.item)}</span></div>
            </div>
          `).join('')}
        `;
      }
    }
  }
}

window.TypingGame = TypingGame;
window.RomajiKana = RomajiKana;
window.KanaNorm = KanaNorm;
