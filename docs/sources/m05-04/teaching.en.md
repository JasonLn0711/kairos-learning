# M05-04 | CVE, CWE, CPE and vulnerability databases

Building on asset inventory and vulnerability classification, we now ask: **When a security advisory lists an identifier, how can you tell whether it relates to your system?**

Remember: **CVE identifies a publicly disclosed vulnerability, CWE describes a type of weakness, and CPE describes a product class and version. They help correlate information; none alone establishes that your system has been compromised.**

## 1. Start with a vehicle recall analogy

Imagine a manufacturer recalls a model because a brake component may be faulty. You would ask three different questions: Which recall event is this? What kind of design or manufacturing defect caused it? Does my vehicle model, year and component version meet the conditions?

Software also needs a shared language. Vendors, researchers and scanners may describe the same vulnerability with different titles. Without a shared identifier, teams can count it twice or confuse separate issues. This analogy distinguishes roles: CVE is not a legal recall order, and CPE is not the vehicle identification number of an individual device.

## 2. CVE: knowing that everyone means the same vulnerability

CVE stands for Common Vulnerabilities and Exposures. A CVE ID is a shared identifier for a publicly disclosed vulnerability. Its form is `CVE-year-sequence`, with at least four sequence digits. It is not a severity score or an attack count. The year does not directly tell you when the flaw was first discovered or when your system became affected.

A CNA, or CVE Numbering Authority, assigns CVE IDs and publishes records within a defined scope. Public records provide descriptions and references so that tools and teams can correlate the same issue.

Check the state as well. Reserved means an ID has been reserved; full record details may not yet be public. Published means the record has been published. Rejected means the ID should no longer be used as a valid vulnerability record; read the reason and any replacement references. See the [official CVE identifier explanation](https://www.cve.org/Resources/Media/Archives/OldWebsite/cve/identifiers/index.html) and [official glossary](https://www.cve.org/ResourcesSupport/Glossary?activeTerm=glossaryRBP).

Having a CVE does not establish that you are affected. Having no CVE does not establish that there is no weakness: an authorization flaw in custom software may have no public ID and still need correction.

## 3. CWE: understanding the type of mistake

CWE stands for Common Weakness Enumeration. It organizes common software and hardware weakness types to help explain causes and prevention. It is not a catalog of individual vulnerabilities in specific products. See [MITRE's introduction to CWE](https://cwe.mitre.org/about/index.html).

For example, CWE-79 concerns improper handling of user-controllable content during web page generation, which can cause Cross-Site Scripting, or XSS. In plain language, content meant to be displayed as data may instead become active web code in a browser. This lesson introduces the category; the Web security chapter explains the mechanism. See [CWE-79](https://cwe.mitre.org/data/definitions/79.html).

Many CVEs in different products can map to the same CWE, just as different manufacturers can make similar design mistakes. One vulnerability can also involve several weaknesses, and mappings can change. Treat CWE as a type rather than an event; identical CWE labels do not justify merging two reports.

If a team repeatedly sees the same weakness type, it can improve design, frameworks and testing instead of repairing one screen each time.

## 4. CPE: product names in a form tools can compare

CPE stands for Common Platform Enumeration. It standardizes names for operating systems, hardware and applications. Common attributes include vendor, product, version and other platform conditions. This lesson uses the basic perspective of the [NIST CPE definition](https://csrc.nist.gov/glossary/term/common_platform_enumeration) and [CPE 2.3 Naming Specification](https://csrc.nist.gov/pubs/ir/7695/final).

You do not need to memorize the full string yet. Think of it as a label that helps systems match product models. A CPE is not a host IP address, MAC address, unique asset ID or vulnerability ID. Two devices with the same product and version can share a CPE while remaining separate assets.

Tools can misidentify products or lack information. After matching a name, check the version range, branch, enabled features, platform and patch state. Applicability can combine multiple conditions; matching a product string alone is insufficient.

{{figure}}

## 5. What do databases and vendor advisories each provide?

1. CVE Record: confirms the vulnerability case, record state and referenced sources.
2. NVD, the National Vulnerability Database: builds on CVE data and provides available enrichment and structured information, such as product applicability and severity data. It is a separate service from the CVE Program.
3. Vendor security advisory: confirms affected versions, fixed releases, configuration conditions and recommended actions. If an operating-system distributor maintains the package, read that distributor's advisory too.
4. Your asset and change records: establish what is actually installed and running and whether updates were applied. A public advisory does not automatically know the current state of a particular host.

Database fields may be incomplete or delayed. NIST changed its NVD enrichment approach in April 2026: not every record receives immediate enrichment, and NIST no longer routinely duplicates a severity score already supplied by a CNA. Empty fields or a record not scheduled for immediate enrichment do not establish absence of risk. See the [NIST April 2026 announcement](https://www.nist.gov/news-events/news/2026/04/nist-updates-nvd-operations-address-record-cve-growth).

When sources disagree, record their update dates, product branches and wording differences. Check whether they describe different conditions, and retain unresolved questions. Do not simply select the answer you prefer. The next lesson addresses severity and handling priority.

## 6. Worked example: investigating an alert without overclaiming

The product, versions and advisory below are synthetic. They do not correspond to a real CVE, and no scan was performed.

A test service uses “Orange Document Server 2.4.” A scanner reports a possible advisory match. The teaching advisory says: “Versions 2.4 through 2.6 are affected when preview is enabled; 2.7 contains the fix.”

First, identify the observation. Did the tool see a response string saying 2.4, or a complete package version from the management interface? A response string is a clue and cannot establish successful intrusion.

Second, read the vulnerability case. Compare the CVE Record and vendor advisory, confirm the same product and version branch, and look for retractions or updates.

Third, check the conditions. Even if this is confirmed to be branch 2.4, inspect preview settings, patch state and entry-point access conditions. Disabling a feature may reduce risk along this path; it does not establish that the entire product has no other problems.

Fourth, consider backports. A backport brings a security fix into an older maintained version. The main version may stay the same while the full package revision and advisory show that it is patched. Looking old therefore does not necessarily mean unpatched. Conversely, knowing that a backport exists does not establish that this host received it: installation and running-state evidence are still needed.

Fifth, write a bounded conclusion. If the version is confirmed but feature and patch states remain unknown, write: “The product version meets the advisory's preliminary matching conditions; enabled features and patch state remain unconfirmed, and no exploitation validation has been performed.” Neither report a confirmed compromise nor discard the alert.

If actual exploitability needs validation, follow the authorized scope and stop conditions. Finding public exploit code does not authorize running it in production.

## 7. Evidence defenders should retain

A reproducible record can include the asset ID, actual product and complete version, CVE and record state, CWE type if available, basis for product matching, required conditions, advisory links and check date, confirmed and unconfirmed facts, recommended action and post-patch evidence.

The relationships are not one-to-one. A product can have several vulnerabilities; a vulnerability can affect several product versions; a weakness type can recur. CVE counts are not affected-device counts, and CWE counts are not vulnerability-case counts.

## 8. Tabletop exercise and small check

Use the synthetic advisory to draw three columns: “Known,” “Unconfirmed” and “Next action.” Place the version, feature configuration and patch state in the appropriate columns, then write a conclusion within the evidence. The expected result is a record showing which information is missing. No tools need installation or execution, and no test environment needs cleanup.

Small check: A scanner maps an asset to a CPE and lists a CVE, but enabled features and patch state have not been confirmed. Can you report “confirmed exploitable”? In one sentence, explain why and name two pieces of information to check next.

{{answer}}

The key is: **Identifiers correlate information; applicability to a particular system still depends on conditions and evidence from that environment.**
