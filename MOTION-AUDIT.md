# MOTION-AUDIT.md — scripts, styles and dead weight

Nothing in this file has been changed. It records what loads, in what order, what
is duplicated, and what no page uses, so the next phase can act on evidence.

## 1. Script load order (index.html, 16 files + 2 inline blocks)

| # | file | size | notes |
|---|---|---|---|
| inline | has-motion / no-motion class setter | small | runs before first paint — keep |
| 1 | `calculator.js` (defer) | 2.5 KB | sits inside the credit-planner section; now `defer` |
| 2 | `site.bundle.js` | 65.7 KB | largest file on the page; contains what looks like several concatenated modules |
| 3 | `topo-mesh.js` | 10.3 KB | canvas background |
| 4 | `hub.js` | — | builds the hero diagram from the `data-hub` JSON |
| 5 | `vendor/gsap.min.js` | — | animation core |
| 6 | `vendor/ScrollTrigger.min.js` | — | scroll triggers |
| 7 | `vendor/lenis.min.js` | — | smooth scroll |
| 8 | `motion-v2.js` | 8.0 KB | scroll-driven motion layer |
| 9 | `gates-timeline.js` | 3.3 KB | mounts `[data-gates]` |
| 10 | `pod-calculator.js` | 3.1 KB | credit planner maths |
| 11 | `page-extras.js` | 3.0 KB | page-level helpers |
| 12 | `ui-motion.js` | 1.0 KB | micro-interactions |
| 13 | `premium.js` | 5.1 KB | premium surfaces |
| 14 | `design-motion.js` (defer) | 1.7 KB | **the only defer among the motion layer** |
| 15 | `site-2026.js` | 10.5 KB | site-level behaviour |
| 16 | `creative-ads.js` | 0.4 KB | ad-card behaviour (slider block now hidden) |

Inline JSON-LD ×3 and a speculation-rules block sit in `<head>`.

### Findings
- **Four overlapping motion layers** — `motion-v2`, `ui-motion`, `premium`, `design-motion`
  — all run on the same DOM after GSAP/Lenis. Any one of them can fight another on
  transform and will-change. Worth consolidating before adding a fifth.
- **Mixed execution order:** `design-motion.js` is `defer`, while `premium.js` and
  `site-2026.js` are not. Parsing order therefore differs from execution order for
  exactly one file. Harmless today; a trap later.
- `site.bundle.js` (65.7 KB) loads second, before the vendor animation code that
  most of the page depends on. It is the first candidate for splitting.
- `creative-ads.js` is 390 bytes and now guards an absent slider — safe, but it is
  loaded on every page that has the ads band.
- `hub.js` reads a JSON attribute; a malformed `data-hub` string would fail silently
  at runtime (no build-time validation).

## 2. Stylesheets

| file | size | classes | no match in any HTML |
|---|---|---|---|
| `app.min.css` | 232.8 KB | 899 | 418 |
| `site-2026.css` | 12.2 KB | 59 | 23 |
| `hero-pods.css` | 12.1 KB | 31 | **31 (all)** |
| `section-additions.css` | 4.6 KB | 12 | 5 (`ph-btn`, `ph-ribbon*`, `pods-hero`, `qm-slides`) |
| `creative-ads.css` | 3.8 KB | 18 | 0 |

418 of 899 selectors in `app.min.css` match no class used on any of the 69 pages —
but a minified sheet also carries element/attribute selectors and states, so treat
this as a shortlist, not a deletion list.

## 3. Dead assets

- `assets/css/hero-pods.css` (12.1 KB) — **loaded by no page** since the pod widget
  was merged into "How a pod works". Files kept on disk as instructed.
- `assets/js/hero-pods.js` (8.8 KB) — no page references it; it self-guards on a
  missing `#pods-hero`, so it would not error if re-added partially.
- `.ba` before/after rules ship in `app.min.css` while the markup is commented out
  pending an ungraded capture. Restore the block when the image arrives.
- `assets/css/section-additions.css` still carries `.ph-*` and `.pods-hero` rules
  for the removed widget.
- `assets/img/og/` — 64 images generated to 1200×630 from the existing hero art so
  every page's `og:image` resolves. Re-generate after any hero art change.

## 4. What this phase did touch

One CSS rule only, in the newest stylesheet (`site-2026.css`):

```css
@media (max-width: 720px) { .hero__cta .btn--onDark { display: inline-flex; } }
```

No motion script, no GSAP/Lenis file, and no animation timing was modified.
