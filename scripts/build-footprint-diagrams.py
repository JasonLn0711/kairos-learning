"""Read reviewed source geometry into constrained, selectable teaching cards.
Order and flow are explicit per figure, not inferred from coordinates.
"""
from pathlib import Path
import json,xml.etree.ElementTree as ET,sys
ROOT=Path(__file__).resolve().parents[1];NS='{http://www.w3.org/2000/svg}'
flows={'m02-07-01':False,'m02-07-02':True,'m02-07-03':False,'m02-07-04':True,'m02-08-01':False,'m02-08-02':True,'m02-08-03':True,'m02-08-04':True,'m03-01-01':True,'m03-01-02':True,'m03-01-03':False,'m03-01-04':True}
out={}
for module in ['m02-07','m02-08']:
 for p in sorted((ROOT/'site/images/ceh').glob(module+'-*.svg')):
  root=ET.parse(p).getroot();nodes=[]
  for y in [68,196,324,452]:
   labels=[n.text for n in root.iter(NS+'text') if y<=float(n.get('y','0'))<=y+100]
   assert len(labels)==3,(p,labels)
   nodes.append({'title':labels[0],'body':labels[1:]})
  footer=[n.text for n in root.iter(NS+'text') if float(n.get('y','0'))>=600]
  key=p.stem[:9];flow=flows[key]
  arrows=[n for n in root.iter(NS+'path') if 'marker-end' in n.attrib]
  assert len(arrows)==(3 if flow else 0),(p,len(arrows),flow)
  out['/images/ceh/'+p.name]={'flow':flow,'nodes':nodes,'footer':footer}
for module in ['m03-02','m03-04']:
 for key,value in json.loads((ROOT/f'docs/sources/{module}/diagram-models.json').read_text()).items():
  out[key.replace('-zh-TW.svg','-zh.svg')]={k:value[k] for k in ['flow','nodes','footer']}
s=json.dumps(out,ensure_ascii=False,indent=2)+'\n';p=ROOT/'src/lib/footprint-diagrams.json'
if '--check' in sys.argv:assert p.read_text()==s
else:p.write_text(s)
print('32 footprint diagram models match source labels and explicit arrow contracts')
