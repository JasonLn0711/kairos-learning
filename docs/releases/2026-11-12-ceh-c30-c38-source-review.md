# C30–C38 一手來源查核

查核日：2026-11-12。來源全文及四張原圖保留在[來源目錄](../sources/ceh-notes/2026-11-12/c30-c38-supplement/README.md)；原稿、逐單位英譯、實質修正及正式採納稿分層保存。下表記錄本次查到的依據及編輯界線。

| 內容 | 一手依據與結果 | 採納界線 |
| --- | --- | --- |
| 事件應變版本 | [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)及[正式發布公告](https://www.nist.gov/news-events/news/2025/04/nist-revises-sp-800-61-incident-response-recommendations-and-considerations)確認2025-04-03取代Rev. 2，整合CSF 2.0六功能。 | SOC、Tier及指揮者配置是組織設計，不能推成NIST規定的統一職稱或每案必經階段。 |
| 告警與事件判定 | [CSF 2.0正式文件](https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf)附錄A，印刷第21–22頁核對DE.AE-02／03／06／07／08及RS.MA-01–05：分析、關聯、資訊傳遞、判定、驗證、排序、升級及復原啟動準則。 | 發現異常、符合事件準則與證明某個攻擊假說是不同判斷。圖解以必要時升級及依影響啟動BCP保留條件。 |
| NICE角色與版本 | [NICE官方change log](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/current-version/change-logs)及[2.2.0修訂摘要](https://www.nist.gov/system/files/documents/2026/04/28/NICE%20Framework%20v2.2.0%20Summary%20of%20Changes%20%28April%202026%29.pdf)皆列2026-04-28。框架結構SP 800-181 Rev. 1為2020文件，具體Work Roles與TKS目錄分開維護。 | Current Versions網頁曾將同一元件版日期寫為2025；本次以change log及修訂PDF交叉確認2026，不把具體新角色名稱誤歸為2020原文件文字。 |
| 有效帳號濫用 | [MITRE T1078現行頁](https://attack.mitre.org/techniques/T1078/)為v3.0，更新日2026-05-12，列Stealth、Persistence、Privilege Escalation與Initial Access。 | 保留原稿帳號調查假說，將現行戰術名稱修為Stealth；符合技術描述仍不等於已證實入侵。 |
| SOC誤報指標 | [Google官方分類指標定義](https://developers.google.com/machine-learning/glossary/metrics)確認FPR為FP／(FP＋TN)。 | 原稿把告警中誤報占比寫成FPR；正文分開說明FP／(TP＋FP)及TN能否觀察，保留原本告警噪音的營運問題。 |
| BCP、RTO與RPO | [SP 800-34 Rev. 1](https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final)、NIST [RTO](https://csrc.nist.gov/glossary/term/recovery_time_objective)及[RPO](https://csrc.nist.gov/glossary/term/recovery_point_objective)術語核對。 | RPO是資料需復原到的時間點；RTO依定義描述復原時間限制。圖採事故0、−15及＋120分鐘作教學假設，以真1:8長度呈現；不宣稱每個標準的計時起點相同，也不把備份頻率等同實測RPO。 |
| BCMS與BIA | [ISO 22301:2019](https://www.iso.org/standard/75106.html)仍為正式第2版，有2024 Climate action amendment，後續ISO/CD 22301仍在開發。[ISO/TS 22317:2021](https://www.iso.org/standard/79000.html)為BIA指引第2版，2025-10-08確認。 | 本次核對官方摘要、版本與生命週期，沒有逐條審閱付費標準全文；計畫文件、管理系統及演練結果分開記錄。 |
| SLA | [NIST SLA術語](https://csrc.nist.gov/glossary/term/service_level_agreement)含SP 800-47 Rev. 1的服務承諾、量測與責任定位。 | 30天完整計量月份、無排除項且99.9%時，43.2分鐘為教學計算；服務可用率與單次事件RTO不能互推。 |
| NDA與存取協議 | [NIST官方OSCAL控制目錄](https://raw.githubusercontent.com/usnistgov/oscal-content/main/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json)實際下載解析PL-4及PS-6，確認PL-4行為規則與NDA／AUP存取協議的對照。 | AUP是組織允許的使用方式，技術上可操作不自動代表政策允許；不把簽署文件當作有效執行證據。 |
| 臺灣營業秘密 | [官方營業秘密法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080028)第2、10條支持法定要件及違反保密義務的辨析。 | NDA與Confidential標籤都不能單獨證明資訊已符合全部法定要件。 |
| 美國營業秘密與揭露例外 | 美國法典官網[§1839](https://uscode.house.gov/us/usc/119-124/t18/s1839/)與[§1833](https://uscode.house.gov/us/usc/119-124/t18/s1833/)標示法規涵蓋至Public Law 119-124（2026-10-15），並以GPO 2024官版交叉核對。 | §1833(b)免責限於符合條件的營業秘密法責任；指定保密揭露、目的及程序均有條件，(b)(5)未授權非法取得資料。 |
| 金融機構制度與過渡 | [金管會官方法規](https://law.fsc.gov.tw/LawContent.aspx?id=FL049894)第9、12、24、25條核對三道模型、營運持續、資安治理與事件應變；第54、55條分別處理調整期限與施行日期。 | 第44–47條施行日另定；第54條所列不符制度規定者另有2027-12-31調整期限。已施行與完成制度調整不能混為一談，適用對象及條款須逐案核對。 |
| 銀行公會文件 | [防護基準](https://ba.org.tw/memberStandard/details?id=70)2025-02-12、[電子銀行](https://www.ba.org.tw/memberStandard/details?id=79)2026-02-05、[供應鏈](https://www.ba.org.tw/memberStandard/details?id=66)2026-03-05為官方網站公告日期。 | 網站公告日與附件版本日分開，並區分自律規範及主管機關法規的法律性質。 |
| 應用程式日誌 | [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)支持應用程式日誌作為偵測與調查資料。 | 日誌收集、證據完整性與足夠涵蓋仍須驗證；未執行任何真實銀行、供應商或工廠的事件調查。 |

原題P3-Q086／P3-Q088及Day01-A附件僅為供稿自述，未取得原題全文；不新增答案鍵或宣稱已核對正式題庫。六道供稿開放問題保持未附答案。數字、演練、法律適用及學習理解均不因教材發布而成為實際驗收結果。
