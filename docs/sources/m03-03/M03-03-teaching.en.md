# CEH M03-03 | TCP Connect, SYN and UDP scanning

## 1 | Which communication endpoint are we checking?

Port scanning resembles checking which service desks in a building accept requests. TCP Connect completes registration; SYN asks whether registration is accepted; UDP sends an application and observes the reply. Each method produces different evidence.

M03-01 introduced IP, TCP, UDP and ports; M03-02 looked for signs of host activity. This lesson asks how a specific TCP or UDP endpoint responds. Aim to explain what was sent, what came back and what conclusion the evidence supports, then answer the three scenarios at the end.

192.0.2.20 is a documentation address; commands containing it illustrate options. Run the practical exercises only against your own 127.0.0.1. Check that the test ports are unused first. Stop with Ctrl+C when necessary and close all test programs afterward.

## 2 | Separate connections, services and scan results

A port is an endpoint number. Think of the IP address as a building address and the port as a desk number: TCP 22 commonly carries SSH, TCP 80 HTTP, TCP 443 HTTPS and UDP 53 DNS. These are conventions; services can use other numbers. TCP 53 and UDP 53 are separate endpoints.

A connection establishes a communication relationship. For HTTPS, successful TCP establishment precedes TLS encryption negotiation, an HTTP request and application processing. Each stage needs its own evidence.

```text
TCP 443 reachable → TLS negotiation → HTTP request → application/database
```

TCP might connect while TLS fails; TLS might succeed while HTTP returns 500; the home page might work while login fails. Success at one stage establishes only that stage's result.

A listener is a program ready to receive traffic at a specific IP, protocol and port. A service is software that handles requests, such as Nginx, OpenSSH or PostgreSQL. A reverse proxy or load balancer may accept the connection and forward work to a backend. An open TCP 443 therefore does not identify Nginx or establish backend health.

```bash
nmap -sT -p 443 127.0.0.1
```

-sT selects TCP Connect, -p 443 selects the port, and 127.0.0.1 is your own computer. Suppose the output is:

```text
PORT     STATE  SERVICE
443/tcp  open   https
```

443/tcp identifies the endpoint; open is the tool's interpretation. Without service detection, https is usually a label from the port-name database. -sV attempts to identify the actual service and version, but application responses still require verification.

| Layer | Question | Evidence |
| --- | --- | --- |
| Raw observation | What was sent and received? | SYN, SYN/ACK, RST, ICMP, waiting time |
| Tool interpretation | How does this method classify it? | open, closed, filtered and other states |
| Service verification | What runs here, and does it work? | TLS, HTTP, fingerprints, application responses |

## 3 | TCP Connect: ask the operating system to connect

An ordinary new TCP connection uses a three-way handshake. SYN (Synchronize) requests a connection and synchronizes initial sequence numbers. ACK (Acknowledgment) confirms received information. RST (Reset) resets a connection or connection attempt.

1. The scanner sends SYN: “I want to connect; here is my synchronization information.”
2. The target returns SYN+ACK: “I received your request; here is my synchronization information.”
3. The scanner returns ACK: “Received.” The ordinary handshake completes, allowing data exchange.

TCP Connect Scan calls the operating system's connect(). The TCP/IP stack handles the handshake and Nmap reads success or an error. The scan normally ends the test connection shortly afterward; connection establishment does not mean an HTTP request was sent.

```bash
nmap -sT -p 443 192.0.2.20
```

| connect() result | Common interpretation | Meaning |
| --- | --- | --- |
| Connection succeeds | open | TCP establishment is possible from here |
| Connection refused | closed | Explicit refusal, typically a target RST |
| Waiting, retries or another error | Depends on the error; possibly filtered | Establishment failed; not every error means filtered |

This method normally needs no special raw-packet privileges. A completed connection can leave connection or immediate-disconnection records on the service, and many connections can add load. [Nmap TCP Connect](https://nmap.org/book/scan-methods-connect-scan.html)

## 4 | SYN scanning: interpret the opening exchange

SYN Scan sends SYN first. A target SYN+ACK already indicates willingness to accept establishment. The scanner side resets the attempt with RST instead of sending the final ACK of an ordinary handshake. Half-open Scan describes this incomplete handshake, not a port being halfway open.

```text
Scanner → target: SYN
Target → scanner: SYN+ACK
Scanner → target: RST
Interpretation: open; no ordinary three-way handshake completed
```

| Response to SYN | Typical state | Interpretation |
| --- | --- | --- |
| Target SYN+ACK | open | The target accepts the opening request |
| Target RST | closed | The target refuses the attempt |
| No response after retries, or certain ICMP unreachable errors | filtered | This method cannot establish open versus closed |

Read the direction of RST. A target RST refuses the connection; a scanner-side RST following SYN+ACK ends a probe that already obtained evidence. The scanner's operating system may generate that reset. Actual RST/ACK combinations depend on implementation.

Silence can reflect blocked outbound or return traffic, packet loss or equipment problems. filtered alone does not prove a firewall exists. IPv4 SYN scanning also classifies ICMP Type 3, Code 1/2/3/9/10/13 as filtered. [Nmap SYN](https://nmap.org/book/synscan.html)

```bash
sudo nmap -sS -p 443 192.0.2.20
```

-sS normally needs raw-packet privileges; requirements depend on the operating system, capabilities and packet driver. Nmap still uses operating-system interfaces to send and receive probes, rather than delegating the complete handshake to connect() as -sT does.

Stealth Scan is a historical name. Applications that log only completed connections may record less, but firewalls, intrusion detection systems (IDS) and intrusion prevention systems (IPS) can still observe SYN and reset patterns across ports. SYN scans are detectable.

## 5 | UDP scanning: use datagrams and error reports

UDP sends datagrams directly, without a TCP handshake. Like sending a letter, receiving no reply leaves several possibilities: no reply was needed, the recipient could not understand the content, the request was lost or filtered, or the reply was lost.

Payload means the content carried in a datagram. DNS may answer a valid query while ignoring empty or invalid content; DNS, NTP and SNMP each define their own formats. Nmap uses protocol-specific payloads for some common UDP ports; other probes may not be meaningful requests for the service.

| Response | Nmap state | Interpretation |
| --- | --- | --- |
| A corresponding UDP reply | open | An endpoint answered this datagram |
| IPv4 ICMP Type 3 / Code 3 | closed | Port Unreachable was reported |
| IPv4 ICMP Type 3 / Code 1, 2, 9, 10, 13 | filtered | Policy or the path prevents confirmation |
| No response after retries | open\|filtered | Cannot distinguish an open silent endpoint from filtering |

ICMP communicates IP errors and status. UDP has no TCP RST; a host receiving a datagram for an endpoint without a receiver may typically return ICMP Port Unreachable. Check the error's source and the original datagram quoted inside it. Do not transfer IPv4 type/code numbers directly to ICMPv6.

The “|” in open|filtered means “or”: two possibilities remain. It establishes neither definite openness nor a stopped service. Suitable -sV service probes may elicit a response and narrow the state to open. Otherwise, configuration or logs can add evidence. A UDP reply establishes only that exchange, not every application function. [Nmap UDP](https://nmap.org/book/scan-methods-udp-scan.html)

## 6 | Why waiting time, rate and position matter

A timeout means no expected reply arrived within the configured interval; a retry sends another probe. If a scanner waits 100 ms but the response arrives after 300 ms, it may time out too early. More retries cost time, packets and equipment load, so choose them for the environment.

Testing 1,000 ports at 10 versus 1,000 ports per second changes the rate. Excessive rates may trigger limiting or packet loss, producing more timeouts; these numbers are examples. UDP also encounters ICMP rate limiting: even when several ports lack listeners, a host may not immediately report an error for every probe. This can make UDP scans slow.

```bash
sudo nmap -sU -p 53,123,161 --max-rate 10 192.0.2.20
```

--max-rate 10 caps Nmap's probe transmission rate at 10 packets per second. It is not universally optimal. Start with a few approved ports and adjust for device capacity, maintenance windows and stop conditions.

The same server's TCP 22 may appear open from the laboratory and filtered externally. Both observations can hold because sources, routes and firewall policies differ. First verify that NAT, proxies or load balancers did not direct the tests to different endpoints.

Network Address Translation (NAT) may forward a public endpoint to a private address such as 192.168.1.100. External clients usually contact the public address; without matching port forwarding, probes may not reach the internal host. Different internal and external results need not mean the service changed, and not all NAT outcomes are necessarily filtered.

When comparing reports, retain the source IP, destination endpoint, time, TCP/UDP, port, method, payload, timeout/retries, rate, tool version and path policies.

## 7 | Compare the three methods

| Comparison | TCP Connect | SYN Scan | UDP Scan |
| --- | --- | --- | --- |
| Nmap option | -sT | -sS | -sU |
| Protocol | TCP | TCP | UDP |
| Completes an ordinary TCP handshake | Yes | No | Not applicable |
| Evidence for open | OS connection success | SYN+ACK received | Corresponding UDP reply |
| Evidence for closed | Explicit connection refusal | Target RST | IPv4 ICMP Type 3 / Code 3 |
| No response after retries | Error-dependent; possibly filtered | filtered | open\|filtered |
| Special raw-packet privileges | Usually unnecessary | Usually needed | Usually needed |
| Establishes website health | No | No | No |

The same silence produces different SYN and UDP classifications because a working UDP service can receive data without replying. Include method and observation in a conclusion: “At this time, from this source, TCP 443 returned SYN+ACK to SYN, so the SYN scan records open; website functionality needs a separate check.”

## 8 | Observe TCP and UDP on your own Ubuntu machine

Environment: Ubuntu, Python 3 and Nmap; packet capture additionally needs tcpdump and suitable privileges. Use only 127.0.0.1. Check TCP 8000, TCP 8001 and UDP 9999 for existing use. If occupied, stop and choose consistent alternate test ports instead of closing another service. Expected results below are examples; local policy affects actual behavior.

```bash
ss -ltnu
# If tools are missing, decide whether to install them on the lab machine:
sudo apt update
sudo apt install nmap tcpdump
```

### 8.1 | TCP: the same open state, different handshakes

In Terminal A, serve an empty lab directory to avoid sharing private files:

```bash
mkdir -p /tmp/ceh-m0303-http
python3 -m http.server 8000 --bind 127.0.0.1 --directory /tmp/ceh-m0303-http
```

In Terminal B, run both scans, assuming TCP 8001 has no listener:

```bash
nmap -sT -p 8000,8001 127.0.0.1
sudo nmap -sS -p 8000,8001 127.0.0.1
```

Both may report 8000/tcp open and 8001/tcp closed. SERVICE names depend on Nmap's database; focus on states and packet flow. Start capture in Terminal C, then repeat the scans:

```bash
sudo tcpdump -i lo -nn 'tcp port 8000 or tcp port 8001'
```

Observe who sends SYN, who returns SYN+ACK, the final Connect ACK and the SYN scan reset. RST/ACK combinations and teardown details depend on the OS and Nmap implementation. Stop the HTTP server and tcpdump with Ctrl+C. Remove the empty directory with rmdir /tmp/ceh-m0303-http.

### 8.2 | UDP: listening without replying

Save this as udp_server.py and run python3 udp_server.py in Terminal A:

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

Scan this endpoint in Terminal B:

```bash
sudo nmap -sU -p 9999 127.0.0.1
```

If the program receives data without replying, the result may be 9999/udp open|filtered. Nmap has only a waiting result. You separately have local evidence that a program is listening and receiving datagrams.

Stop the server with Ctrl+C. Add the following line after print inside the while loop, preserving the indentation, then restart:

```python
        sock.sendto(b"OK", addr)
```

Repeat the same scan. If Nmap receives the corresponding UDP reply, expect open. The listener is the same, but its reply behavior changes the scan evidence. Stop the server with Ctrl+C, confirm the process has ended, then remove the udp_server.py you created. If results differ, keep program output and check local firewall rules and privileges rather than treating an example as a guarantee.

## 9 | Security practice and three scenarios

An authorized laboratory inventory might include NAS TCP 5001/22/445, web TCP 443/80, and DNS UDP 53 plus TCP 53. Establish each endpoint's purpose and intended exposure, then compare internal/external observations, listener settings, firewall policies and logs. An open port can meet a business need and does not establish a vulnerability.

M03 scanning locates endpoints; M04 enumeration adds service information; M05 vulnerability analysis evaluates configurations and known issues; M12 protection concepts help verify detection and blocking. Compare IDS alerts with actual packets during the approved test window and retain retest results.

Question one: A SYN scan shows scanner SYN, target SYN+ACK, then scanner RST. What is the port state? Who sent the final RST? Did the three-way handshake complete?

Question two: UDP 53 is open|filtered. Can you conclude DNS is stopped? Give three possible causes and identify the evidence needed next.

Question three: NAS TCP 22 is open internally and filtered externally. Are those observations contradictory? Which equipment or policies can explain them? What else should you check to establish that SSH is not externally exposed?

## 10 | Tie conclusions to evidence

TCP Connect uses OS connection results; SYN uses opening responses; UDP combines datagram replies, ICMP and waiting results. Preserve uncertainty when nothing responds, especially for open|filtered.

Keep where, when, which method and which response with every result. M03-04 next examines Open, Closed, Filtered and observation position.

[Nmap scan techniques](https://nmap.org/book/man-port-scanning-techniques.html) · [TCP RFC 9293](https://www.rfc-editor.org/rfc/rfc9293) · [UDP RFC 768](https://www.rfc-editor.org/rfc/rfc768) · [ICMP RFC 792](https://www.rfc-editor.org/rfc/rfc792)
