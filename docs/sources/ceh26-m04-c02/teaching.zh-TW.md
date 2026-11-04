# CEH M04-02｜DNS 列舉（DNS Enumeration）完整白話文教學

**這堂課最重要的觀念：DNS 告訴你「某個名稱對應哪些資料」，但不代表該主機存在、服務正常，更不代表你有權限存取它。**


## 一、先建立整體觀念：DNS 在資安調查中扮演什麼角色？

我們先回想前面學過的 CEH 課程。

| CEH 章節 | 主要任務 | 白話文 |
|---|---|---|
| M02 足跡蒐集 | Reconnaissance | 先了解目標可能有哪些公開資訊 |
| M03 網路掃描 | Scanning | 確認哪些主機、Port、服務可能存在 |
| M04 列舉 | Enumeration | 向特定服務詢問更具體的資訊 |
| M05 弱點分析 | Vulnerability Analysis | 判斷已發現的系統是否存在弱點 |

例如，假設你是公司的資安工程師。

你知道公司有一個網站：

`www.example.com`

但你不知道這個網站背後使用什麼設備、郵件服務由誰處理、哪些伺服器負責 DNS。

這時就可以利用 DNS 查詢取得部分線索。

整個調查的邏輯是：

```text
知道一個網域名稱
       │
       ▼
查詢 DNS 紀錄
       │
       ├── A / AAAA → 可能的 IP 位址
       │
       ├── MX       → 郵件接收服務的設定
       │
       ├── NS       → 權威名稱伺服器
       │
       ├── CNAME    → 名稱之間的別名關係
       │
       └── TXT      → 網域政策與驗證資訊
       │
       ▼
整理出可能的系統與服務線索
       │
       ▼
依授權範圍進一步確認
       │
       ├── 主機是否可連線？
       ├── Port 是否開放？
       ├── TLS 憑證是否有效？
       ├── HTTP 服務是否正常？
       └── 是否存在安全弱點？
```

**DNS 查詢是蒐集證據的其中一個步驟，不是完成整套資安檢測。**

---

# 第一章｜DNS 比較像通訊錄，不是網站的健康檢查

## 1.1 DNS 到底是什麼？

DNS（Domain Name System）稱為「網域名稱系統」。

你可以把 DNS 想像成電話通訊錄。

以前我們要打電話給某個人，可能需要查詢：

「王先生的電話號碼是多少？」

現在我們要連線到網站，電腦需要知道：

「這個網站名稱對應什麼 IP 位址？」

例如：

```text
你輸入：
www.example.com

        ↓

DNS 查詢

        ↓

得到：
93.184.215.14
```

以上 IP 僅用來說明名稱解析的形式，不代表該網站目前一定使用這個位址。

我們可以把它理解成：

- Domain Name：容易讓人記住的名稱。
- IP Address：網路通訊需要使用的位址。
- DNS：提供名稱與相關資料的查詢系統。

但 DNS 不只是名稱轉 IP，還能提供郵件、名稱伺服器及其他服務設定資訊。

## 1.2 查到 IP，為什麼不代表網站正常？

假設 DNS 回答：

```text
www.example.test → 192.0.2.10
www.example.test → 192.0.2.11
```

你可能直覺認為：

「很好！這個網站有兩台伺服器，而且都正在運作。」

這個推論並不正確。

DNS 回覆只能表示：**這次查詢取得兩筆 IPv4 位址紀錄。**

它不能證明：

1. 兩個 IP 都能連線。
2. 兩個 IP 都有提供網頁服務。
3. 網站目前運作正常。
4. 背後真的有兩台實體電腦。
5. 這兩個 IP 一定是公司的原始伺服器。

### 實際例子：Cloudflare CDN

假設公司使用 Cloudflare 保護網站。

```text
使用者
   │
   │ 查詢 www.company.com
   ▼
DNS 回傳 Cloudflare 的 IP
   │
   ▼
Cloudflare 邊緣節點
   │
   │ 根據設定代理請求
   ▼
公司原始伺服器（Origin Server）
```

你從 DNS 查到的 IP，可能是 Cloudflare 的節點，而不是公司真正存放網站的伺服器。

而且，CDN 背後可能使用 Anycast（任播）等技術，讓不同地點的使用者透過相同 IP，到達不同的服務節點。

因此：

**DNS 的兩個 IP ≠ 兩台實體主機。**

### 1.3 和 M03 網路掃描有什麼關係？

這裡可以連接你之前學過的 M03-03 Port Scanning。

假設：

```text
第一階段：DNS
www.example.test → 192.0.2.10

第二階段：TCP 探測
192.0.2.10:443 → 有服務回應

第三階段：HTTPS
TLS 交握成功

第四階段：HTTP
GET / → HTTP 200
```

每一階段都提供不同的證據。

| 觀察 | 可以合理判斷 | 不可以直接判斷 |
|---|---|---|
| 查到 A 紀錄 | DNS 提供了 IPv4 位址 | 主機正常運作 |
| TCP 443 連線成功 | 目標 Port 可建立 TCP 連線 | 一定是 HTTPS |
| TLS 交握成功 | 可以建立 TLS 安全通道 | 網頁功能都正常 |
| HTTP 200 | 某次 HTTP 請求得到成功狀態碼 | 整套網站都沒有問題 |

這種分層驗證的思考方式，在資安調查中特別重要。

---

# 第二章｜你問的 DNS 伺服器，不一定就是保管答案的人

這一章是在解釋 DNS 背後的架構。

## 2.1 DNS 裡面有三個重要角色

假設你想知道：

`www.example.com` 的 IP 是什麼？

整個系統可以分成三個角色。

**角色一：Stub Resolver（用戶端解析器）**

這是你電腦上的 DNS 查詢元件。

例如，你打開 Firefox，輸入網址，系統需要解析網域名稱。

如果使用系統 DNS，這個查詢通常會透過電腦的解析服務送出。

但某些瀏覽器也可能使用自己的 DNS over HTTPS 設定，不完全依照系統解析器。

**角色二：Recursive Resolver（遞迴解析器）**

它的工作是幫你找到答案。

你可以把它想成公司櫃檯。

你問櫃檯：「請問王先生在哪個部門？」

櫃檯如果知道，就直接回答。

如果不知道，它會向其他單位詢問，再把結果告訴你。

常見的公共遞迴解析服務包括：

- Cloudflare DNS：`1.1.1.1`
- Google Public DNS：`8.8.8.8`

**角色三：Authoritative Name Server（權威名稱伺服器）**

這個角色比較像公司的正式資料管理單位。

它負責維護特定 DNS 區域的權威紀錄。

例如：

```text
example.com 區域：

www.example.com    A     192.0.2.10
mail.example.com   A     192.0.2.20
example.com        MX    10 mail.example.com
```

以上為示意資料。

權威伺服器可以提供這些正式設定，但它不負責證明各服務目前是否正常運作。

## 2.2 DNS 查詢是怎麼找到答案的？

先用一個概念流程理解：

```text
┌──────────────────────┐
│  你的電腦 / 瀏覽器   │
│  我要查 www.example.com │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Recursive Resolver │
│   遞迴解析器         │
└──────────┬───────────┘
           │
           ├── 有快取？
           │      └── 有 → 直接回覆
           │
           └── 沒有快取
                  │
                  ▼
             Root DNS
             根名稱伺服器
                  │
                  ▼
             .com DNS
             頂級網域伺服器
                  │
                  ▼
             example.com
             權威名稱伺服器
                  │
                  ▼
             取得所需紀錄
                  │
                  ▼
             遞迴解析器
                  │
                  ▼
               你的電腦
```

這是典型的概念模型。

實際上，解析器可能已經有快取，也可能使用轉送器（Forwarder），所以不一定每次都從根名稱伺服器開始查。

### 2.3 Domain 和 Zone 有什麼不同？

這兩個詞很容易搞混。

**Domain（網域）**：DNS 名稱空間的一部分。

例如：

```text
example.com
    │
    ├── www.example.com
    ├── mail.example.com
    └── research.example.com
```

**Zone（DNS 區域）**：由特定權威 DNS 管理的一組 DNS 資料。

例如：

公司總部管理：

`example.com`

但是研究部門有自己的 DNS 管理團隊，於是把：

`research.example.com`

委派（Delegation）給另一組權威 DNS。

這表示兩個名稱雖然存在上下層關係，卻可以分別由不同的 DNS 區域管理。

重要結論：

**你取得 example.com 某個 Zone 的資料，不代表你取得公司所有子網域的完整資料。**

---

# 第三章｜DNS 列舉在問什麼？先認識常見紀錄

這一章是本課的核心。

DNS 裡面的每一筆資料通常稱為 Resource Record，縮寫 RR（資源紀錄）。

可以把 RR 想成通訊錄裡的不同欄位。

例如：

```text
員工姓名：王先生
聯絡電話：0912-xxx-xxx
Email：wang@example.com
部門：資訊部
職稱：工程師
```

DNS 也有不同的資料類型。

## 3.1 A Record：查詢 IPv4 位址

A 紀錄的用途：

**Domain Name → IPv4 Address**

例如：

```text
www.example.test → 192.0.2.10
```

白話文：

「請告訴我這個名稱設定了哪些 IPv4 位址。」

## 3.2 AAAA Record：查詢 IPv6 位址

AAAA 紀錄的用途：

**Domain Name → IPv6 Address**

例如：

```text
www.example.test → 2001:db8::10
```

其中 `2001:db8::/32` 是保留給文件示例使用的 IPv6 範圍。

為什麼 A 只有一個 A，AAAA 卻有四個 A？

這是 DNS 紀錄類型的正式名稱，不代表要輸入四次指令。

你只需要記得：

```text
A     → IPv4
AAAA  → IPv6
```

注意：查不到 AAAA，不能據此認定這個網域完全沒有 IPv6 相關配置。

## 3.3 CNAME：名稱的別名

CNAME（Canonical Name）可以理解成：

「這個名稱是另一個名稱的別名。」

例如：

```text
www.example.test
        │
        │ CNAME
        ▼
web.example.test
        │
        │ A
        ▼
192.0.2.10
```

假設你想架設網站。

你希望：

`www.example.test`

和某個服務的正式名稱建立關係。

CNAME 就是一種做法。

但要特別注意：

**CNAME 不是 HTTP 301 或 302 Redirect。**

兩者差異：

- CNAME：DNS 名稱解析階段使用的別名關係。
- HTTP Redirect：瀏覽器已經發出 HTTP 請求後，伺服器要求瀏覽器前往另一個 URL。

## 3.4 PTR：反向 DNS 查詢

前面的 A 紀錄是：

```text
名稱 → IP
```

PTR（Pointer Record）常用於：

```text
IP → 名稱
```

例如：

```text
192.0.2.10
      │
      ▼
反向 DNS 查詢
      │
      ▼
web.example.test
```

但 PTR 回傳某個名稱，不代表那台主機一定屬於該名稱所代表的組織。

因為反向 DNS 紀錄通常由管理相應 IP 位址空間的單位配置。

因此，即使正向與反向查詢吻合，也不能單憑這件事完成身分驗證。

## 3.5 NS：誰負責回答這個 DNS 區域的問題？

NS（Name Server）紀錄指出某個 DNS 區域使用哪些權威名稱伺服器。

例如：

```text
example.test NS ns1.example.test
example.test NS ns2.example.test
```

意思是：

「這個 DNS 區域使用 ns1、ns2 作為權威名稱伺服器。」

NS 不是你電腦目前設定使用的遞迴解析器。

這是兩種不同的角色。

## 3.6 SOA：DNS 區域的管理資料

SOA（Start of Authority）紀錄包含 DNS 區域的管理資訊。

例如：

- 主要權威伺服器的名稱。
- 管理聯絡資訊。
- Zone Serial Number（區域序號）。
- 與區域同步相關的計時參數。

你可以把 SOA 想成：

「這份 DNS 區域資料的管理資訊表。」

其中 Serial Number 可以協助判斷區域資料版本。

但它不是：

- 主機開機時間。
- 伺服器存活秒數。
- 網站最後一次更新時間。

## 3.7 MX：郵件寄到哪裡？

MX（Mail Exchanger）是郵件接收服務的重要紀錄。

例如：

```text
example.test MX 10 mail1.example.test
example.test MX 20 mail2.example.test
```

它代表這個網域設定了兩筆郵件交換紀錄。

數字代表偏好優先順序。

通常：

**數字越小，優先順序越高。**

因此：

```text
10 → 較優先
20 → 次優先
```

但這不等於：

```text
10 → 10% 的郵件
20 → 20% 的郵件
```

也不代表 mail1 故障時，mail2 就一定能正常接收所有郵件。

MX 是郵件路由的設定線索，不是郵件系統健康報告。

## 3.8 TXT：網域的文字設定

TXT Record 可以放置文字資料。

常見用途：

- 驗證網域控制權。
- SPF 郵件寄件授權政策。
- DKIM 電子郵件簽章的公開金鑰。
- DMARC 郵件驗證與處理政策。

例如：

```text
example.test TXT "v=spf1 -all"
```

這是一種 SPF 政策表示方式。

`v=spf1` 表示 SPF 版本。

`-all` 表示政策宣告：未由前面機制授權的來源不應被視為合格寄件來源。由於這個例子沒有其他允許來源，實際意義是該網域不授權任何 IP 以它的名稱寄送通過 SPF 驗證的郵件。

但看見 TXT 紀錄，不能直接認定整套郵件防護都已經正確部署。

**TXT 是公開可查詢的資料，不應該拿來存放密碼或機密金鑰。**

## 3.9 SRV：提供服務入口的設定

SRV（Service Record）能描述某種服務的：

- 目標主機。
- Port。
- Priority（優先順序）。
- Weight（權重）。

例如，以下是一個合成的 LDAP 服務設定：

```text
_ldap._tcp.example.test.  IN SRV 0 5 389 ldap01.example.test.
```

可以拆成：

| 欄位 | 意思 |
|---|---|
| `_ldap` | 服務名稱為 LDAP |
| `_tcp` | 使用 TCP |
| `0` | Priority |
| `5` | Weight |
| `389` | 服務 Port |
| `ldap01.example.test` | 目標主機名稱 |

這裡要與 M03-03 連結。

你之前學到 Port 389 常用於 LDAP。

現在你又發現某筆 SRV 紀錄描述 LDAP 的主機與 Port。

你可以說：

「DNS 提供了可能的 LDAP 服務入口資訊。」

但不能直接說：

「LDAP 服務一定正在運作，而且任何人都能登入。」

### 第三章重點整理

| 紀錄 | 主要用途 | 好記的比喻 |
|---|---|---|
| A | IPv4 位址 | 電話號碼 |
| AAAA | IPv6 位址 | 另一種格式的電話號碼 |
| CNAME | 名稱別名 | 同一聯絡人的別名 |
| PTR | 反向名稱查詢 | 依號碼查詢登記名稱 |
| NS | 權威名稱伺服器 | 資料管理單位 |
| SOA | 區域管理資訊 | 資料版本與管理資訊表 |
| MX | 郵件接收路由 | 公司收發室 |
| TXT | 文字設定與政策 | 公開公告欄 |
| SRV | 特定服務入口 | 服務櫃檯的分機及位置 |

不需要一次死背全部。先掌握 A、AAAA、NS、MX，再逐步擴展到其他紀錄。

## DNS 列舉整體架構圖







這張圖把前面三章串在一起：先認識 DNS 查詢的角色，再理解不同紀錄的用途，最後學會區分 DNS 回覆與後續需要驗證的證據。

[[figure:overview]]

---

# 第四章｜先看懂一條 dig 指令

這一章開始進入 Ubuntu 實際操作。

## 4.1 dig 是什麼？

`dig` 全名是 Domain Information Groper。

它是一個 DNS 查詢工具。

你可以把它想成：

「我指定一個 DNS 伺服器，問它某個網域的特定資訊。」

它不會替你確認網站的所有功能是否正常。

## 4.2 拆解一條 dig 指令

教材使用：

```bash
dig @192.0.2.53 www.example.test A
```

其中 `192.0.2.53` 是文件示例位址，並非真正可以直接使用的公共 DNS 服務。

我們拆成四個部分。

| 指令片段 | 意思 | 白話文 |
|---|---|---|
| `dig` | DNS 查詢工具 | 我要查 DNS |
| `@192.0.2.53` | 指定 DNS 伺服器 | 我要問這一台 |
| `www.example.test` | 查詢的名稱 | 我想查這個名稱 |
| `A` | 指定紀錄類型 | 我要它的 IPv4 位址 |

用中文讀整條指令：

**「請向 192.0.2.53 這台 DNS 伺服器，查詢 www.example.test 的 A 紀錄。」**

### 為什麼前面要有 @？

`@` 是 `dig` 指定 DNS 伺服器的語法。

例如：

```bash
dig @1.1.1.1 example.com A
```

意思是：

「向 Cloudflare 的公共 DNS 解析服務，查詢 example.com 的 IPv4 位址。」

如果沒有指定 `@server`：

```bash
dig example.com A
```

`dig` 通常會依照系統 DNS 設定選擇查詢端點。

這也是為什麼兩個人在不同電腦執行相同指令，可能得到不同的結果。[BIND 9 Documentation](https://bind9.readthedocs.io/en/stable/manpages.html)

## 4.3 DNS 使用 UDP 還是 TCP？

還記得 M03-01 的 TCP 和 UDP 嗎？

傳統 DNS 使用：

```text
UDP Port 53
TCP Port 53
```

一般 DNS 查詢經常透過 UDP。

但 TCP 也能處理一般 DNS 查詢。

例如：

- DNS 回覆過大，需要改用 TCP。
- 查詢工具明確指定 TCP。
- DNS 區域傳送（AXFR）使用 TCP。

所以不能認為：

「DNS 的 TCP 53 一定是惡意流量。」

也不能認為：

「DNS 只需要 UDP 53，所以所有 TCP 53 都應該封鎖。」

防火牆政策必須依照伺服器角色與實際需求制定。

另外，DNS over HTTPS（DoH）及 DNS over TLS（DoT）屬於不同的傳輸方式，分別常使用 HTTPS 的 443 埠及 TCP 853 埠，不能直接與傳統 DNS Port 53 混為一談。

## 4.4 在 Ubuntu 上實作

假設你使用 Ubuntu 24.04，可以先安裝 `dig`。

```bash
sudo apt update

sudo apt install dnsutils
```

安裝完成後，執行：

```bash
dig example.com A
```

這是對 IANA 保留的示例網域進行一般公開 DNS 查詢。

接著你可以分別查詢：

```bash
# 查詢 IPv4
dig example.com A

# 查詢 IPv6
dig example.com AAAA

# 查詢郵件接收設定
dig example.com MX

# 查詢權威 DNS
dig example.com NS

# 查詢文字紀錄
dig example.com TXT
```

先不用在意答案有幾筆。

**你現在要練習的是：知道自己問了什麼問題，以及得到的回答究竟能證明什麼。**

---

# 第五章｜讀懂一次回覆：把「答案」與「回答者」分開

這一章是最值得反覆練習的部分。

因為你未來做 DNS 故障排除、資安檢測、伺服器管理，都會遇到這些欄位。

## 5.1 看懂 dig 的回覆

假設我們在授權實驗環境中取得以下合成回覆：

```text
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1

;; QUESTION SECTION:
;www.lab.example.test. IN A

;; ANSWER SECTION:
www.lab.example.test. 120 IN A 192.0.2.50

;; SERVER: 192.0.2.53#53(192.0.2.53) (UDP)
```

這段看起來很複雜，但只要分成四個區域就很好懂。

### 第一個區域：HEADER

```text
status: NOERROR
```

代表這次 DNS 回覆的狀態碼沒有回報 DNS 錯誤。

但它不代表：

- 網站一定存在且正常運作。
- 你取得了所有想查的紀錄。
- 這個主機一定在線。

NOERROR 指的是 DNS 回覆狀態，不是應用程式健康狀態。

### 第二個區域：QUESTION

```text
www.lab.example.test. IN A
```

意思是：

「我剛剛詢問 www.lab.example.test 的 A 紀錄。」

其中：

- `www.lab.example.test.`：查詢名稱。
- `IN`：Internet 類別。
- `A`：IPv4 位址紀錄。

名稱最後的 `.` 代表完整 DNS 名稱的根節點結尾。

例如：

`www.example.com.`

在 DNS 表示法中是一個完整網域名稱（Fully Qualified Domain Name，FQDN）。

### 第三個區域：ANSWER

```text
www.lab.example.test. 120 IN A 192.0.2.50
```

這代表：

DNS 回覆提供了一筆 IPv4 位址紀錄。

其中：

```text
192.0.2.50
```

是回覆的位址資料。

而：

```text
120
```

是 TTL。

### 第四個區域：SERVER

```text
SERVER: 192.0.2.53#53 (UDP)
```

這裡要非常小心！

`SERVER` 代表這次 DNS 查詢的回覆端點。

不是你要連線的網站伺服器。

請看：

```text
DNS 伺服器：
192.0.2.53

        │
        │ 我向它詢問
        ▼

www.lab.example.test 的 IP？

        │
        │ 它回答
        ▼

192.0.2.50
```

兩個 IP 扮演完全不同的角色。

| 欄位 | IP | 角色 |
|---|---|---|
| SERVER | 192.0.2.53 | 本次回答查詢的 DNS 端點 |
| ANSWER | 192.0.2.50 | DNS 回傳的 IPv4 位址資料 |

在真實環境中，這兩個位址可能剛好相同，但仍必須區分角色。

## 5.2 TTL 是什麼？

TTL 全名是 Time To Live。

在 DNS 裡面可以理解成：

**這筆資料允許被快取多久。**

假設：

```text
www.example.test. 300 IN A 192.0.2.10
```

TTL 是 300 秒。

你可以把它想成：

「這筆答案可以暫時存放在 DNS 快取中。」

如果遞迴解析器取得這筆資料，可能在快取有效期間直接回答其他查詢，不需要每次都重新向權威伺服器詢問。

例如：

```text
時間 00:00
取得 DNS 回覆，TTL = 300

時間 01:00
可能仍有快取，剩餘 TTL 約 240

時間 03:00
可能仍有快取，剩餘 TTL 約 120

時間 05:00
原本這筆快取的有效時間屆滿
```

這是簡化示意。真實環境還可能有多層快取、預先更新、Serve-Stale（過期資料暫時服務）等機制。

請記住：

**TTL 不是主機的開機時間，也不保證全世界的 DNS 都會在指定秒數後完全一致。**

## 5.3 qr、rd、ra、aa 是什麼？

這些是 DNS 訊息的旗標（Flags）。

| Flag | 全名 | 白話文 |
|---|---|---|
| `qr` | Query Response | 這是一則回覆 |
| `rd` | Recursion Desired | 查詢方希望使用遞迴解析 |
| `ra` | Recursion Available | 回覆方宣告可以提供遞迴服務 |
| `aa` | Authoritative Answer | 回覆宣告具有權威性 |

其中 `rd` 和 `ra` 最容易搞混。

假設你到公司櫃檯詢問某份資料。

`rd` 就像你說：

「如果你不知道答案，請幫我問其他部門。」

`ra` 則像櫃檯表示：

「我們提供代為查詢的服務。」

但 `ra` 不代表這一次一定真的詢問過其他部門，因為答案可能來自快取。

而 `aa` 表示 DNS 回覆宣告具有權威性，並不是密碼學上的真偽保證。

## 5.4 為什麼 Ubuntu 可能看到 127.0.0.53？

假設你執行：

```bash
dig example.com A
```

結果出現：

```text
SERVER: 127.0.0.53#53
```

你可能會想：

「為什麼 DNS 伺服器變成我自己的電腦？」

這其實可能是正常現象。

在使用 `systemd-resolved` 並啟用本機 Stub Resolver 的 Ubuntu 系統中，`127.0.0.53` 是本機 DNS 查詢端點。

例如：

```text
dig
 │
 ▼
127.0.0.53
本機 systemd-resolved
 │
 ▼
系統設定的上游 DNS
 │
 ▼
取得 DNS 回覆
```

因此，看到 `127.0.0.53`，不代表真正的上游 DNS 就是你自己。

你可以用：

```bash
resolvectl status
```

查看系統目前的 DNS 設定及相關介面資訊。

---

# 第六章｜沒有查到答案，至少要分清五種情況

這一章非常重要，因為很多初學者會犯相同的錯誤。

**沒有取得答案，不等於 DNS 已經證明名稱不存在。**

想像你向某個公司詢問：

「請問你們有王先生這個員工嗎？」

不同的回答有完全不同的意思。

## 6.1 NOERROR，但沒有答案

例如：

```text
status: NOERROR

ANSWER: 0
```

常見情況之一是 NODATA。

意思是：

「這次 DNS 查詢沒有取得所要求類型的紀錄。」

例如，你查詢：

```bash
dig example.com AAAA
```

如果沒有得到 AAAA 紀錄，可能代表該名稱沒有對應的 AAAA 資料。

但要搭配其他回覆區塊判斷，不能只看空白結果就直接下結論。

特別注意：NODATA 是描述一類 DNS 否定回答的常用術語，不是獨立的 DNS status 回應碼。

## 6.2 NXDOMAIN：名稱不存在

例如：

```text
status: NXDOMAIN
```

一般可以理解成：

「DNS 回覆報告所查詢的名稱不存在。」

生活比喻：

你打電話去公司詢問王先生，得到：

「我們的正式名單裡沒有這個名字。」

但這並不代表：

- 整家公司不存在。
- 公司完全沒有其他人。
- 所有相關子網域都不存在。

如果查詢涉及 CNAME 別名鏈，也需要辨認究竟是哪一個名稱被判定不存在。

## 6.3 SERVFAIL：DNS 解析失敗

例如：

```text
status: SERVFAIL
```

意思是：

「DNS 伺服器無法成功完成這次解析。」

常見可能原因：

- 上游 DNS 服務發生問題。
- DNSSEC 驗證失敗。
- DNS 伺服器設定錯誤。
- 其他解析處理問題。

這就像公司櫃檯回答：

「抱歉，我們目前的查詢系統有問題。」

它不是告訴你王先生不存在。

## 6.4 REFUSED：拒絕處理

例如：

```text
status: REFUSED
```

意思是：

「DNS 伺服器拒絕處理這個要求。」

可能是因為：

- 存取控制政策。
- 查詢來源不在允許範圍。
- 特定服務或功能受到限制。

生活比喻：

你問公司櫃檯：

「可以提供所有員工的完整資料嗎？」

對方回答：

「抱歉，依照公司規定，不能提供。」

這不代表公司沒有員工資料。

## 6.5 Timeout：等待逾時

例如：

```text
;; communications error: timed out
```

意思是：

「在等待時間內，沒有收到可用回覆。」

可能原因包括：

- 網路封包遺失。
- 防火牆過濾。
- DNS 服務沒有回應。
- 查詢端點或路由發生問題。

請注意：

**Timeout 與 REFUSED 不一樣。**

REFUSED 是 DNS 伺服器明確回覆拒絕。

Timeout 則是你沒有收到可用的 DNS 回覆。

### 六、五種情況比較表

| 狀態 | 白話文 | 能否證明名稱不存在？ |
|---|---|---|
| NOERROR + 空 ANSWER | 沒有取得所問類型的答案 | 不能單憑這兩項判定 |
| NXDOMAIN | 回覆報告相關名稱不存在 | 可作為此名稱不存在的 DNS 證據，但須判讀查詢情境 |
| SERVFAIL | DNS 解析失敗 | 不能 |
| REFUSED | DNS 伺服器拒絕處理 | 不能 |
| Timeout | 沒有收到可用回覆 | 不能 |

### 補充：為什麼 NOERROR + 空 ANSWER 也不能絕對證明名稱存在？

這裡有一個進階概念。

RFC 9824 定義了 DNSSEC 的 Compact Denial of Existence 技術。

某些情況下，權威伺服器可以使用 `NOERROR` 搭配空 ANSWER 的形式，表達原本不存在的名稱。

因此：

**判讀 DNS 結果時，不能只看 status 與 ANSWER 的筆數，還要看其他區塊、DNSSEC 資料與查詢情境。** [RFC Editor](https://www.rfc-editor.org/rfc/rfc9824.html)

這個細節不必立刻背起來。

CEH 這一階段真正要掌握的是：

「沒有答案」可以有很多原因，而不同原因對應不同的調查方向。

---

# 第七章｜把零散查詢整理成線索，而不是把猜測寫成事實

這一章其實是在教你資安調查的核心能力：

**如何從技術工具的輸出，整理成有證據支持的結論。**

## 7.1 一筆查詢，可以得到什麼資訊？

假設你在授權的實驗室環境查詢：

```bash
dig @192.0.2.53 example.test MX
```

得到以下合成結果：

```text
example.test. 300 IN MX 10 mail.example.test.
```

你能確定什麼？

這次 DNS 回覆表示：

`mail.example.test` 被設定為 `example.test` 的郵件接收主機，MX 優先值為 10。

但不能直接說：

- 郵件伺服器目前正在運作。
- 這台伺服器一定屬於公司自己。
- 任何人都能透過它寄送郵件。
- 公司員工的信箱名稱已經被查出來。

為什麼？

因為 MX 紀錄只是郵件路由設定。

要確認郵件服務是否真的存在，還需要進一步解析郵件主機名稱，並在授權範圍內驗證相關服務。

這又連接到前面學過的 M03 網路掃描。

## 7.2 查到 admin、vpn、dev，就代表有這些服務嗎？

假設你發現 DNS 中存在：

```text
admin.example.test
vpn.example.test
dev.example.test
```

你可能直覺認為：

```text
admin → 管理者後台
vpn   → VPN 伺服器
dev   → 開發環境
```

這些名稱確實可能提供線索。

但也有其他可能：

- 名稱早已不再使用。
- 原本的服務已經搬遷。
- 名稱只是暫時保留。
- DNS 指向的是 CDN 或第三方服務。
- 名稱與實際服務用途不同。

因此，資安調查應該把「查到的資料」和「自己的判斷」分開。

## 7.3 如何寫出專業的 DNS 調查紀錄？

建議使用下面的格式。

| 類別 | 紀錄內容 |
|---|---|
| 觀察（Observation） | DNS 回覆顯示 `vpn.example.test` 有一筆 A 紀錄 |
| 事實範圍 | 這次查詢取得 `192.0.2.30` |
| 初步推論（Inference） | 名稱可能與 VPN 服務有關 |
| 尚未確認 | 是否有 VPN 服務、服務是否在線、由誰管理 |
| 後續驗證 | 依照授權範圍確認服務及系統配置 |

這種方式可以避免調查報告出現不可靠的結論。

另外，資安調查時最好保留完整的 `dig` 輸出，而不是只保留 `dig +short` 的結果。

例如：

```bash
dig example.com A
```

適合保留較完整的查詢資訊。

```bash
dig +short example.com A
```

適合快速查看簡短答案。

但後者會省略部分狀態、旗標與查詢端點資訊，不適合單獨作為完整調查紀錄。

---

# 第八章｜ANY 不是「全部給我」，AXFR 才是另一種工作

這章要區分兩種非常容易混淆的 DNS 操作。

## 8.1 ANY 是什麼？

你已經知道：

```bash
dig example.com A
```

是在問 A 紀錄。

```bash
dig example.com MX
```

是在問 MX 紀錄。

那如果想查全部紀錄，可以直接使用 ANY 嗎？

不可以這樣理解。

ANY 是 DNS 的一種查詢類型，但現代 DNS 伺服器不一定會返回該名稱的所有紀錄。

它也不會替你列出整個網域裡所有子網域。

因此：

**ANY 不是「把這家公司所有 DNS 資料全部交給我」。**

如果你要查 MX，就明確查 MX。

如果要查 NS，就明確查 NS。

## 8.2 AXFR 是什麼？

AXFR（Full Zone Transfer）稱為完整 DNS 區域傳送。

這和一般 DNS 查詢非常不同。

我們用一個公司情境來理解。

假設公司有兩台權威 DNS 伺服器：

```text
Primary DNS
    │
    │ 保存及管理 Zone 資料
    │
    ▼
Secondary DNS
```

公司希望第二台 DNS 能保存該區域的副本。

正常情況下，Secondary DNS 可以透過授權的區域傳送機制取得資料。

概念如下：

```text
Primary DNS
┌─────────────────────┐
│ example.test Zone   │
│                     │
│ www      A          │
│ mail     A          │
│ example  MX         │
│ example  NS         │
│ ...                 │
└──────────┬──────────┘
           │
           │ AXFR
           │ TCP
           ▼
┌─────────────────────┐
│ Secondary DNS       │
│                     │
│ 保存區域資料副本    │
└─────────────────────┘
```

這是正常的 DNS 管理功能。

相關標準為 RFC 5936。[RFC Editor](https://www.rfc-editor.org/rfc/rfc5936.html)

## 8.3 為什麼 AXFR 會有資安風險？

假設公司原本只允許 Secondary DNS 取得完整區域資料。

但是管理員設定錯誤，讓不受信任的外部來源也能取得原本不應公開的完整資料。

就可能暴露：

- 主機命名方式。
- 郵件主機名稱。
- 其他系統或服務的 DNS 紀錄。
- 部分內部架構或環境命名線索。

這會增加攻擊者理解組織網路配置的能力。

但要注意兩個判斷原則。

第一，**AXFR 成功不一定代表漏洞**。如果發起者是經授權的次要 DNS 伺服器，那可能完全正常。

第二，AXFR 傳送的是某個 Zone 的資料，不代表取得了組織所有網域、已委派子區域及其他 DNS 視圖的完整內容。

因此，資安檢測不能只看「AXFR 成功或失敗」，還要確認來源、授權政策和資料範圍。

## 8.4 ANY 和 AXFR 的比較

| 項目 | ANY | AXFR |
|---|---|---|
| 類型 | DNS 查詢類型 | DNS 區域傳送 |
| 目的 | 詢問特定名稱的紀錄集合 | 取得一個 Zone 的資料副本 |
| 會列出所有子網域嗎？ | 不會 | 只涵蓋傳送區域內的相關資料 |
| 一定取得所有紀錄嗎？ | 不會 | 正常完整傳送應取得該區域應傳送的資料 |
| 主要安全重點 | 查詢資訊與回覆政策 | 授權控制、資料暴露與完整性 |

---

# 第九章｜快取、DNSSEC、加密傳輸各管不同的事

這一章對系統安全架構非常重要。

因為很多人會把 DNSSEC、DoH 和 DNS 快取誤認成相似的安全機制。

實際上，它們處理的是完全不同的問題。







[[figure:security]]

## 9.1 DNS Cache：加速查詢

前面已經介紹過 TTL。

DNS Cache 就像公司櫃檯常用的聯絡資料。

如果很多人都詢問同一個電話號碼，櫃檯不必每次重新詢問總公司。

但這裡有一個資安判斷問題。

假設你發現某個共享 DNS Resolver 的快取裡面有：

`www.example.com`

可以說：

「一定有某位員工造訪過這個網站」嗎？

不可以。

因為 DNS 查詢可能來自：

- 不同的使用者。
- 系統背景服務。
- 自動化程式。
- 解析器的預先查詢或其他機制。

而且 DNS 查詢本身不代表完成了網站瀏覽。

因此，**DNS 快取不能直接當作特定使用者的瀏覽紀錄。**

## 9.2 DNSSEC：防止 DNS 資料遭到未授權竄改

DNSSEC 全名：

Domain Name System Security Extensions。

主要提供兩種安全能力：

1. 資料來源驗證（Data Origin Authentication）。
2. 資料完整性（Data Integrity）。

白話文：

「我不只想知道 DNS 回了什麼，還想驗證這些資料是否來自正確的權威來源，以及是否遭到竄改。」

DNSSEC 使用數位簽章及信任鏈等機制。

例如：

```text
權威 DNS
    │
    │ 提供經簽署的 DNS 資料
    ▼
驗證型解析器
    │
    │ 驗證簽章與信任鏈
    ▼
決定是否接受資料
```

但 DNSSEC 不會自動加密 DNS 查詢內容，也不能證明網站安全。

RFC 4033 明確將 DNSSEC 的核心保護定位在資料來源驗證與完整性，而非保密性。[RFC Editor](https://www.rfc-editor.org/rfc/rfc4033.html)

### `dig +dnssec` 是不是就完成驗證？

不是。

例如：

```bash
dig +dnssec example.com A
```

主要是要求與 DNSSEC 有關的資料。

它不代表 `dig` 已經完整驗證 DNSSEC 信任鏈。

若需要實際驗證，可以進一步學習 BIND 的 `delv` 工具，或使用具備 DNSSEC 驗證能力的解析器。[BIND 9 Documentation](https://bind9.readthedocs.io/en/stable/manpages.html)

## 9.3 DNS over HTTPS：保護查詢傳輸

DoH 全名：

DNS over HTTPS。

你可以想像：

傳統 DNS 查詢就像使用沒有加密保護的通訊方式傳送問題。

DoH 則是在用戶端與 DoH 解析服務之間，透過 HTTPS 傳送 DNS 訊息。

概念如下：

```text
你的電腦
    │
    │ HTTPS 加密
    ▼
DoH Resolver
    │
    │ 依其設定處理 DNS 查詢
    ▼
DNS 系統
```

這提供了特定傳輸鏈路上的保密性與完整性保護。

但仍然有幾個限制：

- DoH 解析服務本身可以處理並得知查詢內容。
- 加密不代表 DNS 資料一定正確。
- DoH 不代表網站本身安全。
- DoH 不保證整條後續 DNS 解析鏈路都受到相同的加密保護。

## 9.4 三種機制比較

| 機制 | 主要目的 | 不能直接保證 |
|---|---|---|
| DNS Cache | 減少重複解析、改善效能 | 資料一定即時、主機正常 |
| DNSSEC | 驗證 DNS 資料來源及完整性 | 查詢內容保密、網站安全 |
| DoH／DoT | 保護特定 DNS 傳輸鏈路 | DNS 資料本身一定可信 |

你可以這樣記：

**Cache 管效率，DNSSEC 管資料可信度，DoH／DoT 管傳輸保護。**

這三者可以互相補充，但不能彼此取代。

---

# 第十章｜防守不是讓 DNS 永遠不回答，而是限制不必要的暴露

這章開始從防守者的角度思考。

假設你是公司的資安管理員。

你發現外部使用者可以查詢公司的 DNS 紀錄。

第一個想法可能是：

「既然 DNS 會暴露資訊，是不是直接把 DNS 封鎖就好？」

答案通常不是。

因為公開網站需要提供必要的 DNS 資料，才能讓正常使用者找到服務。

因此，真正要管理的是：

**哪些 DNS 資料應該公開、哪些功能應該受到限制，以及哪些來源有權限使用特定功能。**

## 10.1 檢查不必要的公開 DNS 紀錄

例如，公司 DNS 存在：

```text
old-vpn.example.test
old-dev.example.test
test-admin.example.test
```

如果這些名稱已經沒有用途，就應該檢查是否仍有必要保留。

特別是曾經指向第三方服務、現在卻沒有正確解除配置的紀錄。

某些情況下，失效的 DNS 指向可能造成 Subdomain Takeover（子網域接管）的風險。

不過，存在一筆失效 CNAME 並不自動代表能被接管；還需要看目標服務是否允許其他人重新取得對應的資源名稱。

## 10.2 限制 AXFR 區域傳送

先回想第八章：

AXFR 讓授權的 DNS 伺服器同步區域資料。

因此，防守重點是：

- 明確指定哪些來源可以使用區域傳送。
- 避免讓不受信任的來源取得不必要的區域副本。
- 依需求使用 TSIG 等驗證機制。
- 保留相關日誌，確認實際政策是否生效。

TSIG（Transaction Signature）是以共享金鑰為基礎的 DNS 訊息驗證機制。

它可以提供訊息驗證及完整性保護。

但 **TSIG 本身不會加密 DNS 區域內容**。

## 10.3 限制遞迴解析服務

這一點也很重要。

你可以把 DNS 服務區分成兩種功能：

**公開權威 DNS：**

「我負責回答某個區域的正式 DNS 資料。」

**遞迴解析 DNS：**

「我幫使用者尋找其他網域的 DNS 資料。」

這兩種功能不一定需要對相同的使用者開放。

例如：

```text
公司對外權威 DNS
       │
       ├── 對外回答必要的權威紀錄
       │
       └── 不替任意外部使用者進行遞迴解析
```

如果一台 DNS 伺服器允許網際網路上任何人使用遞迴服務，就可能成為 Open Resolver（開放式遞迴解析器）。

沒有適當防護時，這類服務可能遭到濫用，例如 DNS 放大反射攻擊。

因此，公開權威查詢與遞迴服務應分別設計存取控制。

## 10.4 為什麼不同人查同一個網域，會得到不同 IP？

假設：

台灣使用者查詢：

```text
www.example.com → IP A
```

美國使用者查詢：

```text
www.example.com → IP B
```

是不是表示其中有人被 DNS 攻擊？

不一定。

可能原因包括：

- CDN 的地理位置調度。
- GeoDNS（依地理位置提供不同 DNS 答案）。
- Split DNS（不同環境使用不同 DNS 視圖）。
- 快取時間不同。
- 不同解析器採取不同處理策略。

因此，調查 DNS 結果時必須記錄查詢條件。

### 建議使用的 DNS 調查紀錄表

| 欄位 | 記錄內容 |
|---|---|
| 查詢時間 | 日期、時間、時區 |
| 查詢來源 | IP、網路位置、授權範圍 |
| DNS 端點 | 查詢的解析器或權威伺服器 |
| Query Name | 查詢的網域名稱 |
| Query Type | A、AAAA、MX 等 |
| Status | NOERROR、NXDOMAIN 等 |
| Flags | qr、rd、ra、aa 等 |
| Answer | 完整回覆內容 |
| TTL | 回覆的快取時間 |
| 結論 | 這些資料能支持什麼判斷 |
| 限制 | 還有哪些事項沒有證實 |

如果目的是正式資安檢測，保留原始輸出會比只記錄最後結論更有價值。

---

# 第十一章｜今天先記住這一條線

這章是整堂課的總結。

我建議把 M04-02 濃縮成一個判斷模型。

## DNS 列舉的六個問題

當你看到一筆 DNS 查詢結果時，依序問自己：

**第一，我問的是哪個 DNS 伺服器？**

例如：

`1.1.1.1`

**第二，我問的是哪個名稱？**

例如：

`www.example.com`

**第三，我問的是哪一種紀錄？**

例如：

`A`

**第四，對方的回覆狀態是什麼？**

例如：

`NOERROR`

**第五，對方實際回覆了什麼資料？**

例如：

一筆 IPv4 位址紀錄。

**第六，這些資料還不能證明什麼？**

例如：

不能證明主機在線、網站正常、憑證有效或具有存取授權。

這六個問題，是從 DNS 工具輸出走向專業資安判斷的基礎。

---

# 第十二部分｜概念 Q&A 與整合實作

以下是教學常見問題，並提供一個練習情境；與學員實際討論分開呈現。

## Q1：DNS Enumeration 和 Port Scanning 差在哪裡？

DNS Enumeration 主要是查詢名稱、位址及服務設定等資料。

Port Scanning 則是在授權範圍內觀察目標網路 Port 的回應。

例如：

```text
DNS Enumeration
      │
      ▼
www.example.com
      │
      ▼
192.0.2.10

Port Scanning
      │
      ▼
192.0.2.10:443
      │
      ▼
觀察 TCP 回應
```

這兩個工作互相關聯，但回答的是不同問題。

## Q2：DNS 查詢是否屬於被動偵察？

不一定。

如果你閱讀第三方已經蒐集的公開資料，可能屬於被動偵察。

但如果你主動向 DNS 服務發送查詢，便已經與該服務互動。

因此，不能因為 DNS 資料公開，就把所有 DNS 列舉都稱為被動偵察。

而且，能查詢公開 DNS，不代表你自動取得對相關主機進行其他安全測試的授權。

## Q3：我可以直接用 DNS 資料判斷系統漏洞嗎？

通常不行。

DNS 可以揭露配置線索，但真正的弱點判斷需要其他證據。

例如：

一筆 CNAME 指向已停止使用的外部服務，可能值得檢查。

但要確認是否構成可被利用的子網域接管風險，還必須確認外部服務的資源註冊與所有權控制機制。

---

## Ubuntu 綜合練習

你可以在自己的 Ubuntu 上執行以下基本查詢：

```bash
# 1. 確認系統目前的 DNS 設定
resolvectl status

# 2. 查詢示例網域的 IPv4
dig example.com A

# 3. 查詢 IPv6
dig example.com AAAA

# 4. 查詢郵件設定
dig example.com MX

# 5. 查詢權威名稱伺服器
dig example.com NS

# 6. 指定公共遞迴解析器
dig @1.1.1.1 example.com A

# 7. 使用 TCP 進行一般 DNS 查詢
dig +tcp example.com A

# 8. 使用精簡模式
dig +short example.com A
```

這裡的 `example.com` 是 IANA 保留的示例網域。上述操作會產生真實 DNS 查詢，但不涉及 Port Scanning 或 AXFR。

你可以比較：

- 不同 DNS 端點回覆的位址是否一致。
- TTL 有沒有差異。
- `dig` 與 `dig +short` 的資訊量有何不同。
- UDP 和 TCP 查詢結果有沒有差異。
- `SERVER` 欄位是否因指定解析器而改變。

練習重點不是找出最多 IP，而是能夠**正確描述每筆回覆的證據意義與限制**。

---

# 全課總結

M04-02 最重要的五個觀念：

1. **DNS 是資料查詢系統，不是服務健康檢查工具。** 查到 IP 不代表網站正常。
2. **DNS 有不同角色與紀錄類型。** Recursive Resolver、Authoritative DNS、A、AAAA、MX、NS 等都要分清楚。
3. **DNS 回覆狀態不能過度解讀。** NOERROR、NXDOMAIN、SERVFAIL、REFUSED、Timeout 代表不同事情。
4. **ANY 與 AXFR 不是同一種工作。** AXFR 是區域資料傳送，需要明確的授權與存取控制。
5. **DNSSEC、DoH、Cache 解決不同問題。** 分別關注資料驗證、傳輸保護及查詢效能。

其中最值得帶到其他 CEH 課程的核心原則是：

> **工具觀察到的資料，不等於所有尚未驗證的結論。**

未來學習 FTP、SMTP、SMB、SNMP、LDAP 等服務列舉時，都應該使用相同的證據判讀方式。

---

## 理解檢驗｜一個工作情境

假設你正在進行經授權的公司 DNS 安全檢查。

得到以下合成結果：

```text
# 查詢一
www.lab.example.test
A → 192.0.2.10
A → 192.0.2.11

# 查詢二
www.lab.example.test
AAAA → NOERROR
ANSWER: 0

# 查詢三
lab.example.test
MX → 10 mail.lab.example.test

# 查詢四
lab.example.test
AXFR → REFUSED
```

請回答下面四個問題：

**問題一：** 第一個查詢回傳兩個 IPv4 位址，是否代表公司有兩台正常運作的網站伺服器？為什麼？

**問題二：** 第二個查詢的 `NOERROR` 搭配空 ANSWER，可以得出哪些結論？還缺少哪些資訊？

**問題三：** 第三個查詢取得 MX 紀錄，是否代表郵件服務已經確定正常？如果要進一步確認，你會如何規劃授權範圍內的驗證？

**問題四：** AXFR 回覆 REFUSED，能否直接判斷 DNS 設定安全？如果你是公司的資安管理員，還會檢查哪些項目？

請先依回覆狀態、實際資料與待驗步驟說明四題理由，再連結回 CEH M03 網路掃描與 M04 列舉的技術原理。