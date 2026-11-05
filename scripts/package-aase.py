"""Build or verify a deterministic workshop ZIP. No network or credentials."""
from pathlib import Path
import argparse
import hashlib
import json
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'resources/aase'
TARGET = ROOT / 'site/downloads/aase/aase-v1-workshop.zip'
CHECKSUM = TARGET.parent / 'SHA256SUMS.txt'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--json', action='store_true')
    args = parser.parse_args()
    print('Checking AASE workshop archive.' if args.check else 'Packaging AASE workshop archive.', file=sys.stderr)
    files = sorted(p for p in SOURCE.rglob('*') if p.is_file() and '__pycache__' not in p.parts and '.pytest_cache' not in p.parts and p.suffix != '.pyc')
    expected = {'aase-v1-workshop/' + p.relative_to(SOURCE).as_posix(): p.read_bytes() for p in files}
    expected['aase-v1-workshop/curriculum.json'] = (ROOT / 'content/aase/course.json').read_bytes()
    if not args.check:
        TARGET.parent.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(TARGET, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
            for name, content in sorted(expected.items()):
                info = zipfile.ZipInfo(name, (2026, 11, 5, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o100644 << 16
                archive.writestr(info, content)
        CHECKSUM.write_text(hashlib.sha256(TARGET.read_bytes()).hexdigest() + '  ' + TARGET.name + '\n')
    with zipfile.ZipFile(TARGET) as archive:
        if set(archive.namelist()) != set(expected) or archive.testzip() is not None:
            raise ValueError('Archive file set or CRC mismatch')
        for name, content in expected.items():
            if archive.read(name) != content:
                raise ValueError('Archive bytes differ: ' + name)
    digest = hashlib.sha256(TARGET.read_bytes()).hexdigest()
    if CHECKSUM.read_text() != digest + '  ' + TARGET.name + '\n':
        raise ValueError('Archive checksum mismatch')
    result = {'status': 'pass', 'files': len(expected), 'bytes': TARGET.stat().st_size, 'sha256': digest}
    print(json.dumps(result) if args.json else f"PASS: {len(expected)} workshop files; archive bytes and SHA256 match.")


if __name__ == '__main__':
    main()
