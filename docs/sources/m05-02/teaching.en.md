# M05-02 | Asset inventory and assessment scope: why can’t you scan every computer you find?

This lesson covers a foundation of security engineering and penetration testing.

Remember three ideas:

1. Asset Inventory: what does the company need to protect?
2. Assessment Scope: what have we been authorized to examine this time?
3. Rules of Engagement (ROE): even within scope, which actions are permitted and which are prohibited?

Knowing a system exists does not authorize testing it. Completing one assessment does not establish that the entire system is secure.

## 1. Understand it through a hospital health check

Imagine a hospital arranging health checks for 100 employees.

First, the hospital needs to know who the employees are. That is inventory.

Perhaps only 30 employees sign up for this round. That is scope.

Those 30 may consent to blood pressure measurements and blood tests, but not invasive examinations. Those are the engagement rules.

The hospital can report that 30 employees received the specified examinations. It cannot claim all 100 employees are healthy.

Security assessments follow the same reasoning.

{{figure:inventory}}

The analogy highlights three distinct quantities: total assets, authorized assets and assets actually assessed.

## 2. Asset Inventory: what are we taking inventory of?

Beginners sometimes think inventory means using Nmap to find the company's IP addresses.

That is one possible technique, not a complete inventory.

Imagine running an online shop. After a customer orders, the website must receive the order, check stock and process payment to support the business.

We can distinguish four asset categories:

| Asset category | Plain-language meaning | Examples |
| --- | --- | --- |
| Hardware and computing resources | Equipment that computes or connects | Servers, laptops, virtual machines |
| Software and services | Programs that perform work | Websites, APIs, database services |
| Data | The content that needs protection | Customer records, orders, password hashes |
| Identities and permissions | Who can use what | Administrators, service accounts, API tokens |

Why distinguish them so carefully?

You may have inventoried a server without knowing it holds 100,000 customer records. A compromise could cost far more than the machine itself.

An inventory therefore needs to cover software, data, accounts and dependencies as well as hardware.

In CIS Controls v8.1, Control 1 primarily addresses enterprise equipment assets, while Control 2 addresses software assets. Data and account management involve other controls as well.

### Why isn't an IP address a permanent identity?

Imagine a company parking space numbered 15.

Ming parks there on Monday and Hua on Tuesday. Occupying space 15 does not make them the same car.

IP addresses work similarly. DHCP can assign addresses dynamically: one computer may have different IP addresses, and one IP address may refer to different devices at different times.

An inventory should therefore also include a stable asset identifier, hostname, owner, environment and verification time. CIS Safeguard 1.1 calls for a detailed and updated enterprise asset inventory.

## 3. Assessment Scope: why can't you freely test the company's own database?

Consider a complete example.

You are hired to assess a company's online ordering system, which involves three services.

{{figure:scope}}

In website A, you find a setting containing database B's address.

What should you do?

Within the authorized examination of A, you can record that website A depends on database B.

Finding B's address does not permit you to start scanning B.

Three separate concepts matter:

| Concept | Meaning |
| --- | --- |
| Discovery | I know B exists |
| Ownership | I know who manages B |
| Authorization | I am permitted to perform specified tests on B |

Do not conflate these three facts.

Even if B belongs to the company, A's manager may lack authority to approve testing B. The original authorization does not automatically extend to B.

External payment service C is managed by a third party. Its consent and service terms usually need to be checked too.

## 4. ROE: permission to test does not permit every operation

Think of ROE as the rules governing the testing activity.

A teacher allowing students into a laboratory does not authorize them to operate every instrument or use every chemical.

Likewise, permission to review security settings does not permit password brute forcing, vulnerability exploitation or data modification.

Here is a simplified synthetic ROE:

| Item | Rule for this assessment |
| --- | --- |
| Target | Test website A |
| Environment | Test environment; production excluded |
| Permitted actions | Specified configuration checks and version verification |
| Prohibited actions | Unauthorized exploitation, deleting or changing data, denial-of-service testing |
| Time window | Working days, 10:00–12:00 |
| Account | Approved read-only account |
| Stop conditions | Out-of-scope target, accidental sensitive-data exposure, service anomaly |
| Incident handling | Stop the relevant activity and notify the responsible contact using the agreed procedure |

Stop conditions are especially important.

Suppose the website suddenly returns many errors or becomes unavailable during a specified check. Continuing to test while saying you are only trying to diagnose the problem is not an appropriate response.

Follow the ROE: pause the relevant activity, retain necessary nonsensitive evidence and notify the designated contact.

Appendix B of NIST SP 800-115 provides an ROE template covering objectives, scope, risks, participants, schedule and equipment. Published in 2008, it remains a process reference; actual projects also need to meet current contractual, legal and environmental requirements.

## 5. The security engineer's actual workflow

{{figure:workflow}}

This workflow also raises a management question: without an asset count and an agreed scope, how can you determine how complete the assessment was?

Suppose 10 hosts are authorized and only 8 are completed.

{{figure:coverage}}

This 80% is asset-assessment coverage, not a claim that the system is 80% secure.

Even 100% completion means only that all specified checks were completed. It does not exclude unknown vulnerabilities.

## 6. Common CEH concept traps

| Statement | Appropriate judgment |
| --- | --- |
| A scanner found a host | That does not establish authorization to test it |
| An IP address is in the company's subnet | This assessment does not necessarily cover it |
| A host did not respond | That does not establish that it does not exist |
| An asset name contains TEST | It may still contain real sensitive data |
| No vulnerabilities were found | That does not establish complete security |
| A website connects to a third-party API | That does not permit testing the third party |

These questions test professional judgment: what conclusions does the evidence support, and how far does the authorization let you go?

## 7. Understanding check: you are the security engineer

Suppose you are engaged to examine a hospital's AI imaging analysis test platform.

The hospital authorizes operating-system version and security-configuration checks on test host A.

During the examination, you discover that A connects to production imaging database B and that its login interface uses external identity service C.

Answer three questions:

Question 1: May you immediately run a vulnerability scan on database B? Why?

Question 2: How would you record B and C in the asset inventory and this assessment report?

Question 3: If you accidentally see real patient medical images, what should you do next?

{{answer}}

With this foundation, whether you use Nmap, Nessus, OpenVAS or another security tool, establish assets, authorization and engagement boundaries before planning technical checks.

## 8. Sources and verification

[CIS Control 1](https://www.cisecurity.org/controls/inventory-and-control-of-enterprise-assets) and [Safeguard 1.1](https://cas.docs.cisecurity.org/en/latest/source/Controls1/) support equipment inventory and maintenance; [Control 2](https://www.cisecurity.org/controls/inventory-and-control-of-software-assets) supports software inventory. Data protection and account management also involve Controls 3 and 5.

[NIST SP 800-115 (2008-09), Appendix B](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf) is an ROE process reference. All lesson scenarios and quantities are synthetic illustrations. Sources checked on 2026-11-08.
