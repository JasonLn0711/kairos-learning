**CEH M04-04｜SMB 列舉：用證據分清共用、檔案與權限**

本單元簡短複習 SMB 基礎，再補上「拒絕發生在哪一步」及「支援加密不等於正在加密」。

**先用一句話接回來**

SMB（Server Message Block，伺服器訊息區塊）讓電腦透過網路使用伺服器的檔案等資源。共用名稱像資料室入口：查到入口、列出裡面的檔名、讀到某份內容、修改或刪除，必須分別確認。Windows、Samba 與許多 NAS 都能提供 SMB，因此不能只看 SMB 就判定作業系統。[Microsoft：SMB 概覽](https://learn.microsoft.com/en-us/windows-server/storage/file-server/file-server-smb-overview)

基礎複習：共用權限與檔案權限要一起看；ABE（Access-Based Enumeration，依存取權限篩選顯示）主要影響共用內的檔案與資料夾是否顯示，不取代存取控制；簽署與加密保護傳輸，不會替你增加檔案權限。

**一、把「連不上」拆成幾個階段**

典型新連線依序經過：

1. 建立傳輸連線。
2. **Negotiate（協商）**：決定 SMB 版本與能力。
3. **Session Setup（工作階段建立）**：建立使用某個身分的工作階段。
4. **Tree Connect（連接共用）**：要求連到指定共用。
5. 對資料夾或檔案提出列舉、讀取等操作。

這是概念順序，不是每讀一個檔案都要重做全部步驟。前一步成功，也不表示後一步獲准。[Microsoft：SMB 連線與拒絕階段](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/negotiate-session-setup-tree-connect-fails)

因此，TCP 445 開放只是入口線索，還不是取得共用清單。若 Finance 在連接共用時就被拒絕，不能說已經進入其中、確認某個檔案存在，或測完其檔案權限。若能進入 Training，卻在讀取 draft.txt 時被拒，就要保留那次檔案操作的完整回應，核對身分、路徑與有效權限。

ACCESS_DENIED（存取遭拒）是調查起點，不保證原因只有 NTFS 檔案權限；驗證、簽署或加密要求等條件也可能造成拒絕。先定位階段，再查設定與日誌，不要一遇到錯誤就關掉安全保護。[Microsoft：SMB 存取遭拒](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/access-denied-access-smb-file-share)

**二、你輸入的帳號，不一定就是實際使用的身分**

具名帳號、Guest（來賓）與匿名工作階段是不同情況。沒有密碼提示，可能是重用登入資訊或既有票證，不能直接寫成匿名成功；輸入某個帳號名稱，也應核對最後建立的工作階段身分。

工具選項也不是測試結果。例如 smbclient 的 -N 只是抑制密碼提示，不代表伺服器已接受匿名連線。-L 查服務或共用清單、連入共用後的 ls 查目錄、get 下載指定檔案，三者提供不同證據；get 還會在本機保存資料，不能當成完全沒有副作用的列舉。[Samba：smbclient 手冊](https://www.samba.org/samba/docs/current/man-html/smbclient.1.html)

**三、支援、要求、實際使用，分開看**

Dialect（方言）是雙方這次選用的 SMB 協定版本。看到 SMB 3.1.1，只能確認相應的協商結果，不會自動證明每個共用或每次存取都已使用 SMB 加密。

- **支援**：產品與協定具備什麼能力。
- **要求**：有效政策規定必須使用什麼。
- **實際使用**：這次連線真的用了什麼。

Signing（簽署）協助驗證訊息完整性與來源，但不以隱藏內容為目的。Encryption（加密）保護傳輸內容的機密性；即使傳輸已加密，也不等於磁碟上的檔案已加密，或存取權限一定正確。[Microsoft：簽署](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-signing)｜[SMB 加密](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security)

**四、用一份合成案例做診斷**

以下只是紙上教材，沒有執行任何真實查詢。假設核准的實驗室紀錄確認身分為 LAB/labreader：

- 共用清單回傳 Training、Finance。
- Training 目錄列出 readme.txt、draft.txt。
- readme.txt 的指定合成內容讀取成功。
- draft.txt 讀取遭拒。
- Finance 在連接共用時遭拒，未進入共用。
- Training 的連線為 SMB 3.1.1，簽署已使用，SMB 層加密未使用。
- 上傳、修改、刪除都未測試。

目前能說：這個身分看到了兩個共用名稱，讀到了指定的 readme.txt；draft.txt 名稱已揭露，但本次未取得內容；Finance 內部檔案尚未確認。寫入與刪除仍是未知。

若政策連 draft.txt 的名稱都不應讓 labreader 看見，那麼讀取遭拒，仍不代表資訊揭露要求已滿足。ABE 可協助降低這種名稱曝光，但真正的存取限制仍需權限控制。[Microsoft：ABE 的作用範圍](https://learn.microsoft.com/en-us/powershell/module/smbshare/set-smbshare?view=windowsserver2025-ps)

驗證防護時，要同時檢查「該允許的正常使用」與「不該允許的操作遭拒」，並保存時間、身分、路徑、操作、完整回應與未測項目。不要把局部成功寫成攻破，也不要把一次拒絕寫成全面安全。

**今天只做一個小檢核**

同事說：「Finance 已出現在清單，所以裡面的檔案都能讀；Training 使用 SMB 3.1.1，所以內容已加密；readme.txt 能讀，也代表能刪。」

**請用兩三句話修正這段結論，說明目前確認了什麼、還不知道什麼。**

不必執行工具或背封包名稱。下一單元接 NetBIOS／RPC，繼續分清名稱資訊、通訊入口與實際授權。

