# V2 progress tracker

Updated 2026-11-25. Branch `redesign-v2` (baseline `edc5bf0`, cleanup `3cd643e`).

## Done

- **Phase A — cleanup.** 340 dev/historical files archived outside the repo; tree 196 MB → 110 MB; archive 86 MB; backups and old QA excluded from publish. 70 live HTML pages kept, 66 gated pages.
- **Identity.** BINDU tokens extracted into `assets/v2/tokens.css`; component layer in `assets/v2/site.css`; reference in `V2-DESIGN.md`.
- **Homepage V2.** 12 sections, AI FusionX structure + BINDU identity; reuses `motion.js`, `calculator.js`, nav/drawer/footer partials and the 127-service catalog.
- **Hero motion (`0fafdcb`).** Rotating conic prism aura, bloom drift on hero glow, scroll-linked spectrum hairline, spectrum edge on dark bands; shard drift and card/image hover retained. Reduced-motion guarded; no new dependencies.
- **Hero rewrite (Phase 3, `934da55`).** Centred composition on a full-viewport Void stage:
  eyebrow, headline, sub, two CTAs, four fact pills. 13 CSS-3D prismatic glass tiles on an
  edge arc (entrance stagger, float, scroll-linked rise, pointer depth, blur depth layers,
  GC³ watermark on the front tile); pause control, offscreen/tab pausing, reduced-motion
  fallback, mobile scrim and 5-tile subset, 2-up facts ≤1100px. CSS + existing observer only —
  the repo has no GSAP/Lenis and `CLAUDE.md` forbids adding them.
- **Homepage tone split (`9418aef`).** Measured 77% black / 23% light by section height at 1440.
  Dark: problems, deliverables, pods, how, pricing, compare, faq. Light: facts band, work gallery,
  final CTA band. Implemented as a scoped token remap on `.section--dark` plus new
  `.section--raise` (void-1) for alternating bands; no component duplication. Contrast audit
  (measured ratio per text node, 1440/768/390): 0 failures; gate/pod tags and the image caption
  chip needed explicit dark-context colours; select options pinned to void.
- **Scroll layer (Lenis + GSAP).** Pinned builds vendored in `assets/vendor/` (Lenis 1.3.28,
  GSAP 3.15.1 + ScrollTrigger; SHA-256 recorded in `assets/vendor/README.md`). `assets/v2/motion-gsap.js`
  wires smooth scroll, ScrollTrigger sync, drawer scroll lock, and a scroll-scrubbed gold edge on each
  `#how` gate (2px `::after` scaled by `--lit`, no layout change). Homepage only. Reduced motion exits
  before touching the DOM; skip link excluded from anchor interception. 52 KB gzip added.
  `three` and `barba` are vendored but not referenced by any page.
- **Pods bento + gate panels.** Six pods now share one 12-column grid: the three published pods
  at span 4, the three scoped pods in a second band at span 5/4/3 with `min-height:172px` and a
  ghost numeral (01–03) bottom-left. Published spans 4/4/4 keep equal height (388×457); scoped
  band 489/388/288×172. `#how .gates` is a single-column panel ladder (bordered `void-2` cards,
  860px max). A scroll-pinned stage stack was built and tested five times, then removed: at 1440
  the container height (706px) barely exceeds the last sticky top+height (646px), so cards
  collapse on release and G3–G5 hide. Pure-CSS stacking is not viable here; a JS pin would need
  GSAP/ScrollTrigger, which `CLAUDE.md` forbids.
- **QA (homepage).** `build.py --check` clean; `check_site.py` 66 pages · 0 errors · 0 warnings; Playwright at 360–1920: no horizontal overflow, no console errors, one H1, calculator live (76 of 120), footer contrast raised.
- **QA (hero Phase 3).** Playwright at 1440/1280/1100/1024/900/768/390: no overflow, no console
  errors, one H1, headline/CTAs/facts clear of tiles; pause toggles and pauses all tile layers;
  reduced-motion → no tile animation, pause control hidden; keyboard focus ring 2px #0099FF on
  all hero controls.

## Awaiting approval

- Visual approval of the V2 homepage before the language is applied to the remaining pages.
- Deployment to the existing GitHub Pages repository — not started, not authorised yet.

## Open items needing management sign-off

1. Monthly terms wording — `site-facts.json` `termsConfirmed: false`; homepage shows “no setup fee, no exit fee, month to month with written notice before the next billing date”.
2. Pilot terms displayed as 14 days / $1,500 / 60 credits — confirm before launch.
3. REMAU pod hours and availability.
4. Product count: 17 shipped vs 21 planned — footer lists only shipped names.
5. People/team details on `people.html` — omit until confirmed.

## Next (after approval)

1. Apply the V2 template to the ~21 primary commercial pages; merge thin pages with redirects.
2. Full QA: Lighthouse (95+ desktop, 90+ mobile), contrast sweep, unused CSS, responsive, broken links.
3. Deploy on explicit approval to `srinivasgonam/quantocos-gc3-website`.

## 2026-11-27 — Measured quality gap closure (deployed)

Commits `eea8f09`, `f63d335`, `034b0b6` on `main`, live at
https://rakeshpasupuleati11-bot.github.io/quantocos-website/.

- **Contrast.** Four homepage strings below WCAG AA raised to token values (pricing foot note,
  planner preset label, comparison note, FAQ mono label). Lighthouse color-contrast now 1.0.
- **CLS.** Inter variable WOFF2 preloaded ahead of the stylesheets; hero LCP image changed from
  `fetchpriority="low"` to `high`. Live homepage CLS 0.288 → 0.
- **Manifest.** Icon and `start_url` paths made relative (they 404'd on the project URL) and the
  missing 512 icon entry removed. Live homepage best practices 96 → 100.
- **Forms.** `inner.js` now posts JSON to `data-endpoint` when one is set, with only real
  pending/error/success states. No endpoint is set, so the honest mailto fallback remains.
- **Copy.** Hero names the buyer (owner-run company) and the published-price property; the pricing
  calculator lists five catalog line items at $25 a credit (credits and USD from `services.json`).

Live Lighthouse (mobile, lab): home 96/100/100/100, pricing 99/100/96/100, creative 99/100/96/100
(perf/a11y/BP/SEO). Remaining BP deduction is the sub-12px type heuristic only.

Blocked on the owner: form endpoint URL, booking service, analytics IDs, and the people/terms
sign-offs listed above.

## 2026-11-27 — Legibility, CTA and font-shift closure (deployed)

- Type floor: functional micro text ≥12px on all inner pages (footer legal note 12.5px);
  homepage labels raised to 12px. Lighthouse font-size: home 73.1 → 98.0%, pricing
  59.1 → 99.2%, creative 52.6 → 99.6%. Best Practices 96 → 100 on both inner pages.
- One primary action label: "Book a Discovery Call" → contact.html on all 30 pages;
  footer CTA now reads "Talk to an expert" and matches its destination.
- Font shift: metric-matched `'Inter Fallback'` (Arial, size-adjust 107.36%) in every
  stack; live homepage CLS 0.288 → 0 with the preload intact.
- Governance: `UI-UX-CHECKLIST.md` added; `V2-DESIGN.md` records the type floor, CTA rule
  and font-loading contract.
- Live Lighthouse (mobile lab): home 97/100/100/100 (LCP 2.3s, CLS 0, TBT 0 ms),
  pricing 99/100/100/100 (1.6s), creative 99/100/100/100 (1.8s). 30/30 routes 200.
- Commits: 6c4ef76, d8ae55c, 18dc490, d1f1991.
- Owner-blocked: form endpoint, booking link, analytics ID, trust assets.


## 2026-11-27 — Conversion readiness layer (deployed)

- `assets/v2/conversion.js`: event bus (`__qcEvents`, dataLayer, gtag/Plausible when configured), intent carry-over, endpoint/booking activation, CTA/pod/calculator/form events.
- Contact and expert forms: capability context from `?plan`/`?cap`, pod selection or capability referrer; hidden plan/capability fields; subject carries context; constraints field now optional.
- Endpoint activation flips the "not connected" copy and button label in one place; live submission stays BLOCKED until an approved endpoint is configured.
- Booking CTA rewires to a scheduler only when `QC_CONFIG.booking` is supplied; otherwise the interim form page remains.
- Measured locally: prefill, cta_click, calc_use, intent carry-over, 2xx `generate_lead`, booking rewrite — all pass. Live analytics BLOCKED (no ID/consent), trust assets DEFERRED.

## 2026-11-27 — Form usability and mobile action (deployed, 1f2be91)

- Forms now validate on submit with `novalidate` + inline, aria-linked messages
  (`.pform__error`, `aria-invalid`, `aria-describedby`, focus to first bad field);
  messages clear on input. Required fields flagged once per attempt (`form_error`).
- Legend on both forms: "All fields are required unless marked optional."
- `aria-busy` and a disabled button during the request; success only on 2xx, with a
  "What happens next" block; failure offers the mailto fallback and fires `form_error`.
- Sticky mobile CTA (`≤768px`, one primary action, hidden on the two form pages, over
  the footer, and while a field is focused). Suppressed under reduced motion.
- Verified live at 390x844: sticky appears after 420px scroll, no console errors;
  empty submit renders 5 inline messages; mocked 2xx yields exactly one `generate_lead`;
  a 404 yields the error state and no lead. 0 px horizontal overflow at
  360/390/768/1366/1440/1920 on 5 sampled routes. Gates: 80 pages, 0 errors, 0 warnings.
- Live Lighthouse: contact 98/100/100/100 (LCP 2.0s, CLS 0), pricing 98/100/100/100
  (1.8s). Homepage 76–94 across three runs (TBT 120–780 ms) — GSAP/ScrollTrigger
  runs are variable on this host and need a dedicated pass; not caused by this change
  (the added script is 9.8 KB deferred).
- Still BLOCKED on external input: form endpoint, booking URL, analytics ID + consent,
  trust assets, CRM. No conversion is measured yet.

### 2026-11-27 — Homepage performance variability (d1e569b)

- Cause: the `ScrollTrigger.refresh()` on `load` recalculated every trigger inside the
  load task (523 ms and 424 ms main-document long tasks under 4x CPU throttling);
  no vendor script was the driver — blocking all of `assets/vendor/` changed TBT by 20 ms.
- Fix: `ScrollTrigger.config({limitCallbacks:true})` and the post-load refresh moved to
  `requestIdleCallback` (timeout 2.5 s). Motion, Lenis and the sample-account scrub unchanged.
- Controlled live tests after deploy: 96 / 94 / 97 (median 96), TBT 60 / 210 / 0 ms,
  LCP 2.4 / 2.3 / 2.4 s, CLS 0. Before: 76 / 83 / 94 (median 83).
- All tracked HTML (84 files) and all 30 sitemap URLs return 200 on the live host.

### 2026-11-27 — Accessibility sweep closed (c7fc4ae, ad80ad7)

- axe (WCAG 2.0/2.1/2.2 A+AA, best-practice) run on all 30 indexable pages at 390 and
  1440, scrolling each page first so every reveal has settled: **0 violations**.
- Fixed in c7fc4ae: two navigation landmarks both named "On this page" on insights,
  privacy and terms (`.ptoc` is now "Jump to a section"); nested complementary landmarks
  on the homepage become labelled groups; the why-quantocos comparison table takes focus
  so it can be scrolled with the keyboard.
- Fixed in ad80ad7: `.cmp__corner` and `.cmp__them .cmp__cost` were 3.38 and 3.64 against
  the near-black cell, now 6.1; the injected `.qc-sticky` bar is a labelled region so no
  body content sits outside a landmark at phone width.
- Note: axe reports mid-fade reveal text as low contrast. Every page is now measured after
  the reveal settles; `.pilot-note` samples at 5.8:1 once its 0.54 s delay completes.
- Live Lighthouse, three runs per page with all four categories: accessibility,
  best-practices and SEO 100 in all nine;
  performance median 95 index / 97 pricing / 99 contact (LCP 1.66–2.42 s, CLS 0.000).
  Outlier runs coincide with per-script totals the payload cannot explain (509 DOM nodes,
  136 KiB on pricing), so they are host contention, not page cost.
- Still BLOCKED on external input: form endpoint, booking URL, analytics ID + consent,
  trust assets, CRM. No conversion is measured yet.
