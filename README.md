# EK8818 Session 11 — Supervisor Annotation Form

Minimal annotation form for the EK8818 session 11 working phase (3 segments + context).

## What's here

- `index.html` — the annotation form itself (open in a browser).
- `ek8818_data.js` — transcript turns + MIND evidence spans + segment-level meta. Auto-generated.
- `ek8818_mind.json` — raw extracted MIND annotations for this session.
- `EK8818_11_summaries.md` — clinical summaries (context, topics, self-states, interventions, MLO, alliance) for all 3 segments. Kept as a separate file so the form stays minimal.
- `extract_ek8818.py` / `build_data.py` — scripts that regenerate the data files from `lab_sources/Depressomenter_annotated.csv` and the transcript files in `examples/session_segments/`.

## Design

- **Left panel**: context + transcript with MIND evidence highlighted directly on the text (hover for category + adaptivity). Segment tabs and domain filters at the top. Intervention type, quality, alliance, MLO shown as compact pills at each segment header.
- **Right panel**: one open instruction ("Explain what the therapist did well, using only what you can see"), a ~300-word free-text box, and a 1-5 overall rating.

The long clinical summaries live in `EK8818_11_summaries.md`, not in the form itself. Send that file to annotators separately if they want to read the context summaries.

## Sharing

This folder is committed to the repo. To share the form as a standalone link, push the branch and use the raw GitHub Pages view or htmlpreview.github.io:

```
https://htmlpreview.github.io/?https://github.com/<user>/<repo>/blob/<branch>/experiments/annotation_EK8818/index.html
```

Because `index.html` loads `ek8818_data.js` via a relative `<script src>`, the two files must sit together in whatever directory they are served from. htmlpreview handles this transparently.

## Regenerating the data

```
python3 experiments/annotation_EK8818/extract_ek8818.py
python3 experiments/annotation_EK8818/build_data.py
```

Both scripts must be run from the repo root.
