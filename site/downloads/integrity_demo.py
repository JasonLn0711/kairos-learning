#!/usr/bin/env python3
"""Offline SHA-256 demonstration. No file access, networking or dependencies."""
from hashlib import sha256

def main():
    original = b'sample=100'
    changed = b'sample=10'
    print('equal=' + str(sha256(original).digest() == sha256(original).digest()))
    print('changed=' + str(sha256(original).digest() != sha256(changed).digest()))

if __name__ == '__main__':
    main()
