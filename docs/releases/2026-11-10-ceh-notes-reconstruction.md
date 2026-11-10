# CEH 考古題筆記三份供稿重製

## 成果與來源

2026-11-10 日期頁重製為 v1.1.0／revision 2，保留原發布日及既有錨點。三份完整雙語正文共 28 節，承接 27 個題號參考、原有案例、表格、DH 計算、簽章推理與所有實際提供的練習。回憶卡共 17 張；選擇題保留各組原選項，開放題保留自我作答及可展開解析。

三份原文、11 張 PNG、前版 JSON、14 份附件雜湊、152 個標題到錨點對照及 1616 個來源單位採用紀錄見[來源對照](../sources/ceh-notes/2026-11-10/reconstruction/source-map.md)。技術版本與編輯修正見[查核紀錄](../sources/ceh-notes/2026-11-10/reconstruction/technical-review.md)。來源盤點另由全文、表格、公式、練習與逐圖檢查承接，不以單位數當成內容深度證據。

11 張原圖重繪為可重排原生 HTML；CIA 在兩部分重用，與回憶卡合計輸出 30 份雙語 SVG。保留原圖查看連結。桌面目視中文全部 11 圖、手機目視英文全部 11 圖；自動檢查另涵蓋兩語四尺寸與 200%。與原圖的視覺差異為網站字型與間距、簡化圖示、決策灰底卡片及 hash 桌面並排；流程、平行關係、ROE 欄位和 TLS 方向保持明確。TLS 手機用標示兩端與方向的訊息卡取代生命線，桌面保留對齊生命線。

## 規則與實測

適用 WRITE-01–11（完整採用、白話雙語、來源與主張界線）、HTML-01–04（原生響應式結構）、FIG-01–06（受限圖形、同源匯出、目視與尺寸）、INT-01（本頁互動）、A11Y-01–03（語意、鍵盤、無 JS）。

| 檢查 | 本機實測 |
| --- | --- |
| 內容／來源 | validate:content 通過；重建同步及採用稽核通過：14 附件雜湊、152 標題映射、1616 來源單位。 |
| 單元／型別 | 292 測試通過、0 失敗；Python HTML 6 測試通過；Svelte 0 錯誤、0 警告。 |
| 發布邊界 | 實際建置 808 文字產物的草稿／未來標記檢查通過，涵蓋整篇及各部分；fixture 已清理。 |
| 發布檢查 | validate:release 通過，含 30 SVG 位元組同步、正文重建及採用稽核；audit 無 high／critical（4 low）。 |
| 圖解 fixture | 16 個雙語／尺寸／縮放案例通過；22 份參考圖 SVG 無文字越界或重疊、下載一致且小於 100000 bytes。 |
| 完整日期頁 | 雙語全文、320／390／768／1280 px、200%、無 JS 答案、鍵盤、全部回憶卡／檢核、30 SVG 幾何與下載、搜尋通過。 |
| 建置／差異 | 獨立 production build 通過；git diff --check 通過。 |

本機使用既有 Homebrew Python 3.15.2，系統 Python 3.9 無法解析專案其他既有 PEP 701 程式；未升級依賴。曾觀察到 SSR fixture／SvelteKit sync 與建置重疊造成 HTML 和 client 的 SvelteKit 識別碼不一致，導致 hydration 失敗。停止相關程序並依序獨立建置後，識別碼一致，完整瀏覽器驗收通過；瀏覽器檢查已加入 bootstrap 一致性斷言。順序為單元／型別 → SSR 圖解 → 發布邊界與最終建置 → 靜態 release checks → 新 preview／瀏覽器，最終建置期間不並行執行 check、sync 或 SSR fixture。

## 證據界線與發布

第一份原稿宣稱十題新情境，附件實際只含第一題；頁面明列其餘九題未提供，沒有補造。供稿未包含所有原考題全文，題號及參考答案不等於已獨立核對官方題庫。答案補充有編輯標示；本機互動不外送、不儲存，沒有首次答對紀錄或學習完成宣稱。

本機與正式站完整驗收已完成，實際發布證據如下。完整標準 errata 審閱及真人學習理解驗收不在本輪已完成證據中。

### 正式發布證據

- 原稿保存提交 `278bbb3`，正文／圖解提交 `a2d04a6`；[PR #102](https://github.com/JasonLn0711/kairos-learning/pull/102) 經 [CI 42833539086](https://github.com/JasonLn0711/kairos-learning/actions/runs/42833539086) 通過，合併為 `08385677340f94c8be9821ec113ef2f99692435b`。
- [Pages 42833924032](https://github.com/JasonLn0711/kairos-learning/actions/runs/42833924032) 成功部署上述合併提交；正式站為[中文日期頁](https://learn.cs-kairos.com/ceh-notes/2026-11-10/)與[英文日期頁](https://learn.cs-kairos.com/en/ceh-notes/2026-11-10/)。
- 2026-11-10T14:30Z，`CEH_NOTES_BASE_URL=https://learn.cs-kairos.com node scripts/check-ceh-notes-browser.mjs` 完整通過：雙語每段正文、四尺寸及 200%、無 JS 答案、鍵盤、所有回憶卡與檢核、30 SVG 文字幾何／下載 bytes 與搜尋。另回看正式站中文手機第二部分、英文桌面第三部分截圖。切換期間曾讀到前版／未完整 bootstrap，未採為完成證據；部署完成後重跑通過。
- 11 個 GitHub 原 PNG 公開 URL 均 HTTP 200，下載 SHA-256 與 manifest 相符。本機忽略證據為 `.local/ceh-notes/reconstruction-production-browser.log`、`production-original-images.json` 及頁面／SVG 截圖；公開可重跑檢查腳本與同源資料保存在 repo。
- 本回執為發布後文件提交；`[skip ci]` 不另產生網站部署，網站對應的已驗版本為上述 `0838567`。本輪未完成項僅為原稿未附九題、未全面審閱標準 errata，以及未進行真人學習理解驗收，均未作完成宣稱。
