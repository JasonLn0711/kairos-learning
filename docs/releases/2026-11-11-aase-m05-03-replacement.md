# AASE M05-03 完整供稿與三圖抽換

正本：[來源與逐節對照](../sources/aase/m05-03/replacement-2026-11-11/source-map.md)。原文、三PNG、前版與SHA256SUMS完整保存。八節雙語（導言＋七節）、一個原子節、三表、三圖、三段完整原碼與兩題供稿理解檢核進入正式JSON。舊七個章節錨點由section或step承接；舊Q01替換紀錄見來源對照。

原發布2026-11-05保留，v1.1.0／revision 6，版本修訂2026-11-11。源稿、編輯補充、執行證據與發布狀態分開。工作坊實作未改，沒有新增評分／提交功能。

## 規則與本機實測

| 規則 | 實測與結果 |
| --- | --- |
| WRITE-01–06、08–11 | 逐節讀原稿、中英成稿與JSON；完整內容及編輯差異見來源對照。原日期／閘門保留；三份原碼由單元測試比對。 |
| HTML-01–04、A11Y-01–03 | 中英全文順序、表格／程式碼、320／390／768／1280各100%與200%、無JS、Tab／Shift+Tab／Enter／Space、局部捲動通過。 |
| FIG-01、03–06 | 三圖節點3／4／5，flow／cards／flow；四情境無箭頭，其他2／4箭頭。HTML、搜尋與SVG同源；六SVG字框／重疊及鍵盤開啟與下載位元組通過。桌面手機截圖已人工比對關係。 |
| INT-01 | 不適用；本次三張靜態圖沒有模擬參數或提交。 |

- python3 scripts/aase_m0503_content.py --check：通過。
- python3 scripts/aase_m0503_svg.py --check：通過；六SVG依序zh 1551／2237／2018 bytes，en 1719／2423／2255 bytes，皆<100000。
- pnpm run validate:content：通過。
- pnpm run check：0 errors／0 warnings。
- pnpm test：整合前283／283通過，首次整合後311／311通過。
- node scripts/check-publication-boundary.mjs：實際草稿／未來日期／英文課程閘門建置通過，fixtures移除後乾淨重建。
- pnpm run validate:release：通過。
- pnpm exec playwright test --config playwright.aase-m0503.config.ts：2／2通過，包含完整雙語全文及六圖檢查。

本機證據位於隔離工作樹.local/aase/m0503/；日誌/tmp/m0503-*.log。測試曾與修改fixtures的boundary重疊，該次23項失敗作廢；待boundary完成並移除fixtures後重跑，283項全數通過。

## 發布

隔離工作樹分支codex/aase-m0503-20261111保留主工作目錄無關修改。來源提交273969b、實作a82be77，整合遠端主線77797d9保留雙方歷史。後續整合、正式部署及回讀待補。

## 待驗與界線

真人裝置與完整輔助科技驗收未執行。理解檢核未收到學習者答案；教材測試不證明銀行／醫院系統實作或學習者通過。Planning僅需持有定位與發布狀態，本次詳細來源與證據留在kairos-learning。

## 整合後補充驗證

- 型別檢查0 errors／0 warnings；實際發布閘門、release再次通過。
- 針對本課的雙語瀏覽器2／2再次通過（8.2s）；四尺寸各100%／200%、無JS、鍵盤、搜尋及六SVG均通過。
- pnpm audit --audit-level=high通過，現有4項low；六項static HTML unittest通過。
- AASE既有英文全套：57通過／6失敗；失敗課次M02-02、M02-03、M03-01、M03-04、M04-01、M04-03。前幾項是既有768px圖解可讀性斷言，部分為新版h3已渲染但舊測試仍尋找###原始標記。M05-03在此既有套件通過。另以尚未包含本次修改的正式站重跑M02-02與M03-04，重現相同兩項失敗，日誌/tmp/m0503-baseline-live-regression.log。本次未擴大修訂這些獨立章節。
- CEH M04共用版型回歸：22／22通過。AASE工作坊Python環境本次未啟動，靜態頁與下載檢查另列，不能將其視為後端驗收。
