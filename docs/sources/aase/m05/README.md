# AASE M05-01、02、04、05｜來源與新編範圍

日期：2026-11-05。四篇繁中初版均v1.0.0、revision 1；M05-03的v1.0.2、原發布日、正文及答案保留。依已貼上的完整規劃續編，不冒稱恢復遺失ZIP。

| 概念 | 原始方法來源 | 本次教學界線 |
| --- | --- | --- |
| M05-01 Prompt／Spec | NASA需求檢查表、Cucumber BDD | 系統承諾與Agent交辦分開；長度與副檔名不決定責任。沒有真實Agent執行。 |
| M05-02 Story與需求 | Agile Alliance User Stories、NASA需求、W3C鍵盤說明 | Story不是完整規格；功能／品質／約束為討論面向，不將所有資安要求硬分同一類；未知效能門檻不編造數字。 |
| M05-04 SDD變更 | Cucumber BDD、NASA、OpenSpec Concepts | SDD為本課工作定義，非通用工具標準；第四欄只是合成候選與影響盤點，參考解答仍三欄。 |
| M05-05 OpenSpec | 官方Concepts與Getting Started固定提交 | 目前規格、候選差異、提案、設計、任務與證據分工；CLI與助理指令位置分清，不宣稱已初始化或通過工具驗證。 |

OpenSpec查核提交：3e4d5f0769e2857c8eb54f149cbf5e4f703fa04c，來源package.json版本標1.16.0；不把main分支或套件版本自行等同歷史發布標籤。Concepts從該提交raw文件讀取；Getting Started raw抓取失敗後，改用GitHub contents API固定同一提交讀取，與先前main頁文件關係核對。網址與日期集中於content/aase/sources.json。

本次沒有安裝OpenSpec、初始化專案、呼叫CLI或在本repo啟用其設定。M05-05保留workshopDepth=extension；讀者可先以紙上文件對照完成概念練習，完整CLI操作需另核對實際環境。格式檢查、任務勾選與封存不等於行為或安全通過。

每篇六節、圖解、類比、案例、誤解、最小練習與三題四選項解析，共十二題；qa為空陣列。需求代號、第四欄、分類表與例子均新編合成。工具路徑為關係示意，不是本repo已產生的檔案；spec.md、rules.py、app.py與tests/test_rules.py／test_app.py的既有參考路徑已核對。沒有新增不存在的測試名稱作為通過證據。

共用CEH欄位及flow／cards／table／step資料模型，未改共用元件、原SVG、工作坊ZIP或參考程式。NASA僅採清楚、可追溯、可驗證等特定原則，不套用航太流程。BDD、Gherkin、SDD與OpenSpec保留各自概念，沒有混稱同義工具。
