/**
 * RGPV UNOFFICIAL — DESKTOP LUXURY CONTEXTUAL CURSOR
 * Silky-smooth spring cursor with micro-labels for product previews & barter trades.
 * Automatically disabled on touch screens and prefers-reduced-motion.
 */

(function () {
  'use strict';

  // Only run on fine-pointer devices and when motion is allowed
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!isFinePointer || prefersReduced) return;

  function initCursor() {
    let cursorEl = document.getElementById('custom-cursor');
    if (!cursorEl) {
      cursorEl = document.createElement('div');
      cursorEl.id = 'custom-cursor';
      cursorEl.className = 'custom-cursor';
      cursorEl.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"><span class="cursor-label"></span></div>';
      document.body.appendChild(cursorEl);
    }

    const dot = cursorEl.querySelector('.cursor-dot');
    const ring = cursorEl.querySelector('.cursor-ring');
    const label = cursorEl.querySelector('.cursor-label');

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursorEl.classList.add('visible');
        ringX = mouseX;
        ringY = mouseY;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursorEl.classList.remove('visible');
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      cursorEl.classList.add('visible');
    });

    // Spring loop for ring
    function render() {
      if (isVisible) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // Event delegation for contextual hover states
    document.addEventListener('mouseover', (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      const productCard = target.closest('.product-card, .listing-card');
      const barterTrigger = target.closest('.trade-node, [data-pillar="exchange"], .btn-barter');
      const interactive = target.closest('a, button, .btn, .nav-item, input, select, textarea, .stat-cell, .hero-search-bar');

      if (productCard) {
        cursorEl.classList.add('cursor-product');
        cursorEl.classList.remove('cursor-barter', 'cursor-hover');
        label.textContent = 'VIEW →';
      } else if (barterTrigger) {
        cursorEl.classList.add('cursor-barter');
        cursorEl.classList.remove('cursor-product', 'cursor-hover');
        label.textContent = 'TRADE ⇄';
      } else if (interactive) {
        cursorEl.classList.add('cursor-hover');
        cursorEl.classList.remove('cursor-product', 'cursor-barter');
        label.textContent = '';
      } else {
        cursorEl.classList.remove('cursor-hover', 'cursor-product', 'cursor-barter');
        label.textContent = '';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
  } else {
    initCursor();
  }
})();
