from pathlib import Path
from html import escape
import json,sys
P=Path(__file__).resolve().parents[1]/'docs/sources/m03-04'
models=json.loads((P/'diagram-models.json').read_text())
for src,m in models.items():
 name=src.split('m03-04-')[1];lang='zh-TW' if name.endswith('-zh-TW.svg') else 'en';name=name[:-len('-'+lang+'.svg')]
 o=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" role="img" aria-labelledby="title desc">',f'<title id="title">{escape(m["title"])}</title>',f'<desc id="desc">{escape(m["description"])}</desc>','<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#41617b"/></marker></defs>','<rect x="1" y="1" width="598" height="698" rx="20" fill="#f8fafc" stroke="#b7c7d5"/>']
 def text(y,t,size=18):o.append(f'<text x="300" y="{y}" text-anchor="middle" font-family="Noto Sans CJK TC,sans-serif" font-size="{size}" fill="#172b3a">{escape(t)}</text>')
 text(38,m['title'])
 for i,n in enumerate(m['nodes']):
  y=68+i*128;c=['#e8f2fb','#e7f3ed','#fff3d8','#e8f2fb'][i];o.append(f'<rect x="32" y="{y}" width="536" height="100" rx="14" fill="{c}" stroke="#7892a6"/>')
  for j,t in enumerate([n['title'],*n['body']]):text(y+29+j*27,t,18 if j==0 else 16)
  if i<3 and m['flow']:o.append(f'<path d="M300 {y+100}V{y+124}" fill="none" stroke="#41617b" stroke-width="2" marker-end="url(#arrow)"/>')
 for j,t in enumerate(m['footer']):text(608+j*26,t,16)
 o.append('</svg>');f=P/'figures'/f'{name}.{lang}.svg';value='\n'.join(o)
 if '--check' in sys.argv:assert f.read_text()==value,str(f)
 else:f.write_text(value)
