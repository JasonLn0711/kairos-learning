"""Render the constrained M03-03 scan model; legacy evidence figure stays available."""
from pathlib import Path
from html import escape
import json,sys,textwrap
ROOT=Path(__file__).resolve().parents[1]
models=json.loads((ROOT/'src/lib/m0303-scan-diagrams.json').read_text())
assert len(models)==8
for src,m in models.items():
 assert m['layout'] in ['connect','syn','udp','positions']
 assert len(m['rows'])==(4 if m['layout']=='udp' else 3)
 assert [r['direction'] for r in m['rows']]==(['right','left','right'] if m['layout'] in ['connect','syn'] else ['none']*4 if m['layout']=='udp' else ['right']*3)
 zh=src.endswith('-zh.svg');y=32;o=[]
 def line(t,x=24,size=16):
  global y
  o.append(f'<text x="{x}" y="{y}" font-family="Noto Sans CJK TC,sans-serif" font-size="{size}" fill="#172b49">{escape(t)}</text>');y+=26
 def paragraph(t,size=16):
  for s in textwrap.wrap(t,width=30 if zh else 63,break_long_words=False):line(s,size=size)
 paragraph(m['caption'],18);y+=10;paragraph(m['description']);y+=12
 if m['layout'] in ['connect','syn']:
  line(m['labels'][0]);y-=26;line(m['labels'][1],440);y+=8
 for i,r in enumerate(m['rows']):
  start=y;parts=textwrap.wrap(r['body'],width=30 if zh else 63,break_long_words=False);height=70+len(parts)*26
  color=['#ecfaf4','#fff0f0','#f2efff','#fff7df'][i] if m['layout']=='udp' else '#ffffff'
  o.append(f'<rect x="12" y="{start-20}" width="576" height="{height}" rx="14" fill="{color}" stroke="#b7c9df"/>')
  line(r['title'],size=18)
  if r['direction']!='none':
   d=f'M560 {y}H40L50 {y-7}M40 {y}L50 {y+7}' if r['direction']=='left' else f'M40 {y}H560L550 {y-7}M560 {y}L550 {y+7}'
   o.append(f'<path d="{d}" fill="none" stroke="'+('#007d5c' if r['direction']=='left' else '#245ac5')+'" stroke-width="2"/>')
  y+=24
  for s in parts:line(s)
  y=start+height+12
 paragraph(m['footer']);y+=12
 value=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 {y}" role="img" aria-labelledby="title desc"><title id="title">{escape(m["caption"])}</title><desc id="desc">{escape(m["description"])}</desc>'+''.join(o)+'</svg>'
 name=Path(src).name.replace('m03-03-','').replace('-zh.svg','.zh-TW.svg').replace('-en.svg','.en.svg');p=ROOT/'docs/sources/m03-03/figures'/name
 if '--check' in sys.argv:assert p.read_text()==value,str(p)
 else:p.write_text(value)
print('PASS: 8 scan diagrams, constrained layouts and packet directions')
