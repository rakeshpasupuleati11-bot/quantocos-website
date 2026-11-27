#!/usr/bin/env python3
"""build.py — inject the shared chrome (nav, drawer, footer) into every page.

Source of truth: partials/nav.html, partials/drawer.html, partials/footer.html.
These are extracted from index.html, so the homepage is the reference.

Usage:
    python build.py           # write the partials into every .html page
    python build.py --check   # do not write; exit 1 if any page has drifted

Placeholders inside the partials:
    {{P}}             "" at the site root, "../" one directory down
    {{HOMEPRICING}}   "#pricing" on the homepage, "index.html#pricing" elsewhere
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PARTIALS = ROOT / "partials"
SKIP_NAMES = ("index.backup",)


def pages():
    for f in sorted(ROOT.rglob("*.html")):
        rel = f.relative_to(ROOT)
        if len(rel.parts) > 2 or "partials" in rel.parts:
            continue
        if f.name.startswith(SKIP_NAMES):
            continue
        if f.name.endswith(".backup.html"):
            continue
        yield f, rel


def render(partial: str, prefix: str, home_pricing: str) -> str:
    return partial.replace("{{P}}", prefix).replace("{{HOMEPRICING}}", home_pricing)


def blocks(html: str):
    """Return (start, end) of nav, footer and drawer in a page, or None."""
    out = {}
    try:
        a = html.index('<nav aria-label="Primary">')
        out["nav"] = (a, html.index("</nav>", a) + len("</nav>"))
    except ValueError:
        out["nav"] = None
    try:
        a = html.index("<footer")
        out["footer"] = (a, html.index("</footer>", a) + len("</footer>"))
    except ValueError:
        out["footer"] = None
    try:
        a = html.index('<div class="drawer__body">')
        out["drawer"] = (a, html.index('<div class="drawer__foot">', a))
    except ValueError:
        out["drawer"] = None
    return out


def main(check_only: bool) -> int:
    nav_p = (PARTIALS / "nav.html").read_text(encoding="utf-8").rstrip("\n")
    ftr_p = (PARTIALS / "footer.html").read_text(encoding="utf-8").rstrip("\n")
    dr_p = (PARTIALS / "drawer.html").read_text(encoding="utf-8").rstrip("\n")

    written, drift = [], []
    for f, rel in pages():
        html = f.read_text(encoding="utf-8")
        if 'http-equiv="refresh"' in html:
            continue  # compatibility redirect stub: no shared chrome
        prefix = "../" if len(rel.parts) == 2 else ""
        home_pricing = "#pricing" if rel.as_posix() == "index.html" else f"{prefix}index.html#pricing"
        want = {
            "nav": render(nav_p, prefix, home_pricing),
            "footer": render(ftr_p, prefix, home_pricing),
            "drawer": render(dr_p, prefix, home_pricing),
        }
        out = html
        # replace from the end so earlier offsets stay valid
        spots = blocks(html)
        for key, (a, b) in sorted(
                ((k, v) for k, v in spots.items() if v), key=lambda kv: kv[1][0], reverse=True):
            out = out[:a] + want[key] + out[b:]
        for key in ("drawer", "footer", "nav"):
            if not spots[key]:
                print(f"  ! {rel}: no {key} block found")
        if out != html:
            if check_only:
                drift.append(str(rel))
            else:
                f.write_text(out, encoding="utf-8")
                written.append(str(rel))

    if check_only:
        if drift:
            print(f"DRIFT in {len(drift)} page(s):")
            for d in drift:
                print("  -", d)
            return 1
        print("clean: every page matches partials/")
        return 0
    print(f"updated {len(written)} page(s) from partials/")
    for w in written:
        print("  -", w)
    return 0


if __name__ == "__main__":
    sys.exit(main("--check" in sys.argv))
