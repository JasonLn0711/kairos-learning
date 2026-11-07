# M04-06 | Unix/Linux Users and NFS: Why Can’t I Read the File When the Names Match?

The central idea of this lesson is:

Linux does not treat two accounts as the same person merely because their names match. Seeing a file over NFS does not establish permission to read its contents.

Imagine knowing someone named Lin at each of two companies. At the first company, Lin’s employee number is 1001; at the second, it is 2001.

Their names match, but an access-control system checks employee identifiers and authorization, rather than names.

Linux and NFS work in a similar way.

[[figure:workflow]]

Following this chain helps explain Linux account management, file permissions and NFS, and what evidence CEH enumeration actually gathers.

## 1. Linux Accounts: Does the Name or the Number Matter?

Start with three terms:

| Term | Plain-language meaning | Example |
| --- | --- | --- |
| Username | A name that people can recognize | `learner` |
| UID | User identifier | `1001` |
| GID | Group identifier | `3000` |

Ordinary Linux file-permission decisions primarily use numeric identities rather than human-readable account names. Also check the identity actually used for file access by the process (Linux filesystem UID/GID, usually the same as effective UID/GID) and its supplementary groups.

For example:

[[figure:identity]]

Both accounts are named `learner`, but one has UID 1001 and the other UID 2001.

Matching names therefore do not establish the same file-access identity.

Think of Username as an employee’s name, UID as an employee identifier and GID as a department identifier.

## 2. getent and id: Looking Up an Account Versus Checking the Current Identity

Imagine opening a terminal on your own Linux computer.

First command: look up whether the account exists in the name service.

```
getent passwd learner
```

Synthetic output:

```
learner:x:1001:3000:...:/home/learner:/bin/bash
```

This means the system found an account record according to its NSS configuration.

`1001` is the UID and `3000` is the primary GID. The `x` is not the password; it usually indicates that the password hash is not stored directly in this account field.

The record need not come from local `/etc/passwd`. It could come from a centralized name service such as LDAP.

Second command: look up the specified account’s identity and groups.

```
id learner
```

For example:

```
uid=1001(learner) gid=3000(staff) groups=3000(staff)
```

This asks: “What UID and assigned groups can the system currently find for learner?”

Third command: check the identity executing the command now.

```
id
```

This asks: “Which user and group identities does the current process carry?”

`id learner` and `id` are not interchangeable. The former looks up a specified account; the latter inspects the current process.

Why does the distinction matter?

Suppose an administrator has just added you to the `research` group, but your terminal session was opened much earlier.

The account record may have been updated while the existing shell process still carries its previous group list.

Even if `id learner` shows the new group, that does not establish that every existing process has acquired it.

Being able to look up an account also does not establish that it can log in or has administrator privileges.

## 3. What Is NFS, and How Can Two Computers Share Data?

NFS stands for Network File System.

Imagine a laboratory Linux server storing a large research dataset. Students use their own computers but do not want everyone to keep a separate copy of the same data.

NFS lets them use the server’s file system over the network.

[[figure:mount]]

Two terms are useful here.

Export: the server specifies which client hosts may use a directory and under which conditions.

Mount: a client attaches the remote file system to a local directory, such as `/mnt/data`.

A successful mount only establishes that the shared file system is attached. It does not establish permission to read or modify every file.

Being allowed into a company’s records room does not mean being allowed to open every confidential document inside.

### What Does sec=sys Mean?

NFS uses RPC (Remote Procedure Call) to carry operation requests.

With the common `sec=sys`, or `AUTH_SYS`, mode, the client supplies identity information such as UID and GID to the server.

These numbers are primarily asserted by the client and lack a cryptographic proof sufficient to independently verify the user’s identity. This mode therefore relies on trust in the client host and its administration.

Naming the accounts on different computers `learner` does not resolve the NFS identity question.

Advanced note: NFSv4 file-owner attributes may be represented as `learner@example.com`. How a file owner is represented and how a network request authenticates an identity are still separate questions.

## 4. Linux Permissions: Why Can I See a Filename but Not Read Its Contents?

This is the lesson’s central technical mechanism.

Basic Linux permissions have three types:

| Symbol | Regular file | Directory |
| --- | --- | --- |
| `r` | Read contents | List directory-entry names |
| `w` | Modify contents | Add, remove or rename entries when other required conditions hold |
| `x` | Execute the file | Search or traverse the directory to look up an entry |

A directory’s `x` is search or traversal permission; it does not mean executing the directory.

Consider this path:

```
/shared
    └── reports
         └── report.txt
```

You may be able to list the name `report.txt` inside `reports` because you have directory-read permission.

Reading `report.txt` also requires the ability to traverse the directories in the path and permission to read the file itself.

### Understanding rw-r----- and rw-------

The usual Linux permission string has three groups: owner, group and others.

[[figure:permissions]]

This exercise shows basic permission bits only. It leaves out ACLs, SELinux, special privileges and additional NFS policy.

Linux selects the permission class that applies to your identity; it does not combine all three classes to grant access.

If your UID matches the owner, use Owner. Otherwise, if the primary group or any supplementary group matches, use Group. If neither matches, use Others. Once a class is selected, a missing read bit in that class does not allow falling back to the Others permissions.

## 5. Interpreting This Lesson’s Permission denied Case

Now combine the preceding ideas.

Synthetic case: reading `report.txt`.

Assume the path can be traversed, the export allows this operation, and there are no ACLs, extra privileges or other identity mappings. The following decision considers only the listed identities and basic file permissions.

| Client UID | 1001 |
| --- | --- |
| Client GID | 3000 |
| File-owner UID | 2001 |
| File-group GID | 3000 |
| File permissions | `rw-------` |
| NFS security mode | `sec=sys` |

Server-side basic-permission decision:

1. Does the UID match the owner? No: `1001 ≠ 2001`.
2. Does the GID match? Yes: both are `3000`.
3. Does the group have read permission? No. Group is `---` in `rw-------`.

Permission denied.

Under the stated conditions, the server denies the read.

Did `root_squash` cause this?

No. The request UID in this example is 1001, rather than root’s usual UID 0.

`root_squash` maps client UID/GID 0 to an anonymous identity. `all_squash` maps all user requests to an anonymous identity.

The evidence in this case supports the conclusion that the requester is not the file owner and the matching group has no read permission.

That conclusion follows from the known configuration.

A bare `Permission denied` message, without UID, GID, path permissions and security settings, is not enough to reach the same conclusion.

## 6. The CEH Perspective: Enumeration Evidence Does Not Establish Access

A central M04 skill is recognizing the evidence each tool actually provides, rather than memorizing a large number of commands.

For example, in an authorized test environment:

```
rpcinfo -p 192.0.2.10
```

This queries registered remote RPC service information. It does not read files.

```
showmount -e 192.0.2.10
```

This queries NFS export information through the MNT service. It does not grant permission to read every file in the share.

Know these two common ports:

| Port | Common purpose |
| --- | --- |
| `111` | rpcbind, which helps locate RPC services |
| `2049` | NFS service |

NFSv3 commonly involves services such as rpcbind and mountd. NFSv4 can use 2049 directly without the same MNT query mechanism.

No result from `showmount -e` therefore does not establish that the server has no NFS service.

### Build an Evidence Ladder

| Observation | What it actually establishes |
| --- | --- |
| Account name found | The name service returned account information |
| Export found | The service provided share-related information |
| Mount succeeded | The specified share was mounted |
| Filename listed | The relevant directory listing was obtained |
| File read succeeded | The read operation on that file succeeded |
| File modification succeeded | The particular modification operation on that file succeeded |

No level automatically establishes the next.

Security forensics, penetration-test reports and system debugging all require enough evidence between an observation and its conclusion.

## 7. Protecting NFS and Investigating a Denial

NFS security requires at least three layers to be considered together.

| Security layer | Question | Common controls |
| --- | --- | --- |
| Hosts and shares | Which clients may use the share? | Export source restrictions, `ro`/`rw` |
| Identity and transport | Who is making the request, and is it protected? | `sec=sys`, Kerberos |
| File permissions | What may this identity do? | UID, GID, permissions, ACLs |

### What Can Kerberos Provide?

As noted earlier, `sec=sys` relies more heavily on trust in clients.

For stronger identity authentication, evaluate Kerberos security modes.

| Mode | Main security capability |
| --- | --- |
| `sec=sys` | Carries system identity without cryptographic identity authentication |
| `sec=krb5` | Kerberos identity authentication |
| `sec=krb5i` | Authentication plus data-integrity protection |
| `sec=krb5p` | Authentication, integrity and encryption of transmitted content |

These capabilities require appropriate infrastructure and configuration. NFSv4 does not automatically imply encryption.

When an NFS read fails in a laboratory or company, first identify the failed operation, check the actual process identity, inspect the NFS version and security mode, and check effective permissions along the path and on the file. An administrator can then inspect ACLs, export settings and relevant logs.

Do not respond to `Permission denied` by immediately running `chmod 777`. It may grant access to previously unauthorized users while still failing to resolve the actual cause.

## Final Understanding Check

Scenario: determine the reason for denial.

In another test case, the NFS server’s `budget.txt` has the following settings:

File-owner UID: 2001; file GID: 3000; permissions: `rw-r-----`. The actual client request uses UID 1001 and GID 4000, with no supplementary membership in group 3000. Assume the path can be traversed, no ACLs or extra privileges apply, and `sec=sys` is used without additional identity mapping.

Answer in your own words:

A. Can the client read `budget.txt`? Why?

B. What could change if the client GID became 3000?

C. Does being able to list the name `budget.txt` establish permission to read its contents?

Answer first, then expand the reference answers on this page. This site does not submit or automatically grade answers.

The learning outcome is being able to derive an access result from account names, actual process identities, NFS security mode and file permissions, and to identify evidence that is still insufficient for a conclusion.

The next lesson, M04-07 on SNMP (Simple Network Management Protocol), shifts the enumeration focus from users and file shares to network devices, system state and management information.

## Technical Sources and Verification

- [getent(1)](https://man7.org/linux/man-pages/man1/getent.1.html): NSS account lookup.
- [id(1)](https://man7.org/linux/man-pages/man1/id.1.html): specified-account lookup and current process identity.
- [credentials(7)](https://man7.org/linux/man-pages/man7/credentials.7.html) and [path_resolution(7)](https://man7.org/linux/man-pages/man7/path_resolution.7.html): process credentials, supplementary groups and path traversal.
- [exports(5)](https://man7.org/linux/man-pages/man5/exports.5.html) and [nfs(5)](https://man7.org/linux/man-pages/man5/nfs.5.html): export policy, squash mappings and Kerberos modes.
- [showmount(8)](https://man7.org/linux/man-pages/man8/showmount.8.html): MNT queries and NFSv4-only limitations.
- [RFC 5531 Appendix A](https://www.rfc-editor.org/rfc/rfc5531.html#appendix-A) and [RFC 7530 §5.9](https://www.rfc-editor.org/rfc/rfc7530.html#section-5.9): AUTH_SYS and NFSv4 owner representation.
