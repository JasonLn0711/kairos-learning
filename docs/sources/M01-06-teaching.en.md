# CEH M01-06 | Security Controls and Defense in Depth

Module 01: Introduction to Ethical Hacking

Suggested reading time: 8–12 minutes. This is unit 6 of the new route. Receiving a lesson and demonstrating understanding are separate outcomes.

## 1. Start here: What remains if one safeguard fails?

Security controls are the safeguards we actually use to protect information and services. Defense in depth arranges different safeguards at different points, so another measure can still block an action, detect a problem, limit damage, or support recovery when one measure does not stop it.

The central idea: installing a security product does not prove that protection works. Owning many products does not automatically create defense in depth.

Imagine you run a coffee shop with cash in a safe. A “Do not steal” sign alone would not make the cash safe. You might lock the shop, restrict who holds the safe key, install an alarm, and decide who responds when it rings.

The door lock reduces opportunities to enter. The alarm draws attention to unusual activity. Key management limits access to the cash. These measures address different problems rather than repeating the same function under different names.

The same reasoning applies to information security. This lesson uses fictional design examples; it does not require testing real websites or accounts.

## 2. A security control is not just a firewall or antivirus product

M01-01 introduced confidentiality, integrity, and availability. M01-02 connected assets, threats, vulnerabilities, and risk. We now ask: What do we actually do to reduce those risks?

Consider a learning platform that stores private student answers:

- Apply appropriate read permissions to keep unauthorized people from viewing them.
- Restrict who may edit answers and record changes to help protect integrity.
- Keep protected backups and test restoration so damaged data does not permanently interrupt the service.

All of these may be security controls. NIST uses the term for safeguards or countermeasures that protect systems and information and meet security requirements, not for one particular type of product. [NIST: Security Control](https://csrc.nist.gov/glossary/term/security_control)

An introductory way to group controls is by how they are implemented:

1. Management and people-related processes: remove accounts when staff leave, review permissions regularly, and train employees to recognize suspicious requests. Ask who is responsible, when the work happens, and what evidence is kept.
2. Technical measures: permission checks, authentication, network connection restrictions, and encryption. Ask how the system actually enforces its rules.
3. Physical measures: controlled access to equipment rooms, locked cabinets, and equipment protection. Ask who can touch, remove, or damage the equipment.

This is a learning aid, not a claim that every standard uses the same classification. NIST's control catalog spans access, personnel, physical environments, incident handling, and other areas. You do not need to memorize the catalog now. First understand that people, processes, and technology must work together. [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)

## 3. Also ask what function a control performs

“How is it implemented?” and “What does it do?” are different questions. Three common functions in security questions are prevention, detection, and correction.

### Preventive control: Reduce the chance of an unwanted action succeeding

For example, only authorized instructors may edit grades. The system rejects edit requests from other accounts.

The important part is not merely writing “Do not edit grades” in a handbook. The system must actually check identity and permission, then reject requests that do not meet the rule.

Multi-Factor Authentication, or MFA, is another common example. It requires different types of authentication factors, such as a password and a security key you possess, rather than relying on one password alone.

However, passing a login check does not authorize access to every file. Authentication and data authorization still require separate design.

### Detective control: Reveal suspicious activity or violations

For example, the system records unusually large downloads by an account and alerts a responsible person to review them.

Detection can reveal a problem, but “an alert was generated” does not mean “the download was blocked.” If the system only sends a notification, the download may continue.

An alert also does not necessarily prove an attack. An instructor legitimately downloading teaching material might trigger a rule. A false positive is a normal situation incorrectly flagged as suspicious.

### Corrective control: Fix an unsafe state after identifying a problem

For example, correct sharing permissions after discovering that a private folder was made public. After confirming account abuse, revoke affected access according to procedure and address the cause.

Correcting a setting can prevent some future access, but it cannot retrieve copies already taken. A completed correction therefore does not prove that an investigation is complete or that risk is zero.

You may also see recovery listed as a function. It focuses on returning data and services to a usable, trustworthy state, for example by restoring a verified backup. Textbooks may draw the boundary between correction and recovery differently. Read the action described in the question instead of guessing from a product name.

One tool can serve several functions. Alert-only mode provides detection; a configured rule that automatically rejects certain connections may also provide prevention. Actual configuration and behavior matter more than advertising labels.

## 4. Defense in depth: Put the asset at the center and examine possible paths

Picture private answer data at the center of a diagram, with people, accounts, applications, and computers around it.

Now consider a fictional path: an outsider obtains an employee's password and tries to log in. If login succeeds, they try to read or change private data.

Different controls can address different points:

- At login: a leaked password alone should not be enough; additional authentication requirements must be met.
- At the account and permission boundary: a logged-in employee receives only the functions needed for the job.
- At the data boundary: the service checks authorization on each read or write.
- At the monitoring boundary: unusual access is recorded and an actionable alert reaches a responsible person.
- For recovery: important data has protected backups that can actually be restored.

These are five example design points, not a mandatory five-layer model for every system. NIST describes defense in depth as combining people, technology, and operational capabilities across multiple layers. It is not simply adding more devices at the network perimeter. [NIST: Defense in Depth](https://csrc.nist.gov/glossary/term/defense_in_depth)

One useful principle is least privilege: give users and processes only the access needed for their assigned tasks. A general customer-support account, for example, does not need the ability to change every grade. [NIST: Least Privilege](https://csrc.nist.gov/glossary/term/least_privilege)

This helps limit the damage an affected account can cause. But actual permissions and exceptions must be checked; a written policy alone does not enforce least privilege.

### Layers are not the same as repeated copies

Imagine three monitoring tools that all rely on the same incomplete log. They may all miss the activity that the log never captured.

Or imagine that the same compromised administrator account can delete production data and every backup. Several copies may exist, but all may fail together.

These fictional counterexamples show why we must ask which layers share a failure point, not simply count the layers.

CISA's ransomware guidance emphasizes protected backups and restoration testing because attackers may also delete or encrypt reachable backups. Synchronizing files somewhere else does not necessarily preserve a usable earlier version. [CISA: StopRansomware Guide](https://www.cisa.gov/sites/default/files/2023-10/StopRansomware-Guide-508C-v3_1.pdf)

## 5. A complete example: An access attempt at Northstar

This is a fictional teaching case, not a real incident report.

Northstar's customer-support staff need access to ordinary service tickets, but not to students' private answers. The platform separates these permissions.

One day, investigators identify an abused customer-support login session. A session is the state through which a system recognizes an already authenticated interaction. For this example, assume the session is being abused. We do not assume how it was obtained, and this fact alone does not prove that MFA itself failed.

1. Someone tries to read private answers. The data service checks permissions and rejects the request.
   A preventive control has worked for that request: being logged in does not grant permission to read the data.

2. Audit records capture the account, target, time, and denial. A rule alerts on repeated unusual attempts.
   Detection-related measures help people discover what is happening.

3. After checking the evidence, the responsible person revokes the affected session according to procedure and checks for other activity.
   This is part of response and correction. Changing a password alone must not be assumed to invalidate every existing session; check the product's actual behavior.

4. If other data was modified or damaged, responders may restore a verified version and check it again based on investigation findings.
   This is a conditional recovery action, not a claim that data damage has already occurred in the case.

The login boundary could not protect the data on its own, but the data permission check still blocked this read, and monitoring enabled a response. That is the room for protection that defense in depth aims to preserve.

The conclusion remains limited: this verified read request was denied. Other requests and systems still need review; this is not proof that no data was exposed anywhere.

## 6. How do we know a control works? Check configuration and outcomes

A security professional should do more than collect a list of purchased products. Connect the protection objective, actual settings, and assessment evidence.

NIST control assessment methods include examining, interviewing, and testing. In plain language: inspect documentation and settings, ask responsible people how the process works, and check actual behavior against expected behavior under defined conditions. [NIST: Control Assessment](https://csrc.nist.gov/Projects/risk-management/about-rmf/assess-step/assessment-cases-overview), [NIST SP 800-53A Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/a/r5/final)

For our example, an explicitly authorized, isolated test environment could use synthetic data and test accounts to check:

- Is a support account's attempt to read private answers actually denied? A hidden menu button is not sufficient evidence.
- Can a legitimate instructor still read the correct teaching data? Rejecting every request can harm availability.
- Does unusual activity create accurate records? Does the alert reach the person responsible for handling it?
- Does a restoration test recover correct, usable data? A successful backup job is not proof of successful restoration.

Keep three parts separate in a report:

- Observation: this test account's read request was rejected.
- Inference: this permission control may reduce the risk of similar unauthorized reads.
- Limitation: only specified accounts, data, and conditions were tested. Exceptions may remain untested.

No alert does not prove that nothing unusual happened. An alert does not prove a successful attack. Check log completeness, rule coverage, and test conditions before drawing conclusions.

## 7. Controls have trade-offs

More or stricter controls are not automatically better. Each additional measure can add cost, maintenance, or friction.

Excessively awkward login procedures may encourage unsafe workarounds. More alerts than a team can handle may hide important notifications. An incorrect connection restriction may interrupt a legitimate service.

Before adding a control, ask: What asset and risk does it address? Who maintains it? How will we know it works? Could it prevent necessary work?

When a planned control cannot be implemented, an organization may evaluate a compensating control: an alternative intended to provide the required protection. Adding an arbitrary rule does not prove equivalent protection, a fixed problem, or compliance. Applicable requirements, equivalence, and remaining risk must be considered. [NIST: Compensating Security Control](https://csrc.nist.gov/glossary/term/compensating_security_control)

M01-02 separated vulnerability from risk. Add another distinction today: having controls does not eliminate risk. Their suitability and operation affect risk, but unresolved exposure must remain visible.

## 8. Takeaways and one quick check

Keep four questions in mind:

1. Security controls: What specific measures protect the asset?
2. Prevention, detection, and correction: Are we blocking, noticing, or fixing a problem?
3. Defense in depth: If one measure does not stop an action, can others still limit the harm?
4. Effectiveness: What authorized tests and actual evidence support the claim?

Quick check:

A platform requires MFA, but an employee's existing login session is abused. A permission control rejects a request to read private answers, and the system issues an alert. An administrator says: “Because we have MFA and an alert, we can prove that no data was exposed. Our backup job also succeeded, so we do not need to test restoration.”

In your own words: Which observation supports the claim that this read was blocked? Why are the administrator's other two conclusions not yet justified?

A short explanation is enough; there is no need to memorize terminology. The website's reference answer is placed in a closed answer section. Publishing an answer is not evidence that a learner has answered or understood it.
