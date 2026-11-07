"""Export the four reviewed control diagrams from the lesson's text model."""
import argparse,json
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[]
 def text(value,x,y,width=43,size=20):
  lines=wrap(value,width)
  for i,line in enumerate(lines):out.append(f'<text x="{x}" y="{y+34*i}" font-size="{size}">{escape(line)}</text>')
  return y+34*len(lines)
 def box(item,x,y,w,fill='#fbfcfc',stroke='#d4d8da'):
  index=len(out);out.append('')
  end=text(item['title'],x+20,y+34,int((w-40)/22),22)
  end=text(item['body'],x+20,end+8,int((w-40)/22))+14
  out[index]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y}" rx="10" fill="{fill}" stroke="{stroke}"/>'
  return end
 def arrow(x,y,end):out.append(f'<path d="M{x} {y}V{end}m-7-7 7 7 7-7" fill="none" stroke="#59666c" stroke-width="2"/>')
 y=text(f['caption'],36,44,size=24)+16
 split=2 if n==1 else 4 if n==2 else 0
 if split:
  for i,item in enumerate(f['items'][:split]):
   y=box(item,36,y,968)
   if i<split-1:arrow(520,y+8,y+36);y+=50
  out.append(f'<path d="M520 {y+8}V{y+26}H266V{y+52}m-7-7 7 7 7-7M520 {y+26}H774V{y+52}m-7-7 7 7 7-7" fill="none" stroke="#59666c" stroke-width="2"/>');y+=68
  ends=[]
  for i,item in enumerate(f['items'][split:]):
   fail=(i==1 if n==1 else i==0)
   ends.append(box(item,36+i*508,y,460,'#fbf0ed' if fail else '#edf5f0'))
  y=max(ends)+26
  if n==2:y=text('↩ 回到觀察；遇停止條件則交接。' if lang=='zh' else 'Return to Observe; hand off at a stop condition.',36,y)+16
 elif n==3:
  y=box(f['items'][0],36,y,968)+18
  y=max(box(f['items'][1],36,y,460),box(f['items'][2],544,y,460,'#fbf0ed'))+18
  for item in f['items'][3:]:y=box(item,36,y,968)+18
 else:
  for i,item in enumerate(f['items']):
   y=box(item,36,y,968,stroke='#b54b25' if i==2 else '#d4d8da')
   if i<3:arrow(520,y+8,y+36);y+=50
 y=text(f['description'],36,y+36)+28
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfc"/><g fill="#26353c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 assert all(e.tag.split('}')[-1] in {'svg','title','desc','rect','g','text','path'} and not any(k.startswith('on') or k in ['href','style'] for k in e.attrib)for e in tree.iter())
 data=svg.encode();assert len(data)<100000;return data
def main():
 p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m02-c04.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in ['cards','flow']];assert len(figures)==4
  for n,f in enumerate(figures,1):
   data=render(f,n,lang);output=ROOT/f'site/images/aase/m02-04-{n}-{lang}.svg'
   if args.check:assert output.read_bytes()==data,f'Outdated: {output}'
   else:output.write_bytes(data)
   print(f'{output.name}: {len(data)} bytes')
if __name__=='__main__':main()
