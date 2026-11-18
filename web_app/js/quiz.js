/**
 * Quiz Engine
 * Multiple choice quiz with configurable question count, optional timer,
 * combo scoring and a review of wrong answers.
 */

class QuizEngine {
  constructor() {
    this.mode = 'vocab_jp_vn';
    this.lessonScope = 'all';
    this.questionCount = 20; // number | 'all'
    this.maxTime = 0;        // seconds per question, 0 = unlimited

    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.correctCount = 0;
    this.wrongList = [];
    this.timer = null;
    this.timeLeft = 0;
    this.isAnswering = false;
    this.nextTimeout = null;

    this.loadSettings();
    this.initEvents();
    this.initLessonChips();
    this.syncSettingsUI();
  }

  // ---------------------------------------------------------------- settings
  loadSettings() {
    try {
      const s = JSON.parse(localStorage.getItem('jpd326_quiz_settings') || '{}');
      if (s.mode) this.mode = s.mode;
      if (s.questionCount === 'all' || Number.isInteger(s.questionCount)) this.questionCount = s.questionCount;
      if (Number.isInteger(s.maxTime) && s.maxTime >= 0) this.maxTime = s.maxTime;
    } catch (e) { /* ignore */ }
  }

  saveSettings() {
    localStorage.setItem('jpd326_quiz_settings', JSON.stringify({
      mode: this.mode,
      questionCount: this.questionCount,
      maxTime: this.maxTime
    }));
  }

  syncSettingsUI() {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === this.mode));

    const countChips = document.querySelectorAll('#quiz-count-chips .filter-chip');
    const presets = ['10', '20', '30', '50', 'all'];
    const cur = String(this.questionCount);
    countChips.forEach(c => c.classList.toggle('active', c.dataset.count === cur));
    const customInput = document.getElementById('quiz-count-custom');
    if (customInput) customInput.value = presets.includes(cur) ? '' : cur;

    document.querySelectorAll('#quiz-time-chips .filter-chip').forEach(c => {
      c.classList.toggle('active', parseInt(c.dataset.time, 10) === this.maxTime);
    });
  }

  initLessonChips() {
    const lessonContainer = document.getElementById('quiz-lesson-chips');
    if (!lessonContainer) return;
    lessonContainer.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => this.setLessonScope(chip.dataset.quizLesson || 'all'));
    });
  }

  setLessonScope(lesson) {
    this.lessonScope = lesson || 'all';
    const lessonContainer = document.getElementById('quiz-lesson-chips');
    if (lessonContainer) {
      lessonContainer.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.quizLesson === this.lessonScope);
      });
    }
  }

  initEvents() {
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.mode = btn.dataset.mode;
        this.saveSettings();
        this.syncSettingsUI();
      });
    });

    document.querySelectorAll('#quiz-count-chips .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.questionCount = chip.dataset.count === 'all' ? 'all' : parseInt(chip.dataset.count, 10);
        this.saveSettings();
        this.syncSettingsUI();
      });
    });

    const customInput = document.getElementById('quiz-count-custom');
    if (customInput) {
      customInput.addEventListener('input', () => {
        const n = parseInt(customInput.value, 10);
        if (Number.isInteger(n) && n > 0) {
          this.questionCount = Math.min(n, 500);
          this.saveSettings();
          document.querySelectorAll('#quiz-count-chips .filter-chip').forEach(c => c.classList.remove('active'));
        }
      });
    }

    document.querySelectorAll('#quiz-time-chips .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.maxTime = parseInt(chip.dataset.time, 10) || 0;
        this.saveSettings();
        this.syncSettingsUI();
      });
    });

    const startBtn = document.getElementById('btn-start-quiz');
    if (startBtn) startBtn.addEventListener('click', () => this.startQuiz());

    const quitBtn = document.getElementById('btn-quiz-quit');
    if (quitBtn) quitBtn.addEventListener('click', () => {
      if (!confirm('Dừng bài quiz hiện tại và xem kết quả?')) return;
      // Only count questions already answered
      const answeredCount = this.currentIndex + (this.isAnswering ? 0 : 1);
      this.questions = this.questions.slice(0, answeredCount);
      if (this.questions.length === 0) { this.showConfig(); return; }
      this.finishQuiz();
    });

    const retryBtn = document.getElementById('btn-quiz-retry');
    if (retryBtn) retryBtn.addEventListener('click', () => this.showConfig());

    const redoBtn = document.getElementById('btn-quiz-redo');
    if (redoBtn) redoBtn.addEventListener('click', () => this.startQuiz());

    const wrongBtn = document.getElementById('btn-quiz-redo-wrong');
    if (wrongBtn) wrongBtn.addEventListener('click', () => this.startQuiz(this.wrongList.map(w => w.q)));

    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      const quizPanel = document.getElementById('tab-quiz');
      if (!quizPanel || !quizPanel.classList.contains('active')) return;
      if (!this.isAnswering) return;
      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= 4) {
        const optionBtns = document.querySelectorAll('.quiz-opt-btn');
        if (optionBtns[keyNum - 1]) optionBtns[keyNum - 1].click();
      }
    });
  }

  // --------------------------------------------------------------- questions
  getPoolSize() {
    return this.buildTargets().length;
  }

  buildTargets() {
    const data = window.APP_DATA;
    if (!data) return [];
    const scope = this.lessonScope;
    const f = list => (scope && scope !== 'all') ? list.filter(i => i.lesson === scope) : [...list];
    const vocab = f(data.vocabulary);
    const kanji = f(data.kanji);
    const grammar = f(data.grammar);

    switch (this.mode) {
      case 'vocab_jp_vn':
      case 'vocab_vn_jp': return vocab.map(item => ({ type: this.mode, item, list: vocab, all: data.vocabulary }));
      case 'kanji_hanviet': return kanji.map(item => ({ type: 'k', item, list: kanji, all: data.kanji }));
      case 'grammar_formula': return grammar.map(item => ({ type: 'g', item, list: grammar, all: data.grammar }));
      default:
        return [
          ...vocab.map(item => ({ type: 'vocab_jp_vn', item, list: vocab, all: data.vocabulary })),
          ...kanji.map(item => ({ type: 'k', item, list: kanji, all: data.kanji }))
        ];
    }
  }

  makeQuestion(t) {
    const { item: target, list, all } = t;
    const build = (key, correct, extra) => {
      const distractors = this.getRandomDistractors(list, target, 3, key, all);
      return {
        correctAnswer: correct,
        options: this.shuffleArray([correct, ...distractors.map(d => d[key])]),
        ...extra
      };
    };

    if (t.type === 'vocab_jp_vn') {
      return build('meaning', target.meaning, {
        prompt: target.display,
        subPrompt: target.kana && target.kanji ? target.kana : '',
        hint: `${target.lesson} • ${target.part || 'Từ vựng'}`
      });
    }
    if (t.type === 'vocab_vn_jp') {
      return build('display', target.display, {
        prompt: target.meaning,
        subPrompt: 'Chọn từ tiếng Nhật tương ứng',
        hint: target.lesson
      });
    }
    if (t.type === 'k') {
      return build('han_viet', target.han_viet, {
        prompt: target.kanji,
        subPrompt: `On: ${target.onyomi || '—'} | Kun: ${target.kunyomi || '—'}`,
        hint: `${target.lesson} • Hán tự`
      });
    }
    return build('formula', target.formula, {
      prompt: target.title,
      subPrompt: target.points ? target.points.slice(0, 60) + '...' : '',
      hint: `${target.lesson} • Cấu trúc ngữ pháp`
    });
  }

  generateQuestions() {
    const targets = this.shuffleArray(this.buildTargets());
    const count = this.questionCount === 'all' ? targets.length : Math.min(this.questionCount, targets.length);
    return targets.slice(0, count).map(t => this.makeQuestion(t));
  }

  getRandomDistractors(list, excludeItem, count, key, fallbackList = null) {
    const uniq = arr => {
      const seen = new Set();
      return arr.filter(item => {
        if (!item[key] || item[key] === excludeItem[key] || seen.has(item[key])) return false;
        seen.add(item[key]);
        return true;
      });
    };
    let pool = uniq(list);
    if (pool.length < count && fallbackList) pool = uniq(fallbackList);
    return this.shuffleArray(pool).slice(0, count);
  }

  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // -------------------------------------------------------------------- flow
  showConfig() {
    clearInterval(this.timer);
    clearTimeout(this.nextTimeout);
    document.getElementById('quiz-result-view').style.display = 'none';
    document.getElementById('quiz-play-view').style.display = 'none';
    document.getElementById('quiz-config-view').style.display = 'block';
    this.syncSettingsUI();
  }

  startQuiz(customQuestions = null) {
    clearInterval(this.timer);
    clearTimeout(this.nextTimeout);

    const qs = customQuestions
      ? this.shuffleArray(customQuestions).map(q => ({ ...q, options: this.shuffleArray(q.options) }))
      : this.generateQuestions();

    if (qs.length === 0) {
      window.app?.showToast('Không có dữ liệu cho phạm vi/chế độ đã chọn!', 'warning');
      return;
    }

    this.questions = qs;
    this.currentIndex = 0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.correctCount = 0;
    this.wrongList = [];

    if (!customQuestions && this.questionCount !== 'all' && qs.length < this.questionCount) {
      window.app?.showToast(`Phạm vi này chỉ có ${qs.length} câu.`, 'info');
    }

    document.getElementById('quiz-config-view').style.display = 'none';
    document.getElementById('quiz-result-view').style.display = 'none';
    document.getElementById('quiz-play-view').style.display = 'flex';

    this.renderQuestion();
  }

  renderQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.finishQuiz();
      return;
    }

    this.isAnswering = true;
    const q = this.questions[this.currentIndex];

    const qNumEl = document.getElementById('quiz-q-num');
    const scoreEl = document.getElementById('quiz-score-val');
    const comboEl = document.getElementById('quiz-combo-badge');
    if (qNumEl) qNumEl.textContent = `${this.currentIndex + 1} / ${this.questions.length}`;
    if (scoreEl) scoreEl.textContent = `${this.score} pts`;
    if (comboEl) {
      comboEl.textContent = `Combo x${this.combo}`;
      comboEl.style.display = this.combo > 1 ? 'inline-block' : 'none';
    }
    const progressFill = document.getElementById('quiz-progress-fill');
    if (progressFill) progressFill.style.width = `${(this.currentIndex / this.questions.length) * 100}%`;

    document.getElementById('quiz-prompt-text').textContent = q.prompt;
    document.getElementById('quiz-prompt-sub').textContent = q.subPrompt || '';
    document.getElementById('quiz-hint-tag').textContent = q.hint;

    const optionsGrid = document.getElementById('quiz-options-grid');
    optionsGrid.innerHTML = q.options.map((opt, idx) => `
      <button class="quiz-opt-btn" data-opt="${encodeURIComponent(opt)}">
        <span><strong>${idx + 1}.</strong> ${opt}</span>
        <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">[${idx + 1}]</span>
      </button>
    `).join('');

    optionsGrid.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.isAnswering) return;
        this.handleAnswer(decodeURIComponent(btn.dataset.opt), btn);
      });
    });

    this.startTimer();
  }

  startTimer() {
    clearInterval(this.timer);
    const wrap = document.querySelector('.quiz-timer-bar-wrap');
    const timerBar = document.getElementById('quiz-timer-fill');

    if (!this.maxTime) {
      if (wrap) wrap.style.display = 'none';
      return;
    }
    if (wrap) wrap.style.display = '';

    this.timeLeft = this.maxTime;
    if (timerBar) {
      timerBar.style.width = '100%';
      timerBar.classList.remove('warning');
    }

    this.timer = setInterval(() => {
      this.timeLeft -= 0.1;
      const pct = (this.timeLeft / this.maxTime) * 100;
      if (timerBar) {
        timerBar.style.width = `${Math.max(0, pct)}%`;
        if (pct < 30) timerBar.classList.add('warning');
      }
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.handleTimeout();
      }
    }, 100);
  }

  highlightCorrect(q) {
    document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      if (decodeURIComponent(btn.dataset.opt) === q.correctAnswer) btn.classList.add('correct');
    });
  }

  handleAnswer(chosen, chosenBtn) {
    clearInterval(this.timer);
    this.isAnswering = false;
    const q = this.questions[this.currentIndex];

    if (chosen === q.correctAnswer) {
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      this.score += 100 + this.combo * 20;
      this.correctCount++;
      chosenBtn.classList.add('correct');
      window.soundEngine.playCorrect(this.combo);
    } else {
      this.combo = 0;
      chosenBtn.classList.add('wrong');
      window.soundEngine.playWrong();
      this.highlightCorrect(q);
      this.wrongList.push({ q, chosen });
    }

    this.nextTimeout = setTimeout(() => {
      this.currentIndex++;
      this.renderQuestion();
    }, chosen === q.correctAnswer ? 800 : 1500);
  }

  handleTimeout() {
    this.isAnswering = false;
    this.combo = 0;
    window.soundEngine.playWrong();
    const q = this.questions[this.currentIndex];
    this.highlightCorrect(q);
    this.wrongList.push({ q, chosen: null });

    this.nextTimeout = setTimeout(() => {
      this.currentIndex++;
      this.renderQuestion();
    }, 1500);
  }

  finishQuiz() {
    clearInterval(this.timer);
    clearTimeout(this.nextTimeout);
    this.isAnswering = false;

    const total = this.questions.length;
    const accuracy = total ? Math.round((this.correctCount / total) * 100) : 0;

    window.storageManager.saveQuizScore(this.mode, this.score);
    window.soundEngine.playFanfare();

    document.getElementById('quiz-play-view').style.display = 'none';
    const resultCard = document.getElementById('quiz-result-view');
    resultCard.style.display = 'flex';

    document.getElementById('final-score-val').textContent = `${this.score} Điểm`;
    document.getElementById('final-max-combo').textContent =
      `Đúng ${this.correctCount}/${total} câu (${accuracy}%) • Max Combo: x${this.maxCombo}`;

    const wrongBtn = document.getElementById('btn-quiz-redo-wrong');
    if (wrongBtn) wrongBtn.style.display = this.wrongList.length ? '' : 'none';

    const review = document.getElementById('quiz-review-list');
    if (review) {
      if (!this.wrongList.length) {
        review.innerHTML = '<div style="color: var(--text-secondary);">Bạn trả lời đúng tất cả các câu.</div>';
      } else {
        review.innerHTML = `
          <div class="quiz-config-label" style="margin-bottom: 0.5rem;">Các câu làm sai (${this.wrongList.length}):</div>
          ${this.wrongList.map(w => `
            <div class="quiz-review-item">
              <div class="jp-font" style="font-weight: 700; color: var(--text-heading);">${w.q.prompt}${w.q.subPrompt && !w.q.subPrompt.startsWith('Chọn') ? ` <span style="font-weight: 400; color: var(--text-muted); font-size: 0.85rem;">${w.q.subPrompt}</span>` : ''}</div>
              <div style="font-size: 0.9rem;">Đáp án đúng: <strong style="color: var(--success, #16a34a);">${w.q.correctAnswer}</strong></div>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">Bạn chọn: ${w.chosen === null ? '(hết giờ)' : w.chosen}</div>
            </div>
          `).join('')}
        `;
      }
    }
  }
}

window.QuizEngine = QuizEngine;
