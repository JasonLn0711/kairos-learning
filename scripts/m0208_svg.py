"""Deterministic M02-08 assets through the shared fail-closed SVG serializer."""
from pathlib import Path
import json,re,sys,xml.etree.ElementTree as ET
from m0903_svg import sanitized_svg,NS
ROOT=Path(__file__).resolve().parents[1]
NAMES=['01-layered-controls','02-observation-inference-action','03-evidence-custody','04-remediation-verification']
def generate():
 bundle={};labels={'zh':[],'en':[]}
 for lang,suffix in [('zh','zh-TW'),('en','en')]:
  for num,name in enumerate(NAMES,1):
   root=ET.fromstring((ROOT/f'docs/sources/m02-08/figures/{name}.{suffix}.svg').read_text());prefix=f'm0208-f{num}-{lang}-'
   root.attrib.pop('style',None) # Responsive display CSS is owned by ReviewedSvgVisual.
   for node in root.iter():
    for k,v in list(node.attrib.items()):
     if k=='id':node.set(k,prefix+v)
     elif k in ['aria-labelledby','aria-describedby']:node.set(k,' '.join(prefix+x for x in v.split()))
     elif 'url(#' in v:node.set(k,re.sub(r'url\(#([^)]*)\)',lambda m:'url(#'+prefix+m[1]+')',v))
   src=f'/images/ceh/m02-08-{name}-{lang}.svg'
   markup=sanitized_svg(ET.tostring(root,encoding='unicode'),prefix)
   bundle[src]=markup
   labels[lang]+= [' '.join(''.join(n.itertext()).split()) for n in root.iter() if n.tag in {f'{{{NS}}}title',f'{{{NS}}}desc',f'{{{NS}}}text'}]
 return bundle,labels
if __name__=='__main__':
 bundle,labels=generate();targets={ROOT/'src/lib/m0208-inline-svg.json':json.dumps(bundle,ensure_ascii=False,indent=2)+'\n',ROOT/'src/lib/m0208-svg-labels.json':json.dumps(labels,ensure_ascii=False,indent=2)+'\n'}
 for src,markup in bundle.items():targets[ROOT/'site'/src.lstrip('/')]=markup
 for target,value in targets.items():
  if '--check' in sys.argv:assert target.read_text()==value,str(target)
  else:target.write_text(value)
 print('8 M02-08 assets and inline/search bundles match strict serializer')
