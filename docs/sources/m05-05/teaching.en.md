# M05-05 | CVSS, KEV and EPSS: which vulnerability should we fix first?

## 1. Start here: the most severe vulnerability may not be the first to fix

The central idea of this lesson is:

How severe a vulnerability is, whether attackers have exploited it, and how much danger your system faces are three different questions.

Imagine you are a security engineer. Today's scan finds 100 vulnerabilities, but you only have time to remediate 10.

How would you choose?

Someone might say, “Just start with the highest CVSS score!”

The difficulty is that a vulnerability rated 9.8 might exist only in a fully isolated laboratory. Another rated 8.1 might affect an internet-facing company server, and attackers might already be exploiting it against other organizations.

In that situation, the latter deserves attention first.

Three tools help us judge:

CVSS — How severe is the vulnerability?

Think of the seriousness of a lock's design flaw and the possible consequences of defeating it.

KEV — Have attackers actually exploited it?

Think of reliable reports confirming that burglars are using this type of lock defect in real crimes.

EPSS — How likely is exploitation in the near future?

Think of using past cases and current signals to predict the likelihood that this kind of defect will be used in the next 30 days.

{{figure:signals}}

None of these tools knows your complete company environment. A fourth question is needed:

Which of my devices does this vulnerability actually affect? How important is that device, and how accessible is it to an attacker?

This is the core of vulnerability prioritization: deciding the order in which to address vulnerabilities.

## 2. CVSS: how severe is the vulnerability?

CVSS stands for Common Vulnerability Scoring System.

Think of it as an assessment of a vulnerability's technical severity.

| CVSS score | Severity |
| --- | --- |
| 0.0 | None |
| 0.1–3.9 | Low |
| 4.0–6.9 | Medium |
| 7.0–8.9 | High |
| 9.0–10.0 | Critical |

These are the standard CVSS qualitative severity bands. [FIRST CVSS v4.0 specification](https://www.first.org/cvss/v4.0/specification-document)

For example, suppose a vulnerability has a CVSS score of 9.8.

That does not mean a “98% chance of being hacked.”

It means the vulnerability is very severe under the technical conditions described by that version, metric combination and vector.

### What does CVSS mainly assess?

Imagine an attacker trying to exploit a server vulnerability:

- Attack Vector: Can the attack come over a network, or must the attacker physically touch the device?
- Attack Complexity: What technical obstacles must the attacker overcome to succeed?
- Privileges Required: Does the attacker need an account or administrative privileges first?
- User Interaction: Must someone click, open a file or take another action?
- Impact: Could successful exploitation steal data, change data or stop the system from working?

CVSS v4.0 Base metrics also include Attack Requirements and distinguish impacts on the vulnerable system from impacts on subsequent systems. [FIRST CVSS v4.0 specification](https://www.first.org/cvss/v4.0/specification-document)

### The four CVSS v4.0 metric groups

Base

What intrinsic technical characteristics does the vulnerability have? What consequences could it cause?

Threat

Are exploitation techniques available, or has exploitation activity occurred?

Environmental

In my company, how do system importance, defenses and actual deployment conditions differ?

Supplemental

What additional information matters, such as recovery difficulty? These metrics do not change the CVSS score.

{{figure:groups}}

CVSS therefore includes more than the Base Score commonly shown in advisories. Threat and environmental information can refine the technical severity assessment for an actual deployment, while a complete business risk analysis still requires more information. [FIRST CVSS v4.0 specification](https://www.first.org/cvss/v4.0/specification-document)

The main conclusion of this section: a high CVSS score deserves attention, but CVSS alone cannot decide remediation order.

## 3. KEV: has this vulnerability actually been exploited?

KEV stands for Known Exploited Vulnerabilities. CISA maintains this catalog.

Suppose you see two advisories:

- Vulnerability A: Researchers discovered that a particular error can be used to gain administrator privileges.
- Vulnerability B: Researchers discovered the same kind of problem, and reliable evidence shows attackers exploiting it in real environments.

Both vulnerabilities are serious, but B has an additional piece of threat evidence.

That is the value of KEV.

A published PoC, or proof-of-concept program, is different from evidence of exploitation in real attacks. KEV inclusion requires exploitation evidence; scanning alone or security research does not establish that evidence. [CISA official KEV bulletin and inclusion criteria](https://content.govdelivery.com/accounts/USDHSCISA/bulletins/42a9f71)

### What should I do if a vulnerability is in KEV?

Separate three judgments first:

| Question | Meaning |
| --- | --- |
| Is it in KEV? | External evidence of exploitation exists |
| Does my device have this vulnerability? | Check versions, configuration and affected conditions |
| Has my device been compromised? | Investigate logs, system artifacts or other incident evidence |

These are three separate conclusions.

For example, a KEV vulnerability affecting a company firewall warrants higher remediation priority and, where appropriate, investigation for intrusion artifacts. It does not by itself support telling management, “Our company has been hacked.”

Likewise, absence from KEV does not establish that attackers have never exploited the vulnerability.

## 4. EPSS: predicting exploitation in the next 30 days

EPSS stands for Exploit Prediction Scoring System and is provided by FIRST.

It uses machine learning and vulnerability-related threat signals to estimate the probability of observing exploitation of a specific CVE in the wild in the next 30 days. Scores are updated daily. [FIRST EPSS](https://www.first.org/epss/)

For example, you might see:

Suppose a vulnerability has an EPSS score of

0.20

= 20%

The model predicts about a 20% probability of observing exploitation activity for this CVE in the next 30 days within its observation scope.

This is a prediction at the global vulnerability level. It is not a 20% probability that your individual server will be compromised.

{{figure:probability}}

### The two EPSS fields that are easy to confuse

| Field | Hypothetical value | Meaning |
| --- | --- | --- |
| Probability | 0.20 | Predicted probability of exploitation in the next 30 days: 20% |
| Percentile | 0.95 | A score higher than approximately 95% of assessed vulnerabilities |

These are hypothetical examples for explanation, not two fields from one actual assessment.

Probability is the predicted likelihood; percentile is a relative ranking. The 95th percentile must not be read as a 95% exploitation probability. [FIRST probability and percentile explanation](https://www.first.org/epss/articles/prob_percentile_bins)

EPSS also does not know whether your company's system is internet-connected, protected by a firewall or holding particular data.

An EPSS value of 1% does not make the risk zero. When reliable evidence of exploitation exists, such as KEV inclusion, prioritize that evidence rather than dismissing the vulnerability because EPSS is low. [FIRST using EPSS](https://www.first.org/epss/using-epss)

## 5. A practical ordering method: answer four questions in sequence

Here is a decision process for vulnerability management work.

First gate: Does the vulnerability actually affect my asset?

Confirm the product, version, configuration and affected feature.

Second gate: What do the vulnerability and external threat signals tell us?

CVSS, KEV, EPSS and other threat intelligence.

CVSS contributes technical severity context here; the score alone is not evidence of external exploitation. KEV and EPSS answer different threat questions.

Third gate: Can an attacker reach it, and what would the impact be?

Network exposure, privileges, defenses, data and business importance.

Fourth gate: Decide the remediation priority and measures.

Immediate mitigation, scheduled patching, verification and continued tracking.

{{figure:workflow}}

This is a qualitative risk decision process, not an official automatic scoring formula.

In practice, pay particular attention to three factors:

Presence: Is your system actually affected?

Reachability: Does an attacker have the conditions needed to reach and exploit the vulnerability?

Consequence: How serious would the business or safety impact be if exploitation succeeded?

FIRST's practical EPSS guidance also emphasizes combining this local context with exploitation predictions. [FIRST using EPSS](https://www.first.org/epss/using-epss)

## 6. A worked example: CVSS 9.8 versus 8.1 — which comes first?

All values below are fictional teaching data.

| Condition | Vulnerability A | Vulnerability B |
| --- | --- | --- |
| CVSS Base | 9.8 | 8.1 |
| KEV | Not listed | Listed |
| EPSS | 1% | 60% |
| Device | Isolated test machine | Internet-facing server |
| Business impact | Low | High |
| Applicability | Confirmed | Confirmed |

Looking only at CVSS, you might choose A.

Considering external threats and the actual environment together, B should be addressed first.

This does not mean that 8.1 is more severe than 9.8. B combines evidence of exploitation, external accessibility, an important business role and an unremediated vulnerability.

A has higher technical severity, but its isolation has been verified and its business impact is lower. Remediation can therefore be scheduled within acceptable risk and applicable policy deadlines.

If A's isolation later proves ineffective, or B has a confirmed effective mitigation, reassess the priority.

### What comes after prioritization?

Deciding that B comes first does not mean immediately installing an update and forcing a reboot in production.

You still need to judge:

1. Can you reduce exposure first by restricting network entry points, disabling the affected feature or applying vendor-recommended measures?
2. Could the update interrupt the service? Do you need testing and a rollback plan?
3. What evidence will confirm that the vulnerability is resolved and the system still works after remediation?
4. If attack activity is known, should you also investigate local intrusion artifacts?

Keep the states distinct: mitigation can be complete while the vulnerability remains unpatched; installing an update still requires verification that the remediation worked.

## 7. A simple record for practical work

Use this table to document vulnerability scan findings, penetration-test follow-up or routine vulnerability management.

| Item | Example |
| --- | --- |
| Vulnerability identifier | CVE-XXXX-YYYY |
| Affected asset | Internet-facing Web Server |
| Applicability | Confirmed |
| CVSS | v4.0, 8.1 (illustrative; attach the vector in a real record) |
| KEV | Listed (include the date checked) |
| EPSS | 0.60 (include the date checked) |
| Exposure | Reachable from the internet |
| Business importance | High |
| Remediation priority | Address first |
| Recommended measures | Mitigate first, then patch through the approved procedure |
| Verification evidence | Version, configuration, rescan and functional test results |

A formal record also needs information sources, an owner, a deadline, approvals and exception records.

Official information is available from these entry points:

- [FIRST CVSS v4.0: specification and scoring tools](https://www.first.org/cvss/v4.0/)
- [CISA KEV: Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- [FIRST EPSS: exploitation probability lookup and data downloads](https://www.first.org/epss/)

CISA's BOD 26-04, issued in 2026, sets risk-based vulnerability-management requirements for US Federal Civilian Executive Branch agencies. Verify applicability before treating any such requirement as a legal deadline for a private enterprise in Taiwan. [CISA official announcement](https://content.govdelivery.com/accounts/USDHSCISA/bulletins/41b445a) and [official scope explanation](https://content.govdelivery.com/accounts/USDHSCISA/bulletins/4309083).

## 8. What should you take away?

A useful way to remember CVSS, KEV and EPSS is:

CVSS measures technical severity; KEV supplies evidence of known exploitation; EPSS predicts the probability of exploitation activity in the next 30 days.

Actual remediation priority also depends on:

Applicability + attacker reachability + external threat evidence + the consequences of successful exploitation + existing defenses.

Avoid sorting solely by descending CVSS. Arbitrarily weighting CVSS, KEV and EPSS together does not produce an officially certified risk score.

## 9. Check your understanding

Imagine you are a security engineer and a colleague tells you:

“This vulnerability has CVSS 9.8, but EPSS is only 1%, and it is not in KEV. We do not need to do anything about it.”

Answer two questions:

1. Which two important categories of local environmental evidence are missing from this conclusion?
2. If the vulnerability affects a critical internal company database instead of an external website, would you automatically lower its remediation priority? Why?

Answer in plain language. Check whether your reasoning connects applicability, reachability and consequences; memorizing definitions alone is insufficient.
