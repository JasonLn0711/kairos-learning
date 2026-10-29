"""Adversarial input tests for the reviewed-asset-only inline SVG boundary."""
import unittest
from m0903_svg import sanitized_svg

P = 'm0903-f1-zh-'
BASE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 300" role="img" aria-labelledby="m0903-f1-zh-title m0903-f1-zh-desc"><title id="m0903-f1-zh-title">Test</title><desc id="m0903-f1-zh-desc">Description</desc>{}</svg>'


class Boundary(unittest.TestCase):
    def test_plain_geometry_and_local_reference(self):
        value = BASE.format('<defs><marker id="m0903-f1-zh-arrow"><path d="M0 0L8 4L0 8Z"/></marker></defs><path d="M0 0L10 10" marker-end="url(#m0903-f1-zh-arrow)"/>')
        self.assertIn('marker-end', sanitized_svg(value, P))

    def test_active_or_external_content_rejected(self):
        for part in ['<script>alert(1)</script>', '<foreignObject/>', '<image/>', '<use/>', '<animate/>', '<style>text{fill:red}</style>', '<text style="fill:red">X</text>', '<path onclick="alert(1)"/>', '<path href="#x"/>', '<path fill="url(https://example.com/x)"/>', '<path fill="url(#missing)"/>', '<path id="unscoped"/>', '<path id="m0903-f1-zh-title"/>', '<g xmlns="http://www.w3.org/1999/xhtml"/>']:
            with self.subTest(part=part), self.assertRaises(ValueError):
                sanitized_svg(BASE.format(part), P)

    def test_declarations_and_missing_accessibility_rejected(self):
        for value in ['<!DOCTYPE svg>'+BASE.format(''), '<?xml version="1.0"?>'+BASE.format(''), BASE.format('').replace('role="img"',''), BASE.format('').replace('Description',''), BASE.format('').replace('0 0 560 300','0 0 2000 300')]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                sanitized_svg(value, P)

    def test_css_escape_and_paint_obfuscation_rejected(self):
        for paint in [r'\75\72\6c(\68\74\74\70\73\3a\2f\2f example.invalid/a.svg#p)', 'u/**/rl(#m0903-f1-zh-title)', 'URL(#m0903-f1-zh-title)', 'rgb(0,0,0) var(--unreviewed)', 'context-fill']:
            with self.subTest(paint=paint), self.assertRaises(ValueError):
                sanitized_svg(BASE.format(f'<path fill="{paint}"/>'), P)


if __name__ == '__main__':
    unittest.main()
