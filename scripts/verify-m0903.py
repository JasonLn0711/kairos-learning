"""Verify the final static M09-03 pages, text, disclosures and diagram assets.

This is a static artifact check, not a browser/keyboard/mobile test or proof of
production deployment. The existing browser restriction is not retried here.
"""
from pathlib import Path
from html.parser import HTMLParser
import hashlib
import html
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
lesson = json.loads((ROOT / 'content/concepts/m09-03.json').read_text())


def normalize(value):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'\[([^\]]+)\]\(https://[^)]+\)', r'\1', value))).strip()


class Body(HTMLParser):
    def __init__(self, raw):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.root = None
        self.text = []
        self.details = []
        self.links = []
        self.tables = []
        self.figures = []
        self.in_details = 0
        self.feed(raw)

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == 'div':
            self.depth += 1
            if 'source-body' in attributes.get('class', '').split():
                self.root = self.depth
        if self.root is None:
            return
        if tag == 'details':
            self.details.append(attributes)
            self.in_details += 1
        if tag == 'a':
            self.links.append((attributes, self.in_details))
        if tag == 'table':
            self.tables.append(self.in_details)
        if tag == 'figure':
            self.figures.append(self.in_details)

    def handle_endtag(self, tag):
        if tag == 'details' and self.root is not None:
            self.in_details -= 1
        if tag == 'div':
            if self.depth == self.root:
                self.root = None
            self.depth -= 1

    def handle_data(self, value):
        if self.root is not None:
            self.text.append(value)


def text_units(block):
    kind = block['kind']
    if kind == 'table':
        return block['headers'] + [cell for row in block['rows'] for cell in row]
    if kind == 'list':
        return block['items']
    if kind == 'answer':
        return [block['summary'], *block['paragraphs']]
    if kind == 'visual':
        visual = block['visual']
        return [visual['caption'], visual['description'], *[text for item in visual['items'] for text in [item['title'], item['body']]], block['downloadLabel']]
    return [block['text']]


evidence = {'status': 'pass', 'languages': {}, 'assets': []}
for lang, prefix in [('zh', ''), ('en', 'en/')]:
    path = ROOT / f'build/{prefix}courses/ceh/v13/m09/concepts/m09-03/index.html'
    raw = path.read_text()
    page = Body(raw)
    rendered = normalize(''.join(page.text))
    cursor = count = 0
    for block in lesson['text'][lang]['sourceBody']:
        for unit in text_units(block):
            value = normalize(unit)
            at = rendered.find(value, cursor)
            assert at >= 0, (lang, 'Missing/out-of-order rendered text', value)
            cursor = at + len(value)
            count += 1
    assert len(page.details) == 3 and all('open' not in a for a in page.details)
    assert [a['id'] for a in page.details] == ['answer-1', 'answer-2', 'answer-3']
    assert page.tables == [0] * 5, 'All body tables must be directly visible'
    assert page.figures == [0], 'The path comparison must be directly visible'
    assert re.search(r'<article[^>]*class="[^"]*light-code', raw)
    assert not re.search(r'Sentinel_|libfile_|CalpicoFile_|sandbox:|chatgpt-content-reference', raw)
    assert f'/{prefix}courses/ceh/v13/m09/concepts/m09-02/' in raw
    assert f'/{prefix}courses/ceh/v13/m09/#m09-04' in raw
    assert not (ROOT / f'build/{prefix}courses/ceh/v13/m09/concepts/m09-04').exists()
    visual = next(b for b in lesson['text'][lang]['sourceBody'] if b['kind'] == 'visual')
    src = visual['src']
    assert any(a.get('href') == src and 'download' in a and depth == 0 for a, depth in page.links)
    svg = (ROOT / 'site' / src.lstrip('/')).read_bytes()
    assert svg == (ROOT / 'build' / src.lstrip('/')).read_bytes()
    assert len(svg) < 100000
    root = ET.fromstring(svg)
    for node in root.iter():
        assert node.tag.rsplit('}', 1)[-1] not in ['script', 'foreignObject', 'image', 'use']
        assert not any(k.lower().startswith('on') or 'href' in k.lower() for k in node.attrib)
    evidence['languages'][lang] = {'blocks': 110, 'renderedTextUnits': count, 'visibleTables': 5, 'visibleResponsiveFigures': 1, 'initiallyClosedReferenceAnswers': 3}
    evidence['assets'].append({'src': src, 'bytes': len(svg), 'sha256': hashlib.sha256(svg).hexdigest()})

index = json.loads((ROOT / 'build/search-index.json').read_text())
assert len([x for x in index if x['id'] == 'M09-03']) == 2
assert not any(x['id'] == 'M09-04' for x in index)
for lang in ['zh', 'en']:
    text = next(x['text'] for x in index if x['id'] == 'M09-03' and x['lang'] == lang)
    for block in lesson['text'][lang]['sourceBody']:
        if block['kind'] == 'answer':
            assert all(p in text for p in block['paragraphs'])
evidence['browserMobileKeyboard'] = 'Not performed; existing browser restriction respected'
evidence['production'] = 'Not established by this static artifact check'
print(json.dumps(evidence, ensure_ascii=False, indent=2))
