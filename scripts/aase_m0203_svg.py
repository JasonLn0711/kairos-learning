"""Export six lesson figures from the same validated text as their HTML nodes."""
import argparse,json
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
SECTIONS=['office','kv-cache','summary-and-notes','retrieval','memory','workflow']
def render(f,n,lang):
 nodes=[]
 def text(value,x,y,width,size=20):
  lines=wrap(value,width)
  for j,line in enumerate(lines):nodes.append(f'<text x="{x}" y="{y+j*36}" font-size="{size}">{escape(line)}</text>')
  return y+len(lines)*36
 y=text(f['caption'],36,44,43,24)+20
 cols=2 if n in [1,3] else 5 if n==2 else 1
 width=(968-(44 if n==3 else 16)*(cols-1))/cols;gap=44 if n==3 else 16
 for i,item in enumerate(f['items']):
  x=36+(i%cols)*(width+gap)
  if i%cols==0:row=y;ends=[]
  start=len(nodes);end=text(item['title'],x+16,row,(width-32)/24,22)
  end=text(item['body'],x+16,end+8,(width-32)/22)
  fill,stroke=('#e8f4ef','#90c7b9') if n==2 and i<4 or n==4 and i==2 else ('#eceffc','#a6b4ec') if n==2 and i==4 else ('#ffffff','#c3cfd5')
  nodes.insert(start,f'<rect x="{x}" y="{row-28}" width="{width}" height="{end-row+42}" rx="10" fill="{fill}" stroke="{stroke}"/>');ends.append(end)
  if n==6 and i==3:nodes.append(f'<path d="M36 {row-40}h968" stroke="#84999e" stroke-width="3"/>')
  if n==3 and i==0 or n==2 and i==3:
   ax=x+width+3;ay=row+15;length=gap-6
   nodes.append(f'<path d="M{ax} {ay}h{length}m-6-6 6 6-6 6" fill="none" stroke="#637982" stroke-width="2"/>')
  if i%cols==cols-1 or i==len(f['items'])-1:
   y=max(ends)+60
   if n in [4,6] and i<len(f['items'])-1:
    nodes.append(f'<path d="M520 {y-32}v26m-7-7 7 7 7-7" fill="none" stroke="#637982" stroke-width="2"/>');y+=30
 y=text(f['description'],36,y+8,43)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(nodes)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 assert all(e.tag.split('}')[-1] in {'svg','title','desc','rect','g','text','path'} and not any(k.startswith('on') or k in ['href','style'] for k in e.attrib) for e in tree.iter())
 data=svg.encode();assert len(data)<100000;return data
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m02-c03.json').read_text())
 for lang in ['zh','en']:
  for n,id in enumerate(SECTIONS,1):
   s=next(s for s in lesson['text'][lang]['sections'] if s['id']==id)
   f=next(b for b in s['blocks'] if b['kind'] in ['cards','flow'])
   data=render(f,n,lang);out=ROOT/f'site/images/aase/m02-03-{n}-{lang}.svg'
   if args.check:assert out.read_bytes()==data,f'Out of date: {out}'
   else:out.write_bytes(data)
   print(out.name,len(data))
