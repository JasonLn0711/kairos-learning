"""Execute adopted code, not a second teaching implementation; all data stay in SQLite memory."""
import json,sqlite3,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'content/ceh-day02-a.json').read_text())
body=next(s for s in data['sections'] if s['id']=='p1-section-07')['body']
start=next(i for i,b in enumerate(body) if b.get('id')=='p1-binding-intro')
end=next(i for i in range(start+1,len(body)) if body[i].get('text')=='CEH 解題要記得：')
blocks=body[start:end];codes=[b['text'] for b in blocks if b['kind']=='code'];assert len(codes)==16
result=subprocess.run([sys.executable,'-I','-c',codes[13]],capture_output=True,text=True,timeout=10,check=True)
assert result.stdout.strip()==codes[14].strip(),(result.stdout,codes[14])
assert (ROOT/'docs/sources/ceh-day02-a/2026-11-14/parameterized-query/example.py').read_text().strip()==codes[13].strip()
checks=['complete adopted program prints unsafe two rows / parameterized zero rows']
with sqlite3.connect(':memory:') as db:
 db.execute('CREATE TABLE users (username TEXT, age INTEGER, role TEXT)')
 db.executemany('INSERT INTO users VALUES (?, ?, ?)',[('Alice',30,'admin'),('Bob',25,'user')])
 scope={'username':'Alice','cursor':db.cursor()}
 exec(compile(codes[0],'adopted-concatenation','exec'),scope);assert scope['cursor'].fetchall()==[('Alice',30,'admin')]
 for index in [9,10]:
  exec(compile(codes[index],'adopted-placeholder-example','exec'),scope);assert scope['cursor'].fetchall()==[('Alice',30,'admin')]
 checks.append('normal input, two positional parameters and named parameters match Alice only')
 assert isinstance(eval(codes[11],{'username':'Alice'}),str)
 assert eval(codes[12],{'username':'Alice'})==('Alice',)
 try:db.execute('SELECT * FROM users WHERE username = ?','Alice')
 except sqlite3.ProgrammingError:pass
 else:raise AssertionError('A bare string must not be treated as one bound value')
 checks.append('single-element tuple keeps one bound value; bare Alice string is not one value')
 payload="' OR '1'='1"
 scope.update(input=lambda _:payload)
 exec(compile(codes[15],'adopted-f-string-check','exec'),scope);assert len(scope['cursor'].fetchall())==2
 scope['username']=payload;exec(compile(codes[4],'adopted-binding','exec'),scope);assert scope['cursor'].fetchall()==[]
 checks.append('f-string remains injectable; identical bound input returns zero rows when absent')
 for name in ["O'Brien",payload]:
  db.execute('INSERT INTO users VALUES (?, ?, ?)',(name,40,'synthetic'))
  scope['username']=name;exec(compile(codes[4],'adopted-binding','exec'),scope)
  assert scope['cursor'].fetchall()==[(name,40,'synthetic')]
 checks.append('apostrophe and SQL-shaped real usernames are matched literally without deletion')
print(json.dumps({'environment':'SQLite in-memory; all snippets extracted from the published model','checks':checks,'complete_program_stdout':result.stdout},ensure_ascii=False))
