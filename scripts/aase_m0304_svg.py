"""Export the two MVP scope figures from the validated lesson model."""
import argparse,json
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
SECTIONS=['analogy','workflow']
def render(f,n,lang):
 nodes=[]
 def text(value,x,y,width,size=20,bold=False):
  lines=wrap(value,width)
  for j,line in enumerate(lines):nodes.append(f'<text x="{x}" y="{y+j*36}" font-size="{size}" font-weight="{650 if bold else 400}">{escape(line)}</text>')
  return y+len(lines)*36
 y=text(f['caption'],36,44,40,24,True)+24
 cols=1;width=968
 for i,item in enumerate(f['items']):
  cols=2 if n==1 and i>=2 else 1; width=476 if cols==2 else 968
  x=36+((i-2)%cols)*492 if n==1 and i>=2 else 36
  if i%cols==0:row=y;ends=[]
  start=len(nodes);offset=58 if n==2 else 24;end=text(item['title'],x+offset,row,(width-offset-24)/24,22,True)
  for paragraph in item['body'].split('\n\n'):end=text(paragraph,x+offset,end+8,(width-offset-24)/22)
  fill,stroke=('#eaf6ef','#91bca4') if n==1 and i==2 else ('#fbfcfd','#d5dce0')
  nodes.insert(start,f'<rect x="{x}" y="{row-28}" width="{width}" height="{end-row+42}" rx="10" fill="{fill}" stroke="{stroke}"/>');ends.append(end)
  if n==2:
   shapes=['M4 3h10l6 6v12H4V3Zm10 0v6h6M1 13h10m-4-4 4 4-4 4','M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 6 6M7 10l2 2 4-5','m3 17-1 5 5-1L21 7l-5-5L3 17Zm10-12 5 5','M4 3h10l6 6v12H4V3Zm10 0v6h6M8 14l3 3 5-6','M12 2v14m-5-5 5 5 5-5M4 17v5h16v-5']
   nodes.append(f'<path d="{shapes[i]}" transform="translate({x+18} {row-18})" fill="none" stroke="#18252c" stroke-width="1.6"/>')
  if i%cols==cols-1 or i==len(f['items'])-1:
   y=max(ends)+52
   if (n==2 and i<len(f['items'])-1) or (n==1 and i<2):
    nodes.append(f'<path d="M520 {y-28}v26m-7-7 7 7 7-7" fill="none" stroke="#637982" stroke-width="2"/>');y+=30
 y=text(f['description'],36,y+8,43)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(nodes)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 assert all(e.tag.split('}')[-1] in {'svg','title','desc','rect','g','text','path'} and not any(k.startswith('on') or k in ['href','style'] for k in e.attrib) for e in tree.iter())
 data=svg.encode();assert len(data)<100000;return data
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m03-c04.json').read_text())
 for lang in ['zh','en']:
  for n,id in enumerate(SECTIONS,1):
   s=next(s for s in lesson['text'][lang]['sections'] if s['id']==id);f=next(b for b in s['blocks'] if b['kind'] in ['cards','flow'])
   data=render(f,n,lang);out=ROOT/f'site/images/aase/m03-04-{n}-{lang}.svg'
   if args.check:assert out.read_bytes()==data,f'Out of date: {out}'
   else:out.write_bytes(data)
   print(out.name,len(data))
