"""Verify retired M04 sources are recoverable and absent from every deployed surface."""
from pathlib import Path
import hashlib,json,re,subprocess,tempfile,zipfile
R=Path(__file__).resolve().parents[1];A=R/'archive/ceh/m04-legacy-2026-11-04';M=json.loads((A/'manifest.json').read_text());B=R/'build'
assert B.is_dir(),'Build first'
# Restore into an isolated temporary tree and compare every byte to the pre-change Git object.
with tempfile.TemporaryDirectory(prefix='m04-restore-') as tmp:
 for f in M['files']:
  data=(R/f['archivePath']).read_bytes();assert hashlib.sha256(data).hexdigest()==f['sha256'],f
  assert data==subprocess.check_output(['git','show',M['baselineCommit']+':'+f['originalPath']],cwd=R),f['originalPath']
  target=Path(tmp)/f['originalPath'];target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
  assert target.read_bytes()==data
registry=json.loads((R/'content/concepts.json').read_text());units=[c for c in registry if c['module']=='m04']
assert [c['id'] for c in units]==M['newIds']
assert not list((R/'content/concepts').glob('m04-*.json'))
assert not any(json.loads(p.read_text())['id'] in M['newIds'] for p in (R/'content/concepts').glob('*.json'))
search=json.loads((B/'search-index.json').read_text());assert not any(e['label']=='CEH M04' for e in search)
# Exact retired identifiers/URLs and full unique teaching summaries, Q&A prompts and answers.
markers=set()
for item in M['legacyConcepts']:
 markers.update(item['urls']);markers.add(item['id'])
 t=json.loads((R/item['archivePath']).read_text())
 for lang in ['zh','en']:
  markers.add(t['text'][lang]['summary'])
  for q in t.get('qa',[]):
   markers.add(q['text'][lang]['question'])
   markers.update(x for x in q['text'][lang]['answer'] if len(x)>80)
lesson=json.loads((A/'content/lessons/ceh-m04-enumeration.json').read_text())
markers.add(lesson['id']);markers.update(M['legacyLesson']['urls'])
for q in lesson['questions']:
 for lang in ['zh','en']:markers.add(q['text'][lang]['prompt'])
outputs=[p for p in B.rglob('*') if p.is_file()]
for p in outputs:
 assert 'archive/' not in p.relative_to(B).as_posix(),p
 assert not re.search(r'm04[-0]\d',p.name,re.I),p
 if p.suffix in ['.html','.json','.js','.xml','.svg','.txt','.css']:
  text=p.read_text()
  for marker in markers:assert marker not in text,(p,marker[:80])
 if p.suffix=='.zip':
  with zipfile.ZipFile(p) as z:
   assert not any(re.search(r'm04[-0]\d',n,re.I) for n in z.namelist()),p
for prefix in ['', 'en/']:
 raw=(B/f'{prefix}courses/ceh/v13/m04/index.html').read_text()
 for id in M['newIds']:assert f'id="{id.lower()}"' in raw
 assert '待發布' in raw if not prefix else 'Pending publication' in raw
 assert not (B/f'{prefix}courses/ceh/v13/m04/quiz').exists()
 assert not (B/f'{prefix}courses/ceh/v13/m04/labs').exists()
 assert not (B/f'{prefix}courses/ceh/v13/m04/concepts').exists()
 assert f'/{prefix}courses/ceh/v13/m04/#ceh26-m04-c01' in (B/f'{prefix}courses/ceh/v13/m03/concepts/m03-08/index.html').read_text()
# All other teaching sources and MATLAB static assets retain exact baseline bytes.
for path in subprocess.check_output(['git','ls-tree','-r','--name-only',M['baselineCommit']],cwd=R,text=True).splitlines():
 if (path.startswith('content/concepts/') and not path.startswith('content/concepts/m04-')) or path.startswith('site/courses/matlab-practice/'):
  assert (R/path).read_bytes()==subprocess.check_output(['git','show',M['baselineCommit']+':'+path],cwd=R),path
print(f"PASS: {len(M['files'])} archived originals restored byte-for-byte; 10 pending units; {len(outputs)} outputs exclude {len(markers)} retired markers; other concepts and MATLAB unchanged.")
