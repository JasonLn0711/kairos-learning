# 首兩篇企劃（非公開文章輸入）

## NAS 已經斷網，接下來該確認什麼？
The NAS Is Offline. What Should We Verify Next?

### 指定內容與圖解參考

使用者指定以[這份 NAS 分享內容](https://chatgpt.com/s/t_6ae6cfb67cf481918f957400bfa3bc5c)作為文章內容、圖像與 SVG 設計參考。

取得狀態：2026-11-01 已依使用者指定，以 Safari 實際開啟分享頁，讀到〈實驗室 NAS 資安：從零開始的圖像化教學〉全文，並查看六張概念圖。先前一般頁面讀取只有登入介面的限制已由 Safari 閱讀排除。已確認可見內容與圖像設計；尚未取得原始 SVG／HTML 原始碼，不將畫面觀察寫成原始碼擷取。

採用依據與逐圖規格見 [NAS 內容與圖解設計紀錄](nas-content-design.md)。該文件記錄來源、章節順序、六圖語意、手機重排及待核版本，作為本篇實作與驗收依據。

落地要求：依[共同規範](../article-standards.md)與[專欄指南](authoring.md)，保留指定內容的概念與證據，完成中英雙語；圖解以 HTML／CSS／SVG 支援手機重排，並逐項驗收文字易讀性、鍵盤與無 JavaScript 閱讀。分享頁中的提案、示意及已驗證成果須按實際來源區分。

實作：[正式雙語文章](../../content/perspectives/nas-offline-recovery.json)；[驗收與發布紀錄](../releases/2026-11-01-nas-perspective.md)。

主張：把設備與套件盤點、漏洞適用性、暫時隔離、修補與恢復存取分成可驗證步驟。

依提供的對話，截至 2026-11-01，設備仍拔除網路線且未更新；型號與版本是對方回報，未實機驗證。正文應去識別化，不轉貼對話。

章節：警訊緣起 → NAS／DSM／套件／CVE／RCE → 適用性盤點 → 隔離與更新驗收 → 網頁管理與 SMB 的不同路徑 → 待確認事項。

待補：原始警訊及確切 CVE、套件完整版本、可達服務、備份與後續實際驗收。Cloudflare 仍屬候選方案，不描述為已部署。

來源候選：https://www.synology.com/en-global/security/advisory/Synology_SA_26_14

SMB 路徑：https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/use-cases/smb/

## 憑證更新後，如何確認公開連線已經生效？
After a Certificate Update, How Do We Verify the Public Connection?

主張：同時核對管理端安裝結果與使用者實際連線端點。

2026-11-01 的本機紀錄顯示後端已安裝，當時公開端仍提供舊憑證。這是歷史觀察，不代表發布時現況。

章節：更新緣起 → 網域、私鑰與信任鏈 → 安裝前核對 → 管理端與公開端觀察 → 可能的前置 TLS 層 → 驗收與責任交接。

待補：公開端最新憑證驗收、前置層管理者確認、可公開的通知依據。示例使用 example.com；不公開組織、IP、序號或管理回應。

圖解需求：瀏覽器 → 可能的前置 TLS 層 → 後端；未知角色以條件標示。
