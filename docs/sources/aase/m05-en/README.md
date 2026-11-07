# M05 五篇英譯與來源核對

2026-11-05，新增五篇 text.en 與 13 題 checks[].text.en。五份 before.json 保存修改前正本。中文目標、導讀、正文、練習、來源、qa、檢核及答案索引保留。M05-03 從 v1.0.2／revision 3 升為 v1.0.3／revision 4，其餘四篇從 v1.0.0／revision 1 升為 v1.0.1／revision 2。保留原發布日，實際修訂日為 2026-11-05。

## 原理與課堂界線

- M05-01：[NASA 需求檢查表](https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/)及 [Cucumber BDD](https://cucumber.io/docs/bdd/)支持清楚、可追溯、可驗證要求與跨角色例子討論。系統承諾與 Agent 當次交辦各有責任，Prompt 長度／副檔名不決定其分類。沒有真正呼叫 Agent 或採用航太流程。
- M05-02：[Agile Alliance User Stories](https://agilealliance.org/glossary/user-stories/)、NASA 及 [W3C Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)。Story 開啟價值討論，仍需條件、規則與情境；功能／品質／約束為討論面向，不將所有資安硬分同一類，未知效能條件不編造秒數。
- M05-03：[Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)與 [Streamlit AppTest](https://docs.streamlit.io/develop/api-reference/app-testing/st.testing.v1.apptest)。Given／When／Then 對應條件、觸發、可觀察結果；正常、缺漏、空白、過期四個情境保留。紙上情境不是執行結果，AppTest 也不替代真實瀏覽器下載／鍵盤。多人授權為未實作需求，不記成通過。
- M05-04：SDD 是課程工作定義，BDD、Gherkin 與 OpenSpec 不混稱。C-02 第四欄只是合成候選與影響盤點，reference/ 保持原三欄；規格、程式偏離及真正需求改變分開處理，不修改承諾以掩蓋失敗。
- M05-05：[固定提交 Concepts](https://github.com/Fission-AI/OpenSpec/blob/3e4d5f0769e2857c8eb54f149cbf5e4f703fa04c/docs/concepts.md)及 [Getting Started](https://github.com/Fission-AI/OpenSpec/blob/3e4d5f0769e2857c8eb54f149cbf5e4f703fa04c/docs/getting-started.md)。目前規格、候選差異、提案、設計、任務與證據保留不同角色。終端機命令與助理 slash 指令分開，格式驗證、任務勾選、封存與行為通過分開。

GitHub 頁面由瀏覽工具讀取時回報 Cache miss，本次改從同一固定提交的官方 raw 端點讀回兩份文件與 package.json。package.json 標示 1.16.0；沒有將套件版本當成已執行 CLI 或歷史發布標籤。Concepts SHA256 為 40b9b3c9ceb8c86fa3b6ea22fddb618be9bcc063fc5774567e7788193087742a；Getting Started 為 b497e6db6ef06495d23d61f30868618f1ccba485c05bd7545377d8826a1cf849；package.json 為 a8acae0ff033728f41478cca0de8ee087d7f10f9bd09232635224e89738fa975。原始回讀內容只保存在忽略目錄，公開教材連結固定官方來源。

原理主張、數字、情境及答案逐節對照。五份原繁中範本 code 逐位元保留，英文前文及區塊說明對應其內容；沒有以中文代填英文正文。圖說以責任或卡名識別，不依左右位置；M05-05 仍為線上延伸，沒有安裝／啟用 OpenSpec、改設定或擴大 workshop 範圍。

## 驗證與出版

本批日誌及瀏覽器結果保存在 .local/aase/m05-en/；實測、圖解檢視、提交與正式回讀見[回執](../../../releases/2026-11-05-aase-m05-en.md)。代理翻譯及技術核對不是獨立真人審稿、指定 Agent 實際協作或真人工作坊接受。原遺失附件仍未取得，不宣稱恢復原稿。

Pages run 41997830104 成功，正式英文完整重驗 40／本次中文 7 項通過；首次英文 39／1 的 503 證據與恢復回讀保留，詳見回執。本機英文 40、完整中文 65 及參考 pytest 23 與正式結果分開保存，沒有提升為真人或工具 CLI 接受。
