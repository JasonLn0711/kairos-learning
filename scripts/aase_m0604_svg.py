"""Export four fixed M06-04 figures from the same validated lesson data."""
import json,sys,xml.etree.ElementTree as ET
from pathlib import Path
from html import escape
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]

def render(f,n,lang):
 out=[]
 def text(value,x,y,width=44,size=20,bold=False,center=False):
  for line in wrap(value,width):
   out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}"'+(' text-anchor="middle"'if center else '')+f'>{escape(line)}</text>');y+=36
  return y
 def arrow(x,y):out.append(f'<path d="M{x} {y}v24m-7-7 7 7 7-7" fill="none" stroke="#65757c" stroke-width="2"/>')
 y=text(f['caption'],36,44,size=24,bold=True)+24
 if n==4:
  y=text('Developer Tools',36,y,bold=True)+12
  y=text('Elements     Network     Console',36,y)+12
  y=text('All     Fetch/XHR     WS     Doc',36,y)+24
  for row in [f['headers']]+f['rows']:
   for col,cell in enumerate(row):text(cell,36+col*320,y,width=14,bold=row==f['headers'])
   y+=54;out.append(f'<path d="M36 {y-24}H1004" stroke="#d5dce0"/>')
  desc='僅作說明的模擬紀錄，不是從教材網站擷取的封包；101 示意協定升級，不表示業務完成。' if lang=='zh' else 'Illustrative simulated entries, not traffic captured from the teaching website. 101 illustrates a protocol upgrade, not business completion.'
 else:
  for i,item in enumerate(f['items']):
   top=y-28;start=len(out)
   if n==1:
    out.append(f'<circle cx="520" cy="{y-4}" r="10" fill="none" stroke="#65757c"/>');y+=34
    y=text(item['title'],520,y,bold=True,center=True)
    y=text(item['body'],520,y+4,center=True)
    if i==5:out.insert(start,f'<rect x="24" y="{top}" width="992" height="{y-top+12}" rx="12" fill="#eaf6ef"/>')
    if i<5:arrow(520,y+4);y+=72
   elif n==2:
    out.append(f'<circle cx="48" cy="{y-8}" r="10" fill="none" stroke="#65757c"/>')
    y=text(item['title'],80,y,width=41,bold=True)
    y=text(item['body'],80,y+4,width=41)+20
    if i<2:out.append(f'<path d="M36 {y}H1004" stroke="#d5dce0"/>');y+=48
   else:
    y=text(item['title'],36,y,bold=True)+12
    ends=[]
    for j,node in enumerate(item['body'].split(' → ')):
     x=36+j*248;ends.append(text(node,x,y,width=9))
     if j<3:out.append(f'<path d="M{x+204} {y-8}h24m-6-6 6 6-6 6" fill="none" stroke="#65757c" stroke-width="2"/>')
    y=max(ends)+36
    if i==0:out.append(f'<path d="M36 {y}H1004" stroke="#d5dce0"/>');y+=48
  desc=f['description']
 y=text(desc,36,y+20)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(desc)}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path','circle'}
 attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d','text-anchor','cx','cy','r'}
 assert all(e.tag.split('}')[-1] in allowed and all(k in attrs for k in e.attrib) for e in tree.iter())
 assert len(svg.encode())<100000
 return svg.encode()

def main():
 l=json.loads((ROOT/'content/aase/lessons/aase-m06-c04.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in l['text'][lang]['sections'] for b in s.get('blocks',[])if b['kind'] in ['flow','cards'] or s['id']=='record' and b['kind']=='table'];assert len(figures)==4
  for n,f in enumerate(figures,1):
   data=render(f,n,lang);out=ROOT/f'site/images/aase/m06-04-{n}-{lang}.svg'
   if '--check'in sys.argv:assert out.read_bytes()==data,f'Outdated {out}'
   else:out.write_bytes(data)
   print(f'{out.name}: {len(data)} bytes')
if __name__=='__main__':main()
