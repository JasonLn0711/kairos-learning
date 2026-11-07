# CEH M02-06 v1.1.0：IP、ASN、DNS 與 CDN 章節替換

[中文教材](../sources/m02-06/M02-06-teaching.zh-TW.md) · [英文教材](../sources/m02-06/M02-06-teaching.en.md) · [正式資料](../../content/concepts/m02-06.json) · [原版來源](../sources/m02-06/archive-v1.0.1/M02-06-teaching.zh-TW.md) · [前版回執](2026-11-01-m02-06.md) · [維護契約](../content-authoring.md#m02-06-網路角色圖與-cidr-模擬器)

## 採用範圍

依提供的完整文字與六張參考圖，直接替換第 2 節 IP／CIDR、第 3 節 AS／ASN／BGP、第 4 節 DNS／CDN／Origin，將本機與公開查詢、NAS 分層判讀及四題整合案例放入第 8 節。全文保留九個主節及穩定 section-* 錨點；新增小節用 h3，主節用 h2。第 5–7 節 Traceroute、合成輸出與防護證據，以及第 9 節，與原版來源逐字比較通過。

新範圍依 WRITE-06 升 minor 為 v1.1.0、revision 3；原發布日保留，修訂日為 2026-11-01。開始工作時中文第一節已有未提交的「摘要」改字，本次保留並同步到來源。先前 NAS 觀點改動維持原狀，不納入這份教材修訂的完成範圍。

供稿文字與六張 PNG 保存於忽略目錄 `.local/m0206-revision/source/`，與附件逐位元組相符。舊雙語教材及解答保存於 `docs/sources/m02-06/archive-v1.0.1/`；原八張來源 SVG 與原 bilingual-svg.zip 均與 HEAD 相符。公開頁面使用編輯版，不把來源匯出介面的 favicon、站名尾碼、追蹤參數或未實作按鈕刊出。

## 內容與來源處理

- IP／CIDR：保留 IPv4 32 bits、IPv6 128 bits、/24–/27 比較、256 與常見 254 主機的區別、私有範圍、NAT 與存取控制邊界。模擬器固定 IP 192.0.2.25，支援 /24–/30；/28、/29、/30 的範圍起點會隨所在子網改變。
- AS／BGP：保留路由政策、起源 AS、RDAP 登記、網站經營者各自的證據；AS_PATH 與 Traceroute 分開。圖中的 AS64496／AS64497 為文件示例，不暗示實際公告。
- DNS／CDN：保留 A、AAAA、CNAME、快取命中、按需回源、DNS Only／Proxied、Origin 直接暴露、SMB／SSH 服務差異與 Anycast 的路由政策條件。
- 練習：修正黏成一行的 Python，提供可執行版本與預期輸出；DNS 空白輸出補上完整狀態查核。dig、ip 與 RDAP／RIPEstat 為讀者可選觀察，本輪未執行外部資產查詢或主動路徑探測。
- 理解檢核：保留原五個參考解答，增加四個整合案例解答，共九個原生收合。移除供稿中的「提交答案並取得解析」介面殘留，改為自行作答後展開解析，不新增成績或進度寫入。

核對 [CIDR](https://www.rfc-editor.org/rfc/rfc4632)、[BGP](https://www.rfc-editor.org/rfc/rfc4271)、[DNS](https://www.rfc-editor.org/rfc/rfc1035)、[AAAA](https://www.rfc-editor.org/rfc/rfc3596)、[ARIN RDAP](https://www.arin.net/resources/registry/whois/rdap/)、[Cloudflare 代理狀態](https://developers.cloudflare.com/dns/proxy-status/)、[Origin 保護](https://developers.cloudflare.com/fundamentals/security/protect-your-origin-server/)、[私有網路](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/)；其他基礎 RFC 引用延續教材來源。AI 協助編輯、翻譯與工具驗證；沒有將這些結果記為獨立讀者理解或實機網路驗收。

## 六張圖與參考圖的對應

| 供圖 | 本次圖／穩定識別 | 保留的設計關係 |
| --- | --- | --- |
| image-6 | 圖 1 network-map | 四層彩色圓角卡：名稱 → IP → CIDR → ASN；箭頭明示查核順序。 |
| image-5 | 圖 2 prefix-bits | 四個 8-bit 格，前三格藍色 24-bit 前綴、末格橘色 8-bit 可變區；32−24 與 2⁸。 |
| image-4 | 圖 3 private-network | 淡綠虛線內網邊界、電腦與 NAS 平行、合流到路由器／防火牆。外部網路放在邊界外，避免將 Internet 誤列為私有網段。 |
| image-3 | 圖 4 bgp-routing | 用戶 → ISP → CDN；藍色實線封包向下、橘色虛線 BGP 公告向上。 |
| image-2 | 圖 5 cdn-origin | 瀏覽器與 DNS 雙向虛線、HTTPS 指向 CDN、橘色按需回源；快取可直接回覆。 |
| image-1 | 圖 6 proxy-modes | DNS Only／Proxied 雙欄、直接連線與經代理兩條路徑；手機上下重排。 |

差異為本站字型、可換行 HTML、較完整圖說、可存取標籤與手機閱讀順序，不採整張截圖縮小。六個版型由固定節點與線型組成，不引入通用畫布或任意 SVG 注入。中英共十二份新 SVG，2377–3940 bytes；另提供獨立 network-svg.zip。原 Traceroute 與證據圖保留，因此頁面共八張圖。

## 驗證與證據

- WRITE-01–07：供稿與編輯版分層、章節對應、術語及數字核對、雙語語意與版本日期一致。來源文字順序、對照解答、未替換章節及原始檔保留有單元檢查。
- HTML-01–04：中英 320／390／768／1280 CSS px，200% 文字、無 JavaScript、語意標題及局部捲動。
- FIG-01–05：HTML 文字可搜尋、圖解按容器重排、SVG 由同一資料生成，檔案小於 100000 bytes、下載比對與 viewBox 邊界檢查。目視後修正 DNS 手機箭頭留白、SVG 標籤交疊及可變區色條；新增文字不與連線交疊的檢查。
- A11Y-01–03：原生 range 的標籤與鍵盤、Home／End／方向鍵、可見焦點、Tab／Shift+Tab、Enter 下載、Space／Enter 解答開關；無 JavaScript 預設 /24 仍可讀且滑桿停用。

本機結果：94 項單元測試通過；Svelte／TypeScript 0 errors、0 warnings；內容驗證與靜態發布檢查通過。發布邊界測試的 draft／future 標記未出現在 524 份部署文字產物，移除 fixture 後重建。兩份離線 Python 程式輸出符合預期；CIDR 的七個支援前綴及非法輸入有獨立測試。

專用瀏覽器 12 項通過；最終 SVG 改動再跑雙語圖檔／搜尋／無 JavaScript 2 項通過。執行平台為本機 Linux、Google Chrome for Testing 151.0.7922.34，以忽略目錄設定指定既有瀏覽器，未改個人設定檔。證據位於 `.local/m0206-revision/`：`unit-final.log`、`check-final.log`、`boundary.log`、`browser-final.log`、`svg-final.log`、`release-final.log` 與 `screenshots/`。目視新圖的中英手機、桌面與獨立 SVG，確認分組、數字、顏色、箭頭方向與可讀性。

既有閱讀驗收的 M02-05／M02-06 雙語回歸 8 項通過（23.0 秒），包含四種寬度、正文尺寸／行高、所有鍵盤區域與收合、原圖下載及無 JavaScript；證據 `reading-regression.log`。

## 交付界線

已完成本機教材替換、圖解與互動驗證。使用者後續授權 Git 發布，結果見[共同發布回執](2026-11-01-allocator-network-publication.md)。正式站 smoke 已完成並記於共同回執；實體手機、完整螢幕閱讀器及獨立讀者理解尚待驗證。公開 DNS／ASN 查詢與 NAS 設定未被本輪測試代做；教材完成不代表設備已安全或學習已通過。


## Planning 連結

[當日日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W44/days/2026-11-01.md#kairos-allocator-network-2026-11-01)與[網站專案](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-05-public-website-v3-clean-slate-rebuild.md#kairos-allocator-network-2026-11-01)保存狀態、容量與下一關；詳細來源、教學與驗證留在本 repo。
