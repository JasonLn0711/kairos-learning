# M05-03 | Vulnerability classification and assessment types: a complete plain-language lesson

The central idea of this lesson is that “where a system has a problem,” “where and how to examine it,” and “whether evidence confirms the problem” are three different questions.

Think of vulnerability assessment as a medical checkup. A doctor cannot look only for fever and declare a patient completely healthy. Similarly, a security engineer cannot run one vulnerability scan and declare a system free of security problems.

## 1. What is a vulnerability?

Imagine that you operate a bank with a vault, cameras, guards, access-control equipment and employees. A security problem might arise from five different causes.

{{figure:causes}}

All five problems could allow an unauthorized person into the vault, but they need different fixes. This is why we classify vulnerabilities.

The purpose is to identify the actual cause and decide who should correct it, rather than memorize five English terms. Categories can overlap: missing software updates may also indicate a failed maintenance process.

## 2. Assessment types: what are we examining?

Now replace the bank with a company information system. It may contain servers, networks, websites, databases, Wi-Fi and cloud storage at the same time. Different parts need different examination methods.

{{figure:targets}}

Conceptual illustration: one system can be assessed at multiple levels; these examinations complement one another.

| Assessment type | Plain meaning | Main checks |
| --- | --- | --- |
| Host-based | Examine the computer itself | Operating system, updates, permissions, configuration |
| Network-based | Examine network entry points | Open ports, services, exposure |
| Application | Examine websites and programs | Login, authentication, authorization, program logic |
| Database | Examine the database | Accounts, data-access permissions, security configuration |
| Cloud / Wireless | Examine cloud and wireless environments | Cloud-resource permissions, Wi-Fi protection, network isolation |

For example, you scan a Web Server and find that its operating system has all current updates. Does that prove the website is secure? No: operating-system flaws and website-programming flaws are different things.

Even on a fully updated server, a developer could implement authorization incorrectly and allow user A to see user B’s data. No findings in a Host-based Assessment do not imply that an Application Assessment would also find nothing.

## 3. External and Internal: where do you examine from?

Imagine inspecting a company office building.

External Assessment means examining the main entrance, exterior walls and externally reachable equipment while standing outside the building.

Internal Assessment means entering with authorization to examine internal access controls, separation between areas and permissions.

In security work, an external assessment may observe the company website, VPN or other Internet-facing services under authorized conditions. An internal assessment may start in a specified company network segment to examine access restrictions on internal servers and services.

The key inference is that failing to observe a database from outside means only that this external examination did not observe it. It does not show that the database does not exist or that it is secure.

Internal / External describes the testing position, rather than whether the examiner is a company employee.

## 4. Active and Passive: how do you examine?

This distinction is easy to confuse. Imagine trying to find out whether someone is inside a house.

{{figure:methods}}

In information systems:

- Active Scanning: a tool sends test requests to a target and uses responses to infer services, versions or possible vulnerabilities.
- Passive Assessment: examine existing network packets, logs or other observation data without obtaining responses through active probing.

Both have limits. Active methods may obtain more direct evidence, but may also add load or disrupt older services.

Passive methods usually add no probing-request load to the target. However, if relevant events never occur, are not recorded or fall outside the observation scope, the problem may remain completely invisible.

Passive observation can also involve sensitive data and still requires authorization.

## 5. Two other important classification pairs

### Authenticated / Unauthenticated: do you use an account?

Imagine inspecting a hotel. Unauthenticated is like a visitor without a room card, limited to the public lobby. Authenticated is like someone holding an approved card who can examine rooms and facilities within the permitted scope.

Authenticated scanning often provides more internal system information, such as installed packages and configuration. Having an account does not grant every permission.

### Automated / Manual: does a tool or a person examine it?

Automated methods resemble an automatic checkup machine: they suit large numbers of repetitive checks that can be expressed as rules.

Manual methods resemble a doctor’s consultation: they suit questions that require context, business logic and judgment about exceptions. In practice the two are usually combined.

## 6. These classifications describe different dimensions

This is an important integrating idea. Suppose a manager asks you to examine an internal Linux server and provides an approved scanning account. You might choose all of these labels together:

{{figure:dimensions}}

The five labels do not conflict because each answers a different question. Assessment types form a combinable examination strategy rather than a single-choice classification.

## 7. Does a scanner finding prove you can break in?

Suppose a company order system produces these findings.

| Finding | What is known now | What still needs confirmation |
| --- | --- | --- |
| A: An older package version | A known vulnerability may apply | Actual version, patch status, required vulnerability conditions |
| B: A folder permits anonymous reads | A setting may violate policy | Readable data, expected permissions, actual impact |
| C: Account A reads B’s order | A concrete cross-account access event | Whether it violates the intended authorization rules, affected scope |

Vulnerability assessment can be understood as accumulating evidence step by step:

{{figure:evidence}}

Keep these conclusions separate:

- Finding a possible vulnerability does not prove that it can be exploited.
- Proving an exploitable vulnerability exists does not prove that someone has already broken into the system.
- Fixing one vulnerability does not establish that the entire system is secure.

Severity is different from Priority. Severity concerns the potential harm; handling priority also considers exposure, asset importance, existing controls and remediation urgency.

For example, a misconfiguration that directly lets external visitors read sensitive data may need attention sooner than a highly scored vulnerability that triggers only under particular internal conditions.

## 8. Connect M05-01, M05-02 and M05-03

| Lesson | Core question |
| --- | --- |
| M05-01 Vulnerability assessment and penetration testing | Are we finding problems or going further to demonstrate actual impact? |
| M05-02 Asset inventory and assessment scope | Which assets exist, and which are authorized for this examination? |
| M05-03 Vulnerability classification and assessment types | Where might the problem originate, and which examination perspectives should we use? |

A professional vulnerability assessment takes more than opening a scanner, pressing Start and obtaining a report.

First establish assets and authorized scope. Then choose suitable assessment methods, identify causes, check evidence and propose remediation and verification methods.

## 9. Check your understanding with a scenario

1. A company website’s operating system is fully updated, but user A can read user B’s private orders. Which cause is most likely?

A. Misconfiguration

B. A design or implementation authorization flaw

C. An unpatched operating-system vulnerability

2. You use an authorized account and a tool to actively examine a Linux host from the internal network. Which classifications apply together?

A. External, Passive, Unauthenticated

B. Internal, Active, Authenticated, Automated

C. Internal, Passive, Unauthenticated

3. A scanner finds no known version vulnerabilities. Can you declare the system secure?

A. Yes; it means there are no vulnerabilities

B. No; configuration, permissions and application logic may still have problems

C. Yes, provided the scanner is up to date

{{answer}}

These three questions cover the core skills: identifying vulnerability causes, combining assessment methods and judging the limits of security evidence.

## 10. Sources and scope

[NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final) explains assessment planning, active probing, passive observation and the limits of different techniques. This lesson’s five causes are a teaching framework for assigning remediation, not an exhaustive or mutually exclusive standard taxonomy. The bank, hotel and order system are synthetic examples; no real systems were scanned.

The [FIRST CVSS v4.0 User Guide](https://www.first.org/cvss/user-guide) explains that severity scoring needs threat, environmental and organizational context. This lesson does not equate severity with handling priority. Answer the three questions yourself before opening the reference explanations; the page does not submit, store or grade personal answers.
