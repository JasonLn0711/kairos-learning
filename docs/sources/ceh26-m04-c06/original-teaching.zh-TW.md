**CEH M04｜Unix/Linux 使用者與 NFS：名字相同，為什麼還是讀不到檔案？**

今天接新版第六單元，把先前的使用者列舉與 NFS 合在一起複習。這次不重播兩篇舊課，重點放在一條線：**帳號叫什麼、程式以誰的身分執行、伺服器如何辨識請求，以及這個身分能對指定檔案做什麼。**

**一、先把「名冊、識別證、文件櫃」接起來**

想像公司有兩個辦公室，各自發員工證。兩邊都有一位叫「小林」的員工，不代表員工編號一樣，也不代表兩邊的門禁系統會把他當成同一人。

- **使用者列舉（User Enumeration）**：在授權範圍查帳號、使用者編號與群組，像核對員工名冊。
- **UID／GID（User ID／Group ID）**：Linux 用來辨識使用者與群組的數字編號。
- **NFS（Network File System，網路檔案系統）**：讓用戶端透過網路使用伺服器提供的檔案系統，像兩個辦公室共用一座文件櫃。
- **Export／Mount（匯出／掛載）**：伺服器設定要提供哪些資源及條件；用戶端把遠端檔案系統接到自己的目錄樹。掛載不是把全部內容複製到本機，也不代表取得所有檔案的讀寫權。

本課以 Linux 常見行為說明。不同 Unix 系統、檔案系統與 NFS 部署仍要對照各自設定。[Linux 身分與群組](https://man7.org/linux/man-pages/man7/credentials.7.html)｜[Linux NFS 手冊](https://man7.org/linux/man-pages/man5/nfs.5.html)

**二、查帳號資料，和查「正在做事的程式」是兩件事**

先前看過三種查詢，這次把用途並排：

- getent passwd learner：依本機的 NSS（Name Service Switch，名稱服務切換）設定查 learner 的帳號資料，來源可能包括本機檔案與集中式目錄。
- id learner：查指定帳號的使用者與群組資訊。
- id：省略帳號時，顯示目前程序的使用者與群組資訊。從測試終端機執行時，可用來核對該環境的身分，但不能代替查另一個服務程序的身分。

因此，帳號名冊新增了群組，既有工作階段未必已帶著新的群組執行。查得到帳號也只證明查詢來源回覆了這筆資料，不能直接推論可登入、已登入，或有管理權。這類本機查詢本身沒有一個通用的「使用者列舉連接埠」。[getent](https://man7.org/linux/man-pages/man1/getent.1.html)｜[GNU id](https://man7.org/linux/man-pages/man1/id.1.html)｜[程序身分](https://man7.org/linux/man-pages/man7/credentials.7.html)

**三、同名帳號跨到 NFS，還要核對伺服器收到的身分**

常見的 sec=sys／AUTH_SYS 安全模式，會以用戶端提供的 UID、GID 等數字身分資訊處理請求。它本身沒有密碼學身分證明，所以部署時也依賴對用戶端及網路環境的信任。單純把兩台電腦上的帳號都命名為 learner，不會自動統一它們的 UID 或權限。[RFC 5531：AUTH_SYS](https://www.rfc-editor.org/rfc/rfc5531.html#appendix-A)

還有兩個容易混在一起的地方：

- **root_squash**：Linux NFS 伺服器把請求中的 UID／GID 0 對應到匿名 UID／GID，避免直接承接遠端 root 的身分。它不會把所有非零身分一起匿名化；那是不同的 all_squash 設定。因此，root_squash 不能代替完整的身分與檔案權限管理。[NFS 身分對映選項](https://man7.org/linux/man-pages/man5/exports.5.html)
- **NFSv4 的擁有者名稱屬性**：檔案的 owner／owner_group 可以採 user@domain 形式表示，再做本地對映。這和「這次請求用什麼方式驗證身分」是不同問題；看到 NFSv4 或同名帳號，仍要核對實際安全模式與伺服器採用的身分。[RFC 8881 §5.9](https://www.rfc-editor.org/rfc/rfc8881.html#section-5.9)

**四、權限要看對象：目錄的 r／x，不等於檔案的 r**

先用一般 Linux 權限說明，暫不加入 ACL（Access Control List，存取控制清單）等額外規則：

- 對一般檔案，r 是讀內容，w 是修改內容，x 是執行。
- 對目錄，r 是讀取目錄項目名稱，x 是搜尋／通過目錄、依名稱查找其中項目。要讀某個檔案，還需要對路徑上的目錄具有適用的搜尋權限，以及檔案本身的讀取權限。

像文件室一樣：能看櫃門上的文件名稱，不代表能打開每份文件；知道文件名稱，也還要有通過門禁與開啟文件的權利。[Red Hat：檔案系統權限](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/configuring_basic_system_settings/managing-file-system-permissions_configuring-basic-system-settings)｜[Linux 路徑解析](https://man7.org/linux/man-pages/man7/path_resolution.7.html)

例如權限文字 rw-r-----，每三個字元是一組，依序表示擁有者可讀寫、所屬群組可讀、其他人沒有權限；短橫線代表那項權限未開啟。一般基本權限會依擁有者、群組、其他人的適用身分類別判斷，不是把三組任意相加。實際環境還須核對 ACL、安全政策與特權等因素。[Linux 權限表示](https://man7.org/linux/man-pages/man7/inode.7.html)｜[權限判斷](https://man7.org/linux/man-pages/man7/path_resolution.7.html)

**五、看一份合成紀錄：名稱相同，資料夾能列出，檔案仍遭拒**

以下是紙上案例，沒有連線任何真實主機。假設管理者已核准測試帳號、指定共享與唯讀操作：

1. 用戶端的 learner 是 UID 1001，主要 GID 3000，群組清單只有 3000；測試程序也使用這組身分。
2. 伺服器帳號資料中的 learner 卻是 UID 2001。
3. NFS 使用 sec=sys；管理端核對這次請求以 UID 1001、GID 3000 處理，未另行對映。root_squash 已啟用。
4. 共享已成功掛載，能列出其中 report.txt 的名稱；讀取 report.txt 時收到 Permission denied。
5. 伺服器確認該檔案擁有者 UID 為 2001、群組 GID 為 3000，基本權限為 rw-------。路徑搜尋已獲准；本例沒有額外 ACL 或特權改變這項判斷。
6. 沒有測試修改檔案，也沒有測試其他檔案。

讀這份紀錄時，依序比對「實際請求 UID」與「檔案擁有者 UID」，再看適用的權限組。不要只比兩台電腦顯示的 learner 名稱，也不要把目錄清單成功當成檔案內容已讀取。

這裡的設定與身分已經明示，所以能練習有條件的權限判讀。真實工作若只有 Permission denied 一句，仍需查核身分、路徑、有效權限與日誌，才能確認原因。

**六、列舉工具知道多少，結論就寫到哪裡**

上一課的 rpcinfo 可查 ONC RPC 服務登記；showmount -e 則向 MNT 服務查詢 export 清單。兩者都不等於讀取共享內的檔案；使用工具前仍要核對具體選項，工具名稱本身不保證所有操作都是唯讀。[Oracle：rpcinfo](https://docs.oracle.com/cd/E88353_01/html/E72487/rpcinfo-8.html)

NFS 常見服務埠是 2049；NFSv3 部署常另涉及 111 上的 rpcbind 及 mountd 等服務。NFSv4.1 不要求沿用這套尋址流程，規格建議用戶端不要透過 RPC binding 查服務埠。只提供 NFSv4 的伺服器也可能不開放 showmount 所查的 MNT 服務。因此，**showmount 查不到，不足以證明沒有 NFS；2049 有回應，也不足以證明指定檔案可讀。**[showmount 手冊](https://man7.org/linux/man-pages/man8/showmount.8.html)｜[NFS 網路服務](https://man7.org/linux/man-pages/man5/nfs.5.html)｜[RFC 8881 §2.9.3](https://www.rfc-editor.org/rfc/rfc8881.html#section-2.9.3)

記錄時至少分清：查到帳號、查到共享、掛載成功、列出名稱、讀取內容、修改內容。它們各自是不同的證據，並不是每次都要從頭執行的固定測試流程。

**七、防護與下一步查核**

管理者要一起維護帳號生命週期、跨主機身分對映、共享允許來源，以及目錄與檔案權限；只需閱讀的共享，採伺服器端唯讀政策。export 的 rw 只讓共享層允許寫入，沒有替所有使用者授予檔案寫入權。[exports 手冊](https://man7.org/linux/man-pages/man5/exports.5.html)

需要較強身分與傳輸保護時，可依基礎設施評估 Kerberos：krb5 提供身分驗證，krb5i 再提供完整性保護，krb5p 再提供加密的隱私保護。支援這些能力不等於目前已啟用；應核對實際協商與設定。[NFS 安全模式](https://man7.org/linux/man-pages/man5/nfs.5.html)

遇到拒絕先保存時間、版本、安全模式、用戶端、實際請求身分、路徑、操作與完整回應，再由獲授權的管理者核對設定。修正依工作需求授予必要權限，保留原設定並在同一測試條件重驗，不用「把所有權限打開」取代診斷。公開紀錄使用合成名稱，不放真實帳號清單或憑證。

**今天只做一個小檢核**

針對第五節，同事說：「兩邊都叫 learner，而且能看到 report.txt，代表已經有讀取權；如果讀不到，一定是 root_squash 造成的。」

**請用兩三句話修正這段結論：實際以哪個身分判斷？哪個設定能解釋本例的讀取結果？還有哪些操作沒有證據？**

這次只判讀合成資料，沒有實際安裝、掛載或修改設定，因此沒有環境清理步驟。參考解答另外提供，教材交付與理解確認分開；下一單元接 SNMP。
