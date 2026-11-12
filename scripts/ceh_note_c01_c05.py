"""Apply the complete reviewed C01–C05 replacement without removing exam reasoning."""
import copy,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/ceh-notes/2026-11-10/c01-c05-replacement-2026-11-12'
def adopt_c01_c05(note):
 for lang in ['zh','en']:
  adopted=json.loads((SOURCE/f'adopted.{lang}.json').read_text())
  sections=note['parts'][0]['text'][lang]['sections']
  sections[:]=[s for s in sections if not s['id'].startswith('p1-c01-')]
  prior=next(s for s in sections if s['id']=='p1-cia')
  prior['heading']='補充｜既有 CIA 案例與原題判讀' if lang=='zh' else 'Supplement | Earlier CIA cases and exam-reference reasoning'
  index=next(i for i,s in enumerate(sections) if s['id']=='p1-cia')
  sections[index:index]=copy.deepcopy(adopted)
 note['revision']=6;note['contentVersion']='1.3.0';note['revisedOn']='2026-11-12'
 sources=[
 ('taiwan-trade-secrets','Taiwan Trade Secrets Act, Article 2','https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080028'),
 ('tipo-secrecy','TIPO — Trade secret FAQ','https://www.tipo.gov.tw/tw/tradesecrets/242.html'),
 ('taiwan-esign','Taiwan Electronic Signatures Act','https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080037'),
 ('bank-internal-control','FSC banking internal-control rules','https://law.fsc.gov.tw/LawContent.aspx?id=FL049894'),
 ('epa-security-20260929','Electronic payment security-control guidelines, September 29, 2026','https://epa.org.tw/uploads/regulations/pdfs/01M47H2X8FK89E4RTGBCPV9WSW.pdf'),
 ('epa-repealed','FSC — Repealed electronic-payment security regulations','https://law.fsc.gov.tw/LawContent.aspx?id=GL001541'),
 ('ba-electronic-banking','Bankers Association — Electronic banking security controls','https://www.ba.org.tw/memberStandard/details?id=79'),
 ('ba-electronic-signature-index','Bankers Association — Electronic business standards index','https://www.ba.org.tw/memberStandard/index?cid=13'),
 ('semi-e187','SEMI — E187 and E188 equipment security','https://www.semi.org/en/standards-watch-2024-mar/how-semi-e187-and-e188-standards-elevate-cybersecurity'),
 ('tsmc-protection','TSMC — Customer information protection, 2024','https://esg.tsmc.com/en-US/articles/298'),
 ('tsmc-2023-report','TSMC 2023 annual report — customer information protection','https://investor.tsmc.com/static/annualReports/2023/english/pdf/2023_tsmc_ar_e_ch5.pdf'),
 ('nist-csf2','NIST CSF 2.0','https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf'),
 ('nist-cleartext','NIST — Cleartext','https://csrc.nist.gov/glossary/term/cleartext'),
 ('nist-nonrepudiation','NIST — Non-repudiation','https://csrc.nist.gov/glossary/term/non_repudiation'),
 ('california-security','California Civil Code 1798.81.5 — official statutory locator','https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.81.5.'),
 ]
 for id,title,url in sources:
  if not any(s['id']==id for s in note['sources']):note['sources'].append({'id':id,'title':title,'url':url,'checkedOn':'2026-11-12'})
