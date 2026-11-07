"""Export four bounded tool-evidence figures from their published HTML data."""
import argparse,json
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
SECTIONS=['analogy','sandbox','connection','verification']
def render(f,n,lang):
 nodes=[]
 def text(value,x,y,width,size=20,bold=False):
  lines=wrap(value,width)
  for j,line in enumerate(lines):nodes.append(f'<text x="{x}" y="{y+j*36}" font-size="{size}" font-weight="{650 if bold else 400}">{escape(line)}</text>')
  return y+len(lines)*36
 def arrow(y):nodes.append(f'<path d="M520 {y}v26m-7-7 7 7 7-7" fill="none" stroke="#637982" stroke-width="2"/>')
 y=text(f['caption'],36,44,43,24,True)+18
 if n==1:y=text(f['description'],36,y,43)+20;arrow(y-10);y+=60
 cols=2 if n==2 else 1;width=476 if cols==2 else 968
 ends=[];row=y
 for i,item in enumerate(f['items']):
  x=36+(i%cols)*492
  if i%cols==0:row=y;ends=[]
  start=len(nodes)
  if n in [3,4]:
   left=150 if n==3 else 570
   title_end=text(item['title'],x+20,row,(left-40)/24,22,True)
   end=max(title_end,text(item['body'],x+left,row,(width-left-24)/22))
  else:
   end=text(item['title'],x+20,row,(width-40)/24,22,True)
   end=text(item['body'],x+20,end+8,(width-40)/22)
  fill,stroke=('#eaf6ef','#91bca4') if n==1 and i==4 or n==2 and i==0 else ('#fff5f4','#cba9a4') if n==2 and i==1 or n==4 and i==3 else ('#ffffff','#c3cfd5')
  nodes.insert(start,f'<rect x="{x}" y="{row-28}" width="{width}" height="{end-row+42}" rx="10" fill="{fill}" stroke="{stroke}"/>');ends.append(end)
  if i%cols==cols-1 or i==len(f['items'])-1:
   y=max(ends)+52
   if n==1 and i<len(f['items'])-1:arrow(y-28);y+=30
 if n!=1:y=text(f['description'],36,y+8,44)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(nodes)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 assert all(e.tag.split('}')[-1] in {'svg','title','desc','rect','g','text','path'} and not any(k.startswith('on') or k in ['href','style'] for k in e.attrib) for e in tree.iter())
 data=svg.encode();assert len(data)<100000;return data
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--check',action='store_true');args=parser.parse_args()
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m02-c06.json').read_text())
 for lang in ['zh','en']:
  for n,id in enumerate(SECTIONS,1):
   s=next(s for s in lesson['text'][lang]['sections'] if s['id']==id);f=next(b for b in s['blocks'] if b['kind'] in ['cards','flow'])
   data=render(f,n,lang);out=ROOT/f'site/images/aase/m02-06-{n}-{lang}.svg'
   if args.check:assert out.read_bytes()==data,f'Out of date: {out}'
   else:out.write_bytes(data)
   print(out.name,len(data))
