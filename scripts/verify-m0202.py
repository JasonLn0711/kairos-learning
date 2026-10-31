"""Static output verification only; not browser/mobile or live publication evidence."""
from pathlib import Path
import json,re,html,zipfile
from html.parser import HTMLParser
from m0202_svg import generate
ROOT=Path(__file__).resolve().parents[1]
lesson=json.loads((ROOT/'content/concepts/m02-02.json').read_text());bundle,labels=generate()
class Text(HTMLParser):
 def __init__(self,s):super().__init__();self.parts=[];self.details=[];self.feed(s)
 def handle_data(self,s):self.parts.append(s)
 def handle_starttag(self,t,a):
  if t=='details':self.details.append(dict(a))
def norm(s):return re.sub(r'\s+',' ',html.unescape(re.sub(r'\[([^\]]+)\]\(https://[^)]+\)',r'\1',s))).strip()
for lang,prefix in [('zh',''),('en','en/')]:
 raw=(ROOT/f'build/{prefix}courses/ceh/v13/m02/concepts/m02-02/index.html').read_text();page=Text(raw);text=norm(''.join(page.parts));cursor=0
 for b in lesson['text'][lang]['sourceBody']:
  k=b['kind']
  units=([b['text']] if k in ['heading','paragraph','code'] else b['items'] if k=='list' else b['headers']+[v for r in b['rows'] for v in r] if k=='table' else [b['summary']]+b['paragraphs'] if k=='answer' else [b['visual']['caption'],b['visual']['description']]+[v for item in b['visual']['items'] for v in [item['title'],item['body']]] )
  for u in units:
   u=norm(u);at=text.find(u,cursor);assert at>=0,(lang,u);cursor=at+len(u)
 assert len(page.details)==4 and all('open' not in d for d in page.details)
 assert [d['id'] for d in page.details]==['answer-roots','answer-time','answer-hash','answer-missing']
 assert raw.count('data-reviewed-svg=')==4
 assert not re.search('Sentinel_|libfile_|CalpicoFile_|sandbox:',raw)
 assert f'/{prefix}courses/ceh/v13/m02/concepts/m02-01/' in raw
 assert f'/{prefix}courses/ceh/v13/m02/concepts/m02-03/' in raw
 assert (ROOT/f'build/{prefix}courses/ceh/v13/m02/concepts/m02-03/index.html').exists()
 for b in [b for b in lesson['text'][lang]['sourceBody'] if b['kind']=='visual']:
  assert bundle[b['src']] in raw
  assert (ROOT/'site'/b['src'].lstrip('/')).read_bytes()==(ROOT/'build'/b['src'].lstrip('/')).read_bytes()
 idx=json.loads((ROOT/'build/search-index.json').read_text());entry=next(x for x in idx if x['id']=='M02-02' and x['lang']==lang)
 for label in labels[lang]:assert label in entry['text']
p=ROOT/'site/downloads/ceh-m02-02-bilingual-svg.zip';assert p.read_bytes()==(ROOT/'build/downloads/ceh-m02-02-bilingual-svg.zip').read_bytes()
with zipfile.ZipFile(p) as z:
 assert len(z.namelist())==8
 for src in bundle:assert z.read(Path(src).name)==(ROOT/'site'/src.lstrip('/')).read_bytes()
print('PASS M02-02 bilingual full text order; 4 inline SVG per language; 4 closed answers; search labels; exact assets/ZIP; linked M02-03. Browser/live checks NOT performed.')
