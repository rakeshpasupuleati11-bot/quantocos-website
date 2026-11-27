# UI/UX acceptance checklist

Run top to bottom before declaring a page done. Measured items are gates, not opinions.

## Consistency
- [ ] Shared chrome from `partials/` only; `python build.py --check` clean
- [ ] Tokens from `assets/css/system.css` + `assets/v2/tokens.css`; no new token set
- [ ] Primary CTA label "Book a Discovery Call" → `contact.html`; label matches destination

## Content
- [ ] Problem → impact → solution → deliverable → model → price → next action present
- [ ] No banned phrase (`unlimited`, `guaranteed`, `ROI`, `replaces`, delivery-hour promise,
      `best-in-class`, `world-class`, `industry-leading`), no invented number
- [ ] Every figure matches `site-facts.json` or `services.json`
- [ ] Sentences readable: body 16–18px, long-sentence share under 25%

## Navigation
- [ ] Mega menu survives slow diagonal pointer movement; Escape and outside click close
- [ ] Keyboard reachable; focus visible; sticky header does not cover focus
- [ ] Every link resolves to a route in `routes.json` or a real anchor

## Accessibility (WCAG 2.2 AA)
- [ ] One H1; heading order holds; contrast ≥4.5:1 body, ≥3:1 large
- [ ] Images have alt + width + height; decorative images `alt=""`
- [ ] Targets ≥24×24 (44×44 preferred); reduced motion honoured
- [ ] Forms: labels, error text, pending/error/success only after receipt

## Responsive
- [ ] No horizontal overflow at 1920, 1440, 1366, 1280, 1024, 768, 390, 360
- [ ] No clipped text, wrapped CTA, or unstacked table

## Motion
- [ ] Transform/opacity only; no scroll lock; pause control where motion is continuous
- [ ] Content readable if animation JS fails

## Conversion
- [ ] Primary CTA above the fold on mobile and desktop
- [ ] No simulated success; endpoint missing → honest mailto fallback
- [ ] Events designed for `cta_click`, `pod_select`, `calc_use`, `form_start`,
      `form_submit`, `mailto_click`; no lead counted without confirmed receipt

## Performance
- [ ] Lighthouse mobile: performance ≥95, accessibility 100, best practices 100, SEO 100
- [ ] LCP ≤2.5s, CLS ≤0.1, font-size legibility ≥60% (target ≥95%)
- [ ] `python check_site.py` → 0 errors · 0 warnings

## Deploy
- [ ] Commit site files only; push `origin main`; compare live against local
