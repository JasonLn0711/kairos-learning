# 觀點、文章規範與閱讀盤點 — 2026-11-01

## 貢獻與所有權

對象是教學網站讀者、文章作者與協作 AI agent。Jason 決定教學型觀點定位、完整雙語、正面而準確的臺灣繁體中文、白話教學及每頁響應式 HTML；並選定「共同規範＋全站盤點」，核心內容可見、答案可收合。AI 協助實作、整理規則及執行工程驗證。

FIRST PRINCIPLE：稀缺資源是讀者注意力、編輯維護時間與可驗證證據。網站 repo 擁有內容模型、UI、規範及測試；Planning 擁有容量、狀態與下一關。每頁的欄寬適配與圖解易讀性分別驗收。

## 成果與關聯

- [專欄編輯指南](../perspectives/authoring.md) → [撰稿模板](../perspectives/writing-template.md) → [首兩篇企劃](../perspectives/editorial-briefs.md) → [專欄瀏覽器證據](../perspectives/verification.md)。正式觀點目前為空；合成文章只在隔離預覽。
- [全站規範](../article-standards.md) → [共用工作表](../article-writing-template.md) → [逐頁盤點](../article-audit.md)。[Agent 入口](../../AGENTS.md)與[教材資料契約](../content-authoring.md)連接編輯及工程責任。
- [架構](../platform-architecture.md)與[發布作業](../publishing-security.md)維持共同日期閘門、靜態產物及原教材保留。
- [Planning 當日日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W44/days/2026-11-01.md#kairos-articles-2026-11-01) ↔ [網站專案狀態](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#kairos-articles-2026-11-01)。Planning 保留控制面，詳細證據可供日後維護、週回顧與成果整理重用。

## 整合與驗證

保留遠端 main 的 12 個新增提交，從 494a52e 快轉到 9f55b07，再恢復本機變更。package.json 的衝突經人工檢查，合併兩邊指令；遠端 M02-04／05／06 驗證器與本機觀點、盤點工具都保留。原分支備份與工作樹 stash 保留，本次無歷史重寫。

整合後 validate:content、82 項測試、svelte-check（0 errors / 0 warnings）、publication-boundary、validate:release 及 MATLAB ZIP 檢查通過。npm audit 無 high／critical，保留 5 low，未強制升級。瀏覽器重驗與遠端發布結果於下方追加；初次 247 頁盤點屬合併前快照。

## 下一關

全站圖解標籤、箭頭與閱讀順序、完整鍵盤流程、200% 文字放大與無 JavaScript 語意完整性仍需逐頁驗收。後續由網站維護者依盤點安排修正；觀點圖解欄位需另外擴充模型、驗證器及搜尋。NAS 與 TLS 文章仍待企劃列出的現場證據；本次未操作設備或發布完整文章。

本次是既有教學平台維護，不新增固定排程、每日文章配額或個人學習完成紀錄。工程驗收不代表讀者理解或實體手機／螢幕閱讀器認證。

## 整合後瀏覽器結果

16 項專欄 Playwright 測試再次通過；253 頁、1012 筆四尺寸初篩無差距。253 頁完成無 JavaScript 正文長度及第一個鍵盤焦點／適用收合操作紀錄。人工圖解、完整操作流程、200% 放大及無 JavaScript 語意驗收仍待完成。

分開提交：`966e685` 觀點功能與發布隔離、`2091909` 專欄瀏覽器測試、`5fbb36b` 全站寫作規範、`a37421e` 全站盤點工具。本回執及盤點為獨立證據提交。正式部署狀態由後續 GitHub 工作流程回讀確認。

## Git 發布與正式站回執

2026-11-01 已以 `git push origin HEAD:main` 非強制推送上述 5 個獨立提交，遠端讀回為 `033b52c1b842dae4182bf827f0d8e6740eb99154`，當時差距 0／0。遠端原有 12 個提交全部保留；備份分支及 stash 留在本機。

[Pages 41276416247](https://github.com/JasonLn0711/kairos-learning/actions/runs/41276416247) 已 completed／success，對應 `033b52c`。正式 `/perspectives/` 與 `/en/perspectives/` 的 HTTP 讀回均回傳 403，停止重試；公開內容讀回仍待驗，不以部署成功代替。後續此文件的回執提交由相同 main 工作流程處理。

Planning 分開提交 `c4c3f874`（專案／工具入口）與 `f3115036`（日誌／週計畫），推送後遠端一致；[CI 41276431136](https://github.com/JasonLn0711/planning-everything-track/actions/runs/41276431136) 成功。日／週 agenda 與新增相對連結、錨點檢查通過。網站 Python 快取及 Planning 原有未追蹤工具目錄維持本機，不列入此次公開變更。
