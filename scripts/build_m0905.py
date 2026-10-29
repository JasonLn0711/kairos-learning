from pathlib import Path
import json,re
from m0905_svg import generate
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'docs/sources/m09-05'
NAMES=['map','access','identity','evidence']
SUPPORT=json.loads((SRC/'visual-reading-support.json').read_text())
def parse(lang):
 suffix='zh-TW' if lang=='zh' else 'en'
 lines=(SRC/f'M09-05-teaching.{suffix}.md').read_text().splitlines();out=[];i=0;heading=0
 while i<len(lines):
  s=lines[i].strip()
  if not s:i+=1;continue
  if s.startswith('## '):
   heading+=1
   if heading==9:out+=answers(suffix)
   out.append({'kind':'heading','id':f'section-{heading}','text':s[3:]});i+=1;continue
  if s.startswith('### '):out.append({'kind':'paragraph','text':s[4:]});i+=1;continue
  if s.startswith('# '):out.append({'kind':'paragraph','text':s[2:]});i+=1;continue
  if s.startswith('!['):
   m=re.match(r'!\[(.*?)\]\(figures/(.*?)\.(?:zh-TW|en)\.svg\)',s);name=m[2];num=NAMES.index(name)+1
   svg=__import__('xml.etree.ElementTree',fromlist=['ElementTree']).fromstring((SRC/f'figures/{name}.{suffix}.svg').read_text())
   labels=[''.join(n.itertext()) for n in svg.iter() if n.tag.endswith('}text')]
   out.append({'kind':'visual','src':f'/images/ceh/m09-05-{name}-{lang}.svg','downloadLabel':'下載 SVG 圖檔' if lang=='zh' else 'Download SVG diagram','visual':{'kind':'cards','caption':m[1],'description':labels[2],'items':[{'title':a,'body':b} for a,b in SUPPORT[lang][num-1]]}});i+=1;continue
  if s.startswith('|'):
   rows=[]
   while i<len(lines) and lines[i].strip().startswith('|'):
    row=[x.strip() for x in lines[i].strip().strip('|').split('|')]
    if not all(re.fullmatch(r':?-+:?',x) for x in row):rows.append(row)
    i+=1
   out.append({'kind':'table','headers':rows[0],'rows':rows[1:]});continue
  if re.match(r'(?:- |\d+\. )',s):
   items=[]
   while i<len(lines) and re.match(r'(?:- |\d+\. )',lines[i].strip()):
    item=lines[i].strip();items.append(item[2:] if item.startswith('- ') else item);i+=1
   out.append({'kind':'list','items':items});continue
  para=[s];i+=1
  while i<len(lines) and lines[i].strip() and not re.match(r'(?:#|!\[|\||- |\d+\. )',lines[i].strip()):para.append(lines[i].strip());i+=1
  out.append({'kind':'paragraph','text':' '.join(para)})
 return out
def answers(suffix):
 text=(SRC/f'M09-05-reference-answers.{suffix}.md').read_text();result=[]
 for n,part in enumerate(re.split(r'^## ',text,flags=re.M)[1:],1):
  title,*paras=part.strip().split('\n\n');title=title.strip()
  result.append({'kind':'answer','id':['answer-boundary','answer-evidence','answer-response'][n-1],'summary':('參考解答：' if suffix=='zh-TW' else 'Reference explanation: ')+title,'paragraphs':[x.strip() for x in paras if x.strip()]})
 return result
obj={'id':'M09-05','revision':1,'contentVersion':'1.0.0','date':'2026-10-29','status':'published','publishedOn':'2026-10-29','qa':[],'text':{}}
for lang in ['zh','en']:
 obj['text'][lang]={'summary':'分清人、帳號、身分與授權，理解內部威脅與身分竊用的差異，以分層防護及證據驗證避免過早歸因。' if lang=='zh' else 'Separate people, accounts, identity and authorization to understand insider threats and identity theft, layered controls and careful evidence interpretation.','sections':[],'sourceBody':parse(lang)}

def clean(x):
 if isinstance(x,str):return x.replace('**','')
 if isinstance(x,list):return [clean(i) for i in x]
 if isinstance(x,dict):return {k:clean(v) for k,v in x.items()}
 return x
obj=clean(obj)
for lang in ['zh','en']:
 obj['text'][lang]['sourceBody'].append({'kind':'paragraph','text':'[下載本課四張中英文 SVG 圖檔](https://learn.cs-kairos.com/downloads/ceh-m09-05-bilingual-svg.zip)' if lang=='zh' else '[Download all four diagrams in Chinese and English (SVG ZIP)](https://learn.cs-kairos.com/downloads/ceh-m09-05-bilingual-svg.zip)'})
for lang in ['zh','en']:
 prefix='' if lang=='zh' else 'en/'
 links=[]
 for cid in ['M09-01','M09-02','M09-03','M09-04','M01-01','M01-02','M01-03','M01-06','M01-07']:
  links.append(f'[{cid}](https://learn.cs-kairos.com/{prefix}courses/ceh/v13/{cid[:3].lower()}/concepts/{cid.lower()}/)')
 obj['text'][lang]['sourceBody'].append({'kind':'paragraph','text':('延伸閱讀：' if lang=='zh' else 'Related reading: ')+' · '.join(links)})
(ROOT/'content/concepts/m09-05.json').write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
import subprocess
subprocess.run(['python3',str(ROOT/'scripts/m0905_svg.py')],check=True)
print({lang:len(obj['text'][lang]['sourceBody']) for lang in obj['text']})

import zipfile
with zipfile.ZipFile(ROOT/'site/downloads/ceh-m09-05-bilingual-svg.zip','w',zipfile.ZIP_DEFLATED) as z:
 for asset in sorted((ROOT/'site/images/ceh').glob('m09-05-*.svg')):
  info=zipfile.ZipInfo(asset.name,(2026,10,29,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16;z.writestr(info,asset.read_bytes())
