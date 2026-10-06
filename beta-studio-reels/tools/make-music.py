#!/usr/bin/env python3
"""
Beta Studio — original music beds (royalty-free, generated, deterministic).

    python3 tools/make-music.py            # writes music/bed-*.mp3 (+ beat grids)

Why generated: no HeyGen music credential in this environment, and the local
MusicGen fallback ships CC-BY-NC weights (not safe for a commercial brand
account). These beds are synthesized from scratch with numpy/scipy, seeded,
so every run produces the same file. Each bed writes a JSON beat grid
(bpm, beat, bar) so compositions can cut on the beat.

Beds
  warm  100 BPM  F major   — education / before-after (Reel 01, 04, templates A–C)
  pulse 108 BPM  A minor→C — data / psychology (Reel 02, template D)
  night  92 BPM  D minor   — AI / hot takes / night scenes (Reel 03, 05, template E)
"""
import json
import os
import subprocess
import sys

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "music")
LENGTH = 36.0


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12.0)


def tt(dur):
    return np.arange(int(dur * SR)) / SR


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


class Track:
    def __init__(self, n):
        self.buf = np.zeros(n)

    def add(self, sig, at, gain=1.0):
        i = int(at * SR)
        if i >= len(self.buf):
            return
        j = min(len(self.buf), i + len(sig))
        self.buf[i:j] += sig[: j - i] * gain


# ------------------------------------------------------------- instruments
def ep(freq, dur, vel=0.8):
    """FM electric piano: warm body + short tine."""
    t = tt(dur + 1.4)
    idx = 1.6 * np.exp(-t * 7) + 0.22
    body = np.sin(2 * np.pi * freq * t + idx * np.sin(2 * np.pi * freq * t))
    tine = 0.2 * np.sin(2 * np.pi * freq * 4.0 * t) * np.exp(-t * 16)
    env = np.minimum(1, t / 0.006) * np.exp(-t * 1.5)
    rel = np.where(t > dur, np.exp(-(t - dur) * 7), 1.0)
    trem = 1 + 0.06 * np.sin(2 * np.pi * 4.8 * t)
    return (body + tine) * env * rel * trem * vel


def pad(freq, dur, bright=7, vel=0.5, seed=1):
    t = tt(dur + 1.6)
    rng = np.random.default_rng(seed)
    s = np.zeros_like(t)
    for cents in (-9, 0, 8):
        f = freq * 2 ** (cents / 1200)
        ph = rng.uniform(0, 2 * np.pi)
        for k in range(1, bright + 1):
            s += np.sin(2 * np.pi * f * k * t + ph * k) / k * (0.82 ** k)
    att = np.minimum(1, t / 0.45)
    rel = np.where(t > dur, np.exp(-(t - dur) * 3.2), 1.0)
    return lp(s, 2600) * att * rel * vel / 3


def bass(freq, dur, vel=0.9):
    t = tt(dur + 0.25)
    # fundamental kept modest; 2nd/3rd harmonics make the line audible on phone speakers
    s = 0.75 * np.sin(2 * np.pi * freq * t) + 0.5 * np.sin(2 * np.pi * freq * 2 * t) + 0.22 * np.sin(2 * np.pi * freq * 3 * t)
    env = np.minimum(1, t / 0.008) * np.where(t > dur, np.exp(-(t - dur) * 30), np.exp(-t * 0.6))
    return lp(np.tanh(1.5 * s * env), 1100) * vel * 0.62


def kick(vel=1.0):
    t = tt(0.5)
    f = 54 + 110 * np.exp(-t * 26)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 12)
    click = hp(np.random.default_rng(3).normal(0, 1, len(t)), 1800) * np.exp(-t * 380) * 0.32
    return np.tanh(1.4 * (body + click)) * vel


def clap(vel=0.6, seed=4):
    t = tt(0.45)
    n = np.random.default_rng(seed).normal(0, 1, len(t))
    env = np.zeros_like(t)
    for k, off in enumerate((0.0, 0.011, 0.022)):
        env += np.where(t >= off, np.exp(-(t - off) * (90 if k < 2 else 16)), 0)
    return bp(n, 900, 4200) * env * vel * 0.55


def rim(vel=0.5):
    t = tt(0.12)
    s = np.sin(2 * np.pi * 1650 * t) * np.exp(-t * 70) + 0.4 * np.sin(2 * np.pi * 420 * t) * np.exp(-t * 50)
    return s * vel * 0.5


def hat(vel=0.3, open_=False, seed=5):
    t = tt(0.3 if open_ else 0.08)
    n = np.random.default_rng(seed).normal(0, 1, len(t))
    return hp(n, 6200, 3) * np.exp(-t * (14 if open_ else 60)) * vel * 1.1


def shaker(vel=0.12, seed=6):
    t = tt(0.09)
    n = np.random.default_rng(seed).normal(0, 1, len(t))
    env = np.sin(np.pi * np.minimum(1, t / 0.09)) ** 2
    return bp(n, 4200, 9500) * env * vel * 2.0


def bell(freq, vel=0.25):
    t = tt(2.2)
    m = np.sin(2 * np.pi * freq * 3.5 * t) * (2.2 * np.exp(-t * 5))
    s = np.sin(2 * np.pi * freq * t + m) * np.exp(-t * 2.4)
    return s * np.minimum(1, t / 0.003) * vel


def pluck(freq, vel=0.22):
    t = tt(0.9)
    s = sum(np.sin(2 * np.pi * freq * k * t) * (0.6 ** (k - 1)) * np.exp(-t * (6 + k * 5)) for k in range(1, 5))
    return s * np.minimum(1, t / 0.002) * vel


def reverb(x, seconds=1.8, tau=0.42, seed=9, lowpass=5200):
    t = tt(seconds)
    rng = np.random.default_rng(seed)
    ir = rng.normal(0, 1, len(t)) * np.exp(-t / tau)
    ir = lp(ir, lowpass)
    ir[: int(0.012 * SR)] = 0  # pre-delay
    ir /= np.sqrt(np.sum(ir ** 2))
    return fftconvolve(x, ir)[: len(x)]


def sidechain(n, hits, depth=0.45, rel=7.0):
    t = np.arange(n) / SR
    g = np.ones(n)
    for h in hits:
        m = t >= h
        g[m] = np.minimum(g[m], 1 - depth * np.exp(-(t[m] - h) * rel))
    return g


def master(L, R, target_rms_db=-17.0):
    L, R = hp(L, 48), hp(R, 48)
    # gentle high shelf (~+3 dB above 3 kHz) for presence on phone speakers
    L, R = L + 0.42 * hp(L, 3000), R + 0.42 * hp(R, 3000)
    rms = np.sqrt(np.mean(np.concatenate([L, R]) ** 2))
    g = 10 ** (target_rms_db / 20) / max(rms, 1e-9)
    L, R = np.tanh(L * g * 1.1) / 1.1, np.tanh(R * g * 1.1) / 1.1
    peak = max(np.max(np.abs(L)), np.max(np.abs(R)))
    if peak > 0.89:
        L, R = L * 0.89 / peak, R * 0.89 / peak
    fade = int(0.6 * SR)
    ramp = np.linspace(1, 0, fade) ** 2
    L[-fade:] *= ramp
    R[-fade:] *= ramp
    return L, R


def write(name, L, R, grid):
    os.makedirs(OUT, exist_ok=True)
    wav = os.path.join(OUT, f"{name}.wav")
    pcm = (np.stack([L, R], axis=1) * 32767).astype(np.int16)
    import wave

    with wave.open(wav, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    mp3 = os.path.join(OUT, f"{name}.mp3")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-codec:a", "libmp3lame", "-b:a", "192k", mp3], check=True)
    os.remove(wav)
    with open(os.path.join(OUT, f"{name}.json"), "w") as f:
        json.dump(grid, f, indent=2)
    print(f"wrote music/{name}.mp3  ({grid['bpm']} BPM, beat {grid['beat']:.4f}s)")


# ------------------------------------------------------------------- beds
def bed(name, bpm, chords, bass_roots, style):
    beat = 60.0 / bpm
    bar = beat * 4
    n = int(LENGTH * SR)
    tr = {k: Track(n) for k in ("keys", "pad", "bass", "kick", "perc", "hat", "lead")}
    bars = int(LENGTH / bar) + 1
    kicks = []
    swing = beat * 0.06
    for b in range(bars):
        t0 = b * bar
        ch = chords[b % len(chords)]
        root = bass_roots[b % len(bass_roots)]
        if style == "warm":
            for note in ch:
                tr["keys"].add(ep(midi(note), beat * 1.6, 0.42), t0)
                tr["keys"].add(ep(midi(note), beat * 0.4, 0.22), t0 + beat * 1.5 + swing)
            tr["bass"].add(bass(midi(root), beat * 1.4), t0)
            tr["bass"].add(bass(midi(root), beat * 0.4, 0.7), t0 + beat * 2.5)
            tr["bass"].add(bass(midi(root + 12), beat * 0.35, 0.55), t0 + beat * 3.5)
            for k in (0, 2):
                tr["kick"].add(kick(0.9), t0 + k * beat)
                kicks.append(t0 + k * beat)
            tr["kick"].add(kick(0.45), t0 + 2.75 * beat)
            for k in (1, 3):
                tr["perc"].add(clap(0.5, seed=b * 7 + k), t0 + k * beat)
            for e in range(8):
                tr["hat"].add(hat(0.28 if e % 2 else 0.2, seed=b * 13 + e), t0 + e * beat / 2 + (swing if e % 2 else 0))
            if b % 2 == 1:
                arp = sorted(ch)[1:] + [sorted(ch)[1] + 12]
                for e in range(8):
                    tr["lead"].add(pluck(midi(arp[e % len(arp)] + 12), 0.16), t0 + e * beat / 2 + (swing if e % 2 else 0))
        elif style == "pulse":
            for k in range(4):
                tr["kick"].add(kick(0.85), t0 + k * beat)
                kicks.append(t0 + k * beat)
                tr["hat"].add(hat(0.32, open_=True, seed=b * 5 + k), t0 + k * beat + beat / 2)
            for k in (1, 3):
                tr["perc"].add(clap(0.42, seed=b * 3 + k), t0 + k * beat)
            for e in range(16):
                tr["hat"].add(shaker(0.1 if e % 2 else 0.06, seed=b * 17 + e), t0 + e * beat / 4)
            for e in range(8):
                tr["bass"].add(bass(midi(root + (12 if e % 2 else 0)), beat * 0.42, 0.75), t0 + e * beat / 2)
            for k in (0.5, 1.5, 2.5, 3.5):
                for note in ch:
                    tr["keys"].add(ep(midi(note), beat * 0.32, 0.26), t0 + k * beat)
            tr["pad"].add(sum(pad(midi(nn), bar * 0.98, 6, 0.32, seed=nn) for nn in ch), t0)
            arp = sorted(ch) + [sorted(ch)[0] + 12]
            for e in range(16):
                if e % 3 != 2:
                    tr["lead"].add(pluck(midi(arp[e % len(arp)] + 12), 0.12), t0 + e * beat / 4)
        elif style == "night":
            tr["pad"].add(sum(pad(midi(nn), bar * 0.99, 8, 0.5, seed=nn + b) for nn in ch), t0)
            tr["bass"].add(bass(midi(root), bar * 0.9, 0.85), t0)
            tr["kick"].add(kick(0.95), t0)
            tr["kick"].add(kick(0.7), t0 + 2.5 * beat)
            kicks += [t0, t0 + 2.5 * beat]
            tr["perc"].add(rim(0.55), t0 + 2 * beat)
            tr["perc"].add(clap(0.25, seed=b), t0 + 2 * beat)
            for e in range(16):
                tr["hat"].add(hat(0.16 if e % 4 == 2 else 0.08, seed=b * 19 + e), t0 + e * beat / 4)
            motif = [ch[-1] + 12, ch[-2] + 12, ch[-1] + 7, ch[-3] + 12]
            for e, off in enumerate((0.0, 0.75, 1.5, 3.0)):
                if (b + e) % 2 == 0:
                    tr["lead"].add(bell(midi(motif[e]), 0.13), t0 + off * beat)

    sc = sidechain(n, kicks, depth={"warm": 0.28, "pulse": 0.38, "night": 0.25}[style])
    music_bus = (tr["keys"].buf + tr["pad"].buf + tr["lead"].buf) * sc
    bass_bus = tr["bass"].buf * sc
    drums = tr["kick"].buf * 0.9 + tr["perc"].buf + tr["hat"].buf
    wet_src = tr["keys"].buf * 0.6 + tr["pad"].buf * 0.5 + tr["lead"].buf + tr["perc"].buf * 0.8
    wetL = reverb(wet_src, seed=11, tau=0.5 if style == "night" else 0.4)
    wetR = reverb(wet_src, seed=12, tau=0.5 if style == "night" else 0.4)
    # gentle stereo: keys slightly left, lead slightly right, hats spread
    L = music_bus * 0.9 + tr["lead"].buf * sc * -0.1 + bass_bus + drums + tr["hat"].buf * 0.15 + wetL * 0.28
    R = music_bus * 0.9 + tr["keys"].buf * sc * -0.1 + bass_bus + drums - tr["hat"].buf * 0.15 + wetR * 0.28
    L, R = lp(L, 14500), lp(R, 14500)
    L, R = master(L, R, -18.0 if style == "night" else -17.0)
    write(name, L, R, {"bpm": bpm, "beat": beat, "bar": bar, "length": LENGTH, "style": style})


if __name__ == "__main__":
    which = sys.argv[1:] or ["warm", "pulse", "night"]
    if "warm" in which:
        # Fmaj9 – Dm9 – Bbmaj7 – C6/9   (F major, laid-back)
        bed("bed-warm-100", 100, [[53, 57, 60, 64, 67], [50, 57, 60, 64, 65], [58, 62, 65, 69], [55, 60, 64, 69, 74]], [41, 38, 46, 48], "warm")
    if "pulse" in which:
        # Am9 – Fmaj7 – C – G6   (minor → major lift)
        bed("bed-pulse-108", 108, [[57, 60, 64, 67, 71], [53, 57, 60, 64], [55, 60, 64, 67], [55, 59, 62, 64]], [45, 41, 48, 43], "pulse")
    if "night" in which:
        # Dm9 – Bbmaj9 – Gm9 – A7sus4   (dark, minimal)
        bed("bed-night-92", 92, [[50, 53, 57, 60, 64], [46, 50, 53, 57, 60], [43, 46, 50, 53, 57], [45, 50, 52, 55, 59]], [38, 34, 31, 33], "night")
