# AASE M03-05｜十節教材與六圖抽換

本次以完整新供稿抽換成功指標、假設與需求紀錄教材，保留跨產業案例、公式推導、表格、物流problem.md與五道理解問題。中英各十二section、六組圖與十二份SVG，新增四瑕疵／兩良品雙滑桿及全部阻擋示範。版本v1.2.0、revision 5、修訂日2026-11-11；原發布日2026-11-05與原有十一錨點保留。

正式路徑：[中文](https://learn.cs-kairos.com/courses/aase/v1/m03/concepts/m03-05/)、[英文](https://learn.cs-kairos.com/en/courses/aase/v1/m03/concepts/m03-05/)。本機實作與驗證已完成；Git與正式站結果於下方另記。

## 原始材料、內容與所有權

[來源與逐節對照](../sources/aase/m03-05/replacement-2026-11-11/source-map.md)保存完整原文、六原圖、前版、兩語成稿、同源圖解與八個原件雜湊。中文原文依明列格式／UI處理進入正文，所有十節、三個h3小節、六張原表與原始程式碼保留。最後一組原六列資料改由圖6的dl承接；圖4承接H-01四欄。五道原問題直接可讀，Q08–Q12參考解析原生收合，qa=[]。英文保留相同案例、公式、條件與限制，並說明保留的中文模板。

來源、詳細教材、圖解、測試與發布證據由kairos-learning維護。稀缺資源是逐節校閱與實際頁面／圖檔驗證時間；本輪範圍為M03-05及必要的共享渲染／模型分支、課名與下載課綱同步。其他課次正在編輯的內容未納入候選；課程排程、學習成效、真人試驗與官方就緒度不由本次發布代填。Planning僅需要locator、狀態、驗證證據與下一關，沒有複製原文或實作明細。

SuccessEvidenceDiagram僅處理本課固定六圖，模型限制節點數、種類、欄位與預設數值；Svelte跳脫文字，SVG只使用固定元素與產生器。兩個range固定0–4與0–2整數；15種組合全數單元檢查，非法／非整數／NaN／Infinity拒絕。全部阻擋顯示100%瑕疵阻擋、0%良品放行，沒有假提交、評分或完成標記。無JS停用控制並保留預設、公式與全部阻擋的靜態解釋。十二SVG保持預設，大小1311–3219 bytes。

## 本機驗證

適用規則：WRITE-01–11、HTML-01–04、FIG-01–06、INT-01、A11Y-01–03。規則對應的來源／正文／呈現與操作證據分開驗證。

最終隔離候選位於`/tmp/kairos-aase-m0305-20261111`，分支`codex/aase-m0305-20261111`，基於origin/main `b3b4abf`，依pnpm鎖檔獨立安裝依賴。

- `sha256sum -c SHA256SUMS.txt`：八個原件通過。
- `normalize-source.py --check`：完整中文與六處圖文替換通過。
- `aase_m0305_content.py --check`、`aase_m0305_svg.py --check`：雙語全文、圖解、正式JSON與十二SVG同步通過。
- `pnpm run validate:content`：通過。
- `pnpm test`：293項通過。
- `pnpm run check`：0錯誤、0警告。
- `python3 -m unittest discover -s scripts -p test_validation_html.py`：6項通過。
- `node scripts/check-publication-boundary.mjs`：通過，檢查草稿／未來日期、英文課程閘門、搜尋／路由／payload排除，移除fixture並重建正式輸出。
- `pnpm run validate:release`：通過。
- `pnpm exec playwright test --config playwright.aase-m0305.config.ts`：中英2項通過，16.4秒。包含逐段全文與順序、三個h3、六表、完整程式碼、五原問題及解析、六圖、同源搜尋；320／390／768／1280、100%／200%文字；無全頁水平溢出、文字大小／行高；Tab／Shift+Tab／Enter／Space、Home／End／ArrowRight、可見焦點、原生收合與局部捲動；兩滑桿與全部阻擋；無JS正文與停用控制；十二SVG字框／重疊與下載位元組相等。
- `pnpm audit --audit-level=high`：沒有high／critical，4項low。
- `python3 scripts/package-aase.py`：30份操作檔案重新封裝，課名同步課綱與ZIP／SHA256；沒有修訂操作教材。
- `git diff --check`：通過。

忽略目錄`.local/aase/m0305/`保存unit.log、check.log、boundary.log、release.log、browser-local.log、results.json、兩語六圖手機／桌面與十二SVG截圖。已目視中文六圖手機、英文三角色桌面、雙滑桿／H-01／六列整合案例手機，以及英文圖2／圖3與中文圖6下載圖；箭頭、平行關係、風險順序、數值與換行可讀。圖6下載以標籤／數值卡保留語意，網頁以六列資料呈現，差異在來源對照說明。

初輪原工作區全測試出現M03-04舊快照與其他課次進行中修改不一致；該失敗屬其他課次，不修改其測試來配合本次。隔離候選只含M03-05及最新遠端歷史，293項全過。初輪正規化腳本的標題數檢查修正為排除程式碼內標題，後續來源核對通過；不以失敗前結果支持本次完成主張。

## Git、部署與正式站

待補實際提交、推送、部署與正式站回讀結果；本機通過不代填正式發布。

## 待驗範圍

實體手機、完整螢幕閱讀器及獨立讀者接受度尚未驗收。所有醫院、銀行、律師、AI家教與工廠數據均為教學情境；沒有執行真人、臨床、效能或成本實驗。上述邊界不影響本次靜態教材發布，但不能延伸成學習成效或真實系統驗收主張。
