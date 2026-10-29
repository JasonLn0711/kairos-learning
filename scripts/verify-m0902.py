"""Check source fidelity, original assets and static HTML; not browser/keyboard QA."""
from pathlib import Path
from html.parser import HTMLParser
import hashlib,html,json,re,xml.etree.ElementTree as ET,zipfile
R=Path(__file__).resolve().parents[1]
lesson=json.loads((R/'content/concepts/m09-02.json').read_text())
manifest=json.loads((R/'docs/sources/m09-02/image-manifest.json').read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
source=R/'docs/sources/m09-02/user-primary-2026-10-29.md'
assert sha(source)=='d3125240593f7d15483a5049b47099f40109c855e1c98c469cfaf1449099d2aa'
norm=lambda s:re.sub(r'\s+',' ',html.unescape(re.sub(r'\[([^\]]+)\]\(https://[^)]+\)',r'\1',s))).strip()

class Body(HTMLParser):
 def __init__(self,text):
  super().__init__(convert_charrefs=True);self.depth=0;self.root=None;self.text=[];self.ids=[];self.images=[];self.details=[];self.in_details=0;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='div':
   self.depth+=1
   if 'source-body' in a.get('class','').split():self.root=self.depth
  if self.root is None:return
  if a.get('id'):self.ids.append(a['id'])
  if tag=='details':self.details.append(a);self.in_details+=1
  if tag=='img':self.images.append((a,self.in_details))
 def handle_endtag(self,tag):
  if tag=='details' and self.root is not None:self.in_details-=1
  if tag=='div':
   if self.depth==self.root:self.root=None
   self.depth-=1
 def handle_data(self,data):
  if self.root is not None:self.text.append(data)

counts={}
for lang,prefix in [('zh',''),('en','en/')]:
 b=lesson['text'][lang]['sourceBody'];path=R/f'build/{prefix}courses/ceh/v13/m09/concepts/m09-02/index.html'
 page=Body(path.read_text());rendered=norm(''.join(page.text));cursor=0;units=0
 for block in b:
  k=block['kind']
  items=([block['caption']] if k=='sourceImage' else block['items'] if k=='list' else [*block['headers'],*[c for row in block['rows'] for c in row]] if k=='table' else [block['summary'],*block['paragraphs']] if k=='answer' else [block['text']])
  for item in items:
   value=norm(item);at=rendered.find(value,cursor)
   assert at>=0,(lang,'Missing or out-of-order rendered text',value)
   cursor=at+len(value);units+=1
 assert len(page.details)==4 and all('open' not in a for a in page.details)
 assert all(f'section-{i}' in page.ids for i in range(1,20))
 assert 'answer-reference' in page.ids and 'connections' in page.ids
 assert [a['src'] for a,_ in page.images]==[f'/images/ceh/m09-02-original-{n}.svg' for n in [1,3,2,4,5]]
 assert all(depth==0 for _,depth in page.images),'Body images must not be collapsed'
 for block,(attrs,_) in zip([x for x in b if x['kind']=='sourceImage'],page.images):
  assert attrs['alt']==block['alt'];assert attrs['width']=='1600' and attrs['height']=='940'
 assert not re.search(r'Sentinel_|libfile_|CalpicoFile_|sandbox:|chatgpt-content-reference',path.read_text())
 counts[lang]={'blocks':len(b),'renderedTextUnits':units,'originalImages':len(page.images),'closedReferenceAnswers':len(page.details),'legacyAnchorsPreserved':21}

bundle=R/'site/downloads/ceh-m09-02-original-svg.zip'
assert sha(bundle)=='3978df3be85ea71f66246ac237437042509ed95d9f9c09a9709ec35d9a6dad26'
with zipfile.ZipFile(bundle) as z:
 assert len(z.namelist())==5
 for item in manifest:
  p=R/'site'/item['src'].lstrip('/');raw=p.read_bytes()
  assert raw==z.read(item['originalFilename']) and len(raw)==item['bytes']<100000 and sha(p)==item['sha256']
  assert raw==(R/'build'/item['src'].lstrip('/')).read_bytes()
  root=ET.fromstring(raw)
  for node in root.iter():
   assert node.tag.rsplit('}',1)[-1] not in ('script','foreignObject','image','use')
   assert not any(k.lower().startswith('on') or 'href' in k.lower() for k in node.attrib)
   assert not any(re.search(r'url\(\s*(?:https?:|//|data:)',v,re.I) for v in node.attrib.values())
assert bundle.read_bytes()==(R/'build/downloads/ceh-m09-02-original-svg.zip').read_bytes()
print(json.dumps({'status':'pass','languages':counts,'originalSvgAndZipByteParity':True,'svgSafety':'pass','browserMobileKeyboard':'not performed; existing restriction respected'},ensure_ascii=False,indent=2))
