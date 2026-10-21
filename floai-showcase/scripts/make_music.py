"""Synthesises the subtle ambient bed used under the showcase (15 s, 48 kHz stereo).

No licensed audio asset was available, so the track is generated procedurally:
a warm detuned pad with a soft bell arpeggio, light reverb and gentle fades.
"""
import sys
import wave

import numpy as np

SR = 48000
DUR = 15.0
BPM = 96
rng = np.random.default_rng(7)
t = np.arange(int(SR * DUR)) / SR


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


# Fmaj9 -> Am7 -> Dm9 -> Bbmaj7(#11)->C   (3.75 s each)
CHORDS = [
    [41, 53, 57, 60, 64, 67],
    [45, 52, 55, 60, 64, 69],
    [38, 50, 53, 57, 60, 64],
    [46, 53, 57, 62, 65, 69],
]
SEG = DUR / len(CHORDS)

pad = np.zeros((2, t.size))
for ci, chord in enumerate(CHORDS):
    start, end = ci * SEG - 0.6, (ci + 1) * SEG + 0.6
    env = np.clip((t - start) / 1.2, 0, 1) * np.clip((end - t) / 1.2, 0, 1)
    env = np.sin(env * np.pi / 2) ** 2
    for n in chord:
        f = hz(n)
        amp = 0.05 if n < 48 else 0.032
        for ch, det in ((0, -0.11), (1, 0.13)):
            ph = rng.uniform(0, 2 * np.pi)
            v = np.sin(2 * np.pi * f * (1 + det / 100) * t + ph)
            v += 0.18 * np.sin(2 * np.pi * 2 * f * t + ph)  # soft second harmonic
            pad[ch] += amp * env * v

# Slow breathing movement on the pad
pad *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.12 * t)

# Soft bell arpeggio (eighth notes) that enters after the intro
bell = np.zeros((2, t.size))
step = 60 / BPM / 2
pattern = [0, 2, 3, 4, 3, 2, 1, 2]
k = 0
pos = 2.5
while pos < DUR - 1.2:
    chord = CHORDS[min(int(pos // SEG), len(CHORDS) - 1)]
    upper = sorted(chord)[2:]
    note = upper[pattern[k % len(pattern)] % len(upper)] + 12
    i0 = int(pos * SR)
    n = min(int(1.6 * SR), t.size - i0)
    tt = np.arange(n) / SR
    tone = np.sin(2 * np.pi * hz(note) * tt) + 0.25 * np.sin(2 * np.pi * hz(note) * 2.01 * tt)
    e = (1 - np.exp(-tt * 300)) * np.exp(-tt * 3.2)
    vel = 0.020 * (0.8 + 0.2 * rng.random())
    pan = 0.5 + 0.35 * np.sin(k * 0.9)
    bell[0, i0:i0 + n] += vel * (1 - pan) * tone * e
    bell[1, i0:i0 + n] += vel * pan * tone * e
    pos += step
    k += 1

mix = pad + bell

# Simple stereo convolution reverb
ir_len = int(2.2 * SR)
ir_t = np.arange(ir_len) / SR
for ch in range(2):
    ir = rng.standard_normal(ir_len) * np.exp(-ir_t * 2.6)
    ir[: int(0.012 * SR)] = 0
    ir /= np.sqrt(np.sum(ir ** 2))
    wet = np.fft.irfft(np.fft.rfft(mix[ch], t.size + ir_len) * np.fft.rfft(ir, t.size + ir_len))[: t.size]
    mix[ch] = 0.72 * mix[ch] + 0.28 * wet

fade = np.clip(t / 1.5, 0, 1) * np.clip((DUR - t) / 2.0, 0, 1)
mix *= fade
mix *= 0.5 / np.max(np.abs(mix))  # peak at -6 dBFS

out = sys.argv[1] if len(sys.argv) > 1 else "public/audio/ambient-pad.wav"
pcm = (np.clip(mix.T, -1, 1) * 32767).astype("<i2")
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", out)
