# NAS 觀點與響應式圖解發布紀錄

日期：2026-11-01。使用者已要求完成網站文章、SVG 元件及發布。此前正式版本為 `c62800f4830f59db1e226571fb645f0792980622`，Pages [41276517525](https://github.com/JasonLn0711/kairos-learning/actions/runs/41276517525) 成功。

## 成果與來源

[中文文章](https://learn.cs-kairos.com/perspectives/nas-offline-recovery/)與[英文文章](https://learn.cs-kairos.com/en/perspectives/nas-offline-recovery/)由同一份[正式內容](../../content/perspectives/nas-offline-recovery.json)產生。六張圖包含 26 個節點，提供十二張雙語 SVG 下載。文章可從觀點列表、搜尋及相關 CEH 教材進入。

[來源與設計紀錄](../perspectives/nas-content-design.md)承接 Safari 已閱讀的使用者指定分享。正式稿以教學情境呈現；沒有宣稱實機更新、入侵調查、Cloudflare 部署或 NAS 復線已完成。官方查核涵蓋 Synology SA-26:13、SA-26:14、備份／快照，以及 Cloudflare Tunnel／SMB 文件，查核日為 2026-11-01。原稿機型特定更新日期未納入正式事實。

[共用元件](../../src/lib/components/TeachingDiagram.svelte)使用 HTML 節點、CSS 重排與固定 allowlist SVG 圖示。`flow` 有序清單和 `cards` 平行清單分開呈現，圖中文字納入搜尋。下載 SVG 由[同一模型](../../src/lib/perspective-diagrams.ts)產生；沒有任意 HTML 注入、圖片生成服務或新增相依套件。

## 本機驗收

| 範圍 | 實測結果 |
| --- | --- |
| WRITE-01–05 | 完整中英文章；條件、版本與教學情境對照；來源逐節連結。AI 協作署名明確。 |
| HTML-01、A11Y-01 | 兩種語言無 JavaScript 可讀六圖及全部 26 節點，目錄與語言切換可用；語意圖說與清單。 |
| HTML-02–04、FIG-01–02 | Chrome 獨立測試兩語各 320、390、768、1280 CSS px；無整頁水平溢出，節點文字至少 16px、不裁切；390px 的 200% 根文字放大測試通過。 |
| FIG-03 | 十二張 SVG HTTP 下載與原始檔逐位元組一致，每張小於 100000 bytes；產生器與內容一致性由單元測試保護。 |
| A11Y-02–03 | Tab 跳至內容、依序至下載連結、Shift+Tab 返回、焦點可見、Enter 下載成功；正文與圖解直接可見。圖解無 Space 控制項，故該操作不適用。 |
| 搜尋與雙向關聯 | 觀點列表 → 文章 → 相關課程 → 文章往返及 SMB 搜尋通過。 |
| 工程檢查 | 84 項單元測試；Svelte 0 errors / 0 warnings；內容驗證、實際草稿／未來內容發布邊界與全部 release validators 通過。 |
| 瀏覽器回歸 | 11 項 NAS 驗收及 16 項既有觀點測試通過，包含搜尋失敗恢復及觸控模擬。 |
| 套件稽核 | high 門檻通過；既有相依鏈共 5 項 low，未進行破壞性框架升級。 |

詳細證據保存在忽略的 `.local/nas/`：`results.json`、`browser.log`、`regression.log`、`boundary.log`、`release.log`、`svg-checks.json` 及 `screenshots/`。已目視檢查桌面共享圖與手機攻擊路徑圖，確認平行關係和順序箭頭。文字倍增是本機閱讀測試，不宣稱實體手機、Safari 響應式模式或完整螢幕閱讀器驗收。

## 發布

待填入實際 PR、部署 commit／run 與公開讀回結果；通過本機驗收尚不等同線上發布。

維護方式與命令見[撰稿指南](../perspectives/authoring.md#可重用的響應式圖解)。本次不改變原有課程內容或學習進度。
