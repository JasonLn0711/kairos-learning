# test_report.py
import pytest
from report import export_report


def test_missing_amount():
    data = {"customer": "A", "date": "2026-11-11", "amount": ""}
    with pytest.raises(ValueError):
        export_report(data)


def test_extra_field():
    data = {
        "customer": "A", "date": "2026-11-11", "amount": "100",
        "debug_note": "PRIVATE",
    }
    result = export_report(data)
    assert set(result) == {"customer", "date", "amount"}
    assert "debug_note" not in result


def test_valid_report():
    data = {"customer": "A", "date": "2026-11-11", "amount": "100"}
    assert export_report(data) == data
