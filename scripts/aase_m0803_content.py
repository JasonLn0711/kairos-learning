"""Generate M08-03 from preserved bilingual manuscripts."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m08-03/replacement-2026-11-11'
IDS=['intro','map','rule','delivery','analogy','cases','example','misread','run','principles','understanding']

def parse(raw,lang,codes):
 sections=[];section=None;pending=[];table=code=0
 def flush():
  if not pending:return
  value='\n\n'.join(pending);pending.clear()
  if not section['paragraphs']:section['paragraphs']=[value]
  else:section['blocks'].append(dict(kind='prose',paragraphs=[value]))
 lines=raw.splitlines();i=0
 while i<len(lines):
  line=lines[i].strip()
  if not line:i+=1;continue
  if line.startswith('## '):
   if section:flush()
   section=dict(id=IDS[len(sections)],heading=line[3:],paragraphs=[],blocks=[]);sections.append(section);i+=1;continue
  if line.startswith('### '):flush();pending.append(line);flush();i+=1;continue
  if line.startswith('@figure'):
   flush();n=int(line[-1]);section['blocks'].append(figures[lang][n-1]);i+=1;continue
  if line.startswith('@code'):
   flush();n=int(line[5:]);code+=1;section['blocks'].append(dict(kind='step',heading=f'Code {code}' if lang=='en' else f'程式與指令 {code}',paragraphs=['Follow this section to run or interpret this example.' if lang=='en' else '依本節說明執行或判讀此範例。'],code=codes[n]));i+=1;continue
  if line.startswith('```'):
   flush();values=[];i+=1
   while i<len(lines) and not lines[i].startswith('```'):values.append(lines[i]);i+=1
   code+=1;section['blocks'].append(dict(kind='step',heading=f'程式與指令 {code}',paragraphs=['依本節說明執行或判讀此範例。'],code='\n'.join(values)));i+=1;continue
  if line.startswith('|'):
   flush();rows=[]
   while i<len(lines) and lines[i].strip().startswith('|'):rows.append([x.strip() for x in lines[i].strip().strip('|').split('|')]);i+=1
   table+=1;section['blocks'].append(dict(kind='table',caption=f'Table {table}' if lang=='en' else f'表 {table}',headers=rows[0],rows=rows[2:]));continue
  values=[]
  while i<len(lines) and lines[i].strip() and not lines[i].startswith(('## ','@figure','@code')):values.append(lines[i]);i+=1
  pending.append('\n'.join(values))
 flush()
 return sections

figures={}
for lang in ['zh','en']:
 zh=lang=='zh'
 def f(kind,caption,description,items):return dict(kind=kind,caption=caption,description=description,items=[dict(title=a,body=b) for a,b in items])
 figures[lang]=[
 f('flow','圖 1｜從規格到測試結果' if zh else 'Figure 1 | From Specification to Test Results','向下箭頭表示設計與執行順序；PASS／FAIL 是同次比對的互斥結果。' if zh else 'Downward arrows show design and execution order; PASS and FAIL are alternative comparison outcomes.',[('1. 業務規格（Spec）','先決定什麼結果才算正確'),('2. 測試情境（Test Cases）','正常、無效、邊界、例外'),('3. pytest 執行測試','準備輸入 → 呼叫程式 → 比對預期結果'),('✓ PASS','符合本次檢查條件'),('✗ FAIL','結果不符合預期，需調查原因')] if zh else [('1. Specification','Decide which result is correct'),('2. Test Cases','Normal, invalid, boundary and exception cases'),('3. Run pytest','Prepare input → call program → compare expected result'),('✓ PASS','Meets the checked conditions'),('✗ FAIL','Unexpected result; investigate the cause')]),
 f('cards','圖 2｜免運門檻示範' if zh else 'Figure 2 | Delivery Threshold','訂單金額為 0～2,000 整數；滿 1,000 免運，否則 60。這是規則示範，沒有執行 Python 或 pytest。' if zh else 'Integer totals from 0 to 2,000: delivery is free at 1,000 or above, otherwise 60. This demonstrates a rule without running Python or pytest.',[('訂單金額','999'),('預期運費','60'),('免運門檻','1000')] if zh else [('Order total','999'),('Expected fee','60'),('Free-delivery threshold','1000')]),
 f('cards','圖 3｜80 字元邊界' if zh else 'Figure 3 | The 80-character Boundary','滑桿只比較 0～100 的長度；仍須檢查型別、去除空白後非空，才能判定完整資料有效。' if zh else 'The slider compares lengths from 0 to 100 only. Type and nonempty-after-trimming checks are still required for full validity.',[('79 字元','應接受'),('80 字元','應接受'),('81 字元','應拒絕')] if zh else [('79 characters','Accept'),('80 characters','Accept'),('81 characters','Reject')])]

lesson=json.loads((P/'prior-lesson.json').read_text());lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
zh=(P/'teaching.zh.md').read_text();codes=re.findall(r'```\n(.*?)\n```',zh,re.S)
assert len(codes)==9
for lang in ['zh','en']:
 sections=parse((P/f'teaching.{lang}.md').read_text(),lang,codes)
 lesson['text'][lang]['sections']=sections
 # Keep workshop runnable checks alongside the expanded output-contract explanation.
 prior=json.loads((P/'prior-lesson.json').read_text())['text'][lang]['sections'][3]['blocks'][0]
 prior['code']=prior['code'].replace('    result = json.loads(export_report(record))','    original = record.copy()\n    result = json.loads(export_report(record))').replace('    assert record["application_id"] == " SYN-001 "','    assert record == original')
 sections[6]['blocks'].append(prior)
 last=sections[-1]
 # Questions remain in visible teaching, with separately disclosed reference reasoning.
 answers=(['可測 1、5、10（接受），0、11、1.5、True、字串與缺值（拒絕）。至少包含上下界及其外側，預期依規格而定。','後端未在接收邊界落實規則；補上直接 API／函式拒絕 11 的測試，並修正共用驗證。','應失敗。pytest.raises(ValueError) 不接受 TypeError；需調查是否為未預期程式缺陷。','不能。另需整合、UI、易用性、資安及實際驗收；記錄各層已驗證與待驗範圍。'] if lang=='zh' else ['Test 1, 5 and 10 as accepted; reject 0, 11, 1.5, True, a string and missing values. Include both boundaries and their adjacent invalid values; derive expectations from the specification.','The backend fails to enforce rules at its receiving boundary. Add a direct API/function test rejecting 11 and fix the shared validation.','Fail the test. pytest.raises(ValueError) does not accept TypeError; investigate an unexpected implementation defect.','No. Integration, UI, usability, security and practical acceptance need their own evidence. Record verified and unverified scope at each layer.'])
 prompts=re.findall(r'(?:問題 [1-4]：|Question [1-4]:).*', (P/f'teaching.{lang}.md').read_text())
 lesson['text'][lang]['openChecks']=[dict(id=f'AASE-M08-C03-Q{n+4:02}',prompt=q,answer=[a]) for n,(q,a) in enumerate(zip(prompts,answers))]
lesson['checks']=[]
# The shared catalog checks full bilingual shape at validation time.
for a,b in zip(lesson['text']['zh']['sections'],lesson['text']['en']['sections']):
 assert [v['kind'] for v in a['blocks']]==[v['kind'] for v in b['blocks']],(a['id'],[v['kind']for v in a['blocks']],[v['kind']for v in b['blocks']])
out=ROOT/'content/aase/lessons/aase-m08-c03.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
if '--check'in sys.argv:assert out.read_text()==data
else:out.write_text(data)
print('M08-03 bilingual content generated')
