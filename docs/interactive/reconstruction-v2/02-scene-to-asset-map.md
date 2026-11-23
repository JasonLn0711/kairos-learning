# 課程與圖件的對照

## Request Lifecycle

browser → BrowserDevice（第一步另有 UserFigure）；dns → DNSResolver；edge → ServerRack 的反向代理變體；app → ServerRack 的應用變體；database → DatabaseCylinder。四條實體連線由既有 edges 提供，逐段方向由 scene.route 指定。每個角色共用底座、接觸影、雙語標籤與焦點標記。

| 步驟 | 角色與路徑 | 當步圖件 |
|---|---|---|
| 1 navigation | browser 本地解析 | 人與筆電，無網路封包 |
| 2 dns | browser → dns → browser | NetworkEdge、查詢及回覆；快取命中停在筆電 |
| 3 tcp | browser → edge → browser → edge | 三段連線建立，依序顯示方向 |
| 4 tls | 同上 | LockBadge 表示安全交握 |
| 5 http-request | browser → edge | 請求封套 |
| 6 proxy | edge → app | 兩種 ServerRack 角色及轉送封包 |
| 7 application | app 本地處理 | 活動框與處理標籤 |
| 8 database | app → database → app | 資料圓柱、查詢與結果；慢查詢延長抵達後的等待 |
| 9 response | app → edge → browser | 回覆標記依序返回 |
| 10 recap | browser → edge → app → database → app → edge → browser | 全程回顧，保留原路徑 |

## AASE 的選擇規則

先依 demo 選擇可互動模擬，再依 visual 選因果遮罩或平行支撐圖，最後依 kind 選呈現方式。Softmax 第一步辨認分數與值，後兩步以 WeightBar 連結 attentionDemo 的權重與合成值。Four Gates 第一步區分格式與權限，中段用 evaluateGates 與 GateMark，末段對照工具回報與獨立驗收。

| kind | 視覺家族 |
|---|---|
| token-stream、vector-inspector、attention-matrix | token 序列、向量座標、矩陣／遮罩 |
| numeric-budget | 容量長條，softmax demo 則用相同尺度的權重長條 |
| process-flow、state-machine、timeline-trace | 流程、狀態分支、事件時間線 |
| document-retrieval、trust-boundary | 文件選取、權限邊界與關卡 |
| comparison、evidence-check | 並列比較、證據與結果 |
| isometric-topology | 已定義，目前 120 個 authored scenes 中無使用 |

下列各列依 manifest 順序，三欄保留原始種類、demo 或 visual 特例。

| 章 | 概念 slug | 第一步 | 第二步 | 第三步 |
|---|---|---|---|---|
| m02-01 | tokenization | token-stream | token-stream | token-stream |
| m02-01 | embeddings | vector-inspector | vector-inspector | vector-inspector |
| m02-01 | position-information | token-stream | token-stream | token-stream |
| m02-01 | attention-qkv | process-flow | comparison | attention-matrix / causal-mask |
| m02-01 | softmax-weighted-sum | numeric-budget | numeric-budget / softmax | numeric-budget / softmax |
| m02-01 | transformer-block | comparison | comparison | process-flow |
| m02-01 | autoregressive-generation | token-stream | token-stream | token-stream |
| m02-01 | verification-boundary | evidence-check | evidence-check / required-field | evidence-check |
| m02-02 | stored-vs-visible-context | document-retrieval | document-retrieval | document-retrieval |
| m02-02 | context-composition | process-flow | comparison | process-flow |
| m02-02 | context-budget | numeric-budget | numeric-budget / budget | numeric-budget |
| m02-02 | context-failure-diagnosis | evidence-check | comparison | evidence-check |
| m02-02 | position-effects | comparison | comparison | comparison |
| m02-02 | task-package-handoff | evidence-check | evidence-check | evidence-check |
| m02-03 | kv-cache | token-stream | process-flow | evidence-check |
| m02-03 | compaction | comparison | comparison | evidence-check |
| m02-03 | rag | document-retrieval | document-retrieval | evidence-check |
| m02-03 | memory | timeline-trace | document-retrieval | evidence-check |
| m02-03 | cross-session-orchestration | comparison | timeline-trace | evidence-check |
| m02-03 | method-selection | comparison | comparison | evidence-check |
| m02-04 | chatbot-workflow-agent | comparison | comparison | process-flow |
| m02-04 | deterministic-workflow | process-flow | state-machine / workflow | evidence-check |
| m02-04 | agent-decision-loop | state-machine | state-machine | evidence-check |
| m02-04 | build-agent-vs-runtime | process-flow | comparison | evidence-check |
| m02-04 | governed-autonomy | trust-boundary | trust-boundary / governed-policy | evidence-check |
| m02-04 | hybrid-design | process-flow | state-machine | evidence-check |
| m02-05 | llm-vs-harness | comparison / support-network | comparison | comparison |
| m02-05 | context-and-tools | comparison | comparison | comparison |
| m02-05 | orchestration-and-execution | timeline-trace | timeline-trace | timeline-trace |
| m02-05 | security-and-observability | trust-boundary | trust-boundary | trust-boundary |
| m02-05 | harness-diagnostics | evidence-check | comparison | evidence-check |
| m02-05 | mcp-harness-boundary | process-flow | process-flow | process-flow |
| m02-06 | tool-intent-and-result | process-flow | state-machine | evidence-check |
| m02-06 | mcp-tool-calling | process-flow | comparison | evidence-check |
| m02-06 | four-gates | trust-boundary | trust-boundary / gates | trust-boundary |
| m02-06 | sandbox-boundary | trust-boundary | trust-boundary / sandbox-policy | evidence-check |
| m02-06 | observability-signals | comparison | timeline-trace | evidence-check |
| m02-06 | prompt-injection-boundary | trust-boundary / scope-policy | trust-boundary | evidence-check |
| m02-06 | timeout-retry-idempotency | state-machine | timeline-trace | comparison / retry-policy |
| m02-06 | partial-success-verification | timeline-trace | state-machine / workflow | evidence-check |

## 沿用與遷移

| 既有實作 | 決定 | 可移除條件 |
|---|---|---|
| InteractiveStage | 包裝現有場景與播放輸入，換用角色 registry，保留原版作對照 | 十步、兩情境、兩語系、鏡頭、無 JS 與動態比對通過 |
| StageDiagram | 保留遮罩、支撐圖、向量與矩陣的專用分支 | 對應 renderer 在真實資料證明等價 |
| CSS cards | 保留可讀 DOM，依比較、流程、證據、追蹤調整布局 | 語意順序與窄版閱讀有對照證據 |
| LearningStage、PolicyStage | 包裝既有計算器及控制，將同一結果綁定圖件 | 模擬不重寫，維持 canonical fixtures |
| 六章 scenes 與六份課文 | 保留所有 slug、來源錨點、檢核題與原文 | 不列入移除範圍 |
