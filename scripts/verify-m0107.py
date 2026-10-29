"""Source fidelity and static diagram checks; not a browser/mobile visual test."""
from pathlib import Path
import re,json,xml.etree.ElementTree as ET,hashlib
R=Path(__file__).resolve().parents[1]
d=json.loads((R/'content/concepts/m01-07.json').read_text())
counts={}
for lang,suffix in [('zh',''),('en','.en')]:
 raw=(R/f'docs/sources/m01-07/user-primary-2026-10-29{suffix}.md').read_text()
 body=d['text'][lang]['sourceBody']; flat=json.dumps(body,ensure_ascii=False)
 checked=0;math=False
 for line in raw.splitlines():
  s=line.strip()
  if not s or s=='---' or s.startswith('# ') or 'sandbox:/mnt/data/' in s:continue
  if s=='\\[':math=True;continue
  if math:
   if s=='\\]':math=False
   continue
  if s.startswith('|'):
   if re.fullmatch(r'[| :\-]+',s):continue
   units=[x.strip() for x in s.strip('|').split('|')]
  else:units=[re.sub(r'^#{2,3} ','',s).removeprefix('> ')]
  for u in units:
   u=re.sub(r':chatgpt-content-reference\{[^}]*\}','',u).replace('**','').replace('\\&','&').replace('?utm_source=chatgpt.com','').replace('&utm_source=chatgpt.com','').strip()
   assert u in flat,(lang,u)
   checked+=1
 assert sum(b['kind']=='answer' for b in body)==4
 assert sum(b['kind']=='visual' for b in body)==4
 counts[lang]=checked
assets=[]
for p in sorted((R/'site/images/ceh').glob('m01-07-*.svg')):
 assert p.stat().st_size<100000
 root=ET.parse(p).getroot(); w,h=map(float,root.attrib['viewBox'].split()[2:])
 for e in root.iter():
  assert not e.tag.endswith(('script','foreignObject','image'))
  assert not any(k.lower().startswith('on') or 'href' in k for k in e.attrib)
  if e.tag.endswith('text'):
   x=float(e.attrib['x']);y=float(e.attrib['y']);assert 0<=x<w and 0<=y<h
   s=''.join(e.itertext());weight=sum(2 if ord(c)>255 else 1 for c in s)
   # 18 px text, conservative 10 px per Latin-width unit.
   assert x+weight*10<=w,(p,s,weight)
 assets.append({'path':str(p.relative_to(R)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
def lum(h):
 a=[int(h[i:i+2],16)/255 for i in (0,2,4)];a=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in a];return sum(v*w for v,w in zip(a,[.2126,.7152,.0722]))
contrast=(lum('f2f6f5')+.05)/(lum('18252c')+.05)
assert contrast>=4.5
print(json.dumps({'sourceUnitsPreserved':counts,'assets':assets,'diagramTextContrast':round(contrast,2),'browserVerification':'not performed'},ensure_ascii=False,indent=2))
