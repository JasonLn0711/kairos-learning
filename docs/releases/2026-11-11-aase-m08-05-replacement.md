# M08-05｜任務導向易用性測試完整抽換

已正式發布並完成[中文](https://learn.cs-kairos.com/courses/aase/v1/m08/concepts/m08-05/)與[英文](https://learn.cs-kairos.com/en/courses/aase/v1/m08/concepts/m08-05/)回讀；完成證據見本文末段與[機器可讀結果](2026-11-11-aase-m08-05-checks.json)。

本次以使用者完整供稿抽換正式雙語教材，導言及十節、四個誤區子節、四張一般教學表、九列觀察表、六步流程、兩狀態設計比較及四選項理解題進入正文。原發布 2026-11-05 保留，v1.1.0／revision 4，版本修訂 2026-11-11。六個舊錨點保留；舊 Q01–Q03 由供稿情境題 Q04 取代，原題仍保存在前版。

[來源紀錄](../sources/aase/m08-05/replacement-2026-11-11/source-map.md)保存原文、三張 PNG、前版、兩語稿及逐節採用界線。圖 1 六步順序、圖 2 虛構觀察紀錄、圖 3 改版前後靜態提案均由正式資料產生；三圖的六份 SVG 維持受審核元素白名單與 100000 bytes 上限。

## 驗收狀態

WRITE-01–06、08–11：已逐節核對原供稿與兩語稿，保留點餐機完整情境、四類測試、三個易用性面向、五產業、三層證據、九列紀錄、兩項啟發式、四誤區、三階段合成任務及原情境題。搜尋來源卡與對話式網址更正移出成稿，原文仍完整保存。

HTML-01–04、FIG-01、03–06、A11Y-01–03：雙語瀏覽器 2／2 通過。涵蓋全部正文、表格、圖解及答案，320／390／768／1280 各 100%／200%、無 JS、鍵盤焦點／原生收合／局部捲動、搜尋及六份 SVG 位元組、字框與重疊檢查。桌面中文與手機英文三圖截圖已人工比對參考圖關係；另人工讀取圖 3 中文及圖 2 英文 SVG。INT-01 不適用；圖中動作標籤不執行操作，未增加計算或提交功能。真人裝置、完整輔助科技及真人易用性測試未執行。

內容生成器、SVG 同步及原件雜湊／兩語逐行採用測試已通過。首次全套單元發現兩個歷史遷移測試仍比較舊 M08-05，已改以保存前版驗證原歷史並保留新版獨立全文測試。新增圖解驗證器的型別縮小已修正；型別 0 errors／0 warnings，全套單元 324／324 通過。瀏覽器首次執行發現同節兩表共用標題，已在生成器加入獨立表號，接續重建及重跑。

## 發布

隔離工作樹 `/tmp/kairos-m0805` 從遠端 main 建立，保留原工作目錄其他課次修改；尚待必要驗收、提交、推送、部署與正式頁回讀。詳細來源與執行證據由 kairos-learning 持有；Planning 的角色為定位、狀態與下一驗收節點。

## 本機實測紀錄

- `python3 scripts/aase_m0805_content.py --check`、`python3 scripts/aase_m0805_svg.py --check`：通過。
- `pnpm run validate:content`：通過。
- `pnpm run check`：0 errors／0 warnings。
- `pnpm test`：324／324 通過；來源雜湊、兩語逐行採用與無效圖解拒絕包含在內。
- `node scripts/check-publication-boundary.mjs`：通過；草稿／未來日期 808 個文字產物及英文課程兩個閘門均實際建置檢查，fixtures 已移除並乾淨重建。
- `pnpm run validate:release`：通過；唯一表號修正後再次執行亦通過。
- `pnpm exec playwright test --config playwright.aase-m0805.config.ts`：2／2 通過（8.1s）；增加逐段順序斷言後另行執行，結果見整合補充。
- `git diff --check`：通過。

本機截圖與瀏覽器證據：隔離工作樹 `.local/aase/m0805/`；日誌 `/tmp/m0805-*.log`。此處結果只代表本機教材與瀏覽器模擬，不代表真人試用、完整輔助科技或全站文章驗收。

## 整合與驗證界線

來源提交 `6a5ee65`，教材與圖解提交 `7dc9511`。合併固定目標 `8d5e5f5370ec51eb4d5f9c167aa3ce934681e542`，保留同期主線的其他章節。共用元件各課分支、驗證器各課規則、歷史前版定位與文件段落均保留。

首次衝突處理讀取共享的 `origin/main`，其他工作更新該參照後，取用了較新的 TLS 元件引用與前版路徑，但當次合併尚未包含對應檔案。型別檢查與歷史單元因此失敗；初始靜態建置失敗造成後續 release 缺資產及瀏覽器 404，該次沒有發布。已改成從固定 `MERGE_HEAD` 取用檔案，並重新執行含停止於錯誤的完整驗證流程。修正後內容、型別 0 errors／0 warnings、337／337 單元通過；其餘整合結果接續補記。

增加逐段／表格儲存格／圖解節點的全文順序斷言後，本課雙語瀏覽器再次 2／2 通過（12.2s）。此斷言直接讀取頁面文字，不以 JSON 章節數代替呈現驗證。

整合後完整重跑：內容通過；型別 0 errors／0 warnings；337／337 單元通過；publication-boundary 實際草稿／未來日期及英文課程兩閘門通過，fixtures 清除並乾淨重建；release 通過；本課雙語含全文順序瀏覽器 2／2 通過（9.7s）；`git diff --check` 通過。

## 主線合併與部署追蹤

同期主線持續新增其他課次，數次直接推送因 non-fast-forward 被拒絕；每次均以 merge 保留雙方歷史，沒有 force push。最後建立 [PR #110](https://github.com/JasonLn0711/kairos-learning/pull/110)，審查範圍為本課 29 個檔案。以確切 head `aa3d377e775f081de8d9e0b16f77336fc5b92f40` 採 merge 方式合併為 `1565a49c3c0dc0b0c725ee0a528857a2a9608d64`。合併後 fetch、fast-forward 與 divergence 0 0 已核對。

最後整合的型別 0 errors／0 warnings、370／370 單元通過。本課正文與 SVG 生成器 `--check` 再次通過；主線合併樹乾淨 build 後，雙語全文順序及全部圖解瀏覽器 2／2 通過（6.8s）。CEH M04-02 共用版型回歸 22／22 通過（33.1s）；工作坊後端未改，本次未啟動 Streamlit。

本次 push 的 [Pages 工作 42992282466](https://github.com/JasonLn0711/kairos-learning/actions/runs/42992282466) 尚未開始執行即被 concurrency 的新 pending 工作取代，狀態 cancelled、jobs=[]；不是成功部署。已核對其後繼 `978db68fdea2603017d1b3de5066ef044ff86779` 包含本課合併提交，目前追蹤 [Pages 工作 42992328799](https://github.com/JasonLn0711/kairos-learning/actions/runs/42992328799)。正式頁回讀接續補記。

## 正式部署與回讀（完成）

- 實際部署提交 `3ed7e2e1ee0765c5c976d0cfb7b5b5ee4d45f87d`，已核對包含本課 merge `1565a49`。其 [Pages 工作 42992453184](https://github.com/JasonLn0711/kairos-learning/actions/runs/42992453184) conclusion=success，2026-11-11T09:09:57Z 完成。此前 pending 工作 42992328799 與 42992428921 亦被 concurrency 取代；以這次實際成功部署為證據。
- 正式 CI：373／373 單元通過，6 個共用靜態 HTML 測試、內容、型別、實際 publication-boundary、release、既有下載雜湊、artifact 及 Pages 部署各步驟均成功。原始 CI 記錄 `/tmp/m0805-production-ci.log`，工作狀態 `/tmp/m0805-production-run.json`。
- `AASE_BASE_URL=https://learn.cs-kairos.com pnpm exec playwright test --config playwright.aase-m0805.config.ts`：2／2 通過（16.8s）。兩語逐段、表格儲存格、圖解節點及答案全文順序實際比對；四尺寸各 100%／200%、無 JS、鍵盤、搜尋、六份 SVG 開啟／字框／重疊／下載位元組均通過。日誌 `/tmp/m0805-production-browser.log`。
- 另以正式瀏覽器核對兩語 metadata：原發布 2026-11-05、v1.1.0、版本修訂 2026-11-11；六個舊錨點均存在且唯一。
- 已人工回讀正式站圖 1 中文桌面、圖 2 英文手機、圖 3 中文桌面截圖，與參考圖的順序、九列資料、上下比較及虛構／示意界線相符；細部呈現差異明列於來源對照。完整截圖與 SVG 證據在 `.local/aase/m0805/production-*`。
- 單次 Python urllib 讀頁曾回傳 403；正式驗收使用標準瀏覽器上下文，兩語頁面、搜尋與下載均成功，沒有修改網站存取設定。

WRITE-01–06、08–11、HTML-01–04、FIG-01、03–06、A11Y-01–03 的本次適用檢查已完成；FIG-02 的空間圖與 INT-01 的參數互動不適用。真人易用性測試、實體裝置、完整輔助科技及學習者理解仍未評估；工作坊後端未改且未執行。這些界線保留於機器可讀紀錄，不由教材驗證推成使用者或產品驗收結果。
