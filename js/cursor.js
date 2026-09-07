/**
 * ==========================================================================
 * RGPVEBAZAAR — CLASSIC TRENDY CURSOR MOVEMENT ANIMATION
 * Visual Direction: Luxury Modern Campus Commerce & Fluid Interactive Motion
 * Features:
 *  - Precision 6px ruby core dot (zero latency)
 *  - Concentric 34px follower ring with smooth LERP physics
 *  - Dynamic velocity skew (squash & stretch along movement vector)
 *  - Interactive morphing on hover (buttons, links, inputs, cards, chips)
 *  - Click ripple pulse and elastic rebound
 *  - Ethereal luminous stardust particle trail on rapid movement
 *  - Automatic touch/mobile exclusion & prefers-reduced-motion fallback
 * ==========================================================================
 */

(function () {
  'use strict';

  // Safeguard: Check if device supports fine pointer (mouse/trackpad) and not reduced motion
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!hasFinePointer) {
    // Touch/mobile device: retain standard native touch experience completely
    return;
  }

  // Create DOM Elements if not already present
  function createCursorDOM() {
    if (document.getElementById('custom-cursor-root')) return;

    const root = document.createElement('div');
    root.id = 'custom-cursor-root';
    root.className = 'custom-cursor-root';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = `
      <div id="custom-cursor-dot" class="cursor-dot"></div>
      <div id="custom-cursor-ring" class="cursor-ring">
        <div class="cursor-ring-inner"></div>
      </div>
      <div id="custom-cursor-particles" class="cursor-particles-container"></div>
    `;
    document.body.appendChild(root);
  }

  function initCursor() {
    createCursorDOM();

    const root = document.getElementById('custom-cursor-root');
    const dot = document.getElementById('custom-cursor-dot');
    const ring = document.getElementById('custom-cursor-ring');
    const particlesContainer = document.getElementById('custom-cursor-particles');

    if (!root || !dot || !ring) return;

    // Coordinate & Physics State
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let prevRingX = mouseX;
    let prevRingY = mouseY;

    let isVisible = false;
    let isHovering = false;
    let isClicking = false;
    let isTextInput = false;
    let hoverScale = 1;
    let targetRotation = 0;
    let currentRotation = 0;
    let currentStretchX = 1;
    let currentStretchY = 1;

    // Particle tracking
    let lastParticleTime = 0;
    const particlePool = [];
    const MAX_PARTICLES = 14;

    // Activate body styling
    document.body.classList.add('has-custom-cursor');

    // Pointer move listener with high responsiveness
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;

      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        root.classList.add('is-visible');
        // Instantly position ring on first move to prevent flying in from corner
        ringX = mouseX;
        ringY = mouseY;
        prevRingX = mouseX;
        prevRingY = mouseY;
      }

      // Dot moves instantly with zero latency
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      // Spawn ethereal spark particles during rapid movement
      const now = performance.now();
      if (!prefersReduced && now - lastParticleTime > 42) {
        const dist = Math.hypot(mouseX - ringX, mouseY - ringY);
        if (dist > 14) {
          spawnParticle(mouseX, mouseY);
          lastParticleTime = now;
        }
      }
    }, { passive: true });

    // Window boundary handlers
    document.addEventListener('mouseleave', function () {
      isVisible = false;
      root.classList.remove('is-visible');
    });

    document.addEventListener('mouseenter', function () {
      isVisible = true;
      root.classList.add('is-visible');
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        isVisible = false;
        root.classList.remove('is-visible');
      }
    });

    // Mousedown & Mouseup (Click pulse & ripple)
    window.addEventListener('mousedown', function (e) {
      if (e.pointerType === 'touch') return;
      isClicking = true;
      root.classList.add('is-clicking');
      createClickRipple(mouseX, mouseY);
    });

    window.addEventListener('mouseup', function () {
      isClicking = false;
      root.classList.remove('is-clicking');
    });

    // Delegated Hover Detection for interactive elements
    const INTERACTIVE_SELECTOR = [
      'a',
      'button',
      '.btn',
      '[role="button"]',
      'input:not([type="hidden"])',
      'select',
      'textarea',
      '.brand-wrapper',
      '.nav-item',
      '.role-switcher-select',
      '.market-card',
      '.resource-card',
      '.hero-chip',
      '.auth-switch-btn',
      '.toast-close',
      '.btn-enroll-chip',
      '.club-card',
      '.event-card',
      'label',
      '[data-clickable="true"]'
    ].join(', ');

    const TEXT_INPUT_SELECTOR = 'input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="number"], textarea';

    document.addEventListener('mouseover', function (e) {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      const interactive = target.closest(INTERACTIVE_SELECTOR);
      if (interactive) {
        isHovering = true;
        root.classList.add('is-hovering');

        // Check if text input
        if (target.closest(TEXT_INPUT_SELECTOR)) {
          isTextInput = true;
          root.classList.add('is-text-input');
          hoverScale = 0.6;
        } else {
          isTextInput = false;
          root.classList.remove('is-text-input');

          // Large hover state for cards vs standard buttons
          if (interactive.closest('.market-card, .resource-card, .club-card, .event-card')) {
            hoverScale = 2.1;
            root.classList.add('is-card-hover');
          } else {
            hoverScale = 1.65;
            root.classList.remove('is-card-hover');
          }
        }
      }
    }, { passive: true });

    document.addEventListener('mouseout', function (e) {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      const interactive = target.closest(INTERACTIVE_SELECTOR);
      if (interactive) {
        const related = e.relatedTarget;
        if (related && related instanceof Element && related.closest(INTERACTIVE_SELECTOR)) {
          // Moved between interactive elements, update text state if needed
          if (related.closest(TEXT_INPUT_SELECTOR)) {
            isTextInput = true;
            root.classList.add('is-text-input');
            hoverScale = 0.6;
          } else {
            isTextInput = false;
            root.classList.remove('is-text-input');
            hoverScale = related.closest('.market-card, .resource-card, .club-card, .event-card') ? 2.1 : 1.65;
          }
          return;
        }

        isHovering = false;
        isTextInput = false;
        hoverScale = 1;
        root.classList.remove('is-hovering', 'is-text-input', 'is-card-hover');
      }
    }, { passive: true });

    // Click Ripple Generator
    function createClickRipple(x, y) {
      if (prefersReduced) return;

      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      particlesContainer.appendChild(ripple);

      // Clean up after animation finishes
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 500);
    }

    // Ethereal Particle Spawner
    function spawnParticle(x, y) {
      if (prefersReduced) return;

      // Recycle or create new particle element
      let particle;
      if (particlePool.length < MAX_PARTICLES) {
        particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particlesContainer.appendChild(particle);
        particlePool.push(particle);
      } else {
        particle = particlePool.shift();
        particlePool.push(particle);
      }

      // Add gentle random dispersion
      const offsetX = (Math.random() - 0.5) * 12;
      const offsetY = (Math.random() - 0.5) * 12;
      const pX = x + offsetX;
      const pY = y + offsetY;
      const size = (Math.random() * 3 + 2.5).toFixed(1);

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.opacity = '0.75';
      particle.style.transform = `translate3d(${pX}px, ${pY}px, 0) scale(1)`;

      // Quick smooth fade out
      requestAnimationFrame(() => {
        particle.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease-out';
        particle.style.transform = `translate3d(${pX + (Math.random() - 0.5) * 10}px, ${pY + (Math.random() - 0.5) * 10}px, 0) scale(0.2)`;
        particle.style.opacity = '0';
      });
    }

    // Main 60/120 FPS Physics Animation Loop (LERP + Squash & Stretch)
    function renderPhysics() {
      if (isVisible) {
        // LERP ease factor: 0.16 provides buttery-smooth trailing glide
        const ease = prefersReduced ? 1 : 0.16;
        ringX += (mouseX - ringX) * ease;
        ringY += (mouseY - ringY) * ease;

        // Velocity computation
        const deltaX = ringX - prevRingX;
        const deltaY = ringY - prevRingY;
        prevRingX = ringX;
        prevRingY = ringY;

        const velocity = Math.min(Math.hypot(deltaX, deltaY), 80);

        if (!prefersReduced) {
          // Dynamic angle of motion
          if (velocity > 0.8) {
            targetRotation = Math.atan2(deltaY, deltaX);
          }

          // Smooth rotation transition
          currentRotation += (targetRotation - currentRotation) * 0.2;

          // Squash & stretch: stretch in direction of motion, squeeze perpendicular
          const stretchFactor = Math.min(velocity * 0.007, 0.45);
          const targetStretchX = (isHovering ? hoverScale : 1) * (1 + stretchFactor);
          const targetStretchY = (isHovering ? hoverScale : 1) * (1 - stretchFactor * 0.4);

          currentStretchX += (targetStretchX - currentStretchX) * 0.2;
          currentStretchY += (targetStretchY - currentStretchY) * 0.2;

          if (isClicking) {
            currentStretchX *= 0.76;
            currentStretchY *= 0.76;
          }

          const angleDeg = currentRotation * (180 / Math.PI);
          ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) rotate(${angleDeg}deg) scale(${currentStretchX.toFixed(3)}, ${currentStretchY.toFixed(3)})`;
        } else {
          // Reduced motion: simple translate without deformation or rotation
          const currentScale = isClicking ? 0.8 : (isHovering ? hoverScale : 1);
          ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${currentScale})`;
        }
      }

      requestAnimationFrame(renderPhysics);
    }

    // Kick off animation loop
    requestAnimationFrame(renderPhysics);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
  } else {
    initCursor();
  }
})();
