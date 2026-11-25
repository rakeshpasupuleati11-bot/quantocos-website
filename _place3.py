import re

# 1. frame styles (self-contained, used only by these three sections)
css = open('assets/css/site.bundle.css', encoding='utf-8').read()
if '/* home imagery frames */' not in css:
    css += """
/* home imagery frames */
.home-fig{margin:0;position:relative;overflow:hidden;border-radius:18px;aspect-ratio:var(--ar,3 / 2);
  background:#0e1424;border:1px solid rgba(255,255,255,.09);isolation:isolate}
.home-fig img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 34%;
  display:block;filter:saturate(1.04) contrast(1.03)}
.home-fig::after{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;
  background:linear-gradient(180deg,rgba(5,8,15,0) 52%,rgba(5,8,15,.55) 100%)}
.home-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-top:34px}
.home-grid--six{grid-template-columns:repeat(3,1fr)}
@media (max-width:860px){.home-grid--six{grid-template-columns:repeat(2,1fr)}}
@media (max-width:560px){.home-grid--six{grid-template-columns:1fr}}
.band--light .home-fig{border-color:rgba(11,18,32,.12)}
"""
    open('assets/css/site.bundle.css', 'w', encoding='utf-8', newline='').write(css)
    print('frame css added')

s = open('index.html', encoding='utf-8').read()

def fig(slug, alt, ar, w=1200, h=800):
    return ('<figure class="home-fig" style="--ar:%s"><img src="assets/img/home/%s.webp" alt="%s" '
            'loading="lazy" decoding="async" width="%d" height="%d"></figure>' % (ar, slug, alt, w, h))

def insert_grid(sid, items, ar, cols):
    global s
    m = re.search(r'<section[^>]*id="%s"[^>]*>' % re.escape(sid), s)
    if not m:
        print('miss', sid); return
    end = s.find('</section>', m.end())
    grid = '<div class="home-grid %s" aria-label="Illustrative visuals">' % ('home-grid--six' if cols == 6 else '') + \
           ''.join(fig(a, b, ar) for a, b in items) + '</div>\n'
    s = s[:end] + grid + s[end:]
    print('ok', sid, len(items))

insert_grid('pods', [
    ('people-network', 'One manager connected to a named team', '1 / 1'),
    ('ai-agents', 'The AI layer that runs alongside the pod', '1 / 1'),
    ('signed-contract', 'Every deliverable signed off before it ships', '3 / 2'),
], '3 / 2', 3)

insert_grid('services', [
    ('creative-track', 'Creative production', '3 / 2'),
    ('digital-track', 'Digital and growth delivery', '3 / 2'),
    ('strategy-chess', 'Strategy as a single move', '3 / 2'),
    ('interactive-light', 'Interactive and XR work', '3 / 2'),
    ('media-stack', 'Media handled in one place', '3 / 2'),
    ('backoffice-table', 'Back-office support', '3 / 2'),
], '3 / 2', 6)

insert_grid('creative-ads', [
    ('scope-ring', 'Scope drawn as a ring of named specialists', '1 / 1'),
    ('credits-wallet', 'A credit balance visible in the portal', '4 / 3'),
    ('five-stages-roadmap', 'Five gates marked on one calendar', '4 / 5'),
    ('xr-layers', 'Layered screens standing in for XR work', '1 / 1'),
    ('focus-target', 'One target, one owner', '1 / 1'),
    ('process-path', 'A path from brief to delivery', '3 / 4'),
], '3 / 2', 6)

open('index.html', 'w', encoding='utf-8', newline='').write(s)
print('figures:', s.count('class="home-fig"'))
