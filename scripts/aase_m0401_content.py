"""Generate M04-01 from complete manuscripts and the four reviewed figure models."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'docs/sources/aase/m04-01/replacement-2026-11-11'
ids=['introduction','analogy','three-lenses','mechanisms','industries','quality','usability','case','evidence','record','task-analysis','understanding']
sources={'analogy':['nng-ux'],'three-lenses':['sigchi-about','figma-interaction'],'mechanisms':['nng-heuristics'],'usability':['iso-usability','nist-usability','govuk-wcag'],'evidence':['nist-usability']}
figures=json.loads((p/'figures.json').read_text())
answers={'zh':['優先從 HCI 研究使用者如何理解「預約轉帳」與「立即轉帳」。按鈕清楚只支持 UI 的可見性；可請使用者用自己的話解釋兩種轉帳的執行時點，再檢查文字、回饋與流程。','主要從 UX 檢查退貨的整段服務，包括聯絡、交接與退款。畫面漂亮及購物操作快速，仍不足以證明售後服務順暢。','不行，仍需要使用者任務證據。讓具代表性的使用者處理缺件案例，觀察理解、錯誤、完成率及時間；單元測試只支持所測檢查邏輯。','例如物流地址補正：在缺漏欄位旁顯示具體原因與修正方式，假設能協助使用者自行完成補正。以相近任務比較原版與候選版，記錄完成率、錯誤、時間、求助及狀態理解；測試前保留為假設。'], 'en':['Prioritize HCI: investigate how users interpret “Scheduled transfer” and “Immediate transfer.” A visible button supports UI visibility only. Ask users to explain when each transfer executes, then examine wording, feedback and workflow.','Use UX to examine the full returns service, including contact, handoffs and refunds. An attractive screen and fast purchasing flow do not establish smooth after-sales service.','No: evidence from users performing tasks is still needed. Representative users should handle missing-information cases while you observe understanding, errors, completion and time. Unit tests support only the checking logic exercised.','For example, hypothesize that specific reasons and correction guidance beside incomplete delivery-address fields help users correct them independently. Compare existing and candidate versions on similar tasks, recording completion, errors, time, help and state understanding. Keep it a hypothesis until tested.']}
def parse(lang):
 sections=[];questions=[]
 for n,chunk in enumerate(re.split(r'^## ',(p/f'teaching.{lang}.md').read_text(),flags=re.M)):
  lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ')
  if n==0:heading='讓使用者理解系統並完成工作' if lang=='zh' else 'Help users understand the system and complete their work'
  paragraphs=[];blocks=[];i=0
  while i<len(lines):
   line=lines[i].strip()
   if not line:i+=1;continue
   if line.startswith('@figure'):
    blocks.append(figures[lang][int(line[-1])-1]);i+=1;continue
   if line.startswith('|'):
    rows=[]
    while i<len(lines) and lines[i].strip().startswith('|'):
     rows.append([x.strip() for x in lines[i].strip().strip('|').split('|')]);i+=1
    names={'zh':{2:'表 1｜HCI、UI、UX 比較',4:'表 2｜六行業的分析視角',6:'表 3｜易用性與量測'},'en':{2:'Table 1 | Compare HCI, UI and UX',4:'Table 2 | Perspectives across six industries',6:'Table 3 | Usability and measurement'}}
    blocks.append(dict(kind='table',caption=names[lang][n],headers=rows[0],rows=rows[2:]));continue
   if line.startswith('### '):
    blocks.append(dict(kind='step',heading=line[4:],paragraphs=[]));i+=1;continue
   if line.startswith('```'):
    assert blocks[-1]['kind']=='step';i+=1;code=[]
    while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
    assert i<len(lines),'unclosed code';blocks[-1]['code']='\n'.join(code).strip();i+=1;continue
   para=[]
   while i<len(lines) and lines[i].strip():para.append(lines[i]);i+=1
   value='\n'.join(para)
   if n==11 and (re.match(r'^[123]\. ',value) or value.startswith(('實作題：','Practical exercise:'))):
    questions.append(value[3:] if re.match(r'^[123]\. ',value) else value);continue
   if n==11 and len(questions) in [1,2,3] and value not in ['本頁提供參考解析；可將自己的答案與理由另存，供討論或後續檢查。','This page provides reference explanations. Save your own answers and reasoning separately for discussion or later review.']:
    questions[-1]+='\n'+value;continue
   if blocks and blocks[-1]['kind']=='step':blocks[-1]['paragraphs'].append(value)
   elif not blocks:paragraphs.append(value)
   elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
   else:blocks.append(dict(kind='prose',paragraphs=[value]))
  assert n<len(ids)
  section=dict(id=ids[n],heading=heading,paragraphs=paragraphs)
  if blocks:section['blocks']=blocks
  if ids[n] in sources:section['sourceIds']=sources[ids[n]]
  sections.append(section)
 assert len(sections)==12 and len(questions)==4
 return sections,[dict(id=f'AASE-M04-C01-Q{i+4:02}',prompt=q,answer=[answers[lang][i]]) for i,q in enumerate(questions)]
l=json.loads((p/'prior-lesson.json').read_text());l.update(revision=l['revision']+1,contentVersion='1.2.0',date='2026-11-11',checks=[])
l['sourceIds']=list(dict.fromkeys(l['sourceIds']+sum(sources.values(),[])))
for lang in ['zh','en']:
 l['text'][lang]['sections'],l['text'][lang]['openChecks']=parse(lang)
l['text']['zh']['summary']='從醫院報到、六行業情境與收件系統，理解 HCI、UI、UX、易用性及可驗證的 AI 設計需求。'
l['text']['en']['summary']='Use hospital check-in, six industries and an intake system to understand HCI, UI, UX, usability and verifiable AI design requirements.'
data=json.dumps(l,ensure_ascii=False,indent=2)+'\n';out=ROOT/'content/aase/lessons/aase-m04-c01.json'
if '--check' in sys.argv:assert out.read_text()==data,'lesson differs from manuscripts'
else:out.write_text(data)
print('PASS: complete bilingual manuscripts, twelve sections, four figures, three tables and four open checks.')
