# Reserved human photography

**Status: awaiting client-supplied images. Do not publish the site with the placeholders visible.**

These three containers are built and reserved on the homepage. No stock, generated or
illustrative human imagery has been inserted, and no `<img>` points at these paths yet —
each placement is a graphite placeholder that states the filename and dimensions it expects.
Until the approved photographs exist, the homepage must not be published publicly.

| File | Dimensions | Ratio | Placement | Page |
|---|---|---|---|---|
| `customer-business-owner.webp` | 1200 × 900 | 4:3 | Problems section (`#problems`), right of the copy on desktop, below it on mobile | `index.html` |
| `gc3-connected-team.webp` | 1440 × 1080 | 4:3 | Connected pod section (`#workspace`), left of the copy on desktop, above it on mobile; the portal preview sits beneath it | `index.html` |
| `quantocos-team.webp` | 1920 × 1080 | 16:9 | Trust section (`#trust`), centred between the heading and the four trust cards | `index.html` |

## Direction

- `customer-business-owner` — one small business owner in their own working environment.
  Not a stock handshake, not a posed meeting. Subject positioned in the right two-thirds so
  the copy column does not crop them on desktop.
- `gc3-connected-team` — the Quantocos pod at work, at least two people and a screen.
  Keep the left third visually calm: the container is 55% wide and sits first on desktop.
- `quantocos-team` — wide, horizontal composition; faces not cropped at the top edge.
  Readable when rendered at ~1100px wide.

## When the images arrive

1. Export as WebP at the dimensions above (or larger, same ratio), quality ~82.
2. Replace the inner `.hp-ph` block in each `<figure class="hp-media" data-asset="…">` with
   `<img src="assets/v2/img/human/<file>" width="…" height="…" alt="…" loading="lazy" decoding="async">`.
   The figure already reserves the aspect ratio — no CSS change is needed.
3. Write a factual alt that describes the scene; never name employees whose identities are unconfirmed.
4. Re-run `python check_site.py` — its image rules require `alt`, `width` and `height` on every `<img>`.
5. The RGB edge and reveal animation are already attached to the figure and carry over to the image.
