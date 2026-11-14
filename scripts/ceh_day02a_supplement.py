"""Adopt every supplied four-topic subsection next to the existing concept, without replacing it."""
import json,re,html
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/ceh-day02-a/2026-11-14/four-topics'
GROUPS=['intro','priority','sql','rdap','path','csrf','recap','checks']
REPLACEMENTS={
 '我核對了你提供的 CEH Day02-A 共 23 題，以及 EC-Council 的考試範圍。':'以下排序綜合供稿對 Day02-A 題組的描述，以及 CEH Exam Blueprint v5.0；本次未附完整23題，無法獨立重算題幹與選項的出現次數。',
 '本份 23 題： WHOIS 出現在 5 題的題幹或選項中，其中 P1-Q050 直接考網域註冊資料；RDAP 本身未出現在原始題目。其餘三項都只在 P3-Q005 出現一次，作為干擾選項。':'供稿記載的23題統計：WHOIS 出現在5題的題幹或選項，其中 P1-Q050 考網域註冊資料，RDAP 未出現在原題；其餘三項各在 P3-Q005 作為干擾選項出現1次。這些次數與題目轉述未附完整原題佐證，本文保留為供稿記載，不宣稱本次已逐題核對。',
 'Web Application Hacking 整個領域為 14%，但這不是 SQL Injection 單獨的配分。':'Web Application Hacking 整個領域為14%，涵蓋 Web Servers、Web Applications 與 SQL Injection 三個子領域，並非 SQL Injection 單獨的配分。',
 'P1-Q050 描述一名倫理駭客：':'供稿對 P1-Q050 的情境轉述如下（本次未附原題全文）：',
 '這是本份 P3-Q005 的重點。':'供稿將這個區分對應到 P3-Q005；以下依實際行為說明概念，原題全文未附。',
 '你的 Day02-A 第 16 題（P3-Q005）尤其值得記住：':'依供稿所述，Day02-A 第16題（P3-Q005）的觀念尤其值得記住：',
 '使用 HTTP(S) 和標準化的 JSON 資料結構。':'使用 HTTP 的查詢語意與標準化 JSON 回應，正式服務使用 HTTPS 保護傳輸。',
 '以下為簡化示意：':'以下為簡化欄位節選示意，不是完整的合規 RDAP 回應：',
 '提交 4 題答案並批改':'這四題供靜態自我檢核，先不公布答案；本頁不提供送出、批改或學習進度紀錄。',
 '學習完成標準：':'自我檢核目標：',
 }
def clean(s):
 s=html.unescape(s.replace('**','')).strip()
 for a,b in REPLACEMENTS.items():s=s.replace(a,b)
 return s.replace('?utm_source=chatgpt.com','')
def adopt_supplement(result,save):
 raw=(SOURCE/'pasted-text-1.txt').read_text();lines=raw.splitlines();figs=json.loads((SOURCE/'figures.json').read_text());groups={k:[] for k in GROUPS};group='intro';groups['intro']=[dict(kind='heading',id='p1-supp-intro',text='四個觀念的補充精讀與閱讀順序')];chapter=0;counts={};ledger=[];i=1
 def push(b):groups[group].append(b)
 spans={'不安全的資料處理流程':('在資訊安全中',1),'檔案目錄示意':('如果程式沒有適當限制路徑',2),'**Alice 已登入銀行網站**':('CSRF 最重要的概念是：',3)}
 noise={'cert.eccouncil.org','OWASP Web Security Testing Guide','OWASP Cheat Sheet Series','ICANN'}
 while i<len(lines):
  start=i;s=lines[i].strip();i+=1
  if not s:continue
  treatment='正文';anchor=f'p1-supp-{group}'
  if s in spans:
   ending,num=spans[s]
   while i<len(lines) and not lines[i].startswith(ending):i+=1
   push(figs[num]);treatment=f'重製圖{num+4}'
  elif s.startswith('[image](') or s in noise:treatment='移除匯出來源卡與favicon，原稿保留'
  elif s.startswith('## '):
   chapter+=1;group=GROUPS[chapter];anchor=f'p1-supp-{group}'
   push(dict(kind='heading',id=anchor,text=clean(s[3:])))
  elif s.startswith('###'):
   counts[group]=counts.get(group,0)+1;anchor=f'p1-supp-{group}-{counts[group]:02d}'
   push(dict(kind='heading',id=anchor,text=f'{dict(sql="SQL Injection",rdap="RDAP",path="Directory Traversal",csrf="CSRF")[group]}｜'+clean(s.lstrip('# '))))
  elif s.startswith('```'):
   code=[]
   while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
   assert i<len(lines);i+=1;value='\n'.join(code)
   if value.startswith('# 不安全的程式設計sql ='):value=value.replace('# 不安全的程式設計sql =','# 不安全的程式設計：以下為查詢片段\nsql =')
   if value.startswith('# 使用 Python sqlite3 的安全查詢方式cursor.execute'):
    value='# 使用 Python sqlite3 的參數化查詢片段\ncursor.execute(\n    "SELECT * FROM users WHERE username = ?",\n    (username,),\n)'
   push(dict(kind='code',text=value))
  elif s.startswith('|'):
   rows=[s]
   while i<len(lines) and lines[i].strip().startswith('|'):rows.append(lines[i].strip());i+=1
   if group=='priority':push(figs[0]);treatment='重製圖4：完整四欄表與40/30/15/15比例條'
   else:
    cells=lambda r:[clean(c) for c in r.strip('|').split('|')]
    push(dict(kind='table',headers=cells(rows[0]),rows=[cells(r) for r in rows[2:]]))
  elif s.startswith('- '):
   items=[clean(s[2:])]
   while i<len(lines) and lines[i].strip().startswith('- '):items.append(clean(lines[i].strip()[2:]));i+=1
   push(dict(kind='list',items=items))
  else:push(dict(kind='paragraph',text=clean(s.removeprefix('> '))))
  for j in range(start,i):
   if lines[j].strip():ledger.append(dict(line=j+1,source=lines[j],anchor=anchor,treatment=treatment))
 assert chapter==7 and counts==dict(sql=4,rdap=4,path=3,csrf=3)
 # Contextual insertion retains every original block; split just the three-item definition list.
 byid={s['id']:s for s in result['sections']}
 byid['p1-section-02']['body']+=groups['intro']+groups['priority']
 body=byid['p1-section-05']['body'];pos=next(i for i,b in enumerate(body) if b['kind']=='heading' and b['text'].startswith('2. DNS'))
 body[pos:pos]=groups['rdap']
 body=byid['p1-section-07']['body'];pos=next(i for i,b in enumerate(body) if b['kind']=='list' and b['items'][0].startswith('Directory Traversal：'))
 old=body[pos];insert=[]
 for item,key in zip(old['items'],['path','sql','csrf']):insert+=[dict(kind='list',items=[item])]+groups[key]
 body[pos:pos+1]=insert+groups['recap']
 byid['p1-section-13']['body']+=groups['checks']
 result['revision']=3;result['contentVersion']='1.1.0'
 result['summary']+=' 補充 RDAP、SQL Injection、Directory Traversal 與 CSRF 的辨識、原理與防禦。'
 result['sources']+=json.loads((SOURCE/'references.json').read_text())
 save(SOURCE/'line-adoption.json',ledger);save(SOURCE/'editorial-replacements.json',REPLACEMENTS)
 save(SOURCE/'adopted-groups.json',groups)
 print('Four topics: 7 source sections, 14 subsections, 4 figures, 4 unanswered checks; contextual insertion')
 return figs
