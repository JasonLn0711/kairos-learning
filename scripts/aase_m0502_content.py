"""Compile the supplied M05-02 manuscripts without dropping prose or examples."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m05-02/replacement-2026-11-11'
lesson=json.loads((P/'prior-lesson.json').read_text())
lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
figures={}
allsections={}
questiontexts={}
for lang in ['zh','en']:
 raw=(P/f'teaching.{lang}.md').read_text()
 # Fenced worksheet headings are not article headings.
 chunks=re.split(r'^## ',raw,flags=re.M);assert len(chunks)==10
 sections=[];figs=[]
 def figure(chunk,start,end,titles,bodies,caption,description,kind='cards'):
  a=chunk.index(start);b=chunk.index(end,a)
  f=dict(kind=kind,caption=caption,description=description,items=[dict(title=t,body=v)for t,v in zip(titles,bodies)])
  figs.append(f);return chunk[:a]+f'@figure{len(figs)}\n\n'+chunk[b:]
 if lang=='zh':
  chunks[1]=figure(chunks[1],'User Story｜','這個流程的關鍵',
   ['User Story｜我為什麼需要它？','FR｜要做什麼？','NFR｜做得如何？','Constraints｜有哪些限制？','Acceptance Criteria｜如何確認有做到？'],
   ['上班族希望午休能快速吃到合適的餐點，以便準時回去工作','提供點餐、客製化、付款與訂單查詢','流程易懂、回應穩定、操作方便','遵守已確認的食材限制、預算及設備條件','指定情境下能正確點餐、處理過敏限制、完成付款與查詢；品質指標也經過測試'],
   '圖 1｜把午餐想法轉成可驗證的要求','箭頭表示需求逐步具體化；FR 與 NFR 並列，分別說明行為與品質，並非先後步驟。此為教學示意，品質條件仍須具體化。')
  chunks[4]=figure(chunks[4],'### 銀行 A','兩家銀行都能提供',
   ['銀行 A','銀行 B'],['功能存在，但品質欠佳\n轉帳常需要等待很久，偶爾當機，錯誤訊息不清楚。','功能與品質都經過設計\n回應時間可預期，失敗時狀態清楚，能避免重複扣款。'],
   '圖 2｜相同轉帳功能，不同品質','兩家銀行是合成比較案例；卡片並列比較品質，不表示時間或因果。避免重複扣款也需要具體功能與規則來實現。')
  chunks[4]=figure(chunks[4],'模糊需求\n','這裡的 95%',
   ['模糊需求','可驗證需求的寫法（示範數值，尚非正式門檻）'],['「商品搜尋要很快。」','「在指定測試設備、固定資料集與 50 位模擬同時使用者的條件下，從伺服器收到搜尋請求到回傳完整結果，95% 的請求應在 2 秒內完成。」'],
   '圖 3｜把「很快」寫成可以量測的條件','上下兩段比較需求的具體程度；50 人、95% 與 2 秒均為示範，必須經情境、負載、成本與利害關係人確認。')
  chunks[6]=figure(chunks[6],'S-01\n','這裡對應的 W3C',
   ['S-01｜User Story','FR-01｜檢查缺漏','FR-02｜防止錯誤匯出','NFR-01｜鍵盤可操作性','C-01｜資料與使用範圍'],
   ['身為收件人員，我希望在匯出前知道哪些必要欄位沒有填寫，以便補齊後再交接。','必要欄位不存在、為空字串或只有空白字元時，系統應將它列為缺漏。','未通過完整性檢查時，不得產生標示為「完整」的匯出報告。','使用者應能只用鍵盤完成填寫、檢查、修正與匯出；操作焦點必須可辨識，且不應陷入無法離開的操作區域。','本次原型只處理合成資料，採單人本機操作，不連接真實收件系統，也不宣稱具有正式業務受理能力。'],
   '圖 4｜一個故事與四條規格','代號供追溯與驗收引用；五列是不同規格角色，不表示五個執行步驟，也不代表已實作或通過測試。')
  chunks[7]=figure(chunks[7],'1. 先寫 User Story','每一個需求最好',
   ['先寫 User Story','補 FR、NFR、Constraints','補 Acceptance Criteria','交給 AI Coding Agent 實作','執行測試並保留證據'],
   ['確認使用者與目的。','定義功能、品質及界線。','寫出正常、錯誤及邊界情境。','要求依照規格開發，不自行假定重要業務規則。','檢查結果是否符合需求，未測試的項目不得宣稱通過。'],
   '圖 5｜依規格進行 AI 協作','編號表示協作順序；需求變更時回到相關規格與測試重新確認。AI 的完成回覆仍需實際測試證據。','flow')
 else:
  chunks[1]=figure(chunks[1],'User Story |','The purpose is',
   ['User Story | Why do I need it?','FR | What should it do?','NFR | How well should it work?','Constraints | What restrictions apply?','Acceptance Criteria | How can we confirm it works?'],
   ['Office workers want a suitable meal during their lunch break so that they can return to work on time.','Provide ordering, customization, payment and order lookup.','The process should be understandable, responses dependable and operation convenient.','Respect confirmed ingredient restrictions, budget and equipment conditions.','In specified scenarios, customers can order correctly, handle allergy restrictions, pay and look up orders; quality measures are also tested.'],
   'Figure 1 | Turn a lunch idea into verifiable requirements','Arrows mean increasing specificity. FR and NFR are parallel behavior and quality concerns, not sequential steps. This teaching illustration still requires more specific quality conditions.')
  chunks[4]=figure(chunks[4],'### Bank A','Both banks offer',
   ['Bank A','Bank B'],['The function exists, but quality is poor.\nTransfers often take a long time, the service occasionally crashes, and error messages are unclear.','Both functionality and quality have been designed.\nResponse times are predictable, failure states are clear, and duplicate debits can be prevented.'],
   'Figure 2 | The same transfer function with different quality','These banks are a synthetic comparison. Parallel cards compare quality, without implying time or causality. Preventing duplicate debits also requires specific functions and rules.')
  chunks[4]=figure(chunks[4],'Vague requirement\n','The 95% condition',
   ['Vague requirement','Verifiable wording: illustrative values, not an approved threshold'],['“Product search must be fast.”','“On specified test equipment, with a fixed dataset and 50 simulated concurrent users, 95% of requests should finish within 2 seconds, measured from the server receiving a search request to returning the complete result.”'],
   'Figure 3 | Make “fast” measurable','The two rows compare specificity. The 50 users, 95% and 2 seconds are illustrative; confirm them against the scenario, load, costs and stakeholder needs.')
  chunks[6]=figure(chunks[6],'S-01\n','The corresponding WCAG',
   ['S-01 | User Story','FR-01 | Check omissions','FR-02 | Prevent incorrect export','NFR-01 | Keyboard operation','C-01 | Data and usage scope'],
   ['As an intake worker, I want to know which required fields are missing before export, so that I can complete them before handoff.','If a required field is absent, an empty string or whitespace only, the system shall list it as missing.','If completeness checking has not passed, the system shall not produce an export report labelled “complete.”','Users shall be able to fill in, check, correct and export using only the keyboard. Focus must be identifiable and must not become trapped in an area they cannot leave.','This prototype processes only synthetic data, runs locally for one person, does not connect to a real intake system and does not claim official business intake capability.'],
   'Figure 4 | One story and four specification clauses','Identifiers support traceability and acceptance references. These rows are specification roles, not execution steps or evidence of implementation or passed tests.')
  chunks[7]=figure(chunks[7],'1. Write a User Story','Give requirements stable',
   ['Write a User Story','Add FR, NFR and constraints','Add Acceptance Criteria','Ask an AI Coding Agent to implement','Execute tests and retain evidence'],
   ['Establish the user and purpose.','Define behavior, quality and boundaries.','Cover normal, error and boundary scenarios.','Follow the specification and do not invent consequential business rules.','Compare results against requirements and leave untested items unverified.'],
   'Figure 5 | Collaborate with AI using a specification','Numbers indicate collaboration order. Changed requirements require revisiting the relevant specification and tests. An AI completion message still requires executed test evidence.','flow')
 # Split two nested subsections to preserve prior public anchor IDs.
 chunks[4]=chunks[4].replace('### 為什麼「系統要很快」不是好的需求？','@@split examples\n為什麼「系統要很快」不是好的需求？').replace('### Why is “the system must be fast” a poor requirement?','@@split examples\nWhy is “the system must be fast” a poor requirement?')
 chunks[6]=chunks[6].replace('### 下一步：把需求連到驗收測試','@@split acceptance\n下一步：把需求連到驗收測試').replace('### Next: connect requirements to acceptance tests','@@split acceptance\nNext: connect requirements to acceptance tests')
 ids=['introduction','analogy','story','functional','quality','types','specification','workflow','review','understanding']
 for n,chunk in enumerate(chunks):
  for partnum,part in enumerate(chunk.split('@@split ')):
   lines=part.strip().splitlines();sid=ids[n] if partnum==0 else lines.pop(0);heading=lines.pop(0).lstrip('# ')
   if n==0:heading='把使用者想法變成可驗證的規格' if lang=='zh' else 'Turn a user idea into a verifiable specification'
   if n==9:
    text='\n'.join(lines);questiontexts[lang]=text
    # Prompt/options appear once in the shared native disclosure section.
    first=text.split('\n\n')[0];last=text.strip().split('\n\n')[-1];lines=[first,'',last]
   paras=[];blocks=[];i=0
   def prose(value):
    if not blocks:paras.append(value)
    elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
    else:blocks.append(dict(kind='prose',paragraphs=[value]))
   while i<len(lines):
    line=lines[i].strip()
    if not line:i+=1;continue
    if line.startswith('@figure'):
     blocks.append(figs[int(line[-1])-1]);i+=1;continue
    if line.startswith('|'):
     rows=[]
     while i<len(lines) and lines[i].strip().startswith('|'):
      rows.append([v.strip()for v in lines[i].strip().strip('|').split('|')]);i+=1
     blocks.append(dict(kind='table',caption=('表'if lang=='zh'else'Table')+f' {n}',headers=rows[0],rows=rows[2:]));continue
    if line.startswith('```'):
     values=[];i+=1
     while i<len(lines) and not lines[i].startswith('```'):values.append(lines[i]);i+=1
     assert i<len(lines);i+=1
     blocks.append(dict(kind='step',heading=('規格模板'if sid=='review'else('正常情境'if not any(b['kind']=='step'for b in blocks)else'異常情境'))if lang=='zh'else('Specification template'if sid=='review'else('Normal scenario'if not any(b['kind']=='step'for b in blocks)else'Error scenario')),paragraphs=['以下文字供規格練習與驗收討論；實際結果另行記錄。'if lang=='zh'else'This text supports specification practice and acceptance discussion; record actual results separately.'],code='\n'.join(values)));continue
    value=[]
    while i<len(lines) and lines[i].strip():value.append(lines[i]);i+=1
    prose('\n'.join(value))
   sources={'story':['agile-user-stories'],'examples':['nasa-requirements'],'workflow':['nasa-requirements'],'specification':['wai-keyboard']}
   sections.append(dict(id=sid,heading=heading,paragraphs=paras,**({'blocks':blocks}if blocks else{}),**({'sourceIds':sources[sid]}if sid in sources else{})))
 allsections[lang]=sections;figures[lang]=figs
# Preserve exact supplied code in both locales; English explanation follows separately.
for zh,en in zip(allsections['zh'],allsections['en']):
 assert zh['id']==en['id']
 for a,b in zip(zh.get('blocks',[]),en.get('blocks',[])):
  assert a['kind']==b['kind'],(zh['id'],a['kind'],b['kind'])
  if 'code'in a:
   # Code fields are immutable across locales under the shared publication contract.
   if a['code']!=b['code']:
    b['paragraphs'].append(b['code']);a['paragraphs'].append('雙語頁面保留相同原始規格文字；英文頁另附逐項翻譯。')
   b['code']=a['code']
for lang in ['zh','en']:lesson['text'][lang]['sections']=allsections[lang]
answers=[1,2,2]
rationales={
'zh':[
 ['前端框架是實作選擇，無法補足使用者目的與驗收規則。','B：先確認目的、行為、品質、約束與驗收，才有共同的完成條件。','畫面只能展示部分介面，不能替代授權、資料與品質規則。','語言轉換不會自動補齊模糊需求。'],
 ['分類不會免除驗證責任；拒絕未授權存取需要實測。','登入回答身分，授權仍要判斷該身分可以讀哪些資料。','C：明確定義角色、部門、紀錄範圍與拒絕行為，再驗證允許與拒絕情境。','加密保護資料的特定層面，無法單獨決定誰有權讀取。'],
 ['程式產生完成仍需驗收，不能直接推定可以上線。','外觀檢查無法證明異常、邊界與品質規則成立。','C：逐項執行對應驗收並保存實際證據；未測項目保留待驗。','換模型重新生成仍需相同驗收，無法取代測試。']],
'en':[
 ['A frontend framework is an implementation choice and does not establish purpose or acceptance rules.','B: Establish purpose, behavior, quality, constraints and acceptance to share a definition of completion.','Screens demonstrate only part of an interface, without establishing authorization, data or quality rules.','Translation does not automatically resolve vague requirements.'],
 ['Classification does not remove verification duties; unauthorized-access rejection needs testing.','Login establishes identity; authorization still determines which records that identity may read.','C: Specify roles, departments, record scope and rejection behavior, then test both allowed and denied cases.','Encryption protects particular aspects of data but does not alone determine who may read it.'],
 ['Generated code still requires acceptance; it does not establish launch readiness.','Visual inspection cannot establish error, boundary or quality behavior.','C: Execute corresponding acceptance checks and preserve actual evidence; leave untested items unverified.','Regeneration with another model still requires the same acceptance tests.']]}
lesson['checks']=[]
for i,answer in enumerate(answers):
 q=dict(id=f'AASE-M05-C02-Q{i+1:02}',revision=2,answer=answer,text={})
 for lang in ['zh','en']:
  raw=questiontexts[lang];match=re.search(rf'^{i+1}\\?\. (.+?)(?=\n\n[123]\\?\. |\n\n(?:本章|A User Story)|\Z)',raw,re.M|re.S);assert match,(lang,i)
  parts=match[1].strip().split('\n\n');assert len(parts)==5,(lang,i,parts)
  q['text'][lang]=dict(prompt=parts[0],options=[re.sub(r'^[A-D]\. ','',v)for v in parts[1:]],rationales=rationales[lang][i])
 lesson['checks'].append(q)
# Fail with useful locations if paired structures drift.
def shape(v):
 if isinstance(v,dict):return {k:shape(val)for k,val in v.items()}
 if isinstance(v,list):return [shape(x)for x in v]
 return type(v).__name__
assert shape(lesson['text']['zh'])==shape(lesson['text']['en']),'paired structure differs'
output=ROOT/'content/aase/lessons/aase-m05-c02.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
if '--check'in sys.argv:assert output.read_text()==data,'outdated lesson'
else:output.write_text(data)
print('PASS: complete paired manuscripts compiled; five figures and three checks.')
