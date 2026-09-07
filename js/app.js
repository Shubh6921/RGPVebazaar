/**
 * RGPVEBAZAAR — Main Application Router, Controller & UI Renderer
 * Visual Direction: Luxury Modern Campus Commerce & Academic Ecosystem
 */
(function () {
  'use strict';

  // Hero Quick Search & Category Helper Handlers
  window.handleHeroSearch = function() {
    const input = document.getElementById('hero-quick-search-input');
    const val = input ? input.value.trim() : '';
    navigate('marketplace');
    setTimeout(() => {
      const marketInput = document.getElementById('market-search-input');
      if (marketInput) {
        marketInput.value = val;
        marketInput.focus();
        marketInput.dispatchEvent(new Event('input'));
      }
    }, 60);
  };

  window.quickSearchCategory = function(keyword) {
    navigate('marketplace');
    setTimeout(() => {
      const marketInput = document.getElementById('market-search-input');
      if (marketInput) {
        marketInput.value = keyword;
        marketInput.focus();
        marketInput.dispatchEvent(new Event('input'));
      }
    }, 60);
  };

  // SVG Icon Templates
  const ICONS = {
    check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    chevronRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
    heart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    heartFilled: `<svg width="16" height="16" viewBox="0 0 24 24" fill="#B51218" stroke="#B51218" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    mapPin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    swap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>`,
    externalLink: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
    fileText: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    download: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    user: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    bell: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`
  };

  // Active state filters
  let currentRoute = 'landing';
  let marketFilterType = 'all';
  let marketCategory = 'all';
  let marketCondition = 'all';
  let marketLocation = 'all';
  let marketSort = 'newest';
  let marketSearch = '';

  let resourceBranch = 'all';
  let resourceSemester = 'all';
  let resourceType = 'all';
  let resourceSearch = '';

  let oppTab = 'discover'; // discover, clubs, saved
  let oppFilterCategory = 'all';
  let oppSearch = '';

  let activeChatConversationId = 'conv-shubham';
  let activeProductModalItem = null;
  let activeResourceModalItem = null;

  // Temp holder for verification flow
  let verifyStepData = {
    enrollment: '',
    student: null,
    phone: ''
  };

  // Toast Helper
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `${ICONS.check} <span>${msg}</span>`;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  // Campus Toast Helper
  function showCampusToast(msg, type = 'info') {
    const container = document.getElementById('campus-toast-container') || document.getElementById('toast-container');
    if (!container) return alert(msg);
    const toast = document.createElement('div');
    toast.className = `campus-toast ${type}`;
    const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : (type === 'warning' ? '⚠️' : 'ℹ️'));
    toast.innerHTML = `<span style="font-weight:700; font-size:1.1rem; line-height:1;">${icon}</span><div>${msg}</div>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // Route history stack
  let routeHistory = [];

  // Router
  function navigate(route, param = null, pushHistory = true) {
    const user = window.Store.state.currentUser;
    const role = (user && user.role) ? user.role : 'STUDENT';

    // Strict Role-Based Route Guards
    if (route === 'club-admin' && role !== 'CLUB_PRESIDENT' && role !== 'SUPER_ADMIN') {
      showCampusToast('Access Denied: Only verified Club Presidents or Campus Administrators can access this console.', 'error');
      navigate('home', null, false);
      return;
    }

    if (route === 'admin' && role !== 'SUPER_ADMIN') {
      showCampusToast('Access Denied: Restricted to Campus Super Administrators.', 'error');
      navigate('home', null, false);
      return;
    }

    if (pushHistory && currentRoute && currentRoute !== route) {
      routeHistory.push(currentRoute);
      try {
        window.history.pushState({ route, param }, '', '#' + route);
      } catch (e) {}
    }
    currentRoute = route;

    // Hide all views
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));

    // Highlight active nav links
    document.querySelectorAll('[data-route]').forEach(btn => {
      if (btn.getAttribute('data-route') === route) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const targetView = document.getElementById(`view-${route}`);
    if (targetView) {
      targetView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // View specific initialization
    if (route === 'home') renderHome();
    if (route === 'marketplace') renderMarketplace();
    if (route === 'resources') renderResources();
    if (route === 'opportunities') renderOpportunities();
    if (route === 'profile') renderProfile();
    if (route === 'chat') renderChat(param || activeChatConversationId);
    if (route === 'verify') initVerifyFlow();
    if (route === 'events') renderEvents();
    if (route === 'clubs') renderClubs();
    if (route === 'club-admin') renderClubAdmin();
    if (route === 'admin') renderAdmin();
  }

  // Global Go Back function
  window.goBack = () => {
    // If inside verification flow, check active step
    if (currentRoute === 'verify') {
      const step3 = document.getElementById('verify-step-3');
      const step2 = document.getElementById('verify-step-2');
      const stepSuccess = document.getElementById('verify-step-success');

      if (stepSuccess && stepSuccess.classList.contains('active')) {
        navigate('home', null, false);
        return;
      }
      if (step3 && step3.classList.contains('active')) {
        goToVerifyStep(2);
        return;
      }
      if (step2 && step2.classList.contains('active')) {
        goToVerifyStep(1);
        return;
      }
    }

    // If modal is open, close modal
    const openModal = document.querySelector('.campus-modal-overlay.open, .modal-overlay.active');
    if (openModal) {
      openModal.classList.remove('open');
      openModal.classList.remove('active');
      return;
    }

    // Default fallback to history stack or landing
    if (routeHistory.length > 0) {
      const prev = routeHistory.pop();
      navigate(prev, null, false);
    } else {
      navigate('landing', null, false);
    }
  };

  // Browser back/forward button support
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.route) {
      navigate(e.state.route, e.state.param, false);
    } else {
      window.goBack();
    }
  });

  // Expose router globally
  window.navigateTo = navigate;

  // =========================================================================
  // NAVBAR & PROFILE SYNC
  // =========================================================================
  function syncNavHeader() {
    const user = window.Store.state.currentUser;
    const profileBtn = document.getElementById('nav-profile-btn');
    const guestActions = document.getElementById('nav-guest-actions');
    const userChip = document.getElementById('nav-user-chip');
    const clubAdminLink = document.getElementById('nav-item-club-admin');
    const superAdminLink = document.getElementById('nav-item-super-admin');
    const devRoleSelector = document.getElementById('dev-role-selector');
    const userRoleBadge = document.getElementById('nav-user-role-badge');

    const role = (user && user.role) ? user.role : 'STUDENT';

    if (clubAdminLink) {
      clubAdminLink.style.display = (role === 'CLUB_PRESIDENT' || role === 'SUPER_ADMIN') ? 'inline-flex' : 'none';
    }
    if (superAdminLink) {
      superAdminLink.style.display = (role === 'SUPER_ADMIN') ? 'inline-flex' : 'none';
    }

    if (devRoleSelector) {
      if (role === 'SUPER_ADMIN') {
        devRoleSelector.value = 'SUPER_ADMIN';
      } else if (role === 'CLUB_PRESIDENT') {
        devRoleSelector.value = user.assignedClubId === 'robotics-club' ? 'CLUB_PRESIDENT_ROBOTICS' : 'CLUB_PRESIDENT_CODING';
      } else {
        devRoleSelector.value = 'STUDENT';
      }
    }

    if (user && user.isVerified) {
      if (guestActions) guestActions.style.display = 'none';
      if (userChip) {
        userChip.style.display = 'flex';
        document.getElementById('nav-user-avatar').textContent = user.avatar || (user.name ? user.name.slice(0, 2).toUpperCase() : 'RS');
        document.getElementById('nav-user-name').textContent = (user.name || user.full_name || 'Student').split(' ')[0];
        if (userRoleBadge) {
          if (role === 'SUPER_ADMIN') {
            userRoleBadge.textContent = 'Admin 🏛️';
            userRoleBadge.className = 'badge-status badge-status-rejected';
          } else if (role === 'CLUB_PRESIDENT') {
            userRoleBadge.textContent = 'President 🎖️';
            userRoleBadge.className = 'badge-status badge-status-published';
          } else {
            userRoleBadge.textContent = 'Verified ✓';
            userRoleBadge.className = 'badge-verified';
          }
        }
      }
    } else {
      if (guestActions) guestActions.style.display = 'flex';
      if (userChip) userChip.style.display = 'none';
    }

    // Unread notifications badge
    const unreadCount = (window.Store.state.notifications || []).filter(n => n.unread).length;
    const notifDot = document.getElementById('nav-notif-dot');
    if (notifDot) {
      notifDot.style.display = unreadCount > 0 ? 'block' : 'none';
    }
  }

  // =========================================================================
  // LANDING PAGE RENDER
  // =========================================================================
  function renderLanding() {
    // Floating previews
    const p1 = window.Store.state.listings[0];
    const r1 = window.Store.state.resources[0];
    const o1 = window.Store.state.opportunities[0];

    const previewContainer = document.getElementById('landing-floating-previews');
    if (previewContainer && p1 && r1 && o1) {
      previewContainer.innerHTML = `
        <div class="preview-card-floating offset-left" onclick="window.navigateTo('marketplace')">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
            <span class="badge-tag">Marketplace</span>
            <span class="badge-verified">${ICONS.check} Campus Verified</span>
          </div>
          <div style="display:flex; gap:0.9rem; align-items:center;">
            <img src="${p1.images[0]}" style="width:55px; height:55px; border-radius:8px; object-fit:cover;">
            <div>
              <h5 style="font-size:0.95rem; font-weight:600; line-height:1.2; margin-bottom:0.2rem;">${p1.title}</h5>
              <div style="font-weight:700; color:var(--primary-crimson);">₹${p1.price} <span style="font-weight:400; color:var(--text-secondary); font-size:0.75rem;">· ${p1.meetupLocation}</span></div>
            </div>
          </div>
        </div>

        <div class="preview-card-floating offset-right" onclick="window.navigateTo('resources')">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
            <span class="badge-tag">Academic Resource</span>
            <span style="font-size:0.75rem; color:var(--text-secondary); font-weight:600;">CSE · Semester 3</span>
          </div>
          <div style="display:flex; gap:0.9rem; align-items:center;">
            <div style="width:45px; height:45px; border-radius:8px; background:var(--crimson-subtle); color:var(--primary-crimson); display:flex; align-items:center; justify-content:center;">
              ${ICONS.fileText}
            </div>
            <div>
              <h5 style="font-size:0.95rem; font-weight:600; line-height:1.2; margin-bottom:0.2rem;">${r1.title}</h5>
              <div style="font-size:0.78rem; color:var(--text-secondary);">${r1.pages} pages PDF · By ${r1.uploadedBy.name}</div>
            </div>
          </div>
        </div>

        <div class="preview-card-floating" onclick="window.navigateTo('opportunities')">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
            <span class="badge-tag">${o1.category}</span>
            <span class="opp-deadline-pill">${o1.deadline}</span>
          </div>
          <h5 style="font-size:1.05rem; font-family:var(--font-display); line-height:1.2; margin-bottom:0.3rem;">${o1.title}</h5>
          <div style="font-size:0.8rem; color:var(--text-secondary);">Organized by <strong>${o1.organization}</strong> · ${o1.prize}</div>
        </div>
      `;
    }

    // Four pillars cards click triggers
    document.querySelectorAll('.pillar-card').forEach(card => {
      card.addEventListener('click', () => {
        const pillar = card.getAttribute('data-pillar');
        if (pillar === 'marketplace') navigate('marketplace');
        if (pillar === 'exchange') {
          navigate('marketplace');
          setMarketFilterType('exchange');
        }
        if (pillar === 'resources') navigate('resources');
        if (pillar === 'opportunities') navigate('opportunities');
      });
    });

    // Opportunities feature feed on landing
    const oppFeed = document.getElementById('landing-opp-feed');
    if (oppFeed) {
      oppFeed.innerHTML = window.Store.state.opportunities.slice(0, 3).map(opp => `
        <div class="opp-card">
          <div class="opp-header">
            <span class="badge-tag">${opp.category}</span>
            <span class="opp-deadline-pill">${opp.deadline}</span>
          </div>
          <div class="opp-org-name">${opp.organization}</div>
          <h4 class="opp-title">${opp.title}</h4>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem; line-height:1.45;">${opp.description.substring(0, 105)}...</p>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:var(--text-secondary); border-top:1px solid var(--border-light); padding-top:0.85rem;">
            <span>📅 ${opp.date}</span>
            <button class="btn btn-sm btn-secondary" onclick="window.navigateTo('opportunities')">View Details →</button>
          </div>
        </div>
      `).join('');
    }

    // Marketplace feature preview on landing
    const marketFeed = document.getElementById('landing-marketplace-feed');
    if (marketFeed) {
      marketFeed.innerHTML = window.Store.state.listings.slice(0, 4).map(item => `
        <div class="product-card" onclick="window.openProductDetailModal('${item.id}')">
          <div class="product-image-box">
            <img src="${item.images[0]}" alt="${item.title}">
            <span class="product-type-badge badge-${item.listingType}">${item.listingType}</span>
          </div>
          <div class="product-content">
            <div>
              <h4 class="product-title">${item.title}</h4>
              <div class="product-price-row">
                <span class="product-price">${item.price === 0 ? 'Free' : '₹' + item.price}</span>
                <span class="product-condition">· ${item.condition}</span>
              </div>
            </div>
            <div class="product-card-footer">
              <div class="product-seller-info">
                <span class="badge-verified">${ICONS.check} Verified</span>
                <span class="product-location">${ICONS.mapPin} ${item.meetupLocation}</span>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Academic resources feature preview on landing
    const resFeed = document.getElementById('landing-resources-feed');
    if (resFeed) {
      resFeed.innerHTML = window.Store.state.resources.slice(0, 3).map(res => `
        <div class="resource-card">
          <div>
            <div class="resource-top">
              <div class="resource-file-icon">${ICONS.fileText}</div>
              <span class="badge-tag">${res.resourceType}</span>
            </div>
            <h4 class="resource-title">${res.title}</h4>
            <div class="resource-meta-strip">
              <span>${res.branch}</span>
              <span>·</span>
              <span>Semester ${res.semester}</span>
              <span>·</span>
              <span>${res.pages} pages</span>
            </div>
          </div>
          <div class="resource-footer">
            <span class="badge-verified">${ICONS.check} ${res.uploadedBy.name}</span>
            <button class="btn btn-sm btn-secondary" onclick="window.navigateTo('resources')">View Notes</button>
          </div>
        </div>
      `).join('');
    }
  }

  // =========================================================================
  // VERIFICATION FLOW (/verify)
  // =========================================================================
  function showVerifyError(stepId, message) {
    const el = document.getElementById(stepId);
    if (el) {
      el.textContent = message;
      el.style.display = 'block';
    }
  }

  function clearVerifyErrors() {
    ['verify-step1-error', 'verify-step3-error', 'verify-otp-error'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = '';
        el.style.display = 'none';
      }
    });
  }

  function initVerifyFlow() {
    clearVerifyErrors();
    goToVerifyStep(1);
    const enrollInput = document.getElementById('verify-enrollment-input');
    if (enrollInput) {
      enrollInput.value = '';
      enrollInput.focus();
    }
  }

  function goToVerifyStep(step) {
    clearVerifyErrors();
    document.querySelectorAll('.verify-step').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(`verify-step-${step}`);
    if (target) target.classList.add('active');

    const progressEl = document.getElementById('verify-progress-indicator');
    if (progressEl) {
      progressEl.textContent = `0${step} / 03`;
    }
  }
  window.goToVerifyStep = goToVerifyStep;

  // Clickable test enrollment chips
  document.querySelectorAll('.btn-enroll-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const enroll = chip.getAttribute('data-enroll');
      const input = document.getElementById('verify-enrollment-input');
      if (input && enroll) {
        input.value = enroll;
        clearVerifyErrors();
        input.focus();
      }
    });
  });

  // Handle Step 1 Check Enrollment
  const btnEnrollContinue = document.getElementById('btn-verify-step1');
  const enrollInput = document.getElementById('verify-enrollment-input');

  if (enrollInput) {
    enrollInput.addEventListener('input', () => {
      const errEl = document.getElementById('verify-step1-error');
      if (errEl) errEl.style.display = 'none';
    });
    enrollInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (btnEnrollContinue) btnEnrollContinue.click();
      }
    });
  }

  if (btnEnrollContinue) {
    btnEnrollContinue.addEventListener('click', async () => {
      const input = document.getElementById('verify-enrollment-input');
      const val = (input.value || '').trim().toUpperCase();

      clearVerifyErrors();

      if (!val) {
        showVerifyError('verify-step1-error', 'Please enter your RGPV Enrollment Number (e.g. 0101CS261001).');
        if (input) input.focus();
        return;
      }

      btnEnrollContinue.textContent = 'Verifying...';
      btnEnrollContinue.disabled = true;

      try {
        let lookup = null;
        // 1. Query real Supabase valid_enrollments table / RPC
        if (window.SupaAuth) {
          lookup = await window.SupaAuth.checkEnrollment(val);
        }

        // 2. Fallback to Store roster if Supabase is initializing
        if (!lookup || !lookup.found) {
          const storeLookup = await window.Store.lookupStudentAsync(val);
          if (storeLookup && storeLookup.found) {
            lookup = storeLookup;
          }
        }

        if (!lookup || !lookup.found || !lookup.student || (!lookup.student.name && !lookup.student.full_name)) {
          showVerifyError('verify-step1-error', lookup?.error || 'Unable to retrieve your student record. Please try again.');
          return;
        }

        const studentName = (lookup.student.full_name || lookup.student.name || '').trim();
        if (!studentName || studentName === 'Verified Student') {
          showVerifyError('verify-step1-error', 'Unable to retrieve your student record. Please try again.');
          return;
        }

        verifyStepData.enrollment = val;
        verifyStepData.student = lookup.student;

        // Populate Step 2 confirmation card with real roster data
        document.getElementById('roster-name').textContent = studentName;
        document.getElementById('roster-program').textContent = lookup.student.program || 'B.Tech';
        document.getElementById('roster-branch').textContent = lookup.student.branch || 'Engineering';
        document.getElementById('roster-batch').textContent = lookup.student.batch || '2026–30';
        
        // Masked enrollment
        const masked = lookup.student.maskedEnrollment || (val.length >= 6 ? val.substring(0, val.length - 4) + '****' : val);
        document.getElementById('roster-masked-enrollment').textContent = masked;

        goToVerifyStep(2);
      } catch (err) {
        console.error('Enrollment check error:', err);
        showVerifyError('verify-step1-error', err.message || 'Unable to check enrollment number. Please retry.');
      } finally {
        btnEnrollContinue.textContent = 'Continue →';
        btnEnrollContinue.disabled = false;
      }
    });
  }

  // Handle Step 2 Confirmation
  const btnConfirmStudent = document.getElementById('btn-verify-confirm-student');
  if (btnConfirmStudent) {
    btnConfirmStudent.addEventListener('click', () => {
      // Pre-fill phone if available from record
      const phoneInput = document.getElementById('verify-phone-input');
      if (phoneInput && verifyStepData.student) {
        if (verifyStepData.student.phone) {
          phoneInput.value = verifyStepData.student.phone;
        } else if (!phoneInput.value) {
          phoneInput.value = '+91 98765 43210';
        }
      }
      clearVerifyErrors();
      goToVerifyStep(3);
    });
  }

  // Handle Step 3 OTP Verification Elements
  const btnVerifyOtp = document.getElementById('btn-submit-otp');
  const otpDigits = document.querySelectorAll('.otp-digit');

  otpDigits.forEach((digitInput, idx) => {
    digitInput.addEventListener('input', () => {
      const otpErr = document.getElementById('verify-otp-error');
      if (otpErr) otpErr.style.display = 'none';

      if (digitInput.value.length >= 1) {
        digitInput.value = digitInput.value.slice(-1); // Only keep single digit
        if (idx < otpDigits.length - 1) {
          otpDigits[idx + 1].focus();
        }
      }

      // Check if all 6 digits are filled -> auto verify
      let allFilled = true;
      otpDigits.forEach(d => { if (!d.value) allFilled = false; });
      if (allFilled && btnVerifyOtp && !btnVerifyOtp.disabled) {
        btnVerifyOtp.click();
      }
    });

    digitInput.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !digitInput.value && idx > 0) {
        otpDigits[idx - 1].focus();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (btnVerifyOtp) btnVerifyOtp.click();
      }
    });

    digitInput.addEventListener('paste', (e) => {
      const paste = (e.clipboardData || window.clipboardData).getData('text').trim();
      if (paste.length === 6 && /^\d+$/.test(paste)) {
        e.preventDefault();
        paste.split('').forEach((char, i) => {
          if (otpDigits[i]) otpDigits[i].value = char;
        });
        if (otpDigits[5]) otpDigits[5].focus();
        if (btnVerifyOtp && !btnVerifyOtp.disabled) {
          btnVerifyOtp.click();
        }
      }
    });
  });

  // Test OTP Auto-fill Button
  const btnAutoFillOtp = document.getElementById('btn-auto-fill-otp');
  if (btnAutoFillOtp) {
    btnAutoFillOtp.addEventListener('click', () => {
      const code = '123456';
      code.split('').forEach((char, i) => {
        if (otpDigits[i]) otpDigits[i].value = char;
      });
      const otpErr = document.getElementById('verify-otp-error');
      if (otpErr) otpErr.style.display = 'none';
      if (btnVerifyOtp && !btnVerifyOtp.disabled) {
        btnVerifyOtp.click();
      }
    });
  }

  // Handle Step 3 Send Phone OTP via Supabase Auth
  const btnSendOtp = document.getElementById('btn-send-otp');
  const phoneInput = document.getElementById('verify-phone-input');
  const otpEntryBox = document.getElementById('otp-entry-box');

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const errEl = document.getElementById('verify-step3-error');
      if (errEl) errEl.style.display = 'none';
    });
    phoneInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (btnSendOtp && btnSendOtp.style.display !== 'none') btnSendOtp.click();
      }
    });
  }

  if (btnSendOtp) {
    btnSendOtp.addEventListener('click', async () => {
      const pInput = document.getElementById('verify-phone-input');
      const phoneVal = (pInput.value || '').trim();

      clearVerifyErrors();

      if (!phoneVal || phoneVal.length < 10) {
        showVerifyError('verify-step3-error', 'Please enter a valid mobile number (e.g. +91 98765 43210).');
        if (pInput) pInput.focus();
        return;
      }

      btnSendOtp.textContent = 'Sending OTP...';
      btnSendOtp.disabled = true;

      try {
        verifyStepData.phone = phoneVal;
        let otpRes = { success: true, message: 'Verification code sent.' };

        if (window.SupaAuth) {
          otpRes = await window.SupaAuth.sendPhoneOtp(phoneVal);
        }

        if (!otpRes.success) {
          showVerifyError('verify-step3-error', otpRes.error || 'Failed to send OTP. Please check the phone number.');
          return;
        }

        btnSendOtp.style.display = 'none';
        if (otpEntryBox) otpEntryBox.style.display = 'block';

        // Update test code display if returned
        const codeDisplay = document.getElementById('otp-code-display');
        if (codeDisplay && otpRes.otp) {
          codeDisplay.textContent = otpRes.otp;
        }

        // Clear and focus first OTP digit
        otpDigits.forEach(d => d.value = '');
        if (otpDigits[0]) otpDigits[0].focus();

        showToast(otpRes.message || 'Verification OTP code dispatched!');
      } catch (err) {
        showVerifyError('verify-step3-error', err.message || 'Failed to dispatch OTP. Please check your network connection.');
      } finally {
        btnSendOtp.textContent = 'Send OTP Code';
        btnSendOtp.disabled = false;
      }
    });
  }

  // Handle Step 3 Submit OTP Verification
  if (btnVerifyOtp) {
    btnVerifyOtp.addEventListener('click', async () => {
      let otpCode = '';
      otpDigits.forEach(d => otpCode += (d.value || '').trim());

      const otpErr = document.getElementById('verify-otp-error');
      if (otpErr) otpErr.style.display = 'none';

      if (!otpCode || otpCode.length < 6) {
        showVerifyError('verify-otp-error', 'Please enter the complete 6-digit verification code (e.g. 123456).');
        return;
      }

      btnVerifyOtp.textContent = 'Verifying...';
      btnVerifyOtp.disabled = true;

      try {
        let verifyRes = { success: true };
        if (window.SupaAuth) {
          verifyRes = await window.SupaAuth.verifyPhoneOtp(verifyStepData.phone, otpCode);
        }

        if (!verifyRes.success) {
          showVerifyError('verify-otp-error', verifyRes.error || 'Invalid or expired OTP verification code.');
          return;
        }

        // Link verified profile in Supabase PostgreSQL
        if (window.SupaAuth) {
          await window.SupaAuth.saveVerifiedProfile(
            verifyStepData.enrollment,
            verifyStepData.student,
            verifyStepData.phone
          );
        }

        // Sync local client store
        window.Store.verifyUser(verifyStepData.enrollment, verifyStepData.student, verifyStepData.phone);
        syncNavHeader();

        // Show celebration step
        document.querySelectorAll('.verify-step').forEach(el => el.classList.remove('active'));
        const successEl = document.getElementById('verify-step-success');
        if (successEl) {
          successEl.classList.add('active');
          const studentName = verifyStepData.student.full_name || verifyStepData.student.name;
          document.getElementById('verify-success-name').textContent = studentName;
          document.getElementById('verify-success-program').textContent = `${verifyStepData.student.program || 'B.Tech'} ${verifyStepData.student.branch} · ${verifyStepData.student.batch}`;
        }
        showToast('Campus verification complete! Welcome to RGPVebazaar.');
      } catch (err) {
        console.error('OTP verification error:', err);
        showVerifyError('verify-otp-error', err.message || 'Verification failed. Please try again.');
      } finally {
        btnVerifyOtp.textContent = 'Verify & Complete Access →';
        btnVerifyOtp.disabled = false;
      }
    });
  }

  // =========================================================================
  // HOME DASHBOARD (/home)
  // =========================================================================
  function renderHome() {
    const user = window.Store.state.currentUser;

    // Greeting
    const greetingEl = document.getElementById('home-greeting-name');
    if (greetingEl) greetingEl.textContent = user.name ? `Good morning, ${user.name.split(' ')[0]} 👋` : 'Good morning, Rahul 👋';

    const metaEl = document.getElementById('home-student-meta');
    if (metaEl) {
      metaEl.innerHTML = `
        <span>${user.program} ${user.branchCode} · ${user.batch}</span>
        <span>·</span>
        <span class="badge-verified">${ICONS.check} Campus Verified</span>
      `;
    }

    // Happening on Campus Feed
    const happeningEl = document.getElementById('home-happening-grid');
    if (happeningEl) {
      happeningEl.innerHTML = `
        <div class="happening-card" onclick="window.navigateTo('opportunities')">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <span class="badge-tag">🚀 Campus Hackathon</span>
              <span class="opp-deadline-pill">3 days left</span>
            </div>
            <h4 style="font-size:1.15rem; font-family:var(--font-display); margin-bottom:0.4rem;">RGPV Smart Campus Hackathon 2026</h4>
            <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.45;">Coding Club & Tech Society · ₹50,000 Cash Pool & Mentorship</p>
          </div>
          <div style="padding-top:1rem; border-top:1px solid var(--border-light); font-size:0.82rem; font-weight:600; color:var(--primary-crimson); display:flex; align-items:center; justify-content:space-between;">
            <span>Official Unstop Registration</span>
            <span>${ICONS.chevronRight}</span>
          </div>
        </div>

        ${(() => {
          const resList = window.Store.state.resources || [];
          if (resList.length > 0) {
            const r = resList[0];
            return `
              <div class="happening-card" onclick="window.openResourceViewerModal('${r.id}')">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                    <span class="badge-tag">📚 New Resource</span>
                    <span style="font-size:0.75rem; color:var(--text-secondary);">${r.uploadDate || 'Recent'}</span>
                  </div>
                  <h4 style="font-size:1.15rem; font-family:var(--font-display); margin-bottom:0.4rem;">${r.title}</h4>
                  <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.45;">${(r.uploadedBy && r.uploadedBy.name) ? r.uploadedBy.name : 'Verified Student'} · ${r.branch} Sem ${r.semester} · ${r.pages} pages</p>
                </div>
                <div style="padding-top:1rem; border-top:1px solid var(--border-light); font-size:0.82rem; font-weight:600; color:var(--primary-crimson); display:flex; align-items:center; justify-content:space-between;">
                  <span>View Verified Document</span>
                  <span>${ICONS.chevronRight}</span>
                </div>
              </div>
            `;
          }
          return `
            <div class="happening-card" onclick="window.navigateTo('resources')">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                  <span class="badge-tag">📚 Academic Repository</span>
                  <span style="font-size:0.75rem; color:var(--text-secondary);">All Branches</span>
                </div>
                <h4 style="font-size:1.15rem; font-family:var(--font-display); margin-bottom:0.4rem;">Academic Notes & PYQ Bank</h4>
                <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.45;">Access verified handwritten lecture notes, formula sheets, and solved papers.</p>
              </div>
              <div style="padding-top:1rem; border-top:1px solid var(--border-light); font-size:0.82rem; font-weight:600; color:var(--primary-crimson); display:flex; align-items:center; justify-content:space-between;">
                <span>Upload or Browse Notes</span>
                <span>${ICONS.chevronRight}</span>
              </div>
            </div>
          `;
        })()}

        ${(() => {
          const exchItem = (window.Store.state.listings || []).find(l => l.listingType === 'exchange');
          if (exchItem) {
            return `
              <div class="happening-card" onclick="window.openProductDetailModal('${exchItem.id}')">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                    <span class="badge-tag">🔄 Barter Opportunity</span>
                    <span class="badge-verified">${ICONS.check} Verified Student</span>
                  </div>
                  <h4 style="font-size:1.15rem; font-family:var(--font-display); margin-bottom:0.4rem;">${exchItem.title}</h4>
                  <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.45;">${(exchItem.seller && exchItem.seller.name) ? exchItem.seller.name : 'Student'}: ${exchItem.exchangeWish || 'Available for barter swap'}</p>
                </div>
                <div style="padding-top:1rem; border-top:1px solid var(--border-light); font-size:0.82rem; font-weight:600; color:var(--primary-crimson); display:flex; align-items:center; justify-content:space-between;">
                  <span>Propose Exchange</span>
                  <span>${ICONS.chevronRight}</span>
                </div>
              </div>
            `;
          }
          return `
            <div class="happening-card" onclick="window.navigateTo('marketplace'); setMarketFilterType('exchange');">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                  <span class="badge-tag">🔄 Barter Exchange</span>
                  <span class="badge-verified">${ICONS.check} Campus Verified</span>
                </div>
                <h4 style="font-size:1.15rem; font-family:var(--font-display); margin-bottom:0.4rem;">Peer-to-Peer Barter Exchange</h4>
                <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.45;">Propose direct item swaps with classmates for drafters, calculators, or textbooks.</p>
              </div>
              <div style="padding-top:1rem; border-top:1px solid var(--border-light); font-size:0.82rem; font-weight:600; color:var(--primary-crimson); display:flex; align-items:center; justify-content:space-between;">
                <span>Explore Barter System</span>
                <span>${ICONS.chevronRight}</span>
              </div>
            </div>
          `;
        })()}
      `;
    }

    // Recently Listed
    const recentMarketEl = document.getElementById('home-recent-market-grid');
    if (recentMarketEl) {
      const activeListings = window.Store.state.listings || [];
      if (activeListings.length === 0) {
        recentMarketEl.innerHTML = `
          <div class="empty-state-box" style="grid-column: 1 / -1; padding: 2rem 1rem; text-align: center; background: var(--warm-ivory); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
            <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">🛒</div>
            <h4 style="font-size: 1.05rem; margin-bottom: 0.25rem;">No items listed yet</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">Be the first student to list textbooks, lab equipment, or electronics.</p>
            <button class="btn btn-sm btn-primary" onclick="window.openCreateListingModal()">+ Create Listing</button>
          </div>
        `;
      } else {
        recentMarketEl.innerHTML = activeListings.slice(0, 4).map(item => `
          <div class="product-card" onclick="window.openProductDetailModal('${item.id}')">
            <div class="product-image-box">
              <img src="${item.images[0]}" alt="${item.title}">
              <span class="product-type-badge badge-${item.listingType}">${item.listingType}</span>
            </div>
            <div class="product-content">
              <div>
                <h4 class="product-title">${item.title}</h4>
                <div class="product-price-row">
                  <span class="product-price">${item.price === 0 ? 'Free' : '₹' + item.price}</span>
                  <span class="product-condition">· ${item.condition}</span>
                </div>
              </div>
              <div class="product-card-footer">
                <div class="product-seller-info">
                  <span class="badge-verified">${ICONS.check} ${((item.seller && item.seller.name) ? item.seller.name : 'Student').split(' ')[0]}</span>
                  <span class="product-location">${ICONS.mapPin} ${item.meetupLocation}</span>
                </div>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    // New Resources
    const recentResEl = document.getElementById('home-recent-res-grid');
    if (recentResEl) {
      const activeResources = window.Store.state.resources || [];
      if (activeResources.length === 0) {
        recentResEl.innerHTML = `
          <div class="empty-state-box" style="grid-column: 1 / -1; padding: 2rem 1rem; text-align: center; background: var(--warm-ivory); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
            <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">📚</div>
            <h4 style="font-size: 1.05rem; margin-bottom: 0.25rem;">No resources uploaded yet</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">Share verified lecture notes, formula cheat sheets, or solved PYQs.</p>
            <button class="btn btn-sm btn-primary" onclick="window.openUploadResourceModal()">+ Upload Resource</button>
          </div>
        `;
      } else {
        recentResEl.innerHTML = activeResources.slice(0, 3).map(res => `
          <div class="resource-card" onclick="window.openResourceViewerModal('${res.id}')">
            <div>
              <div class="resource-top">
                <div class="resource-file-icon">${ICONS.fileText}</div>
                <span class="badge-tag">${res.resourceType}</span>
              </div>
              <h4 class="resource-title">${res.title}</h4>
              <div class="resource-meta-strip">
                <span>${res.branch}</span>
                <span>·</span>
                <span>Semester ${res.semester}</span>
                <span>·</span>
                <span>${res.pages} pages</span>
              </div>
            </div>
            <div class="resource-footer">
              <span class="badge-verified">${ICONS.check} ${(res.uploadedBy && res.uploadedBy.name) ? res.uploadedBy.name : 'Verified Student'}</span>
              <button class="btn btn-sm btn-secondary">View / Download</button>
            </div>
          </div>
        `).join('');
      }
    }

    // Personalized Opportunities (Personalized for B.Tech CSE)
    const personalOppEl = document.getElementById('home-personal-opp-grid');
    if (personalOppEl) {
      personalOppEl.innerHTML = window.Store.state.opportunities.slice(0, 3).map(opp => `
        <div class="opp-card">
          <div class="opp-header">
            <span class="badge-tag">${opp.category}</span>
            <span class="opp-deadline-pill">${opp.deadline}</span>
          </div>
          <div class="opp-org-name">${opp.organization}</div>
          <h4 class="opp-title">${opp.title}</h4>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">${opp.description.substring(0, 100)}...</p>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; border-top:1px solid var(--border-light); padding-top:0.85rem;">
            <span>📍 ${opp.location}</span>
            <button class="btn btn-sm btn-secondary" onclick="window.navigateTo('opportunities')">Details →</button>
          </div>
        </div>
      `).join('');
    }
  }

  // =========================================================================
  // GLOBAL SEARCH (Cross-Pillar: Products, Resources, Clubs, Opportunities)
  // =========================================================================
  function initGlobalSearch() {
    const searchInputs = document.querySelectorAll('.global-search-input');
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const query = (e.target.value || '').trim().toLowerCase();
        const resultsBox = input.closest('.global-search-wrapper').querySelector('.search-dropdown-results');
        if (!resultsBox) return;

        if (!query) {
          resultsBox.classList.remove('active');
          resultsBox.innerHTML = '';
          return;
        }

        const matchedProducts = window.Store.state.listings.filter(p =>
          p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
        );

        const matchedResources = window.Store.state.resources.filter(r =>
          r.title.toLowerCase().includes(query) || r.subject.toLowerCase().includes(query) || r.branch.toLowerCase().includes(query)
        );

        const matchedClubs = window.Store.state.clubs.filter(c =>
          c.name.toLowerCase().includes(query) || c.tagline.toLowerCase().includes(query) || c.category.toLowerCase().includes(query)
        );

        const matchedOpportunities = window.Store.state.opportunities.filter(o =>
          o.title.toLowerCase().includes(query) || o.organization.toLowerCase().includes(query) || o.description.toLowerCase().includes(query)
        );

        const totalMatches = matchedProducts.length + matchedResources.length + matchedClubs.length + matchedOpportunities.length;

        if (totalMatches === 0) {
          resultsBox.innerHTML = `
            <div style="padding:1.5rem; text-align:center; color:var(--text-secondary); font-size:0.9rem;">
              No results found for "<strong>${query}</strong>" across campus pillars.
            </div>
          `;
          resultsBox.classList.add('active');
          return;
        }

        let html = '';

        if (matchedProducts.length > 0) {
          html += `
            <div class="search-section-group">
              <div class="search-section-header">Marketplace Products (${matchedProducts.length})</div>
              ${matchedProducts.slice(0, 3).map(p => `
                <div class="search-result-item" onclick="window.openProductDetailModal('${p.id}')">
                  <div>
                    <div style="font-weight:600; font-size:0.9rem;">${p.title}</div>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">${p.category} · ${p.condition}</div>
                  </div>
                  <div style="font-weight:700; color:var(--primary-crimson);">₹${p.price}</div>
                </div>
              `).join('')}
            </div>
          `;
        }

        if (matchedResources.length > 0) {
          html += `
            <div class="search-section-group">
              <div class="search-section-header">Academic Resources (${matchedResources.length})</div>
              ${matchedResources.slice(0, 3).map(r => `
                <div class="search-result-item" onclick="window.openResourceViewerModal('${r.id}')">
                  <div>
                    <div style="font-weight:600; font-size:0.9rem;">${r.title}</div>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">${r.branch} Sem ${r.semester} · ${r.pages} pages</div>
                  </div>
                  <span class="badge-tag">${r.resourceType}</span>
                </div>
              `).join('')}
            </div>
          `;
        }

        if (matchedOpportunities.length > 0) {
          html += `
            <div class="search-section-group">
              <div class="search-section-header">Opportunities & Hackathons (${matchedOpportunities.length})</div>
              ${matchedOpportunities.slice(0, 3).map(o => `
                <div class="search-result-item" onclick="window.navigateTo('opportunities')">
                  <div>
                    <div style="font-weight:600; font-size:0.9rem;">${o.title}</div>
                    <div style="font-size:0.75rem; color:var(--text-secondary);">${o.organization} · ${o.deadline}</div>
                  </div>
                  <span class="opp-deadline-pill">${o.category}</span>
                </div>
              `).join('')}
            </div>
          `;
        }

        if (matchedClubs.length > 0) {
          html += `
            <div class="search-section-group">
              <div class="search-section-header">Campus Clubs (${matchedClubs.length})</div>
              ${matchedClubs.slice(0, 3).map(c => `
                <div class="search-result-item" onclick="window.openClubModal('${c.id}')">
                  <div style="display:flex; align-items:center; gap:0.6rem;">
                    <span>${c.logo}</span>
                    <div>
                      <div style="font-weight:600; font-size:0.9rem;">${c.name}</div>
                      <div style="font-size:0.75rem; color:var(--text-secondary);">${c.tagline}</div>
                    </div>
                  </div>
                  <span class="badge-tag">${c.category}</span>
                </div>
              `).join('')}
            </div>
          `;
        }

        resultsBox.innerHTML = html;
        resultsBox.classList.add('active');
      });

      // Close search when clicking outside
      document.addEventListener('click', (e) => {
        if (!input.closest('.global-search-wrapper').contains(e.target)) {
          const resultsBox = input.closest('.global-search-wrapper').querySelector('.search-dropdown-results');
          if (resultsBox) resultsBox.classList.remove('active');
        }
      });
    });
  }

  // =========================================================================
  // MARKETPLACE CONTROLLER (/marketplace)
  // =========================================================================
  let isMarketplaceLoading = false;
  let marketplaceLoadError = null;

  async function renderMarketplace(skipFetch = false) {
    const grid = document.getElementById('market-products-grid');
    if (!grid) return;

    if (!skipFetch) {
      isMarketplaceLoading = true;
      marketplaceLoadError = null;

      // Render Skeleton Cards while fetching
      grid.innerHTML = Array(4).fill(0).map(() => `
        <div class="product-card skeleton-card" style="opacity:0.6; pointer-events:none;">
          <div class="product-image-box" style="background:var(--border-color); animation:pulse 1.5s infinite;"></div>
          <div class="product-content">
            <div style="height:18px; width:75%; background:var(--border-color); border-radius:4px; margin-bottom:0.5rem;"></div>
            <div style="height:14px; width:45%; background:var(--border-color); border-radius:4px; margin-bottom:1rem;"></div>
            <div style="height:12px; width:60%; background:var(--border-color); border-radius:4px;"></div>
          </div>
        </div>
      `).join('');

      try {
        const res = await window.Store.loadMarketplaceListings({
          category: marketCategory,
          condition: marketCondition,
          listingType: marketFilterType,
          location: marketLocation,
          search: marketSearch,
          sort: marketSort
        });

        if (!res.success && res.error) {
          marketplaceLoadError = res.error;
        }
      } catch (err) {
        console.error('Failed to load marketplace listings:', err);
        marketplaceLoadError = 'Unable to load marketplace.';
      } finally {
        isMarketplaceLoading = false;
      }
    }

    if (marketplaceLoadError) {
      grid.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1; text-align:center; padding:3.5rem 1.5rem;">
          <div class="empty-state-icon" style="font-size:2.6rem; margin-bottom:0.6rem;">⚠️</div>
          <h3 class="empty-state-title" style="margin-bottom:0.4rem;">Unable to load marketplace.</h3>
          <p class="empty-state-sub" style="margin-bottom:1.25rem;">Could not connect to the campus listings database. Please check your network and retry.</p>
          <button class="btn btn-primary" id="btn-retry-marketplace" onclick="window.handleRetryMarketplace(this)">Retry Connection</button>
        </div>
      `;
      return;
    }

    const list = window.Store.state.listings || [];
    const userFavorites = window.Store.state.currentUser.savedListings || [];

    if (list.length === 0) {
      const isFiltered = (marketFilterType !== 'all' || marketCategory !== 'all' || marketCondition !== 'all' || marketLocation !== 'all' || (marketSearch && marketSearch.trim()));
      
      if (isFiltered) {
        grid.innerHTML = `
          <div class="empty-state-box" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🛒</div>
            <h3 class="empty-state-title">No listings match your filters</h3>
            <p class="empty-state-sub">Adjust your active category, condition, location or search query to find other student items.</p>
            <button class="btn btn-secondary" onclick="window.resetMarketplaceFilters()">Clear Filters</button>
          </div>
        `;
      } else {
        grid.innerHTML = `
          <div class="empty-state-box" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🛒</div>
            <h3 class="empty-state-title">Nothing has been listed yet.</h3>
            <p class="empty-state-sub">Be the first student to sell something.</p>
            <button class="btn btn-primary" onclick="window.openCreateListingModal()">+ Create Listing</button>
          </div>
        `;
      }
      return;
    }

    grid.innerHTML = list.map(item => {
      const isFav = userFavorites.includes(item.id);
      const isVerified = item.seller && (item.seller.is_verified || item.seller.isVerified);
      return `
        <div class="product-card" onclick="window.openProductDetailModal('${item.id}')">
          <div class="product-image-box">
            <img src="${item.images[0]}" alt="${item.title}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80';">
            <span class="product-type-badge badge-${item.listingType}">${item.listingType}</span>
            <button class="product-fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); window.toggleFavorite('${item.id}')" title="Save Item">
              ${isFav ? ICONS.heartFilled : ICONS.heart}
            </button>
          </div>
          <div class="product-content">
            <div>
              <h4 class="product-title">${item.title}</h4>
              <div class="product-price-row">
                <span class="product-price">${item.price === 0 ? 'Free' : '₹' + item.price}</span>
                <span class="product-condition">· ${item.condition}</span>
              </div>
            </div>
            <div class="product-card-footer">
              <div class="product-seller-info">
                ${isVerified ? `<span class="badge-verified">${ICONS.check} ${item.seller.name}</span>` : `<span style="font-size:0.75rem; color:var(--text-secondary);">${item.seller.name}</span>`}
                <span class="product-location">${ICONS.mapPin} ${item.meetupLocation || item.location}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  window.renderMarketplace = renderMarketplace;

  window.handleRetryMarketplace = async (btn) => {
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Retrying...';
    }
    marketplaceLoadError = null;
    await renderMarketplace(false);
  };

  function setMarketFilterType(type) {
    marketFilterType = type;
    document.querySelectorAll('#marketplace-type-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-type') === type) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    renderMarketplace();
  }
  window.setMarketFilterType = setMarketFilterType;

  window.resetMarketplaceFilters = () => {
    marketFilterType = 'all';
    marketCategory = 'all';
    marketCondition = 'all';
    marketLocation = 'all';
    marketSearch = '';
    marketSort = 'newest';

    const searchInput = document.getElementById('market-search-input');
    if (searchInput) searchInput.value = '';

    const condSelect = document.getElementById('market-condition-select');
    if (condSelect) condSelect.value = 'all';

    const locSelect = document.getElementById('market-location-select');
    if (locSelect) locSelect.value = 'all';

    const sortSelect = document.getElementById('market-sort-select');
    if (sortSelect) sortSelect.value = 'newest';

    document.querySelectorAll('#marketplace-type-tabs .tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-type') === 'all');
    });

    document.querySelectorAll('.category-chip').forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-cat') === 'all');
    });

    renderMarketplace();
  };

  window.toggleFavorite = (id) => {
    window.Store.toggleFavoriteListing(id);
    renderMarketplace(true);
    showToast('Saved to your profile bookmarks.');
  };

  // =========================================================================
  // MARKETPLACE OWNER ACTIONS (Edit Price, Mark Sold, Reactivate, Delete)
  // =========================================================================
  window.handleEditPrice = async (id, currentPrice) => {
    const input = prompt('Enter updated price in ₹:', currentPrice !== undefined ? currentPrice : '');
    if (input === null) return;
    const newPrice = parseInt(input.trim(), 10);
    if (isNaN(newPrice) || newPrice < 0) {
      alert('Please enter a valid non-negative number for the price.');
      return;
    }
    const res = await window.Store.updateListing(id, { price: newPrice });
    if (res && res.success) {
      showToast(`✓ Price updated to ₹${newPrice}.`);
      if (currentRoute === 'marketplace') await renderMarketplace(false);
      if (currentRoute === 'profile') renderProfile();
      if (currentRoute === 'home') renderHome();
    } else {
      alert(res?.error || 'Failed to update price.');
    }
  };

  window.handleMarkSold = async (id) => {
    if (!confirm('Mark this listing as Sold? It will be archived and removed from the active marketplace feed.')) return;
    const res = await window.Store.updateListingStatus(id, 'sold');
    if (res && res.success) {
      showToast('✓ Listing marked as sold.');
      if (currentRoute === 'marketplace') await renderMarketplace(false);
      if (currentRoute === 'profile') renderProfile();
      if (currentRoute === 'home') renderHome();
    } else {
      alert(res?.error || 'Failed to update listing status.');
    }
  };

  window.handleReactivateListing = async (id) => {
    if (!confirm('Reactivate this listing back into the active marketplace feed?')) return;
    const res = await window.Store.updateListingStatus(id, 'active');
    if (res && res.success) {
      showToast('✓ Listing reactivated in marketplace.');
      if (currentRoute === 'marketplace') await renderMarketplace(false);
      if (currentRoute === 'profile') renderProfile();
      if (currentRoute === 'home') renderHome();
    } else {
      alert(res?.error || 'Failed to reactivate listing.');
    }
  };

  window.handleDeleteListing = async (id) => {
    if (!confirm('Are you sure you want to remove this listing? This cannot be undone.')) return;
    const res = await window.Store.deleteListing(id);
    if (res && res.success) {
      showToast('✓ Listing removed.');
      if (currentRoute === 'marketplace') await renderMarketplace(false);
      if (currentRoute === 'profile') renderProfile();
      if (currentRoute === 'home') renderHome();
    } else {
      alert(res?.error || 'Failed to delete listing.');
    }
  };

  // =========================================================================
  // PRODUCT DETAIL MODAL & INTERACTIONS
  // =========================================================================
  window.openProductDetailModal = (id) => {
    const item = (window.Store.state.listings || []).find(l => l.id === id) || (window.Store.state.myListings || []).find(l => l.id === id);
    if (!item) return;

    activeProductModalItem = item;
    const modal = document.getElementById('modal-product-detail');
    if (!modal) return;

    document.getElementById('modal-prod-title').textContent = item.title;
    document.getElementById('modal-prod-price').textContent = item.price === 0 ? 'Free Giveaway' : '₹' + item.price;
    document.getElementById('modal-prod-condition').textContent = item.condition;
    document.getElementById('modal-prod-desc').textContent = item.description;
    
    const locEl = document.getElementById('modal-prod-location');
    if (locEl) {
      locEl.textContent = item.meetupLocation || item.location || 'Central Library';
    }

    const prodImgEl = document.getElementById('modal-prod-image');
    if (prodImgEl) {
      prodImgEl.src = item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80';
      prodImgEl.onerror = function() {
        this.onerror = null;
        this.src = 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80';
      };
    }
    document.getElementById('modal-prod-badge').textContent = (item.listingType || 'SELL').toUpperCase();

    // Real Seller Info from Database
    const s = item.seller || {};
    document.getElementById('modal-seller-name').textContent = s.name || 'Verified Student';
    document.getElementById('modal-seller-program').textContent = s.program || 'B.Tech';
    document.getElementById('modal-seller-rating').textContent = `${s.rating || 5.0} ★ (${s.transactions || 0} campus deals)`;

    // Campus Verified Badge - Shown ONLY when actually verified
    const isSellerVerified = s.is_verified || s.isVerified;
    const sellerBadgeContainer = document.getElementById('modal-seller-name')?.parentElement;
    let vBadge = sellerBadgeContainer ? sellerBadgeContainer.querySelector('.badge-verified') : null;
    if (vBadge) {
      vBadge.style.display = isSellerVerified ? 'inline-flex' : 'none';
    }

    // Wishlist for Exchange
    const wishBox = document.getElementById('modal-prod-exchange-wish');
    if (item.listingType === 'exchange' && item.exchangeWish) {
      wishBox.style.display = 'block';
      document.getElementById('modal-prod-wish-text').textContent = item.exchangeWish;
    } else {
      wishBox.style.display = 'none';
    }

    // Action buttons: If user is the seller, show Owner Actions
    const currentUser = window.Store.state.currentUser;
    const isOwner = currentUser && (
      currentUser.id === item.seller_id || 
      currentUser.id === s.id || 
      (currentUser.enrollment && s.enrollment && currentUser.enrollment === s.enrollment)
    );

    const footer = modal.querySelector('.modal-footer');
    if (footer) {
      if (isOwner) {
        footer.innerHTML = `
          <button class="btn btn-ghost btn-sm" onclick="window.closeModal('modal-product-detail'); window.handleDeleteListing('${item.id}')" style="color:#b91c1c;">🗑️ Remove</button>
          <button class="btn btn-secondary" onclick="window.closeModal('modal-product-detail'); window.handleEditPrice('${item.id}', ${item.price})">✏️ Edit Price</button>
          ${item.status === 'active' ? `
            <button class="btn btn-primary" onclick="window.closeModal('modal-product-detail'); window.handleMarkSold('${item.id}')">✓ Mark as Sold</button>
          ` : `
            <button class="btn btn-secondary" onclick="window.closeModal('modal-product-detail'); window.handleReactivateListing('${item.id}')">Reactivate</button>
          `}
        `;
      } else {
        footer.innerHTML = `
          <button class="btn btn-ghost btn-sm" id="btn-modal-report" onclick="window.openReportListing();">🚩 Report</button>
          <button class="btn btn-secondary" id="btn-modal-offer" onclick="window.closeModal('modal-product-detail'); window.openMakeOfferModal(window.activeProductModalItem);">💰 Make Offer</button>
          <button class="btn btn-secondary" id="btn-modal-exchange" onclick="window.closeModal('modal-product-detail'); window.openProposeExchangeModal(window.activeProductModalItem);">🔄 Propose Exchange</button>
          <button class="btn btn-primary" id="btn-modal-chat" onclick="window.closeModal('modal-product-detail'); window.startChatFromListing(window.activeProductModalItem ? window.activeProductModalItem.id : null);">💬 Chat with Seller</button>
        `;
      }
    }

    modal.classList.add('active');
  };

  // =========================================================================
  // SIGNATURE EXCHANGE SYSTEM (YOUR ITEM <-> THEIR ITEM)
  // =========================================================================
  window.openProposeExchangeModal = (targetItem) => {
    const modal = document.getElementById('modal-propose-exchange');
    if (!modal) return;

    // Target Item Display
    document.getElementById('exch-target-title').textContent = targetItem.title;
    document.getElementById('exch-target-price').textContent = '₹' + targetItem.price;
    document.getElementById('exch-target-img').src = targetItem.images[0];

    // Populate user's own items selector
    const selector = document.getElementById('exch-my-item-select');
    const userItems = window.Store.state.myListings;

    selector.innerHTML = userItems.map(my => `
      <option value="${my.id}" data-price="${my.price}" data-title="${my.title}" data-img="${my.images[0]}">
        ${my.title} (Value: ₹${my.price})
      </option>
    `).join('');

    function updateExchangeMath() {
      const selectedOption = selector.options[selector.selectedIndex];
      if (!selectedOption) return;

      const myPrice = parseInt(selectedOption.getAttribute('data-price') || '0', 10);
      const targetPrice = targetItem.price;
      const diff = targetPrice - myPrice;

      const mathBox = document.getElementById('exch-cash-adjustment');
      if (diff > 0) {
        mathBox.innerHTML = `<strong>You add ₹${diff}</strong> cash difference to match seller value.`;
      } else if (diff < 0) {
        mathBox.innerHTML = `<strong>Seller adds ₹${Math.abs(diff)}</strong> cash difference.`;
      } else {
        mathBox.innerHTML = `<strong>Even exchange:</strong> ₹0 cash adjustment needed.`;
      }

      document.getElementById('exch-my-preview-title').textContent = selectedOption.getAttribute('data-title');
      document.getElementById('exch-my-preview-img').src = selectedOption.getAttribute('data-img');
    }

    selector.onchange = updateExchangeMath;
    updateExchangeMath();

    document.getElementById('btn-submit-exchange-proposal').onclick = () => {
      const selectedOption = selector.options[selector.selectedIndex];
      if (!selectedOption) return;
      const myPrice = parseInt(selectedOption.getAttribute('data-price') || '0', 10);
      const note = document.getElementById('exch-note-input').value;

      const result = window.Store.proposeExchange({
        targetListingId: targetItem.id,
        targetListingTitle: targetItem.title,
        targetListingPrice: targetItem.price,
        targetListingImage: targetItem.images[0],
        proposerItemId: selectedOption.value,
        proposerItemTitle: selectedOption.getAttribute('data-title'),
        proposerItemPrice: myPrice,
        proposerItemImage: selectedOption.getAttribute('data-img'),
        cashDifference: Math.abs(targetItem.price - myPrice),
        cashDifferenceDirection: targetItem.price > myPrice ? 'proposer_pays' : 'even',
        note: note || 'Can meet at campus meetup point.'
      });

      if (!result.success) {
        alert(result.error || 'Failed to submit exchange proposal.');
        return;
      }

      closeModal('modal-propose-exchange');
      showToast('Exchange proposal successfully sent to student!');
    };

    modal.classList.add('active');
  };

  // Make Offer Modal
  window.openMakeOfferModal = (targetItem) => {
    const modal = document.getElementById('modal-make-offer');
    if (!modal) return;

    document.getElementById('offer-target-title').textContent = targetItem.title;
    document.getElementById('offer-target-price').textContent = '₹' + targetItem.price;
    const inputVal = document.getElementById('offer-amount-input');
    inputVal.value = Math.round(targetItem.price * 0.85);

    document.getElementById('btn-submit-offer').onclick = () => {
      const amt = parseInt(inputVal.value, 10);
      const msg = document.getElementById('offer-message-input').value;

      const result = window.Store.makeOffer({
        listingId: targetItem.id,
        listingTitle: targetItem.title,
        listedPrice: targetItem.price,
        offeredPrice: amt,
        note: msg
      });

      if (!result.success) {
        alert(result.error || 'Unable to submit offer.');
        return;
      }

      closeModal('modal-make-offer');
      showToast(`Offer of ₹${amt} submitted to seller.`);
    };

    modal.classList.add('active');
  };

  // Selected custom image for new listing
  let selectedListingImage = null;
  let selectedImageFile = null;

  function initCreateListingImageHandlers() {
    const dropzone = document.getElementById('listing-dropzone');
    const fileInput = document.getElementById('create-listing-file-input');
    const promptBox = document.getElementById('dropzone-prompt');
    const previewContainer = document.getElementById('listing-image-preview-container');
    const previewImg = document.getElementById('listing-image-preview');
    const btnChangeImg = document.getElementById('btn-change-listing-img');
    const btnRemoveImg = document.getElementById('btn-remove-listing-img');
    const btnToggleUrl = document.getElementById('btn-toggle-url-input');
    const customUrlContainer = document.getElementById('custom-url-input-container');
    const customUrlInput = document.getElementById('create-listing-image-url');
    const presetChips = document.querySelectorAll('.btn-img-preset');

    if (!dropzone || !fileInput) return;

    function setImagePreview(dataUrl) {
      selectedListingImage = dataUrl;
      if (previewImg) previewImg.src = dataUrl;
      if (promptBox) promptBox.style.display = 'none';
      if (previewContainer) previewContainer.style.display = 'block';
    }

    function clearImagePreview() {
      selectedListingImage = null;
      selectedImageFile = null;
      if (fileInput) fileInput.value = '';
      if (previewImg) previewImg.src = '';
      if (promptBox) promptBox.style.display = 'flex';
      if (previewContainer) previewContainer.style.display = 'none';
      presetChips.forEach(c => c.classList.remove('active'));
      if (customUrlInput) customUrlInput.value = '';
    }

    // Dropzone click opens file dialog (unless clicking change/remove)
    dropzone.addEventListener('click', (e) => {
      if (e.target.closest('#btn-change-listing-img') || e.target.closest('#btn-remove-listing-img')) return;
      if (!selectedListingImage) {
        fileInput.click();
      }
    });

    if (btnChangeImg) {
      btnChangeImg.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (btnRemoveImg) {
      btnRemoveImg.addEventListener('click', (e) => {
        e.stopPropagation();
        clearImagePreview();
      });
    }

    // Drag & Drop
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleImageFile(files[0]);
      }
    });

    // File input change
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        handleImageFile(fileInput.files[0]);
      }
    });

    function handleImageFile(file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file is too large. Maximum allowed size is 5MB.');
        return;
      }

      selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
        presetChips.forEach(c => c.classList.remove('active'));
        if (customUrlInput) customUrlInput.value = '';
      };
      reader.readAsDataURL(file);
    }

    // Preset buttons
    presetChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        presetChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const imgUrl = chip.getAttribute('data-img');
        if (imgUrl) {
          selectedImageFile = null;
          setImagePreview(imgUrl);
          if (customUrlInput) customUrlInput.value = '';
        }
      });
    });

    // URL input toggle
    if (btnToggleUrl && customUrlContainer) {
      btnToggleUrl.addEventListener('click', () => {
        const isHidden = customUrlContainer.style.display === 'none';
        customUrlContainer.style.display = isHidden ? 'block' : 'none';
        btnToggleUrl.textContent = isHidden ? 'Hide URL Input' : 'Paste Photo URL';
        if (isHidden && customUrlInput) customUrlInput.focus();
      });
    }

    if (customUrlInput) {
      customUrlInput.addEventListener('input', () => {
        const val = customUrlInput.value.trim();
        if (val && (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:image/'))) {
          selectedImageFile = null;
          setImagePreview(val);
          presetChips.forEach(c => c.classList.remove('active'));
        }
      });
    }

    window._resetListingImage = clearImagePreview;
  }

  // Create Listing Modal
  window.openCreateListingModal = () => {
    const user = window.Store.state.currentUser;
    if (!user || !user.isVerified) {
      if (confirm('Campus verification required.\n\nOnly verified students can publish listings on RGPVebazaar.\n\nWould you like to verify your campus account now?')) {
        navigate('verify');
      }
      return;
    }

    const modal = document.getElementById('modal-create-listing');
    if (!modal) return;

    // Reset fields
    document.getElementById('create-listing-title').value = '';
    document.getElementById('create-listing-price').value = '';
    document.getElementById('create-listing-desc').value = '';
    document.getElementById('create-listing-wish').value = '';
    if (window._resetListingImage) window._resetListingImage();

    const typeRadios = document.querySelectorAll('input[name="listing-type"]');
    typeRadios.forEach(r => {
      r.addEventListener('change', () => {
        const val = document.querySelector('input[name="listing-type"]:checked').value;
        const priceField = document.getElementById('create-price-field');
        const wishField = document.getElementById('create-wish-field');
        if (val === 'sell') {
          priceField.style.display = 'block';
          wishField.style.display = 'none';
        } else if (val === 'exchange') {
          priceField.style.display = 'block';
          wishField.style.display = 'block';
        } else if (val === 'free') {
          priceField.style.display = 'none';
          wishField.style.display = 'none';
        }
      });
    });

    const publishBtn = document.getElementById('btn-publish-listing');
    publishBtn.disabled = false;
    publishBtn.textContent = 'Publish Listing →';

    publishBtn.onclick = async () => {
      const activeUser = window.Store.state.currentUser;
      if (!activeUser || !activeUser.isVerified) {
        alert('Campus verification required. Only verified students can publish listings.');
        closeModal('modal-create-listing');
        navigate('verify');
        return;
      }

      const title = document.getElementById('create-listing-title').value.trim();
      const cat = document.getElementById('create-listing-category').value;
      const cond = document.getElementById('create-listing-condition').value;
      const type = document.querySelector('input[name="listing-type"]:checked').value;
      const price = type === 'free' ? 0 : parseInt(document.getElementById('create-listing-price').value || '0', 10);
      const desc = document.getElementById('create-listing-desc').value.trim();
      const wish = document.getElementById('create-listing-wish').value.trim();
      const loc = document.getElementById('create-listing-location').value;

      // 1. Validation (Frontend + Backend parity)
      if (!title || title.length < 3) {
        alert('Please provide a listing title (at least 3 characters).');
        return;
      }
      if (title.length > 150) {
        alert('Listing title must be under 150 characters.');
        return;
      }
      if (!desc || desc.length < 10) {
        alert('Please provide an item description (at least 10 characters).');
        return;
      }
      if (desc.length > 3000) {
        alert('Item description must be under 3000 characters.');
        return;
      }
      if (type === 'sell' && (!price || price <= 0)) {
        alert('Please enter a valid price in ₹ for items listed for sale.');
        return;
      }
      if (type === 'exchange' && (!wish || wish.length < 3)) {
        alert('Please specify what you are looking for in exchange (at least 3 characters).');
        return;
      }

      // Prevent duplicate submissions: disable button
      publishBtn.disabled = true;
      publishBtn.textContent = 'Publishing...';

      // Default high quality image based on category
      const categoryImages = {
        'Books': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        'Electronics': 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
        'Hostel': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
        'Furniture': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80',
        'Lab Equipment': 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=600&auto=format&fit=crop&q=80',
        'Stationery': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80',
        'Sports': 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80',
        'Other': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80'
      };

      try {
        // Step 4: Upload product images to backend storage
        const sourceImage = selectedImageFile || selectedListingImage || categoryImages[cat] || categoryImages['Other'];
        let backendImageUrl = null;

        if (window.SupaAuth && typeof window.SupaAuth.uploadListingImage === 'function') {
          const upRes = await window.SupaAuth.uploadListingImage(sourceImage, 'listing-' + Date.now());
          if (!upRes || !upRes.success || !upRes.url) {
            alert('Image upload failed. Please try again.');
            publishBtn.disabled = false;
            publishBtn.textContent = 'Publish Listing →';
            return;
          }
          backendImageUrl = upRes.url;
        } else {
          backendImageUrl = selectedListingImage || categoryImages[cat] || categoryImages['Other'];
        }

        // Step 5: Create the listing record in the database
        const result = await window.Store.addListing({
          title,
          category: cat,
          condition: cond,
          listingType: type,
          price,
          description: desc,
          exchangeWish: wish,
          meetupLocation: loc,
          images: [backendImageUrl]
        });

        if (!result.success) {
          alert(result.error || 'Failed to publish listing.');
          publishBtn.disabled = false;
          publishBtn.textContent = 'Publish Listing →';
          return;
        }

        publishBtn.textContent = '✓ Listing Published';
        closeModal('modal-create-listing');

        // Step 8 & 9: Show success message and redirect/show the listing in Marketplace
        showToast(`✓ Listing published: Your ${title} is now visible in the marketplace.`);
        navigate('marketplace');
        await renderMarketplace();
      } catch (err) {
        console.error('Publish listing error:', err);
        alert('Failed to publish listing: ' + (err.message || 'Unknown error'));
        publishBtn.disabled = false;
        publishBtn.textContent = 'Publish Listing →';
      }
    };

    modal.classList.add('active');
  };

  // =========================================================================
  // TRANSACTION CHAT & REALTIME MESSAGING (/chat)
  // =========================================================================
  let chatSearchQuery = '';
  let chatCurrentAttachment = null;
  let chatTypingTimer = null;
  let chatPartnerTypingTimer = null;
  let activeChatSubscription = null;

  function updateChatNavBadge() {
    const totalUnread = window.Store.getTotalUnreadChatCount();
    const navDot = document.getElementById('nav-chat-dot');
    if (navDot) {
      navDot.style.display = totalUnread > 0 ? 'block' : 'none';
      navDot.title = `${totalUnread} unread messages`;
    }
    const inboxBadge = document.getElementById('inbox-total-unread-badge');
    if (inboxBadge) {
      if (totalUnread > 0) {
        inboxBadge.textContent = totalUnread;
        inboxBadge.style.display = 'inline-block';
      } else {
        inboxBadge.style.display = 'none';
      }
    }
  }

  function setChatConnectionStatus(status, text) {
    const badge = document.getElementById('chat-connection-badge');
    const badgeText = document.getElementById('chat-connection-text');
    if (!badge || !badgeText) return;
    badge.className = `chat-status-badge ${status}`;
    badgeText.textContent = text;
  }

  // Network state listeners
  window.addEventListener('online', () => {
    setChatConnectionStatus('online', 'Live Realtime');
    showCampusToast('Internet connection restored. Chat is live.', 'success');
    if (currentRoute === 'chat') {
      renderChat(activeChatConversationId);
    }
  });

  window.addEventListener('offline', () => {
    setChatConnectionStatus('offline', 'Offline (will retry)');
    showCampusToast('Network disconnected. Messages will save locally.', 'warning');
  });

  function renderChat(convId) {
    const currentUser = window.Store.state.currentUser;
    const conversations = window.Store.state.conversations || [];
    let conv = conversations.find(c => c.id === convId);

    if (!conv) {
      conv = conversations.find(c => c.id === activeChatConversationId) || conversations[0];
    }

    if (!conv) {
      const fallback = window.Store.state.conversations[0];
      if (fallback) conv = fallback;
    }

    if (!conv) return;

    activeChatConversationId = conv.id;
    window.activeChatPartnerId = conv.partnerId;

    // Render Inbox List
    renderChatInbox();

    // Header
    const partnerNameEl = document.getElementById('chat-partner-name');
    const partnerProgEl = document.getElementById('chat-partner-program');
    if (partnerNameEl) partnerNameEl.textContent = conv.partnerName || 'Campus Student';
    if (partnerProgEl) partnerProgEl.textContent = conv.partnerProgram || (conv.partnerEnrollment ? `${conv.partnerEnrollment} · Verified` : 'Verified Student');

    // Pinned Listing
    const pinnedTitle = document.getElementById('chat-pinned-title');
    const pinnedPrice = document.getElementById('chat-pinned-price');
    const pinnedImg = document.getElementById('chat-pinned-img');
    const pinnedMeetup = document.getElementById('chat-pinned-meetup');

    if (pinnedTitle) pinnedTitle.textContent = conv.listingTitle || 'Campus Marketplace Deal';
    if (pinnedPrice) pinnedPrice.textContent = '₹' + (conv.listingPrice || 0);
    if (pinnedImg) pinnedImg.src = conv.listingImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
    if (pinnedMeetup) pinnedMeetup.textContent = conv.listingMeetup || 'Central Library';

    // Messages
    renderChatMessages(conv);

    // Mark as read immediately
    window.Store.markConversationAsRead(conv.id);
    updateChatNavBadge();

    // Subscribe to realtime updates for this conversation
    if (window.SupaChat && typeof window.SupaChat.subscribeToConversation === 'function') {
      if (activeChatSubscription) {
        window.SupaChat.unsubscribeChatChannel();
      }

      activeChatSubscription = window.SupaChat.subscribeToConversation(conv.id, {
        onMessage: (serverMsg) => {
          const isMine = serverMsg.sender_id === currentUser.id;
          window.Store.addRealtimeMessage(conv.id, serverMsg, currentUser.id);
          const updatedConv = window.Store.state.conversations.find(c => c.id === conv.id);
          renderChatMessages(updatedConv);
          renderChatInbox();
          const msgContainer = document.getElementById('chat-messages-container');
          if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
          if (!isMine) {
            window.Store.markConversationAsRead(conv.id);
            updateChatNavBadge();
          }
        },
        onStatusChange: (updatedMsg) => {
          const c = window.Store.state.conversations.find(x => x.id === conv.id);
          if (c && c.messages) {
            const m = c.messages.find(msg => msg.id === updatedMsg.id || (updatedMsg.client_message_id && msg.clientMessageId === updatedMsg.client_message_id));
            if (m) {
              m.status = updatedMsg.status;
              m.read_at = updatedMsg.read_at;
              renderChatMessages(c);
            }
          }
        },
        onTyping: (payload) => {
          if (payload && payload.userId !== currentUser.id) {
            handlePartnerTyping(payload.userName || conv.partnerName || 'Student', payload.isTyping !== false);
          }
        }
      });
    }
  }

  function renderChatInbox() {
    const inboxContainer = document.getElementById('chat-inbox-list');
    if (!inboxContainer) return;

    const conversations = window.Store.state.conversations || [];
    const query = (chatSearchQuery || '').toLowerCase().trim();

    const filtered = conversations.filter(c => {
      if (!query) return true;
      const nameMatch = (c.partnerName || '').toLowerCase().includes(query);
      const titleMatch = (c.listingTitle || '').toLowerCase().includes(query);
      const msgMatch = (c.lastMessage || '').toLowerCase().includes(query);
      return nameMatch || titleMatch || msgMatch;
    });

    if (filtered.length === 0) {
      inboxContainer.innerHTML = `
        <div style="padding: 2rem 1rem; text-align: center; color: var(--text-secondary); font-size: 0.85rem;">
          ${query ? 'No conversations found matching "' + query + '"' : 'No conversations yet. Open a marketplace listing to start chatting!'}
        </div>
      `;
      return;
    }

    inboxContainer.innerHTML = filtered.map(c => {
      const isActive = c.id === activeChatConversationId;
      const unreadCount = parseInt(c.unreadCount, 10) || 0;
      const isUnread = unreadCount > 0;
      const initials = (c.partnerName || 'Student').split(' ').map(p => p[0]).join('').substr(0, 2).toUpperCase();

      return `
        <div class="chat-inbox-item ${isActive ? 'active' : ''} ${isUnread ? 'unread' : ''}" onclick="window.selectChatConversation('${c.id}')">
          <div class="chat-inbox-avatar">
            ${initials}
            <span style="position:absolute; bottom:0; right:0; width:9px; height:9px; border-radius:50%; background:#10B981; border:2px solid white;"></span>
          </div>
          <div class="chat-inbox-info">
            <div class="chat-inbox-top">
              <span class="chat-inbox-name">${c.partnerName}</span>
              <span class="chat-inbox-time">${c.lastMessageTime || ''}</span>
            </div>
            <div class="chat-inbox-bottom">
              <span class="chat-inbox-preview">${c.lastMessage || 'Tap to send a message...'}</span>
              ${isUnread ? `<span class="chat-unread-badge">${unreadCount}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    updateChatNavBadge();
  }

  function renderChatMessages(conv) {
    const msgContainer = document.getElementById('chat-messages-container');
    if (!msgContainer || !conv) return;

    const messages = conv.messages || [];
    const currentUser = window.Store.state.currentUser;

    if (messages.length === 0) {
      msgContainer.innerHTML = `
        <div style="margin:auto; text-align:center; padding: 2rem 1rem; color: var(--text-secondary);">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">💬</div>
          <div style="font-weight:700; color:var(--obsidian); margin-bottom:0.25rem;">Start the Conversation</div>
          <div style="font-size:0.85rem;">Discuss meetup locations, inspect condition, or negotiate fair campus pricing safely.</div>
        </div>
      `;
      return;
    }

    msgContainer.innerHTML = messages.map(m => {
      const isMine = m.sender === 'mine' || m.sender_id === currentUser.id;
      let statusHtml = '';
      if (isMine) {
        if (m.status === 'sending') {
          statusHtml = `<span class="msg-status-icon" title="Sending...">⏳</span>`;
        } else if (m.status === 'failed') {
          statusHtml = `<span class="msg-status-failed">⚠️ Failed · <span class="chat-retry-btn" onclick="window.retryMessage('${m.clientMessageId || m.id}')">Retry</span></span>`;
        } else if (m.status === 'read') {
          statusHtml = `<span class="msg-status-icon" style="color:#60A5FA;" title="Read">✓✓</span>`;
        } else if (m.status === 'delivered') {
          statusHtml = `<span class="msg-status-icon" title="Delivered">✓✓</span>`;
        } else {
          statusHtml = `<span class="msg-status-icon" title="Sent">✓</span>`;
        }
      }

      let attachmentHtml = '';
      if (m.attachments && m.attachments.length > 0) {
        attachmentHtml = m.attachments.map(att => `
          <img src="${att.url || att}" class="chat-attachment-img" alt="Attachment" onclick="window.open('${att.url || att}', '_blank')" />
        `).join('');
      }

      return `
        <div class="chat-bubble ${isMine ? 'mine' : 'theirs'}">
          ${attachmentHtml}
          <div>${m.text || m.content || ''}</div>
          <div class="chat-msg-meta">
            <span>${m.time || ''}</span>
            ${statusHtml}
          </div>
        </div>
      `;
    }).join('');

    // Older messages button state
    const loadOlderBox = document.getElementById('chat-load-older-container');
    if (loadOlderBox) {
      loadOlderBox.style.display = messages.length >= 25 ? 'block' : 'none';
    }

    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function handlePartnerTyping(name, isTyping) {
    const indicator = document.getElementById('chat-typing-indicator');
    const nameEl = document.getElementById('chat-typing-name');
    const statusText = document.getElementById('chat-partner-status-text');

    if (!indicator) return;

    if (isTyping) {
      if (nameEl) nameEl.textContent = name;
      indicator.style.display = 'inline-flex';
      if (statusText) {
        statusText.textContent = 'Typing...';
        statusText.style.color = 'var(--primary-crimson)';
      }
      clearTimeout(chatPartnerTypingTimer);
      chatPartnerTypingTimer = setTimeout(() => {
        indicator.style.display = 'none';
        if (statusText) {
          statusText.textContent = '● Online';
          statusText.style.color = '#059669';
        }
      }, 3500);
    } else {
      indicator.style.display = 'none';
      if (statusText) {
        statusText.textContent = '● Online';
        statusText.style.color = '#059669';
      }
    }
  }

  // User chat actions
  window.selectChatConversation = (convId) => {
    if (activeChatSubscription && window.SupaChat) {
      window.SupaChat.unsubscribeChatChannel();
      activeChatSubscription = null;
    }
    renderChat(convId);
  };

  window.handleChatSearch = (query) => {
    chatSearchQuery = query;
    renderChatInbox();
  };

  window.syncChatInbox = async () => {
    if (window.Store.syncConversationsWithBackend) {
      await window.Store.syncConversationsWithBackend();
    }
    renderChatInbox();
    showToast('Conversations refreshed.');
  };

  window.handleChatAttachment = (input) => {
    const file = input.files && input.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB limit.');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      chatCurrentAttachment = {
        dataUrl: e.target.result,
        name: file.name,
        size: file.size
      };

      const previewBox = document.getElementById('chat-attachment-preview');
      if (previewBox) {
        previewBox.innerHTML = `
          <img src="${chatCurrentAttachment.dataUrl}" style="width:36px; height:36px; object-fit:cover; border-radius:6px; border:1px solid var(--border-color);">
          <span style="font-size:0.8rem; font-weight:600; color:var(--obsidian);">${file.name}</span>
          <button type="button" class="btn btn-ghost btn-xs" onclick="window.removeChatAttachment()" style="margin-left:auto; color:#ef4444;">✕ Remove</button>
        `;
        previewBox.style.display = 'flex';
      }
    };
    reader.readAsDataURL(file);
  };

  window.removeChatAttachment = () => {
    chatCurrentAttachment = null;
    const input = document.getElementById('chat-file-input');
    if (input) input.value = '';
    const previewBox = document.getElementById('chat-attachment-preview');
    if (previewBox) previewBox.style.display = 'none';
  };

  window.retryMessage = (msgId) => {
    window.Store.retryFailedMessage(activeChatConversationId, msgId);
    const conv = window.Store.state.conversations.find(c => c.id === activeChatConversationId);
    renderChatMessages(conv);
  };

  window.loadOlderMessages = async () => {
    const conv = window.Store.state.conversations.find(c => c.id === activeChatConversationId);
    if (!conv || !conv.messages || conv.messages.length === 0) return;

    const oldest = conv.messages[0];
    if (!oldest || !oldest.created_at) return;

    const btn = document.getElementById('btn-load-older-messages');
    if (btn) btn.textContent = 'Loading...';

    if (window.SupaChat && typeof window.SupaChat.fetchMessages === 'function') {
      const res = await window.SupaChat.fetchMessages(conv.id, { limit: 20, beforeCursor: oldest.created_at });
      if (res && res.success && res.data && res.data.length > 0) {
        const currentUser = window.Store.state.currentUser;
        const olderFormatted = res.data.map(m => ({
          id: m.id,
          clientMessageId: m.client_message_id,
          conversation_id: conv.id,
          sender: m.sender_id === currentUser.id ? 'mine' : 'theirs',
          sender_id: m.sender_id,
          text: m.content || m.text,
          content: m.content || m.text,
          attachments: m.attachments || [],
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          created_at: m.created_at,
          status: m.status || 'sent'
        }));

        conv.messages = [...olderFormatted, ...conv.messages];
        window.Store.saveState();
        renderChatMessages(conv);
      } else {
        const loadOlderBox = document.getElementById('chat-load-older-container');
        if (loadOlderBox) loadOlderBox.style.display = 'none';
      }
    }

    if (btn) btn.textContent = '↑ Load Older Messages';
  };

  window.startChatFromListing = (listingId) => {
    if (!listingId) {
      navigate('chat');
      return;
    }

    const listing = window.Store.state.listings.find(l => l.id === listingId);
    if (!listing) {
      navigate('chat');
      return;
    }

    const currentUser = window.Store.state.currentUser;
    const sellerId = listing.seller_id || (listing.seller && listing.seller.id);

    if (sellerId && currentUser && (sellerId === currentUser.id || (currentUser.enrollment && listing.seller?.enrollment === currentUser.enrollment))) {
      showCampusToast('This is your own listing. You cannot chat with yourself.', 'warning');
      return;
    }

    const res = window.Store.createOrFindConversation(sellerId || 'ea7fbb68-db0b-43e8-92b1-297bfde7f92b', listing.id);
    if (res && res.conversation) {
      navigate('chat', res.conversation.id);
    } else {
      navigate('chat');
    }
  };

  // Send message event wiring
  const btnSendMessage = document.getElementById('btn-send-chat-msg');
  const chatInput = document.getElementById('chat-msg-input');
  if (btnSendMessage && chatInput) {
    const handleSend = () => {
      const txt = chatInput.value.trim();
      const hasAttachment = Boolean(chatCurrentAttachment);
      if (!txt && !hasAttachment) return;

      const attachments = chatCurrentAttachment ? [{
        url: chatCurrentAttachment.dataUrl,
        name: chatCurrentAttachment.name,
        type: 'image'
      }] : [];

      const clientMsgId = 'cmsg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      window.Store.sendMessage(activeChatConversationId, txt, window.Store.state.currentUser, {
        clientMessageId: clientMsgId,
        attachments: attachments
      });

      // Clear input and attachment
      chatInput.value = '';
      window.removeChatAttachment();

      // Clear typing indicator signal
      if (window.SupaChat && window.SupaChat.sendTypingIndicator) {
        window.SupaChat.sendTypingIndicator(activeChatConversationId, {
          userId: window.Store.state.currentUser.id,
          userName: window.Store.state.currentUser.name,
          isTyping: false
        });
      }

      // Optimistic instant re-render
      const currentConv = window.Store.state.conversations.find(c => c.id === activeChatConversationId);
      renderChatMessages(currentConv);
      renderChatInbox();
    };

    btnSendMessage.addEventListener('click', handleSend);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });

    // Debounced typing indicator broadcast
    chatInput.addEventListener('input', () => {
      if (window.SupaChat && window.SupaChat.sendTypingIndicator) {
        window.SupaChat.sendTypingIndicator(activeChatConversationId, {
          userId: window.Store.state.currentUser.id,
          userName: window.Store.state.currentUser.name,
          isTyping: true
        });

        clearTimeout(chatTypingTimer);
        chatTypingTimer = setTimeout(() => {
          window.SupaChat.sendTypingIndicator(activeChatConversationId, {
            userId: window.Store.state.currentUser.id,
            userName: window.Store.state.currentUser.name,
            isTyping: false
          });
        }, 2500);
      }
    });
  }

  // Chat Quick Actions
  window.chatQuickAction = (action) => {
    if (action === 'make-offer') {
      const conv = window.Store.state.conversations.find(c => c.id === activeChatConversationId);
      if (conv) {
        window.openMakeOfferModal({
          id: conv.listingId,
          title: conv.listingTitle,
          price: conv.listingPrice
        });
      }
    } else if (action === 'propose-exchange') {
      const conv = window.Store.state.conversations.find(c => c.id === activeChatConversationId);
      if (conv) {
        const item = window.Store.state.listings.find(l => l.id === conv.listingId) || {
          id: conv.listingId,
          title: conv.listingTitle,
          price: conv.listingPrice,
          images: [conv.listingImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80']
        };
        window.openProposeExchangeModal(item);
      }
    } else if (action === 'arrange-meetup') {
      const place = prompt('Suggest a verified campus meetup location:', 'Central Library Steps');
      if (place) {
        window.Store.sendMessage(activeChatConversationId, `📍 Suggested Meetup: Let's meet at ${place} tomorrow after class!`);
        renderChat(activeChatConversationId);
      }
    } else if (action === 'mark-complete') {
      if (confirm('Mark this campus transaction as successfully completed?')) {
        window.Store.sendMessage(activeChatConversationId, `✓ Transaction completed. Pleasure dealing with you!`);
        renderChat(activeChatConversationId);
        showToast('Transaction completed and logged to student profile.');
      }
    }
  };

  // Block Chat Partner
  window.blockChatPartner = () => {
    const conv = window.Store.state.conversations.find(c => c.id === activeChatConversationId);
    const targetId = conv ? (conv.partnerId || 'user-shubham') : 'user-shubham';
    const partnerName = conv ? conv.partnerName : 'Student';
    if (confirm(`Are you sure you want to block ${partnerName}? They will no longer be able to message you or view your offers.`)) {
      const res = window.Store.blockUser(targetId);
      if (res.success) {
        showToast(`${partnerName} has been blocked.`);
      } else {
        alert(res.error || 'Unable to block user.');
      }
    }
  };

  // Abuse Report Modal Handling
  let currentReportTarget = null;

  window.openReportModal = (targetType, targetId, targetTitle) => {
    currentReportTarget = { targetType, targetId, targetTitle };
    const modal = document.getElementById('modal-report');
    if (!modal) return;
    const label = document.getElementById('report-target-label');
    if (label) {
      label.textContent = `[${(targetType || 'item').toUpperCase()}] ${targetTitle || targetId || 'Campus Item'}`;
    }
    const descInput = document.getElementById('report-desc-input');
    if (descInput) descInput.value = '';
    modal.classList.add('active');
  };

  window.openReportListing = () => {
    if (activeProductModalItem) {
      window.closeModal('modal-product-detail');
      window.openReportModal('listing', activeProductModalItem.id, activeProductModalItem.title);
    }
  };

  const btnSubmitReport = document.getElementById('btn-submit-report');
  if (btnSubmitReport) {
    btnSubmitReport.onclick = () => {
      if (!currentReportTarget) return;
      const reasonSelect = document.getElementById('report-reason-select');
      const descInput = document.getElementById('report-desc-input');
      const reason = reasonSelect ? reasonSelect.value : 'Other';
      const description = descInput ? descInput.value.trim() : '';

      const res = window.Store.submitReport({
        targetType: currentReportTarget.targetType,
        targetId: currentReportTarget.targetId,
        reason: reason,
        description: description
      });

      if (res.success) {
        window.closeModal('modal-report');
        showToast('Report submitted. Thank you for keeping campus safe.');
      } else {
        alert(res.error || 'Failed to submit report.');
      }
    };
  }

  // =========================================================================
  // ACADEMIC RESOURCES (/resources)
  // =========================================================================
  function renderResources() {
    const list = window.Store.state.resources;
    const saved = window.Store.state.currentUser.savedResources || [];

    let filtered = list.filter(r => {
      if (resourceBranch !== 'all' && r.branch !== 'All Branches' && r.branch !== resourceBranch) return false;
      if (resourceSemester !== 'all' && r.semester.toString() !== resourceSemester) return false;
      if (resourceType !== 'all' && r.resourceType !== resourceType) return false;
      if (resourceSearch) {
        const q = resourceSearch.toLowerCase();
        return r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      }
      return true;
    });

    const grid = document.getElementById('resources-grid');
    if (!grid) return;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">📚</div>
          <h3 class="empty-state-title">No academic resources found</h3>
          <p class="empty-state-sub">Try changing your semester or branch filters, or be the first to upload lecture notes or solved PYQs for this course.</p>
          <button class="btn btn-primary" onclick="window.openUploadResourceModal()">+ Upload Resource</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(r => {
      const isSaved = saved.includes(r.id);
      return `
        <div class="resource-card" onclick="window.openResourceViewerModal('${r.id}')">
          <div>
            <div class="resource-top">
              <div class="resource-file-icon">${ICONS.fileText}</div>
              <div style="display:flex; gap:0.4rem; align-items:center;">
                <span class="badge-tag">${r.resourceType}</span>
                <button class="btn-ghost" style="padding:0.2rem;" onclick="event.stopPropagation(); window.toggleSaveResource('${r.id}')" title="Save Resource">
                  ${isSaved ? ICONS.heartFilled : ICONS.heart}
                </button>
              </div>
            </div>
            <h4 class="resource-title">${r.title}</h4>
            <div class="resource-meta-strip">
              <span><strong>${r.branch}</strong></span>
              <span>·</span>
              <span>Sem ${r.semester}</span>
              <span>·</span>
              <span>${r.pages} pgs (${r.fileSize})</span>
            </div>
            <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.45; margin-bottom:1.25rem;">
              ${(r.description || '').substring(0, 110)}...
            </p>
          </div>
          <div class="resource-footer">
            <span class="badge-verified">${ICONS.check} ${(r.uploadedBy && r.uploadedBy.name) ? r.uploadedBy.name : 'Verified Student'}</span>
            <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); window.openResourceViewerModal('${r.id}')">
              ${ICONS.download} View / Download
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.toggleSaveResource = (id) => {
    window.Store.toggleSaveResource(id);
    renderResources();
    showToast('Saved resource to your collection.');
  };

  window.openResourceViewerModal = (id) => {
    const res = window.Store.state.resources.find(r => r.id === id);
    if (!res) return;

    activeResourceModalItem = res;
    const modal = document.getElementById('modal-resource-viewer');
    if (!modal) return;

    document.getElementById('res-viewer-title').textContent = res.title;
    document.getElementById('res-viewer-meta').textContent = `${res.branch} · Semester ${res.semester} · ${res.resourceType} · Uploaded by ${res.uploadedBy.name}`;
    document.getElementById('res-viewer-desc').textContent = res.description;
    document.getElementById('res-viewer-pages').textContent = `${res.pages} Pages Verified Document`;

    document.getElementById('btn-download-resource').onclick = () => {
      showToast(`Downloading "${res.title}.pdf" (${res.fileSize})...`);
    };

    modal.classList.add('active');
  };

  window.openReportCurrentResource = () => {
    if (activeResourceModalItem) {
      window.closeModal('modal-resource-viewer');
      window.openReportModal('resource', activeResourceModalItem.id, activeResourceModalItem.title);
    }
  };

  window.openUploadResourceModal = () => {
    const modal = document.getElementById('modal-upload-resource');
    if (!modal) return;

    document.getElementById('btn-publish-resource').onclick = () => {
      const title = document.getElementById('upload-res-title').value.trim();
      const subject = document.getElementById('upload-res-subject').value.trim();
      const branch = document.getElementById('upload-res-branch').value;
      const sem = parseInt(document.getElementById('upload-res-sem').value, 10);
      const type = document.getElementById('upload-res-type').value;
      const desc = document.getElementById('upload-res-desc').value.trim();

      if (!title || !subject) {
        alert('Please fill in the resource title and subject.');
        return;
      }

      const result = window.Store.addResource({
        title,
        subject,
        branch,
        semester: sem,
        resourceType: type,
        fileType: 'PDF',
        pages: 36,
        fileSize: '4.5 MB',
        description: desc || 'Academic notes shared for peer study and review.'
      });

      if (!result.success) {
        alert(result.error || 'Failed to publish academic resource.');
        return;
      }

      closeModal('modal-upload-resource');
      renderResources();
      showToast('Academic resource published and shared with RGPV peers!');
    };

    modal.classList.add('active');
  };

  // =========================================================================
  // OPPORTUNITIES & CLUBS DIRECTORY (/opportunities)
  // =========================================================================
  function renderOpportunities() {
    const opps = window.Store.state.opportunities;
    const clubs = window.Store.state.clubs;
    const followed = window.Store.state.currentUser.followedClubs || [];
    const savedOpps = window.Store.state.currentUser.savedOpportunities || [];

    const container = document.getElementById('opportunities-content-area');
    if (!container) return;

    if (oppTab === 'discover') {
      let filtered = opps.filter(o => {
        if (oppFilterCategory !== 'all' && o.category !== oppFilterCategory) return false;
        if (oppSearch) {
          const q = oppSearch.toLowerCase();
          return o.title.toLowerCase().includes(q) || o.organization.toLowerCase().includes(q) || o.description.toLowerCase().includes(q);
        }
        return true;
      });

      container.innerHTML = `
        <div class="opp-grid">
          ${filtered.map(opp => {
            const isSaved = savedOpps.includes(opp.id);
            return `
              <div class="opp-card">
                <div>
                  <div class="opp-header">
                    <span class="badge-tag">${opp.category}</span>
                    <div style="display:flex; align-items:center; gap:0.4rem;">
                      <span class="opp-deadline-pill">${opp.deadline}</span>
                      <button class="btn-ghost" style="padding:0.2rem;" onclick="window.toggleSaveOpp('${opp.id}')" title="Save">
                        ${isSaved ? ICONS.heartFilled : ICONS.heart}
                      </button>
                    </div>
                  </div>
                  <div class="opp-org-name">${opp.organization}</div>
                  <h3 class="opp-title">${opp.title}</h3>
                  <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.5; margin-bottom:1.25rem;">
                    ${opp.description}
                  </p>
                  <div style="background:var(--soft-bg); padding:0.75rem 1rem; border-radius:var(--radius-md); font-size:0.8rem; margin-bottom:1.25rem;">
                    <div><strong>Eligibility:</strong> ${opp.eligibility}</div>
                    <div style="margin-top:0.25rem;"><strong>Rewards / Prize:</strong> ${opp.prize}</div>
                  </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:1rem;">
                  <span style="font-size:0.8rem; color:var(--text-secondary);">📅 ${opp.date}</span>
                  <a href="${opp.officialLink}" target="_blank" class="btn btn-sm btn-primary">
                    Register / Official Page ${ICONS.externalLink}
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (oppTab === 'clubs') {
      let filteredClubs = clubs.filter(c => {
        if (oppFilterCategory !== 'all' && c.category !== oppFilterCategory) return false;
        if (oppSearch) {
          const q = oppSearch.toLowerCase();
          return c.name.toLowerCase().includes(q) || c.about.toLowerCase().includes(q);
        }
        return true;
      });

      container.innerHTML = `
        <div class="club-card-grid">
          ${filteredClubs.map(club => {
            const isFollowing = followed.includes(club.id);
            return `
              <div class="club-card">
                <div>
                  <div class="club-header">
                    <div class="club-logo">${club.logo}</div>
                    <div>
                      <h4 style="font-size:1.15rem; font-weight:700;">${club.name}</h4>
                      <div style="font-size:0.8rem; color:var(--text-secondary);">${club.category} · ${club.members} students</div>
                    </div>
                  </div>
                  <div style="font-size:0.85rem; font-weight:600; color:var(--primary-crimson); margin-bottom:0.5rem;">
                    “${club.tagline}”
                  </div>
                  <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.45; margin-bottom:1.25rem;">
                    ${club.about}
                  </p>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:1rem;">
                  <button class="btn btn-sm ${isFollowing ? 'btn-secondary' : 'btn-primary'}" onclick="window.toggleClubFollow('${club.id}')">
                    ${isFollowing ? '✓ Following' : '+ Follow Club'}
                  </button>
                  <button class="btn btn-sm btn-ghost" onclick="window.openClubModal('${club.id}')">
                    Explore Links →
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (oppTab === 'saved') {
      const savedItems = opps.filter(o => savedOpps.includes(o.id));
      if (savedItems.length === 0) {
        container.innerHTML = `
          <div class="empty-state-box">
            <div class="empty-state-icon">📌</div>
            <h3 class="empty-state-title">No saved opportunities yet</h3>
            <p class="empty-state-sub">Save hackathons, events, or workshops to track their registration deadlines in one place.</p>
            <button class="btn btn-secondary" onclick="window.setOppTab('discover')">Explore Discover Feed</button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="opp-grid">
            ${savedItems.map(opp => `
              <div class="opp-card">
                <div>
                  <div class="opp-header">
                    <span class="badge-tag">${opp.category}</span>
                    <span class="opp-deadline-pill">${opp.deadline}</span>
                  </div>
                  <div class="opp-org-name">${opp.organization}</div>
                  <h3 class="opp-title">${opp.title}</h3>
                  <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">${opp.description}</p>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:1rem;">
                  <span style="font-size:0.8rem; color:var(--text-secondary);">📅 ${opp.date}</span>
                  <a href="${opp.officialLink}" target="_blank" class="btn btn-sm btn-primary">
                    Register ${ICONS.externalLink}
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    }
  }

  window.setOppTab = (tab) => {
    oppTab = tab;
    document.querySelectorAll('#opp-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-opp-tab') === tab) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    renderOpportunities();
  };

  window.toggleClubFollow = (clubId) => {
    window.Store.toggleFollowClub(clubId);
    renderOpportunities();
    showToast('Updated club notification preferences.');
  };

  window.toggleSaveOpp = (oppId) => {
    window.Store.toggleSaveOpportunity(oppId);
    renderOpportunities();
    showToast('Updated saved opportunities.');
  };

  window.openClubModal = (clubId) => {
    const club = window.Store.state.clubs.find(c => c.id === clubId);
    if (!club) return;

    const modal = document.getElementById('modal-club-detail');
    if (!modal) return;

    document.getElementById('modal-club-logo').textContent = club.logo;
    document.getElementById('modal-club-name').textContent = club.name;
    document.getElementById('modal-club-meta').textContent = `${club.category} · ${club.members} Active Members`;
    document.getElementById('modal-club-about').textContent = club.about;

    document.getElementById('link-club-web').href = club.socialLinks.website;
    document.getElementById('link-club-insta').href = club.socialLinks.instagram;
    document.getElementById('link-club-wa').href = club.socialLinks.whatsapp;
    document.getElementById('link-club-reg').href = club.socialLinks.registration;

    modal.classList.add('active');
  };

  // =========================================================================
  // PROFILE CONTROLLER (/profile)
  // =========================================================================
  let profileActiveTab = 'listings';

  async function renderProfile() {
    const user = window.Store.state.currentUser;

    document.getElementById('prof-avatar').textContent = user.avatar || (user.name ? user.name.slice(0, 2).toUpperCase() : 'ST');
    document.getElementById('prof-name').textContent = user.name || 'Campus Student';
    document.getElementById('prof-program').textContent = `${user.program || 'B.Tech'} ${user.branchCode || ''} · ${user.batch || '2026'}`;
    document.getElementById('prof-phone').textContent = user.phone || '—';
    document.getElementById('prof-enrollment').textContent = user.enrollment || '—';
    document.getElementById('prof-deals-count').textContent = user.transactions || 0;
    document.getElementById('prof-rating').textContent = (user.rating || 5.0) + ' ★';

    const tabContainer = document.getElementById('profile-tab-content');
    if (!tabContainer) return;

    if (profileActiveTab === 'listings') {
      if (window.Store && typeof window.Store.loadMyListings === 'function') {
        await window.Store.loadMyListings();
      }
      const myItems = window.Store.state.myListings || [];

      if (myItems.length === 0) {
        tabContainer.innerHTML = `
          <div class="empty-state-box">
            <div class="empty-state-icon">📦</div>
            <h3 class="empty-state-title">No listings found</h3>
            <p class="empty-state-sub">List books, lab supplies or calculators you no longer need.</p>
            <button class="btn btn-primary" onclick="window.openCreateListingModal()">+ Create Listing</button>
          </div>
        `;
      } else {
        tabContainer.innerHTML = `
          <div class="product-grid">
            ${myItems.map(item => {
              const isSold = item.status === 'sold';
              const isExchanged = item.status === 'exchanged';
              const isActive = item.status === 'active';
              return `
                <div class="product-card">
                  <div class="product-image-box">
                    <img src="${item.images[0]}" alt="${item.title}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80';">
                    <span class="product-type-badge badge-${item.listingType}">${item.listingType}</span>
                    <span class="badge-tag" style="position:absolute; bottom:8px; left:8px; ${isSold ? 'background:#ef4444; color:white;' : isExchanged ? 'background:#8b5cf6; color:white;' : 'background:rgba(0,0,0,0.7); color:white;'}">
                      ${item.status.toUpperCase()}
                    </span>
                  </div>
                  <div class="product-content">
                    <div>
                      <h4 class="product-title">${item.title}</h4>
                      <div class="product-price-row">
                        <span class="product-price">${item.price === 0 ? 'Free' : '₹' + item.price}</span>
                        <span class="product-condition">· ${item.condition}</span>
                      </div>
                    </div>
                    <div style="margin-top:0.75rem; border-top:1px solid var(--border-light); padding-top:0.6rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.4rem;">
                      <span class="${isActive ? 'badge-green' : isSold ? 'badge-tag' : 'badge-amber'}" style="${isSold ? 'background:#ef4444; color:white;' : ''}">
                        ${isActive ? ICONS.check + ' Active' : item.status.toUpperCase()}
                      </span>
                      <div style="display:flex; gap:0.35rem;">
                        ${isActive ? `
                          <button class="btn btn-sm btn-ghost" onclick="window.handleEditPrice('${item.id}', ${item.price})" title="Edit Price">✏️ Edit</button>
                          <button class="btn btn-sm btn-ghost" onclick="window.handleMarkSold('${item.id}')">Mark Sold</button>
                        ` : `
                          <button class="btn btn-sm btn-ghost" onclick="window.handleReactivateListing('${item.id}')">Reactivate</button>
                        `}
                        <button class="btn btn-sm btn-ghost" style="color:#b91c1c;" onclick="window.handleDeleteListing('${item.id}')" title="Delete Listing">🗑️</button>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }
    } else if (profileActiveTab === 'exchanges') {
      const exchs = window.Store.state.exchanges || [];
      if (exchs.length === 0) {
        tabContainer.innerHTML = `
          <div class="empty-state-box">
            <div class="empty-state-icon">🔄</div>
            <h3 class="empty-state-title">No exchange proposals yet</h3>
            <p class="empty-state-sub">When you propose or receive a barter trade with another student, proposals will appear here.</p>
            <button class="btn btn-primary" onclick="window.navigateTo('marketplace')">Explore Marketplace</button>
          </div>
        `;
      } else {
        tabContainer.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            ${exchs.map(e => `
              <div style="background:var(--pure-white); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.5rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                  <div>
                    <span class="badge-tag">Proposal: ${e.id}</span>
                    <span style="font-size:0.8rem; color:var(--text-secondary); margin-left:0.5rem;">${e.date}</span>
                  </div>
                  <span class="badge-${e.status === 'accepted' ? 'green' : 'amber'}">${e.status.toUpperCase()}</span>
                </div>

                <!-- Barter Visual -->
                <div class="exchange-barter-box">
                  <div class="exchange-item-side">
                    <span style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase;">Target Item</span>
                    <div style="font-weight:700; font-size:1.05rem;">${e.targetListingTitle}</div>
                    <div style="font-size:0.85rem; color:var(--primary-crimson); font-weight:600;">₹${e.targetListingPrice}</div>
                  </div>

                  <div class="exchange-swap-icon">${ICONS.swap}</div>

                  <div class="exchange-item-side">
                    <span style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase;">Offered Item</span>
                    <div style="font-weight:700; font-size:1.05rem;">${e.proposerItemTitle}</div>
                    <div style="font-size:0.85rem; color:var(--primary-crimson); font-weight:600;">
                      ₹${e.proposerItemPrice} ${e.cashDifference > 0 ? `(+ ₹${e.cashDifference} Cash)` : ''}
                    </div>
                  </div>
                </div>

                <div style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:1rem; font-style:italic;">
                  “${e.note}”
                </div>

                ${e.status === 'pending' ? `
                  <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
                    <button class="btn btn-sm btn-ghost" onclick="window.Store.updateExchangeStatus('${e.id}', 'rejected'); window.renderProfile();">Reject</button>
                    <button class="btn btn-sm btn-secondary" onclick="window.Store.updateExchangeStatus('${e.id}', 'countered'); window.renderProfile();">Counter Offer</button>
                    <button class="btn btn-sm btn-primary" onclick="window.Store.updateExchangeStatus('${e.id}', 'accepted'); window.renderProfile();">Accept Exchange</button>
                  </div>
                ` : `
                  <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.85rem;">
                    <span style="color:var(--text-secondary);">Meetup planned at campus location.</span>
                    <button class="btn btn-sm btn-secondary" onclick="window.navigateTo('chat')">Open Meetup Chat →</button>
                  </div>
                `}
              </div>
            `).join('')}
          </div>
        `;
      }
    } else if (profileActiveTab === 'resources') {
      const myRes = (window.Store.state.resources || []).filter(r => r.uploadedBy && r.uploadedBy.name === user.name);
      if (myRes.length === 0) {
        tabContainer.innerHTML = `
          <div class="empty-state-box">
            <div class="empty-state-icon">📚</div>
            <h3 class="empty-state-title">No uploaded resources</h3>
            <p class="empty-state-sub">Share your handwritten notes, formula cheat sheets, or solved question papers.</p>
            <button class="btn btn-primary" onclick="window.openUploadResourceModal()">+ Upload Resource</button>
          </div>
        `;
      } else {
        tabContainer.innerHTML = `
          <div class="resource-grid">
            ${myRes.map(res => `
              <div class="resource-card">
                <div>
                  <div class="resource-top">
                    <div class="resource-file-icon">${ICONS.fileText}</div>
                    <span class="badge-tag">${res.resourceType}</span>
                  </div>
                  <h4 class="resource-title">${res.title}</h4>
                  <div class="resource-meta-strip">
                    <span>${res.branch}</span>
                    <span>·</span>
                    <span>Sem ${res.semester}</span>
                    <span>·</span>
                    <span>${res.downloads} downloads</span>
                  </div>
                </div>
                <div class="resource-footer">
                  <span class="badge-green">${ICONS.check} Verified Notes</span>
                  <button class="btn btn-sm btn-secondary" onclick="window.openResourceViewerModal('${res.id}')">View</button>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    } else if (profileActiveTab === 'saved') {
      const favListings = (window.Store.state.listings || []).filter(l => (user.savedListings || []).includes(l.id));
      if (favListings.length === 0) {
        tabContainer.innerHTML = `
          <div class="empty-state-box">
            <div class="empty-state-icon">🔖</div>
            <h3 class="empty-state-title">No bookmarked items</h3>
            <p class="empty-state-sub">Tap the heart icon on any listing in the marketplace to bookmark it for later.</p>
            <button class="btn btn-primary" onclick="window.navigateTo('marketplace')">Explore Marketplace</button>
          </div>
        `;
      } else {
        tabContainer.innerHTML = `
          <div class="product-grid">
            ${favListings.map(item => `
              <div class="product-card" onclick="window.openProductDetailModal('${item.id}')">
                <div class="product-image-box">
                  <img src="${item.images[0]}" alt="${item.title}">
                  <span class="product-type-badge badge-${item.listingType}">${item.listingType}</span>
                </div>
                <div class="product-content">
                  <div>
                    <h4 class="product-title">${item.title}</h4>
                    <div class="product-price-row">
                      <span class="product-price">₹${item.price}</span>
                    </div>
                  </div>
                  <div class="product-card-footer">
                    <span class="product-location">${ICONS.mapPin} ${item.meetupLocation}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    } else if (profileActiveTab === 'clubs') {
      const followedClubs = window.Store.state.clubs.filter(c => (user.followedClubs || []).includes(c.id));
      tabContainer.innerHTML = `
        <div class="club-card-grid">
          ${followedClubs.map(c => `
            <div class="club-card">
              <div class="club-header">
                <div class="club-logo">${c.logo}</div>
                <div>
                  <h4 style="font-size:1.15rem; font-weight:700;">${c.name}</h4>
                  <div style="font-size:0.8rem; color:var(--text-secondary);">${c.category} · ${c.members} members</div>
                </div>
              </div>
              <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">${c.about}</p>
              <button class="btn btn-sm btn-secondary" onclick="window.openClubModal('${c.id}')">View Club Details →</button>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  window.renderProfile = renderProfile;

  window.setProfileTab = (tab) => {
    profileActiveTab = tab;
    document.querySelectorAll('#profile-tabs-nav .tab-btn').forEach(b => {
      if (b.getAttribute('data-prof-tab') === tab) b.classList.add('active');
      else b.classList.remove('active');
    });
    renderProfile();
  };

  // Reset Demo Action
  window.resetCampusDemo = () => {
    if (confirm('Reset demo state back to default seed data?')) {
      window.Store.resetDemo();
      showToast('Demo data reset to factory state.');
      syncNavHeader();
      navigate('home');
    }
  };

  // =========================================================================
  // NOTIFICATIONS MODAL
  // =========================================================================
  window.openNotificationsModal = () => {
    const modal = document.getElementById('modal-notifications');
    if (!modal) return;

    const notifs = window.Store.state.notifications;
    const listEl = document.getElementById('notifications-list');

    listEl.innerHTML = notifs.map(n => `
      <div style="display:flex; gap:0.9rem; padding:1rem; border-bottom:1px solid var(--border-light); background:${n.unread ? 'var(--warm-ivory)' : 'transparent'}; border-radius:var(--radius-sm);">
        <div style="font-size:1.4rem;">${n.icon}</div>
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.2rem;">
            <strong style="font-size:0.92rem;">${n.title}</strong>
            <span style="font-size:0.75rem; color:var(--text-secondary);">${n.time}</span>
          </div>
          <div style="font-size:0.85rem; color:var(--text-secondary);">${n.desc}</div>
        </div>
      </div>
    `).join('');

    window.Store.markAllNotificationsRead();
    syncNavHeader();
    modal.classList.add('active');
  };

  // Generic modal close
  window.closeModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  };

  // Close modals on escape or backdrop click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });

  // Set up listeners for routing (desktop navbar, mobile navigation, and any [data-route] elements)
  document.addEventListener('click', (e) => {
    const navTarget = e.target.closest('[data-route]');
    if (navTarget) {
      e.preventDefault();
      const r = navTarget.getAttribute('data-route');
      if (r) {
        navigate(r);
      }
    }
  });

  // Set up marketplace filter inputs
  const marketSearchInput = document.getElementById('market-search-input');
  let marketSearchDebounce = null;
  if (marketSearchInput) {
    marketSearchInput.addEventListener('input', (e) => {
      marketSearch = e.target.value;
      clearTimeout(marketSearchDebounce);
      marketSearchDebounce = setTimeout(() => {
        renderMarketplace();
      }, 250);
    });
  }

  const marketCatChips = document.querySelectorAll('.category-chip');
  marketCatChips.forEach(chip => {
    chip.addEventListener('click', () => {
      marketCatChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      marketCategory = chip.getAttribute('data-cat') || 'all';
      renderMarketplace();
    });
  });

  const marketSortSelect = document.getElementById('market-sort-select');
  if (marketSortSelect) {
    marketSortSelect.addEventListener('change', (e) => {
      marketSort = e.target.value;
      renderMarketplace();
    });
  }

  const marketConditionSelect = document.getElementById('market-condition-select');
  if (marketConditionSelect) {
    marketConditionSelect.addEventListener('change', (e) => {
      marketCondition = e.target.value;
      renderMarketplace();
    });
  }

  const marketLocationSelect = document.getElementById('market-location-select');
  if (marketLocationSelect) {
    marketLocationSelect.addEventListener('change', (e) => {
      marketLocation = e.target.value;
      renderMarketplace();
    });
  }

  // Academic filters
  const resSearchInput = document.getElementById('resource-search-input');
  if (resSearchInput) {
    resSearchInput.addEventListener('input', (e) => {
      resourceSearch = e.target.value;
      renderResources();
    });
  }

  const resBranchSelect = document.getElementById('resource-branch-select');
  if (resBranchSelect) {
    resBranchSelect.addEventListener('change', (e) => {
      resourceBranch = e.target.value;
      renderResources();
    });
  }

  const resSemSelect = document.getElementById('resource-sem-select');
  if (resSemSelect) {
    resSemSelect.addEventListener('change', (e) => {
      resourceSemester = e.target.value;
      renderResources();
    });
  }

  const resTypeSelect = document.getElementById('resource-type-select');
  if (resTypeSelect) {
    resTypeSelect.addEventListener('change', (e) => {
      resourceType = e.target.value;
      renderResources();
    });
  }

  // Opportunities filters
  const oppSearchInput = document.getElementById('opp-search-input');
  if (oppSearchInput) {
    oppSearchInput.addEventListener('input', (e) => {
      oppSearch = e.target.value;
      renderOpportunities();
    });
  }

  const oppCatSelect = document.getElementById('opp-category-filter');
  if (oppCatSelect) {
    oppCatSelect.addEventListener('change', (e) => {
      oppFilterCategory = e.target.value;
      renderOpportunities();
    });
  }

  // Auto-restore Supabase session on app startup & subscribe to Realtime marketplace updates
  async function initSupabaseSession() {
    if (window.SupaAuth) {
      try {
        const active = await window.SupaAuth.getActiveSession();
        if (active && active.profile && active.profile.is_verified) {
          console.info('Restored verified Supabase session:', active.profile.enrollment_no);
          let fn = active.profile.full_name || active.profile.name;
          let branch = active.profile.branch;
          let program = active.profile.program || 'B.Tech';
          let batch = active.profile.batch || '2026-30';

          if (!fn || fn === 'Verified Student' || fn.startsWith('Verified Student') || !branch || branch === 'Engineering') {
            const rec = await window.Store.lookupStudentAsync(active.profile.enrollment_no);
            if (rec && rec.found && rec.student) {
              fn = rec.student.name || rec.student.full_name || fn;
              branch = rec.student.branch || branch;
              program = rec.student.program || program;
              batch = rec.student.batch || batch;
            }
          }

          if (fn && !fn.startsWith('Verified Student')) {
            const initials = fn.split(' ').filter(Boolean).map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'ST';
            const bCode = branch ? branch.split(' ').filter(Boolean).map(w => w[0]).join('') : 'ENG';

            window.Store.state.currentUser = {
              id: active.user.id || 'user-' + (active.profile.enrollment_no || '').toLowerCase(),
              isVerified: true,
              enrollment: active.profile.enrollment_no,
              name: fn,
              full_name: fn,
              program: program,
              branch: branch,
              branchCode: bCode,
              batch: batch,
              phone: active.profile.phone || '+91 98765 43210',
              avatar: initials,
              rating: 5.0,
              transactions: 0,
              verificationBadge: 'Campus Verified',
              followedClubs: window.Store.state.currentUser.followedClubs || ['coding-club', 'gdsc-rgpv'],
              savedListings: [],
              savedResources: [],
              savedOpportunities: ['opp-1']
            };
            window.Store.saveState();
            syncNavHeader();
          }
        }
      } catch (err) {
        console.warn('Could not auto-restore session:', err);
      }

      // Preload marketplace listings from Supabase
      try {
        await window.Store.loadMarketplaceListings();
        if (currentRoute === 'landing') renderLanding();
        if (currentRoute === 'home') renderHome();
      } catch (loadErr) {
        console.warn('Marketplace preload:', loadErr);
      }

      // Supabase Realtime subscription on public.listings
      try {
        window.SupaAuth.subscribeToListings((payload) => {
          console.info('Realtime listing change event:', payload);
          if (currentRoute === 'marketplace') {
            renderMarketplace();
          } else if (currentRoute === 'landing') {
            window.Store.loadMarketplaceListings().then(() => renderLanding());
          } else if (currentRoute === 'home') {
            window.Store.loadMarketplaceListings().then(() => renderHome());
          }
          if (currentRoute === 'profile') {
            renderProfile();
          }
        });
      } catch (rtErr) {
        console.warn('Realtime subscription not active:', rtErr);
      }
    }
  }

  // Sign out handler
  window.signOutUser = async () => {
    if (confirm('Are you sure you want to sign out of your campus account?')) {
      if (window.SupaAuth) {
        await window.SupaAuth.signOut();
      }
      window.Store.state.currentUser.isVerified = false;
      window.Store.state.currentUser.name = 'Campus Guest';
      window.Store.state.currentUser.enrollment = '';
      window.Store.saveState();
      syncNavHeader();
      navigate('landing');
      showToast('Signed out of campus session.');
    }
  // =========================================================================
  // CAMPUS ADMIN & CLUB PRESIDENT MANAGEMENT SYSTEM
  // =========================================================================

  let currentEventsCategory = 'all';
  let currentEventsSearch = '';
  let currentClubsCategory = 'all';
  let currentClubsSearch = '';
  let currentClubAdminTab = 'events';
  let currentAdminTab = 'dashboard';
  let activeDetailEventId = null;

  // Developer Role Switcher Handler
  window.handleRoleSwitch = function(roleValue) {
    const updatedUser = window.Store.switchRole(roleValue);
    syncNavHeader();
    showCampusToast(`Active role switched to ${updatedUser.name} (${updatedUser.role})`, 'info');

    // Route access guard verification
    if (currentRoute === 'admin' && updatedUser.role !== 'SUPER_ADMIN') {
      navigate('home');
    } else if (currentRoute === 'club-admin' && updatedUser.role !== 'CLUB_PRESIDENT' && updatedUser.role !== 'SUPER_ADMIN') {
      navigate('home');
    } else {
      if (currentRoute === 'events') renderEvents();
      if (currentRoute === 'clubs') renderClubs();
      if (currentRoute === 'club-admin') renderClubAdmin();
      if (currentRoute === 'admin') renderAdmin();
    }
  };

  // Events View Controller
  window.handleEventsSearch = function() {
    const input = document.getElementById('events-search-input');
    currentEventsSearch = input ? input.value.trim().toLowerCase() : '';
    renderEvents();
  };

  window.filterEventsCategory = function(cat) {
    currentEventsCategory = cat;
    document.querySelectorAll('#events-category-chips .filter-pill').forEach(pill => {
      if (pill.getAttribute('onclick')?.includes(`'${cat}'`)) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
    renderEvents();
  };

  function renderEvents() {
    const container = document.getElementById('events-grid-container');
    if (!container) return;

    const user = window.Store.state.currentUser;
    const isPresOrAdmin = user && (user.role === 'CLUB_PRESIDENT' || user.role === 'SUPER_ADMIN');
    
    // Toggle "+ Create Event" action button in header
    const createBtn = document.getElementById('btn-events-create-action');
    if (createBtn) {
      createBtn.style.display = isPresOrAdmin ? 'inline-flex' : 'none';
    }

    const events = window.Store.getEvents({
      category: currentEventsCategory,
      search: currentEventsSearch
    });

    if (events.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: #FFFFFF; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📅</div>
          <h3 class="font-serif" style="font-size: 1.4rem; color: var(--text-main); margin-bottom: 0.5rem;">No Events Found</h3>
          <p style="color: #64748B; font-size: 0.95rem; max-width: 420px; margin: 0 auto 1.5rem;">There are no scheduled events matching your filter criteria. Check back soon for upcoming hackathons and workshops.</p>
          ${isPresOrAdmin ? `<button class="btn btn-primary" onclick="window.openCreateEventModal()">+ Create New Event</button>` : ''}
        </div>
      `;
      return;
    }

    container.innerHTML = events.map(evt => {
      const club = window.Store.getClubById(evt.clubId);
      const isRegistered = window.Store.isRegisteredForEvent(evt.id);
      const isFull = (evt.registrationsCount || 0) >= (evt.maxParticipants || 100);
      const isPastDeadline = evt.registrationDeadline && new Date(evt.registrationDeadline) < new Date();
      
      const startDate = evt.startDate ? new Date(evt.startDate) : new Date();
      const dateFormatted = startDate.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const timeFormatted = startDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      });

      let statusBadge = '';
      if (evt.status === 'PUBLISHED') {
        statusBadge = `<span class="badge-status badge-status-published">Published</span>`;
      } else if (evt.status === 'PENDING_APPROVAL') {
        statusBadge = `<span class="badge-status badge-status-pending">Pending Review</span>`;
      } else if (evt.status === 'REJECTED') {
        statusBadge = `<span class="badge-status badge-status-rejected">Rejected</span>`;
      } else if (evt.status === 'CANCELLED') {
        statusBadge = `<span class="badge-status" style="background:#F1F5F9; color:#64748B;">Cancelled</span>`;
      }

      return `
        <div class="campus-event-card">
          <div style="position: relative; height: 160px; overflow: hidden; background: #0F172A;">
            <img src="${evt.posterImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'}" alt="${evt.title}" style="width:100%; height:100%; object-fit: cover; opacity: 0.9;">
            <div style="position: absolute; top: 10px; left: 10px; display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <span class="badge badge-tag" style="background: rgba(15, 23, 42, 0.75); color: #FFF; backdrop-filter: blur(4px);">${evt.category}</span>
              ${statusBadge}
            </div>
            <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #FFF; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">
              👥 ${evt.registrationsCount || 0} / ${evt.maxParticipants} Registered
            </div>
          </div>
          <div class="campus-event-body">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="font-size: 1.1rem;">${club ? club.logo : '🏛️'}</span>
              <span style="font-size: 0.82rem; font-weight: 600; color: #64748B;">${club ? club.name : 'Campus Club'}</span>
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem; line-height: 1.35;">${evt.title}</h3>
            <p style="font-size: 0.85rem; color: #475569; line-height: 1.5; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${evt.description}
            </p>
            <div style="font-size: 0.82rem; color: #64748B; margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.35rem;">
              <div>📅 <strong>${dateFormatted}</strong> at ${timeFormatted}</div>
              <div>📍 <strong>Venue:</strong> ${evt.venue || 'Central Campus'}</div>
            </div>
            <div style="display: flex; gap: 0.6rem; align-items: center; margin-top: auto;">
              <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="CampusApp.viewEventDetails('${evt.id}')">View Details</button>
              ${evt.status === 'PUBLISHED' ? `
                ${isRegistered ? `
                  <button class="btn btn-sm" style="background:#DCFCE7; color:#166534; border:1px solid #BBF7D0; cursor:default;" disabled>✓ Registered</button>
                ` : isFull ? `
                  <button class="btn btn-sm" style="background:#F1F5F9; color:#64748B; border:1px solid #E2E8F0;" disabled>Full</button>
                ` : isPastDeadline ? `
                  <button class="btn btn-sm" style="background:#F1F5F9; color:#64748B; border:1px solid #E2E8F0;" disabled>Closed</button>
                ` : `
                  <button class="btn btn-primary btn-sm" onclick="CampusApp.quickRegister('${evt.id}')">Register</button>
                `}
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Clubs Directory Controller
  window.handleClubsSearch = function() {
    const input = document.getElementById('clubs-search-input');
    currentClubsSearch = input ? input.value.trim().toLowerCase() : '';
    renderClubs();
  };

  window.filterClubsCategory = function(cat) {
    currentClubsCategory = cat;
    document.querySelectorAll('#view-clubs .filter-pill').forEach(pill => {
      if (pill.getAttribute('onclick')?.includes(`'${cat}'`)) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
    renderClubs();
  };

  function renderClubs() {
    const container = document.getElementById('clubs-grid-container');
    if (!container) return;

    let clubs = window.Store.state.clubs || [];
    if (currentClubsCategory !== 'all') {
      clubs = clubs.filter(c => c.category && c.category.toLowerCase() === currentClubsCategory.toLowerCase());
    }
    if (currentClubsSearch) {
      clubs = clubs.filter(c => 
        (c.name && c.name.toLowerCase().includes(currentClubsSearch)) ||
        (c.tagline && c.tagline.toLowerCase().includes(currentClubsSearch)) ||
        (c.description && c.description.toLowerCase().includes(currentClubsSearch))
      );
    }

    if (clubs.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: #FFFFFF; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🏛️</div>
          <h3 class="font-serif" style="font-size: 1.4rem; color: var(--text-main); margin-bottom: 0.5rem;">No Clubs Match Your Criteria</h3>
          <p style="color: #64748B; font-size: 0.95rem; max-width: 420px; margin: 0 auto 1.5rem;">Try a different search keyword or category filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = clubs.map(c => {
      const isFollowed = window.Store.isClubFollowed(c.id);
      const clubEvents = (window.Store.state.events || []).filter(e => e.clubId === c.id && e.status === 'PUBLISHED');

      return `
        <div class="campus-club-card">
          <div class="club-cover-strip" style="background-image: url('${c.coverImage || ''}'); background-size: cover; background-position: center;"></div>
          <div class="club-card-content">
            <div class="club-avatar-overlap">${c.logo || '🏛️'}</div>
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 0.25rem;">
              <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--text-main); margin:0;">${c.name}</h3>
              <span class="badge badge-tag">${c.category}</span>
            </div>
            <p style="font-size: 0.85rem; color: #64748B; font-weight: 500; margin-bottom: 0.75rem;">${c.tagline || 'Campus Student Society'}</p>
            <p style="font-size: 0.85rem; color: #334155; line-height: 1.5; margin-bottom: 1rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
              ${c.description}
            </p>

            <div style="margin-bottom: 1.25rem; font-size: 0.82rem; color: #64748B; border-top: 1px solid var(--border-color); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
              <div>
                ${c.presidentName ? `
                  <span>🎖️ <strong>${c.presidentName}</strong></span>
                ` : `
                  <span style="color: #F59E0B; font-weight: 600;">Leadership Open</span>
                `}
              </div>
              <div>
                <span>👥 ${c.followersCount || 0} Followers</span>
              </div>
            </div>

            <div style="display: flex; gap: 0.5rem; margin-top: auto;">
              <button class="btn btn-sm ${isFollowed ? 'btn-secondary' : 'btn-primary'}" style="flex: 1;" onclick="CampusApp.toggleFollowClub('${c.id}')">
                ${isFollowed ? '✓ Following' : '+ Follow'}
              </button>
              <button class="btn btn-secondary btn-sm" onclick="CampusApp.filterEventsByClub('${c.id}')">
                Events (${clubEvents.length})
              </button>
              ${!c.presidentName ? `
                <button class="btn btn-ghost btn-sm" title="Apply for leadership" onclick="window.openRequestPresidentModal('${c.id}')">
                  Apply 🎖️
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Club President Dashboard Controller
  window.setClubAdminTab = function(tab) {
    currentClubAdminTab = tab;
    document.querySelectorAll('.admin-subnav-item[data-club-tab]').forEach(btn => {
      if (btn.getAttribute('data-club-tab') === tab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    renderClubAdminTabContent();
  };

  function renderClubAdmin() {
    const user = window.Store.state.currentUser;
    // Multi-tenant club resolution
    let clubId = user.assignedClubId;
    if (user.role === 'SUPER_ADMIN' && !clubId) {
      clubId = 'coding-club'; // Default fallback for super admin in club admin view
    }

    const club = window.Store.getClubById(clubId);
    if (!club) {
      const banner = document.getElementById('club-admin-banner');
      if (banner) banner.style.display = 'none';
      const stats = document.getElementById('club-admin-stats-grid');
      if (stats) stats.style.display = 'none';
      document.getElementById('club-admin-tab-content').innerHTML = `
        <div style="text-align: center; padding: 4rem 1.5rem; background: #FFFFFF; border-radius: 12px; border: 1px solid var(--border-color); margin-top: 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🏛️</div>
          <h3 class="font-serif">No Club Assigned to Your Presidency</h3>
          <p style="color: #64748B; margin-bottom: 1.5rem;">Your account is not currently linked to an active campus club. Submit a leadership request or contact Campus Admin.</p>
          <button class="btn btn-primary" onclick="window.openRequestPresidentModal()">Request Leadership →</button>
        </div>
      `;
      return;
    }

    const banner = document.getElementById('club-admin-banner');
    if (banner) banner.style.display = 'block';
    const stats = document.getElementById('club-admin-stats-grid');
    if (stats) stats.style.display = 'grid';

    // Update banner
    const logoEl = document.getElementById('club-admin-logo');
    const titleEl = document.getElementById('club-admin-title');
    const descEl = document.getElementById('club-admin-desc');
    if (logoEl) logoEl.textContent = club.logo || '🏛️';
    if (titleEl) titleEl.textContent = `${club.name} — President Console`;
    if (descEl) descEl.textContent = `Strict multi-tenant club boundary active. You are managing ${club.name}. Actions are logged.`;

    // Metrics Ribbon
    const myEvents = (window.Store.state.events || []).filter(e => e.clubId === club.id);
    const totalRegs = myEvents.reduce((sum, e) => sum + (e.registrationsCount || 0), 0);
    const myAnnouncements = (window.Store.state.announcements || []).filter(a => a.clubId === club.id);

    const m1 = document.getElementById('club-stat-members');
    const m2 = document.getElementById('club-stat-events');
    const m3 = document.getElementById('club-stat-regs');
    const m4 = document.getElementById('club-stat-followers');
    const m5 = document.getElementById('club-stat-announcements');

    if (m1) m1.textContent = club.members || 50;
    if (m2) m2.textContent = myEvents.length;
    if (m3) m3.textContent = totalRegs;
    if (m4) m4.textContent = club.followersCount || 0;
    if (m5) m5.textContent = myAnnouncements.length;

    renderClubAdminTabContent();
  }

  function renderClubAdminTabContent() {
    const container = document.getElementById('club-admin-tab-content');
    if (!container) return;

    const user = window.Store.state.currentUser;
    const clubId = user.assignedClubId || (user.role === 'SUPER_ADMIN' ? 'coding-club' : null);
    const club = window.Store.getClubById(clubId);
    if (!club) return;

    if (currentClubAdminTab === 'events') {
      const myEvents = (window.Store.state.events || []).filter(e => e.clubId === club.id);
      container.innerHTML = `
        <div style="background: #FFFFFF; border-radius: var(--radius-lg); border: 1px solid var(--border-color); overflow: hidden; padding: 1.5rem; margin-top: 1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.25rem;">
            <div>
              <h3 class="font-serif" style="font-size: 1.25rem; margin:0;">Club Events & Competitions</h3>
              <p style="font-size: 0.85rem; color: #64748B; margin: 0.25rem 0 0 0;">Events created are submitted to Campus Admin for official publication.</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.openCreateEventModal('${club.id}')">+ New Event</button>
          </div>

          ${myEvents.length === 0 ? `
            <div style="text-align:center; padding: 3rem 1rem; color: #64748B;">
              <p>No events submitted yet for ${club.name}. Click "+ New Event" to create your first event proposal.</p>
            </div>
          ` : `
            <div style="overflow-x:auto;">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Event Title</th>
                    <th>Category</th>
                    <th>Schedule</th>
                    <th>Registrations</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${myEvents.map(e => {
                    let badge = '';
                    if (e.status === 'PUBLISHED') badge = '<span class="badge-status badge-status-published">Published</span>';
                    else if (e.status === 'PENDING_APPROVAL') badge = '<span class="badge-status badge-status-pending">Pending Approval</span>';
                    else if (e.status === 'REJECTED') badge = `<span class="badge-status badge-status-rejected" title="${e.rejectionReason || ''}">Rejected</span>`;
                    else if (e.status === 'CANCELLED') badge = '<span class="badge-status" style="background:#F1F5F9; color:#64748B;">Cancelled</span>';

                    return `
                      <tr>
                        <td>
                          <strong>${e.title}</strong>
                          ${e.rejectionReason ? `<div style="font-size:0.78rem; color:#DC2626; margin-top:0.2rem;">Reason: ${e.rejectionReason}</div>` : ''}
                        </td>
                        <td>${e.category}</td>
                        <td style="font-size:0.82rem;">${new Date(e.startDate).toLocaleDateString('en-IN')}</td>
                        <td><strong>${e.registrationsCount || 0}</strong> / ${e.maxParticipants}</td>
                        <td>${badge}</td>
                        <td>
                          <div style="display:flex; gap:0.4rem;">
                            <button class="btn btn-ghost btn-sm" onclick="CampusApp.viewEventDetails('${e.id}')">View</button>
                            ${e.status !== 'CANCELLED' ? `
                              <button class="btn btn-ghost btn-sm" style="color:#DC2626;" onclick="CampusApp.handleCancelEvent('${e.id}')">Cancel</button>
                            ` : ''}
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      `;
    } else if (currentClubAdminTab === 'announcements') {
      const myAnn = (window.Store.state.announcements || []).filter(a => a.clubId === club.id);
      container.innerHTML = `
        <div style="background: #FFFFFF; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.5rem; margin-top: 1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.25rem;">
            <div>
              <h3 class="font-serif" style="font-size: 1.25rem; margin:0;">Club Announcements</h3>
              <p style="font-size: 0.85rem; color: #64748B; margin: 0.25rem 0 0 0;">Broadcast notices directly to students and club followers.</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.openCreateAnnouncementModal('${club.id}')">+ Broadcast Announcement</button>
          </div>

          ${myAnn.length === 0 ? `
            <div style="text-align:center; padding: 3rem 1rem; color: #64748B;">
              <p>No announcements published yet. Click above to send your first message.</p>
            </div>
          ` : `
            <div style="display:flex; flex-direction:column; gap:1rem;">
              ${myAnn.map(a => `
                <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem; background: #F8FAFC;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                      <span class="badge ${a.priority === 'urgent' || a.priority === 'URGENT' ? 'badge-status-rejected' : 'badge-status-published'}">
                        ${a.priority === 'urgent' || a.priority === 'URGENT' ? '🚨 Urgent Alert' : 'Normal'}
                      </span>
                      <h4 style="margin:0; font-size: 1.05rem;">${a.title}</h4>
                    </div>
                    <button class="btn btn-ghost btn-sm" style="color:#DC2626;" onclick="CampusApp.handleDeleteAnnouncement('${a.id}')">Delete</button>
                  </div>
                  <p style="font-size: 0.9rem; color: #334155; line-height: 1.5; margin: 0 0 0.5rem 0;">${a.message || a.content}</p>
                  <div style="font-size: 0.78rem; color: #64748B;">Published on ${new Date(a.publishedAt || a.createdAt).toLocaleString('en-IN')}</div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
    } else if (currentClubAdminTab === 'details') {
      container.innerHTML = `
        <div style="background: #FFFFFF; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.5rem; margin-top: 1.25rem;">
          <h3 class="font-serif" style="font-size: 1.25rem; margin-bottom: 1rem;">Club Profile & Governance</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; font-size: 0.9rem;">
            <div><strong>Club Name:</strong> ${club.name}</div>
            <div><strong>Category:</strong> ${club.category}</div>
            <div><strong>Assigned President:</strong> ${club.presidentName || 'Unassigned'} (${club.presidentId || 'N/A'})</div>
            <div><strong>Active Members:</strong> ${club.members || 50}</div>
            <div style="grid-column: 1 / -1;"><strong>Description:</strong> ${club.description}</div>
          </div>
        </div>
      `;
    } else if (currentClubAdminTab === 'analytics') {
      container.innerHTML = `
        <div style="background: #FFFFFF; border-radius: var(--radius-lg); border: 1px solid var(--border-color); padding: 1.5rem; margin-top: 1.25rem;">
          <h3 class="font-serif" style="font-size: 1.25rem; margin-bottom: 1rem;">Engagement & Registration Analytics</h3>
          <p style="color: #64748B; font-size: 0.9rem;">Student participation metrics are computed in real-time across your club's events and follower subscriptions.</p>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div style="background: #F8FAFC; padding: 1.25rem; border-radius: 8px; border: 1px solid var(--border-color); text-align: center;">
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary-crimson);">${club.followersCount || 0}</div>
              <div style="font-size: 0.8rem; color: #64748B; text-transform: uppercase; font-weight: 600;">Student Subscribers</div>
            </div>
            <div style="background: #F8FAFC; padding: 1.25rem; border-radius: 8px; border: 1px solid var(--border-color); text-align: center;">
              <div style="font-size: 1.8rem; font-weight: 800; color: #10B981;">98%</div>
              <div style="font-size: 0.8rem; color: #64748B; text-transform: uppercase; font-weight: 600;">Verified Enrollment Rate</div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Campus Super Admin Console Controller
  window.setAdminTab = function(tab) {
    currentAdminTab = tab;
    document.querySelectorAll('.admin-subnav-item[data-admin-tab]').forEach(btn => {
      if (btn.getAttribute('data-admin-tab') === tab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    renderAdminTabContent();
  };

  function renderAdmin() {
    const user = window.Store.state.currentUser;
    if (user.role !== 'SUPER_ADMIN') {
      showCampusToast('Access Denied: Super Admin role required.', 'error');
      navigate('home');
      return;
    }

    const clubs = window.Store.state.clubs || [];
    const events = window.Store.state.events || [];
    const pendingEvents = events.filter(e => e.status === 'PENDING_APPROVAL');
    const pendingReqs = window.Store.getPresidentRequests('PENDING');
    const presidentsCount = clubs.filter(c => Boolean(c.presidentName)).length;

    // Overview Stats
    const s1 = document.getElementById('stat-total-students');
    const s2 = document.getElementById('stat-total-clubs');
    const s3 = document.getElementById('stat-total-presidents');
    const s4 = document.getElementById('stat-pending-events');
    const s5 = document.getElementById('stat-pending-requests');
    const s6 = document.getElementById('stat-active-opps');

    if (s1) s1.textContent = window.Store.state.roster?.length || 959;
    if (s2) s2.textContent = clubs.length;
    if (s3) s3.textContent = presidentsCount;
    if (s4) s4.textContent = pendingEvents.length;
    if (s5) s5.textContent = pendingReqs.length;
    if (s6) s6.textContent = (window.Store.state.opportunities || []).length;

    // Badges in tabs
    const bEvents = document.getElementById('admin-badge-pending-events');
    const bReqs = document.getElementById('admin-badge-pending-reqs');
    if (bEvents) bEvents.textContent = pendingEvents.length;
    if (bReqs) bReqs.textContent = pendingReqs.length;

    renderAdminTabContent();
  }

  function renderAdminTabContent() {
    const container = document.getElementById('super-admin-tab-content');
    if (!container) return;

    const events = window.Store.state.events || [];
    const pendingEvents = events.filter(e => e.status === 'PENDING_APPROVAL');
    const pendingReqs = window.Store.getPresidentRequests('PENDING');
    const clubs = window.Store.state.clubs || [];

    if (currentAdminTab === 'dashboard') {
      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.25rem;">
          <!-- Pending Events Approval Box -->
          <div style="background:#FFFFFF; border:1px solid var(--border-color); border-radius:12px; padding:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h3 class="font-serif" style="font-size:1.2rem; margin:0;">Pending Event Approvals</h3>
              <span class="badge badge-status-pending">${pendingEvents.length} Pending</span>
            </div>
            ${pendingEvents.length === 0 ? `
              <p style="color:#64748B; font-size:0.9rem;">No events awaiting review. All clear!</p>
            ` : `
              <div style="display:flex; flex-direction:column; gap:0.75rem;">
                ${pendingEvents.slice(0, 3).map(e => `
                  <div style="border:1px solid #E2E8F0; padding:0.9rem; border-radius:8px; background:#F8FAFC;">
                    <div style="font-weight:700; color:var(--text-main); font-size:0.95rem;">${e.title}</div>
                    <div style="font-size:0.8rem; color:#64748B; margin-top:0.2rem;">Hosted by: ${window.Store.getClubById(e.clubId)?.name || 'Club'} · ${e.category}</div>
                    <div style="display:flex; gap:0.5rem; margin-top:0.6rem;">
                      <button class="btn btn-primary btn-sm" onclick="CampusApp.handleApproveEvent('${e.id}')">Approve</button>
                      <button class="btn btn-ghost btn-sm" style="color:#DC2626;" onclick="CampusApp.openRejectionModal('event', '${e.id}')">Reject</button>
                    </div>
                  </div>
                `).join('')}
              </div>
              <button class="btn btn-ghost btn-sm" style="margin-top:1rem;" onclick="window.setAdminTab('event-approvals')">View all approvals →</button>
            `}
          </div>

          <!-- Pending Leadership Applications Box -->
          <div style="background:#FFFFFF; border:1px solid var(--border-color); border-radius:12px; padding:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <h3 class="font-serif" style="font-size:1.2rem; margin:0;">Leadership Applications</h3>
              <span class="badge badge-status-rejected">${pendingReqs.length} Pending</span>
            </div>
            ${pendingReqs.length === 0 ? `
              <p style="color:#64748B; font-size:0.9rem;">No leadership requests waiting for decision.</p>
            ` : `
              <div style="display:flex; flex-direction:column; gap:0.75rem;">
                ${pendingReqs.slice(0, 3).map(r => `
                  <div style="border:1px solid #E2E8F0; padding:0.9rem; border-radius:8px; background:#F8FAFC;">
                    <div style="font-weight:700; color:var(--text-main); font-size:0.95rem;">${r.userName} (${r.userEnrollment})</div>
                    <div style="font-size:0.8rem; color:#64748B; margin-top:0.2rem;">Applying for: <strong>${r.clubName}</strong></div>
                    <div style="font-size:0.82rem; color:#334155; margin-top:0.4rem; font-style:italic;">"${r.reason}"</div>
                    <div style="display:flex; gap:0.5rem; margin-top:0.6rem;">
                      <button class="btn btn-primary btn-sm" onclick="CampusApp.handleApprovePresidentRequest('${r.id}')">Approve</button>
                      <button class="btn btn-ghost btn-sm" style="color:#DC2626;" onclick="CampusApp.openRejectionModal('president_request', '${r.id}')">Reject</button>
                    </div>
                  </div>
                `).join('')}
              </div>
              <button class="btn btn-ghost btn-sm" style="margin-top:1rem;" onclick="window.setAdminTab('president-requests')">View all applications →</button>
            `}
          </div>
        </div>
      `;
    } else if (currentAdminTab === 'event-approvals') {
      container.innerHTML = `
        <div style="background: #FFFFFF; border-radius: 12px; border: 1px solid var(--border-color); padding: 1.5rem; margin-top: 1.25rem;">
          <h3 class="font-serif" style="font-size: 1.25rem; margin-bottom: 0.5rem;">Event Approval Queue</h3>
          <p style="color: #64748B; font-size: 0.85rem; margin-bottom: 1.25rem;">Review and sanction club proposals before publication to university students.</p>

          ${pendingEvents.length === 0 ? `
            <div style="text-align:center; padding: 3rem 1rem; color: #64748B;">All proposed events have been processed. Queue is empty.</div>
          ` : `
            <div style="overflow-x:auto;">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Host Club</th>
                    <th>Event Details</th>
                    <th>Category</th>
                    <th>Schedule & Venue</th>
                    <th>Capacity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${pendingEvents.map(e => `
                    <tr>
                      <td><strong>${window.Store.getClubById(e.clubId)?.name || 'Club'}</strong></td>
                      <td>
                        <strong>${e.title}</strong>
                        <div style="font-size:0.8rem; color:#64748B; margin-top:0.2rem;">${e.description}</div>
                      </td>
                      <td><span class="badge badge-tag">${e.category}</span></td>
                      <td style="font-size:0.82rem;">${new Date(e.startDate).toLocaleDateString('en-IN')}<br>📍 ${e.venue}</td>
                      <td>${e.maxParticipants} seats</td>
                      <td>
                        <div style="display:flex; gap:0.4rem;">
                          <button class="btn btn-primary btn-sm" onclick="CampusApp.handleApproveEvent('${e.id}')">Approve & Publish</button>
                          <button class="btn btn-ghost btn-sm" style="color:#DC2626;" onclick="CampusApp.openRejectionModal('event', '${e.id}')">Reject</button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      `;
    } else if (currentAdminTab === 'president-requests') {
      container.innerHTML = `
        <div style="background: #FFFFFF; border-radius: 12px; border: 1px solid var(--border-color); padding: 1.5rem; margin-top: 1.25rem;">
          <h3 class="font-serif" style="font-size: 1.25rem; margin-bottom: 0.5rem;">Student Leadership Applications</h3>
          <p style="color: #64748B; font-size: 0.85rem; margin-bottom: 1.25rem;">Verified students seeking appointment as authorized Club Presidents.</p>

          ${pendingReqs.length === 0 ? `
            <div style="text-align:center; padding: 3rem 1rem; color: #64748B;">No pending leadership requests.</div>
          ` : `
            <div style="overflow-x:auto;">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Applicant Student</th>
                    <th>Target Club</th>
                    <th>Statement of Intent</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${pendingReqs.map(r => `
                    <tr>
                      <td>
                        <strong>${r.userName}</strong>
                        <div style="font-size:0.8rem; color:#64748B;">Enrollment: ${r.userEnrollment}</div>
                      </td>
                      <td><strong>${r.clubName}</strong></td>
                      <td style="font-size:0.88rem; line-height:1.4;">"${r.reason}"</td>
                      <td style="font-size:0.8rem; color:#64748B;">${new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <div style="display:flex; gap:0.4rem;">
                          <button class="btn btn-primary btn-sm" onclick="CampusApp.handleApprovePresidentRequest('${r.id}')">Approve</button>
                          <button class="btn btn-ghost btn-sm" style="color:#DC2626;" onclick="CampusApp.openRejectionModal('president_request', '${r.id}')">Reject</button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      `;
    } else if (currentAdminTab === 'clubs') {
      container.innerHTML = `
        <div style="background: #FFFFFF; border-radius: 12px; border: 1px solid var(--border-color); padding: 1.5rem; margin-top: 1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.25rem;">
            <div>
              <h3 class="font-serif" style="font-size: 1.25rem; margin:0;">Active Campus Societies</h3>
              <p style="font-size: 0.85rem; color: #64748B; margin: 0.25rem 0 0 0;">Manage registered clubs and appointed club leadership.</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.openCreateClubModal()">+ Register New Club</button>
          </div>

          <div style="overflow-x:auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Club</th>
                  <th>Category</th>
                  <th>Appointed President</th>
                  <th>Followers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${clubs.map(c => `
                  <tr>
                    <td>
                      <div style="display:flex; align-items:center; gap:0.6rem;">
                        <span style="font-size:1.4rem;">${c.logo || '🏛️'}</span>
                        <div>
                          <strong>${c.name}</strong>
                          <div style="font-size:0.78rem; color:#64748B;">Slug: ${c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span class="badge badge-tag">${c.category}</span></td>
                    <td>
                      ${c.presidentName ? `
                        <strong>${c.presidentName}</strong>
                        <div style="font-size:0.75rem; color:#64748B;">ID: ${c.presidentId}</div>
                      ` : `
                        <span style="color:#F59E0B; font-weight:600;">None (Vacant)</span>
                      `}
                    </td>
                    <td>${c.followersCount || 0}</td>
                    <td>
                      <div style="display:flex; gap:0.4rem;">
                        <button class="btn btn-secondary btn-sm" onclick="window.openAssignPresidentModal('${c.id}')">Assign</button>
                        ${c.presidentName ? `
                          <button class="btn btn-ghost btn-sm" style="color:#DC2626;" onclick="CampusApp.handleRevokePresident('${c.id}')">Revoke</button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (currentAdminTab === 'all-events') {
      container.innerHTML = `
        <div style="background: #FFFFFF; border-radius: 12px; border: 1px solid var(--border-color); padding: 1.5rem; margin-top: 1.25rem;">
          <h3 class="font-serif" style="font-size: 1.25rem; margin-bottom: 1.25rem;">Master Campus Events Register</h3>
          <div style="overflow-x:auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Club</th>
                  <th>Status</th>
                  <th>Schedule</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${events.map(e => `
                  <tr>
                    <td><strong>${e.title}</strong></td>
                    <td>${window.Store.getClubById(e.clubId)?.name || 'Club'}</td>
                    <td><span class="badge-status badge-status-${(e.status || '').toLowerCase()}">${e.status}</span></td>
                    <td style="font-size:0.82rem;">${new Date(e.startDate).toLocaleDateString('en-IN')}</td>
                    <td>${e.registrationsCount || 0} / ${e.maxParticipants}</td>
                    <td>
                      <div style="display:flex; gap:0.4rem;">
                        <button class="btn btn-ghost btn-sm" onclick="CampusApp.viewEventDetails('${e.id}')">View</button>
                        ${e.status !== 'CANCELLED' ? `
                          <button class="btn btn-ghost btn-sm" style="color:#DC2626;" onclick="CampusApp.handleCancelEvent('${e.id}')">Cancel</button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (currentAdminTab === 'audit-logs') {
      const logs = window.Store.getAuditLogs();
      container.innerHTML = `
        <div style="background: #FFFFFF; border-radius: 12px; border: 1px solid var(--border-color); padding: 1.5rem; margin-top: 1.25rem;">
          <h3 class="font-serif" style="font-size: 1.25rem; margin-bottom: 0.35rem;">Platform Security & Administrative Audit Trail</h3>
          <p style="color: #64748B; font-size: 0.85rem; margin-bottom: 1.25rem;">Immutable ledger documenting institutional decisions, role grants, and content moderation.</p>

          ${logs.length === 0 ? `
            <div style="text-align:center; padding: 2rem; color: #64748B;">No audit entries logged in this session yet.</div>
          ` : `
            <div style="overflow-x:auto;">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Resource Type</th>
                    <th>Resource ID</th>
                    <th>Metadata Details</th>
                  </tr>
                </thead>
                <tbody>
                  ${logs.map(l => `
                    <tr>
                      <td class="audit-code" style="white-space:nowrap;">${new Date(l.createdAt).toLocaleTimeString('en-IN')}</td>
                      <td style="font-weight:600;">${l.userName}</td>
                      <td><span class="badge-tag">${l.action}</span></td>
                      <td class="audit-code">${l.resourceType}</td>
                      <td class="audit-code">${l.resourceId}</td>
                      <td class="audit-code" style="max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${JSON.stringify(l.metadata || {})}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      `;
    } else {
      container.innerHTML = `
        <div style="background: #FFFFFF; border-radius: 12px; border: 1px solid var(--border-color); padding: 2rem; margin-top: 1.25rem; text-align: center;">
          <h3 class="font-serif">${currentAdminTab.toUpperCase()}</h3>
          <p style="color: #64748B;">Sub-panel active.</p>
        </div>
      `;
    }
  }

  // Campus Application Orchestrator & Modal Operations
  window.CampusApp = {
    showToast: showCampusToast,

    openModal: function(id) {
      const el = document.getElementById(id);
      if (el) el.classList.add('open');
    },

    closeModal: function(id) {
      const el = document.getElementById(id);
      if (el) el.classList.remove('open');
    },

    viewEventDetails: function(eventId) {
      const evt = window.Store.getEventById(eventId);
      if (!evt) return;
      activeDetailEventId = eventId;

      const club = window.Store.getClubById(evt.clubId);
      const isReg = window.Store.isRegisteredForEvent(evt.id);
      const isFull = (evt.registrationsCount || 0) >= (evt.maxParticipants || 100);
      const isPast = evt.registrationDeadline && new Date(evt.registrationDeadline) < new Date();

      document.getElementById('modal-event-title').textContent = evt.title;
      document.getElementById('modal-event-club').textContent = club ? club.name : 'Campus Club';
      document.getElementById('modal-event-category').textContent = evt.category;
      document.getElementById('modal-event-datetime').textContent = new Date(evt.startDate).toLocaleString('en-IN');
      document.getElementById('modal-event-location').textContent = evt.venue;
      document.getElementById('modal-event-capacity').textContent = `${evt.registrationsCount || 0} / ${evt.maxParticipants} Registered`;
      document.getElementById('modal-event-deadline').textContent = evt.registrationDeadline ? new Date(evt.registrationDeadline).toLocaleDateString('en-IN') : 'Open until event';
      document.getElementById('modal-event-description').textContent = evt.description;

      const rejBox = document.getElementById('modal-event-rejection-box');
      if (evt.rejectionReason && rejBox) {
        rejBox.style.display = 'block';
        document.getElementById('modal-event-rejection-text').textContent = evt.rejectionReason;
      } else if (rejBox) {
        rejBox.style.display = 'none';
      }

      const regBtn = document.getElementById('btn-modal-event-register');
      if (regBtn) {
        if (evt.status !== 'PUBLISHED') {
          regBtn.disabled = true;
          regBtn.textContent = evt.status;
        } else if (isReg) {
          regBtn.disabled = true;
          regBtn.textContent = 'Already Registered ✓';
        } else if (isFull) {
          regBtn.disabled = true;
          regBtn.textContent = 'Capacity Reached (Full)';
        } else if (isPast) {
          regBtn.disabled = true;
          regBtn.textContent = 'Registration Closed';
        } else {
          regBtn.disabled = false;
          regBtn.textContent = 'Register Now';
        }
      }

      this.openModal('modal-event-detail');
    },

    quickRegister: function(eventId) {
      const res = window.Store.registerForEvent(eventId);
      if (res.success) {
        showCampusToast(res.message, 'success');
        renderEvents();
        if (currentRoute === 'club-admin') renderClubAdmin();
      } else {
        showCampusToast(res.error, 'error');
      }
    },

    handleEventRegisterFromModal: function() {
      if (!activeDetailEventId) return;
      const res = window.Store.registerForEvent(activeDetailEventId);
      if (res.success) {
        showCampusToast(res.message, 'success');
        this.viewEventDetails(activeDetailEventId);
        renderEvents();
        if (currentRoute === 'club-admin') renderClubAdmin();
      } else {
        showCampusToast(res.error, 'error');
      }
    },

    toggleFollowClub: function(clubId) {
      window.Store.toggleFollowClub(clubId);
      renderClubs();
      if (currentRoute === 'club-admin') renderClubAdmin();
    },

    filterEventsByClub: function(clubId) {
      navigate('events');
      currentEventsSearch = window.Store.getClubById(clubId)?.name || '';
      const input = document.getElementById('events-search-input');
      if (input) input.value = currentEventsSearch;
      renderEvents();
    },

    handleCreateEventSubmit: function() {
      const clubId = document.getElementById('event-input-club')?.value;
      const title = document.getElementById('event-input-title')?.value;
      const category = document.getElementById('event-input-category')?.value;
      const description = document.getElementById('event-input-desc')?.value;
      const startDate = document.getElementById('event-input-date')?.value;
      const endDate = document.getElementById('event-input-end-date')?.value;
      const venue = document.getElementById('event-input-location')?.value;
      const maxParticipants = document.getElementById('event-input-capacity')?.value;
      const registrationDeadline = document.getElementById('event-input-deadline')?.value;
      const posterImage = document.getElementById('event-input-banner')?.value;

      if (!title || !startDate || !venue) {
        return showCampusToast('Please fill all required event details.', 'error');
      }

      const res = window.Store.createEvent({
        clubId,
        title,
        category,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        venue,
        maxParticipants: parseInt(maxParticipants, 10) || 100,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline).toISOString() : null,
        posterImage
      });

      if (res.success) {
        this.closeModal('modal-create-event');
        const user = window.Store.state.currentUser;
        if (user.role === 'SUPER_ADMIN') {
          showCampusToast('Event published successfully!', 'success');
        } else {
          showCampusToast('Event submitted! Placed in PENDING_APPROVAL for Admin review.', 'success');
        }
        if (currentRoute === 'events') renderEvents();
        if (currentRoute === 'club-admin') renderClubAdmin();
        if (currentRoute === 'admin') renderAdmin();
      } else {
        showCampusToast(res.error, 'error');
      }
    },

    handleCreateAnnouncementSubmit: function() {
      const clubId = document.getElementById('announcement-input-club')?.value;
      const priority = document.getElementById('announcement-input-priority')?.value;
      const title = document.getElementById('announcement-input-title')?.value;
      const message = document.getElementById('announcement-input-content')?.value;

      if (!title || !message) {
        return showCampusToast('Please enter both title and message.', 'error');
      }

      const res = window.Store.createAnnouncement({
        clubId,
        priority,
        title,
        message
      });

      if (res.success) {
        this.closeModal('modal-create-announcement');
        showCampusToast('Announcement broadcast successfully!', 'success');
        syncNavHeader();
        if (currentRoute === 'club-admin') renderClubAdmin();
        if (currentRoute === 'admin') renderAdmin();
      } else {
        showCampusToast(res.error, 'error');
      }
    },

    handleDeleteAnnouncement: function(annId) {
      if (!confirm('Are you sure you want to delete this announcement?')) return;
      const res = window.Store.deleteAnnouncement(annId);
      if (res.success) {
        showCampusToast('Announcement removed.', 'info');
        if (currentRoute === 'club-admin') renderClubAdmin();
        if (currentRoute === 'admin') renderAdmin();
      } else {
        showCampusToast(res.error, 'error');
      }
    },

    handleRequestPresidentSubmit: function() {
      const clubId = document.getElementById('req-input-club')?.value;
      const reason = document.getElementById('req-input-statement')?.value;

      if (!clubId || !reason) {
        return showCampusToast('Please select a club and provide a statement of intent.', 'error');
      }

      const res = window.Store.submitPresidentRequest(clubId, reason);
      if (res.success) {
        this.closeModal('modal-request-president');
        showCampusToast('Application submitted to Campus Admin for verification.', 'success');
        syncNavHeader();
        if (currentRoute === 'admin') renderAdmin();
      } else {
        showCampusToast(res.error, 'error');
      }
    },

    openRejectionModal: function(targetType, targetId) {
      document.getElementById('rejection-target-type').value = targetType;
      document.getElementById('rejection-target-id').value = targetId;
      document.getElementById('rejection-input-reason').value = '';
      const titleEl = document.getElementById('rejection-modal-title');
      if (titleEl) {
        titleEl.textContent = targetType === 'event' ? 'Reject Event Proposal' : 'Reject Leadership Application';
      }
      this.openModal('modal-rejection-reason');
    },

    handleRejectionSubmit: function() {
      const targetType = document.getElementById('rejection-target-type')?.value;
      const targetId = document.getElementById('rejection-target-id')?.value;
      const reason = document.getElementById('rejection-input-reason')?.value?.trim();

      if (!reason) {
        return showCampusToast('A rejection reason is required for institutional feedback.', 'error');
      }

      if (targetType === 'event') {
        const res = window.Store.rejectEvent(targetId, reason);
        if (res.success) {
          this.closeModal('modal-rejection-reason');
          showCampusToast('Event proposal rejected with feedback.', 'info');
          if (currentRoute === 'events') renderEvents();
          if (currentRoute === 'admin') renderAdmin();
        } else {
          showCampusToast(res.error, 'error');
        }
      } else if (targetType === 'president_request') {
        const res = window.Store.rejectPresidentRequest(targetId, reason);
        if (res.success) {
          this.closeModal('modal-rejection-reason');
          showCampusToast('President application rejected.', 'info');
          if (currentRoute === 'admin') renderAdmin();
        } else {
          showCampusToast(res.error, 'error');
        }
      }
    },

    handleApproveEvent: function(eventId) {
      const res = window.Store.approveEvent(eventId);
      if (res.success) {
        showCampusToast('Event approved and published to students!', 'success');
        if (currentRoute === 'events') renderEvents();
        if (currentRoute === 'admin') renderAdmin();
      } else {
        showCampusToast(res.error, 'error');
      }
    },

    handleCancelEvent: function(eventId) {
      if (!confirm('Are you sure you want to cancel this event? Registered students will be notified.')) return;
      const res = window.Store.cancelEvent(eventId, 'Event cancelled by organizers.');
      if (res.success) {
        showCampusToast('Event cancelled. Cancellation alerts sent.', 'warning');
        if (currentRoute === 'events') renderEvents();
        if (currentRoute === 'club-admin') renderClubAdmin();
        if (currentRoute === 'admin') renderAdmin();
      } else {
        showCampusToast(res.error, 'error');
      }
    },

    handleApprovePresidentRequest: function(reqId) {
      const res = window.Store.approvePresidentRequest(reqId);
      if (res.success) {
        showCampusToast('Leadership approved! Student promoted to Club President.', 'success');
        syncNavHeader();
        if (currentRoute === 'admin') renderAdmin();
        if (currentRoute === 'clubs') renderClubs();
      } else {
        showCampusToast(res.error, 'error');
      }
    },

    handleRevokePresident: function(clubId) {
      if (!confirm('Are you sure you want to revoke this student\'s presidency?')) return;
      const res = window.Store.revokeClubPresident(clubId, 'Revoked by Campus Administration');
      if (res.success) {
        showCampusToast('President role revoked.', 'info');
        syncNavHeader();
        if (currentRoute === 'admin') renderAdmin();
        if (currentRoute === 'clubs') renderClubs();
      } else {
        showCampusToast(res.error, 'error');
      }
    },

    handleDirectAssignPresidentSubmit: function() {
      const clubId = document.getElementById('assign-input-club')?.value;
      const userIdent = document.getElementById('assign-input-user')?.value?.trim();

      if (!clubId || !userIdent) {
        return showCampusToast('Please specify both club and student email/ID.', 'error');
      }

      const res = window.Store.assignClubPresident(clubId, userIdent, userIdent.split('@')[0]);
      if (res.success) {
        this.closeModal('modal-assign-president');
        showCampusToast('President leadership assigned.', 'success');
        if (currentRoute === 'admin') renderAdmin();
        if (currentRoute === 'clubs') renderClubs();
      } else {
        showCampusToast(res.error, 'error');
      }
    },

    handleCreateClubSubmit: function() {
      const name = document.getElementById('club-input-name')?.value?.trim();
      const id = document.getElementById('club-input-slug')?.value?.trim();
      const category = document.getElementById('club-input-category')?.value;
      const logo = document.getElementById('club-input-badge')?.value?.trim() || '🏛️';
      const tagline = document.getElementById('club-input-tagline')?.value?.trim();
      const description = document.getElementById('club-input-desc')?.value?.trim();

      if (!name || !id || !description) {
        return showCampusToast('Please complete all required club fields.', 'error');
      }

      const res = window.Store.createClub({
        id,
        name,
        category,
        logo,
        tagline,
        description
      });

      if (res.success) {
        this.closeModal('modal-create-club');
        showCampusToast(`Club "${name}" created successfully!`, 'success');
        if (currentRoute === 'clubs') renderClubs();
        if (currentRoute === 'admin') renderAdmin();
      } else {
        showCampusToast(res.error, 'error');
      }
    },

    renderEvents: renderEvents,
    renderClubs: renderClubs,
    renderClubAdmin: renderClubAdmin,
    renderAdmin: renderAdmin
  };

  // Global modal opener bindings
  window.openCreateEventModal = function(preselectedClubId) {
    const user = window.Store.state.currentUser;
    const isPresident = user.role === 'CLUB_PRESIDENT';
    const isAdmin = user.role === 'SUPER_ADMIN';

    if (!isPresident && !isAdmin) {
      return showCampusToast('Only Club Presidents or Campus Admin can create events.', 'error');
    }

    const clubSelect = document.getElementById('event-input-club');
    if (clubSelect) {
      const clubs = window.Store.state.clubs || [];
      clubSelect.innerHTML = clubs.map(c => `
        <option value="${c.id}">${c.name}</option>
      `).join('');

      if (isPresident && user.assignedClubId) {
        clubSelect.value = user.assignedClubId;
        clubSelect.disabled = true; // Multi-tenant lock
      } else if (preselectedClubId) {
        clubSelect.value = preselectedClubId;
        clubSelect.disabled = false;
      } else {
        clubSelect.disabled = false;
      }
    }

    // Default dates
    const now = new Date();
    const tmrw = new Date(now.getTime() + 86400000);
    const tmrwStr = tmrw.toISOString().slice(0, 16);
    const dateInput = document.getElementById('event-input-date');
    const deadlineInput = document.getElementById('event-input-deadline');
    if (dateInput) dateInput.value = tmrwStr;
    if (deadlineInput) deadlineInput.value = tmrwStr;

    CampusApp.openModal('modal-create-event');
  };

  window.openCreateAnnouncementModal = function(preselectedClubId) {
    const user = window.Store.state.currentUser;
    const isPresident = user.role === 'CLUB_PRESIDENT';
    const isAdmin = user.role === 'SUPER_ADMIN';

    if (!isPresident && !isAdmin) {
      return showCampusToast('Only Club Presidents or Campus Admin can broadcast announcements.', 'error');
    }

    const clubSelect = document.getElementById('announcement-input-club');
    if (clubSelect) {
      const clubs = window.Store.state.clubs || [];
      clubSelect.innerHTML = clubs.map(c => `
        <option value="${c.id}">${c.name}</option>
      `).join('');

      if (isAdmin) {
        clubSelect.innerHTML = `<option value="">Entire Campus (All Students)</option>` + clubSelect.innerHTML;
      }

      if (isPresident && user.assignedClubId) {
        clubSelect.value = user.assignedClubId;
        clubSelect.disabled = true;
      } else if (preselectedClubId) {
        clubSelect.value = preselectedClubId;
        clubSelect.disabled = false;
      } else {
        clubSelect.disabled = false;
      }
    }

    CampusApp.openModal('modal-create-announcement');
  };

  window.openRequestPresidentModal = function(preselectedClubId) {
    const clubSelect = document.getElementById('req-input-club');
    if (clubSelect) {
      const clubs = window.Store.state.clubs || [];
      clubSelect.innerHTML = clubs.map(c => `
        <option value="${c.id}">${c.name} (${c.category})</option>
      `).join('');

      if (preselectedClubId) {
        clubSelect.value = preselectedClubId;
      }
    }
    CampusApp.openModal('modal-request-president');
  };

  window.openCreateClubModal = function() {
    if (window.Store.state.currentUser.role !== 'SUPER_ADMIN') {
      return showCampusToast('Only Super Admin can create clubs.', 'error');
    }
    CampusApp.openModal('modal-create-club');
  };

  window.openAssignPresidentModal = function(preselectedClubId) {
    if (window.Store.state.currentUser.role !== 'SUPER_ADMIN') {
      return showCampusToast('Only Super Admin can assign presidents.', 'error');
    }
    const select = document.getElementById('assign-input-club');
    if (select) {
      const clubs = window.Store.state.clubs || [];
      select.innerHTML = clubs.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
      if (preselectedClubId) select.value = preselectedClubId;
    }
    CampusApp.openModal('modal-assign-president');
  };

  // Initialize Application
  function initializeApp() {
    syncNavHeader();
    initGlobalSearch();
    initSupabaseSession();
    initCreateListingImageHandlers();
    renderLanding();

    // Initial Chat Sync & Navigation Badge
    updateChatNavBadge();
    if (window.Store.syncConversationsWithBackend) {
      window.Store.syncConversationsWithBackend();
    }

    // Global Store Listener for Chat events
    window.Store.subscribe((event) => {
      if (!event) return;
      if (['new_message', 'message_sent', 'message_failed', 'new_realtime_message', 'conversation_read', 'conversations_synced'].includes(event.type)) {
        updateChatNavBadge();
        if (currentRoute === 'chat') {
          renderChatInbox();
        }
      }
    });

    // Global Inbox Listener for Realtime Notifications when on other screens
    if (window.SupaChat && typeof window.SupaChat.subscribeToUserInbox === 'function') {
      const curUser = window.Store.state.currentUser;
      if (curUser && curUser.id && curUser.id !== 'user-guest') {
        window.SupaChat.subscribeToUserInbox(curUser.id, (payload) => {
          if (payload && payload.new && payload.new.conversation_id) {
            const convId = payload.new.conversation_id;
            const isInsideConv = (currentRoute === 'chat' && activeChatConversationId === convId);
            if (!isInsideConv) {
              window.Store.addRealtimeMessage(convId, payload.new, curUser.id);
              updateChatNavBadge();
              const snippet = (payload.new.content || 'Sent a message').substr(0, 38);
              showCampusToast(`💬 New Message: "${snippet}"`, 'info');
            }
          }
        });
      }
    }

    // Support initial route from URL hash if provided (#home, #marketplace, #resources, etc.)
    const initialHash = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
    const validRoutes = ['landing', 'home', 'marketplace', 'resources', 'opportunities', 'profile', 'chat', 'verify', 'events', 'clubs', 'club-admin', 'admin'];
    if (initialHash && validRoutes.includes(initialHash)) {
      navigate(initialHash);
    } else {
      navigate('landing');
    }
  }

  // Support browser hash change
  window.addEventListener('hashchange', () => {
    const hashRoute = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
    const validRoutes = ['landing', 'home', 'marketplace', 'resources', 'opportunities', 'profile', 'chat', 'verify', 'events', 'clubs', 'club-admin', 'admin'];
    if (hashRoute && validRoutes.includes(hashRoute) && hashRoute !== currentRoute) {
      navigate(hashRoute, null, false);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
})();

