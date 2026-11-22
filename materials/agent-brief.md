# Agent brief - shared by every fan-out page of learn-information-design-with-phoebe

You are writing ONE static HTML session page. No servers, no npm. **If your target file already
exists on disk, do not write it; report that and stop.** Write the file, return its path and one
line of coverage. No HTML in your reply.

## Read first, in this order

1. The template page. Copy its structure, classes, SVG grammar and quiz markup EXACTLY, including
   four options (A to D) per question:
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-information-design-with-phoebe/courses/01-decoration-or-explanation.html`
2. The source map: every verified number, its evidence tier, per-session coverage, the seams. Use
   ONLY its numbers; never invent a statistic; if a fact is missing, teach the uncertainty.
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-information-design-with-phoebe/materials/official-course-map.md`
3. The stylesheet `:root` block for the palette tokens (first 30 lines only):
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-information-design-with-phoebe/assets/style.css`
4. For rhythm only, skim the bench page (do not copy its widget):
   `/Users/phoebe.fu/Documents/claude_work/github_repo/learn-information-design-with-phoebe/courses/06-the-explainer-bench.html`

## Page skeleton (keep every component)

toolbar (crumb EXACTLY `<a href="../index.html">learn-information-design-with-phoebe</a> / Session N of 6`,
#toggle-all, #zoom-toggle) · masthead (eyebrow "Learn Information Design with Phoebe · Session N of 6",
h1 with one `<span class="accent">`, .sub, .chip-row with the level chip (🟡 Core for sessions 2-3,
🟠 Deeper for sessions 4-5) plus two .chip.audience and .chip.time "45 min", .agenda a1-a4) ·
main.wrap · section#intro (Part 0 "Where we start": kicker, .lede that says Wrenmoor is constructed,
.legend pills as in the template, .callout.win "★ What you walk out with tonight.") · 3 Parts, each
`section.section#part-N` with section-kicker (klabel "Part N · covers ...", h2, `.tag.concept "N min live"`),
a `.lede`, ONE figure, `details.card` accordions (summary: `.mode.live` or `.mode.self`, title,
`.mini`, `.caret ▶`), at least one `.callout.example` with `span.ex-pill` "Real world" on the page ·
section#demo-1 Build-along (kicker klabel "Build-along", h2, `.tag.demo "★ 22 min · everyone builds"`,
.lede, ONE figure, `.steps > .step`, each with a `<p>` then a `.prompt-box.good` carrying a
`span.label` "★ Step N · ..."; the build-along works on Wrenmoor's one-pager on paper) ·
section#exercise Homework (klabel "Homework", h2 "Before session N+1", `.tag.exercise "30 min"`, ol, 4 items) ·
section#quiz (3 x `.quiz-q data-answer="0-based"`, `p.qtext`, four `button.qopt` "A · ..." to "D · ...",
`p.qwhy`; one `p.quiz-score` after the last; vary the correct letter) · section#official, h2 EXACTLY
"What this session teaches, and where it came from", `.covered > .covered-row` (pill solid ✓ / light ◐ +
name + note), then the `.mono` line EXACTLY "Every fact on this page, and its verification tier, is
recorded in the course's source map." · section.cheat#cheatsheet (h3 "Session N cheat sheet <span>· pin this</span>",
.grid-2 of six .cheat-item) · `.callout.next` with `.nx-pill` "Next session" · footer.pagefoot ·
`<script src="../assets/app.js?v=1"></script>`.

Head: the template's social meta block with this page's own title/description/url;
`<title>Session N · <Title> - learn information design with phoebe</title>`;
`<link rel="stylesheet" href="../assets/style.css?v=1">`. Nothing else external.

First `details.card` in the FIRST Part is `open`; no other. Sentence case headings. Warm
practitioner voice, concrete, never dry. Inside prompt-boxes escape `&` `<` `>`. 450 to 650 lines
is guidance about depth, never a target: never collapse whitespace, dissolve a list into a
paragraph, or drop a component to fit.

## Hard rules (a violation is rework)

- NEVER an em dash or en dash, anywhere (prose, code, aria-labels, comments). Hyphen only.
- No meta text: never "this course", "in this course", "the course teaches", "banned here". State
  the professional norm directly with its reason. The two exact estate phrases above are the only
  self-references; "session 5" cross-references are fine.
- Attribution "by Phoebe Fu". Never "built with" a tool.
- Every number comes from the map or is labelled constructed. Bench numbers (session 6) may be quoted
  only exactly as the map's canon tables give them.
- Contested or missing evidence: teach the disagreement; never resolve what the literature has not.
  The F-pattern is CONDITIONAL (NN/g 2017: default when a page gives no strong cues); a "Z-pattern"
  has no source in the map: if you mention it, call it a designer's rule of thumb with no study behind
  it here, never a finding.
- Citations in the exact form of the map's appendix; anything marked reported is "reported" in prose.
- NEVER "lottery" or "lotteries".
- Default to the English word; no Chinese terms are needed.
- NO cross marks anywhere (✗ ✘ ✕ ❌ ×), not in figures, not in text; label states in words
  ("cut", "fails", "wrong way"). Do not use a tick/cross pair in a figure.
- Titles, widget ids and class names must not collide with siblings. Session titles below are
  checked; do not invent new page titles. SVG class/id prefixes: use ONLY your scheme below.
- Seams: do not teach chart forms, colour theory, chart honesty (learn-dataviz), visual weight =
  size x contrast x position or the squint test (learn-dashboard-design s2), deck sequencing
  (learn-visual-storytelling). Link out with the absolute URLs below and say which side we take.
- The running case is CONSTRUCTED: Wrenmoor Water (town water utility), Nia (comms lead), Owen
  (treatment-works engineer). Say "constructed" in Part 0. Never use real companies as the case;
  real-world callouts may describe common practice (safety cards, appliance manuals, transit maps)
  without invented statistics.
- Wrenmoor's process, six steps, use these names everywhere: 1 Store (reservoir holds the raw water),
  2 Screen (intake screens catch leaves and grit), 3 Clump (coagulant makes dirt clump into floc,
  which settles in a settling tank), 4 Filter (sand filters trap the rest), 5 Disinfect (a dose of
  chlorine), 6 Deliver (storage tank, then mains to your tap). Parts named on the cutaway: Reservoir,
  Intake screen, Mixing tank, Settling tank, Sand filter, Chlorine dose, Storage tank, Your tap.
  This is a simplified teaching version; say "simplified" if you describe treatment in detail.

## Figure grammar (hand-drawn, every figure)

Palette, ONLY these hexes (no invented greys): primary #AB331C · deep #7A2414 · mid #922B18 ·
soft #F3CDC2 · tint #FCEFEA · ink #1A2130 · muted #586070 · faint #D5D8DF · hairline #ECE7E3 ·
cyan #72C3D4 (fill or thick stroke only; text on it is ink, never white) · cyan-ink #12505F (text,
strokes) · cyan tint #E3F3F7 · paper #FFFCFA · `#FFFFFF` · universal reds `#991B1B` `#FEF2F2` `#FCA5A5`
only for a wrong-way panel.

- `<figure class="zoomable">` > `<svg viewBox="0 0 880 H" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="the data, not the
  shape">` > `<defs>` + `<style>` + content, then `<figcaption>🔍 Click to zoom - takeaway</figcaption>`.
  Grow H, never W.
- Prefix unique per figure, used for every class and id: session N, figure letter a/b/c/d:
  session 2 `r2a` `r2b` ...; session 3 `m3a` ...; session 4 `f4a` ...; session 5 `l5a` .... (So
  classes `.r2aH`, ids `r2aSk`, `r2aHc`, `r2aAr`.)
- `<defs>` holds the prefix's wobble filter `id="PSk"` (`feTurbulence type="fractalNoise"
  baseFrequency="0.02" numOctaves="2" seed="<int>"` + `feDisplacementMap scale="2.4"
  xChannelSelector="R" yChannelSelector="G"`, `x="-3%" y="-3%" width="106%" height="106%"`), a
  hachure pattern `id="PHc"` (7x7 userSpaceOnUse, rotate(-38), one #AB331C line, opacity .5), an
  open arrowhead `id="PAr"` (path `M1 1 L9 5 L1 9`, fill none, #1A2130 stroke 1.6). ALL shapes sit
  inside ONE `<g filter="url(#PSk)" fill="none" stroke="#1A2130" stroke-width="2" stroke-linecap="round"
  stroke-linejoin="round">`; rects carry a tiny rotation (-4 to 4 degrees for hand-placed items, under
  1 for panels). Fills: white, tint #FCEFEA, the hachure for "the pile" or "the data", and the cyan
  tint #E3F3F7 with #12505F stroke ONLY for the one thing the figure is about. Text classes: `.PH` 800
  12px ink heading · `.PL` 600 12px ink label · `.PS` 400 11px muted · `.PB` 800 11px #12505F ·
  `.PV` 800 16-20px #7A2414 value · `.PW` 800 12px white on a #AB331C fill · `.PA` 700 11px #AB331C
  axis caption · `.PN` 400 12px muted note. Number badges: a `<circle>` with fill #AB331C OUTSIDE the
  filtered group and a `.PW` number centred on it.
- ALL `<text>` outside any filtered group, Inter/sans stack, never below 10.5px.
- Fit: max chars ≈ (box width - 20) / 7 at 12px, 6.4px/char at 11px; full-width note under 110
  chars; 40px between neighbouring point labels; bottom note 22px below the last row, H clears it
  by 8px. When in doubt, shorten.
- No line, arrow or curve may pass through any label (the gate flags line-through-text); route
  leader lines to the label's edge. No text may spill out of the rect it sits in. Painted rects must
  not overlap each other by more than a sliver unless one fully contains the other; a deliberately
  overlapping outline uses `fill="none"`.
- Floor: one figure per Part plus one in the build-along (4 figures). Draw the MECHANISM (the eye's
  route across a page, a cutaway with its parts, a label's trip to a key, the question that picks a
  form), never a metaphor literally, never decoration.

## Voice and honesty

Every Part gets a real-world story (common practice, no invented numbers). Constructed cases say
"constructed" on the page: Wrenmoor Water, Nia, Owen, Ashbrook Library. Facts only from the map,
tiered. The bench (session 6) is the only place numbers about the page are measured; earlier pages
may forward-reference it ("session 6 measures this") but quote a bench number only exactly as the
map's canon table gives it.

## Cross-links (absolute URLs)

- learn-dataviz (charts): https://phoebefu6.github.io/learn-dataviz-with-phoebe/
- learn-dashboard-design s2 (visual weight, squint test, first glance on a screen):
  https://phoebefu6.github.io/learn-dashboard-design-with-phoebe/courses/02-hierarchy-first-glance.html
- learn-visual-storytelling (decks): https://phoebefu6.github.io/learn-visual-storytelling-with-phoebe/
- learn-ai-illustration (generated images, lettering): https://phoebefu6.github.io/learn-ai-illustration-with-phoebe/
- learn-sketchnoting: https://phoebefu6.github.io/learn-sketchnoting-with-phoebe/ · learn-mind-mapping:
  https://phoebefu6.github.io/learn-mind-mapping-with-phoebe/ · learn-mermaid: https://phoebefu6.github.io/learn-mermaid-with-phoebe/
- Hub: https://phoebefu6.github.io/learn-with-phoebe/

## Footer chain and session titles

Footer left: "Session N of 6 · learn-information-design-with-phoebe · by Phoebe Fu &nbsp;·&nbsp; 📚 <a href="https://phoebefu6.github.io/learn-with-phoebe/">Learn with Phoebe ↗</a>"
Footer right: `<a href="0(N-1)-....html">← Prev: <title></a> &nbsp;·&nbsp; <a href="0(N+1)-....html">Next: <title> →</a>`

Session titles and files (exact, sentence case, one accent span in h1):
1 Decoration or explanation · 01-decoration-or-explanation.html
2 The reading path · 02-the-reading-path.html
3 Draw the mechanism · 03-draw-the-mechanism.html
4 Five explaining forms · 04-five-explaining-forms.html
5 Labels, leader lines and callouts · 05-labels-leader-lines-callouts.html
6 The explainer bench · 06-the-explainer-bench.html
