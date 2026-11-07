"""Check full supplied Chinese coverage, paired anchors, code, tables and diagram exports."""
from pathlib import Path
import hashlib,json,re,subprocess
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/ceh26-m04-c05';V=S/'replacement-2026-11-05'
original=(V/'pasted-text-1.txt').read_text()
expected=original.replace('# CEH M04-05｜','# M04-05｜',1).replace('?utm_source=chatgpt.com','')
for n,key in [('14','roles'),('16','families'),('18','evidence')]:
 expected=re.sub(r':chatgpt-content-reference\{index="'+n+r'"\}\[下載 SVG 向量圖\]\(sandbox:[^)]+\)',f'[[figure:{key}]]',expected)
expected=expected.replace('請直接回答這三題。我會依照「已確認事實、合理推論、尚未取得的證據」三個層次，逐題評估你的理解。','請依照「已確認事實、合理推論、尚未取得的證據」三個層次回答這三題，再展開參考答案核對。')
assert expected==(S/'teaching.zh-TW.md').read_text(),'Supplied full text drift outside declared edits'
for directory in [S,V]:
 for name,digest in json.loads((directory/'sha256.json').read_text()).items():assert hashlib.sha256((directory/name).read_bytes()).hexdigest()==digest,name
lesson=json.loads((R/'content/concepts/ceh26-m04-c05.json').read_text());mapping=json.loads((V/'detailed-section-map.json').read_text())
assert len(mapping)==38
for lang,suffix in [('zh','zh-TW'),('en','en')]:
 body=lesson['text'][lang]['sourceBody'];md=(S/f'teaching.{suffix}.md').read_text()
 assert [(b['id'],b['text']) for b in body if b.get('id') and b['kind']!='answer']==[(h['id'],h[lang].replace('**','').replace('`','')) for h in mapping]
 code=[b['text'] for b in body if b['kind']=='code'];assert code==re.findall(r'```[^\n]*\n(.*?)\n```',md,re.S)
 assert len(code)==37 and sum(b['kind']=='table' for b in body)==9
 assert len([b for b in body if b['kind']=='visual'])==3
 assert sum(b['kind']=='answer' for b in body)==1 and lesson['qa']==[]
for name in ['content','diagrams']:subprocess.run(['python3',str(R/f'scripts/ceh26_m04_c05_{name}.py'),'--check'],check=True)
print('PASS: supplied Chinese exact adopted text, 38 paired anchors, 9 tables, 37 code blocks, 3 paired diagrams, hashes and deterministic exports')
