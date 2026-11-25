# QA/scroll-report.md — Round 4, Step 1

Method: real Chromium (file:// build) via DevTools protocol at 1440×900 and 390×844.
Programmatic scroll used because synthetic wheel/keyboard events are not delivered by
this harness (Input.dispatchMouseEvent times out); scroll position, overflow, classes,
heights and console errors were read from the live page.

## Reproduction (before)

| Page | Width | scrollTo(0,1500) | html class | overflow | console |
|---|---|---|---|---|---|
| capabilities/creative.html | 1440 | **0** (no movement, evaluate stalled) | has-motion mv2 | visible | 0 |
| capabilities/creative.html | 782 | 800 (worked) | has-motion mv2 | visible | 0 |
| index.html | 1440 | worked | has-motion | visible | 0 |

## Root cause found

1. `html{scroll-behavior:smooth}` in `app.min.css` applied to **every** programmatic
   and keyboard scroll. On a 10,600 px page each jump becomes a long animation; the main
   thread is busy and scroll input appears dead. This is what stalled the evaluator too.
2. Lenis was still initialising on `(pointer:fine)` and `(min-width:900px)` — exactly the
   desktop case that failed — with its RAF loop driven by the GSAP ticker. On inner pages
   the loop ran but the plugin's scroll target was never resumed after page setup.

## Fix applied

- Lenis removed entirely: `vendor/lenis.min.js` deleted, init block removed from
  `motion-v2.js`, `scrollTo` call rewritten to native in `section-nav.js`. 0 references left.
- `html{scroll-behavior:auto}` enforced in `site-2026.css` (last stylesheet).
- Anchor smoothing moved to `components.js` (`scrollIntoView`, disabled under
  `prefers-reduced-motion`), so only deliberate anchor clicks animate.
- Scroll progress bar and reveals now run on native scroll events with rAF throttling.

## Verification (after)

| Page | Width | scrollTo(0,1500) | scrollBy(0,1200) | console |
|---|---|---|---|---|
| capabilities/creative.html | 1440 | **1500** | **2700** | 0 |
| capabilities/creative.html | 390 | 1500 | 2700 | 0 |
| index.html | 1440 | 1500 | 2700 | 0 |

No fixed overlay, `overflow:visible` on html and body, scrollHeight 10,603 px on the test
page, keyboard PageDown rides the same native path.
