"""Export the reviewed five-step figure from the public lesson model."""
import json,sys,textwrap
from html import escape
from pathlib import Path
lesson=json.loads(Path('content/aase/lessons/aase-m05-c04.json').read_text())
for lang in ('zh','en'):
 d=next(s for s in lesson['text'][lang]['sections'] if s['id']=='loop')['blocks'][0]
 assert d['kind']=='flow' and len(d['items'])==5
 out=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 900" role="img" aria-labelledby="title desc">',f'<title id="title">{escape(d["caption"])}</title>',f'<desc id="desc">{escape(d["description"])}</desc>','<rect x="4" y="4" width="832" height="892" rx="16" fill="#fbfcfc" stroke="#cbd5d8"/>']
 def label(value,y,size=18):
  lines=textwrap.wrap(value,33 if lang=='zh' else 68,break_long_words=False) or [value]
  for n,line in enumerate(lines):out.append(f'<text x="420" y="{y+n*28}" text-anchor="middle" font-family="sans-serif" font-size="{size}" fill="#18252c">{escape(line)}</text>')
  return len(lines)
 label(d['caption'],45,20)
 for i,item in enumerate(d['items']):
  y=95+i*145
  if i==4:out.append(f'<rect x="22" y="{y-30}" width="796" height="116" rx="12" fill="#eaf6f2" stroke="#cbded8"/>')
  label(f'{i+1}. '+item['title'],y)
  label(item['body'],y+36,16)
  if i<4:out.append(f'<path d="M420 {y+88}v23m-6-6 6 6 6-6" fill="none" stroke="#526168" stroke-width="2"/>')
 label(d['description'],830,16)
 out.append('</svg>');value='\n'.join(out)+'\n';assert len(value.encode())<100000
 p=Path(f'site/images/aase/m05-04-workflow-{lang}.svg')
 if '--check' in sys.argv:assert p.read_text()==value,p
 else:p.write_text(value)
 print(p,len(value.encode()))
