"""Build M08-05 from preserved complete bilingual manuscripts."""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'docs/sources/aase/m08-05/replacement-2026-11-11'
IDS = ['question', 'analogy', 'comparison', 'workflow', 'industry', 'observe', 'notes', 'improve', 'misread', 'task', 'understanding']

def figures(lang):
    if lang == 'zh':
        workflow = [('決定要研究的問題', '例如：使用者能不能發現資料缺漏？'), ('設計有目標的任務', '只交代目的、情境和必要資料。'), ('讓使用者自行操作', '主持人不提供操作答案。'), ('記錄可觀察的證據', '行為、停頓、錯誤、協助、結果。'), ('提出原因假設並改善', '先選一個有證據支持的問題。'), ('使用相同目標重新驗證', '確認改善是否真的有效。')]
        record = [('系統版本', 'v0.2'), ('測試者代號', 'P01'), ('任務', '修改資料後取得最新報告'), ('觀察行為', '修改資料後，未重新檢核即下載'), ('主持人協助', '沒有'), ('任務結果', '未取得符合要求的最新報告'), ('可能原因', '不清楚報告需要重新產生'), ('改善假設', '標記舊結果並引導重新檢核'), ('再測方式', '讓其他符合目標族群的參與者完成同類任務')]
        comparison = [('改版前', '報告管理\n資料已修改\n下載報告'), ('改版後的設計提案', '報告需要重新檢核\n資料已經變更，目前的報告不再代表最新資料。完成檢核後才能下載最新報告。\n重新檢核並更新報告')]
        captions = ['圖 1｜任務導向易用性測試的工作流程', '圖 2｜易用性測試觀察表（虛構示例）', '圖 3｜報告狀態：改版前與設計提案']
        descriptions = ['箭頭表示六個研究步驟的順序；再測後依結果決定下一個問題，並非已證明改善有效。', '這只是教學示例，不代表曾經進行真人測試。可能原因是推論，改善假設仍待再測。', '上下兩區比較兩種設計，沒有操作順序箭頭。示意介面，非實際系統；動作文字不能執行下載或檢核。']
        headers = ['欄位', '紀錄']
    else:
        workflow = [('Choose a research question', 'For example: can users discover missing data?'), ('Design a goal-based task', 'Provide only the purpose, context, and necessary data.'), ('Let the participant act', 'The facilitator does not reveal the action path.'), ('Record observable evidence', 'Actions, pauses, errors, assistance, and outcomes.'), ('Hypothesize and improve', 'Choose one problem supported by evidence.'), ('Retest with the same goal', 'Check whether the improvement actually works.')]
        record = [('System version', 'v0.2'), ('Participant code', 'P01'), ('Task', 'Obtain a current report after editing data'), ('Observed behavior', 'Downloaded after editing without validating again'), ('Facilitator assistance', 'None'), ('Task result', 'Did not obtain the required current report'), ('Possible cause', 'Unaware the report needs regeneration'), ('Improvement hypothesis', 'Mark old results and guide the user to validate again'), ('Retest', 'Ask other participants from the target group to perform comparable tasks')]
        comparison = [('Before', 'Report management\nData has changed\nDownload report'), ('Proposed redesign', 'Report needs validation again\nThe data has changed. The current report no longer represents the latest data. Validate before downloading the latest report.\nValidate again and update report')]
        captions = ['Figure 1 | Task-based usability testing workflow', 'Figure 2 | Usability observation record (fictional example)', 'Figure 3 | Report status: before and proposed redesign']
        descriptions = ['Arrows indicate the order of six research steps. Use retest findings to choose the next question; the sequence does not establish an improvement.', 'A fictional teaching example, with no claim of human testing. The possible cause is an inference; the improvement hypothesis still needs a retest.', 'The two stacked regions compare designs, without action-sequence arrows. Illustrative interface, not a live system; action labels do not download or validate anything.']
        headers = ['Field', 'Record']
    return [dict(kind='flow', caption=captions[0], description=descriptions[0], items=[dict(title=a, body=b) for a,b in workflow]), dict(kind='table', caption=captions[1], headers=headers, rows=record), dict(kind='cards', caption=captions[2], description=descriptions[2], items=[dict(title=a, body=b) for a,b in comparison])], descriptions

def parse(raw, lang):
    chunks = re.split(r'^## ', raw, flags=re.M)
    sections = []
    table_no = 0
    fs, descriptions = figures(lang)
    for index, chunk in enumerate(chunks):
        lines = chunk.splitlines()
        heading = ('這一課要學的核心' if lang == 'zh' else 'The core idea') if index == 0 else lines.pop(0).strip()
        if index == 0: lines = lines[1:]
        section = dict(id=IDS[index], heading=heading, paragraphs=[], blocks=[])
        pending = []
        def flush():
            if not pending: return
            values = ['\n\n'.join(pending)]
            if section['blocks']: section['blocks'].append(dict(kind='prose', paragraphs=values))
            else: section['paragraphs'] = values
            pending.clear()
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            if not line: i += 1; continue
            if line.startswith('@figure'):
                flush(); n=int(line[-1]); section['blocks'].append(fs[n-1])
                if n == 2: section['blocks'].append(dict(kind='prose', paragraphs=[descriptions[1]]))
                i+=1; continue
            if line.startswith('|'):
                flush(); rows=[]
                while i < len(lines) and lines[i].strip().startswith('|'):
                    rows.append([v.strip() for v in lines[i].strip().strip('|').split('|')]); i+=1
                table_no += 1
                section['blocks'].append(dict(kind='table',caption=(f'表 {table_no}｜' if lang=='zh' else f'Table {table_no} | ')+heading,headers=rows[0],rows=rows[2:])); continue
            # Subheadings remain separate semantic prose entries.
            if line.startswith('### '):
                flush(); section['blocks'].append(dict(kind='prose',paragraphs=[line])); i+=1; continue
            pending.append(line); i+=1
        flush()
        if not section['blocks']: del section['blocks']
        sections.append(section)
    assert len(sections)==11
    return sections

def main():
    lesson=json.loads((SOURCE/'prior-lesson.json').read_text())
    lesson.update(revision=4,contentVersion='1.1.0',date='2026-11-11')
    for lang in ['zh','en']:
        sections=parse((SOURCE/f'teaching.{lang}.md').read_text(),lang)
        lesson['text'][lang]['sections']=sections
    # Group contiguous prose equally without removing any manuscript text.
    for zh,en in zip(lesson['text']['zh']['sections'],lesson['text']['en']['sections']):
        assert bool(zh['paragraphs'])==bool(en['paragraphs']),zh['id']
        assert [b['kind'] for b in zh.get('blocks',[])]==[b['kind'] for b in en.get('blocks',[])],zh['id']
    lesson['checks']=[dict(id='AASE-M08-C05-Q04',answer=2,text={
        'zh':dict(prompt='護士找不到取消錯誤醫囑的方式，研究員認為她們不熟悉電腦。哪種處理符合任務導向易用性測試？',options=['先請護士參加電腦教育訓練，再結束測試','告訴護士按哪個按鈕，只要成功就記錄通過','記錄卡住的操作、詢問當時理解，再提出介面改善假設並重新測試','因為程式測試通過，所以不用修改介面'],rationales=['能力原因尚未查證；先記錄實際困難。','提供提示後應記為協助完成，並保留提示內容。','C 正確：將觀察與原因推論分開，再以測試驗證設計假設。','功能運作與使用者能否完成任務需分別驗證。']),
        'en':dict(prompt='Nurses cannot find how to cancel an incorrect order. A researcher attributes this to poor computer skills. What should the team do?',options=['Send the nurses to training and end the test.','Identify the button and count their success as a pass.','Record the difficulty, ask about their understanding, hypothesize an interface improvement, and retest.','Keep the interface because program tests passed.'],rationales=['The proposed cause is unverified; record the actual difficulty first.','Record assisted completion and preserve the prompt.','C is correct: separate observation from inference and test the design hypothesis.','Working functions and users completing tasks require separate evidence.'])})]
    out=ROOT/'content/aase/lessons/aase-m08-c05.json'
    data=json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
    if '--check' in sys.argv: assert out.read_text()==data
    else: out.write_text(data)
    print('PASS: complete eleven-section bilingual M08-05 replacement')

if __name__=='__main__': main()
