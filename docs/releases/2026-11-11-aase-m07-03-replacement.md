# M07-03｜第一切片完整供稿抽換

本次 canonical owner 為 kairos-learning。修改限 AASE-M07-C03 教材、其三圖／範例、受限渲染分支、歷史測試與驗收紀錄；其他工作目錄的未提交教材保留。使用隔離工作樹 /tmp/kairos-m0703，從當前遠端 main 整合既有發布歷史。

來源：[原稿、三 PNG、前版及逐節對照](../sources/aase/m07-03/replacement-2026-11-11/source-map.md)。技術修正及三圖差異見[來源查核](../sources/aase/m07-03/replacement-2026-11-11/source-verification.md)。v1.1.0／revision 4，原發布日 2026-11-05，修訂日 2026-11-11。QA 維持空陣列，三道既有選擇題保留，原三個開放問題新增 Q04–Q06。

正文涵蓋導言與八節：垂直切片及餐廳比喻、五產業表、三欄示範與兩實驗、必填標籤與驗證、完整 Python／六術語、七項驗收與 Diff、四步課程擴充、退貨情境與三題解析。前版 slice／analogy／behavior／run／verify／misread 六個錨點保留。兩語全文與相同程式碼獨立可讀。

適用規則：WRITE-01–11、HTML-01–04、FIG-01–06、INT-01、A11Y-01–03。下列證據各自只證明檢查範圍；讀者理解、真實業務處理及真人裝置驗收不從測試推定。

## 實測與發布

狀態：source preserved → adopted decision → implementation → validated → published。下列證據分別記錄本課及共用回歸，未將廣域初次失敗當成全站完成。

### 已觀察結果

- 來源原文及三張 PNG 與附件逐位元組一致；前版及採用模型保留，SHA256SUMS 核對通過。
- `pnpm test`：初版 319 項、整合 M05-02／M06-02／M07-02／M06-04 既有發布後 330 項通過。`pnpm run check`：零錯誤、零警告。
- Python 3.11.15／Streamlit 1.51.0：本課獨立 app.py 與切片一合計 2 項通過；reference 23 項、切片二 24 項通過。AppTest 實際執行空白預覽及三欄逐一變更／提交／預覽失效／重新產生。
- 本課專用瀏覽器：中英 2 項通過，每語含八節全文、三表、完整程式碼、三題開放問題、四寬度及 200% 文字、鍵盤、無 JS、空白與文字跳脫、三欄過期預覽、搜尋、六 SVG 下載位元組／文字邊界／重疊。手機／桌面截圖已與供圖逐張核對；固定幾何圖與 HTML 重排差異列在來源查核。
- CEH 共用版型回歸：22 項通過。靜態 HTML 契約：6 項通過。`pnpm audit --audit-level=high`：4 low，無 high／critical；未改依賴。
- 全系列 AASE 初次廣域回歸：中文 54 通過／11 未通過、英文 54 通過／9 未通過。本課兩語均通過。其他課次包含既有 768px 圖文溢出、`###`／`>` Markdown 前綴與渲染文字比對、200% 圖標籤，以及整合期間來源／建置版本不同造成的結構比對差異；不將後一類當成該課產品缺陷。原始失敗摘要及執行範圍見 [checks.json](2026-11-11-aase-m07-03-checks.json)。本次不擴大修改其他課次。
- 預設全套測試埠已由其他工作占用，廣域中文回歸使用忽略目錄內的同測試副本，僅將 4215／8515–8517 換成本次 4415／8815–8817，未修改產品或正式測試設定。

來源提交 `0fcab0e`；教材實作 `e27798c`；[PR #108](https://github.com/JasonLn0711/kairos-learning/pull/108)。各次整合使用 merge 保留遠端與本次歷史；沒有覆蓋其他工作目錄。


### 正式部署與回讀

發布 source commit：`e8e6fe97ae6615102dc41aa124a61e6799e1430d`。main 以非破壞性 merge 保留來源及遠端更新；兩次非快轉拒絕後繼續整合，未 force-push。推送後 fetch 核對當時 divergence `0 0`。PR #108 已合併，GitHub 記錄的 PR mergeCommit 為 `f4e8d73`，其後的整合提交 e8e6fe9 承接完整本次內容及其他既有發布。

[Pages 工作 42991605640](https://github.com/JasonLn0711/kairos-learning/actions/runs/42991605640) 成功，GitHub 回報 completed／success（更新時間 2026-11-11 17:02:51，Asia/Taipei）。內容、單元、型別、靜態 HTML 契約、真正 draft／future 邊界建置、release、下載雜湊及 artifact 可見性檢查全部通過後，才由 Pages 部署。該來源提交於本機重驗 `pnpm test` 348 項通過、型別零錯誤／警告。

正式站以 `AASE_BASE_URL=https://learn.cs-kairos.com pnpm exec playwright test --config playwright.aase-m0703.config.ts` 回讀：2 passed，19.6 秒。兩語 v1.1.0、八節正文、三表、Python 程式碼、三個新開放問題、可操作三欄表單、空白預覽、三欄變更清除舊結果、文字跳脫、鍵盤／焦點、四尺寸／200%、無 JS 靜態例、前後篇／語言切換、搜尋及六 SVG 下載／標籤邊界／重疊均通過。SVG 回應與此版本六份圖檔逐位元組一致。

- [繁體中文正式頁](https://learn.cs-kairos.com/courses/aase/v1/m07/concepts/m07-03/)
- [English live page](https://learn.cs-kairos.com/en/courses/aase/v1/m07/concepts/m07-03/)
- 本次本機及正式截圖／結果保留在工作目錄忽略路徑 `.local/aase/m0703/`；正式結果為 results.json，本機結果另存 local-results.json。供稿、前版及逐節對照持續由來源目錄承接。

正式回讀後另核對當前遠端：本課 JSON、兩個專用元件及六 SVG 仍與已回讀版本相同；採用模型與正式 JSON 相等。主工作目錄僅同步本次專屬檔案及共用檔的本課分支，未搬入其他工作樹的未提交變更。

待驗範圍：真人裝置操作、獨立讀者理解與真實業務使用均未評估。廣域回歸初次其他課次的失敗與後續併行更新，不由本課的正式回讀推定為已解決；原工作坊 ZIP、後續驗證／匯出／授權能力亦不因本課表單示範而新增。
