"""Generate complete bilingual M05-02/03 within the existing sourceBody contract.

Chinese source files preserve delivered teaching verbatim. Canonical text removes
Markdown emphasis, normalizes heading markup, and removes one conversational
bridge from M05-02; no instructional content is omitted.
"""
from pathlib import Path
import json,re,sys
R=Path(__file__).resolve().parents[1]
META={
'02':{
 'summary':{'zh':'先盤點要保護的資產，再確認本次評估對象、授權與限制，讓結果不超出證據範圍。','en':'Inventory the assets to protect, then confirm assessment targets, authorization and limits so conclusions stay within the evidence.'},
 'answer':{'zh':['先把該資料庫記成已觀察到的依賴與待確認項目，保留發現來源；不要因為看得到位址就掃描、登入或讀取資料。','對照授權清單並聯繫指定負責人，確認是否需要正式擴充範圍；只有相關授權與限制確認後才進一步測試。現有報告清楚標示資料庫未評估，不推論整個系統安全。'],'en':['Record the database as an observed dependency and an item requiring confirmation, retaining the source of the observation. Seeing its address does not authorize scanning, signing in or reading data.','Check the authorization list and consult the designated contact about whether scope should be formally expanded. Test further only after relevant authorization and restrictions are established. Mark the database as unassessed in the current report, rather than concluding that the whole system is secure.']},
 'supplement':{'zh':'練習預期產出：一張區分資產、獲准範圍、排除目標與停止條件的小表。只使用合成資訊；保留紙上筆記即可，沒有系統變更需要復原。','en':'Expected exercise output: a small table distinguishing assets, authorized scope, exclusions and stop conditions. Use only synthetic information; keep the tabletop notes, with no system changes to undo.'},
 'source':{'zh':'來源查核：2026-11-08。CIS Control 1 為現行官方網頁；NIST SP 800-115 是 2008 年正式版，本課採用其評估規劃原則，不當作最新工具操作指南。','en':'Sources checked: 2026-11-08. CIS Control 1 is the current official webpage. NIST SP 800-115 is the 2008 final publication; this lesson uses its assessment-planning principles, not a current tool manual.'}},
'03':{
 'summary':{'zh':'分清弱點成因與評估維度，依問題選擇檢查方法，並把掃描線索、已確認條件與安全影響分開。','en':'Separate vulnerability causes from assessment dimensions, choose methods that fit the question, and distinguish scan leads, verified conditions and security impact.'},
 'answer':{'zh':['應補上應用程式授權與業務邏輯評估，先確認政策，再在隔離且獲授權的條件下，用合成帳號與假訂單核對存取邊界。','版本掃描主要檢查它能辨識的版本與已知條件，不能涵蓋所有自訂邏輯。跨帳號取得訂單若違反政策，是另一類具體證據；不能用「未找到已知版本漏洞」抵銷。仍須記錄角色、條件、觀察與限制，不把案例推論為過去已遭入侵。'],'en':['Add assessment of application authorization and business logic. Confirm the policy first, then check access boundaries using synthetic accounts and fake orders in an isolated, authorized setting.','A version scan primarily checks the versions and known conditions it can identify; it cannot cover every custom logic rule. Cross-account order access that violates policy is separate concrete evidence and is not negated by finding no known version vulnerabilities. Record roles, conditions, observations and limits without inferring a past intrusion.']},
 'supplement':{'zh':'練習預期產出：三列問題分類、證據缺口與評估方法的對照表。全程使用合成資訊，未執行真實環境測試；保留筆記即可，沒有安裝或系統變更需要清理。','en':'Expected exercise output: three rows comparing problem categories, evidence gaps and assessment methods. Use synthetic information throughout; no real-environment test has been performed. Keep the notes, with no installation or system changes to clean up.'},
 'source':{'zh':'來源查核：2026-11-08。OWASP 弱點頁為現行官方社群文件；NIST SP 800-115 是 2008 年正式版，內外部視角見 §2.4.1，主被動網路探索見 §4.1。分類表為本課教學整理，不是假稱官方唯一分類。','en':'Sources checked: 2026-11-08. The OWASP vulnerability page is current official community documentation. NIST SP 800-115 is the 2008 final publication: internal/external viewpoints appear in §2.4.1, and active/passive network discovery in §4.1. The categories are this lesson’s teaching organization, not a claim of one official taxonomy.'}}
}
def clean(s):return s.replace('**','')
def parse(n,lang):
    suffix='zh-TW' if lang=='zh' else 'en'
    source=(R/f'docs/sources/m05-{n}/teaching.{suffix}.md').read_text().strip()
    chunks=re.split(r'\n\s*\n',source)[1:]
    blocks=[]; section=0
    for chunk in chunks:
        if n=='02' and lang=='zh':chunk=chunk.replace('接著我會給你 M05-03。','')
        heading=chunk.startswith('## ') or (chunk.startswith('**') and chunk.endswith('**') and '\n' not in chunk and not chunk.startswith('**資產在'))
        # Inline emphasized opening sentences remain paragraphs, not headings.
        if heading and (chunk.startswith('## ') or clean(chunk).startswith(('一、','二、','三、','四、','五、','六、','七、','五分鐘','小檢核'))):
            section+=1; blocks.append(dict(kind='heading',id=f'section-{section}',text=clean(chunk[3:] if chunk.startswith('## ') else chunk)));continue
        lines=chunk.splitlines();pending=[];items=[]
        def flush():
            if pending:blocks.append(dict(kind='paragraph',text=clean('\n'.join(pending))));pending.clear()
            if items:blocks.append(dict(kind='list',items=[clean(i) for i in items]));items.clear()
        for line in lines:
            if line.startswith('- '):
                if pending:blocks.append(dict(kind='paragraph',text=clean('\n'.join(pending))));pending.clear()
                items.append(line[2:])
            else:
                if items:blocks.append(dict(kind='list',items=[clean(i) for i in items]));items.clear()
                pending.append(line)
        flush()
    assert section==({'02':8,'03':9}[n]),(n,lang,section)
    # Explicit exercise outcome and provenance supplement the preserved lesson.
    blocks += [dict(kind='paragraph',text=META[n]['supplement'][lang]),dict(kind='paragraph',text=META[n]['source'][lang])]
    blocks.append(dict(kind='answer',id=f'answer-m05{n}',summary='參考答案與解析' if lang=='zh' else 'Reference answer and explanation',paragraphs=META[n]['answer'][lang]))
    return dict(summary=META[n]['summary'][lang],sections=[],sourceBody=blocks)
def generate(n):
    result=dict(id=f'CEH26-M05-C{n}',revision=1,contentVersion='1.0.0',date='2026-11-08',status='published',publishedOn='2026-11-08',qa=[],text={lang:parse(n,lang) for lang in ['zh','en']})
    shape=lambda l:[(b['kind'],len(b.get('items',[])),b.get('id')) for b in result['text'][l]['sourceBody']]
    assert shape('zh')==shape('en'),(n,shape('zh'),shape('en'))
    return result
if __name__=='__main__':
    for n in META:
        p=R/f'content/concepts/ceh26-m05-c{n}.json'; data=json.dumps(generate(n),ensure_ascii=False,indent=2)+'\n'
        if '--check' in sys.argv:assert p.read_text()==data
        else:p.write_text(data)
