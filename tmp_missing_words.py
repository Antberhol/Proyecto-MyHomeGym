import re
from collections import Counter
from pathlib import Path

hook = Path(r"src/hooks/useExerciseDetail.ts").read_text(encoding="utf-8")
seed = Path(r"src/constants/exerciseDbExpandedExercises.ts").read_text(encoding="utf-8")

keys = set()
for block_name in ("englishToSpanishWordMap", "englishResidualWordMap"):
    m = re.search(rf"const {block_name}: Record<string, string> = \{{(.*?)\n\}}", hook, re.S)
    if not m:
        continue

    block = m.group(1)
    for k in re.findall(r"^\s*(?:'([^']+)'|([a-zA-Z][a-zA-Z0-9_-]*))\s*:", block, re.M):
        key = k[0] or k[1]
        keys.add(key.lower())

raw_values = re.findall(r'"instrucciones"\s*:\s*"((?:\\.|[^"\\])*)"', seed)
counter = Counter()
for raw in raw_values:
    decoded = bytes(raw, 'utf-8').decode('unicode_escape').lower()
    for word in re.findall(r"[a-z][a-z'-]{1,}", decoded):
        counter[word] += 1

unknown = [(w,c) for w,c in counter.items() if w not in keys]
unknown.sort(key=lambda x: x[1], reverse=True)
for w,c in unknown[:220]:
    print(f"{w}\t{c}")
