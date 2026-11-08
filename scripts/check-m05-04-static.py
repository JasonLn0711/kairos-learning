"""Isolated editorial static render; always restore the draft before exiting."""
from pathlib import Path
import json,subprocess,html,shutil
from html.parser import HTMLParser
R=Path(__file__).resolve().parents[1];P=R/'content/concepts/ceh26-m05-c04.json';E=R/'.local/m05-04';E.mkdir(parents=True,exist_ok=True)
class Text(HTMLParser):
 def __init__(self):super().__init__();self.t=[];self.details=[];self.hidden=0
 def handle_data(self,s):
  if not self.hidden:self.t.append(s)
 def handle_starttag(self,tag,attrs):
  if tag in ['script','style']:self.hidden+=1
  if tag=='details':self.details.append(dict(attrs))
 def handle_endtag(self,tag):
  if tag in ['script','style']:self.hidden-=1
def plain(s):
 s=__import__('re').sub(r'\[([^]]+)\]\([^)]+\)',r'\1',s)
 return s.replace('**','').replace('`','')
original=P.read_bytes()
try:
 t=json.loads(original);t['status']='published';P.write_text(json.dumps(t,ensure_ascii=False,indent=2)+'\n')
 with (E/'editorial-build.log').open('w') as log:subprocess.run(['pnpm','run','build'],cwd=R,stdout=log,stderr=subprocess.STDOUT,check=True)
 for lang in ['zh','en']:
  rel=('' if lang=='zh' else 'en/')+'courses/ceh/v13/m05/concepts/m05-04/index.html';p=R/'build'/rel
  parser=Text();parser.feed(p.read_text());text=' '.join(''.join(parser.t).split());cursor=0;count=0
  for b in t['text'][lang]['sourceBody']:
   fields=([b['text']] if 'text' in b else b['items'] if b['kind']=='list' else [b['summary'],*b['paragraphs']] if b['kind']=='answer' else [b['visual']['caption'],b['visual']['description'],*[v for i in b['visual']['items'] for v in [i['title'],i['body']]]])
   for field in fields:
    value=' '.join(plain(field).split());at=text.find(value,cursor);assert at>=0,(lang,value);cursor=at+len(value);count+=1
  answer=[d for d in parser.details if d.get('id')=='answer-m0504'];assert len(answer)==1 and 'open' not in answer[0]
  assert '上午已交付' not in text
  shutil.copy2(p,E/f'editorial-{lang}.html');print(lang,rel,count,'ordered text units; closed native answer; PASS')
finally:P.write_bytes(original)
