# rules.py
FIELDS = {
    "application_id": "申請編號",
    "applicant_code": "申請人代號",
    "document_type": "文件類型",
}


def validate(record):
    errors = []
    if not isinstance(record, dict):
        return ["資料格式必須是字典"]
    for key, label in FIELDS.items():
        if key not in record:
            errors.append(f"缺少{label}")
            continue
        value = record[key]
        if not isinstance(value, str):
            errors.append(f"{label}必須是文字")
            continue
        cleaned = value.strip()
        if not cleaned:
            errors.append(f"{label}不可為空白")
        elif len(cleaned) > 80:
            errors.append(f"{label}不可超過80字元")
    return errors
