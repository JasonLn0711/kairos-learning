# M05-07 subsection and translation map

The complete Chinese teaching is preserved byte-for-byte in `original.zh-TW.md`. `teaching.zh-TW.md` changes only the title and eight section headings from bold Markdown to semantic headings. Every other paragraph, list item, example, condition and source link remains unchanged. `teaching.en.md` translates every matching block at equal depth. The generator checks matching ordered block shapes, list counts and reference-answer paragraph counts, and checks all archived source hashes. Editorial review below addresses meaning, not merely counts.

| Supplied teaching | Both-language anchor | Content retained and checked |
| --- | --- | --- |
| Title and opening | page title and opening paragraphs | Previous lesson’s three distinctions; reported/not-reported question; pending verification instead of forced certainty. |
| 一、smoke alarm | section-1 | Fire/steam, dead battery/placement/detection; analogy boundary: vulnerability is not intrusion; Finding and Validation definitions. |
| 二、four outcomes | section-2 | TP example, FP/FN NIST definitions and links, bounded TN; unknown/pending/incomplete/out-of-scope handling statuses; missing inventory alone does not prove FN. |
| 三、false positives | section-3 | Incomplete product/applicability checks; backport definition and vendor link; all four checks; distinction between false positive, patched, mitigated and accepted risk, including timing. |
| 四、false negatives | section-4 | All seven operational causes; business-rule/authorization blind spot; synthetic cross-account fake-order example; capability/scope gap; inventory/capability/authentication/completion/output checks; NIST method and 2008 limitation; correlated tools are not independent confirmation. |
| 五、validation | section-5 | All five steps in full: exact claim and original report; target/time/conditions; claim-specific lower-impact evidence; facts/limits and severity/confidence; treatment, exceptions and review scope; Tenable link; authorization, impact and stop conditions. |
| 六、synthetic cases | section-6 | Explicit fiction/no real CVE/no scan; A: branch r8/r9 and running-at-scan-time evidence; post-scan patch counterfactual; B: incomplete checks, then conditional evidence of FN; C: confirmed vulnerability with scoped mitigation and revalidation; three distinct questions cannot collapse into “closed.” |
| 七、record | section-7 | All five record fields; evidence minimization, aliases, no credentials/tokens/unnecessary personal data; closing versus fixing. |
| 八、exercise | section-8 | Paper/local-only environment; all three steps; traceable record expected output and cleanup; complete three-option quick check and request for evidence; final lesson principle. |
| Separate reference answer | answer-validation | Three answer paragraphs in both languages; incomplete/pending answer; why neither TN nor proven FN; authorized administrative evidence or completing checks; the fourth supplied paragraph is an integration instruction, retained in the original reference-answer files and this adoption record rather than public prose. Native details defaults closed; qa remains empty. |

No new diagram, framework, exploit, scan or teaching scenario is added. No technical claim was substantively changed. Registry migration replaces only the unpublished M05-11 topic with CEH26-M05-C07 immediately after C06; unrelated records are byte-equivalent as JSON values and checked against `registry-before.json`.

Source links are retained from the supplied teaching. The supervising editor opened and checked all five sources in this round; see `sources-reviewed.md`. Integration did not fetch them again, and the 2008 NIST source is not current vendor-interface verification. Browser layout, keyboard and no-JavaScript acceptance remain pending; static checks are separate evidence.

Rendering normalization: emphasis delimiters (`**`) are removed from generated prose because InlineText does not interpret them; all emphasized words remain. Numbered source lists retain their ordered semantics through a validated optional `ordered` boolean and native `ol`; existing lists default to `ul`. This is a bounded model extension, not arbitrary markup.
