"""Contract tests for the shared static verifier text view."""
import unittest
from validation_html import Text, VisibleText, norm

class StaticHtmlViewTests(unittest.TestCase):
    def test_text_including_script_and_entity_data_is_preserved(self):
        page = Text('<p>A &amp; B</p><script>x < y</script><!-- omitted --><span>中文</span>')
        self.assertEqual(''.join(page.parts), 'A & Bx < y中文')

    def test_details_order_and_open_presence_are_available_to_policy(self):
        page = Text('<details id="first"><summary>A</summary></details><details id="second" open="false">B</details>')
        self.assertEqual([x['id'] for x in page.details], ['first', 'second'])
        self.assertNotIn('open', page.details[0])
        self.assertIn('open', page.details[1])

    def test_normalization_preserves_legacy_link_and_whitespace_contract(self):
        self.assertEqual(norm('  [Label](https://example.test)\n&amp;\t中文\u00a0x  '), 'Label & 中文 x')
        self.assertEqual(norm('[Local](/local) [Plain](http://example.test)'), '[Local](/local) [Plain](http://example.test)')

    def test_instances_do_not_share_text_or_details(self):
        Text('<details id="old">old</details>')
        page = Text('<p>new</p>')
        self.assertEqual(page.parts, ['new'])
        self.assertEqual(page.details, [])

    def test_visible_policy_excludes_script_style_but_preserves_details(self):
        source = '<p>A &amp; B</p><script>hidden < value</script><style>.hidden{color:red}</style><details id="answer" open="false">中文</details>'
        page = VisibleText(source)
        self.assertEqual(''.join(page.parts), 'A & B中文')
        self.assertEqual(page.details, [{'id': 'answer', 'open': 'false'}])
        self.assertIn('hidden < value', ''.join(Text(source).parts))

    def test_visible_policy_handles_self_closing_and_unclosed_tags_per_legacy(self):
        self.assertEqual(''.join(VisibleText('<style/>after').parts), 'after')
        self.assertEqual(''.join(VisibleText('<p>before</p><script>unfinished').parts), 'before')
        VisibleText('<style>unfinished')
        self.assertEqual(''.join(VisibleText('<p>fresh</p>').parts), 'fresh')

if __name__ == '__main__':
    unittest.main()
