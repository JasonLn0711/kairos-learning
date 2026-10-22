# 案例一逐段教學：虛構設備感測分類

教材 1.8 · 2026-10-22。先完成 [小任務](CASE1_QUICKSTART.md)，再讀完整流程與逐段解說（段內逐行）。

## 先看全程｜從感測資料到一份說得清楚的分類報告

### 這個案例要完成什麼？

我們用虛構設備的溫度、振動與電流，判斷設備是「正常」還是「需要檢查」。你要走完的流程是：看懂資料 → 分開練習與測試資料 → 訓練一個分類模型 → 檢查判斷結果 → 把做法與證據整理成報告。

本案例是「助教實作方式」。正式題一從題目列出的四個資料集中選一個，選用一種分類方法，以 80% 訓練、20% 測試，並以測試正確率 90% 為目標。以下先用合成設備資料練習完整流程，再將方法帶回自己選的正式資料。

### 從頭到尾，依序做這 8 件事

#### 步驟 1：確定執行入口

例子：把完整函式視為整套參考答案。

操作：先備妥檔案，確認程式從哪裡執行。 把教材解壓縮，進入 matlab_edition，開啟 case1_sensor_classifier_matlab.m。先讀以下段落，再依後面的四階段提示詞逐步建立自己的版本。完整參考版可在 Command Window 輸入 s = case1_sensor_classifier_matlab;。產物放在 matlab_artifacts/case1；每次重跑會更新同名範例輸出。

結果：Current Folder 指向 matlab_edition，產物集中在 case1。

解釋：函式以自己的檔案位置決定輸出目錄。

下一步：進入步驟 2。

#### 步驟 2：讀懂一列的意義

例子：DEV-0001 的溫度、振動、電流屬於同一筆。

操作：先說清楚，一列資料代表什麼。 打開 synthetic_sensor_data.csv，確認一列是一台虛構設備，總共 240 筆；deviceID 是識別碼，溫度、振動與電流是用來判斷的三個特徵，label 是已知答案。用自己的話寫下「我要判斷什麼、靠哪些資訊判斷」，這就是報告分析邏輯的起點。

結果：指出三個數值欄與一個答案欄。

解釋：一列一筆，欄位各自描述同一台虛構設備。

下一步：進入步驟 3。

#### 步驟 3：把輸入與答案分開

例子：vibrationMmS 是輸入，label 是核對答案。

操作：選出特徵，說明選擇理由。 本例使用三個感測數值，識別碼用來追蹤資料，答案欄用來訓練與核對。報告要交代每個特徵的意思，以及它和分類問題的關係；換成正式資料時，重新確認欄位、單位、缺值與答案定義。

結果：列出三個特徵及其單位。

解釋：識別碼供追蹤，分類器以感測值建立判斷。

下一步：進入步驟 4。

#### 步驟 4：把評估題目先留出來

例子：240 筆分為 192 與 48 筆。

操作：先分好資料，再準備模型的輸入。 程式依類別分層，取 192 筆訓練、48 筆測試。只用訓練資料算平均值與標準差，再用同一組數值轉換測試資料。到 summary.json 核對筆數、比例、trainIDs、testIDs 與 trainTestOverlap；交集應為空。這一步就像先把練習題和最後要考的題目分開。

結果：切分筆數正確，trainTestOverlap 為空。

解釋：測試資料沿用訓練集的平均值與標準差，才保持評估邊界。

下一步：進入步驟 5。

#### 步驟 5：建立從數值到類別的規則

例子：較大的模型估計值可能跨過分類門檻。

操作：用訓練資料，讓一個模型學會分類。 本例採教學用簡化羅吉斯分類器，依三個特徵調整權重，產生判為「需要檢查」的模型估計，再依門檻轉成類別。閱讀訓練段落時，弄清楚特徵、答案、權重各自扮演的角色；把選用這個方法的理由寫進分析邏輯。

結果：得到權重與各筆分類估計。

解釋：權重由訓練資料調整，分類門檻把估計值轉為類別。

下一步：進入步驟 6。

#### 步驟 6：同時看答對比例與漏判

例子：93.75% 正確率仍可能只有 50% 正類召回率。

操作：拿測試資料驗算，找出模型判錯的地方。 打開 test_predictions.csv，逐筆對照真實答案與預測；再看 summary.json 的正確率、混淆矩陣與正類召回率。本機參考結果為正確率 93.75%，需檢查設備找出 2／4 筆、召回率 50%。報告同時呈現兩者，說明整體答對比例與漏判情況；自己的報告填入自己實際跑出的數字。

結果：自己的逐筆結果能對回摘要。

解釋：正確率看全部樣本，召回率看需檢查設備找回多少。

下一步：進入步驟 7。

#### 步驟 7：保存可重查的執行結果

例子：以一筆 test_predictions.csv 對回原始設備。

操作：把過程留下來，讓別人能跟著核對。 保存程式、資料、摘要與預測檔，截取特徵選取、80／20 切分、訓練及測試結果的相關程式畫面。使用三案完整包時，可執行 run_matlab_tests 檢查教材參考版；自己改過的程式，另核對欄位、資料切分與結果是否對得起來。

結果：程式、CSV 與摘要屬於同一次執行。

解釋：完整證據讓報告數字有可核對的依據。

下一步：進入步驟 8。

#### 步驟 8：對齊正式交件內容

例子：分析邏輯要說明選用哪些資訊判斷。

操作：依正式題目的四個部分組成 PDF。 依序寫「分析邏輯、特徵選取、程式碼截圖、測試結果」，可用 CASE1_REPORT_TEMPLATE.md 作為整理骨架。90% 是目標，結果照實呈現，並說明表現與可改善處。最後開啟匯出的 PDF，確認圖片清楚、數字與輸出檔一致，再依課程指定方式交件；正式資料與繳交管道以題目及課務公告為準。

結果：四部分 PDF 的圖與數字清楚可讀。

解釋：本案練習提供方法，正式資料與繳交要求依課務公告。

下一步：查閱逐段解說（段內逐行），再依自己的疑問使用提示詞。

### 做完時，你手上應該有什麼？

- 練習過程：一支能執行的 `.m`、合成資料 CSV、逐筆預測 CSV、`summary.json`。
- 報告證據：特徵選擇理由、80／20 切分說明、程式截圖、真實測試結果與錯誤解讀。
- 正式交件：以自己選定的正式資料完成上述流程，再整理成題目指定的四部分 PDF。合成練習檔保留作為方法參考。

接著從第一段程式開始看：每段先讀完整程式，再逐行弄清楚它如何完成上面的一步。

## 一、逐段解說（段內逐行）

來源程式：`case1_sensor_classifier_matlab.m`｜共 148 個實體行、142 個非空行｜SHA-256：`af5b2e47437e3066cb2813b2a829b25ee5af6954eedcd395d5dbc4ddbd02e0f3`

這支程式會合成設備感測表格，依標籤分層切成 80% Train Set 與 20% Test Set，只用 Train Set 計算標準化參數，再訓練簡單分類模型並輸出逐筆結果。

以下依實際工作流程分成 11 段。每段先保留一個完整原始碼區塊，再在同一段內逐行說明；「第 N 行」直接對應來源檔實體行號。每個非空行恰好說明一次；段內原始行保留，函式間空白以段落區隔。

### 第 1 段：輸出路徑與安全根目錄（第 1–6 行）

本段目的：完成「輸出路徑與安全根目錄」，讓這組程式成為前後相接的一個工作單位。

```matlab
function summary = case1_sensor_classifier_matlab(outputDir) % 定義案例一主函式，回傳可供測試核對的摘要。
projectRoot = fileparts(mfilename('fullpath')); % 以本程式所在資料夾作為明確專案根目錄。
if nargin < 1 % 呼叫者省略輸出資料夾時套用預設值。
    outputDir = fullfile(projectRoot,'matlab_artifacts','case1'); % 使用專案內固定的預設輸出位置。
end % 結束預設路徑條件。
outputDir = ensureSafeOutput(projectRoot,outputDir); % 驗證路徑位於 MATLAB 教材資料夾內並建立資料夾。
```

段內逐行說明：

**第 1 行**：定義案例一主函式，回傳可供測試核對的摘要。 `function` 宣告 `case1_sensor_classifier_matlab`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`outputDir`：字元路徑，案例一輸出資料夾；`summary`：struct，保存切分、指標與限制。

**第 2 行**：以本程式所在資料夾作為明確專案根目錄。 `=` 是指定運算：先算右側 `fileparts(mfilename('fullpath'))`，再把結果存進左側 `projectRoot`。 行尾 `;` 會結束敘述，並讓 MATLAB Command Window 保持簡潔。 `mfilename('fullpath')` 回傳目前函式檔的完整路徑與檔名；外層 `fileparts` 取出資料夾部分，因此後續相對路徑都以教材檔所在位置為基準。 這行的資料是：`projectRoot`：字元路徑，本 `.m` 檔所在資料夾。

**第 3 行**：呼叫者省略輸出資料夾時套用預設值。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `nargin` 是這次呼叫實際收到的輸入數。直接輸入函式名稱時為 0，`0 < 1` 成立並進入預設路徑分支；傳入一個輸出路徑時為 1，條件為 false，MATLAB 直接跳到配對的 `end`。

**第 4 行**：使用專案內固定的預設輸出位置。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 這行的資料是：`outputDir`：字元路徑，案例一輸出資料夾；`projectRoot`：字元路徑，本 `.m` 檔所在資料夾。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

**第 5 行**：結束預設路徑條件。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 6 行**：驗證路徑位於 MATLAB 教材資料夾內並建立資料夾。 這行的資料是：`outputDir`：字元路徑，案例一輸出資料夾；`projectRoot`：字元路徑，本 `.m` 檔所在資料夾。

段落銜接：完成「輸出路徑與安全根目錄」後，下一段進入「合成感測資料並寫入、讀回 CSV」。

### 第 2 段：合成感測資料並寫入、讀回 CSV（第 7–22 行）

本段目的：完成「合成感測資料並寫入、讀回 CSV」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 7 行**：固定 MATLAB 亂數種子與演算法，讓資料可重現。 `rng` 固定亂數種子與演算法；相同資料與環境下可重現相同亂數序列。 小例子：連續兩次先執行相同 `rng(seed,'twister')`，後續第一組亂數會依相同順序產生。

**第 8 行**：設定虛構設備資料筆數。 這行的資料是：`rowCount`：純量整數，固定為 240。

**第 9 行**：建立一到二百四十的設備流水號。 冒號運算子 `1:rowCount` 先建立 1×240 列向量 `[1 2 ... 240]`；外層小括號先固定運算範圍，尾端撇號再轉置成 240×1 欄向量，讓每個流水號對應 table 的一列。 這行的資料是：`rowCount`：純量整數，固定為 240；`deviceNumber`：240×1 double，設備流水號。

**第 10 行**：建立與標籤資訊分離的設備識別字串。 `compose` 逐筆套用格式；`%04d` 把整數補成四位，例如 7 會成為 `DEV-0007`。這個 ID 只表示流水號，字串本身不含標籤。 這行的資料是：`deviceNumber`：240×1 double，設備流水號；`deviceID`：240×1 string，中性設備識別碼。

**第 11 行**：產生虛構攝氏溫度。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 `randn(rowCount,1)` 產生 240×1 標準常態亂數；逐元素乘以 8 調整散布，再加 66 平移中心，得到 240 筆虛構溫度。 `randn` 產生常態分布亂數；尺寸參數決定輸出列數與欄數。 這行的資料是：`rowCount`：純量整數，固定為 240；`temperatureC`：240×1 double，虛構攝氏溫度。 小例子：例如 `[2 4] .* [3 5]` 會得到 `[6 20]`，每個位置各自相乘。

**第 12 行**：先算 max(0.1,-0.3) 得到 0.1；對照 max(0.1,4.3) 則得到 4.3。完整式先產生 240 筆亂數，乘 1.1、加 3.2，再與 0.1 逐筆取較大值。0.1 是合成教材下限；設備警戒值另依設備規格設定。 產生下限為零點一的虛構振動值。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 `randn` 產生常態分布亂數；尺寸參數決定輸出列數與欄數。 這行的資料是：`rowCount`：純量整數，固定為 240；`vibrationMmS`：240×1 double，虛構振動速度。 小例子：例如 `[2 4] .* [3 5]` 會得到 `[6 20]`，每個位置各自相乘。

**第 13 行**：產生下限為零點五的虛構電流值。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 `randn` 產生常態分布亂數；尺寸參數決定輸出列數與欄數。 這行的資料是：`rowCount`：純量整數，固定為 240；`currentA`：240×1 double，虛構電流。 小例子：例如 `[2 4] .* [3 5]` 會得到 `[6 20]`，每個位置各自相乘。

**第 14 行**：計算虛構溫度風險分數。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 這行的資料是：`temperatureC`：240×1 double，虛構攝氏溫度；`riskScore`：240×1 double，合成標籤用的虛構分數。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 15 行**：加入虛構振動風險分數。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 這行的資料是：`vibrationMmS`：240×1 double，虛構振動速度；`riskScore`：240×1 double，合成標籤用的虛構分數。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 16 行**：加入虛構電流風險分數。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 這行的資料是：`currentA`：240×1 double，虛構電流；`riskScore`：240×1 double，合成標籤用的虛構分數。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 17 行**：加入雜訊避免單一硬門檻。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 `randn` 產生常態分布亂數；尺寸參數決定輸出列數與欄數。 這行的資料是：`rowCount`：純量整數，固定為 240；`riskScore`：240×1 double，合成標籤用的虛構分數。 小例子：例如 `[2 4] .* [3 5]` 會得到 `[6 20]`，每個位置各自相乘。

**第 18 行**：將一設為需檢查、零設為正常。 這行的資料是：`riskScore`：240×1 double，合成標籤用的虛構分數；`label`：240×1 double，0 為正常、1 為需檢查。

**第 19 行**：將識別欄、特徵與標籤組成表格。 `table` 把同列數的欄位組成表格，每一列是一筆樣本。 這行的資料是：`deviceID`：240×1 string，中性設備識別碼；`temperatureC`：240×1 double，虛構攝氏溫度；`vibrationMmS`：240×1 double，虛構振動速度；`currentA`：240×1 double，虛構電流；`label`：240×1 double，0 為正常、1 為需檢查。 小例子：若三個欄向量各有 10 列，組成的 table 也會有 10 筆資料。

**第 20 行**：指定合成感測資料檔名。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 這行的資料是：`outputDir`：字元路徑，案例一輸出資料夾。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

**第 21 行**：將完整合成資料寫成 CSV。 `writetable` 把 table 欄名與每一列資料寫入指定 CSV；後續再讀回，可驗證流程使用的是落盤資料。 `writetable` 把 table 寫入指定檔案，方便檢查與交接。 這行的資料是：`sensorTable`：240×5 table，完整合成資料。 小例子：若三個欄向量各有 10 列，組成的 table 也會有 10 筆資料。

**第 22 行**：從 CSV 實際讀回資料並將文字讀成 string。 `readtable` 真的從 CSV 讀回 table；`'TextType','string'` 指定文字欄使用 string，後續比較與輸出型態會一致。 `readtable` 從檔案讀取表格；輸出是 MATLAB table。 這行的資料是：`loadedTable`：240×5 table，從 CSV 讀回的資料。 小例子：若三個欄向量各有 10 列，組成的 table 也會有 10 筆資料。

段落銜接：完成「合成感測資料並寫入、讀回 CSV」後，下一段進入「分層切分與 Train-only 標準化」。

### 第 3 段：分層切分與 Train-only 標準化（第 23–34 行）

本段目的：完成「分層切分與 Train-only 標準化」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 23 行**：依正式題目邏輯設定百分之二十保留測試比例。 這行的資料是：`testRatio`：純量 double，固定為 0.20。 小例子：若共有 100 筆資料，目標約為 80 筆 Train、20 筆 Test；分層切分會在各類別內分別計算。

**第 24 行**：依標籤分層切成百分之八十訓練與百分之二十測試。 這行的資料是：`loadedTable`：240×5 table，從 CSV 讀回的資料；`testRatio`：純量 double，固定為 0.20；`trainIndex`：約 80% 資料列的索引向量；`testIndex`：約 20% 資料列的索引向量。

**第 25 行**：依索引建立訓練資料表。 這行的資料是：`loadedTable`：240×5 table，從 CSV 讀回的資料；`trainIndex`：約 80% 資料列的索引向量；`trainTable`：Train 筆數×5 table。

**第 26 行**：依索引建立保留測試資料表。 這行的資料是：`loadedTable`：240×5 table，從 CSV 讀回的資料；`testIndex`：約 20% 資料列的索引向量；`testTable`：Test 筆數×5 table。

**第 27 行**：固定模型會使用的三個特徵名稱。 大括號 `{}` 會建立或取出 cell/table 內容；用途取決於它出現在資料右側或索引位置。 這行的資料是：`featureNames`：1×3 cell，模型使用的欄位名稱。

**第 28 行**：取出訓練特徵矩陣。 索引中的 `:` 代表該維度全部元素；例如 `X(:,2)` 會取全部資料列的第 2 欄。 大括號 `{}` 會建立或取出 cell/table 內容；用途取決於它出現在資料右側或索引位置。 table 的大括號索引會取出欄位內容而非子 table；第一維 `:` 取全部資料列，第二維用三個欄名選欄，所以結果是 N×3 double 矩陣。 這行的資料是：`trainTable`：Train 筆數×5 table；`featureNames`：1×3 cell，模型使用的欄位名稱；`trainMatrix`：Train 筆數×3 double 特徵矩陣。

**第 29 行**：取出測試特徵矩陣。 索引中的 `:` 代表該維度全部元素；例如 `X(:,2)` 會取全部資料列的第 2 欄。 大括號 `{}` 會建立或取出 cell/table 內容；用途取決於它出現在資料右側或索引位置。 table 的大括號索引會取出欄位內容而非子 table；第一維 `:` 取全部資料列，第二維用三個欄名選欄，所以結果是 N×3 double 矩陣。 這行的資料是：`testTable`：Test 筆數×5 table；`featureNames`：1×3 cell，模型使用的欄位名稱；`testMatrix`：Test 筆數×3 double 特徵矩陣。

**第 30 行**：只用訓練資料估計每欄平均值。 `mean` 計算平均值；第二個參數可指定沿哪個維度計算。 這行的資料是：`trainMatrix`：Train 筆數×3 double 特徵矩陣；`means`：1×3 double，只由 Train Set 計算的平均值。

**第 31 行**：只用訓練資料估計母體標準差。 `std` 計算標準差；本教材只用 Train Set 估計前處理參數。 這行的資料是：`trainMatrix`：Train 筆數×3 double 特徵矩陣；`scales`：1×3 double，只由 Train Set 計算的標準差。

**第 32 行**：避免固定欄位造成除以零。 這行的資料是：`scales`：1×3 double，只由 Train Set 計算的標準差。

**第 33 行**：使用訓練參數標準化訓練資料。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 這行的資料是：`trainMatrix`：Train 筆數×3 double 特徵矩陣；`means`：1×3 double，只由 Train Set 計算的平均值；`scales`：1×3 double，只由 Train Set 計算的標準差；`scaledTrain`：Train 筆數×3 double，標準化訓練特徵。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 34 行**：使用同一組訓練參數標準化測試資料。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 這行的資料是：`testMatrix`：Test 筆數×3 double 特徵矩陣；`means`：1×3 double，只由 Train Set 計算的平均值；`scales`：1×3 double，只由 Train Set 計算的標準差；`scaledTest`：Test 筆數×3 double，使用 Train 參數轉換的測試特徵。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

段落銜接：完成「分層切分與 Train-only 標準化」後，下一段進入「訓練、測試評估與逐筆結果」。

### 第 4 段：訓練、測試評估與逐筆結果（第 35–45 行）

本段目的：完成「訓練、測試評估與逐筆結果」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 35 行**：只用訓練資料訓練簡單羅吉斯分類器。 四個輸入依序是 Train 特徵、Train 的 0/1 標籤、1200 回合、0.08 學習率；模型擬合只接收 Train Set。 這行的資料是：`trainTable`：Train 筆數×5 table；`scaledTrain`：Train 筆數×3 double，標準化訓練特徵；`weights`：3×1 double，羅吉斯模型權重；`bias`：純量 double，羅吉斯模型截距。

**第 36 行**：對保留測試資料逐筆估計需檢查機率。 這行的資料是：`scaledTest`：Test 筆數×3 double，使用 Train 參數轉換的測試特徵；`weights`：3×1 double，羅吉斯模型權重；`bias`：純量 double，羅吉斯模型截距；`probabilities`：Test 筆數×1 double，需檢查類別的模型估計。

**第 37 行**：以零點五門檻轉成預測類別。 這行的資料是：`probabilities`：Test 筆數×1 double，需檢查類別的模型估計；`predictions`：Test 筆數×1 double，0/1 預測。

**第 38 行**：計算列為真實、欄為預測的混淆矩陣。 這行的資料是：`testTable`：Test 筆數×5 table；`predictions`：Test 筆數×1 double，0/1 預測；`matrix`：2×2 double，列為真實、欄為預測的混淆矩陣。

**第 39 行**：計算保留測試集正確率。 `mean` 計算平均值；第二個參數可指定沿哪個維度計算。 這行的資料是：`testTable`：Test 筆數×5 table；`predictions`：Test 筆數×1 double，0/1 預測。 小例子：例如比較結果為 `[true true false true]`，MATLAB 把它視為 `[1 1 0 1]`，平均值是 0.75。

**第 40 行**：計算需檢查類別的召回率。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 這行的資料是：`matrix`：2×2 double，列為真實、欄為預測的混淆矩陣。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 41 行**：先建立正常預測的白話說明。 `repmat` 依指定次數複製同一字串；這裡先建立與測試筆數相同的預設解釋欄，再用 logical 索引改寫部分列。 `height` 回傳 table 的資料列數。 `repmat` 依列、欄次數複製同一陣列。 這行的資料是：`testTable`：Test 筆數×5 table。

**第 42 行**：為需檢查預測改寫說明。 這行的資料是：`predictions`：Test 筆數×1 double，0/1 預測。

**第 43 行**：建立逐筆預測結果表。 點號欄位存取 `testTable.deviceID` 與 `testTable.label` 取的是保留測試 table 的欄，各為 Ntest×1；後面的 `predictions`、`probabilities`、`explanation` 也都是 Ntest×1，因此可按列組成五欄結果表。這裡不是原始 240×1 的 `deviceID` 或 `label` 變數。 `table` 把同列數的欄位組成表格，每一列是一筆樣本。 這行的資料是：`testTable`：Test 筆數×5 table；`probabilities`：Test 筆數×1 double，需檢查類別的模型估計；`predictions`：Test 筆數×1 double，0/1 預測。 小例子：若三個欄向量各有 10 列，組成的 table 也會有 10 筆資料。

**第 44 行**：指定清楚的結果欄名。 大括號 `{}` 會建立或取出 cell/table 內容；用途取決於它出現在資料右側或索引位置。 `Properties.VariableNames` 是 table 的欄名屬性；右側 cell 內的名稱依序對應目前各欄，之後寫入 CSV 時會成為標題列。

**第 45 行**：保存逐筆預測結果。 `writetable` 把 table 欄名與每一列資料寫入指定 CSV；後續再讀回，可驗證流程使用的是落盤資料。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 `writetable` 把 table 寫入指定檔案，方便檢查與交接。 這行的資料是：`outputDir`：字元路徑，案例一輸出資料夾。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

段落銜接：完成「訓練、測試評估與逐筆結果」後，下一段進入「交集檢查、摘要與輸出」。

### 第 5 段：交集檢查、摘要與輸出（第 46–68 行）

本段目的：完成「交集檢查、摘要與輸出」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 46 行**：整理訓練識別碼供交集檢查。 `sort` 依指定方向排列資料，也能回傳原始位置索引。 `string` 將輸入統一成 string 型態，便於文字向量化比較。 這行的資料是：`trainTable`：Train 筆數×5 table。

**第 47 行**：整理測試識別碼供交集檢查。 `sort` 依指定方向排列資料，也能回傳原始位置索引。 `string` 將輸入統一成 string 型態，便於文字向量化比較。 這行的資料是：`testTable`：Test 筆數×5 table。

**第 48 行**：計算訓練與測試識別碼交集。 `intersect` 找出兩組資料共有的元素，本教材用它檢查 Train/Test 交集。 小例子：若兩組 ID 完全分開，`intersect` 會回傳空集合，表示交集為零。

**第 49 行**：建立可供測試與審查使用的摘要結構。 這行的資料是：`summary`：struct，保存切分、指標與限制。

**第 50 行**：保存實際輸出資料夾供階段暫測與檔案檢查。 這行的資料是：`outputDir`：字元路徑，案例一輸出資料夾；`summary`：struct，保存切分、指標與限制。

**第 51 行**：記錄固定亂數種子。 這行的資料是：`summary`：struct，保存切分、指標與限制。

**第 52 行**：記錄總資料筆數。 `height` 回傳 table 的資料列數。 這行的資料是：`loadedTable`：240×5 table，從 CSV 讀回的資料；`summary`：struct，保存切分、指標與限制。

**第 53 行**：記錄訓練資料筆數。 `height` 回傳 table 的資料列數。 這行的資料是：`trainTable`：Train 筆數×5 table；`summary`：struct，保存切分、指標與限制。

**第 54 行**：記錄測試資料筆數。 `height` 回傳 table 的資料列數。 這行的資料是：`testTable`：Test 筆數×5 table；`summary`：struct，保存切分、指標與限制。

**第 55 行**：記錄百分之八十訓練比例。 這行的資料是：`testRatio`：純量 double，固定為 0.20；`summary`：struct，保存切分、指標與限制。

**第 56 行**：記錄百分之二十測試比例。 這行的資料是：`testRatio`：純量 double，固定為 0.20；`summary`：struct，保存切分、指標與限制。

**第 57 行**：記錄資料分割交集。 `cellstr` 將 string 陣列轉成字元向量 cell，方便寫入 struct 與 JSON。 這行的資料是：`summary`：struct，保存切分、指標與限制。

**第 58 行**：保存實際訓練集平均值供獨立重算。 這行的資料是：`means`：1×3 double，只由 Train Set 計算的平均值；`summary`：struct，保存切分、指標與限制。

**第 59 行**：保存實際訓練集標準差供獨立重算。 這行的資料是：`scales`：1×3 double，只由 Train Set 計算的標準差；`summary`：struct，保存切分、指標與限制。

**第 60 行**：保存混淆矩陣。 這行的資料是：`matrix`：2×2 double，列為真實、欄為預測的混淆矩陣；`summary`：struct，保存切分、指標與限制。

**第 61 行**：保存測試正確率。 這行的資料是：`summary`：struct，保存切分、指標與限制。

**第 62 行**：保存正類召回率。 這行的資料是：`summary`：struct，保存切分、指標與限制。

**第 63 行**：保存機率解讀限制。 這行的資料是：`summary`：struct，保存切分、指標與限制。

**第 64 行**：保存訓練識別碼供測試重建資料流。 `cellstr` 將 string 陣列轉成字元向量 cell，方便寫入 struct 與 JSON。 這行的資料是：`summary`：struct，保存切分、指標與限制。

**第 65 行**：保存測試識別碼供測試重建資料流。 `cellstr` 將 string 陣列轉成字元向量 cell，方便寫入 struct 與 JSON。 這行的資料是：`summary`：struct，保存切分、指標與限制。

**第 66 行**：將摘要寫成 JSON 檔。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 這行的資料是：`outputDir`：字元路徑，案例一輸出資料夾；`summary`：struct，保存切分、指標與限制。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

**第 67 行**：在命令視窗顯示實際摘要。 `fprintf` 依格式字串輸出文字；`%d`、`%.3f` 等位置會由後續變數填入。

**第 68 行**：結束案例一主函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「交集檢查、摘要與輸出」後，下一段進入「分層切分函式」。

### 第 6 段：分層切分函式（第 70–85 行）

本段目的：完成「分層切分函式」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 70 行**：定義以 base MATLAB 自行實作的分層切分函式。 `function` 宣告 `stratifiedSplit`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`labels`：N×1 數值標籤；`testRatio`：純量 double，要分到 Test Set 的比例；`seed`：純量整數，切分亂數種子；`trainIndex`：Train Set 的原始資料列索引；`testIndex`：Test Set 的原始資料列索引。

**第 71 行**：固定切分用亂數種子。 `rng` 固定亂數種子與演算法；相同資料與環境下可重現相同亂數序列。 這行的資料是：`seed`：純量整數，切分亂數種子。 小例子：連續兩次先執行相同 `rng(seed,'twister')`，後續第一組亂數會依相同順序產生。

**第 72 行**：建立空的訓練索引欄向量。 這行的資料是：`trainIndex`：Train Set 的原始資料列索引。

**第 73 行**：建立空的測試索引欄向量。 這行的資料是：`testIndex`：Test Set 的原始資料列索引。

**第 74 行**：取得所有類別並轉成列向量供迴圈使用。 `unique` 取得資料中各種不同值。 這行的資料是：`labels`：N×1 數值標籤；`classes`：1×C 類別列向量。

**第 75 行**：逐一處理每個標籤類別。 `for` 建立迴圈；迴圈變數會依序取用右側序列中的每個值。 這行的資料是：`classes`：1×C 類別列向量；`classValue`：目前迴圈處理的單一類別值。

**第 76 行**：找出目前類別的資料列索引。 `find` 回傳條件為 `true` 的索引位置。 這行的資料是：`labels`：N×1 數值標籤；`classValue`：目前迴圈處理的單一類別值；`classIndex`：目前類別在原資料中的列索引。

**第 77 行**：在目前類別內隨機排列。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 `randperm(n)` 回傳 1 到 n 的不重複亂序整數，可用來固定種子洗牌。 這行的資料是：`classIndex`：目前類別在原資料中的列索引；`order`：目前類別的隨機排列位置。

**第 78 行**：套用固定種子的排列順序。 這行的資料是：`classIndex`：目前類別在原資料中的列索引；`order`：目前類別的隨機排列位置。

**第 79 行**：計算目前類別保留測試筆數。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 `round` 將數值四捨五入為最接近的整數。 這行的資料是：`testRatio`：純量 double，要分到 Test Set 的比例；`classIndex`：目前類別在原資料中的列索引；`testCount`：目前類別要放入 Test Set 的筆數。 小例子：例如 `[2 4] .* [3 5]` 會得到 `[6 20]`，每個位置各自相乘。

**第 80 行**：將前段索引加入測試集。 這行的資料是：`testIndex`：Test Set 的原始資料列索引；`classIndex`：目前類別在原資料中的列索引；`testCount`：目前類別要放入 Test Set 的筆數。

**第 81 行**：將其餘索引加入訓練集。 這行的資料是：`trainIndex`：Train Set 的原始資料列索引；`classIndex`：目前類別在原資料中的列索引；`testCount`：目前類別要放入 Test Set 的筆數。

**第 82 行**：結束各類別切分迴圈。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 83 行**：混合訓練資料順序。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 `randperm(n)` 回傳 1 到 n 的不重複亂序整數，可用來固定種子洗牌。 這行的資料是：`trainIndex`：Train Set 的原始資料列索引。

**第 84 行**：混合測試資料順序。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 `randperm(n)` 回傳 1 到 n 的不重複亂序整數，可用來固定種子洗牌。 這行的資料是：`testIndex`：Test Set 的原始資料列索引。

**第 85 行**：結束分層切分函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「分層切分函式」後，下一段進入「羅吉斯訓練迴圈」。

### 第 7 段：羅吉斯訓練迴圈（第 87–100 行）

本段目的：完成「羅吉斯訓練迴圈」，讓這組程式成為前後相接的一個工作單位。

```matlab
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
```

段內逐行說明：

**第 87 行**：定義簡單羅吉斯迴歸訓練函式。 `function` 宣告 `trainLogistic`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`matrix`：Ntrain×3 double，這次訓練輸入特徵；`targets`：Ntrain×1 double，這次訓練的 0/1 標籤；`epochs`：純量整數，梯度更新回合數；`learningRate`：純量 double，每次更新步幅；`weights`：3×1 double，三個特徵權重。

**第 88 行**：將每個特徵權重初始化為零。 `zeros(m,n)` 先配置 m×n 的全零陣列，之後再逐格填入結果。 這行的資料是：`matrix`：Ntrain×3 double，這次訓練輸入特徵；`weights`：3×1 double，三個特徵權重。 小例子：例如 `zeros(2,3)` 會得到 2 列、3 欄的全零矩陣。

**第 89 行**：將截距初始化為零。 這行的資料是：`bias`：純量 double，截距。

**第 90 行**：依指定回合數重複梯度更新。 `for` 建立迴圈；迴圈變數會依序取用右側序列中的每個值。 這行的資料是：`epochs`：純量整數，梯度更新回合數。

**第 91 行**：計算每筆資料的線性分數。 此處 `matrix` 是 Ntrain×3，`weights` 是 3×1；矩陣乘法得到 Ntrain×1 分數，再把純量 `bias` 加到每一筆。 這行的資料是：`matrix`：Ntrain×3 double，這次訓練輸入特徵；`weights`：3×1 double，三個特徵權重；`bias`：純量 double，截距；`scores`：Ntrain×1 double，每筆訓練資料的線性分數。

**第 92 行**：限制極端分數避免指數溢位。 這行的資料是：`scores`：Ntrain×1 double，每筆訓練資料的線性分數。

**第 93 行**：將分數轉成零到一的機率。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 負號先把每筆分數反向，`exp` 逐元素計算指數，再用 sigmoid 公式轉成 Ntrain×1 的訓練階段估計值。 這行的資料是：`scores`：Ntrain×1 double，每筆訓練資料的線性分數；`probabilities`：Ntrain×1 double，訓練階段的模型估計。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 94 行**：計算預測機率與真實標籤的差。 兩側都是 Ntrain×1；每筆誤差等於模型估計減 0/1 訓練標籤，下一行會用它計算權重梯度。 這行的資料是：`targets`：Ntrain×1 double，這次訓練的 0/1 標籤；`probabilities`：Ntrain×1 double，訓練階段的模型估計；`errors`：Ntrain×1 double，估計值減去訓練標籤。

**第 95 行**：計算平均權重梯度。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 撇號把 Ntrain×3 的 `matrix` 轉成 3×Ntrain，乘上 Ntrain×1 的 `errors` 得到 3×1 誤差加權總和，再除以 Ntrain 取得平均梯度。例：單一特徵值為 1、2，誤差為 0.2、-0.1，平均梯度是 `(1×0.2 + 2×-0.1)/2 = 0`；下一行權重更新會使用這個方向。 這行的資料是：`matrix`：Ntrain×3 double，這次訓練輸入特徵；`errors`：Ntrain×1 double，估計值減去訓練標籤；`weightGradient`：3×1 double，平均權重梯度。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 96 行**：計算平均截距梯度。 `mean` 計算平均值；第二個參數可指定沿哪個維度計算。 這行的資料是：`errors`：Ntrain×1 double，估計值減去訓練標籤；`biasGradient`：純量 double，平均截距梯度。

**第 97 行**：依梯度下降更新權重。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 這行的資料是：`learningRate`：純量 double，每次更新步幅；`weights`：3×1 double，三個特徵權重；`weightGradient`：3×1 double，平均權重梯度。 小例子：例如 `[2 4] .* [3 5]` 會得到 `[6 20]`，每個位置各自相乘。

**第 98 行**：依梯度下降更新截距。 `.*` 代表對應位置逐元素相乘，兩側陣列尺寸要能相容。 這行的資料是：`learningRate`：純量 double，每次更新步幅；`bias`：純量 double，截距；`biasGradient`：純量 double，平均截距梯度。 小例子：例如 `[2 4] .* [3 5]` 會得到 `[6 20]`，每個位置各自相乘。

**第 99 行**：結束模型訓練迴圈。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 100 行**：結束羅吉斯訓練函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「羅吉斯訓練迴圈」後，下一段進入「機率預測函式」。

### 第 8 段：機率預測函式（第 102–106 行）

本段目的：完成「機率預測函式」，讓這組程式成為前後相接的一個工作單位。

```matlab
function probabilities = predictProbability(matrix,weights,bias) % 定義逐筆機率預測函式。
scores = matrix * weights + bias; % 計算測試資料線性分數。
scores = max(-30,min(30,scores)); % 限制極端分數避免指數溢位。
probabilities = 1 ./ (1 + exp(-scores)); % 將分數轉為需檢查機率。
end % 結束機率預測函式。
```

段內逐行說明：

**第 102 行**：定義逐筆機率預測函式。 `function` 宣告 `predictProbability`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`matrix`：N×3 double，要預測的特徵矩陣；`weights`：3×1 double，已訓練權重；`bias`：純量 double，已訓練截距；`probabilities`：N×1 double，逐筆模型估計。

**第 103 行**：計算測試資料線性分數。 這行的資料是：`matrix`：N×3 double，要預測的特徵矩陣；`weights`：3×1 double，已訓練權重；`bias`：純量 double，已訓練截距；`scores`：N×1 double，逐筆線性分數。

**第 104 行**：限制極端分數避免指數溢位。 這行的資料是：`scores`：N×1 double，逐筆線性分數。

**第 105 行**：將分數轉為需檢查機率。 `./` 代表對應位置逐元素相除，適合一次處理整欄或整張矩陣。 這行的資料是：`scores`：N×1 double，逐筆線性分數；`probabilities`：N×1 double，逐筆模型估計。 小例子：例如 `[2 4] ./ [1 2]` 會得到 `[2 2]`，每個位置各自運算。

**第 106 行**：結束機率預測函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「機率預測函式」後，下一段進入「二元混淆矩陣」。

### 第 9 段：二元混淆矩陣（第 108–115 行）

本段目的：完成「二元混淆矩陣」，讓這組程式成為前後相接的一個工作單位。

```matlab
function matrix = binaryConfusion(targets,predictions) % 定義二元混淆矩陣函式。
matrix = zeros(2,2); % 建立二乘二零矩陣。
for index = 1:numel(targets) % 逐筆配對真實值與預測值。
    row = targets(index) + 1; % 將零或一真實標籤轉成 MATLAB 索引。
    column = predictions(index) + 1; % 將零或一預測標籤轉成 MATLAB 索引。
    matrix(row,column) = matrix(row,column) + 1; % 在對應格子累加一筆。
end % 結束逐筆統計迴圈。
end % 結束混淆矩陣函式。
```

段內逐行說明：

**第 108 行**：定義二元混淆矩陣函式。 `function` 宣告 `binaryConfusion`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`targets`：N×1 double，真實 0/1 標籤；`predictions`：N×1 double，預測 0/1 標籤；`matrix`：2×2 double，列為真實、欄為預測。

**第 109 行**：建立二乘二零矩陣。 `zeros(m,n)` 先配置 m×n 的全零陣列，之後再逐格填入結果。 這行的資料是：`matrix`：2×2 double，列為真實、欄為預測。 小例子：例如 `zeros(2,3)` 會得到 2 列、3 欄的全零矩陣。

**第 110 行**：逐筆配對真實值與預測值。 `for` 建立迴圈；迴圈變數會依序取用右側序列中的每個值。 `numel` 回傳陣列的元素總數，不受列向量或欄向量方向影響。 這行的資料是：`targets`：N×1 double，真實 0/1 標籤；`index`：純量整數，目前資料列位置。

**第 111 行**：將零或一真實標籤轉成 MATLAB 索引。 這行的資料是：`targets`：N×1 double，真實 0/1 標籤；`index`：純量整數，目前資料列位置；`row`：純量整數，混淆矩陣列索引。

**第 112 行**：將零或一預測標籤轉成 MATLAB 索引。 這行的資料是：`predictions`：N×1 double，預測 0/1 標籤；`index`：純量整數，目前資料列位置；`column`：純量整數，混淆矩陣欄索引。

**第 113 行**：在對應格子累加一筆。 這行的資料是：`matrix`：2×2 double，列為真實、欄為預測；`row`：純量整數，混淆矩陣列索引；`column`：純量整數，混淆矩陣欄索引。

**第 114 行**：結束逐筆統計迴圈。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 115 行**：結束混淆矩陣函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「二元混淆矩陣」後，下一段進入「安全輸出路徑」。

### 第 10 段：安全輸出路徑（第 117–139 行）

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
```

段內逐行說明：

**第 117 行**：定義限制輸出範圍的安全函式。 `function` 宣告 `ensureSafeOutput`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。 這行的資料是：`projectRoot`：字元路徑，允許輸出的專案根目錄；`rawPath`：呼叫者提供的原始路徑；`outputDir`：字元路徑，驗證後的輸出位置。

**第 118 行**：檢查安全路徑正規化所需的 JVM 必要條件。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。

**第 119 行**：以固定識別碼清楚回報 JVM 必要條件。 `error` 以固定識別碼與訊息停止流程，方便使用者回報精確原因。

**第 120 行**：結束 JVM 前置條件檢查。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 121 行**：建立候選路徑物件以判斷路徑型態。 `char` 把 string 或字元輸入統一成 Java 可接收的字元向量；`java.io.File` 建立路徑物件，下一行用 `isAbsolute()` 判斷它是否為絕對路徑。 `char` 將 string 純量轉成字元向量，供 Java 或舊式 MATLAB 介面使用。 這行的資料是：`rawPath`：呼叫者提供的原始路徑；`rawFile`：Java File 物件，用來判斷絕對或相對路徑。

**第 122 行**：處理呼叫者提供的相對輸出路徑。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。 這行的資料是：`rawFile`：Java File 物件，用來判斷絕對或相對路徑。

**第 123 行**：將相對路徑固定接在本程式專案根目錄下。 `fullfile` 依作業系統規則組合資料夾與檔名，避免手動拼接斜線。 `char` 將 string 純量轉成字元向量，供 Java 或舊式 MATLAB 介面使用。 這行的資料是：`projectRoot`：字元路徑，允許輸出的專案根目錄；`rawPath`：呼叫者提供的原始路徑。 小例子：例如 `fullfile(root,'images','a.png')` 會組成目前作業系統可用的完整路徑。

**第 124 行**：結束相對路徑正規化條件。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 125 行**：取得專案根目錄的標準路徑。 Java `getCanonicalPath()` 會整理 `.`、`..` 與可解析的符號連結，再轉回 MATLAB char；安全範圍比較使用這個標準化結果。 `char` 將 string 純量轉成字元向量，供 Java 或舊式 MATLAB 介面使用。 這行的資料是：`projectRoot`：字元路徑，允許輸出的專案根目錄；`rootPath`：字元路徑，canonical 專案根目錄。

**第 126 行**：取得候選輸出位置的標準路徑。 Java `getCanonicalPath()` 會整理 `.`、`..` 與可解析的符號連結，再轉回 MATLAB char；安全範圍比較使用這個標準化結果。 `char` 將 string 純量轉成字元向量，供 Java 或舊式 MATLAB 介面使用。 這行的資料是：`rawPath`：呼叫者提供的原始路徑；`candidatePath`：字元路徑，canonical 候選輸出位置。

**第 127 行**：判斷目前是否為 Windows 路徑環境。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。

**第 128 行**：統一轉成小寫後檢查路徑範圍。 兩側都補上 `filesep` 再比前綴，可讓 `/project/out` 通過，同時避免把 `/project2` 誤認成 `/project` 內部；Windows 分支另先轉小寫。 `startsWith` 檢查第一段文字是否以第二段文字開頭。 這行的資料是：`rootPath`：字元路徑，canonical 專案根目錄；`candidatePath`：字元路徑，canonical 候選輸出位置；`isInside`：logical 純量，候選路徑是否位於專案內。

**第 129 行**：處理 macOS、Linux 與 MATLAB Online 路徑。 `else` 接住前面條件之外的情況，讓流程仍有明確處理方式。

**第 130 行**：以區分大小寫方式檢查路徑範圍。 兩側都補上 `filesep` 再比前綴，可讓 `/project/out` 通過，同時避免把 `/project2` 誤認成 `/project` 內部；Windows 分支另先轉小寫。 `startsWith` 檢查第一段文字是否以第二段文字開頭。 這行的資料是：`rootPath`：字元路徑，canonical 專案根目錄；`candidatePath`：字元路徑，canonical 候選輸出位置；`isInside`：logical 純量，候選路徑是否位於專案內。

**第 131 行**：結束作業系統路徑判斷。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 132 行**：檢查候選位置的教材專案範圍。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。 這行的資料是：`isInside`：logical 純量，候選路徑是否位於專案內。

**第 133 行**：以固定識別碼回報可辨識錯誤。 `error` 以固定識別碼與訊息停止流程，方便使用者回報精確原因。

**第 134 行**：結束安全範圍檢查。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 135 行**：檢查安全輸出資料夾是否需要建立。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。 `~` 在邏輯式中代表反轉；在多重回傳值左側則代表略過該回傳值。 `isfolder` 檢查指定路徑是否指向現有資料夾。 這行的資料是：`candidatePath`：字元路徑，canonical 候選輸出位置。

**第 136 行**：建立資料夾並保留現有內容。 `mkdir` 建立指定資料夾；既有檔案保持原狀，程式只會覆寫自己使用的同名教材輸出。 這行的資料是：`candidatePath`：字元路徑，canonical 候選輸出位置。

**第 137 行**：結束資料夾建立條件。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 138 行**：回傳標準化後的安全輸出路徑。 這行的資料是：`candidatePath`：字元路徑，canonical 候選輸出位置；`outputDir`：字元路徑，驗證後的輸出位置。

**第 139 行**：結束安全輸出函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

段落銜接：完成「安全輸出路徑」後，下一段進入「JSON 寫入」。

### 第 11 段：JSON 寫入（第 141–148 行）

本段目的：完成「JSON 寫入」，讓這組程式成為前後相接的一個工作單位。

```matlab
function writeJson(path,data) % 定義基礎 JSON 寫入函式。
fileID = fopen(path,'w','n','UTF-8'); % 以 UTF-8 開啟摘要輸出檔。
if fileID < 0 % 檢查摘要檔開啟狀態。
    error('Tutorial:FileWrite','摘要檔寫入受阻：%s',path); % 回報包含路徑的寫檔錯誤。
end % 結束開檔檢查。
cleaner = onCleanup(@() fclose(fileID)); % 確保函式結束時關閉檔案。
fprintf(fileID,'%s',jsonencode(data,'PrettyPrint',true)); % 將結構編碼並寫成易讀 JSON。
end % 結束 JSON 寫入函式。
```

段內逐行說明：

**第 141 行**：定義基礎 JSON 寫入函式。 `function` 宣告 `這個函式`；等號左側列回傳值，小括號內依順序列出呼叫者要傳入的資料。

**第 142 行**：以 UTF-8 開啟摘要輸出檔。 `'w'` 以寫入模式開檔並覆寫同名教材輸出，`'n'` 使用原生位元組順序，`'UTF-8'` 指定文字編碼；回傳負值代表開檔受阻。

**第 143 行**：檢查摘要檔開啟狀態。 `if` 先計算後面的邏輯條件；結果為 `true` 時執行下一行到配對的 `end`。

**第 144 行**：回報包含路徑的寫檔錯誤。 `error` 以固定識別碼與訊息停止流程，方便使用者回報精確原因。

**第 145 行**：結束開檔檢查。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

**第 146 行**：確保函式結束時關閉檔案。 `@()` 建立零輸入匿名函式，內容是 `fclose(fileID)`；`onCleanup` 物件離開函式作用域時會呼叫它，即使後續發生錯誤也會嘗試關檔。

**第 147 行**：將結構編碼並寫成易讀 JSON。 `jsonencode` 把 struct 轉成 JSON；名稱值參數 `'PrettyPrint',true` 加入縮排與換行，外層 `fprintf(fileID,'%s',...)` 將整段文字寫入已開啟檔案。 `fprintf` 依格式字串輸出文字；`%d`、`%.3f` 等位置會由後續變數填入。 `jsonencode` 把 struct 轉成 JSON 文字，便於跨工具閱讀。

**第 148 行**：結束 JSON 寫入函式。 `end` 關閉縮排所對應的最近一層函式、條件或迴圈，下一行回到上一層流程。

## 二、可直接貼給 GPT／Claude 的逐段解說提示詞

```text
請閱讀我貼上的完整 MATLAB 檔 `case1_sensor_classifier_matlab.m`，為零資訊背景同學撰寫台灣慣用、口語但精簡的繁體中文逐段教材，並在每一段內逐段解說（段內逐行）。

請遵守以下格式：
1. 依資料準備、主要運算、評估、輸出與各個區域函式的實際控制流程分段；分段依邏輯決定，避免固定每幾行切一段。
2. 每段先寫一句目的，再貼出該段完整原始程式碼與行號範圍；延續運算式與它相接的控制流程放在同一段。
3. 每段的程式區塊只貼一次，接著依「第 N 行」用段落逐行說明；空白行計入行號，每個非空行恰好說明一次。
4. 每行說明要涵蓋實際工作、重要符號與參數、變數型態與尺寸、輸入與輸出，以及它在整體流程中的目的。
5. 遇到索引、矩陣、logical、table、cell、struct、函式、if、for、while、end、...、.*、./、.^、~、冒號與大括號時，提供小型數值例子。
6. 延續行、end、欄名、註解與錯誤處理都要解說；各段之間只在有助理解時加入一句銜接。
7. 只描述程式真正做的事；執行結果由 MATLAB 實際輸出確認，並保留資料洩漏、合成資料外推、比例設定與模型估計的限制。
8. 解說完成後，加上如何執行、如何檢查輸出，以及如何填寫 `CASE1_REPORT_TEMPLATE.md`。

請先回報分段數、總行數、非空行數與第一行函式名稱，再開始逐段解說；完成後再次核對每個非空行只出現一次。
```

## 三、行號與分段更新規則

程式碼有任何改動時，請重新從最終 `.m` 讀取實體行號、依新控制流程檢查分段、重算 SHA-256，再完整重建本文件。這樣每段程式碼與段內第 N 行都會持續對應可執行來源。
