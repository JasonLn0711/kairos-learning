# C06–C16 一手來源查核

查核日：2026-11-12。原附件保持原樣；以下為教材編輯層，與正文採用、呈現驗證及發布分開記錄。

## 已查核與採用界線

1. [NIST SP 800-115正式頁](https://csrc.nist.gov/pubs/sp/800/115/final)仍為2008年版。[全文](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=152164)的四階段為Planning、Discovery、Attack、Reporting；Reporting貫穿活動，Attack也可引出額外Discovery。原稿五步圖是教學整理，不稱為NIST原始四階段圖。ROE六面向是Appendix B的編輯分組，不是標準逐字規定僅有六項。
2. [NIST SP 800-82r3](https://csrc.nist.gov/pubs/sp/800/82/r3/final)為正式版本，頁面2026-09-21註記Revision 4初始公開草案，不能把草案當正式規範。PDF頁200／印刷頁184的Appendix C.3.4確實記載ping sweep造成晶圓製造控制系統停滯及50,000美元晶圓損失，另有機械手臂轉動180度的獨立案例。這是文件收錄的歷史案例，不是本次實測或2026年新事故。[PDF](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-82r3.pdf)。
3. [OWASP API1:2023 BOLA](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/)與[WSTG v4.2 WSTG-ATHZ-02](https://wstg.owasp.org/v4.2/4-Web_Application_Security_Testing/05-Authorization_Testing/02-Testing_for_Bypassing_Authorization_Schema/)支持物件授權、水平／垂直越權的教學。只採用兩個受控帳號與人工測試文件的假設情境，不提供對外測試目標，也沒有實際執行滲透測試。WSTG stable連結目前指向4.2，latest開發文件另列。
4. [OWASP弱點揭露指南](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html)支持授權、隱私、足夠的重現資訊與協調揭露。回報政策、safe harbor或獎勵計畫都有具體條件，不能視為企業所有系統的全面授權。`security.txt`用於找到窗口，不單獨授權測試。
5. [DOJ Justice Manual 9-48](https://www.justice.gov/jm/jm-9-48000-computer-fraud)仍載善意研究起訴政策與其條件；另保留[2022年政策公告](https://www.justice.gov/archives/opa/pr/department-justice-announces-new-policy-charging-cases-under-computer-fraud-and-abuse-act)的歷史定位。這是政府律師的起訴指引，不創設全面測試權、不消除民事或其他法律問題，不能把自稱善意直接當作已授權。
6. [18 U.S.C. §1030官方全文](https://uscode.house.gov/us/usc/119-124/t18/s1030/)載示截至2026-10-15之法律；(a)(2)、(a)(5)具有各自構成要件。首次嘗試通用view.xhtml網址404，已找到本次供稿的官方編纂網址。本文僅解釋法律與授權的差別，不代替特定案件判定。
7. [中華民國刑法](https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=C0000001)第358–360條已回查。保留「無故」、入侵、取得／刪除／變更、干擾及致生損害的各條文差異；不能把所有未經同意的行為直接判作相同罪名。[營業秘密法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080028)第2條三要件沿前次查核，是否成立及侵害行為仍依具體事實。
8. MITRE Enterprise [T1190](https://attack.mitre.org/techniques/T1190/)、[T1078](https://attack.mitre.org/techniques/T1078/)、[T1498](https://attack.mitre.org/techniques/T1498/)、[T1499](https://attack.mitre.org/techniques/T1499/)、[T1041](https://attack.mitre.org/techniques/T1041/)均已開啟官方技術頁。ATT&CK描述對手技術，不建立授權或測試步驟；BOLA案例須依觀察到的具體行為、前提與戰術判斷可能對應，不能把一個應用弱點名稱機械地等同特定ATT&CK技術。
9. [SEMI E187公開摘要](https://store-dev2.semi.org/en-nl/products/e18700-semi-e187-specification-for-cybersecurity-of-fab-equipment)明列Windows／Linux設備運算裝置與PLC、SCADA等排除範圍。[SEMI官方說明](https://www.semi.org/en/standards-watch-2024-mar/how-semi-e187-and-e188-standards-elevate-cybersecurity)與[ACW驗證制度](https://www.acw.org.tw/Certification/Default.aspx?subID=1069)支持標準與臺灣配套制度的定位。沒有取得付費標準全文，不聲稱完成設備認證或逐條符合性查核；被動／離線優先及主動測試額外核准是風險導向工程建議。
10. [ESET hacker詞彙](https://help.eset.com/glossary/en-US/hacker.html)支持受邀上市前／更新前顧問的Blue Hat用法；[Microsoft 2006年BlueHat說明](https://www.microsoft.com/en-us/msrc/blog/2006/03/bluehat-hackers/)直接提醒不能把活動參與者或內部測試者稱為固定BlueHat駭客類別。[Microsoft BlueHat](https://msrc.microsoft.com/bluehat/)是研究交流活動。原稿另提的「報復動機」用法目前尚待可靠原始來源補強，不將不同網站的非正式分類冒充CEH官方固定定義。
11. [銀行內控制度辦法](https://law.fsc.gov.tw/LawContent.aspx?id=FL049894)第24、25條的適用性沿前次查核；個別機構條件須保留。[銀行公會供應鏈規範](https://www.ba.org.tw/memberStandard/details?id=66)網站公告日期2026-03-05，附件版本名為v2026.2.13；公告日與版本日須分開。[電子銀行安控基準](https://www.ba.org.tw/memberStandard/details?id=79)亦保留網站公告日與附件日期差異。

## 原稿格式採用

- 原始Markdown、引用介面標籤、favicon網址及追蹤參數保留於原件；正文去除介面殘留及`utm_source`，保留真正來源與查核日期。
- 兩張平行比較圖不增加先後箭頭；五步驗證圖保留順序；授權圖的兩個否定出口都停止，不能接回執行或結案。
- 概念公式改為可搜尋的白話算式，保留「思考模型、非NIST官方公式」的說明。
- 原五道開放問題不加自動評分、未提供的答案或學習進度。

目前：五份原附件及前版已保存，12節／29小節已映射，中文工作稿與四圖雙語模型已建立；英文、正式接入、視覺驗收及發布尚待完成。

## 後續補查與接入

已下載並以pdftotext檢查ORE Catapult《Cyber Security and Autonomous Systems for the Offshore Wind Environment》Rev 2（2025-05-02）的Table 7，確認同時列出報復型與受邀上市前測試型Blue Hat用法。`reference-checks.json`保存URL、檔案大小與SHA-256；正文中英均明確標示為來源各自的術語分類，不當作CEH官方法律身分。這補足前述「替代用法待核」項目。

NIST SP 800-115的章節引用修正為第4章目標識別與分析、第5章弱點驗證；原稿仍保留。刑法第360條補足「無故」條件，銀行公會公告日與文件版本日分開，五道開放問題保留編號。導言與十一章共227區塊、29小節、12表，已完整雙語接入；原三部分、C01–C05及原題解析不變。修訂為1.4.0／revision 7，保留原發布日。

四圖均沿用受限模型、可搜尋HTML、既有graph renderer及白名單SVG serializer；新增64項啟用JS的雙語／四寬度／200%檢查已通過。原始四PNG與前版未改。正式發布狀態另見本次release receipt。
