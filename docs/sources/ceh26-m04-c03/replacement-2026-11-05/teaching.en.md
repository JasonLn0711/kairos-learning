# M04-03｜FTP/SMTP enumeration: a plain-language guide from the ground up

**The central idea: knowing what information a system contains does not authorize you to use it; a service answering questions does not establish permission to perform operations.**

We will study two common network services:

- **FTP (File Transfer Protocol)** transfers files, like a company's file warehouse.
- **SMTP (Simple Mail Transfer Protocol)** sends email, like a company's mailroom.

Attackers may collect information through these services. Security staff must judge which information should remain private and whether permissions are configured incorrectly.

This lesson follows the 11 chapters of the [CS Kairos M04-03 source lesson](https://learn.cs-kairos.com/en/courses/ceh/v13/m04/concepts/m04-03/).

## 1. A service is like a reception desk: answering a question differs from authorizing an action

Imagine walking into a company.

You ask the receptionist:

“Which departments does your company have?”

The receptionist may answer:

“We have IT, Finance, and Human Resources.”

You now know which departments exist.

But if you then ask:

“May I enter Finance and read the salary records?”

The receptionist may refuse.

This illustrates four security concepts:

| Concept | English term | Plain-language analogy |
|---|---|---|
| Identifying a service | Service Identification | Know whether the company is open |
| Enumerating information | Enumeration | Know its departments, employees, and resources |
| Verifying identity | Authentication | Establish who you are |
| Granting access | Authorization | Decide what you may do |

For example, you know an FTP server contains `salary.xlsx`.

That does not establish that you can download it.

Even a successful FTP login does not establish read permission for that file.

### Connection to earlier CEH lessons

In M03 network scanning, Nmap might report:

```text
21/tcp   open   ftp
25/tcp   open   smtp
```

The scan suggests that the target may provide FTP and SMTP services.

In M04 enumeration, we investigate capabilities, exposed information, and the permissions of the identity used for testing.

However, **finding a service, listing information, obtaining permission, and completing an operation establish different things**.

Even when an operation is technically possible, it must also fall within the administrator-authorized testing scope.

---

## 2. What is FTP, and why does it use two connections?

FTP is a protocol for transferring files between computers.

For example, a company has a file server, and employees need to download reports to their own computers.

Think of FTP as a delivery company.

Receiving a package generally involves two things.

First, you submit a request to customer service.

Second, the delivery system actually brings the package to you.

FTP has a similar design.

[[figure:protocols]]

### 1. Control connection

It commonly uses TCP port 21.

This connection carries commands, such as:

“I want to log in.”

“Tell me which files are available.”

“I want to download report.pdf.”

Think of it as the customer-service phone line.

### 2. Data connection

This connection transfers file contents or directory listings.

Think of it as the delivery operation.

This leads to a possible situation:

You log in successfully and request a directory listing, but the data connection cannot be established.

A firewall or network configuration may be blocking that connection.

This does not necessarily indicate incorrect credentials.

### 3. Active mode and passive mode

FTP commonly establishes data connections in two ways.

**Active mode**

The client tells the server, “I am waiting here for your connection.”

The server then initiates the data connection.

**Passive mode**

The server tells the client, “This listening endpoint is ready; connect to it.”

The client then initiates the data connection.

Passive mode is common in environments with NAT and firewalls.

Keep this distinction in mind:

The control connection commonly uses TCP 21, but the data connection need not use TCP 20. Its actual ports depend on the mode and negotiation. [RFC Editor](https://www.rfc-editor.org/rfc/rfc959.html)

---

## 3. FTP enumeration: what can you ask the server?

Suppose you connect to the company's FTP server.

FTP enumeration resembles asking a file administrator questions.

Different commands ask different questions.

| FTP command | Plain-language question | Purpose |
|---|---|---|
| `FEAT` | Which features do you support? | Query advertised features |
| `LIST` | What is in this directory? | List a directory |
| `MLSD` | Give me a standardized directory listing | Obtain entries and their attributes |
| `MLST` | Tell me about this item | Query metadata for one item |
| `RETR` | I want to download this file | Request file contents |
| `STOR` | I want to upload a file | Request a file write |

### Example: how do LIST and RETR differ?

Suppose you see the following on the company's FTP server:

```text
public/
reports/
finance/
```

You know that three directories exist.

Next, you try entering `finance`, but the server refuses.

What does that establish?

The directory name may be visible to the current user, without that user having permission to enter it or read its files.

### What is metadata?

Metadata means information describing data.

In plain language, it is data about data.

For example:

```text
filename: report.pdf
size: 102400
modified: 2026-11-04
```

You know the filename, size, and modification time.

You have not necessarily seen the PDF's contents.

That distinction matters in security analysis.

Even when downloads are blocked, filenames may expose sensitive information such as customer names, project identifiers, or backup dates.

---

## 4. Anonymous FTP: is anonymous login a vulnerability?

Not necessarily.

Anonymous FTP allows access through a shared anonymous identity without requiring an individually assigned account.

Suppose a university provides public research data.

Anyone may download:

```text
public/
├── dataset.csv
├── documentation.pdf
└── license.txt
```

This is an intentionally public service.

Anonymous login alone is therefore not necessarily a vulnerability.

The question to investigate is:

**Do anonymous users receive more permissions than intended?**

For example, policy permits downloading public data only, but the system accidentally allows anonymous upload, overwrite, or deletion.

That creates a security risk.

Another possible situation is:

Anonymous users cannot modify files but can see unpublished data:

```text
backup/
├── customer_database.sql
└── internal_config.txt
```

Exposing filenames may disclose information even when downloads are restricted.

Traditional unencrypted FTP may also send credentials and data in cleartext. Correct permissions therefore do not remove the need to assess transport security. [learn.cs-kairos.com](https://learn.cs-kairos.com/en/courses/ceh/v13/m04/concepts/m04-03/)

---

## 5. How should you read an FTP operation record?

This is a central part of the lesson.

Suppose we see a synthetic teaching record.

First:

```text
230 Session established
```

The server reports that the current session is logged in.

The record does not identify the account, so we cannot assume anonymous login.

Next:

```text
MLSD
```

The client requests a directory listing.

The server replies:

```text
150
```

It is preparing to begin data transfer.

The data connection provides information about two items:

`notice.txt` and `draft.txt`.

The server then replies:

```text
226
```

The preceding directory-listing transfer has completed.

What have we established so far?

**This test successfully obtained a directory listing.**

It has not established that file contents can be downloaded.

Next, the client requests:

```text
RETR draft.txt
```

This means:

“I want to download draft.txt.”

The server replies:

```text
550 Access denied
```

This request was rejected.

The conclusion supported by the record is:

“The user could see the name draft.txt, but this download request was rejected.”

It does not support “The user successfully obtained draft.txt.”

### Common FTP reply codes

| Code | Meaning in plain language |
|---|---|
| `150` | Preparing to start data transfer |
| `226` | The corresponding data-transfer operation completed |
| `230` | The server reports a logged-in session |
| `425` | Cannot establish the data connection |
| `530` | Not logged in, or login required |
| `550` | Request cannot be performed; interpret the context |

Distinguish `425` from `550`.

With `425`, first investigate whether the data connection was established.

`550` indicates an unperformed request. File availability, permissions, or other conditions may be involved; read the complete reply.

**A number alone cannot identify the cause of a security vulnerability.**

---

## 6. How do FTP, FTPS, and SFTP differ?

These names look similar but describe different mechanisms.

Use document delivery as an analogy.

### FTP: ordinary delivery

Traditional FTP has no built-in transport encryption.

Without another protective mechanism, third parties along the network path may see data and authentication information.

### FTPS: FTP with encryption protection

FTPS adds TLS protection to FTP.

TLS is the transport-encryption technology also used by services such as HTTPS.

Because FTP has control and data connections, check protection for each separately.

**Encrypting the control connection does not establish that the data connection is encrypted.**

For example, FTPS uses `PROT P` to request protected data connections, but the actual negotiation and configuration must still be verified. [RFC Editor](https://www.rfc-editor.org/rfc/rfc4217.html)

### SFTP: a different file-transfer protocol over SSH

SFTP is not FTP with TLS.

It is a file-transfer protocol operating over SSH.

It commonly uses TCP port 22.

Think of it as another file-transfer system with secure-connection mechanisms.

### Comparison

| Comparison | FTP | FTPS | SFTP |
|---|---|---|---|
| Foundation | FTP | FTP + TLS | SSH |
| Common ports | 21 | 21, 990 | 22 |
| Transport encryption | None built in | Supported | Through SSH |
| Protocol relationship | FTP | FTP security extension | Different protocol |

These are common ports only; a port number does not establish the protocol or encryption state.

Also, encryption and authorization are separate.

**Using SFTP does not guarantee correct file-permission configuration.**

---

# Part two: SMTP enumeration

## 7. What is SMTP?

SMTP is the network protocol responsible for sending email.

Think of it as a postal service.

When you send mail using Gmail or a company mail system, mail-transfer mechanisms deliver it toward its destination.

Distinguish two activities.

### First: a user hands mail to a submission server

For example:

You write a message in a mail application and press Send.

The application hands it to a submission server.

This step is called:

**Message Submission**

Common ports are:

TCP 587 or TCP 465.

### Second: mail servers transfer mail between themselves

For example:

Company A's mail server needs to send a message to Company B's mail server.

This commonly uses TCP port 25.

The sequence is:

```text
Your mail application
      │
      │ TCP 587 / 465
      ▼
Company submission server
      │
      │ TCP 25
      ▼
Recipient-side mail server
      │
      ▼
Recipient mailbox
```

Both activities use SMTP, but their security policies differ.

User submission normally requires appropriate authentication.

Normal server-to-server delivery cannot simply require every external sending server to log in with a user account belonging to the receiving company.

### How SMTP differs from IMAP and POP3

SMTP primarily sends mail.

IMAP and POP3 primarily let users access messages in their mailboxes.

SMTP is therefore not a protocol for directly browsing an inbox.

---

## 8. SMTP enumeration: EHLO, AUTH, VRFY, and EXPN

Suppose you connect to a mail server.

You can ask it different questions.

### 1. EHLO: ask which features the server supports

EHLO means something like:

“Hello, I am a mail client. Which features do you support?”

For example, the server might advertise:

```text
250-STARTTLS
250-AUTH PLAIN LOGIN
250 SIZE 10485760
```

These lines mean:

`STARTTLS`: the server advertises a mechanism for upgrading transport encryption.

`AUTH`: the server advertises the listed SMTP authentication mechanisms.

`SIZE`: the server advertises a message-size limit.

The distinction is:

**A server advertising a feature does not establish that you have successfully used it.**

Seeing `AUTH` does not mean you are logged in.

Seeing `STARTTLS` does not mean the current connection is encrypted.

Some servers advertise certain authentication features only after TLS is established. A pre-TLS list alone therefore does not determine the final available features. [RFC Editor](https://www.rfc-editor.org/rfc/rfc4954.html)

### 2. VRFY: ask about a user

VRFY asks something like:

“Can you verify this user?”

Suppose you issue:

```text
VRFY learner
```

The server replies:

```text
252 Cannot verify this user
```

What does that mean?

The server did not verify that user.

It does not justify the conclusion:

“This account does not exist.”

The server may deliberately restrict account queries to prevent information collection by outsiders.

### 3. EXPN: query members of a mailing list

Suppose a company has a mailing list:

```text
engineering@example.com
```

It may correspond to several employees.

EXPN was designed to ask a server to expand a mailing list.

Providing too much information externally can expose employee addresses or organizational information.

An administrator may therefore restrict EXPN under security policy.

### 4. SMTP reply codes

| Code | Meaning in plain language |
|---|---|
| `220` | Mail service ready |
| `250` | The current request was accepted or completed |
| `252` | The queried user could not be verified |
| `550` | Request not accepted; interpret the command and reply text |

A common mistake is:

“SMTP replied 250, so the message must have been delivered.”

That inference is incorrect.

`250` is a success reply for a particular SMTP step.

Accepting a recipient address, for example, does not establish complete message delivery.

Also, **an SMTP account is not necessarily an operating-system account**.

Knowing an email address does not establish that it can log in to Windows or Linux.

---

## 9. Read an SMTP operation record

The lesson provides a synthetic record.

Interpret it step by step.

### Step 1: connect to the mail server

```text
220 mail.training.example ESMTP
```

The server reports that its mail service is ready.

No login has occurred in this record.

### Step 2: query server features

```text
EHLO client.training.example
```

The server provides a feature list.

It advertises STARTTLS among those features.

Note SMTP's multiline reply format.

For example:

```text
250-mail.training.example
250-STARTTLS
250 SIZE 10485760
```

The hyphen in `250-` indicates that this multiline reply continues.

The last line uses `250` followed by a space.

These lines therefore belong to one EHLO reply.

### Step 3: ask about a user

```text
VRFY learner
```

The server replies:

```text
252 Cannot verify this user
```

This does not prove that the user does not exist.

### Step 4: which conclusions are supported?

We now know:

The service provides SMTP replies and advertises some extensions.

It did not verify the specified user.

There is no evidence yet that:

TLS was established, a user authenticated, a message was submitted, or a message was delivered.

### A further STARTTLS detail

After completing STARTTLS, an SMTP client should issue EHLO again.

The advertised features can differ before and after encryption is established.

TLS on an SMTP connection protects the corresponding transport segment; it does not automatically provide sender-to-recipient end-to-end encryption. [RFC Editor](https://www.rfc-editor.org/rfc/rfc3207.html)

### What is an open relay?

An open relay permits unrestricted mail forwarding.

Imagine a post office that should handle only mail allowed by its policy.

Instead, strangers can use it to forward mail to arbitrary external addresses.

It may become a channel for spam.

However:

**An open SMTP port 25 does not establish an open relay.**

Successful EHLO does not establish one either.

An authorized test environment must establish forwarding behavior against the source/destination policy before supporting that conclusion.

---

## 10. Protection and verification: how should FTP and SMTP be secured?

This chapter examines security from a defender's perspective.

Suppose you manage security for a company.

Do more than ask:

“Did the FTP login succeed?”

Ask:

“Which files can this account actually access?”

Likewise, do more than ask:

“Did SMTP reply normally?”

Ask:

“Does this mail service permit policy-compliant sending while rejecting unauthorized forwarding?”

### Build an evidence-based judgment method

[[figure:evidence]]

The diagram extends into a security-verification framework:

| Verification layer | FTP example | SMTP example |
|---|---|---|
| Service exists | FTP replies | SMTP replies |
| Feature information | FEAT advertises features | EHLO advertises features |
| Authentication | A specified account logs in | A specified account authenticates |
| Authorization | Reading a specified file is allowed | Policy-compliant submission or forwarding is allowed |
| Operation result | A file read actually succeeds | A specified mail-processing step succeeds |
| Security verification | Unauthorized file access is restricted | Unauthorized forwarding is restricted |

A formal assessment also preserves test time, identity, commands, replies, encryption state, and relevant configuration or logs.

The question we ultimately answer is more precise than:

“Does the system seem problematic?”

It is:

**“Which permitted and restricted operations can we establish from policy requirements and actual test evidence?”**

Apply this reasoning to the preceding DNS enumeration lesson and the following SMB lesson as well.

---

## 11. Final check: why are both inferences wrong?

The lesson ends with two situations.

The first is:

FTP login succeeded and MLSD listed `draft.txt`, but the download request was rejected.

The second is:

An SMTP VRFY query for a specified account received `252`.

Someone then writes:

“The draft contents were obtained, and the account was confirmed not to exist.”

Both conclusions exceed the available evidence.

The FTP record establishes filename visibility and an unsuccessful download request.

The SMTP record establishes only that this query did not verify the user, not that the account does not exist.

This is the judgment skill M04-03 aims to develop.

---

# Lesson recap

Condense the lesson into three statements:

**First: FTP handles files; SMTP handles mail.**

FTP exchanges files, and SMTP sends mail. Both are network services that may reveal information in their replies.

**Second: enumerating information does not grant permission.**

Seeing a filename does not establish download access; seeing advertised mail authentication does not establish login.

**Third: every security conclusion needs corresponding evidence.**

One successful step does not establish that every later step succeeded.

This distinction connects CEH M03 network scanning and M04 enumeration to M05 vulnerability analysis.

## Understanding check

Judge the following two situations.

**Question 1: FTP**

You are assessing an internal company FTP server. An authorized test account logs in successfully and can list:

```text
public.txt
employee_salary.xlsx
backup.sql
```

No file has been downloaded yet.

Questions:

A. Can you conclude that all these file contents have been leaked?

B. If policy prohibits exposing salary filenames to ordinary employees, is there an issue worth investigating?

**Question 2: SMTP**

In an authorized test environment, you send EHLO and the server advertises STARTTLS and AUTH.

Questions:

A. Does this establish that the connection is encrypted now?

B. Does it establish that you have logged in successfully?

C. What further type of evidence is needed to determine whether the server can be abused as an open relay?

Answer each question's A, B, and C parts before comparing with the reference answers to check your judgment and reasoning.
