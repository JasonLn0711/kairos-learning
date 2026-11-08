"""Preserve the supplied teaching and produce a reviewable normalized draft.
This does not publish or assert a completed bilingual article.
"""
from pathlib import Path
import re,json,hashlib
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/cs-systems-foundations';private=R/'.local/sources/cs-systems-foundations'
original=(private/'original.txt').read_text();S.mkdir(parents=True,exist_ok=True)
(S/'original.zh-TW.md').write_text(original)
text=original
# Remove exported favicon/source-label chrome; real citations are checked separately.
text=re.sub(r'\[image\]\(https://www.google.com/s2/favicons[^\n]*\)\n\n[^\n]+\n', '', text)
text=re.sub(r'\[Permissions, Metadata, and Edge Cases\]\([^\n]*\)', '{{figure:links}}',text)
text=text.replace(r'\*\*','').replace('&#x20;','').replace('\\\n','\n')
text=text.replace('這份教學將前面兩份教材涉及的技術，整理成可以適用於', '這份教學將電腦系統與軟體工程涉及的技術，整理成可以適用於')
text=text.replace('我們先把前面所有主題歸納成六個領域。','我們先把系統主題歸納成六個領域。')
text=text.replace('這裡補上一個前述教材沒有深入展開、但理解部署非常重要的網路基礎。','理解網站部署，需要先認識瀏覽器取得資源的網路流程。')
text=text.replace('with open("data.txt", "r") as f:    content = f.read()', 'with open("data.txt", "r") as f:\n    content = f.read()')
text=text.replace('以下指令只讀取資訊，不會修改檔案：','以下以 Linux／GNU 工具為例，指令只讀取資訊，不會修改檔案。請把 `example.txt` 換成存在的檔案；macOS 的 `stat` 欄位格式與 `readlink` 選項依版本不同，先以 `man stat`、`man readlink` 核對。')
# Render exported mathematical notation as selectable plain text.
text=text.replace(r'\\(10^9\\)', '10⁹').replace(r'\\(2^{30}\\)', '2³⁰')
text=text.replace(r'\\[ \text{可執行性} \neq \text{只有套件版本正確} \\]', '可執行性 ≠ 只有套件版本正確')
text=text.replace(r'\\[ \min(\text{儲存成本}+\text{重建成本}+\text{操作風險}) \\]', '最小化（儲存成本＋重建成本＋操作風險）')
text=text.replace(r'\\[ \text{Commit 成功} \not\Rightarrow \text{Deploy 成功} \\]', 'Commit 成功 ⇏ Deploy 成功')
text=text.replace(r'\\[ B=f(S,D,T,P,E) \\]', 'B = f(S, D, T, P, E)')
text=re.sub(r'\\\\\(([BSTPDE])\\\\\)',r'\1',text)
text=text.replace('# 比較內容\nsha256sum "$lab/a.txt" "$lab/hard.txt"', '# 比較內容：Linux 使用 sha256sum，macOS 使用 shasum\nif command -v sha256sum >/dev/null 2>&1; then\n  sha256sum "$lab/a.txt" "$lab/hard.txt"\nelse\n  shasum -a 256 "$lab/a.txt" "$lab/hard.txt"\nfi')
text=text.replace('這個練習可以把前面抽象的檔案系統概念，轉變成實際看得見的證據。', '這個練習可以把前面抽象的檔案系統概念，轉變成實際看得見的證據。預期 `a.txt` 與 `hard.txt` 在同一裝置上有相同 inode，連結數為 2，SHA-256 摘要相同；`soft.txt` 自己是另一個符號連結物件。實際 inode 數字由檔案系統決定。\n\n觀察完成後，在同一個 Shell 僅刪除本練習建立的三個名稱，再移除空目錄；`rmdir` 若發現額外內容會停止。\n\n```\nrm -- "$lab/soft.txt" "$lab/hard.txt" "$lab/a.txt"\nrmdir -- "$lab"\nunset lab\n```')
text=text.replace('提交並請你逐題批改', '完成 A–F 後，可將回答交給授課者或帶入後續討論逐題檢視；本頁不提供線上送出或自動批改功能。')
text=re.sub(r'\n{3,}','\n\n',text).strip()+'\n'
(S/'teaching.zh-TW.md').write_text(text)
records=[]
for i,line in enumerate(original.splitlines(),1):
 if re.match(r'^#{2,3} ',line): records.append({'sourceLine':i,'heading':line,'status':'draft retained; bilingual and rendered comparison pending'})
(S/'source-outline.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
files=[private/'original.txt',*[private/f'image-{i}.png' for i in range(1,9)]]
(S/'source-checksums.json').write_text(json.dumps({p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in files},indent=2)+'\n')
print(f'Preserved source; {len(records)} section/subsection headings inventoried. Draft is not published.')
