# CEH M03-04 | Open, Closed, Filtered: understanding port scan results from the beginning

Port scanning sends network probes and examines responses to determine the state presented by a service endpoint. It involves more than checking whether a port number is enabled.

Start with three ideas:

- Open: there is evidence that this endpoint accepts the corresponding communication.
- Closed: there is an explicit response indicating that the endpoint is not accepting that connection.
- Filtered: the probe encounters filtering or insufficient evidence to determine whether the endpoint is open.

These are starting points. To understand a result, ask how the scanner obtained it: what packet did it send, what response arrived, and which interpretation rule applied?

This lesson covers sections 1–10, official Nmap references, a synthetic case, and connections to M03-01 through M03-03. Four final scenarios have reference answers. The conceptual Q&A explains the material; it is not a record of learner submissions.

## First build the whole picture: what does a scanner do?

The preceding lessons supply different parts of the same investigation.

| Unit | Material | How it is used here |
|---|---|---|
| M03-01 | IP, TCP, UDP, ports | Identify the destination and program endpoint |
| M03-02 | ICMP, ARP, network discovery | Discover targets and interpret network error reports |
| M03-03 | TCP Connect, SYN and UDP scans | Choose a method for probing a port |
| M03-04 | Open, Closed, Filtered | Interpret port states from packet responses |

Connect these lessons into one sequence:

```text
A server needs checking
        |
        v
1. Identify its IP address
        |
        v
2. Select the port
        |
        v
3. Select TCP or UDP
        |
        v
4. Send probes with Nmap
        |
        v
5. Observe the response
        |
        +-- acceptance response --> Open
        +-- explicit rejection --> Closed
        +-- silence/filtering error --> Filtered
                                        |
                          UDP and other methods may instead
                          report Open|Filtered
```

This diagram simplifies the decision. The method matters: silence after TCP SYN probes normally leads to filtered; silence after UDP probes normally leads to open|filtered. The same observation does not always produce the same state. [Nmap SYN scan](https://nmap.org/book/synscan.html)

# 1 | Start with extensions in an office building

### 1.1 Imagine a computer as an office building

Suppose you want to call a company's IT department. You need the company's main telephone number and the department's extension. Network communication requires a similar distinction between finding a computer and selecting an endpoint on it.

| Office-building analogy | Computer network |
|---|---|
| Company address | IP address |
| Extension number | Port |
| Person answering an extension | Service program receiving communication |
| Making a call | Sending a network packet |
| Someone accepts the call | A response accepting communication |
| Reception or access rules limit calls | Firewall and other access controls |

For example:

```text
Server IP: 192.0.2.10
+-----------------------------+
| Server 192.0.2.10            |
| Port 22   --> SSH            |
| Port 80   --> HTTP           |
| Port 443  --> HTTPS          |
| Port 3306 --> MySQL          |
+-----------------------------+
```

These are common port associations. They do not claim that this hypothetical server actually runs every listed service.

- IP answers: which computer am I contacting?
- Port answers: which endpoint on that computer?
- TCP or UDP answers: which transport protocol am I using?

The notation `192.0.2.10:443` identifies an address and port. A complete endpoint description also gives the transport, such as `192.0.2.10:443/TCP`.

### 1.2 Why are TCP 443 and UDP 443 different?

Imagine an office that can be contacted by telephone or radio. The destination office may be the same, but the communication mechanisms differ. TCP and UDP likewise have separate transport behavior and separate port spaces.

```text
192.0.2.10
   +-- TCP 443 --> may provide HTTPS
   +-- UDP 443 --> may provide HTTP/3 over QUIC
```

The number 443 is shared, but each transport must be checked independently. TCP 443 being open does not establish that UDP 443 is open. The reverse inference is equally unsupported.

### 1.3 The question to carry through this lesson

“Is port 443 open?” leaves out information needed to interpret or reproduce a result. Ask: “From which network location, using which protocol and scan method, did I probe which server's port 443, and what response arrived?”

The location, protocol, method, destination and observed response will matter throughout M03-04.

# 2 | Separate the three core states

Open, Closed and Filtered describe different evidence. Consider each state before comparing them.

## 2.1 Open: the endpoint accepts communication

Imagine asking reception to connect extension 101. Reception replies that the extension can accept the call. In a TCP SYN scan, a SYN/ACK response provides the corresponding evidence, and Nmap classifies the port as open.

```text
Scanner                         Server
   | ---- SYN: request --------> |
   | <--- SYN/ACK: accepted ---- |
   v
OPEN
```

The endpoint has accepted the initial TCP connection request. This does not establish that the service has a vulnerability, or that every application function works.

An HTTPS endpoint may accept TCP connections while users encounter a TLS certificate error, application failure, or authentication problem. Open answers only the transport question tested by the probe.

Next determine the service, its version, whether it functions, who may access it, and whether there is evidence of a vulnerability. Service identification connects to M03-05; vulnerability analysis needs additional evidence in M05.

## 2.2 Closed: an explicit response declining the connection

Suppose reception answers a request for extension 888 by saying it currently has no service. With TCP SYN scanning, a TCP RST normally leads Nmap to classify the endpoint as closed.

RST means Reset: it resets a connection or ends this connection attempt.

```text
Scanner                         Server
   | ---- SYN: request --------> |
   | <--- RST: not accepted ---- |
   v
CLOSED
```

Closed does not mean the network is completely unreachable. An explicit response is usually the evidence that allows this classification.

If TCP 8443 is closed, investigate possible causes:

- The web service has not started.
- The program is not listening on 8443.
- It is listening only on another interface.
- A firewall or another intermediary generated the TCP RST.

The classification guides the investigation; the architecture and device evidence establish the cause.

## 2.3 Filtered: the probe cannot establish whether a service is listening

Imagine reception blocking an outside call under company policy. From outside, you cannot tell whether anyone is present in the department.

```text
Scanner             Firewall           Server
   | ---- SYN ------> |                   |
   |                 DROP                 |
   |                  X                   |
   |                                      |
   |       No response after waiting      |
   v
FILTERED
```

A firewall may silently discard a packet or return a specific ICMP error. From the scanner's position, the available evidence does not establish open or closed, and Nmap classifies the result as filtered.

Separate two layers:

- Observation: the expected response did not arrive, or a particular network error arrived.
- Possible cause: firewall policy, router rules, host filtering, packet loss, or other network conditions.

The diagram illustrates a possible drop point. A filtered result alone does not prove that a particular firewall exists or dropped the probe.

## 2.4 Compare the three states

| State | Plain meaning | Typical TCP SYN response | What can be established? |
|---|---|---|---|
| Open | The endpoint accepts the request | SYN/ACK | The initial connection request received an acceptance response |
| Closed | The attempt is explicitly declined | RST | The tool classifies it as closed; check listening state and whether an intermediary sent the RST |
| Filtered | The probe is limited or inconclusive | Silence or particular ICMP errors | Whether the service is open remains uncertain |

These states are observations under particular methods and locations, not permanent properties of a server. The same port can appear differently from different networks. [Nmap's six states](https://nmap.org/book/man-port-scanning-basics.html)

Remember: open has acceptance evidence; closed has explicit rejection evidence; filtered lacks sufficient evidence to establish whether the endpoint is open.

# 3 | Read three states from TCP SYN responses

Now connect the classifications to the TCP packets that produce them.

## 3.1 Review the TCP three-way handshake

A normal new TCP connection generally uses three steps. A client sends SYN, a server responds with SYN/ACK, and the client sends ACK.

```text
Client                              Web server
   | -------- SYN --------------------> |
   |          Request a connection      |
   | <------- SYN/ACK ----------------- |
   |          Acknowledge the request   |
   | -------- ACK --------------------> |
   |          Confirm receipt           |
   |          TCP connection established|
```

This is the TCP Three-Way Handshake.

| Flag | Name | Plain explanation |
|---|---|---|
| SYN | Synchronize | Begin connection establishment |
| ACK | Acknowledgment | Acknowledge received information |
| RST | Reset | Reset the connection or attempt |

These descriptions are teaching shorthand. SYN, ACK and RST are control flags in the TCP header; they are not literal messages containing those sentences.

## 3.2 Why can SYN scanning stop before the full handshake?

M03-03 introduced TCP Connect and TCP SYN scanning. Connect scanning normally asks the operating system to establish a TCP connection. SYN scanning uses the initial handshake response to classify the port.

When the server returns SYN/ACK, the scanner has evidence that the initial request was accepted. It does not need to send the final ACK to obtain that evidence. For an open endpoint, the scanning side normally ends the unfinished attempt with RST.

This is why SYN scanning is called half-open scanning. “Half-open” describes the incomplete handshake, not a port that is somehow half available. [Nmap SYN scan](https://nmap.org/book/synscan.html)

## 3.3 Three outcomes of a SYN scan

### Case A: SYN/ACK arrives

```text
Scanner -- SYN -----> Server
Scanner <- SYN/ACK -- Server
Nmap: OPEN
```

The response accepts the initial TCP connection request, supporting open.

### Case B: RST arrives

```text
Scanner -- SYN -----> Server
Scanner <- RST ------ Server
Nmap: CLOSED
```

The probe received a reset response, supporting closed. This incoming RST is different from the scanner's outgoing RST used to end an open-port SYN scan.

### Case C: no response arrives

```text
Scanner -- SYN -----> Firewall
                         |
                        DROP
                         X
Scanner waits, retries, and still receives nothing.
Nmap: FILTERED
```

An ICMP unreachable error matching the method's rules can also result in filtered. This connects to M03-02: ICMP reports errors and limitations, but Type and Code determine the meaning. Do not classify every ICMP response as filtering evidence.

## 3.4 How does the scanner turn packets into a result?

Treat Nmap as an observer: it sends a probe, collects evidence, then applies interpretation rules.

```text
Send TCP SYN
     |
     v
What arrived?
     +-- SYN/ACK ------------------> OPEN
     +-- RST ----------------------> CLOSED
     +-- silence/specific ICMP ----> FILTERED
```

The packet response is evidence. Open, Closed and Filtered are classifications derived from that evidence. Record both layers: “Received TCP RST; Nmap classified the port as closed” is more informative than “closed” alone.

This allows another engineer to check whether the method and response support the conclusion. [Official SYN scan reference](https://nmap.org/book/synscan.html)

# 4 | Keep both possibilities when UDP is silent

UDP does not establish a connection through TCP's three-way handshake. Its scan results therefore need different interpretation rules.

## 4.1 Why is UDP harder to interpret?

TCP resembles making a call: the other side may accept or explicitly decline it. UDP resembles delivering a note. The recipient may receive the note without sending anything back.

Suppose a department processes only documents in a prescribed format. A note asking “Is anyone there?” may be ignored even though staff are present. A UDP service can likewise ignore data that does not match its protocol.

No reply does not establish that nothing was received.

```text
Send UDP packet
       |
       v
No response
       |
       +-- Open service received it but did not reply
       |
       +-- Filtering discarded the packet
       |
       v
Both possibilities produce the same observation
OPEN|FILTERED
```

Nmap lacks the evidence needed to choose between those possibilities. The vertical bar means “or”: open or filtered. It is an uncertainty label, not a special kind of half-open port.

## 4.2 Four outcomes of UDP scanning

| Observation | Nmap state | Plain meaning |
|---|---|---|
| A UDP response from the target port | Open | The endpoint replied |
| ICMP Port Unreachable | Closed | The response reports that the port is unreachable |
| Particular other ICMP unreachable errors | Filtered | The reported error matches a filtering classification |
| No reply after repeated probes | Open\|Filtered | The service may be silent, or the probe may be blocked |

These are the basic UDP interpretation rules. [Nmap UDP scanning](https://nmap.org/book/scan-methods-udp-scan.html)

### Case A: a UDP response arrives

```text
Client                          DNS server
   | ------ DNS Query -----------> |
   | <----- DNS Response --------- |
   v
OPEN
```

A correctly formatted query to your own DNS server can produce a DNS answer. If the exchange is over UDP, it supports that UDP 53 can respond to that service request.

### Case B: ICMP Port Unreachable arrives

```text
Scanner                         Server
   | ------ UDP probe ------------> |
   | <----- ICMP Port Unreachable - |
   v
CLOSED
```

ICMP does more than support ping: it also reports network errors. In IPv4, `ICMP Type 3 / Code 3` means Destination Unreachable — Port Unreachable. These IPv4 numbers must not be applied to ICMPv6.

In plain language, the reply says that this destination port is unreachable. For a normal UDP scan, this response supports closed.

### Case C: a particular ICMP filtering error arrives

A network device may respond that administrative policy does not permit the communication. Nmap can classify a matching response as filtered.

The exact Type and Code matter. For IPv4 UDP scans, Type 3 with Code 1, 2, 9, 10 or 13 leads to filtered; Type 3 with Code 3 leads to closed. Not every ICMP message means filtered.

### Case D: nothing arrives

If no UDP response arrives and no ICMP response establishes closed or filtered, the normal result is `open|filtered`.

Neither “the service is definitely running” nor “the firewall definitely blocked it” follows from silence alone. Preserve the uncertainty and choose additional evidence.

## 4.3 A DNS example on UDP 53

Suppose a laboratory DNS server produces this illustrative result:

```text
PORT     STATE          SERVICE
53/udp   open|filtered  domain
```

Read each field separately. `53/udp` identifies UDP port 53. `open|filtered` says the probe did not distinguish the two states. `domain` is the conventional service name associated with the port; this field alone does not prove a DNS server is running.

If you administer the device, send a correctly formatted DNS query:

```bash
dig @192.0.2.53 example.com A
```

The address 192.0.2.53 is reserved for documentation. Replace it with a DNS server you own or are authorized to test.

A valid response over confirmed UDP provides stronger evidence that UDP 53 answers queries. However, dig can switch to TCP in some circumstances, such as a truncated response. Check the actual transport; a successful TCP query is not proof of UDP reachability.

Another option is the following template:

```text
sudo nmap -sU -sV -p 53 --reason <authorized-host>
```

Replace `<authorized-host>` with an owned or authorized target before use. Do not paste the angle brackets literally into a shell. The command combines UDP scanning with service detection to seek more evidence. It does not guarantee that every open|filtered result can be resolved. [Nmap UDP service detection](https://nmap.org/book/scan-methods-udp-scan.html)

Remember the method-dependent difference: silence during SYN scanning normally means filtered; silence during UDP scanning normally means open|filtered. The protocols provide different response expectations.

# 5 | Two more labels: identify the question being answered

We have covered Open, Closed, Filtered and Open|Filtered. Nmap defines two additional labels: Unfiltered and Closed|Filtered. Their meaning follows from what the particular scan method measures.

## 5.1 Unfiltered: the probe is reachable, but service availability is unknown

Imagine asking a guard whether a certain type of delivery passes the entrance rules, rather than calling an office to see whether anyone answers. The guard's answer that this delivery is not blocked does not establish that staff are present in the office.

Unfiltered similarly says that the tested probe did not present a filtering result. It does not by itself establish a listening service.

### What is an ACK scan?

A SYN scan sends SYN to test acceptance of a new connection. An ACK scan sends TCP packets with ACK set to observe how filtering devices or targets handle that class of traffic.

```text
Scanner                      Firewall/target
   | ------ TCP ACK -------------> |
   | <----- TCP RST -------------- |
   v
UNFILTERED
```

In an ordinary ACK scan, RST supports unfiltered. Open and closed endpoints may both return RST to this kind of probe, so it does not distinguish them.

| Method | Main question |
|---|---|
| SYN scan | Does the endpoint accept an initial TCP connection request? |
| ACK scan | Does this class of ACK probe appear to be filtered? |

An ACK result can help investigate filtering rules. To check whether an endpoint accepts a new connection, use an authorized SYN or TCP Connect scan, or another appropriate test. Unfiltered is not synonymous with open. [Nmap state definitions](https://nmap.org/book/man-port-scanning-basics.html)

## 5.2 Closed|Filtered: closed or filtered

This less common label occurs in the IP ID idle-scan method. It means that the method cannot distinguish closed from filtered.

| State | Alternatives still unresolved |
|---|---|
| Open\|Filtered | Open or filtered |
| Closed\|Filtered | Closed or filtered |

Understanding the six-state vocabulary does not require conducting an idle scan. Here the purpose is to recognize the uncertainty label and its method-specific context.

## 5.3 A complete map of the six states

| Nmap state | Plain meaning | Interpretation |
|---|---|---|
| Open | A service accepts the corresponding communication | The endpoint accepts what the probe tests |
| Closed | A reachable endpoint is not accepting the connection | An explicit closed response was observed |
| Filtered | The probe presents filtering conditions | Whether the service is open remains unknown |
| Unfiltered | The probe can receive a response | This alone cannot distinguish open from closed |
| Open\|Filtered | Open or filtered | Those alternatives remain unresolved |
| Closed\|Filtered | Closed or filtered | Those alternatives remain unresolved |

These are Nmap's six defined states. Always interpret the state alongside its scan method. [Nmap port states](https://nmap.org/book/man-port-scanning-basics.html)

# 6 | Work through a complete synthetic case

Combine the preceding ideas in a hypothetical laboratory network. The addresses, results and diagrams below are teaching examples, not measurements of a real server.

## 6.1 Accepting a laboratory server

You administer a server at `192.0.2.10` with this intended deployment:

| Port | Intended use |
|---|---|
| TCP 443 | Management interface |
| TCP 8443 | Spare management service; currently should not be enabled |
| UDP 53 | DNS service |

There are two network areas. The management network is for authorized administrators. The general network contains ordinary test computers.

The security policy says that the TCP 443 management interface must be accessible only from the management network. Your task is to check whether the implementation satisfies that policy.

## 6.2 First result: open from the management network

Probe TCP 443 from the management network:

```text
Management computer             Server
      | ------ SYN --------------> |
      | <----- SYN/ACK ----------- |
      v
     OPEN
```

This matches the initial expectation if administrators are allowed to connect. It does not prove that every security control is correct.

The SYN received SYN/ACK, showing acceptance of the initial connection request. This probe has not demonstrated completion of the three-way handshake. Authentication, application permissions and TLS configuration still need checking.

## 6.3 Second result: filtered from the general network

Now probe the same TCP 443 endpoint from the general test network:

```text
General computer         Firewall          Server
      | ----- SYN -------> |                  |
      |                   DROP                |
      |                    X                  |
      v
   FILTERED
```

This can also match expectations because the general network should not directly reach the management interface. The firewall location shown is a hypothetical cause that requires rule and log confirmation.

The same server and port can present open and filtered from different sources without contradiction. A state is a result from a particular location, method and time; it is not independent of the surrounding network.

## 6.4 Third result: TCP 8443 is closed

From the management network, suppose Nmap reports:

```text
8443/tcp closed
```

Whether this is desirable depends on the deployment plan. If 8443 should be unused, closed may match expectations. If it should provide a service, investigate:

- Has the service started?
- Is it listening on 8443?
- Is it bound only to `127.0.0.1`?
- Is another device actively returning RST?

On the server, use:

```bash
sudo ss -lntp
```

This lists TCP listening sockets and available process information. Without sudo access, start with `ss -lnt`; process details may be unavailable.

For example:

```text
127.0.0.1:8443
```

This listener is bound to the loopback address. Other computers generally cannot connect directly to that listener through the server's external IP address.

By contrast:

```text
0.0.0.0:8443
```

This means the process listens on all local IPv4 interfaces. Remote access can still be limited by firewall or routing rules. A listening socket and remote reachability are separate layers of evidence.

## 6.5 Fourth result: UDP 53 is open|filtered

Suppose the UDP result is:

```text
53/udp open|filtered
```

The responses have not distinguished an open service from filtering. If DNS is expected, send a properly formatted DNS query and check:

- Whether the DNS service is running.
- Whether it listens on UDP 53.
- Whether the query appears in service logs.
- Whether a firewall blocks the query or its response.

Correlate the query, response and device records rather than treating the label as proof of a cause.

## 6.6 Conclusions from the case

| Source | Target | Result | Administrator's next action |
|---|---|---|---|
| Management network | TCP 443 | Open | Confirm the allow policy and test application controls |
| General network | TCP 443 | Filtered | Correlate firewall rules and logs |
| Management network | TCP 8443 | Closed | Check the intended service deployment |
| Management network | UDP 53 | Open\|Filtered | Obtain more evidence with a valid DNS query |

The investigation uses scan results to check the intended security design. The usefulness of a state depends on the policy and service it is being compared with.

# 7 | Write a scan record another person can reproduce

After an authorized penetration test or acceptance check, telling an administrator “443 is open” leaves important questions unanswered. Where did the scan originate? When? Was it TCP or UDP? Which method was used? What evidence supports the classification?

Those details determine whether another engineer can reproduce and assess the result.

## 7.1 Separate observation from inference

Suppose a TCP 443 probe receives SYN/ACK and Nmap displays open. Record three layers:

| Layer | Content |
|---|---|
| Observed fact | TCP SYN/ACK was received |
| Tool classification | Nmap reported open |
| Follow-up inference | The endpoint accepts the initial TCP request; service and security settings need further checks |

The SYN/ACK is network-response evidence. Open is the tool's classification. Whether the service is secure requires other evidence. Keeping these separate makes the reasoning reviewable.

## 7.2 Practice on your own Ubuntu computer

Start locally if you are learning Nmap. Check whether the tool is installed and record its version:

```bash
nmap --version
```

Then run:

```bash
nmap -sT -p 22,80,443 --reason 127.0.0.1
```

| Argument | Purpose |
|---|---|
| `nmap` | Run Nmap |
| `-sT` | Use TCP Connect scanning |
| `-p 22,80,443` | Check only the three specified TCP ports |
| `--reason` | Show the state classification reason |
| `127.0.0.1` | Check this computer |

127.0.0.1 is the loopback address: the computer connects back to itself. If no service listens on 80 or 443, those ports may be closed. Your actual result depends on the current system configuration.

Loopback traffic does not traverse an external firewall, although the host's own filtering rules can still affect it.

### To observe SYN scanning

```bash
sudo nmap -sS -p 22,80,443 --reason 127.0.0.1
```

`-sS` selects TCP SYN scanning. It normally requires raw-packet privileges, commonly obtained with sudo on Linux.

Compare -sT and -sS on the same local ports. If you also capture authorized local traffic with Wireshark or tcpdump, compare their handshake behavior. This connects the methods in M03-03 with the classifications in M03-04.

## 7.3 Why use --reason?

Consider this simplified SYN-scan output:

```text
PORT      STATE    SERVICE  REASON
443/tcp   open     https    syn-ack
8443/tcp  closed   https-alt reset
```

This is illustrative output, not a measured run. Reason strings vary by method, platform and Nmap version; Connect scanning may show conn-refused, for example. Preserve what your actual run reports.

Read `443/tcp open syn-ack` as: “TCP 443 was classified as open because the scan received SYN/ACK.” This provides more analytical value than recording only “443 open.”

`--reason` is an official Nmap output option. [Nmap output reference](https://nmap.org/book/man-output.html)

## 7.4 What belongs in a reproducible scan record?

Retain at least these five categories:

| Category | Information to record |
|---|---|
| Scope | Target IP, port, transport and authorization scope |
| Conditions | Time, timezone, source network, Nmap version and arguments |
| Raw observation | SYN/ACK, RST, ICMP, or no response |
| Interpretation | State and the reason supporting it |
| Follow-up | Whether it matches the design, evidence still needed, and responsible reviewer |

Include the timezone, for example `2026-11-03 10:30 UTC+08:00`, so administrators can locate corresponding firewall logs.

The purpose is to let another engineer understand what you did, what you observed and why you reached the conclusion. Preserve the original output alongside the record.

# 8 | Match protection decisions with acceptance checks

An open port alone does not answer whether a system is secure. A public HTTPS website may need an open endpoint; an internal database administration interface may not belong on an untrusted network.

The goal is to align service access with operational requirements and security policy. Evaluate the service, access controls and acceptance evidence together.

## 8.1 First layer: the service

Ask why this port needs to exist. A hypothetical medical AI inference server might have an HTTPS API, SSH administration, a database and monitoring.

Those services do not all need the same audience. A database may need access only from the backend API. SSH may be restricted to administrators on a management network.

Confirm which services are necessary and disable unnecessary ones. This reduces the attack surface: fewer unnecessary services remain exposed to interaction.

## 8.2 Second layer: access controls

Ask who should use each endpoint.

| Service | Intended allowed sources |
|---|---|
| HTTPS 443 | Approved website users |
| SSH 22 | Management network |
| PostgreSQL 5432 | Designated application hosts |
| Prometheus 9090 | Monitoring network |

Source restrictions work alongside authentication, encryption and application permissions. A port number or source IP alone does not replace those controls.

Firewalls, security groups and network ACLs can implement network restrictions. This connects to the later CEH M12 material on IDS, firewalls and honeypots.

## 8.3 Third layer: acceptance

Ask whether the configured policy actually works. If the management network should reach SSH while the general network should not, test from both locations.

```text
Management network
       |
     allowed
       v
  +----------+
  | SSH: 22  |
  +----------+
       ^
     blocked
       X
       |
General network
```

Open from management and filtered from the general network can support the initial expectation. A complete acceptance check still compares firewall rules, device logs and application-level connection results.

Filtered could also arise from an unintended network fault. The classification alone does not prove that the intended rule caused it.

## 8.4 Use the three layers together

```text
Protection objective
        |
        v
1. Is the service necessary?
        |
        v
Remove unnecessary services
        |
        v
2. Who should have access?
        |
        v
Configure the access policy
        |
        v
3. Does the policy work?
        |
        v
Test from different locations
        |
        v
Compare logs and expectations
        |
        v
Complete acceptance with supporting evidence
```

This develops the ability to use scanning to verify an intended security design. The result becomes useful when it is connected to service requirements, access policy and corroborating evidence.

# 9 | Turn each state into a next step

Before the final scenarios, connect the methods, responses and decisions in a single map.

## 9.1 A complete M03-04 knowledge map

```text
Port scanning
      |
      +-- TCP Connect: attempt connection establishment
      +-- TCP SYN: send SYN
      +-- UDP: send UDP data
      |
      v
Collect responses
      +-- TCP response
      +-- UDP response
      +-- ICMP / silence
      |
      v
Classify according to the method
      +-- Open
      +-- Closed
      +-- Filtered
      |
      v
Other possible state labels
      +-- Open|Filtered
      +-- Unfiltered
      +-- Closed|Filtered
      |
      v
Record evidence
      |
      v
Cross-check configuration
      |
      v
Security acceptance
```

Use the chain “method → packet response → state → cross-check → security judgment.” Do not jump directly from a state name to a secure/insecure verdict; intended use and policy are still needed.

## 9.2 Three common misconceptions

### Misconception one: filtered proves there is a firewall

Filtered is a classification based on the method and response. Firewalls are common causes, but packet loss, offline equipment and routing problems can also affect observations. Combine the scan with other observations and device-side evidence.

### Misconception two: open means vulnerable

A public HTTPS endpoint may be intentionally open. Open means the corresponding communication was accepted. Assessing vulnerabilities requires service-version, configuration and program-behavior evidence.

### Misconception three: closed means the firewall blocked the packet

In a normal SYN scan, closed typically follows an explicit RST response. Filtered follows silence or particular errors under the method's rules. These are different observations and cannot simply be equated. An intermediary can generate RST, so investigate its origin when relevant.

# 10 | Conceptual Q&A: questions beginners often ask

These five explanations clarify the limits of scan evidence. Read them alongside the packets and cases above.

### Q1: if a port is open, can I immediately use the service?

Not necessarily. The endpoint accepts the corresponding network communication, but authentication, application errors, TLS configuration or permissions can still prevent use.

For example, TCP 443 open provides TCP-layer evidence. It does not guarantee that HTTPS functions correctly.

### Q2: why do different people get different results for the same port?

Their source networks, paths, access policies, times and scan methods can differ.

```text
Administrator --> SSH 22 --> Open
General user  --> SSH 22 --> Filtered
```

If these results match the intended policy, both can be correct observations.

### Q3: why not call silent UDP closed?

UDP has no TCP-style connection establishment, and some services answer only properly formatted requests. A silent service may still exist. A normal UDP scan therefore generally retains open|filtered when it receives no distinguishing response.

### Q4: what is the main difference between unfiltered and open?

Open indicates that the endpoint accepts the corresponding communication. In ACK scanning, unfiltered indicates that the probe receives a response without presenting the method's filtering result.

It does not establish acceptance of a new TCP connection. The same RST must be interpreted differently after SYN and ACK probes.

### Q5: what should I investigate after filtered?

First compare the result with the intended access policy. Within authorization, examine the source location, route, firewall rules, same-time logs and target listening configuration. If needed, repeat from another approved network.

The objective is to identify the cause and verify the security design. Making every filtered endpoint open is not the acceptance criterion.

# Final review: five abilities developed in M03-04

| Ability | What to understand |
|---|---|
| 1. Interpret port states | What Open, Closed and Filtered mean |
| 2. Interpret packet responses | How SYN/ACK, RST, ICMP and silence differ |
| 3. Distinguish protocols | Why TCP and UDP use different interpretation rules |
| 4. Identify observation conditions | How source, method and time affect results |
| 5. Perform security acceptance | How scan evidence helps evaluate policy conformance |

A scan result is evidence derived from network responses. Combine it with service configuration and security policy to reach a supported judgment.

## Further learning resources

Read these official references alongside the lesson:

1. [Nmap: six port states](https://nmap.org/book/man-port-scanning-basics.html)
2. [Nmap: TCP SYN packets and classification](https://nmap.org/book/synscan.html)
3. [Nmap: UDP scanning and open|filtered](https://nmap.org/book/scan-methods-udp-scan.html)

The four retained diagrams can also be opened at their original size:

[Core states](https://learn.cs-kairos.com/images/ceh/m03-04-01-core-states-en.svg), [SYN responses](https://learn.cs-kairos.com/images/ceh/m03-04-02-syn-responses-en.svg), [UDP responses](https://learn.cs-kairos.com/images/ceh/m03-04-03-udp-responses-en.svg), [Evidence recording](https://learn.cs-kairos.com/images/ceh/m03-04-04-evidence-record-en.svg).

## Understanding check: four scenarios

Try each question before opening its reference answer. The original report-fields exercise is retained as a fifth reference answer.

Question one: TCP SYN scan

You scan TCP 443 on a server and receive RST.

A. Which state would Nmap normally report?

B. Does this establish that the server is powered off?

C. If HTTPS was expected, what would you check next?

Question two: UDP scan

A DNS server's UDP 53 is reported as `open|filtered`.

A. Does that prove DNS is running?

B. Does that prove a firewall blocked it?

C. What could provide additional evidence?

Question three: results from different networks

The same server's SSH 22 is open from management and filtered from the general network.

A. Do the two observations contradict each other?

B. Does this match the initial expectation if only management should access SSH?

C. What evidence is still needed for acceptance?

Question four: ACK scan

An ACK scan reports `unfiltered`.

A. Can you conclude that the port is open?

B. What does ACK scanning primarily examine?

C. Which method would you use to check acceptance of a new TCP connection?
