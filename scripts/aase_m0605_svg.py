"""Export the three fixed session/access diagrams from the lesson data."""
import json,sys
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[]
 def text(value,x,y,width=44,bold=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,width):
    out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
  return y
 def box(item,x,y,w,fill='#f3f4f5'):
  start=len(out);out.append('');end=text(item['title'],x+20,y+36,(w-40)/22,True)+8;end=text(item['body'],x+20,end,(w-40)/22)+14
  out[start]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y}" rx="14" fill="{fill}" stroke="#64748b"/>'
  return end
 def arrow(x,y1,y2):out.append(f'<path d="M{x} {y1}V{y2}m-7-7 7 7 7-7" fill="none" stroke="#59666e" stroke-width="2"/>')
 y=text(f['caption'],36,40,44,True)+20
 if n==1:
  for item in f['items']:y=box(item,36,y,988)+16
 elif n==2:
  y=box(f['items'][0],260,y,760);arrow(640,y+8,y+42);y+=62
  y=box(f['items'][1],260,y,760);arrow(640,y+8,y+68)
  # Rejection leaves the session decision and terminates without reaching permission.
  out.append(f'<path d="M260 {y-30}H145V{y+50}m-7-7 7 7 7-7" fill="none" stroke="#59666e" stroke-width="2"/>')
  deny=box(f['items'][3],24,y+60,250,'#f9eaea');y+=90
  y=box(f['items'][2],310,y,710);arrow(665,y+8,y+45);y+=68
  out.append(f'<path d="M490 {y}v-16h360v16" fill="none" stroke="#59666e" stroke-width="2"/>')
  y=max(deny,box(f['items'][4],310,y,340,'#f9eaea'),box(f['items'][5],680,y,340,'#e8f3ec'))+30
 else:
  y=max(box(f['items'][0],36,y,460),box(f['items'][1],564,y,460))+24
  y=text('瀏覽器 → 伺服器：Cookie；伺服器檢查有效性。'if lang=='zh' else 'Browser → server: cookie; server checks validity.',36,y+12,44)+20
  y=box(f['items'][2],36,y,988)+24
 y=text(f['description'],36,y+12,44)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1060" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter());assert len(svg.encode())<100000
 return svg.encode()
if __name__=='__main__':
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m06-c05.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']=='cards'];assert [len(f['items'])for f in figures]==[4,6,3]
  for n,f in enumerate(figures,1):
   dest=ROOT/f'site/images/aase/m06-05-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert dest.read_bytes()==data,f'outdated {dest}'
   else:dest.write_bytes(data)
 print('PASS: six constrained session/access SVG exports synchronized.')
