/* Sidio Crate — shop renderer + micro-interactions */
(function () {
  "use strict";

  const IMG = "assets/img/";

  /* name, price, image, category, tag, blurb */
  const PRODUCTS = [
    /* ---- CRATES ---- */
    ["Quarter Size SidioCrate", 20, "quarter-size-sidiocrate0001_a334687e-201c-49f3-b28c-177d5e9ed751.jpg", "crates", "START HERE", "The drawer unit. Perfect for small gear, tools and camera accessories."],
    ["Half Size SidioCrate", 28, "copy-of-half-size-sidiocrate-2-0-builder0109_3b37db19-b932-4898-91c2-19e29e52d599.jpg", "crates", "BEST SELLER", "The shelf standard — the size that started the system."],
    ["Full Size SidioCrate", 40, "copy-of-full-size-sidiocrate-2-0-builder0028_9f7892b6-5694-47bd-8fa1-6a5b0fb2bf43.jpg", "crates", "BEST SELLER", "The garage and truck workhorse. Stack it under anything."],
    ["Full Size Collapsible (No Window)", 49, "ce-full-size-collapsible-sidiocrateCollapsibleEC_Orange_NoLid_NoDividers.jpg", "crates", "NEW", "Folds flat when empty, overbuilt when full."],
    ["Full Size Collapsible (Window)", 59, "copy-of-collapsible-sidiocrate-builder0056.png", "crates", "NEW", "See-through side panel, same 1,000+ lb bones."],
    ["Quarter SIDIO WR (Weather Proof)", 75, "quarter-size-sidiocrate-wr-weather-resistant0009.jpg", "crates", "WEATHER PROOF", "Sealed quarter unit for rain, dust and river time."],
    ["Half SIDIO WR (Weather Proof)", 83, "half-size-sidiocrate-wr-water-resistant-pre-order0007_28a9e961-e287-4699-8fd2-06f1e0e671ec.jpg", "crates", "WEATHER PROOF", "Our most requested crate, now sealed against the elements."],
    ["Full SIDIO WR (Weather Proof)", 95, "copy-of-full-size-sidiocrate-wr0061_75092e4d-7e47-4202-9bff-8e4f853d73f4.jpg", "crates", "WEATHER PROOF", "Big sealed dry box — cameras, med kits, backcountry food."],
    ["Starter Pack 2.0", 169, "starter-packStarter_view1_0005_c582b1c1-b2a4-4fb4-9236-82d24e702924.jpg", "crates", "VALUE", "Crates, lids and dividers to build your first full setup."],
    ["Basic Pack 2.0", 140, "basic-pack-2-0Basic_view1_0001.jpg", "crates", "VALUE", "The entry point into the modular system."],
    ["PRO PACK 2.0", 229, "pro-packPro_view1_0001.jpg", "crates", "VALUE", "2 Full + 1 Half crate, 3 latching lids, dividers and mats."],
    ["Camp Kitchen Kit", 288, "camp-kitchen-kitPhotoroom_000_20250113_100431.jpg", "crates", "KIT", "A field kitchen that packs down into one footprint."],
    ["Weather Proof 3 Pack", 299, "weather-resistant-3-packD352597A-F728-4ABA-99F5-9CCCC8C71203.jpg", "crates", "WEATHER PROOF", "Three sealed WR crates — save by the set."],
    ["Cyber Pink Quarter Crate", 28.8, "cyber-pink-quarter-crateC70E7EAD-CD83-4C85-AC90-8C10A82E6ADF.jpg", "crates", "", "High-vis colorway in the quarter format."],
    ["Cyber Orange Quarter Crate", 28.8, "cyber-orange-quarter-crateF74C1484-F906-4814-8745-DEB2BDA79B7D.jpg", "crates", "", "Find it fast. Built to outlast what's inside it."],
    ["Cyber Green Quarter Crate", 28.8, "cyber-green-quarter-crate7DB6EC27-DDE1-4665-92B9-B330195D7BF8.jpg", "crates", "", "Trail-ready green in the quarter format."],
    ["Cyber Pink WR Quarter Crate", 59.4, "cyber-pink-wr-quarter-crate4F10161B-44A9-4D63-8681-7EBDEC1A9301.jpg", "crates", "WEATHER PROOF", "Sealed + loud. The gym bag that lives in your truck."],
    ["Cyber Orange WR Quarter Crate", 59.4, "cyber-orange-wr-quarter-crateB480E72D-24C9-4E06-8800-5AEC854A5BD9.jpg", "crates", "WEATHER PROOF", "Sealed shell in our loudest colorway."],
    ["Cyber Green WR Quarter Crate", 59.4, "cyber-green-wr-quarter-crateBBC3DFAF-5192-47AE-8769-E8C168C178BF.jpg", "crates", "WEATHER PROOF", "Sealed shell in trail-ready green."],
    ["Cyber Pink Half Crate", 36, "cyber-pink-half-crate698D9614-6BA2-4031-BF05-7C97A27F1F17.jpg", "crates", "", "The shelf standard in pink."],
    ["Cyber Orange Half Crate", 36, "cyber-orange-half-crate8575595C-C9B4-4F61-8533-BECEFC6CDC79.jpg", "crates", "", "The shelf standard, turned up."],
    ["Cyber Green Half Crate", 36, "cyber-green-half-crateD7EB5FA9-201C-42F0-BC46-B8F021C8EFC2.jpg", "crates", "", "The shelf standard, camp-bound."],
    ["Cyber WR Pink Half Crate", 71.4, "cyber-wr-pink-half-crate6168C210-BFBB-4DE1-826C-B8C74B8A92FA.jpg", "crates", "WEATHER PROOF", "Sealed half crate in pink."],
    ["Cyber WR Orange Half Crate", 71.4, "cyber-wr-orange-half-crateC968BE43-14AA-4959-B423-DB30C9314B9F.jpg", "crates", "WEATHER PROOF", "Sealed half crate in orange."],
    ["Cyber WR Green Half Crate", 71.4, "cyber-wr-green-half-crateB836D0FC-63AA-4EC3-87CD-472E035FB978.jpg", "crates", "WEATHER PROOF", "Sealed half crate in green."],
    ["Cyber 6-Pack — Orange", 322.2, "cyber-6-pack-orangeCFD7F0B8-8C0A-40CE-8824-702371D74F02.jpg", "crates", "BUNDLE", "Six crates to wall-out your garage or truck."],
    ["Cyber 6-Pack — Green", 322.2, "cyber-6-pack-green44DEBA50-467C-4541-824B-09E2F2D6CAFA.jpg", "crates", "BUNDLE", "Six crates, one mission, zero loose gear."],
    ["Cyber 6-Pack — Pink", 322.2, "cyber-6-pack-pinkA13BD0E2-F3E4-4C41-B995-4D1CFC6355F7.jpg", "crates", "BUNDLE", "Six crates in full volume pink."],
    ["Cyber WR 3-Pack (Pink)", 193.8, "cyber-wr-3-pack-pinkB806E082-B425-4D87-82A0-D8571223E7A8.jpg", "crates", "BUNDLE", "Three sealed crates, one loud setup."],
    ["Cyber WR 3-Pack (Green)", 193.8, "cyber-wr-3-pack-green0AF57656-EF63-4F97-958D-940134CE6492.jpg", "crates", "BUNDLE", "Three sealed crates for the whole crew."],
    ["Cyber WR 3-Pack (Orange)", 193.8, "cyber-wr-3-pack-orange58FEE35A-F094-4642-A4C1-F3CE5505B2D9.jpg", "crates", "BUNDLE", "Three sealed crates in high-vis orange."],
    ["Cyber WR 3-Pack", 213, "cyber-wr-3-packF8C0F38A-CD73-4E20-B2B4-4B64B710EAB4.jpg", "crates", "BUNDLE", "The mixed colorway sealed trio."],

    /* ---- LK SERIES ---- */
    ["LK 612.8", 49, "lk-612-8LK_612.8_Black_Solid_Lid_1_Standard_Divider_SKU612.8-BLK.jpg", "lk", "NEW", "Mid-size flat file — paper, binders, parts, plates."],
    ["LK 912.12", 69, "lk-912-12Dimensions_square_912.12.png", "lk", "NEW", "The tall format. Storage that reads like a bookshelf."],
    ["LK 1812.6", 99, "lk-1812-6Dimensions_square_1812.6.png", "lk", "NEW", "Compact locker crate with latching lid."],
    ["LK 1812.8", 119, "lk-1812-8Dimensions_square_1812.8.png", "lk", "NEW", "The office-to-garage crossover."],
    ["LK 1812.12", 149, "lk-1812-12Dimensions_square_1812.12.png", "lk", "PRE-ORDER", "The flagship LK. Full-height, lockable, overbuilt."],
    ["LK Bundle — 3× 612.8", 110, "lk-bundle-3-x-612-8Bundle_3x612.8_Black_SmokedLid_SKUBundle_3x612.8-BLK.jpg", "lk", "BUNDLE", "Three flat files, one desk's worth of order."],
    ["LK Bundle — 2× 912.12", 112, "lk-bundle-2-x912-12Bundle_2x912.12_Black_SmokedLid_SKUBundle_2x912.12-BLK.jpg", "lk", "BUNDLE", "Two tall crates — the starter shelf."],
    ["LK Bundle — 1812.6 + 1812.8", 177, "lk-bundle-1812-6-x-1812-8Bundle_1812.6_1812.8_Black_SmokedLid_SKUBundle_1812.6_1812.8-BLK.jpg", "lk", "BUNDLE", "Pair the two most-used LK sizes."],
    ["LK Bundle — 1812.6 + 3× 612.8", 192, "lk-bundle-1812-6-x-612-8Bundle_1812.6_3x612.8_Black_Smoked_Lid_SKUBundle_1812.6_3x612.8-BLK.jpg", "lk", "BUNDLE", "A quarter wall of lockable storage."],
    ["LK Bundle — 2× 1812.12 + 912.12", 230, "lk-bundle-1812-12-x-2-912-12Bundle_1812.12_2x912.12_Black_SolidLid_SKUBundle_1812.12_2x912.12-BLK.jpg", "lk", "BUNDLE", "The full command-center configuration."],

    /* ---- VEHICLE & CAMPING ---- */
    ["T-MAT Compact Slide-Out Mat", 279.99, "tmat-compact-truck-bed-organizer-slide-out-mat-universal-fitMidsize_Truck_-_Tmat_3df16435-d9a3-4936-87a5-3f838461bb69.png", "vehicle", "", "Universal slide-out bed organizer — roll it out from the tailgate."],
    ["T-MAT Midsize Slide-Out Mat (5' beds)", 299.99, "tmat-midsize-truck-bed-organizer-slide-out-mat-universal-fit-for-5-beds-tacoma-ranger-colorado-moreMidsize_Truck_-_Tmat.png", "vehicle", "", "Drop-in for Tacoma, Ranger, Colorado and friends."],
    ["T-MAT Slide-Out Mat — Short 5'–5'5\"", 319.99, "tmat-truck-bed-organizer-slide-out-mat-universal-fit-for-short-beds-5-to-55Standard_Truck_Slide_Out_-_Tmat_8b53e27a-043d-4881-a779-5e26cdac6e05.png", "vehicle", "", "Machine-specific fit, zero re-thought."],
    ["T-MAT Slide-Out Mat — Short 5'6\"–5'9\"", 339.99, "tmat-truck-bed-organizer-slide-out-mat-universal-fit-for-short-beds-56-to-59Standard_Truck_Slide_Out_-_Tmat_8b1acbf4-b391-4437-bff6-2b8fb35694b4.png", "vehicle", "", "Slide-out organization tuned to your bed length."],
    ["T-MAT Slide-Out Mat — Standard 6'–6'5\"", 359.99, "tmat-truck-bed-organizer-slide-out-mat-universal-fit-for-standard-beds-6-to-65Standard_Truck_Slide_Out_-_Tmat_9477c99c-97dd-4ca1-98f3-fad7db363f92.png", "vehicle", "", "Full-width drawer-like access to your whole bed."],
    ["T-MAT Slide-Out Mat — Standard 6'6\"–6'9\"", 379.99, "tmat-truck-bed-organizer-slide-out-mat-universal-fit-for-standard-beds-66-to-69Standard_Truck_Slide_Out_-_Tmat.png", "vehicle", "", "Big-bed organization that doesn't rattle."],
    ["T-MAT Slide-Out Mat — Long 8'–8'2\"", 399.99, "tmat-truck-bed-organizer-slide-out-mat-universal-fit-for-long-beds-8-to-82Standard_Truck_Slide_Out_-_Tmat_7ca2ef2a-1057-46c1-a429-b3b19c7efbbc.png", "vehicle", "", "The longest bed, organized end to end."],
    ["T-MAT Anchors for Crates (4-Pack)", 12.99, "tmat-anchors-for-sidio-storage-crates-4-packblack_sidio.png", "vehicle", "", "Lock your crates to the T-MAT — or to each other."],
    ["Adjustable Blockers (2-Pack)", 19.99, "tmat-adjustable-blockers-2-packAdjustable_Blocker.png", "vehicle", "", "Clip into the mat channel to pin any load in place."],
    ["Tight-Fit Stout Stationary Blockers (2-Pack)", 26.99, "tmat-tight-fit-stout-stationary-blockers-2-packBlack_-_Tight-Fit_Blocker.webp", "vehicle", "", "Fixed-position load stoppers for long-haul abuse."],
    ["5-Gallon Bucket Holder + Anchors", 79.99, "tmat-5-gallon-bucket-holder-with-tmat-anchorsIMG_0349.jpg", "vehicle", "", "Your shop bucket, now a truck citizen."],
    ["Ski Holders (2-Pack)", 79.99, "tmat-ski-holders-2-packSkiHolder-1_8507559b-e509-47a6-b508-1022f895483f.png", "vehicle", "", "Strap skis down without a roof rack."],
    ["Golf Cradle + T-MAT Anchors", 124.95, "golf-cradle-with-tmat-anchorstruck_bed_golf_holder.png", "vehicle", "", "Clubs arrive un-jangled. Bed stays un-scratched."],
    ["Heavy Duty Rubber Mat (Full 1812.12)", 8, "heavy-duty-rubber-matPhotoroom_001_20241017_115354.jpg", "vehicle", "", "Quiet, grippy floor for loose gear."],
    ["Heavy Duty Rubber Mat (Half 1812.8)", 8, "heavy-duty-rubber-mat-half-sizePhotoroom_000_20241017_115354.jpg", "vehicle", "", "The same liner, half format."],
    ["Heavy Duty Red Full Size Mat", 8, "red-full-matScreenshot2025-12-01001253.png", "vehicle", "", "Red-bed lining, industrial rubber."],
    ["Crate Base Mat", 35, "crate-base-matPhotoroom_000_20241017_115913.jpg", "vehicle", "", "Protects crate bottoms — and your truck's paint."],
    ["Dividable Stacking Cups", 10, "dividable-stacking-cupsPhotoroom_000_20241017_114556_5f984ac8-cab5-405a-90ed-9a21f3cd6701.jpg", "vehicle", "", "Stackable cups that break apart when you split crates."],
    ["Velcro Straps 10-Pack 12\"", 7, "velcro-strap-10-pack-12-inchPhotoroom_001_20241017_121021.jpg", "vehicle", "", "The glue of a quiet truck bed."],
    ["Velcro Straps 10-Pack 5\"", 6, "velcro-strap-10-pack-5-inchPhotoroom_000_20241017_121021.jpg", "vehicle", "", "Small ties for small loads."],

    /* ---- TECH & TRAVEL ---- */
    ["Tech Series Duffel", 130, "tactical-duffelIMG-1164.jpg", "tech", "NEW", "A duffel organized around crate logic."],
    ["Every Day Duffel Bag", 120, "duffel-bag1A98F8CC-50F8-45F3-BA67-DECFDF7F6575.jpg", "tech", "", "Weekender that packs into your setup, not against it."],
    ["Laptop Sleeve (WR Crates)", 38, "laptop-sleeveIMG-1168.jpg", "tech", "", "Cushioned sleeve that rides inside a sealed WR crate."],
    ["Hard Half Cube", 40, "hard-half-cubeIMG-1162.jpg", "tech", "", "Rigid half-size organizer for tech and tools."],
    ["Soft Tech Pack", 35, "soft-tech-packIMG-1163.jpg", "tech", "", "Pouch system for cables, drives and small electronics."],
    ["Clear Zipper Cube — Full Size", 16, "premium-dividers-copyPhotoroom_002_20241017_112451.jpg", "tech", "", "See-through travel cube sized for the full crate."],
    ["Zipper Cube — Half Size", 14, "zipper-cube-half-sizePhotoroom_005_20241017_112451_3153a3a2-abbd-49f0-a293-3b9c07a2db8f.jpg", "tech", "", "Clothing and cable organization, to spec."],
    ["SIDIOSKATE 3.0", 55, "sidioskate-3-0Photoroom_000_20241017_120745.jpg", "tech", "NEW", "Slide-out crate base that glides out from under stacked crates."],
    ["SIDIOSKATE 3.0 — Mounting Plate Only", 25, "sidioskate-3-0-base-onlyIMG-7356.jpg", "tech", "", "The anchor point for SKATE builds."],

    /* ---- ACCESSORIES ---- */
    ["Padded Divider System", 120, "padded-divider-systemPhotoroom_20260528_121557.jpg", "acc", "NEW", "Foam-lined walls that turn a crate into a camera case."],
    ["Padded Divider — Standard Only", 16, "padded-divider-system-copyIMG-1199.jpg", "acc", "", "Add the padded core to any crate."],
    ["Padded Divider — Sub Divider Only", 6, "padded-divider-system-standard-divider-only-copyIMG-1198.jpg", "acc", "", "Small-cell padding inside padded walls."],
    ["Premium Divider — Full Size", 10, "premium-divider-full-crate-size6EBB29D6-40B2-4833-B3EB-7E32F81FCAE8.jpg", "acc", "", "Reconfigurable inner walls, full format."],
    ["Premium Dividers — Half Size", 6, "premium-dividers-half-crate-size423A5F08-4B28-4409-A1E8-3EBD2971C090.jpg", "acc", "", "Half-format inner walls."],
    ["Premium Dividers — Quarter", 4, "untitled-nov11_10-3696CB2054-3A2E-401E-8106-4F0E5DE48FC5.jpg", "acc", "", "Quarter-format inner walls."],
    ["Standard Dividers", 7, "standard-dividersPhotoroom_000_20250729_141859.jpg", "acc", "", "The workhorse divider set."],
    ["Long Dividers", 10, "long-dividersIMG_8246.jpg", "acc", "", "Full-length walls for long loads."],
    ["Sub Divider", 6, "full-size-short-dividerPhotoroom_002_20250610_145246.jpg", "acc", "", "Split any cell again, in seconds."],
    ["Quarter Sub Dividers", 3.5, "quarter-sub-dividersPhotoroom_002_20250729_141739.jpg", "acc", "", "Tiny cells for tiny hardware."],
    ["PC Lid 2.0", 15, "new-polycarbonate-lidWhite_0002.jpg", "acc", "", "Clear latching lid — see it without opening it."],
    ["Bamboo Lid 2.0", 50, "bamboo-lid-insertIMG-1926.jpg", "acc", "", "Real wood surface that doubles as a bench, table or cutting board."],
    ["Weather Resistant Assembly", 55, "wr-assembly-crate-not-includedPhotoroom_002_20241019_151757.heic", "acc", "", "Upgrade any crate to sealed spec. (No heic — image omitted)"],
    ["Label Set — 3 Sleeved Black", 19, "label-set-1-of-each-color-per-set-copyIMG-1193.png", "acc", "", "Label system with replaceable sleeves."],
    ["Label Set — 1 of Each Color", 17, "label-set-1-of-each-color-per-set779A9F53-2AF4-49E0-A416-B6462F8BDA67.jpg", "acc", "", "Color-code the whole wall."],
    ["Dry Erase / Labeling Plate", 5, "dry-erase-labeling-plateE8859590-0AAC-4C8E-AA4E-ECCDAD9F77D2.jpg", "acc", "", "Write it, wipe it, re-spec it."],
    ["Dry Erase Plate — Quarter", 5, "dry-erase-labeling-plate-copySidio_10_25_POW0060_7087bfae-5902-4ee0-8bcd-bec2399f6df5.jpg", "acc", "", "Labeling plate, quarter format."],
    ["SidioCrate Accessories Set", 27, "sidiocrate-accessories-setACCESSORYKIT_1.950-638399.png", "acc", "", "The starter kit of dividers, mats and plates."],
    ["Quarter Crate 4-Pack", 186, "quarter-crate-4-packStand_0021.png", "acc", "BUNDLE", "Four quarter crates — the hardware wall."],
    ["Rack Pack Series", 179, "warehouse-collapsible-3-pack-mystery-copyx4_0001.jpg", "acc", "BUNDLE", "Collapsible units, four to a rack footprint."],
    ["Starter 4-Pack (Mystery)", 119, "wh-quarter-4-packIMG_5616.jpg", "acc", "STOCK UP", "Mystery quarter 4-pack — warehouse value."],
    ["Jumbo Pack (Mystery)", 219, "warehouse-sale-jumbo-mystery-packPhotoroom_003_20250210_144241.jpg", "acc", "STOCK UP", "Big pile of crate variety at wholesale pricing."],
    ["WR 3-Pack (Mystery)", 189, "wr-warehouse-mystery-3-packFullSizeRender_f76d3634-1315-4e21-adb3-cefa69be9125.heic", "acc", "STOCK UP", "Mystery sealed 3-pack. (No heic — image omitted)"],
    ["Collapsible 3-Pack (Mystery)", 118.8, "ware-house-collapsible-3-pack-mysteryIMG_5635.jpg", "acc", "STOCK UP", "Three collapsibles, one flat footprint."]
  ];

  const REVIEWS = [
    ["rev-john.png", "John", "We travel monthly. This carries bulk cosmetics far better than the cheap plastic containers — no flex, no dumping everything out mid-journey."],
    ["rev-julio.png", "Julio", "Seriously the best crates out there."],
    ["rev-robert.jpg", "Robert", "Adding nine more to my shelves. I'm addicted — it cleaned up and organized my whole space."],
    ["rev-david.png", "David", "Well made. Great colors and the customizable dividers actually work. Happy with the purchase."],
    ["rev-mark.png", "Mark", "Sturdy, solid, one of a kind."],
    ["rev-clint.jpg", "Clint", "Perfectly overbuilt. Bought a dozen so I'd have a reason to reorganize the garage."],
    ["rev-dylan.png", "Dylan S.", "Amazing color and quality — they look right at home in my room."],
    ["rev-austin.png", "Austin T.", "Perfect for holding my art supplies."],
    ["rev-noah.png", "Noah L.", "The latch system lets you open the whole lid from one side. Love it."]
  ];

  /* ---------- render shop ---------- */
  const grid = document.getElementById("grid");
  const fmt = (n) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));
  const tagClass = (t) => (t === "NEW" || t === "PRE-ORDER" ? "p-card__tag p-card__tag--new" : "p-card__tag");

  function render(filter) {
    let items = PRODUCTS;
    if (filter !== "all") items = PRODUCTS.filter((p) => p[3] === filter);
    else items = PRODUCTS.filter((_, i) => i < 28); /* 'All' shows the highlights */
    grid.innerHTML = items
      .map((p) => {
        const idx = PRODUCTS.indexOf(p);
        const noImg = p[2].endsWith(".heic");
        return (
          '<article class="p-card">' +
          '<div class="p-card__media">' +
          (noImg ? "" : '<img src="' + IMG + p[2] + '" alt="' + p[0] + '" loading="lazy">') +
          "</div>" +
          '<div class="p-card__body">' +
          (p[4] ? '<span class="' + tagClass(p[4]) + '">' + p[4] + "</span>" : "") +
          "<h3>" + p[0] + "</h3>" +
          '<p class="p-card__desc">' + p[5] + "</p>" +
          '<div class="p-card__foot"><span class="p-card__price">' + fmt(p[1]) + "</span>" +
          '<button class="p-card__cta" type="button" data-add="' + idx + '">ADD +</button></div></div></article>'
        );
      })
      .join("");
  }

  const tabs = document.getElementById("tabs");
  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    btn.classList.add("is-active");
    render(btn.dataset.tab);
  });
  render("all");

  /* rail links deep-link to matching tab */
  document.querySelectorAll("[data-filter]").forEach((el) => {
    el.addEventListener("click", () => {
      const f = el.dataset.filter;
      tabs.querySelectorAll(".tab").forEach((t) => t.classList.toggle("is-active", t.dataset.tab === f));
      render(f);
    });
  });

  /* ---------- render reviews ---------- */
  const rg = document.getElementById("reviews-grid");
  rg.innerHTML = REVIEWS.map(
    (r) =>
      '<article class="review"><div class="review__top"><img src="' + IMG + r[0] +
      '" alt="" loading="lazy"><div><div class="review__stars">★★★★★</div><div class="review__name">' +
      r[1] + '</div></div></div><p class="review__text">“' + r[2] + '”</p></article>'
  ).join("");

  /* ---------- ticker: duplicate track for seamless loop ---------- */
  const tk = document.getElementById("ticker");
  if (tk) tk.innerHTML += tk.innerHTML;

  /* ---------- scroll progress + nav state ---------- */
  const nav = document.getElementById("nav");
  const bar = document.getElementById("progress");
  const onScroll = () => {
    const h = document.documentElement;
    const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.width = (p * 100).toFixed(2) + "%";
    nav.classList.toggle("scrolled", h.scrollTop > 40);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- animated counters ---------- */
  const cio = new IntersectionObserver(
    (entries) => {
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
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(target * eased).toLocaleString("en-US") + suffix;
          if (k < 1) requestAnimationFrame(step);
        };
        el.textContent = "0";
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".stat__num[data-count]").forEach((el) => cio.observe(el));

  /* ---------- cart ---------- */
  const KEY = "sidio-cart-demo";
  let cartItems = [];
  try { cartItems = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cartItems = []; }
  cartItems = cartItems.filter((c) => PRODUCTS[c.i]);
  const saveCart = () => { try { localStorage.setItem(KEY, JSON.stringify(cartItems)); } catch (e) {} };

  const cartEl = document.getElementById("cart");
  const overlay = document.getElementById("cart-overlay");
  const body = document.getElementById("cart-body");
  const badge = document.getElementById("cart-badge");
  const totalEl = document.getElementById("cart-total");
  const foot = document.getElementById("cart-foot");
  const productAt = (i) => PRODUCTS[i];

  const paintCart = () => {
    const n = cartItems.reduce((s, c) => s + c.q, 0);
    badge.textContent = n;
    badge.classList.toggle("is-empty", n === 0);
    if (!cartItems.length) {
      body.innerHTML = '<p class="cart__empty">Your cart is empty.<br>Add some crates to get started.</p>';
      foot.style.display = "none";
      return;
    }
    foot.style.display = "";
    body.innerHTML = cartItems
      .map((c) => {
        const p = productAt(c.i);
        const img = p[2].endsWith(".heic") ? "" : '<img src="' + IMG + p[2] + '" alt="">';
        return (
          '<div class="cart__item">' + img +
          '<div class="cart__item-info"><strong>' + p[0] + "</strong>" +
          '<span class="cart__item-price">' + fmt(p[1]) + " each</span>" +
          '<div class="cart__qty"><button type="button" data-dec="' + c.i + '" aria-label="Decrease">−</button><span>' +
          c.q + '</span><button type="button" data-inc="' + c.i + '" aria-label="Increase">+</button></div></div>' +
          '<button class="cart__del" type="button" data-del="' + c.i + '" aria-label="Remove">✕</button></div>'
        );
      })
      .join("");
    totalEl.textContent = fmt(cartItems.reduce((s, c) => s + productAt(c.i)[1] * c.q, 0));
  };

  const openCart = () => { cartEl.classList.add("is-open"); overlay.classList.add("is-open"); paintCart(); };
  const closeCart = () => { cartEl.classList.remove("is-open"); overlay.classList.remove("is-open"); };
  document.getElementById("cart-open").addEventListener("click", openCart);
  document.getElementById("cart-close").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

  const addToCart = (i) => {
    const line = cartItems.find((c) => c.i === i);
    if (line) line.q++; else cartItems.push({ i: i, q: 1 });
    saveCart();
    badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
    openCart();
  };

  grid.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (b) addToCart(+b.dataset.add);
  });

  body.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.del) {
      cartItems = cartItems.filter((c) => c.i !== +b.dataset.del);
    } else {
      const i = +(b.dataset.inc || b.dataset.dec);
      const line = cartItems.find((c) => c.i === i);
      if (!line) return;
      line.q += b.dataset.inc ? 1 : -1;
      if (line.q <= 0) cartItems = cartItems.filter((c) => c !== line);
    }
    saveCart(); paintCart();
  });

  document.getElementById("checkout").addEventListener("click", () => {
    cartItems = [];
    saveCart();
    body.innerHTML =
      '<div class="cart__done"><h4>Order placed. (Demo)</h4>' +
      "<p>This is a concept build — no payment is processed. Wire this drawer to Shopify or Stripe to go live.</p>" +
      '<button class="btn btn--ghost-dark" id="keep-shopping" type="button">Back to the shop</button></div>';
    foot.style.display = "none";
    badge.textContent = "0";
    badge.classList.add("is-empty");
    document.getElementById("keep-shopping").addEventListener("click", () => {
      closeCart();
      setTimeout(paintCart, 450);
    });
  });

  paintCart();
})();
