"""Adopt the complete browser/session/CSRF source with traceable technical repairs."""
import html,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/ceh-day02-a/2026-11-14/csrf-browser'
REPLACEMENTS={
 '十四、博士班理解檢核':'十四、整合理解檢核',
 '提交答案，逐題診斷理解':'先自行記下五題推理，再與教師討論；本頁沒有提交或逐題批改功能，不記錄已作答或理解狀態。',
 '從你的提問方式，可以辨識出幾個具體的概念缺口。這些不是對你能力的評價，而是你目前建立的瀏覽器模型與真實 Web 架構之間，還有幾處需要連接。':'從這組問題，可以提出幾個需要串接的概念假設；以下是根據提問內容的教學判讀，仍需透過實際觀察與回答確認，不是已完成的能力評量。',
 '1. 你尚未完全分離「程式執行權限」與「網路請求權限」':'1. 先分離「程式執行權限」與「網路請求權限」',
 '2. 你可能把 Session 理解成前端網頁的物件':'2. 確認 Session 不是單一前端網頁的物件',
 '3. 你還需要把「使用者是誰」和「是否同意這次操作」拆開':'3. 拆開「使用者是誰」和「是否同意這次操作」',
}
def clean(s):
 s=html.unescape(s.replace('**','')).strip().replace('https\\://','https://')
 s=re.sub(r'\[([^]]+)\]\(https://[^)]+\?utm_source=chatgpt.com\)',r'`\1`',s)
 for a,b in REPLACEMENTS.items():s=s.replace(a,b)
 if s.startswith('\\\\['):s='Origin = (Scheme, Host, Port)：來源由通訊協定、主機與連接埠共同決定。'
 return s

def adopt_csrf(result,save):
 lines=(SOURCE/'pasted-text-1.txt').read_text().splitlines();figures=json.loads((SOURCE/'figures.json').read_text())
 blocks=[dict(kind='heading',id='p1-csrf-browser-intro',text=clean(lines[0].lstrip('# '))),dict(kind='paragraph',text='這份完整精讀接續前面的 CSRF 原理解說，追蹤「發起請求、附帶憑證、讀取回應、驗證與執行」的不同責任。所有 example 網域、帳號、密碼、S7x9 與 Token 均為假資料或示意值，不能拿來作正式憑證；HTTP 範例是解密後的教學表示法，不會在本頁執行轉帳。')]
 ledger=[dict(line=1,source=lines[0],anchor='p1-csrf-browser-intro',treatment='補充主標題')];repairs=[]
 spans=[('瀏覽器不是每個網頁各自擁有一個完全獨立的網路世界','這是概念架構',0),('**Browser**','Session ID 或 Session Token',1),('**Browser → Bank Server**','為了簡化例子',2),('**Server → Browser**','請求中的 `Cookie` Header',3),('正常登入與 CSRF 攻擊的差異','## **1. 攻擊者',4),('以 bank.example.com 作為比較對象','此例中，',5),('Cookie 傳送判斷表','此表針對',6),('具有 CSRF Token 防護的請求流程','例如合法轉帳頁面',7)]
 starts={}
 for start,end,n in spans:
  a=next(i for i,s in enumerate(lines) if s==start or s.startswith(start));b=next(i for i in range(a+1,len(lines)) if lines[i].startswith(end));starts[a]=(b,n)
 i=1;chapter=0;sub=0;codecount=0;tables=0;anchor='p1-csrf-browser-intro';headings=[]
 while i<len(lines):
  start=i;s=lines[i].strip();i+=1
  if not s:continue
  treatment='正文保留'
  if start in starts:
   i,n=starts[start];blocks.append(figures[n]);treatment=f'圖{n+9}：依原PNG還原分組、方向或資料格；圖3保留兩段HTTP於同源圖文'
  elif s.startswith('[image](') or s in {'MDN','OWASP Cheat Sheet Series','Chromium','GitHub'}:treatment='移除匯出favicon／來源卡；官方來源改用正式sources'
  elif s=='已完成 0／6 項':
   blocks.append(dict(kind='paragraph',text='以上六項為靜態觀察清單；本頁不追蹤完成比例。請自行記錄測試環境、標頭與伺服器結果，再判讀每項機制。'));treatment='不保留未實作進度狀態'
  elif s=='0%':treatment='移除未實作進度百分比'
  elif re.match(r'^#{1,3} ',s):
   title=clean(s.lstrip('# '))
   if re.match(r'^[一二三四五六七八九十]+、',title):chapter+=1;anchor=f'p1-csrf-browser-section-{chapter:02d}'
   else:sub+=1;anchor=f'p1-csrf-browser-subsection-{sub:02d}'
   blocks.append(dict(kind='heading',id=anchor,text='CSRF 精讀｜'+title));headings.append(dict(sourceLine=start+1,title=title,anchor=anchor))
   if chapter==14 and title.startswith('十四、'):blocks.append(dict(kind='paragraph',text='以下五題是本次新增的整合檢核，不公布參考答案；與原五道情境、四道選擇題、參數化兩題及未附全文的23題分開計數。'))
  elif s.startswith('```'):
   codecount+=1;code=[]
   while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
   assert i<len(lines);i+=1;original='\n'.join(code);value=original
   if 'Set-Cookie:' in value:
    value=re.sub(r';\n\s+', '; ', value)
   if value.startswith('if valid_session'):
    value='if valid_session(request.cookies["__Host-session"]):\n    transfer_money()'
   if 'csrf_token=RANDOM_VALUE' in value:value=value.replace('to=recipient-account&\namount=1000&\ncsrf_token=RANDOM_VALUE','to=recipient-account&amount=1000&csrf_token=unpredictable-token')
   if value!=original:repairs.append(dict(line=start+1,original=original,adopted=value,reason='HTTP標頭改單行、表單編碼移除非預期換行，或修復偽碼縮排及一致cookie名稱；Token仍是佔位值'))
   blocks.append(dict(kind='code',text=value))
   if value.startswith('if valid_session'):blocks.append(dict(kind='paragraph',text='這是用來指出「只驗 Session 就執行」缺陷的偽碼，valid_session、request 與 transfer_money 代表應用程式既有介面，不能作為可獨立執行的安全實作。'))
  elif s.startswith('|'):
   rows=[s]
   while i<len(lines) and lines[i].strip().startswith('|'):rows.append(lines[i].strip());i+=1
   cells=lambda r:[clean(c) or '比較項目' for c in r.strip('|').split('|')]
   blocks.append(dict(kind='table',headers=cells(rows[0]),rows=[cells(r) for r in rows[2:]]));tables+=1
  else:
   blocks.append(dict(kind='paragraph',text=clean(s)))
   if s=='`Set-Cookie`' and not any(b.get('text','').startswith('這裡的 __Host-') for b in blocks):blocks.append(dict(kind='paragraph',text='這裡的 __Host- 前綴必須搭配 Secure、Path=/ 且不得指定 Domain，讓 Cookie 只屬於設定它的主機；Path 是傳送匹配條件，並非阻止其他同源程式讀取資料的安全隔離。'))
   if clean(s).startswith('Browser 自動附帶 Cookie，Server 使用 Session ID'):
    blocks.append(dict(kind='paragraph',text='工作階段也有結束流程：登出時，Server 應使目前 Session 失效，再以相同名稱與適用範圍的 Set-Cookie 搭配 Max-Age=0 等方式移除瀏覽器 Cookie。只關閉銀行分頁不等於登出；伺服器逾時或撤銷後，即使瀏覽器仍送出舊 Cookie，也應拒絕恢復登入狀態。登入或權限提升後換發識別碼，則需讓舊的對應失效。'))
   if clean(s).startswith('Origin') and '精確比對 Scheme' in s:
    blocks.append(dict(kind='paragraph',text='Cookie 的主機／Domain 與路徑匹配不等於 Origin 比對：Cookie 不以 Port 分隔，Secure 等屬性另決定傳送條件。不同連接埠的兩個 Origin，仍可能對同一主機使用符合規則的 Cookie；不能把 Cookie Store 想成每個 Origin 完全獨立的一格。'))
   if s.startswith('Fetch API 的 `credentials`'):blocks.append(dict(kind='paragraph',text='網頁 JavaScript 也不能用 fetch 任意設定 Cookie 或 Sec- 前綴等瀏覽器保留的標頭；本頁標頭是觀察到的請求表示法，附帶 Cookie 的決定由瀏覽器負責。'))
   if s.startswith('這類非簡單跨來源請求'):blocks.append(dict(kind='paragraph',text='OPTIONS 預檢本身通常不附帶 Cookie；伺服器允許的 Origin、方法與標頭符合後，才可能送出實際請求。拒絕預檢不等於所有不需預檢的表單也會被阻止。'))
  for j in range(start,i):
   if lines[j].strip():ledger.append(dict(line=j+1,source=lines[j],anchor=anchor,treatment=treatment))
 assert chapter==14,chapter
 assert len(ledger)==sum(bool(s.strip()) for s in lines)
 body=next(s for s in result['sections'] if s['id']=='p1-section-07')['body']
 at=next(i for i,b in enumerate(body) if b.get('text','').startswith('CSRF 最重要的概念是：'))+1
 body[at:at]=blocks
 result['contentVersion']='1.3.0';result['revision']=5
 result['summary']+=' 再追蹤瀏覽器、Session Cookie、同源政策與 CSRF 防偽的完整流程。'
 result['sources']+=json.loads((SOURCE/'references.json').read_text())
 save(SOURCE/'adopted-body.json',blocks);save(SOURCE/'line-adoption.json',ledger);save(SOURCE/'code-repairs.json',repairs);save(SOURCE/'editorial-replacements.json',REPLACEMENTS);save(SOURCE/'headings.json',headings)
 print(f'CSRF browser: {chapter} sections, {sub} subsections, {codecount} standalone code blocks + 2 diagram HTTP blocks, {tables} tables + 2 figure tables, 8 figures, 5 unanswered checks; {len(ledger)} source lines')
 return figures
