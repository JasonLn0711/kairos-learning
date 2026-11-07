# AASE M02-05 Agent Harness 全文與四圖抽換

2026-11-07；正本 repo：kairos-learning。教材：[中文](https://learn.cs-kairos.com/courses/aase/v1/m02/concepts/m02-05/)／[英文](https://learn.cs-kairos.com/en/courses/aase/v1/m02/concepts/m02-05/)。本次狀態：正式發布完成，中英文頁面與八份 SVG 回讀通過。

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

- 來源提交 `9e624fc`；教材／圖解／測試 `205dd76`；來源對照與本機紀錄 `1466dcc`；保留遠端 M02-04 的合併提交 `7f36594`。
- [PR #89](https://github.com/JasonLn0711/kairos-learning/pull/89) 已合併；正式內容提交 `86dd21d6247037b1297083381e4c6cffb8cd3c7d`。
- [Quality run 42337947871](https://github.com/JasonLn0711/kairos-learning/actions/runs/42337947871)：success；[Pages run 42338065065](https://github.com/JasonLn0711/kairos-learning/actions/runs/42338065065)：success。
- `AASE_BASE_URL=https://learn.cs-kairos.com npx playwright test --config playwright.aase-m0205.config.ts`：中英 2 tests passed，16.2s。逐段正文、三題答案、四尺寸與兩種字級、無 JS、鍵盤、搜尋及八份 SVG 位元組回讀通過。
- 本機整合後 M02-05 2 tests passed（8.9s）；M02-04 2 tests passed（8.8s）；M02-02 混合題型回歸 2 tests passed（7.9s）。
- 合併後已 fetch 並確認 `HEAD...origin/main` 為 `0 0`；本回執另作文件提交，不改正式內容。未 force-push，主工作目錄的無關修改保留。下一個驗收範圍是實體裝置與完整螢幕閱讀器，不阻擋已通過的靜態教材發布。

<a id="planning-closeout-2026-11-07"></a>
## FIRST PRINCIPLE Planning closeout — 2026-11-07

教材、原稿、四張 PNG、八份 SVG、測試與發布證據正本留在 Kairos Learning。稀缺資源是來源忠實度、備課注意力及驗證時間；Planning 保存定位、成果、容量與下一關。[11/7 日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W45/days/2026-11-07.md#aase-m0205-release-2026-11-07) ↔ [網站專案](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#aase-m0205-release-2026-11-07) ↔ [W45](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W45/weekly-plan.md#aase-m0205-release-2026-11-07) ↔ [整合路由](https://github.com/JasonLn0711/planning-everything-track/blob/main/docs/14-local-integrations.md#aase-m0205-release-2026-11-07)形成反向索引。

Jason 提供原稿、圖示與抽換要求；Agent 完成編輯、實作、測試及發布。這次僅補文件與連結，引用上述既有網站驗收，不重跑或改寫成新一次部署。容量仍 Unknown，未推定個人工時或本人學習完成。[簡報定位](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-11-kairos-presentations.md#aase-m0205-release-2026-11-07)與[工作坊定位](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-12-cib-ai-software-workshop.md#aase-m0205-release-2026-11-07)提供備課素材入口；後續由 Jason 在選定教學範圍或提出閱讀卡點時，回各 owner 記錄採用與驗收，不自動新增製作、交件或真人驗收承諾。
