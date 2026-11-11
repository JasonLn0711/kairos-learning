"""Build the complete bilingual OpenSpec lesson from preserved manuscripts."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m05-05/replacement-2026-11-11'
ids=['purpose','analogy','artifacts','change-workflow','choose','industries','commands','exercise-notes','understanding']
figures={
 'zh':[
 ['圖 1｜三個 Agent 指令與文件分工','箭頭表示建議的工作順序；先審查提案，實作後取得測試證據，再接受與封存。封存後可回到規劃下一次變更。斜線語法依版本與助理核對；四種文件是責任分工，design.md 依需要建立。',[
 ['/opsx:propose','proposal.md｜為什麼改、改什麼\ndesign.md｜技術做法\nspecs/｜候選規格差異\ntasks.md｜工作清單'],
 ['/opsx:apply','人類先審查文件；Agent 依 tasks.md 實作。\n實際執行功能與負向測試，保存結果。'],
 ['/opsx:archive','已接受的候選差異 → openspec/specs/ 現行規格\nADDED 新增／MODIFIED 修改／REMOVED 移除\n保留提案歷史；封存不證明測試或部署成功。']]],
 ['圖 2｜五步協作循環','依官方 Quickstart 的五步關係整理，Apply + Verify 明列本課的驗證責任。箭頭為建議順序，發現錯誤可回修文件；Archive 後回到 Explore 規劃下一次變更。這不是工具強制的品質閘門。',[
 ['Explore','釐清問題與選項。'],['Propose','提出修改方案與規格。'],['Review','人類審查與修正。'],['Apply + Verify','實作、檢查、測試並保存證據。'],['Archive','更新目前規格，保留歷史。']]]],
 'en':[
 ['Figure 1 | Three Agent Instructions and Their Artifacts','Arrows show the suggested sequence: review the proposal, implement and obtain test evidence, then accept and archive. Return to planning for the next change. Check slash syntax against the version and assistant. The four artifact types divide responsibilities; create design.md when needed.',[
 ['/opsx:propose','proposal.md | Why and what changes\ndesign.md | Technical approach\nspecs/ | Candidate specification deltas\ntasks.md | Work checklist'],
 ['/opsx:apply','People review the documents first; the agent implements tasks.md.\nRun functional and negative tests and retain results.'],
 ['/opsx:archive','Accepted candidate deltas → current openspec/specs/\nADDED / MODIFIED / REMOVED requirements\nKeep proposal history; archive does not certify tests or deployment.']]],
 ['Figure 2 | Five-Step Collaboration Loop','Based on the official Quickstart relationship; Apply + Verify explicitly includes this lesson’s verification responsibility. Arrows show a suggested sequence. Correct documents when assumptions fail; return from Archive to Explore for the next change. These are not tool-enforced quality gates.',[
 ['Explore','Clarify the problem and options.'],['Propose','Propose a change and its requirements.'],['Review','People review and correct the plan.'],['Apply + Verify','Implement, check, test and retain evidence.'],['Archive','Update current specifications and preserve history.']]]]
}
answers={
'zh':[
'這是既有規格的實作錯誤。現行規格已要求必要項目齊全才可標記完整；先修正完整性判斷及匯出端，測試缺漏情境，不另新增重複規則。',
'proposal.md 說明危急值通知的目的與範圍；變更內 specs/ 說明新增行為及可測試情境；design.md 在需要時交代通知方式與技術決策；tasks.md 拆出實作、測試及審查工作。openspec/specs/ 保留目前有效規格，通過團隊接受程序後才整合已接受的變更。',
'任務勾選只記錄工作狀態。仍須核對文件格式、實際功能與負向測試、程式碼及人類審查；保存命令、環境、結果及尚未驗證事項。封存也不能代替這些證據。',
'一人維護簡單且少變更的原型，通常先用 Markdown；五人共同修改多項正式功能，可評估 OpenSpec 降低差異與審查同步成本。人數不是唯一門檻，還須比較需求複雜度、變更頻率、接受權責與工具維護能力。'],
'en':[
'This is an implementation defect: the current specification already requires all mandatory items before marking a report complete. Fix completeness and export enforcement, test missing-value cases and avoid a duplicate requirement.',
'proposal.md explains the purpose and scope of critical-value notifications. The change’s specs/ defines new behavior and testable scenarios. When needed, design.md records notification mechanisms and technical decisions. tasks.md lists implementation, testing and review. Current openspec/specs/ remains authoritative until accepted changes are integrated through the team’s acceptance process.',
'Checked tasks record work status. Still inspect document format, actual functional and negative tests, code and human review. Retain commands, environment, results and unverified items. Archiving cannot replace this evidence.',
'For a simple, infrequently changed solo prototype, usually start with Markdown. Five people changing several production features may evaluate OpenSpec to reduce synchronization costs around deltas and review. Headcount alone does not decide: consider complexity, change frequency, acceptance responsibility and tooling maintenance.']}

def parse(lang):
 s=(P/f'adopted.{lang}.md').read_text()
 codes=re.findall(r'```[^\n]*\n(.*?)```',(P/'adopted.zh.md').read_text(),re.S)
 if lang=='zh':
  counter=iter(range(1,len(codes)+1))
  s=re.sub(r'```[^\n]*\n.*?```',lambda m:f'@code{next(counter)}',s,flags=re.S)
 chunks=re.split(r'^## (.+)\n',s,flags=re.M)
 assert len(chunks)==17
 groups=[('核心問題' if lang=='zh' else 'The Central Question',re.sub(r'^# .*\n','',chunks[0]))]+list(zip(chunks[1::2],chunks[2::2]))
 sections=[];table=0;code_n=0
 for index,(heading,body) in enumerate(groups):
  paragraphs=[];blocks=[];pending=[];lines=body.strip().splitlines();i=0
  def flush():
   nonlocal pending
   if pending:
    if blocks and blocks[-1]['kind']=='step' and blocks[-1]['paragraphs']==['以下依文件責任逐項說明。' if lang=='zh' else 'The following explains each document responsibility.']:
     blocks[-1]['paragraphs']=[pending.pop(0)]
    if not pending:return
    if not blocks and not paragraphs:paragraphs.extend(pending)
    else:blocks.append(dict(kind='prose',paragraphs=pending))
    pending=[]
  while i<len(lines):
   line=lines[i].strip()
   if not line:i+=1;continue
   if line.startswith('@figure'):
    flush();n=int(line[-1]);cap,desc,items=figures[lang][n-1]
    blocks.append(dict(kind='flow',caption=cap,description=desc,items=[dict(title=a,body=b)for a,b in items]));i+=1;continue
   if line.startswith('### '):
    flush();blocks.append(dict(kind='step',heading=line[4:],paragraphs=['以下依文件責任逐項說明。' if lang=='zh' else 'The following explains each document responsibility.']));i+=1;continue
   if line.startswith('@code'):
    flush();code_n+=1;code=codes[int(line[5:])-1].strip();i+=1
    blocks.append(dict(kind='step',heading=('範例 ' if lang=='zh' else 'Example ')+str(code_n),paragraphs=['合成文件示例；不是已執行命令的輸出。' if lang=='zh' else 'Synthetic document contents, not output from an executed command.'],code=code));continue
   if line.startswith('|'):
    flush();rows=[]
    while i<len(lines)and lines[i].strip().startswith('|'):
     rows.append([re.sub(r'`([^`]+)`',r'\1',v.strip())for v in lines[i].strip().strip('|').split('|')]);i+=1
    table+=1;blocks.append(dict(kind='table',caption=('表 'if lang=='zh'else'Table ')+str(table),headers=rows[0],rows=rows[2:]));continue
   para=[]
   while i<len(lines)and lines[i].strip():para.append(lines[i]);i+=1
   pending.append('\n'.join(para))
  flush()
  if not paragraphs:
   paragraphs=[('以下以餐廳訂單的候選變更走一遍文件與驗證流程。'if lang=='zh'else'The following follows a candidate restaurant-order change through its documents and verification.') if index==3 else ('分清以下五組概念，才能判讀文件與執行證據。'if lang=='zh'else'Distinguish these five concepts when interpreting documents and execution evidence.')]
  sections.append(dict(id=ids[index],heading=heading,paragraphs=paragraphs,**({'blocks':blocks}if blocks else {})))
 assert table==4 and code_n==7
 return sections

def main():
 lesson=json.loads((P/'previous/lesson.json').read_text());lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11');lesson['checks']=[];lesson['sourceIds'].append('openspec-quickstart-20261111')
 for lang in ['zh','en']:
  sections=parse(lang)
  # Questions are displayed once, with native reference-answer disclosures.
  last=sections[-1];questions=[]
  def extract(paras):
   result=[]
   for para in paras:
    if re.match(r'^(問題|Question) [1-4][：:]',para):questions.append(para)
    else:result.append(para)
   return result
  last['paragraphs']=extract(last['paragraphs'])
  for block in last.get('blocks',[]):
   if block['kind']=='prose':block['paragraphs']=extract(block['paragraphs'])
  assert len(questions)==4
  lesson['text'][lang]['sections']=sections
  lesson['text'][lang]['openChecks']=[dict(id=f'AASE-M05-C05-Q{n+4:02}',prompt=q,answer=[answers[lang][n]])for n,q in enumerate(questions)]
  lesson['text'][lang]['objectives']=(['區分現行規格、候選變更、設計、任務與驗證證據。','以餐廳案例走過提案、Delta Spec、設計、任務及接受流程。','依協作、變更與維護成本選擇 Markdown 或 OpenSpec。']if lang=='zh'else['Distinguish current specifications, candidate changes, design, tasks and verification evidence.','Follow a restaurant example through proposal, delta, design, tasks and acceptance.','Choose Markdown or OpenSpec around collaboration, change and maintenance costs.'])
  lesson['text'][lang]['summary']=('用餐廳保留訂單案例讀懂 OpenSpec 的規格、變更與驗證分工，並比較一人原型和多人協作何時適合輕量 Markdown。'if lang=='zh'else'Use restaurant reservations to understand OpenSpec specifications, changes and verification, then compare lightweight Markdown for solo prototypes and collaboration.')
  sections[2]['sourceIds']=['openspec-concepts-pinned'];sections[3]['sourceIds']=['openspec-start-pinned','openspec-quickstart-20261111'];sections[7]['sourceIds']=['openspec-start-pinned','openspec-quickstart-20261111']
 dest=ROOT/'content/aase/lessons/aase-m05-c05.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
 if '--check'in sys.argv:assert dest.read_text()==data,'lesson differs from manuscripts'
 else:dest.write_text(data)
 (P/'figures.json').write_text(json.dumps(figures,ensure_ascii=False,indent=2)+'\n')if '--check'not in sys.argv else None
 print('PASS: nine bilingual sections, four tables, seven code examples, two figures, four open checks.')
if __name__=='__main__':main()
