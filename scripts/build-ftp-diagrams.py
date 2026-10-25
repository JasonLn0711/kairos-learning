"""Export the same bilingual sequence/mode specifications as the responsive HTML."""
import json, html, unicodedata, textwrap
from pathlib import Path
root=Path(__file__).resolve().parents[1]
specs=json.loads((root/'src/lib/m0403-diagrams.json').read_text())
def wrap(s,limit=66):
 if all(unicodedata.east_asian_width(c) not in 'WF' for c in s):return textwrap.wrap(s,width=limit,break_long_words=False,break_on_hyphens=False)
 out=[];line='';n=0
 for ch in s:
  w=2 if unicodedata.east_asian_width(ch) in 'WF' else 1
  if n+w>limit:out.append(line);line='';n=0
  line+=ch;n+=w
 if line:out.append(line)
 return out
for lang,diagrams in specs.items():
 for key,spec in diagrams.items():
  elements=[];y=40
  def text(s,x=360,size=17,center=True):
   global y
   for line in wrap(s,70 if size<20 else 50):
    elements.append(f'<text x="{x}" y="{y}" text-anchor="{"middle" if center else "start"}" font-size="{size}">{html.escape(line)}</text>');y+=size*1.6
  text(spec['title'],size=23);y+=10
  panels=spec.get('panels',[{'title':'','rows':spec['rows'],'note':''}]) if 'rows' in spec else spec['panels']
  for panel in panels:
   if panel['title']:text(panel['title'],size=20)
   elements.append(f'<g stroke="#416b82" fill="none" stroke-width="2"><rect x="68" y="{y}" width="44" height="28" rx="3"/><path d="M62 {y+34}h56l-6-6H68z"/><rect x="610" y="{y-3}" width="34" height="40" rx="3"/><path d="M610 {y+10}h34M610 {y+23}h34"/></g>');y+=61
   elements.append(f'<text x="90" y="{y}" text-anchor="middle">Client</text><text x="630" y="{y}" text-anchor="middle">Server</text>');y+=24
   for row in panel['rows']:
    count=len(wrap(row['label']))+len(wrap(row['channel']))
    height=count*27+54
    elements.append(f'<rect x="30" y="{y-10}" width="660" height="{height}" rx="12" fill="{"#e8eef7" if "data" in row["channel"] or "資料" in row["channel"] else "#fff"}" stroke="#b2c0b7"/>')
    y+=13;text(row['channel'],size=15);text(row['label']);y+=6
    x1,x2=(95,625) if row['from']=='Client' else (625,95)
    elements.append(f'<path d="M{x1} {y}H{x2}" fill="none" stroke="#476195" stroke-width="3" marker-end="url(#arrow)"/>');y+=52
   if panel['note']:text(panel['note'],size=15)
   y+=20
  text(spec['caption'],size=15);y+=15
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="{round(y)}" viewBox="0 0 720 {round(y)}" role="img" aria-labelledby="title desc"><title id="title">{html.escape(spec["title"])}</title><desc id="desc">{html.escape(spec["caption"])}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#476195"/></marker></defs><rect width="720" height="100%" rx="16" fill="#f7f5ef"/><g font-family="system-ui,sans-serif" fill="#303632">'+''.join(elements)+'</g></svg>\n'
  out=root/f'site/images/ceh/m04-03-{key}-{lang}.svg';out.write_text(svg);assert out.stat().st_size<100000
  print(out.name,out.stat().st_size)
