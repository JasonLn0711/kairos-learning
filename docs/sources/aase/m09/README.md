# AASE M09｜來源與新編範圍

日期：2026-11-05。四篇繁中初版均 v1.0.0、revision 1；依已貼課綱、本 repo 參考作品及 M01–M08 續編，不宣稱恢復遺失附件。來源網址與查核日期集中於 content/aase/sources.json。

| 概念 | 原始來源 | 新編與限制 |
| --- | --- | --- |
| M09-01 Git、Diff、Commit 與還原 | Pro Git Recording Changes、git-diff、git-restore | 獨立本機 Git 練習；指定路徑暫存與還原，保留另一檔的未提交修改及目標備份，不設遠端。 |
| M09-02 README、限制與交接 | GitHub About READMEs、Python venv、pytest、AppTest | 原創完整 README 重現範例，直接對應工作坊解壓結構；作者乾淨環境重建與真人交接分開。 |
| M09-03 成果展示與驗收 | Gherkin、GitHub README、NIST AI RMF Core | 原創追溯表與三種展示情境，連到既有六題評分規準；不編造學員作答或驗收。 |
| M09-04 技術變動與責任 | NIST AI RMF／Core、OWASP Agent Security、GitHub README | 原創 Agent／UI／多人變更影響表及遷移練習；計畫不當成操作、認證或已驗收。 |

每篇六節，具類比、用途明確的 flow／cards、合成情境、誤解、最小實作與三題四選項解析，共十二題；qa 為空，未產生英文。沿用 CEH 欄位與共用元件，原 45 篇、工作坊程式、文件、SVG 與 ZIP 保留。

程式與命令驗證從教材 JSON 取出，於 .local/aase/m09/ 執行。git-lab/ 使用獨立 local 身分 aase@example.invalid，建立基準提交，再分別修改兩個已追蹤檔；依文章保存目標副本並從 HEAD 只還原 slice-notes.md。斷言確認目標回到基準、keep.txt 其他修改與備份保留、沒有遠端，未在本 repo 執行練習還原。

README 範例從公開工作坊 ZIP 解壓到 clean-room/，建立新的 .venv，依文中命令安裝及執行。實際 Python 3.12.3、Streamlit 1.51.0、pytest 8.4.2，參考測試 23 項通過；真實瀏覽器檢查缺漏、完整下載 JSON 的檔名／三欄／status／scope／中文，以及變更失效。服務限 127.0.0.1，本次測試另用 8535 埠避免影響既有服務，結束後已停止。沒有另測 Python 3.11 或 Windows；也沒有真人同儕重現、課堂作答、指定品牌 Agent 遷移或多人版驗收結果。
