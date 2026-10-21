for (const block of document.querySelectorAll('pre')) {
 const button=document.createElement('button');button.type='button';button.textContent='複製';button.setAttribute('aria-label','複製這段程式或提示詞');
 button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(block.querySelector('code').textContent);button.textContent='已複製';}catch{button.textContent='請選取文字複製';}setTimeout(()=>button.textContent='複製',2000);});block.append(button);
}
if(matchMedia('(max-width:760px)').matches) document.querySelector('aside details').open=false;
