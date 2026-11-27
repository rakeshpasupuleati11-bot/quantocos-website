#!/usr/bin/env python3
"""check_site.py — pre-publish gate for quantocos.com.

Fails (exit 1) if any page breaks a rule. Run after `python build.py`.

    python check_site.py            # check only
    python check_site.py --audit    # check + write AUDIT.md

Rules enforced
  1  exactly one <h1>
  2  <title> <= 60 chars, meta description <= 160
  3  titles and descriptions unique across the site
  4  canonical present and matching the file path
  5  every application/ld+json block parses
  6  no broken internal link or missing anchor
  7  no target="_blank" on an internal link
  8  no visible "[NEEDS" (comments are allowed)
  9  no banned phrase from VOICE.md
 10  prices, credits, credit rate, pilot terms and geography agree with site-facts.json
 11  nav, drawer and footer identical to partials/ (build.py --check)
 12  every <img> has alt, width and height
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FACTS = json.loads((ROOT / "site-facts.json").read_text(encoding="utf-8"))
ROUTES = json.loads((ROOT / "routes.json").read_text(encoding="utf-8"))

BANNED = [
    r"\bunlimited\b", r"\bguaranteed\b", r"\bguarantee\b", r"\bROI\b",
    r"\bbest-in-class\b", r"\bworld-class\b", r"\bindustry-leading\b",
    r"five fixed-price", r"\bwithin 24 hours\b", r"\bwithin 48 hours\b",
]
ALLOW = [
    r"within 48 business hours?",       # never used, but keep the door shut
]
SEV = {"error": 0, "warn": 1}


def pages():
    for f in sorted(ROOT.rglob("*.html")):
        rel = f.relative_to(ROOT)
        if len(rel.parts) > 2 or "partials" in rel.parts:
            continue
        if f.name.endswith(".backup.html"):
            continue
        yield f, rel.as_posix()


def visible(html: str) -> str:
    html = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<!--.*?-->", " ", html, flags=re.S)
    return re.sub(r"<[^>]+>", " ", html)


def text_of(html: str) -> str:
    import html as h
    return re.sub(r"\s+", " ", h.unescape(visible(html)))


def check_routes(issues):
    """routes.json is the single source of truth: sitemap, nav, drawer and footer
    may only reference the 30 live pages (plus sitemap.xml)."""
    base = ROUTES["canonicalBase"]
    pages = set(ROUTES["pages"])
    allowed = pages | set(ROUTES["nonPageLinks"])

    def add(rule, detail):
        issues.append({"page": "(routes)", "sev": "error", "rule": rule, "detail": detail})

    locs = re.findall(r"<loc>([^<]+)</loc>", (ROOT / "sitemap.xml").read_text(encoding="utf-8"))
    got = [u[len(base):] if u.startswith(base) else u for u in locs]
    if len(locs) != len(pages):
        add("route-count", f"sitemap has {len(locs)} URLs, routes.json has {len(pages)}")
    for p in sorted(set(got) - pages):
        add("route-sitemap", f"not a live route: {p}")
    for p in sorted(pages - set(got)):
        add("route-sitemap", f"missing from sitemap: {p}")
    for p in sorted(pages):
        if not (ROOT / p).exists():
            add("route-file", f"missing file: {p}")
    for name in ("nav", "drawer", "footer"):
        raw = (ROOT / "partials" / f"{name}.html").read_text(encoding="utf-8")
        for h in re.findall(r'href="([^"]*)"', raw):
            h = h.replace("{{P}}", "").replace("{{HOMEPRICING}}", "#pricing")
            if not h or h.startswith(("#", "mailto:", "tel:", "javascript:", "http", "//")):
                continue
            fp = h.split("#")[0].split("?")[0]
            if fp and fp not in allowed:
                add("route-chrome", f"{name}: {h} is not one of the 30 pages")


def check_page(f: Path, rel: str, all_titles, all_descs, issues):
    raw = f.read_text(encoding="utf-8", errors="ignore")
    vis = visible(raw)
    is_redirect = ('http-equiv="refresh"' in raw and 'content="noindex"' in raw)
    if is_redirect:
        # compatibility redirect: excluded from the 30-page architecture and facts checks
        return

    def add(sev, rule, detail):
        issues.append({"page": rel, "sev": sev, "rule": rule, "detail": detail})

    # 1 H1
    n = len(re.findall(r"<h1[^>]*>", raw))
    if n != 1:
        add("error", "h1", f"{n} h1 elements")

    # 2 title / description length
    m = re.search(r"<title>(.*?)</title>", raw, re.S)
    if not m:
        add("error", "title", "missing <title>")
        title = ""
    else:
        title = m.group(1).strip()
        if len(title) > 60:
            add("error", "title-length", f"{len(title)} chars: {title}")
    d = re.search(r'name="description" content="([^"]*)"', raw)
    if not d:
        add("error", "description", "missing meta description")
        desc = ""
    else:
        desc = d.group(1)
        if len(desc) > 160:
            add("error", "description-length", f"{len(desc)} chars")
    all_titles.setdefault(title, []).append(rel)
    all_descs.setdefault(desc, []).append(rel)

    # 4 canonical
    c = re.search(r'<link rel="canonical" href="([^"]*)"', raw)
    if not c:
        add("error", "canonical", "missing")
    else:
        want_tail = rel if rel != "index.html" else ""
        is_redirect = ('http-equiv="refresh"' in raw and 'content="noindex"' in raw)
        if want_tail and not is_redirect and not c.group(1).rstrip("/").endswith(want_tail):
            if "products/" in rel:  # documented duplicates: products/* consolidates to the root page
                pass
            else:
                add("error", "canonical-mismatch", c.group(1))

    # 5 JSON-LD
    for blk in re.findall(r'<script type="application/ld\+json">(.*?)</script>', raw, re.S):
        try:
            json.loads(blk)
        except Exception as e:
            add("error", "jsonld", str(e)[:80])

    # 6 broken links
    for h in re.findall(r'href="([^"]+)"', raw):
        if h.startswith(("http", "mailto", "tel", "//")):
            continue
        fp, _, frag = h.partition("#")
        fp = fp.split("?")[0]
        tgt = (f if not fp else (f.parent / fp)).resolve()
        if fp and not tgt.exists():
            add("error", "link", f"{h} -> missing file")
            continue
        if frag and tgt.suffix == ".html":
            if f'id="{frag}"' not in tgt.read_text(encoding="utf-8", errors="ignore"):
                add("error", "anchor", f"{h} -> missing anchor")

    # 7 (removed in Round 4: inter-page links intentionally open in a new tab, see rule 17)

    # 8 visible [NEEDS
    if "[NEEDS" in vis:
        add("error", "needs", "visible [NEEDS placeholder")

    # 9 banned phrases
    body = text_of(raw)
    for pat in BANNED:
        for mm in re.finditer(pat, body, re.I):
            ctx = body[max(0, mm.start() - 60): mm.end() + 60]
            if "business hour" in ctx.lower() and "review window" in ctx.lower():
                continue
            if "incident" in ctx.lower():
                continue
            if re.search(r"no ROI figures|not ROI|without ROI", ctx, re.I):
                continue
            add("error", "banned", f"{pat} :: {ctx.strip()[:90]}")

    # 10 facts
    pods = {p["name"]: p for p in FACTS["pods"]["priced"]}
    if "8,000" in body:
        # a scoped pod must never carry a monthly price; ranges in market comparisons are not ours
        for mm in re.finditer(r"(?<![\u2013\-0-9,])\$8,000\s*/?\s*month", body):
            add("error", "fact-price", "scoped pod priced at $8,000/month")
    for name, p in pods.items():
        money = f"${p['price']:,}"
        if rel.startswith("solutions/") and name.split()[0].lower() in rel:
            if money not in body:
                add("error", "fact-price", f"{name} page missing {money}")
            if str(p["credits"]) not in body:
                add("error", "fact-credits", f"{name} page missing {p['credits']} credits")
    for mm in re.finditer(r"\$(\d[\d,]*)\s*(?:a|per)\s*credit", body, re.I):
        if mm.group(1) != "25":
            add("error", "fact-rate", mm.group(0))
    if "60 credits" in body and "$1,500" not in body:
        add("error", "fact-pilot", "pilot credits without $1,500")
    if rel in ("pilot.html", "pricing.html", "index.html"):
        if "$1,500" not in body or "60 credits" not in body:
            add("error", "fact-pilot", "pilot page must state $1,500 and 60 credits")
    for bad_geo in ["US, UK, UAE and Singapore", "US, UK, UAE, ANZ and EU"]:
        if bad_geo in body:
            add("error", "fact-geography", bad_geo)
    if "Singapore" in body and "delivery partner" not in body and "delivery partners" not in body:
        add("warn", "fact-geography", "Singapore mentioned without 'delivery partner'")

    # 11b social image must resolve at 1200x630
    og = re.search(r'property="og:image" content="https://(?:quantocos\.com|rakeshpasupuleati11-bot\.github\.io/quantocos-website)/([^"]+)"', raw)
    if not og:
        add("error", "og-image", "missing og:image")
    else:
        if not (ROOT / og.group(1)).exists():
            add("error", "og-image", f"file not found: {og.group(1)}")
        w = re.search(r'og:image:width" content="(\d+)"', raw)
        h = re.search(r'og:image:height" content="(\d+)"', raw)
        if not w or not h or (w.group(1), h.group(1)) != ("1200", "630"):
            add("error", "og-image", "og:image width/height must be 1200x630")
        if 'og:image:alt' not in raw:
            add("warn", "og-image", "missing og:image:alt")
    for pat in (r'property="og:title" content="([^"]*)"', r'name="twitter:title" content="([^"]*)"'):
        mm = re.search(pat, raw)
        if mm and title and mm.group(1) != title:
            add("error", "og-sync", "og/twitter title differs from <title>")

    # 14 accessibility basics
    if not re.search(r'<html[^>]+lang="', raw, re.I):
        add("error", "a11y", "html element without lang")
    if raw.count("<main") != 1:
        add("error", "a11y", f"{raw.count('<main')} main landmarks")
    if 'class="skip-link"' not in raw:
        add("error", "a11y", "no skip-to-content link")
    for tag in re.findall(r"<a\b[^>]*>.*?</a>", raw, re.S):
        inner = re.sub(r"<[^>]+>", "", tag).strip()
        if not inner and "aria-label" not in tag:
            add("error", "a11y", "link without accessible name")
    for tag in re.findall(r"<button\b[^>]*>.*?</button>", raw, re.S):
        inner = re.sub(r"<[^>]+>", "", tag).strip()
        if not inner and "aria-label" not in tag:
            add("error", "a11y", "button without accessible name")
    prev = 0
    for lvl in [int(x) for x in re.findall(r"<h([1-6])[^>]*>", raw)]:
        if prev and lvl > prev + 1:
            add("error", "a11y", f"heading jump h{prev} to h{lvl}")
        prev = lvl

    # 15 JSON-LD required fields
    REQ = {"Organization": ["name", "url"], "ProfessionalService": ["name"],
           "Product": ["name", "offers"], "FAQPage": ["mainEntity"],
           "BreadcrumbList": ["itemListElement"], "WebPage": ["name", "url"],
           "WebSite": ["url", "name"], "Article": ["headline"], "Service": ["name"]}

    def walk(node):
        if isinstance(node, dict):
            t = node.get("@type")
            for tt in ([t] if isinstance(t, str) else (t or [])):
                need = REQ.get(tt)
                if need:
                    miss = [k for k in need if k not in node]
                    if miss:
                        add("error", "jsonld-fields", f"{tt} missing {','.join(miss)}")
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for v in node:
                walk(v)

    for blk in re.findall(r'<script type="application/ld\+json">(.*?)</script>', raw, re.S):
        try:
            walk(json.loads(blk))
        except Exception:
            pass


    # 16 motion contract
    if "assets/js/motion.js" not in raw:
        add("error", "motion", "motion.js not included")
    if raw.count("data-reveal") < 3:
        add("error", "motion", f"{raw.count('data-reveal')} reveal targets (need 3+)")
    if "data-scroll-progress" not in raw:
        add("error", "motion", "no scroll progress bar")

    # 17 new-tab contract: internal links stay in the same tab; external links
    # open in a new one and must carry rel="noopener noreferrer"
    for tag in re.findall(r"<a\b[^>]*>", raw):
        h = re.search(r'href="([^"]*)"', tag)
        if not h: continue
        u = h.group(1)
        if not u or u.startswith(("#", "mailto:", "tel:", "javascript:")): continue
        ext = u.startswith(("http://", "https://", "//")) and "quantocos.com" not in u
        if ext:
            if 'target="_blank"' in tag and ("noopener" not in tag or "noreferrer" not in tag):
                add("error", "new-tab", f"external link needs rel noopener noreferrer: {u[:50]}")
        elif 'target="_blank"' in tag:
            add("error", "new-tab", f"internal link must not open a new tab: {u[:50]}")

    # 12 images
    for tag in re.findall(r"<img\b[^>]*>", raw):
        miss = [a for a in ("alt=", "width=", "height=") if a not in tag]
        if miss:
            add("error", "img", f"missing {','.join(miss)} :: {tag[:70]}")


def main() -> int:
    issues, all_titles, all_descs = [], {}, {}
    check_routes(issues)
    count = 0
    for f, rel in pages():
        check_page(f, rel, all_titles, all_descs, issues)
        count += 1
    for title, rels in all_titles.items():
        if title and len(rels) > 1:
            for r in rels[1:]:
                issues.append({"page": r, "sev": "error", "rule": "duplicate-title", "detail": title})
    for desc, rels in all_descs.items():
        if desc and len(rels) > 1:
            for r in rels[1:]:
                issues.append({"page": r, "sev": "error", "rule": "duplicate-description", "detail": desc[:70]})

    drift = subprocess.run([sys.executable, str(ROOT / "build.py"), "--check"], capture_output=True, text=True)
    if drift.returncode != 0:
        issues.append({"page": "(chrome)", "sev": "error", "rule": "nav-footer-drift", "detail": drift.stdout.strip()[:300]})

    errors = [i for i in issues if i["sev"] == "error"]
    warns = [i for i in issues if i["sev"] == "warn"]
    if "--audit" in sys.argv:
        lines = ["# AUDIT.md — full-site audit", "",
                 f"Pages checked: {count}. Errors: {len(errors)}. Warnings: {len(warns)}.", "",
                 "Severity order: errors first, then warnings. Nothing here is a design or motion change.",
                 "", "| # | Severity | Page | Rule | Detail |", "|---|---|---|---|---|"]
        for i, it in enumerate(sorted(issues, key=lambda x: (SEV[x["sev"]], x["page"], x["rule"])), 1):
            lines.append(f"| {i} | {it['sev']} | {it['page']} | {it['rule']} | {it['detail'].replace('|','/')} |")
        (ROOT / "AUDIT.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
        print("wrote AUDIT.md")

    for it in sorted(issues, key=lambda x: (SEV[x["sev"]], x["page"])):
        print(f"[{it['sev']:5s}] {it['page']:38s} {it['rule']:18s} {it['detail'][:110]}")
    print(f"\n{count} pages · {len(errors)} errors · {len(warns)} warnings")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
