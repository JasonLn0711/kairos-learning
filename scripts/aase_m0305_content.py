"""Build the complete bilingual M03-05 replacement from reviewed manuscripts."""
import json,re,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'docs/sources/aase/m03-05/replacement-2026-11-11'
old=json.loads((p/'prior-lesson.json').read_text());lesson=json.loads(json.dumps(old))
lesson.update(revision=5,contentVersion='1.2.0',date='2026-11-11')
figures=json.loads((p/'figures.json').read_text())
ids=['outcome','evidence-chain','metrics','measure','toy-results','analogy','assumptions','trace','engineering','record','workflow','understanding']
code=re.search(r'```\n([\s\S]*?)\n```',(p/'pasted-text-1.txt').read_text())[1]
def parse(lang):
 s=(p/f'teaching.{lang}.md').read_text().replace('@template','```\n'+code+'\n```')
 chunks=[];current=[];fenced=False
 for line in s.splitlines():
  if line.startswith('```'):fenced=not fenced
  if line.startswith('## ') and not fenced:chunks.append(current);current=[line[3:]]
  else:current.append(line)
 chunks.append(current);assert len(chunks)==len(ids)
 sections=[]
 for n,lines in enumerate(chunks):
  lines=[*lines];heading=lines.pop(0).lstrip('# ')
  if n==0:heading='如何判定系統真的有用？' if lang=='zh' else 'How do we determine whether a system helps?'
  paragraphs=[];blocks=[];i=0
  def prose(value):
   if not blocks:paragraphs.append(value)
   elif blocks[-1]['kind'] in ['prose','step'] and 'code' not in blocks[-1]:blocks[-1]['paragraphs'].append(value)
   else:blocks.append(dict(kind='prose',paragraphs=[value]))
  while i<len(lines):
   line=lines[i].strip()
   if not line:i+=1;continue
   if line.startswith('@figure'):blocks.append(figures[lang][int(line[-1])-1]);i+=1;continue
   if line.startswith('### '):
    blocks.append(dict(kind='step',id=f'{ids[n]}-subsection-{sum(b["kind"]=="step" for b in blocks)+1}',heading=line[4:],paragraphs=[]));i+=1;continue
   if line.startswith('|'):
    rows=[]
    while i<len(lines) and lines[i].strip().startswith('|'):
     rows.append([v.strip() for v in lines[i].strip().strip('|').split('|')]);i+=1
    blocks.append(dict(kind='table',caption=('表' if lang=='zh' else 'Table')+f' {sum(b["kind"]=="table" for ss in sections for b in ss.get("blocks",[]))+sum(b["kind"]=="table" for b in blocks)+1}',headers=rows[0],rows=rows[2:]));continue
   if line.startswith('```'):
    value=[];i+=1
    while i<len(lines) and not lines[i].startswith('```'):value.append(lines[i]);i+=1
    i+=1;blocks.append(dict(kind='step',id='problem-template',heading='problem.md',paragraphs=['合成範例；基準、結果與決策狀態依原稿保留。' if lang=='zh' else 'Synthetic example; baseline, results and decision status are retained as supplied.'],code='\n'.join(value)));continue
   value=[]
   while i<len(lines) and lines[i].strip():value.append(lines[i]);i+=1
   prose('\n'.join(value))
  # A figure at the beginning still needs the host model’s visible introductory paragraph.
  if not paragraphs:paragraphs=['依下列合成案例檢查主張與證據。' if lang=='zh' else 'Use the following synthetic case to examine claims and evidence.']
  sections.append(dict(id=ids[n],heading=heading,paragraphs=paragraphs,**({'blocks':blocks} if blocks else {})))
 return sections
for lang in ['zh','en']:lesson['text'][lang]['sections']=parse(lang)
if '--structure' in sys.argv:
 for a,b in zip(lesson['text']['zh']['sections'],lesson['text']['en']['sections']):
  print(a['id'],len(a['paragraphs']),len(b['paragraphs']),[(x['kind'],len(x.get('paragraphs',[]))) for x in a.get('blocks',[])],[(x['kind'],len(x.get('paragraphs',[]))) for x in b.get('blocks',[])])
 sys.exit()
answers={
'zh':[
'瑕疵阻擋率＝18／20＝90%；良品正確放行率＝(80－12)／80＝85%。前者看漏擋，後者看誤擋；不能只報其中一個來宣稱整體效果良好。',
'10變7分鐘是示範工作時間減少30%，不足以證明工廠整體生產效率提高30%。還要固定任務、難度、起終點、產出品質與檢查修正時間，記錄失敗、放棄、樣本與其他變因。固定工時產出量與每件耗時的百分比也不同；沒有這些資料就無法推論工廠層級成效。',
'例如：在事先界定的產品與期間內，AI輔助檢查可降低每件合格產出的總檢查成本，並維持漏擋與誤擋在預定護欄內。先定基準、成本範圍、對照方式、樣本與門檻；納入設備、人工覆核、重工與錯誤成本。若成本不降或品質護欄變差，假設未獲支持。',
'增加重新校正後使受影響的舊合格結果失效、重新檢查才可放行的需求。保留校正版本、受影響資料範圍、R/H/M/T/C/E連結、來源、確認角色、日期、理由與狀態；先寫待驗，實際執行後再附證據與決策。',
'現有資料不足以支持全面上線；可在風險可控制且有明確護欄、停止條件與證據計畫時繼續限制範圍試驗。若無法控制風險或成本則停止或延後。說明選擇依據、待補資料與下一個決策門檻，不能把合成紀錄當成真實試驗已完成。'],
'en':[
'The defect blocking rate is 18/20 = 90%. The correct release rate for good products is (80−12)/80 = 85%. The first addresses missed defects; the second addresses false blocks. Neither alone establishes good overall performance.',
'The illustrative task time falls by 30%, from 10 to 7 minutes. This does not establish a 30% improvement in overall factory production efficiency. Fix tasks, difficulty, timing boundaries, output quality and checking/correction time; record failures, abandonment, samples and other variables. Output per fixed work period and time per item also have different percentage changes. Factory-level effects cannot be inferred from these data.',
'For example: within predefined products and a measurement period, AI-assisted inspection reduces total inspection cost per acceptable output while missed defects and false blocks remain within agreed guardrails. Define the baseline, cost boundary, comparison, sample and threshold; include equipment, human review, rework and error costs. No cost reduction or worse quality guardrails would leave the hypothesis unsupported.',
'Require recalibration to invalidate affected previous pass results, with a new check before release. Record calibration version, affected data scope, R/H/M/T/C/E links, source, confirming role, date, rationale and status. Mark evidence pending until tests run; then attach actual evidence and decisions.',
'The current information does not support full rollout. A limited trial is reasonable only with controllable risk, clear guardrails, stopping conditions and an evidence plan. Stop or defer if risk or cost cannot be controlled. State the rationale, missing evidence and next decision gate; synthetic records do not establish that a real trial has occurred.']}
for lang in ['zh','en']:
 prompts=next(b for b in lesson['text'][lang]['sections'][-1]['blocks'] if b['kind']=='prose')['paragraphs']
 questions=next(x for x in prompts if x.startswith('1. ')).splitlines()
 assert len(questions)==5
 lesson['text'][lang]['openChecks']=[dict(id=f'AASE-M03-C05-Q{i+8:02}',prompt=re.sub(r'^\d+\. ','',q),answer=[answers[lang][i]]) for i,q in enumerate(questions)]
lesson['checks']=[]
output=root/'content/aase/lessons/aase-m03-c05.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert output.read_text()==data,'Lesson differs from manuscripts'
else:output.write_text(data)
print('PASS: complete manuscripts and six figures synchronized.')
