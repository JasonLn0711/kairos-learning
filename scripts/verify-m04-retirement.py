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
assert [json.loads(p.read_text())['id'] for p in (R/'content/concepts').glob('ceh26-m04-*.json')]==['CEH26-M04-C01']
search=json.loads((B/'search-index.json').read_text());assert {e['id'] for e in search if e['label']=='CEH M04'}=={'CEH26-M04-C01'}
# Exact retired identifiers/URLs and full unique teaching summaries, Q&A prompts and answers.
markers=set()
for item in M['legacyConcepts']:
 if item['id']!='M04-01':markers.update(item['urls']) # m04-01 now hosts only the new stable ID by explicit URL policy.
 if item['id']!='M04-01':markers.add(item['id']) # New display alias CEH M04-01 is intentional; legacy URL remains excluded.
 t=json.loads((R/item['archivePath']).read_text())
 for lang in ['zh','en']:
  markers.add(t['text'][lang]['summary'])
  for q in t.get('qa',[]):
   markers.add(q['text'][lang]['question'])
   markers.update(x for x in q['text'][lang]['answer'] if len(x)>80)
markers.update(['/courses/ceh/v13/m04/concepts/ceh26-m04-c01/','/en/courses/ceh/v13/m04/concepts/ceh26-m04-c01/'])
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
 assert (B/f'{prefix}courses/ceh/v13/m04/concepts/m04-01/index.html').is_file()
 assert len(list((B/f'{prefix}courses/ceh/v13/m04/concepts').glob('*/index.html')))==1
 assert f'/{prefix}courses/ceh/v13/m04/concepts/m04-01/' in (B/f'{prefix}courses/ceh/v13/m03/concepts/m03-08/index.html').read_text()
current=json.loads((R/'content/concepts/ceh26-m04-c01.json').read_text())
assert hashlib.sha256(json.dumps(dict(text=current['text'],qa=current['qa']),ensure_ascii=False,separators=(',',':')).encode()).hexdigest()=='0b34af70e3490bc8c406a70c8ce380d2920fd57eda756bb0d3e4b0ef5ce2b6e0'
# Compare unrelated current teaching to this URL migration baseline, preserving newer M03 revisions.
unchangedBaseline='dd1adcad0c734d169bbdf7cf3eb9b36ec9ae7041'
for path in subprocess.check_output(['git','ls-tree','-r','--name-only',unchangedBaseline],cwd=R,text=True).splitlines():
 if (path.startswith('content/concepts/') and not path.startswith('content/concepts/m04-') and path!='content/concepts/ceh26-m04-c01.json') or path.startswith('site/courses/matlab-practice/'):
  assert (R/path).read_bytes()==subprocess.check_output(['git','show',unchangedBaseline+':'+path],cwd=R),path
print(f"PASS: {len(M['files'])} archived originals restored byte-for-byte; 1 published + 9 pending units; {len(outputs)} outputs exclude {len(markers)} retired markers; other concepts and MATLAB unchanged.")
