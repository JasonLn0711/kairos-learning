"""Build the complete bilingual Git lesson from preserved manuscripts."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m09-01/replacement-2026-11-11'
IDS=['intro','history','analogy','diff','commit','restore','lab','applications','mistakes','handoff','understanding']
def parse(raw,lang,codes,figures):
 sections=[];section=None;pending=[];table=code=0
 def flush():
  if not pending:return
  value='\n\n'.join(pending);pending.clear()
  if not section['paragraphs']:section['paragraphs']=[value]
  else:section['blocks'].append(dict(kind='prose',paragraphs=[value]))
 lines=raw.splitlines();i=0
 while i<len(lines):
  line=lines[i].strip()
  if not line or line.startswith('# '):i+=1;continue
  if line.startswith('## '):
   if section:flush()
   section=dict(id=IDS[len(sections)],heading=line[3:],paragraphs=[],blocks=[]);sections.append(section);i+=1;continue
  if section is None:
   section=dict(id=IDS[0],heading='導言'if lang=='zh'else'Introduction',paragraphs=[],blocks=[]);sections.append(section)
  if line.startswith('### '):flush();pending.append(line);flush();i+=1;continue
  if line.startswith('@figure'):
   flush();section['blocks'].append(figures[int(line[7:])-1]);i+=1;continue
  if line.startswith('@code'):
   flush();code+=1;section['blocks'].append(dict(kind='step',heading=f'指令與範例 {code}'if lang=='zh'else f'Commands and Example {code}',paragraphs=['依本節條件執行或判讀；示例指令與實際練習分開。'if lang=='zh'else'Run or interpret under this section’s conditions; distinguish examples from the lab.'],code=codes[int(line[5:])]));i+=1;continue
  if line.startswith('```'):
   flush();values=[];i+=1
   while i<len(lines)and not lines[i].startswith('```'):values.append(lines[i]);i+=1
   code+=1;section['blocks'].append(dict(kind='step',heading=f'指令與範例 {code}',paragraphs=['依本節條件執行或判讀；示例指令與實際練習分開。'],code='\n'.join(values)));i+=1;continue
  if line.startswith('|'):
   flush();rows=[]
   while i<len(lines)and lines[i].strip().startswith('|'):rows.append([x.strip().replace('`','')for x in lines[i].strip().strip('|').split('|')]);i+=1
   table+=1;section['blocks'].append(dict(kind='table',caption=f'表 {table}'if lang=='zh'else f'Table {table}',headers=rows[0],rows=rows[2:]));continue
  values=[]
  while i<len(lines)and lines[i].strip()and not lines[i].startswith(('## ','### ','@figure','@code','```','|')):values.append(lines[i]);i+=1
  assert values,(i,lines[i])
  pending.append('\n'.join(values))
 flush();assert len(sections)==11
 return sections

def figures(lang):
 zh=lang=='zh'
 def f(kind,caption,description,items):return dict(kind=kind,caption=caption,description=description,items=[dict(title=a,body=b)for a,b in items])
 return [f('flow','圖 1｜Git 的四個位置'if zh else'Figure 1 | Four Places in Git','向下箭頭依序表示 git add、git commit、git push；這是簡化的單向路徑。推送到遠端不代表已部署，也不代表測試或驗收通過。'if zh else'Downward arrows label git add, git commit and git push in order. This is a simplified forward path. Push does not establish deployment, passing tests or acceptance.',[
 ('1. 工作區（Working Directory）','你正在修改的草稿\ngit add：挑選本次要歸檔的內容'),('2. 暫存區（Staging Area / Index）','已選定、準備封存的修改\ngit commit：正式建立版本紀錄'),('3. 本機儲存庫（Local Repository）','已封存、可以追溯的版本歷史\ngit push：將提交送往遠端'),('4. 遠端儲存庫（Remote Repository）','例如 GitHub 上的共享版本紀錄')]if zh else[
 ('1. Working Directory','The draft you are editing\ngit add: select content to record'),('2. Staging Area / Index','Selected changes ready to record\ngit commit: record a version'),('3. Local Repository','Recorded, traceable version history\ngit push: send commits to the remote'),('4. Remote Repository','Shared version history, for example on GitHub')]),
 f('cards','圖 2｜預期驗收結果'if zh else'Figure 2 | Expected Acceptance Conditions','四項是同次練習的並列核對條件；勾號表示預期條件，實際成功須檢查檔案與歷史。'if zh else'Four parallel checks for the same exercise. Check symbols denote expected conditions; inspect actual files and history to establish success.',[
 ('slice-notes.md','恢復到原本內容'),('keep.txt','新修改還在'),('slice-notes.backup.md','備份仍存在'),('Commit','原本紀錄仍可查詢')]if zh else[
 ('slice-notes.md','Restored to its original content'),('keep.txt','New edits remain'),('slice-notes.backup.md','Backup still exists'),('Commit','Original history is still available')])]

lesson=json.loads((P/'previous-lesson.json').read_text());lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
zh=(P/'teaching.zh.md').read_text();codes=re.findall(r'```\n(.*?)\n```',zh,re.S);assert len(codes)==10
for lang in ['zh','en']:lesson['text'][lang]['sections']=parse((P/f'teaching.{lang}.md').read_text(),lang,codes,figures(lang))
questions=[
 (1,'你修改了三個程式檔，只想提交其中一個已完成的功能。應該怎麼做？','You edited three program files and want to commit only one completed feature. What should you do?',
 ['直接 git add . 並 Commit','檢查 Diff，只暫存與該功能相關的修改','直接 Push，Git 會自行選擇','先刪除其他檔案'],['Run git add . and commit immediately','Review the diff and stage only changes for that feature','Push directly; Git will choose','Delete the other files first'],
 ['可能把未完成或無關修改一起暫存。','先核對內容，再挑選同一目的的修改。','Push 傳送提交，不替你挑選工作區內容。','應保留其他工作，不需要刪除。'],['This may stage unfinished or unrelated work.','Inspect content, then select changes for one purpose.','Push sends commits; it does not select working-directory edits.','Preserve the other work; deletion is unnecessary.']),
 (1,'已經 Commit 之後，是否代表正式網站上線？','Does making a commit mean the production website is live?',
 ['是，Commit 就是部署','不是，提交、推送、部署與驗收是不同狀態','只要有 GitHub 就一定上線','只要測試通過就一定上線'],['Yes; commit is deployment','No; commit, push, deployment and acceptance are separate states','Having GitHub always means it is live','Passing tests always means it is live'],
 ['提交只建立版本紀錄。','每個狀態都需要對應證據。','遠端儲存庫不等於正式執行環境。','測試通過仍須完成發布與驗收流程。'],['A commit records a version.','Each state requires its own evidence.','A remote repository is not the production runtime.','Passing tests still leaves release and acceptance steps.']),
 (2,'你想恢復 A 檔案，但 B 檔案有尚未提交的重要工作。最佳做法是？','You want to restore file A while file B contains important uncommitted work. What is best?',
 ['git reset --hard，全部清除','直接刪除 A 和 B','先查看狀態與 Diff、保護現況，再指定來源及 A 的路徑進行還原','不用確認直接覆蓋整個專案'],['Use git reset --hard to clear everything','Delete A and B','Inspect status and diffs, protect current work, then restore a specified source and path A','Overwrite the whole project without checking'],
 ['可能遺失 B 的工作。','會破壞需要保留的內容。','明確控制來源、路徑與保留範圍。','缺少範圍確認，可能覆蓋重要工作。'],['This can lose work in B.','This destroys content that must remain.','Control the source, target path and preserved scope.','The scope is unconfirmed and important work may be overwritten.'])]
lesson['checks']=[dict(id=f'AASE-M09-C01-Q{i+4:02}',answer=q[0],text={lang:dict(prompt=q[1 if lang=='zh'else 2],options=q[3 if lang=='zh'else 4],rationales=q[5 if lang=='zh'else 6])for lang in ['zh','en']})for i,q in enumerate(questions)]
for a,b in zip(lesson['text']['zh']['sections'],lesson['text']['en']['sections']):
 assert a['id']==b['id'] and [x['kind']for x in a['blocks']]==[x['kind']for x in b['blocks']],a['id']
 for x,y in zip(a['blocks'],b['blocks']):
  if x['kind']=='step':assert x['code']==y['code']
  if x['kind']=='table':assert len(x['rows'])==len(y['rows'])
data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n';out=ROOT/'content/aase/lessons/aase-m09-c01.json'
if '--check'in sys.argv:assert out.read_text()==data
else:out.write_text(data)
print('PASS: M09-01 complete bilingual lesson synchronized')
