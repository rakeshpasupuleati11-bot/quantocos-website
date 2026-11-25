# V2 progress tracker

Updated 2026-11-25. Branch `redesign-v2` (baseline `edc5bf0`, cleanup `3cd643e`).

## Done

- **Phase A — cleanup.** 340 dev/historical files archived outside the repo; tree 196 MB → 110 MB; archive 86 MB; backups and old QA excluded from publish. 70 live HTML pages kept, 66 gated pages.
- **Identity.** BINDU tokens extracted into `assets/v2/tokens.css`; component layer in `assets/v2/site.css`; reference in `V2-DESIGN.md`.
- **Homepage V2.** 12 sections, AI FusionX structure + BINDU identity; reuses `motion.js`, `calculator.js`, nav/drawer/footer partials and the 127-service catalog.
- **QA (homepage).** `build.py --check` clean; `check_site.py` 66 pages · 0 errors · 0 warnings; Playwright at 360–1920: no horizontal overflow, no console errors, one H1, calculator live (76 of 120), footer contrast raised.

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
