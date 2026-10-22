"""Rebuild current 1.8 downloads from the published source directory."""
from pathlib import Path
import zipfile, hashlib
ROOT=Path(__file__).resolve().parents[1]
DOWNLOADS=ROOT/'site/courses/matlab-practice/downloads'
SOURCE=DOWNLOADS/'matlab_edition'
def package(name,paths):
 with zipfile.ZipFile(DOWNLOADS/name,'w',zipfile.ZIP_DEFLATED) as archive:
  for path in sorted(paths):
   info=zipfile.ZipInfo('matlab_edition/'+str(path.relative_to(SOURCE)),(2026,10,22,0,0,0))
   info.compress_type=zipfile.ZIP_DEFLATED
   archive.writestr(info,path.read_bytes())
files=[p for p in SOURCE.rglob('*') if p.is_file()]
package('matlab-public-v1.8.zip',files)
for i in range(1,4):
 package(f'matlab-case{i}-v1.8.zip',[p for p in files if p.name.lower().startswith(f'case{i}') or p.name in ['MATLAB_README.md','PUBLIC_PACKAGE.md','RELEASE_NOTES.md','MATLAB_STAGE_PROMPTS.md','MATLAB_STARTER_SKELETONS.md','MATLAB_REQUIREMENTS_MAPPING.md']])
(DOWNLOADS/'SHA256SUMS.txt').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name+'\n' for p in sorted(DOWNLOADS.glob('*.zip'))))
print('Built 1.8 full package and three case packages; refreshed checksums')
