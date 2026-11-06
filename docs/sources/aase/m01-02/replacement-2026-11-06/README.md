# M01-02｜完整供稿、責任圖解與四情境採用紀錄

## 原始來源與決定

`pasted-text-1.txt` 為本次供稿逐位元組原件，`previous-v1.0.2.json` 保存修改前完整中英教材、四選項檢核、練習、來源及版本。`SHA256SUMS.txt` 核對兩者。正式內容正本仍是 `content/aase/lessons/aase-m01-c02.json`，不另建第二份可編輯正文。

本次附件目錄只有文字，沒有點陣圖。原文兩個 images.openai.com 連結未能提供可用圖像；連結、來源標題及取得狀態保存在 `image-reference-review.json`。使用者確認「依原文設計即可」，因此依原文角色、責任及證據關係設計原生 HTML 圖，沒有宣稱檢視或仿製未取得的原圖，也沒有熱連結不穩定圖源。

`source-paragraph-map.json` 按原順序對照 142 個段落，明列保留、表格／清單／選項保留、介面轉換、spec 用語釐清、外部圖源不可用及複製按鈕殘留。原文完整留存，採用對照與語意核對分開；沒有用章節數替代正文完整性。

## 章節對照

| 原稿 | 正式 section ID | 內容與呈現 |
| --- | --- | --- |
| 導言與五個問題 | start | 全文與五個學習問題 |
| 一、新同事類比 | analogy | 申請三欄、不得擅改業務規則、人與 AI 平行角色圖 |
| 二、四種責任 | responsibilities | 四卡、spec.md／Diff／Coding Agent 定義、範圍反例 |
| 三、三層完成證據 | evidence | 修車類比、Suggestion／Execution／Verification、三個證據問題與 pytest 界線 |
| 四、四種測試情境 | testing | 正常／缺漏／空白／先完整後清空、過期狀態類比、規則正確性界線 |
| 五、指令與權限 | boundaries | 萬用鑰匙類比、四列控制對照、最小權限、沙箱與雙層防護 |
| 六、任務契約 | contract | 原六項契約及可操作的缺陷回報；表頭保留目標，五列保留其餘欄位 |
| 七、工程觀念 | misunderstandings | 五步證據流程、四領域表、Capability／Authorization／Verification |
| 課後三題與結語 | review、checks | 三題 A–C 原選項、B／C／A 編輯解析、原生收合、不提交或評分 |

原發布日 2026-11-05 保留；本次 v1.1.0、revision 4、修訂日 2026-11-06。stable ID、slug、readingId、翻譯開放日期、summary、目標及練習維持既有模型；練習原「依表 2」改成「依任務契約表」，避免新增表格後引用錯位。目錄及相鄰／搜尋標題由「AI 能力與人類責任的分工」／“AI Capabilities and Human Responsibilities” 同步為供稿主題。工作坊 ZIP 的 curriculum.json 同步新標題；其餘 29 個檔案逐位元組不變。

## 圖解與互動設計

四圖都用既有受限 flow／cards 資料，不新增圖解型別、框架或 SVG 匯出格式。文字同源於教材資料，直接呈現並納入搜尋：

1. AI／人的工作為平行兩卡，保留原稿兩段角色引言。
2. 四種責任為平行四卡；同一人可兼任，不能把卡片數誤作人數或四份等價證據。
3. 修車三層證據為有編號流程；操作發生不自動證明修復，Verification 僅支持受測規則與情境。
4. 規則→實作→權限→工具證據→驗收為五步編號流程，說明可回到需求修訂，不以此宣稱正式上線。

`AgentTestScenarios` 僅在本課 testing 節啟用。固定合成編號 SYN-001、代號 DEMO-A；文件類型完整、空字串、三個空白、先完整後清空四種情境。沿既有 `applicationReport` 規則重新判斷目前三欄，不儲存舊通過旗標。UI 明示為規格預期，沒有執行實際 app.py／pytest、沒有新增匯出服務、沒有請求、儲存或評分。

預設「先完整，再清空」；四個原生按鈕可鍵盤操作，動態區域回報結果。無 JavaScript 保留預設及四情境表，切換停用。參考表列出所有規格預期，供讀者檢查假設；本站模型測試與受測應用、使用者任務及正式驗收分開記錄。

## 技術釐清與檢核模型

- 原文 spec.md 稱需求說明書；採用版明確稱為將已確認需求轉成可檢查條件的「規格說明書」，與 M01-01 的 problem.md／spec.md 分工一致。
- 補明 Unix 類系統的刪除通常依賴父目錄寫入及搜尋權，而非只把檔案設唯讀；隔離工作目錄也須有實際權限／隔離設定。原 Prompt／Permission 四列對照保留，不把目錄名稱當技術限制。
- 供稿三題各三個選項，原樣保留九個選項，沒有補造 D。AASE 驗證器只接受三或四選項；解析數須相同、答案在範圍內、兩語選項／解析數一致。CEH 的資料驗證不放寬，其餘 48 篇保持原四選項。
- 舊英文出版與短標題遷移測試改核對保存的 v1.0.2；新正文另以來源對照、三選項邊界及四情境測試驗證。舊問題與答案完整留在前版檔，沒有改寫歷史或操作學員進度。

2026-11-06 核對 [NIST GOVERN 2／3.2](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)、[pytest 8.4 執行方式](https://docs.pytest.org/en/8.4.x/how-to/usage.html)、[OWASP 最小權限](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)及 [unlink(2)](https://man7.org/linux/man-pages/man2/unlink.2.html)。來源支持責任分工、工具執行及實際權限的判斷，不構成治理認證或環境隔離驗收。

## 維護與驗證界線

直接維護既有雙語 JSON、原生圖解區塊及三選項題目；`src/lib/agent-test-scenarios.ts` 保存固定合成輸入。執行內容、單元、型別、publication-boundary、release，再跑 `npx playwright test --config playwright.aase-m0102.config.ts`；正式站設定 `AASE_BASE_URL`。另核對既有 M01 四篇英文與 M01-01 雙語互動回歸。

規則、實測及發布見[修訂回執](../../../../releases/2026-11-06-aase-m01-02-replacement.md)。AI 協助編輯、完整英譯、圖解與程式驗證；實體手機、完整螢幕閱讀器、獨立讀者理解及真正受測應用的四情境執行仍各自待證據。
