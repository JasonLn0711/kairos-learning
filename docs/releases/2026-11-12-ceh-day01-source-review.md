# CEH C17–C29 一手來源查核

查核日：2026-11-12。此紀錄支持教材編輯；各機構的適用法律、合約及認證轉版仍須個別確認。兩份使用者原稿與十三張圖保存在[來源目錄](../sources/ceh-notes/2026-11-12/controls-risk-supplement/README.md)，原文與採用稿分開保留。

| 主張 | 一手依據及本次查核結果 | 編輯邊界 |
| --- | --- | --- |
| 現行媒體清理指南 | [NIST SP 800-88 Rev. 2](https://csrc.nist.gov/pubs/sp/800/88/r2/final)於2025-09-26發布，取代2014年的Rev. 1。[正式PDF](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-88r2.pdf)§3.1定義Clear／Purge／Destroy；§3.2討論cryptographic erase；§4.5.1／4.5.2區分Verification與Validation。 | 工具成功不等於清理有效；SSD消磁的反例確實出自§4.5.2。依媒體、資料及核准政策選擇方法，不保證未來任何技術均無法復原。 |
| 安全控制家族 | [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)的維護版本Release 5.2.0於2025-08-27發布。 | 維護版本與Revision分開標示；不將通用控制目錄宣稱為所有產業的直接法定義務。 |
| 27001／27002／27005的分工 | [27001](https://www.iso.org/standard/27001)為ISMS要求；[27002:2022](https://www.iso.org/standard/75652.html)提供控制實作指引；[27005:2022](https://www.iso.org/standard/80585.html)第4版提供風險管理指引。 | 本次閱讀官方公開摘要與版本資料，未取得付費標準全文；不能宣稱已逐條審閱完整規範。圖中的閱讀順序屬教學安排。 |
| 控制項計數 | [ISO/IEC JTC 1/SC 27 Journal，第2卷第2期，2022-12更新](https://committee.iso.org/files/live/sites/jtc1sc27/files/resources/ISO-IEC%20JTC%201-SC%2027_N22755_SC27%20Journal%20Vol%202%20Issue%202%20%28update%20Dec%202022%29.pdf)第13頁由標準編輯說明：組織37、人員8、實體14、技術34，共93項。 | 圖表寬度依實際數量；計數不代表每個組織一律套用全部控制。 |
| 隱私管理系統版本 | [ISO/IEC 27701:2025](https://www.iso.org/standard/27701)第2版於2025-10發布，官方生命週期列2025-10-14；官方FAQ確認可獨立運作。 | 不再只把新版說成27001的延伸；2019版撤銷與既有證書轉版期限是不同事項。 |
| 臺灣個資法與安全措施 | [個人資料保護法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0050021)2025-11-11修法包含尚待施行部分；教材使用的第11、19、20條不在該待施行條文清單。[施行細則](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0050022)第12條說明技術及組織措施。 | 分清蒐集／處理／利用條件、刪除義務及例外；法律上的刪除與特定媒體清理技術分別判斷。 |
| 銀行內控規範 | [金融控股公司及銀行業內部控制及稽核制度實施辦法](https://law.fsc.gov.tw/LawContent.aspx?id=FL049894)現列2026-05-06修正；第55條對第44–47條另訂施行日期。 | 不將整份修正一概說成尚未施行，也不以ISO指引取代法定內控。 |
| 真實檢查案例 | [金管會檢查局113年度上半年票券金融公司主要檢查缺失](https://www.feb.gov.tw/userfiles/file/113%E5%B9%B4%E5%BA%A6%E4%B8%8A%E5%8D%8A%E5%B9%B4%E7%A5%A8%E5%88%B8%E9%87%91%E8%9E%8D%E5%85%AC%E5%8F%B8%E4%B8%BB%E8%A6%81%E7%BC%BA%E5%A4%B1.pdf)印刷第8頁確有儲存設備報廢清理不足，以及移用硬碟未列財產清冊的缺失。 | 公開案例對象為票券金融公司；文中列舉格式化／消磁等方式，仍須依實際媒體驗證，不能推成任何格式化或SSD消磁皆有效。 |
| 刪除與破壞 | [MITRE ATT&CK T1485](https://attack.mitre.org/techniques/T1485/)區分檔案指標刪除與資料覆寫。[OWASP Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)支持適當加密模式及金鑰治理。 | 攻擊技術分類、正當資料清理及法律義務是三個不同用途。 |
| NIST隱私框架 | [官方首頁](https://www.nist.gov/privacy-framework)查核時仍明列1.0正式資料及1.1 Initial Public Draft。 | 保留供稿引用的1.0，不把1.1草案寫成已發布正式版。 |

加州法條官方LegInfo的§1798.81及§1798.100頁面，本次工具回應403，未宣稱直接回讀該站完整現行正文。改讀[CPPA官方CCPA法條彙編](https://www.cppa.ca.gov/regulations/pdf/cppa_act.pdf)§1798.100(c)、(e)，確認必要性／比例性及合理安全措施；§1798.81則以[加州司法部公開訴狀](https://oag.ca.gov/system/files/attachments/press-docs/Walmart%20Complaint.pdf)第129段交叉確認客戶紀錄處置要求。彙編及歷史訴狀支持概念與法條定位，個別機構落地仍須核對最新法條及適用門檻；不將訴狀指控當作已確定的裁判事實。

風險互動採1–5的教學序位尺度，乘積1–25用來比較同一模型中的優先順序；它不代表金額損失、真實機率或倍數比例。分級門檻是教材設定，與組織核准的風險準則分開標示。瀏覽器結果不寫入學生成績或機構風險登錄。
