"""Export five source-model diagrams with fixed, reviewed geometry and escaped text."""
import json,sys
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[];W=1320
 def text(value,x,y,w,bold=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,w/22):
    out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=34
  return y
 def box(i,x,y,w,fill='#ddf3e7'):
  start=len(out);out.append('');end=text(f['items'][i]['title'],x+18,y+36,w-36,True)+6;end=text(f['items'][i]['body'],x+18,end,w-36)+16
  out[start]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y}" rx="16" fill="{fill}" stroke="#85998e"/>'
  return end
 def link(points):
  (px,py),(x,y)=points[-2:];dx=1 if x>px else -1 if x<px else 0;dy=1 if y>py else -1 if y<py else 0
  out.append('<path d="'+' '.join(('M'if i==0 else'L')+f'{a} {b}'for i,(a,b)in enumerate(points))+'" fill="none" stroke="#61736b" stroke-width="2"/>')
  out.append(f'<path d="M{x-dx*10-dy*6} {y-dy*10+dx*6}L{x} {y}L{x-dx*10+dy*6} {y-dy*10-dx*6}" fill="none" stroke="#61736b" stroke-width="2"/>')
 def border(x,y,w,h,label,fill='#f3f5f4'):
  at=len(out);out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="#81958a"/>');text(label,x+16,y+32,w-32,True);return at
 y=text(f['caption'],32,42,W-64,True)+26
 if n==1:
  ends=[]
  for i in range(5):
   x=32+i*258;ends.append(box(i,x,y,224))
   if i<4:link([(x+226,y+62),(x+250,y+62)])
  y=max(ends)+30
 elif n==2:
  y=box(0,410,y,500,'#edf0f3');link([(660,y+5),(660,y+48)]);y+=56
  y=box(1,410,y,500,'#edf0f3');branch=y+34;y+=72;ends=[]
  for i in range(3):
   x=32+i*432;link([(660,branch-28),(660,branch),(x+196,branch),(x+196,y-6)]);ends.append(box(i+2,x,y,392,'#edf0f3'))
  y=max(ends)+30
 elif n==3:
  for i in range(3):
   y=box(i,410,y,500,'#eefaf3'if i==2 else'#ddf3e7')
   if i<2:link([(660,y+5),(660,y+43)]);y+=54
   if i==1:checkY=y-65
  split=y+32;y+=70
  link([(660,split-26),(660,split),(320,split),(320,y-6)]);link([(660,split),(1000,split),(1000,y-6)])
  left=box(3,80,y,480);right=box(5,760,y,480)
  nextY=max(left,right)+54;link([(320,left+5),(320,nextY-8)]);link([(1000,right+5),(1000,nextY-8)])
  left=box(4,80,nextY,480);right=box(6,760,nextY,480)
  link([(78,nextY+45),(28,nextY+45),(28,checkY),(402,checkY)])
  y=max(left,right)+30
 elif n==4:
  y=box(0,410,y,500);link([(660,y+4),(660,y+44)]);y+=54
  y=box(1,410,y,500);branch=y+36;top=y+90
  # Outer host and inner process retain containment before boxes are drawn.
  hostAt=border(32,top,850,100,'Streamlit 執行主機'if lang=='zh'else'Streamlit host')
  procAt=border(56,top+64,802,100,'同一個 Python 程序'if lang=='zh'else'One Python process','#f7fbf8')
  pyY=top+124;pyEnd=box(2,204,pyY,500)
  innerY=pyEnd+64
  a=box(3,80,innerY,360);b=box(4,474,innerY,360)
  for x in [260,654]:
   link([(454,pyEnd+5),(454,pyEnd+28),(x,pyEnd+28),(x,innerY-7)])
   link([(x+14,innerY-6),(x+14,pyEnd+42),(468,pyEnd+42),(468,pyEnd+6)])
  bottom=max(a,b)+24
  out[hostAt]=out[hostAt].replace('height="100"',f'height="{bottom-top+24}"')
  out[procAt]=out[procAt].replace('height="100"',f'height="{bottom-top-64}"')
  fileY=top+124;fileEnd=box(5,930,fileY,358)
  link([(660,branch-30),(660,branch),(454,branch),(454,pyY-8)])
  link([(440,pyY-8),(440,branch+14),(646,branch+14),(646,branch-30)])
  link([(660,branch),(1109,branch),(1109,fileY-8)])
  y=max(bottom+24,fileEnd)+30
 else:
  for i in range(4):
   y=box(i,120,y,1080,'#fbfcfd')
   if i<3:link([(660,y+6),(660,y+40)]);y+=50
  y+=30
 y=text(f['description'],32,y+20,W-64)+26
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="{W}" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter())
 assert len(svg.encode())<100000
 return svg.encode()
def main():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m06-c01.json').read_text())
 for lang in ['zh','en']:
  figs=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in ['flow','cards']];assert [len(f['items'])for f in figs]==[5,5,7,6,4]
  for n,f in enumerate(figs,1):
   dest=ROOT/f'site/images/aase/m06-01-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert dest.read_bytes()==data,f'outdated {dest}'
   else:dest.write_bytes(data)
 print('PASS: ten model-derived, allowlisted SVG files synchronized, each under 100000 bytes.')
if __name__=='__main__':main()
