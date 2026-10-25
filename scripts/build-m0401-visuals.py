"""Relationship-specific SVG exports for the eight existing bilingual visual aids."""
import json,pathlib,html,unicodedata
R=pathlib.Path(__file__).resolve().parents[1]
data=json.loads((R/'src/lib/m0401-visuals.json').read_text())
def wrap(s,limit):
 out=[];line='';n=0
 for c in s:
  k=2 if unicodedata.east_asian_width(c) in 'WF' else 1
  if n+k>limit:
   split=line.rfind(' ')
   if split>len(line)//3:out.append(line[:split]);line=line[split+1:]
   else:out.append(line);line=''
   n=sum(2 if unicodedata.east_asian_width(x) in 'WF' else 1 for x in line)
  line+=c;n+=k
 if line:out.append(line)
 return out
for ident,spec in data.items():
 for lang in ['zh','en']:
  zh=lang=='zh';d=spec[lang];p=[]
  def text(s,x,y,width=650,bold=False):
   lines=wrap(s,int(width/8.5))
   for i,line in enumerate(lines):p.append(f'<text x="{x}" y="{y+26*i}" font-size="16" font-weight="{650 if bold else 400}">{html.escape(line)}</text>')
   return y+26*len(lines)
  def box(item,x,y,width=660,tint=False):
   h=28+26*(len(wrap(item['title'],int((width-32)/8.5)))+len(wrap(item['body'],int((width-32)/8.5))))
   p.append(f'<rect x="{x}" y="{y}" width="{width}" height="{h}" rx="12" fill="{"#e8f0ef" if tint else "#fffef9"}" stroke="#778d80"/>')
   b=text(item['title'],x+16,y+27,width-32,True);text(item['body'],x+16,b,width-32)
   return y+h
  def arrow(label,y):return text('↓ '+label,42,y+20)+12
  y=text(d['title'],30,35,bold=True);y=text(d['caption'],30,y+8)+20
  items=d['items']
  if ident=='permissions':
   y=max(box(items[0],30,y,320),box(items[1],370,y,320));y=arrow('兩層共同影響本次結果' if zh else 'Both layers contribute to this result',y);y=box(items[2],30,y,tint=True)
  elif ident=='roles':
   y=box(items[0],30,y,tint=True);y+=30
   text('↑ SMB · '+('實作' if zh else 'Implements'),40,y,300);text('↑ SMB · '+('可支援' if zh else 'Can support'),380,y,300);y+=20
   y=max(box(items[1],30,y,320),box(items[2],370,y,320))
  elif ident=='unc':
   # Each path segment is annotated independently; no chronological arrows.
   for item in items:
    y=box(item,30,y);y+=14
  elif ident=='smb-process':
   text('用戶端' if zh else 'Client',30,y,bold=True);text('檔案伺服器' if zh else 'File server',480,y,210,True);y+=30;start=y
   for i,item in enumerate(items):
    y=box(item,65,y,590);y+=22
    if i==3:text(('伺服器檢查' if zh else 'Server checks')+' ↓',470,y,220);y+=32
    else:
     p.append(f'<path d="M40 {y}H680" stroke="#778d80"/>');text('←',30,y+5,30);text('→',675,y+5,30);y+=30
   p.append(f'<path d="M30 {start}V{y}M690 {start}V{y}" fill="none" stroke="#778d80"/>')
  elif ident=='document-flow':
   labels=['監控程式觀察文件','消費 document.uploaded','完成事件'] if zh else ['Watcher observes the file','Consume document.uploaded','Completion event']
   for i,item in enumerate(items):
    y=box(item,30,y,tint=i==1)
    if i<len(items)-1:y=arrow(labels[i],y)
  else:
   verb=('問' if ident=='questions' else '查詢' if ident=='protocols' else '核對') if zh else ('Ask' if ident=='questions' else 'Query' if ident=='protocols' else 'Check')
   for item in items:
    y=box({'title':item['title']+' → '+verb,'body':item['body']},30,y);y+=14
  h=y+25
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="{h}" viewBox="0 0 720 {h}" role="img" aria-labelledby="title desc"><title id="title">{html.escape(d["title"])}</title><desc id="desc">{html.escape(d["caption"])}</desc><rect width="720" height="{h}" rx="18" fill="#f7f5ef"/><g font-family="sans-serif" fill="#303632">'+''.join(p)+'</g></svg>\n'
  dest=R/f'site/images/ceh/m04-01-{ident}-{lang}.svg';dest.write_text(svg);assert dest.stat().st_size<100000
  print(dest.name,dest.stat().st_size)
