"""Generate full M05-06 teaching and six reviewed SVG downloads."""
from pathlib import Path
from html import escape
import json,re,sys
from m0903_svg import sanitized_svg,NS
import unicodedata
def wrap(text,width,size):
 limit=width/size;lines=[];line='';used=0
 for word in re.findall(r'[\u2e80-\uffff]|[^\s\u2e80-\uffff]+\s*|\s',text):
  cost=sum(1 if unicodedata.east_asian_width(c) in 'WF' else .62 for c in word)
  if line and used+cost>limit:lines.append(line.strip());line='';used=0
  line+=word;used+=cost
 if line.strip():lines.append(line.strip())
 return lines
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m05-06'
COUNTS={'paths':3,'gates':5,'result':4}
ICONS=['M3 18a9 9 0 1 1 18 0 M12 14l5-7 M5 19h14','M12 2l9 4v7c0 5-4 8-9 10-5-2-9-5-9-10V6z M12 7v6 M12 16v1','M3 21v-5 M8 21V12 M13 21v-8 M18 21V7 M2 12l6-6 5 3 8-7']
def parse(lang,models):
 suffix='zh-TW' if lang=='zh' else 'en';blocks=[];section=sub=0
 for chunk in re.split(r'\n\s*\n',(S/f'teaching.{suffix}.md').read_text().strip())[1:]:
  figure=re.fullmatch(r'\{\{figure:([a-z]+)\}\}',chunk)
  if figure:
   name=figure[1];blocks.append(dict(kind='visual',src=f'/images/ceh/m05-06-{name}-{lang}-v1-0-0.svg',downloadLabel='下載 SVG 圖解' if lang=='zh' else 'Download SVG diagram',visual=models[name][lang]))
  elif chunk.startswith('## '):section+=1;sub=0;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
  elif chunk.startswith('### '):sub+=1;blocks.append(dict(kind='paragraph',id=f'section-{section}-sub-{sub}',text=chunk[4:]))
  elif chunk.startswith('|'):
   rows=[[c.strip() for c in line.strip().strip('|').split('|')] for line in chunk.splitlines()];blocks.append(dict(kind='table',headers=rows[0],rows=rows[2:]))
  elif chunk.startswith('- ') or re.match(r'^\d+\. ',chunk):blocks.append(dict(kind='list',items=[re.sub(r'^(?:- |\d+\. )','',line) for line in chunk.splitlines()]))
  else:blocks.append(dict(kind='paragraph',text=chunk.removeprefix('> ')))
 assert section==8,(lang,section)
 return dict(summary='分清掃描完成、身分認證與檢查覆蓋，以實際取得的證據支持安全判讀。' if lang=='zh' else 'Distinguish job completion, authentication and check coverage; support security judgments with evidence actually obtained.',sections=[],sourceBody=blocks)
def svg(name,lang,v):
 p=[];prefix=f'm0506-{name}-{lang}-'
 def text(x,y,s,size,width,weight=None):
  lines=wrap(s,width,size)
  for i,line in enumerate(lines):p.append(f'<text x="{x}" y="{y+i*size*1.8}" font-size="{size}" fill="#18252c"'+(f' font-weight="{weight}"' if weight else '')+f'>{escape(line)}</text>')
  return len(lines)*size*1.8
 def height(n,width):return len(wrap(n['title'],width,23))*41.4+sum(len(wrap(t,width,20))*36+12 for t in n['body'].split('\n\n'))+44
 def node(n,x,y,width,h):
  p.append(f'<rect x="{x}" y="{y}" width="{width}" height="{h}" rx="14" fill="#ffffff" stroke="#94a3b8"/>')
  ty=y+36;ty+=text(x+20,ty,n['title'],23,width-40,'700')
  for para in n['body'].split('\n\n'):ty+=text(x+20,ty,para,20,width-40)+12
 y=42;y+=text(28,y,v['caption'],26,844,'700')+8;y+=text(28,y,v['description'],20,844)+20
 if name=='paths':
  h=height(v['items'][0],804);node(v['items'][0],28,y,844,h);y+=h+20
  h=max(height(n,372) for n in v['items'][1:])
  for i,n in enumerate(v['items'][1:]):node(n,28+i*432,y,412,h)
  y+=h+20
 elif name=='result':
  for i,n in enumerate(v['items']):
   h=max(len(wrap(n['title'],360,22)),len(wrap(n['body'],400,22)))*39.6+44
   p.append(f'<path d="M28 {y+h-8}H872" fill="none" stroke="#94a3b8"/>')
   text(40,y+32,n['title'],22,360)
   if i==1:p.append(f'<path d="M420 {y+24}l6 6 12-16" fill="none" stroke="#166534" stroke-width="3"/>')
   if i==2:p.append(f'<path d="M418 {y+32}l12-24 12 24z M430 {y+17}v7 M430 {y+27}v1" fill="none" stroke="#b91c1c" stroke-width="2"/>')
   text(460,y+32,n['body'],22,400,'700');y+=h
 else:
  for i,n in enumerate(v['items']):
   if i:p.append(f'<path d="M450 {y}v24m-6-6 6 6 6-6" fill="none" stroke="#59616b" stroke-width="2"/>');y+=42
   h=height(n,804);node(n,28,y,844,h);y+=h+12
 raw=f'<svg xmlns="{NS}" viewBox="0 0 900 {y+16}" role="img" aria-labelledby="{prefix}title {prefix}desc"><title id="{prefix}title">{escape(v["caption"])}</title><desc id="{prefix}desc">{escape(v["description"])}</desc><g font-family="system-ui,sans-serif">'+''.join(p)+'</g></svg>'
 result=(sanitized_svg(raw,prefix)+'\n').encode();assert len(result)<100000;return result

def generate():
 models=json.loads((S/'diagrams.json').read_text())
 assert list(models)==list(COUNTS)
 for name,pair in models.items():
  assert set(pair)=={'zh','en'}
  for lang,v in pair.items():
   assert v['kind']==('flow' if name=='gates' else 'cards') and len(v['items'])==COUNTS[name]
 teaching=dict(id='CEH26-M05-C06',revision=1,contentVersion='1.0.0',date='2026-11-09',status='published',publishedOn='2026-11-09',qa=[],text={lang:parse(lang,models) for lang in ['zh','en']})
 a,b=[teaching['text'][l]['sourceBody'] for l in ['zh','en']]
 def shape(block):
  if block['kind']=='table':return ('table',len(block['headers']),len(block['rows']))
  if block['kind']=='list':return ('list',len(block['items']))
  return (block['kind'],block.get('id'))
 assert [shape(x) for x in a]==[shape(x) for x in b], 'Bilingual block shape differs'
 targets={R/'content/concepts/ceh26-m05-c06.json':(json.dumps(teaching,ensure_ascii=False,indent=2)+'\n').encode()}
 for name,pair in models.items():
  for lang,v in pair.items():targets[R/f'site/images/ceh/m05-06-{name}-{lang}-v1-0-0.svg']=svg(name,lang,v)
 return targets
if __name__=='__main__':
 print('Checking M05-06 source and paired diagram artifacts.' if '--check' in sys.argv else 'Generating M05-06 teaching and paired diagram artifacts.')
 targets=generate()
 for path,data in targets.items():
  if '--check' in sys.argv:assert path.read_bytes()==data,path
  else:path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
 print(f'PASS: {len(targets)} artifacts; eight full sections per language and six sanitized SVGs.')
