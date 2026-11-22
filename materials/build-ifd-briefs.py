#!/usr/bin/env python3
"""build-ifd-briefs.py - writes the two CONSTRUCTED one-pager briefs for the explainer bench.

Both briefs are invented for teaching (Wrenmoor Water, Ashbrook Library). Nothing here is a
measurement of a real document. The geometry, text and colours are the INPUT; every number the
bench prints is computed from them by assets/ifd-live.js (browser and node) and, independently,
by materials/ifd-reference.py.

Writes, with json.dumps (never string interpolation):
  assets/ifd-briefs.js        window.IFD_BRIEFS = {...}
  materials/ifd-briefs.json   the same object, for the Python reference
Run:  python3 materials/build-ifd-briefs.py
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)

# course palette (assets/style.css :root)
PRIMARY, DEEP, SOFT, T50 = "#AB331C", "#7A2414", "#F3CDC2", "#FCEFEA"
INK, MUTED, FAINT, HAIR = "#1A2130", "#586070", "#D5D8DF", "#ECE7E3"
CYAN, WHITE = "#72C3D4", "#FFFFFF"

PAGE = {"w": 600, "h": 800}
CARD_W, CARD_H = 170, 104
# six card slots: two rows of three under the drawing panel
SLOTS = [(30, 424), (215, 424), (400, 424), (30, 548), (215, 548), (400, 548)]
# hand-placed jitter so the "as delivered" draft is not on a perfect grid
JIT = [(0, 0), (6, -4), (-4, 6), (4, 6), (-6, -6), (2, 2)]
SNAKE = [0, 1, 2, 5, 4, 3]   # renumbered: step k sits in slot SNAKE[k-1]


def card_xy(slot, jitter):
    x, y = SLOTS[slot]
    if jitter:
        dx, dy = JIT[slot]
        x, y = x + dx, y + dy
    return [x, y]


def label_w(text):
    return 7 * len(text) + 16


def build(bid, title, caption, steps, draft_slots, parts, draft_colours, fixed_colours, ornament):
    """steps: [(title, body)] in process order 1..6.
    draft_slots[k] = slot of step k+1 as delivered.
    parts: [(key, name, tx, ty, lx, ly)] target point and the direct-label box origin.
    draft_colours / fixed_colours: per step (fill, title_fg, body_fg); caption fg is last item."""
    cards = []
    for k, (t, b) in enumerate(steps):
        fill, tf, bf = draft_colours[k]
        ffill, ftf, fbf = fixed_colours[k]
        cards.append({
            "step": k + 1, "title": t, "body": b,
            "draft": card_xy(draft_slots[k], True),
            "snake": card_xy(SNAKE[k], False),
            "fill": fill, "fg": [tf, bf], "fixedFill": ffill, "fixedFg": [ftf, fbf],
        })
    labels = []
    for key, name, tx, ty, lx, ly in parts:
        labels.append({"key": key, "name": name, "t": [tx, ty],
                       "box": [lx, ly, label_w(name), 22]})
    # legend rows: two columns of four; "draft" sits where it was squeezed in, "tidy" below the cards
    def legend(y0):
        rows = []
        for i, p in enumerate(parts):
            col, row = divmod(i, 4)
            rows.append([46 + col * 270, y0 + 30 + row * 26, 250, 22])
        return {"box": [30, y0, 540, 140 if y0 < 660 else 124], "rows": rows}
    return {
        "id": bid, "title": title, "caption": caption,
        "page": PAGE, "cardSize": [CARD_W, CARD_H],
        "titleBox": [30, 24, 540, 64], "titleFill": PRIMARY, "titleFg": WHITE,
        "panel": [30, 104, 540, 300], "panelFill": T50,
        "captionAt": [46, 392], "captionFg": draft_colours[6], "captionFixedFg": fixed_colours[6],
        "cards": cards, "labels": labels,
        "labelFill": WHITE, "labelFg": INK, "keyFill": PRIMARY, "keyFg": WHITE,
        "legendFill": HAIR, "legendFg": INK, "legendHeadFg": MUTED,
        "legendDraft": legend(640), "legendTidy": legend(672),
        "badgeFill": PRIMARY, "badgeFg": WHITE,
        "ornament": ornament,
    }


wrenmoor = build(
    "wrenmoor", "Wrenmoor Water: from reservoir to your tap",
    "Cutaway, not to scale",
    [("Store", "Holds the raw water"), ("Screen", "Catch leaves and grit"),
     ("Clump", "Dirt clumps into floc"), ("Filter", "Sand traps the rest"),
     ("Disinfect", "A dose of chlorine"), ("Deliver", "Pipes carry it to you")],
    [0, 4, 1, 3, 5, 2],
    [("A", "Reservoir", 78, 196, 46, 150),
     ("B", "Intake screen", 150, 270, 96, 226),
     ("C", "Mixing tank", 222, 318, 176, 334),
     ("D", "Settling tank", 298, 300, 244, 254),
     ("E", "Sand filter", 372, 318, 334, 334),
     ("F", "Chlorine dose", 438, 240, 380, 196),
     ("G", "Storage tank", 500, 300, 452, 254),
     ("H", "Your tap", 540, 180, 488, 136)],
    [(WHITE, INK, MUTED), (CYAN, WHITE, WHITE), (WHITE, INK, MUTED),
     (WHITE, INK, MUTED), (CYAN, WHITE, WHITE), (WHITE, INK, MUTED), FAINT],
    [(WHITE, INK, MUTED), (CYAN, INK, INK), (WHITE, INK, MUTED),
     (WHITE, INK, MUTED), (CYAN, INK, INK), (WHITE, INK, MUTED), MUTED],
    {"box": [372, 6, 214, 180], "fill": CYAN, "fg": INK, "text": "Meet Drip!"},
)

ashbrook = build(
    "ashbrook", "Ashbrook Library: how a reserved book reaches you",
    "Route map, not to scale",
    [("Reserve", "You tap Reserve online"), ("Find", "Pulled from a shelf"),
     ("Pack", "Crated for the van"), ("Drive", "Van runs the loop"),
     ("Sort", "Sorted at your branch"), ("Collect", "On the hold shelf")],
    [2, 3, 1, 5, 0, 4],
    [("A", "Central stacks", 90, 170, 50, 126),
     ("B", "Returns desk", 120, 300, 66, 316),
     ("C", "Crate bay", 205, 230, 168, 186),
     ("D", "Van route", 290, 330, 256, 346),
     ("E", "Bridge St stop", 340, 230, 280, 186),
     ("F", "Branch sort room", 430, 300, 370, 316),
     ("G", "Hold shelf", 470, 210, 436, 166),
     ("H", "Self-checkout", 530, 280, 460, 244)],
    [(WHITE, INK, MUTED), (SOFT, PRIMARY, MUTED), (WHITE, INK, MUTED),
     (SOFT, PRIMARY, MUTED), (WHITE, INK, MUTED), (WHITE, INK, MUTED), MUTED],
    [(WHITE, INK, MUTED), (SOFT, DEEP, INK), (WHITE, INK, MUTED),
     (SOFT, DEEP, INK), (WHITE, INK, MUTED), (WHITE, INK, MUTED), MUTED],
    {"box": [380, 8, 206, 188], "fill": SOFT, "fg": INK, "text": "Book worm says hi"},
)

DATA = {"note": "CONSTRUCTED teaching briefs; geometry and colours are inputs, not measurements.",
        "briefs": [wrenmoor, ashbrook]}

with open(os.path.join(REPO, "assets", "ifd-briefs.js"), "w") as f:
    f.write("/* ifd-briefs.js - generated by materials/build-ifd-briefs.py with json.dumps. "
            "Two CONSTRUCTED one-pager briefs for the explainer bench. Do not edit by hand. */\n")
    f.write("window.IFD_BRIEFS = " + json.dumps(DATA, separators=(",", ":")) + ";\n")
with open(os.path.join(HERE, "ifd-briefs.json"), "w") as f:
    json.dump(DATA, f, indent=1)
print("wrote ifd-briefs.js and ifd-briefs.json")
