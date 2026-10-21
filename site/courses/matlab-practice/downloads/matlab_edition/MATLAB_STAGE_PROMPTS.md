# MATLAB 分階段提示詞與暫測

每次把目前完整的 `.m` 檔和一個階段提示詞貼給 GPT／Claude。請模型只修改指定區塊、保留既有函式名稱，並把新增的局部函式放在主要函式之後。完成一個階段後，請在 MATLAB Desktop 或 MATLAB Online 的 Command Window 執行暫測命令，再把真實輸出貼回對話。

所有階段統一採這個輸出格式：每段先說目的，列出完整程式區塊與原始行號範圍，再逐行解釋符號、參數、資料尺寸與用途。程式更新後，請依最終來源重新核對分段與原始行號。

## 案例一

### 階段一：合成、寫入與讀回資料

目標：建立五欄虛構感測 table，寫成 CSV 後用 `readtable` 讀回。

提示詞：

> 延續案例一骨架。請在主函式加入固定 `rng(20261021,'twister')`，產生 240 筆 `deviceID, temperatureC, vibrationMmS, currentA, label`，寫到專案內 `synthetic_sensor_data.csv` 並讀回；新增 `ensureSafeOutput` 局部函式放在檔案末端。資料請限定為本案例的虛構設備感測資料，程式使用 base MATLAB。每個含程式內容的行加台灣繁體中文行尾註解。

本階段必要摘要欄位：`outputDir, rowCount`。

暫測：執行 `s = case1_sensor_classifier_matlab;`，再確認 `isfile(fullfile(s.outputDir,'synthetic_sensor_data.csv'))`。本階段摘要需暫時保留 `outputDir` 與 `rowCount`。

### 階段二：分層切分與 Train-only 標準化

目標：新增 `stratifiedSplit`，先切分再只用 Train 計算 `means` 與 `scales`。

提示詞：

> 保留階段一。新增局部函式 `stratifiedSplit(labels,testRatio,seed)`；在主函式用 20% 分層保留測試，形成 80% Train Set 與 20% Test Set，保存 `trainRatio, testRatio, trainIDs, testIDs, standardizerMeans, standardizerScales`。請先完成資料切分，再只用 Train Set 估計前處理參數；分層切分請以 base MATLAB 自行實作。

本階段必要摘要欄位：保留 `outputDir, rowCount`，新增 `trainCount, testCount, trainRatio, testRatio, trainIDs, testIDs, standardizerMeans, standardizerScales`。

暫測：執行 `s = case1_sensor_classifier_matlab;`，再執行 `intersect(string(s.trainIDs),string(s.testIDs))`；應為空。

### 階段三：簡單分類與混淆矩陣

目標：加入自行實作羅吉斯分類器、機率、逐筆預測與二乘二混淆矩陣。

提示詞：

> 保留前兩階段。新增 `trainLogistic`、`predictProbability`、`binaryConfusion`；只用 Train 訓練，Test 專門用於評估。摘要保存混淆矩陣、accuracy、positiveRecall，並註明機率是校準前模型估計，真實風險需另行評估。

本階段必要摘要欄位：保留前兩階段欄位，新增 `confusionMatrix, accuracy, positiveRecall, probabilityNote`。

暫測：執行 `s = case1_sensor_classifier_matlab; disp(s.confusionMatrix); disp(s.positiveRecall);`，確認矩陣總和等於 `s.testCount`。

### 階段四：固定輸出與錯誤處理

目標：輸出逐筆 CSV、JSON，保留安全路徑與可辨識錯誤。

提示詞：

> 將案例一整理為最終 `case1_sensor_classifier_matlab.m` 介面。輸出 `synthetic_sensor_data.csv`、`test_predictions.csv`、`summary.json`；新增 `writeJson`。請保留現有資料，並以 `Tutorial:UnsafeOutput` 阻擋專案外路徑。

本階段必要摘要欄位：保留前三階段全部欄位，並將同一份摘要寫入 `summary.json`。

暫測：重新執行兩次 `case1_sensor_classifier_matlab`；固定種子摘要應一致。

## 案例二

### 階段一：合成紙面影像

目標：以矩陣、`meshgrid`、`inpolygon` 建立米白背景、紅色不規則色塊與藍色干擾塊。

提示詞：

> 延續案例二骨架。只用 base MATLAB 建立 320×240 RGB PNG；新增 `paintMask` 與 `ensureSafeOutput` 局部函式。輸出固定為 `synthetic_paper_blocks.png`。每個含程式內容的行加繁中行尾註解。

本階段必要摘要欄位：`outputDir`。

暫測：執行 `s = case2_image_measure_matlab; size(imread(fullfile(s.outputDir,'synthetic_paper_blocks.png')))`，應為 `240 320 3`；本階段暫時在摘要保留 `outputDir`。

### 階段二：門檻與最大連通元件

目標：以紅色通道至少 170、紅色優勢至少 55 分割，並自行實作四方向連通搜尋。

提示詞：

> 保留階段一。新增 base MATLAB 局部函式 `largestComponent(mask)`，自行完成最大連通元件搜尋。空分割以 `Tutorial:EmptySegmentation` 停止。摘要暫存 `pixelArea`。

本階段必要摘要欄位：保留 `outputDir`，新增 `redThreshold, dominanceMargin, pixelArea`。

暫測：執行 `s = case2_image_measure_matlab; assert(s.pixelArea > 0);`。

### 階段三：輪廓與比例換算

目標：自行抽取四方向輪廓，以整個元件像素數換算平方毫米。

提示詞：

> 新增 `contourPixels(component)`。設定 `pixelSizeMm=1.0`，計算 `areaSquareMm=pixelArea*pixelSizeMm^2`。分開保存 `contourPixelCount`；面積請使用原始分割元件的像素數，並在疊圖用 `[255 0 0]` 純紅色標出外輪廓。

本階段必要摘要欄位：保留前兩階段欄位，新增 `pixelSizeMm, contourPixelCount, areaSquareMm, areaNote`。

暫測：執行 `s = case2_image_measure_matlab; assert(s.pixelSizeMm==1.0); assert(s.contourPixelCount < s.pixelArea); assert(abs(s.areaSquareMm-s.pixelArea)<1e-10);`。

### 階段四：影像與 JSON 產物

目標：保存遮罩、輪廓疊圖與可稽核參數。

提示詞：

> 完成最終案例二介面，輸出原圖、`segmentation_mask.png`、`contour_overlay.png`、`measurement.json`；新增 `writeJson`。採影像處理流程完成本案例。

本階段必要摘要欄位：保留前三階段全部欄位，新增 `conversionFormula`，並寫入 `measurement.json`。

暫測：重跑兩次並比較 `pixelArea`；固定合成結果應一致。

## 案例三

### 階段一：建立中性路徑圖庫

目標：先洗牌標籤，再分配中性流水檔名；Train 與 Test 使用不同固定種子。

提示詞：

> 延續案例三骨架。新增 `buildSplit`、`drawShape`、`polygonPoints`、`pixelSignature`、`ensureSafeOutput`。所有類別使用同尺寸、背景、前景；影像放在 `images/train` 與 `images/test`，標籤集中寫在 manifest。共享精確像素簽章集合，重複就重畫，最多 50 次。主函式在本階段建立、寫入並讀回兩份 manifest；讀取 CSV 時明確指定 `'Delimiter',','`、`'TextType','string'`、`'VariableNamingRule','preserve'`，讓路徑中的斜線保持為欄位內容。回傳下列必要摘要欄位；特徵與模型函式將在後續階段加入。

本階段必要摘要欄位：`outputDir, seedTrain, seedTest, labels, trainCount, testCount, trainUniquePixelCount, testUniquePixelCount, trainTestPixelOverlap`。

暫測：執行 `s = case3_shape_classifier_matlab; assert(s.trainCount==108); assert(s.testCount==45); assert(s.trainUniquePixelCount==s.trainCount); assert(s.testUniquePixelCount==s.testCount); assert(isempty(s.trainTestPixelOverlap));`。

### 階段二：讀圖與特徵

目標：從實際 PNG 抽取 `fillRatio, circularity, areaRatio`。

提示詞：

> 保留階段一。新增 `resolvePaths` 與 `extractFeatures`；以前景平均亮度小於 128 判定圖形，自行計算四方向邊界長度。缺圖與空前景須有固定錯誤識別碼。主函式抽取 Train 與 Test 特徵，模型訓練安排在下一階段。

本階段必要摘要欄位：保留階段一欄位，新增 `features, featurePreview`；`featurePreview` 保存前三筆實際 Train 特徵。

暫測：執行 `s = case3_shape_classifier_matlab; disp(s.features); disp(s.featurePreview); assert(all(isfinite(s.featurePreview),'all'));`。本階段直接檢查已產生的特徵摘要；`evaluation.json` 將在第四階段建立。

### 階段三：Train-only 前處理與三近鄰

目標：只用 Train 特徵擬合標準化，Test 只做獨立評估。

提示詞：

> 新增自行實作的 `predictKnn` 與 `multiclassConfusion`。摘要保存 Train 平均值、標準差、混淆矩陣與 accuracy。平手時依標籤文字固定排序。

本階段必要摘要欄位：保留前兩階段欄位，新增 `standardizerMeans, standardizerScales, confusionMatrix, accuracy`。

暫測：執行 `s = case3_shape_classifier_matlab; assert(sum(s.confusionMatrix,'all')==s.testCount);`。

### 階段四：洩漏檢查、輸出與限制

目標：從實際 manifest 與 PNG 重算路徑和像素交集，保存逐張預測與限制。

提示詞：

> 完成最終案例三介面。路徑或像素交集包含項目時停止；輸出兩份 manifest、影像、`test_predictions.csv`、`evaluation.json`。限制必須寫明：本範例呈現合成簡單圖形的結果，真實照片與其他合成規則捷徑需另行評估。

本階段必要摘要欄位：保留前三階段全部欄位，新增 `trainTestPathOverlap, limitation`，並寫入 `evaluation.json`。

暫測：執行 `run_matlab_tests`；以 MATLAB 實際輸出作為執行依據。
