"""Build the complete paired Unix/Linux and NFS manuscript with the existing sourceBody contract."""
from pathlib import Path
import hashlib,json,re,sys
R=Path(__file__).resolve().parents[1]
S=R/'docs/sources/ceh26-m04-c06'
MAP=json.loads((S/'detailed-section-map.json').read_text())
def clean(text):return text.replace('**','')
def parse(lang,suffix):
    lines=(S/f'teaching.{suffix}.md').read_text().splitlines()
    headings=iter(MAP);blocks=[];i=0
    while i<len(lines):
        line=lines[i].strip();i+=1
        if not line:continue
        entry=next((e for e in MAP if line==f"**{e[lang]}**"),None)
        if entry:
            assert next(headings)==entry
            blocks.append(dict(kind='heading',id=entry['id'],text=entry[lang]));continue
        if line.startswith('- '):
            items=[clean(line[2:])]
            while i<len(lines) and lines[i].startswith('- '):
                items.append(clean(lines[i][2:]));i+=1
            blocks.append(dict(kind='list',items=items));continue
        blocks.append(dict(kind='paragraph',text=clean(line)))
    assert next(headings,None) is None
    answer=(S/f'answer.{suffix}.md').read_text().strip().split('\n\n')
    blocks.append(dict(kind='answer',id='answer-unix-nfs-evidence',summary=clean(answer[0]),paragraphs=[clean(p) for p in answer[1:]]))
    return dict(summary='從帳號名稱、程序身分到 NFS 請求，核對 UID／GID、目錄權限與指定檔案的實際操作證據。' if lang=='zh' else 'Trace account names, process credentials, and NFS requests; verify UID/GID, directory permissions, and evidence for each file operation.',sections=[],sourceBody=blocks)
lesson=dict(id='CEH26-M04-C06',revision=1,contentVersion='1.0.0',date='2026-11-05',publishedOn='2026-11-05',status='published',qa=[],text={l:parse(l,s) for l,s in [('zh','zh-TW'),('en','en')]})
p=R/'content/concepts/ceh26-m04-c06.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
for name,expected in json.loads((S/'sha256.json').read_text()).items():
    assert hashlib.sha256((S/name).read_bytes()).hexdigest()==expected,name
zh=lesson['text']['zh']['sourceBody'];en=lesson['text']['en']['sourceBody']
assert [(b['kind'],b.get('id'),len(b.get('items',[]))) for b in zh]==[(b['kind'],b.get('id'),len(b.get('items',[]))) for b in en]
assert re.findall(r'https://[^)]+',(S/'teaching.zh-TW.md').read_text())==re.findall(r'https://[^)]+',(S/'teaching.en.md').read_text())
if '--check' in sys.argv:assert p.read_text()==data
else:p.write_text(data)
print('C06 manuscripts, source hashes, bilingual structure and links match.')
