"""Export four paired M06-02 figures from the validated lesson data."""
import json,sys,xml.etree.ElementTree as ET
from pathlib import Path
from html import escape
from aase_m0104_svg import wrap
R=Path(__file__).resolve().parents[1]
def render(f,n,lang):
 out=[]
 def text(value,x,y,width=45,size=20,bold=False):
  for line in wrap(value,width):
   out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=34
  return y
 def box(title,body,x,y,w=960,color='#64748b'):
  start=len(out);top=y;y=text(title,x+18,y+32,int((w-36)/22),22,True);y=text(body,x+18,y+6,int((w-36)/22))+12
  out.insert(start,f'<rect x="{x}" y="{top}" width="{w}" height="{y-top}" rx="12" fill="#fbfcfd" stroke="{color}" stroke-width="2"/>');return y
 y=text(f['caption'],40,44,44,24,True)+20
 if f['kind']=='cards':
  for i in [0,2]:
   y=max(box(f['items'][i]['title'],f['items'][i]['body'],40,y,460),box(f['items'][i+1]['title'],f['items'][i+1]['body'],540,y,460))+24
 else:
  for inside in [False,True]:
   y=text(('系統範圍內：' if inside else '系統範圍外') if lang=='zh' else ('Inside the system scope:' if inside else 'Outside the system scope'),40,y,44,20,True)+12
   if inside:y=text(f['boundary'],40,y)+12
   boundary_start=len(out);boundary_top=y-8
   for node in f['nodes']:
    if node['inside']!=inside:continue
    role=('人／角色' if lang=='zh' else 'Person / role') if node['kind']=='person' else ('軟體系統' if lang=='zh' else 'Software system')
    y=box(node['title'],role+' · '+node['body'],40,y,color=('#36751b' if node['id']=='customer' else '#b62032' if node['id']=='email' else '#a35c00' if node['id']=='core' else '#3074aa'))+24
   if inside:out.insert(boundary_start,f'<rect x="28" y="{boundary_top}" width="984" height="{y-boundary_top-10}" rx="14" fill="none" stroke="#3074aa" stroke-width="2" stroke-dasharray="8 5"/>')
   y+=16
  y=text('有方向的關係' if lang=='zh' else 'Directed relationships',40,y,44,22,True)+12
  titles={node['id']:node['title'] for node in f['nodes']}
  for edge in f['relations']:
   top=y;y=text(titles[edge['from']],64,y+32,40,20,True)+12
   # The arrow remains tied to the explicit endpoints at every export width.
   out.append(f'<path d="M78 {y-8}v24m-7-7 7 7 7-7" fill="none" stroke="#526674" stroke-width="2"'+(' stroke-dasharray="4 3"' if n==3 else '')+'/>');y+=48
   y=text(titles[edge['to']],64,y,40,20,True)+8;y=text(edge['label'],64,y,40)+24
   out.append(f'<path d="M40 {y-8}H1000" stroke="#cbd5e1"/>')
 y=text(f['description'],40,y+16,44)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fff"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','stroke-dasharray','d'}
 assert all(e.tag.split('}')[-1] in allowed and all(k in attrs for k in e.attrib)for e in tree.iter());assert len(svg.encode())<100000
 return svg.encode()
def main():
 l=json.loads((R/'content/aase/lessons/aase-m06-c02.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in l['text'][lang]['sections'] for b in s.get('blocks',[])if b['kind']in ['architecture','cards']];assert len(figures)==4
  for n,f in enumerate(figures,1):
   data=render(f,n,lang);p=R/f'site/images/aase/m06-02-{n}-{lang}.svg'
   if '--check' in sys.argv:assert p.read_bytes()==data
   else:p.write_bytes(data)
   print(f'{p.name}: {len(data)} bytes')
if __name__=='__main__':main()
