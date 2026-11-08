# CEH M05-01 | Vulnerability assessment and penetration testing: what must you establish after finding a problem?

We now enter M05, Vulnerability Analysis. Start with one idea: vulnerability assessment organizes possible security problems and how to address them; penetration testing validates attack paths and actual impact within explicit authorization. They complement each other. Whether someone runs a tool does not distinguish them.

## 1. Start with a home inspection

Imagine hiring a professional to inspect your home's security. They check doors, windows, locks, entrances and alarms, recording deficiencies, supporting evidence and which repairs should come first. This resembles vulnerability assessment.

If you additionally authorize them to demonstrate whether a particular door can be bypassed, using specified methods and times, without damaging property or touching personal belongings, that is closer to penetration testing.

Both need permission. Discovering a window problem does not authorize climbing through it. Even authorized verification must respect stopping conditions.

## 2. Six terms in one story

- Asset: something valuable you want to protect, such as order records, accounts, a website service or its ability to remain available.
- Vulnerability: a deficiency that could be exploited to affect security. For example, incorrect permissions allow an ordinary member to read another person's orders. Deficiencies can arise in software, configuration or operating processes.
- Threat: a source or situation that could cause harm, such as an outside attacker trying to obtain order records.
- Exploit: a method or program that turns a particular vulnerability into an effect. Finding exploit code still requires checking whether it applies to this environment.
- Attack: an actual attempt to damage, bypass or misuse security mechanisms. A vulnerability does not establish that an attack occurred; an attempted attack does not establish success.
- Risk: the likelihood and impact of harm from a threat in the current environment. The same deficiency may have different urgency on a public ordering system and an isolated practice machine.

Connect the terms: orders are the asset; unauthorized reading is the vulnerability; an attempt to steal records is the threat scenario; the method using the deficiency is the exploit; actually attempting it is an attack; likelihood and harm are central to judging risk.

## 3. What does vulnerability assessment do?

Vulnerability Assessment (VA) systematically examines security deficiencies, organizes evidence and helps decide improvements. It may include tool-based scanning, manual inspection, configuration and document review, and verification of results within authorization.

Vulnerability Scanning is only one way to obtain leads. A scanner may warn based on versions, settings or responses. The assessor must still determine applicability, evidence quality and business impact.

For example, if a scanner flags a potentially vulnerable service version, ask: was the product identified correctly? Is the version information reliable? Is the required feature enabled? Has it been patched? Under what network and permission conditions is it reachable?

A useful assessment explains the problem, evidence, scope, priorities and next steps, rather than handing a manager a bundle of red warnings. [NIST's vulnerability assessment definition](https://csrc.nist.gov/glossary/term/vulnerability_assessment) also covers examining safeguards and confirming improvements.

## 4. What does penetration testing do?

Penetration Testing (PT) simulates attacker methods under specified constraints to establish whether security mechanisms can be bypassed and what impact may result.

It often asks what becomes possible when conditions combine. For example, could information exposed at a public entry point, combined with an authorization flaw, let a test account access test records belonging to someone else? [NIST's definition](https://csrc.nist.gov/glossary/term/penetration_testing) also discusses constrained testing, simulated attacks and combining vulnerabilities.

Success does not require taking all real records or damaging a system. Agree beforehand to obtain the minimum necessary evidence using one synthetic record or a designated marker, and stop when that evidence is sufficient.

Rules of Engagement (ROE) specify in advance which systems, accounts, times and methods are permitted, what is excluded, when to stop, whom to notify and how to remove test data. A publicly visible website is not permission to test it.

## 5. How do you distinguish and choose them?

- Main purpose: VA emphasizes systematically finding and evaluating deficiencies; PT emphasizes validating exploitable paths and impact.
- Common outputs: VA provides deficiencies, applicability evidence and improvement priorities; PT provides test conditions, verification steps, demonstrated effects, limitations and recommendations.
- Choosing: use VA to understand the distribution of problems across assets; use clearly scoped PT to validate an attack scenario, a defense mechanism or the resistance of a critical system.

This compares purposes, not rigid categories. VA can include manual verification, and PT can use scanners. The engagement's purpose and authorized scope govern the actual work.

## 6. Case: turning a version warning into a defensible conclusion

This is an anonymized synthetic example, not a real system test result. A company's isolated practice website returns “service version 2.4,” and a tool raises a high-severity warning.

1. Separate observation from inference: the observation is that the response shows version string 2.4; the inference is that vulnerability conditions may apply. Successful exploitation is not yet established, much less data disclosure.
2. Check applicability: inspect the actual package, vendor advisory, patch status, enabled features and access restrictions. A version string may not reflect every patch.
3. Decide scope: for a remediation list, record confirmed and unconfirmed conditions. To establish impact along a particular path, verify with synthetic data in an isolated environment under explicit PT authorization.
4. State evidence boundaries: if a test account reads one synthetic order it should not access, this supports unauthorized access along that path under those conditions. It does not establish access to every order or prove a past intrusion.
5. Retest after improvement: change the permissions or software and recheck with the same role and conditions. Confirm that unauthorized requests are denied while legitimate users can still work normally.

Remember the teaching flow: discover a lead → check conditions → verify within authorization → explain impact and limitations → retest after improvement. This is the lesson's organizing aid, not an official fixed five-stage model.

## 7. What evidence should defenders retain?

At minimum, record test assets, time, roles and conditions, actual observations, unresolved questions and recommendations. After a fix, add the change record, retest conditions and expected versus actual results. Minimize or redact sensitive data; do not retain unnecessary passwords, keys or full personal records for a report.

Remember two limitations:

- Not detected does not mean nonexistent. Scope, permissions, tool rules and reachability affect results.
- A failed test does not mean permanently safe. Conclusions cover this time, method and conditions only; untested does not mean passed.

[NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final) is a technical testing and assessment guide published in 2008. This lesson uses its basic ideas about planning, evidence, limitations and improvement, not as instructions for current tools.

## Quick check

A scan reports a high-severity vulnerability based on a version string. You have not checked patch status and lack authorization for further testing. What is the most reasonable next step?

- A. Run an exploit against the production website to confirm impact.
- B. Report that the system has already been compromised.
- C. Check the product, patches and required conditions; separate observations from unresolved questions, and confirm authorized scope before further verification.
- D. Delete the warning because you have not seen data disclosure.

Choose an answer, then explain in your own words: what questions do vulnerability assessment and penetration testing each try to answer?
