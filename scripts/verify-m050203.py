"""Read generated semantic HTML; not a browser/accessibility acceptance claim."""
from html.parser import HTMLParser
from pathlib import Path
import json,re
class Body(HTMLParser):
 def __init__(self):super().__init__();self.depth=0;self.parts=[];self.details=[];self.scripts=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if not self.depth and tag=='div' and 'source-body' in a.get('class','').split():self.depth=1;return
  if self.depth:
   if tag not in ['br','hr','img','input','meta','link']:self.depth+=1
   if tag=='details':self.details.append(a)
   if tag=='script':self.scripts+=1
 def handle_endtag(self,tag):
  if self.depth:self.depth-=1
 def handle_data(self,data):
  if self.depth:self.parts.append(data)
def norm(s):return re.sub(r'\s+',' ',re.sub(r'\[([^\]]+)\]\(https://[^)]+\)',r'\1',s)).strip()
for n in ['02','03']:
 d=json.loads(Path(f'content/concepts/ceh26-m05-c{n}.json').read_text())
 for lang in ['zh','en']:
  p=Path('build')/('en' if lang=='en' else '')/f'courses/ceh/v13/m05/concepts/m05-{n}/index.html'
  raw=p.read_text();body=Body();body.feed(raw);text=norm(''.join(body.parts));cursor=0;count=0
  for b in d['text'][lang]['sourceBody']:
   units=b['items'] if b['kind']=='list' else [b['summary'],*b['paragraphs']] if b['kind']=='answer' else [b['text']]
   for v in units:
    v=norm(v);at=text.find(v,cursor);assert at>=cursor,(n,lang,v);cursor=at+len(v);count+=1
  assert len(body.details)==1 and 'open' not in body.details[0]
  assert not body.scripts and 'v1.0.0' in raw
  print(f'PASS M05-{n} {lang}: {count} ordered semantic text units, one closed answer, version 1.0.0; browser layout NOT evaluated.')
