"""Static output verification only; not browser/mobile or live publication evidence."""
from pathlib import Path
import json,re,html,zipfile
from html.parser import HTMLParser
from m0206_svg import generate
ROOT=Path(__file__).resolve().parents[1]
lesson=json.loads((ROOT/'content/concepts/m02-06.json').read_text());bundle,labels=generate()
class Text(HTMLParser):
 def __init__(self,s):super().__init__();self.parts=[];self.details=[];self.feed(s)
 def handle_data(self,s):self.parts.append(s)
 def handle_starttag(self,t,a):
  if t=='details':self.details.append(dict(a))
def norm(s):return re.sub(r'\s+',' ',html.unescape(re.sub(r'\[([^\]]+)\]\(https://[^)]+\)',r'\1',s))).strip()
for lang,prefix in [('zh',''),('en','en/')]:
 raw=(ROOT/f'build/{prefix}courses/ceh/v13/m02/concepts/m02-06/index.html').read_text();page=Text(raw);text=norm(''.join(page.parts));cursor=0
 for b in lesson['text'][lang]['sourceBody']:
  k=b['kind']
  units=([b['text']] if k in ['heading','paragraph','code'] else b['items'] if k=='list' else b['headers']+[v for r in b['rows'] for v in r] if k=='table' else [b['summary']]+b['paragraphs'] if k=='answer' else [b['visual']['caption'],b['visual']['description']]+[v for item in b['visual']['items'] for v in [item['title'],item['body']]] )
  for u in units:
   u=norm(u);at=text.find(u,cursor);assert at>=0,(lang,u);cursor=at+len(u)
 assert len(page.details)==9 and all('open' not in d for d in page.details)
 assert [d['id'] for d in page.details]==['answer-local-prefix', 'answer-address-count', 'answer-asn-role', 'answer-missing-reply', 'answer-service-correlation','answer-integrated-prefix','answer-integrated-operator','answer-integrated-origin','answer-integrated-smb']
 assert raw.count('data-reviewed-svg=')==2
 assert raw.count('data-network-layout=')==6
 assert 'cidr-prefix' in raw
 assert not re.search('Sentinel_|libfile_|CalpicoFile_|sandbox:',raw)
 assert f'/{prefix}courses/ceh/v13/m02/concepts/m02-05/' in raw
 assert f'/{prefix}courses/ceh/v13/m02/concepts/m02-07/' in raw
 assert (ROOT/f'build/{prefix}courses/ceh/v13/m02/concepts/m02-07/index.html').exists()
 for b in [b for b in lesson['text'][lang]['sourceBody'] if b['kind']=='visual']:
  if '/m02-06-0' in b['src']:assert bundle[b['src']] in raw
  assert (ROOT/'site'/b['src'].lstrip('/')).read_bytes()==(ROOT/'build'/b['src'].lstrip('/')).read_bytes()
 idx=json.loads((ROOT/'build/search-index.json').read_text());entry=next(x for x in idx if x['id']=='M02-06' and x['lang']==lang)
 for label in labels[lang]:assert label in entry['text']
p=ROOT/'site/downloads/ceh-m02-06-bilingual-svg.zip';assert p.read_bytes()==(ROOT/'build/downloads/ceh-m02-06-bilingual-svg.zip').read_bytes()
with zipfile.ZipFile(p) as z:
 assert len(z.namelist())==8
 for name in z.namelist():assert z.read(name)==(ROOT/'site/images/ceh'/name).read_bytes()
p=ROOT/'site/downloads/ceh-m02-06-network-svg.zip'
assert p.read_bytes()==(ROOT/'build/downloads/ceh-m02-06-network-svg.zip').read_bytes()
with zipfile.ZipFile(p) as z:
 assert len(z.namelist())==12
 for name in z.namelist():assert z.read(name)==(ROOT/'site/images/ceh'/name).read_bytes()
print('PASS M02-06 bilingual full text order; 6 reflowing diagrams and 2 retained SVGs per language; paired closed reference answers; search labels; exact assets/ZIP; linked M02-07. Browser/live checks NOT performed.')
