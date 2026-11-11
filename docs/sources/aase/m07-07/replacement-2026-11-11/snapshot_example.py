def valid(form):
    required = ("name", "tax_id", "doc_type")
    return all(str(form.get(k, "")).strip() for k in required)


def check(form):
    if not valid(form):
        return None
    return {"snapshot": form.copy()}


def can_export(form, result):
    return (
        result is not None
        and form == result["snapshot"]
        and valid(form)
    )


def test_changed_input_cannot_export():
    form = {
        "name": "甲公司",
        "tax_id": "12345678",
        "doc_type": "財務報表",
    }
    result = check(form)
    assert can_export(form, result)
    form["doc_type"] = ""
    assert not can_export(form, result)
