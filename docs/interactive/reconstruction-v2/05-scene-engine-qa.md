# Task 05　轉接器驗證

![上排原版，下排新場景](../../../.local/interactive-v2/task05/comparison.jpg)

**PASS。** 1440 寬同頁對照顯示，第一步由原本五個機箱改為人與筆電；Softmax 的兩個權重共用橫向比例，旁列各項加權貢獻；Four Gates 以雙線與外框指出首次失敗。排版仍支援原閱讀入口。後續檢視發現近景名稱相對過大，已在整合時縮小近景文字。

執行 node tests/visual-gallery/capture-scenes.mjs 05，以 1440×900 與 390×844 比較兩種語系、三種場景及網路變體，52 張通過文件寬度與桌面控制位置檢查。URL、步驟、UTC 時間與 SHA-256 見[逐張紀錄](../../../.local/interactive-v2/task05/scenes.json)。pnpm run check 為 0 錯誤、0 警告。node --experimental-strip-types --test tests/interactive-scene.test.ts 核對雙向路徑、視框、情境、120 個步驟的語意，以及拒收未聲明角色與無效資料。正式發布邊界交由 Task 07 的序列化 fixture 驗證。
