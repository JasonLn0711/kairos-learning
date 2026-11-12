"""Full, source-mapped C17–C29 adoption; this module never writes public notes.

The immutable attachments, paired translations and figure models are the inputs.
Use --write to regenerate the reviewable adoption artifacts; --check checks drift.
"""
import argparse
import copy
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'docs/sources/ceh-notes/2026-11-12/controls-risk-supplement'
RANGES = {
    2: [(7,14,1),(38,59,2),(71,76,3),(112,121,4),(219,233,5),(251,262,6),(360,371,7)],
    3: [(10,19,8),(45,50,9),(65,78,10),(115,126,11),(213,223,12),(341,361,13)],
}
PREFIX = {2:'p2-controls',3:'p3-risk'}

def load(name):
    return json.loads((SOURCE / name).read_text())

def clean(text):
    """Normalize display syntax unsupported by InlineText, retaining link labels."""
    text = text.replace('\\&','&').replace('\\.','.').replace('`','').replace('\\*','').replace('**','')
    text = text.replace('\\\\[','').replace('\\\\]','').replace('\\\\(','').replace('\\\\)','')
    text = text.replace('\\text{Risk Score}','Risk Score').replace('\\text{Likelihood}','Likelihood').replace('\\text{Impact}','Impact').replace('\\times',' × ')
    def link(match):
        label, url = match.groups()
        split = urlsplit(url)
        query = [(k,v) for k,v in parse_qsl(split.query,keep_blank_values=True) if not k.lower().startswith('utm_')]
        return f'[{label}]({urlunsplit((split.scheme,split.netloc,split.path,urlencode(query),split.fragment))})'
    return re.sub(r'\[([^\]]+)\]\((https://[^\s)]+)\)',link,text).strip()

def block(text, original, ident):
    text = clean(text)
    if original.startswith('### '):
        return {'kind':'heading','id':ident,'text':re.sub(r'^#+\s*','',text)}
    if original.startswith('|'):
        rows = [[v.strip() for v in line.strip().strip('|').split('|')] for line in text.splitlines()]
        assert len(rows)>2 and all(re.fullmatch(r'[:\-\s]+',v) for v in rows[1]),ident
        assert all(len(r)==len(rows[0]) for r in rows),ident
        return {'kind':'table','headers':rows[0],'rows':rows[2:]}
    if original.startswith('- ') or re.match(r'^\d+\.\s',original):
        return {'kind':'list','items':[re.sub(r'^(?:- |\d+\.\s*)','',v) for v in text.splitlines()]}
    if original.startswith('\\\\[') or original.strip()=='`Sanitization completed successfully`':
        return {'kind':'code','text':text}
    return {'kind':'paragraph','text':text.removeprefix('> ')}

def compile_part(number):
    units = load(f'part-{number}-source-units.json')
    translations = load(f'part-{number}-translations.en.json')
    corrections = load('editorial-corrections.json')
    figures = {d['reference']:d for d in load('diagrams.json')['diagrams']}
    replacements = {a:(b,ref) for a,b,ref in RANGES[number]}
    ui = set()
    for i,u in enumerate(units):
        if u['zh'].startswith('[image]('):
            ui.update((i,i+1))
        if u['zh']=='CEH-Day01-A-2026-11-12(1).md':
            ui.add(i)
    result = {}
    ledger = []
    for lang in ('zh','en'):
        sections=[]
        subtitle = units[1]['zh'] if lang=='zh' else translations['1']
        i=2
        while i<len(units):
            u=units[i]
            if i in ui:
                if lang=='zh':ledger.append({'sourceUnits':[i,i],'sourceLines':u['lines'],'decision':'source-interface-only','target':None})
                i+=1
                continue
            original=u['zh']
            start=i
            if i in replacements:
                end,ref=replacements[i]
                sections[-1]['body'].append(copy.deepcopy(figures[ref][lang]))
                i=end+1
                decision='reference-redrawn-full-meaning'
            else:
                end=i
                text=original if lang=='zh' else translations[str(i)]
                correction=corrections.get(f'{number}:{i}')
                if correction:text=correction[lang]
                if original.startswith('## '):
                    sections.append({'id':f'{PREFIX[number]}-u{i}','heading':re.sub(r'^##\s*','',clean(text)),'body':[]})
                    if i==2:sections[-1]['body'].append({'kind':'paragraph','text':clean(subtitle)})
                else:
                    adopted=block(text,original,f'{PREFIX[number]}-u{i}')
                    if adopted['kind']=='table':
                        # Name the source's empty comparison stub for semantic HTML.
                        adopted['headers']=[v or ('比較項目' if lang=='zh' else 'Comparison') for v in adopted['headers']]
                    sections[-1]['body'].append(adopted)
                i+=1
                decision='substantive-correction' if correction else 'paired-full-text'
            if lang=='zh':
                ledger.append({'sourceUnits':[start,end],'sourceLines':[units[start]['lines'][0],units[end]['lines'][1]],'decision':decision,'target':sections[-1]['id'],'bodyIndex':len(sections[-1]['body'])-1 if not original.startswith('## ') else None})
        result[lang] = {'title':clean(units[0]['zh'] if lang=='zh' else translations['0']).removeprefix('# '),'sections':sections}
    ledger[:0]=[{'sourceUnits':[0,0],'sourceLines':units[0]['lines'],'decision':'part-title','target':f'part-{number}'},{'sourceUnits':[1,1],'sourceLines':units[1]['lines'],'decision':'part-subtitle','target':result['zh']['sections'][0]['id'],'bodyIndex':0}]
    # Every substantive source unit has an explicit destination or UI exclusion.
    covered=[i for entry in ledger for i in range(entry['sourceUnits'][0],entry['sourceUnits'][1]+1)]
    assert sorted(covered)==list(range(len(units))),f'part {number}: source unit coverage'
    assert len(result['zh']['sections'])==({2:15,3:12}[number])
    for zh,en in zip(result['zh']['sections'],result['en']['sections'],strict=True):
        assert zh['id']==en['id']
        assert len(zh['body'])==len(en['body']),zh['id']
        for a,b in zip(zh['body'],en['body'],strict=True):
            assert a['kind']==b['kind'],(zh['id'],a,b)
            if a['kind']=='list':assert len(a['items'])==len(b['items'])
            if a['kind']=='table':assert len(a['headers'])==len(b['headers']) and len(a['rows'])==len(b['rows'])
    return {'number':number,'status':'published','publishedOn':'2026-11-12','text':result},ledger

def line_ledger(number,ledger):
    lines=(SOURCE/f'pasted-text-{number-1}.txt').read_text().splitlines()
    out=[]
    for i,line in enumerate(lines,1):
        entries=[e for e in ledger if e['sourceLines'][0]<=i<=e['sourceLines'][1]] if line.strip() else []
        assert len(entries)==(1 if line.strip() else 0),(number,i,entries)
        out.append({'line':i,'decision':entries[0]['decision'] if entries else 'blank-separator','target':entries[0]['target'] if entries else None})
    return out

def artifacts():
    output={}
    for number in (2,3):
        part,ledger=compile_part(number)
        output[f'part-{number}-adopted.json']=part
        output[f'part-{number}-adoption-map.json']=ledger
        output[f'part-{number}-line-map.json']=line_ledger(number,ledger)
        output[f'part-{number}-chapter-map.json']=[e for e in ledger if e['decision']=='paired-full-text' and load(f'part-{number}-source-units.json')[e['sourceUnits'][0]]['zh'].startswith('#')]
    return output

def adopt_new_material(note):
    """Add/replace only Nov 12 parts 2/3, preserving the caller's other content."""
    if note['date']!='2026-11-12':
        raise ValueError('C17–C29 belong to the 2026-11-12 daily note')
    for number in (2,3):
        part,_=compile_part(number)
        note['parts']=[p for p in note['parts'] if p['number']!=number]
        note['parts'].append(part)
    note['parts'].sort(key=lambda p:p['number'])
    note['expectedParts']=3
    return note

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--write',action='store_true')
    parser.add_argument('--check',action='store_true')
    args=parser.parse_args()
    assert args.write or args.check,'choose --write or --check'
    for name,data in artifacts().items():
        content=json.dumps(data,ensure_ascii=False,indent=2)+'\n'
        path=SOURCE/name
        if args.write:path.write_text(content)
        else:assert path.read_text()==content,f'{name}: adoption drift'
    for record in load('sha256-manifest.json'):
        data=(SOURCE/record['file']).read_bytes()
        assert len(data)==record['bytes']
        assert hashlib.sha256(data).hexdigest()==record['sha256'],record['file']
    print('C17–C29: full source-unit and nonempty-line coverage, paired block shape, attachment hashes and adoption artifacts passed')

if __name__=='__main__':main()
