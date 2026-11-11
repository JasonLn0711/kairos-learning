"""Compile the preserved M07-06 manuscripts using the existing AASE blocks."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/aase/m07-06/replacement-2026-11-11'
IDS=['review','analogy','diff-example','diff','evidence','decision','record','decisions','misconceptions','understanding']
def parse(lang):
    raw=(SOURCE/f'teaching.{lang}.md').read_text();chunks=re.split(r'(?m)^## ',raw)
    figures=json.loads((SOURCE/'figures.json').read_text())[lang];sections=[];code_count=0;table_count=0
    for sid,chunk in zip(IDS,chunks,strict=True):
        lines=chunk.strip().splitlines();heading=lines.pop(0).lstrip('# ');blocks=[];paragraphs=[];i=0
        def prose(value):
            if not blocks:paragraphs.append(value)
            elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
            else:blocks.append(dict(kind='prose',paragraphs=[value]))
        while i<len(lines):
            line=lines[i].strip()
            if not line:i+=1;continue
            if line.startswith('@figure'):
                blocks.append(figures[int(line[-1])-1]);i+=1;continue
            if line.startswith('```'):
                code=[];i+=1
                while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
                assert i<len(lines),'Unclosed code fence';i+=1;code_count+=1
                blocks.append(dict(kind='step',heading=f'{"範例" if lang=="zh" else "Example"} {code_count}',paragraphs=['教學用程式／命令／輸出；執行情境與限制見相鄰解說。'if lang=='zh'else'Teaching code, commands or output; execution conditions and limits are explained alongside.'],code='\n'.join(code)));continue
            if line.startswith('|'):
                rows=[]
                while i<len(lines)and lines[i].strip().startswith('|'):
                    rows.append([x.strip()for x in lines[i].strip().strip('|').split('|')]);i+=1
                table_count+=1;blocks.append(dict(kind='table',caption=f'{"表"if lang=="zh"else"Table"} {table_count}',headers=rows[0],rows=rows[2:]));continue
            value=[]
            while i<len(lines)and lines[i].strip() and not lines[i].startswith(('```','@figure','|')):value.append(lines[i]);i+=1
            assert value
            prose('\n'.join(value))
        assert paragraphs
        sections.append(dict(id=sid,heading=heading,paragraphs=paragraphs,**({'blocks':blocks}if blocks else{})))
    assert code_count==11 and table_count==5,(code_count,table_count)
    return sections
lesson=json.loads((SOURCE/'prior-lesson.json').read_text())
lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11',checks=[])
for lang in ['zh','en']:lesson['text'][lang]['sections']=parse(lang)
# Natural translation may split a paragraph differently; merge adjacent prose only.
def align(a,b):
    if isinstance(a,dict):
        assert a.keys()==b.keys(),(a.keys(),b.keys())
        for key in a:
            if key=='paragraphs':
                target=min(len(a[key]),len(b[key]))
                for value in [a[key],b[key]]:
                    if len(value)>target:value[target-1:]=['\n\n'.join(value[target-1:])]
            elif key=='code':b[key]=a[key]
            else:align(a[key],b[key])
    elif isinstance(a,list):
        assert len(a)==len(b),(len(a),len(b),str(a)[:120],str(b)[:120])
        for x,y in zip(a,b):align(x,y)
align(lesson['text']['zh']['sections'],lesson['text']['en']['sections'])
questions={
'zh':[
('你會先檢查哪些 Git 位置？為什麼只執行 git diff 不夠？',['先以 git status --short 定位工作區、暫存區與未追蹤檔案，再分別查看 git diff、git diff --cached、git diff HEAD，並打開 tests/。','本例 app.py 未暫存、rules.py 已暫存；普通 git diff 會漏掉暫存區與未追蹤內容。若 Agent 已提交，另以 git log／git show 審查相關提交。']),
('5 passed 能否證明報告匯出正確？還需要什麼證據？',['不能。紀錄只支持在 /project/slices/01-form 的該批測試通過；先核對實際測試名稱、內容與執行範圍。','補上缺漏證明不得產生「審核完成」報告的匯出測試，以及文件齊備的正常案例、邊界案例與實際下載內容核對。未跑的檢查仍標為待驗。']),
('你會接受、要求修正還是延後？請說明原因。',['要求修正：匯出前 validate() 被移除，核心驗收要求尚未獲得支持；不能以表單測試全綠接受。','在本次範圍恢復或實作等效的匯出驗證，保留無關工作，重跑相關測試及下載核對後再決策。新需求才另列延後；不得把原承諾缺陷直接延後。'])],
'en':[
('Which Git locations would you inspect first, and why is git diff alone insufficient?',['Use git status --short to locate working-tree, staged and untracked changes. Review git diff, git diff --cached and git diff HEAD, and open tests/ separately.','Here app.py is unstaged and rules.py is staged; ordinary git diff misses staged and untracked content. If the Agent already committed, inspect relevant commits with git log and git show.']),
('Does 5 passed establish correct export? What additional evidence is needed?',['No. The log supports only that test batch in /project/slices/01-form. Inspect the actual test names, contents and execution scope.','Add export tests proving missing documents prevent a “Review complete” report, plus a complete-document success case, boundary cases and checks of actual downloaded content. Unexecuted checks remain pending.']),
('Would you accept, request revision or defer? Explain your decision.',['Request revision: pre-export validate() was removed and the core acceptance condition lacks supporting evidence. Passing form tests cannot justify acceptance.','Restore or implement equivalent export validation within the task scope, preserve unrelated work, then rerun relevant tests and download checks before deciding again. Defer new requirements separately, rather than deferring a defect in the original promise.'])]}
for lang in ['zh','en']:
    lesson['text'][lang]['openChecks']=[dict(id=f'AASE-M07-C06-Q{i+4:02}',prompt=p,answer=a)for i,(p,a)in enumerate(questions[lang])]
    for section in lesson['text'][lang]['sections']:
        if section['id']=='diff':section['sourceIds']=['git-diff']
        if section['id']=='decision':section['sourceIds']=['owasp-agent-security']
out=ROOT/'content/aase/lessons/aase-m07-c06.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
if '--check'in sys.argv:assert out.read_text()==data,'Lesson is not synchronized'
else:out.write_text(data)
print('PASS: complete bilingual M07-06, 10 sections, 5 figures, 5 other tables, 11 code blocks and 3 open checks')
