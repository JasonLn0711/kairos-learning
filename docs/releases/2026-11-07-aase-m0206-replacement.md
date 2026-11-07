# AASE M02-06 供稿抽換與驗收

依使用者原稿與四張參考圖，完整抽換 Tool Calling、Authorization、Sandbox、Observability 與 Verification 教學；中英文同步 v1.1.0／revision 4。原發布日 2026-11-05 保留，版本修訂日 2026-11-07。

Canonical owner：`content/aase/lessons/aase-m02-c06.json`。原文、四張 PNG 與舊版留在 [來源封存](../sources/aase/m02-06/replacement-2026-11-07/README.md)；逐節／逐圖採用及技術修正見 [對照表](../sources/aase/m02-06/replacement-2026-11-07/source-map.md)。主要投入為完整雙語校對與圖解／操作驗收，本次範圍為 Kairos 本課；Planning 未增加詳細副本，沒有啟動真實 Agent 或沙箱實驗。

## 採用與界線

九節供稿進入正文，包含 MCP 小節、兩段原始簡化 JSON、兩筆原樣合成日誌、四關卡與三狀態表、M02 六課索引、部分成功紀錄及兩題理解檢核。保留舊版 MCP JSON-RPC 示例、六個舊錨點、紙上練習及發布閘門。

四圖以可搜尋、可選取 HTML 重排；八個雙語 SVG 使用相同正式資料，單檔 1422–3220 bytes。原 PNG 原樣保存。選擇題 Q04 的原 A–D 順序保留，答案 B；開放題 Q05 保留下一步驗收問題，附具體參考答案。沿原生答案展開，不新增無實際行為的評分按鈕。

編輯補明本課週末兩科是獨立合成需求、授權與觀測跨步驟生效、只讀與程式修改的權限分開、12 ms 非實測、逾時結果可能不明、請求 ID 需要服務端支援才能防重複。模型能力、操作成功、任務驗收、隔離測試與學員理解分別記錄。

## 驗證紀錄

環境：Linux、Node v22.23.4、Chromium Playwright；雲端工作流程使用 Node 24。本機證據將保存於 `.local/aase/m0206-local/`，正式站回讀於 `.local/aase/m0206/`。

| 規則／檢查 | 結果 |
| --- | --- |
| WRITE-01–10 | 九節、MCP 小節、兩表、JSON 與日誌、兩題逐項對照；中英文原理、例子、數字與邊界對應。原稿／四圖／前版六項 SHA-256 通過。 |
| 內容、單元、型別 | `validate:content` 通過；245/245 tests；Svelte 0 errors／0 warnings。 |
| HTML／FIG／A11Y | 瀏覽器、SVG 與目視驗收進行中，完成後補實測。 |
| 發布邊界與靜態 release | 執行中，完成後補實測。 |

## 發布閘門

修改前最新成功部署為 [Pages run 42337478396](https://github.com/JasonLn0711/kairos-learning/actions/runs/42337478396)，commit `fead837bc77a8b8080eb171fc2726a40595866d3`。完成必要驗證後，依 PR → 檢查 → main → Pages 流程發布，再回讀兩語正文、圖檔與既有網站路徑。

實體手機、完整螢幕閱讀器與學員理解尚未驗證；本次沒有真實工具安全性或寄信重試實驗。
