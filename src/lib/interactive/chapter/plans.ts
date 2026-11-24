import type {Glyph} from '../visual/aase/objects.ts';

type Node = {slug:string; glyph:Glyph; zh:string; en:string};
type Link = {from:string;to:string;kind:'flow'|'check'|'support'};
type Plan = {layers:Node[][];links:Link[]};
function n(slug:string,glyph:Glyph,zh:string,en:string):Node{return {slug,glyph,zh,en};}
function paths(kind:Link['kind'],...routes:string[]):Link[]{
  return routes.flatMap(route=>{
    const nodes=route.split(' ');
    return nodes.slice(1).map((to,i)=>({from:nodes[i],to,kind}));
  });
}
export const plans:Record<string,Plan>={
 'm02-01':{
  layers:[
   [n('tokenization','strip','文字切成詞元，依序查出 ID','Segment text and look up token IDs')],
   [n('embeddings','matrix','依 ID 取出向量','Read the indexed vector'),n('position-information','strip','保留誰在什麼位置','Preserve the order of positions')],
   [n('attention-qkv','matrix','以 Q、K 比對可見位置','Score the visible keys'),n('softmax-weighted-sum','operator','正規化分數，混合 V','Normalize scores and mix values')],
   [n('transformer-block','machine','整合注意力頭與殘差表示','Combine head outputs and residuals')],
   [n('autoregressive-generation','strip','接回新詞元，形成下一輪前綴','Append the chosen token for the next round'),n('verification-boundary','stamp','用獨立規則驗證產物','Validate the artifact independently')]
  ],links:[...paths('flow','tokenization embeddings attention-qkv softmax-weighted-sum transformer-block autoregressive-generation','tokenization position-information attention-qkv'),...paths('check','autoregressive-generation verification-boundary')]},
 'm02-02':{
  layers:[
   [n('stored-vs-visible-context','vault','從庫存挑出這次真正送達的資料','Distinguish stored from delivered material')],
   [n('context-composition','message','組成一次呼叫的輸入','Assemble one invocation')],
   [n('context-budget','meter','扣除固定配置與預留輸出','Count allocations and output reserve'),n('position-effects','strip','固定證據，改變放置位置','Hold evidence fixed and vary its position')],
   [n('context-failure-diagnosis','lens','分清容量、選取、衝突或產物錯誤','Distinguish overflow, selection, conflict and application errors')],
   [n('task-package-handoff','sheet','留下可重現的規格、證據與停止條件','Hand off the specification, evidence and stop conditions')]
  ],links:[...paths('flow','stored-vs-visible-context context-composition context-budget','context-composition position-effects'),...paths('check','context-budget context-failure-diagnosis task-package-handoff','position-effects context-failure-diagnosis')]},
 'm02-03':{
  layers:[
   [n('method-selection','lens','先定位重算、容量、資料或跨次延續問題','Identify recomputation, capacity, retrieval or continuity needs')],
   [n('kv-cache','vault','重用相符前綴的 K/V','Reuse matching prefix keys and values'),n('compaction','sheet','摘要保留規則與例外','Retain rules and exceptions in the summary')],
   [n('rag','lens','選取核准且現行的來源','Retrieve authorized, current sources'),n('memory','vault','儲存、讀回並核對交接內容','Store, reload and verify the handoff')],
   [n('cross-session-orchestration','machine','在新工作階段重建脈絡並驗證','Rebuild context and verify in the new session')]
  ],links:[...['kv-cache','compaction','rag','memory'].flatMap(s=>paths('support','method-selection '+s,s+' cross-session-orchestration'))]},
 'm02-04':{
  layers:[
   [n('chatbot-workflow-agent','person','分清對話入口與動作決策者','Separate the interface from the action controller')],
   [n('deterministic-workflow','gate','已知規則走固定分支','Apply a fixed branch to known rules'),n('agent-decision-loop','lens','用觀察決定下一個受限動作','Choose the next bounded action from observations')],
   [n('build-agent-vs-runtime','machine','區分開發協助與執行依賴','Separate development assistance from runtime dependencies'),n('governed-autonomy','gate','以範圍、預算、時限及複核限制行動','Enforce scope, budget, time and review')],
   [n('hybrid-design','machine','受限探索回到固定測試與人工驗收','Return exploration to fixed tests and human review')]
  ],links:[...paths('flow','chatbot-workflow-agent deterministic-workflow hybrid-design','chatbot-workflow-agent agent-decision-loop governed-autonomy hybrid-design'),...paths('check','build-agent-vs-runtime hybrid-design')]},
 'm02-05':{
  layers:[
   [n('llm-vs-harness','machine','模型外的六項平行支援責任','Six parallel supporting responsibilities around the model')],
   [n('context-and-tools','message','取得規格與可用工具','Supply the specification and available tools'),n('orchestration-and-execution','machine','安排順序與目標執行環境','Order actions and select the target workspace')],
   [n('security-and-observability','gate','控制授權並保留事件','Enforce permissions and retain events'),n('mcp-harness-boundary','message','共用介面與宿主權限分工','Distinguish interface from host authority')],
   [n('harness-diagnostics','lens','用可證偽的證據找出缺失環節','Locate the missing responsibility using falsifiable evidence')]
  ],links:[...['context-and-tools','orchestration-and-execution','security-and-observability','mcp-harness-boundary'].flatMap(s=>[...paths('support','llm-vs-harness '+s),...paths('check',s+' harness-diagnostics')])]},
 'm02-06':{
  layers:[
   [n('tool-intent-and-result','sheet','分開提案、執行與結果','Separate proposal, execution and result'),n('mcp-tool-calling','message','以呼叫識別碼配對請求與回應','Correlate request and response by call ID')],
   [n('prompt-injection-boundary','gate','外部文字不能擴張授權','External text cannot expand authority'),n('four-gates','gate','格式、授權、執行、驗收逐關判斷','Check schema, authorization, execution and verification')],
   [n('sandbox-boundary','gate','在執行環境落實能力限制','Enforce capabilities in the runtime'),n('timeout-retry-idempotency','clock','結果未知時先查副作用與去重','Check effects and deduplication before retrying')],
   [n('observability-signals','clock','以日誌、指標與追蹤關聯事件','Correlate logs, metrics and traces')],
   [n('partial-success-verification','stamp','工具成功後仍核對需求與獨立測試','Compare tool success with requirements and independent tests')]
  ],links:[...paths('flow','tool-intent-and-result mcp-tool-calling four-gates sandbox-boundary observability-signals','four-gates timeout-retry-idempotency observability-signals'),...paths('check','prompt-injection-boundary four-gates','observability-signals partial-success-verification')]}
};
