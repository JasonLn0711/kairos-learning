"""Build M04-09 from paired manuscripts and bounded diagram data."""
from pathlib import Path
from html import escape
import json,re,sys,unicodedata
from m0903_svg import sanitized_svg,NS
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m04-09'
COUNTS={'roles':6,'stages':3,'ladder':5,'stratum':4,'ntp-network':14,'ike':3,'sip':2,'bgp':4,'telnet':2,'tftp':2,'report':3}
ANSWERS={
'zh':[
'答案 B。IKE_SA_INIT 回應只確認初始協商有回覆。A 還缺成功驗證身分的證據；C 也缺實際內網資源存取與授權證據。',
'答案 B。SIP 訊令與語音媒體是兩條不同的工作線。A 將訊令 TLS 擴大成所有語音加密；C 只憑 5061 埠號也無法證明實際媒體保護。須另外確認 SRTP 等保護及金鑰協商。',
'答案 C。本機目前有兩筆鄰居快取。A 無法代表完整設備數量；B 也不能從缺少快取推論其他設備被隱藏。尚未通訊、快取過期與同機多位址都影響紀錄。',
'答案 B。伺服器設定及檔案權限仍限制可讀取的範圍。A 把沒有登入機制當成無限制讀取；C 更把回應擴大成任意修改。基本 TFTP 也沒有目錄瀏覽功能。'],
'en':[
'Answer B. An IKE_SA_INIT reply establishes only a response to initial negotiation. A lacks successful authentication evidence; C also lacks actual authorized internal-resource access evidence.',
'Answer B. SIP signaling and voice media are separate flows. A expands signaling TLS into encryption of all audio; C infers media protection from port 5061 alone. Check protection such as SRTP and key negotiation separately.',
'Answer C. The local computer currently has two neighbor-cache records. A does not establish the complete device count; B cannot infer hidden devices from missing records. No prior communication, cache expiry and multiple addresses per device all affect the records.',
'Answer B. Server configuration and file permissions still restrict readable files. A treats no sign-in as unrestricted reading; C expands a response into arbitrary modification. Basic TFTP also lacks directory browsing.']}
REFS={3:[5905],4:[7296,4301],5:[3261,3550,3711],6:[4291,4861,4890],7:[4271,5398,6811],8:[854,1350,4251]}
def parse(lang,models):
 suffix='zh-TW' if lang=='zh' else 'en';chunks=re.split(r'\n\s*\n',(S/f'teaching.{suffix}.md').read_text().strip())[1:];blocks=[];section=sub=0
 def refs(n):
  if n in REFS:blocks.append(dict(kind='paragraph',text=' · '.join(f'[RFC {n}](https://www.rfc-editor.org/rfc/rfc{n}.html)' for n in REFS[n])))
 for chunk in chunks:
  figure=re.fullmatch(r'\{\{figure:([a-z-]+)\}\}',chunk);answer=re.fullmatch(r'\{\{answer:([1-4])\}\}',chunk)
  if figure:
   name=figure[1];v=models[name][lang];assert len(v['items'])==COUNTS[name]
   blocks.append(dict(kind='visual',src=f'/images/ceh/m04-09-{name}-{lang}-v1-1-0.svg',downloadLabel='下載 SVG 圖解' if lang=='zh' else 'Download SVG diagram',visual=v))
  elif answer:blocks.append(dict(kind='answer',id='answer-m0409-'+answer[1],summary='參考答案與解析' if lang=='zh' else 'Reference answer and explanation',paragraphs=[ANSWERS[lang][int(answer[1])-1]]))
  elif chunk.startswith('```'):
   assert chunk.endswith('```');blocks.append(dict(kind='code',text=chunk.split('\n',1)[1].rsplit('```',1)[0].strip()))
  elif chunk.startswith('## '):
   refs(section);section+=1;sub=0;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
  elif chunk.startswith('### '):
   sub+=1;blocks.append(dict(kind='paragraph',id=f'section-{section}-sub-{sub}',text=chunk[4:]))
  elif chunk.startswith('|'):
   rows=[[c.strip() for c in line.strip().strip('|').split('|')] for line in chunk.splitlines()];blocks.append(dict(kind='table',headers=rows[0],rows=rows[2:]))
  elif chunk.startswith('- '):blocks.append(dict(kind='list',items=[line[2:] for line in chunk.splitlines()]))
  else:blocks.append(dict(kind='paragraph',text=chunk.removeprefix('> ')))
 refs(section);assert section==11
 return dict(summary='分開判讀七組協定的服務回應、身分驗證與實際權限，讓列舉結論符合證據。' if lang=='zh' else 'Distinguish service responses, authentication and actual permissions across seven protocol groups, so enumeration conclusions fit the evidence.',sections=[],sourceBody=blocks)
def wrap(text,width,size):
 # Conservative character widths; browser tests check the actual font's bounds.
 limit=width/size;lines=[];line='';used=0
 for word in re.findall(r'[\u2e80-\uffff]|[^\s\u2e80-\uffff]+\s*|\s',text):
  cost=sum(1 if unicodedata.east_asian_width(c) in 'WF' else .62 for c in word)
  if line and used+cost>limit:lines.append(line.strip());line='';used=0
  line+=word;used+=cost
 if line.strip():lines.append(line.strip())
 return lines
def svg(name,lang,v):
 prefix=f'm0409-{name}-{lang}-';parts=[];width=1000
 def text(x,y,value,size=20,w=900):
  lines=wrap(value,w,size)
  for i,line in enumerate(lines):parts.append(f'<text x="{x}" y="{y+i*size*1.6}" font-family="Noto Sans CJK TC,sans-serif" font-size="{size}" fill="#183b59">{escape(line)}</text>')
  return len(lines)*size*1.6
 def box(x,y,w,item,fill='#f1f6fa',h=None):
  titlelines=wrap(item['title'],w-32,23);bodylines=[line for p in item['body'].split('\n\n') for line in wrap(p,w-32,20)]
  height=max(h or 0,40+len(titlelines)*36+len(bodylines)*32)
  parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{height}" rx="16" fill="{fill}" stroke="{'#387c65' if fill=='#e4f3eb' else '#47748e'}" stroke-width="2"/>')
  yy=y+32
  for line in titlelines: text(x+16,yy,line,23,w-32);yy+=36
  for line in bodylines:text(x+16,yy,line,20,w-32);yy+=32
  return height
 def path(d,arrow=False,dash=False):parts.append(f'<path d="{d}" fill="none" stroke="#47748e" stroke-width="3"'+(' stroke-dasharray="7 5"' if dash else '')+(f' marker-end="url(#{prefix}arrow)"' if arrow else '')+'/>')
 y=40+text(28,38,v['caption'],26,944)+20
 items=v['items']
 if name=='bgp':
  # Four named corners retain the reference diamond; endpoint text also survives mobile reflow.
  w=280
  hs=[40+len(wrap(i['title'],w-32,23))*36+sum(len(wrap(p,w-32,20)) for p in i['body'].split('\n\n'))*32 for i in items]
  h=max(hs);top=y;middle=top+h+75;bottom=middle+h+75
  positions=[(30,middle),(360,top),(690,middle),(360,bottom)]
  for x1,y1,x2,y2 in [(310,middle+h/2,360,top+h/2),(640,top+h/2,690,middle+h/2),(690,middle+h,640,bottom+h/2),(360,bottom+h/2,310,middle+h)]:path(f'M{x1} {y1}L{x2} {y2}',True)
  for (x,yy),item in zip(positions,items):box(x,yy,w,item,h=h)
  y=bottom+h+30
 elif name in ['roles','stages','ike','telnet','tftp']:
  cols=3 if name in ['stages','ike'] else 2;gap=35;w=(920-gap*(cols-1))/cols
  for start in range(0,len(items),cols):
   row=items[start:start+cols]
   h=max(40+len(wrap(item['title'],w-32,23))*36+sum(len(wrap(p,w-32,20)) for p in item['body'].split('\n\n'))*32 for item in row)
   for i,item in enumerate(row):
    x=40+i*(w+gap);box(x,y,w,item,h=h)
    if i and v['kind']=='flow':path(f'M{x-gap+5} {y+h/2}H{x-5}',True)
   y+=h+25
 elif name=='ntp-network':
  groups=[items[:1],items[1:3],items[3:5],items[5:9],items[9:14]]
  for n,group in enumerate(groups):
   if n:y+=20;path(f'M500 {y-20}V{y+10}',True);y+=35
   cols=len(group);w=(920-20*(cols-1))/cols
   heights=[40+len(wrap(t['title'],w-32,23))*36+sum(len(wrap(p,w-32,20)) for p in t['body'].split('\n\n'))*32 for t in group];h=max(heights)
   parts.append(f'<rect x="20" y="{y}" width="960" height="{h+65}" rx="15" fill="#f8fafb" stroke="#47748e" stroke-width="2" stroke-dasharray="7 5"/>');text(40,y+28,'Stratum '+str(n)+('  ↔' if n in [1,2,3] else ''),20);y+=45
   for i,item in enumerate(group):box(40+i*(w+20),y,w,item,'#e4f3eb' if n%2 else '#eef5fc',h)
   y+=h+20
 else:
  for i,item in enumerate(items):
   if i and v['kind']=='flow':path(f'M500 {y-8}V{y+22}',True);y+=38
   y+=box(40,y,920,item,'#e4f3eb' if i==len(items)-1 else '#f1f6fa')+20
 y+=40;textheight=text(28,y,v['description'],20,944);height=y+textheight+20
 raw=f'<svg xmlns="{NS}" viewBox="0 0 900 {height*.9}" role="img" aria-labelledby="{prefix}title {prefix}desc"><title id="{prefix}title">{escape(v["caption"])}</title><desc id="{prefix}desc">{escape(v["description"])}</desc><defs><marker id="{prefix}arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#47748e"/></marker></defs>'+'<g transform="scale(0.9)">'+''.join(parts)+'</g></svg>'
 result=(sanitized_svg(raw,prefix)+'\n').encode();assert len(result)<100000;return result

def generate():
 models=json.loads((S/'diagrams.json').read_text());assert set(models)==set(COUNTS)
 t=dict(id='CEH26-M04-C09',revision=2,contentVersion='1.1.0',date='2026-11-07',status='published',publishedOn='2026-11-07',qa=[],text={lang:parse(lang,models) for lang in ['zh','en']})
 targets={R/'content/concepts/ceh26-m04-c09.json':(json.dumps(t,ensure_ascii=False,indent=2)+'\n').encode()}
 for name,pair in models.items():
  for lang,v in pair.items():targets[R/f'site/images/ceh/m04-09-{name}-{lang}-v1-1-0.svg']=svg(name,lang,v)
 return targets
if __name__=='__main__':
 for p,data in generate().items():
  if '--check' in sys.argv:assert p.read_bytes()==data,p
  else:p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
