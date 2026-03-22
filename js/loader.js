/**
 * loader.js
 * Fake progress loader that hides once page is ready
 */

(function () {
  const loader    = document.getElementById('loader');
  const barFill   = loader && loader.querySelector('.loader-bar span');
  if (!loader || !barFill) return;

  let progress = 0;

  function tick() {
    const increment = Math.random() * 8 + 3;
    progress = Math.min(progress + increment, 100);
    barFill.style.width = progress + '%';

    if (progress < 100) {
      setTimeout(tick, 80 + Math.random() * 60);
    } else {
      setTimeout(hide, 300);
    }
  }

  function hide() {
    loader.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    loader.style.opacity  = '0';
    loader.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      loader.style.display = 'none';
      // Trigger entry animations after loader disappears
      if (window._startEntryAnims) window._startEntryAnims();
    }, 600);
  }

  window.addEventListener('load', () => {
    // Ensure bar reaches 100 on real load
    progress = 90;
    barFill.style.width = '90%';
    setTimeout(() => {
      progress = 100;
      barFill.style.width = '100%';
      setTimeout(hide, 400);
    }, 300);
  });

  tick();
})();
