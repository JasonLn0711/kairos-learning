# CEH M09-03 | Teaching reference explanations

These are teaching explanations, not a learner's submitted answers or evidence of verified understanding. Try your own reasoning before opening the corresponding explanation.

## 1. Two-minute exercise: which verification method is more reliable?

The suggested answer is B: independently open the official banking app you previously verified and use its established entry point. The key is not that an app is always safer than a phone call. It is that the suspicious caller or text did not supply this entry point for the current interaction.

A still uses a number provided by the suspicious source. Even if the person answering says, “Yes, that was us,” it may simply be another part of the same party's arrangement, not independent evidence.

C asks the caller to repeat an employee number but remains inside the caller's information source. Knowing a number does not establish that a trusted system confirms the person, support ticket, or request.

In practice, do not provide the login code. End the suspicious call, then use an established trusted contact method to verify the identity, request, and authority. Even verifying a bank employee's identity does not remove the normal procedures for sensitive operations. [Canadian Centre for Cyber Security: Avoiding vishing](https://www.cyber.gc.ca/en/what-voice-phishing-vishing-itsap00102)

## 2. After-lesson question 1: which classifications may apply?

These concepts can coexist: the SMS channel is smishing, deceptive inducement through the voice call is vishing, and pretending to be bank support is impersonation. They describe channels and a technique rather than mutually exclusive options. The overall activity remains within phishing.

From the target perspective, the question explicitly targets a company's finance manager, so spear phishing is an appropriate description. If that manager holds a senior position, substantial payment authority, or other high-value privileges, whaling may be a more specific classification. Do not infer an unstated rank or set of permissions solely from the word “manager.”

Distinguish whom the attacker targets from whom the attacker impersonates. The target is the finance manager; the claimed identity is bank support. An important-sounding assumed identity does not itself make an incident whaling. In a real investigation, examine the target, content, and behavior before applying the classifications supported by evidence. [Canadian Centre for Cyber Security: Social engineering](https://www.cyber.gc.ca/en/guidance/social-engineering-itsap00166)

## 3. After-lesson question 2: how can a genuine OTP help an attacker?

A genuine code establishes only that it came from the real platform or satisfies its verification rules. It does not authenticate the person asking for it. If the attacker has the other required conditions and persuades the user to disclose a still-valid code, the attacker may submit it to the genuine platform and complete that authentication transaction.

Obtaining the code does not guarantee a successful login. The outcome depends on the operation associated with the code, whether it expired or was already used, and whether device restrictions, additional verification, and other conditions are satisfied. Confirm the outcome from actual records rather than inferring success from the mechanism alone.

This does not make MFA useless. Different factors add protection: for example, if only a password is exposed, an additional factor may prevent login. The limitation is that authentication methods differ in phishing resistance. Manually entered OTP or SMS out-of-band outputs can be relayed through deception and should not be treated as phishing-resistant. Correctly implemented FIDO2/WebAuthn instead uses cryptography to bind authentication to the intended verifier. [NIST SP 800-63B-4: Phishing resistance](https://pages.nist.gov/800-63-4/sp800-63b.html#phishres)

Finally, keep login and authorization separate. Stronger authentication does not automatically establish that every payment or information disclosure is appropriate. Independent approval, least privilege, and other controls are still needed.

## 4. After-lesson question 3: what can be concluded, and what comes first?

Under the question's stated premise, the employee read out the OTP, creating an authentication-information exposure risk. Call records support the occurrence of corresponding call activity. In a real investigation, call records do not necessarily establish what was said; separate the user's account, corroborating evidence, and verified facts.

You cannot yet conclude that unauthorized login succeeded, the account was fully controlled, or course materials were disclosed. Investigate the operation associated with the code, its validity, authentication and login results, whether the operator was authorized, and the scope of subsequent access, downloads, or transmissions.

Do not wait for every fact before taking protective action. Stop the suspicious interaction, provide no further codes or approvals, and report immediately through the established official help desk. Authorized responders can protect the account according to risk, inspect or revoke suspicious sessions, address necessary credentials, and preserve messages, timestamps, and logs. Do not erase records yourself or repeat suspicious actions as a test.

Then correlate login, device, permission-change, support-ticket, and data-activity records. A lack of observed anomalies does not guarantee safety because records may be incomplete. In short: address risk promptly, but establish successful compromise and data disclosure with their own evidence. [Canadian Centre for Cyber Security: Responding to social engineering](https://www.cyber.gc.ca/en/guidance/social-engineering-itsap00166)
