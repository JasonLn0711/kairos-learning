# M04-05｜NetBIOS／RPC 列舉：白話文完整教學

**這一課最重要的觀念是：查得到一台電腦、知道它提供什麼服務，不代表你有權限使用那些服務。**

本單元是 CEH M04（Enumeration，列舉）的第五課，主題為：

**NetBIOS／RPC Enumeration：網路名稱、遠端服務與操作權限的調查。**

原始教材：[CS Kairos Learn－CEH M04-05](https://learn.cs-kairos.com/courses/ceh/v13/m04/concepts/m04-05/)

## 先用一個故事理解整堂課

假設你是一位刑事警察，正在調查某間公司的資訊系統。

你知道這家公司有一棟辦公大樓，但不知道裡面有哪些部門、哪些員工負責什麼業務，以及你是否有權查閱資料。

於是，你開始進行調查。

| 調查過程 | 電腦網路的對應概念 |
|---|---|
| ① 知道大樓地址 | IP Address |
| ② 查詢大樓裡有哪些部門 | NetBIOS 名稱列舉 |
| ③ 知道某部門提供文件服務 | SMB 服務 |
| ④ 向總機詢問承辦人分機 | RPC Endpoint Mapper |
| ⑤ 撥打承辦人的分機 | 建立網路連線 |
| ⑥ 確認雙方使用相同的辦事程序 | RPC 介面協商 |
| ⑦ 出示證件，請求調閱資料 | 身分驗證與操作授權 |

現在假設你已經查到：

- 公司有一個檔案管理部門。
- 該部門的承辦分機是 50020。
- 但是撥打 50020 時，電話沒有接通。

**你能夠因此認定這個部門不存在嗎？**

不能。

可能是電話線路故障、分機換了、有人設定禁止外部來電，或者承辦人目前沒有接電話。

同樣地，在電腦網路裡：

> **查得到服務，不代表連得上；連得上，不代表通過驗證；通過驗證，也不代表有權執行任何操作。**

這就是 M04-05 的核心。

接下來我們按照原始教材的六個章節，逐步建立完整觀念。

## 第一章｜先認識 NetBIOS、SMB、RPC 三種技術

這三種技術常常同時出現在 Windows 網路環境中，但是用途不同。







[[figure:roles]]

### 1.1 NetBIOS：讓電腦知道彼此的名稱

NetBIOS 的全名是 Network Basic Input/Output System。

你可以先把它想成：

**電腦區域網路裡的一套名稱與通訊機制。**

例如，一間公司有三台電腦：

| IP 位址 | 電腦名稱 | 用途 |
|---|---|---|
| 192.168.1.10 | LAB-FS | 檔案伺服器 |
| 192.168.1.20 | LAB-PC01 | 員工電腦 |
| 192.168.1.30 | LAB-PRINT | 列印服務 |

我們知道，每台電腦在網路上都需要使用 IP 位址通訊。

但人類很難記住大量 IP。

因此，名稱機制讓我們可以使用比較容易辨識的名稱。

例如：

```text
LAB-FS
```

這個名稱可能代表公司的一台檔案伺服器。

但要注意，NetBIOS 不只是名稱解析，它還包含名稱服務、資料報與工作階段等機制。

其中，NetBIOS over TCP/IP（NBT／NetBT）是將相關功能放到 TCP/IP 網路上運作的方式。

另外，現代 Windows 網路也廣泛使用 DNS，不是所有電腦名稱都必須經由 NetBIOS 解析。

### 1.2 SMB：讓電腦分享檔案

SMB 的全名是 Server Message Block。

假設公司將一個資料夾設定為共享：

```text
\\LAB-FS\Public
```

其他員工便可能透過 SMB 存取它。

SMB 負責處理的事情包括：

- 查詢共享資料夾。
- 列出資料夾內容。
- 讀取檔案。
- 新增、修改或刪除檔案。

但每個操作都可能有不同的權限要求。

例如，員工 A 可以讀取報告，卻不能修改報告。

員工 B 則可能同時具有讀寫權限。

因此：

**知道某台電腦提供 SMB 服務，不代表自己可以讀取該電腦上的檔案。**

這與上一課 M04-04 的觀念相同。

### 1.3 RPC：讓一台電腦請另一台電腦執行功能

RPC 的全名是 Remote Procedure Call，中文稱為「遠端程序呼叫」。

這是本課最重要的新概念。

假設公司有一台印表機伺服器。

你在自己的電腦上開啟管理軟體，希望查詢：

> 目前印表機還有多少工作正在排隊？

管理軟體可以透過 RPC，向遠端服務提出請求。

整個過程概念上是：

```text
你的電腦
    │
    │ 請問目前有多少列印工作？
    ▼
遠端伺服器
    │
    │ 執行查詢功能
    ▼
回傳查詢結果
    │
    ▼
你的電腦顯示結果
```

這就是 RPC 的基本概念。

如果你熟悉軟體工程，可以將它理解成：

**呼叫一個遠端電腦提供的函式（Function）。**

例如：

```python
# 純粹用來說明概念的虛構函式
result = remote_printer.get_job_count()
```

看起來像呼叫普通函式，但實際執行功能的是遠端伺服器。

RPC 系統會負責處理資料傳輸、參數轉換與結果回傳等工作。

Microsoft 的 RPC 文件也採用這種用戶端呼叫遠端程序的架構。[Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/rpc/how-rpc-works)

### 1.4 RPC 與遠端桌面有什麼不同？

這裡很容易誤解。

| 技術 | 主要用途 | 白話理解 |
|---|---|---|
| RPC | 呼叫遠端功能 | 請別人替你執行一項指定工作 |
| RDP | 遠端桌面 | 透過網路操作另一台電腦的桌面 |
| SSH | 安全遠端連線與命令執行 | 登入遠端系統並在授權範圍內操作 |
| SMB | 網路檔案共享 | 存取另一台電腦提供的共享檔案 |

RPC 不等於遠端桌面，也不代表一定能開啟命令列。

RPC 能做什麼，取決於目標服務實際提供哪些功能，以及呼叫者是否獲得授權。

**第一章的重點：**

NetBIOS 主要讓我們辨識名稱與相關服務線索；SMB 用來存取共享資源；RPC 則讓程式呼叫遠端提供的功能。

三者並不是一定要依序執行的固定流程。

---

## 第二章｜NetBIOS 列舉：從電腦名稱尋找線索

### 2.1 什麼是 Enumeration（列舉）？

先連結前面學過的 CEH。

M03 的重點是 Network Scanning（網路掃描）。

我們可能透過掃描知道：

```text
192.168.1.10
    TCP 445 OPEN
```

這代表什麼？

代表從目前的測試位置，觀察到 TCP 445 提供可建立連線的入口。

因為 TCP 445 常用於 SMB，所以這是一項服務線索。

但我們還不知道：

這台電腦叫什麼？提供哪些共享資源？目前允許哪些操作？

於是進入 M04。

**Enumeration（列舉）就是進一步向服務查詢資訊，讓原本模糊的線索變得具體。**

不過，列舉結果是否足以支持某個結論，仍然取決於實際取得的資料。

### 2.2 NetBIOS 名稱後面的 `<00>`、`<20>` 是什麼？

假設我們取得以下資料：

```text
LAB-FS       <00>  UNIQUE
LAB-FS       <20>  UNIQUE
LABGROUP     <00>  GROUP
```

初學者可能會想：

為什麼 LAB-FS 出現兩次？

`<20>` 是不是連接埠 20？

UNIQUE 是不是代表只有某個人有權限？

答案都不是。

我們先拆解第一筆：

```text
LAB-FS       <00>  UNIQUE
  │           │      │
  │           │      └─ 名稱類型
  │           │
  │           └─ NetBIOS 名稱尾碼
  │
  └─ 電腦名稱
```

NetBIOS 名稱通常由 16 個位元組組成。

前 15 個位元組用於名稱，最後一個位元組是辨識用途的尾碼（Suffix）。

這個尾碼以十六進位表示。

因此：

`<20>` 指的是十六進位數值 `0x20`，**不是 TCP 20 埠**。[Microsoft Learn](https://learn.microsoft.com/zh-tw/openspecs/windows_protocols/ms-brws/940f299f-669f-4a0b-8411-9ead7e2f31ec)

### 2.3 三種常見紀錄

**第一種：`LAB-FS <00> UNIQUE`**

在常見的 Windows NetBIOS 命名慣例中，這是工作站服務使用的名稱線索。

你可以把它理解成：

「這台電腦以 LAB-FS 這個名稱登記了相關服務。」

**第二種：`LAB-FS <20> UNIQUE`**

`<20>` 通常是 Windows Server Service（伺服器服務）的名稱尾碼。

這告訴我們：

這台電腦登記了與檔案分享服務有關的名稱。

但它不代表：

```text
LAB-FS 上面所有共享檔案都可以讀取
```

因為共享是否存在、哪些使用者能讀取、是否需要驗證，都必須另外查核。

**第三種：`LABGROUP <00> GROUP`**

這裡的 GROUP 是 NetBIOS 名稱類型。

它可能反映工作群組或網域相關的命名資訊。

注意，這裡的 GROUP 並不等於 Windows 中負責存取控制的使用者群組。

UNIQUE／GROUP 描述的是名稱登記類型，不是檔案權限。[Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-nbte/6dbf0972-bb15-4f29-afeb-baaae98416ed)

### 2.4 為什麼要記住 137、138、139、445？

這四個連接埠非常重要。

| 連接埠 | 協定 | 功能 | 白話理解 |
|---|---|---|---|
| 137 | UDP／TCP | NetBIOS Name Service | 查詢名稱 |
| 138 | UDP | NetBIOS Datagram Service | 傳送資料報 |
| 139 | TCP | NetBIOS Session Service | 建立工作階段 |
| 445 | TCP | Direct-hosted SMB | 直接提供 SMB 通訊 |

這裡有一個值得理解的歷史變化。

早期 SMB 可以經由 NetBIOS Session Service 傳輸。

後來，SMB 也能直接透過 TCP 445 通訊，不必依賴 NetBIOS。

因此，假設：

```text
UDP 137：沒有回應
TCP 445：可以建立連線
```

兩者完全可能同時成立。

不能因為 NetBIOS 名稱查詢沒有回應，就認為 SMB 不存在。

Microsoft 官方文件也明確區分 NetBIOS 傳輸與直接透過 TCP 445 的 SMB。[Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/direct-hosting-of-smb-over-tcpip)

### 2.5 nbtstat 是什麼？

`nbtstat` 是 Windows 提供的 NetBIOS over TCP/IP 診斷工具。

可以用它查看名稱表、名稱快取等資訊。

假設我們在 Windows 電腦上操作。

**查看自己電腦的 NetBIOS 名稱表：**

```powershell
nbtstat /n
```

這是查看本機資訊。

**查看本機快取的名稱資料：**

```powershell
nbtstat /c
```

這是查看電腦以前查過、目前仍保留在快取中的名稱。

要注意：

快取資料可能不是目標目前最新的狀態。

**透過電腦名稱查詢遠端名稱表：**

```powershell
nbtstat /a LAB-FS
```

**透過 IP 查詢遠端名稱表：**

```powershell
nbtstat /A 192.0.2.10
```

這裡使用的 `192.0.2.10` 是文件示範位址，不是實際測試目標。

請注意：

`/a` 與 `/A` 大小寫不同，功能也不同。

另外，`/R`、`/RR` 會影響名稱快取或名稱重新註冊，不應把它們當成純粹查看資料的指令。

在實際環境使用遠端查詢前，應先確認設備及網路測試範圍已獲授權。[Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/nbtstat)

**第二章的重點：**

NetBIOS 列舉可以提供電腦名稱、服務名稱與群組等線索。

但是，名稱表不是檔案權限表，也不是完整的使用者帳號清單。

---

## 第三章｜RPC 列舉：找到遠端服務的真正位置

這是整堂課最值得深入理解的部分。

### 3.1 什麼是 RPC Endpoint？

假設你現在要聯絡公司的資訊部門。

你知道資訊部門存在，但不知道他們的分機號碼。

於是你打給總機。

```text
你：「請問資訊部門的分機？」

總機：「資訊部門是 50020。」

你：「謝謝，我現在撥打 50020。」
```

RPC 也有類似的機制。

其中：

- Interface（介面）：一組功能的約定。
- Operation（操作）：其中某項具體功能。
- Endpoint（端點）：提供通訊的具體位置。

例如，某個 RPC 服務可能支援：

```text
Interface：PrinterManagement

    Operation 1：查詢列印工作
    Operation 2：取消列印工作
    Operation 3：修改印表機設定
```

這只是為了教學而建立的假想介面，不是 Windows 內建介面的真實名稱。

不同操作可能需要不同權限。

一般員工也許可以查詢列印狀態，但只有管理員能修改印表機設定。

### 3.2 Endpoint Mapper 是什麼？

Endpoint Mapper 是 RPC 使用的端點對應機制。

在常見的 Microsoft RPC over TCP 情境中，它使用 TCP 135。

可以把它想成：

**RPC 服務的查號臺。**

例如：

```text
你的電腦
    │
    │ TCP 135
    │ 請問某個 RPC 介面在哪裡？
    ▼
Endpoint Mapper
    │
    │ 回答：
    │ 該介面登記在 TCP 50020
    ▼
你的電腦
    │
    │ TCP 50020
    ▼
RPC 服務
```

但這裡有一個很重要的細節。

**TCP 135 並不是所有 RPC 功能實際工作的連接埠。**

它可能只是協助查找服務位置。

真正提供功能的服務，可能位於另一個連接埠。

Microsoft RPC 的端點也可以是具名管道（Named Pipe），不一定是 TCP 埠號。[Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/rpc/finding-endpoints)

### 3.3 為什麼 RPC 會出現 50020 這種連接埠？

因為部分 Microsoft RPC 服務使用動態連接埠（Dynamic Port）。

意思是：

服務不一定永遠使用同一個埠號。

在現代 Windows 的常見預設設定中，動態 TCP 埠範圍是：

```text
49152–65535
```

例如某次服務啟動後使用：

```text
TCP 50020
```

另一次可能使用其他埠號。

實際情況還要考慮作業系統版本、應用程式與管理員設定。

另外，這段範圍並不表示所有埠都正在監聽，更不表示應該全部對外開放。[Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/service-overview-and-network-port-requirements)

### 3.4 RPC 的 UUID 是什麼？

RPC 服務可能提供多個不同介面。

系統需要一個方法辨識：

「現在要呼叫的究竟是哪一組功能？」

因此 Microsoft RPC 可以使用 UUID（Universally Unique Identifier）作為介面識別資訊。

例如：

```text
Interface UUID：
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

Interface Version：
1.0
```

這裡的 UUID 是示意格式。

你可以將它理解成：

```text
UUID：辨識哪一種功能介面
Version：辨識該介面的版本
```

但有一個常見的資安判讀錯誤：

> 看到 RPC Interface Version 1.0，就認為這台電腦執行 Windows 1.0，或者認定它存在某個舊版弱點。

這是不對的。

RPC 介面版本與作業系統版本是不同概念。

要判定 CVE 是否適用，仍需要確認產品、元件及實際版本等資訊。[Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/api/rpcdce/ns-rpcdce-rpc_if_id)

### 3.5 RPC Bind 代表什麼？

假設現在你已經找到端點：

```text
TCP 50020
```

而且 TCP 連線成功。

下一步就是確認：

雙方是否能使用相容的 RPC 介面與資料格式進行通訊。

這涉及 RPC Bind。

可以把它想成：

你打通某個政府機關的電話，告訴對方：

> 我要使用某一項申辦服務，請問你們支援這套申辦程序嗎？

對方可能回答：

「可以，我們支援。」

也可能回答：

「不行，這裡沒有提供這個介面。」

這與登入管理員是兩回事。

**RPC Bind 成功，不等於取得管理權限。**

還需要進一步判斷身分驗證，以及特定操作是否獲得授權。

---

## 第四章｜為什麼有時候看到 111，有時候看到 135？

這是非常容易在 CEH 考試與實務分析中混淆的地方。







[[figure:families]]

### 4.1 兩種不同的 RPC 技術體系

RPC 是一種概念，不是一個只能透過單一協定實作的技術。

例如，你可以透過不同系統、不同網路協定實作遠端程序呼叫。

本課特別介紹兩個體系。

| 比較項目 | Microsoft RPC | ONC RPC |
|---|---|---|
| 常見環境 | Windows | Unix／Linux |
| 查詢機制 | Endpoint Mapper | rpcbind／portmapper |
| 常見查詢埠 | TCP 135 | TCP／UDP 111 |
| 介面識別方式 | Interface UUID、版本 | Program number、版本 |
| 具體操作 | RPC Operation | Procedure number |
| 常見應用 | Windows 系統及服務通訊 | NFS 等相關服務 |

兩者都有遠端呼叫的概念，但並不是同一套查詢格式。[RFC Editor](https://www.rfc-editor.org/info/rfc5531/)

### 4.2 Linux 的 111 埠在做什麼？

假設一台 Linux 伺服器提供多種 ONC RPC 服務。

每項服務可能使用不同的通訊位置。

用戶端便可以向 rpcbind 詢問：

「某個服務目前登記在哪個位置？」

rpcbind 常見使用 TCP／UDP 111。

Linux 或 Unix 環境可以使用 `rpcinfo` 工具查詢相關資訊。

例如，在已授權的測試環境中：

```bash
rpcinfo -p 192.0.2.10
```

這個例子是在示範查詢 ONC RPC 服務登記資料。

但它並不是 Microsoft RPC Endpoint Mapper 的通用替代工具。

### 4.3 所有 NFS 都必須經過 111 嗎？

不是。

這也是本課一個很重要的例外。

NFS（Network File System）是常見的網路檔案系統。

早期 NFS 相關流程經常涉及 rpcbind。

但在 NFSv4.1 中，服務通常直接使用 TCP 2049，不需要每次都先向 rpcbind 查詢。

這不表示 NFSv4.1 沒有使用 RPC。

而是：

**同樣使用 RPC，服務尋址的方式可以不同。** [RFC Editor](https://www.rfc-editor.org/rfc/rfc8881.html)

第四章可以記住：

**135 與 111 都有協助尋找服務的角色，但它們屬於不同的 RPC 技術體系。**

---

## 第五章｜最重要的資安觀念：失敗究竟發生在哪一步？

這一章才是將前面技術知識轉換成資安分析能力的關鍵。







[[figure:evidence]]

### 5.1 一次 RPC 操作可能涉及五個不同階段

想像我們準備呼叫某台遠端電腦上的 RPC 功能。

概念上可以分成五個階段：

| 階段 | 要確認的問題 | 可能出現的結果 |
|---|---|---|
| ① 端點資訊 | 知道服務在哪裡嗎？ | 查到 TCP 50020 |
| ② 網路連線 | 從目前位置連得上嗎？ | 成功、拒絕或逾時 |
| ③ 介面協商 | 雙方支援相容的 RPC 介面嗎？ | Bind 成功或失敗 |
| ④ 身分驗證 | 能確認呼叫者身分嗎？ | 驗證成功或失敗 |
| ⑤ 操作授權 | 呼叫者可以執行指定功能嗎？ | 允許或拒絕 |

這是一個用來診斷問題的概念模型，不代表每種 RPC 傳輸都必須依照完全相同的順序進行。

尤其身分驗證可能在連線或 RPC 通訊建立的不同階段進行。

### 5.2 第一種情況：查得到服務，但是連不上

假設：

```text
Endpoint Mapper：

RPC Interface → TCP 50020
```

你嘗試建立連線：

```text
TCP 50020：TIMEOUT
```

這時候能不能說：

「服務不存在。」

不能。

可能原因包括：

網路路徑故障、防火牆丟棄封包、服務已停止、端點位置改變，或者目標主機沒有回應。

這些原因需要不同證據才能區分。

所以正確的描述是：

> 在本次測試條件下，未能成功建立到 TCP 50020 的連線。

這是已經觀察到的事實。

至於為什麼連不上，仍然需要調查。

### 5.3 第二種情況：TCP 連得上，但是 RPC Bind 失敗

假設：

```text
TCP 50020：CONNECTED

RPC Bind：INTERFACE NOT SUPPORTED
```

這代表什麼？

代表網路連線已經成功。

但要求的 RPC 介面沒有順利完成協商。

可能原因是介面不存在、版本不相容，或其他 RPC 協商條件不符。

這時不應直接下結論：

「一定是防火牆擋住了。」

因為你已經觀察到 TCP 連線成功。

應進一步檢查 RPC 層面的錯誤與設定。

### 5.4 第三種情況：RPC 成功，但是操作被拒絕

假設某個 RPC 查詢功能正常執行。

但是接著呼叫修改設定功能時：

```text
ACCESS DENIED
```

這可能代表：

目前使用的身分，不具備執行該操作所需的權限。

要分清楚兩個概念。

**Authentication（身分驗證）**

回答的是：

「你是誰？」

例如，公司門禁確認你的員工證有效。

**Authorization（授權）**

回答的是：

「你可以做什麼？」

例如，即使員工證有效，也不代表你能進入董事長辦公室。

兩者不同。

成功完成某個 RPC 查詢，也不能直接推論所有管理操作都能執行。[Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/rpc/rpc-security-essentials)

### 5.5 這和前面學過的 CEH 有什麼關係？

事實上，這是整個 M04 的共通邏輯。

| 之前的課程 | 可能取得的資訊 | 不能直接推論 |
|---|---|---|
| DNS 列舉 | 查到子網域與 DNS 紀錄 | 一定能登入該系統 |
| FTP 列舉 | 查到 FTP 服務或目錄名稱 | 一定能下載或修改檔案 |
| SMTP 列舉 | 伺服器提供某些郵件回應 | 一定能冒用身分發信 |
| SMB 列舉 | 查到共享資料夾 | 一定能讀取檔案 |
| NetBIOS 列舉 | 查到名稱與服務線索 | 一定有檔案分享權限 |
| RPC 列舉 | 查到端點與介面資訊 | 一定能執行管理功能 |

你可以發現：

這不是六種完全不同的思考方式。

而是同一套資安證據判讀方法，應用到不同協定。

最核心的思維是：

> 每一項證據都有它能支持的結論範圍，不能把尚未驗證的事情當成已知事實。

### 5.6 防禦方應該怎麼處理？

現在換成系統管理員的角度。

假設你發現 Windows 伺服器使用 TCP 135。

是否應該立即將它關閉？

不一定。

因為 Microsoft RPC 是許多 Windows 系統服務的基礎。

隨意停用核心服務，可能造成系統管理、網域服務或應用程式通訊異常。

比較合理的思考方式是：

**第一層：減少不必要的服務暴露。**

不應讓不需要存取 RPC、SMB 或 NetBIOS 的網路來源，任意連接相關服務。

**第二層：管制實際服務端點。**

即使限制 TCP 135，也不能假設所有 RPC 通訊都已被阻擋。

因為可能存在固定端點、動態埠或其他傳輸方式。

**第三層：限制操作權限。**

除了網路層控制，還要確認誰能呼叫哪些功能。

**第四層：保留日誌與驗證結果。**

當操作失敗時，應能辨識失敗發生在連線、介面、身分驗證還是授權階段。

對資安稽核而言，這比單純看到某個埠開啟就判定危險，更能支持具體改善措施。

---

## 第六章｜實際案例：如何判讀 NetBIOS 與 RPC 紀錄？

現在我們把前面所有概念整合起來。

### 6.1 案例背景

假設你正在進行一項已獲核准的內部資安測試。

測試對象是一台 Windows 伺服器：

```text
目標：Lab-A
```

目前取得四項紀錄。

**紀錄一：NetBIOS 名稱**

```text
LAB-FS <20> UNIQUE
```

**紀錄二：RPC Endpoint Mapper**

```text
RPC Interface Version 1.0

Endpoint：TCP 50020
```

**紀錄三：連接 TCP 50020**

```text
Connection Timeout
```

**紀錄四：SMB**

```text
NOT TESTED
```

### 6.2 我們究竟知道哪些事情？

先看第一項：

```text
LAB-FS <20> UNIQUE
```

我們知道：

取得一筆與伺服器服務有關的 NetBIOS 名稱紀錄。

但還不知道共享資料夾有哪些，更不知道目前測試身分的讀取權限。

接著看第二項：

```text
RPC Interface Version 1.0
Endpoint：TCP 50020
```

我們知道：

Endpoint Mapper 提供了一筆介面與端點的對應資訊。

但不知道該端點現在是否仍在監聽、目前的網路路徑能否到達，以及該介面是否能成功呼叫。

再看第三項：

```text
Connection Timeout
```

我們知道：

從這次測試來源出發，連接 TCP 50020 的嘗試在等待時間內沒有成功。

但還不知道造成逾時的確切原因。

最後：

```text
SMB：NOT TESTED
```

表示這次沒有驗證 SMB 共用資訊或檔案存取。

### 6.3 一份好的資安紀錄應該怎麼寫？

可以這樣記錄：

> 本次測試取得 Lab-A 的 NetBIOS 伺服器服務名稱線索，以及一筆 RPC 介面對應至 TCP 50020 的登記資訊。
>
> 從指定測試來源連線至 TCP 50020 時發生逾時，因此尚未驗證該端點的 RPC 介面協商、身分驗證及指定操作的授權結果。
>
> 本次亦未進行 SMB 共享資源與檔案存取測試。後續應依核准範圍，確認端點登記狀態、伺服器監聽情況、網路路徑、防火牆規則及相關日誌。

這段文字與一般主觀判斷有什麼不同？

它把三件事情區分開：

| 證據層次 | 說明 | 本案例 |
|---|---|---|
| 已觀察事實 | 實際得到什麼結果 | NetBIOS 名稱、RPC 登記、TCP 逾時 |
| 合理推測 | 哪些原因可能解釋結果 | 防火牆、服務停止、端點變更等 |
| 尚待確認 | 沒有足夠證據的事情 | RPC 操作權限、SMB 讀寫權限 |

這種寫法適用於滲透測試、弱點驗證、事故調查，以及企業內部資安稽核。

因為它可以讓下一位接手的技術人員知道：

**目前走到哪一步、做過什麼測試、哪些問題還沒有答案。**

---

## 第七部分｜將本課與整個資安測試流程連結

雖然原始教材主要分成六個章節，但我建議你再建立一個更高層次的概念。

### 7.1 從 Reconnaissance 到 Authorization

我們前面學到的技術，可以放進一條完整的資安評估流程：

```text
① Reconnaissance
   偵察：知道可能有哪些目標
        │
        ▼
② Scanning
   掃描：知道哪些網路入口有回應
        │
        ▼
③ Enumeration
   列舉：知道服務宣告了哪些具體資訊
        │
        ▼
④ Connectivity Verification
   連線驗證：確認實際服務是否可達
        │
        ▼
⑤ Authentication
   身分驗證：確認呼叫者身分
        │
        ▼
⑥ Authorization
   授權：確認指定操作是否獲准
        │
        ▼
⑦ Security Assessment
   安全評估：判斷控制措施及其風險
```

這是一種教學用的概念架構。

實際評估不一定完全按照這個順序進行，也不代表測試人員可以任意嘗試所有操作。

每項測試都必須符合原先取得的授權範圍。

### 7.2 為什麼這個觀念特別重要？

因為在實際資安工作中，經常會看到過度推論。

例如：

「掃描發現 TCP 445，所以這台電腦的檔案可以被下載。」

這個推論缺少檔案存取權限的證據。

或者：

「掃描發現 TCP 135，所以攻擊者可以遠端控制這台 Windows 伺服器。」

這個推論也缺少可利用弱點、實際功能與操作授權等證據。

反過來也一樣。

「RPC 操作遭到拒絕，所以整台伺服器沒有安全問題。」

同樣沒有足夠依據。

**資安能力不只是知道如何使用工具，更重要的是知道工具的結果究竟證明了什麼。**

---

## 本課總結｜你至少要記住的八個觀念

| 核心概念 | 你應該真正理解的事情 |
|---|---|
| NetBIOS | 提供名稱與相關通訊機制 |
| `<00>`、`<20>` | 是名稱用途尾碼，不是 TCP 埠 |
| UNIQUE／GROUP | 是名稱類型，不是檔案存取權限 |
| SMB | 用來存取網路共享資源，常見 TCP 445 |
| RPC | 讓程式呼叫遠端提供的功能，不等於遠端桌面 |
| Endpoint Mapper | 幫助尋找 RPC 端點，Microsoft RPC 常見 TCP 135 |
| rpcbind | ONC RPC 的服務尋址機制，常見 TCP／UDP 111 |
| Authentication／Authorization | 身分確認與操作授權是不同問題 |

最重要的判斷原則可以整理成一句話：

**名稱存在 ≠ 服務可達 ≠ 介面可用 ≠ 身分驗證成功 ≠ 操作已獲授權。**

如果你真正理解這個區別，就能把本課的知識應用到 SMB、FTP、SMTP，以及後續的其他網路服務安全分析。

---

## 理解測驗｜用一個情境確認是否真正理解

假設某台 Windows 電腦的測試結果如下：

```text
Host：192.0.2.10

NetBIOS：
LAB-SERVER <20> UNIQUE

TCP 135：
OPEN

RPC Endpoint Mapper：
Interface UUID：已取得
Interface Version：1.0
Endpoint：TCP 50123

TCP 50123：
CONNECTED

RPC Bind：
SUCCESS

RPC QueryStatus：
SUCCESS

RPC ModifySettings：
ACCESS DENIED

SMB：
NOT TESTED
```

請試著回答三個問題。

**問題一：** TCP 135 已開啟，而且 Endpoint Mapper 回傳 TCP 50123。這兩項紀錄各自證明了什麼？是否代表已經取得管理員權限？

**問題二：** `RPC QueryStatus` 成功，但是 `RPC ModifySettings` 出現 `ACCESS DENIED`。這兩個結果是否矛盾？你會怎麼解釋？

**問題三：** 從整份紀錄來看，你能不能判斷 LAB-SERVER 的共享資料夾是否能被讀取？為什麼？

請依照「已確認事實、合理推論、尚未取得的證據」三個層次回答這三題，再展開參考答案核對。