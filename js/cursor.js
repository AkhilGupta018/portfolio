/**
 * cursor.js
 * Smooth custom cursor with hover states
 */

(function () {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  const dot  = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');

  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Lerp ring towards mouse
  function lerp(a, b, t) { return a + (b - a) * t; }

  function animateCursor() {
    dotX   = lerp(dotX, mouseX, 0.9);
    dotY   = lerp(dotY, mouseY, 0.9);
    ringX  = lerp(ringX, mouseX, 0.12);
    ringY  = lerp(ringY, mouseY, 0.12);

    dot.style.transform  = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Hover targets
  const hoverTargets = 'a, button, .btn-primary, .btn-ghost, .skill-card, .project-card, .contact-item, .big-cta, .nav-cta';

  document.addEventListener('mouseover', (e) => {
    if (e.target.matches(hoverTargets) || e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.matches(hoverTargets) || e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Click effect
  document.addEventListener('mousedown', () => {
    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%) scale(0.6)`;
  });

  document.addEventListener('mouseup', () => {
    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%) scale(1)`;
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
})();
