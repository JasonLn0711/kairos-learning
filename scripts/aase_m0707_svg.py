"""Export four fixed debugging figures from the published bilingual model."""
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
 def box(item,x,y,w):
  start=len(out);out.append('');end=text(item['title'],x+20,y+36,(w-40)/22,True)+8;end=text(item['body'],x+20,end,(w-40)/22)+14
  out[start]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y}" rx="14" fill="#fbfcfd" stroke="#64748b"/>'
  return end
 y=text(f['caption'],36,42,44,True)+18
 if n==1:
  for row in range(3):
   ends=[]
   for col in range(2):
    i=row*2+col;item=f['items'][i];ends.append(box(dict(title=f'{i+1:02}  '+item['title'],body=item['body']),36+col*510,y,478))
   y=max(ends)+20
 elif n==2:
  y=box(f['items'][0],36,y,988)+20
  y=box(f['items'][1],36,y,988)+20
  y=max(box(f['items'][2],36,y,478),box(f['items'][3],546,y,478))+20
  for item in f['items'][4:]:y=box(item,36,y,988)+20
 elif n==3:
  end=[]
  for i,item in enumerate(f['items']):
   x=36+i*350;end.append(box(item,x,y,288))
   if i<2:out.append(f'<path d="M{x+300} {y+65}h30m-7-7 7 7-7 7" fill="none" stroke="#475569" stroke-width="2"/>')
  y=max(end)+24
 else:
  for item in f['items']:y=box(item,36,y,988)+16
 y=text(f['description'],36,y+16,44)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1060" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter())
 assert len(svg.encode())<100000
 return svg.encode()
def main():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m07-c07.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in ['cards','flow']];assert [len(f['items'])for f in figures]==[6,6,3,4]
  for n,f in enumerate(figures,1):
   dest=ROOT/f'site/images/aase/m07-07-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert dest.read_bytes()==data,f'outdated {dest}'
   else:dest.write_bytes(data)
 print('PASS: eight constrained SVG exports synchronized.')
if __name__=='__main__':main()
