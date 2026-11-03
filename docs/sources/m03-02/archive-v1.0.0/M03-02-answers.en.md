# CEH M03-02 | Reference answers

## answer-arp-timeout | Check 1

Record: “At the specified time and local observation point, an ARP Reply for the IPv4 address was received; this ICMP Echo attempt timed out within the configured wait.” Next, check device ownership, proxy ARP, ICMP policy, and the path. Retain both observations separately and add an approved service check if needed.

## answer-next-hop | Check 2

Resolve the gateway's MAC. Routing selects the default gateway for delivery over this local link, so the frame targets the gateway interface while the IP packet still targets the remote destination. The gateway then forwards toward the next hop according to its routes.

## answer-cache-time | Check 3

For a cached entry, record when it was read and any creation/update time or state the system provides; keep unknown times explicitly pending. For a new ARP Reply, record its actual reception time, source, target, and contents. Preserve them separately to assess the mapping's freshness.

## answer-service-check | Check 4

Perform the website-service checks authorized by the task: for example, examine HTTP/HTTPS connectivity and responses, TLS certificate validation, and expected page functionality. Include login and authorization where relevant. Record the URL, method, time, and result so Echo communication and application availability each have their own evidence.
