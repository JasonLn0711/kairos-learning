from pathlib import Path
import re,json,sys
p=Path(__file__).resolve().parent
s=(p/'pasted-text-1.txt').read_text().replace('# AASE M04-01','# M04-01')
s=re.sub(r'\[image\]\([^\n]+\)\n\n(?:NN/G\+1|IxDF\+1|Part 11: Usability: Definitions and concepts\+1|GOV.UK|NIST\+1)', '',s)
s=re.sub(r'\[What is Interaction Design\?[^\n]+\n\n\[figma.com\][^\n]+','@figure2',s)
s=s.replace('我們依照 [AASE M04-01 正式教材](https://learn.cs-kairos.com/courses/aase/v1/m04/concepts/m04-01/?utm_source=chatgpt.com)，','本課')
a=s.index('UI — User Interface');b=s.index('這個例子最重要的地方在於：')
raw=s[a:b].strip();pieces=re.split(r'\n\n(?=(?:HCI|UX) —)',raw)
f1=[]
for part in pieces:
 title,body=part.split('\n\n',1);f1.append(dict(title=title,body=body))
s=s[:a]+'@figure1\n\n'+s[b:]
a=s.index('使用者目標\n');b=s.index('這個架構讓我們理解一件事：')
parts=s[a:b].strip().split('\n\n');f3=[dict(title=parts[i],body=parts[i+1])for i in range(0,10,2)];desc3=parts[10]
s=s[:a]+'@figure3\n\n'+s[b:]
a=s.index('原本的設計\n');b=s.index('### 先從 HCI')
f4=[dict(title='原本的設計',body='成功！\n\n操作完成\n\n確定\n\n不清楚是什麼成功，也不知道是否已正式送件。'),dict(title='候選修改',body='欄位檢查完成\n\n3 個必要欄位已齊全。\n\n尚未正式受理。\n\n匯出檢查報告\n\n清楚說明已完成的事項及下一步，但仍須測試。')]
s=s[:a]+'@figure4\n\n這兩個都是示意介面，不代表真實使用者測試結果。\n\n'+s[b:]
s=s.replace('\\.','.').replace('&#x20;複製','').replace('\\\n','\n').replace('\\-','-')
s=s.replace('AI 設計需求範例\n','### AI 設計需求範例\n\n以下指令先要求可檢查的設計稿，再列出真人測試假設。\n\n```text\n')
s=s.replace('最後列出需要透過真人任務測試驗證的假設，不得宣稱已改善 UX。','最後列出需要透過真人任務測試驗證的假設，不得宣稱已改善 UX。\n```')
s=s.replace('而這會銜接 M04-02','## 與下一課的銜接\n\n這會銜接 M04-02')
s=s.replace('先自行作答，我會依照你的答案逐題解析，暫時不公布標準答案。','請先自行作答，再展開參考解析核對理由。三題保留原有選項，另有一題實作練習。')
s=s.replace('提交答案並請你批改','本頁提供參考解析；可將自己的答案與理由另存，供討論或後續檢查。')
s=re.sub(r'\n{3,}','\n\n',s)
s=s.replace('## 二、三個概念究竟有什麼差別？\n\n','## 二、三個概念究竟有什麼差別？\n\n先比較各自關注的問題與方法，再判斷要蒐集什麼證據。\n\n')
for title in ['1. 誰使用','2. 要做什麼','3. 遇到什麼困難','4. 要如何改善','5. 如何證明有效']:s=s.replace('\n'+title+'\n','\n### '+title+'\n')
if '--check' in sys.argv:assert (p/'teaching.zh.md').read_text()==s,'Chinese manuscript differs from documented normalization'
else:(p/'teaching.zh.md').write_text(s)
figures=json.loads((p/'figures.json').read_text())['zh']
assert figures[0]['items']==f1 and figures[2]['items']==f3 and figures[3]['items']==f4,'figure source text differs'
print('PASS: full supplied Chinese text with documented formatting and figure substitutions.')
