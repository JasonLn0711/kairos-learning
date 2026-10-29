"""Deterministic M09-04 assets through the shared fail-closed SVG serializer."""
from pathlib import Path
import json,re,sys,xml.etree.ElementTree as ET
from m0903_svg import sanitized_svg,NS
ROOT=Path(__file__).resolve().parents[1]
NAMES=['map','pretext','bait','tailgating']
def generate():
 bundle={};labels={'zh':[],'en':[]}
 for lang,suffix in [('zh','zh-TW'),('en','en')]:
  for num,name in enumerate(NAMES,1):
   root=ET.fromstring((ROOT/f'docs/sources/m09-04/figures/{name}.{suffix}.svg').read_text());prefix=f'm0904-f{num}-{lang}-'
   for node in root.iter():
    if lang=='en' and node.tag==f'{{{NS}}}text':
     node.text={'Only the approved person, action, and duration.':'Only approved people, actions, and time.', 'Home is not a safe test environment.':'Home is not a safe test area.', 'Identity / entry permission unknown.':'Identity and access unchecked.'}.get(node.text,node.text)
    for k,v in list(node.attrib.items()):
     if v=='#9b681a':node.set(k,'#946114');v='#946114'
     if k=='id':node.set(k,prefix+v)
     elif k in ['aria-labelledby','aria-describedby']:node.set(k,' '.join(prefix+x for x in v.split()))
     elif 'url(#' in v:node.set(k,re.sub(r'url\(#([^)]*)\)',lambda m:'url(#'+prefix+m[1]+')',v))
    if node.tag==f'{{{NS}}}text' and float(node.get('font-size','20'))<20:node.set('font-size','20')
   root.set('width','900');root.set('height','810');root.set('viewBox','0 0 900 810')
   g=ET.Element(f'{{{NS}}}g',{'transform':'scale(0.9)'})
   for node in list(root):
    if node.tag not in {f'{{{NS}}}title',f'{{{NS}}}desc',f'{{{NS}}}defs'}:root.remove(node);g.append(node)
   root.append(g)
   src=f'/images/ceh/m09-04-{name}-{lang}.svg'
   markup=sanitized_svg(ET.tostring(root,encoding='unicode'),prefix)
   bundle[src]=markup
   labels[lang]+= [' '.join(''.join(n.itertext()).split()) for n in root.iter() if n.tag in {f'{{{NS}}}title',f'{{{NS}}}desc',f'{{{NS}}}text'}]
 return bundle,labels
if __name__=='__main__':
 bundle,labels=generate();targets={ROOT/'src/lib/m0904-inline-svg.json':json.dumps(bundle,ensure_ascii=False,indent=2)+'\n',ROOT/'src/lib/m0904-svg-labels.json':json.dumps(labels,ensure_ascii=False,indent=2)+'\n'}
 for src,markup in bundle.items():targets[ROOT/'site'/src.lstrip('/')]=markup
 for target,value in targets.items():
  if '--check' in sys.argv:assert target.read_text()==value,str(target)
  else:target.write_text(value)
 print('8 M09-04 assets and inline/search bundles match strict serializer')
