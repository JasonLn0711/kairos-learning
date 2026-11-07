# M04-10 source and adaptation record

This draft answers one question: how can an administrator demonstrate both necessary access and effective restrictions, rather than equating silence with security?

- Stable identity: `CEH26-M04-C10`; public slug `m04-10`; display label `M04-10`.
- [Complete Traditional Chinese public manuscript](teaching.zh-TW.md) and [complete English counterpart](teaching.en.md).
- [Paragraph-level mapping](source-map.json): all 76 source paragraphs, including title, mapped to public wording, complete English and an anchor. The ten sections and six service subsections preserve all mechanisms, examples, conditions and evidence limits.
- [Hashes](source-hashes.json) identify the preserved original and the public adaptations. The exact supplied original remains in the authorized private source archive. Private delivery wording and learner identifiers are not copied to public Git.
- The final exercise paragraph makes the original three steps explicit. The final paragraph replaces private future-response instructions with a public reference-answer disclosure boundary. No actual learner response is supplied; `qa=[]`.
- `scripts/m04_10_content.py` generates the paired sourceBody and adds one original reference answer. It does not change the source renderer or mark learning complete. Draft and future-date gates remain unchanged.
- No figure is added: the independent checks and policy/evidence comparisons are fully expressed in selectable prose and lists. No network operation, account change or write test is required.

## Official-source review — 2026-11-07

The source-review task live-read the following official pages and checked the claims below. This record describes document review, not a lab test or universal product default. Links remain next to the claims in both full manuscripts.

| Source | Checked claim and scope |
| --- | --- |
| [NIST SP 800-171 Rev. 3](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/800-171r3/NIST.SP.800-171r3.html), 03.04.06, 03.03.02–03.03.03 | Minimum necessary functionality and relevant audit records/review. The publication's CUI remit is not presented as a universal regulatory mandate. |
| [NIST least privilege](https://csrc.nist.gov/glossary/term/least_privilege) | Permissions limited to necessary work. |
| [NIST SP 800-40 Rev. 4](https://csrc.nist.gov/pubs/sp/800/40/r4/final) | Patch identification, prioritization, acquisition, installation and verification. Downloading is not proof of application. |
| [Microsoft SMB traffic](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-secure-traffic) | Restrict unnecessary boundary traffic while accounting for architecture and dependencies. |
| [Microsoft access control](https://learn.microsoft.com/en-us/windows/security/identity-protection/access-control/access-control) | Effective rights, groups, inheritance and resource rules. Account names do not prove permissions. |
| [Microsoft SMB security](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security) | Signing and encryption have distinct purposes; transport protection does not establish file-at-rest protection. |
| [RFC 4513 §5.1.3](https://www.rfc-editor.org/rfc/rfc4513.html#section-5.1.3) | Name/password simple bind needs confidentiality protection; check actual TLS and server identity. |
| [RFC 5936 §5](https://www.rfc-editor.org/rfc/rfc5936.html#section-5) | AXFR authorization is separate from ordinary public name queries. |
| [RFC 959 §4.1.3](https://www.rfc-editor.org/rfc/rfc959.html#section-4.1.3) | Directory listing, retrieval and storage are separate operations. |
| [RFC 5321 §7.3](https://www.rfc-editor.org/rfc/rfc5321.html#section-7.3) | VRFY/EXPN disclosure controls do not eliminate every account clue. |
| [RFC 8881 §6](https://www.rfc-editor.org/rfc/rfc8881.html#section-6) | NFSv4.1 file access-control attributes; no cross-version blanket claim. |
| [RFC 3414 §1.3](https://www.rfc-editor.org/rfc/rfc3414.html#section-1.3) | USM authentication/privacy do not define object access. Historical algorithms are not recommended here. |
| [RFC 3415 §2.5](https://www.rfc-editor.org/rfc/rfc3415.html#section-2.5) | VACM read/write views separately constrain objects. |
| [OpenLDAP 2.6 access control](https://www.openldap.org/doc/admin26/access-control.html) | Entry/attribute/requester rules and evaluation order matter; no-rule is not blanket deny. Defaults are not transferred to Active Directory. |
| [RFC 8633 §3.4](https://www.rfc-editor.org/rfc/rfc8633.html#section-3.4) | Restrict management queries while preserving approved time service. |

Technical review preserves the distinction between network ACLs and service permissions, and adds direct FTP/NFS references already present in the supplied teaching. The Finance share, lookup-demo account, privateNote attribute and training-only value are synthetic, not observations of a real organization.

[Release and remaining acceptance gates](../../releases/2026-11-07-m04-10-countermeasures-draft.md)
