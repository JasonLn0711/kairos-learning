"""Export the three fixed verification diagrams from the lesson's shared data."""
import json,sys
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[]
 def text(value,x,y,w,bold=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,w/22):
    out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
  return y
 def box(item,x,y,w):
  start=len(out);out.append('');end=text(item['title'],x+20,y+36,w-40,True)+8;end=text(item['body'],x+20,end,w-40)+16
  out[start]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y}" rx="12" fill="#ffffff" stroke="#64748b"/>'
  return end
 def arrow(y):out.append(f'<path d="M530 {y}v24m-7-7 7 7 7-7" fill="none" stroke="#53636d" stroke-width="2"/>')
 y=text(f['caption'],36,42,988,True)+16
 if n==1:
  y=box(f['items'][0],36,y,988);arrow(y+10);y+=52
  for a,b in [(1,2),(3,4)]:
   y=max(box(f['items'][a],36,y,482),box(f['items'][b],542,y,482))+16
  y=box(f['items'][5],36,y,988)+28
 else:
  for i,item in enumerate(f['items']):
   y=box(item,36,y,988)
   if n==3 and i<len(f['items'])-1:arrow(y+10);y+=52
   else:y+=20
 y=text(f['description'],36,y+12,988)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1060" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter());assert len(svg.encode())<100000
 return svg.encode()
def main():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m08-c01.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in['cards','flow']];assert [len(f['items'])for f in figures]==[6,3,4]
  for n,f in enumerate(figures,1):
   path=ROOT/f'site/images/aase/m08-01-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert path.read_bytes()==data
   else:path.write_bytes(data)
 print('PASS: six constrained SVG exports synchronized with the bilingual lesson')
if __name__=='__main__':main()
