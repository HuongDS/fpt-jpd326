/**
 * Speed Quiz Arena Engine
 * Fast-paced multiple choice quizzes with timers, streaks, combos, and sound effects.
 */

class QuizEngine {
  constructor() {
    this.mode = 'vocab_jp_vn';
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.timer = null;
    this.timeLeft = 10;
    this.maxTime = 10;
    this.isAnswering = false;

    this.container = document.getElementById('quiz-arena-root');
    this.initEvents();
  }

  initEvents() {
    // Mode selection buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.mode = btn.dataset.mode;
      });
    });

    const startBtn = document.getElementById('btn-start-quiz');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startQuiz());
    }

    // Keyboard support for 1, 2, 3, 4
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      const quizPanel = document.getElementById('tab-quiz');
      if (!quizPanel || !quizPanel.classList.contains('active')) return;
      if (!this.isAnswering) return;

      const keyNum = parseInt(e.key, 10);
      if (keyNum >= 1 && keyNum <= 4) {
        const optionBtns = document.querySelectorAll('.quiz-opt-btn');
        if (optionBtns[keyNum - 1]) {
          optionBtns[keyNum - 1].click();
        }
      }
    });
  }

  generateQuestions() {
    const data = window.APP_DATA;
    if (!data) return [];
    const questions = [];
    const count = 15; // 15 questions per session

    if (this.mode === 'vocab_jp_vn') {
      const vocabList = [...data.vocabulary];
      for (let i = 0; i < count; i++) {
        const target = vocabList[Math.floor(Math.random() * vocabList.length)];
        const distractors = this.getRandomDistractors(vocabList, target, 3, 'meaning');
        const options = this.shuffleArray([target.meaning, ...distractors.map(d => d.meaning)]);
        questions.push({
          prompt: target.display,
          subPrompt: target.kana && target.kanji ? target.kana : '',
          correctAnswer: target.meaning,
          options,
          hint: `${target.lesson} • ${target.part}`
        });
      }
    } else if (this.mode === 'vocab_vn_jp') {
      const vocabList = [...data.vocabulary];
      for (let i = 0; i < count; i++) {
        const target = vocabList[Math.floor(Math.random() * vocabList.length)];
        const distractors = this.getRandomDistractors(vocabList, target, 3, 'display');
        const options = this.shuffleArray([target.display, ...distractors.map(d => d.display)]);
        questions.push({
          prompt: target.meaning,
          subPrompt: 'Chọn từ tiếng Nhật tương ứng',
          correctAnswer: target.display,
          options,
          hint: target.lesson
        });
      }
    } else if (this.mode === 'kanji_hanviet') {
      const kanjiList = [...data.kanji];
      for (let i = 0; i < count; i++) {
        const target = kanjiList[Math.floor(Math.random() * kanjiList.length)];
        const distractors = this.getRandomDistractors(kanjiList, target, 3, 'han_viet');
        const options = this.shuffleArray([target.han_viet, ...distractors.map(d => d.han_viet)]);
        questions.push({
          prompt: target.kanji,
          subPrompt: `On: ${target.onyomi || '—'} | Kun: ${target.kunyomi || '—'}`,
          correctAnswer: target.han_viet,
          options,
          hint: `${target.lesson} • Hán tự`
        });
      }
    } else if (this.mode === 'grammar_formula') {
      const grammarList = [...data.grammar];
      for (let i = 0; i < count; i++) {
        const target = grammarList[Math.floor(Math.random() * grammarList.length)];
        const distractors = this.getRandomDistractors(grammarList, target, 3, 'formula');
        const options = this.shuffleArray([target.formula, ...distractors.map(d => d.formula)]);
        questions.push({
          prompt: target.title,
          subPrompt: target.points ? target.points.slice(0, 60) + '...' : '',
          correctAnswer: target.formula,
          options,
          hint: `${target.lesson} • Cấu trúc ngữ pháp`
        });
      }
    } else {
      // Mixed Challenge
      const allPool = [
        ...data.vocabulary.map(v => ({ type: 'v', item: v })),
        ...data.kanji.map(k => ({ type: 'k', item: k }))
      ];
      for (let i = 0; i < count; i++) {
        const pick = allPool[Math.floor(Math.random() * allPool.length)];
        if (pick.type === 'v') {
          const target = pick.item;
          const distractors = this.getRandomDistractors(data.vocabulary, target, 3, 'meaning');
          questions.push({
            prompt: target.display,
            subPrompt: target.kana,
            correctAnswer: target.meaning,
            options: this.shuffleArray([target.meaning, ...distractors.map(d => d.meaning)]),
            hint: `${target.lesson} • Từ vựng`
          });
        } else {
          const target = pick.item;
          const distractors = this.getRandomDistractors(data.kanji, target, 3, 'han_viet');
          questions.push({
            prompt: target.kanji,
            subPrompt: 'Hán Việt là gì?',
            correctAnswer: target.han_viet,
            options: this.shuffleArray([target.han_viet, ...distractors.map(d => d.han_viet)]),
            hint: `${target.lesson} • Hán tự`
          });
        }
      }
    }

    return questions;
  }

  getRandomDistractors(list, excludeItem, count, key) {
    const pool = list.filter(item => item[key] && item[key] !== excludeItem[key]);
    const shuffled = this.shuffleArray([...pool]);
    return shuffled.slice(0, count);
  }

  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  startQuiz() {
    this.questions = this.generateQuestions();
    this.currentIndex = 0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;

    const configCard = document.getElementById('quiz-config-view');
    const playCard = document.getElementById('quiz-play-view');
    if (configCard) configCard.style.display = 'none';
    if (playCard) playCard.style.display = 'flex';

    this.renderQuestion();
  }

  renderQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.finishQuiz();
      return;
    }

    this.isAnswering = true;
    const q = this.questions[this.currentIndex];

    // Update Counter & Score
    const qNumEl = document.getElementById('quiz-q-num');
    const scoreEl = document.getElementById('quiz-score-val');
    const comboEl = document.getElementById('quiz-combo-badge');
    if (qNumEl) qNumEl.textContent = `${this.currentIndex + 1} / ${this.questions.length}`;
    if (scoreEl) scoreEl.textContent = `${this.score} pts`;
    if (comboEl) {
      comboEl.textContent = `Combo x${this.combo}`;
      comboEl.style.display = this.combo > 1 ? 'inline-block' : 'none';
    }

    // Render Prompt
    const promptEl = document.getElementById('quiz-prompt-text');
    const subPromptEl = document.getElementById('quiz-prompt-sub');
    const hintEl = document.getElementById('quiz-hint-tag');
    if (promptEl) promptEl.textContent = q.prompt;
    if (subPromptEl) subPromptEl.textContent = q.subPrompt;
    if (hintEl) hintEl.textContent = q.hint;

    // Render Options
    const optionsGrid = document.getElementById('quiz-options-grid');
    if (optionsGrid) {
      optionsGrid.innerHTML = q.options.map((opt, idx) => `
        <button class="quiz-opt-btn" data-opt="${encodeURIComponent(opt)}">
          <span><strong>${idx + 1}.</strong> ${opt}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">[${idx + 1}]</span>
        </button>
      `).join('');

      optionsGrid.querySelectorAll('.quiz-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!this.isAnswering) return;
          const chosen = decodeURIComponent(btn.dataset.opt);
          this.handleAnswer(chosen, btn);
        });
      });
    }

    // Start Timer
    this.startTimer();
  }

  startTimer() {
    clearInterval(this.timer);
    this.timeLeft = this.maxTime;
    const timerBar = document.getElementById('quiz-timer-fill');
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

  handleAnswer(chosen, chosenBtn) {
    clearInterval(this.timer);
    this.isAnswering = false;
    const q = this.questions[this.currentIndex];
    const isCorrect = chosen === q.correctAnswer;

    if (isCorrect) {
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      const points = 100 + this.combo * 20;
      this.score += points;
      chosenBtn.classList.add('correct');
      window.soundEngine.playCorrect();
    } else {
      this.combo = 0;
      chosenBtn.classList.add('wrong');
      window.soundEngine.playWrong();
      // Highlight the correct one
      document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
        if (decodeURIComponent(btn.dataset.opt) === q.correctAnswer) {
          btn.classList.add('correct');
        }
      });
    }

    setTimeout(() => {
      this.currentIndex++;
      this.renderQuestion();
    }, 1200);
  }

  handleTimeout() {
    this.isAnswering = false;
    this.combo = 0;
    window.soundEngine.playWrong();
    const q = this.questions[this.currentIndex];

    // Highlight correct answer
    document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      if (decodeURIComponent(btn.dataset.opt) === q.correctAnswer) {
        btn.classList.add('correct');
      }
    });

    setTimeout(() => {
      this.currentIndex++;
      this.renderQuestion();
    }, 1400);
  }

  finishQuiz() {
    clearInterval(this.timer);
    window.storageManager.saveQuizScore(this.mode, this.score);
    window.soundEngine.playFanfare();

    const playCard = document.getElementById('quiz-play-view');
    const resultCard = document.getElementById('quiz-result-view');
    if (playCard) playCard.style.display = 'none';
    if (resultCard) {
      resultCard.style.display = 'flex';
      document.getElementById('final-score-val').textContent = `${this.score} Điểm`;
      document.getElementById('final-max-combo').textContent = `Max Combo: x${this.maxCombo}`;
      
      const restartBtn = document.getElementById('btn-quiz-retry');
      if (restartBtn) {
        restartBtn.onclick = () => {
          resultCard.style.display = 'none';
          document.getElementById('quiz-config-view').style.display = 'block';
        };
      }
    }
  }
}

window.QuizEngine = QuizEngine;
