"""Apply reviewed bilingual replacements to the dated note, preserving other work.

Each function owns a named section. Add subsequent complete sections here rather
than replacing user text with an abbreviated section-level summary.
"""
import copy,json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/ceh-notes/2026-11-10/reconstruction'
REFERENCES=json.loads((SOURCE/'reference-diagrams.json').read_text(encoding='utf-8'))
PRIOR=json.loads((SOURCE/'prior-published-note.json').read_text(encoding='utf-8'))

class PairedBody:
    def __init__(self):self.text={'zh':[],'en':[]}
    def p(self,zh,en):
        for lang,text in [('zh',zh),('en',en)]:self.text[lang].append({'kind':'paragraph','text':text})
    def h(self,id,zh,en):
        for lang,text in [('zh',zh),('en',en)]:self.text[lang].append({'kind':'paragraph','id':id,'text':text})
    def listing(self,zh,en):
        assert len(zh)==len(en)
        for lang,items in [('zh',zh),('en',en)]:self.text[lang].append({'kind':'list','items':items})
    def table(self,zh,en):
        assert len(zh)==len(en) and all(len(a)==len(b) for a,b in zip(zh,en))
        for lang,rows in [('zh',zh),('en',en)]:self.text[lang].append({'kind':'table','headers':rows[0],'rows':rows[1:]})
    def diagram(self,name):
        ref=next(r for r in REFERENCES if r['text']['zh']['name']==name)
        for lang in ['zh','en']:self.text[lang].append(copy.deepcopy(ref['text'][lang]))
    def prior_figure(self,name):
        for lang in ['zh','en']:
            b=next(b for s in PRIOR['parts'][0]['text'][lang]['sections'] for b in s['body'] if b['kind']=='figure' and b['name']==name)
            b=copy.deepcopy(b)
            if name=='cia':
                labels={'zh':['保密性\n不該看的人不能看','完整性\n資料必須正確可信','可用性\n需要時能正常使用'],
                        'en':['Confidentiality\nPeople without permission must not see the data','Integrity\nData must remain correct and trustworthy','Availability\nUsable when needed']}
                for item,body in zip(b['items'],labels[lang]):item['body']=body
            self.text[lang].append(b)

def cia():
    b=PairedBody()
    b.h('p1-cia-case','1. 先從一個生活情境理解','1. Start with an everyday scenario')
    b.p('假設你經營一家診所，診所使用電腦系統管理病歷。某天發生以下三件事：',
        'Imagine that you run a clinic whose computer system manages medical records. One day, three incidents occur:')
    b.listing([
        '事件 A：一名陌生人偷偷讀取了病人的身分證字號、姓名、病史。',
        '事件 B：一名員工不小心把病人的用藥劑量從 5 毫克改成 50 毫克。',
        '事件 C：診所的資訊系統突然故障，醫師無法讀取病歷。'],[
        "Incident A: a stranger secretly reads a patient's national ID number, name and medical history.",
        "Incident B: an employee accidentally changes a patient's medication dose from 5 mg to 50 mg.",
        'Incident C: the clinic information system suddenly fails, preventing doctors from reading records.'])
    b.listing([
        'A：不應該看到資料的人，看到了嗎？',
        'B：資料有沒有被不當修改？',
        'C：需要使用資料的人，還能不能正常使用？'],[
        'A: did someone who should not see the data gain access to it?',
        'B: was the data improperly modified?',
        'C: can the people who need the data still use it normally?'])
    b.p('這就是資訊安全最基本的三種保護目標。CIA 是 Confidentiality、Integrity、Availability 的縮寫：保密性、完整性與可用性。',
        'These are three fundamental information-security objectives. CIA abbreviates confidentiality, integrity and availability.')
    b.prior_figure('cia')
    b.p('這三個英文單字的安全定義，可回查 [NIST FIPS 199](https://csrc.nist.gov/pubs/fips/199/final)。接下來分別理解每個問題，再用案例判斷題幹的主要影響。',
        'The security definitions are documented in [NIST FIPS 199](https://csrc.nist.gov/pubs/fips/199/final). Next, examine each objective and use scenarios to identify the main impact described by a question.')
    b.h('p1-confidentiality','2. Confidentiality：保密性','2. Confidentiality: controlling access to information')
    b.p('Confidentiality 的意思是：只有被允許的人，才能取得受保護的資訊。想像你把銀行帳戶密碼寫在一張紙上；紙上的密碼沒有被修改，也沒有消失，但有人偷看了它。這就是保密性遭到破壞。',
        'Confidentiality means that only permitted people can obtain protected information. Imagine writing a bank-account password on paper. The password is neither changed nor lost, but someone secretly reads it. Confidentiality has been compromised.')
    b.p('在電腦系統裡，常見的保密性問題包括：',
        'Common confidentiality problems in computer systems include:')
    b.listing([
        '未授權的人讀取客戶資料。',
        '網路封包中的敏感資訊被攔截並讀取。',
        '公司將本應私密的文件錯誤設定為公開。',
        '使用者將機密資料寄給錯誤的收件人。'],[
        'An unauthorized person reads customer data.',
        'Sensitive information in network packets is intercepted and read.',
        'A company mistakenly makes a private document public.',
        'A user sends confidential information to the wrong recipient.'])
    b.table([
        ['英文','中文','白話解釋'],
        ['Confidential','機密的','不是所有人都能看的資訊'],
        ['Unauthorized','未經授權的','沒有被允許做這件事'],
        ['Disclosure','揭露、洩露','資訊被提供給別人'],
        ['Intercept','攔截','在資訊傳遞途中取得它'],
        ['Cleartext / Plaintext','明文','沒有經過適當加密保護、可以直接閱讀的內容'],
        ['Encryption','加密','使用密碼學方法，讓沒有適當金鑰的人難以理解內容']],
        [['English','Meaning','Plain-language explanation'],
        ['Confidential','Restricted information','Information that not everyone is permitted to see'],
        ['Unauthorized','Without permission','Not permitted to perform the activity'],
        ['Disclosure','Revealing information','Making information available to another party'],
        ['Intercept','Obtain in transit','Acquire information while it is being transmitted'],
        ['Cleartext / Plaintext','Readable data','Content that can be read without suitable encryption protection'],
        ['Encryption','Cryptographic transformation','Makes content difficult to understand without the appropriate key']])
    b.h('p1-why-encrypt','為什麼要加密？','Why encrypt?')
    b.p('假設你在網路上傳送一句虛構的教學文字：「我的銀行密碼是 123456」。未加密時，它是明文；使用適當的演算法與金鑰後，內容轉換為密文，再由持有適當金鑰的人依程序解密還原。',
        'Suppose you transmit a fictional teaching sentence: “My bank password is 123456.” Without encryption it is plaintext. An appropriate algorithm and key transform it into ciphertext; someone with the appropriate key can follow the decryption procedure to recover the original.')
    b.diagram('encryption')
    b.p('Encryption（加密）就像把信件放進只有合適鑰匙才能打開的保險箱。這個類比幫助理解存取限制；實際安全性仍取決於密碼方案、模式、金鑰管理與實作。',
        'Encryption resembles putting a letter in a safe that opens only with a suitable key. The analogy explains access restrictions; actual security still depends on the cryptographic scheme, mode, key management and implementation.')
    b.p('TLS（Transport Layer Security，傳輸層安全協定）是 HTTPS 等通訊協定使用的重要安全機制。正確實作與驗證時，它能保護傳輸中的資料機密性及完整性。不是所有資料加密都等於 TLS；用了 HTTPS，也不表示資料在所有儲存及處理環節都安全。',
        'TLS, Transport Layer Security, is an important security mechanism used by HTTPS and other protocols. Correct implementation and validation protect the confidentiality and integrity of data in transit. Data encryption is not always TLS, and HTTPS does not establish that every storage and processing stage is secure.')
    b.h('p1-integrity','3. Integrity：完整性','3. Integrity: preventing improper changes')
    b.p('Integrity 的意思是：資料不能被未經授權或不適當地修改、破壞。例如銀行系統原本記錄「存款餘額：100,000 元」，卻遭未經授權竄改成「存款餘額：900,000 元」。核心問題是資料已經不正確，而不是別人是否看到了資料。',
        'Integrity means protecting data from unauthorized or improper modification or destruction. For example, a bank record showing “Balance: NT$100,000” is changed without authorization to “Balance: NT$900,000.” The central problem is incorrect data, rather than whether someone has read it.')
    b.p('先前筆記的血型案例也相同：病人的血型由 A 型被擅改成 B 型，即使沒有其他人偷看病歷，完整性仍已受損。',
        'The blood-type example from the previous notes illustrates the same principle: changing a patient record from type A to type B without authorization compromises integrity even if no one else reads the record.')
    b.listing([
        'Tampering（竄改）：未經授權修改資料。',
        'Hash（雜湊）：將資料轉換成固定長度摘要值的密碼學機制，常用來比對資料是否變動。',
        'Digital Signature（數位簽章）：利用密碼學機制驗證資料來源與完整性，在適當條件下還能支持不可否認性。'],[
        'Tampering: modifying data without authorization.',
        'Hash: a cryptographic mechanism that maps data to a fixed-length digest, often used to check for changes.',
        'Digital signature: a cryptographic mechanism for verifying data origin and integrity that can also support non-repudiation under appropriate conditions.'])
    b.p('例如下載 Ubuntu ISO 映像檔後，計算檔案的 SHA-256，並與官方網站提供的摘要比較。兩者相同，可以提供檔案內容一致的強力證據；但 Hash 相同不代表檔案一定可信。',
        'For example, after downloading an Ubuntu ISO image, calculate its SHA-256 digest and compare it with the digest provided by the official website. A match provides strong evidence of content consistency, but a matching hash does not by itself make the file trustworthy.')
    b.p('如果攻擊者同時替換檔案與網站上的 Hash 值，你仍可能被欺騙。因此，Hash 檢查內容是否一致；資料來源是否可信，還需要額外的認證機制。存取權限與變更稽核也可以共同保護完整性。',
        'An attacker who replaces both the file and the published hash can still deceive you. A hash checks consistency; trusting the source requires additional authentication. Access controls and change-audit records can also contribute to integrity protection.')
    b.h('p1-availability','4. Availability：可用性','4. Availability: timely and reliable use')
    b.p('Availability 的意思是：有權使用系統的人，需要時能及時、可靠地使用。假設醫院沒有資料外洩，也沒有人改動病歷，但伺服器突然停止運作，醫師無法查詢用藥紀錄，這就是可用性問題。',
        'Availability means that authorized users can use a system promptly and reliably when needed. Suppose a hospital has no data leak or record modification, but its server suddenly stops and doctors cannot retrieve medication histories. This is an availability problem.')
    b.p('先前掛號系統遭阻斷服務攻擊、醫師與病人無法登入的案例，也屬於可用性受損。資料可能未外洩、未被修改，服務仍已無法正常提供。',
        'The earlier example of a denial-of-service attack preventing doctors and patients from logging into an appointment system also concerns availability. Service can fail even when data has neither leaked nor changed.')
    b.table([
        ['名詞','意義','例子'],
        ['DoS（Denial of Service）','阻斷服務','使系統無法正常服務'],
        ['DDoS（Distributed DoS）','分散式阻斷服務','來自多個來源的大量攻擊流量'],
        ['Redundancy','備援','準備額外設備或系統，避免單點故障'],
        ['Backup','備份','保留資料副本以協助復原'],
        ['Disaster Recovery','災難復原','重大事故後恢復服務的能力']],
        [['Term','Meaning','Example'],
        ['DoS (Denial of Service)','Disrupting service','Making a system unable to provide normal service'],
        ['DDoS (Distributed DoS)','Distributed service disruption','Large volumes of attack traffic from multiple sources'],
        ['Redundancy','Additional capacity or components','Extra equipment or systems to avoid a single point of failure'],
        ['Backup','A retained data copy','Keeping copies to support recovery'],
        ['Disaster recovery','Restoring service after disaster','Recovering services after a major incident']])
    b.p('備份主要協助復原資料，不保證服務能立即恢復；系統備援與故障轉移更直接支援持續可用性。流量防護與災難復原也須依服務需求配置及驗證。',
        'Backups mainly support data recovery and do not guarantee immediate service restoration. Redundancy and failover more directly support continuing availability. Traffic protection and disaster recovery also need to be configured and verified against service requirements.')
    b.h('p1-nonrepudiation','5. Non-Repudiation：不可否認性','5. Non-repudiation: evidence when an action is denied')
    b.p('供稿原題還有容易混淆的選項：Non-Repudiation（不可否認性）。假設甲公司與乙公司簽署電子合約，幾個月後，甲公司主張「這不是我們簽署的文件」。問題是：有人事後否認做過這件事，我們有什麼可靠證據可以判斷？',
        'Another potentially confusing option in the supplied question is non-repudiation. Imagine that companies A and B sign an electronic contract. Months later, company A says, “We did not sign this document.” The question is what reliable evidence is available when someone later denies performing an action.')
    b.p('可信的數位簽章、金鑰管理、身分驗證與其他佐證，可支持某個行為確實出自特定簽署者。NIST 將簽章與資料來源認證、完整性及不可否認性連結，但不表示只要有簽章，就能在任何法律爭議中自動確定實際操作的人。',
        'Trusted digital signatures, key management, identity verification and supporting evidence can help attribute an action to a particular signer. NIST connects signatures with data-origin authentication, integrity and non-repudiation; a signature does not automatically identify the actual operator in every legal dispute.')
    b.p('對照 [NIST FIPS 186-5](https://csrc.nist.gov/pubs/fips/186-5/final) 的簽章用途，再讀 [NIST 不可否認性定義](https://csrc.nist.gov/glossary/term/non_repudiation)，可看出技術驗證、金鑰歸屬與其他證據必須配合判讀。',
        'Compare the signature uses in [NIST FIPS 186-5](https://csrc.nist.gov/pubs/fips/186-5/final) with the [NIST definition of non-repudiation](https://csrc.nist.gov/glossary/term/non_repudiation). Technical verification, key attribution and other evidence must be assessed together.')
    b.h('p1-objective-comparison','6. 把四個名詞放在一起比較','6. Compare the four terms')
    b.table([
        ['問題','主要對應'],['秘密資料被偷看','Confidentiality'],['銀行餘額遭到竄改','Integrity'],['伺服器故障無法登入','Availability'],['有人否認自己簽署文件','Non-Repudiation']],
        [['Problem','Primary objective'],['Someone secretly reads confidential information','Confidentiality'],['A bank balance is tampered with','Integrity'],['Server failure prevents login','Availability'],['Someone denies signing a document','Non-repudiation']])
    b.p('真實事件可能同時影響 CIA 多個面向。CEH 單選題通常要求根據題目最直接描述的安全問題，選擇最佳答案；分類是判斷工具，不會把複合事件硬分成互斥情況。',
        'A real incident may affect several CIA objectives. A CEH single-answer question usually asks for the best answer to the most directly described problem. The categories support judgment; they do not make complex incidents mutually exclusive.')
    b.h('p1-q003-reasoning','7. 回到供稿題號 P1-Q003','7. Return to supplied reference P1-Q003')
    b.p('供稿描述一間律師事務所，以電子郵件傳送敏感法律文件。四段英文是主要線索：',
        'The supplied notes describe a law firm sending sensitive legal documents by email. Four English phrases provide the main clues:')
    b.listing([
        'sensitive legal documents：敏感法律文件。',
        'clear text：以明文形式傳輸。',
        'intercepting the traffic：攔截網路流量。',
        'unauthorized individuals ... view：未經授權的人可以查看。'],[
        'sensitive legal documents: the content requires confidentiality.',
        'clear text: the content travels in a readable form.',
        'intercepting the traffic: another party can obtain traffic in transit.',
        'unauthorized individuals ... view: people without permission may read the content.'])
    b.listing([
        '第一步：資料有沒有被修改？供稿題意沒有說。',
        '第二步：系統有沒有不能使用？沒有這項描述。',
        '第三步：有沒有身分或行為否認爭議？沒有。',
        '第四步：資料是否有被未授權者讀取的風險？有，這正是重點。'],[
        'Step 1: was data modified? That is not stated in the supplied scenario.',
        'Step 2: is the system unavailable? No such condition is described.',
        'Step 3: is there an identity dispute or denial of an action? No.',
        'Step 4: could unauthorized people read the information? Yes; that is the central problem.'])
    b.p('供稿參考答案為 B. Confidentiality。要學會的判斷原則是：當核心問題是未經授權取得資訊內容，優先思考保密性；不要只背「看到 clear text 就選 B」。完整原題與所有選項仍以實際題文核對。',
        'The supplied proposed answer is B, Confidentiality. The reusable principle is to think first about confidentiality when the core problem is unauthorized access to information content, rather than memorizing “clear text means B.” The complete original question and all options still require verification against the actual question text.')
    return b.text

def main():
    path=ROOT/'content/ceh-notes/2026-11-10.json';n=json.loads(path.read_text(encoding='utf-8'))
    from ceh_note_part1 import build_part_one
    from ceh_note_part2 import build_part_two
    from ceh_note_part3 import build_part_three
    sections=build_part_one(PairedBody,cia)
    for lang in ['zh','en']:
        for id in ['p1-review','p1-checks']:
            extra=copy.deepcopy(next(s for s in PRIOR['parts'][0]['text'][lang]['sections'] if s['id']==id))
            extra['heading']=('補充複習｜前版三張回憶卡' if id=='p1-review' else '補充練習｜前版三個情境') if lang=='zh' else ('Supplement | Three recall cards from the prior edition' if id=='p1-review' else 'Supplement | Three scenarios from the prior edition')
            sections[lang].append(extra)
        n['parts'][0]['text'][lang]['sections']=sections[lang]
        n['parts'][0]['text'][lang]['title']='第 1 部分｜M01：倫理駭客、CIA 與安全控制完整教學' if lang=='zh' else 'Part 1 | M01: ethical hacking, CIA and security controls in depth'
    second=build_part_two(PairedBody)
    part2={'number':2,'status':'published','publishedOn':n['publishedOn'],'text':{lang:{'title':'第 2 部分｜M01 × M20：治理、清除、加密與憑證信任' if lang=='zh' else 'Part 2 | M01 × M20: governance, sanitization, encryption and certificate trust','sections':second[lang]} for lang in ['zh','en']}}
    n['parts']=[p for p in n['parts'] if p['number']!=2]+[part2]
    third=build_part_three(PairedBody)
    part3={'number':3,'status':'published','publishedOn':n['publishedOn'],'text':{lang:{'title':'第 3 部分｜M20：從加密原理到簽章與題幹判斷' if lang=='zh' else 'Part 3 | M20: encryption, signatures and question reasoning','sections':third[lang]} for lang in ['zh','en']}}
    n['parts']=[p for p in n['parts'] if p['number']!=3]+[part3]
    n['parts'].sort(key=lambda p:p['number'])
    n['text']['zh']['summary']='同日三部分完整觀念筆記：M01 倫理駭客與 CIA、資安治理與營運、資料清除，以及 M20 加密、金鑰建立、雜湊、簽章與憑證信任。保留 27 筆供稿題號、原理推導、案例、歧義判斷與理解練習。'
    n['text']['en']['summary']='Three parts covering M01 ethical hacking and CIA, governance and continuity, sanitization, and M20 encryption, key establishment, hashes, signatures and certificate trust, retaining 27 supplied references, mechanisms, scenarios, ambiguity analysis and understanding exercises.'
    if not any(s['id']=='nist-fips1865' for s in n['sources']):
        n['sources'].append({'id':'nist-fips1865','title':'NIST FIPS 186-5 — Digital Signature Standard','url':'https://csrc.nist.gov/pubs/fips/186-5/final','checkedOn':'2026-11-10'})
    reviewed=[('iso27001','ISO/IEC 27001:2022 — ISMS requirements','https://www.iso.org/standard/27001'),('iso27002','ISO/IEC 27002:2022 — Information security controls','https://www.iso.org/standard/75652.html'),('iso27005','ISO/IEC 27005:2022 — Risk-management guidance','https://www.iso.org/standard/80585.html'),('iso27701','ISO/IEC 27701:2025 — Privacy information management','https://www.iso.org/standard/27701'),('iso22301','ISO 22301:2019 — Business continuity management','https://www.iso.org/standard/75106.html'),('microsoft-soc','Microsoft — Incident response roles and workflow','https://learn.microsoft.com/en-us/defender-xdr/plan-incident-response'),('nist-80088r2','NIST SP 800-88 Rev. 2 — Guidelines for Media Sanitization','https://csrc.nist.gov/pubs/sp/800/88/r2/final'),('schneier-blowfish','Bruce Schneier — Blowfish','https://www.schneier.com/academic/blowfish/'),('schneier-twofish','Twofish designers — algorithm and AES finalist history','https://www.schneier.com/academic/twofish/'),('nist-fips197','NIST FIPS 197 — AES','https://csrc.nist.gov/pubs/fips/197/final'),('sweet32','Bhargavan and Leurent — Sweet32 research','https://sweet32.info/'),('nist-hash','NIST — Cryptographic hash function','https://csrc.nist.gov/glossary/term/cryptographic_hash_function'),('nist-fips1981','NIST FIPS 198-1 — HMAC and migration planning note','https://csrc.nist.gov/pubs/fips/198-1/final'),('rfc9846','IETF RFC 9846 — TLS 1.3','https://datatracker.ietf.org/doc/html/rfc9846'),('rfc5280','IETF RFC 5280 — X.509 certificate profile and validation','https://datatracker.ietf.org/doc/html/rfc5280')]
    reviewed += [('nist-aes-report','NIST — Report on the Development of the AES','https://csrc.nist.gov/pubs/journal/2001/06/report-on-the-development-of-the-aes/final'),('veracrypt-hidden','VeraCrypt — Hidden Volume','https://veracrypt.io/en/Hidden%20Volume.html'),('veracrypt-ram','VeraCrypt — Unencrypted Data in RAM','https://veracrypt.io/en/Unencrypted%20Data%20in%20RAM.html'),('veracrypt-deniability','VeraCrypt — Plausible Deniability','https://veracrypt.io/en/Plausible%20Deniability.html'),('rohos-hidden','Rohos — Encrypted partition with Rohos Mini','https://rohos.com/support/rohos-disk-support/encrypted-partition-with-rohos-mini/'),('nist-80038e','NIST SP 800-38E — XTS-AES confidentiality and authentication boundary','https://csrc.nist.gov/pubs/sp/800/38/e/final'),('rfc8017','RFC 8017 — RSA schemes','https://datatracker.ietf.org/doc/html/rfc8017'),('rfc6979','RFC 6979 — Deterministic DSA/ECDSA','https://datatracker.ietf.org/doc/html/rfc6979'),('nist-80056br2','NIST SP 800-56B Rev. 2 — RSA-based key establishment','https://csrc.nist.gov/pubs/sp/800/56/b/r2/final')]
    reviewed.append(('veracrypt-hidden-requirements','VeraCrypt — Hidden-volume security requirements','https://veracrypt.io/en/Security%20Requirements%20for%20Hidden%20Volumes.html'))
    for id,title,url in reviewed:
        if not any(s['id']==id for s in n['sources']):n['sources'].append({'id':id,'title':title,'url':url,'checkedOn':'2026-11-10'})
    from ceh_note_continuation import adopt_continuation
    adopt_continuation(n)
    from ceh_note_c01_c05 import adopt_c01_c05
    adopt_c01_c05(n)
    from ceh_note_c06_c16 import adopt_c06_c16
    adopt_c06_c16(n)
    from ceh_note_regroup import regroup_notes
    historical, current = regroup_notes(n)
    from ceh_note_controls_risk import adopt_new_material
    adopt_new_material(current)
    from ceh_note_c30_c38 import adopt_c30_c38
    adopt_c30_c38(current)
    current['text']['zh']['summary']='11 月 12 日供稿的 Day 01 知識筆記，依 C01–C38 整理安全基礎、授權、控制、風險管理、SOC、營運持續與治理文件；保留完整案例、判斷練習與既有章節錨點。'
    current['text']['en']['summary']='Day 01 notes supplied on November 12, covering C01–C38: security foundations, authorization, controls, risk management, SOC operations, business continuity and governance documents, with complete cases, reasoning exercises and existing section anchors retained.'
    supplement_sources=[
        ('nist-80061r3','NIST SP 800-61 Rev. 3 — Incident response and CSF 2.0','https://csrc.nist.gov/pubs/sp/800/61/r3/final'),
        ('nist-nice-structure','NIST SP 800-181 Rev. 1 — NICE Framework structure','https://csrc.nist.gov/pubs/sp/800/181/r1/final'),
        ('nist-nice-components','NIST NICE Framework Components — authoritative version change log','https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/current-version/change-logs'),
        ('nist-80034r1','NIST SP 800-34 Rev. 1 — Contingency planning','https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final'),
        ('nist-rto','NIST — Recovery Time Objective','https://csrc.nist.gov/glossary/term/recovery_time_objective'),
        ('nist-rpo','NIST — Recovery Point Objective','https://csrc.nist.gov/glossary/term/recovery_point_objective'),
        ('nist-sla','NIST — Service level agreement','https://csrc.nist.gov/glossary/term/service_level_agreement'),
        ('iso22317','ISO/TS 22317:2021 — Business impact analysis guidance','https://www.iso.org/standard/79000.html'),
        ('nist-controls-oscal','NIST official OSCAL catalog — PL-4 and PS-6','https://raw.githubusercontent.com/usnistgov/oscal-content/main/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json'),
        ('google-metrics','Google — Classification metrics and false positive rate','https://developers.google.com/machine-learning/glossary/metrics'),
        ('us-trade-secret-definition','18 U.S.C. §1839 — Trade secret definitions','https://uscode.house.gov/us/usc/119-124/t18/s1839/'),
        ('us-trade-secret-exceptions','18 U.S.C. §1833 — Confidential disclosure immunity and limits','https://uscode.house.gov/us/usc/119-124/t18/s1833/'),
        ('ba-security-baseline','Bankers Association — Information security protection baseline','https://ba.org.tw/memberStandard/details?id=70'),
        ('owasp-logging','OWASP — Logging Cheat Sheet','https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html')]
    for source_id,title,url in supplement_sources:
        if not any(source['id']==source_id for source in current['sources']):
            current['sources'].append({'id':source_id,'title':title,'url':url,'checkedOn':'2026-11-12'})
    for target, note in [(path, historical), (ROOT/'content/ceh-notes/2026-11-12.json', current)]:
        output=json.dumps(note,ensure_ascii=False,indent=2)+'\n'
        if '--check' in sys.argv:
            assert target.read_text(encoding='utf-8')==output, f'{target.name} differs from reviewed paired source'
        else:target.write_text(output,encoding='utf-8')
    print('Both dated notes: paired chapters, source-mapped supplements, reference diagrams and supplied exercises')
if __name__=='__main__':main()
