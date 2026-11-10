# M05-07 | False positives, false negatives and validation: how do we know a scan result is true?

The previous lesson distinguished “credentials configured,” “login succeeded” and “required checks completed.” This lesson goes one step further: **Does a problem listed by a tool actually exist? Can we treat a problem the tool did not list as nonexistent?**

Remember: **A false positive reports a problem that is not there; a false negative misses a problem that is there. When evidence is insufficient, write “pending verification” and investigate further. You do not have to force a choice between secure and insecure.**

## 1. Start with a smoke alarm

Imagine the alarm in your kitchen goes off. You need to identify the cause before deciding whether there is a fire or steam from cooking triggered the alarm. Conversely, a quiet alarm might mean there is no fire, or its battery is dead, it is in the wrong place, or it failed to detect the fire.

Vulnerability scanning works similarly: **Tool output is an observation that needs interpretation, not a verdict certifying reality.** However, this analogy has limits. A vulnerability is a flaw that could be exploited, not an intrusion that has already happened. Confirming a vulnerability does not justify writing “an attacker has already entered.”

A finding is something a check identifies, such as a package that may lack a patch or a setting that fails a requirement. Validation means matching the tool’s claim, the conditions required for that claim, and the evidence currently available to decide what conclusion the finding supports.

## 2. Four outcomes: separate what the tool says from what is actually true

Here, Positive and Negative describe whether the tool reports the **specified problem**, not good or bad news. True and False describe whether that judgment agrees with established facts.

- **True positive, TP**: the tool reports a problem and validation confirms it. For example, a tool reports that a particular package is unpatched, and the complete package version and applicable advisory support that judgment.
- **False positive, FP**: the tool reports a problem, but evidence supports rejecting that specific judgment. In vulnerability assessment, NIST defines this as an alert that incorrectly indicates a vulnerability is present. [NIST false-positive definition](https://csrc.nist.gov/glossary/term/false_positive).
- **False negative, FN**: the specified problem actually exists, but the tool does not detect it. The key is having other evidence that the problem exists, rather than declaring a false negative merely because a report is blank. [NIST false-negative definition](https://csrc.nist.gov/glossary/term/false_negative).
- **True negative, TN**: within a defined target, time and problem scope, the tool does not alert and investigation supports the absence of that problem. This does not mean “the entire system is permanently secure.”

In one sentence: **Reported by the tool but absent in reality means a false positive; not reported by the tool but present in reality means a false negative.**

In practice, we often do not yet know which box reality belongs in. That is why we also need statuses such as “pending verification,” “checks incomplete” and “outside this assessment’s scope.” These are handling statuses, not ways to disguise uncertainty as a true negative. If the package inventory could not be obtained, first record a coverage gap. Only after obtaining evidence of an actual vulnerability can you determine that a false negative occurred.

## 3. Where false positives come from: matching clues can hide different conditions

A common cause is incomplete product identification or incomplete applicability checks. For example, a tool may judge a product from the name and version in a public response without checking the actual product branch, full package revision, relevant features and patch status.

This introduces **backporting**, the transfer of a security fix. A maintainer may take a security fix from a newer version and apply it to an older version that is still maintained. The main version can appear unchanged even though the full package revision includes the fix. Red Hat explicitly explains that scanners which rely only on version numbers without accounting for backports can produce false positives. [Red Hat on security backporting](https://access.redhat.com/security/updates/backporting).

The checking sequence is therefore neither “an old version means danger” nor “someone mentioned a backport, so it is safe.” Instead, check:

1. Who maintains this product, and which branch is it on?
2. What complete patched version does the advisory require?
3. Which version is actually installed and running on this target?
4. Do the relevant features, settings and other necessary conditions apply?

Also distinguish **false positive, patched, mitigated and risk accepted**. If the problem really existed during the first scan and was fixed afterward, it is a “confirmed finding, now patched.” You cannot retrospectively relabel the original report as a false positive. Restricting an entry point with a firewall may be mitigation; a manager agreeing to bear the risk temporarily is a treatment decision. Neither automatically proves that the original technical finding was wrong.

## 4. Where false negatives come from: unseen by a tool does not mean absent from the target

Possible causes include a target being excluded, offline during the scan, blocked necessary connections, failed authentication, insufficient permissions, or check rules that were disabled or outdated. Some problems also require understanding application authorization or business rules; version checks alone cannot answer them.

For example, in a synthetic order website, every package is current, but an ordinary test account can still read another test account’s fictitious orders. The absence of this issue from a version scan does not refute the authorization-check evidence. If this class of issue is outside the tool’s intended coverage, clearly record a capability or scope gap instead of vaguely claiming “the tool checked everything and found no vulnerabilities.”

To reduce missed checks, examine the asset inventory, tool capabilities, authentication success, check-completion status and actual output together. Then supplement them with configuration review, package evidence or authorized functional testing appropriate to the question. NIST’s assessment guide also notes that scan rules need updates, results require human interpretation, and other assessment methods can fill tool blind spots. [NIST SP 800-115, section 4.3](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf). This 2008 guide is used here for basic methodology, not as documentation of current product interfaces.

Two tools producing the same result can add comparable information, but that does not automatically “confirm” it. If both infer from the same version string or database, both may be wrong in the same way. Ask whether the evidence sources and methods really fill the gap, rather than deciding truth by a vote.

## 5. Five validation steps: from a claim to an evidence-backed conclusion

**Step 1: State exactly which claim is being validated.** Is it “a package is unpatched,” “a public entry point is reachable,” or “a particular identity can read particular data”? These need different evidence. Preserve the original report and check identifier, not just a red severity label.

**Step 2: Check the target, time and assessment conditions.** Record the target asset, component, scan time, source location, rule version, and whether authentication and required checks succeeded. The same IP can refer to different assets at different times; results before and after a patch cannot be treated as the same state either.

**Step 3: Cross-check with suitable information.** For version warnings, examine actual packages and vendor advisories; for configuration issues, examine effective settings and policy; for authorization issues, examine allowed and denied results for the specified identity. Start with a lower-impact method that answers the question. Validation does not necessarily require running an exploit, and certainly does not require taking real data to prove a point.

**Step 4: Write known facts and limitations separately.** You might write “the specified package is confirmed to meet the affected conditions; exploitation has not been tested,” or “evidence of the patched package is available, but whether the running process loaded it remains unconfirmed.” Severity describes potential consequences; confidence describes how certain you are. A high score cannot supply missing evidence.

**Step 5: Decide the next action and preserve traceability.** Route confirmed findings for treatment. When evidence supports a false positive, retain the reasoning and applicable scope. When gaps remain, specify the missing information. Tool exceptions or suppression rules should be limited to the asset, finding and review conditions, rather than permanently hiding an entire class of alerts. Tenable’s validation process likewise calls for investigating potential false positives with supporting evidence and continually checking credentialed-scan success. [Tenable validation and tuning guide](https://docs.tenable.com/quick-reference/vulnerability-management-adoption-roadmap/Content/validation-tuning.htm).

If further testing is needed, first confirm the authorized environment, scope, potential impact and stop conditions. The question being answered and the authorization determine validation depth, not whether the tool offers a particular button.

## 6. Complete synthetic example: three reports need separate conclusions

The hosts, packages and revision numbers below are entirely fictional. They do not correspond to real CVEs, and no scans were performed.

**Case A: An alert is present, but its specific version judgment does not hold.** A tool sees “Little Tree Server 2.4” and judges that it lacks a particular patch. The maintainer’s synthetic advisory says the maintained 2.4 branch includes that security fix from package revision r8 onward. Administrative evidence shows that r9 was actually running at scan time, with the same component and relevant conditions checked. This supports classifying “this component lacks this patch” as a false positive. Preserve the original alert and advisory, and do not extend the conclusion to say the entire host has no other problems.

If r9 was installed only after the scan, the conclusion changes to “verified after patching.” The previous false-positive judgment no longer applies. **Timing changes the conclusion.**

**Case B: Zero findings, but required checks were not completed.** The second host’s report lists zero package vulnerabilities, but login failed and package data was not obtained. The appropriate status is “package checks incomplete; insufficient results.” Only if later administrative evidence confirms that an affected, unpatched package was running at scan time is there a basis to say this assessment missed a real problem, recording insufficient authentication and coverage as the cause.

**Case C: A real vulnerability remains, but an entry point is restricted.** The third host really is running an affected package. Approved network restrictions reduce reachability from a particular external source, but the package itself is still unpatched. Record “vulnerability confirmed; mitigation in a specified scope is in place; patching and revalidation pending,” not “false positive.” Whether other source locations or usage paths can still trigger it requires separate checking.

These three cases answer different questions: whether the original judgment was wrong, whether checks missed a problem, and how a confirmed problem is currently being treated. Putting all three into one “closed” field can erase important information.

## 7. What should defenders record?

A validation record that another person can take over should include at least:

- **Target and original claim**: the asset, component, check, scan time and what the tool actually said.
- **Evidence-gathering conditions**: scan source, tool/rule version, authentication and check-completion status.
- **Supporting and opposing evidence**: advisory links, full package versions, effective settings, observation time and necessary conditions.
- **Current conclusion and limits**: confirmed, false positive, pending verification or checks incomplete; the specific targets and times covered.
- **Follow-up actions**: who will supply missing data, fix or review the issue, when to recheck, and which changes require revisiting the original conclusion.

Include only evidence needed for review. Use account aliases and omit passwords, keys, session tokens and unnecessary personal information. Closing an alert and fixing a problem are different things; be able to explain why a report looks cleaner.

## 8. Paper exercise and a quick check

You need only paper or a local text file. Do not connect to any target or create a scan account.

1. Write one row each for cases A, B and C, with columns for “tool claim,” “independent evidence” and “current status.”
2. Add one new fact to each row that would change the conclusion, such as patch timing, authentication status or another reachable source.
3. State what evidence to obtain next. Do not substitute “try another scan” for a specific question.

The expected output is a traceable interpretation record, not a real vulnerability-validation report. Keep or delete your local draft afterward; there is no test equipment to restore.

**Quick check: A host scan reports “zero vulnerabilities,” but authentication failed and the required package checks did not run. Is the most reasonable status now “true negative,” “confirmed false negative,” or “checks incomplete, pending verification”? Choose one and explain which additional evidence is needed.**

The core lesson: **Clarify the tool’s claim first, then verify it with matching evidence. Preserving uncertainty is more useful than treating a blank report as a security certificate.**
