# M01-01 全文替換來源與圖解設計

本次目標：讓初學者用申請資料檢查情境，區分能展示、符合規格、使用者驗收與正式上線，並追溯問題、規格、程式、測試及交接。

## 原始來源與前版

- `pasted-text-1.txt`：本次供稿逐位元組保存，包含原標題、七節、兩個外部圖片連結及介面文字。
- `image-1.png`、`image-2.png`：兩張附圖原件；第一張為表單輸入與主要／次要操作，第二張為錯誤摘要、必填標記與欄位提示。
- `previous-v1.0.3.json`：修改前完整中英資料、來源、練習、答案與日期。
- `SHA256SUMS.txt`：以上四份來源的雜湊；在此目錄執行 `sha256sum -c SHA256SUMS.txt`。

## 採用與編輯處理

正文完整採用導言與七節，維持臺灣繁體中文並提供對等英譯。兩個表格、五種檔案的用途、房屋類比、醫院掛號類比、AppTest 小節、伺服器端重新確認權限與資料狀態、人與 Agent 四步分工、七個後續領域及四選項皆保留。既有 summary、目標、合成練習、readingGuide 與 qa=[] 保留；原發表日 2026-11-05，內容增為 v1.1.0／revision 5，修訂日 2026-11-06。

| 供稿 | 正式 section ID | 採用方式 |
| --- | --- | --- |
| 導言 | start | 完整五段 |
| 一、問題定義 | analogy | 完整文字、Who／Problem／Outcome 與雙表單對照 |
| 二、兩種情境 | scenario | 完整概念、固定資料切換及靜態結果表 |
| 三、工程文件 | trace | 完整解說及既有四步證據鏈 |
| 四、完成層次 | levels | 四層表、Verification／Validation、AppTest h3、後端界線 |
| 五、協作分工 | responsibility | 完整十二段 |
| 六、後續領域 | misunderstandings | 保留舊錨點，改為供稿七領域表與連結意義 |
| 七、理解檢核 | judgment、checks | 情境全文；選項及編輯解析由原生 details 呈現，答案 B |

原稿的介面匯出文字改為真實示範：缺漏時無下載連結，齊全時在瀏覽器產生合成 JSON。切換只用 SYN-001／DEMO-A／文件類型空白或「合成申請表」；不發請求、不寫入資料或成績，未將畫面阻擋宣稱為後端安全。原「提交答案並查看解析」改用既有原生參考答案，不新增假提交。AppTest 小標轉為語意 h3，未把 Markdown 標記當正文顯示。

## 兩張參考圖的設計對應

第一張保留一個主欄位、下方兩欄及主要／次要操作的群組。第二張保留上方紅色錯誤摘要、星號、欄位錯誤底線與文字提示。兩張均以本課三個合成欄位代換原圖姓名、Email 與居住地，避免無關個資；兩種設計為平行對照，沒有先後箭頭。示意操作為帶有說明的靜態文字，真正的情境控制放在第二節。

沿用本站低彩度背景、邊框及字型；桌面雙欄、窄容器直向重排，欄位文字可選取搜尋。錯誤以文字與線條共同表達。HTML／CSS 即為原生圖解，沒有外部圖片熱連結、整圖縮小或任意 SVG 注入，沒有新增 SVG 匯出格式。原始 PNG 僅供編輯比對，不作網站配圖下載。

`ApplicationCheckDemo.svelte` 僅由 M01-01 的 analogy／scenario 章節啟用；其他 AASE 與 CEH 沿既有元件。圖解文案來自教材 cards 資料；控制標籤為固定雙語，完整狀態同時有無 JavaScript 可讀的結果表。匯出條件由 `applicationReport` 集中檢查三個非空白欄位；切回缺漏即移除下載，避免使用上次通過結果。

## 查核與後續驗證

2026-11-06 核對 [Streamlit AppTest](https://docs.streamlit.io/develop/api-reference/app-testing/st.testing.v1.apptest)及 [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)：支援模擬程式輸入／結果與每次伺服器請求權限驗證的界線。AppTest 不能單獨提供人的理解或整體正式資安驗收。NN/g 既有 heuristics 來源承接狀態回饋與錯誤提示教學。

AI 協助轉換資料、完整英譯、元件與測試；人工讀者理解、實體手機與螢幕閱讀器仍需各自證據。驗證／發布結果集中於[修訂回執](../../../../releases/2026-11-06-aase-m01-01-replacement.md)，本來源保存不冒充測試或使用者驗收。
