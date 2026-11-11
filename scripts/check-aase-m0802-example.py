"""Execute the exact published examples in fresh stage directories."""
import json,subprocess,sys,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def main():
 python=Path(sys.argv[1]).absolute()if len(sys.argv)>1 else Path(sys.executable)
 l=json.loads((ROOT/'content/aase/lessons/aase-m08-c02.json').read_text())
 sections={s['id']:s for s in l['text']['zh']['sections']}
 codes=lambda sid:[b['code']for b in sections[sid]['blocks']if b.get('code')]
 red,base=codes('red-stage')[:2];green=codes('green-stage')[0];refactor=codes('refactor-stage')[0];extra=codes('evidence')[0]
 version=subprocess.check_output([str(python),'-m','pytest','--version'],text=True).strip()
 results=[]
 with tempfile.TemporaryDirectory(prefix='kairos-tdd-')as tmp:
  for name,implementation,tests,expected,exit_code in [('red',red,base,'4 failed, 1 passed',1),('green',green,base,'5 passed',0),('green-expanded',green,base+'\n\n'+extra,'8 passed',0),('refactor-same',refactor,base,'5 passed',0),('refactor-expanded',refactor,base+'\n\n'+extra,'8 passed',0)]:
   folder=Path(tmp)/name;folder.mkdir();(folder/'export_gate.py').write_text(implementation+'\n');(folder/'test_export_gate.py').write_text(tests+'\n')
   run=subprocess.run([str(python),'-m','pytest','-q'],cwd=folder,text=True,capture_output=True)
   assert run.returncode==exit_code and expected in run.stdout,(name,run.stdout,run.stderr)
   if name=='red':assert run.stdout.count('DID NOT RAISE')==4 and 'ValueError' in run.stdout
   results.append({'stage':name,'exitCode':run.returncode,'expected':expected,'stdout':run.stdout,'stderr':run.stderr})
 report={'python':subprocess.check_output([str(python),'--version'],text=True).strip(),'pytest':version,'results':results}
 out=ROOT/f'.local/aase/m0802/{version.replace(" ","-")}-example.json';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'python':report['python'],'pytest':version,'stages':[{k:r[k]for k in ['stage','exitCode','expected']}for r in results]},ensure_ascii=False))
if __name__=='__main__':main()
