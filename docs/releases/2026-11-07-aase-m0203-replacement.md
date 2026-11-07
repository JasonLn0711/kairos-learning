# AASE M02-03 供稿抽換與驗收

依使用者原稿與六張參考圖，抽換 KV Cache、Compaction、RAG 與 Memory 課程正文。中英文同步至 v1.1.0／revision 4，版本修訂日 2026-11-07；原發布日 2026-11-05 與翻譯發布閘門保留。

Canonical owner：`content/aase/lessons/aase-m02-c03.json`。完整原文、六張 PNG 與舊版留在 [來源封存](../sources/aase/m02-03/replacement-2026-11-07/README.md)，逐小節、逐圖及編輯差異見 [採用對照](../sources/aase/m02-03/replacement-2026-11-07/source-map.md)。投入重點為雙語校對及圖解驗收；本次範圍為 Kairos 本課，未增加 Planning 詳細副本或啟動真實模型實驗。

## 採用內容

- 八節供稿完整進入正文：四種分工、逐 token 計算、上下文壓縮與遺漏例外、檢索／版本／權限、跨次記憶、六步合作、工程比較表及四題理解檢查。
- 六個原有章節錨點保留，原有練習沿用並改用供稿的讀書排程案例。四題使用 Q04–Q07，答案 B／A／C／D；原生展開提供每選項理由，不顯示無作用的評分按鈕。
- 六組語意 HTML 圖以原圖的角色、分組、詞塊、箭頭與日界線呈現；12 個雙語 SVG 由同一正式資料產生。單檔 1321–3062 bytes。
- 查核 Hugging Face、vLLM、Anthropic、RAG 原論文與 OWASP，補明因果自回歸前提、快取策略、跨請求重用與權限執行邊界。原始來源保持不變；所有需求 v3／測試／跨日流程都是教學情境。

## 驗證紀錄

環境：Linux、Node v22.23.4、Chromium Playwright。日誌與截圖位於工作樹忽略目錄 `.local/aase/m0203/`；雲端工作流程另以 Node 24 執行。

| 規則／檢查 | 結果 |
| --- | --- |
| WRITE-01–10 | 逐節核對八節供稿、四列比較表、六張原圖與四題；雙語段落／圖表同構，例子、數字、限制一致；原稿、原圖、舊版八個 SHA-256 相符。 |
| 內容與型別 | `npm run validate:content` 通過；`npm run check` 0 errors／0 warnings。 |
| 單元 | `npm test` 233/233 通過；含六圖結構拒絕測試、同資料 SVG bytes、日期與舊錨點、原選項及原始檔校驗。 |
| 發布邊界 | `node scripts/check-publication-boundary.mjs` 通過：draft／future 與英文 course gate；最後重建正式輸出。 |
| 靜態網站 | `npm run validate:release` 通過，含站內連結、資產與既有下載檔。 |
| 依賴 | `npm audit --audit-level=high` 通過；目前有 5 項 low，未新增依賴。 |
| HTML-01–04、A11Y-01–03 | 兩語 320／390／768／1280 CSS px，100%／200% 文字，無水平頁面溢出；正文、圖說與節點至少 16px／1.7。全文、表格、四題原選項及解析均回讀核對；無 JS 正文與原生答案仍可使用。Tab／Shift+Tab／Enter／Space、焦點與局部表格鍵盤捲動通過。 |
| FIG-01–06 | 兩語六圖桌面／手機重排及箭頭數通過；目視圖意、分組與日界線。十二 SVG 的 viewBox 邊界、文字互不重疊、檔案大小與 HTTP bytes 通過，並已目視下載圖。首次目視發現答案卡受到全域同名樣式影響，改成專用 class 後兩語重跑 2/2 通過。 |
| INT-01 | 沿用原生答案展開；無新增運算模擬器、評分服務或學習狀態。 |

測試第一次包含兩個需要更新的快照預期，已改為核對封存版與正確章節數。另一次測試與會切換 fixture 的 publication-boundary 同時執行，出現暫時的英文 gate 失敗；fixture 清理後串行重跑，233 項通過。這次驗證以最後串行結果為準。

## 發布閘門

修改前成功部署：Pages run `42334885415`，commit `2e4a3fbd6d73e90e7bf22b89a82858a12c3db7d0`。本次待完成瀏覽器與目視檢查後，依現有 PR → 檢查 → main → Pages 流程發布，再回讀兩語全文與圖檔。

實體手機、完整螢幕閱讀器與學員理解尚未驗證；不將 Chromium 模擬、測驗解說或部署成功視為上述驗收。
