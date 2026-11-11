"""Prepare inspectable editorial data; never publish incomplete translations."""
import json,re,hashlib
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/ceh-notes/2026-11-10/reconstruction'

def reference(name,part,image,caption,description,items):
    return {'part':part,'reference':image,'text':{lang:{'kind':'diagram','name':name,'caption':caption[index],'description':description[index],'items':[{'title':i[index][0],'body':i[index][1]} for i in items]} for index,lang in enumerate(['zh','en'])}}

def figures():
    return [
      reference('overview',1,1,['三個問題，建立資安地圖','Three questions build a security map'],['先界定保護目標，再選控制措施，最後以授權測試驗證；箭頭表示學習與設計順序。','Define protection goals, choose controls, then verify them through authorized testing. Arrows show learning and design order.'],[
        [('我們要保護什麼？','CIA：保密性、完整性、可用性'),('What are we protecting?','CIA: confidentiality, integrity and availability')],
        [('要怎麼保護？','Security Controls：實體、技術、管理控制'),('How do we protect it?','Security controls: physical, technical and administrative')],
        [('怎麼知道保護有效？','Ethical Hacking：經授權測試、找漏洞、改善風險'),('How do we verify protection?','Ethical hacking: authorized testing, vulnerability discovery and risk reduction')]]),
      reference('encryption',1,3,['加密與解密：由明文到密文，再還原','Encryption and decryption: plaintext, ciphertext and recovery'],['密文只示意呈現形式，並非實際加密計算結果。銀行密碼是虛構教學資料；實際加密另需適當模式與金鑰管理。','The ciphertext illustrates a representation, not an actual encryption result. The bank password is fictional teaching data. Real encryption also requires a suitable mode and key management.'],[
        [('原始資料：明文 Plaintext','我的銀行密碼是 123456'),('Original data: plaintext','My bank password is 123456')],
        [('使用加密演算法與金鑰 → 密文 Ciphertext','7F A2 9C 41 ...\n示意字串，非實際加密結果'),('Encryption algorithm and key → ciphertext','7F A2 9C 41 ...\nIllustrative bytes, not an actual encryption result')],
        [('使用適當金鑰解密','還原原始內容'),('Decrypt using the appropriate key','Recover the original content')]]),
      reference('defense',1,4,['五層縱深防禦','Five layers of defense in depth'],['以機密資料系統為例。箭頭表示逐層閱讀，不表示所有攻擊都必須依序通過五層；各層共同處理不同失敗情況。','A confidential-data system example. Arrows indicate reading order, not a path every attack must follow. The layers address different failure conditions together.'],[
        [('第 1 層｜Physical','保全、門禁與機房管制'),('Layer 1 | Physical','Security guards, access control and server-room restrictions')],
        [('第 2 層｜Identity','身分驗證、MFA 與權限限制'),('Layer 2 | Identity','Authentication, MFA and permission restrictions')],
        [('第 3 層｜Network','防火牆與網路區隔'),('Layer 3 | Network','Firewalls and network segmentation')],
        [('第 4 層｜Data','加密、資料存取控制'),('Layer 4 | Data','Encryption and data access controls')],
        [('第 5 層｜Detection & Recovery','監控、備份、復原與事件應變'),('Layer 5 | Detection & Recovery','Monitoring, backup, recovery and incident response')]]),
      reference('hats',1,5,['白帽、黑帽與灰帽：先看授權與目的','White, black and grey hats: authorization and purpose'],['三列是角色比較，不是先後流程。動機、授權、實際行為與適用法律須一起判斷；帽子名稱不構成法律豁免。','The rows compare roles, not consecutive steps. Consider motive, authorization, actual conduct and applicable law together; a hat label provides no legal exemption.'],[
        [('White Hat（白帽駭客）','在有效授權範圍內執行安全測試，目的是找出並改善安全問題。\n例子：公司聘請資安顧問進行滲透測試。'),('White hat','Tests security within valid authorization to find and improve security problems.\nExample: a company hires a security consultant for a penetration test.')],
        [('Black Hat（黑帽駭客）','通常為竊取、破壞或其他惡意目的，未經授權侵害系統。\n例子：入侵公司資料庫，偷取客戶帳號。'),('Black hat','Typically compromises systems without authorization for theft, damage or another malicious purpose.\nExample: breaking into a company database to steal customer accounts.')],
        [('Grey Hat（灰帽駭客）','可能沒有直接惡意或獲利目的，卻在缺乏授權時測試。\n例子：未經同意驗證網站漏洞，之後才通知站長。'),('Grey hat','May lack a directly malicious or profit motive but tests without authorization.\nExample: verifying a website vulnerability without consent, then notifying its owner.')]]),
      reference('roe',1,6,['虛構案例：公司的滲透測試約定','Fictional example: penetration-testing agreement'],['192.0.2.0/24 是保留供文件與教學使用的位址範圍；192.0.2.11 不會因鄰近而自動納入授權。','192.0.2.0/24 is reserved for documentation and teaching. The neighboring 192.0.2.11 does not automatically enter the authorized scope.'],[
        [('測試範圍','192.0.2.10 伺服器'),('Scope','The 192.0.2.10 server')],
        [('測試日期','星期六 10:00–14:00'),('Testing time','Saturday, 10:00–14:00')],
        [('允許方式','指定的安全性驗證活動'),('Permitted methods','The specified security-verification activities')],
        [('禁止事項','DoS、擅自刪除資料、超範圍存取'),('Prohibited activities','DoS, unauthorized data deletion and out-of-scope access')],
        [('事件通報','發現系統異常立即通報指定窗口'),('Incident reporting','Immediately report system abnormalities to the designated contact')]]),
      reference('testing',1,7,['從安全測試到降低風險','From security testing to risk reduction'],['五個步驟依序連接；修補由負責團隊執行，再以複測驗證改善。單次測試未發現漏洞，不代表系統完全安全。','The five steps connect in order. The responsible team remediates findings, followed by retesting. Finding no vulnerability in one test does not establish complete security.'],[
        [('取得授權','確認能測哪些系統及活動'),('Obtain authorization','Confirm which systems and activities may be tested')],
        [('找出弱點','辨識可能的安全漏洞'),('Find weaknesses','Identify potential security vulnerabilities')],
        [('驗證影響','在限制內確認弱點是否可被利用'),('Verify impact','Determine within the agreed limits whether a weakness is exploitable')],
        [('提出報告','說明證據、影響與修補建議'),('Report findings','Explain evidence, impact and remediation recommendations')],
        [('修補與複測','由負責團隊修補，再確認改善是否有效'),('Remediate and retest','The responsible team fixes the issue, then verifies whether the improvement works')]]),
      reference('decision',1,8,['先辨認問題，再找決定性線索','Identify the question, then find decisive clues'],['四個分支是平行分類。真實事件可同時涉及多類問題；單選題依題幹要求的主要問題選擇。','The four branches are parallel categories. A real incident can involve several categories; choose according to the main issue asked by a single-answer question.'],[
        [('駭客角色','Authorization / Permission\nWhite Hat、Grey Hat、Black Hat'),('Hacker role','Authorization / Permission\nWhite hat, grey hat, black hat')],
        [('資訊受到什麼影響','Read / Modify / Unavailable\nConfidentiality、Integrity、Availability'),('Impact on information','Read / Modify / Unavailable\nConfidentiality, integrity, availability')],
        [('安全控制種類','Physical / Technical\nSecurity Guard、Firewall 等'),('Control category','Physical / Technical\nSecurity guard, firewall and related controls')],
        [('安全測試目的','Goal / Primary purpose\n找出漏洞、降低風險'),('Testing purpose','Goal / Primary purpose\nFind vulnerabilities and reduce risk')]]),
      reference('hash',2,9,['不同內容通常產生不同的 Hash','Different content usually produces different hashes'],['兩個輸入平行比較；摘要 A／B 是概念標籤，未顯示實際 SHA-256 結果。碰撞在數學上存在，安全性要求是難以找到可利用的碰撞。','The two inputs are compared in parallel. Digest A/B are conceptual labels, not computed SHA-256 results. Collisions exist mathematically; security requires that exploitable collisions be difficult to find.'],[
        [('輸入 A','病人血壓：120\n↓ SHA-256\n產生摘要 A'),('Input A','Patient blood pressure: 120\n↓ SHA-256\nProduces digest A')],
        [('輸入 B','病人血壓：180\n↓ SHA-256\n產生摘要 B（通常不同於 A）'),('Input B','Patient blood pressure: 180\n↓ SHA-256\nProduces digest B, usually different from A')]]),
      reference('compare',2,10,['Encryption 與 Hashing 的方向不同','Encryption and hashing have different directions'],['加密設計有對應的解密程序；雜湊沒有解密操作。低熵輸入仍可能被逐一猜測及計算摘要比對，這是猜輸入，不是解密。','Encryption has a corresponding decryption procedure; hashing has no decryption operation. Low-entropy inputs can still be guessed and hashed for comparison. That is guessing an input, not decrypting a digest.'],[
        [('Encryption｜加密','明文\n↓ 使用演算法與金鑰\n密文\n↑ 使用適當金鑰可還原明文'),('Encryption','Plaintext\n↓ Algorithm and key\nCiphertext\n↑ The appropriate key can recover the plaintext')],
        [('Hashing｜雜湊','原始資料\n↓ 雜湊函數\n摘要\n沒有對應的解密操作'),('Hashing','Original data\n↓ Hash function\nDigest\nNo corresponding decryption operation')]]),
      reference('tls',2,11,['TLS 1.3：憑證式 ECDHE 連線的簡化時序','TLS 1.3: simplified certificate-based ECDHE exchange'],['實線箭頭表示瀏覽器送往伺服器；虛線箭頭表示伺服器回覆，並非「未加密」。橘框表示本機計算或驗證。省略 EncryptedExtensions、金鑰排程細節、用戶端憑證與其他分支；這不是封包擷取。Certificate 起的伺服器交握訊息受交握金鑰保護。','Solid arrows mean browser-to-server messages; dashed arrows mean server replies, not unencrypted traffic. Orange boxes indicate local computation or validation. EncryptedExtensions, key-schedule details, client certificates and other branches are omitted; this is not a packet capture. Server handshake messages from Certificate onward are protected with handshake keys.'],[
        [('ClientHello + key_share','瀏覽器提供支援參數與公開金鑰分享值。'),('ClientHello + key_share','The browser offers supported parameters and a public key share.')],
        [('ServerHello + key_share','伺服器選定參數，回覆其公開金鑰分享值。'),('ServerHello + key_share','The server selects parameters and returns its public key share.')],
        [('各自計算共享祕密並導出金鑰','ECDHE 與 HKDF 建立交握金鑰；後續依金鑰排程導出應用流量金鑰，不直接傳送共享祕密。'),('Compute a shared secret and derive keys locally','ECDHE and HKDF establish handshake keys. The key schedule later derives application traffic keys; the shared secret is not sent directly.')],
        [('Certificate','伺服器傳送憑證鏈，提供公鑰與身分／網域綁定資料。'),('Certificate','The server sends its certificate chain, carrying public-key and identity/domain binding information.')],
        [('CertificateVerify','伺服器以簽章證明持有對應私鑰，並綁定交握內容。'),('CertificateVerify','A signature proves possession of the corresponding private key and binds the handshake transcript.')],
        [('Finished（伺服器）','以交握祕密與交握內容驗證值，確認此次交握。'),('Finished (server)','A verification value based on handshake secrets and the transcript authenticates this handshake.')],
        [('驗證憑證、網域、簽章與 Finished','瀏覽器檢查信任鏈、名稱、期限與適用限制等；失敗時不繼續可信連線。此框彙整驗證責任，非精確執行時間。'),('Validate certificate, domain, signature and Finished','The browser checks the trust chain, name, validity and applicable constraints. Failure prevents continuing a trusted connection. This box groups validation responsibilities rather than prescribing exact execution timing.')],
        [('Finished（瀏覽器）','瀏覽器完成其交握確認；本例省略用戶端憑證驗證。'),('Finished (browser)','The browser sends its handshake confirmation; client-certificate authentication is omitted in this example.')],
        [('加密的 HTTP Request','用應用流量金鑰與 AES-GCM 等 AEAD 保護請求。'),('Encrypted HTTP request','Application traffic keys and an AEAD such as AES-GCM protect the request.')],
        [('加密的 HTTP Response','伺服器以其方向的流量金鑰保護回覆；CA 不參與每次交握。'),('Encrypted HTTP response','The server protects its reply with traffic keys for its direction. The CA does not participate in every handshake.')]])
    ]

def parse_source(part):
    """Lossless paragraph/table/code staging, with line ranges for editorial checks."""
    source=SOURCE/f'pasted-text-{part}.txt'
    lines=source.read_text(encoding='utf-8').splitlines()
    units=[];i=0
    def add(kind,start,end,**values):
        units.append({'key':f'p{part}-l{start+1}','lines':[start+1,end], 'kind':kind,**values})
    while i<len(lines):
        line=lines[i]
        if not line.strip():i+=1;continue
        start=i
        if line.startswith('```'):
            fence=re.match(r'`+',line)[0];i+=1
            while i<len(lines) and lines[i].strip()!=fence:i+=1
            if i<len(lines):i+=1
            add('code',start,i,text='\n'.join(lines[start:i]));continue
        if re.match(r'^#{1,4} ',line):
            i+=1;add('heading',start,i,level=len(line)-len(line.lstrip('#')),text=line.lstrip('# '));continue
        if line.startswith('|'):
            i+=1
            while i<len(lines) and lines[i].startswith('|'):i+=1
            add('table',start,i,text='\n'.join(lines[start:i]));continue
        while i<len(lines) and lines[i].strip() and not (i>start and (lines[i].startswith(('#','```','|')))):i+=1
        add('paragraph',start,i,text='\n'.join(lines[start:i]))
    # Every nonblank source line belongs to exactly one staged unit.
    owned=[j for u in units for j in range(u['lines'][0]-1,u['lines'][1]) if lines[j].strip()]
    assert owned==[j for j,s in enumerate(lines) if s.strip()]
    return {'part':part,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'status':'editorial staging, not published content','units':units}

if __name__=='__main__':
    for part in range(1,4):
        data=parse_source(part)
        (SOURCE/f'part-{part}-source-units.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        print(f'Part {part}: {len(data["units"])} units, all nonblank source lines accounted for')
    data=figures()
    (SOURCE/'reference-diagrams.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'{len(data)} paired reference diagrams prepared; CIA uses the existing paired figure contract')
