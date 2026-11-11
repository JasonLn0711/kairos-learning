from pathlib import Path
import re,sys
p=Path(__file__).resolve().parent
s=(p/'source.zh.txt').read_text()
s=s.replace('本節依據 [AASE M04-02 正式教材](https://learn.cs-kairos.com/courses/aase/v1/m04/concepts/m04-02/?utm_source=chatgpt.com)，並延伸 Nielsen Norman Group 的 Task Analysis 方法。','本節以供稿的合成案例說明任務分析，方法參考 Nielsen Norman Group 的 Task Analysis 文章；案例不代表實際醫院、機關或工廠的既定流程。')
s=re.sub(r'\[image\]\([^\n]+\)\n\n(?:CS Kairos Learn\+1|NN/G)','',s)
start=s.index('任務分析的核心思考架構\n');end=s.index('注意：任務分析不只是',start);s=s[:start]+'@figure1\n\n'+s[end:]
start=s.index('0\\. 完成收件完整性檢查');end=s.index('HTA 除了描述子任務',start);s=s[:start]+'@figure2\n\n'+s[end:]
start=s.index('輸入資料 → 執行完整性檢查');end=s.index('這裡最重要的不是方框',start);s=s[:start]+'@figure3\n\n'+s[end:]
start=s.index('01\n\n需求工程');end=s.index('這是理解軟體設計時',start);s=s[:start]+'@figure4\n\n'+s[end:]
start=s.index('測試 A：資料缺漏');end=s.index('這也是任務分析與軟體測試',start);s=s[:start]+'@figure5\n\n'+s[end:]
s=s.replace('提交答案並取得解析&#x20;','參考解析放在本文下方的「理解檢核」；可自行作答後展開對照。本頁不提交答案或判定學習完成。')
s=s.replace('```\n\n# Task Analysis','```\n# Task Analysis').replace('。\n\n```','。\n```')
s=re.sub(r'\n{3,}','\n\n',s).rstrip()+'\n'
if '--check' in sys.argv:assert (p/'teaching.zh.md').read_text()==s
else:(p/'teaching.zh.md').write_text(s)
