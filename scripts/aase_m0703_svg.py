"""Export fixed slice diagrams, escaping lesson text through the existing SVG boundary."""
import json,sys
from pathlib import Path
from html import escape
import xml.etree.ElementTree as ET
from aase_m0104_svg import wrap
ROOT=Path(__file__).resolve().parents[1]

def render(f,n,lang):
 out=[]
 def text(value,x,y,width=44,bold=False,color='#18252c'):
  for paragraph in value.split('\n'):
   for line in wrap(paragraph,width):
    out.append(f'<text x="{x}" y="{y}" font-size="20" font-weight="{700 if bold else 400}" fill="{color}">{escape(line)}</text>');y+=36
  return y
 def box(value,x,y,w,fill='#e2e6e9',color='#18252c'):
  at=len(out);out.append('');end=text(value,x+16,y+32,(w-32)/22,color=color)+12
  out[at]=f'<rect x="{x}" y="{y}" width="{w}" height="{end-y}" rx="8" fill="{fill}" stroke="#87949c"/>'
  return end
 y=text(f['caption'],36,42,44,True)+12
 if n==1:
  y1=text(f['items'][0]['title'],36,y,21,True)+12
  for layer in f['items'][0]['body'].split('\n'):y1=box(layer,36,y1,460)+12
  text('垂直切片開發'if lang=='zh'else'Vertical slices',540,y,21,True)
  ends=[]
  for i,item in enumerate(f['items'][1:]):
   x=540+i*166;yy=text(item['title'],x,y+56,6,True)+8
   for layer in item['body'].split('\n'):yy=box(layer,x,yy,150,'#b3dfc8'if i==0 else'#d5dbe0')+12
   ends.append(yy)
  y=max(y1,*ends)+16
 elif n==2:
  y=text(f['description'],36,y,44)+16
  for item in f['items']:
   y=text(item['title'],36,y+12,44,True)+4;y=box(item['body'],36,y,988,'#ffffff')+20
  y=box('查看本次輸入（未檢核）'if lang=='zh'else'View current input (unvalidated)',36,y,988,'#18252c','#ffffff')+36
  y=text('目前沒有預覽結果\n按下查看按鈕才會顯示；修改任一欄位會清除舊預覽。'if lang=='zh'else'No preview yet\nPress the button to show a preview. Editing any field clears the previous preview.',36,y,44)+20
 else:
  for i,item in enumerate(f['items'],1):
   y=text(f'{i}. '+item['title'],36,y,44,True)+4
   y=text(item['body'],64,y,42)+24
 if n!=2:y=text(f['description'],36,y,44)+20
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 {y}" role="img" aria-labelledby="title desc" lang="{lang}"><title id="title">{escape(f["caption"])}</title><desc id="desc">{escape(f["description"])}</desc><rect width="1060" height="{y}" fill="#fbfcfd"/><g font-family="Arial, Noto Sans CJK TC, sans-serif" fill="#18252c">'+''.join(out)+'</g></svg>\n'
 tree=ET.fromstring(svg)
 assert all(e.tag.split('}')[-1]in {'svg','title','desc','rect','g','text'} and set(e.attrib)<={'viewBox','role','aria-labelledby','lang','id','width','height','fill','font-family','x','y','font-size','font-weight','rx','stroke'}for e in tree.iter())
 assert len(svg.encode())<100000
 return svg.encode()

if __name__=='__main__':
 l=json.loads((ROOT/'content/aase/lessons/aase-m07-c03.json').read_text())
 for lang in ['zh','en']:
  figures=[next(s for s in l['text'][lang]['sections']if s['id']==id)['blocks'][0]for id in ['slice','behavior','roadmap']]
  for n,f in enumerate(figures,1):
   p=ROOT/f'site/images/aase/m07-03-{n}-{lang}.svg';data=render(f,n,lang)
   if '--check'in sys.argv:assert p.read_bytes()==data,f'outdated {p}'
   else:p.write_bytes(data)
 print('PASS: six constrained vertical-slice SVG exports synchronized')
