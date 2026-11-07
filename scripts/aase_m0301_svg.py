"""Export seven reviewed problem-statement figures from the published text model."""
import argparse,json
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
FIGURES=[('analogy',0,2),('structure',0,5),('acceptance',0,2),('workflow',0,7),('documents',0,2),('documents',1,3),('connection',0,4)]
def render(f,n,lang):
 nodes=[]
 def text(value,x,y,width,size=20,bold=False):
  lines=wrap(value,width)
  for i,line in enumerate(lines):nodes.append(f'<text x="{x}" y="{y+i*36}" font-size="{size}" font-weight="{650 if bold else 400}">{escape(line)}</text>')
  return y+len(lines)*36
 def arrow(x,y,horizontal=False):
  d=f'M{x} {y}h10m-4-4 4 4-4 4' if horizontal else f'M{x} {y}v26m-7-7 7 7 7-7'
  nodes.append(f'<path d="{d}" fill="none" stroke="#637982" stroke-width="2"/>')
 y=text(f['caption'],36,44,42,24,True)+18
 parallel=n in [1,5,6];cols=2 if parallel else 1;width=476 if parallel else 968;ends=[]
 for i,item in enumerate(f['items']):
  if i%cols==0:row=y;ends=[]
  full=n==6 and i==2;x=36 if full else 36+i%cols*492;w=968 if full else width;start=len(nodes)
  end=text(item['title'],x+20,row,(w-40)/24,22,True)
  end=text(item['body'],x+20,end+8,(w-40)/22)
  fill,stroke=('#e7f2ef','#81b7aa') if n==4 and i==4 else ('#ffffff','#c3cfd5')
  nodes.insert(start,f'<rect x="{x}" y="{row-28}" width="{w}" height="{end-row+42}" rx="8" fill="{fill}" stroke="{stroke}"/>');ends.append(end)
  if n==6 and i==0:arrow(514,row,True)
  if i%cols==cols-1 or i==len(f['items'])-1:
   y=max(ends)+52
   if n==6 and i==1:arrow(760,y-24);y+=32
   if n in [4,7] and i<len(f['items'])-1:
    if n==4 and i==2:y+=36
    else:arrow(520,y-24);y+=32
 y=text(f['description'],36,y+8,43)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(nodes)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 assert all(e.tag.split('}')[-1] in {'svg','title','desc','rect','g','text','path'} and not any(k.startswith('on') or k in ['href','style'] for k in e.attrib) for e in tree.iter())
 data=svg.encode();assert len(data)<100000;return data
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--check',action='store_true');args=parser.parse_args()
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m03-c01.json').read_text())
 for lang in ['zh','en']:
  for n,(id,index,count) in enumerate(FIGURES,1):
   s=next(s for s in lesson['text'][lang]['sections'] if s['id']==id);f=[b for b in s['blocks'] if b['kind'] in ['cards','flow']][index];assert len(f['items'])==count
   data=render(f,n,lang);out=ROOT/f'site/images/aase/m03-01-{n}-{lang}.svg'
   if args.check:assert out.read_bytes()==data,f'Out of date: {out}'
   else:out.write_bytes(data)
   print(out.name,len(data))
