# CEH M01-07 | Risk Management, Incident Response, Laws and Standards

Module 01: Introduction to Ethical Hacking

Suggested reading: 10–12 minutes. This is unit 7 of the new route and the closing lesson of M01. Delivery is not proof of understanding.

## 1. The main idea: security requires ongoing, evidence-based decisions

This lesson connects the previous six: decide which risks to address, respond methodically to unusual activity, and understand which requirements apply.

Risk management asks: With limited people and budget, what should we address first, how, and who owns the decision?

Incident response asks: When a security incident is suspected or confirmed, how do we investigate, limit harm, and recover?

Laws and standards help distinguish binding obligations from resources used to organize or evaluate security.

These subjects work together. Risk management guides preparation; incident lessons improve management; applicable laws, contracts, and requirements constrain the whole process.

Imagine running a coffee shop. Spending all your money on locks would not fix unsafe wiring, keys retained by former employees, or uncertainty about who handles an emergency. Passing one inspection also would not guarantee permanent safety. The same applies to information security.

## 2. Risk management is more than listing vulnerabilities

M01-02 introduced assets, threats, vulnerabilities, and risks. A weakness does not prove a compromise, and the same weakness can create different risks.

Two folders might have the same incorrect permissions, but one contains public posters and the other private records. Their urgency depends on exposure, sensitivity, existing controls, and potential consequences, not merely the fact that both have one permissions problem.

Risk management is ongoing rather than a single scan. NIST SP 800-39 considers organizational, mission, and information-system perspectives. Technical staff supply evidence, while appropriate management roles also participate in resource, responsibility, and risk decisions. [NIST SP 800-39](https://csrc.nist.gov/pubs/sp/800/39/final)

For learning, organize the work around five questions:

1. What are we protecting, including information, services, and people who depend on them?
2. How could harm occur, and what evidence supports that scenario?
3. What comes first, considering likelihood, impact, exposure, and existing controls?
4. What action is chosen, who owns it, and when will it be reviewed?
5. What risk remains, and does the assessment still hold when circumstances change?

This is a teaching aid, not a separate official five-step model.

### Common risk responses

- Mitigate: reduce likelihood or impact, for example by correcting permissions and testing the result.
- Avoid: stop an activity that creates a risk, such as removing an unnecessary public-sharing feature. This may sacrifice convenience.
- Transfer or share: use contractual or insurance arrangements to allocate some responsibilities or losses. The technical risk does not vanish, and not every obligation can be handed away.
- Accept: an authorized responsible person knowingly decides to retain a risk, recording the rationale and review conditions. Forgetting to fix something is not risk acceptance.

These directions align with NIST's risk-response terminology. Choices remain subject to applicable obligations; saying “we accept the risk” does not replace duties that must be fulfilled. [NIST: Risk Response](https://csrc.nist.gov/glossary/term/risk_response)

Residual risk is what remains after the response. Restricting downloads may reduce future exposure, but it cannot prove that nobody copied information earlier.

## 3. Incident response: an alert is not an automatic compromise verdict

Distinguish three ideas:

- Event: an observed occurrence, such as a login, download, or stopped process.
- Alert: a notification that a condition deserves attention.
- Security incident: a situation judged to involve a security impact or policy violation that calls for handling under the organization's process.

These are introductory distinctions. In practice, use the adopted incident definition and reporting criteria. Not every record is an incident, and absence of alerts is not proof of safety.

Downloading many files in ten minutes might be suspicious or an authorized backup. Investigators need identity, authorization, actions, and timing, not just a count.

Incident response includes more than repairing computers afterward. The current NIST SP 800-61 Rev. 3, published in April 2025, integrates response into ongoing cybersecurity risk management and supports preparation, detection, response, and recovery. [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)

A useful mental sequence is: prepare roles, access, and records; investigate and assess unusual activity; take authorized action to limit harm and address causes; validate recovery; feed lessons back into management.

Important actions include:

- Containment: limit further impact, such as restricting an affected account or connection under an approved process.
- Eradication: address confirmed causes or malicious components, not merely silence an alert.
- Recovery: restore a usable, trustworthy state, verify it, and monitor afterward.
- Lessons learned: improve detection, authorization, training, and procedures.

These activities can repeat. They are not always a clean one-way sequence. Neither “always power off first” nor “always delete the file first” is a sound universal rule: those actions can disrupt essential services or change evidence. Authorized responders must consider context, impact, and established procedures.

### Older teaching models and current guidance

You may encounter the older four-phase model: preparation; detection and analysis; containment, eradication, and recovery; and post-incident activity.

NIST identifies SP 800-61 Rev. 2 as withdrawn on April 3, 2025 and superseded by Rev. 3. The older phases can still help explain the work, but should not be presented as the sole formal structure of current Rev. 3. Identify the source or version specified by an exam question. [NIST: Rev. 2 status](https://csrc.nist.gov/pubs/sp/800/61/r2/final)

## 4. NIST CSF: a shared map of required capabilities

NIST is the US National Institute of Standards and Technology, not the name of a certificate.

CSF means Cybersecurity Framework. Think of a framework as a map for goals and gaps, not a program that configures your firewall.

CSF 2.0 has six Functions:

1. Govern: establish direction, responsibilities, rules, and oversight.
2. Identify: understand assets and risks.
3. Protect: implement safeguards to reduce risk.
4. Detect: find and analyze potentially adverse activity.
5. Respond: handle and coordinate actions during incidents.
6. Recover: restore affected services and capabilities.

These are interconnected areas of work, not six gates completed once forever. Governance and preparation continue; response and recovery depend on capabilities established beforehand. CSF 2.0 includes Govern, unlike the five-Function CSF 1.1 model. [NIST CSF FAQ](https://www.nist.gov/cyberframework/faqs), [NIST CSF 2.0 release](https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework)

## 5. Laws, standards, frameworks, and policies have different roles

When you see an acronym, ask what kind of instrument it is, who it applies to, and which scope it covers. Do not call all of them certifications.

1. Laws and regulations create obligations under the applicable legal system. Applicability depends on jurisdiction, industry, information, and circumstances. This lesson does not determine obligations in a real case or apply one country's notification deadline universally.
2. Standards set requirements or describe practices. Whether a law, contract, or procurement requirement makes a particular standard applicable requires separate checking.
3. Frameworks organize capabilities, outcomes, and gaps, as NIST CSF does.
4. Internal policies and procedures define organizational rules and how to carry them out, including who approves disclosure and who receives incident reports.

### ISO/IEC 27001: management-system requirements

ISO is the International Organization for Standardization; IEC is the International Electrotechnical Commission. ISO/IEC 27001:2022 specifies requirements for an Information Security Management System, or ISMS. An ISMS is an organizational management system, not just a software package.

The standard addresses establishing, maintaining, and continually improving information-security management. Examine the scope of any assessment or certification; its name alone does not establish that every product and system is free of vulnerabilities. [ISO official overview](https://www.iso.org/standard/27001)

### PCI DSS: a payment-data industry standard

PCI DSS means Payment Card Industry Data Security Standard. It provides technical and operational requirements for protecting payment account data. Its audience includes organizations that store, process, or transmit relevant data, or can affect the security of the cardholder data environment.

It is therefore not limited to organizations that store card numbers. Nor is it a universal guarantee covering every information asset and every law. [PCI SSC: PCI DSS](https://www.pcisecuritystandards.org/standards/pci-dss/)

In short: frameworks organize work, standards provide requirements, laws and contracts establish applicable obligations, and internal procedures make the work happen. Meeting some requirements does not eliminate all risk.

## 6. Worked example: a large-download alert at Northstar

This is a fictional teaching example, not a real user's incident.

Northstar stores private customer documents. The team identified incorrect sharing permissions as a possible disclosure risk and established permission reviews, access records, and a contact path.

One day, a tool flags large downloads by an account:

- Investigate: whose account is it, what was downloaded, is it work-related, and are the records complete? At first, the evidence supports an observed download pattern, not a theft conclusion.
- Evaluate and act: if evidence indicates unauthorized access, follow the process to establish ownership and scope. Necessary restrictions must account for evidence and service impacts; responders should not independently delete large amounts of data.
- Check obligations: responsible people assess applicable laws, contracts, and known facts to determine notifications and record preservation. A single deadline found online is not universally applicable.
- Recover and validate: after correcting permissions or handling the affected account, verify that legitimate work still functions and the identified issue is controlled.
- Improve: if the approval process was inadequate, repair responsibility and review arrangements rather than only closing the alert.

Risk management supports preparation; response handles the specific situation; legal, contractual, and standards requirements provide boundaries.

## 7. Evidence and AI assistance: useful support, not automatic conclusions

Information Assurance, or IA, is another introductory term. It concerns protecting information and systems, including CIA and goals such as authentication and non-repudiation. Non-repudiation can initially be understood as providing verifiable evidence supporting attribution of an action or origin, not automatically settling every dispute. [NIST: Information Assurance](https://csrc.nist.gov/glossary/term/information_assurance)

The current official CEH course also covers AI-assisted cybersecurity work. AI does not replace authorization, evidence, or incident judgment. [EC-Council: CEH](https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/)

For example, AI can help organize an authorized, anonymized incident timeline. A human still needs to check original records so that timestamps, identities, and causal links are not invented. Do not paste private raw records or secrets into an unapproved external service.

Three categories help keep reports honest:

- Observed: what does each source actually record, at what time and within what scope?
- To verify: what explanations remain plausible, and what evidence is missing?
- Decided: who authorized which action, on what grounds, and when will it be reviewed?

A “high risk” label is not a complete risk decision. Passing an inspection is not permanent safety. Closing an alert is not proof that an incident is resolved.

## 8. Summary and one quick check

Remember:

1. Risk management makes and revisits evidence-based priorities.
2. Response investigates, limits harm, addresses causes, restores, and improves. It is not just deletion or alert closure.
3. Laws and standards require attention to type, scope, and version; they are not interchangeable security guarantees.

Quick check:

A company says: “We have ISO/IEC 27001-related certification, so the large-download alert must be a false positive. We closed the alert, so no investigation or further risk assessment is needed.”

Explain the unsupported leaps. Which two kinds of evidence would you seek before declaring either safety or compromise?

A short answer is enough. The reference answer is kept separately for the website's collapsed answer section. Your actual response and demonstrated understanding remain unverified.
