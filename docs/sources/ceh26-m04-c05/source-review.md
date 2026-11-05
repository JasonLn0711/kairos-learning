# NetBIOS / RPC source and editorial review

Checked 2026-11-05 (Asia/Taipei). This is a synthetic tabletop lesson. No target was contacted, no attack tool installed, and no network configuration changed.

## Sources actually read

The official pages linked from the manuscripts were opened and their relevant content inspected, rather than treating the existence of a URL as verification. Microsoft pages displayed a generic authorization notice alongside readable article content; the observations below use the returned article text, with no authentication bypass.

- RFC 1001: NetBIOS API and operation over TCP/UDP; naming, datagram and session roles.
- Microsoft MS-BRWS §2.1.1: 16-byte name notation, padding and suffix. MS-NBTE Appendix A: the 00 UNIQUE workstation, 20 UNIQUE file-server and 00 GROUP domain conventions; these are Windows conventions, not universal device identification.
- Microsoft direct-hosting article: TCP/UDP 137, UDP 138, TCP 139, direct SMB TCP 445, and legacy interoperability cautions. No-response on 137 is insufficient to infer absence on 445.
- Microsoft nbtstat parameter table: /n local, /c cache, /a remote name, /A remote IP; /R purges/reloads and /RR releases/refreshes. Commands were read, not executed.
- Microsoft RPC_IF_ID: UUID plus major/minor interface version. Finding Endpoints: well-known/dynamic TCP and named-pipe endpoints. The older example range 1025–5000 on that page is not adopted as a modern default.
- Microsoft current service overview: TCP 135 and dynamic 49152–65535, configurable service-specific requirements. No blanket firewall opening recommendation is adopted.
- Microsoft MS-RPCE version/capability negotiation: interface/transfer-syntax binding negotiation. RPC security essentials distinguishes identity and authorization topic families. Discovery and bind do not establish operation-specific authorization; this is the lesson's evidence inference, not a measured test result.
- Samba rpcclient manual: ncacn_np and ncacn_ip_tcp transports, explicit endpoint choices, and mutating subcommands. Tool name alone does not guarantee read-only behavior.
- RFC 5531: ONC RPC program/version/procedure fields; RFC 1833: rpcbind/portmapper and port 111. Oracle rpcinfo manual: registration-query role and other options. These are separate from Microsoft RPC UUID mapping.
- RFC 8881 §2.9.3: registered port 2049 as default and SHOULD NOT use the RPC binding protocols for NFSv4.1. This does not remove RPC itself.

All formal source URLs are retained adjacent to their claims in both manuscripts. Timeouts, clues, mappings and permissions remain distinct; the synthetic port 50020 and interface 1.0 are not real observations or CVE evidence.

## Explicit public presentation changes

The exact two supplied inputs are preserved as original-teaching.zh-TW.md and original-answer.zh-TW.md with SHA-256. XML transport escaping of angle brackets is decoded to the supplied visible text; files use UTF-8 and final newline.

1. Convert the title and seven bold section headings to Markdown headings for the existing sourceBody parser. Keep wording and sequence.
2. Replace the personal delivery/review opening with the neutral “本單元簡短複習 NetBIOS 名稱表與 RPC 端點，再練習分辨”.
3. Remove only “教材交付與理解確認分開記錄；” from the last paragraph. Keep the offline exercise, cleanup statement and next C06 topic.
4. Put the answer title in the native disclosure summary instead of duplicating it inside the answer. Retain its complete two paragraphs.
5. Rendering removes Markdown bold delimiters, groups adjacent list items, and displays the three numbered definitions as a parallel native list. Wording, order and numerical claims remain. Complete English matches all seven sections, paragraph/list-item counts, conditions and conclusions.

No learner answer is invented; qa remains []. C04 and C06–C10 remain pending; C05 does not require the C04 branch. Legacy M04 source/Q&A/SVG remain outside publication output. No shared renderer or AASE content is changed.

Apply WRITE-01–07, HTML-01–04 and A11Y-01–03. FIG and INT computation are not applicable: no figures, assets, downloads or computation are added. Validation and deployment evidence belongs in the release receipt, not in learner progress.
