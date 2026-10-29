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
 assert sum(b['kind']=='sourceImage' for b in body)==4
 counts[lang]=checked
assets=[]
for p in sorted((R/'site/images/ceh').glob('m01-07-original-*.svg')):
 assert p.stat().st_size<100000
 n=int(p.stem.split('-')[-1])
 assert p.read_bytes()==(R/f'docs/sources/m01-07/original-diagram-{n}.svg').read_bytes()
 root=ET.parse(p).getroot()
 for e in root.iter():
  assert e.tag.rsplit('}',1)[-1] not in ['script','foreignObject','image','use']
  assert not any(k.lower().startswith('on') or 'href' in k for k in e.attrib)
  assert not any(re.search(r'url\(\s*(?:https?:|//|data:)',v) for v in e.attrib.values())
 assets.append({'path':str(p.relative_to(R)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
assert len(assets)==4
assert not list((R/'site/images/ceh').glob('m01-07-diagram-*.svg'))
print(json.dumps({'sourceUnitsPreserved':counts,'originalAssets':assets,'originalBytesUnchanged':True,'browserVerification':'not performed'},ensure_ascii=False,indent=2))
