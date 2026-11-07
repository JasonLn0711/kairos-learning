# M04-10 逐節採用與圖意核對

查核日：2026-11-07，Asia/Taipei。兩語完整對應以下教學單位；原稿中的介面文字與正文分開處理。

| 原稿單位 | 成稿錨點 | 保留內容及編輯處理 |
| --- | --- | --- |
| 開場 | 正文開頭 | 正確的人／條件／所需資料；伺服器三種業務需要；關機陷阱與安全及可用性。 |
| 一、列舉危險 | section-1 | 問櫃檯的部門、人員、位置與設備比喻；目標發現與正常查詢；Finance 三權限改成圖 1 的平行 HTML 節點。 |
| 二、四個關卡 | section-2 | 大樓比喻與四項問題、入口／證件／鑰匙／公事包逐項保留於圖 2；箭頭表示解釋順序，明示真實傳輸保護可先於登入。 |
| 問題 A／B | section-2-sub-1／2 | 登入不等於授權；員工／財務群組例子；TLS 及憑證條件與錯誤收件人例子。 |
| 三、最小權限 | section-3 | 清潔人員／保險箱比喻；四列角色表；SNMP 監控帳號、外洩及超額權限。 |
| 四、協定統整 | section-4 | DNS、SMB/NFS、LDAP/AD、SNMP、FTP、SMTP、NTP、RPC/NetBIOS 八列用途與限制全文。 |
| SNMPv3 例子 | section-4-sub-1 | authPriv 的通訊保護與 VACM、read view/write view 的權限區別。 |
| SMB 例子 | section-4-sub-2 | signing、encryption、access control 三個寄件比喻與不可互換界線。 |
| 五、驗收 | section-5 | 公告／財務政策、三身分切換與普通員工越權觀察；Positive/Negative Test；全封鎖造成財務業務失效的三案例。 |
| 六、逾時 | section-6 | Connection timed out 原字串；五種可能原因；來源、目的、時間、測試內容及規則／流量紀錄交叉佐證。 |
| 七、日誌告警 | section-7 | 監視器／警報比喻；一分鐘數百次查詢與人事同步反例；六項調查條件；記錄不等於阻止。 |
| 八、方法 | section-8 | 六個步驟完整保留編號，呈為既有清單；M04 技術／政策／證據三層連結與正確允許拒絕。 |
| 九、檢核 | section-9 | 兩項政策、兩邊失敗且無日誌的完整情境、同事判斷與三個開放問題；新增 answer-m0410 參考解析，無評分提交功能。 |

## 圖示設計與差異

1. **image-1 → rights**：保留同一 Finance 資料夾的三種平行能力。桌面三欄、窄版堆疊，無箭頭，不以位置暗示權限自動繼承。省略原圖裝飾圖示，保留全部實質文字。
2. **image-2 → controls**：保留四張直向卡片與三個箭頭；第四張維持「項」而非宣稱協定第四步。圖說直接可見，解釋 TLS 可先建立；沒有把模型當封包交換順序。
3. **image-3 → acceptance**：原圖明確顯示普通員工合成越權結果，保留預設選項、政策、觀察、判定及有效權限修正。原附件未顯示訪客與財務選中結果，成稿明列新增的合成假設：訪客兩類讀取都拒絕；財務兩類讀取均允許。所有三案例同時留有靜態全文，無 JS 停用控制，預設普通員工仍可讀。下載圖呈現全部案例，沒有偽裝成互動截圖或實測。

## 編輯修正與查核

- 原稿跳脫的粗體及 `&#x20;` 僅作格式正規化；保留原始檔不動。
- 「提交答案並請老師評分」改為既有原生參考解析；未建批改服務，不宣稱送出、評分或理解完成。
- 兩個新增角色結果及三段參考答案是編輯新增的合成教學，與原圖實際顯示結果分開說明。
- [RFC 3414](https://www.rfc-editor.org/rfc/rfc3414.html) 支持 SNMPv3 USM 訊息安全；[RFC 3415](https://www.rfc-editor.org/rfc/rfc3415.html) 支持 VACM read/write/notify view，權限與認證分開。
- [Microsoft SMB security](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security) 支持簽章／加密的不同目的；[RFC 5936](https://www.rfc-editor.org/rfc/rfc5936.html) 支持 AXFR 應另行控制。這些來源查核支持概念，沒有測試真實伺服器。

HTML、搜尋與六份 SVG 使用相同受驗證 visual 資料。生成器沿既有字元換行與 SVG sanitizer，沒有新增任意標記入口。下載 SVG 為直向固定版面；正文依容器重排。
