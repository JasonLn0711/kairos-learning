# CEH M03-03 | Reference answers

## answer-connect-syn | Check 1

Connect lets the operating system send ACK and complete the typical handshake; the tool then ends the test connection after obtaining its result. A SYN scan normally sends RST after SYN+ACK, ending the attempt and interpreting that initial response as open. Retain the method and actual packet or system results for each.

## answer-udp-silence | Check 2

A listening service may reply only to suitable requests, or a firewall may filter the probe or return traffic. Packet loss and error-message rate limiting are additional factors to investigate. Preserve open|filtered and review payload, waits, retries, policy, and service records.

## answer-application-check | Check 3

Add application-service evidence. For HTTPS, check the TLS channel and certificate result, then the HTTP response and expected page content. Include login or authorization checks when the task requires and authorizes them. Record time, method, and result at each layer.

## answer-test-conditions | Check 4

Compare at least three of: source location/network, time, TCP versus UDP, destination port, scan method, tool version, wait/retry settings, rate, and payload. Also check NAT/proxy paths and contemporaneous firewall/listener settings. Establish comparable conditions and retain the differences and raw responses for investigation.
