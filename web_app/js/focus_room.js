/**
 * Focus Room - mô phỏng phòng thi vấn đáp & hội thoại.
 * Học sinh áo cam bước vào phòng, giám thị hỏi lần lượt các câu đã chọn,
 * hội thoại bấm mũi tên để sang câu kế tiếp, cuối buổi giám thị mỉm cười chúc may mắn.
 */
class FocusRoom {
  constructor() {
    this.built = false;
    this.cfg = this.loadCfg();
    this.beats = [];
    this.idx = 0;
    this.run = 0;
    this.phase = 'idle'; // idle | setup | intro | exam | outro | done
    this.skipIntro = false;
    this.talkTimer = null;
    this.hiddenRevealed = false;
    this.originTab = 'oral';
    this.seat = { x: 274, y: 480 };
  }

  // ------------------------------------------------------------------ config
  loadCfg() {
    const def = { mode: 'both', lessons: ['all'], role: 'a', followups: true, showVi: false, hideMine: false, speak: true, shuffle: false };
    try { return Object.assign(def, JSON.parse(localStorage.getItem('jpd326_focus_cfg') || '{}')); } catch (e) { return def; }
  }
  saveCfg() { try { localStorage.setItem('jpd326_focus_cfg', JSON.stringify(this.cfg)); } catch (e) { /* ignore */ } }

  // -------------------------------------------------------------------- data
  esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  lessonList() { return ['第 6 課', '第 7 課', '第 8 課', '第 9 課', '第 10 課']; }

  selectedLessons() {
    return this.cfg.lessons.includes('all') ? this.lessonList() : this.cfg.lessons;
  }

  getQuestions() {
    const ls = this.selectedLessons();
    return (window.ORAL_EXAM_DATA || []).filter(q => ls.includes(q.lesson));
  }

  getSituations() {
    const ls = this.selectedLessons();
    return (window.SPEAKING_DATA || []).filter(s => ls.includes(s.lesson));
  }

  getSubQuestions(id) {
    try { return JSON.parse(localStorage.getItem(`jpd326_oral_sub_qa_${id}`) || '[]') || []; } catch (e) { return []; }
  }

  getTurns(sit) {
    try {
      const raw = localStorage.getItem(`jpd326_speaking_${sit.id}`);
      if (raw) { const t = JSON.parse(raw); if (Array.isArray(t)) return t; }
    } catch (e) { /* ignore */ }
    return sit.default_turns || [];
  }

  getFirstSpeaker(sit) {
    const s = localStorage.getItem(`jpd326_speaking_${sit.id}_first_speaker`);
    return (s === 'a' || s === 'b') ? s : (sit.default_first_speaker || 'a');
  }

  shuffle(a) {
    const r = [...a];
    for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
    return r;
  }

  buildBeats() {
    const c = this.cfg;
    const beats = [{ who: 'exam', kind: 'start', tag: 'Bắt đầu', jp: 'それでは、試験を始めます。', vi: 'Bây giờ chúng ta bắt đầu bài thi.' }];

    if (c.mode === 'oral' || c.mode === 'both') {
      let qs = this.getQuestions();
      if (c.shuffle) qs = this.shuffle(qs);
      qs.forEach(q => {
        beats.push({ who: 'exam', kind: 'question', tag: `Vấn đáp • ${q.code}`, jp: q.question_jp, vi: q.question_vi, q });
        beats.push({ who: 'student', kind: 'answer', tag: `Vấn đáp • ${q.code}`, answerKey: q.id, q });
        if (c.followups) {
          this.getSubQuestions(q.id).forEach((s, i) => {
            if (!s.question) return;
            beats.push({ who: 'exam', kind: 'followup', tag: `Câu hỏi phụ ${i + 1} • ${q.code}`, jp: s.question, vi: '' });
            beats.push({ who: 'student', kind: 'answer', tag: `Câu hỏi phụ ${i + 1} • ${q.code}`, sub: s });
          });
        }
      });
    }

    if (c.mode === 'dialogue' || c.mode === 'both') {
      let sits = this.getSituations();
      if (c.shuffle) sits = this.shuffle(sits);
      sits.forEach(sit => {
        const mine = c.role;
        const role = mine === 'a' ? sit.roleA : sit.roleB;
        beats.push({
          who: 'exam', kind: 'situation', tag: `Hội thoại • ${sit.code}`,
          jp: `次は会話のテストです。${role.task_jp}`, vi: role.task_vi
        });
        const first = this.getFirstSpeaker(sit);
        this.getTurns(sit).forEach(t => {
          const order = first === 'b' ? ['b', 'a'] : ['a', 'b'];
          order.forEach(who => {
            const text = t[who];
            if (!text) return;
            beats.push({
              who: who === mine ? 'student' : 'exam', kind: 'dialogue',
              tag: `Hội thoại • ${sit.code}`, jp: text, vi: '', mine: who === mine
            });
          });
        });
      });
    }
    return beats;
  }

  // --------------------------------------------------------------------- DOM
  build() {
    if (this.built) return;
    const root = document.createElement('div');
    root.id = 'focus-overlay';
    root.className = 'focus-overlay';
    root.innerHTML = `
      <div class="focus-setup" id="focus-setup">
        <div class="focus-setup-card">
          <div class="fs-tag">CHẾ ĐỘ FOCUS</div>
          <h2>Phòng thi mô phỏng</h2>
          <p class="fs-sub">Giám thị sẽ lần lượt hỏi các câu bạn chọn. Phần hội thoại bấm mũi tên để sang câu tiếp theo.</p>

          <div class="fs-group">
            <div class="fs-label">Nội dung luyện tập</div>
            <div class="fs-seg" id="fs-mode">
              <button data-mode="oral">Vấn đáp</button>
              <button data-mode="dialogue">Hội thoại</button>
              <button data-mode="both">Cả hai</button>
            </div>
          </div>

          <div class="fs-group">
            <div class="fs-label">Chọn bài (chọn nhiều bài được)</div>
            <div class="fs-chips" id="fs-lessons">
              <button data-lesson="all">Tất cả</button>
              <button data-lesson="第 6 課">Bài 6</button>
              <button data-lesson="第 7 課">Bài 7</button>
              <button data-lesson="第 8 課">Bài 8</button>
              <button data-lesson="第 9 課">Bài 9</button>
              <button data-lesson="第 10 課">Bài 10</button>
            </div>
          </div>

          <div class="fs-group" id="fs-role-group">
            <div class="fs-label">Hội thoại: bạn đóng vai</div>
            <div class="fs-seg" id="fs-role">
              <button data-role="a">Người A</button>
              <button data-role="b">Người B</button>
            </div>
          </div>

          <div class="fs-group fs-options">
            <label><input type="checkbox" id="fs-opt-followups"> Hỏi cả câu hỏi phụ do tôi soạn</label>
            <label><input type="checkbox" id="fs-opt-vi"> Hiện bản dịch tiếng Việt của câu hỏi</label>
            <label><input type="checkbox" id="fs-opt-hide"> Che lời thoại của tôi (tự phản xạ, bấm để xem)</label>
            <label><input type="checkbox" id="fs-opt-speak"> Giám thị đọc to bằng giọng Nhật</label>
            <label><input type="checkbox" id="fs-opt-shuffle"> Xáo trộn thứ tự</label>
          </div>

          <div class="fs-summary" id="fs-summary"></div>
          <div class="fs-actions">
            <button class="btn btn-secondary" id="fs-cancel">Hủy</button>
            <button class="btn btn-primary" id="fs-start">Vào phòng thi</button>
          </div>
        </div>
      </div>

      <div class="focus-room" id="focus-room" style="display:none;">
        <div class="fr-topbar">
          <div class="fr-title"><span class="fr-tag" id="fr-tag">Phòng thi</span></div>
          <div class="fr-progress" id="fr-progress"></div>
          <div class="fr-top-actions">
            <button class="fr-icon-btn" id="fr-mute" title="Bật/tắt giọng đọc">Giọng đọc: Bật</button>
            <button class="fr-icon-btn danger" id="fr-exit">Thoát</button>
          </div>
        </div>
        <div class="fr-stage" id="fr-stage">${this.sceneSvg()}</div>
        <div class="fr-dialogue" id="fr-dialogue">
          <div class="fr-bubble student" id="fr-b-student">
            <div class="fr-b-name">Bạn</div>
            <div class="fr-b-jp jp-font" id="fr-s-jp"></div>
            <div class="fr-b-vi" id="fr-s-vi"></div>
          </div>
          <div class="fr-bubble exam" id="fr-b-exam">
            <div class="fr-b-name">Giám thị</div>
            <div class="fr-b-jp jp-font" id="fr-e-jp"></div>
            <div class="fr-b-vi" id="fr-e-vi"></div>
          </div>
        </div>
        <div class="fr-controls" id="fr-controls"></div>
      </div>`;
    document.body.appendChild(root);
    this.root = root;
    this.bindSetup();

    root.querySelector('#fr-exit').addEventListener('click', () => this.close());
    root.querySelector('#fr-mute').addEventListener('click', () => {
      this.cfg.speak = !this.cfg.speak;
      if (!this.cfg.speak) window.speechSynthesis?.cancel();
      this.saveCfg();
      this.syncMute();
    });

    document.addEventListener('keydown', (e) => {
      if (!this.root.classList.contains('active')) return;
      if (e.key === 'Escape') { if (!document.fullscreenElement) this.close(); return; }
      if (this.phase !== 'exam') return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); this.prev(); }
    });

    this.built = true;
  }

  sceneSvg() {
    return `
<svg class="fr-svg" id="fr-svg" viewBox="0 0 960 540" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
  <defs>
    <linearGradient id="fr-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6EA"/><stop offset="1" stop-color="#FFE0C0"/></linearGradient>
    <linearGradient id="fr-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9B88E"/><stop offset="1" stop-color="#B58C5E"/></linearGradient>
    <linearGradient id="fr-hall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF3C4"/><stop offset="1" stop-color="#FFE08A"/></linearGradient>
    <clipPath id="fr-win"><rect x="404" y="64" width="162" height="122" rx="4"/></clipPath>
  </defs>

  <rect width="960" height="540" fill="url(#fr-wall)"/>
  <rect y="440" width="960" height="100" fill="url(#fr-floor)"/>
  <rect y="432" width="960" height="10" fill="#EBCDA6"/>

  <!-- window -->
  <rect x="396" y="56" width="178" height="138" rx="8" fill="#fff"/>
  <g clip-path="url(#fr-win)">
    <rect x="404" y="64" width="162" height="122" fill="#BDE5FF"/>
    <circle cx="530" cy="96" r="18" fill="#FFD93D"/>
    <g class="fr-cloud"><ellipse cx="440" cy="110" rx="26" ry="10" fill="#fff"/><ellipse cx="458" cy="104" rx="16" ry="10" fill="#fff"/></g>
    <g class="fr-cloud slow"><ellipse cx="500" cy="150" rx="22" ry="8" fill="#fff" opacity=".9"/><ellipse cx="514" cy="145" rx="14" ry="8" fill="#fff" opacity=".9"/></g>
  </g>
  <line x1="485" y1="64" x2="485" y2="186" stroke="#fff" stroke-width="5"/>
  <line x1="404" y1="125" x2="566" y2="125" stroke="#fff" stroke-width="5"/>

  <!-- clock -->
  <circle cx="330" cy="100" r="32" fill="#fff" stroke="#3B3B46" stroke-width="5"/>
  <line class="fr-hand-h" x1="330" y1="100" x2="330" y2="82" stroke="#222" stroke-width="4" stroke-linecap="round"/>
  <line class="fr-hand-m" x1="330" y1="100" x2="330" y2="76" stroke="#F27024" stroke-width="3" stroke-linecap="round"/>
  <circle cx="330" cy="100" r="3" fill="#222"/>

  <!-- board -->
  <rect x="640" y="40" width="250" height="50" rx="8" fill="#1F2937"/>
  <text x="765" y="74" text-anchor="middle" font-size="26" font-weight="800" fill="#fff" font-family="Noto Sans JP, sans-serif">口頭試験 JPD326</text>

  <!-- door + hallway -->
  <rect x="14" y="150" width="124" height="292" rx="6" fill="#7A5033"/>
  <rect x="22" y="158" width="108" height="284" fill="url(#fr-hall)"/>
  <g id="fr-door" class="fr-door">
    <rect x="22" y="158" width="108" height="284" fill="#A9744A"/>
    <rect x="34" y="174" width="84" height="108" rx="4" fill="#B8855A"/>
    <rect x="34" y="298" width="84" height="124" rx="4" fill="#B8855A"/>
    <circle cx="112" cy="308" r="6" fill="#F1C40F"/>
  </g>

  <!-- plant -->
  <rect x="884" y="396" width="44" height="46" rx="6" fill="#B45F3C"/>
  <ellipse cx="906" cy="380" rx="30" ry="16" fill="#2F9E5B" transform="rotate(-20 906 380)"/>
  <ellipse cx="906" cy="372" rx="26" ry="14" fill="#3CB371" transform="rotate(25 906 372)"/>
  <ellipse cx="906" cy="366" rx="12" ry="26" fill="#2F9E5B"/>

  <!-- chair -->
  <rect x="226" y="338" width="14" height="116" rx="6" fill="#6B4A2F"/>
  <rect x="226" y="412" width="104" height="13" rx="5" fill="#8A6139"/>
  <rect x="232" y="425" width="9" height="46" fill="#6B4A2F"/>
  <rect x="316" y="425" width="9" height="46" fill="#6B4A2F"/>

  <!-- student -->
  <g id="fr-student" class="fr-student" style="transform: translate(75px, 470px); opacity: 0;">
    <g class="leg leg-b"><g transform="translate(-9,0)"><g class="thigh"><rect x="-8" y="-72" width="17" height="38" rx="7" fill="#26334D"/><g class="shin"><rect x="-8" y="-38" width="16" height="36" rx="6" fill="#26334D"/><rect x="-8" y="-6" width="24" height="9" rx="4" fill="#fff" stroke="#9AA3B2"/></g></g></g></g>
    <g class="bob">
      <g class="upper">
        <g transform="translate(0,-128)"><g class="arm arm-b"><rect x="-7" y="0" width="14" height="56" rx="7" fill="#D9601A"/><circle cx="0" cy="58" r="8" fill="#FFD7B5"/></g></g>
        <rect x="-27" y="-144" width="54" height="80" rx="16" fill="#F27024"/>
        <path d="M-12 -144 L0 -128 L12 -144 Z" fill="#fff"/>
        <rect x="-2" y="-118" width="26" height="16" rx="3" fill="#fff"/>
        <text x="11" y="-106" text-anchor="middle" font-size="9" font-weight="900" fill="#F27024" font-family="Arial, sans-serif">FPT</text>
        <rect x="-5" y="-152" width="12" height="12" fill="#FFD7B5"/>
        <g class="head">
          <circle cx="0" cy="-174" r="28" fill="#FFD7B5"/>
          <path d="M-30 -170 C-34 -212 26 -214 30 -176 C20 -192 2 -194 -12 -186 C-20 -182 -27 -176 -30 -170 Z" fill="#1B1B22"/>
          <circle cx="9" cy="-175" r="3.2" fill="#222"/><circle cx="21" cy="-175" r="3.2" fill="#222"/>
          <ellipse cx="14" cy="-166" rx="3" ry="1.4" fill="#F4A3A3" opacity=".7"/>
          <path class="s-mouth-closed" d="M10 -160 Q16 -157 22 -160" stroke="#8A3B2E" stroke-width="2" fill="none" stroke-linecap="round"/>
          <ellipse class="s-mouth-open" cx="16" cy="-159" rx="4" ry="3" fill="#8A3B2E"/>
        </g>
        <g transform="translate(0,-128)"><g class="arm arm-f"><rect x="-7" y="0" width="14" height="56" rx="7" fill="#F27024"/><circle cx="0" cy="58" r="8" fill="#FFD7B5"/></g></g>
      </g>
    </g>
    <g class="leg leg-f"><g transform="translate(9,0)"><g class="thigh"><rect x="-8" y="-72" width="17" height="38" rx="7" fill="#2B3A5A"/><g class="shin"><rect x="-8" y="-38" width="16" height="36" rx="6" fill="#2B3A5A"/><rect x="-8" y="-6" width="24" height="9" rx="4" fill="#fff" stroke="#9AA3B2"/></g></g></g></g>
  </g>

  <!-- examiner -->
  <g id="fr-examiner" class="fr-examiner" transform="translate(740,0)">
    <rect x="-52" y="196" width="104" height="150" rx="22" fill="#3A4256"/>
    <rect x="-46" y="214" width="92" height="140" rx="20" fill="#1F2A44"/>
    <path d="M-16 214 L0 250 L16 214 Z" fill="#fff"/>
    <path d="M-5 224 L5 224 L8 262 L0 272 L-8 262 Z" fill="#C62828"/>
    <g class="ex-arm ex-arm-l" transform="translate(-44,236)"><g class="ex-arm-inner"><rect x="-9" y="0" width="18" height="84" rx="9" fill="#1F2A44"/><circle cx="0" cy="88" r="9" fill="#FFD7B5"/></g></g>
    <g class="ex-arm ex-arm-r" transform="translate(44,236)"><g class="ex-arm-inner"><rect x="-9" y="0" width="18" height="84" rx="9" fill="#1F2A44"/><circle cx="0" cy="88" r="9" fill="#FFD7B5"/></g></g>
    <rect x="-7" y="188" width="14" height="14" fill="#F2C9A5"/>
    <g class="ex-head">
      <circle cx="0" cy="170" r="33" fill="#FFD7B5"/>
      <path d="M-34 166 C-36 124 36 124 34 166 C28 146 10 140 -4 142 C-20 144 -30 154 -34 166 Z" fill="#2A2A33"/>
      <path d="M-34 160 C-36 150 -32 146 -28 150 L-30 164 Z M34 160 C36 150 32 146 28 150 L30 164 Z" fill="#8E8E99"/>
      <g class="ex-glasses"><circle cx="-13" cy="170" r="10" fill="rgba(255,255,255,.35)" stroke="#333" stroke-width="2.4"/><circle cx="13" cy="170" r="10" fill="rgba(255,255,255,.35)" stroke="#333" stroke-width="2.4"/><line x1="-3" y1="170" x2="3" y2="170" stroke="#333" stroke-width="2.4"/></g>
      <g class="ex-eyes"><circle cx="-15" cy="171" r="2.8" fill="#222"/><circle cx="11" cy="171" r="2.8" fill="#222"/></g>
      <g class="ex-eyes-happy"><path d="M-22 172 Q-13 162 -4 172" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M4 172 Q13 162 22 172" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      <path d="M-24 154 L-5 157 M24 154 L5 157" stroke="#2A2A33" stroke-width="3" stroke-linecap="round" class="ex-brows"/>
      <circle class="ex-blush" cx="-22" cy="184" r="6" fill="#F59BA0"/><circle class="ex-blush" cx="22" cy="184" r="6" fill="#F59BA0"/>
      <path class="ex-mouth-closed" d="M-8 190 Q0 193 8 190" stroke="#8A3B2E" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <ellipse class="ex-mouth-open" cx="0" cy="191" rx="6" ry="5" fill="#8A3B2E"/>
      <path class="ex-mouth-smile" d="M-14 185 Q0 205 14 185 Z" fill="#8A3B2E" stroke="#8A3B2E" stroke-width="2" stroke-linejoin="round"/>
    </g>
  </g>

  <!-- desk -->
  <g id="fr-desk">
    <rect x="516" y="330" width="412" height="16" rx="5" fill="#B77F4C"/>
    <rect x="528" y="346" width="388" height="100" fill="#9A6639"/>
    <rect x="538" y="446" width="14" height="24" fill="#7C4F2B"/><rect x="892" y="446" width="14" height="24" fill="#7C4F2B"/>
    <rect x="650" y="364" width="180" height="40" rx="5" fill="#fff"/>
    <text x="740" y="392" text-anchor="middle" font-size="22" font-weight="800" fill="#333" font-family="Noto Sans JP, sans-serif">試験官</text>
    <rect x="560" y="316" width="76" height="14" rx="2" fill="#fff"/><rect x="566" y="308" width="70" height="10" rx="2" fill="#F5F5F5"/>
    <rect x="842" y="304" width="62" height="26" rx="3" fill="#E7B04B"/><rect x="848" y="300" width="50" height="6" rx="2" fill="#555"/>
  </g>

  <!-- sparkles for the happy ending -->
  <g id="fr-sparkles" class="fr-sparkles">
    <polygon points="640,170 645,182 658,184 648,192 651,205 640,198 629,205 632,192 622,184 635,182" fill="#FFD93D"/>
    <polygon points="850,150 854,159 864,160 856,167 859,177 850,171 841,177 844,167 836,160 846,159" fill="#FFB347"/>
    <polygon points="700,110 703,117 711,118 705,123 707,131 700,127 693,131 695,123 689,118 697,117" fill="#fff"/>
    <polygon points="800,230 804,238 813,239 806,245 808,253 800,249 792,253 794,245 787,239 796,238" fill="#FFD93D"/>
    <polygon points="610,260 613,267 621,268 615,273 617,281 610,277 603,281 605,273 599,268 607,267" fill="#F27024"/>
  </g>
</svg>`;
  }

  // ------------------------------------------------------------------- setup
  bindSetup() {
    const q = (s) => this.root.querySelector(s);
    q('#fs-mode').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      this.cfg.mode = b.dataset.mode; this.saveCfg(); this.syncSetup();
    });
    q('#fs-role').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      this.cfg.role = b.dataset.role; this.saveCfg(); this.syncSetup();
    });
    q('#fs-lessons').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const l = b.dataset.lesson;
      if (l === 'all') {
        this.cfg.lessons = ['all'];
      } else {
        let cur = this.cfg.lessons.filter(x => x !== 'all');
        cur = cur.includes(l) ? cur.filter(x => x !== l) : [...cur, l];
        this.cfg.lessons = cur.length ? cur : ['all'];
        if (cur.length === this.lessonList().length) this.cfg.lessons = ['all'];
      }
      this.saveCfg(); this.syncSetup();
    });
    const opt = (id, key) => q(id).addEventListener('change', (e) => { this.cfg[key] = e.target.checked; this.saveCfg(); this.syncSetup(); });
    opt('#fs-opt-followups', 'followups'); opt('#fs-opt-vi', 'showVi'); opt('#fs-opt-hide', 'hideMine');
    opt('#fs-opt-speak', 'speak'); opt('#fs-opt-shuffle', 'shuffle');
    q('#fs-cancel').addEventListener('click', () => this.close());
    q('#fs-start').addEventListener('click', () => this.start());
  }

  syncSetup() {
    const q = (s) => this.root.querySelector(s);
    const c = this.cfg;
    q('#fs-mode').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.mode === c.mode));
    q('#fs-role').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.role === c.role));
    q('#fs-lessons').querySelectorAll('button').forEach(b => b.classList.toggle('on', c.lessons.includes(b.dataset.lesson)));
    q('#fs-role-group').style.display = c.mode === 'oral' ? 'none' : '';
    q('#fs-opt-followups').checked = c.followups; q('#fs-opt-vi').checked = c.showVi;
    q('#fs-opt-hide').checked = c.hideMine; q('#fs-opt-speak').checked = c.speak; q('#fs-opt-shuffle').checked = c.shuffle;

    const oralQ = (c.mode !== 'dialogue') ? this.getQuestions().length : 0;
    const sits = (c.mode !== 'oral') ? this.getSituations().length : 0;
    const parts = [];
    if (c.mode !== 'dialogue') parts.push(`${oralQ} câu vấn đáp`);
    if (c.mode !== 'oral') parts.push(`${sits} tình huống hội thoại`);
    const empty = (oralQ + sits) === 0;
    q('#fs-summary').textContent = empty ? 'Các bài đã chọn chưa có nội dung cho chế độ này.' : `Sẽ thi: ${parts.join(' + ')}.`;
    q('#fs-summary').classList.toggle('warn', empty);
    q('#fs-start').disabled = empty;
  }

  syncMute() {
    const b = this.root.querySelector('#fr-mute');
    if (b) b.textContent = `Giọng đọc: ${this.cfg.speak ? 'Bật' : 'Tắt'}`;
  }

  // ------------------------------------------------------------ open / close
  open(originTab = 'oral') {
    this.build();
    this.originTab = originTab;
    // Preselect content by where Focus was opened from, and lesson from the global lesson bar
    this.cfg.mode = originTab === 'speaking' ? 'dialogue' : (originTab === 'oral' ? 'oral' : this.cfg.mode);
    const cur = window.app?.currentLesson;
    if (cur && cur !== 'all') this.cfg.lessons = [cur];
    this.root.classList.add('active');
    document.body.classList.add('focus-open');
    this.root.querySelector('#focus-setup').style.display = 'flex';
    this.root.querySelector('#focus-room').style.display = 'none';
    this.phase = 'setup';
    this.syncSetup();
    this.syncMute();
    window.soundEngine?.playModalOpen?.();
  }

  close() {
    this.run++;
    this.phase = 'idle';
    clearTimeout(this.talkTimer);
    window.speechSynthesis?.cancel();
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    this.root?.classList.remove('active');
    document.body.classList.remove('focus-open');
    window.soundEngine?.playModalClose?.();
  }

  // ------------------------------------------------------------------- sleep
  async sleep(ms, token) {
    if (!this.skipIntro || this.phase === 'outro') {
      await new Promise(r => setTimeout(r, ms));
    }
    if (token !== this.run) throw new Error('cancelled');
  }

  // ------------------------------------------------------------------- start
  async start() {
    this.beats = this.buildBeats();
    if (this.beats.length <= 1) return;
    this.idx = 0;
    const token = ++this.run;
    this.skipIntro = false;
    this.phase = 'intro';

    const q = (s) => this.root.querySelector(s);
    q('#focus-setup').style.display = 'none';
    q('#focus-room').style.display = 'flex';
    this.resetScene();
    q('#fr-progress').textContent = '';
    q('#fr-tag').textContent = 'Vào phòng thi';
    this.setBubble('exam', '', '');
    this.setBubble('student', '', '');
    this.renderControls();

    // Try real fullscreen for a distraction-free room. Never await it: some webviews never settle the promise.
    try {
      const p = this.root.requestFullscreen?.();
      if (p && p.catch) p.catch(() => {});
    } catch (e) { /* ignore */ }

    try {
      await this.playIntro(token);
      if (token !== this.run) return;
      this.phase = 'exam';
      this.showBeat(0);
    } catch (e) { /* cancelled */ }
  }

  resetScene() {
    const st = this.root.querySelector('#fr-student');
    const ex = this.root.querySelector('#fr-examiner');
    const door = this.root.querySelector('#fr-door');
    st.className.baseVal = 'fr-student';
    st.style.transition = 'none';
    st.style.transform = 'translate(75px, 470px)';
    st.style.opacity = '0';
    ex.classList.remove('talking', 'smile', 'wave');
    door.classList.remove('open');
    this.root.querySelector('#fr-sparkles').classList.remove('on');
    this.root.querySelector('#fr-stage').classList.remove('happy');
  }

  moveStudent(x, y, ms, ease = 'linear') {
    const st = this.root.querySelector('#fr-student');
    void st.getBoundingClientRect();
    st.style.transition = ms ? `transform ${ms}ms ${ease}` : 'none';
    st.style.transform = `translate(${x}px, ${y}px)`;
  }

  setClass(el, cls, on) { el.classList.toggle(cls, !!on); }

  async playIntro(token) {
    const snd = window.soundEngine;
    const st = this.root.querySelector('#fr-student');
    const door = this.root.querySelector('#fr-door');
    const exam = this.root.querySelector('#fr-examiner');

    // Allow skipping the walk-in
    this.renderControls();

    await this.sleep(500, token);
    snd?.playKnock?.();
    await this.sleep(280, token);
    snd?.playKnock?.();
    await this.sleep(700, token);

    this.say('exam', 'どうぞ。', 'Mời vào.', { speak: true });
    await this.sleep(900, token);

    snd?.playDoor?.();
    door.classList.add('open');
    await this.sleep(700, token);

    st.style.opacity = '1';
    st.classList.add('walking');
    const walkMs = 2800;
    this.moveStudent(this.seat.x, 470, walkMs, 'linear');
    const stepper = setInterval(() => { if (!this.skipIntro) snd?.playFootstep?.(); }, 330);
    try { await this.sleep(walkMs, token); } finally { clearInterval(stepper); }
    st.classList.remove('walking');

    this.say('student', '失礼します。', 'Xin phép (cho em vào).', {});
    st.classList.add('bowing');
    await this.sleep(1100, token);
    st.classList.remove('bowing');

    this.say('exam', 'どうぞ、おかけください。', 'Mời em ngồi.', { speak: true });
    await this.sleep(1400, token);

    this.moveStudent(this.seat.x, this.seat.y, 450, 'ease-out');
    st.classList.add('sitting');
    snd?.playClick?.();
    await this.sleep(700, token);
    door.classList.remove('open');
    if (this.skipIntro) {
      // Make sure the final pose is applied instantly when skipping
      st.style.opacity = '1';
      this.moveStudent(this.seat.x, this.seat.y, 0);
      door.classList.remove('open');
    }
  }

  skipIntroNow() {
    if (this.phase !== 'intro') return;
    this.skipIntro = true;
    window.speechSynthesis?.cancel();
    const st = this.root.querySelector('#fr-student');
    st.classList.remove('walking', 'bowing');
    st.classList.add('sitting');
    st.style.opacity = '1';
    this.moveStudent(this.seat.x, this.seat.y, 0);
    this.root.querySelector('#fr-door').classList.remove('open');
  }

  // ----------------------------------------------------------------- bubbles
  setBubble(who, jp, vi, opts = {}) {
    const id = who === 'exam' ? 'e' : 's';
    const jpEl = this.root.querySelector(`#fr-${id}-jp`);
    const viEl = this.root.querySelector(`#fr-${id}-vi`);
    const box = this.root.querySelector(`#fr-b-${who}`);
    jpEl.innerHTML = opts.html ?? this.esc(jp);
    viEl.textContent = vi || '';
    viEl.style.display = vi ? '' : 'none';
    jpEl.classList.toggle('blurred', !!opts.blur);
    box.classList.toggle('empty', !jp && !opts.html);
  }

  setActive(who) {
    this.root.querySelector('#fr-b-exam').classList.toggle('active', who === 'exam');
    this.root.querySelector('#fr-b-student').classList.toggle('active', who === 'student');
  }

  talk(who, text) {
    const ex = this.root.querySelector('#fr-examiner');
    const st = this.root.querySelector('#fr-student');
    ex.classList.remove('talking'); st.classList.remove('talking');
    clearTimeout(this.talkTimer);
    if (!text) return;
    (who === 'exam' ? ex : st).classList.add('talking');
    const ms = Math.min(5000, 700 + text.length * 120);
    this.talkTimer = setTimeout(() => { ex.classList.remove('talking'); st.classList.remove('talking'); }, ms);
  }

  say(who, jp, vi, opts = {}) {
    this.setBubble(who, jp, opts.showVi === false ? '' : vi, opts);
    this.setActive(who);
    this.talk(who, jp);
    if (opts.speak && this.cfg.speak && !this.skipIntro) window.soundEngine?.speakJapanese(jp);
  }

  // ------------------------------------------------------------------- beats
  showBeat(i) {
    this.idx = i;
    const b = this.beats[i];
    if (!b) return;
    this.hiddenRevealed = false;
    this.root.querySelector('#fr-tag').textContent = b.tag;
    this.root.querySelector('#fr-progress').textContent = `${i + 1} / ${this.beats.length}`;

    const showVi = this.cfg.showVi ? b.vi : '';
    if (b.who === 'exam') {
      this.say('exam', b.jp, showVi, { speak: true });
    } else if (b.kind === 'answer') {
      const msg = b.sub ? 'Đến lượt bạn trả lời câu hỏi phụ. Hãy nói thành tiếng!' : 'Đến lượt bạn trả lời. Hãy nói thành tiếng!';
      this.setBubble('student', '', '', { html: `<span class="fr-prompt">${msg}</span>` });
      this.root.querySelector('#fr-b-student').classList.remove('empty');
      this.setActive('student');
      this.talk('student', '');
    } else {
      const blur = this.cfg.hideMine && b.mine;
      this.say('student', b.jp, '', { blur });
    }
    this.renderControls();
  }

  next() {
    if (this.phase !== 'exam') return;
    window.soundEngine?.playChip?.();
    window.speechSynthesis?.cancel();
    if (this.idx >= this.beats.length - 1) { this.playOutro(); return; }
    this.showBeat(this.idx + 1);
  }

  prev() {
    if (this.phase !== 'exam' || this.idx <= 0) return;
    window.soundEngine?.playChip?.();
    window.speechSynthesis?.cancel();
    this.showBeat(this.idx - 1);
  }

  renderControls() {
    const box = this.root.querySelector('#fr-controls');
    const b = this.beats[this.idx];
    box.innerHTML = '';
    const mk = (cls, text, fn, attrs = '') => {
      const el = document.createElement('button');
      el.className = cls; el.textContent = text; if (attrs) el.setAttribute('title', attrs);
      el.addEventListener('click', fn); box.appendChild(el); return el;
    };

    if (this.phase === 'intro') {
      mk('fr-btn ghost', 'Bỏ qua phần vào phòng', () => this.skipIntroNow());
      return;
    }
    if (this.phase === 'outro') return;
    if (this.phase === 'done') {
      mk('fr-btn primary big', 'Hoàn thành', () => this.close());
      mk('fr-btn ghost', 'Thi lại', () => this.start());
      return;
    }
    if (this.phase !== 'exam' || !b) return;

    const prev = mk('fr-btn arrow', '\u2190', () => this.prev(), 'Câu trước (←)');
    prev.disabled = this.idx === 0;

    const mid = document.createElement('div');
    mid.className = 'fr-mid';
    box.appendChild(mid);
    const addMid = (text, fn, cls = 'fr-btn ghost') => {
      const el = document.createElement('button');
      el.className = cls; el.textContent = text; el.addEventListener('click', fn); mid.appendChild(el);
    };

    if (b.who === 'exam' || (b.kind === 'dialogue')) {
      addMid('Nghe lại', () => window.soundEngine?.speakJapanese(b.jp));
    }
    if (b.kind === 'dialogue' && b.mine && this.cfg.hideMine) {
      addMid('Xem lời thoại', () => {
        this.setBubble('student', b.jp, '', { blur: false });
        this.hiddenRevealed = true;
      });
    }
    if (b.kind === 'answer') {
      addMid('Xem bài mẫu của tôi', () => this.revealAnswer(b));
    }

    const isLast = this.idx >= this.beats.length - 1;
    mk('fr-btn arrow primary', isLast ? 'Kết thúc \u2192' : '\u2192', () => this.next(), isLast ? 'Kết thúc buổi thi' : 'Câu tiếp theo (\u2192)');
  }

  revealAnswer(b) {
    let text = '';
    if (b.sub) text = b.sub.answer || '';
    else text = localStorage.getItem(`jpd326_oral_ans_${b.answerKey}`) || '';
    if (!text) {
      this.setBubble('student', '', '', { html: '<span class="fr-prompt">Bạn chưa soạn câu trả lời cho câu này. Hãy soạn ở tab Ôn Vấn Đáp!</span>' });
    } else {
      this.setBubble('student', text, '');
    }
    this.root.querySelector('#fr-b-student').classList.remove('empty');
    window.soundEngine?.playFlip?.();
  }

  // ------------------------------------------------------------------- outro
  async playOutro() {
    const token = this.run;
    this.phase = 'outro';
    this.skipIntro = false;
    this.renderControls();
    const snd = window.soundEngine;
    const ex = this.root.querySelector('#fr-examiner');
    const st = this.root.querySelector('#fr-student');
    this.root.querySelector('#fr-tag').textContent = 'Kết thúc buổi thi';
    this.root.querySelector('#fr-progress').textContent = '';

    try {
      this.say('exam', 'これで試験を終わります。お疲れさまでした。', 'Buổi thi kết thúc. Em vất vả rồi.', { speak: true, showVi: true });
      await this.sleep(3400, token);

      this.say('student', 'ありがとうございました。', 'Em cảm ơn thầy/cô ạ.', {});
      st.classList.add('bowing');
      await this.sleep(1500, token);
      st.classList.remove('bowing');

      // Examiner smiles and wishes good luck
      ex.classList.add('smile', 'wave');
      this.root.querySelector('#fr-stage').classList.add('happy');
      this.root.querySelector('#fr-sparkles').classList.add('on');
      this.say('exam', '頑張ってくださいね。幸運を祈っています！', 'Cố gắng nhé. Chúc em may mắn!', { speak: true, showVi: true });
      snd?.playFanfare?.();
      if (window.FX) { window.FX.confetti(0.9); window.FX.fireworks(3); }
      await this.sleep(2600, token);

      this.phase = 'done';
      this.renderControls();
    } catch (e) { /* cancelled */ }
  }
}

window.FocusRoom = FocusRoom;
