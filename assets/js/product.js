/* Sidio Crate — product page renderer. Reads ?handle= from SIDIO_CATALOG. */
(function () {
  "use strict";
  const S = window.SIDIO;
  if (!S) return;

  const params = new URLSearchParams(location.search);
  const handle = params.get("handle") || params.get("h");
  const p = handle && S.byH[handle];

  const root = document.getElementById("pdp");
  if (!p) {
    root.innerHTML = '<div class="pdp__missing"><h1>Product not found</h1><p>This item isn\u2019t in the demo catalog.</p><a class="btn btn--ghost-dark" href="index.html">Back to the shop</a></div>';
    return;
  }

  /* ---------- option state ---------- */
  const sold = !p.s.some((v) => v.a);
  const groups = (p.o || []).filter((g) => g.v && g.v.length > 1);
  let vi = sold ? 0 : S.firstAvail(p);
  let sel = p.s[vi].o.slice();

  /* preselect a color passed from a shop swatch: ?co=<optIdx>&color=<value> */
  const wantColor = params.get("color");
  if (wantColor) {
    let gi = params.has("co") ? +params.get("co") : -1;
    if (!(gi >= 0 && p.o[gi] && p.o[gi].v.indexOf(wantColor) >= 0)) {
      gi = (p.o || []).findIndex((g) => /color/i.test(g.n) && g.v.indexOf(wantColor) >= 0);
    }
    if (gi >= 0 && p.s.some((v) => v.a && v.o[gi] === wantColor)) {
      const base = sel.slice();
      let idx = p.s.findIndex((v) => v.a && v.o[gi] === wantColor && v.o.every((val, k) => k === gi || val === base[k]));
      if (idx < 0) { for (let i = 0; i < p.s.length; i++) { if (p.s[i].a && p.s[i].o[gi] === wantColor) { idx = i; break; } } }
      if (idx >= 0) { vi = idx; sel = p.s[vi].o.slice(); }
    }
  }

  const matchVariant = (s) => {
    for (let i = 0; i < p.s.length; i++) {
      if (p.s[i].a && p.s[i].o.length === s.length && p.s[i].o.every((v, k) => v === s[k])) return i;
    }
    return -1;
  };

  /* a value is selectable if at least one AVAILABLE variant carries it */
  const valueOK = (gi, val) => p.s.some((v) => v.a && v.o[gi] === val);

  /* ---------- addons ---------- */
  const POOLS = {
    full: ["premium-divider-full-crate-size", "new-polycarbonate-lid", "bamboo-lid-insert", "sidioskate-3-0"],
    quarter: ["quarter-sub-dividers", "new-polycarbonate-lid", "sidioskate-3-0", "dry-erase-labeling-plate-copy"],
    half: ["premium-dividers-half-crate-size", "heavy-duty-rubber-mat-half-size", "zipper-cube-half-size", "sidioskate-3-0"],
    lk: ["sidioskate-3-0", "sidioskate-3-0-base-only", "hard-half-cube", "soft-tech-pack"],
    tech: ["soft-tech-pack", "laptop-sleeve", "hard-half-cube", "clear-zipper-cube-full-size"],
    vehicle: ["tmat-anchors-for-sidio-storage-crates-4-pack", "tmat-adjustable-blockers-2-pack", "velcro-strap-10-pack-12-inch", "tmat-tight-fit-stout-stationary-blockers-2-pack"],
    acc: ["sidiocrate-accessories-set", "standard-dividers", "long-dividers", "dry-erase-labeling-plate"],
  };
  const isWr = /wr|weather/i.test(p.h);
  const low = (p.t + " " + p.h).toLowerCase();
  let pool;
  if (isWr) {
    const size = low.includes("quarter") ? "quarter" : low.includes("half") ? "half" : "full";
    pool = POOLS.wr_extra ? [] : ["laptop-sleeve", "soft-tech-pack"].concat(POOLS[size]);
  } else if (p.c === "lk") pool = POOLS.lk;
  else if (p.c === "tech") pool = POOLS.tech;
  else if (p.c === "vehicle") pool = POOLS.vehicle;
  else if (p.c === "crates") pool = POOLS[low.includes("quarter") ? "quarter" : low.includes("half") ? "half" : low.includes("collapsible") ? "full" : "full"];
  else pool = POOLS.acc;
  const addons = [...new Set(pool)].filter((h) => h !== p.h && S.byH[h] && S.byH[h].s.some((v) => v.a)).slice(0, 4);

  /* ---------- reviews ---------- */
  const REVIEWS = [
    ["rev-john.png", "John", "Exactly as described — no flex, no rattles, everything stays put even on rough roads."],
    ["rev-robert.jpg", "Robert", "Ordered a whole wall of these. The divider system is genuinely clever."],
    ["rev-david.png", "David", "Great colors and the dividers actually work. Very happy with the quality."],
    ["rev-clint.jpg", "Clint", "Perfectly overbuilt. This is what 'buy once' is supposed to feel like."],
  ];

  /* ---------- markup ---------- */
  const collectionLabel = { crates: "Crates", lk: "LK Series", vehicle: "Vehicle & Camping", tech: "Tech & Travel", acc: "Accessories" }[p.c] || "Shop";
  const imgs = p.imgs && p.imgs.length ? p.imgs : [];

  const gallery =
    '<div class="pdp__media">' +
    (imgs.length
      ? '<img class="pdp__main" id="pdp-main" src="' + S.img(p) + '" alt="' + p.t + '">' +
        (imgs.length > 1
          ? '<div class="pdp__thumbs">' + imgs.map((f, i) =>
              '<button class="pdp__thumb' + (i === 0 ? " is-active" : "") + '" type="button" data-src="' + "assets/img/" + f + '"><img src="assets/img/' + f + '" alt="" loading="lazy"></button>').join("") +
            "</div>"
          : "")
      : '<div class="pdp__main pdp__main--empty"></div>') +
    "</div>";

  const optGroups = groups.map((g, gi) =>
    '<div class="opt" data-g="' + gi + '"><div class="opt__head"><span>' + g.n + "</span><span class=\"opt__pick\" data-pick=\"" + gi + '"></span></div><div class="opt__row">' +
    g.v.map((v) => '<button class="chip" type="button" data-v="' + v + '" data-ok="' + valueOK(gi, v) + '">' + v + "</button>").join("") +
    "</div></div>"
  ).join("");

  const qtyBlock =
    '<div class="pdp__qty"><label>Qty</label><div class="cart__qty pdp__qtyctl"><button type="button" id="qty-dec">−</button><span id="qty-val">1</span><button type="button" id="qty-inc">+</button></div></div>' +
    '<p class="pdp__tiers">Buy 3+ <b>−10%</b> · 6+ <b>−15%</b> · 12+ <b>−20%</b></p>' +
    '<button class="btn btn--full" id="pdp-add" type="button">Add to Cart</button>';

  const buy =
    '<div class="pdp__buy"><div class="pdp__crumb"><a href="index.html">Shop</a> / <a href="index.html#' + p.c + '">' + collectionLabel + "</a> / <span>" + p.t + "</span></div>" +
    "<h1>" + p.t + '</h1><div class="pdp__rating"><span class="pdp__stars">★★★★★</span><span>4.7 · 1,075 reviews</span></div>' +
    '<div class="pdp__price" id="pdp-price"></div>' +
    optGroups +
    (sold ? '<div class="pdp__sold">This configuration is currently sold out.</div>' : qtyBlock) +
    '<ul class="pdp__trust"><li>Made in the USA</li><li>Ships in 1–2 business days</li><li>Holds 1,000+ lbs stacked</li></ul></div>';

  const addonSec = addons.length
    ? '<section class="pdp__addon"><div class="wrap"><h2>Complete your setup</h2><div class="pdp__addon-grid">' +
      addons.map((h) => {
        const a = S.byH[h];
        const sv = S.firstAvail(a);
        const src = a.imgs && a.imgs.length ? '<img src="' + "assets/img/" + a.imgs[0] + '" alt="" loading="lazy">' : "";
        return '<article class="addon"><div class="addon__media">' + src + "</div><div class=\"addon__body\"><h3>" + a.t +
          '</h3><div class="addon__foot"><span class="addon__price">' + S.fmt(S.minPrice(a)) + '</span><button class="p-card__cta" type="button" data-addon="' + h + '">ADD +</button></div></div></article>';
      }).join("") + "</div></div></section>"
    : "";

  const details =
    '<section class="pdp__specs"><div class="wrap"><h2>Details</h2><ul class="pdp__spec-list">' +
    ["Injection-molded from a single tool — no seams to crack.", "Open, stackable footprint with 41 customizable divider slots.", "BPA-free, food-safe, rated for 1,000+ lbs when stacked.", "Sized to interlock across the whole Sidio system."]
      .map((s) => "<li>" + s + "</li>").join("") + "</ul></div></section>";

  const reviews =
    '<section class="pdp__reviews"><div class="wrap"><h2>What owners say</h2><div class="reviews__grid">' +
    REVIEWS.map((r) => '<article class="review"><div class="review__top"><img src="' + "assets/img/" + r[0] + '" alt="" loading="lazy"><div><div class="review__stars">★★★★★</div><div class="review__name">' + r[1] + '</div></div></div><p class="review__text">“' + r[2] + '”</p></article>').join("") +
    "</div></div></section>";

  root.innerHTML =
    '<div class="pdp__top wrap">' + gallery + buy + "</div>" + addonSec + details + reviews;

  /* ---------- wire interactions ---------- */
  let qty = 1;
  const $ = (id) => document.getElementById(id);
  const priceEl = $("pdp-price"), addBtn = $("pdp-add");

  const priceOf = (i) => S.fmt(p.s[i].p);
  function paintPrice() {
    priceEl.textContent = priceOf(vi) + (p.s[vi].o.some((x, k) => k > 0 && x && !/No /.test(x)) ? "  · configured" : "");
    if (addBtn) addBtn.textContent = "Add to Cart — " + priceOf(vi);
  }
  function syncChips() {
    document.querySelectorAll(".opt").forEach((opt) => {
      const gi = +opt.dataset.g;
      opt.querySelectorAll(".chip").forEach((ch) => {
        const ok = ch.dataset.ok === "true";
        ch.classList.toggle("is-off", !ok);
        ch.classList.toggle("is-sel", sel[gi] === ch.dataset.v);
      });
      const pick = document.querySelector('[data-pick="' + gi + '"]');
      if (pick) pick.textContent = sel[gi];
    });
  }
  function repaint() { paintPrice(); syncChips(); }

  const main = $("pdp-main");
  const thumbs = document.querySelectorAll(".pdp__thumb");
  root.addEventListener("click", (e) => {
    const t = e.target.closest(".pdp__thumb");
    if (t) { if (main) main.src = t.dataset.src; thumbs.forEach((x) => x.classList.toggle("is-active", x === t)); return; }

    const chip = e.target.closest(".chip");
    if (chip && !chip.classList.contains("is-off")) {
      const gi = +chip.closest(".opt").dataset.g;
      const trySel = sel.slice();
      trySel[gi] = chip.dataset.v;
      const idx = matchVariant(trySel);
      if (idx >= 0) { sel = trySel; vi = idx; repaint(); }
      return;
    }

    const a = e.target.closest("[data-addon]");
    if (a) { const h = a.dataset.addon; S.add(h, S.firstAvail(S.byH[h]), 1); return; }
  });

  if (!sold) {
    $("qty-dec").addEventListener("click", () => { qty = Math.max(1, qty - 1); $("qty-val").textContent = qty; });
    $("qty-inc").addEventListener("click", () => { qty = Math.min(99, qty + 1); $("qty-val").textContent = qty; });
    addBtn.addEventListener("click", () => { S.add(p.h, vi, qty); });
  }

  repaint();
})();