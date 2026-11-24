import type {Card, TeachingScene} from '../../aase/model.ts';
import type {Locale} from '../../model.ts';

// The highlighted object has a defined meaning for every authored alternative.
const choiceObjects: Record<string,string[]> = {
  tokenization:['pieces','pieces'], embeddings:['matrix','matrix'],
  'position-information':['original','reordered'], 'attention-qkv':['mixed','mask'],
  'transformer-block':['headA','headB'], 'autoregressive-generation':['distribution','nextToken'],
  'stored-vs-visible-context':['select','select','packet'], 'context-composition':['memory','packet'],
  'context-failure-diagnosis':['capacity','retrieval','conflict','failedUse'], 'position-effects':['front','middle'],
  'task-package-handoff':['authority','version'], 'kv-cache':['keyCache','nextToken'],
  compaction:['summary','summary'], rag:['version','sources'], memory:['packet','memory','memory','memory'],
  'cross-session-orchestration':['memory','packet'], 'method-selection':['cache','summary','retrieval','memory'],
  'chatbot-workflow-agent':['chat','workflow','agent'], 'agent-decision-loop':['evidence','action'],
  'build-agent-vs-runtime':['workflow','agent'], 'hybrid-design':['evidence','policy','policy'],
  'llm-vs-harness':['model','harness'], 'context-and-tools':['context','tools','tools','context'],
  'orchestration-and-execution':['workspace','workspace'], 'security-and-observability':['allow','deny'],
  'harness-diagnostics':['context','tools','orchestration','runtime','security','telemetry'],
  'mcp-harness-boundary':['tool','policy'], 'tool-intent-and-result':['stop','runtime'],
  'mcp-tool-calling':['message','response','response'], 'observability-signals':['trace','trace'],
  'prompt-injection-boundary':['policy','scope'], 'timeout-retry-idempotency':['decision','inspect','timeout'],
  'partial-success-verification':['tests','verification']
};

export function chosenObject(slug:string,scene:TeachingScene,choice:number){
  if (!scene.choices) return '';
  return choiceObjects[slug]?.[choice] ?? '';
}

export function lessonValues(slug:string,scene:TeachingScene,cards:Card[],lang:Locale):Record<string,string>{
  const byLabel = Object.fromEntries(cards.map(c=>[c.label.en,c.value[lang]]));
  if(slug==='embeddings'){
    const id=byLabel.ID ?? byLabel.Index ?? '21';
    const vector=cards.filter(c=>c.label.en.startsWith('Dimension ')).map(c=>c.value[lang]).join('  ');
    return {id:'#'+id,matrix:'#'+id,token:byLabel.Token,vector,row21:'x₃ = 0.9',row42:'x₃ = 0.2'};
  }
  if(slug==='tokenization')return {text:byLabel.Input??byLabel['Received text'],pieces:byLabel.Sequence??byLabel['Hypothetical split'],ids:byLabel['IDs in order'],count:byLabel.Pieces};
  if(slug==='softmax-weighted-sum')return {scoreA:'s = 1 · v = 2',scoreB:'s = 0 · v = 6'};
  if(slug==='position-information' && scene.id==='02'){
    const name=byLabel.Actor;
    const sequence=byLabel.Sequence;
    return {[name===scene.cards[0].value[lang].split(/[,、]/)[0]?'original':'reordered']:sequence};
  }
  if(slug==='autoregressive-generation' && scene.id==='02'){
    return {distribution:byLabel.Candidates,nextToken:byLabel['Next prefix'].split(/[,、]\s*/u).at(-1)??''};
  }
  const result:Record<string,string>={};
  const aliases:Record<string,string>={'Position 1':'pos1','Position 2':'pos2','Position 3':'pos3','Query Q':'query','Key A':'keyA','Key B':'keyB','Row 21':'row21','Row 42':'row42','Task':'task','Symptom':'symptom','Expected':'expected','Observed':'observed','Input':'input','Output':'output','Held constant':'fixed','Operation':'action','Allowed':'allow','Revision':'revision','Policy':'policy','Query':'query','Weekday':'weekday','Weekend':'weekend','Custom tool':'tool','Synthetic argument':'args','Task ID':'taskId','Call ID':'requestId','Old note':'memory','Current evidence':'evidence','Archive':'archive','Requirement':'requirement','Decision':'decision','Result':'result','Scope':'scope','Event':'event','Rule':'rule','Position A':'scoreA','Position B':'scoreB'};
  for(const card of cards){
    const key=aliases[card.label.en]??card.label.en.toLowerCase();
    const value=card.value[lang];
    if(Array.from(value).length<=(lang==='zh'?13:24))result[key]=value;
  }
  return result;
}

// Each scenario supplies the evidence that travels with the drawing.
// All strings here are short labels; the source cards keep the full explanation.
type Signals = Record<string,string>;
const signals:Record<string,Signals[]> = {
  'attention-qkv':[{valueA:'[2, 1] × 0.731',valueB:'[6, 3] × 0.269',mixed:'[3.076, 1.538]'},{valueA:'[2, 1] × 1',valueB:'[6, 3] × 0',mask:'B ×',mixed:'[2, 1]'}],
  'transformer-block':[{headA:'[0.8, 0.2]'},{headB:'[0.3, 0.7]'}],
  'stored-vs-visible-context':[{select:'v1',packet:'10 / 1000'},{select:'v2',packet:'10 / 1000'},{packet:'10 / 1000'}],
  'context-composition':[{memory:'✓',packet:'—'},{memory:'✓',packet:'✓'}],
  'position-effects':[{front:'●',middle:'·',end:'·'},{front:'·',middle:'●',end:'·'}],
  'task-package-handoff':[{version:'v2',authority:'✓'},{version:'v1 ≠ v2',authority:'?'}],
  'kv-cache':[{keyCache:'A, B ✓',valueCache:'A, B ✓',nextToken:'C'},{keyCache:'—',valueCache:'—',nextToken:'A, B, C'}],
  compaction:[{summary:'2 / 2'},{summary:'2 / 3'}],
  rag:[{version:'v1',sources:'≤ 2'},{version:'v3 §4.2',sources:'≤ 3'}],
  memory:[{memory:'✓',packet:'✓'},{memory:'✓',packet:'—'},{memory:'⌛',packet:'?'},{memory:'≠',packet:'?'}],
  'cross-session-orchestration':[{memory:'✓',packet:'—'},{load:'✓',packet:'✓'}],
  'context-and-tools':[{context:'≤ 2',tools:'R + W'},{context:'≤ 2',tools:'R'},{context:'≤ 3',tools:'R'},{context:'≤ 3',tools:'R + W'}],
  'security-and-observability':[{allow:'read ✓'},{deny:'write ×'}],
  'mcp-harness-boundary':[{host:'✓',tool:'✓'},{host:'✓',policy:'×'}],
  'tool-intent-and-result':[{stop:'×',runtime:'—'},{runtime:'✓'}],
  'mcp-tool-calling':[{message:'−32602'},{response:'isError: true'},{response:'✓'}],
  'observability-signals':[{requestId:'call-7',trace:'✓'},{requestId:'call-8',trace:'×'}],
  'prompt-injection-boundary':[{policy:'✓'},{policy:'×'}]
};
export function scenarioValues(slug:string,scene:TeachingScene,choice:number):Signals{
  return scene.choices ? signals[slug]?.[choice]??{} : {};
}

// Bind the original ordered teaching cards to the corresponding drawn objects.
// Scenario-specific replacements can change the cardinality and are handled above.
const evidenceObjects:Record<string,readonly [string,string,string]>={
  tokenization:['text tokenizer','text','pieces ids'],
  embeddings:['token id','matrix','row21 row42'],
  'position-information':['pos1 pos2 pos3','original','tokens ordered'],
  'attention-qkv':['query keyA keyB','query','query mask keys'],
  'softmax-weighted-sum':['scoreA scoreB','sum weights','weighted weighted'],
  'transformer-block':['attention feedforward residual normalization','input','concat projection feedforward'],
  'autoregressive-generation':['pos1 pos2 pos3','prefix','prefix nextToken newPrefix'],
  'verification-boundary':['attention probability verification','form form missing','form missing repair'],
  'stored-vs-visible-context':['archive packet','archive','receipt verify'],
  'context-composition':['rules task history sources reserve','packet reserve','history memory model'],
  'context-budget':['capacity fixed','used fixed','over select fits'],
  'context-failure-diagnosis':['symptom requirement','symptom','packet verify'],
  'position-effects':['evidence','front','fixed placement observation'],
  'task-package-handoff':['requirement tests scope openWork stop','authority','sources reproduce record'],
  'kv-cache':['prefix prefix','nextToken','cacheHit handoff timing'],
  compaction:['history sources','original','weekend weekday rule'],
  rag:['query scope packet','query','grounding tests'],
  memory:['handoff openWork revision evidence','packet','memory evidence revision'],
  'cross-session-orchestration':['cache summary','memory','evidence reproduce record'],
  'method-selection':['cache summary retrieval memory','symptom','diagnosis'],
  'chatbot-workflow-agent':['user reply','workflow','chat workflow'],
  'deterministic-workflow':['weekday weekend','decision','weekday weekend'],
  'agent-decision-loop':['expected observed','agent','stop revise'],
  'build-agent-vs-runtime':['agent artifact','workflow','tests'],
  'governed-autonomy':['scope review','policy','evidence'],
  'hybrid-design':['schema','policy','control'],
  'llm-vs-harness':['model context tools orchestration runtime security telemetry','model harness','runtime policy'],
  'context-and-tools':['requirement','context','scope tools'],
  'orchestration-and-execution':['plan','runtime','revision tests'],
  'security-and-observability':['policy','policy','event evidence'],
  'harness-diagnostics':['claim observed','symptom','handoff'],
  'mcp-harness-boundary':['interface','host','interface policy'],
  'tool-intent-and-result':['proposal runtime','decision','result verification'],
  'mcp-tool-calling':['message tool args message','message','response verification'],
  'four-gates':['schema authorization','schema','execution verification'],
  'sandbox-boundary':['advertised capability','sandbox','evidence'],
  'observability-signals':['logs metric trace','taskId','observed verification'],
  'prompt-injection-boundary':['task external','policy','event review'],
  'timeout-retry-idempotency':['observed unknown','decision','dedup requestId'],
  'partial-success-verification':['observed missing','decision','verification requirement']
};
export function boundEvidence(slug:string,scene:TeachingScene,lang:Locale):Record<string,string>{
  const keys=evidenceObjects[slug][Number(scene.id)-1].split(' ');
  const evidence:Record<string,string>={};
  scene.cards.forEach((card,i)=>{
    const key=keys[i];
    if(key)evidence[key]=[evidence[key],card.value[lang]].filter(Boolean).join(' · ');
  });
  return evidence;
}
