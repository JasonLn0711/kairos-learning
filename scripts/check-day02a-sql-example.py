"""Run only the adopted SQLite examples against two synthetic in-memory rows."""
import json,sqlite3
from pathlib import Path
root=Path(__file__).resolve().parents[1]
blocks=json.loads((root/'content/ceh-day02-a.json').read_text())['sections']
codes=[b['text'] for s in blocks for b in s['body'] if b['kind']=='code']
unsafe=next(c for c in codes if c.startswith('# 不安全的程式設計'))
safe=next(c for c in codes if c.startswith('# 使用 Python sqlite3'))
with sqlite3.connect(':memory:') as db:
 db.execute('CREATE TABLE users (username TEXT)')
 db.executemany('INSERT INTO users VALUES (?)',[('alice',),('bob',)])
 results=[]
 for username in ['alice',"' OR '1'='1"]:
  scope={'username':username,'cursor':db.cursor()}
  exec(compile(unsafe,'adopted-unsafe-example','exec'),scope)
  unsafe_count=len(db.execute(scope['sql']).fetchall())
  exec(compile(safe,'adopted-parameterized-example','exec'),scope)
  safe_count=len(scope['cursor'].fetchall())
  expected=(1,1) if username=='alice' else (2,0)
  assert (unsafe_count,safe_count)==expected
  results.append(dict(input=username,concatenated=unsafe_count,parameterized=safe_count))
print(json.dumps(dict(environment='SQLite in-memory, synthetic alice/bob',results=results),ensure_ascii=False))
