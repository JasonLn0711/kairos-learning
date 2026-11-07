# M01-04｜學員調查也是需求訪談 v1.1.0

[來源、前版與三張原圖](../sources/aase/m01-04/replacement-2026-11-06/README.md) · [123 段逐項採用對照](../sources/aase/m01-04/replacement-2026-11-06/source-paragraph-map.json) · [雙語正文](../../content/aase/lessons/aase-m01-c04.json) · [維護契約](../content-authoring.md#aase-m01-04-source-replacement--2026-11-06)

## 採用與版本

完整抽換供稿導言與八節，保留看診類比、三種調查方法、具體訪談問答、五步流程、四種「慢」、文件缺漏分層記錄與程式碼、功能／易用性／成效、樣本偏差、隱私界線及跨角色訪談。中英各九個主 section、兩張表、三張隨文圖；原稿三題九選項保留，答案 B／C／B。原稿貼入的進度與提交批改文字，改採原生參考答案；沒有記錄學員作答或問卷後端，qa=[]。

正式資料為 v1.1.0、revision 4、修訂日 2026-11-06；原發布及英文開放日 2026-11-05 不變。既有 ID、URL、導讀 ID、目標、合成練習及六個舊 section 錨點保留。新題意使用新 Q1–Q3，舊題保存在前版。新增工作只涵蓋這篇教材、專用圖解與驗證；工作坊 ZIP、其他課程及原 checkout 無關修改保留。

## 圖解與校對

三張參考 PNG 以受限 cards／flow 模型重製：第一張兩欄平行比較，第二張五節點／四支向下箭頭且末節橘框，第三張三列對照不同驗證證據。頁面採可搜尋語意 HTML 及容器重排；200% 文字時雙欄也可轉單欄。原稿數字、順序、原話與條件保留。第一張補明類比用途；第二張補明需求仍待確認，第三張補明功能測試通過不代表工作成效。

原 PNG 位元組保存在來源層。六個獨立 SVG 由同一正文資料生成；中文 comparison／process／evidence 為 1389／2264／1434 bytes，英文為 1919／2411／1599 bytes，均低於 100000 bytes。SVG 有 viewBox、title／desc、固定布局與跳脫文字，不進入任意 inline SVG 通道；頁面 HTML 另行重排。下載圖與搜尋、頁面共用標籤與描述，裝飾符號不承接唯一意義。

完整英文逐節對照原稿含 100／40 員工、三畫面、20 秒／三次／兩天、100／3／97 回覆及同一程式碼。正規化原稿跳脫粗體；補明 documentType／showError 的上下文與正式系統的伺服器端驗證。2026-11-06 查核 [GOV.UK 訪談](https://www.gov.uk/service-manual/user-research/using-in-depth-interviews)、[GOV.UK 易用性測試](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing)及 [OWASP 輸入驗證](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)。類比、受訪者與數字均為供稿教學情境，沒有冒稱真實調查或已驗證 AI 成效。

## 規則與驗證

WRITE-01–10：來源與前版保存、逐段採用與修正、完整英譯、原日期與版本分離。HTML-01–04、FIG-01–06：可選取文字、平行／流程／證據關係、可重排節點、同源 SVG 與受限資料。INT-01：維持原生靜態參考答案，沒有增加計算互動。A11Y-01–03：語意標題／表格、鍵盤連結與焦點、答案原生收合及正文直接可見。

本機內容通過；Svelte／TypeScript 為 0 errors、0 warnings；223 項單元通過，包括供稿對照、既有版本保全、三種圖解結構拒絕案例、固定必填程式片段及確定性 SVG。發布邊界檢查通過 draft／future 與英文課程閘門；release 與既有 30 檔工作坊校驗通過。npm audit 為 5 項既有 low、0 high／critical，未進行無關框架升版。

專用雙語瀏覽器 2 項及 M01 四篇英文回歸 4 項通過：逐節全文／表格／程式碼／題目、三圖節點及四箭頭、320／390／768／1280、200% 文字、鍵盤／焦點、局部捲動、搜尋、無 JavaScript、六圖 HTTP 200／逐位元組下載及 SVG 文字邊界。十二張手機／桌面圖與 SVG 截圖已目視核對；裝飾程式符號的換行已修正。來源 SHA-256、新文件目標與 git diff --check 通過。既有 content-authoring.md 的 QAIllustration 舊連結已失效，屬於本次範圍外的歷史段落；本次新增連結有效。最初回歸在發布邊界 fixture 尚未還原時誤跑，未作有效驗收；等邊界命令結束後重跑四篇皆通過。正式站回讀將在部署後記錄。實體裝置、完整螢幕閱讀器及獨立學員理解另待真人驗收。AI 協助編輯、英譯與工具檢查，來源保存不代表學習完成。

## 發布

來源 892fa6f、教材 cf68c60、驗證 7d8d8c1 已分開提交並推送 main，fetch 後 divergence 為 0 0，沿用既有 GitHub Pages。本次開始時 3a5209a／42234691476 為已知成功部署；f443c0e／42236969555 的兩次 Pages 同步逾時留在原[診斷紀錄](2026-11-06-aase-m01-03-replacement.md#pages-同步診斷2026-11-06)，2026-11-06 再讀 Actions 時該工作已成功，顯示舊阻塞已解除；本次仍須核對自己的部署與頁面結果。

## 所有權與下一關

稀缺資源是讀者注意力與可追溯驗證證據；完整來源、正文、圖解與執行結果由 kairos-learning 擁有。Planning 僅需定位、發布狀態、容量及下一關，容量維持 Unknown，不新增學員工時或完成紀錄。教材發布驗證完成後，下一關是讀者以三題及一份需求線索紀錄檢查理解；真人訪談與實際成效另行驗證。

本機執行日誌與截圖保存在發布 worktree 的 `.local/aase/m0104/`；完成後另複製到原 checkout 的忽略目錄 `.local/aase/m0104-replacement-2026-11-06/`，供後續追溯。

## 首次部署與重跑

[Pages 42241488413](https://github.com/JasonLn0711/kairos-learning/actions/runs/42241488413) attempt 1 的內容、223 項單元、型別、發布邊界、release 與下載校驗全部通過，上傳成功；部署於 2026-11-06 15:17:54–15:27:59 UTC 執行，停在 updating_pages，十分鐘後回報 Timeout reached, aborting! 並取消該次部署。工作已確認 completed／failure 後才啟動 attempt 2，沒有中斷仍在運行的工作。

等候時瀏覽器回讀 HTTP 200，正式頁仍為 v1.0.2、新圖數量為 0；urllib 回讀收到 HTTP 403，未作成功證據。正式雙語全文與六圖仍待 attempt 2 部署後驗證。既有本機結果保存於原 checkout 的 `.local/aase/m0104-replacement-2026-11-06/local-browser/`；本次未以 Git 推送或本機通過代替正式部署完成。

## 正式發布完成

42241488413 attempt 2 於建立部署後收到 Deployment cancelled，確認終止後，以目前 main 的新提交 0294765 啟動 [Pages 42243815161](https://github.com/JasonLn0711/kairos-learning/actions/runs/42243815161)，已成功部署。新提交僅補充驗證與回執，教材與原驗證版本相同。前兩次失敗保留作為發布歷史，不推斷平台內部根因。

正式站 `AASE_BASE_URL=https://learn.cs-kairos.com npx playwright test --config playwright.aase-m0104.config.ts` 兩語 2 項全部通過（19.0 秒）：v1.1.0、九個 section 的全文與表格／程式碼、三題九選項、三張圖的節點與箭頭、四尺寸／200% 文字、鍵盤與焦點、無 JavaScript、全文及圖解搜尋文字、六個 SVG HTTP 200／逐位元組一致與文字邊界。來源原稿、三張 PNG 與舊版已保存，123 段對照與雙語內容完整性另經本機核對；本次請求的教材抽換與正式發布完成。

[中文正式頁](https://learn.cs-kairos.com/courses/aase/v1/m01/concepts/m01-04/) · [英文正式頁](https://learn.cs-kairos.com/en/courses/aase/v1/m01/concepts/m01-04/)。正式截圖與測試結果保存在原 checkout `.local/aase/m0104-replacement-2026-11-06/production-browser/`，執行日誌為同目錄 `aase-m0104-production.log`。真人訪談、獨立理解與實體裝置驗收維持未評估。
