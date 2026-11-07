# AASE M02-06 供稿抽換與驗收

依使用者原稿與四張參考圖，完整抽換 Tool Calling、Authorization、Sandbox、Observability 與 Verification 教學；中英文同步 v1.1.0／revision 4。原發布日 2026-11-05 保留，版本修訂日 2026-11-07。

Canonical owner：`content/aase/lessons/aase-m02-c06.json`。原文、四張 PNG 與舊版留在 [來源封存](../sources/aase/m02-06/replacement-2026-11-07/README.md)；逐節／逐圖採用及技術修正見 [對照表](../sources/aase/m02-06/replacement-2026-11-07/source-map.md)。主要投入為完整雙語校對與圖解／操作驗收，本次範圍為 Kairos 本課；Planning 未增加詳細副本，沒有啟動真實 Agent 或沙箱實驗。

## 採用與界線

九節供稿進入正文，包含 MCP 小節、兩段原始簡化 JSON、兩筆原樣合成日誌、四關卡與三狀態表、M02 六課索引、部分成功紀錄及兩題理解檢核。保留舊版 MCP JSON-RPC 示例、六個舊錨點、紙上練習及發布閘門。

四圖以可搜尋、可選取 HTML 重排；八個雙語 SVG 使用相同正式資料，單檔 1422–3096 bytes。原 PNG 原樣保存。選擇題 Q04 的原 A–D 順序保留，答案 B；開放題 Q05 保留下一步驗收問題，附具體參考答案。沿原生答案展開，不新增無實際行為的評分按鈕。

編輯補明本課週末兩科是獨立合成需求、授權與觀測跨步驟生效、只讀與程式修改的權限分開、12 ms 非實測、逾時結果可能不明、請求 ID 需要服務端支援才能防重複。模型能力、操作成功、任務驗收、隔離測試與學員理解分別記錄。

## 驗證紀錄

環境：Linux、Node v22.23.4、Chromium Playwright；雲端工作流程使用 Node 24。本機證據保存於 `.local/aase/m0206-local/`，正式站回讀於 `.local/aase/m0206/`。

| 規則／檢查 | 結果 |
| --- | --- |
| WRITE-01–08 | 九節、MCP 小節、兩表、JSON 與日誌、兩題逐項對照；中英文原理、例子、數字與邊界對應。原稿／四圖／前版六項 SHA-256 通過。 |
| 內容、單元、型別 | `validate:content` 通過；248/248 tests；Svelte 0 errors／0 warnings。 |
| HTML／FIG／A11Y | HTML-01–04、FIG-01–06、A11Y-01–03：雙語 Chromium 2/2 通過；320/390/768/1280 px、100%/200%、鍵盤與無 JS、完整正文與兩題答案、八圖精確下載／文字邊界檢查通過。桌面與手機圖解目視無裁切。 |
| 發布邊界與靜態 release | publication-boundary 與 validate:release 通過；npm audit 無 high/critical，保留既有 5 low，未做破壞性依賴升級。 |

整合 M02-05 後，248/248 單元測試、型別與發布邊界／release 均通過；M02-06 雙語 2/2（10.4s），M02-05 回歸 2/2（9.7s）。來源附件與封存逐位元組一致，紀錄相對連結檢查通過。

## 發布閘門

修改前最新成功部署為 [Pages run 42337478396](https://github.com/JasonLn0711/kairos-learning/actions/runs/42337478396)，commit `fead837bc77a8b8080eb171fc2726a40595866d3`。本次已完成 PR → 檢查 → main → Pages 流程及正式站回讀，證據如下。

實體手機、完整螢幕閱讀器與學員理解尚未驗證；本次沒有真實工具安全性或寄信重試實驗。


## 正式發布與回讀

- 來源封存 `b5ecca3`；正文／圖解／測試 `981eccd`；兩課整合 `bc7715f`；SVG 標點修正 `cc9e21c`；保留 M02-05 發布回執後的 PR head `050ddc4164fb224bdf7506ffa7d05253c7cde9ff`。
- [PR #90](https://github.com/JasonLn0711/kairos-learning/pull/90) 已合併；正式內容提交 `513cceae3cf3c90d932f74b05c978ce954e7d4f6`。
- [Quality run 42338357903](https://github.com/JasonLn0711/kairos-learning/actions/runs/42338357903)：success；[Pages run 42338489004](https://github.com/JasonLn0711/kairos-learning/actions/runs/42338489004)：success。
- `AASE_BASE_URL=https://learn.cs-kairos.com npx playwright test --config playwright.aase-m0206.config.ts`：雙語 2/2 通過（21.2s）。逐段正文、兩題答案、四種寬度與兩種字級、鍵盤、無 JS、搜尋與八份 SVG bytes／文字邊界全部通過。
- 正式站首頁、MATLAB 首頁與中英文課文 HTTP 200；不存在路徑 HTTP 404；六個既有 MATLAB ZIP 的 SHA-256 與清單一致。
- 最後 SVG 標點修正後，本機八圖生成一致性及雙語瀏覽器 2/2（10.6s）通過；雲端重新完成全套品質與部署檢查。暫態建置曾因圖檔在建置期間更新出現 bytes 差異，固定產物後重驗通過，沒有把該失敗結果計為驗收。
- 本機截圖／日誌位於 `.local/aase/m0206-local/`；正式站截圖、JSON 與回讀日誌位於 `.local/aase/m0206/`。合併後 fetch 核對 `HEAD...origin/main` 為 `0 0`；本回執另作文件提交，不改正式教材。未 force-push，原工作目錄的無關修改保留。

正式頁：[中文](https://learn.cs-kairos.com/courses/aase/v1/m02/concepts/m02-06/)／[English](https://learn.cs-kairos.com/en/courses/aase/v1/m02/concepts/m02-06/)。下一個驗收範圍為實體裝置、完整螢幕閱讀器與學員理解；安全與重試示例保持合成教材界線。
