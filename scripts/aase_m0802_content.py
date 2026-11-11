"""Build the paired TDD lesson from reviewed source-faithful Markdown."""
import json,re,sys
from pathlib import Path
R=Path(__file__).resolve().parents[1];D=R/'docs/sources/aase/m08-02/replacement-2026-11-11'
def parse(lang):
 raw=(D/f'adopted.{lang}.md').read_text();sections=[];code_index=0;table_index=0
 for part in re.split(r'(?m)^## ',raw)[1:]:
  title,body=part.split('\n',1);sid,heading=title.split('｜',1)
  chunks=re.findall(r'```\n[\s\S]*?\n```|\|[^\n]+(?:\n\|[^\n]+)*|[^\n]+(?:\n(?!\n|```|\|)[^\n]+)*',body.strip())
  s={'id':sid,'heading':heading,'paragraphs':[],'blocks':[]}
  for c in chunks:
   if c.startswith('```'):
    labels=[['export_gate.py｜練習起點','export_gate.py | Starting point'],['test_export_gate.py｜固定驗收行為','test_export_gate.py | Acceptance behavior'],['執行測試','Run the tests'],['export_gate.py｜最小修正','export_gate.py | Minimal repair'],['export_gate.py｜整理後版本','export_gate.py | Refactored version']]
    s['blocks'].append({'kind':'step','heading':labels[code_index][lang=='en'],'paragraphs':['兩個檔案置於同一個獨立 tdd-lab/ 目錄。' if lang=='zh' else 'Keep both files in the same separate tdd-lab/ directory.'],'code':c[4:-4]});code_index+=1
   elif c.startswith('|'):
    rows=[[v.strip()for v in line.strip('|').split('|')]for line in c.splitlines()]
    captions=[['表1｜判讀測試失敗','Table 1 | Interpret test failures'],['表2｜產業規則與測試','Table 2 | Industry rules and tests'],['表3｜開發流程比較','Table 3 | Development process comparison'],['表4｜品質驗證範圍','Table 4 | Quality verification scope']]
    s['blocks'].append({'kind':'table','caption':captions[table_index][lang=='en'],'headers':rows[0],'rows':rows[2:]});table_index+=1
   elif not s['paragraphs']:s['paragraphs']=[c]
   else:s['blocks'].append({'kind':'prose','paragraphs':[c]})
  sections.append(s)
 assert code_index==5 and table_index==4
 return sections

def build():
 l=json.loads((D/'previous-lesson.json').read_text());l.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
 for lang in ['zh','en']:
  t=l['text'][lang];t['sections']=parse(lang)
  t['summary']='先定義可驗證的正確行為，實作 Red、Green、Refactor，並核對 AI 協作與品質證據的界線。' if lang=='zh' else 'Define verifiable behavior, practice Red, Green and Refactor, and review AI collaboration and quality-evidence boundaries.'
  figures=[('analogy','flow','TDD 的小步循環','The small TDD cycle','箭頭表示下一個開發步驟；完成重構後選下一個小要求，再回到 Red。每輪保留可驗證結果。','Arrows show the next development step. After refactoring, select the next small requirement and return to Red. Retain verifiable results each time.',[
   ('1. Red','先寫測試，確認要求尚未滿足','1. Red','Write a test and confirm the requirement is unmet'),('2. Green','最小修正，讓相同測試通過','2. Green','Make a minimal repair so the same tests pass'),('3. Refactor','整理內部結構，重新跑測試','3. Refactor','Organize internal structure and rerun tests')]),
   ('evidence','cards','三階段測試結果（供稿回報）','Three-stage test results (source report)','三欄比較不同階段的結果，不表示同一測試集合：重構階段另加缺鍵、移除首尾空白與不修改輸入三項測試。供稿環境 pytest 9.0.2；原教材 8.4.2。','These columns compare stages, not identical test sets: Refactor adds missing-key, trimming and input-preservation tests. Source environment: pytest 9.0.2; original lesson: 8.4.2.',[
   ('Red','4 失敗／1 通過','Red','4 failed / 1 passed'),('Green','5 全部通過','Green','5 passed'),('Refactor','8 全部通過','Refactor','8 passed')]),
   ('agent-workflow','flow','人與 Agent 的 TDD 協作','TDD collaboration between person and Agent','向下箭頭表示協作順序；驗收條件由人員或獨立機制確認。這是工作流程示意，不是已執行紀錄。','Downward arrows show collaboration order. People or an independent mechanism confirm acceptance criteria. This is a workflow illustration, not an execution record.',[
   ('人定義要求與驗收條件','先選出一項最小、可驗證的行為','Person defines requirements and acceptance','Select one smallest verifiable behavior'),('Agent 撰寫測試，執行並展示預期失敗','核對失敗是否來自需求行為','Agent writes and runs tests, showing expected failure','Check that the failure concerns required behavior'),('Agent 修改實作，再執行相同測試','保留原本的驗收要求','Agent repairs implementation and reruns the same tests','Preserve the original acceptance requirement'),('確認測試結果，重構並再次驗證','回報已驗證與未驗證的要求','Confirm results, refactor and verify again','Report verified and unverified requirements')])]
  for n,(sid,kind,zh,en,dzh,den,items)in enumerate(figures,1):
   f={'kind':kind,'caption':f'圖 {n}｜{zh}' if lang=='zh' else f'Figure {n} | {en}','description':dzh if lang=='zh' else den,'items':[{'title':i[0 if lang=='zh' else 2],'body':i[1 if lang=='zh' else 3]}for i in items]}
   s=next(s for s in t['sections']if s['id']==sid)
   s['blocks'].append(f)
  ev=next(s for s in t['sections']if s['id']=='evidence')
  ev['blocks'].append({'kind':'step','heading':'補充三項回歸測試' if lang=='zh' else 'Three additional regression tests','paragraphs':['加到同一份 test_export_gate.py，使用 Green 與 Refactor 版本各跑一次，以區分測試擴充與重構結果。' if lang=='zh' else 'Append to test_export_gate.py and run against both Green and Refactor to distinguish test expansion from refactoring.'],'code':'''def test_missing_key_is_rejected():
    with pytest.raises(ValueError, match="缺少文件類型"):
        build_report({})


def test_surrounding_whitespace_is_trimmed():
    result = build_report({"document_type": "  合成申請表  "})
    assert result["data"]["document_type"] == "合成申請表"


def test_input_is_not_modified():
    record = {"document_type": "  合成申請表  "}
    before = dict(record)
    result = build_report(record)
    assert record == before
    assert result["data"] is not record'''})
  t['sections'].append({'id':'understanding','heading':'九、理解檢核與實作目標' if lang=='zh' else '9. Understanding checks and practice goal','paragraphs':['先嘗試回答下方三題，再展開參考解析自行核對。實作目標：能獨立選出一項需求，先寫出真正因需求缺失而失敗的測試，再完成最小修正與重構，保留三階段實際證據。' if lang=='zh' else 'Attempt the three questions below before opening their reference explanations. Practice goal: independently select a requirement, write a test that genuinely fails because required behavior is missing, make a minimal repair, refactor and retain actual evidence from all three stages.'],'blocks':[{'kind':'prose','paragraphs':['本練習只驗證文件類型，另兩欄、長度、輸出白名單及介面仍依原型規格另行驗收。請在獨立 tdd-lab/ 練習，保留工作坊 reference 的 rules.py。' if lang=='zh' else 'This exercise verifies document type only. The other two fields, length, output allowlisting and interface require separate acceptance against the prototype specification. Practice in a separate tdd-lab/ and preserve the workshop reference rules.py.']}]})
  t['exercise']['environment']='獨立 tdd-lab/、Python 與 pytest 8.4.2；供稿另回報 9.0.2，實跑時記錄所用版本。' if lang=='zh' else 'A separate tdd-lab/, Python and pytest 8.4.2; the source reports 9.0.2 separately. Record the version actually run.'
 qs=[(1,'你正在開發提款系統，寫好測試後，執行時顯示「找不到 pytest」。這算是符合 TDD 要求的 Red 嗎？',['算，因為測試失敗了','不算，因為還沒有真正測到提款規則','算，只要把錯誤紀錄下來即可'],['環境錯誤尚未測到需求。','先讓測試能執行，才能觀察提款規則的失敗。','保留錯誤有助修復環境，但不構成行為驗證。'],'You wrote a withdrawal test, but execution reports “pytest not found.” Does this count as the required Red?',['Yes, because the test failed','No, the withdrawal rule has not actually been tested','Yes, provided the error is recorded'],['An environment error has not tested the requirement.','Make the tests executable before observing a withdrawal-rule failure.','Recording the error helps repair the environment but does not verify behavior.']),
 (1,'Agent 為了讓測試從 Red 變成 Green，直接把原本會失敗的測試刪除。這算成功嗎？',['算，只要最後全部顯示通過','不算，因為失去了驗收要求的保護','算，因為減少測試能提高效能'],['綠燈可能只是刪掉了需求。','Green 要讓原本的驗收測試通過。','測試效能不能代替保留必要驗收。'],'An Agent deletes the failing test to move from Red to Green. Is this success?',['Yes, as long as everything remaining passes','No, the acceptance requirement loses its protection','Yes, fewer tests improve performance'],['A pass may simply reflect deletion of the requirement.','Green must pass the original acceptance tests.','Test performance does not replace necessary acceptance.']),
 (2,'程式已通過測試，現在只是把重複的驗證程式抽成函式，原本輸入輸出不變。這比較符合哪個階段？',['Red','Green','Refactor'],['Red 先觀察需求行為失敗。','Green 修正程式使測試通過。','整理結構且保持輸入輸出，並重跑測試，符合 Refactor。'],'Tests pass. Duplicate validation is extracted into a function while input/output stays the same. Which stage does this fit?',['Red','Green','Refactor'],['Red first observes a required-behavior failure.','Green repairs code to pass the tests.','Organizing structure while preserving input/output and rerunning tests fits Refactor.'])]
 l['checks']=[{'id':f'AASE-M08-C02-Q{i:02}','answer':q[0],'text':{'zh':{'prompt':q[1],'options':q[2],'rationales':q[3]},'en':{'prompt':q[4],'options':q[5],'rationales':q[6]}}}for i,q in enumerate(qs,1)]
 return l
if __name__=='__main__':
 data=json.dumps(build(),ensure_ascii=False,indent=2)+'\n';out=R/'content/aase/lessons/aase-m08-c02.json'
 if '--check'in sys.argv:assert out.read_text()==data,'lesson out of date'
 else:out.write_text(data)
 print('PASS: paired M08-02 lesson synchronized')
