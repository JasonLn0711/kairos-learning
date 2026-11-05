"""Teaching-only completeness rules. No identity, storage, or official approval."""
import json

FIELDS = {"application_id": "申請編號", "applicant_code": "申請人代號", "document_type": "文件類型"}
MAX_LENGTH = 80


def validate(record):
    errors = []
    for key, label in FIELDS.items():
        value = record.get(key)
        if not isinstance(value, str) or not value.strip():
            errors.append(f"缺少{label}")
        elif len(value.strip()) > MAX_LENGTH:
            errors.append(f"{label}不得超過 {MAX_LENGTH} 字元")
    return errors


def report(record):
    errors = validate(record)
    if errors:
        raise ValueError("；".join(errors))
    return {"status": "complete", "scope": "僅代表教學欄位完整性，不代表正式受理", "data": {key: record[key].strip() for key in FIELDS}}


def export_report(record):
    # Revalidate at the export boundary; never trust an old UI success state.
    return json.dumps(report(record), ensure_ascii=False, indent=2)
