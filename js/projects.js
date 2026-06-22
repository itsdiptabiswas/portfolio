/**
 * Project cards → modal with iframe embed (if live URL) or fallback UI.
 */

const PROJECTS = [
  {
    id: 'mbox',
    emoji: '📦',
    title: 'MBOX',
    subtitle: 'Google Drive Clone',
    desc: 'A full-featured cloud storage web app with file upload, folder hierarchy, sharing, and real-time sync — built with React, Firebase, and Tailwind CSS.',
    tags: ['React', 'Firebase', 'Tailwind', 'Cloud Storage'],
    live: 'https://drive-clone-ecru.vercel.app',
    github: 'https://github.com/itsdiptabiswas/googledriveClone',
    features: [
      'File upload, download, and deletion with Firebase Storage',
      'Nested folder hierarchy and breadcrumb navigation',
      'Real-time updates via Firestore listeners',
      'Google OAuth authentication',
      'Responsive layout matching Google Drive UX',
    ],
  },
  {
    id: 'rello',
    emoji: '📋',
    title: 'Rello',
    subtitle: 'Trello Clone',
    desc: 'Kanban board app with drag-and-drop task management, custom columns, labels, and due dates — fully responsive with a clean, minimal UI.',
    tags: ['React', 'DnD Kit', 'Zustand', 'Kanban'],
    live: '',
    github: 'https://github.com/itsdiptabiswas/trello-clone',
    features: [
      'Drag-and-drop between columns using @dnd-kit/core',
      'Create, edit, and delete cards and boards',
      'Label system with color coding',
      'Local state persistence with Zustand',
      'Fully responsive mobile layout',
    ],
  },
];

export function initProjects() {
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;

  /* Render cards */
  grid.innerHTML = PROJECTS.map(p => `
    <article class="project-card reveal" data-id="${p.id}" role="button"
             tabindex="0" aria-label="Open ${p.title} project details">
      <div class="project-card-emoji" aria-hidden="true">${p.emoji}</div>
      <div class="project-card-tags">
        ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
      </div>
      <h3 class="project-card-title">${p.title}</h3>
      <p class="project-card-desc">${p.desc}</p>
      <div class="project-card-footer">
        <span class="project-card-cta">
          <span>View project</span>
          <span aria-hidden="true">→</span>
        </span>
        ${p.live ? '<span class="project-live-dot" title="Live"></span>' : ''}
      </div>
    </article>
  `).join('');

  /* Build modal DOM (once) */
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modal-title');
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-chrome">
        <div class="modal-chrome-dots" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <div class="modal-url-bar" id="modal-url-bar">—</div>
        <div class="modal-chrome-close">
          <button aria-label="Close modal">✕</button>
        </div>
      </div>
      <div class="modal-header">
        <div>
          <h2 class="modal-title" id="modal-title"></h2>
          <div class="modal-tags"></div>
        </div>
        <div class="modal-links"></div>
      </div>
      <div class="modal-body"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const modalTitle  = overlay.querySelector('.modal-title');
  const modalTags   = overlay.querySelector('.modal-tags');
  const modalLinks  = overlay.querySelector('.modal-links');
  const modalBody   = overlay.querySelector('.modal-body');
  const modalUrlBar = overlay.querySelector('#modal-url-bar');

  function openModal(id) {
    const p = PROJECTS.find(x => x.id === id);
    if (!p) return;

    modalTitle.textContent = `${p.emoji} ${p.title} — ${p.subtitle}`;
    modalTags.innerHTML = p.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');
    modalLinks.innerHTML = `
      <a href="${p.github}" target="_blank" rel="noopener" class="modal-link-btn" aria-label="View ${p.title} on GitHub">
        ↗ GitHub
      </a>
      ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" class="modal-link-btn primary" aria-label="Open ${p.title} live demo">
        ↗ Live Demo
      </a>` : ''}
    `;
    modalUrlBar.textContent = p.live || `github.com/itsdiptabiswas/${p.id}`;

    if (p.live) {
      modalBody.className = 'modal-iframe-wrap';
      modalBody.innerHTML = `
        <iframe src="${p.live}"
          title="${p.title} live demo"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
          allow="clipboard-read; clipboard-write">
        </iframe>
      `;
    } else {
      modalBody.className = 'modal-fallback';
      modalBody.innerHTML = `
        <p class="modal-fallback-desc">${p.desc}</p>
        <div class="modal-fallback-features">
          <h4>What it does</h4>
          <ul>${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
        </div>
      `;
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.modal-chrome-close button').focus();
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    const iframe = overlay.querySelector('iframe');
    if (iframe) iframe.src = '';
  }

  /* Event wiring */
  grid.addEventListener('click', e => {
    const card = e.target.closest('.project-card');
    if (card) openModal(card.dataset.id);
  });
  grid.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.project-card');
      if (card) { e.preventDefault(); openModal(card.dataset.id); }
    }
  });

  overlay.querySelector('.modal-chrome-close button').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
}
