# CEH M04-09｜七種網路協定與列舉：白話文完整教學

這一課看起來要學 NTP、IPsec、VoIP、IPv6、BGP、Telnet、TFTP 七種技術，好像很複雜。但其實有一個共同的觀念：

你能從網路服務取得資訊，不代表你能登入它；能登入，也不代表你有權限控制它。

這就是 CEH M04「Enumeration（列舉）」最重要的觀念。接下來把這七種技術放進同一個故事，理解它們在網路工程中的角色，以及資安人員應該如何判斷證據。

依據 [CS Kairos M04-09 正式教材](https://learn.cs-kairos.com/courses/ceh/v13/m04/concepts/m04-09/?utm_source=chatgpt.com)（2026/11/7，v1.0.0）整理，補充初學者需要的網路基礎。

## 一、先把網路想成一棟辦公大樓

假設你管理一棟擁有 500 位員工的大樓，裡面有電腦、電話、門禁、網路設備與伺服器。

NTP｜標準時鐘

讓全部設備的時間一致

IPsec／IKE｜安全通道

保護遠端連線與傳輸

VoIP／SIP｜電話總機

協助撥號、接聽與傳送語音

IPv6｜地址與鄰居

識別設備與發現路由器

BGP｜跨網路導航

讓不同大型網路交換路線

Telnet／TFTP｜舊式管理室

遠端終端機與簡易檔案傳輸

它們的功能不同，所以我們不能用同一套判斷方法，把所有回應都認定為安全漏洞。

## 二、CEH 列舉到底在做什麼？

把 CEH 的 M03、M04、M05 串起來：

M03｜Scanning

找到大樓入口

有哪些主機與服務？

M04｜Enumeration

詢問櫃檯資訊

服務願意提供什麼？

M05｜Vulnerability

分析保護弱點

是否存在可證實的風險？

你掃描到某個 Port 開啟，只能說那裡可能有服務；你取得服務資訊，也不能立刻說它有漏洞。

教材提供了五個證據層次：

1. 發現服務：找到一個可能提供服務的入口。
2. 取得回應：對方真的回應你的請求。
3. 取得資訊：對方揭露部分版本、設定或狀態。
4. 驗證身分：對方確認你是誰（部分服務不需要這個步驟）。
5. 驗證操作權限：確認你真正能讀取、修改或執行什麼。

這是證據強度的分析框架，不是所有協定都必須走過的固定流程。

## 三、NTP：為什麼時間一致關係到資安？

[What is an NTP (Network Time Protocol) Server?](https://images.openai.com/static-rsc-4/EOByAdxNolE5UfYjW9BXpP57vXB4qWhy_xLa3yxu3BzjvhevPQC7vl7Mrmgs8en2wj4Lxu75bIDmTdDZfw0F6aOAZM_PkYanyja1NYdURF8e2KjkmDPOq-Ix_ga3tew5puQ-cnmJ5hYGimePJEKxUOPveLG39mE3p1L0dcQARvE?purpose=inline)

NTP（Network Time Protocol）

想像警察在調查一個案件，三支監視器的時間各差了幾分鐘。

即使三支監視器都錄到了影像，你仍然可能把事件發生順序弄錯。

電腦也一樣。假設有三台設備記錄同一個入侵事件：

| 設備    | 記錄時間     |
| ----- | -------- |
| 防火牆   | 10:00:02 |
| 網頁伺服器 | 09:57:12 |
| 資料庫   | 10:03:30 |

如果沒有時間同步，資安調查很可能出現錯誤結論。

NTP 使用常見的 UDP 123 連接埠，讓設備向時間來源同步。

### Stratum 又是什麼？

它代表時間同步來源的階層。

Stratum 0

原子鐘、GNSS 等參考時鐘

Stratum 1

直接連接參考時鐘的 NTP 伺服器

Stratum 2

從上游 NTP 伺服器同步

Stratum 3、4…

要注意：Stratum 數字較小，不等於一定比較準確。同步狀態、來源品質與網路延遲也很重要。

從 CEH 的角度，假設 NTP 回答你現在是 10:00，這代表時間服務正常回應；不代表你能讀取它的管理設定，更不代表可以修改時間伺服器。

## 四、IPsec／IKE：VPN 為什麼不是連上就能進去？

想像你在家工作，希望連到公司的內部系統。

VPN 可以提供安全的網路通道，其中 IPsec 是常見的保護技術，而 IKE（Internet Key Exchange）負責協商保護方式與驗證身分。

你的電腦

VPN 閘道

公司內網

IKE_SA_INIT

先協商加密保護方式

IKE_AUTH

驗證雙方身分

資料通道驗證

確認可存取哪些資源

以 IKEv2 為例；最後一項是後續連線驗證，不是第三個固定的 IKE 訊息交換。

假設你收到 `IKE_SA_INIT` 的回覆。

你可以說 VPN 服務回應了初始協商，但不能說自己已經登入 VPN。因為還沒有確認身分驗證成功，更沒有確認內部資源的存取權限。

[image](https://www.google.com/s2/favicons?domain=https://www.rfc-editor.org\&sz=32)

RFC Editor+1



還有一個很容易考錯的地方：

| 編號             | 用途               |
| -------------- | ---------------- |
| UDP 500        | IKE 協商           |
| UDP 4500       | 常見 NAT Traversal |
| IP Protocol 50 | ESP              |
| IP Protocol 51 | AH               |

IP Protocol 50 不是 Port 50。 Port 是 TCP/UDP 等傳輸協定使用的編號；IP Protocol Number 是 IP 封包表明承載哪一種上層協定的編號。

## 五、VoIP：為什麼電話已加密，聲音卻可能被聽到？

這個觀念非常重要，尤其是電話服務、客服中心或電話錄音系統。

VoIP 是透過 IP 網路傳送電話服務。裡面有兩件不同的工作：

SIP：控制通話

訊令 Signaling

撥打方

撥號、響鈴、接通

接聽方

TLS 可保護 SIP 訊令的特定傳輸區段。

RTP：傳送聲音

媒體 Media

聲音輸入

語音封包

聲音輸出

媒體需要另外確認 SRTP 等保護及金鑰協商。

簡單來說：

SIP 像電話總機，RTP 像真正講話的聲音。

假設 SIP 已經使用 TLS 加密，但是語音媒體仍使用沒有加密的一般 RTP，那麼在能觀察媒體封包的網路位置，聲音仍有被還原的風險。

所以做 CEH 查核時，不能因為看到 TCP 5061（常見 SIP over TLS）就宣布「整套電話系統已加密」。

應分開確認 SIP 訊令、RTP/SRTP 媒體、金鑰交換及存取控制。

[image](https://www.google.com/s2/favicons?domain=https://learn.cs-kairos.com\&sz=32)

CS Kairos Learn



## 六、IPv6：為什麼電腦看到的鄰居不代表全部設備？

IPv6 使用 128-bit 位址，例如：

`fe80::1234:abcd:5678:9abc`

其中 `fe80::/10` 是 Link-Local 位址範圍，主要用於本地鏈路通訊。

IPv6 有一套稱為 Neighbor Discovery（ND）的機制，可把它想成大樓內尋找鄰居及詢問路由器的方式。

| 訊息 | 白話意思                |
| -- | ------------------- |
| NS | 請問某個 IPv6 位址的鄰居在哪裡？ |
| NA | 我來回覆或公告鄰居資訊         |
| RS | 請問附近有哪些路由器？         |
| RA | 路由器提供網路設定資訊         |

它們使用 ICMPv6，而不是 TCP/UDP Port。

假設你的電腦在鄰居表中只看到兩筆紀錄。這只代表目前有兩筆快取，並不表示整個區域只有兩台設備。

有些設備可能尚未與你通訊、快取已經過期，或者同一台設備有多個 IPv6 位址。

在 Ubuntu 上，可以安全查看自己電腦的鄰居快取：

```
ip -6 neigh show
```

這個指令主要是在讀本機核心保留的資訊，不是在掃描整個網路。

另外，不要認為封鎖全部 ICMPv6 就更安全。IPv6 的鄰居探索、路徑 MTU 探索等機制依賴特定 ICMPv6 訊息，全部封鎖反而可能導致連線故障。

## 七、BGP：網際網路為什麼知道資料該往哪裡走？

[Border Gateway Protocol (BGP) Routing Overview - Study CCNP](https://images.openai.com/static-rsc-4/IcEpgIl1PvP9MvQdssFlIvWPWUpZxLvIMDc4AFF431QxJJ78ZJSWG-uKSZqYFOw6zG-mq0bDRmJ_6K33UGu1NWdFrrhYIN3nHnn1WL27zzsm8SmI8qaM5CmiTWD3uGhjDKakl6g8GV9Yn85vZDGnnenMys_jVdsAwB6FWj6SE38?purpose=inline)

想像你要從台灣寄包裹到美國。

台灣物流公司不必知道美國每條街道，但要知道接下來應把包裹交給哪一家物流網路。

BGP（Border Gateway Protocol）就像各大型網路之間交換運送路線的機制。

這裡會碰到兩個詞：

AS（Autonomous System，自治系統） 是由共同路由政策管理的一組 IP 網路；ASN 則是該自治系統的編號。

例如教材中的假想路徑：

`AS64500 → AS64497 → AS64496`

代表某份路由資訊中的 AS 路徑，但不等於封包一定經過你想像中的那些實體路由器。

BGP 常見 TCP 179。透過公開的 Looking Glass，你可能查到某個觀測點看到的 BGP 路由。

然而，你看到路由資料，不代表你有權更改路由。這就是「資訊可見」和「管理授權」的差別。

在資安上，BGP 還涉及 Route Hijacking（路由劫持）、錯誤路由宣告、前綴過濾與 RPKI。RPKI 可以協助驗證某來源 AS 是否被授權宣告特定 IP 前綴，但不能單靠它保證整條 AS_PATH 都正確。

## 八、Telnet、TFTP：為什麼老技術容易產生安全疑慮？

[Telnet | PPTX](https://images.openai.com/static-rsc-4/pGvqRNEzeLGwwxI-TYrpmboUERF2MHV1x3Mj7oVCdBDz1_gdCZBU2gw3hggvsVKgo5yqZiioBuBgeoOAgLXhX5oNVs-fuVCFEz6O9UfPUD7CSxJ7Qbb2vHvtvgMm-CrxqiB6YQSn5AQlgdcs0AGLqxBYrTh16mxKmrnUnAgzWCI?purpose=inline)

Telnet｜遠端文字終端機

想像在自己的電腦上操作另一台電腦的命令列。傳統 Telnet 常見 TCP 23，沒有提供現代所需的傳輸加密，帳號、密碼及指令可能被沿途具有封包觀察能力的人看見。

現代遠端管理通常優先使用 SSH。

[File transfer from server to laptop](https://images.openai.com/static-rsc-4/Cn6Jkn_zvGcsXHNGKidwNwd4INSwIGIzHkpLrUt49sZGXjQVKEUkc4axx1AcdOd6wbjWT_Ml5NIaZrHub1gwnOQLddpYs3ZmO5kFerd9KyTgV1JrhPKYb9RSoV6UmqG4QV6jZiGz8KNpCGnpjeFmUfOeLTXnawTmJGj3JBF7bRmmis0CwefMFkscgYoX8djL?purpose=inline)

TFTP｜簡易檔案傳輸

想像設備知道某份設定檔的檔名，就向伺服器要求傳送。TFTP 常見使用 UDP 69 接收初始請求，之後使用另外選定的 UDP 埠傳輸資料。

基本 TFTP 沒有標準的使用者登入機制，也沒有一般的目錄瀏覽功能。

重點在於：TFTP 沒有登入畫面，不代表所有檔案都可以讀寫。伺服器仍可藉由來源、路徑和檔案權限限制存取。

同樣地，看到 Telnet 登入畫面，也不代表已經取得遠端終端機權限。

## 九、七種協定的 CEH 重點總整理

| 協定        | 常見編號         | 判讀重點           |
| --------- | ------------ | -------------- |
| NTP       | UDP 123      | 時間回應不等於管理權限    |
| IPsec／IKE | UDP 500、4500 | 協商回應不等於 VPN 登入 |
| SIP       | 5060、5061    | 訊令加密不等於語音加密    |
| IPv6／ND   | ICMPv6       | 鄰居快取不是完整資產清單   |
| BGP       | TCP 179      | 看到路由不等於可修改路由   |
| Telnet    | TCP 23       | 登入提示不等於登入成功    |
| TFTP      | UDP 69 起始    | 檔案服務存在不等於可任意讀寫 |

這些是常見值，不是不可改變的規則；發現某個 Port，仍要確認實際提供的服務。

## 十、真正做 CEH 查核時，如何寫出專業的判斷？

假設你在經過授權的測試環境中，發現一台 VPN 伺服器會回應 `IKE_SA_INIT`。

不好的報告會寫：

> 已發現 VPN 弱點，攻擊者可能進入內網。

因為這份結論沒有足夠證據。

比較專業的紀錄方式如下：

實際觀察

測試端點對 IKEv2 初始協商提供有效回應。

證據界線

可證明服務回應，但尚無身分驗證成功或內網資源存取的證據。

下一步驗證

在授權範圍內，使用核准的測試帳號確認 VPN 驗證、通道建立及存取控制是否符合政策。

這樣才能分清楚四件事：正常服務、資訊揭露、錯誤設定，以及真正具有安全影響的弱點。

## 十一、理解檢核：你能不能像 CEH 分析人員一樣判斷？

1\. 某台 VPN 伺服器回覆 IKE_SA_INIT，你會如何判斷？

A. 已成功登入 VPN

B. 只確認初始協商有回應

C. 已取得公司內網權限

2\. SIP 已使用 TLS，是否足以證明通話聲音已加密？

A. 是，所有語音都會加密

B. 否，還需要驗證媒體傳輸的保護

C. 是，只要使用 5061 即可

3\. 你的 IPv6 鄰居表只有兩筆資料，代表什麼？

A. 整個網路只有兩台設備

B. 其他設備一定被隱藏

C. 本機目前有兩筆鄰居快取

4\. 某 TFTP 伺服器可以回應請求，是否代表任何檔案都能下載？

A. 是，因為 TFTP 沒有登入機制

B. 否，還受到伺服器設定及檔案權限限制

C. 是，而且可以任意修改檔案

提交答案並請你批改

這一課最值得建立的能力，不是死背七個協定的 Port，而是面對任何新的網路服務，都能回答三個問題：我實際看到了什麼？這能證明什麼？還需要哪些證據才能做出安全結論？

掌握這三個問題，後續學 CEH M05 弱點分析、滲透測試及資安稽核時，才能避免把服務的正常功能誤認為漏洞。