"""Export the three M08-05 diagrams directly from the lesson's structured data."""
import json, sys
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]

def render(f,n,lang):
    out=[]
    def text(value,x,y,width=44,bold=False):
        for paragraph in value.split('\n'):
            for line in wrap(paragraph,width):
                out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
        return y
    y=text(f['caption'],36,40,bold=True)+20
    if n==2:
        for key,value in f['rows']:
            y=text(key,36,y,44,True);y=text(value,60,y,43)+12
            out.append(f'<path d="M36 {y}H1024" stroke="#d5dce0"/>');y+=36
        description='虛構教學示例，不代表曾經進行真人測試。' if lang=='zh' else 'Fictional teaching example; no claim of human testing.'
    else:
        for i,item in enumerate(f['items']):
            start=len(out);out.append('');top=y
            y=text((str(i+1)+'. ' if n==1 else '')+item['title'],56,y+40,42,True)
            y=text(item['body'],56,y+8,42)+16
            out[start]=f'<rect x="36" y="{top}" width="988" height="{y-top}" rx="12" fill="#fbfcfd" stroke="#d5dce0"/>'
            if n==1 and i<len(f['items'])-1:
                out.append(f'<path d="M530 {y+8}v25m-7-7 7 7 7-7" fill="none" stroke="#59666e" stroke-width="2"/>');y+=52
            else:y+=28
        description=f['description']
    y=text(description,36,y+12)+24
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(description)}</desc><rect width="1060" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
    tree=ET.fromstring(svg)
    allowed={'svg','title','desc','rect','g','text','path'}
    attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
    assert all(e.tag.split('}')[-1] in allowed and set(e.attrib)<=attrs for e in tree.iter())
    assert len(svg.encode())<100000
    return svg.encode()

def main():
    lesson=json.loads((ROOT/'content/aase/lessons/aase-m08-c05.json').read_text())
    for lang in ['zh','en']:
        sections=lesson['text'][lang]['sections']
        fs=[next(b for s in sections if s['id']==sid for b in s.get('blocks',[]) if b['kind']==kind) for sid,kind in [('workflow','flow'),('notes','table'),('improve','cards')]]
        assert [len(f.get('items',f.get('rows',[]))) for f in fs]==[6,9,2]
        for n,f in enumerate(fs,1):
            dest=ROOT/f'site/images/aase/m08-05-{n}-{lang}.svg';data=render(f,n,lang)
            if '--check' in sys.argv: assert dest.read_bytes()==data
            else: dest.write_bytes(data)
    print('PASS: six bounded, model-derived SVG exports')
if __name__=='__main__':main()
