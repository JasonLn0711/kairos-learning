# M03-02 source check — 2026-11-02 Asia/Taipei

Scope: one composite route unit Host Discovery: ICMP, ARP. Official sources accessed live during preparation; statements are paraphrased, examples synthetic, no target operations.

- RFC 792 https://www.rfc-editor.org/rfc/rfc792 — IPv4 ICMP purpose, Echo Request Type 8 / Reply Type 0, identifier/sequence/data, unreachable and time-exceeded message roles. Historical core spec with updates, not described as newly issued.
- RFC 826 https://www.rfc-editor.org/rfc/rfc826 — IPv4/Ethernet mapping, broadcast request and reply, sender/target fields, cached mappings and aging considerations.
- RFC 1122 https://www.rfc-editor.org/rfc/rfc1122 — host communication requirements, local/remote decision, next-hop address resolution, ICMP conditions.
- RFC 1812 https://www.rfc-editor.org/rfc/rfc1812 — IPv4 router ICMP diagnostic/error role; explains policy review rather than blanket blocking.
- RFC 4861 https://www.rfc-editor.org/rfc/rfc4861 — IPv6 Neighbor Discovery via ICMPv6. Narrow scope mention only; no detailed assertion from later updates.
- Nmap official https://nmap.org/book/man-host-discovery.html — discovery distinct from port scan, -sn purpose and local/privilege variations, -Pn skip-discovery behavior. No executable third-party scan requested.

RFC 4443 returned HTTP 429 and is not used as reviewed evidence. A later RFC792 find timed out; initial complete source read was available, no retry loop.

Original teaching synthesis: office delivery analogy, time/location observation record, hypothetical printer policy case, three synthetic target observations, proposed administrative acceptance criteria. Documentation ranges are examples, not real-world scans or actual measured output.

Review points: ARP identifies next hop on local link; remote IP destination remains while Ethernet destination is gateway. Fresh reply vs old cache distinguished. Echo timeout recorded as observation followed by hypotheses/checks. Proxy ARP explicitly calls for respondent attribution. ICMP/ARP service/identity distinctions expressed affirmatively. Four questions are materials, not user answers.
