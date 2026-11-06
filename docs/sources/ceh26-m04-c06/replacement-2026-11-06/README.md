# M04-06｜Unix/Linux 使用者與 NFS：完整來源與採用紀錄

## 來源層

`pasted-text-1.txt` 與 `image-1.png` 為本次供稿及附圖，逐位元組保存；`SHA256SUMS.txt` 核對兩份原件及修訂前 `previous-catalog-entry.json`。本次開始時，新版 `CEH26-M04-C06` 只有目錄項目，沒有可公開正文，故採初版 v1.0.0、revision 1、原發布／修訂日 2026-11-06。舊 `M04-06` 是已退役的 SMTP 教材，仍留在 `archive/ceh/m04-legacy-2026-11-04/`；不將其內容、日期或進度誤認為本課前版。

正式雙語 Markdown 位於上層 `teaching.zh-TW.md`／`teaching.en.md`，參考答案為 `answer.zh-TW.md`／`answer.en.md`；`source-paragraph-map.json` 按原順序逐項對照 171 個非空白段落，分成原文、程式、表格、清單保留、教學介面轉換與來源匯出雜訊。這份對照保留原文，不以自動統計代替逐節語意核對。

## 章節採用

| 原稿 | 正文位置 | 保留重點 |
| --- | --- | --- |
| 導言與核心流程 | section-1 之前、圖 1 | 同名不同人類比、名稱→數字身分→NFS→權限 |
| 一、帳號名稱與編號 | section-1、圖 2 | learner、1001／2001、共同 GID 3000，平行雙機比較 |
| 二、getent／id | section-2 | NSS、passwd 合成輸出、指定帳號與目前程序、舊 Shell 群組 |
| 三、NFS | section-3、圖 3 | Export／Mount、Client／Server、sec=sys／AUTH_SYS、NFSv4 owner 表示 |
| 四、基本權限 | section-4、圖 4 | 檔案／目錄 r／w／x、路徑通過、600／640／644／777、適用權限組 |
| 五、Permission denied | section-5 | UID 1001≠2001、GID 3000、rw-------、root_squash／all_squash |
| 六、CEH 證據階梯 | section-6 | rpcinfo、showmount、111／2049、v3／v4、六層證據 |
| 七、安全與除錯 | section-7 | 三層控制、四種 sec 模式、依序除錯與 chmod 777 的風險 |
| 最後檢核與下一課 | section-8、answer-nfs-permissions | budget.txt 的三題、假設及下一課 SNMP |
| 編輯技術來源 | section-9 | 正式文件連結，取代 favicon／搜尋匯出殘留 |

兩語各 124 區塊、9 個 h2、4 個 h3、7 表、8 段程式／文字範例、4 圖、一個三題原生參考答案。最後理解題為開放回答，沒有假提交／評分，也沒有新增實際 Q&A；qa=[]。公開課次為 M04-06，stable ID 與既有短 slug 保留；C05 下一篇連到本課，C07 仍連待發布目錄。

## 明列的編輯調整與證據

1. 保留原稿所有教學推理，移除 favicon、`Linux manual page+1` 等來源匯出殘留，改為可直接開啟的技術來源。
2. 檔案判斷補明 Linux filesystem UID／GID（通常等同 effective UID／GID）及補充群組。Group 判斷包括主要與補充群組，且選中某一組後不回退借用 Others 權限。
3. report.txt 案例補明路徑可通過、Export 允許、無 ACL／額外特權／其他映射；budget.txt 補明補充群組不含 3000，避免只看主要 GID 就錯判。
4. 保留 root_squash 對 UID／GID 0 與 all_squash 對全部使用者的差別。AUTH_SYS 數字由用戶端宣告、NFSv4 owner 表示與請求驗證分開；Kerberos 四種模式及須有基礎設施的條件完整保留。
5. 課程用三題編輯參考答案代替「提交答案並請你評分」。沒有代替本人回答、紀錄成績或宣稱實作完成。

2026-11-06 查核 [getent(1)](https://man7.org/linux/man-pages/man1/getent.1.html)、[id(1)](https://man7.org/linux/man-pages/man1/id.1.html)、[credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html)、[path_resolution(7)](https://man7.org/linux/man-pages/man7/path_resolution.7.html)、[exports(5)](https://man7.org/linux/man-pages/man5/exports.5.html)、[showmount(8)](https://man7.org/linux/man-pages/man8/showmount.8.html)、[RFC 5531 附錄 A](https://www.rfc-editor.org/rfc/rfc5531.html#appendix-A)及 [RFC 7530 §5.9](https://www.rfc-editor.org/rfc/rfc7530.html#section-5.9)。GNU id 原站讀取逾時，改核對 man7 上的 GNU Coreutils id(1)，未把逾時當查核成功。這些查核支持教學機制，沒有操作任何 NFS 主機、進行遠端列舉或更改權限。

## 參考圖與響應式設計

附圖保留灰色 Client `/mnt/data`、青綠 Server `/srv/share`、裝置圖示、NFS 與虛線讀寫請求箭頭。桌面保留左右關係，窄容器改為上到下；箭頭仍從 Client 指向 Server，不把圖示意為整份資料複製到本機。補明省略回覆、快取與協定細節；與掛載不代表逐檔授權的正文相鄰。

另外三圖為編輯整理：四步判讀、平行身分對照與四種基本權限。`diagram-models.json` 同時供正式 HTML、搜尋與八份 SVG；只允許固定已知路徑啟用 NfsEvidenceDiagram。SVG 沿既有 fail-closed sanitizer，未接受任意標記、外部資源或事件。

權限互動只接受 600／640／644／777，`permissionBits` 把三個八進位數字逐一轉成 r／w／x；預設 600。原生選單可鍵盤操作，無 JavaScript 停用並保留預設及全部四種對照。它沒有執行 chmod、變更系統或對 NFS 作請求。下載 SVG 固定保留四種模式對照，與動態當前選擇分開說明。

## 維護與下一關

執行 `python3 scripts/ceh26_m04_c06_content.py` 產生正文與 SVG；`--check` 核對可重現產物。`npm run validate:release` 包含該核對。測試另核對原始雜湊、逐段來源對照、獨立指定的權限結果及非法值、相鄰導覽、待發布路由與搜尋。發布回執見[本輪紀錄](../../../releases/2026-11-06-ceh26-m04-c06-nfs.md)。

AI 協助編輯、英譯、圖解與工具驗證；Jason 的三題答案、獨立理解、實體手機、完整螢幕閱讀器與 NFS 實機驗收仍各自待證據。
