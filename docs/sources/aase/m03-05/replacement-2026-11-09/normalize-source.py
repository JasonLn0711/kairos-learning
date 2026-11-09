from pathlib import Path
import sys
p=Path(__file__).resolve().parent
s=(p/'pasted-text-1.txt').read_text()
s=s.replace(s.splitlines()[0],'# M03-05｜成功指標、假設與需求紀錄：怎麼證明做出來的系統真的有用？')
a=s.index('1\\. Problem');b=s.index('其中最需要理解的是',a);s=s[:a]+'@figure1\n\n'+s[b:]
a=s.index('功能指標（Functional Metric）');b=s.index('這兩種指標為什麼',a);s=s[:a]+'@figure2\n\n'+s[b:]
a=s.index('公式：');b=s.index('這裡有三個',a);s=s[:a]+'公式：缺漏阻擋率＝成功阻擋的缺漏案例／全部缺漏案例 × 100%。\n\n因此是：3／4 × 100%＝75%。\n\n@figure3\n\n'+s[b:]
a=s.index('舊流程\n');b=s.index('看起來節省五分鐘',a);s=s[:a]+'@figure4\n\n'+s[b:]
a=s.index('過期檢查結果的問題\n');b=s.index('這個問題非常典型',a);s=s[:a]+'@figure5\n\n'+s[b:]
s=s.replace('&#x20;','')
s=s.replace('以下是新的合成情境，請先自己作答，我暫時不提供答案。','以下是新的合成情境，請先自己作答；本節先保留問題，參考答案可在下方「理解檢核與參考解析」展開。')
out=p/'teaching.zh.md'
if '--check' in sys.argv:assert out.read_text()==s,'Chinese manuscript differs from explicit normalization'
else:out.write_text(s)
