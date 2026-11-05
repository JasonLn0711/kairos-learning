"""Checkpoint 2: validate inputs without report or export."""
import streamlit as st
from rules import FIELDS, MAX_LENGTH, validate

st.title("合成收件資料｜切片二")
st.caption("只輸入合成資料。三欄教學規則不代表正式受理。")
record = {key: st.text_input(label + "（必填）", key=key, max_chars=MAX_LENGTH) for key, label in FIELDS.items()}
st.info("修改輸入後，請重新按檢查。本階段尚未提供報告預覽與匯出。")
if st.button("檢查資料", type="primary"):
    errors = validate(record)
    if errors:
        st.error("；".join(errors) + "。請補齊或修正後重新檢查。")
    else:
        st.success("本次三欄檢核通過；尚未提供報告預覽與匯出。")
