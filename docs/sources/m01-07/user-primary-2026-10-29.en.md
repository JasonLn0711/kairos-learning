# CEH M01-07 | Risk Management, Incident Response, Laws & Standards
### Risk Management · Incident Response · Laws & Standards
**Module 01: Introduction to Ethical Hacking**

This is the final learning unit in CEH M01. We will connect the knowledge from the previous six lessons to understand how an organization actually manages information security.

## 1. Start with the big picture: information security is an ongoing management system

The most important conclusion in this lesson is:

> **Security is not simply patching every vulnerability you find or dismissing every alert that appears. It means continually assessing risk, taking action, verifying results, and improving the next decision.**

Think of the lesson as three questions:

| Core area | In plain language | Most important question |
|---|---|---|
| Risk Management | Decide how to prevent harm before something happens | Which risks deserve attention first? |
| Incident Response | Investigate and respond when something may already have happened | What happened, and how can we prevent further harm? |
| Laws & Standards | Establish the rules, responsibilities, and applicable requirements | What must we comply with, and who is accountable? |

Another idea runs throughout all three:

**Continuous Improvement** means using the lessons from each inspection, exercise, and incident to improve future protection and management.

The following four SVG diagrams gradually explain how these ideas connect.

### SVG diagram ① | The complete security-management decision cycle

[Open the original SVG vector diagram](sandbox:/mnt/data/CEH_M01-07_01_整體決策循環.svg)

Follow the arrows in the diagram:

**Risk management → Incident response → Improve governance → Return to risk management.**

For example, a hospital discovers a security problem in its medical-record system.

During normal operations, the security team assesses the risk of medical records being exposed and establishes access controls. If an unusually large download occurs one day, the team must investigate whether unauthorized access is involved.

The work does not end when the incident has been handled.

The team must also ask: Why did the existing access controls fail to prevent the problem? Was detection too slow? Should the management process change?

Those answers inform the next round of risk management.

**The endpoint of security work is therefore not merely “fixing the problem,” but making the overall system more reliable.**

---

## 2. Risk Management: how do you decide which vulnerabilities to fix first?

### 1. Start with four important terms

Imagine that you are an information-security engineer at a hospital.

| Term | In plain language | Hospital example |
|---|---|---|
| Asset | Something we want to protect | A medical-record database |
| Threat | Something that could cause harm | Unauthorized reading of medical records |
| Vulnerability | A weakness in the system | Incorrect permissions on a medical-record folder |
| Risk | Potential harm and its likelihood | Private medical records are exposed, harming patients' rights and interests |

Remember the causal relationship:

**A weakness does not mean that someone has exploited it; exploitation does not mean that every occurrence causes the same amount of harm.**

Suppose you find incorrect permissions on two folders.

The first contains public event posters. The second contains patients' private medical records.

Although the technical configuration error is the same, the potential harm is very different.

That is why risk management cannot consider only the number of vulnerabilities.

### SVG diagram ② | A risk-assessment matrix and four ways to respond

[Open the original SVG vector diagram](sandbox:/mnt/data/CEH_M01-07_02_風險評估與處置.svg)

### 2. How do we assess risk?

Beginners can start with a simplified model:

\[
\boxed{\text{Risk} \approx \text{Likelihood} \times \text{Impact}}
\]

In other words:

**Risk ≈ likelihood of occurrence × severity of impact**

Suppose we assess two issues using scores from 1 to 5:

| Issue | Likelihood | Impact | Illustrative score |
|---|---:|---:|---:|
| Unauthorized downloading of public posters | 3 | 1 | 3 |
| Unauthorized downloading of private medical records | 3 | 5 | 15 |

The example shows that:

Even with the same likelihood, differences in the importance of the information can change risk priorities.

However, this is only a simplified teaching method—not a formula that NIST requires every organization to use. In practice, we must also consider system exposure, threat capabilities, existing security controls, and uncertainty in the assessment.

### 3. Is “patch it” the only option after identifying a risk?

No.

NIST describes risk responses including acceptance, avoidance, mitigation, sharing, and transfer. [NIST Computer Security Resource Center](https://csrc.nist.gov/glossary/term/risk_response)

Consider these hospital examples.

**Mitigate**

The hospital discovers incorrect permissions on a medical-record folder. It corrects the permissions, adds multifactor authentication (MFA), and monitors unusual downloads.

These measures can reduce risk, but cannot guarantee that all risk disappears.

**Avoid**

The hospital had planned an unnecessary feature for publicly downloading medical records. After assessing the excessive risk, it cancels the feature.

This avoids the particular risk introduced by that feature, at the cost of some convenience.

**Transfer / Share**

The hospital purchases cyber insurance and agrees on incident responsibilities with an external service provider.

This may share some financial losses, but the hospital must still fulfill its own security and legal responsibilities.

**Accept**

An old internal system cannot be upgraded immediately. Following an assessment, the responsible decision-maker accepts the residual risk for a defined period and applies other compensating controls.

Risk acceptance requires appropriate authorization and records; it cannot be used to evade legal obligations.

### 4. What is Residual Risk?

Suppose the hospital has corrected the medical-record folder's permissions.

The likelihood of unauthorized access has now decreased.

However, two questions remain:

First, did anyone download the information before the correction?

Second, could other security problems still affect the current permission arrangement?

The risk that has not been eliminated is residual risk.

**CEH exam memory point:**

> Vulnerability Severity is not the same as Risk Level; completing a patch does not mean that Residual Risk is zero.

---

## 3. Incident Response: what should you do when a security alert appears?

Start with an important idea:

> **A security engineer's job is not to immediately declare that an intrusion has occurred. It is to determine what happened from the evidence, then take appropriate action.**

### 1. How do Event, Alert, and Incident differ?

Suppose a hospital employee account downloads 500 medical records at 2 a.m.

We must distinguish three ideas.

| Term | Plain-language label | Meaning |
|---|---|---|
| Event | An observed activity or event record | The system observes a large download |
| Alert | A warning | A monitoring tool considers the behavior worth attention |
| Security Incident | A security incident requiring response | Analysis establishes or reasonably suspects a security harm that must be handled through the relevant process |

There are two possible situations.

**Situation A: authorized backup**

Investigation finds that the account is an authorized backup service account that runs a backup every early morning.

The large download may therefore be normal work.

**Situation B: unauthorized access**

Investigation finds that the downloader used a former employee's account, which should no longer have access to medical records.

There is now sufficient reason to initiate the appropriate security-incident handling procedure.

Our judgment needs evidence, not imagination.

### SVG diagram ③ | The complete path from alert to incident response

[Open the original SVG vector diagram](sandbox:/mnt/data/CEH_M01-07_03_警報判讀與事件應變.svg)

### 2. What happens after a security incident is confirmed?

Three actions are particularly easy to confuse:

**Containment**

The aim is to prevent further harm.

For example, after confirming that an account is compromised, restrict its access to the medical-record system according to the incident-handling procedure.

This may not address the root cause of the intrusion, but it can reduce continuing harm.

**Eradication**

The aim is to address confirmed causes of the intrusion or malicious components.

For example, if evidence confirms that an attacker gained access through an unpatched weakness, patch that weakness and address compromised accounts and other affected components.

**Recovery**

The aim is to restore the system to a trustworthy, usable state.

For example, verify that account permissions are correct again, the medical-record system can provide normal services, and no unresolved malicious activity has been found.

A fire analogy can help you remember the difference:

| Security action | Fire analogy |
|---|---|
| Containment | First prevent the fire from spreading |
| Eradication | Extinguish the source and address the cause of the fire |
| Recovery | Restore normal use of the building after verifying safety |

**An important trade-off**

If a hospital's medical-record system is attacked, immediately shutting down the entire system might stop some attack activity—but could also prevent emergency physicians from accessing necessary information.

Incident handling must therefore weigh all of the following:

Security risk, evidence preservation, service availability, and patient safety.

Shutting down equipment, deleting files, or disconnecting the entire network is not always the appropriate response.

### 3. Differences between the old and new NIST SP 800-61 versions

This is an important point to watch when studying CEH.

The older NIST SP 800-61 Rev. 2 commonly explains incident response in four phases:

**Preparation → Detection & Analysis → Containment, Eradication & Recovery → Post-Incident Activity**

This model remains useful for helping beginners understand incident-handling work.

However, NIST formally published SP 800-61 Rev. 3 on **April 3, 2025**, replacing Rev. 2.

The new revision integrates incident response into NIST CSF 2.0. Activities under Govern, Identify, and Protect support everyday risk management and preparation; Detect, Respond, and Recover form the core of the new incident-response life cycle, with continuous improvement feeding lessons back into the organization. [NIST Computer Security Resource Center](https://csrc.nist.gov/projects/incident-response)

Therefore:

**The older four phases help explain the work process; the newer model places greater emphasis on integrating incident response with overall risk management.**

When answering a CEH question, identify the model and version used in that question.

---

## 4. NIST CSF 2.0: how can one map help manage an organization's security?

We now know how to assess risk and how to handle incidents.

But if you were a hospital's chief information officer, how would you check whether security management across the organization was complete?

This is where the NIST Cybersecurity Framework (CSF) can help.

### SVG diagram ④ | The six NIST CSF 2.0 functions and the compliance landscape

[Open the original SVG vector diagram](sandbox:/mnt/data/CEH_M01-07_04_CSF與法遵地圖.svg)

### 1. How should we understand the six functions?

| Function | Plain-language focus | A beginner's question |
|---|---|---|
| Govern | Governance | Who is accountable for security, and who may make risk decisions? |
| Identify | Identification | What assets and risks do we have? |
| Protect | Protection | How do we prevent problems or reduce harm? |
| Detect | Detection | How do we discover possible anomalies? |
| Respond | Response | How should we handle an incident once it is discovered? |
| Recover | Recovery | How do we restore affected services to normal operation? |

Published in 2024, NIST CSF 2.0 added Govern to the core functions, expanding the previous five to six. These functions are not six steps that must be completed in order; they are ongoing aspects of organizational security management. [NIST](https://www.nist.gov/cyberframework/faqs)

### 2. Why is Govern especially important?

Imagine that you are a hospital security engineer.

You discover a high-risk weakness in a medical-record system.

However, patching it requires two hours of downtime and could affect medical services.

Technical expertise alone cannot decide everything.

You also need to know:

Who may approve the downtime? Which medical services cannot be interrupted? Are alternative operating arrangements available? Who is responsible for accepting the risk before the patch is applied?

These are all questions for Govern.

**Governance is not merely management signing documents. It establishes clear accountability, decision-making authority, and oversight.**

---

## 5. Laws, standards, and frameworks: what is the difference?

These concepts are easily confused in CEH.

Use a hospital to understand four different types of requirements.

| Type | In plain language | Example |
|---|---|---|
| Laws & Regulations | Statutory requirements that must be followed when applicable | Taiwan's Personal Data Protection Act |
| Standards | Management or technical requirements | ISO/IEC 27001, PCI DSS |
| Frameworks | Structures for organizing management objectives and capabilities | NIST CSF 2.0 |
| Policies & Procedures | An organization's own rules and operating methods | Medical-record access policy and an incident-reporting SOP |

These categories are not entirely mutually exclusive. For example, a standard's requirements may become binding for a particular organization through legislation, contracts, or procurement conditions.

### 1. What does ISO/IEC 27001 certification actually assess?

ISO/IEC 27001:2022 is the international standard for an Information Security Management System (ISMS).

Its focus is not a single firewall or software product. It concerns whether an organization has established, implemented, maintained, and continually improved an information-security management system. [ISO](https://www.iso.org/standard/27001)

For example, a hospital might need to demonstrate systematic management of:

Assets, information-security risks, personnel responsibilities, access rights, incident handling, and continual improvement measures.

But remember:

**ISO/IEC 27001 certification does not mean that every system is free of vulnerabilities.**

Certification has a defined scope. Even an effectively operating management system does not mean that security incidents can never occur.

### 2. What is PCI DSS?

PCI DSS stands for Payment Card Industry Data Security Standard.

It is an industry standard focused on payment-card account-data security.

For example, a hospital that accepts credit-card payments may need to assess the PCI DSS scope of its payment systems and service providers.

The scope is not limited to systems that directly store card numbers. It may include services that can affect the security of the cardholder data environment. [PCI Security Standards Council](https://www.pcisecuritystandards.org/standards/pci-dss/)

Outsourcing payment services therefore does not automatically remove all of the hospital's responsibilities.

### 3. What about Taiwan's cybersecurity laws?

For Taiwan, begin by recognizing two laws.

The Personal Data Protection Act mainly governs the collection, processing, and use of personal data, including related protection obligations. Some provisions amended in 2025 have not yet taken effect; decisions must be based on the provisions actually in force when consulted. [National Legal Database](https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=I0050021)

The Cyber Security Management Act establishes relevant security-management requirements for government agencies and specified non-government agencies defined by law. Do not assume that all private businesses fall within the same scope. [Ministry of Digital Affairs legal database](https://law.moda.gov.tw/LawContent.aspx?id=FL088622)

The important learning goal is not memorizing every article of law, but developing a method of judgment:

**First establish the organization, information, business activities, and location; then identify the applicable laws, contracts, standards, and reporting obligations.**

---

## 6. Information Assurance: what does it mean?

In M01-01, we introduced the CIA Triad:

Confidentiality, Integrity, and Availability.

In addition to these security objectives, Information Assurance encompasses concepts such as Authentication and Non-repudiation. [NIST Computer Security Resource Center](https://csrc.nist.gov/glossary/term/information_assurance)

Consider the signing of an electronic medical record.

When a physician signs a record, the system may need to establish the user's identity, ensure that the content has not been changed without authorization, and retain verifiable evidence of the signature.

Non-repudiation does not mean that it is absolutely impossible for someone to deny an action. It means that a system can provide appropriate technical evidence to help establish an action or a data source.

For example, a digital signature can help verify data integrity and the signing source, but an actual dispute still requires consideration of key management and other evidence.

---

## 7. A complete worked example: large downloads on the Northstar platform

Suppose you join a company called Northstar as a junior security engineer.

The company provides a service for customers to store private documents.

One morning, you receive this alert:

> Account user017 downloaded 450 documents in ten minutes, exceeding its usual activity.

This is a fictional teaching scenario.

### First question: is this already a security incident?

We cannot determine that yet.

We only know that the system observed a large download and the monitoring tool generated an alert.

You need to investigate whether the account was authorized, what it downloaded, and whether the activity fits normal business operations.

### Second question: how should the evidence be organized?

Use a three-column record.

| Observation | Hypothesis to verify | Decision |
|---|---|---|
| user017 downloaded 450 documents in ten minutes | Was this an authorized batch download? | Preserve the relevant logs according to procedure |
| The download volume exceeded normal activity | Was unauthorized account access involved? | Have the designated personnel determine incident severity |
| The system generated an anomaly alert | Did the data include private information? | Determine whether restrictions are needed |

The important benefit of this method is:

**Separating facts, hypotheses, and decisions prevents the security team from reaching premature conclusions on insufficient evidence.**

### Third question: how can AI help?

Suppose you use AI to help organize incident information.

AI can arrange records from different sources into a timeline, help compare anomalous behavior, and summarize questions requiring further investigation.

But you should not declare a data breach simply because AI says, “This is a high-risk incident.”

A model may misunderstand timestamps, confuse different accounts, or even add details that do not exist in the original records.

Therefore, check the original logs, retain evidence provenance, and follow the organization's rules for sensitive information and AI tools.

### Fourth question: what happens after the incident has been handled?

Suppose the investigation ultimately confirms that a former employee's account was not correctly disabled.

You correct its permissions and confirm that the abnormal access has stopped.

You still need to investigate:

Why did the departure process fail to disable the account? Do other former employees' accounts have the same problem? How can this be checked automatically in the future?

These improvements feed back into risk management.

This shows that:

**Mature security work is not just fixing the affected account. It closes process gaps and reduces the likelihood of similar incidents recurring.**

---

## 8. CEH M01-07 pre-exam review

Prioritize the following concepts in this lesson:

| Priority | Core exam concept | Differences to understand |
|---|---|---|
| ★★★ | Risk Management | Vulnerability, risk, and residual risk |
| ★★★ | Risk Response | Mitigate, avoid, share/transfer, and accept |
| ★★★ | Incident Response | Detection, analysis, containment, eradication, and recovery |
| ★★★ | NIST CSF | Govern, Identify, Protect, Detect, Respond, and Recover |
| ★★★ | Laws vs. Standards | The roles and applicability of laws, standards, and frameworks |
| ★★☆ | ISO/IEC 27001 | ISMS and management systems |
| ★★☆ | PCI DSS | Payment-card data-security requirements |
| ★★☆ | Information Assurance | CIA, authentication, and non-repudiation |
| ★★☆ | NIST version differences | SP 800-61 Rev. 2 and Rev. 3 |

These stars represent this lesson's teaching priorities based on foundational importance, common exam-style situations, and connections across modules. They are not official EC-Council scoring weights.

Across CEH M01, the material can now be connected into one main thread:

**CIA security objectives → Assets, threats, and vulnerabilities → Legal authorization → Attack surface → Models of attacker behavior → Security controls → Risk management and incident response.**

This thread provides a conceptual map to revisit while learning attack and defense techniques in M02–M20.

### SVG diagram downloads

The four diagrams are scalable SVG vector graphics suitable for enlarged reading, printing, or importing into tools that support SVG.

**Publication correction:** The supplied materials include four SVG files. Use the individual diagram links above. The ZIP and PNG bundle mentioned in the manuscript was not supplied, so no unavailable bundle is presented as a download.

---

## 9. Understanding check: use one scenario to test your understanding

Try answering in your own words before checking the answers.

**Scenario:**

A hospital has obtained relevant ISO/IEC 27001 certification.

One day, its security system discovers that an account downloaded a large number of patient records early in the morning.

The information manager says:

“We have ISO/IEC 27001 certification, so a security incident should be impossible. Just dismiss the alert; there is no need to investigate.”

Answer the following four questions:

1. **Risk management:** What might the Asset, Threat, Vulnerability, and Risk be in this scenario? Which are only hypotheses that still require verification?

2. **Incident response:** Why does a large download alone not establish a data breach? Which two types of evidence would you obtain first?

3. **Laws and standards:** Why does ISO/IEC 27001 certification not establish that no security incident occurred? How should reporting requirements be determined?

4. **NIST CSF:** If the investigation confirms that a former employee's account was not disabled, how would you use Identify, Protect, Detect, Respond, Recover, and Govern to improve the overall incident-handling process and management system?

**These four questions check whether you can connect the three main areas of M01-07.** After you answer, I can evaluate each response, identify what you understand and any gaps in reasoning, and explain how a CEH question might change the scenario to test the same ideas.
