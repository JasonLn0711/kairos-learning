"""Deterministic M03-01 assets through the shared fail-closed SVG serializer."""
from pathlib import Path
import json,re,sys,zipfile,io,xml.etree.ElementTree as ET
from m0903_svg import sanitized_svg,NS
ROOT=Path(__file__).resolve().parents[1]
NAMES=['01-layer-roles','02-tcp-and-application','03-transport-models','04-flow-tuple']
def generate():
 bundle={};labels={'zh':[],'en':[]}
 for lang,suffix in [('zh','zh-TW'),('en','en')]:
  for num,name in enumerate(NAMES,1):
   root=ET.fromstring((ROOT/f'docs/sources/m03-01/figures/{name}.{suffix}.svg').read_text());prefix=f'm0301-f{num}-{lang}-'
   root.attrib.pop('style',None) # Responsive display CSS is owned by ReviewedSvgVisual.
   for node in root.iter():
    for k,v in list(node.attrib.items()):
     if k=='id':node.set(k,prefix+v)
     elif k in ['aria-labelledby','aria-describedby']:node.set(k,' '.join(prefix+x for x in v.split()))
     elif 'url(#' in v:node.set(k,re.sub(r'url\(#([^)]*)\)',lambda m:'url(#'+prefix+m[1]+')',v))
   src=f'/images/ceh/m03-01-{name}-{lang}.svg'
   markup=sanitized_svg(ET.tostring(root,encoding='unicode'),prefix)
   bundle[src]=markup
   labels[lang]+= [' '.join(''.join(n.itertext()).split()) for n in root.iter() if n.tag in {f'{{{NS}}}title',f'{{{NS}}}desc',f'{{{NS}}}text'}]
 return bundle,labels
if __name__=='__main__':
 bundle,labels=generate();targets={ROOT/'src/lib/m0301-inline-svg.json':json.dumps(bundle,ensure_ascii=False,indent=2)+'\n',ROOT/'src/lib/m0301-svg-labels.json':json.dumps(labels,ensure_ascii=False,indent=2)+'\n'}
 for src,markup in bundle.items():targets[ROOT/'site'/src.lstrip('/')]=markup
 for target,value in targets.items():
  if '--check' in sys.argv:assert target.read_text()==value,str(target)
  else:target.write_text(value)
 print('8 M03-01 assets and inline/search bundles match strict serializer')

 if '--check' not in sys.argv:
  archive=io.BytesIO()
  with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED) as z:
   for src,markup in sorted(bundle.items()):
    info=zipfile.ZipInfo(Path(src).name,date_time=(2026,11,3,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED
    z.writestr(info,markup.encode())
  (ROOT/'site/downloads/ceh-m03-01-bilingual-svg.zip').write_bytes(archive.getvalue())
