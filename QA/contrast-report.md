# QA/contrast-report.md — Round 4, Step 4

Method: computed styles walked in-page; each text node's colour compared with the nearest
opaque background; gradients/images reported separately. Thresholds: 4.5:1 body, 3:1 large.

## Before

| Page | Width | Text nodes checked | Failing |
|---|---|---|---|
| index.html | 1440 | 368 | 7 |
| capabilities/creative.html | 1440 | 184 | 0 |

The 7 included a real defect introduced in Round 3: `.btn--onDark` used inside a light
card ("Get a free estimate") rendered near-white text on paper — ratio 1.08:1, invisible.

## Fixed at token level (`assets/css/components.css`)

- Band tokens: `--c-head-dark`, `--c-body-dark`, `--c-muted-dark` on `.band--deep`,
  `.band--gc3`, `.cta-band`, `.cads`, `.pods-hero`; `--c-head-light` (#0B1220),
  `--c-body-light` (#26313F), `--c-muted-light` on `.band--light`, `--light-2`,
  `--light-warm`, `--paper`, `--alt`. Applied to headings, body, lists, `.small`,
  `.lead`, `.card__body`, `.micro` — not per element.
- Any `.btn--onDark` inside `.card` now inherits the light-band text token.
- The estimate CTA switched from `btn--onDark` to the existing `btn--ghost`.
- Stage widget: headline `--c-head-dark`, body `--c-body-dark`, ring label `--c-head-dark`.
- Reveal animation ends at opacity 1 / transform none, so text never rests dim.

## After

| Page | Width | Checked | Failing (excluding `.sr-only`) |
|---|---|---|---|
| index.html | 1440 | 362 | 0 |
| index.html | 390 | 359 | 0 |
| capabilities/creative.html | 1440 / 390 | 184 / 181 | 0 / 0 |
| pricing.html | 1440 / 390 | 182 / 179 | 0 / 0 |

Remaining raw hits are `.sr-only` spans (clipped by design, 1.53:1) — excluded from the
count because they are not rendered text.
