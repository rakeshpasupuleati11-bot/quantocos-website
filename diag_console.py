import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright
ROOT = Path(__file__).resolve().parent

CONTRAST = r"""(()=>{function lum(c){const[r,g,b]=c.map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b}
function parse(s){const m=s.match(/[\d.]+/g);return m?m.slice(0,4).map(Number):null}
function bg(el){let n=el;while(n&&n!==document.documentElement){const cs=getComputedStyle(n);if(cs.backgroundImage!=='none')return null;const b=parse(cs.backgroundColor);if(b&&(b[3]===undefined||b[3]>.9))return b;n=n.parentElement}return[255,255,255]}
const o=[];document.querySelectorAll('p,h1,h2,h3,h4,li,a,span,summary,button,td,th,small,b').forEach(el=>{const t=(el.textContent||'').trim();
if(!t||el.children.length||el.classList.contains('sr-only'))return;const cs=getComputedStyle(el);
if(cs.visibility==='hidden'||cs.display==='none'||parseFloat(cs.opacity)<0.95)return;
const f=parse(cs.color),b=bg(el);if(!f||!b)return;const r=(Math.max(lum(f.slice(0,3)),lum(b.slice(0,3)))+.05)/(Math.min(lum(f.slice(0,3)),lum(b.slice(0,3)))+.05);
const size=parseFloat(cs.fontSize),bold=parseInt(cs.fontWeight)>=600;const need=(size>=24||(size>=18.66&&bold))?3:4.5;
if(r<need)o.push([el.tagName,(el.className||'').toString().slice(0,30),+r.toFixed(2),cs.color,'rgb('+b.slice(0,3)+')',t.slice(0,40)]);});
return o;})()"""

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        pg = await b.new_page(viewport={"width": 1440, "height": 900})
        errs = []
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
        await pg.goto("file:///" + str(ROOT / "index.html").replace("\\", "/"))
        await pg.wait_for_timeout(1500)
        print("console errors:", len(errs), "| unique:", len(set(errs)))
        for u in list(dict.fromkeys(errs))[:8]:
            print("  -", u[:160])
        print("contrast:", json.dumps(await pg.evaluate(CONTRAST)))
        await b.close()

asyncio.run(main())
