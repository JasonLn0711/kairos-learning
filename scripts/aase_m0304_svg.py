"""Export the six MVP figures from the same model used by the lesson."""
import argparse,json
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 nodes=[]
 def text(value,x,y,width,size=20,bold=False):
  lines=wrap(value,width)
  for j,line in enumerate(lines):nodes.append(f'<text x="{x}" y="{y+j*36}" font-size="{size}" font-weight="{650 if bold else 400}">{escape(line)}</text>')
  return y+len(lines)*36
 def arrow(x,y):nodes.append(f'<path d="M{x} {y}v26m-7-7 7 7 7-7" fill="none" stroke="#526770" stroke-width="2"/>')
 def card(item,x,y,width,i):
  start=len(nodes);end=text(item['title'],x+24,y,(width-48)/24,22,True)
  for paragraph in item['body'].split('\n\n'):end=text(paragraph,x+24,end+8,(width-48)/22)
  fill='#eaf6ef' if n==3 and i==0 or n==4 and i==3 else '#faeef0' if n==4 and i==2 else '#fbfcfd'
  nodes.insert(start,f'<rect x="{x}" y="{y-28}" width="{width}" height="{end-y+42}" rx="10" fill="{fill}" stroke="#718188"/>');return end
 y=text(f['caption'],36,44,40,24,True)+24
 i=0
 while i<len(f['items']):
  if n==3 or n==5 and i==2:
   count=3 if n==3 else 2;width=(968-(count-1)*16)/count
   ends=[]
   for j in range(count):ends.append(card(f['items'][i+j],36+j*(width+16),y,width,i+j))
   end=max(ends)
   if n==5:
    # Both alternatives lead to the shared confirmation; neither points at the other.
    for j in range(2):
     x=36+j*(width+16)+width/2
     nodes.append(f'<path d="M{x} {end+20}v28H520" fill="none" stroke="#526770" stroke-width="2"/>')
    arrow(520,end+48)
   y=end+100;i+=count;continue
  end=card(f['items'][i],36,y,968,i)
  if (f['kind']=='flow' and i<len(f['items'])-1) or n==4 and i==0 or n==5 and i==0:arrow(520,end+20)
  if n==5 and i==1:
   for x in [274,766]:arrow(x,end+20)
  y=end+100;i+=1
 y=text(f['description'],36,y,43)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(nodes)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 assert all(e.tag.split('}')[-1] in {'svg','title','desc','rect','g','text','path'} and not any(k.startswith('on') or k in ['href','style'] for k in e.attrib) for e in tree.iter())
 data=svg.encode();assert len(data)<100000;return data
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
 figures=json.loads((ROOT/'docs/sources/aase/m03-04/replacement-2026-11-11/figures.json').read_text())
 for lang in ['zh','en']:
  for n,f in enumerate(figures[lang],1):
   data=render(f,n,lang);out=ROOT/f'site/images/aase/m03-04-{n}-{lang}.svg'
   if args.check:assert out.read_bytes()==data,f'Out of date: {out}'
   else:out.write_bytes(data)
   print(out.name,len(data))
