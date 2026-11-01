"""Render the six bounded M02-06 layouts from the same text used by HTML."""
from pathlib import Path
import json,html,re
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'src/lib/m0206-network-diagrams.json').read_text())
COLORS={'blue':('#e5effc','#689ee9'),'teal':('#e3f2f0','#59b6b1'),'orange':('#fcf0e6','#dc9a60'),'purple':('#f0eafa','#ac85ed'),'gray':('#eef0f3','#a1aebb')}
def wrap(text,width,size):
 lines=[]
 for part in text.split('\n'):
  line='';w=0
  for token in re.findall(r"[A-Za-z0-9’'./-]+|\s+|[^\s]",part):
   token_width=sum(size*(1 if ord(ch)>255 else .6) for ch in token)
   if w+token_width>width and line:lines.append(line.strip());line='';w=0
   if not line and not token.strip():continue
   for ch in token:
    cw=size*(1 if ord(ch)>255 else .6)
    if w+cw>width and line:lines.append(line.strip());line='';w=0
    line+=ch;w+=cw
  if line:lines.append(line.strip())
 return lines

def render(d,layout):
 out=[]
 def text(s,x,y,width,size=20,bold=False):
  lines=wrap(s,width,size)
  for line in lines:
   out.append(f'<text x="{x}" y="{y+size}" font-size="{size}" text-anchor="middle"'+(' font-weight="700"' if bold else '')+f'>{html.escape(line)}</text>');y+=size*1.65
  return y
 def height(i,w):return 30+len(wrap(d['nodes'][i]['title'],w-36,22))*36.3+len(wrap(d['nodes'][i]['body'],w-36,20))*33
 def box(i,x,y,w):
  n=d['nodes'][i];h=height(i,w);fill,stroke=COLORS[n['tone']]
  out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" fill="{fill}" stroke="{stroke}" stroke-width="2"/>')
  t=text(n['title'],x+w/2,y+12,w-36,22,True);text(n['body'],x+w/2,t+4,w-36);return y+h
 def arrow(x,y1,y2,color='#075bc5',dash=False):
  sign=1 if y2>y1 else -1
  out.append(f'<path d="M{x} {y1}V{y2}M{x-8} {y2-sign*10}L{x} {y2}L{x+8} {y2-sign*10}" fill="none" stroke="{color}" stroke-width="3"'+(' stroke-dasharray="6 4"' if dash else '')+'/>')
 y=text(d['caption'],400,18,740,24,True)+8;y=text(d['description'],400,y,740,18)+22
 if layout=='network-map':
  for i in range(4):
   if i:arrow(400,y,y+26,'#52677f');y+=36
   y=box(i,65,y,670)
 elif layout=='prefix-bits':
  h=max(height(i,170) for i in range(4))
  for i in range(4):box(i,30+i*195,y,170)
  y+=h+22
  out.append(f'<path d="M30 {y}H590" stroke="#075bc5" stroke-width="12"/><path d="M615 {y}H785" stroke="#b85b10" stroke-width="12"/>')
  y=max(text(d['labels'][0],310,y+18,540),text(d['labels'][1],700,y+18,170))+12
 elif layout=='private-network':
  top=y;y=text(d['labels'][0],400,y+16,700,22,True)+16
  a=box(0,65,y,320);b=box(1,415,y,320);y=max(a,b)
  out.append(f'<path d="M225 {a}V{y+32}H575V{b}M400 {y+32}V{y+60}" fill="none" stroke="#14817b" stroke-width="3"/>')
  y=text(d['labels'][1],400,y+62,650)+12;y=box(2,165,y,470)+20
  out.insert(0,f'<rect x="35" y="{top}" width="730" height="{y-top}" rx="24" fill="#f0f8f7" stroke="#84c4c0" stroke-width="2" stroke-dasharray="10 6"/>')
  arrow(400,y,y+45,'#52677f');y=text(d['labels'][2],570,y,280)+20;y=box(3,90,y,620)
 elif layout=='bgp-routing':
  y=box(0,150,y,600);arrow(400,y+3,y+65);text(d['labels'][0],540,y+12,220);y=box(1,150,y+80,600)
  arrow(400,y+4,y+115);text(d['labels'][0],540,y+15,220)
  arrow(100,y+115,y+5,'#a74705',True);text(d['labels'][1],250,y+40,260,18);y=box(2,150,y+135,600)
 elif layout=='cdn-origin':
  a=box(0,25,y,320);b=box(1,455,y,320)
  out.append(f'<path d="M350 {y+30}H450L438 {y+22}M450 {y+30}L438 {y+38}M450 {y+65}H350L362 {y+57}M350 {y+65}L362 {y+73}" fill="none" stroke="#52677f" stroke-width="3" stroke-dasharray="6 4"/>')
  y=text(d['labels'][0],400,max(a,b)+12,730)+8
  arrow(185,y,y+55);y=text(d['labels'][1],480,y+6,500)+30;y=box(2,45,y,710)
  arrow(400,y+3,y+75,'#a74705');y=text(d['labels'][2],400,y+82,720)+16;y=box(3,80,y,640)
 elif layout=='proxy-modes':
  y=max(text(d['labels'][0],205,y,340,22,True),text(d['labels'][2],595,y,340,22,True))+16
  a=box(0,30,y,350);b=box(2,420,y,350);middle=max(a,b)+45
  arrow(595,b+3,middle);c=box(3,420,middle,350);base=c+95
  arrow(90,a+4,base-15,'#52677f');text(d['labels'][1],250,middle+10,230)
  arrow(460,c+3,base-15);text(d['labels'][3],630,c+20,240,18)
  y=max(box(1,30,base,350),box(4,420,base,350))
 else:raise ValueError(layout)
 y=text(d['footer'],400,y+30,730,18)+20
 assert y<=1800,(layout,y)
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 {int(y+1)}" role="img" aria-labelledby="title desc"><title id="title">{html.escape(d["caption"])}</title><desc id="desc">{html.escape(d["description"])}</desc><rect width="800" height="{int(y+1)}" fill="#fcfcfd"/><g fill="#162a3a" font-family="system-ui, sans-serif">'+''.join(out)+'</g></svg>\n'

def generate(check=False):
 for lang,suffix in [('zh','zh-TW'),('en','en')]:
  for id,d in DATA[lang].items():
   value=render(d,id);p=ROOT/f'docs/sources/m02-06/figures/{id}.{suffix}.svg'
   if check:assert p.read_text()==value,str(p)
   else:p.write_text(value)
if __name__=='__main__':
 import sys
 generate('--check' in sys.argv)
 print('Six paired network figures match shared HTML text')
