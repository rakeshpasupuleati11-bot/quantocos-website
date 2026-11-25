# QA summary — final state (Round 5)

Build: 69 static pages, file:// Chromium via Playwright 1.65, 1440x900 and 390x844.

## Static gate
`check_site.py` — 69 pages, 0 errors, 0 warnings (17 rules).

## Browser gate (138 combinations)
| Check | Result |
|---|---|
| Wheel scroll moves the page | 138/138 pass |
| Horizontal overflow | 0 |
| Motion hooks (motion.js, 3+ reveals, progress bar) | 138/138 pass |
| Inter-page links target=_blank + rel | 138/138 pass |
| Contrast (4.5:1 body / 3:1 large) | 128/138 pass — 10 fail on 5 pages |
| JS errors | 84/138 combinations log errors |

### JS errors — one cause
`Cannot set properties of undefined (setting 'translate')` — 9,431 occurrences across
84 combinations. Reproduced with `?motion=off` (53 occurrences), so it is not the
Round 4 motion layer: a pre-existing scroll-linked tween in `site.bundle.js` or
`site-2026.js` targets an element that does not exist on inner pages. Logs only; no
visual breakage observed. Fix needs a trace inside those two files.
Secondary: `Unexpected token 'else'` — 16 occurrences, an inline script parse error on
some pages, source not yet located. `Fetch API cannot load … services.json` — 118, only
under file:// (CORS); harmless once served over HTTP.

### Contrast — 5 pages still failing
compare.html (11 nodes), security.html (13), contracts.html (9), onboarding.html (5),
products.html (1). Zebra tables alternate light and dark rows, so no single header
colour passes both; needs a per-table token. All other pages, homepage included, are 0.

Guarded: a legacy handler called `getComputedStyle` on a detached node (2,832 throws);
`window.getComputedStyle` now falls back to `<html>`.

## Scroll
`scroll-report.md` — global `html{scroll-behavior:smooth}` plus the Lenis RAF loop were
the root cause; both removed in Round 4. Verified 0 -> 1500 -> 2700 px.
