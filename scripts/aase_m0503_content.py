"""Build M05-03 from preserved bilingual manuscripts and bounded figure data."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m05-03/replacement-2026-11-11'
lesson=json.loads((P/'prior-lesson.json').read_text())
lesson.update(revision=6,contentVersion='1.1.0',date='2026-11-11')
figures={
'zh':[
('圖 1｜Given／When／Then 的三個時間位置','箭頭表示同一情境由前置條件、觸發動作走向預期結果；這是訂餐的合成示例。',[
('Given — 假設／前置條件｜開始前','顧客已選擇牛排，但尚未填寫外送地址。'),('When — 當／觸發動作｜操作時','顧客按下「確認訂單」。'),('Then — 那麼／預期結果｜操作後','系統提示「請填寫外送地址」，不得建立正式訂單，且保留已選餐點。')]),
('圖 2｜四個平行的驗收情境','A–D 各自驗證不同條件，沒有先後順序；D 內部的資料變更使舊檢核結果失效。',[
('情境 A：完整資料','三個欄位都有有效內容，使用者按下檢查。系統應通過完整性檢核，允許預覽與匯出同一筆資料的報告。'),('情境 B：缺少必要欄位','文件類型沒有填寫。系統必須指出缺漏，禁止匯出標記為完整的報告，同時保留使用者已填的資料。'),('情境 C：輸入只有空白字元','申請人代號輸入了三個空格。雖然文字欄位不一定是空字串，但清除前後空白後沒有有效內容，仍應視為缺漏。'),('情境 D：先前通過，但資料後來改變','使用者先通過檢查，之後卻刪除了文件類型。原本通過的結果應立即失效，不得直接使用舊的成功狀態匯出。')]),
('圖 3｜需求到可查核證據的追溯鏈','箭頭表示相鄰層次需要有可查核的連結；畫出這條鏈不代表測試已執行或已通過。',[
('需求（Requirement）','定義工作承諾與禁止結果。'),('驗收情境（Acceptance Scenario）','以具體條件、動作與結果表達需求。'),('測試案例（Test Case）','指定如何操作與比較實際結果。'),('執行結果（Test Result）','記錄本次實際觀察到的結果。'),('可查核證據（Evidence）','保存測試版本、命令與結果，供他人重查。')])],
'en':[
('Figure 1 | Three positions in Given / When / Then','Arrows connect preconditions, the trigger and the expected outcome within one synthetic ordering scenario.',[
('Given — preconditions | Before','The customer has selected steak but has not entered a delivery address.'),('When — trigger | During','The customer selects Confirm order.'),('Then — expected outcome | After','Display “Enter a delivery address,” create no official order and retain the selected food.')]),
('Figure 2 | Four parallel acceptance scenarios','A–D test different conditions without a required order. Within D, changed data invalidates the old validation result.',[
('Scenario A: complete data','All three fields have valid values. The user checks the form. Completeness passes, and preview and export use the same record.'),('Scenario B: a required field is missing','Document type is empty. Identify the omission, prevent export of a report marked complete and retain entered data.'),('Scenario C: whitespace-only input','Applicant code contains three spaces. It is not necessarily an empty string, but trimming leaves no valid content, so treat it as missing.'),('Scenario D: data changes after a pass','The user passes validation, then deletes document type. Invalidate the old result immediately and prevent export using the stale success state.')]),
('Figure 3 | Trace requirements to inspectable evidence','Arrows indicate links that must be inspectable between adjacent layers. Drawing this chain does not establish execution or a pass.',[
('Requirement','Define the work commitment and forbidden outcomes.'),('Acceptance Scenario','Express the requirement through concrete conditions, actions and outcomes.'),('Test Case','Specify operations and comparison with actual outcomes.'),('Test Result','Record the outcome actually observed in this run.'),('Evidence','Retain the tested version, command and result for independent inspection.')])]
}
zh=(P/'teaching.zh.md').read_text()
codes=re.findall(r'```\n(.*?)\n```',zh,re.S);assert len(codes)==3
ids=['start','mechanism','transfer','negative','examples','specification','tests','understanding']
for lang in ['zh','en']:
 raw=(P/f'teaching.{lang}.md').read_text()
 if lang=='en':
  for n,code in enumerate(codes,1):raw=raw.replace(f'@code{n}',f'```\n{code}\n```')
 # Protect code before splitting Markdown headings.
 protected=[]
 def protect(m):protected.append(m[0]);return f'@codeblock{len(protected)-1}'
 raw=re.sub(r'```\n.*?\n```',protect,raw,flags=re.S)
 chunks=re.split(r'^## ',raw,flags=re.M);assert len(chunks)==8
 sections=[]
 for n,chunk in enumerate(chunks):
  lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ');paras=[];blocks=[];i=0
  def prose(value):
   if not blocks:paras.append(value)
   elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
   else:blocks.append(dict(kind='prose',paragraphs=[value]))
  while i<len(lines):
   line=lines[i].strip()
   if not line:i+=1;continue
   if line.startswith('### '):
    blocks.append(dict(kind='step',id='enforcement',heading=line[4:],paragraphs=['以伺服器回應與實際取得的內容核對授權。' if lang=='zh' else 'Check authorization against the server response and content actually obtained.']));i+=1;continue
   if line.startswith('@figure'):
    num=int(line[-1]);cap,desc,items=figures[lang][num-1]
    blocks.append(dict(kind='cards' if num==2 else 'flow',caption=cap,description=desc,items=[dict(title=a,body=b)for a,b in items]));i+=1;continue
   if line.startswith('@codeblock'):
    code=protected[int(line[len('@codeblock'):])][4:-4]
    blocks.append(dict(kind='step',heading=('規格片段' if lang=='zh' else 'Specification fragment'),paragraphs=[('這段文字定義預期行為，尚未連到測試執行。' if lang=='zh' else 'This text defines expected behavior; it is not connected to test execution.')],code=code));i+=1;continue
   if line.startswith('|'):
    rows=[]
    while i<len(lines) and lines[i].strip().startswith('|'):rows.append([v.strip()for v in lines[i].strip().strip('|').split('|')]);i+=1
    captions={'zh':['三段各自回答的問題','六種產業的正向與負向驗收','六項驗收品質檢查'],'en':['Questions answered by each part','Positive and negative acceptance in six industries','Six acceptance-quality checks']}
    j=sum(b['kind']=='table' for s in sections for b in s.get('blocks',[]))
    blocks.append(dict(kind='table',caption=captions[lang][j],headers=rows[0],rows=rows[2:]));continue
   value=[]
   while i<len(lines) and lines[i].strip():value.append(lines[i]);i+=1
   prose('\n'.join(value))
  if n==7:
   # The two questions use the lesson's native checks below; retain explanation and conclusion here.
   tail=blocks[-1]['paragraphs'];assert len(tail)==10,len(tail)
   blocks[-1]['paragraphs']=tail[-3:]
  sections.append(dict(id=ids[n],heading=heading,paragraphs=paras,**({'blocks':blocks}if blocks else {})))
 # Preserve the two former deep-link targets as visible, useful continuation notes.
 sections[5]['blocks'].append(dict(kind='step',id='changes',heading='規格變更也要更新情境' if lang=='zh' else 'Update scenarios when requirements change',paragraphs=['若新增第四個必要欄位，請同步更新規格、正常與缺漏情境、表單及測試資料，並由領域負責人確認新規則。' if lang=='zh' else 'If a fourth required field is added, update the specification, normal and missing-field scenarios, form and test data together; have the domain owner confirm the new rule.']))
 sections[6]['blocks'].append(dict(kind='step',id='misunderstandings',heading='維持可觀察且與外觀分離的條件' if lang=='zh' else 'Keep criteria observable and independent of appearance',paragraphs=['以實際拒絕與允許的動作判斷，不以按鈕位置、顏色或「安全好用」代替工作承諾。' if lang=='zh' else 'Judge actions actually allowed or rejected; button position, color or “secure and usable” cannot replace the work commitment.']))
 sections[1]['sourceIds']=['gherkin'];sections[5]['sourceIds']=['gherkin']
 lesson['text'][lang]['sections']=sections
 lesson['text'][lang]['openChecks']=[dict(id='AASE-M05-C03-Q03',prompt='請為尚未經合格醫師核准的 AI 草稿，寫一條負向驗收的 Then。' if lang=='zh' else 'Write a negative-acceptance Then for an AI draft not approved by a qualified physician.',answer=['Then 系統應拒絕將草稿轉成正式報告，回應不得交付標記為正式的報告，並提示需由合格醫師確認。還需指定對應的測試、版本、執行命令與結果，才能判斷實作是否符合。' if lang=='zh' else 'Then reject conversion of the draft to an official report, return no report marked official and explain that a qualified physician must approve it. Identify the matching test, version, execution command and outcome before judging implementation compliance.'])]
lesson['checks']=[dict(id='AASE-M05-C03-Q02',answer=0,text={
'zh':dict(prompt='醫院案例的 Given／When／Then 最嚴重的缺陷是什麼？',options=['沒有確認正式報告是否經過合格醫師核准。','沒有指定按鈕應該使用什麼顏色。','沒有指定 AI 必須使用哪一個語言模型。','沒有指定報告必須使用 PDF 格式。'],rationales=['此案例明定合格醫師核准後才可成為正式報告；原情境沒有驗證這個條件或未核准時的禁止行為。','按鈕顏色不決定核准規則是否受到遵守。','指定模型無法取代合格醫師核准。','檔案格式無法證明正式發布已獲核准。']),
'en':dict(prompt='What is the most serious defect in the hospital scenario’s Given / When / Then?',options=['It does not confirm approval of the official report by a qualified physician.','It does not specify the button color.','It does not specify which language model the AI must use.','It does not require PDF output.'],rationales=['The example requires qualified-physician approval before a report becomes official. The scenario checks neither this condition nor forbidden behavior without approval.','Button color does not establish that approval rules are enforced.','Choosing a model cannot replace qualified-physician approval.','A file format does not establish authorization for official release.'])})]
output=ROOT/'content/aase/lessons/aase-m05-c03.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
if '--check'in sys.argv:assert output.read_text()==data,'lesson differs from source manuscripts'
else:output.write_text(data)
print('PASS: eight sections, three tables, three figures and two supplied checks in each language.')
