# M04-09 | Seven network protocol groups and enumeration: a plain-language lesson

This lesson introduces NTP, IPsec, VoIP, IPv6, BGP, Telnet and TFTP. Although their roles differ, one idea connects them:

Obtaining information from a network service does not establish that you can sign in; signing in does not establish that you are authorized to control it.

That distinction is central to CEH M04, Enumeration. Place these technologies in one story to understand their network roles and how a security analyst should interpret evidence.

This lesson continues M04-09’s protocol and evidence analysis with the network foundations a beginner needs.

## 1. Imagine a network as an office building

Suppose you manage a building with 500 employees. It contains computers, telephones, access controls, network equipment and servers.

{{figure:roles}}

These services do different jobs. A single interpretation rule cannot turn every response into a security vulnerability.

## 2. What does CEH enumeration actually do?

Connect CEH M03, M04 and M05:

{{figure:stages}}

Finding an open port only suggests a service may be present. Obtaining information from that service still does not establish a vulnerability.

The lesson distinguishes five evidence levels:

{{figure:ladder}}

This is a framework for analyzing evidence strength, not a mandatory sequence that every protocol follows.

## 3. NTP: why does consistent time matter to security?

NTP stands for Network Time Protocol.

Imagine investigators reviewing three surveillance cameras whose clocks differ by several minutes.

All three may record the event, yet investigators can still reconstruct its sequence incorrectly.

Computers have the same problem. Suppose three devices record the same intrusion:

| Device | Recorded time |
| --- | --- |
| Firewall | 10:00:02 |
| Web server | 09:57:12 |
| Database | 10:03:30 |

Without time synchronization, a security investigation can reach the wrong conclusion.

NTP commonly uses UDP 123 to synchronize devices with a time source.

### What is stratum?

Stratum describes the hierarchy of time synchronization sources.

{{figure:stratum}}

{{figure:ntp-network}}

The hierarchy preserves same-level peering, multiple upstream sources and shared links. Devices at the same level are parallel roles. Each node names its source and peer endpoints; NTP’s selection procedure determines the actual source. The illustrated relationships guarantee neither accuracy nor management access.

A smaller stratum number does not necessarily mean greater accuracy. Synchronization state, source quality and network delay also matter.

For CEH analysis, an NTP reply saying that it is 10:00 establishes a responsive time service. It does not establish permission to read management settings or change the time server.

## 4. IPsec / IKE: why is a VPN response not a successful connection?

Imagine working at home and needing access to internal company systems.

A VPN can provide a protected network channel. IPsec is a common protection technology; IKE, Internet Key Exchange, negotiates protection and authenticates identities.

{{figure:ike}}

Suppose you receive an `IKE_SA_INIT` response.

You may report that the VPN service answered initial negotiation. You cannot report a successful VPN sign-in: authentication has not yet been established, and neither has permission to access internal resources.

Another common source of confusion is the meaning of these numbers:

| Number | Purpose |
| --- | --- |
| UDP 500 | IKE negotiation |
| UDP 4500 | Common NAT Traversal use |
| IP Protocol 50 | ESP |
| IP Protocol 51 | AH |

IP Protocol 50 is not Port 50. Ports are identifiers used by transports such as TCP and UDP; the IP Protocol Number identifies the protocol carried by an IP packet.

## 5. VoIP: why might audio remain exposed when telephone signaling is encrypted?

This distinction matters for telephone services, contact centers and call-recording systems.

VoIP carries telephone services over an IP network. It involves two distinct jobs:

{{figure:sip}}

Put simply:

SIP is like the telephone switchboard; RTP carries the actual spoken audio.

Suppose SIP uses TLS, but the audio media uses ordinary unencrypted RTP. At a network position that can observe the media packets, reconstructing the audio may still be possible.

During a CEH review, observing TCP 5061, commonly SIP over TLS, therefore does not establish that the entire telephone system is encrypted.

Check SIP signaling, RTP/SRTP media, key exchange and access controls separately.

## 6. IPv6: why do visible neighbors not represent every device?

IPv6 uses 128-bit addresses, for example:

`fe80::1234:abcd:5678:9abc`

`fe80::/10` is the Link-Local address range, primarily used for communication on the local link.

IPv6’s Neighbor Discovery, or ND, provides mechanisms comparable to finding neighbors and asking routers for information inside a building.

| Message | Plain-language meaning |
| --- | --- |
| NS | Where is the neighbor at a particular IPv6 address? |
| NA | Reply with or announce neighbor information. |
| RS | Which routers are nearby? |
| RA | A router provides network configuration information. |

These messages use ICMPv6, not TCP or UDP ports.

Suppose your computer’s neighbor table has only two entries. That establishes two current cache records, not that the entire area contains only two devices.

Other devices may not have communicated with you, records may have expired, and one device can have multiple IPv6 addresses.

On Ubuntu, inspect your own computer’s neighbor cache with:

```
ip -6 neigh show
```

This command primarily reads information retained by the local kernel; it does not scan the entire network. Run it in an Ubuntu terminal with iproute2 installed. Each row normally includes a neighbor address, interface and state; an empty cache may produce no rows. No real-device execution result is supplied here.

Blocking all ICMPv6 does not automatically improve security. IPv6 neighbor discovery and Path MTU Discovery depend on particular ICMPv6 messages; blocking all of them can break connectivity.

## 7. BGP: how does the Internet know where to send data?

Imagine sending a parcel from Taiwan to the United States.

The Taiwanese logistics company need not know every American street. It needs to know which logistics network should receive the parcel next.

BGP, Border Gateway Protocol, similarly exchanges routes between large networks.

Two terms are useful:

An AS, Autonomous System, is a group of IP networks managed under a common routing policy. An ASN is its identifying number.

For example, the lesson uses this hypothetical path:

`AS64500 → AS64497 → AS64496`

It represents an AS path recorded in route information, not necessarily the physical routers that a packet will traverse.

BGP commonly uses TCP 179. A public Looking Glass may show the routes visible from a particular observation point.

Seeing that information does not authorize changing routes. Information visibility and administrative permission are distinct.

{{figure:bgp}}

The diagram uses documentation prefix 192.0.2.0/24 and documentation ASNs for all four ASes. Each external AS prepends its own number when advertising the route onward. This example successively produces 64500, 64497 64500, 64496 64497 64500, and 64498 64496 64497 64500. When the advertisement returns to AS64500, the receiver finds its own ASN already in the path and excludes the looping route. Arrows indicate route advertisements; ordinary packet forwarding toward the destination prefix differs from that advertisement direction. This is a simplified example, not measured routing or a complete account of route selection.

BGP security also involves route hijacking, incorrect route announcements, prefix filtering and RPKI. RPKI can help validate whether an origin AS is authorized to announce a particular prefix; it cannot by itself establish the correctness of the entire AS_PATH.

## 8. Telnet and TFTP: why do older technologies raise security concerns?

### Telnet | Remote text terminal

Imagine operating another computer’s command line from your own computer. Traditional Telnet commonly uses TCP 23 and lacks the transport encryption expected today. Someone able to observe packets along the path may see usernames, passwords and commands.

Modern remote administration normally favors SSH.

### TFTP | Simple file transfer

Imagine a device that knows a configuration filename and requests it from a server. TFTP commonly accepts initial requests on UDP 69, then uses separately selected UDP ports for the transfer.

Basic TFTP has no standard user sign-in mechanism or general directory-browsing facility.

The absence of a login screen does not make every file readable or writable. The server can still restrict access by source, path and file permissions.

Likewise, seeing a Telnet login screen does not establish remote terminal access.

{{figure:telnet}}

{{figure:tftp}}

## 9. CEH summary of the seven protocol groups

| Protocol | Common identifier | Interpretation |
| --- | --- | --- |
| NTP | UDP 123 | A time reply does not establish management permission. |
| IPsec / IKE | UDP 500, 4500 | A negotiation reply does not establish VPN sign-in. |
| SIP | 5060, 5061 | Encrypted signaling does not establish encrypted audio. |
| IPv6 / ND | ICMPv6 | The neighbor cache is not a complete asset inventory. |
| BGP | TCP 179 | Seeing routes does not authorize modifying them. |
| Telnet | TCP 23 | A login prompt does not establish successful login. |
| TFTP | UDP 69 initially | A file service does not grant arbitrary read/write access. |

SIP commonly uses UDP or TCP 5060, and TLS over TCP 5061. These are common values, not immutable rules. Discovering a port still requires identifying the actual service.

## 10. How do you write a professional CEH review conclusion?

Suppose an authorized test environment contains a VPN server that answers `IKE_SA_INIT`.

An unsupported report might say:

> A VPN vulnerability was found; an attacker may enter the internal network.

The conclusion lacks sufficient evidence.

A more precise record would read:

{{figure:report}}

This distinguishes normal service behavior, information disclosure, misconfiguration and vulnerabilities with an established security impact.

## 11. Understanding check: can you interpret evidence like a CEH analyst?

### 1. A VPN server replies to IKE_SA_INIT. How do you interpret it?

A. VPN sign-in succeeded.

B. Only a response to initial negotiation has been established.

C. Access to the company’s internal network has been obtained.

{{answer:1}}

### 2. SIP uses TLS. Is that sufficient to establish encrypted call audio?

A. Yes; all audio will be encrypted.

B. No; media transport protection still needs verification.

C. Yes; using 5061 is sufficient.

{{answer:2}}

### 3. Your IPv6 neighbor table has only two entries. What does that mean?

A. The entire network contains only two devices.

B. Other devices must be hidden.

C. The local computer currently has two neighbor-cache records.

{{answer:3}}

### 4. A TFTP server responds to requests. Does that mean any file can be downloaded?

A. Yes, because TFTP has no sign-in mechanism.

B. No; server configuration and file permissions still apply.

C. Yes, and any file can also be modified.

{{answer:4}}

Answer first, then expand each reference answer and explanation. This page does not store answers or calculate learning progress.

The skill to build is asking three questions about any new service: What did I actually observe? What does it establish? What further evidence supports a security conclusion?

These questions support later work in CEH M05 vulnerability analysis, penetration testing and security audits by helping distinguish normal service behavior from vulnerabilities.
