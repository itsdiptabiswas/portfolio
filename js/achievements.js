/**
 * Achievements: clickable award card opens LinkedIn stats modal.
 */
export function initAchievements() {
  const awardCard = document.querySelector('.award-card');
  if (!awardCard) return;

  /* LinkedIn modal */
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'li-modal-title');
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-chrome">
        <div class="modal-chrome-dots" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <div class="modal-url-bar">linkedin.com/in/dipta-biswas</div>
        <div class="modal-chrome-close">
          <button aria-label="Close modal">✕</button>
        </div>
      </div>
      <div class="modal-header">
        <div>
          <h2 class="modal-title" id="li-modal-title">🏆 LinkedIn Highlights</h2>
          <p style="font-size:13px;color:var(--ink-soft);margin-top:6px">
            Real metrics from Dipta's LinkedIn profile
          </p>
        </div>
        <div class="modal-links">
          <a href="https://linkedin.com/in/dipta-biswas" target="_blank"
             rel="noopener" class="modal-link-btn primary" aria-label="View LinkedIn profile">
            ↗ View Profile
          </a>
        </div>
      </div>
      <div class="modal-linkedin">
        <div class="linkedin-stat">
          <div class="linkedin-stat-num">500+</div>
          <div class="linkedin-stat-label">Connections</div>
        </div>
        <div class="linkedin-stat" style="background:var(--red)">
          <div class="linkedin-stat-num">6+</div>
          <div class="linkedin-stat-label">Years Experience</div>
        </div>
        <div class="linkedin-stat" style="background:var(--mint)">
          <div class="linkedin-stat-num">60fps</div>
          <div class="linkedin-stat-label">Ships UI at</div>
        </div>
        <div class="linkedin-stat" style="background:var(--purple)">
          <div class="linkedin-stat-num">SDE3</div>
          <div class="linkedin-stat-label">Current Level</div>
        </div>
        <div class="linkedin-stat wide" style="background:var(--yellow);color:var(--ink)">
          <div style="font-size:40px">🏆</div>
          <div>
            <div class="linkedin-stat-num">Star Employee</div>
            <div class="linkedin-stat-label" style="color:var(--ink-soft)">
              Awarded at Gyaan AI · Frontend Excellence · 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.modal-chrome-close button').focus();
  }
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  awardCard.addEventListener('click', openModal);
  awardCard.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
  });
  overlay.querySelector('.modal-chrome-close button').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  /* Counter animation for metric numbers */
  const counters = document.querySelectorAll('.metric-num[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const step = end / 40;
      const timer = setInterval(() => {
        start = Math.min(start + step, end);
        el.textContent = (Number.isInteger(end) ? Math.round(start) : start.toFixed(1)) + suffix;
        if (start >= end) clearInterval(timer);
      }, 30);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}
