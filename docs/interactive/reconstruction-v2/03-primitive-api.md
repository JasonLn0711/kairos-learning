# 投影、邊界與基元 API

| 匯出 | 輸入與輸出 |
|---|---|
| projected、inverseGround | 使用 geometry.ts 的地面投影。在已知高度 z 時，令 s=X/36、d=(Y+z)/21，x=(s+d)/2、y=(s−d)/2。高度沿畫面 y 軸向上。 |
| prism | 正寬與深、非負高度；輸出四點頂面與兩個四點側面，由 polygon 封閉。 |
| frame | 點集合含輪廓、陰影、標籤極值，外加描線安全距離；回傳 Rectangle。 |
| depthOrder | 依落地 y，再依穩定 ID 排序；保留輸入陣列。 |
| clippedRoute、atLength | 使用原 boundaryAnchor 裁切頭尾，接上轉折點；按累積弧長取位置與切線角。零長度停在原位。 |
| Primitive、surfaces | 同組頂面與左右色階，線色繼承 currentColor。裝飾基元由上層命名。grid 與 marker 使用每個 Svelte instance 的穩定 ID。 |

局部原點選擇物件的落地中心，將 Task 02 G 格 (48,72) 對齊至 (0,0)，保持原有場景座標。以 viewBox 保留標籤帶；互動 hitBounds 可大於可見輪廓，連線一律裁在可見邊界。Task 04 組合這些基元；曲線若啟用應由實際 SVG 路徑取切線與弧長，折線已由純函式涵蓋。
