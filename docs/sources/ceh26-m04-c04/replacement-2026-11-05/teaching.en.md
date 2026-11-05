# M04-04｜SMB enumeration: a plain-language guide
**SMB Enumeration — Network shares, file permissions, and transport security**

This lesson corresponds to [CS Kairos Learn｜M04-04: SMB enumeration](https://learn.cs-kairos.com/en/courses/ceh/v13/m04/concepts/m04-04/).

## 1. Start with the central idea

**SMB enumeration means establishing what we know, what we are allowed to do, and what remains unproven, beyond finding files on a server.**

Imagine entering a company's office building.

You might go through these steps:

1. See the building's address.
2. Find its entrance.
3. Show an employee badge and pass authentication.
4. See that it contains Finance and Training departments.
5. Enter Training.
6. See a filing cabinet.
7. Open it and read a document.
8. Modify or even delete that document.

These eight actions represent eight different levels of access.

**Seeing the name Finance does not mean you can enter it; entering it does not mean you can read, modify, or delete its documents.**

SMB file sharing works in a similar way.

This lesson covers four questions:

| Main question | Concepts to understand |
|---|---|
| 1. Why can't a computer connect to a shared folder? | SMB connection stages and locating failures |
| 2. Who does the system actually think I am? | Authentication, Guest, Anonymous |
| 3. Does using SMB 3.1.1 make a connection secure? | Dialect, signing, encryption |
| 4. How do we judge whether a security problem exists? | Evidence of enumeration, reading, modification, and permissions |

The guiding principle is:

> **Information visibility ≠ access authorization ≠ ability to read ≠ ability to modify ≠ ability to delete.**

This also distinguishes CEH M04 Enumeration from M05 Vulnerability Analysis.

Enumeration establishes what information a system reveals; vulnerability analysis then assesses whether that information or configuration constitutes a security problem. [learn.cs-kairos.com](https://learn.cs-kairos.com/en/courses/ceh/v13/m04/concepts/m04-04/)

---

## 2. What is SMB, and why do we need it?

### 2.1 SMB lets computers use files on other computers over a network

SMB stands for Server Message Block.

Think of it as:

**A network language that lets multiple computers share folders.**

For example, a research laboratory has ten graduate students whose computers all need to read the same research data.

Without network file sharing, they might have to:

- Exchange files on USB drives.
- Send files by email.
- Each keep a separate copy of the research data.

That is inconvenient and easily creates conflicting versions.

The laboratory can instead install a NAS (Network Attached Storage) device.

It contains several folders:

```text
LAB-NAS
│
├── Public
│   └── Public documents
│
├── Research
│   └── Research data
│
├── Finance
│   └── Financial data
│
└── Backup
    └── Backup data
```

Students can use their own computers to access data on the NAS that they are authorized to use.

SMB is one common protocol that makes this possible.

In Windows, you may have seen a path like this:

```text
\\LAB-NAS\Research
```

Break it into parts:

| Part | Meaning |
|---|---|
| `\\` | Indicates a network resource path |
| `LAB-NAS` | The server providing the files |
| `Research` | The share name exposed by the server |

This is a UNC (Universal Naming Convention) path.

An IP address can also be used, for example:

```text
\\192.168.1.100\Research
```

SMB commonly uses TCP 445. Modern SMB also supports other transports, such as SMB over QUIC, so SMB traffic cannot always be equated with TCP 445.

Also, **an SMB server need not run Windows**.

Linux can provide SMB through Samba, and many NAS devices support SMB. Finding SMB therefore does not establish that the operating system is Windows. [Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/storage/file-server/file-server-smb-overview)

### 2.2 How does SMB differ from FTP?

M04-03 covered FTP.

Both FTP and SMB can transfer files, but their typical use differs.

| Comparison | FTP | SMB |
|---|---|---|
| Main purpose | Uploading and downloading files | Remote file and resource sharing |
| Common environment | File exchange services | Windows, Linux, NAS, corporate networks |
| How it is used | Connect, then operate on remote files | Use shared resources much like local folders |
| Common port | TCP 21 (control connection) | TCP 445 |
| Permission control | FTP server and underlying filesystem | Share permissions and underlying file permissions together |

Their central common principle is:

**Connecting to a service does not establish file access; seeing a filename does not establish that its contents are readable.**

Apply this principle to DNS, FTP, SMTP, SMB, and the next lesson's NetBIOS/RPC.

---

## 3. Why does a connection fail? Understand SMB's five stages

This chapter provides the technical foundation for the lesson.

### 3.1 A connection has more than a success or failure outcome

Suppose you want to connect from a laboratory computer to:

```text
\\LAB-NAS\Research
```

The system goes through a series of procedures before opening the folder.

[[figure:stages]]

The five stages resemble five checkpoints at a company.

### Stage 1: Transport — establish network connectivity

Before entering the company, you first check whether an entrance is open.

For SMB, this commonly means checking whether your computer can connect to the server's TCP 445.

For example:

```text
192.168.1.100:445
```

Suppose a scan reports:

```text
445/tcp open microsoft-ds
```

What does that mean?

**TCP 445 accepts a connection, and this port is commonly associated with SMB.**

It does not establish that:

- You have logged in successfully.
- You have seen any shared folders.
- You can read any file.

The port number alone does not fully identify the service implementation behind it.

This follows CEH M03's Port Scanning concepts.

**M03 mainly asks where the service entrance is; M04 asks what information the service is willing to reveal.**

### Stage 2: Negotiate — agree on the protocol

After reaching the building, you need to establish how both sides will communicate.

SMB works similarly.

Your computer might say:

“I support SMB 2.1, 3.0, and 3.1.1.”

The server replies:

“I also support SMB 3.1.1; let's use that version.”

The two sides complete negotiation.

The selected protocol version is called the **dialect**.

This determines how the sides communicate using SMB, rather than establishing user permissions.

For example:

```text
Dialect: SMB 3.1.1
```

This connection selected SMB 3.1.1.

Keep this distinction in mind:

**Using SMB 3.1.1 does not establish that SMB encryption is enabled for the connection.**

Chapter 7 explains this further.

### Stage 3: Session Setup — establish a session

You have reached the building and established a means of communication.

The guard may now ask:

“Who are you?”

You show an employee badge.

After checking your identity, the guard allows you to establish a usable session.

SMB Session Setup has a similar role.

For example:

```text
Domain: LAB
Username: labreader
Authentication: Success
```

The user has successfully established an authenticated session.

Two concepts matter here.

**Authentication**

Establishes who you are.

**Authorization**

Establishes what you may do.

They are different.

For example, being a laboratory student does not authorize you to read your professor's salary records.

Passing authentication establishes identity.

Specific file permissions still require a separate judgment.

### Stage 4: Tree Connect — connect to a share

The name may be unfamiliar.

Tree Connect means:

**The user requests a connection to a particular shared folder.**

For example:

```text
\\LAB-NAS\Training
```

The server may reply:

```text
Tree Connect: Success
```

The system allows you to connect to the Training share.

But if you instead connect to:

```text
\\LAB-NAS\Finance
```

The server might reply:

```text
STATUS_ACCESS_DENIED
```

This particular share-connection request was rejected.

You cannot then claim:

“Finance contains Salary.xlsx, and I confirmed that it cannot be read.”

You never entered Finance or established which files it contains.

You can only state:

> Connecting to Finance with the specified identity was rejected in this attempt, so there is no evidence of access to its internal files.

This is the evidence interpretation needed for CEH enumeration.

### Stage 5: File Operation — operate on files

Suppose you successfully connect to Training.

It contains two files:

```text
Training
│
├── readme.txt
│
└── draft.txt
```

You can see both filenames.

The server can still apply different permissions:

| File | List filename | Read content | Modify content |
|---|---|---|---|
| readme.txt | Success | Success | Not tested |
| draft.txt | Success | Denied | Not tested |

What does this establish?

Entering the share does not establish that you can operate on every file.

Each operation may be subject to different permission restrictions.

### 3.2 Why distinguish these stages?

The same description, “cannot connect,” can refer to entirely different problems.

| Failed stage | Possible cause | What to check |
|---|---|---|
| Transport | Service stopped, firewall blocking | Network and ports |
| Negotiate | Incompatible protocol | SMB versions and server configuration |
| Session Setup | Authentication failure | Account, tickets, authentication policy |
| Tree Connect | Missing share, insufficient authorization, encryption requirement mismatch | Share settings, permissions, security policy |
| File Operation | Insufficient file access | Effective permissions on the target file |

Microsoft's troubleshooting guidance follows this approach: locate the failure in negotiation, session setup, or tree connection before changing permissions in response to `ACCESS_DENIED`. [Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/negotiate-session-setup-tree-connect-fails)

The diagram above was recreated from this lesson's five stages; compare it with Microsoft's official troubleshooting guidance.

---

## 4. Why might the server use an identity other than the one you entered?

This chapter introduces three identities.

### 4.1 Named account

Suppose you sign in as:

```text
LAB\labreader
```

You intend to use SMB as labreader in the LAB domain.

This resembles showing your own employee badge.

The server must authenticate you before determining authorization.

### 4.2 Guest

Think of Guest as a temporary identity provided for visitors.

For example:

The company has a Public folder that visitors may use.

Visitors need not have ordinary employee accounts; the system can map them to Guest.

Guest still has limits.

For example:

```text
Public:
    Guest → Read

Finance:
    Guest → Deny
```

This lets Guest read public data but denies access to financial data.

### 4.3 Anonymous

Anonymous refers to access without establishing an ordinary named-user identity.

It is distinct from Guest.

Depending on the SMB server and configuration, an anonymous connection may be rejected or mapped to a Guest identity.

Do not infer the server's final identity only from the username entered by the client.

### 4.4 Why does no password prompt not prove anonymous access?

This distinction matters throughout the lesson.

Suppose you open this path in Windows File Explorer:

```text
\\LAB-NAS\Research
```

The folder appears immediately.

No password prompt appears.

Someone might say:

“This NAS permits anonymous access!”

That conclusion may be wrong.

Windows may have used your existing credentials or reused a session established earlier.

In a domain environment, a Kerberos ticket may also complete authentication.

Therefore:

**No password dialog does not mean no authentication occurred.**

Distinguish the user interface from the actual protocol outcome.

---

## 5. SMB enumeration tools: what does smbclient do?

Compare this with the FTP tools covered in M04-03.

On Linux, `smbclient` is an SMB client supplied by Samba.

It interacts with SMB servers, including querying shares, listing directories, and downloading files.

### 5.1 `-L`: query the share list

Suppose we run this in an authorized laboratory environment:

```bash
smbclient -L 192.0.2.10 -U labreader
```

The address `192.0.2.10` is reserved for documentation examples.

The command means:

“Use labreader to query which shared resources this SMB server provides.”

Suppose the result is:

```text
Sharename       Type
---------       ----
Training        Disk
Finance         Disk
Public          Disk
```

We know that the server returned three share names.

We cannot yet claim that all three shares can be entered.

### 5.2 `ls`: list items inside a folder

Next, connect to a share you are authorized to access:

```bash
smbclient //192.0.2.10/Training -U labreader
```

If successful, smbclient opens its interactive environment.

Enter:

```text
smb: \> ls
```

Suppose it returns:

```text
readme.txt
draft.txt
```

This directory enumeration succeeded and returned two filenames.

It does not establish that either file's contents are readable.

### 5.3 `get`: read and download a file

With explicit authorization to test a download:

```text
smb: \> get readme.txt
```

Success means that the file's contents were transferred to the local computer over SMB.

**`get` does more than query a filename: it reads a remote file and saves data locally.**

In an environment handling sensitive information, downloading cannot be treated as enumeration without consequences.

### 5.4 What does `-N` mean?

You may have seen:

```bash
smbclient -L 192.0.2.10 -N
```

The main purpose of `-N` is to suppress an interactive password prompt.

It does not mean:

“Log me in anonymously, and the server will certainly accept it.”

Check the actual outcome.

The operations differ as follows:

| Operation | Question it answers |
|---|---|
| `smbclient -L` | Which shared resources does the server return? |
| `ls` | Which items can I list in the current directory? |
| `get` | Can I obtain the specified file's contents? |

Samba's official manual documents these functions and the behavior of `-N`. [Samba](https://www.samba.org/samba/docs/current/man-html/smbclient.1.html)

---

## 6. Why must share permissions and file permissions be considered together?

This extends the lesson into a practical permission question.

### 6.1 Share permissions

Suppose an administrator shares this Windows Server folder:

```text
D:\Research
```

The share name is:

```text
\\LAB-SERVER\Research
```

The administrator can configure permissions for the share.

For example:

```text
Research Share

Researchers → Read
Administrators → Full Control
```

This is the first authorization layer.

### 6.2 NTFS permissions

Windows NTFS also supports permissions on folders and files.

For example:

```text
D:\Research

Researchers → Modify
Administrators → Full Control
```

This is the second authorization layer.

### 6.3 How do the two layers work together?

Suppose a student accesses the folder through SMB.

The settings are:

| Permission source | labreader |
|---|---|
| Share Permission | Read |
| NTFS Permission | Modify |

What is the result?

Through this SMB share, labreader can generally read but cannot modify.

The share permission allows only Read.

The reverse applies too.

| Permission source | labreader |
|---|---|
| Share Permission | Change |
| NTFS Permission | Read |

A share permission of Change does not grant modification rights absent from NTFS permissions.

For an initial understanding:

**Effective access through SMB must satisfy authorization at both the share and filesystem layers.**

Actual Windows permission calculations also involve group membership, inheritance, deny permissions, and access control entries (ACEs). “Take the more restrictive permission” is only an introductory simplification. [Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/negotiate-session-setup-tree-connect-fails)

### 6.4 ABE: why might even filenames be hidden?

ABE stands for Access-Based Enumeration.

It filters displayed items based on access permissions.

Suppose a folder contains:

```text
Research
│
├── public.txt
├── student_report.txt
└── professor_salary.xlsx
```

The administrator wants ordinary students to see only data they may access.

With appropriately configured ABE enabled, a student might see only:

```text
Research
│
├── public.txt
└── student_report.txt
```

`professor_salary.xlsx` does not appear in that student's directory listing.

The point is:

**In addition to controlling reads, visibility filtering can reduce exposure of file and folder names that should remain hidden.**

ABE primarily controls enumeration of files and folders inside a share.

It does not replace NTFS permissions or guarantee that server share names are hidden in every situation.

If file permissions are wrong, ABE alone cannot solve every access-control problem.

---

## 7. How do SMB 3.1.1, signing, and encryption differ?

These concepts are easily confused and matter in practical security assessment.

### 7.1 SMB 3.1.1 is a protocol version

Imagine that you and a friend both use a new version of a messaging application.

The new version supports end-to-end encryption.

Installing it on both sides does not by itself establish that a particular conversation uses end-to-end encryption.

The same principle applies to SMB.

Supporting encryption differs from using it in this connection.

### 7.2 Signing: digital signatures

Signing resembles sending a letter with a tamper-evident signature.

The recipient can verify that the message came from a party holding the appropriate key and check whether it was altered.

However, **signing itself does not hide message contents**.

SMB signing protects protocol-message integrity and authenticity.

For example:

```text
SMB Signing: Enabled
```

In this example, it describes signing used by this connection.

This alone does not establish SMB encryption of the transferred content.

### 7.3 Encryption

Encryption resembles putting the letter in a locked confidential box.

An interceptor without the appropriate decryption key cannot directly read the protected contents.

SMB encryption primarily protects data confidentiality in transit.

For example:

```text
SMB Encryption: Enabled
```

In this example, SMB-layer encryption protects this communication.

This does not establish that data on the NAS disks is encrypted.

Protecting stored data generally requires additional technology, such as BitLocker or another storage-encryption mechanism.

### 7.4 Three different concepts

| Mechanism | Main purpose | Analogy |
|---|---|---|
| SMB Dialect | Negotiate the protocol version | Agree on a version of the language |
| SMB Signing | Message integrity and authenticity | Check that a letter has not been altered |
| SMB Encryption | Confidentiality in transit | Put the letter in a locked box |

A further distinction matters:

Even if SMB-layer encryption is off, do not assume without checking that the whole network path lacks any other encryption. A VPN or another secure transport layer may provide protection.

State precisely which layer uses which protection.

Microsoft distinguishes SMB encryption from encryption of stored data and describes SMB 3.1.1 negotiation protection. [Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security)

### 7.5 Supported, required, and actually used

Suppose a laboratory NAS has these settings:

```text
SMB Version: 3.1.1

Signing Supported: Yes
Signing Required: Yes

Encryption Supported: Yes
Encryption Required: No
```

Here:

**Supported**

The device has the capability.

**Required**

The relevant security policy requires connections to use it.

**Negotiated/Observed**

The settings actually negotiated or observed for this connection.

A system may support SMB encryption without requiring it for all shares.

A connection may therefore show:

```text
Dialect: SMB 3.1.1

Signed: True

Encrypted: False
```

There is no contradiction.

It means:

1. SMB 3.1.1 is in use.
2. SMB signing is in use.
3. This connection does not use SMB-layer encryption.

**The first fact cannot establish encryption.**

A practical note: Windows 11 24H2 and Windows Server 2025 strengthened default SMB signing requirements. An older NAS that stops connecting after an OS update may have a security-policy compatibility issue rather than simply incorrect file permissions. [Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/access-denied-access-smb-file-share)

---

## 8. Worked case: interpret SMB enumeration results

Now combine the preceding concepts.

The following is the original teaching material's synthetic case.

Suppose you are the laboratory security administrator using:

```text
Domain: LAB
Username: labreader
```

You are authorized to assess this NAS.

### 8.1 Observed results

| Test | Result |
|---|---|
| Query share list | Training, Finance |
| Connect to Training | Success |
| List Training directory | readme.txt, draft.txt |
| Read readme.txt | Success |
| Read draft.txt | ACCESS_DENIED |
| Connect to Finance | ACCESS_DENIED |
| SMB dialect | 3.1.1 |
| SMB Signing | In use |
| SMB Encryption | Not in use |
| Upload files | Not tested |
| Modify files | Not tested |
| Delete files | Not tested |

Use this record to practice security judgment.

[[figure:evidence]]

### 8.2 Does Finance appearing in the list establish access?

No.

All we know is:

“The server returned a share named Finance.”

Tree Connect was rejected; we did not enter Finance.

Its internal files remain unknown.

### 8.3 draft.txt is visible but unreadable: is that secure?

It depends on the security requirements.

Suppose the policy states:

> Students must not read draft.txt.

The rejected read matches the expectation for this test.

But suppose the policy states:

> Students must not even know the name draft.txt.

A visible filename may then constitute information disclosure even though reading is rejected.

This is where ABE can help.

Security assessment must check whether information should be displayed as well as whether files can be read.

### 8.4 Does reading readme.txt establish deletion rights?

No.

Deletion was not tested.

The accurate conclusion is:

“labreader successfully read the specified contents of readme.txt in this attempt; modification and deletion permissions remain unverified.”

That is more precise than claiming “full file access.”

### 8.5 Does this record prove the NAS is secure?

Not yet.

It establishes only the results for a particular identity, time, and set of operations.

For example:

```text
Confirmed:

- labreader can connect to Training.
- labreader can read readme.txt.
- Reading draft.txt as labreader was rejected.
- Connecting to Finance as labreader was rejected.
- This SMB connection uses signing.

Not yet confirmed:

- Whether other accounts have excessive permissions.
- Whether Guest or anonymous access causes problems.
- Whether filenames are exposed inappropriately.
- Whether unauthorized modification or deletion is allowed.
- Whether all transport-encryption policies are met.
```

Keep in mind:

**A rejected request from one account does not prove that every other account will also be rejected.**

Likewise, finding no problem in one check does not amount to a comprehensive security validation of the entire NAS.

---

## 9. Practical extension: how should you assess a laboratory NAS?

Turn this lesson into a simple security-check workflow.

### 9.1 Establish the target and identity

Know the following:

- Who manages the NAS?
- Which checks are authorized?
- Which account will this test use?
- Which permissions should that account have?

This lets you compare results with expectations.

### 9.2 Check visible information and actual authorization

For example:

```text
Account: labreader

Expected permissions:

Training → Read
Research → Read
Finance  → Deny
Backup   → Deny
```

Then check:

Can Training be connected?

Does Finance reject the connection?

Can specific files in Training be read?

These are distinct verification items.

### 9.3 Check transport security

For example:

```text
SMB Dialect
SMB Signing
SMB Encryption
Guest Access
```

Compare:

**What the policy requires with what the actual connection uses.**

If policy requires sensitive research data to be transferred using SMB encryption but the connection shows no SMB encryption, investigate whether that policy is correctly implemented.

### 9.4 Preserve evidence

Each check should record at least:

| Field | Purpose |
|---|---|
| Timestamp | When the test occurred |
| Server | Which device was tested |
| Identity | The identity actually used |
| Resource | Which share or file was tested |
| Operation | Enumeration, reading, or another operation |
| Response | The complete system response |
| Expected Result | Whether policy should allow or reject it |
| Conclusion | The conclusion supported by this test |

You can organize the results further:

```text
SMB Security Assessment
│
├── 1. Network Connectivity
│   └── Network connectivity and entrance
│
├── 2. Authentication
│   └── Actual user identity
│
├── 3. Authorization
│   ├── Share Permissions
│   ├── File Permissions
│   └── Access-Based Enumeration
│
├── 4. Transport Security
│   ├── SMB Dialect
│   ├── Signing
│   └── Encryption
│
└── 5. Evidence & Reporting
    ├── Successful checks
    ├── Rejected operations
    └── Untested items
```

This makes the assessment traceable, reproducible, and reviewable, beyond running a tool.

It also connects naturally to CEH M05 vulnerability analysis.

---

## 10. Recap: which judgment skills does this lesson develop?

M04-04 comes down to three principles.

**First, distinguish connection stages.**

A successful TCP connection, authentication, share connection, and file read establish different things.

**Second, distinguish information from permissions.**

Knowing a resource exists does not authorize its use; reading does not establish modification or deletion rights.

**Third, distinguish security capabilities from actual protection.**

Supporting signing, requiring signing, and actually using signing are different levels of information. The same applies to encryption.

**Do not report untested matters as confirmed, or generalize one test into an overall security conclusion.**

This applies to SMB, FTP, SMTP, RPC, Active Directory, and other internal enterprise systems.

---

## 11. Understanding check: make your own judgment

Suppose a laboratory NAS produces these test results:

```text
SMB Server: LAB-NAS

Username: student01

Share List:
    Public
    Research
    Finance

Public:
    Tree Connect: Success
    ls: Success
    readme.txt: Read Success

Research:
    Tree Connect: Success
    confidential.txt: ACCESS_DENIED

Finance:
    Tree Connect: ACCESS_DENIED

Protocol:
    SMB 3.1.1

Signing:
    Enabled

Encryption:
    Disabled
```

Answer four questions.

**Question 1:**

Finance appears in the share list, but Tree Connect was rejected. Can you determine which files it contains? Why?

**Question 2:**

Reading confidential.txt in Research was rejected, but the filename remains visible. Could this be a security problem? What determines your judgment?

**Question 3:**

This NAS uses SMB 3.1.1 and signing is enabled. Does that establish that the SMB content is encrypted in transit?

**Question 4:**

As the laboratory security administrator, you want to establish that student01 cannot delete files in Research. Is the current evidence sufficient? How would you verify it without endangering production research data?

Answer first, then compare with the reference answers to check your reasoning, conceptual differences, and application to NAS security administration.
