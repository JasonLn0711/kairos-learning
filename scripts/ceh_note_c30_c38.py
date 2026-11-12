"""Adopt the complete C30–C38 manuscript as Nov 12 part 4.

Raw attachments remain immutable. Translations, corrections and diagram models
are separate reviewable inputs; --write updates only derived source artifacts.
"""
import argparse
import copy
import hashlib
import json
import re
from pathlib import Path
from ceh_note_controls_risk import clean as base_clean, block as base_block

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/ceh-notes/2026-11-12/c30-c38-supplement'
RANGES=[(13,28,1),(53,62,2),(170,183,3),(232,234,4)]

def load(name):
    return json.loads((SOURCE/name).read_text())

def clean(text):
    text=base_clean(text)
    text=re.sub(r'\\text\{([^{}]*)\}',r'\1',text)
    return text.replace('\\not\\Rightarrow',' ⇏ ').strip()

def compile_part():
    units=load('source-units.json')
    translations=load('translations.en.json')
    corrections=load('editorial-corrections.json')
    supplements=load('editorial-supplements.json')
    figures={d['reference']:d for d in load('diagrams.json')['diagrams']}
    replacements={a:(b,reference) for a,b,reference in RANGES}
    ui=set()
    for i,unit in enumerate(units):
        if unit['zh'].startswith('[image]('):ui.update((i,i+1))
        if unit['zh']=='CEH-Day01-A-2026-11-12(1).md':ui.add(i)
    result={};ledger=[]
    for lang in ('zh','en'):
        sections=[];i=2
        while i<len(units):
            unit=units[i];start=i;original=unit['zh'];extra=0
            if i in ui:
                if lang=='zh':ledger.append({'sourceUnits':[i,i],'sourceLines':unit['lines'],'decision':'source-interface-only','target':None})
                i+=1;continue
            if i in replacements:
                end,reference=replacements[i]
                sections[-1]['body'].append(copy.deepcopy(figures[reference][lang]))
                i=end+1;decision='reference-redrawn-full-meaning'
            else:
                end=i;text=original if lang=='zh' else translations[str(i)]
                correction=corrections.get(str(i))
                if correction:text=correction[lang]
                if original.startswith('## '):
                    sections.append({'id':f'p4-soc-u{i}','heading':re.sub(r'^##\s*','',clean(text)),'body':[]})
                    if i==2:sections[-1]['body'].append({'kind':'paragraph','text':clean(units[1]['zh'] if lang=='zh' else translations['1'])})
                else:
                    adopted=base_block(clean(text),original,f'p4-soc-u{i}')
                    if adopted['kind']=='table':adopted['headers']=[v or ('比較項目' if lang=='zh' else 'Comparison') for v in adopted['headers']]
                    sections[-1]['body'].append(adopted)
                    for supplement in supplements.get(str(i),[]):
                        sections[-1]['body'].append(copy.deepcopy(supplement[lang]));extra+=1
                i+=1;decision='substantive-correction' if correction else 'paired-full-text'
            if lang=='zh':
                entry={'sourceUnits':[start,end],'sourceLines':[units[start]['lines'][0],units[end]['lines'][1]],'decision':decision,'target':sections[-1]['id'],'bodyIndex':None if original.startswith('## ') else len(sections[-1]['body'])-1-extra}
                if extra:entry['supplementBodyIndices']=list(range(len(sections[-1]['body'])-extra,len(sections[-1]['body'])))
                ledger.append(entry)
        result[lang]={'title':clean(units[0]['zh'] if lang=='zh' else translations['0']).removeprefix('# '),'sections':sections}
    ledger[:0]=[{'sourceUnits':[0,0],'sourceLines':units[0]['lines'],'decision':'part-title','target':'part-4'},{'sourceUnits':[1,1],'sourceLines':units[1]['lines'],'decision':'part-subtitle','target':'p4-soc-u2','bodyIndex':0}]
    covered=[i for entry in ledger for i in range(entry['sourceUnits'][0],entry['sourceUnits'][1]+1)]
    assert sorted(covered)==list(range(len(units))),'source-unit coverage'
    assert len(result['zh']['sections'])==16
    for zh,en in zip(result['zh']['sections'],result['en']['sections'],strict=True):
        assert zh['id']==en['id']
        for a,b in zip(zh['body'],en['body'],strict=True):
            assert a['kind']==b['kind'],(zh['id'],a,b)
            if a['kind']=='list':assert len(a['items'])==len(b['items'])
            if a['kind']=='table':assert len(a['headers'])==len(b['headers']) and len(a['rows'])==len(b['rows'])
    return {'number':4,'status':'published','publishedOn':'2026-11-12','text':result},ledger

def artifacts():
    part,ledger=compile_part()
    units=load('source-units.json')
    lines=[]
    for i,line in enumerate((SOURCE/'pasted-text-1.txt').read_text().splitlines(),1):
        entries=[e for e in ledger if e['sourceLines'][0]<=i<=e['sourceLines'][1]] if line.strip() else []
        assert len(entries)==(1 if line.strip() else 0),(i,entries)
        lines.append({'line':i,'decision':entries[0]['decision'] if entries else 'blank-separator','target':entries[0]['target'] if entries else None})
    chapters=[e for e in ledger if units[e['sourceUnits'][0]]['zh'].startswith('##')]
    return {'adopted.json':part,'adoption-map.json':ledger,'line-map.json':lines,'chapter-map.json':chapters}

def adopt_c30_c38(note):
    if note['date']!='2026-11-12':raise ValueError('C30–C38 belong to Nov 12')
    before=copy.deepcopy([p for p in note['parts'] if p['number']<4])
    part,_=compile_part()
    note['parts']=[p for p in note['parts'] if p['number']!=4]+[part]
    note['parts'].sort(key=lambda p:p['number'])
    note['expectedParts']=4;note['contentVersion']='1.1.0';note['revision']=2
    note['revisedOn']='2026-11-12'
    assert [p for p in note['parts'] if p['number']<4]==before,'prior parts changed'
    return note

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--write',action='store_true');parser.add_argument('--check',action='store_true');args=parser.parse_args()
    assert args.write or args.check,'choose --write or --check'
    for name,data in artifacts().items():
        text=json.dumps(data,ensure_ascii=False,indent=2)+'\n';path=SOURCE/name
        if args.write:path.write_text(text)
        else:assert path.read_text()==text,f'{name}: adoption drift'
    for record in load('sha256-manifest.json')+[load('before-note.sha256.json')]:
        data=(SOURCE/record['file']).read_bytes()
        assert len(data)==record['bytes'] and hashlib.sha256(data).hexdigest()==record['sha256'],record['file']
    print('C30–C38: all source units and nonempty lines accounted for; bilingual shapes, attachment bytes and adoption artifacts passed')

if __name__=='__main__':main()
