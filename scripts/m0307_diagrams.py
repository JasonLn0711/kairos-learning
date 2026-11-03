"""Generate paired M03-07 HTML-model downloads with the existing safe serializer.

The JSON model supplies all titles, captions and nodes to both the sourceBody
HTML flow and these standalone SVGs. No arbitrary runtime SVG is accepted.
"""
from pathlib import Path
from html import escape
import json,sys,unicodedata,zipfile,io,xml.etree.ElementTree as ET
from m0903_svg import sanitized_svg,NS
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/m03-07'

def width(text):
 return sum(2 if unicodedata.east_asian_width(c) in 'WF' else 1 for c in text)

def wrap(text,limit):
 # Chinese may wrap between characters; English stays at spaces.
 tokens=list(text) if any(unicodedata.east_asian_width(c) in 'WF' for c in text) else text.split(' ')
 join='' if tokens==list(text) else ' '
 lines=[];current=''
 for token in tokens:
  candidate=current+join+token if current else token
  if current and width(candidate)>limit:lines.append(current);current=token
  else:current=candidate
 if current:lines.append(current)
 assert all(width(line)<=limit for line in lines),(text,lines)
 return lines

def make_svg(name,lang,block):
 v=block['visual'];prefix=f'm0307-{name}-{lang}-';nodes=v['items']
 assert block['kind']=='visual' and v['kind'] in ('flow','cards')
 assert len(nodes)==(4 if name=='workflow' else 3)
 assert list(block)==['kind','src','downloadLabel','visual']
 assert list(v)==['kind','caption','description','items']
 assert all(set(n)=={'title','body'} and all(isinstance(t,str) and '<' not in t for t in n.values()) for n in nodes)
 desc=wrap(v['description'],61);height=105+len(desc)*23+len(nodes)*145
 out=[f'<svg xmlns="{NS}" viewBox="0 0 640 {height}" role="img" aria-labelledby="{prefix}title {prefix}desc">',f'<title id="{prefix}title">{escape(v["caption"])}</title>',f'<desc id="{prefix}desc">{escape(v["description"])}</desc>',f'<defs><marker id="{prefix}arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#41617b"/></marker></defs>',f'<rect x="1" y="1" width="638" height="{height-2}" rx="20" fill="#f8fafc" stroke="#7892a6"/>']
 def text(x,y,s,size=16):
  assert 12<=y<=height-12
  out.append(f'<text x="{x}" y="{y}" font-family="Noto Sans CJK TC,sans-serif" font-size="{size}" fill="#172b3a">{escape(s)}</text>')
 text(28,39,v['caption'],21)
 for i,line in enumerate(desc):text(28,70+i*23,line)
 start=90+len(desc)*23
 for i,n in enumerate(nodes):
  y=start+i*145;out.append(f'<rect x="28" y="{y}" width="584" height="116" rx="14" fill="{["#e8f2fb","#e7f3ed","#fff3d8","#e8f2fb"][i]}" stroke="#7892a6"/>')
  assert width(n['title'])*10<550
  text(48,y+29,n['title'],19)
  lines=wrap(n['body'],61);assert len(lines)<=3
  for j,line in enumerate(lines):text(48,y+56+j*23,line)
  if v['kind']=='flow' and i<len(nodes)-1:out.append(f'<path d="M320 {y+116}V{y+141}" fill="none" stroke="#41617b" stroke-width="2" marker-end="url(#{prefix}arrow)"/>')
 out.append('</svg>');result=sanitized_svg('\n'.join(out),prefix)+'\n'
 assert len(result.encode())<100000
 return result.encode()

def generate():
 models=json.loads((SOURCE/'diagram-models.json').read_text());assert set(models)=={'workflow','evidence'}
 targets={};assets={}
 for name,langs in models.items():
  assert set(langs)=={'zh','en'}
  for lang,block in langs.items():
   assert block['src']==f'/images/ceh/m03-07-{name}-{lang}.svg'
   value=make_svg(name,lang,block);filename=Path(block['src']).name
   assets[filename]=value
   targets[ROOT/'site'/block['src'].lstrip('/')]=value
   targets[SOURCE/'figures'/filename]=value
 archive=io.BytesIO()
 with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
  for name,value in sorted(assets.items()):
   info=zipfile.ZipInfo(name,date_time=(2026,11,3,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16;z.writestr(info,value)
 targets[ROOT/'site/downloads/ceh-m03-07-bilingual-svg.zip']=archive.getvalue()
 return targets

if __name__=='__main__':
 for path,value in generate().items():
  if '--check' in sys.argv:assert path.read_bytes()==value,str(path)
  else:path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(value)
  print(f'{path.relative_to(ROOT)}: {len(value)} bytes')
 print('PASS: paired native-flow model, strict SVG sanitizer, bounded geometry/line lengths, deterministic assets. Browser viewport/visual checks remain pending.')
