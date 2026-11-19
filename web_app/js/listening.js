/**
 * Listening Comprehension & Drag-and-Drop Cloze Engine (Luyện Nghe & Đục Lỗ Kéo Thả)
 * Supports audio playback with sentence timestamp sync, full script & translation view,
 * and interactive drag-and-drop / click-to-fill cloze exercises.
 */

class ListeningEngine {
  constructor() {
    this.tracks = window.LISTENING_DATA || [];
    this.lessonScope = 'all';
    this.currentTrackId = this.tracks[0]?.id || '';
    this.viewMode = 'cloze'; // 'cloze' | 'script' | 'blind'
    this.clozeLevel = 1;     // 1 = Trọng tâm | 2 = Đầy đủ
    this.showVi = true;      // Show Vietnamese translation in Script (and optional in Cloze)
    this.showClozeVi = false;
    this.showChipHint = false;
    this.instantCheck = true;

    // Cloze runtime state
    this.blanks = [];        // [{ blankId, lineIdx, word, reading, meaning }]
    this.wordBank = [];      // shuffled [{ chipId, word, reading, meaning }]
    this.filled = {};        // { [blankId]: chipId }
    this.checked = {};       // { [blankId]: 'correct' | 'wrong' }
    this.activeBlankId = null;
    this.selectedChipId = null;
    this.streak = 0;
    this.completedBannerShown = false;

    // Audio runtime state
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.isPlaying = false;
    this.isLooping = false;
    this.playbackRate = 1.0;
    this.activeLineIdx = -1;

    this.doneMap = this.loadDoneMap();
    this.initAudioEvents();
    this.initDOMEvents();
    this.render();
  }

  // ------------------------------------------------------------------ storage
  loadDoneMap() {
    try {
      return JSON.parse(localStorage.getItem('jpd326_listening_done') || '{}') || {};
    } catch (e) {
      return {};
    }
  }

  markTrackDone(trackId) {
    if (!trackId) return;
    this.doneMap[trackId] = true;
    try {
      localStorage.setItem('jpd326_listening_done', JSON.stringify(this.doneMap));
    } catch (e) { /* ignore */ }
  }

  esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ------------------------------------------------------------------ getters
  getFilteredTracks() {
    if (!this.lessonScope || this.lessonScope === 'all') return this.tracks;
    return this.tracks.filter(t => t.lesson === this.lessonScope);
  }

  getCurrentTrack() {
    const filtered = this.getFilteredTracks();
    if (!filtered.length) return null;
    return filtered.find(t => t.id === this.currentTrackId) || filtered[0];
  }

  setLessonScope(lesson) {
    this.lessonScope = lesson || 'all';
    const lessonChips = document.getElementById('listening-lesson-chips');
    if (lessonChips) {
      lessonChips.querySelectorAll('.filter-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.listenLesson === this.lessonScope);
      });
    }
    const filtered = this.getFilteredTracks();
    if (filtered.length && !filtered.some(t => t.id === this.currentTrackId)) {
      this.selectTrack(filtered[0].id, false);
    } else {
      this.render();
    }
  }

  // -------------------------------------------------------------------- audio
  initAudioEvents() {
    this.audio.addEventListener('loadedmetadata', () => {
      this.updateTimeUI();
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updateTimeUI();
      this.syncActiveLine();
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.syncPlayButtonUI();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.syncPlayButtonUI();
    });

    this.audio.addEventListener('ended', () => {
      if (this.isLooping) {
        this.audio.currentTime = 0;
        this.audio.play().catch(() => {});
      } else {
        this.isPlaying = false;
        this.activeLineIdx = -1;
        this.syncPlayButtonUI();
        this.highlightLineDOM(-1);
      }
    });
  }

  loadTrackAudio(track) {
    if (!track) {
      this.audio.pause();
      return;
    }
    if (this.audio.datasetSrc !== track.audio) {
      this.audio.pause();
      this.audio.src = track.audio;
      this.audio.datasetSrc = track.audio;
      this.audio.playbackRate = this.playbackRate;
      this.isPlaying = false;
      this.activeLineIdx = -1;
      this.syncPlayButtonUI();
      this.updateTimeUI();
    }
  }

  togglePlay() {
    const track = this.getCurrentTrack();
    if (!track) return;
    this.loadTrackAudio(track);
    if (this.audio.paused) {
      window.speechSynthesis?.cancel();
      this.audio.playbackRate = this.playbackRate;
      this.audio.play().catch(() => {
        window.app?.showToast('Không thể phát file âm thanh này!', 'warning');
      });
    } else {
      this.audio.pause();
    }
  }

  seekRelative(deltaSec) {
    if (!this.audio.src) return;
    const dur = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
    const next = Math.max(0, Math.min(dur || 9999, (this.audio.currentTime || 0) + deltaSec));
    this.audio.currentTime = next;
    this.updateTimeUI();
    this.syncActiveLine();
  }

  seekToTime(sec, autoPlay = true) {
    const track = this.getCurrentTrack();
    if (!track) return;
    this.loadTrackAudio(track);
    this.audio.currentTime = Math.max(0, sec || 0);
    this.updateTimeUI();
    this.syncActiveLine();
    if (autoPlay) {
      window.speechSynthesis?.cancel();
      this.audio.playbackRate = this.playbackRate;
      this.audio.play().catch(() => {});
    }
  }

  formatTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  updateTimeUI() {
    const cur = this.audio.currentTime || 0;
    const dur = Number.isFinite(this.audio.duration) && this.audio.duration > 0 ? this.audio.duration : 0;
    const curEl = document.getElementById('listen-time-current');
    const totEl = document.getElementById('listen-time-total');
    const range = document.getElementById('listen-seek-range');
    const track = this.getCurrentTrack();

    if (curEl) curEl.textContent = this.formatTime(cur);
    if (totEl) totEl.textContent = dur > 0 ? this.formatTime(dur) : (track?.duration_label || '00:00');
    if (range) {
      const pct = dur > 0 ? Math.min(100, (cur / dur) * 100) : 0;
      range.value = String(pct);
      range.style.setProperty('--seek-pct', `${pct}%`);
    }
  }

  syncPlayButtonUI() {
    const btn = document.getElementById('btn-listen-play');
    const wave = document.getElementById('listen-blind-wave');
    if (btn) {
      btn.textContent = this.isPlaying ? 'Tạm dừng' : 'Phát bài nghe';
      btn.classList.toggle('playing', this.isPlaying);
    }
    if (wave) {
      wave.classList.toggle('playing', this.isPlaying);
    }
  }

  syncActiveLine() {
    const track = this.getCurrentTrack();
    if (!track || !Array.isArray(track.lines)) return;
    const t = this.audio.currentTime || 0;
    let idx = -1;
    for (let i = 0; i < track.lines.length; i++) {
      const ln = track.lines[i];
      if (t >= ln.start && t <= ln.end) {
        idx = i;
        break;
      }
    }
    if (idx !== this.activeLineIdx) {
      this.activeLineIdx = idx;
      this.highlightLineDOM(idx);
    }
  }

  highlightLineDOM(idx) {
    document.querySelectorAll('#listening-content-area .listen-line-row').forEach(el => {
      const lineIdx = parseInt(el.dataset.lineIdx, 10);
      el.classList.toggle('speaking-now', lineIdx === idx);
    });
  }

  // ------------------------------------------------------------------- parser
  /**
   * Parses a line's `cloze` template into segments of text and blank objects.
   * Tokens with `level <= this.clozeLevel` become interactive blanks;
   * tokens with `level > this.clozeLevel` render as plain text.
   */
  parseTrackCloze(track) {
    const blanks = [];
    const parsedLines = [];
    if (!track || !Array.isArray(track.lines)) return { blanks, parsedLines };

    const tokenRe = /\{\{([^}]+)\}\}/g;
    let bCounter = 0;

    track.lines.forEach((line, lineIdx) => {
      const segments = [];
      let plainJp = '';
      let lastIndex = 0;
      let match;
      tokenRe.lastIndex = 0;

      while ((match = tokenRe.exec(line.cloze)) !== null) {
        if (match.index > lastIndex) {
          const txt = line.cloze.slice(lastIndex, match.index);
          segments.push({ type: 'text', text: txt });
          plainJp += txt;
        }
        const parts = match[1].split('|').map(s => s.trim());
        const word = parts[0] || '';
        const reading = parts[1] || word;
        const meaning = parts[2] || '';
        const level = parseInt(parts[3] || '1', 10) || 1;

        plainJp += word;
        if (level <= this.clozeLevel) {
          const blankId = `b_${bCounter++}`;
          const bObj = { blankId, lineIdx, word, reading, meaning, level };
          blanks.push(bObj);
          segments.push({ type: 'blank', blank: bObj });
        } else {
          segments.push({ type: 'text', text: word });
        }
        lastIndex = tokenRe.lastIndex;
      }

      if (lastIndex < line.cloze.length) {
        const tail = line.cloze.slice(lastIndex);
        segments.push({ type: 'text', text: tail });
        plainJp += tail;
      }

      parsedLines.push({
        lineIdx,
        start: line.start,
        end: line.end,
        speaker: line.speaker || '',
        vi: line.vi || '',
        plainJp,
        segments
      });
    });

    return { blanks, parsedLines };
  }

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  setupClozeState(track) {
    const { blanks, parsedLines } = this.parseTrackCloze(track);
    this.blanks = blanks;
    this.parsedLines = parsedLines;
    this.wordBank = this.shuffle(blanks.map((b, i) => ({
      chipId: `chip_${i}_${b.blankId}`,
      word: b.word,
      reading: b.reading,
      meaning: b.meaning
    })));
    this.filled = {};
    this.checked = {};
    this.activeBlankId = blanks[0]?.blankId || null;
    this.selectedChipId = null;
    this.streak = 0;
    this.completedBannerShown = false;
  }

  // --------------------------------------------------------------- operations
  selectTrack(trackId, resetAudio = true) {
    this.currentTrackId = trackId;
    const track = this.getCurrentTrack();
    if (track) {
      this.setupClozeState(track);
      if (resetAudio) {
        this.audio.pause();
        this.loadTrackAudio(track);
      }
    }
    this.render();
  }

  setViewMode(mode) {
    if (!['cloze', 'script', 'blind'].includes(mode)) return;
    this.viewMode = mode;
    window.soundEngine?.playTab?.();
    this.renderWorkspace();
    this.updateFloatingAudioBar();
  }

  /**
   * Places a chip (`chipId`) into a target blank (`blankId`).
   * If `chipId` was already placed in another blank, frees that previous blank.
   */
  placeChipInBlank(chipId, blankId) {
    const blank = this.blanks.find(b => b.blankId === blankId);
    const chip = this.wordBank.find(c => c.chipId === chipId);
    if (!blank || !chip) return;

    // If this chip was already in another blank, clear that blank
    Object.keys(this.filled).forEach(bId => {
      if (this.filled[bId] === chipId) {
        delete this.filled[bId];
        delete this.checked[bId];
      }
    });

    this.filled[blankId] = chipId;
    this.selectedChipId = null;

    if (this.instantCheck) {
      const isOk = chip.word === blank.word;
      this.checked[blankId] = isOk ? 'correct' : 'wrong';
      if (isOk) {
        this.streak++;
        window.soundEngine?.playCorrect?.(this.streak);
      } else {
        this.streak = 0;
        window.soundEngine?.playWrong?.();
      }
    } else {
      delete this.checked[blankId];
      window.soundEngine?.playChip?.();
    }

    // Advance activeBlankId to next empty blank
    const nextEmpty = this.blanks.find(b => !this.filled[b.blankId]);
    this.activeBlankId = nextEmpty ? nextEmpty.blankId : null;

    this.renderWorkspace();

    if (this.instantCheck && this.checked[blankId] === 'correct') {
      const blankEl = document.querySelector(`.cloze-blank[data-blank-id="${blankId}"]`);
      if (blankEl) window.FX?.burstAt?.(blankEl, { count: 14, speed: 250 });
    }
    this.checkIfAllCompleted();
  }

  removeChipFromBlank(blankId) {
    if (!this.filled[blankId]) return;
    delete this.filled[blankId];
    delete this.checked[blankId];
    this.activeBlankId = blankId;
    window.soundEngine?.playClick?.();
    this.renderWorkspace();
    this.updateFloatingAudioBar();
  }

  checkAllBlanks() {
    let allCorrect = this.blanks.length > 0;
    let anyFilled = false;

    this.blanks.forEach(b => {
      const chipId = this.filled[b.blankId];
      if (!chipId) {
        allCorrect = false;
        delete this.checked[b.blankId];
        return;
      }
      anyFilled = true;
      const chip = this.wordBank.find(c => c.chipId === chipId);
      const isOk = chip && chip.word === b.word;
      this.checked[b.blankId] = isOk ? 'correct' : 'wrong';
      if (!isOk) allCorrect = false;
    });

    if (!anyFilled) {
      window.app?.showToast?.('Bạn hãy kéo thả hoặc bấm chọn từ vào chỗ trống trước nhé!', 'info');
      return;
    }

    const correctCount = this.blanks.filter(b => this.checked[b.blankId] === 'correct').length;
    if (allCorrect) {
      window.soundEngine?.playCorrect?.(3);
    } else if (correctCount > 0) {
      window.soundEngine?.playChip?.();
    } else {
      window.soundEngine?.playWrong?.();
    }

    this.renderWorkspace();
    this.checkIfAllCompleted(true);
  }

  fillOneHint() {
    const target = this.blanks.find(b => this. bonusTarget(b));
    if (!target) return;

    // Find an unused chip whose word === target.word, or steal one placed in a wrong blank
    const usedInCorrect = new Set(
      this.blanks
        .filter(b => this.filled[b.blankId] && this.checked[b.blankId] === 'correct')
        .map(b => this.filled[b.blankId])
    );

    const chip = this.wordBank.find(c => c.word === target.word && !usedInCorrect.has(c.chipId));
    if (chip) {
      this.placeChipInBlank(chip.chipId, target.blankId);
      this.checked[target.blankId] = 'correct';
      this.renderWorkspace();
      this.checkIfAllCompleted();
    }
  }

  bonusTarget(b) {
    if (this.activeBlankId && b.blankId === this.activeBlankId && this.checked[b.blankId] !== 'correct') {
      return true;
    }
    return !this.filled[b.blankId] || this.checked[b.blankId] === 'wrong';
  }

  revealAllBlanks() {
    const used = new Set();
    this.blanks.forEach(b => {
      const chip = this.wordBank.find(c => c.word === b.word && !used.has(c.chipId));
      if (chip) {
        used.add(chip.chipId);
        this.filled[b.blankId] = chip.chipId;
        this.checked[b.blankId] = 'correct';
      }
    });
    this.activeBlankId = null;
    this.selectedChipId = null;
    window.soundEngine?.playFlip?.();
    this.renderWorkspace();
    this.updateFloatingAudioBar();
  }

  resetCloze() {
    const track = this.getCurrentTrack();
    if (!track) return;
    this.setupClozeState(track);
    window.soundEngine?.playChip?.();
    this.renderWorkspace();
    this.updateFloatingAudioBar();
  }

  checkIfAllCompleted(forceCelebrate = false) {
    if (!this.blanks.length) return;
    const allOk = this.blanks.every(b => {
      const chipId = this.filled[b.blankId];
      if (!chipId) return false;
      const chip = this.wordBank.find(c => c.chipId === chipId);
      return chip && chip.word === b.word;
    });

    if (allOk) {
      this.blanks.forEach(b => { this.checked[b.blankId] = 'correct'; });
      const track = this.getCurrentTrack();
      if (track) this.markTrackDone(track.id);
      this.renderTrackList();

      if (!this.completedBannerShown || forceCelebrate) {
        this.completedBannerShown = true;
        window.soundEngine?.playFanfare?.();
        window.FX?.confetti?.(0.65);
        this.renderWorkspace();
      }
    }
  }

  // ------------------------------------------------------------------- events
  initDOMEvents() {
    // 1. Lesson chips
    const lessonChips = document.getElementById('listening-lesson-chips');
    if (lessonChips) {
      lessonChips.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          this.setLessonScope(chip.dataset.listenLesson || 'all');
          window.soundEngine?.playChip?.();
        });
      });
    }

    // 2. Audio player controls
    const on = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };
    on('btn-listen-play', () => this.togglePlay());
    on('btn-listen-back5', () => this.seekRelative(-5));
    on('btn-listen-fwd5', () => this.seekRelative(5));
    on('btn-listen-restart', () => this.seekToTime(0, true));
    on('btn-listen-loop', () => {
      this.isLooping = !this.isLooping;
      const loopBtn = document.getElementById('btn-listen-loop');
      if (loopBtn) loopBtn.classList.toggle('active', this.isLooping);
      window.soundEngine?.playToggle?.(this.isLooping);
    });

    const seekRange = document.getElementById('listen-seek-range');
    if (seekRange) {
      seekRange.addEventListener('input', () => {
        const dur = Number.isFinite(this.audio.duration) && this.audio.duration > 0 ? this.audio.duration : 0;
        if (dur > 0) {
          const pct = parseFloat(seekRange.value) || 0;
          this.audio.currentTime = (pct / 100) * dur;
          this.updateTimeUI();
          this.syncActiveLine();
        }
      });
    }

    document.querySelectorAll('.listen-speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rate = parseFloat(btn.dataset.speed) || 1.0;
        this.playbackRate = rate;
        this.audio.playbackRate = rate;
        document.querySelectorAll('.listen-speed-btn').forEach(b => {
          b.classList.toggle('active', parseFloat(b.dataset.speed) === rate);
        });
        window.soundEngine?.playChip?.();
      });
    });

    // 3. Mode tabs ('cloze' | 'script' | 'blind')
    document.querySelectorAll('.listen-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setViewMode(btn.dataset.listenMode);
      });
    });

    // 4. Scroll & resize listener to morph audio bar into floating pill
    const onScrollOrResize = () => this.updateFloatingAudioBar();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
  }

  /**
   * Morphs `#listen-audio-bar` into a floating pill when scrolled past its slot
   */
  updateFloatingAudioBar() {
    const slot = document.getElementById('listen-audio-bar-slot');
    const bar = document.getElementById('listen-audio-bar');
    const panel = document.getElementById('tab-listening');
    if (!slot || !bar) return;

    if (!panel || !panel.classList.contains('active')) {
      if (bar.classList.contains('is-floating-pill')) {
        bar.classList.remove('is-floating-pill');
        bar.style.removeProperty('--listen-float-top');
        slot.style.minHeight = '';
        document.documentElement.style.removeProperty('--listen-pill-offset');
      }
      return;
    }

    const subbar = document.getElementById('app-subbar');
    const header = document.querySelector('.app-header');
    const subRect = subbar ? subbar.getBoundingClientRect() : null;
    const headRect = header ? header.getBoundingClientRect() : null;
    const stickyBottom = Math.max(
      subRect && subRect.height > 0 ? subRect.bottom : 0,
      headRect && headRect.height > 0 ? headRect.bottom : 0,
      0
    );
    const triggerTop = stickyBottom + 8;

    const slotRect = slot.getBoundingClientRect();
    const shouldFloat = slotRect.top <= triggerTop && slotRect.width > 0;

    if (shouldFloat) {
      if (!bar.classList.contains('is-floating-pill')) {
        slot.style.minHeight = `${bar.offsetHeight}px`;
        bar.classList.add('is-floating-pill');
      }
      bar.style.setProperty('--listen-float-top', `${Math.round(triggerTop)}px`);
      document.documentElement.style.setProperty('--listen-pill-offset', `${Math.round(triggerTop + bar.offsetHeight + 10)}px`);
    } else if (bar.classList.contains('is-floating-pill')) {
      bar.classList.remove('is-floating-pill');
      bar.style.removeProperty('--listen-float-top');
      slot.style.minHeight = '';
      document.documentElement.style.removeProperty('--listen-pill-offset');
    }
  }

  // ------------------------------------------------------------------- render
  render() {
    const track = this.getCurrentTrack();
    this.renderTrackList();

    const mainWrap = document.getElementById('listening-main-workspace');
    const emptyWrap = document.getElementById('listening-empty-state');
    if (!track) {
      if (mainWrap) mainWrap.style.display = 'none';
      if (emptyWrap) emptyWrap.style.display = 'block';
      return;
    }

    if (mainWrap) mainWrap.style.display = 'flex';
    if (emptyWrap) emptyWrap.style.display = 'none';

    if (!this.blanks.length || this.loadedClozeTrackId !== track.id) {
      this.loadedClozeTrackId = track.id;
      this.setupClozeState(track);
    }

    this.loadTrackAudio(track);

    // Header info
    const badgeEl = document.getElementById('listen-active-badge');
    const titleEl = document.getElementById('listen-active-title');
    const subEl = document.getElementById('listen-active-summary');
    if (badgeEl) badgeEl.textContent = `${track.lesson} • ${track.code}`;
    if (titleEl) titleEl.textContent = `${track.title} (${track.jp_title})`;
    if (subEl) subEl.textContent = track.summary || '';

    this.renderWorkspace();
    this.updateFloatingAudioBar();
  }

  renderTrackList() {
    const container = document.getElementById('listening-track-list');
    if (!container) return;
    const list = this.getFilteredTracks();
    const current = this.getCurrentTrack();

    if (!list.length) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = list.map(t => {
      const isActive = current && t.id === current.id;
      const isDone = !!this.doneMap[t.id];
      return `
        <button type="button" class="listen-track-card ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}" data-track-id="${this.esc(t.id)}">
          <div class="listen-track-top">
            <span class="listen-track-code">${this.esc(t.code)}</span>
            <span class="listen-track-meta">${isDone ? 'Đã hoàn thành • ' : ''}${this.esc(t.duration_label || '')}</span>
          </div>
          <div class="listen-track-title">${this.esc(t.title)}</div>
          <div class="listen-track-jp jp-font">${this.esc(t.jp_title)}</div>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.listen-track-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.trackId;
        if (id && id !== this.currentTrackId) {
          this.loadedClozeTrackId = null;
          this.selectTrack(id, true);
          window.soundEngine?.playChip?.();
        }
      });
    });
  }

  renderWorkspace() {
    document.querySelectorAll('.listen-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.listenMode === this.viewMode);
    });

    const area = document.getElementById('listening-content-area');
    if (!area) return;
    const track = this.getCurrentTrack();
    if (!track) return;

    if (this.viewMode === 'blind') {
      area.innerHTML = this.renderBlindModeHtml(track);
      this.bindBlindEvents(area);
    } else if (this.viewMode === 'script') {
      area.innerHTML = this.renderScriptModeHtml(track);
      this.bindScriptEvents(area);
    } else {
      area.innerHTML = this.renderClozeModeHtml(track);
      this.bindClozeEvents(area);
    }

    this.highlightLineDOM(this.activeLineIdx);
  }

  renderBlindModeHtml(track) {
    return `
      <div class="listen-blind-box">
        <div class="listen-blind-wave ${this.isPlaying ? 'playing' : ''}" id="listen-blind-wave">
          <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
        <h4>Chế độ Nghe Chay (Không nhìn chữ)</h4>
        <p>Hãy bấm <strong>Phát bài nghe</strong> ở thanh phía trên và lắng nghe toàn bộ nội dung bài <strong>${this.esc(track.title)}</strong> trước khi làm bài đục lỗ hoặc mở xem Script.</p>
        <div class="listen-blind-actions">
          <button type="button" class="btn btn-primary" id="btn-blind-to-cloze">Nghe xong ➜ Làm bài Đục lỗ Kéo thả</button>
          <button type="button" class="btn btn-secondary" id="btn-blind-to-script">Nghe xong ➜ Xem lại Script & Dịch nghĩa</button>
        </div>
      </div>
    `;
  }

  bindBlindEvents(area) {
    area.querySelector('#btn-blind-to-cloze')?.addEventListener('click', () => this.setViewMode('cloze'));
    area.querySelector('#btn-blind-to-script')?.addEventListener('click', () => this.setViewMode('script'));
  }

  renderScriptModeHtml(track) {
    const lines = this.parsedLines || this.parseTrackCloze(track).parsedLines;
    return `
      <div class="listen-script-header">
        <div>
          <span class="listen-section-label">TOÀN BỘ SCRIPT BÀI NGHE</span>
          <span class="listen-section-hint">(Bấm vào từng câu để nghe lại từ đúng vị trí câu đó)</span>
        </div>
        <div class="listen-script-controls">
          <button type="button" class="btn btn-secondary btn-sm ${this.showVi ? 'active' : ''}" id="btn-script-toggle-vi">
            ${this.showVi ? 'Ẩn dịch tiếng Việt' : 'Hiện dịch tiếng Việt'}
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="btn-script-go-cloze">
            Luyện Đục lỗ Kéo thả
          </button>
        </div>
      </div>

      <div class="listen-script-list">
        ${lines.map((ln, idx) => `
          <div class="listen-line-row script-clickable ${this.activeLineIdx === idx ? 'speaking-now' : ''}" data-line-idx="${idx}" data-start="${ln.start}">
            <div class="listen-line-head">
              <div class="listen-line-badges">
                <span class="listen-line-num">Câu ${idx + 1}</span>
                ${ln.speaker ? `<span class="listen-speaker-badge">${this.esc(ln.speaker)}</span>` : ''}
                <span class="listen-line-time">${this.formatTime(ln.start)}</span>
              </div>
              <button type="button" class="icon-btn btn-sm btn-play-line" data-start="${ln.start}" title="Phát từ câu này">Nghe câu này</button>
            </div>
            <div class="listen-line-jp jp-font">${this.esc(ln.plainJp)}</div>
            ${this.showVi && ln.vi ? `<div class="listen-line-vi">${this.esc(ln.vi)}</div>` : ''}
          </div>
        `).join('')}
      </div>

      ${Array.isArray(track.vocab) && track.vocab.length ? `
        <div class="listen-vocab-box">
          <div class="listen-section-label" style="margin-bottom: 0.75rem;">TỪ VỰNG & CẤU TRÚC TRỌNG TÂM TRONG BÀI NGHE</div>
          <div class="listen-vocab-grid">
            ${track.vocab.map(v => `
              <div class="listen-vocab-item">
                <div>
                  <div class="listen-vocab-word jp-font">${this.esc(v.word)} <span class="listen-vocab-kana">(${this.esc(v.kana)})</span></div>
                  <div class="listen-vocab-meaning">${this.esc(v.meaning)}</div>
                </div>
                <button type="button" class="icon-btn btn-sm btn-speak-vocab" data-word="${this.esc(v.word)}">Nghe</button>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  }

  bindScriptEvents(area) {
    area.querySelector('#btn-script-toggle-vi')?.addEventListener('click', () => {
      this.showVi = !this.showVi;
      window.soundEngine?.playToggle?.(this.showVi);
      this.renderWorkspace();
    });
    area.querySelector('#btn-script-go-cloze')?.addEventListener('click', () => {
      this.setViewMode('cloze');
    });
    area.querySelectorAll('.listen-line-row.script-clickable').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const start = parseFloat(row.dataset.start) || 0;
        this.seekToTime(start, true);
      });
    });
    area.querySelectorAll('.btn-play-line').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const start = parseFloat(btn.dataset.start) || 0;
        this.seekToTime(start, true);
      });
    });
    area.querySelectorAll('.btn-speak-vocab').forEach(btn => {
      btn.addEventListener('click', () => {
        const w = btn.dataset.word;
        if (w) window.soundEngine?.speakJapanese?.(w);
      });
    });
  }

  renderClozeModeHtml(track) {
    const usedChipIds = new Set(Object.values(this.filled));
    const availableChips = this.wordBank.filter(c => !usedChipIds.has(c.chipId));
    const totalBlanks = this.blanks.length;
    const filledCount = Object.keys(this.filled).length;
    const correctCount = this.blanks.filter(b => this.checked[b.blankId] === 'correct').length;
    const allCompleted = totalBlanks > 0 && correctCount === totalBlanks;

    return `
      <!-- Cloze Top Toolbar -->
      <div class="cloze-toolbar">
        <div class="cloze-toolbar-left">
          <span class="cloze-toolbar-label">Mức đục lỗ:</span>
          <div class="cloze-level-group">
            <button type="button" class="filter-chip ${this.clozeLevel === 1 ? 'active' : ''}" data-cloze-level="1">Trọng tâm</button>
            <button type="button" class="filter-chip ${this.clozeLevel === 2 ? 'active' : ''}" data-cloze-level="2">Đầy đủ</button>
          </div>
          <label class="cloze-toggle-opt">
            <input type="checkbox" id="chk-cloze-instant" ${this.instantCheck ? 'checked' : ''}>
            <span>Chấm ngay khi thả</span>
          </label>
          <label class="cloze-toggle-opt">
            <input type="checkbox" id="chk-cloze-hint" ${this.showChipHint ? 'checked' : ''}>
            <span>Hiện phiên âm & nghĩa</span>
          </label>
          <label class="cloze-toggle-opt">
            <input type="checkbox" id="chk-cloze-vi" ${this.showClozeVi ? 'checked' : ''}>
            <span>Hiện câu dịch Việt</span>
          </label>
        </div>

        <div class="cloze-toolbar-right">
          <span class="cloze-score-pill">Đã điền: <strong>${filledCount}/${totalBlanks}</strong> • Đúng: <strong>${correctCount}/${totalBlanks}</strong></span>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-cloze-hint" title="Tự động điền đúng 1 ô trống">Gợi ý 1 ô</button>
          <button type="button" class="btn btn-primary btn-sm" id="btn-cloze-check">Kiểm tra đáp án</button>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-cloze-reveal">Xem đáp án</button>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-cloze-reset">Làm lại</button>
        </div>
      </div>

      ${allCompleted ? `
        <div class="cloze-complete-banner">
          <div>
            <strong>Hoàn thành xuất sắc!</strong> Bạn đã điền đúng toàn bộ ${totalBlanks}/${totalBlanks} chỗ trống của bài nghe này.
          </div>
          <button type="button" class="btn btn-primary btn-sm" id="btn-cloze-view-script">Xem lại toàn bộ Script & Dịch nghĩa</button>
        </div>
      ` : ''}

      <!-- Draggable Word Bank -->
      <div class="cloze-word-bank" id="listening-word-bank">
        <div class="cloze-bank-header">
          <span class="listen-section-label">KHO TỪ ĐỂ KÉO THẢ (${availableChips.length} từ còn lại)</span>
          <span class="listen-section-hint">Kéo từ thả vào ô trống bên dưới, hoặc bấm vào từ để điền nhanh vào ô đang chọn</span>
        </div>
        <div class="cloze-bank-chips">
          ${availableChips.length === 0
            ? '<span class="cloze-bank-empty">Đã đặt hết các từ vào chỗ trống. Hãy bấm "Kiểm tra đáp án" hoặc bấm vào ô bất kỳ để đổi lại từ.</span>'
            : availableChips.map(c => `
                <div class="cloze-word-chip jp-font ${this.selectedChipId === c.chipId ? 'selected' : ''}"
                     draggable="true"
                     data-chip-id="${this.esc(c.chipId)}"
                     title="${this.esc(c.reading)} — ${this.esc(c.meaning)}">
                  <span class="chip-main-word">${this.esc(c.word)}</span>
                  ${this.showChipHint ? `<span class="chip-sub-hint">${this.esc(c.reading)} • ${this.esc(c.meaning)}</span>` : ''}
                </div>
              `).join('')
          }
        </div>
      </div>

      <!-- Cloze Script Sentences -->
      <div class="listen-script-list cloze-script-list">
        ${(this.parsedLines || []).map((ln, idx) => `
          <div class="listen-line-row ${this.activeLineIdx === idx ? 'speaking-now' : ''}" data-line-idx="${idx}">
            <div class="listen-line-head">
              <div class="listen-line-badges">
                <span class="listen-line-num">Câu ${idx + 1}</span>
                ${ln.speaker ? `<span class="listen-speaker-badge">${this.esc(ln.speaker)}</span>` : ''}
                <span class="listen-line-time">${this.formatTime(ln.start)}</span>
              </div>
              <button type="button" class="icon-btn btn-sm btn-play-line" data-start="${ln.start}" title="Nghe lại câu này">Nghe câu này</button>
            </div>
            <div class="listen-line-jp cloze-line-jp jp-font">
              ${ln.segments.map(seg => {
                if (seg.type === 'text') return `<span>${this.esc(seg.text)}</span>`;
                const b = seg.blank;
                const chipId = this.filled[b.blankId];
                const chip = chipId ? this.wordBank.find(c => c.chipId === chipId) : null;
                const status = this.checked[b.blankId] || '';
                const isTarget = this.activeBlankId === b.blankId;
                const num = this.blanks.findIndex(x => x.blankId === b.blankId) + 1;
                return `
                  <span class="cloze-blank ${chip ? 'filled' : 'empty'} ${status} ${isTarget ? 'target-blank' : ''}"
                        data-blank-id="${this.esc(b.blankId)}"
                        ${chip ? `draggable="true" data-chip-id="${this.esc(chip.chipId)}"` : ''}
                        title="${chip ? 'Bấm để trả từ về kho hoặc kéo sang ô khác' : `Ô trống số ${num}${this.showChipHint ? ' (' + this.esc(b.meaning) + ')' : ''}`}">
                    ${chip
                      ? `<span class="blank-filled-word">${this.esc(chip.word)}</span>`
                      : `<span class="blank-placeholder">(${num})</span>`
                    }
                  </span>
                `;
              }).join('')}
            </div>
            ${this.showClozeVi && ln.vi ? `<div class="listen-line-vi">${this.esc(ln.vi)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  bindClozeEvents(area) {
    // Level buttons
    area.querySelectorAll('[data-cloze-level]').forEach(btn => {
      btn.addEventListener('click', () => {
        const lv = parseInt(btn.dataset.clozeLevel, 10) || 1;
        if (lv !== this.clozeLevel) {
          this.clozeLevel = lv;
          const track = this.getCurrentTrack();
          if (track) this.setupClozeState(track);
          window.soundEngine?.playChip?.();
          this.renderWorkspace();
        }
      });
    });

    // Checkboxes
    area.querySelector('#chk-cloze-instant')?.addEventListener('change', (e) => {
      this.instantCheck = !!e.target.checked;
      window.soundEngine?.playToggle?.(this.instantCheck);
    });
    area.querySelector('#chk-cloze-hint')?.addEventListener('change', (e) => {
      this.showChipHint = !!e.target.checked;
      window.soundEngine?.playToggle?.(this.showChipHint);
      this.renderWorkspace();
    });
    area.querySelector('#chk-cloze-vi')?.addEventListener('change', (e) => {
      this.showClozeVi = !!e.target.checked;
      window.soundEngine?.playToggle?.(this.showClozeVi);
      this.renderWorkspace();
    });

    // Action buttons
    area.querySelector('#btn-cloze-hint')?.addEventListener('click', () => this.fillOneHint());
    area.querySelector('#btn-cloze-check')?.addEventListener('click', () => this.checkAllBlanks());
    area.querySelector('#btn-cloze-reveal')?.addEventListener('click', () => this.revealAllBlanks());
    area.querySelector('#btn-cloze-reset')?.addEventListener('click', () => this.resetCloze());
    area.querySelector('#btn-cloze-view-script')?.addEventListener('click', () => this.setViewMode('script'));

    // Play single line
    area.querySelectorAll('.btn-play-line').forEach(btn => {
      btn.addEventListener('click', () => {
        const start = parseFloat(btn.dataset.start) || 0;
        this.seekToTime(start, true);
      });
    });

    // Word Bank Chips: Drag & Click
    area.querySelectorAll('.cloze-word-chip').forEach(chipEl => {
      const chipId = chipEl.dataset.chipId;

      chipEl.addEventListener('dragstart', (e) => {
        chipEl.classList.add('dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', JSON.stringify({ chipId, fromBlank: null }));
        }
      });

      chipEl.addEventListener('dragend', () => {
        chipEl.classList.remove('dragging');
      });

      chipEl.addEventListener('click', () => {
        // Click-to-fill into activeBlankId or first empty blank
        const targetId = (this.activeBlankId && !this.filled[this.activeBlankId])
          ? this.activeBlankId
          : (this.blanks.find(b => !this.filled[b.blankId])?.blankId || this.activeBlankId);

        if (targetId) {
          this.placeChipInBlank(chipId, targetId);
        } else {
          this.selectedChipId = this.selectedChipId === chipId ? null : chipId;
          this.renderWorkspace();
        }
      });
    });

    // Word Bank Drop Zone (drag filled word back to bank)
    const bankBox = area.querySelector('#listening-word-bank');
    if (bankBox) {
      bankBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        bankBox.classList.add('drag-over');
      });
      bankBox.addEventListener('dragleave', () => {
        bankBox.classList.remove('drag-over');
      });
      bankBox.addEventListener('drop', (e) => {
        e.preventDefault();
        bankBox.classList.remove('drag-over');
        try {
          const payload = JSON.parse(e.dataTransfer?.getData('text/plain') || '{}');
          if (payload.fromBlank) {
            this.removeChipFromBlank(payload.fromBlank);
          }
        } catch (err) { /* ignore */ }
      });
    }

    // Blank Slots: Drop & Click & Drag-out
    area.querySelectorAll('.cloze-blank').forEach(blankEl => {
      const blankId = blankEl.dataset.blankId;

      blankEl.addEventListener('dragstart', (e) => {
        const chipId = blankEl.dataset.chipId;
        if (!chipId) {
          e.preventDefault();
          return;
        }
        blankEl.classList.add('dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', JSON.stringify({ chipId, fromBlank: blankId }));
        }
      });

      blankEl.addEventListener('dragend', () => {
        blankEl.classList.remove('dragging');
      });

      blankEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        blankEl.classList.add('drag-over');
      });

      blankEl.addEventListener('dragleave', () => {
        blankEl.classList.remove('drag-over');
      });

      blankEl.addEventListener('drop', (e) => {
        e.preventDefault();
        blankEl.classList.remove('drag-over');
        try {
          const payload = JSON.parse(e.dataTransfer?.getData('text/plain') || '{}');
          if (!payload.chipId) return;
          // If dropping onto a blank that already has another chip and came from another blank, swap them
          const existingChipId = this.filled[blankId];
          if (payload.fromBlank && payload.fromBlank !== blankId && existingChipId) {
            this.filled[payload.fromBlank] = existingChipId;
            delete this.checked[payload.fromBlank];
          }
          this.placeChipInBlank(payload.chipId, blankId);
        } catch (err) { /* ignore */ }
      });

      blankEl.addEventListener('click', () => {
        if (this.selectedChipId) {
          this.placeChipInBlank(this.selectedChipId, blankId);
          return;
        }
        if (this.filled[blankId]) {
          this.removeChipFromBlank(blankId);
        } else {
          this.activeBlankId = blankId;
          window.soundEngine?.playClick?.();
          this.renderWorkspace();
        }
      });
    });
  }
}

window.ListeningEngine = ListeningEngine;
