# Task 08　互動課架構

~~~mermaid
flowchart TD
  N[十步網路教材與變體] --> A[networkStage]
  A --> S[InteractiveStage]
  S --> G[共用角色圖形、連接埠與路徑]
  P[播放與暫停時鐘] --> S
  C[六章四十單元與來源錨點] --> T[teachingStage]
  T --> L[LearningStage]
  L --> M[attentionDemo 與容量計算]
  L --> F[PolicyStage 與 evaluateGates]
  L --> D[StageDiagram 與教材圖形]
  G --> H[雙語外框與步驟控制]
  M --> H
  F --> H
  D --> H
~~~

網路與概念課仍使用各自的教材驗證器、原始雙語資料及 canonical 來源。renderer 由驗證後的列舉值決定。兩個畫面尺寸共用步驟、拓樸及變體，鏡頭依參與者取景。時鐘負責播放、暫停、重播及頁面可見性。減少動態時直接顯示狀態。

舊網路角色的頁內繪圖由共用 SVG 元件取代，避免展示頁和正式步驟出現兩套輪廓。舊全景起始取景改用參與者近景。數學與政策保留專用計算器，其他教材繼續使用既有視覺家族。下一批比較、來源與稽核版型仍在獨立候選預覽。

靜態 HTML 保留步驟標題、解說、來源與瀏覽連結。SVG 以 title 與 desc 標示圖意，進度、數值及政策結果另以文字揭示。按鍵可切換步驟並操作原生控制項。切換語言保留對應步驟，一次性的本機狀態只供配對導覽使用。

[場景轉接器](05-scene-engine-architecture.md) · [時鐘與測試](06-motion-qa.md) · [外框](07-shell-layout.md) · [逐單元紀錄](08-forty-unit-rollout-matrix.md)
