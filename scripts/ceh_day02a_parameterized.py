"""Complete adopted parameter-binding lesson, inserted at its existing explanation."""
import html,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/ceh-day02-a/2026-11-14/parameterized-query'
# Source code arrived on single lines; these are formatting repairs, not rewritten examples.
REPAIRED_CODES={
1:'''username = "Alice"
sql = (
    "SELECT * FROM users WHERE username = '"
    + username
    + "'"
)
cursor.execute(sql)''',
5:'''cursor.execute(
    "SELECT * FROM users WHERE username = ?",
    (username,),
)''',
10:'''cursor.execute(
    "SELECT * FROM users WHERE username = ? AND age = ?",
    ("Alice", 30),
)''',
11:'''cursor.execute(
    "SELECT * FROM users WHERE username = :name",
    {"name": "Alice"},
)''',
14:'''import sqlite3

# 建立只存在記憶體中的資料庫
db = sqlite3.connect(":memory:")
cursor = db.cursor()

# 建立 users 資料表
cursor.execute(
    "CREATE TABLE users (username TEXT, role TEXT)"
)

# 新增兩筆測試資料
cursor.executemany(
    "INSERT INTO users VALUES (?, ?)",
    [
        ("Alice", "admin"),
        ("Bob", "user"),
    ],
)

# 模擬惡意輸入
username = "' OR '1'='1"

# 寫法一：不安全的字串拼接
unsafe_sql = (
    "SELECT * FROM users WHERE username = '"
    + username
    + "'"
)
cursor.execute(unsafe_sql)
print("不安全查詢：", cursor.fetchall())

# 寫法二：安全的參數化查詢
cursor.execute(
    "SELECT * FROM users WHERE username = ?",
    (username,),
)
print("參數化查詢：", cursor.fetchall())
db.close()''',
16:'''username = input("請輸入使用者名稱：")
sql = f"SELECT * FROM users WHERE username = '{username}'"
cursor.execute(sql)'''
}
REPLACEMENTS={
 '六、博士班程度：為什麼不直接刪除特殊字元？':'六、進一步理解：為什麼不直接刪除特殊字元？',
 '你先用自己的理解回答，我再依 CEH 考試要求及程式實際執行機制，逐一批改。':'先自行記下兩題的推理，再與教師討論；本頁提供靜態自我檢核，未提供提交或批改功能，也不記錄已作答或理解狀態。',
 }
def clean(s):
 s=html.unescape(s.replace('**','')).strip()
 for a,b in REPLACEMENTS.items():s=s.replace(a,b)
 return s

def adopt_parameterized(result,save):
 raw=(SOURCE/'pasted-text-1.txt').read_text();lines=raw.splitlines();figure=json.loads((SOURCE/'figure.json').read_text())
 blocks=[dict(kind='heading',id='p1-binding-intro',text='補充精讀｜Parameterized Query（參數化查詢）白話文教學'),dict(kind='paragraph',text='這一節是另外加入的 SQL 參數化精讀；前面的40／30／15／15保留為四重點補充的閱讀建議，不代表新增精讀後整頁的實際字數比例，也不是官方配分。')]
 i=1;chapter=0;sub=0;code_number=0;ledger=[];repairs=[];anchor='p1-binding-intro'
 while i<len(lines):
  start=i;s=lines[i].strip();i+=1
  if not s:continue
  treatment='正文'
  if s=='不安全：把資料拼接進 SQL 指令文字':
   while i<len(lines) and not lines[i].startswith('因此，即使使用者輸入：'):i+=1
   blocks.append(figure);treatment='圖8：保留上下對照與安全組兩項並列'
  elif s.startswith('[image](') or s in {'Python 3.14.7 documentation','OWASP Cheat Sheet Series'}:treatment='移除匯出來源卡，原稿保留；參考來源以查核日期記錄'
  elif s.startswith('## '):
   chapter+=1;anchor=f'p1-binding-section-{chapter:02d}'
   blocks.append(dict(kind='heading',id=anchor,text='參數化精讀｜'+clean(s[3:])))
   if chapter==2:blocks.append(dict(kind='paragraph',text='以下為程式片段，假設已建立資料庫連線與 cursor；第五節提供可單獨執行的完整程式。'))
   if chapter==4:blocks.append(dict(kind='paragraph',text='本節雙參數片段假設 users 另外有 age 欄位；第五節完整實驗只建立 username、role，兩個範例使用不同的示意資料表。'))
   if chapter==5:blocks.append(dict(kind='paragraph',text='將下方完整程式存成 parameterized_query_demo.py，執行 python3 parameterized_query_demo.py，再比對預期輸出。實驗只使用記憶體與兩筆假資料；關閉連線後資料庫消失，只留下自行保存的程式檔。'))
   if chapter==8:blocks.append(dict(kind='paragraph',text='以下兩題為本次參數化查詢補充的自我檢核，與原五道整合情境題、四道選擇題及未附全文的23道題庫題目分開計數；先不公布解答。'))
  elif s.startswith('###'):
   sub+=1;anchor=f'p1-binding-subsection-{sub:02d}'
   blocks.append(dict(kind='heading',id=anchor,text='參數化查詢｜'+clean(s.lstrip('# '))))
  elif s.startswith('```'):
   code_number+=1;code=[]
   while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
   assert i<len(lines);i+=1;original='\n'.join(code);text=REPAIRED_CODES.get(code_number,original)
   if text!=original:repairs.append(dict(code=code_number,original=original,adopted=text,reason='修復黏合換行／縮排，保留原語意'))
   blocks.append(dict(kind='code',text=text))
  elif s.startswith('|'):
   rows=[s]
   while i<len(lines) and lines[i].strip().startswith('|'):rows.append(lines[i].strip());i+=1
   cells=lambda r:[clean(c) for c in r.strip('|').split('|')]
   blocks.append(dict(kind='table',headers=cells(rows[0]),rows=[cells(r) for r in rows[2:]]))
  else:
   blocks.append(dict(kind='paragraph',text=clean(s)))
   if s.startswith('這個原則除了 SQL Injection'):
    blocks.append(dict(kind='paragraph',text='這是對信任邊界的類比：各系統需要自己的安全介面與驗證；SQL 參數化不能直接視為命令、範本或 AI 提示注入的完整防護。'))
  for j in range(start,i):
   if lines[j].strip():ledger.append(dict(line=j+1,source=lines[j],anchor=anchor,treatment=treatment))
 assert chapter==8 and sub==4 and code_number==16,(chapter,sub,code_number)
 assert len(repairs)==6
 body=next(s for s in result['sections'] if s['id']=='p1-section-07')['body']
 at=next(i for i,b in enumerate(body) if b.get('text','').startswith('這叫作 Code/Data Separation'))+1
 body[at:at]=blocks
 result['contentVersion']='1.2.0';result['revision']=4
 result['summary']+=' 另以可執行的 SQLite 範例精讀參數綁定、佔位符與權限界線。'
 result['sources']+=json.loads((SOURCE/'references.json').read_text())
 save(SOURCE/'line-adoption.json',ledger);save(SOURCE/'code-repairs.json',repairs);save(SOURCE/'editorial-replacements.json',REPLACEMENTS);save(SOURCE/'adopted-body.json',blocks)
 save(SOURCE/'example.py',(REPAIRED_CODES[14]+'\n').encode())
 print(f'Parameterized Query: 8 sections, 4 subsections, {code_number} code blocks, 1 figure, 2 unanswered checks; {len(ledger)} adopted source lines')
 return [figure]
