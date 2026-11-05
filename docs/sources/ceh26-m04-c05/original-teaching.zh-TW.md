**CEH M04-05｜NetBIOS／RPC：查到名稱與端點，離取得權限還差什麼？**

今天接新版第五單元。先前已介紹過 NetBIOS 名稱表與 RPC 端點，這次把基礎濃縮複習，再練習分辨「資訊查得到、連線接得上、指定操作獲准」三種不同證據。

**一、先把三種角色放回正確位置**

- **NetBIOS**（Network Basic Input/Output System）：原本是區域網路程式使用名稱與交換資料的一套介面；放在 TCP/IP 上運作，稱為 NBT 或 NetBT。
- **SMB**（Server Message Block）：讓用戶端存取網路上的檔案等資源。上一課已分開共用清單、目錄清單、讀取及修改權限。
- **RPC**（Remote Procedure Call，遠端程序呼叫）：程式把參數傳給另一個程序，請它執行指定功能，再接收結果。不是遠端桌面，也不等於拿到命令列。

可以把 NetBIOS 名稱想成通訊錄裡的名稱，RPC 端點想成承辦窗口的位置，特定操作權限則是窗口願不願意替這個身分辦理某件事。這只是角色比喻，**不是 NetBIOS、SMB、RPC 必須依序執行的固定流程**。[RFC 1001：NetBIOS over TCP/IP](https://www.rfc-editor.org/rfc/rfc1001)｜[Microsoft：RPC 如何運作](https://learn.microsoft.com/en-us/windows/win32/rpc/how-rpc-works)

**二、NetBIOS 的短複習：看名稱、尾碼與類型，不把它當成權限表**

在常見 Windows NetBIOS 命名慣例中，名稱共 16 位元組，前 15 位元組放名稱，最後一個位元組是用途尾碼；較短的名稱會補空白。尾碼是十六進位數值，**不是連接埠號碼**。[Microsoft：NetBIOS 名稱表示法](https://learn.microsoft.com/zh-tw/openspecs/windows_protocols/ms-brws/940f299f-669f-4a0b-8411-9ead7e2f31ec)

例如合成名稱表中的三筆資料：

- LAB-FS <00> UNIQUE：工作站服務使用的電腦名稱線索。
- LAB-FS <20> UNIQUE：伺服器服務的名稱線索，可引導後續檔案分享查核。
- LABGROUP <00> GROUP：群組名稱線索，實際工作群組或網域歸屬仍須核對。

UNIQUE 與 GROUP 描述 NetBIOS 名稱類型；GROUP 不是檔案存取控制中的使用者群組。名稱表也不是完整帳號清單。看到 <20>，不能直接推出共用名稱、SMB 版本或指定檔案的讀取權限。[Microsoft：名稱與尾碼行為](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-nbte/6dbf0972-bb15-4f29-afeb-baaae98416ed)

常見連接埠角色可一起複習：名稱服務使用 UDP／TCP 137、資料報服務使用 UDP 138、工作階段服務使用 TCP 139；直接透過 TCP 的 SMB 使用 445，可不依賴 NetBIOS。因此，**137 沒有回應，不代表 445 上的 SMB 一定不存在**。[Microsoft：NetBIOS 與直接 SMB 傳輸](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/direct-hosting-of-smb-over-tcpip)

Windows 的 nbtstat 也要分清資料從哪裡來：

- nbtstat /n：本機名稱表。
- nbtstat /c：本機名稱快取，可能反映先前解析結果。
- nbtstat /a LAB-FS：依遠端名稱查名稱表。
- nbtstat /A 192.0.2.10：依 IP 查遠端名稱表。

/a 與 /A 大小寫有差別。最後一例的 IP 是文件示範位址，不是本課測試目標；這裡不需要執行指令。另注意 /R、/RR 會清除／重載快取或重新註冊名稱，不是單純顯示資訊的同義選項。[Microsoft：nbtstat](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/nbtstat)

**三、RPC 多分一層：介面、操作與端點**

RPC 裡的三個名詞回答不同問題：

1. **介面（Interface）**：提供哪一組約定好的功能與參數格式。
2. **操作（Operation／Procedure）**：這次要呼叫哪一個具體功能，例如讀取某項狀態。
3. **端點（Endpoint）**：透過哪個通訊位置連到服務。TCP 端點可以是埠號；具名管道端點則是管道名稱，不是另一個 TCP 埠。

Microsoft RPC 介面常以 UUID（通用唯一識別碼）和介面版本識別。這個版本描述介面的相容契約，不能直接當成 Windows 或應用程式產品版本，更不能只拿版本數字套用 CVE。[Microsoft：RPC 介面識別](https://learn.microsoft.com/en-us/windows/win32/api/rpcdce/ns-rpcdce-rpc_if_id)｜[端點的種類](https://learn.microsoft.com/en-us/windows/win32/rpc/finding-endpoints)

**Endpoint Mapper（端點對應服務）像查號臺：協助把要找的介面對應到通訊位置。它回覆位置，不會替呼叫者核發所有功能的使用權。**

常見 Microsoft RPC over TCP 情境是：先向 TCP 135 的 Endpoint Mapper 查詢，再連到回傳的服務埠。現代 Windows 常見的動態 TCP 埠範圍是 49152–65535，但實際服務可能採固定埠或另有設定；不能把這段範圍當成每台設備的實測結果，也不是一律對外全開的設定建議。[Microsoft：服務與網路連接埠需求](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/service-overview-and-network-port-requirements)

也有 RPC 經由 SMB 的具名管道傳輸，或用戶端已知道端點的情況，所以不是每次 RPC 呼叫都必須先經過 TCP 135。Samba 的 rpcclient 是 MS-RPC 用戶端工具，可以使用具名管道或 TCP 等傳輸；**工具叫 rpcclient，不表示它的每個命令都只查詢資料，還要核對具體子命令**。[Samba：rpcclient](https://www.samba.org/samba/docs/current/man-html/rpcclient.1.html)

**四、111 與 135：同樣協助找服務，但不是同一套協定**

ONC RPC 常見於 Unix／Linux 相關服務，使用 program number（程式編號）、version（服務協定版本）與 procedure number（程序編號）識別服務及操作。rpcbind／portmapper 在 TCP／UDP 上使用 111，協助查找服務位址；這與 Microsoft RPC 的介面 UUID、TCP 135 不是同一套查詢格式。[RFC 5531：ONC RPC](https://www.rfc-editor.org/info/rfc5531/)｜[RFC 1833：ONC RPC 對應協定](https://www.rfc-editor.org/rfc/rfc1833)

常見的 rpcinfo 可查詢 ONC RPC 登記資料，不能因名稱相似就拿來代替 Microsoft RPC 工具；它也有其他操作選項，使用前仍須核對參數。[Oracle：rpcinfo 官方手冊](https://docs.oracle.com/cd/E88353_01/html/E72487/rpcinfo-8.html)

也別把「先問 111，再連 NFS」背成所有版本的通則。NFSv4.1 規格以 2049 為預設服務埠，並建議用戶端不要使用上述 RPC binding 查詢流程。**不用 rpcbind，不代表不用 RPC**；NFS 的版本差異下一單元再展開。[RFC 8881 §2.9.3](https://www.rfc-editor.org/rfc/rfc8881.html#section-2.9.3)

**五、這次的新重點：失敗發生在哪一步？**

看 RPC 測試結果，可以分成以下問題；它們不是每次都要從頭重做的固定清單：

- **取得登記資料了嗎？**查到端點只是取得映射資訊，尚未證明從目前位置能連到它。
- **端點可達嗎？**映射服務有回應，實際服務埠仍可能被防火牆擋住、停止監聽或已變動。
- **介面相容嗎？**即使 TCP 連線成功，RPC bind 仍要確認介面與傳輸語法等條件。這裡的 bind 是建立 RPC 通訊約定，不是「取得管理權限」。[Microsoft：版本與能力協商](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-rpce/ed7bf5ae-ec8e-407e-b6d7-663958e18701)
- **以什麼身分要求哪個操作？**身分驗證處理呼叫者身分，授權處理能否執行指定工作；某個查詢成功，不能擴張成所有操作都獲准。[Microsoft：RPC 安全的基本原則](https://learn.microsoft.com/en-us/windows/win32/rpc/rpc-security-essentials)

所以「沒有回應」不能直接寫成帳號密碼錯誤，「介面無法使用」不能直接寫成被防火牆擋住，「Access Denied」也不能直接寫成整台主機都安全。先保存原始錯誤、目標、傳輸、身分與發生階段，再配合管理端設定及日誌確認原因。

只阻擋查號臺，不一定阻止已知端點的呼叫；只保護其中一個埠，也未必涵蓋其他傳輸。防護要一起看映射服務、實際端點、可連線來源及操作權限。若確定沒有舊系統依賴，再經相容性測試停用 NetBIOS；不要為了消除 135 埠就隨意停用 Windows 核心 RPC 服務。

**六、用一份合成紀錄練習寫結論**

以下是紙上案例，沒有查詢任何真實主機。假設測試已核准，紀錄如下：

- Lab-A 的 NetBIOS 名稱表回傳 LAB-FS <20> UNIQUE。
- Lab-A 的 Endpoint Mapper 回傳：某個 RPC 介面版本 1.0 登記在 TCP 50020。
- 從同一個測試網段連到 TCP 50020 時逾時，未進行該端點的 RPC 呼叫。
- 沒有查詢 SMB 共用，也沒有讀取任何檔案。

可以記錄：「本次取得 Lab-A 的伺服器服務名稱線索及一筆 RPC 端點映射；從指定測試位置連向 TCP 50020 逾時，尚未驗證該端點的介面呼叫、身分驗證或操作權限。SMB 共用與檔案存取均未測試。」

這個記錄保留了已觀察與未知的界線。實際工作再附上時間、工具版本、完整參數及原始回應，避免把密碼或無關個資寫進報告。若要繼續測試，先確認核准範圍包括該端點與指定唯讀操作；不能因為查到了新埠，就自動擴大測試。

**今天只做一個小檢核**

同事看完上述紀錄說：「<20> 表示共享檔案能讀；135 已經回傳介面，所以我們有 RPC 管理權；50020 逾時，證明那項服務不存在。」

**請用兩三句話修正這段結論，指出已確認的資訊、尚不能下的結論，以及下一步應核對的證據。**

這次只需判讀合成資料，不用連線、安裝工具或改設定，因此沒有環境清理操作。教材交付與理解確認分開記錄；下一單元接 Unix／Linux 使用者與 NFS。
