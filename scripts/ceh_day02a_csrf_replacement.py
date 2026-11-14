"""Replace the prior CSRF supplements with the supplied complete, collapsible part."""
import html,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/ceh-day02-a/2026-11-14/csrf-replacement'
REPLACEMENTS={
 '提交作答並解析':'三個情境各有三個選項，供靜態自我檢核；先自行記錄選擇與理由，再與教師討論。本頁不提交、批改或記錄已理解狀態。',
 '如果這三題能清楚說出原因，而不只是選出答案，便代表你已經把 CSRF 最核心的三個概念——跨網站 Request、Cookie 自動附帶、Server 端請求驗證——真正連接起來了。':'這三題用來檢查能否串接跨網站 Request、Cookie 自動附帶與 Server 端請求驗證；需要實際回答及核對推理，不能僅憑閱讀或展開本part認定已經理解。',
 '是，但主要隔離的是不同 Origin 的資料與程式存取權限，不是禁止所有跨網站網路請求。':'不同 Origin 通常受到資料與程式存取限制；Tab、Origin、Site與程序沙盒不是同一個邊界，也不是禁止所有跨網站網路請求。',
}
def clean(value):
 value=html.unescape(value.replace('**','')).strip().removeprefix('> ')
 value=re.sub(r'\?utm_source=chatgpt.com','',value)
 for a,b in REPLACEMENTS.items():value=value.replace(a,b)
 return value

def replace_csrf(result,save):
 lines=(SOURCE/'pasted-text-1.txt').read_text().splitlines();figures=json.loads((SOURCE/'figures.json').read_text());blocks=[];ledger=[];repairs=[];headings=[]
 chapter=0;sub=0;codes=0;tables=0;i=1;anchor='p1-csrf-browser-intro'
 ledger.append(dict(line=1,source=lines[0],anchor=anchor,treatment='part標題'))
 blocks.append(dict(kind='paragraph',text='展開這個part，可依序閱讀瀏覽器、Session、Cookie與CSRF的完整流程及圖解。以下使用虛構網域、帳號與Session示意值；HTTP／表單／偽碼用於解釋機制，不會在本頁執行交易。三個情境題保留未公布答案，與原五題、四道選擇題、參數化兩題及缺件23題分開計數。'))
 spans=[('**Alice 的電腦：同一個瀏覽器**','這張架構圖要記住三件事。',0),('**情境 A：新聞網站提供外部連結**','所以，跨網站發 Request',1),('這時發出 Request 的過程是：','### **第三步：',3),('一次廣泛的 CSRF 嘗試可能產生的結果','這是網路攻擊裡',4),('決策 1：網頁能不能發起這個操作？','這三個決策是',6)]
 starts={}
 for start,end,n in spans:
  a=next(j for j,l in enumerate(lines) if l==start or l.startswith(start));z=next(j for j in range(a+1,len(lines)) if lines[j].startswith(end));starts[a]=(z,n)
 while i<len(lines):
  start=i;s=lines[i].strip();i+=1
  if not s:continue
  treatment='完整正文'
  if start in starts:
   i,n=starts[start];blocks.append(figures[n]);treatment=f'同位置CSRF圖{n+1}，保留原圖全部教學欄位'
  elif s.startswith('\\#chatgpt-mermaid-'):
   n=2 if 'Alice 登入銀行' in s else 5
   assert ('Alice 登入銀行' in s) or ('CSRF 攻擊要成功' in s)
   blocks.append(figures[n]);treatment=f'依PNG重繪CSRF圖{n+1}；匯出CSS不作任意HTML採用'
  elif s.startswith('[image](') or re.fullmatch(r'(MDN|OWASP Cheat Sheet Series|pages.nist.gov)(\+\d+)?',s):treatment='移除匯出來源卡；保留原稿並使用正式來源連結'
  elif s.startswith('## '):
   chapter+=1;anchor=f'p1-csrf-browser-section-{chapter:02d}';title=clean(s[3:]);blocks.append(dict(kind='heading',id=anchor,text=title));headings.append(dict(line=start+1,anchor=anchor,title=title))
  elif s.startswith('### '):
   sub+=1;anchor=f'p1-csrf-v2-subsection-{sub:02d}';title=clean(s[4:]);blocks.append(dict(kind='heading',id=anchor,text=title));headings.append(dict(line=start+1,anchor=anchor,title=title))
  elif s.startswith('```'):
   codes+=1;value=[]
   while i<len(lines) and not lines[i].startswith('```'):value.append(lines[i]);i+=1
   assert i<len(lines);i+=1;original='\n'.join(value);value=original
   if 'Set-Cookie:' in value:value=re.sub(r';\n\s+','; ',value)
   if value.startswith('session = find_session'):
    value='session = find_session(request.cookies["__Host-sid"])\nif session.is_authenticated:\n    transfer_money(\n        recipient=request.form["recipient"],\n        amount=request.form["amount"],\n    )'
   if value!=original:repairs.append(dict(line=start+1,original=original,adopted=value,reason='修復Set-Cookie換行或黏合偽碼；保留示意語意'))
   blocks.append(dict(kind='code',text=value))
   if value.startswith('session = find_session'):blocks.append(dict(kind='paragraph',text='這段是不完整的反例偽碼，只展示只驗Session的缺陷；實際應用還要處理查無Session、權限、防偽及交易確認，不能直接當成完整可執行的安全實作。'))
   if 'body: ...' in value:blocks.append(dict(kind='paragraph',text='此片段的省略號表示尚未填入的操作資料，只用來示意公開程式可能揭露Endpoint，不能直接執行或證明該端點有漏洞。'))
  elif s.startswith('|'):
   rows=[s]
   while i<len(lines) and lines[i].strip().startswith('|'):rows.append(lines[i].strip());i+=1
   cell=lambda r:[clean(c) for c in r.strip('|').split('|')]
   blocks.append(dict(kind='table',headers=cell(rows[0]),rows=[cell(r) for r in rows[2:]]));tables+=1
  elif s.startswith('- '):
   items=[clean(s[2:])]
   while i<len(lines) and lines[i].strip().startswith('- '):items.append(clean(lines[i].strip()[2:]));i+=1
   blocks.append(dict(kind='list',items=items))
  else:
   blocks.append(dict(kind='paragraph',text=clean(s)))
   if clean(s).startswith('Cookie 若未設定'):
    blocks.append(dict(kind='paragraph',text='支援__Host-前綴的瀏覽器要求Secure、Path=/且不得指定Domain；Path是Cookie傳送匹配，並非安全隔離。Cookie不以Port分隔，這與Origin的Scheme／Host／Port判斷不同。'))
   if clean(s).startswith('Session Cookie 通常主要解決'):
    blocks.append(dict(kind='paragraph',text='Session識別碼建立的是身分關聯；資源歸屬與每次操作的Authorization仍須由Server另行檢查，不能因為持有Session就略過權限檢查。'))
  for j in range(start,i):
   if lines[j].strip():ledger.append(dict(line=j+1,source=lines[j],anchor=anchor,treatment=treatment))
 assert chapter==14 and sub==26,(chapter,sub)
 assert codes==24 and tables==8,(codes,tables)
 assert sum(b['kind']=='diagram' for b in blocks)==7
 assert len(ledger)==sum(bool(l.strip()) for l in lines)
 web=next(s for s in result['sections'] if s['id']=='p1-section-07')['body']
 groups=json.loads((ROOT/'docs/sources/ceh-day02-a/2026-11-14/four-topics/adopted-groups.json').read_text())['csrf']
 old=json.loads((ROOT/'docs/sources/ceh-day02-a/2026-11-14/csrf-browser/adopted-body.json').read_text())
 removed=[]
 for group in [old,groups]:
  at=next(j for j in range(len(web)) if web[j:j+len(group)]==group)
  removed+=web[at:at+len(group)];del web[at:at+len(group)]
 # The original short definition and all non-CSRF prose stay in their existing chapter.
 part=dict(id='p1-csrf-browser-intro',heading=clean(lines[0].lstrip('# ')),collapsible=True,aliases=[b['id'] for b in old+groups if b.get('id') and not b['id'].startswith('p1-csrf-browser-section-') and b['id']!='p1-csrf-browser-intro'],body=blocks)
 position=next(j for j,s in enumerate(result['sections']) if s['id']=='p1-section-07')+1
 result['sections'].insert(position,part)
 result['contentVersion']='1.4.0';result['revision']=6
 result['summary']=result['summary'].replace(' 再追蹤瀏覽器、Session Cookie、同源政策與 CSRF 防偽的完整流程。',' 以獨立CSRF完整教學串接瀏覽器、Cookie、目標偵察與伺服器防偽。')
 result['sources']+=json.loads((SOURCE/'references.json').read_text())
 save(SOURCE/'adopted-body.json',blocks);save(SOURCE/'line-adoption.json',ledger);save(SOURCE/'code-repairs.json',repairs);save(SOURCE/'editorial-replacements.json',REPLACEMENTS);save(SOURCE/'headings.json',headings)
 save(SOURCE/'removed-current-blocks.json',removed)
 print(f'CSRF replacement: {chapter} sections, {sub} subsections, {codes} code blocks + 1 diagram code, {tables} tables, 7 figures, 3 scenarios / 9 options; {len(ledger)} source lines; one native collapsible part')
 return figures
