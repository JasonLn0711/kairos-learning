"""Reviewed four-topic serializers; no caller-supplied markup or geometry."""
from html import escape
from aase_m0104_svg import wrap
COLORS=['#245fe8','#0d928a','#b57a1c','#7739e8']
def render_supplement(b,lang,spec):
 out=[]
 def text(value,x,y,width=40,size=18,bold=False,center=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,width):
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}" text-anchor="{"middle" if center else "start"}">{escape(line)}</text>');y+=32
  return y
 def rect(x,y,w,h,fill='#fbfcfd'):
  return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{fill}" stroke="#d8dce0"/>'
 y=text(b['caption'],28,40,41,22,True)+18
 if spec['layout']=='day02-priority':
  cols=[(28,4),(100,15),(415,7),(565,15)]
  for (x,width),label in zip(cols,['排名','觀念','建議占比','考試定位']):text(label,x,y,width,18,True)
  y+=48
  for i,item in enumerate(b['items']):
   assert item['body'].startswith(str(spec['weights'][i])+'%｜')
   cells=[str(spec['ranks'][i]),item['title'],item['body'].split('｜')[0],item['body'].split('｜')[1]]
   y=max(text(value,x,y,width,18,j==1) for j,((x,width),value) in enumerate(zip(cols,cells)))+8
   out.append(f'<path d="M28 {y}H872" stroke="#d8dce0"/>');y+=32
  x=28
  for i,weight in enumerate(spec['weights']):out.append(rect(x,y,844*weight/100-3,24,COLORS[i]));x+=844*weight/100
  y+=70
 elif spec['layout']=='day02-tree':
  depths=[0,1,2,1,2]
  for i,item in enumerate(b['items']):
   x=42+depths[i]*40
   icon='M3 7V5h6l3 3h9v12H3V7Zm0 3h18' if i in (0,1,3) else 'M6 3h8l4 4v14H6V3Zm3 8h6m-6 4h6'
   out.append(f'<path d="{icon}" transform="translate({x} {y})" fill="none" stroke="#657079" stroke-width="1.8"/>')
   if i==4:out.append(f'<path d="M10 11v-1a2 2 0 0 1 4 0v1m-5 0h6v6H9v-6Z" transform="translate({x} {y})" fill="none" stroke="#657079" stroke-width="1.4"/>')
   y=text(item['title'],x+36,y+22,32,20,True)
   y=text(item['body'],x+36,y+2,32)+18
 else:
  assert spec['layout']=='day02-boxflow'
  for i,item in enumerate(b['items']):
   top=y;start=len(out)
   y=text(item['title'],450,y+30,36,20,True,True)
   y=text(item['body'],450,y+8,39,18,False,True)+8
   if i>=2:out.insert(start,rect(28,top,844,y-top))
   if i<len(b['items'])-1:out.append(f'<path d="M450 {y+12}v24m-6-6 6 6 6-6" fill="none" stroke="#657079" stroke-width="2"/>');y+=66
 y=text(b['description'],28,y+32,41,17)+20
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(b["caption"])}</title><desc id="desc">{escape(b["description"])}</desc><rect width="900" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
