# M04-06 錯誤復原、可近用與易用性完整抽換

## 採用與範圍

將使用者六節完整供稿採為 AASE-M04-C06 v1.1.0（revision 4），原發布日維持 2026-11-05、版本修訂日 2026-11-11。公開網址及雙語發布閘門保留。正本由 kairos-learning 持有；逐小節編輯及圖意／瀏覽器驗收時間為本次稀缺資源。原稿、五PNG、前版及雜湊見[來源紀錄](../sources/aase/m04-06/replacement-2026-11-11/README.md)，完整採用與修正見[對照](../sources/aase/m04-06/replacement-2026-11-11/source-map.md)。

兩語各七個section，完整承接導言、六節、三個可近用性小節、銀行A/B/C、四張比較表、完整email程式碼、五步練習與醫療AI整合情境。舊六錨點保留；開放題Q04–Q06與原題區分，qa維持空。既有實作練習與觀察範本的證據界線保留。

五圖依附圖重製為原生HTML，搜尋及十份獨立SVG共用正式JSON。錯誤訊息為靜態示範；加號表示三個共同條件；CMS錯誤摘要連結可聚焦對應靜態欄位，沒有資料提交。分支圖明列缺漏／失敗與成功條件，手機上下排列仍維持替代分支。原圖保留，字型、卡片尺寸及手機重排與原截圖不同；CMS示意的圈號引線改為可讀編號標題。

## 適用規則與驗收

WRITE-01–06、08–11：原供稿與前版完整保存，逐小節核對雙語深度、數字與界線，原發布日及語意版本對應；來源、採用、驗證與發布分層。WRITE-07：沿既有品牌署名。

HTML-01–04、FIG-01–06、A11Y-01–03：全文為可搜尋文字，表格／程式碼採命名的可鍵盤局部捲動容器；圖解可重排、焦點可見，正文直接可讀。僅參考答案原生收合。INT-01：本次未新增計算或模擬互動，不適用計算邊界驗收。

已執行第一輪本機中英兩項瀏覽器檢查：320／390／768／1280 CSS px、100%／200%字級、無JS、Tab／Shift+Tab／Enter／Space、摘要連結聚焦、全文／表格／程式碼／答案、搜尋與十SVG bytes／文字邊界／重疊均通過。已目視兩語五圖的桌面與手機截圖，另檢查英文分支SVG；最終隔離版本兩語各一項測試亦通過（2 passed，9.8s），加號改為獨立裝飾分隔，不再伸出卡片。

第一輪全測與發布邊界曾同時執行，暫時CEH fixture干擾全測；該輪不作最終驗收。舊雙語／短標題遷移測試已改讀本次保存的前版，當前教材由新專屬測試驗證。依序重測：295／295單元通過；svelte-check為0 errors／0 warnings；內容驗證、發布邊界、validate:release及正式建置通過。107個原稿段落單位已由adoption-audit.json分類對照，無未分類漏項。

## 發布與下一個閘門

使用 origin/main 為基底的隔離工作樹，只攜入M04-06相關變更；原工作樹其他課次與共用元件修改保留。來源提交94996f6、教材實作0f4489f；合併保留M04-02與M04-01回執後，以dccd3c4推送main，當次fetch確認0 0。合併後297／297單元、型別零錯誤／警告、M04-06雙語瀏覽器2項及M04-02回歸2項通過。[GitHub Pages run 42985502154](https://github.com/JasonLn0711/kairos-learning/actions/runs/42985502154)全部閘門與部署成功。2026-11-11 16:17（Asia/Taipei）正式站雙語瀏覽器測試2／2通過（20.3s），實際回讀v1.1.0、全部正文／表格／程式碼／答案、五圖、搜尋與十SVG；下載bytes與本次提交逐檔相符，文字邊界與重疊檢查通過。

Planning角色為定位、驗證與發布狀態及下一步；不複製原稿與圖檔。本次未變更課程容量或工作坊程式。

待驗：實體手機、螢幕閱讀器及真人任務測試。瀏覽器自動化證據不代表完整WCAG合規或學員理解。

## 正式頁面與可重現證據

- [繁體中文M04-06](https://learn.cs-kairos.com/courses/aase/v1/m04/concepts/m04-06/)
- [English M04-06](https://learn.cs-kairos.com/en/courses/aase/v1/m04/concepts/m04-06/)
- `AASE_BASE_URL=https://learn.cs-kairos.com pnpm exec playwright test --config playwright.aase-m0406.config.ts`：2 passed。Linux／Playwright Chromium；四寬度、200%文字與無JS均於正式站重測，摘要定位與原生答案鍵盤操作通過。
- 本機可重現：兩支產生器與來源audit的 `--check`、來源SHA256SUMS、`pnpm test`、`pnpm run check`、`node scripts/check-publication-boundary.mjs`、`pnpm run validate:release`。發布邊界指令會暫時改動fixture，須與全測依序執行。
- 瀏覽器JSON、trace與桌面／手機／SVG截圖在隔離工作樹 `.local/aase/m0406/`；來源與內容對照公開保存在本repo。原工作樹既有未提交內容未納入本次發布。

本次來源保存、正文採用、圖解設計、必要驗證、Git推送及正式站回讀均已完成；真人與輔助科技驗收保持上述待驗狀態，沒有轉寫成已通過。
