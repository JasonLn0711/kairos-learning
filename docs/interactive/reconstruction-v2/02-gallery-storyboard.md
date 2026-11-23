# 圖集分鏡與交付紀錄

![同尺寸網路場景的六張裁圖](../../../.local/interactive-v2/task02/network.jpg)

上排依序為 B1 筆電、B5 服務與資料庫、A5 人與複本；下排為 C1、C2 快取命中、C8 慢查詢。參考人形取自 A，本站 C 的人形屬後續原創提案。兩種設備在 B5 由輪廓與頂面圖案辨識。可用相同投影驗證本站筆電、機架及圓柱的外形辨識率。

![數學與關卡各三步](../../../.local/interactive-v2/task02/teaching.jpg)

上排依序為 E1–3，下排為 F1–3。本站原創分鏡草圖如下，實際數字與狀態應由既有模擬提供。

~~~text
網路    人＋筆電 ──查詢──▶ 解析器     筆電 ◀──位址── 解析器
數學    A  ███████░░░ × 2 ─┐
        B  ███░░░░░░░ × 6 ─┴─ 加權值
政策    ✓ 格式 ── × 授權 ┄┄ 未執行 ┄┄ 未驗收
~~~

~~~mermaid
flowchart LR
  P[投影、埠、面與陰影 P0] --> G[人、筆電、機架、解析器、圓柱 P0]
  P --> E[連線、箭頭、訊息 P0]
  G --> N[請求旅程]
  E --> N
  L[標籤、狀態與焦點 P0] --> N
  L --> W[權重長條 P1]
  L --> K[關卡與證據 P1]
  W --> M[Softmax]
  K --> F[Four Gates]
  N --> S[共用外框、導覽與閱讀]
  M --> S
  F --> S
~~~

**證據與範圍。** 分支 audit/reconstruction-v2-task01，基準 14f59dd17b7f8978452a3d026416b5092a770a45。本階段新增四份 02 文件與本機裁圖，沿用 [Task 01 的六頁來源與量測](01-reference-audit.md)。擷取者為 Task 01；本次重讀 PNG、依 DOM 實測框裁圖並逐張檢視拼圖。[逐圖 URL、UTC 時間、原圖 SHA-256、裁圖範圍與雜湊](../../../.local/interactive-v2/task02/provenance.json)

**實測。** 在 .local/interactive-v2/task02 執行 python3 sheets.py，12 筆原圖驗證通過，產生兩張 3×2 拼圖。逐章比對 manifest.slugs 與章節 JSON 的實際順序，40 列、120 個步驟。rust-anything analyze src/lib/interactive --json 產出候選順序 catalog.ts、aase/、validate.ts、geometry.ts、model.ts。幾何是本案最相關的純計算候選；UI 保留 Svelte，分析本身不證明 Rust 可加速。modern-web-guidance 的 accessibility 指引已用於複雜圖描述契約。

**Task 02 PASS。** [清單](02-asset-inventory.md) 的每項 P0 有角色、首用步驟、外形、尺寸與窄版測試；[契約](02-component-contracts.md) 指定局部座標、狀態、方向、主題與安全規則；[課程表](02-scene-to-asset-map.md) 涵蓋來源與替換條件。實際圖件、最小尺寸可辨讀性、跨瀏覽器結果留待實作階段。本階段只寫規格，未運行發布 fixture。
