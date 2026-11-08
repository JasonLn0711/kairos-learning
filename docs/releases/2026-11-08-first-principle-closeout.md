# 11/8 FIRST PRINCIPLE｜M05 發布對帳與 pnpm 整合

稀缺資源為注意力、可重現環境與可信證據。Jason 提供教材及整合／發布指示，Agent 核對來源、保留雙方 Git 歷史並串接 Planning；讀者為 CEH 中英教材學員與後續維護者。教材、來源、圖解及工程驗收正本留 Kairos Learning，Planning 持有狀態、容量、locator 與下一關。

## 版本與成果

本輪起始 main `083b4e1`，遠端新增 8 個提交，已 fast-forward 至 `6692cbe`。原工作樹以 `stash` 保存（訊息 `preserve pre-sync lessons and pnpm 2026-11-08`），基線另有 `backup/pre-sync-20261108`。M05-02、M05-03 已由遠端獨立提交及 PR #99／#98 發布，本輪接續其整合後版本與回執，保留兩組受限渲染器及 M05-02 字級修正。原工作樹較早的課綱／回執版本可由備份回查。

- [M05-02 發布回執](2026-11-08-m05-02.md) ↔ [逐小節來源對照](../sources/m05-02/source-map.md)：完整雙語、四圖／八份 SVG。
- [M05-03 發布回執](2026-11-08-m05-03.md) ↔ [逐小節來源對照](../sources/m05-03/source-map.md)：完整雙語、五圖／十份 SVG。
- 本輪由 GitHub API 重驗兩個既有 Pages run 的 `success` 與 head SHA；正式站瀏覽器再驗結果與本輪 pnpm gate 分列如下。PR95／97 仍 OPEN；較早草稿的阻塞屬該分支歷史，現行 main 的發布證據由 PR99／98 承接。本輪不關閉或改寫舊 PR。
- pnpm 10.34.9 的 lockfile、packageManager、CI 安裝／快取與內部建置呼叫一起遷移；保留各套件版本與發布閘門。另將合成觀點 fixture 的已移除 lesson ID 改成現存 `ceh-m01-cia`，讓隔離預覽沿用有效關聯；這項修正獨立提交。

規則 WRITE-01／03／04／11 用於主張、日期與證據範圍；HTML／FIG／A11Y 的課次驗收詳見各篇回執，本輪不擴張為全站改善。實體手機、完整螢幕閱讀器與獨立學員理解仍依原回執界線。W45 容量 Unknown，沒有新增個人工時、固定時段、週輸出或學習完成；個人學習 must-win 與恢復優先，Red 時依現行學習規則縮至可承擔的小步驟。

## 證據路由與下一關

[日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W45/days/2026-11-08.md#kairos-m05-pnpm-closeout-2026-11-08) ↔ [W45](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W45/weekly-plan.md#kairos-m05-pnpm-closeout-2026-11-08) ↔ [網站專案](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#kairos-m05-pnpm-closeout-2026-11-08) ↔ [CEH 專案](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-07-ceh-cehp-certification-training.md#kairos-m05-pnpm-closeout-2026-11-08) ↔ [整合入口](https://github.com/JasonLn0711/planning-everything-track/blob/main/docs/14-local-integrations.md#kairos-m05-pnpm-closeout-2026-11-08)。

下一關：由 Jason 正常閱讀提供答案／卡點，再由 CEH owner 核對理解；下一交付課次仍為 M05-04。pnpm 遷移依本輪 CI／Pages 結果驗收。既有工作站 pnpm 維護的 repo 發布關卡由本回執接續，原始主機清理證據仍留其 owner。

## 本輪驗證

`pnpm install --frozen-lockfile`、內容、263 項單元、型別 0 errors／0 warnings、完整發布邊界與 `validate:release` 通過。`pnpm audit --audit-level=high` 通過，回報 4 項 low。M05-02／03 本機瀏覽器各 6 項通過（5.1s／4.4s），涵蓋兩語全文順序、四尺寸、200% 文字、鍵盤、無 JS 與 SVG bytes；隔離觀點預覽 `pnpm run preview:perspectives --build-only` 通過。既有 MATLAB bytes／checksum gate 由 release 檢查保留。log 在忽略的 `.local/git-sync/`。

35 個新增跨 repo 檔案／明示錨點連結、兩 repo whitespace、Planning 11/8 day／W45 week agenda、repository 與 metrics validator 通過。repository 為 44 既有警告、0 新增；agenda 容量 Unknown，metrics 最新 2026-08-20，本輪沒有補造數據。JSON 語意比對確認私人進度只有 C02／03 的 publication 欄位變動，其他學習證據完整保留，舊 publication 保存於 prior_reports。anti-ai-rhetoric-lint 未提供可用 skill，本輪依既有 voice contract 人工核對。

本段為推送前結果；新 CI／Pages 與正式回讀於發布後補收據。
