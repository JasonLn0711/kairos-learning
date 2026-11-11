# AASE M05-01｜Prompt 與 Spec 完整抽換

本次依使用者供稿與一張參考圖，將 M05-01 更新為 v1.1.0／revision 4，修訂日 2026-11-11，保留首次發布日 2026-11-05、網址、ID 與既有六個段落錨點。[原稿、附圖、前版與逐節對照](../sources/aase/m05-01/replacement-2026-11-11/source-map.md)由本倉庫保存，SHA-256 核對附件與前版位元組。九節全文已進入中英文正式內容模型；附件保存不代替正文。

## 採用與範圍

正文保留浴室比喻與換主任情境、五面向責任比較、三產業案例、物流問題的四個澄清問題、五要素表、完整 R-01～R-04／T-01～T-04、Agent 指令與術語、BDD 情境、三種錯誤、交接維護界線與三題理解檢核。英文具有相同結構與教學深度；spec.md 以相同來源程式碼搭配完整英文條款解讀。供稿兩題 A–C 與一題開放題在第九節；原生答案展開提供理由與合成參考範例，沒有提交、評分或學習完成紀錄。前版三題另保留為補充檢核。

一張 HTML 流程圖與兩份 SVG 同源：Problem → Spec → Prompt → Implementation → Verification，最後節點有獨立框線，末尾回修說明允許回到適當階段；箭頭為初學者閱讀順序，不是嚴格瀑布流程。保留參考圖淡底、直向分布與回修符號；增加圖說與下載連結。窄版文字自然換行，不縮小成文字圖片。SVG 為固定幾何下載版。中文 2636 bytes，英文 3101 bytes；節點置中以對應參考圖。使用既有受審核 exporter、文字跳脫與元素白名單，無新依賴或任意 markup 注入。

NASA Appendix C 與 Cucumber BDD 官方文件已查核；前者支持明確、可追溯與可驗證需求，後者支持跨角色具體情境與反覆協作。本課採用寫作與協作原則，未宣稱航太流程合規。原稿聊天介面、未附證據的網址修正敘述、favicon 與外部裝飾照片不進正文；來源照存。

本次由最新 origin/main 的隔離工作樹實作；原工作樹其他課次修改保留。稀缺資源為逐小節核對與正式站驗收時間，教材與詳細證據正本屬 kairos-learning；Planning 僅承接定位、狀態、驗證、發布證據與下一閘門。

## 本機實測

- WRITE-01～11：逐節對照原稿與雙語成稿；保留比喻、條件、例子、表格、程式碼、界線及來源；版號與日期分開。不是以節數或雜湊代替全文核對。
- HTML-01～04、FIG-01～06、A11Y-01～03：雙語瀏覽器檢查全部正文、表格、程式碼、流程節點與答案；320／390／768／1280 CSS px 及 200% 文字，頁面無水平溢出，正文與圖文至少 16 px、1.7 行高；文字與底色對比為 15.26:1、箭頭與底色為 5.77:1；表格及程式碼以具名局部容器鍵盤捲動。
- Enter／Space 展開收合參考答案、Tab／Shift+Tab 與可見焦點通過；鍵盤開啟 SVG、HTTP 200、下載 bytes 等於正式資產且小於 100000 bytes；SVG 文字無越界或彼此重疊。兩語圖解手機／桌面與 SVG 截圖已目視核對，保留節點順序、箭頭與 Verification 框。
- 無 JavaScript 仍可閱讀九節、圖解與原生答案；搜尋包含正文與五節點；前後篇指向 M04-06 與 M05-02。INT-01 不適用，這次沒有新增計算或模擬互動。
- `pnpm run validate:content`、合併最新基線後 313 項 `pnpm test`、`pnpm run check`（0 errors／0 warnings）、publication-boundary（隔離 fixture、草稿／未來、英文閘門與清潔重建）、`pnpm run validate:release` 通過。兩個 generator 的 `--check` 通過。雙語 Playwright 2 項通過。

本機結果與截圖在隔離工作樹 `.local/aase/m0501/local/`、`local-results.json`；初輪修正的是測試對 inline backtick 與清單 textContent 的假設，不把失敗當成產品驗收通過。表格另以本課範圍設定 1rem／1.8 行高。額外測試也確認本課拒絕四節點、錯誤圖種與未授權欄位，並維持草稿／未來內容的中英發布閘門。實機輔助科技、真人試讀與學員理解尚未評估。

## 發布閘門

已完成來源、教材與驗證分開提交：`3e201fc`、`67fd5af`、`0c7cce7`；保留遠端歷史的整合提交為 `ddf5a2c`、`e89ee8c`。[PR #104](https://github.com/JasonLn0711/kairos-learning/pull/104) 於 2026-11-11 08:34:23 UTC 合併；正式 main commit 為 `4c38e0de60e1e91325bf302279e530521cac6019`。整合時保留 M03-03、M05-04 等其他課次的既有改動，未帶入原工作樹無關修改。

[遠端品質檢查 42987825721](https://github.com/JasonLn0711/kairos-learning/actions/runs/42987825721) 成功；[Pages 部署 42988106392](https://github.com/JasonLn0711/kairos-learning/actions/runs/42988106392) 成功，部署來源 commit 與上述 main commit 相同。合併後 fetch 比較為 `0 0`，完整 Git 歷史保留。

正式頁：[中文 M05-01](https://learn.cs-kairos.com/courses/aase/v1/m05/concepts/m05-01/)／[English M05-01](https://learn.cs-kairos.com/en/courses/aase/v1/m05/concepts/m05-01/)。部署前實測為 v1.0.2／修訂 2026-11-05；部署後兩語皆 HTTP 200、v1.1.0／修訂 2026-11-11，原發布日仍為 2026-11-05。

正式站 Playwright 2 項通過（16.7s），逐節核對全部正式正文、表格、程式碼、五節點與參考答案；涵蓋四尺寸、200% 文字、無 JS、鍵盤、鄰頁、搜尋與兩份 SVG 實際下載 bytes／文字邊界。正式手機／桌面圖解截圖已目視核對。首頁 HTTP 200、測試不存在路徑 404、sitemap 包含雙語課次，六份既有 ZIP 的正式下載 SHA-256 全部一致。詳細數值見[機器可讀回執](2026-11-11-aase-m05-01-checks.json)。

本機與正式證據分開保存在 `.local/aase/m0501/local/`、`live/`、各自 results.json、`production-before.json` 與 `publication/`。本次只完成指定教材與呈現的工程驗收；真人試讀、實機輔助科技及學員理解仍未評估。此回執補存為文件提交，不變更已驗收的教材或部署資產。

合併前基線：Pages run 42986713205（5241d8091216ffbf62071f5a8791c5074d15f0a3）於檢查當時成功；後續仍有其他課次部署排隊，正式回讀須依本次部署 commit 確認。`pnpm audit --audit-level=high` 通過（4 low，無 high／critical）；既有六份 MATLAB／參考 ZIP SHA-256 全數通過。

驗證執行紀錄：合併後曾在 publication-boundary 的暫存英文閘門尚未移除時啟動額外測試；該次測試不作正式結果。待原程序結束並確認 fixture 全數清理後重跑，311 項通過。一次瀏覽器啟動遇到 4297 埠瞬間占用；確認該埠已無監聽後重跑，未修改應用程式來略過檢查。
