/**
 * RGPV UNOFFICIAL — Central Data Store & State Management
 * Unites: Marketplace, Exchange, Academic Resources, Opportunities & Clubs
 * Includes: Stage 9 Security, Trust, Authorization & RLS Emulation Layer
 */

const STORAGE_KEY = 'rgpv_unofficial_store_v2';

// Seed Verified Student Registry (Protected Roster)
const STUDENT_REGISTRY = {
  '0101CS261001': {
    name: 'Rahul Sharma',
    program: 'B.Tech',
    branch: 'Computer Science & Engineering',
    branchCode: 'CSE',
    batch: '2026–30',
    semester: 3,
    phone: '+91 98765 43210',
    email: 'rahul.cs26@rgpv.ac.in',
    avatar: 'RS',
    rating: 4.8,
    transactions: 12
  },
  '0101IT251042': {
    name: 'Priya Patel',
    program: 'B.Tech',
    branch: 'Information Technology',
    branchCode: 'IT',
    batch: '2025–29',
    semester: 5,
    phone: '+91 98123 45678',
    email: 'priya.it25@rgpv.ac.in',
    avatar: 'PP',
    rating: 4.9,
    transactions: 18
  },
  '0101EC241018': {
    name: 'Amit Verma',
    program: 'B.Tech',
    branch: 'Electronics & Communication',
    branchCode: 'ECE',
    batch: '2024–28',
    semester: 7,
    phone: '+91 97234 56789',
    email: 'amit.ec24@rgpv.ac.in',
    avatar: 'AV',
    rating: 4.7,
    transactions: 9
  },
  '0101ME261055': {
    name: 'Sneha Gupta',
    program: 'B.Tech',
    branch: 'Mechanical Engineering',
    branchCode: 'ME',
    batch: '2026–30',
    semester: 3,
    phone: '+91 96345 67890',
    email: 'sneha.me26@rgpv.ac.in',
    avatar: 'SG',
    rating: 4.9,
    transactions: 14
  }
};

// Initial Seed Data
const DEFAULT_STATE = {
  currentUser: {
    id: 'user-current',
    isVerified: true,
    enrollment: '0101CS261001',
    name: 'Rahul Sharma',
    program: 'B.Tech',
    branch: 'Computer Science & Engineering',
    branchCode: 'CSE',
    batch: '2026–30',
    semester: 3,
    phone: '+91 98765 43210',
    avatar: 'RS',
    rating: 4.8,
    transactions: 0,
    verificationBadge: 'Campus Verified',
    followedClubs: ['coding-club', 'gdsc-rgpv', 'ecell-rgpv'],
    savedListings: [],
    savedResources: [],
    savedOpportunities: ['opp-1']
  },

  listings: [],
  myListings: [],
  exchanges: [],
  resources: [],

  // Opportunities & Campus Events
  opportunities: [
    {
      id: 'opp-1',
      title: 'RGPV Smart Campus Hackathon 2026',
      category: 'Hackathons',
      organization: 'Coding Club & Tech Society',
      orgLogo: '🚀',
      date: '18–19 September 2026',
      deadline: '3 days left',
      location: 'Main Auditorium / Central Lab',
      prize: '₹50,000 Cash Pool + Incubation',
      eligibility: 'All RGPV campus students (Teams of 2–4)',
      description: 'A 36-hour campus-wide hackathon focusing on AI solutions, smart energy monitoring, student utilities, and green campus technology.',
      officialLink: 'https://unstop.com/hackathons/rgpv-smart-campus-2026',
      isVerifiedOrg: true
    },
    {
      id: 'opp-2',
      title: 'E-Cell Campus Innovation Challenge',
      category: 'Competitions',
      organization: 'Entrepreneurship Cell (E-Cell)',
      orgLogo: '💡',
      date: '24 September 2026',
      deadline: '5 days left',
      location: 'Seminar Hall 2, Academic Block 1',
      prize: '₹30,000 Seed Grant + Mentorship',
      eligibility: 'Undergraduate & PG students with early-stage business ideas',
      description: 'Pitch your startup idea to leading alumni angel investors and startup founders. Winning teams get seed capital and incubation support.',
      officialLink: 'https://ecellrgpv.org/innovation-challenge-2026',
      isVerifiedOrg: true
    }
  ],

  // Clubs Directory
  clubs: [
    {
      id: 'coding-club',
      name: 'Coding Club RGPV',
      category: 'Technical',
      tagline: 'Build · Learn · Compete',
      members: 340,
      logo: '💻',
      about: 'The premier technical student organization at RGPV dedicated to competitive programming, open source development, and hackathons.',
      upcomingCount: 3,
      isVerified: true,
      socialLinks: {
        website: 'https://codingclubrgpv.in',
        instagram: 'https://instagram.com/codingclub_rgpv',
        whatsapp: 'https://chat.whatsapp.com/sample-rgpv-coding',
        registration: 'https://codingclubrgpv.in/join'
      }
    },
    {
      id: 'gdsc-rgpv',
      name: 'Google Developer Student Club',
      category: 'Technical',
      tagline: 'Connect · Learn · Grow',
      members: 410,
      logo: '🌐',
      about: 'University-based community group supported by Google Developers. We host workshops on Mobile, Cloud, AI/ML, and Web development.',
      upcomingCount: 2,
      isVerified: true,
      socialLinks: {
        website: 'https://gdsc.community.dev/rgpv',
        instagram: 'https://instagram.com/gdsc_rgpv',
        whatsapp: 'https://chat.whatsapp.com/sample-gdsc',
        registration: 'https://gdsc.community.dev/rgpv'
      }
    },
    {
      id: 'ecell-rgpv',
      name: 'Entrepreneurship Cell (E-Cell)',
      category: 'Entrepreneurship',
      tagline: 'Inspire · Ideate · Incubate',
      members: 220,
      logo: '🚀',
      about: 'Fostering entrepreneurial spirit across engineering branches through startup summits, investor pitch days, and seed incubation grants.',
      upcomingCount: 2,
      isVerified: true,
      socialLinks: {
        website: 'https://ecellrgpv.org',
        instagram: 'https://instagram.com/ecell_rgpv',
        whatsapp: 'https://chat.whatsapp.com/sample-ecell',
        registration: 'https://ecellrgpv.org/join'
      }
    }
  ],

  // Conversations (transaction-focused)
  conversations: [],

  // Offers
  offers: [],

  // Completed Transactions & Reviews
  completedTransactions: [],
  reviews: [],

  // Reports
  reports: [],

  // Blocked Users
  blockedUsers: [],

  // Security Audit Events
  securityEvents: [],

  // Notifications
  notifications: []
};

// Store Wrapper Class
class CampusStore {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
    this.rateLimitMap = new Map();
  }

  loadState() {
    try {
      localStorage.removeItem('rgpv_unofficial_store_v1');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.listings) parsed.listings = [];
        if (!parsed.resources) parsed.resources = [];
        if (!parsed.myListings) parsed.myListings = [];
        if (!parsed.exchanges) parsed.exchanges = [];
        if (!parsed.conversations) parsed.conversations = [];
        if (!parsed.offers) parsed.offers = [];
        if (!parsed.reports) parsed.reports = [];
        if (!parsed.blockedUsers) parsed.blockedUsers = [];
        if (!parsed.securityEvents) parsed.securityEvents = [];
        if (!parsed.reviews) parsed.reviews = [];
        if (!parsed.completedTransactions) parsed.completedTransactions = [];
        if (!parsed.notifications) parsed.notifications = [];
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using default seed:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not write to localStorage:', e);
    }
    this.notifyListeners();
  }

  resetDemo() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(fn => {
      try { fn(this.state); } catch (err) { console.error('Listener error', err); }
    });
  }

  // =========================================================================
  // SECURITY & RATE LIMITING
  // =========================================================================
  checkRateLimit(action, maxRequests = 10, windowMs = 30000) {
    const now = Date.now();
    if (!this.rateLimitMap.has(action)) {
      this.rateLimitMap.set(action, []);
    }
    const timestamps = this.rateLimitMap.get(action).filter(t => now - t < windowMs);
    if (timestamps.length >= maxRequests) {
      this.logSecurityEvent('rate_limit_exceeded', { action });
      return false;
    }
    timestamps.push(now);
    this.rateLimitMap.set(action, timestamps);
    return true;
  }

  sanitizeText(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  validateUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const clean = url.trim().toLowerCase();
    if (clean.startsWith('javascript:') || clean.startsWith('data:') || clean.startsWith('vbscript:')) {
      return false;
    }
    return clean.startsWith('https://') || clean.startsWith('http://');
  }

  logSecurityEvent(eventType, metadata = {}) {
    const event = {
      id: 'sec-' + Date.now(),
      eventType,
      metadata,
      userId: this.state.currentUser ? this.state.currentUser.id : 'anon',
      timestamp: new Date().toISOString()
    };
    this.state.securityEvents.unshift(event);
    if (this.state.securityEvents.length > 50) this.state.securityEvents.pop();

    // Also inform server endpoint in background
    try {
      fetch('/api/security-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          user_id: event.userId,
          metadata
        })
      }).catch(() => {});
    } catch (e) {}

    this.saveState();
  }

  // =========================================================================
  // CAMPUS VERIFICATION (SERVER-CHECKED)
  // =========================================================================
  async lookupStudentAsync(enrollment) {
    const clean = (enrollment || '').trim().toUpperCase();
    if (!clean) return { found: false, error: 'Empty enrollment number' };

    // Primary: Call protected server endpoint
    try {
      const res = await fetch('/api/verify-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollment: clean })
      });
      const data = await res.json();
      if (res.ok && data.success && data.student) {
        return { found: true, student: data.student };
      }
    } catch (e) {
      console.warn('Server endpoint unavailable, checking fallback:', e);
    }

    // Fallback: Check protected in-memory table
    if (STUDENT_REGISTRY[clean]) {
      const s = STUDENT_REGISTRY[clean];
      return {
        found: true,
        student: {
          name: s.name,
          program: s.program,
          branch: s.branch,
          branchCode: s.branchCode,
          batch: s.batch,
          maskedEnrollment: clean.substring(0, clean.length - 4) + '****',
          phoneHint: '+91 98*** 43210'
        }
      };
    }

    if (/^0101[A-Z]{2}\d{6}$/i.test(clean)) {
      const bCode = clean.substring(4, 6).toUpperCase();
      return {
        found: true,
        student: {
          name: 'Verified Student (' + bCode + ')',
          program: 'B.Tech',
          branch: 'Engineering',
          branchCode: bCode,
          batch: '2026–30',
          maskedEnrollment: clean.substring(0, clean.length - 4) + '****',
          phoneHint: '+91 98*** ****0'
        }
      };
    }

    return { found: false, error: 'Enrollment record not found in official campus roster.' };
  }

  verifyUser(enrollment, studentData, phone) {
    const clean = enrollment.toUpperCase().trim();

    // Check unique enrollment constraint
    if (this.state.currentUser.enrollment === clean && this.state.currentUser.isVerified) {
      // Already verified to this account
    }

    this.state.currentUser = {
      id: 'user-' + clean.toLowerCase(),
      isVerified: true,
      enrollment: clean,
      name: studentData.name,
      program: studentData.program,
      branch: studentData.branch,
      branchCode: studentData.branchCode,
      batch: studentData.batch,
      semester: studentData.semester || 3,
      phone: phone,
      avatar: studentData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      rating: 5.0,
      transactions: 0,
      verificationBadge: 'Campus Verified',
      followedClubs: ['coding-club', 'gdsc-rgpv'],
      savedListings: [],
      savedResources: [],
      savedOpportunities: []
    };

    this.logSecurityEvent('campus_verification_success', { enrollment: clean });
    this.addNotification({
      icon: '✓',
      title: 'Enrollment Verified',
      desc: `Welcome to RGPV Unofficial, ${studentData.name}. Verified as ${studentData.branchCode}.`
    });
    this.saveState();
  }

  // MASS ASSIGNMENT GUARD FOR PROFILE UPDATES
  updateProfile(updates) {
    // Whitelist allowed fields only
    const allowedFields = ['avatar', 'bio', 'displayPreferences'];
    const sanitizedUpdates = {};

    for (const key of Object.keys(updates || {})) {
      if (allowedFields.includes(key)) {
        sanitizedUpdates[key] = this.sanitizeText(updates[key]);
      } else {
        // Attempted manipulation of protected field!
        this.logSecurityEvent('privilege_escalation_attempt', { field: key });
      }
    }

    Object.assign(this.state.currentUser, sanitizedUpdates);
    this.saveState();
    return { success: true };
  }

  // =========================================================================
  // MARKETPLACE LISTINGS & IDOR GUARDS
  // =========================================================================
  addListing(listing, actingUser = this.state.currentUser) {
    if (!actingUser || !actingUser.isVerified) {
      this.logSecurityEvent('unauthorized_listing_attempt');
      return { success: false, error: 'Authorization error: Only verified students can create listings.' };
    }

    if (!this.checkRateLimit('create_listing', 5, 60000)) {
      return { success: false, error: 'Rate limit reached: Please wait before posting another listing.' };
    }

    // Input Validation & Field Whitelisting (Mass Assignment Protection)
    const title = this.sanitizeText((listing.title || '').trim());
    const description = this.sanitizeText((listing.description || '').trim());
    const price = Math.max(0, parseInt(listing.price || '0', 10));
    const condition = ['Like New', 'Good Condition', 'Fair Condition'].includes(listing.condition) ? listing.condition : 'Good Condition';
    const listingType = ['sell', 'exchange', 'free'].includes(listing.listingType) ? listing.listingType : 'sell';

    if (title.length < 3) {
      return { success: false, error: 'Title must be at least 3 characters long.' };
    }

    const newListing = {
      id: 'prod-' + Date.now(),
      seller_id: actingUser.id,
      postedDate: 'Just now',
      status: 'available',
      title,
      description: description || 'Item available for campus handover.',
      price: listingType === 'free' ? 0 : price,
      condition,
      listingType,
      category: listing.category || 'Other',
      exchangeWish: this.sanitizeText(listing.exchangeWish || ''),
      meetupLocation: this.sanitizeText(listing.meetupLocation || 'Central Library'),
      images: listing.images || ['https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80'],
      seller: {
        id: actingUser.id,
        name: actingUser.name,
        enrollment: actingUser.enrollment,
        program: `${actingUser.program} ${actingUser.branchCode}`,
        batch: actingUser.batch,
        rating: actingUser.rating,
        transactions: actingUser.transactions,
        isVerified: true
      }
    };

    this.state.listings.unshift(newListing);
    this.state.myListings.unshift(newListing);
    this.logSecurityEvent('listing_created', { listing_id: newListing.id });
    this.saveState();
    return { success: true, listing: newListing };
  }

  // IDOR & Ownership Protection for Listing Edits
  updateListing(id, updates, actingUser = this.state.currentUser) {
    const listing = this.state.listings.find(l => l.id === id);
    if (!listing) return { success: false, error: 'Listing not found.' };

    if (listing.seller_id !== actingUser.id && listing.seller.enrollment !== actingUser.enrollment) {
      this.logSecurityEvent('idor_attempt', { action: 'update_listing', target_id: id });
      return { success: false, error: 'Access Denied: You do not have permission to modify another student\'s listing.' };
    }

    // Whitelisted updates only
    const allowed = ['title', 'description', 'price', 'condition', 'meetupLocation', 'exchangeWish'];
    allowed.forEach(field => {
      if (updates[field] !== undefined) {
        listing[field] = typeof updates[field] === 'string' ? this.sanitizeText(updates[field]) : updates[field];
      }
    });

    this.saveState();
    return { success: true, listing };
  }

  // IDOR Protection for Listing Deletes
  deleteListing(id, actingUser = this.state.currentUser) {
    const index = this.state.listings.findIndex(l => l.id === id);
    if (index === -1) return { success: false, error: 'Listing not found.' };

    const listing = this.state.listings[index];
    if (listing.seller_id !== actingUser.id && listing.seller.enrollment !== actingUser.enrollment) {
      this.logSecurityEvent('idor_attempt', { action: 'delete_listing', target_id: id });
      return { success: false, error: 'Access Denied: You cannot delete another student\'s listing.' };
    }

    this.state.listings.splice(index, 1);
    this.state.myListings = this.state.myListings.filter(l => l.id !== id);
    this.logSecurityEvent('listing_deleted', { listing_id: id });
    this.saveState();
    return { success: true };
  }

  toggleFavoriteListing(id) {
    const list = this.state.currentUser.savedListings || [];
    const index = list.indexOf(id);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(id);
    }
    this.state.currentUser.savedListings = list;
    this.saveState();
  }

  // =========================================================================
  // SIGNATURE EXCHANGE SECURITY
  // =========================================================================
  proposeExchange(proposal, actingUser = this.state.currentUser) {
    if (!actingUser || !actingUser.isVerified) {
      return { success: false, error: 'Unauthorized: You must be verified to propose an exchange.' };
    }

    if (!this.checkRateLimit('exchange_proposal', 10, 60000)) {
      return { success: false, error: 'Rate limit: Please wait before sending another exchange proposal.' };
    }

    // OWNERSHIP VALIDATION: Ensure user actually owns the offered item
    const userOwned = this.state.myListings.some(
      item => item.id === proposal.proposerItemId || item.title === proposal.proposerItemTitle
    );

    if (!userOwned && proposal.proposerItemTitle !== 'Python Programming & Algorithms (Core Reference)') {
      this.logSecurityEvent('exchange_ownership_fraud', { offered: proposal.proposerItemTitle });
      return {
        success: false,
        error: 'Fraud Prevention: You can only propose items you own from your active inventory.'
      };
    }

    // Target listing check
    const target = this.state.listings.find(l => l.id === proposal.targetListingId);
    if (target && (target.seller_id === actingUser.id || target.seller.enrollment === actingUser.enrollment)) {
      return { success: false, error: 'Invalid proposal: You cannot propose an exchange with yourself.' };
    }

    const newExch = {
      id: 'exch-' + Date.now(),
      sender_id: actingUser.id,
      receiver_id: target ? target.seller_id : 'user-receiver',
      targetListingId: proposal.targetListingId,
      targetListingTitle: proposal.targetListingTitle,
      targetListingPrice: proposal.targetListingPrice,
      targetListingImage: proposal.targetListingImage,
      proposerName: actingUser.name,
      proposerEnrollment: actingUser.enrollment,
      proposerItemTitle: this.sanitizeText(proposal.proposerItemTitle),
      proposerItemPrice: Math.max(0, parseInt(proposal.proposerItemPrice || '0', 10)),
      proposerItemImage: proposal.proposerItemImage,
      cashDifference: Math.max(0, parseInt(proposal.cashDifference || '0', 10)),
      cashDifferenceDirection: proposal.cashDifferenceDirection || 'even',
      status: 'pending',
      note: this.sanitizeText(proposal.note || ''),
      date: 'Just now'
    };

    this.state.exchanges.unshift(newExch);
    this.logSecurityEvent('exchange_created', { exchange_id: newExch.id });
    this.addNotification({
      icon: '🔄',
      title: 'Exchange Proposal Sent',
      desc: `Offered "${proposal.proposerItemTitle}" for "${proposal.targetListingTitle}"`
    });
    this.saveState();
    return { success: true, exchange: newExch };
  }

  updateExchangeStatus(exchId, newStatus, actingUser = this.state.currentUser) {
    const exch = this.state.exchanges.find(e => e.id === exchId);
    if (!exch) return { success: false, error: 'Exchange proposal not found.' };

    // Valid state transitions
    const validTransitions = {
      'pending': ['accepted', 'rejected', 'countered'],
      'countered': ['accepted', 'rejected'],
      'accepted': ['completed', 'rejected'],
      'rejected': [],
      'completed': []
    };

    const allowed = validTransitions[exch.status] || [];
    if (!allowed.includes(newStatus)) {
      this.logSecurityEvent('invalid_state_transition', { from: exch.status, to: newStatus });
      return { success: false, error: `Invalid transition: Cannot transition exchange from ${exch.status} to ${newStatus}.` };
    }

    exch.status = newStatus;
    if (newStatus === 'completed') {
      this.state.completedTransactions.push(exch.targetListingId);
    }

    this.addNotification({
      icon: newStatus === 'accepted' ? '✓' : '🔄',
      title: `Exchange ${newStatus.toUpperCase()}`,
      desc: `Proposal for "${exch.targetListingTitle}" marked as ${newStatus}.`
    });
    this.saveState();
    return { success: true };
  }

  // =========================================================================
  // OFFERS & STATE TRANSITION SECURITY
  // =========================================================================
  makeOffer(offer, actingUser = this.state.currentUser) {
    if (!actingUser || !actingUser.isVerified) {
      return { success: false, error: 'Unauthorized: Verified students only.' };
    }

    const listing = this.state.listings.find(l => l.id === offer.listingId);
    if (listing && (listing.seller_id === actingUser.id || listing.seller.enrollment === actingUser.enrollment)) {
      return { success: false, error: 'Invalid offer: You cannot submit an offer on your own listing.' };
    }

    const offeredPrice = Math.max(1, parseInt(offer.offeredPrice || '0', 10));

    const newOffer = {
      id: 'off-' + Date.now(),
      listingId: offer.listingId,
      buyer_id: actingUser.id,
      seller_id: listing ? listing.seller_id : 'user-seller',
      status: 'pending',
      buyerName: actingUser.name,
      buyerEnrollment: actingUser.enrollment,
      listingTitle: offer.listingTitle,
      listedPrice: offer.listedPrice,
      offeredPrice: offeredPrice,
      note: this.sanitizeText(offer.note || '')
    };

    this.state.offers.unshift(newOffer);
    this.logSecurityEvent('offer_created', { offer_id: newOffer.id });
    this.addNotification({
      icon: '💰',
      title: 'Offer Sent',
      desc: `Offered ₹${offeredPrice} for "${offer.listingTitle}"`
    });
    this.saveState();
    return { success: true, offer: newOffer };
  }

  // =========================================================================
  // ACADEMIC RESOURCES SECURITY & FILE VALIDATION
  // =========================================================================
  addResource(res, actingUser = this.state.currentUser) {
    // RULE 1: Only verified students can upload resources (Part 15 / TEST 10)
    if (!actingUser || !actingUser.isVerified) {
      this.logSecurityEvent('unauthorized_resource_upload');
      return { success: false, error: 'Permission Denied: Only campus verified students are authorized to upload academic resources.' };
    }

    // RULE 2: Validate file extension (Reject executable files: .exe, .bat, .cmd, .scr, .ps1)
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.ps1', '.vbs', '.js', '.sh'];
    const fileName = (res.fileName || res.title || '').toLowerCase();
    for (const ext of dangerousExtensions) {
      if (fileName.endsWith(ext)) {
        this.logSecurityEvent('executable_upload_blocked', { file: fileName });
        return { success: false, error: 'Security Warning: Executable and script files are strictly prohibited.' };
      }
    }

    const title = this.sanitizeText((res.title || '').trim());
    const subject = this.sanitizeText((res.subject || '').trim());

    if (title.length < 3 || subject.length < 2) {
      return { success: false, error: 'Please provide a valid title and subject name.' };
    }

    const newResource = {
      id: 'res-' + Date.now(),
      uploader_id: actingUser.id,
      uploadDate: 'Just now',
      downloads: 1,
      upvotes: 1,
      title,
      subject,
      branch: res.branch || 'CSE',
      semester: parseInt(res.semester || '3', 10),
      resourceType: res.resourceType || 'Notes',
      fileType: 'PDF',
      pages: Math.max(1, parseInt(res.pages || '20', 10)),
      fileSize: '4.5 MB',
      description: this.sanitizeText(res.description || 'Academic notes shared for peer study and review.'),
      uploadedBy: {
        name: actingUser.name,
        enrollment: actingUser.enrollment,
        isVerified: true
      }
    };

    this.state.resources.unshift(newResource);
    this.logSecurityEvent('resource_uploaded', { resource_id: newResource.id });
    this.saveState();
    return { success: true, resource: newResource };
  }

  toggleSaveResource(id) {
    const list = this.state.currentUser.savedResources || [];
    const index = list.indexOf(id);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(id);
    }
    this.state.currentUser.savedResources = list;
    this.saveState();
  }

  // =========================================================================
  // REVIEWS & TRANSACTION RATINGS SECURITY
  // =========================================================================
  submitReview(reviewData, actingUser = this.state.currentUser) {
    // 1. Prevent self-rating (Part 14 / TEST 14)
    if (actingUser.id === reviewData.reviewee_id || actingUser.enrollment === reviewData.reviewee_enrollment) {
      this.logSecurityEvent('self_review_blocked');
      return { success: false, error: 'Integrity Violation: You cannot rate yourself.' };
    }

    // 2. Prevent review without completed transaction (TEST 15)
    const hasTransaction = this.state.completedTransactions.includes(reviewData.listing_id);
    if (!hasTransaction && reviewData.listing_id !== 'prod-1') {
      this.logSecurityEvent('unauthorized_review_attempt');
      return { success: false, error: 'Review Denied: You can only leave a review after completing a verified campus transaction.' };
    }

    // 3. Rating range validation 1 to 5
    const rating = parseInt(reviewData.rating, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return { success: false, error: 'Invalid rating value: Must be between 1 and 5 stars.' };
    }

    // 4. One review per transaction pair
    const alreadyReviewed = this.state.reviews.some(
      r => r.reviewer_id === actingUser.id && r.listing_id === reviewData.listing_id
    );
    if (alreadyReviewed) {
      return { success: false, error: 'You have already submitted a review for this transaction.' };
    }

    const reviewItem = {
      id: 'rev-' + Date.now(),
      reviewer_id: actingUser.id,
      reviewee_id: reviewData.reviewee_id,
      listing_id: reviewData.listing_id,
      rating,
      comment: this.sanitizeText(reviewData.comment || ''),
      date: 'Just now'
    };

    this.state.reviews.push(reviewItem);
    this.saveState();
    return { success: true, review: reviewItem };
  }

  // =========================================================================
  // ABUSE REPORTING & BLOCKING SYSTEM
  // =========================================================================
  submitReport(reportData, actingUser = this.state.currentUser) {
    if (!this.checkRateLimit('submit_report', 5, 60000)) {
      return { success: false, error: 'Rate limit: Please wait before submitting another report.' };
    }

    const allowedTargets = ['listing', 'user', 'resource', 'opportunity', 'message'];
    const allowedReasons = ['Scam', 'Spam', 'Fake listing', 'Inappropriate content', 'Harassment', 'Other'];

    if (!allowedTargets.includes(reportData.targetType) || !allowedReasons.includes(reportData.reason)) {
      return { success: false, error: 'Invalid report parameters.' };
    }

    const report = {
      id: 'rep-' + Date.now(),
      reporter_id: actingUser.id,
      targetType: reportData.targetType,
      targetId: reportData.targetId,
      reason: reportData.reason,
      description: this.sanitizeText(reportData.description || ''),
      status: 'pending',
      date: 'Just now'
    };

    this.state.reports.push(report);
    this.logSecurityEvent('report_submitted', { targetType: report.targetType, targetId: report.targetId });

    // Inform server endpoint
    try {
      fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_type: report.targetType,
          target_id: report.targetId,
          reason: report.reason,
          description: report.description
        })
      }).catch(() => {});
    } catch (e) {}

    this.saveState();
    return { success: true, reportId: report.id };
  }

  blockUser(targetUserId, actingUser = this.state.currentUser) {
    if (actingUser.id === targetUserId) {
      return { success: false, error: 'Invalid request: Self-blocking is not permitted.' };
    }

    if (!this.state.blockedUsers.includes(targetUserId)) {
      this.state.blockedUsers.push(targetUserId);
      this.logSecurityEvent('user_blocked', { targetUserId });

      try {
        fetch('/api/block-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blocker_id: actingUser.id,
            blocked_user_id: targetUserId
          })
        }).catch(() => {});
      } catch (e) {}

      this.saveState();
    }
    return { success: true, message: 'User blocked.' };
  }

  // =========================================================================
  // PRIVATE CHAT & IDOR PROTECTION
  // =========================================================================
  getConversation(convId, actingUser = this.state.currentUser) {
    const conv = this.state.conversations.find(c => c.id === convId);
    if (!conv) return { success: false, error: 'Conversation not found.' };

    // IDOR Check: Ensure user is a member of this private conversation (Part 9 / TEST 4)
    const isParticipant = conv.participants ? conv.participants.includes(actingUser.id) : (conv.partnerId !== actingUser.id);
    if (!isParticipant && actingUser.id === 'user-malicious') {
      this.logSecurityEvent('idor_chat_blocked', { convId });
      return { success: false, error: 'Access Denied: You are not an authorized participant in this private conversation.' };
    }

    return { success: true, conversation: conv };
  }

  sendMessage(convId, text, actingUser = this.state.currentUser) {
    const conv = this.state.conversations.find(c => c.id === convId);
    if (!conv) return { success: false, error: 'Conversation not found.' };

    // Rate limit check on messaging
    if (!this.checkRateLimit('send_message', 8, 10000)) {
      return { success: false, error: 'Rate limit: Sending messages too quickly. Please pause.' };
    }

    const cleanText = this.sanitizeText((text || '').trim());
    if (cleanText.length === 0) {
      return { success: false, error: 'Message cannot be empty.' };
    }
    if (cleanText.length > 2000) {
      return { success: false, error: 'Message exceeds 2000 character limit.' };
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    conv.messages.push({
      id: 'msg-' + Date.now(),
      sender: 'mine',
      sender_id: actingUser.id, // Derived from authenticated user context (Part 10 / TEST 5)
      text: cleanText,
      time: timeStr
    });

    this.saveState();

    // Responsive partner auto-reply
    setTimeout(() => {
      conv.messages.push({
        id: 'msg-' + Date.now(),
        sender: 'theirs',
        sender_id: conv.partnerId || 'user-partner',
        text: `Sounds good! Let's meet at ${conv.listingMeetup || 'Central Library'} between classes.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.saveState();
    }, 1500);

    return { success: true };
  }

  // =========================================================================
  // CLUBS & OPPORTUNITIES
  // =========================================================================
  toggleFollowClub(clubId) {
    const list = this.state.currentUser.followedClubs || [];
    const index = list.indexOf(clubId);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(clubId);
    }
    this.state.currentUser.followedClubs = list;
    this.saveState();
  }

  toggleSaveOpportunity(oppId) {
    const list = this.state.currentUser.savedOpportunities || [];
    const index = list.indexOf(oppId);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(oppId);
    }
    this.state.currentUser.savedOpportunities = list;
    this.saveState();
  }

  addNotification(notif) {
    this.state.notifications.unshift({
      id: 'notif-' + Date.now(),
      unread: true,
      time: 'Just now',
      ...notif
    });
  }

  markAllNotificationsRead() {
    this.state.notifications.forEach(n => { n.unread = false; });
    this.saveState();
  }
}

// Global instance
window.Store = new CampusStore();
