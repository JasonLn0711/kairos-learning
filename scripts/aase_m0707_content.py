"""Build M07-07 from the preserved bilingual manuscripts and figure data."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m07-07/replacement-2026-11-11'
IDS=['analogy','bug','failure-layers','loop','snapshot','industries','restore','agent-task','controlled-fault','handoff']
def parse(lang,figures):
 raw=(P/f'teaching.{lang}.md').read_text().replace('@python','```python\n'+(P/'snapshot_example.py').read_text().strip()+'\n```')
 sections=[];table=0
 for n,chunk in enumerate(re.split(r'^## ',raw,flags=re.M)[1:]):
  lines=chunk.splitlines();heading=lines.pop(0);paragraphs=[];blocks=[];i=0
  def prose(value):
   if not blocks:paragraphs.append(value)
   elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
   else:blocks.append(dict(kind='prose',paragraphs=[value]))
  while i<len(lines):
   line=lines[i].strip()
   if not line:i+=1;continue
   if line.startswith('@figure'):
    blocks.append(figures[lang][int(line[-1])-1]);i+=1;continue
   if line.startswith('```'):
    code=[];i+=1
    while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
    i+=1;blocks.append(dict(kind='step',heading=('範例與命令' if lang=='zh' else 'Example and command'),paragraphs=[('在指定的練習副本中檢查；先確認執行目錄與環境。' if lang=='zh' else 'Check in the designated practice copy; confirm directory and environment first.')],code='\n'.join(code)));continue
   if line.startswith('### '):
    title=line[4:];i+=1
    while i<len(lines) and not lines[i].strip():i+=1
    content=[]
    while i<len(lines) and lines[i].strip():content.append(lines[i]);i+=1
    blocks.append(dict(kind='step',heading=title,paragraphs=['\n'.join(content)]));continue
   if line.startswith('|'):
    rows=[]
    while i<len(lines) and lines[i].strip().startswith('|'):
     rows.append([v.strip()for v in lines[i].strip().strip('|').split('|')]);i+=1
    table+=1;blocks.append(dict(kind='table',caption=f'{"表" if lang=="zh" else "Table"} {table}',headers=rows[0],rows=rows[2:]));continue
   value=[]
   while i<len(lines) and lines[i].strip():value.append(lines[i]);i+=1
   prose('\n'.join(value))
  sections.append(dict(id=IDS[n],heading=heading,paragraphs=paragraphs,**({'blocks':blocks}if blocks else {})))
 assert len(sections)==10 and table==3
 # Questions are rendered by the existing reference-answer component once.
 last=sections[-1];paras=last['paragraphs'];start=next(i for i,p in enumerate(paras) if p.startswith('問題 1：' if lang=='zh' else 'Question 1:'))
 questions=[]
 rationales=(
 [['先建立故障證據，才能決定必要修正範圍。','可重演步驟與預期結果讓 Agent 有明確的調查起點。','更換框架沒有解釋目前的狀態錯誤。'],['已知故障仍存在，通過不能證明此行為正確。','先檢查斷言與涵蓋範圍，再補足測試。','保留測試並改善偵測能力。'],['整個專案復原會移除無關工作。','保存現況、辨識變更範圍並局部復原，再驗證受影響功能。','已知故障需要調查與修復。']]
 if lang=='zh' else
 [['Establish failure evidence before choosing repair scope.','Reproducible steps and an expected result give the Agent a concrete investigation starting point.','Replacing the framework does not explain the current state fault.'],['The known fault remains; a pass does not establish correctness of this behavior.','Review assertions and coverage, then strengthen detection.','Retain tests and improve their ability to detect the fault.'],['Whole-project recovery can remove unrelated work.','Preserve the state, identify the change scope, recover locally and verify affected features.','A known fault requires investigation and repair.']])
 for j in range(3):
  k=start+j*4;questions.append(dict(prompt=paras[k],options=[re.sub(r'^[A-C]\. ','',v)for v in paras[k+1:k+4]],rationales=rationales[j]))
 last['paragraphs']=[*paras[:start],*paras[start+12:]]
 return sections,questions

def main():
 figures=json.loads((P/'figures.json').read_text());lesson=json.loads((P/'prior-lesson.json').read_text())
 lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11');qs={}
 for lang in ['zh','en']:
  sections,qs[lang]=parse(lang,figures)
  lesson['text'][lang]['sections']=sections
  # Editorial source evidence is checked without changing the original publication gate.
  for s in sections:
   if s['id']=='loop':s['sourceIds']=['pytest-usage','streamlit-apptest']
   if s['id']=='restore':s['sourceIds']=['git-diff','git-restore']
 lesson['checks']=[dict(id=f'AASE-M07-C07-Q{i+4:02}',answer=1,text={lang:qs[lang][i]for lang in ['zh','en']})for i in range(3)]
 dest=ROOT/'content/aase/lessons/aase-m07-c07.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
 if '--check'in sys.argv:assert dest.read_text()==data,'M07-07 content out of sync'
 else:dest.write_text(data)
 print('PASS: M07-07 bilingual manuscripts and four figures synchronized.')
if __name__=='__main__':main()
