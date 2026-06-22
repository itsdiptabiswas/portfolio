/**
 * Three.js particle background for the hero section.
 * Exports: initParticles(canvas) → { destroy }
 */
export function initParticles(canvas) {
  const THREE = window.THREE;
  if (!THREE || !canvas) return { destroy: () => {} };

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 80;

  /* Particle geometry */
  const COUNT = 120;
  const positions = new Float32Array(COUNT * 3);
  const speeds    = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 180;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 130;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    speeds[i] = 0.2 + Math.random() * 0.5;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xf07a5a,
    size: 1.8,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.55,
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

  /* Resize */
  function resize() {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* Animate */
  let raf;
  let t = 0;
  function animate() {
    raf = requestAnimationFrame(animate);
    t += 0.008;

    const pos = geo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.06;
      if (pos[i * 3 + 1] > 65) pos[i * 3 + 1] = -65;
    }
    geo.attributes.position.needsUpdate = true;

    points.rotation.y = mx * 0.06 + Math.sin(t * 0.3) * 0.04;
    points.rotation.x = my * 0.04 + Math.cos(t * 0.2) * 0.02;

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
