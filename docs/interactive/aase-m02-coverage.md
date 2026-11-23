# AASE M02 source coverage

This mapping traces original educational synthesis to the bilingual canonical lesson files. The canonical full text retains its objectives, reading guides, exercises and assessments. Source rows with authored links name observed scene IDs. Planned rows identify implementation targets.

## AASE-M02-C01

Source file `content/aase/lessons/aase-m02-c01.json`. Status published, version 1.1.0, published 2026-11-05.

| Source lesson | Source section | Important claim or topic | Concept slugs | Scene targets | Teaching mode and evidence | Source references | Status and reviewer notes |
|---|---|---|---|---|---|---|---|
| AASE-M02-C01 | `pipeline` | Tokenization, vector processing and next-token generation form distinct stages. | tokenization, transformer-block, autoregressive-generation | tokenization: 01; transformer-block: 01; autoregressive-generation: 01 | Guided scenes and canonical reading. Inspect flow. | hf-tokenization, transformer-paper | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C01 | `units` | Token boundaries depend on tokenizer and input. One character can span multiple tokens. | tokenization | tokenization: 02, 03 | Guided scenes and canonical reading. Inspect cards. | hf-tokenization | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C01 | `analogy` | Token ID selects a vector. Position information changes the role of identical tokens in reordered text. | embeddings, position-information | embeddings: 01, 02, 03; position-information: 01, 02, 03 | Guided scenes and canonical reading. Inspect cards, position. | transformer-paper | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C01 | `attention` | Query–key comparison assigns weights. A causal mask governs visible positions and weighted values carry information forward. | attention-qkv | attention-qkv: 01, 02, 03 | Guided scenes and canonical reading. Inspect query-key-value, cards, self-attention. | transformer-paper | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C01 | `attention-example` | Subtracting the largest score before exponentiation preserves probabilities and prevents overflow. Weighted values yield the observable output. | softmax-weighted-sum | softmax-weighted-sum: 01, 02, 03 | Guided scenes and canonical reading. Inspect table, cards, softmax-observations, python-example. | transformer-paper | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C01 | `transformer` | Attention, feed-forward, residual paths and normalization cooperate. Architectural order varies. Autoregression emits one next token at a time. | transformer-block, autoregressive-generation | transformer-block: 01, 02, 03; autoregressive-generation: 01, 02, 03 | Guided scenes and canonical reading. Inspect autoregression. | transformer-paper | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C01 | `limits` | Attention, candidate-token probability and external verification address different questions. | verification-boundary | verification-boundary: 01, 02 | Guided scenes and canonical reading. Inspect table, flow. | hf-tokenization, transformer-paper | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C01 | `apply` | Fluent generated output still requires a reproducible check against an explicit requirement. | verification-boundary | verification-boundary: 03 | Guided scenes and canonical reading. Inspect article explanation. | hf-tokenization, transformer-paper | Authored source links checked. Browser evidence tracked separately. |

Canonical checks preserved: AASE-M02-C01-Q01, AASE-M02-C01-Q02, AASE-M02-C01-Q03, AASE-M02-C01-Q04. Open checks: 0 EN and 0 ZH. Retain the original exercise and route recap/check synthesis through the final concepts for this chapter.

## AASE-M02-C02

Source file `content/aase/lessons/aase-m02-c02.json`. Status published, version 1.1.1, published 2026-11-05.

| Source lesson | Source section | Important claim or topic | Concept slugs | Scene targets | Teaching mode and evidence | Source references | Status and reviewer notes |
|---|---|---|---|---|---|---|---|
| AASE-M02-C02 | `analogy` | A stored archive can exceed what was delivered to the current invocation. | stored-vs-visible-context | stored-vs-visible-context: 01, 02, 03 | Guided scenes and canonical reading. Inspect cards, four-day-story. | context-engineering | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C02 | `window` | Rules, task, selected history and retrieved/tool evidence occupy the invocation alongside reserved output. | context-composition | context-composition: 01, 02, 03 | Guided scenes and canonical reading. Inspect cards, history-memory. | context-engineering | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C02 | `budget-example` | The hypothetical 10,000-token budget leaves 500 with 500 log tokens and overflows by 800 with 1,800. | context-budget | context-budget: 01, 02, 03 | Guided scenes and canonical reading. Inspect cards, context-management, python-budget. | lost-middle, context-engineering | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C02 | `effective-use` | Capacity, selection, version conflict and failed use are distinct causes. Position effects are conditional. | context-failure-diagnosis, position-effects | context-failure-diagnosis: 01, 02; position-effects: 01, 02, 03 | Guided scenes and canonical reading. Inspect table, lost-middle. | lost-middle | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C02 | `prepare` | Carry forward document version, current tests, allowed scope, open risks and stop conditions. | task-package-handoff | task-package-handoff: 01, 02 | Guided scenes and canonical reading. Inspect cards, handoff, flow, source-of-truth. | context-engineering | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C02 | `limits` | Continue with coherent context or hand off to a new conversation using verified current evidence. | task-package-handoff | task-package-handoff: 03 | Guided scenes and canonical reading. Inspect article explanation. | lost-middle, context-engineering | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C02 | `diagnosis` | Compare available versions and access rules to distinguish missing context from an unresolved conflict. | context-failure-diagnosis, task-package-handoff | context-failure-diagnosis: 03; task-package-handoff: 03 | Guided scenes and canonical reading. Inspect article explanation. | lost-middle, context-engineering | Authored source links checked. Browser evidence tracked separately. |

Canonical checks preserved: AASE-M02-C02-Q07. Open checks: 1 EN and 1 ZH. Retain the original exercise and route recap/check synthesis through the final concepts for this chapter.

## AASE-M02-C03

Source file `content/aase/lessons/aase-m02-c03.json`. Status published, version 1.1.0, published 2026-11-05.

| Source lesson | Source section | Important claim or topic | Concept slugs | Scene targets | Teaching mode and evidence | Source references | Status and reviewer notes |
|---|---|---|---|---|---|---|---|
| AASE-M02-C03 | `start` | Long tasks need distinct inference reuse, compression, retrieval and handoff mechanisms. | kv-cache | kv-cache: 01 | Guided scenes and canonical reading. Inspect article explanation. | hf-kv-cache, vllm-prefix, context-engineering, rag-paper, owasp-agent-security | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C03 | `office` | Use the office analogy to assign the four responsibilities without merging their outputs. | kv-cache, method-selection | kv-cache: 01; method-selection: 01 | Guided scenes and canonical reading. Inspect cards. | hf-kv-cache, vllm-prefix, context-engineering, rag-paper, owasp-agent-security | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C03 | `kv-cache` | Compatible causal decoding can reuse computed keys and values for a prefix. This is inference state. | kv-cache | kv-cache: 01, 02, 03 | Guided scenes and canonical reading. Inspect cards. | hf-kv-cache, vllm-prefix | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C03 | `summary-and-notes` | Compaction preserves selected facts subject to a lossy summary. Compare against critical requirements. | compaction | compaction: 01, 02, 03 | Guided scenes and canonical reading. Inspect flow. | context-engineering | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C03 | `retrieval` | Retrieval selects accessible document versions for the invocation. Stale evidence can still yield confident output. | rag | rag: 01, 02, 03 | Guided scenes and canonical reading. Inspect flow. | rag-paper, owasp-agent-security | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C03 | `memory` | Saved state affects a fresh conversation only after retrieval or explicit delivery to its context. | memory | memory: 01, 02, 03 | Guided scenes and canonical reading. Inspect cards. | context-engineering | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C03 | `workflow` | A multi-session timeline can use the four mechanisms in different orders, with independent tests after resumption. | cross-session-orchestration | cross-session-orchestration: 01, 02, 03 | Guided scenes and canonical reading. Inspect flow. | context-engineering | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C03 | `comparison` | Select a mechanism based on the observed problem and verify with the corresponding evidence. | method-selection | method-selection: 01, 02 | Guided scenes and canonical reading. Inspect table. | hf-kv-cache, vllm-prefix, context-engineering, rag-paper, owasp-agent-security | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C03 | `understanding` | For each synthetic symptom, identify the appropriate mechanism and inspect the answer rationale. | method-selection | method-selection: 02, 03 | Guided scenes and canonical reading. Inspect article explanation. | hf-kv-cache, vllm-prefix, context-engineering, rag-paper, owasp-agent-security | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C03 | `apply` | Resume from a known specification, test, unfinished work and next step. Verify behavior separately. | compaction, memory, cross-session-orchestration, method-selection | compaction: 03; memory: 03; cross-session-orchestration: 03; method-selection: 03 | Guided scenes and canonical reading. Inspect article explanation. | hf-kv-cache, vllm-prefix, context-engineering, rag-paper, owasp-agent-security | Authored source links checked. Browser evidence tracked separately. |

Canonical checks preserved: AASE-M02-C03-Q04, AASE-M02-C03-Q05, AASE-M02-C03-Q06, AASE-M02-C03-Q07. Open checks: 0 EN and 0 ZH. Retain the original exercise and route recap/check synthesis through the final concepts for this chapter.

## AASE-M02-C04

Source file `content/aase/lessons/aase-m02-c04.json`. Status published, version 1.1.0, published 2026-11-05.

| Source lesson | Source section | Important claim or topic | Concept slugs | Scene targets | Teaching mode and evidence | Source references | Status and reviewer notes |
|---|---|---|---|---|---|---|---|
| AASE-M02-C04 | `interface` | Conversation governs the interface. Work control depends on who chooses the next action. | chatbot-workflow-agent | chatbot-workflow-agent: 01 | Guided scenes and canonical reading. Inspect article explanation. | effective-agents | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C04 | `analogy` | The restaurant counter models the interaction channel. Recipes model fixed workflows and exploration models an agent. | chatbot-workflow-agent | chatbot-workflow-agent: 01 | Guided scenes and canonical reading. Inspect article explanation. | effective-agents | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C04 | `control` | A fixed branch sets weekday maximum 2 and weekend maximum 3. Agent loops decide actions from observations. | chatbot-workflow-agent, deterministic-workflow, agent-decision-loop | chatbot-workflow-agent: 02; deterministic-workflow: 01, 02, 03; agent-decision-loop: 01, 02, 03 | Guided scenes and canonical reading. Inspect chatbot, workflow, cards, workflow-ai, agent, agent-loop. | effective-agents | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C04 | `case` | Choose fixed, exploratory or hybrid control from the requirement, then select the interface. | chatbot-workflow-agent | chatbot-workflow-agent: 02, 03 | Guided scenes and canonical reading. Inspect table, combination. | effective-agents | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C04 | `development` | An agent can help write software that executes fixed rules without an agent at runtime. | build-agent-vs-runtime | build-agent-vs-runtime: 01, 02, 03 | Guided scenes and canonical reading. Inspect article explanation. | effective-agents | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C04 | `stopping` | Permission, review, budgets and stopping rules bound dynamic action. | agent-decision-loop, governed-autonomy | agent-decision-loop: 03; governed-autonomy: 01, 02, 03 | Guided scenes and canonical reading. Inspect cards, least-privilege. | effective-agents | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C04 | `hybrid` | A workflow can validate input and verify outputs around scoped exploration. | hybrid-design | hybrid-design: 01, 02, 03 | Guided scenes and canonical reading. Inspect flow, hybrid-benefits. | effective-agents | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C04 | `misunderstandings` | Ask who chooses actions, where constraints apply and what demonstrates completion. | governed-autonomy, hybrid-design | governed-autonomy: 03; hybrid-design: 02, 03 | Guided scenes and canonical reading. Inspect article explanation. | effective-agents | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C04 | `understanding` | Use examples to identify interface, fixed control and exploratory control. | hybrid-design | hybrid-design: 03 | Guided scenes and canonical reading. Inspect article explanation. | effective-agents | Authored source links checked. Browser evidence tracked separately. |

Canonical checks preserved: AASE-M02-C04-Q04, AASE-M02-C04-Q05, AASE-M02-C04-Q06. Open checks: 0 EN and 0 ZH. Retain the original exercise and route recap/check synthesis through the final concepts for this chapter.

## AASE-M02-C05

Source file `content/aase/lessons/aase-m02-c05.json`. Status published, version 1.1.0, published 2026-11-05.

| Source lesson | Source section | Important claim or topic | Concept slugs | Scene targets | Teaching mode and evidence | Source references | Status and reviewer notes |
|---|---|---|---|---|---|---|---|
| AASE-M02-C05 | `harness` | The model reasons and generates. Its harness supplies the surrounding operational responsibilities. | llm-vs-harness | llm-vs-harness: 01 | Guided scenes and canonical reading. Inspect article explanation. | mcp-tools, effective-agents | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C05 | `analogy` | Six cooperating harness dimensions support the model in parallel. | llm-vs-harness | llm-vs-harness: 02, 03 | Guided scenes and canonical reading. Inspect cards. | mcp-tools, effective-agents | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C05 | `six-aspects` | Context, tools, orchestration, execution environment, security and observability each solve a distinct problem. | context-and-tools, orchestration-and-execution, security-and-observability | context-and-tools: 01, 02, 03; orchestration-and-execution: 01; security-and-observability: 01, 02 | Guided scenes and canonical reading. Inspect cards. | mcp-tools, effective-agents | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C05 | `trace` | A correct action sequence can operate on the wrong checkout. Test the intended environment. | orchestration-and-execution, security-and-observability | orchestration-and-execution: 02, 03; security-and-observability: 03 | Guided scenes and canonical reading. Inspect flow. | effective-agents | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C05 | `diagnose` | Diagnose through observable failure evidence and a falsifiable check for the relevant dimension. | harness-diagnostics | harness-diagnostics: 01, 02 | Guided scenes and canonical reading. Inspect table. | mcp-tools, effective-agents | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C05 | `mcp` | MCP standardizes interfaces. Authorization and safe execution require separate controls. | mcp-harness-boundary | mcp-harness-boundary: 01, 02 | Guided scenes and canonical reading. Inspect article explanation. | mcp-tools | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C05 | `connections` | Reasoning, context and action control come together in the harness and its interfaces. | mcp-harness-boundary | mcp-harness-boundary: 03 | Guided scenes and canonical reading. Inspect table. | mcp-tools, effective-agents | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C05 | `handoff` | Build an evidence-based handoff containing context, allowed operations, environment and checks. | harness-diagnostics | harness-diagnostics: 03 | Guided scenes and canonical reading. Inspect article explanation. | mcp-tools, effective-agents | Authored source links checked. Browser evidence tracked separately. |

Canonical checks preserved: none. Open checks: 3 EN and 3 ZH. Retain the original exercise and route recap/check synthesis through the final concepts for this chapter.

## AASE-M02-C06

Source file `content/aase/lessons/aase-m02-c06.json`. Status published, version 1.1.0, published 2026-11-05.

| Source lesson | Source section | Important claim or topic | Concept slugs | Scene targets | Teaching mode and evidence | Source references | Status and reviewer notes |
|---|---|---|---|---|---|---|---|
| AASE-M02-C06 | `start` | A report of completion must be checked against actions, permission and task acceptance. | tool-intent-and-result | tool-intent-and-result: 01 | Guided scenes and canonical reading. Inspect article explanation. | mcp-tools, owasp-agent-security, docker-security, otel-signals, aws-idempotency | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C06 | `analogy` | A bounded assignment distinguishes requested action, authority, runtime effect and evidence. | four-gates | four-gates: 01, 02, 03 | Guided scenes and canonical reading. Inspect flow. | mcp-tools, owasp-agent-security, docker-security, otel-signals, aws-idempotency | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C06 | `calling` | A model requests a tool. The host validates and executes an eligible request, then returns the result. | tool-intent-and-result, mcp-tool-calling | tool-intent-and-result: 01, 02, 03; mcp-tool-calling: 01 | Guided scenes and canonical reading. Inspect tool-request, tool-response, mcp-example. | mcp-tools | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C06 | `cycle` | Validation, authorization, execution and verification are separate gates with distinct failure states. | tool-intent-and-result, mcp-tool-calling, four-gates | tool-intent-and-result: 03; mcp-tool-calling: 02, 03; four-gates: 01, 02, 03 | Guided scenes and canonical reading. Inspect table. | mcp-tools, owasp-agent-security | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C06 | `sandbox` | Runtime restrictions enforce access according to configured policy. | sandbox-boundary | sandbox-boundary: 01, 02, 03 | Guided scenes and canonical reading. Inspect cards. | docker-security, owasp-agent-security | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C06 | `observe` | Logs, metrics and traces answer different operational questions and require correlation and redaction. | observability-signals | observability-signals: 01, 02, 03 | Guided scenes and canonical reading. Inspect success-log, denied-log. | otel-signals, owasp-agent-security | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C06 | `injection` | Document text cannot grant authority. The host denies operations outside authorized scope. | prompt-injection-boundary | prompt-injection-boundary: 01, 02, 03 | Guided scenes and canonical reading. Inspect article explanation. | owasp-agent-security | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C06 | `failure` | Timeout can leave outcome unknown. Deduplication depends on service-enforced idempotency. | timeout-retry-idempotency | timeout-retry-idempotency: 01, 02, 03 | Guided scenes and canonical reading. Inspect table. | aws-idempotency, owasp-agent-security | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C06 | `connection` | Tool evidence sits downstream of context, model generation, action selection and host enforcement. | partial-success-verification | partial-success-verification: 01, 03 | Guided scenes and canonical reading. Inspect cards. | mcp-tools, owasp-agent-security, docker-security, otel-signals, aws-idempotency | Authored source links checked. Browser evidence tracked separately. |
| AASE-M02-C06 | `verification` | In this independent scenario, weekend maximum is 2. Successful tool execution leaves acceptance pending until the rule and tests are verified. | observability-signals, prompt-injection-boundary, partial-success-verification | observability-signals: 03; prompt-injection-boundary: 03; partial-success-verification: 01, 02, 03 | Guided scenes and canonical reading. Inspect cards. | mcp-tools, owasp-agent-security, docker-security, otel-signals, aws-idempotency | Authored source links checked. Browser evidence tracked separately. |

Canonical checks preserved: AASE-M02-C06-Q04. Open checks: 1 EN and 1 ZH. Retain the original exercise and route recap/check synthesis through the final concepts for this chapter.

## M02-01–03 worked-scene review

| Concept and scene | What the learner can inspect or change | Evidence boundary |
|---|---|---|
| Tokenization 01–03 and embeddings 01–03 | Trace the same text through two hypothetical segmentations, look up toy IDs, then select an embedding row and compare its four signed coordinates. | IDs identify rows. Coordinate values are synthetic and do not name semantic traits. |
| Position information 01–03 and autoregression 01–03 | Swap names, compare actor and recipient, then compare two decoding choices from one distribution and locate the appended token in the next prefix. | Order carries information independently of token counts. The fixed sample illustrates one possible draw. |
| Attention Q/K/V 01–03 and softmax 01–03 | Compute two toy dot products, compare [3.076, 1.538] with masked output [2, 1], and inspect the three-position query/key mask. Use the scalar calculator to reproduce equal weights and a weighted result of 4. | The worked vector arithmetic omits score scaling for clarity. Mask cells show visibility. Output probabilities and attention weights do not verify content. |
| Transformer block 01–03 and verification boundary 01–03 | Compare two synthetic heads, trace how their outputs are combined, and change a synthetic form's document type while comparing the independent presence check with a completion claim. | Head roles and layer order can vary. A required-field pass covers only presence. |
| Stored versus visible context 01–03 and context composition 01–03 | Keep delivery at 10 of 1,000 and switch which document actually arrives. Compare call packets with saved-only versus loaded memory and inspect the output reserve. | A stored item needs to be selected and delivered. Output capacity and pretrained weights have roles distinct from input documents. |
| Context budget 01–03, context diagnosis 01–03, and position effects 01–03 | Change log allocation, identify the failed input or output step, and design a controlled position comparison. | Budget values are synthetic. Placement effects need evidence on the task and model in question. |
| Task-package handoff 01–03 | Inspect requirement revision, failing test T-01, allowed module, unresolved conflict and stop condition. Once authority is resolved, verify both filled and missing-field cases. | The next session still needs current-revision evidence. |
| KV cache 01–03 and compaction 01–03 | Compare one versus three conceptual K/V calculations, then compare condition-preserving and lossy summaries of a separate set of requirements. | The illustrated count is neither measured latency nor durable handoff data. The unspecified pre-exam limit needs clarification before testing. |
| RAG, memory and cross-session orchestration 01–03 | Compare answers grounded in stale v1 and applicable v3 §4.2, select whether a handoff reaches the new context, and trace the independent weekday and weekend checks across two sessions. | Evidence of access, applicability, delivery and program behavior covers different steps. |
| Method selection 01–03 | Inspect each of four represented failures, then try each intervention on the same scattered-specification fault and read the resulting evidence requirement. | Selecting a mechanism provides a hypothesis. Verify it against the actual revision and outcome. |

The worked-scene review applies WRITE-02, WRITE-05, WRITE-09–12, WRITE-15, FIG-06 and INT-01. The published canonical articles retain their original material. The coverage validator checked the updated local lesson data against the canonical anchors. Browser acceptance for these edits is recorded separately.

## Numeric and evidence boundaries

- Softmax: scores [1, 0] and values [2, 6] yield weights near [0.731, 0.269] and weighted value near 3.076. Equal scores yield weights [0.5, 0.5] and weighted value 4.
- Illustrative context budget: 10,000 tokens less 1,000 rules, 2,000 requirements/code, 4,500 tests, 1,500 output and 500 logs leaves 500. Logs of 1,800 overflow by 800.
- M02-04 weekday max 2 and weekend max 3 apply only to the workflow fixture. The independent M02-06 weekend limit is 2.
- Cache reuse, retrieval, stored memory and new-context visibility are distinct. Location sensitivity is conditional.
- Use synthetic timing and policy outcomes. Preserve separate schema, authorization, execution and verification states.
## Canonical assessment crosswalk

| Canonical question IDs | Concept and assessment target |
|---|---|
| C01-Q01 | tokenization, conditional token boundaries |
| C01-Q02 | softmax-weighted-sum, equal scores produce 4 |
| C01-Q03 | attention-qkv and verification-boundary, meaning of weights |
| C01-Q04 | verification-boundary, explicit required-field rule |
| C02-Q07, C02-Q08 | context-failure-diagnosis and task-package-handoff, identify cause using real delivered context and governing version |
| C03-Q04 through C03-Q07 | method-selection, match compaction, KV cache, retrieval or memory to symptoms |
| C04-Q04 | chatbot-workflow-agent, interface and control are separate |
| C04-Q05 | deterministic-workflow, fixed Saturday limit of three |
| C04-Q06 | governed-autonomy, escalate ambiguous scope and stop |
| C05-Q04 through C05-Q06 | harness-diagnostics and security-and-observability, wrong workspace, runtime permissions and completion evidence |
| C06-Q04, C06-Q05 | partial-success-verification, task acceptance and missing evidence |

All IDs above carry the canonical `AASE-M02-` prefix. Canonical exercises and open checks stay available through the full article. Interactive checks use newly authored questions and feedback.

## Integrated learner acceptance exercise

1. Set both attention scores to zero with values 2 and 6. What weights and output should you observe? Which operation would you change to favor the lower value?
2. The response matches a retrieved requirement, but the archived current requirement disagrees. Where do you look first to distinguish stale retrieval from failure to follow the correct source?
3. The agent reports that a test passed. Its record identifies a sample checkout rather than the assigned checkout. Which harness responsibility do you inspect, and what evidence do you request?
4. The tool accepts the schema, but the host denies access. Was anything executed? If an authorized operation executes successfully on a later attempt, what additional evidence establishes task success?

<details>
<summary>Expected observations for review</summary>

1. The weights are 0.5 and 0.5. The output is 4. Increasing the first score relative to the second favors value 2.
2. Inspect the source ID, version and relevance actually delivered to the model. If the delivered document is stale, correct selection before assessing grounding. If the current source arrived, compare the output to its requirement.
3. Inspect the execution environment and its binding to the target worktree. Ask for the intended workspace and revision identity plus a rerun in that environment.
4. Host denial means that the simulated action does not execute. For a later successful action, compare the actual output with the acceptance condition using reproducible evidence.

</details>
