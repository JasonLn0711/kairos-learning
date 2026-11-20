# /// script
# requires-python = ">=3.10"
# dependencies = ["matplotlib==3.10.8"]
# ///
"""Render a formula-derived chart; this does not run clustering or time hardware."""
import csv
import math
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

root = Path(__file__).resolve().parent
points = [(i / 100, 0.4 * (0.1 + 0.9 * (1 + math.cos(math.pi * i / 100)) / 2)) for i in range(101)]
assert math.isclose(points[0][1], 0.4)
assert math.isclose(points[50][1], 0.22)
assert math.isclose(points[-1][1], 0.04)
assert all(a[1] >= b[1] for a, b in zip(points, points[1:]))
with (root / "figures/cosine-values.csv").open("w", newline="") as handle:
    writer = csv.writer(handle, lineterminator="\n")
    writer.writerow(["update_progress", "ema_step"])
    writer.writerows(points)
plt.rcParams["font.family"] = "sans-serif"
plt.rcParams["svg.fonttype"] = "none"
fig, ax = plt.subplots(figsize=(10, 5), layout="constrained")
ax.plot(*zip(*points), color="#229854", linewidth=2.5)
ax.scatter(*zip(*points[::10]), color="#229854", s=20)
ax.set(xlim=(0, 1), ylim=(0, .42), xlabel="Update progress u = t / M", ylabel="EMA step alpha(u)", title="Cosine step schedule (formula-derived; not training loss)")
ax.set_xticks([i / 10 for i in range(11)], [f"{i * 10}%" for i in range(11)])
ax.grid(alpha=.2)
ax.text(.5, .38, r"$\alpha(u)=0.4[0.1+0.9(1+\cos(\pi u))/2]$", ha="center")
for suffix in ("svg", "png"):
    fig.savefig(root / f"figures/cosine-exact.{suffix}", dpi=180, metadata={"Title": "Cosine EMA step schedule", "Description": "Formula-derived plot; not empirical training loss."})
svg = root / "figures/cosine-exact.svg"
svg.write_text("\n".join(line.rstrip() for line in svg.read_text().splitlines()) + "\n")
plt.close(fig)
print("Cosine chart, CSV and endpoint/monotonicity checks complete.")
