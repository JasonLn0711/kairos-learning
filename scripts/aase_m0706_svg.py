"""Export five fixed review figures per language from the validated lesson."""
import json,sys
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
def render(f,number,lang):
    out=[]
    def text(value,x,y,width=44,bold=False):
        for paragraph in value.split('\n'):
            for line in wrap(paragraph,width):
                out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
        return y
    def box(item,x,y,w):
        start=len(out);out.append('');end=text(item['title'],x+20,y+36,(w-40)/22,True)+6;end=text(item['body'],x+20,end,(w-40)/22)+14
        out[start]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y}" rx="12" fill="#f1f4f5" stroke="#7b8c96"/>'
        return end
    def arrow(y1,y2):out.append(f'<path d="M530 {y1}V{y2}m-7-7 7 7 7-7" fill="none" stroke="#59666e" stroke-width="2"/>')
    y=text(f['caption'],36,40,44,True)+20
    if number==1:
        y=max(box(item,36+i*336,y,316)for i,item in enumerate(f['items'][:3]));arrow(y+10,y+46);y+=66
        y=box(f['items'][3],36,y,988)+24
    elif number==3:
        for row in [f['headers']]+f['rows']:
            y=max(box(dict(title=a if row==f['headers']else'',body=''if row==f['headers']else a),36+i*336,y,316)for i,a in enumerate(row))+12
    else:
        for i,item in enumerate(f['items']):
            y=box(item,36,y,988)
            if number in [2,4]and i<len(f['items'])-1:arrow(y+8,y+40);y+=58
            else:y+=18
    description=f.get('description','三欄逐列比較主張、證據與判斷。'if lang=='zh'else'Each row compares a claim, evidence and supported judgment.')
    y=text(description,36,y+16,44)+24
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(description)}</desc><rect width="1060" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
    tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','d'}
    assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter());assert len(svg.encode())<100000
    return svg.encode()
if __name__=='__main__':
    lesson=json.loads((ROOT/'content/aase/lessons/aase-m07-c06.json').read_text())
    for lang in ['zh','en']:
        figs=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b.get('caption','').startswith(('圖','Figure'))];assert len(figs)==5
        for n,f in enumerate(figs,1):
            path=ROOT/f'site/images/aase/m07-06-{n}-{lang}.svg';data=render(f,n,lang)
            if '--check'in sys.argv:assert path.read_bytes()==data,path
            else:path.write_bytes(data)
    print('PASS: 10 fixed, escaped-text SVG exports synchronized; each below 100000 bytes')
