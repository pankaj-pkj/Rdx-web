/* ================================================================
   MAIN.JS — ServiceX Platform
   © 2026 Codian Studio (PXJ)
   
   ✏ EDIT SITE CONFIG BELOW TO REBRAND
================================================================ */

/* ── SITE CONFIG ─────────────────────────────────────────────── */
window.SITE_CONFIG = {
  name:    'My Website',   // ← Change this ONE place - updates ALL pages
  letter:  'M',
  tagline: 'Premium API Token Solutions',
  year:    '2026',
  tg:      '@support',
};

/* ── HERO BLUR FIX (runs before DOM ready) ───────────────────── */
(function() {
  function showHero() {
    var els = document.querySelectorAll(
      '#hero h1, #hero .hero-badge, #hero .hero-sub, #hero .hero-btns, ' +
      '#hero .hero-stats, #hero .hstat, .iphone-outer, .phone-mockup-section, ' +
      '#navbar, .nav-logo, .nav-actions'
    );
    els.forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('in');
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showHero);
  } else {
    showHero();
  }
  window.addEventListener('load', showHero);
})();

/* ================================================================
   AUTH — localStorage session
================================================================ */
var Auth = {
  KEY: '__sw_sess',
  get: function() {
    try { return JSON.parse(localStorage.getItem(this.KEY)); }
    catch(e) { return null; }
  },
  save: function(u) { localStorage.setItem(this.KEY, JSON.stringify(u)); },
  clear: function()  { localStorage.removeItem(this.KEY); },
  isIn:  function()  { return !!this.get(); }
};
window.Auth = Auth;

/* ── applySiteName ───────────────────────────────────────────── */
function applySiteName() {
  var cfg = window.SITE_CONFIG;
  document.querySelectorAll('.site-name').forEach(function(el)  { el.textContent = cfg.name; });
  document.querySelectorAll('.site-letter').forEach(function(el){ el.textContent = cfg.letter; });
  document.querySelectorAll('.site-copyright').forEach(function(el) {
    el.textContent = '© ' + cfg.year + ' ' + cfg.name + '. All rights reserved.';
  });
  document.querySelectorAll('.site-tagline').forEach(function(el){ el.textContent = cfg.tagline; });
  if (document.title.includes('SITENAME')) {
    document.title = document.title.replace('SITENAME', cfg.name);
  }
}
window.applySiteName = applySiteName;

/* ── refreshNav ──────────────────────────────────────────────── */
function refreshNav() {
  var user = Auth.get();
  var acts = document.getElementById('navActions');
  var mob  = document.getElementById('mobileActions');

  if (acts) {
    if (user) {
      var init = (user.username || user.email || 'U')[0].toUpperCase();
      var name = user.username || (user.email ? user.email.split('@')[0] : 'User');
      acts.innerHTML =
        '<div style="display:flex;align-items:center;gap:8px">' +
          '<div style="width:32px;height:32px;border-radius:50%;background:var(--acc);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#fff">' + init + '</div>' +
          '<span style="font-size:13px;color:#8888aa;font-weight:500">' + name + '</span>' +
        '</div>' +
        '<button onclick="doLogout()" style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#8888aa;padding:7px 14px;border-radius:9px;font-size:13px;cursor:pointer;font-family:var(--sans)">Logout</button>';
      if (mob) mob.innerHTML =
        '<a href="#" onclick="doLogout()" style="color:var(--acc);font-weight:600;text-decoration:none">Logout (' + name + ')</a>';
    } else {
      acts.innerHTML =
        '<a href="login.html" class="btn btn-ghost" style="font-size:13px;padding:8px 16px">Login</a>' +
        '<a href="register.html" class="btn btn-primary" style="font-size:13px;padding:8px 16px">Get Started →</a>';
      if (mob) mob.innerHTML =
        '<a href="login.html" class="drawer-auth-btn drawer-auth-login">Login</a>' +
        '<a href="register.html" class="drawer-auth-btn drawer-auth-signup">Get Started →</a>';
    }
  }
}
window.refreshNav = refreshNav;

/* ── doLogout ────────────────────────────────────────────────── */
function doLogout() {
  if (window.__fbReady && window.__auth) {
    window.__auth.signOut()
      .then(function() { Auth.clear(); _afterLogout(); })
      .catch(function() { Auth.clear(); _afterLogout(); });
  } else {
    Auth.clear(); _afterLogout();
  }
}
function _afterLogout() {
  showToast('Logged out successfully.', 'success');
  setTimeout(function() { window.location.href = 'index.html'; }, 800);
}
window.doLogout = doLogout;

/* ── Firebase auth sync ──────────────────────────────────────── */
function initFBSync() {
  if (!window.__fbReady || !window.__auth) return;
  window.__auth.onAuthStateChanged(function(user) {
    if (user) {
      var cur = Auth.get();
      if (!cur || !cur.firebase) {
        Auth.save({
          uid: user.uid,
          email: user.email,
          username: user.displayName || user.email.split('@')[0],
          firebase: true
        });
        refreshNav();
      }
    } else {
      var cur = Auth.get();
      if (cur && cur.firebase) { Auth.clear(); refreshNav(); }
    }
  });
}

/* ================================================================
   NAVBAR — Scroll + Hamburger + Drawer
================================================================ */
window.addEventListener('scroll', function() {
  var nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

function openDrawer() {
  document.getElementById('drawerOverlay')?.classList.add('open');
  document.getElementById('siteDrawer')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('drawerOverlay')?.classList.remove('open');
  document.getElementById('siteDrawer')?.classList.remove('open');
  document.body.style.overflow = '';
}
window.openDrawer  = openDrawer;
window.closeDrawer = closeDrawer;

/* ── Language ── */
function setLang(code) {
  document.querySelectorAll('.lang-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.lang === code);
  });
  localStorage.setItem('__sw_lang', code);
  var names = { en:'English', es:'Español', zh:'中文' };
  showToast('Language: ' + (names[code] || code), 'success');
}
window.setLang = setLang;

/* ================================================================
   OTP / PHONE MOCKUP — Rotating code
================================================================ */
var otpEl = document.getElementById('otpNum');
if (otpEl) {
  otpEl.style.transition = 'opacity .3s';
  setInterval(function() {
    otpEl.style.opacity = '0';
    setTimeout(function() {
      otpEl.textContent = String(Math.floor(100000 + Math.random() * 900000));
      otpEl.style.opacity = '1';
    }, 300);
  }, 3500);
}

/* ================================================================
   COUNTRIES MARQUEE
================================================================ */
var COUNTRIES_LIST = [
  {n:'India',c:'in'},{n:'USA',c:'us'},{n:'UK',c:'gb'},{n:'UAE',c:'ae'},
  {n:'Germany',c:'de'},{n:'France',c:'fr'},{n:'Canada',c:'ca'},{n:'Australia',c:'au'},
  {n:'Brazil',c:'br'},{n:'Japan',c:'jp'},{n:'Korea',c:'kr'},{n:'Italy',c:'it'},
  {n:'Spain',c:'es'},{n:'Mexico',c:'mx'},{n:'Netherlands',c:'nl'},{n:'Sweden',c:'se'},
  {n:'Norway',c:'no'},{n:'Denmark',c:'dk'},{n:'Finland',c:'fi'},{n:'Poland',c:'pl'},
  {n:'Turkey',c:'tr'},{n:'Saudi Arabia',c:'sa'},{n:'Singapore',c:'sg'},{n:'Malaysia',c:'my'},
  {n:'Indonesia',c:'id'},{n:'Philippines',c:'ph'},{n:'Vietnam',c:'vn'},{n:'Thailand',c:'th'},
  {n:'Pakistan',c:'pk'},{n:'Bangladesh',c:'bd'},{n:'Nigeria',c:'ng'},{n:'Ghana',c:'gh'},
  {n:'South Africa',c:'za'},{n:'Egypt',c:'eg'},{n:'Argentina',c:'ar'},{n:'Colombia',c:'co'},
  {n:'Chile',c:'cl'},{n:'Peru',c:'pe'},{n:'Portugal',c:'pt'},{n:'Romania',c:'ro'},
  {n:'Greece',c:'gr'},{n:'Czech Rep.',c:'cz'},{n:'Belgium',c:'be'},{n:'Switzerland',c:'ch'},
  {n:'Hong Kong',c:'hk'},{n:'New Zealand',c:'nz'},{n:'Ireland',c:'ie'},{n:'Hungary',c:'hu'},
  {n:'Sri Lanka',c:'lk'},{n:'Kenya',c:'ke'}
];
var marqueeEl = document.getElementById('marquee');
if (marqueeEl) {
  var doubled = COUNTRIES_LIST.concat(COUNTRIES_LIST);
  marqueeEl.innerHTML = doubled.map(function(c) {
    return '<div class="c-chip"><img src="https://flagcdn.com/w20/' + c.c + '.png" alt="' + c.n + '" loading="lazy" width="20" height="14"/>' + c.n + '</div>';
  }).join('');
}

/* ================================================================
   SCROLL REVEAL — opacity stays 1, only translateY animates
================================================================ */
var revealObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

function observeReveal() {
  // Failsafe: mark all as visible after 2s regardless
  setTimeout(function() {
    document.querySelectorAll('.reveal:not(.in)').forEach(function(el) {
      el.classList.add('in');
    });
  }, 2000);
  document.querySelectorAll('.reveal:not(.in)').forEach(function(el) {
    revealObs.observe(el);
  });
}
window.observeReveal = observeReveal;

/* ================================================================
   FAQ ACCORDION — works for both faq-item and faq-item-new
================================================================ */
function toggleFaq(btn) {
  // Works with both old .faq-item and new .faq-item-new
  var item = btn.closest('.faq-item-new') || btn.closest('.faq-item');
  if (!item) return;
  var wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item-new.open, .faq-item.open').forEach(function(i) {
    i.classList.remove('open');
  });
  if (!wasOpen) item.classList.add('open');
}
window.toggleFaq = toggleFaq;

/* ================================================================
   TOAST
================================================================ */
function showToast(msg, type) {
  type = type || 'success';
  var t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.className = 'toast ' + type;
  t.innerHTML = '<span class="toast-icon">' + (type === 'success' ? '✅' : '❌') + '</span><span>' + msg + '</span>';
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(function() { t.classList.remove('show'); }, 3500);
}
window.showToast = showToast;

/* ── Smooth anchors ── */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ================================================================
   DOM READY — Single listener, runs everything
================================================================ */
document.addEventListener('DOMContentLoaded', function() {

  /* 1. Apply site name */
  applySiteName();

  /* 2. Update nav (login state) */
  refreshNav();

  /* 3. Start reveal animations */
  observeReveal();

  /* 4. Firebase sync (if available) */
  setTimeout(initFBSync, 600);

  /* 5. Hamburger button */
  var hbg = document.getElementById('hamburger');
  if (hbg) {
    hbg.addEventListener('click', openDrawer);
  }
  var dClose = document.getElementById('drawerClose');
  if (dClose) dClose.addEventListener('click', closeDrawer);
  var dOverlay = document.getElementById('drawerOverlay');
  if (dOverlay) dOverlay.addEventListener('click', closeDrawer);

  /* 6. Spring toggle */
  var springBtn = document.getElementById('springToggle');
  if (springBtn) {
    var springOn = localStorage.getItem('__sw_spring') !== 'off';
    springBtn.classList.toggle('on', springOn);
    document.documentElement.classList.toggle('no-spring', !springOn);
    document.body.classList.toggle('no-spring', !springOn);
    springBtn.addEventListener('click', function() {
      var isOn = springBtn.classList.toggle('on');
      localStorage.setItem('__sw_spring', isOn ? 'on' : 'off');
      document.documentElement.classList.toggle('no-spring', !isOn);
      document.body.classList.toggle('no-spring', !isOn);
      showToast(isOn ? '✨ Spring ON' : 'Spring OFF', 'success');
    });
  }

  /* 7. Theme toggle */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    var lightOn = localStorage.getItem('__sw_theme') === 'light';
    themeBtn.classList.toggle('on', lightOn);
    document.documentElement.classList.toggle('light-theme', lightOn);
    document.body.classList.toggle('light-theme', lightOn);
    themeBtn.addEventListener('click', function() {
      var isOn = themeBtn.classList.toggle('on');
      document.documentElement.classList.toggle('light-theme', isOn);
      document.body.classList.toggle('light-theme', isOn);
      localStorage.setItem('__sw_theme', isOn ? 'light' : 'dark');
      showToast(isOn ? '☀️ Light theme' : '🌙 Dark theme', 'success');
    });
  }

  /* 8. Language restore */
  var storedLang = localStorage.getItem('__sw_lang') || 'en';
  document.querySelectorAll('.lang-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.lang === storedLang);
  });

  /* 9. Active nav link */
  var cp = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.drawer-link').forEach(function(a) {
    a.classList.toggle('active', a.getAttribute('href') === cp);
  });

  /* 10. Navbar scroll */
  window.dispatchEvent(new Event('scroll'));
});
