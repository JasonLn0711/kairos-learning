# Day02-A｜瀏覽器、Session 與 CSRF 完整補充

供稿與八張PNG於2026-11-14採用。pasted-text-1.txt及image-1.png至image-8.png原樣保存，SHA256SUMS記錄原始位元組；published-v1.2.0.json保存前版。正式版1.3.0／revision 5沿原發布日，插在第七章既有「CSRF 最重要的概念是」段落之後，原13章及全部舊區塊依序保留。

## 完整性與逐節對照

14節、30細分標題、24段程式／HTTP／偽碼（22段原生code及圖11中的兩段HTTP）、13表（11原生table及兩張有資料格的圖）、八圖、六項DevTools觀察清單與五道未提供答案的整合題完整採用。line-adoption.json記錄包含主標題在內680個非空行的來源、成稿錨點與處置，adopted-body.json為真正插入正式模型的內容。headings.json列出全部44個來源標題的原始行號、採用標題與錨點。

| 來源標題（含細分小節） | 來源行 | 正文錨點 |
| --- | --- | --- |
| 一、核心答案：瀏覽器有沙盒，為什麼仍然可能發生 CSRF？ | 3 | `p1-csrf-browser-section-01` |
| 你最需要建立的心智模型 | 33 | `p1-csrf-browser-subsection-01` |
| 二、先理解基礎：HTTP 本身為什麼需要 Session？ | 74 | `p1-csrf-browser-section-02` |
| 1. HTTP 是 Stateless（無狀態）的 | 76 | `p1-csrf-browser-subsection-02` |
| 2. Cookie 跟 Session 是不是同一個東西？ | 118 | `p1-csrf-browser-subsection-03` |
| 三、從零開始：Browser 和 Server 如何交換 Session Token？ | 164 | `p1-csrf-browser-section-03` |
| 階段 A：第一次連線 | 172 | `p1-csrf-browser-subsection-04` |
| 階段 B：Alice 輸入帳號與密碼 | 208 | `p1-csrf-browser-subsection-05` |
| 階段 C：Server 將 Session ID 交給 Browser | 238 | `p1-csrf-browser-subsection-06` |
| Cookie 的安全屬性 | 264 | `p1-csrf-browser-subsection-07` |
| 階段 D：瀏覽器儲存 Cookie | 295 | `p1-csrf-browser-subsection-08` |
| 階段 E：Alice 再次存取帳戶頁面 | 317 | `p1-csrf-browser-subsection-09` |
| 四、CSRF 的真正發生過程：惡意網站如何利用「已登入的瀏覽器」？ | 365 | `p1-csrf-browser-section-04` |
| 1. 攻擊者其實不需要知道 Session Token | 375 | `p1-csrf-browser-subsection-10` |
| 2. Browser 為什麼可能自動加上銀行的 Session Cookie？ | 427 | `p1-csrf-browser-subsection-11` |
| 3. 所以，Session Token 究竟被送到了哪裡？ | 478 | `p1-csrf-browser-subsection-12` |
| 五、你提到的 Browser Sandbox，究竟保護什麼？ | 511 | `p1-csrf-browser-section-05` |
| 第一層：Process Sandbox（作業系統程序沙盒） | 523 | `p1-csrf-browser-subsection-13` |
| 第二層：Same-Origin Policy（同源政策） | 543 | `p1-csrf-browser-subsection-14` |
| 第三層：Cookie Policy（Cookie 傳送規則） | 573 | `p1-csrf-browser-subsection-15` |
| 六、Same-Origin 與 Same-Site：名稱很像，安全邊界卻不同 | 590 | `p1-csrf-browser-section-06` |
| 七、SameSite Cookie 到底如何阻止 CSRF？ | 629 | `p1-csrf-browser-section-07` |
| 1. SameSite 的三種設定 | 641 | `p1-csrf-browser-subsection-16` |
| 為什麼 Lax 允許跨網站 GET？ | 670 | `p1-csrf-browser-subsection-17` |
| 2. 為什麼 SameSite 仍不是完整解答？ | 686 | `p1-csrf-browser-subsection-18` |
| 八、另一個常見疑問：為什麼 CORS 沒有阻止 CSRF？ | 704 | `p1-csrf-browser-section-08` |
| 1. 以 JavaScript Fetch 為例 | 714 | `p1-csrf-browser-subsection-19` |
| 2. 什麼是 Preflight Request？ | 766 | `p1-csrf-browser-subsection-20` |
| 九、真正完整的 CSRF 防禦：Session Token 與 CSRF Token 分工 | 789 | `p1-csrf-browser-section-09` |
| 1. Session Token 與 CSRF Token 根本不同 | 805 | `p1-csrf-browser-subsection-21` |
| 2. 正常的轉帳流程 | 819 | `p1-csrf-browser-subsection-22` |
| 3. 為什麼惡意網站不容易取得 CSRF Token？ | 873 | `p1-csrf-browser-subsection-23` |
| 4. Server 還應該檢查什麼？ | 899 | `p1-csrf-browser-subsection-24` |
| 十、如果使用 JWT，而不是傳統 Session Cookie，還會有 CSRF 嗎？ | 926 | `p1-csrf-browser-section-10` |
| 架構 A：JWT 放在 Cookie | 934 | `p1-csrf-browser-subsection-25` |
| 架構 B：Access Token 由前端主動放進 Authorization Header | 947 | `p1-csrf-browser-subsection-26` |
| 十一、實際觀察：用 Browser DevTools 追蹤整個過程 | 980 | `p1-csrf-browser-section-11` |
| 十二、回到你真正的問題：你還有哪些概念沒有完全串起來？ | 1020 | `p1-csrf-browser-section-12` |
| 概念缺口診斷 | 1024 | `p1-csrf-browser-subsection-27` |
| 1. 先分離「程式執行權限」與「網路請求權限」 | 1037 | `p1-csrf-browser-subsection-28` |
| 2. 確認 Session 不是單一前端網頁的物件 | 1055 | `p1-csrf-browser-subsection-29` |
| 3. 拆開「使用者是誰」和「是否同意這次操作」 | 1070 | `p1-csrf-browser-subsection-30` |
| 十三、把整套知識整合為一個可重用的分析框架 | 1086 | `p1-csrf-browser-section-13` |
| 十四、整合理解檢核 | 1126 | `p1-csrf-browser-section-14` |

## 編輯及技術修正

- 原稿學位標籤改為一般整合檢核；六項清單移除未實作的「0／6、0%」，保留觀察內容並說明不追蹤進度。五題不提供答案或假提交／批改功能，與原題及先前新增題分列。概念缺口分析明列是依提問提出的教學假設，仍須回答或實驗確認。
- code-repairs.json記錄六個實質／排版修正：四個Set-Cookie範例合併為合法單行標頭、偽碼修復換行與__Host-session名稱、表單編碼移除非預期換行並統一佔位Token。偽碼不是可獨立執行的完整安全實作，固定Token及短Session值不是正式憑證。
- 原文SameSite判斷表的12格在文字附件中空白，依image-7.png逐格補回：同Site POST全允許；跨Site頂層GET僅Lax／None；跨Site頂層POST及圖片GET僅None。此表明列前提為顯式SameSite、主機／路徑／HTTPS匹配，且沒有其他隱私政策阻擋。沒有把None視為繞過瀏覽器政策。
- Origin公式轉為可讀純文字；移除匯出favicon／來源卡及utm追蹤網址，不刪其前後教學。補明登出時Server撤銷Session、Cookie過期及換發舊值失效；並說明Cookie不以Port隔離。另補明__Host-需要Secure、Path=/且無Domain；Cookie路徑不是安全隔離，Cookie及Sec-標頭由瀏覽器管理，預檢本身不附Cookie。SOP、CORS、Cookie政策、伺服器授權與防偽分開說明。
- Session Token與CSRF Token不當成人類意圖證明；JWT風險依儲存／附帶方式分析，AI工具類比不當成相同漏洞。Source references使用查核日期2026-11-14；Python／Chrome版本不沿用匯出卡片推定。

## 八圖重繪對照

| PNG | 正式圖／資料 | 保留關係及呈現差異 |
| --- | --- | --- |
| 1 | 圖9 m20d2browser，六節點 | 兩網頁平行，Browser群組含Cookie Store／Network Stack，向目的伺服器；窄欄分組保留、同層上下重排，沒有網頁互相轉送箭頭。 |
| 2 | 圖10 m20d2session，兩節點 | Browser持有識別碼、Server持有對應Session與期限權限；並列對照無流程箭頭，窄欄上下。 |
| 3 | 圖11 m20d2exchange，兩節點 | 請求向銀行、回應向Browser；兩段完整HTTP由同源資料以可選取code呈現；保留灰底與分隔，不製造未實作複製／格式按鈕。 |
| 4 | 圖12 m20d2cookieheaders，兩節點 | Server→Browser的Set-Cookie與相反方向Cookie，以具名起訖與箭頭交代；窄欄標題與解說上下。 |
| 5 | 圖13 m20d2csrfsequence，五訊息 | 三角色、三條虛線生命線，五箭頭方向右／左／右／右／左；正常登入綠、誘發橘、帶Cookie紅、判斷灰。窄欄改五筆具名起訖，保留時序與方向，不把Cookie送給惡意網站。 |
| 6 | 圖14 m20d2origins，4×3格 | 四URL與Origin／Site結果，勾叉加相同／不同文字；手機換行且保留列欄，不以顏色代替資料。 |
| 7 | 圖15 m20d2samesite，4×4格 | 四情境、Strict／Lax／None十二格與前提；勾叉加允許／不允許，完整資料進入搜尋及SVG。 |
| 8 | 圖16 m20d2csrftoken，五步 | 五個數字、合法表單到逐項驗證及拒絕條件；直向分段線，文字隨高度延伸，不把Token當成人類意圖證明。 |

figures.json提供受限純文字資料；NoteCsrfBrowser沿原生HTML／CSS容器查詢，下載SVG由ceh_day02a_csrf_svg.py及既有白名單serializer衍生。沒有新增圖形框架、外部執行端點、任意HTML欄位或作答服務。模型拒絕節點增減、額外欄位、錯誤表格值及時序方向。

## 查核與可重現實驗

官方來源：MDN的SOP、Set-Cookie與Fetch；OWASP的Session Management及CSRF Prevention；Chromium Site Isolation設計文件；Cookie跨Port的範圍另以RFC6265查核。正文保留相關主張與來源名稱，正式sources補齊可點連結。Chromium設計文件的Threat Model明列傳統CSRF不在該隔離機制的預期防禦範圍。

`python3 scripts/ceh_day02a.py --check`核對整頁模型、採用紀錄及16圖，沿既有release閘門。`tests/ceh-day02a-csrf.test.ts`核對逐行／逐節完整、舊正文保留與非法模型拒絕。整頁瀏覽器入口仍為`PLAYWRIGHT_CHANNEL=chrome node scripts/check-day02a-browser.mjs`；正式站設定DAY02A_BASE_URL。

`PLAYWRIGHT_CHANNEL=chrome node scripts/check-day02a-csrf-mechanism.mjs`建立僅綁127.0.0.1的HTTPS fixture，以本機解析的bank.example.test、promo.example.test與evil.other.test分別模擬銀行、同Site子網域及跨Site網頁。從正式採用稿取表單與include Fetch，只把目的地改成本機、CSRF佔位值改為fixture隨機值；沒有對外銀行請求或真正交易。需本機Chrome及openssl，臨時憑證／私鑰僅留忽略的.local/day02a-csrf/，忽略憑證錯誤只限這個隔離瀏覽器context。

實驗觀察：實際Set-Cookie種下三種顯式SameSite Cookie，四情境核對12格；HttpOnly在銀行及同Site不同Origin皆無法經document.cookie讀到；同Site POST附帶Strict仍因缺防偽Token回403，合法表單帶正確Token則接受；預設Fetch無Cookie，include簡單請求帶None可達伺服器但無法讀回應；非簡單請求的OPTIONS無Cookie、拒絕後沒有實際POST。這是指定Chrome／政策的本機合成觀察，不聲稱所有瀏覽器、隱私設定或正式銀行均如此。

完成證據與發布結果見[本次回執](../../../../releases/2026-11-14-ceh-day02-a-csrf-browser.md)。
