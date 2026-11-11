"""Generate fixed, allowlisted SVG illustrations from the lesson's figure data."""
import json,sys
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[]
 def text(value,x,y,width=43,bold=False):
  for p in value.split('\n'):
   for line in wrap(p,width):
    out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
  return y
 def box(item,x,y,w,fill='#ffffff'):
  i=len(out);out.append('');end=text(item['title'],x+20,y+36,(w-40)/22,True)+8;end=text(item['body'],x+20,end,(w-40)/22)+16
  out[i]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y}" rx="14" fill="{fill}" stroke="#64748b"/>'
  return end
 def arrow(y):
  out.append(f'<path d="M530 {y}v24m-7-7 7 7 7-7" fill="none" stroke="#59666e" stroke-width="2"/>')
  return y+52
 y=text(f['caption'],36,40,bold=True)+20
 if n==1:
  ends=[box(item,36+i*510,y,478)for i,item in enumerate(f['items'][:2])];y=max(ends)+24
  y=box(f['items'][2],36,y,988)+24
  y=text('檢查資料    重設（靜態示意）' if lang=='zh' else 'Check data    Reset (static illustration)',56,y+16)+24
  y=box(f['items'][3],36,y,988)+30
 else:
  for item in f['items'][:3]:y=arrow(box(item,36,y,988)+8)
  ends=[box(item,36+i*510,y,478,'#f7f2eb' if i==0 else '#eef6f3')for i,item in enumerate(f['items'][3:5])];y=max(ends)+36
  y=text('只有「資料沒有變」分支繼續 ↓' if lang=='zh' else 'Only the unchanged-data branch proceeds ↓',36,y)+20
  for i,item in enumerate(f['items'][5:]):
   y=box(item,36,y,988)
   y=arrow(y+8)if i==0 else y+30
 y=text(f['description'],36,y+12)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1060" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter())
 assert len(svg.encode())<100000
 return svg.encode()
def main():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m07-c05.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in ['cards','flow']];assert [len(f['items'])for f in figures]==[4,7]
  for n,f in enumerate(figures,1):
   dest=ROOT/f'site/images/aase/m07-05-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert dest.read_bytes()==data,f'outdated {dest}'
   else:dest.write_bytes(data)
 print('PASS: four constrained SVG exports synchronized.')
if __name__=='__main__':main()
