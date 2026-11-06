# 共用瀏覽器版本契約修正 — 2026-11-06

獨立分支 test/course-rail-version-contract-2026-11-06，基準 main b8d172d01b8e1c36776e9980097172ff53aeecac。本次僅修改測試及本紀錄；不包含 M04-08 教材或其換行修正，也未合併或部署。

## 原因與契約

11/05 導覽修正的歷史 manifest 記錄當時版本。M04-03、M04-05 後續由 v1.0.1 更新為 v1.1.0，瀏覽器測試仍將目前頁面與歷史版號做相等比較，因此失敗。manifest 保留原始內容，不改寫成目前版本。

既有單元測試已允許 canonical 版本超過歷史下限，並保護原發布日及同版本內容雜湊。本次將瀏覽器契約與此歷史用途對齊，同時維持「頁面必須精確符合目前 canonical」的要求：

| 欄位 | 歷史保護 | 目前頁面驗證 |
|---|---|---|
| 身分 | canonical id 與歷史 row 一致 | 仍以原頁面路徑取得 HTTP 200 |
| 版本 | canonical SemVer ≥ 歷史 after 版本 | 顯示版本精確等於 canonical；不是只檢查 ≥ 下限 |
| revision | canonical revision ≥ 歷史 after revision | 保留原有資料檢查；不將內部 revision 當公開版號 |
| 原發布日 | canonical 等於歷史 publishedOn | 頁面原發布日精確等於歷史值 |
| 修訂日 | canonical date／revisedOn ≥ 歷史修訂日 | 頁面版本修訂日精確等於目前 canonical 欄位 |
| 內容校對日 | 獨立於原發布／修訂日期 | 容許 ArticleMetadata 的第三個內容校對日期，不拿它替代版本修訂日 |

tests/helpers/course-edition-contract.ts 只由測試引用，不進入網站執行程式。六個測試案例驗證同版本、後續合法更新、過時頁面、看似相近但不同的版號、錯誤日期、身分／歷史下限退回，以及舊章節 revisedOn 欄位。過時頁面即使符合歷史下限，也必須失敗。

## 已驗

- npm run validate:content：通過。
- npm test：43 個測試檔案通過；包含六個新版契約案例與原歷史內容保存測試。
- npm run check：0 errors／0 warnings。
- node scripts/check-publication-boundary.mjs：通過，含隔離 fixture、draft／future、英文課程閘門與乾淨 build 重建。
- npm run validate:release：完整靜態 release 通過。
- npx playwright test --config playwright.course-rail.config.ts：7 passed、0 failed。最後一次結果起於 2026-11-06T09:23:59.427Z，約 54 秒；精確機器紀錄以忽略目錄 results.json 為準。
- 版本／日期檢查走完 53 筆 manifest × 2 語言，共 106 個本機靜態頁；M04-03、M04-05 均通過目前 v1.1.0 的核對。
- 原有六項導覽回歸維持：CEH 中英、AASE 繁中；JS 開／關，各 320／390／768／1280 CSS px、root 字級 100%／200%、文字未裁切、焦點與導覽連結。
- 所有 content/、src/ 及歷史 manifest，逐檔與基準 main 做位元組比較，完全相同。M04-08 分支保持獨立。

首輪 helper 對日期總數的檢查過嚴，遇到舊章節額外的內容校對日期而失敗；已依既有 ArticleMetadata 欄位順序精確驗原發布／版本修訂兩欄，保留第三欄，並加入接受合法校對日期及拒絕過時修訂日的案例。首輪失敗 JSON／log 已保留，沒有改動教材來配合測試。

## 待驗與界線

- 只驗本機 Linux／Playwright Chromium；未驗正式站、實體手機或完整螢幕閱讀器。
- 200% 為既有 root CSS 字級模擬；不宣稱已驗瀏覽器原生 text-only zoom。
- 前次正式 M04-03 頁面 HTTP 403，本次未重試，也未更換途徑讀取。
- 本次不修改 CI workflow；既有 CI 跑單元與靜態閘門，七項瀏覽器回歸的證據來自本機。
- 獨立 PR 未自動整合到 M04-08 draft PR；後續整合／review 另依授權處理，沒有部署。

本機證據：.local/course-edition-contract/{unit,types,boundary,release,browser}.log；.local/aase/rail-fix/results.json 與瀏覽器截圖。首輪失敗保存在 .local/course-edition-contract/first-browser-results.json 及 first-browser.log。上述目錄被 Git 忽略。
