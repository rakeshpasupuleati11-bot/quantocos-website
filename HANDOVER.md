# HANDOVER.md — Quantocos GC³ site, state at end of Round 12

Written 2026-11-20. Everything below is verified against the files in this folder.

## Run it

```bash
python build.py            # inject partials/nav.html, drawer.html, footer.html into all pages
python build.py --check    # exit 1 if any page drifted from the partials
python check_site.py       # 17-rule gate: 72 pages, 0 errors, 0 warnings
python check_site.py --audit   # also rewrites AUDIT.md
python qa_browser.py       # Playwright: needs `pip install playwright && python -m playwright install chromium`
```

Publish order: `build.py` → `check_site.py` → upload the root as static. `*.backup.html` are
development artefacts; exclude them (already blocked in `robots.txt`, `_headers`, `.htaccess`).

## Files that matter

| File | Role |
|---|---|
| `site-facts.json` | single source of truth: prices, credits, pilot terms, counts, geography, gate names, owner needs |
| `VOICE.md` | voice rules, four definitions, banned phrases, the two exemptions |
| `README-BUILD.md` | build + gate usage, placeholder reference |
| `AUDIT.md` | generated audit table |
| `MOTION-AUDIT.md` | script load order, CSS bloat inventory, dead assets |
| `QA/` | scroll report, contrast report, summary, `qa-results.json`, screenshots, home-scroll.webm |
| `partials/` | nav, drawer, footer — never edit these inside a page |
| `assets/css/components.css` | tokens, stage widget, cards, spacing system, per-page motion |
| `assets/css/motion.css` | scroll progress + reduced-motion states |
| `assets/js/motion.js` | the only motion layer (data-reveal, data-stagger, data-count, data-parallax, data-draw, data-tilt) |
| `assets/js/components.js` | stage tabs, count-up, link enhancer, page-class animation, reveal guards |

## Structure (homepage)

hero → #monday → #pods → #pods-hero → #services → #pricing → #calculator → #vs → #trust →
#creative-ads → #faq → CTA. 72 pages total, sitemap 71 URLs.

## Fixed in this cycle, worth not regressing

- Lenis removed; global `scroll-behavior:smooth` removed (it hijacked programmatic scroll)
- `section-nav.js` had a real syntax error — now `node --check` clean across all 12 JS files
- Hero H1 was being strangled by `mask-reveal` / `px-reveal`; legacy reveal disabled at source, plus CSS + JS guards
- Three pod pages moved to "Scoped per client"; every $8,000/month claim removed sitewide
- Images → WebP, 2,706 KB → 733 KB
- Terms wording unified: "No setup fee. No exit fee. Month to month, with written notice before the next billing date."

## Open, with the exact next step

1. **Contrast, 5 pages** (compare, security, contracts, onboarding, products): `thead th` computes
   rgb(17,30,49) on rgb(14,14,19). Four overrides including `!important` did not win — open DevTools
   → inspect that `th` → Matched Rules and neutralise the winning declaration.
2. **CSS purge**: 418 of 899 selectors in `app.min.css` match nothing (233 KB). Do it with a coverage
   report, not by hand.
3. **Bundle split**: `site.bundle.js` is 65 KB and loads before GSAP.
4. **Owner needs** (`site-facts.json → ownerNeeds`): names/photos/LinkedIn, portal capture,
   ungraded slider image, pilot-term sign-off, work-location wording, REMAU hour wording,
   confirmed product/service counts.
5. **Phase B conversion assets**: portal video, sample deliverable PDF, three pilot outcomes.
6. **Phase C**: hub pages per capability and industry, image sitemap, hreflang.

## Backups

Every edited page has `name.backup.html` beside it (72 of them), plus
`index.round3.backup.html` and the original `index.backup.html` from Round 1.
