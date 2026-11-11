# M09-03 完整供稿抽換紀錄

本課正本為 `content/aase/lessons/aase-m09-c03.json`，公開路徑 `/courses/aase/v1/m09/concepts/m09-03/`；英文加 `/en`。本次採用 v1.1.1／revision 5，保留原發布日 2026-11-05，版本修訂日 2026-11-11。發布與實測由[回執](../../../../releases/2026-11-11-aase-m09-03-replacement.md)記錄。

## 來源保存

- `original.zh.md`：使用者附件全文，逐位元組保存，含原網址說明、來源卡雜訊及模板按鈕文字。
- `image-1.png`、`image-2.png`：兩張原圖，不修改；各自為五階段直向追溯、三列驗收情境。
- `prior-lesson.json`：抽換前已公開的雙語 v1.0.2；前版與 Git 歷史一併保留。
- `teaching.zh.md`、`teaching.en.md`：完整採用稿與對應英譯；`scenario-original.zh.txt`保存移入圖 2 的原稿段落。
- `SHA256SUMS`：原件及採用稿雜湊。雜湊只證明檔案一致，不證明教學完整或已部署。

## 逐章／小節採用對照

| 供稿位置 | 正文錨點 | 保留的內容與編輯處理 |
| --- | --- | --- |
| 課次與導言 | introduction | M09 所屬、Demo & Acceptance Evidence；正確 URL 沿既有課次，不在正文保留過往錯鏈的編輯敘述。 |
| 一、先用一句話理解 | demo | 三種完成狀態、蓋房子比喻、五項建築檢查、照片限制、AI 產出與工程主張的證據要求。 |
| 二、整體架構 | analogy | 圖 1 完整五節點及五個問題；第四關突出實際觀察，四箭頭僅示閱讀順序。需求追溯目的、七列產物表與同一案例貫穿文件的理由。 |
| 三、理賠系統：背景與三需求 | walkthrough | 上傳與檢核流程、不完整／完整／資料變更三需求，同一筆測試案件。 |
| 三、情境 A | walkthrough 圖 2 第一列 | 醫療收據缺漏、提示、禁止完整報告下載；保存提示、禁止匯出結果、實際畫面三項證據。原段落搬入可搜尋 HTML 圖解，不刪成標題。 |
| 三、情境 B | walkthrough 圖 2 第二列 | 上傳收據重新檢核、允許 JSON、內容正確；實際檔、欄位比對、通過紀錄。 |
| 三、情境 C | walkthrough 圖 2 第三列 | 刪除醫療費用、舊下載失效、要求重驗；狀態與重新檢核紀錄。 |
| 三、過期結果說明 | walkthrough 圖後 | 銀行 500 萬元貸款與醫院數據更新兩例，說明畫面正常但結果與現況不一致。 |
| 四、驗收證據 | trace | 六列證據能力表；登入截圖、安全範圍、一次測試限制，30 項測試需版本／環境／時間／實際結果。 |
| 四、Given／When／Then | trace 小節 | 四行理賠規則範例、執行測試與預期／觀察之別；補充可執行 Gherkin 格式條件。 |
| 前版工作坊追溯 | legacy-trace | 原具體實作與 AppTest／瀏覽器／README 表保留為補充，不代替新稿九節。 |
| 五、展示失敗 | failure | 主管 Demo 失敗、昨日錄影、當次錯誤與歷史證據區分；追溯與重現的定義、跨電腦物流例與失敗記錄用途。 |
| 六、驗收與上線 | decision | 本機學生專題與醫院 100 人例、五列比較表；原型接受範圍範句及多人治理待驗事項。 |
| 七、模板及成果驗收紀錄小節 | assessment | 功能、規格 AC-03、SHA、三情境、證據位置、未驗、範圍及四種驗收決定；示範值不當作已驗。完整模板中英同行保存在兩語相同 code。 |
| 八、觀念整理 | takeaway | 需求／實作／測試／驗收分工，建築、藥廠、金融、法律、工廠類比。類比不代表滿足各領域正式法規。 |
| 九、理解檢核 | understanding、AASE-M09-C03-Q04 | 10 份履歷情境與三個原開放問題完整可見；另加三段編輯參考解析，用原生收合；原三道選擇題保留，qa=[]。 |

## 明列修正與採用界線

1. 原稿有網站 favicon／來源卡殘留；移除呈現雜訊，依原 sourceIds 保留正式來源連結。
2. 原稿 `m04` 錯鏈說明留在來源，正式頁沿 M09-03；未建立錯誤別名路由。
3. 原稿 `1\.` 等跳脫字元正規化；模板標題由 h2 調為 h3，保持九節層級；「複製驗收紀錄」是附件介面文字，正式頁提供可選取 code，未製作無作用按鈕。
4. Gherkin 的 Given／When／Then／And 後冒號僅作白話格式，執行時需去除並提供 Feature、Scenario 與步驟定義。查核：[Cucumber 官方 reference](https://cucumber.io/docs/gherkin/reference/)，2026-11-11 回讀。原始範例逐字保存在來源；正文補充條件，不宣稱此文字已執行。
5. 原稿「我會依照你的答案」改為靜態教材的自我檢核說明；參考解析屬編輯材料，不冒充真人作答、理解或正式驗收。
6. 圖 1 保留垂直五階段與第四階段淡色強調；圖 2 保留單欄三列、負向／正常／重新檢核角色，符號為裝飾且有文字重述。HTML 主文可換行，SVG 是獨立下載，不靠整張縮小維持手機閱讀。
7. 舊六錨點 demo／analogy／trace／walkthrough／assessment／decision保留；舊完整版本可由 prior-lesson.json 讀回。正文新增範圍，依 WRITE-06 提升 minor。

## 維護與驗收

`python3 scripts/aase_m0903_content.py --check` 核對雙語稿與正式 JSON；`python3 scripts/aase_m0903_svg.py --check` 核對四份下載。正文／搜尋／SVG 使用同一 JSON 圖解資料；自訂 renderer 僅用於本課。驗證器限定 analogy 五節點 flow、walkthrough 三節點 cards，拒絕任意欄位與錯誤關係。

`tests/aase-m0903-replacement.test.ts` 驗證資料與拒絕邊界；`playwright.aase-m0903.config.ts` 逐段核對全文次序、兩語四尺寸、200% 文字、無 JavaScript、鍵盤、搜尋、下載位元組及 SVG 字框。正式站以 `AASE_BASE_URL=https://learn.cs-kairos.com` 執行。真人教學接受與正式業務系統驗收均不由本站測試代填。
