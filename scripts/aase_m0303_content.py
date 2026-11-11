"""Generate the bilingual M03-03 lesson from preserved editorial manuscripts."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/aase/m03-03/replacement-2026-11-11'
IDS=['introduction','analogy','same-task','as-is','compare','flow','stale-result','layers','record','walkthrough','takeaways','understanding']

def sections(text,lang):
    en=lang=="en"
    figures=json.loads((SOURCE/"figures.json").read_text())[lang]
    chunks=[];current=[];fenced=False
    for line in text.splitlines():
        if line.startswith('```'):fenced=not fenced
        if line.startswith('## ') and not fenced:
            chunks.append(current);current=[line[3:]]
        else:current.append(line)
    chunks.append(current)
    assert len(chunks)==len(IDS),(len(chunks),len(IDS))
    result=[]
    for sid,lines in zip(IDS,chunks):
        heading=lines[0].lstrip('# ');lines=lines[1:];paragraphs=[];blocks=[];i=0
        def prose(value):
            if not blocks:paragraphs.append(value)
            elif blocks[-1]['kind']=='prose':blocks[-1]['paragraphs'].append(value)
            else:blocks.append({'kind':'prose','paragraphs':[value]})
        while i<len(lines):
            line=lines[i].strip()
            if not line:i+=1;continue
            if line.startswith('@figure'):
                number=int(line.removeprefix('@figure'))
                blocks.append(next(f for f in figures if re.match(r'(?:Figure |圖 )'+str(number)+r'(?: · |｜)',f['caption'])))
                i+=1;continue
            if line.startswith('@exercise-'):
                mode=line.removeprefix('@exercise-')
                blocks.append({'kind':'step','id':'workflow-'+mode,'heading':('Result invalidation simulation' if mode=='stale' else 'Four-case walkthrough') if en else ('結果失效模擬' if mode=='stale' else '四情境走讀'),'paragraphs':[('Edit → invalidate → check again → output.' if mode=='stale' else 'Walk through missing input, edits, cancellation and confirmed export.') if en else ('修改 → 失效 → 重新檢查 → 輸出。' if mode=='stale' else '逐一走讀缺漏、修改、取消與確認匯出。')]})
                i+=1;continue
            if line.startswith('### '):
                blocks.append({'kind':'step','id':f'{sid}-part-{len(blocks)+1}','heading':line[4:],'paragraphs':[]});i+=1;continue
            if line.startswith('|'):
                rows=[]
                while i<len(lines) and lines[i].strip().startswith('|'):
                    rows.append([v.strip() for v in lines[i].strip().strip('|').split('|')]);i+=1
                assert len(rows)>2 and all(len(r)==len(rows[0]) for r in rows)
                blocks.append({'kind':'table','caption':heading+(' | Comparison' if en else '｜比較表'),'headers':rows[0],'rows':rows[2:]});continue
            if line.startswith('```'):
                code=[];i+=1
                while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
                assert i<len(lines),'unclosed code fence'
                blocks.append({'kind':'step','id':'problem-template','heading':'problem.md','paragraphs':['Synthetic example; As-Is awaits interviews and To-Be awaits validation. The shared Chinese problem.md defines the restaurant manager and supplier; starts with an ingredient list and ends with a recorded and sent request or cancellation; excludes supplier acceptance, delivery and payment. Current work is stocktake, handwriting, phoning and recording. The target is selecting ingredients, entering quantities, checking required information, previewing, confirming and recording the submission outcome. Missing input retains values; editing invalidates preview; unconfirmed submission allows safe retry; cancellation sends no new request. Confirm electronic receiving, duplicate-order risk on retry, draft retention after cancellation and how supplier acceptance is established.'] if en else ['合成範例；As-Is 待訪談確認，To-Be 待驗證。'],'code':'\n'.join(code)});i+=1;continue
            paragraph=[]
            while i<len(lines) and lines[i].strip() and not lines[i].startswith(('### ','|','```','@figure','@exercise-')):
                paragraph.append(lines[i]);i+=1
            assert paragraph,'unhandled line'
            value='\n'.join(paragraph)
            if blocks and blocks[-1]['kind']=='step' and 'code' not in blocks[-1] and not blocks[-1].get('id','').startswith('workflow-'):blocks[-1]['paragraphs'].append(value)
            else:prose(value)
        if not paragraphs:
            # A section beginning with a subheading still needs its own introduction.
            paragraphs=['Identify the task, conditions and verifiable outcomes in the following subsections.' if en else '先沿著以下小節辨認任務、條件與可驗證結果。']
        for j in range(len(blocks)-1, -1, -1):
            if blocks[j]['kind']=='step' and not blocks[j]['paragraphs']:
                assert j+1<len(blocks), (sid,blocks[j])
                if blocks[j+1]['kind']!='table':
                    blocks[j+1]['description']=blocks[j]['heading']+' — '+blocks[j+1]['description'];blocks.pop(j);continue
                blocks[j+1]['caption']=blocks[j]['heading'];blocks.pop(j)
        result.append({'id':sid,'heading':heading,'paragraphs':paragraphs,**({'blocks':blocks} if blocks else {})})
    return result

def build():
    lesson=json.loads((SOURCE/'prior-lesson.json').read_text())
    lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
    answers={
      'zh':[
       '可將起點定為員工取得待報銷收據，終點為確認後的申請已送交財務並取得可核對紀錄，或取消。第一版可排除財務正式核准、實際撥款與外部會計串接；實際邊界須與利害關係人確認。',
       'As-Is：員工整理收據 → 填 Excel → 寄送財務。To-Be：員工上傳 → AI 辨識並建立草稿 → 員工核對修正 → 系統重查 → 員工確認送交財務。AI 提取資料，員工確認內容，財務保留業務審核責任。',
       '由 1,500 元改成 15,000 元會改變受檢輸入，立即使舊檢查、預覽及通過標記失效，重新檢查後才能送出。輸出須對應目前版本；必要欄位完整仍不能證明金額正確。',
       '無法辨識：標明未辨識欄位並保留上傳與已填資料，允許人工補正後重查。取消：不新增本次申請，草稿保留與否另定。斷線：顯示送出結果未確認，先查申請紀錄／請求識別，再安全重試，避免重複申請。'],
      'en':[
       'A possible start is the employee obtaining receipts to claim; the endpoint is a confirmed submission to finance with a verifiable record, or cancellation. The first version may exclude official finance approval, actual payment and external accounting integration. Confirm the real boundaries with stakeholders.',
       'As-Is: employee organizes receipts → fills Excel → emails finance. To-Be: employee uploads → AI recognizes data and prepares a draft → employee checks and corrects → system rechecks → employee confirms submission to finance. AI extracts data; the employee confirms content; finance retains business-review responsibility.',
       'Changing TWD 1,500 to TWD 15,000 changes checked input. Immediately invalidate the old check, preview and pass flag; recheck before submission. Output must correspond to the current version. Complete fields still do not establish a correct amount.',
       'Unreadable receipt: identify unresolved fields, retain the upload and entered values, allow manual correction and recheck. Cancellation: create no new claim; define draft retention separately. Network failure: show that the submission outcome is unconfirmed, check the claim record/request identity and then retry safely to avoid duplicate claims.']}
    for lang in ['zh','en']:
        ss=sections((SOURCE/f'teaching.{lang}.md').read_text(),lang)
        for section in ss:
            if section['id']=='as-is':section['sourceIds']=['govuk-discovery']
            if section['id']=='layers':section['sourceIds']=['govuk-experience-map']
        lesson['text'][lang]['sections']=ss
        questions=[p for p in ss[-1]['paragraphs'] if re.match(r'Q[1-4][｜ |]',p)]
        assert len(questions)==4,questions
        ss[-1]['paragraphs']=[p for p in ss[-1]['paragraphs'] if p not in questions]
        lesson['text'][lang]['openChecks']=[{'id':f'AASE-M03-C03-Q{i+4:02}','prompt':q,'answer':[a]} for i,(q,a) in enumerate(zip(questions,answers[lang]))]
    lesson['checks']=[]
    return json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'

if __name__=='__main__':
    target=ROOT/'content/aase/lessons/aase-m03-c03.json';data=build()
    if '--check' in sys.argv:assert target.read_text()==data,'lesson differs from manuscripts'
    else:target.write_text(data)
    parsed=json.loads(data)
    for lang,t in parsed['text'].items():
        assert len(t['sections'])==12
        assert sum(b['kind']=='table' for s in t['sections'] for b in s.get('blocks',[]))==5
        assert len(t['openChecks'])==4
    print('PASS: bilingual 12-section lesson, five tables, problem.md and four open checks synchronized.')
