# 場景轉接器與閱讀契約

使用者已在 Task 04 確認原尺寸人物、機架與封包可辨。Task 05 將圖件接回原課程。場景輸入仍由發布目錄供應，兩個模型共用 id、renderer、caption、summary、sourceAnchors。網路場景另有 layout、camera，學習場景保留 authored kind、visual 與 demo 的區別。

~~~mermaid
flowchart LR
  A[已發布、驗證過的課程] --> B[步驟與情境]
  B --> N[networkStage]
  B --> T[teachingStage]
  N --> V[角色、埠與相機]
  V --> R[拓樸與傳輸]
  T --> M[Softmax 與容量]
  T --> G[權限關卡與證據]
  T --> D[其他教學圖家族]
  R --> H[共用外框與完整解說]
  M --> H
  G --> H
  D --> H
~~~

**問題與處置。** 起始畫面同時顯示五種設備，焦點不易辨識，因此 navigation、dns 依當步參與者取鏡，其餘共用全章座標。連線與封包都以 route 方向為準，只有原始 edges 能產生傳輸。角色由局部輪廓與連接埠提供裁切邊界。人物依附於筆電，保持原來五種網路節點。數學圖從 attentionDemo 讀同一組未四捨五入的權重及結果，關卡圖沿用 evaluateGates 的 passed/failed/skipped。矩陣、遮罩、token 等仍走各自 renderer。來源文字由 HTML 提供，SVG 的 title 與 desc 描述當步路徑。

**安全與回復。** 原 validateInteractiveLesson、validateConcepts 限制欄位、長度、路徑、雙語文字與參照。新增 renderer 僅由受限列舉選取，圖像由 Svelte 元件產生。套用新的 renderer 不更改 JSON 儲存格式。兩版本可分別從本工作區與基準 14f59dd17b7f8978452a3d026416b5092a770a45 的獨立 worktree 啟動，對同一 URL、語系與 step 擷取。回復該次轉接器與元件修改即可沿用原圖及全部資料。
