# M04-09 v1.1.0 供稿採用與圖解設計

修訂及查核日 2026-11-07（Asia/Taipei）。本次[原文、十張圖片、雜湊與前版](replacement-2026-11-07/README.md)獨立保存。以下對照指向正式 `sourceBody`，中英使用相同錨點。原稿中的外部圖片代理網址、favicon、搜尋來源標籤留在原文；正文以本地生成圖及第一手協定來源承接，避免把搜尋介面文字當教材。

## 逐節採用

| 原文單位 | 正式錨點／資料 | 採用內容與編輯差異 |
| --- | --- | --- |
| 開場三段 | 正文開頭 | 七種技術、取得資訊／登入／控制的界線及 Enumeration 用途完整保留；原文自引 v1.0.0 改為延續本課，不把舊版當本版版本。 |
| 一、辦公大樓 | section-1／roles | 500 員工、電腦／電話／門禁／網路／伺服器；六組角色用途全數進入可搜尋 HTML；功能不同不能一概視為漏洞。 |
| 二、M03／04／05 | section-2／stages | 三個課程階段、三種比喻及各自問題完整保留；箭頭是判讀順序，不保證自動找到弱點。 |
| 五個證據層次 | section-2／ladder | 發現服務、取得回應、取得資訊、驗證身分及操作權限五項完整說明，含部分服務不需登入及非固定流程的界線。 |
| 三、NTP 用途 | section-3 | 三支監視器時間不同的調查情境；三設備同一入侵事件；10:00:02／09:57:12／10:03:30 三列表；UDP 123 與錯判事件順序的因果。 |
| Stratum 定義 | section-3-sub-1／stratum | 原子鐘／GNSS、0／1／2／3、4…；較小數字不保證較準，保留同步狀態／來源品質／網路延遲。 |
| NTP 拓樸與證據 | section-3／ntp-network | 依圖 3 補 1–4 層的 2／2／4／5 平行設備、多來源、對等與共用鏈路；10:00 的回應不代表管理設定或修改權限。 |
| 四、VPN 情境 | section-4／ike | 在家連公司、IPsec 保護與 IKE 協商／身分角色；電腦／閘道／內網三角色。 |
| IKE 三種工作 | section-4／ike | IKE_SA_INIT、IKE_AUTH、資料通道驗證及不是三個固定 IKE 交換的限制；延續已查核 CHILD_SA 說明，不將初始回應當登入。 |
| 編號表 | section-4 | UDP 500／4500、IP Protocol 50／51 與 ESP／AH 四列；port 與 IP Protocol Number 的區別完整保留。 |
| 五、VoIP 用途 | section-5 | 電話服務／客服中心／錄音系統情境，VoIP 的兩種工作及電話總機／聲音比喻。 |
| SIP／RTP 分工 | section-5／sip | 撥打方、接聽方、撥號／響鈴／接通與聲音輸入／封包／輸出；兩個雙向交換分開。 |
| TLS 的條件與界線 | section-5 | TLS 保護特定訊令區段；可觀察媒體封包位置上一般 RTP 的風險；TCP 5061 不足以推論整體加密；另核對 SRTP／金鑰／存取控制。 |
| 六、IPv6 位址 | section-6 | 128-bit、fe80::1234:abcd:5678:9abc、fe80::/10 及 Link-Local 用途。 |
| ND 四訊息 | section-6 | NS／NA／RS／RA 四列表及中文解釋；ICMPv6 不是 TCP／UDP Port。 |
| 兩筆快取 | section-6 | 只代表目前快取，保留尚未通訊／已過期／同機多位址三原因。 |
| 本機指令 | section-6 code | `ip -6 neigh show` 原樣，補 Ubuntu／iproute2 前提與欄位／空輸出解釋；沒有假造實機結果或改為網路掃描。 |
| ICMPv6 過濾 | section-6 | ND 與 Path MTU 所需訊息及全部封鎖導致故障的條件。 |
| 七、BGP 基礎 | section-7 | 臺灣寄美國的物流比喻、BGP／AS／ASN、AS64500 → AS64497 → AS64496、TCP 179。 |
| 路由資訊界線 | section-7 | AS 路徑不等於實體路由器清單；Looking Glass 觀測點與管理權限分開。 |
| 圖 7 的公告迴圈 | section-7／bgp | 四 AS 菱形、四條公告方向、每跳 prepend AS_PATH 與回到自己時排除；用文件示例位址／ASN，列明原圖映射；與資料封包方向分開。 |
| BGP 安全 | section-7 | route hijacking、錯誤宣告、前綴過濾與 RPKI；來源授權不保證完整 AS_PATH 正確。 |
| 八、Telnet | section-8-sub-1／telnet | 遠端命令列、TCP 23、觀察能力條件下的明文風險與 SSH；原圖 guest 歡迎畫面與僅見提示分開，合成示意不連真實主機。 |
| 八、TFTP | section-8-sub-2／tftp | 已知設定檔名、UDP 69 初始／後續選定 UDP 埠、無登入／無目錄瀏覽、來源／路徑／檔案權限與任意讀寫界線。 |
| 九、七協定表 | section-9 | 原表七列三欄及常見值界線，補明 SIP 5060 為 UDP／TCP、5061 為 TLS over TCP。 |
| 十、報告 | section-10／report | 授權 VPN 情境、原不良推論引句、為何證據不足；實際觀察／證據界線／下一步驗證三欄逐字採用；四類風險判斷。 |
| 十一、四題 | section-11-sub-1–4 | 完整採用本次 A／B／C 選項與順序，第四題為 TFTP；正解 B／B／C／B，非前版 B／C／B／C。解析分別指出各錯項問題。 |
| 批改介面與結尾 | section-11 末 | 供稿「提交答案並請你批改」改為原生參考解析；不新增無後端送出或虛構學習狀態。保留三個判讀問題及銜接 M05／滲透／稽核的目的。 |

兩語逐節保留相同例子、數字、條件、圖意與判讀深度；英文為完整譯文。Telnet／TFTP 兩個原文小標提升為既有 h3 契約，Stratum 與四題亦用 h3；表格、命令與參考答案使用既有受限區塊。

## 十張參考圖

| 附件 | 圖解模型 | 關係、保留及差異 |
| --- | --- | --- |
| image-1.png | roles | 六組平行角色、雙欄轉單欄，原有標籤與用途保留；沿站內低彩度卡片，不重製原圖的小裝飾圖示。 |
| image-2.png | stages | M03 → M04 → M05 三欄、問題與比喻；手機箭頭轉下，非服務／權限的自動進階。 |
| image-3.png | ntp-network | 參考鐘、分層 2／2／4／5 台、同層對等（含 S3-B／S3-C）、跨層多來源及兩組共用鏈路。以每節點明列來源／peer 端點取代交錯細線；沒有改成十四步流程。 |
| image-4.png | stratum | 0／1／2／3、4… 四層，向下來源方向；卡片等寬，未仿造逐層收窄，文字可換行。 |
| image-5.png | ike | 三角色、三項協商／驗證工作與非第三固定交換的限制。第一組 CHILD_SA 通常於 IKE_AUTH 協商。 |
| image-6.png | sip | 兩列、兩種雙向資料交換、起訖端點與各自保護條件；不畫成先 SIP 再 RTP 的單一路徑。 |
| image-7.png | bgp | 四個 AS 菱形及公告繞回來源的方向；AS10／20／30／40 依序換為 AS64500／64497／64496／64498；192.168.1.0/24 改 192.0.2.0/24。AS_PATH 同步映射，明示來源排除含自己 ASN 的路由。手機保留節點原順序、逐節點起訖與路徑文字，未縮小整張圖。 |
| image-8.png | telnet | 保留登入提示、guest 登入、歡迎畫面的狀態差異。使用合成 training terminal，不重刊真實主機名、舊 PuTTY 裝飾或暗示可連線；歡迎文字也不證明任意權限。 |
| image-9.png | tftp | 用戶端／伺服器、雙向請求與資料交換；補 UDP 69 初始、後續 TID 與讀寫政策。省略裝飾文件圖示，避免把多張文件誤教成可列目錄或任意批次取檔。 |
| image-10.png | report | 三個報告欄位、完整原句；手機及桌面均保留由上到下順序，不附完成徽章。 |

五層 ladder 是正文的補充圖，並非未提供的第十一張附件。共十一組圖解／二十二張 SVG，由同一 `diagrams.json` 產生 HTML 文字、搜尋及下載；保留前版十八張 SVG URL，新的使用 `v1-1-0`。資料只允許已知圖名、固定節點數與 cards／flow；SVG 使用既有 sanitizer。BGP 空間線為程式固定幾何，不收任意內容座標或標記。

## 技術查核與編輯決定

2026-11-07 重新開啟第一手來源，不沿用首版的查核結果當本版證據：

- [RFC 4271 §5.1.2、§9.1.2](https://www.rfc-editor.org/rfc/rfc4271.html)：外部公告前置自己的 ASN；接收路徑含自身 ASN 的路由排除，供圖 7 迴圈解釋。這是一般簡化情境，沒有涵蓋全部政策、confederation 或特殊設定。
- [RFC 5398](https://www.rfc-editor.org/rfc/rfc5398.html)及 [RFC 5737](https://www.rfc-editor.org/rfc/rfc5737.html)：圖中改用文件示例 ASN／IPv4 前綴；原圖編號、位址與映射分開保存。
- [RFC 5905](https://www.rfc-editor.org/rfc/rfc5905.html)：時間來源／選擇與同步層級；圖中的參考鐘 Stratum 0 是層級慣例，與收到封包欄位為 0 的未指定／無效意義分開。
- [RFC 7296](https://www.rfc-editor.org/rfc/rfc7296.html)：IKE_SA_INIT、IKE_AUTH 與第一組 Child SA；保留來源明示的「資料通道驗證不是第三個固定交換」。
- [RFC 3261](https://www.rfc-editor.org/rfc/rfc3261.html)及 [RFC 3711](https://www.rfc-editor.org/rfc/rfc3711.html)：SIP 訊令及 SRTP 媒體保護分開；不憑 5061 斷言媒體加密。
- [RFC 4861](https://www.rfc-editor.org/rfc/rfc4861.html)、[RFC 4890](https://www.rfc-editor.org/rfc/rfc4890.html)及 [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html)：ND、必要 ICMPv6 及本機鄰居表讀取，沒有採樣真實網路。
- [RFC 1350](https://www.rfc-editor.org/rfc/rfc1350.html)：TFTP 不提供目錄列示與使用者驗證；69 是初始目的 TID，後續交換使用選定 TID。
- [RFC 6811](https://www.rfc-editor.org/rfc/rfc6811.html)：路由來源授權驗證的範圍，不擴大成整條 AS_PATH 正確的證明。

本次沒有啟動 VPN、BGP、Telnet、TFTP 或 ASR 等真實實驗，也沒有記錄本人作答；網頁與圖解驗證只證明教材呈現與內容發布。
