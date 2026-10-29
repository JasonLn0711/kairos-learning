"""Fail-closed serializer for the 14 reviewed, repository-owned M09-03 SVGs.

No runtime/user HTML is accepted. Build/tests reject unsupported SVG features,
external resources, active content, duplicate IDs and nonlocal references.
"""
from pathlib import Path
import json
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
NS = 'http://www.w3.org/2000/svg'
TAGS = {'svg', 'title', 'desc', 'defs', 'marker', 'g', 'path', 'rect', 'circle',
        'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan'}
ATTRS = {'id', 'role', 'aria-labelledby', 'aria-describedby', 'viewBox', 'width',
         'height', 'preserveAspectRatio', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx',
         'cy', 'r', 'rx', 'ry', 'd', 'points', 'fill', 'stroke', 'stroke-width',
         'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'fill-opacity',
         'stroke-opacity', 'opacity', 'font-family', 'font-size', 'font-weight',
         'text-anchor', 'dominant-baseline', 'dy', 'dx', 'transform', 'marker-end',
         'marker-start', 'markerWidth', 'markerHeight', 'markerUnits', 'refX',
         'refY', 'orient'}
ET.register_namespace('', NS)


def sanitized_svg(raw, prefix):
    if re.search(r'<!|<\?', raw):
        raise ValueError('Declarations, entities and processing instructions are not allowed')
    root = ET.fromstring(raw)
    if root.tag != f'{{{NS}}}svg':
        raise ValueError('SVG namespace/root required')
    ids, refs = set(), []
    for node in root.iter():
        if node.tag not in {f'{{{NS}}}{tag}' for tag in TAGS}:
            raise ValueError(f'Unsupported SVG element: {node.tag}')
        for attr, value in node.attrib.items():
            if attr not in ATTRS:
                raise ValueError(f'Unsupported SVG attribute: {attr}')
            if '\\' in value or '/*' in value or '*/' in value:
                raise ValueError('CSS escapes and comments are not allowed')
            if re.search(r'(?:https?:|data:|javascript:|//)', value, re.I):
                raise ValueError('External or active attribute value')
            if attr in ['fill', 'stroke'] and not re.fullmatch(r'(?:none|currentColor|transparent|#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{8}|url\(#[A-Za-z0-9_-]+\))', value):
                raise ValueError('Unsupported SVG paint value')
            if attr in ['marker-start', 'marker-end'] and not re.fullmatch(r'(?:none|url\(#[A-Za-z0-9_-]+\))', value):
                raise ValueError('Unsupported SVG marker value')
            if attr == 'id':
                if not re.fullmatch(re.escape(prefix) + r'[A-Za-z0-9_-]+', value) or value in ids:
                    raise ValueError('Non-namespaced or duplicate SVG ID')
                ids.add(value)
            if attr in ['aria-labelledby', 'aria-describedby']:
                refs.extend(value.split())
            if 'url' in value.lower():
                match = re.fullmatch(r'url\(#([A-Za-z0-9_-]+)\)', value)
                if attr not in ['marker-start', 'marker-end', 'fill', 'stroke'] or not match:
                    raise ValueError('Only exact local SVG references allowed')
                refs.append(match[1])
    if not set(refs).issubset(ids):
        raise ValueError('Unresolved SVG reference')
    title, desc = root.find(f'{{{NS}}}title'), root.find(f'{{{NS}}}desc')
    if title is None or desc is None or not title.text or not desc.text:
        raise ValueError('Accessible title and description required')
    if root.get('role') != 'img' or root.get('aria-labelledby') != f'{title.get("id")} {desc.get("id")}':
        raise ValueError('Root must reference its unique title and description')
    box = [float(v) for v in root.get('viewBox', '').split()]
    if len(box) != 4 or box[0:2] != [0, 0] or not (0 < box[2] <= 900 and 0 < box[3] <= 1800):
        raise ValueError('Bounded viewBox required')
    return ET.tostring(root, encoding='unicode', short_empty_elements=True)


def generate():
    result = {}
    for lang in ['zh', 'en']:
        for number in range(1, 8):
            src = f'/images/ceh/m09-03-figure-{number}-{lang}.svg'
            raw = (ROOT / 'site' / src.lstrip('/')).read_text()
            result[src] = sanitized_svg(raw, f'm0903-f{number}-{lang}-')
    return json.dumps(result, ensure_ascii=False, indent=2) + '\n'


def generate_labels():
    labels = {'zh': [], 'en': []}
    for src, markup in json.loads(generate()).items():
        lang = 'zh' if src.endswith('-zh.svg') else 'en'
        root = ET.fromstring(markup)
        labels[lang].extend(' '.join(''.join(node.itertext()).split()) for node in root.iter()
                            if node.tag in {f'{{{NS}}}title', f'{{{NS}}}desc', f'{{{NS}}}text'})
    return json.dumps(labels, ensure_ascii=False, indent=2) + '\n'


if __name__ == '__main__':
    target = ROOT / 'src/lib/m0903-inline-svg.json'
    generated = generate()
    if '--check' in sys.argv:
        assert target.read_text() == generated, 'Regenerate reviewed inline SVG bundle'
        assert (ROOT / 'src/lib/m0903-svg-labels.json').read_text() == generate_labels(), 'Regenerate SVG search labels'
        print('14 safe inline SVGs match reviewed downloads')
    else:
        target.write_text(generated)
        (ROOT / 'src/lib/m0903-svg-labels.json').write_text(generate_labels())
