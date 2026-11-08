"""Compatibility entry point for the current M05-04 replacement generator.
The original eight-section generator remains recoverable in Git at 6c770c5.
"""
from m05_04_replacement import generate
import sys
if __name__=='__main__':
 for path,data in generate().items():
  if '--check' in sys.argv:assert path.read_bytes()==data,path
  else:path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
