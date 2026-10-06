"""TEMPORARY local voiceover (offline Piper TTS via sherpa-onnx).

Used only because ElevenLabs was unreachable while this project was built.
It reads the SAME config as the ElevenLabs pipeline
(promo-video/audio/voiceover-config.json), synthesizes each section, places it
at its startTime (same adelay/amix approach as promo-video-skill's
generate-voiceover.ts) and loudness-normalizes the result.

    pip install sherpa-onnx numpy
    # download a Turkish Piper voice (CC0 dataset), e.g.
    #   https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-tr_TR-fahrettin-medium.tar.bz2
    python scripts/vo-local.py --voice-dir path/to/vits-piper-tr_TR-fahrettin-medium

Outputs (promo-video/audio/): section-*.wav, voiceover.mp3, voiceover-normalized.mp3
Then run:  python scripts/vo-finalize.py --source "local-piper (TEMP)"
"""
import argparse
import glob
import json
import os
import subprocess
import wave

import numpy as np
import sherpa_onnx

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
AUDIO = os.path.join(ROOT, "promo-video", "audio")


def synth(tts, text, speed):
    a = tts.generate(text, sid=0, speed=speed)
    return np.array(a.samples, dtype=np.float32), a.sample_rate


def trim_silence(x, sr, thresh=0.01, pad=0.04):
    idx = np.where(np.abs(x) > thresh)[0]
    if len(idx) == 0:
        return x
    a = max(0, idx[0] - int(pad * sr))
    b = min(len(x), idx[-1] + int(pad * sr))
    return x[a:b]


def write_wav(path, x, sr):
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice-dir", required=True)
    ap.add_argument("--config", default=os.path.join(AUDIO, "voiceover-config.json"))
    ap.add_argument("--speed", type=float, default=0.97)
    args = ap.parse_args()

    cfg = json.load(open(args.config, encoding="utf-8"))
    onnx = glob.glob(os.path.join(args.voice_dir, "*.onnx"))[0]
    tts = sherpa_onnx.OfflineTts(
        sherpa_onnx.OfflineTtsConfig(
            model=sherpa_onnx.OfflineTtsModelConfig(
                vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                    model=onnx,
                    tokens=os.path.join(args.voice_dir, "tokens.txt"),
                    data_dir=os.path.join(args.voice_dir, "espeak-ng-data"),
                    noise_scale=0.6,
                    noise_scale_w=0.75,
                ),
                num_threads=4,
                provider="cpu",
            )
        )
    )

    files = []
    for s in cfg["sections"]:
        x, sr = synth(tts, s.get("ttsText", s["text"]).replace("...", ""), args.speed)
        x = trim_silence(x, sr)
        path = os.path.join(AUDIO, f"section-{s['id']}.wav")
        write_wav(path, x, sr)
        dur = len(x) / sr
        files.append((path, s["startTime"]))
        print(f"  {s['id']:<12} {s['startTime']:5.2f}s → {s['startTime'] + dur:5.2f}s  ({dur:.2f}s)  {s['text']}")

    # Mix exactly like the skill: adelay each section, amix, cut to total length.
    out = os.path.join(AUDIO, cfg.get("outputFile", "voiceover.mp3"))
    inputs = sum([["-i", p] for p, _ in files], [])
    delays = "; ".join(f"[{i}:a]aresample=48000,adelay={int(t * 1000)}|{int(t * 1000)}[a{i}]" for i, (_, t) in enumerate(files))
    mix = "".join(f"[a{i}]" for i in range(len(files)))
    # light voice polish: rumble cut, gentle warmth, soft de-harsh
    polish = "highpass=f=75,equalizer=f=180:t=q:w=1:g=2,equalizer=f=6500:t=q:w=2:g=-2,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120"
    fc = f"{delays}; {mix}amix=inputs={len(files)}:duration=longest:normalize=0,{polish}"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fc, "-t", str(cfg["totalDurationSeconds"]), "-ac", "2", "-b:a", "192k", out], check=True)
    norm = out.replace(".mp3", "-normalized.mp3")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", out, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-b:a", "192k", norm], check=True)
    print("Wrote", out, "and", norm)


if __name__ == "__main__":
    main()
