"""Convert the complete paired DNS revision without dropping subsections, tables or code."""
from pathlib import Path
import json,re,sys
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/ceh26-m04-c02';V=S/'revision-2026-11-04'
def inline(s):return s.replace('**','').replace('`','')
def parse(lang,suffix):
 lines=(S/f'teaching.{suffix}.md').read_text().splitlines();blocks=[];i=0;first=True;headings=iter(json.loads((V/'detailed-section-map.json').read_text()));models=json.loads((V/'diagram-models.json').read_text())
 while i<len(lines):
  s=lines[i].strip();i+=1
  if not s or s=='---':continue
  if s.startswith('```'):
   code=[]
   while i<len(lines) and not lines[i].strip().startswith('```'):code.append(lines[i]);i+=1
   assert i<len(lines);i+=1;blocks.append(dict(kind='code',text='\n'.join(code)));continue
  if re.match(r'^#{1,3} ',s):
   title=re.sub(r'^#{1,3} ','',s)
   if first:first=False;continue
   entry=next(headings);assert entry[lang]==title,(title,entry)
   blocks.append(dict(kind=entry['kind'],id=entry['id'],text=inline(title)));continue
  if s.startswith('[[figure:'):
   key=s.removeprefix('[[figure:').removesuffix(']]');blocks.append(models[key][lang]);continue
  if s.startswith('|'):
   cells=lambda row:[inline(c.strip()) for c in re.split(r'(?<!\\)\|',row.strip('|'))]
   rows=[cells(s)]
   while i<len(lines) and lines[i].strip().startswith('|'):
    row=lines[i].strip();i+=1
    if not re.fullmatch(r'[| :\-]+',row):rows.append(cells(row))
   blocks.append(dict(kind='table',headers=rows[0],rows=rows[1:]));continue
  if s.startswith('- '):
   items=[inline(s[2:])]
   while i<len(lines) and lines[i].strip().startswith('- '):items.append(inline(lines[i].strip()[2:]));i+=1
   blocks.append(dict(kind='list',items=items));continue
  blocks.append(dict(kind='paragraph',text=inline(s.removeprefix('> '))))
 assert next(headings,None) is None
 blocks.append(dict(kind='answer',id='answer-dns-evidence',summary='參考答案：四題的證據界線' if lang=='zh' else 'Reference answer: evidence boundaries in the four questions',paragraphs=(S/f'answer.{suffix}.md').read_text().strip().split('\n\n')))
 return dict(summary='從 DNS 名稱、紀錄與回覆狀態，練習逐層驗證服務、身分與授權，並分清快取、DNSSEC 與加密傳輸。' if lang=='zh' else 'Read DNS names, records and response status; verify services, identity and authorization in layers, and distinguish cache, DNSSEC and encrypted transport.',sections=[],sourceBody=blocks)
lesson=dict(id='CEH26-M04-C02',revision=3,contentVersion='1.1.1',date='2026-11-05',status='published',publishedOn='2026-11-04',qa=[],text={lang:parse(lang,suffix) for lang,suffix in [('zh','zh-TW'),('en','en')]})
data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n';path=R/'content/concepts/ceh26-m04-c02.json'
if '--check' in sys.argv:assert path.read_text()==data
else:path.write_text(data)
