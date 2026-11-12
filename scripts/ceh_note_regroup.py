"""Keep source-date notes separate while preserving published chapter anchors."""
import copy
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
BEFORE = ROOT / 'docs/sources/ceh-notes/2026-11-10/c01-c05-replacement-2026-11-12/before-note.json'

def regroup_notes(expanded):
    historical = json.loads(BEFORE.read_text(encoding='utf-8'))
    historical.update(revision=8, contentVersion='1.5.0', revisedOn='2026-11-12')
    current = copy.deepcopy(expanded)
    current.update(date='2026-11-12', revision=1, contentVersion='1.0.0', publishedOn='2026-11-12', revisedOn='2026-11-12')
    current['parts'] = [copy.deepcopy(expanded['parts'][0])]
    current['parts'][0]['publishedOn'] = '2026-11-12'
    for lang in ['zh', 'en']:
        current['parts'][0]['text'][lang]['sections'] = [s for s in expanded['parts'][0]['text'][lang]['sections'] if s['id'].startswith(('p1-c01-', 'p1-c06-'))]
        current['parts'][0]['text'][lang]['title'] = '第 1 部分｜C01–C16：安全基礎、駭客類型與倫理界線' if lang == 'zh' else 'Part 1 | C01–C16: security foundations, hacker types and ethical boundaries'
        current['text'][lang]['title'] = '2026-11-12｜CEH 考古題知識筆記' if lang == 'zh' else '2026-11-12 | CEH question knowledge notes'
        current['text'][lang]['summary'] = '11 月 12 日供稿的 Day 01 知識筆記，依 C 編號整理觀念、案例與判斷練習；C01–C16 已由 11 月 10 日頁移至本日，保留原章節錨點。' if lang == 'zh' else 'Day 01 notes supplied on November 12, organized by C number with concepts, cases and reasoning exercises. C01–C16 moved here from November 10 with their original section anchors preserved.'
    return historical, current
