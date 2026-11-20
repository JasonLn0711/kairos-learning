# e-means觀點：完整雙語、八圖與發布證據

## 交付與所有權

- 中文：<https://learn.cs-kairos.com/perspectives/e-means-clustering/>
- English：<https://learn.cs-kairos.com/en/perspectives/e-means-clustering/>
- 版本：v1.0.0；原發布／版本修訂：2026-11-15；作者：CS Kairos Learn。
- 正式內容：`content/perspectives/e-means-clustering.json`；兩語各15主區段（十四章＋理解檢查）、32小標題、148依序區塊、八張圖。
- [來源快照](../sources/e-means/2026-11-15/README.md)保留原始供稿、八張原圖、先前重繪與核對筆記；[逐節採用表](../sources/e-means/2026-11-15/adoption-map.md)連到44個來源章／小節。
- [設計契約](../perspectives/e-means-design.md)說明內容模型缺口、受限圖組與驗收範圍；正式網站實作／測試／部署由kairos-learning持有。原始構想由brainstorming-lab的idea_000062持有，Planning僅留定位、容量與下一關。

## 教學與圖示採用

依WRITE-01–07、09–12逐節編排兩語：保留配送例子、Lloyd均值推導、N/S兩次EMA手算、有效β、空群條件、cosine、revival、finalization、scaling laws、Voronoi判讀、Table 3/4、GPU記憶體、EM與複雜度、IVF與下游Recall、消融及三道理解題。

0.43/4.39秒與2.2/25 epochs保留為來源展示數字；未提供其固定設定，未冒充本站實測。原稿NumPy的1.51×／+1.42%沒有可回查直接來源，兩語同樣標為待核。k-means++列為初始化；固定保存指派loss與fresh-assignment train MSE分開。

依HTML-01–04、FIG-01–06、A11Y-01–03，正式頁以語意HTML承接文字，SVG保留空間關係。八圖使用固定allowlist，內容沒有任意HTML／URL／SVG path注入。每圖16px以上文字在手機重排；數線、曲線及中心位置有可搜尋文字與數值表。SVG下載與搜尋使用同源模型；每語八圖，每檔小於100000 bytes。PNG來源保持來源層，不把大圖縮成手機正文。

## 已執行的工程檢查

- `pnpm run validate:content`：通過。
- `pnpm test`：428項通過，含三項e-means模型／數值／發布路由回歸測試。
- 原稿與八原圖的SHA-256核對：通過。
- `node scripts/check-publication-boundary.mjs`：通過，包含draft／future、英文課程及M20類頁面閘門，fixture移除後重建正式輸出。
- `pnpm run check`：0 errors／0 warnings；`pnpm run build`通過。
- `pnpm run validate:release`：通過，414 HTML與1062靜態資產的既有release契約通過；新頁與來源／下載亦由專用檢查核對。
- `python3 -m unittest discover -s scripts -p test_validation_html.py`：6項通過。
- `pnpm audit --audit-level=high`：exit 0，沒有high／critical；保留既有4 low與2 moderate，未改依賴。
- `node scripts/check-emeans-browser.mjs`：33組通過。兩語四寬度、JS開／關、全文逐區塊、八圖、200%文字、鍵盤捲動／Tab／Shift+Tab／Enter下載、搜尋與導覽均有檢查。16 SVG位元組一致、字框在viewBox內且文字不重疊；證據在`.local/emeans-browser/`。
- 目視核對手機／桌面圖組的中心點、數線、局部谷底、更新批數、EMA位置、cosine趨勢及IVF分層。本篇補充來源註記採14px下限，正文／圖解16px以上；字級修正僅套用本篇，保持其他觀點的閱讀版本不變。重建後重啟預覽，排除舊資產manifest造成的404，再驗收最終產物。
- `git diff --check`通過；Git與正式部署狀態於下列發布回執記錄。

目前不以教學頁、來源清冊、測試或部署推論GPU效能、實體裝置、螢幕閱讀器認證或學習者理解。容量維持Unknown；未啟動分群研究實驗、模型服務或新增週承諾。

## 正式發布與回讀（PUB-01–02）

來源保存提交：`a2bbb359`。內容與實作在獨立worktree整合最新origin/main；原有髒工作區保留。
內容提交`51583721`與本篇字級範圍修正`08e921c4`已發布。GitHub Pages [run 43693970005 / attempt 2](https://github.com/JasonLn0711/kairos-learning/actions/runs/43693970005/attempts/2)成功；實際部署source為`08e921c42520df60cbea2529a8d332271ab7c785`。

正式站執行`EMEANS_BASE_URL=https://learn.cs-kairos.com EMEANS_EVIDENCE_DIR=.local/emeans-live node scripts/check-emeans-browser.mjs`，33組通過。中文／英文全文逐區塊、四寬度、200%文字、無JS、鍵盤捲動與下載、觀點目錄、搜尋、語言與related連結均已回讀；16 SVG與本機正式下載逐位元組一致，字框在viewBox內且無文字重疊。這是正式站內容／瀏覽器驗證，不是實體手機、完整螢幕閱讀器或學習者驗收。

第二次artifact為`github-pages-2`、ID `14153668197`、25,659,021 bytes，digest `sha256:f54682ee895ed2587623d3153253939b5810bb55127b4636ed22e139f87759d2`。來源、圖檔及部署證據各自對應，不以部署成功取代GPU效能重現。

### 部署嘗試保留

原`51583721`的run `43693800763`在檢查階段被本次範圍修正取代並停止，Git提交歷史保留。`08e921c4`第一次部署時，上傳可見性步驟已回報artifact `github-pages-1`（ID `14153707451`、25,653,886 bytes）存在，但約0.3秒後deploy-pages查詢得到0個同名artifact而失敗。後續GitHub API確認它未過期且屬同一source；透過GitHub連接器重跑失敗工作，同一提交第2次成功。這保留API觀測差異與成功重試，不把暫時性可見性視為已獨立證實的唯一根因；未更改CI閘門或依賴。

## 強連結

- [原始構想／完整供稿](https://github.com/JasonLn0711/brainstorming-lab/blob/main/ideas/2026-11-15-e-means-clustering-study/README.md)：idea_000062，structured、59/100；來源`dee2ce5`與筆記／連結`d0766aa`已發布。
- [11/15日誌](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W46/days/2026-11-15.md#e-means-study-2026-11-15)、[W46週計畫](https://github.com/JasonLn0711/planning-everything-track/blob/main/weeks/2026-W46/weekly-plan.md#e-means-study-2026-11-15)、[Brainstorming定位](https://github.com/JasonLn0711/planning-everything-track/blob/main/data/projects/2026-04-brainstorming-lab.md#e-means-study-2026-11-15)：Planning發布回執另記，不複製完整教學。
- 正式觀點目錄與搜尋從同一發布資料產生；`ai-data-splits`教材透過related關聯自動提供返回本觀點的連結。正文亦連到資工系統基礎文章，說明硬體／環境／版本的可重現性關係。

## 跨repo發布回執

Planning `24b8fc99`已把正式網址、428測試、33組本機／正式站驗收、容量Unknown與下一關連到11/15日誌、W46週計畫、Brainstorming專案、網站專案、兩個橋接／整合入口。Brainstorming `a64fd33`保留來源／構想、八張重繪與網站發布狀態；成熟度仍structured、59/100，實驗仍未啟動。兩repo發布後fresh fetch均為`0 0`。

本回執為文件更新，使用`[skip ci]`提交；正式站source仍是`08e921c4`，後續文件提交不冒充重新部署。原始髒checkout及無關staged工作保留。
