# 案例一 PDF 報告範本：虛構設備感測分類

> 老師要求的 PDF 內容為「分析邏輯、特徵選取、程式碼截圖、測試結果」。這份範本、獨立 `.m`、CSV、JSON 與自動化檢核屬助教實作方式。請以本人 MATLAB 實際輸出完成內容。

## 一、分析邏輯

1. 說明虛構設備感測資料的情境與二元標籤。
2. 說明 80% Train Set、20% Test Set 的分層切分。
3. 說明平均值與標準差只由 Train Set 計算。
4. 說明模型訓練、逐筆預測、混淆矩陣與正類召回率。
5. 記錄固定亂數種子與 MATLAB 版本。

可填內容：

```text
資料筆數：
Train Set 筆數：
Test Set 筆數：
亂數種子：
分析流程摘要：
```

## 二、特徵選取

| 特徵 | 單位 | 選用理由 | 教材限制 |
| --- | --- | --- | --- |
| `temperatureC` | °C |  | 虛構合成值 |
| `vibrationMmS` | mm/s |  | 虛構合成值 |
| `currentA` | A |  | 虛構合成值 |

`deviceID` 是識別欄，`label` 是答案欄，兩者均從模型輸入特徵中分開處理。

## 三、程式碼截圖

請貼入本人實際執行版本的程式碼截圖，至少涵蓋：

1. 80/20 分層切分。
2. Train-only 平均值與標準差。
3. 模型訓練與預測。
4. 混淆矩陣、accuracy、positive recall。
5. 輸出 CSV 與 JSON。

## 四、測試結果

請貼入 MATLAB Command Window、`summary.json` 與 `test_predictions.csv` 的實際結果。

```text
Accuracy：
Positive Recall：
Confusion Matrix：
Train/Test ID 交集：
重跑一致性：
```

90% 是題目目標值。請直接說明本次實際結果、混淆矩陣與可能限制。
