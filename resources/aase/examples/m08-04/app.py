import json
import streamlit as st

FIELDS = {
    "application_id": "案件編號",
    "applicant_code": "申請人代碼",
    "document_type": "文件類型",
}


def invalidate():
    st.session_state.pop("checked", None)
    st.session_state.pop("report", None)


st.title("收件資料檢核")
for key, label in FIELDS.items():
    st.text_input(label, key=key, on_change=invalidate)

if st.button("檢查", key="check"):
    missing = [
        label for key, label in FIELDS.items()
        if not st.session_state[key].strip()
    ]
    if missing:
        invalidate()
        st.error("缺少：" + "、".join(missing))
    else:
        data = {
            key: st.session_state[key].strip()
            for key in FIELDS
        }
        st.session_state["report"] = json.dumps(
            {"status": "complete", "data": data},
            ensure_ascii=False,
            indent=2,
        )
        st.session_state["checked"] = True

if st.session_state.get("checked"):
    st.success("檢查成功")
    st.download_button(
        "下載報告",
        data=st.session_state["report"],
        file_name="report.json",
        mime="application/json",
        key="download",
    )
