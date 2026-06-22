/**
 * CSS 3D cereal box — scroll rotation + drag-to-spin.
 * rotY = -22 + progress*340 + dragY
 * rotX = -8  + sin(progress*2π)*6
 * Exports: initBox(wrapperEl) → { setProgress, destroy }
 */
export function initBox(wrapper) {
  if (!wrapper) return { setProgress: () => {}, destroy: () => {} };

  const state = { rotY: -22, rotX: -8, dragY: 0 };
  let progress = 0;
  let raf;

  function loop() {
    raf = requestAnimationFrame(loop);
    const targetY = -22 + (progress * 340) + state.dragY;
    const targetX = -8 + Math.sin(progress * Math.PI * 2) * 6;
    state.rotY += (targetY - state.rotY) * 0.08;
    state.rotX += (targetX - state.rotX) * 0.08;
    wrapper.style.transform =
      `translate(-50%,-50%) rotateX(${state.rotX}deg) rotateY(${state.rotY}deg)`;
  }
  loop();

  /* Scroll progress → rotation */
  function setProgress(p) { progress = p; }

  /* Drag to spin (horizontal) */
  const drag = { active: false, startX: 0 };
  function onDown(e) {
    drag.active = true;
    drag.startX = (e.touches ? e.touches[0] : e).clientX;
    wrapper.style.cursor = 'grabbing';
  }
  function onMove(e) {
    if (!drag.active) return;
    const x = (e.touches ? e.touches[0] : e).clientX;
    state.dragY += (x - drag.startX) * 0.4;
    drag.startX = x;
  }
  function onUp() {
    drag.active = false;
    wrapper.style.cursor = 'grab';
  }

  wrapper.addEventListener('mousedown',  onDown);
  wrapper.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('mousemove',  onMove);
  window.addEventListener('touchmove',  onMove, { passive: true });
  window.addEventListener('mouseup',    onUp);
  window.addEventListener('touchend',   onUp);

  return {
    setProgress,
    destroy() {
      cancelAnimationFrame(raf);
      wrapper.removeEventListener('mousedown',  onDown);
      wrapper.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('touchmove',  onMove);
      window.removeEventListener('mouseup',    onUp);
      window.removeEventListener('touchend',   onUp);
    }
  };
}
