# Source map - learn-information-design-with-phoebe ("Information Design & Infographics")

Internal build document. Never link it from an audience page. Built 2026-11-22.
Single track, six 45-minute sessions, public. Audience: Phoebe's public followers who make
one-page explanations (analysts, product and ops people, comms, teachers).

**Angle.** An infographic is an explanation first: every mark either carries the mechanism or it
goes. The course owns the explaining one-pager: the illustrated explainer of HOW something works.

**Running case (CONSTRUCTED, label it on every page).** Wrenmoor Water, an invented town water
utility, is making a one-page explainer of "what happens between the reservoir and your tap".
The bench adds a second constructed brief: Ashbrook Library, "how a reserved book reaches you".
People: Nia (comms lead who owns the one-pager, constructed), Owen (treatment-plant engineer
who knows the mechanism, constructed). Renamed from the brief's "Fernhill": Fernhill Labs is a
constructed client in learn-notion-with-phoebe. "Wrenmoor", "Ashbrook" had 0 estate hits.

## Evidence tiers

- **read-at-source**: I read the primary text (paper, standard, archive chapter) on 2026-11-22.
- **reported**: known from a secondary source that quotes it, or from an abstract only. Pages say
  "reported" in prose.

## Verified facts

| # | Fact | Tier | Where read |
|---|------|------|------------|
| F1 | Mayer & Moreno (2003) list nine load-reducing methods. "Weeding" (cut interesting but extraneous material) gives the **coherence effect**, median effect size **.90 over 5 experiments** (background music or irrelevant video added to a narrated animation). | read-at-source | Mayer & Moreno 2003, Table 1 and text |
| F2 | **Signaling** (cues for how to select and organise: stressed key words, red and blue arrows, outline and headings, a map of which part is shown) gave an effect size of **.74 in ONE study** (Mautone & Mayer 2001, Exp. 3, airplane lift). | read-at-source | same |
| F3 | **Aligning words and pictures**: text placed near the corresponding part of the graphic gives the **spatial contiguity effect**, effect size **.48 in a single study** (Moreno & Mayer 1999, Exp. 1); "similar effects have been found with text and illustrations in books". Separated text forces visual scanning; Sweller called it the **split-attention effect**. Hegarty and Just (1989) eye movements: learners read a portion of text then look at the matching part of the graphic. | read-at-source (Sweller and Hegarty & Just: reported via Mayer & Moreno) | same |
| F4 | Mayer & Moreno define a separated presentation by example: on-screen text at the bottom of the screen and the graphic at the top. | read-at-source | same |
| F5 | Tufte coined "chartjunk" in *The Visual Display of Quantitative Information* (1983): interior decoration that is "non-data-ink or redundant data-ink" (p.107); "Chartjunk can turn bores into disasters, but it can never rescue a thin data set" (p.121). | reported (quoted in Few 2011) | Few 2011 p.1 |
| F6 | Bateman et al. (CHI 2010, "Useful junk?"): **20 participants**, **14 Nigel Holmes charts** vs plain versions with the same data, titles, axes. Interpretation accuracy for embellished charts was **no worse**; recall after a **two-to-three-week gap was significantly better**; better description of the **value message** for Holmes charts (t19=3.37, p=.003); no difference in completion time (2.60 vs 2.43 min). Participants preferred and found the Holmes charts more attractive. Authors are "cautious about recommending that all charts be produced in this style". | read-at-source | Bateman et al. 2010 PDF |
| F7 | Few (2011, "The Chartjunk Debate", Perceptual Edge) objects: the plain charts were "plain ugly" and ignored basic design; 20 university students; embellished charts typical of only a few news publications; the conclusion overreached. | read-at-source | Few 2011 PDF |
| F8 | Borkin et al. (IEEE TVCG/InfoVis 2013, "What makes a visualization memorable?"): **2,070** single-panel visualizations, memorability scores via Mechanical Turk with **261 participants**, 410 targets (145 minimalist, 103 extreme chart junk, 162 between). Colour and a human-recognizable object enhance memorability; unusual types beat common ones. The authors say the design "does not evaluate the cognitive impact" and that memorability may not translate to understanding, "nor does excessive visual clutter aid comprehension". | read-at-source | Borkin 2013 camera-ready |
| F9 | Borkin et al. (TVCG 22(1), 2016, "Beyond memorability"): **393** labelled visualizations, eye movements of **33** participants; titles and text are key; pictograms used appropriately do not interfere and can help recognition; redundancy helps. | reported (abstract at the authors' page) | vcg.seas.harvard.edu |
| F10 | Isotype: Marie Reidemeister (Marie Neurath from 1941) was the first and most important "transformer" at the Vienna museum, mediating between scientific advisers and graphic artists, a role Neurath called the pivot; it can be seen as a prototype of the modern information designer. Gerd Arntz joined in early 1929 and designed the pictograms. | read-at-source | Burke & Sandner 2023 (De Gruyter, CC BY 4.0, Reading repository) |
| F11 | Marie Neurath & Robin Kinross, *The Transformer: Principles of Making Isotype Charts*, Hyphen Press, London 2009. | read-at-source (cited in Burke & Sandner) | same |
| F12 | WCAG 2.2 SC 1.4.3 (AA): text 4.5:1; large text 3:1 (at least 18 point, or 14 point bold); contrast ratio (L1+0.05)/(L2+0.05); L = 0.2126R+0.7152G+0.0722B with the sRGB linearisation (threshold 0.04045). Text that is pure decoration or part of a logo has no requirement. | read-at-source | w3.org Understanding 1.4.3 |
| F13 | WCAG 2.2 SC 1.4.11 (AA): 3:1 against adjacent colours for "parts of graphics required to understand the content" and UI components. | read-at-source | w3.org Understanding 1.4.11 |
| F14 | NN/g F-pattern, 2006 (Nielsen): eyetracking of **232 users** looking at thousands of pages; horizontal top bar, shorter lower bar, vertical left stem; "a rough, general shape". | read-at-source | nngroup.com 2006 |
| F15 | NN/g 2017 (Pernice): the F-pattern is the default when there are no strong cues: a wall of text with no formatting, a user wanting efficiency, not interested enough to read every word; "bad for users and businesses"; other patterns: layer-cake, spotted, marking, bypassing, commitment. Fix: headings, bold key phrases, grouping, bullets. | read-at-source | nngroup.com 2017 |
| F16 | Point-feature label placement: cartographic standards use a finite set of candidate positions, typically **eight** around the point, with an a priori ranking of desirability; quality = overlap with features and other labels + position preference + points left unlabelled (objective due to Yoeli 1972). Finding the best placement is **NP-hard** (Marks & Shieber 1991); cartographers placed labels at 20 to 30 per hour (Cook & Jones 1990). Imhof's analysis is "descriptive, not prescriptive". | read-at-source (Christensen, Marks & Shieber, MERL TR94-12 / ACM TOG 14(3) 1995) | merl.com |
| F17 | Imhof (1975, "Positioning names on maps", *The American Cartographer* 2(2)): names legible, clearly associated with their feature, not covering other content; for points, where space allows, the name begins to the right of the symbol. | reported | secondary summaries |

Corrections against common claims (grep run 2026-11-22 over `github_repo/learn-*/courses/`):
- "Mayer proved decoration hurts": the coherence effect is about extraneous material in
  explanations measured on transfer tests, median .90 over five experiments; it does not test
  memorability. Siblings quote Mayer (learn-ai-ppt) without conflict.
- "Bateman proved chartjunk helps": one study, 20 people, recall not speed; Few's rebuttal and
  Borkin 2013's own caveat are taught next to it. No sibling cites Bateman or Borkin (0 hits).
- F-pattern: learn-dashboard-design s2 and learn-executive-briefings already teach it as "the
  route eyes take when a page has imposed none". We agree and link out, not reteach.

## Seams (absolute links, we pick our side out loud)

- learn-dataviz owns charts (form, marks, colour theory, honesty):
  https://phoebefu6.github.io/learn-dataviz-with-phoebe/ . We own diagrams of mechanism, the
  whole page, labels and the reading path. Session 4 says "never charts" and links here.
- learn-dashboard-design s2 owns visual weight = size x contrast x position, the squint test, the
  first glance on a SCREEN: https://phoebefu6.github.io/learn-dashboard-design-with-phoebe/courses/02-hierarchy-first-glance.html .
  We own the GUIDED path through an explanation: entry, numbering, arrows, contiguity.
- learn-visual-storytelling owns decks and sequence across slides:
  https://phoebefu6.github.io/learn-visual-storytelling-with-phoebe/
- learn-ai-illustration owns generated images, style DNA and the lettering law:
  https://phoebefu6.github.io/learn-ai-illustration-with-phoebe/
- learn-sketchnoting (live hand notes): https://phoebefu6.github.io/learn-sketchnoting-with-phoebe/ ;
  learn-mind-mapping (radial maps): https://phoebefu6.github.io/learn-mind-mapping-with-phoebe/ ;
  learn-mermaid (diagram-as-code): https://phoebefu6.github.io/learn-mermaid-with-phoebe/

## Per-session coverage

| Session | File | Teaches | Facts |
|---|---|---|---|
| 01 Decoration or explanation | 01-decoration-or-explanation.html | The one-pager's job (explain HOW); chartjunk vs "useful junk" as a live disagreement; Mayer coherence; the "earns its place" test (carries the mechanism, signals, or goes) | F1, F5-F9 |
| 02 The reading path | 02-the-reading-path.html | Entry point, numbered sequence, arrows, contiguity of step and picture; Z/F claims tiered; signaling; link to dashboard-design s2 for weight | F2, F3, F14, F15, F9 (titles) |
| 03 Draw the mechanism | 03-draw-the-mechanism.html | The subject carries the page: cutaway, exploded view, process; the transformer role (Isotype, Reidemeister); what to leave out | F10, F11, F1 |
| 04 Five explaining forms | 04-five-explaining-forms.html | Process, anatomy/cutaway, comparison, map, timeline: which question each answers; picking one; never charts | F3, F1 (picking by question is craft, stated as such) |
| 05 Labels, leader lines and callouts | 05-labels-leader-lines-callouts.html | Spatial contiguity, split attention, legends vs direct labels, label placement (eight positions, overlap, NP-hard), leader-line rules, callouts as signals, contrast 1.4.3 / 1.4.11 | F3, F4, F12, F13, F16, F17 |
| 06 The explainer bench | 06-the-explainer-bench.html | Measured: path length, crossings, label distance, lookups, contrast, overlaps; stated score; anti-lever and break | all canon below |

## Bench canon (assets/ifd-live.js, node and Python agree, 168 values, 1e-9)

Run: `python3 materials/build-ifd-briefs.py`, then
`python3 materials/ifd-reference.py > /tmp/py.json`,
`node -e "const E=require('./assets/ifd-live.js');console.log(JSON.stringify(E.canon(require('./materials/ifd-briefs.json'))))" > /tmp/node.json`,
`python3 materials/compare-ladder.py /tmp/py.json /tmp/node.json` (proves it rejects a planted 0.1% fault first).

Score model (STATED, printed on the widget): four parts of 25. Path = 25 x shortest/actual minus 5
per crossing. Labels = 25 x (1 - mean distance/300) minus 1 per lookup. Contrast = 25 x share of
text-on-fill pairs at 4.5:1. Overlaps = 25 minus 6 per overlapping pair. Entry rule: the largest
stop whose centre is in the top quarter. Each part clamped to 0..25.

Wrenmoor Water (default brief):

| Rung | Path px | Shortest px | Crossings | Label dist px | Lookups | Contrast | Overlaps | Score |
|---|---|---|---|---|---|---|---|---|
| 1 Draft as delivered | 1514 | 1182 | 1 | 443.8 | 8 | 32 of 37 | 3 | 43.1 |
| 2 Direct labels | 1514 | 1182 | 1 | 21.3 | 0 | 23 of 28 | 0 | 83.3 |
| 3 Renumber the path | 1323 | 1201 | 0 | 21.3 | 0 | 23 of 28 | 0 | 91.5 |
| 4 Fix contrast | 1323 | 1201 | 0 | 21.3 | 0 | 28 of 28 | 0 | 95.9 |
| 5 Tidy into a legend (anti-lever) | 1323 | 1201 | 0 | 475.8 | 8 | 37 of 37 | 0 | 72.7 |
| 6 Add decoration (break) | 1506 | 1384 | 0 | 21.3 | 0 | 29 of 29 | 2 | 84.2 |

Draft details: crossing = step 1 to step 2 crosses step 3 to step 4. Overlaps = the squeezed key
with step 2, step 4, step 5. Failing pairs: drawing caption #D5D8DF on #FCEFEA 1.27:1; steps 2
and 5 white on cyan #72C3D4 2.01:1 (title and text each). Break: decoration enters first
(decoration > title > step 1...), overlaps title and drawing.

Ashbrook Library (second brief):

| Rung | Path px | Crossings | Label dist px | Lookups | Contrast | Overlaps | Score |
|---|---|---|---|---|---|---|---|
| 1 Draft | 1906 | 5 | 452.8 | 8 | 33 of 37 | 3 | 29.3 |
| 2 Direct labels | 1906 | 5 | 18.8 | 0 | 24 of 28 | 0 | 69.9 |
| 3 Renumber | 1323 | 0 | 18.8 | 0 | 24 of 28 | 0 | 92.6 |
| 4 Fix contrast | 1323 | 0 | 18.8 | 0 | 28 of 28 | 0 | 96.1 |
| 5 Legend (anti) | 1323 | 0 | 484.8 | 8 | 37 of 37 | 0 | 72.7 |
| 6 Decoration (break) | 1512 | 0 | 18.8 | 0 | 29 of 29 | 3 | 78.4 |

Ashbrook's failing pairs are near misses: #AB331C on #F3CDC2 = 4.45:1 and #586070 on #F3CDC2
= 4.31:1 (steps 2 and 4). Teaching point: "looks readable" is not a ratio.

Self-test on load: 7 of 7 properties hold; with the planted fault (no sRGB linearisation) the
#777777-on-white property fails (selfTest(data, "nolinear").ok === false), checked in node.

## Not covered (honest list)

- Charts of any kind (learn-dataviz). Dashboards (learn-dashboard-design). Decks (learn-visual-storytelling).
- Generated imagery and its lettering (learn-ai-illustration). Live sketchnotes, mind maps, Mermaid syntax.
- Eye-tracking of the learner's own page: the bench measures geometry and stated models, not eyes.
- Typography in depth (type families, kerning), print production, colour-blind simulation.
- Isotype's counting rules in detail; Tufte's full data-ink ratio maths (reported only).
- Animation and scrollytelling.

## Citation appendix (form pages must use)

- Mayer, R. E., & Moreno, R. (2003). Nine ways to reduce cognitive load in multimedia learning. *Educational Psychologist*, 38(1), 43-52.
- Tufte, E. R. (1983). *The Visual Display of Quantitative Information*. Graphics Press. (reported, via Few 2011)
- Bateman, S., Mandryk, R. L., Gutwin, C., Genest, A., McDine, D., & Brooks, C. (2010). Useful junk? The effects of visual embellishment on comprehension and memorability of charts. CHI 2010, 2573-2582.
- Few, S. (2011). The Chartjunk Debate. Perceptual Edge.
- Borkin, M. A., et al. (2013). What makes a visualization memorable? IEEE TVCG 19(12) (InfoVis 2013).
- Borkin, M. A., Bylinskii, Z., et al. (2016). Beyond memorability: visualization recognition and recall. IEEE TVCG 22(1). (abstract, reported)
- Burke, C., & Sandner, G. (2023). Marie Reidemeister und Otto Neurath: eine Lebens- und Arbeitspartnerschaft. In *Gestalterinnen*, De Gruyter, 213-223. CC BY 4.0.
- Neurath, M., & Kinross, R. (2009). *The Transformer: Principles of Making Isotype Charts*. Hyphen Press.
- W3C (2023). WCAG 2.2, Understanding SC 1.4.3 Contrast (Minimum) and SC 1.4.11 Non-text Contrast.
- Nielsen, J. (2006). F-shaped pattern for reading web content. Nielsen Norman Group.
- Pernice, K. (2017). F-shaped pattern of reading on the web: misunderstood, but still relevant (even on mobile). Nielsen Norman Group.
- Christensen, J., Marks, J., & Shieber, S. (1995). An empirical study of algorithms for point-feature label placement. ACM TOG 14(3). (read as MERL TR94-12)
- Imhof, E. (1975). Positioning names on maps. *The American Cartographer* 2(2), 128-144. (reported)
