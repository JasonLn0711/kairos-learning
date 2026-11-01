# M01–M02 全篇閱讀優化、版本與發布驗收

日期：2026-11-01。範圍為當時已撰寫的 13 篇概念教材與 3 篇章節教材，共 32 個中英頁面。狀態：本機與正式站驗收完成，已依使用者授權分開提交、推送 main 並部署；正式回執見文末。M02-07 之後的待整理概念維持待整理。

## 設計與內容

從讀者需要完成的任務出發：先知道要學會什麼、用什麼例子開始、如何閱讀、最後留下什麼成果。[雙語導讀](../../content/reading-support/ceh-m01-m02.json)逐篇回答這四件事，採主動、白話及臺灣慣用語；每個練習成果均對應既有教材內容。AI 協作負責盤點、導讀編寫、元件與測試；本紀錄不代表已完成真人學習成效評估。

這次是全篇閱讀輔助與呈現改善，沒有逐句改寫原始正文。原稿、教材正文、參考答案、來源及原始 SVG 均保持完整；依使用者最新規則，閱讀改善納入 patch 版號與修訂日期。正文修訂仍須依[內容指南](../content-authoring.md)追蹤版本；新增導讀的維護契約也記錄於同一文件。

[ArticleReadingGuide](../../src/lib/components/ArticleReadingGuide.svelte)提供語意 HTML 導讀；[ReadableDiagramText](../../src/lib/components/ReadableDiagramText.svelte)補足 31 張圖的 62 組中英文字解說，對應 58 個原 SVG 路徑（M01-07 中英頁共用四張中文原圖）。M02 標籤由[產生器](../../scripts/build-readable-diagrams.py)保留原文與順序，僅將同一矩形中的相鄰文字歸組；M01-07 使用已有雙語圖解資料。清單不把平行分組誤標成流程；箭頭、分支與群組仍由原圖及其描述表達。既有 HTML 圖解沿用並改善字體與換行。

導讀與 M01-07 補充文字納入搜尋。程式碼區塊具名稱、焦點及鍵盤捲動；寬表格局部捲動；長英文標題在放大時可換行。正文與圖解直接可見，原生參考答案收合保留。

## 驗證結果

| 規則／範圍 | 結果及證據 |
| --- | --- |
| WRITE-01–03、WRITE-05 | 16 篇各有中英四欄導讀，逐篇核對其目標、條件與練習成果。原文並未整篇改寫。 |
| WRITE-04 | 原稿、教材正文、來源與原圖保留；教材 JSON 僅變更版本及修訂日期欄位；本輪未新增時效性技術事實，沿用已有來源與查核日期。 |
| HTML-01 | 32 頁無 JavaScript 可讀導讀及圖解文字，目錄錨點、原生答案展開與語言切換通過。 |
| HTML-02–04 | 32 頁 × 320／390／768／1280 CSS px = 128 組尺寸檢查通過；內文與圖解文字至少 16px、行高至少 1.7；32 頁於 390px 放大根文字至 200%，無整頁水平溢出。 |
| FIG-01–03 | 原 SVG 欄寬適配，62 組文字可換行；HTTP 圖檔下載逐位元組比對原始資產；新增文字匯出所對應原 SVG 最大 14381 bytes。原生 HTML、M01-07 與 M02-03 圖解截圖人工抽查。 |
| A11Y-01–03 | 語意導讀、清單及原有圖說。32 頁實際 Tab／Shift+Tab 順序、跳至正文、焦點樣式、Enter／Space 參考答案開關、方向鍵局部捲動通過。圖解不以收合隱藏。 |
| Safari 抽查 | CUA 開啟本機 M02-03 中文頁，確認導讀與圖解文字、目錄定位；參考解答點擊開啟、Space 收合、Enter 再展開。未將此抽查視為 Safari 全頁矩陣驗收。 |
| 既有功能 | 86 項單元測試通過；型別／Svelte 檢查 0 error、0 warning；內容驗證與靜態發布檢查通過，256 頁及 251 份靜態資產檢查通過。 |
| 發布邊界 | 草稿及未到期 fixture 未出現在 520 份部署文字產物；fixture 已移除且乾淨重建。原教材版本、圖檔、ZIP、答案與全文順序檢查通過。 |

[獨立 Playwright 測試](../../tests/browser/m01-m02.spec.ts)共 64 項通過，涵蓋 32 頁各兩項組合驗收。完整結果 `.local/m01-m02/results.json`、截圖 `screenshots/`、各項檢查 log 保留於 `.local/m01-m02/`；這些是本機證據，不納入公開 Git。手機版驗收使用桌面 Chrome 的指定 viewport，尚未做實體手機、螢幕閱讀器或完整 WCAG 認證。

第一輪發現九個頁面的長英文標題在 200% 文字放大時溢出，已以作用於本範圍的換行規則修正。發布邊界測試會重建 `build`；最終驗收在它完成後重新建置並完整重跑，避免 fixture 建置影響瀏覽器結果。下表為最終乾淨建置的結果。

## 逐頁結果

每列「通過」表示上述四種寬度、200% 根文字、鍵盤與無 JavaScript 測試通過。URL 為站內既有路徑，測試目標為本機建置。

| 文章 | 語言 | URL | 結果 |
| --- | --- | --- | --- |
| M01-01 | zh | `/courses/ceh/v13/m01/concepts/m01-01/` | 通過 |
| M01-01 | en | `/en/courses/ceh/v13/m01/concepts/m01-01/` | 通過 |
| M01-02 | zh | `/courses/ceh/v13/m01/concepts/m01-02/` | 通過 |
| M01-02 | en | `/en/courses/ceh/v13/m01/concepts/m01-02/` | 通過 |
| M01-03 | zh | `/courses/ceh/v13/m01/concepts/m01-03/` | 通過 |
| M01-03 | en | `/en/courses/ceh/v13/m01/concepts/m01-03/` | 通過 |
| M01-04 | zh | `/courses/ceh/v13/m01/concepts/m01-04/` | 通過 |
| M01-04 | en | `/en/courses/ceh/v13/m01/concepts/m01-04/` | 通過 |
| M01-05 | zh | `/courses/ceh/v13/m01/concepts/m01-05/` | 通過 |
| M01-05 | en | `/en/courses/ceh/v13/m01/concepts/m01-05/` | 通過 |
| M01-06 | zh | `/courses/ceh/v13/m01/concepts/m01-06/` | 通過 |
| M01-06 | en | `/en/courses/ceh/v13/m01/concepts/m01-06/` | 通過 |
| M01-07 | zh | `/courses/ceh/v13/m01/concepts/m01-07/` | 通過 |
| M01-07 | en | `/en/courses/ceh/v13/m01/concepts/m01-07/` | 通過 |
| M02-01 | zh | `/courses/ceh/v13/m02/concepts/m02-01/` | 通過 |
| M02-01 | en | `/en/courses/ceh/v13/m02/concepts/m02-01/` | 通過 |
| M02-02 | zh | `/courses/ceh/v13/m02/concepts/m02-02/` | 通過 |
| M02-02 | en | `/en/courses/ceh/v13/m02/concepts/m02-02/` | 通過 |
| M02-03 | zh | `/courses/ceh/v13/m02/concepts/m02-03/` | 通過 |
| M02-03 | en | `/en/courses/ceh/v13/m02/concepts/m02-03/` | 通過 |
| M02-04 | zh | `/courses/ceh/v13/m02/concepts/m02-04/` | 通過 |
| M02-04 | en | `/en/courses/ceh/v13/m02/concepts/m02-04/` | 通過 |
| M02-05 | zh | `/courses/ceh/v13/m02/concepts/m02-05/` | 通過 |
| M02-05 | en | `/en/courses/ceh/v13/m02/concepts/m02-05/` | 通過 |
| M02-06 | zh | `/courses/ceh/v13/m02/concepts/m02-06/` | 通過 |
| M02-06 | en | `/en/courses/ceh/v13/m02/concepts/m02-06/` | 通過 |
| ceh-m01-scope | zh | `/courses/ceh/v13/m01/authorization-and-scope/` | 通過 |
| ceh-m01-scope | en | `/en/courses/ceh/v13/m01/authorization-and-scope/` | 通過 |
| ceh-m01-cia | zh | `/courses/ceh/v13/m01/cia-and-security-controls/` | 通過 |
| ceh-m01-cia | en | `/en/courses/ceh/v13/m01/cia-and-security-controls/` | 通過 |
| ceh-m02-evidence | zh | `/courses/ceh/v13/m02/reconnaissance-and-evidence/` | 通過 |
| ceh-m02-evidence | en | `/en/courses/ceh/v13/m02/reconnaissance-and-evidence/` | 通過 |

## 重現與下一步

1. `python3 scripts/build-readable-diagrams.py --check`
2. `npm run check`、`npm test`、`npm run validate:content`
3. `node scripts/check-publication-boundary.mjs`（先完成此步，避免重建干擾瀏覽器）
4. `npm run test:browser:m01-m02`
5. `npm run validate:release`

[共同規範](../article-standards.md) → [內容契約](../content-authoring.md#m01m02-閱讀導引與可換行圖解) → [導讀資料](../../content/reading-support/ceh-m01-m02.json) → 元件與測試 → 本紀錄形成維護路徑。[全站盤點](../article-audit.md)只更新本次範圍，其他章節仍依原待驗事項追蹤。

發布授權：使用者已於本次明確要求分開提交並推送遠端 main，後續依現有流程驗證正式站。先前本機驗收階段尚未發布的紀錄保留其時間脈絡。

## 同日追加：日期與閱讀改善版本規則

依使用者最新確認，閱讀改善就是版本更新，文章不另顯示「閱讀更新」。[WRITE-06](../article-standards.md#原發布版本與修訂日期write-06)、[版本政策](../proposals/concept-content-versioning-2026-10-25.md)及共用 [ArticleMetadata](../../src/lib/components/ArticleMetadata.svelte)已統一：原發布日期保留，閱讀改善提升 patch，版本修訂日期為 2026-11-01。`revision` 遞增；原題目及其 revision 不變。三篇舊章節由歷史 v1 明確採用 1.0.0 作語意版本基準，本次為 1.0.1，並非宣稱歷史頁面曾顯示 v1.0.0。

| 文章 | 原版本 | 本次版本 | 內部 revision | 原發布 |
| --- | --- | --- | --- | --- |
| M01-01 | v1.1.0 | v1.1.1 | 3 | 2026-10-27 |
| M01-02 | v1.1.0 | v1.1.1 | 3 | 2026-10-27 |
| M01-03 | v1.1.0 | v1.1.1 | 3 | 2026-10-27 |
| M01-04 | v1.1.0 | v1.1.1 | 3 | 2026-10-27 |
| M01-05 | v1.1.0 | v1.1.1 | 3 | 2026-10-27 |
| M01-06 | v1.1.1 | v1.1.2 | 4 | 2026-10-28 |
| M01-07 | v1.0.1 | v1.0.2 | 3 | 2026-10-29 |
| M02-01 | v1.0.1 | v1.0.2 | 2 | 2026-10-30 |
| M02-02 | v1.0.1 | v1.0.2 | 2 | 2026-10-30 |
| M02-03 | v1.1.0 | v1.1.1 | 3 | 2026-10-31 |
| M02-04 | v1.1.0 | v1.1.1 | 3 | 2026-10-31 |
| M02-05 | v1.1.0 | v1.1.1 | 3 | 2026-10-31 |
| M02-06 | v1.0.0 | v1.0.1 | 2 | 2026-11-01 |
| ceh-m01-cia | v1 | v1.0.1 | 2 | 2026-10-23 |
| ceh-m01-scope | v1 | v1.0.1 | 2 | 2026-10-23 |
| ceh-m02-evidence | v1 | v1.0.1 | 2 | 2026-10-23 |

版本修訂日期與校對／觀察日期分開維護，舊章節沒有可信修訂紀錄時可省略；此次三篇章節已有明確修訂日期。重新建置或部署不自動改寫日期。原始教材文字、題目、原 SVG／ZIP 保留，產生器的版本資訊同步。

資訊列追加驗收先前覆蓋三種文章類型、6 個中英頁面與 24 組寬度；320px／200% 根文字下資訊列可換行。曾觀察到 NAS 英文頁既有長標題在 320px／200% 下溢出，保留為正文排版待改善，不將資訊列結果擴大為整頁驗收。此次移除閱讀更新並升版後，重跑完整 M01–M02 測試並逐頁核對版本與日期。


## FIRST PRINCIPLE 與跨 repo 關聯

讀者注意力、維護時間與版本可信度是本次設計的稀缺資源。網站正本集中保存內容、元件、規範與逐頁證據；Planning 保留狀態、容量及下一個驗證關卡。[11/01 日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W44/days/2026-11-01.md#kairos-m01-m02-2026-11-01) ↔ [週計畫](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W44/weekly-plan.md#kairos-m01-m02-2026-11-01) ↔ [網站專案](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#kairos-m01-m02-2026-11-01)連回此工程回執。網站維護不代替本人學習成效或新增交付計數。

Git 歷史以遠端 main 為基準核對，網站與 Planning 起始皆為 `0 0`；不重寫、刪除或強制推送既有提交。之前正式網站版本為 `17d7c15`，[Pages 41278871423](https://github.com/JasonLn0711/kairos-learning/actions/runs/41278871423) 已成功。此次分開提交閱讀功能、版本／日期規則及工程回執；正式推送與部署結果另記。


## 正式 Git 與部署回執

網站分開提交 `6159a00`（閱讀導引／圖解／鍵盤與測試）、`81e19e3`（閱讀改善升版、日期設計與規範）、`a23390c`（驗收與 Planning 關聯）。推送 `HEAD:main` 成功；[Pages 41282675594](https://github.com/JasonLn0711/kairos-learning/actions/runs/41282675594) 於 2026-11-01 成功部署 `a23390c816858d58f3dda6e7d36ee2404479ecba`。本回執與正式站測試入口另以驗證提交保存，不改網站內容。

最終本機結果為 87 項單元測試、Svelte 0 error／0 warning、64 項 M01–M02 瀏覽器測試、發布邊界及靜態檢查通過。依賴高風險閘門通過，既有 5 項 low 訊息保留，不做額外套件升級。

正式站完整重驗 **64/64 通過**：32 個中英頁面、128 組寬度、390px 的 200% 文字、Tab／Shift+Tab／Enter／Space、局部捲動、無 JavaScript、原 SVG 下載位元組比對。每頁實測新 patch 版號、原發布日、2026-11-01 修訂日，以及不顯示「閱讀更新」。範例：[M01-01](https://learn.cs-kairos.com/courses/ceh/v13/m01/concepts/m01-01/)、[M02-06](https://learn.cs-kairos.com/courses/ceh/v13/m02/concepts/m02-06/)、[CIA 章節](https://learn.cs-kairos.com/courses/ceh/v13/m01/cia-and-security-controls/)。

第一輪正式站為 63 通過／1 失敗，失敗項為 M02-05 英文頁初始 Tab 未落在跳至正文連結。測試改為等待頁面初始網路載入安定後操作，再完整重跑 64 項通過；此為穩定啟動後的操作驗收，不宣稱排除載入中的所有競態或完整無障礙認證。首輪證據在 `.local/m01-m02/live-first-pass/`，最終結果、trace 與截圖在 `.local/m01-m02/live/`。

Planning 以 `22e86e02`（所有權及相關專案連結）、`e4e8fc5d`（日誌與週容量）分開提交，已非強制推送 main；[CI 41282681125](https://github.com/JasonLn0711/planning-everything-track/actions/runs/41282681125) 成功。當日／週 Agenda 與 13 個新增本機連結／錨點檢查通過。後續回執另行提交，維持薄日誌與工程正本的分工。
