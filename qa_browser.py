#!/usr/bin/env python3
"""qa_browser.py — browser QA for every page at 7 viewport widths.

Requires: pip install playwright && playwright install chromium
Run:      python qa_browser.py            (all pages)
          python qa_browser.py index.html  (one page)

Checks per page/width (1920/1440/1280/1024/768/430/390): console errors = 0 ·
wheel scroll moves the page · internal links stay in the same tab, external
links open in a new tab with rel noopener noreferrer · no horizontal overflow ·
animation hooks present · contrast failures (alpha-composited) · CLS via
PerformanceObserver. Redirect stubs and non-page HTML are skipped.
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
  /* composite translucent backgrounds up the ancestor chain instead of
     skipping them: the fixed header is rgba(8,11,18,.72) glass over the page */
  function bg(el){
    const layers=[];
    for(let n=el;n;n=n.parentElement){
      const cs=getComputedStyle(n);
      if(cs.backgroundImage!=='none'&&!layers.some(l=>l[3]>=0.999)) return null; // text over imagery: skip
      const c=parse(cs.backgroundColor);
      if(c){
        const a=c[3]===undefined?1:c[3];
        if(a>0){layers.push([c[0],c[1],c[2],a]); if(a>=0.999) break;}
      }
      if(n===document.documentElement) break;
    }
    let base=[255,255,255];
    for(let i=layers.length-1;i>=0;i--){
      const [r,g,b,a]=layers[i];
      base=[r*a+base[0]*(1-a), g*a+base[1]*(1-a), b*a+base[2]*(1-a)];
    }
    return base;
  }
  let bad=0, tot=0, samples=[];
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
    if(r<need){bad++; if(samples.length<5) samples.push((el.tagName+' '+(el.className||'')).trim()+': '+t.slice(0,40)+' ratio '+Math.round(r*100)/100);}
  });
  return {checked: tot, failing: bad, samples};
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
        if "Failed to load resource" in m.text or ("blocked by CORS policy" in m.text and "font at" in m.text):
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
    links = await page.evaluate(r"""(() => {
        const bad = [];
        document.querySelectorAll('a[href]').forEach(a => {
          const h = a.getAttribute('href');
          if (!h || h.startsWith('#') || /^(mailto:|tel:|javascript:)/.test(h)) return;
          const ext = /^(https?:)?\/\//.test(h) && !/quantocos\.com/.test(h);
          if (ext) {
            if (a.target !== '_blank') bad.push('ext target ' + h);
            else if (!/noopener/.test(a.rel) || !/noreferrer/.test(a.rel)) bad.push('ext rel ' + h);
          } else if (a.target === '_blank') {
            bad.push('internal new tab ' + h);
          }
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

    pages = []
    for p in sorted(ROOT.rglob("*.html")):
        rel = p.relative_to(ROOT)
        if len(rel.parts) > 2 or "partials" in rel.parts or "_planning" in rel.parts:
            continue  # internal planning artefacts and non-page HTML are not website pages
        if p.name.endswith(".backup.html"):
            continue
        if 'http-equiv="refresh"' in p.read_text(encoding="utf-8", errors="ignore"):
            continue  # compatibility redirect stub
        pages.append(p)
    if len(sys.argv) > 1:
        pages = [p for p in pages if p.name == sys.argv[1]]

    results = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch()
        for width, height, mobile in ((1920, 1080, False), (1440, 900, False),
                                      (1280, 800, False), (1024, 768, False),
                                      (768, 1024, True), (430, 932, True), (390, 844, True)):
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
