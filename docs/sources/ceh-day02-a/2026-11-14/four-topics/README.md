# Day02-A 四重點補充｜來源與逐節採用

2026-11-14使用者要求在「今日頁面」相對應內容下方補充RDAP、Directory Traversal、SQL Injection與CSRF，依供稿重要順序與比例完整教學，重繪四圖，詳實記錄。既有路徑`/ceh-notes/day02-a-reconnaissance/`與13章保留；v1.0.1前版存`published-v1.0.1.json`，原稿與四PNG完整保存，SHA256SUMS記錄原附件雜湊。目前v1.1.0／revision3，原發布與修訂日均2026-11-14。

本次單語範圍，公開正文仍使用一般教學用語。供稿7節、14個細分小節、所有例子／表格／程式片段／16選項均採用，不以摘要取代正文。`line-adoption.json`逐一記錄非空來源行（首行標題由本說明對應同頁補充），`adopted-groups.json`保存採用分組；`editorial-replacements.json`列出字句修正。

| 供稿範圍 | 正文位置與錨點 | 採用內容 |
| --- | --- | --- |
| 開頭結論、一重要性 | 第二章既有優先順序之下；p1-supp-intro／p1-supp-priority | SQL→RDAP→目錄穿越≈CSRF、40／30／15／15、圖4、官方藍圖與未附原題的統計界線 |
| 二SQL Injection §1 | 第七章SQL原定義正下方；p1-supp-sql-01 | 銀行紙條比喻、資料變指令、完整Python拼接片段、alice與恆真條件、SQL結果及成立條件 |
| 二§2 | p1-supp-sql-02 | 圖5四階段、Trust Boundary、查詢權限影響 |
| 二§3 | p1-supp-sql-03 | 三類型表、Error／UNION、Boolean／Time、OOB、延遲其他解釋 |
| 二§4 | p1-supp-sql-04 | sqlite3參數片段、Code/Data Separation、四防線、結構性SQL欄位需固定映射／allowlist、判斷句 |
| 三RDAP §1 | 第五章WHOIS解說之下、DNS介紹之前；p1-supp-rdap-01 | 登記查詢問題、WHOIS與RDAP差異、HTTP語意／HTTPS與JSON |
| 三§2 | p1-supp-rdap-02 | WHOIS四欄假資料、完整JSON欄位節選、假資料聲明、四優點、2025轉換與WHOIS例外 |
| 三§3 | p1-supp-rdap-03 | WHOIS／RDAP對DNS A／MX／SOA五列、nameserver欄位與即時DNS差異、個資遮蔽 |
| 三§4 | p1-supp-rdap-04 | P1-Q050供稿轉述、與MX對比、ICANN Lookup與判斷句 |
| 四目錄穿越 §1 | 第七章目錄穿越原定義正下方；p1-supp-path-01 | report.pdf、../config/settings.yaml、..與/、圖6根／平行目錄／檔案、權限前提 |
| 四§2 | p1-supp-path-02 | 文件ID123、先授權再固定映射、正規化最終路徑／基底目錄／symlink／最小權限 |
| 四§3 | p1-supp-path-03 | robots.txt與三種弱點四情境表、判斷句 |
| 五CSRF §1 | 第七章CSRF原定義正下方；p1-supp-csrf-01 | Alice銀行案例、Session Cookie條件、圖7四步、登入不等於操作本意 |
| 五§2 | p1-supp-csrf-02 | 四防禦表、POST／HTTPS不足、SameSite限制 |
| 五§3 | p1-supp-csrf-03 | XSS與CSRF差異、互相影響及判斷句 |
| 六總整理 | 第七章三種精讀之後；p1-supp-recap | 四觀念核心與快速辨識表、robots.txt線索不是已完成攻擊 |
| 七理解檢核 | 原第十三章五題檢核之後；p1-supp-checks | 四題完整題幹、每題四選項、未公布答案、10–15秒辨識目標與參數化說明目標 |

## 查核與實質修正

- 原稿「我核對23題」「WHOIS5題／其餘各1題／RDAP0題」缺完整原題可重算；正文保留為供稿記載，不宣稱本次已逐題核對。P1-Q050與P3-Q005亦標為供稿轉述。沒有刪除這些資訊，也沒有補造題目。
- 官方CEH Exam Blueprint v5.0第3頁列SQL Injection子領域6題；14%屬Web Application Hacking整個領域，包含Web Servers、Web Applications及SQL Injection。四項40／30／15／15是本次教學時間與篇幅建議，非官方四項配分，優先閱讀次序與實際插入位置分開交代。
- SQL片段原稿將註解與程式黏在同一行；補回換行與縮排，維持相同查詢和參數。`scripts/check-day02a-sql-example.py`從正式JSON擷取兩段片段，以記憶體SQLite與alice／bob假資料實跑。正常alice兩法各1筆，示意輸入拼接2筆／參數化0筆。不是對外部系統的測試。
- RDAP JSON標為簡化欄位節選，避免誤認為完整合規回應；HTTP查詢語意與HTTPS傳輸保護分開說明。其餘金鑰／授權界線延續原頁。
- 來源卡與favicon雜訊不進正文，Markdown及HTML空白實體正規化，原文不變。四道新題保留全部16選項且暫不公布答案；「提交批改」改為靜態自檢，不增加未實作的服務，也不將辨識目標宣稱為已學會。
- 技術來源為OWASP SQL Injection Prevention、WSTG v4.2 SQLi與Directory Traversal、CSRF Prevention、RFC9083、Python sqlite3與ICANN既有來源；新增7筆參考查核日2026-11-14，見references.json。原文機制／防禦／Cookie條件與這些一手來源相符。

## 四圖重製及受限契約

圖文來源為figures.json，`scripts/ceh_day02a_supplement.py`由原產生器呼叫，`ceh_day02a_supplement_svg.py`沿既有元素／屬性白名單匯出。HTML、搜尋與SVG同用正式JSON，拒絕任意HTML、額外欄位與節點增減。

- 圖4：四欄排名／觀念／占比／定位與四段比例條；固定weights=[40,30,15,15]、ranks=[1,2,3,3]，模型另核對body占比與分隔結構。桌面維持四欄，手機每列順位／觀念／百分比接定位，欄名保留無障礙語意；數值與圖說直接可讀，不只依色彩。比例條沿原藍／綠／橘／紫，固定權重共100，無拖曳或計分。
- 圖5：四步三箭頭，後兩步保留框線，增加短解說以交代資料／語法界線；手機垂直原生換行。
- 圖6：五節點縮排目錄，root→reports→report.pdf與root→config→settings.yaml兩支；folder／file／lock圖示為固定裝飾SVG，不畫成先後流程。原圖單行標籤改為標籤加解說，保留層級與平行關係。
- 圖7：四步三箭頭、後兩步有框，完整保留Cookie／請求政策與防護條件。四圖字體與留白沿網站，原PNG另附來源連結。

單張SVG低於100000 bytes，實際下載、文字邊界、四尺寸與200%／無JS由既有check-day02a-browser.mjs檢查全部七圖；專項測試驗插入位置／舊內容保留／比例／來源與新圖契約。發布與實測見[本次回執](../../../../releases/2026-11-14-ceh-day02-a-four-topics.md)。

編輯另補一段題數說明：原五道整合情境題、新四道概念自檢、未附全文的23道題庫題目分別計數；保留原文「不新增題量」並釐清其不補造23道原題的範圍，避免新增自檢被誤解為取得更多官方題目。此為編輯補充，非原題或答案。
