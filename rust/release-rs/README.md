# Rust HTML metadata for release validation

The release validator uses Python by default. Shadow mode compares Rust and
Python on every HTML page and uses Python's metadata for the release checks.
A difference fails the check and identifies the page and fields. Rust mode
uses the native parser for supported inputs and calls the Python parser for
inputs that trigger compatibility checks.

From the repository root, use Rust 1.97 or newer and `rust-anything` 3.2:

```sh
rust-anything build rust/release-rs
PYTHONPATH="$PWD/scripts" rust-anything gate rust/release-rs
python3 scripts/validate_release.py --parser shadow --json
python3 scripts/validate_release.py --parser rust --json
```

The compact cases cover parser edge cases. Run shadow mode against each fresh
build before relying on Rust mode for release checks. When the Python parser
changes, refresh its recorded cases:

```sh
PYTHONPATH="$PWD/scripts" rust-anything record rust/release-rs --inputs rust/release-rs/inputs.jsonl --count 30
```
