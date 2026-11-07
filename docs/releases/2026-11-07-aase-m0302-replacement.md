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

正式發布結果待執行後補記。實體裝置、完整螢幕閱讀器及學員理解尚未評估。
