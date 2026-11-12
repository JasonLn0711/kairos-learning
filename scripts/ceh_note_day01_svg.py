"""Fixed, reviewed layouts for the thirteen Day 01 reference diagrams."""
from html import escape
from aase_m0104_svg import wrap

def render_day01(b,lang,spec):
 out=[]
 def text(value,x,y,width,size=18,bold=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,width):
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=size*1.65
  return y
 def rect(x,y,w,h,fill='#eef6f1'):
  return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="#adc8bc"/>'
 def card(i,x,y,w=844,fill='#eef6f1'):
  n=len(out);end=text(b['items'][i]['title'],x+18,y+34,int((w-36)/20),20,True);end=text(b['items'][i]['body'],x+18,end+6,int((w-36)/18),18)+14;out.insert(n,rect(x,y,w,end-y,fill));return end
 def arrow(x1,y1,x2,y2):
  # Fixed right/down paths only. Relationship labels remain in the description.
  head=f'm-7 -7 7 7 7-7' if y2>y1 else 'm-7 -7 7 7-7 7'
  out.append(f'<path d="M{x1} {y1}L{x2} {y2}{head}" fill="none" stroke="#557363" stroke-width="2"/>')
 y=text(b['caption'],28,42,40,24,True)+20
 layout=spec['layout']
 if layout=='day01-axes':
  for i,item in enumerate(b['items']):
   y=text(item['title'],28,y+24,42,20,True)+8
   if i<2:
    labels=item['body'].split('／' if lang=='zh' else ' / ');cols=3 if i==0 else 2;cw=816/cols
    for j in range(0,len(labels),cols):
     ends=[]
     for k,label in enumerate(labels[j:j+cols]):
      x=28+k*(cw+10);start=len(out);end=text(label,x+12,y+32,int((cw-24)/18),18)+12;out.insert(start,rect(x,y,cw-10,end-y));ends.append(end)
     y=max(ends)+12
   else:y=text(item['body'],28,y+24,44,18)+18
 elif layout=='day01-nested':
  def nest(i,x,top,w):
   start=len(out);cy=text(b['items'][i]['title'],x+18,top+34,int((w-36)/20),20,True);cy=text(b['items'][i]['body'],x+18,cy+5,int((w-36)/18),18)+12
   if i<3:cy=nest(i+1,x+20,cy,w-40)+20
   out.insert(start,rect(x,top,w,cy-top,['#f0f3f7','#e9f0f7','#e7f1ed','#dceddf'][i]));return cy
  y=nest(0,28,y,844)+20
 elif layout=='day01-firewall':
  ends=[card(i,28+i*288,y,268) for i in range(3)];ey=max(ends)
  for x in [306,594]:arrow(x,y+40,x+12,y+40)
  y=ey+30
  y=card(3,28,y)+18;y=card(4,28,y,844,'#fff1f0')+18
 elif layout=='day01-pdca':
  top=y;ends=[card(0,28,y,404),card(1,468,y,404)];y=max(ends)+48
  ends=[card(3,28,y,404),card(2,468,y,404)];y=max(ends)+20
  y=text('Plan → Do → Check → Act → Plan',28,y+22,44,19,True)+16
 elif layout=='day01-counts':
  values=[37,8,14,34]
  for i,v in enumerate(values):
   y=text(b['items'][i]['title'],28,y+24,42,20,True)
   out.append(rect(28,y,844,26,'#e7ece9'));out.append(rect(28,y,844*v/93,26,'#3d7660'));y+=58
   y=text(f'{v} / 93 ({v/93*100:.1f}%)',28,y,42,18)+16
  y=text('37 + 8 + 14 + 34 = 93',28,y+20,42,20,True)+20
 else:
  for i in range(len(b['items'])):y=card(i,28,y)+18
 y=text(b['description'],28,y+24,44,18)+20
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(b["caption"])}</title><desc id="desc">{escape(b["description"])}</desc><rect width="900" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
