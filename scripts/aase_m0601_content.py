"""Generate M06-01 from its full bilingual manuscripts and fixed figure models."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m06-01/replacement-2026-11-11'
IDS=['questions','analogy','compare','runtime','trace','industries','c4','record','understanding']
def generate():
 lesson=json.loads((P/'prior-lesson.json').read_text());lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11');lesson['checks']=[];lesson['sourceIds'].append('c4-levels')
 figures=json.loads((P/'figures.json').read_text())
 for lang in ['zh','en']:
  chunks=re.split(r'^## ',(P/f'teaching.{lang}.md').read_text(),flags=re.M);sections=[]
  for n,chunk in enumerate(chunks):
   lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ')
   if n==0:heading='操作與結構各回答什麼問題？' if lang=='zh' else 'What do actions and structure each explain?'
   paragraphs=[];blocks=[];i=0;subheading=None
   while i<len(lines):
    line=lines[i].strip()
    if not line:i+=1;continue
    if line.startswith('### '):subheading=line[4:];i+=1;continue
    if line.startswith('@figure '):blocks.append(figures[lang][int(line.split()[1])-1]);i+=1;continue
    if line.startswith('|'):
     rows=[]
     while i<len(lines)and lines[i].strip().startswith('|'):rows.append([x.strip()for x in lines[i].strip().strip('|').split('|')]);i+=1
     blocks.append(dict(kind='table',caption=('表｜' if lang=='zh' else 'Table | ')+heading,headers=rows[0],rows=rows[2:]));continue
    if line.startswith('```'):
     i+=1;code=[]
     while i<len(lines)and not lines[i].startswith('```'):code.append(lines[i]);i+=1
     assert i<len(lines),'unclosed code';i+=1
     blocks.append(dict(kind='step',heading='rules.py' if 'def validate' in '\n'.join(code)else 'app.py',paragraphs=['同目錄的獨立練習檔；兩者在一個程序執行。' if lang=='zh' else 'Separate practice file in the same directory; both run in one process.'],code='\n'.join(code).rstrip()));continue
    parts=[]
    while i<len(lines)and lines[i].strip()and not lines[i].startswith(('### ','@figure ','|','```')):parts.append(lines[i]);i+=1
    value='\n'.join(parts)
    if subheading:blocks.append(dict(kind='step',heading=subheading,paragraphs=[value]));subheading=None
    elif not blocks:paragraphs.append(value)
    elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
    else:blocks.append(dict(kind='prose',paragraphs=[value]))
   assert not subheading,subheading
   sections.append(dict(id=IDS[n],heading=heading,paragraphs=paragraphs,**({'blocks':blocks}if blocks else {})))
  assert len(sections)==9
  for s in sections:
   if s['id']=='runtime':s['sourceIds']=['streamlit-architecture']
   if s['id']=='c4':s['sourceIds']=['c4-context','c4-container','c4-levels']
  lesson['text'][lang]['sections']=sections
 questions={
 'zh':[
 ('一個購物網站的流程是「選商品 → 加入購物車 → 結帳」。你想知道付款資料有沒有傳到第三方公司，應該看哪一種圖？',['User Flow','System Architecture','只看畫面設計'],['操作流程說明人如何完成任務，沒有完整描述資料接收者。','架構圖應標示外部系統、傳送的資料與責任邊界，可追蹤付款資料去向。','畫面只能顯示可見操作，無法證明後端資料流。']),
 ('AI 幫你建立了 app.py、rules.py、export.py 三個檔案。是否可以直接宣稱系統包含三個獨立服務？',['可以，一個檔案就是一個服務','不可以，要確認實際執行與通訊邊界','可以，只要用了 Python'],['檔案拆分可以只是同一程序內的模組。','需查核程序啟動方式與通訊；三個檔案不足以判定三個服務。','程式語言本身不決定服務數量。']),
 ('原本單人使用的程式要改成 100 人共同使用，畫面與操作完全相同。最應優先確認的是？',['按鈕顏色是否一致','使用者權限、資料隔離、併發與維運能力','是否可以增加更多動畫'],['外觀一致無法確認共用版的資料及容量責任。','使用規模改變，需要驗證授權、隔離、資源使用與失敗復原。','動畫不回答多人共用帶來的架構問題。'])],
 'en':[
 ('A shopping flow is Select products → Add to cart → Checkout. Which diagram helps determine whether payment data reaches a third party?',['User Flow','System Architecture','Screen design alone'],['The action sequence does not fully identify data recipients.','Architecture should identify external systems, transferred data and responsibilities so payment data can be traced.','Screens cannot establish backend data flows.']),
 ('AI creates app.py, rules.py and export.py. Can you immediately claim that the system has three independent services?',['Yes, each file is a service','No; inspect actual execution and communication boundaries','Yes, as long as it uses Python'],['Files can be modules inside one process.','Inspect process startup and communication; three files do not establish three services.','The language does not determine service count.']),
 ('A single-user program will serve 100 people with the same screens and actions. What should you prioritize?',['Consistent button colors','Permissions, data isolation, concurrency and operations','More animations'],['Visual consistency does not establish shared-data or capacity responsibilities.','A change in scale requires checking authorization, isolation, resource use and recovery.','Animation does not answer shared-use architecture questions.'])]}
 for i in range(3):lesson['checks'].append(dict(id=f'AASE-M06-C01-Q{i+4:02}',answer=1,text={lang:dict(prompt=questions[lang][i][0],options=questions[lang][i][1],rationales=questions[lang][i][2])for lang in ['zh','en']}))
 return lesson
if __name__=='__main__':
 value=json.dumps(generate(),ensure_ascii=False,indent=2)+'\n';dest=ROOT/'content/aase/lessons/aase-m06-c01.json'
 if '--check'in sys.argv:assert dest.read_text()==value,'lesson differs from manuscripts'
 else:dest.write_text(value)
 print('PASS: full bilingual manuscripts, nine sections, five figures and three three-option checks.')
