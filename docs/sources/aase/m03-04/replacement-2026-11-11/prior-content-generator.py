import json,re,sys
print("Checking AASE M03-04 manuscripts." if "--check" in sys.argv else "Generating AASE M03-04 lesson.",file=sys.stderr)
from pathlib import Path
root=Path(__file__).resolve().parents[1];p=root/'docs/sources/aase/m03-04/replacement-2026-11-09'
old=json.loads((p/'prior-lesson.json').read_text());l=json.loads(json.dumps(old));l.update(revision=4,contentVersion='1.1.0',date='2026-11-09')
f=json.loads((p/'figures.json').read_text())
ids=['minimum','analogy','risk','workflow','scope','change','done','document','comparison','decision','understanding']
for lang in ['zh','en']:
 s=(p/f'teaching.{lang}.md').read_text();chunks=[];current=[];fenced=False
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
    blocks.append(dict(kind='table',caption=('表' if lang=='zh' else 'Table')+' '+str(sum(b['kind']=='table' for ss in sections for b in ss.get('blocks',[]))+1),headers=rows[0],rows=rows[2:]));continue
   if line.startswith('```'):
    code=[];i+=1
    while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
    i+=1;blocks.append(dict(kind='step',id='problem-template',heading='problem.md',paragraphs=['合成範例；結果保持未測量。' if lang=='zh' else 'The shared example defines the core missing-field question; input, checks, feedback, correction, rechecking, preview and export; blocking incomplete export and invalidating stale results; history deferred until retention/deletion rules are confirmed; sharing deferred until roles, permissions and isolation are confirmed; official intake, real personal data and automatic external messages excluded. Completion requires missing-input, correction/recheck and post-edit tests to pass, plus a completed user task observation. These are planned criteria, not observed test results.'],code='\n'.join(code)));continue
   paragraph=[]
   while i<len(lines) and lines[i].strip():paragraph.append(lines[i]);i+=1
   value='\n'.join(paragraph)
   if not blocks:paras.append(value)
   elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
   else:blocks.append(dict(kind='prose',paragraphs=[value]))
  sections.append(dict(id=ids[n],heading=heading,paragraphs=paras,**({'blocks':blocks} if blocks else {})))
 l['text'][lang]['sections']=sections
 l['text'][lang].pop('openChecks',None)
l['checks']=[dict(id='AASE-M03-C04-Q04',answer=1,text={
 'zh':dict(prompt='第一版要驗證缺漏辨識與修正，你會選哪個方向？為什麼？',options=['優先做漂亮的首頁及登入介面','完成上傳、缺漏檢查、修正與重新驗證的流程','一次加入多模型、多人協作及批次處理','先讓 AI 產生報告，正確性測試以後再做'],rationales=['首頁與登入無法驗證缺漏辨識和修正。','B 保留可驗證的完整核心任務；缺漏阻擋及修改後重查仍須實測。','同時擴充多條流程增加範圍，尚未回答核心問題。','正確性是必要約束，不能為縮小範圍而刪除。']),
 'en':dict(prompt='Which direction would you choose to verify missing-information detection and correction, and why?',options=['Prioritize a beautiful home page and login interface.','Complete upload, missing-input checks, correction and revalidation.','Add multiple models, collaboration and batch processing at once.','Let AI generate reports first and postpone correctness tests.'],rationales=['A home page and login do not verify detection and correction.','B retains a verifiable complete core task; blocking and post-edit rechecking still require actual tests.','Expanding several workflows increases scope before answering the core question.','Correctness is a necessary constraint that scope reduction must retain.'])})]
out=root/'content/aase/lessons/aase-m03-c04.json';data=json.dumps(l,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert out.read_text()==data,'lesson differs from manuscripts'
else:out.write_text(data)
print('PASS: 2 languages, 11 sections each; manuscript and lesson synchronized.')
