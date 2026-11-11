"""Build M07-02 from preserved bilingual manuscripts and the two fixed figures."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/aase/m07-02/replacement-2026-11-11'
IDS=['analogy','contract','elements','slices','prompt','review','misread','industries','mistakes','understanding']
FIGURES={
'zh':[
 ('圖 1｜可核對的五步委派閉環','四個向下箭頭表示本次委派的工作順序；最後由人類接受、退回修正或釐清需求，必要時回到規格與契約。圖中不另畫回線，也不代表已完成驗收。',[
 ('1. 人類確認規格（Specification）','定義什麼才算做對、哪些規則已被確認'),('2. 訂定工作契約（Task Contract）','明確指定任務範圍、工具、驗收與停止條件'),('3. AI Agent 執行','在實際授予的權限內操作，保留紀錄'),('4. 提供證據（Evidence）','呈現檔案差異、測試結果、未完成事項'),('5. 人類審查與驗收','接受成果、退回修正，或先釐清需求')]),
 ('圖 2｜依問題性質決定修正或停下來','兩種情境是並列的判斷分支，沒有先後箭頭；需求歧義停受影響部分，實作錯誤則在授權範圍修正並驗證。',[
 ('情境 A：需求歧義（Requirement Ambiguity）','學校未說明請假超過三天是否需要額外核准。AI 不應自行訂定校規，應提出問題，請負責人確認。\n處理：暫停受影響功能，確認規則後再繼續。'),('情境 B：實作錯誤（Implementation Error）','規格要求顯示「請假開始日期」，畫面卻顯示「入學日期」。這是程式錯誤，既定規則無須重新決定。\n處理：Agent 可在授權範圍內修正，並驗證修改。')])],
'en':[
 ('Figure 1 | A verifiable five-step delegation loop','Four downward arrows show the order within this task. The human accepts, returns corrections or clarifies requirements, returning to specification and contract when necessary. No return edge is drawn; this is not a completed acceptance record.',[
 ('1. Human confirms the specification','Define correct behavior and identify confirmed rules.'),('2. Establish a task contract','Specify scope, tools, acceptance and stop conditions.'),('3. AI Agent executes','Operate within actually granted permissions and retain records.'),('4. Provide evidence','Show file differences, test results and unfinished work.'),('5. Human review and acceptance','Accept the result, request corrections or clarify requirements first.')]),
 ('Figure 2 | Decide whether to correct or pause','These are parallel decision cases, without sequence arrows. Pause affected work for ambiguous requirements; correct implementation errors within authorization and verify.',[
 ('Scenario A: Requirement Ambiguity','The school has not specified whether leave exceeding three days needs additional approval. Ask the responsible person instead of inventing policy.\nResponse: pause affected functionality and resume after confirmation.'),('Scenario B: Implementation Error','The specification requires “Leave start date,” but the screen says “Enrollment date.” The implementation is wrong; the agreed rule needs no new decision.\nResponse: correct within authorization and verify the change.')])]
}
ANSWERS={
'zh':['只做病患編號、看診日期、科別三欄與輸入預覽，清楚標示尚未檢核；以合成資料示範，不擴張成完整醫療系統。','例如禁止新增診斷建議、禁止串接電子病歷資料庫；自動寄送報告也在本次範圍之外。文字禁止事項需搭配實際工具與資料存取權限。','必要欄位或正式業務規則未定義、需要擴大資料存取或取得尚未授予的權限時，列出具體問題，停止受影響修改。規格明確的欄位誤植則可在授權內修正並驗證。','要求修改檔案、逐檔說明、Diff、實際測試命令與原始結果、未驗事項，以及三欄輸入／預覽與「尚未檢核」的操作證據；對照範圍與依賴差異，確認未加入診斷、資料庫或寄信。單元測試不代替全程驗收。'],
'en':['Deliver only patient identifier, visit date and department inputs plus an input preview explicitly marked not yet validated. Demonstrate with synthetic data; keep the medical system expansion outside this slice.','For example, prohibit diagnostic suggestions and connection to an electronic medical-record database. Automatic report emailing is also outside this scope. Pair written prohibitions with actual tool and data-access limits.','Ask specific questions and pause affected work when necessary fields or official rules are undefined, or broader data access or ungranted permissions would be needed. A mislabeled field under a clear specification may be corrected and verified within authorization.','Request changed files, per-file explanations, diff, actual test commands and original results, pending checks and observed three-field input/preview behavior with the not-yet-validated label. Inspect scope and dependency changes for unrequested diagnosis, storage or email features. Unit tests do not replace end-to-end acceptance.']}
def generate():
 lesson=json.loads((SOURCE/'prior-lesson.json').read_text());lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11');lesson['checks']=[]
 zh=(SOURCE/'teaching.zh.md').read_text();template=re.search(r'```\n(.*?)\n```',zh,re.S).group(1)
 for lang in ['zh','en']:
  raw=(SOURCE/f'teaching.{lang}.md').read_text().replace('TASK_TEMPLATE',template)
  chunks=re.split(r'^## ',raw,flags=re.M)[1:];assert len(chunks)==10
  sections=[]
  for index,chunk in enumerate(chunks):
   lines=chunk.strip().splitlines();heading=lines.pop(0);paragraphs=[];blocks=[];i=0
   def prose(value):
    if not blocks:paragraphs.append(value)
    elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
    else:blocks.append(dict(kind='prose',paragraphs=[value]))
   while i<len(lines):
    line=lines[i].strip()
    if not line:i+=1;continue
    if index==9 and re.match(r'^[1-4]\. ',line):
     i+=1;continue
    if line.startswith('@figure'):
     n=int(line[-1]);cap,desc,items=FIGURES[lang][n-1];blocks.append(dict(kind='flow'if n==1 else'cards',caption=cap,description=desc,items=[dict(title=a,body=b)for a,b in items]));i+=1;continue
    if line.startswith('### '):
     blocks.append(dict(kind='step',id='technical-controls',heading=line[4:],paragraphs=['從執行權限判斷能否強制限制行為。'if lang=='zh'else'Check execution permissions to determine which limits are enforced.']));i+=1;continue
    if line.startswith('|'):
     rows=[]
     while i<len(lines) and lines[i].strip().startswith('|'):
      rows.append([v.strip().replace('`','')for v in lines[i].strip().strip('|').split('|')]);i+=1
     blocks.append(dict(kind='table',caption=(('表格｜'if lang=='zh'else'Table | ')+rows[0][0]+' / '+rows[0][-1]),headers=rows[0],rows=rows[2:]));continue
    if line.startswith('```'):
     code=[];i+=1
     while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
     blocks.append(dict(kind='step',heading='可複製的 Agent 任務範例'if lang=='zh'else'Copy-ready Agent task example',paragraphs=['保留原稿任務；範例尚未執行。'if lang=='zh'else'The original Traditional Chinese task is preserved below; it has not been executed. Read problem.md, spec.md, architecture.md and AGENTS.md, reporting missing files honestly. Build only three labeled inputs and an input preview. Edit app.py and tests/ only; preserve reference/. Exclude login, databases, downloads, external APIs and real personal data. Accept editable fields, a preview and an explicit not-yet-validated label without unverified completeness claims. Pause affected changes for undefined required fields or official rules. Report changed files, per-file changes, diff highlights, actual test commands, results and failure reasons, and pending checks.'],code='\n'.join(code)));i+=1;continue
    value=[]
    while i<len(lines)and lines[i].strip():value.append(lines[i]);i+=1
    prose('\n'.join(value))
   if not paragraphs:paragraphs.append(('以下比較各行業的執行範圍與約束。'if index==7 else'以下四種常見錯誤各有對應的修正方法。')if lang=='zh'else('Compare execution scope and boundaries across industries below.'if index==7 else'Each of these four common mistakes has a corresponding correction.'))
   s=dict(id=IDS[index],heading=heading,paragraphs=paragraphs,**({'blocks':blocks}if blocks else{}))
   if index==4:s['sourceIds']=['owasp-agent-security']
   if index==6:s['sourceIds']=['effective-agents']
   sections.append(s)
  # Keep the previous request anchor on the introductory orientation.
  sections.insert(0,dict(id='request',heading='本次要學會的判斷'if lang=='zh'else'The decision you will learn to make',paragraphs=['本課屬於 M07；本次只委派本機表單切片，後續再建立檢核與匯出。先確認規格、範圍及實際權限，再以證據決定是否接受成果。'if lang=='zh'else'This lesson belongs to M07. Delegate only the local form slice, with validation and export in later lessons. Confirm specification, scope and actual permissions, then use evidence to decide whether to accept the result.']))
  lesson['text'][lang]['sections']=sections
  questions=re.findall(r'^[1-4]\. (.+)$',chunks[-1],re.M);assert len(questions)==4
  lesson['text'][lang]['openChecks']=[dict(id=f'AASE-M07-C02-Q{i+4:02}',prompt=q,answer=[ANSWERS[lang][i]])for i,q in enumerate(questions)]
 return lesson
if __name__=='__main__':
 output=ROOT/'content/aase/lessons/aase-m07-c02.json';data=json.dumps(generate(),ensure_ascii=False,indent=2)+'\n'
 if '--check'in sys.argv:assert output.read_text()==data,'lesson differs from manuscripts'
 else:output.write_text(data)
 print('PASS: M07-02 bilingual manuscripts synchronized.')
