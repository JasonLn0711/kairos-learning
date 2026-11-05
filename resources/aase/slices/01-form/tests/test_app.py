from pathlib import Path
import json
from streamlit.testing.v1 import AppTest


def test_preview_is_unvalidated_and_cannot_export():
    at = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py")).run()
    assert not at.exception
    assert [widget.label for widget in at.text_input] == ["申請編號（必填）", "申請人代號（必填）", "文件類型（必填）"]
    at.text_input(key="application_id").input("SYN-001")
    at.button[0].click().run()
    assert not at.exception
    assert "尚未檢核" in at.warning[0].value
    assert json.loads(at.json[0].value) == {"application_id": "SYN-001", "applicant_code": "", "document_type": ""}
    assert not at.success
    assert not at.get("download_button")
    at.text_input(key="application_id").input("SYN-002").run()
    assert not at.json
