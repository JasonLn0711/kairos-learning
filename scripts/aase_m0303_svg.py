"""Export the five static workflow figures from the validated lesson content."""
import argparse,json
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
FIGURES={'analogy':1,'flow':2,'stale-result':3,'layers':5,'record':6}

def render(f,n,lang):
    nodes=[]
    def text(value,x,y,width,size=20,bold=False):
        lines=wrap(value,width)
        for j,line in enumerate(lines):nodes.append(f'<text x="{x}" y="{y+j*36}" font-size="{size}" font-weight="{650 if bold else 400}">{escape(line)}</text>')
        return y+len(lines)*36
    y=text(f['caption'],36,44,40,24,True)+20
    y=text(f['description'],36,y,43)+30
    for i,item in enumerate(f['items']):
        paired=n==6 and i in [3,4]
        width=476 if paired else 968
        x=528 if paired and i==4 else 36
        if not paired or i==3:row=y;ends=[]
        start=len(nodes);end=text(item['title'],x+24,row,(width-48)/24,22,True)
        end=text(item['body'],x+24,end+8,(width-48)/22)
        decision=n==2 and i in [2,4,7,9]
        nodes.insert(start,f'<rect x="{x}" y="{row-28}" width="{width}" height="{end-row+42}" rx="{28 if n==2 and i>=10 else 12}" fill="{("#e3f2e9" if decision else "#f0f8f3")}" stroke="#658f76"'+(' stroke-dasharray="6 4"' if decision else '')+'/>')
        ends.append(end)
        if not paired or i==4:
            y=max(ends)+54
            if n==1 and i<2 or n==6 and i in [0,1,2,4]:
                if n==6 and i in [2,4]:
                    # Both parallel design concerns share the upstream/downstream node.
                    path=f'M520 {y-28}v12H274v16m-7-7 7 7 7-7M520 {y-16}H766v16m-7-7 7 7 7-7' if i==2 else f'M274 {y-28}v12H766v-12M520 {y-16}v16m-7-7 7 7 7-7'
                else:path=f'M520 {y-28}v26m-7-7 7 7 7-7'
                nodes.append(f'<path d="{path}" fill="none" stroke="#557764" stroke-width="2"/>');y+=28
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1040" height="{y}" fill="#fbfdfb"/><g fill="#173329" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(nodes)+'</g></svg>\n'
    tree=ET.fromstring(svg)
    assert all(e.tag.split('}')[-1] in {'svg','title','desc','rect','g','text','path'} and not any(k.startswith('on') or k in ['href','style'] for k in e.attrib) for e in tree.iter())
    data=svg.encode();assert len(data)<100000
    return data

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
    lesson=json.loads((ROOT/'content/aase/lessons/aase-m03-c03.json').read_text())
    for lang in ['zh','en']:
        for sid,n in FIGURES.items():
            s=next(s for s in lesson['text'][lang]['sections'] if s['id']==sid)
            f=next(b for b in s['blocks'] if b['kind'] in ['cards','flow'])
            data=render(f,n,lang);out=ROOT/f'site/images/aase/m03-03-{n}-{lang}.svg'
            if args.check:assert out.read_bytes()==data,f'Out of date: {out}'
            else:out.write_bytes(data)
            print(out.name,len(data))
