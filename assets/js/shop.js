/* Sidio Crate — shared catalog lookup + cart (used by index + product pages) */
window.SIDIO = (function () {
  "use strict";
  const IMG = "assets/img/";
  const CAT = window.SIDIO_CATALOG || [];
  const byH = {};
  CAT.forEach(function (p) { byH[p.h] = p; });

  const fmt = (n) => "$" + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
  const tier = (q) => (q >= 12 ? 0.2 : q >= 6 ? 0.15 : q >= 3 ? 0.1 : 0);
  const firstAvail = (p) => { for (let i = 0; i < p.s.length; i++) if (p.s[i].a) return i; return 0; };
  const cdnImage = (url, width) => {
    if (!url || !/cdn\.shopify\.com/.test(url) || /[?&]width=/.test(url)) return url;
    return url + (url.includes("?") ? "&" : "?") + "width=" + width;
  };
  const img = (p, s, width) => {
    const v = s != null && p.s ? p.s[s] : null;
    if (v && v.i) return cdnImage(v.i, width || 600);
    return p.imgs && p.imgs.length ? IMG + p.imgs[0] : "";
  };
  const minPrice = (p) => { let m = Infinity; p.s.forEach((v) => { if (v.p < m) m = v.p; }); return m === Infinity ? 0 : m; };

  /* option values for a variant, cleaned for display */
  const optLabel = (p, s) => p.s[s].o.filter((x) => x && !/^(No |Title$|Single|Default|One Size|Standard Size)/.test(x)).join(" \u00B7 ");

  /* ---------- cart: {h,s,q} keyed by handle+variant ---------- */
  const KEY = "sidio-cart-v2";
  let items = [];
  try { items = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { items = []; }
  if (items.some((x) => !("h" in x))) items = []; /* migrate from old {i,q} shape */
  items = items.filter((x) => byH[x.h] && x.s != null && byH[x.h].s[x.s]);

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} };
  const unit = (h, s, q) => Math.round(byH[h].s[s].p * (1 - tier(q)) * 100) / 100;
  const lineTotal = (c) => Math.round(unit(c.h, c.s, c.q) * c.q * 100) / 100;

  function add(h, s, q) {
    if (!byH[h]) return;
    q = q || 1;
    const line = items.find((x) => x.h === h && x.s === s);
    if (line) line.q += q; else items.push({ h: h, s: s, q: q });
    save();
    render();
    bump();
    open();
  }

  /* ---------- drawer ---------- */
  const el = (id) => document.getElementById(id);
  const cartEl = el("cart"), overlay = el("cart-overlay"), body = el("cart-body"),
    badge = el("cart-badge"), totalEl = el("cart-total"), foot = el("cart-foot");

  function render() {
    if (!cartEl) return;
    const n = items.reduce((s, c) => s + c.q, 0);
    if (badge) { badge.textContent = n; badge.classList.toggle("is-empty", n === 0); }
    if (!items.length) {
      body.innerHTML = '<p class="cart__empty">Your cart is empty.<br>Add some crates to get started.</p>';
      foot.style.display = "none";
      return;
    }
    foot.style.display = "";
    body.innerHTML = items.map((c) => {
      const p = byH[c.h];
      const src = img(p, c.s, 200);
      const opts = optLabel(p, c.s);
      const r = tier(c.q);
      const each = unit(c.h, c.s, c.q);
      return (
        '<div class="cart__item">' + (src ? '<img src="' + src + '" alt="">' : "") +
        '<div class="cart__item-info"><strong>' + p.t + "</strong>" +
        (opts ? '<span class="cart__item-opts">' + opts + "</span>" : "") +
        '<span class="cart__item-price">' + fmt(each) + " each" + (r ? " <em>−" + Math.round(r * 100) + "% bundle</em>" : "") + "</span>" +
        '<div class="cart__qty"><button type="button" data-dec data-h="' + c.h + '" data-s="' + c.s + '" aria-label="Decrease">−</button><span>' +
        c.q + '</span><button type="button" data-inc data-h="' + c.h + '" data-s="' + c.s + '" aria-label="Increase">+</button></div></div>' +
        '<button class="cart__del" type="button" data-del data-h="' + c.h + '" data-s="' + c.s + '" aria-label="Remove">✕</button></div>'
      );
    }).join("");
    if (totalEl) totalEl.textContent = fmt(items.reduce((s, c) => s + lineTotal(c), 0));
  }

  function open() { if (!cartEl) return; cartEl.classList.add("is-open"); overlay.classList.add("is-open"); render(); }
  function close() { if (!cartEl) return; cartEl.classList.remove("is-open"); overlay.classList.remove("is-open"); }
  function bump() { if (!badge) return; badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump"); }

  if (cartEl) {
    el("cart-open").addEventListener("click", open);
    el("cart-close").addEventListener("click", close);
    overlay.addEventListener("click", close);
    addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

    body.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b || !b.dataset.h) return;
      const h = b.dataset.h, s = +b.dataset.s;
      if (b.dataset.del) items = items.filter((c) => !(c.h === h && c.s === s));
      else {
        const line = items.find((c) => c.h === h && c.s === s);
        if (!line) return;
        line.q += b.dataset.inc ? 1 : -1;
        if (line.q <= 0) items = items.filter((c) => c !== line);
      }
      save(); render();
    });

    const checkout = el("checkout");
    if (checkout) checkout.addEventListener("click", () => {
      items = []; save();
      body.innerHTML =
        '<div class="cart__done"><h4>Order placed. (Demo)</h4>' +
        "<p>This is a concept build — no payment is processed. Wire this drawer to Shopify or Stripe to go live.</p>" +
        '<button class="btn btn--ghost-dark" id="keep-shopping" type="button">Back to the shop</button></div>';
      foot.style.display = "none";
      badge.textContent = "0"; badge.classList.add("is-empty");
      el("keep-shopping").addEventListener("click", () => { close(); setTimeout(render, 450); });
    });
  }

  render();

  return {
    CAT: CAT, byH: byH, fmt: fmt, tier: tier, firstAvail: firstAvail,
    img: img, minPrice: minPrice, optLabel: optLabel, add: add,
    open: open, items: () => items,
  };
})();