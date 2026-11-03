"""Generate ordered teaching from the paired M03-04 source documents."""
from pathlib import Path
import json,re,shutil,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'docs/sources/m03-04'
DEST=ROOT/'docs/sources/m03-04';DEST.mkdir(parents=True,exist_ok=True)
NS='{http://www.w3.org/2000/svg}'
def table_cells(s):
 return [c.strip().replace(r'\|','|') for c in re.split(r'(?<!\\)\|',s.strip('|'))]
def parse(lang,suffix):
 path=SRC/f'M03-04-teaching.{suffix}.md'
 ap=SRC/f'M03-04-answers.{suffix}.md'
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
   blocks.append(dict(kind='visual',src=f'/images/ceh/m03-04-{name}-{lang}.svg',downloadLabel='下載 SVG 圖檔' if lang=='zh' else 'Download SVG diagram',visual=dict(kind='cards',caption=title,description=desc,items=[dict(title='讀圖重點' if lang=='zh' else 'How to read the diagram',body=desc)])));continue
  if s.startswith('|'):
   rows=[table_cells(s)]
   while i<len(lines) and lines[i].strip().startswith('|'):
    row=lines[i].strip();i+=1
    if re.fullmatch(r'[| :\-]+',row):continue
    rows.append(table_cells(row))
   blocks.append(dict(kind='table',headers=rows[0],rows=rows[1:]));continue
  if s.startswith(('## ','### ')):
   title=re.sub(r'^#{2,3} ', '', s); number=re.search(r'\d+(?:\.\d+)*',title)[0];blocks.append(dict(kind='heading' if s.startswith('## ') else 'paragraph',id='section-'+number.replace('.','-'),text=title));continue
  blocks.append(dict(kind='paragraph',text=s.removeprefix('# ')))
 answers=[]
 for chunk in ap.read_text().split('\n## ')[1:]:
  heading,*paras=chunk.strip().split('\n\n');ident,title=re.split(r'｜|\s*\|\s*',heading,maxsplit=1);ident=ident.strip();title=title.strip()
  answers.append(dict(kind='answer',id=ident,summary=('參考解答：' if lang=='zh' else 'Reference answer: ')+title,paragraphs=paras))
 for section,name in [(2, '01-core-states'), (3, '02-syn-responses'), (4, '03-udp-responses'), (7, '04-evidence-record')]:
  root=ET.parse(DEST/f'figures/{name}.{suffix}.svg').getroot();title=root.find(NS+'title').text;desc=root.find(NS+'desc').text
  block=dict(kind='visual',src=f'/images/ceh/m03-04-{name}-{lang}.svg',downloadLabel='下載 SVG 圖檔' if lang=='zh' else 'Download SVG diagram',visual=dict(kind='cards',caption=title,description=desc,items=[dict(title='讀圖重點' if lang=='zh' else 'How to read the diagram',body=desc)]))
  at=next(i for i,b in enumerate(blocks) if b.get('id')==f'section-{section+1}');blocks.insert(at,block)
 blocks.extend(answers)
 return dict(summary='把 Open、Closed、Filtered 與其他狀態連回觀察位置、方法及回應，選擇下一步查核。' if lang=='zh' else 'Connect Open, Closed, Filtered and other states to observation location, method and response, then choose the next check.',sections=[],sourceBody=blocks)
lesson=dict(id='M03-04',revision=2,contentVersion='1.1.0',date='2026-11-03',status='published',publishedOn='2026-11-03',qa=[],text={lang:parse(lang,suf) for lang,suf in [('zh','zh-TW'),('en','en')]})
(ROOT/'content/concepts/m03-04.json').write_text(json.dumps(lesson,ensure_ascii=False,indent=2)+'\n')
