"""Export four fixed environment figures from the same data used by HTML/search."""
import json,sys
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[]
 def text(value,x,y,width=44,bold=False,mono=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,width) or ['']:
    out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}"'+(' font-family="monospace"'if mono else '')+f'>{escape(line)}</text>');y+=36
  return y
 def box(item,x,y,w,code=False):
  start=len(out);out.append('');end=text(item['title'],x+20,y+36,(w-40)/22,True)+8
  end=text(item['body'],x+20,end,(w-40)/22,mono=code)+14
  out[start]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y}" rx="10" fill="#ffffff" stroke="#9baab4"/>'
  return end
 y=text(f['caption'],36,42,44,True)+18
 if n==1:
  y=text('餐廳 → 軟體開發（逐列比喻）'if lang=='zh'else'Restaurant → software development (paired analogy)',36,y,44,True)+12
  for item in f['items']:
   start=len(out);out.append('');top=y-26
   end=max(text(item['title'],52,y,16,True),text(item['body'],442,y,26))+14
   out[start]=f'<rect x="36" y="{top}" width="988" height="{end-top}" rx="6" fill="#f1f4f6" stroke="#c5cfd5"/>'
   y=end+38
 elif n==4:
  for item in f['items']:y=box(item,36,y,988,True)+24
 else:
  for i,item in enumerate(f['items']):
   y=box(item,36,y,988)
   if n==3 and i<len(f['items'])-1:
    out.append(f'<path d="M530 {y+8}v24m-7-7 7 7 7-7" fill="none" stroke="#506573" stroke-width="2"/>');y+=48
   else:y+=20
 y=text(f['description'],36,y+18,44)+20
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1060" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter())
 assert len(svg.encode())<100000
 return svg.encode()
def main():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m07-c01.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in ['cards','flow']]
  assert [len(f['items'])for f in figures]==[8,3,5,2]
  for n,f in enumerate(figures,1):
   dest=ROOT/f'site/images/aase/m07-01-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert dest.read_bytes()==data,f'outdated {dest}'
   else:dest.write_bytes(data)
 print('PASS: eight constrained SVG exports synchronized; all below 100000 bytes.')
if __name__=='__main__':main()
