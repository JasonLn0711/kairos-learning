"""Build the source-faithful bilingual M08-06 replacement."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m08-06/replacement-2026-11-11'
IDS=['intro','negative','analogy','matrix','future','regression','testing','evidence','industries','close']
report=(P/'report.py').read_text().rstrip();test=(P/'test_report.py').read_text().rstrip()
command='python -m venv .venv\nsource .venv/bin/activate\npython -m pip install pytest\npython -m pytest -q'

def figure(lang):
 zh=lang=='zh'
 pairs=[('1. 需求與風險','什麼事情絕對不能發生？'),('2. 設計負向情境','故意提供不合法輸入、錯誤狀態或未授權操作'),('3. 執行測試並留下證據','比較預期結果與實際結果'),('4. 定位問題與修正','找出根因，進行最小必要修改'),('5. 回歸測試與交接','重測原本問題與相關正常功能，留下版本及結果')] if zh else [('1. Requirements and risks','What must never happen?'),('2. Design negative scenarios','Supply invalid input, incorrect state or unauthorized operations'),('3. Execute tests and retain evidence','Compare expected and actual results'),('4. Locate and repair the problem','Find the cause and make the smallest necessary change'),('5. Regression tests and handoff','Retest the original issue and related normal behavior; retain the version and results')]
 return dict(kind='flow',caption='圖 1｜從風險到回歸證據' if zh else 'Figure 1 | From Risk to Regression Evidence',description='向下箭頭表示五個工作的先後順序；最後一格是回歸與交接工作，不代表測試已通過。' if zh else 'Downward arrows show the order of five activities. The final box represents regression and handoff work, not a passing test result.',items=[dict(title=a,body=b)for a,b in pairs])

def parse(raw,lang,codes):
 for name,value in [('report',report),('test',test),('command',command)]:raw=raw.replace('@'+name,'```\n'+value+'\n```')
 # The native checks below retain all original options without duplicating them in prose.
 raw=re.sub(r'(?:問題 1：|Question 1:).*?(?=可在頁末|Use the Understanding)', '',raw,flags=re.S)
 sections=[];section=None;pending=[];table=code=0
 def flush():
  if not pending:return
  values='\n'.join(pending).strip();pending.clear()
  if not values:return
  # Preserve one paragraph per source blank-line group, including list groups.
  paras=[v.strip()for v in re.split(r'\n\s*\n',values)if v.strip()]
  if not section['paragraphs']:section['paragraphs']=[paras.pop(0)]
  if paras:section['blocks'].append(dict(kind='prose',paragraphs=paras))
 lines=raw.splitlines();i=0
 while i<len(lines):
  line=lines[i].strip()
  if line.startswith('## '):
   if section:flush()
   section=dict(id=IDS[len(sections)],heading=line[3:],paragraphs=[],blocks=[]);sections.append(section);i+=1;continue
  if line.startswith('### '):flush();section['blocks'].append(dict(kind='prose',paragraphs=[line]));i+=1;continue
  if line=='@figure':flush();section['blocks'].append(figure(lang));i+=1;continue
  if line.startswith('```'):
   flush();values=[];i+=1
   while i<len(lines)and not lines[i].startswith('```'):values.append(lines[i]);i+=1
   code+=1;section['blocks'].append(dict(kind='step',heading=f'程式與指令 {code}'if lang=='zh'else f'Code and Commands {code}',paragraphs=['依本節說明執行或判讀。'if lang=='zh'else 'Run or interpret this example as described in this section.'],code='\n'.join(values)));i+=1;continue
  if line.startswith('|'):
   flush();rows=[]
   while i<len(lines)and lines[i].strip().startswith('|'):rows.append([v.strip()for v in lines[i].strip().strip('|').split('|')]);i+=1
   table+=1;section['blocks'].append(dict(kind='table',caption=f'表 {table}'if lang=='zh'else f'Table {table}',headers=rows[0],rows=rows[2:]));continue
  pending.append(lines[i]);i+=1
 flush();assert len(sections)==10
 for s in sections:
  if s['id']in ['analogy','future','testing']:s['sourceIds']=[{'analogy':'owasp-threat-model','future':'owasp-authorization','testing':'pytest-assert'}[s['id']]]
  if s['id']=='testing':s['sourceIds'].append('streamlit-apptest-151')
 return sections

lesson=json.loads((P/'previous/lesson.json').read_text());lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
zh=(P/'teaching.zh.md').read_text();codes=re.findall(r'```\n(.*?)\n```',zh,re.S)
for lang in ['zh','en']:
 lesson['text'][lang]['sections']=parse((P/f'teaching.{lang}.md').read_text(),lang,codes)
 lesson['text'][lang]['summary']=('從 ATM、報告匯出與過期狀態理解負向測試，以可執行 Python 範例及回歸紀錄界定安全證據。'if lang=='zh'else 'Understand negative testing through ATMs, report exports and stale state, then bound security evidence with runnable Python and regression records.')
# Keep bilingual structure; equivalent prose may use different natural sentence boundaries.
for a,b in zip(lesson['text']['zh']['sections'],lesson['text']['en']['sections']):
 assert [x['kind']for x in a['blocks']]==[x['kind']for x in b['blocks']],(a['id'],[x['kind']for x in a['blocks']],[x['kind']for x in b['blocks']])
 for x,y in zip(a['blocks'],b['blocks']):
  if x['kind']=='prose' and len(x['paragraphs'])!=len(y['paragraphs']):
   raise AssertionError((a['id'],x['paragraphs'],y['paragraphs']))
questions=[
 ('後端越權的根本原因可能是什麼？','What is the likely root cause of the unauthorized backend access?',1,['畫面設計不夠美觀','後端沒有正確檢查資源授權','資料庫查詢速度不夠快','使用者沒有重新整理畫面'],['The interface is not attractive enough','The backend does not correctly enforce resource authorization','The database query is too slow','The user did not refresh the page'],['外觀不能執行資源授權。','登入後仍須核對該身分對特定資源的權限。','效能無法解釋缺少授權檢查。','重新整理不能補上可信任邊界的控制。'],['Appearance does not enforce resource authorization.','After sign-in, check that identity’s permission for the specific resource.','Performance does not explain the missing authorization check.','Refreshing cannot add a missing trusted-boundary control.']),
 ('修復漏洞後，最合理的測試方式是什麼？','Which test approach is appropriate after the repair?',2,['只確認 A 看不到 B 的資料','只確認系統可以正常登入','確認未授權存取被拒絕，且合法查詢仍可執行','直接刪除原本的測試'],['Only check that A cannot see B’s data in the interface','Only check that sign-in works','Confirm unauthorized access is denied and legitimate queries still work','Delete the original tests'],['畫面隱藏不能驗證直接 API 路徑。','身分驗證通過不代表授權正確。','同時重測原負向案例與受影響的正向功能。','刪測試會失去偵測原問題的能力。'],['Hidden UI does not verify the direct API path.','Authentication passing does not establish correct authorization.','Retest the original negative case and affected positive behavior.','Deleting tests removes detection of the original defect.']),
 ('目前沒有真正的登入與授權功能，該怎麼記錄驗收狀態？','How should acceptance be recorded without real sign-in and authorization?',1,['預設通過','標記未實作、未驗證，保留後續驗收需求','用假帳號測試後宣告正式安全'],['Assume a pass','Mark not implemented and unverified; retain later acceptance requirements','Declare production security after testing fake accounts'],['控制不存在，無法驗證為通過。','清楚保留實作及真實測試身分／資源關係的下一個驗收閘門。','假的帳號標籤無法證明正式存取控制。'],['An absent control cannot pass verification.','Retain implementation and verification with actual test identities and resource relationships as the next gate.','Fake account labels cannot establish production access control.'])]
lesson['checks']=[]
for n,(z,e,answer,zo,eo,zr,er)in enumerate(questions,4):lesson['checks'].append(dict(id=f'AASE-M08-C06-Q{n:02}',answer=answer,text={'zh':dict(prompt=z,options=zo,rationales=zr),'en':dict(prompt=e,options=eo,rationales=er)}))
out=ROOT/'content/aase/lessons/aase-m08-c06.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
if '--check'in sys.argv:assert out.read_text()==data
else:out.write_text(data)
print('PASS: M08-06 bilingual source synchronized')
