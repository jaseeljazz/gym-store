/* =========================================================
   IRON & PULSE — shared behaviour
   Catalog, cart, wishlist, currency, theme, toasts, sliders
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Storage helpers (fail-safe) ---------- */
  const LS = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (e) { /* storage unavailable */ }
    }
  };

  // Lightweight Unsplash images: auto WebP/AVIF, quality 60, sized per use
  const PHOTO = {
    'hero-power-rack.jpg': 'photo-1534438327276-14e5300c3a48',
    'squat-rack-bench.jpg': 'photo-1593079831268-3381b0db4a77',
    'adjustable-dumbbells.jpg': 'photo-1584735935682-2f2b69dff9d2',
    'cardio-air-bike.jpg': 'photo-1576678927484-cc907957088c',
    'recovery-mobility.jpg': 'photo-1518611012118-696072aa579a',
    'home-gym-bundle.jpg': 'photo-1571019614242-c5c5dee9f50b',
    'dumbbell-press.jpg': 'photo-1583454110551-21f2fa2afe61',
    'dumbbell-detail.jpg': 'photo-1638536532686-d610adfc8e5c',
    'olympic-barbell.jpg': 'photo-1517963879433-6ad2b056d712',
    'bumper-plates.jpg': 'photo-1590487988256-9ed24133863e',
    'rowing-machine.jpg': 'photo-1519505907962-0a6cb0167c73',
    'treadmill.jpg': 'photo-1540497077202-7c8a3999166f',
    'massage-gun.jpg': 'photo-1617952986600-802f965dcdbc',
    'kettlebell-set.jpg': 'photo-1517344884509-a0c97ec11bcc',
    'cable-trainer.jpg': 'photo-1581009146145-b5ef050c2e1e',
    'customer-marcus.jpg': 'photo-1507003211169-0a1dd7228f2d',
    'customer-priya.jpg': 'photo-1544005313-94ddf0286df2',
    'customer-daniel.jpg': 'photo-1500648767791-00dcc994a43e',
    'customer-sofia.jpg': 'photo-1438761681033-6461ffad8d80',
    'customer-james.jpg': 'photo-1506794778202-cad84cf45f1d'
  };
  const img = (file, w) => `https://images.unsplash.com/${PHOTO[file]}?auto=format&fit=crop&w=${w || 600}&q=60`;
  const srcset = (url) => `${url.replace(/w=\d+/, 'w=400')} 400w, ${url.replace(/w=\d+/, 'w=800')} 800w`;

  /* ---------- Catalog ---------- */
  const PRODUCTS = [
    { id: 'titan-db', name: 'Titan Adjustable Dumbbell Set', category: 'dumbbells', brand: 'Ironforge', price: 499, oldPrice: null, rating: 4.9, reviews: 1284, capLbs: 100, load: '5–50 lb per handle', badge: 'Best Seller', added: 20260301, img: img('adjustable-dumbbells.jpg'), spec: '5–50 lb pair' },
    { id: 'apex-rack', name: 'Apex PR-3000 Power Rack', category: 'racks', brand: 'Kodiak', price: 1299, oldPrice: 1529, rating: 4.8, reviews: 642, capLbs: 1000, load: 'Rated to 1,000 lb', badge: '15% OFF', added: 20260115, img: img('hero-power-rack.jpg'), spec: '7 ft, black' },
    { id: 'olympic-bar', name: 'Olympic Barbell 20 kg, Hard Chrome', category: 'dumbbells', brand: 'Ironforge', price: 289, oldPrice: null, rating: 4.7, reviews: 918, capLbs: 1500, load: '190k PSI shaft', badge: null, added: 20251120, img: img('olympic-barbell.jpg'), spec: '28.5 mm shaft' },
    { id: 'bumper-set', name: 'Competition Bumper Plate Set', category: 'dumbbells', brand: 'Kodiak', price: 749, oldPrice: null, rating: 4.6, reviews: 377, capLbs: 260, load: '260 lb total', badge: null, added: 20251004, img: img('bumper-plates.jpg'), spec: '260 lb set' },
    { id: 'air-bike', name: 'Assault Air Bike X1', category: 'cardio', brand: 'PulseFit', price: 899, oldPrice: null, rating: 4.8, reviews: 501, capLbs: 350, load: 'User max 350 lb', badge: 'New', added: 20260410, img: img('cardio-air-bike.jpg'), spec: 'Fan resistance' },
    { id: 'rower-r7', name: 'Magnetic Rowing Machine R7', category: 'cardio', brand: 'PulseFit', price: 1049, oldPrice: 1234, rating: 4.5, reviews: 266, capLbs: 300, load: 'User max 300 lb', badge: '15% OFF', added: 20260222, img: img('rowing-machine.jpg'), spec: '16 levels' },
    { id: 'treadmill-t9', name: 'Commercial Treadmill T9', category: 'cardio', brand: 'Vanta', price: 3499, oldPrice: null, rating: 4.7, reviews: 189, capLbs: 400, load: 'User max 400 lb', badge: null, added: 20250918, img: img('treadmill.jpg'), spec: '4.0 HP AC motor' },
    { id: 'fid-bench', name: 'Adjustable FID Bench', category: 'benches', brand: 'Ironforge', price: 349, oldPrice: null, rating: 4.8, reviews: 1033, capLbs: 1000, load: 'Rated to 1,000 lb', badge: 'Best Seller', added: 20251201, img: img('squat-rack-bench.jpg'), spec: '7 back angles' },
    { id: 'massage-gun', name: 'Percussion Massage Gun Pro', category: 'recovery', brand: 'Vanta', price: 179, oldPrice: null, rating: 4.4, reviews: 742, capLbs: 0, load: '6 attachments', badge: null, added: 20260318, img: img('massage-gun.jpg'), spec: 'Matte graphite' },
    { id: 'kb-set', name: 'Competition Kettlebell Set', category: 'dumbbells', brand: 'Kodiak', price: 329, oldPrice: null, rating: 4.7, reviews: 214, capLbs: 106, load: '8, 16 & 24 kg', badge: null, added: 20260105, img: img('kettlebell-set.jpg'), spec: '3-bell set' },
    { id: 'cable-trainer', name: 'Dual Cable Functional Trainer', category: 'racks', brand: 'Kodiak', price: 2199, oldPrice: null, rating: 4.9, reviews: 158, capLbs: 400, load: '2 × 200 lb stacks', badge: 'New', added: 20260502, img: img('cable-trainer.jpg'), spec: '2:1 ratio' },
    { id: 'mobility-kit', name: 'Foam Roller & Mobility Kit', category: 'recovery', brand: 'PulseFit', price: 59, oldPrice: null, rating: 4.3, reviews: 489, capLbs: 0, load: '5-piece kit', badge: null, added: 20250820, img: img('recovery-mobility.jpg'), spec: 'High-density' }
  ];
  const CATEGORIES = {
    racks: 'Racks & Rigs',
    dumbbells: 'Dumbbells & Barbells',
    cardio: 'Cardio Equipment',
    benches: 'Benches',
    recovery: 'Recovery & Accessories'
  };
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  /* ---------- Currency ---------- */
  const RATES = { USD: 1, EUR: 0.92, GBP: 0.79, QAR: 3.64 };
  let currency = LS.get('ip-currency', 'USD');
  if (!RATES[currency]) currency = 'USD';

  function fmt(usd) {
    const value = (Number(usd) || 0) * RATES[currency];
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    } catch (e) {
      return currency + ' ' + value.toFixed(2);
    }
  }
  function applyPrices(root) {
    (root || document).querySelectorAll('[data-price]').forEach((el) => {
      el.textContent = fmt(el.getAttribute('data-price'));
    });
  }
  function setCurrency(code) {
    if (!RATES[code]) return;
    currency = code;
    LS.set('ip-currency', code);
    document.querySelectorAll('[data-currency]').forEach((s) => { s.value = code; });
    applyPrices();
    document.dispatchEvent(new CustomEvent('ip:currency', { detail: code }));
  }

  /* ---------- Stars ---------- */
  function stars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) html += '<i class="bi bi-star-fill" aria-hidden="true"></i>';
      else if (rating >= i - 0.5) html += '<i class="bi bi-star-half" aria-hidden="true"></i>';
      else html += '<i class="bi bi-star" aria-hidden="true"></i>';
    }
    return `<span class="stars" role="img" aria-label="Rated ${rating} out of 5">${html}</span>`;
  }

  /* ---------- Cart ---------- */
  const SEED_CART = [
    { id: 'titan-db', name: 'Titan Adjustable Dumbbell Set', spec: '5–50 lb pair', price: 499, img: byId('titan-db').img, qty: 1 },
    { id: 'fid-bench', name: 'Adjustable FID Bench', spec: '7 back angles', price: 349, img: byId('fid-bench').img, qty: 1 },
    { id: 'olympic-bar', name: 'Olympic Barbell 20 kg, Hard Chrome', spec: '28.5 mm shaft', price: 289, img: byId('olympic-bar').img, qty: 1 }
  ];
  function getCart() {
    let cart = LS.get('ip-cart', null);
    if (!Array.isArray(cart)) {
      cart = SEED_CART.map((i) => Object.assign({}, i));
      LS.set('ip-cart', cart);
    }
    return cart;
  }
  function saveCart(cart) {
    LS.set('ip-cart', cart);
    updateBadges(true);
    document.dispatchEvent(new CustomEvent('ip:cart', { detail: cart }));
  }
  function cartCount() { return getCart().reduce((n, i) => n + i.qty, 0); }
  function addToCart(item) {
    const cart = getCart();
    const qty = Math.max(1, parseInt(item.qty, 10) || 1);
    const existing = cart.find((i) => i.id === item.id && i.spec === item.spec);
    if (existing) existing.qty = Math.min(99, existing.qty + qty);
    else cart.push({ id: item.id, name: item.name, spec: item.spec || '', price: Number(item.price), img: item.img, qty });
    saveCart(cart);
    toast(`<strong>${escapeHtml(item.name)}</strong> added to your cart`, qty > 1 ? `Quantity ${qty}` : item.spec, true);
  }

  /* ---------- Totals ---------- */
  const PROMOS = { IRON10: { pct: 10, label: 'IRON10 · 10% off' }, STRONG15: { pct: 15, label: 'STRONG15 · 15% off' } };
  const FREE_SHIP_AT = 150;
  function totals(cart, method) {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const code = LS.get('ip-promo', null);
    const promo = code && PROMOS[code] ? Object.assign({ code }, PROMOS[code]) : null;
    const discount = promo ? Math.round(subtotal * promo.pct) / 100 : 0;
    const net = subtotal - discount;
    let shipping = 0;
    if (cart.length === 0) shipping = 0;
    else if (method === 'express') shipping = 39;
    else shipping = net >= FREE_SHIP_AT ? 0 : 29;
    const tax = Math.round(net * 0.08 * 100) / 100;
    return { subtotal, discount, promo, shipping, tax, total: net + shipping + tax, count: cart.reduce((n, i) => n + i.qty, 0) };
  }

  /* ---------- Wishlist ---------- */
  function getWish() { const w = LS.get('ip-wish', []); return Array.isArray(w) ? w : []; }
  function syncWishButtons() {
    const wish = getWish();
    document.querySelectorAll('[data-wish]').forEach((btn) => {
      const on = wish.includes(btn.getAttribute('data-wish'));
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      const icon = btn.querySelector('.bi');
      if (icon) { icon.classList.toggle('bi-heart-fill', on); icon.classList.toggle('bi-heart', !on); }
    });
  }
  function toggleWish(id, name) {
    const wish = getWish();
    const idx = wish.indexOf(id);
    if (idx >= 0) { wish.splice(idx, 1); toast(`Removed <strong>${escapeHtml(name)}</strong> from your wishlist`); }
    else { wish.push(id); toast(`Saved <strong>${escapeHtml(name)}</strong> to your wishlist`); }
    LS.set('ip-wish', wish);
    syncWishButtons();
    updateBadges(true);
  }

  /* ---------- Badges ---------- */
  function updateBadges(bump) {
    const c = cartCount();
    const w = getWish().length;
    document.querySelectorAll('[data-cart-count]').forEach((el) => setBadge(el, c, bump));
    document.querySelectorAll('[data-wish-count]').forEach((el) => setBadge(el, w, false));
  }
  function setBadge(el, n, bump) {
    const changed = el.textContent !== String(n);
    el.textContent = n;
    el.setAttribute('data-empty', n === 0 ? 'true' : 'false');
    if (bump && changed) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  }

  /* ---------- Toasts ---------- */
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function toast(html, sub, withCartLink) {
    let wrap = document.getElementById('ipToasts');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'ipToasts';
      wrap.className = 'toast-container position-fixed end-0 p-3';
      wrap.style.bottom = window.matchMedia('(max-width: 991.98px)').matches ? '76px' : '0';
      wrap.setAttribute('aria-live', 'polite');
      wrap.setAttribute('aria-atomic', 'true');
      document.body.appendChild(wrap);
    }
    const el = document.createElement('div');
    el.className = 'toast align-items-center';
    el.setAttribute('role', 'status');
    el.innerHTML = `
      <div class="d-flex align-items-center gap-3 p-3">
        <span class="why-icon" style="width:40px;height:40px;border-radius:10px;font-size:1.1rem"><i class="bi bi-check2"></i></span>
        <div class="flex-grow-1 small">
          <div>${html}</div>
          ${sub ? `<div class="text-muted">${escapeHtml(sub)}</div>` : ''}
          ${withCartLink ? '<a href="cart.html" class="fw-semibold text-accent">View cart</a>' : ''}
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>`;
    wrap.appendChild(el);
    if (window.bootstrap) {
      const t = new bootstrap.Toast(el, { delay: 3200 });
      el.addEventListener('hidden.bs.toast', () => el.remove());
      t.show();
    }
  }

  /* ---------- Product card markup (shop + related) ---------- */
  function productCard(p) {
    const badge = p.badge
      ? `<span class="tag ${p.badge.includes('%') ? 'tag-hot' : p.badge === 'New' ? 'tag-glass' : 'tag-accent'}">${escapeHtml(p.badge)}</span>`
      : '';
    return `
      <article class="p-card">
        <div class="p-media">
          <div class="p-badges">${badge}</div>
          <button class="p-wish" type="button" data-wish="${p.id}" data-name="${escapeHtml(p.name)}" aria-label="Save ${escapeHtml(p.name)} to wishlist" aria-pressed="false"><i class="bi bi-heart"></i></button>
          <a href="product-detail.html?id=${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" srcset="${srcset(p.img)}" sizes="(max-width: 575px) 50vw, (max-width: 1199px) 33vw, 25vw" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async" width="600" height="600"></a>
          <div class="p-overlay">
            <button class="btn btn-ip" type="button" data-add-to-cart="${p.id}"><i class="bi bi-bag-plus me-1"></i>Quick add</button>
            <a class="btn btn-ip-ghost" href="product-detail.html?id=${p.id}" aria-label="View ${escapeHtml(p.name)}"><i class="bi bi-eye"></i></a>
          </div>
        </div>
        <div class="p-body">
          <span class="p-brand">${escapeHtml(p.brand)} · ${CATEGORIES[p.category]}</span>
          <h3 class="p-title"><a href="product-detail.html?id=${p.id}">${escapeHtml(p.name)}</a></h3>
          <div class="rating-line">${stars(p.rating)} <span>${p.rating} (${p.reviews.toLocaleString('en-US')})</span></div>
          <span class="p-load"><i class="bi bi-speedometer2"></i>${escapeHtml(p.load)}</span>
          <div class="p-foot">
            <div><span class="p-price" data-price="${p.price}">${fmt(p.price)}</span>${p.oldPrice ? `<span class="p-old" data-price="${p.oldPrice}">${fmt(p.oldPrice)}</span>` : ''}</div>
            <button class="p-add" type="button" data-add-to-cart="${p.id}" aria-label="Add ${escapeHtml(p.name)} to cart"><i class="bi bi-plus-lg"></i></button>
          </div>
        </div>
      </article>`;
  }

  /* ---------- Image fallback ---------- */
  const PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="#e9edf2"/>' +
    '<g fill="#c4ccd7"><rect x="150" y="270" width="300" height="60" rx="10"/><rect x="110" y="210" width="50" height="180" rx="12"/>' +
    '<rect x="440" y="210" width="50" height="180" rx="12"/><rect x="70" y="240" width="40" height="120" rx="10"/><rect x="490" y="240" width="40" height="120" rx="10"/></g>' +
    '<rect x="270" y="285" width="60" height="30" rx="6" fill="#ccff00" opacity=".7"/></svg>'
  );
  function fallback(imgEl) {
    if (imgEl.dataset.fallback) return;
    imgEl.dataset.fallback = '1';
    imgEl.src = PLACEHOLDER;
  }
  window.addEventListener('error', (e) => {
    const t = e.target;
    if (t && t.tagName === 'IMG') fallback(t);
  }, true);

  /* ---------- Theme ---------- */
  function currentTheme() { return document.documentElement.getAttribute('data-bs-theme') || 'light'; }
  function syncThemeIcons() {
    const dark = currentTheme() === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      const i = btn.querySelector('.bi');
      if (i) i.className = 'bi ' + (dark ? 'bi-sun' : 'bi-moon-stars');
    });
  }

  /* ---------- Delegated events ---------- */
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add-to-cart]');
    if (add) {
      const p = byId(add.getAttribute('data-add-to-cart'));
      if (p) addToCart({ id: p.id, name: p.name, spec: p.spec, price: p.price, img: p.img, qty: 1 });
      return;
    }
    const wish = e.target.closest('[data-wish]');
    if (wish) {
      e.preventDefault();
      toggleWish(wish.getAttribute('data-wish'), wish.getAttribute('data-name') || 'Item');
      return;
    }
    const theme = e.target.closest('[data-theme-toggle]');
    if (theme) {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-bs-theme', next);
      try { localStorage.setItem('ip-theme-v2', next); } catch (err) { /* ignore */ }
      syncThemeIcons();
      return;
    }
    const scroller = e.target.closest('[data-scroll-target]');
    if (scroller) {
      const track = document.querySelector(scroller.getAttribute('data-scroll-target'));
      if (track) {
        const card = track.firstElementChild;
        const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth;
        track.scrollBy({ left: step * Number(scroller.getAttribute('data-dir') || 1), behavior: 'smooth' });
      }
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.matches('[data-currency]')) setCurrency(e.target.value);
  });

  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (form.matches('[data-search]')) {
      e.preventDefault();
      const q = (form.querySelector('input[type="search"]') || {}).value || '';
      window.location.href = 'products.html' + (q.trim() ? '?q=' + encodeURIComponent(q.trim()) : '');
    }
    if (form.matches('[data-newsletter]')) {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const msg = form.parentElement.querySelector('[data-newsletter-msg]');
      if (!input.checkValidity() || !input.value.trim()) {
        input.classList.add('is-invalid');
        if (msg) { msg.className = 'promo-msg err'; msg.textContent = 'Enter an email address like name@example.com.'; }
        input.focus();
        return;
      }
      input.classList.remove('is-invalid');
      if (msg) {
        msg.className = 'promo-msg ok';
        msg.innerHTML = `You're in. Use code <strong>IRON10</strong> at checkout. We've also sent it to ${escapeHtml(input.value.trim())}.`;
      }
      form.reset();
    }
  });

  /* ---------- Init ---------- */
  function init() {
    // Theme
    syncThemeIcons();
    // Currency selects
    document.querySelectorAll('[data-currency]').forEach((s) => { s.value = currency; });
    applyPrices();
    // Badges & wishlist
    getCart();
    updateBadges(false);
    syncWishButtons();
    // Images that already failed before this script ran
    document.querySelectorAll('img').forEach((im) => { if (im.complete && im.naturalWidth === 0 && im.src) fallback(im); });
    // Tooltips & popovers
    if (window.bootstrap) {
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el));
    }
    // Close mobile nav when a link is chosen
    document.querySelectorAll('#mainNav .nav-link:not(.dropdown-toggle), #mainNav .dropdown-item').forEach((a) => {
      a.addEventListener('click', () => {
        const nav = document.getElementById('mainNav');
        if (nav && nav.classList.contains('show') && window.bootstrap) bootstrap.Collapse.getOrCreateInstance(nav).hide();
      });
    });
    // Footer year
    document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
    // Re-sync wish buttons after dynamic renders
    document.addEventListener('ip:rendered', () => { syncWishButtons(); applyPrices(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* ---------- Public API ---------- */
  window.IP = {
    LS, img, PRODUCTS, CATEGORIES, byId, fmt, applyPrices, stars, getCart, saveCart, addToCart,
    totals, PROMOS, FREE_SHIP_AT, toast, productCard, escapeHtml, updateBadges,
    get currency() { return currency; }
  };
})();
