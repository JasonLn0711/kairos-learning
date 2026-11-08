"""Generate the complete replacement and five paired, sanitized SVGs."""
from pathlib import Path
from html import escape
import re,json,sys
from m0903_svg import sanitized_svg,NS
from m04_09_content import wrap
from m05_04_replacement_models import build
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m05-04/replacement-2026-11-08'
def svg(name,lang,v):
 p=[];y=42;prefix=f'm0504-{name}-{lang}-'
 def text(x,y,s,size,width):
  lines=wrap(s,width,size)
  for i,t in enumerate(lines):p.append(f'<text x="{x}" y="{y+i*size*1.7}" font-size="{size}" fill="#18252c">{escape(t)}</text>')
  return len(lines)*size*1.7
 y+=text(28,y,v['caption'],26,944)+10;y+=text(28,y,v['description'],20,944)+20
 rows=[[0,1,2],[3],[4]] if name=='roles' else [[0,1,2]] if name=='identifier' else [[i] for i in range(len(v['items']))]
 for ri,row in enumerate(rows):
  if name=='finding':
   n=v['items'][row[0]];height=max(len(wrap(n['title'],260,23)),len(wrap(n['body'],620,23)))*39.1+30
   text(40,y+30,n['title'],23,260);text(340,y+30,n['body'],23,620)
   p.append(f'<path d="M28 {y+height}H972" stroke="#cbd5e1"/>');y+=height;continue
  if ri and name in ['roles','lookup']:
   p.append(f'<path d="M500 {y-8}v24m-6-6 6 6 6-6" fill="none" stroke="#64748b" stroke-width="3"/>');y+=32
  width=(944-20*(len(row)-1))/len(row);height=max(40+len(wrap(v['items'][i]['title'],width-36,23))*39.1+len(wrap(v['items'][i]['body'],width-36,20))*34 for i in row)
  if name=='roles' and ri==0:height+=48
  for col,i in enumerate(row):
   x=28+col*(width+20);n=v['items'][i]
   if name=='finding' or name=='lookup' and i==3:p.append(f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="12" fill="#ffffff" stroke="#94a3b8"/>')
   ty=y+30
   if name=='roles' and i<3:
    icons=['M4 2h10l6 6v14H4z M14 2v6h6 M7 13h7 M7 17h4','M20 3a6 6 0 0 1-7 8L5 20l-3-3 9-8a6 6 0 0 1 9-6z','M3 6l9-5 9 5v12l-9 5-9-5z M3 6l9 5 9-5 M12 11v12']
    p.append(f'<path d="{icons[i]}" transform="translate({x+width/2-16} {y+8}) scale(1.3)" fill="none" stroke="{["#006bc7","#59616b","#006d32"][i]}" stroke-width="2"/>');ty+=48
   if name=='identifier' and i<2:text(x+width-12,y+30,'-',26,30)
   if name=='evidence':p.append(f'<path d="M{x+22} {y+62}v{max(30,height-76)}" stroke="#cbd5e1" stroke-width="3"/>')
   label=(str(i+1)+'  ' if name=='evidence' else '')+n['title'];used=text(x+18,ty,label,23,width-36);text(x+(40 if name=='evidence' else 18),ty+used,n['body'],20,width-(58 if name=='evidence' else 36))
  y+=height+20
 raw=f'<svg xmlns="{NS}" viewBox="0 0 900 {y*.9}" role="img" aria-labelledby="{prefix}title {prefix}desc"><title id="{prefix}title">{escape(v["caption"])}</title><desc id="{prefix}desc">{escape(v["description"])}</desc><g transform="scale(.9)" font-family="system-ui,sans-serif">'+''.join(p)+'</g></svg>'
 out=(sanitized_svg(raw,prefix)+'\n').encode();assert len(out)<100000;return out

def parse(lang,models):
 blocks=[];section=sub=0;suffix='zh-TW' if lang=='zh' else 'en'
 for chunk in re.split(r'\n\s*\n',(S/f'teaching.{suffix}.md').read_text().strip())[1:]:
  figure=re.fullmatch(r'\{\{figure:([a-z]+)\}\}',chunk)
  if figure:
   name=figure[1];blocks.append(dict(kind='visual',src=f'/images/ceh/m05-04-{name}-{lang}-v1-0-0.svg',downloadLabel='下載 SVG 圖解' if lang=='zh' else 'Download SVG diagram',visual=models[name][lang]))
  elif chunk.startswith('## '):section+=1;sub=0;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
  elif chunk.startswith('### '):sub+=1;blocks.append(dict(kind='paragraph',id=f'section-{section}-sub-{sub}',text=chunk[4:]))
  elif chunk.startswith('```'):blocks.append(dict(kind='code',text=chunk.split('\n',1)[1].rsplit('\n```',1)[0]))
  elif chunk.startswith('|'):
   rows=[[c.strip() for c in line.strip().strip('|').split('|')] for line in chunk.splitlines()];blocks.append(dict(kind='table',headers=rows[0],rows=rows[2:]))
  elif chunk.startswith('- ') or re.match(r'^\d+\. ',chunk):blocks.append(dict(kind='list',items=[re.sub(r'^(?:- |\d+\. )','',line) for line in chunk.splitlines()]))
  else:blocks.append(dict(kind='paragraph',text=chunk.removeprefix('> ')))
 assert section==9
 return dict(summary='分清漏洞編號、缺陷類型與產品名稱，以版本、設定及修補證據判斷掃描警告。' if lang=='zh' else 'Distinguish vulnerability identifiers, weakness types and product names; investigate scanner warnings using version, configuration and patch evidence.',sections=[],sourceBody=blocks)
def generate():
 models=build();t=dict(id='CEH26-M05-C04',revision=2,contentVersion='1.0.0',date='2026-11-08',status='published',publishedOn='2026-11-08',qa=[],text={lang:parse(lang,models) for lang in ['zh','en']})
 out={R/'content/concepts/ceh26-m05-c04.json':(json.dumps(t,ensure_ascii=False,indent=2)+'\n').encode()}
 for name,pair in models.items():
  for lang,v in pair.items():out[R/f'site/images/ceh/m05-04-{name}-{lang}-v1-0-0.svg']=svg(name,lang,v)
 return out
if __name__=='__main__':
 for path,data in generate().items():
  if '--check' in sys.argv:assert path.read_bytes()==data,path
  else:path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
