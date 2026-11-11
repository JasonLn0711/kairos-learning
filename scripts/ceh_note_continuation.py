"""Preserve both supplied editions on the same dated page, with traceable source units."""
import copy,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/ceh-notes/2026-11-10/continuation-17-reference'

def clean(text):
 return text.replace('`','').replace('\\\\(','').replace('\\\\)','').replace('\\\\[','').replace('\\\\]','').replace('\\bmod',' mod ').replace('\\.','.').strip()

def prose(text,part,index,lang):
 t=clean(text)
 if t.startswith('|'):
  rows=[[c.strip() for c in line.strip().strip('|').split('|')] for line in t.splitlines()]
  assert all(re.fullmatch(r'[:\-\s]+',c) for c in rows[1])
  return {'kind':'table','headers':rows[0],'rows':rows[2:]}
 if t.startswith('#') or (re.match(r'^\d\.\s',t) and '\n' not in t) or t in ['1','2','3','4','5']:
  heading=re.sub(r'^#+\s*','',t)
  if t in ['1','2','3','4','5']:heading=('情境 ' if lang=='zh' else 'Scenario ')+t
  return {'kind':'heading','id':f'p{part}-cont-u{index}','text':heading}
 if t.startswith('- ') or re.match(r'^\d\.\s',t):
  return {'kind':'list','items':[re.sub(r'^(?:- |\d\.\s+)','',line) for line in t.splitlines()]}
 if text.strip().startswith('\\\\['):return {'kind':'code','text':t}
 return {'kind':'paragraph','text':t.lstrip('> ')}

# Source author statements about answer verification are attributed, not independently certified.
CORRECTIONS={
 (2,9):('供稿作者說明已依題幹及技術規範重新判斷；本文保留為供稿參考答案，原題全文與所有選項仍待獨立核對。尤其以下四點須區分考試簡化與實務事實：','The source author reports reconsidering the answers using the prompts and technical standards. They remain supplied proposed answers; complete original questions and all options still require independent verification. Distinguish the following four exam simplifications from operational facts:'),
 (2,235):('供稿列出九筆參考答案；部分題目的教學描述須加上條件，原題全文仍待核對。以下四個限制值得記在筆記中。','The source supplies nine proposed answers. Some explanations need conditions, and the complete original questions still require verification. Record the following four limits.'),
 (3,15):('† 表示須補充技術條件、歧義或實務限制。供稿作者依所述題幹及選項獨立判讀；本文保留為供稿參考答案，未宣稱已核對未提供的原題全文與答案欄。','† marks necessary technical conditions, ambiguity or operational limits. The source author independently assessed the described prompts and options; these remain supplied proposed answers, without claiming verification of unavailable complete originals or their answer keys.'),
 (2,270):('本組先不提供正解。請獨立作答並保留判斷理由，之後再依實際答案檢視推理與待補強概念。','This set withholds answers. Attempt it independently and retain your reasoning for later review of your actual responses and conceptual gaps.'),
 (2,239):('以下七個主動回憶問題保留供稿題號。先自行回答，再回查本部分的原理解說；原附件未附卡片翻面的答案。','The seven recall prompts retain the supplied references. Answer first, then consult the explanations in this part; the attachment did not include the reverse-side answers.'),
 (3,307):('以下七個主動回憶問題涵蓋本次九筆題號。先自行回答，再回查本部分解說；原附件未附卡片翻面的答案。','The seven recall prompts cover the nine supplied references. Answer first, then consult this part’s explanations; the attachment did not include reverse-side answers.')}

def build_source_edition(part,refs):
 records=json.loads((SOURCE/f'part-{part}-paragraph-map.json').read_text())
 replacements={r['sourceUnits'][0]:(r['sourceUnits'][1],r) for r in refs if r['part']==part}
 result={};ledger=[]
 for lang in ['zh','en']:
  sections=[{'id':f'p{part}-continuation','heading':'續篇供稿版｜完整教學與原始練習' if lang=='zh' else 'Continuation manuscript | Complete teaching and original exercises','body':[{'kind':'paragraph','text':'以下保留同日續篇的解說、案例與練習。前面的完整稿版本另有擴充推導；本組五道情境題先保留自行作答，不提供答案鍵。' if lang=='zh' else 'This edition preserves the dated continuation’s explanations, cases and exercises. The preceding complete-manuscript edition contains additional derivations. The five scenarios in this part remain self-exercises without answer keys.'}]}]
  i=0
  while i<len(records):
   source_index=i
   if i in replacements:
    end,ref=replacements[i];sections[-1]['body'].append(copy.deepcopy(ref['text'][lang]));i=end+1;decision='reference-redrawn';end_index=end
   elif part==2 and i==14:
    # The source includes a textual feedback cycle but no separate PNG.
    labels=[('辨識與評估風險（ISO/IEC 27005）','Identify and assess risks (ISO/IEC 27005)'),('選擇與實施防護（Encryption／PKI）','Select and implement protections (encryption / PKI)'),('授權驗證防護（White Hat Testing）','Verify with authorization (white-hat testing)'),('持續監控與應變（SOC Tier 1–3）','Continuous monitoring and response (SOC tiers 1–3)'),('維持關鍵業務（BCP／Recovery）','Maintain critical operations (BCP / recovery)'),('管理資料生命週期（Purge／Destroy）','Manage the data lifecycle (purge / destroy)'),('紀錄與持續改善','Records and continual improvement')]
    ix=0 if lang=='zh' else 1
    sections[-1]['body'].append({'kind':'table','headers':['起點','下一項／回饋'] if lang=='zh' else ['From','Next / feedback'],'rows':[[labels[j][ix],labels[(j+1)%7][ix]] for j in range(7)]})
    sections[-1]['body'].append({'kind':'paragraph','text':records[16][lang]});i=17;end_index=16;decision='feedback-cycle-as-html-table'
   elif (part==2 and i==256):
    sections[-1]['body'].append({'kind':'table','headers':['間隔','日期'] if lang=='zh' else ['Interval','Date'],'rows':[['D+1','11/11'],['D+3','11/13'],['D+7','11/17'],['D+14','11/24'],['D+30','12/10']]});i=266;end_index=265;decision='review-intervals-as-table'
   else:
    t=records[i][lang];end_index=i
    if (part,i) in CORRECTIONS:t=CORRECTIONS[(part,i)][0 if lang=='zh' else 1]
    if t.startswith('## '):
     sections.append({'id':f'p{part}-cont-u{i}','heading':('續篇供稿｜' if lang=='zh' else 'Continuation | ')+clean(t.removeprefix('## ')),'body':[]})
    else:
     block=prose(t,part,i,lang)
     if records[i]['zh'].strip().startswith('\\\\['):block={'kind':'code','text':clean(t)}
     sections[-1]['body'].append(block)
    decision='attributed-or-interface-correction' if (part,i) in CORRECTIONS else 'paired-full-text'
    i+=1
   if lang=='zh':ledger.append({'part':part,'units':[source_index,end_index],'target':sections[-1]['id'],'decision':decision})
  for section in sections:
   if not section['body']:section['body']=[{'kind':'paragraph','text':'以下小節展開本部分的觀念與練習。' if lang=='zh' else 'The following subsections develop the concepts and exercises.'}]
  result[lang]=sections
 return result,ledger

def adopt_continuation(note):
 refs=json.loads((SOURCE/'reference-diagrams.json').read_text())
 for number in (2,3):
  part=next(p for p in note['parts'] if p['number']==number)
  edition,_=build_source_edition(number,refs)
  for lang in ['zh','en']:part['text'][lang]['sections'].extend(edition[lang])
 for id,title,url in [('nist-800111','NIST SP 800-111 — Storage encryption scopes','https://csrc.nist.gov/pubs/sp/800/111/final'),('veracrypt-security-model','VeraCrypt — Security Model','https://veracrypt.io/en/Security%20Model.html'),('retrieval-practice','Roediger and Karpicke — Test-enhanced learning','https://pubmed.ncbi.nlm.nih.gov/16507066/'),('spacing-review','Cepeda et al. — Distributed practice and retention intervals','https://pubmed.ncbi.nlm.nih.gov/16719566/')]:
  if not any(source['id']==id for source in note['sources']):note['sources'].append({'id':id,'title':title,'url':url,'checkedOn':'2026-11-11'})
 note['contentVersion']='1.2.2';note['revision']=5;note['revisedOn']='2026-11-11'
