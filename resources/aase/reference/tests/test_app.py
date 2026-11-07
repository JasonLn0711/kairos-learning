from pathlib import Path
from streamlit.testing.v1 import AppTest

APP = str(Path(__file__).resolve().parents[1] / "app.py")


def test_missing_then_complete_then_changed_input():
    at = AppTest.from_file(APP).run()
    assert not at.exception
    at.text_input(key="application_id").input("SYN-001")
    at.text_input(key="applicant_code").input("DEMO-A")
    at.button[0].click().run()
    assert "缺少文件類型" in at.error[0].value
    assert not at.success
    assert not at.get("download_button")
    assert at.text_input(key="application_id").value == "SYN-001"
    at.text_input(key="document_type").input("合成申請表").run()
    at.button[0].click().run()
    assert not at.exception
    assert "完整" in at.success[0].value
    assert len(at.get("download_button")) == 1
    at.text_input(key="document_type").input("").run()
    assert not at.success
    assert not at.get("download_button")
    assert "checked" not in at.session_state
