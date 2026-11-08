"""Compatibility gate: isolated build and complete current browser checks.
No production source file is temporarily mutated.
"""
from pathlib import Path
import subprocess
R=Path(__file__).resolve().parents[1]
subprocess.run(['python3','scripts/preview-m05-04.py'],cwd=R,check=True)
subprocess.run(['node','scripts/check-m05-04-browser.mjs'],cwd=R,check=True)
