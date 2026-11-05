# M02 六篇英文與來源核對

2026-11-05，新增六篇 text.en 及 18 題 checks[].text.en。六份 before.json 保存本次修改前正本。中文目標、導讀、正文、練習、來源、qa、檢核與答案索引保留；版本從 v1.0.0／revision 1 升為 v1.0.1／revision 2，原發布日與實際修訂日均為 2026-11-05。

## 原理與範例界線

- M02-01：[Hugging Face tokenization](https://huggingface.co/docs/transformers/main/en/tokenizer_summary) 與 [Transformer 原論文](https://arxiv.org/abs/1706.03762)。手工中文切分明確標示為教具；softmax 算式與離線 Python 保留，Attention 權重、下一 token 分布與事實正確性分開。
- M02-02：[Lost in the Middle](https://arxiv.org/abs/2307.03172) 的結果限於該研究任務；[Anthropic context engineering](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents) 支持有限上下文、壓縮及結構化紀錄的區分。8192、7800、392 與超出 208 都是明示假設的教學預算，不是產品測量。
- M02-03：[Hugging Face KV Cache](https://huggingface.co/docs/transformers/main/en/cache_explanation)、[vLLM prefix caching](https://docs.vllm.ai/en/latest/design/prefix_caching/)、上述 context engineering 與 [RAG 原論文](https://arxiv.org/abs/2005.11401)。重用推論狀態、摘要、檢索及跨工作階段紀錄各有目的與失效條件；沒有進行模型效能或檢索品質實測。
- M02-04：[Anthropic Building effective agents](https://www.anthropic.com/research/building-effective-agents) 的固定路徑與動態控制區分。保留 2024 年文章及術語範圍，不宣稱每個產品採相同命名；工具次數與聊天介面不直接決定架構。
- M02-05：六面向是本課程規劃的平行分析架構，非通用標準或六階段流程。[MCP tools 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) 只作介面例子，不把訊息交換當成測試環境、權限限制或驗收證據。
- M02-06：同一固定版 MCP 與 [OWASP Agent Security](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)。合成 JSON 是 client 組裝的示意請求；有效格式、授權、執行及任務完成分開。工具輸出維持不可信資料，沒有建立真實 MCP server、sandbox 或對外連線。

逐節對照主張、條件、數字、角色、工具名稱及答案。schema 另核對章節、段落、表格、圖解節點及步數；三份程式／JSON 與中文逐位元一致。Python Attention 的兩種分數與預算的符合／超額情境由測試實際執行，JSON 另解析工具與參數。這些離線結果不證明實際模型、Agent 或 sandbox 已驗收。

## 檢查與出版

證據保存在忽略目錄 .local/aase/m02-en/；最終結果與發布狀態見[回執](../../../releases/2026-11-05-aase-m02-en.md)。沿用 CEH 共用版型及欄位；未修改共用元件、樣式、課時、工作坊或 ZIP。原附件仍未取得，沒有將新教材當成原檔復原。獨立真人審稿、指定 Agent 全流程及工作坊真人接受維持待驗。

Pages run 41992379264 成功；正式英文完整 24 項與受影響中文 8 項通過，本機完整英文 24／中文 65 項分開保存。發布不提升為真人接受或指定 Agent 全流程驗收。
