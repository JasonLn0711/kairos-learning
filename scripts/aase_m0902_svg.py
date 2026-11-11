"""Export two reviewed handoff figures in both languages from lesson data."""
import json,sys
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[]
 def text(value,x,y,width=44,bold=False):
  for line in wrap(value,width):
   out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
  return y
 y=text(f['caption'],36,42,bold=True)+24
 if n==2:
  y=text('0 / 8',36,y);out.append(f'<rect x="36" y="{y-14}" width="968" height="6" fill="#d9dfe2"/>');y+=24
 for i,item in enumerate(f['items']):
  if n==1:
   y=text(item['title'],64,y,42,True);y=text(item['body'],64,y+8,42)+16
   if i<3:out.append(f'<path d="M520 {y}v24m-6-6 6 6 6-6" fill="none" stroke="#59666e" stroke-width="2"/>');y+=48
  else:
   out.append(f'<rect x="36" y="{y-19}" width="18" height="18" rx="3" fill="white" stroke="#64748b"/>');y=text(item['title'],76,y,41)+16
 if n==2:y=text('重新檢查（靜態圖）'if lang=='zh'else'Reset review (static image)',36,y)+20
 y=text(f['description'],36,y+12)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter());assert len(svg.encode())<100000
 return svg.encode()
if __name__=='__main__':
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m09-c02.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in ['cards','flow']];assert [len(f['items'])for f in figures]==[4,8]
  for n,f in enumerate(figures,1):
   dest=ROOT/f'site/images/aase/m09-02-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert dest.read_bytes()==data
   else:dest.write_bytes(data)
 print('PASS: four constrained handoff SVG exports synchronized.')
