# 可重用圖件清單

先用請求旅程驗證可辨識的角色與有方向的傳輸，再讓數學與政策圖共用文字、狀態和閱讀外框。各項幾何數字是本站的**設計目標**。實測參考值另見 [Task 01](01-reference-audit.md)。下表與 [型別契約](02-component-contracts.md)、[逐步消費者](02-scene-to-asset-map.md) 以 visualId 對讀。

## P0 首個切片

來源欄分列外站與本站。A5、B1、B5 指分鏡中的公開截圖，C 指本站請求旅程。「提案」表示原創形狀；顏色、接點與尺寸均待 gallery 證實。外形的觀察可信度高，內部製作方式未知。G 表示 96×96 本機座標格，中心 (48,48)、落地點 (48,72)，標籤置於底緣外；尺寸為最小建議 CSS px。各列繼承契約中的主題、a11y 與測試規則。

| visualId／層級 | 意義與首用步驟 | 外站觀測 | 本站既有 | 幾何、層次、色面 | 尺寸、接點與動態 | props／狀態／窄版驗收 |
|---|---|---|---|---|---|---|
| IsoTile／基元 | C1 裝置底座 | B1 斜板 | base-top | 菱形頂面＋薄側緣，陰影之上 | G、32，底面四角，靜止 | 寬深高；縮小仍能辨底緣 |
| IsoBox／基元 | C3 代理機箱 | B5 藍色設備 | entity 三面 | 封閉頂、左、右面，三階明度 | G、24，上錨點接設備記號 | 尺寸、tone；檢查三面共邊 |
| IsoCylinder／基元 | C8 儲存 | A5 圓柱 | C 只有頂部符號 | 橢圓頂與連續側壁 | G、24，側壁兩端接頂緣 | 半徑、高；檢查縮小時接縫 |
| ContactShadow／基元 | C1 落地 | B1 板下接觸陰影 | shadow path | 扁橢圓，最底、低對比 | G、24，跟隨落地點 | 尺寸；forced colors 可隱藏 |
| ConnectorPath／基元 | C2 往返 | A5 地面折線 | geometry.edgePath | 地表上、角色下；路徑受端點裁切 | 場景 bounds，路徑長度附著封包 | ports、折點；返程不穿機箱 |
| Arrowhead／基元 | C2 接收方 | 方向細節未量測 | SVG marker | 深色實心箭尖 | 10×10，中心(5,5)，尖端對準終點 | 切線角；短邊仍朝接收方 |
| GroundGrid／基元 | C1 投影方向 | B1 淺斜格 | grid-line | 重複斜線，位於陰影下 | 48×24 單元，原點對地面 | 密度、tone；窄版可簡化 |
| FocusMarker／基元 | C1 當步焦點 | A5 角色框 | focus-outline | 地面雙線或虛線，與文字同步 | G、32，包住底座 | focused/active；灰階仍可識別 |
| LabelFrame／基元 | C1 角色名稱 | B1 裝置外標籤 | entity-label | 留白文字框，置最上層 | 依文字 bounds，中心對角色，預留底帶 | label、compact；長字改 HTML 換行 |
| BrowserDevice／圖件 | C1 發起端 | B1 螢幕與鍵盤 | browser 機箱 | 直立屏、薄底座、斜鍵盤 | G、48，機座左右埠；焦點附於屏 | GlyphProps；窄版保留屏與鍵盤 |
| UserFigure／圖件 | C1 按 Enter 的人 | A5 人群；B1 只有裝置 | 課文描述使用者 | 頭身、手腳，附在客戶端旁 | G、24，腳底錨；不參與網路連線 | GlyphProps；以輪廓辨認人 |
| ServerRack／圖件 | C3 edge、C6 app | B5 設備、A5 伺服器 | edge/app 共用機箱 | 機架正面槽與燈，端點標記區別代理與應用 | G、40，機箱兩側埠 | role=edge/app；縮小保留角色標記 |
| DNSResolver／圖件 | C2 位址查詢 | B5 黃色解析器 | dns | 機箱頂部名稱查詢紋章 | G、40，兩側查詢／回覆埠 | role=dns；以圖案與文字辨識 |
| DatabaseCylinder／圖件 | C8 查詢及回傳 | A5/B5 圓柱 | database 機箱 | 疊層筒壁、橢圓頂；陰影貼底 | G、40，側緣埠 | role=database；等待有文字狀態 |
| NetworkEdge／圖件 | C2 有向關係 | A5 多條複寫線 | idle/active-link | 組合線與箭頭，背景虛線、當步實線 | 隨場景 bounds；沿長度取樣 | Connection；端點順序見逐步表 |
| PacketGlyph／圖件 | C2 查詢與回覆 | A5-motion5 傳輸點 | 菱形、鎖形與 halo | 封套／回覆缺口／資料雙片／事件脈衝 | 24×24，中心(12,12)沿線；最小12 | meaning、進度；停動畫改靜態結果 |
| LockBadge／圖件 | C4 TLS | 外形提案 | lock-shackle | 鎖梁與鎖體疊於安全交換標記 | 24×24、中心(12,12)，最小14 | secure；保持「交握」文字 |

## 第二組與延後項目

| visualId／層級 | 證據與用途 | 契約與驗收 |
|---|---|---|
| WeightBar、MatrixCell／P1 圖件 | E2–3 現有數值與長條；注意力矩陣見 StageDiagram | 共用零點與上限，值域驗證；以文字讀出欄、列、權重及貢獻 |
| GateMark、TrustBoundary／P1 圖件 | F2 四段判定與信任邊界課 | passed/failed/skipped 各有形狀與文字；停止後不繪製成功執行 |
| Document、Cache、Worker、Tool／P1 圖件 | 本站 document-retrieval、kv-cache、工作流與工具課；外形提案 | 分別用頁片、重用格、處理站及工具埠。傳入 label、state；窄版逐列讀取 |
| LoadBalancer、Queue、CDN／P1 候選 | 較後期網路課可用；目前十步沒有這三種獨立角色 | 待課文授予分派、排隊或邊緣快取語意再加入 registry |
| 特殊平台商標、多機櫃機房／P2 | 尚無具體消費者或截圖依據 | 延後；不得從外站複製資產 |
| RequestLifecycleScene、ReplicationScene／場景 | C 十步為首用；A 僅作比較素材 | 依步驟決定可見角色、焦點、路徑及等待 |
| AttentionMatrixScene、ContextBudgetScene、TrustBoundaryScene、FourGatesScene／場景 | M02 authored kinds 與 demos | 計算結果或條件改變後重畫對應資料；參閱逐章表 |
| ImmersiveShell、step rail、stage、explanation、timeline、playback、source reader、responsive drawer／介面 | A/B 時間線與窄版導覽，C/E/F 外框、按鈕及閱讀框；drawer 為可選設計 | 負責導覽、焦點、捲動與控制；保持 DOM 閱讀順序及來源入口 |

基元不自行判斷課程步驟；圖件組合基元表達角色；場景持有步驟與資料；介面負責操作。PlatformTile 可組合 IsoTile 與 ContactShadow；RoleLabel 包裝 LabelFrame；ConnectionArrow 由 NetworkEdge 消費 Arrowhead。三者均沿用對應契約。
