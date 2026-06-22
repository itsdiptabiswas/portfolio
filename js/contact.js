/**
 * Contact section: email copy-to-clipboard button.
 */
export function initContact() {
  const btn   = document.querySelector('.contact-email-btn');
  const badge = document.querySelector('.email-copy-badge');
  if (!btn || !badge) return;

  const EMAIL = 'jobs.diptabiswas@gmail.com';
  let timer;

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      /* Fallback for browsers without clipboard API */
      const ta = document.createElement('textarea');
      ta.value = EMAIL;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    badge.textContent = 'COPIED ✓';
    clearTimeout(timer);
    timer = setTimeout(() => { badge.textContent = 'TAP TO COPY'; }, 2000);
  });
}
