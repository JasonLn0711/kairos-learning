# Task 01　參考頁與正式站視覺稽核

**稽核閘門 PASS。** 六個指定頁面都有當次瀏覽器截圖。四種桌面尺寸下，兩個參考頁與本站三個互動課頁都能把主操作區放在視窗內。最大的差距出現在第一步要讀什麼。參考請求旅程從一台筆電開始，本站一開始就顯示五個相似機箱。應優先處理角色輪廓與每一步的構圖。[差距矩陣](01-gap-matrix.md) · [設計目標](01-design-target.md) · [架構決策](01-architecture-decision.md)

![相同 1440×900 CSS 視窗的請求旅程第一步。左為參考，右為正式站。](../../../.local/interactive-v2/task01/paired-request.jpg)

## 基準與證據

原工作區 main 為 42d2efd35fe2969e84bc4162af0cfea7c22aff90，含既有未提交修改。git fetch origin main 後，從 14f59dd17b7f8978452a3d026416b5092a770a45 建立獨立 worktree 與 audit/reconstruction-v2-task01 分支。稽核以此提交比對正式站，未更改產品。只新增本目錄四份 Markdown。瀏覽器及量測檔在此 worktree 的 [.local/interactive-v2/task01](../../../.local/interactive-v2/task01/)。

| 編號 | 開啟頁面 | 擷取狀態 |
|---|---|---|
| A | [Replication](https://designed-to-scale.vercel.app/#/replication/5) | 英文 5/11，另取 1、6、11 與重播序列 |
| B | [How a Request Travels](https://designed-to-scale.vercel.app/#/request-lifecycle/1) | 英文 1/10，另取 5、10、鍵盤換步與重播 |
| C | [一個網頁請求的旅程](https://learn.cs-kairos.com/interactive/system-design/request-lifecycle/) | 繁中 1/10，另取 DNS 快取、慢查詢、總結、閱讀與英文窄版 |
| D | [互動概念圖譜](https://learn.cs-kairos.com/interactive/aase/m02/) | 繁中課程索引，自然捲動 |
| E | [Softmax 與加權總和](https://learn.cs-kairos.com/interactive/aase/m02/m02-01/softmax-weighted-sum/) | 繁中全部三步、閱讀、英文窄版 |
| F | [工具操作的四道關卡](https://learn.cs-kairos.com/interactive/aase/m02/m02-06/four-gates/) | 繁中全部三步、閱讀、英文窄版 |

臺灣時間 2026-11-24，Chromium 158.0.8127.37，DPR 1，瀏覽器縮放 100%。等待 document.fonts.ready；entry 請求 reduced motion。參考頁即使在此偏好下仍顯示 Pause，靜態截圖只證明當下畫面。manifest 的 UTC 時戳、逐張雜湊、視窗、框線座標、字體狀態、焦點、viewBox、步驟、選項、解說及狀態文字可逐筆核對。英文窄版為獨立 /en/ URL。外站只觀察公開介面與渲染結果。

## 幾何與可用空間

單位為 CSS px。舞臺面積取實際 SVG 框；比例分母為完整文件面積。索引 D 沒有 SVG 舞臺。左右欄高度受瀏覽器取整可能差 1 px。

~~~text
1440×900           課程列        中央工作區                    步驟解說
A/B   header 47    255          860（SVG 804×536）             324
                                圖下 10 px 接時間線
C     header 55    208   16     779（SVG 775×581）      16     364
                                圖下為動作列，70 px 高
~~~

此尺寸 A 的中央 main 從 y57 到 y888，header 下方可用 853 px。C 的 workspace 從 y149 到 y884，header 下方可用 845 px。A 左中右約佔視窗 18/60/23%，C 約 14/54/25%，後者另有外距與兩道間距。A 的 SVG 佔文件 33.3%，C 佔 34.7%。因此僅擴大畫布面積無法解決第一步的辨識問題。

| 視窗 | A/C header 高 | A 圖面 | C 圖面 | A / B / C / D / E / F 文件高 |
|---|---|---|---|---|
| 1920×1080 | 54/55 | 1182×658 | 867×761 | 1080 / 1080 / 1080 / 3234 / 1080 / 1080 |
| 1440×900 | 47/55 | 804×536 | 775×581 | 900 / 900 / 900 / 3234 / 900 / 900 |
| 1366×768 | 44/55 | 762×422 | 734×449 | 768 / 768 / 768 / 3234 / 768 / 768 |
| 1280×720 | 41/55 | 714×396 | 686×401 | 720 / 720 / 720 / 3234 / 720 / 720 |
| 390×844 | 54/103 | 330×198 | 364×477 | 1499 / 1276 / 1332 / 6871 / 886 / 912 |
| 320×568 | 54/103 | 260×198 | 294×385 | 1625 / 1470 / 1380 / 7514 / 994 / 994 |

全部 36 張 entry 的文件寬皆等於視窗寬。C/E/F 的 shell 在寬至少 1120 且高至少 660 時採桌面工作區；1020 以下收起左列，790 以下改為單欄。A/B 的桌面時間線與側欄在 320 寬改為直向文件與底部換步。英文 C/E/F 在 320 寬時文件高分別為 1591、1104、1156 px。720×450、根字級 200% 時，六頁皆維持 720 px 文件寬，C 的文件增高到 2061 px。此為字級與重排實驗，原生瀏覽器 200% 縮放及真機觸控仍待後續驗收。

## 操作觀察

- A1 以單一資料庫承擔讀寫。A5 中可見人群、App Server、leader、兩個 follower、複寫與讀取路徑；A6 用 DOWN、紅色指標與側欄說明寫入失敗。A11 為回顧。1、6、11 的 viewBox 寬依序約 770、726、819 SVG units。舞臺外框固定，參與者、標籤、色彩與局部鏡頭改變。
- B1 只見筆電；B5 增加 DNS、Web Server 與資料庫；B10 加入分段時間。B1 的 Back 停用。A/B 的時間線按鈕能直接選步、更新 hash。Tab、右方向鍵及等待畫面穩定後的狀態另有截圖。A 的即時鍵盤截圖中 hash 已變為 6，解說仍顯示 5；穩定截圖供檢查過渡結束狀態。
- A/B 實際操作 Replay 的 hover、focus、click，Pause 切為 Play，切換主題後再回復。A5 三張正常動態截圖依次可見地面上的傳輸點、角色作用框與延遲提示改變。檔名的 80、350、700 毫秒為逐次等待量，另含擷取耗時；無法從這些樣本反推 easing 或精確週期。[動態取樣](../../../.local/interactive-v2/task01/motion.jpg)
- C 第 2 步切為已有快取結果後，狀態改為「使用已有的 DNS 位址」。第 8 步切為緩慢查詢後，狀態改為「等待較慢的查詢」。C/E/F 都可從最後一步開啟完整解說，Escape 後焦點回到「完整解說」。參考頁的輔助技術實際朗讀、無 JS 與跨引擎效果未測。
- E1 與 F1 皆以兩張卡片置中，前者區分分數與值，後者區分格式與授權。E3 已提供權重及結果；F3 指出工具回報與交付驗收所需證據。後續設計應保留此差異。D 的 3234 px 桌面文件提供六章入口，適合維持閱讀式索引。[六頁同尺寸總覽](../../../.local/interactive-v2/task01/overview.jpg)

## 重現與查核

在 audit worktree 的 .local/interactive-v2/task01 執行下列指令。瀏覽器使用本機 Chrome channel，沿用原工作區已安裝的 Playwright。擷取器只讀取公開 URL；verify.py 合併補拍、驗證全數 PNG 的 SHA-256、尺寸、字體狀態與六頁六尺寸矩陣。JPG 是 PNG 製成的人工檢視拼圖。

~~~sh
export PW=/Users/iKev/Desktop/02_Projects_and_Code/everything_on_git/kairos-learning/node_modules/@playwright/test
node probe.cjs
node capture.cjs
node sample.cjs
node extra.cjs
python3 verify.py
magick montage B-1440x900-entry.png C-1440x900-entry.png -tile 2x1 -geometry 960x600+2+2 paired-request.jpg
~~~

capture.cjs 首輪 80 張，extra.cjs 產生 16 張，其中 6 張取代較早的放大字級樣本；合計 90 張獨立擷取。verify.py 初版缺少 Pillow，改由 Python 標準函式庫直接讀取 PNG 尺寸後通過。六份 m02 章節 JSON 實際計數為 40 個概念、120 個 scenes。既有 visual-audit、coverage、delivery 與 pilot 為歷史對照，本次數字均來自新擷取或指定基準。FIG-07、INT-01 的來源與互動要求保留至設計目標；PUB-01–02 屬之後正式發布的驗收。本次未建置、執行發布 fixture、提交、推送或部署。Task 02 待本次稽核獲接受後另行啟動。
