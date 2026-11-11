# CEH 考古題知識筆記入口

2026-11-10。依使用者要求，在 Learn 的 CEH 與 AASE 之外新增獨立筆記入口，名稱採「CEH 考古題知識筆記」。

## 範圍與維護

- 中英文首頁皆加入並列入口；固定網址 `/ceh-notes/`、`/en/ceh-notes/`。
- 共用 catalog 登記路由與搜尋項目，沿用靜態頁、語言切換、canonical、網站地圖與既有樣式。
- 尚未提供第一篇內容，頁面明示尚無已發布筆記；本次建立入口，沒有生成題目、答案或個人學習紀錄。
- 後續每篇以日期與主題識別，整理知識原理、作答／選項判斷、待查事項、來源與相關教材連結。首篇供稿時再擴充文章清單及資料模型，沿用既有雙語、來源與發布閘門規範；目前沒有編輯表單或自動發布功能。
- 正式網站與工程證據由 kairos-learning 維護；考試學習進度留在原有 CEH 學習紀錄。原工作目錄的 README 與 CEH 發布計畫修改保留於原處，本次從 origin/main 建立隔離工作樹。

## 實測

適用 WRITE-01–03、05、11；HTML-01–04；A11Y-01–02。本次無新增圖檔、教學互動或題目。

- `pnpm run validate:content`：22 篇雙語教材、51 題與29詞彙通過。
- `pnpm test`：282 通過，0失敗；新增獨立雙語路由及搜尋回歸檢查。
- `pnpm run check`：0錯誤、0警告。
- `node scripts/check-publication-boundary.mjs`：通過隔離教材與中英文草稿／未來日期封鎖，重建乾淨正式產物。
- `pnpm run validate:release`、`pnpm audit --audit-level=high`、HTML validator 單元測試及 `git diff --check`：通過。
- `node scripts/check-ceh-notes-browser.mjs`：雙語首頁入口、筆記頁、320／390／768／1280寬、無JavaScript、200%文字與鍵盤跳至正文通過。截圖位於忽略目錄 `.local/ceh-notes/`；目視檢查320px中文頁，正文重排且無水平溢出。
- 瀏覽器使用已安裝的 Playwright Chromium；本機沒有 Google Chrome。未執行實機或完整螢幕閱讀器驗收。

## 發布閘門

前次成功 Pages run：42604817445（96255f61a1ac208025c1d5b71baabe8008f3a6e1）。最近 main 的42763444088在Pages讀取產物階段失敗；保留歷史。本次提交後由既有 Pages workflow 部署，再回讀首頁與兩語筆記頁。Git推送、工作流程成功與正式頁可讀分開確認；發布不代表學習完成。
