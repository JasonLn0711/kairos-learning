# AASE M02｜來源與新編範圍

日期：2026-11-05。依使用者貼上的九模組規劃新編六篇繁中教材，均為 v1.0.0、revision 1；未恢復遺失 ZIP，也不以附件為續編前置條件。

| 概念 | 原理來源與界線 | 新編例子 |
| --- | --- | --- |
| M02-01 | Transformer 原論文、Hugging Face tokenizer 文件；手工切詞不當作 tokenizer 實測 | softmax 權重與加權值的純 Python 玩具計算，不是實際 LLM |
| M02-02 | Lost in the Middle 限原研究設定；Anthropic context engineering | 假設 8192 token 預算、保留輸出及超額計算，不代表供應商容量或 tokenizer 結果 |
| M02-03 | Hugging Face KV cache、vLLM prefix caching、RAG 原論文、context engineering、OWASP | KV／壓縮／檢索／外部記錄比較；未測速度、模型準確率或實際長期記憶 |
| M02-04 | Anthropic 2024 Building effective agents 的 workflow／agent 區別 | 確定性檢核流程與受限 Agent 任務；工具生態可能已變動 |
| M02-05 | context engineering、effective agents、OWASP | 六個平行面向是本課編輯架構，不宣稱業界統一標準或先後步驟 |
| M02-06 | MCP 2025-06-18 tools 固定版本、OWASP agent security | 客戶端 tools/call JSON 範例、權限與遮罩紀錄；未呼叫真實工具或建立 sandbox |

來源網址及查核日期集中於 content/aase/sources.json，文章及段落用 sourceIds 對應。未讀到的 JSON-RPC 獨立規格不列為已核對來源。每篇三題，共十八題編輯自我檢核；qa 保持空陣列。共用 CEH 欄位與閱讀元件，不新增 SVG、後端或依賴。

純 Python 範例由測試讀取實際教材 code 執行，另測等分權重與預算超額；只證明該算例。未做模型效能比較、真人學習評量或實際 Agent 安全驗證。
