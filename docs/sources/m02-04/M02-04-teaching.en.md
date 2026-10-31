# M02-04 | DNS, WHOIS / RDAP Footprinting: Connect Service Addresses with Registration Roles

## 1 | The main idea: Separate finding a service from registering a domain

Today we study one complete concept: using DNS and domain registration data to build a verifiable external picture, and using role-specific evidence to verify service locations and operational ownership.

DNS, the Domain Name System, works like a telephone directory combined with a layered system for asking directions. It answers, “What service records exist for this name?” WHOIS, the traditional registration-data query protocol, and RDAP, the Registration Data Access Protocol, are closer to looking up registration records. They answer, “What information does the registration system hold about this domain?” Footprinting means organizing these clues into a clearly scoped picture with sources and timestamps.

Think of a coffee shop. Its delivery telephone number, mail-receiving address, and the person named on its lease may all differ. Domains are similar: the website, email service, DNS hosting provider, registrar, and actual operator can involve different roles. The important skill is knowing which question each field answers—and what evidence supports further verification.

## 2 | The DNS lookup journey: Who asks for you, and who can answer authoritatively?

Suppose you want to open www.coffee.example in our fictional scenario. Your device normally asks a recursive resolver first. This service finds answers for you and may also keep previous answers. If its cache already contains a usable answer, it can reply without starting the search again.

When a lookup is needed, the resolver can follow referrals through the DNS hierarchy. Root name servers provide delegation information for top-level domains. A Top-Level Domain, or TLD, server then points toward the domain's authoritative name servers. An authoritative server supplies records for the zone it serves. The actual path depends on available cache entries and known delegation information.

“Recursive” means completing the lookup on your behalf. “Authoritative” means supplying authoritative data for a zone the server manages. A DNS zone is a portion of the namespace managed by particular authoritative servers. Its management boundary follows delegation; a subdomain can be delegated separately. See [RFC 1034](https://www.rfc-editor.org/rfc/rfc1034) for these roles and delegation concepts.

A cache resembles a copied telephone directory that remains usable temporarily. TTL, or Time to Live, tells a cache how long it may retain a record. To assess when a change becomes visible across locations, examine each resolver’s cache and query conditions. The TTL you observe may also be the remaining lifetime. Different resolvers, query times, or network locations can produce different results.

![Diagram](figures/01-dns-journey.en.svg)

## 3 | Reading records: Each type answers its own question

A resource record is a unit of data in DNS. Each record describes a particular mapping; administration or contractual evidence helps verify asset ownership.

| Type | Plain-language purpose | Interpretation and verification |
| --- | --- | --- |
| A | Maps a name to an IPv4 address | May identify shared hosting, a proxy entry, or an origin; check the service architecture |
| AAAA | Maps a name to an IPv6 address | Query separately from A to cover both IPv4 and IPv6 service configurations |
| CNAME | Makes one name an alias for another name | Shows a service dependency; verify server ownership with asset records |
| MX | Identifies mail exchange hosts to which mail should be sent | Describes incoming-mail routing; check message-specific evidence for sending sources |
| NS | Identifies name servers serving a zone | Often identifies DNS hosting; verify the holder using registration roles and administration records |
| SOA | Provides zone administration information and timing parameters | Its serial tracks zone versions; interpret its format using the administrator’s numbering scheme |
| TXT | Holds text used for purposes such as verification or policy | Use the relevant specification to identify public verification, policy, and other purposes |
| PTR | Commonly supports reverse lookup, from an address to a name | Provides a reverse-name clue; verify forward mappings and ownership separately |

For MX records, a lower preference number is tried first; the number expresses attempt order. TXT records may contain SPF, the Sender Policy Framework used to express sending-source policy, or domain-verification strings. Interpret the string and its specification to distinguish sending policies, verification, and other purposes. See [RFC 1035](https://www.rfc-editor.org/rfc/rfc1035) for basic record formats and most of the types above, and [RFC 3596](https://www.rfc-editor.org/rfc/rfc3596) for IPv6 AAAA records.

![Diagram](figures/02-record-roles.en.svg)

## 4 | WHOIS and RDAP: Identify three registration-system roles

A registrant is the holder role in a domain registration relationship. A registrar provides domain registration services. A registry maintains registration information for a top-level domain. These are distinct roles. Even when a platform offers several services, interpret each field according to its stated role.

Traditional WHOIS uses TCP (Transmission Control Protocol) port 43. A port is a service endpoint, like a receiving window for that service. Its responses are often text, with formatting and available fields varying by service. It follows a traditional text-exchange design; applications requiring strong access control and confidentiality should use a protocol providing those security services. [RFC 3912](https://www.rfc-editor.org/rfc/rfc3912)

RDAP security requirements mandate support for HTTPS, which carries HTTP (Hypertext Transfer Protocol, a commonly used set of rules for web transfers) data over an encrypted connection. Encryption protects transport; role-specific fields and administration evidence establish the website’s operational ownership. [RFC 7481](https://www.rfc-editor.org/rfc/rfc7481)

RDAP uses standardized queries and structured responses, making fields easier for people and software to identify. JSON, or JavaScript Object Notation, organizes field names and values for software processing or interface presentation. An RDAP response may include names, status, events, entities and their roles, name servers, notices, and links. Read roles and event types together with their values. [RFC 9083](https://www.rfc-editor.org/rfc/rfc9083)

For example, before interpreting a date, check whether its event is registration, update, or expiration. Interpret each date according to that event. Release records can establish a website redesign date, while company registration records establish incorporation dates. The registrar field identifies the registration-service role; administration evidence helps establish the website operator. For fields redacted or omitted for privacy, record “public field unavailable” and identify lawful sources for verifying the holder.

At the time of this lesson's check, ICANN describes RDAP as the principal replacement protocol for registration data. Since January 28, 2025, generic top-level domain registries and registrars generally have no obligation to provide WHOIS, but the page lists exceptions for .com, .name, and .post. Individual WHOIS services may continue operating. Check country-code top-level domains under their respective rules. [ICANN's RDAP explanation](https://www.icann.org/rdap)

![Diagram](figures/03-registration.en.svg)

## 5 | Connecting the clues: An external picture of a fictional coffee shop

The following invented teaching data uses .example names and a documentation IP address. This exercise consists of interpreting the supplied data; practical work belongs in a legally authorized, isolated environment.

| Invented observation | Fact you may record | Evidence for further verification |
| --- | --- | --- |
| The CNAME for www.coffee.example points to edge.vendor.example | This website name aliases another name | Check service configuration for the origin location and written scope for each authorized target |
| A subsequent A response for the alias is 192.0.2.10 | This lookup returned that IPv4 address | Verify address users, network location, and vulnerabilities using asset records and authorized validation |
| The MX for coffee.example is 10 mail.vendor.example | Incoming-mail routing points to that mail host | Review account administration and message-specific transport evidence under their own purpose and authorization |
| RDAP identifies an example registrar in the registrar role | The registration data assigns that registrar role | Use the relevant administration or registration evidence to verify the shop owner and website operator |
| A query at another time returns a different IP | Results differ; preserve both timestamps and query conditions | Compare cache conditions, change records, service configuration, and security logs to explain the difference |

A Content Delivery Network, or CDN, or a reverse proxy—a front-end service receiving requests on behalf of a back end—can provide a public entry point for a back end. Service architecture determines the origin location. Several websites commonly share one entry-point IP and may have independent operators. Record an “observed dependency or mapping,” then verify ownership with asset or contractual records.

## 6 | Response states, differences, and query interactions

NXDOMAIN is the response status stating that the queried name does not exist. When a name exists but the requested record type has no data, interpret the corresponding response. A timeout means the waiting period ended before an answer arrived; examine the network, server, restrictions, and configuration for causes. Preserve the response status, query name, and query type so readers can reconstruct the conditions. Negative DNS responses may also be cached. [RFC 2308](https://www.rfc-editor.org/rfc/rfc2308)

Different results may reflect caching, the timing of changes, geographic or load-based routing, or different DNS views. Split DNS provides different answers to internal and external networks. Check external and internal assets from their respective authorized viewpoints. A tampering assessment additionally requires configuration changes, administrator authorization, and security records.

Looking at historical DNS data already held by a third party is a different interaction from querying a resolver or authoritative server directly. An ordinary DNS query still generates network traffic. Asking a recursive resolver can indirectly cause it to query an authoritative server. Whether an activity counts as passive collection depends on the course definition and written testing rules. Use the written authorization to specify targets, query frequency, and methods.

This unit focuses on interpreting a small number of clearly scoped records. Use the earlier M04 material on DNS Enumeration—systematically discovering DNS information—as a brief review: a single query provides evidence for that record at that time. A comprehensive enumeration requires its own scope and methods. Confirm the applicable authorization and rules before large-scale name guessing, zone-transfer tests, or further probing. This lesson focuses on interpreting the supplied synthetic records.

## 7 | Protection and evidence: Give public information and management access their proper roles

DNS needs to publish some service information. The defensive goal is to keep public information appropriate, management access secure, and the services themselves protected by access controls.

Practical measures include regularly reviewing public records, removing unused records and service dependencies, keeping internal naming and sensitive information out of public zones, protecting registrar and DNS administration accounts, and enabling suitable multifactor authentication and change monitoring. If a CNAME points to a discontinued external service, verify the service's actual state and the conditions required for takeover before addressing the record. Describe the actual risk using the verified service state and takeover prerequisites.

DNSSEC, Domain Name System Security Extensions, lets a validating party check DNS data's origin authenticity and integrity. Its role is authenticity and integrity validation; DNS data remains readable. Transport confidentiality uses a separate encryption mechanism. Website content security, availability, and operator trust each require their corresponding controls and evidence. [RFC 4033](https://www.rfc-editor.org/rfc/rfc4033)

| Evidence field | What to retain |
| --- | --- |
| Scope and source | Authorized name, query service or database, and whether the data came from a direct query or historical records |
| Time and conditions | Date, time zone, resolver, network viewpoint, query name, and record type |
| Original result | Response status, record values, and TTL; retain only necessary data |
| Interpretation | Observed facts, possible explanations, and ownership that remains unverified |
| Defensive validation | Authorized before-and-after comparisons, administration records, and remaining uncertainties |

For example, “the old CNAME was removed” needs support from the configuration change and appropriate checks. If a cache still returns the old value immediately after a change, examine timing, TTL, and the query source then verify effectiveness against the cache lifetime and authoritative data.

![Diagram](figures/04-evidence-boundary.en.svg)

## 8 | Small check: One scenario, four interpretations

In an authorized fictional exercise, you observe that www.coffee.example points to a CDN name. An A response returns 192.0.2.10. RDAP provides registrar information but does not publicly disclose the holder field. A colleague's DNS query times out.

Try answering in your own words: ① What clue does 192.0.2.10 provide, and what further evidence verifies the origin and ownership? ② What role does the registrar perform, and how can you verify the website operator? ③ What state does a timeout describe, and how should you record it and investigate causes? ④ What query conditions must you add so someone else can recheck your report?

Complete this understanding check using the synthetic data on this page. Explaining your reasoning helps you assess how well you understand each field.

## 9 | Takeaway and sources

In one sentence: DNS describes how names connect to services, while WHOIS and RDAP describe roles in registration data. Both require sources, timestamps, and applicable conditions before they become reliable asset clues.

The next unit is M02-05 Email Footprinting, connecting email clues with delivery paths and verifiable information. This unit completes the connection between DNS and registration data.

Primary references: [DNS concepts, RFC 1034](https://www.rfc-editor.org/rfc/rfc1034), [DNS records, RFC 1035](https://www.rfc-editor.org/rfc/rfc1035), [IPv6 DNS, RFC 3596](https://www.rfc-editor.org/rfc/rfc3596), [Negative caching, RFC 2308](https://www.rfc-editor.org/rfc/rfc2308), [RDAP JSON, RFC 9083](https://www.rfc-editor.org/rfc/rfc9083), [ICANN RDAP](https://www.icann.org/rdap), and [DNSSEC, RFC 4033](https://www.rfc-editor.org/rfc/rfc4033).
