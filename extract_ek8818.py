"""Extract EK8818_11 MIND annotations into a structured JSON for the HTML form."""
import csv
import json
from collections import defaultdict
from pathlib import Path

CSV_PATH = Path("lab_sources/Depressomenter_annotated.csv")
OUT_JSON = Path("experiments/annotation_EK8818/ek8818_mind.json")


def layer_to_domain(layer: str):
    """Map MIND layer to a domain code used in the HTML ('a','b','c','d','t')."""
    if layer.startswith("Evidence_Patient_A"):
        return "a"
    if layer.startswith("Evidence_Patient_B"):
        return "b"
    if layer.startswith("Evidence_Patient_C"):
        return "c"
    if layer.startswith("Evidence_Patient_D"):
        return "d"
    if layer.startswith("Evidence_Therapist_Intervention"):
        return "t"
    return None


def main():
    rows = []
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            if r["document"] != "EK8818_11":
                continue
            rows.append(r)

    # Evidence rows come in pairs: Category + Adaptiveness (same span, begin, end, segment)
    # group them by (layer, segment, begin, end, span_text)
    ev_by_key = defaultdict(dict)
    segment_rows = []
    for r in rows:
        layer = r["layer"]
        task = r["task"]
        value = r["value"]
        span = r["span_text"]
        seg = r["segment"]
        begin = r["begin"]
        end = r["end"]
        is_seg = r["is_segment_annotation"]
        if is_seg == "TRUE":
            segment_rows.append(r)
            continue
        dom = layer_to_domain(layer)
        if dom is None:
            continue
        key = (layer, seg, begin, end, span)
        if task.endswith("Category"):
            ev_by_key[key]["cat"] = value
        elif task.endswith("Adaptiveness"):
            try:
                ev_by_key[key]["ad"] = int(value) if value else None
            except ValueError:
                ev_by_key[key]["ad"] = None
        elif task.endswith("Quality"):
            try:
                ev_by_key[key]["q"] = int(value) if value else None
            except ValueError:
                ev_by_key[key]["q"] = None
        elif task.endswith("Type"):
            ev_by_key[key]["type"] = value
        ev_by_key[key]["_meta"] = {
            "layer": layer,
            "seg": int(seg),
            "begin": int(begin),
            "end": int(end),
            "span": span,
            "dom": dom,
        }

    evidence = []
    for key, data in ev_by_key.items():
        meta = data.get("_meta", {})
        item = {
            "seg": meta.get("seg"),
            "dom": meta.get("dom"),
            "span": meta.get("span"),
            "cat": data.get("cat"),
            "ad": data.get("ad"),
            "q": data.get("q"),
            "type": data.get("type"),
            "layer": meta.get("layer"),
        }
        if item["cat"]:
            evidence.append(item)

    # Segment-level annotations: summaries, ratings, etc.
    segment_meta = defaultdict(lambda: defaultdict(dict))
    for r in segment_rows:
        seg = int(r["segment"])
        layer = r["layer"]
        task = r["task"]
        value = r["value"]
        idx = r["self_state_index"] or ""
        segment_meta[seg][layer][f"{task}|{idx}"] = value

    out = {
        "session": "EK8818_11",
        "evidence": evidence,
        "segment_meta": {
            str(k): {layer: dict(tasks) for layer, tasks in v.items()}
            for k, v in segment_meta.items()
        },
    }
    OUT_JSON.write_text(json.dumps(out, ensure_ascii=False, indent=2))
    print(f"wrote {OUT_JSON}: {len(evidence)} evidence rows, "
          f"{sum(len(v) for v in segment_meta.values())} segment-meta rows")


if __name__ == "__main__":
    main()
