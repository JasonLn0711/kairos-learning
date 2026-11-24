# Task 08　發布就緒審查

**Task 08 本機重建與驗收完成。全站發布仍為 CONDITIONAL。** 本次驗證的實作提交為 `41f9725bc366ba57a8bef60d05db6170570d29fb`，基準為 `14f59dd17b7f8978452a3d026416b5092a770a45`。代表課人工驗收後整合版型候選提交 `88aac708bdadca98bb391ad13a1da2bde5290e11`，重新建置並按六章驗證。[整合版驗證紀錄](../../../.local/interactive-v2/task08/integrated/)

| 檢查 | 實測與範圍 |
|---|---|
| 安裝與建置 | 整合前已驗證 pnpm frozen install。整合版重新 build 通過。型別檢查 0 error、0 warning，單元測試 454/454。建置仍有大型 JS chunk 提示。 |
| 教材、靜態輸出與下載 | 雙語內容檢查通過。最終 validate_release.py 檢查 512 頁、1,062 個原樣靜態資產。六個 MATLAB／參考資源 ZIP 的 SHA-256 一致。與基準比對 content、site、static 無差異。 |
| 暫存教材發布邊界 | Task 07 依序執行兩個 publication fixture，再乾淨建置與 validate:release，均通過。Task 08 改動限於視覺與驗證。 |
| 代表課功能 | 最終建置 Request Lifecycle 14/14、AASE immersive 29/29。涵蓋配對語系、歷史導覽、快取／慢速變體、鍵盤、無 JS、數學、權限、重試、縮放與背景暫停。 |
| 視覺證據 | 最終靜態頁兩語系、八種尺寸與三課情境共 208 張。六章各幕各語系另 240 張，逐一核對標題、來源及 renderer。獨立家族候選另有 240 張。 |
| 瀏覽器 | Chromium 完成上述測試；WebKit 針對三課第二步、兩語系、320/1280 px 共 12 個載入與重排檢查通過。Firefox 與實體手機仍待驗。 |
| 依賴 | pnpm audit 通過。pipx 缺少，改由 uvx 以同版 pip-audit、相同鎖檔與 require-hashes 參數通過。 |

## 其他課程回歸

整合前共執行 80 套 Playwright 設定。77 套廣泛檢查初次 65 套通過，補環境與修正連接埠後另 3 套通過，加上專用預覽與兩套代表課，最終 71 套通過、9 套仍有失敗。各設定與個別退出碼見[逐套紀錄](../../../.local/interactive-v2/task08/suite-progress.log)，每套的錯誤堆疊與未執行案例另存[原始輸出](../../../.local/interactive-v2/task08/suites/)。初次廣泛檢查採每套首敗即停。兩套代表課使用上表最終完整結果；觀點草稿使用專用預覽，16/16 通過。

- 修正英文圖譜入口後，AASE bilingual 全套 54 passed、9 failed。9 個失敗案例全數在改版前基準重現。AASE 工作坊補齊鎖定的 Python 環境後 46 passed、19 failed，19 個失敗案例也在基準重現。兩組共 28 個案例逐頁比對相同的首個斷言錯誤。[逐頁比對](../../../.local/interactive-v2/task08/baseline-failure-comparison.json)。[英文](../../../.local/interactive-v2/task08/atlas-reflow.log) · [工作坊](../../../.local/interactive-v2/task08/aase-workshop-retry.log)
- AASE M01-03 的原生選單鍵盤測試在原始基準也得到 reviewer，斷言期待 b。CEH M04-C03/C04/C05 的 sitemap 排除式涵蓋已發布的 m04-10，基準與最終版的該頁都回應 200 且列入 sitemap。[基準選單](../../../.local/interactive-v2/task08/baseline-m0103.log)
- 兩套連接埠衝突改用獨立本機靜態站後通過，M03-04 為 2/2，M04-08 為 8/8。M07-01 補齊測試環境後 3/3。AASE M07-05 的檢查按鈕在修改輸入後消失；CEH M04-C06 原生選單以 Home、ArrowDown、Enter 操作後仍選到 777；NAS 文章的 #related a 數量為零。三項均已在基準與最終版以同一操作比較，觀察結果相同。[控制項比較](../../../.local/interactive-v2/task08/baseline-controls.json) · [連結比較](../../../.local/interactive-v2/task08/baseline-selectors.json)

## 變更、回復與正式站讀回

變更涉及互動外框、Stage、播放時鐘、場景轉接、視覺元件、圖譜入口樣式、測試及本系列文件。可用 `git diff --name-status 14f59dd 41f9725` 取得逐檔清單。正式站與 DNS 沿用既有版本。

若要在另一分支還原，依新至舊順序 revert：41f9725、dd41c2d、ee69ea83、7412a0a3、11b4e383。140224ba 僅為研究紀錄，可保留。候選家族的來源另保留在獨立分支。還原後重新建置並複驗三課、雙語錨點與六個 ZIP。

若日後另行授權發布，應先處理或接受上列未通過項目，鎖定核准的 SHA，重跑發布邊界及視覺驗收。部署後讀回雙語三課及四十單元路由，操作 DNS、慢速 DB、滑桿與阻擋關卡，讀回靜態來源、SVG、sitemap、搜尋、CSP 及下載雜湊，並留下時間、URL 與版本。

[人工評分與圖像](08-first-slice-evidence.md) · [逐單元矩陣](08-forty-unit-rollout-matrix.md) · [最終測試紀錄](../../../.local/interactive-v2/task08/)
