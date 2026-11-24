# Task 08　四十單元逐項紀錄

六章共四十個單元在本機整合版完成逐幕驗證。每個單元檢查中英各三幕、可見標題、renderer、來源錨點及桌面高度。具備情境選項的幕另核對切換結果。檔案連結開啟該單元第一幕，章別 JSON 收錄其餘五張圖與逐張雜湊。

代表課的數學與政策已整合。其餘單元沿用原教材與共用外框，比較、證據、來源、時間線與信任邊界版型已整合。下表列出保留或改版的決策，以及每一列的實測結果。

## M02-01

[雙語紀錄](../../../.local/interactive-v2/task08/integrated/chapters/m02-01.json) · [候選版紀錄](../../../.local/interactive-v2/task08/family-candidate/m02-01.json)

| 單元 | 三幕使用的 renderer | 決策與遷移狀態 | 首幕 |
|---|---|---|---|
| tokenization | token-stream | 保留原家族與新外框，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-01-tokenization-zh-01.png) |
| embeddings | vector-inspector | 保留原家族與新外框，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-01-embeddings-zh-01.png) |
| position-information | token-stream | 保留原家族與新外框，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-01-position-information-zh-01.png) |
| attention-qkv | process-flow, comparison, causal-mask | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-01-attention-qkv-zh-01.png) |
| softmax-weighted-sum | numeric-budget, softmax | 已整合，逐幕與代表課人工驗收通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-01-softmax-weighted-sum-zh-01.png) |
| transformer-block | comparison, process-flow | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-01-transformer-block-zh-01.png) |
| autoregressive-generation | token-stream | 保留原家族與新外框，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-01-autoregressive-generation-zh-01.png) |
| verification-boundary | evidence-check, required-field | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-01-verification-boundary-zh-01.png) |

## M02-02

[雙語紀錄](../../../.local/interactive-v2/task08/integrated/chapters/m02-02.json) · [候選版紀錄](../../../.local/interactive-v2/task08/family-candidate/m02-02.json)

| 單元 | 三幕使用的 renderer | 決策與遷移狀態 | 首幕 |
|---|---|---|---|
| stored-vs-visible-context | document-retrieval | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-02-stored-vs-visible-context-zh-01.png) |
| context-composition | process-flow, comparison | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-02-context-composition-zh-01.png) |
| context-budget | numeric-budget, budget | 保留原家族與新外框，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-02-context-budget-zh-01.png) |
| context-failure-diagnosis | evidence-check, comparison | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-02-context-failure-diagnosis-zh-01.png) |
| position-effects | comparison | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-02-position-effects-zh-01.png) |
| task-package-handoff | evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-02-task-package-handoff-zh-01.png) |

## M02-03

[雙語紀錄](../../../.local/interactive-v2/task08/integrated/chapters/m02-03.json) · [候選版紀錄](../../../.local/interactive-v2/task08/family-candidate/m02-03.json)

| 單元 | 三幕使用的 renderer | 決策與遷移狀態 | 首幕 |
|---|---|---|---|
| kv-cache | token-stream, process-flow, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-03-kv-cache-zh-01.png) |
| compaction | comparison, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-03-compaction-zh-01.png) |
| rag | document-retrieval, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-03-rag-zh-01.png) |
| memory | timeline-trace, document-retrieval, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-03-memory-zh-01.png) |
| cross-session-orchestration | comparison, timeline-trace, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-03-cross-session-orchestration-zh-01.png) |
| method-selection | comparison, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-03-method-selection-zh-01.png) |

## M02-04

[雙語紀錄](../../../.local/interactive-v2/task08/integrated/chapters/m02-04.json) · [候選版紀錄](../../../.local/interactive-v2/task08/family-candidate/m02-04.json)

| 單元 | 三幕使用的 renderer | 決策與遷移狀態 | 首幕 |
|---|---|---|---|
| chatbot-workflow-agent | comparison, process-flow | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-04-chatbot-workflow-agent-zh-01.png) |
| deterministic-workflow | process-flow, workflow, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-04-deterministic-workflow-zh-01.png) |
| agent-decision-loop | state-machine, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-04-agent-decision-loop-zh-01.png) |
| build-agent-vs-runtime | process-flow, comparison, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-04-build-agent-vs-runtime-zh-01.png) |
| governed-autonomy | trust-boundary, governed-policy, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-04-governed-autonomy-zh-01.png) |
| hybrid-design | process-flow, state-machine, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-04-hybrid-design-zh-01.png) |

## M02-05

[雙語紀錄](../../../.local/interactive-v2/task08/integrated/chapters/m02-05.json) · [候選版紀錄](../../../.local/interactive-v2/task08/family-candidate/m02-05.json)

| 單元 | 三幕使用的 renderer | 決策與遷移狀態 | 首幕 |
|---|---|---|---|
| llm-vs-harness | support-network, comparison | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-05-llm-vs-harness-zh-01.png) |
| context-and-tools | comparison | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-05-context-and-tools-zh-01.png) |
| orchestration-and-execution | timeline-trace | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-05-orchestration-and-execution-zh-01.png) |
| security-and-observability | trust-boundary | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-05-security-and-observability-zh-01.png) |
| harness-diagnostics | evidence-check, comparison | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-05-harness-diagnostics-zh-01.png) |
| mcp-harness-boundary | process-flow | 保留原家族與新外框，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-05-mcp-harness-boundary-zh-01.png) |

## M02-06

[雙語紀錄](../../../.local/interactive-v2/task08/integrated/chapters/m02-06.json) · [候選版紀錄](../../../.local/interactive-v2/task08/family-candidate/m02-06.json)

| 單元 | 三幕使用的 renderer | 決策與遷移狀態 | 首幕 |
|---|---|---|---|
| tool-intent-and-result | process-flow, state-machine, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-06-tool-intent-and-result-zh-01.png) |
| mcp-tool-calling | process-flow, comparison, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-06-mcp-tool-calling-zh-01.png) |
| four-gates | trust-boundary, gates | 已整合，逐幕與代表課人工驗收通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-06-four-gates-zh-01.png) |
| sandbox-boundary | trust-boundary, sandbox-policy, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-06-sandbox-boundary-zh-01.png) |
| observability-signals | comparison, timeline-trace, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-06-observability-signals-zh-01.png) |
| prompt-injection-boundary | scope-policy, trust-boundary, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-06-prompt-injection-boundary-zh-01.png) |
| timeout-retry-idempotency | state-machine, timeline-trace, retry-policy | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-06-timeout-retry-idempotency-zh-01.png) |
| partial-success-verification | timeline-trace, workflow, evidence-check | 已整合新家族，逐幕通過 | [查看](../../../.local/interactive-v2/task08/integrated/chapters/m02-06-partial-success-verification-zh-01.png) |
