"""Generate paired M03-08 HTML-model downloads with the existing safe serializer.

The JSON model supplies all titles, captions and nodes to both the sourceBody
HTML flow and these standalone SVGs. No arbitrary runtime SVG is accepted.
"""
from pathlib import Path
from html import escape
import json,re,sys,unicodedata,zipfile,io,xml.etree.ElementTree as ET
from m0903_svg import sanitized_svg,NS
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/m03-08'

def width(text):
 return sum(2 if unicodedata.east_asian_width(c) in 'WF' else 1 for c in text)

def wrap(text,limit):
 # Chinese may wrap between characters; English stays at spaces.
 mixed=any(unicodedata.east_asian_width(c) in 'WF' for c in text)
 tokens=re.findall(r'[A-Za-z0-9_./:|\-]+|.',text) if mixed else text.split(' ')
 join='' if mixed else ' '
 lines=[];current=''
 for token in tokens:
  candidate=current+join+token if current else token
  if current and width(candidate)>limit:lines.append(current);current=token
  else:current=candidate
 if current:lines.append(current)
 assert all(width(line)<=limit for line in lines),(text,lines)
 return lines

def make_svg(name,lang,block):
 v=block['visual'];prefix=f'm0308-{name}-{lang}-';nodes=v['items']
 assert block['kind']=='visual' and v['kind']=='cards' and len(nodes)==5
 assert list(block)==['kind','src','downloadLabel','visual']
 assert list(v)==['kind','caption','description','items']
 assert all(set(n)=={'title','body'} and all(isinstance(t,str) and '<' not in t for t in n.values()) for n in nodes)
 height=900 if name=='roles' else 1050
 out=[f'<svg xmlns="{NS}" viewBox="0 0 1200 {height}" role="img" aria-labelledby="{prefix}title {prefix}desc">',f'<title id="{prefix}title">{escape(v["caption"])}</title>',f'<desc id="{prefix}desc">{escape(v["description"])}</desc>',f'<defs><marker id="{prefix}arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2460ce"/></marker><marker id="{prefix}copy" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#008475"/></marker></defs>',f'<rect x="1" y="1" width="1198" height="{height-2}" rx="20" fill="#f5f8fb" stroke="#b7c9df"/>']
 def text(x,y,s,size=18,color='#172b49'):
  assert 12<=y<=height-12
  out.append(f'<text x="{x}" y="{y}" font-family="Noto Sans CJK TC,sans-serif" font-size="{size}" fill="{color}">{escape(s)}</text>')
 def lines(x,y,s,limit,size=18):
  for i,line in enumerate(wrap(s,limit)):text(x,y+i*29,line,size)
 def card(i,x,y,w,h,limit):
  n=nodes[i];color=['#2460ce','#ad6700','#bd3443','#008475','#008475'][i]
  out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="#ffffff" stroke="#9db3cd"/>')
  out.append(f'<path d="M{x+3} {y+12}V{y+h-12}" stroke="{color}" stroke-width="6"/>')
  title=wrap(n['title'],limit);body=wrap(n['body'],limit)
  assert 25+len(title)*29+15+len(body)*29<h,(name,lang,i,body)
  lines(x+18,y+32,n['title'],limit,19);lines(x+18,y+47+len(title)*29,n['body'],limit)
 def arrow(path,copy=False):out.append(f'<path d="{path}" fill="none" stroke="{"#008475" if copy else "#2460ce"}" stroke-width="3"'+(' stroke-dasharray="8 7"' if copy else '')+f' marker-end="url(#{prefix}{"copy" if copy else "arrow"})"/>')
 lines(30,43,v['caption'],100,25);lines(30,94,v['description'],105)
 if name=='roles':
  for i,x in enumerate([30,330,630,930]):card(i,x,235,240,280,21)
  for x in [270,570,870]:arrow(f'M{x} 350H{x+60}')
  arrow('M300 350V650H440',True)
  text(40,600,'防火牆前的鏡像副本' if lang=='zh' else 'Copy before firewall',18,'#006a60')
  card(4,440,570,730,170,70)
  lines(30,800,'IDS 的 Alert ≠ IPS／Firewall 的 Drop；須核對實際位置、模式與動作。' if lang=='zh' else 'IDS Alert ≠ IPS/Firewall Drop. Verify actual placement, mode and action.',105)
 else:
  text(30,210,'第一層：觀察到的現象' if lang=='zh' else 'Layer 1: observations',22)
  card(0,30,240,540,175,49);card(1,630,240,540,175,49)
  # Both observations feed one shared verification step, not one-to-one pairings.
  arrow('M300 415V465H600V510');arrow('M900 415V465H600')
  text(30,550,'第二層：共同交叉核對防護與服務端' if lang=='zh' else 'Layer 2: cross-check both protection and server records',22)
  card(2,30,580,540,195,49);card(3,630,580,540,195,49)
  arrow('M300 775V805H600V840');arrow('M900 775V805H600')
  card(4,30,850,1140,175,109)
 out.insert(4,'<g transform="scale(0.75)">');out.append('</g></svg>');out[0]=out[0].replace(f'1200 {height}',f'900 {height*0.75:g}');result=sanitized_svg('\n'.join(out),prefix)+'\n'
 assert len(result.encode())<100000
 return result.encode()

def generate():
 assert wrap('核對NAT',6)==['核對','NAT']
 assert wrap('match FW-17 rule',11)==['match FW-17','rule']
 models=json.loads((SOURCE/'diagram-models.json').read_text());assert set(models)=={'roles','evidence'}
 targets={};assets={}
 for name,langs in models.items():
  assert set(langs)=={'zh','en'}
  for lang,block in langs.items():
   assert block['src']==f'/images/ceh/m03-08-{name}-{lang}.svg'
   value=make_svg(name,lang,block);filename=Path(block['src']).name
   assets[filename]=value
   targets[ROOT/'site'/block['src'].lstrip('/')]=value
   targets[SOURCE/'figures'/filename]=value
 archive=io.BytesIO()
 with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
  for name,value in sorted(assets.items()):
   info=zipfile.ZipInfo(name,date_time=(2026,11,4,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16;z.writestr(info,value)
 targets[ROOT/'site/downloads/ceh-m03-08-bilingual-svg.zip']=archive.getvalue()
 return targets

if __name__=='__main__':
 for path,value in generate().items():
  if '--check' in sys.argv:assert path.read_bytes()==value,str(path)
  else:path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(value)
  print(f'{path.relative_to(ROOT)}: {len(value)} bytes')
 print('PASS: paired native-flow model, strict SVG sanitizer, bounded geometry/line lengths, deterministic assets. Browser viewport/visual checks remain pending.')
