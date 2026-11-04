# CEH M04-01 | Scanning finds an entry point; enumeration asks for information

Enumeration vs. Scanning · First lesson of the new route

M03 asks which hosts respond, which service entry points are open, and what services might be running. From this lesson onward, we take the question one step further: **What specific information will the service disclose, and what can that information actually prove?**

First, we will understand the principles shared by enumeration tasks. SMB is only our example; you do not need to memorize the tools and ports for DNS, LDAP and SNMP at the same time.

## 1. Imagine a filing cabinet: seeing it does not mean you can open its drawers

Suppose a company commissions you to assess a server used to share documents.

You might obtain several different results in sequence:

1. Find the device's network address.
2. Discover that one of its service entry points accepts connections.
3. Confirm that this entry point provides a file-sharing service.
4. Obtain shared-folder names, such as Public and Finance.
5. Actually read a test file agreed upon in advance.

These five observations are different things. Knowing about a filing cabinet named Finance does not mean you have seen its documents, and certainly does not mean you can modify them.

**The central idea of this lesson: information about a resource, permission to read it, and permission to modify it require separate verification.**

The building and filing cabinet are only explanatory analogies. In real networks, identity checks, queries and permission decisions may be interleaved; they do not always follow the sequence above.

## 2. Scanning and enumeration ask different questions

Start with three basic terms:

- IP address: an address used to locate a device on a network.
- Port: a number that lets one device distinguish different network services. Include the transport protocol when describing it, such as TCP 445 rather than just 445.
- Protocol: the rules used by both parties to communicate, including how to make a request and indicate success or failure.

**Scanning is like checking an entry point.**

It asks, “Does this device respond? Is TCP 445 open, closed, or currently indeterminate?” These results describe the network state observed in this particular test. Testing from inside the company network and from outside may produce different results. [Nmap: port states](https://nmap.org/book/man-port-scanning-basics.html)

**Enumeration queries a service to obtain specific items or attributes.**

For example: “What share names are available? What accounts or groups exist? What attributes do directory objects have?” In this lesson's file-server example, obtaining the names Public and Finance is an enumeration result.

Two other related activities are:

- Reconnaissance: collecting background information and target clues, such as domains, hostnames and system purposes. It can be active or passive.
- Vulnerability analysis: using evidence to assess configuration, version or permission problems and their potential impact. We will study this more deeply in M05.

Using a scanning tool does not mean every action is only scanning. A tool may also identify a service, obtain a version, or query a resource list. **Classify the activity by the question you ask and the evidence you obtain, rather than by the tool's name alone.**

## 3. The first common mistake: what does 445 open actually prove?

Everything below is a synthetic teaching scenario. No tests were performed against real devices. The IP represents a hypothetical isolated practice environment; a private IP address does not mean you have permission to test it.

Suppose the practice host is 192.168.56.10 and you run the following within the approved test scope:

```text
nmap -p 445 192.168.56.10
```

The synthetic output is:

```text
PORT      STATE   SERVICE
445/tcp   open    microsoft-ds
```

Read each part:

- 445/tcp: this test concerns TCP 445.
- open: Nmap determines that a program accepts TCP connections at this entry point.
- microsoft-ds: in a basic scan without service/version detection, this is usually a service name looked up by port number. This label alone does not establish that the SMB protocol has been verified.

SMB (Server Message Block) is a network resource-sharing protocol, commonly used to let clients access files on a server. Modern SMB carried directly over conventional TCP commonly uses 445; this does not mean SMB can only use 445 in every environment. This lesson uses that common scenario only. [Microsoft: SMB overview](https://learn.microsoft.com/en-us/windows-server/storage/file-server/file-server-smb-overview)

The reasonable next step is therefore to identify actual service responses within the approved scope, rather than announce that you have obtained files. Nmap service/version detection sends probes to services and analyzes their responses. Even identifying a service, however, does not establish that a particular file can be read. [Nmap: service and version detection](https://nmap.org/book/man-version-detection.html)

## 4. Starting enumeration: ask the service what shares it provides

Suppose protocol responses have now confirmed that the host provides SMB. The company has also supplied a test account, labuser, and authorized queries for share names.

Our question is: “Which shared resources can this identity discover?”

A commonly used SMB client on Linux is smbclient. For now, understand what each part of the command does; you do not need to install or run it:

```text
smbclient -L 192.168.56.10 -p 445 -U labuser
```

- smbclient: a client program that communicates with an SMB server.
- -L: query the list of resources provided by the server.
- -p 445: specify the TCP port used in this practice scenario.
- -U labuser: specify the test account to use.

If the tool needs a password, let it request one at the prompt. Do not put the password directly in the command, notes or screenshots. Success still depends on the account, domain, login method and service configuration; this example is not a login method guaranteed to work unchanged in every environment. [Samba: official smbclient manual](https://www.samba.org/samba/docs/current/man-html/smbclient.1.html)

Suppose this simplified synthetic output is returned:

```text
Sharename    Type
---------    ----
Public       Disk
Finance      Disk
Archive      Disk
```

Sharename is the share name; Disk indicates a file-storage share. **This list contains share names, rather than all the files inside them or a list of permissions.**

Windows NetShareEnum is an official interface for retrieving information about SMB shares. Its information levels differ: some return only names, while others include types and descriptions. More detailed queries may require additional privileges. This also shows that access to information is not simply an all-or-nothing choice. [Microsoft: NetShareEnum](https://learn.microsoft.com/en-us/windows/win32/api/lmshare/nf-lmshare-netshareenum)

Remember that the returned list may be limited by identity, query method and configuration. **A resource missing from this particular list does not necessarily mean the resource does not exist.**

## 5. Separate authentication, access authorization and permission to test

**Authentication answers “Who are you?”**

For example, the server accepts the test account's login information and establishes a corresponding session.

**Access authorization answers “What can this identity do?”**

For example, it may list resource names but read only some of the files, without modifying them. [Microsoft: authentication and authorization](https://learn.microsoft.com/en-us/entra/identity-platform/authentication-vs-authorization)

Some information can be queried without logging in; other information requires authentication first. Do not memorize “enumerate first, log in later” as a fixed sequence, or equate “no login required” directly with a vulnerability.

The company's **permission to test** is separate. It determines which hosts you may test, which accounts you may use, and which actions you may perform.

A system permitting an operation does not mean the assessment scope authorizes you to perform it. Conversely, even with legitimate permission to test, the system may reject an operation based on account permissions.

This lesson assumes that only list queries and reading specified test files are approved. We do not guess passwords, switch to unapproved accounts, or create, modify or delete files merely to prove that writing is possible.

## 6. Record four outcomes separately in the same example

Suppose the same labuser, from the same practice network, obtains these results:

- Public: its name was listed, and reading the agreed demo.txt succeeded.
- Finance: its name was listed, but a read request for the agreed path was denied.
- Archive: its name was listed, but reading was not tested.
- All resources: writing, modification and deletion were not tested.

These are four separate pieces of evidence, rather than a progress bar where one successful step unlocks everything.

**A successful Public read** supports only that this identity read the specified file under these test conditions. It cannot establish that everyone can read it, that all of Public is readable, or that modification is possible.

**A denied Finance read** supports that this read request for the specified path was rejected. It cannot establish that Finance contains no data or that all accounts would be denied. The error text alone also cannot establish the reason for denial. If rejection occurred before entering the folder, this failed attempt alone cannot even prove that the file inside exists.

**Archive was not tested**, so the result is unknown. “It should be the same” cannot substitute for success or failure.

**Writing was not tested**, so that result is unknown too. Successful reading is not evidence of successful writing.

On a Windows file server, both share permissions and file-system permissions can affect SMB access to NTFS files. When you see Access Denied, preserve the original error, confirm the actual identity, and use approved administration or auditing methods to establish the cause. Do not simply disable security settings. Microsoft's troubleshooting guidance also calls for identifying the cause and checking share and NTFS permissions. [Microsoft: interpreting denied SMB access](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/access-denied-access-smb-file-share)

## 7. Does obtaining information mean you found a vulnerability?

Not necessarily. Providing a resource list may be normal functionality.

For example, a company may want employees to know which departmental shares exist while restricting access to their files. Visible names do not automatically establish a financial-data leak.

To assess risk, consider three things together:

1. What was disclosed: only ordinary names, or sensitive projects, accounts or internal structure?
2. To whom: expected employees, guests, or an identity that should not receive the information?
3. Whether it fits the requirements: does the business need this visibility, and does organizational policy permit it?

An ordinary account reading test data it should not access provides more specific evidence of a permission problem. You must still identify the account, data and operation, rather than exaggerate a limited result into control of the entire server.

**An open service, visible information, a configuration problem, an exploitable vulnerability, and obtained data are different conclusions. Each further conclusion needs corresponding evidence.**

## 8. Protect information and operations, rather than only hiding names

Consider three levels:

- **Network scope:** allow only the devices and networks that need to connect to the service. In ordinary enterprise SMB scenarios, TCP 445 should not be exposed arbitrarily to the Internet. Confirm legitimate business needs and test the impact before changing network rules. [Microsoft: securing SMB traffic](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-secure-traffic)
- **Information and access permissions:** decide which identities may obtain information, read files or modify files according to their work needs. Hiding names can reduce exposure; actual data protection still requires correct access control. [Microsoft: access control](https://learn.microsoft.com/en-us/windows/security/identity-protection/access-control/access-control)
- **Logging and verification:** configure appropriate auditing, then use approved identities to verify that required actions still work and prohibited actions are restricted. Missing log entries do not necessarily mean no query occurred; auditing may not be enabled or may cover the wrong scope.

For example, if the goal is that ordinary accounts must not read financial files, verify their read results alongside normal use by authorized finance accounts. Checking only that a name disappeared has not verified protection of the actual data.

## 9. Write a result that others can understand and verify

A poor statement is: “We found Finance and have compromised the financial share.”

A more precise statement is:

“In this approved practice scenario, labuser queried 192.168.56.10 from the specified test network and obtained the share names Public, Finance and Archive. Reading the specified Public test file succeeded, reading the specified Finance path was denied, and Archive and all write operations were not tested.”

In an actual record, also include the time, tool and version, complete command, original output and test limitations. Keep passwords and unrelated sensitive data out of the report.

The key is: **which identity, under which conditions, performed which action against which target, what happened, and what remains unknown.**

When we later study DNS, LDAP or SNMP, we will reuse the same reasoning. The objects queried will change to name records, directory objects or device-management information.

## 10. One small check for today

In another authorized practice scenario, you use labreader to discover the Projects share name and successfully read the specified readme.txt inside Projects. You have not tested other files or modification.

A colleague concludes: “So we now have read and write permission for every file in Projects.”

**How would you correct this statement in your own words, explaining what is confirmed and what remains unknown?**

Keep the explanation simple. This question checks today's central idea; it does not establish mastery of the entire module, and you do not need to operate any host now.
