"""Build M04-09 from complete paired public manuscripts, without learner records."""
from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
S=ROOT/'docs/sources/m04-09'
def parse(lang,suffix):
    chunks=(S/f'teaching.{suffix}.md').read_text().strip().split('\n\n')[1:]
    blocks=[];n=0
    for text in chunks:
        if re.match(r'^\*\*\d+\. ',text):
            n+=1
            blocks.append(dict(kind='heading',id=f'section-{n}',text=text.removeprefix('**').removesuffix('**')))
        elif text.startswith('- '):
            blocks.append(dict(kind='list',items=[line[2:].replace('**','') for line in text.splitlines()]))
        elif re.match(r'^(?:\d+\.|[A-D]\.) ',text):
            blocks.append(dict(kind='list',items=[line.replace('**','') for line in text.splitlines()]))
        else:
            blocks.append(dict(kind='paragraph',text=text.replace('**','')))
        if text.startswith(('本題是原創教學題','This is an original teaching question')):
            blocks.append(dict(kind='answer',id='answer-response-evidence',summary='參考解答：各項回應的證據界線' if lang=='zh' else 'Reference answer: evidence boundaries for each response',paragraphs=(S/f'answer.{suffix}.md').read_text().strip().split('\n\n')))
    assert n==9
    assert sum(b['kind']=='answer' for b in blocks)==1
    return dict(summary='辨認校時、VPN、語音、IPv6、路由與檔案服務的用途，區分回應、驗證、權限及待補證據。' if lang=='zh' else 'Identify the roles of time, VPN, voice, IPv6, routing, and file services, and distinguish responses, authentication, permissions, and missing evidence.',sections=[],sourceBody=blocks)
lesson=dict(id='CEH26-M04-C09',revision=1,contentVersion='1.0.0',date='2026-11-07',status='published',publishedOn='2026-11-07',qa=[],text={lang:parse(lang,suffix) for lang,suffix in [('zh','zh-TW'),('en','en')]})
data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
target=ROOT/'content/concepts/ceh26-m04-c09.json'
if '--check' in sys.argv: assert target.read_text()==data
else: target.write_text(data)
