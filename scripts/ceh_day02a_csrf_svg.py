"""Fixed, reviewed renderers for the eight supplied CSRF/browser diagrams."""
from html import escape
from aase_m0104_svg import wrap

def render_csrf(b,lang,spec):
 out=[]
 def text(value,x,y,width=42,size=18,bold=False,center=False):
  for paragraph in value.split('\n'):
   if not paragraph:
    y+=32;continue
   for line in wrap(paragraph,width):
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}" text-anchor="{"middle" if center else "start"}">{escape(line)}</text>');y+=32
  return y
 def rect(x,y,w,h,fill='#f2f4f5'):
  return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="#d8dce0"/>'
 def path(d,color='#657079',dash=False):
  out.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="2"'+(' stroke-dasharray="8 10"' if dash else '')+'/>')
 def down(y):path(f'M450 {y}v22m-6-6 6 6 6-6')
 def card(item,x,y,w=404):
  at=len(out);cy=text(item['title'],x+18,y+32,int((w-36)/20),20,True)
  cy=text(item['body'],x+18,cy+8,int((w-36)/18))+12
  out.insert(at,rect(x,y,w,cy-y));return cy
 def pair(items,y,xs=(28,468),w=404):return max(card(item,x,y,w) for x,item in zip(xs,items))
 y=text(b['caption'],28,40,42,22,True)+16;layout=spec['layout']
 if layout=='csrf-browser':
  y=pair(b['items'][:2],y)+24
  y=text('不同的網頁執行安全環境；無法任意互讀資料',450,y,42,18,False,True)+8
  down(y);y+=60;top=y;at=len(out)
  y=text(b['items'][2]['title'],48,y+36,40,20,True)
  y=text(b['items'][2]['body'],48,y+8,40)+8
  y=pair(b['items'][3:5],y,(48,468),384)+16
  out.insert(at,rect(28,top,844,y-top,'#fbfcfd'));down(y+16);y+=68
  y=card(b['items'][5],28,y,844)+16
 elif layout=='csrf-session':y=pair(b['items'],y)+16
 elif layout=='csrf-exchange':
  for item in b['items']:
   y=text(item['title'],28,y+24,42,20,True)+8;top=y-24;at=len(out)
   out.append('<g font-family="ui-monospace, Consolas, monospace">')
   y=text(item['body'],46,y+8,40,19)+12;out.append('</g>')
   out.insert(at,rect(28,top,844,y-top,'#f2f6f5'));y+=32
 elif layout=='csrf-headers':
  for i,item in enumerate(b['items']):
   y=text(item['title'],72,y+24,39,20,True)
   path(f'M30 {y-40}h24m-6-6 6 6-6 6' if i==0 else f'M54 {y-40}H30m6-6-6 6 6 6')
   y=text(item['body'],72,y+8,39)+16;path(f'M28 {y}H872','#d8dce0');y+=28
 elif layout=='csrf-sequence':
  xs=[140,450,760]
  for x,label in zip(xs,['惡意網頁','Alice Browser','銀行 Server']):
   out.append(rect(x-122,y,244,64,'#e8ecef'));text(label,x,y+40,12,20,True,True)
  top=y+64;y+=106;at=len(out)
  for i,(item,(a,z)) in enumerate(zip(b['items'],[(1,2),(2,1),(0,1),(1,2),(2,1)])):
   color=['#008c83','#008c83','#b96500','#b52323','#657079'][i];mid=(xs[a]+xs[z])/2
   out.append(f'<g fill="{color}">');y=text(item['title'],mid,y,17,20,True,True);out.append('</g>')
   y=text(item['body'],mid,y+2,20,16,False,True)+6
   path(f'M{xs[a]} {y}H{xs[z]}m'+('-10-8 10 8-10 8' if z>a else '10-8-10 8 10 8'),color);y+=58
  out.insert(at,''.join(f'<path d="M{x} {top}V{y}" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="8 10"/>' for x in xs))
  y=text('Cookie 未直接交給惡意網頁',450,y+20,42,20,True,True)+16
 elif layout in ('csrf-origins','csrf-samesite'):
  labels=['其他網址','Origin','Site'] if layout=='csrf-origins' else ['請求情境','Strict','Lax','None']
  xs=[28,490,680] if layout=='csrf-origins' else [28,440,590,740]
  for x,label in zip(xs,labels):text(label,x,y,19,20,True)
  y+=48
  for item in b['items']:
   cy=text(item['title'],28,y,21,18)
   ends=[cy]
   for x,cell in zip(xs[1:],item['body'].split('｜')):
    value=cell.split('：')[1];yes=value in ('相同','允許')
    out.append(f'<g fill="{"#006b39" if yes else "#b52323"}">');ey=text('✓' if yes else '×',x,y,6,22,True);out.append('</g>')
    ends.append(text(value,x,ey,6,18))
   y=max(ends)+12;path(f'M28 {y}H872','#d8dce0');y+=36
 else:
  assert layout=='csrf-token'
  for i,item in enumerate(b['items']):
   text(str(i+1),42,y+24,3,22,True)
   top=y;y=text(item['title'],88,y+24,38,20,True)
   y=text(item['body'],88,y+6,38)+12
   if i<4:path(f'M54 {top+44}V{y}','#d8dce0')
   y+=18
 y=text(b['description'],28,y+32,42,17)+20
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(b["caption"])}</title><desc id="desc">{escape(b["description"])}</desc><rect width="900" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
