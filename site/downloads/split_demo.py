#!/usr/bin/env python3
"""Offline synthetic group-overlap demonstration; no files or network."""
rows = [(device, sample) for device in "ABC" for sample in (1, 2)]
naive_train = {d for d, _ in rows[::2]}
naive_test = {d for d, _ in rows[1::2]}
train, validation, test = {"A"}, {"B"}, {"C"}
print("naive_overlap=" + repr(sorted(naive_train & naive_test)))
print("grouped_overlap=" + repr(sorted((train & validation) | (train & test) | (validation & test))))
