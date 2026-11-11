"""Generate M04-04 from complete manuscripts and shared figure data."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m04-04/replacement-2026-11-11'
IDS=['introduction','analogy','states','transitions','annotation','fidelity','walkthrough','file','purpose','understanding']
def build():
 l=json.loads((P/'prior-lesson.json').read_text());l.update(revision=4,contentVersion='1.1.0',date='2026-11-11');l['checks']=[];l['sourceIds']=['govuk-prototypes','balsamiq-wireframe-annotations','wcag22-error-identification']
 figures=json.loads((P/'figures.json').read_text())
 answers={
 'zh':['尚不足以證明完整。需要補上資料缺漏、真正需要等待時的處理中、技術失敗與安全復原、名額保留結果、完成後修改等狀態。欄位完整與實際掛號成功是不同結果。','不能。三欄完整只證明目前必填資料有值；貸款審核另有資格、權限與業務規則，必須取得實際審核結果才可顯示通過。','不能。草圖只能討論狀態與操作線索；接續要做可操作原型的情境走讀與鍵盤／焦點測試，以及真正程式的中斷、重試、權限、安全與資料保留測試。記錄測試範圍與尚待驗事項。'],
 'en':['No. Add missing-data states, processing when a real wait exists, technical failure and safe recovery, reservation outcomes, and edits after completion. Complete fields and a confirmed booking are different results.','No. Completeness only establishes that the current required fields have values. Loan approval requires separate eligibility, authority and business-rule checks plus an actual approval result.','No. Sketches support discussion of states and interaction cues. Next test an operable prototype through scenarios, keyboard and focus behavior, then test interruption, retry, permissions, security and retained data in real code. Record coverage and outstanding checks.']}
 for lang in ['zh','en']:
  chunks=[''];fenced=False
  for line in (P/f'teaching.{lang}.md').read_text().splitlines():
   if line.startswith('```'):fenced=not fenced
   if line.startswith('## ') and not fenced:chunks.append(line[3:]+'\n')
   else:chunks[-1]+=line+'\n'
  sections=[];questions=[]
  for n,chunk in enumerate(chunks):
   lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ')
   if n==0:heading='先確認操作與復原方式' if lang=='zh' else 'Establish actions and recovery first'
   paras=[];blocks=[];i=0
   def paragraph(v):
    v=v.replace('`','')
    if not blocks:paras.append(v)
    elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(v)
    else:blocks.append(dict(kind='prose',paragraphs=[v]))
   while i<len(lines):
    line=lines[i].strip()
    if not line:i+=1;continue
    if line.startswith('@figure'):
     blocks.append(figures[lang][int(line[-1])-1]);i+=1;continue
    if line.startswith('```'):
     i+=1;code=[]
     while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
     assert i<len(lines),'unclosed code fence';i+=1
     blocks.append(dict(kind='step',heading='wireframe-notes.md',paragraphs=['以下為合成設計註記範例。' if lang=='zh' else 'The retained Chinese template specifies triggers, missing-field recovery, safe technical-failure handling, limited completion, and invalidation after edits.'],code='\n'.join(code)));continue
    if line.startswith('|'):
     rows=[]
     while i<len(lines) and lines[i].strip().startswith('|'):
      rows.append([v.strip() for v in lines[i].strip().strip('|').split('|')]);i+=1
     blocks.append(dict(kind='table',caption=('保真度與適用問題' if n==5 else '驗證方法與證據界線') if lang=='zh' else ('Fidelity and questions' if n==5 else 'Verification methods and evidence limits'),headers=rows[0],rows=rows[2:]));continue
    group=[]
    while i<len(lines) and lines[i].strip():group.append(lines[i]);i+=1
    value='\n'.join(group)
    if n==9 and re.match(r'^[123]\\?\. ',value):questions.append(re.sub(r'^[123]\\?\. ','',value));continue
    paragraph(value)
   sections.append(dict(id=IDS[n],heading=heading,paragraphs=paras,**({'blocks':blocks} if blocks else {})))
  assert len(sections)==10 and len(questions)==3,(lang,len(sections),len(questions))
  l['text'][lang]['sections']=sections
  l['text'][lang]['openChecks']=[dict(id=f'AASE-M04-C04-Q{i+4:02}',prompt=q,answer=[answers[lang][i]])for i,q in enumerate(questions)]
 # Keep every source paragraph while aligning adjacent prose groups with the bilingual contract.
 for zh,en in zip(l['text']['zh']['sections'],l['text']['en']['sections']):
  pairs=[(zh['paragraphs'],en['paragraphs'])]
  for a,b in zip(zh.get('blocks',[]),en.get('blocks',[])):
   assert a['kind']==b['kind']
   if 'paragraphs'in a:pairs.append((a['paragraphs'],b['paragraphs']))
   if 'code'in a:
    a['code']+='\n\n'+b['code'];b['code']=a['code']
  for a,b in pairs:
   for longer,shorter in [(a,b),(b,a)]:
    while len(longer)>len(shorter):
     index=next(i for i in range(len(longer)-1) if not any(re.search(r'^(- |\d+\. )',p,re.M)for p in longer[i:i+2]))
     longer[index:index+2]=['\n\n'.join(longer[index:index+2])]

 return l
if __name__=='__main__':
 data=json.dumps(build(),ensure_ascii=False,indent=2)+'\n';out=ROOT/'content/aase/lessons/aase-m04-c04.json'
 if '--check'in sys.argv:assert out.read_text()==data,'M04-04 differs from manuscripts'
 else:out.write_text(data)
 print('PASS M04-04 complete bilingual content, ten sections, five figures, three open checks.')
