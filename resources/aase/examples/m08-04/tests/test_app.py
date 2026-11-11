import json
from pathlib import Path
from streamlit.testing.v1 import AppTest

APP = Path(__file__).resolve().parents[1] / "app.py"


def test_three_stages():
    at = AppTest.from_file(str(APP)).run()
    assert not at.exception

    # 1. 缺漏：只填兩個欄位
    at.text_input(key="application_id").input("SYN-001")
    at.text_input(key="applicant_code").input("DEMO-A")
    at.button(key="check").click().run()
    assert not at.exception
    assert at.error
    assert "文件類型" in at.error[0].value
    assert at.text_input(key="application_id").value == "SYN-001"
    assert not at.success
    assert not at.get("download_button")

    # 2. 補正：填完第三個欄位，再按檢查
    at.text_input(key="document_type").input("合成申請表").run()
    at.button(key="check").click().run()
    assert not at.exception
    assert not at.error
    assert at.success
    assert len(at.get("download_button")) == 1
    assert at.session_state["checked"] is True
    assert json.loads(at.session_state["report"]) == {
        "status": "complete",
        "data": {
            "application_id": "SYN-001",
            "applicant_code": "DEMO-A",
            "document_type": "合成申請表",
        },
    }

    # 3. 變更：重新清空第三個欄位
    at.text_input(key="document_type").input("").run()
    assert not at.exception
    assert not at.success
    assert not at.get("download_button")
    assert "checked" not in at.session_state
    assert "report" not in at.session_state
