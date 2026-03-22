/**
 * three-scene.js
 * Animated 3D particle / geometry background using Three.js r128
 */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Scene setup
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  camera.position.z = 30;

  // ── Particle field ────────────────────────────────────────────────────
  const PARTICLE_COUNT = 1800;
  const positions   = new Float32Array(PARTICLE_COUNT * 3);
  const colors      = new Float32Array(PARTICLE_COUNT * 3);
  const sizes       = new Float32Array(PARTICLE_COUNT);
  const speeds      = new Float32Array(PARTICLE_COUNT);

  const colA = new THREE.Color(0x7b61ff); // accent purple
  const colB = new THREE.Color(0x22d3ee); // cyan
  const colC = new THREE.Color(0xf0f0fa); // near-white

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 120;
    positions[i3 + 1] = (Math.random() - 0.5) * 80;
    positions[i3 + 2] = (Math.random() - 0.5) * 60;

    sizes[i]  = Math.random() * 1.5 + 0.3;
    speeds[i] = Math.random() * 0.4 + 0.1;

    const mix = Math.random();
    let c;
    if (mix < 0.4)      c = colA;
    else if (mix < 0.7) c = colB;
    else                c = colC;

    colors[i3]     = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position',  new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color',     new THREE.BufferAttribute(colors,    3));
  pGeo.setAttribute('size',      new THREE.BufferAttribute(sizes,     1));

  const pMat = new THREE.PointsMaterial({
    size:         0.35,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity:      0.65,
    depthWrite:   false,
  });

  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ── Floating wireframe geometry ───────────────────────────────────────
  function makeWireframe(geometry, color, x, y, z, scale) {
    const mat = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    mesh.scale.setScalar(scale);
    scene.add(mesh);
    return mesh;
  }

  const icosa  = makeWireframe(new THREE.IcosahedronGeometry(6, 1),  0x7b61ff, -20,  8, -10, 1);
  const torus  = makeWireframe(new THREE.TorusGeometry(5, 2, 16, 60), 0x22d3ee,  18, -6, -15, 1);
  const octa   = makeWireframe(new THREE.OctahedronGeometry(5),       0xa78bfa,   0, -14,  -8, 1);

  // ── Grid floor ────────────────────────────────────────────────────────
  const gridHelper = new THREE.GridHelper(160, 40, 0x1a1a30, 0x1a1a30);
  gridHelper.position.y = -22;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.4;
  scene.add(gridHelper);

  // ── Connection lines between nearby particles ─────────────────────────
  const linePositions = [];
  const lineColors    = [];
  const maxDist = 12;
  const sample  = 300; // subset for perf

  for (let i = 0; i < sample; i++) {
    const i3 = i * 3;
    for (let j = i + 1; j < sample; j++) {
      const j3 = j * 3;
      const dx = positions[i3]     - positions[j3];
      const dy = positions[i3 + 1] - positions[j3 + 1];
      const dz = positions[i3 + 2] - positions[j3 + 2];
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (dist < maxDist) {
        linePositions.push(
          positions[i3], positions[i3+1], positions[i3+2],
          positions[j3], positions[j3+1], positions[j3+2]
        );
        const alpha = 1 - dist / maxDist;
        lineColors.push(0.48*alpha, 0.38*alpha, 1*alpha, 0.48*alpha, 0.38*alpha, 1*alpha);
      }
    }
  }

  if (linePositions.length > 0) {
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lGeo.setAttribute('color',    new THREE.Float32BufferAttribute(lineColors,    3));
    const lMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.15 });
    scene.add(new THREE.LineSegments(lGeo, lMat));
  }

  // ── Mouse parallax ────────────────────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / innerHeight - 0.5) * 2;
  });

  // ── Resize ────────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  // ── Scroll parallax ───────────────────────────────────────────────────
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  // ── Animate ───────────────────────────────────────────────────────────
  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    // Camera gentle sway
    camera.position.x = targetX * 4;
    camera.position.y = -targetY * 2 - scrollY * 0.004;
    camera.lookAt(0, -scrollY * 0.004, 0);

    // Rotate particle field slowly
    particles.rotation.y = time * 0.06;
    particles.rotation.x = time * 0.02;

    // Breathe the geometry
    icosa.rotation.x = time * 0.3;
    icosa.rotation.y = time * 0.5;
    icosa.scale.setScalar(1 + Math.sin(time * 0.8) * 0.08);

    torus.rotation.x = time * 0.4;
    torus.rotation.z = time * 0.2;

    octa.rotation.y  = time * 0.6;
    octa.rotation.z  = time * 0.3;

    // Pulse grid opacity
    gridHelper.material.opacity = 0.15 + Math.sin(time * 0.5) * 0.08;

    renderer.render(scene, camera);
  }

  animate();
})();
