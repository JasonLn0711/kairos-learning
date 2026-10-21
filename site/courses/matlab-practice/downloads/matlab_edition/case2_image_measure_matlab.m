function summary = case2_image_measure_matlab(outputDir) % 定義案例二主函式並回傳量測摘要。
projectRoot = fileparts(mfilename('fullpath')); % 以本程式位置作為明確專案根目錄。
if nargin < 1 % 呼叫者省略輸出資料夾時套用預設值。
    outputDir = fullfile(projectRoot,'matlab_artifacts','case2'); % 使用教材內固定的預設輸出位置。
end % 結束預設輸出條件。
outputDir = ensureSafeOutput(projectRoot,outputDir); % 驗證並建立安全輸出資料夾。
pixelSizeMm = 1.0; % 依正式題目邏輯設定每個像素邊長代表一毫米。
redThreshold = 170; % 設定紅色通道分割門檻。
dominanceMargin = 55; % 設定紅色高於其他通道的最小差距。
imageHeight = 240; % 設定合成紙面影像高度。
imageWidth = 320; % 設定合成紙面影像寬度。
paperImage = zeros(imageHeight,imageWidth,3,'uint8'); % 建立三通道空白影像陣列。
paperImage(:,:,1) = 242; % 設定米白背景的紅色通道。
paperImage(:,:,2) = 239; % 設定米白背景的綠色通道。
paperImage(:,:,3) = 229; % 設定米白背景的藍色通道。
[xGrid,yGrid] = meshgrid(1:imageWidth,1:imageHeight); % 建立每個像素的水平與垂直座標。
polygonX = [68 241 267 207 83]; % 定義不規則紅色色塊水平頂點。
polygonY = [55 48 174 204 181]; % 定義不規則紅色色塊垂直頂點。
targetMask = inpolygon(xGrid,yGrid,polygonX,polygonY); % 以 base MATLAB 判斷多邊形內像素。
paperImage = paintMask(paperImage,targetMask,[205 125 115]); % 將目標區域塗成柔和紅色以凸顯外框。
blueMask = xGrid >= 15 & xGrid <= 52 & yGrid >= 18 & yGrid <= 42; % 建立藍色干擾矩形遮罩。
paperImage = paintMask(paperImage,blueMask,[45 100 190]); % 將干擾區域塗成藍色。
sourcePath = fullfile(outputDir,'synthetic_paper_blocks.png'); % 指定合成紙面影像檔名。
imwrite(paperImage,sourcePath); % 使用 base MATLAB 寫出 PNG 影像。
loadedImage = imread(sourcePath); % 從檔案實際讀回合成影像。
red = double(loadedImage(:,:,1)); % 取出紅色通道並轉成 double。
green = double(loadedImage(:,:,2)); % 取出綠色通道並轉成 double。
blue = double(loadedImage(:,:,3)); % 取出藍色通道並轉成 double。
mask = red >= redThreshold & red - max(green,blue) >= dominanceMargin; % 同時套用紅色門檻與優勢差距。
if ~any(mask,'all') % 檢查目前門檻的目標像素數是否為零。
    error('Tutorial:EmptySegmentation','分割結果為空：請檢查紅色色塊與門檻設定。'); % 回報可辨識的空分割錯誤。
end % 結束空分割檢查。
component = largestComponent(mask); % 以四方向連通搜尋取得最大元件。
contour = contourPixels(component); % 找出至少一側接觸背景的輪廓像素。
pixelArea = nnz(component); % 以整個分割元件像素數計算面積。
contourPixelCount = nnz(contour); % 另記錄輪廓線像素數供比較。
areaSquareMm = pixelArea .* pixelSizeMm .^ 2; % 依像素邊長平方換算平方毫米。
maskImage = uint8(component) .* 255; % 將邏輯元件轉成黑底白色遮罩。
imwrite(maskImage,fullfile(outputDir,'segmentation_mask.png')); % 保存分割遮罩。
overlay = loadedImage; % 複製來源影像避免修改原始檔。
overlay = paintMask(overlay,contour,[255 0 0]); % 以純紅色標示外輪廓。
imwrite(overlay,fullfile(outputDir,'contour_overlay.png')); % 保存輪廓疊圖。
summary = struct; % 建立可稽核的量測摘要結構。
summary.outputDir = outputDir; % 保存實際輸出資料夾供階段暫測與檔案檢查。
summary.pixelSizeMm = pixelSizeMm; % 記錄明確像素比例。
summary.conversionFormula = 'areaSquareMm = pixelArea * pixelSizeMm^2'; % 記錄換算公式。
summary.redThreshold = redThreshold; % 記錄紅色通道門檻。
summary.dominanceMargin = dominanceMargin; % 記錄紅色優勢差距。
summary.pixelArea = pixelArea; % 記錄整個元件的像素面積。
summary.contourPixelCount = contourPixelCount; % 記錄輪廓線像素數。
summary.areaSquareMm = areaSquareMm; % 記錄換算後平方毫米面積。
summary.areaNote = '面積使用整個分割元件像素；輪廓線像素另列供檢查。'; % 保存面積解讀說明。
writeJson(fullfile(outputDir,'measurement.json'),summary); % 將量測摘要寫成 JSON。
fprintf('案例二完成：元件像素面積 %d，輪廓像素 %d，換算面積 %.3f 平方毫米。\n',pixelArea,contourPixelCount,areaSquareMm); % 顯示實際量測摘要。
end % 結束案例二主函式。

function image = paintMask(image,mask,color) % 定義依遮罩塗上指定 RGB 顏色的函式。
for channel = 1:3 % 逐一處理紅綠藍三個通道。
    plane = image(:,:,channel); % 取出目前色彩通道。
    plane(mask) = uint8(color(channel)); % 將遮罩內像素改成指定通道值。
    image(:,:,channel) = plane; % 將修改後通道放回影像。
end % 結束三通道繪製迴圈。
end % 結束遮罩塗色函式。

function largest = largestComponent(mask) % 定義以 base MATLAB 自行實作的最大連通元件函式。
[height,width] = size(mask); % 取得遮罩高度與寬度。
visited = false(height,width); % 建立已拜訪像素紀錄。
largest = false(height,width); % 建立目前最大元件遮罩。
targetList = find(mask); % 取得所有目標像素線性索引。
for targetPosition = 1:numel(targetList) % 逐一查看待分組的目標像素。
    startIndex = targetList(targetPosition); % 取得目前候選起點索引。
    if visited(startIndex) % 檢查起點是否已屬於先前元件。
        continue % 跳過已拜訪像素。
    end % 結束已拜訪判斷。
    queue = zeros(nnz(mask),1); % 配置最多容納所有目標像素的佇列。
    componentIndex = zeros(nnz(mask),1); % 配置目前元件索引儲存空間。
    queueHead = 1; % 將佇列讀取位置設為第一格。
    queueTail = 1; % 將佇列寫入位置設為第一格。
    componentCount = 0; % 將目前元件像素數歸零。
    queue(queueTail) = startIndex; % 將起點放入佇列。
    visited(startIndex) = true; % 將起點標為已拜訪。
    while queueHead <= queueTail % 持續處理佇列內待搜尋像素。
        currentIndex = queue(queueHead); % 取出目前像素索引。
        queueHead = queueHead + 1; % 將讀取位置移到下一格。
        componentCount = componentCount + 1; % 增加目前元件像素數。
        componentIndex(componentCount) = currentIndex; % 保存目前元件像素索引。
        [row,column] = ind2sub([height width],currentIndex); % 將線性索引轉成列與欄。
        neighbors = [row - 1 column;row + 1 column;row column - 1;row column + 1]; % 列出上下左右鄰居。
        for neighborPosition = 1:4 % 逐一檢查四個相鄰位置。
            neighborRow = neighbors(neighborPosition,1); % 取得相鄰位置列座標。
            neighborColumn = neighbors(neighborPosition,2); % 取得相鄰位置欄座標。
            inside = neighborRow >= 1 && neighborRow <= height && neighborColumn >= 1 && neighborColumn <= width; % 檢查鄰居是否在影像範圍。
            if inside % 只處理影像範圍內的鄰居。
                neighborIndex = sub2ind([height width],neighborRow,neighborColumn); % 將鄰居座標轉成線性索引。
                if mask(neighborIndex) && ~visited(neighborIndex) % 檢查鄰居是待拜訪目標像素。
                    queueTail = queueTail + 1; % 將佇列寫入位置往後移。
                    queue(queueTail) = neighborIndex; % 把相鄰目標像素加入佇列。
                    visited(neighborIndex) = true; % 立即標記避免重複加入。
                end % 結束相鄰像素加入條件。
            end % 結束影像範圍條件。
        end % 結束四方向鄰居迴圈。
    end % 結束目前連通元件搜尋。
    if componentCount > nnz(largest) % 比較目前元件與已知最大元件。
        largest(:) = false; % 清除先前最大元件遮罩。
        largest(componentIndex(1:componentCount)) = true; % 將目前較大元件設為新結果。
    end % 結束最大元件更新條件。
end % 結束所有目標像素搜尋迴圈。
end % 結束最大連通元件函式。

function contour = contourPixels(component) % 定義四方向輪廓像素抽取函式。
[height,width] = size(component); % 取得元件遮罩尺寸。
contour = false(height,width); % 建立全假的輪廓遮罩。
[rows,columns] = find(component); % 取得所有元件像素座標。
for index = 1:numel(rows) % 逐一查看每個元件像素。
    row = rows(index); % 取得目前像素列座標。
    column = columns(index); % 取得目前像素欄座標。
    isBoundary = row == 1 || row == height || column == 1 || column == width; % 檢查是否接觸影像外框。
    if ~isBoundary % 只在影像內部像素檢查四個鄰居。
        isBoundary = ~component(row - 1,column) || ~component(row + 1,column) || ~component(row,column - 1) || ~component(row,column + 1); % 檢查至少一側是否為背景。
    end % 結束鄰居輪廓判斷。
    contour(row,column) = isBoundary; % 保存目前像素是否屬於輪廓。
end % 結束元件像素迴圈。
end % 結束輪廓抽取函式。

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
