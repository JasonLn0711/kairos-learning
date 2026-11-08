# 資工底層原理通識課：供稿與編輯追溯

目標文章：`cs-systems-foundations`，預定網址 `/perspectives/cs-systems-foundations/` 與 `/en/perspectives/cs-systems-foundations/`。目前為編輯工作稿，尚未加入正式內容、發布或驗收。

讀者目標：幫助有一般電腦操作經驗的讀者，從資源、身分、狀態與操作理解軟體系統，依問題所在層次選擇觀察方法與驗收證據。

主要主張：系統排錯需要辨識每一層管理的物件及責任，並以對應層次的證據確認結果。

## 來源與正文

- `original.zh-TW.md`：完整原始供稿，保留格式、命令及來源卡片文字。
- `source-checksums.json`：原始文字及八張 PNG 的 bytes／SHA-256；原始附件副本位於忽略的 `.local/sources/cs-systems-foundations/`。
- `source-outline.json`：71 個原始二、三級標題及原始行號；這是盤點，不等於完整性驗收。
- `teaching.zh-TW.md`：完整中文正規化工作稿。`scripts/prepare-cs-systems-source.py` 可從原始封存重建；完成後續編輯時必須同步更新轉換規則，不能覆寫未納入產生器的修改。

原稿包含十五章、末段五個觀念與三個額外圖解標題。圖解標題雖使用二級 Markdown，出版時應依所在章節的教學關係安置，保留全部內容。綜合檢核 A–F 保留開放題，原稿要求「先不提供答案」。網站不新增未實作的送出或批改按鈕。

## 已明列的編輯修正

| 原文位置／內容 | 成稿處理 | 理由與下一個驗證 |
| --- | --- | --- |
| 導言「前面兩份教材」、第一章「前面所有主題」、第十章「前述教材」 | 改為本文自足的系統學習導言 | 讓獨立觀點文章可理解，教學範圍保持。 |
| Python `with open` 與讀取同列 | 換行並縮排 `content = f.read()` | 顯示標準可讀語法，非聲稱已讀取某個真實 data.txt。 |
| 第三章 `stat`／`readlink -f` | 標明 Linux／GNU，macOS 先核對本機手冊 | 避免把選項及輸出格式當成跨平台完全一致。 |
| 第十四章 `sha256sum` | 加 `command -v` 與 macOS `shasum -a 256` 分支 | 原稿明列 Linux／macOS；需實測本機練習與清理。 |
| 第十四章缺預期結果、清理 | 說明同 device／inode、連結數 2、摘要相同；指定三個檔名刪除後 `rmdir` | 保留原練習，補完整觀察／判讀／清理。 |
| 末段「提交並請你逐題批改」 | 說明交授課者／後續討論，頁面不提供線上批改 | 保留學習行動，避免假互動。 |
| 來源 favicon 與孤立的站名 | 工作稿移除卡片雜訊，將技術來源改為可追溯的正式來源欄 | 仍需逐主張查核，不能以 favicon 當引用。 |
| 轉義粗體、數學定界符、HTML 空白實體 | 轉可選取純文字公式與正常文字 | 不修改數字與公式語意。 |
| 原稿外部 hard-link 圖片 URL | 暫記 `{{figure:links}}`，以本次附件 3 重製 | 文章應使用受審核 SVG 與 HTML 文字。 |

## 八圖重製契約（已目視參考圖，尚待實作／驗收）

1. 生命週期：Source → Dependency → Build / Execute → Artifact → Deploy / Serve → Verification，六階段垂直；Verification 有框，末註說明驗證貫穿流程。
2. 硬體角色：CPU／RAM／SSD／GPU 四個平行節點，桌面 2×2，無順序箭頭。
3. 檔案連結：左右比較；a.txt／b.txt 兩個 directory entry 匯入 same inode（nlink=2）再接 shared data。link.txt → link inode（stored path: target.txt），虛線 resolve path 到 target.txt → target inode → target data；另一虛線分支為 target removed → dangling link。符號連結可跨檔案系統；保留同 inode 的硬連結界線。
4. 內容定址：Content → SHA-256 → Blob Store，下面並列版本 A／B 各參照 Hash X，不能把 A／B 畫成時序。
5. 依賴環境：Manifest → Lockfile，再向下接 Installed Environment；三者責任不同，原稿的 2.x／2.5.1／2.4.0 例子保留正文。
6. Docker：可寫層／應用層／依賴層／基底層上下排列，Volume／Bind Mount 在分隔線下方獨立框；不以箭頭暗示執行順序。
7. Git 區域：Working Tree／Index／Repository 平行說明，下方 Working Tree → git add → git commit 表示操作；正文說明狀態轉換。
8. Git DAG：A—B，B 分到 C—D 與 E—F，D／F 匯入 G；功能分支與合併用青綠色，另一開發線灰色。線無箭頭，圖說明示 Git 內部父指標由新提交指向父提交。

文字、節點、線型及相對關係須保留；下載 SVG 保留桌面幾何，網頁以可搜尋 HTML＋CSS／SVG 重排，不能直接把寬圖縮到手機。每圖雙語，下載小於 100000 bytes，來源／搜尋／下載同源。

## 來源查核（2026-11-08）

本次已讀取以下官方／專案文件，作為正式引用候選；其餘主張仍待逐節核對。

- [Linux inode(7)](https://man7.org/linux/man-pages/man7/inode.7.html)：device／inode 身分、link count。
- [uv caching](https://docs.astral.sh/uv/concepts/cache/)：快取管理與安全規則。
- [Docker storage](https://docs.docker.com/engine/storage/)：容器可寫層、映像唯讀層、獨立掛載與持久資料。
- [pnpm symlinked node_modules](https://pnpm.io/symlinked-node-modules-structure)：共用 store、依賴目錄與符號連結，另須核對不同匯入模式與 peer 情況。

## 實作與驗證紀錄

2026-11-08：先 fetch 並 fast-forward 至 `e884343`，保留遠端新增的 pnpm 文件。新增受限 `PerspectiveBlock`：paragraph／heading／code／list／table；沿用 Svelte 跳脫、具名可鍵盤捲動區域及現有發布閘門。資料拒絕額外欄位、無效形狀及重複錨點；雙語形狀檢查防止遺漏 code／table／list。既有文章保持原契約。

- `pnpm exec node --experimental-strip-types --test tests/perspective-body.test.ts tests/perspectives.test.ts`：9 通過。
- `pnpm run check`：0 errors、0 warnings。
- `pnpm test`：267／267 通過。
- `pnpm run validate:content`：通過。
- macOS 27.0.1 ARM64 隔離暫存目錄實測：以 Python 標準函式庫建立檔案／硬連結／符號連結，確認同 device＋inode、nlink=2、SHA-256 相同、symlink 自有 inode；結束確認暫存目錄已清除。這驗證檔案機制，尚未等同逐行執行文章 Shell 範例或 Linux 平台驗收。
- 上述結果只驗證新正文契約與既有觀點回歸，不代表新文章已成稿、八圖已重製或頁面已上線。
- 協作：本次由 Codex 進行來源保存、格式轉換、編輯修正與程式實作，未記錄未發生的人工作業。

下一步：完整英文與逐小節雙語對照、八圖資料及元件／SVG、正式 JSON、逐段與來源查核、完整門檻／瀏覽器／正式站回讀。規則涵蓋 WRITE-01–07、09–11；HTML-01–04；FIG-01–06；A11Y-01–03。待驗事項完成前，不標示已發布。

## SVG 工作預覽（本輪新增）

`python3 scripts/cs_systems_diagrams.py` 產生 `diagrams.json` 及 `svg/` 下十六個雙語 SVG，`--check` 核對重建一致。使用既有 fail-closed serializer，保留 title／desc、viewBox、固定元素及本地 marker。此為編輯預覽，尚未接入正式文章或公開下載；字框、連線、對比及附圖相似度仍須瀏覽器與目視檢查。八圖已具固定版型，硬體圖示仍待補齊；長英文標籤需檢查溢出，Git G 節點字色需提高對比。

## 英文成稿進度

`teaching.en.md` 已完成導言與第一至第五章（包含生命週期、各小節、表格、程式碼、比喻與判讀限制）。第六至十五章及末段仍待翻譯，不能用這份部分稿作正式英文文章。Git DAG 的 G 節點字色已修為白色；十六份 SVG 重新產生並通過 `--check`，仍待實際圖形驗收。

英文續稿已完成第六至十五章及末段，含依賴／ABI、快取／Docker、Git、CI/CD、網站、安全、證據、治理、實作與 A–F 開放題。下一步為逐小節及正文形狀對照，尚未視為正式成稿驗收。

## 正式模型與隔離建置

完整雙語稿已由 `scripts/generate-cs-systems.py` 轉為 `content/perspectives/cs-systems-foundations.json`，保持 draft；16 個資產暫存 `staged-assets/`，未放進公開 static 目錄。正文新增受限 systemsFigure，名稱限定八個固定版型，文字進入搜尋資料；未知圖名／額外欄位拒絕。`SystemsFigure.svelte` 的初版桌面 SVG 與手機文字節點呈現仍需關係重排、視覺及無障礙驗收，不能以目前元件稱為完成 FIG-01–06。

本輪 `pnpm run check` 0 errors／0 warnings；`validate:content` 通過；觀點與正文測試 10／10。隔離 `.local/cs-systems-preview` 將草稿設為 published 以建置，正式資料維持 draft；隔離 build 成功，未部署。日期與發布來源仍需在正式發布前確認。

隔離 Chrome 首輪檢查：中英各 320／390／768／1280 CSS px，均取得八圖且無整頁水平溢出（`.local/cs-systems-first-browser.json`）。此輪僅涵蓋圖數與溢出，尚不能證明圖意、全文、鍵盤、200% 或無 JavaScript 驗收。

## 原生圖解與第二輪瀏覽器驗證

已把初版圖片＋節點清單改為可選取 HTML、固定 SVG 圖示／箭頭、CSS 容器重排。流程、平行、儲存分層、硬連結匯聚、symlink 解析／失效條件、Git 分支／合併分組各有明示關係。插圖位置改依小節錨點，不再以易錯的段落數值定位；原稿全文保留。加入八筆已核對的公開來源，依相應章節引用。

`python3 scripts/preview-cs-systems.py` 成功建立隔離草稿。`node scripts/check-cs-systems-browser.mjs` 通過：雙語完整正文逐區塊可見文字、中英各四寬度無整頁溢出、八圖、200% 根字級、全部下載 bytes 與隔離建置相符、無 JS 基本檢查。證據在 `.local/cs-systems-browser/`，包含 32 張逐圖截圖與 results.json。觀點測試 10／10、內容驗證通過、型別 0 errors／0 warnings。

已目視手機硬連結／符號連結圖及桌面 Git 圖。手機文字、分組、虛線條件可辨認；桌面 Git HTML 目前是分組卡片而非附件的菱形 DAG，須進一步調整才符合參考圖幾何要求。下載 SVG 仍須逐圖檢查文字與線條，硬體下載圖也尚需補上參考圖示。未把自動檢查宣稱為 FIG-04 全部通過；鍵盤實測、SVG 幾何、完整來源審查、publication-boundary／release gates、提交推送部署與正式站回讀仍待完成。

## 桌面幾何與 SVG 邊界修正

Git 桌面 HTML 改為七個可選取節點與背景 SVG 連線，維持 A—B、B—C—D—G／B—E—F—G 的菱形歷史；手機保留明示分支卡片。下載圖補上 CPU／RAM／SSD／GPU 圖示、硬體外框與置中文字；英文改以詞為單位換行，避免 dangling link 等詞拆成孤字。SVG 圖 3 使用較小字級容納全部連結資訊；下載檔是固定幾何，網頁正文使用至少 16px HTML 重排。

`node scripts/check-cs-systems-svg.mjs` 逐一載入 16 SVG，以 Chrome 字框檢查 viewBox 內邊界及文字互相重疊，保存 PNG 與 results.json 於 `.local/cs-systems-svg/`。已目視 links-en、hardware-zh、git-dag-zh、environment-en，確認主要節點與實／虛線關係；發現硬體居中時參數位置錯誤造成三處超界，已修正產生器並重建重驗。桌面／手機與 SVG 的完整逐圖相似度、鍵盤及發布驗收仍須繼續。
