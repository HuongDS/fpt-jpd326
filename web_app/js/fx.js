/**
 * FX - lightweight visual effects shared by Quiz and Typing game.
 * Canvas particles (confetti / bursts), floating text, banners, screen flash,
 * count-up numbers and the animated result screen.
 */
const FX = (() => {
  const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COLORS = ['#F27024', '#FFB347', '#FFD93D', '#34D399', '#38BDF8', '#A78BFA', '#F472B6', '#FFFFFF'];

  let canvas = null, ctx = null, dpr = 1, parts = [], raf = null, last = 0;

  function ensure() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.className = 'fx-canvas';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
  }

  function loop(t) {
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
    last = t;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    parts = parts.filter(p => p.life > 0 && p.y < window.innerHeight + 40);
    parts.forEach(p => {
      p.life -= dt;
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      const a = Math.max(0, Math.min(1, p.life / p.fade));
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.shape === 'star') {
        star(p.size);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    if (parts.length) {
      raf = requestAnimationFrame(loop);
    } else {
      raf = null;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function star(size) {
    const r = size / 2;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 === 0 ? r : r * 0.45;
      const ang = (Math.PI / 5) * i - Math.PI / 2;
      ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
    }
    ctx.closePath();
    ctx.fill();
  }

  function push(p) {
    parts.push(Object.assign({ g: 600, drag: 0.99, life: 1.2, fade: 0.5, size: 8, rot: 0, vr: 0, shape: 'circle', color: '#F27024' }, p));
    if (parts.length > 900) parts.splice(0, parts.length - 900);
  }

  function start() {
    ensure();
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  }

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  /** Radial burst of particles at (x, y) in viewport px */
  function burst(x, y, opts = {}) {
    if (reduced()) return;
    const { count = 18, speed = 320, colors = COLORS, size = 8, gravity = 700, life = 0.9, shapes = ['circle', 'star', 'rect'], up = false } = opts;
    for (let i = 0; i < count; i++) {
      const ang = up ? rand(-Math.PI * 0.95, -Math.PI * 0.05) : rand(0, Math.PI * 2);
      const sp = rand(speed * 0.35, speed);
      push({
        x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, g: gravity,
        life: rand(life * 0.7, life * 1.2), fade: 0.4,
        size: rand(size * 0.6, size * 1.3), color: pick(colors),
        shape: pick(shapes), rot: rand(0, 6), vr: rand(-10, 10), drag: 0.97
      });
    }
    start();
  }

  /** Burst from the centre of a DOM element */
  function burstAt(el, opts) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, opts);
  }

  /** Full-screen confetti: two cannons + falling rain. amount 0..1 */
  function confetti(amount = 1) {
    if (reduced()) return;
    const W = window.innerWidth, H = window.innerHeight;
    const n = Math.round(70 * amount) + 20;
    [0.12, 0.88].forEach((fx, idx) => {
      for (let i = 0; i < n; i++) {
        const ang = (idx === 0 ? -1 : -1) * rand(Math.PI * (idx === 0 ? 0.12 : 0.55), Math.PI * (idx === 0 ? 0.45 : 0.88));
        const sp = rand(500, 1100);
        push({
          x: W * fx, y: H * 0.95, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
          g: 900, drag: 0.985, life: rand(2.2, 3.4), fade: 0.8, size: rand(7, 13),
          color: pick(COLORS), shape: Math.random() < 0.75 ? 'rect' : 'circle', rot: rand(0, 6), vr: rand(-12, 12)
        });
      }
    });
    for (let i = 0; i < n; i++) {
      push({
        x: rand(0, W), y: rand(-H * 0.4, -10), vx: rand(-60, 60), vy: rand(80, 260),
        g: 120, drag: 1, life: rand(2.5, 4), fade: 0.8, size: rand(6, 11),
        color: pick(COLORS), shape: Math.random() < 0.8 ? 'rect' : 'star', rot: rand(0, 6), vr: rand(-8, 8)
      });
    }
    start();
  }

  /** A few firework bursts across the screen */
  function fireworks(times = 4) {
    if (reduced()) return;
    for (let i = 0; i < times; i++) {
      setTimeout(() => {
        const x = rand(window.innerWidth * 0.15, window.innerWidth * 0.85);
        const y = rand(window.innerHeight * 0.12, window.innerHeight * 0.5);
        const c = [pick(COLORS), pick(COLORS), '#FFFFFF'];
        burst(x, y, { count: 44, speed: 380, colors: c, size: 9, gravity: 280, life: 1.3, shapes: ['circle', 'star'] });
      }, i * 280);
    }
  }

  /** Floating text that rises and fades, positioned at viewport coords or over an element */
  function floatText(target, text, color = '#F27024', big = false) {
    let x, y;
    if (target && target.getBoundingClientRect) {
      const r = target.getBoundingClientRect();
      x = r.left + r.width / 2; y = r.top + r.height / 2;
    } else { x = window.innerWidth / 2; y = window.innerHeight / 2; }
    const d = document.createElement('div');
    d.className = 'fx-float' + (big ? ' big' : '');
    d.textContent = text;
    d.style.left = `${x}px`;
    d.style.top = `${y}px`;
    d.style.color = color;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 1100);
  }

  /** Big centred banner such as "COMBO x5!" */
  function banner(text, color = '#F27024') {
    if (reduced()) return;
    const d = document.createElement('div');
    d.className = 'fx-banner';
    d.textContent = text;
    d.style.setProperty('--fx-color', color);
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 1300);
  }

  /** Brief coloured vignette flash over the screen */
  function flash(kind = 'red') {
    if (reduced()) return;
    const d = document.createElement('div');
    d.className = `fx-flash ${kind}`;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 500);
  }

  /** Restart a CSS animation class on an element */
  function replay(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  function countUp(el, to, duration = 1200, suffix = '') {
    if (!el) return;
    if (reduced()) { el.textContent = `${to}${suffix}`; return; }
    const startT = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - startT) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${Math.round(to * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const GRADES = [
    { min: 95, grade: 'S', rank: 'Bậc thầy!', title: 'Hoàn hảo' },
    { min: 85, grade: 'A', rank: 'Xuất sắc!', title: 'Rất tốt' },
    { min: 70, grade: 'B', rank: 'Làm tốt lắm!', title: 'Khá tốt' },
    { min: 50, grade: 'C', rank: 'Cố lên chút nữa!', title: 'Tạm ổn' },
    { min: 0, grade: 'D', rank: 'Luyện thêm nhé!', title: 'Cần luyện tập' }
  ];

  /**
   * Fill and animate a result screen.
   * Expects elements: {p}-result-title, {p}-ring, {p}-grade, {p}-rank, {p}-final-score,
   * {p}-result-chips, {p}-final-best
   */
  function showResult(p, data) {
    const $ = id => document.getElementById(`${p}-${id}`);
    const accuracy = data.total ? Math.round((data.correct / data.total) * 100) : 0;
    const g = GRADES.find(x => accuracy >= x.min);

    const stage = $('result-view');
    if (stage) {
      stage.className = stage.className.replace(/\bgrade-[SABCD]\b/g, '').trim() + ` grade-${g.grade}`;
    }
    if ($('result-title')) $('result-title').textContent = g.title;
    if ($('grade')) $('grade').textContent = g.grade;
    if ($('rank')) $('rank').textContent = g.rank;

    const ring = $('ring');
    if (ring) {
      const C = 326.73;
      ring.style.transition = 'none';
      ring.style.strokeDashoffset = C;
      void ring.getBoundingClientRect();
      ring.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1) .3s';
      ring.style.strokeDashoffset = C * (1 - accuracy / 100);
    }

    countUp($('final-score'), data.score, 1400);

    const chips = $('result-chips');
    if (chips) {
      const all = [
        { v: `${data.correct}/${data.total}`, l: 'Số câu đúng' },
        { v: `${accuracy}%`, l: 'Chính xác' },
        ...(data.chips || [])
      ];
      chips.innerHTML = all.map((c, i) => `
        <div class="result-chip" style="animation-delay: ${0.5 + i * 0.12}s">
          <strong>${c.v}</strong><span>${c.l}</span>
        </div>`).join('');
    }

    const best = $('final-best');
    if (best) {
      best.textContent = data.bestText || '';
      best.classList.toggle('new-best', !!data.isNewBest);
    }

    // Celebration scaled by performance
    const medal = $('ring') ? $('ring').closest('.result-medal') : null;
    setTimeout(() => {
      if (g.grade === 'S') { confetti(1); fireworks(5); }
      else if (g.grade === 'A') { confetti(0.8); fireworks(2); }
      else if (g.grade === 'B') confetti(0.45);
      else if (g.grade === 'C') burstAt(medal, { count: 16, speed: 260 });
    }, 350);
  }

  return { burst, burstAt, confetti, fireworks, floatText, banner, flash, replay, countUp, showResult };
})();

window.FX = FX;
