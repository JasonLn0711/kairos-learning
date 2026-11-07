"""Generate ordered teaching from the paired M02-08 source documents."""
from pathlib import Path
import json,re,shutil,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'docs/sources/m02-08'
DEST=ROOT/'docs/sources/m02-08';DEST.mkdir(parents=True,exist_ok=True)
NS='{http://www.w3.org/2000/svg}'
def parse(lang,suffix):
 path=SRC/f'M02-08-teaching.{suffix}.md'
 ap=SRC/f'M02-08-answers.{suffix}.md'
 blocks=[];lines=path.read_text().splitlines();i=0
 while i<len(lines):
  s=lines[i].strip();i+=1
  if not s:continue
  s=s.replace('**','')
  if s.startswith('```'):
   code=[]
   while i<len(lines) and not lines[i].strip().startswith('```'):
    code.append(lines[i]);i+=1
   i+=1;blocks.append(dict(kind='code',text='\n'.join(code)));continue
  if s.startswith('!['):
   name=re.search(r'figures/([^.]*)',s)[1];r=ET.parse(DEST/f'figures/{name}.{suffix}.svg').getroot();title=r.find(NS+'title').text;desc=r.find(NS+'desc').text
   blocks.append(dict(kind='visual',src=f'/images/ceh/m02-08-{name}-{lang}.svg',downloadLabel='下載 SVG 圖檔' if lang=='zh' else 'Download SVG diagram',visual=dict(kind='cards',caption=title,description=desc,items=[dict(title='讀圖重點' if lang=='zh' else 'How to read the diagram',body=desc)])));continue
  if s.startswith('|'):
   rows=[[c.strip() for c in s.strip('|').split('|')]]
   while i<len(lines) and lines[i].strip().startswith('|'):
    row=lines[i].strip();i+=1
    if re.fullmatch(r'[| :\-]+',row):continue
    rows.append([c.strip() for c in row.strip('|').split('|')])
   blocks.append(dict(kind='table',headers=rows[0],rows=rows[1:]));continue
  if s.startswith(('## ','### ')):
   title=re.sub(r'^#{2,3} ', '', s); number=re.search(r'\d+(?:\.\d+)*',title)[0];blocks.append(dict(kind='heading',id='section-'+number.replace('.','-'),text=title));continue
  blocks.append(dict(kind='paragraph',text=s.removeprefix('# ')))
 answers=[]
 for chunk in ap.read_text().split('\n## ')[1:]:
  heading,*paras=chunk.strip().split('\n\n');ident,title=re.split(r'｜|\s*\|\s*',heading,maxsplit=1)
  answers.append(dict(kind='answer',id=ident,summary=('參考解答：' if lang=='zh' else 'Reference answer: ')+title,paragraphs=paras))
 for section,name in [(3,'01-layered-controls'),(5,'02-observation-inference-action'),(6,'03-evidence-custody'),(7,'04-remediation-verification')]:
  root=ET.parse(DEST/f'figures/{name}.{suffix}.svg').getroot();title=root.find(NS+'title').text;desc=root.find(NS+'desc').text
  block=dict(kind='visual',src=f'/images/ceh/m02-08-{name}-{lang}.svg',downloadLabel='下載 SVG 圖檔' if lang=='zh' else 'Download SVG diagram',visual=dict(kind='cards',caption=title,description=desc,items=[dict(title='讀圖重點' if lang=='zh' else 'How to read the diagram',body=desc)]))
  at=next(i for i,b in enumerate(blocks) if b.get('id')==f'section-{section+1}');blocks.insert(at,block)
 blocks.extend(answers)
 return dict(summary='將公開足跡轉為分層防護與可追溯的證據紀錄，並核驗改善成效。' if lang=='zh' else 'Turn public footprints into layered protection and traceable evidence records, then verify improvements.',sections=[],sourceBody=blocks)
lesson=dict(id='M02-08',revision=2,contentVersion='1.0.1',date='2026-11-05',status='published',publishedOn='2026-11-01',qa=[],text={lang:parse(lang,suf) for lang,suf in [('zh','zh-TW'),('en','en')]})
(ROOT/'content/concepts/m02-08.json').write_text(json.dumps(lesson,ensure_ascii=False,indent=2)+'\n')
