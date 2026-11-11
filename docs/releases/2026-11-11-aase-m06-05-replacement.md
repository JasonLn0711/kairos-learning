# M06-05 Authentication、Authorization 與 Session 完整供稿抽換

本次將使用者八節完整供稿採用為 AASE-M06-C05 v1.1.0／revision 4。原發布日保留 2026-11-05；本版修訂日為 2026-11-11。本文與雙語翻譯、三張響應式圖解、六份 SVG 由 kairos-learning 維護。原工作樹有其他章節的同步修改，採 `/tmp/kairos-aase-m0605-20261111` 隔離工作樹承接遠端 main，不改寫既有歷史。

## 來源與採用

[逐節對照](../sources/aase/m06-05/replacement-2026-11-11/source-map.md) 保存原稿、三 PNG、前版與 SHA-256；雙語各含導言及八節、五個深層小節、六張完整表格、兩個 API 與完整 architecture.md 候選模板。六個舊錨點 保留為 three／analogy／controls／session／negative／record。三道新檢核使用 Q04–Q06、答案 B／B／C；舊題保存在前版。qa=[]，沒有把編輯題當成收到的學員問答。

圖1以四列呈現授權共同因素；圖2呈現 Session 失效與權限拒絕的終止路徑；圖3呈現兩角色、Cookie 請求與伺服器五欄紀錄。手機按相同閱讀順序重排，圖說明示條件。頁面文字可選取搜尋，下載由相同資料產生，既有受審核 SVG 邊界與 draft／future／English 閘門保持。

## 驗收紀錄

| 規則 | 證據／狀態 |
| --- | --- |
| WRITE-01–05、09–11 | 逐節來源對照與雙語全文，去除聊天來源卡／定位說明；OWASP 兩指南及 Streamlit OIDC 官方文件已查閱。未將範例規格寫成已實作能力。 |
| WRITE-06、08 | 原日期、stable ID、公開課次及 URL 保留；版本與修訂日更新。 |
| FIG-01–06 | 三張同源 HTML 圖、六份 SVG；資料驗證拒絕額外節點、flow 誤用與 markup 欄位。六個 SVG 字框／重疊檢查通過；每檔 1634–3366 bytes；已人工閱讀手機／桌面截圖，手機兩組分支明示擇一結果。 |
| HTML-01–04、A11Y-01–03 | 雙語逐段全文、表格、程式碼及三題四選項／解析均已回讀；320／390／768／1280、200%、無 JS、鍵盤、局部捲動與六下載逐位元組比對通過。 |
| INT-01 | 本次沿用靜態四選項與原生參考答案；無新增計算器或提交服務。 |

- `pnpm run validate:content`：通過。
- `pnpm test`：319／319 通過，含兩項本課資料與發布閘門測試。
- `pnpm run check`：0 errors／0 warnings。
- `node scripts/check-publication-boundary.mjs`：隔離第二概念、draft／future、英文 draft／future 均通過，回復乾淨正式建置。
- `pnpm run validate:release`：通過。
- 生成器 `--check` 與來源 SHA256SUMS：通過。

## 發布

正式頁：[繁中](https://learn.cs-kairos.com/courses/aase/v1/m06/concepts/m06-05/)／[English](https://learn.cs-kairos.com/en/courses/aase/v1/m06/concepts/m06-05/)。已正式上線。內容發布 commit 為 `8d5e5f5370ec51eb4d5f9c167aa3ce934681e542`（PR #106 已合併）。原 Pages 排程 42990940037 被後續版本取代；實際成功部署的是包含本次提交的 `65b9ada5766835479c1f596fab2993f13068704b`，見 [Pages run 42991019517](https://github.com/JasonLn0711/kairos-learning/actions/runs/42991019517)。已核對後續版本的本課正文、渲染器及六圖與本次位元組一致，並以正式網址實測通過。

## 範圍與下一層證據

稀缺資源是編輯與呈現驗收時間；教材、來源與執行證據正本留本 repo。Planning 若需承接，只記 locator、狀態、驗證、發布與下一關。本次範圍為 M06-05，不更動其他章節與學員紀錄。真人／輔助科技完整驗收、學員理解及候選安全控制實作仍未評估。

本機瀏覽器最後驗收：`pnpm exec playwright test --config playwright.aase-m0605.config.ts` 兩語 2／2 通過。逐段比對涵蓋所有 paragraphs／prose／step／table／cards、三題全部選項與解析；寬度與字級檢查為每語八組（四寬度 × 100%／200%），另有無 JS 320px。圖檔均回讀原始 bytes 並檢查字框／文字重疊。證據保存在隔離工作樹 `.local/aase/m0605/`；來源 commit 為 `4d5902f`。Python static HTML contract 6／6 通過。


## 正式回讀與完成稽核

2026-11-11 16:59–17:00（Asia/Taipei）執行正式站 Playwright：兩語 2／2 通過，22.1 秒，無跳過／非預期／不穩定案例。直接回讀 v1.1.0、九個 section（導言與八節）、五個深層小節、六表、完整程式區塊、三題四選項與每選項解析、三圖及搜尋。四尺寸 × 100%／200%、無 JS 320px、可見焦點、Tab／Shift+Tab、Enter／Space、局部捲動與六個 SVG 原始位元組／字框／重疊均通過。原始規格與負向案例保持未實作／未驗證，沒有產生學員作答或多人安全能力主張。

[PR #106](https://github.com/JasonLn0711/kairos-learning/pull/106) 的預覽 [run 42990826283](https://github.com/JasonLn0711/kairos-learning/actions/runs/42990826283) 通過。合併同期變更後完整單元測試為 333／333、型別 0 errors／0 warnings；最後一次保留遠端歷史的合併另重跑 19 個受影響測試及 Svelte 語法檢查，均通過。正式 Pages 又完整執行內容、單元、型別、發布邊界及 release 閘門後才部署。本機完整整合版的發布閘門、release 及雙語瀏覽器重跑亦通過。

來源至正文依逐節對照驗收；正文至正式頁依所有 paragraphs／prose／step／table／cards 與檢核全文驗收。原稿、三 PNG 與前版雜湊通過。六個 SVG 為 1634／1715／3008／3366／2085／2066 bytes（按圖1中英、圖2中英、圖3中英）。[機器可讀回執](2026-11-11-aase-m06-05-checks.json) 保存正式 run、來源與圖檔 SHA-256、實測範圍及未評估界線；瀏覽器 JSON／截圖與完整命令輸出保存在正本工作目錄 `.local/aase/m0605/`（Git 忽略）。同期無關修改保留，未宣稱全站人工驗收、真實裝置／輔助科技完整驗收或學員理解完成。
