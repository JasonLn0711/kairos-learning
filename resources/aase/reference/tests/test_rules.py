import json
import pytest
from rules import validate, export_report

GOOD = {"application_id": "SYN-001", "applicant_code": "DEMO-A", "document_type": "合成申請表"}


def test_complete_export_only_contains_contract_fields():
    result = json.loads(export_report({**GOOD, "debug_secret": "not-exported"}))
    assert result["status"] == "complete"
    assert result["data"] == GOOD
    assert "debug_secret" not in result["data"]


@pytest.mark.parametrize("key", GOOD)
@pytest.mark.parametrize("value", ["", "   ", "\t\n", None, 42, "x" * 81])
def test_bad_input_cannot_be_exported(key, value):
    record = {**GOOD, key: value}
    assert validate(record)
    with pytest.raises(ValueError):
        export_report(record)


def test_missing_key_rejected():
    with pytest.raises(ValueError):
        export_report({"application_id": "SYN-001"})


def test_stale_success_does_not_authorize_new_export():
    assert json.loads(export_report(GOOD))["status"] == "complete"
    with pytest.raises(ValueError):
        export_report({**GOOD, "document_type": ""})


def test_trim_before_export():
    result = json.loads(export_report({**GOOD, "application_id": " SYN-001 "}))
    assert result["data"]["application_id"] == "SYN-001"
