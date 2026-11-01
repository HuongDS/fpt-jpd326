/**
 * Web Audio & Text-to-Speech Engine
 * Generates tactile synthesizer UI interaction sounds and speaks Japanese natively.
 * Fully offline, zero external audio assets, high performance, zero latency.
 */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = localStorage.getItem('jpd326_sound_enabled') !== '0';
    this.voice = null;
    this.speechRate = 0.95;
    this.lastSoundTime = 0;

    this.initAudio();
    this.initVoice();
    this.bindInteractiveSounds();
  }

  initAudio() {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }

    // Auto-resume AudioContext on first user interaction
    const unlockAudio = () => {
      this.ensureContext();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
  }

  ensureContext() {
    if (!this.audioCtx) {
      try {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass) this.audioCtx = new AudioCtxClass();
      } catch (e) {
        return;
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  initVoice() {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find(v => v.lang === 'ja-JP' || v.lang.startsWith('ja'));
      if (jaVoice) {
        this.voice = jaVoice;
      }
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  // --------------------------------------------------------------------------
  // SYNTHESIZED TACTILE UI SOUNDS (Web Audio API)
  // --------------------------------------------------------------------------

  /** Crisp, subtle modern UI click (e.g. general buttons, prev/next, search items) */
  playClick() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;
    if (now - this.lastSoundTime < 0.02) return;
    this.lastSoundTime = now;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.025);

    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
  }

  /** Soft playful bubble pop (for filter chips, lesson selectors, deck selectors) */
  playChip() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;
    if (now - this.lastSoundTime < 0.02) return;
    this.lastSoundTime = now;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.035);

    gain.gain.setValueAtTime(0.065, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.038);
  }

  /** Modern acoustic chord transition (for navigation tab switching) */
  playTab() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;
    if (now - this.lastSoundTime < 0.03) return;
    this.lastSoundTime = now;

    // Harmonic two-tone: C5 (523.25Hz) and E5 (659.25Hz)
    [523.25, 659.25].forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      const t = now + idx * 0.03;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    });
  }

  /** Gentle 3-note ascending chord (when opening modals or search popup) */
  playModalOpen() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;
    // A4 (440Hz), C#5 (554.37Hz), E5 (659.25Hz)
    [440, 554.37, 659.25].forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      const t = now + idx * 0.035;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.055, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    });
  }

  /** Soft descending tone (when closing modals or overlays) */
  playModalClose() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.07);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  /** Sparkling star chime when bookmarking/saving, or gentle descending tone when removing */
  playFavorite(isAdded = true) {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;

    if (isAdded) {
      // Sparkling ascending chime: E5, G#5, B5, E6
      [659.25, 830.61, 987.77, 1318.51].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        const t = now + idx * 0.04;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.14);
      });
    } else {
      // Gentle downward unbookmark tone
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  }

  /** Tailored audio feedback for Flashcard SRS ratings (1 to 4) */
  playRating(rating) {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;

    if (rating === 1) {
      // Rating 1 (Học lại / Again): soft low double thud (non-punishing)
      [160, 120].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        const t = now + idx * 0.08;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
      });
    } else if (rating === 2) {
      // Rating 2 (Khó / Hard): mellow single chime (F4)
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(349.23, now);
      gain.gain.setValueAtTime(0.065, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (rating === 3) {
      // Rating 3 (Tốt / Good): pleasant ascending chime (C5 -> E5)
      [523.25, 659.25].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        const t = now + idx * 0.07;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.18);
      });
    } else if (rating === 4) {
      // Rating 4 (Dễ / Easy): radiant triple chime (E5 -> A5 -> C6)
      [659.25, 880.00, 1046.50].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        const t = now + idx * 0.06;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.085, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.22);
      });
    }
  }

  /** Quick upward chirp for ON, downward chirp for OFF */
  playToggle(state = true) {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';

    if (state) {
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    } else {
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.04);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    }

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  /** Card flip swoosh + gentle paper snap */
  playFlip() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  /** Uplifting two-tone chime for correct quiz answers; pitch scales gently with combos */
  playCorrect(combo = 1) {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;
    
    // Scale pitch slightly as combo increases (up to +30%)
    const comboFactor = Math.min(1.3, 1 + (Math.max(1, combo) - 1) * 0.035);
    const baseFreqs = [659.25, 830.61]; // E5 -> G#5

    baseFreqs.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      const t = now + idx * 0.08;
      osc.frequency.setValueAtTime(freq * comboFactor, t);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  /** Mellow low boop for wrong quiz answers (gentle, not irritating) */
  playWrong() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(170, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.18);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  /** Celebratory 4-note victory chord on quiz completion */
  playFanfare() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;

    // C5, E5, G5, C6 triumph chord
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      const t = now + idx * 0.1;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  // --------------------------------------------------------------------------
  // AUTOMATIC INTERACTION DELEGATION
  // --------------------------------------------------------------------------
  /**
   * Automatically attaches tactile sound feedback to all interactive elements,
   * including dynamically rendered lists, chips, cards, modals, and buttons.
   */
  bindInteractiveSounds() {
    document.addEventListener('click', (e) => {
      if (!this.soundEnabled) return;

      // 1. Navigation Tab Buttons
      if (e.target.closest('.nav-tab-btn')) {
        this.playTab();
        return;
      }

      // 2. Filter chips & Lesson chips & Deck chips
      if (e.target.closest('.filter-chip')) {
        this.playChip();
        return;
      }

      // 3. Kanji grid card -> opens detail modal
      if (e.target.closest('.kanji-card-item')) {
        this.playModalOpen();
        return;
      }

      // 4. Modal close buttons or modal backdrop
      if (e.target.closest('#kanji-modal-close, #search-modal-close, #btn-close-search, .modal-backdrop')) {
        this.playModalClose();
        return;
      }

      // 5. Search trigger button in header
      if (e.target.closest('#btn-open-search')) {
        this.playModalOpen();
        return;
      }

      // 6. Rating buttons (SRS) - handled specifically in rateCard, ignore general click
      if (e.target.closest('.rating-btn')) {
        return;
      }

      // 7. Favorite bookmark button - handled in toggleFavorite, ignore general click
      if (e.target.closest('.btn-vocab-fav')) {
        return;
      }

      // 8. Flashcard flip stage - handled in flashcardEngine.flip(), ignore general click
      if (e.target.closest('#flashcard-stage')) {
        return;
      }

      // 9. Japanese pronunciation audio buttons - TTS handles, skip click sound
      if (e.target.closest('.btn-speak-vocab, .btn-speak-ex, #btn-modal-speak-kanji, #fc-speak-btn')) {
        return;
      }

      // 10. Quiz option answer buttons - handled in quizEngine, skip general click
      if (e.target.closest('.quiz-opt-btn')) {
        return;
      }

      // 11. General interactive buttons, cards, action items
      const interactiveEl = e.target.closest(
        'button, .btn, .icon-btn, .lesson-card, .search-result-item, #btn-logo-home, .card-action-btn'
      );
      if (interactiveEl) {
        this.playClick();
      }
    }, true);
  }

  // --------------------------------------------------------------------------
  // NATIVE JAPANESE TEXT-TO-SPEECH (TTS)
  // --------------------------------------------------------------------------
  speakJapanese(text) {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel(); // Stop any pending speech
    
    // Clean text: strip parenthesis annotations like (ちけい) or [1.] if needed
    const cleanText = text.replace(/[\(\[\{].*?[\)\]\}]/g, '').trim();
    const utter = new SpeechSynthesisUtterance(cleanText || text);
    utter.lang = 'ja-JP';
    utter.rate = this.speechRate;
    if (this.voice) {
      utter.voice = this.voice;
    }
    window.speechSynthesis.speak(utter);
  }
}

// Global instance
window.soundEngine = new SoundEngine();
