# M03-02 v1.2.0 ARP 補充

本次補充 ARP 白話教學與整合練習，內容版本 1.2.0、revision 3；原發布日與修訂日期均為 2026-11-03。兩張指定圖解保持原樣。已完成發布與正式站驗收，回執如下。

## 來源與採用

[來源紀錄](../sources/m03-02/arp-supplement-2026-11-03/README.md)連接逐字供稿、雜湊、v1.1.0 原稿與圖解保留清單。新增範圍如下，中英兩語同步：

| 供稿內容 | 正文位置 |
|---|---|
| Ethernet／IP／ICMP 封裝及 ARP 直接承載 | 5.1，欄位對照與信封比喻 |
| Request 廣播、Reply 單播、快取重用 | 5.2，教室問答與四步流程 |
| 快取並非在線清冊、ARP 欺騙／毒化 | 5.3–5.4，讀取時間與新回覆分開 |
| /24 遮罩、先查路由再解析下一站 | 6.1–6.2，本地與遠端對照 |
| 第一段 IP／MAC、路由器重新封裝、NAT 例外 | 6.3，分層欄位表 |
| 廣播範圍、VLAN、Proxy ARP、完整交付流程 | 6.4–6.5，條件與失敗結果 |
| 四個 Ubuntu 純查詢命令及欄位解讀 | 8.3，示意輸出與自我檢核 |
| CEH 前後章節關聯 | 8.4，M02／M03／M04／M08 |
| 印表機逾時、ARP 回覆、遠端路由與第一段訊框 | 9.2，四題新檢核與預設收合答案 |

技術核對：[RFC 826](https://www.rfc-editor.org/rfc/rfc826.html)、[RFC 1027](https://www.rfc-editor.org/rfc/rfc1027)、[ip-route](https://man7.org/linux/man-pages/man8/ip-route.8.html)、[ip-neighbour](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html)、[RFC 7042](https://www.rfc-editor.org/rfc/rfc7042.html)。保留條件：跨網段依選到的路由解析下一站；快取查詢不等於收到新 ARP；回覆不驗證身分；NAT 可能改寫 IP。MAC 示例修正另見來源紀錄。

## 保留與驗證

WRITE-01–07：白話比喻、條件與觀察證據分開，中英資料／結論一致，新增教學範圍採 minor 升版。原有 section-1 至 section-9 錨點、ICMP 第 1–4 節、全部 visual 區塊及原七題答案保留；現在共十一題參考答案，qa 維持空陣列。

FIG-01–05：兩張指定圖的 16 個相關檔案以 SHA-256 對照，原 HTML visual 區塊完整比對；不改圖說、節點、箭頭、樣式、SVG 或下載包。補充用語意 HTML 表格與段落呈現。

HTML-01–04、A11Y-01–03：沿用現有元件，驗收兩語 320／390／768／1280px、200% 文字、鍵盤、局部捲動、無 JavaScript 及預設收合答案。自動驗收不代表完整無障礙認證或讀者理解。

驗證輸出保存在忽略目錄 `.local/m0302-arp/`；瀏覽器既有入口輸出在 `.local/m0302/`。實體手機、完整螢幕閱讀器與讀者理解尚待人工驗證。

## 本機實測結果

- 內容驗證通過（23 lessons／54 questions／30 terms）；134／134 單元測試通過；svelte-check 0 errors／0 warnings。
- 發布邊界驗證 552 份產物無 draft／future fixture，完成乾淨重建；完整靜態 release 驗證通過，兩語全文順序、十一題答案、搜尋標籤與原始下載一致。
- 瀏覽器 5／5 通過：兩語四寬度、200% 文字、鍵盤 Tab／Shift+Tab／Enter／Space、局部捲動、無 JavaScript、SVG 幾何與下載位元組。
- 圖 1／2 在兩語四寬度的 DOM 與所有子元素計算樣式（寬高、字級、行高、顏色、grid 與 transform）與修改前完全相同；16 檔 SHA-256 一致。供稿與附件逐位元組一致，五份封存檔與基準提交一致。
- 四個 ip 查詢命令執行成功；實際網路資訊只留於忽略目錄，未向遠端發送測試流量。範例輸出仍明示為合成資料。
- 新增文件相對連結與 git diff --check 通過。未變更共用元件、樣式、圖檔或依賴；原工作樹的無關修改保留。

## 發布與正式站回執

- `1f75b17` 保存供稿與 v1.1.0 原稿；`35cb4b9` 發布 v1.2.0 ARP 補充、測試與維護文件。以 `git push origin HEAD:main` 推送，fetch 後 divergence 為 `0 0`，保留雙方歷史。
- [Pages 41578306560](https://github.com/JasonLn0711/kairos-learning/actions/runs/41578306560) 成功部署 `35cb4b9`。CI 依賴稽核、內容、134 項單元測試、型別、發布邊界、靜態 release 及保留下載校驗通過。
- 正式站[中文頁](https://learn.cs-kairos.com/courses/ceh/v13/m03/concepts/m03-02/)與[英文頁](https://learn.cs-kairos.com/en/courses/ceh/v13/m03/concepts/m03-02/)均 HTTP 200、v1.2.0、兩張指定圖解、十一題預設關閉答案；新增八個小節錨點與路由／ARP 關鍵內容存在。
- 兩語 320／390／768／1280px 無整頁水平溢出；六個 SVG 下載逐位元組等於本機檔案。圖 1／2 在正式站兩語四寬度的 DOM 與計算樣式也與修改前基準完全相同。
- 正式站新增 Ubuntu 查詢段落的中英手機截圖已目視核對，文字與命令完整可讀。首次 Chromium 導航遇到 ERR_CONNECTION_CLOSED，重試成功；未因此重啟或重做部署。
- 正式站證據為 `.local/m0302-arp/live/results.json`、`live-figures.json`、截圖與日誌。完整鍵盤、200% 文字與無 JavaScript 驗收在本機完成；正式站此次驗收範圍為上述回讀與圖解比對。

本回執只補記已取得證據，不改教材。實體手機、完整螢幕閱讀器及讀者理解仍未驗證。
