/**
 * Skill Facts bars (scaleX) + ingredient chips staggered reveal.
 */
export function initSkills() {
  const section = document.getElementById('skills');
  if (!section) return;

  const bars = section.querySelectorAll('.nf-row .bar i');
  const chips = section.querySelectorAll('.ing');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      bars.forEach((bar, i) => {
        const pct = parseInt(bar.dataset.pct, 10) / 100;
        bar.style.transitionDelay = `${i * 70}ms`;
        bar.style.transform = `scaleX(${pct})`;
      });

      chips.forEach((chip, i) => {
        chip.style.transitionDelay = `${i * 40}ms`;
        chip.classList.add('show');
      });

      io.disconnect();
    });
  }, { threshold: 0.2 });

  io.observe(section);
}
