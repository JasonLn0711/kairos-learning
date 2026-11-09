"""Generate full M05-05 teaching and eight reviewed SVG downloads."""
from pathlib import Path
from html import escape
import json,re,sys
from m0903_svg import sanitized_svg,NS
from m04_09_content import wrap
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m05-05'
COUNTS={'signals':3,'groups':4,'probability':1,'workflow':4}
ICONS=['M3 18a9 9 0 1 1 18 0 M12 14l5-7 M5 19h14','M12 2l9 4v7c0 5-4 8-9 10-5-2-9-5-9-10V6z M12 7v6 M12 16v1','M3 21v-5 M8 21V12 M13 21v-8 M18 21V7 M2 12l6-6 5 3 8-7']
def parse(lang,models):
 suffix='zh-TW' if lang=='zh' else 'en';blocks=[];section=sub=0
 for chunk in re.split(r'\n\s*\n',(S/f'teaching.{suffix}.md').read_text().strip())[1:]:
  figure=re.fullmatch(r'\{\{figure:([a-z]+)\}\}',chunk)
  if figure:
   name=figure[1];blocks.append(dict(kind='visual',src=f'/images/ceh/m05-05-{name}-{lang}-v1-0-0.svg',downloadLabel='下載 SVG 圖解' if lang=='zh' else 'Download SVG diagram',visual=models[name][lang]))
  elif chunk.startswith('## '):section+=1;sub=0;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
  elif chunk.startswith('### '):sub+=1;blocks.append(dict(kind='paragraph',id=f'section-{section}-sub-{sub}',text=chunk[4:]))
  elif chunk.startswith('|'):
   rows=[[c.strip() for c in line.strip().strip('|').split('|')] for line in chunk.splitlines()];blocks.append(dict(kind='table',headers=rows[0],rows=rows[2:]))
  elif chunk.startswith('- ') or re.match(r'^\d+\. ',chunk):blocks.append(dict(kind='list',items=[re.sub(r'^(?:- |\d+\. )','',line) for line in chunk.splitlines()]))
  else:blocks.append(dict(kind='paragraph',text=chunk.removeprefix('> ')))
 assert section==9,(lang,section)
 return dict(summary='分清技術嚴重度、已知利用與未來機率，以適用性、可達性及後果安排修補。' if lang=='zh' else 'Separate technical severity, known exploitation and predicted likelihood; prioritize remediation using applicability, reachability and consequences.',sections=[],sourceBody=blocks)
def svg(name,lang,v):
 p=[];prefix=f'm0505-{name}-{lang}-';y=42
 def text(x,y,s,size,width,weight=None):
  lines=wrap(s,width,size)
  for i,line in enumerate(lines):p.append(f'<text x="{x}" y="{y+i*size*1.8}" font-size="{size}" fill="#18252c"'+(f' font-weight="{weight}"' if weight else '')+f'>{escape(line)}</text>')
  return len(lines)*size*1.8
 y+=text(28,y,v['caption'],26,844,'700')+8;y+=text(28,y,v['description'],20,844)+20
 for i,n in enumerate(v['items']):
  if i and name=='workflow':p.append(f'<path d="M450 {y-12}v24m-6-6 6 6 6-6" fill="none" stroke="#59616b" stroke-width="2"/>');y+=30
  x=90 if name=='signals' else 48;width=762 if name=='signals' else 760 if name=='probability' else 804
  title_size=30 if name=='probability' else 23
  title_height=len(wrap(n['title'],width,title_size))*title_size*1.8
  body_height=sum(len(wrap(s,width,20))*36+12 for s in n['body'].split('\n\n'))
  height=title_height+body_height+40+(26 if name=='probability' else 0)
  p.append(f'<rect x="28" y="{y}" width="844" height="{height}" rx="14" fill="'+('#edf4fc' if name=='workflow' and i==3 else '#ffffff')+'" stroke="#94a3b8"/>')
  if name=='signals':p.append(f'<path d="{ICONS[i]}" transform="translate(46 {y+26}) scale(1.2)" fill="none" stroke="#18252c" stroke-width="1.7"/>')
  ty=y+34;ty+=text(x,ty,n['title'],title_size,width,'700')
  if name=='probability':
   p.append(f'<rect x="48" y="{ty-9}" width="804" height="14" rx="7" fill="#e2e8f0"/><rect x="48" y="{ty-9}" width="160.8" height="14" rx="7" fill="#3268a3"/>');ty+=26
  for paragraph in n['body'].split('\n\n'):ty+=text(x,ty,paragraph,20,width)+12
  y+=height+18
 raw=f'<svg xmlns="{NS}" viewBox="0 0 900 {y+8}" role="img" aria-labelledby="{prefix}title {prefix}desc"><title id="{prefix}title">{escape(v["caption"])}</title><desc id="{prefix}desc">{escape(v["description"])}</desc><g font-family="system-ui,sans-serif">'+''.join(p)+'</g></svg>'
 result=(sanitized_svg(raw,prefix)+'\n').encode();assert len(result)<100000;return result

def generate():
 models=json.loads((S/'diagrams.json').read_text())
 assert list(models)==list(COUNTS)
 for name,pair in models.items():
  assert set(pair)=={'zh','en'}
  for lang,v in pair.items():
   assert v['kind']==('flow' if name=='workflow' else 'cards') and len(v['items'])==COUNTS[name]
   if name=='probability':assert v['items'][0]['title']=='0.20 = 20%'
 teaching=dict(id='CEH26-M05-C05',revision=1,contentVersion='1.0.0',date='2026-11-09',status='published',publishedOn='2026-11-09',qa=[],text={lang:parse(lang,models) for lang in ['zh','en']})
 a,b=[teaching['text'][l]['sourceBody'] for l in ['zh','en']]
 def shape(block):
  if block['kind']=='table':return ('table',len(block['headers']),len(block['rows']))
  if block['kind']=='list':return ('list',len(block['items']))
  return (block['kind'],block.get('id'))
 assert [shape(x) for x in a]==[shape(x) for x in b], 'Bilingual block shape differs'
 targets={R/'content/concepts/ceh26-m05-c05.json':(json.dumps(teaching,ensure_ascii=False,indent=2)+'\n').encode()}
 for name,pair in models.items():
  for lang,v in pair.items():targets[R/f'site/images/ceh/m05-05-{name}-{lang}-v1-0-0.svg']=svg(name,lang,v)
 return targets
if __name__=='__main__':
 print('Checking M05-05 source and paired diagram artifacts.' if '--check' in sys.argv else 'Generating M05-05 teaching and paired diagram artifacts.')
 targets=generate()
 for path,data in targets.items():
  if '--check' in sys.argv:assert path.read_bytes()==data,path
  else:path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
 print(f'PASS: {len(targets)} artifacts; nine full sections per language and eight sanitized SVGs.')
