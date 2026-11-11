"""Export three fixed TDD relationships from the bilingual lesson model."""
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
   for line in wrap(paragraph,width):
    out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
  return y
 def box(item,x,y,w,i):
  start=len(out);out.append('');end=text(item['title'],x+20,y+36,(w-40)/22,True)+8;end=text(item['body'],x+20,end,(w-40)/22)+14
  fill,stroke=[('#fcf1f2','#c43c46'),('#edf8f2','#16804d'),('#eef4fc','#3477c6')][i]if n!=3 else ('#ffffff','#64748b')
  out[start]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y}" rx="14" fill="{fill}" stroke="{stroke}"/>'
  return end
 def arrow(x,y):out.append(f'<path d="M{x} {y}v25m-7-7 7 7 7-7" fill="none" stroke="#59666e" stroke-width="2"/>')
 y=text(f['caption'],36,40,44,True)+20
 if n==2:
  y=max(box(item,36+i*340,y,308,i)for i,item in enumerate(f['items']))+24
 else:
  top=y
  for i,item in enumerate(f['items']):
   y=box(item,36,y,900 if n==1 else 988,i)
   if i<len(f['items'])-1:arrow(486 if n==1 else 530,y+10);y+=60
  if n==1:
   out.append(f'<path d="M936 {y-35}H986Q1010 {y-35} 1010 {y-59}V{top+48}Q1010 {top+24} 986 {top+24}H952m10-8-10 8 10 8" fill="none" stroke="#7c8792" stroke-width="3" stroke-dasharray="8 6"/>')
  y+=30
 y=text(f['description'],36,y+12,44)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1060" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','stroke-dasharray','d'}
 assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter())
 assert len(svg.encode())<100000
 return svg.encode()
def main():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m08-c02.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in ['cards','flow']];assert [(f['kind'],len(f['items']))for f in figures]==[('flow',3),('cards',3),('flow',4)]
  for n,f in enumerate(figures,1):
   dest=ROOT/f'site/images/aase/m08-02-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert dest.read_bytes()==data,f'outdated {dest}'
   else:dest.write_bytes(data)
 print('PASS: six constrained TDD SVG exports synchronized')
if __name__=='__main__':main()
