"""Normalize only the reviewed display replacements; retain all surrounding source."""
from pathlib import Path
import re,sys
p=Path(__file__).resolve().parent
s=(p/'pasted-text-1.txt').read_text()
replacements=[
 ('# AASE M03-05｜','# M03-05｜'),
 ('本次教學依據 [AASE M03-05 正式教材](https://learn.cs-kairos.com/courses/aase/v1/m03/concepts/m03-05/?utm_source=chatgpt.com)，並補充跨產業例子與實務上的驗證方法。','本課以跨產業例子說明成功指標、假設與需求紀錄，以及實務上的驗證方法。'),
 ('從問題到決策的六個環節','注意：需求是', '@figure1'),
 ('這就形成一個實務上的三層架構：','這三種角度共同回答：', '@figure2'),
 ('有瑕疵的 4 件產品，成功阻擋幾件？','這個例子其實引出了', '@figure3'),
 ('假設 H-01｜AI 家教是否有助於學習？','這裡最重要的是「反證」。', '@figure4'),
 ('步驟 1｜檢查資料 A','因此工程師增加了一條新規則：', '@figure5'),
 ('整合案例：一家製造公司導入 AI 品質檢測系統','請回答：', '@figure6'),
]
for r in replacements:
 if len(r)==2:
  assert s.count(r[0])==1,r[0];s=s.replace(*r)
 else:
  start,end,marker=r;assert s.count(start)==1 and s.count(end)==1,(start,end)
  a=s.index(start);b=s.index(end,a);s=s[:a]+marker+'\n\n'+s[b:]
s=re.sub(r'\[image\]\(https://www.google.com/s2/favicons[^\n]*\)\n\n(?:GOV.UK|CS Kairos Learn)\n*','',s)
s=s.replace('?utm_source=chatgpt.com','')
s=re.sub(r'\[英國 GOV.UK 的服務績效指標設計指南\]\([^)]*\)', '英國 GOV.UK 的服務績效指標設計指南（本課下方來源連結）',s)
s=s.replace(r'\\[ \text{瑕疵阻擋率}=\frac{\text{成功阻擋的瑕疵品}}{\text{全部瑕疵品}} \\]','瑕疵阻擋率＝成功阻擋的瑕疵品／全部瑕疵品。').replace(r'\\(3/4=75\\%\\)','3／4＝75%')
s=s.replace('這個例子其實引出了機器學習當中很重要的觀念：','## 分母、錯誤代價與小樣本界線\n\n這個例子其實引出了機器學習當中很重要的觀念：')
s=s.replace('請先嘗試回答。我會依照本課的概念逐項檢查推理與計算。','請先嘗試回答，再展開參考解析，逐項檢查推理與計算。')
s=s.strip()+'\n'
out=p/'teaching.zh.md'
if '--check' in sys.argv:assert out.read_text()==s,'Chinese manuscript differs from reviewed source normalization'
else:out.write_text(s)
assert len(re.findall(r'^@figure[1-6]$',s,re.M))==6
assert len(re.findall(r'^## ',re.sub(r'```[\s\S]*?```','',s),re.M))==11
print('PASS: full Chinese source normalized with six figure substitutions.')
