# AASE M03-02 角色、利害關係人與訪談：抽換回執

2026-11-07。正本為 kairos-learning 的 `AASE-M03-C02`，v1.0.2 → v1.1.0，revision 3 → 4；原發布日維持 2026-11-05。九節供稿及開場進正式雙語正文，三張參考圖改為響應式 HTML 與六份同源 SVG；兩張原始表格、完整 problem.md、四題三選項情境檢核與逐選項參考解析均納入。

[原文、三圖、舊版與雜湊](../sources/aase/m03-02/replacement-2026-11-07/)與[逐小節對照、修正與圖意差異](../sources/aase/m03-02/replacement-2026-11-07/source-map.md)留在教材 repo。保留全部舊章節錨點、網址、公開日期與翻譯閘門。課程 CEH 的同名課次保持獨立。來源核對為本次實際回讀的 GOV.UK 兩份指南；合成案例不視為實際訪談證據。

## 規則與驗收

適用 WRITE-01–11、HTML-01–04、FIG-01–06、INT-01、A11Y-01–03。INT-01 本次只有原生答案展開，沒有計算器、送出、評分或進度狀態。FIG-02 的固定下載圖與重排 HTML 分別驗收。

來源到成稿：依 source-map 逐節閱讀九章、兩個 Role／Stakeholder 小節、三個訪談小節、四層證據、規則衝突的條件分支、完整範例及四題。中文保留原供稿的具體對話與推理，英文對應相同教學深度；同一中文 code 另有逐欄完整英文解讀。表格與圖解直接可見，只有參考答案收合。

## 本機驗證

- `npm run validate:content` 通過；`npm test` 251/251 通過。兩項歷史遷移測試改讀本次保存的舊版，另有三項本次測試檢查日期／舊錨點／來源 bytes／原選項與完整 code、圖解錯誤種類及節點數拒絕、匯出一致性。
- `npm run check`：0 errors、0 warnings。`node scripts/check-publication-boundary.mjs` 通過，完成草稿／未來日期與英文閘門隔離後重建正式輸出。`npm run validate:release` 通過。
- `python3 scripts/aase_m0302_svg.py --check`：六圖 bytes 一致，1368–2602 bytes。`git diff --check` 通過。`npm audit --audit-level=high` 通過；既有依賴有五項 low，未擴張本次教材範圍進行破壞性套件升級。
- `npx playwright test --config playwright.aase-m0302.config.ts`：雙語 2/2 通過（8.5 秒）。逐段全文、小節、所有表格／code／選項／解析、四寬度、兩字級、鍵盤可見焦點／答案 Enter 與 Space／局部捲動、無 JS 與搜尋全文皆通過；六份 SVG 實際開啟、邊界與重疊及 bytes 通過。
- 截圖在 `.local/aase/m0302/`（忽略目錄）；人工檢視中文流程桌面、四層證據桌面／手機、階段比較手機，以及英文流程手機、四層證據桌面與 SVG、階段比較桌面。圖 1 四箭頭與末步淡綠、圖 2 無箭頭與分層限制、圖 3 兩欄轉單欄保持語意。

## 整合、發布與正式回讀

- 來源提交 `51bb765`、正文／圖解／測試提交 `290523a`、來源對照與本機回執 `1a2fc01`；後續測試型別修正 `7a3bfd8`。遠端更新以合併 `3586781`、`82fc819` 保留，M03-01 的新圖解與歷史測試也完整保留。
- 整合後 `npm test` 254/254 通過、型別 0 errors／0 warnings、publication-boundary 與 release 檢查通過；M03-02 雙語瀏覽器 2/2（7.2 秒）、M03-01 雙語 2/2（9.9 秒）；先前共用元件回歸為 M02-06 2/2（8.6 秒）、CEH M04-02 與退役路由 22/22（23.0 秒）。
- [PR #94](https://github.com/JasonLn0711/kairos-learning/pull/94) 已合併，正式內容 commit 為 `3e150cd1b918838c774b1434190152bbc45a1a35`。[PR 品質檢查](https://github.com/JasonLn0711/kairos-learning/actions/runs/42386996572)與[正式部署](https://github.com/JasonLn0711/kairos-learning/actions/runs/42387164471)均成功。部署在 2026-11-07 23:38（Asia/Taipei）完成；正式合併也保留當時遠端已完成的 CEH M04-10。
- `AASE_BASE_URL=https://learn.cs-kairos.com npx playwright test --config playwright.aase-m0302.config.ts`：正式站雙語 2/2 通過（18.8 秒）。版本 v1.1.0、逐段正文、全部小節／表格／code／選項與解析、四種寬度／兩字級、無 JS、鍵盤與六圖 bytes／文字邊界皆通過。人工再檢視正式站中文圖 2 手機與英文圖 3 桌面截圖。
- 2026-11-07 23:39 正式 HTTP 回讀：首頁、MATLAB 首頁、中英文課文均 200，不存在路徑 404；六個既有 MATLAB／reference ZIP 的 SHA-256 與原清單一致。Python urllib 首次讀首頁得到 403；後續 curl 與真實瀏覽器皆成功，此初次拒絕不計為通過證據，未變更站台存取設定。
- 正式圖檔為 `/images/aase/m03-02-{1,2,3}-{zh,en}.svg`。本機與正式站證據另保存在主工作目錄忽略路徑 `.local/aase/m0302-replacement-2026-11-07/`，包含截圖、JSON、HTTP 回讀及命令日誌；來源及公開紀錄均在本 repo。原工作目錄的無關修改保留，未 force-push。

正式課文：[繁體中文](https://learn.cs-kairos.com/courses/aase/v1/m03/concepts/m03-02/)／[English](https://learn.cs-kairos.com/en/courses/aase/v1/m03/concepts/m03-02/)。本回執為部署後文件更新，不改變教材版本。實體裝置、完整螢幕閱讀器及學員理解尚未評估。
