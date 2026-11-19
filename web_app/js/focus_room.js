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
  }

  // ------------------------------------------------------------------ config
  loadCfg() {
    const def = { mode: 'both', lessons: ['all'], oralIds: null, sitIds: null, role: 'a', followups: true, showVi: false, hideMine: false, speak: true, shuffle: false };
    try {
      const cfg = Object.assign(def, JSON.parse(localStorage.getItem('jpd326_focus_cfg') || '{}'));
      if (!Array.isArray(cfg.lessons) || cfg.lessons.length === 0) cfg.lessons = ['all'];
      if (cfg.oralIds !== null && !Array.isArray(cfg.oralIds)) cfg.oralIds = null;
      if (cfg.sitIds !== null && !Array.isArray(cfg.sitIds)) cfg.sitIds = null;
      return cfg;
    } catch (e) { return def; }
  }
  saveCfg() { try { localStorage.setItem('jpd326_focus_cfg', JSON.stringify(this.cfg)); } catch (e) { /* ignore */ } }

  // -------------------------------------------------------------------- data
  esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  lessonList() { return ['第 6 課', '第 7 課', '第 8 課', '第 9 課', '第 10 課']; }

  selectedLessons() {
    return this.cfg.lessons.includes('all') ? this.lessonList() : this.cfg.lessons;
  }

  getLessonQuestions() {
    const ls = this.selectedLessons();
    return (window.ORAL_EXAM_DATA || []).filter(q => ls.includes(q.lesson));
  }

  getLessonSituations() {
    const ls = this.selectedLessons();
    return (window.SPEAKING_DATA || []).filter(s => ls.includes(s.lesson));
  }

  getQuestions() {
    const list = this.getLessonQuestions();
    return Array.isArray(this.cfg.oralIds) ? list.filter(q => this.cfg.oralIds.includes(q.id)) : list;
  }

  getSituations() {
    const list = this.getLessonSituations();
    return Array.isArray(this.cfg.sitIds) ? list.filter(s => this.cfg.sitIds.includes(s.id)) : list;
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

          <div class="fs-group" id="fs-items-group">
            <div class="fs-label-row">
              <div class="fs-label">Chọn câu hỏi / tình huống cụ thể</div>
              <button type="button" class="fs-reset-items" id="fs-items-all" style="display:none;">Chọn tất cả</button>
            </div>
            <div class="fs-chips fs-items" id="fs-items"></div>
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
<svg class="fr-svg" id="fr-svg" viewBox="0 0 960 540" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
  <defs>
    <linearGradient id="fr-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6EA"/><stop offset="1" stop-color="#FFE0C0"/></linearGradient>
    <linearGradient id="fr-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9B88E"/><stop offset="1" stop-color="#A9804F"/></linearGradient>
    <linearGradient id="fr-desk-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B98350"/><stop offset="1" stop-color="#D2A06B"/></linearGradient>
    <radialGradient id="fr-vignette" cx="50%" cy="48%" r="70%"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient>
    <clipPath id="fr-win"><rect x="78" y="78" width="214" height="164" rx="4"/></clipPath>
  </defs>

  <g id="fr-bob">
   <g id="fr-pitch">
    <!-- ================= ROOM (seen from my seat) ================= -->
    <g id="fr-cam">
      <rect width="960" height="540" fill="url(#fr-wall)"/>
      <rect y="400" width="960" height="140" fill="url(#fr-floor)"/>
      <rect y="392" width="960" height="10" fill="#EBCDA6"/>

      <!-- window -->
      <rect x="68" y="68" width="234" height="184" rx="10" fill="#fff"/>
      <g clip-path="url(#fr-win)">
        <rect x="78" y="78" width="214" height="164" fill="#BDE5FF"/>
        <circle cx="250" cy="116" r="22" fill="#FFD93D"/>
        <g class="fr-cloud"><ellipse cx="130" cy="140" rx="32" ry="12" fill="#fff"/><ellipse cx="152" cy="132" rx="20" ry="12" fill="#fff"/></g>
        <g class="fr-cloud slow"><ellipse cx="200" cy="196" rx="28" ry="10" fill="#fff" opacity=".9"/><ellipse cx="216" cy="190" rx="18" ry="10" fill="#fff" opacity=".9"/></g>
      </g>
      <line x1="185" y1="78" x2="185" y2="242" stroke="#fff" stroke-width="6"/>
      <line x1="78" y1="160" x2="292" y2="160" stroke="#fff" stroke-width="6"/>

      <!-- clock -->
      <circle cx="810" cy="120" r="40" fill="#fff" stroke="#3B3B46" stroke-width="6"/>
      <line class="fr-hand-h" x1="810" y1="120" x2="810" y2="98" stroke="#222" stroke-width="5" stroke-linecap="round"/>
      <line class="fr-hand-m" x1="810" y1="120" x2="810" y2="90" stroke="#F27024" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="810" cy="120" r="4" fill="#222"/>

      <!-- board on the wall behind the examiner -->
      <rect x="330" y="26" width="300" height="56" rx="9" fill="#1F2937"/>
      <text x="480" y="64" text-anchor="middle" font-size="30" font-weight="800" fill="#fff" font-family="Noto Sans JP, sans-serif">口頭試験 JPD326</text>

      <!-- plant -->
      <rect x="820" y="330" width="58" height="68" rx="8" fill="#B45F3C"/>
      <ellipse cx="849" cy="308" rx="42" ry="22" fill="#2F9E5B" transform="rotate(-22 849 308)"/>
      <ellipse cx="849" cy="298" rx="36" ry="19" fill="#3CB371" transform="rotate(26 849 298)"/>
      <ellipse cx="849" cy="288" rx="16" ry="36" fill="#2F9E5B"/>

      <!-- examiner (facing me) -->
      <g id="fr-examiner" class="fr-examiner">
        <rect x="408" y="220" width="144" height="200" rx="28" fill="#3A4256"/>
        <rect x="392" y="262" width="176" height="170" rx="40" fill="#1F2A44"/>
        <path d="M452 262 L480 322 L508 262 Z" fill="#fff"/>
        <path d="M471 276 L489 276 L494 336 L480 356 L466 336 Z" fill="#C62828"/>
        <rect x="469" y="236" width="22" height="32" fill="#F2C9A5"/>
        <g class="ex-head">
          <circle cx="480" cy="204" r="49" fill="#FFD7B5"/>
          <path d="M431 198 C427 134 533 134 529 198 C519 168 497 158 478 160 C456 162 438 176 431 198 Z" fill="#2A2A33"/>
          <path d="M431 192 C428 178 434 172 439 178 L437 198 Z M529 192 C532 178 526 172 521 178 L523 198 Z" fill="#8E8E99"/>
          <g class="ex-glasses"><circle cx="459" cy="208" r="15" fill="rgba(255,255,255,.35)" stroke="#333" stroke-width="3"/><circle cx="501" cy="208" r="15" fill="rgba(255,255,255,.35)" stroke="#333" stroke-width="3"/><line x1="474" y1="208" x2="486" y2="208" stroke="#333" stroke-width="3"/></g>
          <g class="ex-eyes"><circle cx="459" cy="209" r="4.2" fill="#222"/><circle cx="501" cy="209" r="4.2" fill="#222"/></g>
          <g class="ex-eyes-happy"><path d="M444 211 Q459 195 474 211" stroke="#222" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M486 211 Q501 195 516 211" stroke="#222" stroke-width="4" fill="none" stroke-linecap="round"/></g>
          <path class="ex-brows" d="M441 186 L474 190 M519 186 L486 190" stroke="#2A2A33" stroke-width="4" stroke-linecap="round"/>
          <circle class="ex-blush" cx="446" cy="230" r="9" fill="#F59BA0"/><circle class="ex-blush" cx="514" cy="230" r="9" fill="#F59BA0"/>
          <path class="ex-mouth-closed" d="M468 235 Q480 240 492 235" stroke="#8A3B2E" stroke-width="3" fill="none" stroke-linecap="round"/>
          <ellipse class="ex-mouth-open" cx="480" cy="237" rx="9" ry="7" fill="#8A3B2E"/>
          <path class="ex-mouth-smile" d="M462 228 Q480 258 498 228 Z" fill="#8A3B2E" stroke="#8A3B2E" stroke-width="3" stroke-linejoin="round"/>
        </g>
      </g>

      <!-- sparkles (happy ending) -->
      <g id="fr-sparkles" class="fr-sparkles">
        <polygon points="330,150 336,166 354,168 340,178 345,196 330,186 315,196 320,178 306,168 324,166" fill="#FFD93D"/>
        <polygon points="640,140 645,153 660,155 648,163 652,177 640,169 628,177 632,163 620,155 635,153" fill="#FFB347"/>
        <polygon points="570,70 574,80 585,81 577,88 580,99 570,93 560,99 563,88 555,81 566,80" fill="#fff"/>
        <polygon points="360,300 365,312 378,313 368,321 372,333 360,326 348,333 352,321 342,313 355,312" fill="#FFD93D"/>
        <polygon points="620,290 625,301 637,302 628,309 631,320 620,314 609,320 612,309 603,302 615,301" fill="#F27024"/>
      </g>

      <!-- desk seen from above, from my seat -->
      <polygon points="150,400 810,400 960,522 0,522" fill="url(#fr-desk-top)"/>
      <line x1="150" y1="400" x2="810" y2="400" stroke="#E7C79A" stroke-width="3"/>
      <rect x="0" y="522" width="960" height="18" fill="#7C4F2B"/>
      <rect x="420" y="394" width="120" height="34" rx="4" fill="#fff"/>
      <text x="480" y="418" text-anchor="middle" font-size="22" font-weight="800" fill="#333" font-family="Noto Sans JP, sans-serif">試験官</text>
      <g transform="rotate(-4 650 440)"><rect x="590" y="412" width="110" height="68" rx="3" fill="#fff"/><rect x="598" y="424" width="70" height="4" fill="#CBD5E1"/><rect x="598" y="436" width="86" height="4" fill="#CBD5E1"/><rect x="598" y="448" width="60" height="4" fill="#CBD5E1"/></g>
      <g transform="rotate(5 300 450)"><rect x="240" y="418" width="124" height="78" rx="4" fill="#E7B04B"/><rect x="250" y="428" width="104" height="62" fill="#fff"/><rect x="284" y="414" width="36" height="9" rx="3" fill="#555"/></g>

      <!-- examiner's arms rest on the desk -->
      <g class="ex-arm ex-arm-l" transform="translate(402,292)"><g class="ex-arm-inner"><rect x="-16" y="0" width="32" height="120" rx="16" fill="#1F2A44"/><circle cx="0" cy="128" r="15" fill="#FFD7B5"/></g></g>
      <g class="ex-arm ex-arm-r" transform="translate(558,292)"><g class="ex-arm-inner"><rect x="-16" y="0" width="32" height="120" rx="16" fill="#1F2A44"/><circle cx="0" cy="128" r="15" fill="#FFD7B5"/></g></g>
    </g>

    <!-- ================= HALLWAY (before I enter) ================= -->
    <g id="fr-hall">
      <path fill-rule="evenodd" d="M0 0H960V540H0Z M330 60H630V540H330Z" fill="#DCCFB8"/>
      <rect x="0" y="470" width="330" height="70" fill="#A58B6A"/><rect x="630" y="470" width="330" height="70" fill="#A58B6A"/>
      <rect x="0" y="456" width="330" height="14" fill="#C7B08C"/><rect x="630" y="456" width="330" height="14" fill="#C7B08C"/>
      <rect x="323" y="53" width="314" height="487" fill="none" stroke="#5E3B22" stroke-width="14"/>
      <rect x="414" y="12" width="132" height="30" rx="5" fill="#1F2937"/>
      <text x="480" y="34" text-anchor="middle" font-size="19" font-weight="800" fill="#fff" font-family="Noto Sans JP, sans-serif">面接室</text>
      <g id="fr-door">
        <rect x="330" y="60" width="300" height="480" fill="#A9744A"/>
        <rect x="360" y="92" width="240" height="170" rx="6" fill="#B8855A"/>
        <rect x="360" y="290" width="240" height="220" rx="6" fill="#B8855A"/>
        <circle cx="596" cy="320" r="14" fill="#F1C40F"/><circle cx="592" cy="316" r="4" fill="#FFF3A6"/>
      </g>
    </g>
   </g>

   <!-- ================= ME (first person) ================= -->
   <g id="fr-fist"><g transform="translate(560,470)"><g class="fist-inner">
     <rect x="-30" y="0" width="60" height="170" rx="22" fill="#F27024" transform="rotate(-8)"/>
     <rect x="-31" y="-14" width="62" height="20" rx="8" fill="#fff" transform="rotate(-8)"/>
     <rect x="-24" y="-52" width="48" height="44" rx="18" fill="#FFD7B5" transform="rotate(-8)"/>
     <path d="M-18 -38 H18 M-18 -28 H18" stroke="#E7B994" stroke-width="2.5" transform="rotate(-8)"/>
   </g></g></g>

   <g id="fr-hands">
     <g class="my-hand my-hand-l" transform="translate(345,560)">
       <rect x="-38" y="-112" width="76" height="190" rx="34" fill="#F27024" transform="rotate(12)"/>
       <rect x="-39" y="-118" width="78" height="22" rx="9" fill="#fff" transform="rotate(12)"/>
       <rect x="-30" y="-168" width="60" height="58" rx="24" fill="#FFD7B5" transform="rotate(12)"/>
       <path d="M-20 -150 H20 M-20 -136 H20" stroke="#E7B994" stroke-width="3" transform="rotate(12)"/>
     </g>
     <g class="my-hand my-hand-r" transform="translate(615,560)">
       <rect x="-38" y="-112" width="76" height="190" rx="34" fill="#F27024" transform="rotate(-12)"/>
       <rect x="-39" y="-118" width="78" height="22" rx="9" fill="#fff" transform="rotate(-12)"/>
       <rect x="-30" y="-168" width="60" height="58" rx="24" fill="#FFD7B5" transform="rotate(-12)"/>
       <path d="M-20 -150 H20 M-20 -136 H20" stroke="#E7B994" stroke-width="3" transform="rotate(-12)"/>
     </g>
   </g>
  </g>
  <rect width="960" height="540" fill="url(#fr-vignette)" pointer-events="none"/>
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
        if (cur.includes(l)) {
          if (cur.length > 1) cur = cur.filter(x => x !== l);
        } else {
          cur = [...cur, l];
        }
        this.cfg.lessons = (cur.length === this.lessonList().length) ? ['all'] : cur;
      }
      this.cfg.oralIds = null;
      this.cfg.sitIds = null;
      this.saveCfg(); this.syncSetup();
    });
    q('#fs-items-all').addEventListener('click', () => {
      this.cfg.oralIds = null;
      this.cfg.sitIds = null;
      this.saveCfg(); this.syncSetup();
    });
    q('#fs-items').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const kind = b.dataset.kind;
      const id = b.dataset.id;
      const isOral = kind === 'oral';
      const allIds = (isOral ? this.getLessonQuestions() : this.getLessonSituations()).map(x => x.id);
      const key = isOral ? 'oralIds' : 'sitIds';
      let cur = Array.isArray(this.cfg[key]) ? [...this.cfg[key]] : [...allIds];
      const otherCount = this.cfg.mode === 'both'
        ? (isOral ? this.getSituations().length : this.getQuestions().length)
        : 0;
      if (cur.includes(id)) {
        if (cur.length > 1 || otherCount > 0) cur = cur.filter(x => x !== id);
      } else {
        cur.push(id);
      }
      this.cfg[key] = cur.length >= allIds.length ? null : cur;
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

    const lessonQs = (c.mode !== 'dialogue') ? this.getLessonQuestions() : [];
    const lessonSits = (c.mode !== 'oral') ? this.getLessonSituations() : [];
    const itemChips = [
      ...lessonQs.map(item => {
        const on = !Array.isArray(c.oralIds) || c.oralIds.includes(item.id);
        return `<button type="button" class="${on ? 'on' : ''}" data-kind="oral" data-id="${this.esc(item.id)}" title="${this.esc(item.title)}">Vấn đáp ${this.esc(item.code)}</button>`;
      }),
      ...lessonSits.map(sit => {
        const on = !Array.isArray(c.sitIds) || c.sitIds.includes(sit.id);
        return `<button type="button" class="${on ? 'on' : ''}" data-kind="sit" data-id="${this.esc(sit.id)}" title="${this.esc(sit.title)}">Hội thoại ${this.esc(sit.code)}</button>`;
      })
    ];
    const itemsGroup = q('#fs-items-group');
    const itemsBox = q('#fs-items');
    const resetItemsBtn = q('#fs-items-all');
    if (itemsGroup && itemsBox) {
      itemsGroup.style.display = itemChips.length ? '' : 'none';
      itemsBox.innerHTML = itemChips.join('');
    }
    if (resetItemsBtn) {
      const partial = (c.mode !== 'dialogue' && Array.isArray(c.oralIds)) || (c.mode !== 'oral' && Array.isArray(c.sitIds));
      resetItemsBtn.style.display = partial ? '' : 'none';
    }

    const oralList = (c.mode !== 'dialogue') ? this.getQuestions() : [];
    const sitList = (c.mode !== 'oral') ? this.getSituations() : [];
    const parts = [];
    if (c.mode !== 'dialogue' && oralList.length > 0) {
      parts.push(`${oralList.length} câu vấn đáp (${oralList.map(x => x.code).join(', ')})`);
    }
    if (c.mode !== 'oral' && sitList.length > 0) {
      parts.push(`${sitList.length} tình huống hội thoại (${sitList.map(x => x.code).join(', ')})`);
    }
    const empty = (oralList.length + sitList.length) === 0;
    q('#fs-summary').textContent = empty ? 'Các bài đã chọn chưa có nội dung cho chế độ này.' : `Sẽ thi: ${parts.join(' + ')}.`;
    q('#fs-summary').classList.toggle('warn', empty);
    q('#fs-start').disabled = empty;
  }

  syncMute() {
    const b = this.root.querySelector('#fr-mute');
    if (b) b.textContent = `Giọng đọc: ${this.cfg.speak ? 'Bật' : 'Tắt'}`;
  }

  // ------------------------------------------------------------ open / close
  open(originTab = 'oral', opts = {}) {
    this.build();
    this.originTab = originTab;
    const onlyCurrent = !!opts.onlyCurrent;

    if (originTab === 'speaking') {
      this.cfg.mode = 'dialogue';
      const curSit = window.speakingEngine?.situations?.[window.speakingEngine.currentSitIndex];
      if (onlyCurrent && curSit) {
        this.cfg.lessons = [curSit.lesson];
        this.cfg.sitIds = [curSit.id];
      } else {
        const spkLesson = window.speakingEngine?.currentLessonFilter;
        const appLesson = window.app?.currentLesson;
        const chosen = (spkLesson && spkLesson !== 'all')
          ? spkLesson
          : (appLesson && appLesson !== 'all' ? appLesson : 'all');
        this.cfg.lessons = chosen === 'all' ? ['all'] : [chosen];
        this.cfg.sitIds = null;
      }
      this.cfg.oralIds = null;
    } else if (originTab === 'oral') {
      this.cfg.mode = 'oral';
      const oralLesson = window.oralExamEngine?.currentLessonFilter;
      const appLesson = window.app?.currentLesson;
      const chosen = (oralLesson && oralLesson !== 'all')
        ? oralLesson
        : (appLesson && appLesson !== 'all' ? appLesson : 'all');
      this.cfg.lessons = chosen === 'all' ? ['all'] : [chosen];
      this.cfg.oralIds = null;
      this.cfg.sitIds = null;
    } else {
      const appLesson = window.app?.currentLesson;
      if (appLesson && appLesson !== 'all') this.cfg.lessons = [appLesson];
    }

    this.saveCfg();
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
    const svg = this.root.querySelector('#fr-svg');
    const ex = this.root.querySelector('#fr-examiner');
    svg.classList.add('notrans');
    svg.classList.remove('walk', 'walking', 'sitting', 'bowing', 'knocking', 'door-open', 'me-talking');
    ex.classList.remove('talking', 'smile', 'wave');
    this.root.querySelector('#fr-sparkles').classList.remove('on');
    this.root.querySelector('#fr-stage').classList.remove('happy');
    void svg.getBoundingClientRect();
    svg.classList.remove('notrans');
  }

  async playIntro(token) {
    const snd = window.soundEngine;
    const svg = this.root.querySelector('#fr-svg');

    // Allow skipping the walk-in
    this.renderControls();

    await this.sleep(700, token);
    // I knock twice on the door
    svg.classList.add('knocking');
    await this.sleep(150, token);
    snd?.playKnock?.();
    await this.sleep(300, token);
    snd?.playKnock?.();
    await this.sleep(800, token);
    svg.classList.remove('knocking');
    await this.sleep(300, token);

    this.say('exam', 'どうぞ。', 'Mời vào.', { speak: true });
    await this.sleep(1100, token);

    snd?.playDoor?.();
    svg.classList.add('door-open');
    await this.sleep(800, token);

    // Walk into the room (camera moves forward with a gentle head bob)
    svg.classList.add('walk', 'walking');
    const stepper = setInterval(() => { if (!this.skipIntro) snd?.playFootstep?.(); }, 330);
    try { await this.sleep(2900, token); } finally { clearInterval(stepper); }
    svg.classList.remove('walking');

    this.say('student', '失礼します。', 'Xin phép (cho em vào).', {});
    svg.classList.add('bowing');
    await this.sleep(1300, token);
    svg.classList.remove('bowing');

    this.say('exam', 'どうぞ、おかけください。', 'Mời em ngồi.', { speak: true });
    await this.sleep(1500, token);

    svg.classList.add('sitting');
    snd?.playClick?.();
    await this.sleep(900, token);
  }

  skipIntroNow() {
    if (this.phase !== 'intro') return;
    this.skipIntro = true;
    window.speechSynthesis?.cancel();
    const svg = this.root.querySelector('#fr-svg');
    svg.classList.add('notrans');
    svg.classList.remove('walking', 'bowing', 'knocking');
    svg.classList.add('door-open', 'walk', 'sitting');
    void svg.getBoundingClientRect();
    svg.classList.remove('notrans');
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
    const svg = this.root.querySelector('#fr-svg');
    ex.classList.remove('talking'); svg.classList.remove('me-talking');
    clearTimeout(this.talkTimer);
    if (!text) return;
    (who === 'exam' ? ex : svg).classList.add(who === 'exam' ? 'talking' : 'me-talking');
    const ms = Math.min(5000, 700 + text.length * 120);
    this.talkTimer = setTimeout(() => { ex.classList.remove('talking'); svg.classList.remove('me-talking'); }, ms);
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
    const st = this.root.querySelector('#fr-svg');
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
