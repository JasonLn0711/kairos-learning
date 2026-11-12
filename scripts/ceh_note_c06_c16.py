"""Adopt complete reviewed C06–C16 chapters while preserving earlier note content."""
import copy,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/ceh-notes/2026-11-10/c06-c16-supplement-2026-11-12'
def adopt_c06_c16(note):
 for lang in ['zh','en']:
  adopted=json.loads((SOURCE/f'adopted.{lang}.json').read_text())
  sections=note['parts'][0]['text'][lang]['sections']
  sections[:]=[s for s in sections if not s['id'].startswith('p1-c06-')]
  index=next(i for i,s in enumerate(sections) if s['id']=='p1-c01-integration')+1
  sections[index:index]=copy.deepcopy(adopted)
 note['revision']=7;note['contentVersion']='1.4.0';note['revisedOn']='2026-11-12'
 sources=[
 ('nist-testing','NIST SP 800-115 — Technical security testing','https://csrc.nist.gov/pubs/sp/800/115/final'),
 ('nist-ot','NIST SP 800-82 Rev. 3 — OT security','https://csrc.nist.gov/pubs/sp/800/82/r3/final'),
 ('owasp-bola','OWASP API1:2023 — Broken Object Level Authorization','https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/'),
 ('owasp-athz','OWASP WSTG v4.2 — Authorization bypass testing','https://wstg.owasp.org/v4.2/4-Web_Application_Security_Testing/05-Authorization_Testing/02-Testing_for_Bypassing_Authorization_Schema/'),
 ('owasp-disclosure','OWASP — Vulnerability disclosure','https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html'),
 ('doj-cfaa-policy','DOJ Justice Manual 9-48 — CFAA charging policy','https://www.justice.gov/jm/jm-9-48000-computer-fraud'),
 ('us-cfaa','18 U.S.C. 1030 — CFAA','https://uscode.house.gov/us/usc/119-124/t18/s1030/'),
 ('taiwan-criminal-code','Taiwan Criminal Code, Articles 358–360','https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=C0000001'),
 ('semi-certification','ACW — Taiwan SEMI E187 certification scheme','https://www.acw.org.tw/Certification/Default.aspx?subID=1069'),
 ('ore-blue-hat','ORE Catapult — Cyber Security and Autonomous Systems, Table 7','https://cms.ore.catapult.org.uk/wp-content/uploads/2025/05/PN844-RPT-006_WP4-Cybersecurity-and-Autonomous-Systems-Report_Rev2.pdf'),
 ('eset-hacker','ESET — Hacker terminology','https://help.eset.com/glossary/en-US/hacker.html'),
 ('microsoft-bluehat-meaning','Microsoft — BlueHat terminology clarification, 2006','https://www.microsoft.com/en-us/msrc/blog/2006/03/bluehat-hackers/'),
 ('ba-supply-chain','Bankers Association — ICT and service supply-chain risk rules','https://www.ba.org.tw/memberStandard/details?id=66'),
 ]
 sources += [('mitre-'+t.lower(),'MITRE ATT&CK — '+t,'https://attack.mitre.org/techniques/'+t+'/') for t in ['T1190','T1078','T1498','T1499','T1041']]
 for id,title,url in sources:
  if not any(s['id']==id for s in note['sources']):note['sources'].append({'id':id,'title':title,'url':url,'checkedOn':'2026-11-12'})
