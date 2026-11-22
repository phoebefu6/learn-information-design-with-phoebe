#!/usr/bin/env python3
"""compare-ladder.py - compares the Python canon with the node canon BY VALUE.

  node -e "..." > canon-node.json   (see run line in official-course-map.md)
  python3 materials/ifd-reference.py > canon-python.json
  python3 materials/compare-ladder.py canon-python.json canon-node.json
Exits 0 when every number agrees to 1e-9 relative and every label matches. It first proves it
can fail: a copy of the node canon with one score moved by 0.1% must be rejected.
"""
import copy, json, math, sys


def diff(a, b, path=""):
    bad = []
    if isinstance(a, dict):
        if set(a) != set(b):
            return [path + " keys " + str(sorted(set(a) ^ set(b)))]
        for k in a:
            bad += diff(a[k], b[k], path + "/" + k)
    elif isinstance(a, (int, float)) and isinstance(b, (int, float)):
        if not math.isclose(a, b, rel_tol=1e-9, abs_tol=1e-9):
            bad.append("%s %r != %r" % (path, a, b))
    elif a != b:
        bad.append("%s %r != %r" % (path, a, b))
    return bad


py, nd = (json.load(open(f)) for f in sys.argv[1:3])
planted = copy.deepcopy(nd)
first = next(iter(planted))
planted[first]["contrast"]["score"] *= 1.001
if not diff(py, planted):
    print("COMPARE BROKEN: a planted 0.1% fault was not caught"); sys.exit(2)
bad = diff(py, nd)
n = sum(1 for b in py for r in py[b] for k in py[b][r])
print("planted 0.1% fault caught; values compared:", n)
print("MISMATCHES:", len(bad)); [print(" ", x) for x in bad[:20]]
sys.exit(1 if bad else 0)
