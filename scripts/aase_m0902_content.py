"""Generate M09-02 from preserved bilingual teaching manuscripts."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m09-02/replacement-2026-11-11'
IDS=['reader','analogy','example','clean','industries','checklist','review']

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
  if not line:i+=1;continue
  if line.startswith('## '):
   if section:flush()
   section=dict(id=IDS[len(sections)],heading=line[3:],paragraphs=[],blocks=[]);sections.append(section);i+=1;continue
  if line.startswith('### '):flush();pending.append(line);flush();i+=1;continue
  if line.startswith('@figure'):
   flush();section['blocks'].append(figures[int(line[-1])-1]);i+=1;continue
  if line.startswith('@code'):
   flush();n=int(line[5:]);section['blocks'].append(dict(kind='step',heading=f'Code {n+1}' if lang=='en' else f'程式與指令 {n+1}',paragraphs=['Illustrative commands; use the prerequisites stated above.' if lang=='en' else '示意命令，使用前先核對本節前提。'],code=codes[n]));i+=1;continue
  if line.startswith('```'):
   flush();values=[];i+=1
   while i<len(lines) and not lines[i].startswith('```'):values.append(lines[i]);i+=1
   section['blocks'].append(dict(kind='step',heading=f'程式與指令 {code+1}',paragraphs=['示意命令，使用前先核對本節前提。'],code='\n'.join(values)));code+=1;i+=1;continue
  if line.startswith('|'):
   flush();rows=[]
   while i<len(lines) and lines[i].strip().startswith('|'):rows.append([x.strip() for x in lines[i].strip().strip('|').split('|')]);i+=1
   table+=1;section['blocks'].append(dict(kind='table',caption=f'Table {table}' if lang=='en' else f'表 {table}',headers=rows[0],rows=rows[2:]));continue
  values=[]
  while i<len(lines) and lines[i].strip() and not lines[i].startswith(('## ','### ','@figure','@code','```','|')):values.append(lines[i]);i+=1
  pending.append('\n'.join(values))
 flush();assert len(sections)==7
 return sections

def generate():
 lesson=json.loads((P/'prior-lesson.json').read_text());lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
 zh=(P/'teaching.zh.md').read_text();codes=re.findall(r'```\n(.*?)\n```',zh,re.S);assert len(codes)==2
 titles={
 'zh':['說明專案用途、使用對象與適用範圍','列出需要的作業系統、軟體版本與依賴','提供正確的安裝、測試與啟動命令','提供測試資料、預期結果與實測紀錄','清楚區分已驗證功能和未驗證事項','記錄已知限制、風險與不能使用的情境','說明錯誤處理、停止服務與資料清理','讓另一個人從乾淨環境獨立重現'],
 'en':['Explain purpose, intended users and scope','List required operating systems, versions and dependencies','Provide correct install, test and startup commands','Provide test data, expected results and execution records','Separate verified features from unverified items','Record known limits, risks and excluded uses','Explain error handling, shutdown and data cleanup','Have another person reproduce it independently in a clean environment']}
 for lang in ['zh','en']:
  iszh=lang=='zh'
  def figure(kind,caption,description,items):return dict(kind=kind,caption=caption,description=description,items=[dict(title=a,body=b) for a,b in items])
  figures=[figure('flow','圖 1｜從製作者到接手者的四階段' if iszh else 'Figure 1 | Four Stages from Maker to Successor','箭頭表示文件閱讀與交付順序，不表示已通過驗收。' if iszh else 'Arrows show the reading and delivery sequence, not passed acceptance.', [('定位：這是什麼？','用途、使用對象、功能範圍、版本'),('重建：怎麼讓它跑起來？','環境、依賴套件、安裝與啟動命令'),('驗收：怎麼知道它真的正常？','測試資料、操作步驟、預期結果、實際證據'),('交接：發生問題或結束使用怎麼辦？','已知限制、錯誤處理、復原、停止、清理')] if iszh else [('Locate: what is it?','Purpose, intended users, scope and version'),('Rebuild: how do I run it?','Environment, dependencies, installation and startup commands'),('Accept: how do I know it works?','Test data, steps, expected results and actual evidence'),('Hand over: what about failures or shutdown?','Known limits, error handling, recovery, shutdown and cleanup')]),figure('cards','圖 2｜交接完成度自我檢查' if iszh else 'Figure 2 | Handoff Document Self-check','勾選只表示文件盤點；0 / 8 是初始狀態，不代表軟體品質、正式驗收或獨立交接通過。' if iszh else 'Selections track document review only. The initial 0 / 8 is not software quality, production acceptance or passed independent handoff.',[(v,'文件盤點項目' if iszh else 'Document review item')for v in titles[lang]])]
  sections=parse((P/f'teaching.{lang}.md').read_text(),lang,codes,figures)
  prior=lesson['text'][lang]['sections']
  # Preserve the actual workshop instructions under a separate project boundary.
  old=next(s for s in prior if s['id']=='example')
  sections.append(dict(id='workshop',heading='延伸操作｜既有工作坊重現範例' if iszh else 'Further Practice | Reproduce the Existing Workshop',paragraphs=['以下是既有 Streamlit 工作坊的實際目錄與命令，與餐廳 CSV 示意專案分開使用。只在取得指定版本資源包後依序核對。' if iszh else 'The following directories and commands belong to the existing Streamlit workshop, separate from the illustrative restaurant CSV project. Use them only with the specified resource-package version.'],blocks=old['blocks']))
  sections.append(dict(id='limits',heading='停止、復原與下一個決策' if iszh else 'Shutdown, Recovery and the Next Decision',paragraphs=next(s for s in prior if s['id']=='limits')['paragraphs']))
  lesson['text'][lang]['sections']=sections
  prompts=(['這份 README 至少缺少哪四種重要資訊？','如果研究助理無法執行，但你自己可以，該如何判斷究竟是環境問題、程式問題，還是交接文件問題？','如果研究助理成功產出摘要，是否就能宣稱這套 AI 已經適合醫院或銀行正式使用？為什麼？']if iszh else ['Which four or more important kinds of information are missing from this README?','If the assistant cannot run it but you can, how would you investigate environment, program and handoff-document issues?','If the assistant generates summaries successfully, can the AI be declared ready for production in hospitals or banks? Why?'])
  answers=(['至少補上用途與範圍、環境及版本、依賴與起始目錄、安裝及啟動命令、測試資料與預期結果、實測紀錄、已知限制、停止與復原。依實際交付核對，不靠作者記憶。','先固定同一程式版本與合成輸入，記錄兩邊平台、Python／套件版本、工作目錄、命令與完整錯誤。從新目錄依 README 重建；若缺了安裝或路徑說明就補文件，若相同條件仍輸出錯誤就調查程式。保留獲協助處，修正後重跑，才能縮小原因，不能只憑作者能跑就斷言。','不能。產出摘要只證明該次功能情境；摘要品質、隱私、權限、安全、維運與目標領域驗收各需相應證據。100 篇作者實測與另一人成功重現也不能代填這些驗證。']if iszh else ['Include at least purpose and scope, environment and versions, dependencies and starting directory, install/startup commands, test data and expectations, execution evidence, known limits, shutdown and recovery. Match actual delivery rather than author memory.','Fix the same program version and synthetic input. Record platforms, Python/package versions, working directories, commands and complete errors. Rebuild from a new directory using README. Correct missing installation/path instructions; investigate the program if the same conditions still produce wrong output. Retain assistance and rerun after changes to narrow the cause. Author success alone does not establish the diagnosis.','No. Producing summaries supports only the tested functional scenario. Summary quality, privacy, permissions, security, operations and domain-specific acceptance require their own evidence. Neither 100 author-generated summaries nor successful successor reproduction fills those gaps.'])
  lesson['text'][lang]['openChecks']=[dict(id=f'AASE-M09-C02-Q{n+4:02}',prompt=q,answer=[a])for n,(q,a)in enumerate(zip(prompts,answers))]
  lesson['text'][lang]['summary']='用餐廳訂單案例理解定位、重建、驗收與交接，分清三種成功證據，讓 README 支持接手者獨立操作。'if iszh else 'Use a restaurant order example to locate, rebuild, accept and hand over a project, separating three evidence layers so README supports independent operation.'
 out=ROOT/'content/aase/lessons/aase-m09-c02.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
 if '--check'in sys.argv:assert out.read_text()==data
 else:out.write_text(data)
 print('PASS: M09-02 bilingual manuscripts synchronized.')
if __name__=='__main__':generate()
