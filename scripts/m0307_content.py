"""Preserve the paired M03-07 manuscript in the validated sourceBody model."""
from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'docs/sources/m03-07'
models=json.loads((SRC/'diagram-models.json').read_text())
def cells(s):return [c.strip().replace(r'\|','|') for c in re.split(r'(?<!\\)\|',s.strip('|'))]
def parse(lang,suffix):
 sections=iter(json.loads((SRC/'detailed-section-map.json').read_text())); heading_index=0
 blocks=[];lines=(SRC/f'M03-07-teaching.{suffix}.md').read_text().splitlines();i=0
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
  if s in ('---','>'):continue
  if re.match(r'^#{1,3} ',s):
   title=re.sub(r'^#{1,3} ', '', s)
   if heading_index==0:
    heading_index+=1;blocks.append(dict(kind='paragraph',text=title));continue
   entry=next(sections);assert entry[lang]==title,(lang,title,entry)
   blocks.append(dict(kind=entry['kind'],id=entry['id'],text=title));continue
  if s.startswith('- '):
   items=[s[2:]]
   while i<len(lines) and lines[i].strip().startswith('- '):
    items.append(lines[i].strip()[2:].replace('**',''));i+=1
   blocks.append(dict(kind='list',items=items));continue
  blocks.append(dict(kind='paragraph',text=s.removeprefix('> ')))
 for before,key in [('section-1-1','workflow'),('section-3','positions'),('section-4-1','layers'),('section-7-3','evidence')]:
  at=next(i for i,b in enumerate(blocks) if b.get('id')==before);blocks.insert(at if before in ('section-3','section-4-1') else at+1,models[key][lang])
 for chunk in (SRC/f'M03-07-answers.{suffix}.md').read_text().split('\n## ')[1:]:
  head,*paras=chunk.strip().split('\n\n');ident,title=re.split(r'｜|\s*\|\s*',head,maxsplit=1)
  blocks.append(dict(kind='answer',id=ident.strip(),summary=('參考解答：' if lang=='zh' else 'Reference answer: ')+title.strip(),paragraphs=paras))
 return dict(summary='從授權範圍、掃描設定與原始結果，練習可查核的 Nmap 判讀與本機實驗。' if lang=='zh' else 'Connect authorized scope, settings and original evidence to defensible Nmap interpretation and a local experiment.',sections=[],sourceBody=blocks)
lesson=dict(id='M03-07',revision=2,contentVersion='1.1.0',date='2026-11-03',status='published',publishedOn='2026-11-03',qa=[],text={lang:parse(lang,suf) for lang,suf in [('zh','zh-TW'),('en','en')]})
p=ROOT/'content/concepts/m03-07.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert p.read_text()==data
else:p.write_text(data)
