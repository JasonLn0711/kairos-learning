# CEH M02-08 | Footprinting Countermeasures and Evidence Records

## 1 | The core idea

**Keep useful public information accurate, protect sensitive information with appropriate controls, and use traceable records to verify every improvement.**

Imagine the fictional Greenfield Coffee shop: menus and opening hours belong at the entrance; staff schedules, supplier credentials, and spare keys belong in controlled spaces. Record what was found, who owns the issue, what changed, and how the result was checked. Apply the same approach to websites and cloud services.

Footprinting organizes observable information about an organization, its people, domains, systems, and services. A countermeasure is a management or technical action addressing risk. An evidence record preserves the source, acquisition method, time, and outcome so another person can understand and review the work.

Previous lessons introduced search engines, DNS, email, networks, and people-related sources. This lesson combines them into an instructional workflow: inventory → verify → prioritize → improve → validate → review. These six steps are this lesson's teaching structure.

## 2 | Define the scope and establish a baseline

Record the assets, owner, permitted methods, time window, and storage location first. For example: review the authorized Greenfield Coffee website and official social accounts for public documents and test-environment links; the site administrator performs service tests in the approved environment.

Passive reconnaissance can begin with third-party search results and already acquired material. Active reconnaissance interacts directly with the target, such as service probing. Directly opening a website also creates a connection to it. Describe the actual method and its authorization rather than relying only on a label.

A baseline is the verified normal state at a particular time: the public site provides menus, hours, and a support address; management access follows approved channels; test data serves approved testers. New subdomains, obsolete contacts, and exposed test documents can then be compared with that baseline.

Inventory five areas:
- Public content: pages, photos, downloadable documents, social posts, and recruitment information.
- Names and contacts: domains, DNS records, registration contacts, and official mailboxes.
- Technical entry points: production services, administration interfaces, test environments, and retired services.
- Identity and process: official contacts, approval routes, and response channels for sensitive requests.
- External copies: search results, third-party quotations, and visible historical versions.

An attack surface includes reachable entry and exit points and related data. OWASP recommends building diagrams and notes and updating the inventory as systems change. [OWASP Attack Surface Analysis](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html)

## 3 | Match the control to its purpose

Start with the outcome you want to change.

Public-content management: create a public edition of documents and inspect photo backgrounds, author metadata, revisions, internal paths, and project names before publication. Keep role-based public contact addresses current. Retain originals according to internal rules and label public versions separately.

Search-index management: noindex asks supporting search engines to exclude a resource from their index. A public test-information page may remain accessible while using noindex. Google needs to crawl it to read that directive. Plan robots.txt crawling rules together with indexing requirements. [Google's noindex documentation](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

Access management: authentication verifies identity; authorization determines which resources and actions an identity may use. Least privilege grants the permissions required for the task. Apply appropriate server-side checks to every request, including direct file downloads. [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

Service and domain management: maintain public DNS records required by the business. When retiring a service, reconcile DNS, cloud resources, and the asset register. Limit administration interfaces through approved network and identity conditions. Restrict DNS zone transfers to authorized secondary servers. Assign owners for patching, unnecessary-service removal, and concise public error messages.

These controls serve different layers: reducing version disclosure limits technical detail; patching addresses software weaknesses; authorization decides who may use a service. Preserve required business functions and validate the intended result.

## 4 | Prioritize findings by impact and protective value

Risk assessment considers likelihood and impact. In a footprint review, examine sensitivity, actual accessibility, potential use, and business impact. The following teaching priorities should be adapted to organizational standards.

First: confirmed public active keys, credential secrets, or sensitive data. Refer these to the authorized incident-response owner promptly. Follow approved procedures to limit exposure, revoke or rotate affected secrets, and preserve necessary records. Track revocation alongside content removal to address already acquired copies.

Second: outdated systems, exposed administration interfaces, or internal details that can support persuasive phishing. Verify current state and business need, then assign patching, access changes, or content revision with an owner and due date.

Third: legitimate public business information. Keep it accurate, retain official contact channels and update dates, and schedule review.

Record confidence separately: directly observed, owner-confirmed, or third-party claim awaiting verification. A potentially serious unverified report can receive urgent validation and proportionate protective action. Severity expresses potential impact; confidence expresses the strength of supporting evidence.

## 5 | Make records useful to the next reviewer

Treat each finding as a numbered maintenance ticket. Suggested fields:
- Identity and scope: finding ID, asset, question, and authorized scope.
- Source and acquisition: original URL or file location, publisher, collector, method/tool, and access role.
- Time: source publication/event time, collection time, and time zone.
- Evidence: minimal necessary excerpt or file, controlled storage reference, and file hash.
- Interpretation: direct observation, inference, confidence, and open questions.
- Action and validation: risk, owner, due date, change record, retest method, and result.

For example, 2026-11-01T18:20:00+08:00 is 18:20 in Taiwan and 10:20 UTC. Preserve the original time and zone and add normalized values. Mark an unavailable source timestamp as unavailable.

Keep observation, inference, and action separate:

Observation: at 18:20, an unauthenticated browser displayed a synthetic staff list on the approved test page.

Inference: the public access configuration differs from the owner-confirmed internal-testing purpose.

Action: ask the owner to adjust authorization and retest unauthenticated visitors, ordinary staff, and approved testers.

NIST SP 800-86 provides a framework for integrating forensic techniques into incident response, including collection, examination, analysis, and reporting. [NIST SP 800-86](https://csrc.nist.gov/pubs/sp/800/86/final)

## 6 | Originals, hashes, and chain of custody

Original evidence preserves the material as acquired. A working copy supports annotation, analysis, and redaction. Keep an original screenshot in controlled storage; create a separate annotated or redacted copy and record the transformation.

A hash is a fixed-length digest calculated from data. SHA-256 is a common algorithm. Recomputing the same algorithm supports byte-consistency checks against the recorded digest. Source identity, acquisition time, and context are supported by collection records and corroboration. Together, these form a traceable evidence package.

Chain of custody records who acquired, held, transferred, or processed evidence, when, why, and where. A collector stores the original; an analyst uses a working copy; a reviewer examines the findings. Each step retains time and action records. RFC 3227 discusses collection, preservation, privacy, and chain of custody. [RFC 3227](https://www.rfc-editor.org/rfc/rfc3227)

This offline Python exercise calculates SHA-256 for synthetic text:

```python
import hashlib

data = b"abc"
print(hashlib.sha256(data).hexdigest())
```

Expected output:

```text
ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
```

The input is exactly three bytes. Adding a newline changes the byte sequence and digest. For real preservation, hash the actual retained file and record the algorithm and full value.

Collect the minimum data needed. Use redacted public reports and authorized storage for sensitive originals. Set retention, access roles, and disposal rules through organizational procedures. Formal incidents or legal matters follow the applicable specialist process.

## 7 | Worked example: from finding to closure

This is a synthetic scenario with no third-party interaction.

Greenfield Coffee's https://portal.example/test/ serves three approved testers. An authorized review finds that unauthenticated visitors can read a synthetic staff list. The page has noindex. The owner confirms its internal-testing purpose.

Finding F-008: preserve the URL, acquisition time, unauthenticated role, minimal screenshot, original location, and SHA-256. Record the observed data separately from the access-scope risk.

Improvement: the website owner adds server-side authorization for the page and downloadable files, allowing the approved testing group. The business owner separately decides whether a public information page remains useful. Handle original test data under retention rules.

Acceptance criteria: unauthenticated visitors receive a login requirement or denial; ordinary staff remain restricted; approved testers retain normal access; direct downloads apply the same authorization. Record roles, times, actual results, and change version.

Closure and follow-up: after configuration changes, the reviewer retests the original issue. Mark F-008 validated when all criteria are met. Track search-result or other-copy updates separately with an owner, so access remediation and external presentation each have completion evidence.

Useful states are awaiting verification, confirmed awaiting action, improved awaiting validation, and validated. Record the basis for each transition and reopen the issue if new evidence requires action.

## 8 | Logs and recurring review

A log is a chronological system-event record. Authentication results, authorization denials, administration changes, and file-access events help evaluate the example before and after remediation. Consistent time, source, target, action, and result fields support correlation.

Protect logs with appropriate access, integrity, and retention controls. Exclude or suitably redact passwords, complete access tokens, and unnecessary sensitive information. OWASP covers event selection, sensitive data, testing, and log protection. [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

Review after website changes, new suppliers, service retirement, or contact changes, as well as periodically. Compare the baseline: what changed, who owns it, and is its public purpose still appropriate?

Link M02 sources to a common improvement register: search/documents to content and access; DNS/domains to lifecycle ownership; email to authorization policy and independent verification; networks to service exposure; social and breach leads to publication standards and incident validation.

## 9 | Offline exercise and checks

Create an F-008 record with time, source, observation, improvement, responsible role, and acceptance criteria. Give a synthetic original and redacted copy separate filenames and hashes, then document their relationship.

Check 1: an internal test list is publicly readable and has noindex. Which measure serves approved testers? A. A longer URL; B. Server-side authentication and authorization; C. More search keywords; D. A different title.

Check 2: a retained file's SHA-256 matches its original record. What does this primarily check? A. Byte consistency against the original digest; B. The author's identity; C. Publication date; D. Completion of remediation.

Check 3: after an administrator reports a configuration change, name two validation checks and one result record to retain.

Check 4: a third party claims an old test site exposes data. Write one sentence each for known information, an open question, and the next step. What authorization scope should be confirmed first?

Reference answers are maintained separately. Learning status follows actual learner responses.

**Every finding has a source, every improvement has an owner, and every closure has validation evidence.** Next is M03-01: IP, TCP, UDP, ports, and services.
