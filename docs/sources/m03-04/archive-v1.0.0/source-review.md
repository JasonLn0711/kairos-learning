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
