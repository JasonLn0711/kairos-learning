"""Export the three acceptance figures from the same data as the HTML."""
import argparse,json
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
SECTIONS=['mechanism','examples','tests']
def render(f,n,lang):
 nodes=[]
 def text(value,y,size=20,bold=False):
  lines=wrap(value,42)
  for j,line in enumerate(lines):nodes.append(f'<text x="36" y="{y+j*36}" font-size="{size}" font-weight="{650 if bold else 400}">{escape(line)}</text>')
  return y+len(lines)*36
 y=text(f['caption'],44,24,True)+18
 for i,item in enumerate(f['items']):
  y=text(item['title'],y,22,True)
  y=text(item['body'],y+8)+24
  if i<len(f['items'])-1:
   if n==2:nodes.append(f'<path d="M36 {y}H1004" stroke="#c3cfd5"/>');y+=44
   else:nodes.append(f'<path d="M520 {y}v26m-7-7 7 7 7-7" fill="none" stroke="#637982" stroke-width="2"/>');y+=70
 y=text(f['description'],y+8)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(nodes)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 assert all(e.tag.split('}')[-1] in {'svg','title','desc','rect','g','text','path'} and not any(k.startswith('on') or k in ['href','style'] for k in e.attrib) for e in tree.iter())
 data=svg.encode();assert len(data)<100000;return data
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--check',action='store_true');args=parser.parse_args()
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m05-c03.json').read_text())
 for lang in ['zh','en']:
  for n,id in enumerate(SECTIONS,1):
   s=next(s for s in lesson['text'][lang]['sections'] if s['id']==id);f=next(b for b in s['blocks'] if b['kind'] in ['cards','flow'])
   data=render(f,n,lang);out=ROOT/f'site/images/aase/m05-03-{n}-{lang}.svg'
   if args.check:assert out.read_bytes()==data,f'Out of date: {out}'
   else:out.write_bytes(data)
   print(out.name,len(data))
