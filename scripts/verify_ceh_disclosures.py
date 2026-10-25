"""Reject presentation disclosures outside actual CEH concept Q&A."""
from pathlib import Path
from html.parser import HTMLParser
class Audit(HTMLParser):
 def __init__(self):super().__init__();self.count=0
 def handle_starttag(self,tag,attrs):
  if tag=='details':
   a=dict(attrs);assert 'concept-qa' in a.get('class','').split() and a.get('id','').startswith('qa-'),f'Non-Q&A disclosure: {a}'
   self.count+=1
root=Path(__file__).resolve().parents[1]/'build';pages=list(root.glob('courses/ceh/**/*.html'))+list(root.glob('en/courses/ceh/**/*.html'));assert pages
count=0
for page in pages:
 p=Audit()
 try:p.feed(page.read_text())
 except AssertionError as e:raise AssertionError(f'{page}: {e}') from e
 count+=p.count
assert count>0,'Actual Q&A controls disappeared'
print(f'PASS: {len(pages)} CEH pages; only {count} actual Q&A disclosures remain.')
