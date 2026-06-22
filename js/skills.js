/**
 * Skill bars: animate scaleX on scroll into view.
 * Chip cloud: staggered fade-in.
 */
export function initSkills() {
  /* Skill bars */
  const bars = document.querySelectorAll('.skill-bar-fill');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      bar.style.width = bar.dataset.pct + '%';
      io.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => io.observe(bar));

  /* Ingredient chips — staggered */
  const chips = document.querySelectorAll('.chip');
  const chipIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      chips.forEach((chip, i) => {
        setTimeout(() => chip.classList.add('visible'), i * 40);
      });
      chipIo.disconnect();
    });
  }, { threshold: 0.2 });

  const cloud = document.querySelector('.ingredients-chips');
  if (cloud) chipIo.observe(cloud);
}
