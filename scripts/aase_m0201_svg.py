"""Six bounded lesson diagrams, generated from the same text as the HTML figures."""
import argparse
import json
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
SECTIONS=['pipeline','units','analogy','attention','attention-example','limits']
def render(f,n,lang):
 nodes=[]
 def text(value,x,y,width,size=20):
  lines=wrap(value,width)
  for j,line in enumerate(lines):nodes.append(f'<text x="{x}" y="{y+j*34}" font-size="{size}">{escape(line)}</text>')
  return y+len(lines)*34
 y=text(f['caption'],36,44,43,24)+20
 for i,item in enumerate(f['items']):
  # Paired segmentations and vector dimensions remain parallel in the export.
  cols=2 if n in [2,5] else 4 if n==3 else 1
  width=968/cols; x=36+(i%cols)*width
  if i%cols==0:row_y=y;ends=[]
  fill,stroke=('#edf8f5','#79aaa0') if (n==1 and i==3) or (n in [2,4] and i==1) else ('#fff4e9','#c8a17c') if (n in [4,6] and i==2) or (n==5 and i==1) else ('#edf4ff','#9bb9dd')
  start=len(nodes);end=text(item['title'],x+20,row_y, (width-48)/24,22)
  end=text(item['body'],x+20,end+10,(width-48)/22)
  ends.append(end);nodes.insert(start,f'<rect x="{x}" y="{row_y-28}" width="{width-16}" height="{end-row_y+42}" rx="10" fill="{fill}" stroke="{stroke}"/>')
  if i%cols==cols-1 or i==len(f['items'])-1:
   y=max(ends)+55
   if n in [1,6] and i<len(f['items'])-1:
    nodes.append(f'<path d="M512 {y-30}v24m-7-7 7 7 7-7" fill="none" stroke="#5a7186" stroke-width="2"/>');y+=30
 y=text(f['description'],36,y+12,43)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(nodes)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 assert all(e.tag.split('}')[-1] in {'svg','title','desc','rect','g','text','path'} and not any(k.startswith('on') or k in ['href','style'] for k in e.attrib) for e in tree.iter())
 data=svg.encode();assert len(data)<100000;return data
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--check',action='store_true');args=parser.parse_args()
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m02-c01.json').read_text())
 for lang in ['zh','en']:
  for n,id in enumerate(SECTIONS,1):
   s=next(s for s in lesson['text'][lang]['sections'] if s['id']==id)
   f=next(b for b in s['blocks'] if b['kind'] in ['cards','flow'])
   data=render(f,n,lang);p=ROOT/f'site/images/aase/m02-01-{n}-{lang}.svg'
   if args.check:assert p.read_bytes()==data,f'Out of date: {p}'
   else:p.write_bytes(data)
   print(f'{p.name}: {len(data)} bytes')
if __name__=='__main__':main()
