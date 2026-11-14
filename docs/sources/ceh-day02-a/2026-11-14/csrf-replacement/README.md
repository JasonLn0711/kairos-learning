# Day02-A CSRF 抽換與原生收合 part

2026-11-14採用新供稿及七PNG，原檔與SHA256SUMS保留。published-v1.3.0.json保存前版；removed-current-blocks.json保存實際移除區塊，避免重複維護另一份相同舊稿。本次將先前四重點中的CSRF長解說與v1.3的CSRF十四節抽換，保留K07原有CSRF簡短定義、其餘正文及所有非CSRF教材。

使用者明確要求「csrf 的補充改為可收合的 part」；本次在K07之後、K08之前放一個預設收合的原生details，summary為完整教學標題。這是本次指定內容的呈現方式，不改寫全站A11Y-03的正文直接可見原則，也不將所有文章改為收合。沒有巢狀章節或圖解收合，無JS仍可用Enter／Space開關並讀取全部內容。

## 逐節與採用範圍

14節、26小節、25段程式／HTTP／偽碼（24段code與圖2內的一段HTML）、八表、七圖及三個三選項情境題完整採用。576個非空來源行均有line-adoption.json記錄，40個章／小節標題由headings.json逐一定位；原稿兩行Mermaid匯出CSS與節點串依PNG重繪，不作任意HTML執行。adopted-body.json就是part內正式正文，附件或來源雜湊不代替頁面內容。

| 原標題 | 來源行 | 正文錨點 |
| --- | --- | --- |
| 一、先回答你最核心的五個疑問 | 3 | `p1-csrf-browser-section-01` |
| 二、理解 CSRF 之前，先建立正確的 Web 架構 | 33 | `p1-csrf-browser-section-02` |
| HTTP 為什麼需要 Session？ | 75 | `p1-csrf-v2-subsection-01` |
| 三、Alice 從登入銀行到完成操作：HTTP 與 Session 的完整生命週期 | 99 | `p1-csrf-browser-section-03` |
| 階段 A：第一次開啟銀行網站 | 105 | `p1-csrf-v2-subsection-02` |
| 階段 B：Alice 輸入帳號密碼並登入 | 139 | `p1-csrf-v2-subsection-03` |
| 階段 C：銀行建立 Session ID，並透過 Cookie 交給瀏覽器 | 176 | `p1-csrf-v2-subsection-04` |
| 階段 D：Cookie 內的安全屬性是什麼？ | 214 | `p1-csrf-v2-subsection-05` |
| 階段 E：Alice 再次查詢銀行帳戶 | 247 | `p1-csrf-v2-subsection-06` |
| 階段 F：登出銀行 | 293 | `p1-csrf-v2-subsection-07` |
| 四、為什麼有沙盒，卻仍然允許跨網站 Request？ | 303 | `p1-csrf-browser-section-04` |
| 1. 什麼是 Origin？ | 327 | `p1-csrf-v2-subsection-08` |
| 2. 同源政策不是網路防火牆 | 346 | `p1-csrf-v2-subsection-09` |
| 3. 所謂的 Sandbox，到底保護什麼？ | 372 | `p1-csrf-v2-subsection-10` |
| 五、Web 為什麼需要跨網站連結、表單、圖片和重新導向？ | 398 | `p1-csrf-browser-section-05` |
| 六、現在重建 CSRF：惡意網站如何利用 Alice 的登入狀態？ | 432 | `p1-csrf-browser-section-06` |
| CSRF 的完整因果流程 | 441 | `p1-csrf-v2-subsection-11` |
| 第一步：攻擊者建立帶有表單的網頁 | 445 | `p1-csrf-v2-subsection-12` |
| 第二步：Alice 開啟惡意網站 | 480 | `p1-csrf-v2-subsection-13` |
| 第三步：Browser 檢查銀行的 Cookie | 500 | `p1-csrf-v2-subsection-14` |
| 第四步：銀行 Server 決定是否執行 | 539 | `p1-csrf-v2-subsection-15` |
| 你應該注意的反直覺現象 | 563 | `p1-csrf-v2-subsection-16` |
| 七、那為什麼現在的瀏覽器不會全部遭受 CSRF？SameSite 是關鍵 | 579 | `p1-csrf-browser-section-07` |
| 三種 SameSite 設定的差異 | 601 | `p1-csrf-v2-subsection-17` |
| SameSite=Lax 仍然存在什麼風險？ | 620 | `p1-csrf-v2-subsection-18` |
| 另一個重要概念：Same-Origin 不等於 Same-Site | 644 | `p1-csrf-v2-subsection-19` |
| 八、惡意網站究竟怎麼知道 Alice 有沒有登入銀行？ | 668 | `p1-csrf-browser-section-08` |
| 那麼，攻擊者完全不可能知道 Alice 的登入狀態嗎？ | 710 | `p1-csrf-v2-subsection-20` |
| 九、如果攻擊者不知道 Alice 常用什麼網站，他又怎麼決定攻擊哪個網站？ | 722 | `p1-csrf-browser-section-09` |
| 攻擊者不一定是先選 Alice，也可能先選有漏洞的網站 | 728 | `p1-csrf-v2-subsection-21` |
| 攻擊者怎麼知道 URL 與 API？ | 740 | `p1-csrf-v2-subsection-22` |
| 社交工程是否必要？ | 769 | `p1-csrf-v2-subsection-23` |
| 十、CSRF、CORS、SOP、Session Token、CSRF Token 到底有什麼差異？ | 787 | `p1-csrf-browser-section-10` |
| 為什麼已經有 Session Token，還需要 CSRF Token？ | 801 | `p1-csrf-v2-subsection-24` |
| 那麼，Authorization: Bearer Token 又如何？ | 846 | `p1-csrf-v2-subsection-25` |
| 十一、現代 Web 應該如何防禦 CSRF？ | 864 | `p1-csrf-browser-section-11` |
| 十二、從你的提問反推：你有哪些概念尚未真正串接？ | 895 | `p1-csrf-browser-section-12` |
| 最核心的缺口：沒有把整套系統拆成三個獨立決策 | 909 | `p1-csrf-v2-subsection-26` |
| 十三、你可以怎麼實際驗證這些概念？ | 933 | `p1-csrf-browser-section-13` |
| 十四、理解檢查：三個情境 | 947 | `p1-csrf-browser-section-14` |

## 修正與舊版保留

- 原稿三個折行Set-Cookie改為單行標頭，黏合的Session判斷反例修復換行與縮排；code-repairs.json保留原文與採用碼。find_session、request及transfer_money是反例偽碼，不是可獨立執行的完整安全程式。含body省略號的端點探索片段另說明不能直接執行。
- editorial-replacements.json記錄：分頁／Origin／Site／程序沙盒的界線澄清、移除虛假提交解析承諾，以及不以閱讀或展開part判定已理解。三題九選項完整保留且不公布答案，與原五題、四道選擇題、參數化兩題及缺件23題分列。
- 保留Session生命週期、MFA、登出、Host-only、SameSite四情境、盲目／機會式嘗試、目標選擇與情報蒐集、投遞與社交工程、XS-Leaks界線、Bearer／Cookie差異、NIST與分層防禦、診斷假設及DevTools五步。補明__Host-設定、Cookie不以Port隔離，以及Session身分關聯不能取代逐次授權。
- 移除favicon／來源卡並清除追蹤參數，正文來源連結與正式sources保留。已查核NIST SP800-63B-4 Session Management、MDN的CSRF及Set-Cookie、OWASP CSRF Cheat Sheet與XS-Leaks Wiki；沒有把NIST建議誤稱所有Cookie情境的安全保證。
- 13原章與原發布日保留，新增一個獨立part使sections共15。舊CSRF入口p1-csrf-browser-intro成為details入口；原14章錨點沿用，新26小節使用p1-csrf-v2-subsection前綴。舊30小節與早期四個CSRF補充錨點用受驗證aliases保留在part內，舊連結可揭露新版完整part；這是相容入口，不宣稱舊小節與新版小節一一同義。原有非CSRF錨點與區塊逐一保持。
- 目前正文14圖（原非CSRF七圖加新版七圖）；舊九張CSRF下載圖仍留於歷史網址，不繼續放在新版正文。產生器維持23份現用／歷史SVG可重現，歷史供稿與採用紀錄不覆寫成新稿。舊版測試對前版快照驗證歷史完整性，新測試另驗當前正文，沒有以舊版綠燈代替新版驗收。

## 七圖與實作

| PNG | 正式名稱 | 保留的關係 |
| --- | --- | --- |
| 1 | m20d2rarchitecture | 同一Browser中的兩網頁並列、Cookie／網路管理藍色群組，以及分別對兩Server的HTTPS往返；窄欄保持群組與各自目的地。 |
| 2 | m20d2rscenarios | 五個平行情境、五圖示、完整CDN HTML與原理，不添加未實作執行／複製控制。 |
| 3 | m20d2rcausal | 十節點、九邊，Cookie否分支止於無登入憑證；是分支才到Server驗證，再分拒絕／通過；兩決策為虛線框。 |
| 4 | m20d2rrequest | 惡意頁→Browser→銀行的三角色／責任，Cookie直接到銀行；手機箭頭轉向下。 |
| 5 | m20d2routcomes | Bob／Carol／David／Alice四種平行結果，前兩項X、第三盾牌、最後紅色警示，保留條件語氣。 |
| 6 | m20d2rconditions | 根節點、四類條件及五葉；攻擊者有兩個平行葉節點。桌面保留樹形，手機以四個具名巢狀群組維持歸屬，不把分支畫成順序。 |
| 7 | m20d2rdecisions | 發起、憑證附帶、Server接受三個獨立責任依序互動，保留解說及向下箭頭。 |

figures.json為受限文字模型，HTML／搜尋／SVG共用；兩分支流程沿既有固定rows／edges圖，條件樹使用固定groups，下載維持既有白名單serializer與小於100000 bytes。原PNG不受SVG大小限制。正文不接受任意HTML或使用原稿CSS。

M20Review只新增受限collapsible及aliases欄位；collapsible只能是true且限指定CSRF入口，aliases需合法唯一錨點。其他頁面沿既有直接展開正文，draft／future日期閘門不因新欄位失效。沒有任意遞迴內容或開放式模板。

## 驗證入口與證據

`python3 scripts/ceh_day02a.py --check`核對新舊來源採用、當前JSON與23份現用／歷史SVG。`tests/ceh-day02a-csrf-replacement.test.ts`核對完整採用、三題九選項、只有CSRF移除、所有其他正文及舊錨點保留、非法收合／別名拒絕及未來日期仍可驗證。`scripts/check-day02a-browser.mjs`驗預設收合、鍵盤開關、展開全文、四尺寸／200%、無JS、下載、深層連結及圖解；下載探針需先展開原生part，再操作內部連結，並設下載逾時，避免將隱藏連結當成可操作。

`PLAYWRIGHT_CHANNEL=chrome node scripts/check-day02a-csrf-mechanism.mjs`已改取本次正式自動提交表單。只綁loopback HTTPS：同一表單對四種狀態分別得到未登入401、過期401、防偽403與合成動作接受；另保留12格顯式SameSite、HttpOnly、合法Token、CORS簡單請求與拒絕預檢控制。矩陣為控制時機移除自動腳本並加入按鈕；合法表單替換fixture Token並加入按鈕、填入假資料；Fetch是獨立控制探針，不冒稱新稿可執行片段。沒有對真實銀行請求或公開憑證值。

完整結果與正式發布見[本次回執](../../../../releases/2026-11-14-ceh-day02-a-csrf-part-replacement.md)。
