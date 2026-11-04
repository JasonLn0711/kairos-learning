# CEH M04-01 | Scanning finds the entrance; enumeration asks for information

Enumeration vs. Scanning | A complete plain-language lesson

Course: CEH 2026 · Module 04 — Enumeration

Lesson: [CS Kairos Learn — M04-01](https://learn.cs-kairos.com/courses/ceh/v13/m04/concepts/m04-01/)

Scope: complete sections 1–10, conceptual Q&A, and understanding checks.

The hosts, accounts, paths, and outputs below are hypothetical teaching scenarios, not records of tests performed against real equipment in this revision.

## Before you begin | The central distinction

The lesson develops one idea:

> Discovering an available network service does not establish what resources it contains or whether you may use them.

Think of the CEH modules as investigating an office building:

| Learning stage | Everyday question | Technical activity |
|---|---|---|
| M02 Reconnaissance | Where is the building, and which company owns it? | Reconnaissance |
| M03 Scanning | Which entrances exist, and which doors receive an answer? | Scanning |
| M04 Enumeration | Which departments, rooms, and resources are available? | Enumeration |
| M05 Vulnerability analysis | Is information or access exposed contrary to policy? | Vulnerability Analysis |
| M06 System hacking | Can an authorized test demonstrate the impact of a weakness? | System Hacking |

This is a concept map, not a mandatory order for every engagement.

For example, M03 introduced Nmap. You find:

```text
192.168.56.10

PORT      STATE    SERVICE
445/tcp   open     microsoft-ds
```

You know TCP 445 is open. You might next ask:

1. Does this endpoint actually provide SMB file sharing?
2. Which shares does the server provide?
3. Can I discover their names?
4. Can I read their files?
5. Can I modify their files?

These questions can have different answers. M04 teaches you to query services and judge exactly what their responses establish.

---

# Section 1 | Seeing a filing cabinet does not mean opening its drawers

## 1.1 Understand it through a company records room

Suppose you are a security engineer asked to examine a company file server. Think of the server as a records room containing several cabinets:

```text
                   Company file server
                     192.168.56.10
                            │
                   SMB file service
                       TCP 445
                            │
             ┌──────────────┼──────────────┐
             │              │              │
           Public         Finance        Archive
         Public share   Finance data  Historical data
```

Consider five progressively different observations.

First: you know where the records room is.

You know the server's IP address, `192.168.56.10`, but not which services it provides.

Second: you find an entrance.

Nmap reports TCP 445 open. An application accepts TCP connections at that port. No folder has yet been demonstrated.

Third: you identify the entrance as a file-sharing service.

Protocol identification confirms SMB. This is like confirming that the building actually provides a records room.

Fourth: you learn cabinet names.

A query returns:

```text
Public
Finance
Archive
```

This is enumeration. You have learned three share names; you have not established permission to read their contents.

Fifth: you read a specific file.

Using a company-provided test account, you successfully read:

```text
Public/demo.txt
```

This establishes that the identity and conditions used at that time allowed reading this particular file. It does not establish access to other files or permission to modify anything.

### 1.2 What this section establishes

Separate four capabilities:

| Capability | Meaning | Does it establish the next capability? |
|---|---|---|
| Discover a service | An endpoint responds | No |
| List resource names | Learn which share names are returned | No |
| Read a particular file | Successfully obtain its contents | No |
| Modify a particular file | Demonstrate modification of that file | Not permission to modify other files |

The same distinction applies elsewhere. Seeing a folder name in a NAS interface does not establish that you can enter it. Entering a folder does not establish permission to delete files. Distinguish visibility, entry, reading, and modification in a security test.

---

# Section 2 | Scanning and enumeration ask different questions

## 2.1 Review three foundations

This section connects directly with M03.

### IP address: which device are you contacting?

An IP address acts like a device's network address:

```text
192.168.56.10
```

It identifies the device to contact in this scenario. Knowing an IP does not identify the services it provides.

### Port: which service endpoint are you contacting?

One computer can provide several services:

| Port | Common use |
|---|---|
| TCP 22 | SSH remote administration |
| TCP 80 | HTTP website |
| TCP 443 | HTTPS website |
| TCP 445 | SMB file sharing |
| TCP 3389 | RDP remote desktop |

These are common associations, not guarantees. A port is a transport-layer endpoint number, not proof of an application's identity. An application listening on TCP 443 is not necessarily an HTTPS server.

### Protocol: which communication rules do both sides use?

A protocol defines communication rules. In a bank, speaking arbitrary numbers at a counter does not cause a transfer; you must make a request in the required form.

Likewise, querying an SMB server requires an SMB-compatible request:

- Nmap can help determine endpoint state.
- `smbclient` can make specific requests to an SMB server.

These activities ask different questions.

## 2.2 Scanning versus enumeration

Imagine an auditor authorized by the company.

### Scanning: check the service endpoint

You ask whether anyone answers at the door. A reply supports:

```text
TCP 445: open
```

### Enumeration: query service information

You then ask which shares are available. The service returns:

```text
Public
Finance
Archive
```

You now have specific service-provided information in addition to an open endpoint. That is enumeration.

### 2.3 A common source of confusion

Does Nmap always mean scanning, while another tool always means enumeration? No. Classify the activity by the question you ask and the evidence returned.

Nmap can also perform service detection and run scripts that obtain detailed information. When a tool queries specific resources or attributes, that portion of its work has an enumeration purpose. CEH module names organize concepts; they do not confine each tool to one phase.

The [Nmap state documentation](https://nmap.org/book/man-port-scanning-basics.html) also explains that a result describes an observation from a particular position, rather than an unchanging conclusion for all network positions.

---

# Section 3 | What does 445 open actually establish?

This section develops evidence interpretation.

## 3.1 Start with the command

In an authorized isolated practice environment:

```bash
nmap -p 445 192.168.56.10
```

| Component | Meaning |
|---|---|
| `nmap` | Run the network scanning tool |
| `-p` | Select ports to scan |
| `445` | Check TCP 445 in this example |
| `192.168.56.10` | Target IP address |

Suppose the output is:

```text
PORT      STATE    SERVICE
445/tcp   open     microsoft-ds
```

Read each field separately.

### 445/tcp

The probe concerns:

```text
Transport protocol: TCP
Port: 445
```

### open

Nmap interprets the response as an application accepting connections at this port. It does not establish:

- Successful login.
- Permission to read files.
- An exploitable vulnerability.

### microsoft-ds

A beginner might read this label as confirmed SMB identification. In this basic scan, which does not enable service/version detection, it is normally the common service name associated with port 445 in Nmap's database.

A door labeled “Library” is a clue; it does not establish what service is actually operating inside. Keep the label separate from protocol evidence.

## 3.2 How can you investigate further?

Nmap provides:

```bash
-sV
```

This enables service/version detection. For example:

```bash
nmap -sV -p 445 192.168.56.10
```

It sends probes to the service and analyzes replies to identify the application and possibly its version. Even successfully identifying SMB does not establish file-read permission. See [Nmap service/version detection](https://nmap.org/book/man-version-detection.html).

## 3.3 What is SMB?

SMB means Server Message Block. It is a protocol for sharing network resources, commonly folders and files on another computer:

```text
Your Windows computer
       │ SMB protocol
       ▼
Company file server
       └── \\fileserver\Public
```

Entering this path in Windows File Explorer may access a remote SMB share:

```text
\\fileserver\Public
```

Linux can also use SMB. The protocol is not confined to Windows or exclusively to TCP 445; modern Windows supports other SMB transports too. See the [Microsoft SMB overview](https://learn.microsoft.com/en-us/windows-server/storage/file-server/file-server-smb-overview).

## 3.4 The basic SMB exchange

A simplified exchange is:

```text
SMB Client — your computer
          │
          │ SMB Request: list shares
          ▼
SMB Server — company file server
          │ Check identity and access permissions
          │
          │ SMB Response: information permitted for disclosure
          ▼
SMB Client
    Public
    Finance
    Archive
```

Real SMB may involve protocol negotiation, authentication, session establishment, and separate resource permission checks. The diagram omits these details to explain the request/response relationship.

An open port is a transport-level connection observation. Confirming specific service behavior requires additional protocol-level evidence.

---

# Section 4 | Enumeration asks the service which shares it provides

This section applies enumeration to SMB.

## 4.1 Meet smbclient

`smbclient` is an SMB client supplied by the Samba project. It communicates with an SMB server from a terminal, much as File Explorer provides a graphical way to interact with shares in Windows.

Its capabilities include:

- Querying the server's shares.
- Connecting to a particular share.
- Listing folder contents when permitted.
- Transferring files when permitted.

See the [official Samba manual](https://www.samba.org/samba/docs/current/man-html/smbclient.1.html) for options and behavior.

## 4.2 Read the command one parameter at a time

The company provides this test account:

```text
labuser
```

You are authorized to query share information:

```bash
smbclient -L 192.168.56.10 -p 445 -U labuser
```

| Parameter | Meaning |
|---|---|
| `smbclient` | Run the SMB client |
| `-L` | Request a list of the server's shares |
| `192.168.56.10` | Server to query |
| `-p 445` | Use TCP 445 |
| `-U labuser` | Make the request using labuser |

If a password is required, enter it at the interactive prompt. Do not append it to the command, where it could be exposed in shell history or process information.

### 4.3 What might the server return?

Suppose it returns:

```text
Sharename       Type
---------       ----
Public          Disk
Finance         Disk
Archive         Disk
```

Sharename is a resource name, not a list of the files inside it. For example:

```text
Finance
```

This may name a departmental share.

Type describes the resource category:

```text
Disk
```

Here it indicates a file-storage share; it does not grant access to the whole disk.

### 4.4 What does seeing Finance establish?

Given:

```text
Finance    Disk
```

A defensible statement is that the server returned a share named Finance under this query's conditions. It does not establish that you obtained financial reports.

You obtained:

```text
A share name
```

Not:

```text
File contents
```

Or:

```text
Modification permission
```

A server may tailor its response to the account identity. Another account may receive a different result.

### 4.5 Understand the system-design purpose

Listing shares is often normal functionality. A company might want employees to discover:

```text
Public
HR
Finance
Engineering
```

It need not let every employee enter every department's share. Permitting a name query and refusing a subsequent read are compatible policies.

Microsoft's [NetShareEnum interface](https://learn.microsoft.com/en-us/windows/win32/api/lmshare/nf-lmshare-netshareenum) also queries share information, with permissions varying by information level.

Enumeration obtains concrete service information. Information visibility and resource access remain separate questions.

---

# Section 5 | Authentication, resource authorization, and test permission are different

The three concepts are:

1. Authentication: confirming identity.
2. Authorization: permitting an action on a resource.
3. Testing authorization: the engagement's permission to perform a test.

They answer different questions.

## 5.1 Authentication: who are you?

An employee badge lets the entrance system check that you are a registered employee. A successful identity check is authentication.

A computer system similarly may verify:

```text
Username: labuser
Password: ********
```

It can then process subsequent requests under a particular identity. Successful login does not grant every permission. You may log into a company NAS while still being unable to read a manager's private folder.

## 5.2 Authorization: what may you do?

After entering the office, you still may not enter every area:

```text
Company office
    ├── General work area
    ├── Meeting room
    ├── Finance room
    └── Server room
```

For example:

| Resource | General employee | Finance employee | Administrator |
|---|---|---|---|
| Public documents | Read | Read | Read |
| Finance documents | No read access | Read/write | According to job requirements |
| System configuration | No modification | No modification | Administer |

This is a hypothetical permission design, not a universal company standard. Authentication identifies the requester; authorization determines which operations that identity may perform on a particular resource. See [Microsoft's explanation](https://learn.microsoft.com/en-us/entra/identity-platform/authentication-vs-authorization).

## 5.3 Testing authorization: does the engagement permit this test?

A security engineer must also establish the commissioning organization's permission. Suppose your NAS test scope is:

```text
Target:
192.168.56.10

Allowed:
✓ Scan specified ports
✓ Query SMB share names
✓ Log in as labuser
✓ Read a specified test file

Not allowed:
✗ Guess other employees' passwords
✗ Download non-test data
✗ Modify production files
✗ Delete data
```

Even if the system technically permits reading a sensitive file, the engagement may prohibit that action. Technical capability and test permission are separate.

### 5.4 Consider the three questions together

```text
A proposed access request
          ▼
Authentication
Who are you?
          ▼
Authorization
What does the system permit?
          ▼
Test Permission
Is this within the approved test scope?
```

The first two are normally system security mechanisms. Test permission must be checked before executing the security test; it is not a third automatic SMB protocol verification step. The diagram organizes the questions rather than prescribing protocol timing.

### 5.5 A common exam distinction

Suppose a user successfully authenticates to an SMB server but cannot read Finance. If authentication succeeded and a permission policy refused the read, the issue concerns authorization.

In practice, investigate the actual failure. The words Access Denied alone do not identify a particular incorrect permission setting.

Authentication establishes identity, authorization checks an operation's permissions, and test permission defines what the engineer is allowed to test.

---

# Section 6 | Record different outcomes separately in the same scenario

This section practices evidence interpretation.

## 6.1 Suppose these are the results

The company supplies:

```text
labuser
```

An approved NAS query returns:

```text
Public
Finance
Archive
```

Authorized, specified read tests then produce:

| Resource | Name returned | Specified file read | Write test |
|---|---|---|---|
| Public | Success | Success | Not tested |
| Finance | Success | Denied | Not tested |
| Archive | Success | Not tested | Not tested |

Read each outcome independently.

## 6.2 Public: successful read

Suppose you successfully read:

```text
Public/demo.txt
```

This establishes that labuser read this file under the current network, identity, and test conditions. It does not establish:

- Read access to every file in Public.
- The same access for another account.
- Permission to modify files in Public.
- Permission to create or delete files.

Different files may have different permissions. One successful operation supports only its tested scope.

## 6.3 Finance: denied read

A request against the specified test path returns:

```text
NT_STATUS_ACCESS_DENIED
```

This establishes that the request was refused. Several causes are possible.

Situation A: insufficient share permissions.

A NAS might apply:

```text
Finance

Allow:
FinanceGroup

Deny:
General employees
```

An ordinary employee would then lack access.

Situation B: insufficient file-system permissions.

On Windows, access may depend on NTFS permissions as well as share permissions:

```text
SMB share layer
    │ Connection allowed
    ▼
NTFS file-system layer
    │ Reading not allowed
    ▼
Access Denied
```

A share-layer permission need not imply that the underlying file system permits the read. Microsoft's [SMB Access Denied troubleshooting guidance](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/access-denied-access-smb-file-share) calls for checking identity, relevant security settings, and permissions rather than immediately disabling protections.

Situation C: a refusal need not establish file existence.

Suppose a request for:

```text
Finance/salary.xlsx
```

is denied. Does `salary.xlsx` necessarily exist? No. If access was refused while connecting to the share, the test never established the file's existence. Record the actual operation and the point of refusal without inventing internal files.

## 6.4 Archive: not tested

You discovered Archive but did not test further:

```text
Name visible: yes
Read permission: unknown
Write permission: unknown
```

Public's successful read does not establish Archive read access. Finance's refusal does not establish Archive refusal. An unperformed test is neither a failed test nor a successful test.

## 6.5 Why record the distinctions?

Security assessment draws inferences from evidence. Mixing operations can overstate risk:

```text
Observation:
The Finance share name is visible.

Unsupported conclusion:
Financial data has been obtained.

Supported conclusion:
This query returned the share name;
reading its contents has not been established.
```

The same reasoning applies to Web APIs, LDAP, DNS, cloud storage, and identity systems. Record success, refusal, or not tested separately for every operation; a local outcome does not establish a whole-system conclusion.

---

# Section 7 | Does queryable information mean a vulnerability was found?

Not necessarily. Queryable information may be normal functionality or an information-disclosure risk. Its content, recipients, and business purpose determine the assessment.

## 7.1 An everyday example

A hospital lobby shows:

```text
1F: Registration
2F: Outpatient clinics
3F: Laboratory
4F: Administrative offices
```

The public can read it. This is normally intentional assistance, not a vulnerability.

If the public display instead includes:

```text
Internal administration account names
Employees' personal information
Confidential server login information
```

it may be inappropriate disclosure. Judge which information is given to which people and whether that matches organizational security requirements.

## 7.2 A simple assessment framework

```text
Information can be queried
          ▼
① What is the information?
Names? Personal data? Secrets?
          ▼
② Who can obtain it?
Employees? Guests? External users?
          ▼
③ Does it meet business needs?
Is disclosure allowed by policy?
          ▼
Assess risk
```

### First question: what information is it?

Compare:

```text
Public
```

with:

```text
Confidential_Merger_Project
```

The names reveal different kinds of information. A name alone still does not establish the contents or their actual sensitivity.

### Second question: who can obtain it?

Finance staff seeing a finance-share name may be expected. An unrelated guest discovering substantial sensitive internal-system information warrants further assessment.

### Third question: does it serve a business need?

Some information must be public for a service to work. Patients need to discover clinical departments; they do not need internal database accounts or confidential document paths. Evaluate disclosure in its operational context.

## 7.3 From enumeration to vulnerability analysis

```text
Enumeration
    │ Discover:
    │ An ordinary user can query the Finance share name
    ▼
Vulnerability Analysis
    │ Investigate:
    │ Does visibility match policy?
    │ Does the account have unintended permissions?
    ▼
Risk Assessment
    │ Evaluate:
    │ Which assets could be affected?
    │ What are the business consequences?
    ▼
Remediation
    └── Correct inappropriate settings and verify
```

M04 and M05 activities can overlap. M04 helps discover specific information; M05 investigates weaknesses and potential consequences. Assess information alongside asset sensitivity, identity, and intended policy before labeling it a vulnerability.

---

# Section 8 | Protect information and operations, rather than only hiding names

Suppose ordinary employees can discover:

```text
Finance
```

Would hiding the name make the system secure? It may reduce exposure, but security still depends on access control.

## 8.1 First layer: network access control

Determine which devices may connect to SMB:

```text
                     Company network
                      /           \
            Employee computer    External network
                     │                │
                Firewall check   Firewall check
                     │                │
                 Rule permits       Not allowed
                     │                ✕
                 NAS TCP 445
```

This limits unnecessary direct access to file services. Set actual policy according to users, devices, business needs, and network architecture. Ordinary internal enterprise SMB should not be exposed arbitrarily on public TCP 445. See [Microsoft's SMB network hardening guidance](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-secure-traffic).

## 8.2 Second layer: resource access control

Passing the firewall and reaching the NAS does not permit reading everything:

```text
NAS
 ├── Public
 │    └── General employees may read
 ├── Finance
 │    └── Authorized finance staff only
 └── Admin
      └── Authorized administrators only
```

Apply least privilege: grant only permissions needed for the work. Reading an announcement need not include modifying or deleting it. This can limit the capabilities available through a compromised account, but least privilege alone does not prevent every attack.

## 8.3 Third layer: logging and auditing

If an account repeatedly queries SMB resources or requests unauthorized files, an investigator may need:

```text
Which account?
At what time?
From which device?
Which resource?
Did the operation succeed or fail?
```

Suitable logging and audit settings provide that evidence. An absent log does not establish that nothing happened; the relevant logging may simply have been disabled.

## 8.4 An integrated protection model

```text
User / device
      ▼
Layer 1: network controls
Which sources may connect?
      ▼
Layer 2: authentication
Confirm identity
      ▼
Layer 3: authorization
Read? Write? Delete?
      ▼
Layer 4: logging and auditing
Record relevant operations and outcomes
```

This simplified model organizes controls. Real logs may be generated at every layer, and permission checks may recur.

SMB signing and SMB encryption can protect message integrity or confidentiality. These transport protections do not replace file-access permissions.

### 8.5 A useful counterexample

Suppose Finance is hidden, but an unauthorized account can still read a financial document through a known path. The problem remains: removing a room's nameplate does not stop everyone from opening its door.

Hiding names manages information exposure. Effective access control must restrict the operations that should not be permitted.

---

# Section 9 | Report the result so others can understand and verify it

A security engineer must turn tool results into a checkable report.

## 9.1 An unsupported report

You execute:

```bash
smbclient -L 192.168.56.10 -p 445 -U labuser
```

and obtain:

```text
Public
Finance
Archive
```

Reporting “We broke into the company's Finance folder” makes an unsupported jump. You obtained:

```text
A successfully listed name
```

The report instead claims:

```text
A successfully compromised system
```

The second statement is not established by the first observation.

## 9.2 A more defensible report

You could write:

> In this authorized test, labuser queried SMB shares on 192.168.56.10 from the designated test network and received Public, Finance, and Archive. A subsequent specified test file in Public was readable. The specified Finance-path read was denied. Archive access and all write operations were not tested.

This states:

- The identity used.
- The target.
- The operations performed.
- The results obtained.
- The remaining unknowns.

It keeps the recipient from mistaking an untested risk for an established outcome.

## 9.3 A reusable reporting framework

Use the following reasoning in M04, M05, and authorized professional tests:

| Element | Question | Example |
|---|---|---|
| Scope | What was in scope? | 192.168.56.10 |
| Identity | Which identity was used? | labuser |
| Action | What was done? | Query SMB shares |
| Observation | What was observed? | Three share names returned |
| Evidence | What supports the observation? | Command and original output |
| Limitation | What remains unconfirmed? | Writes were not tested |
| Assessment | What risk does this represent? | Evaluate against permission policy |

Observation and assessment are different:

```text
Observation:
labuser can discover the Finance share name.
```

```text
Assessment:
Check whether Finance-name visibility is intended for labuser.
```

Without additional evidence, do not turn the observation into a claim of major data leakage.

## 9.4 Further professional practice

Retain the date and time, source position, tool version, exact commands, relevant output, scope limits, and reasons for the risk assessment. When a problem needs correction, propose remediation and verification:

```text
Finding:
An unintended account can read a specified sensitive test file.

Possible cause:
Share or file-system permissions do not match policy.

Remediation:
Review relevant groups and resource permissions.

Verification:
Repeat the specified read with the original account;
also verify that legitimate users can still work normally.
```

A folder name disappearing after a change does not establish that the original improper operation was blocked. Retest that operation. A useful report lets someone understand, verify, and reproduce an observation while separating confirmed results from unknowns.

---

# Section 10 | One small conceptual check

The purpose is evidence interpretation rather than memorizing commands. First organize the lesson into a model.

## 10.1 Build this concept map

```text
Target host
      ▼
① Discover endpoint
TCP 445 open
      ▼
② Identify protocol
Confirm SMB service
      ▼
③ Query resource information
Public / Finance
      ▼
④ Test a specified operation
Read / modify, as authorized
      ▼
⑤ Analyze evidence
Does the outcome match policy?
```

This is a learning and reasoning route, not a fixed communication sequence. Match each observation to the conclusion it actually supports:

```text
Observation A:
445 open

Supports:
An endpoint accepted this probe.

Observation B:
Finance share name returned

Supports:
The name can be queried under these conditions.

Observation C:
Specified test-file read succeeded

Further supports:
The identity used could read that file at that time.
```

Other untested behavior remains unknown.

## 10.2 The final distinctions

Remember:

First: a service existing does not permit use of all its resources.

Second: a visible resource name does not establish readable contents.

Third: reading one specified file does not establish full read/write permissions over the folder.

These distinctions organize the lesson.

---

# Supplement | Conceptual Q&A

These are supplementary teaching questions, separate from actual learner-submitted Q&A records.

### Q1: how does enumeration differ from scanning?

Scanning primarily discovers hosts and port/service states. Enumeration queries concrete information such as shares, users, groups, or directory objects. They overlap: one tool can perform both activities.

### Q2: does TCP 445 open establish a vulnerability?

No. It normally establishes that the endpoint is reachable from the current position. Evaluate the actual service, version, configuration, permissions, and exposure before identifying a vulnerability.

### Q3: must you log in before enumeration?

Not always. Some services offer unauthenticated queries; others require authentication for particular information. An unauthenticated query is not automatically a vulnerability.

### Q4: how do smbclient -L and Nmap differ?

For example:

```bash
nmap -p 445 192.168.56.10
```

checks TCP 445's state, while:

```bash
smbclient -L 192.168.56.10 -p 445 -U labuser
```

attempts to query SMB shares using the specified identity. The first observes an endpoint; the second asks for application-protocol information.

### Q5: are SMB and NAS the same thing?

No. Network Attached Storage (NAS) is a device or system providing storage over a network. SMB is one protocol for network file sharing:

```text
NAS
 ├── SMB
 │    └── Network file sharing
 ├── NFS
 │    └── Another network file-access protocol
 └── HTTPS
      └── Web administration interface
```

A NAS may provide SMB alongside other services. NAS is not limited to SMB, and SMB is not limited to NAS devices.

### Q6: why begin M04 with SMB?

The first lesson establishes enumeration principles. DNS, LDAP, and SNMP later repeat the same questions: what information is queried, under which identity, with what result, and what does that result establish? This framework makes subsequent techniques easier to interpret.

---

# Lesson summary | A knowledge framework

| Topic | Central knowledge | Practical purpose |
|---|---|---|
| Reconnaissance | Gather target background | Develop investigative leads |
| Scanning | Identify endpoints and states | Understand observable services |
| Enumeration | Query concrete resources and attributes | Understand exposed information |
| SMB | Network file-sharing protocol | Recognize a common file service |
| Authentication | Confirm identity | Identify the requester |
| Authorization | Control permitted operations | Protect resources |
| Information Disclosure | Assess inappropriate disclosure | Identify potential risk |
| Access Control | Restrict unintended operations | Reduce unauthorized access |
| Evidence | Preserve checkable observations | Avoid unsupported conclusions |
| Reporting | State operations and limits | Support remediation and decisions |

### Further reading

These official documents connect the concepts with real systems:

- [Nmap — Port Scanning Basics](https://nmap.org/book/man-port-scanning-basics.html): the meaning of port states.
- [Microsoft — SMB Overview](https://learn.microsoft.com/en-us/windows-server/storage/file-server/file-server-smb-overview): SMB operation and client/server roles.
- [Samba — smbclient Manual](https://www.samba.org/samba/docs/current/man-html/smbclient.1.html): client options and commands.
- [Microsoft — SMB Secure Traffic](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-secure-traffic): network protection and security settings.

---

## Understanding check | Try answering

In an authorized laboratory test environment, you execute:

```bash
nmap -p 445 192.168.56.20
```

and receive:

```text
445/tcp open microsoft-ds
```

You then use the test account:

```bash
smbclient -L 192.168.56.20 -U student
```

and obtain:

```text
Sharename      Type
---------      ----
Public         Disk
Research       Disk
Admin          Disk
```

You have not connected to these shares or read any files.

Question 1: which operation is scanning and which is enumeration? Explain why.

Question 2: can you claim that student has read access to Research and Admin? Explain your reasoning.

Question 3: as the reporting engineer, how would you describe confirmed facts and remaining unknowns?

Answer first, then compare your reasoning and limits with the reference answer. This check connects with M04-02: DNS Enumeration. Reading or opening an answer does not establish learner completion.
