"""Deterministic M02-03 assets through the shared fail-closed SVG serializer."""
from pathlib import Path
import json,re,sys,xml.etree.ElementTree as ET
from m0903_svg import sanitized_svg,NS
ROOT=Path(__file__).resolve().parents[1]
NAMES=['01-index-boundary', '02-public-layers', '03-controls', '04-evidence-cycle', '05-noindex-flow']
def generate():
 bundle={};labels={'zh':[],'en':[]}
 for lang,suffix in [('zh','zh-TW'),('en','en')]:
  for num,name in enumerate(NAMES,1):
   root=ET.fromstring((ROOT/f'docs/sources/m02-03/figures/{name}.{suffix}.svg').read_text());prefix=f'm0203-f{num}-{lang}-'
   root.attrib.pop('style',None) # Responsive display CSS is owned by ReviewedSvgVisual.
   for node in root.iter():
    for k,v in list(node.attrib.items()):
     if k=='id':node.set(k,prefix+v)
     elif k in ['aria-labelledby','aria-describedby']:node.set(k,' '.join(prefix+x for x in v.split()))
     elif 'url(#' in v:node.set(k,re.sub(r'url\(#([^)]*)\)',lambda m:'url(#'+prefix+m[1]+')',v))
   src=f'/images/ceh/m02-03-{name}-{lang}.svg'
   markup=sanitized_svg(ET.tostring(root,encoding='unicode'),prefix)
   bundle[src]=markup
   labels[lang]+= [' '.join(''.join(n.itertext()).split()) for n in root.iter() if n.tag in {f'{{{NS}}}title',f'{{{NS}}}desc',f'{{{NS}}}text'}]
 return bundle,labels
if __name__=='__main__':
 bundle,labels=generate();targets={ROOT/'src/lib/m0203-inline-svg.json':json.dumps(bundle,ensure_ascii=False,indent=2)+'\n',ROOT/'src/lib/m0203-svg-labels.json':json.dumps(labels,ensure_ascii=False,indent=2)+'\n'}
 for src,markup in bundle.items():targets[ROOT/'site'/src.lstrip('/')]=markup
 for target,value in targets.items():
  if '--check' in sys.argv:assert target.read_text()==value,str(target)
  else:target.write_text(value)
 print('10 M02-03 assets and inline/search bundles match strict serializer')
