"""Preserve the paired M03-05 manuscript in the validated sourceBody model."""
from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'docs/sources/m03-05'
models=json.loads((SRC/'diagram-models.json').read_text())
def cells(s):return [c.strip().replace(r'\|','|') for c in re.split(r'(?<!\\)\|',s.strip('|'))]
def parse(lang,suffix):
 blocks=[];lines=(SRC/f'M03-05-teaching.{suffix}.md').read_text().splitlines();i=0
 while i<len(lines):
  s=lines[i].strip();i+=1
  if not s:continue
  s=s.replace('**','')
  if s.startswith('```'):
   code=[]
   while i<len(lines) and not lines[i].strip().startswith('```'):code.append(lines[i]);i+=1
   i+=1;blocks.append(dict(kind='code',text='\n'.join(code)));continue
  if s.startswith('|'):
   rows=[cells(s)]
   while i<len(lines) and lines[i].strip().startswith('|'):
    row=lines[i].strip();i+=1
    if re.fullmatch(r'[| :\-]+',row):continue
    rows.append(cells(row))
   blocks.append(dict(kind='table',headers=rows[0],rows=rows[1:]));continue
  if s.startswith(('## ','### ')):
   title=re.sub(r'^#{2,3} ','',s)
   if re.match(r'^\d+',title):ident='section-'+re.match(r'^\d+',title)[0]
   elif title.startswith('A.'):ident='section-5-proxy'
   elif title.startswith('B.'):ident='section-5-backport'
   else:ident='sources'
   blocks.append(dict(kind='heading',id=ident,text=title));continue
  blocks.append(dict(kind='paragraph',text=s.removeprefix('# ')))
 for before,key in [('section-5','evidence'),('section-5-backport','proxy')]:
  at=next(i for i,b in enumerate(blocks) if b.get('id')==before);blocks.insert(at,models[key][lang])
 for chunk in (SRC/f'M03-05-answers.{suffix}.md').read_text().split('\n## ')[1:]:
  head,*paras=chunk.strip().split('\n\n');ident,title=re.split(r'｜|\s*\|\s*',head,maxsplit=1)
  blocks.append(dict(kind='answer',id=ident.strip(),summary=('參考解答：' if lang=='zh' else 'Reference answer: ')+title.strip(),paragraphs=paras))
 return dict(summary='從連接埠名稱、服務回應到內部套件紀錄，建立有證據的服務版本與修補判斷。' if lang=='zh' else 'Connect port labels, service responses and internal package records to evidence-based service-version and patch assessments.',sections=[],sourceBody=blocks)
lesson=dict(id='M03-05',revision=1,contentVersion='1.0.0',date='2026-11-03',status='published',publishedOn='2026-11-03',qa=[],text={lang:parse(lang,suf) for lang,suf in [('zh','zh-TW'),('en','en')]})
p=ROOT/'content/concepts/m03-05.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert p.read_text()==data
else:p.write_text(data)
