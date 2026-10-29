"""Normalize the complete M09-03 sources; keep reference answers separate.

The reviewed primary manuscript is authoritative. Seven simplified bilingual
figures replace caption markers; four reference answers remain separate.
No learner response or understanding state is inferred by this conversion.
"""
from pathlib import Path
import json
import re
import zipfile

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


def answer_blocks(raw, lang):
    blocks = []
    identifiers = ['tabletop', 'classification', 'otp', 'response']
    for block in parse_markdown(raw):
        if block['kind'] == 'heading' and re.match(r'^[1-4]\. ', block['text']):
            blocks.append({'kind': 'answer', 'id': f'answer-{identifiers[len(blocks)]}', 'summary': ('參考解答：' if lang == 'zh' else 'Reference explanation: ') + block['text'], 'paragraphs': []})
        elif blocks:
            if block['kind'] in ('heading', 'paragraph'):
                blocks[-1]['paragraphs'].append(block['text'])
            elif block['kind'] == 'list':
                blocks[-1]['paragraphs'].extend(block['items'])
            else:
                raise ValueError('Reference answers use paragraphs and lists only')
    assert len(blocks) == 4 and all(b['paragraphs'] for b in blocks)
    return blocks


lesson = {'id': 'M09-03', 'revision': 3, 'contentVersion': '1.2.0', 'date': '2026-10-29', 'status': 'published', 'publishedOn': '2026-10-29', 'qa': [], 'text': {}}
visuals = json.loads((SOURCES / 'primary-visuals.json').read_text())
support = json.loads((SOURCES / 'spatial-reading-support.json').read_text())
for lang, suffix in [('zh', 'zh-TW'), ('en', 'en')]:
    body = parse_markdown((SOURCES / f'primary-2026-10-29.{suffix}.md').read_text())
    # Figure 4's explanatory comparison becomes the semantic card body once.
    figure4_at = next(i for i, b in enumerate(body) if re.match(r'^(?:圖|Figure)\s*4\s*[｜|]', b.get('text', '')))
    figure4_start = next(i for i, b in enumerate(body[:figure4_at]) if b.get('text') in ['傳統 OTP', 'Traditional OTP'])
    del body[figure4_start:figure4_at]
    seen = []
    for i, block in enumerate(body):
        match = re.match(r'^(?:圖|Figure)\s*([1-7])\s*[｜|]', block.get('text', ''))
        if not match:
            continue
        number = int(match[1]); seen.append(number)
        visual = json.loads(json.dumps(visuals[str(number)][lang]))
        # The original caption is retained in its original position.
        visual['visual']['caption'] = block['text']
        body[i] = visual
    assert seen == list(range(1, 8)), seen
    # Original source/figure text remains intact. Add clearly labeled reading aids.
    expanded = []
    figure_number = 0
    labels = {'zh': ['概念', '讀圖', '例子', '技術機制', '限制'], 'en': ['Concept', 'Read the diagram', 'Example', 'Technical mechanism', 'Limits']}[lang]
    for block in body:
        if block['kind'] != 'visual':
            expanded.append(block)
            continue
        figure_number += 1
        note = support['figures'][figure_number - 1][lang]
        if figure_number == 1:
            legend = support['statusLegend'][lang]
            expanded.extend([
                {'kind': 'paragraph', 'id': 'visual-reading-key', 'text': legend['title']},
                {'kind': 'paragraph', 'text': legend['introduction']},
                {'kind': 'list', 'items': [item['label'] + '：' + item['text'] for item in legend['items']]}
            ])
        expanded.append({'kind': 'paragraph', 'text': labels[0] + '｜' + note['concept']})
        expanded.append(block)
        for label, field in zip(labels[1:], ['visual', 'example', 'technical', 'limits']):
            expanded.append({'kind': 'paragraph', 'text': label + '｜' + note[field]})
    body = expanded
    answers = answer_blocks((SOURCES / f'primary-reference-answers.{suffix}.md').read_text(), lang)
    at = next(i for i, b in enumerate(body) if b.get('id') == 'section-8')
    body[at:at] = answers[:1]
    at = next(i for i, b in enumerate(body) if b.get('text', '').startswith(('最後把 M09-03', 'Finally, bring M09-03 together')))
    body[at:at] = answers[1:]
    check = support['reasoningCheck'][lang]
    at = next(i for i, b in enumerate(body) if b.get('text', '').startswith(('最後把 M09-03', 'Finally, bring M09-03 together')))
    body[at:at] = [
        {'kind': 'heading', 'id': 'visual-reasoning', 'text': check['title']},
        {'kind': 'paragraph', 'text': check['scenario']},
        {'kind': 'list', 'items': [str(i + 1) + '. ' + q for i, q in enumerate(check['questions'])]},
        {'kind': 'paragraph', 'text': check['guidance']},
        {'kind': 'answer', 'id': 'answer-visual-reasoning', 'summary': check['referenceAnswer']['title'], 'paragraphs': check['referenceAnswer']['parts']}
    ]
    prefix = '' if lang == 'zh' else 'en/'
    ids = ['M09-01', 'M09-02', 'M01-01', 'M01-02', 'M01-03', 'M01-04', 'M01-05', 'M01-06', 'M01-07']
    body.extend([
        {'kind': 'heading', 'id': 'connections', 'text': '延伸閱讀與圖檔' if lang == 'zh' else 'Related reading and diagram files'},
        {'kind': 'paragraph', 'text': ' · '.join(f'[{id}](https://learn.cs-kairos.com/{prefix}courses/ceh/v13/{id[:3].lower()}/concepts/{id.lower()}/)' for id in ids)},
        {'kind': 'paragraph', 'text': f'[M02 偵察與足跡蒐集](https://learn.cs-kairos.com/{prefix}courses/ceh/v13/m02/) · [M04 列舉](https://learn.cs-kairos.com/{prefix}courses/ceh/v13/m04/)' if lang == 'zh' else f'[M02 reconnaissance and footprinting](https://learn.cs-kairos.com/{prefix}courses/ceh/v13/m02/) · [M04 enumeration](https://learn.cs-kairos.com/{prefix}courses/ceh/v13/m04/)'},
        {'kind': 'paragraph', 'text': '本版校訂：將簡訊帶外驗證與嚴格定義的 OTP 驗證器分開；把驗證碼期限限定於本例；補正 passkey 為 FIDO 密碼學憑證。來源卡片與送出按鈕殘字已改為正式來源連結及閱讀指引，未建立作答提交功能。' if lang == 'zh' else 'Editorial clarifications: SMS out-of-band verification is distinguished from the formal OTP-authenticator category; expiration is scoped to this example; a passkey is described as a FIDO cryptographic credential. Imported source cards and submit-button text are replaced by direct references and reading guidance, not an answer-submission feature.'},
        {'kind': 'paragraph', 'text': 'v1.2.0 視覺增補：保留完整主稿與原參考答案；新增角色／信任邊界、箭頭讀法、失敗與未知結果，以及圖形推理檢核。圖為簡化模型，不能替代事件證據。' if lang == 'zh' else 'v1.2.0 visual additions preserve the full primary manuscript and original reference answers, adding role and trust boundaries, arrow-reading guidance, failure and unknown outcomes, and a visual reasoning check. These simplified models do not substitute for incident evidence.'},
        {'kind': 'paragraph', 'text': ' · '.join(f"[{source['title']}]({source['url']})" for source in support['sources'])},
        {'kind': 'paragraph', 'text': '[下載七張圖的繁中／英文 SVG 組合包](https://learn.cs-kairos.com/downloads/ceh-m09-03-bilingual-svg.zip)' if lang == 'zh' else '[Download all seven diagrams in Chinese and English (SVG ZIP)](https://learn.cs-kairos.com/downloads/ceh-m09-03-bilingual-svg.zip)'},
        {'kind': 'paragraph', 'text': f'[M09-04：情境編造、誘餌與尾隨（待整理）](https://learn.cs-kairos.com/{prefix}courses/ceh/v13/m09/#m09-04)' if lang == 'zh' else f'[M09-04: Pretexting, baiting and tailgating (pending)](https://learn.cs-kairos.com/{prefix}courses/ceh/v13/m09/#m09-04)'}
    ])
    lesson['text'][lang] = {'summary': '透過完整 Northstar 案例與七張雙語示意圖，理解跨管道冒充、OTP 轉交、抗釣魚驗證、獨立查證與事件證據，並連結 CEH 的防護與應變知識。' if lang == 'zh' else 'Follow the full Northstar scenario and seven bilingual diagrams to understand cross-channel impersonation, OTP relay, phishing-resistant authentication, independent verification, and incident evidence in the wider CEH context.', 'sections': [], 'sourceBody': body}
(ROOT / 'content/concepts/m09-03.json').write_text(json.dumps(lesson, ensure_ascii=False, indent=2) + '\n')

# A deterministic bilingual download contains the same reviewed native SVG bytes.
readme = """# CEH M09-03 — Bilingual SVG diagrams / 雙語 SVG 示意圖

Seven spatial teaching diagrams, each in Traditional Chinese (zh-TW/) and English (en/).
七張空間關係教學圖，每張包含繁體中文與英文版本，共十四個原生 SVG。

1. Four analysis dimensions / 四維攻擊分析
2. One controller, two channels / 同一控制來源、兩個接觸管道
3. Conditional OTP relay / 有前提的驗證碼轉交流程
4. OTP and phishing-resistant authentication / OTP 與抗釣魚驗證
5. Independent verification / 獨立查證
6. Separate evidence questions / 分別核對各層證據
7. CEH concept relationships / CEH 概念關聯

The Northstar scenario is fictional. Arrows express the labeled relationships,
not proof that compromise occurred. Figure 6 does not assert inevitable
progression; Figure 7 is a concept map rather than an attack sequence.
Northstar 是虛構案例；箭頭代表圖中明示的關係，不代表已證實入侵。
圖6不表示事件必然發展，圖7是概念關聯圖，不是攻擊順序。

SVG text remains editable. No scripts, external images, external font files,
or private source material are included. The website embeds allowlist-validated SVG with visible reflowing explanations.
The whole diagram scales proportionally to the available column width without
cropping. Labels also shrink on small screens; open the original SVG to zoom.
The viewBox remains the drawing coordinate system, not a fixed display width.
SVG 文字可編輯，不含腳本、外部圖片、外部字型檔或私人來源材料。
網站直接內嵌經白名單驗證的 SVG，並保留可換行文字解說。
整張圖依可用欄寬等比縮放、不裁切；小螢幕的圖中文字也會變小，可開啟原圖放大。
viewBox保留圖形座標，不是固定顯示尺寸。

Version 1.2.0 / 2026-10-29
"""
bundle = ROOT / 'site/downloads/ceh-m09-03-bilingual-svg.zip'
with zipfile.ZipFile(bundle, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    files = [('README.md', readme.encode())]
    for lang, folder in [('zh', 'zh-TW'), ('en', 'en')]:
        for n in range(1, 8):
            src = visuals[str(n)][lang]['src']
            files.append((f'{folder}/{Path(src).name}', (ROOT / 'site' / src.lstrip('/')).read_bytes()))
    for filename, raw in files:
        info = zipfile.ZipInfo(filename, date_time=(2026, 10, 29, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, raw)

# The inline version is serialized only after a strict passive-SVG check.
from m0903_svg import generate, generate_labels
(ROOT / 'src/lib/m0903-inline-svg.json').write_text(generate())
(ROOT / 'src/lib/m0903-svg-labels.json').write_text(generate_labels())
