# M02-06 Reference Answers

## answer-local-prefix | Local prefix practice

192.0.2.0/24 contains256 addresses, from192.0.2.0 through192.0.2.255, including192.0.2.25. Changing to192.0.2.128/25 gives128 addresses from192.0.2.128 through192.0.2.255. The address .25 lies outside that range, so membership isFalse. These are total range counts.

## answer-address-count | Check one: prefix size

Answer C:256. IPv4 has32 bits; /24 fixes24 prefix bits and leaves8, producing2 to the power of8 address combinations.24 is the prefix length;128 corresponds to a /25; a single IPv4 address can be expressed as /32.

## answer-asn-role | Check two: ASN role

Answer B: an autonomous routing system. An ASN identifies an AS. Account and related evidence establish user identity, URLs describe web resources, and TCP ports identify transport service endpoints. Separate fields clarify each role.

## answer-missing-reply | Check three: stars

A suitable record is: “None of the three hop-two probes received an expected response within the waiting period; hop four returned a destination response.” Investigate response filtering or rate limiting using lab-device configuration and logs. Keep the observation and possible cause in separate fields.

## answer-service-correlation | Check four: service relationship

Preserve:①DNS results with query time and resolver;②RDAP registration and prefix/ASN routing records with their data times;③owned cloud or CDN settings linking the domain, edge proxy, backend and asset owner. These connect names, network resources and service administration. Retain original sources and verification times.
