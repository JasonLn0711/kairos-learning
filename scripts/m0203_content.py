"""Generate ordered teaching from the paired M02-03 source documents."""
from pathlib import Path
import json,re,shutil,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'docs/sources/m02-03'
DEST=ROOT/'docs/sources/m02-03';DEST.mkdir(parents=True,exist_ok=True)
NS='{http://www.w3.org/2000/svg}'
def parse(lang,suffix):
 path=SRC/f'M02-03-teaching.{suffix}.md'
 ap=SRC/f'M02-03-answers.{suffix}.md'
 blocks=[];lines=path.read_text().splitlines();i=0
 while i<len(lines):
  s=lines[i].strip();i+=1
  if not s:continue
  s=s.replace('**','')
  if s.startswith('!['):
   name=re.search(r'figures/([^.]*)',s)[1];r=ET.parse(DEST/f'figures/{name}.{suffix}.svg').getroot();title=r.find(NS+'title').text;desc=r.find(NS+'desc').text
   blocks.append(dict(kind='visual',src=f'/images/ceh/m02-03-{name}-{lang}.svg',downloadLabel='下載 SVG 圖檔' if lang=='zh' else 'Download SVG diagram',visual=dict(kind='cards',caption=title,description=desc,items=[dict(title='讀圖重點' if lang=='zh' else 'How to read the diagram',body=desc)])));continue
  if s.startswith('|'):
   rows=[[c.strip() for c in s.strip('|').split('|')]]
   while i<len(lines) and lines[i].strip().startswith('|'):
    row=lines[i].strip();i+=1
    if re.fullmatch(r'[| :\-]+',row):continue
    rows.append([c.strip() for c in row.strip('|').split('|')])
   blocks.append(dict(kind='table',headers=rows[0],rows=rows[1:]));continue
  if s.startswith('## '):blocks.append(dict(kind='heading',id='section-'+re.search(r'\d+',s)[0],text=s[3:]));continue
  blocks.append(dict(kind='paragraph',text=s.removeprefix('# ')))
 answers=[]
 for chunk in ap.read_text().split('\n## ')[1:]:
  heading,*paras=chunk.strip().split('\n\n');ident,title=re.split(r'｜|\s*\|\s*',heading,maxsplit=1)
  answers.append(dict(kind='answer',id=ident,summary=('參考解答：' if lang=='zh' else 'Reference answer: ')+title,paragraphs=paras))
 at=next(i for i,b in enumerate(blocks) if b.get('id')=='section-9');blocks[at:at]=answers
 return dict(summary='區分搜尋索引與網站現況，辨識公開線索，守住授權與證據的界線。' if lang=='zh' else 'Separate search indexes from current pages, interpret public clues, and respect authorization and evidence boundaries.',sections=[],sourceBody=blocks)
lesson=dict(id='M02-03',revision=1,contentVersion='1.0.1',date='2026-10-31',status='published',publishedOn='2026-10-31',qa=[],text={lang:parse(lang,suf) for lang,suf in [('zh','zh-TW'),('en','en')]})
# Editorial web labels are independent of the preserved SVG artwork.
for block in lesson['text']['zh']['sourceBody']:
 if block.get('src') == '/images/ceh/m02-03-01-index-boundary-zh.svg':
  block['visual'] = json.loads("{\"kind\":\"cards\",\"caption\":\"圖 1｜索引不是即時網站\",\"description\":\"「搜尋」服務並非呼叫目標網站；反之，點開網站則會直接之互動。\",\"items\":[{\"title\":\"讀圖重點\",\"body\":\"「搜尋」服務並非呼叫目標網站；反之，點開網站則會直接之互動。\"}]}")
for block in lesson['text']['zh']['sourceBody']:
 if block.get('src') == '/images/ceh/m02-03-02-public-layers-zh.svg':
  block['visual'] = json.loads("{\"kind\":\"cards\",\"caption\":\"圖 2｜公開層能表達部分事實，但不等於全貌\",\"description\":\"逐層記錄公開觀察；不將線索升格成後台事實。\",\"items\":[{\"title\":\"讀圖重點\",\"body\":\"逐層記錄公開觀察；不將線索升格成後台事實。\"}]}")
(ROOT/'content/concepts/m02-03.json').write_text(json.dumps(lesson,ensure_ascii=False,indent=2)+'\n')
