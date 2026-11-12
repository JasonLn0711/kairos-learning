from pathlib import Path
import json,re
p=Path(__file__).resolve().parent
lines=(p/'pasted-text-1.txt').read_text().splitlines()
sections=[];current={'id':'p1-introduction','heading':'導言','body':[]};sections.append(current)
i=1;heading=0
while i<len(lines):
 s=lines[i].strip();i+=1
 if not s:continue
 if s.startswith('## '):
  current={'id':f'p1-section-{len(sections):02d}','heading':s[3:],'body':[]};sections.append(current);continue
 if s.startswith('### '):
  heading+=1;current['body'].append({'kind':'heading','id':f'p1-subsection-{heading:02d}','text':s[4:]});continue
 if s.startswith('```'):
  code=[]
  while i<len(lines) and not lines[i].strip().startswith('```'):code.append(lines[i]);i+=1
  i+=1;current['body'].append({'kind':'code','text':'\n'.join(code)});continue
 if s.startswith('|'):
  rows=[s]
  while i<len(lines) and lines[i].strip().startswith('|'):rows.append(lines[i].strip());i+=1
  cells=lambda r:[c.strip() for c in r.strip('|').split('|')]
  current['body'].append({'kind':'table','headers':cells(rows[0]),'rows':[cells(r) for r in rows[2:]]});continue
 if s.startswith('[image](') or s in ['NIST Computer Security Resource Center','OWASP Cheat Sheet Series','NIST','NIST+2','Schneier on Security+1','veracrypt.io','veracrypt.io+1'] or s.startswith('CEH-M20-8題半天精讀-'):continue
 current['body'].append({'kind':'paragraph','text':s})
# This is a source-faithful editorial draft; publication awaits source checking,
# figure substitution, bilingual adoption and removal of simulated UI wording.
(p/'adopted.zh.draft.json').write_text(json.dumps({'title':lines[0][2:],'sections':sections},ensure_ascii=False,indent=2)+'\n')
assert len(sections)==13
assert sum(b['kind']=='heading' for s in sections for b in s['body'])==27
q=next(s for s in sections if s['heading'].startswith('十一'))
assert sum(bool(re.match(r'題 [1-8]｜',b.get('text',''))) for b in q['body'])==8
assert sum(bool(re.match(r'^[A-D]\. ',b.get('text',''))) for b in q['body'])==32
print('Complete Chinese source draft:',len(sections),'sections, 27 subsections, 8 original questions, 32 options.')
