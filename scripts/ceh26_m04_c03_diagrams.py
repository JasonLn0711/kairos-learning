"""Export the exact paired semantic card model through the reviewed SVG serializer."""
from pathlib import Path
from html import escape
import json,sys,re,unicodedata,io,zipfile
from m0903_svg import sanitized_svg,NS
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/ceh26-m04-c03'
def width(s):return sum(2 if unicodedata.east_asian_width(c) in 'WF' else 1 for c in s)
def wrap(s,limit=74):
 tokens=re.findall(r'[A-Za-z0-9_./:|\-]+|.',s);out=[];line=''
 for t in tokens:
  if line and width(line+t)>limit:out.append(line.strip());line=''
  line+=t
 if line:out.append(line.strip())
 assert all(width(l)<=limit for l in out)
 return out
assets={}
for name,langs in json.loads((S/'diagram-models.json').read_text()).items():
 for lang,b in langs.items():
  v=b['visual'];assert v['kind']=='cards' and 2<=len(v['items'])<=3
  assert all(set(x)=={'title','body'} for x in v['items'])
  prefix=f'ceh26m04c03-{name}-{lang}-';y=44;parts=[]
  def text(s,size=20):
   global y
   for l in wrap(s):parts.append(f'<text x="35" y="{y}" font-family="Noto Sans CJK TC,sans-serif" font-size="{size}" fill="#172b49">{escape(l)}</text>');y+=32
  text(v['caption'],24);y+=12;text(v['description'],18);y+=20
  for item in v['items']:
   start=y;h=44+32*(len(wrap(item['title']))+len(wrap(item['body'])))
   parts.append(f'<rect x="20" y="{start-24}" width="860" height="{h}" rx="12" fill="#ffffff" stroke="#8ba5bd"/>')
   text(item['title'],21);y+=12;text(item['body']);y=start+h+24
  height=y+20
  svg=f'<svg xmlns="{NS}" viewBox="0 0 900 {height}" role="img" aria-labelledby="{prefix}title {prefix}desc"><title id="{prefix}title">{escape(v["caption"])}</title><desc id="{prefix}desc">{escape(v["description"])}</desc><rect x="1" y="1" width="898" height="{height-2}" rx="16" fill="#f3f7fb" stroke="#b7c9df"/>'+''.join(parts)+'</svg>'
  data=(sanitized_svg(svg,prefix)+'\n').encode();assert len(data)<100000
  assets[Path(b['src']).name]=data
  for p in [R/'site'/b['src'].lstrip('/'),S/'figures'/Path(b['src']).name]:
   if '--check' in sys.argv:assert p.read_bytes()==data
   else:p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
archive=io.BytesIO()
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED) as z:
 for n,b in sorted(assets.items()):
  i=zipfile.ZipInfo(n,(2026,11,4,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=0o644<<16;z.writestr(i,b)
p=R/'site/downloads/ceh26-m04-c03-bilingual-svg.zip'
if '--check' in sys.argv:assert p.read_bytes()==archive.getvalue()
else:p.write_bytes(archive.getvalue())
print('PASS: four bounded sanitized SVGs and deterministic ZIP from paired card model')
