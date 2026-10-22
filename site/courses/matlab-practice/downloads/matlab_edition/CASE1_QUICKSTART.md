# 案例 1 小任務：先把三筆振動值整理好

教材 1.8 · 2026-10-22 · 建議預留 5–10 分鐘

小島創作所想整理設備感測表。先處理一個小問題：教材產生的振動值若低於設定下限，程式會如何調整？

## 觀察

 先在 Command Window 輸入  max(0.1,-0.3) ，預期得到  0.1 。這裡的  max  比較兩個數，保留較大的數。再看三筆：−0.3 → 0.1、0.1 → 0.1、4.3 → 4.3。   0.1 是合成教材設定的下限；設備警戒值須依設備規格與實際情境另訂。  

## 操作

在 MATLAB Command Window 貼上以下程式，或開啟 case1_quickstart.m 按 Run。輸出顯示在 Command Window，變數留在 Workspace。

```matlab
raw = [-0.3; 0.1; 4.3];
vibrationMmS = max(0.1, raw);
disp([raw vibrationMmS]);
```

## 預期結果與解釋

三列依序為  [-0.3 0.1] 、 [0.1 0.1] 、 [4.3 4.3] 。左欄是原值，右欄是調整後的值。分號把三筆排成一欄， max  會逐筆比較。

## 理解檢查

若原值是 0.05 與 2.0，調整後各是多少？

答案：依序是 0.1 與 2.0。小於下限才會被提高到 0.1；這一步整理數值，分類答案要在後續建立。

## 下一步

 完整程式把  raw  換成  3.2 + 1.1 .* randn(rowCount,1) ：先產生一欄亂數，乘 1.1 調整散布，再加 3.2 平移中心，最後逐筆套用下限。 rowCount = 240  代表 240 筆。圖 1-1 可用來辨認欄位；完成這個小任務後，進入八步流程，才處理特徵、訓練與測試。      圖 1-1．既有 MATLAB Online R2026b 執行截圖。每列是一筆虛構設備資料；先找 vibrationMmS 欄，再比較 temperatureC、currentA 與答案 label。畫面為先前錄製的參考執行，完整表格有 240 列、5 欄；對應完整流程第 2、3 步。  

開啟 CASE1_WORKFLOW.md，再讀 CASE1_LINE_BY_LINE.md 的逐段解說（段內逐行）。網頁圖例：https://learn.cs-kairos.com/courses/matlab-practice/case1.html#quickstart
