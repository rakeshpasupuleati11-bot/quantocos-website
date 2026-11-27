# V2 design reference — BINDU PRISM × AI FusionX

One page, one source of truth for the V2 visual language. Tokens live in
`assets/v2/tokens.css`; components in `assets/v2/site.css`. Do not add a second palette.

## Identity (BINDU PRISM UI v4)

| Role | Token | Value |
|---|---|---|
| Ground | `--bindu-shunya` | `#FAF8F2` warm paper |
| Dark ground | `--bindu-void` | `#080B12` |
| Ink | `--bindu-ink` | `#080B12`; secondary `rgba(8,11,18,.64)` |
| Action | `--bindu-soma` | `#C9911A` gold; deep `#8B6410` for text on light |
| Spectrum | `--bindu-spectrum` | violet → blue → teal → green → yellow → orange hairline only |
| Glass | `--bindu-glass` | `rgba(255,255,255,.58)`, blur 20px, saturate 1.5 |
| Lines | `--bindu-line` | `rgba(8,11,18,.10)`; dark `.10` of shunya |

Rules: gold means action, never decoration. Spectrum is a 1–3px rule, a bar fill or a
soft radial wash — never a gradient on text, buttons or body copy. Dark panels carry a
spectrum top or bottom edge. Max one dark panel per two light sections.

## Type

- Display: Cormorant Garamond 600, tracking `-.02em`, leading `1.02`. H1 `clamp(44px,7.4vw,98px)`; H2 `clamp(32px,4.3vw,56px)`.
- Body: DM Sans 400/500. Body copy 16–18px, lead 18–20px, line-height 1.55–1.6, measure ≤62ch.
- Labels: DM Mono 10–11px, uppercase, tracking `.1–.16em`.
- Two sentences per paragraph. Say the number or say nothing.

## Shape, space, motion

- Radii: 6 / 10 / 14 / 20 / full. Cards 14, panels 20, buttons and chips full.
- Section rhythm: `clamp(72px,9vw,128px)`. Content 1240, wide 1440.
- Shadows: sm `0 1px 2px`, md `0 18px 44px .10`, lg `0 40px 90px .18`. No glow except spectrum washes.
- Motion: `motion.js` only. Durations 120/220/420/700ms, ease `cubic-bezier(.16,1,.3,1)`.
  Respect `prefers-reduced-motion`; no parallax on text, no autoplay carousels.

## Layout language (AI FusionX, structure only)

Floating pill header → light editorial hero with glass shards → facts strip → split
sections → staggered card grids → one dark utility band → comparison table → image
gallery → FAQ split → rounded dark CTA → rounded dark footer. Hero is always readable in
five seconds: what it is, what it solves, what it costs, how to start.

## Components available

`.btn` (`--primary`, `--ghost`, `--dark`, `--light`, `--sm`), `.chip`, `.link-arrow`,
`.card`, `.panel`, `.pod`, `.gates`/`.gate`, `.calc` (calculator.js contract),
`.compare`, `.gallery`/`.shot`, `.faq`/`.acc`, `.cta`, `.ftr`, `.hdr`/`.mega`/`.drawer`.

## Accessibility floor

One H1; semantic headings; body contrast ≥4.5:1 (footer greys ≥.58 on void); visible
focus; skip link; 44px targets; alt + width + height on every image; keyboard-operable
nav, mega menu, drawer, calculator and FAQ.

## Type floor and CTA hierarchy

Functional micro text (labels, eyebrows, breadcrumbs, table headers, legal notes, chips,
form labels, calculator notes) is **12px minimum**; the footer legal note is 12.5px.
This floor lives at the end of `assets/v2/section-inner.css`; do not reintroduce 10–11.5px
functional text on inner pages.

One primary action label across all pages: **Book a Discovery Call** → `contact.html`.
Secondary labels stay specific to their action ("Explore Pods & Pricing", "See the full
delivery model", "Discuss my configuration"). The footer CTA label matches its destination:
"Talk to an expert" → `talk-to-an-expert.html`. Never pair one label with two destinations.
