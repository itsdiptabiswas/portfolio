/**
 * Work history cards — staggered reveal on scroll.
 */
export function initStory() {
  const cards = document.querySelectorAll('.st-card');
  if (!cards.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 70}ms`;
    io.observe(card);
  });
}
