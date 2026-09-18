/* Sidio Crate — homepage: catalog-driven shop grid + micro-interactions */
(function () {
  "use strict";

  const S = window.SIDIO;
  const IMG = "assets/img/";
  if (!S || !S.CAT.length) return;

  /* ---------- helpers ---------- */
  const fmt = S.fmt;
  const PDP = (h) => "product.html?handle=" + encodeURIComponent(h);

  const tagOf = (p) => {
    const s = (p.t + " " + p.h).toLowerCase();
    if (/mystery/.test(s)) return "STOCK UP";
    if (/pre-order|pre order/.test(s)) return "PRE-ORDER";
    if (/wr|weather/.test(s)) return "WEATHER PROOF";
    if (p.c === "lk") return "NEW";
    if (/(4-pack|6-pack|3-pack|kit|bundle|starter|pro pack|basic pack|accessories set)/.test(s)) return "BUNDLE";
    return "";
  };

  /* a "color" option = name contains color, or is the multi-value first option on a raw product */
  const colorGroup = (p) => {
    for (let i = 0; i < (p.o || []).length; i++) if (/color/i.test(p.o[i].n) && p.o[i].v.length > 1) return i;
    return -1;
  };
  const hasChoices = (p) => (p.o || []).some((g) => g.v && g.v.length > 1);
  const anyAvail = (p) => p.s.some((v) => v.a);
  /* lowest price among AVAILABLE variants (falls back to all if none) */
  const availMin = (p) => {
    let m = Infinity;
    p.s.forEach((v) => { if (v.a && v.p < m) m = v.p; });
    if (m === Infinity) return S.minPrice(p);
    return m;
  };

  const SW = {
    ORANGE: "#f2751a", RED: "#c8102e", GREEN: "#2f8f4e", "OPTIC GREEN": "#7cff2b",
    SLIME: "#a3e635", "ARMY GREEN": "#4b5d34", TAN: "#c3a06a", BROWN: "#7a5230",
    "DESERT TAN": "#c9b48a", CLEAR: "rgba(210,225,230,.5)", SMOKE: "rgba(120,130,135,.65)",
    "BLACK/SMOKE": "linear-gradient(135deg,#101215 0 55%,rgba(150,160,165,.7))",
    "BLACK/SOLID": "#141619", BLACK: "#16181b", STEALTH: "#0b0e11", GRAY: "#6b7075",
    "NAVY GRAY": "#2c3a4a", "NAVY BLUE": "#1b2a52", NAVY: "#1b2a52",
    SIDIOBLUE: "#17609e", "SIDIO BLUE": "#17609e", NAUTICAL: "#123a6b",
    AIRCRAFT: "#9aa4ad", SOL: "#d9c58c", WHITE: "#eceae3", SILVER: "#b9bcc0",
    PINK: "#e85d9c", "SIDIO VARIETY": "conic-gradient(from 210deg,#f2751a,#c8102e,#2f8f4e,#17609e,#c3a06a,#f2751a)",
    "STEALTH VARIETY": "conic-gradient(from 210deg,#0b0e11,#2f8f4e,#c3a06a,#141619,#6b7075,#0b0e11)",
    "RACING PACK": "linear-gradient(135deg,#c8102e 0 50%,#141619 50%)",
    UTILITY: "linear-gradient(135deg,#c9b48a 0 50%,#6b7075 50%)",
    CAMO: "conic-gradient(from 140deg,#3a4a2a,#6b5a34,#2f8f4e,#4b5d34,#7a6a3a,#3a4a2a)",
  };
  const swFill = (name) => {
    const k = name.trim().toUpperCase();
    if (SW[k]) return SW[k];
    if (/VARIETY/.test(k)) return "conic-gradient(from 210deg,#f2751a,#c8102e,#2f8f4e,#17609e,#c3a06a,#f2751a)";
    if (/CAMO/.test(k)) return SW.CAMO;
    if (/CLEAR/.test(k)) return SW.CLEAR;
    if (/SMOKE/.test(k)) return SW.SMOKE;
    if (/WHITE/.test(k)) return SW.WHITE;
    if (/SILVER/.test(k)) return SW.SILVER;
    if (/STEALTH/.test(k)) return SW.STEALTH;
    if (/BLACK/.test(k)) return "#16181b";
    if (/BLUE/.test(k)) return SW.SIDIOBLUE;
    if (/NAVY/.test(k)) return SW["NAVY GRAY"];
    if (/TAN|BROWN|DESERT|UTILITY/.test(k)) return SW.TAN;
    if (/SLIME/.test(k)) return SW.SLIME;
    if (/OPTIC/.test(k)) return SW["OPTIC GREEN"];
    if (/ARMY|GREEN/.test(k)) return SW.GREEN;
    if (/GRAY|GREY|AIRCRAFT/.test(k)) return SW.GRAY;
    if (/ORANGE/.test(k)) return SW.ORANGE;
    if (/RED/.test(k)) return SW.RED;
    if (/PINK/.test(k)) return SW.PINK;
    return "#6b7075";
  };
  const light = (name) => {
    const k = name.trim().toUpperCase();
    return k === "CLEAR" || k === "SMOKE" || k === "WHITE" || k === "SILVER" || k === "SOL";
  };

  /* is a value purchasable? at least one available variant carries it */
  const valOK = (p, gi, val) => p.s.some((v) => v.a && v.o[gi] === val);

  /* ---------- render shop ---------- */
  const grid = document.getElementById("grid");

  function card(p) {
    const gi = colorGroup(p);
    const choices = hasChoices(p);

    let swatchHTML = "";
    if (gi >= 0) {
      const vals = p.o[gi].v.filter((v) => valOK(p, gi, v)).slice(0, 14);
      const extra = p.o[gi].v.filter((v) => valOK(p, gi, v)).length - vals.length;
      swatchHTML =
        '<div class="p-card__colors" data-co="' + gi + '">' +
        vals
          .map((v) => '<button class="sw" type="button" data-color="' + v + '" title="' + v + '" aria-label="' + v + '" style="--sw:' + swFill(v) + '"' + (light(v) ? ' data-light="1"' : "") + "></button>")
          .join("") +
        (extra > 0 ? '<span class="p-card__more">+' + extra + "</span>" : "") +
        "</div>";
    }

    const tag = tagOf(p);
    const min = availMin(p);
    const distinct = new Set(p.s.filter((v) => v.a).map((v) => v.p)).size > 1;
    const price = (distinct ? "from " : "") + fmt(min);
    const noImg = !p.imgs.length;
    const sold = !anyAvail(p);

    let cta;
    if (sold) {
      cta = '<span class="p-card__cta p-card__cta--sold">SOLD OUT</span>';
    } else if (!choices) {
      cta = '<button class="p-card__cta" type="button" data-add data-h="' + p.h + '" data-s="' + S.firstAvail(p) + '">ADD +</button>';
    } else {
      cta = '<a class="p-card__cta p-card__cta--view" href="' + PDP(p.h) + '">SELECT SETUP →</a>';
    }

    return (
      '<article class="p-card' + (choices ? " has-colors" : "") + (sold ? " is-sold" : "") + '" data-h="' + p.h + '">' +
      '<a class="p-card__media" href="' + PDP(p.h) + '" tabindex="-1">' +
      (noImg ? "" : '<img src="' + IMG + p.imgs[0] + '" alt="' + p.t + '" loading="lazy">') +
      (sold ? '<span class="p-card__tag p-card__tag--sold">SOLD OUT</span>' : tag ? '<span class="p-card__tag' + (tag === "NEW" || tag === "PRE-ORDER" ? " p-card__tag--new" : "") + '">' + tag + "</span>" : "") +
      "</a>" +
      '<div class="p-card__body">' +
      '<h3><a href="' + PDP(p.h) + '">' + p.t + "</a></h3>" +
      swatchHTML +
      '<div class="p-card__foot"><span class="p-card__price">' + price + "</span>" + cta + "</div>" +
      "</div></article>"
    );
  }

  function render(filter) {
    let items = S.CAT;
    if (filter !== "all") items = S.CAT.filter((p) => p.c === filter);
    else items = S.CAT.slice(0, 24);
    grid.innerHTML = items.map(card).join("");
  }

  const tabs = document.getElementById("tabs");
  if (tabs) {
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab");
      if (!btn) return;
      tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
      btn.classList.add("is-active");
      render(btn.dataset.tab);
    });
    document.querySelectorAll("[data-filter]").forEach((el) => {
      el.addEventListener("click", () => {
        const f = el.dataset.filter;
        tabs.querySelectorAll(".tab").forEach((t) => t.classList.toggle("is-active", t.dataset.tab === f));
        render(f);
      });
    });
    render("all");
  }

  /* one delegated handler for the whole grid */
  if (grid) {
    grid.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      if (add) {
        e.preventDefault();
        S.add(add.dataset.h, +add.dataset.s, 1);
        return;
      }
      const sw = e.target.closest(".sw");
      if (sw) {
        e.preventDefault();
        const cardEl = sw.closest(".p-card");
        const co = sw.closest(".p-card__colors").dataset.co;
        location.href = PDP(cardEl.dataset.h) + "&co=" + co + "&color=" + encodeURIComponent(sw.dataset.color);
        return;
      }
      if (e.target.closest("a")) return; /* real links navigate themselves */
      const c = e.target.closest(".p-card");
      if (c) location.href = PDP(c.dataset.h);
    });
  }

  /* ---------- reviews ---------- */
  const REVIEWS = [
    ["rev-john.png", "John", "We travel monthly. This carries bulk cosmetics far better than the cheap plastic containers — no flex, no dumping everything out mid-journey."],
    ["rev-julio.png", "Julio", "Seriously the best crates out there."],
    ["rev-robert.jpg", "Robert", "Adding nine more to my shelves. I'm addicted — it cleaned up and organized my whole space."],
    ["rev-david.png", "David", "Well made. Great colors and the customizable dividers actually work. Happy with the purchase."],
    ["rev-mark.png", "Mark", "Sturdy, solid, one of a kind."],
    ["rev-clint.jpg", "Clint", "Perfectly overbuilt. Bought a dozen so I'd have a reason to reorganize the garage."],
    ["rev-dylan.png", "Dylan S.", "Amazing color and quality — they look right at home in my room."],
    ["rev-austin.png", "Austin T.", "Perfect for holding my art supplies."],
    ["rev-noah.png", "Noah L.", "The latch system lets you open the whole lid from one side. Love it."],
  ];
  const rg = document.getElementById("reviews-grid");
  if (rg) {
    rg.innerHTML = REVIEWS.map(
      (r) =>
        '<article class="review"><div class="review__top"><img src="' + IMG + r[0] +
        '" alt="" loading="lazy"><div><div class="review__stars">★★★★★</div><div class="review__name">' +
        r[1] + '</div></div></div><p class="review__text">“' + r[2] + '”</p></article>'
    ).join("");
  }

  /* ---------- ticker ---------- */
  const tk = document.getElementById("ticker");
  if (tk) tk.innerHTML += tk.innerHTML;

  /* ---------- scroll progress + nav ---------- */
  const nav = document.getElementById("nav");
  const bar = document.getElementById("progress");
  if (bar && nav) {
    const onScroll = () => {
      const h = document.documentElement;
      bar.style.width = ((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100).toFixed(2) + "%";
      nav.classList.toggle("scrolled", h.scrollTop > 40);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- counters ---------- */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      if (!target) return;
      const t0 = performance.now();
      const dur = 1400;
      const step = (now) => {
        const k = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString("en-US") + suffix;
        if (k < 1) requestAnimationFrame(step);
      };
      el.textContent = "0";
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll(".stat__num[data-count]").forEach((el) => cio.observe(el));
})();