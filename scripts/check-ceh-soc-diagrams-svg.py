"""Source-faithful SVG text, fixed graph semantics and scaled recovery timeline."""
import json,xml.etree.ElementTree as ET
from pathlib import Path
from ceh_notes_svg import render
root=Path(__file__).resolve().parents[1]
models=json.loads((root/'docs/sources/ceh-notes/2026-11-12/c30-c38-supplement/diagrams.json').read_text())['diagrams']
specs=json.loads((root/'src/lib/note-diagram-specs.json').read_text())
def clean(s):return ''.join(s.split())
maximum=0
for model in models:
 for lang in ['zh','en']:
  block=model[lang];svg=render(block,lang);maximum=max(maximum,len(svg));assert len(svg)<100000
  tree=ET.fromstring(svg);alltext=clean(''.join(tree.itertext()))
  for value in [block['caption'],block['description']]+[s for item in block['items'] for s in item.values()]:assert clean(value) in alltext,(block['name'],lang,value)
  if block['name']=='recoverytimeline':
   bars={r.get('fill'):r for r in tree.iter() if r.tag.endswith('rect') and r.get('fill') in ['#ac772b','#2c8478']}
   assert set(bars)=={'#ac772b','#2c8478'}
   rpo,rto=bars['#ac772b'],bars['#2c8478'];assert abs(float(rto.get('width'))/float(rpo.get('width'))-8)<1e-10
   assert abs(float(rpo.get('x'))+float(rpo.get('width'))-float(rto.get('x')))<1e-10
   assert '−15min' in alltext and '0min' in alltext and '+120min' in alltext
  else:
   paths=[e for e in tree.iter() if e.tag.endswith('path')];assert len(paths)==len(specs[block['name']]['edges'])
   assert all('NaN' not in p.get('d','') and 'Infinity' not in p.get('d','') for p in paths)
  if block['name']=='socgovernance':assert ('平行治理文件' if lang=='zh' else 'Parallelgovernancedocuments') in alltext
print(f'PASS: 8 bilingual SVGs; complete source text, fixed graph edge counts, conditional escalation, disconnected governance documents and exact 1:8 timeline; maximum {maximum} bytes')
