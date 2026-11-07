"""Render the complete paired FTP/SMTP manuscript with semantic tables, code and diagrams."""
from pathlib import Path
import json, re, sys
from ceh26_m04_c03_diagrams import generate
R=Path(__file__).resolve().parents[1]
S=R/'docs/sources/ceh26-m04-c03/replacement-2026-11-05'
models=json.loads((S/'diagram-models.json').read_text())
def inline(value):
    return value.replace('**','').removeprefix('> ')
def parse(lang,suffix):
    lines=(S/f'teaching.{suffix}.md').read_text().splitlines()
    blocks=[];i=0;chapter=0;sub=0
    while i<len(lines):
        value=lines[i].strip();i+=1
        if not value or value=='---':continue
        if value.startswith('# '):
            title=value[2:]
            if title.startswith('M04-03'):continue
            blocks.append(dict(kind='heading',id='part-smtp' if chapter==6 else 'recap',text=title));continue
        if value.startswith('```'):
            code=[]
            while i<len(lines) and not lines[i].strip().startswith('```'):
                code.append(lines[i]);i+=1
            assert i<len(lines),'Unclosed code fence'
            i+=1;blocks.append(dict(kind='code',text='\n'.join(code)));continue
        if value.startswith('## '):
            if value[3:] in ['理解檢核','Understanding check']:
                blocks.append(dict(kind='heading',id='check',text=value[3:]));continue
            chapter+=1;sub=0
            blocks.append(dict(kind='heading',id=f'section-{chapter}',text=inline(value[3:])));continue
        if value.startswith('### '):
            sub+=1;blocks.append(dict(kind='paragraph',id=f'section-{chapter}-{sub}',text=inline(value[4:])));continue
        if value.startswith('[[figure:'):
            blocks.append(models[value.removeprefix('[[figure:').removesuffix(']]')][lang]);continue
        if value.startswith('|'):
            cells=lambda row:[inline(c.strip()) for c in re.split(r'(?<!\\)\|',row.strip('|'))]
            rows=[cells(value)]
            while i<len(lines) and lines[i].strip().startswith('|'):
                row=lines[i].strip();i+=1
                if not re.fullmatch(r'[| :\-]+',row):rows.append(cells(row))
            blocks.append(dict(kind='table',headers=rows[0],rows=rows[1:]));continue
        if value.startswith('- '):
            items=[inline(value[2:])]
            while i<len(lines) and lines[i].startswith('- '):
                items.append(inline(lines[i][2:]));i+=1
            blocks.append(dict(kind='list',items=items));continue
        blocks.append(dict(kind='paragraph',text=inline(value)))
    assert chapter==11
    blocks.append(dict(kind='answer',id='answer-ftp-smtp-evidence',summary='參考解答：FTP 與 SMTP 兩組情境' if lang=='zh' else 'Reference answers: FTP and SMTP scenarios',paragraphs=(S/f'answer.{suffix}.md').read_text().strip().split('\n\n')))
    return dict(summary='從零理解 FTP／SMTP：分清服務功能、資訊可見、身分與權限，再依操作紀錄判斷每項結論。' if lang=='zh' else 'Understand FTP/SMTP from the ground up: distinguish service capabilities, visible information, identity, permissions, and conclusions supported by operation records.',sections=[],sourceBody=blocks)

teaching=dict(id='CEH26-M04-C03',revision=3,contentVersion='1.1.0',date='2026-11-05',publishedOn='2026-11-04',status='published',qa=[],text={l:parse(l,s) for l,s in [('zh','zh-TW'),('en','en')]})
# Paired chapter/subheading order, tables, code and diagrams must agree.
a,b=teaching['text']['zh']['sourceBody'],teaching['text']['en']['sourceBody']
assert [(x['kind'],x.get('id')) for x in a if x.get('id')]==[(x['kind'],x.get('id')) for x in b if x.get('id')]
for kind in ['code','table','visual']:
    assert len([x for x in a if x['kind']==kind])==len([x for x in b if x['kind']==kind]),kind
outputs={R/'content/concepts/ceh26-m04-c03.json':json.dumps(teaching,ensure_ascii=False,indent=2)+'\n'}
outputs.update({path:data.decode() for path,data in generate().items()})
for path,data in outputs.items():
    if '--check' in sys.argv:assert path.read_text()==data,path
    else:path.parent.mkdir(parents=True,exist_ok=True);path.write_text(data)

print(f'PASS: {"verified" if "--check" in sys.argv else "generated"} bilingual FTP/SMTP content ({len(a)} blocks per language) and 4 sanitized SVGs',file=sys.stderr)
