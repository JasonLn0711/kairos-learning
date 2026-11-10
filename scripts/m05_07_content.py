"""Build the complete draft M05-07 from paired manuscripts, without publication."""
from pathlib import Path
import hashlib,json,re,sys
R=Path(__file__).resolve().parents[1]; S=R/'docs/sources/m05-07'
def parse(suffix):
    blocks=[];section=0
    for chunk in re.split(r'\n\s*\n',(S/f'teaching.{suffix}.md').read_text().strip())[1:]:
        if chunk.startswith('## '):
            section+=1;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
        elif chunk.startswith('- ') or re.match(r'^\d+\. ',chunk):
            blocks.append(dict(kind='list',ordered=bool(re.match(r'^\d+\. ',chunk)),items=[re.sub(r'^(?:- |\d+\. )','',x).replace('**','') for x in chunk.splitlines()]))
        else:blocks.append(dict(kind='paragraph',text=chunk.replace('**','')))
    assert section==8
    blocks.append(dict(kind='answer',id='answer-validation',summary='參考答案：零項漏洞與未完成檢查' if suffix=='zh-TW' else 'Reference answer: zero vulnerabilities and incomplete checks',paragraphs=(S/f'reference-answer.{suffix}.md').read_text().strip().split('\n\n')[:3]))
    return dict(summary='分清誤報、漏報與未完成檢查，依主張、條件及證據驗證掃描結果。' if suffix=='zh-TW' else 'Distinguish false positives, false negatives and incomplete checks; validate scan results against claims, conditions and evidence.',sections=[],sourceBody=blocks)
def generate():
    teaching=dict(id='CEH26-M05-C07',revision=1,contentVersion='1.0.0',date='2026-11-10',publishedOn='2026-11-10',status='draft',qa=[],text={lang:parse(suffix) for lang,suffix in [('zh','zh-TW'),('en','en')]})
    shape=lambda b:(b['kind'],b.get('id'),b.get('ordered',False),len(b.get('items',b.get('paragraphs',[]))))
    assert list(map(shape,teaching['text']['zh']['sourceBody']))==list(map(shape,teaching['text']['en']['sourceBody']))
    # Only heading markup changes in the supplied Chinese teaching.
    original=(S/'original.zh-TW.md').read_text().strip().split('\n\n')
    normalized=(S/'teaching.zh-TW.md').read_text().strip().split('\n\n')
    assert len(original)==len(normalized)
    for a,b in zip(original,normalized):assert a==b or a.strip('*')==re.sub(r'^#{1,2} ','',b)
    hashes=json.loads((S/'source-sha256.json').read_text())
    for name,digest in hashes.items():assert hashlib.sha256((S/name).read_bytes()).hexdigest()==digest,name
    return json.dumps(teaching,ensure_ascii=False,indent=2)+'\n'
if __name__=='__main__':
    target=R/'content/concepts/ceh26-m05-c07.json';result=generate()
    if '--check' in sys.argv:assert target.read_text()==result
    else:target.write_text(result)
    print('PASS: full paired draft, eight sections, one reference answer, source hashes and Chinese fidelity.')
