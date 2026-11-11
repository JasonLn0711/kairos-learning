"""Export fixed default examples from the same lesson data as the HTML."""
import json,sys
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[]
 def text(value,x,y,width=44,bold=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,width):out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
  return y
 def box(item,x,y,w,fill='#ffffff'):
  start=len(out);out.append('');end=text(item['title'],x+20,y+36,(w-40)/22,True)+8;end=text(item['body'],x+20,end,(w-40)/22)+14
  out[start]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y}" rx="12" fill="{fill}" stroke="#64748b"/>'
  return end
 y=text(f['caption'],36,40,44,True)+20
 if n==1:
  for item in f['items'][:3]:
   y=box(item,36,y,988);out.append(f'<path d="M530 {y+8}v25m-7-7 7 7 7-7" fill="none" stroke="#59666e" stroke-width="2"/>');y+=52
  y=max(box(f['items'][3],36,y,480,'#f0f8f3'),box(f['items'][4],544,y,480,'#fff5f5'))+24
 else:
  items=f['items']
  for item in items:y=box(item,36,y,988)+16
  if n==2:y=text('999 < 1000 → 60; 1000 ≥ 1000 → 0',36,y+20)+20
  else:y=text('80 ≤ 80; 81 > 80',36,y+20)+20
 y=text(f['description'],36,y+12,44)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1060" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter())
 assert len(svg.encode())<100000
 return svg.encode()
lesson=json.loads((ROOT/'content/aase/lessons/aase-m08-c03.json').read_text())
for lang in ['zh','en']:
 figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in ['cards','flow']]
 assert [len(f['items'])for f in figures]==[5,3,3]
 for n,f in enumerate(figures,1):
  dest=ROOT/f'site/images/aase/m08-03-{n}-{lang}.svg';data=render(f,n,lang)
  if '--check'in sys.argv:assert dest.read_bytes()==data
  else:dest.write_bytes(data)
print('PASS: six constrained SVG exports synchronized')
