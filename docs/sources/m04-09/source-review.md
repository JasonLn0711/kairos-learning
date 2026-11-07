# M04-09 供稿採用與技術查核

查核／修訂日 2026-11-07（Asia/Taipei）。正本、原圖保管與 SHA-256 見 [來源入口](README.md)。原稿文字未改寫；成稿依下表抽換正式 `sourceBody`，英文逐節對應。原稿的三個 `images.openai.com` 圖片代理連結保留在原稿，正式正文改用本地生成圖，沒有把外部圖片嵌入執行通道。

## 逐章與小節對照

| 供稿單位 | 成稿錨點（兩語相同） | 保留內容及採用處理 |
| --- | --- | --- |
| 開場 | 正文開頭 | 回應、登入、控制的核心引句；服務用途與證據強度。 |
| 一、大樓比喻 | section-1 | 六組角色比喻與解釋；Telnet／TFTP 是兩個協定，後文總計七組；問時間不等於取得門禁卡。 |
| 二、五層證據 | section-2 | 服務、回應、資訊、身分、權限五項原文轉入 ladder 圖；模型非所有協定的固定順序；四個不等式完整保留。 |
| 三、NTP | section-3 | 學校標準鐘、同一事件的三個日誌時間與表格、調查順序、驗證與協作、UDP 123。 |
| Stratum 是什麼 | section-3-sub-1 | 0／1／2 說明轉入 stratum 圖；Stratum 2 不能保證準確、安全或所有上游；正常對時與管理資訊分開。依圖 3 新增 1–4 層的多來源、同層對等與來源選擇說明。 |
| 四、IPsec／IKE | section-4 | 在家連公司情境、角色路徑、初始協商／身分驗證／資料通道及政策、錯誤推論例句、有限資源權限、四列編號表與 IP Protocol 50／51 不是 port 的區別。IKEv2 細節補正見下節。 |
| 五、VoIP／SIP | section-5 | 企業電話例子、找人響鈴接通與持續語音的兩步說明、SIP/RTP 圖、保密信封比喻、TLS/SRTP/金鑰及實際連線、5060/5061、能力回應不等於帳號或撥號權限。 |
| 六、IPv6 | section-6 | 128 bits 與 fe80::1234:abcd:5678:9abc 原例。 |
| Neighbor Discovery | section-6-sub-1 | 社區比喻；NS、NA、RS、RA 四項；ICMPv6 不是 TCP/UDP 埠。 |
| 鄰居清單 | section-6-sub-2 | 本機路由器與鄰居兩筆改為表格；可以／不能下的結論；未通訊、過期、不同鏈路與多位址四個原因；ND 與 Path MTU 所需 ICMPv6。 |
| 七、BGP | section-7 | 臺灣到美國物流比喻、AS／ASN／前綴與 TCP 179；五 AS 拓樸與兩候選路徑圖放在此節。 |
| AS_PATH | section-7-sub-1 | AS 64500 → AS 64497 → AS 64496、文件示例範圍、不是實體路由器清單／完整內網、Looking Glass 的觀測點與管理權限、前綴過濾／鄰居控制／RPKI 與來源驗證界線。 |
| 八、Telnet／TFTP | section-8 | 兩段全文逐句放入 legacy 圖中的可選取段落，保留 TCP 23、SSH、登入入口、UDP 69 起始／後續 TID、已知檔名、無登入與目錄瀏覽、來源／檔案權限及任意讀寫界線。 |
| 九、統整表 | section-9 | 七列與四欄全部保留；補明 SIP 傳輸層；常見埠不等於確認協定。 |
| 十、查核應用 | section-10 | CEH Enumeration 用途、工具輸出不等於漏洞、IKE 合成觀察三種證據狀態、報告三步、NTP 正常功能與政策／管理曝光／服務可用性判讀。 |
| 十一、檢核 | section-11；section-11-sub-1–4 | 四題原來 A/B/C 選項與順序保留；鍵值 B/C/B/C。新增逐項錯因與答案於 answer-m0409-1–4。供稿的「0/4 已作答」「提交答案並查看解析」是介面文字；沿用既有原生參考答案，不宣稱儲存作答或已完成學習。 |
| 結尾 | section-11 末 | 有限回應、範圍清楚的判斷與接續 M04-10；C10 保留待發布閘門。 |

## 實質補正與第一手來源

- **IKEv2 名稱及 CHILD_SA**：保留原稿三種判讀工作，將「階段 1／2／3」改成交換名稱與驗證工作。第一組 CHILD_SA 通常於 IKE_AUTH 協商；IKE SA 成功不保證 Child SA 或配置成功。參考 [RFC 7296 §1.2、§2.21.2](https://www.rfc-editor.org/rfc/rfc7296.html)、[IPsec 架構 RFC 4301](https://www.rfc-editor.org/rfc/rfc4301.html)。沒有擴張成 IKEv1 教學或實際 VPN 測試。
- **SIP 埠與兩條流程**：原稿 5060／5061 補成常見 UDP／TCP 5060、TLS over TCP 5061。SIP 訊令與媒體路徑可不同；不由埠號推斷加密，也不把 TLS 推成語音保護。參考 [RFC 3261 §18](https://www.rfc-editor.org/rfc/rfc3261.html)、[RTP RFC 3550](https://www.rfc-editor.org/rfc/rfc3550.html)、[SRTP RFC 3711](https://www.rfc-editor.org/rfc/rfc3711.html)。
- **NTP 多層圖**：原稿 0–2 層保留；依附件延伸至 4 層並明示候選來源、同層對等、實際來源選擇及不保證準確性的界線。參考 [RFC 5905 §3](https://www.rfc-editor.org/rfc/rfc5905.html)。圖的配線為教學示意，沒有宣稱實際測量。
- **BGP 示例與路徑**：原文 AS_PATH 已使用文件示例範圍；圖 1 的 AS100／200／400／500／600 依序換成 AS64500／64497／64498／64499／64496，保留五個 peer 關係、雙上游、transit、stub 與來源／目的地。原圖 Best Path 改成「本例選定」，因選路要看政策及屬性。參考 [BGP RFC 4271](https://www.rfc-editor.org/rfc/rfc4271.html)、[ASN 文件範圍 RFC 5398](https://www.rfc-editor.org/rfc/rfc5398.html)、[來源驗證 RFC 6811](https://www.rfc-editor.org/rfc/rfc6811.html)。
- **其餘核對**：[IPv6 位址 RFC 4291](https://www.rfc-editor.org/rfc/rfc4291.html)、[ND RFC 4861](https://www.rfc-editor.org/rfc/rfc4861.html)、[ICMPv6 過濾 RFC 4890](https://www.rfc-editor.org/rfc/rfc4890.html)、[Telnet RFC 854](https://www.rfc-editor.org/rfc/rfc854.html)、[TFTP RFC 1350](https://www.rfc-editor.org/rfc/rfc1350.html)、[SSH 架構 RFC 4251](https://www.rfc-editor.org/rfc/rfc4251.html)。尤其 TFTP 的 69 僅為初始目的 TID；後續使用雙方選定的 TID。這些查核支持教材概念，不表示特定服務設定已受測。

## 九張附件的設計對照

| 附件 | 本地圖解 | 關係與差異 |
| --- | --- | --- |
| image-1.png | bgp | 保留五 AS 與五個 peer 關係；來源與目的地主機以相應 AS 卡片文字標出，省略裝飾路由器與品牌圖樣。手機以明列端點的文字承接網路關係，卡片順序不表示新連線。 |
| image-2.png | ladder | 五層、順序及門口比喻；箭頭解釋成證據強度，不是登入成功的自動進程。 |
| image-3.png | ntp-network | 保留參考鐘、1／2／3／4 層的 2／2／4／5 台平行節點及對等／多上游／共用鏈路；密集交錯線以層間箭頭和每節點上游／peer 端點文字表示，避免縮到手機看不清。 |
| image-4.png | stratum | 三層小圖直接放在 Stratum 解釋旁，保留 0、1、2 的原定義。 |
| image-5.png | ike | 三個角色與協商／認證／可用性三種工作；補正成 IKEv2 交換與驗證，不畫成三個固定交換。 |
| image-6.png | sip | 保留兩列雙向交換與訊令／聲音分工，新增各自保護條件；沒有把兩列接成順序流程。 |
| image-7.png | legacy | 原有兩張卡片全文保留，直接可閱讀。 |
| image-8.png | case | 合成觀察、可以確認、不能確認、需要補證全部保留；用文字標籤，不只靠紅綠色。 |
| image-9.png | report | 實際觀察 → 證據界線 → 補充驗證；桌面三欄、手機直向，箭頭隨節點轉向。 |

所有圖使用同一 `diagrams.json` 文字生成 HTML 內容及受審核 SVG。只接受九個已知圖名、固定節點數與 flow/cards 語意；任意標記由 Svelte 跳脫，SVG 延用嚴格 serializer。下載圖維持固定版面，網頁文字則容器重排。這次沒有新增框架、套件、網路掃描或模擬實驗。
