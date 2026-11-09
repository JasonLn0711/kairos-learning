# M05-06｜Authenticated and unauthenticated scans: does finished mean safe?

The most important idea in this lesson is:

A scanner saying “job finished” does not mean every check succeeded, and certainly does not mean the system has no vulnerabilities.

We must distinguish three things: what the scanner can observe, whether it has permission to inspect it, and whether the evidence obtained supports the security conclusion.

## 1. Imagine having a house inspected

Suppose you buy a house and worry about aging wiring, faulty locks and leaking pipes.

You hire two inspectors.

Inspector A can only stand outside.

They can see windows, exterior walls and exposed wiring, but cannot see inside the walls.

Inspector B receives a key from the owner.

They can enter and inspect the electrical panel and plumbing, but still cannot see a locked basement.

This is the basic difference between two types of vulnerability scans.

- Unauthenticated scan: inspects information observable over the network without using a login identity on the target system.
- Authenticated scan: uses an approved account or other login credentials to inspect additional internal information.

Here, authentication refers to verifying identity. It does not mean the scan results have been proven correct.

## 2. What do these scans actually inspect?

Imagine a Linux server hosting the company's website.

{{figure:paths}}

For example, an unauthenticated scan finds a web response indicating an older software version.

The scanner may warn: “This version may be affected by a particular CVE.”

But it may not know:

Has the company backported a security fix to the older version? Is the relevant feature enabled? Does the currently running program actually have that weakness?

A version string is therefore usually a clue, rather than complete evidence that a vulnerability applies.

An authenticated scan that successfully obtains internal package revision, patch and configuration information may help answer these questions.

Another important point: unauthenticated does not mean external-network scanning or passive scanning. A scanner on the company network that does not log into the target can also be unauthenticated. Actively sending probe packets still requires authorization.

## 3. The key lesson: three gates to check

Suppose you configure a vulnerability scanner with an inspection account supplied by the company.

The tool says the scan finished, and may even report no vulnerabilities.

Do not celebrate yet: there are three gates to check.

{{figure:gates}}

Understanding the differences between these gates is the most valuable part of this lesson.

## 4. A practical example: successful login, zero vulnerabilities

Suppose you perform an authenticated scan of an Ubuntu server.

{{figure:result}}

Can you tell your manager: “This host has zero vulnerabilities and is very safe”?

No.

The scanner logged in successfully, but never obtained the package inventory.

It is like a house inspector entering the front door but being unable to inspect the wiring because the electrical panel is locked, then writing “No electrical problems found.”

The sentence may be literally true, but without disclosing that the panel was not inspected, it can mislead people into thinking safety has been established.

In security, distinguish these states:

| State | What it actually means |
| --- | --- |
| Scan finished | The job has ended |
| Login succeeded | The account passed authentication |
| Check succeeded | Usable evidence was obtained for a specified item |
| No vulnerabilities found | None were found within the checks completed |
| System is secure | Broader evidence is needed; a single scan cannot establish this |

This also relates to the CEH concept of a false negative: a vulnerability that exists but is not reported.

A vulnerable system may have no finding displayed because the scanner could not obtain necessary information.

However, a failed check does not itself prove a false negative. A false negative exists only when a vulnerability actually exists and is not reported.

## 5. Do higher account privileges always mean better coverage?

Not necessarily, and they may introduce other risks.

For example, detailed configuration checks on some Linux hosts require root or specific administrative privileges. A regular account may only see some information.

However, giving a scanner the most privileged account means an attacker may obtain those privileges if the tool, credential vault or execution environment is compromised.

The right approach is neither to always use root nor to insist that every scan use only a regular account.

Approve the necessary privileges according to vendor requirements and inspection needs; use a dedicated account, restrict targets, protect credentials and record checks limited by permissions.

Security scanning itself must be managed securely.

In particular, do not disable MFA, firewalls or other security controls without authorization just to make a scan succeed.

## 6. How does an agent differ from an authenticated scan?

You may have seen an agent installed on computers in enterprise endpoint management or security systems.

An agent is like an inspector stationed inside the house.

Within its authorized local privileges, it can collect installed software, version or configuration information and report it to a management platform.

This differs from remote login scanning, but the two can complement each other.

| Method | Question it is better suited to answering |
| --- | --- |
| Unauthenticated network scan | Which services and exposure can be seen from a specified network position? |
| Authenticated scan | What packages, patches and configurations exist inside the system? |
| Local agent | What internal state did this device report at the time of collection? |

An agent may have high local privileges, so it should not simply be treated as an unauthenticated scan.

Likewise, seeing inside a host does not mean an agent can fully determine which services are reachable from an external network.

In practice, different observation methods often need to be cross-checked.

## 7. Security expertise includes explaining evidence boundaries

Suppose you conduct an authorized penetration test or vulnerability assessment for a company.

A service displays an old version. You then perform an authenticated scan and confirm that the host has the distributor's security-patched package version installed.

A reasonable conclusion is:

> Based on the package revision information obtained in this assessment and the distributor's advisory, the installed package version includes the specified security fix. Whether running processes have loaded the update, and whether other deployed copies are affected, still require confirmation.

This is more precise than “Patched, no risk.”

You need to understand one thing:

Installing an update does not mean the running program has loaded it.

For example, a service that has not restarted may still use a program or library loaded before the update.

Fixing one package vulnerability also does not resolve system configuration, account privilege and network exposure issues at the same time.

In practical reports, separate established facts, reasonable inferences and matters that remain unknown.

## 8. Understanding check: act as the assessor

A company provides a Linux host for a lawful vulnerability assessment.

The scanner reports: job finished, SSH authentication succeeded, package inventory access denied, and package vulnerability count 0.

Question 1: can you claim all packages on this host are secure?

Yes, because the vulnerability count is 0.

No; check coverage and supporting evidence are still needed.

Yes, but first confirm that login succeeded.

Question 2: which two follow-up checks deserve priority? Select two.

Confirm that the package inventory was read successfully and that the required checks completed.

Obtain actual version and patch information and compare it with trustworthy vendor security advisories.

Treat the scanner's Finished status as proof that the system has no vulnerabilities.

Treat a successful SSH login as proof that every host item was inspected.

Reference explanation: select the second option for question 1 and the first two options for question 2. The package inventory was not obtained, so a package vulnerability count of 0 cannot support a claim that everything is secure. First establish check coverage, then compare actual versions with vendor patch information.

Remember this core formula:

Scan credibility = clearly defined scope + successfully completed checks + evidence sufficient to support the conclusion.

This is not a mathematical scoring formula. It reminds us that a security professional must explain what the scanner actually inspected and what remains unknown, as well as knowing how to use it.


Sources checked： [Tenable credentialed checks](https://docs.tenable.com/nessus/Content/NessusCredentialedChecks.htm) · [Tenable credentials](https://docs.tenable.com/nessus/Content/Credentials.htm) · [Red Hat backporting](https://access.redhat.com/solutions/57665)
