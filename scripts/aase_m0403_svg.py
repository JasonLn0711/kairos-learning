"""Export M04-03's six diagrams with the same text and relationships as HTML."""
from pathlib import Path
from html import escape
import json,sys,xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[]
 def text(value,x,y,width=42,size=20,bold=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,width):
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=34
  return y
 def box(x,y,w,h,fill='#fbfcfd',stroke='#bccbd0'):
  return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="{stroke}"/>'
 y=text(f['caption'],36,44,43,24,True)+20
 if n==1:
  top=y-24;pos=len(out);out.append('')
  y=text(f['items'][0]['title'],56,y,40,22,True)+8;y=text(f['items'][0]['body'],56,y,40)+18
  middle=y-20;pos2=len(out);out.append('')
  y=text(f['items'][1]['title'],86,y+8,36,22,True)+8;y=text(f['items'][1]['body'],86,y,36)+18
  inner=y-20;pos3=len(out);out.append('')
  y=text(f['items'][2]['title'],116,y+8,33,22,True)+8;y=text(f['items'][2]['body'],116,y,33)+12
  out[pos3]=box(96,inner,840,y-inner,'#efedfa','#7468a3');y+=20
  out[pos2]=box(66,middle,900,y-middle,'#e6f2fb','#397c9b');y+=20
  out[pos]=box(36,top,960,y-top,'#edf7f4','#368079');y+=44
 elif n==2:
  top=y-26;pos=len(out);out.append('');y=text(f['items'][0]['title'],56,y,42,22,True)+6;y=text(f['items'][0]['body'],56,y,42)+10;out[pos]=box(36,top,968,y-top,'#e0f2ed');y+=32
  rootbottom=y-32;branchy=y+38;ends=[]
  out.append(f'<path d="M520 {rootbottom}v24M151 {rootbottom+24}H886" fill="none" stroke="#65757c" stroke-width="2"/>')
  for i,item in enumerate(f['items'][1:]):
   x=36+i*245;start=branchy;top=start-26;pos=len(out);out.append('')
   out.append(f'<path d="M{x+115} {rootbottom+24}V{top}" stroke="#65757c" stroke-width="2"/>')
   end=text(item['title'],x+18,start,8,22,True)+12
   parenttop=end
   for line in item['body'].split('\n'):
    child=line.startswith('  ');tx=x+(48 if child else 24)
    if child:
     out.append(f'<path d="M{x+34} {parenttop+8}V{end-8}h8" fill="none" stroke="#8b9ca3"/>')
    else:
     parenttop=end
     out.append(f'<path d="M{x+12} {start+12}V{end-8}h8" fill="none" stroke="#8b9ca3"/>')
    end=text(line.strip(),tx,end,7 if child else 8)+8
   out[pos]=box(x,top,230,end-top+6);ends.append(end)
  y=max(ends)+46
 elif n==3:
  top=y-26;positions=[];ends=[]
  for i,item in enumerate(f['items']):
   x=36+i*500;pos=len(out);out.append('');positions.append(pos)
   end=text(item['title'],x+20,y,19,20,True)+16
   for j,part in enumerate(item['body'].split('\n\n')):
    pstart=end-24;pos=len(out)
    end=text(part,x+24,end,19,22 if j==0 else 20,j==0)+16
    if (i==0 and j==1) or (i==1 and j in [3,4]):out.insert(pos,box(x+12,pstart,444,end-pstart-6,'#e3ecfb' if i==1 and j==4 else '#edf0f2','#a75b4a' if i==1 and j==3 else '#bccbd0'))
   ends.append(end)
  y=max(ends)+12
  # Fill reserved backgrounds after all content, without shifting their indices.
  # Positions are captured after the inserts for each column.
  for i in range(2):
   empty=out.index('');out[empty]=box(36+i*500,top,468,y-top)
  y+=44
 elif n==5:
  top=y-24;ends=[]
  for i,item in enumerate(f['items']):
   x=36+i*500;end=text(item['title'],x+20,y,19,22,True)+12
   for j,line in enumerate(item['body'].split('\n')):
    # Desktop retains side-by-side inputs; mobile retains the same numbered order.
    if i==0 and j in [1,2]:
     bx=x+14+(j-1)*220;by=end if j==1 else pairtop;pos=len(out);out.append('');after=text(line,bx+12,by,8)+12;out[pos]=box(bx,by-24,212,after-by+24,'#edf0f2')
     if j==1:pairtop=by;pairend=after
     else:end=max(pairend,after)+12
    else:
     pos=len(out);out.append('');after=text(line,x+26,end,19)+12;out[pos]=box(x+14,end-24,440,after-end+24,'#e3ecfb' if j==3 else '#edf0f2');end=after+12
   ends.append(end)
  y=max(ends)+24
 else:
  for i,item in enumerate(f['items']):
   top=y-24;pos=len(out);out.append('')
   y=text((f'{i+1}. ' if n==6 else '')+item['title'],56,y,41,22,True)+6;y=text(item['body'],56,y,41)+10
   out[pos]=box(36,top,968,y-top,'#e3ecfb' if n==6 and i==len(f['items'])-1 else '#fbfcfd')
   if n==6 and i<len(f['items'])-1:out.append(f'<path d="M520 {y+8}v22m-7-7 7 7 7-7" fill="none" stroke="#65757c" stroke-width="2"/>');y+=64
   else:y+=36
 y=text(f['description'],36,y,44)+20
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
 allowed={'svg','title','desc','rect','g','text','path'};attrs={'xmlns','viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
 assert all(e.tag.split('}')[-1] in allowed and set(e.attrib)<=attrs for e in ET.fromstring(svg).iter())
 assert len(svg.encode())<100000
 return svg.encode()
def main():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m04-c03.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections'] for b in s.get('blocks',[]) if b['kind'] in ['cards','flow']]
  assert [len(f['items']) for f in figures]==[3,5,2,4,2,5]
  for n,f in enumerate(figures,1):
   data=render(f,n,lang);path=ROOT/f'site/images/aase/m04-03-{n}-{lang}.svg'
   if '--check' in sys.argv:assert path.read_bytes()==data,str(path)
   else:path.write_bytes(data)
   print(f'{path.name}: {len(data)} bytes')
if __name__=='__main__':main()
