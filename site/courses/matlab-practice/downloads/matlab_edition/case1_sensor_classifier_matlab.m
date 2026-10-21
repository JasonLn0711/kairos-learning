function summary = case1_sensor_classifier_matlab(outputDir) % 定義案例一主函式，回傳可供測試核對的摘要。
projectRoot = fileparts(mfilename('fullpath')); % 以本程式所在資料夾作為明確專案根目錄。
if nargin < 1 % 呼叫者省略輸出資料夾時套用預設值。
    outputDir = fullfile(projectRoot,'matlab_artifacts','case1'); % 使用專案內固定的預設輸出位置。
end % 結束預設路徑條件。
outputDir = ensureSafeOutput(projectRoot,outputDir); % 驗證路徑位於 MATLAB 教材資料夾內並建立資料夾。
rng(20261021,'twister'); % 固定 MATLAB 亂數種子與演算法，讓資料可重現。
rowCount = 240; % 設定虛構設備資料筆數。
deviceNumber = (1:rowCount)'; % 建立一到二百四十的設備流水號。
deviceID = compose("DEV-%04d",deviceNumber); % 建立與標籤資訊分離的設備識別字串。
temperatureC = 66 + 8 .* randn(rowCount,1); % 產生虛構攝氏溫度。
vibrationMmS = max(0.1,3.2 + 1.1 .* randn(rowCount,1)); % 產生下限為零點一的虛構振動值。
currentA = max(0.5,8.0 + 1.5 .* randn(rowCount,1)); % 產生下限為零點五的虛構電流值。
riskScore = (temperatureC - 72) ./ 5; % 計算虛構溫度風險分數。
riskScore = riskScore + (vibrationMmS - 4.1) ./ 0.9; % 加入虛構振動風險分數。
riskScore = riskScore + (currentA - 9.0) ./ 1.2; % 加入虛構電流風險分數。
riskScore = riskScore + 0.7 .* randn(rowCount,1); % 加入雜訊避免單一硬門檻。
label = double(riskScore > 0.2); % 將一設為需檢查、零設為正常。
sensorTable = table(deviceID,temperatureC,vibrationMmS,currentA,label); % 將識別欄、特徵與標籤組成表格。
csvPath = fullfile(outputDir,'synthetic_sensor_data.csv'); % 指定合成感測資料檔名。
writetable(sensorTable,csvPath); % 將完整合成資料寫成 CSV。
loadedTable = readtable(csvPath,'TextType','string'); % 從 CSV 實際讀回資料並將文字讀成 string。
testRatio = 0.20; % 依正式題目邏輯設定百分之二十保留測試比例。
[trainIndex,testIndex] = stratifiedSplit(loadedTable.label,testRatio,20261021); % 依標籤分層切成百分之八十訓練與百分之二十測試。
trainTable = loadedTable(trainIndex,:); % 依索引建立訓練資料表。
testTable = loadedTable(testIndex,:); % 依索引建立保留測試資料表。
featureNames = {'temperatureC','vibrationMmS','currentA'}; % 固定模型會使用的三個特徵名稱。
trainMatrix = trainTable{:,featureNames}; % 取出訓練特徵矩陣。
testMatrix = testTable{:,featureNames}; % 取出測試特徵矩陣。
means = mean(trainMatrix,1); % 只用訓練資料估計每欄平均值。
scales = std(trainMatrix,1,1); % 只用訓練資料估計母體標準差。
scales(scales == 0) = 1; % 避免固定欄位造成除以零。
scaledTrain = (trainMatrix - means) ./ scales; % 使用訓練參數標準化訓練資料。
scaledTest = (testMatrix - means) ./ scales; % 使用同一組訓練參數標準化測試資料。
[weights,bias] = trainLogistic(scaledTrain,trainTable.label,1200,0.08); % 只用訓練資料訓練簡單羅吉斯分類器。
probabilities = predictProbability(scaledTest,weights,bias); % 對保留測試資料逐筆估計需檢查機率。
predictions = double(probabilities >= 0.5); % 以零點五門檻轉成預測類別。
matrix = binaryConfusion(testTable.label,predictions); % 計算列為真實、欄為預測的混淆矩陣。
accuracy = mean(testTable.label == predictions); % 計算保留測試集正確率。
positiveRecall = matrix(2,2) ./ sum(matrix(2,:)); % 計算需檢查類別的召回率。
explanation = repmat("模型估計需檢查機率低於門檻",height(testTable),1); % 先建立正常預測的白話說明。
explanation(predictions == 1) = "模型估計需檢查機率達門檻"; % 為需檢查預測改寫說明。
predictionTable = table(testTable.deviceID,testTable.label,predictions,probabilities,explanation); % 建立逐筆預測結果表。
predictionTable.Properties.VariableNames = {'deviceID','actual','predicted','checkProbability','explanation'}; % 指定清楚的結果欄名。
writetable(predictionTable,fullfile(outputDir,'test_predictions.csv')); % 保存逐筆預測結果。
trainIDs = sort(string(trainTable.deviceID)); % 整理訓練識別碼供交集檢查。
testIDs = sort(string(testTable.deviceID)); % 整理測試識別碼供交集檢查。
overlap = intersect(trainIDs,testIDs); % 計算訓練與測試識別碼交集。
summary = struct; % 建立可供測試與審查使用的摘要結構。
summary.outputDir = outputDir; % 保存實際輸出資料夾供階段暫測與檔案檢查。
summary.seed = 20261021; % 記錄固定亂數種子。
summary.rowCount = height(loadedTable); % 記錄總資料筆數。
summary.trainCount = height(trainTable); % 記錄訓練資料筆數。
summary.testCount = height(testTable); % 記錄測試資料筆數。
summary.trainRatio = 1 - testRatio; % 記錄百分之八十訓練比例。
summary.testRatio = testRatio; % 記錄百分之二十測試比例。
summary.trainTestOverlap = cellstr(overlap); % 記錄資料分割交集。
summary.standardizerMeans = means; % 保存實際訓練集平均值供獨立重算。
summary.standardizerScales = scales; % 保存實際訓練集標準差供獨立重算。
summary.confusionMatrix = matrix; % 保存混淆矩陣。
summary.accuracy = accuracy; % 保存測試正確率。
summary.positiveRecall = positiveRecall; % 保存正類召回率。
summary.probabilityNote = 'checkProbability 是校準前模型估計；真實故障風險需另行評估。'; % 保存機率解讀限制。
summary.trainIDs = cellstr(trainIDs); % 保存訓練識別碼供測試重建資料流。
summary.testIDs = cellstr(testIDs); % 保存測試識別碼供測試重建資料流。
writeJson(fullfile(outputDir,'summary.json'),summary); % 將摘要寫成 JSON 檔。
fprintf('案例一完成：測試正確率 %.3f，正類召回率 %.3f。\n',accuracy,positiveRecall); % 在命令視窗顯示實際摘要。
end % 結束案例一主函式。

function [trainIndex,testIndex] = stratifiedSplit(labels,testRatio,seed) % 定義以 base MATLAB 自行實作的分層切分函式。
rng(seed,'twister'); % 固定切分用亂數種子。
trainIndex = []; % 建立空的訓練索引欄向量。
testIndex = []; % 建立空的測試索引欄向量。
classes = unique(labels)'; % 取得所有類別並轉成列向量供迴圈使用。
for classValue = classes % 逐一處理每個標籤類別。
    classIndex = find(labels == classValue); % 找出目前類別的資料列索引。
    order = randperm(numel(classIndex)); % 在目前類別內隨機排列。
    classIndex = classIndex(order); % 套用固定種子的排列順序。
    testCount = max(1,round(numel(classIndex) .* testRatio)); % 計算目前類別保留測試筆數。
    testIndex = [testIndex;classIndex(1:testCount)]; % 將前段索引加入測試集。
    trainIndex = [trainIndex;classIndex(testCount + 1:end)]; % 將其餘索引加入訓練集。
end % 結束各類別切分迴圈。
trainIndex = trainIndex(randperm(numel(trainIndex))); % 混合訓練資料順序。
testIndex = testIndex(randperm(numel(testIndex))); % 混合測試資料順序。
end % 結束分層切分函式。

function [weights,bias] = trainLogistic(matrix,targets,epochs,learningRate) % 定義簡單羅吉斯迴歸訓練函式。
weights = zeros(size(matrix,2),1); % 將每個特徵權重初始化為零。
bias = 0; % 將截距初始化為零。
for epoch = 1:epochs % 依指定回合數重複梯度更新。
    scores = matrix * weights + bias; % 計算每筆資料的線性分數。
    scores = max(-30,min(30,scores)); % 限制極端分數避免指數溢位。
    probabilities = 1 ./ (1 + exp(-scores)); % 將分數轉成零到一的機率。
    errors = probabilities - targets; % 計算預測機率與真實標籤的差。
    weightGradient = matrix' * errors ./ size(matrix,1); % 計算平均權重梯度。
    biasGradient = mean(errors); % 計算平均截距梯度。
    weights = weights - learningRate .* weightGradient; % 依梯度下降更新權重。
    bias = bias - learningRate .* biasGradient; % 依梯度下降更新截距。
end % 結束模型訓練迴圈。
end % 結束羅吉斯訓練函式。

function probabilities = predictProbability(matrix,weights,bias) % 定義逐筆機率預測函式。
scores = matrix * weights + bias; % 計算測試資料線性分數。
scores = max(-30,min(30,scores)); % 限制極端分數避免指數溢位。
probabilities = 1 ./ (1 + exp(-scores)); % 將分數轉為需檢查機率。
end % 結束機率預測函式。

function matrix = binaryConfusion(targets,predictions) % 定義二元混淆矩陣函式。
matrix = zeros(2,2); % 建立二乘二零矩陣。
for index = 1:numel(targets) % 逐筆配對真實值與預測值。
    row = targets(index) + 1; % 將零或一真實標籤轉成 MATLAB 索引。
    column = predictions(index) + 1; % 將零或一預測標籤轉成 MATLAB 索引。
    matrix(row,column) = matrix(row,column) + 1; % 在對應格子累加一筆。
end % 結束逐筆統計迴圈。
end % 結束混淆矩陣函式。

function outputDir = ensureSafeOutput(projectRoot,rawPath) % 定義限制輸出範圍的安全函式。
if ~usejava('jvm') % 檢查安全路徑正規化所需的 JVM 必要條件。
    error('Tutorial:JVMRequired','本教材的安全路徑檢查需要啟用 MATLAB JVM。'); % 以固定識別碼清楚回報 JVM 必要條件。
end % 結束 JVM 前置條件檢查。
rawFile = java.io.File(char(rawPath)); % 建立候選路徑物件以判斷路徑型態。
if ~rawFile.isAbsolute() % 處理呼叫者提供的相對輸出路徑。
    rawPath = fullfile(projectRoot,char(rawPath)); % 將相對路徑固定接在本程式專案根目錄下。
end % 結束相對路徑正規化條件。
rootPath = char(java.io.File(projectRoot).getCanonicalPath()); % 取得專案根目錄的標準路徑。
candidatePath = char(java.io.File(char(rawPath)).getCanonicalPath()); % 取得候選輸出位置的標準路徑。
if ispc % 判斷目前是否為 Windows 路徑環境。
    isInside = startsWith(lower([candidatePath filesep]),lower([rootPath filesep])); % 統一轉成小寫後檢查路徑範圍。
else % 處理 macOS、Linux 與 MATLAB Online 路徑。
    isInside = startsWith([candidatePath filesep],[rootPath filesep]); % 以區分大小寫方式檢查路徑範圍。
end % 結束作業系統路徑判斷。
if ~isInside % 檢查候選位置的教材專案範圍。
    error('Tutorial:UnsafeOutput','安全限制：輸出資料夾必須位於 MATLAB 教材專案內。'); % 以固定識別碼回報可辨識錯誤。
end % 結束安全範圍檢查。
if ~isfolder(candidatePath) % 檢查安全輸出資料夾是否需要建立。
    mkdir(candidatePath); % 建立資料夾並保留現有內容。
end % 結束資料夾建立條件。
outputDir = candidatePath; % 回傳標準化後的安全輸出路徑。
end % 結束安全輸出函式。

function writeJson(path,data) % 定義基礎 JSON 寫入函式。
fileID = fopen(path,'w','n','UTF-8'); % 以 UTF-8 開啟摘要輸出檔。
if fileID < 0 % 檢查摘要檔開啟狀態。
    error('Tutorial:FileWrite','摘要檔寫入受阻：%s',path); % 回報包含路徑的寫檔錯誤。
end % 結束開檔檢查。
cleaner = onCleanup(@() fclose(fileID)); % 確保函式結束時關閉檔案。
fprintf(fileID,'%s',jsonencode(data,'PrettyPrint',true)); % 將結構編碼並寫成易讀 JSON。
end % 結束 JSON 寫入函式。
