"""Independent whole-source audit, including rendered text and all code blocks."""
import argparse,hashlib,json,re
from pathlib import Path
from html.parser import HTMLParser
ap=argparse.ArgumentParser();ap.add_argument('source',type=Path);ap.add_argument('--html',type=Path);a=ap.parse_args()
r=Path(__file__).resolve().parents[1];m=json.loads((r/'docs/releases/2026-10-25-m04-03-normalization.json').read_text());raw=a.source.read_bytes()
assert len(raw)==m['sourceBytes'];assert hashlib.sha256(raw).hexdigest()==m['sourceSha256']
b=json.loads((r/'content/concepts/m04-03.json').read_text())['text']['zh']['sourceBody']
def flatten(x):
 if x['kind']=='table':return '\n'.join(x['headers']+sum(x['rows'],[]))
 if x['kind']=='list':return '\n'.join(x['items'])
 return x['text']
def normalize(s):return re.sub(r'\s+','',s)
# Normalize syntax outside fenced code only, preserving every code character except the documented arrow.
segments=re.split(r'(```[^\n]*\n.*?\n```)',raw.decode(),flags=re.S);clean=[];codes=[]
for i,s in enumerate(segments):
 if i%2:
  s=s[s.index('\n')+1:-4];s=s.replace(m['correction']['old'],m['correction']['new']);codes.append(s);clean.append(s)
 else:
  s=re.sub(r'(?m)^#+\s*','',s);s=re.sub(r'(?m)^> ','',s);s=re.sub(r'(?m)^- ','',s)
  s=re.sub(r'(?m)^---$','',s);s=re.sub(r'(?m)^\|[\s:|\-]+\|$','',s)
  s=s.replace('|','').replace('**','').replace('`','').replace('?utm_source=chatgpt.com','');clean.append(s)
assert normalize(''.join(clean))==normalize('\n'.join(map(flatten,b))),'Original prose/order mismatch'
assert codes==[x['text'] for x in b if x['kind']=='code'],'Code mismatch'
assert len(codes)==52;assert sum(x['kind']=='heading' for x in b)==12
assert len(re.findall(r'^### Q[1-4]｜',raw.decode(),re.M))==4
if a.html:
 class Body(HTMLParser):
  def __init__(self):super().__init__();self.stack=[];self.depth=0;self.skip=0;self.parts=[];self.code=[];self.incode=False
  def handle_starttag(self,tag,attrs):
   at=dict(attrs)
   if tag in ['meta','link','img','br','hr','input','source','wbr','path','rect']:return
   self.stack.append(tag)
   if 'source-body' in at.get('class','').split():self.depth=len(self.stack)
   if self.depth and ('data-ftp-diagram' in at or 'data-ftp-editorial' in at or tag=='summary') and not self.skip:self.skip=len(self.stack)
  def handle_endtag(self,tag):
   if tag in ['path','rect']:return
   if self.skip==len(self.stack):self.skip=0
   if self.depth==len(self.stack):self.depth=0
   if self.stack:self.stack.pop()
  def handle_data(self,t):
   if self.depth and not self.skip:self.parts.append(t)
 p=Body();p.feed(a.html.read_text());expected=re.sub(r'\[([^\]]+)\]\(https://[^)]+\)',r'\1','\n'.join(map(flatten,b)))
 assert normalize(expected)==normalize(''.join(p.parts)),'Rendered body mismatch'
print('PASS: 25,631 source bytes/hash, all 12 sections, 4 questions, 52 code blocks, complete prose order'+(', rendered HTML exact' if a.html else ''))
