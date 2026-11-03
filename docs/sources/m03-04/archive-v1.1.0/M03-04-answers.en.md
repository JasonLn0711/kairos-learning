# M03-04 scenario reference answers

## answer-response-states | 1. RST in response to SYN

A. Typically closed. B. It does not establish that the server is powered off; the scanner received an explicit reply, whose host or intermediary source still needs verification. C. Check whether HTTPS started, its actual listening port and bind address, firewall rules and contemporaneous logs. Retain the method, source and RST. By comparison, UDP silence after retries typically remains open|filtered.

## answer-udp-uncertainty | 2. Two candidates for UDP 53

A. DNS is not definitely running. B. A blocking firewall is not established either. The service might ignore invalid content; request/reply filtering, loss or error rate limiting can also contribute. C. Send an authorized valid DNS query, confirm it actually uses UDP, and compare responses, listeners, DNS logs and firewall logs. -sV can improve identification but may leave uncertainty.

## answer-observation-location | 3. Management and ordinary networks

A. There is no contradiction: the results describe different sources and paths. B. They match initial expectations if policy allows only management. C. Confirm the same endpoint, time and method, and compare service binding, firewall allow/deny rules and contemporaneous logs. Use actual connections and application permissions to establish usable access. One filtered result does not prove every restriction works.

## answer-ack-followup | 4. ACK Scan unfiltered

A. You cannot directly classify it as open. B. ACK scanning examines filtering of that probe; both open and closed endpoints can return RST. C. Use an approved SYN or TCP Connect scan to observe acceptance of new connections, then compare listeners. Application functionality requires a separate check.

## answer-report-fields | Retained exercise: complete the record

Add at least four items, such as target IP and authorized purpose, source network, time and timezone, UDP method and tool version, waits/retries, payload format, raw output and reasons. Retain UDP 53's protocol and port, and add service/DNS/firewall records, an approved next query and an owner so another engineer can reproduce and continue the work.
