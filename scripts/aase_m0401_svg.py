"""Export the three reviewed HCI figures from the same bilingual lesson model."""
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
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=34
   y+=8
  return y
 def rect(x,y,w,h,fill='#fbfcfd'):
  return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="#d5dce0"/>'
 def check(x,y):out.append(f'<path d="M{x+11} {y}a11 11 0 1 0 0 22a11 11 0 1 0 0-22m-6 11 4 4 7-9" fill="none" stroke="#087337" stroke-width="2"/>')
 y=text(f['caption'],36,44,44,24,True)+16
 if n==1:
  top=y-25;start=len(out);ends=[]
  for i,item in enumerate(f['items']):
   x=56+i*245;ends.append(text(item['title'],x,y,9,20))
   if i<3:out.append(f'<path d="M{x+190} {y-7}h25m-7-7 7 7-7 7" fill="none" stroke="#65757c" stroke-width="2"/>')
  y=max(ends);out.insert(start,rect(24,top,992,y-top+12));y+=45
 elif n==2:
  for i,item in enumerate(f['items']):
   # Fixed brain / pointer / handoff glyphs; all explanation remains selectable text.
   icon=['M12 4c-3-5-9 0-6 4-5 1-3 8 0 8 0 5 6 5 6 1V4Zm0 0c3-5 9 0 6 4 5 1 3 8 0 8 0 5-6 5-6 1M8 8v5m8-5v5','m7 5 2 15 4-5 5-1L7 5Zm-3-3L2 0m10 3 1-3M3 10H0','M2 2h7v7H2V2Zm13 13h7v7h-7v-7ZM5 9v9h10'][i]
   out.append(f'<path d="{icon}" transform="translate(36 {y-20})" fill="none" stroke="#18252c" stroke-width="1.6"/>')
   y=text(item['title'],80,y,41,22,True)
   y=text(item['body'],80,y+6,41)+20
   if i<2:out.append(f'<path d="M36 {y}H1004" stroke="#d5dce0"/>');y+=42
 else:
  top=y-28;starts=[];ends=[]
  for i,item in enumerate(f['items']):
   x=36+i*510;start=len(out);out.append('');starts.append(start)
   out.append(rect(x+16,top+16,200,42,'#fce1e1' if i==0 else '#d9efe1'))
   end=text(item['title'],x+28,top+44,18,20,True)+32
   parts=item['body'].split('\n\n')
   check(x+20,end-22);end=text(parts[0],x+56,end,17,22,True)+4
   for j,part in enumerate(parts[1:],1):
    if j==(2 if i==0 else 3):
     position=len(out);end0=end-24;end=text(part,x+30,end,19);out.insert(position,rect(x+16,end0,428,end-end0+4,'#f0f1f2'));end+=24
    else:end=text(part,x+16,end,20)+8
   ends.append(end)
  y=max(ends)+12
  for i,start in enumerate(starts):out[start]=rect(36+i*510,top,460,y-top)
  y+=44
 y=text(f['description'],36,y,45)+20
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 allowed={'svg','title','desc','rect','g','text','path'}
 attrs={'xmlns','viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d','transform'}
 assert all(e.tag.split('}')[-1] in allowed and all(k in attrs for k in e.attrib) for e in tree.iter())
 assert len(svg.encode())<100000
 return svg.encode()
def main():
 print('Checking M04-01 SVG exports.' if '--check' in sys.argv else 'Generating M04-01 SVG exports.',file=sys.stderr)
 l=json.loads((ROOT/'content/aase/lessons/aase-m04-c01.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in l['text'][lang]['sections'] for b in s.get('blocks',[]) if b['kind'] in ['cards','flow']];assert [len(f['items'])for f in figures]==[4,3,2]
  for n,f in enumerate(figures,1):
   data=render(f,n,lang);out=ROOT/f'site/images/aase/m04-01-{n}-{lang}.svg'
   if '--check' in sys.argv:assert out.read_bytes()==data,f'Outdated: {out}'
   else:out.write_bytes(data)
   print(f'{out.name}: {len(data)} bytes')
if __name__=='__main__':main()
