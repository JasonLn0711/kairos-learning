# report.py
ALLOWED = ("customer", "date", "amount")


def export_report(data):
    for key in ALLOWED:
        value = data.get(key)
        if not isinstance(value, str) or not value.strip():
            raise ValueError(f"{key} 無效")
    return {key: data[key] for key in ALLOWED}
