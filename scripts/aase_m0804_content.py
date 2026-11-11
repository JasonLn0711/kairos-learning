"""Build the full bilingual M08-04 lesson from preserved manuscripts and examples."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'docs/sources/aase/m08-04/replacement-2026-11-11'
IDS = ['interface', 'analogy', 'layers', 'rerun', 'terms', 'example', 'syntax', 'industry', 'misread', 'understanding']


def parse(raw, lang, figures):
    sections = []
    lines = raw.splitlines()
    i = 0
    table = code_no = 0
    def prose(value):
        if not section['blocks']:
            section['paragraphs'].append(value)
        elif section['blocks'][-1]['kind'] == 'prose':
            section['blocks'][-1]['paragraphs'].append(value)
        else:
            section['blocks'].append(dict(kind='prose', paragraphs=[value]))
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        if line.startswith('## '):
            section = dict(id=IDS[len(sections)], heading=line[3:], paragraphs=[], blocks=[])
            sections.append(section)
            i += 1
        elif line.startswith('@figure'):
            section['blocks'].append(figures[int(line[-1])-1])
            i += 1
        elif line.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                rows.append([v.strip() for v in lines[i].strip().strip('|').split('|')])
                i += 1
            table += 1
            section['blocks'].append(dict(kind='table', caption=f'{"表" if lang=="zh" else "Table"} {table}', headers=rows[0], rows=rows[2:]))
        elif line in ['@app', '@tests']:
            path = 'app.py' if line == '@app' else 'tests/test_app.py'
            section['blocks'].append(dict(kind='step', heading=path, paragraphs=['合成資料範例；兩語共用相同程式與介面標籤。' if lang=='zh' else 'Synthetic-data example; both languages share identical code and interface labels.'], code=(ROOT/'resources/aase/examples/m08-04'/path).read_text().rstrip()))
            i += 1
        elif line.startswith('```'):
            code = []
            i += 1
            while i < len(lines) and not lines[i].startswith('```'):
                code.append(lines[i])
                i += 1
            assert i < len(lines), 'unclosed fence'
            i += 1
            code_no += 1
            heading = (['專案結構','安裝與測試','啟動應用程式'] if lang=='zh' else ['Project structure','Install and test','Start the application'])[code_no-1]
            section['blocks'].append(dict(kind='step', heading=heading, paragraphs=['在自己的合成練習專案依序操作。' if lang=='zh' else 'Follow these steps in your own synthetic practice project.'], code='\n'.join(code)))
        else:
            values = []
            while i < len(lines) and lines[i].strip():
                values.append(lines[i])
                i += 1
            prose('\n'.join(values))
    for s in sections:
        if not s['blocks']:
            del s['blocks']
    next(b for s in sections for b in s.get('blocks',[]) if b.get('code')=='python -m streamlit run app.py')['id'] = 'run'
    assert len(sections) == len(IDS)
    return sections


def main():
    lesson = json.loads((SOURCE/'previous-lesson.json').read_text())
    lesson.update(revision=4, contentVersion='1.1.0', date='2026-11-11')
    figures = json.loads((SOURCE/'figures.json').read_text())
    for lang in ['zh','en']:
        t = lesson['text'][lang]
        t['sections'] = parse((SOURCE/f'teaching.{lang}.md').read_text(), lang, figures[lang])
        t['readingGuide']['startingPoint'] = 'Python 虛擬環境、Streamlit 1.51.0、pytest 與本課 app.py；先讀 M08-03 的規則測試。' if lang=='zh' else 'A Python virtual environment, Streamlit 1.51.0, pytest and this lesson’s app.py; read the rule tests in M08-03 first.'
        t['exercise']['environment'] = t['readingGuide']['startingPoint']
        t['exercise']['steps'] = ['依本課建立 app.py 與 tests/test_app.py，執行三階段測試並保存輸出。','在自己的副本暫時移除 on_change=invalidate，重跑測試，確認第三階段會失敗；恢復回呼再測。','啟動真實程式，用鍵盤重演三階段並下載 report.json，核對檔名、中文與 JSON 內容，分開記錄結果。'] if lang=='zh' else ['Create app.py and tests/test_app.py from this lesson, run the three-stage test and retain output.','Temporarily remove on_change=invalidate in your own copy. Rerun and confirm stage three fails; restore the callback and test again.','Start the actual program, replay all three stages by keyboard and download report.json. Verify its name, Chinese text and JSON contents, recording results separately.']
    # Preserve the IDs for rerun, stale-state and browser-evidence concepts.
    questions = [
        (1, '使用者修改輸入後，AppTest 要如何取得新畫面？', ['直接檢查上次的結果','呼叫 run() 後再檢查','只要改變輸入就一定成功','把測試中的 assert 刪除'], ['上次結果可能仍是舊畫面。','明確重跑後，斷言才能對應本次輸入。','設定輸入本身不會自動重跑 AppTest。','刪除斷言會失去驗證。'], 'After input changes, how does AppTest obtain the new screen?', ['Inspect the previous result directly.','Call run(), then inspect.','Changing input guarantees success.','Delete the assertions.'], ['The previous result may still be stale.','An explicit rerun connects assertions to the current input.','Setting input does not automatically rerun AppTest.','Removing assertions removes verification.']),
        (2, '訂單成功後，使用者將必填資料清空。什麼行為最合理？', ['仍保留原本成功與下載狀態','只改變畫面顏色','使舊確認結果失效，要求重新檢查','刪掉全部使用者帳號'], ['資料已改變，舊成功可能不再有效。','顏色變更無法清除過期報告。','結果依賴輸入；變更後先失效，再重新驗證。','刪除帳號與本次輸入驗證無關。'], 'After a successful order, the user clears required data. What should happen?', ['Retain the previous success and download state.','Only change the screen color.','Invalidate the old confirmation and require another check.','Delete all user accounts.'], ['Changed data may invalidate the previous success.','A color change does not clear a stale report.','The result depends on input; invalidate it and revalidate.','Deleting accounts is unrelated to validating this input.']),
        (3, 'AppTest 已確認下載按鈕存在。下一步最重要的是？', ['宣布完整系統驗收通過','不需要其他測試','只測試按鈕顏色','用真實瀏覽器驗證下載檔案與內容'], ['元件存在不足以證明完整系統通過驗收。','實際下載仍缺少證據。','顏色不是檔案交付證據。','讀取實際檔案，確認檔名、內容與目前輸入一致。'], 'AppTest confirms the download button exists. What is the most important next step?', ['Declare complete system acceptance.','Do no further testing.','Only test the button color.','Verify the downloaded file and contents in a real browser.'], ['Component presence does not establish complete system acceptance.','Actual downloading still lacks evidence.','Color is not evidence of file delivery.','Inspect the actual filename and contents against the current input.'])
    ]
    lesson['checks'] = []
    for n,q in enumerate(questions):
        answer = [1,2,3][n]
        lesson['checks'].append(dict(id='AASE-M08-C04-Q'+['01','03','02'][n], answer=answer, text=dict(zh=dict(prompt=q[1],options=q[2],rationales=q[3]),en=dict(prompt=q[4],options=q[5],rationales=q[6]))))
    dest = ROOT/'content/aase/lessons/aase-m08-c04.json'
    data = json.dumps(lesson,ensure_ascii=False,indent=2)+'\n'
    if '--check' in sys.argv:
        assert dest.read_text()==data, 'lesson differs from manuscripts'
    else:
        dest.write_text(data)
    print('PASS: complete M08-04 bilingual manuscripts, shared runnable code and three supplied questions.')

if __name__=='__main__':
    main()
