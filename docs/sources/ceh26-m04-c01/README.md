# 新版 CEH M04-01 原稿與雙語來源

本課 stable ID：CEH26-M04-C01；公開顯示 CEH M04-01。正式網址為 `/courses/ceh/v13/m04/concepts/m04-01/`，英文加 `/en`。目前 v1.1.0（revision 3），原發布與本版修訂均為 2026-11-04。原 v1.0.1 與早期網址遷移紀錄保留在 [archive-v1.0.1](archive-v1.0.1/README.md)；舊 legacy 教材不恢復。

## 本次來源與採用

- [原始供稿](supplied-2026-11-04.txt)逐位元組保存；[原稿雜湊](supplied-sha256.json)獨立核對。原稿含兩行 Markdown 尾端空白，為保留原文而不刪除。
- `teaching.zh-TW.md` 是採用稿，`teaching.en.md` 是完整對應英譯；保留十節主文、全部細分解釋、ASCII 圖、指令、表格、情境 A／B／C、六道教學 Q&A、總整理與最後三問。兩語各 65 個程式碼／ASCII 區塊及 9 張表。
- [逐章逐小節對照](detailed-section-map.json)含 70 個錨點：十個主節維持 section-1–10，另有導讀、Q&A、總整理、理解檢核，以及 56 個內層標題。英文保留各節機制、比喻、條件、例子與限制，採自然語序及分段。
- `answer.zh-TW.md`／`answer.en.md` 更新為最後三問的參考解答；維持舊 answer-projects 錨點及預設收合。這是教材解答，qa 仍為空，不新增學員回答或理解紀錄。
- `sha256.json` 核對目前四份採用稿／答案。v1.0.1 原本四份稿件、README、雜湊及完整正文模型保留在 archive-v1.0.1；既有凍結雜湊繼續驗證歸檔版本，新的全文順序、表格、命令、搜尋與來源驗證核對本版。

## 明列編輯修正

1. 移除引用網址的 utm_source 追蹤參數；教材自我連結由已撤下的 stable-ID 路徑改為目前 m04-01 正式網址。這是來源供稿與現行路由的差異，不恢復舊網址。
2. 將「Port 開放只是網路層面的觀察」改為「Port 開放只是傳輸層連線的觀察」，保留後續協定證據解釋。TCP 屬傳輸層；此修正不刪去原有例子。
3. 補明主機、帳號、路徑與輸出是教學假設，不聲稱本次對設備實測。原文的測試許可不是 SMB 第三道自動驗證、名稱可見不等於可讀、拒絕不證明檔案存在等條件完整保留。
4. 將 Q&A 區域的舊站狀態敘述改為教學補充問答的定位；最後理解題改為先作答再核對既有原生解答，不推定閱讀等於完成學習。原問題與 student／Research／Admin 案例保留。
5. 課前標題加導讀定位、分開 metadata 與章節；採用稿移除行尾 Markdown 空白，粗體標記由既有純文字模型正規化。原始供稿保持原樣。

## 轉換與呈現

執行 `python3 scripts/ceh26_m04_c01_content.py` 生成 `content/concepts/ceh26-m04-c01.json`，`--check` 核對確定性。沿用既有 sourceBody 的 heading、paragraph、code、table、list、answer；完整標題、表格與 ASCII 圖直接可見。新增表格轉換及明列小節錨點，不接受任意 HTML。SMB 指令只呈現供讀者判讀，未執行探測、讀寫、設定修改或自動評分。

本課的表格、小節標題與程式碼採 16px／1.75 行高；長程式碼與寬表格使用既有命名、可鍵盤捲動區域。樣式只套用 C01，不變更其他文章。保留 ASCII 圖並用相鄰正文解說，不新增圖片或模擬器，受審核 SVG 邊界不變。

發布與驗收續記於 [原回執的 v1.1.0 段落](../../releases/2026-11-04-ceh26-m04-c01.md#v110-完整供稿抽換2026-11-04)。

## 技術來源核對

以下來源已隨本次供稿於 2026-11-04 核對；網址逐一保留於中英正文，不以工具名稱取代證據。此紀錄不宣稱本次安裝工具或對主機實測。

1. [Nmap 通訊埠狀態](https://nmap.org/book/man-port-scanning-basics.html)：open 的觀測意義。
2. [Microsoft SMB 概觀](https://learn.microsoft.com/en-us/windows-server/storage/file-server/file-server-smb-overview)：SMB 用途與常見情境。
3. [Nmap 服務版本辨識](https://nmap.org/book/man-version-detection.html)：基本 SERVICE label 與主動版本探測分開。
4. [Samba smbclient 手冊](https://www.samba.org/samba/docs/current/man-html/smbclient.1.html)：-L、-p、-U；密碼以提示輸入。
5. [Microsoft NetShareEnum](https://learn.microsoft.com/en-us/windows/win32/api/lmshare/nf-lmshare-netshareenum)：資訊層級、名稱與權限界線。
6. [Microsoft 身分驗證與授權](https://learn.microsoft.com/en-us/entra/identity-platform/authentication-vs-authorization)：分開身分與可做的動作。
7. [Microsoft SMB Access Denied](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/access-denied-access-smb-file-share)：不從錯誤文字獨斷根因或檔案存在。
8. [Microsoft SMB 流量防護](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-secure-traffic)：網路範圍與業務需求。
9. [Microsoft 存取控制](https://learn.microsoft.com/en-us/windows/security/identity-protection/access-control/access-control)：保護實際資訊與操作，不只隱藏名稱。
