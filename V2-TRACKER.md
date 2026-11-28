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

### 2026-11-27 — Conversion pass (directive 0070, dimensions 1–9)

- **Hero (D1).** Eyebrow now "Monthly communications team for US small businesses"; sub names the
  deliverables and the price ("From $3,000 a month"); new "who it's for" line (owner-run US
  companies, 10–200 people) and a pilot credit-back note. Primary CTA `contact.html?plan=pilot`
  ("Start the 14-day pilot — $1,500"), secondary "Book a Discovery Call". Fourth fact pill is now
  "14-day pilot for $1,500". Whole hero fits one screen at 1440×900 and 390×844.
- **Head/SEO (D8).** `index.html` title is `Monthly communications team for US SMBs | Quantocos`
  (51 chars, under the 60-char gate), with og/twitter titles identical and descriptions rewritten.
  `pricing.html` title, H1, lead and hero CTAs reframed around the three published plans;
  the old self-link to `pricing.html#calculator` is now `#calculator`, and the primary CTA goes
  to `contact.html?plan=pilot`.
- **JSON-LD (D8).** `index.html` graph now carries Organization, WebSite, WebPage, Service
  (three monthly offers + Pilot Sprint offer) and FAQPage mirroring the five visible homepage
  answers. Parses clean; gate 0 errors.
- **Pricing clarity (D3).** Cards say "Includes 120/240/360 credits a month"; one example month
  at published catalog rates (59.25 of 120 credits); a three-row terms block — unused credits
  (policy marked `[CONFIRM]`), what is not included, and scoped pods priced per client.
- **Problem/solution cards (D7).** All four storycards use Problem / Approach / Outcome, cite a
  published gate or number, cover four different scenarios, and link to their own solution page.
  Neither "fragmented" nor "disconnected" appears on the homepage.
- **Trust (D5).** New "Who does the work / Who you contract with" block: named manager, human
  specialists and AI agents, India shift overlapping the US business day; contracting entity
  Quantocos Global Systems LLP, identifier ACY-3556. No overlap hours or US presence invented.
- **Navigation (D6).** Nav reduced to Solutions (mega, 9 links), Pricing, How it works (mega, 9),
  Resources (mega, 7) plus the single header CTA. Drawer mirrors it and opens on the pilot CTA.
  GitHub Pages cannot serve a 301, so `contact.html` and `talk-to-an-expert.html` are not merged.
- **Contact (D4).** Form cut from five fields to three (name, work email, what you need and by
  when) plus consent; `?plan=pilot` still pre-fills the hidden `plan` field.
- **CSS.** `.who-fund` added to `section-trust.css` (two columns, one at ≤760px);
  `.pp-example` and `.pp-terms` added to `section-pricing.css`. Cache versions bumped on
  `site.css` (v6), `section-pricing.css` (v3) and `section-refine.css` (v3) across all pages.
- **Verification.** `build.py --check` clean; `check_site.py` 80 pages · 0 errors · 0 warnings.
  axe (WCAG 2.0/2.1/2.2 A+AA + best-practice) on all 30 indexable pages at 390 and 1440:
  **0 violations, 0 console errors, no horizontal overflow**.
- **Who it's for (D2).** New `#fit` band between the trust strip and the commercial story:
  "Is this for you?" with three fits (10–200 US employees, no in-house comms team; comms spread
  across whoever has time; want named team, published price, monthly credits) and two non-fits
  (daily on-site department; one large out-of-catalog project). `.who-fund__list` and the
  `.who-fund--fit` shell added to `section-trust.css` (gold dot for fits, muted dot for non-fits);
  `section-trust.css` now loads as `?v=2` on the homepage.
- **Still BLOCKED on external input:** booking URL (calendar embed), form endpoint, GA4/Plausible
  ID + consent banner copy, real proof assets/case studies, unused-credit policy, US presence
  facts, real India↔US overlap hours, and the contact merge that needs server-side 301s.

### 2026-11-27 — Live verification and launch decision (directive 0070 follow-up)

- Live commit `ffbbe51`. 30/30 routes return 200; every route has one canonical and one H1;
  sitemap serves 30 URLs; robots.txt references it; homepage JSON-LD graph parses as
  Organization, WebSite, WebPage, Service, FAQPage.
- `terms.html` meta/og/twitter description trimmed 156 → 142 characters to meet the 155 limit.
- Lighthouse mobile, live homepage: 98 performance / 100 accessibility / 100 best-practices /
  100 SEO; LCP 2.2 s, CLS 0, TBT 0 ms. Single run.
- axe on the live homepage and contact page at 1440 and 390: 0 violations, 0 console errors,
  no horizontal overflow.
- `build.py --check` clean; `check_site.py` 80 pages · 0 errors · 0 warnings.
- **Decision: conditional GO.** Publish now for organic and direct traffic. NO-GO for paid or
  campaign traffic until a form endpoint, GA4/Plausible with a consent banner, a booking URL and
  real proof assets exist — without them the funnel cannot capture a pilot request or be measured.

### 2026-11-27 — Consent shell and content checklist

- `assets/v2/conversion.js` gains a consent banner that appears only when an analytics
  destination is configured; it stores the choice, loads analytics only on "Allow", and the
  "denied" choice is honoured on later visits. No ID is configured, so nothing renders today.
  All 30 pages load `conversion.js?v=4`.
- `_planning/content-checklist.md` lists every proof, wiring, policy and hosting asset the
  business must supply, with its destination section. Internal only.
- Verified locally: banner absent with no config; with a test GA4 ID it renders at 390px,
  both buttons are 44px, focus ring present, axe reports 0 violations, "Allow" stores
  `qc_consent=granted` and loads gtag once, and it stays hidden on reload.
- `build.py --check` clean; `check_site.py` 80 pages · 0 errors · 0 warnings.

### 2026-11-28 — Homepage rebuilt as six sections

- `index.html` main content rebuilt from 17 sections to 6: hero, why-one-team, capability
  explorer, architecture and five gates, team builder and pricing, commitments and conversion.
  Chrome untouched; rebuilt from partials.
- New `assets/v2/section-home6.css` and `assets/v2/home6.js` (accessible tabs, pod matcher).
  Nine homepage-only section stylesheets and the unused prism-hero preload removed.
- Measured against the live baseline: main words 2,467 → 1,177 (−52%); desktop scroll
  18,365 → 5,627 px (−69%); mobile 24,596 → 9,108 px (−63%).
- Prices taken from `site-facts.json`: Creative $3,000/120, Digital $6,000/240, Strategy
  $9,000/360; Interactive, Automation and REMAU remain "scoped per client".
- Open blockers: no client logos, testimonials, case studies or team photographs to publish;
  "live in 14 days" not claimed because onboarding timing is not in `site-facts.json`.
- `build.py --check` clean; `check_site.py` 80 pages · 0 errors · 0 warnings.

### 2026-11-28 — P0/P1 typography-led homepage

- P0: `--ed-*` editorial scale added to `assets/v2/tokens.css`; accent aligned to `#C9A44C`.
- P1: homepage `<main>` rebuilt as six typographic sections (hero, problem, solution,
  capabilities as oversized links, experience, close). No cards, pricing tables, calculators,
  comparison tables or statistics on the homepage; `id="pricing"` moved onto the hero price link.
- New `assets/v2/ed-home.css`; `home6.js` deleted. Head now loads `tokens.css`, `site.css`,
  `section-home6.css`, `lenis.css`, `section-refine.css` (the file still supplies the explorer).
- Measured: main words 1,177 → 205; desktop scroll 5,627 → 5,614 px; mobile 9,108 → 4,428 px;
  zero horizontal overflow at 1920/1440/1024/768/430/390/360. Pilot terms and `$1,500` /
  `60 credits` retained on the page for the fact gate.
- `build.py --check` clean; `check_site.py` 80 pages · 0 errors · 0 warnings.

### 2026-11-28 — Brand art system across all 30 routes (deployed, 1272a03)

- Original gold-on-void SVG plates generated by `QA/make_hero_art.py` into `assets/v2/art/`:
  15 family plates plus `legal-privacy.svg` and a 1200×380 `deliverables.svg` strip.
- Every canonical route uses a brand plate in the hero (`phero__art--brand`); frame ratio set to
  800/640 with `object-fit:contain`, and document, contact and flipped-family layouts restored to
  the shared two-column hero in `assets/v2/section-inner-dark.css`.
- 14 bento media photos replaced by the shared deliverables strip; the last two `.psplit__art`
  photos replaced by the existing inline pod diagram.
- Motion: 260ms tab crossfade, 520ms media reveal on `data-reveal`, plate entrance 600ms; all
  disabled under `prefers-reduced-motion` (`assets/v2/section-inner.css`).
- Contact hero no longer claims a reply turnaround; stat now "1 working session, no obligation".
- Route audit at 1440×900 and 390×844: 30/30 routes, one H1, zero overflow, zero missing alt,
  zero broken images (index.html font CORS is a `file://` artefact only).
- `build.py --check` clean; `check_site.py` 80 pages · 0 errors · 0 warnings.
- Homepage tab captions lifted from opacity .6 to .85 for AA contrast (934a27f, deployed).
- Live Lighthouse (GitHub Pages): index, pricing and contact all 100 performance, 100
  accessibility (index 97 before the caption fix), 100 best practices, 100 SEO; LCP 1.1–1.6 s,
  CLS 0. Untested: automated axe run, screen-reader pass, Safari and Firefox.

### 2026-11-28 — Homepage six signature experiences

- One engine (`assets/v2/home-signature.js`) and one stylesheet
  (`assets/v2/home-signature.css`); GSAP + ScrollTrigger only, no new library.
  01 liquid-gold hero (masked word reveal, drifting gold/silk layers, CTA sheen);
  02 chaos→order chips assembling inside the gold pod frame on scroll;
  03 sticky capability deck with six overlapping panels, index strips, counter and
  anchor nav (replaces the old tabs; all pod copy, credits and links retained);
  04 MinIO-style architecture: need → pod modules → five gates → deliverables,
  activated in sequence on scroll; 05 expanding pricing panels with approved
  deliverable/credit rows; 06 masked proof plates revealing on entry.
- Essential content stays visible without JS: hero words hide only after an inline
  GSAP set; proof masks self-reveal after 3.2 s; diagrams are stroke/position
  animation, and are hidden below 768 px where the five-node flow carries the same
  information. Reduced motion exits the script, stops the liquid CSS animation and
  disables the accordion transition.
- QA (`QA/sig_check.py`, `QA/review/sig-*.png`): 6 armed words; deck active
  "Strategy 03" with counter 03; accordion `aria-expanded=true`, region 147.5 px;
  proof `clip-path` reaches `inset(0%)`; reduced motion `animationName=none` and
  zero split words; zero horizontal overflow at 1440 / 820 / 390; 6 cards on mobile.
- `build.py --check` clean; `check_site.py` 80 pages · 0 errors · 0 warnings.

- Deployed 229f795, 8d1b7f1 and 344a7b4. Live index.html and both signature assets are
  byte-identical to local (SHA-256); live Lighthouse 100 performance, 100 accessibility,
  100 best practices, 100 SEO; LCP 0.5 s, CLS 0, TBT 0 ms.

### 2026-11-28 — Inner-page motion presets (29 routes)

- One shared layer, `assets/v2/page-motion.css`, loaded after `section-inner-dark.css`
  on the 29 canonical inner routes (homepage keeps `home-signature.css`); no new JS,
  no second observer. Hidden states exist only under `html.reveal-armed`, which
  `motion.js` adds when it will also reveal, and reduced motion removes every clip,
  filter and transition.
- Family treatments replace the generic rise: creative plates open upward from a mat;
  digital sweeps in from the right edge; strategy wipes section headings left to right;
  interactive pulls copy into focus from blur; automation fills track steps upward;
  REMAU wipes architecture down from the top; solutions and industries reveal from
  the side; company, insights and resources use the editorial plate wipe; pricing
  lights the existing gold card rule and wipes each plate open in sequence; GC³
  energises diagram nodes and lines with the adjacent copy (gated by `:has()` support,
  visible without it).
- QA (`QA/page_motion_check.py`, local file://): every revealed target ends at
  `clip-path:none` / `filter:none` / opacity 1; GC³ nodes 0 → 1 as their copy enters;
  pricing animation `pm-plate-in` with the gold rule at opacity 1 and hover lift still
  working; reduced motion animation `none`, clip `none`; zero horizontal overflow at
  1440 / 820 / 390 on creative and pricing; no console errors beyond file:// font CORS.
- `build.py --check` clean; `check_site.py` 80 pages · 0 errors · 0 warnings.
- Blocker: this is a family-level system, not 30 bespoke pages. Per-page compositions
  from the reference library remain phased work; no booking/CRM endpoint, approved
  team photography, testimonials or client logos exist, and forms are still unwired.

### 2026-11-28 — P0 render pass: diagrams, chart data, mobile proof, hero gold

Commits `ce3eb44`, `0912010`, `0177fb1`, `3555518`, `ea4ff9f`; pushed to `main` and
verified byte-identical on the live site.

- `.pdiagram` was shrink-wrapped to its 300px intrinsic width inside `.psplit__art`
  (`place-items:center`), scaling 12px SVG text to ~5.6px. `width:100%` now fills the
  497px content box; dark-mode connectors are gold, node strokes and labels raised.
- `.dg-label` raised from 10 to 11.5 SVG units (10.2 effective screen pixels; every label
  still inside its viewBox, checked by bbox on all 30 routes).
- The "Monthly credit pool" chart on pricing, why-quantocos, solutions and gc3 had all
  labels at y=320 in a 300-high viewBox (clipped) and bars drawn past the axis. Its four
  invented values were replaced with published pools: Creative 120, Digital 240,
  Strategy 360 credits, drawn from the baseline; aria-label updated.
- Homepage proof section hid the second art plate below 768px. All three now sit in a
  snap-scrolling row at 78% width; no page overflow.
- Hero gold field, second wash and silk lines raised so the liquid reads as the single
  dominant form; headline side stays dark.
- Rendered audit re-run: 31 routes x 1440/390, 0 flagged viewports (overflow, clipped
  headings, hidden text, broken images, JS errors). `build.py --check` clean,
  `check_site.py` 80 pages 0 errors 0 warnings.
- Lighthouse live: homepage 99/100/100/100 (LCP 1.1s, CLS 0, TBT 100ms); pricing
  99/100/100/100 (LCP 1.3s, CLS 0, TBT 100ms). Performance fluctuates 99-100 per run.

Known gap: `.sig-chaos` and `.sig-arch` remain hidden below 768px. Both are
`aria-hidden="true"` decorative diagrams whose facts are carried by the adjacent text
lists at every width; a mobile-specific static drawing is not built.
Follow-up `ce2f022`: below 768px inner diagrams keep a 520px minimum and scroll inside
their bordered frame, holding labels at 10.7 effective pixels with no sideways page scroll.
