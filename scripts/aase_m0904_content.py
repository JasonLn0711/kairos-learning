"""Generate M09-04 from preserved complete bilingual manuscripts."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/sources/aase/m09-04/replacement-2026-11-11'
IDS=['change','analogy','contracts','compare','plan','responsibility','exercise-plan','continue','understanding']
def figures(lang):
 if lang=='zh':
  items=[ [('可以更換的工具','AI 模型\nCoding Agent\nUI 開發框架\n資料庫與部署方式\n第三方套件'),('必須持續履行的責任','使用者真正的需求\n業務規則與驗收條件\n資料安全與權限\n測試與故障復原\n文件、交接與負責人')], [('說清楚為什麼要換','改善速度、成本、品質或安全'),('確認哪些行為不能變','需求、業務規則、資料及權限'),('分析影響範圍','程式、介面、資料、環境、操作'),('設定測試與通過標準','正常案例、錯誤案例、權限檢查'),('小範圍遷移並實測','保留紀錄，比較新舊差異'),('決定接受或復原','驗收通過才擴大，失敗就停止')], [('問題與需求','到底要解決什麼？'),('設計與規格','應該怎麼運作？'),('系統實作','用什麼技術做出來？'),('測試驗收','如何證明真的能用？'),('交付與改善','如何持續可靠地運作？')] ]
  captions=['圖 1｜可替換工具與持續責任','圖 2｜先定義成功的六步遷移','圖 3｜AASE 的五層責任鏈']
  desc=['兩欄為平行對照，窄版依序重排；責任可依新需求調整，但須明確決策、更新規格並重新驗證，工具不能自行決定。','五條向下箭頭表示六個步驟的作業順序；最後依驗收結果決定接受或復原，不表示已執行或已通過。','五列呈現工程責任的不同層次，沒有通過或因果箭頭。實作技術可以替換，每次仍需檢查其他層受影響的承諾。']
 else:
  items=[[('Replaceable tools','AI models\nCoding Agents\nUI frameworks\nDatabases and deployment\nThird-party packages'),('Continuing responsibilities','Actual user needs\nBusiness rules and acceptance criteria\nData security and permissions\nTesting and failure recovery\nDocumentation, handoff, and owners')],[('Explain the reason for change','Improve speed, cost, quality, or safety'),('Identify behavior to retain','Requirements, business rules, data, and permissions'),('Analyze the impact','Code, interfaces, data, environments, and operations'),('Define tests and pass criteria','Normal cases, error cases, and authorization checks'),('Migrate a small scope and execute tests','Retain records and compare old and new behavior'),('Accept or recover','Expand only after acceptance; stop on failure')],[('Problem and requirements','What problem are we solving?'),('Design and specification','How should it work?'),('System implementation','Which technology implements it?'),('Testing and acceptance','How do we establish that it works?'),('Delivery and improvement','How can it keep operating reliably?')]]
  captions=['Figure 1 | Replaceable tools and continuing responsibilities','Figure 2 | Six migration steps, starting with success criteria','Figure 3 | Five layers of AASE responsibility']
  desc=['The columns are parallel comparisons and stack on narrow screens. Responsibilities may change with new requirements, through explicit decisions, updated specifications, and renewed verification; tools cannot decide independently.','Five downward arrows show the working order of six steps. Acceptance evidence determines whether to accept or recover; the diagram does not claim execution or success.','The rows identify different engineering responsibilities, without success or causal arrows. Implementation technology may change; each replacement still requires checking commitments in the other layers.']
 return [dict(kind=k,caption=c,description=d,items=[dict(title=t,body=b)for t,b in v])for k,c,d,v in zip(['cards','flow','cards'],captions,desc,items)]
def parse(lang):
 chunks=re.split(r'^## ',(SOURCE/f'teaching.{lang}.md').read_text(),flags=re.M);assert len(chunks)==9
 sections=[]
 for n,chunk in enumerate(chunks):
  lines=chunk.splitlines();heading=lines.pop(0)if n else ('工具變動與持續責任'if lang=='zh'else 'Changing tools and continuing responsibility')
  if not n:lines=lines[1:]
  s=dict(id=IDS[n],heading=heading,paragraphs=[],blocks=[]);pending=[]
  def flush():
   paragraphs=[p.strip()for p in re.split(r'\n\s*\n','\n'.join(pending))if p.strip()];pending.clear()
   if not paragraphs:return
   if s['blocks']:s['blocks'].append(dict(kind='prose',paragraphs=paragraphs))
   else:s['paragraphs']=paragraphs
  i=0
  while i<len(lines):
   line=lines[i]
   if line.startswith('@figure'):
    flush()
    if not s['paragraphs']:s['paragraphs']=['請比較可替換工具與持續責任。'if lang=='zh'else 'Compare replaceable tools with continuing responsibilities.']
    s['blocks'].append(figures(lang)[int(line[-1])-1]);i+=1
   elif line.startswith('|'):
    flush();rows=[]
    while i<len(lines)and lines[i].startswith('|'):rows.append([c.strip()for c in lines[i].strip('|').split('|')]);i+=1
    s['blocks'].append(dict(kind='table',caption=('對照表｜'if lang=='zh'else 'Comparison | ')+heading,headers=rows[0],rows=rows[2:]))
   else:pending.append(line);i+=1
  flush();sections.append(s)
 return sections

def main():
 lesson=json.loads((SOURCE/'prior-lesson.json').read_text());lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
 for lang in ['zh','en']:lesson['text'][lang]['sections']=parse(lang)
 for z,e in zip(lesson['text']['zh']['sections'],lesson['text']['en']['sections']):
  assert len(z['paragraphs'])==len(e['paragraphs']),(z['id'],len(z['paragraphs']),len(e['paragraphs']))
  assert [b['kind']for b in z['blocks']]==[b['kind']for b in e['blocks']],z['id']
  for zb,eb in zip(z['blocks'],e['blocks']):
   if zb['kind']=='prose':assert len(zb['paragraphs'])==len(eb['paragraphs']),(z['id'],len(zb['paragraphs']),len(eb['paragraphs']))
 prompts=[('這次更換技術時，哪一種做法最合理？','Which approach best fits this technology change?'),('舊版預約規則測試全部通過，是否代表新版 UI 已驗收完成？','Do passing old appointment-rule tests establish acceptance of the new UI?'),('新的 AI Agent 自行決定擴大病歷存取權限，應該怎麼處理？','What should happen if the new AI Agent independently expands medical-record access?')]
 options=[(['新模型比較強，直接替換即可','保留既有需求與權限契約，先分析影響再遷移','把所有規格清空，讓 AI 重新決定'],['Replace it directly because the new model is stronger.','Retain requirements and permission contracts, analyze impact, then migrate.','Erase all specifications and let AI decide again.']),(['是，核心規則沒壞就夠了','否，仍需測試操作流程、畫面狀態與部署等變更','是，只要使用知名 UI 框架就可以'],['Yes; intact core rules are sufficient.','No; test changed workflows, screen state, deployment, and other affected behavior.','Yes, provided a well-known UI framework is used.']),(['接受，因為 AI 是為了完成任務','只要運作正常就不必記錄','停止未授權變更，由負責人確認權限與規格'],['Accept it because the AI is completing its task.','Leave it unrecorded if operation appears normal.','Stop the unauthorized change and have owners confirm permissions and specifications.'])]
 reasons=[(['模型能力不能證明需求與權限仍被遵守。','先保留契約、分析影響，再用對應證據驗收。','需求與驗收標準需要明確負責人決策。'],['Model capability does not establish compliance with requirements and permissions.','Retain contracts, assess impact, then accept using relevant evidence.','Requirements and acceptance criteria need decisions by named owners.']),(['規則測試不涵蓋所有 UI 整合行為。','遷移的驗證範圍必須包含受影響的 UI 與部署。','框架品牌不能代替實際驗證。'],['Rule tests do not cover every UI integration behavior.','Migration verification must include affected UI and deployment behavior.','A framework brand cannot replace actual verification.']),(['完成任務不授予額外資料權限。','正常畫面無法證明授權正確，變更仍需追溯。','由負責人決策並更新規格、重新驗證後才可採用。'],['Task completion grants no extra data permissions.','An apparently working screen does not prove correct authorization; changes need traceability.','Owners must decide, update specifications, and reverify before adoption.'])]
 lesson['checks']=[dict(id=f'AASE-M09-C04-Q{n+4:02}',answer=a,text={l:dict(prompt=prompts[n][i],options=options[n][i],rationales=reasons[n][i])for i,l in enumerate(['zh','en'])})for n,a in enumerate([1,1,2])]
 out=ROOT/'content/aase/lessons/aase-m09-c04.json';data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
 if '--check'in sys.argv:assert out.read_text()==data
 else:out.write_text(data)
 print('PASS: complete M09-04 bilingual source synchronized')
if __name__=='__main__':main()
