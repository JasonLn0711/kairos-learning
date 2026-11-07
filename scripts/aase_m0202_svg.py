"""Export five fixed context-window figures from the bilingual lesson model."""
import argparse,json
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 nodes=[]
 def text(value,x,y,width=43,size=20):
  lines=wrap(value,width)
  for i,line in enumerate(lines):nodes.append(f'<text x="{x}" y="{y+34*i}" font-size="{size}">{escape(line)}</text>')
  return y+34*len(lines)
 def rect(x,y,w,h,fill='#fbfcfc',stroke='#d4d8da'):
  nodes.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{fill}" stroke="{stroke}"/>')
 y=text(f['caption'],36,44,size=24)+20
 if n==1:
  top=y;endings=[];outer=[]
  for i,item in enumerate(f['items']):
   x=36+i*558;outer.append((len(nodes),x,i));nodes.append('')
   end=text(item['title'],x+20,top+10,16,22)
   if i==0:
    for j in range(6):
     fx=x+36+(j%2)*175;fy=top+70+(j//2)*62;rect(fx,fy,155,48,'#cddbd3' if j==2 else '#ffffff')
     nodes.append(f'<path d="M{fx+20} {fy+14}h100m-100 10h80m-80 10h90" stroke="#a4a6a2" stroke-width="3" fill="none"/>')
    end=text(item['body'],x+20,top+298,17)
   else:
    for line in item['body'].split('\n'):
     rect(x+20,end+4,370,len(wrap(line,16))*34+16,'#ffffff');end=text(line,x+32,end+34,16)+24
   endings.append(end)
  height=max(endings)-top+40
  for index,x,i in outer:nodes[index]=f'<rect x="{x}" y="{top-25}" width="410" height="{height}" rx="10" fill="{"#e8e5de" if i==0 else "#ecd5c8"}" stroke="#b99a88"/>'
  text('選取' if lang=='zh' else 'Select',462,top+height/2-35,5)
  nodes.append(f'<path d="M456 {top+height/2}h126m-10-8 10 8-10 8" stroke="#a46c51" stroke-dasharray="8 6" stroke-width="3" fill="none"/>')
  y=top+height+15
 elif n==3:
  values=[int(item['body'].replace(',',''))for item in f['items']];assert values==[1000,2000,4500,1500,500]
  y=text(f'{sum(values):,} / 10,000 Token',36,y,size=28)+12
  x=36;rect(x,y,968,24,'#e9ebed')
  colors=['#637e8d','#618d7b','#b9914d','#92799f','#bd735e']
  for value,color in zip(values,colors):
   nodes.append(f'<rect x="{x}" y="{y}" width="{value/10000*968}" height="24" fill="{color}"/>');x+=value/10000*968
  y+=65
  for item in f['items']:y=text(item['title']+': '+item['body'],36,y)+10
  y=text('剩餘 500 Token；日誌範圍 0–3,000。' if lang=='zh' else '500 tokens remaining; log range 0–3,000.',36,y+12)
  y=text('1,800 Token 日誌 → 10,800；超出 800。' if lang=='zh' else '1,800 log tokens → 10,800 total; overflow 800.',36,y+12)
 else:
  for i,item in enumerate(f['items']):
   start=len(nodes);top=y-28
   y=text(item['title'],56,y,41,22)
   y=text(item['body'],56,y+8,41)
   if n==5 and i==2:nodes.insert(start,f'<rect x="36" y="{top}" width="968" height="{y-top+8}" rx="8" fill="#f4eae6" stroke="#ca9c87"/>')
   y+=28
   if n==5 and i<3:
    nodes.append(f'<path d="M520 {y-8}v22m-7-7 7 7 7-7" fill="none" stroke="#697b82" stroke-width="2"/>');y+=50
 y=text(f['description'],36,y+20)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfc"/><g fill="#26353c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(nodes)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 assert all(e.tag.split('}')[-1] in {'svg','title','desc','rect','g','text','path'} and not any(k.startswith('on') or k in ['href','style'] for k in e.attrib)for e in tree.iter())
 data=svg.encode();assert len(data)<100000;return data
def main():
 p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m02-c02.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in ['cards','flow']];assert len(figures)==5
  for n,f in enumerate(figures,1):
   data=render(f,n,lang);output=ROOT/f'site/images/aase/m02-02-{n}-{lang}.svg'
   if args.check:assert output.read_bytes()==data,f'Outdated: {output}'
   else:output.write_bytes(data)
   print(f'{output.name}: {len(data)} bytes')
if __name__=='__main__':main()
