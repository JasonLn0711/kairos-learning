"""Export both acceptance figures from the same constrained lesson data."""
import json,sys
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f):
 out=[]
 def text(value,y,bold=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,42):
    out.append(f'<text x="48" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
  return y
 y=text(f['caption'],40,True)+20
 for i,item in enumerate(f['items']):
  start=len(out);out.append('');top=y
  y=text((f'{i+1}. 'if f['kind']=='flow'else '')+item['title'],y+36,True)+8
  y=text(item['body'],y)+18
  fill='#eaf3f0'if f['kind']=='flow'and i==3 else '#fbfcfc'
  out[start]=f'<rect x="24" y="{top}" width="1012" height="{y-top}" rx="14" fill="{fill}" stroke="#a6b8b4"/>'
  if f['kind']=='flow'and i<len(f['items'])-1:
   out.append(f'<path d="M530 {y+8}v28m-7-7 7 7 7-7" fill="none" stroke="#526367" stroke-width="2"/>');y+=48
  else:y+=18
 y=text(f['description'],y+18)+20
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1060" height="{y}" fill="#fbfcfc"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 tree=ET.fromstring(svg);assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter());assert len(svg.encode())<100000
 return svg.encode()
def main():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m09-c03.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in ['flow','cards']];assert [len(f['items'])for f in figures]==[5,3]
  for n,f in enumerate(figures,1):
   out=ROOT/f'site/images/aase/m09-03-{n}-{lang}.svg';data=render(f)
   if '--check'in sys.argv:assert out.read_bytes()==data
   else:out.write_bytes(data)
 print('PASS: four constrained acceptance SVG exports synchronized')
if __name__=='__main__':main()
