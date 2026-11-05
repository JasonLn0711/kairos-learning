# AASE 全系列課次與目錄整合

## 範圍與規則

49 篇教材、中英 98 頁沿既有 CEH 共用版型，公開課次統一為 `Mxx-yy`。涵蓋主標題、資訊列、模組目錄、前後篇及搜尋；stable ID 與正式 URL 保留。模組首頁只計算該模組的開放篇數，全系列皆開放時不再顯示其餘概念準備中。

遵循 WRITE-04／05／06／08、HTML-01–04、A11Y-01–03。49 篇各升 patch 與 revision，保留原發布日期；正文、來源、圖解、雙語檢核與工作坊 30 檔 ZIP 不變。前版、版本清單與雜湊見[保存紀錄](../sources/aase/short-titles-2026-11-05/README.md)。未新增教學範圍，沒有新增任意 HTML／SVG 或改變 CEH 資料。

## 本機驗證

- 內容驗證通過；單元測試 194 項通過，包含 49 篇完整物件保存及兩語搜尋／導覽課次。
- Svelte／TypeScript 0 errors、0 warnings。
- publication-boundary 實際建置草稿、未來文章、翻譯及英文課程閘門，全部通過並還原 fixture；release 驗證及 ZIP 逐位元組／SHA256 核對通過。
- CEH M04-04、M04-05 瀏覽器回歸各 5 項通過。
- 首次完整英文 62 通過／1 失敗、中文 64 通過／1 失敗：新增的首頁清單斷言對九個 `.concept-map` 使用單一元素選取器而觸發 strict mode。已修正為逐清單檢查，保留原始 log；完整套件重跑英文 63／中文 65 項全數通過；中文包含 3 項本機 Streamlit 操作。

本機證據位於 `.local/aase/short-titles/`，首次失敗保留為 local-en-first-failure.log、local-zh-first-failure.log。此目錄不進公開網站。

## 發布與接受

程式／內容提交 `3d75544`、文件提交 `9cee4cb` 已推送 `origin/main`，未改寫既有歷史；[Pages run 42008286562](https://github.com/JasonLn0711/kairos-learning/actions/runs/42008286562) 成功。

正式站完整英文 63 項通過、中文 62 項通過，另 3 項本機 Streamlit 依遠端設定略過；本機該 3 項已執行通過。覆蓋 98 篇中英標題、資訊列、正文、前後篇，18 個模組篇數、系列目錄、搜尋、CEH 共用版型幾何、四尺寸及無 JavaScript。工作坊 ZIP 與 checksum 正式下載逐位元組一致；未知概念回傳 404。原下載 SHA256 為 `d745b276f1ce19cb9d128a48f3281cd12d2b96dd3255ee83af18e828d561261d`。

代理另檢視 M04-05 的 390／1280px 頁首，課次、資訊列、導讀及側欄保持共用閱讀版型。此為代理視覺檢查，不提升為獨立真人審稿。正式結果保存於 formal-en-results.json／formal-zh-results.json 及同名 log。獨立真人審稿、10 小時試教、指定 Agent 環境驗收及產業案例包維持待驗；網站自測不代表真人或正式多人系統接受。

### 文件發布後回讀

文件提交 `78af510` 的 [Pages run 42008752101](https://github.com/JasonLn0711/kairos-learning/actions/runs/42008752101) 成功。隨後逐頁 HTTP 回讀在中文 M05-05 出現一次 503；同一路徑於 2026-11-05T10:14:43Z 重查為 200 且正確標題。保留 final-readback-first-503.log 及 m05-05-recheck.log，沒有降低斷言或加入隱藏重試。

重新執行完整回讀通過：98 篇課次／版號／日期、18 個模組與 2 個系列開放篇數、98 筆搜尋課次、兩語未知概念 404、CEH C04／C05 四頁 200、ZIP 與 checksum 位元組一致。結果保存為 final-readback-rerun.log。這證明該次回讀恢復正常，不將一次成功升級為網站長期可用性保證。

Planning 已在既有網站專案 locator 與 2026-11-05 日誌薄鏡像本次狀態及下一關，僅作本機修改；未混入其他 Planning 草稿或建立容量承諾。Planning repository validator 通過，44 個既有警告、0 新增；knowledge validator 為 186／186；兩 repo diff whitespace 檢查通過。課程的程式、原始教材與執行證據仍由 kairos-learning 保管。
