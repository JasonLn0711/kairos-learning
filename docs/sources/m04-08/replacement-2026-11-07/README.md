# M04-08｜2026-11-07 完整抽換與補充來源

本次正本在 kairos-learning。三份原供稿與十張 PNG 逐位元組保存，`source-sha256.json` 核對附件；`previous/` 保存抽換前中英稿、答案、產物與生成器。教學正文見上層 `teaching.zh-TW.md`／`teaching.en.md`，公開章節固定為 M04-08，不另建立重複課次。

## 採用範圍

- pasted-text-1.txt：主文八章、查詢參數／Scope、RootDSE／GC、Bind／TLS、sizeLimitExceeded／分頁、六問框架及 Q1–Q3，完整抽換 M04-08。
- pasted-text-2.txt：補充 A 的七章與三題測驗；補入本課 LDAP 入門，保留中央目錄情境、全名拆解、產品／協定分工、Entry／DN、四步搜尋、Filter 範例、安全與四問整理。
- pasted-text-3.txt：補充 B 的八章與三題測驗；補入本課 Kerberos 入門，保留 3,000 人／9:00 情境、遊樂園比喻、AS／TGS／AP、密碼衍生金鑰五步、時間偏差、四者分工、安全風險、4768／4769、klist 及空快取判讀。

`source-paragraph-map.json` 逐一記錄 378 個原始段落、原文及採用位置。`section-map.json` 保留每個原始章／小節的成稿錨點。逐段映射只協助找漏，正文的技術與教學意義另經閱讀核對。中英各 266 個內容區塊，12 個 h2、22 個 h3、10 張隨文圖、13 個正文表格／圖內資料列另依內容實際模型，三組答案原生收合；qa=[]，沒有新增學員完成或測驗分數。

## 編輯修正及依據

| 原文／顯示片段 | 採用內容與原因 | 依據 |
| --- | --- | --- |
| 開頭再引用正式教材自身，附 utm_source；favicon 與「RFC Editor+1」卡片 | 保存原文，正文改為合成案例與一手來源說明，引用完整正式 URL。裝飾卡片不當作來源證據。 | 正文末一手來源清單 |
| 「可以使用 Paging」 | 增加伺服器支援條件、page size 與總 sizeLimit 的差別、每批結果狀態與最後空 cookie。分頁不繞過總限制、權限或搜尋範圍。 | RFC 2696 §3、RFC 4511 §4.5 |
| 原圖 3 的互動標籤 | 改成靜態同樹比較：突出 one-level 的三個候選，圖說列出 base／subtree 的包含關係。沒有假按鈕；無 JavaScript 可直接讀取三種深度，原供稿中的全部判讀保留。 | RFC 4511 §4.5.1.2 |
| 原圖 10 第三階段向左箭頭「驗證成功後，依權限存取」 | 把它標為服務的授權結果，不畫成必定存在的 AP 回覆封包。補充要求雙向驗證時可有 AP_REP。 | RFC 4120 §3.2 |
| 「出示服務票證與驗證資訊」 | 圖中明名 Authenticator；正文保留驗證資訊與重播檢查。AS／TGS 為邏輯功能，明列省略預先驗證往返、金鑰細節與快取重用。 | RFC 4120 |
| 泛用 LDAP Entry 的 ou 欄位 | 保留原欄位，加上 ou 欄位不取代 DN 位置識別，避免把屬性誤當階層。 | RFC 4511／目錄命名模型 |
| 「檢查答案」「我會批改」等對話控制 | 主文與原選項完整公開；新增三組編輯參考答案，用既有 details／summary，沒有後端送出、成績或學習進度。 | WRITE-09–11、A11Y-03 |

## 十張附圖的對照

| 附圖 | 模型鍵 | 關係／桌面保留 | 手機與輸出差異 |
| --- | --- | --- | --- |
| image-1.png | directory | 根目錄與三個平行部門，六位員工分組 | 保留隸屬線，以直向樹枝重排；以文字節點取代裝飾圖示 |
| image-2.png | parameters | 四個同層查詢設定，桌面 2×2 | 窄欄單欄，沒有順序箭頭 |
| image-3.png | scope | People → Lin／Chen／研發小組 → Wang／Li | 靜態 one-level 標示，文字說明三種深度；保留第二層縮排 |
| image-4.png | result | Base、Scope、cn、2 筆、Lin／Chen、code 4 | 語意 dl 資料列，錯誤以文字與色彩共同標示 |
| image-5.png | paging | 第一頁／第二頁／後續頁與 100 筆示例 | 直向箭頭；補上 cookie 的結束判讀 |
| image-6.png | central | 中央目錄與三個平行系統 | 直向樹枝保留共享目錄關係，明示非每次登入必經 LDAP |
| image-7.png | entry | cn／uid／mail／ou 四列 | 語意 dl、完整 email 與通用 LDAP 限制 |
| image-8.png | search | 四步查詢與狀態回傳 | 直向流程，保留全部條件與結果 |
| image-9.png | sso | 小明與三個平行服務 | 明示時間與整合條件；平行服務不畫成依序呼叫 |
| image-10.png | tickets | 三組獨立 Client／對端、請求與回覆 | 長文字換行；第三階段授權結果不當作固定封包 |

HTML 與 20 個中英 SVG 共用 `diagram-models.json`。原生 HTML 承接可選取文字，CSS 容器重排；SVG 使用既有 sanitizer，保留 title／desc／viewBox，單圖小於 100000 bytes。SVG 保留桌面分組；網頁圖使用流動高度。配色沿本站低彩度藍綠，字型、圖示與手機排列和 PNG 不完全相同。

## 生成與驗證

`python3 scripts/m04_08_content.py --check` 核對正式產物／雙語區塊結構／SVG；`python3 scripts/verify-m04-08-source.py --check` 核對逐段採用與原始附件雜湊。改稿後移除 --check 重新產生，再逐節閱讀兩語，不以區塊數代替教學深度。

本次發布與逐頁實測記於 [完整回執](../../../releases/2026-11-07-m04-08-replacement.md)。正式站、瀏覽器模擬、實體裝置與學員理解分別判定。未執行 LDAP 網路查詢或 Windows klist；本次是教材修訂。
