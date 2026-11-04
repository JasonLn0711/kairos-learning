# M04 舊版教材歸檔 / Legacy M04 archive

2026-11-04 依使用者要求撤下舊版公開教材。此目錄不屬於 content、src 或 site，不進靜態網站建置。

manifest.json 記錄原始路徑、SHA-256、位元組數、原 ID、雙語 URL、原發布日期、原版號與可恢復基準 commit。registry.json 是舊 12 項目錄；content 是原本已公開的正文、測驗及匿名問答；site 是舊下載圖；src 是舊補充資料及元件；baseline 保留遷移涉及的共用檔案原版。不匯入私人原稿、個人答案、理解程度或進度紀錄。

The archive contains previously tracked public website material only. Legacy delivery and Q&A do not establish learning or publication of the new route.

## 可恢復性驗證 / Recovery verification

先建置，再執行 `python3 scripts/verify-m04-retirement.py`。檢查器核對所有雜湊，將所有原檔還原到隔離暫存目錄，與基準 Git object 逐位元組比較；不改正式來源或部署。

## 恢復方式 / Restoration

基準：`11f068dc1d9c04fcf7201648d6264a2093c2842e`；最後成功 Pages：[41748093023](https://github.com/JasonLn0711/kairos-learning/actions/runs/41748093023)。

1. 在新的恢復分支檢視本次 migration commit；以新的 revert commit/PR 恢復受影響來源，保留兩邊歷史，不 reset 或 force-push main。若之後已發布新版教材，逐項比較再還原，不直接覆蓋後續工作。
2. 若需重建個別原檔，依 manifest 的 archivePath 複製到 originalPath，先核對 SHA-256；baseline/content/concepts.json 包含完整舊目錄。恢復舊公開教材須連同舊共用元件、資料匯入、靜態圖檔及關聯資料一起審查。
3. 重跑內容、單元、型別、發布邊界、release、下載及瀏覽器驗證，再循 PR／Pages 發布；正式回讀雙語首頁、正文、MATLAB、圖檔與 404。
4. 如原 Pages artifact 仍可用，也可在明確授權後循既有 runbook 重跑已知正常 commit 的部署。這次沒有執行正式 rollback 或部署。

目前新版十單元都只有目錄，沒有教材正文。之後發布 CEH26-M04-C01 時應加入同 ID 的雙語教材並沿用 status/date gate，同步更新「全數待發布」文案與驗收數字；不可把舊 M04-01 改名後當作新版交付。
