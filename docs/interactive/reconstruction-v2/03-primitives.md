# Task 03　幾何基元

**PASS。** 新增 visual/shape.ts、tokens.ts、Primitive.svelte。圖元以 kind 選擇薄板、箱體、圓筒、接觸影、焦點、標籤、地格、連線或箭頭。既有課頁沿用原 renderer。fixture 位於 tests/visual-gallery，不在 src/routes、site 或課程目錄。

![一般與縮小旋轉後的基元](../../../.local/interactive-v2/task03/review.jpg)

沿用 Task 02 分支與基準。執行 node --experimental-strip-types --test tests/interactive-{geometry,visual-geometry}.test.ts，7 項通過。pnpm install --frozen-lockfile 成功。初次 fixture server 因未生成 SvelteKit 的 tsconfig 且掃描範圍過廣而失敗，執行 pnpm exec svelte-kit sync 並限定測試入口後正常。由 pnpm exec vite --config tests/visual-gallery/vite.config.ts 提供本機頁面，執行 node tests/visual-gallery/capture.mjs，兩種視窗、兩種 DPR 與一般／強制色共八組通過唯一 ID、圖框寬度與頁寬檢查。[量測紀錄](../../../.local/interactive-v2/task03/manifest.json)

逐格檢視後，箱體面與圓柱頂緣相接，兩種縮放都維持同向透視；箭尖跟隨終點，接觸影在底部。單一箭尖的縮小樣本僅作形狀檢查，實際使用由連線提供方向。P0 角色外觀、P1 數學與政策視覺依後續獨立圖集驗收。

追加回歸：pnpm run build 產出正式靜態目錄，確認請求課頁存在、build 中無 visual-gallery 路徑或測試頁標題。pnpm exec playwright test --config playwright.interactive.config.ts 完成 13/13。roundedPath 在相鄰折點預留半段距離，圓角不越過端點；加入角色邊界與圓角測試後，幾何測試共 9/9 通過，兩組圖集亦重跑通過。
