# AASE M02-05 Agent Harness 全文與四圖抽換

2026-11-07；正本 repo：kairos-learning。教材：[中文](https://learn.cs-kairos.com/courses/aase/v1/m02/concepts/m02-05/)／[英文](https://learn.cs-kairos.com/en/courses/aase/v1/m02/concepts/m02-05/)。本次狀態：本機驗證完成，正式發布回執待補。

## 來源與範圍

[原始供稿、四張 PNG、修改前教材及 SHA-256](../sources/aase/m02-05/replacement-2026-11-07/README.md)；[逐節對照](../sources/aase/m02-05/replacement-2026-11-07/source-map.md)。完整抽換為「週末三科、第三科被拒絕」情境，保留七節內容、兩張對照表、六角色完整詳解、三題開放式檢核。英文同步，原發布日保留 2026-11-05，更新 v1.1.0／revision 4／修訂 2026-11-07。

新增四張原生重排圖、八份 SVG；圖 1 六面向平行，圖 4 五步流程與全程權限／紀錄分開。新增固定版型驗證及全開放題支援，仍拒絕完全沒有題目、空答案、重複 ID 與不一致雙語。共用引言用「作答」涵蓋選擇與開放題。未修改實際 Q&A 或學員紀錄。

稀缺資源是編輯與逐頁驗證時間；教材、來源、實作與證據皆留在 kairos-learning。Planning 的角色是定位、摘要、發布證據與下一步，本次沒有新增跨 repo 工作或搬移正文。隔離工作樹由最新 origin/main `820ca10` 建立，其後整合遠端 `a9c7d1d` 的 M02-04 與 M02-03 回執，保留 M02-01～M02-04 已有成果及主工作目錄無關修改。

## 實測與規則

| 規則 | 結果與證據 |
| --- | --- |
| WRITE-01～05、08 | 通過：原稿逐節對照、中英數字與限制一致、公開標題保留 M02-05；MCP 及 Anthropic 原理來源於 2026-11-07 查核。六面向明示為本課框架。 |
| WRITE-06～07 | 通過：原發布日期保留；v1.1.0／2026-11-07 兩語一致；未新增公開協作署名。 |
| HTML-01、A11Y-03 | 通過：中英完整正文、圖內所有段落、表格、練習與三題答案 DOM 比對；320px 無 JavaScript 可讀、原生答案可展開。 |
| HTML-02～04 | 通過：320／390／768／1280px，各 100%／200% 根字級，中英頁無整頁水平溢出；正文至少 16px、行高至少 1.7，表格局部鍵盤捲動。初次測出 320px／200% 的 LLM 文字寬度不足，窄版改為直向後重測通過。 |
| FIG-01～06 | 通過：六面向桌面二欄、窄版單欄；五步箭頭與全程註記分開；共用資料產生 HTML／搜尋／SVG；八檔 2310～3793 bytes，下載與本機逐位元組一致，文字無 viewBox 越界或互相重疊，卡片文字在背景範圍內。圖樣與參考 PNG 的裝飾差異已記錄。 |
| A11Y-01～02 | 通過：語意標題、圖說、表格標頭；裝飾符號隱藏；Tab／Shift+Tab／Enter／Space、可見焦點、SVG 新分頁與答案展開。未宣稱全面無障礙認證。 |
| INT-01 | 不適用：本次沒有參數模擬器、評分或實際 Agent 執行。 |

自動檢查：`npm run validate:content`、整合後 244 項 `npm test`、`npm run check`（0 errors／0 warnings）、`node scripts/check-publication-boundary.mjs`、`npm run validate:release` 通過。發布邊界包含草稿、未來日期與英文課程閘門，結束後重建乾淨正式輸出。MATLAB 六個既有下載 checksum 全數通過。`npm audit --audit-level=high` 通過；既有 5 個 low 弱點保留，未引入依賴或執行破壞性升版。

瀏覽器：`playwright.aase-m0205.config.ts` 中英 2 測試，檢查全文、四圖、三題、四尺寸、200% 文字、鍵盤、無 JavaScript、搜尋與八個 SVG；另以 `playwright.aase-m0202.config.ts` 回歸混合題型及既有互動；整合 M02-04 後再跑 `playwright.aase-m0204.config.ts` 與本課測試。圖 1 桌面、圖 2 手機、圖 4 英文桌面截圖已目視核對分組與文字；其他圖有自動全文／尺寸／邊界檢查與截圖，未把自動檢查稱為逐裝置人工測試。

本機證據保存在隔離工作樹 `.local/aase/m0205-local/`，正式回讀使用 `.local/aase/m0205/`；測試不等同學習進度或正式實作驗收。未測實體手機、完整螢幕閱讀器、實際 Coding Agent／MCP 服務。

## 正式發布回執

待必要檢查通過後推送、合併及部署，接著回讀兩個正式頁面與八份 SVG；回執補上提交、CI、Pages run 及遠端歷史同步結果。
