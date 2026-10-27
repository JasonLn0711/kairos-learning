# CEH M01-05 | Cyber Kill Chain and MITRE ATT&CK

Module 01: Introduction to Ethical Hacking

## 1. Conclusion first: one views the overall attack, the other examines specific behaviors

Start by remembering these two ideas:

**Cyber Kill Chain helps organize “which broad stage an attack has reached”; MITRE ATT&CK® helps describe “what the adversary did and what they were trying to achieve.”**

They can be used together, but they are not the same table under different names, nor a cell-by-cell translation of each other.

Imagine a café investigating a theft. You could organize the overall event as “prior observation, preparing tools, entering the premises and taking property.” You could also describe it more specifically as “impersonating a delivery driver,” “using a stolen key” and “opening the cash register.” The first view resembles a map of stages; the second resembles a classification of behaviors.

Security incidents are similar. Saying only “we were hacked” is too vague, and listing tool names is not enough either. We need to connect **objectives, behaviors, evidence and defenses**.

These frameworks are useful for reading incident reports, organizing collected records, checking detection gaps and designing authorized validation. First establish the assessment scope, system environment and evidence sources; **the frameworks themselves do not authorize you to test someone else's systems.** This lesson uses only a tabletop example and operates on no real target.

## 2. Cyber Kill Chain: distinguish the seven stages first

Cyber Kill Chain was introduced by Lockheed Martin. This lesson uses the original seven-stage model without mixing in other extensions. Its defensive emphasis is not on waiting for an attack to finish, but on identifying places where it can be detected or interrupted. [Lockheed Martin: Cyber Kill Chain](https://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html)

**1. Reconnaissance**

- Plain meaning: gather information about the target and identify possible points of contact.

**2. Weaponization**

- Plain meaning: prepare an exploitation mechanism and malicious software or similar components as content that can be delivered.

**3. Delivery**

- Plain meaning: send the malicious content into the target environment.

**4. Exploitation**

- Plain meaning: trigger a weakness or other execution condition so that attack code runs.

**5. Installation**

- Plain meaning: install malicious components in the environment to establish a foothold.

**6. Command and Control (C2)**

- Plain meaning: establish communications through which the attacker can issue instructions and receive responses.

**7. Actions on Objectives**

- Plain meaning: carry out objective-driven actions such as theft, modification, destruction or service disruption.

The seven names and their basic meanings can be compared with the original model and EC-Council's explanation. [Lockheed Martin's original paper](https://www.lockheedmartin.com/content/dam/lockheed-martin/rms/documents/cyber/LM-White-Paper-Intel-Driven-Defense.pdf), [EC-Council: the seven stages](https://www.eccouncil.org/cybersecurity-exchange/incident-handling/cyber-kill-chain-seven-steps-cyberattack/)

Beginners often blur the middle steps together. Separate them carefully:

- **Receiving a malicious attachment does not mean the attachment executed.** “It arrived” and “it was actually triggered” are different events.
- **Code execution does not mean a persistent-access mechanism has been installed.** One execution and the ability to return later require separate verification.
- **The presence of C2 does not mean the attacker has every privilege or has stolen data.** Being able to send instructions, successfully executing them and successfully exfiltrating data are different conclusions.

This map does not require every attack to exhibit seven complete, visible steps. For example, simply abusing an acquired cloud account does not necessarily require installing malware on a victim's computer. **When the incident evidence does not fit a stage, leave it as not applicable or unknown; do not invent steps to complete the story.**

## 3. MITRE ATT&CK: separate “why” from “how”

ATT&CK stands for **Adversarial Tactics, Techniques, and Common Knowledge**. Think of it as a continuously maintained knowledge base of adversary behaviors, based on observations from the real world. It is not a scanning tool or a checklist guaranteed to cover every attack. [Getting started with MITRE ATT&CK](https://attack.mitre.org/resources/)

First distinguish four levels:

**Tactic**

- Question answered: what objective is this step intended to achieve?
- Plain-language example: Initial Access—trying to obtain the first opportunity for access.

**Technique**

- Question answered: what class of method is used to achieve the objective?
- Plain-language example: Phishing—contacting and manipulating a target through phishing.

**Sub-technique**

- Question answered: which more specific form of that method is used?
- Plain-language example: Spearphishing Attachment—using a targeted malicious email attachment.

**Procedure**

- Question answered: how was the method actually used in a particular incident?
- Plain-language example: an email impersonating a supplier disguises a malicious file as a purchase breakdown.

**A tactic is an objective; a technique is a method; a sub-technique is a more specific category of method; a procedure is its concrete implementation in an incident.** The final example is hypothetical teaching material, not a real incident documented by MITRE. [MITRE: definitions of the four terms](https://attack.mitre.org/resources/faq/)

Consider these real identifiers:

**Initial Access → Phishing (T1566) → Spearphishing Attachment (T1566.001)**

T1566.001 is a behavior classification identifier, not a vulnerability identifier or a certificate of “successful attack.” MITRE places this sub-technique under the Initial Access tactic, but the label describes a behavior's objective and type. A blocked phishing attachment may still represent such an **attempt**; it does not establish that the adversary got in. [MITRE: T1566.001](https://attack.mitre.org/techniques/T1566/001/)

Later, you will also encounter tactics such as Execution, Persistence, Discovery, Lateral Movement, Collection and Exfiltration. You do not need to memorize every identifier now. First learn to ask, when observing a behavior: “what is it trying to achieve, and what does the evidence show about how it was done?”

## 4. How can the frameworks be used together? Do not treat them as a fixed progression through levels

**Primary perspective**

- Cyber Kill Chain: stages of attack activity.
- MITRE ATT&CK: adversary behaviors and objectives.

**Questions they help answer**

- Cyber Kill Chain: how far has this activity progressed, and where can it be interrupted?
- MITRE ATT&CK: which specific methods were used, and can we detect them?

**Representation**

- Cyber Kill Chain: a conceptual chain of seven stages.
- MITRE ATT&CK: a classification of tactics, techniques and sub-techniques.

**Common misuse**

- Cyber Kill Chain: filling in all seven steps without evidence.
- MITRE ATT&CK: treating the matrix from left to right as a mandatory sequence.

**ATT&CK is not a timeline.** Attackers may repeat a behavior, skip tactics or conduct different activities concurrently. Adjacent matrix columns do not imply a necessary chronological order. [CISA: ATT&CK Mapping Best Practices](https://www.cisa.gov/sites/default/files/publications/Best%20Practices%20for%20MITRE%20ATTCK%20Mapping.pdf)

There is no one-to-one relationship between the two frameworks either. Cyber Kill Chain's “Actions on Objectives” is broad. More detailed behavioral analysis might involve different objectives such as collection, exfiltration or destruction. Therefore, identifying the seventh stage does not automatically justify adding every related ATT&CK technique.

ATT&CK also describes **behavior**. Even if two incidents use the same phishing method, a shared identifier alone cannot establish that the same person or organization is responsible.

## 5. Specific example: Northstar receives a “purchase breakdown” email

This is an entirely hypothetical teaching scenario. Northstar is an online learning platform. Employee computers support ordinary work but have no permission to read students' private answer data.

Assume investigators, acting under legal authorization, obtain email, endpoint and access records that establish the following case:

**The email impersonates a supplier; how the sender learned the contact's details is unknown.**

- Supported interpretation: the source of reconnaissance information remains unknown.
- Evidence boundary: do not immediately conclude that the company's address book was stolen.

**Attachment analysis confirms that it contains malicious content.**

- Supported interpretation: the finished product of weaponization can be analyzed.
- Evidence boundary: this does not establish where, when or by whom it was made.

**Mail records confirm that the attachment reached the employee's inbox.**

- Supported interpretation: Delivery; the targeted malicious attachment behavior can be mapped to T1566.001.
- Evidence boundary: arrival does not mean opening or execution.

**Separate endpoint and sample evidence confirms that a vulnerability in the reader application was exploited to execute malicious code.**

- Supported interpretation: Exploitation; T1203 may apply.
- Evidence boundary: not every instance of “opening an attachment” supports this conclusion.

**Endpoint records confirm that a malicious component was written and installed.**

- Supported interpretation: Installation.
- Evidence boundary: writing a file alone still does not establish persistent access after a restart.

**Correlated analysis confirms that the component exchanged attack commands and responses over HTTPS.**

- Supported interpretation: C2; T1071.001 may apply.
- Evidence boundary: an HTTPS connection alone is not proof of C2.

**The malicious process attempts to read students' private data, but access control denies it.**

- Supported interpretation: an attempt to advance toward the attack objective occurred; this read was blocked.
- Evidence boundary: do not claim that the data leaked, or use this result to guarantee that all data is safe.

T1203 concerns exploiting client software vulnerabilities to execute code. Apply it only when corresponding evidence exists; do not classify all attachment execution this way. [MITRE: T1203](https://attack.mitre.org/techniques/T1203/)

T1071.001 describes using web protocols for C2. HTTPS is also widely used for legitimate work, so context such as the process, destination, timing and communication purpose is needed. The protocol name alone does not establish malice. [MITRE: T1071.001](https://attack.mitre.org/techniques/T1071/001/)

The real skill this example develops is not “how many labels you added,” but this: **every label should sit beside an observation that supports it and a boundary that its conclusion must not exceed.**

## 6. Bring defenses back to “what to block, what to observe and how to verify”

For the hypothetical case above, the following defensive designs could be proposed. Their effectiveness must still be verified in your authorized environment; installed products alone are not proof.

**Email filtering and attachment inspection**

- Defensive objective: reduce the likelihood that malicious content reaches users.
- Verification focus: was the email actually blocked or quarantined, or did the system merely generate a warning?

**Software security updates and execution restrictions**

- Defensive objective: reduce opportunities for vulnerability exploitation and improper code execution.
- Verification focus: did the update actually take effect? Does safe, authorized validation produce the expected result?

**Endpoint behavior monitoring**

- Defensive objective: detect abnormal execution, installation and subsequent activity.
- Verification focus: are observations tied to the correct device, process and time? Does someone handle the alerts?

**Necessary outbound connection restrictions**

- Defensive objective: limit unnecessary communications.
- Verification focus: did the rule actually block the connection? Do legitimate business functions still work?

**Least privilege and data-access auditing**

- Defensive objective: limit the data reachable even if an account or process is affected.
- Verification focus: use synthetic data and authorized test accounts to confirm that prohibited reads are denied while permitted reads still succeed.

Placing defenses at different stages avoids depending on a single checkpoint. AWS's official analysis also uses the attack chain to organize detection and disruption measures at different stages. [AWS: defensive intervention at each stage](https://docs.aws.amazon.com/whitepapers/latest/classic-intrusion-analysis-frameworks-for-aws-environments/stopping-intrusion-methods.html)

Maintain three habits when writing incident conclusions:

1. **Write the observation first, then the classification.** For example, begin with “mail records show that the attachment was quarantined,” not “the intrusion succeeded” followed by a search for justification.
2. **Distinguish attempts, success and impact.** Attempting to read, successfully reading, successfully copying and successfully exfiltrating are different events.
3. **Preserve unknowns.** A missing record might mean that an event did not occur, but it might also reflect missing logging, expired retention or an incomplete query scope. Do not turn “not found” into “guaranteed absent.”

Likewise, an ATT&CK label on a detection rule only claims coverage of a behavior. You still need to test whether the data is collected, the rule works, false positives are acceptable and a real alert can be handled. **Classification is not a substitute for validation.**

## 7. Key points and one quick check

Take away four points today:

- Cyber Kill Chain: examine stages and identify intervention points.
- MITRE ATT&CK: examine objectives and behaviors, providing a shared language for analysis.
- Do not force all seven stages into an incident or treat ATT&CK as a fixed chronological sequence.
- A behavior label does not mean a successful attack; let evidence determine the conclusion.

**Quick check:**

A company receives a targeted email containing a malicious attachment, but its email gateway quarantines it. No evidence has been found that the attachment executed on an employee computer. An analyst writes: “This matches T1566.001, so we have confirmed that the attacker successfully intruded and stole data.”

**How would you correct that conclusion?** Explain briefly in your own words; you do not need to memorize the identifier.

You can answer this question first. I will assess your understanding after receiving your actual answer.
