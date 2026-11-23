# 圖件與連線契約

以下為設計草案。沿用 geometry.ts 的 Point 與 Rectangle，局部座標先投影再平移縮放。既有投影為 (36(x+y),21(x−y)−z)，是本站現行選擇。鏡射或旋轉同步變換埠、物件邊界與方向，文字保持正向。

~~~ts
type Point = { x: number; y: number }
type Bounds = { left: number; top: number; right: number; bottom: number }
type Ports = Readonly<Record<string, { position: Point; outward: Point }>>
type VisualState = 'idle'|'active'|'focused'|'muted'|'warning'|'failed'|'success'|'blocked'|'processing'
type Tone = 'neutral'|'teal'|'clay'|'violet'
type GlyphProps = {
  id: string; state: VisualState; scale: number; orientation: 'left'|'right'
  label: string; ariaLabel: string; compact: boolean; tone: Tone
}
type VisualTokens = {
  surface: string; top: string; nearFace: string; farFace: string
  ink: string; outline: string; focus: string; shadow: string
}
type Geometry = { bounds: Bounds; hitBounds: Bounds; opticalCenter: Point; ports: Ports }
type Endpoint = { nodeId: string; port: string }
type Meaning = 'request'|'response'|'event'|'data'
type Connection = {
  id: string; from: Endpoint; to: Endpoint; meaning: Meaning
  direction: 'from-to'; via: readonly Point[]
  durationMs: number; holdAtEndMs: number
}
type AccessibleSummary = {
  step: string; focusedRole: string; action: string; outcome: string
  sourceAnchors: readonly string[]
}
type DefKey = { instance: string; localName: 'grid'|'arrow'|'shade' }
~~~

**埠與繪序。** G 格的建議左右埠為 (12,62)、(84,62)，實際輪廓在該高度的交點優先；向外法線分別向左、右。人形無資料埠。先畫格、影、地面路徑，再按落地 y 由小到大繪製物件，同深度用穩定 ID 破同分。封包僅於兩端裁切後的路徑上可見；標籤、焦點描線最後繪製。bounds 包括描線、陰影與標籤帶，hitBounds 可擴大。切換狀態保持同一 viewBox、光學中心與埠。鏡頭依場景與語系的安全區決定。

**語意與計時。** idle 是可用且尚未參與，muted 是當步背景，focused 表示解說正指向該角色，active 表示該段正在作用。processing 附進度或等待文字，success 附勾與結果，warning 附三角與風險原因，failed 附叉與失敗原因，blocked 附止線與上游原因。skipped 是政策計算的未執行結果，保留原字義並配 muted。鍵盤焦點另用原生 focus-visible。請求沿呼叫者到服務者，回覆反向；資料代表明確的內容搬移，事件只在步驟確有通知時使用。local 不產生跨節點封包，secure 附鎖，setup 依每段交握方向；資料庫等待固定於資料庫端，時間是教學尺度。

**安全與可讀性。** ID 由 SSR 與 hydration 一致且每個實例唯一的前綴、已驗證局部名稱組成；重複放入兩個相同場景亦須唯一。所有幾何為有限且有界數值。外部資料只供列舉、數字與經跳脫的文字；色票、marker、gradient 與 URL fragment 由 renderer 建立。currentColor 接文字或輪廓色，色面使用受限 token。forced colors 以系統前景、背景及線型保留狀態。內層裝飾對 AT 隱藏；整圖以當步標題命名、以可讀段落描述來源、去向與結果。長文字與控制保留為雙語 HTML。依 modern-web-guidance accessibility 的複雜圖描述規則，以 figure/figcaption 或 aria-describedby 串接；避免逐點報讀動畫。

**下一階段的契約測試。** 檢查輸入範圍、封閉面、埠在邊界、返程切線、同狀態中心、複製兩次的 defs、尺寸縮放與碰撞。以 320 寬、強制色、200% 字級和靜態結果核對標籤；無 JS 直接閱讀原課文與結果。形狀辨認另外以實際尺寸圖集檢視。
