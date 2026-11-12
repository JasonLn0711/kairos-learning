# 官方來源查核與採用決策

查核日期：2026-11-12。原稿保持原樣；以下是編輯層，尚未代表正文或正式站已更新。

## 必須修正的版本與適用性

1. 供稿將《電子支付機構資訊系統標準及安全控管作業基準辦法》當作現行法規。金管會[官方頁面](https://law.fsc.gov.tw/LawContent.aspx?id=GL001541)記載於2023-04-25廢止（令號金管銀票字第11202711471號）。原第7–10條只能作歷史說明，不能直接沿用為現行義務。
2. 電支公會[自律規範索引](https://epa.org.tw/regulations/self-discipline)提供2026-09-29版[《電子支付機構資訊系統標準及安全控管作業基準》](https://epa.org.tw/uploads/regulations/pdfs/01M47H2X8FK89E4RTGBCPV9WSW.pdf)。已下載PDF並用pdftotext抽取；第一條記載依《電子支付機構管理條例》第32條第2項訂定，首頁載金管會115年9月29日函同意照辦。正文應標示為依法訂定的公會基準，不能稱為上述已廢止的「辦法」。
3. 現行電支基準第5、6條處理訊息防護與條件式不可否認性；第10條處理約定連結存款帳戶付款；第11條第1款第1目處理網際網路機敏資料全程加密，第4目處理使用者輸入與系統接收支付指示的一致性。教學改用這些定位，保留原稿希望說明的完整性、不可否認性及傳輸保護。
4. [《金融控股公司及銀行業內部控制及稽核制度實施辦法》](https://law.fsc.gov.tw/LawContent.aspx?id=FL049894)2026-05-06修正版：第12條有客戶資料保密及營運持續，第25條有CIA及事件應變；第55條指定第44–47條施行日期另定，其餘自發布日施行。正文須具體說明這個範圍，不能讓頁首「部分尚未施行」誤導為第12、25條也未生效。
5. [《電子簽章法》](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080037)第4條為功能等同及法律效力，第6條之本人簽名推定有兩項條件：主管機關許可憑證機構簽發、憑證未逾有效期間及使用範圍。技術上的有效簽章不能單獨證明全部法律條件；依法的「推定」亦不得改寫為絕對不能否認。
6. [RFC 8446資訊頁](https://www.rfc-editor.org/info/rfc8446/)已標示被[RFC 9846](https://datatracker.ietf.org/doc/html/rfc9846)取代（2026年7月）。供稿仍是正確的TLS 1.3概念，採用時保留舊號的歷史定位並引用現行文件；不擴張為網站可信、端點安全或全部中繼資料保密。
7. 銀行公會[金融業務電子化規範索引](https://www.ba.org.tw/memberStandard/index?cid=13)確認電子簽名規範公告2026-05-18及電子銀行安控基準公告2026-02-05。這是網站公告日期，不直接等同規範核議或修訂日期。[電子銀行詳情頁](https://www.ba.org.tw/memberStandard/details?id=79)附件名含1150107；[電子簽名PDF](https://www.ba.org.tw/Upload/99537959-bc87-4d24-bcb7-83c8e7767e65/52189b0b-a9c7-4bab-9b75-117e6063002d/%E9%99%84%E4%BB%B61_%E9%87%91%E8%9E%8D%E6%A9%9F%E6%A7%8B%E4%BD%BF%E7%94%A8%E9%9B%BB%E5%AD%90%E7%B0%BD%E5%90%8D%E6%A9%9F%E5%88%B6%E5%AE%89%E5%85%A8%E6%8E%A7%E7%AE%A1%E4%BD%9C%E6%A5%AD%E8%A6%8F%E7%AF%84_20240306.pdf)首頁記載112年核議、113年函洽悉；正文須保留日期性質。

## 技術及企業來源

- [NIST FIPS 186-5](https://csrc.nist.gov/pubs/fips/186-5/final)：簽章用於偵測未授權修改、驗證簽署者及向第三方提供證據。公鑰與身分的關聯、私鑰保護及流程證據仍須另行建立；HMAC的共享密鑰不提供同等第三方歸責能力。
- [NIST CSF 2.0](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957258)：PR.DS-01為靜態資料、PR.DS-02為傳輸資料，PR.IR-03為韌性、PR.IR-04為容量。這些是框架成果，企業控制是實現方法；不要將採用框架稱為普遍強制認證。
- [SEMI官方2024年E187/E188說明](https://www.semi.org/en/standards-watch-2024-mar/how-semi-e187-and-e188-standards-elevate-cybersecurity)：E187四項重點為OS、網路、端點、安全監控；例子保留製程變更管理的企業責任。[2026年修訂工作說明](https://www.semi.org/en/standards-watch-2026-aug/e187-major-revision-tiered-security-levels)描述SL1–SL3及推進投票，不能把研議中的分級直接稱為已發布版本。未取得付費標準全文，不宣稱完成逐條稽核。
- [TSMC 2024年客戶資訊保護說明](https://esg.tsmc.com/en-US/articles/298)：支持客戶機密資料治理與多面向安全控制的實例。其ISO/IEC 15408廠址認證不能誤稱為ISO27001；ISO27001敘述另有[2023年報](https://investor.tsmc.com/static/annualReports/2023/english/pdf/2023_tsmc_ar_e_ch5.pdf)依據，正文應標明是歷史公開揭露，不能宣稱已驗證2026年有效認證範圍。
- 加州官方立法網站§1798.81.5本次讀取403。現階段保留官方定位連結，待另一路官方來源回讀後才記為已核對全文；不以Justia替代本次官方查核完成。

## 查核界線

本紀錄完成以上官方頁面與電支基準的版本核對。臺灣營業秘密法第2條與智財局保密措施原始頁、加州法官方全文、NIST詞彙原始頁及CSF實作範例仍須補查；正文、雙語、五圖、全站檢查、瀏覽器與部署尚未完成。

## 補查與編輯修正

- [營業秘密法第2條](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080028)與[智財局FAQ](https://www.tipo.gov.tw/tw/tradesecrets/242.html)已回查三要件及密碼、權限、限閱註記、保密契約等措施。
- [NIST不可否認性詞彙](https://csrc.nist.gov/glossary/term/non_repudiation)支持第三方驗證來源及完整性的教學。
- RPO原句「遺失多久以前的資料」可能被誤讀為遺失舊資料；工作稿改為復原點與中斷時刻之差、可容忍遺失的最新資料時間範圍，並以15分鐘為明示假設例子。
- 已整理中文九節180區塊、五表及五圖工作稿adopted.zh.json；仍待全文編輯、英文對應與正式資料接入，不能視為發布版本。
- 十份雙語SVG由現有白名單serializer產生，大小1475–5024 bytes；只完成序列化與大小檢查，尚未做視覺或瀏覽器驗收。

## 正文接入後的查核狀態

前述「工作稿／待接入」是初次查核時的狀態。現已接入九章完整雙語、五表、五圖及三道原開放問題；來源、版本、實測與發布由本次release receipt承接。六份原附件再次與使用者attachment逐位元組比較一致。原文對台積電認證的精確範圍未獲本次有效證書佐證，因此正文改為有年份的公開揭露，原句仍在附件。

[加州隱私保護局官方最終規則](https://cppa.ca.gov/regulations/pdf/ccpa_updates_cyber_risk_admt_appr_text.pdf)亦引用§1798.81.5及依資訊性質採合理安全程序的要求，支持正文的一般性說明；加州立法網站逐條全文仍因403未能回讀，不能宣稱已完成全部適用例外的法律審查。[NIST cleartext詞彙](https://csrc.nist.gov/glossary/term/cleartext)已補查可理解、未加密資訊的定義。

人工比較五張參考PNG、桌面／手機HTML與SVG，確認分組、NT$10,000／NT$100,000、分流、簽章順序與HTTP／HTTPS兩路；裝飾圖示未逐像素複製。完整瀏覽器檢查通過，新圖另完成80項啟用JS的連線與重排檢查。
