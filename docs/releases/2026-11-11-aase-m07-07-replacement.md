# AASE M07-07 完整抽換回執

本次 owner：kairos-learning；公開章節 [M07-07](https://learn.cs-kairos.com/courses/aase/v1/m07/concepts/m07-07/)，[English](https://learn.cs-kairos.com/en/courses/aase/v1/m07/concepts/m07-07/)。v1.1.0／revision 4，原發布日 2026-11-05 保留，修訂日 2026-11-11。來源、雙語逐節對照及編輯修正見[來源紀錄](../sources/aase/m07-07/replacement-2026-11-11/README.md)與[逐節對照](../sources/aase/m07-07/replacement-2026-11-11/source-map.md)。

## 範圍與規則

WRITE-01–11：完整十節雙語、汽車維修案例、三種錯誤、MRE 四列、完整 Python 快照、五產業、局部復原命令、四段 Agent 範本、受控故障驗收與三題三選項。舊錨點、公開路徑、原發布日與雙語閘門保留；新 Q04–Q06 的答案皆 B，舊題保存在 prior-lesson.json。沒有實際作答、讀者理解或真實銀行驗收主張。

FIG-01–06、INT-01、HTML-01–04、A11Y-01–03 適用規則：六階段 2×3→單欄；三欄表單與 Bug／Fixed 實際比較；Red→Green→Regression 轉直向保留箭頭端點；四段指令支援剪貼簿失敗回報與手動選取。主文字為語意 HTML、1rem／1.8 行高，table 為本課 1rem／1.7；八份受限 SVG 同源產生，公開頁不把長圖縮成唯一文字。圖與互動沒有任意 HTML／SVG 輸入，無 JS 停用操作並提供靜態說明。

## 證據狀態

- source preserved：原文字、四張 PNG、前版 JSON 六檔 SHA256SUMS 通過。
- Python 簡化範例：原測試及另外三項邊界斷言通過；只證明三字串簡化快照邏輯。
- 本課三項單元／模型測試通過；拒絕錯誤圖種／節點／任意欄位，draft／future／英文 draft 閘門正確。
- 全套 `pnpm test`：第一次合併後 334／334 通過；最後推送前 351／351 通過；`pnpm run check`：0 errors／0 warnings。
- `node scripts/check-publication-boundary.mjs`：second-concept／draft／future／英文 draft／英文 future 均通過，fixture 清除後重建正式輸出。
- `pnpm run validate:release`：靜態連結／雙語／資產／來源及教材包各項檢查通過。
- `pnpm exec playwright test --config playwright.aase-m0707.config.ts`：合併後 8／8 通過（2026-11-11 08:57 UTC 執行）；完整兩語正文、三表、全部命令、四尺寸、200% 文字、無 JS、鍵盤與實際互動、複製、合成下載位元組、八 SVG 下載位元組、字界／重疊全通過。
- 圖解目視：中英各四張 HTML 圖的 390／1280 截圖及八份 SVG 逐張讀取，六項順序、表單分組、三階段箭頭與四段範本保留，無裁切。截圖與原始 Playwright 結果位於忽略的 `.local/aase/m0707/`；結構化結果與大小見[checks JSON](2026-11-11-aase-m07-07-checks.json)。
- 全部八份 SVG 為 1702–2634 bytes；一般文字最小 CSS 色彩對比 6.824:1，輸入邊框 4.759:1，焦點色 4.711:1（依本課明列 CSS 色碼計算）。
- `git diff --check`、來源六檔 SHA256SUMS 與三份來源／回執文件的本機連結核對通過。
- 正式站兩語同一套瀏覽器驗收 8／8 通過；實體手機、完整螢幕閱讀器及獨立讀者理解未驗。

第一輪全套與發布邊界誤並行，邊界命令暫置 M04-98 fixture 造成六個讀取 catalog 的測試失敗；此輪不能作正式測試結論。另兩個歷史版測試原本對當前舊內容做固定快照，已依既有模式轉讀本次 prior-lesson.json；新稿由獨立本課測試覆蓋。後續全套在 fixture 清除後重跑，保留實際結果。

## 發布與下一關

此次從最新 origin/main 建立獨立工作樹 `/tmp/kairos-m0707`，保留原工作目錄其他章節未提交修改。已保留雙方歷史推送 main，由既有 Pages workflow 部署，兩語、八圖、互動與下載的正式回讀均通過。完整來源與工程證據留本 repo；本次沒有另外建立跨 repo 的詳細副本。

## 提交與整合

來源提交 `41e3d32`，正文／四圖／模型／測試提交 `b244bcb`，第一次歷史保留合併 `56ccf3f`。遠端持續有其他章節發布；本次接續保留雙方歷史，不將原工作目錄無關未提交修改帶入。正式部署與回讀結果如下。

## 正式發布與回讀（2026-11-11）

- 教材推送：`54fdc48f058b08a909efcb3ed95eb6b9fe94372e` → `origin HEAD:main`；首次推送後 fetch 的 divergence 為 `0 0`。期間 non-fast-forward 均以 merge 保留雙方歷史，沒有 force push。
- 本課啟用前可回復的成功站版：[`e8e6fe9`／run 42991605640](https://github.com/JasonLn0711/kairos-learning/actions/runs/42991605640)，此為回溯查得的成功部署紀錄；未實際執行 rollback。
- 本次 `54fdc48` 的排隊 run 42991671580 與後續 run 42991800872 均顯示 cancelled、jobs=[]。正式部署證據採用已包含本次提交的 [`8d198bbc53e287d8133e4fb900aabcd6f71c6376`／run 42991845369](https://github.com/JasonLn0711/kairos-learning/actions/runs/42991845369)：success。
- 已用 `git merge-base --is-ancestor` 確認發布提交是部署版本祖先；M07-07 JSON、互動元件、快照 helper 與八份 SVG 在兩版之間無差異。該 run 實際 CI 為 355 tests／355 pass／0 fail、型別零錯誤零警告，內容、audit、發布邊界、release、下載 checksum、artifact visibility 與 Pages 部署各步成功。
- 正式站同套 Playwright：2026-11-11 09:06:01 UTC 開始（臺灣 17:06:01），8／8 通過、0 skipped、0 flaky。兩語十節／子節／三表／程式與命令、四圖、320／390／768／1280、200% 文字、無 JS、Tab／Shift+Tab／Enter／方向鍵、局部捲動、Bug／Fixed 轉換、實際合成報告與剪貼簿、八份 SVG 位元組及文字邊界均通過。
- 額外正式回讀確認兩語 h1 顯示 M07-07，v1.1.0、原發布日 2026-11-05、修訂日 2026-11-11，前篇 M07-06／後篇 M08-01 皆正確。
- HTTPS root 與 MATLAB 課程入口 200、刻意不存在路徑 404，六份 MATLAB ZIP 及 AASE workshop ZIP 的正式下載 SHA-256 均與保存清單相符。這是本次發布 smoke 證據，未改動 MATLAB 教材。

[結構化回執](2026-11-11-aase-m07-07-checks.json)保留時間、正式 URL、實測結果、八 SVG bytes／SHA-256 與七 ZIP hash。原始結果、CI log、截圖及 smoke JSON 留在忽略的 `.local/aase/m0707/`，並將本次證據複製回原工作目錄同一路徑。

本次依 WRITE-01–11、FIG-01–06、INT-01、HTML-01–04、A11Y-01–03 完成本課適用項目；獨立讀者理解、實體手機與完整螢幕閱讀器仍為尚待人工檢查，不由本輪瀏覽器結果代填。本文只確認 M07-07 的抽換與發布。
