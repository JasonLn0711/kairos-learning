import unittest
from source_body_html import Body


class SourceBodyTests(unittest.TestCase):
    def test_root_scope_entities_and_nested_visibility(self):
        page = Body('<p>outside</p><div class="x source-body"><div id="section">A &amp; B</div>'
                    '<img src="visible.svg"><details id="answer"><summary>Q</summary>'
                    '<details><a href="nested">link</a><img src="hidden.svg"></details>'
                    '<table></table></details><figure></figure></div><p>after</p>')
        self.assertEqual(''.join(page.text), 'A & BQlink')
        self.assertEqual(page.ids, ['section', 'answer'])
        self.assertEqual(page.images, [({'src': 'visible.svg'}, 0), ({'src': 'hidden.svg'}, 2)])
        self.assertEqual(page.links, [({'href': 'nested'}, 2)])
        self.assertEqual(page.tables, [1])
        self.assertEqual(page.figures, [0])
        self.assertEqual(len(page.details), 2)

    def test_instances_do_not_reuse_previous_page(self):
        first = Body('<div class="source-body"><details open>first</details></div>')
        second = Body('<div class="source-body">second</div>')
        self.assertEqual(first.details, [{'open': None}])
        self.assertEqual(second.details, [])
        self.assertEqual(second.text, ['second'])

    def test_missing_source_body_collects_nothing(self):
        page = Body('<div><a id="outside">outside</a><img src="x"></div>')
        self.assertEqual(page.text, [])
        self.assertEqual(page.ids, [])
        self.assertEqual(page.images, [])


if __name__ == '__main__':
    unittest.main()
