/**
 * CSS 3D cereal box — scroll rotation + drag-to-spin.
 * Exports: initBox(wrapperEl) → { setProgress, destroy }
 */
export function initBox(wrapper) {
  if (!wrapper) return { setProgress: () => {}, destroy: () => {} };

  let rotY = -22;
  let rotX = 4;
  let targetY = rotY;
  let targetX = rotX;
  let scrollRotY = rotY;

  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let velX = 0;
  let velY = 0;
  let raf;

  function applyTransform() {
    wrapper.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    raf = requestAnimationFrame(tick);
    if (!dragging) {
      targetY = scrollRotY;
      velX *= 0.88;
      velY *= 0.88;
      targetX += velX;
    }
    rotY = lerp(rotY, targetY, 0.08);
    rotX = lerp(rotX, targetX, 0.08);
    applyTransform();
  }
  tick();

  /* Scroll progress → rotation */
  function setProgress(p) {
    scrollRotY = -22 + p * 340;
  }

  /* Drag */
  function onDown(e) {
    dragging = true;
    wrapper.style.cursor = 'grabbing';
    const pt = e.touches ? e.touches[0] : e;
    lastX = pt.clientX;
    lastY = pt.clientY;
    velX = velY = 0;
  }

  function onMove(e) {
    if (!dragging) return;
    e.preventDefault();
    const pt = e.touches ? e.touches[0] : e;
    const dx = pt.clientX - lastX;
    const dy = pt.clientY - lastY;
    lastX = pt.clientX;
    lastY = pt.clientY;
    velX = -dy * 0.25;
    velY =  dx * 0.45;
    targetX = rotX + velX;
    targetY = rotY + velY;
    rotX = targetX;
    rotY = targetY;
    applyTransform();
  }

  function onUp() {
    dragging = false;
    wrapper.style.cursor = 'grab';
  }

  wrapper.addEventListener('mousedown',  onDown);
  wrapper.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('mousemove',  onMove);
  window.addEventListener('touchmove',  onMove, { passive: false });
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
