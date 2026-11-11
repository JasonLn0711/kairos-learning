# M06-05｜Authentication、Authorization 與 Session：身分驗證、授權與工作階段

這一課最重要的觀念：登入系統，不代表可以使用系統裡的所有功能，也不代表能查看別人的資料。

我們要學會區分三件事情：

1. Authentication（身分驗證）：你是誰？如何證明？
2. Authorization（授權）：你能做什麼？可以存取哪些資料？
3. Session（工作階段）：系統如何在你持續操作時認得你，以及何時讓這個登入狀態失效？

我已找到教材的正確頁面：[M06-05 原始教材](https://learn.cs-kairos.com/courses/aase/v1/m06/concepts/m06-05/?utm_source=chatgpt.com)。你提供的網址把 M06 誤放在 M04 目錄下。

這一節的核心是：從單人軟體變成多人共用系統時，如何避免使用者看到、修改或匯出不屬於自己的資料。&#x20;

[image](https://www.google.com/s2/favicons?domain=https://learn.cs-kairos.com\&sz=32)

CS Kairos Learn+1



## 一、先用生活例子理解三個概念

假設你走進一家大型醫院，想查看病人的病歷。

[I am the best doctor](https://images.openai.com/static-rsc-4/PvlnG4fq3mJpagPdVQI8aZzG3ZKdRjlKEoXCAlcLmFOa29Y_OVCJGIUOJdNeNpr27to8ESF4BDONay6Gw72VZc1WJiz7tEARdAcShhO04bJLs_wJEamGOmf-QikBTntXjVmPXqy2g2gnpWRSMGMJ19tY0kZT7lDjzxHYoMOWsy7GbwwGhulvLsgDAyE-HtT5?purpose=inline)

1\. Authentication：確認身分

醫院要求你刷員工證、輸入密碼或使用其他驗證方式，確認你確實是某位醫師。

解決的是「你是不是你宣稱的那個人？」。

[Epic vs Cerner vs Meditech: Subtle Workflow Differences f...](https://images.openai.com/static-rsc-4/O6HRcPvzjtd9A7stcrw3NR_-Hpii_O7DDGuKP0Nwz7xkbprmRvJFRqxWZrUGxU8QuCyEfgxScBa_OiHMq7UuzILHnH1TPlIKFst11OIDGTEQhASmYRKIsy4eowwne-oQoJrwu1otvVbf83J7eOJPUMVY-sHs3hFBmL7M0nJWZS4?purpose=inline)

2\. Authorization：判斷權限

系統確認你是醫師後，還需要檢查你是否有權查看這位病人的病歷。

解決的是「即使知道你是誰，你有沒有權限做這件事？」。

[HP USB Keyboard and Mouse Healthcare Edition -](https://images.openai.com/static-rsc-4/0dcujOO9MqPFUJBQmeI2Wg61Es67iSwmMPRtpu5TTNbWbsdv_GYCPVf2HIsOOgcCyRSkEs775TJ_i4w3UJtqYgMTEg0-0Te3jPcMxwLlmWATSzaITQITCVjGf3PoUaakSfukRdoVQrNpfTusdI2DkP9MF2kuixojzcXNdGf7f9c?purpose=inline)

3\. Session：管理持續操作

你登入後，通常不需要每點開一頁就重輸密碼。但當你登出、閒置過久或工作階段失效，就需要重新驗證。

解決的是「如何在多次操作之間安全地維持狀態？」。

把它們整理成一張表：

| 概念             | 白話問題        | 醫院例子             |
| -------------- | ----------- | ---------------- |
| Authentication | 你是誰？        | 確認是王醫師           |
| Authorization  | 你能做什麼？      | 判斷可否讀取病人甲的病歷     |
| Session        | 如何維持這次操作狀態？ | 管理登入後的識別資訊、效期與登出 |

注意：醫師並非一定可以看所有病歷，必須依醫院的存取政策、醫療照護關係與適用規範判定。

## 二、Authentication：登入只是確認身分

想像你到銀行櫃檯辦理業務。

行員首先會確認你的身分證件，目的不是決定你可以領多少錢，而是先確認你究竟是誰。

網站登入也是同樣道理。

常見的身分驗證方式包括：

- 密碼：證明你知道某個祕密。
- OTP（一次性密碼）：使用簡訊或驗證器產生的驗證碼。
- Passkey（通行密鑰）：利用密碼學金鑰完成身分驗證，常結合裝置解鎖。
- MFA（多因素驗證）：組合不同類別的驗證因素，提高冒用難度。

例如，你使用帳號與密碼登入公司的文件系統，系統成功確認你是員工 A。

但這只代表：

> 系統已確認目前提出要求的人，是通過驗證的 A。

它沒有直接代表：

- A 可以查看所有公司的文件。
- A 可以刪除其他人的文件。
- A 可以下載整個客戶資料庫。

這就是為什麼身分驗證與授權必須分開。

## 三、Authorization：已經登入，還要確認能不能做這件事

假設一家保險公司有十位員工，每人負責不同客戶的理賠案件。

員工 A 負責案件 `CASE-101`，員工 B 負責 `CASE-202`。

他們都成功登入，而且都是「理賠專員」。那麼 B 能不能直接查看 A 的案件？

不一定。即使兩個人職稱相同，也不表示可以存取相同的資料。

以下是假設的權限政策：

| 使用者 | 目標資料     | 操作 | 結果 |
| --- | -------- | -- | -- |
| A   | CASE-101 | 查看 | 允許 |
| A   | CASE-101 | 匯出 | 允許 |
| B   | CASE-101 | 查看 | 拒絕 |
| B   | CASE-101 | 匯出 | 拒絕 |
| B   | CASE-202 | 查看 | 允許 |

實際系統可能還有主管複核、案件交接、代理人等規則，但不能因為某人是主管，就自動假設他有權看全部資料。

### 1. 授權真正需要判斷哪些事情？

可以拆成四個因素：

Subject（主體）

誰提出要求？

Resource（資源）

想存取哪筆資料？

Action（動作）

想讀取、修改或匯出？

Context（情境）

是否符合時間、案件關係等條件？

例如，系統需要判斷：

> 員工 B，現在是否有權匯出 CASE-101？

不是只有判斷「B 是不是理賠專員」。

### 2. 三種常見權限設計

| 模型                                       | 白話說明       | 例子                   |
| ---------------------------------------- | ---------- | -------------------- |
| RBAC（Role-Based Access Control）          | 按角色分權限     | 會計可使用報帳功能            |
| ABAC（Attribute-Based Access Control）     | 按各種屬性和條件決定 | 只有特定部門、符合案件狀態的員工可以核准 |
| ReBAC（Relationship-Based Access Control） | 按人與資源的關係決定 | 案件負責人、被指派的複核者可以查看案件  |

這三種模型不是非此即彼。大型系統通常需要組合。

例如 RBAC 確定你具有「理賠專員」資格，ReBAC 再判斷你和特定理賠案件的關係。

OWASP 建議採用最小權限（Least Privilege）、預設拒絕（Deny by Default），並針對每一次存取要求檢查權限。

[image](https://www.google.com/s2/favicons?domain=https://cheatsheetseries.owasp.org\&sz=32)

OWASP Cheat Sheet Series+1



### 3. 為什麼只隱藏按鈕非常危險？

假設系統提供這兩個 API：

```
GET /api/cases/101
GET /api/cases/101/export
```

第一個讀取資料，第二個匯出資料。

開發者可能想：「B 不能匯出 A 的案件，那就不要讓 B 看到匯出按鈕。」

問題是，使用者並不一定要透過畫面按鈕才能對伺服器提出請求。

他可以使用其他 HTTP 用戶端要求匯出；如果伺服器沒有檢查權限，資料仍可能外洩。

因此，權限必須落實在真正處理資料的地方。

安全的資料存取判斷流程

概念性流程圖。實作時應在每個受保護入口及相應資料存取路徑執行授權控制。

這也解釋了兩種常見的安全問題：

Horizontal Privilege Escalation（水平越權）：B 和 A 同級，但 B 卻能查看 A 的私人資料。

Vertical Privilege Escalation（垂直越權）：一般員工取得原本只有管理員才能使用的功能。

## 四、Session：為什麼登入一次，就能連續操作？

這裡要先理解 HTTP 的特性。

HTTP 本身基本上是 Stateless（無狀態）的，也就是各次請求獨立，協定不會自動記住「這一個請求跟剛才那個請求是不是同一個人」。

那為什麼你登入購物網站後，點開商品、加入購物車、查看訂單，不必每次重輸密碼？

因為網站建立了管理使用者持續互動狀態的機制。

### 1. Session 怎麼運作？

以常見的伺服器端 Session 為例：

使用者瀏覽器

保存 Session Cookie

網站伺服器

保存 Session 紀錄

瀏覽器送出 Cookie，伺服器驗證 Session 是否有效

伺服器端概念紀錄（示意）

Session ID → 隨機不可預測的識別值\
User       → A\
Created    → 建立時間\
Expires    → 失效時間\
Revoked    → 是否已撤銷

流程是：使用者完成身分驗證，伺服器建立 Session，瀏覽器保存其識別資訊，之後提出請求時附上這個識別資訊。伺服器判斷 Session 是否有效，並且仍然需要檢查資料存取權限。

Cookie 是瀏覽器儲存和傳送資訊的機制；Session 是管理持續互動狀態的概念；Token 是可用於識別或授權的憑證形式。三者相關，但不能畫上等號。

### 2. Session 必須有生命週期

假設你登入網路銀行後離開電腦。

如果登入狀態永久有效，就可能讓其他使用那臺電腦的人繼續操作你的帳戶。

所以安全設計通常需要：

| 控制               | 白話說明                   |
| ---------------- | ---------------------- |
| Idle Timeout     | 一段時間沒有活動，工作階段失效        |
| Absolute Timeout | 即使持續使用，到達最長期限仍須失效或重新驗證 |
| Logout           | 使用者主動登出，使相關工作階段失效      |
| Revocation       | 系統主動撤銷工作階段或憑證          |
| Reauthentication | 遇到敏感操作或風險事件，要求再次驗證     |

這些不是統一設定為幾分鐘就適合所有系統。銀行轉帳、購物網站、醫療系統，需要依照風險和使用情境設計不同政策。OWASP 也指出，工作階段識別資訊若遭竊取，可能導致 Session Hijacking（工作階段劫持）。

[image](https://www.google.com/s2/favicons?domain=https://cheatsheetseries.owasp.org\&sz=32)

OWASP Cheat Sheet Series



常見的 Cookie 保護屬性有 `Secure`、`HttpOnly`、`SameSite`。它們分別協助限制傳輸方式、JavaScript 存取以及跨網站請求時的 Cookie 傳送行為，但仍不能取代完整的授權與其他安全防護。

還有一個容易搞混的觀念：Session 可以存在於未登入的情境。 例如匿名訪客選擇了網站語言或暫存購物車，系統也可能維持一個匿名工作階段。

## 五、換成不同行業，再比較一次

| 產業       | Authentication | Authorization    | Session         |
| -------- | -------------- | ---------------- | --------------- |
| 銀行       | 確認客戶身分         | 能否查詢該帳戶、執行轉帳     | 維持及限制網銀登入狀態     |
| 大學       | 確認教師或學生身分      | 教師能否修改某門課的成績     | 管理教務系統工作階段      |
| 電商       | 確認會員身分         | 能否查看某筆訂單、申請退款    | 維持會員操作與購物車      |
| 工廠       | 確認操作人員身分       | 能否修改特定設備參數       | 控制操作台的有效登入      |
| AI Agent | 確認使用者或服務身分     | 能否呼叫工具、讀取文件、執行動作 | 管理對話或工具執行中的安全狀態 |

其中，AI Agent 特別值得留意。

假設公司開發了一個可以搜尋文件的 AI Agent。員工 B 要求：「幫我整理 A 所負責客戶的全部合約。」

Agent 即使正確識別了 B，也不能因此直接搜尋所有文件。

授權控制必須延伸到實際的文件檢索、資料庫查詢、工具呼叫和匯出操作。單純在 System Prompt 寫上「不可讀取未授權資料」，不足以成為可靠的存取控制。

## 六、教材中的 Streamlit：有 Session State，不代表有安全登入

這是本節容易產生誤解的地方。

教材使用 Streamlit 原型。Streamlit 提供 `st.session_state`，可以保存某個使用者工作階段內的互動狀態，例如選擇的檔案、畫面欄位或操作結果。

但它本身並不代表已經完成正式的身分驗證或資料授權。

另外，Streamlit 也提供 `st.login()`、`st.user` 和 `st.logout()`，可以整合 OpenID Connect（OIDC）身分驗證。這仍然不會自動完成你的業務資料授權。

[image](https://www.google.com/s2/favicons?domain=https://docs.streamlit.io\&sz=32)

Streamlit Docs+1



因此要分清楚：

| 功能                 | 能證明什麼？                  |
| ------------------ | ----------------------- |
| `st.session_state` | 應用程式保存了工作階段的互動狀態        |
| `st.login()` 等登入功能 | 可建立身分驗證流程，需正確配置         |
| 應用程式自己的權限規則        | 判斷特定使用者是否能操作特定資源        |
| 工作階段安全治理           | 需要額外檢查失效、撤銷、重新驗證等要求是否滿足 |

不能因為畫面能記住使用者代號，就宣稱系統已經支援十個人安全共用。

## 七、怎麼把這堂課變成實際的軟體規格？

原始教材要求把「十人共用版」的候選安全控制寫進 `architecture.md`，而且要明確保留尚未實作的狀態。

以下是一個可以參考的版本：

```

## 多人共用版安全設計（候選規格）

狀態：待實作／待驗證

### 1. Authentication
- 使用者身分來源：待決定
- 登入及驗證方式：待決定

### 2. Authorization
- 每筆案件有明確的授權關係
- 讀取、修改、匯出分別檢查
- 伺服器端執行授權檢查
- 未明確允許的存取預設拒絕
- 拒絕時不得回傳未授權資料內容

### 3. Session
- 工作階段建立與效期：待設計
- 閒置逾時與登出：待設計
- 權限撤回後的處理：待設計
- 敏感操作重新驗證：待設計

### 4. 負向測試
- B 讀取 A 的私人案件 → 拒絕
- B 匯出 A 的私人案件 → 拒絕
- 未登入讀取私人案件 → 拒絕
- Session 失效後存取 → 拒絕
- 權限撤回後再次存取 → 拒絕

以上均尚未執行，不得標記測試通過。

```

這份規格最重要的目的不是讓文件看起來完整，而是讓開發團隊清楚知道：哪裡需要檢查、什麼情況必須拒絕、哪些安全能力尚未驗證。

## 八、最後的理解檢核

假設一家律師事務所建立了一個案件管理系統，三位使用者分別是 A 律師、B 律師及 C 行政人員。

A 負責案件 X，B 負責案件 Y，C 負責部分案件的行政協助。三個人都成功登入系統。

1\. B 律師將案件網址中的 Y 改成 X，伺服器卻直接回傳 X 的內容。最主要是哪一類安全問題？

A. Authentication 缺失

B. Authorization 缺失

C. Session Timeout 過長

D. Cookie 格式錯誤

2\. C 行政人員已登入系統，卻不能下載某份文件。這一定代表系統有問題嗎？

A. 一定有，登入就應允許下載

B. 不一定，可能是正確的授權限制

C. 一定是 Session 失效

D. 一定是 HTTPS 沒有啟用

3\. A 離職後，原本建立的有效工作階段仍可繼續讀取案件。你最應優先檢查哪個設計？

A. UI 配色

B. 檔案命名

C. Session 及授權撤回機制

D. 網頁響應式排版

提交答案並取得解析

本課最值得記住的判斷原則：系統不只要確認「誰在操作」，還必須在真正存取資源的地方，判斷「現在是否允許這個人執行這個動作」。

這才是從個人原型走向安全多人系統的重要門檻。