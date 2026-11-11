"""Export the five specification figures from their bilingual lesson data."""
import json,sys
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[]
 def text(value,x,y,width,bold=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,width):
    out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
  return y
 def box(item,x,y,w,fill='#ffffff',center=False):
  index=len(out);out.append('');end=text(item['title'],x+20,y+36,(w-40)/22,True)+8;end=text(item['body'],x+20,end,(w-40)/22)+12
  out[index]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y}" rx="14" fill="{fill}" stroke="#647681"/>'
  return end
 def arrow(y):out.append(f'<path d="M520 {y}v26m-7-7 7 7 7-7" fill="none" stroke="#53636d" stroke-width="2"/>')
 y=text(f['caption'],32,40,44,True)+16
 if n==1:
  y=box(f['items'][0],32,y,976);arrow(y+8);y+=52
  y=max(box(f['items'][1],32,y,476,'#edf3f8'),box(f['items'][2],532,y,476,'#edf5f2'))+20
  y=box(f['items'][3],32,y,976,'#fbfcfd');arrow(y+8);y+=52
  y=box(f['items'][4],32,y,976)+24
 elif n==2:
  y=max(box(f['items'][0],32,y,476),box(f['items'][1],532,y,476))+24
 else:
  for i,item in enumerate(f['items']):
   if n==5:item=dict(title=f'{i+1}  '+item['title'],body=item['body'])
   y=box(item,32,y,976,'#fbfcfd')+18
 y=text(f['description'],32,y+12,44)+22
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter());assert len(svg.encode())<100000
 return svg.encode()
def main():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m05-c02.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in['cards','flow']];assert [len(f['items'])for f in figures]==[5,2,2,5,5]
  for n,f in enumerate(figures,1):
   dest=ROOT/f'site/images/aase/m05-02-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert dest.read_bytes()==data,f'outdated {dest}'
   else:dest.write_bytes(data)
   print(f'{dest.name}: {len(data)} bytes')
if __name__=='__main__':main()
