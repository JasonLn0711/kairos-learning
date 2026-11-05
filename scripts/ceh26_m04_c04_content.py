"""Render the complete paired SMB manuscript with semantic tables, code and diagrams."""
from pathlib import Path
import json, re, sys, html, textwrap
R=Path(__file__).resolve().parents[1]
S=R/'docs/sources/ceh26-m04-c04/replacement-2026-11-05'
models=json.loads((S/'diagram-models.json').read_text())
assert set(models)=={'stages','evidence'}
for key,pair in models.items():
    assert set(pair)=={'zh','en'}
    for lang,block in pair.items():
        assert block['src']==f'/images/ceh/m04-04-{key}-{lang}-v1-1-0.svg'
        assert len(block['visual']['items'])==5
        assert block['visual']['kind']==('flow' if key=='stages' else 'cards')
        assert all(len(x['body'].split('\n'))==2 and x['body'].startswith('✓ ') and x['body'].split('\n')[1].startswith('× ') for x in block['visual']['items'])
def inline(value):
    return value.replace('**','').removeprefix('> ')
def parse(lang,suffix):
    lines=(S/f'teaching.{suffix}.md').read_text().splitlines()
    blocks=[];i=0;chapter=0;sub=0
    while i<len(lines):
        value=lines[i].strip();i+=1
        if not value or value=='---':continue
        if value.startswith('# '):continue
        if value.startswith('```'):
            code=[]
            while i<len(lines) and not lines[i].strip().startswith('```'):
                code.append(lines[i]);i+=1
            assert i<len(lines),'Unclosed code fence'
            i+=1;blocks.append(dict(kind='code',text='\n'.join(code)));continue
        if value.startswith('## '):
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
    blocks.append(dict(kind='answer',id='answer-smb-evidence',summary='參考解答：四題證據判讀' if lang=='zh' else 'Reference answers: four evidence judgments',paragraphs=(S/f'answer.{suffix}.md').read_text().strip().split('\n\n')))
    return dict(summary='從網路共用、檔案權限到傳輸安全，分清 SMB 五個連線階段、實際身分及每項操作能支持的結論。' if lang=='zh' else 'From network shares and file permissions to transport security: distinguish five SMB stages, actual identity, and conclusions supported by each operation.',sections=[],sourceBody=blocks)

def svg(block,lang,key):
    # Text-only escaped serializer; fixed geometry and palette, no supplied markup.
    v=block['visual'];out=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200" role="img" aria-labelledby="title desc">',f'<title id="title">{html.escape(v["caption"])}</title>',f'<desc id="desc">{html.escape(v["description"])}</desc>','<rect width="1600" height="1200" fill="#101b30"/>']
    def text(value,x,y,width,size=24,color='#e8f0ff'):
        # CJK units count double; wrap English only at word boundaries.
        limit=max(5,int(width/(size*.58)))
        words=list(value) if lang=='zh' else value.split(' ')
        lines=[];line='';used=0
        for word in words:
            wordwidth=sum(2 if ord(c)>255 else 1 for c in word)
            sep='' if lang=='zh' or not line else ' '
            if used+len(sep)+wordwidth>limit and line:
                lines.append(line);line=word;used=wordwidth
            else:line+=sep+word;used+=len(sep)+wordwidth
        if line:lines.append(line)
        for j,line in enumerate(lines):out.append(f'<text x="{x}" y="{y+j*size*1.5}" font-family="sans-serif" font-size="{size}" fill="{color}">{html.escape(line)}</text>')
        return len(lines)*size*1.5
    text(v['caption'],60,70,1480,34)
    if key=='stages':
        for i,item in enumerate(v['items']):
            x=45+i*310
            out.append(f'<rect x="{x}" y="160" width="275" height="640" rx="18" fill="#1d304d" stroke="#527594"/>')
            text(f'0{i+1}',x+20,210,235,28,'#8cd6ff')
            text(item['title'],x+20,275,235,26)
            yes,no=item['body'].split('\n')
            text(yes,x+20,470,235,24,'#90e8cf');text(no,x+20,620,235,24,'#ffb6bf')
            if i<4:out.append(f'<path d="M{x+280} 430h20m-9-9 9 9-9 9" fill="none" stroke="#8cd6ff" stroke-width="3"/>')
    else:
        labels=['觀察到的事情','能確定的事','不能直接推論'] if lang=='zh' else ['Observed','Established','Not established']
        for j,label in enumerate(labels):text(label,65+j*510,165,470,27,'#8cd6ff')
        for i,item in enumerate(v['items']):
            y=200+i*145
            yes,no=item['body'].split('\n')
            for j,val in enumerate([item['title'],yes,no]):
                x=45+j*510
                out.append(f'<rect x="{x}" y="{y}" width="490" height="130" rx="12" fill="#1d304d"/>')
                text(val,x+20,y+40,450,24,['#e8f0ff','#90e8cf','#ffb6bf'][j])
    text(v['description'],60,985,1480,24,'#c5d8ed')
    out.append('</svg>');return '\n'.join(out)+'\n'

teaching=dict(id='CEH26-M04-C04',revision=2,contentVersion='1.1.0',date='2026-11-05',publishedOn='2026-11-05',status='published',qa=[],text={l:parse(l,s) for l,s in [('zh','zh-TW'),('en','en')]})
# Paired chapter/subheading order, tables, code and diagrams must agree.
a,b=teaching['text']['zh']['sourceBody'],teaching['text']['en']['sourceBody']
assert [(x['kind'],x.get('id')) for x in a if x.get('id')]==[(x['kind'],x.get('id')) for x in b if x.get('id')]
for kind in ['code','table','visual']:
    assert len([x for x in a if x['kind']==kind])==len([x for x in b if x['kind']==kind]),kind
outputs={R/'content/concepts/ceh26-m04-c04.json':json.dumps(teaching,ensure_ascii=False,indent=2)+'\n'}
for key,pair in models.items():
    for lang,block in pair.items():outputs[R/'site'/block['src'].lstrip('/')]=svg(block,lang,key)
for path,data in outputs.items():
    if '--check' in sys.argv:assert path.read_text()==data,path
    else:path.parent.mkdir(parents=True,exist_ok=True);path.write_text(data)
