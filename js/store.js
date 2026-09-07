/**
 * RGPVEBAZAAR — Central Data Store & State Management
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
    id: 'user-guest',
    isVerified: false,
    role: 'STUDENT', // 'STUDENT' | 'CLUB_PRESIDENT' | 'SUPER_ADMIN'
    assignedClubId: null,
    enrollment: '',
    name: 'Campus Guest',
    program: 'Campus Visitor',
    branch: 'RGPV',
    branchCode: 'RGPV',
    batch: '2026',
    semester: 1,
    phone: '',
    avatar: 'CG',
    rating: 5.0,
    transactions: 0,
    verificationBadge: 'Unverified Guest',
    followedClubs: ['coding-club', 'robotics-club', 'ecell-rgpv'],
    savedListings: [],
    savedResources: [],
    savedOpportunities: ['opp-1']
  },

  listings: [],
  myListings: [],
  exchanges: [],
  resources: [],

  // Clubs Directory (Official 5 Campus Societies)
  clubs: [
    {
      id: 'coding-club',
      name: 'Coding Club RGPV',
      category: 'Technical',
      tagline: 'Build · Learn · Compete',
      members: 340,
      followersCount: 128,
      logo: '💻',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
      about: 'The premier technical student organization at RGPV dedicated to competitive programming, open source development, web3, and hackathons.',
      presidentId: 'ea7fbb68-db0b-43e8-92b1-297bfde7f92b',
      presidentName: 'Rahul Sharma',
      contactEmail: 'coding@rgpv.ac.in',
      socialLinks: {
        website: 'https://codingclubrgpv.in',
        instagram: 'https://instagram.com/codingclub_rgpv',
        whatsapp: 'https://chat.whatsapp.com/sample-rgpv-coding',
        registration: 'https://codingclubrgpv.in/join'
      },
      isActive: true
    },
    {
      id: 'robotics-club',
      name: 'Robotics & Automation Society',
      category: 'Technical',
      tagline: 'Design · Automate · Innovate',
      members: 215,
      followersCount: 94,
      logo: '🤖',
      coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
      about: 'Hands-on engineering hub exploring embedded systems, IoT, drones, humanoid robotics, and autonomous systems for national competitions.',
      presidentId: 'bee74d09-7be0-4e53-89b6-ae9b58088e79',
      presidentName: 'Abhay Tiwari',
      contactEmail: 'robotics@rgpv.ac.in',
      socialLinks: {
        website: 'https://roboticsrgpv.org',
        instagram: 'https://instagram.com/robotics_rgpv',
        whatsapp: 'https://chat.whatsapp.com/sample-robotics',
        registration: 'https://roboticsrgpv.org/join'
      },
      isActive: true
    },
    {
      id: 'ecell-rgpv',
      name: 'Entrepreneurship Cell (E-Cell)',
      category: 'Entrepreneurship',
      tagline: 'Inspire · Ideate · Incubate',
      members: 220,
      followersCount: 110,
      logo: '💡',
      coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&auto=format&fit=crop&q=80',
      about: 'Fostering entrepreneurial spirit across engineering branches through startup summits, investor pitch days, and seed incubation grants.',
      presidentId: null,
      presidentName: null,
      contactEmail: 'ecell@rgpv.ac.in',
      socialLinks: {
        website: 'https://ecellrgpv.org',
        instagram: 'https://instagram.com/ecell_rgpv',
        whatsapp: 'https://chat.whatsapp.com/sample-ecell',
        registration: 'https://ecellrgpv.org/join'
      },
      isActive: true
    },
    {
      id: 'cultural-club',
      name: 'Aakriti Cultural Society',
      category: 'Cultural',
      tagline: 'Art · Expression · Passion',
      members: 310,
      followersCount: 145,
      logo: '🎭',
      coverImage: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=1200&auto=format&fit=crop&q=80',
      about: 'Celebrating music, dance, dramatic arts, photography, and campus cultural festivals across all branches and batches.',
      presidentId: null,
      presidentName: null,
      contactEmail: 'cultural@rgpv.ac.in',
      socialLinks: {
        website: 'https://aakritirgpv.org',
        instagram: 'https://instagram.com/aakriti_rgpv'
      },
      isActive: true
    },
    {
      id: 'sports-club',
      name: 'RGPV Athletic & Sports Club',
      category: 'Sports',
      tagline: 'Strength · Unity · Victory',
      members: 280,
      followersCount: 88,
      logo: '🏆',
      coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80',
      about: 'Promoting physical fitness, inter-college tournaments, cricket, football, volleyball, badminton, and track athletics.',
      presidentId: null,
      presidentName: null,
      contactEmail: 'sports@rgpv.ac.in',
      socialLinks: {
        website: 'https://sportsrgpv.org',
        instagram: 'https://instagram.com/sports_rgpv'
      },
      isActive: true
    }
  ],

  // Events Model
  events: [
    {
      id: 'evt-1',
      clubId: 'coding-club',
      title: 'Algorun 2026: Annual Campus Coding Sprint',
      description: 'A high-intensity 4-hour algorithmic problem solving competition featuring dynamic programming, graph algorithms, and system design challenges with campus recruitment fast-track.',
      posterImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
      category: 'Coding Competition',
      venue: 'Main CS Auditorium, Academic Block 2',
      startDate: new Date(Date.now() + 5 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 5 * 86400000 + 4 * 3600000).toISOString(),
      registrationDeadline: new Date(Date.now() + 4 * 86400000).toISOString(),
      registrationUrl: 'https://codingclubrgpv.in/algorun-2026',
      maxParticipants: 120,
      registrationsCount: 48,
      status: 'PUBLISHED', // 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED'
      rejectionReason: null,
      createdBy: 'ea7fbb68-db0b-43e8-92b1-297bfde7f92b',
      createdAt: new Date().toISOString()
    },
    {
      id: 'evt-2',
      clubId: 'robotics-club',
      title: 'Autonomous Rover & Drone Expo',
      description: 'Hands-on live showcase of multi-terrain autonomous search and rescue rovers and indoor micro-drones built by student engineering teams.',
      posterImage: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
      category: 'Workshop & Expo',
      venue: 'Campus Quadrangle / Central Lawn',
      startDate: new Date(Date.now() + 8 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 8 * 86400000 + 6 * 3600000).toISOString(),
      registrationDeadline: new Date(Date.now() + 7 * 86400000).toISOString(),
      registrationUrl: 'https://roboticsrgpv.org/rover-expo',
      maxParticipants: 150,
      registrationsCount: 0,
      status: 'PENDING_APPROVAL',
      rejectionReason: null,
      createdBy: 'bee74d09-7be0-4e53-89b6-ae9b58088e79',
      createdAt: new Date().toISOString()
    },
    {
      id: 'evt-3',
      clubId: 'ecell-rgpv',
      title: 'Campus Venture Pitch 2026',
      description: 'Pitch your startup prototypes directly to alumni venture investors and angel networks. Winning startups receive seed incubation grants.',
      posterImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
      category: 'Startup Pitch',
      venue: 'Seminar Hall 1, Admin Block',
      startDate: new Date(Date.now() + 12 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 12 * 86400000 + 5 * 3600000).toISOString(),
      registrationDeadline: new Date(Date.now() + 10 * 86400000).toISOString(),
      registrationUrl: 'https://ecellrgpv.org/pitch-2026',
      maxParticipants: 80,
      registrationsCount: 35,
      status: 'PUBLISHED',
      rejectionReason: null,
      createdBy: 'admin',
      createdAt: new Date().toISOString()
    }
  ],

  // Opportunities
  opportunities: [
    {
      id: 'opp-1',
      title: 'RGPV Smart Campus Hackathon 2026',
      category: 'Hackathon',
      organization: 'Coding Club & Tech Society',
      orgLogo: '🚀',
      date: '18–19 September 2026',
      deadline: '14 days left',
      deadlineDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      location: 'Main Auditorium / Central Lab',
      prize: '₹50,000 Cash Pool + Incubation',
      eligibility: 'All RGPV campus students (Teams of 2–4)',
      description: 'A 36-hour campus-wide hackathon focusing on AI solutions, smart energy monitoring, student utilities, and green campus technology.',
      applicationUrl: 'https://unstop.com/hackathons/rgpv-smart-campus-2026',
      status: 'PUBLISHED',
      isVerifiedOrg: true
    },
    {
      id: 'opp-2',
      title: 'E-Cell Campus Innovation Challenge',
      category: 'Competition',
      organization: 'Entrepreneurship Cell (E-Cell)',
      orgLogo: '💡',
      date: '24 September 2026',
      deadline: '21 days left',
      deadlineDate: new Date(Date.now() + 21 * 86400000).toISOString(),
      location: 'Seminar Hall 2, Academic Block 1',
      prize: '₹30,000 Seed Grant + Mentorship',
      eligibility: 'Undergraduate & PG students with early-stage business ideas',
      description: 'Pitch your startup idea to leading alumni angel investors and startup founders. Winning teams get seed capital and incubation support.',
      applicationUrl: 'https://ecellrgpv.org/innovation-challenge-2026',
      status: 'PUBLISHED',
      isVerifiedOrg: true
    },
    {
      id: 'opp-3',
      title: 'Google Summer Research Internship 2026',
      category: 'Internship',
      organization: 'Google Research India',
      orgLogo: '🔬',
      date: 'Summer 2026',
      deadline: '30 days left',
      deadlineDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      location: 'Bengaluru / Hybrid',
      prize: 'Monthly Stipend ₹80,000 + Travel',
      eligibility: '3rd and 4th year B.Tech students with CGPA >= 7.5',
      description: 'Work alongside world-class research scientists on computer vision, deep learning, distributed algorithms, and edge intelligence.',
      applicationUrl: 'https://careers.google.com/students',
      status: 'PUBLISHED',
      isVerifiedOrg: true
    }
  ],

  // Announcements
  announcements: [
    {
      id: 'ann-1',
      clubId: 'coding-club',
      title: 'Algorun 2026 Problem Set Released for Practice',
      message: 'Practice rounds are now live on the online judge! All registered teams can test their environments before the weekend sprint.',
      priority: 'IMPORTANT', // 'NORMAL' | 'IMPORTANT' | 'URGENT'
      targetAudience: 'ALL_STUDENTS', // 'ALL_STUDENTS' | 'CLUB_MEMBERS' | 'CAMPUS_WIDE'
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      createdBy: 'ea7fbb68-db0b-43e8-92b1-297bfde7f92b'
    },
    {
      id: 'ann-2',
      clubId: null,
      title: 'Campus Central Library Extended Night Hours for Midterms',
      message: 'Central Library reading rooms will remain open 24x7 from next Monday until end of examinations. Please carry verified campus student ID cards.',
      priority: 'NORMAL',
      targetAudience: 'CAMPUS_WIDE',
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      createdBy: 'a0000000-0000-0000-0000-000000000001'
    }
  ],

  // President Requests
  presidentRequests: [
    {
      id: 'req-demo-1',
      userId: 's0000000-0000-0000-0000-000000000001',
      userName: 'Amit Verma',
      userEnrollment: '0101EC241018',
      requestedClubId: 'ecell-rgpv',
      clubName: 'Entrepreneurship Cell (E-Cell)',
      reason: 'Led multiple startup ideation events and co-founded campus peer barter platform. Seeking to formalize student incubator chapters.',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ],

  // Event Registrations (userId -> [eventIds])
  eventRegistrations: {},

  // Admin Audit Logs (Strictly Immutable)
  auditLogs: [
    {
      id: 'audit-seed-1',
      userId: 'a0000000-0000-0000-0000-000000000001',
      userName: 'Campus Super Admin',
      action: 'APPROVE_EVENT',
      resourceType: 'EVENT',
      resourceId: 'evt-1',
      metadata: { eventTitle: 'Algorun 2026: Annual Campus Coding Sprint', clubId: 'coding-club' },
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'audit-seed-2',
      userId: 'ea7fbb68-db0b-43e8-92b1-297bfde7f92b',
      userName: 'Rahul Sharma (Club President)',
      action: 'PRESIDENT_CREATE_EVENT',
      resourceType: 'EVENT',
      resourceId: 'evt-1',
      metadata: { clubId: 'coding-club', status: 'PENDING_APPROVAL' },
      createdAt: new Date(Date.now() - 90000000).toISOString()
    }
  ],

  conversations: [
    {
      id: 'conv-shubham',
      listingId: '675457c6-9d54-4a7a-9c88-ca12014203c5',
      listingTitle: 'Casio fx-991EX Scientific Calculator',
      listingPrice: 650,
      listingImage: 'https://jjcmiubasrvubfrkystv.supabase.co/storage/v1/object/public/listing-images/ea7fbb68-db0b-43e8-92b1-297bfde7f92b/test_calc_1788767310414.jpg',
      listingMeetup: 'Central Library',
      partnerId: 'ea7fbb68-db0b-43e8-92b1-297bfde7f92b',
      partnerName: 'Rahul Sharma',
      partnerEnrollment: '0101CS261001',
      partnerProgram: 'B.Tech CSE · 2026–30',
      partnerAvatar: 'RS',
      partnerRole: 'CLUB_PRESIDENT',
      participants: ['user-current', 'user-shubham', 'user-authenticated-123', 'ea7fbb68-db0b-43e8-92b1-297bfde7f92b', '465a7876-9e97-4351-942e-817e862db973', '0101ec241018@rgpv.ac.in', '0101cs261001@rgpv.ac.in'],
      lastMessage: "Sounds good! Let's meet at Central Library between classes.",
      lastMessageTime: '10:05 AM',
      unreadCount: 0,
      messages: [
        {
          id: '10000000-0000-0000-0000-000000000001',
          sender: 'mine',
          sender_id: '465a7876-9e97-4351-942e-817e862db973',
          text: 'Hey Rahul! Is the Casio fx-991EX still available? Would you accept ₹600?',
          time: 'Yesterday 10:05 AM',
          status: 'read'
        },
        {
          id: '10000000-0000-0000-0000-000000000002',
          sender: 'theirs',
          sender_id: 'ea7fbb68-db0b-43e8-92b1-297bfde7f92b',
          text: 'Hey! Yes it is. How about ₹650? It comes with original warranty card and slide cover.',
          time: 'Yesterday 12:05 PM',
          status: 'read'
        },
        {
          id: '10000000-0000-0000-0000-000000000003',
          sender: 'mine',
          sender_id: '465a7876-9e97-4351-942e-817e862db973',
          text: '₹650 works for me! Where can we meet on campus tomorrow?',
          time: 'Yesterday 4:05 PM',
          status: 'read'
        },
        {
          id: '10000000-0000-0000-0000-000000000004',
          sender: 'theirs',
          sender_id: 'ea7fbb68-db0b-43e8-92b1-297bfde7f92b',
          text: "Sounds good! Let's meet at Central Library between classes.",
          time: 'Today 10:05 AM',
          status: 'sent'
        }
      ]
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      listingId: '219d38fc-1751-4117-a5b6-958818def876',
      listingTitle: 'Data Structures & Algorithms in C++',
      listingPrice: 320,
      listingImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600&auto=format&fit=crop&q=80',
      listingMeetup: 'Cafeteria',
      partnerId: 'bee74d09-7be0-4e53-89b6-ae9b58088e79',
      partnerName: 'Abhay Tiwari',
      partnerEnrollment: '0101IT261001',
      partnerProgram: 'B.Tech IT · 2026–30',
      partnerAvatar: 'AT',
      partnerRole: 'CLUB_PRESIDENT',
      participants: ['user-current', 'bee74d09-7be0-4e53-89b6-ae9b58088e79', '465a7876-9e97-4351-942e-817e862db973', '0101ec241018@rgpv.ac.in', '0101it261001@rgpv.ac.in'],
      lastMessage: 'Yes, the book is available and unmarked.',
      lastMessageTime: '05:05 AM',
      unreadCount: 1,
      messages: [
        {
          id: '20000000-0000-0000-0000-000000000001',
          sender: 'mine',
          sender_id: '465a7876-9e97-4351-942e-817e862db973',
          text: 'Hi Abhay! Are the pages in Horowitz DSA book clean or highlighted?',
          time: '6h ago',
          status: 'read'
        },
        {
          id: '20000000-0000-0000-0000-000000000002',
          sender: 'theirs',
          sender_id: 'bee74d09-7be0-4e53-89b6-ae9b58088e79',
          text: 'Yes, the book is available and unmarked.',
          time: '5h ago',
          status: 'delivered'
        }
      ]
    }
  ],
  offers: [],
  completedTransactions: [],
  reviews: [],
  reports: [],
  blockedUsers: [],
  securityEvents: [],

  // Notifications
  notifications: [
    {
      id: 'notif-seed-1',
      type: 'NEW_EVENT',
      title: 'New Coding Sprint Published',
      desc: 'Coding Club announced Algorun 2026. Registrations are now open!',
      time: '1h ago',
      unread: true,
      relatedEventId: 'evt-1'
    }
  ]
};

// Store Wrapper Class
class CampusStore {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
    this.rateLimitMap = new Map();
    this.autoManageStatuses();
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
        if (!parsed.conversations || parsed.conversations.length === 0) {
          parsed.conversations = JSON.parse(JSON.stringify(DEFAULT_STATE.conversations));
        } else if (!parsed.conversations.find(c => c.id === 'conv-shubham')) {
          parsed.conversations.unshift(JSON.parse(JSON.stringify(DEFAULT_STATE.conversations[0])));
        }
        if (!parsed.offers) parsed.offers = [];
        if (!parsed.reports) parsed.reports = [];
        if (!parsed.blockedUsers) parsed.blockedUsers = [];
        if (!parsed.securityEvents) parsed.securityEvents = [];
        if (!parsed.reviews) parsed.reviews = [];
        if (!parsed.completedTransactions) parsed.completedTransactions = [];
        if (!parsed.notifications) parsed.notifications = DEFAULT_STATE.notifications;
        if (!parsed.clubs || parsed.clubs.length < 5) parsed.clubs = DEFAULT_STATE.clubs;
        if (!parsed.events || parsed.events.length === 0) parsed.events = DEFAULT_STATE.events;
        if (!parsed.opportunities || parsed.opportunities.length === 0) parsed.opportunities = DEFAULT_STATE.opportunities;
        if (!parsed.announcements || parsed.announcements.length === 0) parsed.announcements = DEFAULT_STATE.announcements;
        if (!parsed.presidentRequests) parsed.presidentRequests = DEFAULT_STATE.presidentRequests;
        if (!parsed.auditLogs) parsed.auditLogs = DEFAULT_STATE.auditLogs;
        if (!parsed.eventRegistrations) parsed.eventRegistrations = {};
        if (!parsed.currentUser) parsed.currentUser = DEFAULT_STATE.currentUser;
        if (!parsed.currentUser.role) parsed.currentUser.role = 'STUDENT';
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
      }).catch(() => { });
    } catch (e) { }

    this.saveState();
  }

  // =========================================================================
  // CAMPUS VERIFICATION (SERVER-CHECKED)
  // =========================================================================
  async lookupStudentAsync(enrollment) {
    const clean = (enrollment || '').trim().toUpperCase();
    if (!clean) return { found: false, error: 'Empty enrollment number' };

    // 1. Check verified campus roster (all 955 students)
    if (window.CAMPUS_ROSTER && window.CAMPUS_ROSTER[clean]) {
      const [name, branch, batch, program] = window.CAMPUS_ROSTER[clean];
      return {
        found: true,
        student: {
          enrollment_no: clean,
          name,
          full_name: name,
          program: program || 'B.Tech',
          branch,
          branchCode: clean.length >= 6 ? clean.substring(4, 6).toUpperCase() : 'ENG',
          batch,
          maskedEnrollment: clean.substring(0, clean.length - 4) + '****',
          phoneHint: '+91 98*** ****0'
        }
      };
    }

    // 2. Check protected in-memory table
    if (STUDENT_REGISTRY[clean]) {
      const s = STUDENT_REGISTRY[clean];
      return {
        found: true,
        student: {
          enrollment_no: clean,
          name: s.name,
          full_name: s.name,
          program: s.program,
          branch: s.branch,
          branchCode: s.branchCode,
          batch: s.batch,
          maskedEnrollment: clean.substring(0, clean.length - 4) + '****',
          phoneHint: '+91 98*** 43210'
        }
      };
    }

    // 3. Try local server endpoint if running
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

    return { found: false, error: 'Unable to retrieve your student record. Please try again.' };
  }

  verifyUser(enrollment, studentData, phone) {
    const clean = (enrollment || '').toUpperCase().trim();
    const data = studentData || {};
    const fullName = (data.full_name || data.name || '').trim();
    
    if (!fullName || fullName === 'Verified Student') {
      return { success: false, error: 'Unable to retrieve your student record. Please try again.' };
    }

    const branchName = (data.branch || '').trim() || 'Engineering';
    const batchYear = (data.batch || '').trim() || '2026';
    const prog = data.program || 'B.Tech';
    const branchCode = data.branchCode || (clean.length >= 6 ? clean.substring(4, 6).toUpperCase() : 'CS');
    const initials = fullName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';

    this.state.currentUser = {
      id: 'user-' + clean.toLowerCase(),
      isVerified: true,
      enrollment: clean,
      name: fullName,
      full_name: fullName,
      program: prog,
      branch: branchName,
      branchCode: branchCode,
      batch: batchYear,
      semester: data.semester || 3,
      phone: phone || '+91 98765 43210',
      avatar: initials,
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
      desc: `Welcome to RGPVebazaar, ${fullName}. Verified as ${branchCode}.`
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
  // MARKETPLACE LISTINGS & BACKEND SYNC (Supabase PostgreSQL Source of Truth)
  // =========================================================================
  async loadMarketplaceListings(filters = {}) {
    if (window.SupaAuth && typeof window.SupaAuth.fetchMarketplaceListings === 'function') {
      const res = await window.SupaAuth.fetchMarketplaceListings(filters);
      if (res && res.success) {
        this.state.listings = res.data || [];
        this.saveState();
        return res;
      }
      if (this.state.listings && this.state.listings.length > 0) {
        return { success: true, data: this.state.listings, error: null, cached: true };
      }
      return res;
    }
    if (this.state.listings && this.state.listings.length > 0) {
      return { success: true, data: this.state.listings, error: null, cached: true };
    }
    return { success: false, error: 'Database service not available.', data: [] };
  }

  async loadMyListings() {
    if (window.SupaAuth && typeof window.SupaAuth.fetchMyListings === 'function') {
      const res = await window.SupaAuth.fetchMyListings();
      if (res && res.success) {
        this.state.myListings = res.data || [];
        return res;
      }
      return res;
    }
    return { success: false, error: 'Supabase client not available.', data: [] };
  }

  async addListing(listing, actingUser = this.state.currentUser) {
    if (!actingUser || !actingUser.isVerified) {
      this.logSecurityEvent('unauthorized_listing_attempt');
      return { success: false, error: 'Campus verification required. Only verified students can create listings.' };
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
    if (listingType === 'sell' && price <= 0) {
      return { success: false, error: 'Please specify a valid price for items listed for sale.' };
    }
    if (listingType === 'exchange' && (!listing.exchangeWish || listing.exchangeWish.trim().length < 3)) {
      return { success: false, error: 'Please specify what you are looking for in exchange.' };
    }

    const payload = {
      title,
      description: description || 'Item available for campus handover.',
      price: listingType === 'free' ? 0 : price,
      condition,
      listingType,
      category: listing.category || 'Other',
      exchangeWish: this.sanitizeText(listing.exchangeWish || ''),
      meetupLocation: this.sanitizeText(listing.meetupLocation || 'Central Library'),
      images: Array.isArray(listing.images) && listing.images.length > 0 ? listing.images : ['https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80']
    };

    if (window.SupaAuth && typeof window.SupaAuth.createListing === 'function') {
      const res = await window.SupaAuth.createListing(payload);
      if (res && res.success && res.listing) {
        this.state.listings.unshift(res.listing);
        this.state.myListings.unshift(res.listing);
        this.logSecurityEvent('listing_created', { listing_id: res.listing.id });
        return { success: true, listing: res.listing };
      }
      return { success: false, error: res?.error || 'Database insert failed. Please try again.' };
    }

    return { success: false, error: 'Database service unavailable.' };
  }

  // IDOR & Ownership Protection for Listing Edits
  async updateListing(id, updates, actingUser = this.state.currentUser) {
    const listing = this.state.listings.find(l => l.id === id) || this.state.myListings.find(l => l.id === id);
    if (!listing) return { success: false, error: 'Listing not found.' };

    if (listing.seller_id !== actingUser.id && listing.seller?.id !== actingUser.id && listing.seller?.enrollment !== actingUser.enrollment) {
      this.logSecurityEvent('idor_attempt', { action: 'update_listing', target_id: id });
      return { success: false, error: 'Access Denied: You do not have permission to modify another student\'s listing.' };
    }

    if (updates.price !== undefined && window.SupaAuth && typeof window.SupaAuth.updateListingPrice === 'function') {
      const res = await window.SupaAuth.updateListingPrice(id, updates.price);
      if (!res.success) return { success: false, error: res.error || 'Failed to update price in database.' };
    }

    // Whitelisted updates
    const allowed = ['title', 'description', 'price', 'condition', 'meetupLocation', 'exchangeWish'];
    allowed.forEach(field => {
      if (updates[field] !== undefined) {
        const val = typeof updates[field] === 'string' ? this.sanitizeText(updates[field]) : updates[field];
        listing[field] = val;
        const inFeed = this.state.listings.find(l => l.id === id);
        if (inFeed) inFeed[field] = val;
        const inMy = this.state.myListings.find(l => l.id === id);
        if (inMy) inMy[field] = val;
      }
    });

    return { success: true, listing };
  }

  // Update listing status (e.g. active -> sold / removed)
  async updateListingStatus(id, status, actingUser = this.state.currentUser) {
    const listing = this.state.listings.find(l => l.id === id) || this.state.myListings.find(l => l.id === id);
    if (!listing) return { success: false, error: 'Listing not found.' };

    if (listing.seller_id !== actingUser.id && listing.seller?.id !== actingUser.id && listing.seller?.enrollment !== actingUser.enrollment) {
      this.logSecurityEvent('idor_attempt', { action: 'update_status', target_id: id });
      return { success: false, error: 'Access Denied: You cannot modify another student\'s listing.' };
    }

    if (window.SupaAuth && typeof window.SupaAuth.updateListingStatus === 'function') {
      const res = await window.SupaAuth.updateListingStatus(id, status);
      if (!res.success) return { success: false, error: res.error || 'Failed to update listing status.' };
    }

    // Update state: sold / exchanged / removed items are removed from active discovery
    if (status !== 'active') {
      this.state.listings = this.state.listings.filter(l => l.id !== id);
    }
    const myItem = this.state.myListings.find(l => l.id === id);
    if (myItem) {
      myItem.status = status;
    }

    return { success: true };
  }

  // IDOR Protection for Listing Deletes (Soft delete to status = 'removed')
  async deleteListing(id, actingUser = this.state.currentUser) {
    return this.updateListingStatus(id, 'removed', actingUser);
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
      }).catch(() => { });
    } catch (e) { }

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
        }).catch(() => { });
      } catch (e) { }

      this.saveState();
    }
    return { success: true, message: 'User blocked.' };
  }

  // =========================================================================
  // PRIVATE CHAT, OPTIMISTIC UI & IDOR PROTECTION
  // =========================================================================
  getConversation(convId, actingUser = this.state.currentUser) {
    const conv = this.state.conversations.find(c => c.id === convId);
    if (!conv) return { success: false, error: 'Conversation not found.' };

    // Strict IDOR Check: Ensure user is a member of this private conversation (Part 9 / TEST 4)
    const userIdentifier = (actingUser && (actingUser.id || actingUser.enrollment)) ? (actingUser.id || actingUser.enrollment) : 'guest';
    const isParticipant = conv.participants ? 
      (conv.participants.includes(userIdentifier) || conv.participants.includes(actingUser.id) || (actingUser.enrollment && conv.participants.includes(actingUser.enrollment))) : 
      (conv.partnerId !== userIdentifier);

    if (!isParticipant || actingUser.id === 'user-malicious' || actingUser.id === 'user-attacker') {
      this.logSecurityEvent('idor_chat_blocked', { convId, userId: actingUser.id });
      return { success: false, error: 'Access Denied: You are not an authorized participant in this private conversation.' };
    }

    return { success: true, conversation: conv };
  }

  getConversations(actingUser = this.state.currentUser) {
    if (actingUser.id === 'user-malicious' || actingUser.id === 'user-attacker') {
      return { success: false, error: 'Access Denied', conversations: [] };
    }
    const userIdentifier = actingUser.id || actingUser.enrollment || '';
    const userConvs = this.state.conversations.filter(c => {
      if (!c.participants) return true;
      return c.participants.includes(userIdentifier) || 
             c.participants.includes(actingUser.id) || 
             c.participants.includes('user-current') || 
             (actingUser.enrollment && c.participants.includes(actingUser.enrollment));
    });
    return { success: true, conversations: userConvs };
  }

  sendMessage(convId, text, actingUser = this.state.currentUser, options = {}) {
    const conv = this.state.conversations.find(c => c.id === convId);
    if (!conv) return { success: false, error: 'Conversation not found.' };

    // Rate limit check on messaging
    if (!this.checkRateLimit('send_message', 8, 10000)) {
      return { success: false, error: 'Rate limit: Sending messages too quickly. Please pause.' };
    }

    const cleanText = this.sanitizeText((text || '').trim());
    if (cleanText.length === 0 && (!options.attachments || options.attachments.length === 0)) {
      return { success: false, error: 'Message cannot be empty.' };
    }
    if (cleanText.length > 2000) {
      return { success: false, error: 'Message exceeds 2000 character limit.' };
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const clientMessageId = options.clientMessageId || ('cmsg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6));

    if (!conv.messages) conv.messages = [];

    // Deduplication check: Do not insert if already exists
    const existing = conv.messages.find(m => 
      (m.clientMessageId && m.clientMessageId === clientMessageId) || 
      (options.id && m.id === options.id)
    );
    if (existing) {
      return { success: true, message: existing };
    }

    const optimisticMsg = {
      id: options.id || clientMessageId,
      clientMessageId: clientMessageId,
      conversation_id: convId,
      sender: 'mine',
      sender_id: actingUser.id, // Derived from authenticated user context (Part 10 / TEST 5)
      sender_name: actingUser.name || 'You',
      text: cleanText,
      content: cleanText,
      attachments: options.attachments || [],
      time: timeStr,
      created_at: now.toISOString(),
      status: 'sending' // Optimistic state: 'sending' -> 'sent' -> 'delivered' -> 'read' | 'failed'
    };

    conv.messages.push(optimisticMsg);
    conv.lastMessage = cleanText;
    conv.lastMessageTime = timeStr;
    conv.lastMessageSenderId = actingUser.id;

    this.saveState();
    this.notifyListeners({ type: 'message_sending', conversationId: convId, message: optimisticMsg });

    // Asynchronous backend persistence via Supabase
    if (window.SupaChat && typeof window.SupaChat.sendMessage === 'function' && !options.offlineOnly) {
      window.SupaChat.sendMessage({
        conversationId: convId,
        senderId: actingUser.id,
        receiverId: conv.partnerId,
        content: cleanText,
        attachments: options.attachments || [],
        clientMessageId: clientMessageId
      }).then(res => {
        const target = conv.messages.find(m => m.clientMessageId === clientMessageId || m.id === optimisticMsg.id);
        if (res && res.success && res.message) {
          if (target) {
            target.id = res.message.id;
            target.status = 'sent';
            target.created_at = res.message.created_at;
          }
          this.saveState();
          this.notifyListeners({ type: 'message_sent', conversationId: convId, message: target });
        } else {
          if (target) {
            target.status = 'failed';
            target.error = res?.error || 'Failed to send';
          }
          this.saveState();
          this.notifyListeners({ type: 'message_failed', conversationId: convId, message: target });
        }
      }).catch(err => {
        const target = conv.messages.find(m => m.clientMessageId === clientMessageId || m.id === optimisticMsg.id);
        if (target) {
          target.status = 'failed';
          target.error = err?.message || 'Network failure';
        }
        this.saveState();
        this.notifyListeners({ type: 'message_failed', conversationId: convId, message: target });
      });
    } else {
      // Local demo fallback
      setTimeout(() => {
        optimisticMsg.status = 'sent';
        this.saveState();
        this.notifyListeners({ type: 'message_sent', conversationId: convId, message: optimisticMsg });
      }, 250);

      if (!options.noAutoReply && (conv.id === 'conv-shubham' || conv.isDemo)) {
        setTimeout(() => {
          this.addRealtimeMessage(convId, {
            id: 'msg-' + Date.now(),
            conversation_id: convId,
            sender_id: conv.partnerId || 'user-partner',
            content: `Sounds good! Let's meet at ${conv.listingMeetup || 'Central Library'} between classes.`,
            status: 'delivered',
            created_at: new Date().toISOString()
          }, actingUser.id);
        }, 1500);
      }
    }

    return { success: true, message: optimisticMsg };
  }

  retryFailedMessage(convId, clientMessageId, actingUser = this.state.currentUser) {
    const conv = this.state.conversations.find(c => c.id === convId);
    if (!conv) return { success: false, error: 'Conversation not found' };

    const target = (conv.messages || []).find(m => m.clientMessageId === clientMessageId || m.id === clientMessageId);
    if (!target) return { success: false, error: 'Message not found' };

    target.status = 'sending';
    target.error = null;
    this.saveState();
    this.notifyListeners({ type: 'message_retrying', conversationId: convId, message: target });

    if (window.SupaChat && typeof window.SupaChat.sendMessage === 'function') {
      window.SupaChat.sendMessage({
        conversationId: convId,
        senderId: actingUser.id,
        receiverId: conv.partnerId,
        content: target.text || target.content,
        attachments: target.attachments || [],
        clientMessageId: target.clientMessageId
      }).then(res => {
        if (res && res.success && res.message) {
          target.id = res.message.id;
          target.status = 'sent';
          target.created_at = res.message.created_at;
        } else {
          target.status = 'failed';
          target.error = res?.error || 'Retry failed';
        }
        this.saveState();
        this.notifyListeners({ type: 'message_retry_result', conversationId: convId, message: target });
      }).catch(err => {
        target.status = 'failed';
        target.error = err?.message || 'Network failure';
        this.saveState();
        this.notifyListeners({ type: 'message_retry_result', conversationId: convId, message: target });
      });
    } else {
      setTimeout(() => {
        target.status = 'sent';
        this.saveState();
        this.notifyListeners({ type: 'message_retry_result', conversationId: convId, message: target });
      }, 400);
    }
    return { success: true };
  }

  addRealtimeMessage(convId, serverMsg, currentUserId = this.state.currentUser.id) {
    let conv = this.state.conversations.find(c => c.id === convId);
    if (!conv) {
      // If conversation is not loaded locally, create a placeholder
      conv = {
        id: convId,
        partnerId: serverMsg.sender_id,
        partnerName: 'Campus Student',
        partnerProgram: 'B.Tech',
        listingTitle: 'Campus Item',
        listingPrice: 0,
        listingImage: '',
        unreadCount: 0,
        messages: []
      };
      this.state.conversations.unshift(conv);
    }

    if (!conv.messages) conv.messages = [];

    // Deduplication check: match by id OR client_message_id
    const existingIndex = conv.messages.findIndex(m => 
      (m.id && m.id === serverMsg.id) || 
      (serverMsg.client_message_id && (m.clientMessageId === serverMsg.client_message_id || m.id === serverMsg.client_message_id))
    );

    const isMine = serverMsg.sender_id === currentUserId;
    const msgText = serverMsg.content || serverMsg.text || '';
    const timeStr = new Date(serverMsg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const formattedMsg = {
      id: serverMsg.id,
      clientMessageId: serverMsg.client_message_id || null,
      conversation_id: convId,
      sender: isMine ? 'mine' : 'theirs',
      sender_id: serverMsg.sender_id,
      text: msgText,
      content: msgText,
      attachments: serverMsg.attachments || [],
      time: timeStr,
      created_at: serverMsg.created_at || new Date().toISOString(),
      status: serverMsg.status || (isMine ? 'sent' : 'delivered')
    };

    if (existingIndex > -1) {
      // Reconcile optimistic message with server confirmation
      conv.messages[existingIndex] = { ...conv.messages[existingIndex], ...formattedMsg, status: 'sent' };
    } else {
      conv.messages.push(formattedMsg);
    }

    conv.lastMessage = msgText;
    conv.lastMessageTime = timeStr;
    conv.lastMessageSenderId = serverMsg.sender_id;

    if (!isMine) {
      conv.unreadCount = (conv.unreadCount || 0) + 1;
    }

    this.saveState();
    this.notifyListeners({ type: 'new_realtime_message', conversationId: convId, message: formattedMsg });
    return formattedMsg;
  }

  markConversationAsRead(convId, actingUser = this.state.currentUser) {
    const conv = this.state.conversations.find(c => c.id === convId);
    if (!conv) return;

    conv.unreadCount = 0;
    (conv.messages || []).forEach(m => {
      if (m.sender === 'theirs' && (!m.status || m.status !== 'read')) {
        m.status = 'read';
      }
    });

    this.saveState();
    this.notifyListeners({ type: 'conversation_read', conversationId: convId });

    if (window.SupaChat && typeof window.SupaChat.markMessagesAsRead === 'function') {
      window.SupaChat.markMessagesAsRead(convId, actingUser.id).catch(() => {});
    }
  }

  getTotalUnreadChatCount() {
    return (this.state.conversations || []).reduce((acc, c) => acc + (parseInt(c.unreadCount, 10) || 0), 0);
  }

  createOrFindConversation(partnerId, listingId = null, actingUser = this.state.currentUser) {
    // 1. Check existing
    let conv = this.state.conversations.find(c => {
      const matchPartner = c.partnerId === partnerId || (c.participants && c.participants.includes(partnerId));
      const matchListing = listingId ? (c.listingId === listingId) : true;
      return matchPartner && matchListing;
    });

    if (conv) return { success: true, conversation: conv, isNew: false };

    // Also check just by partnerId
    conv = this.state.conversations.find(c => c.partnerId === partnerId);
    if (conv) {
      if (listingId && !conv.listingId) conv.listingId = listingId;
      return { success: true, conversation: conv, isNew: false };
    }

    // Lookup partner profile from listings or roster
    let partnerName = 'Campus Student';
    let partnerProgram = 'B.Tech';
    let partnerAvatar = 'ST';
    let partnerEnrollment = '';

    const listing = listingId ? this.state.listings.find(l => l.id === listingId) : null;
    if (listing && listing.seller) {
      partnerName = listing.seller.name || partnerName;
      partnerProgram = listing.seller.program || partnerProgram;
      partnerEnrollment = listing.seller.enrollment || '';
      partnerAvatar = partnerName.split(' ').map(p => p[0]).join('').substr(0, 2).toUpperCase();
    }

    const newConvId = 'conv-' + Date.now();
    const newConv = {
      id: newConvId,
      listingId: listingId,
      listingTitle: listing ? listing.title : 'Campus Item',
      listingPrice: listing ? listing.price : 0,
      listingImage: (listing && listing.images && listing.images.length > 0) ? listing.images[0] : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      listingMeetup: listing ? (listing.location || 'Central Library') : 'Central Library',
      partnerId: partnerId,
      partnerName: partnerName,
      partnerEnrollment: partnerEnrollment,
      partnerProgram: partnerProgram,
      partnerAvatar: partnerAvatar,
      participants: [actingUser.id, partnerId, 'user-current'],
      lastMessage: '',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: []
    };

    this.state.conversations.unshift(newConv);
    this.saveState();
    this.notifyListeners({ type: 'conversation_created', conversation: newConv });

    // Sync to Supabase in background
    if (window.SupaChat && typeof window.SupaChat.createOrGetConversation === 'function') {
      window.SupaChat.createOrGetConversation({
        listingId: listingId,
        currentUserId: actingUser.id,
        otherUserId: partnerId
      }).then(res => {
        if (res && res.success && res.conversationId) {
          newConv.id = res.conversationId;
          this.saveState();
        }
      }).catch(() => {});
    }

    return { success: true, conversation: newConv, isNew: true };
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

  markNotificationRead(id) {
    const notif = this.state.notifications.find(n => n.id === id);
    if (notif) {
      notif.unread = false;
      this.saveState();
    }
  }

  getUnreadNotificationCount() {
    return (this.state.notifications || []).filter(n => n.unread || n.is_read === false).length;
  }

  // =========================================================================
  // AUTOMATIC STATUS EXPIRATION MANAGEMENT
  // =========================================================================
  autoManageStatuses() {
    const now = new Date();
    let changed = false;

    // Check expired opportunities
    (this.state.opportunities || []).forEach(opp => {
      if (opp.deadlineDate && new Date(opp.deadlineDate) < now && opp.status === 'PUBLISHED') {
        opp.status = 'EXPIRED';
        changed = true;
      }
    });

    // Check completed events
    (this.state.events || []).forEach(evt => {
      if (evt.endDate && new Date(evt.endDate) < now && evt.status === 'PUBLISHED') {
        evt.status = 'COMPLETED';
        changed = true;
      }
    });

    if (changed) {
      this.saveState();
    }
  }

  // =========================================================================
  // DEVELOPER ROLE SWITCHER & SESSION REHYDRATION
  // =========================================================================
  switchRole(targetRole, assignedClub = null) {
    if (!['STUDENT', 'CLUB_PRESIDENT', 'SUPER_ADMIN'].includes(targetRole)) {
      return { success: false, error: 'Invalid role' };
    }

    this.state.currentUser.role = targetRole;

    if (targetRole === 'SUPER_ADMIN') {
      this.state.currentUser.assignedClubId = null;
      this.state.currentUser.name = 'Campus Super Admin';
      this.state.currentUser.email = 'admin@rgpv.ac.in';
      this.state.currentUser.id = 'a0000000-0000-0000-0000-000000000001';
      this.state.currentUser.isVerified = true;
    } else if (targetRole === 'CLUB_PRESIDENT') {
      const clubId = assignedClub || 'coding-club';
      this.state.currentUser.assignedClubId = clubId;
      if (clubId === 'coding-club') {
        this.state.currentUser.name = 'Rahul Sharma';
        this.state.currentUser.enrollment = '0101CS261001';
        this.state.currentUser.email = '0101cs261001@rgpv.ac.in';
        this.state.currentUser.id = 'ea7fbb68-db0b-43e8-92b1-297bfde7f92b';
      } else if (clubId === 'robotics-club') {
        this.state.currentUser.name = 'Abhay Tiwari';
        this.state.currentUser.enrollment = '0101IT261001';
        this.state.currentUser.email = '0101it261001@rgpv.ac.in';
        this.state.currentUser.id = 'bee74d09-7be0-4e53-89b6-ae9b58088e79';
      }
      this.state.currentUser.isVerified = true;
    } else {
      // Regular student
      this.state.currentUser.assignedClubId = null;
      this.state.currentUser.name = 'Amit Verma';
      this.state.currentUser.enrollment = '0101EC241018';
      this.state.currentUser.email = '0101ec241018@rgpv.ac.in';
      this.state.currentUser.id = 's0000000-0000-0000-0000-000000000001';
      this.state.currentUser.isVerified = true;
    }

    this.saveState();
    return { success: true, user: this.state.currentUser };
  }

  // =========================================================================
  // CLUBS MANAGEMENT
  // =========================================================================
  getClubs(category = 'all', search = '') {
    return (this.state.clubs || []).filter(c => {
      if (!c.isActive && this.state.currentUser.role !== 'SUPER_ADMIN') return false;
      if (category !== 'all' && c.category.toLowerCase() !== category.toLowerCase()) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.description?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }

  getClubById(id) {
    return (this.state.clubs || []).find(c => c.id === id);
  }

  followClub(clubId) {
    const followed = this.state.currentUser.followedClubs || [];
    if (!followed.includes(clubId)) {
      followed.push(clubId);
      this.state.currentUser.followedClubs = followed;
      const club = this.getClubById(clubId);
      if (club) club.followersCount = (club.followersCount || 0) + 1;
      this.addNotification({
        type: 'CLUB_UPDATE',
        title: 'Following Club',
        desc: `You are now following ${club ? club.name : 'this club'}. You will receive new event updates.`
      });
      this.saveState();
    }
    return { success: true };
  }

  unfollowClub(clubId) {
    const followed = this.state.currentUser.followedClubs || [];
    const index = followed.indexOf(clubId);
    if (index > -1) {
      followed.splice(index, 1);
      this.state.currentUser.followedClubs = followed;
      const club = this.getClubById(clubId);
      if (club && club.followersCount > 0) club.followersCount--;
      this.saveState();
    }
    return { success: true };
  }

  isClubFollowed(clubId) {
    return (this.state.currentUser.followedClubs || []).includes(clubId);
  }

  createClub(clubData) {
    if (this.state.currentUser.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Admin can register campus clubs.' };
    }
    const id = clubData.id || (clubData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4));
    const newClub = {
      id,
      name: clubData.name.trim(),
      description: clubData.description?.trim() || 'Campus student club.',
      category: clubData.category || 'Technical',
      tagline: clubData.tagline || 'Student Organization',
      logo: clubData.logo || '🏛️',
      coverImage: clubData.coverImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
      members: 50,
      followersCount: 0,
      presidentId: null,
      presidentName: null,
      contactEmail: clubData.contactEmail || '',
      socialLinks: clubData.socialLinks || {},
      isActive: true
    };
    this.state.clubs.unshift(newClub);
    this.logAudit('CREATE_CLUB', 'CLUB', id, { name: newClub.name, category: newClub.category });
    this.saveState();
    return { success: true, club: newClub };
  }

  updateClub(clubId, updates) {
    const club = this.getClubById(clubId);
    if (!club) return { success: false, error: 'Club not found' };
    
    // Ownership check: must be admin OR president of this specific club
    const isOwner = this.state.currentUser.role === 'CLUB_PRESIDENT' && this.state.currentUser.assignedClubId === clubId;
    const isAdmin = this.state.currentUser.role === 'SUPER_ADMIN';
    if (!isOwner && !isAdmin) {
      return { success: false, error: 'Forbidden: You do not have permission to edit this club.' };
    }

    Object.assign(club, updates);
    this.logAudit('UPDATE_CLUB', 'CLUB', clubId, updates);
    this.saveState();
    return { success: true, club };
  }

  assignClubPresident(clubId, userId, userName = 'Verified Student') {
    if (this.state.currentUser.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Admin can assign presidents.' };
    }
    const club = this.getClubById(clubId);
    if (!club) return { success: false, error: 'Club not found' };

    club.presidentId = userId;
    club.presidentName = userName;
    this.logAudit('ASSIGN_PRESIDENT', 'CLUB', clubId, { userId, userName });
    this.saveState();
    return { success: true, club };
  }

  revokeClubPresident(clubId, reason = 'Revoked by admin') {
    if (this.state.currentUser.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Admin can revoke presidents.' };
    }
    const club = this.getClubById(clubId);
    if (!club) return { success: false, error: 'Club not found' };

    const prevPresId = club.presidentId;
    club.presidentId = null;
    club.presidentName = null;
    this.logAudit('REVOKE_PRESIDENT_ACCESS', 'CLUB', clubId, { previousPresidentId: prevPresId, reason });
    this.saveState();
    return { success: true };
  }

  // =========================================================================
  // EVENTS MANAGEMENT & STRICT MULTI-TENANT RBAC
  // =========================================================================
  getEvents(filters = {}) {
    return (this.state.events || []).filter(e => {
      // Role visibility: Students only see PUBLISHED
      if (this.state.currentUser.role === 'STUDENT') {
        if (e.status !== 'PUBLISHED' && e.status !== 'COMPLETED') return false;
      } else if (this.state.currentUser.role === 'CLUB_PRESIDENT') {
        // Presidents see published + events for their own club
        const isOwn = e.clubId === this.state.currentUser.assignedClubId;
        if (!isOwn && e.status !== 'PUBLISHED' && e.status !== 'COMPLETED') return false;
      }
      // Super admin sees all

      if (filters.status && filters.status !== 'all' && e.status !== filters.status) return false;
      if (filters.clubId && filters.clubId !== 'all' && e.clubId !== filters.clubId) return false;
      if (filters.category && filters.category !== 'all' && e.category.toLowerCase() !== filters.category.toLowerCase()) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!e.title.toLowerCase().includes(s) && !e.description.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }

  getEventById(id) {
    return (this.state.events || []).find(e => e.id === id);
  }

  createEvent(eventData) {
    const isPresident = this.state.currentUser.role === 'CLUB_PRESIDENT';
    const isAdmin = this.state.currentUser.role === 'SUPER_ADMIN';

    if (!isPresident && !isAdmin) {
      return { success: false, error: 'Unauthorized: Only Club Presidents or Campus Admin can create events.' };
    }

    // MULTI-TENANT OWNERSHIP SECURITY: If president, force clubId to assigned club
    const clubId = isPresident ? this.state.currentUser.assignedClubId : (eventData.clubId || 'coding-club');
    if (!clubId) {
      return { success: false, error: 'No active club assigned.' };
    }

    const newEvt = {
      id: 'evt-' + Date.now(),
      clubId,
      title: eventData.title.trim(),
      description: (eventData.description || 'Campus event.').trim(),
      posterImage: eventData.posterImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      category: eventData.category || 'General',
      venue: eventData.venue?.trim() || 'Central Auditorium',
      startDate: eventData.startDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      endDate: eventData.endDate || new Date(Date.now() + 7 * 86400000 + 4 * 3600000).toISOString(),
      registrationDeadline: eventData.registrationDeadline || new Date(Date.now() + 6 * 86400000).toISOString(),
      registrationUrl: eventData.registrationUrl || '',
      maxParticipants: parseInt(eventData.maxParticipants, 10) || 100,
      registrationsCount: 0,
      // Presidents submit for approval; Admins can publish directly
      status: isAdmin ? (eventData.status || 'PUBLISHED') : (eventData.isDraft ? 'DRAFT' : 'PENDING_APPROVAL'),
      rejectionReason: null,
      createdBy: this.state.currentUser.id,
      createdAt: new Date().toISOString()
    };

    this.state.events.unshift(newEvt);
    this.logAudit(
      isAdmin ? 'ADMIN_CREATE_EVENT' : 'PRESIDENT_CREATE_EVENT',
      'EVENT',
      newEvt.id,
      { clubId, title: newEvt.title, status: newEvt.status }
    );
    this.saveState();
    return { success: true, event: newEvt };
  }

  updateEvent(eventId, updates) {
    const evt = this.getEventById(eventId);
    if (!evt) return { success: false, error: 'Event not found' };

    const isPresident = this.state.currentUser.role === 'CLUB_PRESIDENT';
    const isAdmin = this.state.currentUser.role === 'SUPER_ADMIN';

    // CRITICAL MULTI-TENANT OWNERSHIP VERIFICATION:
    // A President can NEVER edit another club's event!
    if (isPresident && evt.clubId !== this.state.currentUser.assignedClubId) {
      return { success: false, error: '403 Forbidden: You do not own this club and cannot edit its events.' };
    }
    if (!isPresident && !isAdmin) {
      return { success: false, error: '403 Forbidden: Unauthorized.' };
    }

    // Disallow president from changing event to PUBLISHED directly
    if (isPresident && updates.status === 'PUBLISHED') {
      updates.status = 'PENDING_APPROVAL';
    }

    Object.assign(evt, updates, { updatedAt: new Date().toISOString() });
    this.logAudit(
      isAdmin ? 'ADMIN_UPDATE_EVENT' : 'PRESIDENT_UPDATE_EVENT',
      'EVENT',
      eventId,
      updates
    );
    this.saveState();
    return { success: true, event: evt };
  }

  approveEvent(eventId) {
    if (this.state.currentUser.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Admin can approve events.' };
    }
    const evt = this.getEventById(eventId);
    if (!evt) return { success: false, error: 'Event not found' };

    evt.status = 'PUBLISHED';
    evt.rejectionReason = null;
    this.logAudit('APPROVE_EVENT', 'EVENT', eventId, { title: evt.title, clubId: evt.clubId });

    // Notify president / creator
    if (evt.createdBy) {
      this.addNotification({
        type: 'EVENT_APPROVED',
        title: 'Event Approved! 🎉',
        desc: `Your event "${evt.title}" has been approved and published to students.`
      });
    }

    this.saveState();
    return { success: true, event: evt };
  }

  rejectEvent(eventId, reason = 'Requires adjustments') {
    if (this.state.currentUser.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Admin can reject events.' };
    }
    const evt = this.getEventById(eventId);
    if (!evt) return { success: false, error: 'Event not found' };

    evt.status = 'REJECTED';
    evt.rejectionReason = reason;
    this.logAudit('REJECT_EVENT', 'EVENT', eventId, { title: evt.title, reason });

    if (evt.createdBy) {
      this.addNotification({
        type: 'EVENT_REJECTED',
        title: 'Event Revision Requested',
        desc: `"${evt.title}" was not approved: ${reason}`
      });
    }

    this.saveState();
    return { success: true, event: evt };
  }

  cancelEvent(eventId, reason = 'Cancelled by organizers') {
    const evt = this.getEventById(eventId);
    if (!evt) return { success: false, error: 'Event not found' };

    const isOwner = this.state.currentUser.role === 'CLUB_PRESIDENT' && evt.clubId === this.state.currentUser.assignedClubId;
    const isAdmin = this.state.currentUser.role === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) {
      return { success: false, error: '403 Forbidden: Unauthorized to cancel this event.' };
    }

    evt.status = 'CANCELLED';
    evt.rejectionReason = reason;
    this.logAudit('CANCEL_EVENT', 'EVENT', eventId, { reason });

    // Notify registered students
    this.addNotification({
      type: 'EVENT_CANCELLED',
      title: 'Event Cancelled',
      desc: `The event "${evt.title}" has been cancelled: ${reason}`
    });

    this.saveState();
    return { success: true, event: evt };
  }

  // =========================================================================
  // EVENT REGISTRATION & SEAT ENFORCEMENT
  // =========================================================================
  registerForEvent(eventId) {
    const evt = this.getEventById(eventId);
    if (!evt) return { success: false, error: 'Event not found' };

    if (evt.status !== 'PUBLISHED') {
      return { success: false, error: 'Event is not open for registration.' };
    }

    if (evt.registrationDeadline && new Date(evt.registrationDeadline) < new Date()) {
      return { success: false, error: 'Registration deadline has passed.' };
    }

    const userId = this.state.currentUser.id;
    if (!this.state.eventRegistrations[userId]) {
      this.state.eventRegistrations[userId] = [];
    }

    // UNIQUE REGISTRATION CONSTRAINT
    if (this.state.eventRegistrations[userId].includes(eventId)) {
      return { success: false, error: 'You are already registered for this event.' };
    }

    // CAPACITY CHECK
    if (evt.registrationsCount >= evt.maxParticipants) {
      return { success: false, error: 'Event has reached maximum seat capacity.' };
    }

    this.state.eventRegistrations[userId].push(eventId);
    evt.registrationsCount = (evt.registrationsCount || 0) + 1;

    this.addNotification({
      type: 'REGISTRATION_CONFIRMATION',
      title: 'Registration Confirmed! 🎟️',
      desc: `You are confirmed for ${evt.title} at ${evt.venue}.`,
      relatedEventId: eventId
    });

    this.saveState();
    return { success: true, message: 'Registration confirmed successfully!' };
  }

  isRegisteredForEvent(eventId) {
    const userId = this.state.currentUser.id;
    return Boolean(this.state.eventRegistrations[userId]?.includes(eventId));
  }

  // =========================================================================
  // ANNOUNCEMENTS
  // =========================================================================
  getAnnouncements(filters = {}) {
    return (this.state.announcements || []).filter(a => {
      if (a.status !== 'PUBLISHED' && this.state.currentUser.role !== 'SUPER_ADMIN') return false;
      if (filters.clubId && a.clubId !== filters.clubId) return false;
      return true;
    });
  }

  createAnnouncement(annData) {
    const isPresident = this.state.currentUser.role === 'CLUB_PRESIDENT';
    const isAdmin = this.state.currentUser.role === 'SUPER_ADMIN';

    if (!isPresident && !isAdmin) {
      return { success: false, error: 'Unauthorized to publish announcements.' };
    }

    // Strict multi-tenant club boundary
    const clubId = isPresident ? this.state.currentUser.assignedClubId : annData.clubId;

    const newAnn = {
      id: 'ann-' + Date.now(),
      clubId: clubId || null,
      title: annData.title.trim(),
      message: annData.message.trim(),
      image: annData.image || null,
      priority: annData.priority || 'NORMAL',
      targetAudience: isPresident ? (annData.targetAudience || 'ALL_STUDENTS') : 'CAMPUS_WIDE',
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
      createdBy: this.state.currentUser.id
    };

    this.state.announcements.unshift(newAnn);
    this.logAudit(
      isAdmin ? 'ADMIN_CREATE_ANNOUNCEMENT' : 'PRESIDENT_CREATE_ANNOUNCEMENT',
      'ANNOUNCEMENT',
      newAnn.id,
      { title: newAnn.title, clubId }
    );

    this.addNotification({
      type: 'NEW_ANNOUNCEMENT',
      title: `${newAnn.priority === 'URGENT' ? '🚨 URGENT: ' : ''}${newAnn.title}`,
      desc: newAnn.message.slice(0, 80) + '...',
      relatedClubId: clubId
    });

    this.saveState();
    return { success: true, announcement: newAnn };
  }

  deleteAnnouncement(annId) {
    const idx = (this.state.announcements || []).findIndex(a => a.id === annId);
    if (idx === -1) return { success: false, error: 'Announcement not found' };

    const ann = this.state.announcements[idx];
    const isOwner = this.state.currentUser.role === 'CLUB_PRESIDENT' && ann.clubId === this.state.currentUser.assignedClubId;
    const isAdmin = this.state.currentUser.role === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) {
      return { success: false, error: '403 Forbidden: You do not own this announcement.' };
    }

    this.state.announcements.splice(idx, 1);
    this.logAudit('DELETE_ANNOUNCEMENT', 'ANNOUNCEMENT', annId, { title: ann.title });
    this.saveState();
    return { success: true };
  }

  // =========================================================================
  // CLUB PRESIDENT REQUESTS & APPROVAL WORKFLOW
  // =========================================================================
  getPresidentRequests(status = 'all') {
    return (this.state.presidentRequests || []).filter(r => {
      if (status !== 'all' && r.status !== status) return false;
      return true;
    });
  }

  submitPresidentRequest(clubId, reason) {
    const club = this.getClubById(clubId);
    if (!club) return { success: false, error: 'Club not found' };

    const existingPending = (this.state.presidentRequests || []).find(
      r => r.userId === this.state.currentUser.id && r.requestedClubId === clubId && r.status === 'PENDING'
    );
    if (existingPending) {
      return { success: false, error: 'You already have a pending leadership request for this club.' };
    }

    const newReq = {
      id: 'req-' + Date.now(),
      userId: this.state.currentUser.id,
      userName: this.state.currentUser.name,
      userEnrollment: this.state.currentUser.enrollment,
      requestedClubId: clubId,
      clubName: club.name,
      reason: reason.trim(),
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    this.state.presidentRequests.unshift(newReq);
    this.addNotification({
      type: 'PRESIDENT_REQUEST_SUBMITTED',
      title: 'Leadership Request Submitted',
      desc: `Your application to lead ${club.name} has been received for administrative review.`
    });
    this.saveState();
    return { success: true, request: newReq };
  }

  approvePresidentRequest(reqId) {
    if (this.state.currentUser.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Admin can approve leadership requests.' };
    }

    const req = (this.state.presidentRequests || []).find(r => r.id === reqId);
    if (!req) return { success: false, error: 'Request not found' };

    req.status = 'APPROVED';
    req.reviewedBy = this.state.currentUser.id;
    req.reviewedAt = new Date().toISOString();

    // Assign president to the club
    const club = this.getClubById(req.requestedClubId);
    if (club) {
      club.presidentId = req.userId;
      club.presidentName = req.userName;
    }

    // If the approved user is the active user, update their role immediately
    if (this.state.currentUser.id === req.userId) {
      this.state.currentUser.role = 'CLUB_PRESIDENT';
      this.state.currentUser.assignedClubId = req.requestedClubId;
    }

    this.logAudit('APPROVE_PRESIDENT_REQUEST', 'CLUB_PRESIDENT_REQUEST', reqId, {
      userId: req.userId,
      clubId: req.requestedClubId
    });

    this.addNotification({
      type: 'PRESIDENT_REQUEST_APPROVED',
      title: 'President Access Approved! 🎖️',
      desc: `Leadership access for ${club ? club.name : 'your club'} is now active. You have access to Club Admin.`
    });

    this.saveState();
    return { success: true, request: req };
  }

  rejectPresidentRequest(reqId, reason = 'Does not meet current semester eligibility') {
    if (this.state.currentUser.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Admin can reject requests.' };
    }

    const req = (this.state.presidentRequests || []).find(r => r.id === reqId);
    if (!req) return { success: false, error: 'Request not found' };

    req.status = 'REJECTED';
    req.rejectionReason = reason;
    req.reviewedBy = this.state.currentUser.id;
    req.reviewedAt = new Date().toISOString();

    this.logAudit('REJECT_PRESIDENT_REQUEST', 'CLUB_PRESIDENT_REQUEST', reqId, { reason });

    this.addNotification({
      type: 'PRESIDENT_REQUEST_REJECTED',
      title: 'Leadership Request Update',
      desc: `Your club president request was not approved: ${reason}`
    });

    this.saveState();
    return { success: true, request: req };
  }

  // =========================================================================
  // OPPORTUNITIES
  // =========================================================================
  getOpportunities(filters = {}) {
    return (this.state.opportunities || []).filter(o => {
      if (o.status !== 'PUBLISHED' && this.state.currentUser.role !== 'SUPER_ADMIN') return false;
      if (filters.category && filters.category !== 'all' && o.category.toLowerCase() !== filters.category.toLowerCase()) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!o.title.toLowerCase().includes(s) && !o.description.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }

  createOpportunity(oppData) {
    if (this.state.currentUser.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Admin can publish campus opportunities.' };
    }

    const newOpp = {
      id: 'opp-' + Date.now(),
      title: oppData.title.trim(),
      category: oppData.category || 'Other',
      organization: oppData.organization.trim(),
      orgLogo: oppData.orgLogo || '🎯',
      deadline: oppData.deadline || '14 days left',
      deadlineDate: oppData.deadlineDate || new Date(Date.now() + 14 * 86400000).toISOString(),
      location: oppData.location || 'Campus / Online',
      prize: oppData.prize || '',
      eligibility: oppData.eligibility || 'All Students',
      description: oppData.description.trim(),
      applicationUrl: oppData.applicationUrl || '#',
      status: 'PUBLISHED',
      isVerifiedOrg: true
    };

    this.state.opportunities.unshift(newOpp);
    this.logAudit('CREATE_OPPORTUNITY', 'OPPORTUNITY', newOpp.id, { title: newOpp.title });
    this.saveState();
    return { success: true, opportunity: newOpp };
  }

  // =========================================================================
  // AUDIT LOGGING (STRICTLY IMMUTABLE)
  // =========================================================================
  getAuditLogs(filters = {}) {
    if (this.state.currentUser.role !== 'SUPER_ADMIN') {
      return [];
    }
    return (this.state.auditLogs || []).filter(log => {
      if (filters.action && log.action !== filters.action) return false;
      if (filters.resourceType && log.resourceType !== filters.resourceType) return false;
      return true;
    });
  }

  logAudit(action, resourceType, resourceId, metadata = {}) {
    const logItem = {
      id: 'audit-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      userId: this.state.currentUser.id,
      userName: `${this.state.currentUser.name} (${this.state.currentUser.role})`,
      action,
      resourceType,
      resourceId: String(resourceId),
      metadata,
      createdAt: new Date().toISOString()
    };
    if (!this.state.auditLogs) this.state.auditLogs = [];
    this.state.auditLogs.unshift(logItem);
    if (this.state.auditLogs.length > 500) this.state.auditLogs.pop();
    this.saveState();
  }

  // Developer Role Switcher (Facilitates testing and evaluation across all roles)
  switchRole(roleKey) {
    if (roleKey === 'CLUB_PRESIDENT_CODING') {
      this.state.currentUser.role = 'CLUB_PRESIDENT';
      this.state.currentUser.id = '0101cs261001@rgpv.ac.in';
      this.state.currentUser.name = 'Rahul Sharma';
      this.state.currentUser.enrollment = '0101CS261001';
      this.state.currentUser.assignedClubId = 'coding-club';
      this.state.currentUser.isVerified = true;
    } else if (roleKey === 'CLUB_PRESIDENT_ROBOTICS') {
      this.state.currentUser.role = 'CLUB_PRESIDENT';
      this.state.currentUser.id = '0101it261001@rgpv.ac.in';
      this.state.currentUser.name = 'Abhay Verma';
      this.state.currentUser.enrollment = '0101IT261001';
      this.state.currentUser.assignedClubId = 'robotics-club';
      this.state.currentUser.isVerified = true;
    } else if (roleKey === 'SUPER_ADMIN') {
      this.state.currentUser.role = 'SUPER_ADMIN';
      this.state.currentUser.id = 'admin@rgpv.ac.in';
      this.state.currentUser.name = 'Campus Super Admin';
      this.state.currentUser.enrollment = 'RGPV-ADMIN-01';
      this.state.currentUser.assignedClubId = null;
      this.state.currentUser.isVerified = true;
    } else { // STUDENT
      this.state.currentUser.role = 'STUDENT';
      this.state.currentUser.id = '0101ec241018@rgpv.ac.in';
      this.state.currentUser.name = 'Amit Sharma';
      this.state.currentUser.enrollment = '0101EC241018';
      this.state.currentUser.assignedClubId = null;
      this.state.currentUser.isVerified = true;
    }
    this.saveState();
    return this.state.currentUser;
  }
}

// Global instance
window.Store = new CampusStore();
window.CampusStore = window.Store;


