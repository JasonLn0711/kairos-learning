<script lang="ts">
  import course from '../../../content/aase/course.json';
  let { moduleId,concepts }: { moduleId?: string;concepts:{id:string;available:boolean;href:string}[] } = $props();
  const modules = $derived(moduleId ? course.modules.filter(m=>m.id===moduleId) : course.modules);
  const labels: Record<string,string> = {deep:'現場深講',overview:'現場概覽',extension:'線上延伸'};
</script>
<p class="lead">從問題定義到可驗證的軟體交付。以合成收件資料檢核案例，練習需求、設計、規格、Agent 協作、驗證與交接。</p>
<p>9 個模組 · 49 個核心概念 · 10 小時淨授課，包含 150 分鐘實作。{concepts.filter(c=>c.available).length} 篇教材已開放，其餘概念逐篇準備。<a href="/courses/aase/v1/workshop/">工作坊資源</a>提供合成資料與練習骨架。</p>
<nav aria-label="AASE 課程導覽"><a href="/courses/aase/v1/">系列總覽</a>{#each course.modules as m} · <a href={'/courses/aase/v1/'+m.id+'/'} aria-current={moduleId===m.id?'page':undefined}>{m.id.toUpperCase()}</a>{/each}</nav>
{#if !moduleId}
<section><h2>沿著同一個問題累積作品</h2><p>問題 → 理解 AI → 需求 → 設計 → 規格 → 架構 → 實作 → 驗證 → 交付。UX 與安全邊界在每個階段都要檢查。</p><p>線上系列供逐篇自學；工作坊選擇 26 個深講、20 個概覽與 3 個線上延伸節點。閱讀目錄不代表完成實作。</p><p>共用案例使用合成資料。Python／Streamlit 在學員本機或受控教學環境執行；本站提供靜態教材。</p></section>
{/if}
{#each modules as m}
<section><h2><a href={'/courses/aase/v1/'+m.id+'/'}>{m.id.toUpperCase()}｜{m.title}</a></h2><p>{m.concepts.length} 個概念 · {m.minutes} 分鐘（含 {m.practiceMinutes} 分鐘實作）</p><p>學習證據：{m.artifact}</p><ol>{#each m.concepts as c}<li id={c.slug}>{#if concepts.find(x=>x.id===c.id)?.available}<a href={concepts.find(x=>x.id===c.id)!.href}><strong>{c.slug.toUpperCase()}｜{c.title}</strong></a>{:else}<strong>{c.slug.toUpperCase()}｜{c.title}</strong>{/if}<p>{c.id} · {labels[c.workshopDepth]} · {concepts.find(x=>x.id===c.id)?.available?'教材已開放':'準備中'}</p>{#if moduleId}<p>學習目標：{c.objective}</p><p>練習：{c.practice}</p><p>驗收：{c.assessment}</p>{/if}</li>{/each}</ol></section>
{/each}
{#if !moduleId}
<section><h2>如何驗收自己的成果</h2><p>以 problem.md 記錄角色、流程與不做清單；以 wireframe.svg 呈現正常、處理中、失敗與完成狀態；在 spec.md 寫至少四條可觀察的驗收情境。architecture.md 標示資料流及信任邊界，再用三次垂直切片完成 app.py。</p><p>交接時保留 tests/、真實測試結果、同儕試用紀錄、README.md 與 Git 紀錄。能啟動原型與通過組織正式上線審查是不同的驗收層次。</p></section>
<section><h2>整合理解評量</h2><p>十位同仁準備共同使用收件檢核原型。不同承辦人只能存取獲授權的資料；資料不齊時不得輸出標記為完整的報告。</p><ol><li>如何訪談使用者、畫出流程並決定 MVP？</li><li>哪些工作交給 Agent？如何限制工具與檔案權限？</li><li>主畫面顯示哪些狀態？如何用真實任務測試易用性？</li><li>寫三條 Given／When／Then，並說明架構與授權檢查的位置。</li><li>如何以三次切片完成實作，組合規則、介面、任務及安全負向測試？</li><li>用哪些版本與測試證據交接？還有哪些風險需要另外驗證？</li></ol></section>
{/if}
<style>
  nav{line-height:2;overflow-wrap:anywhere}section{margin-block:2rem}li{margin-block:1rem}li p{margin-top:.25rem}p,li{line-height:1.8;overflow-wrap:anywhere}strong{font-weight:600}
</style>
