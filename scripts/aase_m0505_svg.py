"""Export the two fixed OpenSpec figures from their validated lesson data."""
import json,sys
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[];width=1440 if n==1 else 1060
 def text(value,x,y,available,bold=False):
  for para in value.split('\n'):
   for line in wrap(para,available/22):
    out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
  return y
 def box(item,x,y,w):
  start=len(out);out.append('');end=text(item['title'],x+20,y+38,w-40,True)+8;end=text(item['body'],x+20,end,w-40)+18
  out[start]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y}" rx="14" fill="#ffffff" stroke="#7da6a9"/>'
  return end
 y=text(f['caption'],36,42,width-72,True)+22
 if n==1:
  ends=[]
  for i,item in enumerate(f['items']):
   x=36+i*468;ends.append(box(item,x,y,432))
   if i<2:out.append(f'<path d="M{x+439} {y+64}h22m-7-7 7 7-7 7" fill="none" stroke="#386d72" stroke-width="2"/>')
  y=max(ends)+48
 else:
  for i,item in enumerate(f['items']):
   y=box(item,36,y,width-72)
   if i<4:out.append(f'<path d="M530 {y+8}v24m-7-7 7 7 7-7" fill="none" stroke="#386d72" stroke-width="2"/>')
   y+=50
 y=text('↶ 下一次變更：回到規劃與釐清問題'if lang=='zh'else'↶ Next change: return to planning and exploration',36,y,width-72)+24
 y=text(f['description'],36,y,width-72)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="{width}" height="{y}" fill="#f5faf9"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#182f32">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter());assert len(svg.encode())<100000
 return svg.encode()
def main():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m05-c05.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']=='flow'];assert [len(f['items'])for f in figures]==[3,5]
  for n,f in enumerate(figures,1):
   dest=ROOT/f'site/images/aase/m05-05-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert dest.read_bytes()==data,f'outdated {dest}'
   else:dest.write_bytes(data)
 print('PASS: four constrained SVG exports synchronized.')
if __name__=='__main__':main()
