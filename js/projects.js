/**
 * Projects — info-first cards; click opens an interactive modal.
 * Cards with a `live` URL embed the real app in an iframe; others show a preview.
 */

const FLAVORS = [
  {
    name: 'MBOX', flavor: 'Cloud File Storage', year: '2024', emo: '☁️', color: 'var(--blue)',
    live: 'https://drive-clone-ecru.vercel.app',
    repo: 'https://github.com/itsdiptabiswas',
    desc: 'A full cloud-storage app covering the whole file lifecycle: chunked uploads, AES encryption, Razorpay payments, sharing, recycle bin, and PWA support. Auth, multi-device sync and storage logic — all handled end-to-end.',
    stack: ['Next.js', 'TypeScript', 'MongoDB', 'AWS S3', 'Razorpay', 'NextAuth', 'PWA'],
  },
  {
    name: 'Rello', flavor: 'Real-time Kanban', year: '2023', emo: '🗂️', color: 'var(--mint)',
    live: '',
    repo: 'https://github.com/itsdiptabiswas',
    desc: 'A real-time project-management board with live updates over Socket.io and gnarly async side-effects tamed by Redux Saga. GitHub Actions wired for CI/CD — every push tests and deploys itself.',
    stack: ['React', 'TypeScript', 'Redux Saga', 'Socket.io', 'MongoDB', 'GitHub Actions'],
  },
];

export function initProjects() {
  const grid = document.querySelector('.pj-cards');
  if (!grid) return;

  /* Render cards */
  grid.innerHTML = FLAVORS.map((fl, i) => `
    <button class="pj-card" style="--cc:${fl.color}; transition-delay:${i * 0.1}s"
            data-i="${i}" aria-label="Open ${fl.name} project">
      <div class="pj-card-top">
        <span class="vbadge">VARIETY №${i + 1} · ${fl.year}</span>
        <span class="vemo" aria-hidden="true">${fl.emo}</span>
        <div class="vname">${fl.name}</div>
        <div class="vflavor">${fl.flavor}</div>
      </div>
      <div class="pj-card-body">
        <p class="pj-card-desc">${fl.desc}</p>
        <div class="pj-card-stack">${fl.stack.slice(0, 5).map(s => `<span>${s}</span>`).join('')}</div>
        <div class="pj-card-cta">
          <span class="go">Open &amp; interact</span>
          <span class="arrow" aria-hidden="true">→</span>
        </div>
      </div>
    </button>
  `).join('');

  /* Reveal on scroll */
  const revIo = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); revIo.unobserve(e.target); } });
  }, { threshold: 0.15 });
  grid.querySelectorAll('.pj-card').forEach(c => revIo.observe(c));

  /* Modal (built once) */
  const modal = document.createElement('div');
  modal.className = 'pjm';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="pjm-bg"></div>
    <div class="pjm-panel">
      <div class="pjm-bar">
        <div class="pjm-dots" aria-hidden="true"><b></b><b></b><b></b></div>
        <div class="pjm-url"></div>
        <button class="pjm-close" aria-label="Close">✕</button>
      </div>
      <div class="pjm-body"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const panel = modal.querySelector('.pjm-panel');
  const urlEl = modal.querySelector('.pjm-url');
  const bodyEl = modal.querySelector('.pjm-body');

  function open(i) {
    const p = FLAVORS[i];
    panel.style.setProperty('--cc', p.color);
    urlEl.textContent = p.live
      ? p.live.replace(/^https?:\/\//, '')
      : `dipta.dev/${p.name.toLowerCase()} — interactive preview`;

    if (p.live) {
      bodyEl.innerHTML = `
        <iframe class="pjm-frame" src="${p.live}" title="${p.name}"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          referrerpolicy="no-referrer" loading="lazy"></iframe>
      `;
    } else {
      bodyEl.innerHTML = `
        <div class="pjm-preview">
          <div class="pjm-pv-head">${p.name}</div>
          <div class="pjm-pv-flavor">${p.flavor} · ${p.year}</div>
          <p class="pjm-pv-desc">${p.desc}</p>
          <div class="pjm-pv-stack">${p.stack.map(s => `<span>${s}</span>`).join('')}</div>
          <div class="pjm-demo">
            <div class="big">🎮 Built with ${p.stack[0]} + ${p.stack[1]}</div>
            <p>This project isn't deployed publicly yet — the full source is on GitHub, and a live embed will load right here once it's online.</p>
            <div class="pjm-ctas">
              <a class="pjm-cta primary" href="${p.repo}" target="_blank" rel="noopener">View code on GitHub ↗</a>
            </div>
          </div>
        </div>
      `;
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.pjm-close').focus();
  }

  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    const frame = bodyEl.querySelector('iframe');
    if (frame) frame.src = '';
  }

  grid.addEventListener('click', e => {
    const card = e.target.closest('.pj-card');
    if (card) open(parseInt(card.dataset.i, 10));
  });
  modal.querySelector('.pjm-close').addEventListener('click', close);
  modal.querySelector('.pjm-bg').addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
}
