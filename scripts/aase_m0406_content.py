"""Generate the complete M04-06 manuscripts and constrained figure data."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'docs/sources/aase/m04-06/replacement-2026-11-11'
lesson=json.loads((p/'prior-lesson.json').read_text())
lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11');lesson['checks']=[]
figures={
'zh':[
('圖 1｜無法繼續工作的失敗訊息','反例：只有失敗與重填要求，沒有說明缺漏、保留狀態或下一步。靜態示範，非真實系統。',[('發生錯誤','系統處理失敗，請重新填寫所有資料。'),('觀察問題','使用者不知道哪裡出錯，也不知道先前工作是否保留。')]),
('圖 2｜能繼續申請的復原訊息','正例：明確指出缺件、保留其他資料，並提供可執行的下一步。示範訊息，非真實系統。',[('尚未完成申請','你尚未上傳「收入證明文件」。'),('保留進度與下一步','其他資料都已保留，請補上收入證明後，再按「重新檢查」。')]),
('圖 3｜好的錯誤復原','三個要素以加號相連，表示共同條件，不代表三個依序發生的畫面。',[('指出問題','具體說明哪裡需要修正。'),('保留進度','保留已完成且可安全保留的工作。'),('提供下一步','說明補填、重新檢查、重試或求助的動作。')]),
('圖 4｜表單錯誤摘要與欄位提示','依 CMS Design System 附圖重製的靜態教學示意；摘要連到本圖問題欄位。範例姓名長度與 MM/DD/YYYY 是示例規則，非所有服務通則。',[('1｜頁首錯誤摘要','請完成以下項目以建立帳號：'),('2a｜姓氏','請輸入超過 1 個字元的姓氏。'),('2b｜出生日期','請以 MM/DD/YYYY 輸入出生日期。'),('已填名字','Lisa'),('3｜姓氏欄位提示','請輸入超過 1 個字元的姓氏。\n目前值：空白'),('出生日期欄位提示','請以 MM/DD/YYYY 輸入出生日期。\n月：空白／日：01／年：1990'),('4｜送出位置','靜態示意；此處不送出資料。')]),
('圖 5｜有分支的復原路徑','箭頭表示概念狀態轉換；結果判斷後依條件分流，不把失敗當成成功前的必經步驟。修改既有輸入時，舊結果必須重新驗證。',[('輸入資料','使用者填寫必要欄位'),('處理中','檢查、驗證、計算'),('結果判斷','成功、缺漏或技術失敗'),('缺漏或技術失敗 → 需修正／重試','保留資料，提供出口；修正後回到輸入／重新檢查。'),('成功 → 完成','有效結果與下一步；修改輸入後使舊結果失效。')])],
'en':[
('Figure 1 | An error message that stops the task','Counterexample: failure and re-entry are requested without identifying omissions, retained progress or a next action. Static illustration, not a real service.',[('An error occurred','Processing failed. Please enter all information again.'),('What is missing?','Users cannot identify the problem or tell whether earlier work was retained.')]),
('Figure 2 | Feedback that supports recovery','Identify the missing document, retain other data and provide an actionable next step. Illustrative message, not a real service.',[('Application not yet complete','You have not uploaded the income verification document.'),('Retained progress and next action','All other data has been retained. Upload the income verification document, then select Recheck.')]),
('Figure 3 | Good error recovery','Plus signs join three complementary requirements; they do not represent sequential screens.',[('Identify the problem','Explain precisely what needs correction.'),('Preserve progress','Retain completed work that can safely be retained.'),('Provide the next action','Explain completion, rechecking, retry or help.')]),
('Figure 4 | Error summary and field messages','Static teaching adaptation of the supplied CMS Design System example. Summary links target the affected fields in this figure. Surname length and MM/DD/YYYY are example-specific rules.',[('1 | Error summary','Complete these items to create your account:'),('2a | Last name',"Enter a last name that’s more than 1 character."),('2b | Date of birth','Enter birthdate as MM/DD/YYYY.'),('Entered first name','Lisa'),('3 | Last-name field message',"Enter a last name that’s more than 1 character.\nCurrent value: empty"),('Date-of-birth field message','Enter birthdate as MM/DD/YYYY.\nMonth: empty / Day: 01 / Year: 1990'),('4 | Submit position','Static illustration; no data is submitted here.')]),
('Figure 5 | Recovery with conditional branches','Arrows indicate conceptual state transitions. The decision branches by condition: failure is not required before success. Changing input requires revalidation of old results.',[('Input','The user fills required fields'),('Processing','Check, validate and calculate'),('Decision','Success, missing data or technical failure'),('Missing data or technical failure → correct / retry','Keep data and provide an exit; correction returns to input / rechecking.'),('Success → complete','Valid result and next action; changing input invalidates the old result.')])]
}
ids=['introduction','recovery','access','usability','state-transitions','evidence','understanding']
answers={
'zh':[
'A 涉及錯誤復原與 UX：網路中斷造成努力流失。B 是可見焦點與鍵盤可近用問題，可達仍不足以操作。C 是資料一致性與系統正確性問題，也會造成誤導的 UX；報告必須對應正確影像版本。',
'A 由前端保留安全可保留的輸入，必要時由後端提供受權限與保存期限控制的草稿／復原機制；先確認提交狀態再重試。B 由前端提供清楚的 focus-visible 樣式並實測順序、操作與離開。C 由前後端共同綁定輸入與分析版本：修改後失效，下載時後端再次檢查，不只隱藏按鈕。醫療資料的保留另需符合實際授權與保護規則。',
'要求掃描工具、版本、頁面範圍、日期、報告及修正後重測，另補指定流程的人工鍵盤測試、焦點／錯誤訊息／標籤語意檢查、指定輔助科技與環境實測，以及真人任務觀察。各自寫出覆蓋與待驗，不能以自動掃描或五人成功代表完整 WCAG 合規。'],
'en':[
'A concerns recovery and UX: an interrupted upload destroys prior effort. B concerns visible focus and keyboard accessibility; reachability alone is insufficient. C concerns data consistency and system correctness, while also creating misleading UX. The report must match the correct image version.',
'For A, retain input that is safe to retain on the frontend; where needed, provide a backend draft/recovery mechanism with access and retention controls. Confirm submission status before retrying. For B, supply clear focus-visible styling and test order, operation and exits. For C, bind input and analysis versions on both frontend and backend, invalidate results after changes and revalidate downloads on the backend rather than only hiding a button. Medical-data retention also follows actual authorization and protection rules.',
'Request the scanning tool/version, page scope, date, report and post-fix retest. Add manual keyboard tests of specified paths, focus/error/label semantics checks, tests with specified assistive technologies and environments, and participant task observations. Record coverage and pending items separately; an automated scan or five successful participants cannot establish complete WCAG conformance.']}
for lang in ['zh','en']:
 raw=(p/f'teaching.{lang}.md').read_text();chunks=re.split(r'^## ',raw,flags=re.M);assert len(chunks)==7
 sections=[]
 for n,chunk in enumerate(chunks):
  lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ');paras=[];blocks=[];i=0
  if n==0:heading='出錯後，如何繼續完成工作？' if lang=='zh' else 'How can users continue after an error?'
  def prose(value):
   if not blocks:paras.append(value)
   elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
   else:blocks.append(dict(kind='prose',paragraphs=[value]))
  while i<len(lines):
   line=lines[i].strip()
   if not line:i+=1;continue
   if line.startswith('@figure'):
    cap,desc,items=figures[lang][int(line[-1])-1];blocks.append(dict(kind='cards',caption=cap,description=desc,items=[dict(title=a,body=b)for a,b in items]));i+=1;continue
   if line.startswith('### '):
    blocks.append(dict(kind='step',id=('messages' if n==1 else 'task-test' if n==5 else ['color','keyboard','labels'][sum(b['kind']=='step' for b in blocks)]),heading=line[4:],paragraphs=['以下以合成情境說明設計與驗證。' if lang=='zh' else 'The following synthetic scenarios explain design and verification.']));i+=1;continue
   if line.startswith('|'):
    rows=[]
    while i<len(lines) and lines[i].strip().startswith('|'):rows.append([v.strip()for v in lines[i].strip().strip('|').split('|')]);i+=1
    blocks.append(dict(kind='table',caption=('表' if lang=='zh' else 'Table')+f' {sum(b["kind"]=="table" for s in sections for b in s.get("blocks",[]))+sum(b["kind"]=="table" for b in blocks)+1}',headers=rows[0],rows=rows[2:]));continue
   if line.startswith('```'):
    value=[];i+=1
    while i<len(lines) and not lines[i].startswith('```'):value.append(lines[i]);i+=1
    i+=1;blocks.append(dict(kind='step',heading='HTML｜標籤與錯誤關聯' if lang=='zh' else 'HTML | Label and error associations',paragraphs=['保留原稿程式碼；這是語意片段，不代表已完成可近用驗收。' if lang=='zh' else 'Original source snippet; this does not establish accessibility acceptance.'],code='\n'.join(value).strip()));continue
   value=[]
   while i<len(lines) and lines[i].strip():value.append(lines[i]);i+=1
   prose(re.sub(r'\[([^\]]+)\]\(https://[^)]+\)',r'\1','\n'.join(value)))
  sections.append(dict(id=ids[n],heading=heading,paragraphs=paras,**({'blocks':blocks}if blocks else {})))
 assert len([b for s in sections for b in s.get('blocks',[])if b['kind']=='cards'])==5
 assert len([b for s in sections for b in s.get('blocks',[])if b['kind']=='table'])==4
 # Preserve the former analogy anchor on the road/elevator analogy's enclosing section.
 sections[3]['blocks']= [dict(kind='step',id='analogy',heading='用航空改票比較兩種問題' if lang=='zh' else 'Compare the two questions through ticket changes',paragraphs=['以同一任務分別檢查可操作與能否順利完成目標。' if lang=='zh' else 'Check both operation and successful goal completion within the same task.'])]+sections[3].get('blocks',[])
 sections[1]['sourceIds']=['wai-notifications']
 sections[2]['sourceIds']=['wai-labels','wai-keyboard','wai-focus','wai-color']
 lesson['text'][lang]['sections']=sections
 questions=re.search(r'^1\. (.+)\n2\. (.+)\n3\. (.+)$',chunks[-1],re.M)
 assert questions
 lesson['text'][lang]['openChecks']=[dict(id=f'AASE-M04-C06-Q{i+4:02}',prompt=q,answer=[answers[lang][i]])for i,q in enumerate(questions.groups())]
output=ROOT/'content/aase/lessons/aase-m04-c06.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
if '--check'in sys.argv:assert output.read_text()==data,'lesson differs from manuscripts'
else:output.write_text(data)
print('PASS: seven bilingual sections, all supplied subsections, four tables, five figures, three open checks.')
