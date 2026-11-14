"""Reviewed serializers for the supplied note diagrams; text comes from note JSON."""
import json
from pathlib import Path
from html import escape
from aase_m0104_svg import wrap

SPECS=json.loads((Path(__file__).resolve().parents[1]/'src/lib/note-diagram-specs.json').read_text())
DIRECTIONS=['to-server','to-client','both','to-client','to-client','to-client','client','to-server','to-server','to-client']
SHIELD='M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z'
MARKS=['m8 12 3 3 5-6','M12 8v5m0 3v1','M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3v1']

def render_reference(b,lang):
    assert set(b)=={'kind','name','caption','description','items'}
    spec=SPECS[b['name']]
    assert len(b['items'])==spec['count']
    assert all(set(i)=={'title','body'} for i in b['items'])
    if spec['layout'].startswith('day02-'):
        from ceh_day02a_supplement_svg import render_supplement
        return render_supplement(b,lang,spec)
    if spec['layout']=='soc-timeline':
        from ceh_note_recovery_svg import render_recovery_timeline
        return render_recovery_timeline(b,lang)
    if spec['layout'].startswith('day01-'):
        from ceh_note_day01_svg import render_day01
        return render_day01(b,lang,spec)
    if spec['layout'].startswith('continuation-'):
        from ceh_note_continuation_svg import render_continuation
        return render_continuation(b,lang,spec)
    out=[]
    def text(value,x,y,width,size=18,bold=False,center=False):
        for paragraph in value.split('\n'):
            for line in wrap(paragraph,width):
                out.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}" text-anchor="{"middle" if center else "start"}">{escape(line)}</text>')
                y+=32
        return y
    def rect(x,y,w,h,fill='#fbfcfd',stroke='#d8dce0'):
        return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="{stroke}"/>'
    def path(d,color='#657079',extra=''):
        out.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="2" {extra}/>')
    def down(y,x=450):
        path(f'M{x} {y}v22m-6-6 6 6 6-6')
    def card(item,x,y,w=404,fill='#f5f7f8',center=False):
        start=len(out);cy=y+34;tx=x+w/2 if center else x+18
        cy=text(item['title'],tx,cy,(w-36)//20,20,True,center)
        cy=text(item['body'],tx,cy+8,(w-36)//18,18,False,center)+8
        out.insert(start,rect(x,y,w,cy-y,fill))
        return cy
    y=text(b['caption'],28,40,41,22,True)+18
    layout=spec['layout']
    if layout=='tcp-handshake':
        for x,label in [(28,'Client'),(508,'Server')]:
            out.append(rect(x,y,364,64,'#e8ecef','#94a3b8'));text(label,x+182,y+39,16,24,True,True)
        y+=94;top=y;insert=len(out)
        for i,item in enumerate(b['items']):
            y=text(item['title'],450,y+24,34,22,True,True)
            y=text(item['body'],450,y+6,34,18,False,True)
            if i==1:path(f'M690 {y+4} 210 {y+56}m18-16-18 16 24 5','#008c83')
            else:path(f'M210 {y+4} 690 {y+56}m-24 5 24-5-18-16','#245fe8')
            y+=96
        out.insert(insert,f'<path d="M210 {top-28}V{y-15}M690 {top-28}V{y-15}" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="8 10"/>')
    elif layout in ('flow','layers','numbered'):
        for index,item in enumerate(b['items']):
            if layout=='numbered':
                out.append(rect(28,y,58,58,'#f1f3f4'))
                text(f'{index+1:02}',57,y+35,3,22,True,True)
                cy=text(item['title'],108,y+28,36,20,True)
                cy=text(item['body'],108,cy+6,36)+10
            else:
                center=layout=='flow';x=450 if center else 42
                if b['name']=='overview':
                    icon=[SHIELD,'M3 8 12 3l9 5-9 5-9-5Zm0 5 9 5 9-5M3 18l9 5 9-5','M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 6 6M7 10l2 2 4-4'][index]
                    path(icon,'#18252c',f'transform="translate(438 {y})"');y+=50
                cy=text(item['title'],x,y+24,39,20,True,center)
                cy=text(item['body'],x,cy+8,39,18,False,center)+10
            if index<len(b['items'])-1:
                down(cy+2,57 if layout=='numbered' else 450);cy+=62
            y=cy+14
    elif layout=='rows':
        for index,item in enumerate(b['items']):
            color=['#006b39','#b52323','#18252c'][index]
            out.append(rect(28,y,62,62,['#eaf5f1','#f9eeee','#f1f3f4'][index]))
            path(SHIELD,color,f'transform="translate(40 {y+12}) scale(1.6)"')
            path(MARKS[index],color,f'transform="translate(40 {y+12}) scale(1.6)"')
            cy=text(item['title'],110,y+28,35,20,True)
            y=text(item['body'],110,cy+8,35)+28
            if index<len(b['items'])-1:path(f'M28 {y}H872','#e1e5e8');y+=26
    elif layout=='table':
        for item in b['items']:
            top=y
            a=text(item['title'],42,top+26,13,18,True)
            c=text(item['body'],332,top+26,26)
            y=max(a,c)+12;path(f'M28 {y}H872','#d8dce0');y+=18
    elif layout in ('parallel','branches'):
        if layout=='branches':
            y=text('題目到底在問什麼？' if lang=='zh' else 'What is the question asking?',450,y,39,20,True,True)+10
            down(y);y+=54
        for index in range(0,len(b['items']),2):
            ends=[]
            for j,item in enumerate(b['items'][index:index+2]):ends.append(card(item,28+j*430,y))
            y=max(ends)+24
    elif layout=='sequence':
        labels=['瀏覽器','網站伺服器'] if lang=='zh' else ['Browser','Web server']
        def endpoints(top):
            for x,label in zip([28,508],labels):
                out.append(rect(x,top,364,64,'#e6f3e9','#4a9865'));text(label,x+182,top+38,16,20,True,True)
            return top+88
        y=endpoints(y);start=y;line_insert=len(out)
        for index,item in enumerate(b['items']):
            direction=DIRECTIONS[index]
            if direction in ('both','client'):
                y=card(item,96,y,708,'#f7f3ea',True)+24
            else:
                label=('瀏覽器 → 網站伺服器' if direction=='to-server' else '網站伺服器 → 瀏覽器') if lang=='zh' else ('Browser → Web server' if direction=='to-server' else 'Web server → Browser')
                y=text(label,450,y+18,34,16,False,True)
                y=text(item['title'],450,y+4,34,20,True,True)
                if direction=='to-server':path(f'M210 {y}H690m-9-7 9 7-9 7')
                else:path(f'M690 {y}H210m9-7-9 7 9 7',extra='stroke-dasharray="6 5"')
                y=text(item['body'],450,y+36,32,18,False,True)+20
        out.insert(line_insert,f'<path d="M210 {start-24}V{y}M690 {start-24}V{y}" fill="none" stroke="#899296" stroke-width="2"/>')
        y=endpoints(y)
    else:raise ValueError(layout)
    y=text(b['description'],28,y+30,41,17)+24
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(b["caption"])}</title><desc id="desc">{escape(b["description"])}</desc><rect width="900" height="{y}" fill="#fbfcfd"/><g fill="#18252c" font-family="Arial, Noto Sans CJK TC, sans-serif">'+''.join(out)+'</g></svg>\n'
