# M03-08 Reference answers

## answer-blocking｜Alerts and blocking

No. Filtered is the scanner's unresolved port-state result; alert is a notification action. Seek protection-action records matching the time, source, destination, and port, such as Drop under rule FW-17, and compare service and path evidence. This can support which control blocked the traffic, without claiming protection for all traffic.

## answer-viewpoint｜Different observation points

Scan states depend on source, path, time, and method. An internal source may be allowed while an external one is restricted, so both results can be correct. Check comparable targets, methods, and times before comparing source policies. Neither record substitutes for the other.

## answer-visibility｜No alerts

Check whether the traffic passed a location visible to the sensor and whether alerts reached the queried console. Other valid checks include rule enablement, time window, mirrored-data completeness, and sensor health. No alert describes the records currently found; it does not prove no scan or intrusion occurred.

## answer-exception｜Changed test conditions

Disabling protection changes the conditions being evaluated. It may help establish service connectivity, but cannot validate the original protection. Retain separately approved testing under normal settings, including expected allow and deny cases, and document exceptions, impact, and verified recovery.
