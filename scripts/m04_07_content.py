"""Build complete SNMP teaching and reviewed SVG from the paired manuscripts."""
from pathlib import Path
from html import escape
import json,re,sys
from m0903_svg import sanitized_svg,NS
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/m04-07'
def parse(lang,suffix):
 text=(S/f'teaching.{suffix}.md').read_text().strip()
 blocks=[];section=0;sub=0
 for chunk in re.split(r'\n\s*\n',text)[1:]:
  if chunk.startswith('## '):
   section+=1;sub=0;blocks.append(dict(kind='heading',id=f'section-{section}',text=chunk[3:]))
  elif chunk.startswith('### '):
   sub+=1;blocks.append(dict(kind='paragraph',id=f'section-{section}-sub-{sub}',text=chunk[4:]))
  elif chunk.startswith('|'):
   rows=[[c.strip() for c in line.strip().strip('|').split('|')] for line in chunk.splitlines()]
   blocks.append(dict(kind='table',headers=rows[0],rows=rows[2:]))
  elif chunk.startswith('- '):blocks.append(dict(kind='list',items=[line[2:] for line in chunk.splitlines()]))
  else:blocks.append(dict(kind='paragraph',text=chunk))
 assert section==10
 # Replace flattened layout fragments with semantic tables; preserve their teaching content.
 def group(start,end,block):
  a=next(i for i,b in enumerate(blocks) if b.get('text')==start)
  z=next(i for i,b in enumerate(blocks[a:],a) if b.get('text')==end)
  blocks[a:z+1]=[block]
 zh=lang=='zh'
 group('三個常見的 SNMP 物件實例' if zh else 'Three common SNMP object instances:', '設備被設定在哪個位置？' if zh else 'Where is the device configured to be located?',dict(kind='table',headers=['物件實例','OID','問題'] if zh else ['Object instance','OID','Question'],rows=[['sysUpTime.0','1.3.6.1.2.1.1.3.0','管理部分運作了多久？' if zh else 'How long has the management portion been running?'],['sysName.0','1.3.6.1.2.1.1.5.0','設備叫什麼名字？' if zh else 'What is the device called?'],['sysLocation.0','1.3.6.1.2.1.1.6.0','設備被設定在哪個位置？' if zh else 'Where is the device configured to be located?']]))
 group('noAuthNoPriv','有認證、有加密' if zh else 'Authentication and encryption.',dict(kind='table',headers=['USM 安全層級','保護'] if zh else ['USM security level','Protection'],rows=[['noAuthNoPriv','無認證、無加密' if zh else 'No authentication and no encryption'],['authNoPriv','有認證、無加密' if zh else 'Authentication without encryption'],['authPriv','有認證、有加密' if zh else 'Authentication and encryption']]))
 group('同一台交換器：lab-switch-01' if zh else 'Same switch: lab-switch-01','示意：圖中只比較讀取權限，不代表 admin-b 有任何寫入權限。' if zh else 'The illustration compares read permissions only. It grants no write permission to admin-b.',dict(kind='table',headers=['同一台交換器 lab-switch-01','monitor-a：日常監控','admin-b：額外獲准讀取位置'] if zh else ['Same switch: lab-switch-01','monitor-a: routine monitoring','admin-b: additionally allowed to read location'],rows=[['設備名稱' if zh else 'Device name','lab-switch-01','lab-switch-01'],['管理經過時間' if zh else 'Management elapsed time','60000 TimeTicks','60000 TimeTicks'],['設備位置' if zh else 'Device location','不提供' if zh else 'Not provided','training-room'],['寫入權限' if zh else 'Write permission','本案例沒有 write view' if zh else 'No write view in this case','未由本表證明' if zh else 'Not established by this table']]))
 group('模擬 SNMP 查詢紀錄' if zh else 'Simulated SNMP query records','training-room',dict(kind='table',headers=['紙上案例身分','查詢','回覆'] if zh else ['Tabletop identity','Query','Response'],rows=[['monitor-a / SNMPv3 authNoPriv','GET sysName.0','lab-switch-01'],['monitor-a / SNMPv3 authNoPriv','GET sysUpTime.0','60000 TimeTicks'],['monitor-a / SNMPv3 authNoPriv','GET sysLocation.0','noSuchObject'],['另一個已獲准讀取位置的身分' if zh else 'Another identity authorized to read location','GET sysLocation.0','training-room']]))
 group('01','物件可寫性、write view 與實際授權' if zh else 'Object writability, write view, and actual authorization.',dict(kind='table',headers=['層次','判斷','核對條件'] if zh else ['Layer','Question','Conditions to check'],rows=[['01','能否連線？' if zh else 'Can it be reached?','網路路徑、服務、UDP 埠與相關設定' if zh else 'Network path, service, UDP ports, configuration'],['02','通訊有沒有保護？' if zh else 'Is communication protected?','SNMP 版本、認證、完整性與加密' if zh else 'SNMP version, authentication, integrity, encryption'],['03','能讀取哪些資料？' if zh else 'Which data may be read?','身分、context、read view 與實作' if zh else 'Identity, context, read view, implementation'],['04','能不能修改資料？' if zh else 'May data be modified?','物件可寫性、write view 與實際授權' if zh else 'Object writability, write view, actual authorization']]))
 idx=next(i for i,b in enumerate(blocks) if b.get('text','').startswith('簡化示意：' if zh else 'Simplified diagram:'))
 blocks[idx]=dict(kind='visual',src=f'/images/ceh/snmp-manager-{lang}.svg',downloadLabel='下載 SVG 圖解' if zh else 'Download SVG diagram',visual=dict(kind='cards',caption='一個 Manager，三種平行設備' if zh else 'One Manager, three parallel device types',description=blocks[idx]['text'],items=[dict(title='監控系統 Manager' if zh else 'Monitoring system Manager',body='查詢 GET ↓；回覆 ↑' if zh else 'GET request ↓; response ↑'),dict(title='交換器 Switch' if zh else 'Switch',body='透過 SNMP Agent 回答獲准查詢的資訊' if zh else 'SNMP Agent returns authorized information'),dict(title='路由器 Router' if zh else 'Router',body='透過 SNMP Agent 回答獲准查詢的資訊' if zh else 'SNMP Agent returns authorized information'),dict(title='伺服器 Server' if zh else 'Server',body='透過 SNMP Agent 回答獲准查詢的資訊' if zh else 'SNMP Agent returns authorized information')]))
 # Primary links replace the supplied citation UI fragments beside their supported sections.
 refs={2:[('RFC 2578','https://www.rfc-editor.org/rfc/rfc2578.html'),('RFC 3418','https://www.rfc-editor.org/rfc/rfc3418.html')],3:[('Net-SNMP snmpwalk','https://www.net-snmp.org/docs/man/snmpwalk.html'),('Net-SNMP snmpbulkwalk','https://www.net-snmp.org/docs/man/snmpbulkwalk.html'),('RFC 3417','https://www.rfc-editor.org/rfc/rfc3417.html')],4:[('RFC 3414','https://www.rfc-editor.org/rfc/rfc3414.html')],5:[('RFC 3415 VACM','https://www.rfc-editor.org/rfc/rfc3415.html')],6:[('RFC 3416','https://www.rfc-editor.org/rfc/rfc3416.html')],7:[('RFC 3418 sysUpTime','https://www.rfc-editor.org/rfc/rfc3418.html')]}
 for n,links in reversed(list(refs.items())):
  at=next(i for i,b in enumerate(blocks) if b.get('id')==f'section-{n+1}')
  blocks.insert(at,dict(kind='paragraph',text=' · '.join(f'[{label}]({url})' for label,url in links)))
 return dict(summary='SNMP 查詢結果取決於身分、操作與可存取範圍；分開判讀通訊保護、讀取權限、寫入權限與不存在的證據。' if zh else 'SNMP results depend on identity, operation, and accessible scope. Assess communication protection, read access, write access, and evidence of absence separately.',sections=[],sourceBody=blocks)
def svg(block,lang):
 v=block['visual'];prefix=f'snmp-{lang}-';out=[]
 def rect(x,y,w,h,fill,stroke):out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="20" fill="{fill}" stroke="{stroke}" stroke-width="3"/>')
 def text(x,y,t,size=22):out.append(f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Noto Sans CJK TC,sans-serif" font-size="{size}" fill="#183b59">{escape(t)}</text>')
 rect(260,25,380,140,'#dceaff','#3977bd');text(450,85,v['items'][0]['title'],25)
 text(450,125,v['items'][0]['body'],20)
 out.append(f'<path d="M430 168V248" stroke="#3977bd" stroke-width="4" marker-end="url(#{prefix}arrow)"/><path d="M470 248V168" stroke="#3977bd" stroke-width="4" marker-end="url(#{prefix}arrow)"/><path d="M140 320V280H760V320M450 280V320" fill="none" stroke="#607d94" stroke-width="4"/>')
 for x,item in zip([30,340,650],v['items'][1:]):
  rect(x,320,220,180,'#e4f3eb','#458574');rect(x+45,343,130,35,'#458574','#458574');text(x+110,420,item['title'],22)
  text(x+110,460,'SNMP Agent',21)
 text(450,545,'各設備回答獲准查詢的資訊' if lang=='zh' else 'Each Agent returns authorized information',23)
 text(450,581,'設備彼此平行；線段表示共同查詢關係' if lang=='zh' else 'Devices are peers; lines represent shared query relationships',19)
 raw=f'<svg xmlns="{NS}" viewBox="0 0 900 610" role="img" aria-labelledby="{prefix}title {prefix}desc"><title id="{prefix}title">{escape(v["caption"])}</title><desc id="{prefix}desc">{escape(v["description"])}</desc><defs><marker id="{prefix}arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#3977bd"/></marker></defs>'+''.join(out)+'</svg>'
 return (sanitized_svg(raw,prefix)+'\n').encode()
def generate():
 lesson=dict(id='CEH26-M04-C07',revision=1,contentVersion='1.0.0',date='2026-11-06',status='published',publishedOn='2026-11-06',qa=[],text={lang:parse(lang,suffix) for lang,suffix in [('zh','zh-TW'),('en','en')]})
 targets={R/'content/concepts/ceh26-m04-c07.json':(json.dumps(lesson,ensure_ascii=False,indent=2)+'\n').encode()}
 for lang in ['zh','en']:
  block=next(b for b in lesson['text'][lang]['sourceBody'] if b['kind']=='visual')
  targets[R/'site'/block['src'].lstrip('/')]=svg(block,lang)
 return targets
if __name__=='__main__':
 for p,data in generate().items():
  if '--check' in sys.argv:assert p.read_bytes()==data,p
  else:p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
