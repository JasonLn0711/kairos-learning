"""Build M04-05 from the complete manuscripts and six paired figure models."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m04-05/replacement-2026-11-11'
IDS=['start','analogy','principles','states','industries','disclosure','changes','counterexamples','observe','deliverables','understanding']
CAPTIONS={2:('表 1｜資訊應放在哪裡','Table 1 | Where information belongs'),4:('表 2｜跨產業資訊安排','Table 2 | Information across industries'),5:('表 3｜兩種揭露的差別','Table 3 | Two disclosure patterns'),8:('表 4｜候選驗收矩陣','Table 4 | Proposed acceptance matrix')}
SOURCES={1:['nng-progressive','nng-accordions'],2:['nng-heuristics'],3:['nng-heuristics'],5:['nng-progressive'],6:['owasp-authorization','owasp-input-validation','mdn-if-match'],7:['wai-color','wai-status','wai-labels-instructions'],8:['govuk-usability']}
def build():
 lesson=json.loads((P/'previous/aase-m04-c05.json').read_text())
 lesson.update(revision=5,contentVersion='1.1.0',date='2026-11-11',checks=[])
 lesson['sourceIds']=list(dict.fromkeys(x for ids in SOURCES.values() for x in ids))
 figures=json.loads((P/'figures.json').read_text())
 version_code=re.search(r'```\n(.*?)\n```',(P/'teaching.zh.md').read_text(),re.S).group(1)
 answers={
 'zh':['上傳、處理中及處理失敗直接影響當下任務，應清楚顯示，並說明失敗後如何重試。模型溫度通常可放進階設定；若使用者正要比較參數效果，則須依其角色與任務調整資訊層級。','違反系統狀態可見性，也讓介面承諾超過業務實際結果。先顯示「請求已送出，等待銀行確認」，取得交易確認後才顯示「轉帳完成」；未確認或逾時時，提供查詢與安全重試指引，避免重複轉帳。','後端在匯出時檢查必填資料、目前使用者的匯出權限，以及驗證版本是否等於當前資料版本；需要重新檢核時拒絕沿用舊結果。測試至少包含先通過再修改／刪除欄位、直接呼叫 API、缺少權限與重新檢核後成功匯出；也要避免檢查與匯出間的資料變更造成競態。'],
 'en':['Upload, processing and processing failure affect the current task and should remain visible, including recovery instructions. Model temperature can usually go in advanced settings. If the task is to compare parameter effects, adjust the information hierarchy for that role and task.','It violates visibility of system status and promises more than the business outcome establishes. Show “Request sent; awaiting bank confirmation” first, and “Transfer complete” only after confirmation. For an unconfirmed or timed-out request, provide status lookup and safe-retry guidance to avoid duplicate transfers.','At export, the backend checks required data, the current user’s export permission and equality of the validated and current data versions. Reject reuse when revalidation is needed. Tests cover passing then changing/deleting a field, direct API calls, missing permission and successful export after revalidation. Also prevent a race in which data changes between validation and export.']}
 for lang in ['zh','en']:
  chunks=re.split(r'^## ',(P/f'teaching.{lang}.md').read_text(),flags=re.M);assert len(chunks)==11
  sections=[];questions=[]
  for n,chunk in enumerate(chunks):
   lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ')
   if n==0:heading='讓使用者在正確時間看見必要資訊' if lang=='zh' else 'Show essential information at the right time'
   section=dict(id=IDS[n],heading=heading,paragraphs=[]);blocks=[];i=0
   def prose(value):
    if not blocks:section['paragraphs'].append(value)
    elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
    else:blocks.append(dict(kind='prose',paragraphs=[value]))
   while i<len(lines):
    line=lines[i].strip()
    if not line:i+=1;continue
    if line.startswith('@figure'):
     blocks.append(figures[lang][int(line[7:])-1]);i+=1;continue
    if line.startswith('|'):
     rows=[]
     while i<len(lines) and lines[i].strip().startswith('|'):
      rows.append([x.strip() for x in lines[i].strip().strip('|').split('|')]);i+=1
     blocks.append(dict(kind='table',caption=CAPTIONS[n][lang=='en'],headers=rows[0],rows=rows[2:]));continue
    if line=='```':
     code=[];i+=1
     while i<len(lines) and lines[i].strip()!='```':code.append(lines[i]);i+=1
     assert i<len(lines);i+=1
     # Code is an identifier-level example, identical in both language editions.
     assert re.findall(r'(?:currentVersion|validatedVersion) = \d+', '\n'.join(code))==re.findall(r'(?:currentVersion|validatedVersion) = \d+',version_code)
     code=version_code
     blocks.append(dict(kind='step',heading='版本比對示意' if lang=='zh' else 'Version comparison example',paragraphs=['3 與 3 相同時允許匯出；資料改為版本 4 後，舊的版本 3 驗證不再適用。此為狀態規則示意，實際匯出仍需後端原子化驗證。' if lang=='zh' else 'Matching versions 3 and 3 allow export. After data becomes version 4, validation for version 3 no longer applies. This illustrates a state rule; actual export still needs an atomic backend check.'],code=code));continue
    value=[]
    while i<len(lines) and lines[i].strip():value.append(lines[i]);i+=1
    value='\n'.join(value)
    if n==10 and (value.startswith('問題') or value.startswith('Question ')):
     while i<len(lines) and not lines[i].strip():i+=1
     prompt=[]
     while i<len(lines) and lines[i].strip():prompt.append(lines[i]);i+=1
     questions.append(value+'｜'+'\n'.join(prompt));continue
    prose(value)
   if blocks:section['blocks']=blocks
   if n in SOURCES:section['sourceIds']=SOURCES[n]
   sections.append(section)
  assert len(questions)==3
  lesson['text'][lang]['sections']=sections
  lesson['text'][lang]['openChecks']=[dict(id=f'AASE-M04-C05-Q{i+4:02}',prompt=q,answer=[answers[lang][i]])for i,q in enumerate(questions)]
 return lesson
if __name__=='__main__':
 lesson=build();target=ROOT/'content/aase/lessons/aase-m04-c05.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
 if '--check' in sys.argv:assert target.read_text()==data,'M04-05 differs from complete manuscripts'
 else:target.write_text(data)
 print('PASS: M04-05 complete paired manuscripts, six figures, four tables, three open checks')
