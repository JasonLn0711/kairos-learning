"""Build the complete paired NFS lesson and sanitized, model-derived figure exports."""
from pathlib import Path
import json,re,sys,html,unicodedata
from m0903_svg import sanitized_svg
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/ceh26-m04-c06';V=S/'replacement-2026-11-06'
models=json.loads((V/'diagram-models.json').read_text())
def inline(s):return s.replace('`','').replace('**','')
def parse(lang,suffix):
 lines=(S/f'teaching.{suffix}.md').read_text().splitlines();blocks=[];i=0;chapter=0;sub=0
 while i<len(lines):
  s=lines[i].strip();i+=1
  if not s or s.startswith('# '):continue
  if s.startswith('```'):
   code=[]
   while i<len(lines) and not lines[i].strip().startswith('```'):code.append(lines[i]);i+=1
   assert i<len(lines),'Unclosed fence';i+=1;blocks.append(dict(kind='code',text='\n'.join(code)));continue
  if s.startswith('## '):
   chapter+=1;sub=0;blocks.append(dict(kind='heading',id=f'section-{chapter}',text=inline(s[3:])));continue
  if s.startswith('### '):
   sub+=1;blocks.append(dict(kind='paragraph',id=f'section-{chapter}-{sub}',text=inline(s[4:])));continue
  if s.startswith('[[figure:'):
   blocks.append(models[s.removeprefix('[[figure:').removesuffix(']]')][lang]);continue
  if s.startswith('|'):
   cells=lambda line:[inline(c.strip()) for c in line.strip('|').split('|')]
   rows=[cells(s)]
   while i<len(lines) and lines[i].strip().startswith('|'):
    line=lines[i].strip();i+=1
    if not re.fullmatch(r'[| :\-]+',line):rows.append(cells(line))
   blocks.append(dict(kind='table',headers=rows[0],rows=rows[1:]));continue
  if s.startswith('- ') or re.match(r'^\d+\. ',s):
   items=[inline(re.sub(r'^(?:- |\d+\. )','',s))]
   while i<len(lines) and (lines[i].startswith('- ') or re.match(r'^\d+\. ',lines[i])):items.append(inline(re.sub(r'^(?:- |\d+\. )','',lines[i])));i+=1
   blocks.append(dict(kind='list',items=items));continue
  blocks.append(dict(kind='paragraph',text=inline(s)))
 assert chapter==9,chapter
 blocks.append(dict(kind='answer',id='answer-nfs-permissions',summary='參考答案：budget.txt 的三題判讀' if lang=='zh' else 'Reference answers: three judgments about budget.txt',paragraphs=(S/f'answer.{suffix}.md').read_text().strip().split('\n\n')))
 return dict(summary='從名稱與實際程序身分出發，核對 NFS 安全模式、路徑與檔案權限，分清列舉、掛載、列名與讀寫的證據。' if lang=='zh' else 'Start with names and actual process identities, check NFS security mode and path/file permissions, and distinguish enumeration, mounting, listing, reading and writing evidence.',sections=[],sourceBody=blocks)
def wrap(s,width):
 # East Asian characters occupy roughly twice the horizontal space of Latin characters.
 lines=[];line='';size=0
 for c in s:
  cost=2 if unicodedata.east_asian_width(c) in 'WF' else 1
  if size+cost>width:lines.append(line);line='';size=0
  line+=c;size+=cost
 if line:lines.append(line)
 return lines
def svg(block,key,lang):
 v=block['visual'];mount=key=='mount';w=1100;parts=[]
 def text(s,x,y,width=100,weight='400',size=18):
  lines=wrap(s,width)
  for j,line in enumerate(lines):parts.append(f'<text x="{x}" y="{y+j*28}" font-size="{size}" font-weight="{weight}">{html.escape(line)}</text>')
  return len(lines)*28
 y=40;y+=text(v['caption'],24,y,90,'700',22)+20
 if mount:
  for i in [0,2]:
   x=24 if i==0 else 796
   parts.append(f'<rect x="{x}" y="{y}" width="280" height="180" rx="22" fill="'+('#edf0f5' if i==0 else '#e5f5f2')+'" stroke="'+('#8b9cb1' if i==0 else '#009b8b')+'" stroke-width="2"/>')
   text(v['items'][i]['title'],x+30,y+60,23,'700',22);text(v['items'][i]['body'],x+30,y+110,23)
  text(v['items'][1]['title'],480,y+35,24,'700');text(v['items'][1]['body'],345,y+135,43)
  parts.append(f'<path d="M304 {y+85} H790 m-18 -12 18 12 -18 12" stroke="#1d2939" fill="none" stroke-width="3" stroke-dasharray="12 8"/>');y+=220
 else:
  for index,item in enumerate(v['items']):
   title=wrap(item['title'],90);body=wrap(item['body'],94);h=30+(len(title)+len(body))*28
   parts.append(f'<rect x="24" y="{y}" width="1052" height="{h}" rx="12" fill="#eef4fa" stroke="#8b9cb1"/>')
   yy=y+30;text(item['title'],44,yy,90,'700');text(item['body'],44,yy+len(title)*28+5,94);y+=h+18
   if v['kind']=='flow' and index<len(v['items'])-1:
    parts.append(f'<path d="M550 {y-12}v22m-8 -8 8 8 8 -8" stroke="#60738d" stroke-width="2" fill="none"/>');y+=24
 y+=text(v['description'],24,y+10,104)+35
 raw=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w*.8} {y*.8}" role="img" aria-labelledby="title desc"><title id="title">{html.escape(v["caption"])}</title><desc id="desc">{html.escape(v["description"])}</desc><rect width="{w*.8}" height="{y*.8}" fill="#ffffff"/><g transform="scale(0.8)" font-family="sans-serif" fill="#173450">'+''.join(parts)+'</g></svg>'
 prefix=f'm0406-{key}-{lang}'
 raw=raw.replace('id="title"',f'id="{prefix}-title"').replace('id="desc"',f'id="{prefix}-desc"').replace('aria-labelledby="title desc"',f'aria-labelledby="{prefix}-title {prefix}-desc"')
 return sanitized_svg(raw,prefix).encode()
lesson=dict(id='CEH26-M04-C06',revision=1,contentVersion='1.0.0',date='2026-11-06',publishedOn='2026-11-06',status='published',qa=[],text={l:parse(l,s) for l,s in [('zh','zh-TW'),('en','en')]})
a,b=lesson['text']['zh']['sourceBody'],lesson['text']['en']['sourceBody'];assert [(x['kind'],x.get('id')) for x in a]==[(x['kind'],x.get('id')) for x in b], 'Bilingual block mismatch'
outputs={R/'content/concepts/ceh26-m04-c06.json':(json.dumps(lesson,ensure_ascii=False,indent=2)+'\n').encode()}
for key,pair in models.items():
 for lang,block in pair.items():outputs[R/'site'/block['src'].lstrip('/')]=svg(block,key,lang)
for path,data in outputs.items():
 if '--check' in sys.argv:assert path.read_bytes()==data,path
 else:path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
print(f'PASS: {len(a)} bilingual blocks and 8 sanitized SVGs')
