"""HTML metadata used by the release validator."""

from html.parser import HTMLParser

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

def page_metadata(text: str) -> dict:
    page = Page(text)
    return {
        'ids': sorted(page.ids), 'duplicates': sorted(page.duplicates),
        'links': page.links, 'lang': page.lang, 'canonical': page.canonical,
        'h1': page.h1, 'alternates': page.alternates, 'scripts': page.scripts, 'csp': page.csp,
    }
