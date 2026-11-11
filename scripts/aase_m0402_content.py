"""Compile complete task-analysis manuscripts, retaining paragraph order and old anchors."""
import json,re,sys
from pathlib import Path
R=Path(__file__).resolve().parents[1];P=R/'docs/sources/aase/m04-02/replacement-2026-11-11'
l=json.loads((P/'prior-lesson.json').read_text());l.update(revision=l['revision']+1,contentVersion='1.1.0',date='2026-11-11');l['checks']=[]
f=json.loads((P/'figures.json').read_text())
ids=['introduction','goal','decompose','plans','burden','industries','methods','walkthrough','understanding']
# Keep the supplied template byte-identical across the two pages; English explains its fields.
s=(P/'teaching.zh.md').read_text();template=re.search(r'```\n(.*?)\n```',s,re.S).group(1)
for lang in ['zh','en']:
 source=(P/f'teaching.{lang}.md').read_text()
 if lang=='en':source=source.replace('@template','```\n'+template+'\n```')
 chunks=[];lines=[];fenced=False
 for line in source.splitlines():
  if line.startswith('```'):fenced=not fenced
  if line.startswith('## ') and not fenced:chunks.append(lines);lines=[line[3:]]
  else:lines.append(line)
 chunks.append(lines);sections=[];mapping=[];table_number=0
 for n,lines in enumerate(chunks):
  lines=lines.copy();heading=lines.pop(0).lstrip('# ');paras=[];blocks=[];i=0
  while i<len(lines):
   line=lines[i].strip()
   if not line:i+=1;continue
   if line.startswith('@figure'):blocks.append(f[lang][int(line[-1])-1]);i+=1;continue
   if line.startswith('### '):
    title=line[4:];ident=f'{ids[n]}-sub{sum(b["kind"]=="step" for b in blocks)+1}';blocks.append(dict(kind='step',id=ident,heading=title,paragraphs=[]));mapping.append(dict(source=title,anchor='analogy' if n==1 else ident));i+=1;continue
   if line.startswith('|'):
    rows=[]
    while i<len(lines) and lines[i].strip().startswith('|'):
     rows.append([x.strip() for x in lines[i].strip().strip('|').split('|')]);i+=1
    table_number+=1
    blocks.append(dict(kind='table',caption=('表' if lang=='zh' else 'Table')+' '+str(table_number),headers=rows[0],rows=rows[2:]));continue
   if line.startswith('```'):
    code=[];i+=1
    while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
    i+=1;blocks.append(dict(kind='step',id='task-template',heading='wireframe-notes.md',paragraphs=['合成任務模板；九項欄位包含目標、使用者、前置條件、起終點、子任務、例外、回饋、待確認問題及驗證。' if lang=='zh' else 'Copyable original Chinese template. English field-by-field reading: (1) Goal: obtain a completeness report matching the latest input. (2) User: staff checking application data. (3) Preconditions: obtain the data and define required fields and checking rules. (4) Start/end: begin processing; succeed only by confirming a valid result and exporting; otherwise explicitly cancel or pause for information. (5) Subtasks: T1 prepare and enter; T2 check; T3 identify and supply omissions conditionally; T4 recheck and confirm current results; T5 export or exit. (6) Exceptions: E1 identify missing required data and block complete export; E2 invalidate results after edits and require rechecking; E3 show pending confirmation for unavailable information without guessing; E4 record cancellation separately from completion. (7) Feedback: identify required fields, place errors nearby, retain valid input, distinguish valid/missing/stale results and show completion or exit. (8) Open questions: who supplies document type, and who decides what happens if it is unavailable? (9) Verification: use synthetic data for a tabletop walkthrough, then test prototype functions and actual users; tabletop predictions are not user measurements.'],code='\n'.join(code)));continue
   paragraph=[]
   while i<len(lines) and lines[i].strip():paragraph.append(lines[i]);i+=1
   value='\n'.join(paragraph)
   if not blocks:paras.append(value)
   elif blocks[-1]['kind'] in ['prose','step'] and 'code' not in blocks[-1]:blocks[-1]['paragraphs'].append(value)
   else:blocks.append(dict(kind='prose',paragraphs=[value]))
  sections.append(dict(id=ids[n],heading=heading,paragraphs=paras,**({'blocks':blocks} if blocks else {})))
  mapping.append(dict(source=heading,anchor=ids[n]))
 # Preserve the prior lunch analogy anchor with its full supplied teaching.
 sec=sections[1];at=next(i for i,b in enumerate(sec['blocks']) if b.get('id')=='goal-sub1');tail=sec['blocks'][at:];sec['blocks']=sec['blocks'][:at]
 sections.insert(2,dict(id='analogy',heading=tail[0]['heading'],paragraphs=tail[0]['paragraphs']))
 for section in sections:
  for b in section.get('blocks',[]):
   if b['kind']=='step' and not b['paragraphs']:b['paragraphs']=['先確認下表的任務邊界，再決定畫面。' if lang=='zh' else 'Establish the task boundaries in the table before choosing the interface.']
 # The previous burden anchor remains; retain its source attribution.
 sections[1]['sourceIds']=['nng-task-analysis'];next(s for s in sections if s['id']=='plans')['sourceIds']=['nng-task-analysis'];next(s for s in sections if s['id']=='industries')['sourceIds']=['nng-task-analysis']
 t=l['text'][lang];t['sections']=sections
 t['openChecks']=[dict(id=f'AASE-M04-C02-Q{i+4:02}',prompt=q,answer=[a]) for i,(q,a) in enumerate([
 ('司機真正的工作目標是什麼？','可靠地完成交付並留下正確可追蹤的配送結果；簽名是其中一種證據，收件人不在不能標為已成功交付。'),('請拆出至少三個子任務，並指出需要哪些資訊。','確認配送地址與包裹：需要地址、包裹識別及聯絡方式；確認收件與簽收：需要收件人身分及簽收規則；回報結果：需要送達狀態、時間及可追蹤紀錄。異常則另依規則處理。'),('收件人不在或網路中斷，如何設計回復路徑？','收件人不在時依已確認的聯絡與重送規則處理，不自行假設可代簽。斷線時保留待同步紀錄並顯示尚未回報，連線後重試且避免重複回報；發現收件資訊錯誤須保留更正與重核紀錄。離線保留、安全及重送細節仍須由物流業者確認並測試。')
 ] if lang=='zh' else [
 ("What is the driver's actual work goal?",'Reliably complete delivery and retain a correct, traceable delivery outcome. A signature is one form of evidence; an absent recipient must not be recorded as a successful delivery.'),('Identify at least three subtasks and the information required.','Confirm address and parcel using the address, parcel identifier and contact details; confirm receipt and signature using recipient identity and signing rules; report the outcome using status, time and traceable records. Handle exceptions under the agreed rules.'),('How should absence or lost connectivity be handled?','Follow confirmed contact and redelivery rules when the recipient is absent; do not assume substitute signing is permitted. Retain a pending-sync record offline and show that reporting is incomplete. Retry after reconnection without duplicate reports. Incorrect recipient information needs a recorded correction and recheck. The operator must still confirm and test offline retention, security and redelivery details.')])]
 if lang=='zh':(P/'section-map.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2)+'\n')
# Every prior public section anchor survives.
for lang in ['zh','en']:
 assert set(s['id'] for s in json.loads((P/'prior-lesson.json').read_text())['text'][lang]['sections'])<=set(s['id'] for s in l['text'][lang]['sections'])
out=R/'content/aase/lessons/aase-m04-c02.json';data=json.dumps(l,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert out.read_text()==data
else:out.write_text(data)
print('PASS: complete bilingual task-analysis manuscripts compiled.')
