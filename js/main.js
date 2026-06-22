/**
 * main.js — entry point. Initialises all modules after DOM + Three.js load.
 */
import { initParticles }   from './particles.js';
import { initBox }         from './box3d.js';
import { initNav }         from './nav.js';
import { initSkills }      from './skills.js';
import { initProjects }    from './projects.js';
import { initStory }       from './story.js';
import { initAchievements } from './achievements.js';
import { initContact }     from './contact.js';

/* ── Loader ───────────────────────────────────────────────── */
const loader    = document.getElementById('loader');
const loaderBar = document.getElementById('loader-bar');
const loaderMsg = document.getElementById('loader-msg');

const MESSAGES = ['Pouring the milk…', 'Adding React flakes…', 'Stirring Three.js…', 'Ready to serve!'];
let msgIdx = 0;
const msgTimer = setInterval(() => {
  loaderMsg.textContent = MESSAGES[Math.min(msgIdx++, MESSAGES.length - 1)];
}, 600);

function setLoaderProgress(pct) {
  loaderBar.style.width = pct + '%';
}
setLoaderProgress(20);

/* ── Hero scroll + box ────────────────────────────────────── */
function initHero(box) {
  const pin      = document.querySelector('.hero-pin');
  const captions = document.querySelectorAll('.hero-caption');
  const railFill = document.querySelector('.rail-fill');

  if (!pin) return;

  function getProgress() {
    const rect = pin.getBoundingClientRect();
    const total = pin.offsetHeight - window.innerHeight;
    return Math.max(0, Math.min(1, -rect.top / total));
  }

  function updateCaptions(p) {
    const idx = p < 0.34 ? 0 : p < 0.68 ? 1 : 2;
    captions.forEach((c, i) => c.classList.toggle('active', i === idx));
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const p = getProgress();
      box.setProgress(p);
      updateCaptions(p);
      if (railFill) railFill.style.transform = `scaleY(${p})`;
      scrollTicking = false;
    });
  }, { passive: true });

  /* Set initial caption */
  updateCaptions(0);
  captions[0]?.classList.add('active');
}

/* ── Reveal observer (generic) ────────────────────────────── */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ── Bootstrap ────────────────────────────────────────────── */
window.addEventListener('load', () => {
  clearInterval(msgTimer);
  setLoaderProgress(100);
  setTimeout(() => loader?.classList.add('hidden'), 400);
});

document.addEventListener('DOMContentLoaded', () => {
  setLoaderProgress(50);

  initNav();
  initSkills();
  initProjects();
  initStory();
  initAchievements();
  initContact();
  initReveal();

  setLoaderProgress(75);

  /* Three.js particles — non-blocking */
  const canvas = document.getElementById('hero-canvas');
  initParticles(canvas);

  /* CSS 3D box */
  const wrapper = document.querySelector('.box-wrapper');
  const box = initBox(wrapper);
  initHero(box);

  setLoaderProgress(90);
});
