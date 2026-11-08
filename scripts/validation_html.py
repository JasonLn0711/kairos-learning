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

class VisibleText(Text):
 """Legacy script/style exclusion policy used by the M03-03/04/05 gates."""
 def __init__(self,s):self.hidden=False;super().__init__(s)
 def handle_data(self,s):
  if not self.hidden:super().handle_data(s)
 def handle_endtag(self,t):
  if t in ['script','style']:self.hidden=False
 def handle_starttag(self,t,a):
  if t in ['script','style']:self.hidden=True
  super().handle_starttag(t,a)
