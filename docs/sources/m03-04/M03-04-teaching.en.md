# CEH M03-04 | Open, Closed and Filtered: interpret responses as port states

Port scanning sends probes and interprets responses to describe an endpoint at that time. Start with three ideas: open has evidence of accepting communication; closed has an explicit closed-port response; filtered means this probe cannot establish whether the endpoint is open. The scanning method determines the actual classification.

M03-01 introduced IP, TCP, UDP and ports; M03-02 explored hosts, ICMP and ARP; M03-03 compared Connect, SYN and UDP scans. This lesson connects method → response → state → verification → security judgment. Use the four scenarios at the end to practice stating evidence and a next step.

## 1 | Start with an office extension

Imagine a computer as an office building: an IP address resembles a switchboard number, a port an extension, a service the person answering, and a firewall a gate controlling calls. This analogy separates responsibilities; an actual endpoint requires an IP address, transport protocol and port together.

| Common endpoint | Common purpose | Interpretation limit |
| --- | --- | --- |
| TCP 22 | SSH administration | A number does not identify the actual service |
| TCP 80 | HTTP | Application verification is still needed |
| TCP 443 | HTTPS | TCP success does not establish TLS/website health |
| TCP 3306 | MySQL | A service can use another number |

192.0.2.10:443/TCP and 192.0.2.10:443/UDP are separate endpoints. TCP 443 may provide HTTPS; UDP 443 may provide HTTP/3 over QUIC. Open TCP 443 does not establish open UDP 443, or vice versa.

192.0.2.10 and the other 192.0.2.x addresses are documentation examples, not evidence of real services. Ask the full question: “From where, when, using which protocol and method, against which endpoint, and with what response?” Practical work is restricted to your own local machine or separately approved devices.

## 2 | Separate the three core states

Nmap is a network discovery and security auditing tool that classifies responses according to the probe method. An extension might accept a call, explicitly refuse it, or remain unobservable because calls are restricted. Those situations supply different evidence.

| State | Typical TCP SYN evidence | What it supports and what remains |
| --- | --- | --- |
| open | Target SYN/ACK | The endpoint accepts an opening request; functionality and security need separate checks |
| closed | RST in response to SYN | The tool classifies it as closed; verify listeners and whether an intermediary generated the reply |
| filtered | No response after retries or certain ICMP errors | This method cannot distinguish open from closed; check policy, path and logs |

Open does not establish a vulnerability or a working application. After TCP 443 accepts a request, TLS certificates, HTTP errors, login or permissions can still prevent use. Service/version identification connects to M03-05; vulnerability analysis needs additional evidence.

Closed usually depends on receiving an explicit response. It does not mean the entire computer is powered off or the network is wholly unreachable. TCP 8443 may be closed because a service is stopped, uses another port or binds another interface; a firewall or intermediary may also generate RST. The tool's classification does not independently establish the host's internal state.

Filtered describes missing decisive open/closed evidence or an error matching the method's rules. Dedicated firewalls, router rules and host firewalls are common causes; packet loss, device failures and path problems also affect probes. Filtered alone cannot identify a particular firewall.

The same port can appear different from different positions. “TCP 443 was open from the management network” is easier to reproduce than “443 is open.” [Nmap: six states](https://nmap.org/book/man-port-scanning-basics.html)

## 3 | TCP SYN scanning: interpret the response

An ordinary new TCP connection uses a three-way handshake: client SYN, server SYN/ACK, client ACK. SYN (Synchronize) synchronizes initial sequence numbers; ACK (Acknowledgment) confirms received information; RST (Reset) resets a connection or attempt. These are control flags in the TCP header.

```text
Ordinary TCP: scanner → SYN → target
              scanner ← SYN/ACK ← target
              scanner → ACK → target
Open SYN scan: after SYN/ACK, the scanner side ends the attempt with RST
```

Connect delegates connection establishment to the OS. SYN scanning already has evidence of an accepted opening request after SYN/ACK, without sending the final ACK. Half-open describes an incomplete ordinary handshake, not a port being halfway open; it also does not imply undetectability.

| Probe | Response | Common Nmap classification |
| --- | --- | --- |
| SYN | SYN/ACK | open |
| SYN | RST | closed |
| SYN | No response after retries | filtered |
| SYN | IPv4 ICMP Type 3, Code 1, 2, 3, 9, 10, 13 | filtered |

RST in response to SYN differs in direction and purpose from a scanner-side reset after SYN/ACK. The former is typical closed evidence; the latter ends an open-port probe. Retain source, destination and surrounding packets.

ICMP (Internet Control Message Protocol) conveys network errors and other control information. Only type/code values matching this method's rules map to filtered; not every ICMP message means filtering. The table uses IPv4 values, not ICMPv6 values. [Nmap: SYN interpretation](https://nmap.org/book/synscan.html)

Put “received TCP RST” in the observation field, “Nmap classified closed” in the interpretation field, and “check listeners and firewall logs” in the next-step field. Separating responses from classifications makes the reasoning inspectable.

## 4 | UDP silence leaves two possibilities

UDP sends datagrams without a TCP handshake. Think of sending an application form: the recipient might receive but ignore an invalid format, or the form or reply might be blocked or lost along the way.

Silence therefore does not directly establish closed. The “|” in open|filtered means “or”: an open silent service and filtering remain indistinguishable. It is neither half-open nor proof of both states at once.

| Observation after UDP | Classification | Next check |
| --- | --- | --- |
| Corresponding UDP reply | open | Verify response content and service settings |
| IPv4 ICMP Type 3 / Code 3 (Port Unreachable) | closed | Verify the receiver and error source |
| IPv4 ICMP Type 3 / Code 1, 2, 9, 10, 13 | filtered | Verify path and policy |
| No reply after retries | open\|filtered | Add valid service queries, listener settings and logs |

ICMP Port Unreachable reports an unreachable destination port. Match the reporting source and quoted original probe so unrelated errors do not enter the result. Hosts can also rate-limit ICMP errors, making the scanner wait and retry.

Consider this illustrative output:

```text
PORT    STATE          SERVICE
53/udp  open|filtered  domain
```

53/udp means UDP 53; open|filtered preserves uncertainty. Without service detection, domain is usually a conventional port label and does not establish that DNS is running.

For a device you manage or are authorized to test, a valid DNS query can add evidence:

```bash
dig @192.0.2.53 example.com A
```

192.0.2.53 is a documentation address; replace it with an approved DNS server for actual use. A valid DNS response supports that service answering this query. dig can switch to TCP in some circumstances, so verify the output or capture actually used UDP before counting it as UDP evidence.

Service/version detection can also be used within the approved scope. This is command syntax: replace the angle-bracket target instead of pasting it literally into a shell.

```text
sudo nmap -sU -sV -p 53 --reason <authorized-host>
```

-sU selects UDP, -sV attempts service identification, -p 53 restricts the port, and --reason displays classification reasons. Service probes can elicit replies and reduce uncertainty, but cannot guarantee resolution of every open|filtered result. [Nmap: UDP](https://nmap.org/book/scan-methods-udp-scan.html)

## 5 | Two more labels: identify the question being asked

ACK Scan (-sA) sends probes with the ACK flag to observe filtering of that traffic. SYN Scan asks whether an endpoint accepts a new connection. The interpretation rules differ.

```text
Scanner → target/path: ACK
Scanner ← target/path: RST
ACK Scan classification: unfiltered
```

Unfiltered means this ACK probe obtained a response, without distinguishing open from closed. In unfiltered systems, both open and closed ports can return RST to ACK. No response after retries or certain ICMP errors maps to filtered. Use an approved SYN or Connect scan to check acceptance of new connections. [Nmap: ACK Scan](https://nmap.org/book/scan-methods-ack-scan.html)

Closed|filtered is the candidate classification used by IP ID Idle Scan when it cannot distinguish closure from filtering. This lesson explains the label without expanding into idle-scan operations.

| State | What it says | What it does not establish |
| --- | --- | --- |
| open | Evidence of accepting corresponding communication | Every function works, or a vulnerability exists |
| closed | An explicit closed-port characteristic | The whole host is offline, or every refusal cause is known |
| filtered | This method cannot establish openness | A particular firewall must be responsible |
| unfiltered | An ACK probe obtained a response | The service accepts new TCP connections |
| open\|filtered | Open versus filtered remains unresolved | Either one has been established |
| closed\|filtered | Closed versus filtered remains unresolved | Either one has been established |

The same RST typically means closed for SYN scanning and unfiltered for ACK scanning. Ask what was sent before interpreting what came back. [Nmap: state definitions](https://nmap.org/book/man-port-scanning-basics.html)

## 6 | Work through a synthetic acceptance case

Suppose server 192.0.2.10 has a management interface on TCP 443, allowed only from the management network; TCP 8443 is a spare endpoint that should currently be disabled; UDP 53 should provide DNS. Observation is approved from management and ordinary networks. These are synthetic records, not measured results.

| Source/method | Endpoint | Response/classification | Administrator's next step |
| --- | --- | --- | --- |
| Management/SYN | TCP 443 | SYN/ACK → open | Opening acceptance matches initial expectations; check TLS, login and permissions |
| Ordinary network/SYN | TCP 443 | Silence after retries → filtered | Match restriction rules and contemporaneous logs; exclude unintended path failure |
| Management/SYN | TCP 8443 | RST → closed | Compare with the plan to leave it disabled |
| Management/UDP | UDP 53 | Silence after retries → open\|filtered | Add valid DNS queries, listener settings and logs |

Both TCP 443 results can hold because sources, paths and access conditions differ. SYN/ACK establishes acceptance of the opening request. This case did not complete the handshake, so it does not establish a completed TCP connection.

If TCP 8443 should have a service, investigate whether the program started, selected the correct port, bound the intended address, or whether an intermediary returned RST. On Ubuntu, inspect TCP listeners with:

```bash
ss -lnt
sudo ss -lntp
```

The first command displays listeners; the second adds process information when permitted. 127.0.0.1:8443 listens only on loopback, so other computers generally cannot directly reach that listener via the server's external IP. 0.0.0.0:8443 listens on all local IPv4 addresses, but remote reachability still depends on routing, firewalls and other conditions; it does not automatically include IPv6.

For UDP 53, check whether DNS started, a UDP listener exists, the query reached the service, and either direction was blocked. A program listening and a remote client being able to reach it are separate verification questions.

## 7 | Write a record another engineer can reproduce

| Layer | Example |
| --- | --- |
| Observation | Received TCP SYN/ACK |
| Tool classification | Nmap records open under SYN scan rules |
| Next step | Verify service purpose, TLS, permissions and allowed sources |

On your own Ubuntu machine, check the tool version, then examine only three local TCP ports:

```bash
nmap --version
nmap -sT -p 22,80,443 --reason 127.0.0.1
```

-sT selects TCP Connect, -p 22,80,443 restricts scope, --reason displays reasons, and 127.0.0.1 connects to your own machine. Ports without services may be closed; results depend on local settings. This does not traverse the external network and cannot validate an external firewall. A local firewall can still affect replies.

With raw-packet privileges, compare a SYN scan:

```bash
sudo nmap -sS -p 22,80,443 --reason 127.0.0.1
```

Record the method and result, then use approved Wireshark or tcpdump capture to inspect handshake differences. Stop with Ctrl+C when needed. This exercise starts no service and changes no firewall rules. End any capture and retain or remove the records you created; do not stop existing services.

This is simplified SYN scan output, not a measured result:

```text
PORT      STATE   SERVICE    REASON
443/tcp   open    https      syn-ack
8443/tcp  closed  https-alt  reset
```

Read it as “TCP 443 is classified open because SYN/ACK was received.” Connect reasons may instead be conn-accepted or conn-refused, depending on method and version. Do not treat SYN examples as fixed -sT output. --reason reports the tool's reason; packet capture is needed to verify the precise sequence. [Nmap: output options](https://nmap.org/book/man-output.html)

| Record category | Information to retain |
| --- | --- |
| Scope | Target IP, protocol, port, authorized purpose |
| Conditions | Source network, time and timezone, tool version, options, waits and retries |
| Raw observation | Packets, system errors, silence or original output |
| Interpretation | State and reason tied to the method |
| Follow-up | Expected/actual difference, settings and logs, owner, retest plan |

For example, record 2026-11-03 10:30 UTC+08:00 (illustrative) so administrators can locate matching logs. A record can say: “From management, SYN-probed TCP 443, received SYN/ACK, recorded open; verify service and source policy against the change request.”

## 8 | Align protection with acceptance checks

Open alone cannot determine safe versus unsafe. Public HTTPS and an internal database have different access requirements. Protection aims to align exposed endpoints with business purpose and trust boundaries.

| Layer | Question | Action and verification |
| --- | --- | --- |
| Service | Why does this endpoint exist? | Confirm purpose, owner and updates; disable unnecessary services through approved changes |
| Access | Who needs it? | Restrict necessary sources/purposes, with authentication, encryption and application permissions |
| Acceptance | Did the configuration achieve its purpose? | Test from allowed and restricted positions and compare settings/logs |

In a synthetic AI inference server example, HTTPS 443 serves approved users, SSH 22 is restricted to management, PostgreSQL 5432 to designated application hosts, and Prometheus 9090 to monitoring. This illustrates policy, not a prescription for a real device. Ports and source IPs do not replace authentication or authorization.

Firewalls, security groups and network access control lists (ACLs) can restrict traffic. SSH appearing open from management and filtered elsewhere is an indication of possible policy effect. Compare rules, actual connections and logs to exclude causes such as routing failure. This connects to M12 network protection concepts.

## 9 | Checks: translate a state into a next step

Follow method → TCP/UDP/ICMP or waiting evidence → classification → record → configuration check → policy comparison. The six states are method-dependent outcomes, not stages that every scan traverses in order.

Three common errors are treating filtered as proof of a firewall, open as proof of a vulnerability, or closed and filtered as interchangeable. States guide follow-up; security judgments require purpose and policy.

Question one: A SYN scan of TCP 443 receives RST. A. What is the typical state? B. Does it establish that the server is powered off? C. If HTTPS was expected, what would you check next?

Question two: A DNS server's UDP 53 is open|filtered. A. Is DNS definitely running? B. Is a firewall definitely blocking it? C. How would you add evidence?

Question three: SSH 22 is open from management and filtered from an ordinary network. A. Are these contradictory? B. Does this match initial expectations if policy allows management only? C. What remains for full acceptance?

Question four: ACK Scan reports unfiltered. A. Can you directly call it open? B. What does this method mainly examine? C. Which method would check acceptance of new TCP connections?

Retain the original recording exercise as well: if a report says only “UDP 53 open|filtered,” add at least four fields so another engineer can continue. Reference answers are in the final disclosures; their publication does not establish learner completion.

## 10 | Concept questions: connect the distinctions

### 10.1 | Does open mean I can use the service?

Open supplies evidence about the corresponding communication endpoint. TLS, application errors, login and permissions can still prevent use. Verify TCP 443 probe success separately from working HTTPS.

### 10.2 | Why can people see different results for the same port?

Source networks, paths, NAT/proxies, access policies, time and methods can differ. Confirm the same actual endpoint before comparing management and ordinary-user observations. Both can be correct under the intended design.

### 10.3 | Why does UDP silence not establish closed?

A service may answer only particular formats or may receive without needing to reply; path drops also cause silence. Preserve open|filtered when evidence cannot distinguish these cases, then add valid queries and device records.

### 10.4 | How does unfiltered differ from open?

ACK Scan's unfiltered means this probe obtained a response, without establishing acceptance of new connections. Open reflects acceptance characteristics under an appropriate method. Interpret the same RST differently for SYN and ACK probes according to what was originally sent.

### 10.5 | Where should investigation of filtered begin?

Compare intended source policy, then inspect source position, routes, firewall rules, contemporaneous logs and listeners. If needed, retest from another approved position. The goal is to explain the observation and verify design, not to turn every result into open.

Keep position, method, response, state and next step in the same record. M03-05 next examines service versions and banners to gather more evidence about software behind an open endpoint.
