# AASE M03-05 供稿抽換與五圖對照

執行正本：kairos-learning。目標為 AASE-M03-C05；CEH M03-05 是另一篇教材。原發布日 2026-11-05；本次 v1.0.2 → v1.1.0、revision 3 → 4、版本修訂日 2026-11-09。原網址與六個既有錨點保留。範圍為本課正文、中英對應、五圖與計算互動；工作坊操作內容、課程排程與學習成果不在此輪變更；課名同步使下載ZIP中的curriculum.json與SHA256重新產生。

## 原始來源與採用

[pasted-text-1.txt](pasted-text-1.txt) 完整保留使用者原文；五份 image-1.png 至 image-5.png 為原始參考圖；[prior-lesson.json](prior-lesson.json) 保存待抽換的雙語教材、題目、版本與發布資料。[SHA256SUMS.txt](SHA256SUMS.txt) 核對原檔位元組。PNG 是編輯證據，不放入正式站圖片清單。

[teaching.zh.md](teaching.zh.md) 是完整中文成稿，[teaching.en.md](teaching.en.md) 逐節翻譯同一推導、案例、表格與限制。`normalize-source.py --check` 比較原文與中文成稿的明列正規化；`scripts/aase_m0305_content.py --check` 比較兩稿、[figures.json](figures.json) 與正式 JSON。附檔保存與正文呈現分開驗收。

| 原文範圍 | 正文錨點 | 保留內容與處理 |
| --- | --- | --- |
| 課前導言 | outcome | 一個月、20 功能、10,000 行、半小時工作的主管問題與事先定義證據 |
| 一、需求到證據 | evidence-chain | 問題→需求→假設→指標→證據→決策六節點；三概念區分 |
| 二、功能／任務指標 | metrics | 收件流程、兩類定義／例子／驗證方式、找不到按鈕及單次成功的界線 |
| 三、成功指標 | measure | A–F 六筆資料、四缺兩全、3／4 推導及互動 |
| 三、三點與陷阱 | toy-results | 分母研究對象、原始數量、零分母、全擋六筆的假改善與完整資料匯出測試 |
| 四、時間比較 | analogy | 舊15／新10分鐘的不同起點、相同任務／難度／起終點、協助紀錄、練習效應、交換順序、失敗與放棄 |
| 五、假設 | assumptions | 欄位提示假設、看不懂／找不到／無權限三分支、五列表格、反證及研究推導 |
| 六、需求紀錄 | trace | 原需求、A檢查→B修改→舊狀態→未重查匯出、補充規則、R/H/M/C與變更理由／待驗證據、三月後維護及代號界線 |
| 七、Markdown實作 | record | problem.md 原始程式碼逐字保留，問題／假設／指標／變更／證據與五個追問完整進入正文 |
| 八、工程概念 | engineering | 六組概念映射、Verification／Validation／Evaluation 三者與缺漏／補件例子 |
| 九、理解測驗與結尾 | understanding | 五筆缺漏四阻擋、四人兩獨立一提示一放棄、八分鐘主張、四問題及 M04-01 銜接 |

## 編輯差異與證據界線

1. 公開標題去除 AASE 品牌前綴，保留 M03-05 課次；課程身分仍在導覽。中文原文其餘敘述保留。
2. 六步、兩類指標、互動輸出、計時對照與舊結果風險的截圖文字，以同義資料模型及圖示承接；不重複堆疊擷取出的 UI 文字。原稿中的 LaTeX 跳脫與 `&#x20;` 改為可直接閱讀的公式與空白。
3. 四道新開放題取代前版三道選擇題；使用新的 Q04–Q07 ID。原文「暫時不提供答案」調整為先作答、再自行展開參考解析，依既有教材的參考答案契約處理。沒有增加提交、評分或學習完成記錄。
4. 兩語保留相同中文 problem.md 原始碼；英文前後解釋其內容，避免以翻譯改寫原始教材。練習與閱讀導引沿用前版。
5. 供稿數值均為合成情境；80%、50%是題目推導，八分鐘仍是未測假設。此輪沒有啟動真人任務、臨床驗證或系統效能實驗。
6. 原文一到九節外，導言與三節的分母解釋各有獨立可連結標題，共11個 section；保留既有 outcome／analogy／measure／toy-results／assumptions／trace，另新增 record 等內容錨點。不是減為摘要。

## 參考圖與實作

| 原圖 | HTML 與 SVG | 差異與驗收焦點 |
| --- | --- | --- |
| image-1 | 圖1 六節點垂直流程 | 保留下行箭頭、假設與指標淡藍底；增加圖說及下載連結 |
| image-2 | 圖2 兩列指標比較 | 保留盾牌／人群圖示及三段定義；邊框及字體沿站點，無順序箭頭 |
| image-3 | 圖3 原生0–4滑桿 | 預設3／4、75%、一筆漏擋；0–4逐值計算，4／4才達要求；下載固定為預設案例，不隨操作變動 |
| image-4 | 圖4 兩張時間卡 | 桌面並列、窄欄上下；保留15／10與各自起點，不宣稱效率改善 |
| image-5 | 圖5 四步風險＋補充規則 | 保留A/B及過期狀態順序，規則獨立淡橘卡；風險步驟以編號表達，沒有新增流程箭頭 |

`SuccessEvidenceDiagram.svelte` 使用受限 cards／flow 資料，章節固定節點數6／2／4／2／5；僅圖1為flow。五份雙語 SVG 共十檔由 `aase_m0305_svg.py` 產生並檢查元素／屬性白名單與100000 bytes上限；HTML、搜尋、圖說與下載文字共用正式資料。獨立SVG保存固定幾何，HTML依容器重排。

現有 sections 的 paragraphs 在 blocks 前，無法保留「表格→說明→圖解→說明」次序；新增 AASE 專屬 `prose` 區塊，只允許 paragraphs 字串陣列，Svelte跳脫文字，原生條列由固定前綴解析。CEH ConceptBlock 未擴充，不接受任意HTML、座標或事件。雙語結構、搜尋與非法資料由本課測試覆蓋。

## 來源查核

2026-11-09 回讀既有 [GOV.UK metrics](https://www.gov.uk/service-manual/measuring-success/how-to-set-performance-metrics-for-your-service) 的目標、假設、指標與情境指引，及 [research planning](https://www.gov.uk/service-manual/user-research/plan-user-research-for-your-service) 的研究問題／待驗假設方法。本課情境與公式來自供稿及編輯推導；不採用其英國政府強制KPI或研究排程。方法來源不證明本課合成案例曾執行。

實測與正式站發布另見[本次回執](../../../../releases/2026-11-09-aase-m03-05-replacement.md)。讀者接受度、實體手機與完整螢幕閱讀器檢查另行保留，瀏覽器模擬不代填。
