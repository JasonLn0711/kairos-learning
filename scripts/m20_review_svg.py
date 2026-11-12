"""Generate the ten M20 exports using the existing reviewed SVG serializer."""
import json,sys
from pathlib import Path
from ceh_notes_svg import render
ROOT=Path(__file__).resolve().parents[1]
def main():
 review=json.loads((ROOT/'content/ceh-m20-review.json').read_text())
 figures=[b for s in review['sections'] for b in s['body'] if b['kind']=='diagram']
 assert len(figures)==10 and len({b['name'] for b in figures})==10
 for b in figures:
  data=render(b,'zh');out=ROOT/f'site/images/ceh-notes/2026-11-12-part-20-{b["name"]}-zh.svg'
  if '--check' in sys.argv:assert out.read_bytes()==data,f'Outdated: {out}'
  else:out.write_bytes(data)
  print(out.name,len(data))
if __name__=='__main__':main()
