<script lang="ts">import course from '../../../content/aase/course.json';</script>
<p class="lead">用同一套合成收件案例，完成問題、設計、規格、架構、實作、驗證與交接。600 分鐘為淨教學，包含 150 分鐘實作，休息另排。</p>
<p><a href="/courses/aase/v1/">回課程地圖</a> · <a href="/downloads/aase/aase-v1-workshop.zip" download>下載工作坊 ZIP</a> · <a href="/downloads/aase/SHA256SUMS.txt">下載檔案雜湊</a></p>
<section><h2>包內有什麼</h2><ul><li>學員手冊與教師流程、六題整合評量參考方向及評分規準。</li><li>可啟動的起始骨架，以及分開存放的教師參考解答。</li><li>規則測試、Streamlit AppTest、三筆合成案例與四份作品工作表。</li><li>README 的環境、啟動、驗證、限制與清理指引。</li></ul><p>本包是本系列新編教學資源。起始骨架供學員依規格完成，參考解答供嘗試後比對；兩者都使用合成資料。</p></section>
<section><h2>課程安排</h2><p>第一段 M01–M05 為 295 分鐘，第二段 M06–M09 為 305 分鐘；可依授課日分段，休息另排。</p><ol>{#each course.modules as m}<li><a href={'/courses/aase/v1/'+m.id+'/'}>{m.id.toUpperCase()}｜{m.title}</a>：{m.minutes} 分鐘（含實作 {m.practiceMinutes} 分鐘）。成果：{m.artifact}。</li>{/each}</ol></section>
<section><h2>課前準備與實作路線</h2><p>準備 Python 3.11 或 3.12、文字編輯器、終端機與瀏覽器；教師先確認一種可用的 Coding Agent、工具權限及費用。解壓後按 README 建立獨立環境，先啟動 starter/app.py。</p><ol><li>需求與設計：完成 problem.md、四狀態 wireframe.svg、至少四條情境的 spec.md，以及標示資料與信任邊界的 architecture.md。</li><li>三次切片：表單、檢核、預覽與匯出。每次審查 Diff，依規格執行驗證，再進下一次。</li><li>驗收與交接：留下 tests/、同儕試用、真實命令結果、README 與 Git 紀錄。從完整輸入改成缺漏，確認舊完整結果失效。</li></ol></section>
<section><h2>驗證範圍</h2><p>參考解答是本機單人原型，沒有正式身分系統、多人授權與資料庫。三欄完整只代表教學完整性規則通過。不要輸入真實案件、病歷、個資或秘密。</p><p>規則測試、AppTest、真實瀏覽器與同儕任務測試各驗證不同層次。下載與清理方式見包內 README；完整性檢核通過不代表組織正式上線或學員已完成實作。</p></section>
<style>section{margin-block:2rem}p,li{line-height:1.8;overflow-wrap:anywhere}li{margin-block:.75rem}</style>
