# CEH M04-09 | Other enumeration: NTP, IPsec, VoIP, IPv6 and BGP in plain language

This lesson brings several network protocols together through one central idea:

“A device being willing to answer your question does not mean you can sign in to it, and certainly does not mean you control it.”

The aim is to understand each service's job, the information it may disclose, and how far that information supports a conclusion, rather than simply memorize port numbers.

## 1. Picture the network as a large office building

NTP: the building's reference clock.

It keeps everyone's time aligned.

IPsec / IKE: a protected passage into the building.

They negotiate identity and protection mechanisms to establish protected connections.

VoIP / SIP: the telephone switchboard.

They help connect, transfer and end calls.

IPv6: the office address system.

It lets devices identify neighbors and find routers.

BGP: route information between cities.

It tells networks which destinations are reachable.

Telnet / TFTP: the old management room and filing cabinet.

They provide remote terminals or simple file transfer.

These services all belong to a network, but perform different jobs.

For example, asking the building's clock for the time and receiving an answer does not give you a building access card.

That is the central distinction when interpreting enumeration evidence.

## 2. Judge evidence at five different levels

Imagine visiting a company's server room to learn about a server.

{{figure:ladder}}

This is a conceptual model of evidence strength. It does not mean every protocol follows this sequence or that every service has a sign-in mechanism.

Keep these distinctions in mind:

- A response does not establish successful authentication.
- Successful authentication does not grant every capability.
- Reading data does not establish permission to change it.
- Not seeing some data does not establish that it does not exist.

Use this framework to understand the following seven protocol groups.

## 3. NTP: why do networked computers need synchronized clocks?

NTP stands for Network Time Protocol.

Think of an NTP server as a school's reference clock. Every classroom needs the same time for lessons; otherwise the bell rings while some classrooms believe class has not started.

Why do computers need synchronized time too?

Suppose three company systems record the same event:

| Device | Recorded time |
| --- | --- |
| Firewall | 10:00:02 |
| Web server | 09:57:12 |
| Database | 10:03:30 |

If the clocks disagree, investigators may infer the wrong order of events during an intrusion investigation.

NTP therefore affects log analysis, authentication mechanisms and coordination between systems, as well as the clock displayed on a desktop.

Common port: UDP 123.

### What does Stratum mean?

Stratum describes the synchronization hierarchy: the level from which this clock obtains its time.

{{figure:stratum}}

A reference clock can serve multiple first-level servers. Lower levels can also have multiple candidate upstream sources and same-level peer relationships. Stratum 3 and 4 extend that idea in the diagram. A device's level depends on its actually selected synchronization source; not every configured relationship is simultaneously an active upstream source.

{{figure:ntp-network}}

If an NTP server reports Stratum 2, it is declaring its position at the second level of the synchronization hierarchy.

That does not establish its accuracy or security, or reveal all of its upstream servers.

For CEH, distinguish normal time service from access to management information.

A server may provide the current time while withholding its version, configuration or connection information. That can be an appropriate security design.

## 4. IPsec / IKE: how does a VPN establish a protected channel?

Suppose you work from home and want to connect to your company's internal network.

The company does not grant internal access merely because someone requests a connection.

A VPN can use IPsec to protect data. IKE handles the negotiation and authentication needed to establish that protection.

{{figure:ike}}

The diagram uses IKEv2. IKE_SA_INIT and IKE_AUTH name exchanges, not the Phase 1 and Phase 2 of IKEv1. The first CHILD_SA is normally negotiated during IKE_AUTH. Checking whether the data channel works is a verification task, not a mandatory third exchange type. A Security Association (SA) holds the agreed protection parameters and state; routing and access policies also need checking.

A common mistaken conclusion is:

> I received an IKE_SA_INIT response, so I successfully signed in to the company VPN!

The response establishes only that the endpoint answered this initial negotiation. It does not establish successful authentication.

Even a successfully established VPN may permit access to only a small subset of company systems.

Common related numbers:

| Number | Purpose |
| --- | --- |
| UDP 500 | IKE negotiation |
| UDP 4500 | Commonly used for NAT traversal and encapsulated traffic |
| IP Protocol 50 | ESP, protecting IPsec data |
| IP Protocol 51 | AH, providing packet integrity and related protection |

IP Protocol 50 and 51 are not TCP or UDP ports 50 and 51.

Keeping protocol numbers separate from port numbers is a useful networking foundation.

## 5. VoIP / SIP: why might call signaling be encrypted while the voice is not?

VoIP carries calls over IP networks.

Enterprise desk phones, customer-service centers and telephone switchboards can use VoIP technology.

Distinguish two responsibilities:

SIP sets up the call; RTP commonly carries the audio.

Imagine calling a colleague.

First the system has to find the other party, make their phone ring and establish the call. These are primarily SIP responsibilities.

Once connected, your speech must be transmitted continuously. That is commonly RTP's job.

{{figure:sip}}

Using TLS for SIP is like putting telephone connection instructions inside a confidential envelope.

The actual voice travels in a separate data flow. If media uses ordinary RTP without suitable protection, the voice is not necessarily encrypted.

SRTP is one common way to protect media; also verify the key negotiation and the actual connection.

Common ports are UDP/TCP 5060 for SIP and TCP 5061 for SIP over TLS. Port 5061 alone cannot establish that protection is correctly in place.

In CEH enumeration, a SIP service answering questions about supported features provides capability information. It does not establish access to an extension account or permission to place calls.

## 6. IPv6: why do two neighbor entries not mean only two devices exist?

IPv6 is an IP addressing architecture with 128-bit addresses.

You may see an address such as:

`fe80::1234:abcd:5678:9abc`

This is one form of IPv6 address.

### What is Neighbor Discovery?

Imagine moving to a neighborhood and wanting to know who is nearby and where the road leads.

IPv6 Neighbor Discovery (ND) handles comparable questions.

For example:

- NS: asks about a neighbor associated with an IPv6 address.
- NA: responds with or announces neighbor information.
- RS: asks routers to identify themselves.
- RA: a router announces network configuration information.

These functions use ICMPv6 messages, not a special IPv6 TCP/UDP port.

### Why is the neighbor list incomplete?

Suppose your computer currently has this neighbor cache:

| Local neighbor cache | Current entry |
| --- | --- |
| Entry 1 | A router's IPv6 address |
| Entry 2 | A nearby device's IPv6 address |

You can say, “The cache currently contains two entries.”

You cannot conclude, “This network contains only two devices.”

Other devices may not have communicated with you, records may have expired, some devices may be on other links, and one device can have multiple IPv6 addresses.

Another security consideration: an IPv6 firewall should not indiscriminately block all ICMPv6.

Some ICMPv6 messages are essential for normal communication, including Neighbor Discovery and Path MTU Discovery.

## 7. BGP: how does the Internet know which way to send data?

Imagine sending a parcel from Taiwan to the United States.

The Taiwanese logistics company need not know every American alley. It needs to know which international logistics network should receive the parcel next.

BGP is comparable to route information exchanged between large networks.

Different organizations manage many of the Internet's networks. An Autonomous System (AS) represents networks operated under a common routing policy.

Each AS has an Autonomous System Number (ASN).

BGP exchanges reachability information: which IP prefixes can be reached through which networks.

Common port: TCP 179.

{{figure:bgp}}

The diagram retains the dual-upstream, transit and stub relationships, replacing the reference image's AS 100/200/400/500/600 with documentation ASNs. The highlighted route is selected for this example. Actual BGP selection depends on policy and attributes; simply counting links cannot establish the best path. Lines represent BGP peer relationships, not cable locations or a complete physical topology.

### What is AS_PATH?

Think of AS_PATH as the AS path recorded in a route announcement.

For example, an observation point might see:

`AS 64500 → AS 64497 → AS 64496`

This is a hypothetical route using ASNs reserved for documentation.

It does not directly identify every physical router traversed by packets or reconstruct a company's complete internal network.

A public Looking Glass may let you inspect this routing information. That means you read data from a particular observation point, not that you have permission to change router settings.

BGP security also involves prefix filtering, neighbor controls and RPKI.

RPKI can help check whether an origin AS is authorized to announce a particular IP prefix. It cannot, on its own, establish that the entire AS_PATH is correct.

## 8. Telnet and TFTP: why do older protocols deserve attention?

{{figure:legacy}}

## 9. Compare the seven protocol groups

| Protocol | Common port or protocol number | Information you may obtain | What it does not directly establish |
| --- | --- | --- | --- |
| NTP | UDP 123 | Time, synchronization level | Access to all management information |
| IPsec / IKE | UDP 500/4500 | Negotiation information | Successful VPN sign-in |
| SIP / VoIP | UDP/TCP 5060; TCP 5061 | Telephone service capabilities | Permission to call or encrypted voice |
| IPv6 / ND | ICMPv6 | Neighbor and router clues | Complete device count |
| BGP | TCP 179 | Prefixes and routing paths | Permission to modify routers |
| Telnet | TCP 23 | Login prompt, service clues | Terminal access |
| TFTP | UDP 69 initially | Result of a particular file transfer | Read/write access to every file |

These are common values. A port number does not conclusively identify a protocol. Ports can change; verify the actual protocol content and configuration.

## 10. Apply the lesson to a CEH security review

In the Certified Ethical Hacker (CEH) learning route, enumeration helps you understand the information a target service provides.

Professional security analysis cannot equate “the tool produced output” with “a vulnerability was found.”

For example, in an authorized test environment you observe:

{{figure:case}}

A report should connect the following:

{{figure:report}}

An NTP server providing time on UDP 123 may be operating exactly as intended, without a vulnerability.

Investigate unnecessary management-information exposure, configuration that conflicts with policy, and whether required services still work.

This separates normal function, information disclosure, configuration weaknesses and demonstrably exploitable security problems.

## 11. Check your understanding of evidence boundaries

Four scenario questions. Choose an answer before opening each reference explanation. This page does not store answers or track learning progress.

### 1. What does an IKE_SA_INIT response from a VPN server establish?

A. Successful sign-in to the company VPN.

B. The server answered initial negotiation; successful sign-in remains unproven.

C. The highest administrator privileges on the internal network.

{{answer:1}}

### 2. A company's SIP service uses TLS. What can you conclude?

A. Every call's audio is necessarily encrypted.

B. Anyone can place calls.

C. That SIP signaling segment can be protected by TLS; media requires separate checks.

{{answer:2}}

### 3. Your IPv6 neighbor cache has only two entries. What is the correct interpretation?

A. The entire network has only two devices.

B. The local cache currently has two neighbor records; this is not a complete asset inventory.

C. Other devices must be deliberately hiding.

{{answer:3}}

### 4. You see BGP routes through a public Looking Glass. What does that establish?

A. Permission to change router settings.

B. Network administrator privileges.

C. Visibility into routes at a particular observation point, without management authority.

{{answer:4}}

Enumeration uses limited responses to reach evidence-supported conclusions with a clear scope. Calling every visible fact a vulnerability defeats that purpose. This distinction also prepares you for M04-10, enumeration defenses.
