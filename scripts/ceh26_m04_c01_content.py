"""Convert the complete paired first-lesson manuscripts to existing escaped sourceBody blocks."""
from pathlib import Path
import json,re,sys
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/ceh26-m04-c01'
def parse(suffix):
 lines=(S/f'teaching.{suffix}.md').read_text().splitlines();blocks=[];i=0;section=0;title=lines[0][2:];summary=lines[2]
 i=3
 while i<len(lines):
  s=lines[i].strip();i+=1
  if not s:continue
  s=s.replace('**','')
  if s.startswith('```'):
   code=[]
   while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
   assert i<len(lines);i+=1;blocks.append(dict(kind='code',text='\n'.join(code)));continue
  if s.startswith('## '):section+=1;blocks.append(dict(kind='heading',id=f'section-{section}',text=s[3:]));continue
  if s.startswith('- '):
   items=[s[2:]]
   while i<len(lines) and lines[i].startswith('- '):items.append(lines[i][2:].replace('**',''));i+=1
   blocks.append(dict(kind='list',items=items));continue
  blocks.append(dict(kind='paragraph',text=s))
 assert section==10
 blocks.append(dict(kind='answer',id='answer-projects',summary='參考答案：目前確認與尚未測試的範圍' if suffix=='zh-TW' else 'Reference answer: confirmed and untested scope',paragraphs=[(S/f'answer.{suffix}.md').read_text().strip()]))
 return dict(summary=summary,sections=[],sourceBody=blocks)
lesson=dict(id='CEH26-M04-C01',revision=2,contentVersion='1.0.1',date='2026-11-04',status='published',publishedOn='2026-11-04',qa=[],text={lang:parse(suffix) for lang,suffix in [('zh','zh-TW'),('en','en')]})
data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n';path=R/'content/concepts/ceh26-m04-c01.json'
if '--check' in sys.argv:assert path.read_text()==data
else:path.write_text(data)
