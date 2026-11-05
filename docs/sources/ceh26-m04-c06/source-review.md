# Unix/Linux Users and NFS teaching source review

Reviewed: 2026-11-05, Asia/Taipei. This is a proposed public-safe teaching artifact, not proof of publication or learner mastery.

## Scope and identity

- Internal route key: CEH26-M04-C06.
- Existing scope mapping: M04-07 Unix/Linux Users plus M04-08 NFS. Mapping does not authorize renaming or overwriting old IDs, pages or Q&A.
- Chat title intentionally says CEH M04 and “新版第六單元” to avoid treating the legacy M04-06 SMTP ID as equivalent.
- Reuses foundational explanations briefly. Added focus: process versus account-directory identity; name/UID mismatch across hosts; file and directory permissions; NFS owner attributes versus request identity; a concrete UID1001/UID2001 access-control diagnosis.
- One learner check only. Separate answer.zh-TW.md is editorial reference content, intended to be collapsed on the website and never recorded as learner Q&A or an answered assessment.
- No actual lab operation, installation, network query, mount or permission change occurred.

## Source validation

All technical references below were read through live web lookup on 2026-11-05. Linux man7 copies are upstream project manual renderings, not independent commentary; provenance is stated in each page's colophon.

1. GNU coreutils id manual: https://man7.org/linux/man-pages/man1/id.1.html. Explicit user queries a named account; no user queries current process.
2. Linux getent manual: https://man7.org/linux/man-pages/man1/getent.1.html. NSS databases and keyed queries.
3. Linux credentials manual: https://man7.org/linux/man-pages/man7/credentials.7.html. Process UID/GID and supplementary groups.
4. RFC 5531 Appendix A: https://www.rfc-editor.org/rfc/rfc5531.html#appendix-A. AUTH_SYS system identity structure; cryptographic identity claims are not inferred from the numeric values.
5. Linux nfs-utils exports: https://man7.org/linux/man-pages/man5/exports.5.html. Client/export policies, root_squash versus all_squash, server UID/GID interpretation, rw versus file permissions.
6. RFC 8881 §§2.9.3 and 5.9: https://www.rfc-editor.org/rfc/rfc8881.html. Default port 2049, recommendation against RPC binding in NFSv4.1, owner/owner_group name translation distinct from request security principal.
7. Linux path_resolution: https://man7.org/linux/man-pages/man7/path_resolution.7.html. Directory search permission and applicable owner/group/other class; Linux fsuid caveat kept outside beginner lesson.
8. Linux inode: https://man7.org/linux/man-pages/man7/inode.7.html. Mode bit meanings.
9. Red Hat RHEL9 permissions: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/configuring_basic_system_settings/managing-file-system-permissions_configuring-basic-system-settings. File versus directory access and ownership classes.
10. Linux nfs-utils showmount: https://man7.org/linux/man-pages/man8/showmount.8.html. MNT service, -e export query, NFSv4-only limitations.
11. Linux nfs-utils nfs: https://man7.org/linux/man-pages/man5/nfs.5.html. Mount semantics, auxiliary services and Kerberos security flavors.
12. Oracle rpcinfo: https://docs.oracle.com/cd/E88353_01/html/E72487/rpcinfo-8.html. RPC registration query and other options; tool name does not imply all actions are read-only.

The initial GNU website manual requests timed out or were unavailable, so the published lesson uses the upstream manual rendering and Red Hat documentation instead. A POSIX chapter request returned HTTP403 and was not retried or used as evidence.

## Case constraints

- Explicitly synthetic, authorized paper scenario.
- Client and request UID1001; only GID3000. Server-named learner UID2001. File owned by UID2001/GID3000, mode rw-------.
- Server effective request identity, path search, lack of extra ACL/privilege effects explicitly established for the teaching model.
- A same-name account is not the owner identity. Group match cannot grant a missing group read bit. root_squash does not explain this nonzero identity case.
- Mount/list success and file-read denial are separate observations. Other-file access and modification remain untested.
- Actual Permission denied alone would not establish this cause; the lesson requires corroborating identity/configuration evidence.

## Editorial delivery

- teaching.zh-TW.md is chat-ready prose, no HTML/code/table formatting dependencies.
- answer.zh-TW.md is separate; website editor should use its native collapsed reference-answer component, not create fabricated learner Q&A.
- No learner identifiers or private delivery IDs are included in these teaching artifacts.
