# AASE M02-04 供稿抽換與驗收

依使用者原稿與四張 PNG，完整抽換導言、八節及三題中英文教材。版本 v1.1.0、revision 4、修訂日 2026-11-07；原發布及英文發布日 2026-11-05 保留。正本為 content/aase/lessons/aase-m02-c04.json。

[來源封存](../sources/aase/m02-04/replacement-2026-11-07/README.md)保留原稿、四張 PNG、前版與 SHA-256；[逐小節對照](../sources/aase/m02-04/replacement-2026-11-07/source-map.md)逐項記錄案例、分支、表格、程式、題目與修正。範圍限本課、必要共用渲染／驗證及回歸測試，不改其他未提交工作。

## 採用

四圖分別呈現固定驗證雙分支、Agent 觀察迴圈、六欄任務控制卡及 Workflow／Agent／Workflow。HTML 可搜尋與重排，八個 SVG 由正式 JSON 產生，1858–3096 bytes。失敗箭頭改為明示回到觀察；窄版不將互斥結果或並列權限解讀為先後。固定範例修復原稿單行 Python，提供布林日期分類與非負整數的輸入假設、三個斷言與預期輸出，不實作正式儲存。

原稿三題問句與 A–C 選項逐字保留，編輯參考答案為 B、B、C。舊題封存，新 ID 為 Q04–Q06；沒有送交教師服務或作答保存，qa=[]。原始照片連結只存來源，四張檢附圖全部重製。未新增相依套件或模型呼叫。

## 本機驗證

證據在獨立工作樹 `.local/aase/m0204/`，測試入口為 `tests/aase-m0204-replacement.test.ts`、`tests/browser/aase-m0204.spec.ts`、`playwright.aase-m0204.config.ts`。

| 規則／檢查 | 實測結果 |
| --- | --- |
| WRITE-01–10 | 逐節讀取原文與成稿，對照餐廳三角色、讀書計畫三模式、四列決策表、開發與執行、四個授權問題、六欄控制卡、混合流程、三個判讀問題及三題選項；雙語意義與結構相符。六份來源 checksum 通過，前版錨點保留。 |
| HTML-01–04、A11Y-01–03 | Chromium 中英各 320／390／768／1280 × 100%／200% 文字，無頁面水平溢出；文字至少 16px、行高至少 1.7；程式與表格局部鍵盤捲動。無 JS 全文與參考答案可讀。 |
| FIG-01–06 | 四圖桌面／手機已目視檢查分組、方向與換行；八個 SVG 無文字越界或重疊，下載 bytes 等於生成檔；八檔均低於 100000 bytes。 |
| A11Y-02 | 參考答案 Enter／Space 開關、焦點可見；下載連結 Tab／Shift+Tab／Enter 可開啟。 |
| INT-01 | 本次沒有新增動態教具；Python 教學範例實際執行，週末 3／平日 3／週末 4 與額外邊界通過。 |
| 內容、型別、單元 | validate:content 通過；check 0 errors／0 warnings；整合遠端前 npm test 238／238 通過。 |
| 發布閘門與靜態輸出 | check-publication-boundary 草稿／未來日期／英文翻譯閘門及清潔重建通過；validate:release 通過。 |
| 相依套件與歷史下載 | npm audit --audit-level=high 通過，保留 5 項既有 low；六個 MATLAB ZIP checksum 相符。 |
| 瀏覽器 | M02-04 中英兩項整合測試通過，8.1 秒；共用元件 M02-02 回歸結果於整合後補列。 |

未做實體手機、完整螢幕閱讀器認證或真實 Agent 實驗；不推論學員理解或正式產品驗收。發布與正式站證據於完成後補列。

## 遠端整合後驗證

整合 `820ca10` 的 M02-03 修訂，保留雙方歷史及共用渲染分支。修正合併時題數斷言後，乾淨來源上的 `npm test` 為 241／241 通過；型別 0 errors／0 warnings，內容、發布閘門與靜態 release 均通過。一次單元檢查誤與會暫時改寫 fixture 的 publication-boundary 同時執行，產生 6 項 fixture 相關失敗；待閘門恢復正本後順序重跑已全數通過，未修改教材來迎合暫時 fixture。

整合後 M02-04 中英瀏覽器 2／2 通過（7.7 秒），共用元件 M02-03 回歸 2／2 通過（10.1 秒）。整合前 M02-02 回歸 2／2 通過（11.0 秒）。前一正式 Pages 成功版本 `820ca10`，工作流程 run `42337142675`，可作歷史回復定位。

## 正式發布與回讀

- [PR #88](https://github.com/JasonLn0711/kairos-learning/pull/88) 已合併，保留來源提交 `1cf3a51`、實作 `54f2c4d`、整合 `c9d0d73` 與驗收 `106cee6`。
- [遠端品質檢查](https://github.com/JasonLn0711/kairos-learning/actions/runs/42337340123) 成功。
- [Pages 部署](https://github.com/JasonLn0711/kairos-learning/actions/runs/42337478396) 成功，實際部署 commit `fead837bc77a8b8080eb171fc2726a40595866d3`。
- 2026-11-07 執行 `AASE_BASE_URL=https://learn.cs-kairos.com npx playwright test --config playwright.aase-m0204.config.ts`，正式站中英 2／2 通過（18.3 秒）。完整正文、表格、程式、三題問答、練習與搜尋均核對；四寬度／200% 文字／無 JS／鍵盤／八 SVG bytes 及邊界檢查全數通過。線上 JSON 回執留在 `.local/aase/m0204/live/results.json`，本機回執另存 `local/results.json`。
- [中文正式頁](https://learn.cs-kairos.com/courses/aase/v1/m02/concepts/m02-04/) 與 [英文正式頁](https://learn.cs-kairos.com/en/courses/aase/v1/m02/concepts/m02-04/) 顯示 v1.1.0，原發布日仍為 2026-11-05。
- 部署後 `git push origin HEAD:main` 回報已同步，再 fetch 比對為 `0 0`。本回執追加為文件提交，不改網站產物；原工作區及其未提交修改保留。

完成界線：本課雙語內容與圖示已發布且經正式回讀；實體手機、完整輔助科技認證、學員理解及真實 Agent 任務仍未評估。
