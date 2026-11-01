"""Deterministic M02-06 assets through the shared fail-closed SVG serializer."""
from pathlib import Path
import json,re,sys,io,zipfile,xml.etree.ElementTree as ET
from m0903_svg import sanitized_svg,NS
ROOT=Path(__file__).resolve().parents[1]
NAMES=['01-domain-network','02-address-prefix-as','03-traceroute-hops','04-evidence-workflow','network-map','prefix-bits','private-network','bgp-routing','cdn-origin','proxy-modes']
def generate():
 bundle={};labels={'zh':[],'en':[]}
 for lang,suffix in [('zh','zh-TW'),('en','en')]:
  for num,name in enumerate(NAMES,1):
   root=ET.fromstring((ROOT/f'docs/sources/m02-06/figures/{name}.{suffix}.svg').read_text());prefix=f'm0206-f{num}-{lang}-'
   root.attrib.pop('style',None) # Responsive display CSS is owned by ReviewedSvgVisual.
   for node in root.iter():
    for k,v in list(node.attrib.items()):
     if k=='id':node.set(k,prefix+v)
     elif k in ['aria-labelledby','aria-describedby']:node.set(k,' '.join(prefix+x for x in v.split()))
     elif 'url(#' in v:node.set(k,re.sub(r'url\(#([^)]*)\)',lambda m:'url(#'+prefix+m[1]+')',v))
   src=f'/images/ceh/m02-06-{name}-{lang}.svg'
   markup=sanitized_svg(ET.tostring(root,encoding='unicode'),prefix)
   bundle[src]=markup
   if name in ['01-domain-network','02-address-prefix-as']:continue
   labels[lang]+= [' '.join(''.join(n.itertext()).split()) for n in root.iter() if n.tag in {f'{{{NS}}}title',f'{{{NS}}}desc',f'{{{NS}}}text'}]
 return bundle,labels
if __name__=='__main__':
 bundle,labels=generate();targets={ROOT/'src/lib/m0206-inline-svg.json':json.dumps(bundle,ensure_ascii=False,indent=2)+'\n',ROOT/'src/lib/m0206-svg-labels.json':json.dumps(labels,ensure_ascii=False,indent=2)+'\n'}
 for src,markup in bundle.items():targets[ROOT/'site'/src.lstrip('/')]=markup
 for target,value in targets.items():
  if '--check' in sys.argv:assert target.read_text()==value,str(target)
  else:target.write_text(value)
 archive=io.BytesIO()
 with zipfile.ZipFile(archive,'w') as z:
  for name in NAMES[4:]:
   for lang in ['zh','en']:
    src=f'/images/ceh/m02-06-{name}-{lang}.svg';info=zipfile.ZipInfo(Path(src).name,(2026,11,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,bundle[src].encode())
 package=ROOT/'site/downloads/ceh-m02-06-network-svg.zip'
 if '--check' in sys.argv:assert package.read_bytes()==archive.getvalue(),'Network ZIP differs'
 else:package.write_bytes(archive.getvalue())
 print('20 M02-06 assets and inline/search bundles match strict serializer')
