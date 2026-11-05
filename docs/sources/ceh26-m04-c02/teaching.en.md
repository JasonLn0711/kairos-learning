# CEH M04-02 | DNS Enumeration: a complete plain-language lesson

DNS tells you which data a name maps to. It does not establish that a host is present, its services work, or you have permission to access it.

## Orientation: where DNS fits in a security investigation

Recall the preceding CEH topics.

| CEH module | Main task | Plain-language meaning |
|---|---|---|
| M02 Footprinting | Reconnaissance | Learn what public information may be available about a target |
| M03 Network scanning | Scanning | Check which hosts, ports and services may be present |
| M04 Enumeration | Enumeration | Ask a particular service for more specific information |
| M05 Vulnerability analysis | Vulnerability Analysis | Assess whether the discovered systems have vulnerabilities |

Suppose you are your company's security engineer. You know its website name, `www.example.com`, but do not know the equipment behind it, its mail provider, or its DNS servers. DNS queries can supply some of those clues.

```text
Known domain name
  ↓ Query DNS records
  ├─ A / AAAA → possible IP addresses
  ├─ MX       → inbound mail configuration
  ├─ NS       → authoritative name servers
  ├─ CNAME    → aliases between names
  └─ TXT      → domain policies and verification data
  ↓ Organize possible system and service clues
  ↓ Verify further within the authorized scope
  ├─ Is the host reachable?
  ├─ Is the port open?
  ├─ Is the TLS certificate valid?
  ├─ Does HTTP work?
  └─ Is there a security vulnerability?
```

DNS queries collect one layer of evidence. They do not complete a security assessment.

# Chapter 1 | DNS is an address book, not a website health check

## 1.1 What is DNS?

DNS stands for Domain Name System. Think of a telephone directory: instead of asking for a person's telephone number, a computer asks which IP address corresponds to a website name.

```text
You enter www.example.com
  ↓ DNS lookup
An address is returned, for example 93.184.215.14
```

This address only illustrates name resolution; it is not a claim about the site's current address. A domain name is a memorable label, an IP address is used for network communication, and DNS supplies the associated data. It also supplies mail, name-server and other service configuration, beyond name-to-IP mapping.

## 1.2 Why does finding an IP not prove the website works?

Suppose DNS returns the following synthetic records:

```text
www.example.test → 192.0.2.10
www.example.test → 192.0.2.11
```

It is tempting to conclude that there are two functioning website servers. The observation establishes only that this query returned two IPv4 records. It does not establish that either address is reachable, serves web pages, or is healthy; nor that two physical computers exist or that these are the company's origin servers.

### Example: Cloudflare CDN

A company may protect its site with Cloudflare:

```text
User queries www.company.com
  ↓ DNS returns a Cloudflare address
Cloudflare edge node
  ↓ Proxies a request according to configuration
Company origin server
```

The address can identify a CDN edge rather than the machine storing the site. Anycast can let users in different locations reach different nodes through the same IP address. Two DNS addresses therefore do not mean two physical hosts.

### 1.3 How does this connect to M03 scanning?

Connect this to M03-03 Port Scanning. Consider four separate observations:

```text
DNS:   www.example.test → 192.0.2.10
TCP:   192.0.2.10:443 responds to a connection attempt
TLS:   handshake succeeds
HTTP:  GET / returns HTTP 200
```

| Observation | Supported judgment | Unsupported conclusion |
|---|---|---|
| An A record is returned | DNS supplied an IPv4 address | The host works |
| TCP 443 connects | A TCP connection can be established to that port | The service must be HTTPS |
| TLS handshake succeeds | A TLS channel can be established | Every web function works |
| HTTP 200 | One HTTP request received a success status | The entire website has no problems |

Each layer supplies different evidence. Keep those layers separate in security investigations.

# Chapter 2 | The server you ask may not maintain the answer

## 2.1 Three important DNS roles

When looking up the address of `www.example.com`, distinguish three roles.

**Role 1: Stub Resolver**

This is the client-side lookup component. When Firefox needs a name resolved through system DNS, the request normally goes through the computer's resolver service. A browser configured for its own DNS over HTTPS may take another path rather than use system DNS.

**Role 2: Recursive Resolver**

This service finds answers for clients. Think of a company reception desk: it answers from information it already has, or asks other departments and relays the result. Public recursive services include Cloudflare DNS at `1.1.1.1` and Google Public DNS at `8.8.8.8`.

**Role 3: Authoritative Name Server**

This role resembles the official records office. It maintains authoritative data for a DNS zone, for example:

```text
example.com zone, illustrative only:
www.example.com    A     192.0.2.10
mail.example.com   A     192.0.2.20
example.com        MX    10 mail.example.com
```

Authoritative servers provide official DNS configuration, but do not establish the health of the services named in it.

## 2.2 How does a lookup find its answer?

```text
Your computer / browser asks for www.example.com
  ↓ Recursive Resolver
  ├─ Suitable cache entry → reply immediately
  └─ Cache miss
       → Root DNS: where is .com managed?
       → .com TLD DNS: where is example.com managed?
       → example.com authoritative DNS: requested record
       → Recursive Resolver
       → Your computer
```

This is a typical conceptual model. A resolver may already have cached intermediate information or use a forwarder, so it need not start at the root for every query.

### 2.3 Domain versus zone

A domain is part of the DNS namespace:

```text
example.com
  ├─ www.example.com
  ├─ mail.example.com
  └─ research.example.com
```

A zone is a set of DNS data managed by particular authoritative servers. Headquarters might manage `example.com` while delegating `research.example.com` to a research department with its own authoritative servers. Names in the same hierarchy can therefore belong to different zones. Obtaining data for one `example.com` zone does not obtain all of the company's subdomain data.

# Chapter 3 | What enumeration asks: common records

A DNS data entry is a Resource Record, or RR. Records are like different address-book fields: name, telephone, email, department and job title carry different meanings.

## 3.1 A: IPv4 addresses

A maps a domain name to an IPv4 address:

```text
www.example.test → 192.0.2.10
```

The question is: which IPv4 addresses are configured for this name?

## 3.2 AAAA: IPv6 addresses

AAAA maps a domain name to an IPv6 address:

```text
www.example.test → 2001:db8::10
```

`2001:db8::/32` is reserved for documentation. AAAA is the formal record type name; it does not mean running a command four times. Remember A → IPv4 and AAAA → IPv6. A missing AAAA answer does not establish that the entire domain has no IPv6-related configuration.

## 3.3 CNAME: an alias between names

CNAME means Canonical Name and describes one name as an alias of another:

```text
www.example.test
  ↓ CNAME
web.example.test
  ↓ A
192.0.2.10
```

When publishing a website, CNAME can associate `www.example.test` with the service's canonical name. It is different from an HTTP 301 or 302 redirect: CNAME operates during DNS resolution; an HTTP redirect tells a browser to visit another URL after an HTTP request has been sent.

## 3.4 PTR: reverse DNS

A is a name-to-address lookup. PTR, or Pointer Record, commonly supports the reverse direction:

```text
192.0.2.10
  ↓ Reverse DNS lookup
web.example.test
```

A returned PTR name does not establish that the host belongs to the organization suggested by that name. Reverse data is normally configured by the party managing the relevant address space. Even matching forward and reverse lookups are insufficient on their own for identity authentication.

## 3.5 NS: who answers authoritatively for the zone?

NS means Name Server and identifies authoritative name servers:

```text
example.test NS ns1.example.test
example.test NS ns2.example.test
```

This zone uses ns1 and ns2 as authoritative servers. These are different from the recursive resolver configured on your computer.

## 3.6 SOA: zone administration data

SOA, Start of Authority, includes the primary authoritative server name, administrative contact data, zone serial number and synchronization timers. Think of a zone's management/version sheet. Its serial helps compare versions; it is not a host's boot time, server uptime, or the website's last update time.

## 3.7 MX: where does incoming mail go?

MX means Mail Exchanger:

```text
example.test MX 10 mail1.example.test
example.test MX 20 mail2.example.test
```

These are two mail-exchanger records. A smaller preference value is preferred: 10 before 20. They are not percentages of mail. Nor does this prove that mail2 will successfully receive all mail when mail1 fails. MX is a routing configuration clue, not a mail-system health report.

## 3.8 TXT: domain text settings

TXT can hold text for domain-control verification, SPF sender-authorization policy, DKIM public signing keys, and DMARC authentication/handling policy. For example:

```text
example.test TXT "v=spf1 -all"
```

`v=spf1` identifies SPF. `-all` declares sources not authorized by earlier mechanisms to fail SPF; with no earlier authorizing mechanisms, this policy authorizes no IP to send mail that passes SPF using this domain. Seeing a TXT record does not establish that the full mail-protection setup is correct. TXT data is publicly queryable and must not contain passwords or secret keys.

## 3.9 SRV: a service entry point

SRV, Service Record, describes a target host, port, priority and weight. This is a synthetic LDAP example:

```text
_ldap._tcp.example.test.  IN SRV 0 5 389 ldap01.example.test.
```

| Field | Meaning |
|---|---|
| `_ldap` | LDAP service name |
| `_tcp` | TCP transport |
| `0` | Priority |
| `5` | Weight |
| `389` | Service port |
| `ldap01.example.test` | Target hostname |

M03-03 introduced port 389 as commonly used for LDAP. An SRV record now supplies a possible LDAP endpoint. You can report that DNS provides possible LDAP entry-point data; you cannot conclude that LDAP is running or that anyone can log in.

### Chapter 3 reference table

| Record | Main purpose | Address-book analogy |
|---|---|---|
| A | IPv4 address | Telephone number |
| AAAA | IPv6 address | Another number format |
| CNAME | Name alias | Another name for a contact |
| PTR | Reverse name lookup | Registered name for a number |
| NS | Authoritative servers | Records-management office |
| SOA | Zone management | Version and management sheet |
| MX | Incoming-mail routing | Company mailroom |
| TXT | Text settings and policy | Public noticeboard |
| SRV | Service entry point | Service desk's location and extension |

Start with A, AAAA, NS and MX, then extend to the other types rather than memorizing everything at once.

## DNS enumeration overview diagram

The diagram joins the first three chapters: lookup roles, record purposes, and the boundary between a DNS reply and evidence requiring further verification.

[[figure:overview]]

# Chapter 4 | Read one dig command first

## 4.1 What is dig?

`dig` stands for Domain Information Groper. It is a DNS query tool: specify a DNS server and ask for a particular type of data about a name. It does not check every website function.

## 4.2 Break down a command

```bash
dig @192.0.2.53 www.example.test A
```

`192.0.2.53` is a documentation address, not a usable public DNS service.

| Part | Meaning | Plain-language reading |
|---|---|---|
| `dig` | DNS query tool | I want to query DNS |
| `@192.0.2.53` | Selected DNS server | Ask this server |
| `www.example.test` | Query name | Look up this name |
| `A` | Record type | Ask for IPv4 data |

Read the whole line as: ask DNS server 192.0.2.53 for the A records of www.example.test.

### Why the @ prefix?

`@` is dig's syntax for selecting a server:

```bash
dig @1.1.1.1 example.com A
```

This asks Cloudflare's public recursive service for example.com's IPv4 records. Without a selected server:

```bash
dig example.com A
```

`dig` normally chooses an endpoint from system resolver configuration. Different computers can therefore produce different answers. [BIND 9 documentation](https://bind9.readthedocs.io/en/stable/manpages.html)

## 4.3 Does DNS use UDP or TCP?

Recall TCP and UDP from M03-01. Conventional DNS uses both UDP port 53 and TCP port 53. Ordinary queries often use UDP, but TCP also carries ordinary queries, for example when a reply is too large or the tool explicitly selects TCP. AXFR uses TCP.

DNS on TCP 53 is not automatically malicious, and blocking all TCP 53 because DNS supposedly needs only UDP is unsound. Base firewall policy on the server role and actual requirements. DoH and DoT are different transports, commonly HTTPS port 443 and TCP port 853 respectively; distinguish them from conventional port-53 DNS.

## 4.4 Practice on Ubuntu

On Ubuntu 24.04, install dig if needed:

```bash
sudo apt update

sudo apt install dnsutils
```

Then try:

```bash
dig example.com A
```

This is an ordinary public DNS query to an IANA-reserved example domain. Query the types individually:

```bash
# IPv4
dig example.com A

# IPv6
dig example.com AAAA

# Incoming mail configuration
dig example.com MX

# Authoritative DNS
dig example.com NS

# Text records
dig example.com TXT
```

Focus on the question you asked and what the reply establishes, rather than how many answers you found.

# Chapter 5 | Separate the answer from the answering server

## 5.1 Read a dig response

Consider this synthetic response for an authorized lab:

```text
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1

;; QUESTION SECTION:
;www.lab.example.test. IN A

;; ANSWER SECTION:
www.lab.example.test. 120 IN A 192.0.2.50

;; SERVER: 192.0.2.53#53(192.0.2.53) (UDP)
```

Read it in four parts.

### First part: HEADER

`status: NOERROR` means the reply's DNS status does not report a DNS error. It does not establish a working website, all desired records, or an online host. DNS response status and application health are separate.

### Second part: QUESTION

`www.lab.example.test. IN A` is the question: A records for that name. `IN` is the Internet class; `A` requests IPv4 address data. The final dot denotes the DNS root ending a complete name. For example, `www.example.com.` is a Fully Qualified Domain Name (FQDN).

### Third part: ANSWER

`www.lab.example.test. 120 IN A 192.0.2.50` supplies one IPv4 record. `192.0.2.50` is address data; `120` is its TTL.

### Fourth part: SERVER

`SERVER: 192.0.2.53#53 (UDP)` identifies the endpoint that answered this DNS query, not the web server you want to visit.

```text
DNS server 192.0.2.53
  ← I ask it for www.lab.example.test's address
  → It answers with 192.0.2.50
```

| Field | Address | Role |
|---|---|---|
| SERVER | 192.0.2.53 | DNS endpoint answering this query |
| ANSWER | 192.0.2.50 | Returned IPv4 address data |

The addresses could coincide in a real deployment, but their roles still differ.

## 5.2 What is TTL?

TTL means Time To Live: how long this DNS data may be cached. For example:

```text
www.example.test. 300 IN A 192.0.2.10
```

The TTL is 300 seconds. A recursive resolver may answer subsequent queries from its valid cache rather than contact authoritative servers every time.

```text
00:00  Reply received, TTL = 300
01:00  Cache may remain, about 240 seconds left
03:00  Cache may remain, about 120 seconds left
05:00  Original cache lifetime expires
```

This is simplified. Multiple caches, prefetching and Serve-Stale can affect real behavior. TTL is not host uptime and does not guarantee worldwide DNS agreement after that many seconds.

## 5.3 What do qr, rd, ra and aa mean?

These are DNS message flags.

| Flag | Full name | Plain-language meaning |
|---|---|---|
| `qr` | Query Response | This message is a response |
| `rd` | Recursion Desired | The client requested recursion |
| `ra` | Recursion Available | The responder advertises recursive service |
| `aa` | Authoritative Answer | The reply claims authority |

Distinguish rd from ra using the reception-desk analogy: rd says, “Please ask another department if necessary”; ra says, “We provide that lookup service.” ra does not establish that other servers were actually contacted for this query; a cache may have supplied the answer. aa is an authority flag, not cryptographic proof of authenticity.

## 5.4 Why might Ubuntu show 127.0.0.53?

You might run:

```bash
dig example.com A
```

and see:

```text
SERVER: 127.0.0.53#53
```

This can be normal on Ubuntu using systemd-resolved with its local stub enabled. `127.0.0.53` is a local DNS endpoint:

```text
dig
  ↓ 127.0.0.53: local systemd-resolved
  ↓ Configured upstream DNS
  ↓ DNS reply
```

It does not mean the actual upstream DNS server is your own computer. Inspect current DNS/interface settings with:

```bash
resolvectl status
```

# Chapter 6 | Five different reasons for no answer

Not receiving an answer does not mean DNS has established that the name is absent. Asking a company whether it employs a person can produce very different replies.

## 6.1 NOERROR with an empty answer

```text
status: NOERROR

ANSWER: 0
```

One common interpretation is NODATA: no record of the requested type was obtained. For example:

```bash
dig example.com AAAA
```

An absent AAAA answer may indicate no AAAA data for that name, but examine the other response sections before concluding this. NODATA describes a class of negative DNS answers; it is not a separate DNS status code.

## 6.2 NXDOMAIN: nonexistent name

```text
status: NXDOMAIN
```

The reply reports a name as nonexistent. In the company analogy, the official list does not contain that person's name. This does not mean the company is absent, it employs nobody else, or all related subdomains are absent. If a CNAME chain is involved, identify which name was reported nonexistent.

## 6.3 SERVFAIL: resolution failure

```text
status: SERVFAIL
```

The server could not complete resolution. Possible causes include upstream trouble, DNSSEC validation failure, misconfiguration or other processing failures. A reception desk saying its lookup system is unavailable has not established that the person is absent.

## 6.4 REFUSED: processing denied

```text
status: REFUSED
```

The DNS server refuses the request. Access-control policy, an unauthorized query source, or a restricted function can cause it. A company refusing to release all employee records does not imply it has no records.

## 6.5 Timeout: waiting expired

```text
;; communications error: timed out
```

No usable reply arrived during the wait. Packet loss, firewall filtering, an unresponsive service, endpoint trouble or routing problems may cause it. REFUSED is an explicit DNS refusal; a timeout provides no usable DNS response.

### Five outcomes compared

| Outcome | Meaning | Does it prove the name is absent? |
|---|---|---|
| NOERROR + empty ANSWER | No answer of the requested type obtained | Not from these two facts alone |
| NXDOMAIN | Reply reports a relevant name absent | DNS evidence of absence, interpreted in context |
| SERVFAIL | Resolution failed | No |
| REFUSED | Server refused processing | No |
| Timeout | No usable reply received | No |

### Why does NOERROR + empty ANSWER not prove existence either?

RFC 9824 defines DNSSEC Compact Denial of Existence. In some circumstances an authoritative server can express a nonexistent name using NOERROR and an empty ANSWER. Read the other sections, DNSSEC data and query context rather than only status and answer count. [RFC 9824](https://www.rfc-editor.org/rfc/rfc9824.html)

You do not need to memorize this advanced detail immediately. The main CEH lesson is that different reasons for an absent answer lead to different investigation steps.

# Chapter 7 | Turn queries into clues without presenting guesses as facts

Security investigation requires conclusions supported by tool output.

## 7.1 What does one query establish?

In an authorized lab, suppose you query:

```bash
dig @192.0.2.53 example.test MX
```

and receive this synthetic answer:

```text
example.test. 300 IN MX 10 mail.example.test.
```

The reply configures `mail.example.test` as a mail exchanger for `example.test` with preference 10. It does not establish that mail is functioning, that the company owns the host, that anyone can relay mail through it, or that employee mailbox names have been found. MX is routing configuration. Resolve the mail hostname and verify relevant services within the authorized scope to learn more, connecting this task to M03 scanning.

## 7.2 Do admin, vpn and dev names prove those services exist?

```text
admin.example.test
vpn.example.test
dev.example.test
```

These suggest an administration interface, VPN, or development environment. Other explanations include obsolete names, moved services, reserved names, CDN or third-party destinations, or a name that does not match actual usage. Separate returned data from interpretation.

## 7.3 Write an evidence-based DNS investigation record

| Category | Record |
|---|---|
| Observation | DNS returned one A record for `vpn.example.test` |
| Fact boundary | This query returned `192.0.2.30` |
| Inference | The name may relate to a VPN service |
| Unconfirmed | Whether VPN is present, online, and who manages it |
| Follow-up | Verify service and configuration within authorization |

This prevents unsupported conclusions. Preserve full dig output rather than only `+short`:

```bash
dig example.com A
```

This retains more query context. In contrast:

```bash
dig +short example.com A
```

is useful for a quick answer but omits status, flags and endpoint details. It is insufficient on its own as a complete investigation record.

# Chapter 8 | ANY is not “everything”; AXFR does a different job

## 8.1 What is ANY?

You know that `dig example.com A` asks for A records and `dig example.com MX` asks for MX. ANY is a DNS query type, but modern servers need not return all records even for the queried name. It does not enumerate every subdomain in a domain. Ask explicitly for MX when you need MX, and NS when you need NS; ANY does not mean “give me every DNS record in this company.”

## 8.2 What is AXFR?

AXFR is Full Zone Transfer, distinct from an ordinary lookup. Suppose a company has a primary authoritative DNS server maintaining zone data and a secondary needing a copy. An authorized transfer can synchronize them:

```text
Primary DNS: example.test zone
  www A; mail A; example MX; example NS; ...
  ↓ AXFR over TCP
Secondary DNS: stores a zone-data copy
```

This is an ordinary DNS administration function specified by [RFC 5936](https://www.rfc-editor.org/rfc/rfc5936.html).

## 8.3 Why can AXFR create a security risk?

If only the secondary should receive a copy, but configuration also allows untrusted external sources to obtain data that was not intended to be released wholesale, it may expose host naming patterns, mail hostnames, other service records and infrastructure/environment clues. That helps an attacker understand the network.

Two judgments matter. Successful AXFR is not automatically a vulnerability: an authorized secondary may legitimately obtain the data. Also, the transfer covers one zone, not necessarily every organizational domain, delegated child zone or DNS view. Assess the requester's source, authorization policy and data scope alongside success or failure.

## 8.4 ANY versus AXFR

| Item | ANY | AXFR |
|---|---|---|
| Type | DNS query type | Zone transfer |
| Purpose | Ask for record sets at a name | Obtain a zone-data copy |
| Lists every subdomain? | No | Only relevant data in the transferred zone |
| Guaranteed all records? | No | A complete transfer should contain the data to be transferred for that zone |
| Security focus | Query information and response policy | Authorization, data exposure and integrity |

# Chapter 9 | Cache, DNSSEC and encrypted transport protect different things

Cache, DNSSEC and DoH address different problems. Read the comparison before treating one as a substitute for another.

[[figure:security]]

## 9.1 DNS cache: speed up lookups

Like a reception desk's frequently used contact list, a cache avoids repeatedly asking headquarters for the same number. If a shared resolver caches `www.example.com`, this does not establish that a particular employee visited that site. Queries can come from other users, background services, automation or resolver prefetching. A DNS lookup itself does not establish that a website visit completed. DNS cache is not a particular user's browsing history.

## 9.2 DNSSEC: authenticate DNS data and detect modification

DNSSEC means Domain Name System Security Extensions. It provides data-origin authentication and data integrity: verify whether data comes from the proper DNS authority and has been altered. It uses digital signatures and a chain of trust:

```text
Authoritative DNS supplies signed data
  ↓ Validating resolver checks signatures and trust chain
  ↓ Decide whether to accept the data
```

DNSSEC does not automatically encrypt query contents or establish website safety. [RFC 4033](https://www.rfc-editor.org/rfc/rfc4033.html) defines authentication and integrity rather than confidentiality as the core protection.

### Does dig +dnssec complete validation?

No. For example:

```bash
dig +dnssec example.com A
```

principally requests DNSSEC-related data; it does not mean dig has validated the complete trust chain. Learn BIND's `delv` or use a DNSSEC-validating resolver when validation is required. [BIND 9 documentation](https://bind9.readthedocs.io/en/stable/manpages.html)

## 9.3 DNS over HTTPS: protect query transport

DoH means DNS over HTTPS. Conventional unencrypted DNS sends a question without that transport encryption. DoH carries DNS messages over HTTPS between a client and a DoH service:

```text
Your computer
  ↓ HTTPS encryption
DoH resolver
  ↓ Processes the query according to configuration
DNS system
```

It provides confidentiality and integrity for that transport link. The resolver still processes and can learn the queries; encryption does not establish correct DNS data or website safety, nor guarantee identical encryption on every subsequent resolution link.

## 9.4 Three mechanisms compared

| Mechanism | Main purpose | Does not directly guarantee |
|---|---|---|
| Cache | Reduce repeated resolution and improve efficiency | Fresh data or a healthy host |
| DNSSEC | Authenticate DNS data and integrity | Query confidentiality or website safety |
| DoH / DoT | Protect a particular DNS transport link | Trustworthy DNS data itself |

Cache concerns efficiency; DNSSEC concerns data authentication; DoH/DoT concern transport protection. They complement each other rather than replace one another.

# Chapter 10 | Defend DNS by limiting unnecessary exposure

A security administrator finding publicly queryable records should not simply block DNS: public services need necessary DNS data so users can find them. Decide which data should be public, which functions need restrictions, and which sources may use those functions.

## 10.1 Review unnecessary public records

```text
old-vpn.example.test
old-dev.example.test
test-admin.example.test
```

If these names no longer serve a purpose, review whether they should remain. Pay particular attention to records still pointing at former third-party services. Dangling DNS can create a subdomain-takeover risk, but an inactive CNAME alone does not establish exploitability: check whether someone else can claim the corresponding resource name at the provider.

## 10.2 Restrict AXFR

AXFR synchronizes data for authorized DNS servers. Specify allowed transfer sources, prevent unnecessary copies reaching untrusted parties, use authentication such as TSIG where appropriate, and retain logs to check actual enforcement. TSIG, Transaction Signature, uses shared keys to authenticate DNS messages and protect integrity. It does not encrypt zone contents.

## 10.3 Restrict recursion

Public authoritative DNS answers officially for its zones; recursive DNS finds data about other domains on behalf of clients. These functions need not be available to the same audience:

```text
Company public authoritative DNS
  ├─ Answers necessary authoritative records externally
  └─ Does not recurse for arbitrary external clients
```

A server offering recursion to anyone on the Internet is an open resolver. Without suitable protections it may be abused, including in DNS reflection/amplification attacks. Design access controls for authoritative queries and recursion separately.

## 10.4 Why do different people receive different IP addresses?

```text
User in Taiwan: www.example.com → IP A
User in the US: www.example.com → IP B
```

This does not necessarily imply an attack. CDN geographic steering, GeoDNS, split DNS views, different cache ages and different resolver strategies can explain it. Record query conditions when investigating.

### Suggested DNS investigation record

| Field | Record |
|---|---|
| Query time | Date, time and timezone |
| Query source | IP, network location and authorized scope |
| DNS endpoint | Queried resolver or authoritative server |
| Query Name | Domain name queried |
| Query Type | A, AAAA, MX, etc. |
| Status | NOERROR, NXDOMAIN, etc. |
| Flags | qr, rd, ra, aa, etc. |
| Answer | Complete response |
| TTL | Returned cache lifetime |
| Conclusion | Judgment supported by these data |
| Limitations | What remains unverified |

For a formal assessment, original output is more useful than a conclusion alone.

# Chapter 11 | Keep this line of reasoning

## Six questions for DNS enumeration

For every DNS result, ask:

1. Which DNS server did I ask? For example, `1.1.1.1`.
2. Which name did I ask about? For example, `www.example.com`.
3. Which record type did I request? For example, `A`.
4. What response status did it return? For example, `NOERROR`.
5. What data did it actually return? For example, one IPv4 record.
6. What do these data still not establish? Host availability, working web service, certificate validity and access authorization remain separate.

These questions connect tool output to defensible security judgments.

# Part 12 | Concept questions and integrated practice

The following are teaching FAQs, followed by a practice scenario. They are separate from actual learner discussion.

## Q1: DNS enumeration versus port scanning

DNS enumeration queries names, addresses and service configuration. Port scanning observes network-port responses within authorization:

```text
DNS enumeration: www.example.com → 192.0.2.10
Port scanning:   192.0.2.10:443 → observe TCP response
```

They are connected tasks that answer different questions.

## Q2: Is querying DNS passive reconnaissance?

Not always. Reading public data already collected by a third party may be passive. Sending a DNS query interacts with a service. Public data does not make every DNS enumeration passive, nor grant permission to perform further security tests on related hosts.

## Q3: Can DNS data establish a vulnerability?

Usually not by itself. DNS reveals configuration clues. A CNAME pointing to an abandoned external service merits investigation, but assessing exploitable takeover requires evidence about resource registration and ownership controls at that service.

## Integrated Ubuntu exercise

On your own Ubuntu system, run these basic queries:

```bash
# 1. Inspect current DNS configuration
resolvectl status

# 2. Query the example domain's IPv4
dig example.com A

# 3. Query IPv6
dig example.com AAAA

# 4. Query incoming-mail settings
dig example.com MX

# 5. Query authoritative servers
dig example.com NS

# 6. Select a public recursive resolver
dig @1.1.1.1 example.com A

# 7. Use TCP for an ordinary DNS query
dig +tcp example.com A

# 8. Use short output
dig +short example.com A
```

`example.com` is an IANA-reserved example domain. These commands generate real DNS queries, without port scanning or AXFR. Compare addresses and TTLs across endpoints, full versus short output, UDP versus TCP results, and how the SERVER field changes when a resolver is selected. The goal is to describe the meaning and limitations of every reply, rather than find the most IP addresses.

# Course reference summary

1. DNS is a data lookup system; an IP answer does not establish website health.
2. Distinguish recursive and authoritative roles and A, AAAA, MX, NS and other types.
3. Interpret NOERROR, NXDOMAIN, SERVFAIL, REFUSED and timeout separately.
4. ANY and AXFR are different; zone transfers need authorization and access control.
5. DNSSEC, DoH and cache address data authentication, transport protection and efficiency respectively.

Tool observations do not establish every unverified conclusion. Apply the same evidence discipline to FTP, SMTP, SMB, SNMP and LDAP enumeration.

## Understanding check | A workplace scenario

Suppose an authorized company DNS review produces the following synthetic results:

```text
# Query 1
www.lab.example.test
A → 192.0.2.10
A → 192.0.2.11

# Query 2
www.lab.example.test
AAAA → NOERROR
ANSWER: 0

# Query 3
lab.example.test
MX → 10 mail.lab.example.test

# Query 4
lab.example.test
AXFR → REFUSED
```

Question 1: Do two IPv4 addresses establish two healthy website servers? Why?

Question 2: What can NOERROR and an empty ANSWER establish, and what information is missing?

Question 3: Does MX establish a healthy mail service? How would you plan further verification within authorization?

Question 4: Does REFUSED for AXFR establish secure DNS configuration? What else should an administrator inspect?

Use the response status, returned data and remaining verification steps to explain each answer, connecting your reasoning to M03 scanning and M04 enumeration.
