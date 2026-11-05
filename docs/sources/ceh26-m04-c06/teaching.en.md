**M04-06 | Unix/Linux Users and NFS: Why Can’t I Read the File If the Usernames Match?**

This unit brings user enumeration and NFS together around one chain of questions: **What is the account called, which identity is the program running under, how does the server identify the request, and what can that identity do to the specified file?**

**1. Connect the Staff Directory, ID Badge, and Filing Cabinet**

Imagine a company with two offices, each issuing its own employee badges. Both offices have an employee named “Lin.” That does not mean their employee numbers match, or that both access-control systems treat them as the same person.

- **User enumeration**: Looking up accounts, user IDs, and groups within an authorized scope, like checking a staff directory.
- **UID/GID (User ID/Group ID)**: The numeric identifiers Linux uses for users and groups.
- **NFS (Network File System)**: Allows a client to use a server-provided file system over a network, like two offices sharing a filing cabinet.
- **Export/Mount**: The server defines which resources to make available and under what conditions; the client attaches the remote file system to its own directory tree. Mounting does not copy all the contents onto the local machine, nor does it grant read and write access to every file.

This lesson describes common Linux behavior. Other Unix systems, file systems, and NFS deployments must still be checked against their own configurations. [Linux identities and groups](https://man7.org/linux/man-pages/man7/credentials.7.html) | [Linux NFS manual](https://man7.org/linux/man-pages/man5/nfs.5.html)

**2. Looking Up an Account Is Different from Checking the Program Doing the Work**

Here are three queries and their purposes, side by side:

- getent passwd learner: Looks up the account information for learner according to the local NSS (Name Service Switch) configuration. Sources may include local files and a centralized directory.
- id learner: Looks up user and group information for the specified account.
- id: Without an account argument, displays user and group information for the current process. Running it in a test terminal can help verify that environment’s identity, but it does not substitute for checking the identity of a different service process.

Consequently, adding a group to an account’s directory entry does not necessarily mean an existing session is already running with that new group. Finding an account only proves that the queried source returned that record. It does not establish that the account can log in, is logged in, or has administrative privileges. These local queries do not have a universal “user enumeration port.” [getent](https://man7.org/linux/man-pages/man1/getent.1.html) | [GNU id](https://man7.org/linux/man-pages/man1/id.1.html) | [Process credentials](https://man7.org/linux/man-pages/man7/credentials.7.html)

**3. With NFS, Matching Names Still Require Checking the Identity the Server Receives**

The common sec=sys/AUTH_SYS security mode handles requests using numeric identity information supplied by the client, including UID and GID. It does not itself provide cryptographic proof of identity, so deployment also relies on trust in the clients and network environment. Simply naming an account learner on both computers does not automatically align their UIDs or permissions. [RFC 5531: AUTH_SYS](https://www.rfc-editor.org/rfc/rfc5531.html#appendix-A)

Two other concepts are easy to confuse:

- **root_squash**: A Linux NFS server maps UID/GID 0 in requests to the anonymous UID/GID, rather than directly accepting the remote root identity. It does not anonymize every nonzero identity as well; that is a different setting, all_squash. Therefore, root_squash is not a substitute for comprehensive identity and file-permission management. [NFS identity-mapping options](https://man7.org/linux/man-pages/man5/exports.5.html)
- **NFSv4 owner-name attributes**: A file’s owner/owner_group attributes can be represented in user@domain form and then mapped locally. This is a separate question from how a particular request authenticates its identity. Seeing NFSv4 or matching account names still leaves you needing to verify the actual security mode and the identity the server uses. [RFC 8881 §5.9](https://www.rfc-editor.org/rfc/rfc8881.html#section-5.9)

**4. Permissions Depend on the Object: Directory r/x Is Not File r**

Start with ordinary Linux permissions, leaving additional rules such as ACLs (Access Control Lists) aside for now:

- For a regular file, r means reading its contents, w means modifying its contents, and x means executing it.
- For a directory, r means reading the names of directory entries, while x means searching/traversing the directory and looking up entries by name. Reading a particular file also requires applicable search permission on the directories along its path, as well as read permission on the file itself.

Think of a records room: being able to see document names on a cabinet does not mean you can open every document. Knowing a document’s name still requires permission to pass through the access-controlled doors and open that document. [Red Hat: File-system permissions](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/configuring_basic_system_settings/managing-file-system-permissions_configuring-basic-system-settings) | [Linux path resolution](https://man7.org/linux/man-pages/man7/path_resolution.7.html)

For example, the permission string rw-r----- consists of three groups of three characters. In order, they mean that the owner can read and write, the owning group can read, and others have no permissions. A hyphen means that particular permission is not enabled. Ordinary basic permissions are evaluated using the applicable owner, group, or other identity class, rather than arbitrarily adding all three groups together. In a real environment, ACLs, security policies, privileges, and other factors must also be checked. [Linux permission notation](https://man7.org/linux/man-pages/man7/inode.7.html) | [Permission checks](https://man7.org/linux/man-pages/man7/path_resolution.7.html)

**5. Read a Synthetic Record: Same Name, Directory Listing Works, File Access Still Denied**

This is a paper exercise with no connection to any real host. Assume an administrator has approved the test account, the specified share, and read-only operations:

1. On the client, learner has UID 1001 and primary GID 3000, and its group list contains only 3000. The test process also uses this identity.
2. In the server’s account records, however, learner has UID 2001.
3. NFS uses sec=sys. The administrator confirms that this request is handled as UID 1001 and GID 3000, with no additional mapping. root_squash is enabled.
4. The share has been mounted successfully, and the name report.txt can be listed within it. Reading report.txt returns Permission denied.
5. The server confirms that the file’s owner UID is 2001, its group GID is 3000, and its basic permissions are rw-------. Path search is allowed; no additional ACLs or privileges alter this decision in this example.
6. No attempt has been made to modify the file or test any other files.

When reading this record, first compare the “actual request UID” with the “file owner UID,” then examine the applicable permission group. Do not compare only the learner names displayed on the two computers, and do not treat a successful directory listing as evidence that the file contents have been read.

The configuration and identities are explicit here, allowing you to practice interpreting permissions under stated conditions. In real work, if all you have is the message Permission denied, you still need to check identities, paths, effective permissions, and logs before confirming the cause.

**6. Keep Your Conclusions Within What the Enumeration Tools Establish**

rpcinfo can query ONC RPC service registrations; showmount -e queries the MNT service for an export list. Neither is equivalent to reading files inside a share. Check the specific options before using either tool: a tool’s name alone does not guarantee that every operation is read-only. [Oracle: rpcinfo](https://docs.oracle.com/cd/E88353_01/html/E72487/rpcinfo-8.html)

The usual NFS service port is 2049. NFSv3 deployments often also involve rpcbind on port 111 and services such as mountd. NFSv4.1 does not require that same service-location procedure, and the specification recommends that clients not use RPC binding to discover the service port. An NFSv4-only server may also leave the MNT service queried by showmount unavailable. Therefore, **a failed showmount query does not prove that NFS is absent; a response on port 2049 does not prove that a particular file is readable.** [showmount manual](https://man7.org/linux/man-pages/man8/showmount.8.html) | [NFS network services](https://man7.org/linux/man-pages/man5/nfs.5.html) | [RFC 8881 §2.9.3](https://www.rfc-editor.org/rfc/rfc8881.html#section-2.9.3)

At a minimum, distinguish these observations in your records: account found, share found, mount successful, names listed, contents read, and contents modified. They are separate pieces of evidence, not a fixed test procedure that must always be performed from beginning to end.

**7. Protection and Further Checks**

Administrators need to manage account lifecycles, identity mapping across hosts, the sources allowed to access shares, and directory and file permissions together. Use a server-side read-only policy for shares that only need to be read. An export’s rw option permits writing at the share layer; it does not grant every user file-level write permission. [exports manual](https://man7.org/linux/man-pages/man5/exports.5.html)

Where stronger identity and transport protection are needed, evaluate Kerberos according to the infrastructure: krb5 provides authentication, krb5i adds integrity protection, and krb5p adds encrypted privacy protection. Support for these capabilities does not mean they are currently enabled. Verify the actual negotiation and configuration. [NFS security modes](https://man7.org/linux/man-pages/man5/nfs.5.html)

When access is denied, first preserve the time, version, security mode, client, actual request identity, path, operation, and full response. Have an authorized administrator check the configuration. Grant the permissions required by the work, retain the original configuration, and retest under the same conditions. Do not replace diagnosis with “turn on every permission.” Use synthetic names in public records, and do not include real account lists or credentials.

**One Quick Check**

Referring to Section 5, a colleague says: “Both accounts are called learner, and we can see report.txt, so we already have read access. If we can’t read it, root_squash must be the cause.”

**Correct that conclusion in two or three sentences: Which identity is actually evaluated? Which setting explains the read result in this example? Which operations still lack evidence?**

This exercise only interprets synthetic data. No installation, mounting, or configuration changes have actually been performed, so there are no environment-cleanup steps. A reference answer is provided separately; reading the material does not establish understanding. The next unit covers SNMP.
