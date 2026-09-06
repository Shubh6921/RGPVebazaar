/**
 * RGPV UNOFFICIAL — Main Application Router, Controller & UI Renderer
 */

document.addEventListener('DOMContentLoaded', () => {
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

  // Route history stack
  let routeHistory = [];

  // Router
  function navigate(route, param = null, pushHistory = true) {
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
    const openModal = document.querySelector('.modal-overlay.active');
    if (openModal) {
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

    if (user && user.isVerified) {
      if (guestActions) guestActions.style.display = 'none';
      if (userChip) {
        userChip.style.display = 'flex';
        document.getElementById('nav-user-avatar').textContent = user.avatar || 'RS';
        document.getElementById('nav-user-name').textContent = (user.name || user.full_name || 'Student').split(' ')[0];
      }
    } else {
      if (guestActions) guestActions.style.display = 'flex';
      if (userChip) userChip.style.display = 'none';
    }

    // Unread notifications badge
    const unreadCount = window.Store.state.notifications.filter(n => n.unread).length;
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
        showToast('Campus verification complete! Welcome to RGPV Unofficial.');
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
                  <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.45;">${r.uploadedBy.name} · ${r.branch} Sem ${r.semester} · ${r.pages} pages</p>
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
                  <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.45;">${exchItem.seller.name}: ${exchItem.exchangeWish || 'Available for barter swap'}</p>
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
                  <span class="badge-verified">${ICONS.check} ${item.seller.name.split(' ')[0]}</span>
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
              <span class="badge-verified">${ICONS.check} ${res.uploadedBy.name}</span>
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
  function renderMarketplace() {
    const list = window.Store.state.listings;
    const userFavorites = window.Store.state.currentUser.savedListings || [];

    // Filter items
    let filtered = list.filter(item => {
      // Type
      if (marketFilterType !== 'all' && item.listingType !== marketFilterType) return false;
      // Category
      if (marketCategory !== 'all' && item.category.toLowerCase() !== marketCategory.toLowerCase()) return false;
      // Condition
      if (marketCondition !== 'all' && !item.condition.toLowerCase().includes(marketCondition.toLowerCase())) return false;
      // Location
      if (marketLocation !== 'all' && !item.meetupLocation.toLowerCase().includes(marketLocation.toLowerCase())) return false;
      // Search
      if (marketSearch) {
        const q = marketSearch.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      }
      return true;
    });

    // Sorting
    if (marketSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (marketSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    const grid = document.getElementById('market-products-grid');
    if (!grid) return;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🛒</div>
          <h3 class="empty-state-title">No listings match your filters</h3>
          <p class="empty-state-sub">Be the first to list something your campus community might need, or adjust your active category and condition filters.</p>
          <button class="btn btn-primary" onclick="window.openCreateListingModal()">+ Create Listing</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(item => {
      const isFav = userFavorites.includes(item.id);
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
                <span class="badge-verified">${ICONS.check} ${item.seller.name}</span>
                <span class="product-location">${ICONS.mapPin} ${item.meetupLocation}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function setMarketFilterType(type) {
    marketFilterType = type;
    document.querySelectorAll('#marketplace-type-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-type') === type) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    renderMarketplace();
  }
  window.setMarketFilterType = setMarketFilterType;

  window.toggleFavorite = (id) => {
    window.Store.toggleFavoriteListing(id);
    renderMarketplace();
    showToast('Saved to your profile bookmarks.');
  };

  // =========================================================================
  // PRODUCT DETAIL MODAL & INTERACTIONS
  // =========================================================================
  window.openProductDetailModal = (id) => {
    const item = window.Store.state.listings.find(l => l.id === id);
    if (!item) return;

    activeProductModalItem = item;
    const modal = document.getElementById('modal-product-detail');
    if (!modal) return;

    document.getElementById('modal-prod-title').textContent = item.title;
    document.getElementById('modal-prod-price').textContent = item.price === 0 ? 'Free Giveaway' : '₹' + item.price;
    document.getElementById('modal-prod-condition').textContent = item.condition;
    document.getElementById('modal-prod-desc').textContent = item.description;
    const prodImgEl = document.getElementById('modal-prod-image');
    if (prodImgEl) {
      prodImgEl.src = item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80';
      prodImgEl.onerror = function() {
        this.onerror = null;
        this.src = 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80';
      };
    }
    document.getElementById('modal-prod-badge').textContent = item.listingType.toUpperCase();

    // Seller Info
    document.getElementById('modal-seller-name').textContent = item.seller.name;
    document.getElementById('modal-seller-program').textContent = item.seller.program;
    document.getElementById('modal-seller-rating').textContent = `${item.seller.rating} ★ (${item.seller.transactions} campus deals)`;

    // Wishlist for Exchange
    const wishBox = document.getElementById('modal-prod-exchange-wish');
    if (item.listingType === 'exchange' && item.exchangeWish) {
      wishBox.style.display = 'block';
      document.getElementById('modal-prod-wish-text').textContent = item.exchangeWish;
    } else {
      wishBox.style.display = 'none';
    }

    // Action buttons
    const actionChat = document.getElementById('btn-modal-chat');
    const actionOffer = document.getElementById('btn-modal-offer');
    const actionExchange = document.getElementById('btn-modal-exchange');

    if (actionChat) {
      actionChat.onclick = () => {
        closeModal('modal-product-detail');
        navigate('chat', 'conv-shubham');
      };
    }

    if (actionOffer) {
      actionOffer.onclick = () => {
        closeModal('modal-product-detail');
        window.openMakeOfferModal(item);
      };
    }

    if (actionExchange) {
      actionExchange.onclick = () => {
        closeModal('modal-product-detail');
        window.openProposeExchangeModal(item);
      };
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
          setImagePreview(val);
          presetChips.forEach(c => c.classList.remove('active'));
        }
      });
    }

    window._resetListingImage = clearImagePreview;
  }

  // Create Listing Modal
  window.openCreateListingModal = () => {
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

    document.getElementById('btn-publish-listing').onclick = () => {
      const title = document.getElementById('create-listing-title').value.trim();
      const cat = document.getElementById('create-listing-category').value;
      const cond = document.getElementById('create-listing-condition').value;
      const type = document.querySelector('input[name="listing-type"]:checked').value;
      const price = type === 'free' ? 0 : parseInt(document.getElementById('create-listing-price').value || '0', 10);
      const desc = document.getElementById('create-listing-desc').value.trim();
      const wish = document.getElementById('create-listing-wish').value.trim();
      const loc = document.getElementById('create-listing-location').value;

      if (!title) {
        alert('Please provide a listing title.');
        return;
      }

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

      const finalImage = selectedListingImage || categoryImages[cat] || categoryImages['Other'];

      const result = window.Store.addListing({
        title,
        category: cat,
        condition: cond,
        listingType: type,
        price,
        description: desc || 'Item available for campus handover.',
        exchangeWish: wish,
        meetupLocation: loc,
        images: [finalImage]
      });

      if (!result.success) {
        alert(result.error || 'Failed to publish listing.');
        return;
      }

      closeModal('modal-create-listing');
      renderMarketplace();
      showToast('Your listing has been published to campus marketplace!');
    };

    modal.classList.add('active');
  };

  // =========================================================================
  // TRANSACTION CHAT (/chat)
  // =========================================================================
  function renderChat(convId) {
    const conv = window.Store.state.conversations.find(c => c.id === convId) || window.Store.state.conversations[0];
    if (!conv) return;

    activeChatConversationId = conv.id;

    // Header
    document.getElementById('chat-partner-name').textContent = conv.partnerName;
    document.getElementById('chat-partner-program').textContent = conv.partnerProgram;

    // Pinned Listing
    document.getElementById('chat-pinned-title').textContent = conv.listingTitle;
    document.getElementById('chat-pinned-price').textContent = '₹' + conv.listingPrice;
    document.getElementById('chat-pinned-img').src = conv.listingImage;
    document.getElementById('chat-pinned-meetup').textContent = conv.listingMeetup;

    // Messages
    const msgContainer = document.getElementById('chat-messages-container');
    msgContainer.innerHTML = conv.messages.map(m => `
      <div class="chat-bubble ${m.sender}">
        <div>${m.text}</div>
        <div style="font-size:0.7rem; opacity:0.7; text-align:right; margin-top:0.25rem;">${m.time}</div>
      </div>
    `).join('');

    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  // Send message
  const btnSendMessage = document.getElementById('btn-send-chat-msg');
  const chatInput = document.getElementById('chat-msg-input');
  if (btnSendMessage && chatInput) {
    const handleSend = () => {
      const txt = chatInput.value.trim();
      if (!txt) return;
      window.Store.sendMessage(activeChatConversationId, txt);
      chatInput.value = '';
      renderChat(activeChatConversationId);
    };

    btnSendMessage.addEventListener('click', handleSend);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
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
              ${r.description.substring(0, 110)}...
            </p>
          </div>
          <div class="resource-footer">
            <span class="badge-verified">${ICONS.check} ${r.uploadedBy.name}</span>
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

  function renderProfile() {
    const user = window.Store.state.currentUser;

    document.getElementById('prof-avatar').textContent = user.avatar || 'RS';
    document.getElementById('prof-name').textContent = user.name;
    document.getElementById('prof-program').textContent = `${user.program} ${user.branchCode} · ${user.batch}`;
    document.getElementById('prof-phone').textContent = user.phone;
    document.getElementById('prof-enrollment').textContent = user.enrollment;
    document.getElementById('prof-deals-count').textContent = user.transactions;
    document.getElementById('prof-rating').textContent = user.rating;

    const tabContainer = document.getElementById('profile-tab-content');
    if (!tabContainer) return;

    if (profileActiveTab === 'listings') {
      const myItems = window.Store.state.myListings;
      if (myItems.length === 0) {
        tabContainer.innerHTML = `
          <div class="empty-state-box">
            <div class="empty-state-icon">📦</div>
            <h3 class="empty-state-title">No active listings</h3>
            <p class="empty-state-sub">List books, lab supplies or calculators you no longer need.</p>
            <button class="btn btn-primary" onclick="window.openCreateListingModal()">+ Create Listing</button>
          </div>
        `;
      } else {
        tabContainer.innerHTML = `
          <div class="product-grid">
            ${myItems.map(item => `
              <div class="product-card">
                <div class="product-image-box">
                  <img src="${item.images[0]}" alt="${item.title}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80';">
                  <span class="product-type-badge badge-${item.listingType}">${item.listingType}</span>
                </div>
                <div class="product-content">
                  <div>
                    <h4 class="product-title">${item.title}</h4>
                    <div class="product-price-row">
                      <span class="product-price">₹${item.price}</span>
                      <span class="product-condition">· ${item.condition}</span>
                    </div>
                  </div>
                  <div style="margin-top:0.75rem; border-top:1px solid var(--border-light); padding-top:0.5rem; display:flex; justify-content:space-between; align-items:center;">
                    <span class="badge-green">${ICONS.check} Active Listing</span>
                    <button class="btn btn-sm btn-ghost" onclick="alert('Listing marked as sold!')">Mark Sold</button>
                  </div>
                </div>
              </div>
            `).join('')}
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

  // Set up listeners for routing
  document.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const r = el.getAttribute('data-route');
      navigate(r);
    });
  });

  // Set up marketplace filter inputs
  const marketSearchInput = document.getElementById('market-search-input');
  if (marketSearchInput) {
    marketSearchInput.addEventListener('input', (e) => {
      marketSearch = e.target.value;
      renderMarketplace();
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

  // Auto-restore Supabase session on app startup
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

          if (!fn || fn.startsWith('Verified Student')) {
            console.warn('Session has unverified or generic student name, aborting restoration.');
            return;
          }

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
      } catch (err) {
        console.warn('Could not auto-restore session:', err);
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
  };

  // Initialize
  syncNavHeader();
  initGlobalSearch();
  initSupabaseSession();
  initCreateListingImageHandlers();
  renderLanding();

  // If user navigated directly or defaults
  navigate('landing');
});

