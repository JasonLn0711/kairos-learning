"""Local single-user teaching prototype. Run: streamlit run app.py"""
import streamlit as st
from rules import FIELDS, MAX_LENGTH, validate, report, export_report

st.set_page_config(page_title="合成收件資料完整性檢核")
st.title("收件資料完整性檢核")
st.caption("只輸入合成資料。完整僅代表三個教學欄位通過規則，不代表正式受理。")


def invalidate():
    st.session_state.pop("checked", None)


record = {key: st.text_input(label + "（必填）", key=key, max_chars=MAX_LENGTH, on_change=invalidate) for key, label in FIELDS.items()}
if st.button("檢查資料", type="primary"):
    errors = validate(record)
    if errors:
        st.session_state.pop("checked", None)
        st.error("；".join(errors) + "。請補齊或修正後重新檢查。")
    else:
        st.session_state.checked = record.copy()

# A result belongs to one exact input snapshot. Changed input invalidates it.
if st.session_state.get("checked") == record and not validate(record):
    st.success("三個必要欄位完整，可預覽並匯出。")
    st.json(report(record))
    st.download_button("匯出完整報告", export_report(record), file_name="synthetic-report.json", mime="application/json")
else:
    st.info("請填寫必要欄位並檢查；修改內容後需重新檢查。")
