# M05-06 | Authenticated and unauthenticated scanning: did the scan actually see enough?

This lesson answers a common question: **If a scanning tool reports “completed,” why can we still not say that the system was examined completely?**

The key point: **Unauthenticated scanning uses information available without logging in; authenticated scanning uses a previously authorized identity to gather more internal evidence. They complement each other. Entering credentials, authenticating successfully and completing the required checks are three different things.**

## 1. Start with a house-inspection analogy

An inspector can examine the doors and windows from outside, or enter with the owner's permission and a key to inspect the pipes.

From outside, an open door may be visible while an aging pipe inside a wall is not. Going inside reveals more, but a key to the ground floor does not necessarily open the basement. Entering the house also does not establish that every specified inspection item was completed.

Scanning works similarly: **the inspection position, identity, permissions and actual completed checks determine which conclusions the evidence supports.** Entering the house in this analogy means authorized access, not breaking in to gain privileges.

## 2. Unauthenticated scanning: visibility without a login

Unauthenticated scanning performs the relevant checks without using a login identity for the target system. A tool may observe open services, protocol responses, certificates or public interfaces and assess issues from the available evidence.

For example, a test website's public response may reveal a software version. That is a clue: check whether the version string is reliable, whether security fixes were backported and whether the affected feature is actually enabled. When remote responses are insufficient, do not label a guess as confirmed.

Two distinctions are easily confused:

- Unauthenticated does not mean “always scanning from the Internet.” A scanner can also run inside a company network; its position affects which entry points it can see.
- Unauthenticated does not mean passive. A tool that actively sends probes can affect a service even without logging in. Testing still needs authorization, an approved window and stop conditions.

A report should therefore state the source position, unauthenticated context and targets examined, instead of vaguely claiming to show everything an external attacker could see.

## 3. Authenticated scanning: internal evidence through authorized access

Authenticated scanning that uses login credentials is also commonly called credentialed scanning. Here, a credential is authentication material, such as a password, key or another supported method; it is not a certificate that the scan results pass inspection.

With an approved identity, a scanner may obtain package, patch and configuration information according to its capabilities and permissions. That usually helps confirm issues more effectively than public responses alone. See [Rapid7's scan credential guidance](https://docs.rapid7.com/insightvm/configuring-scan-credentials/).

Authenticated scans are not all equivalent. An operating-system identity, a database identity and a web-application identity each have different visibility. Logging in to a host does not establish that database checks succeeded. A normal website member account cannot substitute for checking host patches.

You can draw two parallel observation paths:

{{figure:views}}

This is not an attack chain in which the left path inevitably escalates to the right. These are two inspection perspectives.

## 4. Three essential checks: configuration, authentication and coverage

**First: did the configuration take effect?** Credentials can exist in a tool without being assigned to the target or enabled for this job.

**Second: did the target accept the identity?** Expired credentials, disabled accounts, connection restrictions or a mismatched service may prevent authentication. In a target group, some may succeed and others fail; one successful target does not establish success for the entire group. See [Rapid7's actual authentication status and diagnostic workflow](https://docs.rapid7.com/insightvm/configuring-site-specific-scan-credentials/).

**Third: after authentication, was the required evidence obtained?** An account may log in yet lack permission to read certain settings, files or package inventories. Tenable warns that insufficient access can produce incomplete results. Examine check output and gaps as well as login status. See [Tenable on privileges and assessment completeness](https://docs.tenable.com/nessus/compliance-checks-reference/Content/CredentialedScanningandPrivilegedAccountUse.htm).

Report the outcomes separately: “Authentication succeeded,” “Package inventory retrieved” and “Configuration check incomplete because of insufficient permission.” This is more useful than saying only “We scanned with credentials.”

No vulnerability results may mean no issue was found in this run, or that required checks never completed. **An empty result is not a guarantee of a clean system.** The next lesson distinguishes false positives, false negatives and validation.

{{figure:gates}}

## 5. Complete synthetic case: one host, three different evidence sets

The following test host, “Sapling Server,” is fictional. No actual scan was performed.

The first, unauthenticated scan sees an old version string in a web response. A reasonable conclusion is: “A version clue may match an advisory; patch state remains unconfirmed.” It does not establish successful exploitation.

The second scan uses an approved account and authenticates, but cannot read the package inventory. The report lists no package vulnerabilities. At this point, do not close the original finding or claim that authenticated scanning proved the fix was installed: the key evidence is still missing.

After an approved correction to the inspection configuration, the third scan retrieves the complete package revision. Comparing it with the distributor's advisory confirms installation of a version containing that security fix. This supports a patch assessment, but you must still check whether the running process loaded the update and whether other copies or components remain affected.

A separate externally exposed configuration issue does not disappear because the package was patched. Different checks answer different questions; they do not cancel each other out.

A bounded report can say: “The complete package version was obtained and matches the advisory's fixed version. Running state and other copies remain unconfirmed. Retain the original remote version clue alongside this assessment's evidence.”

## 6. More account privilege requires deliberate control

Authenticated scanning involves two risks: the scan's effect on services, and the privilege and disclosure risks of its credentials.

Some tools genuinely require administrator or near-root privileges for complete checks. Root is a highly privileged identity on Unix-like systems. Do not promise that an ordinary read-only account can always perform every required check. Equally, convenience does not justify copying shared highest-privilege credentials for all devices into an arbitrary tool.

Approve the necessary privileges according to the target platform and vendor requirements, with dedicated identities, target restrictions, approved windows, audit and credential protection. If privileges are lower, explicitly list the checks that cannot be performed rather than implying identical coverage. Tenable lists compensating measures such as time restrictions, rotation and monitoring privileged account use. See the [vendor's privileged-account recommendations](https://docs.tenable.com/nessus/compliance-checks-reference/Content/CredentialedScanningandPrivilegedAccountUse.htm).

When authentication fails, do not retry until the account locks out or independently disable firewalls, MFA or other controls. Investigate first, then obtain approval from an authorized owner for adjustments. MFA means multi-factor authentication; tool support depends on the actual product and environment.

Safe-check options are not a zero-risk guarantee. Begin with a small run in an authorized test environment, define load limits, stop conditions and a contact, then follow the approved execution plan.

## 7. Does having an Agent remove the need for other scanning?

An Agent is software installed on a managed device that can collect local information. This is another deployment method. Not entering remote credentials does not make its assessment unauthenticated: local service privileges may already provide internal access.

Local information does not establish which entry points are reachable from a particular network position. Rapid7 describes Agents and Scan Engines as complementary, with neither unconditionally replacing the other. See [Rapid7's Agent and Scan Engine comparison](https://docs.rapid7.com/insightvm/using-the-insight-agent-with-insightvm/).

When choosing a method, ask whether you need package-patch evidence or exposure from a particular source position, whether the tool supports the device, when the data was collected, and whether failed or offline assets are represented. Those answers matter more than merely selecting “with credentials” or “without credentials.”

## 8. Checklist and small check

This is a tabletop exercise only. Create no account, provide no password and scan no target.

1. Draw a synthetic host and two scanning perspectives, stating the evidence each should obtain.
2. For the three Sapling Server results, separately record authentication status, required-check status, known facts, unconfirmed facts and the next action.
3. Write one result summary. Do not equate “job completed” with “every check completed,” or “no vulnerability listed” with “no vulnerability exists.”

The expected result is a table showing inspection coverage and gaps. Keep the local exercise notes afterward; there is no lab environment to restore.

For a real authorized run, retain targets and scope, scan source, tool and check-rule versions, execution time, an account alias without secrets, authentication and privilege status, completed and failed checks, evidence locations and follow-up plans. Afterwards, remove temporary access or rotate credentials through the approved process. Preserve records still needed for audit.

**Small check: The scan configuration contains a valid account and the log shows successful authentication, but reading the package inventory fails with insufficient permission. The final report lists zero package vulnerabilities. Can you claim “all packages on this host are safe”? Which two pieces of evidence must you check next?**

{{answer}}

Take away one principle: **Authenticated scanning is valuable because it obtains evidence within the approved scope that can support a conclusion, not merely because someone entered a password.**
