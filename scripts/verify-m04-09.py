"""Check actual M04-09 static output without substituting for browser acceptance."""
from pathlib import Path
from html.parser import HTMLParser
import re,json
R=Path(__file__).resolve().parents[1]; B=R/'build'; source=json.loads((R/'content/concepts/ceh26-m04-c09.json').read_text())
class Page(HTMLParser):
 def __init__(self):super().__init__();self.text=[];self.links=[];self.details=[];self.headings=[];self.canonical=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='a':self.links.append(a.get('href',''))
  if tag=='details':self.details.append(a)
  if tag=='h2':self.headings.append(a.get('id',''))
  if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
 def handle_data(self,s):self.text.append(s)
def norm(s):return re.sub(r'\s+',' ',re.sub(r'\[([^\]]+)\]\(https://[^)]+\)',r'\1',s)).strip()
search=json.loads((B/'search-index.json').read_text())
for lang in ['zh','en']:
 prefix='/en' if lang=='en' else ''; route=prefix+'/courses/ceh/v13/m04/concepts/m04-09/'
 p=Page();p.feed((B/route.strip('/')/'index.html').read_text()); text=norm(' '.join(p.text));cursor=0
 for b in source['text'][lang]['sourceBody']:
  for unit in b['items'] if b['kind']=='list' else [b['summary'],*b['paragraphs']] if b['kind']=='answer' else [b['text']]:
   value=norm(unit);at=text.find(value,cursor);assert at>=cursor,(lang,value);cursor=at+len(value)
 assert p.details==[{'class':'reference-answer','id':'answer-response-evidence'}] or (len(p.details)==1 and p.details[0].get('id')=='answer-response-evidence' and 'open' not in p.details[0])
 assert all('section-'+str(i) in p.headings for i in range(1,10))
 assert p.canonical==['https://learn.cs-kairos.com'+route]
 assert prefix+'/courses/ceh/v13/m04/concepts/m04-08/' in p.links
 assert prefix+'/courses/ceh/v13/m04/#ceh26-m04-c10' in p.links
 assert any(e['id']=='CEH26-M04-C09' and e['lang']==lang for e in search)
 assert not (B/(prefix+'/courses/ceh/v13/m04/concepts/m04-10/').strip('/')/'index.html').exists()
 assert not (B/(prefix+'/courses/ceh/v13/m04/concepts/ceh26-m04-c09/').strip('/')/'index.html').exists()
 for url in re.findall(r'\]\((https://[^)]+)\)',(R/f'docs/sources/m04-09/teaching.{"en" if lang=="en" else "zh-TW"}.md').read_text()):assert url in p.links,url
 print(f'PASS: {lang}: complete source order, nine headings, 16 source links, closed answer, canonical, search, neighbors and pending/legacy boundaries')
