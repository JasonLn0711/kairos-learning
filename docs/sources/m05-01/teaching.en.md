# M05-01｜Vulnerability assessment and penetration testing: a complete plain-language lesson

Start with the central idea of this lesson:

Vulnerability assessment (VA) finds security problems, evaluates risk and plans remediation. Penetration testing (PT) works within an authorized scope to validate what an attacker might actually achieve.

Both examine security, but they answer different questions.

- VA: Where might the problems be? How serious are they? What should be fixed first?
- PT: Can these problems be exploited? What impact would exploitation have?

## 1. Understand the difference through a home-security inspection

Suppose you buy a house and worry about burglary.

First professional: the vulnerability assessor (VA)

They inspect locks, windows, cameras and alarms, and discover that the rear-door lock is old and may be easy to open.

They tell you: “The rear-door lock raises a security concern. Replace it as a priority.”

Second professional: the penetration tester (PT)

You explicitly authorize them to test whether the rear door can really be bypassed without damaging the lock.

They open the door successfully, demonstrating that this defect can be exploited under particular conditions.

There is an important distinction here:

VA finding that a lock may be insecure does not prove that someone can actually open the door.

PT successfully opening it also does not prove that a burglar entered in the past.

This is an essential evidence principle in security work: a suspected vulnerability, an exploitable vulnerability and a compromised system are three different conclusions.

## 2. Understand six security terms together

Now replace the house with an online shop.

The shop has 10,000 members, and each member should be able to view only their own orders.

{{figure:terms}}

This is a concept relationship diagram, not a claim that every vulnerability inevitably passes through every stage. Risk may exist before any attack occurs.

In particular, risk is not the same as a vulnerability.

Suppose two computers have exactly the same vulnerability:

One is an internet-facing production server storing extensive customer data. The other is an entirely isolated lab computer with no real data.

The vulnerability may be identical, but exposure, attack likelihood and possible damage can differ substantially. Remediation priorities can therefore differ too.

## 3. How do scanning, assessment and penetration testing differ?

This distinction is easy to confuse in CEH study and in practice.

| Name | Plain-language meaning | Main question |
| --- | --- | --- |
| Vulnerability scanning | Use tools to locate suspicious conditions | What potential problems are present? |
| Vulnerability assessment | Verify findings, assess risk and arrange remediation | Which findings are real, and what should be fixed first? |
| Penetration testing | Validate attack paths within an authorized scope | What impact can actually be demonstrated? |

Think of a medical visit: scanning resembles a screening instrument reporting an abnormal value; assessment resembles a clinician combining that result with history and other evidence; penetration testing resembles a controlled follow-up investigation into a specific concern.

This is only an analogy. It does not mean VA can never perform practical tests or PT never uses scanners. The important differences are purpose, evidence requirements and authorized scope.

## 4. A practical case: what should you do when a scanner reports a high-severity vulnerability?

Suppose you manage an internal AI imaging-analysis system at a hospital.

It provides a web interface where authorized medical staff sign in, upload test images and view analysis results.

One day, an authorized vulnerability scan reports the following:

{{figure:scan}}

Can you immediately state that the hospital AI system has a high-severity vulnerability?

You cannot yet treat that as a confirmed conclusion.

### Step 1: Check whether the tool is mistaken

The scanner may only have read a version string returned by the server. For example, seeing `2.4` may lead it to infer that the version could be affected.

The system may already have security patches installed while continuing to display the same version string.

Check the actual package, patch records, affected functionality and conditions required for the vulnerability to exist.

This helps rule out a false positive: a reported problem that is not actually present.

### Step 2: Check the vulnerability's practical risk

If the vulnerability really exists, ask further questions:

Does it require signing in? Is it reachable from an external network? Does it require special privileges? Which data would exploitation affect?

A high-severity scanner alert deserves attention, but it does not imply the same risk in every deployment environment.

### Step 3: Conduct authorized penetration testing if necessary

If the hospital needs to know whether an authorization defect permits unauthorized access, first establish the testing authorization.

For example, create only two synthetic accounts in a test environment:

{{figure:access}}

If account A successfully reads B's test data, you have stronger evidence than a version warning: unauthorized access occurred under these test conditions.

This is called broken access control in web security and may involve an insecure direct object reference (IDOR).

It still does not prove that someone intruded in the past or that all data is readable.

### Step 4: Retest after remediation

Remediation is not established simply because an engineer says “it is fixed.”

Verify again: can A still read A001 normally? Is A now unable to read B001? Do other legitimate functions still work?

This is retesting. The positive case checks that normal functionality has not broken, while the negative case checks that the authorization defect has actually been addressed.

## 5. The complete security workflow

{{figure:workflow}}

One of the most important documents is the rules of engagement (ROE).

Think of it as an agreed working boundary between the tester and system owner: what may be tested, what must not be touched, whom to notify if something goes wrong, and when testing must stop.

Finding a potential vulnerability does not authorize you to expand the testing scope on your own.

## 6. Three judgments CEH learners need to develop

First, distinguish observations from inferences.

“The scanner displays version 2.4” is an observation. “This version may contain a vulnerability” is an inference. “The system has been compromised” requires entirely different incident evidence.

Second, do not automatically make high severity the highest remediation priority.

Alongside intrinsic severity, consider exposure, exploitation conditions, asset value, existing safeguards and business impact. An internet-reachable vulnerability known to be readily exploitable often needs more urgent attention than a hard-to-trigger defect in an isolated system.

Third, understand that the purpose of security work is to reduce risk, not merely find vulnerabilities.

Finding 100 alerts without validation, remediation or risk reduction does not itself demonstrate better protection.

A useful security report tells the responsible person which issues are confirmed, what evidence supports them, what to address first and how to verify remediation.

## 7. Understanding check: think like a CEH analyst

Suppose a scanner reports a high-severity vulnerability in an internal company system. You have not checked patch status and have no authorization for further penetration testing.

Question 1: What is the most reasonable next step?

A. Immediately run an exploit to check whether it succeeds.

B. Tell management the system has already been compromised.

C. Check the product, patch status and required conditions, then decide whether to request authorization for further testing.

D. Ignore the alert because no data leak has been seen.

Question 2: Answer in your own words

Suppose penetration testing successfully reads one synthetic record that does not belong to the test account. What does this demonstrate, and what does it still not demonstrate?

{{answer}}

The core skill in this lesson is separating a suspected vulnerability, a confirmed vulnerability, demonstrated exploitability and evidence of a past intrusion. This distinction matters both for CEH concepts and for defensible security-assessment reports.

## Sources and further reading

[NIST SP 800-115: Technical Guide to Information Security Testing and Assessment](https://csrc.nist.gov/pubs/sp/800/115/final) explains planning, technique limitations and mitigation. [OWASP: Insecure Direct Object Reference Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) explains per-object authorization checks. The house, shop and hospital cases are synthetic teaching scenarios. Version 2.4 does not identify a particular product or CVE.
