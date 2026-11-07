# AASE M02-02 供稿抽換與驗收

本次依使用者原稿與五張參考圖，完整抽換七節中英文教材：工作桌與四天配色故事、上下文組成、10,000 Token 預算、容量／選材／版本／使用的區別、交接與正本、新對話判斷及權限情境檢核。版本 v1.1.0／revision 4；原發布與英文發布日 2026-11-05 保留，修訂日 2026-11-07。

Canonical owner 為 `content/aase/lessons/aase-m02-c02.json`。完整原稿、五張 PNG、舊版及 SHA-256 留在 [來源封存](../sources/aase/m02-02/replacement-2026-11-07/README.md)；[逐小節對照](../sources/aase/m02-02/replacement-2026-11-07/source-map.md)列出實質內容、修正與圖示差異。此次只改 Kairos 本課與必要的共用渲染／驗證，不建立 Planning 詳細副本。

## 採用與界線

- 五張圖以 HTML／CSS 重排；十個中英文 SVG 從同一正式 JSON 產生。選取使用虛線，工作流程使用順序箭頭；容量圖保留五色及圖例。單檔 1574–3193 bytes。
- 預算固定 1000＋2000＋4500＋1500＝9000，額外日誌範圍 0–3000；UI 步進 100、預設 500、1800 範例與重設。9500 剩 500，10000 恰好滿額，10800 超出 800，12000 超出 2000。這是題設算術，不是真實模型／Tokenizer 量測或使用品質證據。
- 交接範例提供真實剪貼簿寫入，包含七欄與教學假設；成功後才回報成功，拒絕時提供手動複製。無 JS 仍可讀取原文，操作停用。
- 保留一題原始三選項及兩題開放題。新增 `openChecks` 的雙語／搜尋／唯一 ID／非空答案驗證及原生 details；不虛構選項、評分、提交服務或學員理解。舊 Q01–Q03 封存，新問題用 Q04–Q06，qa 仍為空。
- 舊版 8192 預算的 Python 與練習同步改為本次 10000 題設，避免兩套例子互相矛盾。保留有效舊錨點與目錄短標題。
- 訓練知識反映於參數，Memory／檢索結果需經相應提供機制進入當前上下文；此處明確拆開原稿容易混淆的說法。已讀取 [Lost in the Middle](https://arxiv.org/abs/2307.03172) 與 [Anthropic context engineering](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents)，保留研究設定及跨模型／任務界線；本文沒有宣告任何服務目前的固定容量。

## 本機證據

2026-11-07，Linux／Chromium Playwright。本機截圖、日誌及 JSON 報告保存在忽略目錄 `.local/aase/m0202-local/`，正式站回讀證據在 `.local/aase/m0202/`；測試程式為 `tests/context-budget.test.ts`、`tests/aase-m0202-replacement.test.ts`、`tests/browser/aase-m0202.spec.ts`。

| 規則／檢查 | 實測結果 |
| --- | --- |
| WRITE-01–08、逐小節完整性 | 對照七節、四天故事、兩學生數字、四列問題表、七欄交接、五圖與三題。兩語情境、數字、原理、步驟及界線一致；七份來源檔雜湊相符。 |
| HTML-01–04、A11Y-01–03 | 中英各 320／390／768／1280 CSS px × 100%／200% 文字通過；頁面無水平溢出；正文／圖說／清單至少 16px、行高至少 1.7；表格與程式碼可鍵盤局部捲動。無 JS 全文、練習及參考答案可讀。 |
| FIG-01–06 | 五圖桌面與手機已目視分組、虛線、方向、角色色及換行。十 SVG 可鍵盤開啟、無文字越界／重疊；圖 1 另檢查文字落在卡片內。下載 bytes 與生成檔相同。 |
| INT-01、A11Y-02 | 滑桿 ArrowRight／Home／End、Tab／Shift+Tab、按鈕 Enter／Space；500、600、1000、1800、3000、0 與重設；剪貼簿內容相符且拒絕分支回報手動方式；無 JS 停用控制。 |
| 開放題 | Q05／Q06 的原始問句及完整參考答案進入頁面與搜尋；Enter／Space 展開／關閉，不計成績。 |
| 全套測試 | `npm test` 235／235 通過，包含輸入域／無效值、來源、題型、模型拒絕、SVG 同源與 Python 兩組輸出。舊版遷移測試改核對封存版本，保留歷史證據。 |
| 內容／型別 | `npm run validate:content` 通過；`npm run check` 0 errors／0 warnings。 |
| 發布邊界／靜態輸出 | `node scripts/check-publication-boundary.mjs` 草稿、未來日期、英文閘門通過並清潔重建；`npm run validate:release` 通過。 |
| 瀏覽器及回歸 | M02-02 中英兩項整合測試通過（10.2 秒）；共用 AaseLesson 另以 M02-01 中英回歸，兩項通過（9.3 秒）。 |
| 相依套件／舊下載 | `npm audit --audit-level=high` 通過，5 項既有 low 保留；六個 MATLAB ZIP checksum 全部相符。 |

目視檢查曾發現英文圖 1 的卡片背景不足及複製按鈕的文字對比問題；已改為依文字計算 SVG 卡片高度、指定按鈕文字色，再通過包含卡片內界線的新檢查。瀏覽器測試中的剪貼簿拒絕是受控故障情境，不是正式環境故障紀錄。

未做實體手機、完整螢幕閱讀器或真實模型實驗；不推論使用者已理解課程。未新增依賴套件或保存學員作答。

## 發布

[PR #87](https://github.com/JasonLn0711/kairos-learning/pull/87) 已合併。來源封存提交 `08c1d70`、教材／互動／測試 `f7fa692`、採用與本機驗收 `2f135d4`，合併及正式部署提交為 `75aa3785f4d649addecad960325b6bf10df62b1a`。

- [遠端品質檢查 42336691780](https://github.com/JasonLn0711/kairos-learning/actions/runs/42336691780)：success。
- [正式 Pages 42336864034](https://github.com/JasonLn0711/kairos-learning/actions/runs/42336864034)：success，發布上述合併提交。
- 正式 [中文版](https://learn.cs-kairos.com/courses/aase/v1/m02/concepts/m02-02/) 與 [英文版](https://learn.cs-kairos.com/en/courses/aase/v1/m02/concepts/m02-02/) 的完整正文、練習、選擇題與兩題開放題參考答案、v1.1.0、五圖、預算互動、剪貼簿成功／拒絕分支、四種寬度／200% 文字、鍵盤與無 JS 均通過。兩項整合測試共 20.4 秒。
- 十個正式 SVG 均 HTTP 200，可鍵盤開啟、無文字越界／重疊，圖 1 文字在卡片內；下載 bytes 與此次工作樹檔案一致。
- 發布前的成功版本定位為 [42334885415](https://github.com/JasonLn0711/kairos-learning/actions/runs/42334885415)／`2e4a3fb`；此定位沒有被當成本次驗收證據。

合併後已 fetch／ff-only 同步 `origin/main`，divergence `0 0`。最後回執為文件提交，網站程式與資產保持已驗收版本。所有作業在獨立 worktree 完成，主工作區原有未提交內容保留。
