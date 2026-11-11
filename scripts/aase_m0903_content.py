"""Build the complete M09-03 replacement from preserved bilingual manuscripts."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/aase/m09-03/replacement-2026-11-11'
IDS=['introduction','demo','analogy','walkthrough','trace','failure','decision','assessment','takeaway','understanding']
def figures(lang):
 if lang=='zh':
  chain=[('問題與需求','原本要解決什麼問題？'),('設計與規格','承諾系統應該如何運作？'),('程式與版本','實際做了什麼？是哪個版本？'),('測試與驗收證據','實際觀察到什麼？是否符合要求？'),('交付與限制','可以交給誰使用？還有哪些風險？')]
  cases=[('情境 A：故意讓資料不完整（負向測試）','申請人缺少醫療收據。系統應該提醒「缺少必要文件」，而且不能讓工作人員下載標示為完整的報告。\n驗收證據：缺漏提示、禁止匯出的測試結果，以及實際畫面。'),('情境 B：補齊所有資料（正常測試）','工作人員上傳收據後重新檢核。系統顯示完成，允許匯出 JSON 報告，而且報告內容必須正確。\n驗收證據：實際匯出檔案、欄位比對與通過的測試紀錄。'),('情境 C：修改已經檢核完成的資料（過期結果測試）','假設工作人員把原本已填寫的醫療費用刪掉。系統就不能繼續讓使用者下載修改前產生的完整報告，必須要求重新檢核。\n驗收證據：修改後的檢核狀態、舊下載失效，以及重新檢核的操作紀錄。')]
  captions=['圖 1｜從需求一路追到交付與證據','圖 2｜同一理賠案件的三種驗收情境']
  desc=['向下箭頭表示追溯閱讀順序；第四階段強調實際觀察。每一關都需連到同一案例的作品，箭頭本身不代表已驗收通過。','三列各自呈現輸入條件、預期行為及應保存的證據；A→B→C 可按同一案件重演，但列間沒有因果箭頭。這是教學情境，尚無當次測試結果。']
 else:
  chain=[('Problem and requirements','What problem was originally to be solved?'),('Design and specification','How did you promise the system would behave?'),('Code and version','What was implemented, and in which version?'),('Tests and acceptance evidence','What was actually observed, and did it meet requirements?'),('Delivery and limits','Who can use it, and what risks remain?')]
  cases=[('Scenario A: incomplete data (negative test)','The applicant has no medical receipt. The system must identify the missing required document and prevent staff from downloading a report labeled complete.\nAcceptance evidence: omission feedback, export-rejection test results, and the actual interface.'),('Scenario B: complete all data (normal test)','Staff upload the receipt and validate again. The system marks completion and allows JSON export; the report contents must be correct.\nAcceptance evidence: the actual export, field comparisons, and passing execution records.'),('Scenario C: edit validated data (stale-result test)','Staff delete a previously entered medical-expense value. The system must prevent downloading the earlier complete report and require validation again.\nAcceptance evidence: validation state after editing, invalidation of the old download, and the repeated-validation operation record.')]
  captions=['Figure 1 | Trace requirements to evidence and delivery','Figure 2 | Three acceptance scenarios for one claim']
  desc=['Downward arrows indicate the traceability reading order. Stage four emphasizes actual observations. Each stage links artifacts for the same case; arrows do not establish acceptance.','Each row identifies input conditions, expected behavior, and evidence to retain. A → B → C can be replayed on one claim, but no causal arrows connect rows. These are teaching scenarios, with no claim of current execution results.']
 return [dict(kind=k,caption=c,description=d,items=[dict(title=a,body=b)for a,b in items])for k,c,d,items in zip(['flow','cards'],captions,desc,[chain,cases])]
def parse(raw,lang):
 chunks=re.split(r'^## ',raw,flags=re.M);assert len(chunks)==10
 sections=[]
 for index,chunk in enumerate(chunks):
  lines=chunk.splitlines();heading=lines.pop(0) if index else ('課次與主題'if lang=='zh'else 'Lesson and topic')
  if index==0:lines=lines[1:]
  section=dict(id=IDS[index],heading=heading,paragraphs=[],blocks=[])
  pending=[]
  def flush():
   if not pending:return
   # Equal structural grouping retains the complete manuscript, with prose after blocks.
   paragraphs=[p for p in re.split(r'\n\s*\n','\n'.join(pending).strip())if p]
   if section['blocks']:section['blocks'].append(dict(kind='prose',paragraphs=paragraphs))
   else:section['paragraphs']=paragraphs
   pending.clear()
  i=0
  while i<len(lines):
   line=lines[i].strip()
   if not line:pending.append('');i+=1;continue
   if line.startswith('@figure'):
    flush();section['blocks'].append(figures(lang)[int(line[-1])-1]);i+=1;continue
   if line.startswith('```'):
    flush();code=[];i+=1
    while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
    assert i<len(lines)
    section['blocks'].append(dict(kind='step',heading=('情境格式示例'if index==4 else '成果驗收紀錄')if lang=='zh'else ('Scenario-format example'if index==4 else 'Acceptance record'),paragraphs=[],code='\n'.join(code)));i+=1;continue
   if line.startswith('|'):
    flush();rows=[]
    while i<len(lines)and lines[i].strip().startswith('|'):
     rows.append([v.strip()for v in lines[i].strip().strip('|').split('|')]);i+=1
    section['blocks'].append(dict(kind='table',caption=('對照表｜'if lang=='zh'else 'Comparison | ')+heading,headers=rows[0],rows=rows[2:]));continue
   if line.startswith('### '):
    flush();section['blocks'].append(dict(kind='prose',paragraphs=[line]));i+=1;continue
   pending.append(line);i+=1
  flush()
  if not section['paragraphs']:section['paragraphs']=['先沿圖中的五個問題，檢查同一案例的需求與實際證據能否連起來。'if lang=='zh'else 'Follow the five questions in the figure to check whether the requirements and actual evidence connect for the same case.']
  sections.append(section)
 return sections

def main():
 lesson=json.loads((SOURCE/'prior-lesson.json').read_text());lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
 for lang in ['zh','en']:
  lesson['text'][lang]['sections']=parse((SOURCE/f'teaching.{lang}.md').read_text(),lang)
 # Keep literal example code identical across the language pair, as required by the host model.
 for zh,en in zip(lesson['text']['zh']['sections'],lesson['text']['en']['sections']):
  assert [b['kind']for b in zh['blocks']]==[b['kind']for b in en['blocks']],zh['id']
  for zb,eb in zip(zh['blocks'],en['blocks']):
   if zb['kind']=='step':zb['code']=zb['code']+'\n\n--- English equivalent ---\n'+eb['code'];eb['code']=zb['code'];eb['paragraphs']=['The original Traditional Chinese example is retained below. The surrounding explanation and the English template in the source manuscript explain the same fields and conditions.'];zb['paragraphs']=['以下為示範格式，請依實際證據填寫或另行實作測試；文字本身不代表已執行。']
 lesson['text']['zh']['summary']='沿同一案例連接需求、規格、版本、測試與交付，分清成果展示、驗收證據及正式上線的適用範圍。'
 lesson['text']['en']['summary']='Connect requirements, specifications, versions, tests, and delivery through one case, distinguishing demonstration, acceptance evidence, and production scope.'
 lesson['text']['zh']['openChecks']=[dict(id='AASE-M09-C03-Q04',prompt='AI 招募系統：展示成功、資料變更與企業交付，分別需要什麼證據？',answer=['成功排名 10 份履歷只支持指定版本、輸入與環境下的這次輸出觀察；排名正確性、公平性、個資保護、權限與多人可靠性仍需另驗。','修改履歷後應使依舊資料產生的排名失效。保存原輸出與版本，修改一份履歷，確認舊排名不再當作有效結果，再重新分析並比對新輸出。','至少需要功能與業務規則驗證、真實資料與身分授權保護、正式部署與多人操作及維運證據。依組織要求另審公平性與適用規範，並由負責人記錄接受範圍。'])]
 lesson['text']['en']['openChecks']=[dict(id='AASE-M09-C03-Q04',prompt='AI recruiting: what evidence is needed for demonstration success, changed data, and enterprise delivery?',answer=['Ranking 10 resumes establishes only this output observation for the specified version, inputs, and environment. Ranking correctness, fairness, privacy, authorization, and multiuser reliability require separate verification.','Editing a resume should invalidate rankings based on the old data. Retain the original output and version, edit one resume, confirm the old ranking is no longer treated as valid, then rerun analysis and compare the new output.','At minimum, obtain evidence for functions and business rules, real-data and identity/authorization protection, and production deployment with multiuser operation and maintenance. Review fairness and applicable obligations for the organization, and have the responsible person record accepted scope.'])]
 # Preserve old assessment anchors and checks as supplementary course resources.
 for lang in ['zh','en']:
  old=json.loads((SOURCE/'prior-lesson.json').read_text())['text'][lang]
  lesson['text'][lang]['objectives'][2]=('界定本機原型與組織正式使用的驗收範圍。'if lang=='zh'else 'Define acceptance scope for a local prototype and organizational production use.')
  lesson['text'][lang]['sections'].insert(5,dict(id='legacy-trace',heading='工作坊追溯補充'if lang=='zh'else 'Workshop traceability supplement',paragraphs=old['sections'][2]['paragraphs'],blocks=old['sections'][2]['blocks']))
 out=ROOT/'content/aase/lessons/aase-m09-c03.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
 if '--check'in sys.argv:assert out.read_text()==data
 else:out.write_text(data)
 print('PASS: M09-03 complete bilingual manuscript synchronized')
if __name__=='__main__':main()
