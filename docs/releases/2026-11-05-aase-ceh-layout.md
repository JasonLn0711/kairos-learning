# AASE 教材頁與 CEH 格式、欄位一致化

使用者要求網頁格式、設計與欄位和 CEH 教學頁相同。本次改動系列／模組側欄及四篇 AASE 教材；保留獨立課程 ID、網址、發布閘門與繁中先行範圍。四篇從 v1.0.0 升為 v1.0.1、revision 2，原發布日 2026-11-05 不變。

## 對齊結果

| 欄位／版面 | 實作與界線 |
| --- | --- |
| 課程章節 | 與 CEH 共用 CourseRail；AASE 顯示自己的九模組、目前章節、課程總覽。手機沿既有捲動側欄。 |
| 標題與摘要 | 相同的 H1、lead、麵包屑，顯示 AASE Mxx-yy；stable ID 保持 AASE-Mxx-Cyy。 |
| 發布資訊 | 共用 ArticleMetadata；identifier、原發布、v1.0.1、版本修訂；使用 CEH 的 date 欄位。 |
| 閱讀導引 | 共用 ArticleReadingGuide：這篇要學會什麼、從這裡開始、閱讀順序、讀完留下的成果。 |
| 目錄與正文 | 共用 TeachingArticle 的 toc、article.prose、章節與留白；圖解、範例與表格沿 ConceptBlocks 的受限結構。 |
| 理解檢核 | checks 具有 id、answer、text.zh.prompt／options／rationales；仍為自我檢核，不虛構作答紀錄。 |
| Q&A | qa 具有與 CEH 相同的本地化問題及答案欄位，使用 ConceptQA；目前沒有實際學員問題，保留空陣列與待補訊息。 |
| 前後導覽 | 共用 next-links；有前後篇、課程目錄 fallback，準備中仍只連模組錨點。 |
| 語言與來源 | 繁中正文放 text.zh，不生成假英文；sourceIds 與原來源連結保留。 |

舊四篇 JSON 原封保存於 [來源紀錄](../sources/aase/layout-2026-11-05/README.md)。單元測試核對段落數、逐段文字、程式碼、圖解節點、實作步驟、題目數與答案鍵；遷移沒有縮寫原教材。原 V0.3／分享附件的對照仍待原檔，與本次版型修改分開。

## 驗證

- WRITE-01–07：保留原意與來源，日期及版本更新一致；沒有新增假 Q&A、英文或學員成績。
- HTML-01–04、A11Y-01–03：15 頁 AASE 的 320／390／768／1280 px、200% 文字、鍵盤、無 JavaScript、原生答案與 Q&A 區；18 項本機瀏覽器測試通過。
- FIG-01、FIG-05–06：沿 CEH 的 flow／cards 元件及文字資料，手機重排。FIG-02–04 不新增 SVG，既有下載 ZIP 位元組保持不變。
- 計算樣式比對：AASE 與 CEH 的 page-shell、module-rail、main、toc、article-metadata、next-links 寬度／字級／行高／display 相同。另抽看 M04-05 390／1280 截圖；這不是完整無障礙認證。
- `npm run validate:content`、`npm run check`（0 errors、0 warnings）、`npm test`（159 項）通過。
- `node scripts/check-publication-boundary.mjs`、`npm run validate:release` 通過；草稿／未來日期的 AASE 正文標記不進建置輸出，英文與準備中路由維持關閉。
- CEH 回歸：`npx playwright test --config playwright.ceh26-m04-c02.config.ts` 22 項通過，雙語、章節、短網址、原生問答、圖檔及下載保留。
- 工作坊 Python 未修改；下載檔以既有 package --check 及瀏覽器位元組比對確認，不把重用先前實作測試說成本次重新執行。

本機證據：`.local/aase/`、`.local/ceh26-m04-c02/local/`；格式對照及原稿保存測試寫入 repo，可重跑。本次頁面不包含任意 HTML／SVG 注入，也未放寬 CEH 的雙語或發布驗證。

## 發布

前一部署基線為 `e9e8ce84dd907cb82a520bd6fc353e4e56c629f1`、Pages run 41962035833。本次程式部署提交為 `8e76353a35759c7d25fcfabd4b23622d232e8271`，[Pages run 41963265857](https://github.com/JasonLn0711/kairos-learning/actions/runs/41963265857) 成功。正式 HTTPS 站 AASE 17 項網站檢查通過，本機 Streamlit 一項依遠端模式跳過；CEH 22 項正式站回歸通過。AASE／CEH 計算樣式比對也在正式站通過。

課程欄位與原稿提交 `400f292`，共用版型與測試提交 `8e76353`，推送 `origin main`。正式站回讀證據另存 `.local/aase/parity/live/`，本機 18 項結果留在 `.local/aase/parity/local/`；CEH 正式站的原始結果為 `.local/ceh26-m04-c02/live/results.json`。程式發布後分歧為 `0 0`；既有未追蹤 Python 快取未提交。
