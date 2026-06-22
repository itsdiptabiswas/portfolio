/**
 * Achievements: clickable award opens a LinkedIn-style modal; metrics reveal on scroll.
 */
const LINKEDIN_PROFILE = 'https://linkedin.com/in/dipta-biswas';

export function initAchievements() {
  const award = document.querySelector('.ac-award');
  if (!award) return;

  /* Metric reveal */
  const metrics = document.querySelectorAll('.ac-metric');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      metrics.forEach((m, i) => {
        m.style.transitionDelay = `${i * 70}ms`;
        m.classList.add('show');
      });
      io.disconnect();
    });
  }, { threshold: 0.2 });
  const grid = document.querySelector('.ac-grid');
  if (grid) io.observe(grid);

  /* Modal */
  const modal = document.createElement('div');
  modal.className = 'acm';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="acm-bg"></div>
    <div class="acm-panel">
      <div class="acm-bar">
        <span class="in">in</span>
        <b>Celebrating the Outstanding Performance Award</b>
        <button class="acm-close" aria-label="Close">✕</button>
      </div>
      <div class="acm-body">
        <div class="acm-left">
          <div class="acm-fallback">
            <span class="medal" aria-hidden="true">🎉</span>
            <h3>Nov 2023 · CodeClouds</h3>
            <p>A milestone I'm genuinely proud of — public recognition for consistent delivery and real, measurable impact on how the team shipped.</p>
            <a class="go" href="${LINKEDIN_PROFILE}" target="_blank" rel="noopener">
              <span class="in">in</span> Open LinkedIn ↗
            </a>
          </div>
        </div>
        <div class="acm-right">
          <span class="eyebrow">🏆 Nov 2023 · CodeClouds</span>
          <h3>Outstanding Performance Award</h3>
          <p>Recognition for <b>consistent delivery</b> and real, measurable impact on how the team shipped.</p>
          <div class="acm-pts">
            <div class="acm-pt">Built a reusable scaffold that cut new-project setup time by <b>45%</b>.</div>
            <div class="acm-pt">Mentored junior devs in React &amp; modern JavaScript.</div>
            <div class="acm-pt">Raised the bar on code reviews and delivery quality.</div>
          </div>
          <p>Beyond the trophy, it's the kind of teamwork and momentum I love being part of — and a reminder of why I do this work.</p>
          <a class="go" href="${LINKEDIN_PROFILE}" target="_blank" rel="noopener">
            <span class="in">in</span> View on LinkedIn ↗
          </a>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  function open() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.acm-close').focus();
  }
  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  award.addEventListener('click', open);
  modal.querySelector('.acm-close').addEventListener('click', close);
  modal.querySelector('.acm-bg').addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
}
