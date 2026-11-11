"""Build M05-01 from the complete reviewed bilingual manuscripts."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/aase/m05-01/replacement-2026-11-11'
IDS=['analogy','responsibility','industries','contract','prompt','verification','conflict','takeaway','understanding']
def build():
 lesson=json.loads((SOURCE/'previous/aase-m05-c01.json').read_text())
 lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
 for lang in ['zh','en']:
  chunks=re.split(r'^## (?=[一二三四五六七八九]、|[1-9]\. )',(SOURCE/f'teaching.{lang}.md').read_text(),flags=re.M)
  assert len(chunks)==10
  sections=[]
  for index,chunk in enumerate(chunks[1:]):
   heading,body=chunk.split('\n',1);lines=body.strip().splitlines();paras=[];blocks=[];i=0
   def prose(value):
    if not blocks:paras.append(value)
    elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
    else:blocks.append(dict(kind='prose',paragraphs=[value]))
   if index==1:paras=['以下從五個面向比較兩種責任。' if lang=='zh' else 'Compare the two responsibilities across five dimensions.']
   while i<len(lines):
    line=lines[i].strip()
    if not line:i+=1;continue
    if line.startswith('```'):
     code=[];i+=1
     while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
     i+=1
     # Code remains identical across languages; English prose explains all clauses.
     if lang=='en':
      original=(SOURCE/'teaching.zh.md').read_text();code=re.search(r'```\n(.*?)\n```',original,re.S)[1].strip().splitlines()
     blocks.append(dict(kind='step',heading='spec.md｜收件資料檢核規格' if lang=='zh' else 'spec.md | Recipient-data checking requirements',paragraphs=['合成教學範例；R-01 至 R-04 與 T-01 至 T-04 分別記錄要求與驗收情境。' if lang=='zh' else 'Synthetic teaching example. R-01 requires recipient, telephone and address. R-02 identifies missing or whitespace-only fields and blocks completion. R-03 invalidates earlier completion after an edit. R-04 limits the result to field completeness, excluding telephone validity, address existence and official acceptance. T-01 covers all fields present; T-02 an empty address; T-03 whitespace-only input; T-04 an edited checked record.'],code='\n'.join(code).strip()));continue
    if line.startswith('|'):
     rows=[]
     while i<len(lines) and lines[i].strip().startswith('|'):rows.append([v.strip()for v in lines[i].strip().strip('|').split('|')]);i+=1
     blocks.append(dict(kind='table',caption=(['','表 1｜Prompt 與 Spec 的責任比較','表 2｜三種產業的任務與承諾','表 3｜一條規格的五個問題'][index] if lang=='zh' else ['','Table 1 | Responsibilities of Prompt and Spec','Table 2 | Tasks and commitments in three industries','Table 3 | Five questions for a requirement'][index]),headers=rows[0],rows=rows[2:]));continue
    value=[]
    while i<len(lines) and lines[i].strip():value.append(lines[i]);i+=1
    prose('\n'.join(value))
   if not paras:paras=['將系統承諾與本次工作安排分開紀錄。' if lang=='zh' else 'Record system commitments separately from the current assignment.']
   sections.append(dict(id=IDS[index],heading=heading,paragraphs=paras,**({'blocks':blocks}if blocks else {})))
  # The supplied workflow's labels live once in the responsive figure.
  s=sections[5];p=s['paragraphs'];assert len(p)==17,(lang,len(p))
  items=[dict(title=p[i],body=p[i+1])for i in range(0,10,2)]
  s['paragraphs']=['從問題、要求、工作交辦到實作與驗證，各階段使用不同依據。' if lang=='zh' else 'Problem, requirements, assignments, implementation and verification each have a different responsibility.']
  s['blocks']=[dict(kind='flow',caption='圖 1｜從問題到驗證，再回到適當階段' if lang=='zh' else 'Figure 1 | From problem to verification, with revision where needed',description=('↻ '+p[10]+'。箭頭表示閱讀順序；'+p[11] if lang=='zh' else '↻ '+p[10]+' Arrows indicate reading order. '+p[11]),items=items),dict(kind='prose',paragraphs=p[12:])]
  sections[3]['sourceIds']=['nasa-requirements'];s['sourceIds']=['cucumber-bdd']
  lesson['text'][lang]['sections']=sections
  # Keep the three supplied questions intact with native reference answers; no submission service.
  lesson['text'][lang]['openChecks']=[dict(id='AASE-M05-C01-Q04',prompt='第一題參考解析｜辨識 Prompt 與 Spec' if lang=='zh' else 'Question 1 reference reasoning | Prompt or Spec',answer=['答案 A。它規定異常金額時的系統行為：阻止付款並顯示原因。B 安排修改順序，C 安排回報。實作前還要由業務方定義「異常」的判定規則，才能設計完整測試。' if lang=='zh' else 'Answer A defines observable system behavior: prevent payment and display a reason when the amount is abnormal. B schedules edits; C schedules reporting. The business owner must still define what counts as abnormal before complete tests can be designed.']),dict(id='AASE-M05-C01-Q05',prompt='第二題參考解析｜處理規格衝突' if lang=='zh' else 'Question 2 reference reasoning | Resolve the conflict',answer=['答案 B。先保留衝突，確認誰有權變更地址規則及變更理由；若決定修訂，同步更新規格與測試。最新一句指令與較容易實作都不能單獨決定規則。' if lang=='zh' else 'Answer B. Retain the conflict, confirm who owns the address-rule decision and why it should change, then update the specification and tests if approved. Recency and implementation convenience alone do not establish authority.']),dict(id='AASE-M05-C01-Q06',prompt='第三題參考解析｜學生缺課提醒系統' if lang=='zh' else 'Question 3 reference example | Student-absence notifications',answer=['Spec 範例：已核定的缺課門檻為連續兩節，當同一學生的已確認紀錄達到門檻時，系統必須建立一則待處理提醒；同一事件重跑不得重複建立。兩節是本題合成規則，實際門檻需學校確認。' if lang=='zh' else 'Example Spec: using an approved threshold of two consecutive lessons, create one pending notification when a student’s confirmed absence records meet that threshold; rerunning the same event must not duplicate it. Two lessons is a synthetic rule for this exercise; the school must confirm its actual threshold.','Prompt 範例：先讀 spec.md 的缺課門檻與防重規則，只修改提醒判定與對應測試；列出影響檔案，執行未達門檻、達門檻及重跑三種測試，回報 Diff、命令、結果與未驗項。通知對象或權限未定義時，停止相關修改並提出待確認事項。' if lang=='zh' else 'Example Prompt: read the absence threshold and duplicate-prevention rules in spec.md. Change only notification decisions and related tests. List affected files, run below-threshold, at-threshold and repeated-event tests, and report the diff, commands, results and unverified items. If recipients or permissions are undefined, stop the affected edits and list the decisions needed.'])]
 # Prior question objects remain as supplemental checks; supplied questions and their answers are separate.
 return lesson
if __name__=='__main__':
 data=json.dumps(build(),ensure_ascii=False,indent=2)+'\n';target=ROOT/'content/aase/lessons/aase-m05-c01.json'
 if '--check'in sys.argv:assert target.read_text()==data,'lesson differs from manuscripts'
 else:target.write_text(data)
 print('PASS: complete bilingual nine-section M05-01 generated.')
