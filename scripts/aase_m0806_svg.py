"""Export the fixed five-stage regression flow from validated lesson content."""
import json,sys
from pathlib import Path
from aase_m0104_svg import render
ROOT=Path(__file__).resolve().parents[1]
lesson=json.loads((ROOT/'content/aase/lessons/aase-m08-c06.json').read_text())
for lang in ['zh','en']:
 figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']=='flow']
 assert len(figures)==1 and len(figures[0]['items'])==5
 # Same constrained serializer and geometry; match the supplied final-stage green.
 data=render(figures[0],'process',lang).replace(b'#f9f0eb',b'#eaf6ef').replace(b'#b54b25',b'#ccdfd3')
 out=ROOT/f'site/images/aase/m08-06-1-{lang}.svg'
 if '--check'in sys.argv:assert out.read_bytes()==data
 else:out.write_bytes(data)
 print(f'{out.name}: {len(data)} bytes')
