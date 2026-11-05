"""Render the full bilingual SMB review through the existing escaped sourceBody model."""
from pathlib import Path
import json, re, sys
R = Path(__file__).resolve().parents[1]
S = R / 'docs/sources/ceh26-m04-c04'

def parse(lang, suffix):
    lines = (S / f'teaching.{suffix}.md').read_text().splitlines()
    headings = iter(json.loads((S / 'detailed-section-map.json').read_text()))
    pending = next(headings, None)
    blocks = []
    i = 0
    while i < len(lines):
        value = lines[i].strip()
        i += 1
        if not value:
            continue
        text = value.replace('**', '')
        if pending is not None and text == pending[lang]:
            blocks.append(dict(kind='heading', id=pending['id'], text=text))
            pending = next(headings, None)
        elif value.startswith('- '):
            items = [text[2:]]
            while i < len(lines) and lines[i].startswith('- '):
                items.append(lines[i][2:].replace('**', ''))
                i += 1
            blocks.append(dict(kind='list', items=items))
        else:
            blocks.append(dict(kind='paragraph', text=text))
    assert pending is None, 'Unconsumed paired heading'
    blocks.append(dict(kind='answer', id='answer-smb-evidence',
        summary='參考解答：共用、加密與刪除權限的證據' if lang == 'zh' else 'Reference answer: evidence for shares, encryption, and deletion',
        paragraphs=(S / f'answer.{suffix}.md').read_text().strip().split('\n\n')))
    return dict(summary='以合成 SMB 紀錄，分清連接共用、讀取檔案與實際傳輸保護的證據。' if lang == 'zh' else 'Use a synthetic SMB record to distinguish evidence for share access, file reads, and transport protection actually in use.', sections=[], sourceBody=blocks)

teaching = dict(id='CEH26-M04-C04', revision=1, contentVersion='1.0.0', date='2026-11-05',
    publishedOn='2026-11-05', status='published', qa=[], text={lang:parse(lang, suffix) for lang,suffix in [('zh','zh-TW'),('en','en')]})
path = R / 'content/concepts/ceh26-m04-c04.json'
data = json.dumps(teaching, ensure_ascii=False, indent=2) + '\n'
if '--check' in sys.argv:
    assert path.read_text() == data
else:
    path.write_text(data)
