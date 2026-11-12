"""Fixed 15:120 recovery timeline, separate labels; no executable or raw SVG input."""
from html import escape
from aase_m0104_svg import wrap

def render_recovery_timeline(b,lang):
 out=[]
 def text(value,x,y,columns=44,size=18,bold=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,columns):
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=32
  return y
 def rect(x,y,w,h,fill='#f1f6f3'):
  return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="{fill}"/>'
 y=text(b['caption'],28,40,40,22,True)+22
 # The shared 844-unit scale spans -15 to +120 minutes: lengths are exactly 1:8.
 rpo=844/9;rto=844*8/9;mid=28+rpo
 out.append(rect(28,y,rpo,9,'#ac772b'));out.append(rect(mid,y,rto,9,'#2c8478'))
 for x in [28,mid,872]:out.append(rect(x-1.5,y-12,3,33,'#455952'))
 y=text('RPO 15 min : RTO 120 min = 1:8',28,y+62,44,19,True)+18
 for item in b['items']:
  start=len(out);top=y;y=text(item['title'],46,y+34,39,20,True);y=text(item['body'],46,y+6,42,18)+14;out.insert(start,rect(28,top,844,y-top));y+=20
 y=text(b['description'],28,y+20,44,18)+18
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(b["caption"])}</title><desc id="desc">{escape(b["description"])}</desc><rect width="900" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
