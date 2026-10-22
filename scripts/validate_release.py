#!/usr/bin/env python3
"""Validate static output, bilingual navigation and preserved MATLAB assets.

Usage: python3 scripts/validate_release.py [--json]
No network access or third-party dependencies. Exit 1 identifies failed checks.
"""
import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import sys
import time
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / 'build'
SITE = ROOT / 'site'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids = set(); self.duplicates = set(); self.links = []; self.lang = ''; self.canonical = ''; self.h1 = 0
        self.alternates = {}; self.scripts = []; self.csp = ''
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            if a['id'] in self.ids: self.duplicates.add(a['id'])
            self.ids.add(a['id'])
        if tag == 'html': self.lang = a.get('lang', '')
        if tag == 'h1': self.h1 += 1
        if tag in ('a', 'img', 'script', 'link'):
            for key in ('href', 'src'):
                if a.get(key): self.links.append(a[key])
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical = a.get('href', '')
        if tag == 'link' and a.get('rel') == 'alternate': self.alternates[a.get('hreflang')] = a.get('href', '')
        if tag == 'script' and a.get('src'): self.scripts.append(a['src'])
        if tag == 'meta' and a.get('http-equiv', '').lower() == 'content-security-policy': self.csp = a.get('content', '')

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--json', action='store_true', help='emit a machine-readable summary')
    args = parser.parse_args(); start = time.monotonic(); errors = []
    print('Checking static links, language pairs, public files and MATLAB byte parity.', file=sys.stderr)
    pages = {p.relative_to(BUILD).as_posix(): Page(p.read_text()) for p in BUILD.rglob('*.html')}
    if not pages: errors.append('No HTML output; run npm run build first.')
    for rel, page in pages.items():
        legacy = rel.startswith('courses/matlab-practice/')
        if page.duplicates: errors.append(f'{rel}: duplicate IDs {sorted(page.duplicates)}')
        if not legacy and rel != '404.html':
            expected = 'en' if rel.startswith('en/') else 'zh-Hant'
            if page.lang != expected: errors.append(f'{rel}: expected lang={expected}, got {page.lang}')
            if page.h1 != 1: errors.append(f'{rel}: expected one h1, got {page.h1}')
            path = '/' + rel.removesuffix('index.html')
            if page.canonical != 'https://learn.cs-kairos.com' + path: errors.append(f'{rel}: incorrect canonical')
            if not all(k in page.alternates for k in ('en','zh-Hant','x-default')): errors.append(f'{rel}: missing language alternates')
            if 'script-src' not in page.csp or 'sha256-' not in page.csp: errors.append(f'{rel}: missing hashed script CSP')
        for href in page.links:
            u = urlsplit(urljoin('https://learn.cs-kairos.com/' + rel, href))
            if u.scheme not in ('http','https') or u.netloc != 'learn.cs-kairos.com': continue
            path = unquote(u.path).lstrip('/')
            target = BUILD / path
            if target.is_dir(): target = target / 'index.html'
            if not target.is_file(): errors.append(f'{rel}: missing target {href}'); continue
            key = target.relative_to(BUILD).as_posix()
            if u.fragment and key in pages and unquote(u.fragment) not in pages[key].ids: errors.append(f'{rel}: missing anchor {href}')
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
