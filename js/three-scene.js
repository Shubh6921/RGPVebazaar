/**
 * RGPV UNOFFICIAL — 3D HERO VISUAL SCULPTURE
 * Procedural Three.js scene featuring a multifaceted obsidian gemstone,
 * triple orbital barter rings, and ambient floating stardust motes.
 * Features: Mouse-responsive lerp damping, IntersectionObserver auto-pause,
 * and elegant 2D fallback for reduced motion / low-spec devices.
 */

(function () {
  'use strict';

  function initHero3D() {
    const container = document.getElementById('hero-3d-container');
    if (!container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof THREE === 'undefined') {
      renderFallback(container);
      return;
    }

    try {
      // Scene setup
      const scene = new THREE.Scene();
      const width = container.clientWidth || 540;
      const height = container.clientHeight || 520;

      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
      camera.position.z = 10.5;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      // Clear container and append canvas
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      // Crimson rim light
      const crimsonLight = new THREE.PointLight(0xe02438, 3.5, 30);
      crimsonLight.position.set(-6, -4, 4);
      scene.add(crimsonLight);

      // Champagne gold specular light
      const goldLight = new THREE.PointLight(0xc5a880, 2.8, 30);
      goldLight.position.set(6, 6, 5);
      scene.add(goldLight);

      // Top soft fill
      const topLight = new THREE.DirectionalLight(0xfaf7f2, 1.2);
      topLight.position.set(0, 8, 4);
      scene.add(topLight);

      // Root group for mouse rotation
      const heroGroup = new THREE.Group();
      scene.add(heroGroup);

      // 1. Central Faceted Crystal Core (Obsidian with subtle reflections)
      const coreGeo = new THREE.IcosahedronGeometry(2.1, 1);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x111116,
        metalness: 0.88,
        roughness: 0.18,
        flatShading: true,
        envMapIntensity: 1.0
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      heroGroup.add(coreMesh);

      // 1b. Inner glowing wireframe lattice
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xe02438,
        wireframe: true,
        transparent: true,
        opacity: 0.28
      });
      const wireMesh = new THREE.Mesh(coreGeo, wireMat);
      wireMesh.scale.set(1.02, 1.02, 1.02);
      heroGroup.add(wireMesh);

      // 2. Triple Luxury Orbital Rings
      // Ring 1: Crimson primary ring (inclined)
      const ring1Geo = new THREE.TorusGeometry(3.5, 0.038, 16, 120);
      const ring1Mat = new THREE.MeshStandardMaterial({
        color: 0xc9182b,
        metalness: 0.9,
        roughness: 0.15,
        emissive: 0x5a000d,
        emissiveIntensity: 0.5
      });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1.rotation.x = Math.PI * 0.32;
      ring1.rotation.y = Math.PI * 0.18;
      heroGroup.add(ring1);

      // Ring 2: Champagne gold secondary ring (counter-inclined)
      const ring2Geo = new THREE.TorusGeometry(4.1, 0.03, 16, 120);
      const ring2Mat = new THREE.MeshStandardMaterial({
        color: 0xc5a880,
        metalness: 0.95,
        roughness: 0.1,
        emissive: 0x3d2d14,
        emissiveIntensity: 0.4
      });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = -Math.PI * 0.28;
      ring2.rotation.z = Math.PI * 0.25;
      heroGroup.add(ring2);

      // Ring 3: Platinum hairline ring
      const ring3Geo = new THREE.TorusGeometry(2.9, 0.022, 16, 120);
      const ring3Mat = new THREE.MeshStandardMaterial({
        color: 0xfaf7f2,
        metalness: 0.7,
        roughness: 0.2,
        transparent: true,
        opacity: 0.65
      });
      const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
      ring3.rotation.y = Math.PI * 0.45;
      heroGroup.add(ring3);

      // 3. Orbital Satellite Nodes on Rings
      const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const nodeCrimsonMat = new THREE.MeshBasicMaterial({ color: 0xff3b4e });
      const nodeGoldMat = new THREE.MeshBasicMaterial({ color: 0xf3c969 });

      const sat1 = new THREE.Mesh(nodeGeo, nodeCrimsonMat);
      const sat2 = new THREE.Mesh(nodeGeo, nodeGoldMat);
      scene.add(sat1);
      scene.add(sat2);

      // 4. Ambient Floating Stardust Particles
      const particleCount = 75;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorPalette = [
        new THREE.Color(0xfaf7f2), // Ivory
        new THREE.Color(0xe02438), // Crimson
        new THREE.Color(0xc5a880)  // Champagne
      ];

      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const radius = 4.5 + Math.random() * 4.0;

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        const chosen = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = chosen.r;
        colors[i * 3 + 1] = chosen.g;
        colors[i * 3 + 2] = chosen.b;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.07,
        vertexColors: true,
        transparent: true,
        opacity: 0.75
      });
      const particleCloud = new THREE.Points(particleGeo, particleMat);
      heroGroup.add(particleCloud);

      // Mouse & Pointer Inertia
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      function onMouseMove(e) {
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetX = normX * 0.45;
        targetY = normY * 0.35;
      }

      window.addEventListener('mousemove', onMouseMove, { passive: true });

      // Resize Handler
      function onResize() {
        const w = container.clientWidth || 540;
        const h = container.clientHeight || 520;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
      window.addEventListener('resize', onResize, { passive: true });

      // Animation Loop with Visibility Control
      let isVisible = true;
      let animationFrameId = null;
      let clock = new THREE.Clock();

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animationFrameId) {
            clock.start();
            animate();
          }
        });
      }, { threshold: 0.1 });

      observer.observe(container);

      function animate() {
        if (!isVisible) {
          animationFrameId = null;
          return;
        }

        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse damping
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        // Core gem rotation
        coreMesh.rotation.x = elapsedTime * 0.22 + mouseY * 0.8;
        coreMesh.rotation.y = elapsedTime * 0.28 + mouseX * 0.8;
        wireMesh.rotation.x = coreMesh.rotation.x;
        wireMesh.rotation.y = coreMesh.rotation.y;

        // Orbital rings slow precession
        ring1.rotation.z = elapsedTime * 0.35;
        ring2.rotation.y = -elapsedTime * 0.28;
        ring3.rotation.x = elapsedTime * 0.18;

        // Satellites motion along orbits
        const satAngle1 = elapsedTime * 0.7;
        sat1.position.set(
          Math.cos(satAngle1) * 3.5,
          Math.sin(satAngle1) * 3.5 * Math.sin(Math.PI * 0.32),
          Math.sin(satAngle1) * 3.5 * Math.cos(Math.PI * 0.32)
        );

        const satAngle2 = -elapsedTime * 0.55;
        sat2.position.set(
          Math.cos(satAngle2) * 4.1,
          Math.sin(satAngle2) * 4.1 * Math.cos(Math.PI * 0.28),
          Math.sin(satAngle2) * 4.1 * Math.sin(Math.PI * 0.28)
        );

        // Stardust slow drift
        particleCloud.rotation.y = elapsedTime * 0.06;
        particleCloud.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;

        // Group gentle floating wave
        heroGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.12;
        heroGroup.rotation.y = mouseX * 0.4;
        heroGroup.rotation.x = -mouseY * 0.4;

        renderer.render(scene, camera);
      }

      animate();

    } catch (err) {
      console.warn('Three.js initialization notice:', err);
      renderFallback(container);
    }
  }

  function renderFallback(container) {
    container.innerHTML = `
      <div class="hero-3d-fallback" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; position:relative;">
        <svg viewBox="0 0 400 400" width="380" height="380" style="filter: drop-shadow(0 0 30px rgba(224, 36, 56, 0.25));">
          <defs>
            <linearGradient id="fallbackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FAF7F2" stop-opacity="0.9"/>
              <stop offset="50%" stop-color="#E02438" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#C5A880" stop-opacity="0.85"/>
            </linearGradient>
            <radialGradient id="fallbackGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#E02438" stop-opacity="0.2"/>
              <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="160" fill="url(#fallbackGlow)" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(250,247,242,0.12)" stroke-width="1" stroke-dasharray="4 6"/>
          <ellipse cx="200" cy="200" rx="130" ry="50" fill="none" stroke="#E02438" stroke-width="1.5" transform="rotate(-30 200 200)"/>
          <ellipse cx="200" cy="200" rx="145" ry="60" fill="none" stroke="#C5A880" stroke-width="1.5" transform="rotate(45 200 200)"/>
          <polygon points="200,90 280,150 260,250 140,250 120,150" fill="#111116" stroke="url(#fallbackGrad)" stroke-width="2" />
          <polygon points="200,90 260,250 140,250" fill="none" stroke="rgba(224,36,56,0.35)" stroke-width="1" />
          <circle cx="200" cy="200" r="4" fill="#FAF7F2"/>
        </svg>
      </div>
    `;
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero3D);
  } else {
    initHero3D();
  }
})();
