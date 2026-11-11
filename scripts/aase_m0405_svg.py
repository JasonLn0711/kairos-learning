"""Export six fixed, reviewed disclosure diagrams from the lesson's paired model."""
import json,sys
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[]
 def text(value,x,y,width,size=20,bold=False):
  for line in wrap(value,width):
   out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
  return y
 def rect(x,y,w,h,fill='#ffffff',stroke='#d4dce1',thickness=1):
  return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="{stroke}" stroke-width="{thickness}"/>'
 def card(item,i,x,top,w):
  start=len(out);out.append('');y=top+38
  special=(n==3 or n==6 and i>=2)
  if special:
   color='#fce1e1' if i%2==0 else '#d9efe1';pos=len(out)
   y=text(item['title'],x+20,y,(w-44)/22,22,True)
   out.insert(pos,rect(x+10,top+10,w-20,y-top-24,color));y+=28
  else:y=text(item['title'],x+20,y,(w-44)/22,22,True)+8
  parts=item['body'].split('\n\n')
  for j,part in enumerate(parts):
   action=(n==1 and part in ['列印','Print'])or(n==5 and j==len(parts)-2)
   if action:
    pos=len(out);y0=y-25;y=text(part,x+26,y,(w-56)/20);out.insert(pos,rect(x+14,y0,w-28,y-y0,'#f0f1f2'));y+=14
   else:y=text(part,x+20,y,(w-44)/20)+10
  bottom=y+6
  out[start]=rect(x,top,w,bottom-top,'#ffffff','#ec874d' if n==2 and i==2 else '#d4dce1',4 if n==2 and i==2 else 1)
  return bottom
 y=text(f['caption'],36,44,40,24,True)+8
 if n==6:
  for i in range(2):
   y=card(f['items'][i],i,36,y,968)
   out.append(f'<path d="M520 {y+10}v24m-7-7 7 7 7-7" fill="none" stroke="#65757c" stroke-width="2"/>');y+=52
  y=max(card(item,i,36+(i-2)*510,y,458)for i,item in enumerate(f['items']) if i>=2)+30
 elif n in [1,3,5]:
  for start in range(0,len(f['items']),2):
   top=y;y=max(card(item,i,36+(i%2)*510,top,458) for i,item in enumerate(f['items']) if start<=i<start+2)+24
 else:
  for i,item in enumerate(f['items']):y=card(item,i,120,y,800)+16
 y=text(f['description'],36,y+20,47)+30
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 tags={'svg','title','desc','rect','g','text','path'}
 attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1] in tags and all(k in attrs for k in e.attrib) for e in tree.iter())
 assert len(svg.encode())<100000
 return svg.encode()
def main():
 l=json.loads((ROOT/'content/aase/lessons/aase-m04-c05.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in l['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']=='cards'];assert [len(f['items'])for f in figures]==[2,3,2,3,4,4]
  for n,f in enumerate(figures,1):
   target=ROOT/f'site/images/aase/m04-05-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert target.read_bytes()==data,f'Outdated: {target}'
   else:target.write_bytes(data)
   print(f'{target.name}: {len(data)} bytes')
if __name__=='__main__':main()
