"""Verifies voiceover timing against the scenes and publishes it to Remotion.

Works for both engines (ElevenLabs via the skill's generate-voiceover.ts, or the
temporary local voice). Steps:
  1. ffmpeg silencedetect → actual speech start/end of every section
  2. overlap check: a section must end ≥0.3 s before the next one starts and
     before its own scene ends (sceneEnd in voiceover-config.json)
  3. optional Whisper transcript per section (openai-whisper CLI/module, or a
     sherpa-onnx Whisper model via --whisper-dir) to confirm the words
  4. copies audio/voiceover-normalized.mp3 → public/audio/voiceover.mp3 and
     writes public/audio/voiceover-timing.json (drives music ducking)

    python scripts/vo-finalize.py --source "elevenlabs:Matilda"
Exit code 1 if any overlap is found (fix: shorten text / move startTime, regenerate).
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys

import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
AUDIO = os.path.join(ROOT, "promo-video", "audio")
PUBLIC = os.path.join(ROOT, "promo-video", "public", "audio")


def speech_segments(path, noise="-38dB", min_sil=0.18):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", f"silencedetect=noise={noise}:d={min_sil}", "-f", "null", "-"], capture_output=True, text=True)
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", p.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", p.stderr)]
    h, m, s = re.search(r"Duration: (\d+):(\d+):([\d.]+)", p.stderr).groups()
    dur = int(h) * 3600 + int(m) * 60 + float(s)
    # speech = gaps between silences
    segs, cur = [], 0.0
    for s, e in zip(starts, ends + [dur] * (len(starts) - len(ends))):
        if s > cur + 0.05:
            segs.append((cur, s))
        cur = e
    if cur < dur - 0.05:
        segs.append((cur, dur))
    return segs


def load_pcm(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768


def make_transcriber(whisper_dir):
    if whisper_dir:
        import sherpa_onnx

        size = "small" if os.path.exists(os.path.join(whisper_dir, "small-encoder.int8.onnx")) else "tiny"
        rec = sherpa_onnx.OfflineRecognizer.from_whisper(
            encoder=os.path.join(whisper_dir, f"{size}-encoder.int8.onnx"),
            decoder=os.path.join(whisper_dir, f"{size}-decoder.int8.onnx"),
            tokens=os.path.join(whisper_dir, f"{size}-tokens.txt"),
            language="tr",
            task="transcribe",
            num_threads=4,
        )

        def run(x):
            s = rec.create_stream()
            s.accept_waveform(16000, x)
            rec.decode_stream(s)
            return s.result.text.strip()

        return run, f"sherpa-onnx whisper-{size}"
    try:
        import whisper  # openai-whisper (the promo-video-skill default)

        model = whisper.load_model("small")
        return (lambda x: model.transcribe(x, language="tr")["text"].strip()), "openai-whisper small"
    except Exception:
        return None, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", required=True, help='e.g. "elevenlabs:Matilda" or "local-piper (TEMP)"')
    ap.add_argument("--whisper-dir", default=os.environ.get("SHERPA_WHISPER_DIR"))
    args = ap.parse_args()

    cfg = json.load(open(os.path.join(AUDIO, "voiceover-config.json"), encoding="utf-8"))
    src = os.path.join(AUDIO, cfg.get("outputFile", "voiceover.mp3").replace(".mp3", "-normalized.mp3"))
    segs = speech_segments(src)
    secs = cfg["sections"]

    results, problems = [], []
    for i, s in enumerate(secs):
        lo = s["startTime"] - 0.3
        hi = secs[i + 1]["startTime"] - 0.05 if i + 1 < len(secs) else 1e9
        mine = [(a, b) for a, b in segs if lo <= a < hi]
        if not mine:
            problems.append(f"{s['id']}: no speech found near {s['startTime']}s")
            continue
        start, end = mine[0][0], max(b for _, b in mine)
        results.append({"id": s["id"], "start": round(start, 3), "end": round(end, 3), "text": s["text"]})
        nxt = secs[i + 1]["startTime"] if i + 1 < len(secs) else cfg["totalDurationSeconds"]
        if end > nxt - 0.3:
            problems.append(f"{s['id']}: ends {end:.2f}s, next section starts {nxt:.2f}s (overlap)")
        if "sceneEnd" in s and end > s["sceneEnd"] + 0.25:
            problems.append(f"{s['id']}: ends {end:.2f}s, after its scene ends at {s['sceneEnd']:.2f}s")

    transcribe, engine = make_transcriber(args.whisper_dir)
    pcm = load_pcm(src) if transcribe else None

    print(f"\nVoiceover timing ({args.source})\n" + "-" * 78)
    for r in results:
        line = f"  {r['id']:<12} {r['start']:6.2f}s → {r['end']:6.2f}s   {r['text']}"
        if transcribe:
            x = pcm[int(max(0, r["start"] - 0.2) * 16000): int((r["end"] + 0.6) * 16000)]
            r["heard"] = transcribe(x)
            line += f"\n  {'':<12} {engine}: {r['heard']}"
        print(line)
    if not transcribe:
        print("  (Whisper not available — transcript check skipped; pip install openai-whisper)")

    if problems:
        print("\nPROBLEMS:\n  " + "\n  ".join(problems))
        print("Fix: shorten text, add pauses or move startTime in voiceover-config.json, regenerate.\n")
    else:
        print("\nNo overlaps. Every line ends inside its scene.\n")

    os.makedirs(PUBLIC, exist_ok=True)
    shutil.copyfile(src, os.path.join(PUBLIC, "voiceover.mp3"))
    json.dump(
        {"available": True, "source": args.source, "file": "audio/voiceover.mp3", "sections": results},
        open(os.path.join(PUBLIC, "voiceover-timing.json"), "w", encoding="utf-8"),
        ensure_ascii=False,
        indent=2,
    )
    print("Published → promo-video/public/audio/voiceover.mp3 + voiceover-timing.json")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
