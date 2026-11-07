# M03-04 | Quick-check reference answers

## answer-observation-location | 1. One entry point, different locations

The two results describe access conditions for different sources: the management subnet's SYN probe receives a response accepting a connection, while probes from the other subnet show filtering. If policy permits only the management subnet, this is a lead for further validation. Add two categories of evidence: first, the service's listening and binding settings; second, firewall allow/deny rules and logs from the same period. Compare the source, time, and method together to check whether the results match the design.

## answer-response-states | 2. RST and UDP silence

A TCP SYN probe receiving RST is commonly classified as **closed**. A UDP probe still receiving no response after retries is commonly classified as **open|filtered**: the service may respond only to correctly formatted data, while path filtering can also produce silence. Preserve the original response evidence and test conditions, then check service and firewall records.

## answer-ack-followup | 3. The next step after unfiltered

An ACK scan's unfiltered result means that this probe receives a response; its focus is filtering behavior. Next, within the approved scope, use an appropriate method such as TCP SYN or Connect to observe whether a service accepts connections, and compare the device's listening settings. To establish the application's purpose, follow with an approved application-layer check.

## answer-report-fields | 4. Complete the verification record

Add at least four items, such as the target IP address and approved purpose, source subnet, time and time zone, UDP scan method and tool version, waiting/retry settings, probe data format, original no-response output and classification reason, listening settings and DNS logs, or firewall rules and logs. Retain UDP 53's transport protocol and port number, and identify the next approved service-format query and responsible person so others can reproduce the test and continue the work.
