"""Export reviewed, text-only SVGs from the same M04-04 figure model."""
import json,sys
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[]
 def text(value,x,y,width=43,size=20,bold=False):
  for para in value.split('\n'):
   for line in wrap(para,width):
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=34
   if not para:y+=10
  return y
 def rect(x,y,w,h,green=False):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{"#edf9f1" if green else "#fbfcfd"}" stroke="#bddac9"/>'
 y=text(f['caption'],30,42,42,24,True)+10
 y=text(f['description'],30,y,45)+24
 for i,item in enumerate(f['items']):
  top=y-25;slot=len(out);out.append('')
  y=text(item['title'],50,y,42,22,True)+12
  y=text(item['body'],50,y,42)+20
  out[slot]=rect(30,top,980,y-top,n==3)
  if n==1 and i<len(f['items'])-1:
   out.append(f'<path d="M520 {y+6}v26m-7-7 7 7 7-7" fill="none" stroke="#65757c" stroke-width="2"/>');y+=50
  else:y+=24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'}
 attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1]in allowed and all(k in attrs for k in e.attrib) for e in tree.iter())
 assert len(svg.encode())<100000
 return svg.encode()
def main():
 l=json.loads((ROOT/'content/aase/lessons/aase-m04-c04.json').read_text())
 for lang in ['zh','en']:
  figs=[b for s in l['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in ['cards','flow']]
  assert [len(f['items'])for f in figs]==[5,4,11,2,2]
  for n,f in enumerate(figs,1):
   out=ROOT/f'site/images/aase/m04-04-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert out.read_bytes()==data,out
   else:out.write_bytes(data)
   print(out.name,len(data))
if __name__=='__main__':main()
