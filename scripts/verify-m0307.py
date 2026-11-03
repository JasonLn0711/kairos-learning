"""M03-07 static checks, deliberately distinct from browser and production checks."""
from pathlib import Path
import json,re,html,zipfile
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
lesson=json.loads((ROOT/'content/concepts/m03-07.json').read_text())
class Text(HTMLParser):
 def __init__(self,s):super().__init__();self.parts=[];self.details=[];self.feed(s)
 def handle_data(self,s):self.parts.append(s)
 def handle_starttag(self,t,a):
  if t=='details':self.details.append(dict(a))
def norm(s):return re.sub(r'\s+',' ',html.unescape(re.sub(r'\[([^\]]+)\]\(https://[^)]+\)',r'\1',s))).strip()
for lang,prefix in [('zh',''),('en','en/')]:
 raw=(ROOT/f'build/{prefix}courses/ceh/v13/m03/concepts/m03-07/index.html').read_text();page=Text(raw);text=norm(''.join(page.parts));cursor=0
 for b in lesson['text'][lang]['sourceBody']:
  k=b['kind'];units=([b['text']] if k in ['heading','paragraph','code'] else b['items'] if k=='list' else b['headers']+[v for r in b['rows'] for v in r] if k=='table' else [b['summary']]+b['paragraphs'] if k=='answer' else [b['visual']['caption'],b['visual']['description']]+[v for item in b['visual']['items'] for v in [item['title'],item['body']]])
  for u in units:
   u=norm(u);at=text.find(u,cursor);assert at>=0,(lang,u);cursor=at+len(u)
 assert len(page.details)==4 and all('open' not in d for d in page.details)
 assert [d['id'] for d in page.details]==['answer-scope','answer-discovery','answer-features','answer-comparison']
 assert not re.search('Sentinel_|libfile_|sandbox:',raw)
 assert f'/{prefix}courses/ceh/v13/m03/concepts/m03-06/' in raw
 assert f'/{prefix}courses/ceh/v13/m03/#m03-08' in raw
 assert not (ROOT/f'build/{prefix}courses/ceh/v13/m03/concepts/m03-08/index.html').exists()
 for b in [b for b in lesson['text'][lang]['sourceBody'] if b['kind']=='visual']:
  assert (ROOT/'site'/b['src'].lstrip('/')).read_bytes()==(ROOT/'build'/b['src'].lstrip('/')).read_bytes()
p=ROOT/'site/downloads/ceh-m03-07-bilingual-svg.zip';assert p.read_bytes()==(ROOT/'build/downloads/ceh-m03-07-bilingual-svg.zip').read_bytes()
with zipfile.ZipFile(p) as z:
 assert len(z.namelist())==8
 for name in z.namelist():assert z.read(name)==(ROOT/'site/images/ceh'/name).read_bytes()
print('PASS M03-07 full bilingual text order, 4 closed answers, semantic figures, navigation, exact SVG/ZIP; browser/live pending')
