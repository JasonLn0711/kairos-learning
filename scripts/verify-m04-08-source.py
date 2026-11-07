"""Audit every supplied paragraph against the adopted body, figure, or explicit edit."""
from pathlib import Path
import re,json,hashlib,sys
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m04-08';V=S/'replacement-2026-11-07'
def norm(t):
 t=t.replace(chr(92),'')
 t=re.sub(r'^[| ]*\d+\. ','',t,flags=re.M)
 t=re.sub(r'^\s*\|[| :\-]+\|\s*$','',t,flags=re.M)
 return re.sub(r'[\s`*\\|#→·—，、：？。；「」（）()\-]+','',t)
body=json.loads((R/'content/concepts/ceh26-m04-c08.json').read_text())['text']['zh']['sourceBody']
def blocktext(b):
 if b['kind']=='list':return '\n'.join(b['items'])
 if b['kind']=='table':return '\n'.join(b['headers']+sum(b['rows'],[]))
 if b['kind']=='answer':return '\n'.join(b['paragraphs'])
 return b.get('text','')
figures={b['src'].split('m04-08-')[1].split('-zh-')[0]:b for b in body if b['kind']=='visual'}
# Exact flattened figure spans are replaced with the same model's selectable HTML and SVG.
ranges={1:[('directory','公司員工目錄','簡化的示意圖：真實企業目錄可能還有子部門、電腦、群組和多個網域。'),('parameters','## 一次 LDAP 查詢的四個問題','姓名、電子郵件'),('scope','### 用一個互動例子理解 Scope','會檢查 Lin、Chen 和研發小組這個項目，但不會進一步查到 Wang、Li。'),('result','LDAP Search Result','這是教學用合成資料，並非實際查詢結果。'),('paging','第 1 頁','每頁 100 筆是示例中的分頁大小，不代表實際總數。')],2:[('central','公司中央員工目錄','各系統可以透過 LDAP 向中央目錄查詢資料。實際登入與授權流程也可能使用 Kerberos 等其他協定。'),('entry','員工資料：小明','這是簡化的通用 LDAP 示意。不同目錄服務採用的帳號屬性不一定相同，例如 AD 常使用 sAMAccountName。'),('search','1\\. 應用程式或管理員','小明、小華、小美……以及查詢狀態')],3:[('sso','員工小明','如果所有系統都支援適當的 Kerberos 整合，就可以減少重複登入。'),('tickets','## Kerberos 的三階段票證流程','階段 3：服務身分驗證（AP Exchange）')]}
rows=[]
for n in [1,2,3]:
 raw=(V/f'pasted-text-{n}.txt').read_text();spans=[]
 for key,start,end in ranges[n]:
  a=raw.index(start);b=raw.index(end,a)+len(end);spans.append((a,b,key))
 current='top';index=0
 for match in re.finditer(r'\S[\s\S]*?(?=\n\s*\n|\Z)',raw):
  p=match[0].strip();index+=1
  if not p:continue
  row=dict(source=f'pasted-text-{n}.txt',paragraph=index,original=p)
  figure=next((key for a,b,key in spans if a<=match.start()<b),None)
  found=next((b for b in body if b['kind']!='visual' and norm(p) in norm(blocktext(b))),None)
  if figure:row.update(adoption='figure',target=figures[figure]['src'])
  elif p.startswith('[image](https://www.google.com/s2/favicons') or p in ['RFC Editor','RFC Editor+1','Microsoft Learn','Microsoft Learn+1']:row.update(adoption='citation-widget-replaced',target='section-8')
  elif p.startswith('# CEH M04-08'):row.update(adoption='public-title-normalized',target='top')
  elif p.startswith('本次依據 [CS Kairos'):row.update(adoption='self-reference-replaced-with-primary-source-scope',target='top')
  elif p.startswith('你可以直接回答 Q1'):row.update(adoption='conversation-replaced-with-editorial-answers',target='answer-ldap-completeness')
  elif p=='檢查答案與查看解析':row.update(adoption='native-reference-answer',target='answer-ldap-'+('ldap' if n==2 else 'kerberos'))
  elif 'https://www.rfc-editor.org/rfc/rfc4120?utm_source=chatgpt.com' in p:row.update(adoption='canonical-rfc-url',target='kerberos-introduction-sub-3')
  elif found:
   if found.get('id'):current=found['id']
   row.update(adoption='body-preserved',target=found.get('id',current))
  else:raise AssertionError(f'Unmapped source paragraph {n}:{index}: {p}')
  rows.append(row)
for name,digest in json.loads((V/'source-sha256.json').read_text()).items():assert hashlib.sha256((V/name).read_bytes()).hexdigest()==digest,name
payload=json.dumps(rows,ensure_ascii=False,indent=2)+'\n';path=V/'source-paragraph-map.json'
if '--check' in sys.argv:assert path.read_text()==payload,'Source mapping differs'
else:path.write_text(payload)
print(f'PASS: {len(rows)} source paragraphs individually mapped; 13 source hashes unchanged')
