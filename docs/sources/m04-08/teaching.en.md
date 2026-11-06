**M04-08 | LDAP / Active Directory enumeration: how can you tell whether the accounts you found are complete?**

**The key point: an LDAP query returns “the data this identity can see under this query's conditions and limits.” Before treating it as a complete inventory, verify the search scope, permissions, requested attributes, and whether all results were retrieved.**

This lesson builds on LDAP fundamentals: directory locations, search scope, and authentication. A new synthetic case brings them together into a complete process for interpreting results. The discussion covers legally authorized, isolated environments only; it performs no operations against third-party targets.

**1. Think of the directory as a company address book**

An address book might contain employees' names, accounts, departments, and groups. If you ask reception “Who is in Engineering?” and receive two names, that does not mean the entire company has only two people. The scope of your question, the information you may see, and whether another page remains all affect the answer.

LDAP stands for Lightweight Directory Access Protocol. It is a set of communication rules that programs use to query directories. Active Directory Domain Services, or AD DS, is Microsoft's service for managing accounts, computers, and related directory information. LDAP is a communication method; AD DS is a system providing directory services. They are not synonyms.

Here, enumeration means organizing the directory entries and attributes available under specified conditions. Defenders can use it to inventory accounts and assess information exposure. Someone without authorization who can read excessive information may also learn about the organization's structure. **Control who can see what; simply disabling the protocol everywhere is not the whole answer.**

**2. First establish exactly what you asked**

A directory record is an Entry; fields such as its name and email are Attributes. DN stands for Distinguished Name and describes an entry's location in the directory hierarchy.

For example, the synthetic DN CN=Lin,OU=People,DC=example,DC=test identifies the Lin entry in the People organizational unit of the example.test directory. CN means common name, OU means organizational unit, and DC denotes a component of the domain name. Domain Controller is also abbreviated DC; distinguish that meaning from a DN's DC= component.

For each search, establish at least four things:

- Base: the entry from which the search starts.
- Scope: how deep to search. base examines only the starting entry; one-level examines only its immediate children, excluding the starting entry; subtree examines the starting entry and all levels beneath it.
- Filter: the conditions an entry must match, such as a specified type or name.
- Requested attributes: the fields to return.

This is like telling reception: “Start with Engineering, examine only its immediate members, select those matching a condition, and give me their names only.” If you did not search subdepartments or request email, the results cannot establish that the subdepartments are empty or these people have no email.

**3. In AD, the query entry point also matters**

An AD domain is one administrative scope within an organization's directory; a forest is the overall structure containing one or more domains. Remember: **one domain does not necessarily represent the entire forest.**

RootDSE is a special entry through which an LDAP server provides information about itself. Think of it as reception's service information sign. It can identify the server's directory partitions and supported capabilities. In AD, defaultNamingContext helps locate that server's default domain naming context. Reading the sign does not retrieve every account or establish that an anonymous identity can read the whole address book.

The Global Catalog, or GC, is like an index spanning domains. It helps find objects across domains, but its replicas for other domains contain only a subset of attributes. It does not contain every field of every object.

A field missing from a GC query result may therefore be absent from that partial attribute set. Check the requested attributes, the directory holding the data, and read permissions before concluding that the original data does not exist.

**4. Authentication, read permissions, and transport protection are three separate things**

LDAP Bind establishes or changes a connection's authentication state. Record the actual authentication method and identity. The words “Bind successful” alone do not establish that you authenticated as a particular account or can read everything.

The reception analogy helps separate these concepts:

- Authentication: who you are, or whether the current identity is anonymous.
- Authorization: which entries and attributes this identity may read.
- Transport protection: whether queries and data can be observed or altered in transit.

TLS stands for Transport Layer Security and can protect data in transit. LDAPS commonly uses TLS from the start of a TCP 636 connection; StartTLS can initiate TLS on a TCP 389 LDAP connection. Do not judge security from the port number alone. Verify that protection was actually established and the server certificate was validated correctly.

LDAP signing primarily verifies message integrity and authenticity. **Signing is not encryption: preventing unnoticed alteration and preventing others from reading content are different guarantees.** Check the operating-system version, authentication method, and effective settings rather than assuming identical security defaults across all AD installations.

**5. A new case: seeing data does not mean the search finished**

The following records are entirely synthetic teaching material. No connection or test was performed, and they represent no real company's data.

You are authorized to inventory accounts beneath the People organizational unit in an isolated lab domain. The tool reports:

- Search base: OU=People,DC=example,DC=test.
- Search scope: subtree.
- Filter: the conditions specified for this account inventory.
- Requested attributes: cn only, meaning common name.
- Entry limit for this search: 2.
- Two names displayed: Lin and Chen.
- Final status: sizeLimitExceeded, result code 4.

**Observation:** you received two entries matching this query's conditions and visible to its identity. The entry limit prevented the search from finishing normally.

**Supported conclusion:** two results have been obtained; the complete count remains unconfirmed.

**Unsupported conclusions:** People contains exactly two accounts; the entire domain contains only two accounts; these two people have no email; or they can sign in to any particular application.

First preserve the original query conditions, identity, results, and final status. If further work remains within authorization, use the tool's supported paged search to retrieve results page by page. Do not change production server limits merely to increase the count.

Paging returns data in batches; the tool uses continuation information supplied by the server to obtain the next batch. The page size limits each batch, not the total account count. **The first page alone, or an unverified assumption that the tool retrieved subsequent pages, cannot establish completeness.** Paging also does not automatically expand your read permissions or search scope.

Even a final success status means only that this operation succeeded. It does not guarantee that all of the organization's data has been inventoried. Assess completeness against the question the inventory was intended to answer.

**6. What evidence should defenders retain?**

The following are verification methods for this case, not claims of completed configuration:

- **Reproducible query:** record time, server, identity, base, scope, filter, and attributes; retain no passwords or secrets.
- **Complete retrieval:** preserve the final result code, paging completion, and tool errors. Separate “how many entries arrived” from “whether retrieval was complete.”
- **Appropriate visibility:** use synthetic test data created beforehand by an administrator to check what a low-privilege account can see. Leave unexplained read failures open for investigation; do not raise your own privileges.
- **Actual connection protection:** verify the real TLS connection and certificate validation rather than relying on an address containing 636. When checking signing, separately confirm the applicable authentication method and effective settings.
- **Context for anomaly interpretation:** large directory queries merit investigation, but legitimate inventory tools also perform them. Consider source, identity, time, and established job schedules together; an LDAP query alone does not establish an intrusion.

**Take away this question: “Which identity did I use, where did I start, what conditions did I specify, and did I retrieve all results?” Answer it before interpreting the count.**

**One small check**

A colleague uses an authenticated low-privilege account over a valid TLS connection to perform a one-level search of the People organizational unit, requesting names only. The tool displays two results and success. The colleague says, “People and all its subdepartments contain only two people, and neither has email.”

Which two parts of that conclusion exceed the evidence? Which two query settings would you check first?

**Sources and applicability**

Lesson fact-check date: 2026/11/06. This lesson uses LDAPv3 specifications and Microsoft AD DS documentation, without assuming identical security defaults across Windows versions.

- [RFC 4511: LDAPv3 protocol, 2006/06](https://www.rfc-editor.org/rfc/rfc4511.html): search requests, final status, and result codes.
- [RFC 4513: authentication and security mechanisms, 2006/06](https://www.rfc-editor.org/rfc/rfc4513.html): authentication state, access control, and transport protection.
- [Microsoft: search scope, 2020/08/17](https://learn.microsoft.com/en-us/windows/win32/ad/search-scope).
- [Microsoft: RootDSE, 2024/02/07](https://learn.microsoft.com/en-us/windows/win32/adsi/rootdse).
- [Microsoft: Global Catalog, 2020/08/17](https://learn.microsoft.com/en-us/windows/win32/ad/global-catalog).
- [Microsoft: paging search results, 2018/05/31](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/ldap/paging-search-results).
- [Microsoft: LDAP signing and protection differences, 2026/10/02](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/ldap-signing).
