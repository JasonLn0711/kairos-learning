"""Export the two reference-derived FTP/SMTP diagrams from their bilingual HTML model."""
from pathlib import Path
from html import escape
import json,sys,re,unicodedata
from m0903_svg import sanitized_svg,NS
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/ceh26-m04-c03/replacement-2026-11-05'
def width(s):return sum(2 if unicodedata.east_asian_width(c) in 'WF' else 1 for c in s)
def wrap(s,limit):
    tokens=re.findall(r'[A-Za-z0-9_./:|\-]+|.',s);lines=[];line=''
    for token in tokens:
        if line and width(line+token)>limit:lines.append(line.strip());line=''
        line+=token
    if line:lines.append(line.strip())
    assert all(width(line)<=limit for line in lines),(s,limit)
    return lines

def generate():
    targets={};models=json.loads((S/'diagram-models.json').read_text());assert set(models)=={'protocols','evidence'}
    for key,pair in models.items():
        assert set(pair)=={'zh','en'}
        for lang,b in pair.items():
            v=b['visual'];items=v['items'];assert v['kind']=='cards'
            assert len(items)==(11 if key=='protocols' else 3)
            assert all(set(item)=={'title','body'} and all(isinstance(value,str) and value.strip() for value in item.values()) for item in items)
            assert b['src']==f'/images/ceh/m04-03-{key}-{lang}-v1-1-0.svg'
            if key=='evidence':assert all(len(item['body'].split('\n'))==3 for item in items)
            prefix=f'ftpsmtp-{key}-{lang}-';parts=[];h=1250 if key=='protocols' else 850
            def rect(x,y,w,h,fill='#ffffff',stroke='#b7c9df'):
                parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" fill="{fill}" stroke="{stroke}"/>')
            def text(value,x,y,w,size=24,color='#173450'):
                lines=wrap(value,int(w/(size*.59)))
                for j,line in enumerate(lines):parts.append(f'<text x="{x}" y="{y+j*size*1.5}" font-family="Noto Sans CJK TC,sans-serif" font-size="{size}" fill="{color}">{escape(line)}</text>')
                return len(lines)*size*1.5
            def arrow(x1,x2,y,double=False):
                parts.append(f'<path d="M{x1} {y}H{x2}m-12-8 12 8-12 8'+(f'M{x1+12} {y-8}l-12 8 12 8' if double else '')+'" fill="none" stroke="#205e96" stroke-width="3"/>')
            def node(index,x,y,w=230):
                rect(x,y,w,150,'#e4f3f0' if index==6 else '#e7f0ff')
                used=text(items[index]['title'],x+16,y+35,w-32,24)
                text(items[index]['body'],x+16,y+45+used,w-32,21)
            text(v['caption'],45,55,1110,30)
            if key=='protocols':
                rect(30,145,1140,430);text('FTP',55,187,1080,28)
                node(0,65,280);node(1,905,280)
                text(items[2]['title'],340,235,520,24);arrow(325,875,292,True)
                text(items[2]['body'],340,325,520,20)
                text(items[3]['title'],340,375,520,24,color='#11635d');arrow(325,875,432,True)
                text(items[3]['body'],340,465,520,20,color='#11635d')
                rect(55,490,1090,80,'#ecf8f5');text(items[4]['title']+'：'+items[4]['body'],75,525,1050,21,color='#11635d')
                rect(30,600,1140,400);text('SMTP',55,645,1080,28)
                node(5,60,700,240);node(6,480,700,240);node(7,900,700,240)
                for index,x1,x2 in [(8,320,460),(9,740,880)]:
                    text('TCP '+items[index]['title'],x1,725,x2-x1,20);arrow(x1,x2,775)
                    text(items[index]['body'],x1,815,x2-x1,17)
                rect(55,900,1090,70,'#fff2e1');text(items[10]['title']+'：'+items[10]['body'],75,935,1050,21,color='#885217')
                text(v['description'],45,1050,1110,22)
            else:
                for i,item in enumerate(items):
                    x=40+i*390;color=['#205e96','#11635d','#885217'][i]
                    rect(x,165,350,455);rect(x+15,185,320,110,['#e7f0ff','#e1f5ef','#fff2e1'][i])
                    text(item['title'],x+30,225,290,25,color)
                    y=345
                    for line in item['body'].split('\n'):
                        used=text(line,x+25,y,300,23,color);y+=max(100,used+25)
                text(v['description'],45,685,1110,22)
            svg=f'<svg xmlns="{NS}" viewBox="0 0 900 {h*.75}" role="img" aria-labelledby="{prefix}title {prefix}desc"><title id="{prefix}title">{escape(v["caption"])}</title><desc id="{prefix}desc">{escape(v["description"])}</desc><g transform="scale(0.75)"><rect width="1200" height="{h}" fill="#f5f8fc"/>'+''.join(parts)+'</g></svg>'
            data=(sanitized_svg(svg,prefix)+'\n').encode();assert len(data)<100000
            targets[R/'site'/b['src'].lstrip('/')]=data
    return targets
if __name__=='__main__':
    for path,data in generate().items():
        if '--check' in sys.argv:assert path.read_bytes()==data,path
        else:path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)

    print(f'PASS: {"verified" if "--check" in sys.argv else "generated"} 4 bounded FTP/SMTP SVGs from the paired model',file=sys.stderr)
