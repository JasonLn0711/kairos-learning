"""Export four fixed validation diagrams from the validated lesson model."""
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
 def box(item,x,y,w,fill='#fbfcfd'):
  start=len(out);out.append('');end=text(item['title'],x+20,y+36,(w-40)/22,True)+8;end=text(item['body'],x+20,end,(w-40)/22)+14
  out[start]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y}" rx="14" fill="{fill}" stroke="#64748b"/>'
  return end
 def arrow(x,y):out.append(f'<path d="M{x} {y}v25m-7-7 7 7 7-7" fill="none" stroke="#59666e" stroke-width="2"/>')
 y=text(f['caption'],36,40,44,True)+20
 if n==1:
  for i,item in enumerate(f['items'][:2]):
   y=box(item,36,y,988)
   if i==0:arrow(530,y+8)
   y+=52
  ends=[box(item,36+i*510,y,478,'#fff5f5' if i==0 else '#f1faf5') for i,item in enumerate(f['items'][2:])]
  for x in [275,785]:arrow(x,y-40)
  y=max(ends)+24
 else:
  for i,item in enumerate(f['items']):
   y=box(item,36,y,988,'#fff5f5' if n==4 and i==3 else '#fbfcfd')
   if n==4 and i<len(f['items'])-1:arrow(530,y+8);y+=52
   else:y+=24
 if n==2:
  y=text('靜態預設：尚未檢查。啟用網頁互動以檢查或重設。' if lang=='zh' else 'Static default: not checked. Use the page to check or reset.',36,y+12,44)+24
 y=text(f['description'],36,y+12,44)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1060" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter())
 assert len(svg.encode())<100000
 return svg.encode()
def main():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m07-c04.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind'] in ['cards','flow']];assert [len(f['items'])for f in figures]==[4,3,3,4]
  for n,f in enumerate(figures,1):
   dest=ROOT/f'site/images/aase/m07-04-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert dest.read_bytes()==data,f'outdated {dest}'
   else:dest.write_bytes(data)
 print('PASS: eight constrained SVG exports synchronized.')
if __name__=='__main__':main()
