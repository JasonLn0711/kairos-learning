"""Generate paired discovery diagrams and the HTML model from reviewed plain data."""
from pathlib import Path
from html import escape
import json,re,sys,unicodedata
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'docs/sources/m03-02/discovery-diagrams.json'
models=json.loads(DATA.read_text())
def wrap(text,width):
 lines=[];line='';size=0
 for token in re.findall(r'[\u2e80-\uffff]|[^\s\u2e80-\uffff]+\s*|\s+',text):
  n=sum(2 if unicodedata.east_asian_width(c) in 'WF' else 1 for c in token)
  if size+n>width and line:lines.append(line.rstrip());line='';size=0
  line+=token;size+=n
 if line:lines.append(line.rstrip())
 return lines
for src,m in models.items():
 count=3 if m['layout']=='outcomes' else 2
 assert len(m['panels'])==count and m['layout'] in ['outcomes','next-hop']
 o=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 852 600" role="img" aria-labelledby="title desc">',f'<title id="title">{escape(m["caption"])}</title>',f'<desc id="desc">{escape(m["description"])}</desc>', '<g transform="scale(0.6)"><rect width="1420" height="1000" fill="#f2f6fc"/>','<rect width="1420" height="10" fill="#2464d9"/>','<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2464d9"/></marker></defs>']
 def text(x,y,s,width,size=20,color='#172b49'):
  for i,line in enumerate(wrap(s,width)):
   o.append(f'<text x="{x}" y="{y+i*30}" font-family="Noto Sans CJK TC,sans-serif" font-size="{size}" fill="{color}">{escape(line)}</text>')
  return y+len(wrap(s,width))*30
 text(40,55,m['caption'],100,30);text(40,95,m['description'],124,20)
 w=(1340-(count-1)*24)/count
 for i,p in enumerate(m['panels']):
  x=40+i*(w+24);assert len(p['nodes']) in [2,3]
  o.append(f'<rect x="{x}" y="170" width="{w}" height="670" rx="20" fill="#ffffff" stroke="#b7c9df"/>')
  text(x+20,208,p['title'],int((w-40)/11),22)
  # Shared endpoints with a forward path and, when present, the return path.
  n=len(p['nodes']);gap=40;nodew=(w-40-gap*(n-1))/n;positions=[]
  for j,node in enumerate(p['nodes']):
   nx=x+20+j*(nodew+gap);positions.append(nx)
   o.append(f'<rect x="{nx}" y="290" width="{nodew}" height="130" rx="14" fill="#edf6fc" stroke="#9db3ce"/>')
   text(nx+10,320,node['title'],int((nodew-20)/10),18)
   text(nx+10,386,node['address'],int((nodew-20)/9),16,'#445d73')
  for e in p['edges']:
   a,b=e['source'],e['target'];assert 0<=a<n and 0<=b<n and abs(a-b)==1 and e['style'] in ['solid','dashed']
   forward=a<b;y=338 if forward else 405
   start=positions[a]+nodew if forward else positions[a];end=positions[b] if forward else positions[b]+nodew
   dash=' stroke-dasharray="7 5"' if e['style']=='dashed' else ''
   o.append(f'<path d="M{start} {y}H{end}" fill="none" stroke="#2464d9" stroke-width="3" marker-end="url(#arrow)"{dash}/>')
   # Labels sit outside endpoint boxes; separate vertical levels preserve each edge.
   labelx=x+20 if n==2 else positions[min(a,b)]
   text(labelx,265 if forward else 455,e['label'],60,18,'#1854bb')
  y=text(x+20,510,p['claim'],int((w-40)/11),20,'#006c66')+15
  for note in p['notes']:y=text(x+20,y,note,int((w-40)/11),20)+15
  assert y<825,(src,i,y)
 text(40,895,m['footer'],122,20)
 o.append('</g></svg>')
 suffix='zh-TW' if src.endswith('-zh.svg') else 'en'
 name=src.split('m03-02-')[1].rsplit('-',1)[0]
 target=ROOT/f'docs/sources/m03-02/figures/{name}.{suffix}.svg';value='\n'.join(o)
 if '--check' in sys.argv:assert target.read_text()==value,str(target)
 else:target.write_text(value)
js=ROOT/'src/lib/m0302-discovery-diagrams.json'
if '--check' in sys.argv:assert js.read_text()==DATA.read_text()
else:js.write_text(DATA.read_text())
print('4 discovery SVG sources and shared HTML data verified')
