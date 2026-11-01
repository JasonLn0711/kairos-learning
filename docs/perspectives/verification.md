# 本機實作與瀏覽器驗收 — 2026-11-01

## 結果

已完成雙語專欄、空狀態、文章版型、目錄與來源、清單／程式碼／表格、搜尋及教材反向連結、發布隔離、模板、兩篇去識別化企劃及隔離預覽。此處記錄首次本機驗收，當時尚未提交或部署；正式建置沒有已發布觀點。後續整合與發布見[發布回執](../releases/2026-11-01-perspectives-standards.md)。

本次補正：中文主題標籤、窄螢幕 metadata 換行、表格最小欄寬、不同名稱的可鍵盤捲動區域；實作手記必須有有效觀察時間，禁止與 main 等既有錨點衝突。預覽啟動前檢查連接埠，若占用則失敗退出且不覆蓋既有預覽；支援 PERSPECTIVES_PORT。

## 實際驗收

- 65 項單元／內容測試通過；svelte-check 0 errors / 0 warnings。
- 16 項 Playwright 測試通過，使用獨立無介面 Google Chrome（chromium 專案），未使用個人設定檔。
- 繁中／英文 × 320、390、768、1280 CSS px：列表進文章、語言切換、表格與程式碼顯示；文章及切換後頁面沒有整頁水平溢出，沒有 pageerror。
- 中英鍵盤：Tab 到 skip link、Enter 移至 main、目錄跳轉、程式碼及表格焦點與 ArrowRight 實際捲動；焦點樣式可見；教材往返文章成功。
- 中英關閉 JavaScript：正文、表格、目錄與搜尋頁 HTML 文章目錄仍可使用。
- 中英搜尋：攔截索引請求使其失敗，錯誤訊息與完整目錄保留；解除攔截後重試成功，出現搜尋結果。
- 390×844、DPR 3、hasTouch/isMobile 模擬：tap 完成列表→文章→英文→返回列表。
- 正常 build 的中英專欄呈現空狀態；合成文章路由回傳 404。
- 原生 Safari 曾實際查看 320px 頁面；原生 Chrome 確認 Tab／Shift+Tab、Enter、skip link、目錄與可捲動區域焦點。其餘測試以可重跑 Playwright 結果為準。
- validate:content、publication-boundary、validate:release 通過。邊界檢查檢驗實際公開文字產物；六個 MATLAB ZIP checksum 在首輪通過，靜態檔案一致性在本輪 release gate 重驗。
- npm audit 無 high/critical，5 low；沒有執行強制升級。

## 證據與重跑

`npm run test:browser:perspectives` 建立兩個靜態版本並啟動只綁定回環位址的測試伺服器，測試結束自動關閉。需要 Google Chrome 已安裝。

- 機器結果：`.local/perspectives-browser/results.json`
- 八張雙語完整頁面截圖：`.local/perspectives-browser/screenshots/{zh,en}-{320,390,768,1280}.png`
- 鍵盤焦點截圖：同目錄 `{zh,en}-keyboard-table-focus.png`
- 失敗時 trace／截圖：`.local/perspectives-browser/artifacts/`

已人工檢視英文 320、中文 1280 與修正後中文 390 截圖；表格長字串造成窄欄的問題已修正並重跑全部瀏覽器測試。

先前 browser access host unavailable 的未驗收狀態，已由本輪原生操作與使用者同意的獨立 Playwright 驗收接續完成。尺寸與觸控是瀏覽器模擬，不宣稱實體手機、完整 WCAG 或螢幕閱讀器認證。

## 內容下一步

NAS 的確切 CVE、現場盤點及後續結果，以及憑證公開端最終狀態，仍由兩篇企劃保留待補證據；本次沒有撰寫完整正文或改動實際設備。
