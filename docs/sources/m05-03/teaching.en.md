# M05-03 | Vulnerability Classification and Assessment Types

Two systems may both be insecure, yet require different examination and remediation methods because their causes differ. The previous lesson determined what may be examined. This lesson asks: what kind of problem are we looking for, and from which viewpoint can we see it?

## 1. Understand classification through a restaurant

Food in a restaurant might spoil because a refrigerator failed, the temperature was set incorrectly, or an employee forgot to refrigerate it. The outcome looks similar, but the causes differ. Replacing a refrigerator cannot fix a work process; retraining employees cannot repair a broken compressor.

Information systems are similar: after finding a weakness, understand its cause so you can choose a suitable remedy.

## 2. Where do vulnerabilities come from?

A vulnerability is a weakness that may be exploited and harm security objectives. The following categories help explain the topic; they are not the world's only classification scheme:

- Design flaw: the original rules omit something important. For example, an ordering system was designed without per-order access rules. Improve the design and authorization rules.
- Implementation flaw: the rule is reasonable, but the program fails to implement it correctly. For example, an interface omits the order-owner check. Fix the code and add tests.
- Misconfiguration: the capability exists, but its settings do not meet requirements. For example, storage intended for internal readers is made public. Correct the permissions and settings.
- Known flaw not yet patched: a vendor has provided a correction, but the system still meets the affected conditions. Check applicability, update and verify.
- Management or process gap: maintenance, review or responsibility arrangements are inadequate. For example, an account is not revoked after an employee leaves. Improve the process, clarify ownership and audit it.

Categories can overlap. An unpatched issue may involve a software flaw and a failed patching process. Classification helps identify causes and responsible parties; there is no need to force every finding into one exclusive box. [OWASP's vulnerability explanation](https://community.owasp.org/vulnerabilities/) also shows why vulnerabilities are not limited to old versions.

## 3. Where you examine is a different classification

An assessment type describes the object or method being examined. It answers a different question from the cause of a vulnerability.

- Host-based: examines packages, updates, settings and permissions on an individual system.
- Network-based: examines visible services and exposure from a network-connectivity viewpoint.
- Application assessment: examines sign-in, authorization, data handling and business rules.
- Database assessment: focuses on configuration, account privileges and data access.
- Wireless and cloud environments have their own settings and responsibility boundaries; completing host checks does not mean that every environment has been covered.

For example, “incorrect storage permissions” describes a problem type; “cloud configuration assessment” describes a method that might find it.

## 4. Internal and external: where are you observing from?

An external assessment observes from a reachable position outside the organization. An internal assessment observes from an authorized internal position. The exposure visible from the two viewpoints may differ.

Standing on the sidewalk lets you see a building entrance; entering the office lets you examine separation between internal rooms. Not seeing a database port externally establishes only that this external viewpoint did not observe it. It does not establish that the database is absent or that internal permissions are correct. Internal connectivity also does not automatically imply permission to read data.

Internal and external refer to the observation position, not the company employing the tester. An authorized external consultant can conduct an internal assessment. [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final)

## 5. Active and passive: how is evidence obtained?

Active methods send test or probe requests and observe responses. Passive methods observe existing messages or traffic without relying on active probes to obtain a response.

An active method may answer a question more directly, but can add load to the target. A passive method is limited by observation position and time; traffic that does not appear may remain unseen. Passive does not mean authorization is unnecessary, nor does it eliminate privacy risk.

Two more pairs of labels:
- Authenticated / unauthenticated: whether an authorized account is used to obtain assessment information. This is not synonymous with internal / external.
- Automated / manual: whether tools perform repeatable checks or people analyze and verify evidence. In practice, these methods are commonly combined.

One assessment can be “an internal, authenticated, automated host assessment.” These are different dimensions, not mutually exclusive categories.

## 6. Example: why is one tool report insufficient?

All of the following are synthetic scenarios:

- Finding A: a tool infers an old package version from a response. This is only a lead suggesting possible applicability; verify the actual package, patch status and required conditions before asserting exploitability.
- Finding B: an administrator provides configuration evidence that a test folder permits anonymous reads. This supports the presence of that setting, but the expected policy and sensitivity of its contents still need checking before judging impact.
- Finding C: in an isolated environment, two authorized synthetic accounts are used for testing, and account A can obtain B's fake order. If policy prohibits cross-account access, this supplies concrete evidence of an authorization-check gap.

A requires checking packages and advisories, B requires comparing settings with policy, and C requires application-logic examination. Version scanning alone may not answer B or C.

## 7. Classification does not determine the remediation order

Severity describes how serious a problem could be. Priority also considers actual exposure, data value, existing protections and remediation conditions. A misconfiguration is not necessarily minor, and a software vulnerability is not necessarily the most urgent item.

Remediation evidence should match the problem: verify versions after updating; check policy and access results after permission changes; and add both expected-allow and expected-deny tests after a logic fix. Do not turn “the scan reported a finding” into “an intrusion has occurred.”

## Five-minute tabletop exercise

Make one row for each of A, B and C. Record “what was observed,” “what kind of problem it may be” and “what evidence is missing.” Then choose a suitable assessment method and explain why. No tool installation or system scanning is required.

## Quick check

A tool finds no known version vulnerabilities, but one test account can still see another test account's order. What assessment should be added? Why does “the version scan found nothing” not justify declaring the system secure?

The core skill is to explain separately: what the problem is, which viewpoint the assessment uses, and what the current evidence can establish.
