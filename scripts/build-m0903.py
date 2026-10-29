"""Normalize the complete M09-03 sources; keep reference answers separate.

The only public-reading wording change replaces the chat-specific invitation
to wait for a reply. Route A/B become responsive cards with unchanged wording.
No learner response or understanding state is inferred by this conversion.
"""
from pathlib import Path
import html
import json
import re
import textwrap

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / 'docs/sources/m09-03'


def clean(value):
    return value.replace('**', '').strip()


def parse_markdown(raw):
    blocks, paragraph, items = [], [], []
    headings, subheadings = 0, 0
    lines = raw.splitlines()

    def flush():
        if paragraph:
            blocks.append({'kind': 'paragraph', 'text': clean(' '.join(paragraph))})
            paragraph.clear()
        if items:
            blocks.append({'kind': 'list', 'items': items.copy()})
            items.clear()

    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            flush()
        elif line.startswith('|'):
            flush()
            table = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                row = lines[i].strip()
                if not re.fullmatch(r'[| :\-]+', row):
                    table.append([clean(c) for c in row.strip('|').split('|')])
                i += 1
            blocks.append({'kind': 'table', 'headers': table[0], 'rows': table[1:]})
            continue
        elif line.startswith('# '):
            flush()
            blocks.append({'kind': 'paragraph', 'text': clean(line[2:])})
        elif line.startswith('## '):
            flush()
            headings += 1
            blocks.append({'kind': 'heading', 'id': f'section-{headings}', 'text': clean(line[3:])})
        elif line.startswith('### '):
            flush()
            subheadings += 1
            blocks.append({'kind': 'paragraph', 'id': f'subsection-{subheadings}', 'text': clean(line[4:])})
        elif re.match(r'^(?:- |\d+\. )', line):
            if paragraph:
                flush()
            # Keep numbered procedures numbered in the existing list renderer.
            items.append(clean(line[2:] if line.startswith('- ') else line))
        else:
            if items:
                flush()
            paragraph.append(line.removeprefix('> '))
        i += 1
    flush()
    return blocks


def svg_for(lang, visual):
    """Standalone counterpart to the responsive semantic HTML cards."""
    is_zh = lang == 'zh'
    wrap = lambda s: textwrap.wrap(s, width=35 if is_zh else 72, break_long_words=False) if not is_zh else [s[i:i+31] for i in range(0, len(s), 31)]
    out = ['<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="640" viewBox="0 0 1000 640" role="img" aria-labelledby="title desc">',
           f'<title id="title">{html.escape(visual["caption"])}</title>',
           f'<desc id="desc">{html.escape(visual["description"] + " " + " ".join(i["title"] + ": " + i["body"] for i in visual["items"]))}</desc>',
           '<rect width="1000" height="640" fill="#f5f8fa"/>',
           '<g font-family="Noto Sans CJK TC, sans-serif" fill="#18252c">',
           f'<text x="42" y="60" font-size="30" font-weight="700">{html.escape(visual["caption"])}</text>',
           f'<text x="42" y="100" font-size="20">{html.escape(visual["description"])}</text>']
    for i, item in enumerate(visual['items']):
        y = 138 + i * 235
        out.append(f'<rect x="40" y="{y}" width="920" height="210" rx="12" fill="#ffffff" stroke="#5a7282" stroke-width="2"/>')
        out.append(f'<text x="64" y="{y+40}" font-size="25" font-weight="700">{html.escape(item["title"])}</text>')
        for j, line in enumerate(wrap(item['body'])):
            out.append(f'<text x="64" y="{y+82+j*32}" font-size="23">{html.escape(line)}</text>')
    out.append('</g></svg>')
    return '\n'.join(out) + '\n'


lesson = {'id': 'M09-03', 'revision': 1, 'contentVersion': '1.0.0', 'date': '2026-10-29', 'status': 'published', 'publishedOn': '2026-10-29', 'qa': [], 'text': {}}
for lang, suffix in [('zh', 'zh-TW'), ('en', 'en')]:
    body = parse_markdown((SOURCES / f'M09-03-teaching.{suffix}.md').read_text())
    if lang == 'en':
        at = next(i for i, b in enumerate(body) if b['kind'] == 'table')
        body.insert(at, {'kind': 'paragraph', 'text': 'Putting the three terms side by side makes the distinction easier to remember:'})
    # The card bodies preserve the two complete route sentences once, in order.
    route_prefix = '路線 A：' if lang == 'zh' else 'Path A:'
    at = next(i for i, b in enumerate(body) if b.get('text', '').startswith(route_prefix))
    routes = body[at:at+2]
    titles = ['路線 A：來源仍在同一圈', '路線 B：回到既有可信程序'] if lang == 'zh' else ['Path A: the same source controls the chain', 'Path B: return to an established trusted process']
    visual = {'kind': 'cards', 'caption': '兩條查證路線' if lang == 'zh' else 'Two verification paths', 'description': '每一步的聯絡資料，是誰提供的？' if lang == 'zh' else 'Who supplied the contact details at each step?', 'items': [{'title': title, 'body': b['text']} for title, b in zip(titles, routes)]}
    src = f'/images/ceh/m09-03-verification-paths-{lang}.svg'
    body[at:at+2] = [{'kind': 'visual', 'visual': visual, 'src': src, 'downloadLabel': '下載查證路線 SVG 圖' if lang == 'zh' else 'Download the verification-path SVG'}]
    (ROOT / 'site' / src.lstrip('/')).write_text(svg_for(lang, visual))
    for b in body:
        if lang == 'zh' and b.get('text', '').startswith('NIST 明確區分'):
            b['text'] = b['text'].replace('特定連線工作階段', '特定連線工作階段（一段特定的驗證互動）')
        if b.get('text', '').startswith('不需要寫很多'):
            b['text'] = '不需要寫很多，也不用給信心分數。請先自行作答，再展開下方參考解答比對推理；閱讀解答不等於已完成本人作答或理解驗收。'
        elif b.get('text', '').startswith('No long response or confidence score'):
            b['text'] = 'No long response or confidence score is needed. Try your own answer before opening the reference explanations below. Reading an explanation is not a submitted learner answer or verified understanding.'
    answers = parse_markdown((SOURCES / f'M09-03-reference-answers.{suffix}.md').read_text())
    answer_blocks = []
    for b in answers:
        if b['kind'] == 'heading' and re.match(r'^[123]\. ', b['text']):
            answer_blocks.append({'kind': 'answer', 'id': f'answer-{len(answer_blocks)+1}', 'summary': ('參考解答：' if lang == 'zh' else 'Reference explanation: ') + b['text'], 'paragraphs': []})
        elif answer_blocks:
            if b['kind'] in ('heading', 'paragraph'):
                answer_blocks[-1]['paragraphs'].append(b['text'])
            elif b['kind'] == 'list':
                answer_blocks[-1]['paragraphs'].extend(b['items'])
    # Insert the three explanations after the question and before its summary.
    at = next(i for i, b in enumerate(body) if b.get('text') in ['本課總結', 'Summary'])
    body[at:at] = answer_blocks
    prefix = '' if lang == 'zh' else 'en/'
    ids = ['M09-01', 'M09-02', 'M01-01', 'M01-02', 'M01-03', 'M01-04', 'M01-05', 'M01-06', 'M01-07']
    body.extend([{'kind': 'heading', 'id': 'connections', 'text': '前後課程連結' if lang == 'zh' else 'Connections to earlier lessons'}, {'kind': 'paragraph', 'text': ' · '.join(f'[{id}](https://learn.cs-kairos.com/{prefix}courses/ceh/v13/{id[:3].lower()}/concepts/{id.lower()}/)' for id in ids)}, {'kind': 'paragraph', 'text': f'[M09-04：藉口設計、誘餌與尾隨（待整理）](https://learn.cs-kairos.com/{prefix}courses/ceh/v13/m09/#m09-04)' if lang == 'zh' else f'[M09-04: Pretexting, baiting and tailgating (pending)](https://learn.cs-kairos.com/{prefix}courses/ceh/v13/m09/#m09-04)'}])
    lesson['text'][lang] = {'summary': '從虛構簡訊與來電案例，分辨語音釣魚、簡訊釣魚與身分冒充，練習獨立查證、驗證碼防護與證據判讀。' if lang == 'zh' else 'Distinguish vishing, smishing and impersonation through a fictional text-and-call scenario, then practice independent verification, login-code protection and evidence-based reasoning.', 'sections': [], 'sourceBody': body}
(ROOT / 'content/concepts/m09-03.json').write_text(json.dumps(lesson, ensure_ascii=False, indent=2) + '\n')
