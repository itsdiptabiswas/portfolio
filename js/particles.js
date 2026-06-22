/**
 * Three.js particle background for the hero section.
 * Exports: initParticles(canvas) → { destroy }
 */
import * as THREE from 'three';

export function initParticles(canvas) {
  if (!canvas) return { destroy: () => {} };

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 80;

  /* Particle geometry */
  const COUNT = 160;
  const positions = new Float32Array(COUNT * 3);
  const speeds    = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 140;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    speeds[i] = 0.15 + Math.random() * 0.4;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xe8432d,
    size: 2.5,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.65,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  /* Mouse parallax */
  let mx = 0, my = 0;
  const onMove = (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMove, { passive: true });

  /* Resize — must set canvas width/height attributes, not just CSS */
  function resize() {
    const w = canvas.parentElement?.offsetWidth  || window.innerWidth;
    const h = canvas.parentElement?.offsetHeight || window.innerHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement || document.body);
  /* Small delay so layout is computed before first resize */
  setTimeout(resize, 0);

  /* Animate */
  let raf;
  let t = 0;
  function animate() {
    raf = requestAnimationFrame(animate);
    t += 0.006;

    const pos = geo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.05;
      if (pos[i * 3 + 1] > 70) pos[i * 3 + 1] = -70;
    }
    geo.attributes.position.needsUpdate = true;

    points.rotation.y = mx * 0.08 + Math.sin(t * 0.25) * 0.05;
    points.rotation.x = my * 0.05 + Math.cos(t * 0.18) * 0.03;

    renderer.render(scene, camera);
  }
  animate();

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    }
  };
}
