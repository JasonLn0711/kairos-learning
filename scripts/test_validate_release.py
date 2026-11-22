import unittest

from validate_release import resolve_link


class ReleaseLinkTest(unittest.TestCase):
    def test_root_links_and_fragments(self):
        for page in ('index.html', 'en/courses/aase/index.html'):
            self.assertEqual(resolve_link(page, '/images/space%20name.svg#part%201'),
                             ('images/space name.svg', 'part 1'))
            self.assertIsNone(resolve_link(page, '//example.org/asset'))

    def test_relative_and_empty_authority_links_keep_page_context(self):
        page = 'courses/unit/index.html'
        self.assertEqual(resolve_link(page, '../other/#heading'), ('courses/other/', 'heading'))
        for href in ('#heading', '//#heading', '/\t/#heading'):
            self.assertEqual(resolve_link(page, href), (page, 'heading'))
