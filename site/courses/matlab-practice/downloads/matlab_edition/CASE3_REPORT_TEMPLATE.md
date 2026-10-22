# 案例三報告範本：合成幾何圖形分類

教材 1.8 · 2026-10-22

> 已核對的報告內容為「執行結果、處理程序、程式碼」。PDF 格式、這份範本、獨立 `.m`、manifest、PNG、JSON 與自動化檢核屬助教實作方式。請以本人 MATLAB 實際輸出完成內容。

## 一、執行結果

請放入下列實際結果：

1. Train Set 與 Test Set 的影像數量。
2. `test_predictions.csv` 的預測摘要。
3. 三類別混淆矩陣與 accuracy。
4. Train/Test 路徑與完整像素簽章交集檢查。

```text
Train Set：
Test Set：
Accuracy：
Confusion Matrix：
Path Overlap：
Pixel Overlap：
```

## 二、處理程序

1. 分別建立 Train Set 與 Test Set。
2. 以中性檔名保存 PNG，標籤集中寫入 manifest。
3. 從實際 PNG 抽取填滿比例、近似圓形度與面積比例。
4. 只用 Train Set 計算標準化參數。
5. 訓練三近鄰模型並在獨立 Test Set 評估。
6. 核對路徑交集、組內像素唯一性與跨組像素交集。

## 三、程式碼

請整理本人實際執行版本的程式碼。可直接貼上程式碼；若採截圖呈現，請確保文字清楚。內容至少涵蓋：

1. Train/Test 圖庫建立或讀取。
2. manifest 與中性路徑。
3. 特徵抽取。
4. Train-only 標準化與三近鄰預測。
5. 混淆矩陣與洩漏檢核。

本範例呈現合成幾何圖形的結果；真實照片與其他合成規則捷徑需另行評估。
