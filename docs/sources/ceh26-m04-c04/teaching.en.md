**CEH M04-04｜SMB Enumeration: Use Evidence to Distinguish Shares, Files, and Permissions**

This unit briefly reviews SMB fundamentals, then adds two distinctions: where a refusal occurs, and support for encryption versus encryption actually in use.

**Reconnect with the idea in one sentence**

SMB (Server Message Block) lets computers use resources such as a server's files over a network. A share name is like the entrance to a records room: finding the entrance, listing the filenames inside, reading a particular file's contents, and modifying or deleting it must each be verified separately. Windows, Samba, and many NAS devices can provide SMB, so seeing SMB alone does not identify the operating system. [Microsoft: SMB overview](https://learn.microsoft.com/en-us/windows-server/storage/file-server/file-server-smb-overview)

Fundamentals to recall: share permissions and file permissions must be considered together; ABE (Access-Based Enumeration, which filters what is displayed according to access rights) primarily affects whether files and folders within a share are visible and does not replace access control; signing and encryption protect data in transit and do not grant you additional file permissions.

**1. Break “cannot connect” into stages**

A typical new connection proceeds in this order:

1. Establish a transport connection.
2. **Negotiate**: agree on the SMB version and capabilities.
3. **Session Setup**: establish a session using an identity.
4. **Tree Connect**: request a connection to a specified share.
5. Request operations such as listing a directory or reading a file.

This is a conceptual sequence, not a requirement to repeat every step each time a file is read. Success at one step does not mean the next step is authorized. [Microsoft: SMB connection and failure stages](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/negotiate-session-setup-tree-connect-fails)

An open TCP port 445 is therefore only a clue about an entry point, not evidence that a share list has been obtained. If access to Finance is denied at Tree Connect, you cannot claim to have entered it, confirmed that a particular file exists inside, or completed tests of that file's permissions. If you can enter Training but are denied when reading draft.txt, retain the full response to that file operation and check the identity, path, and effective permissions.

ACCESS_DENIED is a starting point for investigation, not a guarantee that NTFS file permissions are the only cause; conditions involving authentication, signing, or encryption requirements can also cause a refusal. Identify the stage first, then inspect the configuration and logs. Do not disable security protections as soon as an error appears. [Microsoft: SMB access denied](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/access-denied-access-smb-file-share)

**2. The account you enter is not necessarily the identity actually used**

A named account, Guest access, and an anonymous session are different cases. The absence of a password prompt may mean that existing sign-in information or tickets are being reused; it does not establish successful anonymous access. Even after entering an account name, check the identity of the session that was actually established.

Tool options are not test results either. For example, smbclient's -N suppresses the password prompt; it does not mean the server has accepted an anonymous connection. -L requests a list of services or shares, ls lists a directory after connecting to a share, and get downloads a specified file. These provide different kinds of evidence. get also saves data locally, so it cannot be treated as enumeration with no side effects. [Samba: smbclient manual](https://www.samba.org/samba/docs/current/man-html/smbclient.1.html)

**3. Separate support, requirements, and actual use**

A dialect is the SMB protocol version selected by both sides for this connection. Seeing SMB 3.1.1 confirms the corresponding negotiation result; it does not automatically prove that SMB encryption is in use for every share or every access.

- **Support**: what the product and protocol are capable of.
- **Requirements**: what the effective policy mandates.
- **Actual use**: what this connection actually used.

Signing helps verify message integrity and origin, but its purpose is not to hide the contents. Encryption protects the confidentiality of data in transit. Even encrypted transmission does not mean the files on disk are encrypted or that access permissions are necessarily correct. [Microsoft: signing](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-signing)｜[SMB encryption](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security)

**4. Diagnose a synthetic case**

The following is a tabletop teaching example only; no real queries were run. Suppose the authorized lab records confirm the identity as LAB/labreader:

- The share list returns Training and Finance.
- The Training directory lists readme.txt and draft.txt.
- Reading the specified synthetic contents of readme.txt succeeds.
- Reading draft.txt is denied.
- Finance is denied at Tree Connect; the share was not entered.
- The Training connection uses SMB 3.1.1, with signing in use and SMB-layer encryption not in use.
- Uploading, modifying, and deleting have not been tested.

What can be stated now: this identity saw two share names and read the specified readme.txt; the name draft.txt was disclosed, but its contents were not obtained in this attempt; files inside Finance have not been confirmed. Write and delete access remain unknown.

If policy says that even the name draft.txt must not be visible to labreader, a denied read still does not establish that the information-disclosure requirement has been met. ABE can help reduce this exposure of names, but actual access restrictions still require permission controls. [Microsoft: the scope of ABE](https://learn.microsoft.com/en-us/powershell/module/smbshare/set-smbshare?view=windowsserver2025-ps)

When verifying safeguards, check both that legitimate use is allowed and that operations that should not be allowed are denied. Retain the time, identity, path, operation, full response, and untested items. Do not describe a limited success as a compromise or a single denial as proof of comprehensive security.

**Just one small check**

A colleague says: “Finance appears in the list, so all the files inside it can be read; Training uses SMB 3.1.1, so its contents are encrypted; being able to read readme.txt also means it can be deleted.”

**Correct this conclusion in two or three sentences, explaining what has been confirmed and what is still unknown.**

There is no need to run tools or memorize packet names. The next unit covers NetBIOS/RPC, continuing to distinguish name information, communication entry points, and actual authorization.
