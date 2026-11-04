# CEH M04-02 | DNS enumeration: finding names and addresses does not establish service availability

DNS Enumeration · Second lesson of the new route

The previous lesson separated finding an entry point, obtaining information and actually accessing a resource. Today, we apply the same principle to DNS: **What data did it return? What conclusions does that response support? What still cannot be inferred directly?**

Earlier DNS teaching material and observation records are preserved. This lesson rebuilds the fundamentals in the new sequence; earlier material is not treated as completion or successful assessment of the new lesson.

## 1. DNS resembles a directory, rather than a website health check

DNS stands for Domain Name System. People find names easier to remember, while software often needs an IP address to connect. DNS can provide that mapping, along with other information such as mail routing and authoritative name servers.

Suppose the company's website is named www.example.test, and a DNS query returns two IPv4 addresses for it.

This means that this particular DNS response supplied two address records. It does not establish that:

- Both addresses currently accept connections.
- The website's pages work, its certificate is correct, or its login function is available.
- The two addresses represent two physical hosts.
- All these addresses are company-owned origin servers rather than hosted services or CDN nodes.
- You have therefore obtained permission to perform other tests against those devices.

**DNS provides data associated with names; connectivity and application behavior require separate evidence.** This is the DNS application of M04-01's principle that knowing information does not establish access. [DNS concepts and operation](https://www.rfc-editor.org/rfc/rfc1034.html)

All commands and outputs in this lesson are synthetic teaching examples; none were run against real targets. example.test is a reserved test name, and 192.0.2.x is a documentation address range. These names and addresses illustrate a scenario, not public services that will produce these results when typed unchanged. For a separate practical exercise, substitute authorized, actually configured laboratory DNS addresses and test zones. [Reserved test names](https://www.rfc-editor.org/rfc/rfc2606.html), [documentation IPv4 addresses](https://www.rfc-editor.org/rfc/rfc5737.html)

## 2. The DNS server you ask does not necessarily maintain the answer

Separate three roles first:

1. **Client / stub resolver:** the part of your computer that submits name queries, usually passing questions to a configured resolver.
2. **Recursive resolver:** finds answers for clients, may answer directly from cache, or may forward the question to an upstream resolver.
3. **Authoritative name server:** is responsible for a DNS zone and supplies authoritative data for that zone.

Think of the recursive resolver as a service desk that looks up information for you, and the authoritative server as the department responsible for maintaining particular data. A service desk answering your question does not mean it manages that data itself.

In a typical public-DNS scenario with a cold cache, a resolver may obtain referrals from root name servers and then top-level-domain servers before reaching the authoritative server for the target zone. Cached data, forwarders and internal zones can make that complete path unnecessary. The .test zone in this lesson is a local practice zone; it is not actually following that path through public DNS.

Two other terms are easy to confuse:

- **Domain:** a portion of the DNS name tree.
- **Zone:** the data scope managed by a set of authoritative servers. A delegated subdomain may belong to a different zone.

Obtaining one zone's data therefore does not mean obtaining every domain and subdomain belonging to the company. [DNS roles and zone definitions](https://www.rfc-editor.org/rfc/rfc9499.html)

## 3. What does DNS enumeration ask? Start with common records

DNS data is usually represented as resource records (RRs). One name can have records of different types; asking for A and asking for MX are different questions.

Group the most common types into three categories:

**Find an address or another name:**

- A: an IPv4 address associated with a name.
- AAAA: an IPv6 address associated with a name. Not obtaining an AAAA answer does not automatically invalidate an A answer already obtained. [AAAA records](https://www.rfc-editor.org/rfc/rfc3596.html)
- CNAME: identifies a name as an alias for another name. It is a DNS name relationship, not an HTTP redirect received by a browser.
- PTR: commonly used in reverse lookups to obtain another name from a reverse-DNS name. Matching forward and reverse results does not establish authentication either.

**Find zone and mail configuration:**

- NS: names the authoritative name servers for a zone, not the recursive resolver currently used by your computer.
- SOA: zone-management information, including a serial number and timing parameters. The serial can support zone-version management; it is not host uptime.
- MX: a hostname and preference value for receiving a domain's mail. Lower numbers are preferred; the value is neither a traffic percentage nor a list of user mailboxes.
- TXT: text data, used for purposes such as service verification and mail policy. Seeing text does not establish that the policy is deployed correctly, and passwords should never be placed in public TXT records.

These records provide clues for different purposes; one DNS record does not establish that an entire service works. [Basic resource-record formats](https://www.rfc-editor.org/rfc/rfc1035.html)

**Find clues about service entry points:**

- SRV: can describe a service's target host, port, priority and weight. Directory services, for example, may use it to help locate servers. A service appearing in SRV does not establish current connectivity or permission to log in. [SRV records](https://www.rfc-editor.org/rfc/rfc2782.html)

Here, enumeration means organizing specific information such as names, addresses and service roles through queries. Sending a DNS query directly interacts with a resolution service; public records do not make every such query passive collection.

## 4. Understand one dig command first

dig is a DNS query tool. It is not a website speed test, and obtaining an IP does not mean it has tested HTTP, HTTPS or login permissions for you.

The following documentation address represents a DNS server in an authorized practice environment:

```text
dig @192.0.2.53 www.example.test A
```

Read its parts:

- dig: run the query tool.
- @192.0.2.53: send the DNS question to this server.
- www.example.test: the name to query.
- A: ask for IPv4 addresses in this query.

Without @server, dig normally selects a server using the system's resolver configuration. Two people entering the same name are therefore not guaranteed to query the same resolver or obtain the same cached data.

Conventional DNS uses both **UDP 53 and TCP 53**. TCP also carries ordinary queries; it is not reserved exclusively for zone transfers. Large responses and other circumstances may require TCP, so blocking all TCP 53 is not necessarily the right defense. [Official dig usage](https://bind9.readthedocs.io/en/stable/manpages.html#dig-dns-lookup-utility), [DNS over TCP](https://www.rfc-editor.org/rfc/rfc7766.html)

## 5. Read a response: separate the answer from the answering server

This synthetic output omits fields such as version and query time that are not central to this section:

```text
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 40202
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;www.example.test.        IN A

;; ANSWER SECTION:
www.example.test.  300    IN A 192.0.2.10
www.example.test.  300    IN A 192.0.2.11

;; SERVER: 192.0.2.53#53(192.0.2.53) (UDP)
```

Focus on five things first:

**1. What did I ask?**

QUESTION identifies the name and type. This query asks for A records for www.example.test, not every record or every subordinate name in the domain.

**2. What did it return?**

ANSWER contains two A records, with data 192.0.2.10 and 192.0.2.11. IN is the Internet class. The trailing dot indicates an absolute name reaching the DNS root; it is not punctuation added to a URL.

**3. What is the response status?**

NOERROR means that this response's response code reports no DNS error. You must still check whether ANSWER contains the requested data; it does not mean the website is healthy.

**4. Who answered this query directly?**

SERVER identifies the DNS endpoint queried, 192.0.2.53, not a website address. The two addresses in ANSWER and the address in SERVER play different roles.

On Linux using systemd-resolved, SERVER: 127.0.0.53 usually identifies a local DNS stub. It does not mean the website is inside your computer, and this line alone does not identify the upstream server ultimately used. [Official systemd-resolved documentation](https://www.freedesktop.org/software/systemd/man/latest/systemd-resolved.service.html)

**5. What do the flags and other sections tell me?**

- qr: this is a response.
- rd: the query requested recursion.
- ra: the server declares recursion available. It does not prove which upstream servers this query actually used.
- aa: when present, the response declares itself authoritative; this flag is not cryptographic verification of authenticity.
- AUTHORITY and ADDITIONAL: may supply authority information, referrals or supporting data. Interpret them in the context of the whole response rather than always treating them as lists of website addresses.

Read these fields together, rather than only counting ANSWER records. [DNS messages and flags](https://www.rfc-editor.org/rfc/rfc1035.html)

300 is a TTL, measured in seconds. In a cached response, it may be the remaining cache lifetime, not 300 seconds of host uptime or a guarantee that everyone's DNS will become identical within 300 seconds. [DNS caching and TTL](https://www.rfc-editor.org/rfc/rfc1034.html)

## 6. No answer: distinguish at least five situations

Suppose you next query AAAA for the same name. An empty result is not enough to write that the domain does not exist.

**NOERROR, but no answer of the requested type:**

This may be what is commonly called a NODATA response, but you may also need to distinguish referrals and other situations. NODATA is not a separate dig status response code; it is a condition inferred from the response contents. A typical negative answer may include SOA in AUTHORITY.

**NXDOMAIN:**

Reports that the relevant name does not exist. If there is a CNAME chain, also identify whether the negative result concerns the original query name or the chain's endpoint. Do not broaden it into a claim about every domain belonging to the company.

**SERVFAIL:**

Resolution failed, for example because of upstream problems or failed DNSSEC validation. It does not prove that the name does not exist.

**REFUSED:**

The server refuses to process the request, possibly because of access policy. Refusal to answer does not mean the data does not exist.

**Timeout:**

No usable response arrived within the waiting period. Networking, filtering, the server or other causes may be involved; this is not a DNS response reporting nonexistence. [Negative answers and caching](https://www.rfc-editor.org/rfc/rfc2308.html), [DNS response codes](https://www.rfc-editor.org/rfc/rfc1035.html)

One modern detail helps avoid an incorrect rule: some DNSSEC compact-denial mechanisms represent nonexistent names with NOERROR and an empty ANSWER. Therefore, **NOERROR plus an empty ANSWER alone does not conclusively establish that a name exists.** You do not need to memorize this mechanism today; retain the complete response and the conditions behind your interpretation. [RFC 9824: compact denial of existence](https://www.rfc-editor.org/rfc/rfc9824.html)

## 7. Organize individual queries as clues, rather than recording guesses as facts

Using the documentation-address scenario above, queries for different types can be written as:

```text
dig @192.0.2.53 example.test NS
dig @192.0.2.53 example.test MX
dig @192.0.2.53 www.example.test AAAA
```

This is not a request to run them now or test a real company's domain for this lesson. Understanding the questions and evidence is enough for now.

If a synthetic MX answer is:

```text
example.test.  300 IN MX 10 mail.example.test.
```

You can record: “The response lists mail.example.test as a mail-receiving host with preference 10.”

You cannot directly record that the mail server currently works, permits arbitrary mail sending, reveals employee mailboxes, or must be company-operated. Those claims require other evidence. MX points to a hostname, and mail delivery requires subsequent resolution and connection steps. [SMTP rules for using MX](https://www.rfc-editor.org/rfc/rfc5321.html#section-5)

Similarly, names such as vpn, dev or admin are naming clues. They may be outdated, shared, used for testing, or point to hosted services. Do not assign a device's purpose from its name alone.

The +short option in dig is useful for concise results, but removes many fields needed for interpretation. Retaining a complete response during an investigation is more valuable than retaining only two IPs. [dig output options](https://bind9.readthedocs.io/en/stable/manpages.html#dig-dns-lookup-utility)

## 8. ANY does not mean everything; AXFR has a different purpose

**An ANY query is not a complete zone inventory.**

It is not a command to list all subdomains, and does not guarantee that every record for a name will be returned. Servers may use minimal-response strategies. Ask for the specific record type needed to answer your question. [Minimal responses to ANY](https://www.rfc-editor.org/rfc/rfc8482.html)

**AXFR is a zone transfer.**

Its normal purpose is to let authorized DNS servers obtain zone data and maintain replicas. AXFR uses TCP and has a different scope from an ordinary query for A or MX.

An untrusted source obtaining complete zone data that should be restricted may expose hostnames and configuration, and warrants policy review. Successful AXFR, however, does not automatically establish a vulnerability: an authorized secondary server synchronizing successfully is normal functionality.

Conversely, refused AXFR does not mean the zone has no records. Even obtaining a zone does not guarantee coverage of delegated child zones, other DNS views or every name in an organization.

This lesson introduces the purpose and risk without attempting transfers against real servers. Before practical work, separately confirm that the target, source and zone transfer are within the authorized scope. [AXFR specification](https://www.rfc-editor.org/rfc/rfc5936.html)

## 9. Three security ideas: caching, DNSSEC and encrypted transport address different concerns

**A cache is not an individual's browsing history.**

Many people or systems may share a resolver, and other queries and service mechanisms can affect its cache. Even evidence that a record was cached does not directly establish that a particular person visited a website, much less their intent. [DNS caching and resolver roles](https://www.rfc-editor.org/rfc/rfc9499.html)

**DNSSEC primarily provides data-origin authentication and integrity, rather than hiding content.**

Successful validation can increase trust in DNS data, but does not establish website-content safety or service availability. Adding +dnssec to dig mainly requests relevant DNSSEC data; it does not mean the tool has validated the complete chain of trust for you. [DNSSEC security goals](https://www.rfc-editor.org/rfc/rfc4033.html), [dig and validation tools](https://bind9.readthedocs.io/en/stable/manpages.html#dig-dns-lookup-utility)

**Encrypted DNS transport protects a particular connection.**

For example, DNS over HTTPS (DoH) can protect transport between a client and a DoH service, but the chosen resolution service still needs to process queries. It does not mean that nobody knows what you queried, and does not replace DNSSEC data validation. [DoH privacy considerations](https://www.rfc-editor.org/rfc/rfc8484.html#section-8)

## 10. Defense limits unnecessary exposure rather than making DNS never answer

Public websites need others to obtain necessary DNS data. Defense focuses on clear boundaries between different purposes:

1. **Review public record contents.** Remove obsolete or unnecessary entries, and keep passwords, keys and nonpublic internal information out of records.
2. **Restrict zone transfers.** Permit only the peers that need to synchronize according to the architecture, with appropriate authentication such as TSIG. TSIG supplies message authentication and integrity; it does not encrypt zone contents. [TSIG specification](https://www.rfc-editor.org/rfc/rfc8945.html)
3. **Limit who may use recursive and cache-query services.** Public authoritative answers and recursive resolution for arbitrary external sources are different functions. Opening one does not mean the other must also be open.
4. **Retain verifiable logs and configuration.** Within the authorized scope, confirm query sources, reasons for refusal, unusual frequency and actual policy, rather than declaring security or insecurity from one result. [BIND access controls for queries, recursion and transfers](https://bind9.readthedocs.io/en/stable/reference.html)

CDNs, split DNS with different views for different sources, and caching can produce different answers at different locations and times. Record the conditions first rather than immediately concluding that one side is under attack.

An observation record can be simple:

```text
Query time and time zone:
Query source / authorized scope:
DNS server used:
Query name and record type:
Response code, flags and relevant sections:
Answers and TTL:
Conclusions supported by this response:
Things that still require separate verification:
```

Preserve the original response and separate observations from inferences. If the task requires website-availability verification, separately test connectivity, TLS or HTTP within the authorization; do not attribute those results to DNS evidence.

## 11. Remember this line of reasoning today

**Which DNS endpoint did I ask, about which name and record type? What did it return, and what do those data still fail to establish?**

You do not need to memorize every record type today. Start by distinguishing A, AAAA, MX and NS; read QUESTION, ANSWER and SERVER; and avoid overinterpreting NOERROR, empty answers or two IPs. That captures this lesson's central idea.

The next lesson moves to FTP / SMTP enumeration, continuing to distinguish information a service will return from actions you are permitted to perform.

**One final small check:**

In the same synthetic scenario, an A query returns two IPv4 addresses. An AAAA query shows NOERROR and ANSWER 0, but the other sections were not retained. Someone concludes: “This proves that the website works and definitively has no IPv6.”

How would you correct that conclusion in one or two sentences?
