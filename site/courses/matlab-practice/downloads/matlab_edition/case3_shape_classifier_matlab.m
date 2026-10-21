function summary = case3_shape_classifier_matlab(outputDir) % 定義案例三主函式並回傳評估摘要。
projectRoot = fileparts(mfilename('fullpath')); % 以本程式所在資料夾作為專案根目錄。
if nargin < 1 % 呼叫者省略輸出資料夾時套用預設值。
    outputDir = fullfile(projectRoot,'matlab_artifacts','case3'); % 使用教材內固定的預設輸出位置。
end % 結束預設輸出條件。
outputDir = ensureSafeOutput(projectRoot,outputDir); % 驗證並建立安全輸出資料夾。
labelOrder = ["circle" "triangle" "square"]; % 固定三個幾何圖形標籤順序。
usedSignatures = {}; % 建立跨 Train 與 Test 共用的解碼像素簽章集合。
[trainManifest,usedSignatures] = buildSplit(outputDir,'train',36,20261021,labelOrder,usedSignatures); % 建立每類三十六張且像素唯一的 Train Set。
[testManifest,usedSignatures] = buildSplit(outputDir,'test',15,20261022,labelOrder,usedSignatures); % 建立每類十五張且像素內容與 Train Set 保持區隔的 Test Set。
writetable(trainManifest,fullfile(outputDir,'train_manifest.csv')); % 保存 Train Set 路徑與標籤清單。
writetable(testManifest,fullfile(outputDir,'test_manifest.csv')); % 保存 Test Set 路徑與標籤清單。
trainManifest = readtable(fullfile(outputDir,'train_manifest.csv'),'Delimiter',',','TextType','string','VariableNamingRule','preserve'); % 以逗號讀回 Train manifest 並保留原始欄名。
testManifest = readtable(fullfile(outputDir,'test_manifest.csv'),'Delimiter',',','TextType','string','VariableNamingRule','preserve'); % 以逗號讀回 Test manifest 並保留原始欄名。
trainPaths = resolvePaths(outputDir,trainManifest.relativePath); % 將 Train 相對路徑轉成完整路徑。
testPaths = resolvePaths(outputDir,testManifest.relativePath); % 將 Test 相對路徑轉成完整路徑。
pathOverlap = intersect(string(trainPaths),string(testPaths)); % 計算 Train 與 Test 完整路徑交集。
if ~isempty(pathOverlap) % 檢查兩組是否共用同一檔案路徑。
    error('Tutorial:PathLeakage','資料分割錯誤：Train Set 與 Test Set 有 %d 個重複路徑。',numel(pathOverlap)); % 回報路徑洩漏。
end % 結束路徑交集檢查。
trainSignatures = cellfun(@pixelSignature,trainPaths,'UniformOutput',false); % 由實際 Train PNG 重算解碼像素簽章。
testSignatures = cellfun(@pixelSignature,testPaths,'UniformOutput',false); % 由實際 Test PNG 重算解碼像素簽章。
pixelOverlap = intersect(string(trainSignatures),string(testSignatures)); % 計算跨組完全相同像素交集。
if ~isempty(pixelOverlap) % 檢查兩組是否有完全相同的解碼 RGB 影像。
    error('Tutorial:PixelLeakage','資料分割錯誤：Train Set 與 Test Set 有 %d 張像素完全相同的影像。',numel(pixelOverlap)); % 回報像素洩漏。
end % 結束像素交集檢查。
trainMatrix = zeros(height(trainManifest),3); % 配置 Train Set 三欄特徵矩陣。
testMatrix = zeros(height(testManifest),3); % 配置 Test Set 三欄特徵矩陣。
for index = 1:height(trainManifest) % 逐張處理 Train Set 影像。
    trainMatrix(index,:) = extractFeatures(trainPaths{index}); % 讀圖並抽取三個可解釋特徵。
end % 結束 Train 特徵抽取迴圈。
for index = 1:height(testManifest) % 逐張處理 Test Set 影像。
    testMatrix(index,:) = extractFeatures(testPaths{index}); % 讀圖並抽取三個可解釋特徵。
end % 結束 Test 特徵抽取迴圈。
means = mean(trainMatrix,1); % 只用 Train Set 擬合每欄平均值。
scales = std(trainMatrix,1,1); % 只用 Train Set 擬合母體標準差。
scales(scales == 0) = 1; % 避免固定特徵造成除以零。
scaledTrain = (trainMatrix - means) ./ scales; % 使用 Train 參數標準化 Train 特徵。
scaledTest = (testMatrix - means) ./ scales; % 使用同一組 Train 參數標準化 Test 特徵。
predictions = strings(height(testManifest),1); % 配置逐張預測標籤欄向量。
for index = 1:height(testManifest) % 逐張分類獨立 Test Set。
    predictions(index) = predictKnn(scaledTrain,trainManifest.label,scaledTest(index,:),3); % 使用三近鄰模型預測目前影像。
end % 結束 Test 分類迴圈。
matrix = multiclassConfusion(testManifest.label,predictions,labelOrder); % 計算三類別混淆矩陣。
accuracy = mean(testManifest.label == predictions); % 計算獨立 Test Set 正確率。
predictionTable = table(testManifest.relativePath,testManifest.label,predictions); % 建立逐張預測結果表。
predictionTable.Properties.VariableNames = {'relativePath','actual','predicted'}; % 指定清楚的預測欄名。
writetable(predictionTable,fullfile(outputDir,'test_predictions.csv')); % 保存逐張預測結果。
summary = struct; % 建立可稽核評估摘要。
summary.outputDir = outputDir; % 保存實際輸出資料夾供階段暫測與檔案檢查。
summary.seedTrain = 20261021; % 記錄 Train 產圖種子。
summary.seedTest = 20261022; % 記錄 Test 產圖種子。
summary.labels = cellstr(labelOrder); % 記錄混淆矩陣類別順序。
summary.trainCount = height(trainManifest); % 記錄 Train 影像張數。
summary.testCount = height(testManifest); % 記錄 Test 影像張數。
summary.trainTestPathOverlap = cellstr(pathOverlap); % 記錄完整路徑交集。
summary.trainUniquePixelCount = numel(unique(string(trainSignatures))); % 記錄 Train 唯一解碼像素張數。
summary.testUniquePixelCount = numel(unique(string(testSignatures))); % 記錄 Test 唯一解碼像素張數。
summary.trainTestPixelOverlap = cellstr(pixelOverlap); % 記錄跨組完全相同像素交集。
summary.standardizerMeans = means; % 保存 Train 特徵平均值供測試重算。
summary.standardizerScales = scales; % 保存 Train 特徵標準差供測試重算。
summary.features = {'fillRatio','circularity','areaRatio'}; % 記錄三個可解釋特徵名稱。
summary.featurePreview = trainMatrix(1:min(3,size(trainMatrix,1)),:); % 保存前三筆實際 Train 特徵供第二階段暫測。
summary.confusionMatrix = matrix; % 保存三類別混淆矩陣。
summary.accuracy = accuracy; % 保存獨立測試正確率。
summary.limitation = '本範例呈現合成幾何圖形的結果；真實照片與其他合成規則捷徑需另行評估。'; % 保存外推與捷徑限制。
writeJson(fullfile(outputDir,'evaluation.json'),summary); % 將評估摘要寫成 JSON。
fprintf('案例三完成：獨立測試正確率 %.3f，像素交集 %d 張。\n',accuracy,numel(pixelOverlap)); % 顯示實際評估摘要。
end % 結束案例三主函式。

function [manifest,usedSignatures] = buildSplit(outputDir,splitName,perClass,seed,labelOrder,usedSignatures) % 定義單一資料集產生流程。
imageSize = 96; % 統一所有影像的寬與高。
imageDir = fullfile(outputDir,'images',splitName); % 使用只表示資料用途的中性資料夾。
if ~isfolder(imageDir) % 檢查影像資料夾是否需要建立。
    mkdir(imageDir); % 建立資料夾並保留既有內容。
end % 結束資料夾建立條件。
rng(seed,'twister'); % 固定目前資料集的亂數種子。
labels = repelem(labelOrder,perClass); % 建立每種類別相同張數的標籤列向量。
labels = labels(randperm(numel(labels)))'; % 先洗牌標籤再分配檔名，避免流水號對應類別。
relativePath = strings(numel(labels),1); % 配置中性相對路徑欄。
for index = 1:numel(labels) % 逐張產生幾何圖形影像。
    filename = sprintf('img_%04d.png',index); % 建立與類別文字分離的中性檔名。
    imagePath = fullfile(imageDir,filename); % 組合目前影像完整路徑。
    acceptedSignature = ''; % 將待確認的像素簽章設為空字元。
    for attempt = 1:50 % 最多重畫五十次避免完全相同像素。
        rgbImage = drawShape(imageSize,labels(index)); % 依下一組亂數參數產生影像。
        imwrite(rgbImage,imagePath); % 將候選影像寫成 PNG。
        candidateSignature = pixelSignature(imagePath); % 對解碼後 RGB 像素建立精確簽章。
        if ~any(strcmp(usedSignatures,candidateSignature)) % 只接受像素簽章保持唯一的影像。
            acceptedSignature = candidateSignature; % 記住目前唯一像素簽章。
            break % 結束重畫迴圈並保留目前影像。
        end % 結束像素重複判斷。
    end % 結束有限次重畫迴圈。
    if isempty(acceptedSignature) % 檢查唯一影像產生狀態。
        error('Tutorial:UniqueImage','資料產生受阻：%s 第 %d 張請檢查亂數範圍與唯一性條件。',splitName,index); % 回報可辨識錯誤。
    end % 結束唯一影像檢查。
    usedSignatures{end + 1,1} = acceptedSignature; % 將新影像簽章加入跨組共享集合。
    relativePath(index) = string(fullfile('images',splitName,filename)); % 保存相對於案例輸出資料夾的路徑。
end % 結束資料集產圖迴圈。
label = labels; % 將洗牌後標籤指定為表格欄位。
manifest = table(relativePath,label); % 建立只在 manifest 保存標籤的資料表。
end % 結束單一資料集產生函式。

function rgbImage = drawShape(imageSize,label) % 定義單張合成幾何圖形繪製函式。
background = uint8([238 238 238]); % 設定所有類別相同的淺灰背景。
foreground = uint8([32 32 32]); % 設定所有類別相同的深灰前景。
rgbImage = zeros(imageSize,imageSize,3,'uint8'); % 建立固定尺寸三通道影像。
for channel = 1:3 % 逐一填入三個背景色彩通道。
    rgbImage(:,:,channel) = background(channel); % 將目前通道設為固定背景值。
end % 結束背景通道迴圈。
centerX = imageSize ./ 2 + (-5 + 10 .* rand); % 隨機平移圖形水平中心。
centerY = imageSize ./ 2 + (-5 + 10 .* rand); % 隨機平移圖形垂直中心。
radius = 24 + 9 .* rand; % 隨機改變圖形大小。
angle = 2 .* pi .* rand; % 隨機旋轉圖形。
[xGrid,yGrid] = meshgrid(1:imageSize,1:imageSize); % 建立每個像素座標。
if label == "circle" % 判斷是否要繪製圓形。
    mask = (xGrid - centerX) .^ 2 + (yGrid - centerY) .^ 2 <= radius .^ 2; % 以圓方程式建立前景遮罩。
elseif label == "triangle" % 判斷是否要繪製三角形。
    [pointX,pointY] = polygonPoints(centerX,centerY,radius,angle,3); % 計算旋轉三角形頂點。
    mask = inpolygon(xGrid,yGrid,pointX,pointY); % 取得三角形內像素。
elseif label == "square" % 判斷是否要繪製方形。
    [pointX,pointY] = polygonPoints(centerX,centerY,radius,angle,4); % 計算旋轉方形頂點。
    mask = inpolygon(xGrid,yGrid,pointX,pointY); % 取得方形內像素。
else % 處理教材設定範圍外的其他標籤。
    error('Tutorial:UnknownLabel','圖形標籤超出教材設定：%s',label); % 回報包含標籤的可辨識錯誤。
end % 結束圖形類別判斷。
for channel = 1:3 % 逐一處理前景三個色彩通道。
    plane = rgbImage(:,:,channel); % 取出目前色彩通道。
    plane(mask) = foreground(channel); % 將圖形遮罩內像素設為固定前景值。
    rgbImage(:,:,channel) = plane; % 將修改後通道放回影像。
end % 結束前景通道迴圈。
end % 結束單張圖形繪製函式。

function [pointX,pointY] = polygonPoints(centerX,centerY,radius,angle,sideCount) % 定義正多邊形頂點計算函式。
steps = 0:(sideCount - 1); % 建立從零開始的頂點序號。
theta = angle + 2 .* pi .* steps ./ sideCount; % 計算各頂點角度。
pointX = centerX + radius .* cos(theta); % 計算各頂點水平座標。
pointY = centerY + radius .* sin(theta); % 計算各頂點垂直座標。
end % 結束多邊形頂點函式。

function signature = pixelSignature(path) % 定義依解碼像素內容建立的精確影像簽章。
rgbImage = imread(path); % 從檔案解碼實際影像像素。
if size(rgbImage,3) == 1 % 檢查影像是否意外為單通道。
    rgbImage = repmat(rgbImage,1,1,3); % 將單通道複製成三通道 RGB。
end % 結束通道數統一條件。
sizePrefix = sprintf('%dx%dx%d:',size(rgbImage,1),size(rgbImage,2),size(rgbImage,3)); % 將影像尺寸納入簽章。
pixelHex = sprintf('%02x',rgbImage(:)); % 將所有解碼像素轉成可精確比較的十六進位字串。
signature = [sizePrefix pixelHex]; % 合併尺寸與完整像素內容。
end % 結束像素簽章函式。

function paths = resolvePaths(outputDir,relativePaths) % 定義 manifest 相對路徑解析函式。
paths = cell(numel(relativePaths),1); % 配置完整路徑儲存格欄向量。
for index = 1:numel(relativePaths) % 逐筆處理 manifest 路徑。
    paths{index} = fullfile(outputDir,char(relativePaths(index))); % 將相對路徑接在固定案例輸出根目錄下。
    if ~isfile(paths{index}) % 檢查 manifest 指向的影像是否存在。
        error('Tutorial:MissingImage','請提供影像檔：%s',paths{index}); % 回報包含完整路徑的檔案需求。
    end % 結束影像存在檢查。
end % 結束路徑解析迴圈。
end % 結束 manifest 路徑解析函式。

function features = extractFeatures(path) % 定義單張影像的三個可解釋特徵。
rgbImage = imread(path); % 從 manifest 指定路徑讀取影像。
brightness = mean(double(rgbImage),3); % 計算每個像素三通道平均亮度。
foreground = brightness < 128; % 以固定亮度門檻找出深色圖形。
area = nnz(foreground); % 計算圖形像素面積。
if area == 0 % 檢查影像前景像素數是否為零。
    error('Tutorial:EmptyForeground','影像前景像素數為零：%s',path); % 回報包含路徑的空前景錯誤。
end % 結束空前景檢查。
padded = false(size(foreground) + 2); % 建立四周多一圈背景的遮罩。
padded(2:end - 1,2:end - 1) = foreground; % 將原始前景放入中央。
center = padded(2:end - 1,2:end - 1); % 取出中央前景區域。
up = padded(1:end - 2,2:end - 1); % 取出每個像素上方鄰居。
down = padded(3:end,2:end - 1); % 取出每個像素下方鄰居。
left = padded(2:end - 1,1:end - 2); % 取出每個像素左方鄰居。
right = padded(2:end - 1,3:end); % 取出每個像素右方鄰居。
perimeter = nnz(center & ~up) + nnz(center & ~down) + nnz(center & ~left) + nnz(center & ~right); % 計算四方向暴露邊界長度。
[rows,columns] = find(foreground); % 取得所有前景像素座標。
boxArea = (max(rows) - min(rows) + 1) .* (max(columns) - min(columns) + 1); % 計算外接矩形面積。
fillRatio = area ./ boxArea; % 計算圖形填滿外接矩形的比例。
circularity = 4 .* pi .* area ./ perimeter .^ 2; % 計算近似圓形度。
areaRatio = area ./ numel(foreground); % 計算圖形占整張影像的比例。
features = [fillRatio circularity areaRatio]; % 依固定順序回傳三個特徵。
end % 結束特徵抽取函式。

function prediction = predictKnn(trainMatrix,trainLabels,sample,neighborCount) % 定義以 base MATLAB 自行實作的近鄰分類器。
differences = trainMatrix - sample; % 計算每筆 Train 特徵與目前樣本的差。
distances = sqrt(sum(differences .^ 2,2)); % 計算歐幾里得距離。
[~,order] = sort(distances,'ascend'); % 依距離由近到遠取得索引。
neighborLabels = trainLabels(order(1:neighborCount)); % 取出最近三筆 Train 標籤。
candidateLabels = unique(neighborLabels); % 取得鄰居中出現的候選標籤。
voteCounts = zeros(numel(candidateLabels),1); % 配置各候選標籤票數。
for index = 1:numel(candidateLabels) % 逐一統計候選標籤票數。
    voteCounts(index) = nnz(neighborLabels == candidateLabels(index)); % 計算目前標籤得票數。
end % 結束投票統計迴圈。
bestCount = max(voteCounts); % 找出最高票數。
bestLabels = sort(candidateLabels(voteCounts == bestCount)); % 平手時依標籤文字固定排序。
prediction = bestLabels(1); % 以最高票且固定平手規則的標籤作為預測。
end % 結束近鄰分類函式。

function matrix = multiclassConfusion(targets,predictions,labelOrder) % 定義三類別混淆矩陣函式。
matrix = zeros(numel(labelOrder)); % 建立類別數乘類別數的零矩陣。
for index = 1:numel(targets) % 逐筆配對真實與預測標籤。
    row = find(labelOrder == targets(index),1); % 找出真實標籤所在列。
    column = find(labelOrder == predictions(index),1); % 找出預測標籤所在欄。
    matrix(row,column) = matrix(row,column) + 1; % 在對應格子累加一筆。
end % 結束逐筆統計迴圈。
end % 結束多類別混淆矩陣函式。

function outputDir = ensureSafeOutput(projectRoot,rawPath) % 定義限制輸出範圍的安全函式。
if ~usejava('jvm') % 檢查安全路徑正規化所需的 JVM 必要條件。
    error('Tutorial:JVMRequired','本教材的安全路徑檢查需要啟用 MATLAB JVM。'); % 以固定識別碼清楚回報 JVM 必要條件。
end % 結束 JVM 前置條件檢查。
rawFile = java.io.File(char(rawPath)); % 建立候選路徑物件以判斷路徑型態。
if ~rawFile.isAbsolute() % 處理呼叫者提供的相對輸出路徑。
    rawPath = fullfile(projectRoot,char(rawPath)); % 將相對路徑固定接在本程式專案根目錄下。
end % 結束相對路徑正規化條件。
rootPath = char(java.io.File(projectRoot).getCanonicalPath()); % 取得專案根目錄標準路徑。
candidatePath = char(java.io.File(char(rawPath)).getCanonicalPath()); % 取得候選輸出標準路徑。
if ispc % 判斷是否為 Windows 路徑環境。
    isInside = startsWith(lower([candidatePath filesep]),lower([rootPath filesep])); % 統一轉成小寫後檢查路徑範圍。
else % 處理 macOS、Linux 與 MATLAB Online。
    isInside = startsWith([candidatePath filesep],[rootPath filesep]); % 區分大小寫檢查路徑範圍。
end % 結束作業系統判斷。
if ~isInside % 檢查候選位置的教材專案範圍。
    error('Tutorial:UnsafeOutput','安全限制：輸出資料夾必須位於 MATLAB 教材專案內。'); % 回報固定識別碼錯誤。
end % 結束安全範圍檢查。
if ~isfolder(candidatePath) % 檢查輸出資料夾是否需要建立。
    mkdir(candidatePath); % 建立資料夾並保留現有內容。
end % 結束資料夾建立條件。
outputDir = candidatePath; % 回傳安全標準路徑。
end % 結束安全輸出函式。

function writeJson(path,data) % 定義 JSON 寫入函式。
fileID = fopen(path,'w','n','UTF-8'); % 以 UTF-8 開啟輸出檔。
if fileID < 0 % 檢查摘要檔開啟狀態。
    error('Tutorial:FileWrite','摘要檔寫入受阻：%s',path); % 回報包含路徑的寫檔錯誤。
end % 結束開檔檢查。
cleaner = onCleanup(@() fclose(fileID)); % 確保函式結束時關閉檔案。
fprintf(fileID,'%s',jsonencode(data,'PrettyPrint',true)); % 將結構編碼並寫成易讀 JSON。
end % 結束 JSON 寫入函式。
