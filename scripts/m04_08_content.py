"""Build complete paired LDAP teaching and ten model-derived reviewed figures."""
from pathlib import Path
from html import escape
import json,re,sys,unicodedata
from m0903_svg import sanitized_svg
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m04-08';V=S/'replacement-2026-11-07'
models=json.loads((V/'diagram-models.json').read_text());answers=json.loads((V/'answers.json').read_text())
ANCHORS=['directory-overview','section-1','directory-names','section-2','section-3','section-4','section-5','section-6','section-7','ldap-introduction','kerberos-introduction','section-8']
COUNTS={'directory':4,'parameters':4,'scope':6,'result':7,'paging':3,'central':4,'entry':4,'search':4,'sso':4,'tickets':3}
def inline(s):return s.replace('`','').replace('**','').replace('\\.','.')
def parse(lang,suffix):
 lines=(S/f'teaching.{suffix}.md').read_text().splitlines();blocks=[];i=section=sub=0
 while i<len(lines):
  line=lines[i].strip();i+=1
  if not line or line.startswith('# '):continue
  if line.startswith('```'):
   code=[]
   while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
   assert i<len(lines),'Unclosed code fence';i+=1;blocks.append(dict(kind='code',text='\n'.join(code)));continue
  if line.startswith('## '):
   section+=1;sub=0;blocks.append(dict(kind='heading',id=ANCHORS[section-1],text=inline(line[3:])));continue
  if line.startswith('### '):
   sub+=1;blocks.append(dict(kind='paragraph',id=f'{ANCHORS[section-1]}-sub-{sub}',text=inline(line[4:])));continue
  if line.startswith('{{figure:'):
   key=line.removeprefix('{{figure:').removesuffix('}}');blocks.append(models[key][lang]);continue
  if line.startswith('{{answer:'):
   key=line.removeprefix('{{answer:').removesuffix('}}');p=(S/f'answer.{suffix}.md').read_text().strip().split('\n\n') if key=='completeness' else answers[key][lang]
   blocks.append(dict(kind='answer',id='answer-ldap-'+key,summary='參考答案與解析' if lang=='zh' else 'Reference answers and explanations',paragraphs=p));continue
  if line.startswith('|'):
   cells=lambda x:[inline(c.strip()) for c in x.strip('|').split('|')]
   rows=[cells(line)]
   while i<len(lines) and lines[i].strip().startswith('|'):
    row=lines[i].strip();i+=1
    if not re.fullmatch(r'[| :\-]+',row):rows.append(cells(row))
   blocks.append(dict(kind='table',headers=rows[0],rows=rows[1:]));continue
  if line.startswith('- ') or re.match(r'^\d+\. ',line):
   items=[inline(re.sub(r'^(?:- |\d+\. )','',line))]
   while i<len(lines) and (lines[i].startswith('- ') or re.match(r'^\d+\. ',lines[i])):items.append(inline(re.sub(r'^(?:- |\d+\. )','',lines[i])));i+=1
   blocks.append(dict(kind='list',items=items));continue
  blocks.append(dict(kind='paragraph',text=inline(line)))
 assert section==12,section
 return dict(summary='從查詢身分、Base、Scope、欄位與分頁完成狀態判讀 LDAP 列舉，並用完整 LDAP／Kerberos 入門串起目錄、票證與授權。' if lang=='zh' else 'Interpret LDAP enumeration through identity, Base, Scope, attributes, and paging completion, with complete LDAP and Kerberos introductions connecting directories, tickets, and authorization.',sections=[],sourceBody=blocks)
def wrap(s,width):
 lines=[];line='';size=0
 for c in s:
  cost=1 if unicodedata.east_asian_width(c) in 'WF' else .62
  if size+cost>width:lines.append(line);line='';size=0
  line+=c;size+=cost
 if line:lines.append(line)
 return lines

def svg(key,lang,v):
 parts=[];prefix=f'm0408-{key}-{lang}-'
 def text(s,x,y,w=940,size=20,bold=False):
  lines=wrap(s,w/size)
  for i,line in enumerate(lines):parts.append(f'<text x="{x}" y="{y+i*size*1.7}" font-size="{size}"'+(' font-weight="700"' if bold else '')+'>'+escape(line)+'</text>')
  return len(lines)*size*1.7
 def height(item,w):return 36+len(wrap(item['title'],(w-32)/22))*38+len(wrap(item['body'],(w-32)/20))*34
 def box(item,x,y,w,h=None,selected=False):
  h=h or height(item,w)
  parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="'+('#e3f1ee' if selected else '#ffffff')+'" stroke="'+('#368878' if selected else '#8b969f')+'" stroke-width="2"/>')
  yy=y+32;yy+=text(item['title'],x+16,yy,w-32,22,True);text(item['body'],x+16,yy+6,w-32);return h
 def path(d):parts.append(f'<path d="{d}" fill="none" stroke="#8b969f" stroke-width="2"/>')
 y=45+text(v['caption'],28,38,940,26,True)+20;items=v['items']
 if key in ['directory','central','sso','scope']:
  y+=box(items[0],300,y,400)+50
  cols=items[1:4];h=max(height(n,285) for n in cols)
  path(f'M500 {y-50}V{y-25}M172.5 {y-25}H827.5')
  for i,item in enumerate(cols):
   x=30+i*327.5;path(f'M{x+142.5} {y-25}V{y}');box(item,x,y,285,h,key=='scope')
  y+=h
  if key=='scope':
   path(f'M827.5 {y}V{y+30}M665 {y+30}H887.5M665 {y+30}V{y+60}M887.5 {y+30}V{y+60}');y+=60
   h=max(height(n,190) for n in items[4:]);box(items[4],570,y,190,h);box(items[5],792.5,y,190,h);y+=h
  y+=30
 elif key=='parameters':
  for row in [items[:2],items[2:]]:
   h=max(height(n,455) for n in row)
   for i,item in enumerate(row):box(item,30+i*485,y,455,h)
   y+=h+20
 elif key in ['entry','result']:
  for item in items:
   h=max(len(wrap(item['title'],300/20)),len(wrap(item['body'],600/20)))*34+28
   text(item['title'],35,y+28,300);text(item['body'],365,y+28,600,bold=item['title']=='Result Code');y+=h;path(f'M30 {y}H970');y+=12
 elif key=='tickets':
  for i,item in enumerate(items):
   stage,request,reply=item['body'].split('\n');left,right=item['title'].split(' → ')
   y+=text(stage,30,y,940,22,True)+12
   h=max(text(left,30,y,420,22,True),text(right,540,y,420,22,True));y+=h+16
   y+=text('→ '+request,100,y,800)+12
   y+=text(('← ' if i<2 else '')+reply,100,y,800)+36
   path(f'M30 {y-14}H970')
 else:
  for i,item in enumerate(items):
   y+=box(item,30,y,940)+20
   if v['kind']=='flow' and i<len(items)-1:
    path(f'M500 {y-10}V{y+16}m-8 -8 8 8 8 -8');y+=40
 y+=20;y+=text(v['description'],28,y,940)+30
 raw=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 {y*.85}" role="img" aria-labelledby="{prefix}title {prefix}desc"><title id="{prefix}title">{escape(v["caption"])}</title><desc id="{prefix}desc">{escape(v["description"])}</desc><g transform="scale(0.85)"><rect width="1000" height="{y}" fill="#f7f9fb"/><g font-family="sans-serif" fill="#213547">'+''.join(parts)+'</g></g></svg>'
 data=sanitized_svg(raw,prefix).encode();assert len(data)<100000;return data

def main():
 lesson=dict(id='CEH26-M04-C08',revision=3,contentVersion='1.1.0',date='2026-11-07',status='published',publishedOn='2026-11-06',qa=[],text={l:parse(l,s) for l,s in [('zh','zh-TW'),('en','en')]})
 def shape(lang):
  return [(b['kind'],b.get('id'),len(b['items']) if b['kind']=='list' else len(b['rows']) if b['kind']=='table' else len(b['paragraphs']) if b['kind']=='answer' else None) for b in lesson['text'][lang]['sourceBody']]
 assert shape('zh')==shape('en'),'Bilingual block structure differs'
 outputs={R/'content/concepts/ceh26-m04-c08.json':(json.dumps(lesson,ensure_ascii=False,indent=2)+'\n').encode()}
 for key,pair in models.items():
  for lang,block in pair.items():
   assert len(block['visual']['items'])==COUNTS[key]
   outputs[R/'site'/block['src'].lstrip('/')]=svg(key,lang,block['visual'])
 for path,data in outputs.items():
  if '--check' in sys.argv:assert path.read_bytes()==data,path
  else:path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
 print(f'PASS: {len(shape("zh"))} paired blocks; 10 paired diagrams; 3 reference answers')
if __name__=='__main__':main()
