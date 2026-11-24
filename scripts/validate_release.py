#!/usr/bin/env python3
"""Validate static output, bilingual navigation and preserved MATLAB assets.

Usage: python3 scripts/validate_release.py [--json] [--parser python|shadow|rust]
The default parser uses the standard library. Exit 1 identifies failed checks.
"""
import argparse
import hashlib
from functools import cache
import json
from pathlib import Path
import re
import subprocess
import sys
import time
from types import SimpleNamespace
from urllib.parse import unquote, urljoin, urlsplit
from release_html.metadata import Page, page_metadata

ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / 'build'
SITE = ROOT / 'site'
ORIGIN = 'https://learn.cs-kairos.com/'


@cache
def _resolve_link(page, href):
    url = urlsplit(urljoin(ORIGIN + page, href))
    if url.scheme in ('http', 'https') and url.netloc == 'learn.cs-kairos.com':
        return unquote(url.path).lstrip('/'), unquote(url.fragment)
    return None


def resolve_link(page, href):
    if href.startswith('/') and not href.startswith('//') and not any(c in href for c in '\r\n\t'):
        page = ''
    return _resolve_link(page, href)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--json', action='store_true', help='emit a machine-readable summary')
    parser.add_argument('--parser', choices=('python', 'shadow', 'rust'), default='python',
                        help='shadow compares both parsers and validates the Python result')
    args = parser.parse_args(); start = time.monotonic(); errors = []
    if args.parser != 'python':
        sys.path.insert(0, str(ROOT / 'rust/release-rs/python'))
        try:
            from release_rs import page_metadata as rust_metadata
        except ImportError as error:
            parser.error(f'Rust parser unavailable. Run rust-anything build rust/release-rs ({error})')
    print('Checking static links, language pairs, public files and MATLAB byte parity.', file=sys.stderr)
    pages = {}
    for path in BUILD.rglob('*.html'):
        rel = path.relative_to(BUILD).as_posix()
        text = path.read_text()
        if args.parser == 'python':
            pages[rel] = Page(text)
        elif args.parser == 'rust':
            pages[rel] = SimpleNamespace(**rust_metadata(text))
        else:
            expected = page_metadata(text)
            actual = rust_metadata(text)
            if expected != actual:
                fields = ', '.join(key for key in expected if expected[key] != actual.get(key))
                errors.append(f'{rel}: Rust parser differs in {fields}')
            pages[rel] = SimpleNamespace(**expected)
    if not pages: errors.append('No HTML output; run pnpm run build first.')

    try:
        combined_search = json.loads((BUILD / 'search-index.json').read_text())
        for lang in ('zh', 'en'):
            name = f'search-index-{lang}.json'
            local_search = json.loads((BUILD / name).read_text())
            expected = [entry for entry in combined_search if entry['lang'] == lang]
            if local_search != expected:
                errors.append(f'{name}: entries or order differ from the public search catalog')
    except (OSError, ValueError, KeyError, TypeError) as error:
        errors.append(f'Search index validation failed: {error}')

    @cache
    def resolve_target(path):
        target = BUILD / path
        if target.is_dir():
            target /= 'index.html'
        return target.relative_to(BUILD).as_posix() if target.is_file() else None

    _resolve_link.cache_clear()
    for rel, page in pages.items():
        legacy = rel.startswith('courses/matlab-practice/')
        if page.duplicates: errors.append(f'{rel}: duplicate IDs {sorted(page.duplicates)}')
        if not legacy and rel != '404.html':
            expected = 'en' if rel.startswith('en/') else 'zh-Hant'
            if page.lang != expected: errors.append(f'{rel}: expected lang={expected}, got {page.lang}')
            if page.h1 != 1: errors.append(f'{rel}: expected one h1, got {page.h1}')
            path = '/' + rel.removesuffix('index.html')
            # Retired atlas and concept URLs point to the hub or the containing chapter.
            alias = re.fullmatch(r'/(en/)?interactive/aase/m02/(?:(m02-0[1-6])/[a-z0-9-]+/)?', path)
            canonical_path = path
            if alias:
                prefix = '/' + (alias[1] or '')
                canonical_path = prefix + ('interactive/aase/m02/' + alias[2] + '/' if alias[2] else 'interactive/')
            if page.canonical != 'https://learn.cs-kairos.com' + canonical_path: errors.append(f'{rel}: incorrect canonical')
            # Only actual published pairs may advertise a language switch.
            is_aase = rel.startswith(('courses/aase/v1/', 'en/courses/aase/v1/'))
            counterpart = rel.removeprefix('en/') if rel.startswith('en/') else 'en/' + rel
            if (is_aase or rel in ('ceh-notes/m20-cryptography/index.html', 'ceh-notes/day01-b-cryptography/index.html', 'ceh-notes/day02-a-reconnaissance/index.html', 'ceh-notes/day02-b-network-scanning/index.html')) and counterpart not in pages:
                if page.alternates: errors.append(f'{rel}: alternates point to an unavailable translation')
            else:
                zh_rel = canonical_path.lstrip('/').removeprefix('en/')
                expected_alternates = {'zh-Hant': 'https://learn.cs-kairos.com/' + zh_rel.removesuffix('index.html'), 'en': 'https://learn.cs-kairos.com/en/' + zh_rel.removesuffix('index.html'), 'x-default': 'https://learn.cs-kairos.com/' + zh_rel.removesuffix('index.html')}
                if page.alternates != expected_alternates: errors.append(f'{rel}: incorrect language alternates')
            if 'script-src' not in page.csp or 'sha256-' not in page.csp: errors.append(f'{rel}: missing hashed script CSP')
        for href in page.links:
            link = resolve_link(rel, href)
            if link is None: continue
            path, fragment = link
            key = resolve_target(path)
            if key is None: errors.append(f'{rel}: missing target {href}'); continue
            if fragment and key in pages and fragment not in pages[key].ids: errors.append(f'{rel}: missing anchor {href}')
    preserved = 0
    for source in SITE.rglob('*'):
        if not source.is_file() or source.relative_to(SITE).as_posix() == 'index.html': continue
        target = BUILD / source.relative_to(SITE)
        if not target.is_file() or hashlib.sha256(source.read_bytes()).digest() != hashlib.sha256(target.read_bytes()).digest(): errors.append(f'Legacy/static asset changed or missing: {source.relative_to(SITE)}')
        else: preserved += 1
    tracked = subprocess.check_output(['git','ls-files','--cached','--others','--exclude-standard','-z'],cwd=ROOT).decode().split('\0')
    secret_patterns = [re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'), re.compile(r'gh[pousr]_[A-Za-z0-9]{30,}'), re.compile(r'AKIA[0-9A-Z]{16}')]
    for name in tracked:
        p=ROOT/name
        if not name or not p.is_file() or p.suffix in ('.png','.jpg','.webp','.zip','.pdf'): continue
        content=p.read_text(errors='ignore')
        if any(pattern.search(content) for pattern in secret_patterns): errors.append(f'Credential pattern requires review: {name}')
    for p in BUILD.rglob('*'):
        if p.is_file() and (p.name.startswith('.env') or p.suffix == '.map' or '.git' in p.parts): errors.append(f'Private/build-only output: {p.relative_to(BUILD)}')
    result={'status':'fail' if errors else 'pass','html_pages':len(pages),'preserved_assets':preserved,'errors':errors,'seconds':round(time.monotonic()-start,2)}
    if args.json: print(json.dumps(result,ensure_ascii=False))
    elif errors: print('\n'.join(errors),file=sys.stderr)
    else: print(f"PASS: {len(pages)} HTML pages; paired languages, local links and {preserved} unchanged static assets; {result['seconds']}s.")
    return 1 if errors else 0

if __name__ == '__main__':
    raise SystemExit(main())
