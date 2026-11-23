# 決策 01　先驗證一個場景，再擴充課程

**採用參考先行的重建流程。** 先前以共用模板大量產生概念頁的策略由本決策取代。學員在請求旅程第一步就能看見五個外形相似的方塊，卻很難單靠輪廓認出是哪個裝置發起請求。同一個版面已能容納四種桌面尺寸。這兩項觀察要求分開驗收版面與圖像。[比較與量測](01-reference-audit.md)

## 目前執行路徑

以下依稽核基準的路由、載入函式、Svelte import 與 snippet 插槽整理。箭頭表示資料或畫面交付方向。

~~~mermaid
flowchart TD
  N[網路課程 JSON] --> V[interactive/catalog + validate + model]
  V --> NS[server/interactive]
  NS --> R[雙語 Request Lifecycle route]
  R --> I[InteractiveLesson]
  I --> G[InteractiveStage + geometry]
  I --> S[ImmersiveShell]
  J[六章 scenes + manifest + 六份雙語課文與課綱] --> AS[server/aase-interactive + aase/validate + aase/model]
  AS --> AR[雙語 concept route]
  AS --> A[AaseAtlas]
  AR --> C[AaseConceptLearning]
  C --> L[LearningStage]
  C --> S
  L --> D[StageDiagram]
  L --> P[PolicyStage]
  L --> M[aase/simulations]
  P --> M
  S --> F[InteractiveFrame]
  A --> F
  H[InteractiveHub] --> F
~~~

InteractiveLesson 以 sceneAt、explanationAt 選出步驟與情境，再把 stage、rail、controls、reading 交給 shell。AASE 的來源交集、語系與日期篩選在 server/aase-interactive.ts 建立 entries 之前完成。兩條路徑共用外框，各自保有不同的教學模型。

| 元件或模組 | 處置 | 理由與銜接 |
|---|---|---|
| InteractiveFrame | 保留 | 雙語導覽與略過連結供課程、索引共用。 |
| ImmersiveShell | 調整 API | 讓場景狀態、進度及動作有明確的位置，保留可聚焦解說區、閱讀對話框與靜態閱讀。 |
| InteractiveLesson | 調整 API | 將現有步驟、情境與重播意圖交給型別化轉接器；保留網址及原解說。 |
| InteractiveStage | 重構視覺 | 現有地板、投影、端點與方向可沿用。將共用機箱改為可辨識的人、裝置與儲存角色。 |
| AaseConceptLearning | 調整 API | 現有概念、步驟與來源連結是轉接輸入。 |
| LearningStage | 重構視覺 | 保留計算器、輸入值及結果，讓權重與輸出的關係可見。 |
| StageDiagram | 重構視覺 | 依比較、依賴或停止條件配置元件；檢查可伸展 SVG 的形變。 |
| PolicyStage | 調整 API | 沿用政策結果與停止條件，輸出階段狀態供畫面與替代文字共讀。 |
| AaseAtlas、InteractiveHub | 保留 | 索引需要自然捲動及穩定入口。 |
| geometry.ts | 調整 API | 保留 projectIsometric、boundaryAnchor 與路徑計算，依各角色的實際外框與連接埠裁切。 |
| model、catalog、validate、aase/model、aase/validate、aase/simulations | 保留 | 以轉接方式讀取已驗證資料，保留數值、教學語意與發布邊界。 |

## 遷移順序與界線

1. 以本次截圖評選最小圖像集，再驗證投影、表面、陰影、端點與實際顯示尺寸。
2. 建立參數化圖像後才接入型別化場景。拓樸、數學、政策各用合適的視覺關係。JSON 只能提供驗證過的欄位。
3. 完成可重播、可暫停且能清理的動態後，接回桌面與行動閱讀外框。
4. 以 Request Lifecycle、Softmax、Four Gates 做垂直驗收，之後逐批採用。保留原始課文、考題、雙語網址、來源錨點、無 JS 閱讀、日期過濾、搜尋與 sitemap 邊界。
5. 延用 SvelteKit 與靜態輸出。40 個概念、120 個場景及舊 Chromium 報告提供回歸基準。後續視覺驗收須比對同尺寸畫面及真實操作。此次停在 Task 01。
