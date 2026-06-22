/**
 * Work history — staggered reveal on scroll.
 */
export function initStory() {
  const cards = document.querySelectorAll('.story-card');
  if (!cards.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const content = card.querySelector('.story-content');
      const dot     = card.querySelector('.story-dot');
      const delay   = card.dataset.delay || 0;
      setTimeout(() => {
        content?.classList.add('visible');
        dot?.classList.add('visible');
        card.classList.add('visible');
      }, delay);
      io.unobserve(card);
    });
  }, { threshold: 0.15 });

  cards.forEach((card, i) => {
    card.dataset.delay = i * 80;
    card.classList.add('reveal');
    io.observe(card);
  });
}
