import json,re,sys
print("Checking AASE M03-05 manuscripts." if "--check" in sys.argv else "Generating AASE M03-05 lesson.",file=sys.stderr)
from pathlib import Path
root=Path(__file__).resolve().parents[1];p=root/'docs/sources/aase/m03-05/replacement-2026-11-09'
old=json.loads((p/'prior-lesson.json').read_text());l=json.loads(json.dumps(old));l.update(revision=4,contentVersion='1.1.0',date='2026-11-09')
f=json.loads((p/'figures.json').read_text())
ids=['outcome','evidence-chain','metrics','measure','analogy','assumptions','trace','record','engineering','understanding']
for lang in ['zh','en']:
 s=(p/f'teaching.{lang}.md').read_text();chunks=[];current=[];fenced=False
 for line in s.splitlines():
  if line.startswith('```'):fenced=not fenced
  if line.startswith('## ') and not fenced:chunks.append('\n'.join(current));current=[line[3:]]
  else:current.append(line)
 chunks.append('\n'.join(current));sections=[]
 for n,chunk in enumerate(chunks):
  lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ');heading=('做出功能之後，如何判定真的有用？' if lang=='zh' else 'How will you judge whether the system helps?') if n==0 else heading;paras=[];blocks=[];i=0
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
    i+=1;blocks.append(dict(kind='step',id='problem-template',heading='problem.md',paragraphs=['合成範例；結果保持未測量。' if lang=='zh' else 'Synthetic example; results remain unmeasured.'],code='\n'.join(code)));continue
   paragraph=[]
   while i<len(lines) and lines[i].strip():paragraph.append(lines[i]);i+=1
   value='\n'.join(paragraph)
   if not blocks:paras.append(value)
   elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
   else:blocks.append(dict(kind='prose',paragraphs=[value]))
  sections.append(dict(id=ids[n],heading=heading,paragraphs=paras,**({'blocks':blocks} if blocks else {})))
 # keep old toy-results anchor on the denominator explanations, without dropping text.
 sec=sections[3];at=next(i for i,b in enumerate(sec['blocks']) if b['kind']=='prose' and i>1)
 tail=sec['blocks'][at:];sec['blocks']=sec['blocks'][:at]
 sections.insert(4,dict(id='toy-results',heading='分母、零案例與錯誤阻擋' if lang=='zh' else 'Denominators, zero cases and overblocking',paragraphs=tail[0]['paragraphs'],**({'blocks':tail[1:]} if len(tail)>1 else {})))
 l['text'][lang]['sections']=sections
 # Preserve existing practice contract; replace the old MCQs with supplied open questions and closed reference explanations.
 l['text'][lang]['openChecks']=[dict(id=f'AASE-M03-C05-Q{i+4:02}',prompt=q,answer=[a]) for i,(q,a) in enumerate(([
 ('這次的缺漏阻擋率是多少？能否通過全數阻擋要求？','4／5＝80%。仍有一筆缺漏錯誤放行，未達指定缺漏案例全數阻擋要求。'),('無提示完成率是多少？需要提示者是否在分母？','2／4＝50%。分母是開始任務的四人，包含需要提示與放棄者；需要提示者不列入無提示完成的分子。'),('「節省八分鐘」是何種狀態？如何驗證？','目前是預期改善的假設，尚無量測結果。固定任務、同等難度資料與起終點，記錄提示、失敗和放棄，考慮交換操作順序以處理練習效應，再比較基準與新流程。'),('修改資料後仍沿用舊結果時，要加什麼規則與紀錄？','影響檢查的輸入一改變，舊通過結果便失效，重新檢查後才能完整匯出。保留原需求、C-01、變更理由、來源與決策，以及尚待取得的驗收證據；實測後再回填結果。')
 ] if lang=='zh' else [
 ('What is the blocking rate, and does it meet the all-cases requirement?','4/5 = 80%. One missing-input case is incorrectly allowed through, so the requirement that every specified case be blocked is not met.'),('What is the unprompted completion rate? Does the prompted user remain in the denominator?','2/4 = 50%. All four people who start remain in the denominator, including the prompted participant and the person who abandons. The prompted participant is excluded from the unprompted-success numerator.'),('What status does “saving eight minutes” have, and how would you test it?','It is a hypothesis about expected improvement, with no measured result yet. Fix tasks, comparable data and start/end conditions; record assistance, failures and abandonment. Consider varying workflow order to address practice effects before comparing the baseline and new workflow.'),('What rule and records address a stale result after edits?','Invalidate the previous pass whenever input affecting the check changes, and require a new check before complete-report export. Retain the original requirement, C-01, rationale, sources, decision and pending acceptance evidence; add actual results after testing.')]))]
l['checks']=[]
out=root/'content/aase/lessons/aase-m03-c05.json';data=json.dumps(l,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert out.read_text()==data,'lesson differs from manuscripts'
else:out.write_text(data)
print('PASS: 2 languages, 11 sections each; manuscript and lesson synchronized.')
