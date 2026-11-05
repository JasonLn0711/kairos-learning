"""Convert the paired M04-01 manuscripts to existing escaped sourceBody blocks."""
from pathlib import Path
import json,re,sys
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/ceh26-m04-c01'
def cells(line):return [c.strip().replace(r'\|','|') for c in re.split(r'(?<!\\)\|',line.strip('|'))]
def parse(lang,suffix):
 lines=(S/f'teaching.{suffix}.md').read_text().splitlines();blocks=[];i=0;first=True
 headings=iter(json.loads((S/'detailed-section-map.json').read_text()))
 while i<len(lines):
  s=lines[i].strip();i+=1
  if not s or s=='---':continue
  s=s.replace('**','')
  if s.startswith('```'):
   code=[]
   while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
   assert i<len(lines);i+=1;blocks.append(dict(kind='code',text='\n'.join(code)));continue
  if s.startswith('|'):
   rows=[cells(s)]
   while i<len(lines) and lines[i].strip().startswith('|'):
    row=lines[i].strip();i+=1
    if re.fullmatch(r'[| :\-]+',row):continue
    rows.append(cells(row))
   assert len(rows)>1 and all(len(row)==len(rows[0]) for row in rows)
   blocks.append(dict(kind='table',headers=rows[0],rows=rows[1:]));continue
  if re.match(r'^#{1,3} ',s):
   title=re.sub(r'^#{1,3} ','',s)
   if first:first=False;blocks.append(dict(kind='paragraph',text=title));continue
   entry=next(headings);assert entry[lang]==title,(lang,title,entry)
   blocks.append(dict(kind=entry['kind'],id=entry['id'],text=title));continue
  if s.startswith('- '):
   items=[s[2:]]
   while i<len(lines) and lines[i].startswith('- '):items.append(lines[i][2:].replace('**',''));i+=1
   blocks.append(dict(kind='list',items=items));continue
  blocks.append(dict(kind='paragraph',text=s.removeprefix('> ')))
 assert next(headings,None) is None
 blocks.append(dict(kind='answer',id='answer-projects',summary='參考解答：Scanning、Enumeration 與尚未測試的權限' if lang=='zh' else 'Reference answer: scanning, enumeration, and untested permissions',paragraphs=[(S/f'answer.{suffix}.md').read_text().strip()]))
 return dict(summary='Enumeration vs. Scanning｜從服務入口、資源名稱到可核對的權限證據。' if lang=='zh' else 'Enumeration vs. Scanning | From service endpoints and share names to checkable permission evidence.',sections=[],sourceBody=blocks)
lesson=dict(id='CEH26-M04-C01',revision=4,contentVersion='1.1.1',date='2026-11-05',status='published',publishedOn='2026-11-04',qa=[],text={lang:parse(lang,suffix) for lang,suffix in [('zh','zh-TW'),('en','en')]})
data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n';path=R/'content/concepts/ceh26-m04-c01.json'
if '--check' in sys.argv:assert path.read_text()==data
else:path.write_text(data)
