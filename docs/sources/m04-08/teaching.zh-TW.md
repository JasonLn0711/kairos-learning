# M04-08｜LDAP／Active Directory 列舉：查到帳號，代表查完整了嗎？

這一課的核心問題是：

當你使用工具查詢一間公司的帳號資料，結果顯示有 2 個人，你能不能因此斷定，這間公司只有 2 個帳號？

答案是：不行。

因為你看到的結果，取決於你從哪裡查、用誰的身分查、設定什麼條件，以及查詢是否真的完成。

這是 CEH（Certified Ethical Hacker）M04 Enumeration（列舉）非常重要的觀念，同時也是 Windows Server、企業網路管理、Active Directory（AD）和資安稽核的基礎。

本課以合成企業情境解釋協定原理與 CEH 判讀方法，並以文末的一手規範核對技術界線。

## 一、先把 LDAP 想成公司的員工資料庫

假設有一家公司，員工有 500 人，分成研發部、人事部、財務部等單位。

人事部有一份員工名冊，記錄每個人的姓名、帳號、電子郵件、部門以及所屬群組。

{{figure:directory}}

現在你走到公司人事部櫃檯，問：

「請問研發部有哪些員工？」

櫃檯回答：「小林、小陳。」

你可能會認為研發部只有兩個人。但實際上，還可能有以下情況：

- 櫃檯只查了研發部的直屬員工，沒有查下面的子部門。
- 你的身分只能查看部分員工資料。
- 系統每次最多顯示兩筆，後面還有更多。
- 櫃檯依照你設定的條件，只找出某一類員工。

所以，查到兩筆資料，不等於整個資料庫只有兩筆。

這就是本課最重要的邏輯。

## 二、LDAP 和 Active Directory 到底是什麼？

這兩個名詞經常一起出現，但不是同一件事。

| 名詞                                      | 白話意思              | 主要作用               |
| --------------------------------------- | ----------------- | ------------------ |
| LDAP                                    | 查詢員工名冊的溝通語言       | 告訴目錄系統要查什麼         |
| Active Directory Domain Services（AD DS） | 企業的集中式帳號與目錄管理系統   | 管理使用者、群組、電腦及相關目錄資訊 |
| Domain Controller（DC）                   | 提供網域身分驗證及目錄服務的伺服器 | 處理相關驗證及目錄請求        |
| Enumeration                             | 依條件蒐集、整理資訊        | 盤點指定範圍內可見的帳號、群組等資訊 |

例如，一位員工登入公司 Windows 電腦時，電腦可能需要透過網域控制站完成身分驗證；公司管理員也可能利用 LDAP 查詢某位員工所屬的群組。

但要注意：AD 不只使用 LDAP。 在 Windows 網域環境中，Kerberos、DNS 等技術同樣重要。

用一句話區分：

AD 是管理資料與身分的系統，LDAP 是存取目錄資料的協定。

## 三、先看懂目錄的結構：DN、OU、CN、DC

LDAP 的資料不是像 Excel 那樣，單純把所有員工放在一張表裡，而是有階層結構。

假設你看到：

```
CN=Lin,OU=People,DC=example,DC=test
```

這就是 Distinguished Name（DN），可以把它理解成「員工資料在目錄中的完整地址」。

| 縮寫 | 意思                  | 白話解釋           |
| -- | ------------------- | -------------- |
| CN | Common Name         | 這筆資料的名稱，例如 Lin |
| OU | Organizational Unit | 組織單位，例如 People |
| DC | Domain Component    | 網域名稱的組成部分      |
| DN | Distinguished Name  | 整筆資料在目錄中的識別路徑  |

這串 DN 就像告訴你：

「請到 example.test 公司目錄的 People 單位，找 Lin 這筆資料。」

要小心：`DC=example` 的 DC 是 Domain Component，不是前面提到的 Domain Controller。兩者剛好縮寫相同。

## 四、Base、Scope、Filter、Attributes：LDAP 查詢的四大設定

這一節是本課最需要理解的地方。

假設你正在幫公司盤點帳號。你必須先告訴查詢系統：「從哪裡開始、查到多深、找什麼人，以及想看哪些資料。」

{{figure:parameters}}

其中 Scope（搜尋範圍）又分成三種。

| Scope       | 白話說明       | 搜尋深度       |
| ----------- | ---------- | ---------- |
| `base`      | 只檢查指定的那個項目 | 起點本身       |
| `one-level` | 只查看直接下一層   | 不包含起點及更深子層 |
| `subtree`   | 從起點往下逐層查詢  | 包含起點和所有後代  |

這是 LDAP 標準搜尋模型，也是 Microsoft AD 查詢 API 所採用的基本概念。

### 用同一棵目錄比較三種 Scope

{{figure:scope}}

這裡就能發現一個重要陷阱：

假設公司有 500 個使用者，你使用 `one-level` 只查到 20 人，就不能說公司只有 20 人。因為其他員工可能藏在下一層的子部門。

另外，即使使用 `subtree`，也不代表一定查完整個公司的所有網域。Subtree 只能保證從你指定的 Base 往下搜尋，不會自動涵蓋整個 AD 樹系。

## 五、RootDSE 和 Global Catalog：為什麼有不同查詢入口？

想像一家跨國企業，在台灣、美國、日本分別有員工管理系統。

你向台灣的管理員詢問，得到的資料不一定包含美國、日本的全部員工。

AD 也有類似問題。

### RootDSE：伺服器的服務說明牌

RootDSE 是 LDAP 伺服器提供自身資訊的特殊項目。

你可以透過它了解伺服器支援哪些功能，以及目錄的相關入口。

例如 `defaultNamingContext` 可以幫你知道預設網域的查詢起點。

但讀到 RootDSE 不代表有權限讀取所有員工帳號，也不代表取得了完整的 AD 地圖。

### Global Catalog（GC）：跨網域的索引

GC 可以理解為一份跨網域的索引，讓你不用每次都先知道資料位於哪個網域。

但它有一個重要限制：GC 對其他網域通常保留每個物件的部分屬性，不是所有欄位的完整副本。

所以查 GC 時沒有看到某個欄位，未必表示原始目錄沒有這個資料。

## 六、LDAP Bind、權限與 TLS：登入成功不代表什麼都能查

假設你拿公司員工證進入辦公大樓。

門禁確認你是員工，並不代表你可以進入董事長辦公室、機房或財務室。

LDAP 也要分清楚三種不同問題。

| 安全概念                     | 白話意思     | 能證明什麼                  |
| ------------------------ | -------- | ---------------------- |
| Authentication（驗證）       | 你是誰？     | 目前採用何種驗證身分             |
| Authorization（授權）        | 你能看什麼？   | 可存取哪些物件或欄位             |
| Transport Security（傳輸安全） | 傳輸途中安全嗎？ | 有沒有提供加密、完整性與伺服器身分驗證等保護 |

LDAP 的 Bind 與身分驗證狀態有關。即使 Bind 成功，也不能推論目前身分可以讀取所有資料。

另外，LDAP 的傳輸安全常見下列方式。

| 技術              | 常見 Port  | 重點                            |
| --------------- | -------- | ----------------------------- |
| LDAP            | TCP 389  | 協定本身不代表已加密                    |
| LDAP + StartTLS | TCP 389  | 在 LDAP 連線上協商啟動 TLS            |
| LDAPS           | TCP 636  | 連線開始就使用 TLS                   |
| LDAP Signing    | 依驗證與傳輸方式 | 為適用的非 TLS SASL 連線提供訊息完整性及來源驗證 |

LDAP Signing 不等於加密。

簽章比較像防止文件被偷偷修改；加密則是讓傳輸內容不容易被旁人看懂。TLS 可提供機密性、完整性和伺服器身分驗證，但必須正確建立 TLS 連線並驗證憑證。

而在 Microsoft AD 中，LDAP Signing 主要適用於非 TLS 的 SASL 工作階段，不應誤認它是所有 LDAP 連線都額外套用的獨立保護。

## 七、最重要的案例：`sizeLimitExceeded` 是什麼？

回到正式教材的情境。

你被授權查詢公司 People 單位的帳號，工具顯示：

{{figure:result}}

`sizeLimitExceeded` 的意思是：「這次搜尋達到筆數限制，沒有正常收完。」

RFC 4511 確實定義了 `success = 0`、`timeLimitExceeded = 3`、`sizeLimitExceeded = 4` 等結果代碼。

因此，你目前只能確認：這次查詢取得了兩筆資料，但完整數量尚未確定。

更重要的是，因為你只要求回傳 `cn`，所以沒有電子郵件欄位並不能證明員工沒有電子郵件。

### 那要怎麼把後面的資料查出來？

當伺服器支援且查詢條件允許時，可以使用 Paging（分頁搜尋）。分頁大小與整次查詢的 sizeLimit 是不同設定；不能把同一個總筆數限制原封不動保留，再假定分頁會自動繞過它。

想像有一本 500 頁的名冊，一次只允許印出 100 頁。你就要分五次取回，並且確認有沒有全部收到。

LDAP 的分頁搜尋可以透過伺服器提供的續查資訊（cookie）讀取下一批資料。每次都要檢查結果狀態，並確認最後收到空 cookie 才能判定該分頁序列結束；中斷、錯誤或遺失續查資訊都要記錄。

{{figure:paging}}

但分頁只解決「資料分批取回」的問題，不會提升查詢者的權限，也不會自動擴大搜尋範圍。

這裡還要記住一句話：

`success` 代表這次 LDAP 操作成功完成，不代表你已經完成整個公司的帳號盤點。

## 八、從 CEH 的觀點，為什麼需要學這個？

在 CEH M04 Enumeration 中，最重要的是學會「根據服務回應判斷資訊暴露與可見範圍」。

假設你正在執行一項經過授權的企業資安評估。你發現某個低權限帳號能夠查詢員工姓名、群組與組織架構。

這時你要思考的不是單純「我查到幾個帳號」，而是：

這些資訊是否原本就預期讓該帳號讀取？會不會暴露超出業務需要的資訊？目前看到的結果是否完整？又有哪些資料根本沒有被查詢？

在防守方的角度，應該記錄查詢身分、伺服器、時間、Base、Scope、Filter、Attributes、結果代碼及分頁完成狀態，並以最小權限控制資料可見範圍。

而且，看到大量 LDAP 查詢也不能直接判定正在遭受攻擊。合法的資產盤點與目錄同步服務，也可能產生大量查詢。

### 最後整理：判斷 LDAP 查詢是否完整的六問框架

| 要確認的問題                      | 如果沒確認，可能誤判什麼？ |
| --------------------------- | ------------- |
| 1. 用誰的身分查？                  | 以為低權限看到的就是全部  |
| 2. Base 在哪裡？                | 把某單位誤當整個網域    |
| 3. Scope 有多深？               | 漏掉子部門         |
| 4. Filter 與 Attributes 是什麼？ | 漏掉符合其他條件的人或欄位 |
| 5. 結果代碼與分頁狀態如何？             | 把未完成的結果當成完整   |
| 6. 是否涵蓋所有必要目錄與網域？           | 以為單一網域等於整間公司  |

這套邏輯不只適用於 LDAP，也能應用在其他服務列舉、API 分頁、資料庫查詢及資產盤點：先界定觀察範圍，再判斷證據支持什麼結論。

## 理解測驗｜CEH M04-08

假設你是一位受委託的資安稽核人員，正在盤點企業的 AD 帳號。

你使用已驗證的低權限帳號，經過有效的 TLS 連線執行 LDAP 查詢：

查詢紀錄

```text
Base: OU=People,DC=example,DC=test
Scope: one-level
Attributes: cn
Result: 20 entries
Result Code: success (0)
```

同事看完後說：「我們已經確認 People 單位及所有子部門總共只有 20 個人，而且這些人都沒有電子郵件。」

請你回答三個問題：

Q1. 同事的結論有哪些地方不正確？

Q2. 如果要查詢 People 單位下所有子部門的員工，應優先調整哪一個查詢設定？

Q3. 既然結果顯示 `success (0)`，為什麼仍然不能保證這 20 筆就是全部？

{{answer:completeness}}

## 補充 A｜LDAP 是什麼？從零開始的白話教學

LDAP 可以把它想成「公司查詢員工名冊的一套標準溝通方法」。

假設一家公司有 3,000 名員工，每個人都有電腦帳號、密碼、電子郵件、部門和不同的系統權限。

公司不可能要求每套系統都自己維護一份員工資料。否則員工一離職，IT 人員可能要去十幾套系統刪除他的帳號。

因此，公司會建立集中式的「目錄服務」（Directory Service），而 LDAP 就是讓其他軟體可以跟這個目錄服務溝通的協定。

### 一、先從一間公司的實際情況理解

假設有一家「Kairos 科技公司」。

{{figure:central}}

現在有位員工叫小明。

小明打開公司內部系統，輸入帳號 `ming` 和密碼。

這套系統不一定自己保存小明的密碼，而是可能透過 LDAP 與中央目錄服務確認身分。

系統可以詢問：

- 有沒有 `ming` 這個帳號？
- 他是不是合法的使用者？
- 他屬於哪個部門？
- 他是不是管理員群組的成員？

中央目錄依照驗證方式、權限和查詢條件回應，系統再決定小明能否進入以及能使用哪些功能。

這樣就能集中管理員工帳號，而不是每套軟體都重做一次。

### 二、LDAP 的英文全名是什麼？

LDAP = Lightweight Directory Access Protocol

拆開來看：

| 英文          | 中文   | 白話理解                 |
| ----------- | ---- | -------------------- |
| Lightweight | 輕量型  | 相對早期 X.500 目錄存取方式較簡化 |
| Directory   | 目錄   | 像一本有組織的員工電話簿         |
| Access      | 存取   | 查詢、讀取，或在授權下修改資料      |
| Protocol    | 通訊協定 | 雙方講話都遵守的共同規則         |

這裡有個非常重要的觀念：

LDAP 本身不是一套資料庫，也不是一台伺服器，而是一種通訊協定。

這是 IETF RFC 4511 與 Microsoft LDAP 文件中的基本定位。

### 三、LDAP、Active Directory、Domain Controller 有什麼不同？

這三個名詞最容易搞混。

我們把它們想成一間公司的行政系統。

| 名詞                    | 角色             | 比喻            |
| --------------------- | -------------- | ------------- |
| LDAP                  | 通訊協定           | 向人事部詢問資料的標準語言 |
| Active Directory（AD）  | 目錄及身分管理系統      | 公司的人事與帳號管理體系  |
| Domain Controller（DC） | 提供 AD 網域服務的伺服器 | 實際提供服務的人事辦公室  |

例如，Windows Server 可以部署 Active Directory Domain Services（AD DS）。其他應用程式可以透過 LDAP 查詢其目錄資訊。

但 AD 並不只有 LDAP，還會運用 Kerberos、DNS、Group Policy 等技術。

而 LDAP 也不是只能搭配 Microsoft AD。OpenLDAP 等其他目錄服務同樣支援 LDAP。

### 四、LDAP 裡面的資料長什麼樣？

假設公司保存小明的資料。

{{figure:entry}}

LDAP 會用 DN（Distinguished Name）表示一筆資料在目錄中的位置。

例如：

```
cn=Ming,ou=People,dc=example,dc=test
```

這串文字可以這樣讀：

- `cn=Ming`：找 Ming 這個項目。
- `ou=People`：它位於 People 組織單位。
- `dc=example,dc=test`：所屬的網域目錄是 example.test。

你可以把 DN 想成一個人的完整地址，不只是他的姓名。

### 五、一次 LDAP 查詢是怎麼發生的？

假設公司管理員想知道研發部有哪些員工。

{{figure:search}}

LDAP Search 有四個基本觀念：

| 設定         | 問題       | 例子       |
| ---------- | -------- | -------- |
| Base       | 從哪裡開始找？  | People   |
| Scope      | 往下找多深？   | 包含全部子部門  |
| Filter     | 找符合什麼條件？ | 只找使用者    |
| Attributes | 要哪些資料欄位？ | 姓名、Email |

例如 LDAP 的篩選條件：

```
(cn=Ming)
```

意思是：找出 `cn` 等於 `Ming` 的目錄項目。

再例如：

```
(mail=*)
```

意思是：找出有 `mail` 屬性的項目。

在正式環境中，LDAP 還有 Bind（建立驗證身分）、Modify（修改）、Add（新增）等操作；具體能否執行取決於伺服器與權限設定。

### 六、LDAP 安全嗎？為什麼 CEH 需要學它？

LDAP 本身不保證傳輸已加密，因此安全設定很重要。

| 方式              | 常見 TCP Port | 安全重點                 |
| --------------- | ----------- | -------------------- |
| LDAP            | 389         | 不能只因使用 LDAP 就認為資料已加密 |
| LDAP + StartTLS | 389         | 在既有連線上協商 TLS         |
| LDAPS           | 636         | 一開始就建立 TLS 保護        |

使用 TLS 時，也需要正確驗證伺服器憑證，才不會錯誤地信任冒充的伺服器。Microsoft 也建議使用適當的 TLS 或 SASL 保護 LDAP 通訊。

從 CEH（道德駭客）角度，LDAP 很值得學，因為企業目錄可能記錄大量組織資訊。若權限設定不當，未經授權的人可能取得本不應開放的帳號與群組資訊。

但要記得：

查得到某個帳號，不代表知道他的密碼；能成功登入 LDAP，也不代表擁有管理員權限。

### 七、最後用四個問題整理

1. LDAP 是什麼？ 一套讓軟體存取目錄服務的通訊協定。
2. LDAP 用來做什麼？ 查詢帳號、群組、組織資料，並支援身分驗證及授權管理的相關流程。
3. LDAP 和 AD 一樣嗎？ 不一樣。LDAP 是協定，AD 是微軟的目錄與身分管理技術。
4. LDAP 是不是安全的？ 取決於驗證、存取權限及傳輸保護等設定。

### 小測驗：確認你是否真的理解

1\. 一間公司使用 Active Directory 管理員工帳號。另一套內部系統需要查詢員工資料，通常可以使用什麼協定？

LDAP

HDMI

USB

2\. 如果 LDAP 查詢找到小明的帳號，代表什麼？

已經取得小明的密碼

確認查詢範圍內有符合條件且可見的帳號資料

已取得公司管理員權限

3\. LDAP 與 Active Directory 的關係，哪個比較正確？

兩者是完全相同的產品

LDAP 是協定；AD 是可支援 LDAP 的目錄管理系統

LDAP 只能在 Windows 使用

{{answer:ldap}}

學完 LDAP 後，下一個最有價值的主題是 Active Directory 如何利用 LDAP、Kerberos 和 DNS 共同完成企業帳號登入與權限管理。這能把 CEH 的列舉知識與真正的 Windows 網路工程串在一起。

## 補充 B｜Kerberos 是什麼？從零開始的白話教學

Kerberos 是一種「身分驗證協定」（Authentication Protocol）。它最重要的特色是：透過加密票證（Ticket），讓你不必每次存取公司系統都重新輸入密碼。

你可以把 Kerberos 想成「公司的中央門禁與通行證制度」。

前面學過的 LDAP 是用來查詢公司員工名冊；Kerberos 則是用來證明「你確實是某位員工」。

先記住兩句話：

- LDAP：查詢你是誰、屬於哪個部門。
- Kerberos：使用加密票證證明你的身分。

兩者經常一起出現在 Active Directory（AD）環境，但負責不同工作。

### 一、為什麼公司需要 Kerberos？

假設 Kairos 科技公司有 3,000 名員工，每個人每天需要使用許多系統。

{{figure:sso}}

傳統上，如果每套系統各自處理帳號和密碼，就可能造成大量重複驗證與密碼管理問題。

Kerberos 提供另一個方式：第一次登入時，先向可信任的中央驗證服務證明身分，取得一張可以用來申請其他票證的憑證。之後要存取不同服務，再取得相應的服務票證。

這也是它能支援 Single Sign-On（SSO，單一登入）的原因。

### 二、用「遊樂園通行證」理解 Kerberos

假設你去一座大型遊樂園。

遊樂園有三個區域：雲霄飛車、海盜船和水族館。

你的入園流程可以分成三個階段。

第一階段：先證明你是合法遊客

你到入口驗證身分，工作人員發給你一張「可以申請各區門票的通行證」。

這張通行證就像 Kerberos 的 TGT（Ticket-Granting Ticket）。

第二階段：取得指定設施的門票

你想搭雲霄飛車，就拿通行證到票務中心，申請一張雲霄飛車專用的門票。

這張門票就是 Service Ticket（服務票證）。

第三階段：進入指定設施

你到雲霄飛車入口，出示專用門票。工作人員確認票證有效後，再依照設施規定決定是否讓你搭乘。

這就像目標服務驗證 Kerberos 票證，並進一步檢查存取權限。

最關鍵的是：你不必每次都回入口重新證明身分，但也不是拿到通行證就能自由進入所有區域。

TGT 用來申請服務票證；Service Ticket 則用來向特定服務證明身分。

### 三、Kerberos 真正的運作原理

Kerberos 主要涉及三個角色。

| 角色     | 英文名稱                         | 功能        |
| ------ | ---------------------------- | --------- |
| 使用者／電腦 | Client                       | 想要存取資源    |
| 中央驗證中心 | KDC（Key Distribution Center） | 驗證身分、核發票證 |
| 服務伺服器  | Service Server               | 驗證票證並提供服務 |

在 Windows Active Directory 環境中，KDC 通常執行於 Domain Controller（DC，網域控制站）。

KDC 內部又分為兩個邏輯功能：AS（Authentication Service）負責核發 TGT，TGS（Ticket-Granting Service）負責核發服務票證。它們不一定是兩台不同的電腦。

{{figure:tickets}}

這個流程是 Kerberos V5 的基本設計，定義於 [IETF RFC 4120](https://www.rfc-editor.org/rfc/rfc4120.html)。

### 那麼，加密到底發生在哪裡？

Kerberos 並不是把密碼直接交給所有伺服器。

以常見的密碼式驗證來說：

1. 小明的電腦使用密碼衍生出的金鑰，證明自己掌握正確的驗證資訊。
2. KDC 驗證後，核發加密的 TGT 與對應的工作階段金鑰資訊。
3. 小明需要存取檔案伺服器時，用 TGT 向 KDC 申請服務票證。
4. KDC 核發由目標服務可驗證的加密票證。
5. 檔案伺服器檢查票證及相關驗證資訊。

因此，在標準密碼式 Kerberos 流程中，使用者的明文密碼不需要直接在網路上傳送給服務伺服器。

而且票證還有有效期限、加密保護與防止重播的驗證機制。

不過，Kerberos 主要負責身分驗證，不能因此認為所有後續應用資料都自動加密。資料傳輸是否受到保護，仍取決於應用協定，例如 HTTPS、SMB 加密或其他安全設定。

### 四、為什麼 Kerberos 很在意電腦時間？

這是資訊工程和 CEH 特別重要的知識。

假設小明的電腦時間是上午 9:00，但公司的 Domain Controller 認為現在是上午 9:20。

Kerberos 使用時間戳記來協助抵抗重播攻擊（Replay Attack）。

如果時間差距太大，伺服器可能拒絕驗證，因為它無法信任驗證資訊的時間有效性。

在一般 Windows AD 設定中，預設允許的時間偏差通常是 5 分鐘，而且可以依政策調整。

這也解釋了為什麼企業網路很重視 NTP（Network Time Protocol）與 Windows 時間同步服務。

你在 CEH M04 學習 NTP 列舉時，可以將兩者連在一起理解：時間同步不只是讓電腦時鐘準確，它也可能直接影響身分驗證的可靠性。

### 五、LDAP、Kerberos、Active Directory、DNS 如何一起運作？

這四者的分工可以用一張表串起來。

| 技術               | 核心問題         | 主要功能            |
| ---------------- | ------------ | --------------- |
| DNS              | 伺服器在哪裡？      | 名稱解析與服務定位       |
| LDAP             | 目錄裡有哪些資料？    | 查詢使用者、群組及其他目錄資訊 |
| Kerberos         | 如何證明你的身分？    | 利用加密票證進行驗證      |
| Active Directory | 誰來管理這些身分與目錄？ | 提供網域帳號、目錄與管理機制  |

舉個例子：

當小明登入公司 Windows 網域電腦，並且打開共用資料夾時，DNS 可協助找到網域服務或目標主機；Kerberos 可以完成身分驗證；AD 提供相關帳號和群組資訊；目標檔案伺服器再依權限決定能否讀取檔案。

LDAP 可能用於目錄查詢，但不是每次 Windows 網域登入都必須由用戶端直接發出 LDAP 查詢。

### 六、從 CEH 角度，Kerberos 有哪些安全風險？

Kerberos 是成熟的身分驗證協定，但不代表它不會被攻擊。

| 風險              | 白話意思                         | 主要防禦方向                   |
| --------------- | ---------------------------- | ------------------------ |
| Pass-the-Ticket | 偷走可用票證後，冒用票證持有者              | 保護端點、憑證與票證儲存環境           |
| Kerberoasting   | 利用某些服務票證，嘗試離線猜測弱服務帳號密碼       | 強密碼、gMSA、適當加密演算法         |
| Golden Ticket   | 在取得高度敏感的 Kerberos 金鑰後，偽造 TGT | 嚴格保護網域控制站與 KRBTGT 金鑰     |
| Replay Attack   | 重送截取到的驗證訊息                   | 時間戳記、Authenticator 與重播檢查 |

這些名稱不需要一次全部背起來。先記住安全邏輯：

Kerberos 降低了每次傳送密碼的需求，但如果端點、票證或核心金鑰被竊取，仍然可能發生身分冒用。

在 Windows 網域稽核中，事件 ID 4768 可以用來觀察 TGT 申請，4769 則與服務票證申請有關。這些紀錄可協助辨識異常驗證活動，但單一事件本身不能直接證明遭到攻擊。

### 七、你可以在 Windows 電腦上看到 Kerberos 票證嗎？

可以。在你有權操作的 Windows 環境中，開啟 PowerShell 或命令提示字元：

```
klist
```

若你使用的是有 Kerberos 票證的登入工作階段，這個指令可以列出目前快取中的票證資訊，例如票證對應的服務、有效起訖時間等。

如果沒有看到票證，不一定代表 Kerberos 壞掉；也可能是目前使用本機帳號、尚未存取需要 Kerberos 的服務，或該工作階段使用其他驗證方式。

這個指令只是讀取資訊，不會主動修改網域設定。

### 八、三個觀念，確認你真的學會 Kerberos

1\. 小明登入公司電腦後，想要存取檔案伺服器。Kerberos 通常會讓他先使用什麼來申請服務票證？

TGT

LDAP 查詢結果

IP 位址

2\. 小明已經通過 Kerberos 驗證，是否代表他能讀取公司所有機密檔案？

是，驗證成功就擁有全部權限

否，仍需由目標服務檢查授權

3\. 電腦與 Domain Controller 的時間相差 20 分鐘，可能造成什麼問題？

Kerberos 可能因時間偏差而拒絕驗證

LDAP 會自動刪除使用者

所有服務票證永久有效

{{answer:kerberos}}

本課最重要的結論：Kerberos 不負責決定你能看哪些機密資料，而是讓系統能夠安全地驗證「你是誰」。

接下來最值得深入的是 Kerberos 的兩種票證——TGT 與 Service Ticket——以及為什麼知道密碼、持有票證、擁有系統權限，是三件不同的事。


## 一手來源與適用範圍

本次查核日期為 2026-11-07。範例為合成資料；未對任何目錄執行 LDAP 查詢，也未在 Windows 執行 klist。讀取命令的說明、教材測試與實際企業驗證分開記錄。

- [RFC 4511: LDAP search and result codes](https://www.rfc-editor.org/rfc/rfc4511.html)
- [RFC 4513: LDAP authentication and TLS](https://www.rfc-editor.org/rfc/rfc4513.html)
- [RFC 2696: paged results and cookies](https://www.rfc-editor.org/rfc/rfc2696.html)
- [Microsoft: RootDSE](https://learn.microsoft.com/en-us/windows/win32/adsi/rootdse)
- [Microsoft: Global Catalog](https://learn.microsoft.com/en-us/windows/win32/ad/binding-to-the-global-catalog)
- [Microsoft: LDAP signing](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/ldap-signing)
- [RFC 4120: Kerberos V5](https://www.rfc-editor.org/rfc/rfc4120.html)
- [Microsoft: Kerberos overview](https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-authentication-overview)
- [Microsoft: clock synchronization tolerance](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/maximum-tolerance-for-computer-clock-synchronization)
- [Microsoft: klist](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/klist)
- [Microsoft: event 4768](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4768)
- [Microsoft: event 4769](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4769)
