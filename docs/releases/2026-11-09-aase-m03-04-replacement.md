# AASE M03-04 完整抽換與 SVG 回執

2026-11-09；AASE-M03-C04，v1.0.2 → v1.1.0，revision 3 → 4。原發布日2026-11-05與雙語閘門保留。目標網址：[中文](https://learn.cs-kairos.com/courses/aase/v1/m03/concepts/m03-04/)／[英文](https://learn.cs-kairos.com/en/courses/aase/v1/m03/concepts/m03-04/)。

[完整來源與逐節對照](../sources/aase/m03-04/replacement-2026-11-09/source-map.md)保存原始供稿、兩張參考PNG與舊版。十節及導言形成11個正文section，四表、完整problem.md、兩圖與四選項提問完整採用。頁面新增參考解析不建立學習完成狀態。六個舊錨點保留。Q01–Q03在前版保存，新題Q04答案B。

## 規則與內容核對

- WRITE-01–04、09–11：逐節閱讀來源及成稿，保留100道菜／半年、三個假設欄位、批次100份／第37份、兩類驗收證據、六階段決策與完整比較。移除來源卡雜訊及追蹤參數，按source-map記錄。
- WRITE-05–08：雙語11節及各段／區塊形狀對應；共用範例code，英文有完整解讀；原日期、穩定身份、公開署名與課次標題維持。
- HTML-01–04、A11Y-01–03：兩語全文、320／390／768／1280及各200%字級檢查；正文至少16px、行高至少1.7，無頁面水平溢出；局部表格／code鍵盤捲動、答案Enter／Space、SVG連結鍵盤開啟與焦點可見；無JS仍可閱讀全文與展開答案。
- FIG-01–06：HTML重排與可搜尋標籤；兩條件結果桌面並列、手機分組上下，無分支間箭頭；五步流程四箭頭。已人工閱讀390／1280圖1、390圖2及英文SVG截圖。可見SVG文字框未越界、未互相重疊。正文深色#18252c、成功#006b32、缺貨#a52e25搭配淺底#fbfcfd；色彩同時有條件文字。
- INT-01：本次沒有新增互動計算或作答提交；參考解析使用原生details，不推定學習成效。

## 本機實測

獨立worktree：`/tmp/kairos-m0304`；共享工作目錄另有M05-06編輯，完全未納入本次提交。Python使用`PATH=/opt/homebrew/bin:$PATH`（系統Python較舊，不支援既有產生器的語法）；不修改專案依賴。

- `pnpm run validate:content` 通過。
- `pnpm test`：278／278通過；兩份歷史遷移測試改讀本次保存的前版，當前教材由新測試驗證。
- `pnpm run check`：0 errors、0 warnings。
- `node scripts/check-publication-boundary.mjs`通過：隔離fixture、draft／future、英文課程兩種閘門，最後移除fixture並重建正式輸出。
- `pnpm run validate:release`通過（含既有全站、資產、原始教材下載包檢查）。
- `pnpm audit --audit-level=high`通過，4 low。
- HTML共用unittest 6／6通過。
- `pnpm exec playwright test --config playwright.aase-m0304.config.ts`：兩語2／2通過；全文、搜尋、四尺寸／200%、無JS、鍵盤與下載位元組相同。

SVG：`/images/aase/m03-04-{1,2}-{zh,en}.svg`；最終大小及正式站回讀見下方發布驗證。SVG只使用固定受審核元素及跳脫文字，沒有script、外部嵌入或任意markup入口。

## 發布驗證

- [PR #100](https://github.com/JasonLn0711/kairos-learning/pull/100)已合併；內容提交`18dfb61`，保留同期主線的合併提交`aad1581`、`5f7854b`。中間型別修正`cea0a3c`與主線後續採用的完整ConceptTeaching型別均保留歷史；最終型別來源為主線`47ca70a`。
- 最新[PR CI 42569579939](https://github.com/JasonLn0711/kairos-learning/actions/runs/42569579939)成功。合併後本機279／279測試、0 errors／0 warnings、雙語瀏覽器2／2再驗證通過。初次278項紀錄為合併前觀察，保留其時間界線。
- 正式部署commit：`8b383d6ce72e6dac1da7873828f8db16d01c63a7`；[Pages run 42569762014](https://github.com/JasonLn0711/kairos-learning/actions/runs/42569762014)成功。
- `AASE_BASE_URL=https://learn.cs-kairos.com pnpm exec playwright test --config playwright.aase-m0304.config.ts`：正式站2／2通過（13.1秒）。兩語新版號v1.1.0、逐段正文、四表、完整code、Q04選項／解析、同源搜尋、四尺寸／200%、鍵盤與無JS全部驗證；四份SVG公開HTTP200、文字不越界或互相重疊、下載與本機位元組相同。

| 正式圖檔 | 實測bytes |
| --- | ---: |
| [圖1中文](https://learn.cs-kairos.com/images/aase/m03-04-1-zh.svg) | 1788 |
| [圖1英文](https://learn.cs-kairos.com/images/aase/m03-04-1-en.svg) | 1985 |
| [圖2中文](https://learn.cs-kairos.com/images/aase/m03-04-2-zh.svg) | 3044 |
| [圖2英文](https://learn.cs-kairos.com/images/aase/m03-04-2-en.svg) | 3265 |

原始工作樹的本次初稿先備份至忽略的`.local/aase/m0304/initial-worktree-backup/`，再由正式主線fast-forward取得最終版；無關M05-06編輯及Git歷史保留。正式站截圖、JSON結果與日誌複製至執行owner的`.local/aase/m0304/production/`。原圖、原文、前版SHA256均核對通過。另以Playwright HTTP request回讀首頁及MATLAB入口為200、指定不存在路徑為404；六份既有MATLAB／合成參考ZIP的正式站SHA256全部與原清單一致。

獨立讀者理解與課堂prototype測試未執行；本文只交付教材與呈現證據，不宣稱使用者通過理解檢核或產品需求獲市場驗證。


## Planning 關聯｜發布證據補登

[11/9日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W46/days/2026-11-09.md#kairos-lessons-2026-11-09) ↔ [網站定位](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#kairos-lessons-2026-11-09) ↔ [W46容量與下一關](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W46/weekly-plan.md#kairos-lessons-2026-11-09)。Planning 承接本篇既有發布證據、貢獻與真人驗收關卡，原稿與技術證據維持本 repo；本次文件連結不變更教材、版本或原驗收範圍。
