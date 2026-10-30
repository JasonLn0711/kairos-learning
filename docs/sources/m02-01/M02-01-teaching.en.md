# CEH M02-01 | Passive and Active Reconnaissance: Are You Reading Records or Interacting with the Target?

## 1. Start with the conclusion

**To distinguish passive from active reconnaissance, ask whether information gathering directly interacts with the target system—not whether you typed something or opened a tool.** Passive does not mean no network traffic anywhere. Active does not mean a system has already been compromised. Neither removes the need for authorization, privacy protection, or evidence checks.

Imagine researching a coffee shop. Reading a menu and reviews already stored on a third-party platform differs from calling an employee to ask which beans are available today. Both provide information, but the second sends an inquiry to the shop. Security reconnaissance has the same distinction: reading existing clues versus asking a system directly.

This lesson uses synthetic scenarios and paper-based reasoning only. It does not test real third-party websites, accounts, or hosts.

## 2. Knowledge map: What is reconnaissance, and how does it connect?

**Reconnaissance** gathers information about a target to support later decisions: its websites, technologies, or people responsible for a business function. Defenders can use it to inventory externally visible information. An attacker might use the same material to plan fraud or intrusion. MITRE's reconnaissance category includes both active and passive information gathering. [Source: MITRE Reconnaissance](https://attack.mitre.org/tactics/TA0043/)

**Footprinting** can be understood as assembling scattered clues into a profile of a target. One piece of information does not establish how an entire organization operates.

**OSINT, Open-Source Intelligence**, turns publicly available material into useful intelligence through collection, comparison, and analysis. Here, “open-source” means public sources, not just open-source software. Public records are raw material: their dates, authenticity, and scope still require assessment.

| Question | What to examine in this lesson |
| --- | --- |
| What do I want to know? | Define a purpose; do not collect personal information without limits |
| Where is the information? | Existing third-party records or the target's own systems |
| Where does my action go? | Follow actual data flow, not just the tool's name |
| What does this observation establish? | Separate observation, inference, and unanswered questions |
| May I continue? | Check written authorization, scope, and stopping conditions |

M09 social engineering explains how knowledge of job titles, events, and business relationships can make impersonation more convincing. This chapter asks where those background clues come from. M01's authorization principles remain the boundary throughout. M02-02 examines source reliability in more detail; M03 addresses scanning. This lesson first establishes a classification method.

## 3. Passive versus active is not a safe-versus-dangerous binary

**Passive reconnaissance** does not send investigative requests directly to the target system, relative to the target under discussion. It mainly reads information that third parties already hold, such as indexed search snippets or historical records saved on a third-party site.

**Active reconnaissance** directly interacts with the target system to obtain information. In an authorized lab network, for example, a request can ask a host which services respond. A **probe** is a deliberate inquiry—like knocking on a door to learn from the response. It does not mean someone has entered the room. MITRE's Active Scanning technique explicitly describes network probes sent to target infrastructure. [Source: MITRE Active Scanning](https://attack.mitre.org/techniques/T1595/)

| Dimension | Passive reconnaissance | Active reconnaissance |
| --- | --- | --- |
| Interaction | Mainly existing third-party information | Direct contact with target systems |
| Freshness | May be outdated or incomplete | Closer to the time of inquiry, but still limited |
| Target visibility | Usually harder for the target to observe the inquiry directly | The target or its hosting provider may record it |
| Risks | Privacy, incorrect sources, and overinterpretation | Also system load, alerts, and out-of-scope activity |
| Guaranteed invisibility? | No; third parties may log queries | No; avoiding records should not be the objective |
| Direct proof of a vulnerability? | No | A response alone is not proof either |

**This lesson uses direct interaction with the target as its operational definition.** Other teaching materials may call browsing a public website passive, semi-passive, or low-interaction reconnaissance. A practical report should describe the action rather than rely only on a label: did you read a search snippet, or send an HTTP request to the website? **HTTP, Hypertext Transfer Protocol**, is a protocol commonly used by browsers and websites to exchange web content.

## 4. Three boundaries that are easy to misclassify

### Boundary one: Reading search results is not the same as opening the target website

When you read a snippet already stored by a search platform, your request primarily goes to that platform. Once you open the target's website, the browser requests content from the site or its hosting service. That is direct interaction. The service may record the time, source address, requested path, and other details. **Ordinary browsing is not vulnerability scanning or evidence of malicious intent. Nevertheless, low impact is not the same as zero interaction.** A page may also load images, analytics services, or other external resources, so there may be more than one request.

### Boundary two: A DNS tool's name does not determine the classification

**DNS, the Domain Name System**, associates names with network-service information. A **resolver** performs lookups for you. A **cache** temporarily stores answers. An **authoritative name server** provides authoritative DNS data for a particular zone.

A resolver with a valid cached answer may reply immediately. Without an answer, it may query other DNS servers and eventually contact the domain's authoritative service. Therefore, “I only asked a third-party resolver” does not guarantee that no target-related service receives a query. This is a simplified model: forwarding, delegation, and caching policies also affect the path. [Source: RFC 1034, DNS concepts, caching, and recursive queries](https://www.rfc-editor.org/rfc/rfc1034.html)

### Boundary three: Public availability is not unrestricted permission

A public job advertisement may mention a technology. Reading it within applicable rules does not establish that every host uses that technology. Nor does it authorize logging in, scanning, guessing passwords, or collecting unnecessary personal information. MITRE includes public websites, social platforms, and code repositories among possible reconnaissance sources. Defenders therefore need to examine public information, not just their server rooms. [Source: MITRE Search Open Websites/Domains](https://attack.mitre.org/techniques/T1593/)

## 5. Worked example: External-information review for a synthetic company

“Island Coffee” is a completely fictional company represented by `coffee.example`. Every record in this example is manually created. No network testing is performed.

Your assignment is to answer: “Could an outsider assemble a profile of our customer-service and login systems?”

1. **Read the authorization first.** Only the supplied copies of public records and the internal asset inventory may be reviewed. Production hosts are excluded. Finding a new URL does not expand the scope.
2. **Collect existing clues.** An old third-party job snapshot says that familiarity with a particular database is desirable. Record that the advertisement mentioned the skill, not that production systems definitely use that database today.
3. **Create a hypothesis to verify.** A historical screenshot shows a customer-service entry point. Record it as a possible service whose date and ownership need confirmation, not as a confirmed current asset.
4. **Pause when direct interaction would be needed.** Connecting to check whether the service exists would exceed this authorization. Ask the asset owner for a current inventory or obtain a scope change first. Do not perform the action and seek approval afterward.
5. **Deliver a bounded conclusion.** “Two historical sources indicate that a customer-service entry point previously existed. Its current availability is unknown. The system owner should verify it.” That is more professional than an impressive-sounding assertion without evidence.

| Evidence level | Example | Gap that still matters |
| --- | --- | --- |
| Observation | A screenshot contains a customer-service URL | Screenshot date, source, and integrity |
| Inference | The company may previously have offered that service | Whether the URL belongs to the company and remains current |
| Verification | The asset owner confirms it using current records | Confirmation time, coverage, and traceable evidence |

**Verification does not always mean scanning.** Checking current asset records may be both more reliable and more consistent with the authorization.

## 6. How can the work stay safe and produce useful defensive evidence?

**Rules of Engagement, or ROE**, turn authorization into operational boundaries: permitted assets, methods, times, and data handling; conditions that require stopping; and whom to contact. NIST SP 800-115 is an assessment-methodology guide published in 2008—not a claim about current law or a modern tool catalog. Its assessment planning guidance and ROE template help explain these basic requirements. [Source: NIST SP 800-115](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf)

| Defensive activity | Why it helps | Evidence to retain |
| --- | --- | --- |
| Inventory public information | Reduce unnecessary exposure of technology, personnel, and processes | Publication inventory, review records, and removal verification |
| Maintain a current asset inventory | Avoid treating historical or third-party assets as your own | Owner, purpose, ownership, and update date |
| Keep service and network records | Observe suspicious interactions and probing patterns | Time, destination service, response, and related events |
| Apply rate controls and alerts | Reduce the impact of unusually concentrated requests | Rules, trigger records, and false-positive checks against normal traffic |
| Minimize collection and control access | Avoid turning the assessment report into a sensitive-data repository | Collection purpose, access list, retention, and deletion rules |

One connection does not establish an attack. No alert does not establish that nobody is researching the organization. Queries made on a third-party platform may fall entirely outside your monitoring coverage. Analyze timing, frequency, behavior, and other evidence together.

## 7. A three-minute paper exercise and reasoning checks

Draw three boxes: “Me,” “Third-party information platform,” and “Target system.” For each action, draw the request arrows. Then ask: does the target receive an interaction? Could the information be outdated? Is the action authorized?

All scenarios are hypothetical: A, read an old web snippet saved by a third party; B, query your own test service inside an isolated lab; C, ask a third-party resolver for a name without knowing its cache state; D, see a technology in a year-old job advertisement and immediately conclude that a production host is vulnerable.

**Check 1:** In the same browser, you read a search snippet and then open the target website. Why is “I am only browsing” insufficient to classify the whole activity as passive? Identify the destination of each request arrow.

**Check 2:** If you query only a third-party DNS resolver, can you guarantee that the target's authoritative DNS service receives no query? What information is missing?

**Check 3:** A historical job advertisement mentions a technology; a production service responds; an asset owner verifies a current inventory. What does each piece of evidence support? Which one, by itself, proves that the system can be compromised?

**Check 4:** Authorization permits only reviewing copies of public records, but you find a possibly overlooked host. What should you do next to make progress without exceeding scope?

## 8. The takeaway and what comes next

**Draw the data flow before classifying passive or active; check authorization before acting; define the limits of the evidence before concluding.**

The learning outcome is the ability to explain these distinctions, not the completion of reconnaissance against a real target. M02-02 next examines OSINT sources and source validation. No third-party probing is requested or performed in this lesson.
