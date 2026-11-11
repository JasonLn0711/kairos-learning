"""Standalone lesson example; synthetic input and unvalidated preview only."""
import streamlit as st

st.title("收件資料預覽")
st.caption("請使用合成測試資料。本階段未實作必填驗證，也不持久保存資料。")
if "preview" not in st.session_state:
    st.session_state.preview = None

def clear_preview():
    st.session_state.preview = None

st.text_input("申請編號（預計必填）", key="application_id", on_change=clear_preview)
st.text_input("申請人代號（預計必填）", key="applicant_code", on_change=clear_preview)
st.text_input("文件類型（預計必填）", key="document_type", on_change=clear_preview)
if st.button("查看本次輸入（未檢核）"):
    st.session_state.preview = {
        "application_id": st.session_state.application_id,
        "applicant_code": st.session_state.applicant_code,
        "document_type": st.session_state.document_type,
    }
if st.session_state.preview is not None:
    st.info("以下資料尚未經過完整性檢核")
    st.json(st.session_state.preview)
