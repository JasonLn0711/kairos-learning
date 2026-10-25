"""Generate standalone, text-based SVGs from the same data as DnsDiagram."""
import json,pathlib,html,unicodedata
ROOT=pathlib.Path(__file__).resolve().parents[1]
specs=json.loads((ROOT/'src/lib/m0402-diagrams.json').read_text())
def wrap(text,limit=62):
 out=[]
 for paragraph in text.split('\n'):
  line='';width=0
  for char in paragraph:
   n=2 if unicodedata.east_asian_width(char) in 'WF' else 1
   if width+n>limit:
    split=line.rfind(' ')
    if split>len(line)//3:out.append(line[:split]);line=line[split+1:]
    else:out.append(line);line=''
    width=sum(2 if unicodedata.east_asian_width(x) in 'WF' else 1 for x in line)
   line+=char;width+=n
  if line:out.append(line)
 return out
for ident,spec in specs.items():
 for lang in ['zh','en']:
  d=spec[lang];parts=[];y=38
  def text(value,bold=False):
   global y
   for line in wrap(value):
    parts.append(f'<text x="38" y="{y}" font-size="{18 if bold else 16}" font-weight="{650 if bold else 400}">{html.escape(line)}</text>');y+=28
  def card(title,body='',tint=False):
   global y
   start=y-22;inner=[]
   h=(len(wrap(title))+len(wrap(body)))*28+22
   parts.append(f'<rect x="22" y="{start}" width="676" height="{h}" rx="12" fill="{"#e8f0f5" if tint else "#fffef9"}" stroke="#778d80"/>')
   text(title,True)
   if body:text(body)
   y+=28
  text(d['title'],True);text(d['caption']);y+=16
  if ident=='resolution':
   card(d['client']);text('↓ '+('查詢' if lang=='zh' else 'Query'));card(d['resolver'],d['resolverEn'],True)
   text('✓ '+d['hit']+' → '+d['result']);text(d['miss']+' ↓');y+=14
   for i,item in enumerate(d['items']):
    card(str(i+1)+'. '+d['resolver']+' → '+item['title']+' · '+item['body'],'← '+item['after'])
   text(d['resolver']+' → '+d['client'].split('想查' if lang=='zh' else ' asks')[0]+'：'+d['result']);text(d['note'])
  else:
   for i,item in enumerate(d['items']):
    card(item['title'],item['body'],(ident=='lookup' and i==1) or (ident=='cname' and i==2))
    if spec['layout']=='cards':text(item['after']);y+=20
    elif i<len(d['items'])-1:text('↓ '+item['after']);y+=12
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="{y+20}" viewBox="0 0 720 {y+20}" role="img" aria-labelledby="title desc"><title id="title">{html.escape(d["title"])}</title><desc id="desc">{html.escape(d["caption"])}</desc><rect width="720" height="{y+20}" rx="18" fill="#f7f5ef"/><g font-family="sans-serif" fill="#303632">'+''.join(parts)+'</g></svg>\n'
  dest=ROOT/f'site/images/ceh/m04-02-{ident}-{lang}.svg';dest.write_text(svg)
  assert dest.stat().st_size<100000
  print(dest.name,dest.stat().st_size)
