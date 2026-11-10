"""Export the reviewed note figures from the same JSON used by HTML and search."""
import json,sys,datetime
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
from ceh_note_reference_svg import render_reference
ROOT=Path(__file__).resolve().parents[1]
COLORS=['#e9f2f7','#eaf5f1','#f7f3ea']
ICONS=json.loads((ROOT/'src/lib/note-cia-icons.json').read_text())
def render(b,lang):
 if b['kind']=='diagram':
  svg=render_reference(b,lang)
  validate_svg(svg)
  return svg.encode()
 out=[]
 def text(value,x,y,width=43,size=18,bold=False,center=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,width):
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}" text-anchor="{"middle" if center else "start"}">{escape(line)}</text>');y+=32
  return y
 def rect(x,y,w,h,fill='#fbfcfd'):
  return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{fill}" stroke="#d8dce0"/>'
 y=text(b['caption'],28,40,43,22,True)+12
 if b.get('name')=='workflow':
  for i,item in enumerate(b['items']):
   y=text(item['title'],450,y+16,43,20,True,True)
   y=text(item['body'],450,y+2,43,18,False,True)
   if i<3:out.append(f'<path d="M450 {y+3}v20m-5-5 5 5 5-5" fill="none" stroke="#657079" stroke-width="2"/>');y+=54
 elif b.get('name')=='cia':
  top=y;start=len(out);ends=[]
  for i,item in enumerate(b['items']):
   x=28+i*284;out.append('')
   out.append(f'<path d="{ICONS[i]}" transform="translate({x+120} {top+16})" fill="none" stroke="{["#0067b3","#006b39","#5c6064"][i]}" stroke-width="1.8"/>')
   cy=text('CIA'[i],x+136,top+76,20,24,True,True)
   cy=text(item['title'][4:],x+136,cy,23,18,False,True)
   cy=text(item['body'],x+136,cy,23,18,False,True);ends.append(cy)
  y=max(ends)+12
  # Insert same-height colored cards behind their corresponding selectable labels.
  for i in reversed(range(3)):out.insert(start,rect(28+i*284,top,272,y-top,COLORS[i]))
 else:
  assert b['kind']=='recall'
  for i,c in enumerate(b['cards']):
   top=y;start=len(out)
   y=text(f'{i+1} / {len(b["cards"])}',842,y+24,15,16,False,True)+8
   y=text(c['question'],450,y,38,20,False,True)+12
   y=text(('對應：' if lang=='zh' else 'References: ')+c['references'],42,y,43,16)+8
   y=text('參考答案' if lang=='zh' else 'Reference answer',42,y,43,18,True)
   for paragraph in c['answer']:y=text(paragraph,42,y+4,43)
   y+=12;out.insert(start,rect(28,top,844,y-top));y+=26
 y=text(b['description'],28,y+36,43,17)+16
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(b["caption"])}</title><desc id="desc">{escape(b["description"])}</desc><rect width="900" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
 validate_svg(svg)
 return svg.encode()
def validate_svg(svg):
 tree=ET.fromstring(svg)
 tags={'svg','title','desc','rect','g','text','path'}
 attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','stroke-dasharray','d','transform','text-anchor'}
 assert all(e.tag.split('}')[-1] in tags and all(k in attrs for k in e.attrib) for e in tree.iter())
 assert len(svg.encode())<100000
def main():
 today=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).date().isoformat()
 for path in sorted((ROOT/'content/ceh-notes').glob('*.json')):
  n=json.loads(path.read_text())
  if n['status']!='published' or n['publishedOn']>today:continue
  for p in n['parts']:
   if p['status']!='published' or p['publishedOn']>today:continue
   for lang in ['zh','en']:
    figures=[b for s in p['text'][lang]['sections'] for b in s['body'] if b['kind'] in ['figure','recall','diagram']]
    for b in figures:
     name=b.get('name','recall');data=render(b,lang);out=ROOT/f'site/images/ceh-notes/{n["date"]}-part-{p["number"]}-{name}-{lang}.svg'
     if '--check' in sys.argv:assert out.read_bytes()==data,f'Outdated: {out}'
     else:out.write_bytes(data)
     print(f'{out.name}: {len(data)} bytes')
if __name__=='__main__':main()
