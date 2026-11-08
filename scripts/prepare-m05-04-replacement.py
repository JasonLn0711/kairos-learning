"""Preserve new source and normalize exported markup without shortening teaching."""
from pathlib import Path
import re,json,hashlib
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m05-04/replacement-2026-11-08'
t=(S/'original.zh-TW.md').read_text()
# Exported source cards are replaced by checked, direct citations in the final manuscript.
t=re.sub(r'\[image\]\(https://www.google.com/s2/favicons[^\n]*\)\n\n[^\n]+\n','',t)
t=t.replace('今天這一課非常重要，因為它教你的不只是辨認資安名詞，而是','這一課將幫助你在辨認資安名詞後，進一步理解')
t=t.replace('# CEH M05-04｜白話文教學：','# M05-04｜')
t=t.replace('把三者放在同一張圖\n\nCVE\n\n發生哪個漏洞？\n\nCWE\n\n缺陷屬於哪一類？\n\nCPE\n\n可能影響什麼產品？\n\n對照版本、設定、修補與現場證據\n\n這台實際設備到底有沒有受到影響？\n\n這才是資安工程師真正需要回答的問題','{{figure:roles}}')
a=t.index('# CVE\n');b=t.index('\nCVE 不會直接告訴你',a);t=t[:a]+'{{figure:identifier}}\n'+t[b:]
a=t.index('CVE 官方紀錄\n');b=t.index('\n上圖是建議',a);t=t[:a]+'{{figure:lookup}}\n'+t[b:]
a=t.index('掃描器發現\n');b=t.index('\n乍看之下',a);t=t[:a]+'{{figure:finding}}\n'+t[b:]
a=t.index('1. 發現疑似弱點');b=t.index('\n這是一個方便教學',a);t=t[:a]+'{{figure:evidence}}\n'+t[b:]
t=t.replace('?utm_source=chatgpt.com','')
t=t.replace('你先試著回答，我再幫你檢查推理過程，並說明實際資安檢測工作中應如何查證。','請先寫下你的判斷與所需證據，再於後續討論核對推理；本頁不提供自動送出或批改功能。')
t=re.sub(r'\n{3,}','\n\n',t).strip()+'\n';(S/'normalized-source.zh-TW.md').write_text(t)
A=R/'.local/sources/m05-04-new';files=[S/'original.zh-TW.md',*[A/f'image-{i}.png' for i in range(1,6)]]
(S/'source-checksums.json').write_text(json.dumps({p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in files},indent=2)+'\n')
print('Normalized nine-section full manuscript; five figure placeholders')
