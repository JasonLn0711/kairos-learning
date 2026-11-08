"""Isolated draft build; never changes the production publication gate."""
from pathlib import Path
import shutil,json,os,subprocess
R=Path(__file__).resolve().parents[1];T=R/'.local/cs-systems-preview';T.mkdir(parents=True,exist_ok=True)
for name in ['src','site','content']:shutil.copytree(R/name,T/name,dirs_exist_ok=True)
for name in ['package.json','svelte.config.js','vite.config.ts','tsconfig.json']:shutil.copy2(R/name,T/name)
if not (T/'node_modules').exists():os.symlink(R/'node_modules',T/'node_modules',target_is_directory=True)
p=T/'content/perspectives/cs-systems-foundations.json';a=json.loads(p.read_text());a['status']='published';p.write_text(json.dumps(a,ensure_ascii=False))
for f in (R/'docs/sources/cs-systems-foundations/staged-assets').glob('*.svg'):shutil.copy2(f,T/'site/images/perspectives'/f.name)
subprocess.run(['pnpm','run','build'],cwd=T,check=True)
