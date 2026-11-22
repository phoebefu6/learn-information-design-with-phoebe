#!/usr/bin/env python3
"""ifd-reference.py - independent Python run of the explainer bench (assets/ifd-live.js).

Reads materials/ifd-briefs.json (written by build-ifd-briefs.py, the same object the browser
loads) and runs every rung of the ladder on both CONSTRUCTED briefs with the same definitions:
route length and crossings, shortest route by trying every order, point-to-box label distance,
lookups, WCAG 2.2 contrast ratios, box overlaps, and the stated four-part score.
Prints the canon as JSON:  python3 materials/ifd-reference.py > canon-python.json
"""
import itertools, json, math, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PASS = 4.5


def chan(v):
    v = v / 255
    return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4


def lum(h):
    h = h.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b)


def ratio(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def centre(b):
    return (b[0] + b[2] / 2, b[1] + b[3] / 2)


def dist(p, q):
    return math.hypot(p[0] - q[0], p[1] - q[1])


def pt_rect(p, b):
    dx = max(b[0] - p[0], 0, p[0] - (b[0] + b[2]))
    dy = max(b[1] - p[1], 0, p[1] - (b[1] + b[3]))
    return math.sqrt(dx * dx + dy * dy)


def orient(a, b, c):
    v = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    return 1 if v > 1e-9 else (-1 if v < -1e-9 else 0)


def crosses(p1, p2, q1, q2):
    return orient(p1, p2, q1) * orient(p1, p2, q2) < 0 and orient(q1, q2, p1) * orient(q1, q2, p2) < 0


def inter(a, b):
    ox = min(a[0] + a[2], b[0] + b[2]) - max(a[0], b[0])
    oy = min(a[1] + a[3], b[1] + b[3]) - max(a[1], b[1])
    return ox * oy if ox > 0 and oy > 0 else 0


def contains(a, b):
    return a[0] <= b[0] and a[1] <= b[1] and a[0] + a[2] >= b[0] + b[2] and a[1] + a[3] >= b[1] + b[3]


def route_len(pts):
    return sum(dist(pts[i - 1], pts[i]) for i in range(1, len(pts)))


def shortest(first, rest):
    if not rest:
        return 0.0
    return min(route_len([first] + list(p)) for p in itertools.permutations(rest))


RUNGS = [("draft", {}), ("direct", {"direct": 1}), ("renumber", {"direct": 1, "renumber": 1}),
         ("contrast", {"direct": 1, "renumber": 1, "contrast": 1}),
         ("legend", {"direct": 1, "renumber": 1, "contrast": 1, "legend": 1}),
         ("decor", {"direct": 1, "renumber": 1, "contrast": 1, "decor": 1})]


def run(br, lv):
    cw, ch = br["cardSize"]
    cards = []
    for c in br["cards"]:
        xy = c["snake"] if lv.get("renumber") else c["draft"]
        fill = c["fixedFill"] if lv.get("contrast") else c["fill"]
        fg = c["fixedFg"] if lv.get("contrast") else c["fg"]
        cards.append({"step": c["step"], "box": [xy[0], xy[1], cw, ch], "fill": fill, "fg": fg})
    mode = "tidy" if lv.get("legend") else ("direct" if lv.get("direct") else "draft")
    legend = br["legendTidy"] if mode == "tidy" else (br["legendDraft"] if mode == "draft" else None)
    stops = [("title", br["titleBox"], None)]
    if lv.get("decor"):
        stops.append(("decoration", br["ornament"]["box"], None))
    stops += [("step %d" % c["step"], c["box"], c["step"]) for c in cards]
    boxes = [("title", br["titleBox"]), ("drawing", br["panel"])]
    boxes += [("step %d" % c["step"], c["box"]) for c in cards]
    if legend:
        boxes.append(("key", legend["box"]))
    if mode == "direct":
        boxes += [("label " + l["name"], l["box"]) for l in br["labels"]]
    if lv.get("decor"):
        boxes.append(("decoration", br["ornament"]["box"]))
    texts = [(br["titleFg"], br["titleFill"]),
             (br["captionFixedFg"] if lv.get("contrast") else br["captionFg"], br["panelFill"])]
    for c in cards:
        texts += [(br["badgeFg"], br["badgeFill"]), (c["fg"][0], c["fill"]), (c["fg"][1], c["fill"])]
    if mode == "direct":
        texts += [(br["labelFg"], br["labelFill"]) for _ in br["labels"]]
    else:
        texts += [(br["keyFg"], br["keyFill"]) for _ in br["labels"]]
        texts.append((br["legendHeadFg"], br["legendFill"]))
        texts += [(br["legendFg"], br["legendFill"]) for _ in br["labels"]]
    if lv.get("decor"):
        texts.append((br["ornament"]["fg"], br["ornament"]["fill"]))
    dists = [pt_rect(l["t"], l["box"] if mode == "direct" else legend["rows"][i]) for i, l in enumerate(br["labels"])]

    q = br["page"]["h"] / 4
    entry, ea = None, -1
    for s in stops:
        c = centre(s[1]); a = s[1][2] * s[1][3]
        if c[1] < q and a > ea:
            entry, ea = s, a
    others = [s for s in stops if s is not entry and s[2] is None]
    steps = sorted([s for s in stops if s[2] is not None], key=lambda s: s[2])
    order = [entry] + others + steps
    pts = [centre(s[1]) for s in order]
    length = route_len(pts)
    opt = shortest(pts[0], pts[1:])
    segs = [(pts[i - 1], pts[i]) for i in range(1, len(pts))]
    cross = sum(1 for i in range(len(segs)) for j in range(i + 2, len(segs)) if crosses(*segs[i], *segs[j]))
    mean_d = sum(dists) / len(dists)
    lookups = 0 if mode == "direct" else len(br["labels"])
    npass = sum(1 for fg, bg in texts if ratio(fg, bg) >= PASS)
    ov = sum(1 for i in range(len(boxes)) for j in range(i + 1, len(boxes))
             if inter(boxes[i][1], boxes[j][1]) > 0 and not contains(boxes[i][1], boxes[j][1]) and not contains(boxes[j][1], boxes[i][1]))
    s_path = min(25, max(0, 25 * opt / length - 5 * cross))
    s_lab = min(25, max(0, 25 * (1 - min(1, mean_d / 300)) - lookups))
    s_con = 25 * npass / len(texts)
    s_ov = max(0, 25 - 6 * ov)
    return {"entry": entry[0], "pathLen": length, "optLen": opt, "crossings": cross, "meanDist": mean_d,
            "lookups": lookups, "contrastPass": npass, "contrastTotal": len(texts), "overlaps": ov,
            "path": s_path, "labels": s_lab, "contrast": s_con, "overlapScore": s_ov,
            "score": s_path + s_lab + s_con + s_ov}


def main():
    data = json.load(open(os.path.join(HERE, "ifd-briefs.json")))
    out = {br["id"]: {rid: run(br, lv) for rid, lv in RUNGS} for br in data["briefs"]}
    json.dump(out, sys.stdout, indent=1)
    print()


if __name__ == "__main__":
    main()
