"""Generate the three fixed interview figures from the published bilingual lesson."""
import argparse
import json
import re
import unicodedata
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
FIGURES = [('analogy', 'comparison', 2), ('workflow', 'process', 5), ('testing', 'evidence', 3)]

def wrap(value, width):
    lines, line, used = [], '', 0
    for token in re.findall(r'[A-Za-z0-9]+(?:[’/\-][A-Za-z0-9]+)*|.', value):
        size = sum(1 if unicodedata.east_asian_width(c) in 'WF' else .62 for c in token)
        if line and used + size > width:
            lines.append(line.rstrip()); line, used = '', 0
        if not line and token.isspace():
            continue
        line += token; used += size
    if line:
        lines.append(line.rstrip())
    return lines

def render(figure, layout, lang):
    nodes = []
    def text(value, x, y, width, size=20, bold=False):
        lines = wrap(value, width)
        for n, line in enumerate(lines):
            nodes.append(f'<text x="{x}" y="{y+n*34}" font-size="{size}" font-weight="{700 if bold else 400}">{escape(line)}</text>')
        return y + len(lines)*34
    y = text(figure['caption'], 36, 42, 45, 24, True) + 18
    if layout == 'comparison':
        ends = []
        for i, item in enumerate(figure['items']):
            x = 36+i*510
            end = text(item['title'], x, y, 20, 22, True)
            ends.append(text(item['body'], x, end+12, 21))
        y = max(ends)+30
        nodes.append(f'<path d="M36 {y} H1004" stroke="#77868a"/>'); y += 40
    else:
        for i, item in enumerate(figure['items']):
            if layout == 'process' and i:
                nodes.append(f'<path d="M520 {y-22} v18 m-6 -6 l6 6 6 -6" fill="none" stroke="#59666c" stroke-width="2"/>')
                y += 24
            top = y-28
            start = len(nodes)
            y = text(item['title'], 64, y, 43, 22, True)
            y = text(item['body'], 64, y+8, 43)
            if layout == 'process' and i == len(figure['items'])-1:
                nodes.insert(start, f'<rect x="36" y="{top}" width="968" height="{y-top+6}" rx="6" fill="#f9f0eb" stroke="#b54b25"/>')
            y += 32
    y = text(figure['description'], 36, y+12, 47, 20)
    height = y+28
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {height}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(figure["caption"])}</title><desc id="desc">{escape(figure["description"])}</desc><rect width="1040" height="{height}" fill="#fbfcfc"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(nodes)+'</g></svg>\n'
    # Fixed generated markup; content can supply only escaped text.
    tree = ET.fromstring(svg)
    allowed = {'svg','title','desc','rect','g','text','path'}
    assert all(e.tag.split('}')[-1] in allowed and not any(k.startswith('on') or k in ['href','style'] for k in e.attrib) for e in tree.iter())
    result = svg.encode()
    assert len(result) < 100000
    return result

def main():
    check = argparse.ArgumentParser(); check.add_argument('--check', action='store_true'); args = check.parse_args()
    lesson = json.loads((ROOT/'content/aase/lessons/aase-m01-c04.json').read_text())
    for lang in ['zh','en']:
        for section, layout, count in FIGURES:
            s = next(s for s in lesson['text'][lang]['sections'] if s['id'] == section)
            figure = next(b for b in s['blocks'] if b['kind'] in ['cards','flow'])
            assert len(figure['items']) == count
            output = ROOT/f'site/images/aase/m01-04-{layout}-{lang}.svg'
            data = render(figure, layout, lang)
            if args.check:
                assert output.read_bytes() == data, f'Out of date: {output}'
            else:
                output.parent.mkdir(parents=True, exist_ok=True); output.write_bytes(data)
            print(f'{output.relative_to(ROOT)}: {len(data)} bytes')

if __name__ == '__main__':
    main()
