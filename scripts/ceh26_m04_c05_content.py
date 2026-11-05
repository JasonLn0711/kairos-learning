"""Build the paired NetBIOS/RPC manuscript using existing sourceBody blocks."""
from pathlib import Path
import json,re,sys
R=Path(__file__).resolve().parents[1]
S=R/'docs/sources/ceh26-m04-c05'
def parse(lang,suffix):
    blocks=[];headings=iter(json.loads((S/'detailed-section-map.json').read_text()))
    for line in (S/f'teaching.{suffix}.md').read_text().splitlines():
        if not line.strip():continue
        line=line.replace('**','')
        if line.startswith('## '):
            h=next(headings);assert h[lang]==line[3:]
            blocks.append(dict(kind='heading',id=h['id'],text=line[3:]))
        elif line.startswith('- ') or re.match(r'^\d+\. ',line):
            item=re.sub(r'^(?:- |\d+\. )','',line)
            if blocks and blocks[-1]['kind']=='list':blocks[-1]['items'].append(item)
            else:blocks.append(dict(kind='list',items=[item]))
        else:blocks.append(dict(kind='paragraph',text=re.sub(r'^# ','',line)))
    assert next(headings,None) is None
    blocks.append(dict(kind='answer',id='answer-netbios-rpc-evidence',summary='小檢核參考答案' if lang=='zh' else 'Reference answer',paragraphs=(S/f'answer.{suffix}.md').read_text().strip().split('\n\n')))
    return dict(summary='NetBIOS／RPC 列舉：區分名稱線索、端點映射、連線與指定操作權限。' if lang=='zh' else 'NetBIOS/RPC enumeration: distinguish name clues, endpoint mappings, connections, and permission for specified operations.',sections=[],sourceBody=blocks)
t=dict(id='CEH26-M04-C05',revision=2,contentVersion='1.0.1',date='2026-11-05',publishedOn='2026-11-05',status='published',qa=[],text={l:parse(l,s) for l,s in [('zh','zh-TW'),('en','en')]})
p=R/'content/concepts/ceh26-m04-c05.json';data=json.dumps(t,ensure_ascii=False,indent=2)+'\n'
if '--check' in sys.argv:assert p.read_text()==data
else:p.write_text(data)
