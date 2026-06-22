/**
 * Sticky nav: scrolled state, mobile hamburger menu, active link tracking.
 */
export function initNav() {
  const nav        = document.querySelector('.nav');
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile a');
  const navLinks   = document.querySelectorAll('.nav-links a');

  if (!nav) return;

  /* Scrolled state */
  function updateScrolled() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', updateScrolled, { passive: true });
  updateScrolled();

  /* Mobile toggle */
  let menuOpen = false;
  function toggleMenu(force) {
    menuOpen = force !== undefined ? force : !menuOpen;
    hamburger?.classList.toggle('open', menuOpen);
    mobileMenu?.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    hamburger?.setAttribute('aria-expanded', menuOpen);
  }

  hamburger?.addEventListener('click', () => toggleMenu());
  mobileLinks.forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  /* Close on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) toggleMenu(false);
  });

  /* Active link on scroll */
  const sections = document.querySelectorAll('section[id]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => io.observe(s));
}
