"""Export reviewed task diagrams from the same model used by HTML and search."""
import json,sys
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
R=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[]
 def text(v,x,y,w=44,bold=False):
  for p in v.split('\n'):
   for line in wrap(p,w):out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=34
  return y
 def box(item,x,y,w=464):
  start=len(out);out.append('');end=text(item['title'],x+20,y+36,int((w-40)/22),True);end=text(item['body'],x+20,end+8,int((w-40)/22));out[start]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y+12}" rx="12" fill="#fbfcfd" stroke="#aab4bb"/>';return end+12
 def arrow(x,y):out.append(f'<path d="M{x} {y}v24m-7-7 7 7 7-7" fill="none" stroke="#59666e" stroke-width="2"/>');return y+44
 y=text(f['caption'],36,44,bold=True)+18
 if n in [1,2]:
  y=box(f['items'][0],36,y,968)+12
  if n==1:y=arrow(520,y)
  else:
   # Hierarchy connector spans all children, without ordering them.
   out.append(f'<path d="M520 {y}v15M268 {y+15}h504M268 {y+15}v15M772 {y+15}v15" fill="none" stroke="#59666e" stroke-width="2"/>');y+=42
  items=f['items'][1:5 if n==1 else 6]
  for j in range(0,len(items),2):y=max(box(item,36+k*504,y)for k,item in enumerate(items[j:j+2]))+16
  if n==1:y=arrow(520,y);y=box(f['items'][5],36,y,968)+20
 elif n==3:
  y=box(f['items'][0],36,y,968)+12;y=arrow(520,y)
  # Both branches share the decision; never connect the two branches.
  out.append(f'<path d="M268 {y-22}h504" fill="none" stroke="#59666e" stroke-width="2"/>')
  end=[]
  for k,i in enumerate([1,3]):
   x=36+k*504;b=box(f['items'][i],x,y);b=arrow(x+232,b+10);end.append(box(f['items'][i+1],x,b))
  y=max(end)+24
 else:
  for i,item in enumerate(f['items']):
   y=box(item,36,y,968)+16
   if n==4 and i<len(f['items'])-1:y=arrow(520,y)
 y=text(f['description'],36,y+28)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#ffffff"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
 allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1] in allowed and set(e.attrib)<=attrs for e in ET.fromstring(svg).iter())
 assert len(svg.encode())<100000
 return svg.encode()
def main():
 l=json.loads((R/'content/aase/lessons/aase-m04-c02.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in l['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']in ['cards','flow']];assert [len(f['items'])for f in figures]==[6,6,5,5,3]
  for n,f in enumerate(figures,1):
   path=R/f'site/images/aase/m04-02-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check' in sys.argv:assert path.read_bytes()==data
   else:path.write_bytes(data)
   print(path.name,len(data))
if __name__=='__main__':main()
