/* =====================================================
   FIREBASE CONFIG — ServiceX Platform
   © 2026 Codian Studio (PXJ)

   ✏ HOW TO SETUP:
   1. Replace _p1, _p2, _p3 below with your values
   2. Add your domain to _ALLOWED array
   3. Apply Firestore Security Rules (see bottom)
===================================================== */
;(function(_w) {
  'use strict';

  /* ── ✏ EDIT THESE — Your Firebase credentials ── */
  var _p1 = 'YOUR';           // ← First part of API key
  var _p2 = '_API_KEY_HERE';  // ← Rest of API key
  var _p3 = 'YOUR-PROJECT';   // ← Firebase project ID

  var _cfg = {
    apiKey:            _p1 + _p2,
    authDomain:        _p3 + '.firebaseapp.com',
    projectId:         _p3,
    storageBucket:     _p3 + '.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',   // ← Replace
    appId:             'YOUR_APP_ID',      // ← Replace
  };

  /* ── ✏ ADD YOUR DOMAIN HERE ── */
  var _ALLOWED = [
    'localhost',
    '127.0.0.1',
    'yoursite.com',           // ← Replace with your live domain
    'yoursite.web.app',       // ← Firebase Hosting URL
    'yoursite.firebaseapp.com'
  ];

  /* ── Domain check ── */
  var _host = _w.location.hostname;
  var _ok   = _ALLOWED.some(function(d) { return _host === d || _host.endsWith('.' + d); });

  if (!_ok && _host !== '') {
    console.error('[Config] ⛔ Unauthorized domain: ' + _host + '. Firebase blocked.');
    // Provide safe stubs so pages don't crash
    _w.auth = { onAuthStateChanged: function(cb){ cb(null); }, currentUser: null };
    _w.db   = {};
    return;
  }

  /* ── Init Firebase ── */
  try {
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
      firebase.initializeApp(_cfg);
      _w.auth = firebase.auth();
      _w.db   = firebase.firestore();
    } else {
      // Firebase SDK not loaded — site uses localStorage auth only
      _w.auth = { onAuthStateChanged: function(cb){ cb(null); }, currentUser: null };
      _w.db   = {};
    }
  } catch(e) {
    console.warn('[Config] Firebase not loaded — using localStorage auth only.');
    _w.auth = { onAuthStateChanged: function(cb){ cb(null); }, currentUser: null };
    _w.db   = {};
  }

  // Seal config
  try { Object.defineProperty(_w, '_cfg', { value: undefined, writable: false }); } catch(_) {}

})( window );

/*
══════════════════════════════════════════════════════
  FIRESTORE SECURITY RULES
  Paste in: Firebase Console → Firestore → Rules
══════════════════════════════════════════════════════

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /orders/{id} {
      allow create: if true;
      allow read:   if request.auth != null;
      allow update, delete: if false;
    }
    match /{doc=**} {
      allow read, write: if false;
    }
  }
}

══════════════════════════════════════════════════════
  firebase.json — Security Headers
  (For Firebase Hosting only)
══════════════════════════════════════════════════════

{
  "hosting": {
    "headers": [{
      "source": "**",
      "headers": [
        {"key": "X-Frame-Options",        "value": "SAMEORIGIN"},
        {"key": "X-Content-Type-Options",  "value": "nosniff"},
        {"key": "Referrer-Policy",         "value": "strict-origin-when-cross-origin"}
      ]
    }]
  }
}
*/
