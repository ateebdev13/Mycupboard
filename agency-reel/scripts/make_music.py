"""Synthesises the reel's soundtrack: 26 s, 120 BPM, 48 kHz stereo.

No licensed track was available, so this builds an upbeat electronic bed from
scratch, locked to the edit: word hits in the intro, a drop at 2 s, whooshes and
crashes on every scene change, triplet stabs on "Web. Mobile. Product." and a
final hit under the end card. Replace public/audio/reel-beat.wav with a licensed
track for client delivery if preferred.
"""
import sys
import wave

import numpy as np

SR = 48000
DUR = 26.0
BPM = 120
BEAT = 60 / BPM
N = int(SR * DUR)
rng = np.random.default_rng(3)
out = np.zeros((2, N))

FPS = 30
SCENE_CUTS = [180, 330, 480, 630]  # frames, matches src/Reel.tsx
DROP = 60
BREAK = 690
FINAL = 720


def f2s(frame):
    return frame / FPS


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def filt(x, lo=None, hi=None, order=2):
    """Zero-phase FFT filter: lo = high-pass corner, hi = low-pass corner."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(x.size, 1 / SR)
    g = np.ones_like(f)
    if hi:
        g *= 1 / np.sqrt(1 + (f / hi) ** (2 * order))
    if lo:
        g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * order))
    return np.fft.irfft(X * g, x.size)


def add(sig, t0, gain=1.0, pan=0.0):
    i0 = int(t0 * SR)
    if i0 >= N:
        return
    n = min(sig.shape[-1], N - i0)
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    if sig.ndim == 1:
        out[0, i0:i0 + n] += sig[:n] * gain * l * 1.414
        out[1, i0:i0 + n] += sig[:n] * gain * r * 1.414
    else:
        out[:, i0:i0 + n] += sig[:, :n] * gain


def tt(sec):
    return np.arange(int(sec * SR)) / SR


def kick():
    t = tt(0.45)
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) + 0.3 * filt(rng.standard_normal(t.size), lo=2000) * np.exp(-t * 250)


def clap():
    t = tt(0.3)
    n = filt(rng.standard_normal(t.size), lo=900, hi=5000)
    env = np.exp(-t * 18)
    for d in (0.0, 0.011, 0.022):
        env += 0.6 * np.exp(-np.maximum(t - d, 0) * 120) * (t >= d)
    return n * env * 0.5


def hat(open_=False):
    t = tt(0.25 if open_ else 0.06)
    return filt(rng.standard_normal(t.size), lo=7000) * np.exp(-t * (14 if open_ else 70))


def saw(freq, t):
    return 2 * ((freq * t) % 1) - 1


def stab(notes, length=0.28):
    t = tt(length)
    s = sum(saw(hz(m) * d, t) for m in notes for d in (0.994, 1.0, 1.006))
    s = filt(s, hi=2600) * np.exp(-t * 9)
    return s / (3 * len(notes))


def bass(m, length):
    t = tt(length)
    s = filt(saw(hz(m), t) + 0.6 * np.sin(2 * np.pi * hz(m) * t), hi=380)
    return s * np.minimum(1, t * 200) * np.exp(-t * 2.2)


def whoosh(length=0.55):
    t = tt(length)
    n = rng.standard_normal(t.size)
    chunks = np.array_split(np.arange(t.size), 16)
    o = np.zeros(t.size)
    for k, idx in enumerate(chunks):
        c = 400 + (k / 15) ** 2 * 7000
        o[idx] = filt(n, lo=c * 0.5, hi=c * 1.8)[idx]
    env = np.sin(np.pi * t / length) ** 2 * (t / length)
    return o * env


def impact(length=2.4):
    t = tt(length)
    sub = np.sin(2 * np.pi * (38 + 40 * np.exp(-t * 6)) * t) * np.exp(-t * 1.6)
    crash = filt(rng.standard_normal(t.size), lo=3000) * np.exp(-t * 2.2) * 0.35
    return sub + crash


def riser(length):
    t = tt(length)
    n = rng.standard_normal(t.size)
    chunks = np.array_split(np.arange(t.size), 24)
    o = np.zeros(t.size)
    for k, idx in enumerate(chunks):
        c = 300 + (k / 23) ** 2 * 9000
        o[idx] = filt(n, lo=c * 0.6, hi=c * 1.6)[idx]
    tone = np.sin(2 * np.pi * np.cumsum(200 + 900 * (t / length) ** 2) / SR) * 0.2
    return (o + tone) * (t / length) ** 2


# Am – F – C – G, one bar (4 beats) each
CHORDS = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]]
ROOTS = [45, 41, 48, 43]

drop_t, break_t, final_t = f2s(DROP), f2s(BREAK), f2s(FINAL)

# Intro: a hit on each word (beats 0..3) + riser into the drop
for b in range(3):
    add(kick(), b * BEAT, 0.9)
    add(stab([57, 64, 69], 0.4), b * BEAT, 0.5)
add(impact(1.2), 3 * BEAT, 0.5)
add(riser(1.0), drop_t - 1.0, 0.35)

# Groove from the drop to the break
beat = drop_t
sidechain = np.ones(N)
while beat < break_t - 1e-6:
    b = round((beat - drop_t) / BEAT)
    bar = (b // 4) % 4
    add(kick(), beat, 1.0)
    i0 = int(beat * SR)
    n = min(int(0.22 * SR), N - i0)
    sidechain[i0:i0 + n] = np.minimum(sidechain[i0:i0 + n], 0.25 + 0.75 * (np.arange(n) / n) ** 0.6)
    if b % 2 == 1:
        add(clap(), beat, 0.55)
    for k in range(4):
        add(hat(), beat + k * BEAT / 4, 0.18 if k % 2 else 0.1, pan=0.3)
    add(hat(True), beat + BEAT / 2, 0.16, pan=-0.3)
    add(stab(CHORDS[bar]), beat + BEAT / 2, 0.42, pan=(-0.25 if b % 2 else 0.25))
    beat += BEAT

# Bass (eighths), ducked by the kick
bass_bus = np.zeros((2, N))
beat = drop_t
while beat < break_t - 1e-6:
    b = round((beat - drop_t) / BEAT)
    root = ROOTS[(b // 4) % 4]
    for k in range(2):
        s = bass(root + (12 if (b * 2 + k) % 4 == 3 else 0), BEAT / 2)
        i0 = int((beat + k * BEAT / 2) * SR)
        n = min(s.size, N - i0)
        bass_bus[:, i0:i0 + n] += s[:n] * 0.5
    beat += BEAT
out += bass_bus * sidechain

# Scene changes: whoosh into a crash on the cut
for c in SCENE_CUTS:
    add(whoosh(), f2s(c) - 0.5, 0.45)
    add(filt(rng.standard_normal(int(1.6 * SR)), lo=4000) * np.exp(-tt(1.6) * 2.5), f2s(c), 0.22)

# Break: triplet stabs on the three words, then the final hit
add(riser(0.9), break_t - 0.9, 0.25)
for k, notes in enumerate([[57, 64, 69], [60, 67, 72], [64, 69, 76]]):
    t0 = f2s(BREAK + k * 10)
    add(kick(), t0, 0.9)
    add(stab(notes, 0.3), t0, 0.6)
add(impact(), final_t, 0.8)
t_ring = tt(DUR - final_t)
ring = sum(np.sin(2 * np.pi * hz(m) * t_ring) for m in (45, 57, 64, 69, 72)) * np.exp(-t_ring * 0.9) * 0.08
add(ring, final_t, 1.0)

# Room reverb + master
ir_n = int(1.4 * SR)
ir_t = np.arange(ir_n) / SR
for ch in range(2):
    ir = rng.standard_normal(ir_n) * np.exp(-ir_t * 4.5)
    ir /= np.sqrt(np.sum(ir ** 2))
    wet = np.fft.irfft(np.fft.rfft(out[ch], N + ir_n) * np.fft.rfft(ir, N + ir_n))[:N]
    out[ch] = out[ch] + 0.18 * wet

t_all = np.arange(N) / SR
out *= np.clip(t_all / 0.02, 0, 1) * np.clip((DUR - t_all) / 0.8, 0, 1)
out = np.tanh(out / np.max(np.abs(out)) * 1.6) / np.tanh(1.6) * 0.89  # gentle saturation, ~-1 dBFS peak

path = sys.argv[1] if len(sys.argv) > 1 else 'public/audio/reel-beat.wav'
with wave.open(path, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(out.T, -1, 1) * 32767).astype('<i2').tobytes())
print('wrote', path)
