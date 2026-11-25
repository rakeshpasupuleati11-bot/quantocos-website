# README-BUILD.md — how the site is built

Static HTML. No framework, no bundler. Two scripts keep it honest.

## 1. Shared chrome — `build.py`

The header nav, the mobile drawer and the footer used to be pasted into all
69 pages, which is how they drift. They now live in `partials/`:

```
partials/nav.html      <nav aria-label="Primary"> … </nav>
partials/drawer.html   <div class="drawer__body"> … </div>
partials/footer.html   <footer class="ftr"> … </footer>
```

`index.html` is the reference: edit the page, then re-extract the block into the
partial if you changed the chrome itself.

Placeholders inside the partials:

| placeholder | root page | page in a subfolder |
|---|---|---|
| `{{P}}` | *(empty)* | `../` |
| `{{HOMEPRICING}}` | `#pricing` | `index.html#pricing` |

Commands:

```bash
python build.py            # write the partials into every .html page
python build.py --check    # exit 1 if any page has drifted (used by CI/check_site)
```

Never hand-edit nav/footer markup inside a page: the next build overwrites it.

## 2. Pre-publish gate — `check_site.py`

```bash
python build.py && python check_site.py          # must print "0 errors · 0 warnings"
python check_site.py --audit                     # also rewrites AUDIT.md
```

It fails on: ≠1 H1 · title > 60 chars · description > 160 · duplicate title or
description · missing or mismatched canonical · invalid JSON-LD · broken internal
link or anchor · `target="_blank"` on an internal link · visible `[NEEDS` ·
a banned phrase from VOICE.md · a price/credit/rate/pilot/geography value that
disagrees with `site-facts.json` · nav, drawer or footer drifted from `partials/` ·
an image without alt, width and height.

## 3. Facts — `site-facts.json`

Single source of truth for prices, credits, gate names, counts, geography and
pilot terms. Edit it first, then the pages, then run the gate again. Anything the
owner has not confirmed is listed under `ownerNeeds` — it must not appear as a
claim on a page until it moves out of that list.

## 4. Publishing

```bash
python build.py && python check_site.py && python build.py --check
```

Then upload the repository root as-is (static). Backups (`*.backup.html`) are
development artefacts and can be excluded from the upload.
