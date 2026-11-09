from pathlib import Path
import re,sys,json
p=Path(__file__).resolve().parent
s=(p/'pasted-text-1.txt').read_text().replace('# AASE M04-01','# M04-01',1)
s=re.sub(r'^\[.*?\]\(https://images\.openai\.com/.*?\)\n\n','',s,flags=re.M)
s=s.replace('\n8\n','\n').replace('\\.','.').replace('&#x20;','')
a=s.index('填寫資料\n');b=s.index('現在出現',a)
flow=s[a:b].strip().split('\n\n');s=s[:a]+'@figure1\n\n'+s[b:]
a=s.index('HCI：研究為什麼會誤解');b=s.index('## 四',a)
parts=re.split(r'\n\n(?=(?:UI|UX)：)',s[a:b].strip());cards=[]
for part in parts:
 title,body=part.split('\n\n',1);cards.append(dict(title=title,body=body))
s=s[:a]+'@figure2\n\n'+s[b:]
a=s.index('修改前\n');b=s.index('這個修改看起來',a)
parts=s[a:b].split('候選修改\n\n');before=parts[0].removeprefix('修改前\n\n').strip();after=parts[1].strip()
s=s[:a]+'@figure3\n\n'+s[b:]
s=s.replace('提交回答並批改','請先自行作答，再展開下方的參考解析核對理由。')
s=s.replace('## 二、用一張表記住三者的差別\n\n','## 二、用一張表記住三者的差別\n\n用各自關心的問題比較三種觀點，較容易判斷要檢查什麼。\n\n')
f={'zh':[
 dict(kind='flow',caption='圖 1｜原本的收件流程',description='四個步驟依序進行；「顯示成功」尚未說明成功的範圍。',items=[dict(title=x,body='原流程步驟 '+str(i+1)) for i,x in enumerate(flow)]),
 dict(kind='cards',caption='圖 2｜從 HCI、UI、UX 檢查收件系統',description='三種觀點互相影響，並列呈現，不表示先後階段。',items=cards),
 dict(kind='cards',caption='圖 3｜狀態提示的修改前與候選修改',description='示意畫面，不是真實系統或測試結果；候選修改仍需要驗證。',items=[dict(title='修改前',body=before),dict(title='候選修改',body=after)])]}
a=s.index('一個可驗證的設計需求');b=s.index('這就是從',a)
parts=s[a:b].strip().split('\n\n')
f['zh'].append(dict(kind='cards',caption='圖 4｜'+parts[0],description=parts[1],items=[dict(title=x.split('：',1)[0],body=x.split('：',1)[1].strip())for x in parts[2:]]))
s=s[:a]+'@figure4\n\n'+s[b:]
a=s.index('使用者收到案件');b=s.index('任務分析不是',a)
parts=s[a:b].strip().split('\n\n')
f['zh'].append(dict(kind='flow',caption='圖 5｜把真正的工作拆成任務',description='依序檢查每一步的角色、資訊、成功條件與例外。',items=[dict(title=x,body='任務步驟 '+str(i+1))for i,x in enumerate(parts)]))
s=s[:a]+'@figure5\n\n'+s[b:]
if '--check' in sys.argv:
 assert (p/'teaching.zh.md').read_text()==s
 assert json.loads((p/'figures.json').read_text())['zh']==f['zh']
else:
 (p/'teaching.zh.md').write_text(s)
 if (p/'figures.json').exists():
  prior=json.loads((p/'figures.json').read_text())
  if 'en' in prior:f['en']=prior['en']
 (p/'figures.json').write_text(json.dumps(f,ensure_ascii=False,indent=2)+'\n')
print('PASS: source normalization and five figure text groups')
