"""Fixed reviewed layouts for the supplied HTTPS, scan comparison and UDP figures."""
from html import escape
from aase_m0104_svg import wrap

def render_day02b(b,lang,spec):
 out=[]
 def text(value,x,y,width=40,size=18,bold=False,center=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,width):
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}" text-anchor="{"middle" if center else "start"}">{escape(line)}</text>');y+=32
  return y
 def rect(x,y,w,h,fill='#fbfcfd'):
  return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="#94a3b8"/>'
 def card(item,x,y,w=404,fill='#fbfcfd'):
  start=len(out);end=text(item['title'],x+18,y+32,(w-36)//20,20,True)
  end=text(item['body'],x+18,end+8,(w-36)//18)+12
  out.insert(start,rect(x,y,w,end-y,fill));return end
 y=text(b['caption'],28,40,39,22,True)+16
 if spec['layout']=='day02b-https':
  y=max(card(b['items'][i],28+i*480,y,364,'#eceef1') for i in range(2))+20
  out.append(f'<path d="M250 {y}H650" stroke="#7b879a" stroke-width="2" stroke-dasharray="8 8"/>')
  y=text('網際網路 · 概念連線（虛線）',450,y+36,38,18,False,True)+18
  for item,color in zip(b['items'][2:],['#eceef1','#e5f3ec','#e7edfb','#f1e8fa']):y=card(item,70,y,760,color)+18
 elif spec['layout']=='day02b-scans':
  ends=[]
  for column in range(2):
   x=28+column*430;start=len(out);top=y
   cy=text('TCP Connect Scan' if column==0 else 'TCP SYN Scan',x+18,y+34,18,20,True)
   cy=text('Nmap -sT' if column==0 else 'Nmap -sS',x+18,cy+6,18)+8
   text('Client',x+18,cy+16,8,17);text('Server',x+310,cy+16,8,17);cy+=60
   for i,item in enumerate(b['items'][column*3:column*3+3]):
    cy=text(item['title'],x+202,cy,18,20,True,True)
    color=['#245fe8','#00856b','#7739ba'][i]
    path=f'M{x+380} {cy}H{x+24}m10-8-10 8 10 8' if i==1 else f'M{x+24} {cy}H{x+380}m-10-8 10 8-10 8'
    out.append(f'<path d="{path}" fill="none" stroke="{color}" stroke-width="2"/>')
    cy=text(item['body'],x+18,cy+42,19)+34
   out.insert(start,rect(x,top,404,cy-top,'#f4f6f8'));ends.append(cy)
  y=max(ends)+18
 else:
  assert spec['layout']=='day02b-udp'
  y=text(b['items'][0]['title'],450,y+20,39,20,True,True)
  y=text(b['items'][0]['body'],450,y+8,39,18,False,True)+18
  y=text('依觀察結果分成下列四種情況',450,y,39,18,False,True)+16
  for index in [1,3]:y=max(card(item,28+j*430,y) for j,item in enumerate(b['items'][index:index+2]))+18
 y=text(b['description'],28,y+28,41,17)+20
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(b["caption"])}</title><desc id="desc">{escape(b["description"])}</desc><rect width="900" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
