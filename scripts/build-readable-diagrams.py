"""Export exact labels from scoped repository SVGs; never interpret coordinates as causal edges."""
import json,xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
result={}
m0107=json.loads((ROOT/'docs/sources/m01-07/diagram-data.json').read_text())
for file in sorted((ROOT/'content/concepts').glob('m0[12]-*.json')):
    lesson=json.loads(file.read_text())
    for lang in ['zh','en']:
        for block in lesson['text'][lang].get('sourceBody',[]):
            if block['kind'] not in ['sourceImage','visual']:continue
            # Existing M01 native HTML diagrams already expose all their labels.
            if lesson['id']!='M01-07' and not lesson['id'].startswith('M02-'):continue
            root=ET.parse(ROOT/'site'/block['src'].lstrip('/')).getroot()
            labels=[]
            rows=[]
            previous=None
            rectangles=[]
            for rect in root.iter('{http://www.w3.org/2000/svg}rect'):
                try:rectangles.append(tuple(float(rect.get(k,'0')) for k in ['x','y','width','height']))
                except ValueError:pass
            for node in root.iter('{http://www.w3.org/2000/svg}text'):
                text=''.join(node.itertext()).strip()
                if text:
                    labels.append(text)
                    # Group adjacent lines only when their anchor belongs to the same
                    # smallest source rectangle. This preserves source order, not edges.
                    try:
                        x,y=float(node.get('x','nan')),float(node.get('y','nan'))
                        matches=[r for r in rectangles if r[0]<=x<=r[0]+r[2] and r[1]<=y<=r[1]+r[3]]
                        owner=min(matches,key=lambda r:r[2]*r[3]) if matches else None
                    except ValueError:owner=None
                    if owner is not None and owner==previous:rows[-1].append(text)
                    else:rows.append([text])
                    previous=owner
            desc=root.find('{http://www.w3.org/2000/svg}desc')
            description=''.join(desc.itertext()).strip() if desc is not None else block.get('alt','')
            # Preserve exact source order; adjacent SVG text lines form readable rows only.
            data={'description':description,'rows':rows}
            if lesson['id']=='M01-07':
                images=[b for b in lesson['text'][lang]['sourceBody'] if b['kind']=='sourceImage']
                _,caption,description,rows=m0107[lang][images.index(block)]
                data={'description':description,'rows':rows}
            result.setdefault(block['src'],{})[lang]=data
path=ROOT/'src/lib/m01-m02-readable-diagrams.json'
content=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
if '--check' in __import__('sys').argv:
    assert path.read_text()==content,'Regenerate readable diagram labels'
else:path.write_text(content)
print(f'{len(result)} bilingual diagram text exports verified')
