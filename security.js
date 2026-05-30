/* =====================================================
   SECURITY.JS v3.0 — Anti-Clone & Source Protection
   © 2026 Codian Studio (PXJ). All Rights Reserved.
   InfinityFree / cPanel / Shared Hosting Compatible
===================================================== */
;(function(w, d) {
  'use strict';

  /* ── 1. CONSOLE BRANDING ──────────────────────────── */
  try {
    console.clear();
    const name = (w.SITE_CONFIG && w.SITE_CONFIG.name) || 'ServiceX';
    console.log('%c⚡ ' + name, 'color:#6c63ff;font-size:22px;font-weight:800;font-family:monospace');
    console.log('%c🚨 STOP! This is a browser feature for developers only.', 'color:#ef4444;font-size:13px;font-weight:700');
    console.log('%cIf someone told you to paste something here, they are trying to steal your data or hack your account.', 'color:#888;font-size:12px');
    console.log('%c© 2026 Codian Studio (PXJ) — Unauthorized cloning is strictly prohibited.', 'color:#6c63ff;font-size:11px');
  } catch(e) {}

  /* ── 2. DEVTOOLS SIZE DETECTION ───────────────────── */
  var _dtOpen = false;
  var _dtTimer = null;

  function _checkDevTools() {
    try {
      var wDiff = w.outerWidth  - w.innerWidth  > 160;
      var hDiff = w.outerHeight - w.innerHeight > 160;
      if (wDiff || hDiff) {
        if (!_dtOpen) { _dtOpen = true; _showDTWarning(); }
      } else {
        _dtOpen = false;
        var warn = d.getElementById('__sw_dt_warn');
        if (warn && !warn.classList.contains('__pinned')) warn.remove();
      }
    } catch(e) {}
  }
  setInterval(_checkDevTools, 1500);

  function _showDTWarning() {
    if (d.getElementById('__sw_dt_warn')) return;
    var el = d.createElement('div');
    el.id = '__sw_dt_warn';
    el.style.cssText = [
      'position:fixed','top:0','left:0','right:0','z-index:999999',
      'background:rgba(8,8,18,.97)','padding:20px 16px','text-align:center',
      'font-family:system-ui,sans-serif','border-bottom:2px solid #6c63ff',
      'box-shadow:0 4px 40px rgba(0,0,0,.7)'
    ].join(';');
    el.innerHTML =
      '<div style="font-size:28px;margin-bottom:8px">🔐</div>' +
      '<div style="color:#a78bfa;font-size:17px;font-weight:800;margin-bottom:6px">Developer Tools Detected</div>' +
      '<div style="color:#8888aa;font-size:13px;max-width:400px;margin:0 auto 12px;line-height:1.65">' +
        'Source inspection of this site is not permitted.<br>' +
        '<strong style="color:#eeeeff">© 2026 Codian Studio (PXJ)</strong>' +
      '</div>' +
      '<button onclick="document.getElementById(\'__sw_dt_warn\').remove()" ' +
        'style="padding:9px 22px;background:#6c63ff;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer">' +
        'OK, Close' +
      '</button>';
    if (d.body) d.body.appendChild(el);
  }

  /* ── 3. KEYBOARD SHORTCUTS BLOCKING ──────────────── */
  d.addEventListener('keydown', function(e) {
    var ctrl = e.ctrlKey || e.metaKey;
    var key  = (e.key || '').toLowerCase();

    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault(); e.stopPropagation();
      _showDTWarning(); return false;
    }
    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
    if (ctrl && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
      e.preventDefault(); e.stopPropagation(); return false;
    }
    // Ctrl+U (View Source)
    if (ctrl && key === 'u') {
      e.preventDefault(); e.stopPropagation(); return false;
    }
    // Ctrl+S (Save Page)
    if (ctrl && key === 's') {
      e.preventDefault(); e.stopPropagation(); return false;
    }
    // Ctrl+A (Select All) — only on non-input elements
    if (ctrl && key === 'a') {
      var tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag !== 'input' && tag !== 'textarea') {
        e.preventDefault(); return false;
      }
    }
  }, true);

  /* ── 4. RIGHT-CLICK CONTEXT MENU ─────────────────── */
  d.addEventListener('contextmenu', function(e) {
    var tag = (e.target && e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return; // allow on inputs
    e.preventDefault();
    _showContextTip(e.clientX, e.clientY);
    return false;
  });

  function _showContextTip(x, y) {
    var old = d.getElementById('__sw_ctx');
    if (old) old.remove();
    var tip = d.createElement('div');
    tip.id = '__sw_ctx';
    var safeX = Math.min(x, (w.innerWidth  || 400) - 200);
    var safeY = Math.min(y, (w.innerHeight || 600) - 60);
    tip.style.cssText = [
      'position:fixed',
      'left:' + safeX + 'px',
      'top:'  + safeY + 'px',
      'background:rgba(13,13,30,.97)',
      'border:1px solid rgba(108,99,255,.4)',
      'border-radius:12px',
      'padding:10px 18px',
      'z-index:99998',
      'font-family:system-ui,sans-serif',
      'font-size:13px',
      'color:#8888aa',
      'box-shadow:0 8px 32px rgba(0,0,0,.5)',
      'pointer-events:none',
      'white-space:nowrap',
      'animation:__ctxFade .2s ease'
    ].join(';');
    tip.innerHTML = '🔒 <strong style="color:#a78bfa">Protected</strong> · © 2026 Codian Studio';
    if (d.body) d.body.appendChild(tip);
    setTimeout(function() {
      tip.style.transition = 'opacity .4s';
      tip.style.opacity    = '0';
      setTimeout(function() { if (tip.parentNode) tip.remove(); }, 420);
    }, 2000);
  }

  // Inject fade keyframe
  try {
    var ks = d.createElement('style');
    ks.textContent = '@keyframes __ctxFade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}';
    d.head.appendChild(ks);
  } catch(e) {}

  /* ── 5. COPY WATERMARK ────────────────────────────── */
  d.addEventListener('copy', function(e) {
    try {
      var sel = w.getSelection ? w.getSelection() : null;
      if (!sel || sel.isCollapsed) return;
      var text = sel.toString();
      if (text.length > 20 && e.clipboardData) {
        e.clipboardData.setData('text/plain',
          text + '\n\n— © 2026 Codian Studio (PXJ) | Unauthorized reproduction prohibited.'
        );
        e.preventDefault();
      }
    } catch(err) {}
  });

  /* ── 6. PRINT PROTECTION ──────────────────────────── */
  w.addEventListener('beforeprint', function() {
    try {
      var msg = d.createElement('div');
      msg.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;font-family:system-ui;text-align:center;padding:40px';
      msg.innerHTML =
        '<div style="font-size:48px;margin-bottom:16px">🔐</div>' +
        '<h1 style="font-size:22px;margin-bottom:8px;color:#0d0d1a">Print Disabled</h1>' +
        '<p style="color:#666;font-size:14px;max-width:320px;line-height:1.6">' +
          'Printing this page is not permitted.<br>' +
          '<strong>© 2026 Codian Studio (PXJ). All rights reserved.</strong>' +
        '</p>';
      d.body.innerHTML = '';
      d.body.appendChild(msg);
    } catch(e) {}
  });

  /* ── 7. IFRAME / CLONE DETECTION ─────────────────── */
  try {
    if (w.self !== w.top) {
      w.top.location.href = w.location.href;
    }
  } catch(e) {
    // Cross-origin iframe — hide page
    try { d.body.style.display = 'none'; } catch(_) {}
  }

  /* ── 8. OWNERSHIP STAMP ───────────────────────────── */
  try {
    var stamp = d.createComment(
      '\n  ╔══════════════════════════════════════════════╗\n' +
      '  ║  © 2026 Codian Studio (PXJ)                  ║\n' +
      '  ║  All Rights Reserved.                        ║\n' +
      '  ║  Unauthorized copying is prohibited.         ║\n' +
      '  ╚══════════════════════════════════════════════╝\n'
    );
    if (d.head && d.head.firstChild) {
      d.head.insertBefore(stamp, d.head.firstChild);
    }
  } catch(e) {}

  /* ── 9. FIREBASE KEY REDACTOR IN CONSOLE ──────────── */
  try {
    var _origLog = console.log.bind(console);
    console.log = function() {
      var args = Array.prototype.slice.call(arguments).map(function(a) {
        if (typeof a === 'string') {
          return a.replace(/AIza[0-9A-Za-z\-_]{35}/g, '***REDACTED***');
        }
        return a;
      });
      _origLog.apply(console, args);
    };
  } catch(e) {}

  /* ── 10. SESSION INTEGRITY ────────────────────────── */
  try {
    var _intKey = '__sx_int';
    var _intVal = btoa('sx_' + (d.domain || 'local'));
    if (localStorage.getItem(_intKey) && localStorage.getItem(_intKey) !== _intVal) {
      console.warn('[Security] Session integrity mismatch.');
    }
    localStorage.setItem(_intKey, _intVal);
  } catch(e) {}

})(window, document);
