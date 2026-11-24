# 共用 Rust 工具連動

共用實作由私人 [kairos-rust-tools](https://github.com/JasonLn0711/kairos-rust-tools) 維護；[使用端總表](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/integrations.md)回連本庫。工具來源與完整 commit 記於 [kairos-tools-source.json](../kairos-tools-source.json)，本庫選用的規則記於 [workspace-verify.json](../workspace-verify.json)。

依共用庫的[跨電腦安裝文件](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/installation.md)取得固定版本後，在已有 `build/` 的本庫執行 `workspace-verify run workspace-verify.json`。不要求共用庫放在 sibling 位置；安裝後從 PATH 呼叫。只 pull 本庫不會自動安裝該工具。

本設定包含 package JSON 語法、site 到 build 的位元組保存（排除根 index.html）、公開產物衛生及 HTML 本機連結/錨點。它是完整發布檢查的共用子集；原有 `validate:content`、`validate:release`、TypeScript／單元測試、發布邊界、語言/CSP 及瀏覽器檢查持續由本庫負責，參見[發布與回復](publishing-security.md)。目前未修改正式站部署流程。

效能判斷依共用庫的[量測方法與結果](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/performance.md)，不能把 JSON 單項加速外推成完整網站發布加速。升級時同時審閱來源 SHA、設定範圍、正反例與本庫發布閘門，再回寫使用端總表。新增本機設定不代表該次變更已正式部署。

## 維護與回復連動

[README](../README.md) → 本文件 → [固定來源](../kairos-tools-source.json)＋[檢查設定](../workspace-verify.json) → [共用使用端契約](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/consumer-contract.md)。本機來源 checkout 可放任意位置，私人來源需要讀取權限。

要重現固定版本，將指定 SHA 安裝到獨立 prefix，直接呼叫其 bin/workspace-verify；全域命令可能來自另一個 revision，--version 也不能證明 commit 相同。保留工具 checkout 的 git rev-parse HEAD 與安裝紀錄。回復時一起選回相容的來源 SHA 與 profile，重新安裝並執行上述原有專案閘門；升級後同步更新本文件與共用庫總表。

## 2026-11-08：文章驗證的共用文字層

16 支文章驗證腳本原有完全相同的 HTMLParser 文字／details 擷取與正規化，已集中至
[scripts/validation_html.py](../scripts/validation_html.py)。另三支 M03-03／04／05
會排除 script/style 文字，保留各自的 parser，只共用相同的 `norm`。共用來源與測試
透過 [workspace-review-sources.json](../workspace-review-sources.json)明確納入盤點。

19 支完整驗證器對目前 build 的 stdout、stderr、退出碼均與抽取前相同且通過；四個
回歸測試涵蓋 entity、script 文字、details 順序／open、HTTPS label 與 Unicode 空白、
跨實例隔離。執行 `python3 -m unittest discover -s scripts -p test_validation_html.py`
可重驗共用契約。每篇的正文順序、答案 ID、圖檔、ZIP、搜尋與連結規則仍由原入口持有。

這次減少重複實作，未新增 Rust subprocess，也未修改文章或圖檔。Python HTMLParser
與 Rust HTML parser 的相容性須另有證據，不能用泛用 HTML 檢查直接取代本契約。未量得
整體效能、能源或 LLM token 節省，亦不將靜態檢查當成瀏覽器／正式站驗收。

共用層的四項 Python 回歸測試已接入品質與 Pages 發布 workflow，避免只在本機驗證。
Rust inventory 實測已發現 `validation_html.py` 與 `test_validation_html.py`，零 discovery error；
這只證明宣告的兩個來源已納入，不代表其他文章規則已全數審核。

## 2026-11-08：可見文字解析與剩餘抽取邊界

M03-03／04／05 的三份相同 parser 已集中成 `validation_html.VisibleText`。
它保留既有 script/style 隱藏狀態處理；原本包含 script 文字的 `Text` 行為不變。
6 項回歸測試涵蓋兩種政策、entity、details、空白、未閉合／自閉合標籤及跨實例隔離；
三支完整驗證器對現有 build 的 stdout、stderr、退出碼均與修改前一致且通過。
這只證明此解析器抽取的相容性，不新增文章、圖檔、瀏覽器或正式站驗收。

M02-01 至 M02-08、M03-01 至 M03-08、M09-04 至 M09-06 的 19 支入口，
以及 M01-07 來源驗證器，仍混合正文順序、答案 ID、導覽、搜尋標籤、SVG 內容、
位元組保存與 ZIP 成員比較。共用 Rust 的一般檔案／HTML 子集不足以代替這些完整
契約；後續抽取須保留 M02-03 的原始 ZIP 例外、M02-06 的雙 ZIP 與網路圖、
M03-01 的視覺文字選擇、M03-02 的新增圖例外及兩種 HTML 文字政策。
[工具庫責任紀錄](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/rule-ownership.md#learning-static-article-contracts--2026-11-08)
將其列為候選，不把局部重用記為全面 Rust 遷移。尚無此抽取的時間、能源或 Token 量測。

## SVG 瀏覽器幾何檢查共用化 — 2026-11-08

`check-cs-systems-svg.mjs` 與 `check-m05-04-svg.mjs` 共用
[`svg-layout-check.mjs`](../scripts/svg-layout-check.mjs)，各自保留目錄、選取
規則與輸出位置。字型載入後的實際文字邊界、重疊、截圖與退出碼由同一
實作負責；此能力需要瀏覽器，靜態 Rust XML 檢查不能取代。

16 張 CS Systems 與 10 張 M05-04 SVG 新舊完整 JSON 報告位元一致，均無
幾何 findings。合成越界／重疊 SVG 確認會產生兩種 finding 並退出 1。
測試只產生 `.local/` 截圖與回報，未修改 SVG 或教材，未部署。
未量測耗時、記憶體或 LLM Token 節省。完整頁面的四寬度、200% 字級、
下載、鍵盤與 no-JS 驗收仍由各自 browser script 承接，本輪僅讀碼。
責任判定連到[共用工具紀錄](https://github.com/JasonLn0711/kairos-rust-tools/blob/main/docs/rule-ownership.md)。

## M09 source-body 解析共用化 — 2026-11-08

M09-02 與 M09-03 共用 [`source_body_html.py`](../scripts/source_body_html.py)，
集中 div 範圍、文字、ID、圖片／連結與 details 深度的擷取。文章各自的
順序、答案、SVG、ZIP 與搜尋索引規則保留。兩支完整靜態 validator 新舊
JSON 輸出位元一致且退出 0；三項合成測試驗證範圍、實體解碼、巢狀
折疊深度、缺少 body 與跨頁狀態隔離。既有逐字稿來源比對器另有不同
略過／標記語意，本次不套用此 parser。沒有新增瀏覽器或正式部署驗收，
也沒有耗時或 Token 節省主張。

<a id="aase-catalog-performance-2026-11-22"></a>
## 2026-11-22｜AASE 頁面資料效能

Jason 的原始指示：

```text
$rust-anything:rust-anything  Please use this skill to optimize our repo.
```

Jason 指定用 rust-anything 找出可改善的路徑，Codex 執行剖析、修改和驗證。維護優先保住建置等待時間與雙語發布證據。Kairos Learning 管理程式、量測與發布檢查，[Planning 日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W47/days/2026-11-22.md#aase-catalog-performance-2026-11-22)保存狀態、容量與下一關。

**已驗證。** `rust-anything profile . --lang ts -- node node_modules/vite/bin/vite.js build` 在建置樣本中辨識出 `getPage` 反覆透過 `forLanguage` 生成 AASE 語系資料及搜尋文字。改用 [server catalog](../src/lib/server/catalog.ts) 的語系快照，讓路由、搜尋與頁面資料共用已通過發布條件的結果。沿用 TypeScript 及[既有發布閘門](platform-architecture.md#decisions)。

### 量測與輸出

- 本機 Linux aarch64、Node v24.22.0。比較基準 `2a1fda73` 與實作 `f946f764`。每個版本以同一份資料，在單一 Node 行程匯入 `getPage` 與 `routes`，先跑完 408 條路由暖身，再量七輪。每輪依原順序遍歷四次，合計呼叫 1,632 次。計時範圍是頁面資料組裝。
- 修改前七輪（ms）：1327.01、1302.04、1297.95、1296.18、1298.66、1304.76、1306.20。修改後：30.54、22.39、23.47、22.15、21.43、21.34、21.36。中位數由 **1302.04 ms** 降至 **22.15 ms**，約 **59 倍**。此比率適用於頁面資料組裝。
- 依序對 `routes`、`searchEntries`、全部路由的 `getPage(path)` 與 `getPage('/missing-page/')` 進行 JSON 序列化並累計 SHA-256。兩版皆為 `9df05c131f21956c94ac88791c4db69c3414e35a6295449846453487915b927a`。靜態 `build/search-index.json` 與 `build/sitemap.xml` 分別通過修改前後的 SHA-256 比對。
- `pnpm test` 428 項、`pnpm run check`、`pnpm run validate:content`、`node scripts/check-publication-boundary.mjs`、`pnpm run validate:release` 和 `git diff --check` 均通過。發布邊界包含雙語課程與文章的草稿、未來日期及乾淨重建。

提交 `2a38e1cd` 的 [Pages 工作](https://github.com/JasonLn0711/kairos-learning/actions/runs/45031723250)成功，正式站搜尋索引與 sitemap 經下載比對，與本機驗證版本位元組一致。日後若頁面組裝再度成為瓶頸，先在相同內容與 Node 版本重測，保留輸出比對。

<a id="route-payload-performance-2026-11-23"></a>
## 2026-11-23｜路由資料與發布驗證

這組量測取自本機分支，基準早於[搜尋與發布驗證整合](#search-and-release-performance-2026-11-22)。合併後沿用遠端的路徑快取與選用 Rust 解析器。[Planning 11/23 日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W48/days/2026-11-23.md#route-payload-performance-2026-11-23)

- **路由資料。** 重跑 Vite 建置剖析後，SvelteKit 資料序列化成為主要成本之一。CEH 總覽保留完整概念目錄，模組頁取得同模組項目，概念頁取得當前項目。其餘頁面省下未使用的目錄。408 份 `__data.json` 未壓縮總量由 27,236,537 降至 20,671,940 位元組，減少 24.1%。414 個 HTML 在排除 hydration 啟動程式與 CSP 雜湊後逐檔相同，搜尋索引與 sitemap 位元組一致。[路由資料](../src/lib/server/catalog.ts) · [回歸測試](../tests/learning.test.ts)
- **發布驗證。** 在固定建置產物上，Python 剖析指出大量連結重複執行同一路徑的檔案系統查詢。每次驗證共用路徑查詢結果，各來源頁仍各自檢查錨點並回報錯誤。修改前五輪（秒）為 2.05、2.04、2.89、2.11、2.04，修改後為 1.38、1.38、1.38、1.38、1.39。中位數由 2.05 秒降至 1.38 秒，縮短約 33%。兩版都通過 414 個 HTML、1,062 個靜態資產的檢查，合成缺檔及缺錨點案例的四筆錯誤與退出碼相同。[發布驗證器](../scripts/validate_release.py)

後續改動通過 429 項單元測試、型別檢查、正式建置、發布邊界、完整靜態發布檢查及 7 項課程側欄瀏覽器測試。AASE 雙語瀏覽器套件為 54 通過、9 失敗；將這 9 項以同一瀏覽器對修改前產物重跑，錯誤訊息全數相同，分別涉及既有排版與文字比對。
### 合併版部署與讀回

[Pages 45119833105](https://github.com/JasonLn0711/kairos-learning/actions/runs/45119833105) 首次執行成功，部署提交為 `42d2efd3`，部署 ID 為 `7991437227`。合併版通過 430 項 Node 測試、型別與內容檢查、發布閘門、414 頁及 1,062 項靜態資產驗證、8 項 Python 測試及 7 項課程側欄瀏覽器測試。重建的 408 份路由資料共 20,671,940 位元組，搜尋索引與 sitemap 和保留的基準位元組一致。

正式站首頁、雙語 CEH 總覽、模組及概念頁、雙語 AASE 工作坊均回傳 HTTPS 200 並載入對應的建置入口。雙語 CEH 六份路由資料、搜尋索引及 sitemap 與本機產物逐位元組相同。六份 MATLAB ZIP 及一份 AASE ZIP 的 SHA-256 均符合清單，瀏覽器請求缺頁回傳 404。Chromium 搜尋確認中文 3 筆、英文 6 筆，兩語也正確顯示零筆狀態。

<a id="search-and-release-performance-2026-11-22"></a>
## 2026-11-22｜瀏覽器搜尋與發布驗證效能

稀缺資源是使用者的搜尋等待時間、維護者的驗證時間與發布證據。Kairos Learning 保存實作、案例、量測和回歸檢查。Planning 保存狀態、容量與下一關。[11/22 日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W47/days/2026-11-22.md#search-and-release-performance-2026-11-22)

- [搜尋實作](../src/lib/model.ts)在索引載入後預先正規化文字。[回歸測試](../tests/search.test.ts)涵蓋全形字元、中英文詞組、語系篩選及結果順序。原開發環境以 240 筆索引測試 960 次查詢，從 4.24 秒降至 0.39 秒，另需約 9 毫秒準備索引。隔離建置以 Chromium 確認雙語搜尋可顯示結果與零筆狀態。
- [發布驗證](../scripts/validate_release.py)共用站內連結解析及檔案查找。[Rust 解析器](../rust/release-rs/README.md)提供 `shadow` 比對與 `rust` 選用模式，預設仍由 Python 執行。原隔離建置的三種模式均通過 402 頁與 695 項資產檢查，該次 Python 與 Rust 模式分別耗時 1.46 秒及 0.60 秒。原隔離建置曾在副本中補回 AASE M08-05 的雙語開場段落。
- `rust-anything gate` 在本次整合工作樹通過 52/52 個版本化案例。實作分為[搜尋提交](https://github.com/JasonLn0711/kairos-learning/commit/7dabde2c)與[發布驗證提交](https://github.com/JasonLn0711/kairos-learning/commit/52cd8ee0)。既有 [AASE 頁面資料效能](#aase-catalog-performance-2026-11-22)獨立保存建置端量測。

主線整合的 [Pages 工作](https://github.com/JasonLn0711/kairos-learning/actions/runs/45032690910)已成功。日後選用 Rust 時，先對該次產物以 shadow 檢查解析一致性。

### 遠端主線整合驗證

以遠端主線 `2a38e1cd` 為整合基線，保留 SvelteKit 3 的模組路徑。乾淨建置的索引包含 252 筆項目。重跑 960 次查詢，結果順序一致，計時由 7.707 秒降至 0.513 秒，另需 19 毫秒準備索引。這是一組本機配對量測。

發布驗證三種模式皆通過 414 頁、1,062 項資產，零錯誤。該次 Python、shadow、Rust 模式分別耗時 2.06、2.51、0.95 秒。429 項 Node 測試、型別檢查、內容驗證、發布邊界與完整發布驗證均通過。Rust 閘門通過 52/52 個案例，連結解析的兩項 Python 回歸測試也通過。

<a id="kairos-performance-production-2026-11-23"></a>
## 2026-11-23｜效能變更正式站回讀

[AASE 目錄共用的 Pages 工作](https://github.com/JasonLn0711/kairos-learning/actions/runs/45031723250)成功部署 `2a38e1cd`。[整合版 Pages 工作](https://github.com/JasonLn0711/kairos-learning/actions/runs/45032690910)成功部署 `c8a5ed14`，內容、型別、單元、發布邊界、靜態站驗證與下載校驗步驟皆成功。

11/23 以 Chrome 讀取正式站。兩語均成功載入 252 筆索引。[中文搜尋](https://learn.cs-kairos.com/search/)「資料洩漏」回傳 3 筆，[英文搜尋](https://learn.cs-kairos.com/en/search/)「data leakage」回傳 6 筆，兩語均顯示零筆結果狀態。正式站檢查涵蓋搜尋功能，本機配對量測提供效能數據。維護者日後選用 Rust 時，先對當次產物執行 shadow 比對。

[11/22 原始工作](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W47/days/2026-11-22.md#search-and-release-performance-2026-11-22) · [11/23 日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W48/days/2026-11-23.md#kairos-performance-production-2026-11-23) · [W48 容量](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W48/weekly-plan.md#kairos-performance-production-2026-11-23)

11/24 接續量測首次搜尋。`rust-anything` 剖析與建置檔配對量測支持依語系縮小下載。既有 JavaScript 搜尋函式承接查詢與排序。兩語索引的一致性、壓縮大小與等待狀態見[網頁設計優化](web-design-optimization.md)。
