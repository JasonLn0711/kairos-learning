"""Generate M06-02 from the complete paired manuscripts and bounded figures."""
import json,re,sys
from pathlib import Path
R=Path(__file__).resolve().parents[1]
P=R/'docs/sources/aase/m06-02/replacement-2026-11-11'
ids=['scope','analogy','levels','banking','diagram','labels','development','distinctions','review','understanding']
figures=json.loads((P/'figures.json').read_text())
l=json.loads((P/'previous-lesson.json').read_text());l.update(revision=4,contentVersion='1.1.0',date='2026-11-11');l['checks']=[]
questions={
'zh':[
('在 AI 合約審查案例中，哪些元素應該畫在運行時 Context 圖上？\n律師、審查系統、LLM API、Codex，全部都要\n律師、審查系統、外部 LLM API\n只畫 Python 程式與資料庫','第二項。律師是使用者，審查系統是主系統，外部 LLM API 是運行時依賴。Codex 僅用於開發，另記錄其開發權限。Python 與資料庫內部細節留給更細層級。'),
('「審查系統 → LLM API」的箭頭，怎麼標示最好？\n連接\nHTTP\n傳送待分析的合約內容，要求產生審查建議','第三項。它同時說明資料與目的；「連接」沒有交代用途，HTTP 是通訊技術，不能代替業務關係的說明。'),
('當你發現合約包含機密資訊時，Context 圖已經畫出資料傳送關係，這代表資料安全問題已經解決了嗎？請說明理由。','尚未。圖只能指出資料會送到外部模型服務；仍須另行確認資料是否允許外送、必要內容與去識別化、服務保留政策，以及驗證、授權、加密與監控。畫出系統範圍與資料關係不等於已實作或驗證安全控制。')],
'en':[
('Which elements belong in the contract-review product’s runtime Context?\nThe lawyer, review system, LLM API and Codex, all together\nThe lawyer, review system and external LLM API\nOnly the Python program and database','The second option. The lawyer is the user, the review system is the focus and the external LLM API is a runtime dependency. Codex is a development tool whose permissions belong in the development record. Python and database internals belong at finer levels.'),
('How should “review system → LLM API” be labelled?\nConnects\nHTTP\nSends contract content for analysis and requests review suggestions','The third option names the data and purpose. “Connects” omits the purpose; HTTP names a transport technology rather than explaining the business relationship.'),
('If the contract contains confidential information, does drawing its transmission in Context mean the data-security problem has been solved? Explain.','No. The diagram identifies data leaving for the model service. Separately establish whether transfer is permitted, which content is necessary, de-identification and retention policies, and validation, authorization, encryption and monitoring. Drawing scope and relationships does not implement or verify security controls.')]
}
for lang in ['zh','en']:
 chunks=[];current=[];fenced=False
 for line in (P/f'teaching.{lang}.md').read_text().splitlines():
  if line.startswith('```'):fenced=not fenced
  if line.startswith('## ') and not fenced:chunks.append('\n'.join(current));current=[line[3:]]
  else:current.append(line)
 chunks.append('\n'.join(current));sections=[]
 for n,chunk in enumerate(chunks):
  lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ')
  if n==0:heading='先理解系統、使用者與外界的關係' if lang=='zh' else 'Establish the system, its users and its external relationships'
  paras=[];blocks=[];i=0
  def prose(value):
   if not blocks:paras.append(value)
   elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
   else:blocks.append(dict(kind='prose',paragraphs=[value]))
  while i<len(lines):
   line=lines[i].strip()
   if not line:i+=1;continue
   if line.startswith('@figure'):blocks.append(figures[lang][int(line[-1])-1]);i+=1;continue
   if line.startswith('```'):
    code=[];i+=1
    while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
    blocks.append(dict(kind='step',heading='architecture.md 最小範本' if lang=='zh' else 'Minimum architecture.md template',paragraphs=['將範本存為 architecture.md，依實際範圍修改；此處只使用合成資料。' if lang=='zh' else 'Save this template as architecture.md and adapt it to the actual scope; use synthetic data here.'],code='\n'.join(code).strip()));i+=1;continue
   if line.startswith('### '):blocks.append(dict(kind='step',heading=line[4:],paragraphs=[]));i+=1;continue
   if line.startswith('|'):
    rows=[]
    while i<len(lines) and lines[i].strip().startswith('|'):rows.append([x.strip() for x in lines[i].strip().strip('|').split('|')]);i+=1
    blocks.append(dict(kind='table',caption=('表｜'+heading if lang=='zh' else 'Table | '+heading)+('：關係標籤' if lang=='zh' else ': relationship labels') if n==4 else ('表｜' if lang=='zh' else 'Table | ')+heading,headers=rows[0],rows=rows[2:]));continue
   paragraph=[]
   while i<len(lines) and lines[i].strip() and not lines[i].startswith(('### ','@figure','```','|')):paragraph.append(lines[i]);i+=1
   value='\n'.join(paragraph)
   if blocks and blocks[-1]['kind']=='step' and 'code' not in blocks[-1]:blocks[-1]['paragraphs'].append(value)
   else:prose(value)
  sections.append(dict(id=ids[n],heading=heading,paragraphs=paras,**({'blocks':blocks} if blocks else {})))
 assert len(sections)==10
 l['text'][lang]['sections']=sections
 l['text'][lang]['openChecks']=[dict(id=f'AASE-M06-C02-Q{n+4:02}',prompt=q,answer=[a])for n,(q,a)in enumerate(questions[lang])]
 l['text'][lang]['readingGuide']['route']='先從餐廳辨識外部關係，再讀四層與銀行圖，畫收件系統，最後留下 architecture.md 並自查。' if lang=='zh' else 'Identify restaurant relationships, read the C4 levels and banking example, draw the intake system, then record architecture.md and review your understanding.'
out=R/'content/aase/lessons/aase-m06-c02.json';data=json.dumps(l,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert out.read_text()==data,'M06-02 differs from manuscripts'
else:out.write_text(data)
print('PASS: ten paired sections, four paired figures, five tables, full template and three original checks.')
