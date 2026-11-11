"""Build M04-03 from the complete paired manuscripts and six reviewed figures."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/aase/m04-03/replacement-2026-11-11'
IDS=['introduction','structure','navigation','compare','groups','order','industries','workflow','mistakes','understanding']
# Existing public anchors remain available in the corresponding expanded sections.
ALIASES={'analogy':('structure','超市與學生服務分類','Supermarket and student-service categories'),'record':('workflow','將成果記錄成 wireframe-notes.md','Record the result in wireframe-notes.md')}
def build():
 lesson=json.loads((SOURCE/'prior-lesson.json').read_text())
 lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11',checks=[])
 figures=json.loads((SOURCE/'figures.json').read_text())
 for lang in ['zh','en']:
  chunks=[];current=[];fenced=False
  for line in (SOURCE/f'teaching.{lang}.md').read_text().splitlines():
   if line.startswith('```'):fenced=not fenced
   if line.startswith('## ') and not fenced:
    chunks.append('\n'.join(current));current=[line[3:]]
   else:current.append(line)
  chunks.append('\n'.join(current))
  assert len(chunks)==len(IDS)
  sections=[]
  for sid,chunk in zip(IDS,chunks):
   lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ');paragraphs=[];blocks=[];i=0
   def prose(value):
    if not blocks:paragraphs.append(value)
    elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
    else:blocks.append(dict(kind='prose',paragraphs=[value]))
   while i<len(lines):
    line=lines[i].strip()
    if not line:i+=1;continue
    if line.startswith('@figure '):blocks.append(figures[lang][int(line.split()[1])-1]);i+=1;continue
    if line.startswith('### '):
     h=line[4:];block=dict(kind='step',heading=h,paragraphs=[])
     for alias,(section,zh,en) in ALIASES.items():
      if sid==section and h==(zh if lang=='zh' else en):block['id']=alias
     blocks.append(block);i+=1;continue
    if line.startswith('```'):
     i+=1;code=[]
     while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
     assert i<len(lines) and blocks and blocks[-1]['kind']=='step'
     blocks[-1]['code']='\n'.join(code).strip();i+=1;continue
    if line.startswith('|'):
     rows=[]
     while i<len(lines) and lines[i].strip().startswith('|'):
      rows.append([x.strip() for x in lines[i].strip().strip('|').split('|')]);i+=1
     captions={'introduction':('三種觀念解決不同問題','Three concepts address different questions'),'compare':('視覺優先序的五種常用方法','Five ways to establish visual hierarchy'),'industries':('六種行業的資訊架構與優先序','Information architecture and priorities in six industries')}
     blocks.append(dict(kind='table',caption=captions[sid][lang=='en'],headers=rows[0],rows=rows[2:]));continue
    group=[]
    while i<len(lines) and lines[i].strip() and not lines[i].startswith(('### ','@figure ','```','|')):group.append(lines[i]);i+=1
    value='\n'.join(group)
    if blocks and blocks[-1]['kind']=='step' and 'code' not in blocks[-1]:blocks[-1]['paragraphs'].append(value)
    else:prose(value)
   # Every section has a visible lead, as required by the existing catalog.
   assert paragraphs and all(b.get('paragraphs') or b['kind'] not in ['step','prose'] or b.get('code') for b in blocks),(lang,sid,paragraphs,blocks)
   section=dict(id=sid,heading=heading,paragraphs=paragraphs,**({'blocks':blocks} if blocks else {}))
   refs={'structure':['nng-ia','nng-sitemaps'],'navigation':['nng-ia'],'compare':['nng-visual-principles'],'order':['wai-sequence','wai-labels'],'workflow':['nng-card-sort','nng-tree-testing']}
   if sid in refs:section['sourceIds']=refs[sid]
   sections.append(section)
  lesson['text'][lang]['sections']=sections
  questions=json.loads((SOURCE/'questions.json').read_text())[lang]
  lesson['text'][lang].pop('openChecks',None)
  for i,q in enumerate(questions):
   lines=q['prompt'].split('\n');assert len(lines)==5
   answer=[1,2,3][i]
   rationale=q['answer'][0]
   distractors={
    'zh':[['側欄顏色不會改變分類關係。','研究任務並檢查分類，才能直接處理找不到入口的問題。','放大按鈕無法決定資訊應放在哪裡。','動畫無法直接修正內容組織。'],['題目沒有資料庫正規化問題的證據。','題目沒有網路效能問題的證據。','缺件狀態需要明確的主要動作及修正提示。','題目沒有字型授權問題的證據。'],['相同尺寸不能保證資訊順序正確。','手機是否需要側邊欄要依任務與複雜度判斷。','增加顏色不能保證正確閱讀順序。','保留有意義的閱讀及操作順序，讓說明在需要時可見。']],
    'en':[['Sidebar color does not change category relationships.','Research tasks and categories to address the missing entry point directly.','Larger buttons do not determine where information belongs.','Animation does not directly repair content organization.'],['There is no evidence of a database-normalization problem.','There is no evidence of a network-performance problem.','The missing-information state needs a clear primary action and correction.','There is no evidence of a font-licensing problem.'],['Equal sizes do not establish a correct information order.','A mobile sidebar depends on tasks and complexity.','More colors do not establish a correct reading order.','Preserve meaningful reading and operation order so instructions are available when needed.']]}
   reasons=distractors[lang][i];reasons[answer]=rationale
   value=dict(prompt=lines[0],options=[line[3:] for line in lines[1:]],rationales=reasons)
   if lang=='zh':lesson['checks'].append(dict(id=f'AASE-M04-C03-Q{i+4:02}',answer=answer,text={lang:value}))
   else:lesson['checks'][i]['text'][lang]=value
 lesson['sourceIds']=list(dict.fromkeys(x for s in lesson['text']['zh']['sections'] for x in s.get('sourceIds',[])))
 return lesson
if __name__=='__main__':
 data=json.dumps(build(),ensure_ascii=False,indent=2)+'\n';out=ROOT/'content/aase/lessons/aase-m04-c03.json'
 if '--check' in sys.argv:assert out.read_text()==data,'M04-03 differs from source manuscripts'
 else:out.write_text(data)
 print('PASS: complete paired M04-03 manuscripts, six figures and three original checks.')
