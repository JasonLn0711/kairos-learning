# SMB evidence review

Checked 2026-11-05 (Asia/Taipei). This is an original synthetic review and diagnostic case, not an official exam item or an executed network test.

## Main question and editorial scope

Readers distinguish share-name visibility, connection to a share, individual file operations, session identity and actual transport protection. This unit reviews existing fundamentals and adds refusal-stage diagnosis and the separation of supported, required and actually used protection. All laboratory names, account roles and file names are synthetic. The single check does not require running commands.

## Primary references reviewed

- [Microsoft SMB overview](https://learn.microsoft.com/en-us/windows-server/storage/file-server/file-server-smb-overview): network file/resource access; protocol support does not identify a specific operating system.
- [Microsoft SMB connection failures](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/negotiate-session-setup-tree-connect-fails): Negotiate, Session Setup and Tree Connect are separate diagnostic stages. Old-version remediation examples are not adopted as current prescriptions.
- [Microsoft Access Denied guidance](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/access-denied-access-smb-file-share): identify the cause before changing security requirements. Authentication, signing and encryption policy can matter alongside permissions.
- [Samba smbclient manual](https://www.samba.org/samba/docs/current/man-html/smbclient.1.html): -N suppresses a password prompt, -L lists services, ls lists directory entries, and get downloads to the local machine. Options are requests, not evidence of success.
- [Microsoft SMB signing](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-signing): message integrity and identity assurance are distinct from content confidentiality.
- [Microsoft SMB security](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security): encryption capability, configuration and actual use are different claims. SMB transport encryption does not prove at-rest encryption or correct file authorization.
- [Microsoft Set-SmbShare](https://learn.microsoft.com/en-us/powershell/module/smbshare/set-smbshare?view=windowsserver2025-ps): access-based folder enumeration filters display of files and folders; it does not replace the permissions that govern access.

The public reference pages were readable through source retrieval. Generic sign-in banners were present on Microsoft Learn pages alongside accessible article text; no sign-in was performed. This review does not assert deployed-product version or real-system testing.

## Evidence boundaries

The lab record explicitly states the established identity, operation-specific results, negotiated SMB 3.1.1, signing in use, no SMB-layer encryption, and untested writes/deletions. Share-connect refusal does not establish internal file presence or file-level permissions. One read success is limited to that operation and object. ABE's display scope and actual access checks are kept separate. The response is an editorial reference answer and does not populate learner Q&A.

## Publication and preservation

Use the existing sourceBody model, short-slug resolver and publication gate. The public introduction and recap remove personal learning-state framing; all technical content and sequence remain. Existing M04 archives remain recoverable and excluded from output. C05–C10 remain pending. Follow WRITE-01–07, HTML-01–04 and A11Y-01–03. FIG/INT interactive computation is not applicable to this text-only review. Automated evidence, visual/browser checks and deployment confirmation must be recorded separately.
