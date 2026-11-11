# M07-04 資料檢核供稿抽換紀錄

來源保存日期：2026-11-11。狀態：source preserved／adopted／validated／published；完整雙語正文、四圖與互動已正式上線。

正本屬於 kairos-learning；本目錄保留使用者原稿、四張參考 PNG 及抽換前正式 JSON。SHA256SUMS 可核對原件；原稿中的網址修正敘述、來源卡文字、壓平程式碼及網頁按鈕文字均原樣保留。學習者作答、理解與實機驗收尚無證據。

正式課次為 AASE-M07-C04，公開路徑維持 /courses/aase/v1/m07/concepts/m07-04/。此次修改範圍為本課完整雙語正文、四組圖意（含一個文字規則互動示範）、程式範例、理解檢核及對應驗證與發布證據。其他章節的未提交修改保留。

## 逐節採用與驗收清單

| 原稿位置 | 正文採用要求 | 下一驗證 |
| --- | --- | --- |
| 導言／一 | UI 與獨立驗證、銀行比喻、多種資料入口；圖 1 分出互斥的通過／不通過 | 完整雙語與分支端點 |
| 二 | 餐廳水平／垂直開發比較、M07-03／04／05 三切片表與逐次交付證據 | 表格與推理 |
| 三 | 三個識別字、字串／strip／80 規則；八類測試表；圖 2 可改三欄、檢查與重設 | 空白、80／81、修改失效、鍵盤與無 JS |
| 四／1 | 圖 3 三種平行責任；完整 rules.py；FIELDS／isinstance／strip／len／append／return 解說；不修改原值 | 排版修復後實際執行 |
| 五／為什麼不能只測畫面 | 單元測試與 TDD 定義、完整 pytest、六個術語、訊息精確度限制、醫院 API 反例與可信邊界 | 程式與負向案例 |
| 六 | 四步過期結果情境；State／State Invalidation；圖 4 A→通過→B→失效；電商／工廠／Agent 案例與無匯出界線 | 當次輸入與結果一致 |
| 七 | 六產業表；結構、業務、授權、真實性四層及本課界線 | 六列與四層語義 |
| 八 | 完整八步 Agent 工作指令與五項驗收；兩種命令；Diff、實際操作與未執行不得稱通過 | 可複製程式與指令 |
| 九 | 五項帶走能力；Unicode code point／grapheme cluster 計數界線 | Python／瀏覽器規則一致 |
| 十 | 工廠 API JSON、三個原問題、參考解析；不建立假送出或批改功能 | 原生參考答案與搜尋 |

## 參考圖的關係契約

1. image-1：UI→Validation 是傳送資料；Validation 分流為不通過與通過，兩者互斥。窄版保留條件標籤，不能把不通過連到通過。
2. image-2：教學用合成文字輸入，預設 SYN-001／DEMO-A／合成申請表。示範僅檢查文字規則；缺鍵、None、數字在 Python 測試處理。輸入修改後清除舊結果；沒有真實 API、保存或學習評分。
3. image-3：app.py、rules.py、tests/test_rules.py 是平行責任，排列不代表時間順序，不畫流程箭頭。
4. image-4：A→A 的結果→改成 B→舊結果失效，箭頭表示事件順序；B 是否合格需重新檢查。

## 已確認的編輯處理

原稿壓成單行的 Python 會恢復縮排與換行，識別字和原本規則保留。來源卡 favicon、引用殘片與聊天式開場保留在原稿，正式教材改為教學導言。HTML 實體及反斜線編號恢復正常可複製指令。原稿呼叫「提交答案並請我批改」在靜態教材使用既有參考答案機制，不假稱已提供批改服務。

既有工作坊 rules.py 的錯誤訊息把缺鍵／非字串／空白合併為「缺少…」，供稿示範則逐類說明並拒絕非 dict；正文須明示示範與工作坊版本差異，不能聲稱兩者逐字相同。本次尚未改動工作坊與 ZIP。

## 下一關

完成兩語逐節正文與圖解／互動，核對既有錨點與發布日期；執行來源到正文、型別、單元、發布閘門、四尺寸／200%／無 JavaScript／鍵盤、SVG 與正式站回讀。各層完成後填入實際證據，再依授權提交、推送與部署。本紀錄目前只證明來源保存及範圍確認。

## 正式採用對照（本次實作）

原十節依序落在 problem、analogy、cases、implementation、testing、flow、industry、run、misread、understanding。原六個有效錨點 problem／analogy／cases／flow／run／misread 保留；原發布日 2026-11-05 保留，新版為 1.1.0／revision 4／2026-11-11。原三道選擇題留在 prior-lesson.json，新三題原開放問題採 Q04–Q06，沿既有參考答案展開；qa=[]。

- 第四節「1. 建立規則函式」與第五節「為什麼不能只測畫面？」均進入語意 h3；逐行函式解說與醫院 API 反例保留。第八節工作指令保留完整八步及五項驗收，兩語共享同一份可複製 code；英文段落另完整說明八步與驗收。
- 第三節八列測試矩陣、第二節三切片表、第五節六術語表與第七節六產業表均進入正文。六份 code 分別為 rules.py、pytest、醫院 JSON、Agent 指令、執行命令與工廠 JSON；不是下載原稿取代正文。
- `scripts/aase_m0704_content.py` 由兩語 teaching 稿與 figures.json 產生正式 JSON；`--check` 比較完整檔案。英文 code 與中文完全相同，避免規則範例在翻譯時漂移。兩語逐節／區塊／段落結構由正式驗證器與產生器核對。
- 四圖採固定資料模型，節點數 4／3／3／4，僅第四圖為時間流程；第一圖保留 UI→檢核與兩個互斥條件，第三圖不畫箭頭。圖二互動在頁面不傳送、不保存資料；SVG 只輸出原始三欄與尚未檢查狀態，標示為靜態預設，不輸出當前使用者輸入。
- `DataValidationDiagram.svelte` 以 HTML 節點、原生 form／label／input／button、可見焦點及 aria-live 呈現。窄版重排不改變條件歸屬。輸入不設 maxlength，讓讀者能實際觀察 81 字元遭拒；結果在 oninput 立即失效，重設恢復預設並清除結果。
- Python Unicode code point 與 str.strip 語義由 `validation-demo.ts` 對應，獨立與 Python 比對空白、FEFF、80／81 emoji 與組合字元。圖解資料不接受任意 markup／SVG 路徑。八 SVG 沿固定標籤及屬性白名單、小於 100000 bytes，由同一正式資料產生。

## 技術依據與修正邊界

2026-11-11 核對 [Python 3.12 字串與 strip](https://docs.python.org/3.12/library/stdtypes.html#text-sequence-type-str)、[pytest 參數化](https://docs.pytest.org/en/stable/how-to/parametrize.html)與[Streamlit widget 行為](https://docs.streamlit.io/develop/concepts/architecture/widget-behavior)。本次用本機 Python 實測範例與邊界；網頁示範不是 Streamlit runtime 的驗收。原稿末句「完成三題就掌握能力」改以實作與負向測試作為能力證據，參考答案展開不記錄分數、提交或學習完成。

來源保存與採用遵循 WRITE-04／05／06／09／10；全文到頁面遵循 WRITE-11、HTML-01–04；圖解與下載遵循 FIG-01／03–06；互動遵循 INT-01；鍵盤與參考答案遵循 A11Y-01–03。具體實測與正式站證據由本次發布回執承接。

## 本次完成證據

原稿與前版六項雜湊、Python 43 項、最終全套 368 項、本課正式瀏覽器 8 項及 Pages run 42992145430 均通過；兩語版本、日期、正文與八 SVG 已由正式網址回讀。完整命令、規則編號、圖意差異及驗證界線見[發布回執](../../../../releases/2026-11-11-aase-m07-04-replacement.md)與其 checks.json。既有「下一關」保留為本次工作順序紀錄，已執行結果以該回執為準。
