"""Export four fixed, reviewed diagrams from the bilingual M04-01 lesson model."""
import json,sys
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[]
 def text(value,x,y,width=44,size=20,bold=False):
  for paragraph in value.split('\n\n'):
   for line in wrap(paragraph,width):
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
   y+=8
  return y
 def rect(x,y,w,h,fill='#fbfcfd'):
  return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="#d5dce0"/>'
 def arrow(y):out.append(f'<path d="M520 {y}v24m-7-7 7 7 7-7" fill="none" stroke="#65757c" stroke-width="2"/>')
 def card(item,x,y,w,width):
  index=len(out);out.append('');end=text(item['title'],x+20,y+32,width,21,True);end=text(item['body'],x+20,end+6,width)+8;out[index]=rect(x,y,w,end-y);return end
 y=text(f['caption'],36,44,44,24,True)+16
 if n==1:
  for item in f['items']:
   y=card(item,36,y,968,43)+24
 elif n==2:
  top=y
  for cx,cy,c in [(378,297,'#d9efe1'),(662,297,'#f9dfd9'),(520,472,'#e5dff5')]:out.append(f'<circle cx="{cx}" cy="{top+cy}" r="256" fill="{c}"/>')
  out.append(f'<path d="M350 62C279 110 245 183 245 220c0 58 47 108 105 130 58-22 105-72 105-130 0-37-34-110-105-158Z" transform="translate(47.5 {top}) scale(1.35)" fill="#fbfcfd" stroke="#65757c" stroke-dasharray="5 5"/>')
  positions=[(110,top+220),(740,top+220),(400,top+610),(405,top+360)]
  for item,(x,yy) in zip(f['items'],positions):text(item['title'],x,yy,12,22,True)
  y=top+800
  for item in f['items']:
   y=text(item['title'],36,y,44,21,True);y=text(item['body'],36,y,44)+12
 elif n==3:
  y=card(f['items'][0],36,y,968,43);arrow(y+12);y+=60
  y=max(card(f['items'][1],36,y,472,20),card(f['items'][2],532,y,472,20));arrow(y+12);y+=60
  y=card(f['items'][3],36,y,968,43);arrow(y+12);y+=60
  y=card(f['items'][4],36,y,968,43)+24
 else:
  ends=[]
  for i,item in enumerate(f['items']):
   x=36+i*510;top=y;index=len(out);out.append('');end=text(item['title'],x+20,top+32,19,20)+20
   parts=item['body'].split('\n\n')
   out.append(f'<path d="M{x+31} {end-22}a11 11 0 1 0 0 22a11 11 0 1 0 0-22m-6 11 4 4 7-9" fill="none" stroke="#087337" stroke-width="2"/>')
   end=text(parts[0],x+56,end,16,22,True)+8
   for j,part in enumerate(parts[1:],1):
    if j==(2 if i==0 else 3):
     index2=len(out);out.append('');yy=end-24;end=text(part,x+30,end,18);out[index2]=rect(x+16,yy,428,end-yy+4,'#f0f1f2');end+=24
    else:end=text(part,x+20,end,19)+8
   out[index]=rect(x,top,460,end-top+12);ends.append(end)
  y=max(ends)+40
 y=text(f['description'],36,y,44)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 allowed={'svg','title','desc','rect','circle','g','text','path'}
 attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d','cx','cy','r','transform','stroke-dasharray'}
 assert all(e.tag.split('}')[-1] in allowed and all(k in attrs for k in e.attrib) for e in tree.iter())
 assert len(svg.encode())<100000
 return svg.encode()
def main():
 l=json.loads((ROOT/'content/aase/lessons/aase-m04-c01.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in l['text'][lang]['sections'] for b in s.get('blocks',[]) if b['kind'] in ['cards','flow']];assert [len(f['items'])for f in figures]==[3,4,5,2]
  for n,f in enumerate(figures,1):
   data=render(f,n,lang);out=ROOT/f'site/images/aase/m04-01-{n}-{lang}.svg'
   if '--check' in sys.argv:assert out.read_bytes()==data,f'Outdated: {out}'
   else:out.write_bytes(data)
   print(f'{out.name}: {len(data)} bytes')
if __name__=='__main__':main()
