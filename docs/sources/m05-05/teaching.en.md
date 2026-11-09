# M05-05 | CVSS, KEV and EPSS: which vulnerability should come first?

The previous lesson distinguished CVE, CWE and CPE. This lesson asks a different question: **If two vulnerabilities may affect us, which should we address first?**

Remember three statements: **CVSS describes technical severity; KEV provides evidence of known exploitation; EPSS predicts the probability of exploitation in the wild over the next 30 days. You must still check your own assets before deciding the order of action.**

## 1. Start with a building-repair analogy

You receive two repair notices. A basement door has a very serious lock defect, but the basement is currently closed and unused. The shop entrance, open every day, has another defect, and nearby burglaries have already exploited that type of defect.

Asking which lock has the worse design is insufficient. Ask whether you have that lock, whether someone can reach the door, what is behind it, what other protections exist and how to replace the lock safely. This distinguishes technical severity from actual risk. The analogy aids understanding; it does not convert cybersecurity probabilities into burglary probabilities.

## 2. CVSS: describing severity, not predicting compromise

CVSS stands for Common Vulnerability Scoring System. It uses a shared assessment method to express vulnerability characteristics as a severity score from 0 to 10. With the common qualitative scale, 0 means None, 0.1–3.9 Low, 4.0–6.9 Medium, 7.0–8.9 High and 9.0–10.0 Critical.

This lesson focuses on CVSS v4.0, with four metric groups: Base, Threat, Environmental and Supplemental. Base describes intrinsic vulnerability characteristics; Threat adds changing exploitation conditions; Environmental adds the usage context; Supplemental provides additional decision information without changing the final score. A vector is a string recording metric selections, not another vulnerability identifier. See the [FIRST CVSS v4.0 specification](https://www.first.org/cvss/v4.0/specification-document).

When reading an advisory, retain more than “9.8”: record the version, score type, complete vector, scoring source and check date. v3.1 and v4.0 use different metrics and calculations; an old score cannot simply be relabeled as the new version. A CVSS Base score is not a complete risk assessment and does not mean your company has a 98% probability of compromise. See the [FIRST user guide](https://www.first.org/cvss/v4.0/user-guide).

For example, ask whether the issue can be triggered over a network, what privileges it needs, whether user interaction is required, and whether it can disclose data, alter data or interrupt service. These questions help explain severity. However, “network exploitable” in an advisory does not establish that your particular device is currently exposed to the Internet.

If two sources disagree on a score, first compare their versions, vectors and prerequisite conditions. Do not arbitrarily select the higher or lower score or average them. The difference may reflect different interpretations of the vulnerability conditions; retain the disagreement and unanswered questions until resolved.

## 3. KEV: evidence of actual exploitation beyond a theoretical possibility

KEV stands for Known Exploited Vulnerabilities. CISA, the US Cybersecurity and Infrastructure Security Agency, maintains a KEV catalog of vulnerabilities with evidence of exploitation, helping defenders notice issues already appearing in attacks. See the [official CISA notification](https://content.govdelivery.com/accounts/USDHSCISA/bulletins/4198f58).

Two interpretation boundaries matter:

- **A KEV listing does not establish that your device has been compromised.** Check the product, version, configuration and local evidence.
- **Absence from KEV establishes neither absence of exploitation nor permission to skip a fix.** A list cannot cover every activity that has yet to be observed or confirmed.

Thus, “this vulnerability is listed in KEV” is external threat evidence. “This host shows signs of intrusion” is a separate judgment requiring local evidence. Keep them separate in a report.

Also record the check date and the advisory's action requirements. Before treating a government notice's deadline as a legal deadline for your company, check who it applies to; use the applicable contracts, regulatory requirements and organizational policy. Access to the official catalog page was restricted in this review, so this lesson gives neither today's addition count nor individual vulnerability deadlines.

## 4. EPSS: forecasting exploitation probability, not severity

EPSS stands for Exploit Prediction Scoring System. FIRST's model estimates the probability that a published CVE will be exploited in the wild over the next 30 days. It supplies a value from 0 to 1 and updates daily. See the [FIRST EPSS introduction](https://www.first.org/epss/).

If a teaching value is 0.20, it equals 20%. That does not mean this device has a 20% chance of compromise or that 20% of companies have been compromised. The model describes vulnerability exploitation activity; it does not know all your company's defenses or business conditions.

The percentile field expresses a relative position among other vulnerabilities. A teaching example at the 95th percentile does not mean a 95% exploitation probability. Probability and rank answer different questions: being near the top of a class does not directly tell you the proportion of questions answered correctly. See the [FIRST EPSS FAQ](https://www.first.org/epss/faq).

Low EPSS is not a declaration of safety, high EPSS is not evidence of intrusion, and a missing score is not zero. Scores can change with the date and model data, so preserve the date and source with each score. See [FIRST guidance on using EPSS](https://www.first.org/epss/using-epss).

## 5. Put the three signals side by side, without inventing a magic total

Think of three separate cards:

| Signal | Main question | What it cannot establish alone |
|---|---|---|
| CVSS | How severe are the technical conditions and consequences? | Our organization will definitely be attacked |
| KEV | Is there evidence of known exploitation? | Our organization has been compromised |
| EPSS | What is the predicted probability of exploitation activity in the next 30 days? | The complete risk of our individual assets |

Do not add a CVSS score, an EPSS percentage and a KEV flag and call the result an official risk score. Their scales and meanings differ. If an organization uses a custom prioritization policy, retain the formula, thresholds, exceptions and accountable owner so others can review it, instead of letting one number hide the reasoning.

{{figure}}

## 6. Complete synthetic case: a lower score can merit earlier action

Vulnerabilities A and B below are fictional. Their scores are hypothetical existing assessments, not CVSS vectors calculated in this lesson, and they do not correspond to real CVEs.

A: advisory Base score 9.8; no KEV listing observed; EPSS 0.01. The asset is an isolated test machine without production data, and its isolation has supporting evidence.

B: advisory Base score 8.1; a KEV listing is documented; EPSS 0.60. The asset is an important Internet-facing service. Its product and vulnerability conditions have been confirmed to match, and it remains unpatched.

Under those conditions, I would recommend B first. The reason is the combination of known exploitation, external exposure, business importance and confirmed applicability, rather than one larger number. A still needs a scheduled fix and stays on the list. Priorities may change if A is not actually isolated or B has an effective mitigation that has been verified.

Addressing B does not mean forcing an immediate production reboot. Through the approved process, restrict the affected entry point, disable a feature where feasible or apply the vendor's mitigation, then arrange testing, a recovery plan and a maintenance window. Verify that these measures work; a proposed recommendation is not evidence that risk has been removed.

A bounded conclusion might be: “B meets the affected conditions, has external evidence of known exploitation and provides a critical Internet-facing service, so we recommend increasing its remediation priority. Local compromise is not yet confirmed; apply approved mitigation and arrange patch verification.”

## 7. Operational and defensive evidence: a sequence you can follow

1. First establish whether the vulnerability applies to the asset. If the product match remains uncertain, mark it unconfirmed; a high score cannot supply the missing evidence.
2. Save the CVSS version, type, vector and source; check KEV status and date; save the EPSS probability, percentile and date.
3. Add your own context: external entry points, required privileges, affected features, data sensitivity, business interruption consequences and evidence of existing defenses.
4. Record the prioritization rationale, owner, target time, mitigation and recovery plan. Use actual policy for deadlines; this lesson invents none.
5. After patching, verify installed and running versions, restored functionality and removal of the vulnerability conditions. Perform any necessary validation only within authorized scope and retain before-and-after evidence.

This lesson teaches how to read the three signals. Later units extend the full vulnerability management and reporting process. Do not download exploit code and test production systems merely to demonstrate risk.

## 8. Tabletop exercise and small check

Use paper or a local text file; connect to no test target.

First, give A and B one row each and separately fill “Advisory information,” “Our confirmed facts” and “Unconfirmed.” Second, choose which comes first and state two supporting pieces of evidence plus one new fact that could change your decision. Third, propose one short-term action and one post-patch verification, naming who must approve them under the existing process. The expected result is a reviewable prioritization rationale, not an intrusion result. Keep or delete the local draft afterward; no test device needs restoration.

Small check: A colleague says, “This vulnerability has a high CVSS score, but EPSS is only 1% and it is absent from KEV, so we do not need to handle it.” Which two categories of evidence are missing? In one sentence, explain why it cannot simply be ignored.

{{answer}}

**Core conclusion: first establish applicability, then interpret severity, known exploitation and forecasts in the real environment. The three complement each other; none replaces the complete evidence.**
