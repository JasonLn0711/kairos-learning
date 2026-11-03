# CEH M03-03｜TCP Connect、SYN 與 UDP 掃描

## 1｜這次要確認的是哪個通訊入口？

連接埠掃描（Port Scanning）像是在確認一棟大樓有哪些窗口受理服務。TCP Connect 完成報到；SYN 先問是否接受報到；UDP 送出申請資料，再觀察回覆。不同問法取得不同證據。

M03-01 說明 IP、TCP、UDP 與 Port；M03-02 探索主機的活動跡象；這一課接著確認指定的 TCP／UDP 入口如何回應。讀完後，請能說明「送出什麼、收到什麼、能下什麼結論」，並完成最後三個情境題。

文中的 192.0.2.20 是文件範例位址；帶有此位址的指令用來解讀選項。實作限定自己的 127.0.0.1，先確認測試連接埠未被其他服務占用；需要停止時按 Ctrl+C，完成後關閉測試程式。

## 2｜先分清楚：連線、服務與掃描結果

Port（連接埠）是通訊入口的編號。可以把 IP 想成大樓地址，Port 想成窗口號碼：TCP 22 常用於 SSH、TCP 80 常用於 HTTP、TCP 443 常用於 HTTPS、UDP 53 常用於 DNS。這些是慣例；服務可以改用其他編號。TCP 53 與 UDP 53 是分開觀察的入口。

Connection（連線）表示雙方建立了通訊關係。對 HTTPS 而言，TCP 連線成功後，還要經過 TLS 加密協商、HTTP 請求、應用程式處理，才知道網站功能是否正常。

```text
TCP 443 可連線 → TLS 協商 → HTTP 請求 → 應用程式／資料庫
```

例如 TCP 可以連上，TLS 卻協商失敗；TLS 成功，HTTP 卻回傳 500；首頁正常，登入功能卻故障。每一步只證明該階段的結果。

Listener（監聽端點）表示程式準備在特定 IP、協定與 Port 接收通訊；Service（服務）是實際處理請求的軟體，例如 Nginx、OpenSSH、PostgreSQL。接收連線的也可能是反向代理或負載平衡器，後端另有程式處理。因此 TCP 443 開放還不能確定使用 Nginx，或確認後端健康。

```bash
nmap -sT -p 443 127.0.0.1
```

-sT 指 TCP Connect，-p 443 指定連接埠，127.0.0.1 指自己的電腦。假設輸出如下：

```text
PORT     STATE  SERVICE
443/tcp  open   https
```

443/tcp 是觀察入口；open 是工具判讀；未做服務辨識時，https 通常只是連接埠名稱資料庫的標籤。-sV 會嘗試辨識實際服務與版本，但仍需核對應用層回應。

| 層次 | 要回答的問題 | 證據 |
| --- | --- | --- |
| 原始觀察 | 送了什麼、收到什麼？ | SYN、SYN/ACK、RST、ICMP、等待時間 |
| 工具判讀 | 依這種方法如何分類？ | open、closed、filtered 等 |
| 服務查核 | 實際服務是什麼、是否正常？ | TLS、HTTP、服務指紋、應用程式回應 |

## 3｜TCP Connect：請作業系統完成連線

TCP 的一般新連線使用三向交握（Three-way Handshake）。SYN（Synchronize）提出連線並同步初始序號；ACK（Acknowledgment）確認收到對方的資訊；RST（Reset）重設連線或連線嘗試。

1. 掃描端送 SYN：「我想建立連線，這是我的同步資訊。」
2. 目標回 SYN＋ACK：「收到你的請求，也提供我的同步資訊。」
3. 掃描端回 ACK：「收到。」一般 TCP 交握完成，連線進入可交換資料的狀態。

TCP Connect Scan 呼叫作業系統的 connect()，由 TCP/IP 網路堆疊處理交握，Nmap 再讀取成功或錯誤結果。掃描通常隨即結束測試連線；連線建立不代表已傳送 HTTP 請求。

```bash
nmap -sT -p 443 192.0.2.20
```

| connect() 結果 | 常見判讀 | 如何理解 |
| --- | --- | --- |
| 連線成功 | open | 從此位置能建立 TCP 連線 |
| Connection refused | closed | 明確拒絕，典型封包是目標回 RST |
| 等待、重試或其他錯誤 | 依錯誤判讀，可能 filtered | 無法完成連線；不能把所有錯誤都當成 filtered |

這種方式通常不需要直接收送原始封包的特殊權限。因為完整建立連線，服務端可能留下連線或立即斷線的紀錄，大量連線也會增加負擔。[Nmap TCP Connect](https://nmap.org/book/scan-methods-connect-scan.html)

## 4｜SYN 掃描：從交握起始判讀

SYN Scan 先送 SYN。目標回 SYN＋ACK 時，已表明願意接受建立連線；掃描端以 RST 結束這次嘗試，不送完成一般交握的最後 ACK。因此也稱 Half-open Scan（半開式掃描），描述交握未完成，並非 Port 只開一半。

```text
掃描端 → 目標：SYN
目標 → 掃描端：SYN＋ACK
掃描端 → 目標：RST
判讀 open；未完成一般三向交握
```

| 對 SYN 的回應 | 典型狀態 | 判讀重點 |
| --- | --- | --- |
| 目標回 SYN＋ACK | open | 目標接受起始請求 |
| 目標回 RST | closed | 目標拒絕這次連線 |
| 重試後無回覆，或特定 ICMP 無法到達 | filtered | 此方法無法確認開放或關閉 |

讀 RST 時要看方向。目標回 RST 是拒絕；掃描端收到 SYN＋ACK 後送 RST 是結束已取得證據的探測。後者也可能由掃描端作業系統產生；實際 RST／ACK 組合依實作而異。

無回覆可能來自去程或回程被擋、封包遺失、設備異常。filtered 本身沒有證明一定存在防火牆。IPv4 SYN 掃描收到 ICMP Type 3、Code 1／2／3／9／10／13 也會判為 filtered。[Nmap SYN](https://nmap.org/book/synscan.html)

```bash
sudo nmap -sS -p 443 192.0.2.20
```

-sS 通常需要原始封包操作權限；實際取決於作業系統、Capabilities 與封包驅動。Nmap 仍透過作業系統介面收送探測，與 -sT 請 connect() 完成交握的分工不同。

Stealth Scan（隱蔽掃描）是歷史名稱。某些只記錄完整連線的應用程式可能留下較少紀錄，但防火牆、IDS（入侵偵測系統）、IPS（入侵防禦系統）仍能觀察連續多 Port 的 SYN 與重設模式。SYN 掃描可被偵測。

## 5｜UDP 掃描：以資料報與錯誤回報判讀

UDP 直接傳送 Datagram（資料報），沒有 TCP 三向交握。像寄出一封信：沒收到回信，可能是對方不需回覆、看不懂內容、去程遺失、遭到過濾，或回信途中遺失。

Payload（酬載）是資料報攜帶的內容。DNS 可能回覆格式正確的查詢，卻忽略空白或無效內容；DNS、NTP、SNMP 各有自己的格式。Nmap 對部分常見 UDP Port 使用協定專屬酬載，其他探測未必是服務能理解的請求。

| 收到的回應 | Nmap 狀態 | 白話判讀 |
| --- | --- | --- |
| 對應的 UDP 回覆 | open | 有端點回應這次資料報 |
| IPv4 ICMP Type 3 / Code 3 | closed | 回報 Port Unreachable（連接埠無法到達） |
| IPv4 ICMP Type 3 / Code 1、2、9、10、13 | filtered | 政策或路徑阻止確認 |
| 重試後仍無回覆 | open\|filtered | 無法區分開放但沉默與受到過濾 |

ICMP 是傳達 IP 錯誤與狀態的控制訊息。UDP 沒有 TCP RST；主機收到送往無接收端點的 UDP 資料報時，典型情況可能回 ICMP Port Unreachable。分析時核對錯誤來源與內含的原始資料報；IPv4 Type／Code 不直接套用到 ICMPv6。

open|filtered 的「|」表示「或」，保留兩種可能，不能當作確定開放，也不能直接斷言服務未啟動。適當的 -sV 服務探測可能取得回覆、將狀態縮小為 open；沒有回覆時仍需設定或日誌等證據。UDP 回覆也只證明該次通訊，未確認所有功能。[Nmap UDP](https://nmap.org/book/scan-methods-udp-scan.html)

## 6｜為什麼等待時間、速率與位置很重要？

Timeout（逾時）是在指定時間內沒有收到預期回應；Retry（重試）是再送一次探測。假設只等 100 ms，回覆 300 ms 才抵達，就可能過早判定逾時。多次重試會增加時間、封包量與設備負擔，應按環境設定。

掃描 1,000 個 Port，每秒 10 個與每秒 1,000 個的速度不同；過快可能引發限速或丟包，增加等待結果。這些數字只是比較範例。UDP 還受 ICMP Rate Limiting（錯誤回報速率限制）影響：即使多個 Port 都沒有監聽，主機也未必立刻為每次探測送出錯誤，因此 UDP 掃描可能較慢。

```bash
sudo nmap -sU -p 53,123,161 --max-rate 10 192.0.2.20
```

--max-rate 10 限制 Nmap 探測封包的傳送速率上限為每秒 10 個；這不是所有環境的最佳值。實際測試先選少量已核定 Port，依設備承載能力、維護窗口與停止條件調整。

同一台伺服器的 TCP 22，從實驗室內網可能 open，從外網可能 filtered。兩者可以同時成立：來源、路由與防火牆政策不同。但要先確認 NAT、代理或負載平衡器沒有把兩次測試導向不同入口。

NAT（Network Address Translation，網路位址轉換）可能把公開入口轉送到私有 IP，例如 192.168.1.100。外部通常連公開位址；缺少對應 Port Forwarding（連接埠轉送）時，探測可能無法抵達內部主機。內外結果不同未必是服務變了，也不能把所有 NAT 結果都預設為 filtered。

比較報告時一起記錄：來源 IP、目的入口、時間、TCP／UDP、Port、方法、酬載、等待／重試、速率、工具版本與路徑政策。

## 7｜把三種掃描方法整合起來

| 比較項目 | TCP Connect | SYN Scan | UDP Scan |
| --- | --- | --- | --- |
| Nmap 選項 | -sT | -sS | -sU |
| 通訊協定 | TCP | TCP | UDP |
| 完成一般 TCP 交握 | 是 | 否 | 不適用 |
| open 證據 | 作業系統連線成功 | 收到 SYN＋ACK | 收到對應 UDP 回覆 |
| closed 證據 | 明確拒絕連線 | 目標回 RST | IPv4 ICMP Type 3 / Code 3 |
| 重試後無回覆 | 依錯誤判讀，可能 filtered | filtered | open\|filtered |
| 原始封包特殊權限 | 通常不需要 | 通常需要 | 通常需要 |
| 能否確認網站正常 | 不能 | 不能 | 不能 |

相同的「無回覆」，SYN 與 UDP 判讀不同，因為 UDP 服務可能正常接收卻保持沉默。記錄結論時寫出方法與觀察，例如：「此來源在此時間對 TCP 443 送 SYN，收到 SYN＋ACK，依 SYN 掃描記為 open；網站功能另行查核。」

## 8｜在自己的 Ubuntu 上觀察 TCP 與 UDP

環境：Ubuntu、Python 3、Nmap；封包觀察另需 tcpdump 及相應權限。僅使用 127.0.0.1，不需掃描其他設備。先檢查 TCP 8000、8001 與 UDP 9999 是否已被使用；若占用，停止實驗並另選一致的測試埠，不關閉原服務。以下預期結果均為示例，實際狀態受本機政策影響。

```bash
ss -ltnu
# 尚未安裝工具時，由你決定是否在實驗機安裝：
sudo apt update
sudo apt install nmap tcpdump
```

### 8.1｜TCP：同樣 open，不同交握

Terminal A 在空的實驗資料夾啟動 HTTP Server，避免提供自己的私人檔案：

```bash
mkdir -p /tmp/ceh-m0303-http
python3 -m http.server 8000 --bind 127.0.0.1 --directory /tmp/ceh-m0303-http
```

Terminal B 執行兩種掃描，假設 TCP 8001 沒有程式監聽：

```bash
nmap -sT -p 8000,8001 127.0.0.1
sudo nmap -sS -p 8000,8001 127.0.0.1
```

預期兩次都可能得到 8000/tcp open、8001/tcp closed。SERVICE 名稱依 Nmap 資料庫而定；重點是狀態與封包流程。Terminal C 可先開啟擷取，再重跑掃描：

```bash
sudo tcpdump -i lo -nn 'tcp port 8000 or tcp port 8001'
```

觀察誰送 SYN、誰回 SYN＋ACK，以及 Connect 的最後 ACK 與 SYN Scan 的重設。實際 RST／ACK 組合及結束細節依作業系統與 Nmap 實作而異。完成後在 HTTP Server 與 tcpdump 視窗按 Ctrl+C；空資料夾可用 rmdir /tmp/ceh-m0303-http 移除。

### 8.2｜UDP：監聽中，也可以不回覆

將以下程式存成 udp_server.py，Terminal A 執行 python3 udp_server.py：

```python
import socket

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
    sock.bind(("127.0.0.1", 9999))
    print("UDP 9999 listening; no replies")
    while True:
        data, addr = sock.recvfrom(4096)
        print(f"Received {len(data)} bytes from {addr}")
        # Add the reply here in the second run.
```

Terminal B 掃描這個入口：

```bash
sudo nmap -sU -p 9999 127.0.0.1
```

若程式收到資料卻不回覆，預期可能顯示 9999/udp open|filtered。Nmap 只有等待結果；你另有程式監聽及收到資料的本機證據，所以知道此時存在接收端點。

按 Ctrl+C 停止伺服器，在 while 迴圈內的 print 後加入以下一行，保持相同縮排，再重新啟動：

```python
        sock.sendto(b"OK", addr)
```

重跑同一掃描。若 Nmap 收到對應 UDP 回覆，預期變成 open。監聽入口相同，但回覆行為改變了掃描證據。完成後按 Ctrl+C 關閉伺服器；確認程序已停止，再移除自己建立的 udp_server.py。若結果不同，保留程式輸出並核對本機防火牆與權限，不把示例當作保證。

## 9｜資安實務與三個情境題

在已授權的實驗室，可盤點 NAS 的 TCP 5001／22／445、網站的 TCP 443／80、DNS 的 UDP 53 與 TCP 53。先問各入口用途與預期暴露範圍，再比對內外測試、監聽設定、防火牆政策與日誌；開放可能是業務需要，不等於有漏洞。

M03 掃描找出入口，M04 列舉補充服務資訊，M05 弱點分析評估設定與已知問題，M12 的防護觀念協助驗證偵測與阻擋。驗收時對照核准測試時間的 IDS 告警與實際封包，並保留複測結果。

問題一：SYN Scan 觀察到掃描端送 SYN、目標回 SYN＋ACK、掃描端送 RST。Port 是什麼狀態？最後 RST 是誰送的？三向交握完成了嗎？

問題二：UDP 53 顯示 open|filtered。可以斷言 DNS 未啟動嗎？提出三個可能原因，並說明要補什麼證據。

問題三：NAS 的 TCP 22 從內網看是 open，外網看是 filtered。兩者矛盾嗎？哪些設備或政策會造成差異？要確認 SSH 未對外暴露，還要核對什麼？

## 10｜把結論連回證據

TCP Connect 依作業系統連線結果判讀；SYN 依起始回應判讀；UDP 綜合資料報回覆、ICMP 與等待結果。沒有回覆需要保留不確定性，尤其 open|filtered。

每筆結果都保留「哪裡、何時、用什麼方法、收到什麼」。下一課 M03-04 再整理 Open、Closed、Filtered 與觀察位置的關係。

[Nmap 掃描方法](https://nmap.org/book/man-port-scanning-techniques.html) · [TCP 規範 RFC 9293](https://www.rfc-editor.org/rfc/rfc9293) · [UDP 規範 RFC 768](https://www.rfc-editor.org/rfc/rfc768) · [ICMP 規範 RFC 792](https://www.rfc-editor.org/rfc/rfc792)
