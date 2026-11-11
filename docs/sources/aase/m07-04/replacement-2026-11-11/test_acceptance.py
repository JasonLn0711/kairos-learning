"""Complete the source example's omitted matrix without changing its teaching suite."""
import pytest
from rules import FIELDS, validate
VALID = dict(application_id='SYN-001', applicant_code='DEMO-A', document_type='合成申請表')
@pytest.mark.parametrize('key,label', FIELDS.items())
@pytest.mark.parametrize('value,suffix', [('', '不可為空白'), ('   ', '不可為空白'), (None, '必須是文字'), (123, '必須是文字'), ('X'*81, '不可超過80字元')])
def test_exact_error(key,label,value,suffix):
    assert validate({**VALID,key:value}) == [label+suffix]
@pytest.mark.parametrize('key,label', FIELDS.items())
def test_missing(key,label):
    record=VALID.copy();del record[key]
    assert validate(record)==['缺少'+label]
@pytest.mark.parametrize('key', FIELDS)
@pytest.mark.parametrize('value',['X'*80,'  SYN-001  ','😀'*80,'e\u0301'*40])
def test_valid_and_unmodified(key,value):
    record={**VALID,key:value};before=record.copy()
    assert validate(record)==[]
    assert record==before
@pytest.mark.parametrize('record',[None,[],123,'text'])
def test_non_dict(record):
    assert validate(record)==['資料格式必須是字典']
