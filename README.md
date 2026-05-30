# ⚡ Website — Complete Setup Guide
**© 2026 Codian Studio (PXJ)**

---

## ✏ Step 1 — Change Your Site Name

Open **`main.js`** and edit the FIRST 5 lines:

```js
window.SITE_CONFIG = {
  name:    'My Website',   // ← YOUR site name
  letter:  'M',           // ← Logo letter (first letter)
  tagline: 'Premium API Token Solutions',
  year:    '2026',
};
```

This updates ALL pages automatically — navbar, footer, title, auth pages, everywhere.

---

## 📁 File List

| File | What it does |
|---|---|
| `index.html` | Main landing page |
| `login.html` | ✅ Working login |
| `register.html` | ✅ Working registration |
| `pricing.html` | Dark plan cards |
| `quick-purchase.html` | Buy without account |
| `payment.html` | 4-step payment (always shows failure — by design) |
| `features.html` | Feature cards + API showcase |
| `market.html` | ✅ Marketplace with search + country |
| `faq.html` | Searchable FAQ accordion |
| `contact.html` | Telegram contact cards |
| `not-found.html` | 404 page for direct file access |
| `style.css` | All design styles |
| `main.js` | ✏ EDIT THIS — SITE_CONFIG + shared logic |
| `firebase-config.js` | Firebase (optional) |
| `security.js` | Anti-clone protection |
| `.htaccess` | Blocks /style.css etc. → 404 |
| `robots.txt` | SEO rules |

---

## 🚀 InfinityFree Upload Steps

1. Extract ZIP
2. Upload ALL files from `servicex-site/` directly into `htdocs/`
3. `.htaccess` is hidden — enable "Show Hidden Files" in File Manager
4. Done ✅

---

## 🔒 Source File Protection

When someone visits:
- `yoursite.com/style.css` → 302 redirect to `not-found.html`
- `yoursite.com/main.js` → 302 redirect to `not-found.html`
- `yoursite.com/firebase-config.js` → 403 Forbidden
- `yoursite.com/security.js` → 403 Forbidden

---

## ✅ All Working Features

| Feature | Status |
|---|---|
| Login (localStorage) | ✅ |
| Register + auto-login | ✅ |
| Logout from nav | ✅ |
| Spring scroll animations | ✅ |
| Spring ON/OFF toggle | ✅ |
| Dark/Light theme toggle | ✅ |
| Language selector | ✅ |
| Mobile drawer nav | ✅ |
| Marketplace search | ✅ |
| Country dropdown | ✅ |
| Plan detail modal | ✅ |
| Promo code SAVE10 | ✅ |
| Payment 4-step flow | ✅ (always fails) |
| iPhone mockup float | ✅ |
| DevTools protection | ✅ |
| Source file blocking | ✅ |

---

## 💳 Promo Codes

`SAVE10` · `PROMO10` · `DISC10` → 10% off

---

*© 2026 Codian Studio (PXJ)*
