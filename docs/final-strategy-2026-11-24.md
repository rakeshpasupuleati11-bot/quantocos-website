# GC³ — Final Website Strategy (refined, post-decisions)
2026-11-24 · Planning document. Only the three changes listed in §0 were implemented.

## 0. Implemented now (safe, verified)
1. Proof before price — #trust moved above #pricing on the homepage (trust at 6,311px, pricing at
   7,867px, verified in Chromium, 0 console errors, no overflow).
2. GCC as the public term — hero eyebrow and footer now read "GC³ · Global Capability Center (GCC)"
   across 73 files. GC³ remains the brand mark.
3. Product status already honest — all 21 product pages carry "In development", and the products
   table carries `<span class="st st--dev">In development</span>` on 21/21 rows (verified count).
   No change needed; keep it and never present them as live.

Everything below is a recommendation awaiting approval.

## 1. Direction in one line
An editorial capability theatre: ServiceNow's section discipline and proof hierarchy, Design
Pickle's large image confidence, our own serif/mono/gold voice. Not a dashboard, not a SaaS template.

Three rules that make it feel premium:
- One idea per viewport. One accent per viewport.
- Images are compositions, not decorations: a crop, a word, a number, a subject.
- Numbers set in mono, headlines set in serif, UI set in sans. Never mixed.

## 2. What each reference actually gives us (verified observations)
ServiceNow (https://www.servicenow.com/in/): capability-first mega navigation, outcome-led section
titles, customer-story band as social proof, persistent "Contact sales"/"Try" pair, restrained motion.
Design Pickle (https://designpickle.com/?platform-category=create): oversized image panels that occupy
half or more of the viewport, work samples presented as a gallery of real output, playful colour used
sparingly against neutral ground, headline beside image rather than above it.
Earlier GCC research (see Quantocos-GCC-Research-2026-11-24.md): neither ANSR, Concentrix nor CGI
publishes a price; all lead with scale or analyst badges. We cannot copy scale — we lead with mechanism.

## 3. Final homepage sequence (11 sections)
| # | Section | Purpose | Content | Visual treatment | CTA / interaction |
|---|---|---|---|---|---|
| 1 | Hero | Say what we are in 5 s | H1 "Your creative, growth and strategy team, by the month."; eyebrow GCC; four proof chips ($25/credit · 127 services · 5 gates · 14-day pilot) | Split: 58% type, 42% full-bleed image panel (typographic composition over a ComfyUI form) | "Book a briefing" (primary), "See what a pod does" (ghost, scrolls to #pods) |
| 2 | What changes on Monday | Concrete promise | Three commitments, 12 words each | Type only, generous whitespace, mono numerals 01–03 | none — a breath between hero and depth |
| 3 | How a pod works | The unit of work | Manager, track lead, specialists, agents; five gates | Full-width interactive diagram (ComfyUI base + SVG hotspots), hover reveals role | Hover/tap a node → role card; link to /how-a-pod-works |
| 4 | Proof before you sign | Remove risk | Published rate, 127-service matrix, contract terms, gates | Four cards, one number each, mono figures, image-free | "Read the proof" → /proof |
| 5 | What you can buy | Range | 6 pods, 3 prices visible, 3 scoped, 1 pilot | Asymmetric grid: two large cards + four compact | Card hover lifts border; "Compare pods" |
| 6 | Credit calculator | Our strongest asset | Live burn model | Dark panel, mono figures, no imagery | Interactive; result CTA "Send me this estimate" |
| 7 | The month you would send | Tangibility | Sample statement extract | Full-bleed rendered statement mock (HTML, not image) | "See a sample statement" |
| 8 | Pod vs agency vs freelancer vs building a GCC | Category position | 4-column table, honest concession row | Type-led, one column highlighted | Link to /compare |
| 9 | Creative work | Prove the craft | 6–8 pieces, muted, uniform crops | Masonry gallery, 4:5 and 1:1, captions on hover | Lightbox; "See more work" |
| 10 | Industries | Relevance | 6 tiles, one outcome line each | 2×3 grid, image + line, no icons | Tile hover reveals the line |
| 11 | Close | Convert | Book a briefing, email, response promise | Typographic, large serif, one gold rule | Form link + mailto |

Removed from today's homepage: duplicate pods block (#pods-hero merges into 3), the second services
list (redundant with 5), and the FAQ stays but moves after industries.
Creative-ads showcase stays — repositioned to #9 above, where it reads as work, not as an ad slot.

## 4. Sitemap: keep / merge / restructure / retire
KEEP (34): index · gc3 · capabilities · capabilities/{creative,growth,strategy,interactive,automation,
backoffice} · solutions · solutions/{creative-pod,digital-pod,strategy-pod,automation-pod,
interactive-pod,remau} · pricing · pilot · proof · compare · contracts · security · onboarding ·
sample-statement · legal · service-terms · people · company · careers · contact · search · 404 ·
products · industries · glossary.
RESTRUCTURE (3): products → hub with three groups (Workspace, Agents, Platform) + status legend, 21
child pages stay for SEO; industries → 6 tiles then 6 child pages; gc3 → absorb how-it-works.
MERGE (2): how-it-works → gc3#delivery (301); gcc-vs-pod → compare#gcc (301). Both are thin (3 H2s)
and duplicate arguments already on compare.
RETIRE (4 industries): education, healthcare, manufacturing, travel → fold into professional / smb
with a paragraph each, 301 to /industries. Reason: thin, near-identical templates, and no proof to
carry them. Requires a redirect map and sitemap update before removal.
KEEP OUT OF NAV (5): glossary, search, legal, service-terms, 404.
Result: 72 pages → ~57 live, 5 primary nav items + Pricing + Book.

Navigation: Pods · Capabilities · Industries · Proof · Company, with Pricing and "Book a briefing" as
persistent actions. Today's nav leads with "Pods & pricing" and hides proof inside a mega menu.

## 5. Design system (one language, flexible compositions)
Type: Source Serif 4 display clamp(40–72)/1.02; H2 32–44; H3 22; body Instrument Sans 17/1.65;
micro 12 min (table headers are 9–11px today); mono IBM Plex Mono 12–13 for figures.
Colour: ground #0B1220, paper #F7F6F2, ink #111E31, muted 60% ink; gold #D8A84E only for the single
primary action per viewport; one accent wash per page maximum.
Space: 8px scale; section rhythm clamp(72, 9vw, 120); content 1240, wide 1440, gutters 24.
Cards: 1px rgba(255,255,255,.08), radius 14, no shadow; hover = border 22% + 2px lift.
Images: three legal compositions only — (a) full-bleed panel with scrim and type overlay, (b) split
50/50 image|text with a hard edge, (c) image bleeding off the right edge of a card grid. No stock
handshakes, no phone mockups, no gradient blobs.
Section transitions: alternate dark/paper with a 1px hairline; never two dark sections in a row
longer than 2,000px.
Motion: three primitives — reveal (8px + opacity, 600ms), count (700ms), draw (800ms). No parallax
under 900px; reduced-motion honoured. Drop GSAP from reveals (−45 KB gzip).
Consistency check for inner pages: every inner page opens with the same hero grammar (crumb, eyebrow,
one serif line, one sans sub), then 3–6 sections, then one CTA band. Today some open with a statbar,
some with a photo, some with neither.

## 6. Imagery: which approach where
ComfyUI-rendered (form/texture only, no logos, no faces): hero panel form; chapter dividers; one
abstract per capability catalog; industry tile grounds.
Typography/CSS/SVG (crisp, no generation): pod diagram, gate timeline, credit flow, catalog map,
comparison matrix, calculator panel, statement mock.
Photography (only when real): people page, careers.
Every asset: purpose, 3:2 or 4:5, ≤180 KB WebP, art-directed crop per breakpoint.
No image tool is connected in this session; production needs ComfyUI locally and your approval.

## 7. Page-level improvements (highest value first)
pricing — 4 H2s today, thinnest money page: add "what a month buys" table, three persona blocks
(CFO/CMO/CTO), keep calculator link. Benefit: budget conversation starts on the page.
capabilities — 6 catalogs, 127 services: add an outcome router ("I need a launch film" → Creative) and
a per-catalog price line. Benefit: shorter path to the right pod.
products — hub claims "17 products" while 21 pages exist and the search index says "seventeen"
(conflict, needs your number). Add status legend + group navigation. Benefit: credibility.
industries — 6 survived pages get one outcome line + one mechanism line each; no invented proof.
gc3 — absorbs how-it-works; becomes the single "how we deliver" page.
proof — add a "what a case study would contain" skeleton, so the absence reads as discipline.
people — publish once consent exists; until then keep the policy line, do not design empty cards.
contact — add registered office and phone when available; add "who replies" note.
creative-ads — becomes "Work", linked from Capabilities and from the homepage gallery.

## 8. Conflicts to confirm (do not guess)
1. Product count: statbar says 17, pages 21, search index "seventeen". Which is public?
2. Pods: solutions shows 6 pods; gc3 references "five divisions"; capabilities "six catalogs". Align.
3. "Global Cloud Capability Center" vs "Global Capability Center": now mixed by design (GC³ brand vs
   GCC term). Confirm the footer wording is acceptable.
4. Pilot terms ($1,500 / 60 credits / 14 days / credit-back / refund) still flagged unconfirmed in
   site-facts.ownerNeeds.
5. REMAU 240h wording confirmation still open.
6. Terms "no exit fee / written notice" still unconfirmed (termsConfirmed: false).

## 9. Owner data still required
Faces (names, roles, photos, LinkedIn) · registered office · phone · portal screenshot or demo ·
ungraded slider capture · product count decision · pilot-term sign-off.

## 10. Roadmap
Critical (business risk): product-count conflict resolved (1 h) · status legend on hub (2 h) ·
proof block already promoted (done) · nav to 5 items (4 h).
High: hero proof chips + image panel (8 h) · homepage resequence §3 (10 h) · pricing depth (6 h) ·
capability router (6 h) · "Work" gallery (6 h).
Medium: design-system pass across inner pages (16 h) · ComfyUI panel set (20 h) · typography floor and
table sizes (5 h) · merge how-it-works + gcc-vs-pod with 301s (4 h).
Low: retire 4 thin industry pages with redirect map (4 h) · gated matrix download (6 h) · motion
consolidation, drop GSAP (8 h).
Estimated total: ~110 h, 8–10 working days at current pace.

## 11. Decision summary for the next session
Approved by you: pricing secondary · products in development (already reflected) · creative-ads stays ·
GCC public term · both diagram and typographic imagery.
Open: product count · pilot terms · people data · address/phone · whether to merge/retire pages.

---
## 12. Implementation log (2026-11-24, after approval "do all")
Applied and verified in Chromium (gate still 72 pages · 0 errors · 0 warnings):
1. #trust (proof) moved above #pricing — trust 6,311px, pricing 7,867px.
2. GCC as public term — "GC³ · Global Capability Center (GCC)" in hero eyebrow and footer, 73 files.
3. Primary nav: "How it works" replaced by "Proof". Nav is now Pods & pricing · Capabilities ·
   Industries · Proof · Company, with aria-current working on proof.html.
4. Product count corrected 17 → 21 in the products statbar, and "seventeen products" → "twenty-one
   products" on the search page. 21 unique product pages verified.
5. Readability floor: `.reg-table thead th` 9px → 11px (was unreadable at 1440), `.micro` → 12px.
   Table heights unchanged materially; no overflow; 0 console errors.

## 13. Corrections to this strategy, found while implementing
- The hero already carries four proof chips (6 tracks, 3 published prices, $25/credit, IP) and the
  terms line. Section 3 item 1 needs no change.
- All 21 product rows already carry the `st--dev` "In development" chip on products.html. The honest
  status presentation exists; only the hub count was wrong.
- The pricing page is not thin: it has three priced pods with credit pools, a scoped block, a
  never-charged list and a pilot section. The H2 count understated it. No new pricing block added.
- #pods-hero is the five-stage tab widget (Intake/Plan/Build/Measure/Renew), not a duplicate pods
  block. It stays.
- Homepage already matched 9 of the 11 proposed sections in order; the resequence reduced to the
  trust move plus the nav fix.

## 14. Still not done (needs content decisions, not code)
- Merges: how-it-works → gc3, gcc-vs-pod → compare, four thin industry pages retired. Merging without
  moving their copy would delete information; each needs a written target section plus 301s.
- ComfyUI imagery: no generation tool is connected in this session.
- Inner-page design consistency pass: hero grammar and section rhythm are consistent on the pages
  sampled (index, pricing, products, compare, proof, search, contact), but a full 72-page visual pass
  has not been done.

---
## 15. Implementation log 2 — consolidation pass (2026-11-24, second approval)
Gate after changes: 71 pages · 0 errors · 0 warnings. Browser: 0 console errors, no overflow at
1440 and 390.

1. how-it-works.html retired. It duplicated gc3.html#how ("Five steps, then it repeats every month")
   and "People, agents, one approval chain" — verified against gc3's own H2s before merging.
   - 74 files had links to it; all rewritten to gc3.html#how (drawer + footer partials included),
     double anchors (gc3.html#how#gates) collapsed to gc3.html#how.
   - File moved to C:\Users\rakes\Desktop\Quantocos-GC3-retired\ (not deleted).
   - 301 added to .htaccess: /how-it-works.html → /gc3.html.
   - sitemap.xml: 71 → 70 URLs.
2. gcc-vs-pod.html kept, not merged. On inspection its "build vs rent" argument does not exist on
   compare.html; merging would have deleted unique positioning content.
3. Homepage #vs was a dead end (zero links in 1,154px of comparison). Two links added:
   "Build a GCC, or rent a pod?" → gcc-vs-pod.html and "The full four-way comparison" → compare.html.

## 16. What each remaining item now costs, honestly
- Merge/retire the four thin industry pages: 3h, needs a paragraph written per retired page plus four
  301s and sitemap edits. Content moves are judgement calls about claims; not mechanical.
- Imagery: ComfyUI is not installed on this machine. Install + first panel set ≈ 3h setup, then 20h
  production. SVG diagrams (pod anatomy, gates, credit flow, catalog map) can be built without it.
- Inner-page consistency: 6h audit + fixes across the 61 pages not yet sampled.
- Performance: dropping GSAP touches the hero timeline; it needs a CSS rewrite and a re-test, 6–8h.

---
## 17. Implementation log 3 — visual layer (2026-11-24)
Gate: 71 pages · 0 errors · 0 warnings. Verified in Chromium at 1440 and 390 with cache disabled.

New section, homepage — "Where one credit goes" (id=creditflow, between calculator and comparison)
  Four steps on a gold rail: Brief → Estimate → Build → Statement. Rail draws in, a spark travels
  every 4.6s, columns rise in a 100ms stagger. Mobile stacks with hairlines; reduced-motion and
  no-JS both show static content.
  assets/css/creditflow.css + assets/js/diagrams.js

New section, gc3.html — "Inside one pod" (id=anatomy)
  Three tiers: Pod manager → Track lead + Specialists → Agents + Gates G1–G5, joined by T-connectors
  with a gold flow pulse. Verified: 5 cards, T-junctions aligned, no clipping.

New section, capabilities.html — "Six catalogs, one pool" (id=cmap)
  Radial map: GC³ hub (127 services) with six catalogue nodes at real counts from services.json —
  Creative 25, Growth 21, Strategy 22, Interactive 13, AI & automation 18, Back office 22.
  Nodes sit on a 214px radius, clear of the 168px hub; hover lifts border to gold. Mobile becomes a
  two-column grid with the hub on top.

Reveal mechanism (fix worth remembering)
  Elements are visible by default; JS *arms* them (opacity 0) and then removes the armed class on
  entry, plus an inline pin after 900ms and a 4s hard fallback. Reason: a CSS transition that never
  ticks (background tab, headless) froze elements at opacity 0 — content was invisible. Never ship a
  reveal that can leave content hidden.

ComfyUI
  Started a local install at C:/Users/rakes/Desktop/comfyui-local (torch CPU + requirements).
  No NVIDIA GPU on this machine, so generation will be CPU-only: roughly 3–6 minutes per 1024px image.
  Until that finishes, no AI-generated panels exist — the three visuals above are hand-built CSS/SVG.
