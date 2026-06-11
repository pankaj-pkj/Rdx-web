/* =====================================================
   FIREBASE CONFIG — ServiceX Platform
   © 2026 Codian Studio (PXJ)

   ✏ SETUP (3 steps):
   1. Go to https://console.firebase.google.com
   2. Create project → Add Web App → Copy config
   3. Paste your values below & add your domain
===================================================== */

// ── ✏ PASTE YOUR FIREBASE CONFIG HERE ────────────────
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// ── ✏ ADD YOUR DOMAIN ─────────────────────────────────
const ALLOWED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'yoursite.com',           // ← replace with your domain
  'pankaj-pkj.github.io',   // ← your GitHub Pages domain
];

// ── Domain whitelist check ────────────────────────────
const _host = window.location.hostname;
const _allowed = ALLOWED_DOMAINS.some(d =>
  _host === d || _host.endsWith('.' + d)
);

if (!_allowed && _host !== '') {
  console.error('[Firebase] Blocked: unauthorized domain →', _host);
  window.__fbBlocked = true;
} else {
  window.__fbBlocked = false;
}

// ── Initialize Firebase ───────────────────────────────
if (!window.__fbBlocked && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    window.__auth = firebase.auth();
    window.__db   = firebase.firestore();
    window.__fbReady = true;
    console.log('[Firebase] ✓ Initialized');
  } catch(e) {
    console.warn('[Firebase] Init failed, using localStorage auth:', e.message);
    window.__fbReady = false;
  }
} else {
  window.__fbReady = false;
  if (firebaseConfig.apiKey === 'YOUR_API_KEY') {
    console.info('[Firebase] Not configured — using localStorage auth');
  }
}

/*
═══════════════════════════════════════════════════
  FIREBASE CONSOLE SETUP STEPS
═══════════════════════════════════════════════════

1. Go to: https://console.firebase.google.com
2. Create new project (or use existing)
3. Click "Add App" → Web (</>)
4. Copy the config object and paste above

5. Enable Authentication:
   Console → Authentication → Sign-in method → Enable:
   ✅ Email/Password

6. Enable Firestore:
   Console → Firestore Database → Create database
   Start in test mode (change rules later)

7. Firestore Security Rules:
   Console → Firestore → Rules → paste this:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null
                         && request.auth.uid == uid;
    }
    match /orders/{id} {
      allow create: if true;
      allow read:   if request.auth != null;
      allow update, delete: if false;
    }
    match /{doc=**} { allow read, write: if false; }
  }
}

8. Add your domain to Authorized Domains:
   Console → Authentication → Settings → Authorized domains
   Add: yoursite.com, pankaj-pkj.github.io
═══════════════════════════════════════════════════
*/
