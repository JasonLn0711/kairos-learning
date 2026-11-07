"""Build a local published fixture, verify full static text, restore the draft.

Does not start a browser/server or deploy. Leaves the fixture under .local only;
run the publication boundary check afterward to restore clean draft-gated build/.
"""
from pathlib import Path
from html.parser import HTMLParser
import json,re,subprocess,shutil
R=Path(__file__).resolve().parents[1]; p=R/'content/concepts/ceh26-m04-c10.json'; original=p.read_bytes(); lesson=json.loads(original)
class Text(HTMLParser):
 def __init__(self):super().__init__();self.parts=[];self.answers=[]
 def handle_data(self,data):self.parts.append(data)
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=='details' and attrs.get('id')=='answer-m0410-check':self.answers.append(attrs)
def plain(s):
 s=re.sub(r'\[([^\]]+)\]\(https://[^)]+\)',r'\1',s)
 return re.sub(r'\s+',' ',s.replace('**','').replace('`','')).strip()
try:
 fixture={**lesson,'status':'published'};p.write_text(json.dumps(fixture,ensure_ascii=False,indent=2)+'\n')
 subprocess.run(['npm','run','build'],cwd=R,check=True,stdout=subprocess.DEVNULL)
 out=R/'.local/m04-10/static-preview';out.mkdir(parents=True,exist_ok=True)
 results={}
 for lang in ['zh','en']:
  rel=('en/' if lang=='en' else '')+'courses/ceh/v13/m04/concepts/m04-10/index.html'; html=(R/'build'/rel).read_text(); parser=Text();parser.feed(html);text=plain(''.join(parser.parts));pos=0;units=0
  for b in fixture['text'][lang]['sourceBody']:
   values=b['items'] if b['kind']=='list' else [b['summary'],*b['paragraphs']] if b['kind']=='answer' else [b['text']]
   for value in values:
    value=plain(value);at=text.find(value,pos);assert at>=0,(lang,value[:100]);pos=at+len(value);units+=1
  assert len(parser.answers)==1 and 'open' not in parser.answers[0]
  for n in range(1,11):assert f'id="section-{n}"' in html
  assert 'm04-09/' in html and 'm05' in html
  (out/f'{lang}.html').write_text(html);results[lang]={'blocks':76,'textUnits':units,'closedReferenceAnswers':1,'fullTextOrder':'passed'}
 (out/'result.json').write_text(json.dumps(results,indent=2)+'\n'); print(json.dumps(results))
finally:p.write_bytes(original)
