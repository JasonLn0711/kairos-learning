<script lang="ts">
 import {onMount} from 'svelte';
 import type {ConceptVisual} from '$lib/concepts';
 import {simulatedDocumentAccess} from '$lib/document-access-simulation';
 let {diagram,lang='zh'}:{diagram:ConceptVisual;lang?:'zh'|'en'}=$props();
 let ready=$state(false),actor=$state('a'),document=$state('A'),action=$state('read');onMount(()=>{ready=true;});
 const allowed=$derived(simulatedDocumentAccess(actor,document,action));
 const t=$derived(lang==='zh'?{user:'目前模擬登入的使用者',document:'想操作哪份文件？',action:'想執行什麼操作？',actors:['小明','小美','主管'],docs:['文件 A','文件 B'],actions:['讀取文件','修改文件','刪除文件'],allow:'系統允許操作（模擬結果）',deny:'系統拒絕操作（模擬結果）',allowNote:'依照這個範例的權限設定，目前的使用者具有執行此操作的權限。',denyNote:'依照這個範例的權限設定，拒絕此操作，不顯示文件內容。',role:'目前角色',policy:'固定教學權限規則',static:'未啟用 JavaScript：保留小明／文件 A／讀取的預設結果與完整權限規則；切換停用。',scope:'這是模擬的授權規則，不是真實組織的權限設定，也未連接任何後端服務。選擇身分不會登入帳號，操作不會讀取、修改或刪除任何文件。'}:{user:'Simulated signed-in user',document:'Which document?',action:'Which operation?',actors:['Xiaoming','Xiaomei','Reviewer'],docs:['Document A','Document B'],actions:['Read','Edit','Delete'],allow:'Operation allowed (simulation)',deny:'Operation denied (simulation)',allowNote:'The selected identity has permission for this operation under the teaching policy.',denyNote:'The teaching policy denies this operation and displays no document contents.',role:'Current role',policy:'Fixed teaching permission rules',static:'Without JavaScript, Xiaoming / document A / read and the full policy remain readable; switching is disabled.',scope:'These are simulated rules, not actual organizational permissions, with no backend service. Selecting an identity does not sign into an account, and no document is read, edited or deleted.'});
</script>
<figure class="document-access-simulation">
 <figcaption><strong>{diagram.caption}</strong><p>{diagram.description}</p></figcaption>
 <p>{t.scope}</p>
 <div class="selectors">
  <div><label for="document-actor">{t.user}</label><select id="document-actor" bind:value={actor} disabled={!ready}>{#each ['a','b','reviewer'] as id,i}<option value={id}>{t.actors[i]}</option>{/each}</select></div>
  <div><label for="document-resource">{t.document}</label><select id="document-resource" bind:value={document} disabled={!ready}>{#each ['A','B'] as id,i}<option value={id}>{t.docs[i]}</option>{/each}</select></div>
  <div><label for="document-action">{t.action}</label><select id="document-action" bind:value={action} disabled={!ready}>{#each ['read','edit','delete'] as id,i}<option value={id}>{t.actions[i]}</option>{/each}</select></div>
 </div>
 <p>{t.role}：{diagram.items[['a','b','reviewer'].indexOf(actor)]?.title}</p>
 <div class="access-result" data-allowed={allowed} role="status"><strong>{allowed?t.allow:t.deny}</strong><p>{allowed?t.allowNote:t.denyNote}</p></div>
 <noscript><p>{t.static}</p></noscript>
 <h3>{t.policy}</h3><ul>{#each diagram.items as item}<li><strong>{item.title}</strong><p>{item.body}</p></li>{/each}</ul>
</figure>
<style>
 .document-access-simulation{margin:1.5rem 0;padding:1rem;border:1px solid #b7c9df;border-radius:12px;background:#f5f8fc;color:#173450;overflow-wrap:anywhere}figcaption>strong,h3{font-size:1.2rem;line-height:1.75}p,strong,label,select,li{font-size:1rem;line-height:1.8}.selectors{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.selectors>div{min-width:0}label{display:block}select{font:inherit;width:100%;max-width:100%;padding:.6rem;border:1px solid #60738d;color:#173450;background:white}select:focus-visible{outline:3px solid #d66b00;outline-offset:3px}.access-result{padding:1rem;background:#fff;border-left:4px solid #287162}.access-result[data-allowed=false]{border-left-color:#ad4c37}.access-result p{margin:.5rem 0 0}ul{padding-left:1.3rem}li p{margin:.3rem 0 .8rem}@media(max-width:640px){.selectors{grid-template-columns:1fr}}
</style>
