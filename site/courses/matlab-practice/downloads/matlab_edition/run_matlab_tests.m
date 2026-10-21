function results = run_matlab_tests() % 定義 MATLAB 版完整檢核入口並回傳結果結構。
projectRoot = fileparts(mfilename('fullpath')); % 以測試檔所在資料夾作為固定根目錄。
case1Dir = fullfile(projectRoot,'matlab_artifacts','case1'); % 指定案例一教材輸出資料夾。
case2Dir = fullfile(projectRoot,'matlab_artifacts','case2'); % 指定案例二教材輸出資料夾。
case3Dir = fullfile(projectRoot,'matlab_artifacts','case3'); % 指定案例三教材輸出資料夾。
firstCase1 = case1_sensor_classifier_matlab(case1Dir); % 第一次執行案例一並取得摘要。
secondCase1 = case1_sensor_classifier_matlab(case1Dir); % 在同一資料夾重跑案例一。
assert(strcmp(char(firstCase1.outputDir),case1Dir),'案例一摘要的 outputDir 需與實際輸出位置一致。'); % 驗證文件第一階段使用的 outputDir 欄位。
assert(firstCase1.accuracy == secondCase1.accuracy,'案例一重跑正確率需維持一致。'); % 確認固定種子重跑結果一致。
assert(isfile(fullfile(case1Dir,'synthetic_sensor_data.csv')),'案例一資料 CSV 需成功建立。'); % 確認案例一資料產物存在。
assert(isfile(fullfile(case1Dir,'test_predictions.csv')),'案例一預測 CSV 需成功建立。'); % 確認案例一預測產物存在。
sensorTable = readtable(fullfile(case1Dir,'synthetic_sensor_data.csv'),'TextType','string'); % 直接讀取實際案例一 CSV。
trainMask = ismember(sensorTable.deviceID,string(firstCase1.trainIDs)); % 依摘要中的 Train ID 重建實際訓練資料。
testMask = ismember(sensorTable.deviceID,string(firstCase1.testIDs)); % 依摘要中的 Test ID 重建實際測試資料。
assert(~any(trainMask & testMask),'案例一 Train 與 Test ID 需維持零交集。'); % 確認資料分割維持零交集。
assert(nnz(trainMask) == firstCase1.trainCount,'案例一實際 Train 列數需與摘要一致。'); % 核對匯出資料重建後的 Train 筆數。
assert(nnz(testMask) == firstCase1.testCount,'案例一實際 Test 列數需與摘要一致。'); % 核對匯出資料重建後的 Test 筆數。
assert(all(trainMask | testMask),'案例一每個來源 ID 都需分到 Train 或 Test。'); % 確認完整涵蓋全部來源資料列。
assert(numel(unique(sensorTable.deviceID)) == 240,'案例一來源 CSV 需包含二百四十個唯一設備 ID。'); % 確認來源 ID 完整且維持唯一。
classValues = unique(sensorTable.label)'; % 取得案例一實際標籤類別。
for classValue = classValues % 逐類別核對分層切分筆數。
    sourceClassCount = nnz(sensorTable.label == classValue); % 計算目前類別來源筆數。
    expectedTestCount = max(1,round(sourceClassCount .* 0.20)); % 依正式切分公式計算預期 Test 筆數。
    assert(nnz(testMask & sensorTable.label == classValue) == expectedTestCount,'案例一各類別 Test 筆數需符合百分之二十分層公式。'); % 核對目前類別 Test 筆數。
    assert(nnz(trainMask & sensorTable.label == classValue) == sourceClassCount - expectedTestCount,'案例一各類別 Train 筆數需涵蓋其餘來源列。'); % 核對目前類別 Train 筆數。
end % 結束各類別分層筆數核對。
featureNames = {'temperatureC','vibrationMmS','currentA'}; % 固定案例一三個特徵欄名。
recomputedMeans = mean(sensorTable{trainMask,featureNames},1); % 從實際 Train 資料獨立重算平均值。
assert(max(abs(recomputedMeans - firstCase1.standardizerMeans)) < 1e-10,'案例一前處理平均值需與 Train Set 重算結果一致。'); % 驗證只使用 Train 統計量。
assert(abs(firstCase1.trainRatio - 0.80) < 1e-12,'案例一訓練比例需為百分之八十。'); % 核對正式題目邏輯的訓練比例。
assert(abs(firstCase1.testRatio - 0.20) < 1e-12,'案例一測試比例需為百分之二十。'); % 核對正式題目邏輯的測試比例。
firstCase2 = case2_image_measure_matlab(case2Dir); % 第一次執行案例二並取得摘要。
secondCase2 = case2_image_measure_matlab(case2Dir); % 在同一資料夾重跑案例二。
assert(strcmp(char(firstCase2.outputDir),case2Dir),'案例二摘要的 outputDir 需與實際輸出位置一致。'); % 驗證文件第一階段使用的 outputDir 欄位。
assert(firstCase2.pixelArea == secondCase2.pixelArea,'案例二重跑像素面積需維持一致。'); % 確認案例二重跑結果一致。
assert(isfile(fullfile(case2Dir,'segmentation_mask.png')),'案例二分割遮罩需成功建立。'); % 確認分割遮罩產物存在。
assert(isfile(fullfile(case2Dir,'contour_overlay.png')),'案例二輪廓疊圖需成功建立。'); % 確認輪廓疊圖產物存在。
savedMask = imread(fullfile(case2Dir,'segmentation_mask.png')); % 直接讀取實際保存的案例二遮罩。
assert(nnz(savedMask > 0) == firstCase2.pixelArea,'案例二已保存遮罩的目標像素數需與 pixelArea 一致。'); % 獨立核對輸出影像與報告面積。
savedOverlay = imread(fullfile(case2Dir,'contour_overlay.png')); % 直接讀取實際保存的案例二輪廓疊圖。
redContour = savedOverlay(:,:,1) == 255 & savedOverlay(:,:,2) == 0 & savedOverlay(:,:,3) == 0; % 從疊圖找出純紅色外輪廓。
assert(nnz(redContour) == firstCase2.contourPixelCount,'案例二疊圖的純紅色像素數需與輪廓像素數一致。'); % 獨立核對紅色外輪廓。
assert(abs(firstCase2.pixelSizeMm - 1.0) < 1e-12,'案例二比例需為每像素一毫米。'); % 核對正式題目邏輯的比例設定。
expectedArea = firstCase2.pixelArea .* firstCase2.pixelSizeMm .^ 2; % 由整個分割元件像素重算面積。
assert(abs(expectedArea - firstCase2.areaSquareMm) < 1e-10,'案例二面積換算結果需符合指定公式。'); % 驗證比例換算正確。
assert(abs(firstCase2.areaSquareMm - firstCase2.pixelArea) < 1e-10,'案例二在一毫米比例下的平方毫米面積需等於像素面積。'); % 驗證一比一比例換算。
assert(firstCase2.contourPixelCount < firstCase2.pixelArea,'案例二輪廓像素數需小於元件面積。'); % 區分輪廓線與整個元件面積。
firstCase3 = case3_shape_classifier_matlab(case3Dir); % 第一次執行案例三並取得摘要。
secondCase3 = case3_shape_classifier_matlab(case3Dir); % 在同一資料夾重跑案例三。
assert(strcmp(char(firstCase3.outputDir),case3Dir),'案例三摘要的 outputDir 需與實際輸出位置一致。'); % 驗證三案回傳介面一致。
assert(all(isfinite(firstCase3.featurePreview),'all'),'案例三第二階段預覽特徵需全部為有限值。'); % 驗證文件第二階段可直接使用的特徵預覽。
assert(firstCase3.accuracy == secondCase3.accuracy,'案例三重跑正確率需維持一致。'); % 確認固定種子重跑結果一致。
trainManifest = readtable(fullfile(case3Dir,'train_manifest.csv'),'Delimiter',',','TextType','string','VariableNamingRule','preserve'); % 以逗號讀取實際 Train manifest 並保留原始欄名。
testManifest = readtable(fullfile(case3Dir,'test_manifest.csv'),'Delimiter',',','TextType','string','VariableNamingRule','preserve'); % 以逗號讀取實際 Test manifest 並保留原始欄名。
trainPaths = resolvePaths(case3Dir,trainManifest.relativePath); % 解析 Train 影像完整路徑。
testPaths = resolvePaths(case3Dir,testManifest.relativePath); % 解析 Test 影像完整路徑。
assert(isempty(intersect(string(trainPaths),string(testPaths))),'案例三 Train 與 Test 路徑需維持零交集。'); % 確認兩組路徑維持零交集。
trainSignatures = cellfun(@testPixelSignature,trainPaths,'UniformOutput',false); % 由測試端獨立重算 Train 解碼像素簽章。
testSignatures = cellfun(@testPixelSignature,testPaths,'UniformOutput',false); % 由測試端獨立重算 Test 解碼像素簽章。
assert(numel(unique(string(trainSignatures))) == height(trainManifest),'案例三 Train 影像需維持像素唯一。'); % 確認 Train 組內影像唯一。
assert(numel(unique(string(testSignatures))) == height(testManifest),'案例三 Test 影像需維持像素唯一。'); % 確認 Test 組內影像唯一。
assert(isempty(intersect(string(trainSignatures),string(testSignatures))),'案例三 Train 與 Test 像素簽章需維持零交集。'); % 確認跨組像素簽章維持零交集。
checkNeutralPaths(trainManifest); % 檢查 Train 檔名與資料夾維持中性命名。
checkNeutralPaths(testManifest); % 檢查 Test 檔名與資料夾維持中性命名。
trainFeatures = zeros(height(trainManifest),3); % 配置測試端 Train 特徵矩陣。
for index = 1:height(trainManifest) % 逐張重算 Train 特徵。
    trainFeatures(index,:) = testExtractFeatures(trainPaths{index}); % 使用測試端函式抽取特徵。
end % 結束 Train 特徵重算迴圈。
recomputedShapeMeans = mean(trainFeatures,1); % 從實際 Train 影像重算案例三平均值。
assert(max(abs(recomputedShapeMeans - firstCase3.standardizerMeans)) < 1e-10,'案例三前處理平均值需與 Train Set 重算結果一致。'); % 驗證案例三只使用 Train 統計量。
unsafeCaught = false; % 先建立安全路徑錯誤捕捉旗標。
try % 開始刻意測試專案外輸出路徑。
    case1_sensor_classifier_matlab(fullfile(tempdir,'outside_matlab_tutorial')); % 嘗試把案例一輸出到專案外。
catch errorInfo % 捕捉案例一專案外路徑防護錯誤。
    unsafeCaught = strcmp(errorInfo.identifier,'Tutorial:UnsafeOutput'); % 檢查錯誤識別碼是否符合預期。
end % 結束專案外路徑錯誤捕捉。
assert(unsafeCaught,'專案外輸出路徑需觸發 Tutorial:UnsafeOutput。'); % 確認安全路徑檢查有效。
results = struct; % 建立測試結果摘要。
results.case1Passed = true; % 記錄案例一檢核通過。
results.case2Passed = true; % 記錄案例二檢核通過。
results.case3Passed = true; % 記錄案例三檢核通過。
results.safePathPassed = true; % 記錄安全路徑檢核通過。
fprintf('MATLAB 教材檢核全部通過。\n'); % 在命令視窗顯示完整成功訊息。
end % 結束 MATLAB 測試入口。

function paths = resolvePaths(outputDir,relativePaths) % 定義測試端相對路徑解析函式。
paths = cell(numel(relativePaths),1); % 配置完整路徑儲存格欄向量。
for index = 1:numel(relativePaths) % 逐筆處理 manifest 路徑。
    paths{index} = fullfile(outputDir,char(relativePaths(index))); % 將相對路徑接在固定輸出根目錄下。
    assert(isfile(paths{index}),'manifest 指向的影像需存在：%s',paths{index}); % 確認每張影像實際存在。
end % 結束路徑解析迴圈。
end % 結束測試端路徑解析函式。

function signature = testPixelSignature(path) % 定義測試端獨立像素簽章函式。
rgbImage = imread(path); % 從檔案解碼實際影像。
sizePrefix = sprintf('%dx%dx%d:',size(rgbImage,1),size(rgbImage,2),size(rgbImage,3)); % 將解碼尺寸納入簽章。
pixelHex = sprintf('%02x',rgbImage(:)); % 將完整像素轉成精確十六進位字串。
signature = [sizePrefix pixelHex]; % 合併尺寸與像素內容。
end % 結束測試端像素簽章函式。

function checkNeutralPaths(manifest) % 定義檔名與資料夾標籤洩漏檢查函式。
for index = 1:height(manifest) % 逐筆檢查 manifest 路徑。
    pathText = lower(char(manifest.relativePath(index))); % 取得小寫相對路徑文字。
    labelText = lower(char(manifest.label(index))); % 取得小寫真實標籤文字。
    assert(~contains(pathText,labelText),'案例三路徑需保持中性：%s',pathText); % 確認路徑任何部分維持中性命名。
end % 結束路徑洩漏檢查迴圈。
end % 結束中性路徑檢查函式。

function features = testExtractFeatures(path) % 定義測試端獨立特徵抽取函式。
rgbImage = imread(path); % 從實際 PNG 讀取影像。
foreground = mean(double(rgbImage),3) < 128; % 以固定亮度門檻找出前景。
area = nnz(foreground); % 計算前景像素面積。
padded = false(size(foreground) + 2); % 建立四周背景填補遮罩。
padded(2:end - 1,2:end - 1) = foreground; % 將前景放入中央。
center = padded(2:end - 1,2:end - 1); % 取出中央區域。
up = padded(1:end - 2,2:end - 1); % 取出上方鄰居。
down = padded(3:end,2:end - 1); % 取出下方鄰居。
left = padded(2:end - 1,1:end - 2); % 取出左方鄰居。
right = padded(2:end - 1,3:end); % 取出右方鄰居。
perimeter = nnz(center & ~up) + nnz(center & ~down) + nnz(center & ~left) + nnz(center & ~right); % 重算四方向邊界長度。
[rows,columns] = find(foreground); % 取得前景座標。
boxArea = (max(rows) - min(rows) + 1) .* (max(columns) - min(columns) + 1); % 重算外接矩形面積。
features = [area ./ boxArea 4 .* pi .* area ./ perimeter .^ 2 area ./ numel(foreground)]; % 依正式程式順序重算三個特徵。
end % 結束測試端特徵抽取函式。
