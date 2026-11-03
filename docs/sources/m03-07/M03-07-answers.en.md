# M03-07 reference answers

## answer-scope | Do two ports represent the whole host?

No. The evidence covers the specified source, time, TCP method and ports 8000/8001. Other TCP ports, UDP and other observation positions are outside this record. Write “Neither of the two specified TCP ports was observed open in this test,” and list the untested scope. Do not convert that into a host-wide absence of services.

## answer-discovery | What do -sn and -Pn do?

-sn performs host discovery without a port scan. -Pn skips the usual discovery decision and places specified targets into subsequent scanning. Neither option by itself is evidence of liveness; inspect actual responses and classification reasons. -Pn neither makes a powered-off device alive nor automatically passes a firewall. Local operation can still involve ARP address resolution.

## answer-features | What should be checked before adding -A?

Check whether the approved purpose covers version detection, OS identification, default scripts, traceroute and the associated target, load, timing and stop conditions. -A expands the feature set, rather than merely increasing the accuracy of the same two-port connection test. It is not a timing template. If the goal is only endpoint connectivity, retain the minimum necessary method.

## answer-comparison | How should open and filtered be compared?

Keep both raw results with source position, time, target, protocol, port, method, version and warnings. Compare firewall and service logs to investigate path or condition differences. Open supports accepting connections as observed by that test; filtered means the test could not determine whether the port was open. Before verification, do not rewrite the difference as service shutdown or successful intrusion.
