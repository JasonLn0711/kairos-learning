"""Shared legacy M09 source-body collector; article assertions stay in callers."""
from html.parser import HTMLParser


class Body(HTMLParser):
    def __init__(self, raw):
        super().__init__(convert_charrefs=True)
        self.depth = 0
        self.root = None
        self.text = []
        self.ids = []
        self.images = []
        self.details = []
        self.links = []
        self.tables = []
        self.figures = []
        self.in_details = 0
        self.feed(raw)

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == 'div':
            self.depth += 1
            if 'source-body' in attributes.get('class', '').split():
                self.root = self.depth
        if self.root is None:
            return
        if attributes.get('id'):
            self.ids.append(attributes['id'])
        if tag == 'details':
            self.details.append(attributes)
            self.in_details += 1
        if tag == 'img':
            self.images.append((attributes, self.in_details))
        if tag == 'a':
            self.links.append((attributes, self.in_details))
        if tag == 'table':
            self.tables.append(self.in_details)
        if tag == 'figure':
            self.figures.append(self.in_details)

    def handle_endtag(self, tag):
        if tag == 'details' and self.root is not None:
            self.in_details -= 1
        if tag == 'div':
            if self.depth == self.root:
                self.root = None
            self.depth -= 1

    def handle_data(self, value):
        if self.root is not None:
            self.text.append(value)
