# CEH M01-04 | Attack Surface and Attack Vector
## Attack surfaces and attack vectors: identify the points of contact, then consider how harm could occur

Module 01: Introduction to Ethical Hacking

Remember one sentence first: **an attack surface concerns “where something could be contacted, affected or have data extracted”; an attack vector concerns “the route and method an attacker might use.”**

They are related, but they are not the same thing. **An entry point does not necessarily mean a vulnerability; a vulnerability does not mean a successful attack.**

M01-02 asked “what is worth protecting, and what harm could it suffer?” M01-03 established “who allows us to test, and how far may we go?” Only now do we examine the next question: within the authorized scope, which points of contact need to be assessed?

All examples below are fictional teaching scenarios. They involve no real websites, accounts or testing operations.

## 1. Start with a shop: a list of doors and windows differs from a method of breaking in

Imagine that you run a café with a front door, a back door, a delivery pickup window and a telephone for receiving orders.

These are points where the café interacts with the outside world. The café needs to operate, so having doors and a window is not itself a mistake.

Now consider two possible harms:

- Someone enters a staff-only area through an unlocked back door.
- Someone calls, impersonates the manager and tricks an employee into transferring the day's takings.

The first example uses a physical entry point; the second uses people and operational processes. Their methods differ, as do their consequences.

Applied to information systems:

- **Attack surface:** the collection of points of contact that need to be inventoried and protected.
- **Attack vector:** a route or method an attacker might use.
- **Vulnerability:** inadequate protection along that route that could be exploited, such as a broken lock or a failure to verify identity before making a payment.

This analogy is only a learning aid. Real systems can be affected in ways beyond someone “getting in”: service can be disrupted, or data can leave through output interfaces. Therefore, do not focus only on login entry points.

## 2. Attack surface: not just public websites, and not a list of vulnerabilities

NIST describes an attack surface as a set of points on the boundary of a system, component or environment where an attacker could try to enter, cause an effect or extract data. The emphasis is on **what could be reached**, not on what has already been proven compromised. [NIST: Attack Surface](https://csrc.nist.gov/glossary/term/attack_surface)

For an online learning platform, consider several perspectives:

- **Websites and applications:** login, password recovery, file upload, search, data export and APIs. For now, think of an API as “an interface through which one program exchanges data with or makes requests to another program.”
- **Networks and devices:** externally accessible services, remote administration interfaces, internal file servers and employee laptops.
- **Identities and permissions:** which features are available to ordinary users, teachers, administrators and third-party integrations?
- **People, physical access and processes:** customer-service inboxes, account recovery procedures, visitor access, accessible equipment and removable media.

This is a convenient inventory framework for this lesson, not the only official classification. OWASP's application attack surface analysis specifically highlights paths through which data and commands enter and leave, along with different roles and permissions. Listing only the website's homepage is usually insufficient. [OWASP: Attack Surface Analysis](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html)

### 1. External and internal attack surfaces

“Reachable from the internet” and “reachable only after entering an internal network or logging in” are different conditions.

For example, a public login page is an external point of contact. A teacher's export feature available only after login still needs protection. An attacker might obtain an account, or might already be someone with limited permissions.

Therefore, **not being public does not mean having no attack surface; being logged in does not mean being allowed to use every feature.**

### 2. The attack surface changes when the system changes

Adding a feature that “lets teachers upload learning materials” may also introduce file reception, storage, preview and download processes. Even without adding a domain, the application may have more areas that need assessment.

Conversely, removing an unused legacy administration interface can reduce the points of contact that require maintenance. But security cannot be judged simply by counting entry points: one administration interface that can operate on all students' data may deserve higher protection priority than ten public image pages.

## 3. Attack vector: explain “how it could be done” and the conditions required

The UK's NCSC explains an attack vector in terms of the method an attacker uses to gain unauthorized access. Remember it this way: **rather than merely identifying a door, describe how that entry point might be used.** [NCSC: Cybersecurity Glossary](https://www.ncsc.gov.uk/section/advice-guidance/glossary)

Examples to help distinguish the concepts:

- An employee inbox is a point of contact. Using a forged notification to direct the employee to a fake login page and obtain their credentials is a possible attack vector.
- A public-facing website is a point of contact. Exploiting a confirmed software vulnerability in a website feature to obtain unauthorized capabilities is another possible attack vector.
- An account recovery process is a point of contact. Impersonating the account holder to trick customer service into resetting the sign-in method can also be an attack vector.

Do not turn these descriptions into a conclusion that “it will definitely succeed.” Continue asking:

1. **Can it be reached?** Is it internet-accessible, internal-network-only, or does it require physical access to the device?
2. **What identity is required?** No login, an ordinary account, or existing administrator privileges?
3. **Who needs to do what?** For example, must a user open a file, enter information or approve a request?
4. **Which weakness does it depend on?** A software vulnerability, incorrect permissions, or a process that does not verify identity?
5. **Do existing protections block it?** Examples include additional authentication, permission restrictions, isolation and content inspection.

These conditions turn “it sounds possible” into a hypothesis that can be checked. **Describing a possible vector does not prove that the vector is feasible in this environment.**

One point of contact may also have more than one vector, and a complete attack path may connect several points and methods. Do not force an entire event into a “one entry point equals one attack” model.

## 4. Include trust boundaries to identify where checks must be repeated

For now, think of a **trust boundary** this way: “after data or an operation request crosses this boundary, the previous trust cannot simply carry over; it must be checked against the rules on the other side.”

For example:

- User's browser → platform server: user-supplied data must not automatically be treated as trustworthy.
- Ordinary student → teacher functions: an authenticated identity does not imply teacher permissions.
- Platform → third-party service: a business relationship does not mean all data may be exchanged.

OWASP threat modeling maps data flows, components and trust boundaries to help identify where validation and protection are needed. [OWASP: Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)

A straightforward example: hiding an “administrator button” on a webpage does not mean the server restricts administrator operations. The button is part of the interface; the system receiving the actual request must still check whether the current user is authorized to perform it.

This connects to two terms you will often encounter later:

- **Authentication:** who are you?
- **Authorization:** given your identity, what may you do with this particular data?

Do not check only whether someone is logged in and skip whether they are allowed to access the requested data. OWASP recommends checking permissions on every request and designing around least privilege and deny by default. [OWASP: Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

## 5. Complete example: downloading student reports from Northstar

Suppose the fictional Northstar learning platform has three features: public course descriptions, student login and personal learning-report downloads.

The rules are clear: each student may download only their own report; teachers may download reports only for classes they are authorized to access.

### Step 1: identify the asset and attack surface

The assets requiring protection are students' private learning reports.

The report download feature and its backend interface form one part of the attack surface requiring assessment. The feature must exist to provide the normal service; **its existence is not itself a vulnerability.**

### Step 2: propose a possible attack vector

An assessor proposes a hypothesis: if an ordinary student requests another student's report through the download feature, might the server check only “logged in” without checking “authorized to read this report”?

If that check is missing, the download interface might allow unauthorized reading.

Notice that this is currently a hypothesis awaiting verification. It is not yet a discovered vulnerability, much less evidence of an actual data leak.

### Step 3: verify in an explicitly authorized test environment

Assume the team has approved test accounts A and B and synthetic reports containing no real people's data:

- A downloads A's own report: this should succeed.
- A requests B's report: this should be denied, and the response must not include B's report content.
- B downloads B's own report: this should succeed.

If A actually obtains B's synthetic report, this provides evidence that “object-access authorization failed under these test conditions.” Broken Access Control and IDOR/BOLA will be discussed in detail later. For now, grasp that “permission to view must be checked for each piece of data.”

Even if the test reproduces the issue, you cannot conclude that “all production students' data has already been stolen.” The test demonstrates a protection failure under specific conditions. Whether anyone exploited it historically and the extent of the impact require separate investigation.

### Step 4: fix it and verify that normal service still works

The defense is not to hide the download button. The server must decide whether to provide data based on the authorization relationship between the current account and the report.

After the fix, confirm again that A can obtain A's own report but not B's, and that teachers can obtain only data within their authorized scope. This verifies both that **prohibited access is blocked and legitimate service remains available.**

## 6. Defense and evidence: closing every door is not the definition of success

Think about defenses in three ways:

**First, reduce unnecessary points of contact.**

Disable unused services, remove old test interfaces and revoke accounts or integration permissions that are no longer needed. First check their purposes and dependencies so you do not shut down legitimate business operations too.

**Second, protect the points of contact that remain necessary.**

Examples include updating software, checking permissions for individual data access and restricting access to privileged administration functions. Identity entry points can use suitable multifactor authentication (MFA). More phishing-resistant authentication can reduce impersonation risk after credentials are obtained through deception, but it cannot replace data-access permission checks. [CISA: Implementing Phishing-Resistant MFA](https://www.cisa.gov/sites/default/files/2023-01/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf)

**Third, retain evidence that can verify the protections.**

For the Northstar example, reasonable evidence includes:

- Which test account and permission role made which request, at what time.
- Whether the system allowed or denied the request and whether it actually returned report content.
- Records of configuration or code changes before and after the fix.
- Retest results for both normal functions and unauthorized-access scenarios.

Records should be traceable, but there is no need to collect real people's reports, passwords or authentication secrets just to “prove the issue.” Use synthetic data and redact unnecessary information.

Finally, keep the boundaries of the evidence clear:

- **Seeing an interface:** demonstrates only some form of exposure or reachability.
- **Reproducing unauthorized behavior in a test:** supports the existence of a protection failure under those test conditions.
- **Incident records and other corroborating evidence:** support further analysis of whether exploitation actually occurred and what impact it had.

A single “access denied” result cannot establish the security of the entire platform. An absence of abnormal log entries does not guarantee that no problem has ever occurred. Keep the conclusion within the scope of the evidence.

The memory aid for this lesson is: **inventory the surface, analyze the route, state the conditions and base conclusions on evidence.**

## 7. One quick check

A company's employee inboxes receive mail normally. An employee receives an email impersonating the IT department and requesting that they enter their company credentials on another website. Currently, all that is known is that the email arrived; there is no evidence that the employee clicked, entered information or had their account accessed by someone else.

**In your own words, identify the attack surface and the possible attack vector in this scenario. Can you already conclude that the account has been compromised?**

You do not need to recite definitions; explain it in your own words. Your actual answer will be used to determine which parts you understand. Receiving the teaching material itself does not mean completion.
