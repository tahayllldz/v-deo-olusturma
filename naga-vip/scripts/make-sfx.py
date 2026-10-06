"""Synthesizes the promo's UI sound effects (no third-party samples needed).

    python scripts/make-sfx.py            # writes promo-video/public/sfx/*.wav

Sounds: click, key, swipe, whoosh, notify, confirm, ready, shimmer.
Design goal: soft, warm, premium — nothing harsh or "gamey".
"""
import os
import wave

import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "promo-video", "public", "sfx")
rng = np.random.default_rng(7)


def t(dur):
    return np.arange(int(SR * dur)) / SR


def bandpass_noise(n, lo, hi):
    """White noise band-limited in the frequency domain."""
    spec = np.fft.rfft(rng.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    mask = np.clip((f - lo) / (lo * 0.3 + 1), 0, 1) * np.clip((hi - f) / (hi * 0.3 + 1), 0, 1)
    out = np.fft.irfft(spec * mask, n)
    return out / (np.max(np.abs(out)) + 1e-9)


def lowpass(x, cutoff):
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    spec *= 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(spec, len(x))


def reverb(x, seconds=0.9, mix=0.22, tone=5000):
    n = int(SR * seconds)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * seconds / 6))
    ir = lowpass(ir, tone)
    ir /= np.sqrt(np.sum(ir ** 2))
    size = len(x) + n
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)
    dry = np.concatenate([x, np.zeros(n)])
    return (1 - mix) * dry + mix * wet


def bell(freq, dur, decay, partials=((1, 1.0), (2.0, 0.18), (2.76, 0.08), (4.07, 0.03))):
    tt = t(dur)
    env = np.minimum(1, tt / 0.004) * np.exp(-tt / decay)
    sig = sum(a * np.sin(2 * np.pi * freq * m * tt) * np.exp(-tt * (m - 1) * 3) for m, a in partials)
    return sig * env


def place(dst, src, at):
    i = int(at * SR)
    end = min(len(dst), i + len(src))
    dst[i:end] += src[: end - i]


def stereo(x, pan=0.0, width=0.0):
    """pan -1..1; width adds a tiny decorrelated delay for space."""
    left = x * np.sqrt((1 - pan) / 2)
    right = x * np.sqrt((1 + pan) / 2)
    if width:
        d = int(SR * 0.004 * width)
        right = np.concatenate([np.zeros(d), right[: len(right) - d]])
    return np.stack([left, right], axis=1)


def write(name, data, peak_db):
    if data.ndim == 1:
        data = stereo(data)
    fade = int(SR * 0.01)
    data[-fade:] *= np.linspace(1, 0, fade)[:, None]
    data = data / (np.max(np.abs(data)) + 1e-9) * (10 ** (peak_db / 20))
    pcm = (np.clip(data, -1, 1) * 32767).astype(np.int16)
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, f"{name}.wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"  {name}.wav  {len(data) / SR:.2f}s")


def click():
    tt = t(0.09)
    tick = bandpass_noise(len(tt), 2500, 7000) * np.exp(-tt / 0.004)
    body = np.sin(2 * np.pi * 1700 * tt) * np.exp(-tt / 0.012) * 0.6
    return reverb(tick * 0.7 + body, 0.25, 0.12)


def key():
    tt = t(0.07)
    tick = bandpass_noise(len(tt), 1500, 4500) * np.exp(-tt / 0.003)
    body = np.sin(2 * np.pi * 1150 * tt) * np.exp(-tt / 0.010) * 0.5
    return reverb(tick * 0.6 + body, 0.2, 0.1)


def sweep(dur, f0, f1, peak_at, pan_from, pan_to):
    """Filtered-noise whoosh: a band of noise whose center glides f0 -> f1."""
    n = int(SR * dur)
    tt = np.arange(n) / SR
    bands = np.geomspace(150, 9000, 28)
    centers = np.geomspace(f0, f1, n)
    out = np.zeros(n)
    for b in bands:
        layer = bandpass_noise(n, b * 0.85, b * 1.18)
        gain = np.exp(-((np.log(b) - np.log(centers)) ** 2) / (2 * 0.35 ** 2))
        out += layer * gain
    env = np.where(tt < peak_at, (tt / peak_at) ** 2, np.exp(-(tt - peak_at) / ((dur - peak_at) / 3.5)))
    out *= env
    pan = np.linspace(pan_from, pan_to, n)
    left = out * np.sqrt((1 - pan) / 2)
    right = out * np.sqrt((1 + pan) / 2)
    st = np.stack([left, right], axis=1)
    rev = np.stack([reverb(st[:, 0], 0.6, 0.2), reverb(st[:, 1], 0.6, 0.2)], axis=1)
    return rev


def notify():
    out = np.zeros(int(SR * 1.4))
    place(out, bell(880.0, 1.0, 0.32), 0.0)
    place(out, bell(1318.5, 1.1, 0.42), 0.11)
    return reverb(out, 1.1, 0.25)


def confirm():
    out = np.zeros(int(SR * 1.8))
    for i, f in enumerate([1046.5, 1318.5, 1568.0]):
        place(out, bell(f, 1.2, 0.45) * (0.8 + 0.1 * i), i * 0.075)
    tt = t(0.12)
    place(out, np.sin(2 * np.pi * 110 * tt) * np.exp(-tt / 0.04) * 0.5, 0.0)
    return reverb(out, 1.4, 0.28)


def ready():
    out = np.zeros(int(SR * 1.6))
    place(out, bell(783.99, 1.2, 0.4), 0.0)
    place(out, bell(1174.66, 1.3, 0.5), 0.09)
    place(out, bell(1567.98, 1.3, 0.5) * 0.6, 0.18)
    return reverb(out, 1.3, 0.28)


def shimmer():
    out = np.zeros(int(SR * 1.6))
    for i in range(16):
        f = 2600 * (2 ** (i / 12 * 0.9))
        place(out, bell(f, 0.5, 0.12, ((1, 1.0), (2, 0.1))) * (0.5 + 0.5 * np.sin(np.pi * i / 15)), i * 0.028)
    return reverb(out, 1.4, 0.35, tone=8000)


if __name__ == "__main__":
    print("Writing SFX to", os.path.abspath(OUT))
    write("click", click(), -10)
    write("key", key(), -14)
    write("swipe", sweep(0.45, 500, 2600, 0.16, -0.4, 0.4), -14)
    write("whoosh", sweep(0.75, 280, 3800, 0.32, -0.8, 0.8), -8)
    write("notify", notify(), -8)
    write("confirm", confirm(), -7)
    write("ready", ready(), -8)
    write("shimmer", shimmer(), -12)
