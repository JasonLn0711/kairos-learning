# CEH M03-02 | Host Discovery: ICMP and ARP

## 1 | The core idea

Host discovery identifies which network addresses currently respond within an authorized scope, recording the response method, observation point, and time. ICMP helps observe responses related to IP communication. ARP helps find the MAC address of the next IPv4 hop on a local Ethernet network. They answer different questions; together they support clearer asset and connectivity records.

M03-01 separated IP, TCP/UDP, ports, and services. Today we take the preceding step: before investigating which services are available, how do we observe activity associated with an address?

Imagine delivering documents to an office building. You might first call to see who answers, then ask on the same floor which office uses a particular extension. Calling and asking a local contact are two observation methods. Distinguish the person answering, the forwarding switchboard, and the intended recipient. The examples below use a synthetic network and involve no external-device operations.

## 2 | The output: an observation with context

A host is a network endpoint such as a computer, server, or printer. Network devices such as routers may also respond to probes. A probe is a specific message sent to observe a condition; a response is the result received.

A useful record includes:
- Observation point: for example, the authorized test computer and its network segment.
- Target: the specified IP address and asset scope.
- Method: ICMP Echo, ARP, or another approved method.
- Timing: date, time zone, timeout, and retry count.
- Result: response source, type, content, and delay.
- Next step: comparison with the asset register, device records, or an approved service check.

“At 08:00, an ICMP Echo Reply was received from this address from the test network” gives colleagues a more useful starting point than “this machine is definitely healthy.” Device communication, application availability, and login permissions belong to separate layers and separate record fields.

Nmap is a network-discovery tool. Its official documentation describes host discovery as narrowing the targets requiring further investigation and supports discovery across several protocols. [Nmap host discovery](https://nmap.org/book/man-host-discovery.html)

## 3 | ICMP: status reporting for IP networks

ICMP, Internet Control Message Protocol, carries control and diagnostic messages related to IP communication. Think of it as status notifications during delivery.

Three common message types are:
- Echo Request/Echo Reply: a request and corresponding reply used to observe round-trip communication.
- Destination Unreachable: reports a particular delivery problem.
- Time Exceeded: reports an exceeded time limit, such as an exhausted TTL. TTL is the field limiting how many router hops a packet can traverse.

ICMP describes status with message types and codes. TCP and UDP have their own port fields. Read the protocol together with its fields to choose the appropriate interpretation. [RFC 792: ICMP](https://www.rfc-editor.org/rfc/rfc792)

The ping program commonly uses Echo Request and Echo Reply. For IPv4, an Echo Request has Type 8 and an Echo Reply has Type 0. The identifier, sequence number, and data help match replies with requests.

The following is a paper example, not an actual execution result:

Test endpoint → 192.0.2.20: Echo Request, sequence 1
192.0.2.20 → test endpoint: Echo Reply, sequence 1
Round-trip time: 2 milliseconds

RTT, round-trip time, includes sending the message, processing at the other endpoint, and returning the response. A series of results can reveal delay and loss at that time; other times and routes may yield different results. Ping output format also depends on the operating system.

## 4 | Interpret replies and timeouts

A corresponding Echo Reply supports the observation that Echo communication with the address was reachable from this location at this time. If a router returns an unreachable message, record its address and the reported type, then examine routing or policy.

A timeout means the expected response was not received within the configured waiting period. Investigate the relevant possibilities: device sleep, link or route availability, packet loss, and device or firewall response policy. The asset register, endpoint-management records, and other authorized observations help narrow the cause.

For example, a company printer may be printing while management policy disables Echo Replies. Record both “print-service job records are present” and “this Echo probe timed out.” Each describes a different observation.

This is a practical security-analysis habit: record received evidence first, then choose the next verification step. ICMP error generation and delivery have their own conditions. Preserving the timeout status makes subsequent investigation more precise. [RFC 1122: host communication requirements](https://www.rfc-editor.org/rfc/rfc1122)

## 5 | ARP: find the next hop's MAC address locally

Ethernet delivers frames on a local link. A frame carries source and destination MAC addresses. MAC means Media Access Control; a MAC address identifies a network interface on the link.

ARP, Address Resolution Protocol, maps a next-hop IPv4 address to a MAC address in a typical IPv4 Ethernet environment. It resembles asking within a local delivery area: which interface uses this IP address, and what is its delivery address?

Synthetic setting: A and B share a local Ethernet network. A is 192.0.2.10 and B is 192.0.2.20.

1. A needs to deliver data to B and first checks for an existing local mapping.
2. When resolution is needed, A sends an ARP Request asking who uses 192.0.2.20.
3. A typical request is broadcast within the broadcast domain. A device matching the target responds with an ARP Reply.
4. Once A obtains the MAC mapping, it can fill in the Ethernet frame's destination address.

IP addresses inside ARP are query and response fields. ARP itself is carried directly by Ethernet. This differs from carrying ICMP inside an IP packet. [RFC 826: ARP](https://www.rfc-editor.org/rfc/rfc826)

An ARP cache temporarily stores IP-to-MAC mappings. A cache entry may come from earlier communication. A newly received reply and an existing entry represent observations at different times. Device movement, address changes, and cache updates can change the mapping.

## 6 | Local and remote networks: whose address does ARP resolve?

This section connects the previous lesson's IP concepts with ARP.

Assume A is configured as 192.0.2.10/24. Its routing table treats 192.0.2.0/24 as directly connected, and its default gateway is 192.0.2.1. The /24 indicates a 24-bit network prefix. All addresses in this example are planned documentation data for paper-based teaching.

Scenario 1: A sends to 192.0.2.20.

Routing selects the local destination. A resolves the MAC address for 192.0.2.20 and delivers the frame to it.

Scenario 2: A sends to remote address 198.51.100.20.

Routing selects the default gateway as the next hop. A resolves the MAC address for 192.0.2.1. The IP packet still targets the remote destination; the local frame targets the gateway interface. The gateway then forwards according to its routes.

Remember: the destination IP describes where this IP delivery is going; the local destination MAC describes whom this link hands the frame to. Actual next-hop selection follows routing tables, interfaces, and network configuration. [RFC 1122: local/remote decision](https://www.rfc-editor.org/rfc/rfc1122)

Direct ARP discovery therefore applies to the local link. Discovery across routed networks requires an approved method that can reach the target. A VLAN, Virtual LAN, can divide Layer 2 broadcast domains. With proxy ARP, a device answers on behalf of other addresses; verify the responder and the target asset separately when that configuration is present.

IPv6 uses Neighbor Discovery, or ND, with ICMPv6 for functions including neighbor-address resolution. It has its own messages and operating rules. For now, retain the distinction between common IPv4 ARP and IPv6 ND. [RFC 4861: IPv6 Neighbor Discovery](https://www.rfc-editor.org/rfc/rfc4861)

## 7 | Worked example: turn three observations into next steps

All data below is synthetic. Assume authorization to examine three test devices in an isolated laboratory network.

A: 192.0.2.20 responds to ARP on the local network; ICMP Echo times out.
B: 192.0.2.30 responds to both local ARP and ICMP Echo.
C: 198.51.100.20 is on a remote test network; currently only the ARP mapping for local gateway 192.0.2.1 has been found.

For A, record: “An ARP Reply for this IPv4 address was received locally. This Echo attempt timed out. Next, verify device identity, proxy ARP configuration, and ICMP policy.”

For B, record: “Local address resolution and Echo round-trip communication both responded, with time and source recorded. If the task includes service availability, continue with an approved service check.”

For C, record: “The local next-hop gateway's MAC address has been obtained. Activity at the remote target awaits the specified end-to-end check.”

Each record is useful. A separates link-layer responses from Echo policy. B supplies two complementary observations. C shows how far local delivery resolution has progressed.

Tool interpretation follows the same logic. In Nmap, -sn performs host discovery while skipping ordinary port scanning. The actual probes depend on local/remote placement, privileges, protocol, and options. -Pn skips host discovery and allows the specified subsequent checks to proceed against targets. Understand the option's purpose first, then configure it within approved scope. This lesson uses paper interpretation. [Nmap discovery options](https://nmap.org/book/man-host-discovery.html)

## 8 | Controls and verifiable results

For administrators, host discovery connects the devices listed in the asset register with the devices currently observed on the network. Put four practices into operation:

- Clear scope: record allowed networks, sources, times, rates, and stopping conditions. Use administrator-approved low-impact methods for sensitive devices.
- Clear policy: configure ICMP and management access for operational needs and document why required diagnostic messages are permitted. Routers also use ICMP to report certain errors, so policy should support normal communication. [RFC 1812: IPv4 router requirements](https://www.rfc-editor.org/rfc/rfc1812)
- Corroboration: compare probe results with the asset register, switch ports, DHCP leases, or endpoint-management records. DHCP dynamically assigns network settings; leases provide clues about allocation times.
- Evidence: retain source, destination, protocol, time, response, and actions. Refer unusual mappings to the responsible owner for review.

An acceptable result might be: “All three authorized test addresses have current observation records; responsive addresses have been checked against device ownership; timeout cases have investigation questions and owners; testing stayed within approved scope.”

This connects back to M02-08: keep observations, interpretations, and actions separate, and repeat checks under comparable conditions after policy changes.

## 9 | Checks and the takeaway

Answer in your own words first. Reference answers accompany the formal website material.

1. A device on the same local network returns an ARP Reply, but ping times out. How would you record the observation and the next check?
2. A sends to a remote network through its default gateway. Does A use ARP to resolve the remote host's MAC or the gateway's MAC, and why?
3. How should the observation times of an existing ARP cache entry and a newly received ARP Reply be distinguished?
4. An ICMP Echo Reply has been received. If the task is to confirm that a website provides its service correctly, what additional type of check is needed?

The key idea: establish the observation point and next hop before choosing a probe. Record the state represented by a response. Preserve timeout conditions and arrange verification. ICMP helps observe IP communication; ARP performs local IPv4 address resolution.

Next, M03-03 introduces TCP Connect, SYN, and UDP scanning, connecting addresses with activity indications to the responses of their individual ports.
