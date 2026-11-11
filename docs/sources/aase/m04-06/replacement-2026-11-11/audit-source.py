"""Verify every supplied source unit against the adopted manuscript and figure text."""
import json,re,sys
from pathlib import Path
p=Path(__file__).resolve().parent
root=p.parents[4]
def norm(s):
 s=re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',s).replace('\\*\\*','')
 return re.sub(r'\s','',s)
lesson=json.loads((root/'content/aase/lessons/aase-m04-c06.json').read_text())
figures=[b for s in lesson['text']['zh']['sections']for b in s.get('blocks',[])if b['kind']=='cards']
figuretext='\n'.join(f['caption']+' '+f['description'] for f in figures)+'\n'+'\n'.join(x for f in figures for item in f['items']for x in item.values())
target=norm((p/'teaching.zh.md').read_text()+'\n'+figuretext)
records=[]
for index,unit in enumerate(re.split(r'\n\s*\n',(p/'source.zh.txt').read_text())):
 if not unit.strip():continue
 if norm(unit)in target:status='adopted_verbatim_or_format_normalized'
 elif unit.startswith('[image]')or unit.strip()in ['W3C','W3C+1','CS Kairos Learn']or unit.startswith('[Error validation - CMS Design System]'):status='source_interface_residue_preserved_only'
 elif unit.startswith('你回答後，我會逐項評估'):status='replaced_dialogue_promise_with_native_reference_answers'
 else:raise AssertionError(f'unmapped source unit {index}: {unit[:80]}')
 records.append(dict(unit=index,source=unit,status=status))
data=json.dumps(records,ensure_ascii=False,indent=2)+'\n'
if '--check'in sys.argv:assert (p/'adoption-audit.json').read_text()==data
else:(p/'adoption-audit.json').write_text(data)
print(f'PASS: {len(records)} source units mapped; no unclassified omission.')
