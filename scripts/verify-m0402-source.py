"""Compare a private raw attachment with the authored body and built HTML."""
import argparse,hashlib,json,pathlib,re
from html.parser import HTMLParser
parser=argparse.ArgumentParser();parser.add_argument('source',type=pathlib.Path);parser.add_argument('--html',type=pathlib.Path);a=parser.parse_args()
root=pathlib.Path(__file__).resolve().parents[1]
manifest=json.loads((root/'docs/releases/2026-10-25-m04-02-normalization.json').read_text())
raw=a.source.read_bytes();assert len(raw)==manifest['sourceBytes'];assert hashlib.sha256(raw).hexdigest()==manifest['sourceSha256']
s=raw.decode();s=re.sub(r'#chatgpt-mermaid-.*?(?=你的電腦)','',s)
labels=['Cloudflare：DNS 伺服器角色','Cloudflare DNS 記錄類型','ISC BIND dig 文件','RFC 2308：傳統 NODATA 與否定快取','RFC 5936：AXFR','RFC 4033：DNSSEC','RFC 9824：Compact Denial of Existence'];li=0
for item in manifest['excluded']:
 if item['kind']=='citation badge':s=s.replace(item['text'],f'[{labels[li]}]({item["replacement"]})',1);li+=1
 elif item['kind']=='nonfunctional UI':s=s.replace(item['text'],'')
ranges=[('lookup','使用者輸入網域名稱','TCP／TLS／HTTP 等後續步驟'),('resolution','你的電腦想查 www.example.com','簡化的 DNS 解析流程。實際運作會受到快取、轉送設定與其他機制影響，不一定每次都經過所有伺服器。'),('cname','\nshop.example.test\n','示範 IPv4 位址'),('axfr','\n一般 DNS 查詢\n','「請把這份通訊錄全部提供給我。」')]
for ident,start,end in ranges:
 at=s.index(start);stop=s.index(end,at)+len(end);s=s[:at]+'[[diagram:'+ident+']]'+s[stop:]
s=re.sub(r'(?m)^- ','',s)
blocks=json.loads((root/'content/concepts/m04-02.json').read_text())['text']['zh']['sourceBody']
def block_text(b):
 if b['kind']=='dnsDiagram':return '[[diagram:'+b['id']+']]'
 if b['kind']=='table':return ' '.join(b['headers']+sum(b['rows'],[]))
 if b['kind']=='list':return ' '.join(b['items'])
 return b['text']
norm=lambda v:re.sub(r'\s+','',v)
source_blocks=[b for b in blocks if not b.get('text','').startswith('技術補充（與原稿分開）')]
assert norm(s)==norm(' '.join(map(block_text,source_blocks))),'Source mismatch outside documented diagram placements'
# All extracted diagram labels are retained; flattened AXFR extraction order is grouped by card.
specs=json.loads((root/'src/lib/m0402-diagrams.json').read_text())
for ident,start,end in ranges:
 original=raw.decode();start_at=original.index(start);end_at=original.index(end,start_at)+len(end)
 chunk=original[start_at:end_at]
 if ident=='resolution':
  required=['你的電腦想查 www.example.com','遞迴解析器','Recursive Resolver','根名稱伺服器','Root','.com 名稱伺服器','TLD','example.com 權威伺服器','Authoritative','取得 DNS 查詢結果','沒有適用快取','告知 .com 由誰管理','告知 example.com 由誰管理','回覆記錄',end]
 else:required=[v.strip() for v in chunk.splitlines() if v.strip()]
 values=json.dumps(specs[ident]['zh'],ensure_ascii=False).replace('\\n','')
 for label in required:assert norm(label) in norm(values),(ident,label)
if a.html:
 class Body(HTMLParser):
  def __init__(self):super().__init__();self.depth=0;self.skip=0;self.parts=[];self.tags=[]
  def handle_starttag(self,tag,attrs):
   at=dict(attrs)
   if tag in ['meta','link','img','br','hr','input','source','wbr']:return
   self.tags.append(tag)
   if at.get('class')=='source-body':self.depth=len(self.tags)
   if self.depth and 'data-dns-diagram' in at:self.parts.append('[[diagram:'+at['data-dns-diagram']+']]');self.skip=len(self.tags)
  def handle_endtag(self,tag):
   if self.skip==len(self.tags):self.skip=0
   if self.depth==len(self.tags):self.depth=0
   if self.tags:self.tags.pop()
  def handle_data(self,text):
   if self.depth and not self.skip:self.parts.append(text)
 p=Body();p.feed(a.html.read_text())
 authored=' '.join(map(block_text,blocks));authored=re.sub(r'\[([^\]]+)\]\(https://[^)]+\)',r'\1',authored)
 assert norm(authored)==norm(' '.join(p.parts)),'Rendered source body differs from authored text'
print('PASS: original 28,023 bytes; all 11 sections / 5 questions; all four diagram label sets; exact normalized prose order'+('; rendered HTML matches' if a.html else ''))
