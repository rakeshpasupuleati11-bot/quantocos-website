# GCC Website Research, Competitor Benchmark & Creative Strategy
Quantocos GC³ · 2026-11-24 · Research only — nothing implemented.

Evidence tags: [V] verified this session from the live page or project file · [O] observation of
the rendered page · [R] recommendation · [A] assumption/estimate.

## 1. Method and limits
- Our site: 72 pages read structurally (headings, section order, component behaviour) during the
  go-live audit earlier today. No re-scan repeated here.
- Competitors: 9 sites loaded in a real browser at 1440px; nav, H1, H2 sequence, CTAs and body
  keywords extracted programmatically. Infosys BPM returned "Access Denied" [V]; Altimetrik
  rendered only 89 characters of text [V]; EPAM hit a Cloudflare interstitial [V]. Those three are
  excluded from design conclusions.
- Pinterest: board loaded without login but Pinterest overlays a login modal and dims the grid [V].
  Board header shows "Creative Ads · 1,990 Pins · By Ravi Teja" [V]. Only ~20 pins were legible;
  alt text is the placeholder "Pin" on every image [V], so the analysis below rests on visual
  inspection of two viewport screenshots, not the full 1,990. Treat the Pinterest section as a
  sample, not a census.

## 2. What we already have — honest read
Excellent, do not damage:
- Published prices ($25/credit; $3,000 / $6,000 / $9,000) and a working credit calculator. None of
  the GCC sites reviewed publish a price at all; ANSR, CGI and Concentrix route to "Contact us"
  [V]. This is our single strongest differentiator and it is currently buried below the fold.
- Depth: 127 services with credit values, 6 catalogs, 6 pods, 21 product pages, glossary, contracts,
  security, service terms, sample statement. Rivals run 5–13 capability headings [V].
- A gates model (G1–G5) with named approvals — a mechanism, not a slogan.
- An honest proof page that refuses to invent case studies. Rare; protect it.
Average:
- Homepage sequence is logical but ordered for us, not for a buyer: pricing sits at position 6,
  trust at 9, the strongest asset (calculator) at 7.
- 21 product pages with no visible status taxonomy; a buyer cannot tell what is buyable.
- Industry pages are lists with generic copy; nobody says "what this means for a healthcare CFO".
Missing (all owner-dependent, none inventable):
- No faces, no client logos, no case studies, no analyst recognition, no postal address or phone.
- No gated thought leadership, no newsletter, no portal demo.

## 3. Competitor research (verified URLs)
| Site | Type | Strongest idea to borrow |
|---|---|---|
| https://ansr.com/ | GCC build/operate enabler | Scale strip immediately under the hero: 225K+ professionals hired, 225+ centers, 14M+ sqft, 20+ years, $2.5B+ capital [V]. Then four benefit cards (talent, 40% lower cost, 30% productivity, 30% faster) [V]. Nav is buyer-language: Offerings, Engagement Models, Customers, Resources [V]. |
| https://www.concentrix.com/services-solutions/global-capability-centers/ | GCC design/build/run | H1 states the whole offer in six words: "Design, build, run, and transform Global Capability Centres" [V]. Differentiation line "Most GCC partners stop at the build" [V], then an operating/ownership-model chooser [O]. Ends with FAQ + related insights [V]. |
| https://www.cgi.com/en-us/node/154030 | GCC services | Journey-stage framing: "Wherever you are on your GCC journey" [V]; analyst proof ("ISG Provider Lens Leader") placed above the fold [V]; "Our GCC experience by the numbers" [V]; "How can we help?" contact block [V]. |
| https://www.globant.com/ | Enterprise services, design-led | Industry-first headline "We know your industry before we write a line of code" [V]; a named AI product (Glob.AI) as the delivery mechanism rather than a claim [V]. Our equivalent is the pod + credit model. |
| https://www.thoughtworks.com/ | Technology consultancy | Results-first H2 "Results we've achieved for banks, airlines, manufacturers and more" [V]; awards and Technology Radar used as proof objects [V]; editorial newsroom as trust [V]. |
| https://www.palantir.com/ | Enterprise platform | Nav organised by product, not by company department (AIP, Foundry, Gotham, Ontology, Apollo) [V]; "Impact Studies" as a first-class nav item [V]; single demo CTA [V]. |
| https://stripe.com/ | Infrastructure, benchmark for clarity | Pricing in the top nav [V]; audience split for enterprises / startups / platforms [V]; "Contact sales" beside "Start now" [V]. |
| Altimetrik, Infosys BPM, EPAM | — | Not analysed: bot wall / empty render [V]. No conclusions drawn. |

Pattern across the five GCC sites: unnamed capability language, scale numbers, analyst badges,
"talk to us" conversion. None of them explains price, unit of work, or what a month looks like.
That is the gap GC³ already fills — the strategy is to lead with it, not to imitate them.

## 4. Pinterest board — what is actually in it
Board: https://in.pinterest.com/iamravitejachillara/creative-ads/ — 1,990 pins [V], logged-out
overlay limits legible pins to ~20 [V].

Four directions visible in the sample [O]:
1. Iridescent 3D / motion-form objects — glossy curved forms, holographic gradients, dark ground,
   huge negative space. Use: one hero visual per quarter, capability transitions; never as page
   decoration.
2. Editorial type + collage grid — oversized display type, portrait cropped into a grid, cream and
   ink. Use: proof page, people page, insights covers, the sample-statement PDF.
3. Dark dashboard / data UI — navy-black surfaces, green or cyan data, dense modular panels, mono
   micro-labels. Use: calculator result, credit meter, portal screenshots, gate timeline.
4. Soft-gradient SaaS mockups — pale blue/lavender gradients, floating app windows, isometric props.
   Use: product hub cards; risky for a premium GCC brand, apply only at 10% strength or skip.
Secondary: corporate keynote styling (navy, numbered 01/02/03 sections, team slide). Use: the
"how a pod works" section as a numbered narrative.

What NOT to import: ad-style promo comedy, heavy purple/pink gradients, phone-mockup collages,
stock "team high-five" imagery. They read as SaaS or agency, not capability center.

## 5. Section-by-section comparison
| Section | Ours today | Reference does better | Change | Customer benefit |
|---|---|---|---|---|
| Nav | Utility links (Request portal access, Newsroom, Careers, Contact) + mega menus | ANSR: Offerings / Engagement Models / Customers; Palantir: product-first; Stripe: Pricing in nav | 5 primary items: Pods, Capabilities, Industries, Proof, Company; Pricing + Book a briefing as persistent actions | Buyer finds the price in one click |
| Hero | One sentence, dual CTA, photo panel | Concentrix states the whole offer in the H1 | Keep headline, add a live credit/statement visual instead of a photo | Understands unit of work in 5 seconds |
| Scale strip | None | ANSR's five numbers | We cannot copy scale. Substitute: $25/credit · 127 services · 5 gates · no setup fee · 14-day pilot | Answers "how big, how fast, how much" without inventing |
| Capabilities | 6 catalogs, 127 services | Globant: industry-first line | Add a router: "I need X outcome" → catalog | Buyer stops browsing 127 rows |
| Pods | 6 pods, 3 priced | Concentrix model chooser | A 3-way chooser: published pod / custom pod / pilot | Removes "which one am I" friction |
| Products | 21 pages, no status | Palantir product nav | Status badges: Live / In development / Not available | Stops a credibility hit on unbuilt products |
| Industries | 10 pages, generic | Thoughtworks results framing | One outcome line + one proof line per industry | Relevance |
| Proof | Strong, buried at #9 | Thoughtworks/ANSR put proof immediately after hero | Move proof to position 4 | Trust before price |
| Pricing | Published, deep page | Stripe clarity | Add "what a month buys" table to pricing page | Budget conversation starts sooner |
| Compare | pod vs agency vs freelancer vs GCC | CGI journey framing | Keep; add an explicit "build a GCC vs rent a pod" block on the homepage | Positions against the category |
| Contact | Form + email, no phone/address | All five have a named team CTA | Add office/registered details and a named responder | Enterprise procurement requirement |
| Footer | Legal-complete, identifier now added | — | Add LinkedIn, address, status page | Compliance + trust |

## 6. Recommended homepage sequence
1. Hero — outcome sentence + 4 proof chips ($25/credit, 127 services, 5 gates, 14-day pilot) + two
   CTAs (Book a briefing / See the rate card) + credit-meter visual. Why first: the rate is the
   differentiator, not the rhetoric.
2. What changes on Monday — the 3 commitments (keep, it is good).
3. How a pod works — people + agents, numbered 01–04, one diagram. Why here: capability before price.
4. Proof you can check before you sign — price, matrix, contract, gates. Why: removes risk before the
   price conversation.
5. What you can buy — 6 pods, 3 prices visible, 3 "scoped per client", status labels.
6. Credit calculator — moved up from 7 to 6; it is the strongest interactive asset on the site.
7. What a month looks like — sample statement / burn table (currently orphaned on its own page).
8. Pod vs agency vs freelancer vs building a GCC — four-column table with the honest concession column.
9. Industries — 6 tiles with one outcome line each.
10. Who runs it — real people or omit (owner-dependent). No stock faces.
11. FAQ — keep the 8 buyer questions.
12. Close — book a briefing + email + response promise.

Removed from the homepage: the standalone creative-ads showcase, duplicated capability lists, and the
second pods block. Both duplicate content further down the funnel [O].

## 7. Information architecture and journeys
Top level: Pods & pricing · Capabilities · Industries · Proof · Company. Persistent: Pricing, Book.
Decision-maker: home → proof → pods → calculator → contact (4 clicks).
Marketing lead: home → capability catalog → pod page → sample statement → contact.
Procurement: home → company → contracts → security → legal → contact.
Partner: home → company → industries → contact.
Gap today: sample statement and gcc-vs-pod are reachable only from the footer/insights; both should be
in the main flow.

## 8. Design system direction
Keep: dark editorial ground, Source Serif 4 for headlines, Instrument Sans for UI, IBM Plex Mono for
numerals/labels, gold gradient reserved for one action per viewport, hairline borders, minimal glass.
Type: display clamp(40–72); H2 32–44; body 17/1.65 (currently 16); micro 12 minimum (table th are 9–11px
today [V] — too small); mono 12–13 for credits/prices.
Grid: 12 columns, 1240 content, 1440 wide, 24 gutters, 8px spacing scale, section rhythm
clamp(72, 9vw, 120) everywhere.
Cards: 1px rgba(255,255,255,.08), radius 14, no shadow; state on hover = border lightens + 2px lift.
Imagery: diagrams over photographs. Every visual should be a mechanism (flow, gate, burn, map).
Motion: three primitives only — reveal (opacity+8px), count-up, draw-on-path. 500–800ms, cubic-bezier
(.22,1,.36,1). No parallax under 900px. Replace GSAP hero timeline with CSS where possible.
Avoid: multiple gradients per section, glass on every card, autoplay video, tilted 3D cards, scroll
hijacking, marquees.

## 9. Image and asset plan (original, not Pinterest-sourced)
1. Credit meter — vertical 0–360 gauge, mono numerals, gold needle. Hero right. 4:5.
2. Pod anatomy — manager, track lead, 2 specialists, 3 agent nodes, gate markers. How-it-works. 16:9.
3. Gate timeline — G1–G5 with signature ticks. Pod pages. 21:9 strip.
4. Credit flow — request → estimate → burn → statement, four-step line diagram. Pricing. 16:9.
5. Catalog map — six catalogs sized by service count (127 total). Capabilities hero. 1:1.
6. Month statement — rendered mock of the sample statement, real numbers. Homepage 7. 4:3.
7. Compare matrix — four columns, 12 rows, no logos. Homepage 8. 16:9.
8. Industry tiles — 10 originals, one geometric motif each, no stock photography. 1:1.
9. Portal concept — balance, burn rate, request quote. Replaces the two [NEEDS] slots. 16:10.
10. People — real photographs only, 4:5, desaturated, consistent ground.
No image-generation tool is connected in this session; concepts 1–9 can be produced in ComfyUI locally
if approved. None should be inserted before review.

## 10. Conversion and UX
- Add a sticky mobile CTA bar (already coded, `.mcta`) — verify it is not fighting the drawer.
- Every capability page needs one "what this costs" line and one pod link; today they dead-end into
  a contact form [O].
- Add "response within one working day" beside every CTA (already promised on contact page).
- Add a secondary CTA for the not-ready buyer: "Get the 127-service matrix (JSON/CSV)".
- Persona blocks on pricing: CFO (unit economics), CMO (output per month), CTO (agents + IP).
- Reduce pricing page depth gap: it has 4 H2s against 13 on the homepage [V].

## 11. Accessibility, performance, maintainability
AA items that also help conversion: table header size + contrast (contrast fixed today), 12px minimum
micro type, focus trap in the drawer, visible focus on gold buttons.
Performance: 587 KB raw CSS+JS / 162 KB gzip [V]; one 228 KB stylesheet with 418 dead selectors [V];
GSAP 45 KB gzip for reveals. Moving hero motion to CSS removes ~45 KB and the last runtime errors.
Maintainability: keep partials + site-facts as the single source; add a `content/` JSON per page only
if copy volume grows beyond the current pattern.

## 12. Roadmap
| Priority | Work | Effort | Benefit |
|---|---|---|---|
| Critical | Product status taxonomy across 21 pages | 4 h | Stops overclaiming; enterprise credibility |
| Critical | Proof block moved to position 4; sample statement linked from home | 3 h | Risk removed before price |
| Critical | Nav restructure to 5 items + Pricing/Book actions | 4 h | Price discoverable in one click |
| High | Hero: credit-meter visual + proof chips | 8 h | Instant comprehension |
| High | Homepage resequence per §6; delete duplicate blocks | 6 h | Shorter path to contact |
| High | "Build a GCC vs rent a pod" homepage block | 4 h | Category positioning |
| High | Pricing page: what a month buys, persona blocks | 6 h | Budget conversation |
| Medium | Type scale + table readability pass | 5 h | Legibility, premium feel |
| Medium | Diagram set 1–8 | 20 h | Mechanism storytelling |
| Medium | Industry page outcome lines (10) | 6 h | Relevance |
| Low | Gated matrix download, newsletter | 6 h | Lead capture |
| Low | Motion consolidation, drop GSAP | 8 h | −45 KB, fewer errors |
Owner-dependent, blocks High items: faces, address/phone, portal screenshot, pilot-term sign-off.

## 13. Questions before implementation
1. Do you want the "published rate" positioned as the hero claim, or kept as a secondary proof?
2. Are the 21 products Live, in development, or a mix? I need the status per product.
3. May I remove the creative-ads showcase from the homepage, or is it a sales asset?
4. Is "GC³" or "GCC" the public term? The site uses both; the research shows buyers search "GCC".
5. Approve diagram production in ComfyUI, or keep imagery typographic only?

STOP — research phase complete. No files changed.
