"""Build the paired M04-08 draft from complete reviewed public manuscripts."""
from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
S=ROOT/'docs/sources/m04-08'
def parse(lang,suffix):
    chunks=(S/f'teaching.{suffix}.md').read_text().strip().split('\n\n')[1:]
    blocks=[];n=0
    for text in chunks:
        if text.startswith('**') and (text[2:3].isdigit() or text.startswith(('**小檢核','**來源與適用','**One small','**Sources and'))):
            n+=1
            if n==8:
                blocks.append(dict(kind='answer',id='answer-ldap-completeness',summary='參考答案' if lang=='zh' else 'Reference answer',paragraphs=(S/f'answer.{suffix}.md').read_text().strip().split('\n\n')))
            blocks.append(dict(kind='heading',id=f'section-{n}',text=text.removeprefix('**').removesuffix('**')))
        elif text.startswith('- '):
            blocks.append(dict(kind='list',items=[line[2:].replace('**','') for line in text.splitlines()]))
        else:
            blocks.append(dict(kind='paragraph',text=text.replace('**','')))
    assert n==8
    return dict(summary='核對 LDAP 查詢的身分、起點、範圍、欄位及結束狀態，判讀帳號盤點是否完整。' if lang=='zh' else "Check an LDAP query's identity, base, scope, attributes, and final status to assess whether an account inventory is complete.",sections=[],sourceBody=blocks)
lesson=dict(id='CEH26-M04-C08',revision=1,contentVersion='1.0.0',date='2026-11-06',status='draft',publishedOn='9999-12-31',qa=[],text={lang:parse(lang,suffix) for lang,suffix in [('zh','zh-TW'),('en','en')]})
data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
target=ROOT/'content/concepts/ceh26-m04-c08.json'
if '--check' in sys.argv: assert target.read_text()==data
else: target.write_text(data)
