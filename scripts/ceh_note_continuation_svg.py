"""Fixed reviewed layouts for the seventeen continuation references; no raw SVG input."""
from html import escape
from aase_m0104_svg import wrap

def render_continuation(b,lang,spec):
 out=[];width=900
 def text(value,x,y,columns=43,size=18,bold=False,center=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,columns):
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}" text-anchor="{"middle" if center else "start"}">{escape(line)}</text>');y+=32
  return y
 def rect(x,y,w,h,fill='#e6f5ec'):
  return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="#b8d5c5"/>'
 def path(d,dashed=False):out.append(f'<path d="{d}" fill="none" stroke="#77867f" stroke-width="2"'+(' stroke-dasharray="5 4"' if dashed else '')+'/>')
 def card(item,x,y,w):
  start=len(out);columns=max(5,int((w-36)/20));cy=text(item['title'],x+w/2,y+32,columns,20,True,True)
  cy=text(item['body'],x+w/2,cy+6,max(5,int((w-36)/18)),18,False,True)+12
  i=b['items'].index(item);name=b['name'];fill='#e6f5ec'
  if (name=='authorizationgates' and i in [2,4]) or (name=='transactiontampering' and i==1) or (name=='serviceavailability' and i==1) or (name=='transportprotection' and i<3):fill='#fbeeee'
  elif (name=='itotrisks' and i==0) or (name=='ciaobjectives' and i==0) or (name=='signatureevidence' and i==2):fill='#e9f2fa'
  elif (name=='ciaobjectives' and i==2) or (name=='itotrisks' and i==1):fill='#f7f1e9'
  elif name=='ciaobjectives' and i>2:fill='#f6f7f8'
  out.insert(start,rect(x,y,w,cy-y,fill));return cy
 def arrow(y,x=450):path(f'M{x} {y}v24m-6-6 6 6 6-6')
 y=text(b['caption'],28,40,40,22,True)+16
 layout=spec['layout'].replace('continuation-','');items=b['items']
 if layout=='graph':
  boxes={}
  for row in spec['rows']:
   count=len(row);w=(816-40*(count-1))/count;ends=[]
   for col,i in enumerate(row):
    x=28+col*(w+40);bottom=card(items[i],x,y,w);boxes[i]=(x,y,w,bottom-y);ends.append(bottom)
   bottom=max(ends)
   # Stretch cards to rank height, so arrows meet card boundaries rather than empty space.
   for i in row:
    x,top,w,h=boxes[i];boxes[i]=(x,top,w,bottom-top)
    for k,entry in enumerate(out):
     if entry.startswith(f'<rect x="{x}" y="{top}" width="{w}" height="{h}"'):
      out[k]=entry.replace(f'height="{h}"',f'height="{bottom-top}"',1);break
   y=bottom+88
  connections=[]
  for edge in spec['edges']:
   a,z,key,*both=edge;x1,t1,w1,h1=boxes[a];x2,t2,w2,h2=boxes[z]
   horizontal=t1==t2
   if horizontal:
    sx,sy=x1+w1,t1+h1/2;tx,ty=x2,t2+h2/2
    d=f'M{sx} {sy}H{tx}m-7-5 7 5-7 5'
    if both:d+=f'M{sx+7} {sy-5}l-7 5 7 5'
    lx,ly=(sx+tx)/2,sy-12
   else:
    sx,sy=x1+w1/2,t1+h1;tx,ty=x2+w2/2,t2
    ra=next(i for i,r in enumerate(spec['rows']) if a in r);rz=next(i for i,r in enumerate(spec['rows']) if z in r)
    mid=(sy+ty)/2
    if rz-ra>1:d=f'M{x1+w1} {t1+h1/2}H875V{ty-28}H{tx}V{ty}m-6-7 6 7 6-7'
    else:d=f'M{sx} {sy}V{mid}H{tx}V{ty}m-6-7 6 7 6-7'
    lx,ly=(sx+tx)/2,mid-10
   connections.append(f'<path d="{d}" fill="none" stroke="#77867f" stroke-width="2"/>')
   if key:
    label={'yes':'是' if lang=='zh' else 'Yes','no':'否' if lang=='zh' else 'No','optional':'必要時' if lang=='zh' else 'If needed'}.get(key,key)
    connections.append(f'<text x="{lx}" y="{ly}" text-anchor="middle" font-size="16">{escape(label)}</text>')
  out=connections+out;y-=50
 elif layout in ('parallel','paired'):
  lanes=[items[0:len(items)//2],items[len(items)//2:]] if layout=='paired' else [items[i:i+2] for i in range(0,len(items),2)]
  if layout=='paired':
   ends=[]
   for col,lane in enumerate(lanes):
    cy=y
    for i,item in enumerate(lane):
     cy=card(item,28+col*430,cy,402)
     if i<len(lane)-1:arrow(cy+12,229+col*430);cy+=68
    ends.append(cy)
   y=max(ends)+20
  else:
   for row in lanes:y=max(card(item,28+col*430,y,402) for col,item in enumerate(row))+24
 elif layout in ('bars','bytes'):
  for i,item in enumerate(items):
   y=text(item['title'],28,y+20,40,20,True)+12
   if layout=='bars':out.append(rect(28,y,408 if i==0 else 816,18,'#c6dfea'));y+=50
   else:
    n=16 if i==0 else 32
    for j in range(n):
     x=28+(j%16)*51;cy=y+(j//16)*44
     out.append(rect(x,cy,48,36,'#c6dfea' if i==0 else '#c5e3d7'))
     text(str(j+1),x+24,cy+24,3,14,False,True)
    y+=44*(n//16)+20
   y=text(item['body'],28,y,43)+30
 elif layout=='digest':
  for item in items:
   top=y;a=text(item['title'],42,top+24,18,20,True);c=text(item['body'],520,top+24,18,20)
   path(f'M440 {top+18}h40m-7-6 7 6-7 6');y=max(a,c)+28
 elif layout=='nested':
  start=len(out);top=y;y=text(items[0]['title'],48,y+35,39,20,True);y=text(items[0]['body'],48,y+8,40)+18
  y=card(items[1],60,y,780)+24;out.insert(start,rect(28,top,844,y-top,'#f7faf8'));y+=20
 elif layout=='aes':
  y=card(items[0],28,y,844);arrow(y+12);y+=70
  start=len(out);top=y;y=text(items[1]['title'],450,y+32,40,20,True,True)+16
  for i,name in enumerate(items[1]['body'].split('\n')):
   x=50+(i%3)*280;cy=y+(i//3)*64
   out.append(rect(x,cy,250,50,'#b9dec9' if name=='Rijndael' else '#ffffff'));text(name,x+125,cy+32,15,18,name=='Rijndael',True)
  y+=144;out.insert(start,rect(28,top,844,y-top,'#f7faf8'));arrow(y+12);y+=70;y=card(items[2],28,y,844)+20
 elif layout=='sequence':
  top=y;ends=[]
  for i,item in enumerate(items[:3]):ends.append(card(item,28+i*288,y,268))
  header_bottom=max(ends)
  for i,end in enumerate(ends):
   original=rect(28+i*288,top,268,end-top)
   out[out.index(original)]=rect(28+i*288,top,268,header_bottom-top)
  y=header_bottom+32;start=header_bottom;lifeline_index=len(out)
  directions=[None,(0,1),(2,1),(1,2),(1,2),(1,2),None,(2,1),None]
  for i,item in enumerate(items[3:]):
   if directions[i]:
    a,z=directions[i];left=min(a,z)*288+162;right=max(a,z)*288+162
    middle=(left+right)/2
    y=text(item['title'],middle,y+24,int((right-left-16)/20),20,True,True)
    y=text(item['body'],middle,y+4,int((right-left-16)/18),18,False,True)+12
    sx=162+a*288;tx=162+z*288;head=-8 if tx>sx else 8
    path(f'M{sx} {y}H{tx}m{head}-6 {-head} 6 {head} 6',i in [1,3,4,5]);y+=40
   else:
    x,w={0:(28,556),6:(604,268),8:(316,556)}[i]
    startbox=len(out);ty=y;y=text(item['title'],x+w/2,y+28,int((w-32)/20),20,True,True);y=text(item['body'],x+w/2,y+6,int((w-32)/18),18,False,True)+14
    out.insert(startbox,rect(x,ty,w,y-ty,'#fff6e9'));y+=24
  for i in range(3):out.insert(lifeline_index,f'<path d="M{162+i*288} {start}V{y}" fill="none" stroke="#a2aaa6" stroke-width="2"/>')
 else:raise ValueError(layout)
 y=text(b['description'],28,y+32,43,17)+18
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(b["caption"])}</title><desc id="desc">{escape(b["description"])}</desc><rect width="900" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
