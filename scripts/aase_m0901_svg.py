"""Export two reviewed figures per language from the official lesson data."""
import json,sys
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,lang):
 out=[]
 def text(value,x,y,width=42,bold=False):
  for line in wrap(value,width):
   out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
  return y
 y=text(f['caption'],36,42,bold=True)+12
 for i,item in enumerate(f['items']):
  parts=item['body'].split('\n');start=len(out);out.append('');top=y
  y=text(('✓ 'if f['kind']=='cards'else'')+item['title'],56,y+36,40,True)
  y=text(parts[0],56,y+4,40)+12
  fill='#ecf3f8'if f['kind']=='flow'and i==1 else'#ebf4f0'if f['kind']=='flow'and i==2 else'#fbfcfd'
  out[start]=f'<rect x="36" y="{top}" width="988" height="{y-top}" rx="14" fill="{fill}" stroke="#b4c5cc"/>'
  if len(parts)==2:
   out.append(f'<path d="M56 {y+12}v24m-6-6 6 6 6-6" fill="none" stroke="#59666e" stroke-width="2"/>')
   y=text(parts[1],86,y+34,38)+14
  else:y+=18
 y=text(f['description'],36,y+28)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1060" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter());assert len(svg.encode())<100000
 return svg.encode()
if __name__=='__main__':
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m09-c01.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in ['flow','cards']];assert [f['kind']for f in figures]==['flow','cards']
  for n,f in enumerate(figures,1):
   dest=ROOT/f'site/images/aase/m09-01-{n}-{lang}.svg';data=render(f,lang)
   if '--check'in sys.argv:assert dest.read_bytes()==data,f'outdated {dest}'
   else:dest.write_bytes(data)
 print('PASS: four constrained Git SVG exports synchronized')
