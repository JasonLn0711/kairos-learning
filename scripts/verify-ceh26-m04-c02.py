"""Independent ordered-line source audit; code, table cells and deeper headings all count."""
from pathlib import Path
import json,re,hashlib
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/ceh26-m04-c02';V=S/'revision-2026-11-04'
for name,meta in json.loads((V/'supplied-sha256.json').read_text()).items():
 data=(V/name).read_bytes();assert len(data)==meta['bytes'] and hashlib.sha256(data).hexdigest()==meta['sha256'],name
s=(V/'supplied.zh-TW.md').read_text()
for c in json.loads((V/'editorial-changes.json').read_text()):
 assert c['original'] in s,c
 s=s.replace(c['original'],c['replacement'])
assert s==(S/'teaching.zh-TW.md').read_text(),'Undocumented source edit'
lesson=json.loads((R/'content/concepts/ceh26-m04-c02.json').read_text())
def values(b):
 if b['kind']=='table':return b['headers']+sum(b['rows'],[])
 if b['kind']=='list':return b['items']
 if b['kind']=='visual':return []
 if b['kind']=='answer':return []
 return [b['text']]
def norm(s):return re.sub(r'\s+','',s.replace('**','').replace('`',''))
for lang,suffix in [('zh','zh-TW'),('en','en')]:
 body=lesson['text'][lang]['sourceBody'];text=norm('\n'.join(v for b in body for v in values(b)));cursor=0;code=False;count=0
 for i,line in enumerate((S/f'teaching.{suffix}.md').read_text().splitlines()):
  if line.startswith('```'):code=not code;continue
  if not line.strip() or (not code and (i==0 or line=='---' or line.startswith('[[figure:'))):continue
  if not code and re.fullmatch(r'[| :\-]+',line):continue
  chunks=[line] if code else [re.sub(r'^#{1,3} |^- |^> ','',line)]
  if not code and line.startswith('|'):chunks=[c.strip() for c in line.strip('|').split('|')]
  for chunk in chunks:
   v=norm(chunk)
   if not v:continue
   at=text.find(v,cursor);assert at>=cursor,(lang,i,chunk);cursor=at+len(v);count+=1
 print(f'PASS {lang}: {count} ordered source units retained (including all table cells / code lines)')
assert len(json.loads((V/'detailed-section-map.json').read_text()))==75
print('PASS: original plus explicit changes equals adopted Chinese; 75 paired chapter/subsection anchors')
