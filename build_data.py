"""Parse EK8818_11 transcript segments into {s: 'P'|'T', t: '...'} turns and write JS file.

Uses the clean, timestamp-stripped, speaker-normalized segments from project_2's
``data_for_example/EK8818_11/`` (C = client, T = therapist), plus the factual
context_before/context_after summaries. No interpretive summaries are inlined.
"""
import json
import re
from pathlib import Path

PROJ2_ROOT = Path("/Users/lihicohen/Documents/project_2/data_for_example/EK8818_11")
SEG_FILES = {
    1: PROJ2_ROOT / "seg_1.txt",
    2: PROJ2_ROOT / "seg_2.txt",
    3: PROJ2_ROOT / "seg_3.txt",
}
CONTEXT_BEFORE = PROJ2_ROOT / "context_before.txt"
CONTEXT_AFTER = PROJ2_ROOT / "context_after.txt"
MIND_JSON = Path("experiments/annotation_EK8818/ek8818_mind.json")
OUT = Path("experiments/annotation_EK8818/ek8818_data.js")


def parse_turn(line: str):
    # Clean format: [HH:MM:SS] C: "..."  or  [HH:MM:SS] T: "..."
    m = re.match(r'^\[[^\]]+\]\s*([CT]):\s*"(.+)"\s*$', line.strip(), flags=re.S)
    if not m:
        return None
    speaker = "P" if m.group(1) == "C" else "T"
    return {"s": speaker, "t": m.group(2)}


def read_context(path: Path) -> str:
    """Strip the header lines and return just the prose body."""
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    body = []
    in_body = False
    for line in lines:
        if line.startswith("="):
            in_body = True
            continue
        if in_body:
            body.append(line)
    return "\n".join(body).strip()


def clean_span(span: str) -> str:
    """Remove MIND annotation artifacts like {filler}, {the hum}, etc."""
    span = re.sub(r"\{[^}]*\}", "", span)
    span = re.sub(r"\s+", " ", span).strip()
    return span


def main():
    segs = {}
    for n, path in SEG_FILES.items():
        text = path.read_text(encoding="utf-8")
        # Each non-empty line is a turn.
        turns = []
        for line in text.splitlines():
            line = line.strip()
            if not line:
                continue
            t = parse_turn(line)
            if t:
                turns.append(t)
        segs[n] = turns
        print(f"seg {n}: {len(turns)} turns")

    mind = json.loads(MIND_JSON.read_text())
    evidence = []
    for e in mind["evidence"]:
        span_clean = clean_span(e["span"])
        if not span_clean:
            continue
        # Truncate very long spans: keep the first ~12 words so it matches a phrase.
        words = span_clean.split()
        if len(words) > 20:
            span_clean = " ".join(words[:15])
        evidence.append({
            "seg": e["seg"],
            "d": e["dom"],
            "span": span_clean,
            "cat": e["cat"] or "",
            "ad": e["ad"],
        })

    # Segment-level metadata (compact): MLO, alliance, intervention type/quality
    seg_meta = {}
    for seg_str, layers in mind["segment_meta"].items():
        s = int(seg_str)
        sm = {}
        dyad = layers.get("Segment_Dyad_rating", {})
        sm["alliance"] = dyad.get("Segment_Dyad_rating.Alliance/Reciprocity|", "-")
        th = layers.get("Segment_Therapist_rating", {})
        sm["int_type"] = th.get("Segment_Therapist_rating.Intervention_type|", "-")
        sm["quality"] = th.get("Segment_Therapist_rating.Quality|", "-")
        sm["typicality"] = th.get("Segment_Therapist_rating.Typicality|", "-")
        pov = layers.get("Segment_Patient_Overall_Evaluation", {})
        sm["exp"] = pov.get("Segment_Patient_Overall_Evaluation.Experiencing_and_regulation|", "-")
        sm["ins"] = pov.get("Segment_Patient_Overall_Evaluation.Insight/reflection/mindfulness/understanding|", "-")
        sm["mlo"] = pov.get("Segment_Patient_Overall_Evaluation.Micro-level_outcome|", "-")
        seg_meta[s] = sm

    js = "// Auto-generated from ek8818_mind.json + clean segments in project_2. Do not hand-edit.\n"
    js += "const SEGS=" + json.dumps(segs, ensure_ascii=False) + ";\n"
    js += "const EV=" + json.dumps(evidence, ensure_ascii=False) + ";\n"
    js += "const SEG_META=" + json.dumps({str(k): v for k, v in seg_meta.items()}, ensure_ascii=False) + ";\n"
    js += "const CONTEXT_BEFORE=" + json.dumps(read_context(CONTEXT_BEFORE)) + ";\n"
    js += "const CONTEXT_AFTER=" + json.dumps(read_context(CONTEXT_AFTER)) + ";\n"
    OUT.write_text(js, encoding="utf-8")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
