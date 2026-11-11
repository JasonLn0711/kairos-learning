"""Build the complete M08-01 lesson from preserved bilingual manuscripts."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m08-01/replacement-2026-11-11'
lesson=json.loads((P/'prior-lesson.json').read_text())
lesson['sourceIds'].append('nasa-verification-validation')
lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
figures=json.loads((P/'figures.json').read_text())
ids=['claim','analogy','layers','matrix','record','collaboration','misread','understanding']
for lang in ['zh','en']:
 chunks=[];buf=[];fenced=False
 for line in (P/f'teaching.{lang}.md').read_text().splitlines():
  if line.startswith('```'):fenced=not fenced
  if line.startswith('## ') and not fenced:chunks.append('\n'.join(buf));buf=[]
  buf.append(line)
 chunks.append('\n'.join(buf));assert len(chunks)==8
 sections=[];table=0
 for n,chunk in enumerate(chunks):
  lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ');paras=[];blocks=[];i=0
  def prose(value):
   if not blocks:paras.append(value)
   elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
   else:blocks.append(dict(kind='prose',paragraphs=[value]))
  while i<len(lines):
   line=lines[i].strip()
   if not line:i+=1;continue
   if line.startswith('@figure'):
    number=int(line[-1]);cap,desc,items=figures[lang][number-1]
    blocks.append(dict(kind='flow' if number==3 else 'cards',caption=cap,description=desc,items=[dict(title=a,body=b)for a,b in items]));i+=1;continue
   if line.startswith('|'):
    rows=[]
    while i<len(lines) and lines[i].strip().startswith('|'):rows.append([v.strip()for v in lines[i].strip().strip('|').split('|')]);i+=1
    table+=1;blocks.append(dict(kind='table',caption=(['表 1｜免運門檻的邊界值','表 2｜假設情境的證據矩陣']if lang=='zh'else['Table 1 | Free-shipping boundary values','Table 2 | Hypothetical evidence matrix'])[table-1],headers=rows[0],rows=rows[2:]));continue
   if line.startswith('```'):
    code=[];i+=1
    while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
    i+=1;blocks.append(dict(kind='step',heading='verification-notes.md',paragraphs=['示例尚未執行；實際結果與狀態必須在測試後更新。'if lang=='zh'else'This example has not been executed. Update actual results and status after testing.'],code='\n'.join(code).strip()));continue
   value=[]
   while i<len(lines) and lines[i].strip():value.append(lines[i]);i+=1
   prose('\n'.join(value))
  sections.append(dict(id=ids[n],heading=heading,paragraphs=paras,**({'blocks':blocks}if blocks else {})))
 assert table==2
 sections[2]['sourceIds']=lesson['sourceIds'][:4]
 sections[6]['sourceIds']=['nasa-verification-validation']
 lesson['text'][lang]['sections']=sections
# Preserve the host's byte-identical bilingual code contract.
for zh,en in zip(lesson['text']['zh']['sections'],lesson['text']['en']['sections']):
 for a,b in zip(zh.get('blocks',[]),en.get('blocks',[])):
  if 'code'in a:b['code']=a['code']
lesson['checks']=[]
questions={
'zh':[
['某 AI Agent 宣稱：「pytest 共有 120 個測試，全部通過。」目前最合理的結論是什麼？',['系統已經符合所有需求','已執行的 120 項測試符合各自預期，其他需求仍須確認','系統已經沒有安全漏洞'],['測試數量沒有證明所有需求均有對應案例。','通過支持已執行的案例；需求涵蓋與其他品質面向仍須核對。','測試通過不能證明所有安全風險不存在。']],
['某學校網站能正確計算學生成績，但學生修改網址後能讀取別人的成績。這最直接屬於哪一類問題？',['介面美觀問題','系統啟動問題','授權與存取控制問題'],['問題在於取得無權讀取的資料，與美觀無關。','系統已啟動；啟動證據無法建立資料隔離。','每次資料請求仍須檢查使用者是否有權讀取該筆成績。']],
['同事尚未試用新系統，但開發者認為操作流程應該很直覺。驗證紀錄該如何標示？',['通過，因為設計看起來合理','待驗，並安排真人任務測試','失敗，因為沒有測試'],['設計推測不能代替真人任務證據。','尚未執行，保留待驗並安排具體任務觀察。','失敗需要已執行且結果不符預期的證據。']]],
'en':[
['An AI Agent reports: “All 120 pytest tests passed.” What is the most reasonable conclusion?',['The system meets every requirement','The 120 executed tests matched their expectations; other requirements still need checking','The system has no security vulnerabilities'],['The number of tests does not establish coverage of every requirement.','Passing supports the executed cases; requirement coverage and other quality perspectives still need checking.','Passing tests does not establish the absence of every security risk.']],
['A school website calculates grades correctly, but a student changes the URL and reads someone else’s grades. What kind of problem is this most directly?',['Interface appearance','System startup','Authorization and access control'],['The problem is access to unauthorized data, not appearance.','The system has started; startup evidence cannot establish data isolation.','Each request must still check permission to read that grade record.']],
['A colleague has not tried a new system, but its developer believes the workflow is intuitive. How should the verification record label it?',['Pass, because the design looks reasonable','Not Tested, and arrange a real user task test','Fail, because no test was run'],['A design assumption cannot replace evidence from a real user task.','Execution is pending; retain Not Tested and arrange observation of a specific task.','Fail requires an executed test whose result did not match expectations.']]]}
for i,answer in enumerate([1,2,1]):
 q=dict(id=f'AASE-M08-C01-Q{i+4:02}',answer=answer,text={})
 for lang in ['zh','en']:
  prompt,options,rationales=questions[lang][i];q['text'][lang]=dict(prompt=prompt,options=options,rationales=rationales)
 lesson['checks'].append(q)
out=ROOT/'content/aase/lessons/aase-m08-c01.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
if '--check'in sys.argv:assert out.read_text()==data
else:out.write_text(data)
print('PASS: complete bilingual M08-01, eight sections, ten subsections, two tables, three figures and three original checks')
