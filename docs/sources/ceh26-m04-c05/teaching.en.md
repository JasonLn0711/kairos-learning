# M04-05 | NetBIOS/RPC enumeration: a complete plain-language lesson

**Discovering a computer and learning which services it offers does not establish permission to use those services.**

This is the fifth lesson in CEH M04 (Enumeration). Its subject is:

**NetBIOS/RPC Enumeration: investigating network names, remote services, and operation permissions.**

Original lesson: [CS Kairos Learn — M04-05](https://learn.cs-kairos.com/en/courses/ceh/v13/m04/concepts/m04-05/)

## Understand the lesson through a story

Imagine that you are a criminal investigator examining a company's information systems.

You know the company has an office building, but not its departments, the employees responsible for each task, or whether you may inspect its records.

You begin investigating.

| Investigation step | Network counterpart |
|---|---|
| ① Learn the building address | IP Address |
| ② Ask which departments are inside | NetBIOS name enumeration |
| ③ Learn that a department offers document services | SMB service |
| ④ Ask the switchboard for an employee's extension | RPC Endpoint Mapper |
| ⑤ Call the extension | Establish a network connection |
| ⑥ Confirm that both parties use compatible procedures | RPC interface negotiation |
| ⑦ Present identification and request records | Authentication and operation authorization |

Suppose you have discovered:

- A department manages files.
- Its contact extension is 50020.
- Calling 50020 does not connect.

**Does that establish that the department does not exist?**

No.

The line could be faulty, the extension could have changed, external calls could be blocked, or the employee might not be answering.

The network equivalent is:

> **Discovering a service does not establish connectivity; connectivity does not establish authentication; authentication does not authorize every operation.**

This is the central idea of M04-05.

The following six chapters develop the original lesson's concepts step by step.

## Chapter 1 | Meet NetBIOS, SMB, and RPC

These technologies often appear together in Windows networks, but have different purposes.

[[figure:roles]]

### 1.1 NetBIOS: recognizing computer names

NetBIOS stands for Network Basic Input/Output System.

Think of it as:

**A set of naming and communication mechanisms for local-area network applications.**

For example, a company has three computers:

| IP address | Computer name | Purpose |
|---|---|---|
| 192.168.1.10 | LAB-FS | File server |
| 192.168.1.20 | LAB-PC01 | Employee computer |
| 192.168.1.30 | LAB-PRINT | Printing service |

Computers use IP addresses to communicate on this network.

People find large numbers of IP addresses difficult to remember.

Naming mechanisms provide recognizable names instead.

For example:

```text
LAB-FS
```

This name might identify a company file server.

NetBIOS includes more than name resolution: it also includes name service, datagrams, and sessions.

NetBIOS over TCP/IP (NBT/NetBT) carries those functions over TCP/IP networks.

Modern Windows networks also use DNS extensively; computer names do not all have to be resolved through NetBIOS.

### 1.2 SMB: sharing files between computers

SMB stands for Server Message Block.

Suppose a company shares this folder:

```text
\\LAB-FS\Public
```

Employees may be able to access it through SMB.

SMB operations include:

- Querying shared folders.
- Listing folder contents.
- Reading files.
- Creating, modifying, or deleting files.

Each operation can have different permission requirements.

Employee A might be able to read a report but not modify it.

Employee B might have both read and write permission.

Therefore:

**Knowing that a computer offers SMB does not establish permission to read its files.**

This is the same distinction used in M04-04.

### 1.3 RPC: asking another computer to perform a function

RPC stands for Remote Procedure Call.

This is the main new concept in this lesson.

Suppose a company has a print server.

You open management software on your own computer and ask:

> How many print jobs are currently queued?

The software can request that information from a remote service through RPC.

Conceptually:

```text
Your computer
    |
    | How many print jobs are queued?
    v
Remote server
    |
    | Execute the query function
    v
Return the query result
    |
    v
Your computer displays the result
```

That is the basic RPC idea.

In software-engineering terms:

**Call a function offered by a remote computer.**

For example:

```python
# A fictional function used only to illustrate the concept
result = remote_printer.get_job_count()
```

It resembles an ordinary function call, but the remote server executes the function.

The RPC system handles communication, parameter conversion, and returning results.

Microsoft's documentation describes this client-to-remote-procedure architecture. [Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/rpc/how-rpc-works)

### 1.4 How does RPC differ from remote desktop?

These technologies are easy to confuse.

| Technology | Main purpose | Plain-language meaning |
|---|---|---|
| RPC | Call remote functions | Ask another program to perform a specified task |
| RDP | Remote desktop | Operate another computer's desktop over a network |
| SSH | Secure remote connections and command execution | Log in to a remote system and operate within authorization |
| SMB | Network file sharing | Access shared files offered by another computer |

RPC is not remote desktop access and does not necessarily provide a command shell.

What RPC can do depends on the functions the target service offers and the caller's authorization.

**Chapter 1 takeaway:**

NetBIOS provides names and related service clues; SMB accesses shared resources; RPC calls functions offered remotely.

They do not form a mandatory sequence.

---

## Chapter 2 | NetBIOS enumeration: finding clues in computer names

### 2.1 What is enumeration?

Connect this with the preceding CEH material.

M03 focuses on Network Scanning.

A scan might show:

```text
192.168.1.10
    TCP 445 OPEN
```

What does that mean?

From the current test location, TCP 445 was observed as an entry point accepting a connection.

Because TCP 445 commonly carries SMB, it is a service clue.

We still do not know:

What is the computer called? Which resources does it share? Which operations are allowed?

That brings us to M04.

**Enumeration queries services for more specific information, turning broad clues into concrete records.**

Whether a result supports a conclusion depends on the information actually obtained.

### 2.2 What are the <00> and <20> suffixes?

Suppose a query returns:

```text
LAB-FS       <00>  UNIQUE
LAB-FS       <20>  UNIQUE
LABGROUP     <00>  GROUP
```

A beginner might ask:

Why does LAB-FS appear twice?

Is <20> port 20?

Does UNIQUE mean only one person has permission?

Those interpretations are incorrect.

Break down the first record:

```text
LAB-FS       <00>  UNIQUE
  |           |      |
  |           |      +-- Name type
  |           |
  |           +-- NetBIOS name suffix
  |
  +-- Computer name
```

A NetBIOS name typically has 16 bytes.

The first 15 contain the name; the final byte is a suffix identifying its purpose.

The suffix is written in hexadecimal.

Thus:

<20> is hexadecimal 0x20, **not TCP port 20**. [Microsoft Learn](https://learn.microsoft.com/zh-tw/openspecs/windows_protocols/ms-brws/940f299f-669f-4a0b-8411-9ead7e2f31ec)

### 2.3 Three common records

**First: LAB-FS <00> UNIQUE**

Under common Windows NetBIOS conventions, this is a workstation-service name clue.

Read it as:

“This computer registered the relevant service using the name LAB-FS.”

**Second: LAB-FS <20> UNIQUE**

<20> is commonly the Windows Server Service name suffix.

It tells us:

The computer registered a name associated with file-sharing services.

It does not establish:

```text
Every shared file on LAB-FS can be read
```

Whether shares exist, which users can read them, and whether authentication is required all need separate checks.

**Third: LABGROUP <00> GROUP**

GROUP is the NetBIOS name type here.

It may reflect workgroup- or domain-related naming information.

It is not the same as a Windows user group used for access control.

UNIQUE/GROUP describe name registration types, not file permissions. [Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-nbte/6dbf0972-bb15-4f29-afeb-baaae98416ed)

### 2.4 Why remember 137, 138, 139, and 445?

These four ports have distinct roles.

| Port | Protocol | Function | Plain-language meaning |
|---|---|---|---|
| 137 | UDP/TCP | NetBIOS Name Service | Query names |
| 138 | UDP | NetBIOS Datagram Service | Send datagrams |
| 139 | TCP | NetBIOS Session Service | Establish sessions |
| 445 | TCP | Direct-hosted SMB | Carry SMB directly |

There is a useful historical distinction.

SMB could be carried over the NetBIOS Session Service.

SMB can also communicate directly over TCP 445 without NetBIOS.

For example:

```text
UDP 137: no response
TCP 445: connection succeeds
```

Both observations can be true at the same time.

An unanswered NetBIOS name query does not establish that SMB is absent.

Microsoft distinguishes NetBIOS transport from direct SMB over TCP 445. [Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/direct-hosting-of-smb-over-tcpip)

### 2.5 What is nbtstat?

nbtstat is a Windows diagnostic tool for NetBIOS over TCP/IP.

It can display name tables and cached name information.

On a Windows computer:

**Display your local NetBIOS name table:**

```powershell
nbtstat /n
```

This displays local information.

**Display locally cached names:**

```powershell
nbtstat /c
```

This displays previously obtained names still held in the local cache.

Remember:

Cached information may not reflect the target's latest state.

**Query a remote name table by computer name:**

```powershell
nbtstat /a LAB-FS
```

**Query a remote name table by IP address:**

```powershell
nbtstat /A 192.0.2.10
```

192.0.2.10 is a documentation address, not an actual test target.

Note:

/a and /A differ in case and function.

/R and /RR affect cached names or name registration; they are not purely informational alternatives.

Before querying remotely in a real environment, confirm authorization for the device and network scope. [Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/nbtstat)

**Chapter 2 takeaway:**

NetBIOS enumeration provides clues about computer names, service names, and groups.

A name table is neither a file-permission table nor a complete account list.

---

## Chapter 3 | RPC enumeration: locating the remote service

This chapter develops the main RPC concepts.

### 3.1 What is an RPC endpoint?

Suppose you want to contact a company's IT department.

You know it exists but do not know its extension.

You call the switchboard.

```text
You: “What is the IT department's extension?”

Switchboard: “IT is on 50020.”

You: “Thank you. I will call 50020.”
```

RPC has a similar mechanism.

The terms are:

- Interface: an agreed set of functions.
- Operation: a particular function in that set.
- Endpoint: a specific communication location.

For example, an RPC service might support:

```text
Interface: PrinterManagement

    Operation 1: Query print jobs
    Operation 2: Cancel print jobs
    Operation 3: Modify printer settings
```

This is a fictional teaching interface, not the real name of a built-in Windows interface.

Operations can require different permissions.

An employee might query print status while only an administrator may change printer settings.

### 3.2 What is the Endpoint Mapper?

The Endpoint Mapper maps RPC interfaces to endpoints.

In a common Microsoft RPC over TCP scenario, it uses TCP 135.

Think of it as:

**Directory assistance for RPC services.**

For example:

```text
Your computer
    |
    | TCP 135
    | Where is this RPC interface?
    v
Endpoint Mapper
    |
    | Reply:
    | The interface is registered at TCP 50020
    v
Your computer
    |
    | TCP 50020
    v
RPC service
```

There is an important distinction:

**TCP 135 is not the port where every RPC function runs.**

It may only help discover the service location.

The service performing the work may listen on another port.

Microsoft RPC endpoints can also be named pipes rather than TCP port numbers. [Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/rpc/finding-endpoints)

### 3.3 Why does RPC use a port such as 50020?

Some Microsoft RPC services use dynamic ports.

That means:

A service does not necessarily always use the same port number.

A common modern Windows default dynamic TCP range is:

```text
49152–65535
```

A service might start using:

```text
TCP 50020
```

Another start could use a different port.

The actual behavior depends on operating-system version, application, and administrator configuration.

This range does not mean every port is listening, or that all of them should be exposed externally. [Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/service-overview-and-network-port-requirements)

### 3.4 What is an RPC UUID?

An RPC service may offer multiple interfaces.

The system needs to identify:

“Which set of functions is being requested?”

Microsoft RPC can use a UUID (Universally Unique Identifier) to identify an interface.

For example:

```text
Interface UUID:
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

Interface Version:
1.0
```

This UUID is a format placeholder.

Read it as:

```text
UUID: identifies the functional interface
Version: identifies the interface version
```

A common interpretation error is:

> Seeing RPC Interface Version 1.0 and concluding that the host runs Windows 1.0 or has a particular old vulnerability.

That conclusion is unsupported.

An RPC interface version and an operating-system version are different things.

Determining CVE applicability still requires the product, component, and actual version. [Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/api/rpcdce/ns-rpcdce-rpc_if_id)

### 3.5 What does RPC Bind mean?

Suppose you located the endpoint:

```text
TCP 50020
```

The TCP connection succeeds.

The next question is:

Can both parties communicate using a compatible RPC interface and data format?

RPC Bind is involved in that negotiation.

Imagine calling a government office and asking:

> I want to use this application service. Do you support this procedure?

The office might answer:

“Yes, we support it.”

Or:

“No, this interface is not provided here.”

That is separate from logging in as an administrator.

**Successful RPC Bind does not establish administrative permission.**

Authentication and authorization for the specified operation still need to be evaluated.

---

## Chapter 4 | Why do we sometimes see 111 and sometimes 135?

These are easy to confuse in CEH study and practical analysis.

[[figure:families]]

### 4.1 Two RPC technology families

RPC is a concept with multiple protocol implementations.

Different systems and network protocols can implement remote procedure calls.

This lesson compares two families.

| Item | Microsoft RPC | ONC RPC |
|---|---|---|
| Common environment | Windows | Unix/Linux |
| Lookup mechanism | Endpoint Mapper | rpcbind/portmapper |
| Common lookup port | TCP 135 | TCP/UDP 111 |
| Interface identification | Interface UUID and version | Program number and version |
| Specific function | RPC Operation | Procedure number |
| Common applications | Windows system and service communication | NFS-related services and others |

Both support remote calls, but use different lookup formats. [RFC Editor](https://www.rfc-editor.org/info/rfc5531/)

### 4.2 What does port 111 do on Linux?

Suppose a Linux server offers several ONC RPC services.

Each service might have a different communication location.

A client can ask rpcbind:

“Where is this service currently registered?”

rpcbind commonly uses TCP/UDP 111.

Linux and Unix systems can use rpcinfo to query these registrations.

For example, in an authorized test environment:

```bash
rpcinfo -p 192.0.2.10
```

This illustrates querying ONC RPC service registrations.

It is not a universal replacement for Microsoft RPC Endpoint Mapper tools.

### 4.3 Must all NFS traffic go through 111?

No.

This exception matters.

NFS stands for Network File System.

Older NFS-related workflows often involve rpcbind.

NFSv4.1 normally uses TCP 2049 directly, without first querying rpcbind for every connection.

That does not mean NFSv4.1 has stopped using RPC.

Instead:

**RPC implementations can locate services in different ways.** [RFC Editor](https://www.rfc-editor.org/rfc/rfc8881.html)

Chapter 4 takeaway:

**135 and 111 both help locate services, but belong to different RPC families.**

---

## Chapter 5 | Security analysis: at which stage did the failure occur?

This chapter applies the mechanisms to interpreting security evidence.

[[figure:evidence]]

### 5.1 Five stages that may be involved in an RPC operation

Imagine calling a remote computer's RPC function.

Conceptually, distinguish five stages:

| Stage | Question | Possible result |
|---|---|---|
| ① Endpoint information | Do we know the service location? | TCP 50020 returned |
| ② Network connection | Can it be reached from this location? | Success, refusal, or timeout |
| ③ Interface negotiation | Do both parties support compatible RPC interfaces? | Bind success or failure |
| ④ Authentication | Can the caller's identity be established? | Authentication success or failure |
| ⑤ Operation authorization | May this caller perform the specified function? | Allowed or denied |

This is a diagnostic concept model, not a mandatory ordering for every RPC transport.

Authentication can occur at different stages of establishing a connection or RPC communication.

### 5.2 Case one: a service is discoverable but cannot be reached

Suppose:

```text
Endpoint Mapper:

RPC Interface → TCP 50020
```

You attempt a connection:

```text
TCP 50020: TIMEOUT
```

Can you conclude:

“The service does not exist”?

No.

Possible explanations include:

A network-path fault, firewall packet drops, a stopped service, an endpoint change, or an unresponsive host.

Different evidence is needed to distinguish these explanations.

A supported description is:

> Under this test's conditions, a connection to TCP 50020 was not established successfully.

That is the observed fact.

The cause still needs investigation.

### 5.3 Case two: TCP connects but RPC Bind fails

Suppose:

```text
TCP 50020: CONNECTED

RPC Bind: INTERFACE NOT SUPPORTED
```

What does this show?

The network connection succeeded.

Negotiation for the requested RPC interface did not complete successfully.

Possible reasons include an unavailable interface, incompatible version, or another unmet RPC negotiation condition.

Do not jump to:

“The firewall must be blocking it.”

TCP connectivity has already been observed.

Investigate the RPC-layer error and settings.

### 5.4 Case three: an RPC query succeeds but another operation is denied

Suppose an RPC query works normally.

A subsequent request to modify settings returns:

```text
ACCESS DENIED
```

This could mean:

The current identity lacks permission for that operation.

Separate these two concepts.

**Authentication**

Answers:

“Who are you?”

For example, a company entrance checks that your employee badge is valid.

**Authorization**

Answers:

“What may you do?”

A valid badge does not necessarily permit entry to the chairperson's office.

These are different questions.

One successful RPC query does not establish permission for every administrative operation. [Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/rpc/rpc-security-essentials)

### 5.5 How does this connect to the preceding CEH lessons?

This logic applies throughout M04.

| Earlier lesson | Information obtained | Unsupported conclusion |
|---|---|---|
| DNS enumeration | Subdomains and DNS records | Login must be possible |
| FTP enumeration | FTP service or directory names | Files can definitely be downloaded or modified |
| SMTP enumeration | Particular mail-server responses | Sending as another identity must be possible |
| SMB enumeration | Shared folders | Files must be readable |
| NetBIOS enumeration | Names and service clues | File-sharing permission must exist |
| RPC enumeration | Endpoints and interfaces | Administrative functions must be allowed |

These are not six unrelated reasoning methods.

They apply the same evidence discipline to different protocols.

The principle is:

> Each observation supports a limited set of conclusions. Untested assumptions must not become established facts.

### 5.6 What should defenders do?

Consider the administrator's perspective.

A Windows server uses TCP 135.

Should you immediately shut it down?

Not necessarily.

Microsoft RPC underpins many Windows system services.

Disabling core services indiscriminately can disrupt administration, domain services, or application communication.

Use these layers of control:

**Layer one: reduce unnecessary exposure.**

Sources that do not need RPC, SMB, or NetBIOS should not have unrestricted access to those services.

**Layer two: control actual service endpoints.**

Restricting TCP 135 does not establish that all RPC traffic is blocked.

Fixed endpoints, dynamic ports, or other transports may exist.

**Layer three: restrict operation permissions.**

Alongside network controls, check who may call which functions.

**Layer four: retain logs and verification results.**

When an operation fails, distinguish connectivity, interface negotiation, authentication, and authorization failures.

This supports concrete remediation more effectively than treating any open port as sufficient proof of danger.

---

## Chapter 6 | Worked case: interpreting NetBIOS and RPC records

Combine the preceding concepts.

### 6.1 Case background

Suppose you are conducting an approved internal security test.

The target is a Windows server:

```text
Target: Lab-A
```

Four records are available.

**Record one: NetBIOS name**

```text
LAB-FS <20> UNIQUE
```

**Record two: RPC Endpoint Mapper**

```text
RPC Interface Version 1.0

Endpoint: TCP 50020
```

**Record three: connecting to TCP 50020**

```text
Connection Timeout
```

**Record four: SMB**

```text
NOT TESTED
```

### 6.2 What do we actually know?

First:

```text
LAB-FS <20> UNIQUE
```

We know:

A NetBIOS name associated with the server service was obtained.

We do not yet know share names or the current test identity's read permission.

Next:

```text
RPC Interface Version 1.0
Endpoint: TCP 50020
```

We know:

The Endpoint Mapper returned an interface-to-endpoint mapping.

We do not know whether the endpoint still listens, whether the current network path reaches it, or whether interface calls succeed.

Third:

```text
Connection Timeout
```

We know:

A connection attempt from this test source to TCP 50020 did not succeed within the waiting period.

The precise cause of the timeout is unknown.

Finally:

```text
SMB: NOT TESTED
```

SMB shares and file access were not verified in this test.

### 6.3 How should a security record be written?

For example:

> This test obtained a NetBIOS server-service name clue for Lab-A and a registration mapping an RPC interface to TCP 50020.
>
> Connecting to TCP 50020 from the specified test source timed out. RPC interface negotiation, authentication, and authorization for specified operations at that endpoint therefore remain unverified.
>
> SMB shared resources and file access were not tested. Within approved scope, next check current endpoint registration, server listeners, network path, firewall rules, and relevant logs.

How does this differ from a subjective judgment?

It separates three categories:

| Evidence category | Meaning | This case |
|---|---|---|
| Observed fact | Result actually obtained | NetBIOS name, RPC registration, TCP timeout |
| Plausible explanation | Possible explanation for the observation | Firewall, stopped service, changed endpoint, etc. |
| Still unverified | Insufficient evidence | RPC operation permissions and SMB read/write permissions |

This format works for penetration testing, vulnerability verification, incident investigation, and internal security audits.

It helps the next technical owner understand:

**The current stage, the tests performed, and the questions still unanswered.**

---

## Part 7 | Connect this lesson to the broader security-testing process

The original lesson has six chapters; this additional part connects them to a broader model.

### 7.1 From reconnaissance to authorization

Place the preceding techniques in a conceptual security-assessment workflow:

```text
① Reconnaissance
   Identify potential targets
        |
        v
② Scanning
   Identify responsive network entry points
        |
        v
③ Enumeration
   Obtain specific information declared by services
        |
        v
④ Connectivity Verification
   Verify actual service reachability
        |
        v
⑤ Authentication
   Establish the caller's identity
        |
        v
⑥ Authorization
   Verify permission for a specified operation
        |
        v
⑦ Security Assessment
   Assess controls and their risks
```

This is a teaching model.

An actual assessment need not follow this exact order, and the model does not authorize arbitrary operations.

Every test must remain within the authorization already obtained.

### 7.2 Why does this distinction matter?

Overinterpretation is common in security work.

For example:

“A scan found TCP 445, so files can be downloaded from this computer.”

That conclusion lacks evidence of file-access permission.

Or:

“A scan found TCP 135, so an attacker can remotely control this Windows server.”

That conclusion lacks evidence of an exploitable vulnerability, actual functionality, and operation authorization.

The reverse is also possible:

“An RPC operation was denied, so the whole server has no security problems.”

That conclusion is also unsupported.

**Security skill includes knowing what a tool's result actually establishes.**

---

## Lesson summary | Eight concepts to retain

| Concept | What to understand |
|---|---|
| NetBIOS | Names and related communication mechanisms |
| <00>, <20> | Name-purpose suffixes, not TCP ports |
| UNIQUE/GROUP | Name types, not file permissions |
| SMB | Access to shared network resources, commonly TCP 445 |
| RPC | Calls to remote functions, not remote desktop access |
| Endpoint Mapper | Locates RPC endpoints; Microsoft RPC commonly uses TCP 135 |
| rpcbind | Service location for ONC RPC, commonly TCP/UDP 111 |
| Authentication/Authorization | Identity establishment and operation permission are separate |

The central distinction is:

**Name exists ≠ service reachable ≠ interface usable ≠ authentication successful ≠ operation authorized.**

Apply this distinction to SMB, FTP, SMTP, and other network-service security analysis.

---

## Understanding check | Interpret one scenario

Suppose a Windows computer produces these test records:

```text
Host: 192.0.2.10

NetBIOS:
LAB-SERVER <20> UNIQUE

TCP 135:
OPEN

RPC Endpoint Mapper:
Interface UUID: obtained
Interface Version: 1.0
Endpoint: TCP 50123

TCP 50123:
CONNECTED

RPC Bind:
SUCCESS

RPC QueryStatus:
SUCCESS

RPC ModifySettings:
ACCESS DENIED

SMB:
NOT TESTED
```

Answer three questions.

**Question one:** TCP 135 is open and the Endpoint Mapper returned TCP 50123. What does each record establish? Do they establish administrative permission?

**Question two:** RPC QueryStatus succeeded, but RPC ModifySettings returned ACCESS DENIED. Are these results contradictory? How would you explain them?

**Question three:** Can these records establish whether LAB-SERVER's shared folders are readable? Why?

Answer using “confirmed facts, reasonable inferences, and missing evidence,” then expand the reference answer to compare.
