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
