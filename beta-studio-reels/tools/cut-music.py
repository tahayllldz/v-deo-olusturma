#!/usr/bin/env python3
"""Cut per-reel music files from the beds listed in music/cuts.json.

    python3 tools/cut-music.py            # all cuts
    python3 tools/cut-music.py reel-01    # cuts whose name contains "reel-01"

Each cut = bed from `offset` (seconds, keep it on the bed's bar grid), trimmed
to `duration`, 15 ms fade-in, fade-out from `fadeOutStart` to the end.
Output: music/cuts/<name>.mp3 → synced as system/music/cuts/<name>.mp3
"""
import json, os, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
cfg = json.load(open(os.path.join(ROOT, "music", "cuts.json")))
flt = sys.argv[1] if len(sys.argv) > 1 else ""
os.makedirs(os.path.join(ROOT, "music", "cuts"), exist_ok=True)
for c in cfg["cuts"]:
    if flt and flt not in c["name"]:
        continue
    src = os.path.join(ROOT, "music", c["bed"] + ".mp3")
    out = os.path.join(ROOT, "music", "cuts", c["name"] + ".mp3")
    fade = max(0.05, c["duration"] - c["fadeOutStart"])
    af = f"afade=t=in:st=0:d=0.015,afade=t=out:st={c['fadeOutStart']}:d={fade}"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(c.get("offset", 0)), "-t", str(c["duration"]),
                    "-i", src, "-af", af, "-codec:a", "libmp3lame", "-b:a", "192k", out], check=True)
    print(f"cut  music/cuts/{c['name']}.mp3  ({c['bed']} @ {c.get('offset',0)}s, {c['duration']}s, fade {fade:.2f}s)")
