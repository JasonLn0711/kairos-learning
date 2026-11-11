import json,re,sys
print("Checking AASE M03-04 manuscripts." if "--check" in sys.argv else "Generating AASE M03-04 lesson.",file=sys.stderr)
from pathlib import Path
root=Path(__file__).resolve().parents[1];p=root/'docs/sources/aase/m03-04/replacement-2026-11-11'
old=json.loads((p/'prior-lesson.json').read_text());l=json.loads(json.dumps(old));l.update(revision=5,contentVersion='1.2.0',date='2026-11-11')
l['sourceIds']=['govuk-discovery','govuk-alpha','lean-startup-methodology','gherkin']
f=json.loads((p/'figures.json').read_text())
ids=['minimum','analogy','workflow','risk','scope','constraints','change','done','document','decision','understanding']
for lang in ['zh','en']:
 s=(p/f'teaching.{lang}.md').read_text()
 if lang=='en':s=s.replace('@sharedcode','```'+(p/'teaching.zh.md').read_text().split('```')[1]+'```')
 chunks=[];current=[];fenced=False
 for line in s.splitlines():
  if line.startswith('```'):fenced=not fenced
  if line.startswith('## ') and not fenced:chunks.append('\n'.join(current));current=[line[3:]]
  else:current.append(line)
 chunks.append('\n'.join(current));sections=[]
 for n,chunk in enumerate(chunks):
  lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ');heading=('這一版究竟要做多少？' if lang=='zh' else 'How much belongs in this version?') if n==0 else heading;paras=[];blocks=[];i=0
  while i<len(lines):
   line=lines[i].strip()
   if not line:i+=1;continue
   if line.startswith('@figure'):
    blocks.append(f[lang][int(line[-1])-1]);i+=1;continue
   if line.startswith('|'):
    rows=[]
    while i<len(lines) and lines[i].strip().startswith('|'):
     rows.append([x.strip() for x in lines[i].strip().strip('|').split('|')]);i+=1
    blocks.append(dict(kind='table',caption=('表' if lang=='zh' else 'Table')+' '+str(sum(b['kind']=='table' for ss in sections for b in ss.get('blocks',[]))+sum(b['kind']=='table' for b in blocks)+1),headers=rows[0],rows=rows[2:]));continue
   if line.startswith('```'):
    code=[];i+=1
    while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
    i+=1;blocks.append(dict(kind='step',id='problem-template',heading='problem.md',paragraphs=['合成範例；列出預定驗收條件，不代表已執行驗證。' if lang=='zh' else 'The shared document asks whether an inspector can record one anomaly and know whether submission succeeded. Its high-risk assumption concerns understandable categories and complete report preservation. The first version selects one test device, records anomaly type and description, checks and corrects omissions, confirms a simulated submission and displays its result. Constraints block incomplete submissions and false success, refresh checks after edits, and restrict the example to simulated equipment and synthetic data. Multi-site use awaits roles, permissions and isolation; AI classification awaits validation data, error-risk definitions and human review. Official maintenance dispatch, real equipment control and automatic shutdown are excluded. Completion requires normal success, blocked omissions, clear failures, rechecking edits and a user completing the task. Changes record their reason, impact, tradeoff, decision owner and new criteria. These are planned conditions, not observed results.'],code='\n'.join(code)));continue
   paragraph=[]
   while i<len(lines) and lines[i].strip():paragraph.append(lines[i]);i+=1
   value='\n'.join(paragraph)
   if not blocks:paras.append(value)
   elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
   else:blocks.append(dict(kind='prose',paragraphs=[value]))
  if not paras and blocks and blocks[0]['kind'] in ['cards','flow']:paras=[blocks[0]['caption']]
  sections.append(dict(id=ids[n],heading=heading,paragraphs=paras,**({'blocks':blocks} if blocks else {})))
 for section in sections:
  if section['id'] in ['analogy','risk','done']:section['sourceIds']={'analogy':['lean-startup-methodology'],'risk':['govuk-alpha'],'done':['gherkin']}[section['id']]
 l['text'][lang]['sections']=sections
 l['text'][lang].pop('openChecks',None)
answers={
'zh':[
('哪個高風險假設應最先驗證？','先確認在固定需求、車輛與限制下，AI 建議能否比人工基準改善路線結果。若無優勢，GPS、App 與跨區協作無法補足核心價值；需先定義比較指標，不能只憑漂亮地圖判斷。'),
('最小完整流程保留、延後與排除哪些項目？','保留匯入合成訂單、檢查缺漏與異常、產生一區路線建議、與人工基準比較及顯示可核對結果。GPS、司機 App 與跨區協作延後，待核心價值及整合規則確認再評估；本版不做正式派車與真實車輛控制。'),
('兩項約束與三個驗收情境是什麼？','約束：測試結果不可進入正式派車；缺漏或無解不可顯示成功。驗收：有效訂單可產生符合固定限制的建議並與基準比較；缺漏或無可行解顯示明確原因；修改訂單使舊結果失效，重新計算前不可輸出當次有效建議。使用者能否理解結果另以操作觀察驗證。'),
('第二週新增司機 App 時如何處理？','先判斷 App 是否為驗證路線價值所必需。若非必要，記錄延後理由與重啟條件；若必要，列出工作量、交換範圍或資源／時程調整，由範圍負責角色確認，更新規格及驗收，保留原有檢查與正式營運隔離。')],
'en':[
('Which high-risk assumption should be tested first?','Test whether AI route suggestions improve results against a manual baseline with fixed demand, vehicles and constraints. GPS, an app and cross-region collaboration cannot supply the missing core value if this fails. Define comparison metrics before evaluating the routes.'),
('What should the minimum complete flow retain, defer and exclude?','Retain synthetic order input, missing/exception checks, route suggestions for one area, comparison with a manual baseline and inspectable results. Defer GPS, the driver app and cross-region collaboration until core value and integration rules are established. Exclude operational dispatch and real vehicle control.'),
('Give two constraints and three acceptance scenarios.','Constraints: test outputs never enter operational dispatch; missing input or infeasible routes never display success. Scenarios: valid input produces suggestions meeting fixed constraints and comparable with the baseline; missing or infeasible input reports a clear reason; editing orders invalidates old results until recomputation. Observe users separately to assess whether they understand the output.'),
('How should the week-two app request be handled?','Assess whether the app is necessary to test route value. If unnecessary, record deferral reasons and activation conditions. If necessary, estimate work and explicit scope exchanges or resource/schedule changes; obtain the scope owner’s decision, update specifications and acceptance, and retain validation and operational isolation.')]
}
l['checks']=[]
for lang in ['zh','en']:
 l['text'][lang]['openChecks']=[dict(id=f'AASE-M03-C04-Q{i+5:02}',prompt=q,answer=[a]) for i,(q,a) in enumerate(answers[lang])]
out=root/'content/aase/lessons/aase-m03-c04.json';data=json.dumps(l,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert out.read_text()==data,'lesson differs from manuscripts'
else:out.write_text(data)
print('Generated 2 language drafts, 11 sections each; run validate:content for structural acceptance.')
