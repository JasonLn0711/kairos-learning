# AASE M03-05 完整供稿與五圖抽換

本課將成功指標、假設與需求紀錄的完整供稿採入正式正文，新增五組雙語圖解及0–4阻擋數練習。中文[正式網址](https://learn.cs-kairos.com/courses/aase/v1/m03/concepts/m03-05/)與[英文網址](https://learn.cs-kairos.com/en/courses/aase/v1/m03/concepts/m03-05/)保持原路徑；v1.1.0、revision 4、修訂日2026-11-09，原發布日2026-11-05。

## 來源、內容與範圍

[來源對照](../sources/aase/m03-05/replacement-2026-11-09/source-map.md)保存完整原文、五張PNG、待換前版、兩語成稿、同源圖解資料與SHA256。原九節、導言、三節分母說明分為11個正文section，六個既有錨點保留。四張原表、原始problem.md、計算推導、練習效應與失敗／放棄限制、反證、需求變更、工程術語及四道開放問題均進入正文。新題Q04–Q07使用可自行展開的參考解析，前版選擇題保存在prior-lesson.json。

圖1為六步流程，圖2為兩類平行指標，圖3為固定四案例滑桿，圖4比較不同計時起點，圖5為四步過期狀態風險加補充規則。手機重排由HTML／CSS承接，SVG只作圖示／箭頭及獨立下載；十份下載固定為預設案例，每檔1309–2953 bytes。下載文字、搜尋與正式資料共用模型。原圖與成圖差異在來源對照逐圖記錄。

AASE新增受限prose區塊，以文字陣列維持表格與圖解前後的正文順序，固定條列前綴轉原生清單；沒有任意HTML注入。CEH內容型別保持原契約。公開主標題與課程目錄／搜尋同步採用完整供稿主題；課次維持M03-05。本課沒有啟動真人任務、計時、臨床或AI效能實驗，算例不構成真實系統驗收或學習完成。

## 規則與本機驗證

規則：WRITE-01–11、HTML-01–04、FIG-01–06、INT-01、A11Y-01–03。來源、產生器、模型、頁面、操作與發布各自驗證，結果不互相代替。

- `sha256sum -c SHA256SUMS.txt`：原文、五PNG與前版位元組通過。
- `normalize-source.py --check`：原文依明列格式／UI重建差異對應完整中文成稿通過。
- `aase_m0305_content.py --check`、`aase_m0305_svg.py --check`：兩語成稿／圖解與正式JSON、十SVG同步。
- `pnpm run validate:content`、`pnpm test`、`pnpm run check`：通過；最終候選276項測試通過，型別0錯誤／0警告。
- `node scripts/check-publication-boundary.mjs`：最終候選實際隔離建置通過；檢查草稿／未來日期、英文課程與翻譯閘門後還原正式輸出。已完成；閘門後重建正式輸出。
- `pnpm run validate:release`：最終候選通過。
- `pnpm exec playwright test --config playwright.aase-m0305.config.ts`：最終候選中英2項通過，逐段正文、表格、原碼、四參考答案、同源搜尋、五圖、320／390／768／1280 CSS px、100%／200%字級、字級／行高／溢出、鍵盤、無JS、十SVG字框／重疊／下載位元組。最新英文模板解釋與SVG圖示已納入重驗。

發布候選使用獨立工作目錄`.local/aase/m0305/release-worktree`、分支`codex/aase-m0305-release`，基於最新origin/main，另以pnpm鎖檔安裝獨立依賴。原工作區的CEH M05-05修改保留未改；候選完整276項測試、型別及真實發布閘門重驗通過。

本機證據位於忽略目錄`.local/aase/m0305/`，含兩語五圖手機／桌面截圖、十SVG截圖、JSON報告與失敗時trace。已目視中英文手機五圖、中文桌面圖4、中文圖3與英文圖2的獨立SVG：下行關係、分組、平行比較、A/B風險順序、預設75%與文字換行正確。

初輪發現既有歷史快照仍比較舊正文，已轉為核對保存的prior-lesson.json；新稿另由本課專屬測試檢查。瀏覽器測試移植時修正箭頭數（六節點是五箭頭）、原生清單的逐項文字比較及開放題資料欄位。保留失敗報告，後續通過只支持修正後的候選。

隔離候選首次release檢查發現課名同步後，ZIP內curriculum.json仍為舊名。已執行`python3 scripts/package-aase.py`重新封裝，30份教材操作檔案不變，僅課程目錄標題與對應ZIP／SHA256更新；重新建置與release檢查通過。

`pnpm audit --audit-level=high`：無高／嚴重弱點，4項low；`git diff --check`通過。

## 發布與待驗

隔離發布基準為origin/main的990d683cb042a069e3768ec2b9ac63d141b85a48，[Pages 42565400459](https://github.com/JasonLn0711/kairos-learning/actions/runs/42565400459)成功。來源提交8fe364a；正文、圖解、驗證與下載提交fbd240f。已推送origin/main；遠端回執bdf6e62以合併b5999b9保留，推送後分歧0／0。

實體手機、完整螢幕閱讀器與獨立讀者接受度尚未驗收。這些項目不代填為瀏覽器模擬通過，也不構成本課靜態文章發布之外的新研究承諾。


## 正式站回讀｜2026-11-09

[Pages 42565826371](https://github.com/JasonLn0711/kairos-learning/actions/runs/42565826371) 已成功，部署提交 `b5999b981be0ef4788e7e7c09094f2d873fc9f2f`。原始來源8fe364a、教材與圖解fbd240f、紀錄cbfc366與遠端歷史均保留；沒有force push。

`AASE_BASE_URL=https://learn.cs-kairos.com pnpm exec playwright test --config playwright.aase-m0305.config.ts`：中英2項通過（20.9秒）。本次正式站證據包括：

- 11個正文section、四表、原始problem.md、四個開放問題及參考解析；逐段檢查內容和先後順序，確認表格／圖解與說明交錯順序。
- 中英五圖、同源搜尋、320／390／768／1280、100%／200%字級、無全頁溢出、正文最小16px與1.7行高、原生局部捲動。
- Tab／Shift+Tab／Enter／Space、可見焦點、五個滑桿值0–4、Home／End、0%／25%／50%／75%／100%，4／4才達本版要求；無JS保留預設正文與五圖。
- 十份正式SVG回應200、每檔小於100000 bytes、下載內容等同候選、文字字框在viewBox內且未重疊。SVG固定為預設案例，沒有將互動結果誤當成實測。
- 正式ZIP 30175 bytes，SHA256 `23b13246fb049cb149c13dd92ec39c87cb8ef71e7b51545608488dee566ab8af`，與封裝檔完全一致；正式SHA256SUMS也與候選相同。

精確發布候選的本機／正式報告在 `.local/aase/m0305/release-worktree/.local/aase/m0305/local-results.json`、`live-results.json`與`live-downloads.json`。原工作目錄保留先前截圖與測試紀錄。直接Python urllib下載曾回403；curl實際取得200與完整位元組，瀏覽器全文／資產回讀也通過，此差異保留為取用方式的觀察。

完整性稽核：原文與五原圖已保存；九節教學及導言完整進入中英正文；五組圖、互動、十SVG、原表與模板可讀／可下載；歷史、六既有錨點、原發布日及發布閘門保留；Git、Pages與正式站已各自取得證據。工作坊操作內容未變，課名衍生目錄已同步。實體手機、完整螢幕閱讀器與獨立讀者接受度維持尚待驗收，不影響上述範圍的已驗結果。
