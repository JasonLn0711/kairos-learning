# 案例三逐段教學：合成幾何圖形分類

教材 1.8 · 2026-10-22。先完成 [小任務](CASE3_QUICKSTART.md)，再讀完整流程與逐段解說（段內逐行）。

## 先看全程｜從 Train／Test 圖庫到圖片分類報告

### 這個案例要完成什麼？

我們用圓形、三角形與正方形的合成圖片，做出一套能讀圖、取特徵、分類，再核對測試答案的流程。先用 Train Set 建立判斷方式，再對 Test Set 逐張預測，最後整理結果、處理程序與程式碼。

本案例是「助教實作方式」。本案例的圖庫按 Train Set／Test Set 分開，成果整理為「執行結果、處理程序、程式碼」三部分。本教材採 PDF 與 `.m` 整理成果，屬助教實作方式。正式作業要處理的資料組數、指定格式及其他規則，依完整題目與後續公告確認。

### 從頭到尾，依序做這 8 件事

#### 步驟 1：找到圖庫生成與分類入口

例子：執行主函式後查看 case3。

操作：先開啟程式，認識資料夾。 進入 matlab_edition，開啟 case3_shape_classifier_matlab.m，跟著後面的段落與四階段提示詞練習。完整參考版輸入 s = case3_shape_classifier_matlab;，結果存到 matlab_artifacts/case3。重跑會更新同名範例輸出。

結果：產物集中到同一個案例目錄。

解釋：主函式會串起產圖、特徵、分類與評估。

下一步：進入步驟 2。

#### 步驟 2：確認圖片與標籤相配

例子：manifest 的一列指向一張 circle 圖。

操作：先盤點圖片與答案，再開始分類。 本例建立 108 張 Train 圖與 45 張 Test 圖，放在 images/train 與 images/test；train_manifest.csv、test_manifest.csv 記錄圖片相對路徑與正確標籤。抽開幾張圖，確認清冊中的路徑真的找得到圖片、標籤對得上內容。正式圖庫則先沿用已提供的 Train／Test 分組。

結果：108 張 Train、45 張 Test 路徑可讀。

解釋：清冊同時連結檔案位置與已知類別。

下一步：進入步驟 3。

#### 步驟 3：維持測試資料獨立

例子：同張圖片即使改名仍可能有相同像素。

操作：確認練習圖片與測試圖片分開。 程式檢查完整路徑與解碼後像素的交集，結果寫入 evaluation.json。本例實測跨組交集皆為 0。這項檢查針對完全相同的圖片；正式資料也要留意近似圖片、同一物件與同一拍攝來源，依資料特性安排檢查。

結果：兩種跨組交集皆為空。

解釋：路徑與像素檢查各涵蓋一種完全重複情況。

下一步：進入步驟 4。

#### 步驟 4：將外觀轉成數值

例子：圖 3-3 每列有三個特徵。

操作：把圖片變成模型看得懂的數字。 本例讀取前景，為每張圖算三個特徵：填滿程度 fillRatio、接近圓形的程度 circularity、前景占整張圖的比例 areaRatio。先看幾張圖，再對照特徵，說明這些數字為什麼可能分得出三種形狀。換成正式照片時，要重新評估特徵與前景處理方式。

結果：每張圖對應一列、三欄特徵。

解釋：外接框比例、圓形程度與整圖比例描述不同外觀。

下一步：進入步驟 5。

#### 步驟 5：比較相似程度並投票

例子：圖 3-2 的三位鄰居投出兩票圓形。

操作：只用 Train 建立判斷方式。 先用 Train 特徵算平均值與標準差，再套用到兩組資料。本例採三近鄰：對一張待分類圖片，找出特徵最接近的三張 Train 圖，由它們的標籤投票。清楚區分「建立參考資料」與「對 Test 預測」，把方法與參數寫進處理程序。

結果：每張 Test 圖得到一個預測類別。

解釋：先用 Train 統計量對齊尺度，再按距離取三位鄰居。

下一步：進入步驟 6。

#### 步驟 6：用保留答案檢查預測

例子：44／45 是既有參考執行的答對張數。

操作：逐張預測 Test，再對照正確答案。 開啟 test_predictions.csv 看每張圖的真實標籤與預測；查看 evaluation.json 的類別順序、混淆矩陣及正確率。本例實測答對 44／45 張，約 97.78%。把判錯的圖片找出來，觀察形狀或特徵可能造成的混淆。自己的報告記錄自己的實際結果。

結果：逐張結果、混淆矩陣與正確率一致。

解釋：不同類別的錯誤分布有助於解釋特徵限制。

下一步：進入步驟 7。

#### 步驟 7：讓錯誤可被重查

例子：從錯誤列的 relativePath 打開圖片。

操作：整理讀者能核對的結果。 保存兩份清冊、逐張預測、評估摘要、程式與代表性圖片。說明圖庫張數、前處理、特徵、分類方法、測試方式與錯誤案例。使用三案完整包時，可執行 run_matlab_tests 檢查教材參考版；真實照片的辨識表現與資料特性另行評估。

結果：代表圖片與評估摘要來自同次執行。

解釋：完整證據呈現模型如何判斷與在哪裡混淆。

下一步：進入步驟 8。

#### 步驟 8：完成與正式題目對應的報告

例子：每組圖庫各自標示設定與結果。

操作：把成果整理成三部分，再對照正式題目。 依 CASE3_REPORT_TEMPLATE.md 整理「執行結果、處理程序、程式碼」。本教材示範匯出 PDF 並保留 .m；繳交格式、要完成的圖庫範圍與管道，最後再按正式說明確認。若需處理多組圖庫，每組各自留下資料設定、測試結果與錯誤分析，讓報告能清楚對應。

結果：執行結果、處理程序、程式碼彼此對應。

解釋：合成形狀的表現只描述這套練習，正式圖庫另外評估。

下一步：查閱逐段解說（段內逐行），再依自己的疑問使用提示詞。

### 做完時，你手上應該有什麼？

- 練習過程：一支 `.m`、Train／Test 圖庫、兩份清冊、`test_predictions.csv` 與 `evaluation.json`。
- 報告證據：資料分組、圖片特徵、模型方法、逐張預測、混淆矩陣與錯誤案例。
- 成果整理：依課務已說明的三項內容撰寫報告；PDF 與 `.m` 是本教材採用的助教實作方式，正式交件細節依完整題目確認。

接著逐段讀程式，從圖庫與清冊開始，看到特徵如何進入模型，再追到每張測試圖的結果。

## 一、逐段解說（段內逐行）

來源程式：`case3_shape_classifier_matlab.m`｜共 240 個實體行、230 個非空行｜SHA-256：`cdd50e20ec1d4496a03e548721bd48c3cfbe28e82fe125ff0bb85445eee6518d`

這支程式會分開建立 Train Set 與 Test Set，從實際 PNG 抽取三個可解釋特徵，只用 Train Set 擬合標準化參數，再用三近鄰分類並檢查路徑與像素交集。

以下依實際工作流程分成 19 段。每段先保留一個完整原始碼區塊，再在同一段內逐行說明；「第 N 行」直接對應來源檔實體行號。每個非空行恰好說明一次；段內原始行保留，函式間空白以段落區隔。

### 第 1 段：輸出路徑與安全根目錄（第 1–6 行）

本段目的：完成「輸出路徑與安全根目錄」，讓這組程式成為前後相接的一個工作單位。

```matlab
function summary = case3_shape_classifier_matlab(outputDir) % 定義案例三主函式並回傳評估摘要。
projectRoot = fileparts(mfilename('fullpath')); % 以本程式所在資料夾作為專案根目錄。
if nargin < 1 % 呼叫者省略輸出資料夾時套用預設值。
    outputDir = fullfile(projectRoot,'matlab_artifacts','case3'); % 使用教材內固定的預設輸出位置。
end % 結束預設輸出條件。
outputDir = ensureSafeOutput(projectRoot,outputDir); % 驗證並建立安全輸出資料夾。
```

段內逐行說明：

**第 1 行**：定義案例三主函式並回傳評估摘要。 `function` 宣告 `case3_shape_classifier_matlab`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`outputDir`：字元路徑，案例三輸出資料夾；`summary`：struct，保存切分、特徵、評估與限制。

**第 2 行**：以本程式所在資料夾作為專案根目錄。 `=` 是指定運算：先算右側 `fileparts(mfilename('fullpath'))`，再把結果存進左側 `projectRoot`。 行尾 `;` 會結束敘述，並讓 MATLAB Command Window 保持簡潔。 `mfilename('fullpath')` 回傳目前函式檔的完整路徑與檔名；外層 `fileparts` 取出資料夾部分，因此後續相對路徑都以教材檔所在位置為基準。 這行的資料是：`projectRoot`：字元路徑，本 `.m` 檔所在資料夾。

**第 3 行**：呼叫者省略輸出資料夾時套用預設值。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `nargin` 是這次呼叫實際收到的輸入數。直接輸入函式名稱時為 0，`0 < 1` 成立並進入預設路徑分支；傳入一個輸出路徑時為 1，條件為 false，MATLAB 直接跳到配對的 `end`。

**第 4 行**：使用教材內固定的預設輸出位置。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 這行的資料是：`outputDir`：字元路徑，案例三輸出資料夾；`projectRoot`：字元路徑，本 `.m` 檔所在資料夾。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

**第 5 行**：結束預設輸出條件。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 6 行**：驗證並建立安全輸出資料夾。 這行的資料是：`outputDir`：字元路徑，案例三輸出資料夾；`projectRoot`：字元路徑，本 `.m` 檔所在資料夾。

段落銜接：完成「輸出路徑與安全根目錄」後，下一段進入「建立、寫入並正確讀回 Train/Test manifest」。

### 第 2 段：建立、寫入並正確讀回 Train/Test manifest（第 7–14 行）

本段目的：完成「建立、寫入並正確讀回 Train/Test manifest」，讓這組程式成為前後相接的一個工作單位。

```matlab
labelOrder = ["circle" "triangle" "square"]; % 固定三個幾何圖形標籤順序。
usedSignatures = {}; % 建立跨 Train 與 Test 共用的解碼像素簽章集合。
[trainManifest,usedSignatures] = buildSplit(outputDir,'train',36,20261021,labelOrder,usedSignatures); % 建立每類三十六張且像素唯一的 Train Set。
[testManifest,usedSignatures] = buildSplit(outputDir,'test',15,20261022,labelOrder,usedSignatures); % 建立每類十五張且像素內容與 Train Set 保持區隔的 Test Set。
writetable(trainManifest,fullfile(outputDir,'train_manifest.csv')); % 保存 Train Set 路徑與標籤清單。
writetable(testManifest,fullfile(outputDir,'test_manifest.csv')); % 保存 Test Set 路徑與標籤清單。
trainManifest = readtable(fullfile(outputDir,'train_manifest.csv'),'Delimiter',',','TextType','string','VariableNamingRule','preserve'); % 以逗號讀回 Train manifest 並保留原始欄名。
testManifest = readtable(fullfile(outputDir,'test_manifest.csv'),'Delimiter',',','TextType','string','VariableNamingRule','preserve'); % 以逗號讀回 Test manifest 並保留原始欄名。
```

段內逐行說明：

**第 7 行**：固定三個幾何圖形標籤順序。 這行的資料是：`labelOrder`：1×3 string，固定類別順序。

**第 8 行**：建立跨 Train 與 Test 共用的解碼像素簽章集合。 大括號 `{}` 會建立或取出 cell/table 內容；用途取決於它出現在資料右側或索引位置。 這行的資料是：`usedSignatures`：cell，跨 Train/Test 保存完整像素簽章。

**第 9 行**：建立每類三十六張且像素唯一的 Train Set。 這行的資料是：`outputDir`：字元路徑，案例三輸出資料夾；`labelOrder`：1×3 string，固定類別順序；`usedSignatures`：cell，跨 Train/Test 保存完整像素簽章；`trainManifest`：108×2 table，Train 相對路徑與標籤。

**第 10 行**：建立每類十五張且像素內容與 Train Set 保持區隔的 Test Set。 這行的資料是：`outputDir`：字元路徑，案例三輸出資料夾；`labelOrder`：1×3 string，固定類別順序；`usedSignatures`：cell，跨 Train/Test 保存完整像素簽章；`testManifest`：45×2 table，Test 相對路徑與標籤。

**第 11 行**：保存 Train Set 路徑與標籤清單。 `writetable` 把 table 欄名與每一列資料寫入指定 CSV；後續再讀回，可驗證流程使用的是落盤資料。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 `writetable` 把 table 寫入指定檔案，方便檢查與交接。 這行的資料是：`outputDir`：字元路徑，案例三輸出資料夾；`trainManifest`：108×2 table，Train 相對路徑與標籤。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

**第 12 行**：保存 Test Set 路徑與標籤清單。 `writetable` 把 table 欄名與每一列資料寫入指定 CSV；後續再讀回，可驗證流程使用的是落盤資料。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 `writetable` 把 table 寫入指定檔案，方便檢查與交接。 這行的資料是：`outputDir`：字元路徑，案例三輸出資料夾；`testManifest`：45×2 table，Test 相對路徑與標籤。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

**第 13 行**：以逗號讀回 Train manifest 並保留原始欄名。 `readtable` 真的從 CSV 讀回 table；`'TextType','string'` 指定文字欄使用 string，後續比較與輸出型態會一致。 `'Delimiter',','` 明確指定逗號為欄位分隔符號，讓相對路徑中的 `/` 保持在同一格文字內；`'VariableNamingRule','preserve'` 保留 CSV 標題 `relativePath` 與 `label`。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 `readtable` 從檔案讀取表格；輸出是 MATLAB table。 這行的資料是：`outputDir`：字元路徑，案例三輸出資料夾；`trainManifest`：108×2 table，Train 相對路徑與標籤。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

**第 14 行**：以逗號讀回 Test manifest 並保留原始欄名。 `readtable` 真的從 CSV 讀回 table；`'TextType','string'` 指定文字欄使用 string，後續比較與輸出型態會一致。 `'Delimiter',','` 明確指定逗號為欄位分隔符號，讓相對路徑中的 `/` 保持在同一格文字內；`'VariableNamingRule','preserve'` 保留 CSV 標題 `relativePath` 與 `label`。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 `readtable` 從檔案讀取表格；輸出是 MATLAB table。 這行的資料是：`outputDir`：字元路徑，案例三輸出資料夾；`testManifest`：45×2 table，Test 相對路徑與標籤。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

段落銜接：完成「建立、寫入並正確讀回 Train/Test manifest」後，下一段進入「路徑與像素洩漏檢查」。

### 第 3 段：路徑與像素洩漏檢查（第 15–26 行）

本段目的：完成「路徑與像素洩漏檢查」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 15 行**：將 Train 相對路徑轉成完整路徑。 這行的資料是：`outputDir`：字元路徑，案例三輸出資料夾；`trainManifest`：108×2 table，Train 相對路徑與標籤；`trainPaths`：108×1 cell，Train 完整路徑。

**第 16 行**：將 Test 相對路徑轉成完整路徑。 這行的資料是：`outputDir`：字元路徑，案例三輸出資料夾；`testManifest`：45×2 table，Test 相對路徑與標籤；`testPaths`：45×1 cell，Test 完整路徑。

**第 17 行**：計算 Train 與 Test 完整路徑交集。 `intersect` 找出兩組資料共有的元素，本教材用它檢查 Train/Test 交集。 `string` 將輸入統一成 string 型態，便於文字向量化比較。 這行的資料是：`trainPaths`：108×1 cell，Train 完整路徑；`testPaths`：45×1 cell，Test 完整路徑。 小例子：若兩組 ID 完全分開，`intersect` 會回傳空集合，表示交集為零。

**第 18 行**：檢查兩組是否共用同一檔案路徑。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。 `isempty` 在輸入元素數為零時回傳 true，本教材用來判斷交集或產圖結果是否為空。

**第 19 行**：回報路徑洩漏。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 `error` 以固定識別碼與訊息停止流程，方便使用者回報精確原因。

**第 20 行**：結束路徑交集檢查。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 21 行**：由實際 Train PNG 重算解碼像素簽章。 `@pixelSignature` 是函式控制代碼；`cellfun` 對每個路徑呼叫一次，`'UniformOutput',false` 讓各簽章保留在 N×1 cell，而非強制串成數值矩陣。 這行的資料是：`trainPaths`：108×1 cell，Train 完整路徑；`trainSignatures`：108×1 cell，Train 解碼像素簽章。

**第 22 行**：由實際 Test PNG 重算解碼像素簽章。 `@pixelSignature` 是函式控制代碼；`cellfun` 對每個路徑呼叫一次，`'UniformOutput',false` 讓各簽章保留在 N×1 cell，而非強制串成數值矩陣。 這行的資料是：`testPaths`：45×1 cell，Test 完整路徑；`testSignatures`：45×1 cell，Test 解碼像素簽章。

**第 23 行**：計算跨組完全相同像素交集。 `intersect` 找出兩組資料共有的元素，本教材用它檢查 Train/Test 交集。 `string` 將輸入統一成 string 型態，便於文字向量化比較。 這行的資料是：`trainSignatures`：108×1 cell，Train 解碼像素簽章；`testSignatures`：45×1 cell，Test 解碼像素簽章。 小例子：若兩組 ID 完全分開，`intersect` 會回傳空集合，表示交集為零。

**第 24 行**：檢查兩組是否有完全相同的解碼 RGB 影像。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。 `isempty` 在輸入元素數為零時回傳 true，本教材用來判斷交集或產圖結果是否為空。

**第 25 行**：回報像素洩漏。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 `error` 以固定識別碼與訊息停止流程，方便使用者回報精確原因。

**第 26 行**：結束像素交集檢查。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「路徑與像素洩漏檢查」後，下一段進入「抽取特徵與 Train-only 標準化」。

### 第 4 段：抽取特徵與 Train-only 標準化（第 27–39 行）

本段目的：完成「抽取特徵與 Train-only 標準化」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 27 行**：配置 Train Set 三欄特徵矩陣。 `zeros(m,n)` 先配置 m×n 的全零陣列，之後再逐格填入結果。 `height` 回傳 table 的資料列數。 這行的資料是：`trainManifest`：108×2 table，Train 相對路徑與標籤；`trainMatrix`：108×3 double，Train 特徵矩陣。 小例子：例如 `zeros(2,3)` 會得到 2 列、3 欄的全零矩陣。

**第 28 行**：配置 Test Set 三欄特徵矩陣。 `zeros(m,n)` 先配置 m×n 的全零陣列，之後再逐格填入結果。 `height` 回傳 table 的資料列數。 這行的資料是：`testManifest`：45×2 table，Test 相對路徑與標籤；`testMatrix`：45×3 double，Test 特徵矩陣。 小例子：例如 `zeros(2,3)` 會得到 2 列、3 欄的全零矩陣。

**第 29 行**：逐張處理 Train Set 影像。 `for` 建立迴圈；迴圈變數會依序取用右側序列中的每個值。 `height` 回傳 table 的資料列數。 這行的資料是：`trainManifest`：108×2 table，Train 相對路徑與標籤。

**第 30 行**：讀圖並抽取三個可解釋特徵。 大括號 `{}` 會建立或取出 cell/table 內容；用途取決於它出現在資料右側或索引位置。 這行的資料是：`trainPaths`：108×1 cell，Train 完整路徑；`trainMatrix`：108×3 double，Train 特徵矩陣。

**第 31 行**：結束 Train 特徵抽取迴圈。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 32 行**：逐張處理 Test Set 影像。 `for` 建立迴圈；迴圈變數會依序取用右側序列中的每個值。 `height` 回傳 table 的資料列數。 這行的資料是：`testManifest`：45×2 table，Test 相對路徑與標籤。

**第 33 行**：讀圖並抽取三個可解釋特徵。 大括號 `{}` 會建立或取出 cell/table 內容；用途取決於它出現在資料右側或索引位置。 這行的資料是：`testPaths`：45×1 cell，Test 完整路徑；`testMatrix`：45×3 double，Test 特徵矩陣。

**第 34 行**：結束 Test 特徵抽取迴圈。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 35 行**：只用 Train Set 擬合每欄平均值。 `mean` 計算平均值；第二個參數可指定沿哪個維度計算。 這行的資料是：`trainMatrix`：108×3 double，Train 特徵矩陣；`means`：1×3 double，只由 Train 特徵計算。

**第 36 行**：只用 Train Set 擬合母體標準差。 `std` 計算標準差；本教材只用 Train Set 估計前處理參數。 這行的資料是：`trainMatrix`：108×3 double，Train 特徵矩陣；`scales`：1×3 double，只由 Train 特徵計算。

**第 37 行**：避免固定特徵造成除以零。 這行的資料是：`scales`：1×3 double，只由 Train 特徵計算。

**第 38 行**：使用 Train 參數標準化 Train 特徵。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 這行的資料是：`trainMatrix`：108×3 double，Train 特徵矩陣；`means`：1×3 double，只由 Train 特徵計算；`scales`：1×3 double，只由 Train 特徵計算；`scaledTrain`：108×3 double，標準化 Train 特徵。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 39 行**：使用同一組 Train 參數標準化 Test 特徵。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 這行的資料是：`testMatrix`：45×3 double，Test 特徵矩陣；`means`：1×3 double，只由 Train 特徵計算；`scales`：1×3 double，只由 Train 特徵計算；`scaledTest`：45×3 double，使用 Train 參數轉換的 Test 特徵。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

段落銜接：完成「抽取特徵與 Train-only 標準化」後，下一段進入「三近鄰預測與預測 CSV」。

### 第 5 段：三近鄰預測與預測 CSV（第 40–48 行）

本段目的：完成「三近鄰預測與預測 CSV」，讓這組程式成為前後相接的一個工作單位。

```matlab
predictions = strings(height(testManifest),1); % 配置逐張預測標籤欄向量。
for index = 1:height(testManifest) % 逐張分類獨立 Test Set。
    predictions(index) = predictKnn(scaledTrain,trainManifest.label,scaledTest(index,:),3); % 使用三近鄰模型預測目前影像。
end % 結束 Test 分類迴圈。
matrix = multiclassConfusion(testManifest.label,predictions,labelOrder); % 計算三類別混淆矩陣。
accuracy = mean(testManifest.label == predictions); % 計算獨立 Test Set 正確率。
predictionTable = table(testManifest.relativePath,testManifest.label,predictions); % 建立逐張預測結果表。
predictionTable.Properties.VariableNames = {'relativePath','actual','predicted'}; % 指定清楚的預測欄名。
writetable(predictionTable,fullfile(outputDir,'test_predictions.csv')); % 保存逐張預測結果。
```

段內逐行說明：

**第 40 行**：配置逐張預測標籤欄向量。 `height` 回傳 table 的資料列數。 `strings(m,n)` 建立 m×n string 陣列，初始元素是空字串。 這行的資料是：`testManifest`：45×2 table，Test 相對路徑與標籤；`predictions`：45×1 string，Test 預測標籤。

**第 41 行**：逐張分類獨立 Test Set。 `for` 建立迴圈；迴圈變數會依序取用右側序列中的每個值。 `height` 回傳 table 的資料列數。 這行的資料是：`testManifest`：45×2 table，Test 相對路徑與標籤。

**第 42 行**：使用三近鄰模型預測目前影像。 這行的資料是：`trainManifest`：108×2 table，Train 相對路徑與標籤；`scaledTrain`：108×3 double，標準化 Train 特徵；`scaledTest`：45×3 double，使用 Train 參數轉換的 Test 特徵；`predictions`：45×1 string，Test 預測標籤。

**第 43 行**：結束 Test 分類迴圈。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 44 行**：計算三類別混淆矩陣。 這行的資料是：`labelOrder`：1×3 string，固定類別順序；`testManifest`：45×2 table，Test 相對路徑與標籤；`predictions`：45×1 string，Test 預測標籤；`matrix`：3×3 double，三類別混淆矩陣。

**第 45 行**：計算獨立 Test Set 正確率。 `mean` 計算平均值；第二個參數可指定沿哪個維度計算。 這行的資料是：`testManifest`：45×2 table，Test 相對路徑與標籤；`predictions`：45×1 string，Test 預測標籤。 小例子：例如比較結果為 `[true true false true]`，MATLAB 把它視為 `[1 1 0 1]`，平均值是 0.75。

**第 46 行**：建立逐張預測結果表。 `table` 把同列數的欄位組成表格，每一列是一筆樣本。 這行的資料是：`testManifest`：45×2 table，Test 相對路徑與標籤；`predictions`：45×1 string，Test 預測標籤。 小例子：若三個欄向量各有 10 列，組成的 table 也會有 10 筆資料。

**第 47 行**：指定清楚的預測欄名。 大括號 `{}` 會建立或取出 cell/table 內容；用途取決於它出現在資料右側或索引位置。 `Properties.VariableNames` 是 table 的欄名屬性；右側 cell 內的名稱依序對應目前各欄，之後寫入 CSV 時會成為標題列。

**第 48 行**：保存逐張預測結果。 `writetable` 把 table 欄名與每一列資料寫入指定 CSV；後續再讀回，可驗證流程使用的是落盤資料。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 `writetable` 把 table 寫入指定檔案，方便檢查與交接。 這行的資料是：`outputDir`：字元路徑，案例三輸出資料夾。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

段落銜接：完成「三近鄰預測與預測 CSV」後，下一段進入「評估摘要與 JSON」。

### 第 6 段：評估摘要與 JSON（第 49–69 行）

本段目的：完成「評估摘要與 JSON」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 49 行**：建立可稽核評估摘要。 這行的資料是：`summary`：struct，保存切分、特徵、評估與限制。

**第 50 行**：保存實際輸出資料夾供階段暫測與檔案檢查。 這行的資料是：`outputDir`：字元路徑，案例三輸出資料夾；`summary`：struct，保存切分、特徵、評估與限制。

**第 51 行**：記錄 Train 產圖種子。 這行的資料是：`summary`：struct，保存切分、特徵、評估與限制。

**第 52 行**：記錄 Test 產圖種子。 這行的資料是：`summary`：struct，保存切分、特徵、評估與限制。

**第 53 行**：記錄混淆矩陣類別順序。 `cellstr` 將 string 陣列轉成字元向量 cell，方便寫入 struct 與 JSON。 這行的資料是：`labelOrder`：1×3 string，固定類別順序；`summary`：struct，保存切分、特徵、評估與限制。

**第 54 行**：記錄 Train 影像張數。 `height` 回傳 table 的資料列數。 這行的資料是：`trainManifest`：108×2 table，Train 相對路徑與標籤；`summary`：struct，保存切分、特徵、評估與限制。

**第 55 行**：記錄 Test 影像張數。 `height` 回傳 table 的資料列數。 這行的資料是：`testManifest`：45×2 table，Test 相對路徑與標籤；`summary`：struct，保存切分、特徵、評估與限制。

**第 56 行**：記錄完整路徑交集。 `cellstr` 將 string 陣列轉成字元向量 cell，方便寫入 struct 與 JSON。 這行的資料是：`summary`：struct，保存切分、特徵、評估與限制。

**第 57 行**：記錄 Train 唯一解碼像素張數。 `unique` 取得資料中各種不同值。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 `string` 將輸入統一成 string 型態，便於文字向量化比較。 這行的資料是：`trainSignatures`：108×1 cell，Train 解碼像素簽章；`summary`：struct，保存切分、特徵、評估與限制。

**第 58 行**：記錄 Test 唯一解碼像素張數。 `unique` 取得資料中各種不同值。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 `string` 將輸入統一成 string 型態，便於文字向量化比較。 這行的資料是：`testSignatures`：45×1 cell，Test 解碼像素簽章；`summary`：struct，保存切分、特徵、評估與限制。

**第 59 行**：記錄跨組完全相同像素交集。 `cellstr` 將 string 陣列轉成字元向量 cell，方便寫入 struct 與 JSON。 這行的資料是：`summary`：struct，保存切分、特徵、評估與限制。

**第 60 行**：保存 Train 特徵平均值供測試重算。 這行的資料是：`means`：1×3 double，只由 Train 特徵計算；`summary`：struct，保存切分、特徵、評估與限制。

**第 61 行**：保存 Train 特徵標準差供測試重算。 這行的資料是：`scales`：1×3 double，只由 Train 特徵計算；`summary`：struct，保存切分、特徵、評估與限制。

**第 62 行**：記錄三個可解釋特徵名稱。 大括號 `{}` 會建立或取出 cell/table 內容；用途取決於它出現在資料右側或索引位置。 這裡的 `summary.features` 是 1×3 cell，內容是特徵名稱字串；它和 `extractFeatures` 函式內的 1×3 double 區域變數 `features` 型態不同、作用域也不同。 這行的資料是：`summary`：struct，保存切分、特徵、評估與限制。

**第 63 行**：保存前三筆實際 Train 特徵供第二階段暫測。 這行的資料是：`trainMatrix`：108×3 double，Train 特徵矩陣；`summary`：struct，保存切分、特徵、評估與限制。

**第 64 行**：保存三類別混淆矩陣。 這行的資料是：`matrix`：3×3 double，三類別混淆矩陣；`summary`：struct，保存切分、特徵、評估與限制。

**第 65 行**：保存獨立測試正確率。 這行的資料是：`summary`：struct，保存切分、特徵、評估與限制。

**第 66 行**：保存外推與捷徑限制。 這行的資料是：`summary`：struct，保存切分、特徵、評估與限制。

**第 67 行**：將評估摘要寫成 JSON。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 這行的資料是：`outputDir`：字元路徑，案例三輸出資料夾；`summary`：struct，保存切分、特徵、評估與限制。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

**第 68 行**：顯示實際評估摘要。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 `fprintf` 依格式字串輸出文字；`%d`、`%.3f` 等位置會由後續變數填入。

**第 69 行**：結束案例三主函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「評估摘要與 JSON」後，下一段進入「buildSplit 初始化與中性標籤洗牌」。

### 第 7 段：buildSplit 初始化與中性標籤洗牌（第 71–80 行）

本段目的：完成「buildSplit 初始化與中性標籤洗牌」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 71 行**：定義單一資料集產生流程。 `function` 宣告 `buildSplit`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`outputDir`：字元路徑，案例三輸出根目錄；`splitName`：字元向量，`train` 或 `test`；`perClass`：純量整數，每類影像張數；`seed`：純量整數，目前資料集產圖種子；`labelOrder`：1×3 string，類別順序。

**第 72 行**：統一所有影像的寬與高。

**第 73 行**：使用只表示資料用途的中性資料夾。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 這行的資料是：`outputDir`：字元路徑，案例三輸出根目錄；`splitName`：字元向量，`train` 或 `test`。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

**第 74 行**：檢查影像資料夾是否需要建立。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。 `isfolder` 檢查指定路徑是否指向現有資料夾。

**第 75 行**：建立資料夾並保留既有內容。 `mkdir` 建立指定資料夾；既有檔案保持原狀，程式只會覆寫自己使用的同名教材輸出。

**第 76 行**：結束資料夾建立條件。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 77 行**：固定目前資料集的亂數種子。 `rng` 固定亂數種子與演算法；相同資料與環境下可重現相同亂數序列。 這行的資料是：`seed`：純量整數，目前資料集產圖種子。 小例子：連續兩次先執行相同 `rng(seed,'twister')`，後續第一組亂數會依相同順序產生。

**第 78 行**：建立每種類別相同張數的標籤列向量。 `repelem` 讓每個標籤連續重複 `perClass` 次；三個標籤、每類 36 張時先產生 1×108 列向量，下一行再洗牌與轉置。 `repelem` 依指定次數重複每個元素。 這行的資料是：`perClass`：純量整數，每類影像張數；`labelOrder`：1×3 string，類別順序；`labels`：1×N string，依類別成組建立、尚未洗牌的標籤列向量。

**第 79 行**：先洗牌標籤再分配檔名，避免流水號對應類別。 `randperm` 產生 1 到標籤總數的不重複亂序索引；小括號先把 1×N 標籤列向量依此順序洗牌，最後撇號轉成 N×1 欄向量，供後續逐列寫入 manifest。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 `randperm(n)` 回傳 1 到 n 的不重複亂序整數，可用來固定種子洗牌。 這行的資料是：`labels`：N×1 string，洗牌並轉置後的標籤欄向量。

**第 80 行**：配置中性相對路徑欄。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 `strings(m,n)` 建立 m×n string 陣列，初始元素是空字串。 這行的資料是：`labels`：總張數×1 string，洗牌後標籤；`relativePath`：總張數×1 string，中性相對路徑。

段落銜接：完成「buildSplit 初始化與中性標籤洗牌」後，下一段進入「逐張產圖、像素唯一性與 manifest」。

### 第 8 段：逐張產圖、像素唯一性與 manifest（第 81–102 行）

本段目的：完成「逐張產圖、像素唯一性與 manifest」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 81 行**：逐張產生幾何圖形影像。 `for` 建立迴圈；迴圈變數會依序取用右側序列中的每個值。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 這行的資料是：`labels`：總張數×1 string，洗牌後標籤。

**第 82 行**：建立與類別文字分離的中性檔名。

**第 83 行**：組合目前影像完整路徑。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

**第 84 行**：將待確認的像素簽章設為空字元。 這行的資料是：`acceptedSignature`：字元向量，通過唯一性檢查的簽章。

**第 85 行**：最多重畫五十次避免完全相同像素。 `for` 建立迴圈；迴圈變數會依序取用右側序列中的每個值。

**第 86 行**：依下一組亂數參數產生影像。 這行的資料是：`labels`：總張數×1 string，洗牌後標籤；`rgbImage`：96×96×3 uint8，候選影像。

**第 87 行**：將候選影像寫成 PNG。 `imwrite` 把目前像素陣列編碼成 PNG 並寫到指定路徑；後續讀回或測試會以這個檔案為準。 `imwrite` 把像素陣列寫成影像檔。 這行的資料是：`rgbImage`：96×96×3 uint8，候選影像。

**第 88 行**：對解碼後 RGB 像素建立精確簽章。 這行的資料是：`candidateSignature`：字元向量，候選影像完整像素簽章。

**第 89 行**：只接受像素簽章保持唯一的影像。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。 `any` 檢查指定範圍是否至少有一個 true。 `strcmp` 逐一比較字元內容是否完全相同，回傳 logical 結果。 這行的資料是：`usedSignatures`：cell，進入與回傳的共享像素簽章；`candidateSignature`：字元向量，候選影像完整像素簽章。

**第 90 行**：記住目前唯一像素簽章。 這行的資料是：`candidateSignature`：字元向量，候選影像完整像素簽章；`acceptedSignature`：字元向量，通過唯一性檢查的簽章。

**第 91 行**：結束重畫迴圈並保留目前影像。

**第 92 行**：結束像素重複判斷。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 93 行**：結束有限次重畫迴圈。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 94 行**：檢查唯一影像產生狀態。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `isempty` 在輸入元素數為零時回傳 true，本教材用來判斷交集或產圖結果是否為空。 這行的資料是：`acceptedSignature`：字元向量，通過唯一性檢查的簽章。

**第 95 行**：回報可辨識錯誤。 `error` 以固定識別碼與訊息停止流程，方便使用者回報精確原因。 這行的資料是：`splitName`：字元向量，`train` 或 `test`。

**第 96 行**：結束唯一影像檢查。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 97 行**：將新影像簽章加入跨組共享集合。 大括號 `{}` 會建立或取出 cell/table 內容；用途取決於它出現在資料右側或索引位置。 cell 大括號會寫入內容；`end+1` 在現有最後一列後新增一列，第二維固定為第 1 欄。這個集合跨 Train/Test 共用。 這行的資料是：`usedSignatures`：cell，進入與回傳的共享像素簽章；`acceptedSignature`：字元向量，通過唯一性檢查的簽章。

**第 98 行**：保存相對於案例輸出資料夾的路徑。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 `string` 將輸入統一成 string 型態，便於文字向量化比較。 這行的資料是：`splitName`：字元向量，`train` 或 `test`；`relativePath`：總張數×1 string，中性相對路徑。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

**第 99 行**：結束資料集產圖迴圈。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 100 行**：將洗牌後標籤指定為表格欄位。 這行的資料是：`labels`：總張數×1 string，洗牌後標籤。

**第 101 行**：建立只在 manifest 保存標籤的資料表。 `table` 把同列數的欄位組成表格，每一列是一筆樣本。 這行的資料是：`relativePath`：總張數×1 string，中性相對路徑；`manifest`：總張數×2 table，相對路徑與標籤。 小例子：若三個欄向量各有 10 列，組成的 table 也會有 10 筆資料。

**第 102 行**：結束單一資料集產生函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「逐張產圖、像素唯一性與 manifest」後，下一段進入「統一背景與隨機幾何參數」。

### 第 9 段：統一背景與隨機幾何參數（第 104–115 行）

本段目的：完成「統一背景與隨機幾何參數」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 104 行**：定義單張合成幾何圖形繪製函式。 `function` 宣告 `drawShape`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`imageSize`：純量整數，影像寬高 96；`label`：string 純量，circle、triangle 或 square；`rgbImage`：96×96×3 uint8，輸出 RGB 影像。

**第 105 行**：設定所有類別相同的淺灰背景。 這行的資料是：`background`：1×3 uint8，固定背景色。

**第 106 行**：設定所有類別相同的深灰前景。 這行的資料是：`foreground`：1×3 uint8，固定圖形色。

**第 107 行**：建立固定尺寸三通道影像。 `zeros(m,n)` 先配置 m×n 的全零陣列，之後再逐格填入結果。 這行的資料是：`imageSize`：純量整數，影像寬高 96；`rgbImage`：96×96×3 uint8，輸出 RGB 影像。 小例子：例如 `zeros(2,3)` 會得到 2 列、3 欄的全零矩陣。

**第 108 行**：逐一填入三個背景色彩通道。 `for` 建立迴圈；迴圈變數會依序取用右側序列中的每個值。

**第 109 行**：將目前通道設為固定背景值。 索引中的 `:` 代表該維度全部元素；例如 `X(:,2)` 會取全部資料列的第 2 欄。 這行的資料是：`rgbImage`：96×96×3 uint8，輸出 RGB 影像；`background`：1×3 uint8，固定背景色。 小例子：例如 `A(:,2)` 代表取 A 的全部資料列與第 2 欄。

**第 110 行**：結束背景通道迴圈。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 111 行**：隨機平移圖形水平中心。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 這行的資料是：`imageSize`：純量整數，影像寬高 96。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 112 行**：隨機平移圖形垂直中心。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 這行的資料是：`imageSize`：純量整數，影像寬高 96。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 113 行**：隨機改變圖形大小。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 小例子：例如 `[2 4] .* [3 5]` 會得到 `[6 20]`，每個位置各自相乘。

**第 114 行**：隨機旋轉圖形。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 小例子：例如 `[2 4] .* [3 5]` 會得到 `[6 20]`，每個位置各自相乘。

**第 115 行**：建立每個像素座標。 `meshgrid(x,y)` 將水平座標 x 與垂直座標 y 展開成同尺寸矩陣；每個 `(row,column)` 因此都有可交給幾何公式的 X、Y 值。 `meshgrid` 把水平與垂直座標展開成整張影像大小的座標矩陣。 這行的資料是：`imageSize`：純量整數，影像寬高 96；`xGrid`：96×96 double，水平座標；`yGrid`：96×96 double，垂直座標。

段落銜接：完成「統一背景與隨機幾何參數」後，下一段進入「依標籤畫形狀並填色」。

### 第 10 段：依標籤畫形狀並填色（第 116–132 行）

本段目的：完成「依標籤畫形狀並填色」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 116 行**：判斷是否要繪製圓形。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 這行的資料是：`label`：string 純量，circle、triangle 或 square。

**第 117 行**：以圓方程式建立前景遮罩。 `.^` 代表每個元素各自做次方運算。 這行的資料是：`xGrid`：96×96 double，水平座標；`yGrid`：96×96 double，垂直座標；`mask`：96×96 logical，圖形前景。

**第 118 行**：判斷是否要繪製三角形。 `elseif` 會在前一個條件未成立時，再檢查這個條件。 這行的資料是：`label`：string 純量，circle、triangle 或 square。

**第 119 行**：計算旋轉三角形頂點。

**第 120 行**：取得三角形內像素。 `inpolygon` 對每個座標判斷是否位於頂點所定義的多邊形內或邊界上，回傳與座標網格同尺寸的 logical 遮罩。 `inpolygon` 判斷每個座標是否落在多邊形內，輸出 logical 遮罩。 這行的資料是：`xGrid`：96×96 double，水平座標；`yGrid`：96×96 double，垂直座標；`mask`：96×96 logical，圖形前景。

**第 121 行**：判斷是否要繪製方形。 `elseif` 會在前一個條件未成立時，再檢查這個條件。 這行的資料是：`label`：string 純量，circle、triangle 或 square。

**第 122 行**：計算旋轉方形頂點。

**第 123 行**：取得方形內像素。 `inpolygon` 對每個座標判斷是否位於頂點所定義的多邊形內或邊界上，回傳與座標網格同尺寸的 logical 遮罩。 `inpolygon` 判斷每個座標是否落在多邊形內，輸出 logical 遮罩。 這行的資料是：`xGrid`：96×96 double，水平座標；`yGrid`：96×96 double，垂直座標；`mask`：96×96 logical，圖形前景。

**第 124 行**：處理教材設定範圍外的其他標籤。 `else` 接住前面條件之外的情況，讓流程仍有明確處理方式。

**第 125 行**：回報包含標籤的可辨識錯誤。 `error` 以固定識別碼與訊息停止流程，方便使用者回報精確原因。 這行的資料是：`label`：string 純量，circle、triangle 或 square。

**第 126 行**：結束圖形類別判斷。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 127 行**：逐一處理前景三個色彩通道。 `for` 建立迴圈；迴圈變數會依序取用右側序列中的每個值。

**第 128 行**：取出目前色彩通道。 索引中的 `:` 代表該維度全部元素；例如 `X(:,2)` 會取全部資料列的第 2 欄。 這行的資料是：`rgbImage`：96×96×3 uint8，輸出 RGB 影像。 小例子：例如 `A(:,2)` 代表取 A 的全部資料列與第 2 欄。

**第 129 行**：將圖形遮罩內像素設為固定前景值。 這行的資料是：`foreground`：1×3 uint8，固定圖形色；`mask`：96×96 logical，圖形前景。

**第 130 行**：將修改後通道放回影像。 索引中的 `:` 代表該維度全部元素；例如 `X(:,2)` 會取全部資料列的第 2 欄。 這行的資料是：`rgbImage`：96×96×3 uint8，輸出 RGB 影像。 小例子：例如 `A(:,2)` 代表取 A 的全部資料列與第 2 欄。

**第 131 行**：結束前景通道迴圈。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 132 行**：結束單張圖形繪製函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「依標籤畫形狀並填色」後，下一段進入「正多邊形頂點」。

### 第 11 段：正多邊形頂點（第 134–139 行）

本段目的：完成「正多邊形頂點」，讓這組程式成為前後相接的一個工作單位。

```matlab
function [pointX,pointY] = polygonPoints(centerX,centerY,radius,angle,sideCount) % 定義正多邊形頂點計算函式。
steps = 0:(sideCount - 1); % 建立從零開始的頂點序號。
theta = angle + 2 .* pi .* steps ./ sideCount; % 計算各頂點角度。
pointX = centerX + radius .* cos(theta); % 計算各頂點水平座標。
pointY = centerY + radius .* sin(theta); % 計算各頂點垂直座標。
end % 結束多邊形頂點函式。
```

段內逐行說明：

**第 134 行**：定義正多邊形頂點計算函式。 `function` 宣告 `polygonPoints`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`centerX`：純量 double，多邊形中心 X；`centerY`：純量 double，多邊形中心 Y；`radius`：純量 double，中心到頂點距離；`angle`：純量 double，旋轉弧度；`sideCount`：純量整數，邊數 3 或 4。

**第 135 行**：建立從零開始的頂點序號。 這行的資料是：`sideCount`：純量整數，邊數 3 或 4；`steps`：1×sideCount double，從 0 起算的頂點序號。

**第 136 行**：計算各頂點角度。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 這行的資料是：`angle`：純量 double，旋轉弧度；`sideCount`：純量整數，邊數 3 或 4；`steps`：1×sideCount double，從 0 起算的頂點序號；`theta`：1×sideCount double，各頂點弧度。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 137 行**：計算各頂點水平座標。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 這行的資料是：`centerX`：純量 double，多邊形中心 X；`radius`：純量 double，中心到頂點距離；`theta`：1×sideCount double，各頂點弧度；`pointX`：1×sideCount double，頂點 X。 小例子：例如 `[2 4] .* [3 5]` 會得到 `[6 20]`，每個位置各自相乘。

**第 138 行**：計算各頂點垂直座標。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 這行的資料是：`centerY`：純量 double，多邊形中心 Y；`radius`：純量 double，中心到頂點距離；`theta`：1×sideCount double，各頂點弧度；`pointY`：1×sideCount double，頂點 Y。 小例子：例如 `[2 4] .* [3 5]` 會得到 `[6 20]`，每個位置各自相乘。

**第 139 行**：結束多邊形頂點函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「正多邊形頂點」後，下一段進入「解碼像素簽章」。

### 第 12 段：解碼像素簽章（第 141–149 行）

本段目的：完成「解碼像素簽章」，讓這組程式成為前後相接的一個工作單位。

```matlab
function signature = pixelSignature(path) % 定義依解碼像素內容建立的精確影像簽章。
rgbImage = imread(path); % 從檔案解碼實際影像像素。
if size(rgbImage,3) == 1 % 檢查影像是否意外為單通道。
    rgbImage = repmat(rgbImage,1,1,3); % 將單通道複製成三通道 RGB。
end % 結束通道數統一條件。
sizePrefix = sprintf('%dx%dx%d:',size(rgbImage,1),size(rgbImage,2),size(rgbImage,3)); % 將影像尺寸納入簽章。
pixelHex = sprintf('%02x',rgbImage(:)); % 將所有解碼像素轉成可精確比較的十六進位字串。
signature = [sizePrefix pixelHex]; % 合併尺寸與完整像素內容。
end % 結束像素簽章函式。
```

段內逐行說明：

**第 141 行**：定義依解碼像素內容建立的精確影像簽章。 `function` 宣告 `pixelSignature`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`path`：字元路徑，單張 PNG；`signature`：字元向量，尺寸與像素合併後的精確簽章。

**第 142 行**：從檔案解碼實際影像像素。 `imread` 從 PNG 解碼實際像素；RGB 圖通常得到 H×W×3 uint8，第三維依序是紅、綠、藍。 `imread` 從影像檔解碼像素陣列。 這行的資料是：`path`：字元路徑，單張 PNG；`rgbImage`：H×W×3 uint8，解碼後像素。

**第 143 行**：檢查影像是否意外為單通道。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 這行的資料是：`rgbImage`：H×W×3 uint8，解碼後像素。

**第 144 行**：將單通道複製成三通道 RGB。 `repmat` 依指定次數複製同一字串；這裡先建立與測試筆數相同的預設解釋欄，再用 logical 索引改寫部分列。 `repmat` 依列、欄次數複製同一陣列。 這行的資料是：`rgbImage`：H×W×3 uint8，解碼後像素。

**第 145 行**：結束通道數統一條件。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 146 行**：將影像尺寸納入簽章。 三個 `%d` 依序寫入高度、寬度、通道數，例如 `96x96x3:`；尺寸前綴可避免不同形狀陣列只因攤平值相同而被視為同一影像。 這行的資料是：`rgbImage`：H×W×3 uint8，解碼後像素；`sizePrefix`：字元向量，保存 H×W×C。

**第 147 行**：將所有解碼像素轉成可精確比較的十六進位字串。 `rgbImage(:)` 依 MATLAB 欄優先順序攤平成一欄；`%02x` 把每個 uint8 轉成兩位十六進位，完整像素內容因此可逐字比較。 這行的資料是：`rgbImage`：H×W×3 uint8，解碼後像素；`pixelHex`：字元向量，全部像素十六進位內容。

**第 148 行**：合併尺寸與完整像素內容。 這行的資料是：`sizePrefix`：字元向量，保存 H×W×C；`pixelHex`：字元向量，全部像素十六進位內容；`signature`：字元向量，尺寸與像素合併後的精確簽章。

**第 149 行**：結束像素簽章函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「解碼像素簽章」後，下一段進入「解析 manifest 路徑」。

### 第 13 段：解析 manifest 路徑（第 151–159 行）

本段目的：完成「解析 manifest 路徑」，讓這組程式成為前後相接的一個工作單位。

```matlab
function paths = resolvePaths(outputDir,relativePaths) % 定義 manifest 相對路徑解析函式。
paths = cell(numel(relativePaths),1); % 配置完整路徑儲存格欄向量。
for index = 1:numel(relativePaths) % 逐筆處理 manifest 路徑。
    paths{index} = fullfile(outputDir,char(relativePaths(index))); % 將相對路徑接在固定案例輸出根目錄下。
    if ~isfile(paths{index}) % 檢查 manifest 指向的影像是否存在。
        error('Tutorial:MissingImage','請提供影像檔：%s',paths{index}); % 回報包含完整路徑的檔案需求。
    end % 結束影像存在檢查。
end % 結束路徑解析迴圈。
end % 結束 manifest 路徑解析函式。
```

段內逐行說明：

**第 151 行**：定義 manifest 相對路徑解析函式。 `function` 宣告 `resolvePaths`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`outputDir`：字元路徑，案例輸出根目錄；`relativePaths`：N×1 string，manifest 相對路徑；`paths`：N×1 cell，解析後完整路徑。

**第 152 行**：配置完整路徑儲存格欄向量。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 `cell(m,n)` 建立 m×n cell；每格可存放路徑字元向量等資料。 這行的資料是：`relativePaths`：N×1 string，manifest 相對路徑；`paths`：N×1 cell，解析後完整路徑。

**第 153 行**：逐筆處理 manifest 路徑。 `for` 建立迴圈；迴圈變數會依序取用右側序列中的每個值。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 這行的資料是：`relativePaths`：N×1 string，manifest 相對路徑。

**第 154 行**：將相對路徑接在固定案例輸出根目錄下。 大括號 `{}` 會建立或取出 cell/table 內容；用途取決於它出現在資料右側或索引位置。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 `char` 將 string 純量轉成字元向量，供 Java 或舊式 MATLAB 介面使用。 這行的資料是：`outputDir`：字元路徑，案例輸出根目錄；`relativePaths`：N×1 string，manifest 相對路徑；`paths`：N×1 cell，解析後完整路徑。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

**第 155 行**：檢查 manifest 指向的影像是否存在。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 大括號 `{}` 會建立或取出 cell/table 內容；用途取決於它出現在資料右側或索引位置。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。 `isfile` 檢查指定路徑是否指向現有檔案。 這行的資料是：`paths`：N×1 cell，解析後完整路徑。

**第 156 行**：回報包含完整路徑的檔案需求。 大括號 `{}` 會建立或取出 cell/table 內容；用途取決於它出現在資料右側或索引位置。 `error` 以固定識別碼與訊息停止流程，方便使用者回報精確原因。 這行的資料是：`paths`：N×1 cell，解析後完整路徑。

**第 157 行**：結束影像存在檢查。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 158 行**：結束路徑解析迴圈。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 159 行**：結束 manifest 路徑解析函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「解析 manifest 路徑」後，下一段進入「讀圖、前景與空前景防護」。

### 第 14 段：讀圖、前景與空前景防護（第 161–168 行）

本段目的：完成「讀圖、前景與空前景防護」，讓這組程式成為前後相接的一個工作單位。

```matlab
function features = extractFeatures(path) % 定義單張影像的三個可解釋特徵。
rgbImage = imread(path); % 從 manifest 指定路徑讀取影像。
brightness = mean(double(rgbImage),3); % 計算每個像素三通道平均亮度。
foreground = brightness < 128; % 以固定亮度門檻找出深色圖形。
area = nnz(foreground); % 計算圖形像素面積。
if area == 0 % 檢查影像前景像素數是否為零。
    error('Tutorial:EmptyForeground','影像前景像素數為零：%s',path); % 回報包含路徑的空前景錯誤。
end % 結束空前景檢查。
```

段內逐行說明：

**第 161 行**：定義單張影像的三個可解釋特徵。 `function` 宣告 `extractFeatures`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`path`：字元路徑，單張 PNG；`features`：1×3 double，三個特徵。

**第 162 行**：從 manifest 指定路徑讀取影像。 `imread` 從 PNG 解碼實際像素；RGB 圖通常得到 H×W×3 uint8，第三維依序是紅、綠、藍。 `imread` 從影像檔解碼像素陣列。 這行的資料是：`path`：字元路徑，單張 PNG；`rgbImage`：96×96×3 uint8，讀入影像。

**第 163 行**：計算每個像素三通道平均亮度。 `mean` 計算平均值；第二個參數可指定沿哪個維度計算。 這行的資料是：`rgbImage`：96×96×3 uint8，讀入影像；`brightness`：96×96 double，RGB 三通道平均亮度。

**第 164 行**：以固定亮度門檻找出深色圖形。 這行的資料是：`brightness`：96×96 double，RGB 三通道平均亮度；`foreground`：96×96 logical，深色圖形遮罩。

**第 165 行**：計算圖形像素面積。 `nnz` 計算非零或 `true` 元素數量。 這行的資料是：`foreground`：96×96 logical，深色圖形遮罩；`area`：純量整數，前景像素數。 小例子：例如遮罩中有 12 個 `true`，`nnz(mask)` 就回傳 12。

**第 166 行**：檢查影像前景像素數是否為零。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 這行的資料是：`area`：純量整數，前景像素數。

**第 167 行**：回報包含路徑的空前景錯誤。 `error` 以固定識別碼與訊息停止流程，方便使用者回報精確原因。 這行的資料是：`path`：字元路徑，單張 PNG。

**第 168 行**：結束空前景檢查。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「讀圖、前景與空前景防護」後，下一段進入「邊界與三個可解釋特徵」。

### 第 15 段：邊界與三個可解釋特徵（第 169–183 行）

本段目的：完成「邊界與三個可解釋特徵」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 169 行**：建立四周多一圈背景的遮罩。 `false(m,n)` 建立 m×n logical 陣列，所有初始值都是 `false`。 這行的資料是：`foreground`：96×96 logical，深色圖形遮罩。

**第 170 行**：將原始前景放入中央。 這行的資料是：`foreground`：96×96 logical，深色圖形遮罩。

**第 171 行**：取出中央前景區域。

**第 172 行**：取出每個像素上方鄰居。

**第 173 行**：取出每個像素下方鄰居。

**第 174 行**：取出每個像素左方鄰居。

**第 175 行**：取出每個像素右方鄰居。

**第 176 行**：計算四方向暴露邊界長度。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。 `nnz` 計算非零或 `true` 元素數量。 這行的資料是：`perimeter`：純量整數，四方向暴露邊長。 小例子：例如遮罩中有 12 個 `true`，`nnz(mask)` 就回傳 12。

**第 177 行**：取得所有前景像素座標。 `find` 回傳條件為 `true` 的索引位置。 這行的資料是：`foreground`：96×96 logical，深色圖形遮罩。

**第 178 行**：計算外接矩形面積。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 這行的資料是：`boxArea`：純量整數，外接矩形面積。 小例子：例如 `[2 4] .* [3 5]` 會得到 `[6 20]`，每個位置各自相乘。

**第 179 行**：計算圖形填滿外接矩形的比例。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 這行的資料是：`area`：純量整數，前景像素數；`boxArea`：純量整數，外接矩形面積；`fillRatio`：純量 double，前景占外接框比例。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 180 行**：計算近似圓形度。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 `.^` 代表每個元素各自做次方運算。 這行的資料是：`area`：純量整數，前景像素數；`perimeter`：純量整數，四方向暴露邊長；`circularity`：純量 double，4πA/P²。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 181 行**：計算圖形占整張影像的比例。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 這行的資料是：`foreground`：96×96 logical，深色圖形遮罩；`area`：純量整數，前景像素數；`areaRatio`：純量 double，前景占全圖比例。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 182 行**：依固定順序回傳三個特徵。 這行的資料是：`fillRatio`：純量 double，前景占外接框比例；`circularity`：純量 double，4πA/P²；`areaRatio`：純量 double，前景占全圖比例；`features`：1×3 double，三個特徵。

**第 183 行**：結束特徵抽取函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「邊界與三個可解釋特徵」後，下一段進入「三近鄰投票」。

### 第 16 段：三近鄰投票（第 185–198 行）

本段目的：完成「三近鄰投票」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 185 行**：定義以 base MATLAB 自行實作的近鄰分類器。 `function` 宣告 `predictKnn`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`trainMatrix`：Ntrain×3 double，標準化 Train 特徵；`trainLabels`：Ntrain×1 string，Train 標籤；`sample`：1×3 double，目前 Test 樣本；`neighborCount`：純量整數，鄰居數 3；`prediction`：string 純量，最後預測標籤。

**第 186 行**：計算每筆 Train 特徵與目前樣本的差。 這行的資料是：`trainMatrix`：Ntrain×3 double，標準化 Train 特徵；`sample`：1×3 double，目前 Test 樣本；`differences`：Ntrain×3 double，各 Train 樣本與目前樣本的差。

**第 187 行**：計算歐幾里得距離。 `.^` 代表每個元素各自做次方運算。 先將 Ntrain×3 差值逐元素平方，`sum(...,2)` 沿每一列加總成 Ntrain×1，再開根號得到每張 Train 圖與目前樣本的歐幾里得距離。 這行的資料是：`differences`：Ntrain×3 double，各 Train 樣本與目前樣本的差；`distances`：Ntrain×1 double，歐幾里得距離。

**第 188 行**：依距離由近到遠取得索引。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。 `sort` 依指定方向排列資料，也能回傳原始位置索引。 這行的資料是：`distances`：Ntrain×1 double，歐幾里得距離；`order`：Ntrain×1 double，距離由近到遠索引。

**第 189 行**：取出最近三筆 Train 標籤。 這行的資料是：`trainLabels`：Ntrain×1 string，Train 標籤；`neighborCount`：純量整數，鄰居數 3；`order`：Ntrain×1 double，距離由近到遠索引；`neighborLabels`：3×1 string，最近三筆標籤。

**第 190 行**：取得鄰居中出現的候選標籤。 `unique` 取得資料中各種不同值。 這行的資料是：`neighborLabels`：3×1 string，最近三筆標籤。

**第 191 行**：配置各候選標籤票數。 `zeros(m,n)` 先配置 m×n 的全零陣列，之後再逐格填入結果。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 這行的資料是：`voteCounts`：候選類別數×1 double，票數。 小例子：例如 `zeros(2,3)` 會得到 2 列、3 欄的全零矩陣。

**第 192 行**：逐一統計候選標籤票數。 `for` 建立迴圈；迴圈變數會依序取用右側序列中的每個值。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。

**第 193 行**：計算目前標籤得票數。 `nnz` 計算非零或 `true` 元素數量。 這行的資料是：`neighborLabels`：3×1 string，最近三筆標籤；`voteCounts`：候選類別數×1 double，票數。 小例子：例如遮罩中有 12 個 `true`，`nnz(mask)` 就回傳 12。

**第 194 行**：結束投票統計迴圈。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 195 行**：找出最高票數。 這行的資料是：`voteCounts`：候選類別數×1 double，票數。

**第 196 行**：平手時依標籤文字固定排序。 `sort` 依指定方向排列資料，也能回傳原始位置索引。 這行的資料是：`voteCounts`：候選類別數×1 double，票數。

**第 197 行**：以最高票且固定平手規則的標籤作為預測。 這行的資料是：`prediction`：string 純量，最後預測標籤。

**第 198 行**：結束近鄰分類函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「三近鄰投票」後，下一段進入「多類別混淆矩陣」。

### 第 17 段：多類別混淆矩陣（第 200–207 行）

本段目的：完成「多類別混淆矩陣」，讓這組程式成為前後相接的一個工作單位。

```matlab
function matrix = multiclassConfusion(targets,predictions,labelOrder) % 定義三類別混淆矩陣函式。
matrix = zeros(numel(labelOrder)); % 建立類別數乘類別數的零矩陣。
for index = 1:numel(targets) % 逐筆配對真實與預測標籤。
    row = find(labelOrder == targets(index),1); % 找出真實標籤所在列。
    column = find(labelOrder == predictions(index),1); % 找出預測標籤所在欄。
    matrix(row,column) = matrix(row,column) + 1; % 在對應格子累加一筆。
end % 結束逐筆統計迴圈。
end % 結束多類別混淆矩陣函式。
```

段內逐行說明：

**第 200 行**：定義三類別混淆矩陣函式。 `function` 宣告 `multiclassConfusion`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`targets`：Ntest×1 string，真實標籤；`predictions`：Ntest×1 string，預測標籤；`labelOrder`：1×3 string，矩陣類別順序；`matrix`：3×3 double，列為真實、欄為預測。

**第 201 行**：建立類別數乘類別數的零矩陣。 `zeros(m,n)` 先配置 m×n 的全零陣列，之後再逐格填入結果。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 這行的資料是：`labelOrder`：1×3 string，矩陣類別順序；`matrix`：3×3 double，列為真實、欄為預測。 小例子：例如 `zeros(2,3)` 會得到 2 列、3 欄的全零矩陣。

**第 202 行**：逐筆配對真實與預測標籤。 `for` 建立迴圈；迴圈變數會依序取用右側序列中的每個值。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 這行的資料是：`targets`：Ntest×1 string，真實標籤。

**第 203 行**：找出真實標籤所在列。 `find` 回傳條件為 `true` 的索引位置。 這行的資料是：`targets`：Ntest×1 string，真實標籤；`labelOrder`：1×3 string，矩陣類別順序；`row`：純量整數，真實類別列索引。

**第 204 行**：找出預測標籤所在欄。 `find` 回傳條件為 `true` 的索引位置。 這行的資料是：`predictions`：Ntest×1 string，預測標籤；`labelOrder`：1×3 string，矩陣類別順序；`column`：純量整數，預測類別欄索引。

**第 205 行**：在對應格子累加一筆。 這行的資料是：`matrix`：3×3 double，列為真實、欄為預測；`row`：純量整數，真實類別列索引；`column`：純量整數，預測類別欄索引。

**第 206 行**：結束逐筆統計迴圈。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 207 行**：結束多類別混淆矩陣函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「多類別混淆矩陣」後，下一段進入「安全輸出路徑」。

### 第 18 段：安全輸出路徑（第 209–231 行）

本段目的：完成「安全輸出路徑」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 209 行**：定義限制輸出範圍的安全函式。 `function` 宣告 `ensureSafeOutput`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`projectRoot`：字元路徑，允許輸出的專案根目錄；`rawPath`：呼叫者提供的原始路徑；`outputDir`：字元路徑，驗證後的輸出位置。

**第 210 行**：檢查安全路徑正規化所需的 JVM 必要條件。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。

**第 211 行**：以固定識別碼清楚回報 JVM 必要條件。 `error` 以固定識別碼與訊息停止流程，方便使用者回報精確原因。

**第 212 行**：結束 JVM 前置條件檢查。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 213 行**：建立候選路徑物件以判斷路徑型態。 `char` 把 string 或字元輸入統一成 Java 可接收的字元向量；`java.io.File` 建立路徑物件，下一行用 `isAbsolute()` 判斷它是否為絕對路徑。 `char` 將 string 純量轉成字元向量，供 Java 或舊式 MATLAB 介面使用。 這行的資料是：`rawPath`：呼叫者提供的原始路徑；`rawFile`：Java File 物件，用來判斷絕對或相對路徑。

**第 214 行**：處理呼叫者提供的相對輸出路徑。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。 這行的資料是：`rawFile`：Java File 物件，用來判斷絕對或相對路徑。

**第 215 行**：將相對路徑固定接在本程式專案根目錄下。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 `char` 將 string 純量轉成字元向量，供 Java 或舊式 MATLAB 介面使用。 這行的資料是：`projectRoot`：字元路徑，允許輸出的專案根目錄；`rawPath`：呼叫者提供的原始路徑。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

**第 216 行**：結束相對路徑正規化條件。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 217 行**：取得專案根目錄標準路徑。 Java `getCanonicalPath()` 會整理 `.`、`..` 與可解析的符號連結，再轉回 MATLAB char；安全範圍比較使用這個標準化結果。 `char` 將 string 純量轉成字元向量，供 Java 或舊式 MATLAB 介面使用。 這行的資料是：`projectRoot`：字元路徑，允許輸出的專案根目錄；`rootPath`：字元路徑，canonical 專案根目錄。

**第 218 行**：取得候選輸出標準路徑。 Java `getCanonicalPath()` 會整理 `.`、`..` 與可解析的符號連結，再轉回 MATLAB char；安全範圍比較使用這個標準化結果。 `char` 將 string 純量轉成字元向量，供 Java 或舊式 MATLAB 介面使用。 這行的資料是：`rawPath`：呼叫者提供的原始路徑；`candidatePath`：字元路徑，canonical 候選輸出位置。

**第 219 行**：判斷是否為 Windows 路徑環境。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。

**第 220 行**：統一轉成小寫後檢查路徑範圍。 兩側都補上 `filesep` 再比前綴，可讓 `/project/out` 通過，同時避免把 `/project2` 誤認成 `/project` 內部；Windows 分支另先轉小寫。 `startsWith` 檢查第一段文字是否以第二段文字開頭。 這行的資料是：`rootPath`：字元路徑，canonical 專案根目錄；`candidatePath`：字元路徑，canonical 候選輸出位置；`isInside`：logical 純量，候選路徑是否位於專案內。

**第 221 行**：處理 macOS、Linux 與 MATLAB Online。 `else` 接住前面條件之外的情況，讓流程仍有明確處理方式。

**第 222 行**：區分大小寫檢查路徑範圍。 兩側都補上 `filesep` 再比前綴，可讓 `/project/out` 通過，同時避免把 `/project2` 誤認成 `/project` 內部；Windows 分支另先轉小寫。 `startsWith` 檢查第一段文字是否以第二段文字開頭。 這行的資料是：`rootPath`：字元路徑，canonical 專案根目錄；`candidatePath`：字元路徑，canonical 候選輸出位置；`isInside`：logical 純量，候選路徑是否位於專案內。

**第 223 行**：結束作業系統判斷。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 224 行**：檢查候選位置的教材專案範圍。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。 這行的資料是：`isInside`：logical 純量，候選路徑是否位於專案內。

**第 225 行**：回報固定識別碼錯誤。 `error` 以固定識別碼與訊息停止流程，方便使用者回報精確原因。

**第 226 行**：結束安全範圍檢查。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 227 行**：檢查輸出資料夾是否需要建立。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。 `isfolder` 檢查指定路徑是否指向現有資料夾。 這行的資料是：`candidatePath`：字元路徑，canonical 候選輸出位置。

**第 228 行**：建立資料夾並保留現有內容。 `mkdir` 建立指定資料夾；既有檔案保持原狀，程式只會覆寫自己使用的同名教材輸出。 這行的資料是：`candidatePath`：字元路徑，canonical 候選輸出位置。

**第 229 行**：結束資料夾建立條件。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 230 行**：回傳安全標準路徑。 這行的資料是：`candidatePath`：字元路徑，canonical 候選輸出位置；`outputDir`：字元路徑，驗證後的輸出位置。

**第 231 行**：結束安全輸出函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「安全輸出路徑」後，下一段進入「JSON 寫入」。

### 第 19 段：JSON 寫入（第 233–240 行）

本段目的：完成「JSON 寫入」，讓這組程式成為前後相接的一個工作單位。

```matlab
function writeJson(path,data) % 定義 JSON 寫入函式。
fileID = fopen(path,'w','n','UTF-8'); % 以 UTF-8 開啟輸出檔。
if fileID < 0 % 檢查摘要檔開啟狀態。
    error('Tutorial:FileWrite','摘要檔寫入受阻：%s',path); % 回報包含路徑的寫檔錯誤。
end % 結束開檔檢查。
cleaner = onCleanup(@() fclose(fileID)); % 確保函式結束時關閉檔案。
fprintf(fileID,'%s',jsonencode(data,'PrettyPrint',true)); % 將結構編碼並寫成易讀 JSON。
end % 結束 JSON 寫入函式。
```

段內逐行說明：

**第 233 行**：定義 JSON 寫入函式。 `function` 宣告 `這個函式`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。

**第 234 行**：以 UTF-8 開啟輸出檔。 `'w'` 以寫入模式開檔並覆寫同名教材輸出，`'n'` 使用原生位元組順序，`'UTF-8'` 指定文字編碼；回傳負值代表開檔受阻。

**第 235 行**：檢查摘要檔開啟狀態。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。

**第 236 行**：回報包含路徑的寫檔錯誤。 `error` 以固定識別碼與訊息停止流程，方便使用者回報精確原因。

**第 237 行**：結束開檔檢查。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 238 行**：確保函式結束時關閉檔案。 `@()` 建立零輸入匿名函式，內容是 `fclose(fileID)`；`onCleanup` 物件離開函式作用域時會呼叫它，即使後續發生錯誤也會嘗試關檔。

**第 239 行**：將結構編碼並寫成易讀 JSON。 `jsonencode` 把 struct 轉成 JSON；名稱值參數 `'PrettyPrint',true` 加入縮排與換行，外層 `fprintf(fileID,'%s',...)` 將整段文字寫入已開啟檔案。 `fprintf` 依格式字串輸出文字；`%d`、`%.3f` 等位置會由後續變數填入。 `jsonencode` 把 struct 轉成 JSON 文字，便於跨工具閱讀。

**第 240 行**：結束 JSON 寫入函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

## 二、可直接貼給 GPT／Claude 的逐段解說提示詞

```text
請閱讀我貼上的完整 MATLAB 檔 `case3_shape_classifier_matlab.m`，為零資訊背景同學撰寫台灣慣用、口語但精簡的繁體中文逐段教材，並在每一段內逐段解說（段內逐行）。

請遵守以下格式：
1. 依資料準備、主要運算、評估、輸出與各個區域函式的實際控制流程分段；分段依邏輯決定，避免固定每幾行切一段。
2. 每段先寫一句目的，再貼出該段完整原始程式碼與行號範圍；延續運算式與它相接的控制流程放在同一段。
3. 每段的程式區塊只貼一次，接著依「第 N 行」用段落逐行說明；空白行計入行號，每個非空行恰好說明一次。
4. 每行說明要涵蓋實際工作、重要符號與參數、變數型態與尺寸、輸入與輸出，以及它在整體流程中的目的。
5. 遇到索引、矩陣、logical、table、cell、struct、函式、if、for、while、end、...、.*、./、.^、~、冒號與大括號時，提供小型數值例子。
6. 延續行、end、欄名、註解與錯誤處理都要解說；各段之間只在有助理解時加入一句銜接。
7. 只描述程式真正做的事；執行結果由 MATLAB 實際輸出確認，並保留資料洩漏、合成資料外推、比例設定與模型估計的限制。
8. 解說完成後，加上如何執行、如何檢查輸出，以及如何填寫 `CASE3_REPORT_TEMPLATE.md`。

請先回報分段數、總行數、非空行數與第一行函式名稱，再開始逐段解說；完成後再次核對每個非空行只出現一次。
```

## 三、行號與分段更新規則

程式碼有任何改動時，請重新從最終 `.m` 讀取實體行號、依新控制流程檢查分段、重算 SHA-256，再完整重建本文件。這樣每段程式碼與段內第 N 行都會持續對應可執行來源。
