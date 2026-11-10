"""Isolated editorial build and visible-text checks; no browser or listener."""
from pathlib import Path
from html.parser import HTMLParser
import shutil,json,os,subprocess,re
R=Path(__file__).resolve().parents[1];T=R/'.local/m05-08-preview';E=R/'.local/m05-08';T.mkdir(parents=True,exist_ok=True);E.mkdir(parents=True,exist_ok=True)
for name in ['src','site','content']:shutil.copytree(R/name,T/name,dirs_exist_ok=True)
for name in ['package.json','svelte.config.js','vite.config.ts','tsconfig.json']:shutil.copy2(R/name,T/name)
if not (T/'node_modules').exists():os.symlink(R/'node_modules',T/'node_modules',target_is_directory=True)
p=T/'content/concepts/ceh26-m05-c08.json';t=json.loads(p.read_text());t['status']='published';p.write_text(json.dumps(t,ensure_ascii=False))
with (E/'editorial-build.log').open('w') as log:subprocess.run(['pnpm','run','build'],cwd=T,stdout=log,stderr=subprocess.STDOUT,check=True)
class Text(HTMLParser):
 def __init__(self):super().__init__();self.t=[];self.hidden=0;self.details=[]
 def handle_data(self,s):
  if not self.hidden:self.t.append(s)
 def handle_starttag(self,tag,attrs):
  if tag in ['script','style']:self.hidden+=1
  if tag=='details':self.details.append(dict(attrs))
 def handle_endtag(self,tag):
  if tag in ['script','style']:self.hidden-=1
def plain(s):return re.sub(r'\[([^]]+)\]\([^)]+\)',r'\1',s).replace('**','').replace('`','')
for lang in ['zh','en']:
 rel=('' if lang=='zh' else 'en/')+'courses/ceh/v13/m05/concepts/m05-08/index.html';p=T/'build'/rel
 parser=Text();parser.feed(p.read_text());text=' '.join(''.join(parser.t).split());cursor=0;count=0
 for b in t['text'][lang]['sourceBody']:
  fields=([b['text']] if 'text' in b else b['items'] if b['kind']=='list' else [b['summary'],*b['paragraphs']] if b['kind']=='answer' else [b['visual']['caption'],b['visual']['description'],*[v for i in b['visual']['items'] for v in [i['title'],i['body']]]])
  for f in fields:
   value=' '.join(plain(f).split());at=text.find(value,cursor);assert at>=0,(lang,value);cursor=at+len(value);count+=1
 answer=[d for d in parser.details if d.get('id')=='answer-m0508'];assert len(answer)==1 and 'open' not in answer[0];assert 'M05-08' in text
 shutil.copy2(p,E/f'editorial-{lang}.html');print(lang,rel,count,'ordered visible units excluding script/style; closed native answer; PASS')
assert json.loads((R/'content/concepts/ceh26-m05-c08.json').read_text())['status']=='draft'
print('Source draft unchanged; isolated editorial build only; PASS')
