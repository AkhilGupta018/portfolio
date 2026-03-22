/**
 * animations.js
 * GSAP ScrollTrigger animations, counter (IntersectionObserver), nav scroll, magnetic effects
 */

(function () {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // ── Entry animations (called after loader) ───────────────────────────
  function heroEntry() {
    const tl = gsap.timeline();
    tl.fromTo(
      '.hero-eyebrow',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
    )
      .fromTo(
        '.hero-title .line',
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power4.out',
        },
        '-=0.2',
      )
      .fromTo(
        '.hero-sub',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3',
      )
      .fromTo(
        '.hero-meta',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3',
      )
      .fromTo(
        '.hero-cta-row',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3',
      )
      .fromTo(
        '.hero-photo',
        { opacity: 0, x: 40, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out' },
        '-=0.8',
      )
      .fromTo(
        '.scroll-indicator',
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.2',
      );
  }

  window._startEntryAnims = heroEntry;

  // ── Nav scroll effect ─────────────────────────────────────────────────
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 'top -80px',
    onEnter: () => nav && nav.classList.add('scrolled'),
    onLeaveBack: () => nav && nav.classList.remove('scrolled'),
  });

  // ── Section labels ────────────────────────────────────────────────────
  gsap.utils.toArray('.section-label').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      },
    );
  });

  // ── Section titles ────────────────────────────────────────────────────
  gsap.utils.toArray('.section-title').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      },
    );
  });

  // ── About text ────────────────────────────────────────────────────────
  gsap.utils.toArray('.about-text p').forEach((p, i) => {
    gsap.fromTo(
      p,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: i * 0.1,
        scrollTrigger: { trigger: p, start: 'top 88%' },
      },
    );
  });

  // Terminal fade in
  gsap.fromTo(
    '.terminal-window',
    { opacity: 0, y: 40, rotateY: 5 },
    {
      opacity: 1,
      y: 0,
      rotateY: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.terminal-window', start: 'top 80%' },
    },
  );

  // ── Counter animation — IntersectionObserver (100% reliable) ─────────
  function runCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const isFloat = String(target).includes('.');
    const duration = 2000;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = isFloat ? value.toFixed(1) : Math.round(value);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 },
  );

  document.querySelectorAll('.stat-num').forEach((el) => counterIO.observe(el));

  // ── Skill cards stagger ───────────────────────────────────────────────
  gsap.fromTo(
    '.skill-card',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#skills-grid', start: 'top 80%' },
    },
  );

  // Animate skill bars
  const skillIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-fill').forEach((fill) => {
            fill.style.width = fill.getAttribute('data-width') + '%';
          });
          skillIO.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );
  const skillGrid = document.getElementById('skills-grid');
  if (skillGrid) skillIO.observe(skillGrid);

  // ── Project cards ─────────────────────────────────────────────────────
  gsap.utils.toArray('.project-card').forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%' },
      },
    );
  });

  // ── Timeline items ────────────────────────────────────────────────────
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.fromTo(
      item,
      { opacity: 0, x: -24 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: i * 0.12,
        scrollTrigger: { trigger: item, start: 'top 88%' },
      },
    );
  });

  // ── Achievement cards ─────────────────────────────────────────────────
  gsap.utils.toArray('.ach-card').forEach((card, i) => {
    gsap.fromTo(
      card,
      { opacity: 0, x: 24 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: i * 0.12,
        scrollTrigger: { trigger: card, start: 'top 88%' },
      },
    );
  });

  // ── Contact section ───────────────────────────────────────────────────
  gsap.fromTo(
    '.contact-text',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      scrollTrigger: { trigger: '.contact', start: 'top 75%' },
    },
  );
  gsap.fromTo(
    '.big-cta',
    { opacity: 0, scale: 0.8, rotation: -10 },
    {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.8,
      ease: 'back.out(1.4)',
      scrollTrigger: { trigger: '.contact', start: 'top 70%' },
    },
  );
  gsap.utils.toArray('.contact-item').forEach((item, i) => {
    gsap.fromTo(
      item,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        delay: i * 0.08,
        scrollTrigger: { trigger: item, start: 'top 90%' },
      },
    );
  });

  // ── Floating badge parallax ───────────────────────────────────────────
  gsap.utils.toArray('.floating-badge').forEach((b, i) => {
    gsap.to(b, {
      y: -20 - i * 8,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  // ── About stats reveal ────────────────────────────────────────────────
  gsap.fromTo(
    '.about-stats',
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      scrollTrigger: { trigger: '.about-stats', start: 'top 85%' },
    },
  );

  // ── Smooth nav scroll ─────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 80 },
          ease: 'power3.inOut',
        });
      }
    });
  });

  // ── Magnetic buttons ─────────────────────────────────────────────────
  document
    .querySelectorAll('.btn-primary, .nav-cta, .big-cta')
    .forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
        gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
      });
    });
})();
