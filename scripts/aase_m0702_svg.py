"""Export the two reviewed diagrams using the existing fixed text-only serializer."""
import json,sys
from pathlib import Path
from aase_m0104_svg import render
ROOT=Path(__file__).resolve().parents[1]
lesson=json.loads((ROOT/'content/aase/lessons/aase-m07-c02.json').read_text())
for lang in ['zh','en']:
 for n,section,kind,count in [(1,'contract','flow',5),(2,'review','cards',2)]:
  f=next(b for s in lesson['text'][lang]['sections']if s['id']==section for b in s['blocks']if b['kind']==kind)
  assert len(f['items'])==count
  data=render(f,'process'if n==1 else'evidence',lang)
  path=ROOT/f'site/images/aase/m07-02-{n}-{lang}.svg'
  if '--check'in sys.argv:assert path.read_bytes()==data,f'outdated {path}'
  else:path.write_bytes(data)
print('PASS: four reviewed SVG exports synchronized.')
