# 來源、採用與查核對照

供稿與圖片於 2026-11-06 保存；雜湊及位元組數見 [source-hashes.json](source-hashes.json)。公開中英全文與原始附件分開保存。完整內容由此 repo 擁有；本次稀缺資源為編輯／驗證時間，範圍限新版 C07、圖示及受影響的發布狀態測試，不修改其他教材正文、學習紀錄或個人評分。Planning 只需要本回執定位與下一關卡，詳細原稿留在此專案。

## 逐章逐小節採用

兩語的 section-* 及 section-*-sub-* 錨點一致。各節原理、比喻、案例與判讀界線均在正式正文，並非只留摘要。

| 原稿位置 | 正文錨點 | 完整保留的教學內容與呈現 |
| --- | --- | --- |
| 開頭主旨 | 正文摘要及首段 | 身分、操作、這次授權範圍限制可見結果；公司設備統一案例 |
| 一、用途 | section-1 | 醫院 100 台交換器／20 台路由器，主管問題、逐台巡查負擔、中央監控、三種詢問例子、與 SSH／遠端桌面差異；附圖放在中央監控解說之後 |
| 二、四名詞 | section-2 | Manager／Agent／MIB／OID 四欄位比喻對照；Agent 與 AI Agent 區分 |
| 二、1 MIB | section-2-sub-1 | sysName、sysLocation、sysUpTime 欄位表、型別及存取規格；人事資料規格不等於完整資料副本 |
| 二、2 OID | section-2-sub-2 | sysName.0 完整數字、三個 OID 與用途對照、樹狀路徑、純量 .0 與表格索引 .1／.2 |
| 三、查詢操作 | section-3 | GET／GETNEXT／WALK／SET 個別櫃檯比喻、下一個可存取而非加一、WALK 非獨立 PDU、GETNEXT／GETBULK 工具差別；讀／寫不同授權與 UDP 161／162 慣例 |
| 四、版本 | section-4 | 醫院管理員的兩個問題：資格與通訊可見性 |
| 四、v1／v2c | section-4-sub-1 | community string、public／private 名稱不授權、明文觀察位置與設定條件 |
| 四、v3 | section-4-sub-2 | 三個 USM level 表、authNoPriv 完整性、authPriv 機密性、三種信件比喻、演算法設定與存取權限分離 |
| 五、view | section-5 | 三項合成資料、monitor-a 與 admin-b 同設備讀取差異；表格明示位置限制及寫入證據界線，保留問答推理：第一位查不到無法證明位置未設定 |
| 五、VACM | section-5-sub-1 | 身分、群組、安全模型／層級、context、操作；Read／Write／Notify 三種 view；read-write 規格與人事表格可編輯比喻 |
| 六、回覆 | section-6 | 四種回覆表與各自不存在的推論界線、協定例外與 timeout 區分、四個圖書館比喻 |
| 六、重要性 | section-6-sub-1 | 未見／無權看／確認不存在三種證據狀態，連回 SMB、NFS、LDAP／AD |
| 七、合成案例 | section-7 | 四筆查詢整表、monitor-a authNoPriv、管理者核對 read view、另一身分取得位置、未執行 SET／無 write view、四段推理 |
| 七、TimeTicks | section-7-sub-1 | 60000 ÷ 100 = 600 秒 = 10 分鐘；管理部分重新初始化與整機重開機的證據差異 |
| 八、CEH | section-8 | 授權盤點資訊範圍、列舉／控制權／可利用漏洞分別、韌體版本後續比對型號／版本／修補／配置 |
| 八、醫院防護 | section-8-sub-1 | 需求、來源、v3 authPriv、OID 最小權限、正常與受限查詢驗收、安全層級、憑證不公開、工作所需資訊 |
| 九、框架 | section-9 | 四層表：可達性→通訊保護→讀取→寫入；每層條件完整，成立一層不推導全成立 |
| 十、檢核 | section-10 | authNoPriv 加密誤判、A／B 位置可見性設定、read-write 與 GET 不證明 SET；保留三題提示與後續 LDAP／AD 銜接，不製造個人作答紀錄 |

## 原文修正與格式正規化

- 原文「我們把原本的五筆紀錄放在一起看」實際只有四筆 GET。正文改為「以下四筆查詢紀錄」，沒有新增虛構第五次要求。
- Google favicon 與「IETF Datatracker+1」等引用介面殘留移除，改為實際可開啟的第一手規格／工具手冊連結，放在對應節末。
- 原 LaTeX 逸出公式改為可選取的算式，數字、單位及推導維持。
- 扁平的 OID、USM、MIB view、查詢紀錄、四層框架改成具表頭的 HTML 表格；八個原 ### 小節保留 h3。GET 等四操作仍直接顯示完整解說及比喻。
- 原圖 monitor 藍色、三種設備綠色、共用分支、GET 向下／回覆向上、SNMP Agent 授權回答皆保留。桌面為一對三；手機在共同邊界內重排三個平行設備，文字說明方向與平行關係。下載 SVG 保留桌面配置；新增圖說指出線段不是實際布線。
- 原「提交答案並請你批改」改為帶到教學討論請老師批改，明示網頁不傳送或儲存答案。三題與提示均保留，qa=[]，沒有新增未授權作答或自動評分。
- 新版路線先前 C07 尚無正文，首次版號 v1.0.0。已退休舊 SNMP 的舊 ID、版本、發布日及原檔繼續保存在 legacy archive，不混為新頁歷史。

## 第一手查核（2026-11-06）

- [RFC 3418](https://www.rfc-editor.org/rfc/rfc3418.html)：三個 system OID 與 sysUpTime 的 management portion 定義。
- [RFC 3416](https://www.rfc-editor.org/rfc/rfc3416.html)：GET／GETNEXT／SET 與 noSuchObject／noSuchInstance／endOfMibView 的不同操作語意。
- [RFC 3415 VACM](https://datatracker.ietf.org/doc/html/rfc3415)：身分、context、security level 與 read/write/notify view。RFC Editor 初次請求 429，使用 IETF Datatracker 正式全文完成查核。
- [RFC 3414 USM](https://datatracker.ietf.org/doc/html/rfc3414)：認證、完整性與隱私的區分。保留演算法及設定需另核對的界線，不把早期演算法宣稱為今日推薦組合。
- [RFC 3417](https://www.rfc-editor.org/rfc/rfc3417.html)：UDP 161／162 與其他傳輸對應。
- [Net-SNMP snmpwalk](https://www.net-snmp.org/docs/man/snmpwalk.html)／[snmpbulkwalk](https://www.net-snmp.org/docs/man/snmpbulkwalk.html)：分別使用 GETNEXT 與 GETBULK；沒有將 WALK 寫成 PDU。

沒有執行網路列舉或 SET；本教材合成案例不代表任何醫院真實配置。未驗證讀者理解、實體設備或實體手機；正式部署及頁面回讀另見發布回執。
