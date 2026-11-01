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

已發布：[PR #62](https://github.com/JasonLn0711/kairos-learning/pull/62) 通過 [CI 41278512862](https://github.com/JasonLn0711/kairos-learning/actions/runs/41278512862) 後，以 merge commit `983acd8820f05cbb5b1fa238ce9227ac7a09deaf` 合併至 main，保留兩筆獨立提交：`bffb3e9`（文章、元件、下載與測試）、`03349fb`（設計、規範及驗收文件）。

[Pages 41278580437](https://github.com/JasonLn0711/kairos-learning/actions/runs/41278580437) 已成功部署該 merge commit。之後以 `NAS_BASE_URL=https://learn.cs-kairos.com npm run test:browser:nas` 實際驗證正式站，11 項全部通過（38.1 秒），涵蓋兩種語言、四種尺寸、200% 文字、鍵盤下載、無 JavaScript 及導覽。十二張公開 SVG 與本機原始檔逐位元組一致；圖檔為 2341–4392 bytes，獨立 SVG 文字邊界檢查均無越界。

Safari 原生工具曾逾時；重新取得狀態後成功開啟正式中文文章，讀到完整正文及六圖輔助使用文字，實際點選目錄並查看圖 1 卡片與下載連結畫面。此為 Safari 桌面閱讀觀察，手機尺寸與完整鍵盤測試由獨立 Chrome 執行。

公開站結果在 `.local/nas/live-browser.log` 與 `results.json`；本機初次結果另保留為 `local-results.json`。此收據更新只改文件，網站內容與元件仍對應上述已驗證版本。

維護方式與命令見[撰稿指南](../perspectives/authoring.md#可重用的響應式圖解)。本次不改變原有課程內容或學習進度。


<a id="nas-v2-editorial"></a>
## v2｜從讀者問題出發的白話改寫

2026-11-01，Jason 逐段指定標題與閱讀方向，AI 協助中英改寫及官方來源核對。FIRST PRINCIPLE：讀者需要先理解要解決的問題，再理解術語、條件與操作；稀缺資源是注意力與查證時間。保留證據界線，讓每段從日常情境走到可驗證的判斷。

五個段落依序回答：NAS 是什麼及如何共享檔案、斷網實際阻斷哪條路徑、漏洞如何被利用、系統與套件各自如何更新，以及網頁與 SMB 為何分別設定入口與權限。共用原有六圖、十二張 SVG 與章節錨點；正文和英文同步，沒有新增部署能力或宣稱實機處置結果。SA-26:13、SA-26:14、Cloudflare Tunnel 與 SMB 官方文件已於本日重新核對。

依 WRITE-01–06 更新內容及修訂紀錄，原發布日保留 2026-11-01，版本修訂日同日；觀點資料契約仍使用整數 revision，本輪由 v1 升為 v2，五次續修合併為同一個尚未發布版本。這是既有整數版號相容處理，不虛構歷史語意版本，也不另設閱讀更新日期。

本機 87 項單元測試、內容驗證、建置及 11 項 NAS 瀏覽器驗收通過；包括兩語四種尺寸、200% 文字、鍵盤、無 JavaScript、下載與搜尋。證據在 `.local/nas-editorial-*.log` 及 `.local/nas/`。Git 與正式站讀回於發布後另補，不由本機結果推定。

關聯：[正式內容](../../content/perspectives/nas-offline-recovery.json) ↔ [來源與設計](../perspectives/nas-content-design.md#nas-v2-editorial) ↔ [文章規範](../article-standards.md#原發布版本與修訂日期write-06) ↔ [Planning 日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W44/days/2026-11-01.md#nas-v2-editorial)。工程證據由本站管理；Planning 保存狀態、容量及下一關。


### v2 發布回執

內容 `117a1d7` 與文件 `febbfc2` 分開提交、非強制推送 main；[Pages 41285251060](https://github.com/JasonLn0711/kairos-learning/actions/runs/41285251060) 成功部署 `febbfc2a698664900cba6dfd826478ead3f75a7b`。正式中英頁五個新標題、v2 與日期資訊列已逐一讀回。`NAS_BASE_URL=https://learn.cs-kairos.com npm run test:browser:nas` 11/11 通過（39.0 秒）；紀錄在 `.local/nas-v2-live.log` 與 `.local/nas/results.json`。Svelte 0 error／0 warning，完整 release validators 通過。

Planning 分開提交 `3f6a2bb2`（專案／工具入口）與 `fd74f42d`（日誌／週容量），已非強制推送 main，[CI 41285286611](https://github.com/JasonLn0711/planning-everything-track/actions/runs/41285286611) 成功；日／週 Agenda 及 10 個新增相對連結與錨點檢查通過。兩邊發布前均無分歧，不需合併或重寫歷史；回執另以文件提交保存。下一關為 Jason 的實際閱讀回饋，設備維運與本人理解仍各自驗收。


<a id="nas-semver-correction"></a>
## 語意版本更正：v1.0.1

使用者指出 v2 不符合文章 `v x.x.x` 規範。前述 v2 是當時實際部署與測試的誤標紀錄，保留供追溯；目前修訂統一為 **v1.0.1**。原 v1 以 1.0.0 為明確遷移基準，五段閱讀改善屬 patch，並非 major 2。內部 revision 增至 3，僅供修訂計數；原發布與版本修訂日均維持 2026-11-01。沒有聲稱歷史頁面曾顯示 v1.0.0。

觀點資料模型必填 `contentVersion`，驗證器拒絕缺漏、整數與非三段版本，頁面只顯示此欄位。全站規範、觀點指南及兩份撰稿模板同步說明初版／patch／minor／major，禁止 revision 作公開版號。新增資料契約測試，NAS 中英瀏覽器測試直接核對 v1.0.1，防止再誤顯示 v2。正文與圖解沿用已確認的白話修訂。

[規範](../article-standards.md#原發布版本與修訂日期write-06) ↔ [觀點指南](../perspectives/authoring.md#文章語意版本) ↔ [Planning 更正](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W44/days/2026-11-01.md#nas-semver-correction)。本輪驗收與部署另列回執。
