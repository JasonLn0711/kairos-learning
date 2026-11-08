"""Shared legacy HTML text/detail view for static article acceptance gates.

Keep parser and normalization semantics stable; article-specific policy stays in callers.
"""
import html
import re
from html.parser import HTMLParser

class Text(HTMLParser):
 def __init__(self,s):super().__init__();self.parts=[];self.details=[];self.feed(s)
 def handle_data(self,s):self.parts.append(s)
 def handle_starttag(self,t,a):
  if t=='details':self.details.append(dict(a))
def norm(s):return re.sub(r'\s+',' ',html.unescape(re.sub(r'\[([^\]]+)\]\(https://[^)]+\)',r'\1',s))).strip()
