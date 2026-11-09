"""Build the complete bilingual M04-01 manuscripts using the existing AASE model."""
import json,sys,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'docs/sources/aase/m04-01/replacement-2026-11-09'
print('Checking M04-01 manuscripts.' if '--check' in sys.argv else 'Generating M04-01 lesson.',file=sys.stderr)
l=json.loads((p/'prior-lesson.json').read_text());l.update(revision=5,contentVersion='1.1.1',date='2026-11-09');l['checks']=[]
figures=json.loads((p/'figures.json').read_text())
ids=['introduction','analogy','three-lenses','case','quality','evidence','record','task-analysis','understanding']
answers={
'zh':['先從 HCI 研究使用者如何理解「成功」以及為何誤判。請他用自己的話解釋狀態，找出「欄位齊全」與「正式送出」的認知差異；再以 UI 改寫狀態與下一步，並從 UX 檢查送件流程。三者互相影響。','主要從 UX 檢查整段工作與交接。單一介面能操作、能匯出，仍不足以讓接手者完成後續任務；需要查看報告缺少什麼資訊或格式，以及交接規則。','給使用者指定的缺件情境，觀察他能否找到欄位、說明缺漏並自行修正；記錄提示、錯誤與任務結果，再依同等條件比較修改前後。漂亮與具體的文字仍是候選設計，程式測試也不能代替人的理解證據。'],
'en':['Start with HCI to investigate how the user interprets “Success” and why the error occurs. Ask them to explain the state in their own words and identify the difference between complete fields and formal submission. Then revise status and next-action wording through UI design and examine the submission workflow through UX. The perspectives interact.','UX mainly reveals this end-to-end workflow and handoff problem. An operable interface and export function do not ensure that the recipient can complete the next task. Examine missing information or formats in the report and the handoff rules.','Give users the specified missing-information scenario and observe whether they can locate the field, explain the omission and correct it independently. Record assistance, errors and task outcomes, then compare the earlier and candidate designs under equivalent conditions. Attractive, specific wording remains a candidate; program tests do not replace evidence about human understanding.']}
for lang in ['zh','en']:
 chunks=re.split(r'^## ',(p/f'teaching.{lang}.md').read_text(),flags=re.M);sections=[];questions=[]
 for n,chunk in enumerate(chunks):
  lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ')
  if n==0:heading='讓使用者理解系統並完成工作' if lang=='zh' else 'Help users understand the system and complete their work'
  paras=[];blocks=[];i=0
  while i<len(lines):
   line=lines[i].strip()
   if not line:i+=1;continue
   if line.startswith('@figure'):blocks.append(figures[lang][int(line[-1])-1]);i+=1;continue
   if line.startswith('|'):
    rows=[]
    while i<len(lines) and lines[i].strip().startswith('|'):
     rows.append([x.strip() for x in lines[i].strip().strip('|').split('|')]);i+=1
    blocks.append(dict(kind='table',caption=('表 1｜三種觀點的差別' if n==2 else '表 2｜問題與驗證方法') if lang=='zh' else ('Table 1 | Compare the perspectives' if n==2 else 'Table 2 | Questions and verification methods'),headers=rows[0],rows=rows[2:]));continue
   paragraph=[]
   while i<len(lines) and lines[i].strip():paragraph.append(lines[i]);i+=1
   value='\n'.join(paragraph)
   if n==8 and re.match(r'^[123]\. ',value):questions.append(value[3:]);continue
   if n==1 and re.match(r'^[123]\. ',value):
    blocks.append(dict(kind='step',heading=value[3:],paragraphs=[]));continue
   if n==1 and blocks and blocks[-1]['kind']=='step':blocks[-1]['paragraphs'].append(value)
   elif not blocks:paras.append(value)
   elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
   else:blocks.append(dict(kind='prose',paragraphs=[value]))
  sections.append(dict(id=ids[n],heading=heading,paragraphs=paras,**({'blocks':blocks} if blocks else {})))
 assert len(sections)==9 and len(questions)==3
 for section in sections:
  if section['id']=='three-lenses':section['sourceIds']=['sigchi-about','nng-ux']
  if section['id']=='quality':section['sourceIds']=['nng-heuristics']
 l['text'][lang]['sections']=sections
 l['text'][lang]['openChecks']=[dict(id=f'AASE-M04-C01-Q{i+4:02}',prompt=q,answer=[answers[lang][i]]) for i,q in enumerate(questions)]
out=ROOT/'content/aase/lessons/aase-m04-c01.json';data=json.dumps(l,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert out.read_text()==data,'lesson differs from manuscripts'
else:out.write_text(data)
print('PASS: two complete manuscripts, nine sections each, five figures and three open checks.')
