"""Reviewed fixed layouts for replacement CSRF diagrams; no supplied markup execution."""
from html import escape
from aase_m0104_svg import wrap

def render_replacement(b,lang,spec):
 out=[]
 def text(value,x,y,columns=42,size=18,bold=False,center=False):
  for paragraph in value.split('\n'):
   if not paragraph:y+=32;continue
   for line in wrap(paragraph,columns):
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}" text-anchor="{"middle" if center else "start"}">{escape(line)}</text>');y+=32
  return y
 def rect(x,y,w,h,fill='#f5f7f8'):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="#d8dce0"/>'
 def path(d,color='#657079'):out.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="2"/>')
 def card(item,x,y,w=404,fill='#f5f7f8'):
  at=len(out);cy=text(item['title'],x+18,y+32,int((w-36)/20),20,True)
  cy=text(item['body'],x+18,cy+6,int((w-36)/18))+12
  out.insert(at,rect(x,y,w,cy-y,fill));return cy
 def down(y):path(f'M450 {y}v24m-6-6 6 6 6-6')
 y=text(b['caption'],28,40,42,22,True)+16;layout=spec['layout']
 if layout=='csrf-v2-architecture':
  top=y;at=len(out);y=text(b['items'][0]['title'],48,y+32,40,22,True);y=text(b['items'][0]['body'],48,y+4,40)+12
  y=max(card(item,x,y,384) for x,item in zip([48,468],b['items'][1:3]))+16
  y=card(b['items'][3],48,y,804,'#edf4fa')+16;out.insert(at,rect(28,top,844,y-top,'#fbfcfd'));y+=24
  for x in [230,670]:path(f'M{x-6} {y}v26m-5-5 5 5 5-5M{x+6} {y+26}V{y}m-5 5 5-5 5 5')
  y+=58
  for x,item in zip([230,670],b['items'][4:]):text('Browser ↔ '+item['title'],x,y,22,17,False,True)
  y+=32
  for x in [230,670]:text('HTTPS Request / Response',x,y,22,17,False,True)
  y+=42;y=max(card(item,x,y,404,'#fbfcfd') for x,item in zip([28,468],b['items'][4:]))+16
 elif layout=='csrf-v2-request':
  bottoms=[]
  for i,item in enumerate(b['items']):
   x=28+i*294;cy=text(item['title'],x+128,y+32,12,20,True,True);cy=text(item['body'],x+128,cy+6,12,18,False,True);bottoms.append(cy)
   if i<2:path(f'M{x+258} {y+44}h25m-6-6 6 6-6 6')
  y=max(bottoms)+16
 elif layout=='csrf-v2-scenarios':
  for i,item in enumerate(b['items']):
   y=text(item['title'],66,y+24,39,20,True)
   icon=['M8 15l7-7M7 12l-2 2a4 4 0 0 0 6 6l2-2M12 7l2-2a4 4 0 1 1 6 6l-2 2','M3 4h18v16H3V4Zm0 13 6-6 4 4 3-3 5 5M14 8h1','M3 5h18v14H3V5Zm0 5h18','M3 7h14m-5-5 5 5-5 5M21 17H7m5-5-5 5 5 5','M3 5h12v14H3V5Zm12 5 6-4v12l-6-4'][i]
   out.append(f'<path d="{icon}" transform="translate(28 {y-52})" fill="none" stroke="#657079" stroke-width="2"/>')
   for paragraph in item['body'].split('\n'):
    if paragraph.startswith('<img'):
     at=len(out);top=y-8;out.append('<g font-family="ui-monospace, Consolas, monospace">');y=text(paragraph,82,y+24,37,18)+12;out.append('</g>');out.insert(at,rect(66,top,806,y-top,'#f2f6f5'));y+=24
    else:y=text(paragraph,66,y+8,39)
   y+=12;path(f'M28 {y}H872','#d8dce0');y+=24
 elif layout=='csrf-v2-outcomes':
  for i,item in enumerate(b['items']):
   color='#b52323' if i==3 else '#657079'
   icon='M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-3 6 6 6m0-6-6 6' if i<2 else 'M12 3l8 4v6c0 5-8 9-8 9s-8-4-8-9V7l8-4Zm-4 9 3 3 5-6' if i==2 else 'M12 3 2 21h20L12 3Zm0 6v6m0 2v1'
   out.append(f'<path d="{icon}" transform="translate(28 {y})" fill="none" stroke="{color}" stroke-width="2"/>')
   y=text(item['title'],66,y+24,39,20,True);y=text(item['body'],66,y+4,39)+12;path(f'M28 {y}H872','#d8dce0');y+=32
 elif layout=='csrf-v2-conditions':
  root_end=card(b['items'][0],280,y,340,'#e6f5ec');group_y=root_end+88;xs=[28,200,548,720];ws=[156,332,156,156];ends=[]
  for x,w,i in zip(xs,ws,range(1,5)):
   path(f'M450 {root_end}V{root_end+44}H{x+w/2}V{group_y}m-5-7 5 7 5-7')
   ends.append(card(b['items'][i],x,group_y,w,'#e6f5ec'))
  leaf_y=max(ends)+88;bottoms=[]
  for i,(children,x,w,end) in enumerate(zip(spec['groups'],xs,ws,ends)):
   child_w=(w-16*(len(children)-1))/len(children)
   for j,child in enumerate(children):
    cx=x+j*(child_w+16);path(f'M{x+w/2} {end}V{leaf_y-44}H{cx+child_w/2}V{leaf_y}m-5-7 5 7 5-7')
    bottoms.append(card(b['items'][child],cx,leaf_y,child_w,'#e6f5ec'))
  y=max(bottoms)+16
 else:
  assert layout=='csrf-v2-decisions'
  for i,item in enumerate(b['items']):
   y=text(item['title'],42,y+24,40,20,True);y=text(item['body'],42,y+6,40)+16
   if i<2:down(y);y+=68
 y=text(b['description'],28,y+30,42,17)+24
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(b["caption"])}</title><desc id="desc">{escape(b["description"])}</desc><rect width="900" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
