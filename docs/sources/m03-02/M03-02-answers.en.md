# CEH M03-02 | Reference answers

## answer-arp-timeout | Check 1

Record: “At the specified time and local observation point, an ARP Reply for the IPv4 address was received; this ICMP Echo attempt timed out within the configured wait.” Next, check device ownership, proxy ARP, ICMP policy, and the path. Retain both observations separately and add an approved service check if needed.

## answer-next-hop | Check 2

Resolve the gateway's MAC. Routing selects the default gateway for delivery over this local link, so the frame targets the gateway interface while the IP packet still targets the remote destination. The gateway then forwards toward the next hop according to its routes.

## answer-cache-time | Check 3

For a cached entry, record when it was read and any creation/update time or state the system provides; keep unknown times explicitly pending. For a new ARP Reply, record its actual reception time, source, target, and contents. Preserve them separately to assess the mapping's freshness.

## answer-service-check | Check 4

Perform the website-service checks authorized by the task: for example, examine HTTP/HTTPS connectivity and responses, TLS certificate validation, and expected page functionality. Include login and authorization where relevant. Record the URL, method, time, and result so Echo communication and application availability each have their own evidence.

## answer-nas-dsm | Check 5

Both can occur together. Four Echo Replies establish successful ICMP round trips in this test. DSM is a separate application service that may be stopped, misconfigured, or restricted by access policy. Record source, target, time, and both results, then check DSM connectivity and service state within authorized scope.

## answer-printer-policy | Check 6

Echo filtering, packet loss, or a return-path issue are possible, but each needs verification. Record: “At the specified time and source, four Echo probes with the recorded options received no expected Echo Replies; a separate observation shows successful printing in the same period.” The records describe ICMP and printing separately. Corroborate ICMP policy and device records next.

## answer-remote-frame | Check 7

A. The destination IP is 203.0.113.20. B. The first frame targets the MAC mapped to gateway 192.168.1.1. C. Routing selected that gateway as the local next hop, so ARP resolves it; ordinary ARP broadcasts do not cross routers. Obtaining the gateway's MAC alone does not prove remote reachability.

## answer-arp-lab-timeout | Integrated scenario 8: timeout evidence

Ping timeouts alone do not establish that B is powered off. Record source, target, time, options, and the absence of expected Echo Replies. Corroborate printing or management records, ICMP policy, routes, and link state. An ARP Reply claiming a mapping for B is separate local-address information whose source and device ownership still need verification.

## answer-arp-lab-reply | Integrated scenario 9: interpret ARP and Echo separately

ARP resolves local IPv4/MAC mappings; ICMP Echo carries IP diagnostic messages. Policy or device behavior can allow ARP while suppressing Echo Replies, so the observations can coexist. Proxy ARP or forged replies can also claim a mapping for B. Check switch records, assets, and proxy configuration rather than authenticating B from that reply alone.

## answer-arp-lab-route | Integrated scenario 10: read the selected route first

The question specifies a route to C through 192.168.10.1, so resolve the MAC for 192.168.10.1. A usable cached mapping may be reused. C, 10.20.30.40, is remote; ordinary ARP broadcasts do not cross routers to ask C. If the actual selected route differs, reason from that result rather than always assuming the default gateway.

## answer-arp-lab-frame | Integrated scenario 11: two destinations and delivery evidence

The destination IP is C’s 10.20.30.40. The first frame’s destination MAC belongs to the selected gateway’s local interface, mapped to 192.168.10.1. Those fields describe first-link encapsulation but do not prove that C received the data. Routers continue selecting routes and re-encapsulating for subsequent links; remote delivery and service success require their own observations.
