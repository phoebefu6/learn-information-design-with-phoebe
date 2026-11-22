/* ifd-live.js - the explainer bench for learn-information-design-with-phoebe
 *
 * Two CONSTRUCTED one-pager briefs (assets/ifd-briefs.js): Wrenmoor Water, "from reservoir to
 * your tap", and Ashbrook Library, "how a reserved book reaches you". Their geometry, text and
 * colours are invented inputs. Everything below is computed from them, in the browser, with the
 * same steps as the Python reference (materials/ifd-reference.py):
 *
 * MEASURED (real geometry and the real WCAG formula, applied to the constructed page)
 *   reading path   centre-to-centre length of the numbered route, entry stop first
 *   shortest route the shortest route through the same stops from the same entry, every order tried
 *   crossings      pairs of non-adjacent route segments that properly intersect
 *   label distance mean distance from each part to the nearest edge of the words that name it
 *   lookups        labels the reader must find in a key instead of beside the part
 *   contrast       WCAG 2.2 contrast ratio of every text-on-fill pair, pass at 4.5:1
 *   overlaps       pairs of boxes that intersect without one containing the other
 * STATED MODELS (printed on the widget, not laws)
 *   entry rule     the eye enters at the largest stop whose centre is in the top quarter
 *   score          four parts of 25: path, labels, contrast, overlaps, weights as written below
 */
(function (root) {
  "use strict";

  var PASS = 4.5;

  /* ---------- colour: WCAG 2.2 relative luminance and contrast ratio ---------- */
  function chan(v, fault) {
    v = v / 255;
    if (fault === "nolinear") return v;                    /* planted fault for the self-test */
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }
  function lum(hex, fault) {
    var h = hex.replace("#", "");
    var r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
    return 0.2126 * chan(r, fault) + 0.7152 * chan(g, fault) + 0.0722 * chan(b, fault);
  }
  function ratio(a, b, fault) {
    var la = lum(a, fault), lb = lum(b, fault);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }

  /* ---------- geometry ---------- */
  function centre(b) { return [b[0] + b[2] / 2, b[1] + b[3] / 2]; }
  function dist(p, q) { var dx = p[0] - q[0], dy = p[1] - q[1]; return Math.sqrt(dx * dx + dy * dy); }
  function ptRect(p, b) {
    var dx = Math.max(b[0] - p[0], 0, p[0] - (b[0] + b[2]));
    var dy = Math.max(b[1] - p[1], 0, p[1] - (b[1] + b[3]));
    return Math.sqrt(dx * dx + dy * dy);
  }
  function orient(a, b, c) {
    var v = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    return v > 1e-9 ? 1 : (v < -1e-9 ? -1 : 0);
  }
  function crosses(p1, p2, q1, q2) {
    var a = orient(p1, p2, q1), b = orient(p1, p2, q2), c = orient(q1, q2, p1), d = orient(q1, q2, p2);
    return a * b < 0 && c * d < 0;
  }
  function inter(a, b) {
    var ox = Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0]);
    var oy = Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1]);
    return (ox > 0 && oy > 0) ? ox * oy : 0;
  }
  function contains(a, b) {
    return a[0] <= b[0] && a[1] <= b[1] && a[0] + a[2] >= b[0] + b[2] && a[1] + a[3] >= b[1] + b[3];
  }
  function routeLen(pts) {
    var s = 0;
    for (var i = 1; i < pts.length; i++) s += dist(pts[i - 1], pts[i]);
    return s;
  }
  /* shortest route from a fixed first stop through all the others: every order is tried */
  function shortest(first, rest) {
    var best = Infinity, n = rest.length, used = [], i;
    for (i = 0; i < n; i++) used.push(false);
    function go(cur, depth, acc) {
      if (acc >= best) return;
      if (depth === n) { best = acc; return; }
      for (var k = 0; k < n; k++) {
        if (used[k]) continue;
        used[k] = true;
        go(rest[k], depth + 1, acc + dist(cur, rest[k]));
        used[k] = false;
      }
    }
    go(first, 0, 0);
    return n ? best : 0;
  }

  /* ---------- the page under a set of levers ---------- */
  /* lv: { direct, renumber, contrast, legend (anti-lever), decor (break) }; pos: {step: [x,y]} */
  function layout(br, lv, pos) {
    lv = lv || {}; pos = pos || {};
    var cw = br.cardSize[0], ch = br.cardSize[1];
    var cards = br.cards.map(function (c) {
      var xy = pos[c.step] || (lv.renumber ? c.snake : c.draft);
      var fill = lv.contrast ? c.fixedFill : c.fill, fg = lv.contrast ? c.fixedFg : c.fg;
      return { step: c.step, title: c.title, body: c.body, box: [xy[0], xy[1], cw, ch], fill: fill, fg: fg };
    });
    var mode = lv.legend ? "tidy" : (lv.direct ? "direct" : "draft");
    var legend = mode === "tidy" ? br.legendTidy : (mode === "draft" ? br.legendDraft : null);
    var stops = [{ id: "title", box: br.titleBox }];
    if (lv.decor) stops.push({ id: "decoration", box: br.ornament.box });
    cards.forEach(function (c) { stops.push({ id: "step " + c.step, box: c.box, step: c.step }); });

    var boxes = [{ id: "title", box: br.titleBox }, { id: "drawing", box: br.panel }];
    cards.forEach(function (c) { boxes.push({ id: "step " + c.step, box: c.box }); });
    if (legend) boxes.push({ id: "key", box: legend.box });
    if (mode === "direct") br.labels.forEach(function (l) { boxes.push({ id: "label " + l.name, box: l.box }); });
    if (lv.decor) boxes.push({ id: "decoration", box: br.ornament.box });

    var texts = [];
    texts.push({ id: "title", fg: br.titleFg, bg: br.titleFill });
    texts.push({ id: "drawing caption", fg: lv.contrast ? br.captionFixedFg : br.captionFg, bg: br.panelFill });
    cards.forEach(function (c) {
      texts.push({ id: "step " + c.step + " number", fg: br.badgeFg, bg: br.badgeFill });
      texts.push({ id: "step " + c.step + " title", fg: c.fg[0], bg: c.fill });
      texts.push({ id: "step " + c.step + " text", fg: c.fg[1], bg: c.fill });
    });
    if (mode === "direct") {
      br.labels.forEach(function (l) { texts.push({ id: "label " + l.name, fg: br.labelFg, bg: br.labelFill }); });
    } else {
      br.labels.forEach(function (l) { texts.push({ id: "key " + l.key + " on drawing", fg: br.keyFg, bg: br.keyFill }); });
      texts.push({ id: "key heading", fg: br.legendHeadFg, bg: br.legendFill });
      br.labels.forEach(function (l) { texts.push({ id: "key row " + l.key, fg: br.legendFg, bg: br.legendFill }); });
    }
    if (lv.decor) texts.push({ id: "decoration", fg: br.ornament.fg, bg: br.ornament.fill });

    var labels = br.labels.map(function (l, i) {
      var target = mode === "direct" ? l.box : legend.rows[i];
      return { key: l.key, name: l.name, t: l.t, at: target, d: ptRect(l.t, target) };
    });
    return { brief: br, lv: lv, mode: mode, cards: cards, legend: legend, stops: stops, boxes: boxes, texts: texts, labels: labels };
  }

  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  function measure(L) {
    var br = L.brief, q = br.page.h / 4;
    /* entry rule (stated model): the largest stop whose centre sits in the top quarter */
    var entry = null, ea = -1;
    L.stops.forEach(function (s) {
      var c = centre(s.box), a = s.box[2] * s.box[3];
      if (c[1] < q && a > ea) { entry = s; ea = a; }
    });
    var others = L.stops.filter(function (s) { return s !== entry && s.step === undefined; });
    var steps = L.stops.filter(function (s) { return s.step !== undefined; }).sort(function (a, b) { return a.step - b.step; });
    var order = [entry].concat(others, steps);
    var pts = order.map(function (s) { return centre(s.box); });
    var len = routeLen(pts);
    var opt = shortest(pts[0], pts.slice(1));
    var segs = [], i, j;
    for (i = 1; i < pts.length; i++) segs.push([pts[i - 1], pts[i], order[i - 1].id, order[i].id]);
    var crossPairs = [];
    for (i = 0; i < segs.length; i++) for (j = i + 2; j < segs.length; j++) {
      if (crosses(segs[i][0], segs[i][1], segs[j][0], segs[j][1]))
        crossPairs.push([segs[i][2] + " to " + segs[i][3], segs[j][2] + " to " + segs[j][3]]);
    }
    var dsum = 0;
    L.labels.forEach(function (l) { dsum += l.d; });
    var meanD = dsum / L.labels.length;
    var lookups = L.mode === "direct" ? 0 : L.labels.length;
    var fails = [], npass = 0;
    L.texts.forEach(function (t) {
      var r = ratio(t.fg, t.bg);
      t.ratio = r;
      if (r >= PASS) npass++; else fails.push({ id: t.id, fg: t.fg, bg: t.bg, ratio: r });
    });
    var ov = [];
    for (i = 0; i < L.boxes.length; i++) for (j = i + 1; j < L.boxes.length; j++) {
      var A = L.boxes[i].box, B = L.boxes[j].box;
      if (inter(A, B) > 0 && !contains(A, B) && !contains(B, A)) ov.push([L.boxes[i].id, L.boxes[j].id]);
    }
    var sPath = clamp(25 * opt / len - 5 * crossPairs.length, 0, 25);
    var sLab = clamp(25 * (1 - Math.min(1, meanD / 300)) - lookups, 0, 25);
    var sCon = 25 * npass / L.texts.length;
    var sOv = Math.max(0, 25 - 6 * ov.length);
    return {
      entry: entry.id, order: order.map(function (s) { return s.id; }), pts: pts,
      pathLen: len, optLen: opt, efficiency: opt / len, crossings: crossPairs.length, crossPairs: crossPairs,
      meanDist: meanD, lookups: lookups, labelMode: L.mode,
      contrastPass: npass, contrastTotal: L.texts.length, fails: fails,
      overlaps: ov.length, overlapPairs: ov,
      parts: { path: sPath, labels: sLab, contrast: sCon, overlaps: sOv },
      score: sPath + sLab + sCon + sOv
    };
  }

  /* ---------- the ladder ---------- */
  var RUNGS = [
    { id: "draft", label: "Draft as delivered", lv: {}, note: "Labels in a key squeezed under the cards, steps numbered as they were pasted in, colours as picked." },
    { id: "direct", label: "Direct labels instead of the key", lv: { direct: true }, note: "Each part named beside itself; the key goes." },
    { id: "renumber", label: "Renumber the path so it does not cross", lv: { direct: true, renumber: true }, note: "Cards moved so 1 to 6 runs left to right, then back." },
    { id: "contrast", label: "Fix the failing contrast pairs", lv: { direct: true, renumber: true, contrast: true }, note: "Every failing text colour swapped for ink or muted ink." },
    { id: "legend", label: "Tidy it into a legend", lv: { direct: true, renumber: true, contrast: true, legend: true }, anti: true, note: "Looks cleaner: the labels move into a neat key under the cards." },
    { id: "decor", label: "Add decoration", lv: { direct: true, renumber: true, contrast: true, decor: true }, brk: true, note: "A mascot block goes in at the top right, bigger than the title." }
  ];

  function rung(br, id) {
    for (var i = 0; i < RUNGS.length; i++) if (RUNGS[i].id === id) return measure(layout(br, RUNGS[i].lv));
    return null;
  }

  function canon(data) {
    var out = {};
    data.briefs.forEach(function (br) {
      out[br.id] = {};
      RUNGS.forEach(function (r) {
        var m = measure(layout(br, r.lv));
        out[br.id][r.id] = {
          entry: m.entry, pathLen: m.pathLen, optLen: m.optLen, crossings: m.crossings,
          meanDist: m.meanDist, lookups: m.lookups, contrastPass: m.contrastPass, contrastTotal: m.contrastTotal,
          overlaps: m.overlaps, path: m.parts.path, labels: m.parts.labels, contrast: m.parts.contrast,
          overlapScore: m.parts.overlaps, score: m.score
        };
      });
    });
    return out;
  }

  /* ---------- self-test: properties that must hold, and must FAIL on a planted fault ---------- */
  function selfTest(data, fault) {
    var res = [];
    function check(name, ok) { res.push({ name: name, ok: !!ok }); }
    check("black on white is 21:1", Math.abs(ratio("#FFFFFF", "#000000", fault) - 21) < 1e-9);
    var g = ratio("#777777", "#FFFFFF", fault);
    check("#777777 on white is 4.48:1, just under AA", g > 4.47 && g < 4.49);
    check("an X of two segments counts as a crossing", crosses([0, 0], [10, 10], [0, 10], [10, 0]) &&
      !crosses([0, 0], [10, 0], [0, 5], [10, 5]));
    check("a point 3 right and 4 below a box corner is 5 away", Math.abs(ptRect([0, 0], [3, 4, 1, 1]) - 5) < 1e-9);
    if (data && data.briefs && data.briefs.length) {
      var br = data.briefs[0], m0 = rung(br, "draft"), m3 = rung(br, "contrast"),
        ma = rung(br, "legend"), md = rung(br, "decor");
      check("the anti-lever scores below the fixed page", ma.score < m3.score && ma.meanDist > m3.meanDist);
      check("the break button scores below the fixed page", md.score < m3.score && md.pathLen > m3.pathLen);
      check("the draft scores below the fixed page", m0.score < m3.score);
    }
    var ok = res.every(function (r) { return r.ok; });
    return { ok: ok, n: res.length, passed: res.filter(function (r) { return r.ok; }).length, results: res };
  }

  /* ================= widget ================= */
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function f1(x) { return x.toFixed(1); }
  function f2(x) { return x.toFixed(2); }

  var DATA, rootEl, els = {}, state = { bi: 0, rung: "draft", pos: {} };

  function svgPage(L, M) {
    var br = L.brief, W = br.page.w, H = br.page.h, s = [];
    s.push('<svg class="ifd-canvas" viewBox="0 0 ' + W + " " + H + '" data-scan-skip role="img" aria-label="' +
      esc("The constructed one-pager " + br.title + ", drawn as the bench sees it: " + M.crossings + " path crossings, " +
        M.overlaps + " overlaps, " + (M.contrastTotal - M.contrastPass) + " failing contrast pairs") + '">');
    s.push('<defs><marker id="ifdAr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">' +
      '<path d="M1 1 L9 5 L1 9" fill="none" stroke="#1A2130" stroke-width="1.6"/></marker></defs>');
    s.push('<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="#FFFFFF" stroke="#D5D8DF"/>');
    /* drawing panel and a plain cutaway: a pipe through the parts */
    var p = br.panel;
    s.push('<rect x="' + p[0] + '" y="' + p[1] + '" width="' + p[2] + '" height="' + p[3] + '" rx="10" fill="' + br.panelFill + '" stroke="#D5D8DF"/>');
    var pipe = br.labels.map(function (l) { return l.t[0] + "," + l.t[1]; }).join(" ");
    s.push('<polyline points="' + pipe + '" fill="none" stroke="#72C3D4" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>');
    var capFg = L.lv.contrast ? br.captionFixedFg : br.captionFg;
    s.push('<text x="' + br.captionAt[0] + '" y="' + br.captionAt[1] + '" class="ifd-t-sm" fill="' + capFg + '">' + esc(br.caption) + "</text>");
    /* labels */
    br.labels.forEach(function (l) {
      s.push('<rect x="' + (l.t[0] - 17) + '" y="' + (l.t[1] - 11) + '" width="34" height="22" rx="5" fill="#FFFFFF" stroke="#586070" stroke-width="1.2"/>');
    });
    L.labels.forEach(function (l, i) {
      s.push('<circle cx="' + l.t[0] + '" cy="' + l.t[1] + '" r="' + (L.mode === "direct" ? 5 : 10) + '" fill="' + br.keyFill + '" stroke="#FFFFFF" stroke-width="2"/>');
      if (L.mode === "direct") {
        var b = l.at, cx = clamp(l.t[0], b[0], b[0] + b[2]), cy = clamp(l.t[1], b[1], b[1] + b[3]);
        s.push('<line x1="' + l.t[0] + '" y1="' + l.t[1] + '" x2="' + cx + '" y2="' + cy + '" stroke="#586070" stroke-width="1.3"/>');
        s.push('<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '" rx="5" fill="' + br.labelFill + '" stroke="#D5D8DF"/>');
        s.push('<text x="' + (b[0] + 8) + '" y="' + (b[1] + 15.5) + '" class="ifd-t" fill="' + br.labelFg + '">' + esc(l.name) + "</text>");
      } else {
        s.push('<text x="' + l.t[0] + '" y="' + (l.t[1] + 4.5) + '" text-anchor="middle" class="ifd-t-b" fill="' + br.keyFg + '">' + l.key + "</text>");
      }
    });
    /* cards */
    L.cards.forEach(function (c) {
      var b = c.box;
      s.push('<g class="ifd-card" data-step="' + c.step + '">');
      s.push('<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '" rx="10" fill="' + c.fill + '" stroke="#586070" stroke-width="1.2"/>');
      s.push('<circle cx="' + (b[0] + 22) + '" cy="' + (b[1] + 24) + '" r="13" fill="' + br.badgeFill + '"/>');
      s.push('<text x="' + (b[0] + 22) + '" y="' + (b[1] + 29) + '" text-anchor="middle" class="ifd-t-b" fill="' + br.badgeFg + '">' + c.step + "</text>");
      s.push('<text x="' + (b[0] + 44) + '" y="' + (b[1] + 29) + '" class="ifd-t-h" fill="' + c.fg[0] + '">' + esc(c.title) + "</text>");
      s.push('<text x="' + (b[0] + 14) + '" y="' + (b[1] + 66) + '" class="ifd-t" fill="' + c.fg[1] + '">' + esc(c.body) + "</text>");
      s.push("</g>");
    });
    /* legend */
    if (L.legend) {
      var g = L.legend.box;
      s.push('<rect x="' + g[0] + '" y="' + g[1] + '" width="' + g[2] + '" height="' + g[3] + '" rx="8" fill="' + br.legendFill + '" stroke="#586070" stroke-width="1"/>');
      s.push('<text x="' + (g[0] + 16) + '" y="' + (g[1] + 20) + '" class="ifd-t-b" fill="' + br.legendHeadFg + '">KEY</text>');
      L.labels.forEach(function (l, i) {
        var r = L.legend.rows[i];
        s.push('<text x="' + (r[0] + 4) + '" y="' + (r[1] + 15.5) + '" class="ifd-t" fill="' + br.legendFg + '">' + l.key + "  " + esc(l.name) + "</text>");
      });
    }
    /* title and decoration */
    var t = br.titleBox;
    s.push('<rect x="' + t[0] + '" y="' + t[1] + '" width="' + t[2] + '" height="' + t[3] + '" rx="10" fill="' + br.titleFill + '"/>');
    s.push('<text x="' + (t[0] + 18) + '" y="' + (t[1] + 39) + '" class="ifd-t-title" fill="' + br.titleFg + '">' + esc(br.title) + "</text>");
    if (L.lv.decor) {
      var o = br.ornament.box;
      s.push('<rect x="' + o[0] + '" y="' + o[1] + '" width="' + o[2] + '" height="' + o[3] + '" rx="60" fill="' + br.ornament.fill + '" stroke="#1A2130" stroke-width="1.5"/>');
      s.push('<text x="' + (o[0] + o[2] / 2) + '" y="' + (o[1] + o[3] / 2 + 5) + '" text-anchor="middle" class="ifd-t-h" fill="' + br.ornament.fg + '">' + esc(br.ornament.text) + "</text>");
    }
    /* the reading path the numbering imposes */
    if (els.showPath.checked) {
      var d = M.pts.map(function (q, i) { return (i ? "L" : "M") + f1(q[0]) + " " + f1(q[1]); }).join(" ");
      s.push('<path d="' + d + '" fill="none" stroke="#AB331C" stroke-width="3" stroke-dasharray="7 6" opacity=".85" marker-end="url(#ifdAr)"/>');
      s.push('<circle cx="' + f1(M.pts[0][0]) + '" cy="' + f1(M.pts[0][1]) + '" r="6" fill="#AB331C" stroke="#FFFFFF" stroke-width="2"/>');
    }
    s.push("</svg>");
    return s.join("");
  }

  function scorecard() {
    var br = DATA.briefs[state.bi];
    var h = '<table class="dt-table ifd-score"><thead><tr><th>Rung</th><th>Path</th><th>Crossings</th><th>Label distance</th><th>Lookups</th><th>Contrast</th><th>Overlaps</th><th>Score</th></tr></thead><tbody>';
    RUNGS.forEach(function (r) {
      var m = measure(layout(br, r.lv));
      h += '<tr class="' + (r.id === state.rung ? "is-on" : "") + '"><th>' + esc(r.label) + (r.anti ? " <em>anti-lever</em>" : "") + (r.brk ? " <em>break</em>" : "") + "</th>" +
        "<td>" + Math.round(m.pathLen) + " px</td><td>" + m.crossings + "</td><td>" + f1(m.meanDist) + " px</td><td>" + m.lookups + "</td>" +
        "<td>" + m.contrastPass + " of " + m.contrastTotal + "</td><td>" + m.overlaps + "</td><td><b>" + f1(m.score) + "</b></td></tr>";
    });
    return h + "</tbody></table>";
  }

  function render() {
    var br = DATA.briefs[state.bi];
    var R = RUNGS.filter(function (r) { return r.id === state.rung; })[0];
    var custom = Object.keys(state.pos).length > 0;
    var L = layout(br, R.lv, state.pos), M = measure(L);
    var F = measure(layout(br, RUNGS[3].lv));
    Object.keys(els.btns).forEach(function (k) {
      els.btns[k].classList.toggle("is-on", k === state.rung);
      els.btns[k].querySelector("input").checked = (k === state.rung);
    });
    var v, cls;
    if (custom) { v = "Your layout: you moved cards. Score " + f1(M.score) + " of 100, " + M.crossings + " crossing" + (M.crossings === 1 ? "" : "s") + ", path " + Math.round(M.pathLen) + " px."; cls = M.score >= F.score - 1e-9 ? "is-good" : "is-ok"; }
    else if (R.anti) { v = "Anti-lever. The key looks tidier, but every part now needs a lookup: " + M.lookups + " lookups, mean label distance " + f1(F.meanDist) + " px to " + f1(M.meanDist) + " px. Score " + f1(F.score) + " to " + f1(M.score) + "."; cls = "is-bad"; }
    else if (R.brk) { v = "Broken on purpose. The decoration is now the biggest thing in the top quarter, so the eye enters there: path " + Math.round(F.pathLen) + " px to " + Math.round(M.pathLen) + " px, " + M.overlaps + " overlaps. Score " + f1(F.score) + " to " + f1(M.score) + "."; cls = "is-bad"; }
    else if (R.id === "draft") { v = "Measured on the draft: " + M.crossings + " crossing" + (M.crossings === 1 ? "" : "s") + ", " + M.lookups + " lookups, " + (M.contrastTotal - M.contrastPass) + " failing contrast pairs, " + M.overlaps + " overlaps. Score " + f1(M.score) + " of 100."; cls = "is-ok"; }
    else { v = R.label + ": score " + f1(M.score) + " of 100."; cls = "is-good"; }
    els.verdict.className = "mb-verdict " + cls;
    els.verdict.textContent = v;

    function metric(label, val, unit, kind) {
      return '<div class="mb-metric"><span class="mb-mkind ' + (kind === "measured" ? "is-measured" : "is-heuristic") + '">' + esc(kind) + '</span>' +
        '<span class="mb-mlabel">' + esc(label) + '</span><span class="mb-mvalue">' + esc(val) + '</span><span class="mb-munit">' + esc(unit) + '</span></div>';
    }
    els.metrics.innerHTML =
      metric("Score, out of 100", f1(M.score), "path " + f1(M.parts.path) + " · labels " + f1(M.parts.labels) + " · contrast " + f1(M.parts.contrast) + " · overlaps " + f1(M.parts.overlaps), "stated model") +
      metric("Reading path", Math.round(M.pathLen) + " px", "shortest through the same stops " + Math.round(M.optLen) + " px; enters at " + M.entry, "measured") +
      metric("Path crossings", String(M.crossings), M.crossings ? M.crossPairs.map(function (c) { return c[0] + " crosses " + c[1]; }).join("; ") : "the numbered route never crosses itself", "measured") +
      metric("Mean label distance", f1(M.meanDist) + " px", M.lookups ? M.lookups + " lookups in the key" : "every part named beside itself", "measured") +
      metric("Contrast pairs at 4.5:1", M.contrastPass + " of " + M.contrastTotal, M.fails.length ? "lowest " + f2(Math.min.apply(null, M.fails.map(function (x) { return x.ratio; }))) + ":1" : "all pass WCAG 2.2 AA", "measured") +
      metric("Overlapping boxes", String(M.overlaps), M.overlaps ? M.overlapPairs.map(function (o) { return o[0] + " / " + o[1]; }).join("; ") : "nothing sits on anything", "measured");

    els.fails.innerHTML = M.fails.length ? "<b>Failing pairs:</b> " + M.fails.map(function (x) {
      return esc(x.id) + " " + x.fg + " on " + x.bg + " = " + f2(x.ratio) + ":1";
    }).join(" · ") : "<b>Failing pairs:</b> none.";
    els.stage.innerHTML = svgPage(L, M);
    els.score.innerHTML = scorecard();
    bindDrag();
  }

  /* drag a card: positions are clamped to the page and recomputed live */
  function bindDrag() {
    var svg = els.stage.querySelector("svg"); if (!svg) return;
    var br = DATA.briefs[state.bi];
    Array.prototype.forEach.call(svg.querySelectorAll(".ifd-card"), function (g) {
      g.addEventListener("pointerdown", function (e) {
        var step = +g.getAttribute("data-step");
        var R = RUNGS.filter(function (r) { return r.id === state.rung; })[0];
        var cur = layout(br, R.lv, state.pos).cards[step - 1].box;
        var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        var m = svg.getScreenCTM(); if (!m) return;
        var s0 = pt.matrixTransform(m.inverse()), ox = s0.x - cur[0], oy = s0.y - cur[1];
        e.preventDefault();
        function move(ev) {
          pt.x = ev.clientX; pt.y = ev.clientY;
          var q = pt.matrixTransform(m.inverse());
          var x = clamp(Math.round(q.x - ox), 0, br.page.w - br.cardSize[0]);
          var y = clamp(Math.round(q.y - oy), 0, br.page.h - br.cardSize[1]);
          state.pos[step] = [x, y];
          render();
        }
        function up() { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); }
        window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
      });
    });
  }

  function buildUI() {
    rootEl.innerHTML = "";
    var top = document.createElement("div"); top.className = "ab-top";
    var lab = document.createElement("label"); lab.className = "ab-pick";
    lab.innerHTML = "<span>Brief</span>";
    var sel = document.createElement("select"); sel.id = "ifd-brief";
    DATA.briefs.forEach(function (b, i) { var o = document.createElement("option"); o.value = i; o.textContent = b.title + " (constructed)"; sel.appendChild(o); });
    sel.addEventListener("change", function () { state.bi = +sel.value; state.pos = {}; render(); });
    lab.appendChild(sel); top.appendChild(lab);
    var reset = document.createElement("button"); reset.type = "button"; reset.className = "btn"; reset.textContent = "Put the cards back";
    reset.addEventListener("click", function () { state.pos = {}; render(); });
    top.appendChild(reset);
    var pl = document.createElement("label"); pl.className = "ifd-toggle";
    pl.innerHTML = '<input type="checkbox" id="ifd-showpath" checked> Show the reading path';
    top.appendChild(pl);
    rootEl.appendChild(top);
    els.showPath = pl.querySelector("input");
    els.showPath.addEventListener("change", render);

    var panel = document.createElement("div"); panel.className = "mb-presets";
    els.btns = {};
    RUNGS.forEach(function (r, i) {
      var l = document.createElement("label");
      l.className = "mb-preset" + (r.anti || r.brk ? " is-anti" : "");
      l.innerHTML = '<input type="radio" name="ifd-rung" value="' + r.id + '">' +
        '<span class="mb-pname">' + (i + 1) + " · " + esc(r.label) + (r.anti ? ' <em class="mb-anti">anti-lever</em>' : "") + (r.brk ? ' <em class="mb-anti">break</em>' : "") + "</span>" +
        '<span class="mb-pnote">' + esc(r.note) + "</span>";
      l.querySelector("input").addEventListener("change", function () { state.rung = r.id; state.pos = {}; render(); });
      panel.appendChild(l); els.btns[r.id] = l;
    });
    rootEl.appendChild(panel);

    els.verdict = document.createElement("p"); rootEl.appendChild(els.verdict);
    var grid = document.createElement("div"); grid.className = "ifd-grid";
    var c1 = document.createElement("div"); c1.className = "ab-card ifd-pagecard";
    c1.innerHTML = "<h4>The one-pager, as the bench measures it <span class=\"mb-mkind is-heuristic\">constructed</span></h4>";
    els.stage = document.createElement("div"); els.stage.className = "ifd-stage"; c1.appendChild(els.stage);
    var hint0 = document.createElement("p"); hint0.className = "mb-hint";
    hint0.textContent = "Drag any numbered card to move it; every number recomputes. The dashed line is the route the numbering imposes, starting at the filled dot.";
    c1.appendChild(hint0);
    var c2 = document.createElement("div"); c2.className = "ifd-side";
    els.metrics = document.createElement("div"); els.metrics.className = "mb-metrics ifd-metrics"; c2.appendChild(els.metrics);
    els.fails = document.createElement("p"); els.fails.className = "mb-hint ifd-fails"; c2.appendChild(els.fails);
    grid.appendChild(c1); grid.appendChild(c2);
    rootEl.appendChild(grid);

    var c3 = document.createElement("div"); c3.className = "ab-card";
    c3.innerHTML = "<h4>The scorecard: every rung on this brief</h4>";
    els.score = document.createElement("div"); els.score.className = "dt-tablewrap"; c3.appendChild(els.score);
    rootEl.appendChild(c3);

    var st = selfTest(DATA);
    var hint = document.createElement("p"); hint.className = "mb-hint";
    hint.textContent = "Both briefs are constructed for teaching. Measured on them: route length and crossings (geometry), label distance and lookups, " +
      "every text-on-fill ratio (the WCAG 2.2 formula, pass at 4.5:1, all text treated as normal size), and box overlaps. " +
      "Stated models, not laws: the eye enters at the largest stop whose centre is in the top quarter; the score is four parts of 25: " +
      "path = 25 x shortest/actual minus 5 per crossing; labels = 25 x (1 - distance/300) minus 1 per lookup; contrast = 25 x share passing; overlaps = 25 minus 6 each. " +
      "Self-test on load: " + st.passed + " of " + st.n + " properties hold" + (st.ok ? "." : ", so do not trust these numbers.");
    rootEl.appendChild(hint);
    els.selftest = st;

    sel.value = String(state.bi);
    render();
  }

  function init() {
    rootEl = document.getElementById("ifd-bench");
    if (!rootEl || !root.IFD_BRIEFS) return;
    DATA = root.IFD_BRIEFS;
    var def = rootEl.getAttribute("data-brief");
    if (def !== null) DATA.briefs.forEach(function (b, i) { if (b.id === def) state.bi = i; });
    buildUI();
    root.IFD_BENCH = {
      setRung: function (id, briefId) {
        if (briefId) DATA.briefs.forEach(function (b, i) { if (b.id === briefId) { state.bi = i; document.getElementById("ifd-brief").value = String(i); } });
        state.rung = id; state.pos = {}; render();
        return measure(layout(DATA.briefs[state.bi], RUNGS.filter(function (r) { return r.id === id; })[0].lv));
      },
      move: function (step, x, y) { state.pos[step] = [x, y]; render(); return measure(layout(DATA.briefs[state.bi], RUNGS.filter(function (r) { return r.id === state.rung; })[0].lv, state.pos)); },
      selfTest: function (fault) { return selfTest(DATA, fault); },
      canon: function () { return canon(DATA); },
      state: state
    };
  }

  var api = { ratio: ratio, lum: lum, crosses: crosses, ptRect: ptRect, shortest: shortest, layout: layout,
              measure: measure, RUNGS: RUNGS, rung: rung, canon: canon, selfTest: selfTest };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }
})(typeof window !== "undefined" ? window : this);
