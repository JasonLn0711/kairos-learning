# AASE M02-02 四圖新稿抽換回執

依本次新供稿，將 M02-02 七節中英文正文更新至 v1.1.1／revision 5；保留原發布與英文發布日 2026-11-05，版本修訂日 2026-11-07。此為同日[前一版](2026-11-07-aase-m0202-replacement.md)的後續抽換，兩份原稿分開保存。

正本為 `content/aase/lessons/aase-m02-c02.json`。[來源封存](../sources/aase/m02-02/replacement-2026-11-07-followup/README.md)包含本次全文、四張 PNG、抽換前 JSON 及六檔 SHA-256；[逐小節對照](../sources/aase/m02-02/replacement-2026-11-07-followup/source-map.md)記錄採用位置、差異與圖意。四張參考圖分別落在資料室／工作桌、五項上下文、容量實驗與四步工作循環；七欄交接卡另沿原生呈現，支援複製。

本次資源是本課編輯與瀏覽器驗收時間，執行與證據由 kairos-learning 持有；未要求跨 repo 更新，不建立 Planning 詳細副本。保留主工作區原有 M04-08 兩份教學 Markdown 與來源目錄，從隔離 worktree 發布本次範圍。

## 採用

- 以本次 1,000 份／拿到 10 份／第 237 份安全規則取代前版四天長故事；配色故事改在第四節承接四種原因表，依新稿的暖象牙白／陶土紅與紫色情境解釋。
- 七節完整保留原理、數字、原因表、工作包、Source of Truth、Context Engineering、重開對話條件與 M02-03 銜接；保留舊有效錨點、相同預算 Python 範例與實作練習。英文逐小節對應例子與限制。
- 本次四選項問題採新 Q07、答案 C；開放問題採新 Q08。原題與參考答案留在前版封存，新頁保留原生答案展開，不建立批改服務或學員成績。參考答案是編輯補充，包含後端權限檢查界線。
- 圖解使用可選取 HTML、容器重排及固定 SVG 連線；第二圖新增 1–5 編號。圖 4 流程仍使用既有 `m02-02-5-{lang}.svg` URL，交接卡仍使用 `...-4-...`，保留已發布資產路徑。十個 SVG 由 `scripts/aase_m0202_svg.py` 同源產生，1567–3084 bytes／檔。
- 容量互動沿用 10,000 上限與固定 9,000，額外日誌 0–3,000／步進 100；500 預設、1,800 超出 800、1,000 滿額、3,000 超出 2,000。這是教學算術，沒有執行真實模型或 Tokenizer 量測。
- 回讀 [Lost in the Middle 原始論文](https://arxiv.org/abs/2307.03172)，保留特定多文件問答／鍵值檢索的位置效應與跨任務界線；回讀 [Anthropic 上下文工程文章](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents)確認每輪資訊選取與維護的說明。

## 驗證

2026-11-07，Linux／Chromium，隔離工作區 `/tmp/kairos-m0202-followup`。瀏覽器證據在該 worktree 忽略目錄 `.local/aase/m0202/`；日誌在 `/tmp/m0202-followup-*.log`。驗收範圍為本課雙語頁，沒有推論全站已改善。

| 規則／檢查 | 觀察結果 |
| --- | --- |
| WRITE-01–11 | 依來源對照逐節核對七節、較深層例子、表格、四圖、工作包與兩題；兩語對應相同數字、案例、因果及限制。六份來源 SHA-256 全相符。 |
| HTML-01–04、A11Y-01–03 | 雙語全文／表格／程式／練習／答案進入實際頁面；320、390、768、1280 CSS px，各 100%／200% 文字通過，無頁面水平溢出，正文及圖說至少 16px／1.7 行高。無 JS 可讀全文及展開答案，控制停用。 |
| FIG-01–06 | 目視中文 390 與英文 1280 的四張主圖，資料選取、五項平行組成、容量分項、工作順序與回饋圖說清楚；交接卡保留七欄平行結構。十 SVG 全部檢查文字邊界／重疊，下載 bytes 相同，固定受審核元素與大小限制通過。 |
| INT-01、A11Y-02 | 滑桿 ArrowRight／Home／End、Tab／Shift+Tab、Enter／Space、端點與滿額、預設／1800／重設；剪貼簿成功與拒絕分支、開放題／選擇題原生展開、局部表格／程式碼鍵盤捲動均通過。 |
| 內容／型別 | `npm run validate:content` 通過；`npm run check` 0 errors／0 warnings。 |
| 測試 | `npm test` 248／248；包含來源、問題格式／ID、模型拒絕、預算有效及無效輸入、Python 實際輸出與 SVG 同源。 |
| 發布閘門 | `node scripts/check-publication-boundary.mjs` 通過，草稿／未來日期／英文狀態與日期閘門均驗證，最後清潔重建；`npm run validate:release` 通過。 |
| 瀏覽器 | `npx playwright test --config playwright.aase-m0202.config.ts` 雙語 2／2 通過（9.3 秒），逐段核對正式資料到 DOM 與搜尋文字。 |
| 相依與下載 | `npm audit --audit-level=high` 通過，既有 5 low 保留；六個 MATLAB ZIP checksum 全相符。 |

第一次在主工作區執行時發現兩項本課舊版固定斷言與原有 M04-08 來源同步失敗；前者已同步新版本與教學指定值文字，後者屬不在本次範圍的既有未提交工作。上述 248／248 是從不含該未提交修改的隔離工作區實測。

未做實體手機、完整螢幕閱讀器驗收或真實模型實驗；自動檢查及目視檢查不代表使用者已完成學習。未新增依賴或保存學員作答。

## 發布證據

[PR #91](https://github.com/JasonLn0711/kairos-learning/pull/91) 已合併，正式部署提交為 `be8b32bcb6a761cdc24e282204111ea6a7509904`。來源封存 `6dcd3b3`、教材／圖檔／測試 `b1685ea`、本機回執 `887bebd` 分別保留。

- [遠端品質檢查 42386317034](https://github.com/JasonLn0711/kairos-learning/actions/runs/42386317034)：success。
- [Pages 42386458594](https://github.com/JasonLn0711/kairos-learning/actions/runs/42386458594)：success，發布 `be8b32b`，總時間 1 分 43 秒。前次成功 Pages 為 42338489004，僅供回復定位。
- 正式[中文頁](https://learn.cs-kairos.com/courses/aase/v1/m02/concepts/m02-02/)及[英文頁](https://learn.cs-kairos.com/en/courses/aase/v1/m02/concepts/m02-02/)回讀 v1.1.1、七節全文、所有小節／表格／程式／練習、Q07／Q08 與參考答案，以及搜尋文字，全部符合本次正式 JSON。
- `AASE_BASE_URL=https://learn.cs-kairos.com npx playwright test --config playwright.aase-m0202.config.ts` 正式雙語 2／2 通過（20.0 秒）：四寬度與 200% 文字、無 JS、鍵盤、容量端點／滿額／超出與重設、剪貼簿成功／拒絕均通過。
- 十份正式 SVG 均成功取得，文字無越界／重疊，bytes 與本次生成檔完全一致；圖 1 文字亦位於卡片邊界內。正式回讀 JSON 報告及截圖保留於隔離 worktree `.local/aase/m0202/`，另複製到主工作區 `.local/aase/m0202-followup/production/`。

本次教學修改已發布。最後回執只更新文件，不改動已驗收的網站程式與圖檔；推送後再 fetch 確認與 `origin/main` 的 divergence。主工作區同期的 M03-01／M04-08／M04-10 等其他教材修改均未納入本次提交。實體裝置、完整螢幕閱讀器與學員理解仍未評估。
