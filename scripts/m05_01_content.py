"""Generate source-faithful bilingual M05-01 using the approved sourceBody model."""
from pathlib import Path
import json,re,sys
R=Path(__file__).resolve().parents[1]; S=R/'docs/sources/m05-01'
def parse(lang):
    suffix='zh-TW' if lang=='zh' else 'en'
    chunks=re.split(r'\n\s*\n',(S/f'teaching.{suffix}.md').read_text().strip())[1:]
    blocks=[]; section=0
    for chunk in chunks:
        if chunk.startswith('## '):
            section+=1; blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
        elif chunk.startswith('- ') or re.match(r'1\. ',chunk):
            blocks.append(dict(kind='list',items=[line[2:] if line.startswith('- ') else line for line in chunk.splitlines()]))
        else: blocks.append(dict(kind='paragraph',text=chunk))
    assert section==8
    blocks.append(dict(kind='answer',id='answer-m0501',summary='參考答案與解析' if lang=='zh' else 'Reference answer and explanation',paragraphs=[
        '答案是 C。版本警告是待核對的線索；先確認產品、修補及必要條件，並把觀察與推論分開。進一步驗證仍須符合授權範圍。',
        'A 超出已知授權；B 把可能弱點錯寫為已入侵；D 把未觀察到外洩錯當成不存在問題。VA 問哪些缺失適用、應如何排序改善；PT 問授權條件下哪些路徑可行、能證明什麼影響。兩者都要記錄證據與限制。'
    ] if lang=='zh' else [
        'The answer is C. A version warning is a lead to verify. Check the product, patch status and required conditions, separating observation from inference. Further verification must remain within authorization.',
        'A exceeds the known authorization. B incorrectly turns a possible vulnerability into a confirmed intrusion. D mistakes an absence of observed disclosure for an absence of problems. VA asks which deficiencies apply and how to prioritize improvements; PT asks which paths work under authorized conditions and what impact can be demonstrated. Both must record evidence and limitations.'
    ]))
    return dict(summary='區分弱點評估與滲透測試的目的，依授權核對條件，以最小必要證據說明影響與限制。' if lang=='zh' else 'Distinguish assessment from penetration testing, verify conditions within authorization, and explain impact and limitations with minimum necessary evidence.',sections=[],sourceBody=blocks)
def generate():
    return dict(id='CEH26-M05-C01',revision=1,contentVersion='1.0.0',date='2026-11-08',status='published',publishedOn='2026-11-08',qa=[],text={l:parse(l) for l in ['zh','en']})
if __name__=='__main__':
    p=R/'content/concepts/ceh26-m05-c01.json'; data=json.dumps(generate(),ensure_ascii=False,indent=2)+'\n'
    if '--check' in sys.argv: assert p.read_text()==data
    else:p.write_text(data)
