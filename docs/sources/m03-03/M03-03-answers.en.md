# M03-03 scenario reference answers

## answer-connect-syn | SYN flow and RST direction

Classify it as open because the target returned SYN+ACK. The final RST comes from the scanner side and ends the attempt; the final ACK of an ordinary three-way handshake was not sent. The scanner's OS may generate this RST, so the flag alone does not establish target refusal.

## answer-udp-silence | Possible causes of UDP silence

You cannot conclude DNS is stopped. The service may ignore an invalid payload, a firewall may drop the request, or a reply may be lost on its return path; ICMP error rate limiting can also increase waiting results. Retain open|filtered and add an authorized valid DNS query, a corresponding UDP reply, packet capture, and listener settings or service logs. Service detection may narrow uncertainty, but further silence still does not establish closure.

## answer-test-conditions | Internal/external observations and SSH exposure

Both results can hold. Source policies, routing, NAT/port forwarding, proxies or load balancers can change the path and response. Confirm both tests address the same endpoint, record source, time, protocol, port and method, then check public addresses and IPv4/IPv6 endpoints, forwarding rules, firewalls and SSH bind addresses. Retest from approved external positions and compare logs. A single filtered result supports only that source and time; it does not establish closure across all external paths.

## answer-application-check | Website functionality (retained check)

Add application-service evidence. For HTTPS, check the TLS channel and certificate result, then the HTTP response and expected page content. Include login or authorization checks when the task requires and authorizes them. Record time, method, and result at each layer.
