# 時間、情境與操作契約

~~~mermaid
stateDiagram-v2
  [*] --> Static: SSR 或 reduced motion
  Static --> Playing: 可播放的傳輸
  Playing --> Paused: 暫停或頁面隱藏
  Paused --> Playing: 繼續或恢復可見
  Playing --> Waiting: 抵達慢查詢節點
  Waiting --> Playing: 等待時間結束
  Playing --> Finished: 到達最後接收端
  Finished --> Playing: 重播
~~~

createPlayback 保存 elapsed 與前一幀時戳，motionPlan 指定 travel/hold，motionAt 提供獨立於牆鐘的取樣。seek 與 reset 清除上一個時戳；每段開始只取得一次 SVG 長度，逐幀只更新 marker。Svelte effect 取消上一段 rAF，unmount 移除 observer 與媒體、可見性事件。DNS 命中停在 browser；慢查詢在抵達 database 後等待 1100 ms，再走返程。此時間僅供教學。

?step=N 可重載與前後導覽，無效步驟顯示第一步與原因。語系切換前暫存當次接收網址及兩個情境欄位，另一語系只讀一次；一般重新載入沿用原課程預設。瀏覽器阻擋儲存時使用預設情境。控制點維持原生按鈕、選單與對話框的鍵盤行為。數學與政策控制沿用原始純函式；切換 concept/scene 的 Svelte key 重建內部輸入。

modern-web-guidance 的 motion 指引要求可見暫停控制與 reduced-motion 靜態結果。網路傳輸保留兩者；本地解析步驟只顯示本地動作，沒有跨機器封包。
