# M04-08 | LDAP / Active Directory enumeration: do the accounts you found make a complete inventory?

This lesson asks a central question:

If a tool querying a company's accounts returns 2 people, can you conclude that the company has only 2 accounts?

No.

What you see depends on where you search, which identity you use, the conditions you specify, and whether the search actually finishes.

This is a core idea in CEH (Certified Ethical Hacker) M04 Enumeration and a foundation for Windows Server, enterprise network administration, Active Directory (AD), and security audits.

The lesson uses synthetic enterprise scenarios to explain protocol mechanisms and CEH interpretation, with technical boundaries checked against the primary references at the end.

## 1. Think of a directory as a company's employee register

Imagine a company with 500 employees across Engineering, Human Resources, Finance, and other departments.

HR maintains a register of names, accounts, email addresses, departments, and group memberships.

{{figure:directory}}

You walk up to the HR desk and ask:

“Who works in Engineering?”

The desk replies: “Lin and Chen.”

You might infer that Engineering has only two people. Several other explanations are possible:

- The desk checked only direct members, leaving out people in subdepartments.
- Your identity can view only some employee records.
- The system displays at most two records at a time, with more still to retrieve.
- Your conditions select only a particular type of employee.

Finding two records therefore does not establish that the entire directory contains only two.

That distinction guides the rest of the lesson.

## 2. What are LDAP and Active Directory?

These terms often appear together, but name different things.

| Term | Plain meaning | Main purpose |
| --- | --- | --- |
| LDAP | A language for querying the employee register | Tell a directory what information to retrieve |
| Active Directory Domain Services (AD DS) | A centralized enterprise account and directory system | Manage users, groups, computers, and related directory information |
| Domain Controller (DC) | A server providing domain authentication and directory services | Handle authentication and directory requests |
| Enumeration | Collecting and organizing information under stated conditions | Inventory visible accounts, groups, and other information within a defined scope |

For example, when an employee signs in to a company Windows computer, it may authenticate through a domain controller. An administrator may also use LDAP to query the employee's group memberships.

AD uses more than LDAP. Kerberos and DNS also play important roles in Windows domains.

A concise distinction is:

AD manages directory data and identities; LDAP is a protocol for accessing directory data.

## 3. Read the directory structure: DN, OU, CN, and DC

Directory data has a hierarchy, rather than simply putting every employee into one spreadsheet table.

Suppose you see:

```
CN=Lin,OU=People,DC=example,DC=test
```

This is a Distinguished Name (DN). Think of it as the complete address of an employee record in the directory.

| Abbreviation | Meaning | Plain explanation |
| --- | --- | --- |
| CN | Common Name | The entry's name, such as Lin |
| OU | Organizational Unit | An organizational container, such as People |
| DC | Domain Component | A component of a domain name |
| DN | Distinguished Name | The identifying path of the complete entry |

Read the DN as:

“In the example.test directory, open the People organizational unit and find the Lin entry.”

The DC in `DC=example` means Domain Component. It does not mean Domain Controller; the abbreviations happen to coincide.

## 4. Base, Scope, Filter, and Attributes: four search settings

These settings are central to interpreting a search.

To inventory company accounts, specify where to start, how deeply to search, which entries to match, and which fields to return.

{{figure:parameters}}

Scope has three basic values.

| Scope | Plain explanation | Search depth |
| --- | --- | --- |
| `base` | Examine only the specified entry | The starting entry itself |
| `one-level` | Examine immediate children | Excludes the starting entry and deeper descendants |
| `subtree` | Search from the start through its descendants | Includes the starting entry and all descendants |

This is the standard LDAP search model, also reflected in Microsoft AD query APIs.

### Compare three scopes on the same directory tree

{{figure:scope}}

This reveals a common inventory error:

If a company has 500 users and a `one-level` search returns 20, you cannot conclude that the company has only 20. Other people may belong to deeper subdepartments.

Even `subtree` does not necessarily cover every domain in the company. It searches downward from the specified Base; it does not automatically cover the entire AD forest.

## 5. RootDSE and Global Catalog: why do query entry points differ?

Imagine a multinational company with employee systems in Taiwan, the United States, and Japan.

Asking the Taiwan administrator may not return every employee in the other two countries.

AD has a similar scope issue.

### RootDSE: the server's service information sign

RootDSE is a special entry through which an LDAP server provides information about itself.

It can describe supported capabilities and directory entry points.

For example, `defaultNamingContext` helps identify the default domain's search base.

Reading RootDSE does not grant permission to read every employee account or provide a complete map of AD.

### Global Catalog (GC): an index across domains

Think of GC as an index across domains, useful when you do not already know which domain holds a record.

Its limitation matters: for other domains, GC generally holds a subset of each object's attributes, rather than a full copy of every field.

A missing field in a GC response therefore need not mean that the original directory lacks that information.

## 6. LDAP Bind, permissions, and TLS: signing in does not grant universal visibility

Imagine entering an office building with an employee badge.

Passing the entrance check does not authorize entry to the executive office, server room, or finance office.

Separate three questions in LDAP as well.

| Security concept | Plain question | What it establishes |
| --- | --- | --- |
| Authentication | Who are you? | The authentication identity currently in use |
| Authorization | What may you see? | Which objects or fields that identity can access |
| Transport Security | Is communication protected in transit? | Whether protections such as encryption, integrity, and server authentication are established |

LDAP Bind concerns the connection's authentication state. Even a successful Bind does not establish permission to read all data.

Common LDAP transport arrangements include the following.

| Technology | Common port | Main point |
| --- | --- | --- |
| LDAP | TCP 389 | The protocol name alone does not establish encryption |
| LDAP + StartTLS | TCP 389 | Negotiate TLS on an existing LDAP connection |
| LDAPS | TCP 636 | Use TLS from the beginning of the connection |
| LDAP Signing | Depends on authentication and transport | Message integrity and authenticity for applicable non-TLS SASL sessions |

LDAP Signing is not encryption.

Signing resembles protection against unnoticed document changes; encryption prevents outsiders from readily reading its contents. TLS can provide confidentiality, integrity, and server authentication, provided it is correctly established and the certificate is validated.

In Microsoft AD, LDAP Signing primarily applies to non-TLS SASL sessions. Do not treat it as an independent extra layer applied to every LDAP connection.

## 7. The central case: what does `sizeLimitExceeded` mean?

Return to the lesson's scenario.

You are authorized to query accounts in the company's People unit. The tool displays:

{{figure:result}}

`sizeLimitExceeded` means the search hit a record limit and did not retrieve a normally completed result set.

RFC 4511 defines result codes including `success = 0`, `timeLimitExceeded = 3`, and `sizeLimitExceeded = 4`.

You can confirm that this query retrieved two records. The complete count remains unknown.

Because you requested only `cn`, the absence of an email field cannot establish that those employees have no email address.

### How can you retrieve subsequent results?

Paging can help when supported by the server and permitted by the search conditions. Page size and the whole search's sizeLimit are different settings: retaining the same total limit does not make paging automatically bypass it.

Imagine a 500-page register that can be printed only 100 pages at a time. You need five batches and must verify receipt of all of them.

LDAP paging can use continuation information, called a cookie, returned by the server. Check each result status and confirm a final empty cookie before declaring the paging sequence finished. Record interruptions, errors, or lost continuation information.

{{figure:paging}}

Paging retrieves data in batches. It does not increase your permissions or expand the search scope automatically.

Also remember:

`success` means that this LDAP operation completed successfully. It does not establish that the company's entire account inventory is complete.

## 8. Why does this matter for CEH?

CEH M04 Enumeration teaches you to interpret information exposure and visibility from service responses.

Suppose an authorized enterprise assessment finds that a low-privilege account can query employee names, groups, and organizational structure.

Go beyond simply counting the returned accounts:

Was this identity intended to read that information? Does visibility exceed business needs? Are the results complete? Which data was never requested?

Defenders should record identity, server, time, Base, Scope, Filter, Attributes, result code, and paging completion, while applying least privilege to directory visibility.

Large volumes of LDAP queries alone do not establish an attack. Legitimate asset inventories and directory synchronization services can also generate many queries.

### A six-question framework for judging completeness

| Question to verify | Possible error if omitted |
| --- | --- |
| 1. Which identity made the query? | Treating a low-privilege view as the whole directory |
| 2. Where is the Base? | Treating one organizational unit as an entire domain |
| 3. How deep is the Scope? | Missing subdepartments |
| 4. What are the Filter and Attributes? | Missing other matching populations or unrequested fields |
| 5. What are the result code and paging status? | Treating unfinished results as complete |
| 6. Are all required directories and domains covered? | Treating one domain as the entire company |

The same reasoning applies to other service enumeration, paginated APIs, database queries, and asset inventories: define the observation scope, then decide what the evidence supports.

## Comprehension check | CEH M04-08

You are a commissioned security auditor inventorying enterprise AD accounts.

An authenticated low-privilege account performs this LDAP query over a valid TLS connection:

Query record

```text
Base: OU=People,DC=example,DC=test
Scope: one-level
Attributes: cn
Result: 20 entries
Result Code: success (0)
```

A colleague says: “We have confirmed that People and every subdepartment contain only 20 people in total, and none has an email address.”

Answer three questions:

Q1. What is wrong with the colleague's conclusions?

Q2. Which search setting should you adjust first to include all subdepartments beneath People?

Q3. Why does `success (0)` still not prove that these 20 entries are the complete inventory?

{{answer:completeness}}

## Supplement A | What is LDAP? An introduction from first principles

Think of LDAP as a standard way of asking a company's employee directory for information.

Imagine a company with 3,000 employees, each with a computer account, password, email address, department, and permissions for different systems.

Maintaining a separate employee record in every application is difficult. When someone leaves, IT might otherwise have to delete their account from more than a dozen systems.

A centralized Directory Service addresses this management problem; LDAP is a protocol that lets other software communicate with it.

### 1. Start with a company scenario

Imagine a company called Kairos Technology.

{{figure:central}}

An employee named Ming works there.

Ming opens an internal system and enters the account `ming` and a password.

The system may authenticate through the central directory using LDAP instead of storing Ming's password itself.

It can ask:

- Does the account `ming` exist?
- Is the user authenticated successfully?
- Which department does the user belong to?
- Is the user a member of an administrator group?

The directory responds according to the authentication method, permissions, and query conditions. The application then decides whether Ming may enter and which functions are available.

Accounts can thus be managed centrally rather than recreated independently in every application.

### 2. What does LDAP stand for?

LDAP = Lightweight Directory Access Protocol

Break the name into its parts:

| English word | Meaning | Plain interpretation |
| --- | --- | --- |
| Lightweight | Simplified | Simpler than earlier X.500 directory access approaches |
| Directory | Organized information | Like an organized employee phone book |
| Access | Data access | Query, read, or modify data when authorized |
| Protocol | Communication rules | Shared rules followed by both parties |

Keep the classification clear:

LDAP is a communication protocol, rather than a database product or an individual server.

This is its basic role in IETF RFC 4511 and Microsoft's LDAP documentation.

### 3. How do LDAP, Active Directory, and a Domain Controller differ?

These three names are easy to confuse.

Use a company's administrative system as an analogy.

| Term | Role | Analogy |
| --- | --- | --- |
| LDAP | Communication protocol | Standard language for asking HR for information |
| Active Directory (AD) | Directory and identity management system | The company's personnel and account management system |
| Domain Controller (DC) | Server providing AD domain services | The office actually providing the service |

Windows Server can host Active Directory Domain Services (AD DS). Other applications can use LDAP to query its directory information.

AD also uses technologies including Kerberos, DNS, and Group Policy.

LDAP can work with directory services other than Microsoft AD, including OpenLDAP.

### 4. What does LDAP data look like?

Suppose the company stores Ming's record.

{{figure:entry}}

A Distinguished Name (DN) identifies an entry's position in the directory.

For example:

```
cn=Ming,ou=People,dc=example,dc=test
```

Read this as:

- `cn=Ming`: find the Ming entry.
- `ou=People`: it is in the People organizational unit.
- `dc=example,dc=test`: the domain directory is example.test.

Think of the DN as a complete address, rather than just a person's name.

### 5. How does an LDAP search happen?

Suppose an administrator wants to find Engineering employees.

{{figure:search}}

LDAP Search has four basic settings:

| Setting | Question | Example |
| --- | --- | --- |
| Base | Where do we start? | People |
| Scope | How deeply do we search? | Include all subdepartments |
| Filter | Which entries match? | Users only |
| Attributes | Which fields do we want? | Name and email |

For example, the LDAP filter:

```
(cn=Ming)
```

Finds entries whose `cn` equals `Ming`.

Another example:

```
(mail=*)
```

Finds entries with a `mail` attribute.

LDAP also includes operations such as Bind (establish authentication state), Modify, and Add. Whether an operation is permitted depends on server configuration and permissions.

### 6. Is LDAP secure, and why does CEH cover it?

LDAP alone does not establish encryption in transit, so security settings matter.

| Method | Common TCP port | Security point |
| --- | --- | --- |
| LDAP | 389 | Using LDAP does not by itself establish encrypted data |
| LDAP + StartTLS | 389 | Negotiate TLS on the existing connection |
| LDAPS | 636 | Establish TLS from the start |

With TLS, validate the server certificate correctly to avoid trusting an impersonating server. Microsoft also recommends appropriate TLS or SASL protection for LDAP communication.

For CEH, LDAP matters because enterprise directories can hold extensive organizational information. Incorrect permissions may expose accounts and groups to people who should not see them.

Remember:

Finding an account does not reveal its password, and successful LDAP authentication does not establish administrator privileges.

### 7. Review with four questions

1. What is LDAP? A communication protocol for software to access directory services.
2. What is it used for? Query accounts, groups, and organizational information, and support related authentication and authorization management workflows.
3. Is LDAP the same as AD? No. LDAP is a protocol; AD is Microsoft's directory and identity management technology.
4. Is LDAP secure? That depends on authentication, access permissions, and transport protection settings.

### Short quiz: check your understanding

1\. A company uses Active Directory for employee accounts. Which protocol can another internal system typically use to query employee data?

LDAP

HDMI

USB

2\. What does finding Ming's account through LDAP establish?

You have obtained Ming's password

Matching, visible account data exists within the query scope

You have company administrator privileges

3\. Which description of LDAP and Active Directory is correct?

They are identical products

LDAP is a protocol; AD is a directory management system supporting LDAP

LDAP works only on Windows

{{answer:ldap}}

Next, connect LDAP, Kerberos, and DNS to understand enterprise sign-in and permission management in Active Directory. This links CEH enumeration to practical Windows network engineering.

## Supplement B | What is Kerberos? An introduction from first principles

Kerberos is an Authentication Protocol. It uses encrypted tickets so users do not have to enter a password again for every integrated company system they access.

Think of it as the company's central identity check and pass system.

LDAP can query the employee directory; Kerberos helps prove that someone really is the claimed employee.

Keep these roles in mind:

- LDAP: query identity records and department information.
- Kerberos: prove identity using encrypted tickets.

Both often appear in Active Directory (AD), with different responsibilities.

### 1. Why does a company need Kerberos?

Imagine Kairos Technology has 3,000 employees who use many systems each day.

{{figure:sso}}

If every system independently handles accounts and passwords, repeated authentication and password administration become substantial problems.

Kerberos offers another approach: at initial sign-in, prove identity to a trusted central authentication service and obtain a credential for requesting other tickets. Obtain a corresponding service ticket when accessing a particular service.

This supports Single Sign-On (SSO).

### 2. Understand Kerberos through amusement park passes

Imagine visiting a large amusement park.

It has a roller coaster, a pirate ship ride, and an aquarium.

Your visit involves three stages.

Stage 1: establish that you are an authorized visitor

At the entrance, staff verify your identity and issue a pass that lets you request tickets for individual attractions.

This pass resembles a Kerberos Ticket-Granting Ticket (TGT).

Stage 2: obtain a ticket for a particular attraction

To ride the roller coaster, take the pass to the ticket office and request a roller coaster ticket.

This is analogous to a Service Ticket.

Stage 3: enter the specified attraction

At the roller coaster entrance, present the dedicated ticket. Staff validate it and apply the attraction's access rules before letting you ride.

Similarly, a target service validates a Kerberos ticket and then checks access permissions.

You do not need to return to the park entrance for every identity check. However, the initial pass does not grant unrestricted entry to every attraction.

A TGT requests service tickets; a Service Ticket proves identity to a particular service.

### 3. How Kerberos actually works

Kerberos involves three main roles.

| Role | English name | Function |
| --- | --- | --- |
| User / computer | Client | Requests access to resources |
| Central authentication service | KDC (Key Distribution Center) | Authenticates identities and issues tickets |
| Resource server | Service Server | Validates tickets and provides the service |

In Windows Active Directory, the KDC usually runs on a Domain Controller (DC).

The KDC contains two logical functions: AS (Authentication Service) issues TGTs; TGS (Ticket-Granting Service) issues service tickets. They need not be separate computers.

{{figure:tickets}}

This is the basic Kerberos V5 design described in [IETF RFC 4120](https://www.rfc-editor.org/rfc/rfc4120.html).

### Where does encryption occur?

Kerberos does not simply hand your password to every server.

In a common password-based authentication flow:

1. Ming's computer uses a password-derived key to prove possession of the required authentication information.
2. After verification, the KDC issues an encrypted TGT and corresponding session-key information.
3. To access the file server, Ming uses the TGT to request a service ticket from the KDC.
4. The KDC issues an encrypted ticket that the target service can validate.
5. The file server checks the ticket and associated authentication information.

In the standard password-based Kerberos flow, the user's plaintext password need not be sent over the network directly to the service server.

Tickets also have validity periods, encryption protection, and authentication mechanisms that resist replay.

However, Kerberos primarily authenticates identities. It does not establish that all subsequent application data is automatically encrypted. Check the application protocol, such as HTTPS or SMB encryption, and its security settings.

### 4. Why does Kerberos care about computer time?

This connection matters in computer engineering and CEH.

Suppose Ming's computer shows 9:00 AM while the Domain Controller shows 9:20 AM.

Kerberos uses timestamps to help resist Replay Attacks.

With an excessive time difference, a server may reject authentication because the authentication information falls outside its accepted time window.

Typical Windows AD policy defaults allow 5 minutes of clock skew, and policy can change this tolerance.

This helps explain the importance of Network Time Protocol (NTP) and Windows time synchronization in enterprise networks.

Connect this to NTP enumeration in CEH M04: clock synchronization can directly affect authentication reliability, beyond displaying the correct time.

### 5. How do LDAP, Kerberos, Active Directory, and DNS work together?

A table connects their responsibilities.

| Technology | Main question | Main function |
| --- | --- | --- |
| DNS | Where is the server? | Resolve names and locate services |
| LDAP | What information is in the directory? | Query users, groups, and other directory information |
| Kerberos | How can identity be proved? | Authenticate through encrypted tickets |
| Active Directory | Who manages identities and directory data? | Provide domain accounts, directories, and management mechanisms |

For example:

When Ming signs in to a Windows domain computer and opens a shared folder, DNS can help find domain services or the target host; Kerberos can authenticate; AD supplies relevant account and group information; the file server applies permissions to decide whether access is allowed.

LDAP may serve directory queries, but not every Windows domain sign-in requires the client to issue a direct LDAP query.

### 6. What Kerberos security risks matter for CEH?

Kerberos is a mature authentication protocol, but remains exposed to attacks under certain conditions.

| Risk | Plain explanation | Main defensive direction |
| --- | --- | --- |
| Pass-the-Ticket | Impersonate a holder by stealing usable tickets | Protect endpoints, credentials, and ticket storage |
| Kerberoasting | Use certain service tickets to attempt offline guesses of weak service-account passwords | Strong passwords, gMSA, and appropriate encryption algorithms |
| Golden Ticket | Forge TGTs after obtaining highly sensitive Kerberos keys | Strictly protect domain controllers and KRBTGT keys |
| Replay Attack | Resend intercepted authentication messages | Timestamps, Authenticators, and replay checks |

You do not need to memorize every label at once. Understand the security relationship:

Kerberos reduces repeated password transmission, but stolen endpoints, tickets, or core keys can still enable impersonation.

In Windows domain auditing, event ID 4768 helps observe TGT requests, while 4769 concerns service-ticket requests. These records help investigate authentication anomalies; a single event alone does not establish an attack.

### 7. Can you inspect Kerberos tickets on Windows?

Yes. In a Windows environment you are authorized to use, open PowerShell or Command Prompt:

```
klist
```

If the current logon session has Kerberos tickets, this command lists cached ticket information, including the corresponding services and validity start and end times.

An empty list does not necessarily mean Kerberos is broken. You might be using a local account, have not accessed a service requiring Kerberos, or be in a session using another authentication method.

This form of the command reads information and does not actively modify domain settings.

### 8. Three concepts to check your Kerberos understanding

1\. After signing in, Ming wants to access a file server. What does Kerberos normally use first to request a service ticket?

TGT

LDAP search results

IP address

2\. Does successful Kerberos authentication mean Ming may read every confidential company file?

Yes, authentication grants every permission

No, the target service must still check authorization

3\. What can happen if a computer and its Domain Controller differ by 20 minutes?

Kerberos may reject authentication because of clock skew

LDAP automatically deletes users

All service tickets become permanently valid

{{answer:kerberos}}

Kerberos establishes who an identity is; access to confidential information still requires the service's authorization decision.

The two ticket types, TGT and Service Ticket, also show why knowing a password, holding a ticket, and having system permissions are separate facts.


## Primary sources and scope

Fact-check date: 2026-11-07. Examples are synthetic. No LDAP directory queries or Windows klist commands were executed. Command documentation, teaching-site tests, and actual enterprise validation are separate evidence layers.

- [RFC 4511: LDAP search and result codes](https://www.rfc-editor.org/rfc/rfc4511.html)
- [RFC 4513: LDAP authentication and TLS](https://www.rfc-editor.org/rfc/rfc4513.html)
- [RFC 2696: paged results and cookies](https://www.rfc-editor.org/rfc/rfc2696.html)
- [Microsoft: RootDSE](https://learn.microsoft.com/en-us/windows/win32/adsi/rootdse)
- [Microsoft: Global Catalog](https://learn.microsoft.com/en-us/windows/win32/ad/binding-to-the-global-catalog)
- [Microsoft: LDAP signing](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/ldap-signing)
- [RFC 4120: Kerberos V5](https://www.rfc-editor.org/rfc/rfc4120.html)
- [Microsoft: Kerberos overview](https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-authentication-overview)
- [Microsoft: clock synchronization tolerance](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/maximum-tolerance-for-computer-clock-synchronization)
- [Microsoft: klist](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/klist)
- [Microsoft: event 4768](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4768)
- [Microsoft: event 4769](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4769)
