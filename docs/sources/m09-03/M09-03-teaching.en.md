# CEH M09-03 | Vishing, Smishing, and Impersonation

**Module 09: Social Engineering**  
**Topic: Voice phishing, SMS phishing, and impersonation**

This lesson continues M09-02's discussion of **phishing: deceptive communications that persuade people to disclose information or take unsafe actions**. The previous lesson primarily asked, “Who is being targeted?” This lesson asks, **“Which channel is being used, and what makes the claimed identity believable?”**

No knowledge of telephone systems or network configuration is required. We will start with an everyday situation and connect it to authentication, verification codes, controls, and evidence. Read in sections if helpful; there is no need to finish everything merely to keep pace with a schedule.

## 1. If a text and a phone call confirm each other, are they trustworthy?

Northstar Learning Center, the people, and the events below are fictional. They are used only for reasoning practice. No messages were sent to real targets and no real systems were tested.

Lin is preparing course materials when a text arrives. It claims that the learning platform has detected an unusual login and asks him to contact support.

Shortly afterward, someone calls and claims to be platform support. The caller knows Lin's name and the course-material project. The phone display also shows a familiar service name. The caller offers to “cancel the unusual activity” and asks Lin to read out the login verification code he has just received.

Lin might think:

> First the text warned me, then support called. They even know my work. Surely this is genuine?

From a security perspective, we currently know only that a text arrived and someone called. **If one attacker arranged both channels, they are coordinated claims, not two independent confirmations.**

The key idea for this lesson is:

**Looking familiar, sounding familiar, or knowing your circumstances does not establish identity. Even a verified identity does not authorize every request.**

## 2. Three terms: two describe channels; one describes pretending to be someone else

### Vishing: voice phishing

Vishing combines **voice** and **phishing**. It involves deceptive calls, voice conversations, or voice messages that try to make a person disclose information or take unsafe action.

For example, someone poses as IT staff and requests login information. The key is using voice interaction to gain trust. A telephone call alone is not an attack, and a fabricated voice is not required. A real person speaking normally can conduct vishing. [Canadian Centre for Cyber Security: Vishing](https://www.cyber.gc.ca/en/what-voice-phishing-vishing-itsap00102)

The requested action might involve a password, account approval, payment, documents, or remote assistance. **Legitimate support teams also make calls, so assess the deception, purpose, and requested action—not just the tool.**

### Smishing: SMS phishing

Smishing combines **SMS (Short Message Service, mobile text messaging)** with phishing. A deceptive text attempts to obtain sensitive information, lead someone to a fake website, or induce another unsafe action.

A message might claim there is a delivery, billing, or login problem and direct the recipient to a new destination. A text can contain a link, but it can also request a reply or a phone call. No link does not mean no risk. [Canadian Centre for Cyber Security: Smishing](https://www.cyber.gc.ca/en/guidance/smishing-protect-yourself-sms-attacks-itsap00103)

Use SMS as the basic channel associated with this term. Messaging apps can also carry phishing and impersonation, but do not automatically label every written message as smishing without considering its channel.

### Impersonation: pretending to be another identity

Impersonation means posing as another person, role, or organization to borrow the trust associated with that identity.

Examples include pretending to be support staff, a manager, a colleague, or a visiting supplier. It describes **who the attacker pretends to be**, not a particular channel. It can occur by phone, SMS, email, messaging app, or in person. Official social-engineering guidance identifies impersonation of trusted people as a common technique. [Canadian Centre for Cyber Security: Social engineering](https://www.cyber.gc.ca/en/guidance/social-engineering-itsap00166)

| Term | Main question | Example in this lesson |
| --- | --- | --- |
| Vishing | Which channel is used to induce action? | A phone call requesting a login code |
| Smishing | Which channel is used to induce action? | A deceptive SMS about a fabricated incident |
| Impersonation | Which identity is used to gain trust? | Claiming to be platform support |

**These are not mutually exclusive choices.** One incident can begin with smishing, continue with vishing, and involve impersonation throughout. NIST, the US National Institute of Standards and Technology, also describes phishing across communication channels. [NIST: Phishing channels and defenses](https://www.nist.gov/blogs/cybersecurity-insights/phishing-resistance-protecting-keys-your-kingdom)

## 3. Connect to the previous lesson: target, channel, and identity are different dimensions

In M09-02, **spear phishing** described content tailored to particular targets, while **whaling** described targeting senior, high-value people.

Vishing and smishing primarily describe the communication channel.

If investigation confirms that someone gathered Lin's work details and tailored the approach, we could describe the case as “targeted phishing against Lin, using SMS and voice while impersonating platform support.” That is more informative than forcing the event into only one category.

Likewise, someone saying “I am the company president” does not automatically make an incident whaling. Separate these questions:

- **Who is targeted?** Who is supposed to act?
- **Which channel is used?** Voice, SMS, or something else?
- **Who is impersonated?** Which identity lends credibility?
- **What action is requested?** Disclosure, login, payment, permissions, or another action?

This four-question approach is a teaching aid, not an official sequence of attack stages.

## 4. Why caller ID, voice, and personal details are insufficient

### Caller ID is a displayed clue, not complete identity proof

**Caller ID** is the name or number displayed for an incoming call. **Spoofing** means making identifying information appear to come from a different source; here, the relevant example is caller-ID spoofing.

Caller ID can be manipulated. A bank or company number on the screen does not, by itself, establish that the person speaking represents that organization. [US Federal Trade Commission: Recognizing scams](https://consumer.ftc.gov/articles/how-avoid-scam)

Distinguish the overall technique from one supporting mechanism:

- **Impersonation:** posing as support staff or a manager.
- **Caller-ID spoofing:** manipulating the displayed name or number, one possible technical aid.

Someone can call from an ordinary unfamiliar number and verbally impersonate support. Impersonation therefore does not require caller-ID spoofing.

### A familiar voice creates familiarity, not certainty

**AI (artificial intelligence) voice cloning** can generate audio resembling someone's voice. Official consumer guidance warns that a familiar voice can be imitated. [FTC: Voice cloning and emergency scams](https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes)

Do not reverse that observation into “an odd voice proves an AI attack.” Connection quality can also distort audio. Conversely, natural, fluent speech does not establish safety.

**The defensive goal is not to recognize every artificial voice by ear. It is to avoid making important operations depend only on voice.**

### Knowing your circumstances does not grant authority

Lin's name and project might appear publicly or might have come from other sources. Hearing those details does not establish where the information came from, who is speaking, or what they are allowed to request.

This is a reasoning boundary: **knowing a fact is different from being entitled to make decisions about an account.** You do not have to prove how background information was obtained before pausing a suspicious request.

## 5. What trust boundary needs protection?

The caller is not simply asking Lin to chat. The caller wants a code that could help complete an account operation.

**Authentication** establishes whether the person using a service controls the evidence required for the claimed identity. **Authorization** determines which actions that person may perform.

An everyday comparison: confirming that someone is an employee does not mean handing them every key in the building.

Even after verifying that a caller really is a colleague, ask: May this information be shared with them? Can they approve this payment? Have the required steps been completed?

### Why a genuine login code does not authenticate the caller

An **OTP (one-time password or verification code)** is generally valid under limited conditions and helps verify an operation. It might genuinely come from the platform without making the person asking you to read it aloud genuine support.

In our fictional scenario, someone attempting a login elsewhere could cause the real platform to send a code to the account holder. If the account holder is deceived into sharing it, another person might complete that verification. This describes a risk, not an established incident outcome. Records are needed to determine whether it succeeded.

**MFA (multi-factor authentication)** uses different types of authentication factors, such as a password combined with a device in the user's possession. It strengthens protection, but different MFA methods do not provide identical phishing resistance.

NIST distinguishes manually entered OTP and similar authenticator outputs from phishing-resistant methods: manual entry does not bind the output to the specific authenticated session, allowing it to be relayed to the real service. A **session** here is the particular authenticated interaction or connection context. [NIST SP 800-63B-4: Phishing resistance](https://pages.nist.gov/800-63-4/sp800-63b.html#phishres)

For now, remember:

- Initiating an operation yourself through a trusted entry point is different from supplying a login code at an unexpected caller's request.
- Do not give login codes, passwords, or recovery codes to an unverified caller.
- A claim that something is “for security” does not justify disabling protection or approving authentication you did not initiate.
- Phishing-resistant authentication protects the authentication step; it does not decide whether every payment or disclosure is appropriate. M09-06 will examine the broader controls.

## 6. Analyze the complete Northstar case: identify risk, then verify

The table below analyzes a **synthetic teaching scenario**, not a real investigation.

| Observed request | Trust boundary involved | Safer decision |
| --- | --- | --- |
| A text directs Lin to a new destination to resolve a login issue | An unverified message chooses the handling channel | Open the previously used official entry point independently |
| A caller claims to be support and knows the project | Familiar background is treated as identity proof | Verify through existing trusted contact information |
| The caller asks for the login code | Authentication capability is given to an unverified person | Stop sharing and involve the official support owner |
| The caller demands staying on the line and avoiding company support | Independent verification is being obstructed | End the suspicious interaction and use the established procedure |

Urgency alone does not prove fraud; real incidents can be urgent. But **urgency should not eliminate verification**. A usable emergency process defines who verifies, who approves, and how the decision is recorded in advance. The person on the phone should not invent all the rules.

## 7. How can verification genuinely leave the caller's controlled chain?

**Independent verification** means using a trusted source that the suspicious request did not itself supply, control, or dictate to verify both the identity and the request.

Simply switching apps is not sufficient. A support chat opened from a suspicious text, followed by a call to the number that chat supplies, could still lead to the same operator.

For Northstar, Lin can:

1. **Pause:** do not disclose information, approve a login, or install software.
2. **Leave the suspicious interaction:** end the call, without using the phone's one-tap callback option or contact details from the text.
3. **Find an existing entry point independently:** use the established company help desk, directory, or previously verified platform.
4. **Verify the specific request:** does the support ticket exist? Who requested it? What operation is needed? What is authorized?
5. **Follow the approval process:** if genuine, perform only the necessary authorized action. If unresolved, escalate to the responsible owner.

A **support ticket** is a work record with an identifier, description, and responsible person. Merely hearing a ticket number does not establish that the ticket exists or matches the request. Check it through the trusted entry point you obtained independently.

This procedure is a teaching design for the fictional organization. Official guidance similarly recommends a known trusted number or official website rather than a caller-provided number or direct callback. [Canadian Centre for Cyber Security: Verifying calls](https://www.cyber.gc.ca/en/what-voice-phishing-vishing-itsap00102)

If an established account itself may be compromised, asking that same account again is insufficient. High-risk actions should use another verified owner or independent approval under the organization's procedure, rather than relying entirely on one potentially compromised channel.

## 8. Organizations need more than “be careful”

This connects to M01-06's **defense in depth**: combine controls at several layers so one mistaken judgment does not produce the entire loss.

These are proposed controls for Northstar, not claims that every organization already has them.

| Layer | Example controls | Purpose and limitation |
| --- | --- | --- |
| People and process | Established verification contact; permission to pause requests; simple reporting | Provide an actionable next step instead of depending on accent recognition |
| Accounts | Suitable phishing-resistant authentication; confirmation for sensitive operations | Strengthen authentication without declaring every business request trustworthy |
| Permissions | Only work-required privileges; different people confirm important changes | Limit the impact of one account or decision |
| Devices | Formal approval for installation and remote assistance | Prevent “help” from becoming unauthorized control |
| Detection and response | Login, permission-change, and ticket records; reporting and response procedures | Support discovery and investigation, while recognizing gaps in records |

A legitimate remote-support tool is not necessarily malware. The key questions are **who controls it, whether identity and authority were verified, and what operations are permitted**.

Connections to earlier M01 lessons:

- **M01-01: CIA security goals.** Confidentiality concerns unauthorized reading; integrity concerns improper changes to information or settings; availability concerns authorized users being able to use the service.
- **M01-02: Assets and risk.** Accounts, materials, payments, and services need protection. Assess likelihood and consequences, not just how suspicious a message sounds.
- **M01-03: Authorization boundaries.** This lesson analyzes fictional events. Actual calling exercises, evidence collection, and testing require explicit scope and authorization.
- **M01-04 and M01-05: Entry points and behavior.** Calls, messages, and account-recovery workflows can become contact points. Analyze observed behavior rather than treating one warning sign as proof of a complete attack chain.
- **M01-07: Incident response.** Control risk, then use records to establish impact, recover, and improve.

## 9. Evidence: receiving a call, sharing a code, and account use are different events

Afterward, Lin says, “I answered, and I think I read out a code.” Security staff should accept the report, record what he did, and avoid blame. They should not immediately report that all company data was exposed.

The following is a **teaching evidence matrix**:

| Available information | What it supports | What it does not establish by itself |
| --- | --- | --- |
| A text and incoming call appear on the phone | Corresponding message or call records exist | The displayed source is the real identity |
| Lin reports sharing a login code | Reported credential exposure requiring timely risk-based handling | A successful unauthorized login |
| The platform records successful authentication | That authentication transaction succeeded | The operator was an attacker or read all information |
| Unusual permission changes or downloads appear | Activity needs investigation | All changes were malicious or all downloads left authorized custody |
| An independent contact denies making the request | The claimed identity or request may have been impersonated | The entire origin and impact are known |

Cross-check timestamps, accounts, devices, actions, tickets, and data-access records. A **log** is a system's recorded account of activity. It is an evidence source, not a guaranteed complete recording of everything that happened.

No unusual record does not guarantee safety: logging might have been absent, retention too short, or the relevant records not yet located. Conversely, an unfamiliar device or unusual time may have an innocent explanation. Investigate.

**You need not wait for certainty before taking protective action, but your conclusions must stay within the evidence.** If a password or login code was disclosed, or suspicious remote assistance was allowed, report promptly through the official channel. Responsible staff can protect accounts, handle sessions, and address devices as appropriate. Do not repeat suspicious actions to “check,” and do not erase all records yourself.

## 10. A two-minute tabletop exercise: trace where trust comes from

This is paper-based observation. It requires no internet access, accounts, or calls, and is not evidence of completed practical work.

Draw two paths:

**Path A: suspicious SMS → support link in the SMS → callback number supplied by that support chat → “Yes, that was us.”**

**Path B: suspicious SMS → pause → independently open the established company help desk → verify ticket and owner → follow authorization.**

At every step, circle **who supplied the contact details**.

Path A appears to check three times, but the suspicious source supplies the entire confirmation chain. Path B returns the decision to a previously established trusted process. That is the meaningful difference—not the number of apps used or how often someone was asked whether they really were support.

## 11. Common exam and real-world mistakes

| Mistake | More precise interpretation |
| --- | --- |
| Vishing requires an AI-generated voice | Human speech, recordings, or other voice forms can be involved; AI is not required |
| Vishing, smishing, and impersonation are exclusive | Channel and technique can coexist; identify which dimension the question asks about |
| A text in a familiar conversation thread must be genuine | Display name, number, and thread placement cannot independently replace verification |
| No clicked link means no risk | A person might disclose information, read out a code, or follow verbal instructions |
| Confirming by phone is automatically independent | Check the source of the number; a number supplied by the suspicious message may stay inside the same chain |
| MFA makes phishing impossible | Authentication methods differ; secure login also does not establish legitimate payment authority |
| Receiving a fraudulent call proves compromise | Contact, exposure, login, action, and harm require separate evidence |

Official guidance documents cases where spoofed messages appear alongside genuine SMS messages. This is a possibility, not a claim about every phone or every incident. [Canadian Centre for Cyber Security: SMS source spoofing](https://www.cyber.gc.ca/en/guidance/smishing-protect-yourself-sms-attacks-itsap00103)

## 12. One short check: explain in your own words

**Scenario:** An ordinary Northstar administrative employee receives an “account verification required” text. A caller then claims to be the IT help desk and correctly names a project. The caller requests a login code and says verification must be done by calling only the number in the text. The employee reports having read out the code. Platform login and data-access records are not yet available.

Use a few sentences to address this one scenario:

1. If this is confirmed as an attack, which concepts describe the SMS, the call, and the claimed help-desk identity? Can they coexist?
2. How would you verify the request outside the caller's arranged channels?
3. Can you already conclude that the account was compromised and course materials were disclosed? Distinguish known risk, unverified outcomes, and immediate protective action.

No long response or confidence score is needed. **Reference explanations are different from a learner's own answer. This lesson presents the questions first so feedback can address your actual reasoning.**

### Summary

- **Vishing describes the voice channel, smishing the SMS channel, and impersonation the claimed identity.**
- **A familiar number, voice, background, or genuine verification code does not by itself establish a trustworthy caller or request.**
- **Verify outside channels controlled by the suspicious source. Protective action can begin promptly; conclusions must follow evidence.**

The next unit is M09-04: **pretexting** (constructing a deceptive situation), **baiting** (using an enticing lure), and **tailgating** (following someone into a restricted area). It extends these trust questions to fabricated situations and physical environments.
