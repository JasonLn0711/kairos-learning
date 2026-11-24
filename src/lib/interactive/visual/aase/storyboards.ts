// A column is one stage of the drawing. Commas put objects side-by-side.
// Edges reference object keys, so parallel evidence never implies execution order.
export type Storyboard = { columns: string[][]; links: [string, string][] };
type Outline = readonly [string, string];
function scene(columns: string, links: string): Outline { return [columns, links]; }
function chain(path: string): Outline {
  const keys = path.split(' ');
  return scene(path, keys.slice(1).map((key,i) => keys[i]+'>'+key).join(' '));
}
function compare(keys: string): Outline { return scene(keys.replaceAll(' ', ','), ''); }
function merge(inputs: string, result: string): Outline {
  return scene(inputs.replaceAll(' ', ',')+' '+result, inputs.split(' ').map(key=>key+'>'+result).join(' '));
}
function split(input: string, outputs: string): Outline {
  return scene(input+' '+outputs.replaceAll(' ', ','), outputs.split(' ').map(key=>input+'>'+key).join(' '));
}

export const outlines: Record<string, [Outline, Outline, Outline]> = {
  tokenization: [chain('text tokenizer'), split('text','pieces count'), chain('pieces vocab ids')],
  embeddings: [chain('token id matrix'), chain('id matrix vector'), compare('row21 row42')],
  'position-information': [chain('pos1 pos2 pos3'), compare('original reordered'), merge('tokens position','ordered')],
  'attention-qkv': [scene('query,keyA,keyB scores','query>scores keyA>scores keyB>scores'),scene('query mask valueA,valueB mixed','query>mask mask>valueA mask>valueB valueA>mixed valueB>mixed'),chain('query mask keys')],
  'softmax-weighted-sum': [compare('scoreA scoreB'),scene('expA,expB sum weights','expA>sum expB>sum sum>weights'),merge('partA partB','weighted')],
  'transformer-block': [compare('attention feedforward residual normalization'),split('input','headA headB'),scene('headA,headB concat projection','headA>concat headB>concat concat>projection')],
  'autoregressive-generation': [chain('pos1 pos2 pos3'),chain('prefix distribution nextToken'),chain('prefix nextToken newPrefix')],
  'verification-boundary': [compare('attention probability verification'),chain('form schema missing'),chain('missing repair verification')],
  'stored-vs-visible-context': [compare('archive packet'),chain('archive select packet'),chain('packet receipt verify')],
  'context-composition': [scene('rules,task,history,sources packet,reserve','rules>packet task>packet history>packet sources>packet'),chain('memory select packet'),compare('history memory model')],
  'context-budget': [compare('fixed capacity'),merge('fixed logs','used'),chain('over select fits')],
  'context-failure-diagnosis': [compare('symptom requirement'),split('symptom','capacity retrieval conflict failedUse'),chain('repair packet verify')],
  'position-effects': [compare('evidence distractors'),scene('front middle end',''),merge('fixed placement','observation')],
  'task-package-handoff': [merge('requirement tests scope openWork stop','handoff'),merge('sources version','authority'),chain('sources reproduce record')],
  'kv-cache': [split('prefix','keyCache valueCache'),merge('keyCache valueCache nextToken','attention'),compare('cacheHit handoff timing')],
  compaction: [merge('history sources','summary'),compare('original summary'),split('rule','weekday weekend')],
  rag: [scene('query scope retrieval packet','query>retrieval scope>retrieval retrieval>packet'),merge('query version','sources'),compare('grounding tests')],
  memory: [merge('revision evidence openWork','handoff'),chain('memory load packet'),merge('memory evidence','revision')],
  'cross-session-orchestration': [scene('prefix,history cache,summary','prefix>cache history>summary'),chain('memory load packet'),chain('reproduce evidence record')],
  'method-selection': [compare('cache summary retrieval memory'),split('symptom','cache summary retrieval memory'),split('diagnosis','cache summary retrieval memory')],
  'chatbot-workflow-agent': [chain('user chat reply'),compare('chat workflow agent'),scene('user chat workflow,agent','user>chat chat>workflow chat>agent')],
  'deterministic-workflow': [split('rule','weekday weekend'),merge('day subjects','decision'),compare('weekday weekend')],
  'agent-decision-loop': [compare('expected observed'),chain('evidence agent action observation'),split('decision','stop revise')],
  'build-agent-vs-runtime': [chain('agent patch artifact'),compare('agent workflow'),chain('fixture runtime tests')],
  'governed-autonomy': [compare('scope review'),scene('action policy allow,deny','action>policy policy>allow policy>deny'),merge('reviewer evidence','handoff')],
  'hybrid-design': [chain('input schema policy'),chain('agent evidence policy'),compare('control verification')],
  'llm-vs-harness': [scene('context,tools,orchestration model runtime,security,telemetry','context~model tools~model orchestration~model runtime~model security~model telemetry~model'),compare('model harness'),chain('proposal policy runtime')],
  'context-and-tools': [compare('requirement tools'),compare('context tools'),merge('scope tools','write')],
  'orchestration-and-execution': [chain('plan action tests'),chain('workspace runtime tests'),merge('revision tests','receipt')],
  'security-and-observability': [chain('action policy runtime'),split('policy','allow deny'),merge('event trace','evidence')],
  'harness-diagnostics': [compare('claim observed'),scene('context,tools,orchestration symptom runtime,security,telemetry','context~symptom tools~symptom orchestration~symptom runtime~symptom security~symptom telemetry~symptom'),merge('revision tests evidence','handoff')],
  'mcp-harness-boundary': [chain('host interface tool'),chain('host policy tool'),compare('interface policy')],
  'tool-intent-and-result': [compare('proposal runtime'),split('decision','stop runtime'),chain('result evidence verification')],
  'mcp-tool-calling': [merge('requestId tool args','message'),chain('message transport response'),compare('response verification')],
  'four-gates': [chain('schema authorization'),chain('schema authorization execution verification'),compare('execution verification')],
  'sandbox-boundary': [compare('advertised capability'),chain('action sandbox decision'),chain('policy event evidence')],
  'observability-signals': [compare('logs metric trace'),merge('taskId requestId','trace'),compare('observed verification')],
  'prompt-injection-boundary': [compare('task external'),merge('scope action','policy'),chain('deny event review')],
  'timeout-retry-idempotency': [compare('observed unknown'),chain('timeout inspect decision'),chain('requestId dedup effect')],
  'partial-success-verification': [compare('observed missing'),merge('day subjects','decision'),merge('requirement tests','verification')]
};

export function storyboard(slug: string, step: number): Storyboard {
  const [layout, relations] = outlines[slug][step-1];
  return {
    columns: layout.split(' ').map(column => column.split(',')),
    links: relations ? relations.split(' ').map(link => link.split(/[>~]/) as [string,string]) : []
  };
}
export function isAssociation(slug: string, step: number) {
  return outlines[slug][step-1][1].includes('~');
}

export const feedback:Record<string,{step:string;from:string;to:string;zh:string;en:string}>={
  'autoregressive-generation':{step:'03',from:'newPrefix',to:'prefix',zh:'下一輪以前綴繼續',en:'Use as next prefix'},
  'agent-decision-loop':{step:'02',from:'observation',to:'evidence',zh:'下一輪依觀測決策',en:'Observe again'}
};
