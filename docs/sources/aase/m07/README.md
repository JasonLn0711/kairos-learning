# AASE M07｜來源與新編範圍

日期：2026-11-05。七篇繁中初版均為 v1.0.0、revision 1；依已貼課綱及本 repo 已發布工作坊續編，不冒稱恢復遺失附件。

| 概念 | 來源 | 新編與驗證邊界 |
| --- | --- | --- |
| M07-01 環境與工具鏈 | Python 3.12 venv、pytest 8.4、Streamlit 1.51.0 text_input | 以包內檔案、版本與入口設計環境紀錄；虛擬環境不等同 Sandbox，直接依賴固定不代表全部間接依賴鎖定。 |
| M07-02 規格約束 Agent | Anthropic Building effective agents、OWASP AI Agent Security、Gherkin | 原創單切片任務，文字契約與實際權限分開；不假定各產品自動讀取 AGENTS.md。 |
| M07-03 表單切片 | Streamlit 1.51.0 text_input、AppTest、NN/G | 直接對照 slices/01-form/；教師快照不取代學員實作。 |
| M07-04 規則切片 | pytest 8.4、AppTest、Gherkin | 對照 slices/02-validation/，含直接函式負向測試與介面補正。 |
| M07-05 預覽與匯出 | Streamlit Session State、AppTest、Gherkin | 對照 reference/ 的快照、回呼、相等判斷、匯出重驗與允許欄位，不聲稱正式稽核或多人一致性。 |
| M07-06 審查與決策 | Git diff、Anthropic、OWASP | 分清工作區、暫存區、未追蹤檔案與命令結果；原創審查工作表。 |
| M07-07 除錯與復原 | pytest 8.4、Git diff／restore、AppTest | 原創練習副本中的舊快照持續顯示故障；不誤稱真實歷史 bug，不提供整個專案強制重設。 |

來源網址與查核日期集中於 content/aase/sources.json。Session State 的版本化 URL 未能由來源工具取得，改查官方一般頁面；原理與實際 1.51.0 程式及測試對照，不將一般文件當成固定版本所有功能保證。Anthropic 2024 原文用於簡單可組合任務、測試與工具回饋，不作為當前品牌工具操作指南。其餘既有來源沿原教學範圍引用。

七篇各六節，保留類比、原理、具用途的 flow／cards 圖、合成案例、誤解、最小實作與三題四選項解析，共二十一題。qa 為空，沒有編造學員問答、英文全文或指定品牌 Agent 完整執行證據。既有 32 篇及共享 CEH 欄位、元件不改。

工作坊快照、完整解答、ZIP 與雜湊不在本批修改；其執行證據見 [切片回執](../../../releases/2026-11-05-aase-m07-slices.md)。本批另在忽略目錄 .local/aase/m07/debug-fixture/ 重演教材的受控錯誤：另於 stale-report-fixture/ 驗證原 23 項通過，暫停失效及改用舊快照使清空欄位後的介面斷言失敗，修回後 23 項通過。另以真實瀏覽器確認清空欄位後仍下載舊值，修回副本並停止服務。此結果只證明人工練習的測試回饋，不代表真人學習或真實缺陷修復。
