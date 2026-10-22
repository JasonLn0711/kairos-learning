# 案例 3 小任務：先看形狀，再數三位鄰居的票

教材 1.8 · 2026-10-22 · 建議預留 5–10 分鐘

小島創作所要整理圖形卡片。先比較圓形、三角形、方形的邊緣與填滿程度，再練習用相近圖片的標籤做判斷。

## 觀察

 看圖 3-1，說出哪個有曲線、哪個有三個角、哪個有四條等長邊。人看外觀辨識形狀，程式則把外觀整理成數字特徵。      圖 3-1．複習影片的形狀教學圖，由左至右為圓形、方形、三角形。觀察曲線、角與所占區域，先形成外觀判斷，再連到完整流程第 4 步的特徵。   現在假設已找到三張最近的訓練圖片，標籤依序是 circle、circle、square（圖 3-2）。先只做投票：哪個類別票數最多？      圖 3-2．三近鄰投票示意圖。圓形得到兩票、方形一票、三角形零票，因此預測為圓形。圖中順序只示範投票；實際鄰居由標準化特徵距離選出。  

## 操作

在 MATLAB Command Window 貼上以下程式，或開啟 case3_quickstart.m 按 Run。輸出顯示在 Command Window，變數留在 Workspace。

```matlab
neighborLabels = ["circle" "circle" "square"];
classNames = ["circle" "triangle" "square"];
votes = arrayfun(@(name) sum(neighborLabels == name), classNames);
[~, winner] = max(votes);
disp(classNames(winner));
```

## 預期結果與解釋

預期顯示  circle 。 votes  依 circle、triangle、square 的順序得到  [2 0 1] ； max  的第二個輸出是最多票的位置，據此取出類別。此例三票已有多數，完整函式另有平票處理。

## 理解檢查

若三位鄰居改為 triangle、square、triangle，預測為何？

答案：triangle 得兩票，因此預測 triangle。投票用的是訓練圖片的已知標籤；測試圖片的答案留到評估時核對。

## 下一步

 圖 3-3 顯示完整程式的三個特徵：前景占外接框的比例、以面積與邊界估計的圓形程度、前景占整張影像的比例。只用 Train 算平均值與標準差，再讓 Train 與 Test 使用同一尺度。接著計算距離、取三個最近的 Train 鄰居，最後才套用剛練習的投票。      圖 3-3．既有 MATLAB Online R2026b 執行截圖。三欄依序為 fillRatio、circularity、areaRatio；每列代表一張訓練圖片。這些數字是距離計算的輸入，標準化後才比較鄰近程度；對應完整流程第 4、5 步。  

開啟 CASE3_WORKFLOW.md，再讀 CASE3_LINE_BY_LINE.md 的逐段解說（段內逐行）。網頁圖例：https://learn.cs-kairos.com/courses/matlab-practice/case3.html#quickstart

## 距離概念示意

三筆單一特徵對照查詢值 0.55。

```matlab
trainFeature = [0.2; 0.6; 0.9];
queryFeature = 0.55;
distance = abs(trainFeature - queryFeature);
[~, nearest] = min(distance);
disp([distance; nearest]);
```

預期距離為 0.35、0.05、0.35，最近索引為 2。這是一近鄰概念示意；完整程式使用三個標準化特徵與三近鄰投票。模型成績另由 Test 評估。
