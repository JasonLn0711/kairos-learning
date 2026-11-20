# Day02-A 四重點補充｜v1.1.0

本次依使用者供稿在既有 `/ceh-notes/day02-a-reconnaissance/` 相應內容正下方補充四觀念，保留原13章、原錨點、原五題與三圖。SQL Injection建議40%、RDAP30%、Directory Traversal與CSRF各15%；這是閱讀／教學配置，非官方四項考試配分。

[完整來源、前版、四PNG及逐小節對照](../sources/ceh-day02-a/2026-11-14/four-topics/README.md)保存7節／14小節、所有表格／片段／16選項。圖4比例放學習優先順序之下，RDAP精讀放WHOIS之下／DNS之前，三種Web弱點精讀各放原定義正下方，新四題接原五題之後。閱讀推薦順序與原頁主題順序並存，不為重要性排序移動原章節。

## 規範與內容驗證

- WRITE-01–04、09–11：每小節完整教學與對照；缺完整23原題，將供稿「WHOIS5題、其餘各1題」保留為未獨立重算的記載，P1-Q050／P3-Q005是供稿轉述。EC-Council藍圖v5.0第3頁支持SQLi子領域6題；14%為包含Web Servers／Web Applications／SQLi的整個領域，不是SQLi獨立配分。
- WRITE-05–08：本次仍為繁體中文單語，標題／正文無學位標籤，版本1.0.1→1.1.0、revision2→3，原發布與版本修訂日2026-11-14；作者CS Kairos。沒有新增不存在的英文alternate。
- HTML-01–04、FIG-01–06：可選取／搜尋HTML與七份同源SVG；新圖固定四列比例、四步有框流程、五節點目錄及四步CSRF。手機原生重排，比例不是靠整張圖片縮小；文字與數值直接可讀，原PNG另存來源。圖意差異與模型契約見來源README。
- A11Y-01–03、INT-01：原生表格欄名／列名、固定裝飾圖示、局部程式碼與表格鍵盤捲動，教學直接展開；四新題完整16選項但不公布答案、沒有提交／批改服務或學習進度。10–15秒是供稿自檢目標，非已驗學習成果。

## 本機實測

- `pnpm test`：415／415通過。原Day02-A測試繼續核對原三圖；兩項新測試核對舊正文與錨點保留、相對插入位置、14小節與四題16選項、權重100%與非法比例／額外標記／節點拒絕、非空來源行。
- `pnpm run check`：修復測試型別縮窄與改用原生table之後，0 errors／0 warnings。
- `python3 scripts/ceh_day02a.py --check`：整篇正文、原來源採用紀錄、新來源分組及四新SVG同步。原三圖位元組維持。
- `python3 scripts/check-day02a-sql-example.py`：從正式JSON取出兩段Python片段，在記憶體SQLite建立alice／bob假資料；正常alice拼接／參數化各1筆，示意恆真輸入拼接2筆／參數化0筆。原稿黏合換行已修復，沒有對外探測。此檢查加入release閘門。
- `pnpm run validate:content`與`pnpm run validate:release`通過；前者通用lesson統計不代表本專頁，後者以實際建置、M20Review驗證與本頁產生器承接新內容。
- `PLAYWRIGHT_CHANNEL=chrome node scripts/check-day02a-browser.mjs`：13項通過，見同名前綴local-browser.json。逐模型文字核對完整原文與補充正文／表格／程式碼／七圖；320／390／768／1280px、JS開關、320px 200%字級、表格鍵盤、七SVG鍵盤下載及HTTP200／位元組／文字邊界／文字互斥、索引與搜尋均通過。比例條實際寬度在四尺寸核對40／30／15／15，程式碼16px／1.8／淺底深字，未出現Cloudflare email-protection連結。

本機四新圖手機與桌面截圖逐張目視，保留比例、平行目錄、四步三箭頭、後兩框及Cookie條件，證據在忽略目錄`.local/day02a/`。這些是瀏覽器模擬，不是實體裝置、完整WCAG或學習理解認證。新增教學沒有變更原23題未附的界線。

## 發布與正式站回讀

待本次發布閘門與部署成功後，記錄正式全文、七圖及下載的實際回讀。

發布前補充：`node scripts/check-publication-boundary.mjs`通過，包含本頁新內容在draft／future情境的真實建置排除（路由、索引、搜尋與payload），fixture已還原，輸出重建為正式狀態。既有Cloudflare固定email_off保護保留，避免虛構信箱再次被改寫；新增內容使用受限文字模型，沒有接受任意HTML。

發布前再補明題數界線：原五道整合情境題、本次四道概念自檢與未附全文的23道題庫題目分開，不把新增自檢稱為新增官方題目。因而取消尚未部署的首輪run `43581095930`，以含此說明的相同初版v1.1.0重新發布；原正文與檢核題均保留。

## 正式發布與最終驗收

[Pages run 43581215004](https://github.com/JasonLn0711/kairos-learning/actions/runs/43581215004)成功，正式source為`383aac490ca14c6b4965d415102a1aa6aed37c4f`。安裝／high級稽核／內容驗證／415項測試／6項HTML契約／型別檢查／draft與future真實建置隔離／release與SQLite片段實跑／既有下載checksum／Pages部署均成功。CI實際記錄`tests415／pass415`、`0 errors and 0 warnings`、`411 HTML pages／1025 static assets`，部署步驟見同名前綴deployment.json。

正式頁：https://learn.cs-kairos.com/ceh-notes/day02-a-reconnaissance/

`DAY02A_BASE_URL=https://learn.cs-kairos.com PLAYWRIGHT_CHANNEL=chrome node scripts/check-day02a-browser.mjs`：13項全部通過，見同名前綴production.json。按正式模型逐項核對原13章與完整補充文字、表格、程式片段、原五題與新四題／16選項、七圖；頁面顯示v1.1.0與原發布／修訂日，沒有博士／碩士／研究生定位，虛構信箱未被Cloudflare改寫。

四尺寸320／390／768／1280px在JS開／關皆通過全文與無整頁水平溢出，320px 200%字級、原生表格鍵盤焦點、比例條實際40／30／15／15寬度、淺底深字16px／1.8程式碼、七SVG鍵盤下載與HTTP200、位元組與本機相同、文字viewBox邊界與文字互斥、索引與搜尋均核對。正式站四新圖的桌面／手機截圖逐張目視，比例、層級與流程無誤；截圖在忽略目錄`.local/day02a/`。

新四SVG大小依圖4–7為3732／2243／2670／2335 bytes，均小於100000 bytes，路徑與SHA見同名前綴assets.json。正式下載與本機逐一比對；原三圖保持原位元組。SQLite正式片段結果另保存為同名前綴sql-example.json，僅支持該假資料與查詢示例，不代表真實系統驗證。

來源與逐節對照提交`c2e06767`、正文／四圖與驗證`747d5b5c`、本機紀錄`85f7afae`、題數界線`383aac49`分別保留。全程沿既有main非強制推送；原工作樹三份`article-audit.md`／`diagram-design-system.md`／`publishing-security.md`修改未納入本次提交。

WRITE-09–11、HTML-01–04、FIG-01–06與A11Y對照、實測及發布證據如上。本次頁面補充與圖解已完成；完整23題原題未提供，故WHOIS5題等頻次未獨立重算。實體裝置、完整WCAG認證、使用者作答與理解狀態未驗，不以部署或瀏覽器通過替代。
