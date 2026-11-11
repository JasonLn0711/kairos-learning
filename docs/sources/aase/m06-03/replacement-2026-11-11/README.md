# M06-03 供稿抽換與七圖來源

來源保存與內容採用已完成。發布與檢查結果依[回執](../../../../releases/2026-11-11-aase-m06-03-replacement.md)的實際狀態。

## 來源與所有權

本次供稿來自使用者指定附件 `7c8d1552-b70a-4c5d-bbb2-7bdfa7d36ee7`。`pasted-text-1.txt`、`image-1.png` 至 `image-7.png` 逐位元保存；`prior-lesson.json` 保存 v1.0.2／revision 3，`prior-catalog-entry.json` 保存中英前版標題與課綱欄位。`SHA256SUMS`僅列不可變來源與前版，不將持續更新的編輯文件混入原件清單。

本 repo 擁有原稿、教材、圖解、驗證與發布證據；本次稀缺資源是逐節編輯及逐圖驗收時間。Planning 僅適合承接定位、狀態、容量、證據路徑及下一關，本次沒有新增跨 repo 詳細副本。原工作目錄存在其他課次同步修改，發布使用 `/tmp/kairos-m0603` 隔離工作樹。

## 來源到正文逐節對照

正文兩語各 10 個 section；來源第「四」節的 Session State 小節保留獨立 `storage` 錨點。原六錨點 levels／analogy／containers／storage／zoom／record 均保留。以下核對的是實質解釋、案例及限制，非僅標題數。

| 來源行／段落 | 成稿錨點 | 保留與採用內容 |
| --- | --- | --- |
| 1–20 導言 | levels | 不同距離、共同理解、三個判讀原則；聊天中的網址糾錯移出正文。 |
| 21–69 第一節 | analogy | 醫院由整體到設備的比喻、四層問題與英文名稱、原四列表、比喻限制與同一系統四種詳細度。圖1逐層放大。 |
| 70–136 第二節 | definition | Container 的應用／資料儲存邊界、Docker 歧義、原六項分類及原因；同一訂單 API 三個 Docker 實例；邏輯角色與部署位置／數量／分流的分工。圖2三實例並列。 |
| 137–162 第三節 C1 | restaurant / restaurant-context | 先問使用者及合作對象，再談語言；顧客／店員、訂餐系統及支付平台；System Boundary 內外界定、資料表／函式／主機數的省略理由。圖3雙向外部互動。 |
| 163–192 第三節 C2 | restaurant / restaurant-container | 前端菜單／購物車／訂單；API 檢查／金額／業務規則；PostgreSQL 訂單／商品；HTTPS／API 與外部支付；假設架構、通訊非時序。圖4保留內外邊界並明列後端支付端點。 |
| 193–224 第三節 C3 | restaurant / restaurant-component | Python 後端的驗證、計價、支付協調、資料存取；四功能及用途；同一應用內分工，不要求四服務／四檔／四主機。圖5同框平行分工。 |
| 225–244 第三節 C4 | restaurant / restaurant-code | 原驗證邏輯、空訂單／非正數量；函式／類別／介面關係；欄位、型別、商品有效性限制；回顧 C1–C4 同一案例。縮排修復、Python 3 執行方式及三個 assert 為編輯補充。 |
| 245–288 第四節主體 | containers | 實際本機參考與假設訂餐案例分開；Streamlit 前端／Python 程序、程序內 rules.py 與 Session State、外部下載資料夾；沒有持久業務資料庫／自訂 REST API；拆獨立服務才重新評估 Container。圖6保留巢狀程序與下載端點。 |
| 289–302 第四節小節 | storage | 跨 rerun 保留與持久性不同；分頁關閉／重新整理、伺服器故障的狀態生命週期；JSON 成為裝置持久檔；不同 Session 不證明認證、授權或隔離。 |
| 303–318 第五節 | industries | 原醫療／金融／製造三列表及 C1／C2／C3 各欄、假設機構界線、跨語言及框架的溝通用途。 |
| 319–381 第六節 | record | 原四階段及每階段檢查問題；完整 architecture.md 的系統名稱、範圍內外、程序內元件、通訊、儲存、部署與未驗證事項；圖文互核驗收。圖7為盤點順序，非程式執行順序。 |
| 382–407 第七節 | zoom | Context＋Container 通常足夠；按模組或程式結構的解釋需求增加細節；原五列選圖表；靜態四視角與 User Flow／Sequence／Dynamic 的補充分工。 |
| 408–439 第八節與結語 | understanding / checks | 原三題與全部 A／B／C 選項，正解 B／C／B；新增各選項解析，沿原生 details。官方 Container 範例及陌生系統分類能力保留。題號用新 Q04–Q06，不改寫前版題目的歷史意義。 |

## 七張圖的設計與差異

每圖文字來自正式 JSON 的 cards 資料；受限數量依序為 4／4／3／5／4／6／4，固定版型由 C4ViewsDiagram 呈現，並不把 cards 一律當成並列或線性流程。Svelte 跳脫文字，資料不收 markup、路徑、CSS 或事件；下載路徑由固定圖號及語言決定。

| 原圖 | 保留關係 | 本次呈現與差異 |
| --- | --- | --- |
| 1 | C1→C4 逐層放大、醫院例子、提問與比喻限制 | 原生 HTML 巢狀灰底及縮排，手機減少內距；不加入執行箭頭。 |
| 2 | 一個訂單 API 角色映射三個平行 Docker 實例 | 桌面三欄、手機單欄；只有角色至部署的映射箭頭，副本之間無箭頭。 |
| 3 | 人／角色在外、訂餐系統在內、支付平台在外 | 明示虛線系統邊界；兩段雙向關係保留。 |
| 4 | 系統內前端／API／PostgreSQL、HTTPS／API、外部支付 | 額外畫出支付平台文字卡，關係明寫「訂單後端 ↔ 支付平台」，避免接成資料庫→支付。資料庫連線補讀寫用途，沒有臆測通訊協定。 |
| 5 | 同一 API 內四個平行責任 | 桌面 2×2、手機單欄，同一外框且無順序箭頭。 |
| 6 | 系統邊界、前端↔程序、程序內 rules.py／Session State、下載檔在外 | 程序巢狀框，下載關係明寫瀏覽器前端→操作者裝置；不把下載檔接成程序內資料庫。 |
| 7 | 四個盤點階段及其操作內容 | 保留分列／分隔線及順序文字，不新增看似程式執行的箭頭。 |

配色、圓角、藍灰卡片及留白沿參考圖；字型、行高、換行、框線及文字長度依網站可讀性調整。裝飾性小圖標以明確角色文字承接，未做像素複製。獨立 SVG 保留桌面分組與方向；網頁以 HTML 原生重排，不縮小整張文字圖。

## 編輯修正與官方查核

2026-11-11 查核 [C4 Container](https://c4model.com/diagrams/container)、[四層選擇](https://c4model.com/diagrams)、[Deployment](https://c4model.com/diagrams/deployment)、[Streamlit 架構](https://docs.streamlit.io/develop/concepts/architecture/architecture)、[Session State API](https://docs.streamlit.io/develop/api-reference/caching-and-state/st.session_state)及[生命週期說明](https://docs.streamlit.io/develop/concepts/architecture/session-state)。它們支持術語與框架界線；本地架構另以 `resources/aase/reference/app.py`、`rules.py` 核對 import、session_state 及 download_button。這不是本次啟動或驗收 Streamlit 服務的證據。

- 原稿「應用程式或資料儲存的執行邊界」在正文表達為架構邊界，依 C4 官方的 application／data store 定義，避免把每個資料儲存一律等同獨立 OS 程序。
- Session State 的關閉／重載與伺服器故障行為依官方生命週期說明具體化；這是文件查核，並非本輪實測失效情境。
- 原稿單行 `validate_order` 無法直接執行，正文恢復正確縮排，原判斷順序及行為保留；另補三個合成案例 assert，原件不改寫。
- 四層中的函式示例補明「入門示例，不是完整 Code Diagram」，不把單個函式宣稱為完整圖。
- 原稿 architecture.md 每個欄位及狀態完整保留，同行附英文，兩語共用同一份程式區塊，符合 code 不變的雙語契約。英文解說及表格完整翻譯。
- 聊天網址糾錯、favicon 來源卡及「提交答案」操作字樣留在原件；正文使用正式課次與來源連結、自我檢核及原生參考解析，不加入不存在的送出／儲存／評分服務。
- 原三選項題型沿現有 3／4 選項模型，沒有捏造第四選項；新增解析逐項說明理由。
- v1.0.2→v1.1.0 是新增完整教學範圍的 minor 更新；原發布及英文首次發布日 2026-11-05 保留，修訂日 2026-11-11。穩定 ID、URL、原六錨點及發布閘門保留。

實測、證據位置、待驗及正式站回讀依[發布回執](../../../../releases/2026-11-11-aase-m06-03-replacement.md)。
