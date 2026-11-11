"""Verify exact source units and the explicitly reviewed adoption/correction inventory."""
from pathlib import Path
import json,re,hashlib
ROOT=Path(__file__).resolve().parents[1];P=ROOT/'docs/sources/aase/m06-01/replacement-2026-11-11'
def strings(x):
 if isinstance(x,str):yield x
 elif isinstance(x,list):
  for v in x:yield from strings(v)
 elif isinstance(x,dict):
  for v in x.values():yield from strings(v)
def norm(s):return re.sub(r'\s','',re.sub(r'^(?:#+ |[123]\\\. |[ABC]\. )','',s))
def main():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m06-c01.json').read_text());units=re.split(r'\n\s*\n',(P/'original.txt').read_text().strip());mapping=json.loads((P/'adoption-map.json').read_text())
 assert len(mapping)==len(units)==106
 targets={s['id']:norm(' '.join(strings(s)))for s in lesson['text']['zh']['sections']}
 targets.update({'checks/'+q['id']:norm(' '.join(strings(q['text']['zh'])))for q in lesson['checks']})
 for i,(unit,entry)in enumerate(zip(units,mapping)):
  assert entry['sourceIndex']==i and entry['sha256']==hashlib.sha256(unit.encode()).hexdigest(),i
  if entry['adoption']in ['verbatim','table']:actual=targets[entry['target']]
  if entry['adoption']=='verbatim':assert norm(unit)in actual,i
  elif entry['adoption']=='table':
   cells=[v.strip()for line in unit.splitlines()if line.startswith('|')and not re.fullmatch(r'[| :\-]+',line)for v in line.strip('|').split('|')];assert all(norm(c)in actual for c in cells),i
  else:assert entry['adoption']in ['corrected','figure','editorial']and entry['reason']and entry['target'],i
 print('PASS: 106 immutable source units; exact text/tables checked; all figure, correction and editorial exceptions explicitly mapped. Semantic review remains in source-map.md.')
if __name__=='__main__':main()
