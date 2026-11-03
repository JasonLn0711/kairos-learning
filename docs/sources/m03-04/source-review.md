# M03-04 source review
Reviewed 2026-11-02 Asia/Taipei. Primary sources read during this run; paraphrased facts, synthetic examples, no third-party probes.

- https://nmap.org/book/man-port-scanning-basics.html — six state definitions; states describe observation rather than fixed intrinsic property. Sections 2/5 concise synthesis.
- https://nmap.org/book/synscan.html — SYN/ACK, RST, no-response and ICMP classification; section 3.
- https://nmap.org/book/scan-methods-udp-scan.html — UDP response, IPv4 ICMP 3/3, other filtered errors and open|filtered silence; section 4. No exhaustive differing error-code list copied.
- https://nmap.org/book/man-port-scanning-techniques.html — ACK unfiltered classification and method-dependent results, section 5.
- https://nmap.org/book/man-output.html — --reason state rationale verified specifically at lines 60–62; section 7.
- https://www.rfc-editor.org/rfc/rfc9293 — TCP protocol response/reset mechanics; distinctions between received observation and inferred host condition.

Teaching design: building phone analogy, synthetic observation matrix, reporting checklist and administrative acceptance steps are original explanatory synthesis. Existing M03-03 scan methods receive short linking review, not full replay. All state comparisons include method/context. Public artifacts exclude private chat IDs, answers/status, raw classroom notes.

Route checked from current main: M03-04 Open、Closed、Filtered States; next M03-05 Service Version & Banner Grabbing. Schedule rows are plans, not delivery records.

## 2026-11-03 v1.1.0 source replacement

Primary supplied text is preserved verbatim in [teaching-original.txt](supplied-2026-11-03/teaching-original.txt), with SHA-256 in source.sha256.json. The 15 pre-edit source/model/figure/content files are preserved in archive-v1.0.0 from ecd7a81. The 20 existing public/source SVG, ZIP and reviewed model assets remain byte-identical, checked by supplied-2026-11-03/preserved-figures.sha256.json and the unit test. No new reference image was supplied.

Both teaching languages replace sections 1–9 and add section 10 with five conceptual explanations. Coverage includes the extension analogy; protocol-specific port identity; SYN versus ACK RST interpretation; UDP's four outcomes and IPv4 ICMP limits; six states; the synthetic 192.0.2.10 case; listener binding; reproducible reporting; localhost commands; service/access/acceptance controls. Four scenario checks and the retained report-fields check have five reference answers. All four original answer anchors and all visual blocks remain. Conceptual explanations are authored teaching, not learner QA or learner achievement.

Editorial corrections preserve the supplied intent while bounding evidence: SYN/ACK accepts an opening request rather than proving a completed connection; RST can originate at an intermediary; silence cannot identify the drop point; ACK unfiltered is not open; dig may fall back to TCP and therefore needs transport verification; loopback does not traverse an external firewall; reason strings depend on method/platform/version. Placeholder targets are explicitly non-runnable placeholders. IPv4 ICMP codes are not generalized to IPv6.

Rechecked Nmap's official state, ACK and output references above. BIND's official [dig manual](https://bind9.readthedocs.io/en/stable/manpages.html#dig-dns-lookup-utility) supplies the DNS utility reference. Source interpretation, actual localhost execution, browser validation and production publication are separate evidence layers. Detailed results: [release receipt](../../releases/2026-11-03-m03-04-replacement.md).
