"""Generate reviewed article and paired assets from complete manuscripts."""
from cs_systems_body import parse,R,S
from cs_systems_diagrams import models,render
import json,sys
mapping={'lifecycle':(2,0),'hardware':(3,8),'links':(4,0),'cas':(5,0),'environment':(7,0),'docker':(9,0),'git-areas':(11,0),'git-dag':(11,0)}
# Stable section IDs follow all source h2 headings, including diagram headings.
def text(lang,suffix):
 sections=parse(suffix)
 for sec in sections:
  sec['body']=[b for b in sec['body'] if not(b['kind']=='paragraph' and b['text']=='{{figure:links}}')]
 placements={'lifecycle':(2,None),'hardware':(3,1),'links':(4,2),'cas':(5,2),'environment':(7,2),'docker':(9,None),'git-areas':(11,None),'git-dag':(11,2)}
 for name,(index,sub) in placements.items():
  body=sections[index]['body'];pos=0
  if sub is not None:pos=next(i+1 for i,b in enumerate(body) if b['kind']=='heading' and b['id'].endswith(f'-sub-{sub}'))
  body.insert(pos,{'kind':'systemsFigure','name':name})
 citations={4:['inode','rename'],7:['venv','pnpm','uv'],8:['uv','docker'],9:['docker'],10:['git'],11:['git'],12:['github-cache'],15:['rename']}
 for i,ids in citations.items():sections[i]['sourceIds']=ids
 return {'title':'資工底層原理通識課：從一個位元組到完整軟體系統' if lang=='zh' else 'Computer Science Foundations: From a Byte to a Complete Software System','summary':'從資源、身分、狀態與操作理解系統各層，選擇可核對的排錯方法與驗收證據。' if lang=='zh' else 'Understand system layers through resources, identity, state and operations, then choose verifiable troubleshooting and acceptance evidence.','author':'CS Kairos Learn','sections':sections}
article={'id':'cs-systems-foundations','slug':'cs-systems-foundations','status':'published','publishedOn':'2026-11-08','updatedOn':'2026-11-08','contentVersion':'1.0.0','revision':1,'category':'analysis','topics':['cs','ai','security'],'sources':[{'id':i,'title':t,'url':u,'checkedOn':'2026-11-08'} for i,t,u in [('inode','Linux inode(7)','https://man7.org/linux/man-pages/man7/inode.7.html'),('rename','Linux rename(2)','https://man7.org/linux/man-pages/man2/rename.2.html'),('venv','Python venv','https://docs.python.org/3/library/venv.html'),('pnpm','pnpm dependency structure','https://pnpm.io/symlinked-node-modules-structure'),('uv','uv cache safety','https://docs.astral.sh/uv/concepts/cache/'),('docker','Docker storage','https://docs.docker.com/engine/storage/'),('git','Git: What is Git?','https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F'),('github-cache','GitHub dependency caching','https://docs.github.com/en/actions/concepts/workflows-and-actions/dependency-caching')]],'related':[],'updates':[],'text':{lang:text(lang,suffix) for lang,suffix in [('zh','zh-TW'),('en','en')]}}
outputs={R/'content/perspectives/cs-systems-foundations.json':(json.dumps(article,ensure_ascii=False,indent=2)+'\n').encode(),R/'src/lib/cs-systems-diagrams.json':(json.dumps(models(),ensure_ascii=False,indent=2)+'\n').encode()}
for name,m in models().items():
 for lang in ['zh','en']:outputs[R/f'site/images/perspectives/cs-systems-{name}-{lang}.svg']=render(name,m,lang)
# Draft static assets are kept outside the public static directory until review.
# Reviewed exports now enter the public static tree for release validation.
outputs.update({S/'staged-assets'/p.name:b for p,b in list(outputs.items()) if 'site/images' in str(p)})
for p,b in outputs.items():
 if '--check' in sys.argv:assert p.read_bytes()==b,p
 else:p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b)
print('Article and 16 public SVG assets verified' if '--check' in sys.argv else 'Article and 16 public SVG assets generated')
