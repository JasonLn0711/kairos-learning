"""Isolated static HTML completeness check. Does not launch a browser or server."""
from pathlib import Path
from html.parser import HTMLParser
import shutil,json,os,subprocess,re,html
R=Path(__file__).resolve().parents[1];T=R/'.local/m05-07-preview';T.mkdir(parents=True,exist_ok=True)
for name in ['src','site','content']:
    if (T/name).exists():shutil.rmtree(T/name)
    shutil.copytree(R/name,T/name)
for name in ['package.json','svelte.config.js','vite.config.ts','tsconfig.json']:shutil.copy2(R/name,T/name)
if not (T/'node_modules').exists():os.symlink(R/'node_modules',T/'node_modules',target_is_directory=True)
p=T/'content/concepts/ceh26-m05-c07.json';a=json.loads(p.read_text());assert a['status']=='draft';a['status']='published';p.write_text(json.dumps(a,ensure_ascii=False))
subprocess.run(['pnpm','run','build'],cwd=T,check=True)
class Page(HTMLParser):
    def __init__(self):super().__init__();self.parts=[];self.answer=None;self.ids=[];self.depth=0;self.ordered=[];self.in_ol=False
    def handle_data(self,d):
        if self.depth:self.parts.append(d)
    def handle_starttag(self,t,attrs):
        attrs=dict(attrs)
        if t=='div':
            if self.depth:self.depth+=1
            elif 'source-body' in attrs.get('class','').split():self.depth=1
        if not self.depth:return
        if 'id' in attrs:self.ids.append(attrs['id'])
        if t=='details' and attrs.get('id')=='answer-validation':self.answer=attrs
        if t=='ol':self.ordered.append(0);self.in_ol=True
        if t=='li' and self.in_ol:self.ordered[-1]+=1
    def handle_endtag(self,t):
        if t=='div' and self.depth:self.depth-=1
        if t=='ol':self.in_ol=False
        if self.depth and t in ['p','li','h2','summary']:self.parts.append(' ')

def normalize(x):return ' '.join(x.split())
def inline(x):return re.sub(r'\[([^\]]+)\]\(https://[^)]+\)',r'\1',x).replace('**','')
for lang,prefix in [('zh',''),('en','en/')]:
    raw=(T/f'build/{prefix}courses/ceh/v13/m05/concepts/m05-07/index.html').read_text();page=Page();page.feed(raw);text=normalize(''.join(page.parts));count=0;cursor=0
    for b in a['text'][lang]['sourceBody']:
        values=([b['text']] if 'text' in b else b.get('items',b.get('paragraphs',[])))
        for value in values:
            needle=normalize(inline(value));at=text.find(needle,cursor)
            assert at>=0,(lang,value[:100]);cursor=at+len(needle);count+=1
    assert page.ordered==[4,3],(lang,page.ordered)
    assert page.answer is not None and 'open' not in page.answer
    for i in range(1,9):assert f'section-{i}' in page.ids
    print(f'PASS: {lang}: {count} complete teaching/answer text units in source-body order; eight anchors and default-closed answer.')
assert json.loads((R/'content/concepts/ceh26-m05-c07.json').read_text())['status']=='draft'
print('PASS: original source remains draft. Browser layout/keyboard/no-JavaScript interaction are NOT tested.')
