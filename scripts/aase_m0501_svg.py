"""Export the fixed five-stage workflow from its bilingual lesson data."""
import json,sys
from pathlib import Path
from aase_m0104_svg import render
ROOT=Path(__file__).resolve().parents[1]
def exports():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m05-c01.json').read_text())
 for lang in ['zh','en']:
  section=next(s for s in lesson['text'][lang]['sections']if s['id']=='verification')
  figure=section['blocks'][0];assert figure['kind']=='flow' and len(figure['items'])==5
  # Keep the reference's neutral verification border using the reviewed process exporter.
  data=render(figure,'process',lang).replace(b'#f9f0eb',b'#fbfcfd').replace(b'#b54b25',b'#64748b').replace(b'<text x="64"',b'<text text-anchor="middle" x="520"')
  yield ROOT/f'site/images/aase/m05-01-workflow-{lang}.svg',data
if __name__=='__main__':
 for target,data in exports():
  if '--check'in sys.argv:assert target.read_bytes()==data,f'outdated {target}'
  else:target.write_bytes(data)
  print(f'{target.name}: {len(data)} bytes')
