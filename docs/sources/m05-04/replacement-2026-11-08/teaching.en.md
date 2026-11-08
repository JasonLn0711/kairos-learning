# M05-04 | CVE, CWE, CPE and vulnerability databases

This lesson helps you go beyond recognizing security terminology to judge whether a vulnerability scanner's warning actually applies to a system.

Start with one principle:

A scanner reporting a possible vulnerability does not establish that it exists on the system. Even a confirmed vulnerability does not establish that an attacker has compromised it.

## 1. Understand three terms through a vehicle recall

Suppose you bought a Toyota.

One day, a news report says a particular Toyota model has a brake-system defect and the manufacturer has announced a recall.

You would want to know:

1. Which recall incident is this?
2. What type of brake problem is involved?
3. Does it affect my model and production year?

Information security has three corresponding standards.

| Term | Vehicle analogy | Security meaning |
| --- | --- | --- |
| CVE | Reference number for a recall incident | Identifier for a specific disclosed vulnerability |
| CWE | Type of brake design or manufacturing error | Type of weakness underlying a vulnerability |
| CPE | Manufacturer, model, year and specifications | Standardized name for a software, hardware or operating-system product |

{{figure:roles}}

CVE, CWE and CPE are a common language for researchers, vendors, security engineers and scanners to exchange information. They are not attack tools.

## 2. CVE: a reference number for a disclosed vulnerability

CVE stands for Common Vulnerabilities and Exposures.

Think of it as an identifier used to coordinate work on a particular case.

Suppose a software company discovers a vulnerability in its product:

Under certain conditions, an unauthenticated user may read documents that should not be public.

Without a common identifier, descriptions could differ:

- Vendor A calls it a document-disclosure problem.
- Scanner B calls it an unauthorized-read vulnerability.
- Researcher C calls it an authorization-check flaw.

All three may be discussing the same issue under different names.

CVE helps reduce that confusion.

### Reading a CVE identifier

{{figure:identifier}}

A CVE identifier does not directly tell you:

- Whether the affected software is installed on your computer.
- Whether your software has been patched.
- Whether an attacker has exploited it.
- How severe the vulnerability is.

Its primary role is to identify the vulnerability being discussed.

### CVE record states

| State | Plain-language meaning |
| --- | --- |
| Reserved | An identifier has been reserved; details may not yet be public |
| Published | The vulnerability record is publicly available |
| Rejected | The identifier should no longer be treated as a valid vulnerability record |

A record may be rejected because it duplicates another record, contains an error or for another reason. Read the explanation and any replacement identifier.

A CNA (CVE Numbering Authority) assigns identifiers and publishes records within its designated scope. A number chosen arbitrarily does not become an official CVE identifier.

[CVE states and CNA responsibilities](https://www.cve.org/Resources/Media/Archives/OldWebsite/about/faqs.html)

## 3. CWE: the type of mistake behind a vulnerability

CWE stands for Common Weakness Enumeration.

Imagine you are a vehicle mechanic.

Three cars from different manufacturers arrive with brake failures.

Each recall has its own reference number, but investigation reveals similar design defects.

Likewise, three different CVEs can map to the same CWE type.

### CWE-79: cross-site scripting

Imagine running a website with a comments section.

A visitor normally posts:

> The weather is nice today.

The website should display this as ordinary text.

If a website handles user input incorrectly, someone else's submitted web code may instead execute as instructions in another visitor's browser.

This can produce XSS (Cross-Site Scripting).

The underlying problem is a failure to distinguish user-supplied data from executable web code, rather than the existence of a comments feature itself.

MITRE classifies this weakness as CWE-79.

The distinction is useful:

CVE helps locate a specific vulnerability and its fixes. CWE helps engineers prevent recurring weakness types through design, output encoding, framework choices and security tests.

Not every CWE instance has a CVE. Your own application can contain a weakness described by CWE even without a publicly assigned vulnerability identifier.

[MITRE CWE-79](https://cwe.mitre.org/data/definitions/79.html)

## 4. CPE: identify the product and version

CPE stands for Common Platform Enumeration.

Return to the vehicle analogy.

Suppose a manufacturer announces:

A particular model produced in 2023 has a brake problem.

Owning another vehicle from the same brand does not establish that it is included in the recall.

Software requires the same distinction.

Suppose a company runs three document-server versions:

| Asset | Installed version | Advisory affects 2.4–2.6 |
| --- | --- | --- |
| Server A | 2.3 | Preliminary mismatch |
| Server B | 2.5 | Preliminary match |
| Server C | 2.7 | Preliminary mismatch |

CPE gives scanners and databases a consistent way to describe products.

### What does CPE look like?

Consider a fictional product named Orange Document Server 2.4.

A teaching example using the CPE 2.3 format is:

```
cpe:2.3:a:orange:document_server:2.4:*:*:*:*:*:*:*
```

Start with the main fields:

- `cpe:2.3`: version of the CPE naming format.
- `a`: application; `o` denotes an operating system and `h` hardware.
- `orange`: vendor.
- `document_server`: product.
- `2.4`: version.

Later fields can describe updates, editions, language and other conditions. You do not need to memorize the entire format now.

Two distinctions matter:

First, CPE is not a device identity. Ten computers running the same software version can match one CPE while remaining ten different assets.

Second, a CPE match does not establish vulnerability applicability. Enabled features, installed patches and other software or platform conditions may determine whether the asset is affected.

[NIST CPE 2.3 naming specification](https://csrc.nist.gov/pubs/ir/7695/final)

## 5. NVD: a database integrating public vulnerability information

After learning three identifiers, you may ask:

Where can I look up all these CVEs?

One option is NVD.

NVD stands for National Vulnerability Database, maintained by NIST in the United States.

Think of it as a center for organizing vulnerability information.

{{figure:lookup}}

The illustration suggests an investigation order. It does not establish that NVD is always complete or that vendor advisories are always newer than other sources.

The real [NVD record for CVE-2021-44228](https://nvd.nist.gov/vuln/detail/CVE-2021-44228), for example, provides a Log4Shell description, severity information, applicability conditions and references. Apache's advisory further identifies `log4j-core` as the affected component; do not treat every component with Log4j in its name as equally affected.

### Why consult sources beyond NVD?

Database enrichment takes time.

On April 15, 2026, NIST announced a risk-based approach prioritizing enrichment for categories including known exploited vulnerabilities and software used by the federal government. Other CVEs remain listed but may not immediately receive complete analysis.

Missing CPE or severity information in NVD therefore does not establish that the vulnerability is absent or its risk is zero.

[NIST NVD policy, April 15, 2026](https://www.nist.gov/news-events/news/2026/04/nist-updates-nvd-operations-address-record-cve-growth)

[Apache security advisories](https://logging.apache.org/security.html)

## 6. Worked simulation: investigate a scanner warning

Suppose you are a company's security engineer.

The company operates an internet-facing document server.

A vulnerability scanner reports:

{{figure:finding}}

Since 2.4 falls within the affected range, you might initially want to write “vulnerability confirmed.”

More evidence is needed first.

### Step 1: verify the actual version

The scanner may have seen only this response:

`Server: Orange Document Server 2.4`

That string may be stale, configured as a fixed value or missing the package revision. It need not identify the complete version actually running.

Check the installed product and full package version as well as the response banner.

### Step 2: verify the vulnerability conditions

The advisory says the issue applies only when document preview is enabled.

Check the configuration.

If the feature is disabled, this attack path may not apply. That still does not establish that the entire product is free of security problems.

### Step 3: verify patch status

An important concept is backporting a security fix.

Suppose software is version 2.4 and the vendor later transfers a security fix from 2.7 into the maintained 2.4 branch.

The resulting situation can be:

- The visible version still looks like 2.4.
- The package contains the vulnerability fix.

Linux distributors use backporting in practice. Comparing upstream version numbers alone can therefore produce scanner false positives.

Conversely, an administrator saying “we updated it” is not sufficient evidence. Check the full installed package version, update records and, where necessary, whether the running service has loaded the update.

### Step 4: conclude from the evidence

Distinguish three cases.

| Verification result | Supported conclusion |
| --- | --- |
| Only the scanner's detected 2.4 version is known | Potentially affected; verification pending |
| Unpatched software and enabled preview are confirmed | Known applicability conditions are met; affected |
| The applicable fix is installed and the patched version is running | This advisory's vulnerability is fixed; retain the evidence |

Distinguishing these outcomes is a central skill in engineering a vulnerability assessment.

[Red Hat security backporting](https://access.redhat.com/security/updates/backporting)

## 7. Report the strength of your evidence

Finding a possible vulnerability, confirming it, demonstrating exploitability and establishing compromise are four distinct evidence levels.

{{figure:evidence}}

This teaching model does not require exploit testing to establish every vulnerability. A successful authorized test also does not prove that attackers exploited the issue previously.

### A professional vulnerability record

Continue the fictional case:

| Field | Recorded content |
| --- | --- |
| Asset | Document server A |
| Potential issue | Authorization flaw in document preview |
| CVE | Teaching advisory; no real identifier assigned |
| Version evidence | Scanner reports 2.4; host-side confirmation pending |
| Known conditions | Advisory affects 2.4–2.6 with preview enabled |
| Unknown conditions | Preview configuration, patches and running state |
| Current conclusion | Potentially affected; unconfirmed |
| Recommendation | Verify versions and configuration, then remediate or exclude according to evidence |

A penetration-testing report could say:

> Preliminary detection found response information matching an affected product version in a public security advisory. Actual package versions, feature configuration and patch status have not yet been verified, and no exploitation test has been performed. This is therefore recorded as a potential vulnerability. The system maintenance team should verify these conditions and provide supporting evidence.

This discloses the concern, preserves the strength of the evidence and identifies what needs to be checked next.

## 8. Knowledge review

| Question | Relevant identifier or evidence |
| --- | --- |
| Which disclosed vulnerability is this? | CVE |
| Which design or system weakness type is involved? | CWE |
| Which products and versions may be affected? | CPE |
| Where can public vulnerability information be found? | Official CVE records and NVD |
| How should it be fixed? | Vendor advisories and patch instructions |
| Is this asset actually affected? | Asset, version, configuration and patch evidence |
| Has an attacker exploited it? | Incident records, forensics and compromise investigation |

Start with the [official CVE website](https://www.cve.org/), [MITRE CWE](https://cwe.mitre.org/) and [NVD](https://nvd.nist.gov/).

## 9. Understanding check

Suppose you scan a company's systems and observe:

An Ubuntu server's Nginx is identified as an older version. The scanner maps it to a CVE and rates it high risk.

The administrator says: “We applied Ubuntu security updates. The main Nginx version number just did not change.”

Answer two questions:

1. Should you immediately trust the scanner or the administrator? Why?
2. Which two key pieces of evidence would you request to determine whether this vulnerability has been patched?

Write your judgment and required evidence first, then review the reasoning in a subsequent discussion. This page provides no automatic submission or grading.

The lesson's central point is:

CVE identifies the vulnerability to investigate, CWE the weakness to understand, and CPE the products that may be affected. Local evidence supports a reliable judgment about this particular asset.
