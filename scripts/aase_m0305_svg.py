"""Export the five success evidence figures from the validated lesson model."""
import argparse,json
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
SECTIONS=['evidence-chain','metrics','measure','analogy','trace']
def render(f,n,lang):
 nodes=[]
 def text(value,x,y,width,size=20,bold=False):
  lines=wrap(value,width)
  for j,line in enumerate(lines):nodes.append(f'<text x="{x}" y="{y+j*36}" font-size="{size}" font-weight="{650 if bold else 400}">{escape(line)}</text>')
  return y+len(lines)*36
 y=text(f['caption'],36,44,40,24,True)+24
 cols=2 if n==4 else 1;width=476 if cols==2 else 968
 if n==3:
  y=text(f['items'][0]['title']+'   3 / 4',36,y,42,22,True)+12
  nodes.append(f'<rect x="36" y="{y}" width="968" height="20" rx="10" fill="#e4e9ec"/>')
  nodes.append(f'<circle cx="762" cy="{y+10}" r="12" fill="#ffffff" stroke="#637982"/>')
  for value in range(5):text(str(value),36+value*239,y+55,2,18)
  y+=112
  end=text(f['items'][1]['title'],36,y,20)
  end=text('75%',36,end+8,20,30,True)
  right=text(f['items'][2]['title'],530,y,20,22,True)
  right=text(f['items'][2]['body'],530,right+8,20)
  y=text(f['items'][3]['body'],36,max(end,right)+28,43)+32
 for i,item in enumerate([] if n==3 else f['items']):
  x=36+(i%cols)*492
  if i%cols==0:row=y;ends=[]
  start=len(nodes);offset=58 if n==2 else 24;end=text(item['title'],x+offset,row,(width-offset-24)/24,22,True)
  for paragraph in item['body'].split('\n\n'):end=text(paragraph,x+offset,end+8,(width-offset-24)/22)
  fill,stroke=('#e9f2f7','#d9eaf4') if n==1 and i in [2,3] else ('#fff2ea','#b15840') if n==5 and i==4 else ('#fbfcfd','#d5dce0')
  nodes.insert(start,f'<rect x="{x}" y="{row-28}" width="{width}" height="{end-row+42}" rx="10" fill="{fill}" stroke="{stroke}"/>');ends.append(end)
  if n==2:
   shape='m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Zm-4 10 3 3 5-6' if i==0 else 'M9 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM2 21v-3a7 7 0 0 1 14 0v3M17 4a3 3 0 0 1 0 6m1 4a5 5 0 0 1 4 5'
   nodes.append(f'<path d="{shape}" transform="translate({x+14} {row-18})" fill="none" stroke="#18252c" stroke-width="1.6"/>')
  if i%cols==cols-1 or i==len(f['items'])-1:
   y=max(ends)+52
   if n==1 and i<len(f['items'])-1:
    nodes.append(f'<path d="M520 {y-28}v26m-7-7 7 7 7-7" fill="none" stroke="#637982" stroke-width="2"/>');y+=30
 y=text(f['description'],36,y+8,43)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(nodes)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 assert all(e.tag.split('}')[-1] in {'svg','title','desc','rect','g','text','path','circle'} and not any(k.startswith('on') or k in ['href','style'] for k in e.attrib) for e in tree.iter())
 data=svg.encode();assert len(data)<100000;return data
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m03-c05.json').read_text())
 for lang in ['zh','en']:
  for n,id in enumerate(SECTIONS,1):
   s=next(s for s in lesson['text'][lang]['sections'] if s['id']==id);f=next(b for b in s['blocks'] if b['kind'] in ['cards','flow'])
   data=render(f,n,lang);out=ROOT/f'site/images/aase/m03-05-{n}-{lang}.svg'
   if args.check:assert out.read_bytes()==data,f'Out of date: {out}'
   else:out.write_bytes(data)
   print(out.name,len(data),'bytes')
 print('PASS: 10 SVG exports checked.' if args.check else 'PASS: 10 SVG exports generated.')
