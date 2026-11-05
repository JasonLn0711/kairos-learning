from pathlib import Path
from streamlit.testing.v1 import AppTest


def test_error_correction_and_result_lifetime():
    at = AppTest.from_file(str(Path(__file__).resolve().parents[1] / "app.py")).run()
    at.text_input(key="application_id").input("SYN-001")
    at.text_input(key="applicant_code").input("DEMO-A")
    at.button[0].click().run()
    assert not at.exception
    assert "缺少文件類型" in at.error[0].value
    assert at.text_input(key="application_id").value == "SYN-001"
    assert not at.success
    at.text_input(key="document_type").input("合成申請表").run()
    at.button[0].click().run()
    assert "本次三欄檢核通過" in at.success[0].value
    assert not at.get("download_button")
    assert not at.json
    at.text_input(key="document_type").input("").run()
    assert not at.success
    at.button[0].click().run()
    assert "缺少文件類型" in at.error[0].value
    assert not at.get("download_button")
    assert not at.exception
