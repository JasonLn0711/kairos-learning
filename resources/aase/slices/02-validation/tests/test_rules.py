import pytest
from rules import FIELDS, validate

GOOD = {"application_id": "SYN-001", "applicant_code": "DEMO-A", "document_type": "合成申請表"}


def test_valid_trimmed_values():
    assert validate({key: " " + value + " " for key, value in GOOD.items()}) == []


@pytest.mark.parametrize("key", FIELDS)
@pytest.mark.parametrize("value", ["", "   ", "\t\n", None, 42, "x" * 81])
def test_invalid_value_is_rejected_without_ui(key, value):
    record = {**GOOD, key: value}
    assert validate(record)


@pytest.mark.parametrize("key", FIELDS)
def test_missing_key(key):
    record = GOOD.copy()
    del record[key]
    assert "缺少" + FIELDS[key] in validate(record)


def test_length_boundary():
    assert validate({**GOOD, "application_id": "x" * 80}) == []
    assert validate({**GOOD, "application_id": "x" * 81})
