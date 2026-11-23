import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareSearch, search, type SearchEntry } from '../src/lib/model.ts';

test('prepared search preserves locale, Unicode matching, and catalog order', () => {
  const entry = (id: string, lang: SearchEntry['lang'], title: string): SearchEntry =>
    ({ id, lang, title, summary: '資料 leakage', text: 'SMB', href: '/' + id, label: 'M04' });
  const entries = [entry('a', 'zh', '一'), entry('b', 'en', 'Two'), entry('c', 'zh', '三')];
  const prepared = prepareSearch(entries);

  assert.deepEqual(prepared('資料　ＳＭＢ', 'zh'), [entries[0], entries[2]]);
  assert.deepEqual(prepared('leakage m04', 'en'), [entries[1]]);
  assert.deepEqual(prepared(' ', 'zh'), []);
  for (const input of ['資料', 'missing', 'SMB leakage', 'SMB '.repeat(12) + 'ignored']) {
    assert.deepEqual(prepared(input, 'zh'), search(entries, input, 'zh'));
  }
});
