# M07-01｜環境、專案骨架與工具鏈抽換

狀態：已發布並完成正式站雙語全文與八圖回讀。

- 來源：[原稿、四圖、前版與逐節對照](../sources/aase/m07-01/replacement-2026-11-11/source-map.md)。原始六檔 SHA-256 均核對。
- 採用：九節完整雙語、五個技術概念、五步操作、四張表、四張原生圖與八 SVG、三題原選項與原生解析、六組完整 environment-notes 模板。v1.1.0／revision 4；原發布 2026-11-05 保留。
- 圖示差異：餐廳照片以線條圖示取代；配對與平行關係保留。平台命令以直接可讀雙區取代畫面頁籤；窄欄局部程式碼捲動，沒有假切換。下載圖 4 採直向雙區。
- 初驗：283 單元通過、型別 0 errors／0 warnings、publication-boundary 與 validate:release 通過；兩語瀏覽器全文、320／390／768／1280、200%、無 JS、鍵盤、搜尋與八圖 bytes／文字邊界／文字重疊通過。完整紀錄位於隔離工作樹 `.local/aase/m0701/`，待整合後重驗才作本次最終證據。
- 規則：WRITE-01–11、HTML-01–04、FIG-01–06、A11Y-01–03；INT-01 不適用（沒有計算器或假提交互動）。來源、正文、可執行工作坊、發布與學員理解分開。
- 待驗：PowerShell 實機、實體手機、完整螢幕閱讀器及真人理解；瀏覽器模擬結果不代替以上驗收。

本次 owner 為 kairos-learning；使用的稀缺資源是編輯與瀏覽器驗證時間。原始材料、實作及測試保留於 owner，Planning 僅在 locator／狀態改變時承接發布證據與下一驗證閘門。其他章節修改不屬本次提交範圍。


## 整合後實測

327 個單元測試全過，型別 0 errors／0 warnings；正式建置及 validate:release 通過。兩語完整正文／圖解及真實起始骨架共 3 項瀏覽器測試通過；搜尋、下載與 AASE／CEH 共用版型另外 2 項回歸通過。先前較廣的回歸執行在整合前停止，這裡僅採用最終版的上述結果。

Linux 的 Python 3.11.15 執行 Streamlit 1.51.0、pytest 8.4.2；參考版 23、表單 1、檢核切片 24，共 48 測試通過。起始骨架實際顯示未實作檢核與匯出；測試服務結束後 8531 端點已無服務。只驗 Linux，PowerShell 與 macOS 命令保留待實機驗證。

兩語四圖均目視核對 390 與 1280 截圖：配對無流程箭頭、三環境平行、五步四箭頭、平台替代路徑正確。全部八 SVG 為 1682–3404 bytes；內容／位元組與正式 JSON 產生器一致，文字邊界及文字重疊檢查通過。下載圖 4 直向雙區與 HTML 寬版雙欄的差異有明示。

[機器可讀證據](2026-11-11-aase-m07-01-checks.json)記錄來源雜湊、實測範圍與圖檔大小。publication-boundary 的本輪完整執行先於最後一批同期課程整合；最後的正式 workflow 將重新執行發布閘門。正式站回讀將另外記錄，不以本機建置代填。


## 正式發布與完成核對

[PR #109](https://github.com/JasonLn0711/kairos-learning/pull/109)以 merge commit `90d09064b0fd21511897396d02f1b65237c30638`保留雙方歷史。最後一輪整合的 333 個單元測試全過；[PR 品質檢查](https://github.com/JasonLn0711/kairos-learning/actions/runs/42990819628)成功。[正式部署 42990834626](https://github.com/JasonLn0711/kairos-learning/actions/runs/42990834626)成功，內容、單元、型別、publication-boundary、release、下載 checksum 與 Pages 上線閘門皆通過。後續 main `d80aac2a044587cd874629e397c7edcd946b5587`仍保留本課 JSON、元件、產生器、來源與八 SVG；沒有以舊版覆蓋同期課程工作。

正式站的[繁中頁](https://learn.cs-kairos.com/courses/aase/v1/m07/concepts/m07-01/)與[英文頁](https://learn.cs-kairos.com/en/courses/aase/v1/m07/concepts/m07-01/)均顯示 v1.1.0。以正式網址執行相同瀏覽器套件：兩語各九節全文、所有表格／原始命令／範本／圖解／參考答案、搜尋、下一篇 M07-02、四尺寸、200% 文字、無 JS、鍵盤、八份 SVG 下載 bytes 與文字幾何，2 項通過。正式站刻意跳過本機 Python 啟動測試 1 項，沒有將靜態網站當作 Python 後端。

補充實測：Linux Python 3.12.3 依教材使用 `python3 -m venv`、`source …/bin/activate`、`python -m pip install -r …`、版本／執行檔查詢及 `deactivate`，均成功；瀏覽器顯示起始骨架，實際 Ctrl+C 回傳退出狀態 0，8532 端點確認關閉。這些是本次執行證據，不代表讀者已完成作業。

來源完整性依逐小節對照與原碼測試核對，正文呈現依本機及正式站全文核對，圖意另以手機／桌面截圖目視核對；三層證據分開。原稿、四參考圖、前版與修正理由均可回溯。完成的是本課抽換；PowerShell／macOS 實機、實體手機、完整輔助科技與真人理解保持待驗。
