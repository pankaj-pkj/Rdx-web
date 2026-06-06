
/* ── BLUR / FOUC FIX ──────────────────────────────────────
   Make hero elements visible immediately without waiting
   for IntersectionObserver (which causes blur on slow net)
────────────────────────────────────────────────────────── */
(function() {
  // Mark hero reveal elements as visible immediately
  function fixHeroBlur() {
    var heroEls = document.querySelectorAll(
      '#hero h1, #hero .hero-badge, #hero .hero-sub, ' +
      '#hero .hero-btns, #hero .hero-stats, ' +
      '#hero .hstat, #hero .hero-badge, ' +
      '.iphone-outer, .phone-mockup-section'
    );
    heroEls.forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('in');
    });
  }
  // Run immediately and after fonts load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixHeroBlur);
  } else {
    fixHeroBlur();
  }
  // Also run after all resources load
  window.addEventListener('load', fixHeroBlur);
})();

/* ── NAV always visible ─────────────────────────────────── */
(function() {
  var nav = document.getElementById('navbar');
  if (nav) { nav.style.opacity = '1'; nav.style.visibility = 'visible'; }
})();
/* ================================================================
   MAIN.JS — Shared Logic
   ✏  Edit SITE_CONFIG below to rebrand the entire site
================================================================ */

window.SITE_CONFIG = {
  name:     'My Website',      // ← Change this ONE place — updates all pages
  letter:   'M',               // ← Logo box letter
  tagline:  'Premium API Token Solutions',
  year:     '2026',
  tg:       '@support',
};

/* ── Apply name everywhere ──────────────────────────────────── */
function applySiteName() {
  const cfg = window.SITE_CONFIG;
  document.querySelectorAll('.site-name').forEach(el => el.textContent = cfg.name);
  document.querySelectorAll('.site-letter').forEach(el => el.textContent = cfg.letter);
  document.querySelectorAll('.site-copyright').forEach(el => {
    el.textContent = '© ' + cfg.year + ' ' + cfg.name + '. All rights reserved.';
  });
  document.querySelectorAll('.site-tagline').forEach(el => el.textContent = cfg.tagline);
  if (document.title.includes('SITENAME')) {
    document.title = document.title.replace('SITENAME', cfg.name);
  }
}
window.applySiteName = applySiteName;

/* ================================================================
   AUTH — localStorage session
================================================================ */
const Auth = {
  KEY: '__sw_sess',
  get()     { try { return JSON.parse(localStorage.getItem(this.KEY)); } catch(e) { return null; } },
  save(u)   { localStorage.setItem(this.KEY, JSON.stringify(u)); },
  clear()   { localStorage.removeItem(this.KEY); },
  isIn()    { return !!this.get(); },
};
window.Auth = Auth;

/* ── Update nav auth state ──────────────────────────────────── */
function refreshNav() {
  const user = Auth.get();
  const acts = document.getElementById('navActions');
  const mob  = document.getElementById('mobileActions');
  if (!acts) return;

  if (user) {
    const init = (user.username || user.email || 'U')[0].toUpperCase();
    acts.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px">
        <div style="width:34px;height:34px;border-radius:50%;background:var(--acc);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#fff">${init}</div>
        <span style="font-size:13px;color:var(--d-t2);font-weight:500">${user.username || user.email.split('@')[0]}</span>
      </div>
      <button onclick="doLogout()" style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#8888aa;padding:7px 14px;border-radius:9px;font-size:13px;cursor:pointer;font-family:var(--sans)">Logout</button>`;
    if (mob) mob.innerHTML = `<a href="#" onclick="doLogout()" style="color:var(--acc);font-weight:600">Logout (${user.username || user.email.split('@')[0]})</a>`;
  } else {
    acts.innerHTML = `
      <a href="login.html" class="btn btn-ghost" style="font-size:13px;padding:8px 16px;">Login</a>
      <a href="register.html" class="btn btn-primary" style="font-size:13px;padding:8px 16px;">Get Started →</a>`;
    if (mob) mob.innerHTML = `
      <a href="login.html" class="drawer-auth-btn drawer-auth-login">Login</a>
      <a href="register.html" class="drawer-auth-btn drawer-auth-signup">Get Started →</a>`;
  }
}

function doLogout() {
  Auth.clear();
  showToast('Logged out successfully.', 'success');
  setTimeout(() => window.location.href = 'index.html', 800);
}
window.doLogout = doLogout;

/* ================================================================
   NAVBAR — Scroll + Hamburger + Drawer
================================================================ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 40);
});

function openDrawer()  { document.getElementById('drawerOverlay')?.classList.add('open'); document.getElementById('siteDrawer')?.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeDrawer() { document.getElementById('drawerOverlay')?.classList.remove('open'); document.getElementById('siteDrawer')?.classList.remove('open'); document.body.style.overflow = ''; }
window.openDrawer  = openDrawer;
window.closeDrawer = closeDrawer;

document.getElementById('hamburger')?.addEventListener('click', openDrawer);
document.getElementById('drawerClose')?.addEventListener('click', closeDrawer);
document.getElementById('drawerOverlay')?.addEventListener('click', closeDrawer);

/* ── Spring effect toggle ── */
const springEl = document.getElementById('springToggle');
if (springEl) {
  const storedSpring = localStorage.getItem('__sw_spring') !== 'off';
  if (!storedSpring) { document.body.classList.add('no-spring'); springEl.classList.remove('on'); }
  else springEl.classList.add('on');
  springEl.addEventListener('click', () => {
    const on = springEl.classList.toggle('on');
    localStorage.setItem('__sw_spring', on ? 'on' : 'off');
    document.body.classList.toggle('no-spring', !on);
  });
}

/* ── Theme toggle ── */
const themeEl = document.getElementById('themeToggle');
if (themeEl) {
  const stored = localStorage.getItem('__sw_theme');
  if (stored === 'light') { document.body.classList.add('light-theme'); themeEl.classList.add('on'); }
  themeEl.addEventListener('click', () => {
    const on = themeEl.classList.toggle('on');
    document.body.classList.toggle('light-theme', on);
    localStorage.setItem('__sw_theme', on ? 'light' : 'dark');
  });
}

/* ── Language ── */
function setLang(code) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === code));
  localStorage.setItem('__sw_lang', code);
}
window.setLang = setLang;

/* ── Active nav link ── */
const _cp = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.drawer-link').forEach(a => {
  if (a.getAttribute('href') === _cp) a.classList.add('active');
});

/* ================================================================
   PHONE MOCKUP — Code animation
================================================================ */
const otpEl = document.getElementById('otpNum');
if (otpEl) {
  otpEl.style.transition = 'opacity .3s';
  setInterval(() => {
    otpEl.style.opacity = '0';
    setTimeout(() => {
      otpEl.textContent = String(Math.floor(100000 + Math.random() * 900000));
      otpEl.style.opacity = '1';
    }, 300);
  }, 3500);
}

/* ================================================================
   COUNTRIES MARQUEE
================================================================ */
const COUNTRIES_DATA = [
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
const marqueeEl = document.getElementById('marquee');
if (marqueeEl) {
  const doubled = [...COUNTRIES_DATA, ...COUNTRIES_DATA];
  marqueeEl.innerHTML = doubled.map(c =>
    `<div class="c-chip"><img src="https://flagcdn.com/w20/${c.c}.png" alt="${c.n}" loading="lazy" width="20" height="14"/>${c.n}</div>`
  ).join('');
}

/* ================================================================
   SPRING SCROLL REVEAL
================================================================ */
// Reveal observer - opacity always 1, only animates translateY
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.04, rootMargin: '0px 0px -20px 0px' });

function observeReveal() {
  // Mark all as 'in' after 2s regardless (failsafe)
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => {
      el.classList.add('in');
    });
  }, 2000);
  // Normal observer
  document.querySelectorAll('.reveal:not(.in)').forEach(el => revealObserver.observe(el));
}

/* ================================================================
   FAQ ACCORDION (for FAQ page)
================================================================ */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item-new');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item-new.open').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}
window.toggleFaq = toggleFaq;

/* ================================================================
   TOAST
================================================================ */
function showToast(msg, type = 'success') {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.className = 'toast ' + type;
  t.innerHTML = `<span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span><span>${msg}</span>`;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3500);
}
window.showToast = showToast;

/* ── Smooth anchors ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ── DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  applySiteName();
  refreshNav();
  observeReveal();
  // Restore stored language
  const storedLang = localStorage.getItem('__sw_lang') || 'en';
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === storedLang));
});

/* =====================================================
   FIXES — Spring, Theme, Drawer on all screens
===================================================== */

// Apply saved theme on page load immediately (before DOM ready)
(function() {
  if (localStorage.getItem('__sw_theme') === 'light') {
    document.body.classList.add('light-theme');
  }
  if (localStorage.getItem('__sw_spring') === 'off') {
    document.body.classList.add('no-spring');
  }
})();

// Spring toggle sync on load
document.addEventListener('DOMContentLoaded', function() {
  var springBtn = document.getElementById('springToggle');
  var themeBtn  = document.getElementById('themeToggle');

  if (springBtn) {
    var springOn = localStorage.getItem('__sw_spring') !== 'off';
    springBtn.classList.toggle('on', springOn);
    if (!springOn) document.body.classList.add('no-spring');

    springBtn.addEventListener('click', function() {
      var isOn = springBtn.classList.toggle('on');
      localStorage.setItem('__sw_spring', isOn ? 'on' : 'off');
      document.body.classList.toggle('no-spring', !isOn);
      showToast(isOn ? '✨ Spring effect ON' : 'Spring effect OFF', 'success');
    });
  }

  if (themeBtn) {
    var lightOn = localStorage.getItem('__sw_theme') === 'light';
    themeBtn.classList.toggle('on', lightOn);
    document.body.classList.toggle('light-theme', lightOn);

    themeBtn.addEventListener('click', function() {
      var isOn = themeBtn.classList.toggle('on');
      document.body.classList.toggle('light-theme', isOn);
      localStorage.setItem('__sw_theme', isOn ? 'light' : 'dark');
      showToast(isOn ? '☀️ Light theme ON' : '🌙 Dark theme ON', 'success');
    });
  }

  // Re-observe any newly rendered reveal elements
  setTimeout(observeReveal, 100);
});
