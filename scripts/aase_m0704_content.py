"""Build the complete M07-04 bilingual replacement from preserved manuscripts."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'docs/sources/aase/m07-04/replacement-2026-11-11'
IDS=['problem','analogy','cases','implementation','testing','flow','industry','run','misread','understanding']
def parse(raw,lang,figures):
 sections=[];section=None;blocks=[];table=0;code_no=0;lines=raw.splitlines();i=0
 def prose(value):
  if not blocks:section['paragraphs'].append(value)
  elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
  else:blocks.append(dict(kind='prose',paragraphs=[value]))
 while i<len(lines):
  line=lines[i].strip()
  if not line:i+=1;continue
  if line.startswith('## '):
   section=dict(id=IDS[len(sections)],heading=line[3:],paragraphs=[],blocks=[]);sections.append(section);blocks=section['blocks'];i+=1;continue
  if line.startswith('### '):
   # The existing prose renderer supplies semantic h3 without inventing filler.
   prose(line);i+=1;continue
  if line.startswith('@figure'):
   blocks.append(figures[int(line[-1])-1]);i+=1;continue
  if line.startswith('|'):
   rows=[]
   while i<len(lines) and lines[i].strip().startswith('|'):rows.append([v.strip() for v in lines[i].strip().strip('|').split('|')]);i+=1
   table+=1;blocks.append(dict(kind='table',caption=f'{"表" if lang=="zh" else "Table"} {table}',headers=rows[0],rows=rows[2:]));continue
  if line.startswith('```'):
   code=[];i+=1
   while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
   i+=1;code_no+=1
   blocks.append(dict(kind='step',heading=f'{"程式與指令" if lang=="zh" else "Code and commands"} {code_no}',paragraphs=['使用合成資料，依本節說明執行或判讀。' if lang=='zh' else 'Use synthetic data and follow this section to run or interpret the example.'],code='\n'.join(code)));continue
  value=[]
  while i<len(lines) and lines[i].strip():value.append(lines[i]);i+=1
  prose('\n'.join(value))
 for s in sections:
  if not s['blocks']:del s['blocks']
 return sections

def main():
 lesson=json.loads((P/'prior-lesson.json').read_text());lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
 lesson['sourceIds'] += ['python-strings-312','pytest-parametrize','agile-tdd']
 figures=json.loads((P/'figures.json').read_text())
 for lang in ['zh','en']:
  raw=(P/f'teaching.{lang}.md').read_text()
  if lang=='en':
   zh=(P/'teaching.zh.md').read_text()
   code=re.findall(r'```[^\n]*\n(.*?)\n```',zh,re.S)
   for marker,index in [('@rules',0),('@tests',1),('@prompt',3)]:raw=raw.replace(marker,'```\n'+code[index]+'\n```')
  sections=parse(raw,lang,figures[lang]);assert len(sections)==10
  sections[3]['sourceIds']=['python-strings-312']
  sections[4]['sourceIds']=['pytest-parametrize','agile-tdd']
  # Questions use the existing reference-answer disclosure, without duplicated prose.
  last=sections[-1];questions=[v for v in last['blocks'][-1]['paragraphs'] if v.startswith('問題 ' if lang=='zh' else 'Question ')]
  assert len(questions)==3
  last['blocks'][-1]['paragraphs']=[v for v in last['blocks'][-1]['paragraphs'] if v not in questions]
  answers=(['UI 限制只作用於畫面路徑；Agent 能透過 API 繞過畫面。接收資料的程式仍須執行驗證。','batch_id 去除空白後為空，inspector_code 是數字。工廠案例需依自己的 Schema 在接收邊界檢查必填與型別；不能直接套用本課三個收件欄位名稱。','沿用舊結果會把另一版本的資料誤顯示為合格。輸入變更先清除結果，重新檢查目前資料；結果要綁定當次輸入。'] if lang=='zh' else ['UI restrictions apply to the screen path. An Agent may bypass it through an API, so the receiving program must validate the data.','batch_id becomes empty after trimming and inspector_code is a number. Validate required fields and types against the factory’s own Schema at its receiving boundary; do not substitute this lesson’s three intake field names.','Reusing an old result can label another input version as valid. Clear the result when input changes, check the current record again and bind the result to that input.'])
  lesson['text'][lang]['sections']=sections
  lesson['text'][lang]['openChecks']=[dict(id=f'AASE-M07-C04-Q{n+4:02}',prompt=q,answer=[answer]) for n,(q,answer) in enumerate(zip(questions,answers))]
 lesson['checks']=[]
 zh=lesson['text']['zh']['sections'];en=lesson['text']['en']['sections']
 # Code is an identical shared artifact in both languages.
 for a,b in zip(zh,en):
  assert len(a.get('blocks',[]))==len(b.get('blocks',[])),(a['id'],'blocks')
  assert len(a['paragraphs'])==len(b['paragraphs']),(a['id'],'paragraphs',len(a['paragraphs']),len(b['paragraphs']))
  for x,y in zip(a.get('blocks',[]),b.get('blocks',[])):
   assert x['kind']==y['kind'],(a['id'],x['kind'],y['kind'])
   if 'paragraphs'in x:assert len(x['paragraphs'])==len(y['paragraphs']),(a['id'],x['kind'],len(x['paragraphs']),len(y['paragraphs']))
   if 'code'in x:y['code']=x['code']
 out=ROOT/'content/aase/lessons/aase-m07-c04.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
 if '--check'in sys.argv:assert out.read_text()==data
 else:out.write_text(data)
 print('PASS: ten complete bilingual sections, four diagrams, four tables, six code blocks and three reference answers')
if __name__=='__main__':main()
