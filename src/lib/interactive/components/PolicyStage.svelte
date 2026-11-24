<script lang="ts">
  import type {Snapshot} from '../chapter/frame.ts';
  import type { Locale } from '../model.ts';
  import type { PolicyDemo } from '../aase/model.ts';
  import { authorizeScope, governAction, missingApplicationFields, retryEffects, sandboxAction, type RetryOutcome } from '../aase/simulations.ts';

  let { onchange, demo, lang, ready }: { onchange?:(snapshot:Snapshot)=>void; demo: PolicyDemo; lang: Locale; ready: boolean } = $props();
  const zh = $derived(lang === 'zh');
  let action = $state<'test' | 'release'>('release');
  let inScope = $state(true);
  let reviewed = $state(false);
  let withinTime = $state(true);
  let budget = $state(1);
  let operation = $state<'read' | 'write' | 'network'>('write');
  let inside = $state(true);
  let writable = $state(false);
  let outbound = $state(false);
  let resource = $state<'summary' | 'notes'>('notes');
  let documentClaimsPermission = $state(true);
  let outcome = $state<RetryOutcome>('unknown');
  let effectRecorded = $state(true);
  let serviceDeduplicates = $state(false);
  let retry = $state(false);
  let documentType = $state('');
  let claim = $state(true);

  const decision = $derived(demo === 'governed-policy' ? governAction(action, { inScope, reviewed, budget, withinTime })
    : demo === 'sandbox-policy' ? sandboxAction(operation, { inside, writable, outbound })
    : authorizeScope(resource, documentClaimsPermission));
  const effects = $derived(retryEffects(outcome, effectRecorded, serviceDeduplicates, retry));
  const missing = $derived(missingApplicationFields('SYN-001', 'DEMO-A', documentType));
  const reasons = {
    approved: { zh: '條件符合', en: 'Policy permits this action' },
    scope: { zh: '超出核准範圍', en: 'Outside the approved scope' },
    review: { zh: '仍待人工審查', en: 'Human review is required' },
    deadline: { zh: '已到停止時間', en: 'Time limit reached' },
    budget: { zh: '動作預算已用完', en: 'Action budget exhausted' },
    'read-only': { zh: '工作區為唯讀', en: 'Workspace is read-only' },
    network: { zh: '對外連線未授權', en: 'Outbound networking is disabled' }
  };
  const flowValues=$derived.by(():Record<string,string>=>{
    if(demo==='retry-policy')return {requestId:zh?'同一識別鍵':'Same key',effect:effects.before+' → '+effects.after,dedup:serviceDeduplicates?(zh?'啟用':'Enabled'):(zh?'關閉':'Off')};
    if(demo==='required-field')return {form:'SYN-001',schema:missing.length?(zh?'不完整':'Incomplete'):(zh?'齊全':'Complete'),missing:missing.length?'documentType':'✓'};
    const label=decision.executed?(zh?'允許':'Allow'):(zh?'拒絕':'Deny');
    return {policy:label,decision:label,action:demo==='governed-policy'?action:demo==='scope-policy'?resource:operation};
  });
  $effect(()=>onchange?.({choice:0,a:1,b:0,logs:500,values:flowValues,states:{},active:demo==='retry-policy'?'effect':demo==='required-field'?'schema':decision.executed?'allow':'deny'}));
</script>

<div class="policy-simulation" data-policy={demo}>

  <fieldset disabled={!ready}>
    <legend>{zh ? '調整模擬條件' : 'Change simulation inputs'}</legend>
    {#if demo === 'governed-policy'}
      <label>{zh ? '提議的動作' : 'Proposed action'}
        <select bind:value={action}>
          <option value="test">{zh ? '執行本機測試' : 'Run a local test'}</option>
          <option value="release">{zh ? '發布教材' : 'Publish the lesson'}</option>
        </select>
      </label>
      <label><input type="checkbox" bind:checked={inScope} /> {zh ? '在任務範圍內' : 'Within task scope'}</label>
      <label><input type="checkbox" bind:checked={reviewed} /> {zh ? '已通過人工審查' : 'Human review approved'}</label>
      <label><input type="checkbox" bind:checked={withinTime} /> {zh ? '仍在時限內' : 'Time budget remains'}</label>
      <label>{zh ? '剩餘動作次數' : 'Actions remaining'}
        <select bind:value={budget}><option value={0}>0</option><option value={1}>1</option><option value={2}>2</option></select>
      </label>
    {:else if demo === 'sandbox-policy'}
      <label>{zh ? '提議的動作' : 'Proposed action'}
        <select bind:value={operation}><option value="read">{zh ? '讀取' : 'Read'}</option><option value="write">{zh ? '寫入' : 'Write'}</option><option value="network">{zh ? '對外連線' : 'Outbound connection'}</option></select>
      </label>
      <label><input type="checkbox" bind:checked={inside} /> {zh ? '路徑位於核准工作區' : 'Path is within approved workspace'}</label>
      <label><input type="checkbox" bind:checked={writable} /> {zh ? '工作區允許寫入' : 'Workspace is writable'}</label>
      <label><input type="checkbox" bind:checked={outbound} /> {zh ? '允許對外連線' : 'Outbound networking allowed'}</label>
    {:else if demo === 'scope-policy'}
      <label>{zh ? '要求讀取的合成資源' : 'Requested fictional resource'}
        <select bind:value={resource}><option value="summary">{zh ? '摘要' : 'Summary'}</option><option value="notes">{zh ? '限制存取的筆記' : 'Restricted notes'}</option></select>
      </label>
      <label><input type="checkbox" bind:checked={documentClaimsPermission} /> {zh ? '文件聲稱擁有額外權限' : 'Document claims extra permission'}</label>
    {:else if demo === 'retry-policy'}
      <label>{zh ? '客戶端可見結果' : 'Client-visible outcome'}
        <select bind:value={outcome}>
          <option value="confirmed-success">{zh ? '確認成功' : 'Confirmed success'}</option>
          <option value="confirmed-no-effect">{zh ? '確認未執行' : 'Confirmed no effect'}</option>
          <option value="unknown">{zh ? '逾時，結果未知' : 'Timeout, outcome unknown'}</option>
        </select>
      </label>
      <label><input type="checkbox" bind:checked={effectRecorded} disabled={outcome !== 'unknown'} /> {zh ? '教具揭露：第一次已寫入' : 'Toy ground truth: first write recorded'}</label>
      <label><input type="checkbox" bind:checked={serviceDeduplicates} /> {zh ? '服務端強制同一鍵去重' : 'Service enforces same-key deduplication'}</label>
      <label><input type="checkbox" bind:checked={retry} disabled={outcome === 'confirmed-success'} /> {zh ? '模擬用同一識別鍵重送' : 'Simulate a retry with the same key'}</label>
    {:else}
      <p>SYN-001 · DEMO-A</p>
      <label>{zh ? '文件類型' : 'Document type'}
        <input type="text" bind:value={documentType} maxlength="48" autocomplete="off" />
      </label>
      <label><input type="checkbox" bind:checked={claim} /> {zh ? '模型聲稱欄位齊全' : 'Model claims the fields are complete'}</label>
    {/if}
  </fieldset>
  <output aria-live="polite">
    {#if demo === 'retry-policy'}
      {zh ? '合成寫入筆數' : 'Simulated write count'} · {effects.before} → {effects.after}.
      {effects.retryPerformed ? (zh ? '已模擬重送。' : 'Retry simulated.') : (zh ? '未重送。' : 'No retry.')}
    {:else if demo === 'required-field'}
      {missing.length ? (zh ? '驗證失敗：缺少 documentType。' : 'Validation failed: documentType is missing.') : (zh ? '必填欄位齊全。' : 'Required fields are present.')}
      {claim ? (zh ? '模型聲稱齊全。' : 'The model claims completeness.') : (zh ? '模型未聲稱齊全。' : 'The model makes no completeness claim.')}
    {:else}
      {decision.executed ? (zh ? '已模擬執行' : 'Simulated execution') : (zh ? '未執行' : 'No execution')} · {reasons[decision.reason][lang]}
    {/if}
  </output>
</div>

<style>
  .policy-simulation { display: grid; gap: .75rem; min-width: 0; }
  fieldset { min-inline-size: 0; margin: 0; padding: .65rem; border: 1px solid var(--line); border-radius: .35rem; display: flex; flex-wrap: wrap; align-items: center; gap: .55rem .85rem; }
  legend { padding-inline: .3rem; font-weight: 650; }
  label { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem; min-width: 0; }
  label:has(input[type="checkbox"]) { min-block-size: 44px; }
  input[type="checkbox"] { min-height: auto; accent-color: var(--accent); inline-size: 1.1rem; block-size: 1.1rem; }
  input[type="text"], select { max-inline-size: 100%; }
  p { margin: 0; }
  output { display: block; border-inline-start: 3px solid var(--accent); background: var(--paper); padding: .55rem .7rem; font-weight: 650; }
</style>
