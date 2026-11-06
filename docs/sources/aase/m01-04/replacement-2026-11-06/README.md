# M01-04 需求訪談：來源與採用紀錄

本資料夾保存 2026-11-06 使用者供稿全文、三張原始 PNG、抽換前 v1.0.2，以及 [123 段逐項對照](source-paragraph-map.json)。[SHA256SUMS.txt](SHA256SUMS.txt)以資料夾內相對路徑校驗；原文、原圖及前版保留原始位元組。正式正文為 [aase-m01-c04.json](../../../../../content/aase/lessons/aase-m01-c04.json)，發布與驗證見[回執](../../../../releases/2026-11-06-aase-m01-04-replacement.md)。

## 採用與編輯

完整替換導言及八節，依序保留醫師類比、100 位員工／40 位回覆的例子、引導與事件提問、五步流程、四種「慢」、文件缺漏完整案例、功能／易用性／成效、100／3／97 的樣本界線及跨角色訪談。原稿三題九個選項採原文，答案 B／C／B；與舊題意不同，使用新題目 ID Q1–Q3，前版 Q01–Q03 留在 previous.json。沒有將原稿當作學員作答，qa=[]。

- 原稿的跳脫粗體 `\*\*` 正規化成可讀文字；數字題號交由既有題目結構承接。
- 原稿「0/3 已回答」與「提交答案並請你批改」是貼入的介面文字，改採網站既有三題選項與原生參考答案。沒有送出、批改、分數或學習進度功能。
- 兩張 Markdown 表格改為語意 HTML 表格；固定欄位的程式碼原樣保留，中英共用相同識別字與中文提示。新增說明 documentType／showError 由應用提供，以及正式系統須在伺服器端驗證。依據 [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)；此例只展示固定必填欄位的介面分支。
- 第五節的「原始事實」保留原標籤；正文已明示它是假想訪談記錄，表示受訪者陳述層，並非獨立核實的業務事實。
- 五步圖補明第三步需求仍需使用者確認，箭頭只表示調查／驗證順序。第五步是驗證計畫，沒有預設已改善。
- 類比中醫療內容保留原稿，圖說限於先調查問題的思路。英文逐節對應相同例子、數字、條件與界線，沒有把其中一語縮成摘要。
- 補上 M03 problem.md 的下一步，承接舊版有效內容；保留原 start／analogy／survey／interview／synthetic／interpret 錨點、原發布與英文開放日期、目標及既有合成練習。

## 三張附圖的關係與重製差異

| 原圖 | 正文與下載 | 保留的關係 | 呈現差異 |
| --- | --- | --- | --- |
| [image-1.png](image-1.png) | analogy，comparison 兩語 SVG | 醫師／需求訪談兩欄平行、各自的原話與調查、共同原則 | 手機依閱讀順序堆疊，沒有兩欄間箭頭；共同原則放在兩欄後。使用現有字型與可搜尋文字，加入圖說與下載連結。 |
| [image-2.png](image-2.png) | workflow，process 兩語 SVG | 五個原話／追問／需求／假設／驗證節點，四支向下箭頭，末步橘色邊框 | 頁面維持直向流程、文字自然換行；補明假設與驗證狀態。SVG 固定座標，依正文同一資料產生。 |
| [image-3.png](image-3.png) | testing，evidence 兩語 SVG | 三列各自回答系統正確、人能使用、工作改善 | 保留三列比較，不畫成已完成的進度；頁面裝飾圖示改為文字符號，SVG 以標籤承接完整意義。 |

原 PNG 留在來源資料夾，不作縮小文字圖直接放在正文。語意 HTML、搜尋與六個可下載 SVG 共用正式正文的 cards／flow 資料。下載 SVG 使用 1040 單位寬 viewBox；它本身為固定布局，手機頁面的節點由 HTML／CSS 重排。新增的結構只接受 comparison／process／evidence，節點數固定 2／5／3，不引入任意內容標記或新的 inline SVG 邊界。

## 來源查核與下一層

2026-11-06 回讀 [GOV.UK 深度訪談](https://www.gov.uk/service-manual/user-research/using-in-depth-interviews)、[GOV.UK 易用性測試](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing)及 OWASP 輸入驗證，分別支援中立事件提問、觀察任務完成與伺服器端驗證。100／40、100／3／97 與缺漏紀錄是供稿的教學情境，不是本次調查結果。原稿沒有真實受訪者或實測改善資料，本次也不建立問卷後端。

維護順序：修改雙語正文 → `python3 scripts/aase_m0104_svg.py` → `npm run validate:content`、`npm test`、`npm run check` → 發布邊界與 release 檢查 → 專用雙語瀏覽器與圖檔下載 → 授權發布及正式回讀。學員理解、真人訪談與實際工作成效各需自己的證據。
