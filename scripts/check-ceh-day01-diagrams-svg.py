"""Independent source/model/SVG boundary and semantic checks, no site build."""
import json,xml.etree.ElementTree as ET
from pathlib import Path
from ceh_notes_svg import render
root=Path(__file__).resolve().parents[1]
models=json.loads((root/'docs/sources/ceh-notes/2026-11-12/controls-risk-supplement/diagrams.json').read_text())['diagrams']
def norm(v):return ''.join(v.split()).replace('/','').replace('／','')
maximum=0
for model in models:
 for lang in ['zh','en']:
  b=model[lang];svg=render(b,lang);maximum=max(maximum,len(svg));assert len(svg)<100000
  tree=ET.fromstring(svg);text=norm(''.join(tree.itertext()))
  for value in [b['caption'],b['description']]+[v for item in b['items'] for v in item.values()]:assert norm(value) in text,(b['name'],lang,value)
  if b['name']=='controlcounts':
   bars=[el for el in tree.iter() if el.tag.endswith('rect') and el.get('fill')=='#3d7660']
   assert len(bars)==4
   for el,count in zip(bars,[37,8,14,34]):assert abs(float(el.get('width'))/844-count/93)<1e-9
  if b['name']=='defenselayers':
   boxes=[el for el in tree.iter() if el.tag.endswith('rect') and el.get('stroke')=='#adc8bc']
   assert len(boxes)==4
   for outer,inner in zip(boxes,boxes[1:]):
    assert float(outer.get('x'))<float(inner.get('x')) and float(outer.get('width'))>float(inner.get('width'))
    assert float(outer.get('y'))<float(inner.get('y')) and float(outer.get('y'))+float(outer.get('height'))>float(inner.get('y'))+float(inner.get('height'))
  if b['name']=='pdcacycle':
   assert 'Plan → Do → Check → Act → Plan' in ''.join(tree.itertext())
   positions=[]
   for item in b['items']:
    el=next(el for el in tree.iter() if el.tag.endswith('text') and el.text==item['title']);positions.append((float(el.get('x')),float(el.get('y'))))
   assert positions[0][0]<positions[1][0] and positions[3][0]<positions[2][0] and positions[0][1]<positions[3][1]
print(f'PASS: 26 SVGs, complete bilingual model text, whitelist, proportions, nesting and PDCA cycle; maximum {maximum} bytes')
