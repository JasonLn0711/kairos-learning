"""Export the two reviewed DNS figures from the same content and grouping as HTML."""
from pathlib import Path
from html import escape
import json,sys
from m0307_diagrams import wrap,width
from m0903_svg import sanitized_svg,NS
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/ceh26-m04-c02/revision-2026-11-04'
def generate():
 models=json.loads((S/'diagram-models.json').read_text());groups=json.loads((R/'src/lib/dns-diagram-groups.json').read_text());targets={}
 assert set(models)==set(groups)=={'overview','security'}
 for name,langs in models.items():
  for lang,b in langs.items():
   v=b['visual'];panels=groups[name][lang];items=v['items'];assert len(items)==(13 if name=='overview' else 9)
   assert [p['count'] for p in panels]==([3,5,4,1] if name=='overview' else [3,3,2,1])
   assert sum(p['count'] for p in panels)==len(items)
   out=[];y=160;prefix=f'dns-{name}-{lang}-'
   def text(x,y,t,size=20,color='#183b59'):
    assert width(t)*size*.6<1430
    out.append(f'<text x="{x}" y="{y}" font-family="Noto Sans CJK TC,sans-serif" font-size="{size}" fill="{color}">{escape(t)}</text>')
   text(32,45,v['caption'],28)
   for j,line in enumerate(wrap(v['description'],112)):text(32,80+j*29,line)
   for p in panels:
    count=p['count'];cardw=(1396-(count-1)*26)/count;limit=int((cardw-32)/12)
    nodes=items[p['start']:p['start']+count];lines=[(wrap(n['title'],limit),wrap(n['body'],limit)) for n in nodes]
    h=105+max(len(a)+len(c) for a,c in lines)*29;band=p['kind']=='band'
    out.append(f'<rect x="20" y="{y}" width="1460" height="{h}" rx="20" fill="{ "#183b59" if band else "#ffffff"}" stroke="#8098ae"/>')
    text(42,y+34,p['title'],23,'#ffffff' if band else '#183b59')
    for i,((title,body),n) in enumerate(zip(lines,nodes)):
     x=52+i*(cardw+26);top=y+58
     out.append(f'<rect x="{x}" y="{top}" width="{cardw}" height="{h-76}" rx="13" fill="{["#e9f2ff","#e5f5f2","#f2edfc"][i%3]}" stroke="#8098ae"/>')
     for j,line in enumerate(title):text(x+16,top+28+j*29,line,20)
     for j,line in enumerate(body):text(x+16,top+38+(len(title)+j)*29,line,19)
     if p['kind']=='flow' and i<count-1:
      mid=top+(h-76)/2;out.append(f'<path d="M{x+cardw+3} {mid}h20" fill="none" stroke="#365b7a" stroke-width="2" marker-end="url(#{prefix}arrow)"/>')
    y+=h+24
   h=y+10
   header=f'<svg xmlns="{NS}" viewBox="0 0 900 {h*.6}" role="img" aria-labelledby="{prefix}title {prefix}desc"><title id="{prefix}title">{escape(v["caption"])}</title><desc id="{prefix}desc">{escape(v["description"])}</desc><defs><marker id="{prefix}arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#365b7a"/></marker></defs><rect width="1500" height="{h}" fill="#f5f8fc"/>'
   data=(sanitized_svg(header+'<g transform="scale(0.6)">'+'\n'.join(out)+'</g></svg>',prefix)+'\n').encode();assert len(data)<100000
   targets[R/'site'/b['src'].lstrip('/')]=data
 return targets
if __name__=='__main__':
 for path,data in generate().items():
  if '--check' in sys.argv:assert path.read_bytes()==data,path
  else:path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
