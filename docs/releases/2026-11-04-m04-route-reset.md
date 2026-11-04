# M04 新版路線與舊版撤下（2026-11-04）

狀態：實作與本機驗證完成，供 draft PR 審查；未合併、未啟用 auto-merge、未部署正式站。

## 本次行為

- M04 目錄改為正本的 10 組 CEH26-M04-C01 至 C10，目前全數待發布，沒有新教材、測驗或學習完成宣告。
- C03 合併 FTP／SMTP；C05 合併 NetBIOS／RPC；C06 合併 Unix/Linux 使用者／NFS；C09 包含 NTP、IPsec、VoIP、IPv6、BGP，另辨識 Telnet／TFTP；C10 為列舉防護。新 C09／C10 不借用舊 SNMP／LDAP URL。
- 舊 12 篇概念教材、章級教材、原創題目與匿名問答退出公開正文、導覽、搜尋、錯題複習、sitemap、client JS 及靜態圖片。章級 quiz/labs 路由也退出；舊 URL 為 404。
- M03-08 下一步連到 `/courses/ceh/v13/m04/#ceh26-m04-c01`，英文對應 `/en/…`。目錄入口獨立於章級教材是否公開；quiz/labs 仍需公開章級教材。
- M03 章級教材的舊 M04 related link、詞彙 backlink 及兩篇 NAS 觀點的舊相關入口一併解除。其他概念教材正文與 MATLAB 原始資產逐位元組保持基準值；不碰私人學習紀錄或 Planning。

來源：[最新版路線正本（2026-10-27）](https://github.com/JasonLn0711/ceh-cehp-certification-notes-2026/blob/main/study-plan/core-route-2026-10-27-crosswalk.md)。舊 crosswalk 的「複習／診斷」屬歷史規劃；本次使用者明確要求新版全部待教、待發布，故不沿用舊交付作為新版進度。

## 保存與恢復

[歸檔說明](../../archive/ceh/m04-legacy-2026-11-04/README.md)與 [manifest](../../archive/ceh/m04-legacy-2026-11-04/manifest.json) 記錄 103 份原檔的原路徑、雜湊、版本與 URL，含受影響共用檔案的基準副本。只搬移此 repo 原已追蹤的公開檔案；沒有私人原稿或個人作答。

最後成功正式 Pages 為 [run 41748093023](https://github.com/JasonLn0711/kairos-learning/actions/runs/41748093023)，來源 `11f068dc1d9c04fcf7201648d6264a2093c2842e`。恢復採新分支／revert PR 或經授權重跑已知正常 workflow；不改寫 main 歷史。本次只在隔離暫存目錄實際重建原檔並與 Git object 比對，沒有正式 rollback。

## 驗證

- `npm run validate:content`：22 篇雙語章級教材、51 題、29 個詞彙。
- `npm test`：30 個 test files 通過；涵蓋新 stable ID 的 draft／future gate、舊版歷史來源、私人進度儲存與現有章節。
- `npm run check`：0 errors、0 warnings。
- `node scripts/check-publication-boundary.mjs`：獨立概念與匿名 Q&A fixture、draft/future 排除、乾淨重建通過；504 個 deployed text artifacts 未含 fixture。
- `npm run validate:release`：全部靜態連結、語言、CSP、資產位元組、現有 CEH 與 MATLAB 檢查通過。
- `python3 scripts/verify-m04-retirement.py`：103 份歸檔原檔可恢復、10 個待發布單元、836 個輸出排除 77 個舊 M04 ID／URL／正文摘要／問題標記；非 M04 概念原檔與 MATLAB 原始資產對照基準通過。
- `npx playwright test --config playwright.m04-retirement.config.ts`：4 tests 通過；中英 320／390／768／1280、200% 文字、鍵盤焦點、無 JavaScript、M03-08 接續、待發布單元無正文連結、舊文／測驗／練習／圖片／archive 路徑 404、搜尋無舊 M04 入口、MATLAB 入口。截圖與 JSON 在忽略的 `.local/m04-retirement/`；人工看過中文 390px 截圖。
- `npm audit --audit-level=high` 通過：5 項 low，0 high／critical；未升級依賴。
- `git diff --check` 通過；既有六個 MATLAB ZIP 另以 SHA256SUMS 核對。

規範：WRITE-01–06（繁體雙語、正本與日期／歷史分離）、HTML-01–04、A11Y-01–02。沒有新增圖解或互動，既有 SVG 安全邊界未放寬。自動測試與局部人工視覺核對不代表完整 WCAG 認證或個人理解。

## 發布界線與後續

正式站尚未套用本次修改。主代理負責具體 PR 的合併／發布授權與正式 Pages 回讀。先讓新版目錄上線，再由實際教學逐步發布新 stable ID 教材；本次不替使用者寫出十篇新教材。下一篇若發布 C01，需同步更新 pending 文案、遷移檢查／測試的全數待發布斷言及本回執的當時狀態，不把歷史回執改寫成當時已發布。

## 合併前文案修正

CEH 總覽中英 lead 改為已發布章節提供入門教材，獨立概念逐步整理；明示 M04 十單元全數待發布。兩語 notice 同步說明按實際教學發布、其他章節沿用現行路線，以及待發布項目沒有正文。保留獨立製作與考試範圍界線。新增雙語總覽瀏覽器驗收，檢查 M04 為 10 項、0 篇公開，並排除舊的每章完整／從 M04 開始文案；本組瀏覽器驗收更新為 6 tests。
