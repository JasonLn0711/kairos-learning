# tests/test_rules.py
import pytest
from rules import validate

VALID = {
    "application_id": "SYN-001",
    "applicant_code": "DEMO-A",
    "document_type": "合成申請表",
}


def test_valid_record():
    assert validate(VALID) == []


@pytest.mark.parametrize("bad_value", ["", "   ", None, 123, "X" * 81])
def test_invalid_document_type(bad_value):
    record = {**VALID, "document_type": bad_value}
    assert validate(record) != []


@pytest.mark.parametrize("missing_key", list(VALID.keys()))
def test_missing_field(missing_key):
    record = VALID.copy()
    del record[missing_key]
    assert validate(record) != []
