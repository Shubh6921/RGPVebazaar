/**
 * RGPV UNOFFICIAL — LUXURY COMMAND PALETTE (⌘K / Ctrl+K)
 * Fast, instant modal search across Marketplace, Academic Vault,
 * Opportunities, and quick campus navigation.
 */

(function () {
  'use strict';

  function initCommandPalette() {
    let paletteEl = document.getElementById('modal-command-palette');
    if (!paletteEl) {
      paletteEl = document.createElement('div');
      paletteEl.id = 'modal-command-palette';
      paletteEl.className = 'palette-overlay';
      paletteEl.innerHTML = `
        <div class="palette-backdrop" onclick="window.closeCommandPalette()"></div>
        <div class="palette-container">
          <div class="palette-search-header">
            <svg class="palette-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="palette-search-input" class="palette-input" placeholder="Search textbooks, Casio fx-991EX, PYQs, clubs, or jump to..." autocomplete="off">
            <div class="palette-close-badge" onclick="window.closeCommandPalette()">ESC</div>
          </div>
          <div class="palette-results" id="palette-results-list">
            <!-- Dynamically populated -->
          </div>
          <div class="palette-footer">
            <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
            <span><kbd>↵</kbd> to select</span>
            <span><kbd>ESC</kbd> to close</span>
          </div>
        </div>
      `;
      document.body.appendChild(paletteEl);
    }

    const input = document.getElementById('palette-search-input');
    const resultsContainer = document.getElementById('palette-results-list');
    let selectedIndex = 0;
    let currentResults = [];

    window.openCommandPalette = function () {
      paletteEl.classList.add('active');
      document.body.classList.add('modal-open');
      input.value = '';
      renderPaletteResults('');
      setTimeout(() => input.focus(), 50);
    };

    window.closeCommandPalette = function () {
      paletteEl.classList.remove('active');
      document.body.classList.remove('modal-open');
    };

    // Keyboard shortcut listeners
    window.addEventListener('keydown', (e) => {
      // ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (paletteEl.classList.contains('active')) {
          window.closeCommandPalette();
        } else {
          window.openCommandPalette();
        }
      }

      // Escape key to close
      if (e.key === 'Escape' && paletteEl.classList.contains('active')) {
        e.preventDefault();
        window.closeCommandPalette();
      }

      // Arrow navigation inside palette
      if (paletteEl.classList.contains('active')) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (currentResults.length > 0) {
            selectedIndex = (selectedIndex + 1) % currentResults.length;
            updateSelection();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (currentResults.length > 0) {
            selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length;
            updateSelection();
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (currentResults[selectedIndex]) {
            currentResults[selectedIndex].action();
            window.closeCommandPalette();
          }
        }
      }
    });

    input.addEventListener('input', (e) => {
      renderPaletteResults(e.target.value.trim().toLowerCase());
    });

    function renderPaletteResults(query) {
      selectedIndex = 0;
      currentResults = [];

      const quickRoutes = [
        { title: 'Marketplace — Buy, Sell & Barter', type: 'Navigate', route: 'marketplace', icon: '🛍️' },
        { title: 'Academic Vault — Notes, PYQs & Syllabi', type: 'Navigate', route: 'resources', icon: '📚' },
        { title: 'Campus Opportunities & Hackathons', type: 'Navigate', route: 'opportunities', icon: '⚡' },
        { title: 'Student Profile & Verification', type: 'Navigate', route: 'profile', icon: '🎓' },
        { title: 'Campus Chat & Trade Meetups', type: 'Navigate', route: 'chat', icon: '💬' }
      ];

      // Add route matches
      quickRoutes.forEach(r => {
        if (!query || r.title.toLowerCase().includes(query)) {
          currentResults.push({
            title: r.title,
            category: r.type,
            icon: r.icon,
            badge: 'Route',
            action: () => window.navigateTo(r.route)
          });
        }
      });

      if (window.Store && window.Store.state) {
        // Listings match
        (window.Store.state.listings || []).forEach(item => {
          if (!query || item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)) {
            currentResults.push({
              title: item.title,
              category: `Marketplace · ₹${item.price}`,
              icon: '📦',
              badge: item.listingType.toUpperCase(),
              action: () => {
                window.navigateTo('marketplace');
                if (window.openProductDetailModal) window.openProductDetailModal(item.id);
              }
            });
          }
        });

        // Resources match
        (window.Store.state.resources || []).forEach(res => {
          if (!query || res.title.toLowerCase().includes(query) || (res.subject && res.subject.toLowerCase().includes(query))) {
            currentResults.push({
              title: res.title,
              category: `Academic Vault · ${res.branchCode || 'CSE'}`,
              icon: '📄',
              badge: 'PDF',
              action: () => {
                window.navigateTo('resources');
                if (window.openResourceDetailModal) window.openResourceDetailModal(res.id);
              }
            });
          }
        });

        // Opportunities match
        (window.Store.state.opportunities || []).forEach(opp => {
          if (!query || opp.title.toLowerCase().includes(query) || opp.organization.toLowerCase().includes(query)) {
            currentResults.push({
              title: opp.title,
              category: `Opportunity · ${opp.organization}`,
              icon: '🏆',
              badge: opp.category,
              action: () => {
                window.navigateTo('opportunities');
                if (window.openOppDetailModal) window.openOppDetailModal(opp.id);
              }
            });
          }
        });
      }

      // Limit results
      const displayItems = currentResults.slice(0, 8);
      currentResults = displayItems;

      if (displayItems.length === 0) {
        resultsContainer.innerHTML = `
          <div class="palette-empty-state">
            <p>No matches found for "<strong>${query}</strong>"</p>
            <span style="font-size:0.8rem; color:var(--text-tertiary);">Try searching "Casio", "Maths", "Notes", or "Barter"</span>
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = displayItems.map((item, idx) => `
        <div class="palette-item ${idx === 0 ? 'selected' : ''}" data-index="${idx}">
          <span class="palette-item-icon">${item.icon}</span>
          <div class="palette-item-content">
            <div class="palette-item-title">${item.title}</div>
            <div class="palette-item-subtitle">${item.category}</div>
          </div>
          <span class="palette-item-badge">${item.badge}</span>
        </div>
      `).join('');

      // Add click handlers
      resultsContainer.querySelectorAll('.palette-item').forEach(el => {
        el.addEventListener('click', () => {
          const index = parseInt(el.getAttribute('data-index'), 10);
          if (currentResults[index]) {
            currentResults[index].action();
            window.closeCommandPalette();
          }
        });
      });
    }

    function updateSelection() {
      const items = resultsContainer.querySelectorAll('.palette-item');
      items.forEach((item, idx) => {
        if (idx === selectedIndex) {
          item.classList.add('selected');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('selected');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommandPalette);
  } else {
    initCommandPalette();
  }
})();
