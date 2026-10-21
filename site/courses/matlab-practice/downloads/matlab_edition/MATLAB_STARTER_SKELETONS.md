# MATLAB 起始骨架

先建立對應檔名，再貼入骨架。執行骨架會顯示準備完成。接著依 `MATLAB_STAGE_PROMPTS.md` 逐步用正式資料流程取代 `disp`。局部輔助函式放在主要函式的 `end` 之後，並沿用教材指定的函式名稱。

三個骨架後續會依固定設定展開：案例一採 80% Train Set 與 20% Test Set；案例二採 1 mm × 1 mm/像素並畫純紅色外輪廓；案例三保留獨立 Train Set／Test Set。完成程式後，請從最終來源重新產生逐段教材，讓流程分段與段內行號持續一致。

## `case1_sensor_classifier_matlab.m`

```matlab
function summary = case1_sensor_classifier_matlab(outputDir) % 定義案例一主函式。
projectRoot = fileparts(mfilename('fullpath')); % 由本檔位置取得固定專案根目錄。
if nargin < 1 % 呼叫者省略輸出位置時套用預設值。
    outputDir = fullfile(projectRoot,'matlab_artifacts','case1'); % 使用專案內預設路徑。
end % 結束預設路徑條件。
summary = struct; % 建立暫時摘要結構。
summary.outputDir = outputDir; % 保存暫時輸出位置供檢查。
disp('案例一骨架準備完成'); % 顯示骨架可執行訊息。
end % 結束案例一骨架主函式。
```

## `case2_image_measure_matlab.m`

```matlab
function summary = case2_image_measure_matlab(outputDir) % 定義案例二主函式。
projectRoot = fileparts(mfilename('fullpath')); % 由本檔位置取得固定專案根目錄。
if nargin < 1 % 呼叫者省略輸出位置時套用預設值。
    outputDir = fullfile(projectRoot,'matlab_artifacts','case2'); % 使用專案內預設路徑。
end % 結束預設路徑條件。
summary = struct; % 建立暫時摘要結構。
summary.outputDir = outputDir; % 保存暫時輸出位置供檢查。
disp('案例二骨架準備完成'); % 顯示骨架可執行訊息。
end % 結束案例二骨架主函式。
```

## `case3_shape_classifier_matlab.m`

```matlab
function summary = case3_shape_classifier_matlab(outputDir) % 定義案例三主函式。
projectRoot = fileparts(mfilename('fullpath')); % 由本檔位置取得固定專案根目錄。
if nargin < 1 % 呼叫者省略輸出位置時套用預設值。
    outputDir = fullfile(projectRoot,'matlab_artifacts','case3'); % 使用專案內預設路徑。
end % 結束預設路徑條件。
summary = struct; % 建立暫時摘要結構。
summary.outputDir = outputDir; % 保存暫時輸出位置供檢查。
disp('案例三骨架準備完成'); % 顯示骨架可執行訊息。
end % 結束案例三骨架主函式。
```

在 Command Window 分別輸入三個函式名稱。看到骨架準備完成後，再進入第一階段。這項檢查確認函式檔可被找到與呼叫；案例演算法將在後續階段逐步完成與驗證。
