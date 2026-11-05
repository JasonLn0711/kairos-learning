# AASE 雙語出版與 M01-01 英文

新增英文系列、九模組及工作坊共十一個目錄／資源頁，另新增 M01-01 英文全文；49 篇中文繼續公開，英文全文目前 1／49。其他 48 個英文概念只列目錄，沒有空白正文路由。沿用 CEH 的 TeachingArticle／CourseRail 與全部欄位，未另造英文版型。

## 資料與出版

- content/aase/course.en.json 翻譯九模組及 49 個概念的標題、成果、目標、練習與驗收，逐項匹配原 stable ID 和順序。課時、深度、slug 仍由未修改的 course.json 提供；600／150 分鐘、26／20／3 分配不變。
- 教材沿 text.zh／text.en、checks[].text.zh／en、qa 使用相同資料欄位。中文版正文、檢核、答案鍵與原發布日保留；M01-01 新英譯後為 v1.0.2／revision 3／版本修訂 2026-11-05。其他 48 筆教材版本不改。
- 英文課程與逐篇 translations.en 各有 status／publishedOn 閘門，另受文章全域 status／publishedOn 約束。頁面與搜尋只投影當前語言的已公開資料；未知語言、缺正文／解析、章節形狀不一致或關係／程式碼變更皆拒絕。
- 路由、搜尋、sitemap、前後篇與語言切換共用同一 catalog。缺英文時前後篇落在英文模組錨點，中文頁不宣告不存在的英文 alternate。只有實際成對頁面顯示互相對應的語言連結。
- 工作坊 HTML 已翻譯；ZIP 內材料與參考介面仍為繁中，頁面明示。資源、ZIP、SHA256、CEH 教材正文／版本、SVG 邊界與共用樣式不改。來源與前版保存見[來源紀錄](../sources/aase/bilingual-2026-11-05/README.md)。

## 規則及本機驗證

WRITE-01–07：中英主張、條件、範例與版本一致，未將目錄翻譯當全文完成，也未編造人類審稿／試教。HTML-01–04、A11Y-01–03：原生正文與可收合答案、四尺寸重排、兩倍文字、無 JavaScript 與鍵盤語言往返。FIG-01、05–06：同一原生流程圖保留四節點順序，文字及搜尋共用資料；未新增 SVG／圖片，FIG-02–04 新資產驗收不適用。INT-01 無新互動模擬器，不將閱讀檢核當作學習完成。

176 項 Node、內容、型別（0 errors／0 warnings）、完整建置與 release 通過。真正 publication-boundary 建置驗證英文課程 draft／future、翻譯 draft／future 及文章全域 draft／future：未公開標記未進 HTML／JSON／JS／XML，關閉路由與不實 alternates；finally 復原並重建乾淨產物。新階段輸出遵循 terminal-progress，顯示開始、完成及實際耗時，保留退出碼及失敗診斷。

英文瀏覽器最終 14 項通過：十二頁的 320／390／768／1280px、100%／200% 根字級、無 JavaScript、實際正文／目錄／四解析與日期、焦點及中英往返，另驗搜尋、sitemap、48 缺稿 404／中文可讀、待發布相鄰錨點與 ZIP 位元組，並在 390／1280px 直接比對 CEH／AASE 共用欄位與計算樣式一致。完整中文 AASE 本機 65 項通過，包含本機 Streamlit 真實下載、切片、逐篇圖解及共用版型；CEH C01／C02／退役閘門 22 項通過。最後小幅驗證器拒絕未知欄位及英文 token 單位校正後，英文完整 14 項重跑通過；中文同批完整回歸通過，最終 publication-boundary 另重跑。手機及桌面第一課圖解由本次代理視覺檢視，未作真人接受主張。

程式／教材提交 19483f9、文件提交 d0e2a5567e64c134a3cfbe4d2c47b2a49ecfb8ac 已推送 origin main，推送後分歧 0 0；[Pages run 41985499208](https://github.com/JasonLn0711/kairos-learning/actions/runs/41985499208) 成功。第一批正式站英文 14 項、AASE 中文 62 項（另 3 項依遠端模式跳過本機 Streamlit）、CEH 回歸 22 項通過，含全部英文缺稿、49 篇中文正文、搜尋、日期、圖解、前後篇、ZIP 及共用版型。本機與正式結果分開保存，未覆蓋本機 JSON。

### 首頁範圍說明及重排

正式英譯一篇後，首頁原本「完整雙語教材」總述改為依課程與篇目提供語言、成對頁面才能切換，中文與英文一致。英文課程整體被閘門關閉時，首頁仍連至繁中課程並明示該語言，不宣稱有英文正文。新首頁檢查也在未修改正式站及本機重現英文 320px／200% 頁寬 337px；原因包含不換行的 Begin with M01、固定欄寬的課程列與較長文字。修正僅匹配 main.course-home：文字換行、課程列採可容納編號及箭頭的欄寬／中欄 minmax(0,1fr)，不改教材樣式。手機版將編號置於標題上方獨立一列，正文及箭頭並排，DOM 與視覺順序一致；桌面維持並排。新增中英首頁四尺寸／兩字級、課程列不重疊、鍵盤連結及無 JavaScript 檢查。首頁修正後，176 項 Node、型別（0 errors／0 warnings）、完整發布邊界／靜態 release，以及包含原英文十四項與新增首頁一項的本機 15 項通過。320px／200% 中英首頁皆回到 320px，手機截圖由本次代理檢視；首頁追加的正式發布與回讀待補。初次複測被自行啟動的診斷伺服器占用 4226 埠，停止該伺服器後再測；未將埠衝突當成產品失敗或通過。

本機日誌／JSON／截圖在 .local/aase/bilingual/。先前 CEH 中文八項窄版正文差距維持[獨立回執](2026-11-05-english-course-navigation.md)，本次未修改該正文／樣式，也未宣稱已修復。scripts/__pycache__/ 保留、不提交。

## 下一步

依相同結構續編其餘 48 篇英文，逐篇對照主張、例子、程式與檢核，通過閘門後才開放。工作坊實際 Agent 版本、帳號及權限全程驗收、真人試教、Windows／Python 3.11 及產業案例包仍分別追蹤；本次未啟動真實資料或正式多人系統。

### 部署 artifact 修正

首頁提交 0261b60／文件 0001ea4 的 Pages run 41986934035 兩次都在部署階段失敗，先前內容、單元、型別與靜態檢查皆通過。第一次 artifact 13395939415 上傳完成後，部署查到零份，稍後 API 確認存在；第二次追加 artifact 13397300134，部署查到兩份同名 github-pages 並拒絕。原 run／attempt 及本機 pages-home-*.log 保留，不把失敗當成功，也未刪除舊 artifact。

改用每個 run_attempt 的唯一名稱，upload／metadata gate／deploy 共用；新增 actions: read 與官方 github-script@v8 執行本 repo 的有界 metadata 檢查。最多六次、間隔兩秒；僅單一有效 artifact 可進入部署，錯誤、重複、過期或仍不可見就停止。未新增部署自動重試、強制發布或刪除權限。四項控制測試驗證延遲可見、保留舊 attempt、重複、API 失敗、期限及無效資料；目前 180 項 Node 與型別（0 errors／0 warnings）通過，YAML／一致命名／步驟順序另核對。這些是 helper 與設定驗證，正式新流程結果另待回讀。規則與官方來源見[發布維護契約](../publishing-security.md#pages-artifacts-per-attempt--2026-11-05)。
