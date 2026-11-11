"""Build the complete M07-01 bilingual manuscripts using existing AASE blocks."""
import json,re,sys,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m07-01/replacement-2026-11-11'
IDS=['start','analogy','layers','commands','diagnosis','gates','misread','recap','understanding']
lesson=json.loads((P/'previous-lesson.json').read_text())
lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11',checks=[])
figures={}
for lang in ['zh','en']:
 raw=(P/f'teaching.{lang}.md').read_text()
 # Turn the three source relationships into one representation each, without duplicated prose.
 analogy=re.search(r'\| (?:餐廳|Restaurant) .*?(?=\n\n)',raw,re.S).group()
 pairs=[[v.strip() for v in row.strip('|').split('|')] for row in analogy.splitlines()][2:]
 raw=raw.replace(analogy,'@figure1')
 start=raw.index('醫院影像分析系統' if lang=='zh' else 'Hospital imaging analysis system')
 end=raw.index('同一部電腦' if lang=='zh' else 'One computer',start)
 values=[p.strip() for p in raw[start:end].split('\n\n') if p.strip()]
 assert len(values)==7
 env=list(zip(values[:6:2],values[1:6:2]));raw=raw[:start]+'@figure2\n\n'+raw[end:]
 start=raw.index('1. 找到正確的專案根目錄' if lang=='zh' else '1. Find the correct project root')
 end=raw.index('\n### ',start)
 steps=re.findall(r'\d\. (.+)\n\n\s+(.+)',raw[start:end]);assert len(steps)==5
 raw=raw[:start]+'@figure3\n'+raw[end:]
 shell=re.search(r'### Linux / macOS\n\n```[^\n]*\n(.*?)```',raw,re.S)
 windows=re.search(r'### Windows PowerShell\n\n(.*?)\n\n```powershell\n(.*?)```',raw,re.S)
 assert shell and windows
 shell_code=shell[1].strip();windows_code=windows[2].strip()
 raw=raw[:shell.start()]+'@figure4'+raw[shell.end():]
 raw=raw.replace(windows[0],windows[1])
 zh=lang=='zh'
 figs=[
 dict(kind='cards',caption='圖 1｜開餐廳與軟體開發的八組對照' if zh else 'Figure 1 | Eight restaurant and development roles',description='每組先列餐廳角色，再列對應軟體角色；寬版左右對照、窄版上下配對，沒有先後箭頭。準備、實作與驗收需分別證明。' if zh else 'Each row pairs a restaurant role with a development role. These are analogies, with no sequence arrows. Preparation, implementation and acceptance need separate evidence.',items=[dict(title=a,body=b) for a,b in pairs]),
 dict(kind='cards',caption='圖 2｜同一部電腦，三個獨立專案環境' if zh else 'Figure 2 | Three independent environments on one computer',description='三個專案平行管理套件，避免更新互相干擾；上下排列不代表執行順序。虛擬環境不提供檔案或網路安全隔離。' if zh else 'The projects manage packages in parallel to avoid interference. Stacking does not indicate execution order. Virtual environments do not provide file or network security isolation.',items=[dict(title=a,body=b)for a,b in env]),
 dict(kind='flow',caption='圖 3｜從定位專案到停止服務的五步流程' if zh else 'Figure 3 | Five steps from project location to shutdown',description='編號與箭頭只表示操作順序；每一步都核對實際結果，啟動骨架不表示功能驗收通過。' if zh else 'Numbers and arrows indicate operating order. Check actual outcomes at each step; skeleton startup does not establish feature acceptance.',items=[dict(title=a,body=b)for a,b in steps]),
 dict(kind='cards',caption='圖 4｜依作業系統建立與啟用環境' if zh else 'Figure 4 | Create and activate for your operating system',description='選擇符合自己系統的一欄；兩欄是替代操作路徑，並非先後步驟。確認 Python 3.11／3.12，再核對執行檔位置。' if zh else 'Choose the column matching your OS. These are alternative paths, not sequential steps. Confirm Python 3.11/3.12, then the executable path. Shared command snippets retain the original Chinese comments.',items=[dict(title='Linux / macOS',body=shell_code),dict(title='Windows PowerShell',body=windows_code)])]
 figures[lang]=figs
 sections=[];table_n=0;code_n=0
 # Only chapter headings outside fenced code split the manuscript.
 chunks=[];current=[];fenced=False
 for line in raw.splitlines():
  if line.startswith('```'):fenced=not fenced
  if line.startswith('## ') and not fenced:
   if chunks or current:chunks.append(current)
   current=[line[3:]]
  else:current.append(line)
 chunks.append(current);chunks=chunks[1:];assert len(chunks)==9
 for n,lines in enumerate(chunks):
  heading=lines[0];blocks=[];paras=([('依序釐清位置、執行者、套件隔離、依賴與工具分工。' if zh else 'Distinguish location, interpreter, package separation, dependencies and tool responsibilities.')] if n==2 else []);i=1;subheading=heading
  def prose(value):
   if not blocks:paras.append(value)
   elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
   else:blocks.append(dict(kind='prose',paragraphs=[value]))
  while i<len(lines):
   line=lines[i].strip()
   if not line:i+=1;continue
   if line.startswith('@figure'):
    blocks.append(figs[int(line[-1])-1]);i+=1;continue
   if line.startswith('### '):
    subheading=line[4:];step=dict(kind='step',heading=subheading,paragraphs=['接著核對命令、用途與實際結果。' if zh else 'Check the commands, their purpose and actual outcomes below.'])
    if n==3 and ('步驟 5' in subheading or 'Step 5' in subheading):step['id']='observe'
    blocks.append(step);i+=1;continue
   if line.startswith('```'):
    value=[];i+=1
    while i<len(lines) and not lines[i].startswith('```'):value.append(lines[i]);i+=1
    assert i<len(lines),'unclosed code fence'
    i+=1;code_n+=1
    blocks.append(dict(kind='step',heading=('範例 '+str(code_n)+'｜' if zh else 'Example '+str(code_n)+' | ')+subheading,paragraphs=['依本節用途執行或保存；輸出以實際執行為準。' if zh else 'Run or save this example for the purpose described. Record actual output. Shared templates retain the original Chinese field labels and comments.'],code='\n'.join(value).strip()));continue
   if line.startswith('|'):
    rows=[]
    while i<len(lines) and lines[i].strip().startswith('|'):rows.append([v.strip()for v in lines[i].strip().strip('|').split('|')]);i+=1
    table_n+=1;blocks.append(dict(kind='table',caption=('表 ' if zh else 'Table ')+str(table_n)+'｜'+heading,headers=rows[0],rows=rows[2:]));continue
   value=[]
   while i<len(lines) and lines[i].strip() and not lines[i].startswith(('### ','@figure')):value.append(lines[i].strip());i+=1
   prose('\n'.join(value))
  section=dict(id=IDS[n],heading=heading,paragraphs=paras,**({'blocks':blocks}if blocks else {}))
  if n in [2,6]:section['sourceIds']=['python-venv']
  if n==3:section['sourceIds']=['python-venv','pytest-usage']
  sections.append(section)
 lesson['text'][lang]['sections']=sections
 lesson['text'][lang]['openChecks']=[dict(id=f'AASE-M07-C01-Q{i+4:02}',prompt=q,answer=[a]) for i,(q,a) in enumerate(([
 ('問題 1｜目前可以宣稱哪個階段完成？','B。環境建置與起始骨架啟動成功，只支持 G1／G2；成績統計與 Excel 匯出尚未實作，G3 尚未驗收。'),
 ('問題 2｜虛擬環境能阻止讀取其他資料夾嗎？','B。不正確，venv 主要隔離 Python 套件環境。檔案與網路權限需另外控制。'),
 ('問題 3｜顯示 pytest 版本代表測試全部通過嗎？','B。不可以。還需要適當測試案例、真正執行測試並檢查結果；版本輸出只支持工具可呼叫。')
 ]if zh else[
 ('Question 1 | Which stage can you report as complete?','B. Environment setup and skeleton startup support G1/G2 only. Grade statistics and Excel export are unimplemented; G3 has not been accepted.'),
 ('Question 2 | Does a virtual environment prevent access to other directories?','B. No. venv mainly separates Python package environments. File and network permissions need separate controls.'),
 ('Question 3 | Does a pytest version establish that all tests passed?','B. No. Appropriate test cases, actual test execution and inspection of results are still required. Version output establishes only that the tool can be invoked.')]))]
 assert table_n==4 and code_n==16,(table_n,code_n)
 assert [len(f['items'])for f in figs]==[8,3,5,2]
output=ROOT/'content/aase/lessons/aase-m07-c01.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
if '--check'in sys.argv:assert output.read_text()==data,'lesson differs from manuscripts'
else:output.write_text(data)
print('PASS: nine sections, five concepts, five operating steps, four tables, four figures and three supplied questions in each language.')
