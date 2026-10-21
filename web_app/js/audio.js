/**
 * Web Audio & Text-to-Speech Engine
 * Generates synthesizer UI sounds and speaks Japanese phrases natively.
 */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.voice = null;
    this.speechRate = 0.95;
    this.initAudio();
    this.initVoice();
  }

  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  ensureContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  initVoice() {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Look for Japanese voices
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

  // Synthesized UI Sounds via Web Audio API
  playFlip() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.08);
  }

  playCorrect() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;
    
    // Play a delightful two-tone chime (E5 -> G#5)
    [659.25, 830.61].forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.25);
    });
  }

  playWrong() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playFanfare() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureContext();
    const now = this.audioCtx.currentTime;
    // C5, E5, G5, C6 triumph chord
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.12, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.4);
    });
  }

  // Native Japanese Text-to-Speech
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
