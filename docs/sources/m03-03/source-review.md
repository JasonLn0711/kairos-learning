# M03-03 source and editorial review — 2026-11-02 Asia/Taipei

One composite route unit: TCP Connect, SYN and UDP Scanning. All official sources opened live during this run. Examples are synthetic paper exercises, not execution results. No live scanning or traffic to a target was performed.

- https://www.rfc-editor.org/rfc/rfc9293 — TCP standard, typical three-way handshake and SYN/ACK/RST roles. Basic handshake observations are separated from TLS/application/login checks.
- https://nmap.org/book/scan-methods-connect-scan.html — connect system call, completed connections and service logging. Historical statement about IPv6 is deliberately not used; platform/driver/privilege specifics are conditional.
- https://nmap.org/book/synscan.html — -sS SYN/SYN-ACK/RST behavior, reset and timeout/error result mapping, raw-packet privilege requirement. Historic stealth label explained by packet-flow differences rather than guaranteed invisibility.
- https://nmap.org/book/scan-methods-udp-scan.html — -sU, response/open, IPv4 Type3 Code3/closed, other relevant errors/filtered, silence/open|filtered, payload relevance and ICMP rate-limiting effects.
- https://nmap.org/book/man-port-scanning-techniques.html — method-specific interpretation, returned packets and privileges; current manual used alongside older explanatory chapters.
- https://www.rfc-editor.org/rfc/rfc768 — UDP datagram mechanism and absence of TCP handshake. Updates are not described as part of an unreviewed frontier claim.
- https://www.rfc-editor.org/rfc/rfc792 — ICMP error feedback; IPv4 type/code scope explicit.

Original synthesis: office service-window analogy; three evidence layers; synthetic 192.0.2.20 observations; admin verification questions; source/location/time method records; four checks. All prose paraphrased. Sources retained near the associated claim.

Technical review: TCP 53 and UDP 53 distinct; SYN typical half-open process vs full connect; state is viewpoint/method-specific; UDP silence retains uncertainty with next checks; port number not treated as service verification; permission, operational impact and diagnostic follow-up explicit. M03-04 state details remain the next unit.

Privacy review: public manuscripts omit private chat IDs, learner-answer states, email addresses and actual targets. Unanswered checks remain materials, not learner evidence.

## 2026-11-03 v1.1.0 replacement

Primary input: [unchanged supplied text](supplied-2026-11-03/teaching-original.txt), image-1.png and image-2.png in the same directory, with SHA-256 manifest. Prior published teaching, answers, lesson JSON, models, figures and this review are retained under archive-v1.0.0 and compared byte-for-byte with 9ce47d1.

Adoption: sections 2–6 are replaced with the supplied distinctions, mechanisms and uncertainty; sections 7–10 carry the comparison, loopback exercises, security application and three scenarios. Chinese prose is condensed without dropping the main technical branches; English follows the same section structure and numeric conditions. Repeated rhetorical lead-ins, inaccessible sandbox download references and ChatGPT reference markers are omitted from published prose. Original text remains intact in the archive.

Corrections: specify UDP IPv4 filtered codes; distinguish scanner-side and target-side RST; keep NAT outcomes conditional; serve only an empty local directory; place sendto inside the receive loop; add process cleanup. Preserve the original application-check answer and anchor as a fourth reference answer. These are published teaching answers, not learner submissions.

Live reference review on 2026-11-03: Nmap TCP Connect, SYN, UDP and timing/performance official pages confirm the selected mechanisms. Rate limit documentation: https://nmap.org/book/man-performance.html . The web fetcher could not access the learning URL; local source and subsequent deployment readback supply page evidence.

Figures: image 1 becomes adjacent Connect, SYN and UDP figures; image 2 supplies the UDP alternative-state cards and independent source-position paths. HTML keeps selectable labels and reflows the UDP two-column grid on narrow columns. Download SVGs use vertically stacked cards for readable fixed geometry, rather than reproducing the supplied composite raster pixel-for-pixel. Arrow direction and all four UDP states are retained. The old evidence-layer figure remains downloadable, while the page presents the new position comparison. No image-generation or raster-editing step was used.
