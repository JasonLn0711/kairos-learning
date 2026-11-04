# CEH M04-03 | FTP/SMTP enumeration: interpret replies and separate information from permissions

FTP / SMTP Enumeration · New curriculum, lesson three

This lesson brings file and mail services together to practise one judgment: **what a service answers, what it has actually allowed you to do, and what evidence is still missing.** We begin with an everyday analogy, read two synthetic records, and finish with one check.

## 1. A service is a reception desk: answering questions and allowing actions are separate

Imagine entering an office building. Reception can tell you which departments are there and provide a public document catalogue. Knowing a document's name does not let you read its contents; a visitor badge does not let you edit every document.

Computer services have similar distinctions:

- **Service identification**: does the endpoint respond, and what service does it advertise?
- **Enumeration**: organize the names, capabilities, directories, or account clues it exposes.
- **Authentication**: how the service establishes the identity used for the connection.
- **Authorization**: which actions that identity may perform on which resources.

There is also authorization to test: the scope approved by the administrator. A service technically accepting a request does not expand your approved testing scope.

This lesson uses original, fictional text records. No connection, login, download, or email transmission takes place. Names and accounts are teaching roles, not targets to test on real services.

## 2. What does FTP do? Separate commands from data first

**FTP (File Transfer Protocol)** lets a client exchange files with a server. The client is the software making requests; the server handles them.

FTP commonly uses two kinds of connection:

- **Control connection**: carries requests and replies, commonly on TCP 21. Examples include supplying an account name, asking about capabilities, and requesting a directory listing.
- **Data connection**: carries file contents or directory listings, separately from the control connection.

Think of calling a warehouse to request material and then receiving it over a separate delivery route. The call can work while delivery fails. Thus, a successful login followed by a failed listing calls for checking the data connection and policy, rather than immediately blaming the account. [FTP connections and commands](https://www.rfc-editor.org/rfc/rfc959.html)

Two common arrangements exist for the data connection:

- **Active mode**: the client provides a receiving endpoint, and the server initiates the data connection.
- **Passive mode**: the server provides a receiving endpoint, and the client connects to it.

EPSV extends passive mode: its reply provides the data port, and the data connection uses the server address used by the control connection. Firewalls and **NAT (Network Address Translation)**, a mechanism that translates connection addresses between address realms, affect these connections. Do not memorize all FTP data transfers as “always TCP 20.” [FTP extensions for IPv6 and NAT](https://www.rfc-editor.org/rfc/rfc2428.html)

## 3. What information can FTP enumerate? Each request has a scope

A **banner** is the welcome or identification text seen after connecting. It may name a product, but the text can be configured, hidden, or supplied by a front-end service. Record it as information advertised by the endpoint, not sufficient proof of the complete version or vulnerability applicability.

**FEAT** asks which extensions the server supports. A listed capability establishes what was advertised in that conversation; authentication state, settings, and policy still affect whether it can be used. [FTP feature negotiation](https://www.rfc-editor.org/rfc/rfc2389.html)

File listings have different representations. **MLSD** lists directory entries with standardized facts such as type, size, and modification time; **MLST** provides information about a single entry. Such descriptive information is **metadata**. Reading a name or size is distinct from reading file contents. [Machine-readable FTP directory extensions](https://www.rfc-editor.org/rfc/rfc3659.html)

Traditional **LIST** commonly provides a human-readable directory listing, **RETR** requests a file, and **STOR** requests storage of uploaded data. These are different operations. Record listing, reading, and writing separately; success in one is not evidence of success in the others. [FTP operation definitions](https://www.rfc-editor.org/rfc/rfc959.html)

## 4. Anonymous login uses a shared identity; permissions still need checking

**Anonymous FTP** commonly offers access without an individual personal account. An administrator may deliberately provide public downloads, so anonymous login availability alone is not a vulnerability conclusion.

Evaluate risk against the intended purpose:

- Does a download-only area unexpectedly allow uploads or deletion?
- Are backups, configuration, or other nonpublic material visible?
- Do the directories and readable files exposed to anonymous users exceed policy?

Limit anonymous permissions; disable anonymous service when it is unnecessary. Traditional FTP's plaintext passwords and data transmission also belong in the risk assessment. [FTP security considerations](https://www.rfc-editor.org/rfc/rfc2577.html)

A useful report combines observation with policy. For example: “The designated test identity can list the public directory; policy allows that listing. The finance directory was not tested and cannot be marked as passed.” This is more useful than simply declaring FTP secure.

## 5. Read a synthetic FTP record

The following simulates a few steps in an authorized lab and omits connection establishment, login, and data-channel negotiation. Client/server/data labels identify the source of each line; this is not a script to paste into a terminal.

Server: 230 Session established
Client: MLSD
Server: 150 Data transfer starting
Data: type=file;size=640; notice.txt
Data: type=file;size=8192; draft.txt
Server: 226 Transfer complete
Client: RETR draft.txt
Server: 550 Access denied

Read it step by step:

1. 230 reports that the session is logged in. The login exchange is absent, so do not invent a successful anonymous login.
2. The two MLSD records list notice.txt and draft.txt, with the sizes reported by the server.
3. 226 completes the preceding listing transfer. It does not complete the subsequent file download.
4. RETR draft.txt is rejected. This record does not obtain draft.txt's contents and does not test writing.

The lesson is that **a visible name, readable contents, and writable files require separate evidence.** A 425 failure to establish the data connection would point to a different investigation than the explicit Access denied shown here. [FTP replies and sequencing](https://www.rfc-editor.org/rfc/rfc959.html), [MLSD listing facts](https://www.rfc-editor.org/rfc/rfc3659.html)

## 6. FTP, FTPS, and SFTP have similar names but are not interchangeable

**TLS (Transport Layer Security)** protects data on a connection. **FTPS** adds TLS to FTP; control-channel and data-channel protection need separate checks. TLS on the control connection does not establish that the data connection is encrypted. PROT P requests TLS protection for the data connection; actual negotiation and settings still need verification. [Securing FTP with TLS](https://www.rfc-editor.org/rfc/rfc4217.html)

**SFTP (SSH File Transfer Protocol)** is a different protocol providing file operations over SSH. SSH provides secure remote connections; the OpenSSH sftp client uses it to transfer data. SFTP is not FTP moved to another port and is not another spelling of FTPS. [OpenSSH sftp manual](https://man.openbsd.org/sftp.1)

After choosing encrypted transport, still verify the peer's identity and file permissions. Encryption protects transmission; it does not decide which files an account should read.

## 7. SMTP is a mail delivery desk: distinguish transfer from submission

**SMTP (Simple Mail Transfer Protocol)** handles email transmission; it is not a protocol for browsing an inbox.

Separate two roles:

- Mail servers transfer messages between servers, commonly over TCP 25.
- A user hands an outgoing message to a sending service through **message submission**, commonly on TCP 587, with user authentication according to service policy.

These roles have different access policies. An external server delivering to a recipient in the local domain is different from forwarding arbitrary senders' mail to arbitrary external domains. [Mail submission and relay roles](https://www.rfc-editor.org/rfc/rfc6409.html)

TCP 465 is also used for mail submission with TLS from the start. TCP 587 commonly uses STARTTLS to upgrade an existing SMTP connection. Determine protection from negotiation and verification, not from a port number alone. [Encrypted mail submission recommendations](https://www.rfc-editor.org/rfc/rfc8314.html)

## 8. SMTP replies disclose capabilities; interpret account clues carefully

**EHLO** introduces the client and requests an extension list. A server may advertise STARTTLS or AUTH.

**AUTH** is the SMTP authentication extension. Seeing AUTH means mechanisms were advertised at that point, not that you logged in. If it is absent, check whether TLS must first be established before it is offered. Supporting an authentication mechanism is not successful authentication. [SMTP authentication extension](https://www.rfc-editor.org/rfc/rfc4954.html)

**VRFY** queries user or mail-address information, while **EXPN** expands a mailing list. Servers may restrict them to reduce disclosure. Keep the complete request, reply code, and text:

- 252: the server has not verified the requested user; this proves neither existence nor nonexistence.
- 550: the request was not accepted; possible causes include a missing mailbox, access restrictions, or policy. Interpret the request and text together.
- 250: a request succeeded; its meaning depends on which step it answers.

For example, accepting a recipient does not complete message transmission. A server may also defer recipient validation. It certainly does not establish that someone read the message or that an address maps to an interactive operating-system account. [SMTP verification commands and replies](https://www.rfc-editor.org/rfc/rfc5321.html)

Replies may include an **enhanced status code**, such as 5.1.1 or 5.7.1, providing a more specific address or policy classification. Preserve these codes for investigation, alongside the implementation and logs. [Enhanced mail status codes](https://www.rfc-editor.org/rfc/rfc3463.html)

## 9. Read a synthetic SMTP record: advertised features are not test outcomes

This is another tabletop example; it sends no mail:

Server: 220 mail.training.example ESMTP
Client: EHLO client.training.example
Server: 250-mail.training.example
Server: 250-STARTTLS
Server: 250 SIZE 10485760
Client: VRFY learner
Server: 252 Cannot verify this user

Record that the endpoint responded with SMTP, advertised STARTTLS and SIZE, and did not verify the user in this VRFY exchange. A hyphen after 250 indicates a continuing multiline reply; the final line uses a space. There is no TLS handshake, login, or mail-submission record here.

STARTTLS in the list establishes only that it was advertised. After a successful TLS upgrade, previous SMTP feature information must be re-established: the client should issue EHLO again because the list may differ. TLS protects this connection segment; it does not automatically establish end-to-end encryption of the entire message from sender to recipient. [SMTP STARTTLS state reset](https://www.rfc-editor.org/rfc/rfc3207.html)

For **open relay** investigation, ask whether an unauthorized source can use the service to forward mail to a destination forbidden by policy. A 220, 250, or VRFY response alone cannot answer that. This lesson does not perform a real forwarding test; that needs separate authorization for test accounts, receiving endpoints, and operations.

## 10. Protection and verification: preserve business use and remove excess permissions

For FTP, establish whether the service is needed, which identities may use it, and how directory and read/write permissions are assigned. Choose appropriate secure transport and limit unnecessary anonymous access. For SMTP, manage submission and relay policies separately, restrict unnecessary account-query disclosures, and require appropriate authentication and transport protection.

For both, use designated test identities to compare allowed and denied operations against policy, corroborated by logs and configuration. Define the resource and action in the verification scope rather than writing “login worked, therefore passed.”

For example, policy may allow visitors to read a public notice but deny draft access. Verify successful reading of the public notice and restrictions on the draft separately. If draft names must also be confidential, their appearance in a listing is another disclosure issue. Denied content access does not erase the need to investigate an exposed name.

Useful records include time and time zone, test source, identity, protocol and encryption state, requested resource/action, complete replies, intended policy, supported conclusions, and unresolved points. Before sharing, redact real passwords, authentication material, and unnecessary personal data.

### Safe tabletop exercise

All you need is this lesson and paper or an offline note. Install no software and issue no network requests.

1. Label which request each result answers in the two records; do not apply success in one step to another.
2. Organize three columns: information obtained, operations completed, and facts not yet established.
3. State the next kind of evidence needed, such as permission configuration, TLS negotiation records, or server logs. Do not perform the tests yet.

The expected output is a bounded evidence table, not a passed system audit. No system was changed, so no restoration is needed; retain your notes.

## 11. One final check

A colleague reads “FTP is logged in, MLSD lists draft.txt, but RETR is denied” and “SMTP VRFY returns 252,” then writes:

“We obtained the draft's contents and confirmed that the learner account does not exist.”

**How would you correct both conclusions in one or two sentences?**

The two protocols share this unit to practise one evidence boundary: what is known, what succeeded, and what remains unproven. The next lesson covers SMB and continues separating shared resources from actual access permissions.
