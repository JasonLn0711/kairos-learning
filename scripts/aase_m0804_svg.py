"""Export three AppTest diagrams from the same constrained model as the HTML."""
import json
import sys
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap

ROOT = Path(__file__).resolve().parents[1]


def render(figure, number, lang):
    parts = []
    def text(value, x, y, width, bold=False):
        for paragraph in value.split('\n'):
            for line in wrap(paragraph, width):
                parts.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>')
                y += 36
        return y
    def box(item, x, y, width, fill='#ffffff'):
        start = len(parts)
        parts.append('')
        end = text(item['title'], x+20, y+36, (width-40)/22, True)+8
        end = text(item['body'], x+20, end, (width-40)/22)+16
        parts[start] = f'<rect x="{x}" y="{y}" width="{width}" height="{end-y}" rx="12" fill="{fill}" stroke="#64748b"/>'
        return end
    y = text(figure['caption'], 36, 42, 45, True)+20
    if number == 1:
        ends = [box(item, 36+i*344, y, 300) for i,item in enumerate(figure['items'])]
        for x in [348,692]:
            parts.append(f'<path d="M{x} {y+60}h24m-7-7 7 7-7 7" fill="none" stroke="#59666e" stroke-width="2"/>')
        y = max(ends)+36
    else:
        for i,item in enumerate(figure['items']):
            fill = ['#fff6ed','#edf8f3','#ffffff'][i] if number==2 else '#ffffff'
            y = box(item,36,y,988,fill)
            if number == 2 and i < len(figure['items'])-1:
                parts.append(f'<path d="M530 {y+8}v25m-7-7 7 7 7-7" fill="none" stroke="#59666e" stroke-width="2"/>')
                y += 52
            else:
                y += 22
    y = text(figure['description'],36,y+12,47)+24
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(figure["caption"])}</title><desc id="desc">{escape(figure["description"])}</desc><rect width="1060" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(parts)+'</g></svg>\n'
    tree = ET.fromstring(svg)
    tags = {'svg','title','desc','rect','g','text','path'}
    attrs = {'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
    assert all(e.tag.split('}')[-1] in tags and set(e.attrib)<=attrs for e in tree.iter())
    assert len(svg.encode())<100000
    return svg.encode()


def main():
    lesson = json.loads((ROOT/'content/aase/lessons/aase-m08-c04.json').read_text())
    for lang in ['zh','en']:
        figures = [b for s in lesson['text'][lang]['sections'] for b in s.get('blocks',[]) if b['kind'] in ['flow','cards']]
        assert [(f['kind'],len(f['items'])) for f in figures]==[('flow',3),('flow',3),('cards',5)]
        for number,figure in enumerate(figures,1):
            dest = ROOT/f'site/images/aase/m08-04-{number}-{lang}.svg'
            data = render(figure,number,lang)
            if '--check' in sys.argv:
                assert dest.read_bytes()==data,f'outdated {dest}'
            else:
                dest.write_bytes(data)
    print('PASS: six constrained AppTest SVG exports synchronized.')

if __name__=='__main__':
    main()
