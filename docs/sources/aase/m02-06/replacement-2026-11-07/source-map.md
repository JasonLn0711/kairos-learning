# M02-06 來源到正文與圖解的逐節對照

正式中文路徑：`/courses/aase/v1/m02/concepts/m02-06/`；英文加 `/en`。九節供稿與導言對應十個正文 section，MCP、JSON 與日誌以同節 step 區塊直接呈現。中英逐節核對機制、例子、數字、條件、限制與答案，並保留原有紙上練習。

| 原稿章節／小節 | 成稿錨點 | 保留內容與編輯決策 |
| --- | --- | --- |
| 導言、四句話與驗收 | `start` | 「AI 說完成，憑什麼相信」；Tool Calling／Authorization／Sandbox／Observability 四責任與最後 Verification。週末兩科標明本課獨立合成規格，避免與 M02-03 的三科示例混淆。 |
| 一、主管與新員工 | `analogy` | 交代任務、申請讀檔、權限、只讀範圍、記錄人／版本／結果、最新版本與規則驗收。原稿「週末排班」統一成後文的讀書排程專案；原文保留於來源檔。圖序是教學順序，補明授權與記錄跨步驟持續生效。 |
| 二、聊天與工具呼叫 | `calling`、`tool-request`、`tool-response` | OpenCode／Coding Agent 情境、cat 建議與外圍程式讀檔的區別；read_file、/project/requirements.md 請求及 status/content 回覆完整保留；請求不是結果，Harness/Runtime 檢查後執行，讀錯／舊版風險。兩段 JSON 明示本課簡化格式。 |
| 二、MCP 又是什麼 | `mcp-example` | 標準化工具／資料連接、不同廠商檔案與資料庫工具；連接不授權、不等於沙箱。保留舊版 MCP 2025-06-18 tools/call JSON-RPC 示例及自訂 read_project_file，區分模型意圖與客戶端協定訊息。 |
| 三、四個關卡 | `cycle` | 四列 Validation／Authorization／Execution／Verification 與問題、例子完整進表；三科程式改成兩科需求；讀檔／修改／儲存成功仍需週末測試；操作與任務成功分開。保留舊版不存在／工作目錄／越界／執行錯誤與 MCP isError，補明測試必須涵蓋需求。 |
| 四、水電比喻與沙箱 | `sandbox` | 廚房必要工具、房間鑰匙／保險箱／伺服器管理權；三允許、三禁止；作業系統、容器、檔案、網路與資源上限；Docker 權限／掛載／網路風險與 Prompt 不是 OS 控制。保留停止程序不撤回外部副作用，補明只讀案例與程式修改任務需分別配置權限。 |
| 五、黑盒子與兩筆日誌 | `observe`、`success-log`、`denied-log` | 飛行儀表／監控比喻、事件時間結果異常；Task ID 1024、read_file、路徑、v3、SUCCESS、12 ms、Next 原樣保留；PERMISSION_DENIED／Outside allowed scope 原樣保留；拒絕有價值、禁止任意記密碼／API Key／完整敏感文件。12 ms 明列為供稿示例，非實測。 |
| 五、Logs／Metrics／Traces | `observe` | 事件、成功率／錯誤率／延遲、跨工具串接三類訊號；支援判斷除錯稽核，不保證安全。保留舊版最小紀錄的呼叫 ID、遮蔽參數、時間、產物參照與下一步理由。 |
| 六、提示注入 | `injection` | 原稿惡意文件引文、來源不是新任務／系統指令、客戶信要求銀行管理權比喻；資料不能自行升級授權；連結 Harness，系統檢查、工具與外送限制、必要的人確認。未提供攻擊執行程序。 |
| 七、逾時與冪等性 | `failure` | 寄信未寄出／已寄但回覆遺失兩分支、重寄雙信；讀檔對比寄信／付款／訂單；唯一請求編號與防重複；三狀態表完整保留。補明冪等為重複操作的預期效果相同、服務端必須識別請求、讀取結果仍可能更新，保留重試與資源上限、拒絕不繞過與日誌證據界線。 |
| 八、M02 六課 | `connection` | 六個課號、各自問題與技術名稱全部進圖，課號連至既有教材；LLM 推理生成提議與系統資訊／流程／工具／權限／驗收分工，模型能力與系統可靠性分開。 |
| 九、部分成功與二題 | `verification`、`checks` | 使用者週末兩科要求、Agent「已完成程式修改」回報、三成功／未執行／尚未確認五列完整呈現。Q04 保留 A–D 原選項、答案 B 與逐選項解說；Q05 保留開放式下一步問題，補現行規格、兩科／三科邊界、回歸與實際輸出的參考答案。 |
| 原稿提交評分文字 | `checks` | 沿既有原生 details 展開答案；沒有評分服務，因此不顯示無效提交按鈕，不寫入學員成績或完成。 |
| 原有練習 | `practice` | 保留合成請求、有效路徑／只讀設計、成功與拒絕日誌、不可信輸出四步，加上與本課規格相連的紙上驗收情境；環境、預期、檢查與清理保留。 |

## 四張參考圖

| 原圖 | 正式資料位置 | 關係、版面與差異 |
| --- | --- | --- |
| image-1 | analogy 圖 1 | 主管任務在上，五步向下箭頭，最後驗收以淡綠卡呈現。完整五責任保留；圖說補明授權與記錄非只在單一步驟生效。裝飾小圖示改為文字標籤。 |
| image-2 | sandbox 圖 2 | 允許／不允許左右兩欄，手機單欄；各三操作全部保留，綠／紅邊界搭配文字，不畫先後箭頭。 |
| image-3 | connection 圖 3 | 六課號左、問題與概念右，逐列對照；手機上下重排；無流程箭頭，課號可點到既有章節。文字以一段承接問題與術語，不依賴原圖的小字。 |
| image-4 | verification 圖 4 | 同一執行紀錄中的五列操作與狀態；三個成功綠字、未執行紅字、尚未確認保留文字；「部分成功」寫在圖名，避免把整體標成已交付。手機每列上下重排。 |

`ToolEvidenceDiagram.svelte` 只處理本課的四圖，從既有 cards/flow 資料渲染語意 HTML。`aase.ts` 限制各圖 5／2／6／5 節點、種類、位置與雙語結構。八個 SVG 由 `scripts/aase_m0206_svg.py` 從同一資料產生，沿用文字換行 helper、跳脫、元素白名單與 100000 bytes 上限；沒有任意 SVG／HTML 內容入口。搜尋索引沿用正式資料。

## 來源查核

2026-11-07 查核 [MCP 2025-06-18 Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) 的工具請求、授權考量與 isError；[Docker Engine security](https://docs.docker.com/engine/security/) 的權限與掛載限制；[OpenTelemetry Signals](https://opentelemetry.io/docs/concepts/signals/) 的事件、量測、追蹤區別；[AWS Builders’ Library](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) 的唯一請求 ID 與服務端冪等契約。提示注入與紀錄邊界沿 [OWASP Agent Security](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)。新增三筆來源於 `content/aase/sources.json`；既有 MCP 版本固定為教學引用版本，不宣稱其為最新規格。

本次工作驗證的是教學內容、圖解、網站與發布。程式區塊為訊息或日誌示意；JSON 可解析不代表工具已執行，沒有真實沙箱、寄信、付款或 Agent 安全實驗。
