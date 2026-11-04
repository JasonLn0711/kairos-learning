# 新版 CEH M04-01 原稿與雙語來源

本課 stable ID：CEH26-M04-C01；公開顯示名稱：CEH M04-01。目前正式網址為 `/courses/ceh/v13/m04/concepts/m04-01/`，英文加 `/en`。目前版本 v1.0.1，原發布與版本修訂日均為 2026-11-04；v1.0.1 僅修正公開網址，原稿與正文保持 v1.0.0 的內容。舊 M04-01 正文已歸檔，內部 ID 不恢復。原 v1.0.0 曾使用 `/concepts/ceh26-m04-c01/`，其後依要求遷移，原網址明確 404。

- `teaching.zh-TW.md`：完整保存已提供的新版第一課原稿，十節、用字、順序、命令、合成輸出及最後一題均保留。
- `teaching.en.md`：逐段等義英文版，段落／清單結構、數字、命令、條件與結論對齊。
- `answer.zh-TW.md`、`answer.en.md`：單題教學參考答案，使用既有原生 disclosure 預設收合；沒有新學員回答，qa 為空。
- `sha256.json`：上述四份來源檔案的 SHA-256。

本目錄只含可公開的教學原稿，不含交付時間、訊息 ID、私人紀錄或個人理解狀態。部署及驗收結果另見[發布回執](../../releases/2026-11-04-ceh26-m04-c01.md)。

## 轉換與保存界線

執行 `python3 scripts/ceh26_m04_c01_content.py` 產生 `content/concepts/ceh26-m04-c01.json`，以 `--check` 檢查確定性。只把 Markdown 標題／清單／程式碼轉成既有 sourceBody，移除粗體格式字元；原文字句、原有來源連結、編號與順序不改寫。原稿標題由目錄標題與顯示別名承接，副標由 summary 承接。正文為可選取、搜尋的語意 HTML，沒有額外圖解、實際探測、自動送出或評分。

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
