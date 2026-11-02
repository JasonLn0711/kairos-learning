"""Render the four approved transport layouts from the shared bilingual model."""
from pathlib import Path
import json,html,re,sys,unicodedata
ROOT=Path(__file__).resolve().parents[1]
MODELS=ROOT/'docs/sources/m03-01/diagram-models.json'
BLUE='#2464d9';INK='#172b49';MUTED='#4d6380';TEAL='#00849b';GREEN='#168161'
def wrap(text,limit):
 words=re.findall(r'[A-Za-z0-9_./:()+≠-]+|\s+|.',text);lines=[];line='';width=0
 for word in words:
  size=sum(2 if unicodedata.east_asian_width(c) in 'WF' else 1 for c in word)
  if width+size>limit and line:lines.append(line.rstrip());line='';width=0
  line+=word;width+=size
 if line:lines.append(line.rstrip())
 return lines

def render(d):
 out=[]
 def rect(x,y,w,h,fill='#ffffff'):out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="20" fill="{fill}" stroke="#c9d8e8" stroke-width="2"/>')
 def text(x,y,s,size=24,color=INK,width=70):
  lines=wrap(s,width)
  for i,line in enumerate(lines):out.append(f'<text x="{x}" y="{y+i*(size+12)}" font-size="{size}" fill="{color}" font-family="sans-serif">{html.escape(line)}</text>')
  return y+len(lines)*(size+12)
 def arrow(x1,y1,x2,y2,color=BLUE):
  out.append(f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{color}" stroke-width="5" fill="none"/>')
  if x1!=x2:
   delta=-18 if x2>x1 else 18;points=f'{x2},{y2} {x2+delta},{y2-12} {x2+delta},{y2+12}'
  else:points=f'{x2},{y2} {x2-12},{y2-18} {x2+12},{y2-18}'
  out.append(f'<polygon points="{points}" fill="{color}"/>')
 def card(x,y,w,h,node,fill='#ffffff',size=24):
  rect(x,y,w,h,fill);yy=text(x+22,y+40,node['title'],size,BLUE,width=int((w-44)/(size*.55)))
  for line in node['body']:yy=text(x+22,yy+8,line,22,MUTED,width=int((w-44)/12))
  assert yy<y+h,(node,yy,y+h)
 layout=d['layout'];nodes=d['nodes'];footer=d['footer'];labels=d['labels']
 assert layout in ['overview','handshake','transport','tuple']
 assert len(nodes)=={'overview':3,'handshake':3,'transport':2,'tuple':5}[layout]
 assert len(labels)==2
 assert all(set(n)=={'title','body'} and isinstance(n['title'],str) and all(isinstance(v,str) for v in n['body']) for n in nodes+footer)
 text(50,50,'CEH M03-01',22,BLUE);yy=text(50,100,d['caption'],34,width=78);text(50,yy+5,d['description'],22,MUTED,width=116)
 if layout=='overview':
  for i,n in enumerate(nodes):
   x=50+i*510;card(x,260,380,300,n)
   # Device silhouettes are decorative; adjacent text carries their meaning.
   out.append(f'<rect x="{x+140}" y="470" width="100" height="55" rx="8" fill="#edf6fc" stroke="{BLUE}" stroke-width="3"/>')
   if i==0:out.append(f'<path d="M{x+190} 525v18 M{x+165} 543h50" stroke="{BLUE}" stroke-width="3" fill="none"/>')
   elif i==1:
    for dx in [160,190,220]:out.append(f'<circle cx="{x+dx}" cy="497" r="5" fill="{GREEN}"/>')
   else:
    for yy in [484,498,512]:out.append(f'<path d="M{x+150} {yy}h80" stroke="{BLUE}" stroke-width="3"/>')
   if i<2:arrow(x+390,390,x+495,390);text(x+385,355,labels[i],20,TEAL,width=12)
  for i,n in enumerate(footer):card(50+i*355,620,330,250,n,'#edf6fc')
 elif layout=='handshake':
  rect(50,240,1400,450);text(90,285,labels[0],28);text(1100,285,labels[1],28)
  for i,n in enumerate(nodes):
   y=345+i*115;reverse=i==1
   arrow(1330 if reverse else 170,y,170 if reverse else 1330,y,TEAL if reverse else BLUE)
   rect(480,y-32,540,104,'#edf6fc');text(510,y,n['title'],26,BLUE)
   text(510,y+33,' · '.join(n['body']),18,MUTED,width=47)
  for i,n in enumerate(footer):card(50+i*475,730,450,220,n,'#edf6fc')
 elif layout=='transport':
  for i,n in enumerate(nodes):
   x=50+i*715;rect(x,250,685,440);text(x+25,295,n['title'],26,BLUE if i==0 else GREEN,width=42)
   for j in range(3):
    xx=x+25+j*215;rect(xx,350,195,85,'#edf6fc');text(xx+12,390,n['body'][j],20,width=16)
    if i==1 and j==1:text(xx+70,500,'×',48,'#c83243')
    else:arrow(xx+95,450,xx+95,525)
    rect(xx,555,195,85,'#e8f5ef');text(xx+12,595,n['body'][j+3],20,GREEN,width=16)
   text(x+25,665,labels[i],20,MUTED,width=54)
   card(x,730,685,250,footer[i],'#edf6fc')
 else:
  rect(50,250,1400,180);text(80,300,labels[0],24);text(960,300,labels[1],24)
  text(80,365,'192.0.2.10:53000',28,BLUE);text(960,365,'198.51.100.20:443',28,BLUE)
  text(700,305,'TCP',28,TEAL);arrow(580,355,910,355)
  for i,n in enumerate(nodes):card(50+i*285,480,260,160,n)
  for i,n in enumerate(footer):card(50+i*715,690,685,280,n,'#edf6fc')
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 624" role="img" aria-labelledby="title desc"><title id="title">'+html.escape(d['caption'])+'</title><desc id="desc">'+html.escape(d['description'])+'</desc><g transform="scale(0.6)"><rect width="1500" height="1040" fill="#f5f8fb"/>'+''.join(out)+'</g></svg>\n'

def generate():
 models=json.loads(MODELS.read_text());assert len(models)==8
 target=ROOT/'src/lib/m0301-diagrams.json'
 if '--check' in sys.argv:assert target.read_bytes()==MODELS.read_bytes()
 else:target.write_bytes(MODELS.read_bytes())
 for src,d in models.items():
  name=Path(src).name.removeprefix('m03-01-');suffix='zh-TW' if name.endswith('-zh.svg') else 'en';name=re.sub(r'-(zh|en)\.svg$','',name)
  path=ROOT/f'docs/sources/m03-01/figures/{name}.{suffix}.svg';value=render(d)
  if '--check' in sys.argv:assert path.read_text()==value,path
  else:path.write_text(value)
 print('8 transport SVG sources match the shared bilingual layout model')
if __name__=='__main__':generate()
