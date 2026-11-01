# 全站文章寫作與響應式教學規範

採用日期：2026-11-01。適用所有觀點、CEH、AI、網路與 MATLAB 教學頁面。新增與修訂文章必須遵循；既有差距由盤點追蹤，保留原始教材與發布歷史。

## Agent 工作流程

閱讀本規範及對應內容指南 → 確認讀者與主要問題 → 查核來源 → 檢查內容模型及元件 → 撰稿與圖解 → 雙語核對 → 逐頁瀏覽器驗證 → 記錄結果。現有模型沒有需要的能力時，先記錄差距，不能插入任意 HTML 繞過驗證。

## 必須遵循的規則

| ID | 要求 | 驗證與證據 |
| --- | --- | --- |
| WRITE-01 | 正面、主動且有依據；說明收穫、條件與下一步，保留真實不確定性。 | 編輯核對主張與證據，避免空泛免責句。 |
| WRITE-02 | 臺灣繁體中文，白話解釋用途、原理、例子與驗證方法。 | 初次術語有解釋；識別字與命令保持原樣。 |
| WRITE-03 | 一篇集中回答一個主要問題，區分回報、觀察、推論與行動。 | 主張可追溯到來源或觀察時間。 |
| WRITE-04 | 核對來源、版本、日期、公開範圍與實際協作分工。 | 私人資料留在忽略目錄；公開 Git 草稿同樣需去識別化。 |
| WRITE-05 | 雙語教材的數字、條件與結論一致。 | 對照兩種語言；既有單語 MATLAB 不因本規範自動增加翻譯。 |
| HTML-01 | 正文為可選取、搜尋的語意 HTML；無 JavaScript 仍可閱讀與導覽。 | 關閉 JavaScript 檢查正文、來源與連結。 |
| HTML-02 | 正文至少 16 CSS px、行高至少 1.7；補充文字至少 14 CSS px。 | 核對計算樣式及 200% 文字放大；不得裁切或重疊。 |
| HTML-03 | 寬版可並排，窄版上下重排；DOM 與視覺閱讀順序一致。 | 320、390、768、1280 CSS px 逐頁檢查。 |
| HTML-04 | 頁面無水平溢出；寬表格、程式碼及 ASCII 圖使用有名稱、可鍵盤捲動的局部容器。 | 記錄溢出元素與鍵盤結果。 |
| FIG-01 | HTML 承接文字與節點，CSS 重排，SVG 呈現圖示與連線。 | 手機標籤可讀，箭頭方向與分組正確；不強迫每篇配圖。 |
| FIG-02 | 空間 SVG 保留 viewBox、比例與欄寬適配，附可換行文字解說及原圖。 | 欄寬適配與標籤易讀分別驗收，不能只靠整張縮小判定通過。 |
| FIG-03 | 圖說、替代文字、搜尋文字與下載圖語意一致；每張圖片小於 100000 bytes。 | 記錄大小、語意比較及下載結果；僅使用受審核 SVG。 |
| A11Y-01 | 語意標題、圖說、表格標頭與替代文字完整，裝飾圖示不重複朗讀。 | DOM 檢查及人工閱讀。 |
| A11Y-02 | 鍵盤焦點可見、順序合理，操作不依賴懸停。 | Tab、Shift+Tab、Enter、Space 實測，記錄適用功能。 |
| A11Y-03 | 正文、原理、步驟與圖解直接可見；參考答案及實際問答可原生收合。 | 檢查無巢狀圖解收合；無 JavaScript 仍可展開。 |

改寫例句、來源與 AI 協作細節見[編輯規範](perspectives/authoring.md)第 2–11 節；這些寫作原則共同適用全站。教材資料契約見[內容指南](content-authoring.md)。

## 圖解與技術選擇

沿用 Svelte、HTML、CSS、SVG；單張圖不新增框架或外部服務。Downloads 的 index-example.html 示範 HTML 節點、SVG 圖示及雙欄轉單欄；採其重排原則，核心補充說明改為直接可見。原檔所連結的獨立 SVG 未隨檔提供，不能當作已完成交付。

最小排版範例（SVG 圖示為裝飾，完整意義由文字承接）：

```html
<figure>
  <div class="comparison">
    <section><h3>直接連線</h3><p>瀏覽器 → Apache：HTTPS</p></section>
    <section><h3>代理連線</h3><p>瀏覽器 → 代理：HTTPS</p><p>代理 → Apache：HTTP 或 HTTPS</p></section>
  </div>
  <figcaption>兩種 TLS 終結位置；實際部署需核對入口設定。</figcaption>
</figure>
<style>
.comparison { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr)); gap:1rem }
.comparison section { min-width:0; padding:1rem; border:1px solid #64748b; border-radius:1rem; overflow-wrap:anywhere }
</style>
```

## 驗收紀錄

每頁記錄 URL、語言、規則 ID、尺寸、結果與證據。狀態使用「通過／發現差距／尚待人工檢查／不適用」。自動盤點不等同完整無障礙認證。人工檢查圖中文字、連線關係、焦點、200% 放大與閱讀順序；未執行即保留待驗。

參考：[重排](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)、[文字放大](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)、[鍵盤](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)。

共用[撰稿工作表](article-writing-template.md)；執行 `npm run audit:articles` 產生[逐頁盤點](article-audit.md)。此指令建立本機網站，寫入忽略的瀏覽器證據與公開摘要；不部署。

[本次成果、驗證與跨 repo 關聯](releases/2026-11-01-perspectives-standards.md)記錄實際結果及後續驗收。
