# CLAUDE.md — Quantocos GC³ site

Permanent instructions for every session. Keep this file short; add rules, not prose.

## What this project is

Static marketing site for Quantocos GC³ (`quantocos.com`). 70 live HTML pages, no framework,
no bundler, no package manager. Shared chrome is injected by `build.py`. Design work for V2 is
in progress against Figma: https://www.figma.com/design/0pczsBz7vPr0YqOvjIpjFQ

Objective: premium, conversion-focused site for US SMB owners. Every quality category must
score ≥9/10. Do not start redesign or deployment until explicitly instructed.

## Token discipline (mandatory)

- Inspect before asking; ask before scanning.
- Never run a recursive listing/grep across the repo root. Scope to one folder or file.
- Never read `*.backup.html`, `*.backup.*`, `QA/shots`, `QA/video`, `*.webm`, `assets/img/**`,
  `assets/fonts/**`, `app.min.css`, `site.bundle.css`, or `site.bundle.js` in full.
  Search them instead, with `grep -n` and tight patterns.
- Read with `offset`/`limit` when the target is known. Do not re-read a file you just edited.
- One analysis per question. No parallel agents, background tasks, web searches, or repeated
  audits unless the user asks.
- Prefer `Grep`/`Glob` over shell `find`/`cat`; prefer a single batched shell call over several.
- Summarise findings; never paste large file contents into the response.

## Source of truth — never invent facts

| File | Owns |
|---|---|
| `site-facts.json` | prices, credits, pilot terms, counts, geography, gates, `ownerNeeds` |
| `VOICE.md` | voice rules, definitions, banned phrases |
| `README-BUILD.md` | build and gate commands |
| `V2-TRACKER.md` | current state, open items, approvals |
| `V2-DESIGN.md` | V2 tokens, identity rules, layout language |
| `QA/summary.md` | last browser QA results |

- Any claim not confirmed by `site-facts.json` or `ownerNeeds` sign-off must not appear on a page.
- Banned: `unlimited`, `guaranteed`, `ROI` (outside the disclaimer), `replaces`, delivery-hour
  promises, `best-in-class`, `world-class`, `industry-leading`, invented numbers.
- Say the number, or say nothing. Two sentences per paragraph.

## Build and verification

```bash
python build.py                 # inject partials into every page
python build.py --check         # fail on chrome drift
python check_site.py            # 17-rule gate; must be "0 errors · 0 warnings"
python check_site.py --audit    # also rewrites AUDIT.md
python qa_browser.py            # Playwright, optional
```

Publish = static upload of the root. Backups are dev artefacts; exclude them.

## Reusable components — reuse, never duplicate

- Chrome: `partials/nav.html`, `partials/drawer.html`, `partials/footer.html`. Never edit nav,
  drawer or footer inside a page; edit the partial and rebuild. `{{P}}`, `{{HOMEPRICING}}`.
- Design tokens: `assets/css/system.css` (`:root`) — colour, radii, ease, spacing, fonts.
  Do not introduce a second token set. Check `components.css` before writing new cards/buttons.
- CSS entry: pages load `app.min.css` → `site-2026.css` → page/section CSS. New section styles
  go in a named section file, not appended to `app.min.css`.
- JS: `motion.js` is the CSS-driven motion layer (`data-reveal`, `data-stagger`, `data-count`,
  `data-parallax`, `data-draw`, `data-tilt`); `components.js` owns tabs/count-up/link enhancer.
  `assets/v2/motion-gsap.js` is the scroll layer on pages that link it, using the pinned,
  checksummed builds in `assets/vendor/` (Lenis 1.3.28, GSAP 3.15.1 + ScrollTrigger).
  Do not add a third motion library, a second IntersectionObserver, or an unpinned CDN tag.
- Data: `assets/data/services.json` (service catalog), `site-facts.json` (pricing).
- Patterns to reuse: pod card, gate/stage track, credit ledger/calculator, orbit map,
  comparison table, statement mock, FAQ accordion, CTA band.

## Preserve existing functionality

- Change the smallest surface. No drive-by refactors, renames or reformatting.
- Do not remove `has-motion`/`no-motion` handling, reduced-motion support, skip links,
  focus styles, canonical/JSON-LD, sitemap entries, or the `target`/`rel` link enhancer.
- Keep `id`/`href` anchors and page filenames stable unless the task includes a redirect map.
- Accessibility floor per page: one `H1`, semantic headings, alt + width + height on images,
  4.5:1 body contrast, keyboard-operable interactive components.
- Run `build.py --check` and `check_site.py` before declaring any page done.

## Deployment — permanent

Every verified change ships to the live site; finished work must never exist only on the desktop.

- Repo `https://github.com/rakeshpasupuleati11-bot/quantocos-website.git`, branch `main`,
  live URL `https://rakeshpasupuleati11-bot.github.io/quantocos-website/`.
- Workflow: change → validate locally (`build.py --check`, `check_site.py`, browser check) →
  commit only site files (exclude `QA/shots`, `QA/video`, `*.webm`, backups, temp reports) →
  push `origin main` → confirm GitHub Pages serves that commit → compare live against local
  before reporting.
- Never force-push, rewrite history, or create another project folder, repo, branch or URL.
- Never claim completion until the live site serves the verified changes.

## Working conventions

- Windows/PowerShell environment. Paths use forward slashes in shell tools.
- This directory is not a git repository; do not assume commit/branch workflows.
- Report concisely: what changed, files touched, gate result, open issues.
