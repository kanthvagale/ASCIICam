"""Synthesizes the promo's background track from scratch, so there is nothing to license.

120 BPM chiptune-ish bed in A minor (Am F C G): pad + arp intro, drums and bass from
4 s, everything drops to an impact and a pad tail on the end card.

    python3 scripts/make-music.py <seconds> <end_card_at_seconds> <out.wav>
"""

import math
import random
import struct
import sys
import wave

SR = 44_100
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
DRUMS_AT = BAR * 2

# (voicing, bass root) per bar, MIDI notes.
CHORDS = [
    ((57, 60, 64), 33),  # Am
    ((57, 60, 65), 29),  # F/A
    ((55, 60, 64), 36),  # C/G
    ((55, 59, 62), 31),  # G
]


def hz(note):
    return 440.0 * 2 ** ((note - 69) / 12)


def lowpass_coeff(cutoff):
    return 1 - math.exp(-2 * math.pi * cutoff / SR)


def chord_at(t):
    return CHORDS[int(t // BAR) % len(CHORDS)]


def add(buf, start, samples, gain=1.0):
    i0 = int(start * SR)
    for i, s in enumerate(samples):
        j = i0 + i
        if 0 <= j < len(buf):
            buf[j] += s * gain


def kick():
    out, phase = [], 0.0
    for i in range(int(0.35 * SR)):
        t = i / SR
        phase += 2 * math.pi * (48 + 110 * math.exp(-t * 32)) / SR
        out.append(math.sin(phase) * math.exp(-t * 7.5))
    return out


def noise_hit(length, decay, highpass_passes, rng):
    out, prev = [], 0.0
    for i in range(int(length * SR)):
        x = rng.uniform(-1, 1)
        for _ in range(highpass_passes):
            x, prev = x - prev, x
        out.append(x * math.exp(-(i / SR) * decay))
    return out


def clap(rng):
    # Three quick bursts read as a clap rather than a single tick.
    body = noise_hit(0.22, 22, 1, rng)
    for offset in (0, int(0.011 * SR), int(0.022 * SR)):
        for i in range(min(int(0.01 * SR), len(body) - offset)):
            body[offset + i] *= 1.6
    return body


def pluck(freq, length, decay, cutoff, duty=0.5):
    out, phase, y = [], 0.0, 0.0
    a = lowpass_coeff(cutoff)
    for i in range(int(length * SR)):
        phase = (phase + freq / SR) % 1
        x = 1.0 if phase < duty else -1.0
        y += a * (x - y)
        out.append(y * math.exp(-(i / SR) * decay))
    return out


def bass_note(freq, length):
    out, phase, y = [], 0.0, 0.0
    a = lowpass_coeff(380)
    for i in range(int(length * SR)):
        t = i / SR
        phase = (phase + freq / SR) % 1
        y += a * ((2 * phase - 1) - y)
        env = min(1, t / 0.005) * (0.55 + 0.45 * math.exp(-t * 8)) * min(1, (length - t) / 0.02)
        out.append(y * env)
    return out


def pad(duration, end_at):
    out = [0.0] * int(duration * SR)
    phases = [0.0] * 6
    y = 0.0
    for i in range(len(out)):
        t = i / SR
        notes, _ = chord_at(min(t, end_at - 0.01))
        cutoff = 500 + 900 * min(1, t / DRUMS_AT)
        a = lowpass_coeff(cutoff)
        x = 0.0
        for k, note in enumerate(notes):
            for d, detune in enumerate((0.997, 1.003)):
                idx = k * 2 + d
                phases[idx] = (phases[idx] + hz(note) * detune / SR) % 1
                x += 2 * phases[idx] - 1
        y += a * (x / 6 - y)
        bar_pos = t % BAR
        swell = min(1, bar_pos / 0.25) if t < end_at else 1
        out[i] = y * swell
    return out


def main():
    duration, end_at, path = float(sys.argv[1]), float(sys.argv[2]), sys.argv[3]
    n = int(duration * SR)
    rng = random.Random(7)
    drums = [0.0] * n
    tonal = [0.0] * n

    k, c = kick(), clap(rng)
    hat = noise_hit(0.05, 70, 2, rng)

    t = 0.0
    step = BEAT / 4
    i = 0
    while t < end_at:
        bar_pos = i % 16
        notes, root = chord_at(t)
        if t >= DRUMS_AT:
            if bar_pos % 4 == 0:
                add(drums, t, k, 0.9)
            if bar_pos in (4, 12):
                add(drums, t, c, 0.2)
            if bar_pos % 4 == 2:
                add(drums, t, hat, 0.14)
            if bar_pos % 2 == 0:
                # Root on the beat, octave on the off-beat.
                add(tonal, t, bass_note(hz(root + (12 if bar_pos % 4 == 2 else 0)), step * 1.8), 0.32)
        tones = [notes[0], notes[1], notes[2], notes[0] + 12]
        pattern = [0, 1, 2, 3, 2, 1, 2, 3]
        intro = t < DRUMS_AT
        if not intro or bar_pos % 2 == 0:
            note = tones[pattern[i % len(pattern)]] + 12
            add(tonal, t, pluck(hz(note), 0.2, 16, 2600, 0.25), 0.11 if intro else 0.085)
        t += step
        i += 1

    # A noise swell into the drums, and an impact on the end card.
    riser_len = 1.6
    for j in range(int(riser_len * SR)):
        p = j / (riser_len * SR)
        add(drums, DRUMS_AT - riser_len + j / SR, [rng.uniform(-1, 1) * (p ** 3) * 0.12])
    add(drums, end_at, k, 1.0)
    add(drums, end_at, noise_hit(1.8, 2.6, 1, rng), 0.12)
    add(tonal, end_at, [math.sin(2 * math.pi * hz(33) * j / SR) * math.exp(-j / SR * 1.4) for j in range(int(2.5 * SR))], 0.35)

    pad_buf = pad(duration, end_at)
    delay = int(0.013 * SR)

    frames = bytearray()
    peak = 0.0
    mixed = []
    for j in range(n):
        t = j / SR
        fade = min(1, t / 0.05) * min(1, (duration - t) / 1.6)
        mid = drums[j] + tonal[j]
        left = mid + pad_buf[j] * 0.22
        right = mid + (pad_buf[j - delay] if j >= delay else 0) * 0.22
        left, right = math.tanh(left * 1.2) * fade, math.tanh(right * 1.2) * fade
        peak = max(peak, abs(left), abs(right))
        mixed.append((left, right))
    gain = 0.89 / peak if peak else 1
    for left, right in mixed:
        frames += struct.pack("<hh", int(left * gain * 32767), int(right * gain * 32767))

    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(bytes(frames))


if __name__ == "__main__":
    main()
