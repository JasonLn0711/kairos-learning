# 案例二 PDF 報告範本：紙面色塊分割與面積

> 老師要求的 PDF 內容為「執行結果、處理程序、程式碼」。這份範本、獨立 `.m`、PNG、JSON 與自動化檢核屬助教實作方式。請以本人 MATLAB 實際輸出完成內容。

## 一、執行結果

請放入下列實際輸出：

1. `synthetic_paper_blocks.png` 原圖。
2. `segmentation_mask.png` 分割遮罩。
3. `contour_overlay.png` 純紅色外輪廓疊圖。
4. MATLAB Command Window 的像素面積與平方毫米面積。

```text
Pixel Area：
Contour Pixel Count：
Pixel Size：1 mm × 1 mm
Area：
```

## 二、處理程序

1. 建立虛構紙面影像與干擾色塊。
2. 讀回 PNG 並分離 RGB 通道。
3. 套用紅色門檻與色彩優勢門檻。
4. 找出最大四方向連通元件。
5. 從原始元件的全部像素計算面積。
6. 抽取外輪廓並在疊圖標成 RGB `[255 0 0]`。
7. 依 1 mm × 1 mm/像素換算平方毫米。

換算式：

```text
面積（mm²）＝原始分割元件像素數 × 1 mm × 1 mm
```

## 三、程式碼

請整理本人實際執行版本的程式碼。可直接貼上程式碼；若採截圖呈現，請確保文字清楚。內容至少涵蓋：

1. RGB 門檻分割。
2. 最大連通元件。
3. `pixelArea = nnz(component)`。
4. 紅色外輪廓。
5. 1 mm 比例換算與輸出。
