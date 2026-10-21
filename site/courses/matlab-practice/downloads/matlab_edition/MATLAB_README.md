# 科技犯罪偵查特論：三個替代合成案例 MATLAB 教材包

這份教材給零資訊背景同學練習資料流程、影像處理與簡單分類。三個案例使用虛構設備感測、紙面色塊與幾何圖形，定位為正式作業前的練習素材；同學可依課程要求選擇合適方法完成作業。

助教實作方式：助教整理完整程式、依流程逐段且段內逐行的台灣繁體中文說明、分階段提示詞與檢核入口；同學須在自己的 MATLAB 環境執行程式、保存真實輸出並說明限制。

## 檔案與固定介面

- `case1_sensor_classifier_matlab.m`：虛構設備感測表格二元分類。
- `case2_image_measure_matlab.m`：紙面色塊的門檻分割、輪廓與面積換算。
- `case3_shape_classifier_matlab.m`：圓形、三角形、方形的 Train Set／Test Set 分類。
- `run_matlab_tests.m`：重跑、輸出、資料分割、Train-only 統計、影像面積與路徑檢核。
- `CASE1_LINE_BY_LINE.md`、`CASE2_LINE_BY_LINE.md`、`CASE3_LINE_BY_LINE.md`：先用 8 個步驟走完案例與作業成果整理，再依最終來源的實際流程逐段閱讀；每段先列完整程式片段，再按原始行號解說語法、變數、尺寸、輸入輸出、目的與小例子。
- `CASE1_WORKFLOW.md`、`CASE2_WORKFLOW.md`、`CASE3_WORKFLOW.md`：三份教學文件開頭使用的 8 步全程前言來源。
- `CASE1_REPORT_TEMPLATE.md`、`CASE2_REPORT_TEMPLATE.md`、`CASE3_REPORT_TEMPLATE.md`：依已核對內容整理的可編輯報告範本。
- `report_templates/*.pdf`：由上述 Markdown 產生的報告 PDF 範本。
- `MATLAB_REQUIREMENTS_MAPPING.md`：區分老師要求、已核對資料範圍與助教實作方式。
- `MATLAB_STARTER_SKELETONS.md`：三個案例的起始骨架。
- `MATLAB_STAGE_PROMPTS.md`：每階段的情境、提示詞、摘要欄位與暫測命令。

三個主函式都可直接在 Command Window 執行，也可傳入專案內的輸出資料夾。函式使用 `fileparts(mfilename('fullpath'))` 取得套件根目錄，再用 `fullfile` 組合路徑。相對輸出路徑會先接到套件根目錄，之後才做安全範圍檢查。

## 執行環境

- 設計目標為 MATLAB R2021a 或更新版本；本機 MATLAB R2026b 批次驗證已通過。
- MATLAB Online 使用服務當下提供的版本。
- 程式使用 base MATLAB，套件需求維持在 MATLAB 基本功能範圍。
- MATLAB JVM 必須啟用。程式會以 `usejava('jvm')` 檢查；JVM 關閉時回報 `Tutorial:JVMRequired`。
- 程式使用 string、table、`readtable(...,'Delimiter',',','TextType','string','VariableNamingRule','preserve')` 與 `jsonencode(...,'PrettyPrint',true)`；較舊版本可能需要調整。

參考版已在 MATLAB R2026b Linux 批次模式通過檢核；Desktop 與 Online 請在自己的環境確認。參考結果不代替自己的實際執行。

## MATLAB Desktop

1. 解壓縮教材包，保留整個 `matlab_edition` 資料夾與原有結構。
2. 在 MATLAB 的 Current Folder 切換到 `matlab_edition`。
3. 在 Command Window 依序執行：

```matlab
case1_sensor_classifier_matlab
case2_image_measure_matlab
case3_shape_classifier_matlab
run_matlab_tests
```

## MATLAB Online

將整個 `matlab_edition` 資料夾上傳到 MATLAB Drive。可以把資料夾拖到 MATLAB Online，或在 Files 面板選擇 Upload Folders。進入上傳後的 `matlab_edition` 資料夾，再執行前述四條命令。操作方式可參考 [MathWorks：Access Files in MATLAB Online](https://www.mathworks.com/help/matlab/matlab_env/access-files-in-matlab-online.html)。

若上傳 ZIP，先在 MATLAB Online 解壓縮，再把 Current Folder 切到解壓後的 `matlab_edition`。三個案例使用固定相對路徑，可直接從完整套件執行。

## 固定輸出與覆寫提醒

- 案例一輸出到 `matlab_artifacts/case1`。
- 案例二輸出到 `matlab_artifacts/case2`。
- 案例三輸出到 `matlab_artifacts/case3`。

重跑時會覆寫上述資料夾內的同名教材檔案。請勿把自己的資料放進 `matlab_artifacts`。若要保留個人實驗，可在套件內另建資料夾：

```matlab
root = fileparts(which('case1_sensor_classifier_matlab'));
case1_sensor_classifier_matlab(fullfile(root,'my_experiment','case1'));
```

輸出位置必須留在 `matlab_edition` 根目錄內。安全檢查使用 `java.io.File.getCanonicalPath`；相對路徑先依套件根目錄展開，不受 Current Folder 影響。

## 案例一：虛構設備感測分類

請先讀 `CASE1_LINE_BY_LINE.md` 開頭的 8 步全程教學，掌握從資料到正式報告的工作順序，再進入來源第 1 行開始的逐段解說。每段先放完整程式片段，再在段內逐行說明語法、變數形狀、輸入輸出與用途，最後附上可直接貼給 GPT／Claude 的提示詞。

資料欄位如下：

- `deviceID`：虛構設備識別碼，不放入模型。
- `temperatureC`：虛構攝氏溫度。
- `vibrationMmS`：虛構振動速度。
- `currentA`：虛構電流。
- `label`：`0` 代表正常，`1` 代表需檢查。

程式先依標籤分層切成 80% Train Set 與 20% Test Set，再只用 Train 計算平均值與標準差。保留測試資料專門用於最終評估。`checkProbability` 是校準前的模型估計；真實故障風險需另行評估。請同時查看混淆矩陣與需檢查類別召回率。90% 是老師設定的目標值，實際結果以 MATLAB 輸出為準。

老師要求的 PDF 內容分成「分析邏輯、特徵選取、程式碼截圖、測試結果」四節。教材另附報告範本；`.m`、CSV、JSON 與自動化檢核屬於助教實作方式。程式輸出為 `synthetic_sensor_data.csv`、`test_predictions.csv`、`summary.json`。

## 案例二：紙面色塊影像處理

請先讀 `CASE2_LINE_BY_LINE.md` 開頭的 8 步全程教學，掌握從圖片到正式報告的工作順序，再進入來源第 1 行開始的逐段解說。每段先放完整程式片段，再在段內逐行說明影像陣列、遮罩、連通元件、面積與輪廓流程，最後附上可直接貼給 GPT／Claude 的提示詞。

程式用固定 RGB 門檻分割柔和紅色色塊，自行實作四方向最大連通元件，並以純紅色標出外輪廓。比例明確設定為 `1 mm/像素`：

```text
面積（mm²）＝分割元件像素數 × (1 mm/像素)²
```

面積使用整個分割元件的像素數，輪廓線像素另列供檢查。這個比例屬於教材設定；真實相機的換算比例需另行校正。

老師要求的 PDF 內容分成「執行結果、處理程序、程式碼」三節。教材另附報告範本；`.m`、PNG、JSON 與自動化檢核屬於助教實作方式。程式輸出為 `synthetic_paper_blocks.png`、`segmentation_mask.png`、`contour_overlay.png`、`measurement.json`。

## 案例三：合成幾何圖形分類

請先讀 `CASE3_LINE_BY_LINE.md` 開頭的 8 步全程教學，掌握從 Train／Test 圖庫到成果整理的工作順序，再進入來源第 1 行開始的逐段解說。每段先放完整程式片段，再在段內逐行說明 manifest、特徵矩陣、Train-only 標準化、三近鄰與洩漏檢查，最後附上可直接貼給 GPT／Claude 的提示詞。

Train Set 與 Test Set 分開產生。標籤集中寫在 manifest；檔名與資料夾採用中性命名，所有類別使用相同尺寸、背景與前景色。產圖時以影像尺寸與完整解碼 RGB 像素建立精確簽章，排除組內及跨 Train／Test 的完全重複影像。

特徵為外接框填滿比例、近似圓形度與全圖面積比例，模型為自行實作的 3-nearest neighbors。程式設有檔名、資料夾與完全相同像素的檢查；其他合成規則捷徑仍需持續評估。本範例呈現合成幾何圖形的結果，實際照片需另行評估。

已核對的報告內容為「執行結果、處理程序、程式碼」。PDF 格式與獨立程式封裝屬助教實作方式。輸出為 `train_manifest.csv`、`test_manifest.csv`、兩組 PNG、`test_predictions.csv`、`evaluation.json`。

## 怎麼回報錯誤

請完整提供：

1. MATLAB 版本與 `ver` 輸出。
2. 執行的完整命令。
3. 錯誤識別碼、完整錯誤文字與堆疊。
4. 預期看到的結果與實際結果。
5. 程式改動狀態；若有改動，附上附近程式碼。

一般 GPT／Claude 聊天介面負責產生與說明文字。請在 MATLAB Command Window 執行暫測或 `run_matlab_tests`，再把真實輸出貼回對話協助判讀。

## 教學與使用限制

三個案例都使用合成資料，只用來練習分析流程，不用來判定真實人員、設備或證物。若要處理真實案件資料，還需要合法授權、資料治理、偏誤與錯誤成本評估、證據保全、可重現紀錄及領域專家審查。

各 `.m` 檔將主要函式放在最前面，局部函式接在後方。局部函式的 MATLAB 規則可參考 [MathWorks：Add Functions to Scripts](https://www.mathworks.com/help/matlab/matlab_prog/local-functions-in-scripts.html)。
