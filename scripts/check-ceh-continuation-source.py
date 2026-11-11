"""Check original bytes, all 661 paired source units, adoption ranges and actual body equality."""
import hashlib,html,json,re,sys
from pathlib import Path
from ceh_note_continuation import SOURCE,ROOT,build_source_edition
LABELS={'OWASP Web Security Testing Guide+1','Information security management systems+2','Requirements and guidance','Microsoft Learn','Business continuity management systems+1','NIST','CSRC','NIST Computer Security Resource Center','Schneier on Security+2','sweet32.info','RFC Editor','IETF Datatracker','Nature+1','csrc.nist.gov+1','CSRC+1','Schneier on Security+1','csrc.nist.gov','GitHub+1','GitHub','Rohos+2','Microsoft Learn+1','NIST Computer Security Resource Center+1','RFC Editor+1','PubMed+1'}
UI={'顯示答案','已作答 0 / 5 題提交答案並批改','提交五題答案並批改','0 / 5 已作答'}
manifest=json.loads((SOURCE/'manifest.json').read_text())
assert len(manifest['files'])==19
for f in manifest['files']:
 data=(SOURCE/f['file']).read_bytes()
 assert len(data)==f['bytes'] and hashlib.sha256(data).hexdigest()==f['sha256'],f['file']
refs=json.loads((SOURCE/'reference-diagrams.json').read_text());assert [r['reference'] for r in refs]==list(range(1,18))
note=json.loads((ROOT/'content/ceh-notes/2026-11-10.json').read_text());ledger=[]
for part,expected in [(2,302),(3,359)]:
 raw=(SOURCE/f'pasted-text-{part-1}.txt').read_text();lines=[]
 for line in raw.splitlines():
  if 'chatgpt-mermaid-' in line:line='[原圖文字] '+line[line.rfind(';}')+2:]
  if line.startswith('[image](') or line.strip() in LABELS:continue
  line=html.unescape(line).strip()
  if line in UI:continue
  lines.append(line)
 normalized=re.sub(r'\n{3,}','\n\n','\n'.join(lines))
 paragraphs=[p.strip() for p in normalized.split('\n\n') if p.strip()]
 records=json.loads((SOURCE/f'part-{part}-paragraph-map.json').read_text())
 assert len(records)==len(paragraphs)==expected
 assert [r['index'] for r in records]==list(range(expected))
 assert [r['zh'] for r in records]==paragraphs,'Chinese source changed beyond the declared normalization'
 assert all(isinstance(r['en'],str) and r['en'].strip() for r in records)
 edition,rows=build_source_edition(part,refs)
 covered=[i for row in rows for i in range(row['units'][0],row['units'][1]+1)]
 assert covered==list(range(expected)),'Missing or multiply adopted source unit'
 actual=next(p for p in note['parts'] if p['number']==part)
 for lang in ['zh','en']:assert actual['text'][lang]['sections'][-len(edition[lang]):]==edition[lang],'Actual body differs from full adopted source'
 ledger.extend(rows)
output=json.dumps(ledger,ensure_ascii=False,indent=2)+'\n';p=SOURCE/'adoption-ledger.json'
if '--check' in sys.argv:assert p.read_text()==output
else:p.write_text(output)
print('PASS: 19 original hashes; 661 source units; complete bilingual body; 17 reference ranges; no missing or duplicated adoption units')
