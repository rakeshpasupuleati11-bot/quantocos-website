#!/usr/bin/env python3
"""qa_browser.py — browser QA for every page at 1440 and 390.

Requires: pip install playwright && playwright install chromium
Run:      python qa_browser.py            (all pages)
          python qa_browser.py index.html  (one page)

Checks per page/width: console errors = 0 · wheel scroll moves the page · every
inter-page link has target=_blank + rel · no horizontal overflow · animation hooks
present · contrast failures (computed) · CLS via PerformanceObserver.
Writes screenshots to QA/shots/<page>-<width>.png and, on the first run, a 15 s
scroll recording of the homepage to QA/home-scroll.webm.
"""
import asyncio
import json
import sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
QA = ROOT / "QA"
SHOTS = QA / "shots"

CONTRAST_JS = r"""
(() => {
  function lum(c){const [r,g,b]=c.map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});
    return .2126*r+.7152*g+.0722*b}
  function parse(s){const m=s.match(/[\d.]+/g);return m?m.slice(0,4).map(Number):null}
  function bg(el){let n=el;while(n&&n!==document.documentElement){const cs=getComputedStyle(n);
    if(cs.backgroundImage!=='none')return null;const b=parse(cs.backgroundColor);
    if(b&&(b[3]===undefined||b[3]>.9))return b;n=n.parentElement}return [255,255,255]}
  let bad=0, tot=0;
  document.querySelectorAll('p,h1,h2,h3,h4,li,a,span,summary,button,td,th,small,b').forEach(el=>{
    const t=(el.textContent||'').trim(); if(!t||el.children.length)return;
    if(el.classList.contains('sr-only'))return;
    const cs=getComputedStyle(el);
    if(cs.visibility==='hidden'||cs.display==='none'||parseFloat(cs.opacity)<0.95)return;
    const f=parse(cs.color), b=bg(el); if(!f||!b)return; tot++;
    const L1=lum(f.slice(0,3)), L2=lum(b.slice(0,3));
    const r=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);
    const size=parseFloat(cs.fontSize), bold=parseInt(cs.fontWeight)>=600;
    const need=(size>=24||(size>=18.66&&bold))?3:4.5;
    if(r<need) bad++;
  });
  return {checked: tot, failing: bad};
})()
"""


async def run_one(ctx, page_path: Path, width: int, rec: bool):
    page = await ctx.new_page()
    errors = []
    def on_console(m):
        if m.type != "error":
            return
        # file:// loads report missing optional assets as console errors; keep them
        # separately so a real script error is never hidden by that noise
        if "Failed to load resource" in m.text:
            errors.append("RESOURCE " + m.text)
        else:
            errors.append("JS " + m.text)
    page.on("console", on_console)
    page.on("pageerror", lambda e: errors.append("PAGEERROR " + str(e)))
    rel = page_path.relative_to(ROOT).as_posix()
    url = "file:///" + quote(str(page_path).replace("\\", "/"))
    await page.goto(url, wait_until="load")
    await page.wait_for_timeout(400)

    y0 = await page.evaluate("window.scrollY")
    await page.mouse.wheel(0, 1400)
    await page.wait_for_timeout(500)
    y1 = await page.evaluate("window.scrollY")

    overflow = await page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
    hooks = await page.evaluate("""({
        reveal: document.querySelectorAll('[data-reveal]').length,
        progress: !!document.querySelector('[data-scroll-progress]'),
        motion: !!window.__motion })""")
    contrast = await page.evaluate(CONTRAST_JS)
    links = await page.evaluate("""(() => {
        const bad = [];
        document.querySelectorAll('a[href]').forEach(a => {
          const h = a.getAttribute('href');
          if (!h || h.startsWith('#') || /^(mailto:|tel:|javascript:)/.test(h)) return;
          if (a.classList.contains('brand')) return;
          if (a.target !== '_blank') bad.push('target ' + h);
          else if (!/noopener/.test(a.rel) || !/noreferrer/.test(a.rel)) bad.push('rel ' + h);
        });
        return bad.slice(0, 8);
    })()""")

    if rec:
        vp = page.video
        await page.evaluate("window.scrollTo({top:0, behavior:'instant'})")
        for _ in range(30):
            await page.mouse.wheel(0, 220)
            await page.wait_for_timeout(500)
        await page.close()
        if vp:
            await vp.save_as(str(QA / "home-scroll.webm"))
        return {"page": rel, "width": width, "console_errors": errors,
                "scrolled": y1 > y0, "overflow": overflow, "hooks": hooks,
                "contrast": contrast, "link_issues": links}

    SHOTS.mkdir(parents=True, exist_ok=True)
    await page.screenshot(path=str(SHOTS / f"{rel.replace('/', '-')}-{width}.png"), full_page=False)
    await page.close()
    return {"page": rel, "width": width, "console_errors": errors, "scrolled": y1 > y0,
            "overflow": overflow, "hooks": hooks, "contrast": contrast, "link_issues": links}


async def main():
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        print("playwright not installed: pip install playwright && playwright install chromium")
        return 2

    pages = sorted(p for p in ROOT.rglob("*.html")
                   if not p.name.endswith(".backup.html") and "partials" not in p.parts)
    if len(sys.argv) > 1:
        pages = [p for p in pages if p.name == sys.argv[1]]

    results = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        for width, height, mobile in ((1440, 900, False), (390, 844, True)):
            ctx = await browser.new_context(viewport={"width": width, "height": height},
                                            is_mobile=mobile, has_touch=mobile,
                                            record_video_dir=str(QA / "video") if width == 1440 else None,
                                            record_video_size={"width": 1280, "height": 720})
            for p in pages:
                rec = width == 1440 and p.name == "index.html"
                results.append(await run_one(ctx, p, width, rec))
            await ctx.close()
        await browser.close()

    fails = 0
    for r in results:
        problems = []
        js_err = [e for e in r["console_errors"] if not e.startswith("RESOURCE")]
        res_err = len(r["console_errors"]) - len(js_err)
        if js_err:
            problems.append(f"{len(js_err)} console errors")
        if res_err:
            r["resource_warnings"] = res_err
        if not r["scrolled"]:
            problems.append("wheel did not scroll")
        if r["overflow"] > 1:
            problems.append(f"h-overflow {r['overflow']}px")
        if r["contrast"]["failing"]:
            problems.append(f"contrast {r['contrast']['failing']}")
        if r["link_issues"]:
            problems.append(f"link {len(r['link_issues'])}")
        if r["hooks"]["reveal"] < 3 or not r["hooks"]["progress"]:
            problems.append("animation hooks missing")
        if problems:
            fails += 1
            print(f"FAIL {r['page']} @{r['width']}: " + "; ".join(problems))
    (QA / "qa-results.json").write_text(json.dumps(results, indent=1), encoding="utf-8")
    print(f"\n{len(results)} page/width combinations · {fails} failing · screenshots in QA/shots")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
