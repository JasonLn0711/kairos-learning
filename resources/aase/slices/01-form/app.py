"""Checkpoint 1: input and unvalidated preview only."""
import streamlit as st

st.title("合成收件資料｜切片一")
st.caption("只輸入合成資料。本階段尚未實作完整性規則。")
fields = {"application_id": "申請編號", "applicant_code": "申請人代號", "document_type": "文件類型"}
record = {key: st.text_input(label + "（必填）", key=key, max_chars=80) for key, label in fields.items()}
st.info("必填是需求標示；本階段尚未檢核，不會產生完整報告。")
if st.button("查看本次輸入（未檢核）", type="primary"):
    st.warning("以下僅為本次輸入，尚未檢核。")
    st.json(record)
