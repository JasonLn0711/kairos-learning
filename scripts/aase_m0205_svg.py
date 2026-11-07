"""Export the four fixed Harness layouts from the shared bilingual lesson data."""
import argparse,json
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 nodes=[]
 def text(value,x,y,width,size=20):
  for paragraph in value.split('\n\n'):
   lines=wrap(paragraph,width)
   for j,line in enumerate(lines):nodes.append(f'<text x="{x}" y="{y+j*36}" font-size="{size}">{escape(line)}</text>')
   y+=len(lines)*36+12
  return y
 def card(item,x,y,w,fill='#ffffff'):
  start=len(nodes);nodes.append('')
  end=text(item['title'],x+20,y+36,(w-40)/24,22)
  end=text(item['body'],x+20,end,(w-40)/24)
  nodes[start]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y+8}" rx="10" fill="{fill}" stroke="#b8c9d0"/>'
  return end+8
 def arrow(y):
  nodes.append(f'<path d="M520 {y+8}v26m-7-7 7 7 7-7" fill="none" stroke="#637982" stroke-width="2"/>');return y+48
 y=text(f['caption'],36,44,38,24)+12
 if n==1:
  y=arrow(card(f['items'][0],100,y,840,'#edf2f7'))
  top=y;index=len(nodes);nodes.append('')
  y=text('Agent Harness',68,y+36,36,24)
  y=text('工作支援系統' if lang=='zh' else 'Work support system',68,y,36)+4
  for i in range(1,7,2):
   ends=[card(f['items'][i+j],68+j*460,y,444) for j in range(2)];y=max(ends)+18
  y=card(f['items'][7],68,y,904,'#e9edf6')+24
  nodes[index]=f'<rect x="{36}" y="{top}" width="968" height="{y-top}" rx="12" fill="#fff9f2" stroke="#ba7950" stroke-width="2"/>'
  y=arrow(y);y=card(f['items'][8],100,y,840,'#e8f4ef')+28
 else:
  for i,item in enumerate(f['items']):
   y=card(item,36,y,968,'#e8f4ef' if n==4 and i==4 else '#ffffff')
   y=arrow(y) if n==4 and i<4 else y+24
 y=text(f['description'],36,y+20,40)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(nodes)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 assert all(e.tag.split('}')[-1] in {'svg','title','desc','rect','g','text','path'} and not any(k.startswith('on') or k in ['href','style'] for k in e.attrib) for e in tree.iter())
 data=svg.encode();assert len(data)<100000;return data
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m02-c05.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections'] for b in s.get('blocks',[]) if b['kind'] in ['cards','flow']]
  assert len(figures)==4
  for n,f in enumerate(figures,1):
   data=render(f,n,lang);out=ROOT/f'site/images/aase/m02-05-{n}-{lang}.svg'
   if args.check:assert out.read_bytes()==data,f'Out of date: {out}'
   else:out.write_bytes(data)
   print(out.name,len(data))
