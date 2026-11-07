# AASE M02-01 供稿抽換與驗收

本次以使用者供稿與六張參考圖抽換 M02-01，保留全部八節、Q/K/V 與自回歸深入小節、四題原始三選項測驗；同步完整英文。版本為 v1.1.0／revision 4，原發布日 2026-11-05 保留，版本修訂日 2026-11-07。

正式內容 owner：`content/aase/lessons/aase-m02-c01.json`。來源、舊版及逐小節採用紀錄留在 [來源封存](../sources/aase/m02-01/replacement-2026-11-07/README.md) 與 [對照表](../sources/aase/m02-01/replacement-2026-11-07/source-map.md)。本次只更新 Kairos 本課與必要的渲染／驗證，不新增 Planning 副本。主要投入為逐小節雙語校對與圖解／操作驗收；此記錄不代表學員理解或模型實測。

## 採用與技術修正

- 六圖用可搜尋、可選取 HTML；12 個中英文 SVG 從相同正式資料產生。單檔 1113–2944 bytes。原 PNG 完整保存，圖示關係與差異見來源對照。
- Softmax 教具固定 Value 2／6，有限分數 −4 至 4、step 0.1；原圖未標上下界，這是明列的實作選擇。預設結果 3.0757656854799804，顯示 3.076。同分數結果 4。減最大值後再取指數，保留相對分數並避免無謂的大指數。
- 原稿的捨入公式採約等號，說明先以完整精度計算。假設切分、四維向量與教具不冒充真實模型結果。
- 保留原 Python 程式、練習、有效舊錨點；既有目錄短標題保留。測驗答案為 B／B／C／B，原生答案展開，不新增未連接評分服務的提交控制。
- 已重新讀取 [Transformer 原論文](https://arxiv.org/html/1706.03762v7) 與 [Hugging Face tokenizer 說明](https://huggingface.co/docs/transformers/tokenizer_summary)，核對分詞、向量、QKV、Softmax、多頭與位置機制。收件規則是合成教學案例，不是論文實驗。

## 本機驗收

2026-11-07，Linux／Node 與 Chromium Playwright；可重跑檔案為 `tests/aase-m0201-replacement.test.ts`、`tests/attention-demo.test.ts`、`tests/browser/aase-m0201.spec.ts`。本機截圖、日誌與 JSON 報告保留於忽略目錄 `.local/aase/m0201-local/`；正式站回讀證據位於 `.local/aase/m0201/`。

| 規則／檢查 | 實測結果 |
| --- | --- |
| WRITE-01–10 | 逐小節對照八節、兩個深入小節、兩個表格、四題測驗及其原選項；中英原理、數字、例子、條件與限制一致；原稿與舊版 SHA-256 八項全部相符。 |
| HTML-01–04、A11Y-01–03 | 中英 320／390／768／1280 CSS px，各 100%／200% 文字；無頁面水平溢出；可見正文段落／圖說／清單至少 16px、行高至少 1.7。表格、程式碼維持命名與鍵盤捲動。無 JS 全文及答案仍可閱讀。 |
| FIG-01–06 | 六圖的分組、箭頭、顏色及文字已目視桌面圖；窄版重排通過。12 SVG 可鍵盤開啟，無越界及文字重疊，小於 100000 bytes，下載 bytes 與來源檔相同。 |
| INT-01、A11Y-02 | 原生滑桿 ArrowRight／End、Tab／Shift+Tab、按鈕 Enter／Space；預設、同分、提高 B、上限停用與重設通過。無 JS 控制停用且顯示預設結果。 |
| 計算與內容測試 | `npm test` 230／230 通過；含有限域／無效值、平移不變、交換對稱、Python 兩組輸出及 SVG 同源核對。舊版遷移測試改驗封存的前一版，新版另有測試，歷史斷言保留。 |
| 內容／型別 | `npm run validate:content` 通過；`npm run check` 0 errors／0 warnings。 |
| 發布閘門與靜態輸出 | `node scripts/check-publication-boundary.mjs` 通過草稿、未來日期與英語閘門，最後清潔重建；`npm run validate:release` 通過。 |
| 相依套件／既有下載 | `npm audit --audit-level=high` 通過，5 個 low 留待既有相依套件維護；六個 MATLAB ZIP 雜湊全部相符。 |

未進行實體手機、完整螢幕閱讀器驗收或真實模型執行；本機瀏覽器驗收不等同這些層級。未新增相依套件、帳號資料或學習成績儲存。

## 發布狀態

[PR #85](https://github.com/JasonLn0711/kairos-learning/pull/85) 已合併，保留三筆分工提交：來源 `a2a5c90`、內容／互動／測試 `777f1b1`、採用與本機驗收 `ff5addd`。合併及正式部署提交為 `2e4a3fbd6d73e90e7bf22b89a82858a12c3db7d0`。

- [遠端品質檢查 42334707101](https://github.com/JasonLn0711/kairos-learning/actions/runs/42334707101)：success。
- [正式 Pages 42334885415](https://github.com/JasonLn0711/kairos-learning/actions/runs/42334885415)：success，head 為上述合併提交。
- 正式站 [中文版](https://learn.cs-kairos.com/courses/aase/v1/m02/concepts/m02-01/) 與 [英文版](https://learn.cs-kairos.com/en/courses/aase/v1/m02/concepts/m02-01/)：各自通過完整正文／四題選項與解析、v1.1.0、六圖、Softmax 操作、四種寬度／200% 文字、無 JS、鍵盤捲動與答案展開。兩項整合測試均通過，總計 25.7 秒。
- 正式站 12 個 SVG 均 HTTP 200、可鍵盤開啟、無文字越界／重疊，且與工作樹檔案逐位元組相同。下載圖與互動狀態的界線仍明示。
- 本次部署前已確認上一筆成功部署為 [42333648094](https://github.com/JasonLn0711/kairos-learning/actions/runs/42333648094)／`96b1b19`，其證據只用於前一版本定位。

合併後 fetch／ff-only 同步 `origin/main`，divergence 為 `0 0`。此份最後回執採文件提交，不改變已驗收的正式網站資產。主工作區既有未提交工作保持原狀；本次在獨立 worktree 完成。
