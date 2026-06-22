/**
 * Three.js floating accent particles for the hero — subtle round "cereal dust"
 * in warm cereal colors, layered behind the box. Enhancement, not background.
 * Exports: initParticles(canvas) → { destroy }
 */
import * as THREE from 'three';

/* Build a soft round sprite texture so points are circles, not squares */
function makeCircleTexture() {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  g.addColorStop(0,   'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.85)');
  g.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

export function initParticles(canvas) {
  if (!canvas) return { destroy: () => {} };

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 80;

  const sprite = makeCircleTexture();

  /* Cereal colors */
  const COLORS = [0xFFC53A, 0xFF5A3C, 0x2FB783, 0x3B7DFF, 0x8B5CF6];
  const COUNT = 70;

  const group = new THREE.Group();
  scene.add(group);

  const items = [];
  for (let i = 0; i < COUNT; i++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const mat = new THREE.PointsMaterial({
      color,
      size: 1.4 + Math.random() * 2.2,
      map: sprite,
      transparent: true,
      opacity: 0.18 + Math.random() * 0.22,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array([
      (Math.random() - 0.5) * 210,
      (Math.random() - 0.5) * 150,
      (Math.random() - 0.5) * 70,
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pt = new THREE.Points(geo, mat);
    group.add(pt);
    items.push({ pt, speed: 0.06 + Math.random() * 0.12 });
  }

  /* Mouse parallax */
  let mx = 0, my = 0;
  const onMove = (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMove, { passive: true });

  /* Resize against parent so buffer is never 0×0 */
  function resize() {
    const w = canvas.parentElement?.offsetWidth  || window.innerWidth;
    const h = canvas.parentElement?.offsetHeight || window.innerHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement || document.body);
  setTimeout(resize, 0);

  /* Animate */
  let raf, t = 0;
  function animate() {
    raf = requestAnimationFrame(animate);
    t += 0.005;
    items.forEach(({ pt, speed }) => {
      const p = pt.geometry.attributes.position.array;
      p[1] += speed;
      if (p[1] > 78) p[1] = -78;
      pt.geometry.attributes.position.needsUpdate = true;
    });
    group.rotation.y = mx * 0.1 + Math.sin(t * 0.3) * 0.05;
    group.rotation.x = my * 0.06;
    renderer.render(scene, camera);
  }
  animate();

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      ro.disconnect();
      items.forEach(({ pt }) => { pt.geometry.dispose(); pt.material.dispose(); });
      sprite.dispose();
      renderer.dispose();
    }
  };
}
