# 共用 Rust 工具連動

共用實作由私人 [kairos-rust-tools](https://github.com/JasonLn0711/kairos-rust-tools) 維護；[使用端總表](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/integrations.md)回連本庫。工具來源與完整 commit 記於 [kairos-tools-source.json](../kairos-tools-source.json)，本庫選用的規則記於 [workspace-verify.json](../workspace-verify.json)。

依共用庫的[跨電腦安裝文件](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/installation.md)取得固定版本後，在已有 `build/` 的本庫執行 `workspace-verify run workspace-verify.json`。不要求共用庫放在 sibling 位置；安裝後從 PATH 呼叫。只 pull 本庫不會自動安裝該工具。

本設定包含 package JSON 語法、site 到 build 的位元組保存（排除根 index.html）、公開產物衛生及 HTML 本機連結/錨點。它是完整發布檢查的共用子集；原有 `validate:content`、`validate:release`、TypeScript／單元測試、發布邊界、語言/CSP 及瀏覽器檢查持續由本庫負責，參見[發布與回復](publishing-security.md)。目前未修改正式站部署流程。

效能判斷依共用庫的[量測方法與結果](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/performance.md)，不能把 JSON 單項加速外推成完整網站發布加速。升級時同時審閱來源 SHA、設定範圍、正反例與本庫發布閘門，再回寫使用端總表。新增本機設定不代表該次變更已正式部署。

## 維護與回復連動

[README](../README.md) → 本文件 → [固定來源](../kairos-tools-source.json)＋[檢查設定](../workspace-verify.json) → [共用使用端契約](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/consumer-contract.md)。本機來源 checkout 可放任意位置，私人來源需要讀取權限。

要重現固定版本，將指定 SHA 安裝到獨立 prefix，直接呼叫其 bin/workspace-verify；全域命令可能來自另一個 revision，--version 也不能證明 commit 相同。保留工具 checkout 的 git rev-parse HEAD 與安裝紀錄。回復時一起選回相容的來源 SHA 與 profile，重新安裝並執行上述原有專案閘門；升級後同步更新本文件與共用庫總表。

## 2026-11-08：文章驗證的共用文字層

16 支文章驗證腳本原有完全相同的 HTMLParser 文字／details 擷取與正規化，已集中至
[scripts/validation_html.py](../scripts/validation_html.py)。另三支 M03-03／04／05
會排除 script/style 文字，保留各自的 parser，只共用相同的 `norm`。共用來源與測試
透過 [workspace-review-sources.json](../workspace-review-sources.json)明確納入盤點。

19 支完整驗證器對目前 build 的 stdout、stderr、退出碼均與抽取前相同且通過；四個
回歸測試涵蓋 entity、script 文字、details 順序／open、HTTPS label 與 Unicode 空白、
跨實例隔離。執行 `python3 -m unittest discover -s scripts -p test_validation_html.py`
可重驗共用契約。每篇的正文順序、答案 ID、圖檔、ZIP、搜尋與連結規則仍由原入口持有。

這次減少重複實作，未新增 Rust subprocess，也未修改文章或圖檔。Python HTMLParser
與 Rust HTML parser 的相容性須另有證據，不能用泛用 HTML 檢查直接取代本契約。未量得
整體效能、能源或 LLM token 節省，亦不將靜態檢查當成瀏覽器／正式站驗收。

共用層的四項 Python 回歸測試已接入品質與 Pages 發布 workflow，避免只在本機驗證。
Rust inventory 實測已發現 `validation_html.py` 與 `test_validation_html.py`，零 discovery error；
這只證明宣告的兩個來源已納入，不代表其他文章規則已全數審核。

## 2026-11-08：可見文字解析與剩餘抽取邊界

M03-03／04／05 的三份相同 parser 已集中成 `validation_html.VisibleText`。
它保留既有 script/style 隱藏狀態處理；原本包含 script 文字的 `Text` 行為不變。
6 項回歸測試涵蓋兩種政策、entity、details、空白、未閉合／自閉合標籤及跨實例隔離；
三支完整驗證器對現有 build 的 stdout、stderr、退出碼均與修改前一致且通過。
這只證明此解析器抽取的相容性，不新增文章、圖檔、瀏覽器或正式站驗收。

M02-01 至 M02-08、M03-01 至 M03-08、M09-04 至 M09-06 的 19 支入口，
以及 M01-07 來源驗證器，仍混合正文順序、答案 ID、導覽、搜尋標籤、SVG 內容、
位元組保存與 ZIP 成員比較。共用 Rust 的一般檔案／HTML 子集不足以代替這些完整
契約；後續抽取須保留 M02-03 的原始 ZIP 例外、M02-06 的雙 ZIP 與網路圖、
M03-01 的視覺文字選擇、M03-02 的新增圖例外及兩種 HTML 文字政策。
[工具庫責任紀錄](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/rule-ownership.md#learning-static-article-contracts--2026-11-08)
將其列為候選，不把局部重用記為全面 Rust 遷移。尚無此抽取的時間、能源或 Token 量測。
