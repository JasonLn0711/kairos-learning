# CEH Day 01 日期重整與 C17–C29 完整採納

11/10 頁恢復 C01–C05 採入前的原始三部分，逐物件比對歷史快照一致；版本提高至1.5.0／revision 8，原發布日保留。11/12 建立1.0.0／revision 1新頁，三部分依序承接 C01–C16、C17–C24、C25–C29。C01–C16 的正文及錨點保留，歷史來源目錄及已發布圖檔網址保留。舊日期的限定 C01／C06 錨點在首次載入與同頁 hash 變更時導向新頁，保留語言；無 JS 顯示明確導引。

- [11/10 原日](https://learn.cs-kairos.com/ceh-notes/2026-11-10/)／[英文](https://learn.cs-kairos.com/en/ceh-notes/2026-11-10/)
- [11/12 Day 01](https://learn.cs-kairos.com/ceh-notes/2026-11-12/)／[英文](https://learn.cs-kairos.com/en/ceh-notes/2026-11-12/)
- [兩份原稿、13張原圖、雜湊、採納映射與完整雙語稿](../sources/ceh-notes/2026-11-12/controls-risk-supplement/README.md)
- [一手來源與存取界線](2026-11-12-ceh-day01-source-review.md)

新增兩部分分別有15／12章、35／29小節、285／256個雙語區塊、12／17表、7／6圖；兩組各六道供稿開放問題維持未附答案。全部非空白來源行及833個來源單位皆有採納目的地或明列的介面卡片排除；全文教學、翻譯及13圖語意另做逐節檢閱。七處實質文字修正及兩處空白表頭補標另有紀錄，不回寫原稿。

圖解使用可重排的HTML文字與受限SVG連線，26份新SVG共用模型；手機仍保留三分類軸、四層包含、FTL兩個獨立出口、PDCA循環及真實控制數量比例。風險互動明列1–5整數範圍、教學門檻與3×5=15預設；無JS保留範例並停用操作，不儲存分數。

本次由三位子代理分別處理日期／英譯、完整供稿採納、圖解與互動；根代理負責一手來源查核、整合、獨立回讀、發布與驗收。Kairos是詳細來源及教材的canonical home；Planning只承接定位、狀態、驗證與後續閘門。本次未新增學習時數、排程或成績，原工作目錄無關修改保留在原處。

## 本機驗證

- `pnpm run validate:content`通過；`pnpm test`392/392通過；`pnpm run check`零錯誤／零警告。
- 共用靜態HTML測試6/6通過；dependency audit四項low，無high／critical。
- `check-publication-boundary.mjs`通過：隔離fixture、整篇／分部分草稿及未來日期、英文課程閘門；清除fixture後重建。最後圖文及導向修正後另做正式build，重啟preview，確保bootstrap一致。
- `pnpm run validate:release`通過，包含既有1616／661來源單位、新兩份逐行採納／附件雜湊／雙語重現及26圖語意檢查。
- `check-ceh-notes-browser.mjs`通過：兩日期雙語全文及所有區塊、完整搜尋文字、320／390／768／1280、200%、無JS、鍵盤、既有互動、全部圖檔鍵盤下載逐bytes相同、SVG文字字框／重疊、限定舊hash及跨日期導覽。
- C01／C06圖解各80／64項啟用JS的重排及固定端點檢查通過。
- 新13圖416項專項檢查通過：雙語、JS開／關、四尺寸／兩種文字大小、模型全文、節點／連線、無JS關係、分層／PDCA位置、真實比例及風險鍵盤／重設／動態結果／重載。[逐項本機JSON](2026-11-12-ceh-day01-local-checks.json)。長頁截圖與assertions分開擷取，避免截圖工具的穩定等待影響內容檢查。
- 代理逐圖核對供稿及13圖手機／桌面，根代理另檢視重點HTML與SVG；新SVG最大4524bytes，小於100000bytes。原PNG作為來源原件保留，未為壓縮限制改寫。
- 15份附件由根代理直接與原attachment逐bytes比對一致；`git diff --check`通過。

驗收修正包括英文分類圖320px／200%溢出，以及同頁hash變更未觸發舊錨點導向。另將導向監聽納入可清理的響應式effect，處理SvelteKit跨日期／語言導覽；單元及實際中英瀏覽器導覽均通過。正文與圖示由同源資料重建，生成結果與模型漂移會阻擋release。

適用規則：WRITE-01–06、08–11；HTML-01–04；FIG-01、03–06；INT-01；A11Y-01–03。這是教學與假設情境；未做真機測試、完整WCAG認證、個別機構合規審查或學習理解驗證。ISO公開摘要與版本已查核，付費全文未逐條審閱；加州LegInfo存取限制及替代官方依據詳見來源查核。

## 發布驗收

來源提交 `bbbb6ab` 與教材提交 `73367a8b1ed996df3c953dee8f16606c2f1dd452` 已推送main。[Pages run 43208517528](https://github.com/JasonLn0711/kairos-learning/actions/runs/43208517528)成功，部署來源為後者；push後fetch確認同步 `0 0`。

正式HTTPS站重新執行兩日期全文腳本，雙語全部區塊、完整搜尋、四尺寸／200%、無JS、鍵盤、既有互動、所有目前引用SVG的文字字框／重疊及鍵盤下載bytes均通過。舊C01／C06中英錨點、同頁hash與跨日期client navigation均通過；原11/10三部分保留，新11/12三部分完整呈現。

新13圖正式站416項專項檢查通過：[逐項JSON](2026-11-12-ceh-day01-checks.json)。C01／C06圖解正式站另通過80／64項重排與端點檢查：[逐項JSON](2026-11-12-ceh-day01-moved-checks.json)。風險三等級、鍵盤方向鍵、Enter重設、aria-live、重載預設與無JS停用均經實際瀏覽器驗證。

[公開圖檔與頁面版本紀錄](2026-11-12-ceh-day01-assets.json)保存44份新SVG及18份保留的舊C01／C06圖檔：全部200，實際回應body與本機驗證檔逐bytes相同，附大小及SHA-256。四個日期／語言頁皆200，實際資訊列為11/10 v1.5.0、11/12 v1.0.0，原發布及修訂日期一致。另人工回讀正式英文手機風險互動／防火牆與桌面PDCA畫面。

本機截圖與機器原件保留在 `.local/*-local/`；正式站結果在 `.local/ceh-notes/`、`.local/ceh-day01-diagrams/`、`.local/ceh-c01-c05/`、`.local/ceh-c06-c16/`，重點正式英文畫面在 `.local/ceh-day01-production-view/`。長頁原生裁圖擷取曾等待未完成，改採一般視窗截圖完成重點正式畫面回讀；完整416 assertions與來源／正文／圖檔驗證均已完成。

本次完整供稿保存、雙語正文、日期重整、十三圖與互動、正式部署及公開回讀已完成。真機、完整WCAG認證、個別機構合規審查、付費ISO全文逐條審閱及學習理解仍未驗證。
