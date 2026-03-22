/**
 * typewriter.js
 * Typewriter effect for hero subtitle
 */

(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'AI Engineer & LLM Specialist',
    'Building intelligent systems',
    'Fine-tuning language models',
    'Shipping AI that actually works',
    'C++ | Python | PyTorch',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pausing   = false;

  function type() {
    if (pausing) return;

    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        pausing = true;
        setTimeout(() => { deleting = true; pausing = false; }, 2200);
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    const speed = deleting ? 35 : 65;
    setTimeout(type, speed);
  }

  // Start after loader
  function start() { setTimeout(type, 400); }

  if (window._loaderDone) {
    start();
  } else {
    const orig = window._startEntryAnims;
    window._startEntryAnims = function () {
      if (orig) orig();
      start();
    };
  }
})();
