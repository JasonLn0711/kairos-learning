# Task 04　角色圖集

**PASS。使用者已檢視原尺寸場景並確認「三者都能辨認」。** 同一個 Svelte RoleGlyph 以 registry 的型別化 role 選擇組件；scale、orientation、compact、tone、state 與可選的可讀名稱控制呈現。角色局部座標原點為落地點，封包原點為路徑取樣點。內層基元繼承 currentColor，外層整圖提供描述。每種語意角色可各自使用，也可由場景層統一命名。

![人物、機架、筆電、封包與相鄰節點](../../../.local/interactive-v2/task04/review.jpg)

| 圖件 | 與 Task 01 的結構對照與決定 |
|---|---|
| person | A5 的頭身比例與地面錨點在窄版仍可辨識。本站加手腳與褲腳留白；姿勢屬原創。 |
| browser | B1 以立起的屏與斜鍵盤辨識，本站加薄板與兩行頁面內容。 |
| dns、edge、app | B5 可見名稱解析與服務端；本站用球面經緯、代理方向與機架槽分工。edge 為反向代理。LoadBalancer 留待確有分流角色的課程。 |
| database | A5 圓柱與側壁可辨；本站以兩道疊層線與側燈表達儲存。 |
| request、response、data、event、secure | 封套、回覆箭頭、重疊資料、事件脈衝及鎖頭各有結構差異。縮圖難以顯示文字，應由場景描述補足。 |
| 連線、平台與標籤 | Primitive 的 connector、tile、label 分別支援箭尖、接觸面與文字。可換行的名稱由外層 HTML 承接。 |

各角色的最終畫風為本站選擇。精確外站投影與人類辨識率仍未知。實際檢視混合情境中的人、筆電、機架、封套及接線，縮小後仍能以外形區別。[原始參考對照](../../../.local/interactive-v2/task02/network.jpg)

以 node tests/visual-gallery/capture.mjs glyphs 擷取 Chromium 1280×720 與 390×844、DPR 1/2、一般／強制色；DPR 2 另設 200% 根字級。八組頁面皆通過零水平溢位、圖形寬度與唯一 ID 檢查。每個角色另存一般色雙尺寸裁圖。[量測與時間](../../../.local/interactive-v2/task04/manifest.json)


![參考截圖及對應原創圖件](../../../.local/interactive-v2/task04/reference-comparison.jpg)

使用者人工檢視點是原尺寸圖集右下角的完整情境。工程檢查已另驗證 11 種角色的 state、SVG 邊界、名稱及重複實例。執行 node --experimental-strip-types --test tests/interactive-{geometry,visual-geometry}.test.ts，8 項通過；pnpm run check 初次檢查為 0 errors、0 warnings。圖集可供獨立審查。依 Task 04 要求，真人對辨識度的判定與自動量測分列。
