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

## answer-integrated-prefix | Integrated case: Range

A /24 has 2^(32 − 24) = 256 addresses, from 192.0.2.0 through 192.0.2.255, including 192.0.2.25. This is the total count; a conventional /24 LAN commonly has 254 host addresses.

## answer-integrated-operator | Integrated case: Operator

AS64496 identifies an AS; routing data supports an origin-AS observation for the prefix. A CDN customer may operate the website. Confirm the operator with an asset inventory, contract or control-panel settings.

## answer-integrated-origin | Integrated case: Origin evidence

A CDN DNS answer normally exposes an entry point. Cross-check owner-controlled DNS/proxy settings, origin configuration, asset inventory and service records; do not infer the origin IP from an edge IP.

## answer-integrated-smb | Integrated case: SMB protection

A standard HTTP reverse proxy does not automatically cover SMB. Check SMB routing, listening interfaces, firewall rules, VPN/private-network access and identity policy separately. Website proxy status alone does not establish safety.
