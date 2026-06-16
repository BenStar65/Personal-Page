/**
 * Siyabonga Shembe — Portfolio
 * script.js
 *
 * Contents:
 *  1. Bootstrap         — JS-ready flag on <html>
 *  2. PortfolioCanvas   — Hero background: starfield + quasar visual
 *  3. initNav           — Scroll state, mobile menu, active section tracker
 *  4. initScrollReveal  — Staggered IntersectionObserver reveal per section
 *  5. DOMContentLoaded  — Wire everything up
 */


/* ==============================================================
   1. BOOTSTRAP
   Adding .js-ready to <html> lets CSS activate hidden/reveal
   styles only when JavaScript is actually running (no FOUC).
   ============================================================== */
document.documentElement.classList.add('js-ready');


/* ==============================================================
   2. PORTFOLIO CANVAS
   Draws inside #hero's <canvas id="bg-canvas">.
   Four layers:
     a) Starfield       — ~180 dim static dots, gentle sine twinkle
     b) Quasar jets     — soft opposing beams from the central core
     c) Accretion disk  — tilted ellipse rings and drifting particles
     d) Core pulse      — subtle lens pulse across the disk plane
   Everything is deliberately quiet — supports the content, never
   competes with it.
   ============================================================== */

class PortfolioCanvas {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor (canvas) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.running = false;
    this.raf     = null;

    /* Pulse state */
    this.pulse       = null;
    this.lastPulse   = 0;
    this.pulseDelay  = 7000; /* ms between pulses */

    this.diskParticles = [];

    this._onResize = () => {
      this.resize();
      this.generateStars();
    };
    window.addEventListener('resize', this._onResize, { passive: true });

    this.resize();
    this.generateStars();

    this.running = true;
    this.tick();
  }

  /* ── resize ─────────────────────────────────────────── */
  resize () {
    /* Match canvas to its parent element size */
    const hero = this.canvas.parentElement;
    this.canvas.width  = hero.offsetWidth  || window.innerWidth;
    this.canvas.height = hero.offsetHeight || window.innerHeight;

    const W = this.canvas.width;
    const H = this.canvas.height;

    /* Focal point: right-of-centre — where signal appears to originate */
    const isNarrow = W < 720;

    this.fx = W * (isNarrow ? 0.82 : 0.72);
    this.fy = H * 0.44;
    this.diskAngle = -0.22;
    this.diskScale = 0.28;
    this.diskOuterR = Math.min(
      Math.max(W * (isNarrow ? 0.42 : 0.27), isNarrow ? 160 : 230),
      H * (isNarrow ? 0.34 : 0.58)
    );
    this.jetAngle = -Math.PI / 2 + 0.14;

    /* Max pulse radius — just past the canvas diagonal so it always exits */
    this.maxPulseR = this.diskOuterR * 1.25;
  }

  /* ── generate starfield ──────────────────────────────── */
  generateStars () {
    const W = this.canvas.width;
    const H = this.canvas.height;

    /* Scale count to canvas area; cap to avoid performance issues on large screens */
    const count = Math.min(190, Math.floor(W * H / 8500));

    this.stars = Array.from({ length: count }, () => ({
      x:        Math.random() * W,
      y:        Math.random() * H,
      r:        Math.random() * 1.1 + 0.2,
      baseAlpha: Math.random() * 0.28 + 0.04,
      phase:    Math.random() * Math.PI * 2,
      freq:     0.0003 + Math.random() * 0.0007,
    }));

    const particleCount = Math.min(180, Math.floor(W * H / 9500));

    this.diskParticles = Array.from({ length: particleCount }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 24 + Math.pow(Math.random(), 0.55) * this.diskOuterR,
      band: (Math.random() - 0.5) * 18,
      speed: (Math.random() > 0.5 ? 1 : -1) * (0.000045 + Math.random() * 0.00012),
      size: Math.random() * 1.2 + 0.25,
      alpha: Math.random() * 0.18 + 0.035,
    }));
  }

  /* ── generate orbital network nodes ───────────────────── */
  /* ── spawn a new pulse ring ──────────────────────────── */
  spawnPulse () {
    this.pulse = {
      r:         10,
      speed:     0.34,    /* px per frame (~20px/s at 60 fps) */
      startAlpha: 0.13,
    };
  }

  /* ── main animation loop ─────────────────────────────── */
  tick () {
    if (!this.running) return;

    const now = Date.now();
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const { fx, fy } = this;

    ctx.clearRect(0, 0, W, H);

    /* ── a) Starfield ── */
    this.stars.forEach(s => {
      /* Gently vary brightness using a per-star sine wave */
      const alpha = s.baseAlpha + Math.sin(now * s.freq + s.phase) * 0.035;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 218, 255, ${Math.max(0, alpha)})`;
      ctx.fill();
    });

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const halo = ctx.createRadialGradient(fx, fy, 0, fx, fy, this.diskOuterR * 0.95);
    halo.addColorStop(0, 'rgba(88, 255, 231, 0.16)');
    halo.addColorStop(0.35, 'rgba(45, 212, 191, 0.065)');
    halo.addColorStop(1, 'rgba(45, 212, 191, 0)');
    ctx.beginPath();
    ctx.arc(fx, fy, this.diskOuterR * 0.95, 0, Math.PI * 2);
    ctx.fillStyle = halo;
    ctx.fill();

    const jetLength = Math.max(W, H) * 0.58;
    const drawJet = direction => {
      const endX = fx + Math.cos(this.jetAngle) * jetLength * direction;
      const endY = fy + Math.sin(this.jetAngle) * jetLength * direction;

      [
        { width: 34, alpha: 0.035 },
        { width: 15, alpha: 0.07 },
        { width: 3, alpha: 0.24 },
      ].forEach(layer => {
        const jet = ctx.createLinearGradient(fx, fy, endX, endY);
        jet.addColorStop(0, `rgba(142, 255, 244, ${layer.alpha})`);
        jet.addColorStop(0.5, `rgba(45, 212, 191, ${layer.alpha * 0.45})`);
        jet.addColorStop(1, 'rgba(45, 212, 191, 0)');

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = jet;
        ctx.lineWidth = layer.width;
        ctx.lineCap = 'round';
        ctx.stroke();
      });
    };

    drawJet(1);
    drawJet(-1);

    ctx.save();
    ctx.translate(fx, fy);
    ctx.rotate(this.diskAngle);
    ctx.scale(1, this.diskScale);

    for (let i = 0; i < 8; i++) {
      const radius = this.diskOuterR * (0.26 + i * 0.095);
      const alpha = 0.095 - i * 0.009;

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(45, 212, 191, ${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0.08 * Math.PI, 0.92 * Math.PI);
      ctx.strokeStyle = `rgba(200, 245, 242, ${alpha * 1.75})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    this.diskParticles.forEach(p => {
      const angle = p.angle + now * p.speed;
      const x = Math.cos(angle) * p.radius;
      const y = Math.sin(angle) * p.radius + p.band;

      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(177, 255, 246, ${p.alpha})`;
      ctx.fill();
    });

    ctx.restore();

    const coreGlow = ctx.createRadialGradient(fx, fy, 0, fx, fy, 82);
    coreGlow.addColorStop(0, 'rgba(235, 255, 252, 0.82)');
    coreGlow.addColorStop(0.12, 'rgba(118, 255, 240, 0.42)');
    coreGlow.addColorStop(0.45, 'rgba(45, 212, 191, 0.12)');
    coreGlow.addColorStop(1, 'rgba(45, 212, 191, 0)');

    ctx.beginPath();
    ctx.arc(fx, fy, 82, 0, Math.PI * 2);
    ctx.fillStyle = coreGlow;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(fx, fy, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244, 255, 253, 0.95)';
    ctx.fill();

    ctx.restore();

    /* ── d) Expanding disk pulse ── */
    if (this.pulse) {
      this.pulse.r += this.pulse.speed;
      const progress = this.pulse.r / this.maxPulseR;
      /* Fade in quickly, then fade out as it expands */
      const alpha = this.pulse.startAlpha * (1 - progress) *
                    Math.min(1, progress * 14);

      if (alpha > 0.003) {
        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(this.diskAngle);
        ctx.scale(1, this.diskScale);
        ctx.beginPath();
        ctx.arc(0, 0, this.pulse.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(45, 212, 191, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      } else {
        this.pulse = null; /* Done — cleared until next spawn */
      }
    }

    /* Spawn next pulse */
    if (!this.pulse && now - this.lastPulse > this.pulseDelay) {
      this.spawnPulse();
      this.lastPulse = now;
    }

    this.raf = requestAnimationFrame(() => this.tick());
  }

  /* ── cleanup ─────────────────────────────────────────── */
  destroy () {
    this.running = false;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this._onResize);
  }
}


/* ==============================================================
   3. NAVIGATION
   a) Adds .scrolled to #nav after 60 px scroll
   b) Mobile hamburger: toggles .open on #nav-links and #nav-toggle
   c) Active section: IntersectionObserver highlights the matching
      nav link as sections enter the viewport
   ============================================================== */

function initNav () {
  const nav     = document.getElementById('nav');
  const toggle  = document.getElementById('nav-toggle');
  const linksList = document.getElementById('nav-links');
  const navLinks  = document.querySelectorAll('.nav-link');

  /* ── a) Scroll state ── */
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); /* run once on load in case page is already scrolled */

  /* ── b) Mobile toggle ── */
  toggle.addEventListener('click', () => {
    const isOpen = linksList.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close mobile menu when any link is clicked */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      linksList.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── c) Active section tracking ── */
  /*
   * rootMargin: "-40% top, -55% bottom" means the observer fires
   * when a section's centre region crosses the viewport midpoint.
   * This keeps the active link consistent while scrolling.
   */
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));
}


/* ==============================================================
   4. SCROLL REVEAL
   Elements with class .reveal fade up into view as they enter
   the viewport. Delay is staggered per element within its
   section (0 ms, 80 ms, 160 ms … up to 320 ms max).
   ============================================================== */

function initScrollReveal () {
  /* Assign staggered CSS custom property --reveal-delay to each
     .reveal within its parent section. */
  document.querySelectorAll('section.section, section#hero').forEach(section => {
    section.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i * 80, 320)}ms`);
    });
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); /* fire once only */
      }
    });
  }, {
    threshold:  0.08,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}


/* ==============================================================
   5. INIT — wire everything up on DOMContentLoaded
   ============================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* Canvas background — skip entirely if user prefers reduced motion */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      /* Small delay so the hero is painted before the first frame */
      setTimeout(() => new PortfolioCanvas(canvas), 100);
    } else {
      /* Hide the canvas element cleanly when animation is unwanted */
      canvas.style.display = 'none';
    }
  }

  initNav();
  initScrollReveal();

});
