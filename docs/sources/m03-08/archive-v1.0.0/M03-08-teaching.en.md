# M03-08｜How firewalls and IDS/IPS affect scans: verifying protection with evidence

## 1. Today's conclusion

A scan result, a device alert, and evidence that a connection was actually blocked are different things. A filtered result initially tells you that this scan could not determine whether the port was open. An alert needs a separate action check. No alert calls for checking whether the sensor could see the traffic at all.

This lesson answers one question: when network defenses affect a scan, how do you distinguish observation, blocking, and uncertainty? The previous lesson covered preserving scan settings and output. Here we connect the scanner's record with protection and service records to construct a verifiable explanation.

## 2. Think of access control, cameras, and security staff

Imagine you are authorized to inspect a building. Door access control determines who may enter. Cameras record people approaching. Security staff can stop a visitor when something is wrong. These are three functions, not a requirement that every building put three devices in a fixed sequence.

- A firewall controls traffic according to policy, like door access control. Policy can consider source, destination, protocol, port, or connection state; capabilities depend on the product and configuration.
- An Intrusion Detection System, or IDS, analyzes activities visible to it and produces alerts, like a camera with notifications. Passive monitoring does not require traffic to pass through the sensor and does not itself establish blocking ability.
- An Intrusion Prevention System, or IPS, can take protective action, such as dropping packets that meet blocking conditions at a point through which traffic passes, like staff who can stop entry.

A packet is a small unit of transmitted network data. Inline means traffic passes through the device; traffic mirroring sends a copy for observation. A product may combine functions. Check placement, operating mode, and rule actions rather than relying on an IDS or IPS label. [NIST firewall guidance](https://csrc.nist.gov/pubs/sp/800/41/r1/final), [NIST IDPS guidance](https://csrc.nist.gov/pubs/sp/800/94/final)

## 3. How a firewall changes the port state you observe

Think of TCP as communication that exchanges acknowledgments to establish a connection. SYN is a flag requesting connection establishment; RST signals a reset or rejection. A scanner infers port states from replies, missing replies, and the scan method.

Common firewall decisions include Allow, Drop, and Reject. Dropping silently can leave the scanner observing only a timeout. Rejecting with a response provides another observable clue. A timeout may also involve packet loss or a return-path problem, so one output line does not identify the device responsible.

- open: under this method and response, the scanner identifies an endpoint accepting the relevant communication. This does not establish a login or access privileges.
- closed: the response supports a conclusion that the endpoint did not accept that connection; remember that an intermediate device can send a TCP RST on its behalf.
- filtered: the scanner cannot determine whether the port is open. It is not a synonym for the service being shut down.
- open|filtered: the two possibilities remain unresolved. The vertical bar means “or,” not that both conclusions have been established.

An internal scan can report open while an external scan of the same service reports filtered. Both records may be correct because their sources and paths differ. An external filtered result alone does not validate the entire firewall configuration. [Nmap port states](https://nmap.org/book/man-port-scanning-basics.html), [Limits of interpreting intermediate responses](https://nmap.org/book/determining-firewall-rules.html)

## 4. Detection, notification, and successful blocking need different checks

A signature is a condition matching a known pattern; an anomaly is a departure from expected behavior. Different rules and baselines may classify the same activity differently. An alert starts an investigation; it does not prove a successful intrusion.

A false positive treats normal activity as an anomaly requiring attention. A false negative misses an anomaly that should have been detected. An authorized scan can still match a scan signature. Authorization does not automatically suppress alerts. Compare the approved source, time, and scope instead of turning off monitoring for convenience.

When reading a rule, find its action. Suricata documentation, for example, describes alert as notification, drop as dropping and alerting, and reject as sending a rejection. Actual effects still depend on operating mode and deployment. A notification titled “scan detected” does not prove that drop occurred. [Suricata rule actions](https://docs.suricata.io/en/latest/rules/intro.html)

Thresholds and notification frequency settings also affect what you see. Limiting repetitive alerts does not necessarily stop packet processing. Check detection conditions, alert limits, and blocking actions separately. One notification does not establish that there was only one packet. This lesson addresses interpretation, not ways to evade thresholds. [Suricata threshold documentation](https://docs.suricata.io/en/latest/rules/thresholding.html)

Both Suricata pages were labeled 9.0.0-dev when checked: development documentation. This lesson does not assume that your device runs that version. Verify actual syntax and behavior against the installed version.

## 5. With no alert, check visibility and recording gaps first

Visibility means the activities a sensor can actually observe. A camera watching the front entrance cannot establish that nothing happened at the rear entrance. Similarly, traffic can take a different path, mirrored traffic can be incomplete, sensors or log delivery can fail, and encryption can prevent direct inspection of application content.

Start with four questions: which path did the traffic take? Is sensor data actually available there? Was the relevant rule enabled and applicable? Did its alerts reach the interface you are inspecting? Attach a time and source to each answer rather than recording “no attack” from an empty screen.

In production, coordinate visibility improvements with the administrator. Do not independently decrypt others' communications, change routing, or disable protection to gain visibility. NIST's IDPS guide provides background on sensor placement and detection limits. Its final edition is from 2007; the later 2012 revision draft was retired, not issued as a new final standard. [NIST publication status and context](https://csrc.nist.gov/pubs/sp/800/94/final)

## 6. Worked example: one test service, two sources

All records below are original synthetic tabletop material, not your devices or actual scan output. No third-party target was tested. Suppose an administrator approves comparing TCP 8443 on a test service in an isolated lab. The expected policy is “management network allowed; test external network denied.” Both tests use the same method at nearby times. No commands for real targets are supplied.

- 09:00: test computer A in the management network reports open; the service has a corresponding connection record.
- 09:02: computer B on the test external network reports filtered; the boundary firewall records dropping B's packets to the service and identifies rule FW-17.
- 09:02: the monitoring console reports “suspected port probing,” with action alert.
- 09:02: no corresponding connection from B is found in the service records. The query period and record source have been checked, while the limits of record completeness remain noted.

Write observations first: A can reach the service; B did not receive a response resolving the port state; the firewall logged denying passage; the console raised an alert. Then write the inference: these matching records support FW-17 blocking B's test traffic, rather than the IDS alert itself doing so.

A defensible conclusion is: “For these sources, times, method, and TCP 8443, the results match the expected internal permission and external restriction.” Do not expand it into “all ports are safe,” “the IPS is fully effective,” or “there was no intrusion.”

If B's filtered result is all you have, with no firewall or service evidence, leave the cause unresolved. If firewall time differs by minutes or source addresses have been translated, check time zones, clock synchronization, and Network Address Translation (NAT) before concluding that records concern the same traffic.

## 7. Defensive work: reduce exposure, preserve detection, verify outcomes

Scan protection is more than hiding results. First inventory services with a business purpose and sources that need them. Administrators can then disable unnecessary services, restrict required entry points, and maintain patching and authentication. Preserve availability too: checking that external traffic is blocked is insufficient if legitimate users cannot work.

A usable verification plan specifies approved sources, destination services, time window, allowed methods, expected allow and deny outcomes, stop conditions, responsible people, and recovery. If the goal is detection validation, retain normal detection settings. If a deliberate test exception is introduced, record it separately rather than treating its results as normal protection capability.

Organize the evidence in this order: approved scope and expected policy → original scanner results → protection rules and actions → service records → bounded conclusion. This is an investigative workflow, not an assertion about the order of devices on the packet path.

A simple record can capture test time and zone, source and destination, protocol and port, tool version and settings, actual responses, protection rule and action, service records, gaps, and next steps. De-identify before sharing; retain real addresses, accounts, and detailed logs within their authorized scope.

## 8. Safe exercise: read the synthetic records only

Your environment is this lesson and a blank note. No tool installation, device scan, or configuration change is needed.

First, label each record in section 6 as scanner, protection, or service evidence. Second, identify which record supports a blocking action and which supports only notification. Third, write a conclusion bounded by source, time, service, and conditions, then name one item still needing verification.

The expected outcome is an explanation traceable to records, not a claim that the entire system is secure. Keep your exercise note afterward. Because no service or environment was changed, there is no system cleanup step and no reason to delete production records.

## 9. Quick checks

1. B reports filtered and the IDS shows alert. Do these establish that “the IDS blocked the connection”? What additional evidence would you seek?
2. A reports open and B reports filtered for the same TCP endpoint. Why need neither record be wrong?
3. With no alerts, name two observation or logging issues to check first.
4. What is wrong with a test plan that disables protection for all test traffic and then claims to validate protection?

Start by answering question 1 in your own words. The remaining questions and reference answers stay with the lesson. Reference answers are not your submitted answers, and unanswered checks do not establish understanding.

Sources checked: 2026-11-04. The cited Nmap online pages do not establish an installed version for this lesson's environment; no scan was executed. NIST 800-41 Rev.1 dates to 2009 and the final 800-94 to 2007. They provide principles, not a claim to be current product configuration guides.
