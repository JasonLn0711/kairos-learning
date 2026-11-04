"""Preserve the paired FTP/SMTP manuscript in the existing escaped sourceBody model."""
from pathlib import Path
import json,re,sys
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/ceh26-m04-c03'
models=json.loads((S/'diagram-models.json').read_text())
def parse(lang,suffix):
 lines=(S/f'teaching.{suffix}.md').read_text().splitlines();blocks=[];i=0;first=True
 headings=iter(json.loads((S/'detailed-section-map.json').read_text()))
 while i<len(lines):
  s=lines[i].strip();i+=1
  if not s:continue
  s=s.replace('**','')
  if re.match(r'^(伺服器|用戶端|資料|Server|Client|Data)：|^(Server|Client|Data):',s):
   records=[s]
   while i<len(lines) and lines[i].strip():records.append(lines[i]);i+=1
   blocks.append(dict(kind='code',text='\n'.join(records)));continue
  if re.match(r'^#{1,3} ',s):
   title=re.sub(r'^#{1,3} ','',s)
   if first:first=False;blocks.append(dict(kind='paragraph',text=title));continue
   entry=next(headings);assert entry[lang]==title
   if entry['id']=='section-3':blocks.append(models['connections'][lang])
   if entry['id']=='section-6':blocks.append(models['permissions'][lang])
   blocks.append(dict(kind=entry['kind'],id=entry['id'],text=title));continue
  if s.startswith('- '):
   items=[s[2:]]
   while i<len(lines) and lines[i].startswith('- '):items.append(lines[i][2:].replace('**',''));i+=1
   blocks.append(dict(kind='list',items=items));continue
  blocks.append(dict(kind='paragraph',text=s))
 assert next(headings,None) is None
 blocks.append(dict(kind='answer',id='answer-ftp-smtp-evidence',summary='參考解答：FTP 權限與 SMTP 未確認的界線' if lang=='zh' else 'Reference answer: FTP permissions and an unverified SMTP user',paragraphs=(S/f'answer.{suffix}.md').read_text().strip().split('\n\n')))
 return dict(summary='FTP／SMTP 列舉：分開服務回答、已完成操作與尚待取得的證據。' if lang=='zh' else 'FTP/SMTP enumeration: separate service replies, completed operations, and evidence still needed.',sections=[],sourceBody=blocks)
t=dict(id='CEH26-M04-C03',revision=1,contentVersion='1.0.0',date='2026-11-04',publishedOn='2026-11-04',status='published',qa=[],text={l:parse(l,s) for l,s in [('zh','zh-TW'),('en','en')]})
p=R/'content/concepts/ceh26-m04-c03.json';data=json.dumps(t,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert p.read_text()==data
else:p.write_text(data)
