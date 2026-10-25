<script lang="ts">
  let {texts,src}:{texts:string[];src:string}=$props();
</script>
<a class="diagram-download" href={src} download aria-label={texts.join('；')+'。下載這張模擬結果圖（SVG）'}>
  <figure class="access-diagram" role="img" aria-label={texts.join('；')}>
    <div aria-hidden="true">
      <div class="server">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="18" height="7" rx="1.5"/><path d="M6 6.5h2m-2 11h2"/></svg>
        <div><span class="diagram-text server-title">{texts[0]}</span><span class="diagram-text address">{texts[1]}</span></div>
        <span class="diagram-text status">{texts[2]}</span>
      </div>
      <div class="resource">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 7V5a1 1 0 0 1 1-1h5l3 3h8a1 1 0 0 1 1 1v12H3V7Zm0 4h18"/></svg>
        <strong class="diagram-text">{texts[3]}</strong>
        <span class="result"><svg class="icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/></svg><span class="diagram-text">{texts[4]}</span></span>
      </div>
      <div class="resource">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 20H3V5h6l3 3h8v4M15 17v-2a2 2 0 0 1 4 0v2"/><rect x="12" y="17" width="10" height="6" rx="1"/></svg>
        <strong class="diagram-text">{texts[5]}</strong>
        <span class="result"><svg class="icon denied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 10V7a5 5 0 0 1 10 0v3"/><rect x="4" y="10" width="16" height="12" rx="2"/><path d="M12 14v4"/></svg><span class="diagram-text">{texts[6]}</span></span>
      </div>
      <p class="diagram-text caption">{texts[7]}</p>
    </div>
  </figure>
</a>
<style>
  .diagram-download{display:block;color:#303632;text-decoration:none;border-radius:18px;margin:1.5rem 0}
  .diagram-download:focus-visible{outline:3px solid #17664b;outline-offset:4px}
  .access-diagram{margin:0;padding:20px;background:#f7f5ef;border:1px solid #d8d8ce;border-radius:18px;font-size:16px;line-height:1.6}
  .server{display:flex;align-items:center;gap:12px;padding-bottom:20px;margin-bottom:18px;border-bottom:1px solid #deded5;flex-wrap:wrap}
  .server-title,.address{display:block}.address,.caption{color:#565d57}.address{font-size:14px}
  .status{margin-left:auto;background:#d8eddc;color:#176339;border-radius:20px;padding:1px 10px;font-size:14px}
  .icon{width:22px;height:22px;flex-shrink:0;color:#626961}.success{color:#08743a}.denied{color:#b72b35}
  .resource{display:flex;align-items:center;gap:10px;margin:12px 0;flex-wrap:wrap}.result{margin-left:auto;display:flex;align-items:center;gap:8px}
  .caption{margin:16px 0 0;font-size:14px}
  @media(max-width:420px){.access-diagram{padding:16px}.server{gap:8px}.status{margin-left:30px}.result{flex-basis:100%;margin-left:32px}.resource{row-gap:5px}}
</style>
