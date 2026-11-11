# CEH M01｜用白話文理解倫理駭客、CIA 與安全控制

你提供的內容標示為「27 題」，但目前實際貼出的是 9 題，而且全部屬於 M01（倫理駭客入門），尚未包含 M20 密碼學。

這 9 題看似不同，實際上只考三個核心觀念：

1. 倫理駭客與授權：為什麼有人入侵系統是犯罪，有人卻是在合法執行滲透測試？
2. CIA 資訊安全三要素：資訊被偷看、被竄改、無法使用，分別代表什麼？
3. 安全控制與縱深防禦：保全、門禁、防火牆、防毒軟體與加密，各自負責什麼？

先把這三個觀念理解清楚，你就能回答這組題目，不必死背九組英文敘述。

## 一、先看答案與題目對應關係

| 題號      | 答案                                  | 核心觀念         |
| ------- | ----------------------------------- | ------------ |
| EC-Q001 | D. White Hat                        | 經授權的白帽駭客     |
| P1-Q003 | B. Confidentiality                  | 資訊保密性        |
| P3-Q113 | C. Security Guard                   | 實體安全控制       |
| EC-Q054 | C. White Hat                        | 與第 1 題同一觀念   |
| P3-Q124 | C. Written Permission               | 測試前取得書面授權    |
| EC-Q166 | D. White Hat                        | 合法受聘的滲透測試人員  |
| EC-Q189 | C. Permission                       | 授權是核心區別      |
| EC-Q331 | B. Identify and fix vulnerabilities | 找出並促成修補漏洞    |
| EC-Q476 | C. Authorized security professional | 經授權的安全測試專業人員 |

這些是依據題目敘述選出的最佳答案。其中第 5 題的 written permission 是正確的考試與實務方向，但完整的合法性還涉及授權者權限、測試範圍與適用法律。

## 二、為什麼有人駭入系統是犯罪，有人卻是白帽駭客？

[ShieldSense | AI-Driven Unified Cybersecurity](https://images.openai.com/static-rsc-4/yy2U8JDfovaz_aJ3nmEj7YPqtX2KiuScCSVAjSz_BSRkqmmXk4i8UJnvYJDtCYyT2NKofg001C9y77Gclh8WaBvLJlTB5bmZJnJVzcQRgMgbmAys2cWTRwhUuDGSTXSXoN8voY68lLOXTOFjM85J1QwvzI_F6qh6UDp3mRJH6wc?purpose=inline)

[Data Center Security Guard Services | American Global Security](https://images.openai.com/static-rsc-4/V3oCUQxcGKcIv_l7eGIoUhJ0U4LFqT1Z8Ho6jI7ee80c6mr_m52aWPNgUhgJfYA7A3p_zB1T0i56Q8_EscJHNCHGEcgInfaApDLQUvEmy6j9frGqWuK2-QbHVl8Xe6JbvZ-9s6Z1St0eBiK5yDFblFiF_4jHdXf3_Mox_CdS_t8?purpose=inline)

[人手不足50.6%が4年連続半数超｜飲食・宿泊は改善、情報サービスは高止まり【帝国データバンク2026年4月調査】 | AIとDXの専門家があなたの事業を加速する - GXO](https://images.openai.com/static-rsc-4/STtvlWt9ljmqw5g0cICxvXKgZ1oK-MGn6cbkWWOkCWPAWkBfrBeZemqTNAzl4JhJSTJlxZ1W3ddnw8-ohzS-9lC98oCiPWo_74PNnh9v3klNsi-RLdgUjL-QGYmrVB1y_UMhSy2aYywK9QlNHF3rt1JGvy_3YvrrwIYaf2w557g?purpose=inline)

8

想像你經營一家銀行，想知道銀行的金庫夠不夠安全。

你找來一位專業開鎖師傅，告訴他：「我想請你測試金庫的鎖，看小偷能不能打開。」

師傅用工具成功打開金庫，這是不是犯罪？

不能只看他有沒有打開金庫，還要看他是否得到有效授權，以及是否遵守授權範圍。

這就是倫理駭客（Ethical Hacking）的核心。

### 1. White Hat、Black Hat 與 Grey Hat 有什麼不同？

| 類型                 | 白話解釋            | 典型情況             |
| ------------------ | --------------- | ---------------- |
| White Hat 白帽       | 經授權幫忙找漏洞        | 公司聘請滲透測試人員       |
| Black Hat 黑帽       | 未經授權，基於惡意目的入侵   | 偷資料、勒索、破壞系統      |
| Grey Hat 灰帽        | 可能沒有惡意，但缺乏授權    | 未經同意測試別人網站，再通知站長 |
| Script Kiddie 腳本小子 | 依賴現成工具、技術理解通常有限 | 不懂原理就直接執行攻擊工具    |

注意，Grey Hat 不代表合法；Script Kiddie 描述的是技術能力或行為方式，不是法律身分。而 Blue Hat 並沒有在所有教材中完全一致的定義，不適合當成通用的法律或職業分類。

### 2. 有授權就能做任何測試嗎？

不行。

假設公司授權你：

- 測試 `192.0.2.10` 這部伺服器。
- 只能在星期六上午 10 點至下午 2 點執行。
- 不可以進行阻斷服務（DoS）測試。

你卻發現旁邊的 `192.0.2.11` 也有漏洞，便順便進去測試。

即使你是公司聘請的白帽駭客，這項額外測試仍可能超出授權範圍。

這就是為什麼需要 Rules of Engagement（ROE，交戰規則）。

滲透測試的基本流程

取得有效授權

誰有權同意測試？

定義 Scope 與 ROE

測什麼？何時測？哪些方法禁止？

在授權範圍內測試

識別漏洞，控制影響，保留必要證據

報告、修補、複測

證明風險，追蹤改善效果

NIST 將 ROE 定義為測試開始前建立的詳細規則與限制。美國政府的滲透測試實務也要求雙方事先約定範圍、時段、限制與通報方式。

[image](https://www.google.com/s2/favicons?domain=https://csrc.nist.gov\&sz=32)

CSRC+1



因此，對應到這組題目：

EC-Q001、EC-Q054、EC-Q166、EC-Q476 都在考「獲得授權的安全測試者」這個概念，只是換了不同問法。

EC-Q189 強調最核心的區別是 permission（授權），而不是使用不同工具。白帽與黑帽甚至可能使用相同工具。

P3-Q124 考 written permission（書面授權）。實務上應在執行前取得可驗證的正式授權文件，而不是只依賴口頭同意。書面形式並非所有司法管轄區一律適用的單一合法標準。

EC-Q331 考倫理駭客的目標：找出漏洞並協助組織降低風險，而不是破壞或偷竊。測試人員通常負責發現、驗證與提出修補建議，不一定親自修改系統。

## 三、CIA 三要素：資訊安全究竟在保護什麼？

對應題目：P1-Q003

資訊安全不只是「不要讓駭客進來」。

想像你經營一家醫院，電腦裡存放所有病人的病歷。

# C

Confidentiality

保密性

不該看的人不能看

# I

Integrity

完整性

資料不能被擅自改壞

# A

Availability

可用性

需要時可以正常使用

這三項是資訊安全最基本的保護目標，也是 NIST 所採用的核心概念。

[image](https://www.google.com/s2/favicons?domain=https://www.nccoe.nist.gov\&sz=32)

NIST SP 1800-26 documentation

### 1. Confidentiality：保密性

醫師把病歷寄給另一家醫院，卻使用沒有加密的通訊方式。

結果，其他人只要攔截流量，就可能看見病人的姓名、病史與診斷結果。

這是 保密性出了問題。

題目中的關鍵字是：

`clear text`（明文）、`intercepting traffic`（攔截流量）、`unauthorized individuals view`（未授權者查看）。

因此 P1-Q003 選 B。

常見的保護方式包括傳輸加密（例如適當設定的 TLS）、資料加密與權限控管。注意，傳輸加密與端對端加密並不完全相同。

### 2. Integrity：完整性

假設病人的血型原本是 A 型，有人擅自把資料改成 B 型。

即使沒有其他人偷看病歷，資料也已經不可信。

這是完整性問題。

常見保護措施包括雜湊驗證（Hash）、數位簽章（Digital Signature）、存取權限與資料變更稽核。

### 3. Availability：可用性

假設醫院的掛號系統遭受阻斷服務攻擊，所有醫師與病人都無法登入。

資料可能沒有外洩，也沒有被修改，但系統不能正常提供服務。

這是可用性問題。

常見措施包括備援、流量防護、故障轉移與災難復原。

### 4. 那 Non-Repudiation 是什麼？

這是 P1-Q003 的另一個選項。

Non-Repudiation（不可否認性）是指：能提供適當證據，使某個人或系統難以合理否認自己曾經執行特定行為。

例如某人簽署電子合約，之後卻聲稱：「這份合約不是我簽的。」

若系統具有可信的數位簽章、身分驗證與紀錄機制，就能提高行為的可歸責性。

它與 CIA 有關，但在考題中不是「資料遭偷看」最直接對應的答案。

## 四、Security Controls：為什麼保全也是資安的一部分？

對應題目：P3-Q113

想像你有一家存放重要客戶資料的公司。

你的伺服器防火牆設定得非常完善，也安裝了防毒軟體，但機房大門沒有上鎖。

有人直接進入機房，偷走儲存裝置。

這時候你會發現：資訊安全不只是電腦軟體的問題。

安全控制可以依實施方式分成幾個常見類型：

| 控制類型              | 白話理解        | 代表例子           |
| ----------------- | ----------- | -------------- |
| Physical 實體       | 保護實際場所與設備   | 保全、門禁、圍籬       |
| Technical 技術      | 用技術機制保護系統   | 防火牆、防毒、加密      |
| Administrative 管理 | 制定人員必須遵守的規範 | 安全政策、授權程序、教育訓練 |

P3-Q113 的正確答案是 C. Security Guard。

Security Guard（保全人員）是典型的實體安全控制。NIST SP 800-53 的 PE-3 也明確把保全人員納入實體出入控制的實施方式。

[image](https://www.google.com/s2/favicons?domain=https://nvlpubs.nist.gov\&sz=32)

NIST Publications



而縱深防禦（Defense in Depth）的想法，就是不要只依賴一道防線。

例如：

- 第一層：保全與門禁，阻止未授權人員進入機房。
- 第二層：帳號權限與多因素驗證，限制系統存取。
- 第三層：防火牆、端點防護，降低網路與主機攻擊風險。
- 第四層：加密與資料權限，降低敏感資料外洩的影響。
- 第五層：監控、事件應變與復原，處理已經發生的安全事件。

不同控制措施可以相互補強，但不能保證完全不會遭到攻擊。

## 五、這 9 題該如何複習才有效？

不建議把九題當成九個獨立知識點反覆背誦，因為其中六題主要都圍繞著倫理駭客與授權。

你可以將這份題庫縮成三張記憶卡：

主動回憶卡（Active Recall）

1 / 3

什麼條件讓滲透測試成為合乎規範的白帽行為？

先在心裡作答，再翻開答案

對應：EC-Q001、EC-Q054、P3-Q124、EC-Q166、EC-Q189、EC-Q331、EC-Q476顯示答案

&#x20;上一張下一張&#x20;

閱讀後，建議隔天、約三天後及一週後嘗試回憶；這些只是初始複習間隔，應依實際答題表現調整，不是固定適用所有人的遺忘曲線。

## 六、理解檢核：三個實際情境

這次不考你記不記得選項，而是檢查是否真的理解概念。

1\. 公司書面授權你測試 A 系統。測試時發現 B 系統可能也有漏洞，但 B 不在授權範圍內。你應如何處理？

A. 只要目的是協助公司，就可以測試 B

B. 先停止對 B 的主動測試，請求擴充授權範圍

C. 只要使用免費工具，就不算違反授權

2\. 銀行的客戶資料沒有被偷看，但攻擊者修改了客戶的帳戶餘額。主要違反 CIA 的哪一項？

A. Confidentiality

B. Integrity

C. Availability

3\. 某公司部署了加密與防火牆，但任何人都能直接進入伺服器機房。最直接缺少哪一類安全控制？

A. Physical

B. Cryptographic

C. Network

提交答案並取得解析

這份 M01 練習最值得牢記的核心是：授權決定你能不能測試，CIA 決定你要保護什麼，安全控制決定你用什麼方式保護。 理解這三者的關係，就能延伸判斷其他不同情境的 CEH 題目。