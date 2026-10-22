"""Validate published files, anchors, snippets, source coverage and release archives."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re, hashlib, zipfile, collections
ROOT=Path(__file__).resolve().parents[1]; SITE=ROOT/'site'; COURSE=SITE/'courses/matlab-practice'; D=COURSE/'downloads/matlab_edition'
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.ids=[];self.links=[];self.images=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  for k in ('href','src'):
   if k in a:self.links.append(a[k])
  if tag=='img':self.images.append(a)
pages={p:Page(p.read_text()) for p in SITE.rglob('*.html')}
for p,page in pages.items():
 assert len(page.ids)==len(set(page.ids)),f'duplicate IDs: {p}'
 for link in page.links:
  u=urlsplit(link)
  if u.scheme or u.netloc:continue
  target=(p.parent/unquote(u.path)).resolve() if u.path else p.resolve()
  if target.is_dir():target=target/'index.html'
  assert target.exists(),f'missing target {p}: {link}'
  if u.fragment and target.suffix=='.html':assert unquote(u.fragment) in pages[target].ids,f'missing anchor {p}: {link}'
 for img in page.images:assert img.get('alt') and img.get('width') and img.get('height'),f'image metadata {p}'
for i,stem in enumerate(['case1_sensor_classifier_matlab','case2_image_measure_matlab','case3_shape_classifier_matlab'],1):
 text=(COURSE/f'case{i}.html').read_text(); md=(D/f'CASE{i}_LINE_BY_LINE.md').read_text(); source=(D/(stem+'.m')).read_text()
 digest=hashlib.sha256(source.encode()).hexdigest(); assert digest in text and digest in md
 expected=[j for j,line in enumerate(source.splitlines(),1) if line.strip()]
 actual=[int(n) for n in re.findall(r'<strong>第 (\d+) 行</strong>',text)]
 assert actual==expected,f'line explanation coverage: case{i}'
 blocks=[__import__('html').unescape(b) for b in re.findall(r'<code class="language-matlab">(.*?)</code>',text,re.S)]
 assert (D/f'case{i}_quickstart.m').read_text().strip() in [b.strip() for b in blocks]
 full='\n'.join(b.strip('\n') for b in blocks if b.strip() and b.strip().splitlines()[0] in source)
 assert [x for x in full.splitlines() if x.strip()]==[x for x in source.splitlines() if x.strip()],f'full source mismatch {i}'
 assert text.count('<strong>目的：</strong>')==8 and text.count('<strong>結果：</strong>')==8
 assert 'MATLAB 教材 1.8 · 2026-10-22' in text
 for num in re.findall(r'<figure id="fig-(.*?)"',text):assert text.count('圖 '+num)>=2,f'unreferenced figure {num}'
for line in (COURSE/'downloads/SHA256SUMS.txt').read_text().splitlines():
 digest,name=line.split();p=COURSE/'downloads'/name;assert hashlib.sha256(p.read_bytes()).hexdigest()==digest
 with zipfile.ZipFile(p) as z:
  assert z.testzip() is None
  if 'v1.8' in name:
   for item in z.namelist():assert z.read(item)==(COURSE/'downloads'/item).read_bytes(),f'archive mismatch: {name} {item}'
# Check relative Markdown links in the complete source distribution.
for p in D.rglob('*.md'):
 for url in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  u=urlsplit(url)
  if not u.scheme and u.path: assert (p.parent/unquote(u.path)).exists(),f'MD link: {p} {url}'
for p in SITE.rglob('*'):
 if p.suffix in ['.html','.md','.js','.svg']:
  text=p.read_text();assert not re.search(r'/home/|/Users/|notion\.so|notion\.site|chatgpt\.com/c/|私人日誌|週計畫',text),f'private reference: {p}'
print(f'PASS: {len(pages)} HTML pages; local links/anchors/images; 523 source lines; snippets; 24 steps; figures; Markdown links; all ZIP checksums and 1.8 archive parity')
