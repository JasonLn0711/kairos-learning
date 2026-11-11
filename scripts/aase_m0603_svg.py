"""Export seven fixed C4 views from the lesson's text-only figure data."""
import json
import sys
from html import escape
from pathlib import Path
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]
COUNTS=[4,4,3,5,4,6,4]
LABELS={
'zh':dict(deployment='實際部署（Deployment）',ordering='線上訂餐系統 — C4 Container 視角',backend='訂單後端 API（同一個應用程式）',local='本機收件完整性檢核系統',framework='Streamlit 管理的通訊',database='讀取／保存訂單與商品',payment='訂單後端 ↔ 第三方支付平台',download='瀏覽器前端 → 操作者裝置：下載 JSON'),
'en':dict(deployment='Actual deployment',ordering='Online ordering system — C4 container view',backend='Order backend API (one application)',local='Local intake-completeness checker',framework='Communication managed by Streamlit',database='Read / save orders and products',payment='Order backend ↔ third-party payment platform',download='Browser frontend → operator device: JSON download')}
def render(f,n,lang):
 out=[];l=LABELS[lang]
 def text(value,x,y,w,bold=False):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,(w-8)/22):
    out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}">{escape(line)}</text>');y+=36
  return y
 def rect(x,y,w,h,fill='#eaf1f7',dashed=False):
  return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{fill}" stroke="#7295bf"'+(' stroke-dasharray="5 5"'if dashed else '')+'/>'
 def node(i,x,y,w,fill='#eaf1f7'):
  start=len(out);out.append('');item=f['items'][i]
  end=text(item['title'],x+20,y+36,w-40,True)+8;end=text(item['body'],x+20,end,w-40)+18
  out[start]=rect(x,y,w,end-y,fill);return end
 def connection(y,label='',both=False):
  out.append(f'<path d="M520 {y}v28m-7-7 7 7 7-7'+(f'M536 {y+28}V{y}m-7 7 7-7 7 7'if both else '')+'" fill="none" stroke="#46535f" stroke-width="2"/>')
  return text(label,560,y+20,440)+20 if label else y+48
 def group_start(y,label):
  start=len(out);out.append('');return start,text(label,56,y+36,948,True)+14
 def group_end(start,top,bottom):out[start]=rect(36,top,988,bottom-top,'#fbfcfd',True)
 y=text(f['caption'],36,42,988,True)+18
 if n==1:
  # Each successive view is visually inside the preceding scope.
  def nested(i,x,y,w):
   start=len(out);out.append('');end=node(i,x+12,y+12,w-24,'#f1f3f5')
   if i<3:end=nested(i+1,x+28,end+12,w-40)
   end+=16;out[start]=rect(x,y,w,end-y,'#f1f3f5');return end
  y=nested(0,36,y,988)+24
 elif n==2:
  y=node(0,36,y,988)+12;y=connection(y,l['deployment'])
  y=max(node(i,36+(i-1)*336,y,316)for i in [1,2,3])+24
 elif n==3:
  y=node(0,36,y,988)+12;y=connection(y,both=True)
  top=y;start,y=group_start(y,'System Boundary');y=node(1,56,y,948)+20;group_end(start,top,y)
  y=connection(y+12,both=True);y=node(2,36,y,988)+24
 elif n==4:
  y=node(0,36,y,988)+12;y=connection(y)
  top=y;start,y=group_start(y,l['ordering']);y=node(1,56,y,948)+12;y=connection(y,'HTTPS / API',True);y=node(2,56,y,948)+12;y=connection(y,l['database'],True);y=node(3,56,y,948)+20;group_end(start,top,y)
  y=text(l['payment'],56,y+40,948)+16;y=node(4,36,y,988)+24
 elif n==5:
  top=y;start,y=group_start(y,l['backend'])
  for row in [0,2]:y=max(node(row,56,y,460,'#fbfcfd'),node(row+1,544,y,460,'#fbfcfd'))+20
  group_end(start,top,y);y+=24
 elif n==6:
  y=node(0,36,y,988)+12;y=connection(y)
  top=y;start,y=group_start(y,l['local']);y=node(1,56,y,948)+12;y=connection(y,l['framework'],True)
  pt=y;ps=len(out);out.append('');y=node(2,70,y+12,920)+12
  for i in [3,4]:y=node(i,90,y,880,'#f1f3f5')+12
  out[ps]=rect(56,pt,948,y-pt,'#eaf1f7');y+=20;group_end(start,top,y)
  y=text(l['download'],56,y+40,948)+16;y=node(5,36,y,988)+24
 else:
  for i in range(4):y=node(i,36,y,988,'#fbfcfd')+20
 y=text(f['description'],36,y+16,988)+24
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1060" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg);allowed={'svg','title','desc','rect','g','text','path'};attrs={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke','stroke-width','stroke-dasharray','d'}
 assert all(e.tag.split('}')[-1]in allowed and set(e.attrib)<=attrs for e in tree.iter())
 assert len(svg.encode())<100000
 return svg.encode()
def main():
 lesson=json.loads((ROOT/'content/aase/lessons/aase-m06-c03.json').read_text())
 for lang in ['zh','en']:
  figures=[b for s in lesson['text'][lang]['sections']for b in s.get('blocks',[])if b['kind']=='cards'];assert [len(f['items'])for f in figures]==COUNTS
  for n,f in enumerate(figures,1):
   dest=ROOT/f'site/images/aase/m06-03-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert dest.read_bytes()==data,f'outdated {dest}'
   else:dest.write_bytes(data)
 print('PASS: fourteen constrained C4 SVG exports synchronized.')
if __name__=='__main__':main()
