# M01-01｜完整白話教學與表單圖解替換 v1.1.0

[完整來源／逐節對照](../sources/aase/m01-01/replacement-2026-11-06/README.md) · [正式資料](../../content/aase/lessons/aase-m01-c01.json) · [維護契約](../content-authoring.md#aase-m0101-replacement-2026-11-06)

## 已採用範圍

依供稿抽換導言與七節，完整說明問題定義、兩種合成情境、四類工程作品、四層完成證據、人與 Agent 分工、七個後續領域及情境檢核。兩語各八個主 section、兩表、兩組圖解與一題四選項；AppTest 為可見 h3，答案為原生收合、正解 B。英文對應所有段落、表格條件、數字及判斷，沒有以摘要代替全文。

兩張附圖與供稿原件、修改前 v1.0.3 JSON 皆完整保存並附 SHA-256。圖解以原生 HTML／CSS 重新設計輸入框、雙欄、主要／次要操作、錯誤摘要與欄位提示，手機重排；未熱連結原圖或新增 SVG 注入能力。原圖的姓名、Email、居住地改成本課合成欄位；此差異及各節採用方式見來源紀錄。

第二節提供真實的缺漏／齊全切換與本機合成檔下載；檢核函式拒絕任一空白欄位，切回缺漏即移除下載。它只示範規格，沒有後端、正式申請、成績或進度紀錄，不能代替伺服器授權或使用者驗收。原發布日 2026-11-05 保留，修訂日 2026-11-06、revision 5、v1.1.0。其餘 48 篇正文保留。

## 規則與本機證據

- WRITE-01–08：完整來源／前版保存、逐節對照、技術界線與完整英譯核對；公開標題仍為 M01-01，課程導覽與原發布日保留。
- HTML-01–04、FIG-01／04–06：雙語 320／390／768／1280 CSS px、200% 文字與無 JavaScript 可讀；手機／桌面截圖檢查表單分組、錯誤摘要及長標籤。FIG-02 與 SVG 下載為不適用：本輪圖解為 HTML，原始 PNG 留作來源。
- INT-01、A11Y-01–03：缺漏／齊全、三欄空白邊界、Enter／Space、Tab／Shift+Tab、原生答案及實際 JSON 下載通過；無 JavaScript 控制停用並保留兩情境表。
- 205 項單元測試通過；Svelte／TypeScript 0 errors、0 warnings；專用雙語瀏覽器 2 項通過。來源段落與兩表、五種檔案、答案鍵及歷史保存均有對應檢查。

原 checkout 的忽略目錄 `.local/aase/m0101-replacement-2026-11-06/` 保存本輪日誌與手機／桌面截圖；發布 worktree 另有 `.local/aase/m0101/`。AI 協助編輯、英譯與工具驗證；讀者理解、實體手機與完整螢幕閱讀器待各自驗證。內容驗證、draft／future 發布邊界（756 份部署文字產物及英文課程閘門）、乾淨重建、release 與 30 檔工作坊封裝校驗通過；既有 AASE M01-01 英文閱讀回歸 1 項通過。

CEH C02 共用元件回歸執行 20 項，18 通過，2 項既有目錄預期失敗：`tests/browser/ceh26-m04-c02.spec.ts:24` 固定期待 5 篇，但目前 catalog 提供 6 篇，錯誤為 `Expected: 5 / Received: 6`。本輪未修改 CEH catalog、內容或該測試，保留這項 repo 條件；DNS 正文、兩語圖解、四尺寸、200% 文字、無 JavaScript、SVG 與原生答案相關檢查通過。未將 18／20 寫成全套通過。

## 發布與正式站

來源 `08bf9e3`、教材／互動 `b4dffcc`、維護／驗證 `ff38c61` 已分開提交並非強制推送 main，fetch 後 divergence `0 0`；原 checkout 與無關修改保留。

[Pages run 42199564980](https://github.com/JasonLn0711/kairos-learning/actions/runs/42199564980) 成功部署 `ff38c61`。部署後以 `AASE_BASE_URL=https://learn.cs-kairos.com npx playwright test --config playwright.aase-m0101.config.ts` 實測兩語 2 項通過：版本、全文段落、表單關係、四尺寸、200% 文字、鍵盤、無 JavaScript、缺漏阻擋、齊全時實際合成 JSON 下載及切回缺漏移除下載。這是正式站瀏覽器證據，沒有推論為讀者理解或後端安全驗收。

最後將舊遷移測試名稱明確標記為歷史保存，26 項相關測試再跑通過；新教材由獨立來源完整性與互動測試核對。最終文件提交只補證據與定位，不改已部署正文或程式。

## Planning 連結

[今日日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W45/days/2026-11-06.md#aase-m0101-replacement-2026-11-06)、[網站定位](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#aase-m0101-replacement-2026-11-06)及 [W45](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W45/weekly-plan.md#aase-m0101-replacement-2026-11-06)保存容量與下一關；詳細供稿、程式、測試及本回執留 Kairos。Planning `0046f8df`／`c8cb304e` 分別保存專案定位及日／週紀錄，非強制推送 main 後 divergence `0 0`；repository validator 保留 44 項既有警告、0 新增，日／週 agenda 通過。
